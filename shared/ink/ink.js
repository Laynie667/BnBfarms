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
   • THE LIVE ONES (step 2, Nov 17; live.js): 28 designs that print the wearer's own. A count from the farm's books, their
     number, a name, a date, their own words. They're drawn on the spot from what's written on the item (Property.FarmInk),
     so everybody with an add-on sees the same. The farm's counts are written on as they change (the Companion hands
     them over: counts); names and words with /ink. Days without cummin' is counted here, on the wearer's own game.
*/
import LIST from "./ink-designs.json";
import { LIVE_BY, isLive, valuesFor, picture, loadLiveArt, cleanValues } from "./live.js";
import { openInkPanel } from "./panel.js";

export const INK_HOST = "https://raw.githubusercontent.com/Laynie667/BnBfarms/main/ink/v2/";
const LIVE_HOST = INK_HOST + "live/";   // (no pictures there: a live design's address, for us to draw in its place)
export const INK_SLOTS = ["FarmInk1", "FarmInk2", "FarmInk3", "FarmInk4"];
export const BRAND_SLOT = "FarmBrand";
const SLOT_NAMES = { FarmInk1: "Farm Ink 1", FarmInk2: "Farm Ink 2", FarmInk3: "Farm Ink 3", FarmInk4: "Farm Ink 4", FarmBrand: "Farm Brand" };
const RES = LIST.res || 1;
const OURS = /\/ink[^/]*\/(?:v\d+\/)?Farm(?:Ink|Brand)\//;   // one of our pictures (from the repo, or a local copy in a test)
const LIVE_SRC = /\/live\/(Farm(?:Ink[1-4]|Brand))\/(Live[A-Za-z]+)_([A-Za-z0-9]+)\.png$/;   // a live design, drawn here
const STILL_SRC = /\/(Farm(?:Ink|Brand))\/([A-Za-z0-9]+)_[A-Za-z0-9]+\.png$/;   // one of the still ones: its kind and its name
// the item a still picture belongs to (the same design in two slots shares the first one's size)
const stillItem = (C, kind, name) => (C && Array.isArray(C.Appearance) ? C.Appearance.find((it) => it && it.Asset && it.Asset.Name === name && it.Asset.Group && kindOf(it.Asset.Group.Name) === kind) : null);
const PRIORITY = 11;   // on the skin (the body and the game's own body markings are under 11), under socks, underwear and clothes
const kindOf = (slot) => (slot === BRAND_SLOT ? "FarmBrand" : /^FarmInk[1-4]$/.test(String(slot)) ? "FarmInk" : null);
export const isInkSlot = (slot) => !!kindOf(slot);
// K: each design's starting size (Nov 18, Laynie: "does that tattoos sizing and placement seem esthetically and visibly the
// right scale per tattoo for the defaults?"): fitted to a box for its spot, width and height, so long lettering gets room
const TITLES = {}, MANIFEST = {}, K = {};
for (const kind of ["FarmInk", "FarmBrand"]) for (const a of LIST.groups[kind]) { TITLES[kind + ":" + a.name] = a.title; if (a.live) MANIFEST[a.name] = a; if (a.k && a.k !== 1) K[kind + ":" + a.name] = a.k; }
const kOf = (it) => (it && it.Asset && it.Asset.Group && K[kindOf(it.Asset.Group.Name) + ":" + it.Asset.Name]) || 1;

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

