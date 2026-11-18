/* WHAT'S IN THIS FILE (shared/ink/ink.js)
   FARM INK: four ink slots and a brand slot in the game's own wardrobe, the way Echo's mod adds its slots (Laynie, Nov 17:
   "if we can add a few branding slots into the wardrobe too, like echoes adds wardrobe slots, that would be cool too. then
   players can select tattoos and place them their selves if the wanted too as parts of different outfits").

   • Five new slots: Farm Ink 1 to 4, and Farm Brand. Every design from the tattoo sheets is an item in them, free to wear.
   • They're ordinary pictures, so the game's own Layering button places them: move, scale, turn, and over or under
     anything else. They save in wardrobe outfits like any item, and the colour picker re-inks them (a brand's three
     layers are its dark edge, angry core and shine: fresh or healed).
   • They sit on the skin, under clothes, unless someone moves them up.
   • The pictures live in the public repo (ink/v1/) and load from GitHub, like the add-ons do.
   • Only people running the Companion or the Dispensary see them (whichever loads first adds the slots, once), the
     same as Echo's clothes only show for people with Echo's mod. Everyone else sees plain skin.
   • The game draws the front only, so designs meant for the back (a tramp stamp, a butt cheek) start on the hip.
   • The ones with live numbers or names (counts, owners, dates, your own words) come next: ink-designs.json lists them.
*/
import LIST from "./ink-designs.json";

export const INK_HOST = "https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v1/";
export const INK_SLOTS = ["FarmInk1", "FarmInk2", "FarmInk3", "FarmInk4"];
export const BRAND_SLOT = "FarmBrand";
const SLOT_NAMES = { FarmInk1: "Farm Ink 1", FarmInk2: "Farm Ink 2", FarmInk3: "Farm Ink 3", FarmInk4: "Farm Ink 4", FarmBrand: "Farm Brand" };
const RES = LIST.res || 1;
const OURS = /\/ink[^/]*\/(?:v\d+\/)?Farm(?:Ink|Brand)\//;   // one of our pictures (from the repo, or a local copy in a test)
const PRIORITY = 11;   // on the skin (the body and the game's own body markings are under 11), under socks, underwear and clothes
const kindOf = (slot) => (slot === BRAND_SLOT ? "FarmBrand" : /^FarmInk[1-4]$/.test(String(slot)) ? "FarmInk" : null);
export const isInkSlot = (slot) => !!kindOf(slot);
const TITLES = {};
for (const kind of ["FarmInk", "FarmBrand"]) for (const a of LIST.groups[kind]) TITLES[kind + ":" + a.name] = a.title;

function assetDef(a) {
  return {
    Name: a.name, Random: false, Value: 0, Left: a.left, Top: a.top,
    DefaultColor: a.layers.filter((l) => l.colorize).map((l) => l.color),
    PoseMapping: { AllFours: "Hide", Hogtied: "Hide" },   // (the body's drawn another way in those: the ink would float)
    Layer: a.layers.map((l) => ({ Name: l.name, AllowColorize: !!l.colorize })),
  };
}
function groupDef(slot) {
  return { Group: slot, Priority: PRIORITY, Default: false, Random: false, BodyCosplay: true, Clothing: false, AllowNone: true,
    Color: ["Default"], Asset: LIST.groups[kindOf(slot)].map(assetDef) };
}
// the slots' and designs' names in the wardrobe (the game sets "MISSING DESCRIPTION" on anything its own list doesn't have)
function describe(W) {
  for (const slot of [...INK_SLOTS, BRAND_SLOT]) {
    const G = W.AssetGroupMap && W.AssetGroupMap.get(slot); if (!G) continue;
    G.Description = SLOT_NAMES[slot];
    for (const A of G.Asset || []) { const t = TITLES[kindOf(slot) + ":" + A.Name]; if (t) A.Description = t; }
  }
}
const gameReady = (W) => typeof W.AssetGroupAdd === "function" && typeof W.AssetAdd === "function" && W.AssetGroupMap && W.AssetGroupMap.size > 30;
function addSlots(W) {
  if (W.AssetGroupMap.has(INK_SLOTS[0])) { describe(W); return false; }
  for (const slot of [...INK_SLOTS, BRAND_SLOT]) {
    const def = groupDef(slot), G = W.AssetGroupAdd("Female3DCG", def);
    for (const a of def.Asset) W.AssetAdd(G, a, W.AssetFemale3DCGExtended || {}, def);
  }
  describe(W);
  return true;
}

// Whichever add-on loads first calls this; the second finds it done. `mod` is that add-on's ModSDK handle.
export function registerInk(W, mod) {
  if (W.__farmInk) return W.__farmInk;
  const st = (W.__farmInk = { ready: false, slots: [...INK_SLOTS, BRAND_SLOT], designs: LIST.groups.FarmInk.length + LIST.groups.FarmBrand.length, live: LIST.live.length });
  const hooks = () => {
    const hook = (name, pri, fn) => { try { if (typeof W[name] === "function") mod.hookFunction(name, pri, fn); else console.warn("[Farm ink] the game has no " + name); } catch (e) { console.warn("[Farm ink] couldn't hook " + name, e); } };
    // where the game looks for a layer's picture, and for the wardrobe's preview: ours come from the repo
    hook("AssetBaseURL", 0, (args, next) => { const kind = kindOf(args[2] || (args[1] && args[1].Name)); return kind ? INK_HOST + kind + "/" : next(args); });
    hook("AssetGetPreviewPath", 0, (args, next) => { const A = args[0], kind = A && A.Group && kindOf(A.Group.Name); return kind ? INK_HOST + kind + "/Preview" : next(args); });
    hook("AssetBuildDescription", 0, (args, next) => { const r = next(args); try { describe(W); } catch (e) { /* next time */ } return r; });
    // the pictures are stored at RES times the size they show: drawn at 1/RES, round their middle (the game scales an
    // item round its centre), so the Layering screen's 1.0 is the design's own size and scalin' up stays crisp
    if (RES !== 1) hook("CommonDrawAppearanceBuild", 0, (args, next) => {
      const cb = args[1]; if (!cb || typeof cb !== "object") return next(args);
      const wrap = (f) => (typeof f !== "function" ? f : function (src, x, y, o) {
        if (typeof src === "string" && OURS.test(src)) { o = Object.assign({}, o); o.ScaleX = (o.ScaleX == null ? 1 : o.ScaleX) / RES; o.ScaleY = (o.ScaleY == null ? 1 : o.ScaleY) / RES; }
        return f.call(this, src, x, y, o);
      });
      return next([args[0], Object.assign({}, cb, { drawImage: wrap(cb.drawImage), drawImageBlink: wrap(cb.drawImageBlink), drawImageColorize: wrap(cb.drawImageColorize), drawImageColorizeBlink: wrap(cb.drawImageColorizeBlink) }), ...args.slice(2)]);
    });
    hook("AssetLoadAll", 0, (args, next) => { const r = next(args); try { addSlots(W); } catch (e) { console.warn("[Farm ink] couldn't add the slots again", e); } return r; });
  };
  const t = setInterval(() => {
    if (!gameReady(W)) return;
    clearInterval(t);
    try { hooks(); addSlots(W); st.ready = true; } catch (e) { console.warn("[Farm ink] couldn't add the slots", e); }
  }, 50);
  return st;
}
