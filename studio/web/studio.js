/* THE B&B OUTFIT STUDIO (studio/web/studio.js)
   Runs on top of the game's own page, served from your own computer (studio/server.mjs), signed in to nothing.
   The game's code is only used to DRAW: it builds a character exactly the way the game does, so every outfit,
   restraint, pose and colour here looks the way it would in the game.

   Step 1: a character on screen · paste an outfit code and see it worn · body size, skin, pose · copy the code back out.
   Step 2: pick any item from any slot and try it on · colour it · see what's worn and take pieces off.
   Step 4: click a worn piece to fit it: move, stretch, turn (the whole piece or one layer), change its option ·
           a fit is kept per item, body and pose in studio/fits/items.json and put back when that item is worn again.
   Step 7: "Mould to the body": a marked piece is redrawn row by row to follow the body's outline, belly and all.
   Step 6: "Configure it" opens the game's own settings menu for an item · adjustments are kept through a change of
           pose or body.
   Step 5: forward and back in the drawing order (the piece or one layer) · a colour for each colour layer.
   Step 3: the belly, drawn with the Companion's own belly code · sliders for shape and place · its own fit for each
           pose · saved to studio/fits/belly.json.
   The codes are the ones WCE and BCX export, and the game's own wardrobe copy: the list of items as JSON, packed with LZString to base64
   (a plain JSON list is taken too).

   How it sits in the game: once the game's own start-up has loaded the item list and reached its sign-in screen,
   we put our own screen in its place (CurrentScreenFunctions) that draws one character, and add a panel beside it.
*/
(() => {
  "use strict";
  const S = { C: null, ready: false };
  const $ = (tag, props, ...kids) => { const el = document.createElement(tag); Object.assign(el, props || {}); for (const k of kids.flat(Infinity)) if (k != null) el.append(k); return el; };
  const say = (text, bad) => { const el = document.getElementById("fh-say"); if (el) { el.textContent = text || ""; el.className = bad ? "bad" : ""; } };

  // ── outfit codes ──
  function decode(text) {
    const t = String(text || "").trim();
    if (!t) throw new Error("There's nothing in the box.");
    let json = t.startsWith("[") ? t : LZString.decompressFromBase64(t);
    if (!json) throw new Error("That isn't an outfit code I can read. It should be the text WCE or BCX gives you when you export a look.");
    const list = JSON.parse(json);
    if (!Array.isArray(list)) throw new Error("That code unpacked, but it isn't a list of items.");
    // Two shapes of list turn up. WCE and BCX write whole items: { Group, Name, Color, Property, Craft… }. The game's own
    // wardrobe (its copy and paste of a look) writes a short form: { G: group, A: item, C: colour }. Both are taken.
    const items = list.map((b) => (b && typeof b.G === "string" && typeof b.A === "string" ? Object.assign({ Group: b.G, Name: b.A, Color: b.C }, b.P ? { Property: b.P } : {}) : b))
      .filter((b) => b && typeof b.Group === "string" && typeof b.Name === "string");
    if (!items.length) throw new Error("That code unpacked into a list of " + list.length + " things, but none of them is an item I recognise.");
    return items;
  }
  const encode = (C) => LZString.compressToBase64(JSON.stringify(ServerAppearanceBundle(C.Appearance)));

  // put a list of items on the character. keepBody: the code only replaces what it names; everything else stays.
  function wear(list) {
    const C = S.C, named = new Set(list.map((b) => b.Group));
    // A code that names the body itself is a WHOLE look (the game's wardrobe copy is): clothes it doesn't mention come
    // off, as they would in the game. Restraints and toys are left alone either way. A code without the body only
    // replaces the slots it names.
    const whole = named.has("BodyUpper"), isItem = (g) => { const G = AssetGroupGet(C.AssetFamily, g); return !!G && G.Category === "Item"; };
    const keep = ServerAppearanceBundle(C.Appearance).filter((b) => !named.has(b.Group) && (!whole || isItem(b.Group)));
    ServerAppearanceLoadFromBundle(C, C.AssetFamily, keep.concat(list), undefined);
    redraw();
    return list.length;
  }
  function redraw() { try { CharacterRefresh(S.C, false, false); } catch (e) { console.warn("[studio] refresh:", e); } syncButtons(); try { fillItems(); fillWorn(); } catch (e) { /* panel not built yet */ } }

  // ── body ──
  const bodyItem = (group) => S.C.Appearance.find((a) => a.Asset.Group.Name === group);
  function setBody(group, name) {
    stashFits();
    const b = ServerAppearanceBundle(S.C.Appearance), it = b.find((x) => x.Group === group);
    if (it) it.Name = name;
    ServerAppearanceLoadFromBundle(S.C, S.C.AssetFamily, b, undefined); applyAllSaved(); redraw();
  }
  function setSkin(tone) {
    const b = ServerAppearanceBundle(S.C.Appearance);
    for (const it of b) if (["BodyUpper", "BodyLower", "Head", "ArmsLeft", "ArmsRight"].includes(it.Group)) it.Color = tone;
    ServerAppearanceLoadFromBundle(S.C, S.C.AssetFamily, b, undefined); redraw();
  }
  // ── the drawing ── (studio/web/body-engine.js: the very same code the Companion draws with)
  // With the live game's own files, our drawings are handed to it by address, the way the Companion does in the game
  // (extension/src/drawnbody.js): that version keeps its pictures by address, and one handed over as itself stopped
  // every redraw ("key.startsWith is not a function"). Trimmed to what's on them; the old ones are let go after a while.
  const made = new WeakMap(), used = new Map(); let fresh = false;
  function picture(cv) {
    let p = made.get(cv); if (p) { if (p.src) used.set(p.src, Date.now()); return p.src ? p : null; }
    const w = cv.width, h = cv.height; if (!w || !h) return null;
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    try { const d = cv.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h).data; for (let y = 0; y < h; y++) { const o = y * w * 4; for (let x = 0; x < w; x++) if (d[o + x * 4 + 3]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } } }
    catch (e) { x0 = 0; y0 = 0; x1 = w - 1; y1 = h - 1; }
    if (x1 < 0) { made.set(cv, { src: null }); return null; }
    const c = document.createElement("canvas"); c.width = x1 - x0 + 1; c.height = y1 - y0 + 1; c.getContext("2d").drawImage(cv, -x0, -y0);
    p = { src: c.toDataURL("image/png"), dx: x0, dy: y0 }; made.set(cv, p); if (!used.has(p.src)) fresh = true; used.set(p.src, Date.now()); return p;   // (the same picture again: no new drawing needed)
  }
  if (window.__studioLive) setInterval(() => { const old = Date.now() - 30000; for (const [src, t] of used) if (t < old) { used.delete(src); try { if (window.GLDrawImageCache) GLDrawImageCache.delete(src); if (window.DrawImageCache) DrawImageCache.delete(src); const gl = window.GLDrawCanvas && GLDrawCanvas.GL, tc = gl && gl.textureCache, t2 = tc && tc.get(src); if (t2) { if (t2.texture) gl.deleteTexture(t2.texture); tc.delete(src); } } catch (e) { /* fine */ } } }, 20000);
  const E = window.FarmBodyEngine({ S, bodyItem: (g) => bodyItem(g), setBody: (g, n) => setBody(g, n), redraw: () => bellyDraw(), picture: window.__studioLive ? picture : undefined });
  window.__studioEngine = E;   // (for looking in from the console: how much it keeps, E.keptBytes())
  const { BELLY, FIT0, poseKey, fitNow, bellySkin, MOULD, mouldKey, mouldImg, edges, edgesOf, outline, bellyCover, bellyAuto, pieceSpan, bellyRows, mouldCanvas,
    BREAST, BREAST_SLIDERS, NIP_GROUPS, HAND_GROUPS, NIP_PIECES, ARM_GROUPS, heldNow, chestSlot, STRAPS, gameBreast, upperName, breastNow, setCup, cupNow, nipHalves, GEN } = E;
  // step into the game's drawing of our character
  function hookBelly() { const game = CommonDrawAppearanceBuild; CommonDrawAppearanceBuild = function (C, cb) { fresh = false; const out = E.draw(C, cb, (cb2) => game(C, cb2)); if (fresh) setTimeout(() => bellyDraw(), 250); return out; }; }   // (a new picture takes a moment to load: drawn again then)

  // ── pose ──
  const POSES = [["Arms", ["BaseUpper", "Yoked", "OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs"]], ["Legs", ["BaseLower", "Kneel", "KneelingSpread", "LegsClosed", "Spread"]], ["Whole body", ["AllFours", "Hogtied"]]];
  function setPose(name) {
    stashFits();
    try { PoseSetActive(S.C, name, true, false); } catch (e) { say("The game wouldn't take that pose: " + (e && e.message || e), true); }
    applyAllSaved(); redraw(); if (BELLY.fill) BELLY.fill();
  }
  const poseOn = (name) => { const p = S.C.ActivePose || S.C.Pose || []; return Array.isArray(p) ? p.includes(name) : Object.values(S.C.ActivePoseMapping || {}).includes(name); };

  // ── try something on ──
  // every slot the game has that something can be put in: restraints and toys first, then clothes and looks
  function slots() {
    const body = new Set(["BodyUpper", "BodyLower", "Head", "ArmsLeft", "ArmsRight", "Height", "BodyStyle", "Pronouns", "ItemScript"]);
    const all = AssetGroup.filter((g) => g.Family === S.C.AssetFamily && !body.has(g.Name) && Asset.some((a) => a.Group === g));
    const items = all.filter((g) => g.Category === "Item"), looks = all.filter((g) => g.Category !== "Item");
    const byName = (a, b) => slotName(a).localeCompare(slotName(b));
    return [["Restraints and toys", items.sort(byName)], ["Clothes and looks", looks.sort(byName)]];
  }
  const slotName = (g) => String(g.Description || g.Name).replace(/([a-z])([A-Z])/g, "$1 $2");
  const itemName = (a) => String(a.Description || a.Name).replace(/([a-z])([A-Z0-9])/g, "$1 $2");
  const worn = (group) => S.C.Appearance.find((a) => a.Asset.Group.Name === group);
  function putOn(group, name) {
    const was = worn(group);
    if (was && was.Asset.Name === name) { select(group); say("That's on already. It's picked for fitting: the sliders are under \"Wearing now\". The ✕ there takes it off."); return; }
    else {
      InventoryWear(S.C, name, group, null, null, null, null, false);
      const now = worn(group);
      say(now && now.Asset.Name === name ? "On: " + itemName(now.Asset) + "  (the game calls it " + group + " / " + name + ")" : "The game wouldn't put that on.", !(now && now.Asset.Name === name));
      if (now && now.Asset.Name === name) { FIT.picked = group; applySaved(now); }
    }
    redraw();
  }
  function tint(group, colour) {
    const it = worn(group); if (!it) { say("Nothing's on in that slot to colour.", true); return; }
    it.Color = colour === "Default" ? "Default" : (Array.isArray(it.Color) || (it.Asset.Layer || []).filter((l) => l.AllowColorize !== false).length > 1 ? (it.Asset.Layer || []).filter((l) => l.AllowColorize !== false).map(() => colour) : colour);
    redraw(); say(colour === "Default" ? "Back to the game's own colours." : "Every colour layer of " + itemName(it.Asset) + " set to " + colour + ".");
  }
  function fillItems() {
    const box = document.getElementById("fh-items"), sel = document.getElementById("fh-slot"), find = document.getElementById("fh-find");
    if (!box || !sel) return;
    const g = AssetGroup.find((x) => x.Name === sel.value && x.Family === S.C.AssetFamily), q = String(find.value || "").toLowerCase().replace(/\s+/g, "");
    const list = Asset.filter((a) => a.Group === g && (!q || (a.Name + " " + (a.Description || "")).toLowerCase().replace(/\s+/g, "").includes(q)));
    const on = worn(sel.value);
    box.replaceChildren(...list.slice(0, 300).map((a) => $("button", { type: "button", className: on && on.Asset.Name === a.Name ? "on" : "", textContent: itemName(a), title: a.Group.Name + " / " + a.Name, onclick: () => putOn(a.Group.Name, a.Name) })),
      list.length ? "" : $("p", { className: "note", textContent: "Nothing in this slot matches." }));
    document.getElementById("fh-count").textContent = list.length + " in this slot" + (list.length > 300 ? " (showing the first 300: type to narrow it)" : "");
  }
  function fillWorn() {
    const box = document.getElementById("fh-worn"); if (!box) return;
    const body = new Set(["BodyUpper", "BodyLower", "Head", "ArmsLeft", "ArmsRight", "Height", "BodyStyle", "Pronouns"]);
    const list = S.C.Appearance.filter((a) => !body.has(a.Asset.Group.Name) && (a.Asset.Group.Category === "Item" || a.Asset.Group.AllowNone));   // only what can come off: not eyes, mouth or hands
    if (FIT.picked && !list.some((a) => a.Asset.Group.Name === FIT.picked)) FIT.picked = null;
    box.replaceChildren(...list.map((a) => { const g = a.Asset.Group.Name; return $("span", { className: "fh-piece" + (FIT.picked === g ? " on" : "") },
        $("button", { type: "button", className: FIT.picked === g ? "on" : "", textContent: slotName(a.Asset.Group) + ": " + itemName(a.Asset), title: "Pick it, to fit it with the sliders below", onclick: () => select(g) }),
        $("button", { type: "button", className: "fh-x", textContent: "✕", title: "Take it off", onclick: () => { InventoryRemove(S.C, g, false); redraw(); } })); }),
      list.length ? "" : $("p", { className: "note", textContent: "Bare." }));
    fillFit();
  }

  // ── fitting what's worn ──
  // The game can draw any worn item moved, stretched or turned: each item carries TranslationX/Y, ScaleX/Y and Rotation in
  // its properties, and each LAYER of an item can carry its own on top (LayerTranslationX and so on, by layer name).
  // These are the "item configurations": numbers, not pictures. A fit is kept for an item on a body in a pose
  // (studio/fits/items.json), and put back whenever that item is worn on that body in that pose again.
  // saved: what's in the file · work: what you've set this sitting and not saved yet, by the same key. Changing the
  // pose or the body never throws an adjustment away (Laynie, Oct 12): what you'd set is kept for the pose you set
  // it in, and carried over to the new pose unless that pose already has a fit of its own.
  const FIT = { picked: null, layer: "", saved: {}, work: {} };
  const FIT_SLIDERS = [["TranslationX", "Left / right", -250, 250, 1, 0], ["TranslationY", "Up / down", -250, 250, 1, 0], ["ScaleX", "Wider / narrower", 0.3, 2.5, 0.01, 1], ["ScaleY", "Taller / shorter", 0.3, 2.5, 0.01, 1], ["Rotation", "Turn", -180, 180, 1, 0]];
  const fitKey = (it) => it.Asset.Group.Name + "/" + it.Asset.Name + "|" + ((bodyItem("BodyUpper") || { Asset: {} }).Asset.Name || "") + "+" + ((bodyItem("BodyLower") || { Asset: {} }).Asset.Name || "") + "|" + poseKey();
  const fitGet = (it, k, def) => { const p = it.Property || {}; if (FIT.layer) { const rec = p["Layer" + k]; return rec && typeof rec[FIT.layer] === "number" ? rec[FIT.layer] : def; } return typeof p[k] === "number" ? p[k] : def; };
  function fitSet(it, k, v, def) {
    const p = it.Property = it.Property || {};
    if (FIT.layer) { const rec = p["Layer" + k] = Object.assign({}, p["Layer" + k]); if (v === def) delete rec[FIT.layer]; else rec[FIT.layer] = v; if (!Object.keys(rec).length) delete p["Layer" + k]; }
    else if (v === def) delete p[k]; else p[k] = v;
  }
  // ── the game's own settings for an item ──
  // Many items have a settings menu of their own in the game (a pump's speed, a gag's type, a belt's shields, a tag's
  // words, an item made of several parts). The studio doesn't copy those menus: it opens the game's real one, on our
  // character, drawn by the game. While it's open our panel steps aside; "Done" (or the game's own exit) brings it back.
  const CONFIG = { on: false, timer: null };
  function configure(group) {
    const it = worn(group); if (!it) return;
    if (!it.Asset.Extended && !it.Asset.Archetype) { say("That piece has no settings menu in the game. Its fit, order and colours are below."); return; }
    try {
      stashFits();
      S.C.FocusGroup = it.Asset.Group;
      CharacterSetCurrent(S.C, { mode: "items" });
      DialogExtendItem(it);
      if (!DialogFocusItem) throw new Error("the game wouldn't open it (it may think the item is blocked)");
      CONFIG.on = true; document.body.classList.add("fh-config");
      clearInterval(CONFIG.timer); CONFIG.timer = setInterval(() => { if (CONFIG.on && (!CurrentCharacter || !DialogFocusItem)) configureDone(); }, 250);
    } catch (e) { configureDone(); say("The game's menu for that piece wouldn't open: " + (e && e.message || e), true); }
  }
  function configureDone() {
    clearInterval(CONFIG.timer); CONFIG.timer = null;
    try { if (DialogFocusItem) DialogLeaveFocusItem(false); } catch (e) { console.warn("[studio] closing the item menu:", e); }
    try { if (CurrentCharacter) DialogLeave(); } catch (e) { console.warn("[studio] leaving the dialog:", e); }
    CurrentCharacter = null; DialogFocusItem = null; if (S.C) S.C.FocusGroup = null;
    const was = CONFIG.on; CONFIG.on = false; document.body.classList.remove("fh-config");
    if (CurrentScreen !== "FarmStudio") { CurrentScreen = "FarmStudio"; }
    redraw(); if (was) say("Settings kept. They travel in the outfit code when you copy the look.");
  }

  // ── forward and back ──
  // Every layer has a place in the drawing order (a number: bigger is drawn later, so it's in front). The game lets
  // an item override that: Property.OverridePriority, one number for the whole piece or a number for each layer by name.
  const layerOf = (it, name) => (it.Asset.Layer || []).find((l) => l.Name === name);
  function orderOwn(it) { const l = FIT.layer && layerOf(it, FIT.layer); return l && typeof l.Priority === "number" ? l.Priority : (typeof it.Asset.DrawingPriority === "number" ? it.Asset.DrawingPriority : (it.Asset.Group.DrawingPriority || 0)); }
  function orderNow(it) {
    const o = (it.Property || {}).OverridePriority;
    if (typeof o === "number") return o;
    if (o && typeof o === "object" && FIT.layer && typeof o[FIT.layer] === "number") return o[FIT.layer];
    return orderOwn(it);
  }
  function orderSet(it, n) {
    const p = it.Property = it.Property || {};
    if (n == null) { if (FIT.layer && p.OverridePriority && typeof p.OverridePriority === "object") { delete p.OverridePriority[FIT.layer]; if (!Object.keys(p.OverridePriority).length) delete p.OverridePriority; } else delete p.OverridePriority; }
    else if (FIT.layer) { const rec = typeof p.OverridePriority === "object" && p.OverridePriority ? Object.assign({}, p.OverridePriority) : {}; rec[FIT.layer] = n; p.OverridePriority = rec; }
    else p.OverridePriority = n;
    redraw();   // the order is worked out when the character is refreshed, not just redrawn
  }
  // ── colours, layer by layer ──
  function colourLayers(it) {
    const out = [], seen = new Set(); let i = 0;
    for (const l of it.Asset.Layer || []) {
      if (l.AllowColorize === false || l.HideColoring) continue;
      const idx = typeof l.ColorIndex === "number" ? l.ColorIndex : i; i++;
      if (seen.has(idx)) continue; seen.add(idx);
      out.push({ idx, name: l.ColorGroup || l.Name || "Colour " + (idx + 1) });
    }
    return out;
  }
  function colourList(it, n) { const c = Array.isArray(it.Color) ? it.Color.slice() : new Array(n).fill(typeof it.Color === "string" ? it.Color : "Default"); while (c.length < n) c.push("Default"); return c; }
  function colourSet(it, idx, hex) { const L = colourLayers(it), n = Math.max(1, ...L.map((x) => x.idx + 1)), c = colourList(it, n); c[idx] = hex; it.Color = c; redraw(); }

  const fitOf = (it) => { const p = it.Property || {}, out = {}; for (const [k] of FIT_SLIDERS) { if (typeof p[k] === "number") out[k] = p[k]; if (p["Layer" + k] && Object.keys(p["Layer" + k]).length) out["Layer" + k] = Object.assign({}, p["Layer" + k]); } if (p.OverridePriority != null) out.OverridePriority = typeof p.OverridePriority === "object" ? Object.assign({}, p.OverridePriority) : p.OverridePriority; return out; };
  function fitClear(it) { const p = it.Property || {}; for (const [k] of FIT_SLIDERS) { delete p[k]; delete p["Layer" + k]; } delete p.OverridePriority; }
  const fittable = (it) => it.Asset.Group.Category === "Item" || it.Asset.Group.AllowNone;
  // this pose and body's own fit for a piece, if it has one (unsaved work first, then the file). Otherwise it's left as it is.
  function applySaved(it) { const k = fitKey(it), f = FIT.work[k] || FIT.saved[k]; if (!f) return false; fitClear(it); Object.assign(it.Property = it.Property || {}, JSON.parse(JSON.stringify(f))); return true; }
  function applyAllSaved() { for (const it of S.C.Appearance) if (fittable(it)) applySaved(it); }
  // before the pose or the body changes: remember what each piece is set to, for the pose and body it's set in
  function stashFits() { try { for (const it of S.C.Appearance) if (fittable(it)) { const f = fitOf(it), k = fitKey(it); if (Object.keys(f).length) FIT.work[k] = f; else delete FIT.work[k]; } } catch (e) { console.warn("[studio] keeping fits:", e); } }
  const fitDraw = () => { try { CharacterLoadCanvas(S.C); } catch (e) { console.warn("[studio] fit redraw:", e); } };
  const fitRefresh = () => { try { CharacterRefresh(S.C, false, false); } catch (e) { console.warn("[studio] fit refresh:", e); } };   // (when the drawing order changed)
  function select(group) { FIT.picked = FIT.picked === group ? null : group; FIT.layer = ""; fillWorn(); }
  function fillFit() {
    const box = document.getElementById("fh-fit"); if (!box) return;
    const it = FIT.picked && worn(FIT.picked);
    if (!it) { box.replaceChildren($("p", { className: "note", textContent: "Click a piece above to fit it: move it, stretch it, turn it, or change its option. The ✕ takes it off." })); return; }
    const layers = (it.Asset.Layer || []).map((l) => l.Name).filter((n) => typeof n === "string" && n);
    let options = []; try { options = (TypedItemGetOptions(it.Asset.Group.Name, it.Asset.Name) || []).map((o) => o.Name); } catch (e) { options = []; }
    const typeNow = () => { const r = (it.Property || {}).TypeRecord; const i = r && typeof r.typed === "number" ? r.typed : 0; return options[i]; };
    const rows = FIT_SLIDERS.map(([k, label, min, max, step, def]) => { const v = fitGet(it, k, def), val = $("span", { className: "fh-val", textContent: String(v) });
      return $("div", { className: "fh-slide" }, $("label", { textContent: label }), $("input", { type: "range", min, max, step, value: v, oninput: (e) => { const n = Number(e.target.value); fitSet(it, k, n, def); val.textContent = String(n); fitDraw(); } }), val); });
    const has = !!FIT.saved[fitKey(it)];
    box.replaceChildren(...[
      $("p", { className: "note", textContent: "Fitting: " + itemName(it.Asset) + "  (" + it.Asset.Group.Name + " / " + it.Asset.Name + ")  on a " + fitKey(it).split("|")[1].replace("+", " chest, ") + " hips body, " + POSE_KEYS[poseKey()].toLowerCase() + "." }),
      (it.Asset.Extended || it.Asset.Archetype) ? $("div", { className: "row" }, $("button", { type: "button", className: "go", textContent: "Configure it (the game's own menu)", title: "Opens the real settings menu the game has for this item", onclick: () => configure(it.Asset.Group.Name) }), $("span", { className: "note", textContent: "Everything the game lets you set on it." })) : "",
      $("div", { className: "row" },
        $("label", { textContent: "Mould to the body:" }),
        (() => { const k = mouldKey(it), now = MOULD.items.has(k) ? (MOULD.mode.get(k) || "wide") : "";
          const sel = $("select", { title: "Redraws this piece to follow the body, belly and all", onchange: (e) => { const v = e.target.value; if (v) { MOULD.items.add(k); MOULD.mode.set(k, v); } else { MOULD.items.delete(k); MOULD.mode.delete(k); } MOULD.out.clear(); bellyDraw(); fillFit(); if (v && !fitNow().on) say("It's marked. The moulding shows once the belly is showing: there's nothing to mould to yet."); } },
            [["", "The usual: grown to cover the belly, if it lies on it"], ["wide", "Wide: out to the body's outline, sleeves and all"], ["over", "Over: wide, and down over the belly"], ["under", "Under: it sits beneath, the belly hangs over it"]].map(([v, t]) => $("option", { value: v, textContent: t, selected: v === now })));
          return sel; })(),
        $("span", { className: "note", textContent: ({ "": "Follows the body where the sliders can't.", wide: "As wide as the body on every row. Never longer.", over: "Wide, and lengthened so it runs down to the underside of the belly.", under: "Left where it is on the body. The belly covers what it hangs in front of." })[MOULD.items.has(mouldKey(it)) ? (MOULD.mode.get(mouldKey(it)) || "wide") : ""] })),
      $("div", { className: "row" },
        $("label", { textContent: "On drawn breasts:" }),
        (() => { const k = mouldKey(it), now = BREAST.wear[k] || "";
          return $("select", { title: "What this piece does when the breasts are a drawn size (DD and up)", onchange: (e) => { const v = e.target.value; if (v) BREAST.wear[k] = v; else delete BREAST.wear[k]; BREAST.out.clear(); bellyDraw(); fillFit(); } },
            [["", "A size up, and the breasts fit it (the usual)"], ["nipple", "Pinned to her nipples (shields, pasties, holes)"]].concat([["plain", "Leave it as the game draws it"], ["behind", "Tuck it behind them"]]).map(([v, t]) => $("option", { value: v, textContent: t, selected: v === now }))); })(),
        $("span", { className: "note", textContent: "Kept with Save the breasts." })),
      options.length > 1 ? $("div", { className: "row" }, $("label", { textContent: "Option:" }), options.map((o) => $("button", { type: "button", className: typeNow() === o ? "on" : "", textContent: o.replace(/([a-z])([A-Z0-9])/g, "$1 $2"), onclick: () => { try { TypedItemSetOptionByName(S.C, it, o, false, null, false); } catch (e) { say("The game wouldn't set that option: " + (e && e.message || e), true); } redraw(); } }))) : "",
      layers.length > 1 ? $("div", { className: "row" }, $("label", { textContent: "Move:" }),
        $("button", { type: "button", className: FIT.layer ? "" : "on", textContent: "The whole piece", onclick: () => { FIT.layer = ""; fillFit(); } }),
        layers.map((n) => $("button", { type: "button", className: FIT.layer === n ? "on" : "", textContent: n.replace(/([a-z])([A-Z0-9])/g, "$1 $2"), title: "Just this layer of it", onclick: () => { FIT.layer = n; fillFit(); } }))) : "",
      rows,
      (() => { const own = orderOwn(it), now = orderNow(it);
        return $("div", { className: "row" }, $("label", { textContent: "In front of / behind other things:" }),
          $("button", { type: "button", textContent: "◀ Back", title: "Drawn earlier, so more things cover it", onclick: () => { orderSet(it, orderNow(it) - 1); } }),
          $("span", { className: "fh-val", style: "min-width:34px;text-align:center", textContent: String(now) }),
          $("button", { type: "button", textContent: "Forward ▶", title: "Drawn later, so it covers more things", onclick: () => { orderSet(it, orderNow(it) + 1); } }),
          $("button", { type: "button", textContent: "The game's own (" + own + ")", onclick: () => { orderSet(it, null); } }),
          $("span", { className: "note", textContent: (FIT.layer ? "this layer" : "the whole piece") + (now !== own ? ", moved " + (now > own ? "forward " : "back ") + Math.abs(now - own) : "") })); })(),
      (() => { const L = colourLayers(it); if (!L.length) return ""; const cols = colourList(it, Math.max(1, ...L.map((x) => x.idx + 1)));
        return $("div", { className: "row" }, $("label", { textContent: "Colours:" }), L.map((x) => { const c = cols[x.idx], hex = typeof c === "string" && /^#[0-9a-fA-F]{6}$/.test(c) ? c : "#888888";
          return $("span", { className: "fh-colour" }, $("span", { textContent: String(x.name).replace(/([a-z])([A-Z0-9])/g, "$1 $2") }),
            $("input", { type: "color", value: hex, title: "Its own colour: " + c, onchange: (e) => colourSet(it, x.idx, e.target.value) }),
            $("button", { type: "button", className: "fh-x", textContent: c === "Default" ? "game's" : "↺", title: "Back to the game's own colour for this layer", onclick: () => colourSet(it, x.idx, "Default") })); })); })(),
      $("div", { className: "row" },
        $("button", { type: "button", className: "go", textContent: "Save this fit", title: "For this piece on this body in this pose", onclick: () => saveFit(it) }),
        $("button", { type: "button", textContent: "Back to how the game draws it", onclick: () => { fitClear(it); fitDraw(); fillFit(); say("Fit cleared on screen. \"Save this fit\" would save it cleared."); } }),
        has ? $("button", { type: "button", textContent: "Put the saved fit back", onclick: () => { applySaved(it); fitDraw(); fillFit(); } }) : "",
        $("span", { className: "note", textContent: has ? "A fit is saved for this." : "No fit saved for this yet." }))].flat(Infinity).filter((x) => x !== ""));
  }
  async function saveFit(it) {
    const key = fitKey(it), f = fitOf(it);
    if (Object.keys(f).length) FIT.saved[key] = f; else delete FIT.saved[key];
    delete FIT.work[key];
    try { const r = await fetch("/__studio/fits/items.json", { method: "POST", body: JSON.stringify({ v: 1, saved: new Date().toISOString(), note: "key: slot/item|chest+hips|pose · mould: slot/item pieces redrawn to the body's outline", fits: FIT.saved, mould: Array.from(MOULD.items), mouldMode: Object.fromEntries(MOULD.mode) }, null, 1) }); if (!r.ok) throw new Error(await r.text());
      say("Saved the fit for " + itemName(it.Asset) + " on this body in this pose. " + Object.keys(FIT.saved).length + " fits kept in studio\\fits\\items.json."); fillFit(); }
    catch (e) { say("It didn't save: " + (e && e.message || e), true); }
  }
  async function loadItemFits() { try { const d = await (await fetch("/__studio/fits/items.json", { cache: "no-store" })).json(); if (d && Array.isArray(d.mould)) for (const k of d.mould) MOULD.items.add(k); if (d && d.mouldMode) for (const k of Object.keys(d.mouldMode)) if (MOULD.items.has(k)) MOULD.mode.set(k, d.mouldMode[k]);
      if (d && d.fits) { FIT.saved = d.fits; applyAllSaved(); fitRefresh(); fillFit(); } } catch (e) { /* none yet */ } }

  // ── the belly ── (its drawing is in body-engine.js)
  // A fit for each pose: where it sits and what shape it is. "std" is standing, kneeling and every arms pose (the torso
  // is in the same place in all of them). Saved to studio/fits/belly.json by the Save button.
  const POSE_KEYS = { std: "Standing, kneeling, arms poses", AllFours: "All fours", Hogtied: "Hogtied" };
  const SLIDERS = [["rx", "Width", 20, 170, 1], ["ry", "Height", 20, 190, 1], ["sag", "Hang (how low the weight sits)", 0, 0.5, 0.01], ["x", "Left / right", -120, 120, 1], ["y", "Up / down", -200, 200, 1], ["cut", "Ground line (when pressed flat)", 0.2, 1, 0.01]];
  async function saveBreasts() {
    try { const r = await fetch("/__studio/fits/breasts.json", { method: "POST", body: JSON.stringify({ v: 1, saved: new Date().toISOString(), cup: BREAST.cup, full: BREAST.full, hang: BREAST.hang, apart: BREAST.apart, x: BREAST.x, y: BREAST.y, nip: BREAST.nip, nipY: BREAST.nipY, nipX: BREAST.nipX, wear: BREAST.wear }, null, 1) }); if (!r.ok) throw new Error(await r.text()); say("Saved to studio\\fits\\breasts.json."); }
    catch (e) { say("It didn't save: " + (e && e.message || e), true); }
  }
  // Everything the drawn body needs, as one code for the Companion (Toggles, Drawn body): the cup and the breast sliders,
  // the choices made for pieces, the belly for each pose, and the mould choices. Nothing of the outfit itself.
  async function copyForCompanion() {
    const code = "FARMBODY1:" + LZString.compressToBase64(JSON.stringify({ v: 1, saved: new Date().toISOString(), cup: BREAST.cup == null ? cupNow() : BREAST.cup,
      breast: { full: BREAST.full, hang: BREAST.hang, apart: BREAST.apart, x: BREAST.x, y: BREAST.y, nip: BREAST.nip, nipY: BREAST.nipY, nipX: BREAST.nipX }, tuck: BREAST.tuck, dress: BREAST.dress, wear: BREAST.wear,
      belly: BELLY.fits, auto: BELLY.auto !== false, mould: { items: [...MOULD.items], mode: Object.fromEntries(MOULD.mode) } }));
    try { await navigator.clipboard.writeText(code); say("Copied. In the game: the Companion's Toggles, Drawn body, paste it in the box and press Put in the studio's settings."); }
    catch (e) { const box = document.getElementById("fh-code"); if (box) box.value = code; say("It's in the outfit code box at the top: select it and copy, then paste it into the Companion's Drawn body box."); }
  }
  async function loadBreasts(tell) {
    try { const d = await (await fetch("/__studio/fits/breasts.json", { cache: "no-store" })).json();
      if (d) { for (const [k] of BREAST_SLIDERS) if (typeof d[k] === "number") BREAST[k] = d[k]; if (d.wear && typeof d.wear === "object") BREAST.wear = d.wear; if (tell && typeof d.cup === "number") setCup(d.cup); if (BREAST.fill) BREAST.fill(); bellyDraw(); if (tell) say("The saved breasts are back."); }
      else if (tell) say("Nothing has been saved yet."); } catch (e) { if (tell) say("I couldn't read the saved breasts: " + (e && e.message || e), true); }
  }
  // Every piece in a slot, tried on at the size showing, as a sheet of small pictures: the quick way to find the ones
  // the stretch makes a mess of. Click a picture to put that piece on and pick it.
  const AUDIT = { on: false };
  const waitMs = (ms) => new Promise((r) => setTimeout(r, ms));
  async function chestAudit(group) {
    if (AUDIT.on) return; AUDIT.on = true;
    const before = ServerAppearanceBundle(S.C.Appearance), list = Asset.filter((a) => a.Group.Name === group && a.Visible !== false);
    const grid = $("div", { className: "fh-audit-grid" }), head = $("span", { textContent: "Trying on " + list.length + " pieces…" });
    let stop = false;
    const close = () => { stop = true; over.remove(); };
    const over = $("div", { id: "fh-audit" }, $("div", { className: "fh-audit-head" }, head, $("button", { type: "button", textContent: "Close", onclick: close })), grid);
    document.getElementById("fh-studio").append(over);
    let n = 0;
    for (const a of list) {
      if (stop) break;
      try {
        wear(before); putOn(group, a.Name);
        await waitMs(450); bellyDraw(); await waitMs(150); bellyDraw();
        const cv = $("canvas", { width: 200, height: 210, title: a.Name });
        cv.getContext("2d").drawImage(S.C.Canvas, 60, 900, 380, 400, 0, 0, 200, 210);
        grid.append($("figure", { onclick: () => { close(); wear(before); putOn(group, a.Name); FIT.picked = group; redraw(); } }, cv, $("figcaption", { textContent: itemName(a) })));
      } catch (e) { console.warn("[studio] sheet:", a.Name, e); }
      head.textContent = "Tried " + (++n) + " of " + list.length + " in " + group + ". Click one to put it on.";
    }
    if (!before.some((b) => b.Group === group)) { try { InventoryRemove(S.C, group); } catch (e) { /* nothing on */ } }
    if (!stop) { wear(before); redraw(); head.textContent = list.length + " pieces in " + group + " at " + FarmBreasts.CUPS[cupNow()] + ". Click one to put it on and pick it."; }
    AUDIT.on = false;
  }
  // ── between the legs ──
  // The game's own art: three pussies and a cock, and the cock has a soft picture and a hard one (the game shows the hard
  // one once she's worked up past 30). The farm keeps a length for a cock, in inches (6 to start, up to 30), so here it
  // can be drawn at that length: the game's picture, grown evenly from where it joins her. The game won't grow a
  // picture past three times, which is 18 inches; longer than that is drawn at 18.
  const genItem = () => S.C.Appearance.find((a) => a.Asset.Group.Name === "Pussy");
  const genHard = () => { const it = genItem(); return !!(it && it.Property && it.Property.Expression === "Hard"); };
  function genFit() {
    const it = genItem(); if (!it) return;
    const p = it.Property = it.Property || {};
    for (const k of ["ScaleX", "ScaleY", "TranslationX", "TranslationY"]) delete p[k];
    if (it.Asset.Name === "Penis" && !(GEN.drawn && window.FarmCock)) { const k = Math.max(0.5, Math.min(3, GEN.inches / 6));
      if (Math.abs(k - 1) > 0.01) {
        // grown from where it joins her, so it's moved back by however
        // far that point would have gone: soft, it hangs from the top middle of what's drawn; hard, it stands up from low
        // in the picture, just above the balls.
        const hard = p.Expression === "Hard", src = "Assets/Female3DCG/Pussy/" + (hard ? "Hard/" : "") + "Penis_White.png", box = GEN.box[src];
        if (!box) { const im = new Image(); im.onload = () => { const e = edges(im, im.naturalWidth, im.naturalHeight); let t = -1, b = -1, l = 1e9, r = -1; for (let j = 0; j < e.h; j++) if (e.L[j] >= 0) { if (t < 0) t = j; b = j; l = Math.min(l, e.L[j]); r = Math.max(r, e.R[j]); } GEN.box[src] = { cx: (l + r) / 2, t, b, w: im.naturalWidth, h: im.naturalHeight }; genFit(); }; im.src = src; }
        else { const ax = box.cx, ay = hard ? box.t + (box.b - box.t) * 0.72 : box.t; // (measured, not assumed: the game grows a picture about its MIDDLE, and a move asked for is applied twice over)
          p.ScaleX = k; p.ScaleY = k; p.TranslationX = -Math.round((ax - box.w / 2) * (k - 1) / 2); p.TranslationY = -Math.round((ay - box.h / 2) * (k - 1) / 2); }
      } }
    redraw();
  }
  function genSet(name) { setBody("Pussy", name); genFit(); }
  function genHardSet(on) { const it = genItem(); if (!it) return; const p = it.Property = it.Property || {}; if (on) p.Expression = "Hard"; else delete p.Expression; genFit(); }
  function genPanel() {
    const box = $("div", { id: "fh-gen" });
    const fill = () => { const it = genItem(), cock = !!(it && it.Asset.Name === "Penis"), val = $("span", { className: "fh-val", textContent: GEN.inches + " in" });
      box.replaceChildren(...[
        $("div", { className: "row" }, ["Pussy1", "Pussy2", "Pussy3", "Penis"].filter((n) => Asset.some((a) => a.Group.Name === "Pussy" && a.Name === n)).map((n) => $("button", { type: "button", className: it && it.Asset.Name === n ? "on" : "", textContent: n === "Penis" ? "Cock" : "Pussy " + n.slice(-1), onclick: () => { genSet(n); fill(); } }))),
        cock ? $("div", { className: "row" }, $("button", { type: "button", className: genHard() ? "" : "on", textContent: "Soft", onclick: () => { genHardSet(false); fill(); } }), $("button", { type: "button", className: genHard() ? "on" : "", textContent: "Hard", onclick: () => { genHardSet(true); fill(); } }), $("span", { className: "note", textContent: "In the game it goes hard by itself past 30 arousal." })) : "",
        cock ? $("div", { className: "fh-slide" }, $("label", { textContent: "Length, as the farm counts it" }), $("input", { type: "range", min: 3, max: 36, step: 1, value: GEN.inches, oninput: (e) => { GEN.inches = Number(e.target.value); val.textContent = GEN.inches + " in" + (!GEN.drawn && GEN.inches > 18 ? " (the game's picture stops at 18)" : ""); genFit(); bellyDraw(); } }), val) : "",
        cock && window.FarmCock ? $("div", { className: "row" },
          $("button", { type: "button", className: GEN.drawn ? "on" : "", textContent: GEN.drawn ? "Ours, drawn" : "The game's picture", title: "Ours can be any length, any kind, with balls of any size. The game's is one picture.", onclick: () => { GEN.drawn = !GEN.drawn; genFit(); bellyDraw(); fill(); } }),
          GEN.drawn ? $("select", { title: "What kind", onchange: (e) => { GEN.kind = e.target.value; bellyDraw(); } }, Object.keys(FarmCock.KINDS).map((k) => $("option", { value: k, textContent: FarmCock.KINDS[k].label, selected: k === GEN.kind }))) : "",
          GEN.drawn ? $("button", { type: "button", className: GEN.knot ? "on" : "", textContent: GEN.knot ? "Knotted" : "No knot", title: "A canine one always has a knot. It shows when it's hard.", onclick: () => { GEN.knot = !GEN.knot; bellyDraw(); fill(); } }) : "") : "",
        // a kind drawn from stamps (Laynie's picked pictures): which shaft stands, and whether the sack is drained or pent up
        cock && GEN.drawn && window.FarmCock && FarmCock.hasStamps && FarmCock.hasStamps(GEN.kind) ? $("div", { className: "row" },
          genHard() ? FarmCock.STAMP_FILES[GEN.kind].hard.map((n, i) => $("button", { type: "button", className: (GEN.style | 0) === i ? "on" : "", textContent: n.replace(/^hard-/, "").replace("-", "."), title: "Which of her picked pictures stands", onclick: () => { GEN.style = i; bellyDraw(); fill(); } })) : "",
          $("button", { type: "button", className: GEN.pent ? "on" : "", textContent: GEN.pent ? "Pent up" : "Drained", title: "The sack: drained and loose, or full and swollen", onclick: () => { GEN.pent = !GEN.pent; bellyDraw(); fill(); } })) : "",
        cock && GEN.drawn && window.FarmCock ? [["girth", "Girth", 0.6, 2, 0.05, ""], ["balls", "Balls, as the farm counts them (1 to 20)", 1, 20, 1, ""]].map(([k, label, min, max, step]) => { const v2 = $("span", { className: "fh-val", textContent: String(GEN[k]) });
          return $("div", { className: "fh-slide" }, $("label", { textContent: label }), $("input", { type: "range", min, max, step, value: GEN[k], oninput: (e) => { GEN[k] = Number(e.target.value); v2.textContent = String(GEN[k]); bellyDraw(); } }), v2); }) : ""].flat(Infinity)); };
    GEN.fill = fill; fill(); return box;
  }
  // ── the catalogue ──
  // Every piece in a slot, on the body and at the size showing now, as pages of pictures big enough to judge (twelve to a
  // page), saved as PNG files in studio\catalogue. For going through the whole wardrobe slot by slot and marking what
  // doesn't fit (Laynie, Oct 14: "keep going with all the clothing items, restraints until we have a full catalogue").
  const CAT_SLOTS = ["Cloth", "ClothOuter", "ClothAccessory", "Bra", "Suit", "Corset", "Necklace", "ItemBreast", "ItemTorso", "ItemTorso2", "ItemArms", "ItemNipples", "ItemNipplesPiercings", "ItemNeckAccessories", "ItemNeckRestraints", "ClothLower", "Panties", "SuitLower", "ItemPelvis", "ItemVulva", "ItemButt", "ItemLegs"];
  async function catalogue(group, opt) {
    opt = opt || {};
    const per = 12, cols = 4, TW = 320, TH = 360, crop = opt.crop || [40, 880, 420, 472];
    const before = ServerAppearanceBundle(S.C.Appearance), had = before.some((b) => b.Group === group);
    const all = Asset.filter((a) => a.Group.Name === group && a.Visible !== false && (!opt.echo || (S.echoFrom != null && Asset.indexOf(a) >= S.echoFrom))), pages = Math.ceil(all.length / per), saved = [];
    const tag = (opt.echo ? "echo-" : "") + FarmBreasts.CUPS[cupNow()] + (fitNow().on ? "-belly" : "") + (poseKey() !== "std" ? "-" + poseKey().toLowerCase() : "");
    for (let p = (opt.from || 0); p < Math.min(pages, opt.to == null ? pages : opt.to); p++) {
      const cv = document.createElement("canvas"); cv.width = cols * TW; cv.height = Math.ceil(per / cols) * TH + 30; const g = cv.getContext("2d");
      g.fillStyle = "#565a66"; g.fillRect(0, 0, cv.width, cv.height); g.fillStyle = "#fff"; g.font = "bold 18px system-ui, sans-serif";
      g.fillText(group + "  ·  " + tag + "  ·  page " + (p + 1) + " of " + pages + "  ·  " + all.length + " pieces", 10, 21);
      const part = all.slice(p * per, p * per + per);
      for (let n = 0; n < part.length; n++) {
        const a = part[n], X = (n % cols) * TW, Y = 30 + Math.floor(n / cols) * TH;
        try { wear(before); if (!had) { try { InventoryRemove(S.C, group); } catch (e) { /* nothing on */ } } putOn(group, a.Name);
          for (let k = 0; k < 4; k++) { await waitMs(k ? 220 : (opt.wait || (opt.echo ? 1500 : 520))); bellyDraw(); }   /* (Echo's pictures come from the internet: a first look waits longer for them) */ await waitMs(60);
          g.drawImage(S.C.Canvas, crop[0] + charX(), crop[1], crop[2], crop[3], X, Y, TW, TH); } catch (e) { console.warn("[studio] catalogue:", a.Name, e); g.fillStyle = "#a33"; g.fillRect(X, Y, TW, TH); }
        g.fillStyle = "rgba(0,0,0,0.6)"; g.fillRect(X, Y, TW, 20); g.fillStyle = "#fff"; g.font = "13px system-ui, sans-serif"; g.fillText((p * per + n + 1) + ". " + itemName(a).slice(0, 34), X + 4, Y + 15);
        if (opt.say !== false) say("Catalogue: " + group + ", " + (p * per + n + 1) + " of " + all.length + "…");
      }
      const name = (group + "-" + tag + "-" + String(p + 1).padStart(2, "0")).toLowerCase().replace(/[^a-z0-9-]/g, "");
      try { const blob = await new Promise((r) => cv.toBlob(r, "image/png")); const res = await fetch("/__studio/catalogue/" + name + ".png", { method: "POST", body: blob }); if (!res.ok) throw new Error(await res.text()); saved.push(name + ".png"); }
      catch (e) { say("A catalogue page didn't save: " + (e && e.message || e), true); }
    }
    wear(before); if (!had) { try { InventoryRemove(S.C, group); } catch (e) { /* nothing on */ } } redraw();
    say("Catalogue of " + group + ": " + saved.length + " page(s) saved in studio\\catalogue.");
    return saved;
  }
  function breastPanel() {
    const box = $("div", { id: "fh-breasts" });
    if (!window.FarmBreasts) { box.append($("p", { className: "note", textContent: "The breast drawing didn't load. Restart the studio (close its window and run the .bat again)." })); return box; }
    const fill = () => {
      const now = cupNow(), drawn = !!breastNow();
      box.replaceChildren(...[
        $("div", { className: "row" }, $("label", { textContent: "Cup:" }),
          $("select", { onchange: (e) => { setCup(Number(e.target.value)); fill(); } }, FarmBreasts.CUPS.map((n, i) => $("option", { value: String(i), textContent: n + (i < FarmBreasts.DRAWN_FROM ? "  (the game's own: " + FarmBreasts.NATIVE[i].replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase() + ")" : ""), selected: i === now }))),
          $("button", { type: "button", textContent: "◀ Smaller", onclick: () => { setCup(Math.max(0, cupNow() - 1)); fill(); } }),
          $("button", { type: "button", textContent: "Bigger ▶", onclick: () => { setCup(Math.min(FarmBreasts.CUPS.length - 1, cupNow() + 1)); fill(); } })),
        $("p", { className: "note", textContent: drawn ? "Drawn. The game's nipples, and what's worn on them, move onto them. Bras and chest gear are still cut for the game's chest." : "Flat to D is the game's own chest, so everything made for it fits. From DD up they're drawn." }),
        BREAST_SLIDERS.map(([k, label, min, max, step]) => { const val = $("span", { className: "fh-val", textContent: String(BREAST[k]) });
          return $("div", { className: "fh-slide" }, $("label", { textContent: label }), $("input", { type: "range", min, max, step, value: BREAST[k], disabled: !drawn, oninput: (e) => { BREAST[k] = Number(e.target.value); val.textContent = String(BREAST[k]); bellyDraw(); } }), val); }),
        $("div", { className: "row" }, $("label", { textContent: "Catalogue a slot (saved as pictures):" }),
          (() => { const sel = $("select", {}, CAT_SLOTS.filter((gn) => Asset.some((a) => a.Group.Name === gn)).map((gn) => $("option", { value: gn, textContent: gn.replace(/([a-z])([A-Z0-9])/g, "$1 $2") })));
            return [sel, $("button", { type: "button", textContent: "Make the catalogue", title: "Every piece in the slot, on her as she is now, twelve to a page, saved in studio\\catalogue", onclick: () => catalogue(sel.value) }), $("button", { type: "button", textContent: "Only its Echo items", title: "The same, for the Echo clothing mod's items in this slot (load the mod first)", onclick: () => (S.echoFrom != null ? catalogue(sel.value, { echo: true }) : say("Load the Echo clothing mod first (the button under the outfit code).", true)) })]; })()),
        $("div", { className: "row" }, $("label", { textContent: "See a whole slot at this size:" }),
          (() => { const sel = $("select", {}, ["Cloth", "ClothOuter", "ClothAccessory", "Bra", "Suit", "Corset", "Necklace", "ItemBreast", "ItemTorso", "ItemTorso2", "ItemArms", "ItemNipples", "ItemNipplesPiercings", "ItemNeckAccessories", "ItemNeckRestraints"].filter((gn) => Asset.some((a) => a.Group.Name === gn)).map((gn) => $("option", { value: gn, textContent: gn.replace(/([a-z])([A-Z0-9])/g, "$1 $2") })));
            return [sel, $("button", { type: "button", textContent: "Show the sheet", title: "Tries on every piece in the slot and shows them side by side", onclick: () => chestAudit(sel.value) })]; })()),
        $("div", { className: "row" },
          $("button", { type: "button", className: "go", textContent: "Save the breasts", onclick: saveBreasts }),
          $("button", { type: "button", textContent: "Put the saved ones back", onclick: () => loadBreasts(true) }),
          $("button", { type: "button", textContent: "Copy for the Companion", title: "Your cup, breast sliders, belly and piece choices as one code, to paste into the Companion (Toggles, Drawn body)", onclick: copyForCompanion }),
          $("button", { type: "button", className: BREAST.tuck ? "on" : "", textContent: BREAST.tuck ? "Hands: tucked behind when they're big" : "Hands: in front, as the game draws them", title: "Tucking hides her hands, and what's on her hands and wrists, once the breasts would cover most of them", onclick: () => { BREAST.tuck = !BREAST.tuck; fill(); bellyDraw(); } }),
          $("button", { type: "button", className: BREAST.dress ? "on" : "", textContent: BREAST.dress ? "Clothes a size up: on" : "Clothes a size up: off", title: "What's worn over the chest is drawn a size up, and the breasts take its shape", onclick: () => { BREAST.dress = !BREAST.dress; fill(); bellyDraw(); } }),
          $("button", { type: "button", textContent: "Sliders back to plain", onclick: () => { Object.assign(BREAST, { full: 1, hang: 1, apart: 1, x: 0, y: 0, nip: 1, nipY: 0, nipX: 0 }); fill(); bellyDraw(); } }))].flat(Infinity));
    };
    BREAST.fill = fill; fill();
    return box;
  }

  // ── parts the game draws itself ──
  // The words on a pet sign, body writing, a name tag, a number on a collar: those aren't pictures. The item's own
  // code writes them onto a little canvas and hands that to the game, and the game's move/stretch/turn settings are
  // only read for pictures. So those parts sat still while the rest of the piece moved (Laynie, Oct 12: "text from body
  // writing, the pet sign, etc arent being sized up or down, or even moved"). Here the studio steps in where the game
  // calls an item's own drawing code and gives it a brush that reads the same settings the pictures get.
  function hookDrawn() {
    const game = CommonCallFunctionByNameWarn;
    const num = (v) => (typeof v === "number" && !Number.isNaN(v) ? v : undefined);
    const fitFor = (item, layer) => {
      const p = (item && item.Property) || {}, of = (k) => num(p[k]), lay = (k) => num((p["Layer" + k] || {})[layer || ""]);
      const add = (k) => (of(k) || 0) + (lay(k) || 0), mul = (k) => Math.max(0.01, Math.min(3, (of(k) == null ? 1 : of(k)) * (lay(k) == null ? 1 : lay(k))));
      return { TranslationX: add("TranslationX"), TranslationY: add("TranslationY"), ScaleX: mul("ScaleX"), ScaleY: mul("ScaleY"), Rotation: Math.max(-180, Math.min(180, add("Rotation"))) };
    };
    // How big the piece's own pictures are, by item name. A picture is stretched from its top left corner and turned
    // about its middle, so the words have to be laid on a sheet the same size as the piece's picture and that sheet
    // stretched and turned, or they'd slide off the sign as it shrinks.
    const frames = new Map(), drawGL = GLDrawImage;
    GLDrawImage = function (source, gl, ...rest) {
      const out = drawGL.call(this, source, gl, ...rest);
      try { if (typeof source === "string") { const file = source.slice(source.lastIndexOf("/") + 1), nm = file.split("_")[0].replace(/.png$/, ""); if (!frames.has(nm)) { const tex = GLDrawLoadImage(gl, source); if (tex && tex.width) frames.set(nm, { w: tex.width, h: tex.height }); } } } catch (e) { /* only a measurement */ }
      return out;
    };
    CommonCallFunctionByNameWarn = function (name, data, ...rest) {
      try {
        const gl = typeof GLDrawCanvas !== "undefined" && GLDrawCanvas && GLDrawCanvas.GL;
        if (gl && typeof name === "string" && name.endsWith("AfterDraw") && data && data.C === S.C && data.CA && typeof data.drawCanvas === "function") {
          const t = fitFor(data.CA, data.L);
          if (t.TranslationX || t.TranslationY || t.Rotation || t.ScaleX !== 1 || t.ScaleY !== 1) {
            // (drawn the way the game draws a moved picture: placed at the moved spot, with the settings passed along too)
            const fr = frames.get(data.A && data.A.Name);
            const brush = (offset) => (img, x, y, alphaMasks, maskLayers) => {
              const o = Object.assign({ AlphaMasks: alphaMasks, TextureAlphaMask: maskLayers }, t);
              if (!fr) return drawGL(img, gl, x + t.TranslationX, y + t.TranslationY, o, offset);   // no picture to go by: about its own corner
              const sheet = document.createElement("canvas"); sheet.width = fr.w; sheet.height = fr.h;
              sheet.getContext("2d").drawImage(img, Math.round(x - data.X), Math.round(y - data.Y));
              return drawGL(sheet, gl, data.X + t.TranslationX, data.Y + t.TranslationY, o, offset);
            };
            data = Object.assign({}, data, { drawCanvas: brush(0), drawCanvasBlink: brush(500) });
          }
        }
      } catch (e) { console.warn("[studio] drawn parts:", e); }
      return game.call(this, name, data, ...rest);
    };
  }
  const bellyDraw = () => { try { CharacterLoadCanvas(S.C); } catch (e) { console.warn("[studio] belly redraw:", e); } };
  function bellyPanel() {
    const box = $("div", { id: "fh-belly" });
    const fill = () => {
      const fit = fitNow(), key = poseKey();
      box.replaceChildren(...[
        $("p", { className: "note", textContent: "This fit is for: " + POSE_KEYS[key] + ". Change the pose above and the sliders switch to that pose's own fit." }),
        $("div", { className: "row" },
          $("button", { type: "button", className: fit.on ? "on" : "", textContent: fit.on ? "Belly: showing" : "Belly: hidden", onclick: () => { fit.on = !fit.on; fill(); bellyDraw(); } }),
          [["Small", 50, 54, 0.16], ["Medium", 70, 80, 0.22], ["Large", 92, 112, 0.28]].map(([n, rx, ry, sag]) => $("button", { type: "button", textContent: n, title: "Start from the " + n.toLowerCase() + " shape", onclick: () => { Object.assign(fit, { on: true, rx, ry, sag }); fill(); bellyDraw(); } })),
          $("button", { type: "button", className: fit.behind ? "on" : "", textContent: fit.behind ? "Behind the chest" : "In front, over the skin", title: "Whether it is drawn before the upper body (behind it) or after all the skin", onclick: () => { fit.behind = !fit.behind; fill(); bellyDraw(); } }),
          $("button", { type: "button", className: BELLY.auto !== false ? "on" : "", textContent: BELLY.auto !== false ? "Clothes cover it: on" : "Clothes cover it: off", title: "Whatever is worn over the belly is grown sideways to cover it. A piece can be set its own way under Mould to the body.", onclick: () => { BELLY.auto = BELLY.auto === false; MOULD.out.clear(); BREAST.out.clear(); fill(); bellyDraw(); } }),
          $("button", { type: "button", className: fit.flat ? "on" : "", textContent: fit.flat ? "Pressed flat underneath" : "Hanging free", title: "Flat underneath, for a belly resting on the ground", onclick: () => { fit.flat = !fit.flat; fill(); bellyDraw(); } })),
        SLIDERS.map(([k, label, min, max, step]) => { const val = $("span", { className: "fh-val", textContent: String(fit[k]) });
          return $("div", { className: "fh-slide" }, $("label", { textContent: label }), $("input", { type: "range", min, max, step, value: fit[k], oninput: (e) => { fit[k] = Number(e.target.value); val.textContent = String(fit[k]); bellyDraw(); } }), val); }),
        $("div", { className: "row" },
          $("button", { type: "button", className: "go", textContent: "Save all the fits", onclick: saveFits }),
          $("button", { type: "button", textContent: "Put the saved ones back", onclick: () => loadFits(true) }))].flat(Infinity));
    };
    BELLY.fill = fill; fill();
    return box;
  }
  async function saveFits() {
    try { const r = await fetch("/__studio/fits/belly.json", { method: "POST", body: JSON.stringify({ v: 1, saved: new Date().toISOString(), fits: BELLY.fits }, null, 1) }); if (!r.ok) throw new Error(await r.text()); say("Saved to studio\\fits\\belly.json: a fit each for standing, all fours and hogtied."); }
    catch (e) { say("It didn't save: " + (e && e.message || e), true); }
  }
  async function loadFits(tell) {
    try {
      const d = await (await fetch("/__studio/fits/belly.json", { cache: "no-store" })).json();
      if (d && d.fits) { for (const k of Object.keys(BELLY.fits)) if (d.fits[k]) Object.assign(BELLY.fits[k], d.fits[k]); if (BELLY.fill) BELLY.fill(); bellyDraw(); if (tell) say("The saved fits are back."); }
      else if (tell) say("Nothing has been saved yet.");
    } catch (e) { if (tell) say("I couldn't read the saved fits: " + (e && e.message || e), true); }
  }

  // ── the Echo clothing mod ──
  // Its items are added while the game runs, so to try them on here the studio loads the mod itself, from its own site (the
  // address in its README, the same script installed in the game). It needs the internet; nothing else in the studio does.
  // Only when the button is pressed. Its pictures come from its site too, and the drawing reads them like any other.
  const ECHO_URL = "https://sugarchain-studio.github.io/echo-clothing-ext/bc-cloth.user.js";
  function loadEcho() {
    const btn = document.getElementById("fh-echo"); if (S.echo) return say("The Echo clothing mod is already loaded.");
    S.echo = true; if (btn) btn.disabled = true; const before = Asset.length; S.echoFrom = before; say("Loading the Echo clothing mod…");
    // (the mod is made for the live game, which is a version behind the copy the studio draws with, and it reaches for game
    // functions the newer game has dropped or renamed: missing, it stops before adding a thing. Stand-ins, never called by
    // this game, let it start. The list is the functions the mod steps into, from its own code.)
    const ECHO_NEEDS = "ActivityCheckPrerequisites ActivityOrgasmStart ActivityOrgasmStop AppearancePreviewUseCharacter AssetBuildDescription AssetBuildExtended AssetGet AssetLoadAll AssetTextGet CharacterAppearanceGetCurrentValue CharacterAppearanceValidate CharacterAppearanceVisible CharacterCheckHooks CharacterLoadCanvas CharacterSetFacialExpression ChatRoomCanBeLeashedBy ChatRoomCharacterViewDraw ChatRoomDrawCharacterStatusIcons ChatRoomMessage ChatRoomPingLeashedPlayers ChatRoomPublishAction ChatRoomPublishCustomAction ChatRoomSync ChatRoomSyncMemberJoin ChatRoomUpdateDisplay CommonDrawCanvasPrepare CommonDrawComputeDrawingCoordinates CommonDrawResolveAssetPose CraftingSaveServer DialogInventoryAdd DialogInventoryBuild DialogMenuButtonBuild DrawAssetPreview DrawCharacter DrawCharacterSegment DrawRefreshCharacterForImage GLDrawAppearanceBuild GLDrawLoad GLDrawLoadImage GLDrawLoadTextureAlphaMask InterfaceTextGet InventoryAvailable InventoryGetRandom InventoryItemHasEffect InventorySetPermission InventoryWear ItemColorLoad LoginDoNextThankYou LoginPerformCraftingFixups LoginResponse PreferenceArousalAtLeast ServerAccountBeep ServerSend TranslationAssetProcess ValidationResolveAppearanceDiff ValidationResolveRemoveDiff ValidationResolveSwapDiff".split(" ");
    const missing = ECHO_NEEDS.filter((n) => typeof window[n] !== "function");
    if (missing.length) { const sh = document.createElement("script"); sh.textContent = missing.map((n) => "function " + n + "() {}").join("; "); document.head.append(sh); console.info("[studio] stand-ins for the Echo mod:", missing.join(", ")); }
    // (its pictures come through the studio's own server: the game copy here asks the mod's site for them in a way the site
    // refuses from a page, and every Echo piece, and the parts of the body it redraws, came out missing)
    if (!window.__echoFetch) { const f0 = window.fetch.bind(window), CDN = "https://cdn.jsdelivr.net/gh/SugarChain-Studio/echo-clothing-ext@";
      window.__echoFetch = true; window.fetch = (u, o) => { const url = typeof u === "string" ? u : u && u.url; if (url && url.startsWith(CDN)) { const rest = url.slice(CDN.length), at = rest.indexOf("/resources/"); if (at > 0) return f0("/__echo/" + rest.slice(0, at) + "/" + rest.slice(at + "/resources/".length), { cache: "default" }); } return f0(u, o); }; }
    // (and it changes how the game's fast drawing works, in ways made for the live game: on this newer copy the body came out
    // in scrambled pieces. The game's plain drawing is untouched by it, so the studio draws that way once Echo is in.)
    // (it switches the fast drawing back on as it starts, so this is done again once it's in)
    // (not with the live game's own files: Echo is made for that version, and draws there as it does in the game)
    const plain = () => { if (!window.__studioLive && typeof GLVersion !== "undefined" && GLVersion !== "No WebGL") { GLVersion = "No WebGL"; try { redraw(); } catch (e) { /* not ready */ } } };
    plain();
    const el = document.createElement("script"); el.src = ECHO_URL + "?t=" + Date.now(); el.onerror = () => { S.echo = false; if (btn) btn.disabled = false; say("The Echo clothing mod didn't load (no internet, or its site is down).", true); };
    el.onload = () => { let n = 0; const tick = () => { n++; const added = Asset.length - before; plain(); if (added > 0 && n > 6) { say("Echo clothing mod loaded: " + added + " items added. They're in each slot's list."); try { fillItems(); } catch (e) { /* not yet */ } return; } if (n > 60) { say(added > 0 ? "Echo clothing mod loaded: " + added + " items." : "The Echo script loaded but added no items yet. Give it a moment and look in the slot lists.", !added); return; } setTimeout(tick, 500); }; tick(); };
    document.head.append(el);
  }
  // ── the panel ──
  const buttons = [];   // [el, isOn()]
  const toggle = (label, isOn, act) => { const el = $("button", { type: "button", textContent: label, onclick: () => { try { act(); } catch (e) { say(String(e && e.message || e), true); } } }); buttons.push([el, isOn]); return el; };
  function syncButtons() { for (const [el, isOn] of buttons) { let on = false; try { on = !!isOn(); } catch (e) { /* not yet */ } el.classList.toggle("on", on); } }
  function panel() {
    const box = $("textarea", { id: "fh-code", placeholder: "Paste an outfit code here (WCE: /exportlooks, or BCX's export). A plain JSON list works too." });
    const sizes = (group, list) => list.map((n) => toggle(n.replace(/([a-z])([A-Z])/g, "$1 $2"), () => (bodyItem(group) || {}).Asset && bodyItem(group).Asset.Name === n, () => setBody(group, n)));
    const root = $("div", { id: "fh-studio" },
      $("h1", { textContent: "B&B outfit studio" }),
      $("p", { className: "note", textContent: "Offline, on this computer only. The game's own drawing, signed in to nothing." }),
      $("h2", { textContent: "Outfit code" }), box,
      $("div", { className: "row" },
        $("button", { type: "button", className: "go", textContent: "Put it on", onclick: () => { try { const n = wear(decode(box.value)); say(n + " pieces put on."); } catch (e) { say(String(e && e.message || e), true); } } }),
        $("button", { type: "button", textContent: "Copy this look as a code", onclick: async () => { const code = encode(S.C); box.value = code; try { await navigator.clipboard.writeText(code); say("Copied. Paste it into the game with WCE's /importlooks or BCX's import."); } catch (e) { say("It's in the box above: select it and copy."); } } }),
        $("button", { type: "button", textContent: "Strip to bare", onclick: () => { CharacterNaked(S.C, false); redraw(); say("Bare."); } }),
        $("button", { type: "button", textContent: "Start over", onclick: () => { CharacterAppearanceSetDefault(S.C); redraw(); say("Back to the game's plain starting look."); } })),
      $("div", { className: "row" },
        $("button", { type: "button", id: "fh-echo", textContent: "Load the Echo clothing mod", title: "Adds the Echo clothing mod's items, from its own site (the same script you install in the game). Needs the internet; nothing else here does.", onclick: loadEcho })),
      $("div", { id: "fh-say" }),
      $("h2", { textContent: "Try something on" }),
      $("div", { className: "row" },
        $("select", { id: "fh-slot", onchange: () => fillItems() }, slots().map(([label, groups]) => $("optgroup", { label }, groups.map((g) => $("option", { value: g.Name, textContent: slotName(g) + "  (" + g.Name + ")" }))))),
        $("input", { id: "fh-find", type: "search", placeholder: "find…", oninput: () => fillItems() })),
      $("p", { className: "note", id: "fh-count" }),
      $("div", { className: "row", id: "fh-items" }),
      $("div", { className: "row" }, $("label", { textContent: "Colour what's on in this slot:" }),
        $("input", { id: "fh-colour", type: "color", value: "#c9577a", onchange: (e) => tint(document.getElementById("fh-slot").value, e.target.value) }),
        $("button", { type: "button", textContent: "Game's own colours", onclick: () => tint(document.getElementById("fh-slot").value, "Default") })),
      $("h2", { textContent: "Farm equipment" }), farmPanel(),
      $("h2", { textContent: "Wearing now" }), $("div", { className: "row", id: "fh-worn" }),
      $("div", { id: "fh-fit" }),
      $("h2", { textContent: "Breasts" }), breastPanel(),
      $("h2", { textContent: "Belly" }), bellyPanel(),
      $("h2", { textContent: "Between the legs" }), genPanel(),
      $("h2", { textContent: "Chest" }), $("div", { className: "row" }, sizes("BodyUpper", ["FlatSmall", "FlatMedium", "Small", "Normal", "Large", "XLarge"])),
      $("h2", { textContent: "Hips and legs" }), $("div", { className: "row" }, sizes("BodyLower", ["Small", "Normal", "Large", "XLarge"])),
      $("h2", { textContent: "Skin" }), $("div", { className: "row" }, ["White", "Asian", "Black"].map((t) => toggle(t, () => { const u = bodyItem("BodyUpper"); const c = u && (Array.isArray(u.Color) ? u.Color[0] : u.Color); return c === t; }, () => setSkin(t)))),
      POSES.map(([label, list]) => [$("h2", { textContent: "Pose: " + label.toLowerCase() }), $("div", { className: "row" }, list.map((p) => toggle(p.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^Base (Upper|Lower)$/, "Relaxed"), () => poseOn(p), () => setPose(p))))]));
    document.body.append(root);
    document.body.append($("button", { id: "fh-done", type: "button", textContent: "Done: back to the studio", onclick: () => configureDone() }));
    document.getElementById("fh-slot").value = "ItemNipples";
    fillItems(); fillWorn();
    syncButtons();
  }

  // ── the farm's equipment, as presets (Laynie, Oct 15: "added the farm items to the studio as presets, so i can view
  // each set without having to wait in game to trigger") ──
  // farm-presets.json is written by tools/farm-presets.mjs from the bot itself: every trap's gear, the mystery box, the
  // livin' suit by stage, and every mess colour. A piece goes where the Companion would put it: the first of its groups
  // that's free (or the one it's already in), as the first of its items this game has.
  const FARM = { data: null, on: [] };
  async function farmLoad() { try { FARM.data = await (await fetch("/__studio/farm-presets.json", { cache: "no-store" })).json(); } catch (e) { FARM.data = { sets: [], messes: [] }; } }
  function farmOff() {
    let n = 0;
    for (const p of FARM.on) { const it = worn(p.group); if (it && it.Asset.Name === p.item) { InventoryRemove(S.C, p.group, false); n++; } }
    FARM.on = []; redraw(); return n;
  }
  function farmWear(set) {
    farmOff();
    const got = [], missed = [];
    for (const p of set.pieces) {
      const group = p.groups.find((g) => !worn(g)) || p.groups[0];
      const item = p.items.find((n) => { try { return !!AssetGet(S.C.AssetFamily, group, n); } catch (e) { return false; } });
      if (!item) { missed.push(p.label); continue; }
      InventoryWear(S.C, item, group, null, null, null, null, false);
      const it = worn(group);
      if (!it || it.Asset.Name !== item) { missed.push(p.label); continue; }
      if (p.color) it.Color = Array.isArray(p.color) ? p.color.slice() : ((it.Asset.Layer || []).filter((l) => l.AllowColorize !== false).length > 1 ? (it.Asset.Layer || []).filter((l) => l.AllowColorize !== false).map(() => p.color) : p.color);
      FARM.on.push({ group, item }); got.push(p.label + " (" + item + ")");
    }
    redraw();
    say(set.name + ": " + (got.length ? got.join(", ") : "nothing") + (missed.length ? ". Not in this game: " + missed.join(", ") : "") + ".", !got.length);
  }
  // a mess: the game's Splatters in its colour, on the face, chest and tummy (the Companion's own splatters come later)
  function farmMess(m) {
    const group = ["Mask", "FaceMarkings", "BodyMarkings"].find((g) => !worn(g)) || "BodyMarkings";
    InventoryWear(S.C, "Splatters", group, null, null, null, null, false);
    const it = worn(group); if (!it || it.Asset.Name !== "Splatters") { say("The game wouldn't put Splatters on there.", true); return; }
    it.Color = m.color; it.Property = Object.assign({}, it.Property || {}, { TypeRecord: { d: 1, e: 1, g: 1, h: 1, i: 1, k: 1, l: 1, m: 1 } });
    FARM.on.push({ group, item: "Splatters" }); redraw();
    say("Mess: " + m.name + (m.traps.length ? " (left by " + m.traps.join(", ") + ")" : "") + ".");
  }
  function farmPanel() {
    const box = $("div", {}, $("p", { className: "note", textContent: "Loading the farm's equipment…" }));
    farmLoad().then(() => {
      const D = FARM.data, groups = [...new Set(D.sets.map((x) => x.group))];
      box.replaceChildren(
        $("p", { className: "note", textContent: "Every set the farm puts on somebody, as the Companion would. Read from the bot (tools/farm-presets.mjs)." }),
        $("div", { className: "row" },
          $("select", { id: "fh-farmset" }, groups.map((g) => $("optgroup", { label: g }, D.sets.map((x, i) => x.group === g ? $("option", { value: String(i), textContent: x.name }) : null)))),
          $("button", { type: "button", className: "go", textContent: "Put the set on", onclick: () => farmWear(D.sets[Number(document.getElementById("fh-farmset").value)]) }),
          $("button", { type: "button", textContent: "Take the farm's pieces off", onclick: () => say(farmOff() + " pieces off.") })),
        $("p", { className: "note", textContent: "Messes:" }),
        $("div", { className: "row" }, D.messes.map((m) => $("button", { type: "button", textContent: m.name, style: "border-left: 14px solid " + m.color, onclick: () => farmMess(m) }))));
    });
    return box;
  }

  // where she starts in her own canvas: Echo widens it, and with the live game's files it centres her in the width
  const charX = () => (window.__studioLive && S.C && S.C.Canvas && S.C.Canvas.width > 500 ? (S.C.Canvas.width - 500) / 2 : 0);
  // ── our screen, in place of the game's sign-in screen ──
  function run() {
    DrawRect(0, 0, 2000, 1000, "#2a2e36");
    // (Echo widens every character's canvas, to 1000 from 500, and draws it half that much further left to make up: she
    // jumped to the left once it was loaded. Laynie, Oct 14. She's put back where she stands.)
    if (S.C) DrawCharacter(S.C, 290 + (S.echo && !window.__studioLive && S.C.Canvas && S.C.Canvas.width > 500 ? (S.C.Canvas.width - 500) / 2 : 0), 0, 1, false);   /* (with the live game's files Echo puts her right itself) */
  }
  function takeOver() {
    try { CurrentScreenFunctions.Unload && CurrentScreenFunctions.Unload(); } catch (e) { console.warn("[studio] leaving the sign-in screen:", e); }
    for (const el of document.querySelectorAll("body > *")) if (el.id !== "MainCanvas" && el.id !== "fh-studio" && el.tagName !== "SCRIPT" && el.tagName !== "LINK") el.style.display = "none";   // the sign-in form
    const none = () => {};
    document.body.classList.add("fh-studio-on");   // (studio.css hides the sign-in form, however late the game adds it)
    CurrentScreen = "FarmStudio";
    CurrentScreenFunctions = { Run: run, Draw: none, Click: none, MouseDown: none, MouseUp: none, MouseMove: none, MouseWheel: none, Load: async () => {}, Unload: none, Resize: none, KeyDown: () => false, KeyUp: () => false, Exit: none, Paste: none };
    try { hookDrawn(); } catch (e) { console.warn("[studio] drawn parts:", e); }
    if (window.FarmBelly) hookBelly(); else console.warn("[studio] the belly drawing didn't load: no belly section");
    S.C = CharacterLoadSimple("FarmStudio");
    // (a character made here has no arousal settings, which a signed-in one always has. A piece that reads them when it
    // draws, Echo's Portable Breast Pump, failed, and the whole character vanished with it. Laynie, Oct 14.)
    try { if (typeof PreferenceArousalUpdateValidation === "function" && !PreferenceArousalSettingsDefault.Zone) PreferenceArousalUpdateValidation(); } catch (e) { /* the plain defaults below */ }
    if (!S.C.ArousalSettings || typeof S.C.ArousalSettings.Zone !== "string") S.C.ArousalSettings = Object.assign(JSON.parse(JSON.stringify(typeof PreferenceArousalSettingsDefault === "object" ? PreferenceArousalSettingsDefault : {})), { Active: "Inactive" });
    for (const k of ["Zone", "Activity", "Fetish"]) if (typeof S.C.ArousalSettings[k] !== "string") S.C.ArousalSettings[k] = "";
    CharacterAppearanceSetDefault(S.C);
    CharacterRefresh(S.C, false, false);
    panel(); S.ready = true; loadFits(false); loadItemFits(); loadBreasts(false);
    // the stamps cut from Laynie's references (studio/web/_stamps, never in the repo): as each kind's come in, draw again
    if (window.FarmCock && FarmCock.loadStamps) FarmCock.loadStamps("/__studio/_stamps/", () => { GEN.cvKey = ""; bellyDraw(); if (GEN.fill) GEN.fill(); });
    window.FarmStudio = { S, wear, decode, encode, setBody, setSkin, setPose, redraw, putOn, tint, slots, BELLY, bellyDraw, saveFits, loadFits, FIT, select, saveFit, fitSet, fitDraw, orderSet, orderNow, colourSet, colourLayers, configure, configureDone, stashFits, MOULD, BREAST, catalogue, CAT_SLOTS, GEN, genSet, genHardSet, genFit, chestAudit, setCup, cupNow, saveBreasts, loadBreasts };   // for poking at from the console
    say("Ready. Paste an outfit code, or change the body and pose below.");
  }
  let tries = 0;
  (function wait() {
    tries++;
    let ok = false;
    try { ok = typeof CurrentScreen === "string" && CurrentScreen === "Login" && typeof Player === "object" && !!Player && Array.isArray(Asset) && Asset.length > 100 && typeof CurrentScreenFunctions === "object" && !!CurrentScreenFunctions; } catch (e) { ok = false; }
    if (ok) { try { takeOver(); } catch (e) { console.error("[studio] couldn't start:", e); document.body.append($("div", { id: "fh-studio" }, $("h1", { textContent: "B&B outfit studio" }), $("p", { className: "bad", textContent: "It couldn't start: " + (e && e.message || e) }))); } return; }
    if (tries > 400) { document.body.append($("div", { id: "fh-studio" }, $("h1", { textContent: "B&B outfit studio" }), $("p", { className: "bad", textContent: "The game's own start-up never finished, so there's nothing to draw with. Check the server window for which game folder it is using." }))); return; }
    setTimeout(wait, 150);
  })();
})();