// ── the live designs ──
const itemIn = (C, slot) => (C && Array.isArray(C.Appearance) ? C.Appearance.find((it) => it && it.Asset && it.Asset.Group && it.Asset.Group.Name === slot) : null);
// whose it is: their number, and their owner's name (what a live design shows when nothin's written on it)
const whoOf = (C) => ({ num: C && C.MemberNumber, owner: C && C.Ownership && typeof C.Ownership.Name === "string" ? C.Ownership.Name : "" });
function liveSrc(W, C, slot, name, layer) {
  const d = LIVE_BY[name], m = MANIFEST[name], it = itemIn(C, slot);
  if (!d || !m || !it || it.Asset.Name !== name) return null;
  try { return picture(W, d, m, layer, valuesFor(d, it.Property && it.Property.FarmInk, whoOf(C))); } catch (e) { console.warn("[Farm ink] couldn't draw " + name, e); return null; }
}
// the live designs you're wearin': [{ slot, name, item }]
function wornLive(W) { const P = W.Player, out = []; for (const slot of [...INK_SLOTS, BRAND_SLOT]) { const it = itemIn(P, slot); if (it && isLive(it.Asset.Name)) out.push({ slot, name: it.Asset.Name, item: it }); } return out; }
// write on one of yours (merged with what's there; null takes a thing off), and let the room see it
const lastWrite = {};
function write(W, slot, values, now) {
  const it = itemIn(W.Player, slot);
  if (!it || !kindOf(slot)) return false;   // (any of ours: a size on any, words and counts on a live one)
  const cur = (it.Property && it.Property.FarmInk) || {}, merged = Object.assign({}, cur, values);
  for (const k of Object.keys(merged)) if (merged[k] == null) delete merged[k];
  const next = cleanValues(merged);
  if (merged.manual === true) next.manual = true;
  if (JSON.stringify(next) === JSON.stringify(cur)) return false;
  // the farm's counts go on at most once a minute a slot (a count can't jump about faster than anybody would notice)
  const since = Date.now() - (lastWrite[slot] || 0);
  if (!now && since < 60000) { clearTimeout(retry[slot]); retry[slot] = setTimeout(() => refreshAuto(W), 60500 - since); return false; }
  lastWrite[slot] = Date.now();
  it.Property = Object.assign({}, it.Property, { FarmInk: next });
  try { if (typeof W.CharacterRefresh === "function") W.CharacterRefresh(W.Player); } catch (e) { /* fine */ }
  try { if (typeof W.ChatRoomCharacterItemUpdate === "function") W.ChatRoomCharacterItemUpdate(W.Player, slot); } catch (e) { /* not in a room */ }
  return true;
}
const retry = {};
// the farm's counts (the Companion hands them over from the farm girl's books) and days without cummin' (counted here)
let counts = {};
const DAY = 86400000;
const cumKey = (W) => "farmink-lastcum-" + (W.Player && W.Player.MemberNumber);
function daysDenied(W) { let t = 0; try { t = Number(W.localStorage.getItem(cumKey(W))) || 0; } catch (e) { /* fine */ } return t ? Math.max(0, Math.floor((Date.now() - t) / DAY)) : 0; }
function autoOf(W, auto) {
  if (auto === "denied") return { n: daysDenied(W) };
  const c = counts[auto];
  if (auto === "studs") return c && Array.isArray(c.list) ? { list: c.list, more: c.more || null } : null;
  if (auto === "scores") return Array.isArray(c) ? { rows: c } : null;
  if (auto === "bredOn") return c && c.d ? { d: c.d, due: c.due || null } : null;
  return typeof c === "number" ? { n: c } : null;
}
function refreshAuto(W) {
  for (const { slot, name, item } of wornLive(W)) {
    const d = LIVE_BY[name], own = item.Property && item.Property.FarmInk;
    if (!d.auto || (own && own.manual)) continue;
    const v = autoOf(W, d.auto);
    if (v) write(W, slot, v);
  }
}

