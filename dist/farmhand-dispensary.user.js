// ==UserScript==
// @name         BnB Farm — The Farmhand's Dispensary
// @namespace    bnbfarm
// @version      0.8.0
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
  function titPt(S2, s, t) {
    const sn = Math.sin(t), cs = Math.cos(t);
    if (sn >= 0) return [s * S2.bx + S2.r * cs * (1 + S2.sag * 0.3 * sn * sn) + s * S2.r * 0.06 * S2.k * sn * sn, S2.by + S2.r * sn * (1 + S2.sag)];
    const up = -sn;
    return [s * S2.bx + S2.r * cs * (1 - 0.5 * up * up) - s * S2.r * 0.2 * up * up, S2.by - S2.r * S2.top * up];
  }
  function titArc(g, S2, s, ox, oy, sc, a0, a1) {
    g.beginPath();
    for (let j = 0; j <= 120; j++) {
      let t = (a0 + (a1 - a0) * j / 120) * Math.PI;
      if (s < 0) t = Math.PI - t;
      const p = titPt(S2, s, t), X = ox + p[0] * sc, Y = oy + p[1] * sc;
      if (j) g.lineTo(X, Y);
      else g.moveTo(X, Y);
    }
  }
  function titPath(g, S2, s, ox, oy, sc) {
    g.beginPath();
    for (let j = 0; j <= 160; j++) {
      const p = titPt(S2, s, j / 160 * Math.PI * 2), X = ox + p[0] * sc, Y = oy + p[1] * sc;
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
  function shield(g, cx, cy, W16, H) {
    const t = cy - H / 2, L = cx - W16 / 2, R = cx + W16 / 2;
    g.beginPath();
    g.moveTo(L + 14, t);
    g.lineTo(R - 14, t);
    g.quadraticCurveTo(R, t, R, t + 14);
    g.lineTo(R, cy + H * 0.1);
    g.quadraticCurveTo(R - 8, cy + H * 0.36, cx, cy + H / 2);
    g.quadraticCurveTo(L + 8, cy + H * 0.36, L, cy + H * 0.1);
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
  function corrupted(lines, size, seed) {
    return (g, w, h2) => {
      const C = "#3a0d52", r = rng(seed);
      g.fillStyle = C;
      g.strokeStyle = C;
      const ys = lines.length === 1 ? [h2 / 2] : [h2 / 2 - size * 0.55, h2 / 2 + size * 0.55];
      let maxW = 0;
      lines.forEach((t, i) => {
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
    return o;
  }
  var text2 = text;
  var pct = (n) => Math.max(0, Math.min(100, n)) / 100;
  function tallyCount(g, x, y, n, h2, w, font) {
    tally(g, x, y, Math.min(n, 25), h2);
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
        const x0 = 94, y0 = 12, W16 = 192, H = 226;
        g.lineWidth = 3;
        g.strokeRect(x0, y0, W16, H);
        const L = (t, size, bold, yy, right) => {
          g.font = (bold ? "900 " : "") + size + "px Arial";
          g.textAlign = "left";
          g.textBaseline = "middle";
          g.fillText(t, x0 + 8, yy);
          if (right != null) {
            g.textAlign = "right";
            g.fillText(right, x0 + W16 - 8, yy);
          }
        };
        L("Breeding Facts", 21, true, y0 + 21);
        g.fillRect(x0 + 6, y0 + 37, W16 - 12, 1.5);
        L("Serving size", 12, false, y0 + 49, "1 load");
        L("Servings per day", 12, false, y0 + 64, "as many as fit");
        g.fillRect(x0 + 6, y0 + 75, W16 - 12, 8);
        L("Amount per serving", 11, true, y0 + 93);
        L("Loads taken", 21, true, y0 + 113, String(V.n));
        g.fillRect(x0 + 6, y0 + 126, W16 - 12, 4);
        [["Cum", "100%"], ["Seed that took", "100%"], ["Holes open", "3"], ["Dignity", "0%"]].forEach(([a, b], i) => {
          L(a, 12, i < 2, y0 + 142 + i * 17, b);
          g.fillRect(x0 + 6, y0 + 151 + i * 17, W16 - 12, 1);
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
  function drawCard(W16, d, V) {
    doc = W16.document;
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
  function picture(W16, d, m, layer, V) {
    const key2 = d.name + "|" + JSON.stringify(V);
    let set2 = cache.get(key2);
    if (set2) {
      cache.delete(key2);
      cache.set(key2, set2);
      return set2[layer] || null;
    }
    if (d.logo && !IMG.letters) return null;
    const base = drawCard(W16, d, V), parts2 = layersOf(base, m);
    set2 = {};
    for (const [n, c] of Object.entries(parts2)) set2[n] = shrink(c, m.box, m.s).toDataURL("image/png");
    cache.set(key2, set2);
    while (cache.size > CACHE_MAX) {
      const old = cache.keys().next().value, os = cache.get(old);
      cache.delete(old);
      for (const u of Object.values(os)) forget(W16, u);
    }
    return set2[layer] || null;
  }
  function forget(W16, url) {
    try {
      const m = W16.GLDrawImageCache;
      if (m && typeof m.delete === "function") m.delete(url);
    } catch (e) {
    }
    try {
      const m = W16.DrawImageCache;
      if (m && typeof m.delete === "function") m.delete(url);
    } catch (e) {
    }
    try {
      const gl = W16.GLDrawCanvas && W16.GLDrawCanvas.GL, tc = gl && gl.textureCache, t = tc && tc.get(url);
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
  function openInkPanel(W16, a) {
    Wd = W16;
    api = a;
    close();
    if (!W16.document.getElementById("fi-style")) {
      const s = W16.document.createElement("style");
      s.id = "fi-style";
      s.textContent = CSS;
      W16.document.head.appendChild(s);
    }
    box = W16.document.createElement("div");
    box.id = "fi-panel";
    W16.document.body.appendChild(box);
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
  var SLOT_NAMES = { FarmInk1: "Farm Ink 1", FarmInk2: "Farm Ink 2", FarmInk3: "Farm Ink 3", FarmInk4: "Farm Ink 4", FarmBrand: "Farm Brand" };
  var RES = ink_designs_default.res || 1;
  var OURS = /\/ink[^/]*\/(?:v\d+\/)?Farm(?:Ink|Brand)\//;
  var LIVE_SRC = /\/live\/(Farm(?:Ink[1-4]|Brand))\/(Live[A-Za-z]+)_([A-Za-z0-9]+)\.png$/;
  var STILL_SRC = /\/(Farm(?:Ink|Brand))\/([A-Za-z0-9]+)_[A-Za-z0-9]+\.png$/;
  var stillItem = (C, kind, name) => C && Array.isArray(C.Appearance) ? C.Appearance.find((it) => it && it.Asset && it.Asset.Name === name && it.Asset.Group && kindOf(it.Asset.Group.Name) === kind) : null;
  var PRIORITY = 11;
  var kindOf = (slot) => slot === BRAND_SLOT ? "FarmBrand" : /^FarmInk[1-4]$/.test(String(slot)) ? "FarmInk" : null;
  var TITLES = {};
  var MANIFEST = {};
  var K = {};
  for (const kind of ["FarmInk", "FarmBrand"]) for (const a of ink_designs_default.groups[kind]) {
    TITLES[kind + ":" + a.name] = a.title;
    if (a.live) MANIFEST[a.name] = a;
    if (a.k && a.k !== 1) K[kind + ":" + a.name] = a.k;
  }
  var kOf = (it) => it && it.Asset && it.Asset.Group && K[kindOf(it.Asset.Group.Name) + ":" + it.Asset.Name] || 1;
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
  function describe(W16) {
    for (const slot of [...INK_SLOTS, BRAND_SLOT]) {
      const G = W16.AssetGroupMap && W16.AssetGroupMap.get(slot);
      if (!G) continue;
      G.Description = SLOT_NAMES[slot];
      for (const A of G.Asset || []) {
        const t = TITLES[kindOf(slot) + ":" + A.Name];
        if (t) A.Description = t;
      }
    }
  }
  var gameReady = (W16) => typeof W16.AssetGroupAdd === "function" && typeof W16.AssetAdd === "function" && W16.AssetGroupMap && W16.AssetGroupMap.size > 30;
  function addSlots(W16) {
    if (W16.AssetGroupMap.has(INK_SLOTS[0])) {
      describe(W16);
      return false;
    }
    for (const slot of [...INK_SLOTS, BRAND_SLOT]) {
      const def = groupDef(slot), G = W16.AssetGroupAdd("Female3DCG", def);
      for (const a of def.Asset) W16.AssetAdd(G, a, W16.AssetFemale3DCGExtended || {}, def);
    }
    describe(W16);
    return true;
  }
  var itemIn = (C, slot) => C && Array.isArray(C.Appearance) ? C.Appearance.find((it) => it && it.Asset && it.Asset.Group && it.Asset.Group.Name === slot) : null;
  var whoOf = (C) => ({ num: C && C.MemberNumber, owner: C && C.Ownership && typeof C.Ownership.Name === "string" ? C.Ownership.Name : "" });
  function liveSrc(W16, C, slot, name, layer) {
    const d = LIVE_BY[name], m = MANIFEST[name], it = itemIn(C, slot);
    if (!d || !m || !it || it.Asset.Name !== name) return null;
    try {
      return picture(W16, d, m, layer, valuesFor(d, it.Property && it.Property.FarmInk, whoOf(C)));
    } catch (e) {
      console.warn("[Farm ink] couldn't draw " + name, e);
      return null;
    }
  }
  function wornLive(W16) {
    const P = W16.Player, out = [];
    for (const slot of [...INK_SLOTS, BRAND_SLOT]) {
      const it = itemIn(P, slot);
      if (it && isLive(it.Asset.Name)) out.push({ slot, name: it.Asset.Name, item: it });
    }
    return out;
  }
  var lastWrite = {};
  function write(W16, slot, values, now) {
    const it = itemIn(W16.Player, slot);
    if (!it || !kindOf(slot)) return false;
    const cur = it.Property && it.Property.FarmInk || {}, merged = Object.assign({}, cur, values);
    for (const k of Object.keys(merged)) if (merged[k] == null) delete merged[k];
    const next = cleanValues(merged);
    if (merged.manual === true) next.manual = true;
    if (JSON.stringify(next) === JSON.stringify(cur)) return false;
    const since2 = Date.now() - (lastWrite[slot] || 0);
    if (!now && since2 < 6e4) {
      clearTimeout(retry[slot]);
      retry[slot] = setTimeout(() => refreshAuto(W16), 60500 - since2);
      return false;
    }
    lastWrite[slot] = Date.now();
    it.Property = Object.assign({}, it.Property, { FarmInk: next });
    try {
      if (typeof W16.CharacterRefresh === "function") W16.CharacterRefresh(W16.Player);
    } catch (e) {
    }
    try {
      if (typeof W16.ChatRoomCharacterItemUpdate === "function") W16.ChatRoomCharacterItemUpdate(W16.Player, slot);
    } catch (e) {
    }
    return true;
  }
  var retry = {};
  var counts = {};
  var DAY = 864e5;
  var cumKey = (W16) => "farmink-lastcum-" + (W16.Player && W16.Player.MemberNumber);
  function daysDenied(W16) {
    let t = 0;
    try {
      t = Number(W16.localStorage.getItem(cumKey(W16))) || 0;
    } catch (e) {
    }
    return t ? Math.max(0, Math.floor((Date.now() - t) / DAY)) : 0;
  }
  function autoOf(W16, auto) {
    if (auto === "denied") return { n: daysDenied(W16) };
    const c = counts[auto];
    if (auto === "studs") return c && Array.isArray(c.list) ? { list: c.list, more: c.more || null } : null;
    if (auto === "scores") return Array.isArray(c) ? { rows: c } : null;
    if (auto === "bredOn") return c && c.d ? { d: c.d, due: c.due || null } : null;
    return typeof c === "number" ? { n: c } : null;
  }
  function refreshAuto(W16) {
    for (const { slot, name, item } of wornLive(W16)) {
      const d = LIVE_BY[name], own = item.Property && item.Property.FarmInk;
      if (!d.auto || own && own.manual) continue;
      const v = autoOf(W16, d.auto);
      if (v) write(W16, slot, v);
    }
  }
  var SLOT_OF = { 1: "FarmInk1", 2: "FarmInk2", 3: "FarmInk3", 4: "FarmInk4", brand: BRAND_SLOT };
  var say = (W16, t) => {
    try {
      if (typeof W16.ChatRoomSendLocal === "function") {
        const d = W16.document.createElement("div");
        d.style.cssText = "color:#c79bd8;white-space:pre-wrap";
        d.textContent = "\u{1F58B}\uFE0F " + t;
        W16.ChatRoomSendLocal(d.outerHTML);
      }
    } catch (e) {
    }
  };
  function wornAll(W16) {
    const out = [];
    for (const slot of [...INK_SLOTS, BRAND_SLOT]) {
      const it = itemIn(W16.Player, slot);
      if (!it) continue;
      const d = LIVE_BY[it.Asset.Name];
      out.push({ slot, name: it.Asset.Name, title: TITLES[kindOf(slot) + ":" + it.Asset.Name] || it.Asset.Name, live: !!d, fields: d ? d.fields : [], auto: d ? d.auto || null : null, values: it.Property && it.Property.FarmInk || {} });
    }
    return out;
  }
  var panelApi = (W16) => ({ worn: () => wornAll(W16), write: (slot, v) => write(W16, slot, v, true), command: (a) => inkCommand(W16, a) });
  function inkCommand(W16, args) {
    const a = String(args || "").trim(), m = /^(1|2|3|4|brand)\b\s*(.*)$/i.exec(a);
    const worn = wornLive(W16);
    if (!a && W16.document && W16.document.body) {
      openInkPanel(W16, panelApi(W16));
      return;
    }
    if (/^why$/i.test(a)) return say(W16, whyText());
    const sm = m && /^(size|wide|width|tall|height)\s+(\d{1,3})%?$/i.exec(m[2].trim());
    if (sm) {
      const slot2 = SLOT_OF[m[1].toLowerCase()], k = /^s/i.test(sm[1]) ? "sz" : /^w/i.test(sm[1]) ? "sw" : "sh", lim = k === "sz" ? [25, 400] : [50, 200];
      const v2 = Math.max(lim[0], Math.min(lim[1], Number(sm[2]))) / 100;
      if (!itemIn(W16.Player, slot2)) return say(W16, "Nothin' in " + SLOT_NAMES[slot2] + ".");
      write(W16, slot2, { [k]: v2 === 1 ? null : v2 }, true);
      return say(W16, SLOT_NAMES[slot2] + ": " + { sz: "size", sw: "width", sh: "height" }[k] + " " + Math.round(v2 * 100) + "%.");
    }
    if (!m) {
      if (!worn.length) return say(W16, "You've no live ink on. Pick one in the wardrobe (Farm Ink 1 to 4): the ones that say keeps count, a name, your number or your words. Then /ink <slot> <words> writes on it.");
      return say(W16, "Your live ink:\n" + worn.map(({ slot: slot2, name, item }) => {
        const d2 = LIVE_BY[name], own = item.Property && item.Property.FarmInk || {}, k = Object.keys(SLOT_OF).find((x) => SLOT_OF[x] === slot2);
        return "\u2022 " + k + ": " + d2.title + (own.t ? ' \xB7 "' + own.t + '"' : "") + (own.n != null ? " \xB7 " + own.n : "") + (own.list ? " \xB7 " + own.list.join(", ") : "") + (d2.auto ? own.manual ? " (your number, not the farm's)" : " (follows the farm)" : "");
      }).join("\n") + "\n/ink opens the ink panel \xB7 /ink <slot> <words> writes on it \xB7 /ink <slot> <number> sets a count \xB7 /ink <slot> a, b, c for a list \xB7 /ink <slot> auto follows the farm again \xB7 /ink <slot> clear \xB7 /ink <slot> size 150 (wide, tall)");
    }
    const slot = SLOT_OF[m[1].toLowerCase()], rest = m[2].trim(), it = itemIn(W16.Player, slot);
    if (!it) return say(W16, "Nothin' in " + SLOT_NAMES[slot] + ".");
    if (!isLive(it.Asset.Name)) return say(W16, (TITLES["FarmInk:" + it.Asset.Name] || TITLES["FarmBrand:" + it.Asset.Name] || "That") + " doesn't take writin': it's drawn as it is.");
    const d = LIVE_BY[it.Asset.Name];
    let v;
    if (!rest) return inkCommand(W16, "");
    if (/^clear$/i.test(rest)) v = { t: null, n: null, num: null, list: null, more: null, rows: null, d: null, due: null, manual: null };
    else if (/^auto$/i.test(rest)) {
      v = { manual: null, n: null, list: null, more: null, rows: null };
    } else if (/^\d{1,9}$/.test(rest) && (d.fields.includes("n") || d.fields.includes("num"))) v = d.fields.includes("num") ? { num: Number(rest) } : { n: Number(rest), manual: true };
    else if (rest.includes(",") && d.fields.includes("list")) v = { list: rest.split(",").map((x) => x.trim()).filter(Boolean), manual: true };
    else if (d.fields.includes("t")) v = { t: rest };
    else return say(W16, d.title + " takes " + (d.fields.includes("n") ? "a number" : d.fields.includes("num") ? "a number" : d.fields.includes("list") ? "names, with commas between" : "nothin'") + ".");
    write(W16, slot, v, true);
    if (/^auto$/i.test(rest)) refreshAuto(W16);
    say(W16, "Written on " + d.title + ".");
  }
  function registerInk(W16, mod2) {
    if (W16.__farmInk) return W16.__farmInk;
    const st2 = W16.__farmInk = {
      ready: false,
      slots: [...INK_SLOTS, BRAND_SLOT],
      designs: ink_designs_default.groups.FarmInk.length + ink_designs_default.groups.FarmBrand.length,
      live: Object.keys(MANIFEST).length,
      // for the Companion: the farm's counts for live ink (state.ink from the farm girl)
      counts: (c) => {
        if (c && typeof c === "object") {
          counts = c;
          try {
            refreshAuto(W16);
          } catch (e) {
          }
        }
      },
      write: (slot, v) => write(W16, slot, v, true),
      command: (a) => inkCommand(W16, a),
      worn: () => wornLive(W16).map(({ slot, name }) => ({ slot, name }))
    };
    const hooks = () => {
      const hook = (name, pri, fn) => {
        try {
          if (typeof W16[name] === "function") mod2.hookFunction(name, pri, fn);
          else console.warn("[Farm ink] the game has no " + name);
        } catch (e) {
          console.warn("[Farm ink] couldn't hook " + name, e);
        }
      };
      hook("AssetBaseURL", 0, (args, next) => {
        const slot = args[2] || args[1] && args[1].Name, kind = kindOf(slot);
        if (!kind) return next(args);
        return args[6] && isLive(args[6].Name) ? LIVE_HOST + slot + "/" : INK_HOST + kind + "/";
      });
      hook("AssetGetPreviewPath", 0, (args, next) => {
        const A = args[0], kind = A && A.Group && kindOf(A.Group.Name);
        return kind ? INK_HOST + kind + "/Preview" : next(args);
      });
      hook("AssetBuildDescription", 0, (args, next) => {
        const r = next(args);
        try {
          describe(W16);
        } catch (e) {
        }
        return r;
      });
      hook("CommonDrawAppearanceBuild", 5, (args, next) => {
        const C = args[0], cb = args[1];
        if (!cb || typeof cb !== "object") return next(args);
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
            const c = W16.GLDrawImageCache;
            if (c && typeof c.has === "function" && c.has(u) && !c.get(u).isLoaded()) return false;
          } catch (e) {
          }
          return true;
        };
        const statue = (plain, self, u, x, y, o) => {
          const T = W16.__farmInkTint;
          if (typeof T !== "function") return false;
          let t2;
          try {
            t2 = T(C, u, x, y);
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
        const wrap = (f, plain) => typeof f !== "function" ? f : function(src, x, y, o) {
          if (typeof src === "string") {
            const lm = src.indexOf("/live/") > 0 ? LIVE_SRC.exec(src) : null;
            if (lm) {
              const u = liveSrc(W16, C, lm[1], lm[2], lm[3]);
              seen.add(lm[2]);
              if (!u) {
                notReady.push(lm[2] + " (not drawn yet)");
                return void 0;
              }
              if (!ready(u)) notReady.push(lm[2]);
              const o3 = sized(o, itemIn(C, lm[1]));
              if (statue(plain, this, u, x, y, o3)) return void 0;
              return f.call(this, u, x, y, o3);
            }
            const sm = OURS.test(src) ? STILL_SRC.exec(src) : null;
            if (sm) {
              o = sized(o, stillItem(C, sm[1], sm[2]));
              seen.add(sm[2]);
              if (!ready(src)) notReady.push(sm[2]);
              if (statue(plain, this, src, x, y, o)) return void 0;
            }
          }
          return f.call(this, src, x, y, o);
        };
        const out = next([args[0], Object.assign({}, cb, { drawImage: wrap(cb.drawImage, cb.drawImage), drawImageBlink: wrap(cb.drawImageBlink, cb.drawImageBlink), drawImageColorize: wrap(cb.drawImageColorize, cb.drawImage), drawImageColorizeBlink: wrap(cb.drawImageColorizeBlink, cb.drawImageBlink) }), ...args.slice(2)]);
        try {
          note2(W16, C, seen, notReady);
        } catch (e) {
        }
        return out;
      });
      const keepInk = (name) => hook(name, 0, (args, next) => {
        const C = args[0], keep = C && Array.isArray(C.Appearance) ? C.Appearance.filter((it) => it && it.Asset && it.Asset.Group && kindOf(it.Asset.Group.Name)) : [];
        const r = next(args);
        try {
          let back = 0;
          if (keep.length && C && Array.isArray(C.Appearance)) {
            for (const it of keep) if (!C.Appearance.includes(it) && !itemIn(C, it.Asset.Group.Name)) {
              C.Appearance.push(it);
              back++;
            }
          }
          if (back && typeof W16.CharacterLoadCanvas === "function") W16.CharacterLoadCanvas(C);
        } catch (e) {
        }
        return r;
      });
      keepInk("CharacterAppearanceNaked");
      keepInk("CharacterAppearanceStripLayer");
      hook("AssetLoadAll", 0, (args, next) => {
        const r = next(args);
        try {
          addSlots(W16);
        } catch (e) {
          console.warn("[Farm ink] couldn't add the slots again", e);
        }
        return r;
      });
      hook("ActivityOrgasmStart", 0, (args, next) => {
        try {
          const C = args[0];
          if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && !W16.ActivityOrgasmRuined) {
            W16.localStorage.setItem(cumKey(W16), String(Date.now()));
            setTimeout(() => refreshAuto(W16), 1e3);
          }
        } catch (e) {
        }
        return next(args);
      });
    };
    const t = setInterval(() => {
      if (!gameReady(W16)) return;
      clearInterval(t);
      try {
        hooks();
        addSlots(W16);
        st2.ready = true;
      } catch (e) {
        console.warn("[Farm ink] couldn't add the slots", e);
      }
      loadLiveArt().then(() => {
        try {
          for (const C of W16.ChatRoomCharacter || []) if (wornByLogo(C) && typeof W16.CharacterLoadCanvas === "function") W16.CharacterLoadCanvas(C);
        } catch (e) {
        }
      });
      try {
        if (typeof W16.CommandCombine === "function") W16.CommandCombine([{ Tag: "ink", Description: "[slot words]: your live farm ink (counts, names, your own words)", Action: (a) => inkCommand(W16, a) }]);
      } catch (e) {
      }
    }, 50);
    setInterval(() => {
      try {
        if (W16.Player && W16.Player.Appearance) refreshAuto(W16);
      } catch (e) {
      }
    }, 10 * 6e4);
    return st2;
  }
  var DIAG = [];
  function note2(W16, C, seen, notReady) {
    if (!C || !Array.isArray(C.Appearance)) return;
    const pose = [].concat(C.ActivePose || [], C.Pose || []).join(",");
    if (/AllFours|Hogtied/.test(pose)) return;
    const worn = C.Appearance.filter((it) => it && it.Asset && it.Asset.Group && kindOf(it.Asset.Group.Name)).map((it) => it.Asset.Name);
    const missing = worn.filter((n) => !seen.has(n));
    if (!missing.length && !notReady.length) return;
    DIAG.push({ t: Date.now(), who: C.MemberNumber, name: String(C.Nickname || C.Name || ""), missing, notReady: [...new Set(notReady)] });
    if (DIAG.length > 40) DIAG.shift();
  }
  function whyText() {
    if (!DIAG.length) return "No ink has gone missin' since you logged in.";
    return "Ink that didn't show, newest last:\n" + DIAG.slice(-10).map((d) => new Date(d.t).toLocaleTimeString() + " \xB7 " + d.name + " (" + d.who + ")" + (d.missing.length ? " \xB7 not drawn at all: " + d.missing.join(", ") : "") + (d.notReady.length ? " \xB7 picture not loaded yet: " + d.notReady.join(", ") : "")).join("\n");
  }
  var wornByLogo = (C) => C && Array.isArray(C.Appearance) ? C.Appearance.some((it) => it && it.Asset && LIVE_BY[it.Asset.Name] && LIVE_BY[it.Asset.Name].logo) : false;

  // dispensary/src/index.js
  var import_bondage_club_mod_sdk = __toESM(require_bcmodsdk(), 1);

  // dispensary/src/version.js
  var VERSION = "0.8.0";

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
    s.mouthAuto = d.mouthAuto === true;
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
  var isMe = (C) => !!(C && typeof C.IsPlayer === "function" && C.IsPlayer());
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
      mod2.hookFunction("PoseCanChangeUnaidedStatus", 4, (args, next) => {
        const r = next(args);
        try {
          const [C, poseName] = args, PCS = W2.PoseChangeStatus;
          if (isMe(C) && poseNow() && PCS && STANDING().includes(poseName) && r === PCS.ALWAYS) return PCS.NEVER_WITHOUT_AID;
          if (isMe(C) && active("allfours") && PCS && poseName === "Kneel" && r === PCS.ALWAYS) return PCS.NEVER_WITHOUT_AID;
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
    const C = (W3.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn);
    return C ? String(C.Nickname || C.Name || "somebody") : "somebody";
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
  var LATER_WORDS = /\b(time[- ]?release\w*|slow[- ]?release\w*|delayed|capsules?)\b/;
  var isLater = (text3) => LATER_WORDS.test(String(text3 || "").toLowerCase());
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
    const S2 = st(), from = Math.max(S2.cravings || 0, Date.now() - CRAVE_DAYS * DAY2), out = {};
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

  // dispensary/src/worn.js
  var W5 = window;
  var MIN2 = 6e4;
  var DRIP_MINS = 10;
  var INJECT_EVERY = 30;
  var TRIGGER_GAP = 2 * MIN2;
  var PAUSE_MINS = 15;
  var DRIP_WORDS = /\b(drip\w*|iv|i\.v\.|laced|coated|soaked|infused|seeping)\b/;
  var INJECT_WORDS = /\b(injector|auto[- ]?inject\w*|dosing|dispenser|pump)\b/;
  var EVERY = /\bevery\s+(\d{1,3})\s*(?:min|minutes?)\b/;
  var TRIGGERS = {
    climax: /\b(on|when|whenever|every)\s+(?:she |he |they |you )?(climax\w*|cum\w*|orgasm\w*)\b/,
    kissed: /\bwhen\s+kiss\w*\b/,
    touched: /\bwhen\s+(touch\w*|groped|caressed|fondled)\b/,
    spanked: /\bwhen\s+(spank\w*|slapped|paddled)\b/
  };
  var ROULETTE_WORDS = /\b(roulette|mystery (?:dose|shot|serum|drink)|surprise (?:dose|shot))\b/;
  var GLOSS_WORDS = /\b(lip ?gloss|lipstick|lip balm|lip stain)\b/;
  var LSCG_SOAKED = /\b(soaked|laced)\b/;
  function dosesOf(text3) {
    const t = String(text3 || "").toLowerCase();
    const list = dosesIn(t);
    if (ROULETTE_WORDS.test(t)) {
      const S2 = st(), ok = doseIds().filter((id) => {
        const B = BOOK[id];
        return !B.instant && !S2.off[id] && !B.lscgOnly && !(B.lscg && lscgPresent());
      });
      if (ok.length) return [{ id: ok[Math.floor(Math.random() * ok.length)], x: list[0] ? list[0].x : 1, roulette: true }];
    }
    return list;
  }
  var crafterOf = (item) => {
    const n = item && item.Craft && Number(item.Craft.MemberNumber);
    return Number.isInteger(n) && n > 0 ? n : 0;
  };
  var me = () => W5.Player && W5.Player.MemberNumber || 0;
  var okFrom = (by) => !by || by === me() || allowed(by);
  var keyOf = (item) => (item.Asset && item.Asset.Group ? item.Asset.Group.Name : "?") + ":" + (item.Craft && item.Craft.Name || "");
  function ours2(id) {
    const B = BOOK[id];
    return !!B && !(B.farm && botHere()) && !(B.lscg && lscgPresent()) && !B.lscgOnly && !st().off[id];
  }
  function wornGear() {
    const P = W5.Player, out = [];
    if (!P || !Array.isArray(P.Appearance)) return out;
    for (const item of P.Appearance) {
      if (!item || !item.Craft) continue;
      const text3 = craftText(item);
      if (!text3) continue;
      const list = dosesOf(text3).filter((d) => ours2(d.id));
      const roulette = ROULETTE_WORDS.test(text3);
      if (!list.length && !roulette) continue;
      const trig = Object.keys(TRIGGERS).filter((k) => TRIGGERS[k].test(text3));
      const drip = DRIP_WORDS.test(text3) && !(lscgPresent() && LSCG_SOAKED.test(text3) && !/\bdrip|\biv\b/.test(text3));
      const inject = INJECT_WORDS.test(text3);
      if (!drip && !inject && !trig.length) continue;
      const every = EVERY.exec(text3);
      out.push({
        item,
        key: keyOf(item),
        text: text3,
        list,
        by: crafterOf(item),
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
        const list = g.roulette ? dosesOf(g.text).filter((d) => ours2(d.id)) : g.list;
        for (const d of list) {
          if (isLater(g.text)) queue(d.id, { by: g.by, x: d.x, p: d.p });
          else give(d.id, { by: g.by, x: d.x, p: d.p, line: fill(pick(LINES.worn.inject), { dose: BOOK[d.id].label }).replace(/%g/g, itemName(g.item)) });
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
      const list = g.roulette ? dosesOf(g.text).filter((d) => ours2(d.id)) : g.list;
      for (const d of list) {
        const r = give(d.id, { by: g.by, x: d.x, p: d.p, line: fill(pick(LINES.worn[kind] || LINES.worn.inject), { dose: BOOK[d.id].label, by: from ? nameOf(from) : "somebody" }).replace(/%g/g, itemName(g.item)) });
        if (r.ok) n++;
      }
    }
    return n;
  }
  var glossAt = {};
  function kissedBy(mn) {
    const C = (W5.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn);
    if (!C || !Array.isArray(C.Appearance) || paused()) return 0;
    let n = 0;
    for (const item of C.Appearance) {
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
      for (const d of dosesOf(text3).filter((x) => ours2(x.id))) {
        const r = give(d.id, { by: mn, x: d.x, p: d.p, line: fill(pick(LINES.worn.gloss), { dose: BOOK[d.id].label, by: nameOf(mn) }) });
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
      mod2.hookFunction("ActivityOrgasmStart", 4, (args, next) => {
        try {
          const C = args[0];
          if (C && typeof C.IsPlayer === "function" && C.IsPlayer()) setTimeout(() => trigger("climax"), 500);
        } catch (e) {
        }
        return next(args);
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

  // dispensary/src/parasites.js
  var W6 = window;
  var MIN3 = 6e4;
  var HOUR = 36e5;
  var KINDS = {
    lips: { label: "Parasite lips", icon: "\u{1F444}", words: /\bparasit\w*|\bparasite lips\b/, hours: 12, every: 30 },
    latex: { label: "Livin' latex", icon: "\u{1F5A4}", words: /\bliv(?:ing|in'?) latex\b|\bliving rubber\b|\blatex symbiote\b/, hours: 24, starve: 6 },
    moss: { label: "Milk moss", icon: "\u{1F331}", words: /\bmilk moss\b/, hours: 24, every: 40 },
    nestling: { label: "The nestling", icon: "\u{1F41B}", words: /\bnestling\b/, hours: 24, stages: 3 },
    brood: { label: "The brood mother", icon: "\u{1F95A}", words: /\bbrood ?mother\b|\bbrood queen\b/, hours: 24, every: 45 },
    vine: { label: "The leash vine", icon: "\u{1F33F}", words: /\bleash vine\b|\bvine leash\b/, worn: true, tiles: 3 },
    mouth: { label: "The mouthpiece", icon: "\u{1F5E3}\uFE0F", words: /\bmouthpiece\b/, worn: true }
  };
  var kindIds = () => Object.keys(KINDS);
  var DEFAULT_STRAIN = ["needy", "heat", "hairtrigger"];
  var me2 = () => W6.Player && W6.Player.MemberNumber || 0;
  var charOf = (mn) => (W6.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn);
  var send = (type, data, to) => {
    try {
      if (typeof W6.ServerSend === "function") W6.ServerSend("ChatRoomChat", makeMsg(type, data, to));
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
  var mine = () => st().para || (st().para = {});
  var line = (kind, which, v) => {
    const L = LINES.para && LINES.para[kind] && LINES.para[kind][which];
    return L && L.length ? fill(pick(L), v).replace(/%k/g, KINDS[kind].label.toLowerCase()) : "";
  };
  function latch(kind, o) {
    const K2 = KINDS[kind];
    if (!K2 || !on(kind)) return false;
    if (o.by && o.by !== me2() && !allowed(o.by)) return false;
    const P = mine();
    if (P[kind]) return false;
    const now = Date.now();
    P[kind] = { by: o.by || 0, name: String(o.name || "").slice(0, 30), since: now, until: K2.worn ? 0 : now + K2.hours * HOUR, strain: (o.strain || DEFAULT_STRAIN).filter((id) => BOOK[id]).slice(0, 4), fed: now, stage: 0, n: 0, eggs: 0, next: now + (K2.every || 30) * MIN3 };
    save();
    action(line(kind, "latch", { by: P[kind].name || "somebody" }));
    return true;
  }
  function letGo(kind, why) {
    const P = mine();
    if (!P[kind]) return false;
    delete P[kind];
    save();
    if (why !== "quiet") {
      const l = line(kind, why === "starved" ? "starved" : "off");
      if (l) local(l);
    }
    return true;
  }
  function wornParasites() {
    const P = W6.Player, out = [];
    if (!P || !Array.isArray(P.Appearance)) return out;
    for (const item of P.Appearance) {
      if (!item || !item.Craft) continue;
      const text3 = craftText(item);
      for (const kind of kindIds()) if (KINDS[kind].words.test(text3)) out.push({ kind, item, text: text3, by: Number(item.Craft.MemberNumber) || 0, name: String(item.Craft.MemberName || "") });
    }
    return out;
  }
  function paraTick() {
    const now = Date.now(), P = mine(), worn = wornParasites();
    if ((st().wornPause || 0) <= now) {
      for (const w of worn) if (!P[w.kind] && on(w.kind)) latch(w.kind, { by: w.by, name: w.name, strain: strainOf(w.text) });
    }
    if (P.moss && active("letdown")) P.moss.fed = now;
    for (const kind of ["vine", "mouth"]) if (P[kind] && !worn.some((w) => w.kind === kind)) letGo(kind, "off");
    for (const [kind, p] of Object.entries(P)) {
      const K2 = KINDS[kind];
      if (!K2) {
        delete P[kind];
        continue;
      }
      if (p.until && now > p.until) {
        letGo(kind, "done");
        continue;
      }
      if (K2.starve && now - p.fed > K2.starve * HOUR) {
        letGo(kind, "starved");
        continue;
      }
      if (!K2.every || now < p.next) continue;
      p.next = now + K2.every * MIN3;
      if (!inRoom()) continue;
      if (kind === "lips") {
        const id = p.strain[p.n++ % Math.max(1, p.strain.length)] || "needy";
        give(id, { by: p.by, line: fill(line("lips", "feed"), { dose: (BOOK[id] || {}).label || id }) });
        local(line("lips", "crave"));
      }
      if (kind === "moss") give("letdown", { by: p.by, line: line("moss", "feed") });
      if (kind === "brood") {
        p.eggs = Math.min(5, (p.eggs || 0) + 1);
        local(fill(line("brood", "lay"), {}).replace(/%n/g, String(p.eggs)));
      }
      save();
    }
  }
  function paraClimax() {
    const P = mine(), now = Date.now();
    if (P.latex) {
      P.latex.fed = now;
      P.latex.until = Math.min(P.latex.since + 72 * HOUR, Math.max(P.latex.until, now + KINDS.latex.hours * HOUR));
      give("hairtrigger", { by: P.latex.by, mins: 30, upto: true, quiet: active("hairtrigger"), line: line("latex", "feed") });
    }
    if (P.nestling) {
      const n = P.nestling;
      n.fed = now;
      if (n.stage < KINDS.nestling.stages) {
        n.stage++;
        give("fillout", { by: n.by, p: "belly", x: n.stage, mins: 60, line: line("nestling", "grow").replace(/%n/g, String(n.stage)) });
      } else give("fillout", { by: n.by, p: "belly", x: n.stage, mins: 60, upto: true, quiet: true });
    }
    save();
  }
  function paraKissGiven(to) {
    const P = mine();
    if (!to || to === me2()) return;
    if (P.lips) send("dispPara", { kind: "lips", strain: P.lips.strain, by: P.lips.by || me2(), name: myName() }, to);
    if (P.brood && P.brood.eggs > 0) {
      P.brood.eggs--;
      save();
      send("dispPara", { kind: "lips", strain: P.brood.strain, by: me2(), name: myName(), brood: true }, to);
      local(line("brood", "pass").replace(/%b/g, nameOf(to)));
    }
  }
  function onPara(from, m) {
    const kind = String(m.kind || "");
    if (!KINDS[kind] || KINDS[kind].worn) return;
    if (!on(kind) || !allowed(from)) return;
    const strain = Array.isArray(m.strain) ? m.strain.filter((id) => typeof id === "string" && BOOK[id]) : DEFAULT_STRAIN;
    latch(kind, { by: from, name: nameOf(from), strain });
  }
  function vineOk(X, Y) {
    const p = mine().vine;
    if (!p) return true;
    const C = charOf(p.by), pos = C && C.MapData && C.MapData.Pos;
    if (!pos || typeof pos.X !== "number") return true;
    return Math.max(Math.abs(X - pos.X), Math.abs(Y - pos.Y)) <= KINDS.vine.tiles;
  }
  var vineTold = 0;
  var asked = null;
  function onSay(from, m) {
    const p = mine().mouth;
    if (!p || p.by !== from) return;
    const text3 = String(m.text || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 300);
    if (!text3 || /^[\/(\[]/.test(text3)) return;
    if (st().mouthAuto === true) {
      say2(text3);
      send("dispSaid", { ok: true }, from);
      return;
    }
    asked = { from, text: text3 };
    local("\u{1F5E3}\uFE0F " + nameOf(from) + `'s mouthpiece wants you to say: "` + text3 + '"\nSay it: /dispensary say \xB7 let it pass: /dispensary nope');
  }
  function say2(text3) {
    try {
      W6.ServerSend("ChatRoomChat", { Content: text3, Type: "Chat" });
    } catch (e) {
    }
  }
  function sayAsked(yes) {
    if (!asked) return false;
    const a = asked;
    asked = null;
    if (yes) say2(a.text);
    send("dispSaid", { ok: !!yes }, a.from);
    return true;
  }
  function mouthSend(to, text3) {
    return send("dispSay", { text: String(text3).slice(0, 300) }, to);
  }
  function initParasites(mod2) {
    try {
      mod2.hookFunction("ActivityOrgasmStart", 3, (args, next) => {
        try {
          const C = args[0];
          if (C && typeof C.IsPlayer === "function" && C.IsPlayer()) setTimeout(() => paraClimax(), 600);
        } catch (e) {
        }
        return next(args);
      });
    } catch (e) {
    }
    try {
      mod2.hookFunction("ChatRoomMapViewCanEnterTile", 2, (args, next) => {
        const t = next(args);
        try {
          if (t > 0 && !vineOk(args[0], args[1])) {
            if (Date.now() - vineTold > 2e4) {
              vineTold = Date.now();
              local(line("vine", "tug"));
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
      mod2.hookFunction("ChatRoomMessage", 11, (args, next) => {
        try {
          const data = args[0];
          if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me2()) {
            const m = readMsg(data);
            if (m && m.type === "dispPara") onPara(data.Sender, m);
            else if (m && m.type === "dispSay") onSay(data.Sender, m);
            else if (m && m.type === "dispSaid") local(nameOf(data.Sender) + (m.ok ? " said it." : " let it pass."));
          }
        } catch (e) {
          console.warn("[Dispensary] parasites:", e);
        }
        return next(args);
      });
    } catch (e) {
      console.warn("[Dispensary] parasites can't hear:", e);
    }
  }

  // dispensary/src/needle.js
  var W7 = window;
  var botHere = () => (W7.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === BOT);
  var charOf2 = (mn) => (W7.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn) || (W7.Player && W7.Player.MemberNumber === mn ? W7.Player : null);
  function craftText(item) {
    if (!item || !item.Craft) return "";
    let d = item.Craft.Description || "";
    try {
      if (W7.CraftingDescription && typeof W7.CraftingDescription.Decode === "function") d = W7.CraftingDescription.Decode(d);
    } catch (e) {
    }
    return ((item.Craft.Name || "") + " | " + d).toLowerCase();
  }
  var handOf = (C) => C && Array.isArray(C.Appearance) ? C.Appearance.find((it) => it && it.Asset && it.Asset.Group && it.Asset.Group.Name === "ItemHandheld") : null;
  var handTextOf = (mn) => craftText(handOf(charOf2(mn)));
  function factsOf(data, sender) {
    try {
      if (typeof W7.ChatRoomMessageRunExtractors === "function") {
        const m = W7.ChatRoomMessageRunExtractors(data, sender).metadata;
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
    const text3 = craftText(item), list = dosesOf(text3), at = Date.now(), done = [], later = isLater(text3);
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
          const data = args[0], P = W7.Player;
          if (data && data.Type === "Activity" && P && typeof data.Sender === "number") {
            const sender = charOf2(data.Sender) || (data.Sender === P.MemberNumber ? P : null), f = factsOf(data, sender);
            if (/^(Inject|SipItem|EatItem)$/.test(f.name || "") && f.target === P.MemberNumber && sender) onNeedle(data.Sender, handOf(sender));
            if (f.target === P.MemberNumber && data.Sender !== P.MemberNumber) onActivity(f.name, data.Sender);
            if (data.Sender === P.MemberNumber && typeof f.target === "number" && f.target !== P.MemberNumber && /^(Kiss|FrenchKiss|PoliteKiss|GaggedKiss|SiblingsCheekKiss)$/.test(f.name || "")) paraKissGiven(f.target);
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

  // dispensary/src/hardcore.js
  var W8 = window;
  var DAY3 = 864e5;
  var CHECK_DAYS = 30;
  var me3 = () => W8.Player && W8.Player.MemberNumber || 0;
  var here = (mn) => (W8.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === mn);
  var who = (mn) => here(mn) ? nameOf(mn) : "#" + mn;
  var onChange = () => {
  };
  function onHardChange(f) {
    onChange = f;
  }
  var hardOn = () => !!(st().hard && st().hard.on);
  function keyholders() {
    const P = W8.Player, out = [];
    const own = P && P.Ownership && P.Ownership.MemberNumber;
    if (typeof own === "number" && own > 0 && own !== me3()) out.push(own);
    if (st().stock) {
      for (const m of PROPRIETORS) if (m !== me3() && !out.includes(m)) out.push(m);
    }
    for (const m of st().keys || []) if (m !== me3() && !out.includes(m)) out.push(m);
    return out;
  }
  var MAX_KEYS = 10;
  function addKey(mn) {
    mn = Math.round(Number(mn));
    if (hardOn()) return { ok: false, why: "locked" };
    if (!Number.isInteger(mn) || mn <= 0 || mn >= 1e9) return { ok: false, why: "number" };
    if (mn === me3()) return { ok: false, why: "self" };
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
      const C = W8.FarmhandCompanion;
      return C && typeof C.hardPrefs === "function" ? C : null;
    } catch (e) {
      return null;
    }
  };
  var isKey = (mn) => typeof mn === "number" && keyholders().includes(mn);
  function dueAt() {
    const H = st().hard || {};
    return H.until ? H.until : (H.checkAt || H.since || Date.now()) + CHECK_DAYS * DAY3;
  }
  function log(by, what) {
    const H = st().hard;
    H.log = (H.log || []).concat({ t: Date.now(), by, what: String(what).slice(0, 200) }).slice(-50);
  }
  var hardLog = () => (st().hard && st().hard.log || []).slice();
  function sendTo(mn, type, data) {
    try {
      if (here(mn) && typeof W8.ServerSend === "function") {
        W8.ServerSend("ChatRoomChat", makeMsg(type, data, mn));
        return true;
      }
    } catch (e) {
    }
    return false;
  }
  function beepTo(mn, text3) {
    try {
      if (typeof W8.ServerSend === "function") {
        W8.ServerSend("AccountBeep", { MemberNumber: mn, BeepType: "", Message: String(text3).slice(0, 900) });
        return true;
      }
    } catch (e) {
    }
    return false;
  }
  function announce() {
    const H = st().hard || {}, keys = keyholders();
    for (const k of keys) sendTo(k, "dispHard", { on: hardOn(), until: H.until || 0, due: hardOn() ? dueAt() : 0, keys, name: W8.Player && (W8.Player.Nickname || W8.Player.Name) || "" });
  }
  function lock(days) {
    if (hardOn()) return { ok: false, why: "on" };
    if (!keyholders().length) return { ok: false, why: "nokey" };
    const now = Date.now(), d = Math.max(0, Math.min(CHECK_DAYS, Math.round(Number(days) || 0)));
    st().hard = { on: true, since: now, until: d ? now + d * DAY3 : 0, checkAt: now, log: st().hard && st().hard.log || [] };
    log(me3(), d ? "locked in for " + d + " day" + (d === 1 ? "" : "s") : "locked in, no end date");
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
    if (now - last > DAY3) log(by, "checked in");
    save();
    onChange();
    return true;
  }
  function tickHard() {
    if (!hardOn()) return;
    const H = st().hard, now = Date.now();
    if (H.until && now >= H.until) unlock(me3(), "the end date came");
    else if (!H.until && now - (H.checkAt || H.since || now) >= CHECK_DAYS * DAY3) unlock(0, CHECK_DAYS + " days without a keyholder checkin' in");
  }
  var askedAt = 0;
  function askOut() {
    const now = Date.now(), keys = keyholders(), name = W8.Player && (W8.Player.Nickname || W8.Player.Name) || "Somebody";
    if (now - askedAt < 5 * 6e4) {
      local("\u{1F5DD}\uFE0F Your keyholders have already been asked. Your doses stay till one of them lets you out.");
      return 0;
    }
    askedAt = now;
    let n = 0;
    for (const k of keys) {
      if (sendTo(k, "dispAsk", { name })) n++;
      else if (beepTo(k, "\u{1F5DD}\uFE0F " + name + " (" + me3() + ") is askin' to be let out of hardcore in The Farmhand's Dispensary. If you've the Dispensary, open its page (Keys you hold); with the Companion, /keys letout " + me3() + ".")) n++;
    }
    log(me3(), "asked to be let out");
    save();
    local("\u{1F5DD}\uFE0F Hardcore: your doses stay. " + (n ? "Your keyholders have been asked to let you out: " + keys.map(who).join(", ") + "." : "None of your keyholders could be reached just now."));
    return n;
  }
  function onKey(by, m) {
    if (!isKey(by) || !m || typeof m !== "object") return false;
    const H = st().hard, nm = who(by);
    if (m.do === "check") {
      if (checkIn(by)) sendTo(by, "dispHard", { on: true, until: H.until || 0, due: dueAt(), keys: keyholders(), name: W8.Player && (W8.Player.Nickname || W8.Player.Name) || "" });
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
      H.until = d ? Date.now() + d * DAY3 : 0;
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
    if (!Array.isArray(m.keys) || !m.keys.includes(me3())) return;
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
    const nm = W8.Player && (W8.Player.Nickname || W8.Player.Name) || "Your keyholder";
    return beepTo(mn, "\u{1F5DD}\uFE0F " + nm + " " + words[what] + ". [fd:" + what + "]") ? "beep" : null;
  }
  function initHardcore(mod2) {
    try {
      mod2.hookFunction("ChatRoomMessage", 11, (args, next) => {
        try {
          const data = args[0];
          if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me3()) {
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
  var W9 = window;
  var api2 = null;
  var caps = null;
  var syncing = null;
  var REG = {};
  var lastLscg = {};
  var ours3 = (id) => LSCG_ID + "." + id;
  var minsLeft = (id) => Math.ceil(leftMs(id) / 6e4);
  var BREATH_MINS = 10;
  function lscgPresent() {
    if (W9.LSCG) return true;
    try {
      const sdk = W9.bcModSdk;
      if (sdk && typeof sdk.getModsInfo === "function") return sdk.getModsInfo().some((m) => m && m.name === "LSCG");
    } catch (e) {
    }
    return false;
  }
  var lscgApi = () => !!(api2 && caps && caps.has("drugs"));
  var lscgHas = (id) => lscgApi() && !!REG[id];
  var lastLscgDose = (id) => lastLscg[id] || 0;
  function lscgDose(type, o) {
    if (!lscgApi()) return false;
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
      api2.drugs.dose(ours3(id), { multiplier: 1, method: "inject", sender: by || void 0, minigame: false });
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
        if (B.lscg || B.instant || REG[id]) continue;
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
    const q = W9.LSCG_OnLoad = W9.LSCG_OnLoad || [];
    q.push((L) => {
      try {
        setUp(L);
      } catch (e) {
        console.warn("[Dispensary] LSCG hookup:", e);
      }
    });
  }

  // dispensary/src/doses.js
  var W10 = window;
  var MIN4 = 6e4;
  var CAP = 48 * 60 * MIN4;
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
      words: /\bhoney[- ]tongue\b/,
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
      words: /\bgolden[- ]hour\b/,
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
      words: /\b(blue[- ]ribbon[- ]musk|ribbon musk)\b/,
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
      words: /\becho[- ]elixir\b/,
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
      words: /\b(udder|breast|tits?|boobs?|chest|cup) (growth|boost|enlarger)\b/,
      keywords: ["udder growth", "breast growth"],
      desc: "A cup bigger for every dose, and it stays. Your Companion's drawn breasts show it. A reducing serum takes one back off."
    },
    growass: {
      label: "Ass Growth",
      icon: "\u{1F351}",
      mins: 0,
      color: "#f0a080",
      farm: true,
      instant: true,
      grow: "ass",
      words: /\b(ass|butt|booty|hips?) (growth|enlarger)\b/,
      keywords: ["ass growth"],
      desc: "A size rounder behind for every dose, and it stays (counted now; drawn when the drawn body learns hips)."
    },
    growcock: {
      label: "Cock Growth",
      icon: "\u{1F346}",
      mins: 0,
      color: "#c07090",
      farm: true,
      instant: true,
      grow: "cock",
      words: /\b(cock|penis|dick|shaft) (growth|enlarger)\b/,
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
      words: /\b(balls?|testes|testicles?|nuts) (growth|enlarger)\b/,
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
      words: /\b(reducing (?:serum|shot|tonic|potion|drops?)|(?:udder|breast|boob|tits?|ass|butt|balls?|testicle|testes|penis|cock|dick) (?:reducer|reducing))\b/,
      // (not "shrinking": that's LSCG's, and it shrinks all of you)
      keywords: ["reducing serum"],
      desc: "Takes a size back off whatever the bottle names (Udder Reducer, Cock Reducer, Reducing Serum (ass)...; tits if it doesn't say)."
    },
    // ── Nov 18: poses and senses (senses.js) ──
    weakknees: {
      label: "Weak Knees",
      icon: "\u{1F9B5}",
      mins: 20,
      color: "#c9a0dc",
      every: [6, 10],
      words: /\b(weak[- ]?knees?|jelly[- ]?legs?|kneel(?:ing)? (?:serum|draught|shot|tonic|potion))\b/,
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
      words: /\b(down[- ](?:girl|boy|pet) (?:serum|draught|shot|tonic|potion|drops?)|all[- ]fours (?:serum|draught|shot|tonic|potion|drops?))\b/,
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
      words: /\b(blind(?:er|ing)? drops?|dim(?:ming)? drops?|darkness drops?)\b/,
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
      words: /\b(cotton[- ]?ears?|deaf(?:ening)? (?:drops?|serum|draught|tonic)|muffl\w* drops?)\b/,
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
      words: /\b(tunnel[- ]?vision(?: (?:drops?|serum|draught|tonic))?|blinker (?:drops?|serum))\b/,
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
      words: /\b(haze (?:drops?|serum|potion|mist|tonic)|hazy (?:drops?|serum|potion)|daze (?:drops?|serum))\b/,
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
      words: /\b(statue (?:serum|potion|tonic|draught|drops?|elixir|shot)|petrif(?:y|ying|ication) (?:serum|potion|tonic|draught|drops?|elixir|shot)|stone[- ]?skin|gilding (?:serum|potion|tonic|draught|drops?|elixir|shot))\b/,
      keywords: ["statue serum", "petrifying draught"],
      soak: ["petrifying"],
      desc: "Half an hour as a statue: your skin and hair turn to stone, or porcelain, gold, black latex, marble or bronze if the bottle says. Your eyes are glass set in it, still your own colour; your ink turns with your skin, and your arousal stops right where it is. Everybody with the Companion sees it."
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
  var TENDER_DEFAULT = "nipples";
  var PART_RE = { belly: /\b(belly|tummy|stomach|womb)\b/, ass: /\b(ass|butt|bum|rear|hips?|booty)\b/ };
  var STATUE_MATS = { stone: "stone", porcelain: "porcelain", gold: "gold", latex: "black latex", marble: "marble", bronze: "bronze" };
  function statueMat(t) {
    t = String(t || "").toLowerCase();
    return /porcelain|china doll|\bchina\b/.test(t) ? "porcelain" : /\bgold|gild/.test(t) ? "gold" : /latex|rubber/.test(t) ? "latex" : /marble/.test(t) ? "marble" : /bronze/.test(t) ? "bronze" : "stone";
  }
  function partFor(id, text3) {
    const t = String(text3 || "").toLowerCase();
    if (id === "fillout") return PART_RE.belly.test(t) ? "belly" : PART_RE.ass.test(t) ? "ass" : "cup";
    if (id === "statue") return statueMat(t);
    if (id === "reducing") return /\b(cock|penis|dick|shaft)\b/.test(t) ? "cock" : /\b(balls?|testes|testicles?|nuts)\b/.test(t) ? "balls" : PART_RE.ass.test(t) ? "ass" : "cup";
    if (id === "tender") {
      for (const [k, s] of Object.entries(TENDER_SPOTS)) if (s.re.test(t.replace(BOOK.tender.words, " "))) return k;
      return "";
    }
    return "";
  }
  function dosesIn(text3) {
    const t = String(text3 || "").toLowerCase(), x = stackOf(t);
    return doseIds().filter((id) => BOOK[id].words.test(t)).map((id) => {
      const p = partFor(id, t);
      return p ? { id, x, p } : { id, x };
    });
  }
  function partOf(id) {
    const d = st().doses[id];
    if (id === "fillout") return d && d.p || "cup";
    if (id === "statue") return d && d.p || "stone";
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
  var spotIn = (t, id, p) => id === "tender" ? String(t).replace(/%s/g, TENDER_SPOTS[TENDER_SPOTS[p] ? p : partOf(id)].word) : id === "statue" ? String(t).replace(/%m/g, STATUE_MATS[p] || STATUE_MATS[partOf(id)] || "stone") : t;
  var ours4 = (id, kind, p) => {
    const L = poolOf(id, p);
    return L && L[kind] && L[kind].length ? spotIn(fill(pick(L[kind])), id, p) : "";
  };
  function takeLine(id) {
    const v = voiceOf(id);
    return v && v.seen.length ? nameIn(pick(v.seen)) : ours4(id, "take");
  }
  function nowLine(id) {
    const v = voiceOf(id);
    return v && v.now.length ? nameIn(pick(v.now)) : ours4(id, "now");
  }
  function offLine(id, p) {
    const v = voiceOf(id);
    return v && v.off.length ? nameIn(pick(v.off)) : ours4(id, "off", p);
  }
  function tellPage(detail) {
    try {
      W10.dispatchEvent(new W10.CustomEvent("farmhand-dispensary", { detail }));
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
    if (B.instant) return B.grow ? grow(id, o) : purge(o);
    if (B.lscg && lscgPresent()) return { ok: false, why: "lscg" };
    if (B.lscgOnly) return { ok: false, why: "nolscg" };
    const now = Date.now(), x = Math.max(1, Math.min(5, Math.round(Number(o.x) || 1)));
    const tol = o.upto ? 1 : toleranceOf(id, now);
    const dur = Math.max(MIN4, Math.min(CAP, (Number(o.mins) > 0 ? Number(o.mins) : B.mins * x) * MIN4 * tol));
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
  var GROW_LIMITS = { cup: [-6, 10], ass: [-3, 6], cock: [-3, 6], balls: [-3, 6] };
  function grow(id, o) {
    const B = BOOK[id], S2 = st(), g = S2.grow || (S2.grow = {}), x = Math.max(1, Math.min(5, Math.round(Number(o.x) || 1)));
    const part = B.grow === "less" ? o.p && GROW_LIMITS[o.p] ? o.p : "cup" : B.grow, sign = B.grow === "less" ? -1 : 1;
    const [lo, hi] = GROW_LIMITS[part], was = g[part] || 0, now = Math.max(lo, Math.min(hi, was + sign * x));
    if (now === was) {
      if (!o.quiet) local(fill(NOTES.growMax, { dose: B.label }));
      return { ok: false, why: "max" };
    }
    g[part] = now;
    save();
    if (!o.quiet) action(o.line || fill(pick(LINES.grow[sign > 0 ? part : "less"])).replace(/%p/g, { cup: "tits", ass: "ass", cock: "cock", balls: "balls" }[part]));
    tellPage({ type: "grow", part, n: now });
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
    if (st().para && Object.keys(st().para).length) {
      n += Object.keys(st().para).length;
      st().para = {};
    }
    st().wornPause = Date.now() + 15 * MIN4;
    save();
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
    if (now - lastSave > MIN4) {
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
      if (typeof W10.CharacterSetFacialExpression === "function" && W10.Player) W10.CharacterSetFacialExpression(W10.Player, group, expr, secs);
    } catch (e) {
    }
  };
  var meter = () => {
    const A = W10.Player && W10.Player.ArousalSettings;
    return A && A.Active !== "Inactive" && A.Active !== "NoMeter" ? A : null;
  };
  function setArousal(v) {
    try {
      const A = meter();
      if (!A) return;
      const n = Math.max(0, Math.min(100, Math.round(v)));
      if (typeof W10.ActivitySetArousal === "function") W10.ActivitySetArousal(W10.Player, n);
      else A.Progress = n;
    } catch (e) {
    }
  }
  var xOf = (id) => st().doses[id] && st().doses[id].x || 1;
  var felt = {};
  var FLUSHED = ["needy", "heat", "rut", "letdown"];
  var xOfDose = (id) => st().doses[id] && st().doses[id].x || 1;
  var leak = () => tellPage({ type: "leak", mess: "milk", areas: ["chest"], amount: Math.min(2, 0.5 + 0.25 * xOf("letdown")) });
  function start(id) {
    if (id === "sedative") face("Eyes", "Dazed", 180);
    if (FLUSHED.includes(id)) face("Blush", id === "letdown" ? "Low" : "Medium", 120);
    if (id === "airhead") face("Eyes", "Dazed", 120);
    if (id === "letdown") leak();
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
  function feel(id, now) {
    const B = BOOK[id];
    const f = felt[id] || (felt[id] = { face: now, next: now + ((B.every ? B.every[0] : 3) + Math.random() * 2) * MIN4 });
    if (id === "sedative" && now - f.face > 2 * MIN4) {
      f.face = now;
      face("Eyes", "Dazed", 180);
    }
    if (id === "needy") {
      const A = meter(), cap = Math.min(92, 60 + 10 * xOf(id));
      if (A && (Number(A.Progress) || 0) < cap) setArousal((Number(A.Progress) || 0) + 2);
      if (now - f.face > 2 * MIN4) {
        f.face = now;
        face("Blush", "Medium", 120);
      }
    }
    if (id === "heat") {
      const A = meter(), floor = Math.min(70, 25 + 15 * xOf(id));
      if (A && (Number(A.Progress) || 0) < floor) setArousal(floor);
      if (now - f.face > 2 * MIN4) {
        f.face = now;
        face("Blush", "Medium", 120);
      }
    }
    if (id === "rut") {
      const A = meter(), floor = Math.min(60, 20 + 10 * xOf(id));
      if (A && (Number(A.Progress) || 0) < floor) setArousal(floor);
      if (now - f.face > 2 * MIN4) {
        f.face = now;
        face("Blush", "Medium", 120);
      }
    }
    if (id === "airhead" && now - f.face > 2 * MIN4) {
      f.face = now;
      face("Eyes", "Dazed", 120);
    }
    if (B.every && now >= f.next && inRoom()) {
      f.next = now + (B.every[0] + Math.random() * (B.every[1] - B.every[0])) * MIN4;
      const l = nowLine(id);
      if (l) {
        if (B.room) action(l);
        else local(id === "honey" ? "\u{1F36F} The farm girl leans in close to your ear: " + l : id === "golden" ? "\u2728 " + l : l);
      }
      if (id === "letdown") leak();
    } else if (!B.every && id === "sedative" && now >= f.next && inRoom()) {
      f.next = now + (8 + Math.random() * 6) * MIN4;
      local(pick(LINES.sedative.drift));
    }
  }
  var heldTold = 0;
  var toldAt = {};
  function feltOnce(id, kind, gap) {
    const now = Date.now(), k = id + ":" + kind;
    if (now - (toldAt[k] || 0) < gap) return;
    toldAt[k] = now;
    const l = ours4(id, kind);
    if (l) local(l);
  }
  function initDoses(mod2) {
    const stone = (C) => !!(C && typeof C.IsPlayer === "function" && C.IsPlayer() && active("statue"));
    for (const fn of ["ActivitySetArousal", "ActivitySetArousalTimer", "ActivityTimerProgress", "ActivityOrgasmPrepare"]) {
      try {
        if (typeof W10[fn] === "function") mod2.hookFunction(fn, 7, (args, next) => stone(args[0]) ? void 0 : next(args));
      } catch (e) {
        console.warn("[Dispensary] the Statue Serum can't hold " + fn + ":", e);
      }
    }
    try {
      mod2.hookFunction("ActivityOrgasmPrepare", 6, (args, next) => {
        try {
          const C = args[0];
          if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && active("denial")) {
            if (C.ArousalSettings) C.ArousalSettings.Progress = 94;
            face("Blush", "High", 20);
            if (Date.now() - heldTold > MIN4) {
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
          if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && active("bitterroot")) W10.ActivityOrgasmRuined = true;
        } catch (e) {
        }
        try {
          const C = args[0];
          if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && active("golden") && !W10.ActivityOrgasmRuined) setTimeout(() => local(pick(LINES.goldenDote)), 2500);
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
              feltOnce("rut", "again", MIN4);
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

  // dispensary/src/icons.js
  var W11 = window;
  var others = /* @__PURE__ */ new Map();
  var me4 = () => W11.Player && W11.Player.MemberNumber || 0;
  var inRoom2 = () => W11.CurrentScreen === "ChatRoom" && typeof W11.ServerSend === "function";
  var mineNow = () => ({ ids: doseIds().filter(active).slice(0, 8), para: Object.keys(st().para || {}).length > 0 });
  var lastSig = "";
  var lastAt2 = 0;
  function iconsTell(force) {
    if (!inRoom2()) return false;
    const S2 = st(), m = S2.iconsShare === false ? { ids: [], para: false } : mineNow(), sig = JSON.stringify(m);
    if (!force && (sig === lastSig || Date.now() - lastAt2 < 4e3)) return false;
    lastSig = sig;
    lastAt2 = Date.now();
    try {
      W11.ServerSend("ChatRoomChat", makeMsg("dispIcons", m));
      return true;
    } catch (e) {
      return false;
    }
  }
  function onIcons(from, m) {
    const ids = Array.isArray(m.ids) ? m.ids.filter((id) => typeof id === "string" && BOOK[id]).slice(0, 8) : [];
    if (!ids.length && !m.para) others.delete(from);
    else others.set(from, { ids, para: !!m.para, at: Date.now() });
  }
  function iconsFor(mn) {
    const e = mn === me4() ? mineNow() : others.get(mn);
    if (!e) return "";
    return e.ids.slice(0, 5).map((id) => BOOK[id].icon).join("") + (e.para ? "\u{1FAB1}" : "");
  }
  function initIcons(mod2) {
    try {
      mod2.hookFunction("ChatRoomDrawCharacterStatusIcons", 0, (args, next) => {
        const r = next(args);
        try {
          const [C, X, Y, Z] = args;
          if (st().iconsShow === false || !C) return r;
          const t = iconsFor(C.MemberNumber);
          if (t && typeof W11.DrawTextFit === "function") W11.DrawTextFit(t, X + 250 * Z, Y + 22 * Z, 200 * Z, "White", "Black");
        } catch (e) {
        }
        return r;
      });
    } catch (e) {
      console.warn("[Dispensary] dose icons can't be drawn:", e);
    }
    try {
      mod2.hookFunction("ChatRoomMessage", 11, (args, next) => {
        try {
          const data = args[0];
          if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me4()) {
            const m = readMsg(data);
            if (m && m.type === "dispIcons") onIcons(data.Sender, m);
            else if (m && m.type === "dispIconsAsk") iconsTell(true);
          }
        } catch (e) {
        }
        return next(args);
      });
    } catch (e) {
    }
    try {
      mod2.hookFunction("ChatRoomSync", 3, (args, next) => {
        const r = next(args);
        others.clear();
        setTimeout(() => {
          iconsTell(true);
          try {
            W11.ServerSend("ChatRoomChat", makeMsg("dispIconsAsk", {}));
          } catch (e) {
          }
        }, 3e3);
        return r;
      });
    } catch (e) {
    }
  }

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
      }
    }
  });

  // dispensary/src/farm.js
  var W12 = window;
  function send2(type, data) {
    try {
      if (botHere() && typeof W12.ServerSend === "function") {
        W12.ServerSend("ChatRoomChat", makeMsg(type, data, BOT));
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
    if (!send2("dispHello", {
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
  var tellSafeword = () => send2("dispSafeword", {});
  function onDoseCall(m) {
    const id = String(m.dose || ""), B = BOOK[id];
    const reply = (ok, why) => {
      send2("doseDone", { id: m.id, dose: id, ok: !!ok, why: why || "" });
      return { ok: !!ok, why: why || "" };
    };
    if (!B) return reply(false, "unknown");
    if (!allowed(BOT)) return reply(false, "ladder");
    if (st().off[id]) return reply(false, "off");
    const by = Number(m.by) || BOT, x = Math.max(1, Math.min(5, Math.round(Number(m.x) || 1)));
    const mins = Number(m.mins) > 0 ? Math.min(48 * 60, Number(m.mins)) : void 0, line2 = m.line ? String(m.line).slice(0, 900) : void 0;
    if (B.lscg && lscgPresent()) {
      if (m.hand) return reply(true, "lscg");
      const ok = lscgDose(B.lscg, { x, by });
      if (ok && line2 && !m.quiet) action(line2);
      return reply(ok, ok ? "lscg" : "lscg-off");
    }
    const twice = lscgHas(id) && Date.now() - lastLscgDose(id) < 8e3;
    const r = give(id, { by, x, mins, line: line2, upto: twice, quiet: twice || !!m.quiet });
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
  function mooify(text3, species, share) {
    const say3 = NOISES[String(species || "").toLowerCase()] || NOISES[speciesKeyOf(species)] || NOISES.cow;
    const keep = 1 - (typeof share === "number" ? Math.max(0, Math.min(1, share)) : 0.5);
    return String(text3).replace(/[A-Za-z']{3,}/g, (w) => {
      if (Math.random() < keep) return w;
      const n = say3[Math.floor(Math.random() * say3.length)];
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
    if (active("hiccup")) t = sprinkle(t, ["*hic*", "*hic!*", "\u2014hic\u2014"], 4);
    if (active("feather")) t = sprinkle(t, GIGGLES, 5);
    if (active("airhead")) t = airhead(t, xOf2("airhead"));
    if (active("babble")) t = babble(t, xOf2("babble"));
    return t;
  }
  var touched = () => ["moo", "hiccup", "feather", "airhead", "babble"].some(active);
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
    const line2 = LINES.echo[Math.floor(Math.random() * LINES.echo.length)].replace(/%t/g, myName()).replace(/%s/g, t.replace(/[()'"]/g, ""));
    setTimeout(() => action(line2), 2500);
    return true;
  }
  function initSpeech(mod2) {
    try {
      mod2.hookFunction("ServerSend", 6, (args, next) => {
        try {
          const d = args[1];
          if (args[0] === "ChatRoomChat" && d && d.Type === "Chat" && typeof d.Content === "string" && touched() && !/^\s*[(\[?!./\-*]/.test(d.Content))
            args = [args[0], Object.assign({}, d, { Content: dosedSpeech(d.Content) })];
          if (args[0] === "ChatRoomChat" && args[1] && args[1].Type === "Chat" && typeof args[1].Content === "string") echoHeard(args[1].Content);
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
  var W13 = window;
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
      const s = W13.document.createElement("style");
      s.textContent = CSS2;
      W13.document.head.appendChild(s);
      styled = true;
    }
    if (!el2) {
      el2 = W13.document.createElement("div");
      el2.id = "fd-screen";
      el2.setAttribute("aria-hidden", "true");
      W13.document.body.appendChild(el2);
    }
    return el2;
  }
  var arousal = () => {
    const A = W13.Player && W13.Player.ArousalSettings;
    return A ? Number(A.Progress) || 0 : 0;
  };
  function screenNow() {
    if (active("tunnel") && W13.CurrentScreen === "ChatRoom") return { bg: "radial-gradient(circle at 50% 45%, transparent 16%, rgba(0,0,0,.93) 30%, #000 60%)", cls: "", id: "tunnel" };
    if (st().screen === false || W13.CurrentScreen !== "ChatRoom") return null;
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

  // dispensary/src/page.js
  var W14 = window;
  var ID = "FarmhandDispensary";
  var box2 = null;
  var note3 = "";
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
@media (pointer:coarse){#fd-page select,#fd-page input{font-size:16px}#fd-page button{min-height:40px}}
`;
  function styles() {
    if (W14.document.getElementById("fd-style")) return;
    const s = W14.document.createElement("style");
    s.id = "fd-style";
    s.textContent = CSS3;
    W14.document.head.appendChild(s);
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
    const P = W14.Player || {};
    const own = P.Ownership && P.Ownership.MemberNumber === mn;
    const c = (W14.ChatRoomCharacter || []).find((x) => x && x.MemberNumber === mn);
    return (c ? c.Nickname || c.Name : "#" + mn) + (own ? " (your owner)" : PROPRIETORS.includes(mn) ? " (proprietor)" : "");
  };
  var endPick = "7";
  function hardWarning(days, keys) {
    return "Hardcore. Until it ends, you can't change your Dispensary settings, and your safeword won't lift your doses: it asks your keyholders (" + keys.map(keyName).join(", ") + ") to let you out instead.\n\nIt ends " + (days ? "in " + days + " day" + (days === 1 ? "" : "s") : "when a keyholder ends it, or after " + CHECK_DAYS + " days with no keyholder checkin' in (bein' in a room with you counts)") + ". Your keyholders can change your settings, let you out, or end it whenever they like.\n\nLock yourself in?";
  }
  var keyInput = "";
  var WHY_NOT = { number: "That isn't a member number.", self: "You can't hold your own key.", already: "They already hold your key.", full: "That's ten keyholders: remove one first.", locked: "Not while you're locked in." };
  function keyholdersCard() {
    const S2 = st(), locked = hardOn(), P = W14.Player || {}, own = P.Ownership && P.Ownership.MemberNumber, rows = [];
    if (typeof own === "number" && own > 0) rows.push(h("div", null, "\u{1F5DD}\uFE0F " + keyName(own) + ": always, as your owner"));
    if (S2.stock) rows.push(h("div", null, "\u{1F5DD}\uFE0F " + PROPRIETORS.map(keyName).join(" and ") + ": you're on the farm's books"));
    for (const mn of S2.keys || []) rows.push(h("div", { class: "fd-row" }, "\u{1F5DD}\uFE0F " + keyName(mn), locked ? null : h("button", { onclick: () => {
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
          note3 = r.ok ? "\u{1F5DD}\uFE0F " + keyName(n) + " holds your key now." : WHY_NOT[r.why] || "Couldn't add them.";
          if (r.ok) keyInput = "";
          draw2();
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
            if (typeof W14.confirm === "function" && !W14.confirm(hardWarning(days, keys))) return;
            const r = lock(days);
            note3 = r.ok ? "\u{1F512} Locked in." : "Couldn't lock in: " + (r.why === "nokey" ? "you've no keyholder." : r.why);
            draw2();
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
      hardLog().slice(-5).reverse().map((l) => h("div", { class: "fd-muted" }, dateOf(l.t) + " \xB7 " + (l.by === (W14.Player && W14.Player.MemberNumber) ? "you" : l.by ? keyName(l.by) : "the clock") + ": " + l.what))
    ));
    return out;
  }
  var editing = null;
  function keysCard() {
    const list = Object.entries(wards());
    if (!list.length) return [];
    const out = [h("h3", null, "Keys you hold")];
    for (const [k, x] of list) {
      const mn = Number(k), inRoom3 = (W14.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === mn), name = (x.name || "#" + mn) + " (" + mn + ")";
      const go = (what, data) => {
        const how = keyDo(mn, what, data);
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
            if (typeof W14.confirm !== "function" || W14.confirm("End " + name + "'s hardcore?")) go("end");
          } }, "End hardcore"),
          inRoom3 ? h("button", { onclick: () => {
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
  function view2() {
    const S2 = st(), now = doseIds().filter(active), locked = hardOn() ? true : void 0;
    const kids = [];
    kids.push(h(
      "div",
      { class: "fd-row", style: { marginBottom: "6px" } },
      h("h2", null, "\u{1F489} The Farmhand's Dispensary"),
      h("button", { onclick: () => {
        if (typeof W14.PreferenceSubscreenExtensionsClear === "function") W14.PreferenceSubscreenExtensionsClear();
        else close2();
      } }, "Back")
    ));
    if (note3) kids.push(h("div", { class: "fd-note" }, note3));
    if (locked) kids.push(h("div", { class: "fd-card fd-note" }, "\u{1F512} Hardcore: your keyholders hold these settings. You can look, but only they can change them."));
    kids.push(h("h3", null, "In you now"));
    kids.push(h(
      "div",
      { class: "fd-card" },
      now.length ? now.map((id) => h("div", null, BOOK[id].icon + " " + BOOK[id].label + (st().doses[id].x > 1 ? " \xD7" + st().doses[id].x : "") + partLabel(id) + ": " + timeLeft(leftMs(id)) + " left" + (S2.clock === "online" ? " of your time here" : ""))) : h("div", { class: "fd-muted" }, "Nothin'. You're clear."),
      Object.values(S2.grow || {}).some((v) => v) ? h("div", null, "\u{1F4CF} Grown (it stays): " + Object.entries(S2.grow).filter(([, v]) => v).map(([k, v]) => ({ cup: "tits", ass: "ass", cock: "cock", balls: "balls" })[k] + " " + (v > 0 ? "+" : "") + v).join(", ") + ". A reducing serum takes a size back off.") : null,
      S2.later.length ? h("div", null, "\u{1F48A} " + (S2.later.length === 1 ? "A time-release capsule's" : S2.later.length + " time-release capsules are") + " waitin' in you. You won't know when.") : null,
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
    kids.push(h("h3", null, "Who can dose you"));
    const sel = h(
      "select",
      { "aria-label": "Who can dose you", disabled: locked, onchange: (e) => {
        st().who = e.target.value;
        save();
        note3 = "";
        draw2();
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
        draw2();
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
        draw2();
      } }), h("b", null, "Screen touches")),
      h("div", { class: "fd-muted" }, "A dose you can see at the edges of your own screen: the Sedative dims it, Denial Serum pulses pink near the top, Heat hazes it warm, Needy Nectar flushes it, Rut reddens it, the Airhead Elixir goes soft and pink. Only you see them. With reduce motion set on your computer, they hold still."),
      h("label", { style: { marginTop: "8px" } }, h("input", { type: "checkbox", checked: S2.iconsShow !== false ? true : void 0, onchange: (e) => {
        st().iconsShow = e.target.checked;
        save();
        draw2();
      } }), h("b", null, "Dose icons by people")),
      h("label", null, h("input", { type: "checkbox", checked: S2.iconsShare !== false ? true : void 0, onchange: (e) => {
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
            draw2();
          } },
          Object.entries(TENDER_SPOTS).map(([k, s2]) => h("option", { value: k, selected: (S2.tenderSpot || TENDER_DEFAULT) === k ? true : void 0 }, s2.word))
        )
      ),
      h("div", { class: "fd-muted", style: { marginTop: "8px" } }, "\u{1F48A} A needle that also says time-release, slow-release, delayed or capsule doesn't hit at once: it goes off somewhere between " + FUSE_MINS[0] + " and " + FUSE_MINS[1] + " minutes later, at a moment nobody knows. Up to " + LATER_MAX + " can wait in you; your safeword clears them."),
      h("label", { style: { marginTop: "8px" } }, h("input", { type: "checkbox", disabled: locked, checked: S2.tolerance ? true : void 0, onchange: (e) => {
        st().tolerance = e.target.checked;
        save();
        draw2();
      } }), h("b", null, "Tolerance")),
      h("div", { class: "fd-muted" }, "The same dose again within " + TOLERANCE_HOURS + " hours takes a fifth less for each one before it, down to two fifths. You're told when it does."),
      h("label", { style: { marginTop: "8px" } }, h("input", { type: "checkbox", disabled: locked, checked: S2.cravings ? true : void 0, onchange: (e) => {
        st().cravings = e.target.checked ? Date.now() : 0;
        save();
        draw2();
      } }), h("b", null, "Cravings")),
      h("div", { class: "fd-muted" }, "Once you've had " + CRAVE_AFTER + " doses in " + CRAVE_DAYS + " days, now and then, while nothin's in you, you want another (a note only you see). On the farm the farm girl notices, and offers: say ?fix and she sees to it. Only doses from here on count.")
    ));
    kids.push(h("h3", null, "Gear, drinks and kisses"));
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
    kids.push(h("h3", null, "Parasites"));
    const inMe = mine();
    kids.push(h(
      "div",
      { class: "fd-card" },
      h("div", { class: "fd-muted" }, "Crafted parasites, anywhere: put on you in a crafted item that names them, by somebody on your list. Each kind only takes if you switch it on. Your safeword takes them off."),
      kindIds().map((k) => {
        const K2 = KINDS[k], p = inMe[k];
        return h(
          "label",
          { style: { marginTop: "4px" } },
          h("input", { type: "checkbox", disabled: locked, checked: S2.parasites && S2.parasites[k] ? true : void 0, onchange: (e) => {
            const P = st().parasites || (st().parasites = {});
            if (e.target.checked) P[k] = true;
            else {
              delete P[k];
              letGo(k, "quiet");
            }
            save();
            draw2();
          } }),
          h("span", null, K2.icon + " " + K2.label + (p ? " \xB7 in you" + (p.until ? ", " + timeLeft(Math.max(0, p.until - Date.now())) + " left" : "") + (p.name ? " (" + p.name + "'s)" : "") : ""))
        );
      }),
      h(
        "label",
        { style: { marginTop: "8px" } },
        h("input", { type: "checkbox", disabled: locked, checked: S2.mouthAuto ? true : void 0, onchange: (e) => {
          st().mouthAuto = e.target.checked;
          save();
          draw2();
        } }),
        h("span", null, "The mouthpiece's words go straight out, without askin' me first")
      ),
      h("div", { class: "fd-muted" }, "What each does: parasite lips feed you their crafter's strain and spread by a kiss; livin' latex drinks your climaxes; milk moss keeps you leakin'; the nestling grows your belly every time you cum; the brood mother lays little ones you pass on by a kiss; the leash vine keeps you near its crafter on a map; the mouthpiece lets its crafter put words in your mouth (/dispensary say, or nope).")
    ));
    if (lscg) {
      kids.push(h("div", { class: "fd-card fd-muted" }, lscgApi() ? "LSCG is loaded. Its sedative, aphrodisiac, mind control, suggestible and antidote are LSCG's. Our doses are in LSCG's Drug Enhancements list too: switch them on there as well to see a bar with the time left." : "LSCG is loaded. Its sedative, aphrodisiac, mind control, suggestible and antidote are LSCG's."));
    }
    kids.push(...keyholdersCard(), ...hardCard(), ...keysCard());
    kids.push(h("div", { class: "fd-muted", style: { marginTop: "14px" } }, "The Farmhand's Dispensary v" + VERSION + " \xB7 B&B Farm. On the farm, the farm girl keeps the farm's books and your Dispensary does the rest."));
    return kids;
  }
  function draw2() {
    if (box2) box2.replaceChildren(...view2());
  }
  function open() {
    close2();
    styles();
    box2 = W14.document.createElement("div");
    box2.id = "fd-page";
    W14.document.body.appendChild(box2);
    draw2();
  }
  function close2() {
    if (box2) {
      box2.remove();
      box2 = null;
    }
    note3 = "";
  }
  var pageOpen = () => !!box2;
  function redrawPage(force) {
    const a = W14.document.activeElement;
    if (!force && box2 && a && box2.contains(a) && /^(SELECT|INPUT)$/.test(a.tagName)) return;
    draw2();
  }
  function initPage() {
    if (typeof W14.PreferenceRegisterExtensionSetting !== "function") return false;
    try {
      W14.PreferenceRegisterExtensionSetting({
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
      if (typeof W14.PreferenceSubscreenExtensionsOpen === "function") {
        W14.PreferenceSubscreenExtensionsOpen(ID);
        return true;
      }
    } catch (e) {
    }
    open();
    return true;
  }

  // dispensary/src/index.js
  var W15 = window;
  var bcModSdk = import_bondage_club_mod_sdk.default.default || import_bondage_club_mod_sdk.default;
  if (W15.__farmDispensary) {
    console.warn("[Dispensary] Two copies of the Farmhand's Dispensary are installed. Delete the older one in Tampermonkey, then reload.");
    throw new Error("The Farmhand's Dispensary: another copy is already running");
  }
  var mod = bcModSdk.registerMod({ name: "FarmhandDispensary", fullName: "The Farmhand's Dispensary", version: VERSION });
  W15.__farmDispensary = VERSION;
  registerInk(W15, mod);
  initLscg();
  function status() {
    const on2 = doseIds().filter(active);
    local((on2.length ? "In you now: " + on2.map((id) => BOOK[id].label + " (" + timeLeft(leftMs(id)) + ")").join(", ") + "." : "No doses in you.") + " Who can dose you: " + ladderWho() + ". /dispensary safeword lifts every dose; /dispensary page opens the settings.");
  }
  function commands() {
    if (typeof W15.CommandCombine !== "function") return;
    try {
      W15.CommandCombine([{
        Tag: "dispensary",
        Description: "[safeword | page | say | nope | mouth <who> <words>]: The Farmhand's Dispensary. What's in you, the safeword, the settings, the mouthpiece",
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
  function mouthTarget(w) {
    if (/^\d+$/.test(w)) return Number(w);
    const low = String(w).toLowerCase(), C = (W15.ChatRoomCharacter || []).find((c) => c && c.MemberNumber !== (W15.Player && W15.Player.MemberNumber) && [c.Nickname, c.Name].some((n) => n && String(n).toLowerCase().startsWith(low)));
    return C ? C.MemberNumber : 0;
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
    const P = W15.Player;
    if (!P || typeof P.MemberNumber !== "number" || !P.ExtensionSettings) return;
    clearInterval(boot);
    try {
      start2();
    } catch (e) {
      console.warn("[Dispensary] didn't start:", e);
    }
  }, 1e3);
  if (W15.__FARMHAND_TEST__) W15.__disp = {
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
    },
    worn: () => wornGear(),
    wornTick: () => wornTick(),
    wornReset: () => wornReset(),
    trigger: (k, f) => trigger(k, f),
    para: () => mine(),
    paraTick: () => paraTick(),
    latch: (k, o) => latch(k, o),
    climax: () => paraClimax(),
    haze: () => hazeTick(),
    icons: (mn) => iconsFor(mn),
    iconsTell: (f) => iconsTell(f)
  };
  W15.FarmhandDispensary = Object.freeze({
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
    // growth off the farm (Nov 18): { cup, ass, cock, balls } sizes up (or down) from your own. The Companion's drawn body reads it.
    grow: () => grown(),
    // the crafted parasites in you (Nov 18): [{ kind, label, by, until }]
    parasites: () => Object.entries(mine()).map(([k, p]) => ({ kind: k, label: KINDS[k] ? KINDS[k].label : k, by: p.by, until: p.until })),
    hard: () => hardOn() ? { on: true, until: st().hard && st().hard.until || 0, due: dueAt() } : null
  });
})();
