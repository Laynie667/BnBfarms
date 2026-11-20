// ==UserScript==
// @name         BnB Farm — The Farmhand's Dispensary
// @namespace    bnbfarm
// @version      0.24.0
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
  var __export = (target2, all) => {
    for (var name in all)
      __defProp(target2, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key2 of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key2) && key2 !== except)
          __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod2, isNodeMode, target2) => (target2 = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target2, "default", { value: mod2, enumerable: true }) : target2,
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
    made: "2026-11-18T06:17:25.015Z",
    res: 3,
    groups: {
      FarmInk: [
        {
          name: "KnotSlave",
          title: "Knot Slave",
          where: "lower belly or above the tail",
          desc: "blackletter, with a knot under it",
          sheet: 1,
          spot: "womb",
          left: 85,
          top: 434,
          w: 330,
          h: 189,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.78
        },
        {
          name: "BreedingSow",
          title: "Breeding Sow",
          where: "tramp stamp",
          desc: "flowing script on a curve, a heart and a snout",
          sheet: 1,
          spot: "hip",
          left: 96,
          top: 531,
          w: 216,
          h: 99,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "BreedingBitch",
          title: "Breeding Bitch",
          where: "thigh",
          desc: "drippin' graffiti, paw prints",
          sheet: 1,
          spot: "thigh",
          left: 118,
          top: 618,
          w: 180,
          h: 89,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.83
        },
        {
          name: "FoalFactory",
          title: "Foal Factory",
          where: "lower belly",
          desc: "western, a horseshoe for luck",
          sheet: 1,
          spot: "womb",
          left: 85,
          top: 461,
          w: 330,
          h: 135,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.78
        },
        {
          name: "PuppyFactory",
          title: "Puppy Factory",
          where: "lower belly",
          desc: "bubble graffiti, paw prints",
          sheet: 1,
          spot: "womb",
          left: 85,
          top: 463,
          w: 330,
          h: 131,
          layers: [
            {
              name: "White",
              color: "#fbfbfb",
              colorize: true
            },
            {
              name: "Grey",
              color: "#737177",
              colorize: true
            },
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              251,
              251,
              251
            ],
            [
              115,
              113,
              119
            ],
            [
              22,
              18,
              28
            ]
          ],
          k: 0.78
        },
        {
          name: "KittenFactory",
          title: "Kitten Factory",
          where: "lower belly",
          desc: "flowing script, a heart with ears",
          sheet: 1,
          spot: "womb",
          left: 85,
          top: 408,
          w: 330,
          h: 241,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.7
        },
        {
          name: "WombCrest",
          title: "Womb Crest",
          where: "over the womb",
          desc: "the lewd crest, glowin' pink",
          sheet: 1,
          spot: "womb",
          left: 85,
          top: 423,
          w: 330,
          h: 210,
          layers: [
            {
              name: "Ink",
              color: "#d4237a",
              colorize: true
            }
          ],
          pal: [
            [
              212,
              35,
              122
            ]
          ],
          k: 0.78
        },
        {
          name: "CumHere",
          title: "Cum Here",
          where: "lower belly, pointin' down",
          desc: "marker scrawl and an arrow",
          sheet: 1,
          spot: "womb",
          left: 85,
          top: 422,
          w: 330,
          h: 212,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.78
        },
        {
          name: "FreeUse",
          title: "Free Use",
          where: "tramp stamp",
          desc: "blackletter, with arrows",
          sheet: 1,
          spot: "hip",
          left: 96,
          top: 529,
          w: 216,
          h: 103,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "TentacleBred",
          title: "Tentacle Bred",
          where: "a hip or the belly",
          desc: "graffiti, with a curl of tentacle",
          sheet: 1,
          spot: "hip",
          left: 96,
          top: 517,
          w: 216,
          h: 127,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "WolfBredPackBitch",
          title: "Wolf Bred \xB7 Pack Bitch",
          where: "thigh",
          desc: "a wolf's paw and the pack's words",
          sheet: 1,
          spot: "thigh",
          left: 118,
          top: 584,
          w: 180,
          h: 157,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.83
        },
        {
          name: "QueenInHeat",
          title: "Queen In Heat",
          where: "lower back",
          desc: "a crown in flames",
          sheet: 1,
          spot: "hip",
          left: 96,
          top: 512,
          w: 216,
          h: 136,
          layers: [
            {
              name: "Red",
              color: "#b3122e",
              colorize: true
            },
            {
              name: "Ink",
              color: "#17121c",
              colorize: true
            }
          ],
          pal: [
            [
              179,
              18,
              46
            ],
            [
              23,
              18,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "TrapBait",
          title: "Trap Bait",
          where: "a calf or a shoulder",
          desc: "a warning label",
          sheet: 1,
          spot: "thigh",
          left: 118,
          top: 619,
          w: 180,
          h: 87,
          layers: [
            {
              name: "Gold",
              color: "#e8c21a",
              colorize: true
            },
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              232,
              194,
              26
            ],
            [
              22,
              18,
              28
            ]
          ],
          k: 0.83
        },
        {
          name: "MilkedAndBred",
          title: "Milked And Bred",
          where: "above a breast",
          desc: "a dairy-print badge",
          sheet: 1,
          spot: "chest",
          left: 106,
          top: 172,
          w: 288,
          h: 220,
          layers: [
            {
              name: "White",
              color: "#f4f3f4",
              colorize: true
            },
            {
              name: "Grey",
              color: "#89878c",
              colorize: true
            },
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              244,
              243,
              244
            ],
            [
              137,
              135,
              140
            ],
            [
              22,
              18,
              28
            ]
          ],
          k: 0.68
        },
        {
          name: "WombCrestSeeded",
          title: "Womb Crest, Seeded",
          where: "over the womb",
          desc: "the crest once you've taken: an egg in the heart",
          sheet: 2,
          spot: "womb",
          left: 85,
          top: 414,
          w: 330,
          h: 229,
          layers: [
            {
              name: "Ink",
              color: "#d4237a",
              colorize: true
            }
          ],
          pal: [
            [
              212,
              35,
              122
            ]
          ],
          k: 0.73
        },
        {
          name: "GoblinLoot",
          title: "Goblin Loot",
          where: "wherever they reached",
          desc: "crude stick-and-poke, daggers",
          sheet: 2,
          spot: "hip",
          left: 96,
          top: 494,
          w: 216,
          h: 173,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "SlutStickAndPoke",
          title: "Slut (stick-and-poke)",
          where: "a cheek or a wrist",
          desc: "little hand-poked dots",
          sheet: 2,
          spot: "cheek",
          left: 195,
          top: 169,
          w: 72,
          h: 28,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 1
        },
        {
          name: "MooCowPrint",
          title: "Moo (cow-print)",
          where: "a shoulder or a hip",
          desc: "inside a cow-print patch",
          sheet: 2,
          spot: "shoulder",
          left: 119,
          top: 259,
          w: 126,
          h: 83,
          layers: [
            {
              name: "White",
              color: "#ffffff",
              colorize: true
            },
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              255,
              255,
              255
            ],
            [
              22,
              18,
              28
            ]
          ],
          k: 0.86
        },
        {
          name: "UseMeFreshMarker",
          title: "Use Me (fresh marker)",
          where: "a thigh: wears off in a few hours",
          desc: "wet marker, still shiny",
          sheet: 2,
          spot: "thigh",
          left: 118,
          top: 641,
          w: 180,
          h: 42,
          layers: [
            {
              name: "Blue",
              color: "#63687e",
              colorize: true
            },
            {
              name: "Ink",
              color: "#151c3c",
              colorize: true
            }
          ],
          pal: [
            [
              99,
              104,
              126
            ],
            [
              21,
              28,
              60
            ]
          ],
          k: 0.83
        },
        {
          name: "GlowSlutGlowInk",
          title: "Glow Slut (glow ink)",
          where: "lower belly: only shows while you're dosed",
          desc: "UV ink, glowin'",
          sheet: 2,
          spot: "womb",
          left: 85,
          top: 449,
          w: 330,
          h: 159,
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
          ],
          k: 0.78
        },
        {
          name: "ForSize",
          title: "For Size",
          where: "an inner thigh",
          desc: "a ruler, inches, BIGGER at the top",
          sheet: 2,
          spot: "innerThigh",
          left: 158,
          top: 596,
          w: 144,
          h: 89,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.88
        },
        {
          name: "InsertHere",
          title: "Insert Here",
          where: "low on the belly or the small of the back",
          desc: "a bullseye and a slot",
          sheet: 2,
          spot: "womb",
          left: 85,
          top: 352,
          w: 330,
          h: 352,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.48
        },
        {
          name: "ThisWayToTheStable",
          title: "This Way To The Stable",
          where: "from the belly button down",
          desc: "hoof prints trailin' down",
          sheet: 2,
          spot: "belly",
          left: 112,
          top: 318,
          w: 276,
          h: 288,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.6
        },
        {
          name: "TheFullSign",
          title: "The Full Sign",
          where: "the small of the back",
          desc: "the whole sign: Farm \xB7 Dairy \xB7 Kennel",
          sheet: 3,
          spot: "hip",
          left: 100,
          top: 456,
          w: 209,
          h: 248,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.58
        },
        {
          name: "PropertyOfBB",
          title: "Property Of B&B",
          where: "a butt cheek",
          desc: "stencil words round the BB",
          sheet: 3,
          spot: "hip",
          left: 96,
          top: 497,
          w: 216,
          h: 166,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "GradeABreeder",
          title: "Grade A Breeder",
          where: "a hip or a flank",
          desc: "a purple inspection stamp",
          sheet: 3,
          spot: "hip",
          left: 96,
          top: 472,
          w: 216,
          h: 216,
          layers: [
            {
              name: "Stamp",
              color: "#5b2a86",
              colorize: true
            }
          ],
          k: 0.67
        },
        {
          name: "BBWombCrest",
          title: "B&B Womb Crest",
          where: "over the womb",
          desc: "the crest, with the BB in its heart",
          sheet: 3,
          spot: "womb",
          left: 85,
          top: 420,
          w: 330,
          h: 216,
          layers: [
            {
              name: "Ink",
              color: "#d4237a",
              colorize: true
            }
          ],
          pal: [
            [
              212,
              35,
              122
            ]
          ],
          k: 0.78
        },
        {
          name: "RingForService",
          title: "Ring For Service",
          where: "just above the slit",
          desc: "the bell, an arrow, an invitation",
          sheet: 3,
          spot: "womb",
          left: 85,
          top: 405,
          w: 330,
          h: 247,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.68
        },
        {
          name: "DrippingBB",
          title: "Dripping B&B",
          where: "a thigh or the belly",
          desc: "the BB so wet it runs, still shinin'",
          sheet: 3,
          spot: "thigh",
          left: 118,
          top: 573,
          w: 180,
          h: 178,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            },
            {
              name: "WetInk",
              color: "#ffffff",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.83
        },
        {
          name: "GoodGirlKennelBone",
          title: "Good Girl (kennel bone)",
          where: "a collarbone",
          desc: "the sign's bone, with praise in it",
          sheet: 3,
          spot: "chest",
          left: 106,
          top: 203,
          w: 288,
          h: 159,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.83
        },
        {
          name: "BreedingBitchKennelBone",
          title: "Breeding Bitch (kennel bone)",
          where: "a thigh",
          desc: "the bone, and the bell hung off it",
          sheet: 3,
          spot: "thigh",
          left: 118,
          top: 605,
          w: 180,
          h: 115,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.83
        },
        {
          name: "FarmFreshMilkCap",
          title: "Farm Fresh (milk cap)",
          where: "above a breast",
          desc: "a dairy bottle cap in dairy blue",
          sheet: 3,
          spot: "chest",
          left: 106,
          top: 138,
          w: 288,
          h: 288,
          layers: [
            {
              name: "Ink",
              color: "#1d3f8f",
              colorize: true
            }
          ],
          pal: [
            [
              29,
              63,
              143
            ]
          ],
          k: 0.52
        },
        {
          name: "BestInShowRosette",
          title: "Best In Show (rosette)",
          where: "a thigh",
          desc: "a prize ribbon from the county fair",
          sheet: 3,
          spot: "thigh",
          left: 125,
          top: 559,
          w: 167,
          h: 207,
          layers: [
            {
              name: "Gold",
              color: "#e8d29a",
              colorize: true
            },
            {
              name: "Blue",
              color: "#2a4fb5",
              colorize: true
            },
            {
              name: "Ink",
              color: "#18141e",
              colorize: true
            }
          ],
          pal: [
            [
              232,
              210,
              154
            ],
            [
              42,
              79,
              181
            ],
            [
              24,
              20,
              30
            ]
          ],
          k: 0.9
        },
        {
          name: "BreedMeTrampStamp",
          title: "Breed Me (tramp stamp)",
          where: "the small of the back",
          desc: "curls, hearts and the BB",
          sheet: 3,
          spot: "hip",
          left: 96,
          top: 534,
          w: 216,
          h: 92,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "SpankedAtBBPaddleWelt",
          title: "Spanked At B&B (paddle welt)",
          where: "a butt cheek: fades in a day",
          desc: "a paddle with BB cut through it",
          sheet: 3,
          spot: "hip",
          left: 96,
          top: 456,
          w: 216,
          h: 248,
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
          ],
          k: 0.58
        },
        {
          name: "TitsUp",
          title: "Tits Up",
          where: "the chest or a shoulder blade",
          desc: "our biggest cup out a porthole, a B seared on each",
          sheet: 3,
          spot: "chest",
          left: 110,
          top: 117,
          w: 281,
          h: 331,
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
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.45
        },
        {
          name: "ReBreed",
          title: "Re-Breed",
          where: "a hip or a flank",
          desc: "a red inspection stamp: didn't take, go again",
          sheet: 4,
          spot: "hip",
          left: 96,
          top: 511,
          w: 216,
          h: 139,
          layers: [
            {
              name: "Stamp",
              color: "#b3122e",
              colorize: true
            }
          ],
          k: 0.75
        },
        {
          name: "CareInstructions",
          title: "Care Instructions",
          where: "the hip, by the waistband",
          desc: "a laundry tag: how to treat her",
          sheet: 4,
          spot: "hip",
          left: 96,
          top: 492,
          w: 216,
          h: 176,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "ThisEndUp",
          title: "This End Up",
          where: "the small of the back",
          desc: "shipping arrows, handle roughly",
          sheet: 4,
          spot: "hip",
          left: 96,
          top: 496,
          w: 216,
          h: 169,
          layers: [
            {
              name: "Red",
              color: "#b3122e",
              colorize: true
            },
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              179,
              18,
              46
            ],
            [
              22,
              18,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "SlipperyWhenWet",
          title: "Slippery When Wet",
          where: "an inner thigh",
          desc: "a yellow wet-floor sign",
          sheet: 4,
          spot: "innerThigh",
          left: 158,
          top: 564,
          w: 144,
          h: 153,
          layers: [
            {
              name: "Gold",
              color: "#f2c230",
              colorize: true
            },
            {
              name: "Ink",
              color: "#18131c",
              colorize: true
            }
          ],
          pal: [
            [
              242,
              194,
              48
            ],
            [
              24,
              19,
              28
            ]
          ],
          k: 0.88
        },
        {
          name: "25PerRide",
          title: "25\xA2 Per Ride",
          where: "just above the crack",
          desc: "an arcade coin slot",
          sheet: 4,
          spot: "womb",
          left: 90,
          top: 339,
          w: 321,
          h: 379,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.44
        },
        {
          name: "OutOfOrder",
          title: "Out Of Order",
          where: "a butt cheek",
          desc: "a sign taped on: use the other hole",
          sheet: 4,
          spot: "hip",
          left: 96,
          top: 498,
          w: 216,
          h: 164,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "ScanToBreed",
          title: "Scan To Breed",
          where: "the back of a thigh",
          desc: "a made-up code: it scans as nothin'",
          sheet: 4,
          spot: "hip",
          left: 96,
          top: 489,
          w: 216,
          h: 182,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "PetCollar",
          title: "Pet (collar)",
          where: "round the neck",
          desc: "a collar inked on for good, a bone tag hangin'",
          sheet: 4,
          spot: "neck",
          left: 145,
          top: 188,
          w: 210,
          h: 104,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.66
        },
        {
          name: "MissingHerDignity",
          title: "Missing: Her Dignity",
          where: "a hip",
          desc: "a milk carton notice",
          sheet: 4,
          spot: "hip",
          left: 113,
          top: 456,
          w: 183,
          h: 248,
          layers: [
            {
              name: "Red",
              color: "#b3122e",
              colorize: true
            },
            {
              name: "Blue",
              color: "#1d3f8f",
              colorize: true
            },
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              179,
              18,
              46
            ],
            [
              29,
              63,
              143
            ],
            [
              22,
              18,
              28
            ]
          ],
          k: 0.58
        },
        {
          name: "FuckToyGraffiti",
          title: "Fuck Toy (graffiti)",
          where: "across the belly",
          desc: "a spray-painted tag, crown and drips",
          sheet: 4,
          spot: "belly",
          left: 112,
          top: 393,
          w: 276,
          h: 138,
          layers: [
            {
              name: "Pink",
              color: "#dc2188",
              colorize: true
            },
            {
              name: "Ink",
              color: "#1e1321",
              colorize: true
            }
          ],
          pal: [
            [
              220,
              33,
              136
            ],
            [
              30,
              19,
              33
            ]
          ],
          k: 0.76
        },
        {
          name: "BredMare",
          title: "Bred Mare",
          where: "a hip or a flank",
          desc: "a steel horseshoe, a yellow banner",
          sheet: 5,
          spot: "hip",
          left: 96,
          top: 516,
          w: 216,
          h: 128,
          layers: [
            {
              name: "Gold",
              color: "#dcae21",
              colorize: true
            },
            {
              name: "Blue",
              color: "#7b8fa6",
              colorize: true
            },
            {
              name: "Brown",
              color: "#5e4b1f",
              colorize: true
            },
            {
              name: "Ink",
              color: "#18141d",
              colorize: true
            }
          ],
          pal: [
            [
              220,
              174,
              33
            ],
            [
              123,
              143,
              166
            ],
            [
              94,
              75,
              31
            ],
            [
              24,
              20,
              29
            ]
          ],
          k: 0.75
        },
        {
          name: "BitchInHeat",
          title: "Bitch In Heat",
          where: "a hip or the small of the back",
          desc: "a paw print in flames",
          sheet: 5,
          spot: "hip",
          left: 96,
          top: 514,
          w: 216,
          h: 133,
          layers: [
            {
              name: "Gold",
              color: "#e5af21",
              colorize: true
            },
            {
              name: "Red",
              color: "#d7261f",
              colorize: true
            },
            {
              name: "Ink",
              color: "#1d151c",
              colorize: true
            }
          ],
          pal: [
            [
              229,
              175,
              33
            ],
            [
              215,
              38,
              31
            ],
            [
              29,
              21,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "CherryPopped",
          title: "Cherry Popped",
          where: "a hip",
          desc: "two cherries and a banner",
          sheet: 5,
          spot: "hip",
          left: 96,
          top: 494,
          w: 216,
          h: 173,
          layers: [
            {
              name: "Gold",
              color: "#ddaf21",
              colorize: true
            },
            {
              name: "Green",
              color: "#3d852d",
              colorize: true
            },
            {
              name: "Red",
              color: "#c7102e",
              colorize: true
            },
            {
              name: "Ink",
              color: "#18141c",
              colorize: true
            }
          ],
          pal: [
            [
              221,
              175,
              33
            ],
            [
              61,
              133,
              45
            ],
            [
              199,
              16,
              46
            ],
            [
              24,
              20,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "DrippingPeach",
          title: "Dripping Peach",
          where: "a butt cheek",
          desc: "a ripe peach, crease and all, drippin' white",
          sheet: 5,
          spot: "hip",
          left: 96,
          top: 471,
          w: 216,
          h: 218,
          layers: [
            {
              name: "Orange",
              color: "#f08f67",
              colorize: true
            },
            {
              name: "Red",
              color: "#e56757",
              colorize: true
            },
            {
              name: "Green",
              color: "#3e872e",
              colorize: true
            },
            {
              name: "Ink",
              color: "#18141d",
              colorize: true
            },
            {
              name: "WetInk",
              color: "#f7f2ea",
              colorize: true
            }
          ],
          pal: [
            [
              240,
              143,
              103
            ],
            [
              229,
              103,
              87
            ],
            [
              62,
              135,
              46
            ],
            [
              24,
              20,
              29
            ]
          ],
          k: 0.66
        },
        {
          name: "BredLikeARabbit",
          title: "Bred Like A Rabbit",
          where: "a hip or an ankle",
          desc: "a bunny with her ears up",
          sheet: 5,
          spot: "hip",
          left: 96,
          top: 509,
          w: 216,
          h: 143,
          layers: [
            {
              name: "Pink",
              color: "#edb8c7",
              colorize: true
            },
            {
              name: "Gold",
              color: "#ddb023",
              colorize: true
            },
            {
              name: "Ink",
              color: "#18131c",
              colorize: true
            }
          ],
          pal: [
            [
              237,
              184,
              199
            ],
            [
              221,
              176,
              35
            ],
            [
              24,
              19,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "LayingHen",
          title: "Laying Hen",
          where: "a hip",
          desc: "a nest of eggs, for the ovipositor girls",
          sheet: 5,
          spot: "hip",
          left: 96,
          top: 516,
          w: 216,
          h: 128,
          layers: [
            {
              name: "Teal",
              color: "#a9d6cf",
              colorize: true
            },
            {
              name: "Gold",
              color: "#dfb121",
              colorize: true
            },
            {
              name: "Brown",
              color: "#885a2a",
              colorize: true
            },
            {
              name: "Ink",
              color: "#18141c",
              colorize: true
            }
          ],
          pal: [
            [
              169,
              214,
              207
            ],
            [
              223,
              177,
              33
            ],
            [
              136,
              90,
              42
            ],
            [
              24,
              20,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "HelloMyNameIs",
          title: "Hello, My Name Is",
          where: "a breast or the belly",
          desc: "a name-tag sticker, filled in",
          sheet: 5,
          spot: "chest",
          left: 106,
          top: 186,
          w: 288,
          h: 192,
          layers: [
            {
              name: "Red",
              color: "#d42020",
              colorize: true
            },
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              212,
              32,
              32
            ],
            [
              22,
              18,
              28
            ]
          ],
          k: 0.78
        },
        {
          name: "PleaseDisturb",
          title: "Please Disturb",
          where: "a hip",
          desc: "a door hanger: breedin' in progress, walk right in",
          sheet: 5,
          spot: "hip",
          left: 116,
          top: 456,
          w: 176,
          h: 248,
          layers: [
            {
              name: "Red",
              color: "#d42020",
              colorize: true
            },
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              212,
              32,
              32
            ],
            [
              22,
              18,
              28
            ]
          ],
          k: 0.58
        },
        {
          name: "Sold",
          title: "Sold",
          where: "a butt cheek",
          desc: "a price tag on a string",
          sheet: 5,
          spot: "hip",
          left: 96,
          top: 524,
          w: 216,
          h: 113,
          layers: [
            {
              name: "Red",
              color: "#d42020",
              colorize: true
            },
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              212,
              32,
              32
            ],
            [
              22,
              18,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "TipYourCow",
          title: "Tip Your Cow",
          where: "just above the crack",
          desc: "a tip jar, half full",
          sheet: 5,
          spot: "womb",
          left: 132,
          top: 339,
          w: 236,
          h: 379,
          layers: [
            {
              name: "Gold",
              color: "#dfb43a",
              colorize: true
            },
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              223,
              180,
              58
            ],
            [
              22,
              18,
              28
            ]
          ],
          k: 0.44
        },
        {
          name: "StudParkingOnly",
          title: "Stud Parking Only",
          where: "the small of the back",
          desc: "a reserved sign: everyone else gets milked",
          sheet: 5,
          spot: "hip",
          left: 96,
          top: 477,
          w: 216,
          h: 207,
          layers: [
            {
              name: "Ink",
              color: "#1f4fa8",
              colorize: true
            }
          ],
          pal: [
            [
              31,
              79,
              168
            ]
          ],
          k: 0.7
        },
        {
          name: "FillMeDotwork",
          title: "Fill Me (dotwork)",
          where: "round the belly button",
          desc: "a mandala in tiny dots",
          sheet: 5,
          spot: "belly",
          left: 112,
          top: 312,
          w: 276,
          h: 300,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.58
        },
        {
          name: "HennaTrail",
          title: "Henna Trail",
          where: "down a thigh: fades in a week",
          desc: "mehndi vines and paisleys",
          sheet: 5,
          spot: "thigh",
          left: 55,
          top: 563,
          w: 306,
          h: 198,
          layers: [
            {
              name: "Ink",
              color: "#7a3410",
              colorize: true
            }
          ],
          pal: [
            [
              122,
              52,
              16
            ]
          ],
          k: 0.78
        },
        {
          name: "FertileWatercolour",
          title: "Fertile (watercolour)",
          where: "low on the belly",
          desc: "a fine-line womb in a wash of colour",
          sheet: 5,
          spot: "womb",
          left: 85,
          top: 420,
          w: 330,
          h: 217,
          layers: [
            {
              name: "Ink",
              color: "#1a1420",
              colorize: true
            }
          ],
          pal: [
            [
              26,
              20,
              32
            ]
          ],
          k: 0.77
        },
        {
          name: "GoodGirlFineLine",
          title: "good girl (fine line)",
          where: "a hip bone",
          desc: "tiny script and a tiny heart",
          sheet: 5,
          spot: "hip",
          left: 96,
          top: 545,
          w: 216,
          h: 70,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.75
        },
        {
          name: "MooTheHeart",
          title: "Moo (the heart)",
          where: "an upper arm",
          desc: "the classic MOM heart, for a cow",
          sheet: 6,
          spot: "shoulder",
          left: 119,
          top: 262,
          w: 126,
          h: 77,
          layers: [
            {
              name: "Gold",
              color: "#ddaf21",
              colorize: true
            },
            {
              name: "Red",
              color: "#c7102e",
              colorize: true
            },
            {
              name: "Ink",
              color: "#1f171d",
              colorize: true
            }
          ],
          pal: [
            [
              221,
              175,
              33
            ],
            [
              199,
              16,
              46
            ],
            [
              31,
              23,
              29
            ]
          ],
          k: 0.86
        },
        {
          name: "Swallows",
          title: "Swallows",
          where: "the chest",
          desc: "two swallows, for the girls who do",
          sheet: 6,
          spot: "chest",
          left: 106,
          top: 196,
          w: 288,
          h: 172,
          layers: [
            {
              name: "Gold",
              color: "#dcae21",
              colorize: true
            },
            {
              name: "Red",
              color: "#d8261f",
              colorize: true
            },
            {
              name: "Blue",
              color: "#2a5faf",
              colorize: true
            },
            {
              name: "Ink",
              color: "#17131d",
              colorize: true
            }
          ],
          pal: [
            [
              220,
              174,
              33
            ],
            [
              216,
              38,
              31
            ],
            [
              42,
              95,
              175
            ],
            [
              23,
              19,
              29
            ]
          ],
          k: 0.83
        },
        {
          name: "HoldStill",
          title: "Hold Still",
          where: "a forearm",
          desc: "the sailor's anchor, rope and all",
          sheet: 6,
          spot: "forearm",
          left: 120,
          top: 283,
          w: 120,
          h: 95,
          layers: [
            {
              name: "Gold",
              color: "#dfb122",
              colorize: true
            },
            {
              name: "Blue",
              color: "#7a8ea5",
              colorize: true
            },
            {
              name: "Brown",
              color: "#4e4535",
              colorize: true
            },
            {
              name: "Ink",
              color: "#18141e",
              colorize: true
            }
          ],
          pal: [
            [
              223,
              177,
              34
            ],
            [
              122,
              142,
              165
            ],
            [
              78,
              69,
              53
            ],
            [
              24,
              20,
              30
            ]
          ],
          k: 0.75
        },
        {
          name: "BrokenIn",
          title: "Broken In",
          where: "over the heart",
          desc: "a heart with a dagger through it",
          sheet: 6,
          spot: "heart",
          left: 201,
          top: 230,
          w: 162,
          h: 125,
          layers: [
            {
              name: "Grey",
              color: "#b9c7d6",
              colorize: true
            },
            {
              name: "Gold",
              color: "#e0b122",
              colorize: true
            },
            {
              name: "Red",
              color: "#c7102e",
              colorize: true
            },
            {
              name: "Ink",
              color: "#18131c",
              colorize: true
            }
          ],
          pal: [
            [
              185,
              199,
              214
            ],
            [
              224,
              177,
              34
            ],
            [
              199,
              16,
              46
            ],
            [
              24,
              19,
              28
            ]
          ],
          k: 0.74
        },
        {
          name: "RopeHarness",
          title: "Rope Harness",
          where: "the chest and belly",
          desc: "a shibari harness that never comes off",
          sheet: 6,
          spot: "chest",
          left: 34,
          top: 140,
          w: 432,
          h: 284,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.79
        },
        {
          name: "ChainBand",
          title: "Chain Band",
          where: "round a thigh",
          desc: "a chain inked round, a padlock hangin' off it",
          sheet: 6,
          spot: "thigh",
          left: 91,
          top: 614,
          w: 234,
          h: 97,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.83
        },
        {
          name: "Cuffs",
          title: "Cuffs",
          where: "wrists or ankles",
          desc: "leather cuffs inked on, D-ring and all",
          sheet: 6,
          spot: "wrist",
          left: 99,
          top: 321,
          w: 162,
          h: 59,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 1.04
        },
        {
          name: "UnzipForService",
          title: "Unzip For Service",
          where: "down the belly",
          desc: "a zipper inked down her front, half open",
          sheet: 6,
          spot: "belly",
          left: 85,
          top: 283,
          w: 331,
          h: 359,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.58
        },
        {
          name: "MaximumLoad",
          title: "Maximum Load",
          where: "the belly",
          desc: "an elevator plate: this cow has no limit",
          sheet: 6,
          spot: "belly",
          left: 112,
          top: 367,
          w: 276,
          h: 191,
          layers: [
            {
              name: "Grey",
              color: "#9aa3ad",
              colorize: true
            },
            {
              name: "Ink",
              color: "#17131d",
              colorize: true
            }
          ],
          pal: [
            [
              154,
              163,
              173
            ],
            [
              23,
              19,
              29
            ]
          ],
          k: 0.76
        },
        {
          name: "TearHere",
          title: "Tear Here",
          where: "on the panty line",
          desc: "a dotted line and scissors",
          sheet: 6,
          spot: "womb",
          left: 85,
          top: 471,
          w: 330,
          h: 115,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          k: 0.78
        },
        {
          name: "FreeRange",
          title: "Free Range",
          where: "a shoulder",
          desc: "a green farm-shop sticker",
          sheet: 6,
          spot: "shoulder",
          left: 119,
          top: 237,
          w: 126,
          h: 126,
          layers: [
            {
              name: "Ink",
              color: "#3f8a2e",
              colorize: true
            }
          ],
          pal: [
            [
              63,
              138,
              46
            ]
          ],
          k: 0.86
        },
        {
          name: "ThornedCrest",
          title: "Thorned Crest",
          where: "over the womb, glowin'",
          desc: "a rose in a heart, thorny vines",
          sheet: 7,
          spot: "womb",
          left: 85,
          top: 460,
          w: 330,
          h: 136,
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
          ],
          k: 0.78
        },
        {
          name: "ButterflyCrest",
          title: "Butterfly Crest",
          where: "over the womb, glowin'",
          desc: "wings and a chain of hearts",
          sheet: 7,
          spot: "womb",
          left: 85,
          top: 413,
          w: 330,
          h: 230,
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
          ],
          k: 0.73
        },
        {
          name: "SuccubusCrest",
          title: "Succubus Crest",
          where: "over the womb, glowin'",
          desc: "horns, bat wings, a spade tail",
          sheet: 7,
          spot: "womb",
          left: 85,
          top: 426,
          w: 330,
          h: 205,
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
          ],
          k: 0.78
        },
        {
          name: "TribalCrest",
          title: "Tribal Crest",
          where: "over the womb, glowin'",
          desc: "tribal blades round a heart",
          sheet: 7,
          spot: "womb",
          left: 85,
          top: 446,
          w: 330,
          h: 165,
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
          ],
          k: 0.78
        },
        {
          name: "EggLayerCrest",
          title: "Egg-Layer Crest",
          where: "over the womb, glows with eggs in",
          desc: "a heart and a chain of eggs",
          sheet: 7,
          spot: "womb",
          left: 85,
          top: 433,
          w: 330,
          h: 190,
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
          ],
          k: 0.78
        },
        {
          name: "FarmPropertyCorrupted",
          title: "Farm Property (corrupted)",
          where: "where the parasite chose",
          desc: "its own words, veins creepin' out",
          sheet: 7,
          spot: "hip",
          left: 96,
          top: 503,
          w: 216,
          h: 154,
          layers: [
            {
              name: "Ink",
              color: "#3a0d52",
              colorize: true
            }
          ],
          pal: [
            [
              58,
              13,
              82
            ]
          ],
          k: 0.75
        },
        {
          name: "RuinedStockCorrupted",
          title: "Ruined Stock (corrupted)",
          where: "a thigh",
          desc: "the corruption's own words",
          sheet: 7,
          spot: "thigh",
          left: 118,
          top: 576,
          w: 180,
          h: 172,
          layers: [
            {
              name: "Ink",
              color: "#3a0d52",
              colorize: true
            }
          ],
          pal: [
            [
              58,
              13,
              82
            ]
          ],
          k: 0.83
        },
        {
          name: "FarmAnimalCorrupted",
          title: "Farm Animal (corrupted)",
          where: "the belly",
          desc: "the corruption's own words",
          sheet: 7,
          spot: "belly",
          left: 112,
          top: 349,
          w: 276,
          h: 227,
          layers: [
            {
              name: "Ink",
              color: "#3a0d52",
              colorize: true
            }
          ],
          pal: [
            [
              58,
              13,
              82
            ]
          ],
          k: 0.76
        },
        {
          name: "BredCorrupted",
          title: "Bred (corrupted)",
          where: "low on the belly",
          desc: "one word, spreadin'",
          sheet: 7,
          spot: "womb",
          left: 85,
          top: 425,
          w: 330,
          h: 207,
          layers: [
            {
              name: "Ink",
              color: "#3a0d52",
              colorize: true
            }
          ],
          pal: [
            [
              58,
              13,
              82
            ]
          ],
          k: 0.78
        },
        {
          name: "LiveFarmProperty",
          title: "Farm Property (your number)",
          where: "neck or hip",
          sheet: 1,
          spot: "neck",
          left: 125,
          top: 179,
          w: 250,
          h: 123,
          box: [
            4,
            34,
            376,
            216
          ],
          s: 0.6731,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.66
        },
        {
          name: "LiveUsedByStrangers",
          title: "Used By Strangers (keeps count)",
          where: "inner thigh",
          sheet: 1,
          spot: "innerThigh",
          left: 146,
          top: 609,
          w: 165,
          h: 62,
          box: [
            0,
            41,
            380,
            184
          ],
          s: 0.435,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.91
        },
        {
          name: "LiveTimesBred",
          title: "Times Bred (keeps count)",
          where: "inner thigh",
          sheet: 2,
          spot: "innerThigh",
          left: 144,
          top: 595,
          w: 173,
          h: 89,
          box: [
            17,
            29,
            378,
            216
          ],
          s: 0.4784,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.88
        },
        {
          name: "LiveLitters",
          title: "Litters (keeps count)",
          where: "lower belly",
          sheet: 2,
          spot: "womb",
          left: 44,
          top: 410,
          w: 411,
          h: 235,
          box: [
            38,
            38,
            342,
            212
          ],
          s: 1.3525,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.78
        },
        {
          name: "LiveLitresMilked",
          title: "Litres Milked (keeps count)",
          where: "above a breast",
          sheet: 2,
          spot: "chest",
          left: 72,
          top: 222,
          w: 357,
          h: 120,
          box: [
            24,
            74,
            336,
            179
          ],
          s: 1.1429,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.83
        },
        {
          name: "LiveEggsLaid",
          title: "Eggs Laid (keeps count)",
          where: "a hip",
          sheet: 2,
          spot: "hip",
          left: 72,
          top: 532,
          w: 265,
          h: 96,
          box: [
            21,
            69,
            348,
            188
          ],
          s: 0.809,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.75
        },
        {
          name: "LiveDaysDenied",
          title: "Days Since Last Orgasm (keeps count)",
          where: "low belly",
          sheet: 2,
          spot: "womb",
          left: 53,
          top: 428,
          w: 393,
          h: 201,
          box: [
            4,
            30,
            376,
            220
          ],
          s: 1.0577,
          layers: [
            {
              name: "White",
              color: "#fdfdfd",
              colorize: true
            },
            {
              name: "Green",
              color: "#1f6b3a",
              colorize: true
            }
          ],
          pal: [
            [
              253,
              253,
              253
            ],
            [
              31,
              107,
              58
            ]
          ],
          live: true,
          k: 0.78
        },
        {
          name: "LiveOwnedBy",
          title: "Owned By (a name)",
          where: "a hip or above the heart",
          sheet: 2,
          spot: "hip",
          left: 67,
          top: 491,
          w: 273,
          h: 179,
          box: [
            49,
            37,
            335,
            224
          ],
          s: 0.9558,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.75
        },
        {
          name: "LiveStockNumber",
          title: "Stock Number (your number)",
          where: "back of the neck",
          sheet: 2,
          spot: "neck",
          left: 121,
          top: 165,
          w: 258,
          h: 150,
          box: [
            29,
            30,
            349,
            216
          ],
          s: 0.8077,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.66
        },
        {
          name: "LiveLocked",
          title: "Locked (keyholder's name)",
          where: "above the heart",
          sheet: 2,
          spot: "heart",
          left: 179,
          top: 228,
          w: 206,
          h: 129,
          box: [
            57,
            70,
            340,
            247
          ],
          s: 0.7265,
          layers: [
            {
              name: "White",
              color: "#fefefe",
              colorize: true
            },
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              254,
              254,
              254
            ],
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.74
        },
        {
          name: "LiveBredByBB",
          title: "Bred By B&B",
          where: "lower belly",
          sheet: 3,
          spot: "womb",
          left: 41,
          top: 373,
          w: 418,
          h: 311,
          box: [
            48,
            21,
            332,
            232
          ],
          s: 1.4732,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.6
        },
        {
          name: "LiveEarTag",
          title: "B&B Ear Tag (your number)",
          where: "a hip",
          sheet: 3,
          spot: "hip",
          left: 66,
          top: 464,
          w: 277,
          h: 232,
          box: [
            53,
            10,
            327,
            240
          ],
          s: 1.0093,
          layers: [
            {
              name: "Gold",
              color: "#e3b021",
              colorize: true
            },
            {
              name: "Ink",
              color: "#17131c",
              colorize: true
            }
          ],
          pal: [
            [
              227,
              176,
              33
            ],
            [
              23,
              19,
              28
            ]
          ],
          live: true,
          k: 0.68
        },
        {
          name: "LiveCumTank",
          title: "Cum Tank (how full you are)",
          where: "the belly",
          sheet: 4,
          spot: "belly",
          left: 76,
          top: 351,
          w: 348,
          h: 222,
          box: [
            45,
            34,
            335,
            219
          ],
          s: 1.2,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.76
        },
        {
          name: "LiveBreedingFacts",
          title: "Breeding Facts (keeps count)",
          where: "the small of the back",
          sheet: 4,
          spot: "hip",
          left: 66,
          top: 445,
          w: 276,
          h: 270,
          box: [
            62,
            0,
            318,
            250
          ],
          s: 1.08,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.58
        },
        {
          name: "LiveLoading",
          title: "Loading (how far along you are)",
          where: "the belly",
          sheet: 4,
          spot: "belly",
          left: 84,
          top: 375,
          w: 332,
          h: 174,
          box: [
            13,
            40,
            367,
            225
          ],
          s: 0.9388,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.76
        },
        {
          name: "LiveLipstickKisses",
          title: "Lipstick Kisses (signed)",
          where: "a butt cheek",
          sheet: 4,
          spot: "hip",
          left: 69,
          top: 489,
          w: 269,
          h: 182,
          box: [
            34,
            41,
            337,
            246
          ],
          s: 0.8889,
          layers: [
            {
              name: "Ink",
              color: "#c41e3a",
              colorize: true
            }
          ],
          pal: [
            [
              196,
              30,
              58
            ]
          ],
          live: true,
          k: 0.75
        },
        {
          name: "LiveWouldBreedAgain",
          title: "\u2605\u2605\u2605\u2605\u2605 Would Breed Again (signed)",
          where: "a thigh",
          sheet: 4,
          spot: "thigh",
          left: 101,
          top: 603,
          w: 214,
          h: 117,
          box: [
            2,
            20,
            378,
            226
          ],
          s: 0.5696,
          layers: [
            {
              name: "Gold",
              color: "#d8a300",
              colorize: true
            },
            {
              name: "Brown",
              color: "#75590e",
              colorize: true
            },
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              216,
              163,
              0
            ],
            [
              117,
              89,
              14
            ],
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.83
        },
        {
          name: "LiveGuestbook",
          title: "Bred By (a guestbook)",
          where: "an inner thigh",
          sheet: 5,
          spot: "innerThigh",
          left: 140,
          top: 567,
          w: 180,
          h: 146,
          box: [
            40,
            1,
            342,
            246
          ],
          s: 0.595,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.88
        },
        {
          name: "LiveBreedingCard",
          title: "Breeding Card (a punch a load)",
          where: "a butt cheek",
          sheet: 5,
          spot: "hip",
          left: 75,
          top: 503,
          w: 258,
          h: 154,
          box: [
            4,
            14,
            376,
            236
          ],
          s: 0.6923,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.75
        },
        {
          name: "LiveTrapPassport",
          title: "Trap Passport (a stamp a trap)",
          where: "a shoulder blade",
          sheet: 5,
          spot: "hip",
          left: 76,
          top: 501,
          w: 245,
          h: 158,
          box: [
            10,
            10,
            380,
            249
          ],
          s: 0.6626,
          layers: [
            {
              name: "Green",
              color: "#3f8a2e",
              colorize: true
            },
            {
              name: "Red",
              color: "#b3122e",
              colorize: true
            },
            {
              name: "Purple",
              color: "#5b2a86",
              colorize: true
            },
            {
              name: "Blue",
              color: "#1d3f8f",
              colorize: true
            }
          ],
          pal: [
            [
              63,
              138,
              46
            ],
            [
              179,
              18,
              46
            ],
            [
              91,
              42,
              134
            ],
            [
              29,
              63,
              143
            ]
          ],
          live: true,
          k: 0.79
        },
        {
          name: "LiveHighScores",
          title: "High Scores (who's bred you most)",
          where: "a thigh",
          sheet: 5,
          spot: "thigh",
          left: 100,
          top: 594,
          w: 217,
          h: 137,
          box: [
            13,
            17,
            366,
            240
          ],
          s: 0.6143,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.83
        },
        {
          name: "LiveTied",
          title: "Tied \xD7 (keeps count)",
          where: "a hip",
          sheet: 5,
          spot: "hip",
          left: 73,
          top: 507,
          w: 262,
          h: 146,
          box: [
            22,
            56,
            365,
            247
          ],
          s: 0.7633,
          layers: [
            {
              name: "Gold",
              color: "#deb021",
              colorize: true
            },
            {
              name: "Pink",
              color: "#d9577a",
              colorize: true
            },
            {
              name: "Ink",
              color: "#17121c",
              colorize: true
            }
          ],
          pal: [
            [
              222,
              176,
              33
            ],
            [
              217,
              87,
              122
            ],
            [
              23,
              18,
              28
            ]
          ],
          live: true,
          k: 0.75
        },
        {
          name: "LiveBredOn",
          title: "Bred On (a date stamp)",
          where: "a hip",
          sheet: 6,
          spot: "hip",
          left: 70,
          top: 498,
          w: 269,
          h: 163,
          box: [
            37,
            33,
            343,
            219
          ],
          s: 0.878,
          layers: [
            {
              name: "Stamp",
              color: "#1d3f8f",
              colorize: true
            }
          ],
          live: true,
          k: 0.75
        },
        {
          name: "LiveHeatCrest",
          title: "Heat Crest (fills as your heat rises)",
          where: "over the womb",
          sheet: 7,
          spot: "womb",
          left: 31,
          top: 345,
          w: 438,
          h: 366,
          box: [
            68,
            14,
            311,
            217
          ],
          s: 1.8033,
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
          ],
          live: true,
          k: 0.51
        },
        {
          name: "LiveWombMark",
          title: "Womb Mark (fills with every litter)",
          where: "over the womb",
          sheet: 7,
          spot: "womb",
          left: 51,
          top: 389,
          w: 398,
          h: 284,
          box: [
            15,
            0,
            365,
            250
          ],
          s: 1.1379,
          layers: [
            {
              name: "White",
              color: "#ffffff",
              colorize: true
            },
            {
              name: "Pink",
              color: "#ab2c7c",
              colorize: true
            },
            {
              name: "Ink",
              color: "#1e1423",
              colorize: true
            }
          ],
          pal: [
            [
              255,
              255,
              255
            ],
            [
              171,
              44,
              124
            ],
            [
              30,
              20,
              35
            ]
          ],
          live: true,
          k: 0.85
        },
        {
          name: "LiveWordsBlackletter",
          title: "Your Words: Blackletter",
          where: "low on the belly",
          sheet: 7,
          spot: "womb",
          left: 87,
          top: 498,
          w: 325,
          h: 60,
          box: [
            0,
            90,
            380,
            160
          ],
          s: 0.8561,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.94
        },
        {
          name: "LiveWordsScript",
          title: "Your Words: Script",
          where: "low on the belly",
          sheet: 7,
          spot: "womb",
          left: 83,
          top: 471,
          w: 330,
          h: 115,
          box: [
            4,
            56,
            380,
            187
          ],
          s: 0.8775,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 0.93
        },
        {
          name: "LiveWordsTypewriter",
          title: "Your Words: Typewriter",
          where: "low on the belly",
          sheet: 7,
          spot: "womb",
          left: 96,
          top: 489,
          w: 309,
          h: 78,
          box: [
            3,
            78,
            377,
            172
          ],
          s: 0.8255,
          layers: [
            {
              name: "Ink",
              color: "#16121c",
              colorize: true
            }
          ],
          pal: [
            [
              22,
              18,
              28
            ]
          ],
          live: true,
          k: 1
        },
        {
          name: "LiveWordsGraffiti",
          title: "Your Words: Graffiti",
          where: "low on the belly",
          sheet: 7,
          spot: "womb",
          left: 82,
          top: 464,
          w: 336,
          h: 127,
          box: [
            8,
            72,
            372,
            210
          ],
          s: 0.9237,
          layers: [
            {
              name: "Ink",
              color: "#1d3f8f",
              colorize: true
            }
          ],
          pal: [
            [
              29,
              63,
              143
            ]
          ],
          live: true,
          k: 0.92
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
          left: 118,
          top: 572,
          w: 180,
          h: 180,
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
          ],
          k: 0.83
        },
        {
          name: "MoonPawBrand",
          title: "Moon Paw Brand",
          where: "a hip, seared",
          desc: "a paw under a moon: the pack's",
          sheet: 2,
          spot: "hip",
          left: 96,
          top: 472,
          w: 216,
          h: 217,
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
          ],
          k: 0.66
        },
        {
          name: "SnoutRingBrand",
          title: "Snout Ring Brand",
          where: "a butt cheek, seared",
          desc: "a snout in a ring",
          sheet: 2,
          spot: "hip",
          left: 96,
          top: 472,
          w: 216,
          h: 216,
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
          ],
          k: 0.67
        },
        {
          name: "TheFarmsMark",
          title: "The Farm's Mark",
          where: "a hip or a butt cheek",
          desc: "the BB and its bell, seared in",
          sheet: 3,
          spot: "hip",
          left: 96,
          top: 466,
          w: 216,
          h: 229,
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
          ],
          k: 0.63
        },
        {
          name: "TheBarnsBrand",
          title: "The Barn's Brand",
          where: "a thigh, seared",
          desc: "a lucky horseshoe round the BB",
          sheet: 3,
          spot: "thigh",
          left: 118,
          top: 594,
          w: 180,
          h: 136,
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
          ],
          k: 0.83
        },
        {
          name: "TheKennelsBrand",
          title: "The Kennel's Brand",
          where: "a hip, seared",
          desc: "a bone in a ring, a paw cut through",
          sheet: 3,
          spot: "hip",
          left: 96,
          top: 472,
          w: 216,
          h: 216,
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
          ],
          k: 0.67
        },
        {
          name: "RockingBb",
          title: "Rocking Bb",
          where: "a flank, seared",
          desc: "a cattle brand: the BB on a rocker",
          sheet: 3,
          spot: "hip",
          left: 96,
          top: 500,
          w: 216,
          h: 161,
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
          ],
          k: 0.75
        },
        {
          name: "BreedingStock",
          title: "Breeding Stock",
          where: "across the ass, seared",
          desc: "iron letters in a frame",
          sheet: 3,
          spot: "hip",
          left: 96,
          top: 524,
          w: 216,
          h: 112,
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
          ],
          k: 0.75
        },
        {
          name: "FreeUse",
          title: "Free Use",
          where: "a butt cheek, seared",
          desc: "an oval brand: no need to ask",
          sheet: 4,
          spot: "hip",
          left: 96,
          top: 514,
          w: 216,
          h: 133,
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
          ],
          k: 0.75
        },
        {
          name: "CumHere",
          title: "Cum Here",
          where: "just above the slit, seared",
          desc: "the words and an arrow, burned in",
          sheet: 4,
          spot: "womb",
          left: 85,
          top: 417,
          w: 330,
          h: 223,
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
          ],
          k: 0.75
        },
        {
          name: "MilkMe",
          title: "Milk Me",
          where: "above a breast, seared",
          desc: "an udder in a ring",
          sheet: 4,
          spot: "chest",
          left: 106,
          top: 138,
          w: 288,
          h: 288,
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
          ],
          k: 0.52
        },
        {
          name: "StudService",
          title: "Stud Service",
          where: "a hip, seared",
          desc: "a knot in a ring, for the farm's studs",
          sheet: 4,
          spot: "hip",
          left: 96,
          top: 472,
          w: 216,
          h: 216,
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
          ],
          k: 0.67
        },
        {
          name: "TripleXBar",
          title: "Triple X Bar",
          where: "a flank, seared",
          desc: "a cattle brand: rated for the rough stuff",
          sheet: 4,
          spot: "hip",
          left: 96,
          top: 514,
          w: 216,
          h: 133,
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
          ],
          k: 0.75
        },
        {
          name: "Hucow",
          title: "Hucow",
          where: "a flank, seared",
          desc: "horns and a muzzle",
          sheet: 6,
          spot: "hip",
          left: 98,
          top: 456,
          w: 213,
          h: 248,
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
          ],
          k: 0.58
        },
        {
          name: "Mare",
          title: "Mare",
          where: "a flank, seared",
          desc: "a horseshoe; STALLION for studs",
          sheet: 6,
          spot: "hip",
          left: 98,
          top: 456,
          w: 213,
          h: 248,
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
          ],
          k: 0.58
        },
        {
          name: "Bitch",
          title: "Bitch",
          where: "a hip, seared",
          desc: "a paw; STUD DOG for studs",
          sheet: 6,
          spot: "hip",
          left: 98,
          top: 456,
          w: 213,
          h: 248,
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
          ],
          k: 0.58
        },
        {
          name: "Sow",
          title: "Sow",
          where: "a butt cheek, seared",
          desc: "a snout; BOAR for studs",
          sheet: 6,
          spot: "hip",
          left: 98,
          top: 456,
          w: 213,
          h: 248,
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
          ],
          k: 0.58
        },
        {
          name: "Vixen",
          title: "Vixen",
          where: "a hip, seared",
          desc: "a brush of a tail",
          sheet: 6,
          spot: "hip",
          left: 98,
          top: 456,
          w: 213,
          h: 248,
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
          ],
          k: 0.58
        },
        {
          name: "Bunny",
          title: "Bunny",
          where: "a hip, seared",
          desc: "ears up; BUCK for studs",
          sheet: 6,
          spot: "hip",
          left: 98,
          top: 456,
          w: 213,
          h: 248,
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
          ],
          k: 0.58
        },
        {
          name: "Kitten",
          title: "Kitten",
          where: "a hip, seared",
          desc: "ears and whiskers; TOM for studs",
          sheet: 6,
          spot: "hip",
          left: 98,
          top: 456,
          w: 213,
          h: 248,
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
          ],
          k: 0.58
        },
        {
          name: "Dragoness",
          title: "Dragoness",
          where: "a shoulder, seared",
          desc: "a wing",
          sheet: 6,
          spot: "shoulder",
          left: 120,
          top: 228,
          w: 124,
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
          ],
          k: 0.79
        },
        {
          name: "Nanny",
          title: "Nanny",
          where: "a flank, seared",
          desc: "horns and a beard; BILLY for studs",
          sheet: 7,
          spot: "hip",
          left: 98,
          top: 456,
          w: 213,
          h: 248,
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
          ],
          k: 0.58
        },
        {
          name: "Ewe",
          title: "Ewe",
          where: "a flank, seared",
          desc: "a curly fleece; RAM for studs",
          sheet: 7,
          spot: "hip",
          left: 98,
          top: 456,
          w: 213,
          h: 248,
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
          ],
          k: 0.58
        },
        {
          name: "SheWolf",
          title: "She-Wolf",
          where: "a hip, seared",
          desc: "ears up and a long muzzle",
          sheet: 7,
          spot: "hip",
          left: 98,
          top: 456,
          w: 213,
          h: 248,
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
          ],
          k: 0.58
        },
        {
          name: "Doe",
          title: "Doe",
          where: "a hip, seared",
          desc: "big soft ears and a spotted brow; BUCK for studs",
          sheet: 7,
          spot: "hip",
          left: 98,
          top: 456,
          w: 213,
          h: 248,
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
          ],
          k: 0.58
        },
        {
          name: "Rat",
          title: "Rat",
          where: "a shoulder, seared",
          desc: "round ears and a long tail",
          sheet: 7,
          spot: "shoulder",
          left: 120,
          top: 228,
          w: 124,
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
          ],
          k: 0.79
        },
        {
          name: "Goblins",
          title: "Goblin's",
          where: "a butt cheek, seared",
          desc: "a goblin's ear, earring and all: their plunder",
          sheet: 7,
          spot: "hip",
          left: 98,
          top: 456,
          w: 213,
          h: 248,
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
          ],
          k: 0.58
        }
      ]
    },
    spotsMoved: "Nov 18: hip 206,548 \u2192 204,580; cheek 226,180 \u2192 231,183"
  };

  // shared/ink/live-art.js
  var live_art_exports = {};
  __export(live_art_exports, {
    CH: () => CH,
    CW: () => CW,
    DRIPS: () => DRIPS,
    GRN: () => GRN,
    ICON: () => ICON,
    IMG: () => IMG,
    INK: () => INK,
    PINK: () => PINK,
    PINKGLOW: () => PINKGLOW,
    RED: () => RED,
    RED2: () => RED2,
    YEL: () => YEL,
    YEL2: () => YEL2,
    arcText: () => arcText,
    arcTextLow: () => arcTextLow,
    arrowDown: () => arrowDown,
    banner: () => banner,
    barcode: () => barcode,
    bigS: () => bigS,
    blossom: () => blossom,
    boneOutline: () => boneOutline,
    boneShape: () => boneShape,
    canine: () => canine,
    care: () => care,
    corrupted: () => corrupted,
    cowSpots: () => cowSpots,
    crop: () => crop,
    crown: () => crown,
    cut: () => cut,
    daggers: () => daggers,
    dripFrom: () => dripFrom,
    drips: () => drips,
    drop: () => drop,
    earTag: () => earTag,
    egg: () => egg,
    flame: () => flame,
    flash: () => flash,
    flourish: () => flourish,
    glow: () => glow,
    heart: () => heart,
    hoof: () => hoof,
    horseshoe: () => horseshoe,
    jug: () => jug,
    key: () => key,
    knotBulb: () => knotBulb,
    leaf: () => leaf,
    lips: () => lips,
    loadImg: () => loadImg,
    loadLogo: () => loadLogo,
    logo: () => logo,
    ownSide: () => ownSide,
    ownWords: () => ownWords,
    padlock: () => padlock,
    paisley: () => paisley,
    paw: () => paw,
    pigRing: () => pigRing,
    poked: () => poked,
    qr: () => qr,
    rng: () => rng,
    rope: () => rope,
    rosette: () => rosette,
    scar: () => scar,
    setFontOf: () => setFontOf,
    shield: () => shield,
    snout: () => snout,
    speciesBrand: () => speciesBrand,
    speckle: () => speckle,
    stamp: () => stamp,
    star: () => star,
    swallow: () => swallow,
    tally: () => tally,
    target: () => target,
    tentacle: () => tentacle,
    text: () => text,
    tie: () => tie,
    titArc: () => titArc,
    titPath: () => titPath,
    titPt: () => titPt,
    upArrow: () => upArrow,
    veins: () => veins,
    welt: () => welt,
    wolfMark: () => wolfMark,
    wombCrest: () => wombCrest
  });
  var LOGO_HOST = "https://raw.githubusercontent.com/Laynie667/BnBfarms/main/shared/brand/";
  var FONT_OF = (f) => "'" + f + "'";
  function setFontOf(fn) {
    FONT_OF = fn;
  }
  var fontOf = (f) => FONT_OF(f);
  var INK = "#16121c";
  var PINK = "#d4237a";
  var RED = "#b3122e";
  var CW = 380;
  var CH = 250;
  function rng(seed) {
    let s = seed >>> 0;
    return () => ((s = Math.imul(s ^ s >>> 15, 2246822507) ^ Math.imul(s ^ s >>> 13, 3266489909)) >>> 0) / 4294967295;
  }
  function heart(g, x, y, s) {
    g.beginPath();
    g.moveTo(x, y + s * 0.35);
    g.bezierCurveTo(x - s, y - s * 0.4, x - s * 0.45, y - s * 1.05, x, y - s * 0.45);
    g.bezierCurveTo(x + s * 0.45, y - s * 1.05, x + s, y - s * 0.4, x, y + s * 0.35);
    g.closePath();
  }
  function paw(g, x, y, s) {
    g.beginPath();
    g.ellipse(x, y + s * 0.25, s * 0.42, s * 0.34, 0, 0, Math.PI * 2);
    g.fill();
    for (const [dx, dy] of [[-0.48, -0.28], [-0.17, -0.55], [0.17, -0.55], [0.48, -0.28]]) {
      g.beginPath();
      g.ellipse(x + dx * s, y + dy * s, s * 0.15, s * 0.19, dx * 0.6, 0, Math.PI * 2);
      g.fill();
    }
  }
  function hoof(g, x, y, s) {
    g.beginPath();
    g.ellipse(x - s * 0.22, y, s * 0.2, s * 0.36, -0.15, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.ellipse(x + s * 0.22, y, s * 0.2, s * 0.36, 0.15, 0, Math.PI * 2);
    g.fill();
  }
  function horseshoe(g, x, y, s) {
    const r = s * 0.55;
    g.lineWidth = s * 0.24;
    g.lineCap = "butt";
    g.beginPath();
    g.arc(x, y, r, -Math.PI * 0.1, Math.PI * 1.1, false);
    g.stroke();
    const fs = g.fillStyle;
    g.fillStyle = "#fff";
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI * 0.02 + i * (Math.PI * 1.04 / 5);
      g.beginPath();
      g.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, s * 0.04, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = fs;
  }
  function arrowDown(g, x, y, len, w) {
    g.lineWidth = w;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x, y + len);
    g.stroke();
    g.beginPath();
    g.moveTo(x - w * 2.6, y + len - w * 2.6);
    g.lineTo(x, y + len + w * 0.8);
    g.lineTo(x + w * 2.6, y + len - w * 2.6);
    g.stroke();
  }
  function tally(g, x, y, n, h2) {
    g.lineWidth = 3.2;
    g.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const grp = Math.floor(i / 5), k = i % 5, gx = x + grp * (h2 * 0.95);
      if (k < 4) {
        g.beginPath();
        g.moveTo(gx + k * h2 * 0.17, y);
        g.lineTo(gx + k * h2 * 0.17 + 2, y + h2);
        g.stroke();
      } else {
        g.beginPath();
        g.moveTo(gx - h2 * 0.08, y + h2 * 0.85);
        g.lineTo(gx + h2 * 0.62, y + h2 * 0.12);
        g.stroke();
      }
    }
  }
  function barcode(g, x, y, w, h2, seed) {
    const r = rng(seed);
    let cx = x;
    while (cx < x + w) {
      const bw = 1 + Math.floor(r() * 4);
      if (r() > 0.35) g.fillRect(cx, y, bw, h2);
      cx += bw + 1;
    }
  }
  function crown(g, x, y, s) {
    g.beginPath();
    g.moveTo(x - s, y);
    g.lineTo(x - s, y - s * 0.6);
    g.lineTo(x - s * 0.5, y - s * 0.2);
    g.lineTo(x, y - s * 0.85);
    g.lineTo(x + s * 0.5, y - s * 0.2);
    g.lineTo(x + s, y - s * 0.6);
    g.lineTo(x + s, y);
    g.closePath();
    g.fill();
  }
  function flame(g, x, y, s) {
    g.beginPath();
    g.moveTo(x, y);
    g.bezierCurveTo(x - s * 0.6, y - s * 0.3, x - s * 0.2, y - s * 0.7, x, y - s * 1.2);
    g.bezierCurveTo(x + s * 0.15, y - s * 0.7, x + s * 0.65, y - s * 0.5, x, y);
    g.fill();
  }
  function tentacle(g, x, y, s, dir) {
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60, a = t * Math.PI * 1.6;
      pts.push([x + dir * (s * 1.1 * t + Math.sin(a) * s * 0.18 * t), y - s * 0.95 * t + Math.cos(a * 1.4) * s * 0.1 * t, s * 0.16 * (1 - t) + 2]);
    }
    const fs = g.fillStyle;
    for (const [px, py, r] of pts) {
      g.beginPath();
      g.arc(px, py, r, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = "#fff";
    for (let i = 4; i < 44; i += 6) {
      const [px, py, r] = pts[i];
      g.beginPath();
      g.arc(px + dir * r * 0.15, py + r * 0.55, r * 0.32, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = fs;
  }
  function knotBulb(g, x, y, w, h2) {
    const L = x - w, R = x + w;
    g.beginPath();
    g.moveTo(L, y - h2 * 0.32);
    g.lineTo(L + w * 0.35, y - h2 * 0.32);
    g.bezierCurveTo(L + w * 0.42, y - h2 * 1.1, L + w * 0.9, y - h2 * 1.1, L + w * 0.95, y - h2 * 0.4);
    g.lineTo(R - w * 0.25, y - h2 * 0.34);
    g.quadraticCurveTo(R, y - h2 * 0.3, R + h2 * 0.2, y);
    g.quadraticCurveTo(R, y + h2 * 0.3, R - w * 0.25, y + h2 * 0.34);
    g.lineTo(L + w * 0.95, y + h2 * 0.4);
    g.bezierCurveTo(L + w * 0.9, y + h2 * 1.1, L + w * 0.42, y + h2 * 1.1, L + w * 0.35, y + h2 * 0.32);
    g.lineTo(L, y + h2 * 0.32);
    g.closePath();
    g.fill();
  }
  function wombCrest(g, x, y, s, col) {
    g.strokeStyle = col;
    g.fillStyle = col;
    g.lineCap = "round";
    g.lineJoin = "round";
    g.lineWidth = s * 0.06;
    heart(g, x, y, s * 0.42);
    g.stroke();
    g.lineWidth = s * 0.035;
    heart(g, x, y + s * 0.02, s * 0.26);
    g.stroke();
    for (const d of [-1, 1]) {
      g.lineWidth = s * 0.05;
      g.beginPath();
      g.moveTo(x + d * s * 0.3, y - s * 0.12);
      g.bezierCurveTo(x + d * s * 0.75, y - s * 0.38, x + d * s * 1.05, y - s * 0.05, x + d * s * 0.92, y + s * 0.18);
      g.bezierCurveTo(x + d * s * 0.85, y + s * 0.3, x + d * s * 0.68, y + s * 0.28, x + d * s * 0.7, y + s * 0.15);
      g.stroke();
      g.lineWidth = s * 0.03;
      g.beginPath();
      g.moveTo(x + d * s * 0.36, y + s * 0.12);
      g.quadraticCurveTo(x + d * s * 0.7, y + s * 0.42, x + d * s * 1.12, y + s * 0.22);
      g.stroke();
      g.beginPath();
      g.arc(x + d * s * 1.15, y + s * 0.2, s * 0.04, 0, Math.PI * 2);
      g.fill();
    }
    g.lineWidth = s * 0.035;
    arrowDown(g, x, y + s * 0.42, s * 0.28, s * 0.035);
    for (let i = 0; i < 3; i++) {
      g.beginPath();
      g.arc(x, y - s * 0.62 - i * s * 0.1, s * (0.03 - i * 7e-3), 0, Math.PI * 2);
      g.fill();
    }
  }
  function arcText(g, t, cx, textY, R, font, size) {
    g.font = size + "px " + fontOf(font);
    g.textAlign = "center";
    g.textBaseline = "middle";
    const span = g.measureText(t).width / R, cy = textY + R;
    let a = -Math.PI / 2 - span / 2;
    for (const ch of t) {
      const da = g.measureText(ch).width / R, mid = a + da / 2;
      g.save();
      g.translate(cx + Math.cos(mid) * R, cy + Math.sin(mid) * R);
      g.rotate(mid + Math.PI / 2);
      g.fillText(ch, 0, 0);
      g.restore();
      a += da;
    }
  }
  function snout(g, x, y, s) {
    g.lineWidth = s * 0.12;
    g.beginPath();
    g.ellipse(x, y, s, s * 0.72, 0, 0, Math.PI * 2);
    g.stroke();
    g.beginPath();
    g.ellipse(x - s * 0.33, y, s * 0.16, s * 0.26, 0, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.ellipse(x + s * 0.33, y, s * 0.16, s * 0.26, 0, 0, Math.PI * 2);
    g.fill();
  }
  function text(g, t, x, y, font, size, opt) {
    opt = opt || {};
    g.font = (opt.weight || "") + " " + size + "px " + fontOf(font);
    g.textAlign = opt.align || "center";
    g.textBaseline = "middle";
    let s = size;
    while (opt.max && g.measureText(t).width > opt.max && s > 10) {
      s -= 2;
      g.font = (opt.weight || "") + " " + s + "px " + fontOf(font);
    }
    if (opt.stroke) {
      g.lineWidth = opt.stroke;
      g.strokeStyle = opt.strokeColor || INK;
      g.lineJoin = "round";
      g.strokeText(t, x, y);
    }
    g.fillText(t, x, y);
    return s;
  }
  function drips(g, x0, x1, y, seed, n) {
    const r = rng(seed);
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * (x1 - x0), len = 6 + r() * 22;
      g.lineWidth = 2 + r() * 2.5;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x, y + len);
      g.stroke();
      g.beginPath();
      g.arc(x, y + len, g.lineWidth * 0.7, 0, Math.PI * 2);
      g.fill();
    }
  }
  function scar(g, ink, x0, y0) {
    const w = ink.width, h2 = ink.height, tint = (col, blur, dx, dy, a) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h2;
      const cg = c.getContext("2d");
      cg.filter = blur ? "blur(" + blur + "px)" : "none";
      cg.drawImage(ink, 0, 0);
      cg.filter = "none";
      cg.globalCompositeOperation = "source-in";
      cg.fillStyle = col;
      cg.fillRect(0, 0, w, h2);
      g.globalAlpha = a;
      g.drawImage(c, x0 + dx, y0 + dy);
      g.globalAlpha = 1;
    };
    tint("#5e1414", 3, 0, 1, 0.75);
    tint("#b4524a", 0.6, 0, 0, 0.95);
    tint("#f2b9a8", 0.8, -1, -1.4, 0.45);
  }
  function glow(g, ink, x0, y0, col) {
    const c = document.createElement("canvas");
    c.width = ink.width;
    c.height = ink.height;
    const cg = c.getContext("2d");
    cg.drawImage(ink, 0, 0);
    cg.globalCompositeOperation = "source-in";
    cg.fillStyle = col;
    cg.fillRect(0, 0, c.width, c.height);
    g.save();
    g.shadowColor = col;
    g.shadowBlur = 18;
    g.drawImage(c, x0, y0);
    g.shadowBlur = 8;
    g.drawImage(c, x0, y0);
    g.restore();
  }
  function poked(g, t, x, y, font, size, seed) {
    const c = document.createElement("canvas");
    c.width = 380;
    c.height = 250;
    const cg = c.getContext("2d");
    cg.fillStyle = "#000";
    text(cg, t, x, y, font, size, { max: 340 });
    const d = cg.getImageData(0, 0, c.width, c.height).data, r = rng(seed);
    for (let yy = 0; yy < c.height; yy += 3) for (let xx = 0; xx < c.width; xx += 3) if (d[(yy * c.width + xx) * 4 + 3] > 120 && r() > 0.15) {
      g.beginPath();
      g.arc(xx + (r() - 0.5) * 1.6, yy + (r() - 0.5) * 1.6, 1.3 + r() * 0.6, 0, Math.PI * 2);
      g.fill();
    }
  }
  function cowSpots(g, x, y, w, h2, seed) {
    const r = rng(seed);
    for (let i = 0; i < 7; i++) {
      g.beginPath();
      const cx = x + r() * w, cy = y + r() * h2, rr = 10 + r() * 20;
      for (let k = 0; k <= 12; k++) {
        const a = k / 12 * Math.PI * 2, q = rr * (0.7 + r() * 0.5);
        if (k) g.lineTo(cx + Math.cos(a) * q, cy + Math.sin(a) * q);
        else g.moveTo(cx + Math.cos(a) * q, cy + Math.sin(a) * q);
      }
      g.closePath();
      g.fill();
    }
  }
  function egg(g, x, y, s) {
    g.beginPath();
    g.ellipse(x, y, s * 0.36, s * 0.48, 0, 0, Math.PI * 2);
    g.fill();
  }
  function jug(g, x, y, s) {
    g.beginPath();
    g.moveTo(x - s * 0.3, y - s * 0.55);
    g.lineTo(x + s * 0.3, y - s * 0.55);
    g.lineTo(x + s * 0.32, y - s * 0.35);
    g.quadraticCurveTo(x + s * 0.55, y - s * 0.1, x + s * 0.5, y + s * 0.5);
    g.lineTo(x - s * 0.5, y + s * 0.5);
    g.quadraticCurveTo(x - s * 0.55, y - s * 0.1, x - s * 0.32, y - s * 0.35);
    g.closePath();
    g.fill();
  }
  function padlock(g, x, y, s) {
    g.lineWidth = s * 0.14;
    g.beginPath();
    g.arc(x, y - s * 0.25, s * 0.32, Math.PI, 0);
    g.stroke();
    heart(g, x, y + s * 0.38, s * 0.62);
    g.fill();
    const fs = g.fillStyle;
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(x, y + s * 0.18, s * 0.08, 0, Math.PI * 2);
    g.fill();
    g.fillRect(x - s * 0.03, y + s * 0.2, s * 0.06, s * 0.18);
    g.fillStyle = fs;
  }
  function key(g, x, y, s) {
    g.lineWidth = s * 0.1;
    g.beginPath();
    g.arc(x, y, s * 0.22, 0, Math.PI * 2);
    g.stroke();
    g.beginPath();
    g.moveTo(x + s * 0.22, y);
    g.lineTo(x + s * 0.95, y);
    g.lineTo(x + s * 0.95, y + s * 0.18);
    g.moveTo(x + s * 0.75, y);
    g.lineTo(x + s * 0.75, y + s * 0.14);
    g.stroke();
  }
  function target(g, x, y, s) {
    g.lineWidth = s * 0.07;
    for (const k of [1, 0.68, 0.36]) {
      g.beginPath();
      g.arc(x, y, s * k, 0, Math.PI * 2);
      g.stroke();
    }
    g.beginPath();
    g.arc(x, y, s * 0.12, 0, Math.PI * 2);
    g.fill();
  }
  function pigRing(g, x, y, s) {
    g.lineWidth = s * 0.12;
    g.beginPath();
    g.arc(x, y, s, 0, Math.PI * 2);
    g.stroke();
    snout(g, x, y, s * 0.55);
  }
  function wolfMark(g, x, y, s) {
    g.lineWidth = s * 0.12;
    g.beginPath();
    g.arc(x, y, s, Math.PI * 0.62, Math.PI * 1.88);
    g.arc(x + s * 0.32, y - s * 0.12, s * 0.78, Math.PI * 1.75, Math.PI * 0.72, true);
    g.closePath();
    g.stroke();
    paw(g, x - s * 0.15, y + s * 0.08, s * 0.5);
  }
  function daggers(g, x, y, s) {
    g.lineWidth = s * 0.09;
    g.lineCap = "round";
    for (const d of [-1, 1]) {
      g.beginPath();
      g.moveTo(x - d * s * 0.7, y - s * 0.7);
      g.lineTo(x + d * s * 0.55, y + s * 0.55);
      g.stroke();
      g.beginPath();
      g.moveTo(x + d * s * 0.32 - s * 0.18, y + s * 0.32 + d * s * 0.18 * 0);
      g.lineTo(x + d * s * 0.32 + s * 0.18, y + s * 0.32);
      g.stroke();
    }
  }
  var IMG = {};
  function loadImg(src) {
    return new Promise((res) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => res(i);
      i.onerror = () => res(null);
      i.src = src;
    });
  }
  function crop(img, sx, sy, sw, sh, erase) {
    const c = document.createElement("canvas");
    c.width = sw;
    c.height = sh;
    const cg = c.getContext("2d");
    cg.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    if (erase) {
      cg.globalCompositeOperation = "destination-out";
      for (const [x, y, w, h2] of erase) cg.fillRect(x - sx, y - sy, w, h2);
    }
    return c;
  }
  async function loadLogo() {
    const mark = await loadImg(LOGO_HOST + "brand-mark.png"), full = await loadImg(LOGO_HOST + "brand-full.png");
    IMG.mark = mark;
    IMG.full = full;
    IMG.letters = crop(mark, 0, 0, 205, 168, [[154, 121, 14, 15], [149, 135, 60, 40], [140, 148, 20, 30]]);
    IMG.bell = crop(mark, 128, 150, 66, 70);
    IMG.bellOnly = crop(mark, 128, 158, 66, 62);
    const GAP = [[112, 0], [112, 30], [113, 72], [110, 84], [107, 96], [105, 108], [101, 120], [96, 128], [90, 168]];
    const half = (left) => {
      const c = document.createElement("canvas");
      c.width = 205;
      c.height = 168;
      const cg = c.getContext("2d");
      cg.beginPath();
      cg.moveTo(left ? 0 : 205, 0);
      for (const [x, y] of GAP) cg.lineTo(x, y);
      cg.lineTo(left ? 0 : 205, 168);
      cg.closePath();
      cg.clip();
      cg.drawImage(IMG.letters, 0, 0);
      return c;
    };
    IMG.b1 = half(true);
    IMG.b2 = half(false);
  }
  function bigS(apart) {
    const i = 14, k = 1, r = 44 + 2.6 * i, sag = 0.06 + 0.22 * k, top = 1.34 + 0.16 * k;
    return { k, r, sag, top, bx: r * (1.03 - 0.13 * k) * (apart || 1), by: r * top };
  }
  function titPt(S3, s, t) {
    const sn = Math.sin(t), cs = Math.cos(t);
    if (sn >= 0) return [s * S3.bx + S3.r * cs * (1 + S3.sag * 0.3 * sn * sn) + s * S3.r * 0.06 * S3.k * sn * sn, S3.by + S3.r * sn * (1 + S3.sag)];
    const up = -sn;
    return [s * S3.bx + S3.r * cs * (1 - 0.5 * up * up) - s * S3.r * 0.2 * up * up, S3.by - S3.r * S3.top * up];
  }
  function titArc(g, S3, s, ox, oy, sc, a0, a1) {
    g.beginPath();
    for (let j = 0; j <= 120; j++) {
      let t = (a0 + (a1 - a0) * j / 120) * Math.PI;
      if (s < 0) t = Math.PI - t;
      const p = titPt(S3, s, t), X = ox + p[0] * sc, Y = oy + p[1] * sc;
      if (j) g.lineTo(X, Y);
      else g.moveTo(X, Y);
    }
  }
  function titPath(g, S3, s, ox, oy, sc) {
    g.beginPath();
    for (let j = 0; j <= 160; j++) {
      const p = titPt(S3, s, j / 160 * Math.PI * 2), X = ox + p[0] * sc, Y = oy + p[1] * sc;
      if (j) g.lineTo(X, Y);
      else g.moveTo(X, Y);
    }
    g.closePath();
  }
  function ownSide(g, s, ox, f) {
    g.save();
    g.beginPath();
    if (s < 0) g.rect(-9999, -9999, 9999 + ox, 99999);
    else g.rect(ox, -9999, 9999, 99999);
    g.clip();
    f();
    g.restore();
  }
  var DRIPS = [];
  function dripFrom(g, w, h2, x0, x1, seed, n) {
    const data = g.getImageData(0, 0, w, h2).data, r = rng(seed), lows = [];
    for (let x = x0; x < x1; x += 3) {
      for (let y = h2 - 1; y > 0; y--) if (data[(y * w + x) * 4 + 3] > 140) {
        lows.push([x, y]);
        break;
      }
    }
    const picked = [];
    for (const [x, y] of lows) if (r() < n / lows.length * 1.6 && !picked.some(([px]) => Math.abs(px - x) < 16)) picked.push([x, y]);
    DRIPS.length = 0;
    for (const [x, y] of picked) {
      const wd = 8 + r() * 6, len = r() < 0.3 ? 4 + r() * 8 : 16 + Math.pow(r(), 1.4) * 58, wob = (r() - 0.5) * 3;
      g.beginPath();
      g.moveTo(x - wd * 1.5, y - 2);
      g.quadraticCurveTo(x - wd * 0.5, y, x - wd * 0.45, y + Math.min(len, wd * 1.2));
      g.bezierCurveTo(x - wd * 0.42 + wob, y + len * 0.6, x - wd * 0.5, y + len * 0.85, x - wd * 0.62, y + len);
      g.arc(x, y + len, wd * 0.62, Math.PI, 0, true);
      g.bezierCurveTo(x + wd * 0.5, y + len * 0.85, x + wd * 0.42 + wob, y + len * 0.6, x + wd * 0.45, y + Math.min(len, wd * 1.2));
      g.quadraticCurveTo(x + wd * 0.5, y, x + wd * 1.5, y - 2);
      g.closePath();
      g.fill();
      DRIPS.push([x, y, wd, len]);
    }
  }
  function logo(g, which, cx, cy, h2, col) {
    const src = IMG[which], s = h2 / src.height, w = src.width * s;
    const c = document.createElement("canvas");
    c.width = Math.ceil(w);
    c.height = Math.ceil(h2);
    const cg = c.getContext("2d");
    cg.drawImage(src, 0, 0, w, h2);
    cg.globalCompositeOperation = "source-in";
    cg.fillStyle = col || INK;
    cg.fillRect(0, 0, c.width, c.height);
    g.drawImage(c, cx - w / 2, cy - h2 / 2);
    return w;
  }
  function arcTextLow(g, t, cx, textY, R, font, size) {
    g.font = size + "px " + fontOf(font);
    g.textAlign = "center";
    g.textBaseline = "middle";
    const span = g.measureText(t).width / R, cy = textY - R;
    let a = Math.PI / 2 + span / 2;
    for (const ch of t) {
      const da = g.measureText(ch).width / R, mid = a - da / 2;
      g.save();
      g.translate(cx + Math.cos(mid) * R, cy + Math.sin(mid) * R);
      g.rotate(mid - Math.PI / 2);
      g.fillText(ch, 0, 0);
      g.restore();
      a -= da;
    }
  }
  function boneShape(g, cx, cy, w, h2) {
    const r = h2 * 0.36, L = cx - w / 2 + r, R = cx + w / 2 - r;
    g.beginPath();
    g.rect(L, cy - h2 * 0.3, R - L, h2 * 0.6);
    for (const [x, y] of [[L, cy - h2 * 0.26], [L, cy + h2 * 0.26], [R, cy - h2 * 0.26], [R, cy + h2 * 0.26]]) {
      g.moveTo(x + r, y);
      g.arc(x, y, r, 0, Math.PI * 2);
    }
  }
  function boneOutline(g, cx, cy, w, h2, lw) {
    boneShape(g, cx, cy, w, h2);
    g.fill("nonzero");
    g.save();
    g.globalCompositeOperation = "destination-out";
    boneShape(g, cx, cy, w - lw * 2, h2 - lw * 2);
    g.fill("nonzero");
    g.restore();
  }
  function cut(g, f) {
    g.save();
    g.globalCompositeOperation = "destination-out";
    f();
    g.restore();
  }
  function earTag(g, cx, top, w, h2) {
    g.beginPath();
    g.roundRect(cx - w * 0.18, top, w * 0.36, h2 * 0.34, 14);
    g.roundRect(cx - w / 2, top + h2 * 0.24, w, h2 * 0.76, 26);
  }
  function rosette(g, cx, cy, r, ring, tails, mid) {
    g.fillStyle = tails;
    for (const d of [-1, 1]) {
      g.beginPath();
      g.moveTo(cx + d * r * 0.15, cy + r * 0.3);
      g.lineTo(cx + d * r * 0.75, cy + r * 1.55);
      g.lineTo(cx + d * r * 0.45, cy + r * 1.35);
      g.lineTo(cx + d * r * 0.25, cy + r * 1.62);
      g.lineTo(cx - d * r * 0.2, cy + r * 0.45);
      g.closePath();
      g.fill();
    }
    g.fillStyle = ring;
    for (let i = 0; i < 22; i++) {
      const a = i / 22 * Math.PI * 2;
      g.beginPath();
      g.arc(cx + Math.cos(a) * r * 0.86, cy + Math.sin(a) * r * 0.86, r * 0.2, 0, Math.PI * 2);
      g.fill();
    }
    g.beginPath();
    g.arc(cx, cy, r * 0.88, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = mid;
    g.beginPath();
    g.arc(cx, cy, r * 0.62, 0, Math.PI * 2);
    g.fill();
  }
  function flourish(g, x, y, s, d) {
    g.lineCap = "round";
    g.lineWidth = s * 0.07;
    g.beginPath();
    g.moveTo(x, y);
    g.bezierCurveTo(x + d * s * 0.6, y - s * 0.5, x + d * s * 1.2, y + s * 0.3, x + d * s * 1.6, y - s * 0.1);
    g.bezierCurveTo(x + d * s * 1.8, y - s * 0.25, x + d * s * 1.65, y - s * 0.45, x + d * s * 1.5, y - s * 0.32);
    g.stroke();
    g.lineWidth = s * 0.045;
    g.beginPath();
    g.moveTo(x + d * s * 0.3, y + s * 0.12);
    g.bezierCurveTo(x + d * s * 0.8, y + s * 0.55, x + d * s * 1.3, y + s * 0.45, x + d * s * 1.55, y + s * 0.22);
    g.stroke();
    g.beginPath();
    g.arc(x + d * s * 1.62, y + s * 0.2, s * 0.06, 0, Math.PI * 2);
    g.fill();
  }
  function stamp(g, ink, x0, y0, col, seed) {
    const c = document.createElement("canvas");
    c.width = ink.width;
    c.height = ink.height;
    const cg = c.getContext("2d");
    cg.drawImage(ink, 0, 0);
    cg.globalCompositeOperation = "source-in";
    cg.fillStyle = col;
    cg.fillRect(0, 0, c.width, c.height);
    cg.globalCompositeOperation = "destination-out";
    const r = rng(seed);
    for (let i = 0; i < 1400; i++) {
      cg.globalAlpha = 0.3 + r() * 0.7;
      cg.beginPath();
      cg.arc(r() * c.width, r() * c.height, 0.5 + r() * 1.8, 0, Math.PI * 2);
      cg.fill();
    }
    for (let i = 0; i < 5; i++) {
      cg.globalAlpha = 0.18 + r() * 0.2;
      cg.fillRect(0, r() * c.height, c.width, 6 + r() * 16);
    }
    g.globalCompositeOperation = "multiply";
    g.globalAlpha = 0.9;
    g.drawImage(c, x0, y0);
    g.globalCompositeOperation = "source-over";
    g.globalAlpha = 1;
  }
  function welt(g, ink, x0, y0) {
    const w = ink.width, h2 = ink.height, tint = (col, blur, a, op) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h2;
      const cg = c.getContext("2d");
      cg.filter = blur ? "blur(" + blur + "px)" : "none";
      cg.drawImage(ink, 0, 0);
      cg.filter = "none";
      cg.globalCompositeOperation = "source-in";
      cg.fillStyle = col;
      cg.fillRect(0, 0, w, h2);
      g.globalCompositeOperation = op || "source-over";
      g.globalAlpha = a;
      g.drawImage(c, x0, y0);
      g.globalAlpha = 1;
      g.globalCompositeOperation = "source-over";
    };
    tint("#c22f3a", 9, 0.55, "multiply");
    tint("#d8434c", 3, 0.5, "multiply");
    tint("#ff8f8a", 2, 0.22);
  }
  function upArrow(g, x, y0, y1, wd) {
    g.lineWidth = wd;
    g.lineCap = "butt";
    g.beginPath();
    g.moveTo(x, y1);
    g.lineTo(x, y0 + wd * 2);
    g.stroke();
    g.beginPath();
    g.moveTo(x - wd * 2.4, y0 + wd * 2.6);
    g.lineTo(x, y0);
    g.lineTo(x + wd * 2.4, y0 + wd * 2.6);
    g.closePath();
    g.fill();
  }
  function star(g, x, y, r) {
    g.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * 0.45 : r;
      if (i) g.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q);
      else g.moveTo(x + Math.cos(a) * q, y + Math.sin(a) * q);
    }
    g.closePath();
  }
  function drop(g, x, y, s) {
    g.beginPath();
    g.moveTo(x, y - s);
    g.bezierCurveTo(x + s * 0.2, y - s * 0.5, x + s * 0.7, y - s * 0.05, x + s * 0.7, y + s * 0.35);
    g.arc(x, y + s * 0.35, s * 0.7, 0, Math.PI);
    g.bezierCurveTo(x - s * 0.7, y - s * 0.05, x - s * 0.2, y - s * 0.5, x, y - s);
    g.closePath();
    g.fill();
  }
  function lips(g, x, y, s, rot) {
    g.save();
    g.translate(x, y);
    g.rotate(rot);
    g.beginPath();
    g.moveTo(-s, 0);
    g.bezierCurveTo(-s * 0.6, -s * 0.55, -s * 0.25, -s * 0.6, 0, -s * 0.28);
    g.bezierCurveTo(s * 0.25, -s * 0.6, s * 0.6, -s * 0.55, s, 0);
    g.bezierCurveTo(s * 0.5, -s * 0.1, -s * 0.5, -s * 0.1, -s, 0);
    g.fill();
    g.beginPath();
    g.moveTo(-s, s * 0.03);
    g.bezierCurveTo(-s * 0.5, s * 0.1, s * 0.5, s * 0.1, s, s * 0.03);
    g.bezierCurveTo(s * 0.6, s * 0.66, -s * 0.6, s * 0.66, -s, s * 0.03);
    g.fill();
    g.globalCompositeOperation = "destination-out";
    g.lineWidth = Math.max(1, s * 0.035);
    g.lineCap = "round";
    for (let i = -4; i <= 4; i++) {
      g.beginPath();
      g.moveTo(i * s * 0.17, s * 0.14);
      g.lineTo(i * s * 0.2, s * 0.44);
      g.stroke();
      g.beginPath();
      g.moveTo(i * s * 0.15, -s * 0.1);
      g.lineTo(i * s * 0.18, -s * 0.34);
      g.stroke();
    }
    g.restore();
  }
  function care(g, kind, x, y) {
    g.lineWidth = 2.6;
    g.lineJoin = "round";
    if (kind === "tub") {
      g.beginPath();
      g.moveTo(x - 17, y - 9);
      g.lineTo(x - 13, y + 12);
      g.lineTo(x + 13, y + 12);
      g.lineTo(x + 17, y - 9);
      g.stroke();
      g.beginPath();
      g.moveTo(x - 15, y - 4);
      g.quadraticCurveTo(x - 8, y - 9, x - 2, y - 4);
      g.quadraticCurveTo(x + 6, y + 1, x + 15, y - 4);
      g.stroke();
      g.font = "bold 11px Arial";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("69", x, y + 5);
    }
    if (kind === "noBleach") {
      g.beginPath();
      g.moveTo(x, y - 12);
      g.lineTo(x + 15, y + 12);
      g.lineTo(x - 15, y + 12);
      g.closePath();
      g.stroke();
      g.beginPath();
      g.moveTo(x - 15, y - 12);
      g.lineTo(x + 15, y + 14);
      g.moveTo(x + 15, y - 12);
      g.lineTo(x - 15, y + 14);
      g.stroke();
    }
    if (kind === "tumble") {
      g.strokeRect(x - 13, y - 13, 26, 26);
      g.beginPath();
      g.arc(x, y, 9, 0, Math.PI * 2);
      g.stroke();
      for (const d of [-3, 3]) {
        g.beginPath();
        g.arc(x + d, y, 1.6, 0, Math.PI * 2);
        g.fill();
      }
    }
    if (kind === "noDry") {
      g.strokeRect(x - 13, y - 13, 26, 26);
      g.beginPath();
      g.moveTo(x - 13, y - 13);
      g.lineTo(x + 13, y + 13);
      g.moveTo(x + 13, y - 13);
      g.lineTo(x - 13, y + 13);
      g.stroke();
    }
  }
  function qr(g, x, y, cell, seed) {
    const N = 21, r = rng(seed), finder = (cx, cy) => {
      g.fillRect(x + cx * cell, y + cy * cell, 7 * cell, 7 * cell);
      g.save();
      g.globalCompositeOperation = "destination-out";
      g.fillRect(x + (cx + 1) * cell, y + (cy + 1) * cell, 5 * cell, 5 * cell);
      g.restore();
      g.fillRect(x + (cx + 2) * cell, y + (cy + 2) * cell, 3 * cell, 3 * cell);
    };
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const inF = i < 8 && j < 8 || i > N - 9 && j < 8 || i < 8 && j > N - 9;
      if (!inF && r() < 0.48) g.fillRect(x + i * cell, y + j * cell, cell, cell);
    }
    finder(0, 0);
    finder(N - 7, 0);
    finder(0, N - 7);
  }
  var YEL = "#efc02a";
  var YEL2 = "#c4950f";
  var GRN = "#3f8a2e";
  var RED2 = "#d42020";
  function banner(g, cx, cy, bw, bh, col, tail, t, font, size) {
    const L = cx - bw / 2, R = cx + bw / 2;
    for (const d of [-1, 1]) {
      const x0 = d < 0 ? L : R;
      g.beginPath();
      g.moveTo(x0 - d * 12, cy - bh * 0.15);
      g.lineTo(x0 + d * bh * 1.05, cy - bh * 0.15);
      g.lineTo(x0 + d * bh * 0.62, cy + bh * 0.38);
      g.lineTo(x0 + d * bh * 1.05, cy + bh * 0.9);
      g.lineTo(x0 - d * 12, cy + bh * 0.9);
      g.closePath();
      g.fillStyle = tail;
      g.fill();
      g.strokeStyle = INK;
      g.lineWidth = 3;
      g.lineJoin = "round";
      g.stroke();
    }
    g.beginPath();
    g.moveTo(L, cy - bh / 2);
    g.quadraticCurveTo(cx, cy - bh / 2 - 12, R, cy - bh / 2);
    g.lineTo(R, cy + bh / 2);
    g.quadraticCurveTo(cx, cy + bh / 2 - 12, L, cy + bh / 2);
    g.closePath();
    g.fillStyle = col;
    g.fill();
    g.strokeStyle = INK;
    g.lineWidth = 3.5;
    g.stroke();
    g.fillStyle = INK;
    text(g, t, cx, cy - 5, font, size, { max: bw - 22 });
  }
  function canine(g, x, y, L, a) {
    const hh = L * 0.13, pt = (u, v) => [x + Math.cos(a) * u - Math.sin(a) * v, y + Math.sin(a) * u + Math.cos(a) * v];
    const P = [];
    const M = (u, v) => P.push(pt(u, v));
    g.beginPath();
    let p = pt(0, -hh * 0.7);
    g.moveTo(p[0], p[1]);
    const seg = (c1, c2, e) => {
      const a1 = pt(...c1), a2 = pt(...c2), b = pt(...e);
      g.bezierCurveTo(a1[0], a1[1], a2[0], a2[1], b[0], b[1]);
    };
    seg([L * 0.04, -hh * 1.6], [L * 0.26, -hh * 1.7], [L * 0.32, -hh * 0.82]);
    seg([L * 0.55, -hh * 0.9], [L * 0.86, -hh * 0.62], [L, 0]);
    seg([L * 0.86, hh * 0.62], [L * 0.55, hh * 0.9], [L * 0.32, hh * 0.82]);
    seg([L * 0.26, hh * 1.7], [L * 0.04, hh * 1.6], [0, hh * 0.7]);
    g.closePath();
  }
  function flash(g, path, col, lw) {
    path();
    g.fillStyle = col;
    g.fill();
    path();
    g.strokeStyle = INK;
    g.lineWidth = lw || 4;
    g.lineJoin = "round";
    g.stroke();
  }
  function speckle(g, seed, n, w, h2) {
    const r = rng(seed);
    g.save();
    g.globalCompositeOperation = "destination-out";
    for (let i = 0; i < n; i++) {
      g.globalAlpha = 0.4 + r() * 0.6;
      g.beginPath();
      g.arc(r() * w, r() * h2, 0.5 + r() * 1.6, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }
  function paisley(g, x, y, s, rot) {
    g.save();
    g.translate(x, y);
    g.rotate(rot);
    const shape = (k) => {
      g.beginPath();
      g.moveTo(0, -s * k);
      g.bezierCurveTo(s * 0.95 * k, -s * 0.85 * k, s * 0.9 * k, s * 0.65 * k, 0, s * 0.72 * k);
      g.bezierCurveTo(-s * 0.72 * k, s * 0.75 * k, -s * 0.82 * k, 0, -s * 0.22 * k, -s * 0.22 * k);
      g.quadraticCurveTo(-s * 0.04 * k, -s * 0.5 * k, 0, -s * k);
    };
    g.lineWidth = 2.6;
    shape(1);
    g.stroke();
    g.lineWidth = 1.5;
    shape(0.62);
    g.stroke();
    g.beginPath();
    g.arc(s * 0.08, s * 0.12, s * 0.12, 0, Math.PI * 2);
    g.fill();
    for (let i = 0; i < 9; i++) {
      const a = -0.3 + i * 0.36;
      g.beginPath();
      g.arc(Math.cos(a) * s * 1.05 + s * 0.1, Math.sin(a) * s * 1 + s * 0.05, 1.5, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }
  function leaf(g, x, y, s, rot) {
    g.save();
    g.translate(x, y);
    g.rotate(rot);
    g.beginPath();
    g.moveTo(0, 0);
    g.quadraticCurveTo(s * 0.5, -s * 0.45, s, 0);
    g.quadraticCurveTo(s * 0.5, s * 0.45, 0, 0);
    g.fill();
    g.restore();
  }
  function blossom(g, x, y, s, petals) {
    g.lineWidth = 1.8;
    for (let i = 0; i < (petals || 8); i++) {
      const a = i / (petals || 8) * Math.PI * 2;
      g.beginPath();
      g.ellipse(x + Math.cos(a) * s * 0.55, y + Math.sin(a) * s * 0.55, s * 0.42, s * 0.2, a, 0, Math.PI * 2);
      g.stroke();
    }
    g.beginPath();
    g.arc(x, y, s * 0.18, 0, Math.PI * 2);
    g.fill();
  }
  function shield(g, cx, cy, W25, H2) {
    const t = cy - H2 / 2, L = cx - W25 / 2, R = cx + W25 / 2;
    g.beginPath();
    g.moveTo(L + 14, t);
    g.lineTo(R - 14, t);
    g.quadraticCurveTo(R, t, R, t + 14);
    g.lineTo(R, cy + H2 * 0.1);
    g.quadraticCurveTo(R - 8, cy + H2 * 0.36, cx, cy + H2 / 2);
    g.quadraticCurveTo(L + 8, cy + H2 * 0.36, L, cy + H2 * 0.1);
    g.lineTo(L, t + 14);
    g.quadraticCurveTo(L, t, L + 14, t);
    g.closePath();
  }
  function speciesBrand(word, icon) {
    return (g, w, h2) => {
      const cx = w / 2, cy = h2 / 2 + 2;
      g.fillStyle = INK;
      g.strokeStyle = INK;
      g.lineWidth = 8;
      shield(g, cx, cy, 172, 206);
      g.stroke();
      icon(g, cx, cy - 30);
      text(g, word, cx, cy + 44, "Black Ops One", 29, { max: 132 });
    };
  }
  var ICON = {
    cow: (g, x, y) => {
      for (const d of [-1, 1]) {
        g.beginPath();
        g.moveTo(x + d * 18, y - 18);
        g.quadraticCurveTo(x + d * 58, y - 22, x + d * 52, y - 56);
        g.quadraticCurveTo(x + d * 44, y - 30, x + d * 12, y - 6);
        g.closePath();
        g.fill();
        g.beginPath();
        g.ellipse(x + d * 40, y - 4, 16, 7, d * 0.35, 0, Math.PI * 2);
        g.fill();
      }
      g.beginPath();
      g.ellipse(x, y + 4, 26, 30, 0, 0, Math.PI * 2);
      g.fill();
      g.beginPath();
      g.ellipse(x, y + 28, 23, 14, 0, 0, Math.PI * 2);
      g.fill();
      cut(g, () => {
        for (const d of [-1, 1]) {
          g.beginPath();
          g.ellipse(x + d * 9, y + 29, 3.6, 5, 0, 0, Math.PI * 2);
          g.fill();
          g.beginPath();
          g.arc(x + d * 12, y - 2, 3.6, 0, Math.PI * 2);
          g.fill();
        }
      });
    },
    horse: (g, x, y) => {
      g.lineCap = "butt";
      g.lineWidth = 22;
      g.beginPath();
      g.arc(x, y - 4, 36, -0.12 * Math.PI, 1.12 * Math.PI);
      g.stroke();
      cut(g, () => {
        for (let i = 0; i < 6; i++) {
          const a = -0.03 * Math.PI + i * (1.06 * Math.PI / 5);
          g.beginPath();
          g.arc(x + Math.cos(a) * 36, y - 4 + Math.sin(a) * 36, 3.6, 0, Math.PI * 2);
          g.fill();
        }
      });
    },
    dog: (g, x, y) => paw(g, x, y + 4, 72),
    pig: (g, x, y) => {
      g.beginPath();
      g.ellipse(x, y, 42, 30, 0, 0, Math.PI * 2);
      g.fill();
      cut(g, () => {
        for (const d of [-1, 1]) {
          g.beginPath();
          g.ellipse(x + d * 13, y, 6.5, 11, 0, 0, Math.PI * 2);
          g.fill();
        }
      });
    },
    fox: (g, x, y) => {
      g.beginPath();
      g.moveTo(x - 30, y + 34);
      g.bezierCurveTo(x - 64, y - 6, x - 16, y - 56, x + 44, y - 42);
      g.bezierCurveTo(x + 6, y - 30, x - 22, y - 2, x - 8, y + 34);
      g.closePath();
      g.fill();
      cut(g, () => {
        g.lineWidth = 3;
        g.beginPath();
        g.moveTo(x + 10, y - 50);
        g.lineTo(x + 4, y - 40);
        g.lineTo(x + 14, y - 36);
        g.lineTo(x + 8, y - 26);
        g.stroke();
      });
    },
    bunny: (g, x, y) => {
      for (const d of [-1, 1]) {
        g.beginPath();
        g.ellipse(x + d * 15, y - 26, 10, 30, d * 0.18, 0, Math.PI * 2);
        g.fill();
      }
      g.beginPath();
      g.ellipse(x, y + 16, 32, 26, 0, 0, Math.PI * 2);
      g.fill();
      cut(g, () => {
        for (const d of [-1, 1]) {
          g.beginPath();
          g.arc(x + d * 12, y + 12, 3.6, 0, Math.PI * 2);
          g.fill();
        }
        heart(g, x, y + 24, 5);
        g.fill();
      });
    },
    cat: (g, x, y) => {
      g.beginPath();
      g.ellipse(x, y + 8, 38, 30, 0, 0, Math.PI * 2);
      g.fill();
      for (const d of [-1, 1]) {
        g.beginPath();
        g.moveTo(x + d * 36, y - 6);
        g.lineTo(x + d * 38, y - 40);
        g.lineTo(x + d * 8, y - 18);
        g.closePath();
        g.fill();
      }
      cut(g, () => {
        for (const d of [-1, 1]) {
          g.beginPath();
          g.ellipse(x + d * 14, y + 4, 4, 7, 0, 0, Math.PI * 2);
          g.fill();
        }
        g.beginPath();
        g.moveTo(x - 5, y + 16);
        g.lineTo(x + 5, y + 16);
        g.lineTo(x, y + 21);
        g.closePath();
        g.fill();
        g.lineWidth = 2;
        for (const d of [-1, 1]) for (const k of [-1, 1]) {
          g.beginPath();
          g.moveTo(x + d * 14, y + 22 + k * 3);
          g.lineTo(x + d * 34, y + 20 + k * 7);
          g.stroke();
        }
      });
    },
    dragon: (g, x, y) => {
      g.beginPath();
      g.moveTo(x - 44, y + 26);
      g.lineTo(x - 30, y - 36);
      g.lineTo(x + 48, y - 44);
      g.quadraticCurveTo(x + 30, y - 14, x + 40, y + 4);
      g.quadraticCurveTo(x + 14, y + 2, x + 16, y + 30);
      g.quadraticCurveTo(x - 10, y + 16, x - 44, y + 26);
      g.closePath();
      g.fill();
      g.beginPath();
      g.moveTo(x - 30, y - 36);
      g.lineTo(x - 38, y - 50);
      g.lineTo(x - 22, y - 40);
      g.closePath();
      g.fill();
      cut(g, () => {
        g.lineWidth = 3;
        g.beginPath();
        g.moveTo(x - 28, y - 32);
        g.lineTo(x + 36, y + 2);
        g.moveTo(x - 30, y - 28);
        g.lineTo(x + 14, y + 26);
        g.stroke();
      });
    }
  };
  function swallow(g, x, y, s, flip) {
    g.save();
    g.translate(x, y);
    g.scale(flip ? -1 : 1, 1);
    const body = () => {
      g.beginPath();
      g.moveTo(s * 0.9, -s * 0.02);
      g.quadraticCurveTo(s * 0.62, -s * 0.3, s * 0.28, -s * 0.2);
      g.quadraticCurveTo(-s * 0.1, -s * 0.12, -s * 0.42, -s * 0.06);
      g.lineTo(-s * 1.25, -s * 0.36);
      g.lineTo(-s * 0.7, s * 0.03);
      g.lineTo(-s * 1.2, s * 0.3);
      g.lineTo(-s * 0.38, s * 0.14);
      g.quadraticCurveTo(s * 0.35, s * 0.34, s * 0.9, -s * 0.02);
      g.closePath();
    };
    const wing = () => {
      g.beginPath();
      g.moveTo(s * 0.3, -s * 0.18);
      g.quadraticCurveTo(s * 0, -s * 0.95, -s * 0.75, -s * 1.05);
      g.quadraticCurveTo(-s * 0.35, -s * 0.6, -s * 0.18, -s * 0.08);
      g.closePath();
    };
    flash(g, body, "#2a5fb0", 3);
    g.save();
    body();
    g.clip();
    g.fillStyle = "#d8261f";
    g.beginPath();
    g.ellipse(s * 0.3, s * 0.14, s * 0.42, s * 0.2, 0.15, 0, Math.PI * 2);
    g.fill();
    g.restore();
    body();
    g.strokeStyle = INK;
    g.lineWidth = 3;
    g.stroke();
    flash(g, wing, "#2a5fb0", 3);
    g.fillStyle = INK;
    g.beginPath();
    g.arc(s * 0.6, -s * 0.12, s * 0.05, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  function rope(g, pts) {
    const seg = (f) => {
      for (let i = 0; i < pts.length - 1; i++) f(pts[i], pts[i + 1]);
    };
    g.lineCap = "round";
    g.lineJoin = "round";
    g.strokeStyle = INK;
    g.lineWidth = 11;
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (const p of pts.slice(1)) g.lineTo(p[0], p[1]);
    g.stroke();
    cut(g, () => {
      g.lineWidth = 6.5;
      g.beginPath();
      g.moveTo(pts[0][0], pts[0][1]);
      for (const p of pts.slice(1)) g.lineTo(p[0], p[1]);
      g.stroke();
    });
    g.lineWidth = 1.6;
    seg(([x0, y0], [x1, y1]) => {
      const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
      for (let t = 5; t < L - 3; t += 7) {
        const x = x0 + ux * t, y = y0 + uy * t;
        g.beginPath();
        g.moveTo(x - uy * 4 - ux * 2.5, y + ux * 4 - uy * 2.5);
        g.lineTo(x + uy * 4 + ux * 2.5, y - ux * 4 + uy * 2.5);
        g.stroke();
      }
    });
  }
  function tie(g, x, y) {
    g.fillStyle = INK;
    g.beginPath();
    g.ellipse(x, y, 9, 7, 0.3, 0, Math.PI * 2);
    g.fill();
    cut(g, () => {
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(x - 5, y - 3);
      g.lineTo(x + 5, y + 3);
      g.stroke();
    });
  }
  Object.assign(ICON, {
    goat: (g, x, y) => {
      g.lineCap = "round";
      g.lineWidth = 9;
      for (const d of [-1, 1]) {
        g.beginPath();
        g.moveTo(x + d * 10, y - 22);
        g.bezierCurveTo(x + d * 18, y - 56, x + d * 50, y - 54, x + d * 46, y - 22);
        g.stroke();
        g.beginPath();
        g.ellipse(x + d * 32, y - 6, 15, 6, d * 0.4, 0, Math.PI * 2);
        g.fill();
      }
      g.beginPath();
      g.moveTo(x - 20, y - 18);
      g.quadraticCurveTo(x, y - 30, x + 20, y - 18);
      g.quadraticCurveTo(x + 18, y + 18, x + 8, y + 30);
      g.lineTo(x - 8, y + 30);
      g.quadraticCurveTo(x - 18, y + 18, x - 20, y - 18);
      g.fill();
      g.beginPath();
      g.moveTo(x - 8, y + 26);
      g.lineTo(x + 8, y + 26);
      g.lineTo(x, y + 50);
      g.closePath();
      g.fill();
      cut(g, () => {
        for (const d of [-1, 1]) {
          g.beginPath();
          g.ellipse(x + d * 9, y - 4, 4, 2.6, 0, 0, Math.PI * 2);
          g.fill();
        }
      });
    },
    sheep: (g, x, y) => {
      for (const [dx, dy, r] of [[-28, -24, 15], [-12, -34, 16], [8, -35, 16], [26, -26, 15], [36, -10, 12], [-36, -10, 12]]) {
        g.beginPath();
        g.arc(x + dx, y + dy, r, 0, Math.PI * 2);
        g.fill();
      }
      g.beginPath();
      g.ellipse(x, y + 8, 20, 28, 0, 0, Math.PI * 2);
      g.fill();
      for (const d of [-1, 1]) {
        g.beginPath();
        g.ellipse(x + d * 30, y + 4, 14, 6, d * 0.3, 0, Math.PI * 2);
        g.fill();
      }
      cut(g, () => {
        g.lineWidth = 2.5;
        for (const [dx, dy] of [[-20, -26], [0, -34], [20, -26]]) {
          g.beginPath();
          g.arc(x + dx, y + dy, 6, 0.2, 2.8);
          g.stroke();
        }
        for (const d of [-1, 1]) {
          g.beginPath();
          g.arc(x + d * 8, y + 2, 3.2, 0, Math.PI * 2);
          g.fill();
        }
      });
    },
    wolf: (g, x, y) => {
      g.beginPath();
      g.moveTo(x, y + 40);
      g.lineTo(x - 14, y + 26);
      g.lineTo(x - 34, y + 10);
      g.lineTo(x - 40, y - 8);
      g.lineTo(x - 36, y - 48);
      g.lineTo(x - 16, y - 26);
      g.lineTo(x, y - 30);
      g.lineTo(x + 16, y - 26);
      g.lineTo(x + 36, y - 48);
      g.lineTo(x + 40, y - 8);
      g.lineTo(x + 34, y + 10);
      g.lineTo(x + 14, y + 26);
      g.closePath();
      g.fill();
      cut(g, () => {
        for (const d of [-1, 1]) {
          g.beginPath();
          g.moveTo(x + d * 8, y - 4);
          g.lineTo(x + d * 24, y - 10);
          g.lineTo(x + d * 20, y - 2);
          g.closePath();
          g.fill();
        }
        g.beginPath();
        g.ellipse(x, y + 30, 6, 4, 0, 0, Math.PI * 2);
        g.fill();
      });
    },
    deer: (g, x, y) => {
      for (const d of [-1, 1]) {
        g.beginPath();
        g.ellipse(x + d * 32, y - 22, 20, 10, d * -0.5, 0, Math.PI * 2);
        g.fill();
      }
      g.beginPath();
      g.moveTo(x - 22, y - 24);
      g.quadraticCurveTo(x, y - 36, x + 22, y - 24);
      g.quadraticCurveTo(x + 24, y + 4, x + 8, y + 36);
      g.quadraticCurveTo(x, y + 42, x - 8, y + 36);
      g.quadraticCurveTo(x - 24, y + 4, x - 22, y - 24);
      g.fill();
      cut(g, () => {
        for (const d of [-1, 1]) {
          g.beginPath();
          g.ellipse(x + d * 11, y - 8, 4, 5.5, 0, 0, Math.PI * 2);
          g.fill();
        }
        for (const [dx, dy] of [[-6, -22], [6, -24], [0, -14]]) {
          g.beginPath();
          g.arc(x + dx, y + dy, 2.2, 0, Math.PI * 2);
          g.fill();
        }
      });
    },
    rat: (g, x, y) => {
      g.beginPath();
      g.ellipse(x - 4, y + 4, 34, 22, -0.1, 0, Math.PI * 2);
      g.fill();
      g.beginPath();
      g.moveTo(x + 22, y - 10);
      g.quadraticCurveTo(x + 48, y - 4, x + 54, y + 8);
      g.quadraticCurveTo(x + 40, y + 18, x + 22, y + 18);
      g.fill();
      g.beginPath();
      g.arc(x + 22, y - 14, 11, 0, Math.PI * 2);
      g.fill();
      g.lineWidth = 4;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(x - 36, y + 8);
      g.bezierCurveTo(x - 64, y + 10, x - 60, y - 30, x - 34, y - 34);
      g.stroke();
      cut(g, () => {
        g.beginPath();
        g.arc(x + 36, y + 2, 2.6, 0, Math.PI * 2);
        g.fill();
        g.beginPath();
        g.arc(x + 22, y - 14, 5, 0, Math.PI * 2);
        g.fill();
      });
    },
    goblin: (g, x, y) => {
      g.beginPath();
      g.moveTo(x - 26, y + 30);
      g.quadraticCurveTo(x - 30, y - 2, x - 10, y - 14);
      g.lineTo(x + 50, y - 46);
      g.lineTo(x + 34, y - 18);
      g.lineTo(x + 42, y - 14);
      g.quadraticCurveTo(x + 18, y + 26, x - 26, y + 30);
      g.closePath();
      g.fill();
      cut(g, () => {
        g.beginPath();
        g.moveTo(x - 6, y + 6);
        g.quadraticCurveTo(x + 8, y - 10, x + 30, y - 22);
        g.lineWidth = 4;
        g.stroke();
      });
      g.lineWidth = 3.5;
      g.beginPath();
      g.arc(x - 18, y + 38, 8, 0, Math.PI * 2);
      g.stroke();
    }
  });
  function veins(g, x, y, ang, len, wd, depth, r) {
    if (depth <= 0 || len < 4) return;
    let px = x, py = y, a = ang;
    g.lineCap = "round";
    for (let i = 0; i < 6; i++) {
      a += (r() - 0.5) * 0.7;
      const nx = px + Math.cos(a) * len / 6, ny = py + Math.sin(a) * len / 6;
      g.lineWidth = Math.max(0.6, wd * (1 - i / 7));
      g.beginPath();
      g.moveTo(px, py);
      g.lineTo(nx, ny);
      g.stroke();
      px = nx;
      py = ny;
      if (r() < 0.32) veins(g, px, py, a + (r() < 0.5 ? -1 : 1) * (0.5 + r() * 0.6), len * 0.55, wd * 0.6, depth - 1, r);
    }
  }
  function corrupted(lines2, size, seed) {
    return (g, w, h2) => {
      const C2 = "#3a0d52", r = rng(seed);
      g.fillStyle = C2;
      g.strokeStyle = C2;
      const ys = lines2.length === 1 ? [h2 / 2] : [h2 / 2 - size * 0.55, h2 / 2 + size * 0.55];
      let maxW = 0;
      lines2.forEach((t, i) => {
        const s = text(g, t, w / 2, ys[i], "Pirata One", size, { max: 320 });
        g.font = s + "px 'Pirata One'";
        maxW = Math.max(maxW, g.measureText(t).width);
      });
      const top = ys[0] - size * 0.42, bot = ys[ys.length - 1] + size * 0.42, L = w / 2 - maxW / 2, R = w / 2 + maxW / 2;
      for (let i = 0; i < 11; i++) {
        const side = r();
        let x, y, a;
        if (side < 0.35) {
          x = L + r() * (R - L);
          y = top;
          a = -Math.PI / 2;
        } else if (side < 0.7) {
          x = L + r() * (R - L);
          y = bot;
          a = Math.PI / 2;
        } else if (side < 0.85) {
          x = L;
          y = top + r() * (bot - top);
          a = Math.PI;
        } else {
          x = R;
          y = top + r() * (bot - top);
          a = 0;
        }
        veins(g, x, y, a + (r() - 0.5) * 0.8, 20 + r() * 30, 2.6, 2, r);
      }
    };
  }
  function ownWords(t, font, size, col, extra) {
    return (g, w, h2) => {
      g.fillStyle = col || INK;
      g.strokeStyle = col || INK;
      text(g, t, w / 2, h2 / 2, font, size, { max: 330 });
      if (extra) extra(g, w, h2);
    };
  }
  var PINKGLOW = "#ff4fd8";

  // shared/ink/live.js
  var { INK: INK2, YEL: YEL3, YEL2: YEL22, GRN: GRN2, PINKGLOW: PINKGLOW2, CW: CW2, CH: CH2 } = live_art_exports;
  var GAME_FONT = {
    "Black Ops One": "'Saira Stencil One', 'Archivo Black', sans-serif",
    "Stardos Stencil": "'Saira Stencil One', sans-serif",
    "Rye": "'Archivo Black', serif",
    "Bungee": "'Archivo Black', sans-serif",
    "Shrikhand": "'Pacifico', cursive",
    "Pinyon Script": "'Satisfy', cursive",
    "Great Vibes": "'Satisfy', cursive",
    "Permanent Marker": "'Caveat-Bold', 'Caveat', cursive",
    "Press Start 2P": "'Courier New', monospace",
    "Special Elite": "'Courier New', monospace",
    "Sedgwick Ave Display": "'Calligraffitti', cursive",
    "UnifrakturMaguntia": "'Old English Text MT', serif"
  };
  var loadedFonts = /* @__PURE__ */ new Set();
  setFontOf((f) => (loadedFonts.has(f) ? "'" + f + "', " : "") + (GAME_FONT[f] || "'" + f + "', sans-serif"));
  var fontCss = (size, f) => size + "px " + ((loadedFonts.has(f) ? "'" + f + "', " : "") + (GAME_FONT[f] || "sans-serif"));
  var num0 = (v, d, max) => {
    const x = Number(v);
    return v === "" || v == null || !Number.isFinite(x) ? d : Math.max(0, Math.min(max || 999999999, Math.round(x)));
  };
  var txt0 = (v, d, max) => typeof v === "string" && v.trim() ? v.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, max || 24) : d;
  var MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  var dateWord = (ms) => {
    const d = new Date(Number(ms));
    return isNaN(d) ? "" : MONTHS[d.getMonth()] + " " + String(d.getDate()).padStart(2, "0");
  };
  function cleanValues(v) {
    const o = {};
    if (!v || typeof v !== "object") return o;
    if (v.n != null) {
      const n = num0(v.n, null, 99999);
      if (n != null) o.n = n;
    }
    if (v.c != null) {
      const n = num0(v.c, null, 99);
      if (n != null) o.c = n;
    }
    if (v.num != null) {
      const n = num0(v.num, null);
      if (n != null) o.num = n;
    }
    if (typeof v.t === "string") {
      const t = txt0(v.t, null, 28);
      if (t) o.t = t;
    }
    for (const k2 of ["d", "due"]) if (v[k2] != null) {
      const n = num0(v[k2], null, 4e12);
      if (n) o[k2] = n;
    }
    if (Array.isArray(v.list)) {
      const l = v.list.map((x) => txt0(x, null, 16)).filter(Boolean).slice(0, 6);
      if (l.length) o.list = l;
    }
    if (v.more != null) {
      const n = num0(v.more, null, 9999);
      if (n) o.more = n;
    }
    if (Array.isArray(v.rows)) {
      const r = v.rows.filter((x) => Array.isArray(x)).map((x) => [txt0(x[0], null, 10), num0(x[1], 0, 999)]).filter((x) => x[0]).slice(0, 4);
      if (r.length) o.rows = r;
    }
    const k = (x, lo, hi) => {
      const n = Number(x);
      return Number.isFinite(n) && n > 0 ? Math.round(Math.max(lo, Math.min(hi, n)) * 100) / 100 : null;
    };
    if (v.sz != null) {
      const n = k(v.sz, 0.25, 4);
      if (n && n !== 1) o.sz = n;
    }
    if (v.sw != null) {
      const n = k(v.sw, 0.5, 2);
      if (n && n !== 1) o.sw = n;
    }
    if (v.sh != null) {
      const n = k(v.sh, 0.5, 2);
      if (n && n !== 1) o.sh = n;
    }
    if (typeof v.farm === "string" && /^[\w:.-]{1,48}$/.test(v.farm)) o.farm = v.farm;
    for (const f of ["at", "heal", "fade"]) if (v[f] != null) {
      const n = num0(v[f], null, 4e12);
      if (n) o[f] = n;
    }
    if (v.keep) o.keep = 1;
    if (typeof v.trophy === "string" && /^[a-z0-9-]{1,24}$/.test(v.trophy)) o.trophy = v.trophy;
    return o;
  }
  var text2 = text;
  var pct = (n) => Math.max(0, Math.min(100, n)) / 100;
  function tallyCount(g, x, y, n, h2, w, font) {
    tally(g, x, y, Math.min(n, 25), h2);
  }
  function smileText(g, t, cx, textY, R, font) {
    g.font = font;
    g.textAlign = "center";
    g.textBaseline = "middle";
    const span = g.measureText(t).width / R, cy = textY - R;
    let a = Math.PI / 2 + span / 2;
    for (const ch of t) {
      const da = g.measureText(ch).width / R, mid = a - da / 2;
      g.save();
      g.translate(cx + Math.cos(mid) * R, cy + Math.sin(mid) * R);
      g.rotate(mid - Math.PI / 2);
      g.fillText(ch, 0, 0);
      g.restore();
      a -= da;
    }
  }
  var LIVE = [
    {
      name: "LiveFarmProperty",
      title: "Farm Property (your number)",
      sheet: 1,
      where: "neck or hip",
      fields: ["num"],
      sample: { num: 123456 },
      draw: (g, w, h2, V) => {
        g.lineWidth = 4;
        g.strokeRect(36, 46, w - 72, h2 - 92);
        text2(g, "PROPERTY OF B&B FARM", w / 2, 84, "Stardos Stencil", 30, { max: w - 100 });
        barcode(g, 70, 108, w - 140, 58, V.num || 7);
        text2(g, "N\xBA " + V.num, w / 2, 186, "Black Ops One", 24);
      }
    },
    {
      name: "LiveUsedByStrangers",
      title: "Used By Strangers (keeps count)",
      sheet: 1,
      where: "inner thigh",
      fields: ["n"],
      auto: "used",
      sample: { n: 17 },
      draw: (g, w, h2, V) => {
        text2(g, "USED BY STRANGERS", w / 2, 62, "Permanent Marker", 32, { max: w - 30 });
        tallyCount(g, 60, 108, V.n, 64);
        if (V.n > 25) text2(g, String(V.n), w - 40, 212, "Permanent Marker", 30);
      }
    },
    {
      name: "LiveTimesBred",
      title: "Times Bred (keeps count)",
      sheet: 2,
      where: "inner thigh",
      fields: ["n"],
      auto: "loads",
      sample: { n: 23 },
      draw: (g, w, h2, V) => {
        text2(g, "BRED", w / 2, 56, "Black Ops One", 40);
        tallyCount(g, 54, 96, V.n, 62);
        text2(g, String(V.n), w - 50, 200, "Black Ops One", 26);
      }
    },
    {
      name: "LiveLitters",
      title: "Litters (keeps count)",
      sheet: 2,
      where: "lower belly",
      fields: ["n"],
      auto: "litters",
      sample: { n: 7 },
      draw: (g, w, h2, V) => {
        g.lineWidth = 4;
        g.beginPath();
        g.roundRect(70, 50, w - 140, h2 - 100, 24);
        g.stroke();
        text2(g, "LITTERS", w / 2, 92, "Rye", 34);
        text2(g, String(V.n), w / 2, 140, "Rye", 58, { max: w - 170 });
        const k = Math.min(7, V.n);
        for (let i = 0; i < k; i++) {
          heart(g, w / 2 - (k - 1) * 15 + i * 30, 188, 7);
          g.fill();
        }
      }
    },
    {
      name: "LiveLitresMilked",
      title: "Litres Milked (keeps count)",
      sheet: 2,
      where: "above a breast",
      fields: ["n"],
      auto: "milked",
      sample: { n: 412 },
      draw: (g, w, h2, V) => {
        jug(g, 92, h2 / 2, 74);
        text2(g, V.n + " L", 236, 112, "Bungee", 50, { max: 200 });
        text2(g, "MILKED", 236, 162, "Bungee", 26);
      }
    },
    {
      name: "LiveEggsLaid",
      title: "Eggs Laid (keeps count)",
      sheet: 2,
      where: "a hip",
      fields: ["n"],
      auto: "eggs",
      sample: { n: 96 },
      draw: (g, w, h2, V) => {
        for (const [x, y] of [[70, 120], [100, 104], [96, 146], [128, 128], [66, 158]]) egg(g, x, y, 40);
        text2(g, String(V.n), 250, 108, "Bungee", 62, { max: 190 });
        text2(g, "EGGS LAID", 250, 166, "Bungee", 24);
      }
    },
    {
      name: "LiveDaysDenied",
      title: "Days Since Last Orgasm (keeps count)",
      sheet: 2,
      where: "low belly",
      fields: ["n"],
      auto: "denied",
      sample: { n: 12 },
      draw: (g, w, h2, V) => {
        g.fillStyle = "#1f6b3a";
        g.fillRect(34, 40, w - 68, h2 - 80);
        g.fillStyle = "#fff";
        text2(g, "THIS SLUT HAS GONE", w / 2, 72, "Black Ops One", 18);
        g.fillRect(w / 2 - 44, 92, 88, 64);
        g.fillStyle = "#1f6b3a";
        text2(g, String(V.n), w / 2, 125, "Black Ops One", 48, { max: 80 });
        g.fillStyle = "#fff";
        text2(g, V.n === 1 ? "DAY WITHOUT CUMMING" : "DAYS WITHOUT CUMMING", w / 2, 180, "Black Ops One", 18);
      }
    },
    {
      name: "LiveOwnedBy",
      title: "Owned By (a name)",
      sheet: 2,
      where: "a hip or above the heart",
      fields: ["t"],
      dflt: "owner",
      sample: { t: "Mistress" },
      draw: (g, w, h2, V) => {
        text2(g, "owned by", w / 2, 64, "Pinyon Script", 30);
        text2(g, V.t, w / 2, 126, "Great Vibes", 72, { max: 300 });
        g.lineWidth = 2.5;
        g.beginPath();
        g.moveTo(80, 172);
        g.quadraticCurveTo(w / 2, 150, w - 80, 172);
        g.stroke();
        padlock(g, w / 2, 200, 22);
      }
    },
    {
      name: "LiveStockNumber",
      title: "Stock Number (your number)",
      sheet: 2,
      where: "back of the neck",
      fields: ["num"],
      sample: { num: 123456 },
      draw: (g, w, h2, V) => {
        g.save();
        g.translate(w * 0.72, h2 / 2);
        g.rotate(-Math.PI / 2);
        barcode(g, -90, -45, 180, 90, V.num || 11);
        g.restore();
        text2(g, "STOCK", 112, 105, "Stardos Stencil", 30);
        text2(g, "N\xBA " + V.num, 112, 145, "Stardos Stencil", 22, { max: 170 });
      }
    },
    {
      name: "LiveLocked",
      title: "Locked (keyholder's name)",
      sheet: 2,
      where: "above the heart",
      fields: ["t"],
      dflt: "owner",
      sample: { t: "Mistress" },
      draw: (g, w, h2, V) => {
        padlock(g, w / 2 - 50, h2 / 2, 70);
        key(g, w / 2 + 30, h2 / 2 + 10, 90);
        text2(g, "keyholder: " + V.t, w / 2, h2 - 30, "Pinyon Script", 30, { max: w - 20 });
      }
    },
    {
      name: "LiveBredByBB",
      title: "Bred By B&B",
      sheet: 3,
      where: "lower belly",
      fields: [],
      sample: {},
      logo: true,
      draw: (g, w, h2) => {
        arcText(g, "BRED BY", w / 2, 50, 200, "Shrikhand", 40);
        logo(g, "letters", w / 2, 138, 96);
        text2(g, "\u2605 PREMIUM STOCK \u2605", w / 2, 216, "Rye", 20);
      }
    },
    {
      name: "LiveEarTag",
      title: "B&B Ear Tag (your number)",
      sheet: 3,
      where: "a hip",
      fields: ["num"],
      sample: { num: 123456 },
      logo: true,
      draw: (g, w, h2, V) => {
        g.fillStyle = "#e3b021";
        earTag(g, w / 2, 22, 210, 206);
        g.fill("nonzero");
        g.strokeStyle = INK2;
        g.lineWidth = 4;
        earTag(g, w / 2, 22, 210, 206);
        g.stroke();
        cut(g, () => {
          g.beginPath();
          g.arc(w / 2, 46, 11, 0, Math.PI * 2);
          g.fill();
        });
        g.fillStyle = INK2;
        logo(g, "letters", w / 2, 128, 64);
        text2(g, String(V.num), w / 2, 192, "Black Ops One", 34, { max: 180 });
      }
    },
    {
      name: "LiveCumTank",
      title: "Cum Tank (how full you are)",
      sheet: 4,
      where: "the belly",
      fields: ["n"],
      auto: "tank",
      sample: { n: 90 },
      draw: (g, w, h2, V) => {
        const cx = w / 2, cy = 152, R = 104;
        g.lineCap = "butt";
        g.lineWidth = 7;
        g.beginPath();
        g.arc(cx, cy, R, Math.PI * 1.1, Math.PI * 1.9);
        g.stroke();
        for (let i = 0; i <= 8; i++) {
          const a2 = Math.PI * (1.1 + 0.8 * i / 8), big = i % 4 === 0, r0 = big ? R - 26 : R - 15;
          g.lineWidth = big ? 6 : 3.5;
          g.beginPath();
          g.moveTo(cx + Math.cos(a2) * r0, cy + Math.sin(a2) * r0);
          g.lineTo(cx + Math.cos(a2) * (R - 3), cy + Math.sin(a2) * (R - 3));
          g.stroke();
        }
        for (const [t, f] of [["E", 1.1], ["\xBD", 1.5], ["F", 1.9]]) {
          const a2 = Math.PI * f;
          text2(g, t, cx + Math.cos(a2) * (R - 46), cy + Math.sin(a2) * (R - 46), "Black Ops One", 24);
        }
        const a = Math.PI * (1.1 + 0.8 * pct(V.n));
        g.lineWidth = 7;
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(cx, cy);
        g.lineTo(cx + Math.cos(a) * (R - 24), cy + Math.sin(a) * (R - 24));
        g.stroke();
        g.beginPath();
        g.arc(cx, cy, 11, 0, Math.PI * 2);
        g.fill();
        text2(g, "CUM TANK", cx, cy + 46, "Black Ops One", 30);
        drop(g, cx - 106, cy + 44, 12);
        drop(g, cx + 106, cy + 44, 12);
      }
    },
    {
      name: "LiveBreedingFacts",
      title: "Breeding Facts (keeps count)",
      sheet: 4,
      where: "the small of the back",
      fields: ["n"],
      auto: "loads",
      sample: { n: 23 },
      draw: (g, w, h2, V) => {
        const x0 = 94, y0 = 12, W25 = 192, H2 = 226;
        g.lineWidth = 3;
        g.strokeRect(x0, y0, W25, H2);
        const L = (t, size, bold, yy, right) => {
          g.font = (bold ? "900 " : "") + size + "px Arial";
          g.textAlign = "left";
          g.textBaseline = "middle";
          g.fillText(t, x0 + 8, yy);
          if (right != null) {
            g.textAlign = "right";
            g.fillText(right, x0 + W25 - 8, yy);
          }
        };
        L("Breeding Facts", 21, true, y0 + 21);
        g.fillRect(x0 + 6, y0 + 37, W25 - 12, 1.5);
        L("Serving size", 12, false, y0 + 49, "1 load");
        L("Servings per day", 12, false, y0 + 64, "as many as fit");
        g.fillRect(x0 + 6, y0 + 75, W25 - 12, 8);
        L("Amount per serving", 11, true, y0 + 93);
        L("Loads taken", 21, true, y0 + 113, String(V.n));
        g.fillRect(x0 + 6, y0 + 126, W25 - 12, 4);
        [["Cum", "100%"], ["Seed that took", "100%"], ["Holes open", "3"], ["Dignity", "0%"]].forEach(([a, b], i) => {
          L(a, 12, i < 2, y0 + 142 + i * 17, b);
          g.fillRect(x0 + 6, y0 + 151 + i * 17, W25 - 12, 1);
        });
        L("* bred fresh at B&B Farm", 10, false, y0 + 214);
      }
    },
    {
      name: "LiveLoading",
      title: "Loading (how far along you are)",
      sheet: 4,
      where: "the belly",
      fields: ["n"],
      auto: "loading",
      sample: { n: 80 },
      draw: (g, w, h2, V) => {
        text2(g, "LOADING...", w / 2, 62, "Press Start 2P", 22);
        g.lineWidth = 5;
        g.strokeRect(46, 96, 288, 50);
        const k = Math.round(8 * pct(V.n));
        for (let i = 0; i < k; i++) g.fillRect(56 + i * 34.5, 106, 28, 30);
        text2(g, "BREEDING " + Math.min(100, V.n) + "%", w / 2, 178, "Press Start 2P", 15);
        text2(g, "please do not unplug", w / 2, 210, "Press Start 2P", 9);
      }
    },
    {
      name: "LiveLipstickKisses",
      title: "Lipstick Kisses (signed)",
      sheet: 4,
      where: "a butt cheek",
      fields: ["t"],
      sample: { t: "Mistress" },
      draw: (g, w, h2, V) => {
        g.fillStyle = "#c41e3a";
        lips(g, 108, 84, 46, -0.32);
        lips(g, 268, 74, 40, 0.28);
        lips(g, 196, 150, 44, 0.06);
        text2(g, "kissed by " + V.t, w / 2, 218, "Great Vibes", 36, { max: w - 20 });
      }
    },
    {
      name: "LiveWouldBreedAgain",
      title: "\u2605\u2605\u2605\u2605\u2605 Would Breed Again (signed)",
      sheet: 4,
      where: "a thigh",
      fields: ["t"],
      sample: { t: "Big Red" },
      draw: (g, w, h2, V) => {
        g.lineWidth = 3;
        g.beginPath();
        g.roundRect(34, 32, 312, 182, 16);
        g.stroke();
        g.fillStyle = "#d9a400";
        for (let i = 0; i < 5; i++) {
          star(g, w / 2 - 96 + i * 48, 80, 20);
          g.fill();
        }
        g.lineWidth = 2;
        g.strokeStyle = INK2;
        for (let i = 0; i < 5; i++) {
          star(g, w / 2 - 96 + i * 48, 80, 20);
          g.stroke();
        }
        g.fillStyle = INK2;
        text2(g, "\u201Cwould breed again\u201D", w / 2, 138, "Great Vibes", 40);
        g.font = "13px Arial";
        g.textAlign = "center";
        g.fillText(V.t + ", verified owner \u2713", w / 2, 186);
      }
    },
    {
      name: "LiveGuestbook",
      title: "Bred By (a guestbook)",
      sheet: 5,
      where: "an inner thigh",
      fields: ["list", "more"],
      auto: "studs",
      sample: { list: ["Big Red", "the Bull", "Goblin #3", "Stud 7"], more: 19 },
      draw: (g, w, h2, V) => {
        text2(g, "Bred by:", 72, 30, "Pinyon Script", 32, { align: "left" });
        const F = [["Great Vibes", 36], ["Permanent Marker", 24], ["Rye", 24], ["Special Elite", 22]];
        (V.list || []).slice(0, 4).forEach((n, i) => {
          const y = 72 + i * 38;
          text2(g, n, 90, y, F[i][0], F[i][1], { align: "left", max: 220 });
          g.fillRect(70, y + 15, 240, 1.4);
        });
        if (V.more) text2(g, "+ " + V.more + " more", 310, 232, "Pinyon Script", 22, { align: "right" });
      }
    },
    {
      name: "LiveBreedingCard",
      title: "Breeding Card (a punch a load)",
      sheet: 5,
      where: "a butt cheek",
      fields: ["n"],
      auto: "punches",
      sample: { n: 7 },
      draw: (g, w, h2, V) => {
        const cx = w / 2;
        g.lineWidth = 3;
        g.beginPath();
        g.roundRect(36, 26, 308, 198, 14);
        g.stroke();
        text2(g, "B&B BREEDING CARD", cx, 54, "Black Ops One", 22);
        text2(g, "every tenth load's on the house", cx, 80, "Special Elite", 15);
        const k = Math.min(10, V.n);
        for (let i = 0; i < 10; i++) {
          const x = 96 + i % 5 * 47, y = 126 + Math.floor(i / 5) * 54;
          g.lineWidth = 2.5;
          g.beginPath();
          g.arc(x, y, 18, 0, Math.PI * 2);
          g.stroke();
          if (i < k) {
            heart(g, x, y + 4, 12);
            g.fill();
          } else if (i === 9) text2(g, "FREE", x, y, "Black Ops One", 12);
        }
      }
    },
    {
      name: "LiveTrapPassport",
      title: "Trap Passport (a stamp a trap)",
      sheet: 5,
      where: "a shoulder blade",
      fields: ["list"],
      auto: "passport",
      sample: { list: ["B&B FARM", "THE BARN", "B&B FARM", "THE FIELD"] },
      draw: (g, w, h2, V) => {
        const L = (V.list || []).map((x) => String(x).toUpperCase());
        if (L[0]) {
          g.fillStyle = "#5b2a86";
          g.strokeStyle = "#5b2a86";
          g.lineWidth = 4;
          g.beginPath();
          g.arc(104, 92, 62, 0, Math.PI * 2);
          g.stroke();
          g.lineWidth = 2;
          g.beginPath();
          g.arc(104, 92, 40, 0, Math.PI * 2);
          g.stroke();
          arcText(g, L[0], 104, 41, 51, "Black Ops One", 15);
          arcTextLow(g, "SURVIVED", 104, 143, 51, "Black Ops One", 14);
          text2(g, "B&B", 104, 92, "Black Ops One", 15);
        }
        if (L[1]) {
          g.fillStyle = "#b3122e";
          g.strokeStyle = "#b3122e";
          g.save();
          g.translate(276, 74);
          g.rotate(0.14);
          g.lineWidth = 4;
          g.strokeRect(-82, -40, 164, 80);
          text2(g, L[1], 0, -12, "Black Ops One", 24, { max: 150 });
          text2(g, "ENTERED \xB7 TAKEN", 0, 18, "Black Ops One", 13);
          g.restore();
        }
        if (L[2]) {
          g.fillStyle = "#1d3f8f";
          g.strokeStyle = "#1d3f8f";
          g.save();
          g.translate(176, 196);
          g.rotate(-0.08);
          g.lineWidth = 4;
          g.beginPath();
          g.ellipse(0, 0, 84, 40, 0, 0, Math.PI * 2);
          g.stroke();
          text2(g, L[2], 0, -10, "Black Ops One", 22, { max: 140 });
          text2(g, "WENT IN, CAME OUT", 0, 16, "Black Ops One", 13);
          g.restore();
        }
        if (L[3]) {
          g.fillStyle = GRN2;
          g.strokeStyle = GRN2;
          g.save();
          g.translate(318, 182);
          g.rotate(-0.2);
          g.lineWidth = 3.5;
          g.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = i / 6 * Math.PI * 2;
            g.lineTo(Math.cos(a) * 46, Math.sin(a) * 46);
          }
          g.closePath();
          g.stroke();
          text2(g, L[3], 0, -8, "Black Ops One", 15, { max: 76 });
          text2(g, "USED", 0, 12, "Black Ops One", 14);
          g.restore();
        }
        speckle(g, 17, 1600, w, h2);
      }
    },
    {
      name: "LiveHighScores",
      title: "High Scores (who's bred you most)",
      sheet: 5,
      where: "a thigh",
      fields: ["rows"],
      auto: "scores",
      sample: { rows: [["BIG RED", 23], ["THE BULL", 17], ["GOBLIN", 12], ["STUD 7", 9]] },
      draw: (g, w, h2, V) => {
        text2(g, "HIGH SCORES", w / 2, 36, "Press Start 2P", 19);
        g.font = fontCss(9, "Press Start 2P");
        g.textBaseline = "middle";
        g.textAlign = "left";
        g.fillText("RANK", 44, 70);
        g.fillText("NAME", 112, 70);
        g.textAlign = "right";
        g.fillText("LOADS", 336, 70);
        (V.rows || []).slice(0, 4).forEach(([b, c], i) => {
          const y = 100 + i * 28;
          g.font = fontCss(13, "Press Start 2P");
          g.textAlign = "left";
          g.fillText(["1ST", "2ND", "3RD", "4TH"][i], 44, y);
          g.fillText(String(b).toUpperCase().slice(0, 10), 112, y);
          g.textAlign = "right";
          g.fillText(String(c).padStart(2, "0"), 336, y);
        });
        text2(g, "PRESS START TO BREED", w / 2, 226, "Press Start 2P", 10);
      }
    },
    {
      name: "LiveTied",
      title: "Tied \xD7 (keeps count)",
      sheet: 5,
      where: "a hip",
      fields: ["n"],
      auto: "tied",
      sample: { n: 7 },
      draw: (g, w, h2, V) => {
        flash(g, () => canine(g, 70, 150, 190, -0.42), "#d9577a", 4);
        g.fillStyle = INK2;
        text2(g, "\xD7" + V.n, 296, 92, "Black Ops One", 64, { max: 150 });
        banner(g, w / 2, 196, 180, 44, YEL3, YEL22, "TIED", "Rye", 30);
      }
    },
    {
      name: "LiveBredOn",
      title: "Bred On (a date stamp)",
      sheet: 6,
      where: "a hip",
      fields: ["d", "due"],
      auto: "bredOn",
      sample: { d: Date.UTC(2026, 10, 17, 12), due: Date.UTC(2027, 7, 9, 12) },
      style: "stamp",
      color: "#1d3f8f",
      draw: (g, w, h2, V) => {
        const cx = w / 2;
        g.lineWidth = 5;
        g.strokeRect(70, 46, 240, 160);
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(80, 124);
        g.lineTo(300, 124);
        g.stroke();
        text2(g, "BRED ON", cx, 74, "Black Ops One", 26);
        text2(g, dateWord(V.d), cx, 104, "Black Ops One", 30);
        text2(g, "DUE", cx, 146, "Black Ops One", 20);
        text2(g, V.due ? dateWord(V.due) : "SOON", cx, 178, "Black Ops One", 30);
      }
    },
    {
      name: "LiveHeatCrest",
      title: "Heat Crest (fills as your heat rises)",
      sheet: 7,
      where: "over the womb",
      fields: ["n"],
      auto: "heat",
      sample: { n: 66 },
      style: "glow",
      color: PINKGLOW2,
      draw: (g, w, h2, V) => {
        const cx = w / 2, cy = 116, k = Math.round(12 * pct(V.n));
        g.lineCap = "butt";
        for (let i = 0; i < 12; i++) {
          const a0 = -Math.PI / 2 + i / 12 * Math.PI * 2 + 0.04, a1 = a0 + Math.PI * 2 / 12 - 0.08;
          g.lineWidth = 14;
          g.beginPath();
          g.arc(cx, cy, 84, a0, a1);
          if (i < k) g.stroke();
          else {
            g.lineWidth = 2;
            g.beginPath();
            g.arc(cx, cy, 91, a0, a1);
            g.arc(cx, cy, 77, a1, a0, true);
            g.closePath();
            g.stroke();
          }
        }
        g.lineWidth = 5;
        heart(g, cx, cy + 22, 44);
        g.stroke();
        g.lineWidth = 3;
        arrowDown(g, cx, cy + 34, 20, 3);
      }
    },
    // THE WOMB MARK (Nov 19, Laynie: "I love it"): the womb crest, twenty little hearts in a smile under it, one inked in
    // for every litter; while she's carryin' the womb fills hot pink with a white dot for each one in there, and the whole
    // mark glows; at twenty litters, BABY FACTORY underneath. n: litters, c: how many she's carryin' now (0: not).
    {
      name: "LiveWombMark",
      title: "Womb Mark (fills with every litter)",
      sheet: 7,
      where: "over the womb",
      fields: ["n", "c"],
      auto: "womb",
      sample: { n: 0, c: 0 },
      draw: (g, w, h2, V) => {
        const cx = w / 2, cy = 96, s = 110, n = Math.max(0, Math.min(20, V.n | 0)), c = Math.max(0, Math.min(99, V.c | 0));
        const hearts = (fill2) => {
          for (let i = 0; i < 20; i++) {
            const a = Math.PI * (0.11 + 0.78 * i / 19), x = cx - Math.cos(a) * 138, y = cy + 48 + Math.sin(a) * 60;
            g.lineWidth = 1.7;
            heart(g, x, y + 4, 9);
            if (i < n && fill2) g.fill();
            else g.stroke();
          }
        };
        if (c) {
          for (const blur of [18, 8]) {
            g.save();
            g.shadowColor = PINKGLOW2;
            g.shadowBlur = blur;
            wombCrest(g, cx, cy, s, PINKGLOW2);
            g.fillStyle = g.strokeStyle = PINKGLOW2;
            hearts(true);
            g.restore();
          }
        }
        g.fillStyle = g.strokeStyle = INK2;
        wombCrest(g, cx, cy, s, INK2);
        g.fillStyle = g.strokeStyle = INK2;
        hearts(true);
        if (c) {
          g.fillStyle = PINK;
          heart(g, cx, cy + 2.2, s * 0.26 - 3);
          g.fill();
          g.fillStyle = "#ffffff";
          const k = Math.min(9, c);
          for (let i = 0; i < k; i++) {
            const row = i < 5 ? 0 : 1, inRow = row ? k - 5 : Math.min(5, k), j = row ? i - 5 : i;
            g.beginPath();
            g.arc(cx - (inRow - 1) * 5.5 + j * 11, cy - 10 + row * 11, 2.9, 0, Math.PI * 2);
            g.fill();
          }
        }
        if (n >= 20) {
          g.fillStyle = INK2;
          smileText(g, "BABY FACTORY", cx, 236, 460, "900 27px Georgia, 'Times New Roman', serif");
        }
      }
    },
    {
      name: "LiveWordsBlackletter",
      title: "Your Words: Blackletter",
      sheet: 7,
      where: "anywhere",
      fields: ["t"],
      sample: { t: "Breeding Stock" },
      draw: (g, w, h2, V) => text2(g, V.t, w / 2, h2 / 2, "UnifrakturMaguntia", 58, { max: 330 })
    },
    {
      name: "LiveWordsScript",
      title: "Your Words: Script",
      sheet: 7,
      where: "anywhere",
      fields: ["t"],
      sample: { t: "Good Girl" },
      draw: (g, w, h2, V) => text2(g, V.t, w / 2, h2 / 2, "Great Vibes", 92, { max: 330 })
    },
    {
      name: "LiveWordsTypewriter",
      title: "Your Words: Typewriter",
      sheet: 7,
      where: "anywhere",
      fields: ["t"],
      sample: { t: "used goods" },
      draw: (g, w, h2, V) => {
        text2(g, V.t, w / 2, h2 / 2, "Special Elite", 48, { max: 300 });
        g.lineWidth = 2;
        g.strokeRect(34, h2 / 2 - 36, w - 68, 72);
      }
    },
    {
      name: "LiveWordsGraffiti",
      title: "Your Words: Graffiti",
      sheet: 7,
      where: "anywhere",
      fields: ["t"],
      sample: { t: "cum dump" },
      color: "#1d3f8f",
      draw: (g, w, h2, V) => {
        g.fillStyle = "#1d3f8f";
        g.strokeStyle = "#1d3f8f";
        text2(g, V.t, w / 2, h2 / 2, "Sedgwick Ave Display", 84, { max: 330 });
        dripFrom(g, w, h2, 40, 340, 5, 6);
      }
    }
  ];
  var LIVE_BY = Object.fromEntries(LIVE.map((d) => [d.name, d]));
  var isLive = (name) => !!LIVE_BY[name];
  function valuesFor(d, written, who2) {
    const V = Object.assign({}, d.sample, cleanValues(written));
    if (d.fields.includes("num") && !(written && written.num != null) && who2 && who2.num) V.num = who2.num;
    if (d.dflt === "owner" && !(written && written.t) && who2 && who2.owner) V.t = who2.owner;
    if (V.n == null) V.n = 0;
    delete V.sz;
    delete V.sw;
    delete V.sh;
    return V;
  }
  var MID = "#808080";
  var doc = null;
  var mk = (w, h2) => {
    const c = doc.createElement("canvas");
    c.width = w || CW2;
    c.height = h2 || CH2;
    return c;
  };
  function tinted(src, col, blur, dx, dy, alpha) {
    const c = mk(src.width, src.height), g = c.getContext("2d");
    try {
      g.filter = blur ? "blur(" + blur + "px)" : "none";
    } catch (e) {
    }
    g.globalAlpha = alpha == null ? 1 : alpha;
    g.drawImage(src, dx || 0, dy || 0);
    try {
      g.filter = "none";
    } catch (e) {
    }
    g.globalAlpha = 1;
    g.globalCompositeOperation = "source-in";
    g.fillStyle = col;
    g.fillRect(0, 0, c.width, c.height);
    return c;
  }
  function speckled(src, seed) {
    const c = tinted(src, MID), g = c.getContext("2d"), r = rng(seed), w = c.width, h2 = c.height;
    g.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 1400; i++) {
      g.globalAlpha = 0.3 + r() * 0.7;
      g.beginPath();
      g.arc(r() * w, r() * h2, 0.5 + r() * 1.8, 0, Math.PI * 2);
      g.fill();
    }
    for (let i = 0; i < 5; i++) {
      g.globalAlpha = 0.18 + r() * 0.2;
      g.fillRect(0, r() * h2, w, 6 + r() * 16);
    }
    return c;
  }
  var lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
  function splitColours(c, pal) {
    if (!pal || !pal.length) pal = [[22, 18, 28]];
    const w = c.width, h2 = c.height, src = c.getContext("2d").getImageData(0, 0, w, h2).data;
    const outs = pal.map(() => {
      const o = mk(w, h2), g = o.getContext("2d");
      return { o, g, img: g.createImageData(w, h2) };
    });
    const L = pal.map((p) => lum(...p));
    for (let i = 0; i < src.length; i += 4) {
      const a = src[i + 3];
      if (!a) continue;
      const r = src[i], g = src[i + 1], b = src[i + 2];
      let k = 0, bd = 1e12;
      for (let j = 0; j < pal.length; j++) {
        const p = pal[j], e = (p[0] - r) ** 2 + (p[1] - g) ** 2 + (p[2] - b) ** 2;
        if (e < bd) {
          bd = e;
          k = j;
        }
      }
      const v = L[k] < 40 ? 128 : Math.max(0, Math.min(255, Math.round(128 * lum(r, g, b) / L[k])));
      const D = outs[k].img.data;
      D[i] = D[i + 1] = D[i + 2] = v;
      D[i + 3] = a;
    }
    return outs.map((x) => {
      x.g.putImageData(x.img, 0, 0);
      return x.o;
    });
  }
  function colourName(rgb) {
    const [r, g, b] = rgb, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = lum(r, g, b), s = mx ? (mx - mn) / mx : 0;
    if (s < 0.18) return l < 70 ? "Ink" : l > 200 ? "White" : "Grey";
    let hue = 0;
    const dd = mx - mn;
    if (mx === r) hue = (g - b) / dd % 6;
    else if (mx === g) hue = (b - r) / dd + 2;
    else hue = (r - g) / dd + 4;
    hue = (hue * 60 + 360) % 360;
    if (l < 60) return "Ink";
    if (hue >= 15 && hue < 50 && l < 120) return "Brown";
    if (hue < 15 || hue >= 345) return "Red";
    if (hue < 40) return "Orange";
    if (hue < 52) return "Gold";
    if (hue < 70) return "Yellow";
    if (hue < 165) return "Green";
    if (hue < 200) return "Teal";
    if (hue < 255) return "Blue";
    if (hue < 290) return "Purple";
    return "Pink";
  }
  function layersFor(pal, pre) {
    const used = {};
    return pal.map((p) => {
      let n = pal.length === 1 ? "Ink" : colourName(p);
      used[n] = (used[n] || 0) + 1;
      if (used[n] > 1) n += used[n];
      return { name: (pre || "") + n, color: "#" + p.map((v) => v.toString(16).padStart(2, "0")).join(""), colorize: true };
    });
  }
  function layersOf(base, m) {
    const out = {}, L = m.layers || [];
    if (L.some((l) => l.name === "Stamp")) {
      out.Stamp = speckled(base, 3);
      return out;
    }
    if (L.some((l) => l.name === "Glow")) {
      out.Glow = tinted(base, MID, 9, 0, 0, 0.95);
      out.GlowInk = tinted(base, MID, 0.4);
      return out;
    }
    const pal = m.pal && m.pal.length ? m.pal : [[22, 18, 28]];
    const parts2 = splitColours(base, pal), names = layersFor(pal).map((l) => l.name);
    names.forEach((n, i) => {
      out[n] = parts2[i];
    });
    return out;
  }
  function drawCard(W25, d, V) {
    doc = W25.document;
    const c = mk(), g = c.getContext("2d");
    g.fillStyle = INK2;
    g.strokeStyle = INK2;
    d.draw(g, CW2, CH2, V);
    return c;
  }
  function shrink(c, box3, s) {
    const [x0, y0, x1, y1] = box3;
    let src = mk(x1 - x0, y1 - y0);
    src.getContext("2d").drawImage(c, -x0, -y0);
    let w = src.width, h2 = src.height;
    const tw = Math.max(1, Math.round(w * s)), th = Math.max(1, Math.round(h2 * s));
    while (w / 2 > tw) {
      const n = mk(Math.round(w / 2), Math.round(h2 / 2)), g2 = n.getContext("2d");
      g2.imageSmoothingQuality = "high";
      g2.drawImage(src, 0, 0, n.width, n.height);
      src = n;
      w = n.width;
      h2 = n.height;
    }
    const out = mk(tw, th), g = out.getContext("2d");
    g.imageSmoothingQuality = "high";
    g.drawImage(src, 0, 0, tw, th);
    return out;
  }
  var cache = /* @__PURE__ */ new Map();
  var CACHE_MAX = 80;
  function picture(W25, d, m, layer, V) {
    const key2 = d.name + "|" + JSON.stringify(V);
    let set2 = cache.get(key2);
    if (set2) {
      cache.delete(key2);
      cache.set(key2, set2);
      return set2[layer] || null;
    }
    if (d.logo && !IMG.letters) return null;
    const base = drawCard(W25, d, V), parts2 = layersOf(base, m);
    set2 = {};
    for (const [n, c] of Object.entries(parts2)) set2[n] = shrink(c, m.box, m.s).toDataURL("image/png");
    cache.set(key2, set2);
    while (cache.size > CACHE_MAX) {
      const old = cache.keys().next().value, os = cache.get(old);
      cache.delete(old);
      for (const u of Object.values(os)) forget(W25, u);
    }
    return set2[layer] || null;
  }
  function forget(W25, url) {
    try {
      const m = W25.GLDrawImageCache;
      if (m && typeof m.delete === "function") m.delete(url);
    } catch (e) {
    }
    try {
      const m = W25.DrawImageCache;
      if (m && typeof m.delete === "function") m.delete(url);
    } catch (e) {
    }
    try {
      const gl = W25.GLDrawCanvas && W25.GLDrawCanvas.GL, tc = gl && gl.textureCache, t = tc && tc.get(url);
      if (t) {
        if (t.texture) gl.deleteTexture(t.texture);
        tc.delete(url);
      }
    } catch (e) {
    }
  }
  var logoAsked = null;
  function loadLiveArt() {
    if (!logoAsked) logoAsked = loadLogo().catch(() => null);
    return logoAsked;
  }

  // shared/ink/panel.js
  var CSS = `
#fi-panel{position:fixed;left:50%;top:4%;transform:translateX(-50%);width:min(620px,96vw);max-height:92vh;max-height:92dvh;overflow-y:auto;z-index:2147483000;
  padding:12px 16px;box-sizing:border-box;background:#211a24;color:#ecdfe8;border:2px solid #b78ac8;border-radius:12px;font:14px/1.45 system-ui,sans-serif;box-shadow:0 6px 30px #000a}
@media (max-width:700px),(pointer:coarse) and (max-width:1000px){#fi-panel{left:0;top:0;transform:none;width:100vw;height:100vh;height:100dvh;max-height:none;border-radius:0;border-width:0;padding:10px 12px}}
#fi-panel h2{margin:0;flex:1;font-family:Bitter,Georgia,serif;color:#d9b3e6;font-size:19px}
#fi-panel .fi-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#fi-panel .fi-card{background:#2b2230;border:1px solid #4a3a52;border-radius:8px;padding:9px 11px;margin:7px 0}
#fi-panel .fi-muted{color:#b3a2b8;font-size:12.5px}
#fi-panel label.fi-slide{display:grid;grid-template-columns:4.2em 1fr 3.4em;align-items:center;gap:8px;margin:3px 0}
#fi-panel input[type=range]{width:100%}
#fi-panel input[type=text],#fi-panel input[type=number]{font:inherit;padding:4px 6px;border-radius:6px;background:#1b151e;color:#ecdfe8;border:1px solid #6e5a78;min-width:0;flex:1}
#fi-panel button{font:inherit;cursor:pointer;border-radius:7px;border:1px solid #8e6aa0;background:#3a2c42;color:#ecdfe8;padding:4px 11px;min-height:30px}
@media (pointer:coarse){#fi-panel input{font-size:16px}#fi-panel button{min-height:40px}}
`;
  var SLOTS = [["FarmInk1", "Ink 1"], ["FarmInk2", "Ink 2"], ["FarmInk3", "Ink 3"], ["FarmInk4", "Ink 4"], ["FarmBrand", "Brand"]];
  var box = null;
  var api = null;
  var Wd = null;
  var note = "";
  var el = (tag, attrs, ...kids) => {
    const e = Wd.document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else if (k === "style") e.style.cssText = v;
      else e.setAttribute(k, v === true ? "" : String(v));
    }
    for (const k of kids.flat()) if (k != null && k !== false) e.append(typeof k === "string" ? Wd.document.createTextNode(k) : k);
    return e;
  };
  var pct2 = (v) => Math.round((Number(v) || 1) * 100);
  function slide(label, min, max, val, onSet) {
    const out = el("span", { class: "fi-muted" }, val + "%");
    const r = el("input", { type: "range", min, max, step: 5, value: val, "aria-label": label, oninput: (e) => {
      out.textContent = e.target.value + "%";
    }, onchange: (e) => onSet(Number(e.target.value) / 100) });
    return el("label", { class: "fi-slide" }, el("span", null, label), r, out);
  }
  function slotCard(slot, name) {
    const w = api.worn().find((x) => x.slot === slot);
    if (!w) return el("div", { class: "fi-card" }, el("b", null, name + ": "), el("span", { class: "fi-muted" }, "empty. Pick a design in the wardrobe (Farm " + name + ")."));
    const own = w.values || {}, kids = [el("div", { class: "fi-row" }, el("b", null, name + ": " + w.title))];
    kids.push(slide("Size", 25, 400, pct2(own.sz), (v) => set(slot, { sz: v === 1 ? null : v })));
    kids.push(slide("Width", 50, 200, pct2(own.sw), (v) => set(slot, { sw: v === 1 ? null : v })));
    kids.push(slide("Height", 50, 200, pct2(own.sh), (v) => set(slot, { sh: v === 1 ? null : v })));
    if (w.live) {
      const f = w.fields || [];
      if (f.includes("t") || f.includes("list") || f.includes("num") || f.includes("n")) {
        const cur = f.includes("t") ? own.t || "" : f.includes("list") ? (own.list || []).join(", ") : f.includes("num") ? own.num != null ? String(own.num) : "" : own.n != null ? String(own.n) : "";
        const hint = f.includes("t") ? "Your words, or a name" : f.includes("list") ? "Names, with commas between" : f.includes("num") ? "A number (yours if empty)" : "A number of your own";
        const inp = el("input", { type: f.includes("t") || f.includes("list") ? "text" : "number", value: cur, placeholder: hint, "aria-label": hint, maxlength: 60 });
        kids.push(el("div", { class: "fi-row", style: "margin-top:6px" }, inp, el("button", { onclick: () => {
          api.command(slotKey(slot) + " " + (String(inp.value).trim() || "clear"));
          note = "Written on " + w.title + ".";
          draw();
        } }, "Write")));
      }
      if (w.auto) kids.push(el(
        "label",
        { class: "fi-row", style: "margin-top:4px" },
        el("input", { type: "checkbox", checked: !own.manual, onchange: (e) => {
          api.command(slotKey(slot) + (e.target.checked ? " auto" : " " + (own.n != null ? own.n : 0)));
          draw();
        } }),
        el("span", null, "Follow the farm's count")
      ));
    }
    kids.push(el("div", { class: "fi-row", style: "margin-top:6px" }, el("button", { onclick: () => {
      set(slot, { sz: null, sw: null, sh: null });
      draw();
    } }, "Normal size")));
    return el("div", { class: "fi-card" }, kids);
  }
  var slotKey = (slot) => slot === "FarmBrand" ? "brand" : slot.slice(-1);
  function set(slot, v) {
    if (api.write(slot, v)) note = "";
    draw();
  }
  function view() {
    return [
      el("div", { class: "fi-row", style: "margin-bottom:6px" }, el("h2", null, "\u{1F58B}\uFE0F Your farm ink"), el("button", { onclick: () => close() }, "Close")),
      note ? el("div", { class: "fi-muted", style: "color:#e6c37a" }, note) : null,
      SLOTS.map(([s, n]) => slotCard(s, n)),
      el("div", { class: "fi-muted", style: "margin-top:8px" }, "Colours: the wardrobe's colour picker, a layer for each colour. Moving, turning and over or under clothes: the game's Layering button. Everybody with the Companion or the Dispensary sees your ink as you set it.")
    ];
  }
  function draw() {
    if (box) box.replaceChildren(...view().flat().filter(Boolean));
  }
  function openInkPanel(W25, a) {
    Wd = W25;
    api = a;
    close();
    if (!W25.document.getElementById("fi-style")) {
      const s = W25.document.createElement("style");
      s.id = "fi-style";
      s.textContent = CSS;
      W25.document.head.appendChild(s);
    }
    box = W25.document.createElement("div");
    box.id = "fi-panel";
    W25.document.body.appendChild(box);
    draw();
    return true;
  }
  function close() {
    if (box) {
      box.remove();
      box = null;
    }
    note = "";
  }

  // shared/ink/ink.js
  var INK_HOST = "https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/";
  var LIVE_HOST = INK_HOST + "live/";
  var INK_SLOTS = ["FarmInk1", "FarmInk2", "FarmInk3", "FarmInk4"];
  var BRAND_SLOT = "FarmBrand";
  var MARK_SLOTS = ["FarmMark1", "FarmMark2", "FarmMark3"];
  var TAT_SLOTS = ["FarmTat1", "FarmTat2"];
  var ALL_SLOTS = [...INK_SLOTS, BRAND_SLOT, ...MARK_SLOTS, ...TAT_SLOTS];
  var SLOT_NAMES = { FarmInk1: "Farm Ink 1", FarmInk2: "Farm Ink 2", FarmInk3: "Farm Ink 3", FarmInk4: "Farm Ink 4", FarmBrand: "Farm Brand", FarmMark1: "Farm Mark 1", FarmMark2: "Farm Mark 2", FarmMark3: "Farm Mark 3", FarmTat1: "Farm Tattoo 1", FarmTat2: "Farm Tattoo 2" };
  var RES = ink_designs_default.res || 1;
  var OURS = /\/ink[^/]*\/(?:v\d+\/)?Farm(?:Ink|Brand)\//;
  var LIVE_SRC = /\/live\/(Farm(?:Ink[1-4]|Brand|Tat[12]))\/(Live[A-Za-z]+)_([A-Za-z0-9]+)\.png$/;
  var STILL_SRC = /\/(Farm(?:Ink|Brand))\/([A-Za-z0-9]+)_([A-Za-z0-9]+)\.png$/;
  var MARK_SRC = /\/(Farm(?:Mark[1-3]|Tat[12]))\/([A-Za-z0-9]+)_([A-Za-z0-9]+)\.png$/;
  var stillItem = (C2, kind, name) => C2 && Array.isArray(C2.Appearance) ? C2.Appearance.find((it) => it && it.Asset && it.Asset.Name === name && it.Asset.Group && kindOf(it.Asset.Group.Name) === kind) : null;
  var PRIORITY = 11;
  var kindOf = (slot) => slot === BRAND_SLOT ? "FarmBrand" : /^FarmInk[1-4]$/.test(String(slot)) ? "FarmInk" : null;
  var isMark = (slot) => MARK_SLOTS.includes(slot);
  var isTat = (slot) => TAT_SLOTS.includes(slot);
  var isHid = (slot) => isMark(slot) || isTat(slot);
  var ours = (slot) => !!kindOf(slot) || isHid(slot);
  var picKind = (slot) => isMark(slot) ? "FarmBrand" : isTat(slot) ? "FarmInk" : kindOf(slot);
  var TITLES = {};
  var MANIFEST = {};
  var K = {};
  for (const kind of ["FarmInk", "FarmBrand"]) for (const a of ink_designs_default.groups[kind]) {
    TITLES[kind + ":" + a.name] = a.title;
    if (a.live) MANIFEST[a.name] = a;
    if (a.k && a.k !== 1) K[kind + ":" + a.name] = a.k;
  }
  var MARK_AT = { FarmMark1: [296, 580, 54, 48], FarmMark2: [292, 662, 50, 64], FarmMark3: [318, 300, 36, 38], FarmTat1: [250, 246, 100, 22], FarmTat2: [250, 492, 84, 30] };
  var MK = {};
  for (const slot of [...MARK_SLOTS, ...TAT_SLOTS]) for (const a of ink_designs_default.groups[picKind(slot)]) {
    const [, , bw, bh] = MARK_AT[slot];
    MK[slot + ":" + a.name] = Math.round(Math.max(0.3, Math.min(1.2, Math.min(bw / (a.w / RES), bh / (a.h / RES)))) * 100) / 100;
  }
  var kOf = (it) => {
    const g = it && it.Asset && it.Asset.Group && it.Asset.Group.Name;
    if (!g) return 1;
    return (isHid(g) ? MK[g + ":" + it.Asset.Name] : K[kindOf(g) + ":" + it.Asset.Name]) || 1;
  };
  function assetDef(a) {
    return {
      Name: a.name,
      Random: false,
      Value: 0,
      Left: a.left,
      Top: a.top,
      DefaultColor: a.layers.filter((l) => l.colorize).map((l) => l.color),
      // (the game up to R133 reads the starting colours here...)
      PoseMapping: { AllFours: "Hide", Hogtied: "Hide" },
      // (the body's drawn another way in those: the ink would float)
      // (...and from R134 on, off each layer: without its own Color every layer started "Default", plain grey. Nov 18)
      Layer: a.layers.map((l) => l.colorize ? { Name: l.name, AllowColorize: true, Color: [l.color] } : { Name: l.name, AllowColorize: false })
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
  function markDef(slot) {
    const [cx, cy] = MARK_AT[slot];
    return {
      Group: slot,
      Priority: PRIORITY,
      Default: false,
      Random: false,
      BodyCosplay: true,
      Clothing: false,
      AllowNone: true,
      AllowCustomize: false,
      Color: ["Default"],
      Asset: ink_designs_default.groups[picKind(slot)].map((a) => Object.assign(assetDef(a), { Left: Math.round(cx - a.w / 2), Top: Math.round(cy - a.h / 2) }))
    };
  }
  function describe(W25) {
    for (const slot of ALL_SLOTS) {
      const G = W25.AssetGroupMap && W25.AssetGroupMap.get(slot);
      if (!G) continue;
      G.Description = SLOT_NAMES[slot];
      for (const A of G.Asset || []) {
        const t = TITLES[picKind(slot) + ":" + A.Name];
        if (t) A.Description = t;
      }
    }
  }
  var gameReady = (W25) => typeof W25.AssetGroupAdd === "function" && typeof W25.AssetAdd === "function" && W25.AssetGroupMap && W25.AssetGroupMap.size > 30;
  function addSlots(W25) {
    let added = false;
    for (const slot of ALL_SLOTS) {
      if (W25.AssetGroupMap.has(slot)) continue;
      const def = isHid(slot) ? markDef(slot) : groupDef(slot), G = W25.AssetGroupAdd("Female3DCG", def);
      for (const a of def.Asset) W25.AssetAdd(G, a, W25.AssetFemale3DCGExtended || {}, def);
      added = true;
    }
    describe(W25);
    return added;
  }
  var itemIn = (C2, slot) => C2 && Array.isArray(C2.Appearance) ? C2.Appearance.find((it) => it && it.Asset && it.Asset.Group && it.Asset.Group.Name === slot) : null;
  var whoOf = (C2) => ({ num: C2 && C2.MemberNumber, owner: C2 && C2.Ownership && typeof C2.Ownership.Name === "string" ? C2.Ownership.Name : "" });
  function liveSrc(W25, C2, slot, name, layer) {
    const d = LIVE_BY[name], m = MANIFEST[name], it = itemIn(C2, slot);
    if (!d || !m || !it || it.Asset.Name !== name) return null;
    try {
      return picture(W25, d, m, layer, valuesFor(d, it.Property && it.Property.FarmInk, whoOf(C2)));
    } catch (e) {
      console.warn("[Farm ink] couldn't draw " + name, e);
      return null;
    }
  }
  function wornLive(W25) {
    const P = W25.Player, out = [];
    for (const slot of [...INK_SLOTS, BRAND_SLOT]) {
      const it = itemIn(P, slot);
      if (it && isLive(it.Asset.Name)) out.push({ slot, name: it.Asset.Name, item: it });
    }
    return out;
  }
  var lastWrite = {};
  function write(W25, slot, values, now) {
    const it = itemIn(W25.Player, slot);
    if (!it || !kindOf(slot)) return false;
    const cur = it.Property && it.Property.FarmInk || {}, merged = Object.assign({}, cur, values);
    for (const k of Object.keys(merged)) if (merged[k] == null) delete merged[k];
    const next2 = cleanValues(merged);
    if (merged.manual === true) next2.manual = true;
    if (JSON.stringify(next2) === JSON.stringify(cur)) return false;
    const since2 = Date.now() - (lastWrite[slot] || 0);
    if (!now && since2 < 6e4) {
      clearTimeout(retry[slot]);
      retry[slot] = setTimeout(() => refreshAuto(W25), 60500 - since2);
      return false;
    }
    lastWrite[slot] = Date.now();
    it.Property = Object.assign({}, it.Property, { FarmInk: next2 });
    try {
      if (typeof W25.CharacterRefresh === "function") W25.CharacterRefresh(W25.Player);
    } catch (e) {
    }
    try {
      if (typeof W25.ChatRoomCharacterItemUpdate === "function") W25.ChatRoomCharacterItemUpdate(W25.Player, slot);
    } catch (e) {
    }
    return true;
  }
  var retry = {};
  var counts = {};
  var mine = {};
  var DAY = 864e5;
  var cumKey = (W25) => "farmink-lastcum-" + (W25.Player && W25.Player.MemberNumber);
  function daysDenied(W25) {
    let t = 0;
    try {
      t = Number(W25.localStorage.getItem(cumKey(W25))) || 0;
    } catch (e) {
    }
    return t ? Math.max(0, Math.floor((Date.now() - t) / DAY)) : 0;
  }
  function autoOf(W25, auto) {
    if (auto === "denied") return { n: daysDenied(W25) };
    const c = counts[auto];
    if (auto === "studs") return c && Array.isArray(c.list) ? { list: c.list, more: c.more || null } : null;
    if (auto === "scores") return Array.isArray(c) ? { rows: c } : null;
    if (auto === "bredOn") return c && c.d ? { d: c.d, due: c.due || null } : null;
    if (auto === "passport") return Array.isArray(c) && c.length ? { list: c } : null;
    if (auto === "womb") {
      const b = mine.womb, v = b && b.away || !(c && typeof c === "object") ? b : c;
      return v && typeof v === "object" ? { n: Number(v.n) || 0, c: Number(v.c) || 0 } : null;
    }
    return typeof c === "number" ? { n: c } : null;
  }
  function refreshAuto(W25) {
    for (const { slot, name, item } of wornLive(W25)) {
      const d = LIVE_BY[name], own = item.Property && item.Property.FarmInk;
      if (!d.auto || own && own.manual) continue;
      const v = autoOf(W25, d.auto);
      if (v) write(W25, slot, v);
    }
  }
  var HEALED = { BrandEdge: [150, 96, 88], Brand: [226, 184, 172], BrandShine: [246, 226, 218] };
  var FADE_OF = { UseMeFreshMarker: 6 * 36e5, HennaTrail: 7 * DAY };
  var HEAL_MS = 3 * DAY;
  var hexRGB = (h2) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(h2 || ""));
    if (!m) return null;
    const v = parseInt(m[1], 16);
    return [v >> 16 & 255, v >> 8 & 255, v & 255];
  };
  var toHex = (c) => "#" + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  function ageOf(f, now) {
    const at = Number(f && f.at) || 0;
    if (!at) return null;
    const h2 = Number(f.heal) || 0, fd = Number(f.fade) || 0, t = (now || Date.now()) - at;
    const heal = h2 > 0 ? Math.max(0, Math.min(1, t / h2)) : null, gone = fd > 0 ? Math.max(0, Math.min(1, t / fd)) : 0;
    return { heal, alpha: gone < 0.6 ? 1 : Math.max(0, 1 - (gone - 0.6) / 0.4), done: fd > 0 && t >= fd, still: heal != null && heal < 1 || fd > 0 && t < fd };
  }
  function healedHex(hex, layer, p) {
    const to = HEALED[layer], c = hexRGB(hex);
    if (!to || !c || p == null || p <= 0) return hex;
    const e = p * p * (3 - 2 * p);
    return toHex(c.map((v, i) => v + (to[i] - v) * e));
  }
  var DESIGNS = { brand: new Set(ink_designs_default.groups.FarmBrand.map((a) => a.name)), ink: new Set(ink_designs_default.groups.FarmInk.map((a) => a.name)) };
  DESIGNS.mark = DESIGNS.brand;
  DESIGNS.tat = DESIGNS.ink;
  var LAYERS_OF = {};
  for (const kind of ["FarmInk", "FarmBrand"]) for (const a of ink_designs_default.groups[kind]) LAYERS_OF[kind + ":" + a.name] = a.layers.filter((l) => l.colorize).map((l) => l.color);
  var farmOf = (it) => {
    const f = it && it.Property && it.Property.FarmInk;
    return f && typeof f.farm === "string" ? f.farm : null;
  };
  var doneKey = (W25) => "farmink-done-" + (W25.Player && W25.Player.MemberNumber);
  var KEEP_AGAIN = 20 * 36e5;
  function cleanEntry(e) {
    if (!e || typeof e !== "object" || typeof e.id !== "string" || !/^[\w:.-]{1,48}$/.test(e.id)) return null;
    const slot = e.slot === "brand" ? "brand" : e.slot === "ink" ? "ink" : e.slot === "mark" ? "mark" : e.slot === "tat" ? "tat" : null;
    if (!slot || !DESIGNS[slot].has(e.design)) return null;
    const n = (v, max) => {
      const x = Number(v);
      return Number.isFinite(x) && x > 0 ? Math.min(max, Math.round(x)) : 0;
    };
    const color = Array.isArray(e.color) ? e.color.filter((c) => typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c)).slice(0, 8) : null;
    return { id: e.id, slot, design: e.design, at: n(e.at, 4e12), heal: n(e.heal, 60 * DAY), fade: n(e.fade, 60 * DAY) || FADE_OF[e.design] || 0, keep: !!e.keep, color: color && color.length ? color : null, values: e.values && typeof e.values === "object" ? e.values : null };
  }
  function farmInkSync(W25, list, on2, now, opts) {
    const hard = !!(opts && opts.hard);
    const P = W25.Player;
    if (!P || !Array.isArray(P.Appearance) || !Array.isArray(list) || typeof W25.InventoryWear !== "function") return null;
    now = now || Date.now();
    const want = on2 ? list.map(cleanEntry).filter(Boolean) : [], ids = new Set(want.map((e) => e.id)), out = { put: [], off: [], full: [], taken: [], marked: [] }, changed = [];
    let done = {};
    try {
      done = JSON.parse(W25.localStorage.getItem(doneKey(W25))) || {};
    } catch (e) {
      done = {};
    }
    const remove = (slot) => {
      try {
        if (typeof W25.InventoryRemove === "function") W25.InventoryRemove(P, slot, false);
        else P.Appearance = P.Appearance.filter((it) => !(it && it.Asset && it.Asset.Group && it.Asset.Group.Name === slot));
      } catch (e) {
        return false;
      }
      changed.push(slot);
      return true;
    };
    for (const slot of ALL_SLOTS) {
      const it = itemIn(P, slot), id = farmOf(it);
      if (!id) continue;
      const a = ageOf(it.Property.FarmInk, now);
      if (!ids.has(id) || a && a.done) {
        if (remove(slot)) out.off.push(it.Asset.Name);
        if (a && a.done) done[id] = now;
      }
    }
    for (const e of want) {
      if (ALL_SLOTS.some((s) => farmOf(itemIn(P, s)) === e.id)) continue;
      const mark = e.slot === "mark" || e.slot === "tat";
      if (!mark && done[e.id] && !hard && !(e.keep && now - done[e.id] > KEEP_AGAIN)) continue;
      if (e.fade && e.at && now - e.at >= e.fade) continue;
      let slot = null;
      if (e.slot === "tat") slot = isLive(e.design) ? TAT_SLOTS[0] : TAT_SLOTS[1];
      else if (mark) {
        const atOf = (s) => {
          const f = farmOf(itemIn(P, s)) && itemIn(P, s).Property.FarmInk;
          return f && f.at || 0;
        };
        slot = MARK_SLOTS.find((s) => !itemIn(P, s)) || MARK_SLOTS.slice().sort((a, b) => atOf(a) - atOf(b))[0];
      } else if (e.slot === "brand") {
        const it2 = itemIn(P, BRAND_SLOT);
        if (!it2 || farmOf(it2)) slot = BRAND_SLOT;
        else {
          out.taken.push(e.design);
          continue;
        }
      } else {
        slot = INK_SLOTS.find((s) => !itemIn(P, s)) || null;
        if (!slot) {
          out.full.push(e.design);
          continue;
        }
      }
      if (itemIn(P, slot)) remove(slot);
      const kind = picKind(slot), color = e.color || LAYERS_OF[kind + ":" + e.design] || "Default";
      try {
        W25.InventoryWear(P, e.design, slot, color, 0, P.MemberNumber, null, false);
      } catch (err) {
        continue;
      }
      const it = itemIn(P, slot);
      if (!it || it.Asset.Name !== e.design) continue;
      it.Property = Object.assign({}, it.Property, { FarmInk: cleanValues(Object.assign({}, e.values || {}, { farm: e.id, at: e.at || now, heal: e.heal || null, fade: e.fade || null, keep: e.keep || null })) });
      if (mark) {
        if (!done[e.id]) out.marked.push(e.design);
      } else out.put.push(e.design);
      done[e.id] = now;
      changed.push(slot);
    }
    for (const k of Object.keys(done)) if (!ids.has(k) && now - done[k] > 60 * DAY) delete done[k];
    try {
      W25.localStorage.setItem(doneKey(W25), JSON.stringify(done));
    } catch (e) {
    }
    if (changed.length) {
      try {
        if (typeof W25.CharacterRefresh === "function") W25.CharacterRefresh(P);
      } catch (e) {
      }
      try {
        if (typeof W25.ChatRoomCharacterUpdate === "function") W25.ChatRoomCharacterUpdate(P);
      } catch (e) {
      }
    }
    return out;
  }
  var farmBrandWorn = (W25) => {
    const id = farmOf(itemIn(W25.Player, BRAND_SLOT));
    return !!(id && /^brand:/.test(id));
  };
  var DOSED_ONLY = /* @__PURE__ */ new Set(["GlowSlutGlowInk"]);
  var dosed = (W25, C2) => {
    try {
      const D = W25.FarmhandDispensary;
      return !!(D && typeof D.dosedOf === "function" && C2 && D.dosedOf(C2.MemberNumber));
    } catch (e) {
      return false;
    }
  };
  var wearsDosedOnly = (C2) => ALL_SLOTS.some((s) => {
    const it = itemIn(C2, s);
    return !!(it && DOSED_ONLY.has(it.Asset.Name));
  });
  var stillChanging = (C2, now) => ALL_SLOTS.some((s) => {
    const it = itemIn(C2, s), f = farmOf(it) && it.Property.FarmInk, a = f && ageOf(f, now);
    return !!(a && a.still);
  });
  var trophyOf = (it) => {
    const f = it && it.Property && it.Property.FarmInk;
    return f && typeof f.trophy === "string" ? f.trophy : null;
  };
  function trophyWorn(W25) {
    const o = {};
    for (const s of INK_SLOTS) {
      const id = trophyOf(itemIn(W25.Player, s));
      if (id) o[id] = s;
    }
    return o;
  }
  var roomSees = (W25, P) => {
    try {
      if (typeof W25.CharacterRefresh === "function") W25.CharacterRefresh(P);
    } catch (e) {
    }
    try {
      if (typeof W25.ChatRoomCharacterUpdate === "function") W25.ChatRoomCharacterUpdate(P);
    } catch (e) {
    }
  };
  function trophyWear(W25, t, slot) {
    const P = W25.Player;
    if (!P || !Array.isArray(P.Appearance) || typeof W25.InventoryWear !== "function") return { ok: false, why: "you're not in the game yet" };
    if (!t || typeof t.id !== "string" || !/^[a-z0-9-]{1,24}$/.test(t.id) || !LIVE_BY[t.design] || !DESIGNS.ink.has(t.design)) return { ok: false, why: "that isn't a trophy the farm gives" };
    const worn = trophyWorn(W25);
    if (worn[t.id]) return { ok: true, slot: worn[t.id], already: true };
    if (slot != null && !INK_SLOTS.includes(slot)) return { ok: false, why: "there's no slot by that name" };
    slot = slot || INK_SLOTS.find((s) => !itemIn(P, s));
    if (!slot) return { ok: false, full: true, why: "your four Farm Ink slots are full", slots: INK_SLOTS.map((s) => {
      const it2 = itemIn(P, s);
      return { slot: s, name: SLOT_NAMES[s], title: it2 ? TITLES["FarmInk:" + it2.Asset.Name] || it2.Asset.Name : "" };
    }) };
    if (itemIn(P, slot)) {
      try {
        W25.InventoryRemove(P, slot, false);
      } catch (e) {
        return { ok: false, why: "what's in " + SLOT_NAMES[slot] + " wouldn't come off" };
      }
    }
    try {
      W25.InventoryWear(P, t.design, slot, LAYERS_OF["FarmInk:" + t.design] || "Default", 0, P.MemberNumber, null, false);
    } catch (e) {
      return { ok: false, why: "the game wouldn't take it" };
    }
    const it = itemIn(P, slot);
    if (!it || it.Asset.Name !== t.design) return { ok: false, why: "the game wouldn't take it" };
    const d = LIVE_BY[t.design], v = d.auto ? autoOf(W25, d.auto) : null;
    it.Property = Object.assign({}, it.Property, { FarmInk: cleanValues(Object.assign({}, v || {}, { trophy: t.id })) });
    roomSees(W25, P);
    return { ok: true, slot, name: SLOT_NAMES[slot] };
  }
  function trophyOff(W25, id) {
    const P = W25.Player, slot = P && trophyWorn(W25)[id];
    if (!slot) return { ok: true, already: true };
    try {
      if (typeof W25.InventoryRemove === "function") W25.InventoryRemove(P, slot, false);
      else P.Appearance = P.Appearance.filter((it) => !(it && it.Asset && it.Asset.Group && it.Asset.Group.Name === slot));
    } catch (e) {
      return { ok: false, why: "it wouldn't come off" };
    }
    roomSees(W25, P);
    return { ok: true, slot, name: SLOT_NAMES[slot] };
  }
  var SLOT_OF = { 1: "FarmInk1", 2: "FarmInk2", 3: "FarmInk3", 4: "FarmInk4", brand: BRAND_SLOT };
  var say = (W25, t) => {
    try {
      if (typeof W25.ChatRoomSendLocal === "function") {
        const d = W25.document.createElement("div");
        d.style.cssText = "color:#c79bd8;white-space:pre-wrap";
        d.textContent = "\u{1F58B}\uFE0F " + t;
        W25.ChatRoomSendLocal(d.outerHTML);
      }
    } catch (e) {
    }
  };
  function wornAll(W25) {
    const out = [];
    for (const slot of [...INK_SLOTS, BRAND_SLOT]) {
      const it = itemIn(W25.Player, slot);
      if (!it) continue;
      const d = LIVE_BY[it.Asset.Name];
      out.push({ slot, name: it.Asset.Name, title: TITLES[kindOf(slot) + ":" + it.Asset.Name] || it.Asset.Name, live: !!d, fields: d ? d.fields : [], auto: d ? d.auto || null : null, values: it.Property && it.Property.FarmInk || {} });
    }
    return out;
  }
  var panelApi = (W25) => ({ worn: () => wornAll(W25), write: (slot, v) => write(W25, slot, v, true), command: (a) => inkCommand(W25, a) });
  function inkCommand(W25, args) {
    const a = String(args || "").trim(), m = /^(1|2|3|4|brand)\b\s*(.*)$/i.exec(a);
    const worn = wornLive(W25);
    if (!a && W25.document && W25.document.body) {
      openInkPanel(W25, panelApi(W25));
      return;
    }
    if (/^why$/i.test(a)) return say(W25, whyText());
    const sm = m && /^(size|wide|width|tall|height)\s+(\d{1,3})%?$/i.exec(m[2].trim());
    if (sm) {
      const slot2 = SLOT_OF[m[1].toLowerCase()], k = /^s/i.test(sm[1]) ? "sz" : /^w/i.test(sm[1]) ? "sw" : "sh", lim = k === "sz" ? [25, 400] : [50, 200];
      const v2 = Math.max(lim[0], Math.min(lim[1], Number(sm[2]))) / 100;
      if (!itemIn(W25.Player, slot2)) return say(W25, "Nothin' in " + SLOT_NAMES[slot2] + ".");
      write(W25, slot2, { [k]: v2 === 1 ? null : v2 }, true);
      return say(W25, SLOT_NAMES[slot2] + ": " + { sz: "size", sw: "width", sh: "height" }[k] + " " + Math.round(v2 * 100) + "%.");
    }
    if (!m) {
      if (!worn.length) return say(W25, "You've no live ink on. Pick one in the wardrobe (Farm Ink 1 to 4): the ones that say keeps count, a name, your number or your words. Then /ink <slot> <words> writes on it.");
      return say(W25, "Your live ink:\n" + worn.map(({ slot: slot2, name, item }) => {
        const d2 = LIVE_BY[name], own = item.Property && item.Property.FarmInk || {}, k = Object.keys(SLOT_OF).find((x) => SLOT_OF[x] === slot2);
        return "\u2022 " + k + ": " + d2.title + (own.t ? ' \xB7 "' + own.t + '"' : "") + (own.n != null ? " \xB7 " + own.n : "") + (own.list ? " \xB7 " + own.list.join(", ") : "") + (d2.auto ? own.manual ? " (your number, not the farm's)" : " (follows the farm)" : "");
      }).join("\n") + "\n/ink opens the ink panel \xB7 /ink <slot> <words> writes on it \xB7 /ink <slot> <number> sets a count \xB7 /ink <slot> a, b, c for a list \xB7 /ink <slot> auto follows the farm again \xB7 /ink <slot> clear \xB7 /ink <slot> size 150 (wide, tall)");
    }
    const slot = SLOT_OF[m[1].toLowerCase()], rest = m[2].trim(), it = itemIn(W25.Player, slot);
    if (!it) return say(W25, "Nothin' in " + SLOT_NAMES[slot] + ".");
    if (!isLive(it.Asset.Name)) return say(W25, (TITLES["FarmInk:" + it.Asset.Name] || TITLES["FarmBrand:" + it.Asset.Name] || "That") + " doesn't take writin': it's drawn as it is.");
    const d = LIVE_BY[it.Asset.Name];
    let v;
    if (!rest) return inkCommand(W25, "");
    if (/^clear$/i.test(rest)) v = { t: null, n: null, num: null, list: null, more: null, rows: null, d: null, due: null, manual: null };
    else if (/^auto$/i.test(rest)) {
      v = { manual: null, n: null, list: null, more: null, rows: null };
    } else if (/^\d{1,9}$/.test(rest) && (d.fields.includes("n") || d.fields.includes("num"))) v = d.fields.includes("num") ? { num: Number(rest) } : { n: Number(rest), manual: true };
    else if (rest.includes(",") && d.fields.includes("list")) v = { list: rest.split(",").map((x) => x.trim()).filter(Boolean), manual: true };
    else if (d.fields.includes("t")) v = { t: rest };
    else return say(W25, d.title + " takes " + (d.fields.includes("n") ? "a number" : d.fields.includes("num") ? "a number" : d.fields.includes("list") ? "names, with commas between" : "nothin'") + ".");
    write(W25, slot, v, true);
    if (/^auto$/i.test(rest)) refreshAuto(W25);
    say(W25, "Written on " + d.title + ".");
  }
  function farmInkEntry(W25) {
    const PD = W25.PropertyData, PDE = typeof PropertyDataEntry !== "undefined" ? PropertyDataEntry : W25.PropertyDataEntry;
    if (!PD || typeof PDE !== "function" || PD.FarmInk) return false;
    const same = (a, b) => {
      try {
        return JSON.stringify(a) === JSON.stringify(b);
      } catch (e) {
        return false;
      }
    };
    PD.FarmInk = new PDE("FarmInk", void 0, {
      validate(prop, itemData) {
        const g = itemData && itemData.asset && itemData.asset.Group && itemData.asset.Group.Name;
        if (!ours(g) || !prop || typeof prop !== "object" || Array.isArray(prop)) return { status: "criticalError", value: void 0, errorDescription: "FarmInk belongs on the farm's ink slots" };
        const v = cleanValues(prop);
        if (prop.manual === true) v.manual = true;
        return { status: "ok", value: v };
      },
      compare(a, b) {
        return same(a, b);
      }
    });
    return true;
  }
  function registerInk(W25, mod2) {
    if (W25.__farmInk) return W25.__farmInk;
    const st2 = W25.__farmInk = {
      ready: false,
      slots: [...INK_SLOTS, BRAND_SLOT],
      designs: ink_designs_default.groups.FarmInk.length + ink_designs_default.groups.FarmBrand.length,
      live: Object.keys(MANIFEST).length,
      // for the Companion: the farm's counts for live ink (state.ink from the farm girl)
      counts: (c) => {
        if (c && typeof c === "object") {
          counts = c;
          try {
            refreshAuto(W25);
          } catch (e) {
          }
        }
      },
      // for the Dispensary: what it knows itself, off the farm too (the womb mark: what you're carryin')
      mine: (c) => {
        if (c && typeof c === "object") {
          mine = c;
          try {
            refreshAuto(W25);
          } catch (e) {
          }
        }
      },
      write: (slot, v) => write(W25, slot, v, true),
      command: (a) => inkCommand(W25, a),
      // the farm's own ink (the Companion hands over the farm girl's list and the "Farm can ink me" switch)
      farm: (list, on2, opts) => farmInkSync(W25, list, on2, void 0, opts),
      farmBrandWorn: () => farmBrandWorn(W25),
      // trophies (the Companion's 🏆 Trophies row)
      trophyWear: (t2, slot) => trophyWear(W25, t2, slot),
      trophyOff: (id) => trophyOff(W25, id),
      trophyWorn: () => trophyWorn(W25),
      worn: () => wornLive(W25).map(({ slot, name }) => ({ slot, name }))
    };
    const hooks = () => {
      const hook = (name, pri, fn) => {
        try {
          if (typeof W25[name] === "function") mod2.hookFunction(name, pri, fn);
          else console.warn("[Farm ink] the game has no " + name);
        } catch (e) {
          console.warn("[Farm ink] couldn't hook " + name, e);
        }
      };
      hook("AssetBaseURL", 0, (args, next2) => {
        const slot = args[2] || args[1] && args[1].Name;
        if (isTat(slot)) return (args[6] && isLive(args[6].Name) ? LIVE_HOST : INK_HOST) + slot + "/";
        if (isMark(slot)) return INK_HOST + slot + "/";
        const kind = kindOf(slot);
        if (!kind) return next2(args);
        return args[6] && isLive(args[6].Name) ? LIVE_HOST + slot + "/" : INK_HOST + kind + "/";
      });
      hook("AssetGetPreviewPath", 0, (args, next2) => {
        const A = args[0], kind = A && A.Group && picKind(A.Group.Name);
        return kind ? INK_HOST + kind + "/Preview" : next2(args);
      });
      hook("AssetBuildDescription", 0, (args, next2) => {
        const r = next2(args);
        try {
          describe(W25);
        } catch (e) {
        }
        return r;
      });
      hook("CommonDrawAppearanceBuild", 5, (args, next2) => {
        const C2 = args[0], cb = args[1];
        if (!cb || typeof cb !== "object") return next2(args);
        const sized = (o, it) => {
          const f = it && it.Property && it.Property.FarmInk || {}, sz = (f.sz || 1) * kOf(it), kx = sz * (f.sw || 1) / RES, ky = sz * (f.sh || 1) / RES;
          o = Object.assign({}, o);
          o.ScaleX = (o.ScaleX == null ? 1 : o.ScaleX) * kx;
          o.ScaleY = (o.ScaleY == null ? 1 : o.ScaleY) * ky;
          return o;
        };
        const seen = /* @__PURE__ */ new Set(), notReady = [];
        const ready = (u) => {
          try {
            const c = W25.GLDrawImageCache;
            if (c && typeof c.has === "function" && c.has(u) && !c.get(u).isLoaded()) return false;
          } catch (e) {
          }
          return true;
        };
        const statue = (plain, self, u, x, y, o) => {
          const T = W25.__farmInkTint;
          if (typeof T !== "function") return false;
          let t2;
          try {
            t2 = T(C2, u, x, y);
          } catch (e) {
            t2 = void 0;
          }
          if (!t2) return false;
          const o2 = Object.assign({}, o || {});
          delete o2.HexColor;
          delete o2.FullAlpha;
          plain.call(self, t2, x, y, o2);
          return true;
        };
        const now = Date.now();
        const aged = (o, it, layer) => {
          const f = farmOf(it) && it.Property.FarmInk, a = f && ageOf(f, now);
          if (!a) return o;
          o = Object.assign({}, o);
          if (a.heal != null && typeof o.HexColor === "string") o.HexColor = healedHex(o.HexColor, layer, a.heal);
          if (a.alpha < 1) o.Alpha = (o.Alpha == null ? 1 : o.Alpha) * a.alpha;
          return o;
        };
        const wrap = (f, plain) => typeof f !== "function" ? f : function(src, x, y, o) {
          if (typeof src === "string") {
            const mm = (src.indexOf("/FarmMark") > 0 || src.indexOf("/FarmTat") > 0) && src.indexOf("/live/") < 0 ? MARK_SRC.exec(src) : null;
            if (mm) {
              const it = itemIn(C2, mm[1]);
              if (!it || it.Asset.Name !== mm[2]) return void 0;
              const u = src.replace("/" + mm[1] + "/", "/" + picKind(mm[1]) + "/");
              const o3 = aged(sized(o, it), it, mm[3]);
              if (o3.Alpha === 0) return void 0;
              seen.add(mm[2]);
              if (!ready(u)) notReady.push(mm[2]);
              if (statue(plain, this, u, x, y, o3)) return void 0;
              return f.call(this, u, x, y, o3);
            }
            const lm = src.indexOf("/live/") > 0 ? LIVE_SRC.exec(src) : null;
            if (lm) {
              const u = liveSrc(W25, C2, lm[1], lm[2], lm[3]);
              seen.add(lm[2]);
              if (!u) {
                notReady.push(lm[2] + " (not drawn yet)");
                return void 0;
              }
              if (!ready(u)) notReady.push(lm[2]);
              const it = itemIn(C2, lm[1]), o3 = aged(sized(o, it), it, lm[3]);
              if (o3.Alpha === 0) return void 0;
              if (statue(plain, this, u, x, y, o3)) return void 0;
              return f.call(this, u, x, y, o3);
            }
            const sm = OURS.test(src) ? STILL_SRC.exec(src) : null;
            if (sm) {
              if (DOSED_ONLY.has(sm[2]) && !dosed(W25, C2)) return void 0;
              const it = stillItem(C2, sm[1], sm[2]);
              o = aged(sized(o, it), it, sm[3]);
              if (o.Alpha === 0) return void 0;
              seen.add(sm[2]);
              if (!ready(src)) notReady.push(sm[2]);
              if (statue(plain, this, src, x, y, o)) return void 0;
            }
          }
          return f.call(this, src, x, y, o);
        };
        const out = next2([args[0], Object.assign({}, cb, { drawImage: wrap(cb.drawImage, cb.drawImage), drawImageBlink: wrap(cb.drawImageBlink, cb.drawImageBlink), drawImageColorize: wrap(cb.drawImageColorize, cb.drawImage), drawImageColorizeBlink: wrap(cb.drawImageColorizeBlink, cb.drawImageBlink) }), ...args.slice(2)]);
        try {
          note2(W25, C2, seen, notReady);
        } catch (e) {
        }
        return out;
      });
      const keepInk = (name) => hook(name, 0, (args, next2) => {
        const C2 = args[0], keep = C2 && Array.isArray(C2.Appearance) ? C2.Appearance.filter((it) => it && it.Asset && it.Asset.Group && ours(it.Asset.Group.Name)) : [];
        const r = next2(args);
        try {
          let back = 0;
          if (keep.length && C2 && Array.isArray(C2.Appearance)) {
            for (const it of keep) if (!C2.Appearance.includes(it) && !itemIn(C2, it.Asset.Group.Name)) {
              C2.Appearance.push(it);
              back++;
            }
          }
          if (back && typeof W25.CharacterLoadCanvas === "function") W25.CharacterLoadCanvas(C2);
        } catch (e) {
        }
        return r;
      });
      keepInk("CharacterAppearanceNaked");
      keepInk("CharacterAppearanceStripLayer");
      hook("WardrobeFastLoad", 0, (args, next2) => {
        const C2 = args[0], keep = C2 && typeof C2.IsPlayer === "function" && C2.IsPlayer() && Array.isArray(C2.Appearance) ? C2.Appearance.filter((it) => it && it.Asset && it.Asset.Group && isHid(it.Asset.Group.Name) && farmOf(it)) : [];
        const r = next2(args);
        try {
          let back = 0;
          for (const it of keep) if (!itemIn(C2, it.Asset.Group.Name)) {
            C2.Appearance.push(it);
            back++;
          }
          if (back) {
            if (typeof W25.CharacterRefresh === "function") W25.CharacterRefresh(C2, false);
            if (args[2] && typeof W25.ChatRoomCharacterUpdate === "function") W25.ChatRoomCharacterUpdate(C2);
          }
        } catch (e) {
        }
        return r;
      });
      hook("AssetLoadAll", 0, (args, next2) => {
        const r = next2(args);
        try {
          addSlots(W25);
        } catch (e) {
          console.warn("[Farm ink] couldn't add the slots again", e);
        }
        return r;
      });
      if (typeof W25.ItemPropertiesGetBundleProperties === "function") hook("ItemPropertiesGetBundleProperties", 0, (args, next2) => {
        const r = next2(args);
        try {
          const it = args[0];
          if (it && it.Asset && it.Asset.Group && ours(it.Asset.Group.Name) && r && r.properties && typeof r.properties.add === "function") r.properties.add("FarmInk");
        } catch (e) {
        }
        return r;
      });
      farmInkEntry(W25);
      hook("ActivityOrgasmStart", 0, (args, next2) => {
        try {
          const C2 = args[0];
          if (C2 && typeof C2.IsPlayer === "function" && C2.IsPlayer() && !W25.ActivityOrgasmRuined) {
            W25.localStorage.setItem(cumKey(W25), String(Date.now()));
            setTimeout(() => refreshAuto(W25), 1e3);
          }
        } catch (e) {
        }
        return next2(args);
      });
    };
    const t = setInterval(() => {
      if (!gameReady(W25)) return;
      clearInterval(t);
      try {
        hooks();
        addSlots(W25);
        st2.ready = true;
      } catch (e) {
        console.warn("[Farm ink] couldn't add the slots", e);
      }
      loadLiveArt().then(() => {
        try {
          for (const C2 of W25.ChatRoomCharacter || []) if (wornByLogo(C2) && typeof W25.CharacterLoadCanvas === "function") W25.CharacterLoadCanvas(C2);
        } catch (e) {
        }
      });
      try {
        if (typeof W25.CommandCombine === "function") W25.CommandCombine([{ Tag: "ink", Description: "[slot words]: your live farm ink (counts, names, your own words)", Action: (a) => inkCommand(W25, a) }]);
      } catch (e) {
      }
    }, 50);
    setInterval(() => {
      try {
        if (W25.Player && W25.Player.Appearance) refreshAuto(W25);
      } catch (e) {
      }
    }, 10 * 6e4);
    try {
      W25.addEventListener("farmhand-dispensary", (e) => {
        const d = e && e.detail;
        if (!d || !(d.type === "dose" || d.type === "icons")) return;
        const mn = d.type === "icons" ? d.from : W25.Player && W25.Player.MemberNumber;
        const C2 = (W25.Player && W25.Player.MemberNumber === mn ? W25.Player : (W25.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn)) || null;
        if (C2 && wearsDosedOnly(C2) && typeof W25.CharacterLoadCanvas === "function") W25.CharacterLoadCanvas(C2);
      });
    } catch (e) {
    }
    setInterval(() => {
      try {
        const now = Date.now();
        for (const C2 of W25.ChatRoomCharacter || []) if (stillChanging(C2, now) && typeof W25.CharacterLoadCanvas === "function") W25.CharacterLoadCanvas(C2);
      } catch (e) {
      }
    }, 30 * 6e4);
    return st2;
  }
  var DIAG = [];
  function note2(W25, C2, seen, notReady) {
    if (!C2 || !Array.isArray(C2.Appearance)) return;
    const pose = [].concat(C2.ActivePose || [], C2.Pose || []).join(",");
    if (/AllFours|Hogtied/.test(pose)) return;
    const worn = C2.Appearance.filter((it) => it && it.Asset && it.Asset.Group && ours(it.Asset.Group.Name)).map((it) => it.Asset.Name);
    const missing = worn.filter((n) => !seen.has(n));
    if (!missing.length && !notReady.length) return;
    DIAG.push({ t: Date.now(), who: C2.MemberNumber, name: String(C2.Nickname || C2.Name || ""), missing, notReady: [...new Set(notReady)] });
    if (DIAG.length > 40) DIAG.shift();
  }
  function whyText() {
    if (!DIAG.length) return "No ink has gone missin' since you logged in.";
    return "Ink that didn't show, newest last:\n" + DIAG.slice(-10).map((d) => new Date(d.t).toLocaleTimeString() + " \xB7 " + d.name + " (" + d.who + ")" + (d.missing.length ? " \xB7 not drawn at all: " + d.missing.join(", ") : "") + (d.notReady.length ? " \xB7 picture not loaded yet: " + d.notReady.join(", ") : "")).join("\n");
  }
  var wornByLogo = (C2) => C2 && Array.isArray(C2.Appearance) ? C2.Appearance.some((it) => it && it.Asset && LIVE_BY[it.Asset.Name] && LIVE_BY[it.Asset.Name].logo) : false;

  // dispensary/src/index.js
  var import_bondage_club_mod_sdk = __toESM(require_bcmodsdk(), 1);

  // dispensary/src/version.js
  var VERSION = "0.24.0";

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
    tenderSpot: "",
    // (Nov 18: crafted parasites, each kind off till you switch it on; what's in you; the mouthpiece lettin' words straight
    // through; worn gear's pause after a safeword)
    parasites: {},
    para: {},
    mouthAuto: false,
    wornPause: 0,
    iconsShow: true,
    iconsShare: true,
    grow: {}
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
    if (d.parasites && typeof d.parasites === "object") {
      for (const [k, v] of Object.entries(d.parasites).slice(0, 20)) if (/^[a-z]{2,12}$/.test(k) && v === true) s.parasites[k] = true;
    }
    if (d.para && typeof d.para === "object") {
      for (const [k, x] of Object.entries(d.para).slice(0, 10)) {
        if (!/^[a-z]{2,12}$/.test(k) || !x || typeof x !== "object") continue;
        s.para[k] = {
          by: Math.round(num(x.by, 0, 1e9, 0)),
          name: String(x.name || "").slice(0, 30),
          since: num(x.since, 0, 1e14, 0),
          until: num(x.until, 0, 1e14, 0),
          strain: Array.isArray(x.strain) ? x.strain.filter((i) => typeof i === "string" && /^[a-z]{2,20}$/.test(i)).slice(0, 4) : [],
          fed: num(x.fed, 0, 1e14, 0),
          stage: Math.round(num(x.stage, 0, 9, 0)),
          n: Math.round(num(x.n, 0, 1e6, 0)),
          eggs: Math.round(num(x.eggs, 0, 9, 0)),
          next: num(x.next, 0, 1e14, 0)
        };
      }
    }
    if (d.grow && typeof d.grow === "object") for (const k of ["cup", "ass", "cock", "balls"]) {
      const v = num(d.grow[k], -10, 10, 0);
      if (v) s.grow[k] = Math.round(v);
    }
    if (d.nipTrain && typeof d.nipTrain === "object") s.nipTrain = { lvl: num(d.nipTrain.lvl, 0, 3, 0), at: num(d.nipTrain.at, 0, 1e14, 0), open: num(d.nipTrain.open, 0, 1e14, 0), used: num(d.nipTrain.used, 0, 1e14, 0) };
    if (typeof d.nipsHeal === "boolean") s.nipsHeal = d.nipsHeal;
    if (d.nipLoads) s.nipLoads = Math.round(num(d.nipLoads, 0, 1e7, 0));
    if (d.nipLoadsBy && typeof d.nipLoadsBy === "object") {
      s.nipLoadsBy = {};
      for (const [k, v] of Object.entries(d.nipLoadsBy).slice(-40)) if (/^\d{1,9}$/.test(k)) s.nipLoadsBy[k] = Math.round(num(v, 0, 1e7, 0));
    }
    if (typeof d.hornyOn === "boolean") s.hornyOn = d.hornyOn;
    s.kitsOn = d.kitsOn === true;
    if (["slow", "steady", "fast", "now"].includes(d.kitSpeed)) s.kitSpeed = d.kitSpeed;
    if (["clothes", "binds", "both"].includes(d.kitWhat)) s.kitWhat = d.kitWhat;
    if (d.kits && typeof d.kits === "object") {
      s.kits = {};
      for (const [k, v] of Object.entries(d.kits).slice(0, 8)) if (typeof k === "string" && k.length <= 40 && typeof v === "string" && v.length <= 12e3) s.kits[k] = v;
    }
    {
      const K3 = d.kit, bundle = (a) => Array.isArray(a) ? a.filter((b) => b && typeof b === "object" && typeof b.Group === "string" && typeof b.Name === "string").slice(0, 120) : [];
      if (K3 && typeof K3 === "object" && typeof K3.key === "string" && Array.isArray(K3.pieces)) {
        s.kit = {
          key: K3.key.slice(0, 40),
          flav: typeof K3.flav === "string" ? K3.flav.slice(0, 40) : "plain",
          by: Math.round(num(K3.by, 0, 1e9, 0)),
          old: bundle(K3.old),
          pieces: bundle(K3.pieces),
          queue: Array.isArray(K3.queue) ? K3.queue.filter((g) => typeof g === "string").slice(0, 120) : [],
          next: num(K3.next, 0, 1e14, 0),
          at: num(K3.at, 0, 1e14, 0),
          done: K3.done === true,
          back: Math.round(num(K3.back, 0, 999, 0))
        };
      }
    }
    if (typeof d.holesHeal === "boolean") s.holesHeal = d.holesHeal;
    if (d.holesPain === false) s.holesPain = false;
    if (d.holes && typeof d.holes === "object") {
      const o = d.holes, out = { m: {}, pend: [], goals: {}, id: Math.round(num(o.id, 0, 1e12, 0)), sync: num(o.sync, 0, 1e14, 0), ep: typeof o.ep === "string" && /^[a-z0-9]{4,12}$/.test(o.ep) ? o.ep : "" };
      const lvl = (v) => Math.round(num(v, 1, 20, 1));
      for (const h2 of ["vulva", "butt", "throat"]) {
        const x = o.m && o.m[h2];
        if (x && typeof x === "object") out.m[h2] = {
          n: lvl(x.n),
          u: lvl(x.u),
          cr: num(x.cr, 0, 12, 0),
          t: num(x.t, 0, 1e14, 0),
          g: num(x.g, 0, 1e14, 0),
          hl: num(x.hl, 0, 1, 0),
          tk: typeof x.tk === "string" ? x.tk.slice(0, 120) : "",
          ta: num(x.ta, 0, 1e14, 0),
          gd: typeof x.gd === "string" ? x.gd.slice(0, 120) : "",
          ub: x.ub && typeof x.ub === "object" ? { at: num(x.ub.at, 0, 1e14, 0), n: num(x.ub.n, 0, 100, 0) } : void 0
        };
        const g = o.goals && o.goals[h2];
        if (g && typeof g === "object") out.goals[h2] = { to: lvl(g.to), by: Math.round(num(g.by, 0, 1e9, 0)), due: num(g.due, 0, 1e14, 0), at: num(g.at, 0, 1e14, 0) };
      }
      if (Array.isArray(o.has)) out.has = o.has.filter((h2) => ["vulva", "butt", "throat"].includes(h2));
      const op = (x) => {
        if (!x || typeof x !== "object" || !["vulva", "butt", "throat"].includes(x.h)) return null;
        const r = { h: x.h };
        for (const k of ["up", "down", "tight", "set", "st"]) if (typeof x[k] === "number") r[k] = Math.round(num(x[k], 0, 20, 0));
        return Object.keys(r).length > 1 ? r : null;
      };
      if (Array.isArray(o.pend)) out.pend = o.pend.map(op).filter(Boolean).slice(-80);
      if (o.fly && typeof o.fly === "object" && Array.isArray(o.fly.ops)) out.fly = { id: Math.round(num(o.fly.id, 0, 1e12, 0)), ops: o.fly.ops.map(op).filter(Boolean).slice(0, 60), at: 0 };
      s.holes = out;
    }
    if (d.seed && typeof d.seed === "object") {
      const o = d.seed, HS = ["vulva", "butt", "mouth", "nips"], mn = (k) => /^\d{1,9}$/.test(String(k));
      const by = (m) => {
        const r = {};
        if (m && typeof m === "object") {
          for (const [k, v] of Object.entries(m).slice(0, 8)) if (mn(k)) r[k] = num(v, 0, 4e4, 0);
        }
        return r;
      };
      const ld = (x) => x && typeof x === "object" && HS.includes(x.h) && Number(x.by) > 0 ? { h: x.h, ml: Math.round(num(x.ml, 0, 4e4, 0)), by: Math.round(num(x.by, 0, 1e9, 0)), at: num(x.at, 0, 1e14, 0), nc: x.nc ? 1 : 0, here: x.here ? 1 : 0, nm: typeof x.nm === "string" ? x.nm.slice(0, 40) : void 0, up: x.up ? 1 : void 0, via: x.via === "cock" ? "cock" : void 0 } : null;
      const out = {
        h: {},
        from: {},
        seals: {},
        leak: {},
        drip: {},
        pend: [],
        n: Math.round(num(o.n, 0, 1e7, 0)),
        ml: num(o.ml, 0, 1e10, 0),
        id: Math.round(num(o.id, 0, 1e12, 0)),
        cap: num(o.cap, 0, 6e4, 0),
        sync: num(o.sync, 0, 1e14, 0),
        ep: typeof o.ep === "string" && /^[a-z0-9]{4,12}$/.test(o.ep) ? o.ep : "",
        no: typeof o.no === "string" ? o.no.slice(0, 20) : ""
      };
      for (const h2 of HS) {
        const x = o.h && o.h[h2];
        out.h[h2] = { ml: x && typeof x === "object" ? num(x.ml, 0, 4e4, 0) : 0, by: x && typeof x === "object" ? by(x.by) : {} };
      }
      if (o.from && typeof o.from === "object") {
        for (const [k, f] of Object.entries(o.from).slice(-40)) if (mn(k) && f && typeof f === "object") out.from[k] = { n: Math.round(num(f.n, 0, 1e7, 0)), ml: num(f.ml, 0, 1e10, 0), at: num(f.at, 0, 1e14, 0), nm: typeof f.nm === "string" ? f.nm.slice(0, 40) : "" };
      }
      if (o.seals && typeof o.seals === "object") for (const h2 of HS) {
        const x = o.seals[h2];
        if (x && typeof x === "object" && Number(x.by) > 0) out.seals[h2] = { by: Math.round(num(x.by, 0, 1e9, 0)), g: String(x.g || "").slice(0, 40), nm: String(x.nm || "").slice(0, 40) };
      }
      if (Array.isArray(o.pend)) out.pend = o.pend.map(ld).filter(Boolean).slice(-60);
      if (o.fly && typeof o.fly === "object" && Array.isArray(o.fly.loads)) out.fly = { id: Math.round(num(o.fly.id, 0, 1e12, 0)), loads: o.fly.loads.map(ld).filter(Boolean).slice(0, 30), at: 0, quick: o.fly.quick ? Math.round(num(o.fly.quick, 0, 20, 0)) : void 0 };
      s.seed = out;
    }
    s.breedAny = d.breedAny === true;
    if (d.carry && typeof d.carry === "object") s.carry = d.carry;
    const stamp2 = (x, keys) => {
      if (!x || typeof x !== "object") return void 0;
      const o = {};
      for (const k of keys) if (typeof x[k] === "number" && isFinite(x[k])) o[k] = x[k];
      return o.at > 0 || o.start > 0 ? o : void 0;
    };
    s.born = stamp2(d.born, ["at", "midwife", "helps", "n", "due"]);
    if (!s.born) delete s.born;
    s.laid = stamp2(d.laid, ["at", "n"]);
    if (!s.laid) delete s.laid;
    s.labour = stamp2(d.labour, ["start", "until", "next", "due", "helps", "midwife"]);
    if (!s.labour) delete s.labour;
    s.laying = stamp2(d.laying, ["start", "next", "pushes"]);
    if (!s.laying) delete s.laying;
    if (d.quick) s.quick = Math.round(num(d.quick, 0, 20, 0));
    if (d.heatAt) s.heatAt = num(d.heatAt, 0, 1e14, 0);
    if (d.tie && typeof d.tie === "object" && Number(d.tie.by) > 0 && ["vulva", "butt"].includes(d.tie.h)) s.tie = { by: Math.round(num(d.tie.by, 0, 1e9, 0)), h: d.tie.h, until: num(d.tie.until, 0, 1e14, 0) };
    if (d.ripe && typeof d.ripe === "object" && num(d.ripe.at, 0, 1e14, 0) > 0) s.ripe = { at: num(d.ripe.at, 0, 1e14, 0), every: Math.round(num(d.ripe.every, 2, 30, 7)), from: Math.round(num(d.ripe.from, 0, 29, 3)), days: Math.round(num(d.ripe.days, 1, 10, 2)) };
    if (d.cock && typeof d.cock === "object") s.cock = { load: Math.round(num(d.cock.load, 0, 5e3, 0)), knot: d.cock.knot === true, tie: Array.isArray(d.cock.tie) ? d.cock.tie.slice(0, 2).map((x) => Math.round(num(x, 1, 40, 5))) : null };
    s.mouthAuto = d.mouthAuto === true;
    s.guided = d.guided === true;
    s.iconsShow = d.iconsShow !== false;
    s.iconsShare = d.iconsShare !== false;
    s.wornPause = num(d.wornPause, 0, 1e14, 0);
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
      const H2 = d.hard;
      s.hard = {
        on: H2.on === true,
        since: num(H2.since, 0, 1e14, 0),
        until: num(H2.until, 0, 1e14, 0),
        checkAt: num(H2.checkAt, 0, 1e14, 0),
        log: Array.isArray(H2.log) ? H2.log.filter((l) => l && typeof l === "object").slice(-50).map((l) => ({ t: num(l.t, 0, 1e14, 0), by: Math.round(num(l.by, 0, 1e9, 0)), what: String(l.what || "").slice(0, 200) })) : []
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

  // shared/dose-words.js
  var SEP = "[\\s_\\-]*";
  function loosen(re) {
    const src = re.source.replace(/\[- \]\??/g, SEP).replace(/\\s[+*?]/g, SEP).replace(/ \?/g, SEP).replace(/ /g, SEP);
    return new RegExp(src, re.flags);
  }
  var phrase = (s) => String(s).toLowerCase().trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/['\u2019]/g, "['\u2019]?").replace(/[\s_-]+/g, SEP);
  var DOSE_WORDS = {
    denial: loosen(/\b(denial serum|edge serum|orgasm (?:block\w*|denial)|held at the edge)\b/),
    sedative: loosen(/\b(sedat\w*|tranquili[sz]\w*|drowsy|sleepy serum)\b/),
    needy: loosen(/\b(aphrodisiac|horny|lust serum|libido|needy nectar)\b/),
    hairtrigger: loosen(/\b(hair[- ]?trigger|sensiti[sz]er|oversensitiv\w*)\b/),
    bitterroot: loosen(/\b(bitterroot|ruin(?:ing|ed)? (?:serum|draught|tonic|shot))\b/),
    moo: loosen(/\b(moo (?:serum|shot|juice))\b/),
    hiccup: loosen(/\b(hiccup\w*)\b/),
    feather: loosen(/\b(featherlight|tickl\w* (?:serum|draught|potion|shot))\b/),
    heat: loosen(/\b(heat[- ]?inducer|heat mist|in heat serum)\b/),
    suggestible: loosen(/\b(obedien\w*|docile|compliance|suggest[ia]ble)\b/),
    letdown: loosen(/\b(let[- ]?down (?:tonic|serum|shot|draught|drops?|potion)|leaky (?:tits|teats|udders?) (?:tonic|serum|shot))\b/),
    fillout: loosen(/\b(fill[-_]?out\b|fill[- ]?out (?:serum|shot|tonic|potion|drops?)|swell(?:ing)? (?:serum|shot|tonic|potion|drops?))\b/),
    airhead: loosen(/\b((?:airhead|bimbo) (?:elixir|potion|serum|tonic|shot|juice|drops?))\b/),
    kit: loosen(/\bkit\s*:\s*[a-z0-9]/),
    tongue: loosen(/\b((?:animal|beast|puppy|pup|doggy|dog|kitty|kitten|cat|pony|horse|cow|bovine|bunny|rabbit|fox|vixen|goat|sheep|lamb|piggy|pig|wolf|dragon|rat)[- ]?tongue)\b/),
    babble: loosen(/\b(babble (?:brew|potion|tonic|shot|serum)|potty[- ]?mouth (?:potion|tonic|brew|serum))\b/),
    deepthroat: loosen(/\b(deep[- ]?throat (?:drops?|serum|spray|shot|tonic)|throat relax\w*|gag[- ]?reflex (?:blocker|drops?|serum))\b/),
    rut: loosen(/\b(rut(?:ting)? (?:serum|shot|tonic|potion|musk|drops?)|in[- ]rut (?:serum|shot|tonic))\b/),
    tender: loosen(/\b(tender (?:drops?|serum|balm|oil|shot|tonic)|tenderi[sz]er)\b/),
    honey: loosen(/\bhoney[- ]tongue\b/),
    golden: loosen(/\bgolden[- ]hour\b/),
    musk: loosen(/\b(blue[- ]ribbon[- ]musk|ribbon musk)\b/),
    echo: loosen(/\becho[- ]elixir\b/),
    growcup: loosen(/\b(udder|breast|tits?|boobs?|chest|cup) (growth|boost|enlarger)\b/),
    // (Nov 19, Laynie: "choose the best options for me") a bigger behind is Booty, Hip or Rear Growth. "Ass Growth" is
    // the farm's own shot, the hole opened a size (gape, below): her traps, parasites and roulette all mean it that way.
    growass: loosen(/\b(booty|hips?|rear|bum) (growth|enlarger)\b/),
    gape: loosen(/\b((?:ass|anal|anus|asshole|butt|butthole|backdoor) (?:growth|gape|gaper)|(?:pussy|vulva|vaginal|cunt) (?:growth|gape|gaper))\b/),
    growcock: loosen(/\b(cock|penis|dick|shaft) (growth|enlarger)\b/),
    growballs: loosen(/\b(balls?|testes|testicles?|nuts) (growth|enlarger)\b/),
    reducing: loosen(/\b(reducing (?:serum|shot|tonic|potion|drops?)|(?:udder|breast|boob|tits?|booty|hips?|rear|balls?|testicle|testes|penis|cock|dick) (?:reducer|reducing))\b/),
    // (not "shrinking": that's LSCG's, and it shrinks all of you)
    weakknees: loosen(/\b(weak[- ]?knees?|jelly[- ]?legs?|kneel(?:ing)? (?:serum|draught|shot|tonic|potion))\b/),
    allfours: loosen(/\b(down[- ](?:girl|boy|pet) (?:serum|draught|shot|tonic|potion|drops?)|all[- ]fours (?:serum|draught|shot|tonic|potion|drops?))\b/),
    blinder: loosen(/\b(blind(?:er|ing)? drops?|dim(?:ming)? drops?|darkness drops?)\b/),
    cotton: loosen(/\b(cotton[- ]?ears?|deaf(?:ening)? (?:drops?|serum|draught|tonic)|muffl\w* drops?)\b/),
    tunnel: loosen(/\b(tunnel[- ]?vision(?: (?:drops?|serum|draught|tonic))?|blinker (?:drops?|serum))\b/),
    haze: loosen(/\b(haze (?:drops?|serum|potion|mist|tonic)|hazy (?:drops?|serum|potion)|daze (?:drops?|serum))\b/),
    statue: loosen(/\b(statue (?:serum|potion|tonic|draught|drops?|elixir|shot)|petrif(?:y|ying|ication) (?:serum|potion|tonic|draught|drops?|elixir|shot)|stone[- ]?skin|gilding (?:serum|potion|tonic|draught|drops?|elixir|shot))\b/),
    surecatch: loosen(/\b(sure[- ]?catch(?: (?:serum|shot|tonic|potion|drops?))?|every[- ]load[- ]takes?|womb[- ]?opener)\b/),
    dilator: loosen(/\b(nipple[- ](?:dilat\w*|stretch\w*|opener|spreader)|teat[- ](?:dilat\w*|opener|stretch\w*))\b/),
    balm: loosen(/\b(tightening (?:balm|cream|gel|serum|salve|tonic)|(?:nipple|pussy|ass|butt|hole|throat) (?:tightener|closer|balm)|virgin(?:ity)? (?:balm|tonic|cream|serum|salve))\b/),
    purge: loosen(/\b(purge (?:serum|shot)|antidote|detox|cleanser)\b/),
    // (Nov 19; Laynie: "Definitely the insemination and breeders seal") a load of the crafter's own seed: shared/seed.js
    // reads how much and where. Only plain seed words: "doubles their load" is a virility shot, not this.
    // (Nov 19, breedin' anywhere) a day off a pregnancy, and a look at what's in there
    quicken: loosen(/\b(quicken\w*(?: (?:draught|serum|tonic|potion|drops?|shot))?)\b/),
    scan: loosen(/\b(breeder['\u2019]?s scan(?:ner)?|breeding scan(?:ner)?|womb scan(?:ner)?|belly scan(?:ner)?|pregnancy scan(?:ner)?)\b/),
    seed: loosen(/\b(inseminat\w*|(?:seed|cum|creampie|breeding) (?:syringe|shot|injector|vial|bottle|baster|dose|filler|plunger|pump|serum|cocktail)|(?:full|filled) (?:of|with) (?:my |his |her |their |\w+['’]?s )?(?:seed|cum)|my (?:own )?(?:seed|cum))\b/)
  };

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
    growMax: "%d can't take you any further that way.",
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
    // the Animal Tongue (%a: the animal it makes them)
    tongue: {
      take: [
        "%t's tongue goes thick and strange as the drops take. When they try to speak, a little %a noise comes out first.",
        "Somethin' shifts in %t's throat. Words feel slippery now, and the noises under them feel easy, like a %a's.",
        "%t licks their lips, and it feels all wrong, all %a. The next thing they say is goin' to come out funny.",
        `The Animal Tongue settles in. %t tries to say "no" and it comes out as somethin' a %a would say.`,
        "%t's mouth tingles. They can feel the words driftin' further off, and the %a sounds comin' closer."
      ],
      now: [
        "%t starts to answer and stops, flustered: only a %a noise came out.",
        "%t covers their mouth after that last one. That wasn't a word. That was pure %a.",
        "%t's tryin' so hard to talk properly. Their tongue's havin' none of it.",
        "Every time %t opens their mouth now, there's a little %a in it.",
        "%t gives up on words for a moment and just makes the noise. It's easier.",
        "%t's cheeks go pink. They meant to say somethin' clever, and a %a's noise came out instead."
      ],
      off: [
        "Your tongue feels like yours again. Words come out the way you mean them, mostly.",
        "The Animal Tongue wears off. You can talk properly again, though the noises still feel awful close."
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
  LINES.goldenDote = [
    `\u2728 The farm girl's voice, warm in your ear while you come down: "There it is. That's my good thing. Look how pretty you are when you let go."`,
    '\u2728 "Oh, listen to you. Every one of those is golden, sugar. Every last one."',
    `\u2728 "Good. So good. You've earned every bit of that glow."`
  ];
  LINES.echo = [
    `\u{1F5E3}\uFE0F A sweet voice puts a hand to its heart: "Did y'all hear that? %t just said, and I quote: '%s'. Ain't that just the sweetest thing."`,
    `\u{1F5E3}\uFE0F Somebody sighs, fond as anything: "'%s'. That's what %t said. Precious."`,
    `\u{1F5E3}\uFE0F The room hears it again, sweeter this time: "%t said '%s', and I think we should all remember it."`
  ];
  LINES.grow = {
    cup: [
      "%t gasps as their chest swells. A whole cup bigger, heavy and warm, and it isn't goin' anywhere.",
      "The growth serum floods %t's tits. They round out, fill out, settle heavier, and stay that way.",
      "%t's top goes tight as their breasts grow a size. They'll need new clothes."
    ],
    ass: [
      "%t's hips widen and their ass plumps up a size, round and soft, for good.",
      "The serum goes straight to %t's rear. It swells, jiggles, and stays bigger."
    ],
    cock: [
      "%t groans as their cock grows a size, thicker and longer, and stays that way.",
      "Heat pours into %t's cock. It swells a size bigger, and it's keepin' it."
    ],
    balls: [
      "%t's balls swell a size, heavy and full, and they stay that way.",
      "The serum drops straight into %t's balls. Bigger, heavier, achin' to be emptied."
    ],
    less: [
      "%t's %p shrinks back a size, a little tender for the trip.",
      "A cool tingle, and %t's %p settles a size smaller."
    ]
  };
  var TOLERANCE_NOTE = "Your body's gettin' used to %d: this one only takes %p% as long.";

  // dispensary/src/lines-senses.js
  Object.assign(LINES, {
    weakknees: {
      take: [
        "%t's knees give out all at once. Down they go, and their legs won't take their weight again.",
        "The draught turns %t's legs to jelly. They fold onto their knees with a soft little gasp, and stay there.",
        "%t sways, wobbles, and sinks to their knees. Standin' up is somebody else's job now."
      ],
      now: [
        "Your legs still won't hold you. You'll need a hand to get up.",
        "You try to stand and your knees just laugh at you."
      ],
      off: ["Strength creeps back into your legs. You could stand up now, if you wanted to."]
    },
    allfours: {
      take: [
        "%t drops onto their hands and knees like it's the most natural thing in the world, and finds they can't get up again.",
        "Down, girl: %t goes down on all fours, and that's where their body wants to stay.",
        "%t's arms and legs decide for them. All fours. Good pet."
      ],
      now: [
        "Your body likes it down here. Gettin' up needs a hand.",
        "You shift on your hands and knees. Down's where you belong right now."
      ],
      off: ["The pull to stay down fades. You can stand on your own again."]
    },
    blinder: {
      take: [
        "%t blinks as the drops take. The room goes dim at the edges, then dimmer.",
        "The drops sting, then everything blurs into shadow. %t's eyes are open, and it doesn't help much.",
        "%t's sight fades like somebody's turnin' down the lights."
      ],
      now: ["You squint into the gloom. Shapes, and not much else."],
      off: ["The dark lifts. You blink, and the room comes back."]
    },
    cotton: {
      take: [
        "%t's ears go full and muffled, like they've been stuffed with cotton.",
        "Sound goes far away for %t. Voices turn to murmurs."
      ],
      now: ["Everyone sounds a long way off, and very soft."],
      off: ["Your ears pop, and the room's loud again."]
    },
    tunnel: {
      take: [
        "%t's sight narrows down to a small bright circle. Everything else just isn't there.",
        "The edges of the world fold in on %t till only what's straight ahead is left."
      ],
      now: ["Only what's right in front of you. Turnin' your head is the only way to see anything else."],
      off: ["The world opens back out. You can see the edges again."]
    },
    haze: {
      take: [
        "A warm haze rolls over %t's eyes. Everything goes soft and blurry and dreamy.",
        "%t's sight swims. The room's all soft edges now."
      ],
      now: ["Everything's soft and smudged. It's hard to tell who's who."],
      off: ["The haze clears. Everything's sharp again."]
    }
  });

  // dispensary/src/lines-statue.js
  LINES.statue = {
    take: [
      "%t goes still as the serum takes. Cold creeps over their skin, and in a few heartbeats they're %m from head to toe, hair and all. Only their eyes still move.",
      "A chill runs up %t's legs and keeps on goin'. Skin, hair, every curve sets into smooth %m. They're a statue now, and a pretty one.",
      "%t stiffens mid-breath. Their skin hardens into %m, their hair right along with it, till there's nothin' left but a lovely statue with very much alive eyes.",
      "The serum sets fast. %t turns to %m right where they stand, froze in place for anybody who cares to admire 'em."
    ],
    now: [
      "You're %m all over. You can feel every touch, but you can't so much as twitch.",
      "Whatever you were feelin' when it took, you're stuck right there. No higher, no lower. Just hangin'.",
      "Cold, hard and gorgeous. Folks keep lookin' at you like you're on display, 'cause you are.",
      "Somebody could dust you off and you couldn't do a thing about it.",
      "Your eyes are the only part of you still yours. Everything else is %m.",
      "You'd squirm if you could. You can't. You're just a pretty %m thing to look at."
    ],
    off: [
      "Warmth seeps back in. The %m softens to skin, your hair falls loose, and you can breathe all the way down again.",
      "The serum lets go. You're flesh again, and every bit of what you were feelin' comes rushin' right back.",
      "Little by little the %m gives way to skin. You're you again: a bit stiff, and a whole lot worked up."
    ]
  };

  // dispensary/src/senses.js
  var W2 = window;
  var STANDING = () => Array.isArray(W2.PoseAllStanding) ? W2.PoseAllStanding : ["BaseLower", "LegsClosed", "LegsOpen", "Spread"];
  var isMe = (C2) => !!(C2 && typeof C2.IsPlayer === "function" && C2.IsPlayer());
  function poseNow() {
    return active("allfours") ? "AllFours" : active("weakknees") ? "Kneel" : null;
  }
  function settle() {
    const pose = poseNow();
    if (!pose || !W2.Player) return false;
    try {
      const now = [].concat(W2.Player.ActivePose || []);
      if (now.includes(pose)) return false;
      if (typeof W2.PoseSetActive === "function") {
        W2.PoseSetActive(W2.Player, pose);
        if (typeof W2.ServerSend === "function" && W2.CurrentScreen === "ChatRoom" && typeof W2.ChatRoomCharacterUpdate === "function") W2.ChatRoomCharacterUpdate(W2.Player);
        return true;
      }
    } catch (e) {
    }
    return false;
  }
  var hazed = false;
  function hazeTick() {
    const want = active("haze") && W2.CurrentScreen === "ChatRoom";
    const cv = W2.document && W2.document.getElementById("MainCanvas");
    if (!cv) return;
    if (want && !hazed) {
      cv.style.filter = "blur(" + (1 + Math.min(4, xOfDose("haze"))) + "px)";
      hazed = true;
    } else if (!want && hazed) {
      cv.style.filter = "";
      hazed = false;
    }
  }
  function initSenses(mod2) {
    try {
      mod2.hookFunction("PoseCanChangeUnaidedStatus", 4, (args, next2) => {
        const r = next2(args);
        try {
          const [C2, poseName] = args, PCS = W2.PoseChangeStatus;
          if (isMe(C2) && poseNow() && PCS && STANDING().includes(poseName) && r === PCS.ALWAYS) return PCS.NEVER_WITHOUT_AID;
          if (isMe(C2) && active("allfours") && PCS && poseName === "Kneel" && r === PCS.ALWAYS) return PCS.NEVER_WITHOUT_AID;
        } catch (e) {
        }
        return r;
      });
    } catch (e) {
      console.warn("[Dispensary] Weak Knees can't hold you down:", e);
    }
    const wrapPlayer = () => {
      const P = W2.Player;
      if (!P || P.__fdSenses) return !!P;
      const blind = P.GetBlindLevel, deaf = P.GetDeafLevel;
      if (typeof blind === "function") P.GetBlindLevel = function(...a) {
        const v = blind.apply(this, a);
        return active("blinder") ? Math.max(v, Math.min(3, xOfDose("blinder"))) : v;
      };
      if (typeof deaf === "function") P.GetDeafLevel = function(...a) {
        const v = deaf.apply(this, a);
        return active("cotton") ? Math.max(v, Math.min(4, 1 + xOfDose("cotton"))) : v;
      };
      P.__fdSenses = true;
      return true;
    };
    if (!wrapPlayer()) {
      const t = setInterval(() => {
        if (wrapPlayer()) clearInterval(t);
      }, 1e3);
    }
  }

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
    },
    // ── Nov 18: the four the farm girl says to you herself, moved here so the Dispensary can say them off the farm ──
    honey: {
      seen: [
        "%n tips a spoonful of Honey Tongue onto their tongue and goes dreamy, like somebody's whisperin' sweet nothin's right into their ear. Somebody is.",
        "%n drinks the Honey Tongue and blushes clear down to the collarbone. The praise has already started.",
        "A sticky-sweet Honey Tongue, licked off two fingers. %n squirms like they've just been called a very good pet.",
        "%n swallows the Honey Tongue and leans into nothin', the way you lean into a warm voice."
      ],
      now: [
        `"Look at you, standin' so pretty for me. Best little animal on the property."`,
        `"Every hand on this farm wants a turn with you today, sugar. Can't say I blame 'em."`,
        `"You know what you are? You're a good, good thing, and you look so sweet bein' kept."`,
        '"I could watch you all day. Them hips, that face, the way you just take it. Perfect."',
        `"Such a soft, obedient creature. The farm's lucky to have you, and so am I."`,
        `"Keep bein' this good and I'll make sure everybody hears about it."`
      ],
      off: ["The farm girl's sweet voice drifts out of your ear. Honey Tongue's done, darlin'."]
    },
    golden: {
      seen: [
        "%n drinks off a Golden Hour and giggles at nothin'. Their cheeks are already pink.",
        "The Golden Hour fizzes on %n's tongue, and they go loose and glowy, like they've just been told they're the best little thing on the farm.",
        "%n sips a Golden Hour slow, eyes half-shut, and you can see them start lookin' forward to the next time they cum.",
        "A bottle of liquid sunshine goes down %n, and they stretch like a cat in a warm window."
      ],
      now: [
        "%n's skin has a glow to it, flushed and loose, like they're waitin' for the next one.",
        "%n keeps smilin' at nothin', hips givin' little rolls, chasin' that warm Golden feelin'.",
        "%n's breath catches every time someone brushes past, golden and eager and easy to set off.",
        "There's a honey-slow heat pooled low in %n, and every touch stirs it."
      ],
      off: ["The golden glow cools off. The next one's just yours again, not the farm's.", "The Golden Hour's over. That last one was worth every drop, wasn't it?"]
    },
    musk: {
      seen: [
        "%n rubs a drop of Blue Ribbon Musk into their throat, and the nearest farmhand forgets what they were sayin'.",
        "A whiff of hay and heat comes off %n with every step now. Folks keep lookin' up and not knowing why.",
        "%n dabs Blue Ribbon Musk behind each ear, then, after a thought, a little lower. Heads turn.",
        "The cork comes out, the scent rolls across the yard, and suddenly %n is the most interesting animal in the barn."
      ],
      now: [
        "Heads keep turnin' toward %n. Somethin' about the way they smell today has the whole barn restless.",
        "A farmhand walks past %n, stops, and walks past again, slower this time.",
        "%n catches somebody starin'. They don't even pretend they weren't.",
        "The studs in the far pen have gone quiet and still, noses up, every one of 'em pointed at %n.",
        `The farm girl leans close to %n and breathes in. "Lord, sugar. You're gonna cause a stampede."`
      ],
      off: ["The Blue Ribbon Musk fades. Heads stop turnin' quite so hard.", "Your skin smells like you again. The barn's a little less restless."]
    },
    echo: {
      seen: [
        "%n drinks an Echo Elixir. Somewhere, the farm girl smiles and starts listening very closely.",
        "The Echo Elixir goes down, and everything %n says for a while might come back around. Sweetly.",
        "%n swallows an Echo Elixir and says somethin' silly. The farm girl tucks it away for later.",
        "One Echo Elixir, and %n's words are on loan to the farm girl for the next twenty minutes."
      ],
      now: [],
      off: ["The Echo Elixir's spent. The farm girl stops listenin' quite so close."]
    }
  };

  // dispensary/src/say.js
  var W3 = window;
  var inRoom = () => W3.CurrentScreen === "ChatRoom" && typeof W3.ServerSend === "function";
  var myName = () => {
    const P = W3.Player || {};
    return String(P.Nickname || P.Name || "Somebody");
  };
  function nameOf(mn) {
    const C2 = (W3.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn);
    return C2 ? String(C2.Nickname || C2.Name || "somebody") : "somebody";
  }
  var pick = (a) => a[Math.floor(Math.random() * a.length)];
  var fill = (t, v) => String(t).replace(/%t/g, myName()).replace(/%b/g, v && v.by || "somebody").replace(/%d/g, v && v.dose || "a dose");
  function local(text3, color) {
    try {
      if (typeof W3.ChatRoomSendLocal !== "function" || W3.CurrentScreen !== "ChatRoom") return false;
      const d = W3.document.createElement("div");
      d.style.cssText = "color:" + (color || "#c79bd8") + ";white-space:pre-wrap";
      d.textContent = "\u{1F489} " + text3;
      W3.ChatRoomSendLocal(d.outerHTML);
      return true;
    } catch (e) {
      return false;
    }
  }
  function action(text3) {
    if (!inRoom() || !text3) return false;
    const msg = String(text3).slice(0, 900);
    try {
      W3.ServerSend("ChatRoomChat", { Content: "Beep", Type: "Action", Dictionary: [
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
  var W4 = window;
  var has = (list, mn) => Array.isArray(list) && list.some((x) => (typeof x === "object" && x ? x.MemberNumber : x) === mn);
  var isFarm = (mn) => mn === BOT || PROPRIETORS.includes(mn) || st().farm.includes(mn);
  function isOwner(mn) {
    const P = W4.Player;
    try {
      if (P && typeof P.IsOwnedByMemberNumber === "function" && P.IsOwnedByMemberNumber(mn)) return true;
    } catch (e) {
    }
    return !!(P && P.Ownership && P.Ownership.MemberNumber === mn);
  }
  function isLover(mn) {
    const P = W4.Player;
    try {
      if (P && typeof P.IsLoverOfMemberNumber === "function" && P.IsLoverOfMemberNumber(mn)) return true;
    } catch (e) {
    }
    return has(P && P.Lovership, mn);
  }
  function rungOf(mn) {
    const P = W4.Player;
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
  var DAY2 = 864e5;
  var LATER_WORDS = loosen(/\b(time[- ]?release\w*|slow[- ]?release\w*|delayed|capsules?)\b/);
  var isLater = (text3) => LATER_WORDS.test(String(text3 || "").toLowerCase());
  var LATER_MAX = 5;
  var FUSE_MINS = [5, 40];
  var CRAVE_AFTER = 6;
  var CRAVE_DAYS = 3;
  var CRAVE_EVERY = [20, 40];
  function queue(id, o) {
    o = o || {};
    const S3 = st();
    if (!BOOK[id] || BOOK[id].instant || S3.off[id]) return false;
    if (S3.later.length >= LATER_MAX) return false;
    const fuse = (FUSE_MINS[0] + Math.random() * (FUSE_MINS[1] - FUSE_MINS[0])) * MIN;
    const c = { id, x: Math.max(1, Math.min(5, Math.round(Number(o.x) || 1))), by: Number(o.by) || 0 };
    if (o.p) c.p = String(o.p);
    if (S3.clock === "real") c.fire = Date.now() + fuse * (1 + S3.penalty / 100);
    else c.in = fuse;
    S3.later.push(c);
    save();
    if (!o.quiet) action(fill(pick(LINES.later.set)));
    return true;
  }
  var lastAt = 0;
  var craveNext = 0;
  function laterTick() {
    const S3 = st(), now = Date.now(), gap2 = lastAt ? Math.max(0, Math.min(now - lastAt, 15e3)) : 0;
    lastAt = now;
    let changed = false;
    for (const c of S3.later) if (typeof c.fire !== "number") {
      c.in = Math.max(0, (c.in || 0) - gap2);
    }
    if (inRoom()) {
      const due = S3.later.filter((c) => typeof c.fire === "number" ? c.fire <= now : c.in <= 0);
      for (const c of due) {
        S3.later.splice(S3.later.indexOf(c), 1);
        changed = true;
        action(fill(pick(LINES.later.fire)));
        give(c.id, { by: c.by, x: c.x, p: c.p, later: true });
      }
    }
    if (changed) save();
    craveTick(now);
  }
  function since() {
    const S3 = st(), from = Math.max(S3.cravings || 0, Date.now() - CRAVE_DAYS * DAY2), out = {};
    for (const [id, list] of Object.entries(S3.taken || {})) {
      const n = list.filter((t) => t >= from).length;
      if (n) out[id] = n;
    }
    return out;
  }
  var ours2 = (id) => {
    const B = BOOK[id];
    return !!B && !B.instant && !st().off[id] && !(B.lscg && lscgPresent()) && !B.lscgOnly;
  };
  function craving() {
    const S3 = st();
    if (!S3.cravings) return "";
    const n = since(), total = Object.values(n).reduce((a, b) => a + b, 0);
    if (total < CRAVE_AFTER || doseIds().some(active)) return "";
    const fav = Object.keys(n).filter(ours2).sort((a, b) => n[b] - n[a])[0];
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

  // dispensary/src/worn.js
  var W5 = window;
  var MIN2 = 6e4;
  var DRIP_MINS = 10;
  var INJECT_EVERY = 30;
  var TRIGGER_GAP = 2 * MIN2;
  var PAUSE_MINS = 15;
  var DRIP_WORDS = loosen(/\b(drip\w*|iv|i\.v\.|laced|coated|soaked|infused|seeping)\b/);
  var INJECT_WORDS = loosen(/\b(injector|auto[- ]?inject\w*|dosing|dispenser|pump)\b/);
  var EVERY = loosen(/\bevery\s+(\d{1,3})\s*(?:min|minutes?)\b/);
  var TRIGGERS = {
    climax: loosen(/\b(on|when|whenever|every)\s+(?:she |he |they |you )?(climax\w*|cum\w*|orgasm\w*)\b/),
    kissed: loosen(/\bwhen\s+kiss\w*\b/),
    touched: loosen(/\bwhen\s+(touch\w*|groped|caressed|fondled)\b/),
    spanked: loosen(/\bwhen\s+(spank\w*|slapped|paddled)\b/)
  };
  var ROULETTE_WORDS = loosen(/\b(roulette|mystery (?:dose|shot|serum|drink)|surprise (?:dose|shot))\b/);
  var GLOSS_WORDS = loosen(/\b(lip ?gloss|lip ?stick|lip balm|lip stain)\b/);
  var NIP_DILATE = /\b(dilat(?:or|ing|ion|e|es|ed)|stretch(?:er|ing)|spreader|opener|gaper|widener)/;
  var LSCG_SOAKED = /\b(soaked|laced)\b/;
  function dosesOf(text3) {
    const t = String(text3 || "").toLowerCase();
    const list = dosesIn(t);
    if (ROULETTE_WORDS.test(t)) {
      const S3 = st(), ok = doseIds().filter((id) => {
        const B = BOOK[id];
        return !B.instant && !S3.off[id] && !B.lscgOnly && !(B.lscg && lscgPresent());
      });
      if (ok.length) return [{ id: ok[Math.floor(Math.random() * ok.length)], x: list[0] ? list[0].x : 1, roulette: true }];
    }
    return list;
  }
  var holeOfGear = (item) => {
    const g = String(item && item.Asset && item.Asset.Group && item.Asset.Group.Name || "");
    return g === "ItemVulva" ? "vulva" : g === "ItemButt" ? "butt" : /^ItemMouth/.test(g) ? "mouth" : /^ItemNipples/.test(g) || g === "ItemBreast" ? "nips" : "";
  };
  var crafterOf = (item) => {
    const n = item && item.Craft && Number(item.Craft.MemberNumber);
    return Number.isInteger(n) && n > 0 ? n : 0;
  };
  var me = () => W5.Player && W5.Player.MemberNumber || 0;
  var okFrom = (by) => !by || by === me() || allowed(by);
  var keyOf = (item) => (item.Asset && item.Asset.Group ? item.Asset.Group.Name : "?") + ":" + (item.Craft && item.Craft.Name || "");
  function ours3(id, p) {
    const B = BOOK[id];
    return !!B && !(farmHas(id, p) && botHere()) && !(B.lscg && lscgPresent()) && !B.lscgOnly && !st().off[id];
  }
  function wornGear() {
    const P = W5.Player, out = [];
    if (!P || !Array.isArray(P.Appearance)) return out;
    for (const item of P.Appearance) {
      if (!item || !item.Craft) continue;
      const text3 = craftText(item);
      if (!text3) continue;
      const list = dosesOf(text3).filter((d) => ours3(d.id, d.p));
      const onNips2 = /^ItemNipples/.test(String(item.Asset && item.Asset.Group && item.Asset.Group.Name));
      if (onNips2 && NIP_DILATE.test(text3) && !list.some((d) => d.id === "dilator") && ours3("dilator")) list.push({ id: "dilator", x: stackOf(text3) });
      const roulette = ROULETTE_WORDS.test(text3);
      if (!list.length && !roulette) continue;
      const trig = Object.keys(TRIGGERS).filter((k) => TRIGGERS[k].test(text3));
      const nipGear = onNips2 && list.some((d) => d.id === "dilator");
      const drip0 = nipGear || DRIP_WORDS.test(text3) && !(lscgPresent() && LSCG_SOAKED.test(text3) && !/\bdrip|\biv\b/.test(text3));
      const once = list.length > 0 && list.every((d) => BOOK[d.id] && BOOK[d.id].instant);
      const drip = drip0 && !once, inject = INJECT_WORDS.test(text3) || drip0 && once;
      if (!drip && !inject && !trig.length) continue;
      const every = EVERY.exec(text3);
      out.push({
        item,
        key: keyOf(item),
        text: text3,
        list,
        by: crafterOf(item),
        nm: item.Craft && item.Craft.MemberName ? String(item.Craft.MemberName) : "",
        hole: holeOfGear(item),
        drip,
        inject,
        trig,
        roulette,
        every: Math.max(5, Math.min(240, every ? Number(every[1]) : INJECT_EVERY)),
        gloss: GLOSS_WORDS.test(text3)
      });
    }
    return out;
  }
  var told = {};
  function notAllowed(g) {
    if (Date.now() - (told[g.key] || 0) < 36e5) return;
    told[g.key] = Date.now();
    local(fill(NOTES.notListed, { by: nameOf(g.by) || "#" + g.by, dose: itemName(g.item) }));
  }
  var itemName = (it) => it && it.Craft && it.Craft.Name || it && it.Asset && (it.Asset.Description || it.Asset.Name) || "gear";
  var paused = () => (st().wornPause || 0) > Date.now();
  var lastShot = {};
  function wornTick() {
    if (paused()) return;
    const now = Date.now();
    for (const g of wornGear()) {
      if (!okFrom(g.by)) {
        notAllowed(g);
        continue;
      }
      if (g.drip) for (const d of g.list) {
        if (BOOK[d.id] && BOOK[d.id].instant) continue;
        const was = active(d.id);
        if (was && leftMs(d.id) > (DRIP_MINS - 2) * MIN2) continue;
        const r = give(d.id, { by: g.by, x: d.x, p: d.p, mins: DRIP_MINS, upto: true, quiet: was, line: was ? void 0 : fill(pick(LINES.worn.drip), { dose: BOOK[d.id].label }).replace(/%g/g, itemName(g.item)) });
        if (!r.ok && r.why === "off") continue;
      }
      if (g.inject) {
        const last = lastShot[g.key] || 0;
        if (!last) {
          lastShot[g.key] = now;
          continue;
        }
        if (now - last < g.every * MIN2) continue;
        lastShot[g.key] = now;
        const list = g.roulette ? dosesOf(g.text).filter((d) => ours3(d.id)) : g.list;
        for (const d of list) {
          if (isLater(g.text)) queue(d.id, { by: g.by, x: d.x, p: d.p });
          else give(d.id, { by: g.by, x: d.x, p: d.p, line: fill(pick(LINES.worn.inject), { dose: BOOK[d.id].label }).replace(/%g/g, itemName(g.item)), via: "gear", g: itemName(g.item), nm: g.nm, hole: g.hole });
        }
      }
    }
    const on2 = new Set(wornGear().map((g) => g.key));
    for (const k of Object.keys(lastShot)) if (!on2.has(k)) delete lastShot[k];
  }
  var lastTrig = {};
  function trigger(kind, from) {
    if (paused()) return 0;
    let n = 0;
    for (const g of wornGear()) {
      if (!g.trig.includes(kind)) continue;
      if (!okFrom(g.by)) {
        notAllowed(g);
        continue;
      }
      const k = g.key + "|" + kind;
      if (Date.now() - (lastTrig[k] || 0) < TRIGGER_GAP) continue;
      lastTrig[k] = Date.now();
      const list = g.roulette ? dosesOf(g.text).filter((d) => ours3(d.id)) : g.list;
      for (const d of list) {
        const r = give(d.id, { by: g.by, x: d.x, p: d.p, line: fill(pick(LINES.worn[kind] || LINES.worn.inject), { dose: BOOK[d.id].label, by: from ? nameOf(from) : "somebody" }).replace(/%g/g, itemName(g.item)), via: "gear", g: itemName(g.item), nm: g.nm, hole: g.hole });
        if (r.ok) n++;
      }
    }
    return n;
  }
  var glossAt = {};
  function kissedBy(mn) {
    const C2 = (W5.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn);
    if (!C2 || !Array.isArray(C2.Appearance) || paused()) return 0;
    let n = 0;
    for (const item of C2.Appearance) {
      if (!item || !item.Craft) continue;
      const text3 = craftText(item);
      if (!GLOSS_WORDS.test(text3)) continue;
      const by = crafterOf(item) || mn;
      if (!allowed(by) && !allowed(mn)) {
        local(fill(NOTES.notListed, { by: nameOf(mn), dose: itemName(item) }));
        continue;
      }
      const k = mn + ":" + keyOf(item);
      if (Date.now() - (glossAt[k] || 0) < TRIGGER_GAP) continue;
      glossAt[k] = Date.now();
      for (const d of dosesOf(text3).filter((x) => ours3(x.id))) {
        const r = give(d.id, { by: mn, x: d.x, p: d.p, line: fill(pick(LINES.worn.gloss), { dose: BOOK[d.id].label, by: nameOf(mn) }), sire: by, nm: item.Craft.MemberName ? String(item.Craft.MemberName) : "", via: "kiss" });
        if (r.ok) n++;
      }
    }
    return n;
  }
  var KISS = /^(Kiss|FrenchKiss|PoliteKiss|GaggedKiss|SiblingsCheekKiss|GagKiss)$/;
  var TOUCH = /^(Caress|Grope|Pinch|Tickle|Rub|MassageHands|Pet|Cuddle|RubItem|TickleItem|SqueezeItem|RollItem|BrushItem|Lick|Nibble|Suck)$/;
  var SPANK = /^(Spank|Slap|SpankItem)$/;
  function onActivity(name, from) {
    if (!name || from === me()) return;
    if (KISS.test(name)) {
      trigger("kissed", from);
      kissedBy(from);
    } else if (SPANK.test(name)) {
      trigger("spanked", from);
      trigger("touched", from);
    } else if (TOUCH.test(name)) trigger("touched", from);
  }
  function initWorn(mod2) {
    try {
      mod2.hookFunction("ActivityOrgasmStart", 4, (args, next2) => {
        try {
          const C2 = args[0];
          if (C2 && typeof C2.IsPlayer === "function" && C2.IsPlayer()) setTimeout(() => trigger("climax"), 500);
        } catch (e) {
        }
        return next2(args);
      });
    } catch (e) {
      console.warn("[Dispensary] gear can't feel you cum:", e);
    }
  }
  function wornReset() {
    for (const o of [lastShot, lastTrig, glossAt, told]) for (const k of Object.keys(o)) delete o[k];
  }

  // shared/protocol.js
  var FARM_MSG = "FarmhandMsg";
  var PROTOCOL = 2;
  function makeMsg(type, data = {}, target2) {
    const m = { Content: FARM_MSG, Type: "Hidden", Dictionary: { v: PROTOCOL, type, ...data } };
    if (target2) m.Target = target2;
    return m;
  }
  function readMsg(data) {
    if (!data || data.Type !== "Hidden" || data.Content !== FARM_MSG) return null;
    const d = data.Dictionary;
    if (!d || typeof d !== "object" || Array.isArray(d) || typeof d.type !== "string") return null;
    return { ...d, from: data.Sender };
  }

  // dispensary/src/toys-list.js
  var W6 = window;
  var TOYS = [
    { id: "FarmNipBeadsXL", from: ["ItemButt", "AnalBeads2"], label: "Nipple Beads XL", open: 2, states: "typed" },
    { id: "FarmNipBeads", from: ["ItemButt", "AnalBeads"], label: "Nipple Beads", open: 3 },
    { id: "FarmNipPlug", from: ["ItemButt", "BlackButtPlug"], label: "Black Nipple Plug", open: 3 },
    { id: "FarmNipHeartPlug", from: ["ItemButt", "SuccubusHeartButtPlug"], label: "Succubus Heart Nipple Plug", open: 2 },
    { id: "FarmNipDemonPlug", from: ["ItemButt", "DemonPlug"], label: "Demon Tail Nipple Plug", open: 2 },
    { id: "FarmNipLockPlug", from: ["ItemButt", "ButtPlugLock"], label: "Nipple Plug Lock", open: 3, lock: true },
    { id: "FarmNipPumpPlug", from: ["ItemButt", "InflVibeButtPlug"], label: "Inflatable Vibrating Nipple Plug", open: 2, states: "pump", vibe: "modular" },
    { id: "FarmNipVibePlug", from: ["ItemButt", "VibratingButtplug"], label: "Vibrating Nipple Plug", open: 3, vibe: true },
    { id: "FarmNipEgg", from: ["ItemVulva", "VibratingEgg"], label: "Nipple Vibrating Egg", open: 2, vibe: true },
    { id: "FarmNipWiredEgg", from: ["ItemVulva", "WiredEgg"], label: "Wired Nipple Egg", open: 2, vibe: true },
    { id: "FarmNipBenWa", from: ["ItemVulva", "BenWaBalls"], label: "Nipple Ben Wa Balls", open: 2 },
    { id: "FarmNipDildo", from: ["ItemVulva", "PenisDildo"], label: "Nipple Dildo", open: 3 },
    { id: "FarmNipVibeDildo", from: ["ItemVulva", "VibratingDildo"], label: "Vibrating Nipple Dildo", open: 3, vibe: true },
    { id: "FarmNipPumpDildo", from: ["ItemVulva", "InflatableVibeDildo"], label: "Inflatable Vibrating Nipple Dildo", open: 3, states: "pump", vibe: "modular" },
    { id: "FarmNipSound", from: ["ItemVulvaPiercings", "UrethralSound"], label: "Nipple Sound", open: 1 }
  ];
  var TOY_BY = Object.fromEntries(TOYS.map((t) => [t.id, t]));
  function toyIn(C2) {
    const it = C2 && Array.isArray(C2.Appearance) ? C2.Appearance.find((i) => i && i.Asset && i.Asset.Group && i.Asset.Group.Name === "ItemNipples") : null;
    return it && TOY_BY[it.Asset.Name] ? it : null;
  }
  var toyOf = (it) => it && it.Asset ? TOY_BY[it.Asset.Name] || null : null;
  var toyLocked = (it) => !!(it && it.Property && it.Property.LockedBy);
  function toyOpen(C2) {
    const it = toyIn(C2), T = toyOf(it);
    if (!T) return 0;
    const f = T.states === "pump" ? Number(it.Property && it.Property.InflateLevel) || 0 : 0;
    return Math.max(1, Math.min(3, T.open + Math.ceil(f / 2)));
  }
  var mineToy = () => toyIn(W6.Player);

  // dispensary/src/lines-horny.js
  LINES.horny = {
    hole_room: [
      "%t's %g starts movin' by itself, slow, deep thrusts that make their hips jerk.",
      "Somethin' inside %t shifts and pushes. Their %g's decided it's not done with them.",
      "%t squirms, thighs pressed together: their %g is workin' itself in and out of them.",
      "A wet little sound, and %t's breath catches. Their %g is fuckin' them again, all on its own.",
      "%t goes up on their toes for a moment as their %g swells and drives in deeper.",
      "%t bites their lip and grinds down without meanin' to. Whatever their %g's doin' in there, it's workin'.",
      "%t's knees go soft. Their %g has found a rhythm and it's keepin' it."
    ],
    hole_mine: [
      "Your %g pushes deeper, all by itself, and then it starts to thrust.",
      "Your %g twists inside you, slow, like it's feelin' for the spot. It finds it.",
      "Your %g swells and drags back, swells and pushes in. Over and over. It isn't stoppin'.",
      "A long, slow stroke from your %g, all the way in, and it holds there till you whimper.",
      "Your %g's feelin' hungry again. You can tell by how hard it's fuckin' you.",
      "Your %g flexes inside you, squeezin' and pressin', and your whole body clenches round it.",
      "Your %g's in no hurry. Deep, steady, patient. It knows you'll give in.",
      "Your %g pulls almost all the way out, teasin', then fills you again in one push."
    ],
    hole_rough: [
      "Your %g doesn't bother teasin'. It just fucks you, hard and fast, till your legs shake.",
      "Your %g slams in deep and stays there, throbbin', stretchin' you wider than you were.",
      "Your %g's ravenous. It pounds into you like it's tryin' to get somethin' out of you, and it will.",
      "Your %g twists and thrusts at once and you can't think about anythin' else.",
      "Your %g ruts into you, rough and greedy, and it won't let up for anythin'.",
      "Your %g batters that one spot over and over till you're squirmin' and gaspin'."
    ],
    nips_room: [
      "%t gasps and clutches at their chest. Their %g has started suckin' on them again.",
      "%t's %g tugs at their nipples, hard, and they arch to follow it.",
      "%t squirms as their %g pulses round their nipples, pullin' them tight and achin'.",
      "Their %g gives %t's nipples a long, hungry pull, and %t whimpers right out loud.",
      "%t's nipples are bein' worked by their %g, and everybody can tell from the look on their face."
    ],
    nips_mine: [
      "Your %g latches tighter and suckles, slow and greedy, till your nipples throb.",
      "Your %g pulls your nipples long and lets go, pulls and lets go. Your chest's on fire with it.",
      "Your %g pushes into your stretched nipple and fucks it, little short strokes that go straight to your core.",
      "Your %g nibbles and tugs, nibbles and tugs, like it's tryin' to milk you.",
      "Your %g suckles so hard your nipples feel twice their size.",
      "Your %g twists and pulls, and you can't tell any more if it hurts or if it's the best thing you've ever felt."
    ],
    nips_rough: [
      "Your %g yanks at your nipples, rough, then suckles them till they're swollen and sore.",
      "Your %g fucks your open nipples deep and fast, stretchin' them round it.",
      "Your %g pulls so hard your whole chest lifts with it. It doesn't stop.",
      "Your %g's ravenous for your nipples. Suckin', bitin', tuggin', all at once."
    ],
    mouth_room: [
      "%t's eyes water as their %g pushes deeper down their throat, all by itself.",
      "A wet, muffled sound from %t: their %g is fuckin' their mouth again.",
      "%t's throat bulges round their %g as it thrusts, slow and steady.",
      "%t drools round their %g, helpless, while it works their mouth over.",
      "%t gags quietly as their %g decides to go a little deeper."
    ],
    mouth_mine: [
      "Your %g slides deeper, fillin' your throat, and starts to fuck your mouth.",
      "Your %g pushes past your tongue and holds there, makin' you swallow round it.",
      "Your %g strokes in and out of your mouth like it owns it. Drool runs down your chin.",
      "Your %g swells on your tongue, then pushes for your throat. You let it.",
      "Your %g's usin' your mouth again, slow and deep, and your eyes go soft and wet."
    ],
    mouth_rough: [
      "Your %g throat-fucks you hard, and all you can do is drool and take it.",
      "Your %g shoves deep and stays there till your eyes stream and your lungs burn, then does it again.",
      "Your %g's ravenous for your throat. It fucks it raw, and your gag reflex gives up on you.",
      "Your %g pounds your mouth like a pussy. Spit's everywhere."
    ],
    crotch_room: [
      "%t's %g pulls tight between their legs and starts to grind.",
      "%t squirms as their %g tightens, rubbin' right where they're most sensitive.",
      "%t's hips rock all on their own, chasin' the slow grind of their %g.",
      "Their %g cinches in and drags across %t's crotch, and %t lets out a little moan."
    ],
    crotch_mine: [
      "Your %g tightens between your legs and rubs, slow, right where you're most sensitive.",
      "Your %g shifts and grinds, pressin' into you, and won't let you get comfortable.",
      "Your %g squeezes tighter, then tighter, then starts to rock against you.",
      "Your %g's knot finds just the right spot and works it, round and round.",
      "Your %g tugs itself snug and grinds, like a hand pressed hard between your legs."
    ],
    crotch_rough: [
      "Your %g cinches in hard and saws back and forth across your crotch till you're shakin'.",
      "Your %g grinds so hard and fast you can feel yourself gettin' soaked through.",
      "Your %g digs in tight and won't stop rubbin', no matter how you twist."
    ],
    tipped: [
      "%t's %g doesn't stop, and %t can't hold it any more. They're cummin', hard, right there in front of everybody.",
      "That's it for %t: their %g pushes them right over the edge, shakin' and cryin' out.",
      "%t's whole body locks up. Their %g's made them cum, and it's still goin'.",
      "%t never stood a chance. Their %g fucks them straight through their climax.",
      "With one last push from their %g, %t comes apart, moanin' and twitchin'."
    ],
    bred_hole: [
      "%t's %g pulses deep inside them as they cum, and floods them, hot and thick. It's bred them.",
      "As %t cums, their %g swells and empties into them, pumpin' and pumpin' till it runs back out.",
      "%t's %g throbs and fills them with a warm, heavy load. It leaks down their thighs.",
      "Their %g cums when %t does: a hot gush deep inside, and then another. They're stuffed with it.",
      "%t's %g knots up and pumps its seed into them, slow, thick pulses, till their belly feels full."
    ],
    bred_mouth: [
      "%t's %g pulses down their throat as they cum, and they've no choice but to swallow every hot drop.",
      "%t's %g empties into their mouth, thick and salty. Some of it runs down their chin.",
      "As %t cums, their %g floods their mouth. They gulp and gulp and still can't keep up."
    ],
    bred_nips: [
      "%t's %g pulses and pumps somethin' warm and thick right into their stretched nipples. It wells back out, white.",
      "As %t cums, their %g fills their nipples till cream drips from them."
    ],
    bred_crotch: [
      "%t's %g throbs as they cum, and their crotch is suddenly soaked, warm and sticky.",
      "As %t cums, their %g pulses and leaves them drippin' between their legs."
    ],
    // horny parasites (only you, mostly)
    para_lips: [
      "The parasite lips on you pucker and suck, hungry, leavin' a hot, tinglin' mark.",
      "The lips on your skin kiss their way a little lower, wet and greedy.",
      "The parasite lips nibble and suck at you till you squirm. They want feedin'."
    ],
    para_latex: [
      "Your livin' latex tightens all over, squeezin' your tits and pressin' between your legs.",
      "The latex on you shifts and gropes, slick and warm, like a dozen hands at once.",
      "Your livin' latex pushes a slick little tendril inside you and wriggles.",
      "The latex hugs you tighter and starts to pulse, right where you're most sensitive."
    ],
    para_moss: [
      "The milk moss on your chest nuzzles and suckles at your nipples, coaxin' a drop out.",
      "The moss tightens round your nipples and drinks, slow and steady, and you can't help but moan.",
      "The milk moss squeezes your tits in waves, like it's milkin' you by hand."
    ],
    para_nestling: [
      "The nestling squirms low in your belly, rubbin' against everythin' sensitive in there.",
      "Somethin' turns over inside you and presses, warm and heavy. The nestling's restless.",
      "The nestling wriggles and nudges deep inside, and your hips buck without you meanin' them to."
    ],
    para_brood: [
      "The brood mother shifts inside you, heavy and greedy, and somethin' presses at the way out.",
      "The brood mother stirs and squeezes, and you feel full all over again.",
      "Deep inside, the brood mother writhes, and every squirm of hers sends a jolt up your spine."
    ],
    para_nips: [
      "The leeches on your nipples suck harder, stretchin' you open as they drink.",
      "The nipple leeches wriggle deeper into you, tuggin' and suckin' all at once.",
      "Your leeches pulse and swell, holdin' your nipples wide and wet and achin'."
    ],
    tipped_para: [
      "The thing that's got hold of %t won't stop, and they cum, gaspin', right where they stand.",
      "%t can't take any more of what's squirmin' in them. They're cummin', shakin' all over.",
      "%t's hijacked body gives in. The parasite in them has made them cum."
    ]
  };

  // shared/seed.js
  var SEED_HOLES = ["vulva", "butt", "mouth", "nips"];
  var SEED_WORD = { vulva: "pussy", butt: "ass", mouth: "throat", nips: "nipples" };
  var SEED_DEFAULT_ML = 50;
  var SEED_HOLE_MAX = 2e4;
  var SEED_TOTAL_MAX = 4e4;
  var GALLON_ML = 3785;
  var SEED_HALF_LIFE_H = { vulva: 12, butt: 6, mouth: 1, nips: 12 };
  var GAPE_LEAK_X = 0.15;
  var BASE_CAP = 200;
  var NIP_CAP = 1e3;
  var SEED_GAP_MS = 10 * 6e4;
  var SEAL_WORDS = loosen(/\b(breeder['’]?s seal|breeding seal|sire['’]?s seal|(?:seed|cum) (?:seal|lock|keeper|stopper))\b/);
  function sealHolesOf(group) {
    const g = String(group || "");
    if (g === "ItemVulva" || g === "ItemVulvaPiercings") return ["vulva"];
    if (g === "ItemButt") return ["butt"];
    if (/^ItemMouth/.test(g)) return ["mouth"];
    if (/^ItemNipples/.test(g)) return ["nips"];
    if (g === "ItemPelvis") return ["vulva", "butt"];
    return [];
  }
  function sealsOn(appearance, textOf) {
    const out = [];
    for (const it of Array.isArray(appearance) ? appearance : []) {
      if (!it || !it.Craft || !it.Asset || !it.Asset.Group) continue;
      const by = Number(it.Craft.MemberNumber) || 0, holes = sealHolesOf(it.Asset.Group.Name);
      if (!by || !holes.length || !SEAL_WORDS.test(String(textOf(it) || ""))) continue;
      out.push({ holes, by, maker: String(it.Craft.MemberName || "").slice(0, 40), name: String(it.Craft.Name || it.Asset.Description || it.Asset.Name || "seal").slice(0, 40), key: it.Asset.Group.Name + ":" + (it.Craft.Name || "") });
    }
    return out;
  }
  var WORDN = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  var UNIT = "(ml|mls|millilit(?:er|re)s?|cc|l|ltrs?|lit(?:er|re)s?|gal|gals|gallons?)";
  var NUM = "(\\d{1,3}(?:,\\d{3})+|\\d+(?:[.,]\\d+)?(?:\\s*\\/\\s*\\d+)?|half\\s+an?|an?\\s+half|(?:a\\s+)?quarter(?:\\s+of)?(?:\\s+an?)?|half|one|two|three|four|five|six|seven|eight|nine|ten|an?)";
  var AMOUNT = new RegExp("(?<![a-z0-9.,/])" + NUM + "[\\s_-]*(?:full[\\s_-]+)?" + UNIT + "(?![a-z])", "g");
  function valueOf(s) {
    s = String(s).trim().replace(/\s+/g, " ");
    let m = /^(\d+)\s*\/\s*(\d+)$/.exec(s);
    if (m) return Number(m[1]) / Math.max(1, Number(m[2]));
    if (/^\d{1,3}(,\d{3})+$/.test(s)) return Number(s.replace(/,/g, ""));
    if (/^\d/.test(s)) return Number(s.replace(",", "."));
    if (/half/.test(s)) return 0.5;
    if (/quarter/.test(s)) return 0.25;
    return WORDN[s] || 1;
  }
  var mlOf = (n, u) => n * (/^(ml|mls|cc|millilit)/.test(u) ? 1 : /^gal/.test(u) ? GALLON_ML : 1e3);
  function amountsIn(text3) {
    const out = [], t = String(text3 || "").toLowerCase();
    AMOUNT.lastIndex = 0;
    let m;
    while (m = AMOUNT.exec(t)) {
      const ml = mlOf(valueOf(m[1]), m[2]);
      if (ml > 0) out.push({ ml: Math.min(SEED_HOLE_MAX, Math.round(ml)), at: m.index });
    }
    return out;
  }
  var HOLE_FIND = [
    ["every", /\b(?:every|all|each)(?:[\s_-]+(?:of[\s_-]+)?(?:her|his|their|your|my|the|its|three|four))?[\s_-]+holes?\b/g],
    ["both", /\bboth(?:[\s_-]+(?:of[\s_-]+)?(?:her|his|their|your|my|the))?[\s_-]+holes\b/g],
    ["vulva", /\b(?:pussy|pussies|cunt|vulva|vagina\w*|womb|slit|cooch|twat|front[\s_-]?hole)\b/g],
    ["butt", /\b(?:ass|arse|asshole|butt|butthole|anus|anal|rear|bum|backdoor|bowels?|back[\s_-]?hole)\b/g],
    ["mouth", /\b(?:mouth|throat|oral|gullet|stomach)\b/g],
    ["nips", /\b(?:nipples?|nips|teats?|tits?|titties|breasts?|boobs?|udders?)\b/g]
  ];
  function holesIn(text3) {
    const out = [], t = String(text3 || "").toLowerCase();
    for (const [k, re] of HOLE_FIND) {
      re.lastIndex = 0;
      let m;
      while (m = re.exec(t)) out.push({ k, at: m.index });
    }
    return out.sort((a, b) => a.at - b.at);
  }
  var CLAUSE = /(?<!\d),|,(?!\d)|[;|\n]+|\.(?!\d)|\s(?:then|plus)\s/;
  function seedAmounts(text3) {
    const t = String(text3 || "").toLowerCase().replace(/_+/g, " "), out = {};
    const add2 = (k, v) => {
      out[k] = Math.min(SEED_HOLE_MAX, (out[k] || 0) + Math.max(0, Math.round(v)));
    };
    const orphanH = [], orphanA = [];
    for (const c of t.split(CLAUSE)) {
      if (!c || !c.trim()) continue;
      const A = amountsIn(c), H2 = holesIn(c);
      if (!H2.length) {
        for (const a of A) orphanA.push(a.ml);
        continue;
      }
      if (!A.length) {
        for (const x of H2) orphanH.push(x.k);
        continue;
      }
      if (A.length === 1) {
        for (const x of H2) add2(x.k, A[0].ml);
        continue;
      }
      if (A.length === H2.length) {
        H2.forEach((x, i) => add2(x.k, A[i].ml));
        continue;
      }
      for (const x of H2) {
        let best = A[0], bd = Infinity;
        for (const a of A) {
          const d = Math.abs(a.at - x.at);
          if (d < bd) {
            bd = d;
            best = a;
          }
        }
        add2(x.k, best.ml);
      }
    }
    if (orphanH.length) orphanH.forEach((k, i) => add2(k, orphanA.length ? orphanA[Math.min(i, orphanA.length - 1)] : SEED_DEFAULT_ML));
    else if (orphanA.length && !Object.keys(out).length) add2("any", orphanA.reduce((a, b) => a + b, 0));
    if (!Object.keys(out).length) add2("any", SEED_DEFAULT_ML);
    return out;
  }
  var KEYS = ["vulva", "butt", "mouth", "nips", "every", "both", "any"];
  var seedEncode = (a) => KEYS.filter((k) => a && a[k] > 0).map((k) => k + "=" + Math.round(a[k])).join(",");
  function seedDecode(p) {
    const out = {};
    for (const bit of String(p || "").split(",")) {
      const m = /^([a-z]+)=(\d{1,6})$/.exec(bit.trim());
      if (m && KEYS.includes(m[1])) out[m[1]] = Math.min(SEED_HOLE_MAX, Number(m[2]));
    }
    return out;
  }
  function seedPlan(a, o) {
    o = o || {};
    const pussy = !o.have || o.have.includes("vulva"), out = {}, x = Math.max(1, Math.min(5, Math.round(Number(o.x) || 1)));
    const drunk = o.via === "sip" || o.via === "kiss";
    const put = (h2, v) => {
      if (drunk) h2 = "mouth";
      if (h2 === "vulva" && !pussy) h2 = "butt";
      out[h2] = (out[h2] || 0) + v;
    };
    for (const [k, v] of Object.entries(a || {})) {
      if (!(v > 0)) continue;
      if ((k === "every" || k === "both") && drunk) put("mouth", v);
      else if (k === "every") {
        for (const h2 of ["vulva", "butt", "mouth"]) if (h2 !== "vulva" || pussy) put(h2, v);
        if (o.nipsOpen) put("nips", v);
      } else if (k === "both") {
        if (pussy) put("vulva", v);
        put("butt", v);
      } else if (k === "any") put(o.via === "sip" || o.via === "kiss" ? "mouth" : o.hole && SEED_HOLES.includes(o.hole) ? o.hole : "vulva", v);
      else if (SEED_HOLES.includes(k)) put(k, v);
    }
    let total = 0;
    for (const h2 of Object.keys(out)) {
      out[h2] = Math.min(SEED_HOLE_MAX, Math.round(out[h2] * x));
      total += out[h2];
    }
    if (total > SEED_TOTAL_MAX) for (const h2 of Object.keys(out)) out[h2] = Math.round(out[h2] * SEED_TOTAL_MAX / total);
    return out;
  }
  function amountSay(ml) {
    ml = Math.max(0, Number(ml) || 0);
    if (ml >= GALLON_ML * 0.95) {
      const g = Math.round(ml / GALLON_ML * 10) / 10;
      return (g === Math.round(g) ? String(Math.round(g)) : g.toFixed(1)) + (g === 1 ? " gallon" : " gallons");
    }
    if (ml >= 1e3) return (Math.round(ml / 100) / 10).toFixed(1).replace(/\.0$/, "") + " L";
    return Math.round(ml) + " mL";
  }
  function loadSay(ml) {
    return ml < 5 ? "a little dribble" : ml < 15 ? "a load" : ml < 40 ? "a thick load" : ml < 100 ? "a huge load" : ml < 300 ? "a gushin' flood" : ml < 1e3 ? "a floodin' torrent" : ml < GALLON_ML ? "a bellyful" : "a flood fit to burst a body";
  }
  function bellyFrom(held, cap) {
    const full = Math.max(0, Number(held) || 0) / Math.max(1, Number(cap) || BASE_CAP), w = full > 0.8 ? (full - 0.8) * 3 : 0;
    return w >= 8 ? 4 : w >= 4 ? 3 : w >= 2 ? 2 : w >= 0.8 ? 1 : 0;
  }

  // shared/holes.js
  var HOLES = ["vulva", "butt", "throat"];
  var GAPE = [
    "tight",
    "snug",
    "slightly gaped",
    "gaped",
    "loose",
    "well-used",
    "gaping",
    "wide open",
    "cavernous",
    "ruined",
    "hyper-gaped",
    "fist-wide",
    "yawning",
    "arm-deep",
    "sloppy and slack",
    "bottomless",
    "hollowed out",
    "endless",
    "abyssal",
    "impossibly gaped"
  ];
  var THROAT = [
    "gaggy",
    "tight",
    "learnin'",
    "eager",
    "practiced",
    "trained",
    "deep",
    "greedy",
    "no gag reflex",
    "bottomless",
    "hyper-trained",
    "stretchy",
    "endless",
    "swallow-anything",
    "cock sleeve",
    "limitless",
    "living funnel",
    "insatiable",
    "abyssal",
    "impossibly deep"
  ];
  var HOLE_SIZES = {
    vulva: { label: "Pussy", start: 1, natural: 10, max: 20, names: GAPE },
    butt: { label: "Ass", start: 1, natural: 10, max: 20, names: GAPE },
    throat: { label: "Throat", start: 2, natural: 10, max: 20, names: THROAT }
  };
  var HOLE_WORD = { vulva: "pussy", butt: "ass", throat: "throat" };
  var TRAIN_H = 12;
  var TIGHTEN_H = 24;
  var HEAL_GRACE_H = 24;
  var HEAL_PER_DAY = 0.5;
  var USE_BUDGET_H = 6;
  var clampSize = (h2, n) => {
    const S3 = HOLE_SIZES[h2];
    return Math.max(1, Math.min(S3 ? S3.max : 20, Math.round(Number(n) || 1)));
  };
  var sizeWord = (h2, n) => (HOLE_SIZES[h2] || HOLE_SIZES.butt).names[clampSize(h2, n) - 1];
  var THROAT_SAY = { "no gag reflex": "past gaggin'", "trained": "well trained", "swallow-anything": "ready to swallow anything", "cock sleeve": "a cock sleeve", "living funnel": "a livin' funnel" };
  var sizeSay = (h2, n) => {
    const w = sizeWord(h2, n);
    return h2 === "throat" ? THROAT_SAY[w] || w : w;
  };
  function holeOfGroup(g) {
    g = String(g || "");
    return g === "ItemVulva" ? "vulva" : g === "ItemButt" ? "butt" : /^ItemMouth[23]?$/.test(g) ? "throat" : null;
  }
  var TOYS2 = {
    ItemButt: {
      BlackButtPlug: 3,
      PenisPlug: 3,
      SuccubusButtPlug: 3,
      SuccubusHeartButtPlug: 3,
      DemonPlug: 4,
      VibratingButtplug: 3,
      ButtPlugLock: 3,
      VibratingDildoPlug: 3,
      LockingVibePlug: 3,
      ShockPlug: 3,
      FuckPlug: 4,
      Tentacles: 4,
      HollowButtPlug: 5,
      EggVibePlugXXL: 6,
      AnalHook: 2,
      AnalBeads: 2,
      TailButtPlug: 2,
      HorsetailPlug: 2,
      HorsetailPlug1: 2,
      PuppyTailPlug: 2,
      PuppyTailPlug1: 2,
      FoxTails: 2,
      FoxTail: 2,
      RaccoonButtPlug: 2,
      RaccoonTailPlug: 2,
      KittenTail1: 2,
      KittenTail2: 2,
      WolfTail1: 2,
      WolfTail2: 2,
      WolfTail3: 2,
      MouseTail1: 2,
      MouseTail2: 2,
      BunnyTailPlug1: 2,
      BunnyTailPlug2: 2,
      BunnyTailVibePlug: 2,
      Cowtail: 2,
      ButtPump: { pump: "typed", sizes: [2, 4, 6, 8, 10] },
      InflVibeButtPlug: { pump: "f", sizes: [2, 4, 5, 7, 8] },
      AnalBeads2: { pump: "beads", sizes: [2, 2, 3, 3, 4] }
    },
    ItemVulva: {
      VibratingEgg: 1,
      WiredEgg: 1,
      MoreWiredVibrators: 1,
      LoversVibrator: 1,
      BenWaBalls: 2,
      FuturisticVibrator: 2,
      PenisDildo: 3,
      ShockDildo: 3,
      VibratingDildo: 3,
      ClitAndDildoVibratorbelt: 3,
      DoubleEndDildo: { typed: [3, 5] },
      InflatableVibeDildo: { pump: "f", sizes: [2, 4, 5, 7, 8] },
      InflatableVibratingPanties: { pump: "f", sizes: [1, 2, 3, 4, 5] }
    },
    ItemMouth: {
      DildoGag: 3,
      DeepthroatGag: 5,
      LargeDildo: 5,
      Tentacles: 5,
      PlugGag: { typed: [0, 2] },
      DildoPlugGag: { typed: [0, 4] },
      OTNPlugGag: { typed: [0, 3] },
      PumpGag: { pump: "typed", sizes: [1, 2, 3, 4, 5] }
    }
  };
  var toyRow = (group, name) => {
    const T = TOYS2[/^ItemMouth/.test(group) ? "ItemMouth" : group];
    return T ? T[name] : void 0;
  };
  function notchOf(item, row) {
    const P = item && item.Property || {}, TR = P.TypeRecord || {};
    if (row.pump === "beads") return Math.max(0, Math.min(4, (Number(P.InsertedBeads) || (typeof TR.typed === "number" ? TR.typed + 1 : 1)) - 1));
    if (typeof P.InflateLevel === "number") return Math.max(0, Math.min(4, P.InflateLevel));
    const n = row.pump === "f" ? TR.f : TR.typed;
    return Math.max(0, Math.min(row.sizes ? row.sizes.length - 1 : 4, Number(n) || 0));
  }
  var BIGGER = [
    [5, /\b(colossal|titanic|impossible|hyper)\b/],
    [3, /\b(xxl|enormous|monster|monstrous|giant|horse|stallion|equine|dragon)\b/],
    [2, /\b(huge|xl|extra[- ]large|massive|beefy|hefty)\b/],
    [1, /\b(large|big|thick|fat|chunky|girthy)\b/]
  ];
  var SMALLER = /\b(tiny|small|little|petite|slim|slender|thin|mini)\b/;
  function sizeShift(text3) {
    const t = String(text3 || "").toLowerCase();
    for (const [n, re] of BIGGER) if (re.test(t)) return n;
    return SMALLER.test(t) ? -1 : 0;
  }
  var TRAINER = /\b(stretch\w*|gap(?:er|e|ing)|dilat\w*|expander|spreader|train(?:er|ing)|widener|loosener)\b/;
  var CRUEL = /\b(cruel\w*|sadist\w*|merciless|vicious|punishing|brutal)\b/;
  function toyIn2(item, text3) {
    if (!item || !item.Asset || !item.Asset.Group) return null;
    const group = item.Asset.Group.Name, hole2 = holeOfGroup(group), row = hole2 ? toyRow(group, item.Asset.Name) : void 0;
    if (row === void 0) return null;
    text3 = String(text3 || "").toLowerCase();
    let base, pump = null;
    if (typeof row === "number") base = row;
    else if (row.typed) {
      base = row.typed[Math.max(0, Math.min(row.typed.length - 1, Number(((item.Property || {}).TypeRecord || {}).typed) || 0))];
    } else {
      const n = notchOf(item, row);
      base = row.sizes[n];
      pump = { kind: row.pump, n, sizes: row.sizes.slice() };
    }
    if (!base) return null;
    const shift = sizeShift(text3), size = Math.max(1, Math.min(20, base + shift));
    const by = Number(item.Craft && item.Craft.MemberNumber) || 0;
    const cruel = CRUEL.test(text3), goal = goalIn(text3, hole2);
    return {
      hole: hole2,
      size,
      base,
      shift,
      name: item.Craft && item.Craft.Name || item.Asset.Description || item.Asset.Name,
      pump,
      cruel,
      goal,
      by,
      trainer: TRAINER.test(text3) || cruel || !!goal
    };
  }
  var pumpSize = (t, n) => t && t.pump ? Math.max(1, Math.min(20, t.pump.sizes[Math.max(0, Math.min(t.pump.sizes.length - 1, n))] + (t.shift || 0))) : t ? t.size : 0;
  var pumpRecord = (t, n) => t.pump.kind === "f" ? { f: n } : { typed: n };
  function rateOf(d, cruel) {
    if (!(d >= 1)) return 0;
    const r = d >= 3 ? 2 : d === 2 ? 1.5 : 1;
    return cruel ? r * 1.5 : r;
  }
  function hurtOf(d, cruel, painOk) {
    let a = !(d >= 1) ? 0 : d === 1 ? 1 : d === 2 ? 2 : 3;
    if (cruel) a = Math.max(a, d >= 1 ? 3 : 2);
    return painOk === false ? Math.min(a, 2) : a;
  }
  var USE_ACT = {
    MasturbateHand: { kind: "fingers", size: 1, cr: 0.25 },
    MasturbateTongue: { kind: "tongue", size: 1, cr: 0.1 },
    MasturbateFist: { kind: "fist", size: 7, cr: 2.5 },
    PenetrateSlow: { kind: "cock", size: 3, cr: 1 },
    PenetrateFast: { kind: "cock", size: 3, cr: 1.5, rough: true }
  };
  var USE_ASSET = { Penis: 3, SmallDildo: 2, LargeDildo: 4, StraponPanties: 3, StrapOnSmooth: 3, StrapOnStuds: 3, Tentacles: 4, UnicornHorn: 3, DildocornHorn: 4, GrilledSausage: 2, DildoGag: 3 };
  function useOf(act, asset, text3) {
    const U = USE_ACT[String(act || "")];
    if (!U) return null;
    const o = Object.assign({}, U);
    if (/^Penetrate/.test(act)) {
      const a = String(asset || "");
      if (a && a !== "Penis") {
        o.kind = "toy";
        o.size = USE_ASSET[a] || 3;
        o.toy = a;
      }
      o.size = Math.max(1, Math.min(20, o.size + sizeShift(text3)));
      o.cock = !a || a === "Penis";
    }
    return o;
  }
  var SAY_TO = { "well used": 6, "wide-open": 8, "learning": 3, "practised": 5, "past gagging": 9, "past gaggin'": 9, "deep throated": 7, "deepthroat": 7 };
  var NUM_WORDS = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, ten: 10, fourteen: 14 };
  var DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  function goalSize(hole2, words) {
    const w = String(words || "").toLowerCase().trim(), S3 = HOLE_SIZES[hole2];
    if (!S3) return 0;
    const m = /\b(?:size|level)\s*(\d{1,2})\b/.exec(w);
    if (m) return Math.max(S3.start, Math.min(S3.natural, Number(m[1])));
    const names = S3.names.slice(0, S3.natural).map((n, i) => [n, i + 1]).concat(Object.entries(SAY_TO)).sort((a, b) => b[0].length - a[0].length);
    for (const [n, lvl] of names) {
      if (new RegExp("(^|[^a-z])" + phrase(n) + "(?![a-z])").test(w)) return Math.max(S3.start, Math.min(S3.natural, lvl));
    }
    return 0;
  }
  function goalDue(text3, now) {
    const t = String(text3 || "").toLowerCase();
    now = now || Date.now();
    let m = /\bin\s+(\d{1,3}|an?|one|two|three|four|five|six|seven|ten|fourteen)\s*(hours?|hrs?|h|days?|d|weeks?|wks?)\b/.exec(t);
    if (m) {
      const n = /^\d/.test(m[1]) ? Number(m[1]) : NUM_WORDS[m[1]] || 1, u = /^h/.test(m[2]) ? 36e5 : /^w/.test(m[2]) ? 7 * 864e5 : 864e5;
      return Math.max(36e5, Math.min(30 * 864e5, n * u));
    }
    m = /\bby\s+(tomorrow|tonight|sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/.exec(t);
    if (m) {
      const d = new Date(now);
      d.setHours(23, 59, 0, 0);
      if (m[1] === "tomorrow") d.setDate(d.getDate() + 1);
      else if (m[1] !== "tonight") {
        const want = DAYS.indexOf(m[1]);
        let add2 = (want - d.getDay() + 7) % 7;
        if (!add2) add2 = 7;
        d.setDate(d.getDate() + add2);
      }
      return Math.max(36e5, Math.min(30 * 864e5, d.getTime() - now));
    }
    return 0;
  }
  function goalIn(text3, hole2) {
    const t = String(text3 || "").toLowerCase();
    const m = /\b(?:goal|target|train(?:s|ed|ing|er)?(?:\s+(?:her|him|them|you|me|it|this\s+\w+))?\s+(?:to|till|until|up\s+to)|until|till|stretch(?:es|ed|ing)?(?:\s+(?:her|him|them|you|me|it))?\s+(?:to|till|until))\s*[:=-]?\s*(?:be\s+|is\s+|she'?s\s+|he'?s\s+|they'?re\s+|you'?re\s+)?([^.|;!,]{2,32})/.exec(t);
    if (!m) return null;
    const to = goalSize(hole2, m[1]);
    return to ? { to, inMs: goalDue(t) } : null;
  }

  // dispensary/src/lines-holes.js
  LINES.holes = {
    // ── a toy goes in (the room sees it) ──
    in_0: [
      "The %g slides into %t's %h without a fuss. They're well past needin' to be stretched for that one.",
      "%t takes the %g easy, and their %h settles round it like it was made to fit.",
      "In goes the %g, smooth as anythin'. %t's %h hardly notices it.",
      "%t's %h swallows the %g up and closes snug behind it."
    ],
    in_1: [
      "The %g presses into %t's %h, and there's that good, full stretch as it opens them up and settles.",
      "%t's breath hitches as the %g works in. It's a stretch, a nice one, and their %h gives way round it.",
      "%t feels every inch as the %g pushes home, opening their %h just that little bit wider than it's used to.",
      "The %g takes a moment, a slow push, and then %t's %h opens round it with a soft, full ache."
    ],
    in_2: [
      "The %g's too big for %t, and it goes in anyway, inch by achin' inch, until their %h is stretched tight round it.",
      "%t whimpers as the %g forces their %h open wider than it's ready for. It aches, and it's stayin'.",
      "It takes work to get the %g into %t. Their %h fights it, then gives, stretched achin' and full.",
      "%t clenches, and it doesn't help: the %g spreads their %h open round it, deep and achin'."
    ],
    in_3: [
      "The %g is far too big for %t, and it goes in all the same. Their %h burns as it's forced open, and %t cries out.",
      "%t's whole body goes tight as the %g splits their %h open. It hurts, and it's not comin' out.",
      "It's cruel how big the %g is next to %t's %h. It's pushed in anyway, slow, and %t sobs as they're stretched round it.",
      "%t gasps and shakes as the %g wrenches their %h open. They weren't ready, and it doesn't care."
    ],
    in_cruel: [
      "The %g goes into %t's %h slow, and it seems to enjoy every flinch. It's cruel, and it wants them to know it.",
      "Somethin' about the %g is mean. It forces %t's %h open a little too far, holds it there, and only then settles in.",
      "%t yelps as the %g pushes in. It twists as it goes, opens them wider than it needs to, and stays that way, achin'.",
      "The %g takes its time with %t's %h, stretchin' and stoppin' and stretchin' again, like it's savourin' the noises."
    ],
    in_0_t: [
      "The %g slides down %t's throat without a single gag. They take it like it's nothin'.",
      "%t's throat opens for the %g and takes it easy, all the way down.",
      "Down goes the %g, smooth, and %t doesn't even blink."
    ],
    in_1_t: [
      "The %g pushes into %t's throat. They gag once, swallow round it, and it settles deep.",
      "%t's eyes water as the %g works its way down. It's a stretch, but their throat takes it.",
      "The %g fills %t's mouth and nudges into their throat, and they have to breathe slow round it."
    ],
    in_2_t: [
      "The %g's too much for %t's throat, and it goes down anyway. They gag and drool round it, eyes streamin'.",
      "%t chokes as the %g pushes past where they're used to. Their throat aches round it.",
      "It takes a few tries to get the %g down %t's throat, and every one of them makes %t gag and splutter."
    ],
    in_3_t: [
      "The %g is far too big for %t's throat. It's forced down regardless, and %t heaves and chokes and can't get away from it.",
      "%t's throat seizes round the %g as it's pushed deeper than they can take. Tears and drool run down their chin.",
      "It hurts goin' down. %t gags so hard they shake, and the %g just keeps goin'."
    ],
    in_cruel_t: [
      "The %g fills %t's throat and then, cruelly, a little more. It holds right where they gag hardest.",
      "%t chokes as the %g pushes in. It seems to wait for them to settle before it nudges deeper, just to hear it.",
      "The %g goes down %t's throat mean and slow, and pauses every time they start to cope."
    ],
    // ── while it's in (only they see these) ──
    mine_1: [
      "Your %h is stretched round the %g, full and warm. It's a nice ache, the kind you get used to.",
      "Every time you shift, you feel the %g. Your %h is learnin' to hold it.",
      "The %g sits snug and deep. Your %h is a little more used to it every minute.",
      "That full, stretched feelin' never quite goes away with the %g in you. You don't mind it.",
      "You clench round the %g without meanin' to, and it reminds you just how full you are."
    ],
    mine_2: [
      "Your %h aches round the %g. It's too big, and it's stayin', and slowly, it's teachin' you.",
      "The %g keeps your %h stretched sore and open. Sittin' still doesn't help.",
      "A dull, deep ache from the %g. Your %h is workin' so hard to take it.",
      "You squirm, and the %g doesn't budge. Your %h throbs round it.",
      "It's too much, the %g, and you're takin' it anyway. Your %h aches with it."
    ],
    mine_3: [
      "It hurts. The %g's stretchin' your %h far past what it's ready for, and it doesn't let up.",
      "A hot, sharp ache from the %g every time you breathe. Your %h is bein' forced to learn.",
      "You can't get comfortable. The %g's too big, and your %h burns round it.",
      "Every little movement makes the %g hurt. You're stretched raw round it.",
      "Your %h is on fire round the %g, and the only way out is to train till it fits."
    ],
    mine_cruel: [
      "The %g swells a little, just to hear you whimper, and then eases off. It'll do it again.",
      "It shifts inside you, the cruel thing, right when you'd started to cope. Your %h clenches round it, achin'.",
      "The %g gives a slow twist, and your %h burns. You'd swear it's laughin' at you.",
      "Just when the ache settles, the %g pushes a little deeper. It doesn't want you comfortable.",
      "The %g throbs, wider for a moment, then narrower, then wider again. It's playin' with you."
    ],
    mine_1_t: [
      "The %g fills your throat. You're breathin' slow round it, and it's gettin' easier.",
      "You swallow round the %g, again and again, and your throat learns its shape.",
      "Drool runs down your chin. Your throat's gettin' used to the %g."
    ],
    mine_2_t: [
      "Your throat aches round the %g. Every swallow's work.",
      "The %g's too deep, and you gag on it every few breaths. Your throat's learnin' the hard way.",
      "Your jaw aches, your throat aches, and the %g stays right where it is."
    ],
    mine_3_t: [
      "You gag and gag on the %g, and it hurts. It's far too big for your throat.",
      "Tears run down your face. The %g's forcin' your throat open, and it doesn't stop.",
      "Every breath round the %g burns. Your throat's raw."
    ],
    mine_cruel_t: [
      "The %g nudges deeper, right when you'd stopped gaggin'. It wants you to keep gaggin'.",
      "It swells in your throat, just a little, just long enough to make you panic, then eases off.",
      "The %g holds right where you gag hardest, patient and cruel."
    ],
    // ── while it's in (the room sees it) ──
    room_2: [
      "%t shifts and winces. Whatever's in their %h is too big, and they're still takin' it.",
      "%t squirms in place, clenchin', achin' round the %g.",
      "There's a sore little whimper from %t every time they move. The %g's still stretchin' them."
    ],
    room_3: [
      "%t whimpers, and it isn't a happy noise. The %g's hurtin' their %h, and it isn't comin' out.",
      "%t trembles and grits their teeth. They're stretched far too wide round that %g.",
      "%t can't hold still for the ache. That %g's too big for their %h, and everybody can see it."
    ],
    room_cruel: [
      "%t yelps out of nowhere. Somethin' in their %h just did somethin' cruel.",
      "%t jolts and whimpers. Whatever that %g is doin' to them, it's enjoyin' it more than they are.",
      "%t squeals and clenches, eyes wide. The %g in their %h must have twisted again."
    ],
    room_2_t: [
      "%t gags quietly round the %g, eyes wet.",
      "%t drools round the %g. It's deep, and it aches.",
      "%t's throat works hard round the %g. Every swallow's a struggle."
    ],
    room_3_t: [
      "%t chokes on the %g, and tears run down their cheeks.",
      "%t heaves round the %g, far too deep for them.",
      "%t gags and gags. The %g's too big for that throat, and it's stayin'."
    ],
    room_cruel_t: [
      "%t chokes suddenly. The %g just pushed deeper, all by itself.",
      "%t gags hard, out of nowhere. That %g's bein' cruel to their throat again.",
      "%t splutters and drools. The %g's toyin' with them."
    ],
    // ── it trains them (the room sees it) ──
    trained: [
      "The %g's done its work: %t's %h stays %s now, even when it's empty.",
      "%t's %h has given in to the %g. It's %s for good now.",
      "Hours round the %g have taught %t's %h a new shape. It's %s now, and it'll stay that way.",
      "%t's %h doesn't close up as far as it used to. That %g's trained it %s."
    ],
    trained_t: [
      "%t's throat has learned the %g. It's %s now.",
      "All that time round the %g has paid off: %t's throat is %s now.",
      "%t swallows round the %g, and doesn't gag. Their throat's %s now."
    ],
    // ── a trainer that grows with them ──
    pump: [
      "There's a soft hiss, and the %g swells bigger inside %t. Their %h has caught up with it, so it's not done yet.",
      "The %g pumps itself up a size inside %t, and their %h is stretched fresh and achin' all over again.",
      "%t's %h finally got used to the %g, so it grows: a hiss, a swell, and they're full and achin' again.",
      "A slow pump, then another. The %g fills %t's %h a size bigger, ready to train them further."
    ],
    pump_beads: [
      "Another bead slides into %t's %h. They'd got used to the last ones, so the %g gives them one more.",
      "The %g pushes one more bead into %t, and their %h stretches round it.",
      "%t gasps as the next bead pops in. The %g's trainin' them a bead at a time."
    ],
    pump_cruel: [
      "The %g swells inside %t without waitin' for them to be ready. Their %h burns round it, and it sounds pleased about it.",
      "%t had only just started copin'. The %g pumps up anyway, a size too big, and leaves them achin' raw.",
      "A hiss, a swell, a whimper. The cruel %g doesn't wait for %t's %h to catch up. It never does."
    ],
    pump_t: [
      "The %g swells in %t's mouth, pushin' deeper, fillin' them up a little more.",
      "There's a hiss, and the %g grows. %t's throat works to take it.",
      "%t's throat had got used to it, so the %g pumps up again."
    ],
    // ── goals ──
    goal_done: [
      "%t's %h is %s at last, and the %g eases, done with them. It got what it wanted.",
      "The %g goes still. %t's %h is %s now, just like it was meant to be.",
      "It's done: %t's %h has been trained %s, and the %g finally lets them rest."
    ],
    goal_done_t: [
      "%t's throat is %s at last, and the %g eases off. Its trainin's done.",
      "The %g goes quiet in %t's mouth. Their throat's %s now, just like it was meant to be.",
      "%t's throat has been trained %s, and the %g finally lets them breathe easy."
    ],
    // ── used (only they see these) ──
    use_1: [
      "Your %h stretches round %u, just a little wider than you're used to. It feels good.",
      "That's a nice stretch. Your %h opens round %u, and it's learnin'.",
      "Your %h gives round %u, a little wider than it's used to."
    ],
    use_2: [
      "You're too tight for %u, and you take it anyway. Your %h aches.",
      "Your %h aches, stretched round %u. Every bit of it's teachin' you.",
      "Your %h is openin' up round %u whether it's ready or not. It aches."
    ],
    use_3: [
      "It hurts. Your %h is forced open round %u, far wider than it's ready for.",
      "Your %h burns, stretched round %u. It's too much, much too much.",
      "You cry out as your %h is split wide round %u. You're nowhere near trained for that."
    ],
    use_1_t: [
      "Your throat opens round %u, a little deeper than you're used to. You swallow round it.",
      "Your throat stretches round %u. It's a good stretch.",
      "You gag a little round %u, then settle. Your throat's learnin'."
    ],
    use_2_t: [
      "You gag round %u, eyes waterin'. It's too much for your throat.",
      "Your throat aches round %u. You're not trained for that yet.",
      "You splutter and drool round %u, and take it anyway."
    ],
    use_3_t: [
      "You choke on %u. Your throat isn't ready for that, and it hurts.",
      "Tears stream down your face as your throat's forced open round %u.",
      "Your throat burns round %u. It's far too much."
    ],
    // ── a load left in them ──
    drip: [
      "%t's %h is too loose to hold it: %b's load runs back out of them and down their thighs.",
      "%b's cum doesn't stay in %t long. Their %h is too well used, and it dribbles out, warm and slow.",
      "A wet trickle runs from %t's %h. They're too open to keep %b's load in.",
      "%t can't clench tight enough any more. %b's cum leaks out of their %h and down their legs."
    ],
    kept: [
      "Your %h is still tight enough to hold every drop of %b's load. It's warm in there.",
      "You clench, and keep it: %b's cum stays right where they left it.",
      "Not a drop of %b's load escapes your %h. You're still that tight."
    ],
    swallow: [
      "%b's load goes straight down your throat. You hardly had to swallow.",
      "Your throat takes every drop of %b's cum.",
      "You swallow %b's load down without a thought."
    ],
    // ── noticed ──
    notice_5: [
      "%t's %h is loose and soft. It doesn't quite close all the way any more.",
      "Anybody lookin' can see %t's %h: well used, and a little open.",
      "%t's %h sits a little open, soft and used."
    ],
    notice_7: [
      "%t's %h gapes, open and empty. You could see right into them.",
      "%t's %h doesn't close at all any more. It just sits there, open, waitin' to be filled.",
      "There's no hidin' it: %t's %h gapes wide, wet and empty."
    ],
    notice_10: [
      "%t's %h is ruined, wide open and slack. It couldn't close if it tried.",
      "You could fit a fist in %t's %h without touchin' the sides. It just gapes.",
      "%t's %h is a wide, empty hollow now, open for anythin' at all."
    ],
    notice_plug: [
      "Your %h is so loose you can feel it hangin' on round the plug, clenchin' to keep it in.",
      "Without the plug in, your %h would just gape. You can feel it.",
      "Your %h clings to the plug. It's the only thing keepin' you from gapin'."
    ],
    notice_cover: [
      "Your %h is loose under your clothes. Every step reminds you.",
      "You can feel your %h sittin' open under there. Nobody can see it. You know.",
      "Your clothes rub against your %h, soft and open, every time you move."
    ],
    notice_t: [
      "Your throat feels open, ready. You haven't gagged on anythin' in a while.",
      "You swallow, and it's easy. Your throat's well trained now.",
      "Your throat aches a little, the good kind. It's ready for the next one."
    ],
    // ── healin' (their switch) ──
    heal: [
      "Your %h has tightened up a little since it was last trained. It's %s now.",
      "Left alone a while, your %h has closed up some. It's %s now.",
      "Your %h is a little tighter than it was. It's %s now."
    ],
    heal_t: [
      "Your throat's tightened up a little without trainin'. It's %s now.",
      "Left be a while, your throat's lost some of its trainin'. It's %s now.",
      "You'd gag a little easier now. Your throat's %s."
    ],
    // ── the Tightening Balm on a hole ──
    balm: [
      "The tightenin' balm goes on cool, and %t's %h draws closed, snug and tight again, %s.",
      "%t squirms as the balm tingles in. Their %h tightens up, slow and sure, till it's %s.",
      "A dab of tightenin' balm, a cool tingle, and %t's %h closes up %s again."
    ],
    balm_t: [
      "%t swallows the tightenin' balm, and their throat closes up %s again.",
      "The balm tingles all the way down. %t's throat tightens up %s.",
      "%t gulps the tightenin' balm, and their throat's %s again."
    ],
    balm_plug: [
      "The tightenin' balm goes on cool, and %t's %h clenches down hard round the %g in it. It'll be tight once that's out.",
      "%t's %h tightens round the %g in it. The balm's done its work, but the %g's holdin' it open for now.",
      "The balm tingles, and %t's %h squeezes the %g in it. Once it's out, they'll be %s."
    ],
    // (Nov 19) Ass Growth, Anal Gape, Pussy Gape, off the farm
    gape: [
      "The shot burns warm and low, and %t's %h loosens and opens, achin' to be filled: %s now, and it stays.",
      "%t gasps as it takes. Their %h eases open, wider than it was, and it isn't goin' back: %s.",
      "Somethin' warm spreads deep, and %t's %h relaxes open round nothin' at all. %s now, for good.",
      "%t clenches, and finds there's more room than there was. Their %h is %s now, and trained to stay that way."
    ],
    gape_max: [
      "The shot burns warm, but %t's %h is as open as a shot off the farm can make it. Only the farm girl's own needles go further.",
      "%t's %h aches for more, but this one won't open it any wider. Past here, it's the farm's shots or nothin'."
    ],
    balm_none: [
      "%t gets a dab of tightenin' balm. They're as tight as they come already, but it tingles nicely.",
      "The tightenin' balm goes on, and finds nothin' to tighten. %t just squirms at the tingle.",
      "%t's already snug, so the balm only tingles."
    ]
  };

  // dispensary/src/holes.js
  var W7 = window;
  var MIN3 = 6e4;
  var HOUR = 36e5;
  var DAY3 = 864e5;
  var me2 = () => W7.Player && W7.Player.MemberNumber || 0;
  var botIn = () => (W7.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === BOT);
  var charOf = (mn) => (mn === me2() ? W7.Player : (W7.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn)) || null;
  var okBy = (by) => !by || by === me2() || allowed(by);
  var paused2 = (now) => (st().wornPause || 0) > (now || Date.now());
  var painOn = () => st().holesPain !== false;
  var healOn = () => st().holesHeal === true;
  function H() {
    const S3 = st();
    if (!S3.holes || typeof S3.holes !== "object") S3.holes = {};
    const o = S3.holes;
    if (!o.m || typeof o.m !== "object") o.m = {};
    if (!Array.isArray(o.pend)) o.pend = [];
    if (!o.goals || typeof o.goals !== "object") o.goals = {};
    if (typeof o.id !== "number") o.id = 0;
    if (typeof o.ep !== "string" || !o.ep) o.ep = Math.random().toString(36).slice(2, 10);
    return o;
  }
  function hole(h2) {
    const o = H(), S3 = HOLE_SIZES[h2];
    let x = o.m[h2];
    if (!x || typeof x !== "object") x = o.m[h2] = { n: S3.start, u: S3.start, cr: 0, t: 0, g: 0, hl: 0 };
    return x;
  }
  function holesHave() {
    const o = H();
    if (Array.isArray(o.has) && o.has.length) return HOLES.filter((h2) => o.has.includes(h2));
    const P = W7.Player;
    let v = true;
    try {
      if (P && typeof P.HasVagina === "function") v = !!P.HasVagina();
      else if (P && typeof P.HasPenis === "function") v = !P.HasPenis();
    } catch (e) {
    }
    return (v ? ["vulva"] : []).concat(["butt", "throat"]);
  }
  function change(h2, op) {
    const o = H(), last = o.pend[o.pend.length - 1];
    const kinds = Object.keys(op);
    if (last && last.h === h2 && kinds.length === 1 && Object.keys(last).filter((k) => k !== "h").join() === kinds[0]) {
      const k = kinds[0];
      if (k === "st") last.st = Math.max(last.st, op.st);
      else if (k === "set") last.set = op.set;
      else last[k] += op[k];
    } else o.pend.push(Object.assign({ h: h2 }, op));
    if (o.pend.length > 80) o.pend = o.pend.slice(-80);
    save();
    sendSoon();
  }
  var sendT = null;
  var askedAt = 0;
  function sendSoon() {
    clearTimeout(sendT);
    sendT = setTimeout(() => {
      try {
        sendNow(false);
      } catch (e) {
      }
    }, 1500);
  }
  function sendNow(ask) {
    const o = H();
    if (!botIn() || typeof W7.ServerSend !== "function") return false;
    if (o.fly && Date.now() - (o.fly.at || 0) < 6e4) return false;
    if (!o.fly && o.pend.length) {
      o.id += 1;
      o.fly = { id: o.id, ops: o.pend.slice(0, 60), at: 0 };
      o.pend = o.pend.slice(60);
    }
    const f = o.fly;
    if (!f && !ask) return false;
    try {
      W7.ServerSend("ChatRoomChat", makeMsg("dispHoles", f ? { ep: o.ep, id: f.id, ops: f.ops } : { ep: o.ep, id: 0, ops: [] }, BOT));
    } catch (e) {
      return false;
    }
    if (f) f.at = Date.now();
    askedAt = Date.now();
    save();
    return true;
  }
  function fromFarm(sizes, has2) {
    const o = H();
    if (Array.isArray(has2)) o.has = has2.filter((h2) => HOLES.includes(h2));
    if (o.fly || o.pend.length || !sizes || typeof sizes !== "object") return;
    for (const h2 of HOLES) {
      const v = sizes[h2];
      if (!Array.isArray(v)) continue;
      const x = hole(h2);
      x.n = clampSize(h2, v[0]);
      x.u = clampSize(h2, v[1]);
      if (x.n < x.u) x.n = x.u;
    }
    o.sync = Date.now();
    save();
  }
  function holesWelcome(m) {
    if (m && m.holes) fromFarm(m.holes.sizes, m.holes.has);
  }
  function onOk(m) {
    const o = H(), id = Number(m.id) || 0;
    if (o.fly && id >= o.fly.id) o.fly = null;
    if (m.none) {
      o.sync = 0;
      save();
      return;
    }
    fromFarm(m.sizes, m.has);
  }
  var keyOf2 = (it) => it.Asset.Group.Name + ":" + it.Asset.Name + ":" + (it.Craft && it.Craft.Name || "");
  function toysNow() {
    const P = W7.Player, out = {};
    if (!P || !Array.isArray(P.Appearance)) return out;
    for (const item of P.Appearance) {
      if (!item || !item.Asset || !item.Asset.Group || !holeOfGroup(item.Asset.Group.Name)) continue;
      const text3 = craftText(item), T = toyIn2(item, text3);
      if (!T || out[T.hole] && out[T.hole].size >= T.size) continue;
      T.item = item;
      T.key = keyOf2(item);
      T.text = text3;
      T.horny = !!hornyOf(text3);
      out[T.hole] = T;
    }
    return out;
  }
  function goalFor(h2, T, x) {
    const g = H().goals[h2];
    if (g && g.to > 0 && okBy(g.by)) return { to: g.to, due: g.due || 0, by: g.by, sent: true };
    if (T && T.goal && T.trainer && okBy(T.by) && x.gd !== T.key) return { to: T.goal.to, due: T.goal.inMs ? (x.ta || Date.now()) + T.goal.inMs : 0, by: T.by, sent: false };
    return null;
  }
  function setGoal(h2, to, by, inMs) {
    if (!HOLES.includes(h2) || !holesHave().includes(h2)) return { ok: false, why: "hole" };
    const S3 = HOLE_SIZES[h2];
    to = Math.max(S3.start, Math.min(S3.natural, Math.round(Number(to) || 0)));
    if (!to) return { ok: false, why: "size" };
    if (to <= hole(h2).u) return { ok: false, why: "already", to };
    H().goals[h2] = { to, by: Number(by) || me2(), due: inMs > 0 ? Date.now() + Math.min(30 * DAY3, inMs) : 0, at: Date.now() };
    save();
    return { ok: true, to };
  }
  function clearGoal(h2) {
    const o = H();
    if (h2) {
      if (!o.goals[h2]) return false;
      delete o.goals[h2];
    } else {
      if (!Object.keys(o.goals).length) return false;
      o.goals = {};
    }
    save();
    return true;
  }
  var lines = (key2) => LINES.holes && LINES.holes[key2] || [];
  function line(key2, h2, v) {
    const L = lines(key2);
    if (!L.length) return "";
    const x = hole(h2);
    return fill(pick(L), { by: v && v.by }).replace(/%g/g, v && v.g || "toy").replace(/%h/g, HOLE_WORD[h2]).replace(/%u/g, v && v.u || "it").replace(/%s/g, sizeSay(h2, v && v.s != null ? v.s : x.u));
  }
  var tk = (h2, key2) => h2 === "throat" ? key2 + "_t" : key2;
  var said = {};
  function say2(key2, h2, v, room) {
    const t = line(tk(h2, key2), h2, v) || line(key2, h2, v);
    if (!t) return "";
    said[h2] = Date.now();
    if (room) action(t);
    else local(t);
    return t;
  }
  var lastTick = 0;
  var nextBeat = {};
  var nextPump = {};
  function holesTick(now) {
    now = now || Date.now();
    const dt = lastTick ? Math.max(0, Math.min(now - lastTick, 15 * MIN3)) : 0;
    lastTick = now;
    const have = holesHave(), toys = toysNow(), rest = paused2(now);
    let dirty = false;
    for (const h2 of have) {
      const x = hole(h2), T = toys[h2], S3 = HOLE_SIZES[h2];
      if (!T && x.n > x.u && now - (x.g || 0) > TIGHTEN_H * HOUR) {
        x.n -= 1;
        x.g = now;
        dirty = true;
      }
      if (x.n < x.u) x.n = x.u;
      if (T) {
        if (x.tk !== T.key) {
          const was = Math.max(x.n, x.u);
          x.tk = T.key;
          x.ta = now;
          x.gd = T.goal && T.goal.to <= x.u ? T.key : "";
          if (inRoom() && !rest) say2("in_" + feel(T, was), h2, { g: T.name }, true);
          nextBeat[h2] = now + (4 + Math.random() * 4) * MIN3;
          dirty = true;
        }
        if (!nextBeat[h2]) nextBeat[h2] = now + (3 + Math.random() * 4) * MIN3;
        if (T.size > x.n) {
          x.n = T.size;
          change(h2, { st: x.n });
        }
        x.g = now;
        if (!rest && train(h2, x, T, dt, now)) dirty = true;
        if (!rest && T.pump && inRoom()) pumpTick(h2, x, T, now);
        if (!rest && inRoom() && now >= (nextBeat[h2] || 0)) {
          nextBeat[h2] = now + (6 + Math.random() * 4) * MIN3;
          beat(h2, x, T);
        }
      } else if (x.tk) {
        x.tk = "";
        x.ta = 0;
        delete nextBeat[h2];
        dirty = true;
      }
      if (healOn() && !T && x.u > S3.start && now - Math.max(x.t || 0, x.g || 0) > HEAL_GRACE_H * HOUR && dt > 0) {
        x.hl = (x.hl || 0) + HEAL_PER_DAY * dt / DAY3;
        if (x.hl >= 1) {
          x.hl = 0;
          x.u -= 1;
          if (x.n > x.u && now - (x.g || 0) > TIGHTEN_H * HOUR) x.n = x.u;
          change(h2, { down: 1 });
          say2("heal", h2, {}, false);
        }
        dirty = true;
      }
    }
    if (!rest) notice(now, toys);
    dripTick(now);
    const o = H();
    if (botIn() && (o.pend.length || o.fly && now - (o.fly.at || 0) > 6e4 || now - askedAt > 10 * MIN3)) sendNow(true);
    if (dirty && Math.random() < 0.1) save();
    return toys;
  }
  var feel = (T, u) => {
    const a = hurtOf(T.size - u, T.cruel, painOn());
    return T.cruel && a >= 2 ? "cruel" : String(a);
  };
  function train(h2, x, T, dt, now) {
    if (!T.trainer || !okBy(T.by) || !(dt > 0) || x.gd === T.key) return false;
    const S3 = HOLE_SIZES[h2], G = goalFor(h2, T, x), cap = Math.min(S3.natural, T.size, G ? G.to : 99);
    if (x.u >= cap) {
      if (G && x.u >= G.to) goalMet(h2, x, T, G);
      return false;
    }
    let r = rateOf(T.size - x.u, T.cruel);
    if (G && G.due) {
      const need = (G.to - x.u) * TRAIN_H * HOUR / Math.max(HOUR, G.due - now);
      r = Math.max(r, Math.min(4, need));
    }
    x.cr = (x.cr || 0) + r * dt / HOUR;
    x.t = now;
    let up = 0;
    while (x.cr >= TRAIN_H && x.u < cap) {
      x.cr -= TRAIN_H;
      x.u += 1;
      up++;
      if (x.n < x.u) x.n = x.u;
    }
    if (x.u >= cap) x.cr = Math.min(x.cr, TRAIN_H * 0.99);
    if (up) {
      change(h2, { up });
      if (inRoom()) say2("trained", h2, { g: T.name, s: x.u }, true);
    }
    if (G && x.u >= G.to) goalMet(h2, x, T, G);
    return true;
  }
  function goalMet(h2, x, T, G) {
    if (G.sent) clearGoal(h2);
    else x.gd = T ? T.key : "";
    if (inRoom()) say2("goal_done", h2, { g: T ? T.name : "trainin'", s: x.u }, true);
    save();
  }
  function pumpTick(h2, x, T, now) {
    if (!T.trainer || !okBy(T.by) || !T.pump || x.gd === T.key) return false;
    const n = T.pump.n, last = T.pump.sizes.length - 1;
    if (n >= last || now < (nextPump[h2] || 0)) return false;
    const G = goalFor(h2, T, x), aim = Math.min(HOLE_SIZES[h2].natural, G ? G.to : HOLE_SIZES[h2].natural);
    if (T.size >= aim && x.u >= aim) return false;
    let want = x.u >= T.size || T.cruel && x.u >= T.size - 1;
    if (!want && G && G.due) {
      const need = (G.to - x.u) * TRAIN_H * HOUR / Math.max(HOUR, G.due - now);
      want = need > rateOf(T.size - x.u, T.cruel) && T.size - x.u < 3;
    }
    if (!want || T.size >= aim + (T.cruel ? 1 : 0)) return false;
    nextPump[h2] = now + 20 * MIN3;
    try {
      if (typeof W7.ExtendedItemSetOptionByRecord !== "function") return false;
      W7.ExtendedItemSetOptionByRecord(W7.Player, T.item, pumpRecord(T, n + 1), { push: true, C_Source: W7.Player, refresh: true });
    } catch (e) {
      console.warn("[Dispensary] the trainer couldn't pump:", e);
      return false;
    }
    const bigger = pumpSize(T, n + 1);
    if (bigger > x.n) {
      x.n = bigger;
      change(h2, { st: x.n });
    }
    if (inRoom()) say2(h2 === "throat" ? "pump" : T.pump.kind === "beads" ? "pump_beads" : T.cruel ? "pump_cruel" : "pump", h2, { g: T.name }, true);
    return true;
  }
  function beat(h2, x, T) {
    const f = feel(T, x.u);
    if (f === "0") return "";
    if (T.horny && Math.random() < 0.5) return "";
    const A = W7.Player && W7.Player.ArousalSettings, p = A && Number(A.Progress) || 0;
    if (A) setArousal(f === "1" ? p + 4 : f === "2" ? p + 2 : f === "3" ? p - 10 : p - 6);
    const room = f !== "1" && Math.random() < 0.3;
    return say2((room ? "room_" : "mine_") + f, h2, { g: T.name }, room) || say2("mine_" + f, h2, { g: T.name }, false);
  }
  var nextNotice = 0;
  function bare(h2) {
    try {
      const P = W7.Player, I = W7.InventoryPrerequisiteMessage;
      if (typeof I !== "function") return false;
      if (h2 === "butt") return I(P, "AccessButt") === "" && !(P.IsButtChaste && P.IsButtChaste());
      return I(P, "AccessCrotch") === "" && I(P, "AccessVulva") === "" && !(P.IsVulvaChaste && P.IsVulvaChaste());
    } catch (e) {
      return false;
    }
  }
  function notice(now, toys) {
    if (!inRoom()) {
      nextNotice = 0;
      return;
    }
    if (!nextNotice) {
      nextNotice = now + (10 + Math.random() * 15) * MIN3;
      return;
    }
    if (now < nextNotice) return;
    nextNotice = now + (25 + Math.random() * 20) * MIN3;
    const have = holesHave().filter((h2) => now - (said[h2] || 0) > 10 * MIN3);
    const loose = have.filter((h2) => h2 !== "throat" && hole(h2).n >= 5);
    if (loose.length) {
      const h2 = loose[Math.floor(Math.random() * loose.length)], x = hole(h2), T = toys[h2];
      if (T) return say2("notice_plug", h2, { g: T.name }, false);
      if (bare(h2)) return say2(x.n >= 10 ? "notice_10" : x.n >= 7 ? "notice_7" : "notice_5", h2, { s: x.n }, true);
      return Math.random() < 0.5 ? say2("notice_cover", h2, {}, false) : "";
    }
    if (have.includes("throat") && hole("throat").u >= 6 && Math.random() < 0.4) return say2("notice", "throat", {}, false);
    return "";
  }
  var usedAt = {};
  var inMe = /* @__PURE__ */ new Map();
  function budgetLeft(x, now) {
    if (!x.ub || now - x.ub.at > HOUR) x.ub = { at: now, n: 0 };
    return Math.max(0, USE_BUDGET_H - x.ub.n);
  }
  function holesUsed(from, act, group, asset, text3, toyName) {
    const h2 = holeOfGroup(group);
    if (!h2 || h2 === "throat" && group !== "ItemMouth") return null;
    if (!holesHave().includes(h2)) return null;
    const U = useOf(act, asset, text3);
    if (!U) return null;
    if (toyName) U.toyName = toyName;
    const now = Date.now(), k = from + ":" + h2;
    if (U.cock && from && from !== me2()) inMe.set(from, { h: h2, at: now });
    if (now - (usedAt[k] || 0) < 45e3) return null;
    usedAt[k] = now;
    const x = hole(h2), was = x.u, S3 = HOLE_SIZES[h2];
    x.t = now;
    if (U.size > x.n) {
      x.n = U.size;
      x.g = now;
      change(h2, { st: x.n });
    }
    const d = U.size - x.u, cap = Math.min(S3.natural, U.size);
    if (d >= 1 && x.u < cap && !paused2(now)) {
      const add2 = Math.min(U.cr * rateOf(d, false) * (from === me2() ? 0.5 : 1), budgetLeft(x, now));
      x.ub.n += add2;
      x.cr = (x.cr || 0) + add2;
      let up = 0;
      while (x.cr >= TRAIN_H && x.u < cap) {
        x.cr -= TRAIN_H;
        x.u += 1;
        up++;
      }
      if (up) {
        change(h2, { up });
        if (inRoom()) say2("trained", h2, { g: U.toy ? "toy" : U.kind, s: x.u }, true);
      }
    }
    save();
    const f = hurtOf(U.size - was, false, painOn());
    if (f && now - (said[h2] || 0) > 3 * MIN3) say2("use_" + f, h2, { u: whatWent(from, U) }, false);
    return { h: h2, size: U.size, felt: f };
  }
  function whatWent(from, U) {
    const who2 = !from || from === me2() ? "your own" : nameOf(from) + "'s";
    if (U.toy) return U.toyName ? "the " + U.toyName : "the " + String(U.toy).replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
    return who2 + " " + { fingers: "fingers", tongue: "tongue", fist: "fist", cock: "cock" }[U.kind];
  }
  var drips2 = [];
  var onLoad = null;
  function holesOnLoad(f) {
    onLoad = f;
  }
  function holesClimaxOf(from) {
    const e = inMe.get(from);
    if (!e) return false;
    inMe.delete(from);
    if (Date.now() - e.at > 9e4) return false;
    const h2 = e.h, x = hole(h2), toys = toysNow();
    let booked = false;
    if (onLoad) {
      try {
        booked = !!onLoad(from, h2);
      } catch (err) {
      }
    }
    if (h2 === "throat") {
      if (!booked) say2("swallow", h2, { by: nameOf(from) }, false);
      return true;
    }
    if (x.n >= 5 && !toys[h2]) drips2.push({ h: h2, by: from, at: Date.now() + (40 + Math.random() * 80) * 1e3 });
    else if (!booked) say2("kept", h2, { by: nameOf(from) }, false);
    return true;
  }
  function dripTick(now) {
    for (let i = drips2.length - 1; i >= 0; i--) {
      const d = drips2[i];
      if (now < d.at) continue;
      drips2.splice(i, 1);
      if (!inRoom()) continue;
      say2("drip", d.h, { by: nameOf(d.by) }, true);
      try {
        W7.dispatchEvent(new W7.CustomEvent("farmhand-dispensary", { detail: { type: "leak", mess: "cum", areas: ["thighs"], amount: 1 } }));
      } catch (e) {
      }
    }
  }
  function holesBalm(which, x, quiet) {
    const list = which === "holes" ? holesHave() : holesHave().filter((h2) => h2 === which);
    const toys = toysNow(), out = [];
    for (const h2 of list) {
      const o = hole(h2), S3 = HOLE_SIZES[h2], k = Math.min(o.u - S3.start, 2 * Math.max(1, Math.min(5, Number(x) || 1)));
      const T = toys[h2];
      if (k <= 0 && o.n <= o.u) {
        if (!quiet) say2("balm_none", h2, {}, true);
        continue;
      }
      o.u -= Math.max(0, k);
      o.cr = 0;
      o.hl = 0;
      if (!T) {
        o.n = o.u;
        o.g = Date.now();
      }
      change(h2, { tight: Math.max(0, k) });
      if (!quiet) say2(T ? "balm_plug" : "balm", h2, { g: T && T.name, s: o.u }, true);
      out.push(h2);
    }
    save();
    return out;
  }
  function holesGape(which, x, quiet) {
    const out = [];
    for (const h2 of holesHave().filter((k) => k === which)) {
      const o = hole(h2), S3 = HOLE_SIZES[h2], k = Math.min(S3.natural - o.u, Math.max(1, Math.min(5, Number(x) || 1)));
      if (k <= 0) {
        if (!quiet) say2("gape_max", h2, {}, true);
        continue;
      }
      o.u += k;
      o.n = Math.max(o.n, o.u);
      o.g = Date.now();
      o.hl = 0;
      change(h2, { up: k });
      if (!quiet) say2("gape", h2, { s: o.u }, true);
      out.push(h2);
    }
    save();
    return out;
  }
  function holesSet(h2, lvl) {
    if (!holesHave().includes(h2)) return false;
    const S3 = HOLE_SIZES[h2], n = Math.max(S3.start, Math.min(S3.natural, Math.round(Number(lvl) || 0)));
    const x = hole(h2);
    x.u = n;
    x.n = Math.max(n, toysNow()[h2] ? x.n : n);
    x.cr = 0;
    x.hl = 0;
    change(h2, { set: n });
    return true;
  }
  function holesSafe() {
    return clearGoal();
  }
  function holesNow() {
    const out = {}, toys = toysNow(), o = H();
    for (const h2 of holesHave()) {
      const x = hole(h2), T = toys[h2], G = goalFor(h2, T, x);
      out[h2] = {
        label: HOLE_SIZES[h2].label,
        now: x.n,
        trained: x.u,
        nowWord: sizeWord(h2, x.n),
        trainedWord: sizeWord(h2, x.u),
        toward: Math.max(0, Math.min(99, Math.floor(100 * (x.cr || 0) / TRAIN_H))),
        toy: T ? { name: T.name, size: T.size, feel: feel(T, x.u), trainer: T.trainer, cruel: T.cruel, pump: !!T.pump } : null,
        goal: G ? { to: G.to, word: sizeWord(h2, G.to), due: G.due, by: G.by } : null
      };
    }
    return { holes: out, waiting: o.pend.length + (o.fly ? o.fly.ops.length : 0), sync: o.sync || 0, heal: healOn(), pain: painOn() };
  }
  function onActivity2(data) {
    const D = Array.isArray(data.Dictionary) ? data.Dictionary : [], get = (key2) => {
      const e = D.find((x) => x && x[key2] != null);
      return e ? e[key2] : null;
    };
    const name = String(get("ActivityName") || ""), src = Number(get("SourceCharacter")) || Number(data.Sender) || 0, tgt = Number(get("TargetCharacter")) || 0;
    if (tgt !== me2()) return;
    const grp = String(get("FocusGroupName") || ""), A = D.find((x) => x && x.Tag === "ActivityAsset");
    let text3 = "";
    if (A) {
      const C2 = charOf(src), it = C2 && Array.isArray(C2.Appearance) ? C2.Appearance.find((i) => i && i.Asset && i.Asset.Name === A.AssetName && i.Asset.Group && i.Asset.Group.Name === A.GroupName) : null;
      text3 = craftText(it) || String(A.CraftName || "").toLowerCase();
    }
    holesUsed(src, name, grp, A ? A.AssetName : "", text3, A && A.CraftName ? String(A.CraftName) : "");
  }
  function initHoles(mod2) {
    try {
      mod2.hookFunction("ChatRoomMessage", 11, (args, next2) => {
        try {
          const data = args[0];
          if (data && data.Type === "Activity") {
            if (/^Orgasm\d$/.test(String(data.Content || "")) && typeof data.Sender === "number" && data.Sender !== me2()) holesClimaxOf(data.Sender);
            else onActivity2(data);
          } else if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me2()) {
            const m = readMsg(data);
            if (m && m.type === "dispHolesOk" && data.Sender === BOT) onOk(m);
            else if (m && m.type === "dispTrain") onTrain(data.Sender, m);
            else if (m && m.type === "dispTrainOk") onTrainOk(data.Sender, m);
          }
        } catch (e) {
          console.warn("[Dispensary] holes:", e);
        }
        return next2(args);
      });
    } catch (e) {
      console.warn("[Dispensary] holes can't hear the room:", e);
    }
    try {
      mod2.hookFunction("ChatRoomSync", 2, (args, next2) => {
        const r = next2(args);
        setTimeout(() => {
          try {
            sendNow(true);
          } catch (e) {
          }
        }, 4e3);
        return r;
      });
    } catch (e) {
    }
  }
  var HOLE_OF_WORD = (w) => {
    w = String(w || "").toLowerCase();
    return /^(ass|butt|bum|asshole|anus|backdoor)$/.test(w) ? "butt" : /^(pussy|cunt|vulva|slit|cooch)$/.test(w) ? "vulva" : /^(throat|mouth|gullet)$/.test(w) ? "throat" : "";
  };
  function sendGoal(to, h2, words) {
    const size = goalSize(h2, words), due = goalDue(words);
    if (!size) return { ok: false, why: "size" };
    if (to === me2()) {
      const r = setGoal(h2, size, me2(), due);
      return r.ok ? { ok: true, self: true, to: size } : r;
    }
    try {
      W7.ServerSend("ChatRoomChat", makeMsg("dispTrain", { h: h2, to: size, due }, to));
      return { ok: true, to: size };
    } catch (e) {
      return { ok: false, why: "send" };
    }
  }
  function sendClear(to, h2) {
    if (to === me2()) return { ok: clearGoal(h2 || ""), self: true };
    try {
      W7.ServerSend("ChatRoomChat", makeMsg("dispTrain", { h: h2 || "", clear: true }, to));
      return { ok: true };
    } catch (e) {
      return { ok: false, why: "send" };
    }
  }
  function onTrain(from, m) {
    const h2 = String(m.h || "");
    const reply = (ok, why) => {
      try {
        W7.ServerSend("ChatRoomChat", makeMsg("dispTrainOk", { h: h2, ok, why: why || "", to: Number(m.to) || 0, clear: !!m.clear }, from));
      } catch (e) {
      }
    };
    if (!allowed(from)) {
      local(nameOf(from) + " tried to set you a trainin' goal, but they aren't on your list.");
      return reply(false, "ladder");
    }
    if (m.clear) {
      const g2 = H().goals;
      if (h2 && g2[h2]) delete g2[h2];
      else if (!h2) H().goals = {};
      save();
      local(nameOf(from) + " lifted your trainin' goal" + (h2 && HOLE_WORD[h2] ? " for your " + HOLE_WORD[h2] : "s") + ".");
      return reply(true);
    }
    if (!HOLES.includes(h2)) return reply(false, "hole");
    const r = setGoal(h2, m.to, from, Number(m.due) || 0);
    if (!r.ok) {
      return reply(false, r.why);
    }
    const g = H().goals[h2];
    local("\u{1F3AF} " + nameOf(from) + " has set you a trainin' goal: your " + HOLE_WORD[h2] + ", " + sizeWord(h2, r.to) + (g.due ? ", " + dueWords(g.due) : "") + ". Your trainers will work you there.");
    reply(true);
  }
  function onTrainOk(from, m) {
    const h2 = HOLE_WORD[m.h] || "holes";
    if (m.clear) {
      local(m.ok ? "Lifted " + nameOf(from) + "'s trainin' goal." : "Couldn't lift " + nameOf(from) + "'s goal: " + (m.why === "ladder" ? "you aren't on their list." : "they've none."));
      return;
    }
    local(m.ok ? "\u{1F3AF} " + nameOf(from) + "'s " + h2 + " has a goal now: " + sizeWord(m.h, m.to) + ". Their trainers will work them there." : "Couldn't set " + nameOf(from) + "'s goal: " + (m.why === "ladder" ? "you aren't on their list of who can dose them." : m.why === "hole" ? "they haven't got that." : m.why === "already" ? "they're already that open." : "that didn't take."));
  }
  function dueWords(t) {
    const ms = t - Date.now();
    if (ms <= 0) return "overdue";
    return ms < 36 * HOUR ? "in " + Math.max(1, Math.round(ms / HOUR)) + " hours" : "in " + Math.round(ms / DAY3) + " days";
  }
  var holesState = () => JSON.parse(JSON.stringify(H()));
  var holesReset = () => {
    st().holes = {};
    lastTick = 0;
    for (const o of [nextBeat, nextPump, said, usedAt]) for (const k of Object.keys(o)) delete o[k];
    inMe.clear();
    drips2.length = 0;
    nextNotice = 0;
  };
  var holesDrips = () => drips2.slice();

  // dispensary/src/nipples.js
  var W8 = window;
  var me3 = () => W8.Player && W8.Player.MemberNumber || 0;
  var charOf2 = (mn) => (mn === me3() ? W8.Player : (W8.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn)) || null;
  var inRoom2 = () => W8.CurrentScreen === "ChatRoom" && typeof W8.ServerSend === "function";
  var others = /* @__PURE__ */ new Map();
  function heldOpen() {
    let n = active("dilator") ? Math.max(1, Math.min(3, xOfDose("dilator"))) : 0;
    const p = mine2().nips;
    if (p) n = Math.max(n, (p.n || 0) >= 3 ? 3 : 2);
    return Math.max(n, toyOpen(W8.Player));
  }
  var MIN4 = 6e4;
  var HOUR2 = 36e5;
  var DAY4 = 864e5;
  var TRAIN = { step: 0.5, every: 30 * MIN4, cock: 0.15, finger: 0.05, grace: 12 * HOUR2, perDay: 0.5 };
  var trainOf = () => st().nipTrain || (st().nipTrain = { lvl: 0, at: Date.now(), open: 0, used: 0 });
  var trainedLevel = () => Math.max(0, Math.min(3, Math.floor(((st().nipTrain || {}).lvl || 0) + 1e-9)));
  function nipsOpen() {
    return Math.max(heldOpen(), trainedLevel());
  }
  var NIP_WORDS = ["closed", "open", "wide open", "gapin'"];
  function nipsInfo() {
    const open2 = nipsOpen(), trained = trainedLevel(), lvl = (st().nipTrain || {}).lvl || 0, held = heldOpen();
    const toy = toyIn(W8.Player), T = toyOf(toy);
    return {
      open: open2,
      trained,
      held,
      word: NIP_WORDS[open2],
      trainedWord: NIP_WORDS[trained],
      toward: held > trained && trained < 3 ? Math.max(0, Math.min(99, Math.floor((lvl - trained) * 100))) : 0,
      loads: nipLoads().n || 0,
      toy: T ? T.label : "",
      locked: !!(toy && toyLocked(toy)),
      heal: st().nipsHeal !== false
    };
  }
  function nipsTrainTick(now) {
    now = now || Date.now();
    const T = trainOf(), held = heldOpen(), dt = Math.max(0, Math.min(now - (T.at || now), 15 * MIN4));
    T.at = now;
    if (held > 0) {
      T.open = now;
      if (T.lvl < held) T.lvl = Math.min(held, T.lvl + TRAIN.step * dt / TRAIN.every);
    } else if (st().nipsHeal !== false && T.lvl > 0 && now - Math.max(T.open || 0, T.used || 0) > TRAIN.grace) T.lvl = Math.max(0, T.lvl - TRAIN.perDay * dt / DAY4);
  }
  var popped = "";
  var lastPopped = () => popped;
  function nipsClose(quiet) {
    const toy = toyIn(W8.Player);
    popped = "";
    if (toy && toyLocked(toy)) return 0;
    const was = nipsOpen();
    if (toy) {
      popped = toyOf(toy).label;
      try {
        W8.InventoryRemove(W8.Player, "ItemNipples", false);
        if (typeof W8.CharacterRefresh === "function") W8.CharacterRefresh(W8.Player);
        if (typeof W8.ChatRoomCharacterItemUpdate === "function") W8.ChatRoomCharacterItemUpdate(W8.Player, "ItemNipples");
      } catch (e) {
      }
    }
    st().nipTrain = { lvl: 0, at: Date.now(), open: 0, used: 0 };
    try {
      if (active("dilator")) end("dilator", "quiet");
    } catch (e) {
    }
    try {
      if (mine2().nips) letGo("nips", "quiet");
    } catch (e) {
    }
    save();
    nipsTell(false);
    if (!quiet && was) local("Your nipples close up again, snug and tender, as if they'd never been stretched.");
    return was;
  }
  var FORCED_WIDE = ["", "open enough to take a finger", "wide open", "gapin' wide"];
  function nipsForce(n, by, quiet) {
    n = Math.max(1, Math.min(3, Math.round(Number(n) || 3)));
    const was = nipsOpen();
    if (trainedLevel() >= n) return { ok: false, why: "already", was, n: trainedLevel() };
    const T = trainOf(), now = Date.now(), other = !!by && by !== me3();
    T.lvl = Math.max(T.lvl, n);
    T.at = now;
    T.open = now;
    T.used = now;
    save();
    nipsTell();
    const L = LINES.nips && LINES.nips[other ? "forced_by" : "forced_self"];
    if (L && L.length && !quiet) action(fill(pick(L), { by: other ? nameOf(by) : "" }).replace(/%w/g, FORCED_WIDE[n]));
    return { ok: true, was, n };
  }
  function nipsForceSend(to, n) {
    if (to === me3()) return nipsForce(n, me3());
    try {
      W8.ServerSend("ChatRoomChat", makeMsg("dispNipsOpen", { n: Math.max(1, Math.min(3, Math.round(Number(n) || 3))) }, to));
      return { ok: true, sent: true };
    } catch (e) {
      return { ok: false, why: "send" };
    }
  }
  function forceOf(from, m) {
    const reply = (ok, why, n) => {
      try {
        W8.ServerSend("ChatRoomChat", makeMsg("dispNipsOpenOk", { ok, why: why || "", n: n || 0 }, from));
      } catch (e) {
      }
    };
    if (!allowed(from)) {
      local(nameOf(from) + " tried to force your nipples open, but they aren't on your list.");
      return reply(false, "ladder");
    }
    if (st().off && st().off.dilator) {
      local(nameOf(from) + " tried to force your nipples open, but you've the Nipple Dilator switched off.");
      return reply(false, "off");
    }
    const quiet = !!m.quiet && from === BOT, r = nipsForce(m.n, from, quiet);
    if (!r.ok) return reply(false, r.why, r.n);
    if (!quiet) local("\u2B55 " + nameOf(from) + " forced your nipples open, " + NIP_WORDS[r.n] + ", and they'll stay that way" + (st().nipsHeal !== false ? " till they close up on their own." : "."));
    reply(true, "", r.n);
  }
  function forceOk(from, m) {
    const n = Math.max(0, Math.min(3, Math.round(Number(m.n) || 0)));
    local(m.ok ? "\u2B55 " + nameOf(from) + "'s nipples are forced open, " + NIP_WORDS[n] + "." : "Couldn't open " + nameOf(from) + "'s nipples: " + (m.why === "ladder" ? "you aren't on their list of who can dose them." : m.why === "off" ? "they've the Nipple Dilator switched off." : m.why === "already" ? "they're already " + NIP_WORDS[n] + "." : "that didn't take."));
  }
  function openOf(mn) {
    mn = Number(mn);
    if (mn === me3()) return nipsOpen();
    const e = others.get(mn);
    return e && Date.now() - e.at < 6 * 36e5 ? e.n : 0;
  }
  var told2 = 0;
  var tellPage = (detail) => {
    try {
      W8.dispatchEvent(new W8.CustomEvent("farmhand-dispensary", { detail }));
    } catch (e) {
    }
  };
  var shown = -1;
  function nipsTell(force) {
    const n = nipsOpen();
    if (n !== shown) {
      shown = n;
      tellPage({ type: "nips", from: me3(), n });
    }
    if (!inRoom2() || !force && n === told2 || force && !n) return false;
    told2 = n;
    try {
      W8.ServerSend("ChatRoomChat", makeMsg("dispNips", { n }));
      return true;
    } catch (e) {
      return false;
    }
  }
  function onNips(from, m) {
    const n = Math.max(0, Math.min(3, Math.round(Number(m.n) || 0))), was = openOf(from);
    if (n) others.set(from, { n, at: Date.now() });
    else others.delete(from);
    if (was !== n) tellPage({ type: "nips", from, n });
  }
  var ACTS = {
    cock: {
      name: "NippleFuck",
      label: "Fuck nipple",
      image: "Icons/Activity/PenetrateSlow.png",
      max: 90,
      action: "SourceCharacter pushes into TargetCharacter's stretched-open nipple, slow and deep, and fucks it."
    },
    finger: {
      name: "NippleFinger",
      label: "Finger nipple",
      selfLabel: "Finger your nipple",
      image: "Icons/Activity/MasturbateHand.png",
      max: 70,
      action: "SourceCharacter works a finger right inside TargetCharacter's open nipple.",
      selfAction: "SourceCharacter slips a finger inside one of PronounPossessive own open nipples."
    }
  };
  var hasCock = (C2) => {
    try {
      return !!(C2 && typeof C2.HasPenis === "function" && C2.HasPenis());
    } catch (e) {
      return false;
    }
  };
  var mode = "";
  var lscgApi = null;
  var gameName = (k) => mode === "lscg" ? "LSCG_" + LSCG_ID + "." + ACTS[k].name.toLowerCase() : "FarmDisp_" + ACTS[k].name;
  var kindOfName = (n) => Object.keys(ACTS).find((k) => gameName(k) === n) || null;
  var usedAt2 = 0;
  var lastIn = /* @__PURE__ */ new Map();
  function nipsUsed(from, kind) {
    if (from && from !== me3()) nipsFed(from, kind);
    const now = Date.now();
    {
      const T = trainOf();
      T.used = now;
      T.lvl = Math.min(3, T.lvl + (kind === "cock" ? TRAIN.cock : TRAIN.finger));
      save();
    }
    if (kind === "cock" && from && from !== me3()) lastIn.set(from, now);
    if (now - usedAt2 > 3 * 6e4) {
      usedAt2 = now;
      const L = LINES.nips && LINES.nips[!from || from === me3() ? "self" : kind === "cock" ? "fucked" : "fingered"];
      if (L && L.length) local(fill(pick(L), { by: from && from !== me3() ? nameOf(from) : "you" }));
    }
  }
  function nipsTrapUsed(n) {
    n = Math.max(1, Math.min(8, Math.round(Number(n) || 1)));
    const T = trainOf();
    T.used = Date.now();
    T.lvl = Math.min(3, T.lvl + n * TRAIN.cock);
    save();
    if (mine2().nips) for (let i = 0; i < n; i++) nipsFed(0, "toy");
  }
  function nipsToyUsed() {
    const T = trainOf();
    T.used = Date.now();
    T.lvl = Math.min(3, T.lvl + TRAIN.finger);
    save();
    if (mine2().nips) nipsFed(0, "toy");
  }
  var CREAM_WINDOW = 90 * 1e3;
  var lastFuck = null;
  function fucked(target2) {
    if (target2 && target2 !== me3()) lastFuck = { target: Number(target2), at: Date.now() };
  }
  function onMyClimax() {
    const f = lastFuck;
    lastFuck = null;
    if (!f || Date.now() - f.at > CREAM_WINDOW || W8.ActivityOrgasmRuined) return;
    if (!hasCock(W8.Player) || !charOf2(f.target)) return;
    try {
      W8.ServerSend("ChatRoomChat", makeMsg("dispCream", {}, f.target));
    } catch (e) {
      return;
    }
    local(fill(pick(LINES.nips.came), { by: nameOf(f.target) }));
  }
  var onFarmLoad = null;
  function nipsOnFarmLoad(f) {
    onFarmLoad = f;
  }
  function onCream(from) {
    const at = lastIn.get(from);
    if (!at || Date.now() - at > 3 * 6e4) return;
    lastIn.delete(from);
    const S3 = st();
    S3.nipLoads = (S3.nipLoads || 0) + 1;
    const by = S3.nipLoadsBy || (S3.nipLoadsBy = {});
    by[from] = (by[from] || 0) + 1;
    const keys = Object.keys(by);
    if (keys.length > 40) delete by[keys[0]];
    save();
    action(fill(pick(LINES.nips.creamed), { by: nameOf(from) }));
    try {
      W8.dispatchEvent(new W8.CustomEvent("farmhand-dispensary", { detail: { type: "leak", mess: "cum", areas: ["chest"], amount: 1 } }));
    } catch (e) {
    }
    if (onFarmLoad) {
      try {
        onFarmLoad(from);
      } catch (e) {
      }
    }
  }
  var nipLoads = () => ({ n: st().nipLoads || 0, by: Object.assign({}, st().nipLoadsBy || {}) });
  function nipsLscg(api3, caps2) {
    if (!api3 || !caps2 || !caps2.has("activities") || mode) return false;
    try {
      api3.activities.registerPrerequisite({ name: "nipsopen", check: ({ acted }) => openOf(acted && acted.MemberNumber) > 0 && !toyIn(acted) });
      api3.activities.registerPrerequisite({ name: "hascock", check: ({ acting }) => hasCock(charOf2(acting && acting.MemberNumber)) });
      for (const k of Object.keys(ACTS)) {
        const A = ACTS[k];
        api3.activities.register({
          name: A.name.toLowerCase(),
          maxProgress: A.max,
          maxProgressSelf: A.max,
          image: A.image,
          prerequisites: k === "cock" ? ["ZoneAccessible", "ZoneNaked", "CanUsePenis", "hascock", "nipsopen"] : ["ZoneAccessible", "ZoneNaked", "UseHands", "nipsopen"],
          targets: [Object.assign({ group: "ItemNipples", label: A.label, action: A.action }, A.selfAction ? { selfAllowed: true, selfLabel: A.selfLabel, selfAction: A.selfAction } : {})],
          onSend: ({ target: target2 }) => {
            try {
              if (k === "cock") fucked(target2);
            } catch (e) {
            }
          },
          onReceive: ({ sender }) => {
            try {
              nipsUsed(Number(sender) || 0, k);
            } catch (e) {
            }
          }
        });
      }
      mode = "lscg";
      lscgApi = api3;
      return true;
    } catch (e) {
      console.warn("[Dispensary] LSCG wouldn't take the nipple actions:", e);
      return false;
    }
  }
  var TEXT = {};
  function addOwn(mod2) {
    if (mode) return false;
    const list = W8.ActivityFemale3DCG || (typeof ActivityFemale3DCG !== "undefined" ? ActivityFemale3DCG : null);
    const order = W8.ActivityFemale3DCGOrdering || (typeof ActivityFemale3DCGOrdering !== "undefined" ? ActivityFemale3DCGOrdering : null);
    if (!Array.isArray(list) || !Array.isArray(order) || typeof W8.ActivityCheckPrerequisite !== "function") return false;
    mode = "own";
    for (const k of Object.keys(ACTS)) {
      const A = ACTS[k], n = gameName(k);
      if (list.some((a) => a && a.Name === n)) continue;
      list.push({
        Name: n,
        MaxProgress: A.max,
        MaxProgressSelf: A.max,
        Target: ["ItemNipples"],
        TargetSelf: A.selfAction ? ["ItemNipples"] : void 0,
        Prerequisite: k === "cock" ? ["ZoneAccessible", "ZoneNaked", "CanUsePenis", "FarmDispHasCock", "FarmDispNipsOpen"] : ["ZoneAccessible", "ZoneNaked", "UseHands", "FarmDispNipsOpen"]
      });
      order.push(n);
      TEXT["Activity" + n] = A.label;
      TEXT["Label-ChatOther-ItemNipples-" + n] = A.label;
      TEXT["ChatOther-ItemNipples-" + n] = A.action;
      if (A.selfAction) {
        TEXT["Label-ChatSelf-ItemNipples-" + n] = A.selfLabel;
        TEXT["ChatSelf-ItemNipples-" + n] = A.selfAction;
      }
    }
    const hook = (fn, pri, f) => {
      try {
        mod2.hookFunction(fn, pri, f);
      } catch (e) {
        console.warn("[Dispensary] nipples can't hook " + fn + ":", e);
      }
    };
    hook("ActivityCheckPrerequisite", 5, (args, next2) => {
      if (args[0] === "FarmDispNipsOpen") {
        try {
          return openOf(args[2] && args[2].MemberNumber) > 0 && !toyIn(args[2]);
        } catch (e) {
          return false;
        }
      }
      if (args[0] === "FarmDispHasCock") return hasCock(args[1]);
      return next2(args);
    });
    hook("PreferenceGetActivityFactor", 5, (args, next2) => /^FarmDisp_Nipple/.test(String(args[1])) ? 2 : next2(args));
    hook("ActivityDictionaryText", 5, (args, next2) => Object.prototype.hasOwnProperty.call(TEXT, args[0]) ? TEXT[args[0]] : next2(args));
    hook("ElementButton.CreateForActivity", 5, (args, next2) => {
      try {
        const a = args[1], k = a && a.Activity && kindOfName(a.Activity.Name);
        if (k && !a.Item) {
          args[4] = Object.assign({}, args[4] || {});
          args[4].image = ACTS[k].image;
        }
      } catch (e) {
      }
      return next2(args);
    });
    hook("ServerSend", 5, (args, next2) => {
      try {
        const d = args[1];
        if (args[0] === "ChatRoomChat" && d && d.Type === "Activity" && Array.isArray(d.Dictionary) && /FarmDisp_Nipple/.test(String(d.Content))) {
          const get = (key2) => {
            const e = d.Dictionary.find((x) => x && x[key2] != null);
            return e ? e[key2] : null;
          };
          const src = Number(get("SourceCharacter")), tgt = Number(get("TargetCharacter"));
          const nm = (mn) => {
            const C2 = charOf2(mn);
            return C2 ? String(C2.Nickname || C2.Name || mn) : String(mn);
          };
          const text3 = String(TEXT[d.Content] || "").replace(/SourceCharacter/g, nm(src)).replace(/TargetCharacter/g, nm(tgt)).replace(/PronounPossessive/g, "their");
          if (text3) d.Dictionary.push({ Tag: 'MISSING TEXT IN "ActivityDictionary.csv": ' + d.Content, Text: text3 });
          if (/FarmDisp_NippleFuck$/.test(String(d.Content)) && src === me3()) fucked(tgt);
        }
      } catch (e) {
      }
      return next2(args);
    });
    return true;
  }
  var onSuckled = null;
  function nipsOnSuckle(f) {
    onSuckled = f;
  }
  function onActivity3(data) {
    const D = Array.isArray(data.Dictionary) ? data.Dictionary : [], get = (key2) => {
      const e = D.find((x) => x && x[key2] != null);
      return e ? e[key2] : null;
    };
    const name = String(get("ActivityName") || ""), src = Number(get("SourceCharacter")) || 0, tgt = Number(get("TargetCharacter")) || 0, grp = String(get("FocusGroupName") || "");
    if (tgt !== me3() || !/^ItemNipples/.test(grp)) return;
    const k = mode === "own" ? kindOfName(name) : null;
    if (k) {
      nipsUsed(src, k);
      return;
    }
    if (src && src !== me3() && /^(Suck|Nibble|Lick|Kiss)/.test(name) && onSuckled) onSuckled(src);
  }
  function initNipples(mod2) {
    setTimeout(() => {
      try {
        if (!mode) addOwn(mod2);
      } catch (e) {
        console.warn("[Dispensary] the nipple actions:", e);
      }
    }, 8e3);
    try {
      mod2.hookFunction("ChatRoomMessage", 11, (args, next2) => {
        try {
          const data = args[0];
          if (data && data.Type === "Activity") onActivity3(data);
          else if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me3()) {
            const m = readMsg(data);
            if (m && m.type === "dispNips") onNips(data.Sender, m);
            else if (m && m.type === "dispCream") onCream(data.Sender);
            else if (m && m.type === "dispNipsOpen") forceOf(data.Sender, m);
            else if (m && m.type === "dispNipsOpenOk") forceOk(data.Sender, m);
            else if (m && m.type === "dispNipsUsed" && data.Sender === BOT) nipsTrapUsed(m.n);
            else if (m && m.type === "dispIconsAsk") setTimeout(() => nipsTell(true), 600);
          }
        } catch (e) {
          console.warn("[Dispensary] nipples:", e);
        }
        return next2(args);
      });
    } catch (e) {
      console.warn("[Dispensary] nipples can't hear:", e);
    }
    try {
      mod2.hookFunction("ActivityOrgasmStart", 2, (args, next2) => {
        try {
          const C2 = args[0];
          if (C2 && typeof C2.IsPlayer === "function" && C2.IsPlayer()) setTimeout(() => onMyClimax(), 300);
        } catch (e) {
        }
        return next2(args);
      });
    } catch (e) {
    }
  }
  var nipsState = () => ({ mode, others: [...others.entries()], told: told2, names: Object.keys(ACTS).map(gameName), text: Object.assign({}, TEXT), lscg: !!lscgApi, train: Object.assign({}, st().nipTrain || {}), lastFuck });
  var nipsCream = (from) => onCream(from);
  var nipsClimax = () => onMyClimax();
  var nipsAddOwn = (mod2) => addOwn(mod2);

  // dispensary/src/lines-seed.js
  LINES.seed = {
    // ── how it goes in ──
    open_needle: [
      "%b fits the syringe's nozzle in and pushes the plunger home, slow and steady.",
      "%b lines up the syringe, slides it in, and empties it with one long squeeze.",
      "%b works the nozzle in deep and leans on the plunger till it bottoms out.",
      "%b holds %t still with one hand and pushes the plunger down with the other.",
      "%b eases the baster in and squeezes, and keeps squeezin'."
    ],
    open_self: [
      "%t fits the syringe in themselves and pushes the plunger down, slow, bitin' their lip.",
      "%t slides the nozzle in with a shaky hand and empties it into themselves.",
      "%t leans back, works the syringe in, and squeezes every drop in."
    ],
    open_sip: [
      "%b tips the bottle to %t's lips and doesn't take it away till it's empty.",
      "%b holds the glass for %t and makes them drink it all down, thick and warm.",
      "%b feeds it to %t a slow mouthful at a time, thumb under their chin."
    ],
    open_kiss: [
      "%b's kiss leaves somethin' thick and warm on %t's tongue, and %t swallows it down.",
      "%b kisses %t deep and pushes it into their mouth with their tongue."
    ],
    open_gear: [
      "%t's %g gives a warm, wet pulse.",
      "Somethin' in %t's %g throbs, and then it lets go.",
      "%t's %g clenches and pumps, all by itself.",
      "With a soft, wet click, %t's %g empties itself."
    ],
    // ── where it lands: small (a load or two), big (up to a litre and a half), huge (past that) ──
    vulva_s: [
      "%l of %s seed spills warm into %t's pussy, %a of it.",
      "%t's pussy takes %a of %s seed, and holds it, warm and deep.",
      "%a of %s seed settles deep in %t's pussy, right where it can take.",
      "%t feels it land, %a of %s seed, hot inside their pussy."
    ],
    vulva_m: [
      "%a of %s seed floods %t's pussy, so much it presses deep and fills them right up.",
      "%t's pussy is flooded with %s seed, %a of it, poured in till they're aching full.",
      "%a of %s seed pumps into %t's pussy, wave after warm wave, and their womb soaks it all up.",
      "%t gasps as %a of %s seed rushes into their pussy and keeps on comin'."
    ],
    vulva_l: [
      "%a of %s seed. It pours into %t's pussy and doesn't stop, packin' their womb tight and swellin' their belly out with it.",
      "%t's pussy is pumped full of %s seed, %a of it, till their womb is stretched round and heavy.",
      "%a. That's how much of %s seed goes into %t's pussy, and every drop of it pushes their belly out a little further.",
      "%t can only moan as %a of %s seed floods their pussy, fillin' them till their belly sloshes with it."
    ],
    butt_s: [
      "%l of %s seed slides warm into %t's ass, %a of it.",
      "%t's ass takes %a of %s seed and clenches round it.",
      "%a of %s seed goes deep in %t's ass, and stays there, warm.",
      "%t feels %a of %s seed spread hot inside their ass."
    ],
    butt_m: [
      "%a of %s seed floods %t's ass, so much they can feel it fillin' them up from the inside.",
      "%t's ass is pumped full of %s seed, %a of it, deep and heavy.",
      "%a of %s seed rushes up into %t's ass, wave after warm wave.",
      "%t squirms as %a of %s seed pours into their ass and keeps on comin'."
    ],
    butt_l: [
      "%a of %s seed. It floods up into %t's ass and keeps on goin', till their belly is round and sloshin' with it.",
      "%t's ass is pumped so full of %s seed, %a of it, that their belly swells out tight.",
      "%a of %s seed fills %t from behind, deeper and deeper, till their whole belly's heavy with it.",
      "%t can only whimper as %a of %s seed packs their ass full and swells their belly with it."
    ],
    mouth_s: [
      "%a of %s seed lands on %t's tongue, and they swallow it down.",
      "%t swallows %l of %s seed, %a of it, thick and salty.",
      "%t gulps down %a of %s seed and licks their lips after.",
      "%a of %s seed coats %t's tongue before it slides down their throat."
    ],
    mouth_m: [
      "%a of %s seed pours down %t's throat, and they gulp and gulp to keep up.",
      "%t swallows and swallows, %a of %s seed, till their belly's warm with it.",
      "%t's throat works hard round %a of %s seed, every thick mouthful of it.",
      "%a of %s seed fills %t's mouth faster than they can swallow, and they drink it all down anyway."
    ],
    mouth_l: [
      "%a of %s seed pours down %t's throat, more than any mouth should hold, and their belly swells round with it.",
      "%t drinks %a of %s seed, gulp after gulp, till their belly's tight and sloshin'.",
      "%t chokes it down, %a of %s seed, till they're stuffed full and their belly's round with it.",
      "There's no end to it: %a of %s seed floods down %t's throat and swells their belly out."
    ],
    nips_s: [
      "%a of %s seed pushes into %t's nipples, and their tits go warm and heavy.",
      "%t's nipples take %a of %s seed, a little in each, and tingle with it.",
      "%a of %s seed fills %t's tits from the nipples in, a slow, warm swell.",
      "%t shivers as %a of %s seed slides into their nipples and settles in their tits."
    ],
    nips_m: [
      "%a of %s seed pumps into %t's nipples, and their tits swell tight and heavy with it.",
      "%t's tits are filled from the nipples in, %a of %s seed, till they're round and achin'.",
      "%a of %s seed floods %t's nipples, and their tits sit fuller and heavier for it."
    ],
    nips_l: [
      "%a of %s seed is forced into %t's nipples, till their tits are swollen tight and shiny with it.",
      "%t's tits fill and fill with %s seed, %a of it, till they're heavy as udders.",
      "%a of %s seed packs %t's tits so full their nipples drip white."
    ],
    many_s: [
      "%a of %s seed, shared out between %t's %w.",
      "%s seed goes everywhere it can: %t's %w, %a of it all told.",
      "%t takes %a of %s seed, in their %w."
    ],
    many_m: [
      "%a of %s seed floods %t's %w, every hole filled at once.",
      "%t is filled everywhere: their %w, %a of %s seed in all.",
      "%s seed pumps into %t's %w all at once, %a of it."
    ],
    many_l: [
      "%a of %s seed floods %t's %w, every one of them packed full till their belly swells round.",
      "%t is stuffed in every hole, their %w, with %a of %s seed, and their belly sloshes with it.",
      "Every hole %t has is pumped full: their %w, %a of %s seed, till they're round and heavy."
    ],
    // ── what spills (more than a body holds) ──
    spill_hole: [
      "Most of it won't stay: %x wells back out of %t's %h and runs down their thighs.",
      "%t can't hold it all, and %x gushes back out of their %h.",
      "%x of it pours straight back out of %t's %h and puddles under them.",
      "It's too much: %x spills back out of %t's %h, down their legs."
    ],
    spill_mouth: [
      "%x of it spills from the corners of %t's mouth and drips off their chin.",
      "%t can't swallow it all, and %x runs down their chin and chest.",
      "%x of it bubbles back up and dribbles down %t's chin."
    ],
    spill_nips: [
      "%x of it wells back out of %t's nipples and runs down their tits.",
      "Their tits can't hold it all, and %x drips white from %t's nipples."
    ],
    // ── the seal ──
    seal_hold: [
      "%t's %g holds every last drop in.",
      "Not a drop gets out past %t's %g.",
      "%t's %g keeps it all in, right where it belongs.",
      "The %g holds it in, every drop, however full %t gets."
    ],
    seal_refuse: [
      "But %t's %g won't open for it: it's sealed for %S. %s seed runs off the outside of it and down %t's thighs.",
      "%t's %g stays shut. It's %S's, and it keeps %s seed out.",
      "None of it gets past %t's %g, sealed for %S as it is. It all runs back down their thighs."
    ],
    // ── the belly, fillin' up ──
    full_1: [
      "%t's belly starts to round out, warm and heavy.",
      "%t's belly is soft and round with it now.",
      "There's a warm swell low in %t's belly now."
    ],
    full_2: [
      "%t's belly is swollen and sloshin', round as can be.",
      "%t's belly is stretched round and heavy, and it sloshes when they move.",
      "%t looks well bred now, belly swollen tight and round."
    ],
    full_3: [
      "%t's belly is drum-tight, stretched so round with seed it shines.",
      "%t's belly is swollen huge and tight, like they're carryin' a litter already.",
      "%t can hardly move for the weight of it: their belly's drum-tight and sloshin'."
    ],
    // ── after: it drips back out (the room sees it when they're bare) ──
    drip_room: [
      "%t's %h can't hold it: a slow trickle of %s seed runs down their thighs.",
      "A little of %s seed seeps out of %t's %h and leaves a shiny trail down their leg.",
      "%t shifts, and a warm dribble of %s seed slips out of their %h.",
      "%t's %h leaks a little more of %s seed. It's been doin' that all day."
    ],
    drip_mine: [
      "You feel a little of %s seed seep out of your %h, warm and slow.",
      "A warm trickle of %s seed slips out of your %h, under your clothes.",
      "Your %h leaks a little more of %s seed. Everybody'd know, if they could see."
    ],
    // ── the seal goes in, and comes out ──
    seal_in: [
      "%t's %g settles into their %h and seals it shut: %S's, and nobody else's.",
      "%t's %g locks into place in their %h. Whatever %S puts in there now stays in.",
      "%t's %h is sealed now with %S's %g, and only %S's seed can take."
    ],
    seal_out: [
      "Out comes %t's %g, and %a of %s seed gushes out right behind it.",
      "The moment %t's %g comes out, %a of %s seed pours out of their %h and down their thighs.",
      "%t's %g pops free, and %a of %s seed floods out after it with a wet rush.",
      "%t's %g slides out, and their %h lets go of %a of %s seed all at once."
    ]
  };

  // dispensary/src/lines-breed.js
  LINES.breed = {
    // ── a real load lands in you (only you see these: the scene's yours to tell) ──
    load_vulva: [
      "You feel %S throb and let go deep inside you: %l, %a of it, hot in your pussy where it can take.",
      "%S empties into your pussy, pulse after pulse, and you can feel every warm drop of it settle deep.",
      "%a of %s seed floods your pussy. Your womb soaks it up like it's been waitin' for it all day.",
      "%S cums, buried to the hilt, and leaves you full and drippin' with %l.",
      "You clench round %S as they unload, %a of it, and keep every drop you can."
    ],
    load_butt: [
      "%S throbs deep in your ass and unloads, %l, %a of it, hot and heavy.",
      "%S cums in your ass, and you feel it spread warm all through you.",
      "%a of %s seed pumps into your ass, pulse after pulse, deep as it'll go.",
      "%S fills your ass full, and you squeeze down to keep it in."
    ],
    load_mouth: [
      "%S cums down your throat, %l, and you swallow and swallow to keep up.",
      "%a of %s seed fills your mouth, thick and salty, and slides down warm.",
      "%S holds your head and empties into your throat. You drink down every drop.",
      "You gulp down %S's load, %a of it, and lick your lips after."
    ],
    load_full: [
      "There's no room left for it: most of %s load runs straight back out of your %h.",
      "You're too full to keep it: it wells back out of your %h and down your thighs."
    ],
    // ── a knot: it swells, it locks, you're theirs till it goes down (the room sees it) ──
    knot_tie: [
      "%S's knot swells fat and locks inside %t's %h. They're tied together now, and %t isn't goin' anywhere till it goes down.",
      "With one last deep push, %S's knot pops past %t's rim and swells tight. %t's stuck on it, full and tied.",
      "%S's knot locks %t's %h shut round every drop. They're tied, and the seed's got nowhere to go but deep.",
      "%t gasps as %S's knot swells inside them, stretchin' them wide and lockin' them on. Tied fast."
    ],
    knot_tug: [
      "You try to pull away, and %S's knot tugs you right back. Not yet.",
      "You squirm on %S's knot. It won't budge, and every wiggle pushes their seed deeper.",
      "You're stuck fast on %S's knot. You'll go where they go for a while.",
      "The knot holds. Your %h's stretched round it, and it isn't lettin' go."
    ],
    knot_free: [
      "With a slow, wet pop, %S's knot finally slips free of %t, and a warm trickle follows it out.",
      "%S's knot goes down at last and slides out of %t's %h, leavin' them open, drippin' and well bred.",
      "%t is untied: %S's knot slips loose, and their %h stays gapin' and wet behind it."
    ],
    // ── keepin' it in: hips up after a load (only you see it) ──
    legs_up: [
      "You tip your hips up and keep %s load right where it can take.",
      "Rump up, knees spread: you hold %s seed deep and let it work.",
      "You stay down with your hips high, keepin' every drop of %s load inside, warm and deep.",
      "You lie still, hips tipped up, and feel %s seed settle deep where it belongs."
    ],
    // ── your ripe days: your womb's achin' for it (only you, then now and then the room) ──
    ripe_start: [
      "\u{1F338} You're ripe. There's a warm, hungry ache low in your belly, and it wants filled.",
      "\u{1F338} Your ripe days are here. Everything down low feels heavy and wet and ready to take.",
      "\u{1F338} You wake ripe and achin'. Any load today's likelier to catch."
    ],
    ripe_mine: [
      "That ripe ache throbs low in your belly again. You'd take a load right now, from anybody.",
      "You're slick and achin' and ripe, and you can't stop thinkin' about bein' bred.",
      "Your womb's achin' for it. Ripe as you are, the next load in you could take.",
      "You squeeze your thighs together. Ripe days make everything throb."
    ],
    ripe_room: [
      "%t smells ripe and ready, and keeps shiftin' their hips like they're hopin' somebody notices.",
      "There's a flush on %t and a want in how they move. Ripe, and everybody can tell.",
      "%t presses their thighs together and lets out a needy little breath. Somebody's ripe for breedin'."
    ],
    ripe_end: [
      "The ripe ache eases off. Whatever's in you now has had its best chance.",
      "Your ripe days pass, and the hungry ache low down settles again."
    ]
  };

  // dispensary/src/breed.js
  var W9 = window;
  var MIN5 = 6e4;
  var DAY5 = 864e5;
  var me4 = () => W9.Player && W9.Player.MemberNumber || 0;
  var botIn2 = () => (W9.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === BOT);
  var charOf3 = (mn) => (mn === me4() ? W9.Player : (W9.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn)) || null;
  var breedAnyOn = () => st().breedAny === true;
  var HOLE_OF = { ItemVulva: "vulva", ItemButt: "butt", ItemMouth: "mouth" };
  var DEFAULT_LOAD = [30, 60];
  var said2 = {};
  function lineOf(key2, v) {
    const L = LINES.breed && LINES.breed[key2];
    if (!L || !L.length) return "";
    let t = pick(L);
    if (L.length > 1 && t === said2[key2]) t = L[(L.indexOf(t) + 1) % L.length];
    said2[key2] = t;
    v = v || {};
    return String(t).replace(/%t/g, myName()).replace(/%S/g, v.S || "somebody").replace(/%s/g, v.s || "somebody's").replace(/%a/g, v.a || "").replace(/%l/g, v.l || "a load").replace(/%h/g, v.h || "pussy").replace(/^\s*(\S)/, (m, c) => m.slice(0, -1) + c.toUpperCase());
  }
  var lastIn2 = null;
  function myLoad() {
    const F = st().cock;
    let ml = F && F.load > 0 ? F.load : DEFAULT_LOAD[0] + Math.random() * (DEFAULT_LOAD[1] - DEFAULT_LOAD[0]);
    try {
      const D = W9.FarmhandDispensary;
      if (D && D.active && D.active("rut")) ml *= 1.5;
    } catch (e) {
    }
    const tie2 = F && F.knot ? F.tie && F.tie.length === 2 ? F.tie : [5, 15] : null;
    return { ml: Math.round(ml), knot: !!tie2, mins: tie2 ? Math.round(tie2[0] + Math.random() * (tie2[1] - tie2[0])) : 0 };
  }
  function onMyClimax2() {
    const f = lastIn2;
    lastIn2 = null;
    if (!f || Date.now() - f.at > 9e4 || W9.ActivityOrgasmRuined || !charOf3(f.target)) return false;
    const L0 = myLoad();
    try {
      W9.ServerSend("ChatRoomChat", makeMsg("dispLoad", { h: f.h, ml: L0.ml, knot: L0.knot ? 1 : 0, mins: L0.mins }, f.target));
    } catch (e) {
      return false;
    }
    return true;
  }
  var waiting = /* @__PURE__ */ new Map();
  var told3 = /* @__PURE__ */ new Map();
  function realLoad(from, h2) {
    if (!breedAnyOn() || botIn2() || !from || from === me4() || !allowed(from)) return false;
    if (!["vulva", "butt", "throat", "mouth"].includes(h2)) return false;
    h2 = h2 === "throat" ? "mouth" : h2;
    const pre = told3.get(from);
    if (pre && Date.now() - pre.at < 8e3) {
      told3.delete(from);
      book(from, h2, pre);
      return true;
    }
    const w = waiting.get(from);
    if (w) clearTimeout(w.t);
    waiting.set(from, { h: h2, at: Date.now(), t: setTimeout(() => {
      waiting.delete(from);
      book(from, h2, null);
    }, 2500) });
    return true;
  }
  function onLoadMsg(from, m) {
    const o = { ml: Math.max(1, Math.min(5e3, Number(m.ml) || 0)), knot: m.knot ? 1 : 0, mins: Math.max(0, Math.min(40, Number(m.mins) || 0)), at: Date.now() };
    const w = waiting.get(from);
    if (w) {
      clearTimeout(w.t);
      waiting.delete(from);
      book(from, w.h, o);
      return;
    }
    told3.set(from, o);
  }
  function book(from, h2, o) {
    const ml = o && o.ml ? o.ml : Math.round(DEFAULT_LOAD[0] + Math.random() * (DEFAULT_LOAD[1] - DEFAULT_LOAD[0]));
    const r = seedGive({ by: from, sire: from, nm: nameOf(from) !== "somebody" ? nameOf(from) : "", p: h2 + "=" + ml, via: "cock", quiet: true });
    if (!r || !r.ok) return null;
    const v = { S: nameOf(from), s: nameOf(from) + "'s", a: amountSay(ml), l: loadSay(ml), h: SEED_WORD[h2] };
    local(lineOf("load_" + h2, v) + (r.spilt && r.spilt[h2] >= 5 ? " " + lineOf("load_full", v) : ""));
    if (o && o.knot && h2 !== "mouth" && charOf3(from)) tieTo(from, h2, o.mins || 10);
    return r;
  }
  function tieTo(by, h2, mins) {
    const S3 = st(), now = Date.now();
    S3.tie = { by, h: h2, until: Math.max(S3.tie && S3.tie.by === by && S3.tie.until || 0, now + Math.max(3, mins) * MIN5) };
    save();
    if (inRoom()) action(lineOf("knot_tie", { S: nameOf(by), h: SEED_WORD[h2] }));
  }
  var tied = () => {
    const t = st().tie;
    return t && t.until > Date.now() ? t : null;
  };
  var tugAt = 0;
  function tieOk(X, Y) {
    const t = tied();
    if (!t) return true;
    const C2 = charOf3(t.by), pos = C2 && C2.MapData && C2.MapData.Pos;
    if (!pos || typeof pos.X !== "number") return true;
    if (Math.max(Math.abs(X - pos.X), Math.abs(Y - pos.Y)) <= 1) return true;
    if (Date.now() - tugAt > 2e4) {
      tugAt = Date.now();
      local(lineOf("knot_tug", { S: nameOf(t.by), h: SEED_WORD[t.h] }));
    }
    return false;
  }
  function tieTick(now) {
    const t = st().tie;
    if (!t) return;
    if (t.until <= now || !charOf3(t.by)) {
      delete st().tie;
      save();
      if (inRoom() && charOf3(t.by)) action(lineOf("knot_free", { S: nameOf(t.by), h: SEED_WORD[t.h] }));
    }
  }
  var UP_POSES = ["AllFours", "Hogtied", "KneelingSpread"];
  function hipsUp() {
    try {
      const P = W9.Player, lower = P && P.PoseMapping && P.PoseMapping.BodyLower;
      return UP_POSES.includes(lower);
    } catch (e) {
      return false;
    }
  }
  function upTick(now) {
    if (!hipsUp()) return;
    const n = seedMarkUp(now - 5 * MIN5);
    if (n && n.who) local(lineOf("legs_up", { s: n.who === me4() ? "your own" : (nameOf(n.who) !== "somebody" ? nameOf(n.who) : n.nm || "their") + "'s" }));
  }
  function ripeNow(now) {
    const R = st().ripe;
    if (!R || !(R.at > 0)) return false;
    now = now || Date.now();
    const d = Math.floor((now - R.at) / DAY5), every = R.every || 7, k = (d % every + every) % every;
    return k >= (R.from || 3) && k < (R.from || 3) + (R.days || 2);
  }
  var ripeWas = null;
  var ripeNext = 0;
  var ripeRoomNext = 0;
  function ripeTick(now) {
    const r = ripeNow(now);
    if (ripeWas === null) {
      ripeWas = r;
      ripeNext = now + (20 + Math.random() * 20) * MIN5;
      ripeRoomNext = now + (60 + Math.random() * 60) * MIN5;
      return;
    }
    if (r !== ripeWas) {
      ripeWas = r;
      local(lineOf(r ? "ripe_start" : "ripe_end"));
      ripeNext = now + (30 + Math.random() * 20) * MIN5;
      return;
    }
    if (!r || !inRoom()) return;
    if (now >= ripeNext) {
      ripeNext = now + (35 + Math.random() * 25) * MIN5;
      local(lineOf("ripe_mine"));
    }
    if (now >= ripeRoomNext) {
      ripeRoomNext = now + (90 + Math.random() * 60) * MIN5;
      action(lineOf("ripe_room"));
    }
  }
  function breedWelcome(m) {
    const S3 = st();
    if (m && m.ripe && typeof m.ripe === "object" && Number(m.ripe.at) > 0) S3.ripe = { at: Number(m.ripe.at), every: Math.max(2, Math.min(30, Number(m.ripe.every) || 7)), from: Math.max(0, Math.min(29, Number(m.ripe.from) || 3)), days: Math.max(1, Math.min(10, Number(m.ripe.days) || 2)) };
    else if (m && m.ripe === null) delete S3.ripe;
    if (m && m.cock && typeof m.cock === "object") S3.cock = { load: Math.max(0, Math.min(5e3, Math.round(Number(m.cock.load) || 0))), knot: !!m.cock.knot, tie: Array.isArray(m.cock.tie) ? m.cock.tie.slice(0, 2).map((x) => Math.max(1, Math.min(40, Number(x) || 5))) : null };
    else if (m && m.cock === null) delete S3.cock;
    save();
  }
  function breedTick(now) {
    now = now || Date.now();
    tieTick(now);
    upTick(now);
    ripeTick(now);
  }
  function initBreed(mod2) {
    try {
      mod2.hookFunction("ChatRoomMessage", 11, (args, next2) => {
        try {
          const data = args[0];
          if (data && data.Type === "Activity" && data.Sender === me4()) {
            const D = Array.isArray(data.Dictionary) ? data.Dictionary : [], get = (k) => {
              const e = D.find((x) => x && x[k] != null);
              return e ? e[k] : null;
            };
            const name = String(get("ActivityName") || ""), tgt = Number(get("TargetCharacter")) || 0, grp = String(get("FocusGroupName") || ""), A = D.find((x) => x && x.Tag === "ActivityAsset");
            const U = useOf(name, A ? A.AssetName : "", ""), h2 = HOLE_OF[grp];
            if (U && U.cock && h2 && tgt && tgt !== me4()) lastIn2 = { target: tgt, h: h2 === "mouth" ? "throat" : h2, at: Date.now() };
          } else if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me4()) {
            const m = readMsg(data);
            if (m && m.type === "dispLoad") onLoadMsg(data.Sender, m);
          }
        } catch (e) {
          console.warn("[Dispensary] breed:", e);
        }
        return next2(args);
      });
    } catch (e) {
      console.warn("[Dispensary] breedin' can't hear the room:", e);
    }
    try {
      mod2.hookFunction("ActivityOrgasmStart", 2, (args, next2) => {
        try {
          const C2 = args[0];
          if (C2 && typeof C2.IsPlayer === "function" && C2.IsPlayer()) setTimeout(() => onMyClimax2(), 300);
        } catch (e) {
        }
        return next2(args);
      });
    } catch (e) {
    }
    try {
      mod2.hookFunction("ChatRoomMapViewCanEnterTile", 2, (args, next2) => {
        const t = next2(args);
        try {
          return t > 0 && !tieOk(args[0], args[1]) ? 0 : t;
        } catch (e) {
          return t;
        }
      });
    } catch (e) {
    }
  }
  var breedReset = () => {
    lastIn2 = null;
    waiting.forEach((w) => clearTimeout(w.t));
    waiting.clear();
    told3.clear();
    delete st().tie;
    ripeWas = null;
  };
  var breedClimax = () => onMyClimax2();
  var breedLastIn = () => lastIn2;

  // dispensary/src/lines-carry.js
  LINES.carry = {
    // ── carryin' (mostly only you; now and then the room) ──
    early_mine: [
      "There's a warm, secret fullness low in your belly. %S young are in there, takin' hold.",
      "Your tits feel heavy and tender today, achin' for no reason at all. You know the reason.",
      "You catch yourself restin' a hand on your belly. Bred. Really, properly bred.",
      "Every time you move you feel it: that soft, full weight that says you took."
    ],
    show_mine: [
      "Your belly's round now, firm and warm under your hand. Everybody can see what you are.",
      "You're showin', and you can't stop touchin' it. %c in there, all %S.",
      "Your clothes sit tight over your swellin' belly. You're a breeder, and it shows.",
      "Your tits are swollen and achin', fillin' up for what's comin'."
    ],
    heavy_mine: [
      "Your belly's heavy and huge, stretched tight with %S %many. Every step's a slow, swayin' waddle.",
      "Somethin' shifts and kicks deep inside you, then again. They're gettin' big in there.",
      "You're so full of them you can hardly bend. Your belly sits heavy and round in front of you, proud.",
      "Milk beads at your nipples all by itself now. Your body's ready for them."
    ],
    room_show: [
      "%t rests both hands on their round, swellin' belly. Bred, and showin' it off.",
      "%t's belly's grown round and firm. Somebody's been well and truly bred.",
      "%t shifts their weight with a little sigh, one hand cupped under their full belly."
    ],
    room_heavy: [
      "%t waddles a few slow steps, belly huge and heavy in front of them, and has to stop and catch their breath.",
      "%t's belly gives a visible kick. They gasp, then smile and rub the spot.",
      "%t is heavy with young, belly stretched tight and round, tits swollen and leakin'.",
      "%t lowers themselves down slow and careful, cradlin' a belly that's almost ready to burst."
    ],
    crave: [
      "You're achin' for seed. Not just a little: you'd drink a load right now, from anybody who'd give it.",
      "Carryin's made you hungry, and not for food. You want a thick load down your throat or deep in you.",
      "Your belly's full and your mouth's empty, and all you can think about is cock."
    ],
    // ── heat, anywhere ──
    heat_start: [
      "\u{1F525} Heat hits %t like a wave: flushed, slick and achin', and they can't keep still.",
      "\u{1F525} %t comes into heat right where they are, cheeks burnin', thighs pressed tight, needy all over.",
      "\u{1F525} %t's in heat. You can see it on them, and anybody close enough can smell it."
    ],
    heat_scent: [
      "You catch the scent of %b's heat, sweet and heavy, and your cock throbs with it.",
      "%b's in heat, and you can smell it from here. Your balls ache to empty into them.",
      "There's heat in the air: %b's. It goes straight to your cock."
    ],
    // ── labour, wherever you are (the room sees it) ──
    water: [
      "%t gasps and grabs for somethin' to hold: their waters have broken, right here. %S %many are on their way.",
      "A warm gush runs down %t's thighs, and their belly tightens hard. It's time.",
      "%t doubles over with a low moan as the first real wave rolls through their swollen belly. Their %many are comin'."
    ],
    early: [
      "Another wave rolls through %t's belly. They rock their hips and breathe through it, slow.",
      "%t's belly tightens and holds, then eases. It's only startin'.",
      "%t pants, both hands on their belly, as it squeezes hard and lets go."
    ],
    strong: [
      "The waves come close and strong now. %t's on their knees, moanin' with every one.",
      "%t bears down with a long, deep groan, belly drawn hard and tight. They're pushin' now.",
      "%t can't hold back the noises: every push is a deep, needy groan."
    ],
    close: [
      "%t's almost there, red-faced and shakin', pushin' with everything they've got.",
      "One more, %t. They grit their teeth and push, and push.",
      "%t cries out: the first one's crownin'."
    ],
    midwife: [
      "%b kneels beside %t and rubs their belly through the next wave, slow and firm.",
      "%b holds %t's hand and talks them through it, steady and sweet.",
      "%b's hands work low on %t's belly, easin' the next one along."
    ],
    birth: [
      "With one last long push, %t delivers %kids, %S. Spent, glowin' and well bred, they gather them close.",
      "%t's labour ends in a rush: %kids, slick and squirmin', %S every one. They're a mother again.",
      "There they are: %kids. %t sinks back, belly soft and empty, tits heavy with milk, and laughs breathless."
    ],
    birth_midwife: [
      "With %b's hands to help, %t delivers %kids, %S. %b gathers them up and lays them on %t's chest.",
      "%t pushes the last one out into %b's waitin' hands: %kids, %S. What a good breeder."
    ],
    // ── layin' eggs ──
    lay_start: [
      "%t's belly rolls and shifts. The eggs in them want out, and they want out now.",
      "%t squirms, belly heavy and lumpy with eggs, and squats down low."
    ],
    lay_push: [
      "%t strains and moans, and a slick, warm egg slides out of them.",
      "Another egg crowns and pops free with a wet sound. %t shudders all over.",
      "%t bears down, gasps, and pushes out another egg, round and glistenin'."
    ],
    lay_done: [
      "%t pushes the last of them out: %e eggs, warm and slick, in a little pile. Their belly's soft and empty again.",
      "With a long shiver %t lays the last one. %e eggs, every one of them perfect."
    ],
    // ── back to back: open again after a birth ──
    open_mine: [
      "You're still open and achin' from the birth, and already you want filled again.",
      "Your womb's wide open and hungry. The next load in you could take, easy."
    ],
    // ── the Quickening Draught ──
    quicken: [
      "The draught goes down warm, and %t's belly swells a little rounder right away. Their %many are growin' faster.",
      "%t gasps as their belly tightens and grows, hurried along. They're closer to due now.",
      "Warmth floods %t's belly, and it swells, heavier and rounder by the minute."
    ],
    quicken_none: [
      "The draught goes down warm and settles low, achin'. There's nothin' in %t to hurry along. Yet."
    ],
    // ── the Breeder's Scan ──
    scan_preg: [
      "%b runs the scanner slow over %t's belly, and it lights up: %c in there, %S, %d.",
      "The scan shows it plain: %t's carryin' %c, all %S, and %d.",
      "%b's scan glides across %t's swollen belly. %c heartbeats, %S, %d."
    ],
    scan_eggs: [
      "...and a clutch of %e eggs packed in there too, nearly ready."
    ],
    scan_seed: [
      "%b runs the scanner over %t's belly: nothin' caught yet, but %a of seed sloshin' in there, waitin' to take.",
      "Empty for now, the scan says. Just %a of seed in %t, and a womb hungry for it."
    ],
    scan_empty: [
      "%b runs the scanner over %t's belly. Nothin' in there. Somebody should fix that.",
      "The scan comes up empty: %t's not carryin'. Not yet."
    ],
    scan_ripe: [
      "...and they're ripe right now: a load today would take twice as easy."
    ]
  };

  // dispensary/src/carry.js
  var W10 = window;
  var MIN6 = 6e4;
  var HOUR3 = 36e5;
  var DAY6 = 864e5;
  var me5 = () => W10.Player && W10.Player.MemberNumber || 0;
  var botIn3 = () => (W10.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === BOT);
  var charOf4 = (mn) => (mn === me5() ? W10.Player : (W10.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn)) || null;
  var tellPage2 = (detail) => {
    try {
      W10.dispatchEvent(new W10.CustomEvent("farmhand-dispensary", { detail }));
    } catch (e) {
    }
  };
  var BREDBACK_MIN = 60;
  var C = () => st().carry || null;
  function carryWelcome(m) {
    const c = m && m.carry;
    if (!c || typeof c !== "object") return;
    const S3 = st(), num2 = (v, lo, hi) => Math.max(lo, Math.min(hi, Number(v) || 0));
    const P = c.preg && typeof c.preg === "object" ? c.preg : null, E = c.eggs && typeof c.eggs === "object" ? c.eggs : null;
    S3.carry = {
      preg: P ? { since: num2(P.since, 0, 1e14), due: num2(P.due, 0, 1e14), count: Math.round(num2(P.count, 1, 60)), sires: Array.isArray(P.sires) ? P.sires.filter((x) => typeof x === "string").slice(0, 6).map((x) => x.slice(0, 40)) : [] } : null,
      eggs: E ? { n: Math.round(num2(E.n, 1, 200)), layAt: num2(E.layAt, 0, 1e14), by: typeof E.by === "string" ? E.by.slice(0, 40) : "" } : null,
      heat: { until: num2(c.heat && c.heat.until, 0, 1e14), next: num2(c.heat && c.heat.next, 0, 1e14) },
      open: num2(c.open, 0, 1e14),
      litters: Math.round(num2(c.litters, 0, 1e6)),
      one: typeof c.one === "string" ? c.one.slice(0, 20) : "little one",
      many: typeof c.many === "string" ? c.many.slice(0, 20) : "little ones",
      at: Date.now()
    };
    if (S3.born && Number(c.bornSeen) >= S3.born.at) delete S3.born;
    if (S3.laid && Number(c.laidSeen) >= S3.laid.at) delete S3.laid;
    if (S3.carry.preg && S3.labour && S3.labour.due !== S3.carry.preg.due && !S3.born) delete S3.labour;
    save();
    tellPage2({ type: "seed" });
  }
  var carryHello = () => ({ born: st().born || void 0, laid: st().laid || void 0 });
  function bellyAll(now) {
    now = now || Date.now();
    const c = C(), I = seedInfo();
    let w = 0;
    const full = I.belly / Math.max(1, seedCap());
    if (full > 0.8) w += (full - 0.8) * 3;
    if (c && c.eggs && !st().laid) w += c.eggs.n / 10;
    const g = c && c.preg && !st().born ? c.preg : null;
    if (g) {
      const f = Math.max(0, Math.min(1, (now - g.since) / Math.max(1, g.due - g.since)));
      w += f * (1 + g.count * 0.5);
    }
    return w >= 8 ? 4 : w >= 4 ? 3 : w >= 2 ? 2 : w >= 0.8 ? 1 : 0;
  }
  var said3 = {};
  function lineOf2(key2, v) {
    const L = LINES.carry && LINES.carry[key2];
    if (!L || !L.length) return "";
    let t = pick(L);
    if (L.length > 1 && t === said3[key2]) t = L[(L.indexOf(t) + 1) % L.length];
    said3[key2] = t;
    v = v || {};
    const c = C() || {}, g = c.preg || {}, n = v.c || g.count || 1;
    const kids = n === 1 ? "a " + (c.one || "little one") : n + " " + (c.many || "little ones");
    return String(t).replace(/%t/g, myName()).replace(/%b/g, v.b || "somebody").replace(/%S/g, v.S || sireWords(g.sires)).replace(/%kids/g, kids).replace(/%many/g, c.many || "little ones").replace(/%one/g, c.one || "little one").replace(/%c/g, String(n)).replace(/%e/g, String(v.e || c.eggs && c.eggs.n || "")).replace(/%a/g, v.a || "").replace(/%d/g, v.d || "").replace(/^\s*(\S)/, (m, ch) => m.slice(0, -1) + ch.toUpperCase());
  }
  var sireWords = (s) => !s || !s.length ? "their sire's" : s.length === 1 ? s[0] + "'s" : s.slice(0, -1).join(", ") + " and " + s[s.length - 1] + "'s";
  var dueWords2 = (due) => {
    const ms = due - Date.now();
    return ms <= 0 ? "due right now" : ms < 36 * HOUR3 ? "due in " + Math.max(1, Math.round(ms / HOUR3)) + " hours" : "due in " + Math.round(ms / DAY6) + " days";
  };
  function stageOf(now) {
    const g = C() && C().preg;
    if (!g || st().born) return "";
    const f = (now - g.since) / Math.max(1, g.due - g.since);
    return f >= 1 ? "due" : f >= 0.7 ? "heavy" : f >= 0.3 ? "show" : "early";
  }
  var feelNext = 0;
  var roomNext = 0;
  var craveNext2 = 0;
  function feelTick(now) {
    const s = stageOf(now);
    if (!s || !inRoom()) return;
    if (!feelNext) {
      feelNext = now + (8 + Math.random() * 10) * MIN6;
      roomNext = now + (40 + Math.random() * 30) * MIN6;
      craveNext2 = now + (50 + Math.random() * 40) * MIN6;
      return;
    }
    if (now >= feelNext) {
      feelNext = now + (25 + Math.random() * 20) * MIN6;
      local(lineOf2((s === "due" ? "heavy" : s) + "_mine"));
      if (s === "heavy" || s === "due") tellPage2({ type: "leak", mess: "milk", areas: ["chest"], amount: 0.8 });
    }
    if (now >= roomNext && s !== "early") {
      roomNext = now + (60 + Math.random() * 40) * MIN6;
      action(lineOf2(s === "show" ? "room_show" : "room_heavy"));
    }
    if (now >= craveNext2) {
      craveNext2 = now + (70 + Math.random() * 50) * MIN6;
      local(lineOf2("crave"));
    }
  }
  var heatDone = 0;
  function heatTick(now, giveHeat) {
    const c = C();
    if (!c || botIn3()) return;
    const next2 = c.heat && c.heat.next;
    if (!(next2 > 0) || now < next2 || heatDone === next2 || st().heatAt === next2 || now - next2 > 12 * HOUR3) return;
    heatDone = next2;
    st().heatAt = next2;
    save();
    const mins = Math.max(10, Math.round((next2 + 12 * HOUR3 - now) / MIN6));
    try {
      giveHeat(mins, lineOf2("heat_start"));
    } catch (e) {
    }
  }
  var scentAt = /* @__PURE__ */ new Map();
  function scentTick(now, idsOf) {
    const P = W10.Player;
    if (!P || typeof P.HasPenis !== "function" || !P.HasPenis() || !inRoom()) return;
    for (const c of W10.ChatRoomCharacter || []) {
      if (!c || c.MemberNumber === me5()) continue;
      const ids = idsOf(c.MemberNumber);
      if (!ids.includes("heat")) continue;
      if (now - (scentAt.get(c.MemberNumber) || 0) < HOUR3) continue;
      scentAt.set(c.MemberNumber, now);
      local(lineOf2("heat_scent", { b: nameOf(c.MemberNumber) }));
      try {
        const A = P.ArousalSettings;
        if (A && typeof W10.ActivitySetArousal === "function") W10.ActivitySetArousal(P, Math.min(100, (Number(A.Progress) || 0) + 10));
      } catch (e) {
      }
    }
  }
  var helped = /* @__PURE__ */ new Map();
  function labourTick(now) {
    const S3 = st(), c = C(), g = c && c.preg;
    if (!g || S3.born || botIn3()) {
      if (S3.labour && (!g || S3.born)) {
        delete S3.labour;
        save();
      }
      return;
    }
    if (!S3.labour) {
      if (now < g.due || !inRoom()) return;
      const mins = Math.min(90, 45 + Math.max(0, g.count - 1) * 3);
      S3.labour = { start: now, until: now + mins * MIN6, next: now + (6 + Math.random() * 4) * MIN6, due: g.due, helps: 0, midwife: 0 };
      save();
      action(lineOf2("water"));
      return;
    }
    const L = S3.labour;
    if (now >= L.until) {
      S3.born = { at: now, midwife: L.midwife || 0, helps: L.helps || 0, n: g.count, due: g.due };
      delete S3.labour;
      save();
      action(L.midwife && charOf4(L.midwife) ? lineOf2("birth_midwife", { b: nameOf(L.midwife) }) : lineOf2("birth"));
      tellPage2({ type: "leak", mess: "milk", areas: ["chest"], amount: 1.5 });
      tellPage2({ type: "seed" });
      return;
    }
    if (now >= L.next && inRoom()) {
      L.next = now + (6 + Math.random() * 4) * MIN6;
      save();
      const f = (now - L.start) / Math.max(1, L.until - L.start);
      action(lineOf2(f < 0.4 ? "early" : f < 0.8 ? "strong" : "close"));
    }
  }
  function labourTouch(from, group) {
    const L = st().labour;
    if (!L || !from || from === me5() || !/^Item(Pelvis|Torso|Vulva|Breast)$/.test(String(group || ""))) return false;
    if (Date.now() - (helped.get(from) || 0) < 3 * MIN6) return false;
    helped.set(from, Date.now());
    if (!L.midwife) L.midwife = from;
    L.helps = (L.helps || 0) + 1;
    L.until = Math.max(Date.now() + MIN6, L.until - 3 * MIN6);
    save();
    action(lineOf2("midwife", { b: nameOf(from) }));
    return true;
  }
  function layTick(now) {
    const S3 = st(), c = C(), e = c && c.eggs;
    if (!e || S3.laid || botIn3() || now < e.layAt || !inRoom()) {
      if (S3.laying && (!e || S3.laid)) {
        delete S3.laying;
        save();
      }
      return;
    }
    if (!S3.laying) {
      S3.laying = { start: now, next: now + 2 * MIN6, pushes: 0 };
      save();
      action(lineOf2("lay_start"));
      return;
    }
    const Y = S3.laying;
    if (now < Y.next) return;
    Y.pushes += 1;
    Y.next = now + (2 + Math.random() * 2) * MIN6;
    if (Y.pushes >= Math.min(4, 1 + Math.ceil(e.n / 3))) {
      S3.laid = { at: now, n: e.n };
      delete S3.laying;
      save();
      action(lineOf2("lay_done", { e: e.n }));
      tellPage2({ type: "seed" });
      return;
    }
    save();
    action(lineOf2("lay_push"));
  }
  function openUntil() {
    const c = C(), S3 = st();
    return Math.max(c && c.open || 0, S3.born ? S3.born.at + BREDBACK_MIN * MIN6 : 0);
  }
  var openSaid = 0;
  function openTick(now) {
    const u = openUntil();
    if (!(u > now) || openSaid === u || !inRoom()) return;
    openSaid = u;
    local(lineOf2("open_mine"));
  }
  function quicken(x, quiet) {
    const c = C(), g = c && c.preg, S3 = st();
    x = Math.max(1, Math.min(5, Math.round(Number(x) || 1)));
    if ((!g || S3.born) && !(c && c.eggs && !S3.laid)) {
      if (!quiet) action(lineOf2("quicken_none"));
      return { ok: false, why: "none" };
    }
    const now = Date.now();
    if (g && !S3.born) {
      const step = Math.min(x * DAY6, Math.max(0, g.due - now - 2 * HOUR3));
      g.due -= step;
      g.since -= step;
    }
    if (c.eggs && !S3.laid) c.eggs.layAt = Math.max(now + 30 * MIN6, c.eggs.layAt - x * 12 * HOUR3);
    if (!botIn3()) S3.quick = Math.min(20, (S3.quick || 0) + x);
    save();
    tellPage2({ type: "seed" });
    if (!quiet) action(lineOf2("quicken"));
    return { ok: true };
  }
  function takeQuick() {
    const n = st().quick || 0;
    if (n) {
      delete st().quick;
      save();
    }
    return n;
  }
  function scan(by) {
    const c = C(), g = c && c.preg, S3 = st(), I = seedInfo(), v = { b: by && by !== me5() ? nameOf(by) : myName() };
    let t;
    if (g && !S3.born) t = lineOf2("scan_preg", Object.assign({}, v, { d: dueWords2(g.due) })) + (c.eggs && !S3.laid ? " " + lineOf2("scan_eggs") : "");
    else if (c && c.eggs && !S3.laid) t = lineOf2("scan_preg", Object.assign({}, v, { c: c.eggs.n, S: c.eggs.by ? c.eggs.by + "'s" : "somebody's", d: "eggs, " + dueWords2(c.eggs.layAt).replace("due", "ready") }));
    else if (I.belly >= 5) t = lineOf2("scan_seed", Object.assign({}, v, { a: amountSay(I.belly) }));
    else t = lineOf2("scan_empty", v);
    if (ripeNow()) t += " " + lineOf2("scan_ripe");
    action(t);
    return { ok: true };
  }
  var lastTick2 = 0;
  function carryTick(now, deps2) {
    now = now || Date.now();
    lastTick2 = now;
    try {
      labourTick(now);
    } catch (e) {
      console.warn("[Dispensary] labour:", e);
    }
    try {
      layTick(now);
    } catch (e) {
      console.warn("[Dispensary] eggs:", e);
    }
    try {
      feelTick(now);
    } catch (e) {
    }
    try {
      heatTick(now, deps2.giveHeat);
    } catch (e) {
    }
    try {
      scentTick(now, deps2.idsOf);
    } catch (e) {
    }
    try {
      openTick(now);
    } catch (e) {
    }
  }
  function carryInfo(now) {
    now = now || Date.now();
    const c = C(), S3 = st(), g = c && c.preg && !S3.born ? c.preg : null;
    return {
      carrying: g ? { count: g.count, sires: g.sires, due: g.due, dueWords: dueWords2(g.due), stage: stageOf(now) } : null,
      eggs: c && c.eggs && !S3.laid ? { n: c.eggs.n, by: c.eggs.by, layAt: c.eggs.layAt } : null,
      labour: S3.labour ? { left: Math.max(0, S3.labour.until - now), midwife: S3.labour.midwife ? nameOf(S3.labour.midwife) : "" } : null,
      born: S3.born || null,
      laid: S3.laid || null,
      heat: c && c.heat && c.heat.until > now ? c.heat.until : 0,
      nextHeat: c && c.heat ? c.heat.next : 0,
      open: openUntil() > now ? openUntil() : 0,
      litters: c && c.litters || 0,
      belly: bellyAll(now),
      known: !!c,
      one: c && c.one || "",
      many: c && c.many || ""
    };
  }
  var carryReset = () => {
    delete st().carry;
    delete st().labour;
    delete st().born;
    delete st().laid;
    delete st().laying;
    delete st().quick;
    delete st().heatAt;
    feelNext = 0;
    heatDone = 0;
    openSaid = 0;
    scentAt.clear();
    helped.clear();
  };
  var carryFeelNow = () => {
    feelNext = 1;
    roomNext = 1;
    craveNext2 = 1;
  };

  // dispensary/src/seed.js
  var W11 = window;
  var MIN7 = 6e4;
  var HOUR4 = 36e5;
  var me6 = () => W11.Player && W11.Player.MemberNumber || 0;
  var botIn4 = () => (W11.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === BOT);
  var BELLY = ["vulva", "butt", "mouth"];
  var tellPage3 = (detail) => {
    try {
      W11.dispatchEvent(new W11.CustomEvent("farmhand-dispensary", { detail }));
    } catch (e) {
    }
  };
  function S2() {
    const s = st();
    if (!s.seed || typeof s.seed !== "object") s.seed = {};
    const o = s.seed;
    if (!o.h || typeof o.h !== "object") o.h = {};
    for (const h2 of SEED_HOLES) if (!o.h[h2] || typeof o.h[h2] !== "object") o.h[h2] = { ml: 0, by: {} };
    for (const k of ["from", "seals", "leak", "drip"]) if (!o[k] || typeof o[k] !== "object") o[k] = {};
    if (!Array.isArray(o.pend)) o.pend = [];
    if (typeof o.n !== "number") o.n = 0;
    if (typeof o.ml !== "number") o.ml = 0;
    if (typeof o.id !== "number") o.id = 0;
    if (typeof o.ep !== "string" || !o.ep) o.ep = Math.random().toString(36).slice(2, 10);
    return o;
  }
  var seedCap = () => Math.max(BASE_CAP, Number(S2().cap) || BASE_CAP);
  var bellyHeld = () => BELLY.reduce((a, h2) => a + (S2().h[h2].ml || 0), 0);
  var seedBelly = () => bellyFrom(bellyHeld(), seedCap());
  function addTo(h2, sire, ml) {
    if (!(ml > 0)) return;
    const x = S2().h[h2];
    x.ml += ml;
    x.by[sire] = (x.by[sire] || 0) + ml;
    const ks = Object.keys(x.by);
    if (ks.length > 8) {
      ks.sort((a, b) => x.by[a] - x.by[b]);
      for (const k of ks.slice(0, ks.length - 8)) delete x.by[k];
    }
  }
  function scaleTo(x, ml) {
    ml = Math.max(0, ml);
    if (ml < 0.5) {
      x.ml = 0;
      x.by = {};
      return;
    }
    const f = x.ml > 0 ? ml / x.ml : 0;
    for (const k of Object.keys(x.by)) x.by[k] *= f;
    x.ml = ml;
  }
  var topSire = (h2) => {
    const by = S2().h[h2].by;
    let best = 0, n = 0;
    for (const [k, v] of Object.entries(by)) if (v > n) {
      n = v;
      best = Number(k);
    }
    return best;
  };
  function nameFor(mn, nm) {
    if (!mn) return nm || "somebody";
    if (mn === me6()) return myName();
    const n = nameOf(mn);
    if (n && n !== "somebody") return n;
    const f = S2().from[mn];
    return f && f.nm || nm || "somebody";
  }
  var poss = (sire, nm) => !sire ? "somebody's" : sire === me6() ? "their own" : nameFor(sire, nm) + "'s";
  var holeList = (hs) => {
    const w = hs.map((h2) => SEED_WORD[h2]);
    return w.length < 2 ? w.join("") : w.slice(0, -1).join(", ") + " and " + w[w.length - 1];
  };
  var cap1 = (t) => String(t).replace(/^\s*(\S)/, (m, c) => m.slice(0, -1) + c.toUpperCase());
  function fillSeed(t, v) {
    v = v || {};
    return String(t).replace(/%t/g, myName()).replace(/%b/g, v.b || "somebody").replace(/%S/g, v.S || "somebody").replace(/%s/g, v.s || "somebody's").replace(/%a/g, v.a || "").replace(/%l/g, v.l || "a load").replace(/%h/g, v.h || "").replace(/%w/g, v.w || "").replace(/%g/g, v.g || "it").replace(/%x/g, v.x || "");
  }
  var said4 = {};
  function lineOf3(key2, v) {
    const L = LINES.seed && LINES.seed[key2];
    if (!L || !L.length) return "";
    let t = pick(L);
    if (L.length > 1 && t === said4[key2]) t = L[(L.indexOf(t) + 1) % L.length];
    said4[key2] = t;
    return cap1(fillSeed(t, v));
  }
  var AREAS = { vulva: ["thighs"], butt: ["thighs"], mouth: ["face"], nips: ["chest"] };
  function leak(h2, ml) {
    tellPage3({ type: "leak", mess: "cum", areas: AREAS[h2] || ["thighs"], amount: Math.max(0.6, Math.min(3, 0.6 + Math.log10(Math.max(1, ml) / 20))) });
  }
  function sealsNow() {
    const P = W11.Player, out = {};
    if (!P) return out;
    for (const s of sealsOn(P.Appearance, craftText)) {
      if (s.by !== me6() && !allowed(s.by)) continue;
      for (const h2 of s.holes) if (!out[h2]) out[h2] = { by: s.by, g: s.name, nm: s.maker };
    }
    return out;
  }
  function seedGive(o) {
    o = o || {};
    const sire = Number(o.sire) || Number(o.by) || me6(), by = Number(o.by) || sire, now = Date.now();
    if (sire !== me6() && !allowed(sire)) return { ok: false, why: "ladder" };
    const plan = seedPlan(seedDecode(o.p), { have: holesHave(), nipsOpen: nipsOpen() > 0, via: o.via, x: o.x, hole: o.hole });
    const holes = SEED_HOLES.filter((h2) => plan[h2] > 0);
    if (!holes.length) return { ok: false, why: "none" };
    const D = S2(), seals = sealsNow(), cap = seedCap(), here2 = botIn4();
    const f = D.from[sire] || (D.from[sire] = { n: 0, ml: 0, at: 0, nm: "" });
    if (o.nm) f.nm = String(o.nm).slice(0, 40);
    else if (!f.nm && sire !== me6() && nameOf(sire) !== "somebody") f.nm = nameOf(sire);
    const nc = Object.values(seals).some((s) => s.by !== sire);
    const kept = {}, spilt = {}, refused = [], held = [];
    const stage0 = bellyFrom(bellyHeld(), cap);
    for (const h2 of holes) {
      const ml = plan[h2], seal = seals[h2];
      if (seal && seal.by !== sire) {
        refused.push(h2);
        spilt[h2] = ml;
        continue;
      }
      const room = h2 === "nips" ? Math.max(0, NIP_CAP * (seal || toyIn(W11.Player) ? 2 : 1) - D.h.nips.ml) : seal ? Math.max(0, SEED_TOTAL_MAX - bellyHeld()) : Math.max(0, cap - bellyHeld());
      kept[h2] = Math.min(ml, room);
      spilt[h2] = ml - kept[h2];
      if (seal) held.push(h2);
      addTo(h2, sire, kept[h2]);
    }
    const went = holes.filter((h2) => !refused.includes(h2)), total = went.reduce((a, h2) => a + plan[h2], 0);
    if (went.length) {
      D.n += 1;
      D.ml += total;
      f.n += 1;
      f.ml += total;
      f.at = now;
      const ks = Object.keys(D.from);
      if (ks.length > 40) {
        ks.sort((a, b) => D.from[a].at - D.from[b].at);
        for (const k of ks.slice(0, ks.length - 40)) delete D.from[k];
      }
      for (const h2 of went) D.pend.push({ h: h2, ml: Math.round(plan[h2]), by: sire, at: now, nc: nc ? 1 : 0, here: here2 ? 1 : 0, nm: f.nm || void 0, via: o.via === "cock" ? "cock" : void 0 });
      if (D.pend.length > 60) D.pend = D.pend.slice(-60);
    }
    save();
    tellPage3({ type: "seed" });
    if (here2) sendSoon2();
    for (const h2 of holes) if (spilt[h2] >= 5) leak(h2, spilt[h2]);
    if (o.via === "breed") {
      if (went.length && !o.silent) local("\u{1F4A6} It left " + amountSay(total) + " of " + poss(sire, o.nm).replace(/^their own$/, "your own") + " seed in your " + holeList(went) + ".");
    } else if (!o.quiet) {
      const v = { b: nameFor(by), s: poss(sire, o.nm), g: o.g || "gear" }, parts2 = [];
      const open2 = o.via === "sip" ? "open_sip" : o.via === "kiss" ? "open_kiss" : o.via === "gear" ? "open_gear" : by === me6() ? "open_self" : "open_needle";
      parts2.push(lineOf3(open2, v));
      if (went.length) {
        const tier = total < 150 ? "s" : total < 1500 ? "m" : "l";
        parts2.push(went.length === 1 ? lineOf3(went[0] + "_" + tier, Object.assign({}, v, { a: amountSay(total), l: loadSay(total), h: SEED_WORD[went[0]] })) : lineOf3("many_" + tier, Object.assign({}, v, { a: amountSay(total), l: loadSay(total), w: holeList(went) })));
        const sp = went.filter((h2) => spilt[h2] >= 5);
        if (sp.length) {
          const h0 = sp.find((h2) => h2 === "vulva" || h2 === "butt") || sp[0], x = sp.reduce((a, h2) => a + spilt[h2], 0);
          parts2.push(lineOf3(h0 === "mouth" ? "spill_mouth" : h0 === "nips" ? "spill_nips" : "spill_hole", Object.assign({}, v, { x: amountSay(x), h: SEED_WORD[h0] })));
        }
        if (held.length) parts2.push(lineOf3("seal_hold", Object.assign({}, v, { g: seals[held[0]].g })));
      }
      if (refused.length) {
        const s0 = seals[refused[0]];
        parts2.push(lineOf3("seal_refuse", Object.assign({}, v, { g: s0.g, S: nameFor(s0.by, s0.nm) })));
      }
      const stage = bellyFrom(bellyHeld(), cap);
      if (stage > stage0 && stage >= 1) parts2.push(lineOf3(stage >= 4 ? "full_3" : stage >= 2 ? "full_2" : "full_1", v));
      const text3 = parts2.filter(Boolean).join(" ");
      if (text3) action(text3);
    }
    return { ok: went.length > 0, why: went.length ? "" : "sealed", kept, spilt, refused, holes: went, total };
  }
  var lastTick3 = 0;
  var lastStage = -1;
  function bare2(h2) {
    try {
      const P = W11.Player, I = W11.InventoryPrerequisiteMessage;
      if (typeof I !== "function") return false;
      if (h2 === "butt") return I(P, "AccessButt") === "" && !(P.IsButtChaste && P.IsButtChaste());
      return I(P, "AccessCrotch") === "" && I(P, "AccessVulva") === "" && !(P.IsVulvaChaste && P.IsVulvaChaste());
    } catch (e) {
      return false;
    }
  }
  function seedTick(now) {
    now = now || Date.now();
    const dt = lastTick3 ? Math.max(0, Math.min(now - lastTick3, 15 * MIN7)) : 0;
    lastTick3 = now;
    const D = S2(), seals = sealsNow(), here2 = botIn4(), room = inRoom();
    let dirty = false, sealSaid = false;
    for (const h2 of SEED_HOLES) {
      const was = D.seals[h2], is = seals[h2];
      if (is && (!was || was.by !== is.by || was.g !== is.g)) {
        D.seals[h2] = { by: is.by, g: is.g, nm: is.nm || "" };
        dirty = true;
        if (room && !sealSaid && h2 !== "nips") {
          sealSaid = true;
          action(lineOf3("seal_in", { g: is.g, S: nameFor(is.by, is.nm), h: SEED_WORD[h2] }));
        }
      } else if (!is && was) {
        delete D.seals[h2];
        dirty = true;
        const x = D.h[h2];
        if (x.ml >= 30 && h2 !== "mouth") {
          const out = Math.round(x.ml * 0.6), who2 = topSire(h2);
          scaleTo(x, x.ml - out);
          if (room) {
            action(lineOf3("seal_out", { g: was.g, a: amountSay(out), s: poss(who2, (D.from[who2] || {}).nm), h: SEED_WORD[h2] }));
            leak(h2, out);
          }
        }
      }
    }
    if (dt > 0) {
      const toys = toysNow(), N = holesNow().holes;
      for (const h2 of SEED_HOLES) {
        const x = D.h[h2];
        if (!(x.ml > 0)) continue;
        if (seals[h2] || (h2 === "vulva" || h2 === "butt") && toys[h2] || h2 === "nips" && toyIn(W11.Player)) continue;
        const n = (h2 === "vulva" || h2 === "butt") && N[h2] ? N[h2].now || 1 : 1;
        const hl = SEED_HALF_LIFE_H[h2] / (1 + GAPE_LEAK_X * (n - 1));
        const left = x.ml * Math.pow(0.5, dt / (hl * HOUR4)), out = x.ml - left;
        scaleTo(x, left);
        if ((h2 === "vulva" || h2 === "butt") && !here2) D.leak[h2] = (D.leak[h2] || 0) + out;
      }
    }
    if (!here2 && room) for (const h2 of ["vulva", "butt"]) {
      if ((D.leak[h2] || 0) < 25 || now - (D.drip[h2] || 0) < 9 * MIN7) continue;
      D.drip[h2] = now;
      const x = D.leak[h2];
      D.leak[h2] = 0;
      dirty = true;
      const who2 = topSire(h2), v = { s: poss(who2, (D.from[who2] || {}).nm), h: SEED_WORD[h2] };
      if (bare2(h2)) {
        action(lineOf3("drip_room", v));
        leak(h2, x);
      } else local(lineOf3("drip_mine", Object.assign({}, v, { s: v.s.replace(/^their own$/, "your own") })));
    }
    if (here2) {
      D.leak = {};
    }
    if (here2 && (D.pend.length || st().quick || D.fly && now - (D.fly.at || 0) > 6e4)) sendNow2();
    const stage = seedBelly();
    if (stage !== lastStage) {
      lastStage = stage;
      tellPage3({ type: "seed" });
    }
    if (dirty || dt > 0 && Math.random() < 0.05) save();
  }
  var sendT2 = null;
  function sendSoon2() {
    clearTimeout(sendT2);
    sendT2 = setTimeout(() => {
      try {
        sendNow2();
      } catch (e) {
      }
    }, 1500);
  }
  function sendNow2() {
    const D = S2();
    if (!botIn4() || typeof W11.ServerSend !== "function") return false;
    if (D.fly && Date.now() - (D.fly.at || 0) < 6e4) return false;
    if (!D.fly && (D.pend.length || st().quick)) {
      D.id += 1;
      D.fly = { id: D.id, loads: D.pend.slice(0, 30), at: 0, quick: takeQuick() || void 0 };
      D.pend = D.pend.slice(30);
    }
    const f = D.fly;
    if (!f) return false;
    const held = {};
    for (const h2 of SEED_HOLES) held[h2] = Math.round(D.h[h2].ml);
    try {
      W11.ServerSend("ChatRoomChat", makeMsg("dispSeed", { ep: D.ep, id: f.id, loads: f.loads, held, quick: f.quick || void 0 }, BOT));
    } catch (e) {
      return false;
    }
    f.at = Date.now();
    save();
    return true;
  }
  function fromFarm2(m) {
    const D = S2();
    if (Number(m.cap) > 0) D.cap = Math.min(6e4, Math.round(Number(m.cap)));
    const held = m.held;
    if (!D.fly && !D.pend.length && held && typeof held === "object") {
      for (const h2 of BELLY) {
        const v = Number(held[h2]);
        if (!(v >= 0) || !isFinite(v)) continue;
        const x = D.h[h2], was = x.ml;
        scaleTo(x, Math.min(SEED_TOTAL_MAX, v));
        if (v >= 1 && (!was || !Object.keys(x.by).length) && Number(m.by) > 0) {
          x.by = {};
          x.by[Number(m.by)] = x.ml;
        }
      }
      if (Number(m.by) > 0 && typeof m.nm === "string" && m.nm) {
        const f = D.from[Number(m.by)] || (D.from[Number(m.by)] = { n: 0, ml: 0, at: 0, nm: "" });
        if (!f.nm) f.nm = m.nm.slice(0, 40);
      }
      D.sync = Date.now();
    }
    save();
    tellPage3({ type: "seed" });
  }
  var carryWelcomeFn = null;
  function seedOnCarry(f) {
    carryWelcomeFn = f;
  }
  function seedWelcome(m) {
    if (m && m.seed && typeof m.seed === "object") fromFarm2(m.seed);
  }
  function onOk2(m) {
    const D = S2(), id = Number(m.id) || 0;
    if (D.fly && id >= D.fly.id) D.fly = null;
    if (m.none) {
      if (m.none !== D.no) {
        D.no = String(m.none).slice(0, 20);
        if (m.none === "breedable") local("\u{1F402} The farm girl didn't book that load: you're not breedable on her books. Say ?breedable on in her room if you want your loads to count there, and catch.");
      }
      save();
      return;
    }
    D.no = "";
    if (m.seed) fromFarm2(m.seed);
    if (m.carry) {
      try {
        carryWelcomeFn && carryWelcomeFn(m);
      } catch (e) {
      }
    }
    if (D.pend.length) sendSoon2();
  }
  function initSeed(mod2) {
    try {
      mod2.hookFunction("ChatRoomMessage", 11, (args, next2) => {
        try {
          const data = args[0];
          if (data && data.Type === "Hidden" && data.Sender === BOT) {
            const m = readMsg(data);
            if (m && m.type === "dispSeedOk") onOk2(m);
          }
        } catch (e) {
          console.warn("[Dispensary] seed:", e);
        }
        return next2(args);
      });
    } catch (e) {
      console.warn("[Dispensary] seed can't hear the farm girl:", e);
    }
    try {
      mod2.hookFunction("ChatRoomSync", 2, (args, next2) => {
        const r = next2(args);
        setTimeout(() => {
          try {
            sendNow2();
          } catch (e) {
          }
        }, 4500);
        return r;
      });
    } catch (e) {
    }
  }
  function seedInfo() {
    const D = S2(), cap = seedCap(), belly = bellyHeld(), held = {};
    for (const h2 of SEED_HOLES) {
      const x = D.h[h2], who2 = topSire(h2), s = D.seals[h2];
      held[h2] = { ml: Math.round(x.ml), who: who2 ? nameFor(who2, (D.from[who2] || {}).nm) : "", seal: s ? { by: s.by, g: s.g, name: nameFor(s.by, s.nm) } : null };
    }
    const top = Object.entries(D.from).sort((a, b) => b[1].n - a[1].n).slice(0, 5).map(([k, f]) => ({ by: Number(k), name: nameFor(Number(k), f.nm), n: f.n, ml: Math.round(f.ml) }));
    return {
      held,
      belly: Math.round(belly),
      cap,
      pct: Math.round(100 * belly / cap),
      stage: bellyFrom(belly, cap),
      loads: D.n,
      ml: Math.round(D.ml),
      top,
      waiting: D.pend.length + (D.fly ? D.fly.loads.length : 0),
      sync: D.sync || 0,
      no: D.no || ""
    };
  }
  function seedDrain() {
    const D = S2(), seals = sealsNow();
    let n = 0;
    for (const h2 of SEED_HOLES) {
      if (seals[h2]) continue;
      n += D.h[h2].ml;
      scaleTo(D.h[h2], 0);
    }
    save();
    tellPage3({ type: "seed" });
    return Math.round(n);
  }
  function seedMarkUp(since2) {
    const D = S2();
    let first = null;
    for (const l of D.pend.concat(D.fly ? D.fly.loads : [])) {
      if (l.up || !(l.at >= since2) || !(l.h === "vulva" || l.h === "butt")) continue;
      l.up = 1;
      if (!first) first = { who: l.by, nm: l.nm || "" };
    }
    if (first) save();
    return first;
  }
  var seedState = () => JSON.parse(JSON.stringify(S2()));
  var seedReset = () => {
    st().seed = {};
    lastTick3 = 0;
    lastStage = -1;
    for (const k of Object.keys(said4)) delete said4[k];
  };

  // dispensary/src/horny.js
  var W12 = window;
  var MIN8 = 6e4;
  var HORNY = /\b(horny|hungry|insatiable|ravenous)\b/;
  var RAVENOUS = /\b(insatiable|ravenous)\b/;
  var BREEDS = /\b(breeding|seeding|breeder)\b/;
  var hornyOf = (text3) => HORNY.test(String(text3 || "")) ? RAVENOUS.test(String(text3 || "")) ? 2 : 1 : 0;
  function whereOf(group) {
    const g = String(group || "");
    if (/^Item(Vulva|Butt)$/.test(g)) return "hole";
    if (/^ItemNipples/.test(g) || g === "ItemBreast") return "nips";
    if (/^ItemMouth/.test(g)) return "mouth";
    if (/^Item(Pelvis|VulvaPiercings|Torso|Torso2)$/.test(g)) return "crotch";
    return null;
  }
  var me7 = () => W12.Player && W12.Player.MemberNumber || 0;
  var okFrom2 = (by) => !by || by === me7() || allowed(by);
  var paused3 = () => (st().wornPause || 0) > Date.now();
  var hornyOn = () => st().hornyOn !== false;
  var onePiece = (n) => /[^s]s$/i.test(String(n).trim()) ? "pair of " + n : n;
  var nameOf2 = (it) => onePiece(it && it.Craft && it.Craft.Name || it && it.Asset && (it.Asset.Description || it.Asset.Name) || "it");
  var meter = () => {
    const A = W12.Player && W12.Player.ArousalSettings;
    return A && A.Active !== "Inactive" && A.Active !== "NoMeter" ? A : null;
  };
  function hornyGear() {
    const P = W12.Player, out = [];
    if (!P || !Array.isArray(P.Appearance)) return out;
    for (const item of P.Appearance) {
      if (!item || !item.Craft || !item.Asset || !item.Asset.Group) continue;
      const text3 = craftText(item), lvl = hornyOf(text3), where = whereOf(item.Asset.Group.Name);
      if (!lvl || !where) continue;
      out.push({ item, key: item.Asset.Group.Name + ":" + (item.Craft.Name || ""), text: text3, by: Number(item.Craft.MemberNumber) || 0, where, lvl, breed: BREEDS.test(text3) });
    }
    return out;
  }
  var deps = { nipsToyUsed: () => {
  } };
  var next = {};
  var gap = (lvl) => (lvl === 2 ? 2 + Math.random() * 2 : 6 + Math.random() * 4) * MIN8;
  var lineOf4 = (key2, v) => {
    const L = LINES.horny && LINES.horny[key2];
    return L && L.length ? fill(pick(L), v).replace(/%g/g, v && v.g || "it") : "";
  };
  var cumming = () => {
    const A = W12.Player && W12.Player.ArousalSettings;
    return !!(A && Number(A.OrgasmStage) > 0);
  };
  function hornyBeat(g) {
    const v = { g: nameOf2(g.item) };
    const A = meter();
    if (A) setArousal((Number(A.Progress) || 0) + (g.lvl === 2 ? 18 : 12));
    const room = Math.random() < 0.35;
    const t = room ? lineOf4(g.where + "_room", v) : lineOf4(g.where + (g.lvl === 2 ? "_rough" : "_mine"), v) || lineOf4(g.where + "_mine", v);
    if (t) room ? action(t) : local(t);
    if (g.where === "nips" && toyIn(W12.Player) === g.item) {
      try {
        deps.nipsToyUsed();
      } catch (e) {
      }
    }
    if (A && Number(A.Progress) >= 95 && !active("denial") && !cumming() && typeof W12.ActivityOrgasmPrepare === "function") {
      const l = lineOf4("tipped", v);
      if (l) action(l);
      try {
        W12.ActivityOrgasmPrepare(W12.Player);
      } catch (e) {
      }
    }
    return t;
  }
  function hornyTick(now) {
    now = now || Date.now();
    const gear = hornyOn() && !paused3() && inRoom() ? hornyGear().filter((g) => okFrom2(g.by)) : [];
    const on2 = new Set(gear.map((g) => g.key));
    for (const k of Object.keys(next)) if (!on2.has(k)) delete next[k];
    for (const g of gear) {
      if (!next[g.key]) {
        next[g.key] = now + gap(g.lvl) / 2;
        continue;
      }
      if (now < next[g.key]) continue;
      next[g.key] = now + gap(g.lvl);
      hornyBeat(g);
    }
  }
  var paraNext = {};
  function hornyParaTick(now) {
    now = now || Date.now();
    const P = deps.para ? deps.para() : {};
    for (const k of Object.keys(paraNext)) if (!P[k] || !P[k].horny) delete paraNext[k];
    if (!hornyOn() || paused3() || !inRoom()) return;
    for (const [kind, p] of Object.entries(P)) {
      if (!p || !p.horny || !(LINES.horny && LINES.horny["para_" + kind])) continue;
      if (!paraNext[kind]) {
        paraNext[kind] = now + (2 + Math.random() * 3) * MIN8;
        continue;
      }
      if (now < paraNext[kind]) continue;
      paraNext[kind] = now + (p.horny === 2 ? 2 + Math.random() * 2 : 4 + Math.random() * 3) * MIN8;
      const A = meter();
      if (A) setArousal((Number(A.Progress) || 0) + (p.horny === 2 ? 14 : 9));
      const t = lineOf4("para_" + kind, {});
      if (t) Math.random() < 0.3 ? action(t) : local(t);
      if (kind === "nips") {
        try {
          deps.nipsToyUsed();
        } catch (e) {
        }
      }
      if (A && Number(A.Progress) >= 95 && !active("denial") && !cumming() && typeof W12.ActivityOrgasmPrepare === "function") {
        const l = lineOf4("tipped_para", {});
        if (l) action(l);
        try {
          W12.ActivityOrgasmPrepare(W12.Player);
        } catch (e) {
        }
      }
    }
  }
  var LEAK = { hole: ["thighs"], mouth: ["face"], nips: ["chest"], crotch: ["thighs"] };
  function hornyClimax() {
    if (!hornyOn() || paused3()) return 0;
    let n = 0;
    for (const g of hornyGear()) {
      if (!g.breed || !okFrom2(g.by)) continue;
      const t = lineOf4("bred_" + g.where, { g: nameOf2(g.item) }) || lineOf4("bred_hole", { g: nameOf2(g.item) });
      if (t) action(t);
      try {
        W12.dispatchEvent(new W12.CustomEvent("farmhand-dispensary", { detail: { type: "leak", mess: "cum", areas: LEAK[g.where] || ["thighs"], amount: g.lvl === 2 ? 1.8 : 1.3 } }));
      } catch (e) {
      }
      try {
        breedSeed(g);
      } catch (e) {
      }
      n++;
    }
    return n;
  }
  var GEAR_HOLE = { ItemVulva: "vulva", ItemButt: "butt" };
  function breedSeed(g) {
    if (st().off && st().off.seed) return null;
    if (DOSE_WORDS.seed.test(g.text) && TRIGGERS.climax.test(g.text)) return null;
    const grp = g.item.Asset.Group.Name, hole2 = GEAR_HOLE[grp] || (g.where === "mouth" ? "mouth" : g.where === "nips" ? "nips" : "vulva");
    const a = seedAmounts(g.text);
    if (Object.keys(a).length === 1 && a.any === SEED_DEFAULT_ML && g.lvl === 2) a.any = 120;
    return seedGive({ by: g.by || me7(), sire: g.by || me7(), nm: g.item.Craft && g.item.Craft.MemberName, p: seedEncode(a), via: "breed", g: nameOf2(g.item), hole: hole2 });
  }
  function initHorny(mod2, d) {
    deps = Object.assign(deps, d || {});
    try {
      mod2.hookFunction("ActivityOrgasmStart", 3, (args, next2) => {
        try {
          const C2 = args[0];
          if (C2 && typeof C2.IsPlayer === "function" && C2.IsPlayer() && !W12.ActivityOrgasmRuined) setTimeout(() => hornyClimax(), 900);
        } catch (e) {
        }
        return next2(args);
      });
    } catch (e) {
    }
  }
  var hornyReset = () => {
    for (const k of Object.keys(next)) delete next[k];
  };

  // dispensary/src/parasites.js
  var W13 = window;
  var MIN9 = 6e4;
  var HOUR5 = 36e5;
  var KINDS = {
    lips: { label: "Parasite lips", icon: "\u{1F444}", words: /\bparasit\w*|\bparasite lips\b/, hours: 12, every: 30 },
    latex: { label: "Livin' latex", icon: "\u{1F5A4}", words: /\bliv(?:ing|in'?) latex\b|\bliving rubber\b|\blatex symbiote\b/, hours: 24, starve: 6 },
    moss: { label: "Milk moss", icon: "\u{1F331}", words: /\bmilk moss\b/, hours: 24, every: 40 },
    nestling: { label: "The nestling", icon: "\u{1F41B}", words: /\bnestling\b/, hours: 24, stages: 3 },
    brood: { label: "The brood mother", icon: "\u{1F95A}", words: /\bbrood ?mother\b|\bbrood queen\b/, hours: 24, every: 45 },
    vine: { label: "The leash vine", icon: "\u{1F33F}", words: /\bleash vine\b|\bvine leash\b/, worn: true, tiles: 3 },
    mouth: { label: "The mouthpiece", icon: "\u{1F5E3}\uFE0F", words: /\bmouth ?piece\b/, worn: true },
    nips: { label: "Nipple leeches", icon: "\u{1F352}", words: /\b(?:nipple|teat)[- ]?(?:leech|parasit|worm|tick)\w*|\bleech\w* (?:on|for) (?:the |your |her |his |their )?(?:nipples?|teats?)\b/, hours: 24, starve: 8 }
  };
  for (const K3 of Object.values(KINDS)) K3.words = loosen(K3.words);
  var kindIds = () => Object.keys(KINDS);
  var DEFAULT_STRAIN = ["needy", "heat", "hairtrigger"];
  var me8 = () => W13.Player && W13.Player.MemberNumber || 0;
  var charOf5 = (mn) => (W13.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn);
  var send = (type, data, to) => {
    try {
      if (typeof W13.ServerSend === "function") W13.ServerSend("ChatRoomChat", makeMsg(type, data, to));
      return true;
    } catch (e) {
      return false;
    }
  };
  var on = (kind) => !!(st().parasites && st().parasites[kind]);
  var usable = (id) => {
    const B = BOOK[id];
    return !!B && !B.instant && !B.lscgOnly && !(B.lscg && lscgPresent()) && !st().off[id];
  };
  function strainOf(text3) {
    const ids = dosesIn(text3).map((d) => d.id).filter((id) => usable(id));
    return ids.length ? ids.slice(0, 4) : DEFAULT_STRAIN.filter(usable);
  }
  var mine2 = () => st().para || (st().para = {});
  var line2 = (kind, which, v) => {
    const L = LINES.para && LINES.para[kind] && LINES.para[kind][which];
    return L && L.length ? fill(pick(L), v).replace(/%k/g, KINDS[kind].label.toLowerCase()) : "";
  };
  function latch(kind, o) {
    const K3 = KINDS[kind];
    if (!K3 || !on(kind)) return false;
    if (o.by && o.by !== me8() && !allowed(o.by)) return false;
    const P = mine2();
    if (P[kind]) return false;
    const now = Date.now();
    P[kind] = {
      by: o.by || 0,
      name: String(o.name || "").slice(0, 30),
      since: now,
      until: K3.worn ? 0 : now + K3.hours * HOUR5,
      strain: (o.strain || DEFAULT_STRAIN).filter((id) => BOOK[id]).slice(0, 4),
      fed: now,
      stage: 0,
      n: 0,
      eggs: 0,
      next: now + (K3.every || 30) * MIN9,
      horny: Math.max(0, Math.min(2, Math.round(Number(o.horny) || 0)))
    };
    save();
    action(line2(kind, "latch", { by: P[kind].name || "somebody" }));
    return true;
  }
  function letGo(kind, why) {
    const P = mine2();
    if (!P[kind]) return false;
    delete P[kind];
    save();
    if (why !== "quiet") {
      const l = line2(kind, why === "starved" ? "starved" : "off");
      if (l) local(l);
    }
    return true;
  }
  function wornParasites() {
    const P = W13.Player, out = [];
    if (!P || !Array.isArray(P.Appearance)) return out;
    for (const item of P.Appearance) {
      if (!item || !item.Craft) continue;
      const text3 = craftText(item);
      const kinds = kindIds().filter((kind) => KINDS[kind].words.test(text3)), own = kinds.filter((k) => k !== "lips");
      for (const kind of own.length ? own : kinds) out.push({ kind, item, text: text3, by: Number(item.Craft.MemberNumber) || 0, name: String(item.Craft.MemberName || "") });
    }
    return out;
  }
  function paraTick() {
    const now = Date.now(), P = mine2(), worn = wornParasites();
    if ((st().wornPause || 0) <= now) {
      for (const w of worn) if (!P[w.kind] && on(w.kind)) latch(w.kind, { by: w.by, name: w.name, strain: strainOf(w.text), horny: hornyOf(w.text) });
    }
    if (P.moss && active("letdown")) P.moss.fed = now;
    for (const kind of ["vine", "mouth"]) if (P[kind] && !worn.some((w) => w.kind === kind)) letGo(kind, "off");
    for (const [kind, p] of Object.entries(P)) {
      const K3 = KINDS[kind];
      if (!K3) {
        delete P[kind];
        continue;
      }
      if (p.until && now > p.until) {
        letGo(kind, "done");
        continue;
      }
      if (K3.starve && now - p.fed > K3.starve * HOUR5) {
        letGo(kind, "starved");
        continue;
      }
      if (!K3.every || now < p.next) continue;
      p.next = now + K3.every * MIN9 / (p.horny ? 2 : 1);
      if (!inRoom()) continue;
      if (kind === "lips") {
        const id = p.strain[p.n++ % Math.max(1, p.strain.length)] || "needy";
        give(id, { by: p.by, line: fill(line2("lips", "feed"), { dose: (BOOK[id] || {}).label || id }) });
        local(line2("lips", "crave"));
      }
      if (kind === "moss") give("letdown", { by: p.by, line: line2("moss", "feed") });
      if (kind === "brood") {
        p.eggs = Math.min(5, (p.eggs || 0) + 1);
        local(fill(line2("brood", "lay"), {}).replace(/%n/g, String(p.eggs)));
      }
      save();
    }
  }
  function paraClimax() {
    const P = mine2(), now = Date.now();
    if (P.latex) {
      P.latex.fed = now;
      P.latex.until = Math.min(P.latex.since + 72 * HOUR5, Math.max(P.latex.until, now + KINDS.latex.hours * HOUR5));
      give("hairtrigger", { by: P.latex.by, mins: 30, upto: true, quiet: active("hairtrigger"), line: line2("latex", "feed") });
    }
    if (P.nestling) {
      const n = P.nestling;
      n.fed = now;
      if (n.stage < KINDS.nestling.stages) {
        n.stage++;
        give("fillout", { by: n.by, p: "belly", x: n.stage, mins: 60, line: line2("nestling", "grow").replace(/%n/g, String(n.stage)) });
      } else give("fillout", { by: n.by, p: "belly", x: n.stage, mins: 60, upto: true, quiet: true });
    }
    save();
  }
  function nipsFed(from, kind) {
    const p = mine2().nips;
    if (!p) return false;
    const now = Date.now();
    p.fed = now;
    p.n = (p.n || 0) + 1;
    p.until = Math.min(p.since + 72 * HOUR5, Math.max(p.until || 0, now + KINDS.nips.hours * HOUR5));
    if (now - (p.gave || 0) > 10 * MIN9 && inRoom()) {
      p.gave = now;
      const id = p.strain[(p.n - 1) % Math.max(1, p.strain.length)] || "needy";
      give(id, { by: p.by, line: fill(line2("nips", "feed"), { dose: (BOOK[id] || {}).label || id }) });
    }
    if (p.n === 3) local(line2("nips", "wider"));
    save();
    return true;
  }
  var suckledAt = {};
  function paraSuckled(from) {
    const p = mine2().nips;
    if (!p || !from || from === me8() || Date.now() - (suckledAt[from] || 0) < 10 * MIN9) return false;
    suckledAt[from] = Date.now();
    send("dispPara", { kind: "nips", strain: p.strain, by: p.by || me8(), name: myName() }, from);
    return true;
  }
  function paraKissGiven(to) {
    const P = mine2();
    if (!to || to === me8()) return;
    if (P.lips) send("dispPara", { kind: "lips", strain: P.lips.strain, by: P.lips.by || me8(), name: myName(), horny: P.lips.horny || 0 }, to);
    if (P.brood && P.brood.eggs > 0) {
      P.brood.eggs--;
      save();
      send("dispPara", { kind: "lips", strain: P.brood.strain, by: me8(), name: myName(), brood: true }, to);
      local(line2("brood", "pass").replace(/%b/g, nameOf(to)));
    }
  }
  function onPara(from, m) {
    const kind = String(m.kind || "");
    if (!KINDS[kind] || KINDS[kind].worn) return;
    if (!on(kind) || !allowed(from)) return;
    const strain = Array.isArray(m.strain) ? m.strain.filter((id) => typeof id === "string" && BOOK[id]) : DEFAULT_STRAIN;
    latch(kind, { by: from, name: nameOf(from), strain, horny: m.horny });
  }
  function vineOk(X, Y) {
    const p = mine2().vine;
    if (!p) return true;
    const C2 = charOf5(p.by), pos = C2 && C2.MapData && C2.MapData.Pos;
    if (!pos || typeof pos.X !== "number") return true;
    return Math.max(Math.abs(X - pos.X), Math.abs(Y - pos.Y)) <= KINDS.vine.tiles;
  }
  var vineTold = 0;
  var asked = null;
  function onSay(from, m) {
    const p = mine2().mouth;
    if (!p || p.by !== from) return;
    const text3 = String(m.text || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 300);
    if (!text3 || /^[\/(\[]/.test(text3)) return;
    if (st().mouthAuto === true) {
      say3(text3);
      send("dispSaid", { ok: true }, from);
      return;
    }
    asked = { from, text: text3 };
    local("\u{1F5E3}\uFE0F " + nameOf(from) + `'s mouthpiece wants you to say: "` + text3 + '"\nSay it: /dispensary say \xB7 let it pass: /dispensary nope');
  }
  function say3(text3) {
    try {
      W13.ServerSend("ChatRoomChat", { Content: text3, Type: "Chat" });
    } catch (e) {
    }
  }
  function sayAsked(yes) {
    if (!asked) return false;
    const a = asked;
    asked = null;
    if (yes) say3(a.text);
    send("dispSaid", { ok: !!yes }, a.from);
    return true;
  }
  function mouthSend(to, text3) {
    return send("dispSay", { text: String(text3).slice(0, 300) }, to);
  }
  function initParasites(mod2) {
    try {
      mod2.hookFunction("ActivityOrgasmStart", 3, (args, next2) => {
        try {
          const C2 = args[0];
          if (C2 && typeof C2.IsPlayer === "function" && C2.IsPlayer()) setTimeout(() => paraClimax(), 600);
        } catch (e) {
        }
        return next2(args);
      });
    } catch (e) {
    }
    try {
      mod2.hookFunction("ChatRoomMapViewCanEnterTile", 2, (args, next2) => {
        const t = next2(args);
        try {
          if (t > 0 && !vineOk(args[0], args[1])) {
            if (Date.now() - vineTold > 2e4) {
              vineTold = Date.now();
              local(line2("vine", "tug"));
            }
            return 0;
          }
        } catch (e) {
        }
        return t;
      });
    } catch (e) {
      console.warn("[Dispensary] the leash vine can't hold you:", e);
    }
    try {
      mod2.hookFunction("ChatRoomMessage", 11, (args, next2) => {
        try {
          const data = args[0];
          if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me8()) {
            const m = readMsg(data);
            if (m && m.type === "dispPara") onPara(data.Sender, m);
            else if (m && m.type === "dispSay") onSay(data.Sender, m);
            else if (m && m.type === "dispSaid") local(nameOf(data.Sender) + (m.ok ? " said it." : " let it pass."));
          }
        } catch (e) {
          console.warn("[Dispensary] parasites:", e);
        }
        return next2(args);
      });
    } catch (e) {
      console.warn("[Dispensary] parasites can't hear:", e);
    }
  }

  // dispensary/src/needle.js
  var W14 = window;
  var botHere = () => (W14.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === BOT);
  var charOf6 = (mn) => (W14.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn) || (W14.Player && W14.Player.MemberNumber === mn ? W14.Player : null);
  function craftText(item) {
    if (!item || !item.Craft) return "";
    let d = item.Craft.Description || "";
    try {
      if (W14.CraftingDescription && typeof W14.CraftingDescription.Decode === "function") d = W14.CraftingDescription.Decode(d);
    } catch (e) {
    }
    return ((item.Craft.Name || "") + " | " + d).toLowerCase().replace(/_+/g, " ");
  }
  var handOf = (C2) => C2 && Array.isArray(C2.Appearance) ? C2.Appearance.find((it) => it && it.Asset && it.Asset.Group && it.Asset.Group.Name === "ItemHandheld") : null;
  var handTextOf = (mn) => craftText(handOf(charOf6(mn)));
  function factsOf(data, sender) {
    try {
      if (typeof W14.ChatRoomMessageRunExtractors === "function") {
        const m = W14.ChatRoomMessageRunExtractors(data, sender).metadata;
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
  function onNeedle(by, item, act) {
    const text3 = craftText(item), list = dosesOf(text3), at = Date.now(), done = [], later = isLater(text3);
    const maker = item && item.Craft && Number(item.Craft.MemberNumber) || 0, makerName = item && item.Craft && item.Craft.MemberName ? String(item.Craft.MemberName) : "";
    const via = /^(SipItem|EatItem)$/.test(act || "") ? "sip" : "needle", mine3 = W14.Player && W14.Player.MemberNumber || 0;
    for (const { id, x, p } of list) {
      const B = BOOK[id];
      if (farmHas(id, p) && botHere()) continue;
      if (B.lscg && lscgPresent()) continue;
      if (!allowed(by)) {
        local(fill(NOTES.notListed, { by: nameOf(by), dose: B.label }));
        continue;
      }
      const sire = maker || by;
      if (id === "seed" && sire !== mine3 && !allowed(sire)) {
        local(fill(NOTES.notListed, { by: makerName || nameOf(sire), dose: B.label }));
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
        const r = give(id, { by, x, p, sire, nm: makerName, via });
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
      mod2.hookFunction("ChatRoomMessage", 1, (args, next2) => {
        try {
          const data = args[0], P = W14.Player;
          if (data && data.Type === "Activity" && P && typeof data.Sender === "number") {
            const sender = charOf6(data.Sender) || (data.Sender === P.MemberNumber ? P : null), f = factsOf(data, sender);
            if (/^(Inject|SipItem|EatItem)$/.test(f.name || "") && f.target === P.MemberNumber && sender) onNeedle(data.Sender, handOf(sender), f.name);
            if (f.target === P.MemberNumber && data.Sender !== P.MemberNumber) onActivity(f.name, data.Sender);
            if (data.Sender === P.MemberNumber && typeof f.target === "number" && f.target !== P.MemberNumber && /^(Kiss|FrenchKiss|PoliteKiss|GaggedKiss|SiblingsCheekKiss)$/.test(f.name || "")) paraKissGiven(f.target);
          }
        } catch (e) {
          console.warn("[Dispensary] needle:", e);
        }
        return next2(args);
      });
    } catch (e) {
      console.warn("[Dispensary] can't feel needles:", e);
    }
  }

  // dispensary/src/hardcore.js
  var W15 = window;
  var DAY7 = 864e5;
  var CHECK_DAYS = 30;
  var me9 = () => W15.Player && W15.Player.MemberNumber || 0;
  var here = (mn) => (W15.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === mn);
  var who = (mn) => here(mn) ? nameOf(mn) : "#" + mn;
  var onChange = () => {
  };
  function onHardChange(f) {
    onChange = f;
  }
  var hardOn = () => !!(st().hard && st().hard.on);
  function keyholders() {
    const P = W15.Player, out = [];
    const own = P && P.Ownership && P.Ownership.MemberNumber;
    if (typeof own === "number" && own > 0 && own !== me9()) out.push(own);
    if (st().stock) {
      for (const m of PROPRIETORS) if (m !== me9() && !out.includes(m)) out.push(m);
    }
    for (const m of st().keys || []) if (m !== me9() && !out.includes(m)) out.push(m);
    return out;
  }
  var MAX_KEYS = 10;
  function addKey(mn) {
    mn = Math.round(Number(mn));
    if (hardOn()) return { ok: false, why: "locked" };
    if (!Number.isInteger(mn) || mn <= 0 || mn >= 1e9) return { ok: false, why: "number" };
    if (mn === me9()) return { ok: false, why: "self" };
    const S3 = st();
    S3.keys = S3.keys || [];
    if (S3.keys.includes(mn) || keyholders().includes(mn)) return { ok: false, why: "already" };
    if (S3.keys.length >= MAX_KEYS) return { ok: false, why: "full" };
    S3.keys.push(mn);
    save();
    onChange();
    return { ok: true };
  }
  function removeKey(mn) {
    if (hardOn()) return { ok: false, why: "locked" };
    const S3 = st(), i = (S3.keys || []).indexOf(Number(mn));
    if (i < 0) return { ok: false, why: "none" };
    S3.keys.splice(i, 1);
    save();
    onChange();
    return { ok: true };
  }
  var companion = () => {
    try {
      const C2 = W15.FarmhandCompanion;
      return C2 && typeof C2.hardPrefs === "function" ? C2 : null;
    } catch (e) {
      return null;
    }
  };
  var isKey = (mn) => typeof mn === "number" && keyholders().includes(mn);
  function dueAt() {
    const H2 = st().hard || {};
    return H2.until ? H2.until : (H2.checkAt || H2.since || Date.now()) + CHECK_DAYS * DAY7;
  }
  function log(by, what2) {
    const H2 = st().hard;
    H2.log = (H2.log || []).concat({ t: Date.now(), by, what: String(what2).slice(0, 200) }).slice(-50);
  }
  var hardLog = () => (st().hard && st().hard.log || []).slice();
  function sendTo(mn, type, data) {
    try {
      if (here(mn) && typeof W15.ServerSend === "function") {
        W15.ServerSend("ChatRoomChat", makeMsg(type, data, mn));
        return true;
      }
    } catch (e) {
    }
    return false;
  }
  function beepTo(mn, text3) {
    try {
      if (typeof W15.ServerSend === "function") {
        W15.ServerSend("AccountBeep", { MemberNumber: mn, BeepType: "", Message: String(text3).slice(0, 900) });
        return true;
      }
    } catch (e) {
    }
    return false;
  }
  function announce() {
    const H2 = st().hard || {}, keys = keyholders();
    for (const k of keys) sendTo(k, "dispHard", { on: hardOn(), until: H2.until || 0, due: hardOn() ? dueAt() : 0, keys, name: W15.Player && (W15.Player.Nickname || W15.Player.Name) || "" });
  }
  function lock(days) {
    if (hardOn()) return { ok: false, why: "on" };
    if (!keyholders().length) return { ok: false, why: "nokey" };
    const now = Date.now(), d = Math.max(0, Math.min(CHECK_DAYS, Math.round(Number(days) || 0)));
    st().hard = { on: true, since: now, until: d ? now + d * DAY7 : 0, checkAt: now, log: st().hard && st().hard.log || [] };
    log(me9(), d ? "locked in for " + d + " day" + (d === 1 ? "" : "s") : "locked in, no end date");
    save(true);
    announce();
    onChange();
    return { ok: true };
  }
  function unlock(by, why) {
    if (!hardOn()) return false;
    const H2 = st().hard;
    H2.on = false;
    H2.until = 0;
    log(by, "hardcore off: " + why);
    save(true);
    announce();
    onChange();
    local("\u{1F513} Hardcore's off (" + why + "). Your settings are yours again, and so is your safeword.");
    return true;
  }
  function checkIn(by) {
    if (!hardOn() || !isKey(by)) return false;
    const H2 = st().hard, now = Date.now(), last = H2.checkAt || 0;
    H2.checkAt = now;
    if (now - last > DAY7) log(by, "checked in");
    save();
    onChange();
    return true;
  }
  function tickHard() {
    if (!hardOn()) return;
    const H2 = st().hard, now = Date.now();
    if (H2.until && now >= H2.until) unlock(me9(), "the end date came");
    else if (!H2.until && now - (H2.checkAt || H2.since || now) >= CHECK_DAYS * DAY7) unlock(0, CHECK_DAYS + " days without a keyholder checkin' in");
  }
  var askedAt2 = 0;
  function askOut() {
    const now = Date.now(), keys = keyholders(), name = W15.Player && (W15.Player.Nickname || W15.Player.Name) || "Somebody";
    if (now - askedAt2 < 5 * 6e4) {
      local("\u{1F5DD}\uFE0F Your keyholders have already been asked. Your doses stay till one of them lets you out.");
      return 0;
    }
    askedAt2 = now;
    let n = 0;
    for (const k of keys) {
      if (sendTo(k, "dispAsk", { name })) n++;
      else if (beepTo(k, "\u{1F5DD}\uFE0F " + name + " (" + me9() + ") is askin' to be let out of hardcore in The Farmhand's Dispensary. If you've the Dispensary, open its page (Keys you hold); with the Companion, /keys letout " + me9() + ".")) n++;
    }
    log(me9(), "asked to be let out");
    save();
    local("\u{1F5DD}\uFE0F Hardcore: your doses stay. " + (n ? "Your keyholders have been asked to let you out: " + keys.map(who).join(", ") + "." : "None of your keyholders could be reached just now."));
    return n;
  }
  function onKey(by, m) {
    if (!isKey(by) || !m || typeof m !== "object") return false;
    const H2 = st().hard, nm = who(by);
    if (m.do === "check") {
      if (checkIn(by)) sendTo(by, "dispHard", { on: true, until: H2.until || 0, due: dueAt(), keys: keyholders(), name: W15.Player && (W15.Player.Nickname || W15.Player.Name) || "" });
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
      H2.until = d ? Date.now() + d * DAY7 : 0;
      H2.checkAt = Date.now();
      log(by, d ? "set the end to " + d + " day" + (d === 1 ? "" : "s") + " from now" : "took the end date away");
      save();
      local("\u{1F5DD}\uFE0F " + nm + " " + (d ? "set your hardcore to end in " + d + " day" + (d === 1 ? "" : "s") + "." : "took your end date away. A keyholder checks in every " + CHECK_DAYS + " days instead."));
      onChange();
      return true;
    }
    if (m.do === "set") {
      const S3 = st(), said5 = [];
      if (typeof m.who === "string" && LADDER.some((r) => r.id === m.who) && m.who !== S3.who) {
        S3.who = m.who;
        said5.push("who can dose you: " + LADDER.find((r) => r.id === m.who).label);
      }
      if ((m.clock === "real" || m.clock === "online") && m.clock !== S3.clock) {
        setClock(m.clock);
        said5.push("the clock: " + (m.clock === "real" ? "real time" : "while online"));
      }
      if (m.off && typeof m.off === "object") {
        for (const id of doseIds()) if (typeof m.off[id] === "boolean" && !!S3.off[id] !== m.off[id]) {
          if (m.off[id]) S3.off[id] = true;
          else delete S3.off[id];
          said5.push(id + (m.off[id] ? " switched off" : " switched on"));
        }
      }
      if (m.companion && typeof m.companion === "object" && companion()) {
        try {
          said5.push(...companion().setHardPrefs(m.companion));
        } catch (e) {
        }
      }
      if (!said5.length) return true;
      log(by, "changed " + said5.join(", "));
      save();
      checkIn(by);
      onChange();
      local("\u{1F5DD}\uFE0F " + nm + " changed your Dispensary: " + said5.join("; ") + ".");
      sendTo(by, "dispKeyState", stateFor());
      return true;
    }
    return false;
  }
  function stateFor() {
    const S3 = st();
    let comp = null;
    try {
      comp = companion() ? companion().hardPrefs() : null;
    } catch (e) {
      comp = null;
    }
    return { who: S3.who, clock: S3.clock, off: Object.assign({}, S3.off), doses: doseIds().filter(active).map((id) => ({ id, left: leftMs(id) })), until: S3.hard && S3.hard.until || 0, due: dueAt(), companion: comp };
  }
  var wards = () => st().wards || (st().wards = {});
  function onWardHard(from, m) {
    if (!Array.isArray(m.keys) || !m.keys.includes(me9())) return;
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
  function keyDo(mn, what2, data) {
    if (sendTo(mn, "dispKey", Object.assign({ do: what2 }, data || {}))) return "room";
    const words = { check: "checked in on your hardcore", letout: "let you out: every dose lifted", end: "ended your hardcore" };
    if (!words[what2]) return null;
    const nm = W15.Player && (W15.Player.Nickname || W15.Player.Name) || "Your keyholder";
    return beepTo(mn, "\u{1F5DD}\uFE0F " + nm + " " + words[what2] + ". [fd:" + what2 + "]") ? "beep" : null;
  }
  function initHardcore(mod2) {
    try {
      mod2.hookFunction("ChatRoomMessage", 11, (args, next2) => {
        try {
          const data = args[0];
          if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me9()) {
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
        return next2(args);
      });
    } catch (e) {
      console.warn("[Dispensary] keyholders can't reach you:", e);
    }
    try {
      mod2.hookFunction("ServerAccountBeep", 11, (args, next2) => {
        try {
          const d = args[0], t = d && typeof d.Message === "string" ? /\s*\[fd:(check|letout|end)\]\s*$/.exec(d.Message) : null;
          if (t) {
            if (isKey(d.MemberNumber)) onKey(d.MemberNumber, { do: t[1] });
            d.Message = d.Message.slice(0, t.index);
          }
        } catch (e) {
        }
        return next2(args);
      });
    } catch (e) {
    }
    try {
      mod2.hookFunction("ChatRoomSync", 11, (args, next2) => {
        const r = next2(args);
        setTimeout(() => {
          if (hardOn()) announce();
        }, 3e3);
        return r;
      });
    } catch (e) {
    }
  }

  // dispensary/src/lscg.js
  var W16 = window;
  var api2 = null;
  var caps = null;
  var syncing = null;
  var REG = {};
  var lastLscg = {};
  var ours4 = (id) => LSCG_ID + "." + id;
  var minsLeft = (id) => Math.ceil(leftMs(id) / 6e4);
  var BREATH_MINS = 10;
  function lscgPresent() {
    if (W16.LSCG) return true;
    try {
      const sdk = W16.bcModSdk;
      if (sdk && typeof sdk.getModsInfo === "function") return sdk.getModsInfo().some((m) => m && m.name === "LSCG");
    } catch (e) {
    }
    return false;
  }
  var lscgApi2 = () => !!(api2 && caps && caps.has("drugs"));
  var lscgHas = (id) => lscgApi2() && !!REG[id];
  var lastLscgDose = (id) => lastLscg[id] || 0;
  function lscgDose(type, o) {
    if (!lscgApi2()) return false;
    o = o || {};
    try {
      return !!api2.drugs.dose(type, { multiplier: Math.max(0.2, Math.min(3, Number(o.x) || 1)), method: o.method || "inject", sender: o.by, minigame: false });
    } catch (e) {
      return false;
    }
  }
  function lscgShow(id, by) {
    if (!lscgHas(id) || syncing) return;
    syncing = id;
    try {
      api2.drugs.dose(ours4(id), { multiplier: 1, method: "inject", sender: by || void 0, minigame: false });
    } catch (e) {
    } finally {
      syncing = null;
    }
  }
  function setUp(L) {
    try {
      api2 = L.getModApi({ id: LSCG_ID, name: "The Farmhand's Dispensary", version: VERSION });
    } catch (e) {
      api2 = null;
      return;
    }
    caps = L.capabilities || /* @__PURE__ */ new Set();
    if (caps.has("drugs")) {
      for (const [id, B] of Object.entries(BOOK)) {
        if (B.lscg || B.instant || B.noLscg || REG[id]) continue;
        try {
          api2.drugs.register({
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
              const text3 = typeof ctx.sender === "number" ? handTextOf(ctx.sender) : "", p = partFor(id, text3) || void 0;
              if (text3 && isLater(text3)) {
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
    try {
      nipsLscg(api2, caps);
    } catch (e) {
      console.warn("[Dispensary] LSCG nipple actions:", e);
    }
    if (caps.has("events")) {
      try {
        api2.events.on("safeword", () => {
          if (hardOn()) askOut();
          else clearAll("safeword");
        });
      } catch (e) {
      }
      try {
        api2.events.before("drug.beforeApply", (c) => {
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
    const q = W16.LSCG_OnLoad = W16.LSCG_OnLoad || [];
    q.push((L) => {
      try {
        setUp(L);
      } catch (e) {
        console.warn("[Dispensary] LSCG hookup:", e);
      }
    });
  }

  // dispensary/src/lines-kits.js
  LINES.kits = {
    start_plain: [
      "%b's %k kit starts puttin' itself on %t, one piece at a time.",
      "%t feels the first tug: %b's %k is on its way onto them, whether they like it or not.",
      "Somethin' clicks into place on %t. %b's %k kit has started dressin' them."
    ],
    piece_plain: [
      "The %g slides into place on %t, snug and certain.",
      "%t's %g settles on them, neat as if somebody'd put it there by hand.",
      "Another piece: the %g, fittin' itself onto %t.",
      "The %g buckles itself on %t without anybody touchin' it."
    ],
    back_plain: [
      "The %g's back on %t again, quick as it came off.",
      "%t takes it off, and the %g just puts itself right back.",
      "The %g creeps back onto %t. The kit isn't done with them."
    ],
    done_plain: [
      "%t's all done up in %k now, every piece in place. It'll stay that way a while.",
      "The last piece settles. %t's wearin' the whole of %k, and it isn't comin' off till it's done."
    ],
    off_plain: [
      "The %k kit lets go of %t, and their own clothes slip back on where it was.",
      "%k comes away from %t piece by piece, and their old outfit's back on them, as if it never left."
    ],
    start_living: [
      "Somethin' slick and warm starts to move on %t's skin. %b's %k is alive, and it's crawlin' on.",
      "%t shivers: %b's %k kit wakes up and starts to creep over them, wet and eager.",
      "It's breathin'. %b's %k slithers onto %t one piece at a time, like it's been waitin' for them."
    ],
    piece_living: [
      "The %g oozes up %t's body and sets, glossy and tight, then gives a little squeeze.",
      "The %g wraps itself round %t, slick and throbbin', and shrinks to fit.",
      "A wet sound, and the %g's on %t: it crawled there by itself, and now it's pulsin' gently.",
      "The %g slides over %t like warm syrup and hardens snug, still twitchin'.",
      "The %g squirms into place on %t and settles with a satisfied little shiver."
    ],
    back_living: [
      "The %g crawls right back onto %t, slick and stubborn. It likes it there.",
      "%t peels the %g off, and it oozes straight back on, tighter than before.",
      "The %g slithers back up %t's skin. It's not lettin' go of them."
    ],
    done_living: [
      "%t's covered now: the whole of %k is on them, warm and breathin', squeezin' now and then like it's alive. It is.",
      "The last of %k seals over %t with a wet kiss. All of it's alive, and all of it's holdin' on."
    ],
    off_living: [
      "%k goes still, then slides off %t in slow, wet sheets, and their own clothes are back on underneath.",
      "The livin' %k lets go of %t with a reluctant shiver and crawls away, leavin' their old outfit on them."
    ],
    start_demon: [
      "A red glow sparks on %t's skin, and %b's %k answers it: the curse is takin' hold, a piece at a time.",
      "%t hears somethin' laugh, low and cruel. %b's %k has been called, and it's comin' for them.",
      "Sigils flare along %t's arms. %b's cursed %k starts bindin' itself to them."
    ],
    piece_demon: [
      `The %g burns into place on %t, sigils glowin' along its edges, and somethin' whispers "mine".`,
      "Red light snaps tight round %t, and when it fades the %g's on them, warm as a brand.",
      "The %g locks onto %t with a hiss of brimstone. A voice in their ear purrs how good it looks on them.",
      "The %g appears on %t in a curl of black smoke, already too tight, already theirs.",
      "A sigil sears onto %t's skin, and the %g settles over it, humming with somethin' that isn't kind."
    ],
    back_demon: [
      "The %g flares back onto %t in a flash of red. The curse laughs at them for tryin'.",
      "%t takes the %g off, and the sigils pull it straight back, burnin' hotter for the cheek.",
      'The %g reappears on %t with a cruel little chuckle in their ear: "no."'
    ],
    done_demon: [
      "%t's bound in the whole of %k now, every sigil glowin'. The curse settles in to enjoy itself.",
      "The last piece of %k burns into place. Somethin' sighs, pleased, inside %t's head. They're its, for now."
    ],
    off_demon: [
      "The sigils on %t gutter and go out, and %k crumbles away to ash. Their own clothes are back on, a little scorched round the edges.",
      "The curse lets go of %t with a disappointed hiss, and %k is gone, their old outfit on them again."
    ],
    start_brain: [
      "A soft hum fills %t's head. %b's %k kit is goin' on them, and part of them is already noddin' along.",
      "%t's thoughts go slow and syrupy. %b's %k is dressin' them, and it feels so right to let it.",
      `"Good. Hold still," whispers somethin' only %t can hear, and %b's %k begins.`
    ],
    piece_brain: [
      "The %g goes on %t, and their eyes go a little glassier with it.",
      "%t helps the %g on without meanin' to. It feels like the right thing to do.",
      "The %g settles on %t, and a soft voice tells them how much better they look already.",
      "The %g clicks into place on %t, and another thought of their own floats away.",
      "%t holds still for the %g. Stillness feels nice. Obedience feels nicer."
    ],
    back_brain: [
      "%t blinks. The %g's back on them, and they don't remember puttin' it there.",
      "%t takes the %g off, then puts it right back on, smilin' vaguely. That's where it goes.",
      `"Ah ah," murmurs the voice, and %t's own hands put the %g back on.`
    ],
    done_brain: [
      "%t's wearin' the whole of %k now, eyes soft and empty. The hum in their head says they look perfect.",
      "The last piece settles, and so does %t: dressed in %k, calm and blank and very, very obedient."
    ],
    off_brain: [
      "The hum fades, and %k comes off %t. They blink at their own clothes, back on them, and can't quite remember the last little while.",
      "%t wakes up out of it, dressed as they were before %k. Bits of it are still hummin' at the back of their head."
    ],
    missing: [
      "The kit called %k can't be found: %b's Dispensary didn't send it (they might be gone, or not have it any more)."
    ],
    missing_own: [
      "You've no kit called %k saved: /dispensary kit save <name> keeps what you're wearin', or save it in LSCG."
    ],
    nothing: [
      "The %k kit has nothin' in it that's allowed to go on you (your Kits settin' picks clothes, restraints or both)."
    ]
  };

  // dispensary/src/kits.js
  var W17 = window;
  var SPEEDS = { slow: 60, steady: 30, fast: 10, now: 0 };
  var SPEED_NAMES = { slow: "a piece a minute", steady: "a piece every half minute", fast: "a piece every ten seconds", now: "all at once" };
  var KIT_RE = /\bkit\s*:\s*([a-z0-9][^|,.;!?\n]{0,39})/;
  var kitKeyOf = (text3) => {
    const m = KIT_RE.exec(String(text3 || "").toLowerCase());
    return m ? m[1].trim().replace(/\s+/g, " ") : "";
  };
  var FLAVOURS = [
    ["living", /\b(living|livin'?|alive|symbiot\w*|tentacle\w*|slime\w*|latex)\b/],
    ["demon", /\b(demon\w*|cursed|enchanted|infernal|hell\w*|sigil\w*|succubus)\b/],
    ["brain", /\b(brainwash\w*|hypno\w*|mind\w*|conditioning|trance)\b/]
  ];
  var flavourOf = (text3) => {
    const t = String(text3 || "").toLowerCase(), f = FLAVOURS.filter(([, re]) => re.test(t)).map(([k]) => k);
    return f.length ? f.join("+") : "plain";
  };
  var kitPart = (text3) => {
    const k = kitKeyOf(text3);
    return k ? k + "#" + flavourOf(text3) : "";
  };
  var splitPart = (p) => {
    const i = String(p || "").lastIndexOf("#");
    return i > 0 ? { key: p.slice(0, i), flav: p.slice(i + 1) } : { key: String(p || ""), flav: "plain" };
  };
  var what = () => ["clothes", "binds", "both"].includes(st().kitWhat) ? st().kitWhat : "both";
  var speedOf = () => SPEEDS[st().kitSpeed] != null ? SPEEDS[st().kitSpeed] : SPEEDS.steady;
  var me10 = () => W17.Player && W17.Player.MemberNumber || 0;
  var send2 = (type, data, to) => {
    try {
      if (typeof W17.ServerSend === "function") W17.ServerSend("ChatRoomChat", makeMsg(type, data, to));
      return true;
    } catch (e) {
      return false;
    }
  };
  var LZ = () => W17.LZString;
  var pack = (bundle) => {
    try {
      return LZ().compressToBase64(JSON.stringify(bundle));
    } catch (e) {
      return "";
    }
  };
  var unpack = (code) => {
    try {
      const b = JSON.parse(LZ().decompressFromBase64(String(code || "")));
      return Array.isArray(b) ? b.filter((i) => i && typeof i.Group === "string" && typeof i.Name === "string") : null;
    } catch (e) {
      return null;
    }
  };
  var groupOf = (name) => {
    try {
      return typeof W17.AssetGroupGet === "function" && W17.AssetGroupGet("Female3DCG", name) || W17.AssetGroupMap && W17.AssetGroupMap.get(name) || null;
    } catch (e) {
      return null;
    }
  };
  function kindOfGroup(g) {
    if (!g || g.BodyCosplay || g.AllowCustomize === false) return null;
    if (g.Category === "Item") return "binds";
    if (g.Category === "Appearance" && g.Clothing) return "clothes";
    return null;
  }
  var wanted = (gname) => {
    const k = kindOfGroup(groupOf(gname));
    return !!k && (what() === "both" || what() === k);
  };
  var itemIn2 = (group) => W17.Player && Array.isArray(W17.Player.Appearance) ? W17.Player.Appearance.find((i) => i && i.Asset && i.Asset.Group && i.Asset.Group.Name === group) : null;
  var lockedOn = (it) => !!(it && it.Property && it.Property.LockedBy);
  function wornBundle() {
    const P = W17.Player;
    if (!P || !Array.isArray(P.Appearance)) return [];
    return P.Appearance.filter((i) => i && i.Asset && i.Asset.Group && kindOfGroup(i.Asset.Group)).map((i) => {
      const b = { Group: i.Asset.Group.Name, Name: i.Asset.Name };
      if (i.Color != null) b.Color = i.Color;
      if (i.Difficulty != null) b.Difficulty = i.Difficulty;
      if (i.Craft) b.Craft = i.Craft;
      if (i.Property) {
        try {
          b.Property = typeof W17.ItemPropertiesCompress === "function" ? W17.ItemPropertiesCompress(i) : JSON.parse(JSON.stringify(i.Property));
        } catch (e) {
          b.Property = JSON.parse(JSON.stringify(i.Property));
        }
      }
      return b;
    });
  }
  var lscgOutfits = () => {
    try {
      const L = W17.LSCG;
      return L && typeof L.Outfits === "function" ? L.Outfits() : null;
    } catch (e) {
      return null;
    }
  };
  function kitNames() {
    const own = Object.keys(st().kits || {}), C2 = lscgOutfits();
    let lscg = [];
    try {
      lscg = C2 && typeof C2.GetOutfitNames === "function" ? C2.GetOutfitNames() : C2 && typeof C2.GetOutfitKeys === "function" ? C2.GetOutfitKeys() : [];
    } catch (e) {
      lscg = [];
    }
    return { own, lscg };
  }
  function kitLookup(key2) {
    key2 = String(key2 || "").toLowerCase().trim();
    if (!key2) return null;
    const own = (st().kits || {})[key2];
    if (own) return unpack(own);
    const C2 = lscgOutfits();
    try {
      if (C2 && C2.GetOutfit(key2)) {
        const b = C2.GetOutfitBundle(key2);
        return Array.isArray(b) ? b : null;
      }
    } catch (e) {
    }
    return null;
  }
  function kitSave(name) {
    const key2 = String(name || "").toLowerCase().trim().replace(/\s+/g, " ").slice(0, 40);
    if (!key2) return { ok: false, why: "name" };
    const S3 = st();
    S3.kits = S3.kits || {};
    if (!S3.kits[key2] && Object.keys(S3.kits).length >= 8) return { ok: false, why: "full" };
    const b = wornBundle();
    if (!b.length) return { ok: false, why: "empty" };
    const code = pack(b);
    if (!code || code.length > 12e3) return { ok: false, why: "big" };
    S3.kits[key2] = code;
    save();
    return { ok: true, key: key2, n: b.length };
  }
  function kitDelete(name) {
    const S3 = st(), key2 = String(name || "").toLowerCase().trim();
    if (!S3.kits || !S3.kits[key2]) return false;
    delete S3.kits[key2];
    save();
    return true;
  }
  function onAsk(from, m) {
    const key2 = String(m.key || "").slice(0, 40), b = kitLookup(key2);
    const clean2 = b ? b.filter((i) => kindOfGroup(groupOf(i.Group))) : null;
    send2("dispKit", clean2 && clean2.length ? { key: key2, code: pack(clean2) } : { key: key2, none: true }, from);
  }
  var K2 = () => st().kit || null;
  var waiting2 = null;
  var lineOf5 = (key2, flav, v) => {
    const L = LINES.kits || {}, pools = String(flav || "plain").split("+").map((f) => L[key2 + "_" + f]).filter((p) => p && p.length);
    const pool = pools.length ? pools[Math.floor(Math.random() * pools.length)] : L[key2 + "_plain"] || [];
    return pool.length ? fill(pick(pool), { by: v && v.by || "somebody" }).replace(/%g/g, v && v.g || "it").replace(/%k/g, v && v.k || "the kit") : "";
  };
  var onePiece2 = (n) => /[^s]s$/i.test(String(n).trim()) ? "pair of " + n : n;
  var pieceName = (b) => {
    try {
      const A = W17.AssetGet("Female3DCG", b.Group, b.Name);
      return onePiece2(String(b.Craft && b.Craft.Name || A && (A.Description || A.Name) || b.Name).toLowerCase());
    } catch (e) {
      return String(b.Name).toLowerCase();
    }
  };
  function update(group) {
    try {
      if (group && typeof W17.ChatRoomCharacterItemUpdate === "function") W17.ChatRoomCharacterItemUpdate(W17.Player, group);
      else if (typeof W17.ChatRoomCharacterUpdate === "function") W17.ChatRoomCharacterUpdate(W17.Player);
    } catch (e) {
    }
  }
  function refresh() {
    try {
      if (typeof W17.CharacterRefresh === "function") W17.CharacterRefresh(W17.Player, false);
    } catch (e) {
    }
  }
  function putOn(b, by) {
    const P = W17.Player;
    if (!P || typeof W17.InventoryWear !== "function" || typeof W17.AssetGet !== "function") return false;
    const A = W17.AssetGet("Female3DCG", b.Group, b.Name);
    if (!A || !wanted(b.Group)) return false;
    const cur = itemIn2(b.Group);
    if (cur && cur.Asset.Name === b.Name) return true;
    if (cur && lockedOn(cur)) return false;
    try {
      if (typeof W17.InventoryBlockedOrLimited === "function" && W17.InventoryBlockedOrLimited(P, { Asset: A })) return false;
    } catch (e) {
    }
    try {
      if (typeof W17.InventoryChatRoomAllow === "function" && !W17.InventoryChatRoomAllow(A.Category || [])) return false;
    } catch (e) {
    }
    let it = null;
    try {
      it = W17.InventoryWear(P, b.Name, b.Group, b.Color, b.Difficulty, by || me10(), b.Craft, false);
    } catch (e) {
      return false;
    }
    it = it || itemIn2(b.Group);
    if (!it || it.Asset.Name !== b.Name) return false;
    if (b.Property) {
      try {
        it.Property = typeof W17.ItemPropertiesDecompress === "function" ? W17.ItemPropertiesDecompress(Object.assign(it, { Property: {} }), b.Property) : JSON.parse(JSON.stringify(b.Property));
      } catch (e) {
        it.Property = JSON.parse(JSON.stringify(b.Property));
      }
    }
    if (lockedOn(it)) {
      try {
        if (typeof W17.InventoryUnlock === "function") W17.InventoryUnlock(P, it, false);
        else {
          for (const k of ["LockedBy", "LockMemberNumber", "RemoveTimer", "Password", "CombinationNumber", "MemberNumberList"]) delete it.Property[k];
        }
      } catch (e) {
      }
    }
    if (it.Property && it.Property.Effect) it.Property.Effect = it.Property.Effect.filter((e) => e !== "Lock");
    return true;
  }
  function kitBegin(part, by) {
    const { key: key2, flav } = splitPart(part);
    if (!key2) return false;
    const k = K2();
    if (k && k.key === key2 && k.by === by) {
      k.flav = flav;
      save();
      return true;
    }
    if (!by || by === me10()) {
      const b = kitLookup(key2);
      if (!b) {
        local(fill(pick(LINES.kits.missing_own)).replace(/%k/g, key2));
        return false;
      }
      return dress(key2, flav, by || me10(), b);
    }
    waiting2 = { key: key2, flav, by, at: Date.now() };
    send2("dispKitAsk", { key: key2 }, by);
    return true;
  }
  function onKit(from, m) {
    if (!waiting2 || waiting2.by !== from || String(m.key) !== waiting2.key) return;
    const w = waiting2;
    waiting2 = null;
    const b = m.none ? null : unpack(m.code);
    if (!b || !b.length) {
      local(fill(pick(LINES.kits.missing), { by: nameOf(from) }).replace(/%k/g, w.key));
      try {
        endDose("kit");
      } catch (e) {
      }
      return;
    }
    dress(w.key, w.flav, from, b);
  }
  var endDose = () => {
  };
  function dress(key2, flav, by, bundle) {
    const S3 = st(), was = K2();
    const pieces = bundle.filter((b) => wanted(b.Group)).slice(0, 60);
    if (!pieces.length) {
      local(fill(pick(LINES.kits.nothing)).replace(/%k/g, key2));
      return false;
    }
    S3.kit = { key: key2, flav, by, old: was ? was.old : wornBundle(), pieces, queue: pieces.map((b) => b.Group), next: Date.now(), at: Date.now(), done: false };
    save();
    action(lineOf5("start", flav, { by: nameOf(by) || "somebody", k: key2 }));
    kitTick(Date.now());
    return true;
  }
  function kitTick(now) {
    now = now || Date.now();
    if (waiting2 && now - waiting2.at > 2e4) {
      const w = waiting2;
      waiting2 = null;
      local(fill(pick(LINES.kits.missing), { by: nameOf(w.by) || "whoever made it" }).replace(/%k/g, w.key));
      try {
        endDose("kit");
      } catch (e) {
      }
      return;
    }
    const k = K2();
    if (!k) return;
    if (!inRoom()) return;
    if (k.done) for (const b of k.pieces) {
      const cur = itemIn2(b.Group);
      if (!cur && !k.queue.includes(b.Group) && wanted(b.Group)) {
        k.queue.push(b.Group);
        k.back = (k.back || 0) + 1;
      }
    }
    if (!k.queue.length || now < k.next) return;
    const gap2 = speedOf(), n = gap2 ? 1 : k.queue.length;
    const put = [];
    for (let i = 0; i < n && k.queue.length; i++) {
      const g = k.queue.shift(), b = k.pieces.find((p) => p.Group === g);
      if (!b) continue;
      if (putOn(b, k.by)) put.push(b);
    }
    k.next = now + gap2 * 1e3;
    if (put.length) {
      refresh();
      put.forEach((b) => update(b.Group));
      const v = { g: pieceName(put[0]), k: k.key, by: nameOf(k.by) || "somebody" };
      const back = k.done && k.back > 0;
      const t = put.length > 1 ? "" : lineOf5(back ? "back" : "piece", k.flav, v);
      if (t) back || Math.random() < 0.4 ? action(t) : local(t);
      if (back) k.back = Math.max(0, k.back - put.length);
    }
    if (!k.queue.length && !k.done) {
      k.done = true;
      action(lineOf5("done", k.flav, { k: k.key, by: nameOf(k.by) || "somebody" }));
    }
    save();
  }
  function kitEnd(quiet) {
    const k = K2();
    waiting2 = null;
    if (!k) return false;
    const P = W17.Player, S3 = st();
    for (const b of k.pieces) {
      const cur = itemIn2(b.Group);
      if (cur && cur.Asset.Name === b.Name && !lockedOn(cur)) {
        try {
          W17.InventoryRemove(P, b.Group, false);
        } catch (e) {
        }
      }
    }
    for (const b of k.old || []) {
      if (!itemIn2(b.Group)) {
        try {
          putBack(b);
        } catch (e) {
        }
      }
    }
    S3.kit = null;
    save();
    refresh();
    update(null);
    if (!quiet) action(lineOf5("off", k.flav, { k: k.key }));
    return true;
  }
  function putBack(b) {
    const A = W17.AssetGet("Female3DCG", b.Group, b.Name);
    if (!A) return;
    const it = W17.InventoryWear(W17.Player, b.Name, b.Group, b.Color, b.Difficulty, me10(), b.Craft, false) || itemIn2(b.Group);
    if (it && b.Property) {
      try {
        it.Property = typeof W17.ItemPropertiesDecompress === "function" ? W17.ItemPropertiesDecompress(Object.assign(it, { Property: {} }), b.Property) : JSON.parse(JSON.stringify(b.Property));
      } catch (e) {
        it.Property = JSON.parse(JSON.stringify(b.Property));
      }
    }
  }
  var kitNow = () => {
    const k = K2();
    return k ? { key: k.key, flav: k.flav, by: k.by, left: k.queue.length, on: k.pieces.length - k.queue.length, done: k.done } : null;
  };
  function initKits(mod2, o) {
    endDose = o && typeof o.end === "function" ? o.end : endDose;
    try {
      mod2.hookFunction("ChatRoomMessage", 11, (args, next2) => {
        try {
          const data = args[0];
          if (data && data.Type === "Hidden" && typeof data.Sender === "number") {
            const m = readMsg(data);
            if (m) kitMessage(data.Sender, m);
          }
        } catch (e) {
        }
        return next2(args);
      });
    } catch (e) {
    }
    try {
      W17.addEventListener("farmhand-dispensary", (e) => {
        const d = e && e.detail;
        if (!d || d.type !== "dose" || d.id !== "kit") return;
        try {
          if (d.on) kitBegin(d.p, o && o.byOf ? o.byOf("kit") : 0);
          else kitEnd(false);
        } catch (err) {
          console.warn("[Dispensary] kit:", err);
        }
      });
    } catch (e) {
    }
  }
  function kitMessage(from, m) {
    if (!m || from === me10()) return false;
    if (m.type === "dispKitAsk") {
      onAsk(from, m);
      return true;
    }
    if (m.type === "dispKit") {
      onKit(from, m);
      return true;
    }
    return false;
  }

  // dispensary/src/doses.js
  var W18 = window;
  var MIN10 = 6e4;
  var CAP = 48 * 60 * MIN10;
  var BOOK = {
    denial: {
      label: "Denial Serum",
      icon: "\u{1F6AB}",
      mins: 120,
      color: "#b04a7a",
      farm: true,
      words: DOSE_WORDS.denial,
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
      words: DOSE_WORDS.sedative,
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
      words: DOSE_WORDS.needy,
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
      words: DOSE_WORDS.hairtrigger,
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
      words: DOSE_WORDS.bitterroot,
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
      words: DOSE_WORDS.moo,
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
      words: DOSE_WORDS.hiccup,
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
      words: DOSE_WORDS.feather,
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
      words: DOSE_WORDS.heat,
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
      words: DOSE_WORDS.suggestible,
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
      words: DOSE_WORDS.letdown,
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
      words: DOSE_WORDS.fillout,
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
      words: DOSE_WORDS.airhead,
      keywords: ["airhead elixir", "bimbo serum"],
      soak: ["airhead", "bimbo"],
      desc: "Everything you say comes out, like, totally airheaded: likes and ums, uptalk, giggles, and big words that just sort of float off. The stronger the dose, the emptier your head. Twenty minutes a dose."
    },
    // KITS (Nov 18; kits.js): "kit: <name>" on the bottle puts the crafter's saved outfit on you, creepin' on, held on for
    // its time, and your old outfit back after. Only with "Kits can dress me" on (off to start)
    kit: {
      label: "Kit",
      icon: "\u{1F457}",
      mins: 30,
      color: "#b48ad8",
      optIn: "kitsOn",
      noLscg: true,
      words: DOSE_WORDS.kit,
      keywords: [],
      soak: [],
      desc: `"Kit: <name>" on the bottle: its crafter's saved outfit (in LSCG, or saved on their Dispensary) creeps onto you a piece at a time and stays on half an hour a dose. Anythin' taken off creeps back on. When it's over, your old outfit slips back on. Only with "Kits can dress me" on.`
    },
    // THE ANIMAL TONGUE (Nov 18; Laynie: "Those suit just fine"): Moo Juice's big sister. The bottle names the animal
    // ("Kitty Tongue" makes anybody a kitty; "Animal Tongue" is your own), and it gets stronger dose by dose: noises slip
    // in, then half the words go, then nothin' but noises
    tongue: {
      label: "Animal Tongue",
      icon: "\u{1F445}",
      mins: 30,
      color: "#e07a9a",
      every: [6, 10],
      room: true,
      words: DOSE_WORDS.tongue,
      keywords: ["animal tongue", "puppy tongue", "kitty tongue", "pony tongue"],
      soak: ["tongue"],
      desc: "Your words come out as an animal's noises: the one on the bottle (Kitty Tongue, Puppy Tongue, Pony Tongue...) or your own. One dose and noises slip in between your words; two, half your words are noises; three, nothin' but. Thirty minutes a dose."
    },
    babble: {
      label: "Babble Brew",
      icon: "\u{1F4AC}",
      mins: 20,
      color: "#c0508a",
      every: [6, 10],
      room: true,
      words: DOSE_WORDS.babble,
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
      words: DOSE_WORDS.deepthroat,
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
      words: DOSE_WORDS.rut,
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
      words: DOSE_WORDS.tender,
      keywords: ["tender drops", "tenderizer"],
      soak: ["tender"],
      desc: "One spot goes sweetly tender: touches there count three times over. Say where on the bottle (Tender Drops (nipples)), or it's the spot you pick on this page. Half an hour a dose."
    },
    // ── Nov 18: the farm girl's four voice potions, anywhere, from a crafted needle, drink or gear (her lines:
    // shared/potion-voice.js). Bought at her store on the farm, they're hers as ever: she says them herself (and Golden
    // Hour earns ribbons there) ──
    honey: {
      label: "Honey Tongue",
      icon: "\u{1F36F}",
      mins: 45,
      color: "#e8b04a",
      farm: false,
      voice: "honey",
      every: [5, 9],
      words: DOSE_WORDS.honey,
      keywords: ["honey tongue"],
      soak: ["honey tongue"],
      desc: "Forty-five minutes of the farm girl's sweet, filthy praise in your ear, every few minutes. Only you hear it."
    },
    golden: {
      label: "Golden Hour",
      icon: "\u2728",
      mins: 60,
      color: "#f0c040",
      farm: false,
      voice: "golden",
      every: [5, 8],
      words: DOSE_WORDS.golden,
      keywords: ["golden hour"],
      soak: ["golden"],
      desc: "An hour of glowin' easy, and every time you cum you're doted on for it. On the farm it earns ribbons too."
    },
    musk: {
      label: "Blue Ribbon Musk",
      icon: "\u{1F490}",
      mins: 45,
      color: "#5a7fd0",
      farm: false,
      voice: "musk",
      every: [5, 9],
      room: true,
      words: DOSE_WORDS.musk,
      keywords: ["blue ribbon musk"],
      soak: ["musk"],
      desc: "For 45 minutes everybody nearby keeps noticin' you, and the room hears about it now and then."
    },
    echo: {
      label: "Echo Elixir",
      icon: "\u{1F5E3}\uFE0F",
      mins: 20,
      color: "#a0d0e0",
      farm: false,
      voice: "echo",
      words: DOSE_WORDS.echo,
      keywords: ["echo elixir"],
      soak: ["echo"],
      desc: "Twice in twenty minutes, somethin' you said is repeated back to the room. Sweetly."
    },
    // ── Nov 18: GROWTH OFF THE FARM (Laynie: "seems good"). The farm's own growth shots, anywhere: on the farm with
    // the farm girl in the room they're hers (her books); anywhere else your Dispensary keeps the size, and it stays.
    // Your cup shows on the Companion's drawn breasts, your cock and balls on its drawn cock; the ass is counted till
    // it's drawn too. ──
    growcup: {
      label: "Udder Growth",
      icon: "\u{1F348}",
      mins: 0,
      color: "#f2b6c6",
      farm: true,
      instant: true,
      grow: "cup",
      words: DOSE_WORDS.growcup,
      keywords: ["udder growth", "breast growth"],
      desc: "A cup bigger for every dose, and it stays. Your Companion's drawn breasts show it. A reducing serum takes one back off."
    },
    // (Nov 19; Laynie: "choose the best options for me") a bigger behind has its own names now. "Ass Growth" is the
    // farm's shot that opens the hole (gape, below), the way her traps, parasites and roulette have always used it. The
    // farm keeps no size for a behind, so this one's your Dispensary's on the farm too.
    growass: {
      label: "Booty Growth",
      icon: "\u{1F351}",
      mins: 0,
      color: "#f0a080",
      instant: true,
      grow: "ass",
      words: DOSE_WORDS.growass,
      keywords: ["booty growth", "hip growth", "rear growth"],
      desc: "A size rounder behind for every dose, and it stays (counted now; drawn when the drawn body learns hips). Ass Growth is a different shot: it opens your ass."
    },
    gape: {
      label: "Ass Growth",
      icon: "\u{1F573}\uFE0F",
      mins: 0,
      color: "#c86a7a",
      farm: true,
      instant: true,
      words: DOSE_WORDS.gape,
      keywords: ["ass growth", "anal gape", "pussy gape"],
      desc: "The farm's own shot: your ass opens up a size for good, and stays trained that way (Pussy Gape or Pussy Growth: your pussy). On the farm it's the farm girl's, and hers can go past natural; anywhere else your Dispensary's hole trainin' keeps it, up to natural. A Tightening Balm closes it back up."
    },
    growcock: {
      label: "Cock Growth",
      icon: "\u{1F346}",
      mins: 0,
      color: "#c07090",
      farm: true,
      instant: true,
      grow: "cock",
      words: DOSE_WORDS.growcock,
      keywords: ["cock growth"],
      desc: "Two inches longer for every dose, and it stays. The Companion's drawn cock shows it."
    },
    growballs: {
      label: "Balls Growth",
      icon: "\u{1F95A}",
      mins: 0,
      color: "#d8a0b0",
      farm: true,
      instant: true,
      grow: "balls",
      words: DOSE_WORDS.growballs,
      keywords: ["balls growth"],
      desc: "A size heavier for every dose, and it stays. The Companion's drawn balls show it."
    },
    reducing: {
      label: "Reducing Serum",
      icon: "\u{1F53B}",
      mins: 0,
      color: "#90a0c0",
      farm: true,
      instant: true,
      grow: "less",
      words: DOSE_WORDS.reducing,
      keywords: ["reducing serum"],
      desc: "A size back off for every dose: your tits, or your cock, balls or booty if the bottle says so. It undoes the growth serums, and stays."
    },
    // ── Nov 18: poses and senses (senses.js) ──
    weakknees: {
      label: "Weak Knees",
      icon: "\u{1F9B5}",
      mins: 20,
      color: "#c9a0dc",
      every: [6, 10],
      words: DOSE_WORDS.weakknees,
      keywords: ["weak knees", "jelly legs"],
      soak: ["weak knees"],
      desc: `Down on your knees, and you can't get up on your own: somebody has to help you up (the game's own "with help"). Twenty minutes a dose.`
    },
    allfours: {
      label: "Down Girl",
      icon: "\u{1F43E}",
      mins: 20,
      color: "#a0785a",
      every: [6, 10],
      words: DOSE_WORDS.allfours,
      keywords: ["down girl serum", "all fours tonic"],
      soak: ["all fours"],
      desc: "Down on all fours, and you stay down there: gettin' up needs a hand. Twenty minutes a dose."
    },
    blinder: {
      label: "Blinder Drops",
      icon: "\u{1F576}\uFE0F",
      mins: 15,
      color: "#3a3550",
      every: [6, 10],
      words: DOSE_WORDS.blinder,
      keywords: ["blinder drops", "dimming drops"],
      soak: ["blinding"],
      desc: "Your sight dims: the game's own blindness, darker with a stronger dose. Fifteen minutes a dose."
    },
    cotton: {
      label: "Cotton Ears",
      icon: "\u{1F9BB}",
      mins: 15,
      color: "#e8e2d0",
      every: [6, 10],
      words: DOSE_WORDS.cotton,
      keywords: ["cotton ears", "deafening drops"],
      soak: ["deafening"],
      desc: "Everything muffled: the game's own deafness, deafer with a stronger dose. Fifteen minutes a dose."
    },
    tunnel: {
      label: "Tunnel Vision",
      icon: "\u{1F52D}",
      mins: 15,
      color: "#202030",
      every: [6, 10],
      words: DOSE_WORDS.tunnel,
      keywords: ["tunnel vision", "blinker drops"],
      soak: ["tunnel vision"],
      desc: "Only a small circle in the middle of your screen; the rest is dark. It's the dose itself, so the screen-touches switch doesn't take it away. Fifteen minutes a dose."
    },
    haze: {
      label: "Haze",
      icon: "\u{1F32B}\uFE0F",
      mins: 15,
      color: "#c8c0d8",
      every: [6, 10],
      words: DOSE_WORDS.haze,
      keywords: ["haze drops", "haze mist"],
      soak: ["haze"],
      desc: "Everything soft and blurry: the game's picture goes hazy (not the chat). Fifteen minutes a dose."
    },
    // ── Nov 18: the STATUE SERUM (Laynie approved the defaults). Half an hour as a statue: skin and hair turn to stone, or
    // whatever the bottle names (porcelain, gold, black latex, marble, bronze); the eyes are glass set in it; the ink turns with the skin;
    // arousal stops right where it is. The Companion draws it (statue.js), for everybody in the room with one. ──
    statue: {
      label: "Statue Serum",
      icon: "\u{1F5FF}",
      mins: 30,
      color: "#9a9a9a",
      every: [6, 10],
      words: DOSE_WORDS.statue,
      keywords: ["statue serum", "petrifying draught"],
      soak: ["petrifying"],
      desc: "Half an hour as a statue: your skin and hair turn to stone, or porcelain, gold, black latex, marble or bronze if the bottle says. Your eyes are glass set in it, still your own colour; your ink turns with your skin, and your arousal stops right where it is. Everybody with the Companion sees it."
    },
    // ── Nov 18 (Laynie, Nov 17: "a effect that makes every load take ~ for hyper pregnancy reasons. and maybe a nipple
    // dialator effect and parasite that makes nipples fuckable as a real action?") ──
    surecatch: {
      label: "Sure-Catch Serum",
      icon: "\u{1F930}",
      mins: 120,
      color: "#d58fb0",
      every: [8, 12],
      words: DOSE_WORDS.surecatch,
      keywords: ["sure-catch serum", "womb opener"],
      soak: ["sure-catch"],
      desc: "Every load takes. On the farm any load that can catch does (your Fertile switch still has to be on), and once you're carryin', every load after adds to the litter and brings it on, so you swell bigger with each one, up to the farm's hyper sizes. Off the farm your womb just aches for it. Two hours a dose."
    },
    dilator: {
      label: "Nipple Dilator",
      icon: "\u2B55",
      mins: 60,
      color: "#e0809a",
      every: [7, 11],
      words: DOSE_WORDS.dilator,
      keywords: ["nipple dilator", "nipple stretcher"],
      soak: ["dilating"],
      desc: "Your nipples stretch open while it's in you, wider for a stronger dose. While they're open, the game's action menu has a real Fuck nipple and Finger nipple on you, for anybody with the Dispensary, and touches there count double. Crafted nipple gear that says dilator or stretcher keeps them open while it's worn. An hour a dose."
    },
    balm: {
      label: "Tightening Balm",
      icon: "\u{1F9F4}",
      mins: 0,
      color: "#f0d8c0",
      instant: true,
      words: DOSE_WORDS.balm,
      keywords: ["tightening balm", "nipple tightener", "pussy tightener", "ass tightener", "virgin tonic"],
      desc: "Rubbed in, it closes stretched nipples right back up as they were: the Nipple Dilator gone, the leeches off, the stretch undone. A bottle that names your pussy, ass or throat (or says virgin, for all of them) tightens that instead: two sizes a dose off what it's trained to, and closed back up to it."
    },
    // ── Nov 19 (Laynie: "Definitely the insemination and breeders seal, and I would love if the crafter can specify how
    // much it deposits in which every hole, nipples, ass, pussy, or mouth in ml, l, or gallons"): seed.js, shared/seed.js ──
    // ── Nov 19, breedin' anywhere: carry.js ──
    quicken: {
      label: "Quickening Draught",
      icon: "\u{1F331}",
      mins: 0,
      color: "#a8d08d",
      farm: true,
      instant: true,
      words: DOSE_WORDS.quicken,
      keywords: ["quickening draught", "quicken tonic"],
      desc: "Hurries a litter along: a day off your pregnancy a dose (never closer than two hours to due), and a clutch of eggs ripens half a day sooner. Your belly swells with it. On the farm it's the farm girl's; off it your Dispensary hands it to her with your loads."
    },
    scan: {
      label: "Breeder's Scan",
      icon: "\u{1F50E}",
      mins: 0,
      color: "#b8c8e0",
      instant: true,
      words: DOSE_WORDS.scan,
      keywords: ["breeder's scan", "womb scanner"],
      desc: "Somebody on your list runs it over your belly, and the room hears what's in there: how many, whose, how close you are, a clutch of eggs, or just how much seed's waitin' to take, and whether you're ripe. A needle with it, or hold it while you touch their belly."
    },
    seed: {
      label: "Seed",
      icon: "\u{1F4A6}",
      mins: 0,
      color: "#f4efe4",
      instant: true,
      words: DOSE_WORDS.seed,
      keywords: ["insemination", "seed syringe", "cum shot", "filled with my seed"],
      desc: `A load of its crafter's own seed, as much as it says, where it says: "500 ml pussy, 1 L ass, 2 gallons mouth, 50 ml nipples", "half a gallon in every hole". A hole with no amount gets a thick load; no hole, and it goes in your pussy (your ass without one), or down your throat from a drink or a kiss. Your belly holds what the farm says and the rest spills; a Breeder's Seal keeps every drop. On the farm it's that crafter's load on the farm's books, and it can catch.`
    },
    purge: {
      label: "Purge",
      icon: "\u{1F9FC}",
      mins: 0,
      color: "#9fc7c7",
      farm: true,
      instant: true,
      words: DOSE_WORDS.purge,
      keywords: ["purge serum", "antidote"],
      desc: "Every dose in you flushed out at once (and LSCG's too, with its own antidote, when it's loaded)."
    }
  };
  var doseIds = () => Object.keys(BOOK);
  function stackOf(text3) {
    const t = String(text3 || "").toLowerCase(), m = /\bx\s?([2-5])\b|\b([2-5])\s?x\b/.exec(t);
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
  for (const s of Object.values(TENDER_SPOTS)) s.re = loosen(s.re);
  var TENDER_DEFAULT = "nipples";
  var PART_RE = { belly: /\b(belly|tummy|stomach|womb)\b/, ass: /\b(ass|butt|bum|rear|hips?|booty)\b/ };
  for (const k of Object.keys(PART_RE)) PART_RE[k] = loosen(PART_RE[k]);
  var STATUE_MATS = { stone: "stone", porcelain: "porcelain", gold: "gold", latex: "black latex", marble: "marble", bronze: "bronze" };
  function statueMat(t) {
    t = String(t || "").toLowerCase();
    return /porcelain|china[\s_-]*doll|\bchina\b/.test(t) ? "porcelain" : /\bgold|gild/.test(t) ? "gold" : /latex|rubber/.test(t) ? "latex" : /marble/.test(t) ? "marble" : /bronze/.test(t) ? "bronze" : "stone";
  }
  var TONGUE_RE = [
    ["pup", /\b(puppy|pup|doggy|dog)[- ]?tongue/],
    ["kitty", /\b(kitty|kitten|cat)[- ]?tongue/],
    ["pony", /\b(pony|horse)[- ]?tongue/],
    ["cow", /\b(cow|bovine)[- ]?tongue/],
    ["bunny", /\b(bunny|rabbit)[- ]?tongue/],
    ["fox", /\b(fox|vixen)[- ]?tongue/],
    ["goat", /\bgoat[- ]?tongue/],
    ["sheep", /\b(sheep|lamb)[- ]?tongue/],
    ["pig", /\b(piggy|pig)[- ]?tongue/],
    ["wolf", /\bwolf[- ]?tongue/],
    ["dragon", /\bdragon[- ]?tongue/],
    ["rat", /\brat[- ]?tongue/]
  ].map(([k, re]) => [k, loosen(re)]);
  var TONGUE_NOUN = { pup: "puppy", kitty: "kitty", pony: "pony", cow: "cow", bunny: "bunny", fox: "fox", goat: "goat", sheep: "lamb", pig: "piggy", wolf: "wolf", dragon: "dragon", rat: "rat" };
  function partFor(id, text3) {
    const t = String(text3 || "").toLowerCase();
    if (id === "fillout") return PART_RE.belly.test(t) ? "belly" : PART_RE.ass.test(t) ? "ass" : "cup";
    if (id === "statue") return statueMat(t);
    if (id === "tongue") {
      for (const [k, re] of TONGUE_RE) if (re.test(t)) return k;
      return "";
    }
    if (id === "kit") return kitPart(t);
    if (id === "reducing") return /\b(cock|penis|dick|shaft)\b/.test(t) ? "cock" : /\b(balls?|testes|testicles?|nuts)\b/.test(t) ? "balls" : PART_RE.ass.test(t) ? "ass" : "cup";
    if (id === "gape") {
      const m = BOOK.gape.words.exec(t);
      return m && /^(pussy|vulva|vaginal|cunt)/.test(m[0]) ? "vulva" : "butt";
    }
    if (id === "tender") {
      for (const [k, s] of Object.entries(TENDER_SPOTS)) if (s.re.test(t.replace(BOOK.tender.words, " "))) return k;
      return "";
    }
    if (id === "seed") return seedEncode(seedAmounts(t));
    if (id === "balm") {
      const hs = [/\b(pussy|cunt|vulva|slit|cooch)\b/.test(t) && "vulva", /\b(ass|butt|bum|asshole|backdoor)\b/.test(t) && "butt", /\b(throat|gag[\s_-]*reflex)\b/.test(t) && "throat"].filter(Boolean);
      const which = /\b(virgin\w*|holes|every[\s_-]*hole|all[\s_-]*over)\b/.test(t) || hs.length > 1 ? "holes" : hs[0] || "";
      return which ? (/\b(nipples?|teats?)\b/.test(t) ? "n" : "") + which : "";
    }
    return "";
  }
  function dosesIn(text3) {
    const t = String(text3 || "").toLowerCase().replace(/_+/g, " "), x = stackOf(t);
    return doseIds().filter((id) => BOOK[id].words.test(t)).map((id) => {
      const p = partFor(id, t);
      return p ? { id, x, p } : { id, x };
    });
  }
  function partOf(id) {
    const d = st().doses[id];
    if (id === "fillout") return d && d.p || "cup";
    if (id === "statue") return d && d.p || "stone";
    if (id === "tongue") return d && d.p || "";
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
  var spotIn = (t, id, p) => id === "tender" ? String(t).replace(/%s/g, TENDER_SPOTS[TENDER_SPOTS[p] ? p : partOf(id)].word) : id === "statue" ? String(t).replace(/%m/g, STATUE_MATS[p] || STATUE_MATS[partOf(id)] || "stone") : id === "tongue" ? String(t).replace(/%a/g, tongueNoun(p || partOf(id))) : t;
  var tongueAnimal = (p) => p || st().species || st().speciesFarm || "cow";
  var tongueNoun = (p) => TONGUE_NOUN[p] || TONGUE_NOUN[String(tongueAnimal(p)).toLowerCase()] || String(tongueAnimal(p)).toLowerCase();
  var ours5 = (id, kind, p) => {
    const L = poolOf(id, p);
    return L && L[kind] && L[kind].length ? spotIn(fill(pick(L[kind])), id, p) : "";
  };
  function takeLine(id) {
    const v = voiceOf(id);
    return v && v.seen.length ? nameIn(pick(v.seen)) : ours5(id, "take");
  }
  function nowLine(id) {
    const v = voiceOf(id);
    return v && v.now.length ? nameIn(pick(v.now)) : ours5(id, "now");
  }
  function offLine(id, p) {
    const v = voiceOf(id);
    return v && v.off.length ? nameIn(pick(v.off)) : ours5(id, "off", p);
  }
  function tellPage4(detail) {
    try {
      W18.dispatchEvent(new W18.CustomEvent("farmhand-dispensary", { detail }));
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
    const S3 = st();
    if (!S3.tolerance) return 1;
    const recent = (S3.taken[id] || []).filter((t) => (now || Date.now()) - t < TOLERANCE_HOURS * 36e5).length;
    return Math.max(TOLERANCE_FLOOR, 1 - TOLERANCE_STEP * recent);
  }
  function give(id, o) {
    o = o || {};
    const B = BOOK[id], S3 = st();
    if (!B) return { ok: false, why: "unknown" };
    if (S3.off[id]) return { ok: false, why: "off" };
    if (B.optIn && !S3[B.optIn]) return { ok: false, why: "off" };
    if (B.instant) return B.grow ? grow(id, o) : id === "balm" ? balm(o) : id === "gape" ? gape(o) : id === "seed" ? seedGive(o) : id === "quicken" ? quicken(o.x, o.quiet) : id === "scan" ? scan(o.by) : purge(o);
    if (B.lscg && lscgPresent()) return { ok: false, why: "lscg" };
    if (B.lscgOnly) return { ok: false, why: "nolscg" };
    const now = Date.now(), x = Math.max(1, Math.min(5, Math.round(Number(o.x) || 1)));
    const tol = o.upto ? 1 : toleranceOf(id, now);
    const dur = Math.max(MIN10, Math.min(CAP, (Number(o.mins) > 0 ? Number(o.mins) : B.mins * x) * MIN10 * tol));
    const was = active(id), d = S3.doses[id], by = Number(o.by) || 0;
    const xNow = Math.max(x, was && d ? d.x || 1 : 1);
    const p = typeof o.p === "string" && o.p ? o.p : was && d && d.p ? d.p : "";
    if (S3.clock === "real") {
      const add2 = dur * penaltyF(), base = was && typeof d.until === "number" ? d.until : now;
      S3.doses[id] = { x: xNow, by, at: now, until: Math.min(now + CAP * penaltyF(), o.upto ? Math.max(base, now + add2) : base + add2) };
    } else {
      const base = was && typeof d.left === "number" ? d.left : 0;
      S3.doses[id] = { x: xNow, by, at: now, left: Math.min(CAP, o.upto ? Math.max(base, dur) : base + dur) };
    }
    if (p) S3.doses[id].p = p;
    if (!o.upto) S3.taken[id] = (S3.taken[id] || []).concat(now).filter((t) => now - t < 3 * 864e5).slice(-20);
    save();
    if (!was) start(id);
    if (!o.quiet) action(o.line || takeLine(id));
    if (tol < 1) local(fill(TOLERANCE_NOTE, { dose: B.label }).replace("%p", String(Math.round(tol * 100))));
    if (!was || p && d && d.p !== p || xNow !== (d && d.x)) tellPage4({ type: "dose", id, on: true, x: xNow, p });
    try {
      lscgShow(id, by);
    } catch (e) {
    }
    return { ok: true };
  }
  var GROW_LIMITS = { cup: [-6, 10], ass: [-3, 6], cock: [-3, 6], balls: [-3, 6] };
  function grow(id, o) {
    const B = BOOK[id], S3 = st(), g = S3.grow || (S3.grow = {}), x = Math.max(1, Math.min(5, Math.round(Number(o.x) || 1)));
    const part = B.grow === "less" ? o.p && GROW_LIMITS[o.p] ? o.p : "cup" : B.grow, sign = B.grow === "less" ? -1 : 1;
    const [lo, hi] = GROW_LIMITS[part], was = g[part] || 0, now = Math.max(lo, Math.min(hi, was + sign * x));
    if (now === was) {
      if (!o.quiet) local(fill(NOTES.growMax, { dose: B.label }));
      return { ok: false, why: "max" };
    }
    g[part] = now;
    save();
    if (!o.quiet) action(o.line || fill(pick(LINES.grow[sign > 0 ? part : "less"])).replace(/%p/g, { cup: "tits", ass: "ass", cock: "cock", balls: "balls" }[part]));
    tellPage4({ type: "grow", part, n: now });
    return { ok: true, part, n: now };
  }
  var grown = () => Object.assign({ cup: 0, ass: 0, cock: 0, balls: 0 }, st().grow || {});
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
  function gape(o) {
    const h2 = o.p === "vulva" ? "vulva" : "butt", done = holesGape(h2, o.x, o.quiet);
    return done.length ? { ok: true, holes: done } : { ok: false, why: "max" };
  }
  var farmHas = (id, p) => !!(BOOK[id] && BOOK[id].farm) && !(id === "reducing" && p === "ass");
  function balm(o) {
    const hm = /^(n?)(vulva|butt|throat|holes)$/.exec(String(o.p || ""));
    if (hm) {
      const done = holesBalm(hm[2], o.x, o.quiet);
      if (!hm[1]) return { ok: true, holes: done };
      o = Object.assign({}, o, { line: void 0 });
    }
    const lt = mineToy();
    if (lt && toyLocked(lt)) {
      if (!o.quiet) action(fill("The tightening balm goes on cool, but %t's nipples can't close round the " + toyOf(lt).label.toLowerCase() + " locked in them. They stay stretched, achin' for it."));
      return { ok: true, was: 0, locked: true };
    }
    const was = nipsClose(true), out = lastPopped();
    if (!o.quiet) action(o.line || fill(was ? out ? "The tightening balm goes on cool, and %t's nipples draw closed so tight they squeeze the " + out.toLowerCase() + " right out. Then they're as snug as they ever were." : "The tightening balm goes on cool, and %t's stretched nipples draw slowly closed until they're as snug as they ever were." : "%t gets a dab of tightening balm on each nipple. Nothin' to tighten, but it tingles nicely."));
    return { ok: true, was };
  }
  function end(id, why) {
    const S3 = st();
    if (!S3.doses[id]) return false;
    const p = S3.doses[id].p || (id === "tender" ? partOf(id) : "");
    delete S3.doses[id];
    save();
    stop(id);
    tellPage4({ type: "dose", id, on: false });
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
    if (st().para && Object.keys(st().para).length) {
      n += Object.keys(st().para).length;
      st().para = {};
    }
    st().wornPause = Date.now() + 15 * MIN10;
    save();
    if (why !== "purge") {
      try {
        if (holesSafe()) n++;
      } catch (e) {
      }
    }
    return n;
  }
  var lastTick4 = 0;
  var lastSave = 0;
  function tick() {
    const S3 = st(), now = Date.now(), gap2 = lastTick4 ? Math.max(0, Math.min(now - lastTick4, 15e3)) : 0;
    lastTick4 = now;
    for (const [id, d] of Object.entries(S3.doses)) {
      if (!BOOK[id]) {
        delete S3.doses[id];
        continue;
      }
      if (typeof d.until !== "number") d.left = Math.max(0, (d.left || 0) - gap2);
      if (!active(id)) end(id, "done");
      else feel2(id, now);
    }
    if (now - lastSave > MIN10) {
      lastSave = now;
      if (Object.keys(S3.doses).length) save();
    }
  }
  function setClock(mode2) {
    const S3 = st(), want = mode2 === "real" ? "real" : "online";
    if (S3.clock === want) return;
    const now = Date.now(), f = penaltyF();
    for (const d of Object.values(S3.doses)) {
      if (want === "real" && typeof d.until !== "number") {
        d.until = now + (d.left || 0) * f;
        delete d.left;
      } else if (want === "online" && typeof d.until === "number") {
        d.left = Math.max(0, d.until - now) / f;
        delete d.until;
      }
    }
    S3.clock = want;
    save();
  }
  var face = (group, expr, secs) => {
    try {
      if (typeof W18.CharacterSetFacialExpression === "function" && W18.Player) W18.CharacterSetFacialExpression(W18.Player, group, expr, secs);
    } catch (e) {
    }
  };
  var meter2 = () => {
    const A = W18.Player && W18.Player.ArousalSettings;
    return A && A.Active !== "Inactive" && A.Active !== "NoMeter" ? A : null;
  };
  function setArousal(v) {
    try {
      const A = meter2();
      if (!A) return;
      const n = Math.max(0, Math.min(100, Math.round(v)));
      if (typeof W18.ActivitySetArousal === "function") W18.ActivitySetArousal(W18.Player, n);
      else A.Progress = n;
    } catch (e) {
    }
  }
  var xOf = (id) => st().doses[id] && st().doses[id].x || 1;
  var felt = {};
  var FLUSHED = ["needy", "heat", "rut", "letdown"];
  var xOfDose = (id) => st().doses[id] && st().doses[id].x || 1;
  var leak2 = () => tellPage4({ type: "leak", mess: "milk", areas: ["chest"], amount: Math.min(2, 0.5 + 0.25 * xOf("letdown")) });
  function start(id) {
    if (id === "sedative") face("Eyes", "Dazed", 180);
    if (FLUSHED.includes(id)) face("Blush", id === "letdown" ? "Low" : "Medium", 120);
    if (id === "airhead") face("Eyes", "Dazed", 120);
    if (id === "letdown") leak2();
    if (id === "weakknees" || id === "allfours") setTimeout(settle, 300);
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
  function feel2(id, now) {
    const B = BOOK[id];
    const f = felt[id] || (felt[id] = { face: now, next: now + ((B.every ? B.every[0] : 3) + Math.random() * 2) * MIN10 });
    if (id === "sedative" && now - f.face > 2 * MIN10) {
      f.face = now;
      face("Eyes", "Dazed", 180);
    }
    if (id === "needy") {
      const A = meter2(), cap = Math.min(92, 60 + 10 * xOf(id));
      if (A && (Number(A.Progress) || 0) < cap) setArousal((Number(A.Progress) || 0) + 2);
      if (now - f.face > 2 * MIN10) {
        f.face = now;
        face("Blush", "Medium", 120);
      }
    }
    if (id === "heat") {
      const A = meter2(), floor = Math.min(70, 25 + 15 * xOf(id));
      if (A && (Number(A.Progress) || 0) < floor) setArousal(floor);
      if (now - f.face > 2 * MIN10) {
        f.face = now;
        face("Blush", "Medium", 120);
      }
    }
    if (id === "rut") {
      const A = meter2(), floor = Math.min(60, 20 + 10 * xOf(id));
      if (A && (Number(A.Progress) || 0) < floor) setArousal(floor);
      if (now - f.face > 2 * MIN10) {
        f.face = now;
        face("Blush", "Medium", 120);
      }
    }
    if (id === "airhead" && now - f.face > 2 * MIN10) {
      f.face = now;
      face("Eyes", "Dazed", 120);
    }
    if (B.every && now >= f.next && inRoom()) {
      f.next = now + (B.every[0] + Math.random() * (B.every[1] - B.every[0])) * MIN10;
      const l = nowLine(id);
      if (l) {
        if (B.room) action(l);
        else local(id === "honey" ? "\u{1F36F} The farm girl leans in close to your ear: " + l : id === "golden" ? "\u2728 " + l : l);
      }
      if (id === "letdown") leak2();
    } else if (!B.every && id === "sedative" && now >= f.next && inRoom()) {
      f.next = now + (8 + Math.random() * 6) * MIN10;
      local(pick(LINES.sedative.drift));
    }
  }
  var heldTold = 0;
  var toldAt = {};
  function feltOnce(id, kind, gap2) {
    const now = Date.now(), k = id + ":" + kind;
    if (now - (toldAt[k] || 0) < gap2) return;
    toldAt[k] = now;
    const l = ours5(id, kind);
    if (l) local(l);
  }
  function initDoses(mod2) {
    const stone = (C2) => !!(C2 && typeof C2.IsPlayer === "function" && C2.IsPlayer() && active("statue"));
    for (const fn of ["ActivitySetArousal", "ActivitySetArousalTimer", "ActivityTimerProgress", "ActivityOrgasmPrepare"]) {
      try {
        if (typeof W18[fn] === "function") mod2.hookFunction(fn, 7, (args, next2) => stone(args[0]) ? void 0 : next2(args));
      } catch (e) {
        console.warn("[Dispensary] the Statue Serum can't hold " + fn + ":", e);
      }
    }
    try {
      mod2.hookFunction("ActivityOrgasmPrepare", 6, (args, next2) => {
        try {
          const C2 = args[0];
          if (C2 && typeof C2.IsPlayer === "function" && C2.IsPlayer() && active("denial")) {
            if (C2.ArousalSettings) C2.ArousalSettings.Progress = 94;
            face("Blush", "High", 20);
            if (Date.now() - heldTold > MIN10) {
              heldTold = Date.now();
              local(pick(LINES.denial.held));
            }
            return void 0;
          }
        } catch (e) {
        }
        return next2(args);
      });
    } catch (e) {
      console.warn("[Dispensary] Denial Serum can't hold you:", e);
    }
    try {
      mod2.hookFunction("ActivityOrgasmStart", 6, (args, next2) => {
        try {
          const C2 = args[0];
          if (C2 && typeof C2.IsPlayer === "function" && C2.IsPlayer() && active("bitterroot")) W18.ActivityOrgasmRuined = true;
        } catch (e) {
        }
        try {
          const C2 = args[0];
          if (C2 && typeof C2.IsPlayer === "function" && C2.IsPlayer() && active("golden") && !W18.ActivityOrgasmRuined) setTimeout(() => local(pick(LINES.goldenDote)), 2500);
        } catch (e) {
        }
        return next2(args);
      });
    } catch (e) {
      console.warn("[Dispensary] Bitterroot can't ruin you:", e);
    }
    try {
      mod2.hookFunction("ActivitySetArousalTimer", 6, (args, next2) => {
        try {
          const C2 = args[0], zone = String(args[2] || "");
          if (C2 && typeof C2.IsPlayer === "function" && C2.IsPlayer() && Number(args[3]) > 0) {
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
            if (/^ItemNipples/.test(zone) && nipsOpen() > 0) f *= 2;
            if (f > 1) args[3] = Number(args[3]) * f;
          }
        } catch (e) {
        }
        return next2(args);
      });
    } catch (e) {
      console.warn("[Dispensary] Hair Trigger can't reach you:", e);
    }
    try {
      mod2.hookFunction("ActivityOrgasmStop", 6, (args, next2) => {
        try {
          const C2 = args[0];
          if (C2 && typeof C2.IsPlayer === "function" && C2.IsPlayer() && active("rut")) {
            const back = Math.min(80, 40 + 8 * xOf("rut"));
            if ((Number(args[1]) || 0) < back) {
              args = [args[0], back].concat(args.slice(2));
              feltOnce("rut", "again", MIN10);
            }
          }
        } catch (e) {
        }
        return next2(args);
      });
    } catch (e) {
      console.warn("[Dispensary] Rut can't keep you goin':", e);
    }
    try {
      mod2.hookFunction("ChatRoomMapViewCanEnterTile", 1, (args, next2) => {
        const t = next2(args);
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

  // dispensary/src/toys.js
  var W19 = window;
  var TOY_HOST = "https://raw.githubusercontent.com/Laynie667/BnBfarms/main/toys/v1/";
  var host = () => typeof W19.__farmToyHost === "string" ? W19.__farmToyHost : TOY_HOST;
  var ours6 = (group, name) => group === "ItemNipples" && !!TOY_BY[name];
  var defsAll = () => W19.AssetFemale3DCG || (typeof AssetFemale3DCG !== "undefined" ? AssetFemale3DCG : null);
  var extAll = () => W19.AssetFemale3DCGExtended || (typeof AssetFemale3DCGExtended !== "undefined" ? AssetFemale3DCGExtended : null);
  function extOf(T) {
    if (T.states === "typed") return {
      Archetype: "typed",
      CopyConfig: { GroupName: T.from[0], AssetName: T.from[1] },
      DialogPrefix: { Header: T.from[0] + T.from[1] + "Select", Option: T.from[0] + T.from[1], Chat: T.from[0] + T.from[1] + "Set" }
    };
    if (T.vibe === "modular") return { Archetype: "modular", CopyConfig: { GroupName: "ItemButt", AssetName: "InflVibeButtPlug" } };
    if (T.vibe) return { Archetype: "vibrating" };
    return null;
  }
  function defOf(T, orig) {
    const o = orig && typeof orig === "object" ? orig : {};
    const d = {
      Name: T.id,
      Value: -1,
      Random: false,
      Time: o.Time || 10,
      Prerequisite: ["AccessBreast", "FarmNipsOpen"],
      Hide: ["ItemNipplesPiercings"],
      Effect: T.vibe ? ["UseRemote", "Wiggling"] : ["Wiggling"],
      PoseMapping: { AllFours: "Hide", Hogtied: "Hide" },
      // (the breasts are drawn another way there)
      Extended: !!extOf(T),
      Layer: [Object.assign({ Name: "Toy", AllowColorize: false }, T.states === "pump" ? { CreateLayerTypes: ["f"] } : {})]
    };
    if (o.Audio) d.Audio = o.Audio;
    if (Array.isArray(o.ExpressionTrigger)) d.ExpressionTrigger = o.ExpressionTrigger;
    if (Array.isArray(o.Fetish)) d.Fetish = o.Fetish;
    if (T.states === "typed") d.CreateLayerTypes = ["typed"];
    if (T.lock) Object.assign(d, { AllowLock: true, IsRestraint: true, Difficulty: o.Difficulty || 50, RemoveTime: o.RemoveTime || 50 });
    return d;
  }
  function describe2() {
    const G = W19.AssetGroupMap && W19.AssetGroupMap.get("ItemNipples");
    if (!G) return;
    for (const A of G.Asset || []) {
      const T = TOY_BY[A.Name];
      if (T) A.Description = T.label;
    }
  }
  function addToys() {
    const G = W19.AssetGroupMap && W19.AssetGroupMap.get("ItemNipples"), defs = defsAll();
    if (!G || typeof W19.AssetAdd !== "function" || !Array.isArray(defs)) return false;
    const gdef = defs.find((g) => g && g.Group === "ItemNipples");
    if (!gdef) return false;
    const EXT = extAll() || {};
    let added = 0;
    for (const T of TOYS) {
      if ((G.Asset || []).some((a) => a && a.Name === T.id)) continue;
      const og = defs.find((g) => g && g.Group === T.from[0]), orig = og && Array.isArray(og.Asset) ? og.Asset.find((a) => a && (a.Name || a) === T.from[1]) : null;
      const x = extOf(T);
      if (x) {
        EXT.ItemNipples = EXT.ItemNipples || {};
        EXT.ItemNipples[T.id] = x;
      }
      try {
        W19.AssetAdd(G, defOf(T, orig), EXT, gdef);
        added++;
      } catch (e) {
        console.warn("[Dispensary] couldn't add the " + T.label, e);
      }
    }
    describe2();
    return added > 0 || TOYS.every((T) => (G.Asset || []).some((a) => a && a.Name === T.id));
  }
  var SHUT = "PrerequisiteFarmNipsShut";
  var SHUT_TEXT = "Those nipples aren't open. A Nipple Dilator or the nipple leeches open them up first.";
  function initToys(mod2, deps2) {
    const hook = (fn, pri, f) => {
      try {
        if (typeof W19[fn] === "function") mod2.hookFunction(fn, pri, f);
      } catch (e) {
        console.warn("[Dispensary] nipple toys can't hook " + fn + ":", e);
      }
    };
    hook("AssetBaseURL", 0, (args, next2) => {
      const A = args[6];
      return A && ours6(args[2], A.Name) ? host() + "ItemNipples/" + (args[3] ? args[3] + "/" : "") : next2(args);
    });
    hook("AssetGetPreviewPath", 0, (args, next2) => {
      const A = args[0];
      return A && A.Group && ours6(A.Group.Name, A.Name) ? host() + "ItemNipples/Preview" : next2(args);
    });
    hook("AssetBuildDescription", 0, (args, next2) => {
      const r = next2(args);
      try {
        describe2();
      } catch (e) {
      }
      return r;
    });
    hook("AssetLoadAll", 0, (args, next2) => {
      const r = next2(args);
      try {
        addToys();
      } catch (e) {
      }
      return r;
    });
    hook("InventoryAvailable", 0, (args, next2) => {
      const T = args[2] === "ItemNipples" && TOY_BY[args[1]];
      return T ? next2([args[0], T.from[1], T.from[0], ...args.slice(3)]) : next2(args);
    });
    hook("InventoryPrerequisiteMessage", 0, (args, next2) => {
      if (args[1] !== "FarmNipsOpen") return next2(args);
      try {
        const C2 = args[0];
        if (!C2 || toyIn(C2)) return "";
        const n = typeof C2.IsPlayer === "function" && C2.IsPlayer() ? deps2.nipsOpen() : deps2.openOf(C2.MemberNumber);
        return n > 0 ? "" : "FarmNipsShut";
      } catch (e) {
        return "FarmNipsShut";
      }
    });
    hook("InterfaceTextGet", 0, (args, next2) => args[0] === SHUT ? SHUT_TEXT : next2(args));
    hook("ServerSend", 0, (args, next2) => {
      try {
        const d = args[1];
        if (args[0] === "ChatRoomChat" && d && Array.isArray(d.Dictionary) && d.Dictionary.some((e) => e && e.Tag && ours6(e.GroupName, e.AssetName))) {
          const D = d.Dictionary.map((e) => e && e.Tag && ours6(e.GroupName, e.AssetName) ? { Tag: e.Tag, Text: TOY_BY[e.AssetName].label.toLowerCase() } : e);
          args = [args[0], Object.assign({}, d, { Dictionary: D }), ...args.slice(2)];
        }
      } catch (e) {
      }
      return next2(args);
    });
    if (!addToys()) {
      let n = 0;
      const t = setInterval(() => {
        if (addToys() || ++n > 120) clearInterval(t);
      }, 500);
    }
  }

  // dispensary/src/icons.js
  var W20 = window;
  var others2 = /* @__PURE__ */ new Map();
  var me11 = () => W20.Player && W20.Player.MemberNumber || 0;
  var inRoom3 = () => W20.CurrentScreen === "ChatRoom" && typeof W20.ServerSend === "function";
  var mineNow = () => ({ ids: doseIds().filter(active).slice(0, 8), para: Object.keys(st().para || {}).length > 0 });
  var lastSig = "";
  var lastAt2 = 0;
  function iconsTell(force) {
    if (!inRoom3()) return false;
    const S3 = st(), m = S3.iconsShare === false ? { ids: [], para: false } : mineNow(), sig = JSON.stringify(m);
    if (!force && (sig === lastSig || Date.now() - lastAt2 < 4e3)) return false;
    lastSig = sig;
    lastAt2 = Date.now();
    try {
      W20.ServerSend("ChatRoomChat", makeMsg("dispIcons", m));
      return true;
    } catch (e) {
      return false;
    }
  }
  function onIcons(from, m) {
    const ids = Array.isArray(m.ids) ? m.ids.filter((id) => typeof id === "string" && BOOK[id]).slice(0, 8) : [];
    const was = iconsDosed(from);
    if (!ids.length && !m.para) others2.delete(from);
    else others2.set(from, { ids, para: !!m.para, at: Date.now() });
    if (was !== iconsDosed(from)) {
      try {
        W20.dispatchEvent(new W20.CustomEvent("farmhand-dispensary", { detail: { type: "icons", from } }));
      } catch (e) {
      }
    }
  }
  function iconsDosed(mn) {
    const e = mn === me11() ? mineNow() : others2.get(mn);
    return !!(e && e.ids.length);
  }
  function iconsIds(mn) {
    const e = mn === me11() ? mineNow() : others2.get(mn);
    return e && Array.isArray(e.ids) ? e.ids.slice() : [];
  }
  function iconsFor(mn) {
    const e = mn === me11() ? mineNow() : others2.get(mn);
    if (!e) return "";
    return e.ids.slice(0, 5).map((id) => BOOK[id].icon).join("") + (e.para ? "\u{1FAB1}" : "");
  }
  var canvas = () => typeof MainCanvas !== "undefined" && MainCanvas || W20.MainCanvas || null;
  var fontOf2 = (px) => {
    try {
      if (typeof CommonGetFont === "function") return CommonGetFont(px);
    } catch (e) {
    }
    return px + "px Arial";
  };
  function iconsItems(mn) {
    const e = mn === me11() ? mineNow() : others2.get(mn);
    if (!e) return [];
    return e.ids.filter((id) => BOOK[id]).map((id) => ({ icon: BOOK[id].icon, label: BOOK[id].label })).concat(e.para ? [{ icon: "\u{1FAB1}", label: "A parasite" }] : []);
  }
  function drawIcons(C2, X, Y, Z) {
    const items = iconsItems(C2.MemberNumber), M = canvas();
    if (!items.length || !M) return 0;
    const shown2 = items.length > 3 ? items.slice(0, 2).concat({ icon: "+" + (items.length - 2) }) : items;
    const s = 40 * Z, x0 = X + 190 * Z;
    M.save();
    try {
      M.textAlign = "center";
      M.textBaseline = "middle";
      M.font = fontOf2(Math.max(8, Math.round(30 * Z)));
      M.lineWidth = Math.max(1, 3 * Z);
      M.strokeStyle = "black";
      M.fillStyle = "white";
      shown2.forEach((it, i) => {
        const x = x0 + s * i + s / 2, y = Y + s / 2;
        if (it.icon[0] === "+") M.strokeText(it.icon, x, y);
        M.fillText(it.icon, x, y);
      });
      if (typeof W20.MouseIn === "function" && W20.MouseIn(x0, Y, s * shown2.length, s)) {
        const px = 22, lh = px + 8;
        M.font = fontOf2(px);
        M.textAlign = "left";
        const lines2 = items.map((it) => it.icon + " " + it.label), w = Math.max(...lines2.map((l) => M.measureText(l).width)) + 20, h2 = lines2.length * lh + 10;
        const bx = Math.max(4, Math.min(x0, 2e3 - w - 4)), by = Y + s + 4;
        M.fillStyle = "rgba(20,14,24,0.88)";
        M.fillRect(bx, by, w, h2);
        M.strokeStyle = "rgba(255,255,255,0.35)";
        M.lineWidth = 1;
        M.strokeRect(bx, by, w, h2);
        M.fillStyle = "white";
        lines2.forEach((l, i) => M.fillText(l, bx + 10, by + 5 + lh * i + lh / 2));
      }
    } finally {
      M.restore();
    }
    return shown2.length;
  }
  function initIcons(mod2) {
    try {
      mod2.hookFunction("ChatRoomDrawCharacterStatusIcons", 0, (args, next2) => {
        const r = next2(args);
        try {
          const [C2, X, Y, Z] = args;
          if (st().iconsShow === false || !C2) return r;
          drawIcons(C2, X, Y, Z || 1);
        } catch (e) {
        }
        return r;
      });
    } catch (e) {
      console.warn("[Dispensary] dose icons can't be drawn:", e);
    }
    try {
      mod2.hookFunction("ChatRoomMessage", 11, (args, next2) => {
        try {
          const data = args[0];
          if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me11()) {
            const m = readMsg(data);
            if (m && m.type === "dispIcons") onIcons(data.Sender, m);
            else if (m && m.type === "dispIconsAsk") iconsTell(true);
          }
        } catch (e) {
        }
        return next2(args);
      });
    } catch (e) {
    }
    try {
      mod2.hookFunction("ChatRoomSync", 3, (args, next2) => {
        const r = next2(args);
        others2.clear();
        setTimeout(() => {
          iconsTell(true);
          try {
            W20.ServerSend("ChatRoomChat", makeMsg("dispIconsAsk", {}));
          } catch (e) {
          }
        }, 3e3);
        return r;
      });
    } catch (e) {
    }
  }

  // dispensary/src/lines-nips.js
  Object.assign(LINES, {
    surecatch: {
      take: [
        "%t presses a hand low on their belly as the serum hits. Somethin' deep inside opens up and goes warm and greedy.",
        "The Sure-Catch Serum settles low in %t, and their womb starts achin' for it. Whatever goes in there now is goin' to take.",
        "%t shivers. Their belly feels soft and heavy and ready, like it's already waitin' to be filled.",
        "A slow, hungry warmth spreads through %t's womb. Every load from here on is goin' to stick.",
        "%t's hips roll forward on their own. Their body's decided: it wants to be bred, and it's goin' to keep every drop."
      ],
      now: [
        "%t rubs their lower belly without thinkin'. Their womb's still achin' to be filled.",
        "%t keeps glancin' at the nearest stud. The serum's got their body wantin' only one thing.",
        "A warm, empty ache low in %t's belly. It wants a load, and it'll keep it.",
        "%t squeezes their thighs together. Their womb's wide open and waitin'.",
        "%t's hand drifts to their belly again, like they're already feelin' it grow."
      ],
      off: [
        "The ache low in your belly fades. Your womb's yours again, mostly. Whatever took already is stayin' put.",
        "The Sure-Catch Serum wears off. The next load might not take after all."
      ]
    },
    dilator: {
      take: [
        "%t gasps and clutches their chest as the dilator works in. Both nipples stretch, soft and slick, and stay open.",
        "A warm, spreadin' ache in %t's nipples. When it settles they're standin' open, wide enough to take a finger. Or more.",
        "%t's nipples swell, then part. They're open now, pink and wet and achin' to be filled.",
        "The dilator does its work: %t's nipples ease open and won't close, like two little mouths waitin' to be used.",
        "%t whimpers as their nipples stretch wide. Every breath of air on them feels like a touch."
      ],
      now: [
        "%t's nipples are still gapin' open, puffy and tender.",
        "%t keeps brushin' their open nipples, and shiverin' every time.",
        "Cool air on %t's stretched nipples has them squirmin'.",
        "%t's open nipples twitch, empty and achin' to be filled."
      ],
      off: [
        "The Nipple Dilator wears off. Your nipples slowly close up again, sore and puffy, and very sensitive.",
        "Your nipples shrink back down as the dilator fades. They'll remember bein' that open for a while."
      ]
    },
    // open nipples bein' used (only you see these, now and then)
    nips: {
      fucked: [
        "%b's cock is buried in your nipple, stretchin' it round the shaft. Every thrust goes straight to your core.",
        "Your nipple's wrapped tight round %b's cock, and the feelin' of bein' fucked there is like nothin' else.",
        "%b fucks your open nipple slow and deep, and your whole breast throbs with it.",
        "Your nipple's been opened right up and %b is usin' it. It's too much, and you don't want it to stop."
      ],
      fingered: [
        "%b's finger slides right inside your nipple, and your breath catches.",
        "A finger in your open nipple, curlin' and pressin'. %b's explorin' how deep it goes.",
        "%b works a finger in and out of your nipple, and your whole chest tingles.",
        "Your stretched nipple swallows %b's finger whole. You didn't know it could feel like that."
      ],
      // you came in somebody's nipple (only you see it)
      came: [
        "You cum deep in %b's stretched nipple, and feel it take every pulse.",
        "You bury yourself to the hilt in %b's nipple and empty out, and their tit swallows the lot.",
        "You fill %b's nipple till it can't hold any more."
      ],
      // somebody came in yours (the room sees this one)
      creamed: [
        "%b cums deep in %t's nipple. A moment later it wells back out, a thick white bead that runs down the curve of %t's tit.",
        "%t's nipple is stuffed with %b's load, and it starts leakin' back out the moment %b pulls free.",
        "%b empties into %t's tit. The stretched nipple twitches, and cream drips from it in slow strings.",
        "%t gasps as %b's load floods their nipple, warm and heavy. It doesn't stay in long: it's runnin' down their chest."
      ],
      // forced open (Nov 19, /dispensary nips open): the room sees it. %w is how wide (nipples.js FORCED_WIDE): open
      // enough to take a finger, wide open, gapin' wide
      forced_self: [
        "%t pinches both nipples and pulls, and pulls, till they give: %w, pink and slick and waitin'. They stay that way.",
        "%t works their nipples open with their own fingers, gaspin' as they stretch %w. They don't close back up.",
        "%t arches and moans as their nipples part, %w, two hungry little holes beggin' to be filled.",
        "%t forces their own nipples %w. Their tits are fuckable now, and they know it.",
        "%t spreads their nipples %w and shows them off, puffy and wet, made for somethin' to slide in."
      ],
      forced_by: [
        "%b takes hold of %t's nipples and forces them %w. %t whimpers as they stretch and stay that way.",
        "%b works %t's nipples open, slow and cruel, till they're %w and drippin'. %t can't do a thing but squirm.",
        "%t gasps as %b spreads their nipples %w. They stay that way, soft and slick, ready for whatever %b wants in them.",
        "%b decides %t's tits should be fuckable, and makes them so: both nipples stretched %w and left that way.",
        "%b presses and stretches till %t's nipples give, %w. %t's chest heaves, and the little holes twitch, empty and achin'."
      ],
      self: [
        "Your own finger slides right into your open nipple. It's so strange, and so good.",
        "You can't help testin' how deep your nipple goes now. Deeper than you'd think.",
        "You work a finger in your own open nipple and have to bite your lip."
      ]
    }
  });

  // dispensary/src/lines-worn.js
  Object.assign(LINES, {
    worn: {
      drip: [
        "The %g starts to seep. %t can feel %d creepin' into them, slow and steady, and it isn't goin' to stop while it's on.",
        "Somethin' in the %g warms against %t's skin and starts to leak %d into them, a little at a time.",
        "%t shivers as the %g settles. It's drippin' %d into them now, patient as anything.",
        "The %g has been soaked in %d, and it gives it up to %t's skin bit by bit."
      ],
      inject: [
        "The %g clicks. A little sting, and %t gets another dose of %d.",
        "Right on time, the %g gives %t a sharp little pinch: %d, straight in.",
        "%t jumps as the %g goes off. More %d, whether they were ready or not.",
        "There's a soft hiss from the %g, and %d floods into %t all over again."
      ],
      climax: [
        "%t's %g goes off right as they cum: %d, pumped in while they're still shakin'.",
        "The moment %t goes over, the %g answers with a dose of %d.",
        "%t cums, and the %g rewards them for it: %d, straight in."
      ],
      kissed: [
        "%b kisses %t, and the %g notices: a dose of %d slides in.",
        "The %g on %t answers %b's kiss with a pinch of %d."
      ],
      touched: [
        "%b's touch sets the %g off: %t gets a dose of %d.",
        "The %g on %t wakes up under %b's hands and gives them %d."
      ],
      spanked: [
        "The smack sets the %g off: %t yelps, and a dose of %d goes in with it.",
        "%b's hand lands, and the %g on %t answers with %d."
      ],
      gloss: [
        "%b's lips are slick with somethin' sweet. %t tastes it a moment too late: %d.",
        "%b kisses %t and leaves a sticky shine behind. It tingles. It's %d.",
        "There's %d in %b's lip gloss, and now there's some in %t too.",
        "%t licks their lips after %b's kiss and finds them sweet and tinglin'. %d."
      ]
    }
  });

  // dispensary/src/lines-para.js
  Object.assign(LINES, {
    para: {
      lips: {
        latch: [
          "Somethin' wet and eager wriggles free of the gear and seals itself over %t's mouth. A pair of livin' lips, %b's strain, and they're not lettin' go.",
          "The parasite finds %t's mouth and latches on with a soft, greedy pop. Its tendril slides down their throat and settles in.",
          "%t gasps, and that's all the parasite needed: it's on their lips now, warm and pulsin', and it's hungry."
        ],
        feed: [
          "The parasite on %t's mouth shivers and pumps somethin' sweet down their throat: %d.",
          "%t feels the parasite swallow, then give back: a warm mouthful of %d.",
          "A slow pulse runs through the parasite's lips, and %t's throat fills with %d."
        ],
        crave: [
          "Your mouth aches. The parasite wants a load, and so, now, do you.",
          "You catch yourself starin' at somebody's lap. The parasite's hungry.",
          "Your throat keeps swallowin' on nothin'. Somethin' thick would settle it."
        ],
        off: [
          "The parasite loosens, slides off your lips with a wet little sound, and goes still. Your mouth tingles for a while after.",
          "It's done with you. The parasite peels away, sated, and leaves you swallowin' on the memory."
        ]
      },
      latex: {
        latch: [
          "The gear's shine spreads. It crawls off the edges and over %t's skin, glossy and black and alive: livin' latex, %b's.",
          "%t watches the latex creep up their thighs and settle, cool at first, then warm. It's on them now, and it's thirsty."
        ],
        feed: [
          "The latex drinks %t's climax and tightens, pleased. Everything it covers feels twice as much.",
          "A ripple runs over the latex as %t cums: it's fed, and it's makin' them feel every inch it hugs."
        ],
        starved: [
          "The latex has gone dull and cold. Nobody's fed it: it peels away to find a better host."
        ],
        off: [
          "The latex loosens and slides off you in one glossy sheet. Your skin feels very bare.",
          "Its time's up. The latex lets go, and leaves you a little sorry it did."
        ]
      },
      moss: {
        latch: [
          "Soft green moss spreads over %t's chest from the gear, warm and damp. It nuzzles their nipples. It wants their milk.",
          "The milk moss settles over %t's tits and starts to hum. It's hungry, and it knows where the food is."
        ],
        feed: [
          "The milk moss squeezes, gentle and insistent, and %t's tits let down for it.",
          "%t's chest prickles under the moss. It's coaxin' the milk out of them again."
        ],
        starved: ["The moss has dried and gone brittle. Nobody's let down for it: it crumbles away."],
        off: ["The milk moss lets go, a soft green shed, and your chest feels light and tender without it."]
      },
      nestling: {
        latch: [
          "Somethin' small and warm slips from the gear into %t and curls up low in their belly. The nestling's found its nest.",
          "%t feels it settle inside: the nestling, %b's, warm and content and already growin'."
        ],
        grow: [
          "%t cums, and the nestling drinks it in. It grows: stage %n, and %t's belly rounds out with it.",
          "The nestling stirs and swells as %t comes down. Stage %n. Their belly's fuller for it."
        ],
        starved: ["The nestling's gone quiet and cold. It slips away in the night, lookin' for a better-fed nest."],
        off: ["The nestling leaves, its time done, and your belly settles back down. You miss the weight of it."]
      },
      brood: {
        latch: [
          "The brood mother takes up residence in %t: big and patient and fertile, %b's. She'll be layin' soon."
        ],
        lay: [
          "Somethin' shifts inside you. The brood mother's laid a little one (%n now). Kiss somebody who'd take it.",
          "Another tiny parasite, ready to go (%n waitin'). It'll pass on the next kiss."
        ],
        pass: ["Your kiss carries one of the brood mother's little ones across to %b."],
        off: ["The brood mother's done. She lets go, and any little ones go with her."]
      },
      vine: {
        latch: [
          "The vine in %t's gear uncurls and finds %b. A green tether, and it isn't lettin' %t wander far."
        ],
        tug: [
          "The leash vine goes taut. You can't go any further from whoever grew it.",
          "A tug at your gear: the vine says that's far enough."
        ],
        off: ["The leash vine goes slack and withers. You can wander again."]
      },
      mouth: {
        latch: [
          "Somethin' in %t's gear settles against their tongue. The mouthpiece: %b can put words there now."
        ],
        off: ["The mouthpiece goes quiet. Your words are your own again."]
      },
      // (Nov 18) the nipple leeches: they hold the nipples open, and feed on what goes in
      nips: {
        latch: [
          "Two slick little leeches wriggle out of the gear and fasten onto %t's nipples, one each. %t gasps as they suck, and suck, and their nipples open up round them, soft and wide.",
          "Somethin' cold and eager latches onto each of %t's nipples. %b's leeches. They burrow in, just a little, and when %t looks down their nipples are standin' open like they're waitin' for somethin'.",
          "%t squirms as a pair of leeches settles over their nipples and starts to pulse. Each nipple gapes a little wider with every pull.",
          "The leeches find %t's nipples and seal on tight. A warm, stretchin' ache, and then both nipples are open, slick and wantin'."
        ],
        feed: [
          "The leeches on %t's nipples swell with what they just got, and pump somethin' back: %d.",
          "%t shivers as the leech in their nipple drinks its fill and gives back a hot little rush of %d.",
          "A slow pulse runs through both leeches. They've been fed, and %t's feelin' it: %d."
        ],
        wider: [
          "The leeches are fat and happy now, and your nipples have stretched to fit them. Wider than ever.",
          "Fed three times over, the leeches have opened your nipples right up. Anything fits now."
        ],
        off: [
          "The leeches have had their fill. They let go, one and then the other, and your nipples slowly close up again, tender and puffy.",
          "The nipple leeches drop off, done, and your nipples ache as they shrink back to how they were. Mostly."
        ],
        starved: [
          "Nobody's fed them in hours. The leeches go limp and slide off, and your nipples close up, achin' and empty."
        ]
      }
    }
  });

  // dispensary/src/farm.js
  var W21 = window;
  function send3(type, data) {
    try {
      if (botHere() && typeof W21.ServerSend === "function") {
        W21.ServerSend("ChatRoomChat", makeMsg(type, data, BOT));
        return true;
      }
    } catch (e) {
    }
    return false;
  }
  var helloAt = 0;
  var helloSig = "";
  var onNow = () => doseIds().filter(active).sort();
  var sigNow = () => JSON.stringify([allowed(BOT), lscgPresent(), Object.keys(st().off).sort(), hardOn(), hardOn() ? keyholders() : [], hardOn() ? Math.floor(dueAt() / 36e5) : 0, onNow(), craving(), carryHello(), nipsOpen()]);
  function hello(force) {
    const now = Date.now(), sig = sigNow();
    if (!force && sig === helloSig && now - helloAt < 30 * 6e4) return false;
    if (!send3("dispHello", {
      ver: VERSION,
      farm: allowed(BOT),
      lscg: lscgPresent(),
      off: Object.keys(st().off),
      hard: hardOn(),
      due: hardOn() ? dueAt() : 0,
      keys: hardOn() ? keyholders() : [],
      on: onNow(),
      crave: craving(),
      holes: 1,
      seed: 1,
      breed: 1,
      nips: nipsOpen(),
      ...carryHello()
    })) return false;
    helloAt = now;
    helloSig = sig;
    return true;
  }
  var tellSafeword = () => send3("dispSafeword", {});
  var tellNipLoad = (by) => send3("dispNipLoad", { by: Number(by) || 0 });
  function onDoseCall(m) {
    const id = String(m.dose || ""), B = BOOK[id];
    const reply = (ok, why) => {
      send3("doseDone", { id: m.id, dose: id, ok: !!ok, why: why || "" });
      return { ok: !!ok, why: why || "" };
    };
    if (!B) return reply(false, "unknown");
    if (!allowed(BOT)) return reply(false, "ladder");
    if (st().off[id]) return reply(false, "off");
    const by = Number(m.by) || BOT, x = Math.max(1, Math.min(5, Math.round(Number(m.x) || 1)));
    const mins = Number(m.mins) > 0 ? Math.min(48 * 60, Number(m.mins)) : void 0, line3 = m.line ? String(m.line).slice(0, 900) : void 0;
    if (B.lscg && lscgPresent()) {
      if (m.hand) return reply(true, "lscg");
      const ok = lscgDose(B.lscg, { x, by });
      if (ok && line3 && !m.quiet) action(line3);
      return reply(ok, ok ? "lscg" : "lscg-off");
    }
    const twice = lscgHas(id) && Date.now() - lastLscgDose(id) < 8e3;
    const r = give(id, { by, x, mins, line: line3, upto: twice, quiet: twice || !!m.quiet });
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
    if (m.type === "dispLatch") {
      if (/^nips$/.test(String(m.kind))) latch("nips", { by: BOT, name: typeof m.name === "string" ? m.name.slice(0, 30) : "The barn" });
      return;
    }
    if (m.type === "dispWelcome") {
      const S3 = st();
      S3.farm = Array.isArray(m.farm) ? m.farm.filter((x) => Number.isInteger(x) && x > 0).slice(0, 300) : S3.farm;
      if (typeof m.stock === "boolean") S3.stock = m.stock;
      if (typeof m.species === "string" && /^[a-z]{2,20}$/.test(m.species)) S3.speciesFarm = m.species;
      S3.farmAt = Date.now();
      save();
      try {
        holesWelcome(m);
      } catch (e) {
      }
      try {
        seedWelcome(m);
      } catch (e) {
      }
      try {
        breedWelcome(m);
      } catch (e) {
      }
      try {
        carryWelcome(m);
      } catch (e) {
      }
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
      mod2.hookFunction("ChatRoomMessage", 11, (args, next2) => {
        try {
          const data = args[0];
          if (data && data.Type === "Hidden" && data.Sender === BOT) {
            const m = readMsg(data);
            if (m) onFarmMsg(m);
          }
        } catch (e) {
          console.warn("[Dispensary] farm:", e);
        }
        return next2(args);
      });
    } catch (e) {
      console.warn("[Dispensary] can't hear the farm girl:", e);
    }
    try {
      mod2.hookFunction("ChatRoomSync", 2, (args, next2) => {
        const r = next2(args);
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
        mod2.hookFunction(f, 0, (args, next2) => {
          const r = next2(args);
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
    const cut2 = w.replace(ENDINGS, "");
    if (cut2 !== w && cut2.length > 1) {
      if (WORDS[cut2]) return WORDS[cut2];
      const again = cut2.replace(ENDINGS, "");
      if (WORDS[again]) return WORDS[again];
    }
    if (/ves$/.test(w) && WORDS[w.replace(/ves$/, "f")]) return WORDS[w.replace(/ves$/, "f")];
    return null;
  };
  var INSIDE = Object.keys(WORDS).filter((w) => w.length >= 3).sort((a, b) => b.length - a.length);
  function speciesKeyOf(text3) {
    const low = String(text3 || "").toLowerCase().replace(/[^a-z\s\/-]/g, " ").replace(/\s+/g, " ").trim();
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
    pup: ["arf", "woof", "awoo", "whine"],
    dog: ["woof", "arf", "ruff", "whine"],
    kitty: ["mew", "nya", "mrrp", "purr"],
    cat: ["meow", "mrrp", "purr"],
    bunny: ["squeak", "eep"],
    rabbit: ["squeak", "eep"],
    pig: ["oink", "snrk"],
    goat: ["baa", "maa"],
    sheep: ["baa", "baaa"],
    fox: ["yip", "ack"],
    wolf: ["awoo", "grr", "growl", "howl"],
    deer: ["bleat", "mweh"],
    goblin: ["heh", "nngh"],
    rat: ["squeak", "eek", "chitter"],
    dragon: ["rawr", "grr", "hsss", "rumble"],
    kitt: ["mew", "nya", "mrrp", "purr"]
  };
  var ANIMALS = Object.keys(NOISES).filter((k) => k !== "kitt");
  var noisesOf = (species) => NOISES[String(species || "").toLowerCase()] || NOISES[speciesKeyOf(species)] || NOISES.cow;
  function mooify(text3, species, share) {
    const say4 = noisesOf(species);
    const keep = 1 - (typeof share === "number" ? Math.max(0, Math.min(1, share)) : 0.5);
    return String(text3).replace(/[A-Za-z']{3,}/g, (w) => {
      if (Math.random() < keep) return w;
      const n = say4[Math.floor(Math.random() * say4.length)];
      return w[0] === w[0].toUpperCase() ? n[0].toUpperCase() + n.slice(1) : n;
    });
  }
  function tongueSpeak(text3, species, x) {
    const say4 = noisesOf(species), n = () => say4[Math.floor(Math.random() * say4.length)];
    const cap = (w, v) => /[A-Z]/.test(w[0]) ? v[0].toUpperCase() + v.slice(1) : v;
    x = Math.max(1, Math.round(Number(x) || 1));
    if (x >= 3) return String(text3).replace(/[A-Za-z][A-Za-z']*/g, (w) => cap(w, n()));
    if (x === 2) return mooify(text3, species, 0.5);
    const words = String(text3).split(" "), out = [];
    words.forEach((w, i) => {
      out.push(w);
      if (i < words.length - 1 && Math.random() < 0.25) out.push("*" + n() + "*");
    });
    if (out.length === words.length) out.splice(words.length > 1 ? 1 + Math.floor(Math.random() * (words.length - 1)) : 1, 0, "*" + n() + "*");
    return out.join(" ");
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
  function airhead(text3, x) {
    const p = Math.min(0.6, 0.2 + 0.08 * (x || 1));
    const words = String(text3).split(" ");
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
  function babble(text3, x) {
    const p = Math.min(0.55, 0.15 + 0.08 * (x || 1));
    const words = String(text3).split(" "), out = [];
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
  function sprinkle(text3, bits, every) {
    const words = String(text3).split(" ");
    if (words.length < 2) return text3 + " " + pickOf2(bits);
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
  function dosedSpeech(text3) {
    let t = String(text3);
    if (active("moo")) t = mooify(t, st().species || st().speciesFarm || "cow", Math.min(0.9, 0.4 + 0.1 * xOf2("moo")));
    if (active("tongue")) t = tongueSpeak(t, tongueAnimal(partOf("tongue")), xOf2("tongue"));
    if (active("hiccup")) t = sprinkle(t, ["*hic*", "*hic!*", "\u2014hic\u2014"], 4);
    if (active("feather")) t = sprinkle(t, GIGGLES, 5);
    if (active("airhead")) t = airhead(t, xOf2("airhead"));
    if (active("babble")) t = babble(t, xOf2("babble"));
    return t;
  }
  var touched = () => ["moo", "tongue", "hiccup", "feather", "airhead", "babble"].some(active);
  var echoN = 0;
  var echoAt = 0;
  var echoSince = 0;
  function echoHeard(text3, now) {
    const d = st().doses.echo;
    if (!active("echo") || !d) return false;
    if (d.at !== echoSince) {
      echoSince = d.at;
      echoN = 0;
      echoAt = 0;
    }
    const t = String(text3).trim();
    now = now || Date.now();
    if (echoN >= 2 || now - echoAt < 18e4 || t.length < 4 || t.length > 140 || /^[?!.\-\/(*]/.test(t) || Math.random() < 0.5) return false;
    echoN++;
    echoAt = now;
    const line3 = LINES.echo[Math.floor(Math.random() * LINES.echo.length)].replace(/%t/g, myName()).replace(/%s/g, t.replace(/[()'"]/g, ""));
    setTimeout(() => action(line3), 2500);
    return true;
  }
  function initSpeech(mod2) {
    try {
      mod2.hookFunction("ServerSend", 6, (args, next2) => {
        try {
          const d = args[1];
          if (args[0] === "ChatRoomChat" && d && d.Type === "Chat" && typeof d.Content === "string" && touched() && !/^\s*[(\[?!./\-*]/.test(d.Content))
            args = [args[0], Object.assign({}, d, { Content: dosedSpeech(d.Content) })];
          if (args[0] === "ChatRoomChat" && args[1] && args[1].Type === "Chat" && typeof args[1].Content === "string") echoHeard(args[1].Content);
        } catch (e) {
          console.warn("[Dispensary] speech:", e);
        }
        return next2(args);
      });
    } catch (e) {
      console.warn("[Dispensary] what you say can't be dosed:", e);
    }
  }

  // dispensary/src/screen.js
  var W22 = window;
  var el2 = null;
  var styled = false;
  var CSS2 = `
#fd-screen{position:fixed;inset:0;pointer-events:none;z-index:2147482000;transition:opacity 1.5s ease}
#fd-screen.breathe{animation:fd-breathe 7s ease-in-out infinite}
#fd-screen.pulse{animation:fd-pulse 2.4s ease-in-out infinite}
@keyframes fd-breathe{0%,100%{opacity:.35}50%{opacity:1}}
@keyframes fd-pulse{0%,100%{opacity:.25}50%{opacity:.9}}
@media (prefers-reduced-motion: reduce){#fd-screen.breathe,#fd-screen.pulse{animation:none;opacity:.6}}
`;
  function ensure() {
    if (!styled) {
      const s = W22.document.createElement("style");
      s.textContent = CSS2;
      W22.document.head.appendChild(s);
      styled = true;
    }
    if (!el2) {
      el2 = W22.document.createElement("div");
      el2.id = "fd-screen";
      el2.setAttribute("aria-hidden", "true");
      W22.document.body.appendChild(el2);
    }
    return el2;
  }
  var arousal = () => {
    const A = W22.Player && W22.Player.ArousalSettings;
    return A ? Number(A.Progress) || 0 : 0;
  };
  function screenNow() {
    if (active("tunnel") && W22.CurrentScreen === "ChatRoom") return { bg: "radial-gradient(circle at 50% 45%, transparent 16%, rgba(0,0,0,.93) 30%, #000 60%)", cls: "", id: "tunnel" };
    if (st().screen === false || W22.CurrentScreen !== "ChatRoom") return null;
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
      if (el2) {
        el2.remove();
        el2 = null;
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
    const el3 = window.document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v === void 0 || v === null || v === false) continue;
      if (k.startsWith("on") && typeof v === "function") el3.addEventListener(k.slice(2), v);
      else if (k === "class") el3.className = v;
      else if (k === "style" && typeof v === "object") Object.assign(el3.style, v);
      else if (k === "value") {
        el3.value = v;
        el3.setAttribute("value", v);
      } else el3.setAttribute(k, v === true ? "" : String(v));
    }
    add(el3, kids);
    return el3;
  }
  function add(el3, kids) {
    for (const k of kids) {
      if (k === null || k === void 0 || k === false) continue;
      if (Array.isArray(k)) add(el3, k);
      else el3.appendChild(typeof k === "object" ? k : window.document.createTextNode(String(k)));
    }
  }

  // dispensary/src/guides.js
  var GUIDES = [
    {
      id: "start",
      icon: "\u{1F4D6}",
      title: "Getting started",
      intro: "The Dispensary doses you from crafted items, anywhere in the club: a needle, a drink, a treat, somethin' you wear. Nothin' takes that you haven't let in, and the way out is always one button.",
      steps: [
        "Pick who can dose you under Who can dose you. It starts at your owner, your lovers and the farm. You can always dose yourself.",
        "Look down the Doses list and switch off anythin' you don't want. Off is a hard no, from anybody.",
        "Pick your clock: While online only counts down while you're logged in. Real time keeps goin' while you're away, and every dose runs longer to make up for it.",
        "Somebody on your list uses a crafted needle, drink or treat on you. The words on it are the dose: the room sees it go in, and it shows under In you now with the time left.",
        "Had enough? The red Safeword button, the game's own safeword, or /dispensary safeword lifts every dose at once."
      ],
      tips: [
        "Only you need the Dispensary for it to work on you. Whoever holds the needle doesn't.",
        "/dispensary on its own tells you what's in you and who can dose you. /dispensary page opens this page.",
        "Screen touches and dose icons are only seen by people with the Dispensary, and you can switch both off under Touches."
      ],
      see: ["craft", "give", "safety"]
    },
    {
      id: "craft",
      icon: "\u{1F9EA}",
      title: "Crafting a dose",
      intro: "A dose is just words on a crafted item. The game's crafting lets you name an item and write it a description, and the Dispensary reads both.",
      steps: [
        "Open the game's Crafting: the Crafting button in the Main Hall, or the crafting button in an item's own menu.",
        "Pick the item. A needle is the Medical Injector. A drink is the Filled Glass or the Mug. A treat is the Chocolate Bar, the Grilled Sausage or the Popcorn. For gear, anythin' you can wear.",
        "Put the dose's words in the name or the description: Statue Serum, Denial Serum, Needy Nectar. Each dose's words are listed with it under Doses. A name only holds 30 letters, so a long recipe goes in the description.",
        "Want it stronger? Add x2 to x5, or double or triple. Denial Serum x3 is three doses' worth of time in one go.",
        "Put more than one dose on it if you like: every dose it names goes in.",
        "Some doses take one more word, for where or what: see Doses that pick.",
        "Save it. It's in your crafted items for good, to use as often as you like."
      ],
      craft: [
        { name: "Denial Serum x2", note: "four hours with no cummin'", expect: ["denial"] },
        { name: "Marble Statue Serum", note: "half an hour as a marble statue", expect: ["statue:marble"] },
        { name: "Sweet Little Drink", desc: "laced with needy nectar and heat mist", note: "a drink with two doses in it, for a Filled Glass or a Mug", expect: ["needy", "heat"] }
      ],
      tips: [
        'Write it however you like round the words: "a big fat shot of Denial Serum, x2" works the same.',
        "The words have to be the dose's own. Heat on its own isn't Heat: heat mist or heat inducer is."
      ],
      see: ["give", "pick", "gear"]
    },
    {
      id: "give",
      icon: "\u{1F489}",
      title: "Dosing somebody",
      intro: "Hold your crafted item and use it on them, the game's own way. Their Dispensary does the rest.",
      steps: [
        "Put your crafted Medical Injector, glass, mug or treat in your hand. It goes in the hand slot like anythin' you hold.",
        "Click them, pick the spot, and use the game's action: Inject on the neck, arms, breasts, butt, thighs, feet or clit; Sip on the mouth for a glass or mug; Eat on the mouth for a treat.",
        "Their Dispensary reads the words on what's in your hand. If you're on their list and that dose is switched on for them, it takes, and the room sees it.",
        "If it didn't take, they're told why: you're not on their list, or they've switched that dose off. That's their limit, so leave it be."
      ],
      tips: [
        "They need the Dispensary for it to take. You don't.",
        "You can dose yourself the same way, on your own body.",
        "A needle that also says time-release goes off later instead: see Time-release, tolerance and cravings.",
        "On the farm, with the farm girl in the room, a farm shot is hers to read and book. Their Dispensary still does the feelin'."
      ],
      see: ["craft", "gear", "timing"]
    },
    {
      id: "gear",
      icon: "\u26D3\uFE0F",
      title: "Gear that doses",
      intro: "Crafted gear doses whoever wears it, when its words name a dose and say how. A gag, a collar, a plug, piercings, a harness: anythin' worn.",
      steps: [
        "Drip: drip, IV, laced, coated, soaked, infused or seeping. It keeps the dose in them the whole time it's on, and it wears off soon after it comes off.",
        "Injector: injector, auto-inject, dosing, dispenser or pump. A fresh dose every 30 minutes while it's on. Write every 10 minutes, or any number, to set your own.",
        "Triggers: on climax, when kissed, when touched or when spanked. A dose each time it happens, at most every two minutes.",
        "Roulette: roulette or mystery dose. A different dose every time, picked from the ones they allow. It works on needles and drinks too.",
        "Lip gloss: lip gloss, lipstick, lip balm or lip stain with a dose on it, worn by you. Whoever you kiss gets the dose."
      ],
      craft: [
        { name: "Drip Gag", desc: "an IV drip of denial serum", note: "kept denied as long as it's buckled in", expect: ["denial"] },
        { name: "Kiss Me Collar", desc: "sedative when kissed", note: "every kiss makes them drowsier", expect: ["sedative"] },
        { name: "Cherry Lip Gloss", desc: "needy nectar lip gloss", note: "wear it, and whoever you kiss gets needy", expect: ["needy"] },
        { name: "Roulette Plug", desc: "auto-injector, mystery dose every 20 minutes", note: "a surprise every twenty minutes", expect: [] }
      ],
      tips: [
        "For gear it's whoever crafted it that has to be on the wearer's list. The game keeps the crafter's number on the item. Your own crafts always count.",
        "The safeword clears what's in you and rests all your gear for 15 minutes.",
        "LSCG's own soaked and laced gear stays LSCG's."
      ],
      see: ["craft", "horny", "kits"]
    },
    {
      id: "timing",
      icon: "\u23F3",
      title: "Time-release, tolerance and cravings",
      intro: "Doses that wait, doses that take less the more you have, and doses you start wantin'.",
      steps: [
        "Time-release: a needle or drink that also says time-release, slow-release, delayed or capsule doesn't hit at once. It goes off 5 to 40 minutes later, at a moment nobody knows, and waits for them to be in a room so it's seen. Up to five can wait in somebody.",
        "Tolerance, your switch under How doses take you: the same dose again within 3 hours takes a fifth less for each one before it, down to two fifths. You're told when it does.",
        "Cravings, your switch too: once you've had six doses in three days, now and then, with nothin' in you, you want another. A note only you see. On the farm the farm girl notices and offers: say ?fix and she sees to it."
      ],
      craft: [
        { name: "Sedative Capsule", desc: "time-release", note: "goes off somewhere in the next forty minutes", expect: ["sedative"] }
      ],
      tips: [
        "Your safeword, the Purge, and a keyholder lettin' you out all clear the capsules still waitin'.",
        "Only doses from when you switch cravings on count toward them."
      ],
      see: ["give", "safety"]
    },
    {
      id: "pick",
      icon: "\u{1F39B}\uFE0F",
      title: "Doses that pick",
      intro: "A few doses take one more word on the bottle, for where they go or what they make you.",
      steps: [
        "Fill-Out: swells your tits, unless it says belly or ass.",
        "Tender: names its spot: nipples, tits, clit, pussy, ass, neck, ears, lips, belly, thighs or feet. With no spot named it goes where you picked under How doses take you.",
        "Statue Serum: stone, unless it says porcelain, gold, latex, marble or bronze. Everybody with the Companion sees you turned.",
        "Animal Tongue: a puppy, kitty, pony, cow, bunny, fox, goat, lamb, piggy, wolf, dragon or rat tongue. Animal tongue on its own makes you your own animal, picked under Touches.",
        "Growth: Udder, Booty, Cock and Balls Growth grow you a size, and it stays (Hip or Rear Growth is the booty too). A Reducing Serum takes a size back off: cock, balls or booty if it says so, tits otherwise.",
        "Ass Growth is the farm's own shot: it opens your ass a size for good, Pussy Gape or Pussy Growth your pussy. A Tightening Balm closes it back up.",
        "Tightening Balm: closes up what it names: nipples, pussy, ass or throat. Virgin balm, or a balm for every hole, does them all.",
        "Purge: lifts every dose in you, there and then.",
        "Kit: puts an outfit on them. See Kits."
      ],
      craft: [
        { name: "Fill-Out, belly x2", note: "a full round belly for an hour", expect: ["fillout:belly"] },
        { name: "Gilding Serum", note: "half an hour as a gold statue", expect: ["statue:gold"] },
        { name: "Kitty Tongue Tonic", note: "talkin' like a kitty for half an hour", expect: ["tongue:kitty"] },
        { name: "Tender Drops", desc: "for the clit", note: "every touch there counts three times over", expect: ["tender:clit"] },
        { name: "Pussy Tightener", note: "snug again, right away", expect: ["balm"] }
      ],
      see: ["craft", "holes", "nipples"]
    },
    {
      id: "kits",
      icon: "\u{1F457}",
      title: "Kits",
      intro: "A kit is a saved outfit a dose puts on somebody, a piece at a time, held on while the dose lasts.",
      steps: [
        "To be dressed by kits, switch on Kits can dress me under Kits. It's off to start. Pick clothes, restraints or both, and how fast it goes on.",
        "To make a kit, put the outfit on yourself and type /dispensary kit save <name>. You can keep eight. An outfit you've saved in LSCG works too, by its name.",
        "Craft a dose that says Kit: <name> on a needle, a drink or gear.",
        "Dose somebody with it while you're in the room. Their Dispensary asks yours for the outfit, and it creeps onto them, held on for half an hour a dose. Anythin' they take off creeps back on.",
        "When it's over, by its time, a safeword or a Purge, the kit comes off and their own outfit slips back on."
      ],
      craft: [
        { name: "Kit: maid", desc: "a needle full of frills", note: "your saved maid outfit goes on them", expect: ["kit"] },
        { name: "Kit: latex pet", desc: "it creeps on, shiny and tight", note: "the latex in its name gives it the livin' gear lines as it goes on", expect: ["kit"] }
      ],
      tips: [
        "It never touches their body, nothin' they've blocked, nothin' the room won't allow, and never goes over somethin' locked on them.",
        "The pieces keep their crafts: a horny plug in a kit is horny, a dilator drip in one keeps them open.",
        "Words on the bottle flavour the lines: livin', latex, tentacle or slime; demonic, cursed or sigils; hypno, trance or conditioning.",
        "/dispensary kit stop takes a kit off you early, unless you're locked in hardcore. /dispensary kit shows yours and all the settings."
      ],
      see: ["give", "gear", "horny"]
    },
    {
      id: "horny",
      icon: "\u{1F525}",
      title: "Horny gear",
      intro: "Gear with a mind of its own. It uses whoever wears it, all by itself.",
      steps: [
        "Craft gear that says horny or hungry in its name or description: a plug, a dildo, a gag, nipple gear, a crotch rope or belt. Insatiable or ravenous makes it busier and rougher.",
        "Put it on somebody, or wear it yourself. Every six to ten minutes it has its way with them. Insatiable gear goes every two to four.",
        "Where it's worn says what it does: in a pussy or ass it thrusts, on nipples it suckles and tugs, in a mouth it fucks their throat, at the crotch or waist it grinds.",
        "Each time, their arousal goes up a step. Close enough, with nothin' denyin' them, it makes them cum.",
        "Add breeding or seeding to it: when they cum, it cums too, and fills them with your seed. Write how much on it, like 300 ml, or it leaves a thick load in whatever hole it's in."
      ],
      craft: [
        { name: "Hungry Tentacle Plug", note: "thrusts every few minutes", expect: [] },
        { name: "Insatiable Breeding Gag", note: "fucks their throat every couple of minutes, and fills it when they cum", expect: [] }
      ],
      tips: [
        "The wearer's switch: Horny gear can use me, on to start. /dispensary horny on or off.",
        "The crafter has to be on the wearer's list.",
        "A parasite crafted horny is twice as busy, and squirms between feeds.",
        "It rests while they're out of a room, and after a safeword."
      ],
      see: ["holes", "nipples", "breeding"]
    },
    {
      id: "breeding",
      icon: "\u{1F4A6}",
      title: "Seed, breedin' and carryin'",
      intro: "Your own seed, in whoever you dose, as much as you like and wherever you say. Theirs to hold, drip, and on the farm, to catch.",
      steps: [
        "Craft a syringe, a baster, a drink or a bit of gear that says it carries seed: Insemination, Seed Syringe, Cum Shot, Breeding Baster, Cum Cocktail, or just filled with my seed. It's always the crafter's own seed, whoever's holdin' it.",
        "Say how much and where, in mL, litres or gallons: 500 ml pussy, 1 L ass, 2 gallons mouth, 50 ml nipples. Every hole fills them all, nipples too while they're open; both holes means pussy and ass.",
        "No hole written, and a needle puts it in their pussy, or their ass if they've no pussy. A drink or a kiss sends all of it down their throat. A hole with no amount gets a thick load.",
        "A belly only holds so much: 200 mL to start, more with a capacity shot on the farm. The rest spills back out, down their thighs. Their tits hold a litre.",
        "A Breeder's Seal is gear that says so: Breeder's Seal, Breeding Seal, Sire's Seal, Seed Lock or Cum Stopper. Worn in their pussy or ass, or as a belt over both, it keeps every drop in, however much, opens only for its maker's seed, and while it's in, only its maker's loads can catch.",
        "Take the seal out and most of what it held gushes out with it.",
        "Off the farm, what's in them drains slowly, faster from a looser hole, and drips down their thighs where the room can see. A plug or a seal holds it in.",
        "Every load goes to the farm girl's books, straight away if she's in the room, or the next time they're in hers. There it can catch, with the crafter as sire: they need ?breedable on, and Fertile. A Sure-Catch Serum makes it take.",
        "Breed me anywhere, your switch under Seed, off to start: off the farm, a real cock that cums in you, through the game's own actions, leaves a real load of theirs on your books, and on the farm's, where it can catch. Only from somebody on your list.",
        "A knotted cock ties you: for its minutes you can't step away from them on a map, and the room sees it swell and lock. It never stops you leavin' a room. Theirs knows it's knotted when they run the Dispensary too and the farm's measured their cock.",
        "Keep it in: on all fours, knees spread, or hogtied within five minutes of a load in your pussy or ass, and it gets another chance to take, half again as likely.",
        "Ripe days: Fertile on the farm, two days in every seven you're ripe, achin' for it, and every load takes twice as easy. You feel them anywhere, and now and then the room can tell.",
        "Brood Womb, a farm switch, ?broodwomb on: once you're carryin', every load that lands in you takes too, and makes your litter bigger, up to the farm's hyper sizes.",
        "Carryin' goes with you: the farm tells your Dispensary, and wherever you are you feel it take hold, show and grow heavy, your tits leak, you crave seed, and your drawn belly grows with it.",
        "Your natural heat comes on wherever you are, and studs runnin' the Dispensary catch the scent.",
        "Due away from the farm? Your labour happens right where you are, and anybody who touches your belly is your midwife. A clutch of eggs comes out the same way. The farm girl books them next time you're in her room, and for the hour after a birth you're wide open.",
        "A Quickening Draught takes a day off. A Breeder's Scan, by needle or held while they touch your belly, tells the room what's in you. Twenty litters makes you a Baby Factory."
      ],
      craft: [
        { name: "Seed Syringe", desc: "500 ml pussy, 1 L ass", note: "a needle: half a litre in their pussy and a litre in their ass, most of it spillin' back out", expect: ["seed"] },
        { name: "Breeding Baster", desc: "2 gallons in every hole", note: "two gallons in every hole they've got", expect: ["seed"] },
        { name: "Cum Cocktail", desc: "my seed, 300 ml", note: "a glass to Sip to them: 300 mL down their throat", expect: ["seed"] },
        { name: "Breeder's Seal", note: "a plug: worn in their pussy or ass, it keeps your seed in and everybody else's out", expect: [] },
        { name: "Hungry Breeding Plug", desc: "150 ml", note: "horny gear that cums with them and leaves 150 mL of yours in them", expect: [] },
        { name: "Quickening Draught x2", note: "two days closer to due, and their belly swells with it", expect: ["quicken"] },
        { name: "Breeder's Scan", note: "a needle, or hold it and touch their belly: the room hears what's in there", expect: ["scan"] }
      ],
      tips: [
        "Add x2 to x5 for that many times as much.",
        "Seed is a dose like any other: whoever holds it and whoever crafted it both have to be on their list, and it has its own switch under Doses.",
        "The farm counts one load from the same crafter every ten minutes. More still fills them, it just isn't another load on the books.",
        "Under Seed on this page, and with /dispensary seed: what's in them now, whose it is, and every load they've taken. Let it all out empties what isn't sealed in.",
        "The Womb Mark, in any Farm Ink slot in the wardrobe: a little heart inked in for every litter, it glows hot pink while you're carryin' with a dot for each one in there, and at twenty litters it reads BABY FACTORY."
      ],
      see: ["horny", "holes", "farm"]
    },
    {
      id: "nipples",
      icon: "\u2B55",
      title: "Nipples",
      intro: "Nipples that open up, take toys and cocks, and learn to stay open.",
      steps: [
        "Open them: a Nipple Dilator dose, wider the stronger it is; anythin' worn on the nipples crafted to say dilator or stretcher, like Dilator Clamps, which hold them open as long as they're on; or nipple leeches.",
        "While they're open, two new actions show on the nipples in the game's action menu: Fuck nipple, for somebody with a cock, and Finger nipple, for anybody, you too.",
        "Toys fit too. The nipple slot has nipple plugs, beads, eggs, dildos, a sound and pump-ups: the game's own toys made for an open nipple. Whoever owns the toy owns its nipple version. A toy in them holds them open.",
        "Or force them: /dispensary nips open leaves yours gapin' right now (1, 2 or 3 after it for how wide), and the Open them up button under Nipples opens them a step wider. /dispensary nips open <who> does it to somebody who lets you dose them.",
        "Held open and used, they train, a step an hour: three hours held wide and they're gapin'. The stretch stays after the dose wears off or the leeches drop.",
        "A load in them wells back out, and it's counted.",
        "On the farm, the traps use them too: a knot tied in a nipple, eggs laid in your tits, tendrils, goblins, the pump, the milkers, the kraken. The milkers open shut ones if the farm's on your list. Put nipples in your farm limits to keep the traps off them.",
        "Close them up with the button under Nipples, /dispensary nips close, or a Tightening Balm."
      ],
      craft: [
        { name: "Nipple Dilator x2", note: "held open wider, for two hours", expect: ["dilator"] },
        { name: "Dilator Clamps", note: "worn on the nipples: keeps them open the whole time they're clamped on", expect: [] }
      ],
      tips: [
        "Your switch: They close up slowly on their own, half a step a day once they've been left be twelve hours. Off, they stay as they're trained.",
        "A locked nipple plug holds them open till whoever holds its key takes it out."
      ],
      see: ["holes", "parasites", "pick"]
    },
    {
      id: "holes",
      icon: "\u{1F3AF}",
      title: "Hole training",
      intro: "Your pussy, ass and throat stretch to what's put in them, and with the right toys they learn to stay that way.",
      steps: [
        "A toy in you stretches you to its size: plugs, dildos, eggs, beads, and gags that go in. Bigger names go bigger: big, thick, huge, XL, monster, horse, colossal.",
        "One size past what you're trained is a good stretch, two aches, three or more hurts. Cruel or sadist on it means it every time.",
        "To train you, a toy has to say so: stretcher, trainer, gaper, dilator or widener, or cruel, or a goal. While it's in, it works you open, faster the bigger it is: a size every 12 hours at one size past you, every 6 at three.",
        "A goal goes on the toy, like goal: gaping in 2 days. Anybody who can dose you can also set one by command: /dispensary train <who> <ass|pussy|throat> <size> in 3 days.",
        "A pump or beads crafted as a trainer grows with you, a little at a time.",
        "Fingers, fists, cocks and toys used on you count too, and a load in a loose hole drips back out.",
        "Ass Growth, Anal Gape or Pussy Gape on a needle opens a hole a size for good, the farm's own shot, up to natural off the farm.",
        "Tighten up with a Tightening Balm that names the hole, or pick your own size under Holes."
      ],
      craft: [
        { name: "Cruel Training Plug", desc: "goal: gaping in 2 days", note: "a black butt plug that aches and works you to gaping by the day after tomorrow", expect: [] },
        { name: "Throat Trainer Gag", desc: "goal: deep", note: "a dildo gag that teaches a throat to take it deep", expect: [] }
      ],
      tips: [
        "Pussy and ass sizes: tight, snug, slightly gaped, gaped, loose, well-used, gaping, wide open, cavernous, ruined. A throat: gaggy, tight, learnin', eager, practiced, trained, deep, greedy, past gaggin', bottomless.",
        "Your switches: They close up slowly on their own, off to start, and Too-big toys can hurt, on to start. Off, a too-big toy only aches.",
        "On the farm's books, the farm girl keeps your numbers, and your Dispensary hands her what happened off the farm next time you're in her room.",
        "/dispensary holes shows all three, and /dispensary train <who> clear lifts a goal."
      ],
      see: ["nipples", "horny", "pick"]
    },
    {
      id: "parasites",
      icon: "\u{1F41B}",
      title: "Parasites",
      intro: "Crafted critters that latch on and do their own thing. Every kind is yours to switch on, and all are off to start.",
      steps: [
        "Switch on each kind you'll take, under Parasites.",
        "Somebody crafts an item that names one, a gag, a plug, a collar, a harness, anythin', and puts it on you. The crafter has to be on your list.",
        "Most latch on and stay even once the item comes off. The leash vine and the mouthpiece only work while worn.",
        "Name doses on the item too, and that's its strain: what it feeds you. None named, it feeds you the farm's own brew.",
        "Parasite lips: feed you every half hour for 12 hours, leave you cravin' a load, and spread by a kiss.",
        "Livin' latex: drinks every climax and stays as long as it's fed; fed, everythin' feels more.",
        "Milk moss: keeps you leakin', and feeds on every let-down.",
        "The nestling: grows a stage every time you cum, and your belly fills out with it.",
        "The brood mother: lays a tiny one now and then, that goes to whoever you kiss next, if they take parasites.",
        "The leash vine: you can't stray more than a few tiles from whoever crafted it, on a map. It never stops you leavin' a room.",
        "The mouthpiece: its crafter can put words in your mouth.",
        "Nipple leeches: hold your nipples open for a day, wider once they've fed three times."
      ],
      craft: [
        { name: "Parasite Lips Gag", desc: "needy nectar and heat mist", note: "lips that latch on and feed both", expect: ["needy", "heat"] },
        { name: "Leash Vine Collar", note: "keeps them close to you on a map", expect: [] }
      ],
      tips: [
        "The mouthpiece's crafter types /dispensary mouth <name> <words>. You see the words first: /dispensary say says them, /dispensary nope lets them pass. Or switch them straight out under Parasites.",
        "The safeword and the Purge take every parasite off."
      ],
      see: ["nipples", "horny", "gear"]
    },
    {
      id: "safety",
      icon: "\u{1F6E1}\uFE0F",
      title: "Your list, your clock, your safeword",
      intro: "The parts that keep it yours.",
      steps: [
        "Who can dose you is a ladder: only me, my owner, then lovers, the farm, your whitelist, your friends, everyone but your blacklist, and everyone. Each step lets in everybody above it.",
        "The farm means the farm girl, the proprietors and the farm's staff.",
        "Each dose has its own switch under Doses. Off is a hard no, from anybody on your list.",
        "While online counts down only while you're here. Real time keeps counting while you're away, and every dose runs longer to make up for it. Hover the clock for how much.",
        "Your safeword lifts every dose, clears the capsules waitin' in you, takes off parasites and kits, and rests your gear for 15 minutes. The game's own safeword and LSCG's do it too."
      ],
      tips: [
        "Goin' offline is never held against you.",
        "OOC and beepin' the farm are never blocked by anythin' in here.",
        "Outside hardcore, your settings are yours alone. Nobody else changes them."
      ],
      see: ["start", "hardcore"]
    },
    {
      id: "hardcore",
      icon: "\u{1F512}",
      title: "Hardcore and keyholders",
      intro: "Lock yourself in. Your keyholders hold your settings and your way out.",
      steps: [
        "Get a keyholder. Your owner always is one; if you're on the farm's books, the proprietors are; and you can add anybody by member number under Keyholders, up to ten.",
        "Under Hardcore, pick how long: 1 to 30 days, or no end date.",
        "Lock me in. Only you can do this, for yourself, after a plain warnin'.",
        "From then you can look at your settings but not change them, and your safeword asks your keyholders to let you out instead of liftin' your doses.",
        "It ends on its date. With no date, it lets go after 30 days without a keyholder checkin' in. Bein' in a room with one counts by itself."
      ],
      tips: [
        "Your keyholders can check in, let you out with every dose lifted, change who can dose you, your clock and which doses are on, or end it. Every change shows to you, and the last few are listed under Hardcore.",
        "Holdin' somebody's key? Keys you hold shows up at the bottom of your page: Check in, Let out, End hardcore, and Their settings when you're in a room together. Out of the room it goes by beep, which needs you to be friends.",
        "The farm's own ?safeword always works, hardcore or not."
      ],
      see: ["safety", "start"]
    },
    {
      id: "farm",
      icon: "\u{1F404}",
      title: "The farm and LSCG",
      intro: "How the Dispensary works alongside B&B Farm and LSCG.",
      steps: [
        "On B&B Farm the farm girl reads farm shots and keeps the books: milk, heat, denial, sentences. Your Dispensary does the feelin', the seein' and the sayin'. Leave the farm on your ladder for her shots to take.",
        "On the farm's books, she keeps your holes too, and gets what happened off the farm next time you're in her room.",
        "Seed is hers to book too: every load, whose it was, and whether it catches.",
        "With LSCG loaded, its sedative, aphrodisiac, mind control, suggestible and antidote are LSCG's own, and LSCG's settings decide those.",
        "Our doses are in LSCG's Drug Enhancements list too: switch them on there as well, and LSCG shows a bar with the time left."
      ],
      tips: [
        "Suggestible needs LSCG.",
        "Cravin'? With the farm girl in the room, say ?fix."
      ],
      see: ["start", "holes"]
    },
    {
      id: "commands",
      icon: "\u2328\uFE0F",
      title: "Every command",
      intro: "Everythin' you can type, in chat. Most of it's on this page too.",
      steps: [
        "/dispensary: what's in you, and who can dose you.",
        "/dispensary page: opens this page. /dispensary guide <topic> opens a guide.",
        "/dispensary safeword: lifts every dose. In hardcore, asks your keyholders to let you out.",
        "/dispensary nips, then close, or heal on or off.",
        "/dispensary holes, then heal on or off, or pain on or off.",
        "/dispensary train <who> <ass|pussy|throat> <size> in 3 days, or by friday. /dispensary train <who> clear lifts a goal. Use me for yourself.",
        "/dispensary kit, then on or off, speed slow, steady, fast or now, what clothes, binds or both, save <name>, del <name>, or stop.",
        "/dispensary horny on or off.",
        "/dispensary seed: what's in you, whose it is, and every load you've taken.",
        "/dispensary mouth <who> <words>: words for your mouthpiece's wearer. /dispensary say or /dispensary nope answers one."
      ],
      see: ["start"]
    }
  ];
  var GUIDE_BY = Object.fromEntries(GUIDES.map((g) => [g.id, g]));
  function guideFor(word) {
    const w = String(word || "").toLowerCase().trim();
    if (!w) return null;
    if (GUIDE_BY[w]) return GUIDE_BY[w];
    const ALIAS = {
      needle: "give",
      inject: "give",
      dose: "give",
      dosing: "give",
      recipe: "craft",
      crafting: "craft",
      drip: "gear",
      injector: "gear",
      lipgloss: "gear",
      gloss: "gear",
      capsule: "timing",
      tolerance: "timing",
      cravings: "timing",
      craving: "timing",
      statue: "pick",
      tongue: "pick",
      fillout: "pick",
      tender: "pick",
      balm: "pick",
      growth: "pick",
      kit: "kits",
      outfit: "kits",
      hungry: "horny",
      seed: "breeding",
      cum: "breeding",
      labour: "breeding",
      labor: "breeding",
      birth: "breeding",
      heat: "breeding",
      ripe: "breeding",
      knot: "breeding",
      scan: "breeding",
      quicken: "breeding",
      pregnant: "breeding",
      eggs: "breeding",
      insemination: "breeding",
      inseminate: "breeding",
      seal: "breeding",
      breed: "breeding",
      breeder: "breeding",
      load: "breeding",
      loads: "breeding",
      nips: "nipples",
      nipple: "nipples",
      hole: "holes",
      train: "holes",
      training: "holes",
      ass: "holes",
      pussy: "holes",
      throat: "holes",
      parasite: "parasites",
      leeches: "parasites",
      mouthpiece: "parasites",
      vine: "parasites",
      safeword: "safety",
      ladder: "safety",
      clock: "safety",
      list: "safety",
      keyholder: "hardcore",
      keyholders: "hardcore",
      lscg: "farm",
      help: "start",
      command: "commands"
    };
    if (ALIAS[w]) return GUIDE_BY[ALIAS[w]];
    return GUIDES.find((g) => g.title.toLowerCase().includes(w)) || null;
  }

  // dispensary/src/page.js
  var W23 = window;
  var ID = "FarmhandDispensary";
  var box2 = null;
  var note3 = "";
  var guide = "";
  var guidesOpen = null;
  var CSS3 = `
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
#fd-page .fd-head{display:flex;align-items:center;gap:8px}
#fd-page .fd-head h3{flex:1}
#fd-page button.fd-how{font-size:12px;min-height:26px;padding:2px 9px;margin-top:10px;background:#2b2230;border-color:#6e5a78;color:#d9b3e6}
#fd-page .fd-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
#fd-page button.fd-chip{font-size:12.5px;min-height:28px;padding:3px 10px;border-radius:14px;background:#2b2230;border-color:#6e5a78}
#fd-page button.fd-chip.fd-on{background:#5a3f68;border-color:#d9b3e6}
#fd-page .fd-guide{border-color:#8e6aa0;background:#2f2535}
#fd-page .fd-guide h4{margin:0;flex:1;font-size:16px;color:#f0d6f8;font-family:Bitter,Georgia,serif}
#fd-page .fd-guide ol,#fd-page .fd-guide ul{margin:6px 0 6px;padding-left:22px}
#fd-page .fd-guide li{margin:3px 0}
#fd-page .fd-try{background:#1e1822;border:1px dashed #6e5a78;border-radius:7px;padding:6px 10px;margin:6px 0}
#fd-page .fd-try code{font:13px/1.4 ui-monospace,Consolas,monospace;color:#ffd9a8;background:#0000;word-break:break-word}
#fd-page .fd-try button{font-size:11.5px;min-height:22px;padding:0 7px;margin-left:6px}
@media (pointer:coarse){#fd-page select,#fd-page input{font-size:16px}#fd-page button{min-height:40px}}
`;
  function styles() {
    if (W23.document.getElementById("fd-style")) return;
    const s = W23.document.createElement("style");
    s.id = "fd-style";
    s.textContent = CSS3;
    W23.document.head.appendChild(s);
  }
  var clockTip = (mode2) => {
    const p = st().penalty;
    return mode2 === "real" ? "Real time: your timers keep running while you're logged off. To make up for it, every timer runs " + p + "% longer, so a 2-hour dose lasts " + (2 * (1 + p / 100)).toFixed(1).replace(/\.0$/, "") + " hours." : "While online: your timers only count down while you're logged in. A 2-hour dose is 2 hours of you being here.";
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
    const P = W23.Player || {};
    const own = P.Ownership && P.Ownership.MemberNumber === mn;
    const c = (W23.ChatRoomCharacter || []).find((x) => x && x.MemberNumber === mn);
    return (c ? c.Nickname || c.Name : "#" + mn) + (own ? " (your owner)" : PROPRIETORS.includes(mn) ? " (proprietor)" : "");
  };
  var endPick = "7";
  function hardWarning(days, keys) {
    return "Hardcore. Until it ends, you can't change your Dispensary settings, and your safeword won't lift your doses: it asks your keyholders (" + keys.map(keyName).join(", ") + ") to let you out instead.\n\nIt ends " + (days ? "in " + days + " day" + (days === 1 ? "" : "s") : "when a keyholder ends it, or after " + CHECK_DAYS + " days with no keyholder checkin' in (bein' in a room with you counts)") + ". Your keyholders can change your settings, let you out, or end it whenever they like.\n\nLock yourself in?";
  }
  var keyInput = "";
  var WHY_NOT = { number: "That isn't a member number.", self: "You can't hold your own key.", already: "They already hold your key.", full: "That's ten keyholders: remove one first.", locked: "Not while you're locked in." };
  function keyholdersCard() {
    const S3 = st(), locked = hardOn(), P = W23.Player || {}, own = P.Ownership && P.Ownership.MemberNumber, rows = [];
    if (typeof own === "number" && own > 0) rows.push(h("div", null, "\u{1F5DD}\uFE0F " + keyName(own) + ": always, as your owner"));
    if (S3.stock) rows.push(h("div", null, "\u{1F5DD}\uFE0F " + PROPRIETORS.map(keyName).join(" and ") + ": you're on the farm's books"));
    for (const mn of S3.keys || []) rows.push(h("div", { class: "fd-row" }, "\u{1F5DD}\uFE0F " + keyName(mn), locked ? null : h("button", { onclick: () => {
      removeKey(mn);
      note3 = "";
      draw2();
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
    return [...head("Keyholders", "hardcore"), h(
      "div",
      { class: "fd-card" },
      rows,
      locked ? h("div", { class: "fd-muted", style: { marginTop: "6px" } }, "Locked in with you till hardcore's over.") : h(
        "div",
        { class: "fd-row", style: { marginTop: "8px" } },
        input,
        h("button", { onclick: () => {
          const n = Number(String(keyInput).trim()), r = addKey(n);
          note3 = r.ok ? "\u{1F5DD}\uFE0F " + keyName(n) + " holds your key now." : WHY_NOT[r.why] || "Couldn't add them.";
          if (r.ok) keyInput = "";
          draw2();
        } }, "Add")
      ),
      h("div", { class: "fd-muted", style: { marginTop: "6px" } }, "Keyholders can let you out of hardcore, change your settings while you're locked in, or end it. Your limits stay yours: nobody changes them while you're locked in, not even them.")
    )];
  }
  function hardCard() {
    const out = [...head("Hardcore", "hardcore")];
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
            if (typeof W23.confirm === "function" && !W23.confirm(hardWarning(days, keys))) return;
            const r = lock(days);
            note3 = r.ok ? "\u{1F512} Locked in." : "Couldn't lock in: " + (r.why === "nokey" ? "you've no keyholder." : r.why);
            draw2();
          } }, "\u{1F512} Lock me in")
        )
      ));
      return out;
    }
    const H2 = st().hard;
    out.push(h(
      "div",
      { class: "fd-card" },
      h("div", null, "\u{1F512} Locked in since " + dateOf(H2.since) + ". " + (H2.until ? "It ends " + inDays(H2.until) + "." : "No end date: it lets go " + inDays(dueAt()) + " unless a keyholder checks in before then.")),
      h("div", { class: "fd-muted" }, "Your keyholders: " + keys.map(keyName).join(", ") + ". They can change your settings, let you out, or end it."),
      hardLog().slice(-5).reverse().map((l) => h("div", { class: "fd-muted" }, dateOf(l.t) + " \xB7 " + (l.by === (W23.Player && W23.Player.MemberNumber) ? "you" : l.by ? keyName(l.by) : "the clock") + ": " + l.what))
    ));
    return out;
  }
  var editing = null;
  function keysCard() {
    const list = Object.entries(wards());
    if (!list.length) return [];
    const out = [...head("Keys you hold", "hardcore")];
    for (const [k, x] of list) {
      const mn = Number(k), inRoom4 = (W23.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === mn), name = (x.name || "#" + mn) + " (" + mn + ")";
      const go = (what2, data) => {
        const how = keyDo(mn, what2, data);
        note3 = how ? "\u{1F5DD}\uFE0F Sent " + (how === "room" ? "in the room" : "by beep") + "." : "Couldn't reach " + name + " just now.";
        draw2();
      };
      const kids = [
        h("div", null, "\u{1F5DD}\uFE0F " + name + ": " + (x.until ? "ends " + inDays(x.until) : "lets go " + inDays(x.due) + " without a check-in") + (x.asked && Date.now() - x.asked < DAY_MS ? " \xB7 askin' to be let out" : "")),
        h(
          "div",
          { class: "fd-row", style: { marginTop: "6px" } },
          h("button", { onclick: () => go("check") }, "Check in"),
          h("button", { onclick: () => go("letout") }, "Let out (lift every dose)"),
          h("button", { onclick: () => {
            if (typeof W23.confirm !== "function" || W23.confirm("End " + name + "'s hardcore?")) go("end");
          } }, "End hardcore"),
          inRoom4 ? h("button", { onclick: () => {
            editing = { mn };
            keyDo(mn, "state");
            draw2();
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
                draw2();
              } }, "Close")
            )
          ));
        }
      }
      out.push(h("div", { class: "fd-card" }, kids));
    }
    return out;
  }
  var guideWhere = "top";
  var pendingGuide = "";
  var copyBtn = (text3) => W23.navigator && W23.navigator.clipboard && typeof W23.navigator.clipboard.writeText === "function" ? h("button", { title: "Copy it, to paste in the game's crafting", onclick: (e) => {
    const b = e.currentTarget;
    try {
      W23.navigator.clipboard.writeText(text3).then(() => {
        b.textContent = "Copied";
      }, () => {
      });
    } catch (x) {
    }
  } }, "Copy") : null;
  function showGuide(id, where) {
    guide = GUIDE_BY[id] ? id : "";
    guideWhere = where || "top";
    if (guide && !st().guided) {
      st().guided = true;
      save();
    }
    draw2();
    try {
      const g = box2 && box2.querySelector(".fd-guide");
      if (g && typeof g.scrollIntoView === "function") g.scrollIntoView({ block: "nearest" });
    } catch (e) {
    }
  }
  function guideView(G) {
    const i = GUIDES.indexOf(G), next2 = GUIDES[i + 1], see = (G.see || []).filter((k) => GUIDE_BY[k]);
    return h(
      "div",
      { class: "fd-card fd-guide" },
      h("div", { class: "fd-row" }, h("h4", null, G.icon + " " + G.title), h("button", { class: "fd-how", style: { marginTop: 0 }, onclick: () => {
        guide = "";
        draw2();
      } }, "Close")),
      h("div", { style: { marginTop: "4px" } }, G.intro),
      h("ol", null, G.steps.map((s) => h("li", null, s))),
      G.craft && G.craft.length ? h(
        "div",
        { class: "fd-try" },
        h("div", { class: "fd-muted" }, "Try it: craft one of these, word for word"),
        G.craft.map((c) => h(
          "div",
          { style: { margin: "6px 0" } },
          h("div", null, "Name: ", h("code", null, c.name), copyBtn(c.name)),
          c.desc ? h("div", null, "Description: ", h("code", null, c.desc), copyBtn(c.desc)) : null,
          h("div", { class: "fd-muted" }, "\u2192 " + c.note)
        ))
      ) : null,
      G.tips && G.tips.length ? [h("div", { class: "fd-muted", style: { marginTop: "6px" } }, "Worth knowin':"), h("ul", null, G.tips.map((t) => h("li", { class: "fd-muted" }, t)))] : null,
      h(
        "div",
        { class: "fd-chips" },
        see.map((k) => h("button", { class: "fd-chip", onclick: () => showGuide(k, guideWhere) }, GUIDE_BY[k].icon + " " + GUIDE_BY[k].title)),
        next2 && guideWhere === "top" ? h("button", { class: "fd-chip", onclick: () => showGuide(next2.id, "top") }, "Next: " + next2.title + " \u203A") : null
      )
    );
  }
  var head = (title, id) => [
    h("div", { class: "fd-head" }, h("h3", null, title), id ? h("button", { class: "fd-how", "aria-label": "How " + title + " works", onclick: () => guide === id && guideWhere === title ? (guide = "", draw2()) : showGuide(id, title) }, "\u{1F4D6} How it works") : null),
    guideWhere === title && GUIDE_BY[guide] ? guideView(GUIDE_BY[guide]) : null
  ];
  function guidesCard() {
    const open2 = guidesOpen == null ? !st().guided : guidesOpen, G = guideWhere === "top" ? GUIDE_BY[guide] : null;
    const out = [h("div", { class: "fd-head" }, h("h3", null, "\u{1F4D6} Guides"), h("button", { class: "fd-how", onclick: () => {
      guidesOpen = !open2;
      if (open2 && guideWhere === "top") guide = "";
      draw2();
    } }, open2 ? "Hide the list" : "Show every guide"))];
    out.push(h(
      "div",
      { class: "fd-card" },
      h("div", { class: "fd-muted" }, open2 ? "How everythin' in here works, step by step, with crafts you can copy word for word. Every section below has its own \u{1F4D6} How it works too." : "Step by step, for everythin' in here. Every section below has its own \u{1F4D6} How it works."),
      open2 ? h("div", { class: "fd-chips" }, GUIDES.map((g) => h("button", { class: "fd-chip" + (G && g.id === G.id ? " fd-on" : ""), onclick: () => G && g.id === G.id ? (guide = "", draw2()) : showGuide(g.id, "top") }, g.icon + " " + g.title))) : null
    ));
    if (G) out.push(guideView(G));
    return out;
  }
  function guideNext(id) {
    pendingGuide = GUIDE_BY[id] ? id : "";
  }
  function view2() {
    const S3 = st(), now = doseIds().filter(active), locked = hardOn() ? true : void 0;
    const kids = [];
    kids.push(h(
      "div",
      { class: "fd-row", style: { marginBottom: "6px" } },
      h("h2", null, "\u{1F489} The Farmhand's Dispensary"),
      h("button", { onclick: () => {
        if (typeof W23.PreferenceSubscreenExtensionsClear === "function") W23.PreferenceSubscreenExtensionsClear();
        else close2();
      } }, "Back")
    ));
    if (note3) kids.push(h("div", { class: "fd-note" }, note3));
    if (locked) kids.push(h("div", { class: "fd-card fd-note" }, "\u{1F512} Hardcore: your keyholders hold these settings. You can look, but only they can change them."));
    kids.push(...guidesCard());
    kids.push(...head("In you now", "start"));
    kids.push(h(
      "div",
      { class: "fd-card" },
      now.length ? now.map((id) => h("div", null, BOOK[id].icon + " " + BOOK[id].label + (st().doses[id].x > 1 ? " \xD7" + st().doses[id].x : "") + partLabel(id) + ": " + timeLeft(leftMs(id)) + " left" + (S3.clock === "online" ? " of your time here" : ""))) : h("div", { class: "fd-muted" }, "Nothin'. You're clear."),
      Object.values(S3.grow || {}).some((v) => v) ? h("div", null, "\u{1F4CF} Grown (it stays): " + Object.entries(S3.grow).filter(([, v]) => v).map(([k, v]) => ({ cup: "tits", ass: "ass", cock: "cock", balls: "balls" })[k] + " " + (v > 0 ? "+" : "") + v).join(", ") + ". A reducing serum takes a size back off.") : null,
      S3.later.length ? h("div", null, "\u{1F48A} " + (S3.later.length === 1 ? "A time-release capsule's" : S3.later.length + " time-release capsules are") + " waitin' in you. You won't know when.") : null,
      h(
        "div",
        { class: "fd-row", style: { marginTop: "8px" } },
        locked ? h("button", { class: "fd-safe", onclick: () => {
          safeword("page");
          note3 = "\u{1F5DD}\uFE0F Your keyholders have been asked to let you out.";
          draw2();
        } }, "\u{1F5DD}\uFE0F Ask to be let out") : h("button", { class: "fd-safe", onclick: () => {
          safeword("page");
          note3 = "Safeword: every dose lifted.";
          draw2();
        } }, "\u{1F534} Safeword: lift every dose"),
        h("span", { class: "fd-muted" }, locked ? "Hardcore: your safeword asks your keyholders to let you out. Your doses stay till one of them does." : "The game's own safeword does it too, and so does /dispensary safeword.")
      )
    ));
    kids.push(...head("Who can dose you", "safety"));
    const sel = h(
      "select",
      { "aria-label": "Who can dose you", disabled: locked, onchange: (e) => {
        st().who = e.target.value;
        save();
        note3 = "";
        draw2();
      } },
      LADDER.map((r) => h("option", { value: r.id, selected: r.id === S3.who ? true : void 0 }, r.label))
    );
    kids.push(h("div", { class: "fd-card" }, sel, h("div", { class: "fd-muted", style: { marginTop: "4px" } }, "Right now: " + ladderWho() + ". You can always dose yourself.")));
    kids.push(...head("The clock", "safety"));
    const radio = (mode2, label) => h(
      "label",
      { title: clockTip(mode2) },
      h("input", { type: "radio", name: "fd-clock", disabled: locked, checked: S3.clock === mode2 ? true : void 0, onchange: () => {
        setClock(mode2);
        draw2();
      } }),
      label
    );
    kids.push(h(
      "div",
      { class: "fd-card" },
      h("div", { class: "fd-row", style: { gap: "18px" } }, radio("online", "While online"), radio("real", "Real time (+" + S3.penalty + "%)")),
      h("div", { class: "fd-muted", style: { marginTop: "4px" } }, clockTip(S3.clock))
    ));
    kids.push(...head("Touches", "pick"));
    kids.push(h(
      "div",
      { class: "fd-card" },
      h("label", null, h("input", { type: "checkbox", checked: S3.screen !== false ? true : void 0, onchange: (e) => {
        st().screen = e.target.checked;
        save();
        draw2();
      } }), h("b", null, "Screen touches")),
      h("div", { class: "fd-muted" }, "A dose you can see at the edges of your own screen: the Sedative dims it, Denial Serum pulses pink near the top, Heat hazes it warm, Needy Nectar flushes it, Rut reddens it, the Airhead Elixir goes soft and pink. Only you see them. With reduce motion set on your computer, they hold still."),
      h("label", { style: { marginTop: "8px" } }, h("input", { type: "checkbox", checked: S3.iconsShow !== false ? true : void 0, onchange: (e) => {
        st().iconsShow = e.target.checked;
        save();
        draw2();
      } }), h("b", null, "Dose icons by people")),
      h("label", null, h("input", { type: "checkbox", checked: S3.iconsShare !== false ? true : void 0, onchange: (e) => {
        st().iconsShare = e.target.checked;
        save();
        draw2();
      } }), h("b", null, "Let others see mine")),
      h("div", { class: "fd-muted" }, "A small row of icons by anybody with doses in them (each dose's own icon), the way the game shows a friend. Only people with the Dispensary see them, and only if they let them show."),
      h(
        "div",
        { class: "fd-row", style: { marginTop: "8px" } },
        h("span", null, "Your animal, for Moo Juice:"),
        h(
          "select",
          { "aria-label": "Your animal", onchange: (e) => {
            st().species = e.target.value;
            save();
            draw2();
          } },
          [h("option", { value: "", selected: !S3.species ? true : void 0 }, S3.speciesFarm ? "The farm's word (" + S3.speciesFarm + ")" : "Cow, till the farm says")].concat(ANIMALS.map((a) => h("option", { value: a, selected: S3.species === a ? true : void 0 }, a)))
        )
      )
    ));
    kids.push(...head("Doses", "craft"));
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
            checked: !S3.off[id] ? true : void 0,
            disabled: theirs || locked ? true : void 0,
            onchange: (e) => {
              if (e.target.checked) delete st().off[id];
              else st().off[id] = true;
              save();
              draw2();
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
    kids.push(...head("How doses take you", "timing"));
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
            draw2();
          } },
          Object.entries(TENDER_SPOTS).map(([k, s2]) => h("option", { value: k, selected: (S3.tenderSpot || TENDER_DEFAULT) === k ? true : void 0 }, s2.word))
        )
      ),
      h("div", { class: "fd-muted", style: { marginTop: "8px" } }, "\u{1F48A} A needle that also says time-release, slow-release, delayed or capsule doesn't hit at once: it goes off somewhere between " + FUSE_MINS[0] + " and " + FUSE_MINS[1] + " minutes later, at a moment nobody knows. Up to " + LATER_MAX + " can wait in you; your safeword clears them."),
      h("label", { style: { marginTop: "8px" } }, h("input", { type: "checkbox", disabled: locked, checked: S3.tolerance ? true : void 0, onchange: (e) => {
        st().tolerance = e.target.checked;
        save();
        draw2();
      } }), h("b", null, "Tolerance")),
      h("div", { class: "fd-muted" }, "The same dose again within " + TOLERANCE_HOURS + " hours takes a fifth less for each one before it, down to two fifths. You're told when it does."),
      h("label", { style: { marginTop: "8px" } }, h("input", { type: "checkbox", disabled: locked, checked: S3.cravings ? true : void 0, onchange: (e) => {
        st().cravings = e.target.checked ? Date.now() : 0;
        save();
        draw2();
      } }), h("b", null, "Cravings")),
      h("div", { class: "fd-muted" }, "Once you've had " + CRAVE_AFTER + " doses in " + CRAVE_DAYS + " days, now and then, while nothin's in you, you want another (a note only you see). On the farm the farm girl notices, and offers: say ?fix and she sees to it. Only doses from here on count.")
    ));
    kids.push(...head("Gear, drinks and kisses", "gear"));
    kids.push(h(
      "div",
      { class: "fd-card fd-muted" },
      h("div", null, "Crafted gear you wear doses you when its words say a dose and how:"),
      h("div", null, "\u2022 drip, IV, laced, coated or soaked: keeps it in you while it's on (" + DRIP_MINS + " minutes' worth, topped up)"),
      h("div", null, "\u2022 injector, auto-inject, dosing or pump: a dose every " + INJECT_EVERY + ' minutes ("every 10 minutes" sets its own)'),
      h("div", null, "\u2022 on climax, when kissed, when touched, when spanked: a dose each time"),
      h("div", null, "\u2022 roulette or mystery dose: a different one of the doses you allow, each time"),
      h("div", null, "\u2022 a drink or a treat somebody feeds you (Sip, Eat), and lip gloss or lipstick with a dose in it, on a kiss"),
      h("div", { style: { marginTop: "4px" } }, "Whoever crafted it has to be on your list. Your safeword clears what's in you and rests your gear " + PAUSE_MINS + " minutes.")
    ));
    kids.push(...head("Kits", "kits"));
    {
      const k = kitNow(), n = kitNames();
      kids.push(h(
        "div",
        { class: "fd-card" },
        k ? h("div", null, "\u{1F457} On you now: " + k.key + (k.left ? " (" + k.left + " pieces still to go on)" : "")) : null,
        h("label", null, h("input", { type: "checkbox", disabled: locked, checked: S3.kitsOn ? true : void 0, onchange: (e) => {
          st().kitsOn = e.target.checked;
          save();
          draw2();
        } }), h("b", null, "Kits can dress me")),
        h(
          "div",
          { class: "fd-row", style: { marginTop: "6px", gap: "10px" } },
          h(
            "select",
            { "aria-label": "What kits put on you", disabled: locked, onchange: (e) => {
              st().kitWhat = e.target.value;
              save();
              draw2();
            } },
            [["both", "Clothes and restraints"], ["clothes", "Only clothes"], ["binds", "Only restraints"]].map(([v, t]) => h("option", { value: v, selected: (S3.kitWhat || "both") === v ? true : void 0 }, t))
          ),
          h(
            "select",
            { "aria-label": "How fast kits go on", onchange: (e) => {
              st().kitSpeed = e.target.value;
              save();
              draw2();
            } },
            Object.keys(SPEED_NAMES).map((v) => h("option", { value: v, selected: (S3.kitSpeed || "steady") === v ? true : void 0 }, SPEED_NAMES[v]))
          )
        ),
        h("div", { class: "fd-muted", style: { marginTop: "4px" } }, `A dose that says "kit: <name>" puts its crafter's saved outfit on you (one saved in LSCG, or on their Dispensary), a piece at a time, held on half an hour a dose: anythin' taken off creeps back on. Never your body, nothin' you've blocked, never over somethin' locked. When it's over, your old outfit slips back on. Its pieces keep their crafts, so horny gear in it is horny.`),
        h("div", { class: "fd-muted", style: { marginTop: "4px" } }, "Your kits: " + (n.own.length ? n.own.join(", ") : "none yet") + (n.lscg.length ? " \xB7 in LSCG: " + n.lscg.join(", ") : "") + ". /dispensary kit save <name> keeps what you're wearin'.")
      ));
    }
    kids.push(...head("Horny gear", "horny"));
    kids.push(h(
      "div",
      { class: "fd-card" },
      h(
        "label",
        null,
        h("input", { type: "checkbox", disabled: locked, checked: S3.hornyOn !== false ? true : void 0, onchange: (e) => {
          st().hornyOn = e.target.checked;
          save();
          draw2();
        } }),
        h("b", null, "Horny gear can use me")
      ),
      h("div", { class: "fd-muted" }, 'Crafted gear that says horny or hungry has its way with you, all by itself, every few minutes (insatiable or ravenous: every couple): plugs and dildos thrust, nipple gear suckles, gags fuck your throat, ropes and belts grind. It pushes your arousal up, and close enough it makes you cum. "Breeding" on it too: it fills you when you cum. A parasite that says horny is twice as busy.')
    ));
    kids.push(...head("Nipples", "nipples"));
    {
      const n = nipsOpen(), t = trainedLevel(), loads = nipLoads();
      kids.push(h(
        "div",
        { class: "fd-card" },
        h("div", null, (n ? "\u2B55 " + NIP_WORDS[n][0].toUpperCase() + NIP_WORDS[n].slice(1) + ", " + n + " of 3" : "Closed") + (t ? " \xB7 trained to stay " + NIP_WORDS[t] : "") + (loads.n ? " \xB7 loads taken in them: " + loads.n : "") + (mineToy() ? " \xB7 the " + toyOf(mineToy()).label + " in them" : "")),
        h(
          "label",
          { style: { marginTop: "6px" } },
          h("input", { type: "checkbox", disabled: locked, checked: S3.nipsHeal !== false ? true : void 0, onchange: (e) => {
            st().nipsHeal = e.target.checked;
            save();
            draw2();
          } }),
          h("b", null, "They close up slowly on their own")
        ),
        h("div", { class: "fd-muted" }, "Crafted nipple gear that says dilator or stretcher holds them open while it's on. Held open (the Nipple Dilator, that gear, the leeches, a toy) and used, they train: the stretch stays after the dose or the leeches are gone, and they can still be fucked and filled. They train a step an hour toward how wide they're held, so three hours held wide leaves them gapin'. Open them up forces them a step wider right now; /dispensary nips open <who> does it to somebody who lets you dose them. With this on they close half a step a day once they've been left be twelve hours. Off: they stay as they're trained."),
        h(
          "div",
          { class: "fd-row", style: { marginTop: "6px" } },
          // (Nov 19) forced open, a step wider each press, and trained to stay that way
          h("button", { disabled: t >= 3 ? true : void 0, onclick: () => {
            const r = nipsForce(Math.min(3, t + 1));
            note3 = r.ok ? "Your nipples are " + NIP_WORDS[r.n] + " now, trained to stay that way." : "They're already " + NIP_WORDS[r.n] + ".";
            draw2();
          } }, "Open them up"),
          h("button", { disabled: locked || !n || toyLocked(mineToy()) ? true : void 0, onclick: () => {
            nipsClose(true);
            const out = lastPopped();
            note3 = (out ? "The " + out + " slides out, and your" : "Your") + " nipples are closed back up, snug as they ever were.";
            draw2();
          } }, "Close them up"),
          h("span", { class: "fd-muted" }, locked ? "Hardcore: a Tightening Balm from a keyholder does it." : toyLocked(mineToy()) ? "The " + toyOf(mineToy()).label + "'s locked in, holdin' them open: its key first." : "The Dilator out, the leeches off, any toy out, the stretch undone. A Tightening Balm does it too.")
        )
      ));
    }
    kids.push(...head("Holes", "holes"));
    {
      const N = holesNow(), FEEL = { "0": "it fits", "1": "a good stretch", "2": "it aches", "3": "it hurts", cruel: "it's cruel to you" };
      const rows = Object.entries(N.holes).map(([hk, x]) => h(
        "div",
        { style: { margin: "4px 0 8px" } },
        h("div", null, h("b", null, x.label + ": "), x.nowWord + (x.now !== x.trained ? " tonight \xB7 trained " + x.trainedWord : "") + (x.toward ? " \xB7 " + x.toward + "% to the next size" : "")),
        x.toy ? h("div", { class: "fd-muted" }, "In it: the " + x.toy.name + ", holdin' you " + sizeWord(hk, x.toy.size) + ": " + FEEL[x.toy.feel] + (x.toy.trainer ? ", trainin' you" : "") + (x.toy.pump ? ", growin' with you" : "")) : null,
        x.goal ? h("div", { class: "fd-muted" }, "\u{1F3AF} Goal: " + x.goal.word + (x.goal.due ? ", " + dueWords(x.goal.due) : "") + (x.goal.by && x.goal.by !== (W23.Player && W23.Player.MemberNumber) ? ", set by " + keyName(x.goal.by) : "")) : null,
        h(
          "div",
          { class: "fd-row", style: { marginTop: "4px" } },
          h("span", { class: "fd-muted" }, "Your own pick:"),
          h(
            "select",
            { "aria-label": "Your " + x.label.toLowerCase() + ", your own pick", disabled: locked, onchange: (e) => {
              if (e.target.value) {
                holesSet(hk, Number(e.target.value));
                note3 = "Your " + x.label.toLowerCase() + " is " + sizeWord(hk, Number(e.target.value)) + " now.";
              }
              draw2();
            } },
            [h("option", { value: "", selected: true }, "leave it")].concat(HOLE_SIZES[hk].names.slice(HOLE_SIZES[hk].start - 1, HOLE_SIZES[hk].natural).map((w, i) => h("option", { value: String(i + HOLE_SIZES[hk].start) }, w)))
          )
        )
      ));
      kids.push(h(
        "div",
        { class: "fd-card" },
        rows,
        h("label", { style: { marginTop: "6px" } }, h("input", { type: "checkbox", disabled: locked, checked: N.heal ? true : void 0, onchange: (e) => {
          st().holesHeal = e.target.checked;
          save();
          draw2();
        } }), h("b", null, "They close up slowly on their own")),
        h("label", null, h("input", { type: "checkbox", disabled: locked, checked: N.pain ? true : void 0, onchange: (e) => {
          st().holesPain = e.target.checked;
          save();
          draw2();
        } }), h("b", null, "Too-big toys can hurt")),
        h("div", { class: "fd-muted", style: { marginTop: "4px" } }, `A toy in you stretches you to its size. One size bigger than you're trained is a good stretch, two aches, three or more hurts (or only aches, with that switch off); a cruel or sadist one always means it. A trainer (crafted to say stretcher, trainer, gaper or dilator, or cruel, or with a goal like "goal: gaping" or "train her to loose in 3 days") trains you up while it's in, faster the bigger it is: a size every 12 hours at one size bigger, 6 hours at three. A pump or beads crafted as a trainer grows with you. Fingers, fists, cocks and toys count too, and a load in a loose hole drips back out. Healin' on: left be a day, they close half a size a day. Anybody who can dose you can set a goal: /dispensary train <who> <ass|pussy|throat> <size> [in 3 days]. A Tightening Balm that names a hole closes it up.`),
        h("div", { class: "fd-muted", style: { marginTop: "4px" } }, N.sync ? "On the farm's books: the farm girl keeps them, and gets what happens off the farm next time you're in her room" + (N.waiting ? " (" + N.waiting + " change" + (N.waiting === 1 ? "" : "s") + " waitin')." : ".") : "These are your Dispensary's own numbers. On the farm, the farm girl keeps the books.")
      ));
    }
    kids.push(...head("Breedin'", "breeding"));
    {
      const K3 = carryInfo(), STAGE = { early: "just took", show: "showin'", heavy: "heavy and close", due: "due right now" }, rows = [];
      if (K3.labour) rows.push(h("div", null, "\u{1F37C} In labour: about " + Math.max(1, Math.ceil(K3.labour.left / 6e4)) + " minutes to go" + (K3.labour.midwife ? ", " + K3.labour.midwife + " helpin'" : "") + "."));
      if (K3.carrying) rows.push(h("div", null, "\u{1F930} Carryin' " + (K3.carrying.count === 1 ? "a " + (K3.one || "little one") : K3.carrying.count + " " + (K3.many || "little ones")) + (K3.carrying.sires.length ? ", " + K3.carrying.sires.join(" & ") + "'s" : "") + " \xB7 " + STAGE[K3.carrying.stage] + " \xB7 " + K3.carrying.dueWords));
      if (K3.born) rows.push(h("div", null, "\u{1F37C} Delivered away from the farm: the farm girl books your litter next time you're in her room."));
      if (K3.eggs) rows.push(h("div", null, "\u{1F95A} A clutch of " + K3.eggs.n + (K3.eggs.by ? ", " + K3.eggs.by + "'s" : "") + (K3.eggs.layAt > Date.now() ? ", ready " + (K3.eggs.layAt - Date.now() < 36 * 36e5 ? "in " + Math.max(1, Math.round((K3.eggs.layAt - Date.now()) / 36e5)) + " hours" : "in " + Math.round((K3.eggs.layAt - Date.now()) / 864e5) + " days") : ", ready to lay")));
      if (K3.laid) rows.push(h("div", null, "\u{1F95A} Laid away from the farm: she books them next time you're in her room."));
      if (K3.heat) rows.push(h("div", null, "\u{1F525} In heat."));
      if (ripeNow()) rows.push(h("div", null, "\u{1F338} Ripe: a load takes twice as easy."));
      if (K3.open) rows.push(h("div", null, "\u{1F49E} Wide open from the birth: a load takes four times as easy, for " + Math.max(1, Math.ceil((K3.open - Date.now()) / 6e4)) + " more minutes."));
      kids.push(h(
        "div",
        { class: "fd-card" },
        rows.length ? rows : h("div", { class: "fd-muted" }, K3.known ? "Not carryin' right now. Somebody should fix that." : "The farm girl tells your Dispensary what you're carryin', next time you're in her room."),
        K3.litters ? h("div", { class: "fd-muted", style: { marginTop: "4px" } }, "Litters you've delivered: " + K3.litters + (K3.litters >= 20 ? " \xB7 \u{1F396}\uFE0F Baby Factory" : " \xB7 twenty and the farm makes you a Baby Factory")) : null,
        h("div", { class: "fd-muted", style: { marginTop: "4px" } }, "Wherever you are, you feel what you're carryin': it takes hold, shows, grows heavy and kicks, your tits fill, and you crave seed. Your natural heat comes on where you are. Due away from the farm, your labour happens right there, and anybody in the room can be your midwife (a touch on your belly helps); a clutch comes out the same way. For an hour after a birth you're wide open. A Quickening Draught takes a day off; a Breeder's Scan shows the room what's in there.")
      ));
    }
    kids.push(...head("Seed", "breeding"));
    {
      const I = seedInfo(), HW = { vulva: "Pussy", butt: "Ass", mouth: "Swallowed", nips: "Tits" }, farmHere = (W23.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === BOT);
      const rows = Object.entries(I.held).filter(([, x]) => x.ml >= 1 || x.seal).map(([hk, x]) => h("div", null, h("b", null, HW[hk] + ": "), amountSay(x.ml) + (x.who ? ", mostly " + x.who + "'s" : "") + (x.seal ? " \xB7 \u{1F512} sealed with " + x.seal.name + "'s " + x.seal.g : "")));
      kids.push(h(
        "div",
        { class: "fd-card" },
        rows.length ? rows : h("div", { class: "fd-muted" }, "Nothin' in you right now."),
        h("label", { style: { marginTop: "6px" } }, h("input", { type: "checkbox", disabled: locked, checked: S3.breedAny ? true : void 0, onchange: (e) => {
          st().breedAny = e.target.checked;
          save();
          draw2();
        } }), h("b", null, "Breed me anywhere")),
        h("div", { class: "fd-muted" }, "Off the farm, a cock in you that cums (the game's own actions) leaves a real load: theirs, on your books and the farm girl's, where it can catch. A knotted one ties you on the map for its minutes. Only from somebody on your list; on her farm, her own scenes count it. Off to start."),
        ripeNow() ? h("div", { style: { marginTop: "4px" } }, "\u{1F338} You're ripe: any load in you takes twice as easy, these two days.") : null,
        tied() ? h("div", { style: { marginTop: "4px" } }, "\u{1F512} Knotted: tied fast for " + Math.max(1, Math.ceil((tied().until - Date.now()) / 6e4)) + " more minutes.") : null,
        h("div", { style: { marginTop: "4px" } }, "\u{1F930} Your belly: " + I.pct + "% full \xB7 it holds " + amountSay(I.cap) + " before it spills" + (I.stage ? ", and it shows" : "")),
        I.loads ? h("div", { class: "fd-muted" }, "Loads you've taken: " + I.loads + ", " + amountSay(I.ml) + " all told" + (I.top.length ? " \xB7 most from " + I.top.slice(0, 3).map((t) => t.name + " (" + t.n + ")").join(", ") : "")) : null,
        h(
          "div",
          { class: "fd-row", style: { marginTop: "6px" } },
          h("button", { disabled: locked || farmHere || !I.belly && !(I.held.nips.ml >= 1) ? true : void 0, onclick: () => {
            const n = seedDrain();
            note3 = n ? "You let it all run out: " + amountSay(n) + ". A seal still holds what's behind it." : "Nothin' to let out but what's sealed in.";
            draw2();
          } }, "Let it all out"),
          h("span", { class: "fd-muted" }, locked ? "Hardcore: it drains on its own, or your keyholders take the seal out." : farmHere ? "On the farm, the farm girl's books say what's in you." : "Anythin' not sealed in drains away at once.")
        ),
        h("div", { class: "fd-muted", style: { marginTop: "4px" } }, `A crafted needle, drink or bit of gear that says it carries seed (Insemination, Seed Syringe, Cum Shot, filled with my seed) puts its crafter's own seed in you, as much as it says, where it says: "500 ml pussy, 1 L ass, 2 gallons mouth, 50 ml nipples", or "in every hole". A Breeder's Seal (gear that says so) keeps every drop in the hole it's in, opens only for its maker's seed, and while it's in only its maker's loads can catch. Off the farm it drains slowly and drips; your Dispensary hands every load to the farm girl, where it can catch with its crafter as sire` + (I.no === "breedable" ? ". She isn't bookin' yours right now: ?breedable on, in her room." : I.waiting ? " (" + I.waiting + " waitin' for her)." : "."))
      ));
    }
    kids.push(...head("Parasites", "parasites"));
    const inMe2 = mine2();
    kids.push(h(
      "div",
      { class: "fd-card" },
      h("div", { class: "fd-muted" }, "Crafted parasites, anywhere: put on you in a crafted item that names them, by somebody on your list. Each kind only takes if you switch it on. Your safeword takes them off."),
      kindIds().map((k) => {
        const K3 = KINDS[k], p = inMe2[k];
        return h(
          "label",
          { style: { marginTop: "4px" } },
          h("input", { type: "checkbox", disabled: locked, checked: S3.parasites && S3.parasites[k] ? true : void 0, onchange: (e) => {
            const P = st().parasites || (st().parasites = {});
            if (e.target.checked) P[k] = true;
            else {
              delete P[k];
              letGo(k, "quiet");
            }
            save();
            draw2();
          } }),
          h("span", null, K3.icon + " " + K3.label + (p ? " \xB7 in you" + (p.until ? ", " + timeLeft(Math.max(0, p.until - Date.now())) + " left" : "") + (p.name ? " (" + p.name + "'s)" : "") : ""))
        );
      }),
      h(
        "label",
        { style: { marginTop: "8px" } },
        h("input", { type: "checkbox", disabled: locked, checked: S3.mouthAuto ? true : void 0, onchange: (e) => {
          st().mouthAuto = e.target.checked;
          save();
          draw2();
        } }),
        h("span", null, "The mouthpiece's words go straight out, without askin' me first")
      ),
      h("div", { class: "fd-muted" }, "What each does: parasite lips feed you their crafter's strain and spread by a kiss; livin' latex drinks your climaxes; milk moss keeps you leakin'; the nestling grows your belly every time you cum; the brood mother lays little ones you pass on by a kiss; the leash vine keeps you near its crafter on a map; the mouthpiece lets its crafter put words in your mouth (/dispensary say, or nope).")
    ));
    if (lscg) {
      kids.push(...head("LSCG", "farm"));
      kids.push(h("div", { class: "fd-card fd-muted" }, lscgApi2() ? "LSCG is loaded. Its sedative, aphrodisiac, mind control, suggestible and antidote are LSCG's. Our doses are in LSCG's Drug Enhancements list too: switch them on there as well to see a bar with the time left." : "LSCG is loaded. Its sedative, aphrodisiac, mind control, suggestible and antidote are LSCG's."));
    }
    kids.push(...keyholdersCard(), ...hardCard(), ...keysCard());
    kids.push(h("div", { class: "fd-muted", style: { marginTop: "14px" } }, "The Farmhand's Dispensary v" + VERSION + " \xB7 B&B Farm. On the farm, the farm girl keeps the farm's books and your Dispensary does the rest."));
    return kids;
  }
  function draw2() {
    if (box2) box2.replaceChildren(...view2().filter((k) => k != null));
  }
  function open() {
    close2();
    styles();
    if (pendingGuide) {
      guide = pendingGuide;
      guideWhere = "top";
      guidesOpen = true;
      pendingGuide = "";
      if (!st().guided) {
        st().guided = true;
        save();
      }
    }
    box2 = W23.document.createElement("div");
    box2.id = "fd-page";
    W23.document.body.appendChild(box2);
    draw2();
  }
  function close2() {
    if (box2) {
      box2.remove();
      box2 = null;
    }
    note3 = "";
    guide = "";
    guidesOpen = null;
  }
  var pageOpen = () => !!box2;
  function redrawPage(force) {
    const a = W23.document.activeElement;
    if (!force && box2 && a && box2.contains(a) && /^(SELECT|INPUT)$/.test(a.tagName)) return;
    draw2();
  }
  function initPage() {
    if (typeof W23.PreferenceRegisterExtensionSetting !== "function") return false;
    try {
      W23.PreferenceRegisterExtensionSetting({
        Identifier: ID,
        ButtonText: "The Farmhand's Dispensary",
        load: () => open(),
        run: () => {
        },
        click: () => {
        },
        exit: () => {
          close2();
          return true;
        },
        unload: () => close2()
      });
      return true;
    } catch (e) {
      console.warn("[Dispensary] its page couldn't go in the game's Extensions:", e);
      return false;
    }
  }
  function openPage() {
    try {
      if (typeof W23.PreferenceSubscreenExtensionsOpen === "function") {
        W23.PreferenceSubscreenExtensionsOpen(ID);
        return true;
      }
    } catch (e) {
    }
    open();
    return true;
  }

  // dispensary/src/index.js
  var W24 = window;
  var bcModSdk = import_bondage_club_mod_sdk.default.default || import_bondage_club_mod_sdk.default;
  if (W24.__farmDispensary) {
    console.warn("[Dispensary] Two copies of the Farmhand's Dispensary are installed. Delete the older one in Tampermonkey, then reload.");
    throw new Error("The Farmhand's Dispensary: another copy is already running");
  }
  var mod = bcModSdk.registerMod({ name: "FarmhandDispensary", fullName: "The Farmhand's Dispensary", version: VERSION });
  W24.__farmDispensary = VERSION;
  registerInk(W24, mod);
  initToys(mod, { nipsOpen: () => nipsOpen(), openOf: (mn) => openOf(mn) });
  initLscg();
  function status() {
    const on2 = doseIds().filter(active);
    local((on2.length ? "In you now: " + on2.map((id) => BOOK[id].label + " (" + timeLeft(leftMs(id)) + ")").join(", ") + "." : "No doses in you.") + " Who can dose you: " + ladderWho() + ". /dispensary safeword lifts every dose; /dispensary page opens the settings.");
  }
  function commands() {
    if (typeof W24.CommandCombine !== "function") return;
    try {
      W24.CommandCombine([{
        Tag: "dispensary",
        Description: "[guide <topic> | safeword | page | say | nope | mouth <who> <words> | nips [open [who] [1-3] | close | heal on|off] | holes [heal|pain on|off] | train <who> <ass|pussy|throat> <size> [in 3 days] | horny on|off | seed]: The Farmhand's Dispensary. What's in you, the safeword, the settings, the mouthpiece, your nipples, your holes, horny gear, seed",
        Action: (args) => {
          const a = String(args || "").trim().toLowerCase();
          const om = /^nips?\s+(?:open|dilate|stretch|gape|spread)(?:\s+(.*))?$/i.exec(String(args || "").trim());
          if (om) {
            nipsOpenCommand(String(om[1] || "").trim());
            return;
          }
          const nm = /^nips?(?:\s+(close|reset|heal)(?:\s+(on|off))?)?$/.exec(a);
          if (nm) {
            if (nm[1] === "close" || nm[1] === "reset") {
              if (hardOn()) {
                local("\u{1F512} Hardcore: closin' them back up is your keyholders' to do (a Tightening Balm from one of them does it).");
                return;
              }
              const lt = mineToy();
              if (lt && toyLocked(lt)) {
                local("\u{1F512} The " + toyOf(lt).label + "'s locked in, holdin' them open. Whoever holds its key has to take it out first.");
                return;
              }
              const was = nipsClose(true), out = lastPopped();
              local(was ? (out ? "The " + out + " slides out, and your" : "Your") + " nipples close up again, snug and tender, as if they'd never been stretched." : "Your nipples aren't stretched, sugar.");
              return;
            }
            if (nm[1] === "heal" && nm[2]) {
              if (hardOn()) {
                local("\u{1F512} Hardcore: your keyholders hold that switch.");
                return;
              }
              st().nipsHeal = nm[2] === "on";
              save();
              local(nm[2] === "on" ? "Your nipples will close up slowly on their own, once they've been left be a while." : "Your nipples stay as stretched as they're trained, till somebody closes them up.");
              return;
            }
            const L2 = nipLoads(), tw = mineToy();
            local("Your nipples: " + (nipsOpen() ? "open, " + nipsOpen() + " wide" : "closed") + (trainedLevel() ? " (trained to stay " + trainedLevel() + " wide)" : "") + ". " + (tw ? "The " + toyOf(tw).label + " is in them" + (toyLocked(tw) ? ", locked" : "") + ". " : "") + (st().nipsHeal !== false ? "They close up slowly on their own." : "They stay as they're trained.") + (L2.n ? " Loads taken in them: " + L2.n + "." : "") + " /dispensary nips open [1-3] \xB7 /dispensary nips open <who> [1-3] \xB7 /dispensary nips close \xB7 /dispensary nips heal on|off");
            return;
          }
          const hlm = /^holes?(?:\s+(heal|pain)\s+(on|off))?$/.exec(a);
          if (hlm) {
            holesCommand(hlm[1], hlm[2]);
            return;
          }
          const trm = /^train\s+(.+)$/i.exec(String(args || "").trim());
          if (trm) {
            trainCommand(trm[1]);
            return;
          }
          const km = /^kits?(?:\s+(.*))?$/.exec(String(args || "").trim());
          if (km) {
            kitCommand(String(km[1] || "").trim());
            return;
          }
          if (/^(seed|cum|loads?|held|holding)$/.test(a)) {
            seedCommand();
            return;
          }
          const hm = /^horny\s+(on|off)$/.exec(a);
          if (hm) {
            if (hardOn()) {
              local("\u{1F512} Hardcore: your keyholders hold that switch.");
              return;
            }
            st().hornyOn = hm[1] === "on";
            save();
            local(hm[1] === "on" ? "Horny gear can use you: crafted gear that says horny or hungry has its way with you, now and then." : "Horny gear sits still on you now.");
            return;
          }
          const gm = /^(?:guides?|help|how)(?:\s+(.+))?$/.exec(a);
          if (gm) {
            const G = gm[1] ? guideFor(gm[1].replace(/^(?:to|for|on|about)\s+/, "").split(/\s+/)[0]) || guideFor(gm[1]) : guideFor("start");
            if (!G) {
              local("No guide for that. The guides: " + GUIDES.map((g) => g.id).join(", ") + ". /dispensary guide <one of those>, or /dispensary guide on its own to start.");
              return;
            }
            guideNext(G.id);
            openPage();
            return;
          }
          if (/^(safe|safeword|red)$/.test(a)) {
            safeword("command");
            return;
          }
          if (/^(page|settings|open)$/.test(a)) {
            openPage();
            return;
          }
          if (/^say$/.test(a)) {
            if (!sayAsked(true)) local("Nobody's asked you to say anything.");
            return;
          }
          if (/^(nope|no|pass)$/.test(a)) {
            if (!sayAsked(false)) local("Nobody's asked you to say anything.");
            return;
          }
          const mm = /^mouth\s+(\S+)\s+(.+)$/i.exec(String(args || "").trim());
          if (mm) {
            const t = mouthTarget(mm[1]);
            if (!t) {
              local("Who? Their name or member number, in this room.");
              return;
            }
            local(mouthSend(t, mm[2]) ? "\u{1F5E3}\uFE0F Sent to " + mm[1] + "'s mouthpiece. If it's yours, they'll see it." : "Couldn't reach them.");
            return;
          }
          status();
        }
      }]);
    } catch (e) {
      console.warn("[Dispensary] /dispensary unavailable:", e);
    }
  }
  function kitCommand(rest) {
    const a = rest.toLowerCase(), S3 = st();
    const lockedOut = () => {
      if (hardOn()) {
        local("\u{1F512} Hardcore: your keyholders hold that switch.");
        return true;
      }
      return false;
    };
    let m;
    if (/^(on|off)$/.test(a)) {
      if (lockedOut()) return;
      S3.kitsOn = a === "on";
      save();
      local(a === "on" ? `Kits can dress you now: a dose that says "kit: <name>" puts its crafter's outfit on you, ` + SPEED_NAMES[S3.kitSpeed || "steady"] + "." : "Kits can't dress you now.");
      return;
    }
    if (m = /^speed\s+(slow|steady|fast|now)$/.exec(a)) {
      S3.kitSpeed = m[1];
      save();
      local("Kits go on you " + SPEED_NAMES[m[1]] + ".");
      return;
    }
    if (m = /^(?:what|put)\s+(clothes|binds|restraints|both)$/.exec(a)) {
      if (lockedOut()) return;
      S3.kitWhat = m[1] === "restraints" ? "binds" : m[1];
      save();
      local("Kits can put " + { clothes: "clothes", binds: "restraints", both: "clothes and restraints" }[S3.kitWhat] + " on you.");
      return;
    }
    if (m = /^save\s+(.+)$/.exec(rest)) {
      const r = kitSave(m[1]);
      local(r.ok ? `Saved what you're wearin' as the kit "` + r.key + '" (' + r.n + ' pieces). Craft a dose that says "Kit: ' + r.key + '" to put it on somebody.' : { name: "Give it a name: /dispensary kit save <name>.", full: "You've eight kits saved already: /dispensary kit del <name> makes room.", empty: "You've nothin' on to save, sugar.", big: "That outfit's too big to keep as a kit." }[r.why]);
      return;
    }
    if (m = /^(?:del|delete|remove)\s+(.+)$/.exec(rest)) {
      local(kitDelete(m[1]) ? 'Kit "' + m[1].toLowerCase().trim() + '" deleted.' : "You've no kit called that.");
      return;
    }
    if (/^(stop|end|off now)$/.test(a)) {
      if (lockedOut()) return;
      local(kitNow() ? (end("kit", "quiet"), "The kit lets go of you, and your own outfit's back on.") : "No kit's on you.");
      return;
    }
    const k = kitNow(), n = kitNames();
    local((k ? "\u{1F457} On you: " + k.key + " from " + (nameOf(k.by) || "#" + k.by) + " (" + k.on + " pieces on" + (k.left ? ", " + k.left + " to go" : "") + "). " : "") + "Kits can dress you: " + (S3.kitsOn ? "yes" : "no") + " \xB7 they put on " + { clothes: "clothes", binds: "restraints", both: "clothes and restraints" }[S3.kitWhat || "both"] + " \xB7 " + SPEED_NAMES[S3.kitSpeed || "steady"] + ". Your kits: " + (n.own.length ? n.own.join(", ") : "none") + (n.lscg.length ? " \xB7 in LSCG: " + n.lscg.join(", ") : "") + ". /dispensary kit on|off \xB7 speed slow|steady|fast|now \xB7 what clothes|binds|both \xB7 save <name> \xB7 del <name>");
  }
  function holesCommand(sw, v) {
    if (sw) {
      if (hardOn()) {
        local("\u{1F512} Hardcore: your keyholders hold that switch.");
        return;
      }
      if (sw === "heal") {
        st().holesHeal = v === "on";
        save();
        local(v === "on" ? "Your holes close up slowly on their own now, once they've been left be a day." : "Your holes stay as they're trained, till somethin' tightens them.");
        return;
      }
      st().holesPain = v === "on";
      save();
      local(v === "on" ? "Too-big toys can hurt you now, and cruel ones mean it." : "Too-big toys only ache now, however big they are.");
      return;
    }
    const N = holesNow(), rows = Object.entries(N.holes).map(([h2, x]) => "Your " + HOLE_WORD[h2] + ": " + x.nowWord + (x.now !== x.trained ? " tonight, trained " + x.trainedWord : "") + (x.toward ? " (" + x.toward + "% to the next)" : "") + (x.toy ? ", the " + x.toy.name + " in it" : "") + (x.goal ? ", goal " + x.goal.word + (x.goal.due ? " " + dueWords(x.goal.due) : "") : "") + ".");
    local(rows.join(" ") + " Heal: " + (N.heal ? "on" : "off") + " \xB7 too-big toys hurt: " + (N.pain ? "yes" : "no") + (N.waiting ? " \xB7 " + N.waiting + " change" + (N.waiting === 1 ? "" : "s") + " waitin' to hand the farm girl" : "") + ". /dispensary holes heal on|off \xB7 /dispensary holes pain on|off \xB7 /dispensary train <who> <ass|pussy|throat> <size> [in 3 days]");
  }
  function trainCommand(rest) {
    const m = /^(\S+)\s+(\S+)\s*(.*)$/.exec(String(rest || "").trim());
    if (!m) {
      local("/dispensary train <who> <ass|pussy|throat> <size> [in 3 days | by friday], or /dispensary train <who> clear. The size is one of the farm's words: snug, loose, gaping, ruined, or size 1 to 10.");
      return;
    }
    const who2 = /^(me|myself|self)$/i.test(m[1]) ? W24.Player && W24.Player.MemberNumber : mouthTarget(m[1]);
    if (!who2) {
      local("Who? Their name or member number, in this room (or me).");
      return;
    }
    const self = who2 === (W24.Player && W24.Player.MemberNumber);
    if (/^(clear|stop|off|lift)$/i.test(m[2])) {
      if (self && hardOn()) {
        local("\u{1F512} Hardcore: your keyholders lift your goals.");
        return;
      }
      const h3 = HOLE_OF_WORD(m[3].trim().split(/\s+/)[0]);
      const r2 = sendClear(who2, h3);
      local(r2.self ? r2.ok ? "Your trainin' goal" + (h3 ? " for your " + HOLE_WORD[h3] : "s") + " lifted." : "You've no goal to lift." : r2.ok ? "Sent: their goal's lifted, if they've let you dose them." : "Couldn't reach them.");
      return;
    }
    const h2 = HOLE_OF_WORD(m[2]);
    if (!h2) {
      local("Which: ass, pussy or throat?");
      return;
    }
    const r = sendGoal(who2, h2, m[3]);
    if (!r.ok) {
      local(r.why === "size" ? "What size? One of the farm's words: snug, loose, well-used, gaping, wide open, ruined (a throat: eager, trained, deep, past gaggin', bottomless), or size 1 to 10." : r.why === "already" ? "Your " + HOLE_WORD[h2] + "'s already that open." : r.why === "hole" ? "You haven't got that." : "Couldn't reach them.");
      return;
    }
    local(r.self ? "\u{1F3AF} Your goal: your " + HOLE_WORD[h2] + ", " + sizeWord(h2, r.to) + ". Your trainers will work you there." : "\u{1F3AF} Sent: a goal for their " + HOLE_WORD[h2] + ", " + sizeWord(h2, r.to) + ". Their Dispensary tells you if it took.");
  }
  function seedCommand() {
    const I = seedInfo(), rows = [];
    for (const [h2, x] of Object.entries(I.held)) if (x.ml >= 1 || x.seal) rows.push("your " + { vulva: "pussy", butt: "ass", mouth: "belly, swallowed", nips: "tits" }[h2] + ": " + amountSay(x.ml) + (x.who ? ", mostly " + x.who + "'s" : "") + (x.seal ? " (sealed with " + x.seal.name + "'s " + x.seal.g + ")" : ""));
    local((rows.length ? "\u{1F4A6} In you now: " + rows.join(" \xB7 ") + ". Your belly's " + I.pct + "% full (it holds " + amountSay(I.cap) + " before it spills)." : "\u{1F4A6} Nothin' in you right now.") + (I.loads ? " Loads you've taken: " + I.loads + ", " + amountSay(I.ml) + " all told" + (I.top.length ? "; most from " + I.top.slice(0, 3).map((t) => t.name + " (" + t.n + ")").join(", ") : "") + "." : "") + (I.waiting ? " " + I.waiting + " waitin' to hand the farm girl." : ""));
  }
  function nipsOpenCommand(rest) {
    const parts2 = rest.split(/\s+/).filter(Boolean), last = String(parts2[parts2.length - 1] || "").toLowerCase();
    const wide = /^[1-3]$/.test(last) ? Number(last) : last === "wide" ? 2 : /^(gap(e|ing|in'?)|all|full)$/.test(last) ? 3 : 0;
    if (wide) parts2.pop();
    const meN = W24.Player && W24.Player.MemberNumber, whoW = parts2.join(" ");
    const who2 = !whoW || /^(me|myself|self|mine)$/i.test(whoW) ? meN : mouthTarget(whoW);
    if (!who2) {
      local("Who? Their name or member number, in this room. /dispensary nips open [1-3] does yours; /dispensary nips open <who> [1-3] does theirs.");
      return;
    }
    if (who2 === meN) {
      const r2 = nipsForce(wide || 3, meN);
      local(r2.ok ? "\u2B55 Your nipples are " + NIP_WORDS[r2.n] + " now, trained to stay that way" + (st().nipsHeal !== false ? " till they close up on their own." : ".") : "Your nipples are already " + NIP_WORDS[r2.n] + ", sugar.");
      if (r2.ok && pageOpen()) redrawPage();
      return;
    }
    const r = nipsForceSend(who2, wide || 3);
    local(r.ok ? "\u2B55 Sent to " + (nameOf(who2) || "#" + who2) + "'s Dispensary. If they've one and you're on their list, their nipples are " + NIP_WORDS[wide || 3] + " now." : "Couldn't reach them.");
  }
  function mouthTarget(w) {
    if (/^\d+$/.test(w)) return Number(w);
    const low = String(w).toLowerCase(), C2 = (W24.ChatRoomCharacter || []).find((c) => c && c.MemberNumber !== (W24.Player && W24.Player.MemberNumber) && [c.Nickname, c.Name].some((n) => n && String(n).toLowerCase().startsWith(low)));
    return C2 ? C2.MemberNumber : 0;
  }
  var wombSaid = "";
  function wombInk() {
    const F = W24.__farmInk;
    if (!F || typeof F.mine !== "function") return;
    const I = carryInfo();
    if (!I.known) return;
    const S3 = st(), v = { womb: { n: (I.litters || 0) + (S3.born ? 1 : 0), c: (I.carrying ? I.carrying.count || 1 : 0) + (I.eggs ? I.eggs.n : 0), away: !!(S3.born || S3.laid) } };
    const k = JSON.stringify(v);
    if (k === wombSaid) return;
    wombSaid = k;
    F.mine(v);
  }
  var CARRY_DEPS = { giveHeat: (mins, line3) => give("heat", { by: 260239, mins, line: line3, upto: true }), idsOf: (mn) => iconsIds(mn) };
  var SCAN_TOUCH = /^(Caress|Rub|MassageHands|Kiss|Pet|Grope|RubItem|Lick)$/;
  var scanAt = 0;
  function initCarryTouch(mod2) {
    try {
      mod2.hookFunction("ChatRoomMessage", 11, (args, next2) => {
        try {
          const data = args[0], P = W24.Player;
          if (data && data.Type === "Activity" && P && typeof data.Sender === "number" && data.Sender !== P.MemberNumber) {
            const D0 = Array.isArray(data.Dictionary) ? data.Dictionary : [], get = (k) => {
              const e = D0.find((x) => x && x[k] != null);
              return e ? e[k] : null;
            };
            const tgt = Number(get("TargetCharacter")) || 0, grp = String(get("FocusGroupName") || ""), name = String(get("ActivityName") || "");
            if (tgt === P.MemberNumber) {
              labourTouch(data.Sender, grp);
              if (SCAN_TOUCH.test(name) && /^Item(Pelvis|Torso)$/.test(grp) && Date.now() - scanAt > 2 * 6e4 && allowed(data.Sender)) {
                const C0 = (W24.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === data.Sender), it = C0 && (C0.Appearance || []).find((x) => x && x.Asset && x.Asset.Group && x.Asset.Group.Name === "ItemHandheld");
                if (it && it.Craft && /scan/i.test(String(it.Craft.Name || "") + " " + String(it.Craft.Description || "")) && dosesIn(((it.Craft.Name || "") + " | " + (it.Craft.Description || "")).toLowerCase()).some((d) => d.id === "scan") && !st().off.scan) {
                  scanAt = Date.now();
                  scan(data.Sender);
                }
              }
            }
          }
        } catch (e) {
          console.warn("[Dispensary] carry:", e);
        }
        return next2(args);
      });
    } catch (e) {
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
    initWorn(mod);
    initSenses(mod);
    initIcons(mod);
    initParasites(mod);
    initNipples(mod);
    nipsOnSuckle(paraSuckled);
    nipsOnFarmLoad(tellNipLoad);
    initHorny(mod, { nipsToyUsed: () => nipsToyUsed(), para: () => mine2() });
    initKits(mod, { end: (id) => end(id, "quiet"), byOf: (id) => st().doses[id] && st().doses[id].by || 0 });
    initHoles(mod);
    initSeed(mod);
    initBreed(mod);
    holesOnLoad((from, h2) => realLoad(from, h2));
    seedOnCarry((m) => carryWelcome(m));
    initCarryTouch(mod);
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
        wornTick();
        paraTick();
        nipsTrainTick();
        hornyTick();
        hornyParaTick();
        kitTick();
        holesTick();
        seedTick();
        breedTick();
        carryTick(Date.now(), CARRY_DEPS);
        wombInk();
        nipsTell(false);
        tickHard();
        screenTick();
        hazeTick();
        iconsTell(false);
        if (pageOpen()) redrawPage();
      } catch (e) {
        console.warn("[Dispensary] clock:", e);
      }
    }, 5e3);
    setTimeout(() => hello(true), 3e3);
  }
  var boot = setInterval(() => {
    const P = W24.Player;
    if (!P || typeof P.MemberNumber !== "number" || !P.ExtensionSettings) return;
    clearInterval(boot);
    try {
      start2();
    } catch (e) {
      console.warn("[Dispensary] didn't start:", e);
    }
  }, 1e3);
  var plainWords = (t) => String(t || "").toLowerCase().replace(/_+/g, " ");
  if (W24.__FARMHAND_TEST__) W24.__disp = {
    st: () => st(),
    dosesIn: (t) => dosesIn(t),
    farmHas: (id, p) => farmHas(id, p),
    book: () => Object.fromEntries(Object.entries(BOOK).map(([id, B]) => [id, { farm: !!B.farm, lscg: B.lscg || "", lscgOnly: !!B.lscgOnly, keywords: (B.keywords || []).slice() }])),
    phrases: { gloss: (t) => GLOSS_WORDS.test(plainWords(t)), later: (t) => isLater(plainWords(t)), horny: (t) => hornyOf(plainWords(t)), para: (t) => Object.keys(KINDS).filter((k) => KINDS[k].words.test(plainWords(t))) },
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
    },
    worn: () => wornGear(),
    wornTick: () => wornTick(),
    wornReset: () => wornReset(),
    trigger: (k, f) => trigger(k, f),
    para: () => mine2(),
    paraTick: () => paraTick(),
    latch: (k, o) => latch(k, o),
    climax: () => paraClimax(),
    haze: () => hazeTick(),
    icons: (mn) => iconsFor(mn),
    iconsTell: (f) => iconsTell(f),
    kit: () => kitNow(),
    kitTick: (now) => kitTick(now),
    kitSave: (n) => kitSave(n),
    kitLookup: (k) => kitLookup(k),
    kitEnd: () => kitEnd(false),
    kitCmd: (r) => kitCommand(r),
    holes: () => holesNow(),
    holesTick: (now) => holesTick(now),
    holesUsed: (...a) => holesUsed(...a),
    holesClimax: (f) => holesClimaxOf(f),
    holesBalm: (w, x) => holesBalm(w, x),
    holesSet: (h2, n) => holesSet(h2, n),
    holesReset: () => holesReset(),
    holesState: () => holesState(),
    holesDrips: () => holesDrips(),
    holesSend: (a) => sendNow(a),
    setGoal: (h2, to, by, ms) => setGoal(h2, to, by, ms),
    clearGoal: (h2) => clearGoal(h2),
    trainCmd: (r) => trainCommand(r),
    holesCmd: (s, v) => holesCommand(s, v),
    toys: () => toysNow(),
    seed: () => seedInfo(),
    seedGive: (o) => seedGive(o),
    seedTick: (now) => seedTick(now),
    seedState: () => seedState(),
    seedReset: () => seedReset(),
    seedSend: () => sendNow2(),
    seals: () => sealsNow(),
    seedDrain: () => seedDrain(),
    seedAmounts: (t) => seedAmounts(t),
    seedPlan: (a, o) => seedPlan(a, o),
    carryTick: (now) => carryTick(now, CARRY_DEPS),
    carry: (now) => carryInfo(now),
    carryReset: () => carryReset(),
    carryFeelNow: () => carryFeelNow(),
    carryWelcome: (m) => carryWelcome(m),
    labourTouch: (f, g) => labourTouch(f, g),
    bellyAll: (now) => bellyAll(now),
    breedTick: (now) => breedTick(now),
    realLoad: (f, h2) => realLoad(f, h2),
    tied: () => tied(),
    ripe: (now) => ripeNow(now),
    hipsUp: () => hipsUp(),
    breedReset: () => breedReset(),
    breedClimax: () => breedClimax(),
    breedLastIn: () => breedLastIn(),
    breedWelcome: (m) => breedWelcome(m),
    horny: () => hornyGear(),
    hornyTick: (now) => {
      hornyTick(now);
      hornyParaTick(now);
    },
    hornyBeat: (g) => hornyBeat(g),
    hornyClimax: () => hornyClimax(),
    hornyReset: () => hornyReset(),
    nips: () => nipsOpen(),
    nipsOf: (mn) => openOf(mn),
    nipsTrain: (now) => nipsTrainTick(now),
    nipsClose: () => nipsClose(),
    nipsForce: (n, by) => nipsForce(n, by),
    nipLoads: () => nipLoads(),
    nipsCream: (f) => nipsCream(f),
    nipsClimax: () => nipsClimax(),
    trained: () => trainedLevel(),
    nipsState: () => nipsState(),
    nipsAddOwn: () => nipsAddOwn(mod),
    nipsUsed: (from, k) => nipsUsed(from, k),
    nipsTell: (f) => nipsTell(f),
    suckled: (from) => paraSuckled(from)
  };
  W24.FarmhandDispensary = Object.freeze({
    version: VERSION,
    active: (id) => active(String(id)),
    dosedOf: (mn) => iconsDosed(Number(mn)),
    // anythin' in them now (glow ink, shared/ink/ink.js)
    doses: () => doseIds().filter(active).map((id) => ({ id, left: leftMs(id) })),
    // one dose, if it's in you: how strong, its part or spot (Fill-Out: cup, belly, ass · Tender: the spot), time left.
    // The Companion's drawn body reads Fill-Out from here.
    dose: (id) => {
      const d = st().doses[String(id)];
      return d && active(String(id)) ? { x: d.x || 1, p: d.p || "", left: leftMs(String(id)) } : null;
    },
    who: () => st().who,
    // hardcore, for the Companion (its own settings lock while yours is on)
    // growth off the farm (Nov 18): { cup, ass, cock, balls } sizes up (or down) from your own. The Companion's drawn body reads it.
    grow: () => grown(),
    // the crafted parasites in you (Nov 18): [{ kind, label, by, until }]
    parasites: () => Object.entries(mine2()).map(([k, p]) => ({ kind: k, label: KINDS[k] ? KINDS[k].label : k, by: p.by, until: p.until })),
    hard: () => hardOn() ? { on: true, until: st().hard && st().hard.until || 0, due: dueAt() } : null,
    // open nipples (Nov 18, nipples.js): 0 shut, 1 to 3 open, yours or what somebody's Dispensary told the room. The
    // Companion's drawn breasts can read it.
    nipples: (mn) => openOf(mn == null ? W24.Player && W24.Player.MemberNumber : Number(mn)),
    // (Nov 19) yours in full, for the Companion's Body rows: { open, trained, word, trainedWord, toward, loads, toy, locked }
    nipsInfo: () => nipsInfo(),
    // your holes (Nov 18, holes.js): { vulva|butt|throat: { label, now, trained, nowWord, trainedWord, toward, toy, goal } }.
    // The Companion's Body rows read it, so they're right off the farm too.
    holes: () => holesNow().holes,
    // (Nov 19) seed in you (seed.js): { held: { vulva|butt|mouth|nips: { ml, who, seal } }, belly, cap, pct, stage, loads, top }
    seed: () => seedInfo(),
    // how round your belly is with it, 0 flat to 4 huge: the Companion's drawn belly reads it, off the farm too
    seedBelly: () => bellyAll(),
    // (Nov 19: seed, a litter, a clutch: carry.js)
    // what you're carryin', by the farm's books (carry.js): { carrying: { count, sires, due, stage }, eggs, labour, heat, open, litters }
    carry: () => carryInfo()
  });
})();