// ── /ink: what your live ink says, and writin' on it ──
const SLOT_OF = { 1: "FarmInk1", 2: "FarmInk2", 3: "FarmInk3", 4: "FarmInk4", brand: BRAND_SLOT };
const say = (W, t) => { try { if (typeof W.ChatRoomSendLocal === "function") { const d = W.document.createElement("div"); d.style.cssText = "color:#c79bd8;white-space:pre-wrap"; d.textContent = "🖋️ " + t; W.ChatRoomSendLocal(d.outerHTML); } } catch (e) { /* fine */ } };
// for the panel: every slot you've ink in, what it's called, and what's written on it
function wornAll(W) {
  const out = [];
  for (const slot of [...INK_SLOTS, BRAND_SLOT]) {
    const it = itemIn(W.Player, slot); if (!it) continue;
    const d = LIVE_BY[it.Asset.Name];
    out.push({ slot, name: it.Asset.Name, title: TITLES[kindOf(slot) + ":" + it.Asset.Name] || it.Asset.Name, live: !!d, fields: d ? d.fields : [], auto: d ? d.auto || null : null, values: (it.Property && it.Property.FarmInk) || {} });
  }
  return out;
}
const panelApi = (W) => ({ worn: () => wornAll(W), write: (slot, v) => write(W, slot, v, true), command: (a) => inkCommand(W, a) });
export function inkCommand(W, args) {
  const a = String(args || "").trim(), m = /^(1|2|3|4|brand)\b\s*(.*)$/i.exec(a);
  const worn = wornLive(W);
  // /ink alone: the panel (sizes, words, the farm's counts)
  if (!a && W.document && W.document.body) { openInkPanel(W, panelApi(W)); return; }
  if (/^why$/i.test(a)) return say(W, whyText());
  // /ink <slot> size 150 (and wide, tall): how big, in percent
  const sm = m && /^(size|wide|width|tall|height)\s+(\d{1,3})%?$/i.exec(m[2].trim());
  if (sm) {
    const slot = SLOT_OF[m[1].toLowerCase()], k = /^s/i.test(sm[1]) ? "sz" : /^w/i.test(sm[1]) ? "sw" : "sh", lim = k === "sz" ? [25, 400] : [50, 200];
    const v = Math.max(lim[0], Math.min(lim[1], Number(sm[2]))) / 100;
    if (!itemIn(W.Player, slot)) return say(W, "Nothin' in " + SLOT_NAMES[slot] + ".");
    write(W, slot, { [k]: v === 1 ? null : v }, true);
    return say(W, SLOT_NAMES[slot] + ": " + ({ sz: "size", sw: "width", sh: "height" }[k]) + " " + Math.round(v * 100) + "%.");
  }
  if (!m) {
    if (!worn.length) return say(W, "You've no live ink on. Pick one in the wardrobe (Farm Ink 1 to 4): the ones that say keeps count, a name, your number or your words. Then /ink <slot> <words> writes on it.");
    return say(W, "Your live ink:\n" + worn.map(({ slot, name, item }) => { const d = LIVE_BY[name], own = (item.Property && item.Property.FarmInk) || {}, k = Object.keys(SLOT_OF).find((x) => SLOT_OF[x] === slot);
      return "• " + k + ": " + d.title + (own.t ? " · \"" + own.t + "\"" : "") + (own.n != null ? " · " + own.n : "") + (own.list ? " · " + own.list.join(", ") : "") + (d.auto ? (own.manual ? " (your number, not the farm's)" : " (follows the farm)") : ""); }).join("\n") +
      "\n/ink opens the ink panel · /ink <slot> <words> writes on it · /ink <slot> <number> sets a count · /ink <slot> a, b, c for a list · /ink <slot> auto follows the farm again · /ink <slot> clear · /ink <slot> size 150 (wide, tall)");
  }
  const slot = SLOT_OF[m[1].toLowerCase()], rest = m[2].trim(), it = itemIn(W.Player, slot);
  if (!it) return say(W, "Nothin' in " + SLOT_NAMES[slot] + ".");
  if (!isLive(it.Asset.Name)) return say(W, (TITLES["FarmInk:" + it.Asset.Name] || TITLES["FarmBrand:" + it.Asset.Name] || "That") + " doesn't take writin': it's drawn as it is.");
  const d = LIVE_BY[it.Asset.Name];
  let v;
  if (!rest) return inkCommand(W, "");
  if (/^clear$/i.test(rest)) v = { t: null, n: null, num: null, list: null, more: null, rows: null, d: null, due: null, manual: null };
  else if (/^auto$/i.test(rest)) { v = { manual: null, n: null, list: null, more: null, rows: null }; }
  else if (/^\d{1,9}$/.test(rest) && (d.fields.includes("n") || d.fields.includes("num"))) v = d.fields.includes("num") ? { num: Number(rest) } : { n: Number(rest), manual: true };
  else if (rest.includes(",") && d.fields.includes("list")) v = { list: rest.split(",").map((x) => x.trim()).filter(Boolean), manual: true };
  else if (d.fields.includes("t")) v = { t: rest };
  else return say(W, d.title + " takes " + (d.fields.includes("n") ? "a number" : d.fields.includes("num") ? "a number" : d.fields.includes("list") ? "names, with commas between" : "nothin'") + ".");
  write(W, slot, v, true);
  if (/^auto$/i.test(rest)) refreshAuto(W);
  say(W, "Written on " + d.title + ".");
}

// Whichever add-on loads first calls this; the second finds it done. `mod` is that add-on's ModSDK handle.
export function registerInk(W, mod) {
  if (W.__farmInk) return W.__farmInk;
  const st = (W.__farmInk = { ready: false, slots: [...INK_SLOTS, BRAND_SLOT], designs: LIST.groups.FarmInk.length + LIST.groups.FarmBrand.length, live: Object.keys(MANIFEST).length,
    // for the Companion: the farm's counts for live ink (state.ink from the farm girl)
    counts: (c) => { if (c && typeof c === "object") { counts = c; try { refreshAuto(W); } catch (e) { /* next time */ } } },
    write: (slot, v) => write(W, slot, v, true),
    command: (a) => inkCommand(W, a),
    worn: () => wornLive(W).map(({ slot, name }) => ({ slot, name })) });
  const hooks = () => {
    const hook = (name, pri, fn) => { try { if (typeof W[name] === "function") mod.hookFunction(name, pri, fn); else console.warn("[Farm ink] the game has no " + name); } catch (e) { console.warn("[Farm ink] couldn't hook " + name, e); } };
    // where the game looks for a layer's picture, and for the wardrobe's preview: ours come from the repo (a live design's
    // is an address of our own, drawn below)
    hook("AssetBaseURL", 0, (args, next) => {
      const slot = args[2] || (args[1] && args[1].Name), kind = kindOf(slot); if (!kind) return next(args);
      return args[6] && isLive(args[6].Name) ? LIVE_HOST + slot + "/" : INK_HOST + kind + "/";
    });
    hook("AssetGetPreviewPath", 0, (args, next) => { const A = args[0], kind = A && A.Group && kindOf(A.Group.Name); return kind ? INK_HOST + kind + "/Preview" : next(args); });
    hook("AssetBuildDescription", 0, (args, next) => { const r = next(args); try { describe(W); } catch (e) { /* next time */ } return r; });
    // the pictures are stored at RES times the size they show: drawn at 1/RES, round their middle (the game scales an
    // item round its centre), so the Layering screen's 1.0 is the design's own size and scalin' up stays crisp. On top,
    // the size the wearer set in the ink panel (Property.FarmInk sz, sw, sh). A live design is drawn here, from what's
    // written on it, in place of its address.
    // (Priority 5: this hook runs before the Companion's drawn body (2) and belly (1), so its wrapper is the last one a
    // picture passes through: theirs see our addresses as they are, and hold the ink back till the drawn belly and
    // breasts are on. It sits on them, not under them. Nov 18.)
    hook("CommonDrawAppearanceBuild", 5, (args, next) => {
      const C = args[0], cb = args[1]; if (!cb || typeof cb !== "object") return next(args);
      const sized = (o, it) => {
        const f = (it && it.Property && it.Property.FarmInk) || {}, sz = (f.sz || 1) * kOf(it), kx = sz * (f.sw || 1) / RES, ky = sz * (f.sh || 1) / RES;
        o = Object.assign({}, o); o.ScaleX = (o.ScaleX == null ? 1 : o.ScaleX) * kx; o.ScaleY = (o.ScaleY == null ? 1 : o.ScaleY) * ky; return o;
      };
      const seen = new Set(), notReady = [];
      const ready = (u) => { try { const c = W.GLDrawImageCache; if (c && typeof c.has === "function" && c.has(u) && !c.get(u).isLoaded()) return false; } catch (e) { /* fine */ } return true; };
      // (Nov 18) somebody under the Statue Serum: their ink is cut into the material. The Companion's statue.js hands
      // back the picture in it (W.__farmInkTint: a picture, or undefined to leave it be), drawn plain, at the same size.
      const statue = (plain, self, u, x, y, o) => {
        const T = W.__farmInkTint; if (typeof T !== "function") return false;
        let t; try { t = T(C, u, x, y); } catch (e) { t = undefined; }
        if (!t) return false;
        const o2 = Object.assign({}, o || {}); delete o2.HexColor; delete o2.FullAlpha; plain.call(self, t, x, y, o2); return true;
      };
      const wrap = (f, plain) => (typeof f !== "function" ? f : function (src, x, y, o) {
        if (typeof src === "string") {
          const lm = src.indexOf("/live/") > 0 ? LIVE_SRC.exec(src) : null;
          if (lm) { const u = liveSrc(W, C, lm[1], lm[2], lm[3]); seen.add(lm[2]); if (!u) { notReady.push(lm[2] + " (not drawn yet)"); return undefined; } if (!ready(u)) notReady.push(lm[2]); const o3 = sized(o, itemIn(C, lm[1])); if (statue(plain, this, u, x, y, o3)) return undefined; return f.call(this, u, x, y, o3); }
          const sm = OURS.test(src) ? STILL_SRC.exec(src) : null;
          if (sm) { o = sized(o, stillItem(C, sm[1], sm[2])); seen.add(sm[2]); if (!ready(src)) notReady.push(sm[2]); if (statue(plain, this, src, x, y, o)) return undefined; }
        }
        return f.call(this, src, x, y, o);
      });
      const out = next([args[0], Object.assign({}, cb, { drawImage: wrap(cb.drawImage, cb.drawImage), drawImageBlink: wrap(cb.drawImageBlink, cb.drawImageBlink), drawImageColorize: wrap(cb.drawImageColorize, cb.drawImage), drawImageColorizeBlink: wrap(cb.drawImageColorizeBlink, cb.drawImageBlink) }), ...args.slice(2)]);
      try { note(W, C, seen, notReady); } catch (e) { /* fine */ }
      return out;
    });
    // A TATTOO STAYS ON (Nov 18): the game's "naked" (and the last of "strip a layer") takes off anything worn as body
    // cosplay, the game's own body markings included. Farm ink isn't somethin' you strip: it goes back on. It comes off
    // one slot at a time in the wardrobe, like takin' it off on purpose.
    const keepInk = (name) => hook(name, 0, (args, next) => {
      const C = args[0], keep = C && Array.isArray(C.Appearance) ? C.Appearance.filter((it) => it && it.Asset && it.Asset.Group && kindOf(it.Asset.Group.Name)) : [];
      const r = next(args);
      try {
        let back = 0;
        if (keep.length && C && Array.isArray(C.Appearance)) for (const it of keep) if (!C.Appearance.includes(it) && !itemIn(C, it.Asset.Group.Name)) { C.Appearance.push(it); back++; }
        if (back && typeof W.CharacterLoadCanvas === "function") W.CharacterLoadCanvas(C);
      } catch (e) { /* fine */ }
      return r;
    });
    keepInk("CharacterAppearanceNaked");
    keepInk("CharacterAppearanceStripLayer");
    hook("AssetLoadAll", 0, (args, next) => { const r = next(args); try { addSlots(W); } catch (e) { console.warn("[Farm ink] couldn't add the slots again", e); } return r; });
    // days without cummin': your own game counts it (a ruined one doesn't count as cummin')
    hook("ActivityOrgasmStart", 0, (args, next) => {
      try { const C = args[0]; if (C && typeof C.IsPlayer === "function" && C.IsPlayer() && !W.ActivityOrgasmRuined) { W.localStorage.setItem(cumKey(W), String(Date.now())); setTimeout(() => refreshAuto(W), 1000); } } catch (e) { /* fine */ }
      return next(args);
    });
  };
  const t = setInterval(() => {
    if (!gameReady(W)) return;
    clearInterval(t);
    try { hooks(); addSlots(W); st.ready = true; } catch (e) { console.warn("[Farm ink] couldn't add the slots", e); }
    // the farm's logo, for the two live designs that carry it; then draw anybody wearin' one again
    loadLiveArt().then(() => { try { for (const C of W.ChatRoomCharacter || []) if (wornByLogo(C) && typeof W.CharacterLoadCanvas === "function") W.CharacterLoadCanvas(C); } catch (e) { /* fine */ } });
    try { if (typeof W.CommandCombine === "function") W.CommandCombine([{ Tag: "ink", Description: "[slot words]: your live farm ink (counts, names, your own words)", Action: (a) => inkCommand(W, a) }]); } catch (e) { /* fine */ }
  }, 50);
  // the counts that change on their own (days without cummin')
  setInterval(() => { try { if (W.Player && W.Player.Appearance) refreshAuto(W); } catch (e) { /* fine */ } }, 10 * 60000);
  return st;
}
// INK THAT DIDN'T SHOW (Laynie, Nov 18: "the tattoos temporarily disappear when facial animations change", on other
// people, a split second, with the drawn body, WCE, LSCG and Echo running). Each time somebody's drawn, any ink they wear
// that wasn't asked for, or whose picture wasn't ready, is noted here; /ink why shows the last few.
const DIAG = [];
function note(W, C, seen, notReady) {
  if (!C || !Array.isArray(C.Appearance)) return;
  const pose = [].concat(C.ActivePose || [], C.Pose || []).join(",");
  if (/AllFours|Hogtied/.test(pose)) return;   // (hidden in those poses on purpose)
  const worn = C.Appearance.filter((it) => it && it.Asset && it.Asset.Group && kindOf(it.Asset.Group.Name)).map((it) => it.Asset.Name);
  const missing = worn.filter((n) => !seen.has(n));
  if (!missing.length && !notReady.length) return;
  DIAG.push({ t: Date.now(), who: C.MemberNumber, name: String(C.Nickname || C.Name || ""), missing, notReady: [...new Set(notReady)] });
  if (DIAG.length > 40) DIAG.shift();
}
export const inkDiag = () => DIAG.slice();
function whyText() {
  if (!DIAG.length) return "No ink has gone missin' since you logged in.";
  return "Ink that didn't show, newest last:\n" + DIAG.slice(-10).map((d) => new Date(d.t).toLocaleTimeString() + " · " + d.name + " (" + d.who + ")" +
    (d.missing.length ? " · not drawn at all: " + d.missing.join(", ") : "") + (d.notReady.length ? " · picture not loaded yet: " + d.notReady.join(", ") : "")).join("\n");
}
const wornByLogo = (C) => (C && Array.isArray(C.Appearance) ? C.Appearance.some((it) => it && it.Asset && LIVE_BY[it.Asset.Name] && LIVE_BY[it.Asset.Name].logo) : false);
