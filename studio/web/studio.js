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
        $("button", { type: "button", className: MOULD.items.has(mouldKey(it)) ? "on" : "", textContent: MOULD.items.has(mouldKey(it)) ? "Moulded to the body: on" : "Mould to the body", title: "Redraws this piece to follow the outline of the body, belly and all", onclick: () => { const k = mouldKey(it); if (MOULD.items.has(k)) MOULD.items.delete(k); else MOULD.items.add(k); MOULD.out.clear(); bellyDraw(); fillFit(); if (MOULD.items.has(k) && !fitNow().on) say("It's marked. The moulding shows once the belly is showing: there's nothing to mould to yet."); } }),
        $("span", { className: "note", textContent: MOULD.items.has(mouldKey(it)) ? "It follows the body's outline. The sliders still work on top." : "Follows the outline where the sliders can't: wide where the belly is, untouched where it isn't." })),
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
    try { const r = await fetch("/__studio/fits/items.json", { method: "POST", body: JSON.stringify({ v: 1, saved: new Date().toISOString(), note: "key: slot/item|chest+hips|pose · mould: slot/item pieces redrawn to the body's outline", fits: FIT.saved, mould: Array.from(MOULD.items) }, null, 1) }); if (!r.ok) throw new Error(await r.text());
      say("Saved the fit for " + itemName(it.Asset) + " on this body in this pose. " + Object.keys(FIT.saved).length + " fits kept in studio\\fits\\items.json."); fillFit(); }
    catch (e) { say("It didn't save: " + (e && e.message || e), true); }
  }
  async function loadItemFits() { try { const d = await (await fetch("/__studio/fits/items.json", { cache: "no-store" })).json(); if (d && Array.isArray(d.mould)) for (const k of d.mould) MOULD.items.add(k);
      if (d && d.fits) { FIT.saved = d.fits; applyAllSaved(); fitRefresh(); fillFit(); } } catch (e) { /* none yet */ } }

  // ── the belly ──
  // A fit for each pose: where it sits and what shape it is. "std" is standing, kneeling and every arms pose (the torso
  // is in the same place in all of them). Saved to studio/fits/belly.json by the Save button.
  const POSE_KEYS = { std: "Standing, kneeling, arms poses", AllFours: "All fours", Hogtied: "Hogtied" };
  const FIT0 = () => ({ on: false, rx: 70, ry: 80, sag: 0.22, x: 0, y: 0, behind: false, flat: false, cut: 0.74 });
  const BELLY = { fits: { std: FIT0(), AllFours: Object.assign(FIT0(), { behind: true, y: -60 }), Hogtied: Object.assign(FIT0(), { behind: true, y: -75 }) }, skin: new Map() };
  const SLIDERS = [["rx", "Width", 20, 170, 1], ["ry", "Height", 20, 190, 1], ["sag", "Hang (how low the weight sits)", 0, 0.5, 0.01], ["x", "Left / right", -120, 120, 1], ["y", "Up / down", -200, 200, 1], ["cut", "Ground line (when pressed flat)", 0.2, 1, 0.01]];
  const poseKey = () => { const m = S.C && S.C.PoseMapping || {}; const all = Object.values(m).concat(S.C && S.C.Pose || []); return all.includes("AllFours") ? "AllFours" : all.includes("Hogtied") ? "Hogtied" : "std"; };
  const fitNow = () => BELLY.fits[poseKey()];
  // the body's own colour, out of its picture (and the game's tint for a custom colour), as the Companion works it out
  function bellySkin(src, hex, pose) {
    const key = src + "|" + (hex || ""), v = BELLY.skin.get(key);
    if (Array.isArray(v)) return v;
    const guess = /_Black\./.test(src) ? FarmBelly.FALLBACK.Black : /_Asian\./.test(src) ? FarmBelly.FALLBACK.Asian : FarmBelly.FALLBACK.White;
    if (!v) {
      BELLY.skin.set(key, "loading");
      const img = new Image();
      img.onload = () => {
        let c = guess;
        try {
          const at = FarmBelly.skinPatch(pose), cv = document.createElement("canvas"); cv.width = 48; cv.height = 40;
          const g = cv.getContext("2d"); g.drawImage(img, -at[0], -at[1]);
          const d = g.getImageData(0, 0, 48, 40).data, good = [];
          for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200 && d[i] + d[i + 1] + d[i + 2] > 90 && Math.min(d[i], d[i + 1], d[i + 2]) < 238) good.push([d[i], d[i + 1], d[i + 2]]);
          if (good.length >= 40) { good.sort((m, n) => (m[0] + m[1] + m[2]) - (n[0] + n[1] + n[2])); const p = good[Math.floor(good.length * 0.7)]; c = hex ? [1, 3, 5].map((i) => Math.min(255, parseInt(hex.slice(i, i + 2), 16) * (p[0] + p[1] + p[2]) / 383)) : p; }
        } catch (e) { /* keep the guess */ }
        BELLY.skin.set(key, c); try { CharacterLoadCanvas(S.C); } catch (e) { /* next redraw */ }
      };
      img.onerror = () => BELLY.skin.set(key, guess);
      img.src = src;
    }
    return guess;
  }
  // step into the game's drawing of our character and lay the belly in: after all the skin, or before the upper body
  // ── moulded to the body ──
  // A slider can only move or stretch a whole piece evenly, and a belly isn't even: narrow at the ribs, wide lower
  // down. A MOULDED piece is redrawn to follow the outline instead. For every row of pixels we know where the body's
  // edges were (the game's body pictures) and where they are now (those, plus the belly). Each row of the piece is
  // then redrawn in three parts: the stretch across the body is widened to the new edges, and what hangs outside the
  // body on either side is moved out with the edge, so it stays attached. Rows the belly doesn't reach are untouched.
  // It follows the outline as seen from the front. It doesn't paint a bulge onto the piece.
  const MOULD = { items: new Set(), img: new Map(), prof: new Map(), out: new Map(), M: 150 };
  const mouldKey = (it) => it.Asset.Group.Name + "/" + it.Asset.Name;
  function mouldImg(src) {
    let e = MOULD.img.get(src);
    if (!e) { e = { img: new Image(), ok: false }; e.img.onload = () => { e.ok = true; clearTimeout(MOULD.t); MOULD.t = setTimeout(bellyDraw, 60); }; e.img.onerror = () => { e.bad = true; }; e.img.src = src; MOULD.img.set(src, e); }
    return e.ok ? e.img : null;
  }
  // the left and right edge of what's drawn on each row of a picture (-1 where the row is empty)
  function edges(source, w, h) {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(source, 0, 0);
    const d = g.getImageData(0, 0, w, h).data, L = new Int16Array(h).fill(-1), R = new Int16Array(h).fill(-1);
    for (let y = 0; y < h; y++) { let l = -1, r = -1; const o = y * w * 4; for (let x = 0; x < w; x++) if (d[o + x * 4 + 3] > 60) { if (l < 0) l = x; r = x; } L[y] = l; R[y] = r; }
    return { L, R, w, h };
  }
  function edgesOf(src) { let p = MOULD.prof.get(src); if (p) return p; const im = mouldImg(src); if (!im) return null; p = edges(im, im.naturalWidth, im.naturalHeight); MOULD.prof.set(src, p); return p; }
  // ctx: { bodies: [{ src, x, y }], belly: { cv, dx, dy } }. Gives the body's edges on a row of the screen, before and after.
  function outline(ctx) {
    const parts = []; for (const b of ctx.bodies) { const p = edgesOf(b.src); if (!p) return null; parts.push({ p, x: b.x, y: b.y }); }
    const bp = ctx.belly.prof || (ctx.belly.prof = edges(ctx.belly.cv, ctx.belly.cv.width, ctx.belly.cv.height));
    const row = (yy, withBelly) => {
      let l = Infinity, r = -Infinity;
      for (const q of parts) { const j = yy - Math.round(q.y); if (j >= 0 && j < q.p.h && q.p.L[j] >= 0) { l = Math.min(l, q.x + q.p.L[j]); r = Math.max(r, q.x + q.p.R[j]); } }
      if (l === Infinity) return null;
      if (withBelly) { const j = yy - Math.round(ctx.belly.dy); if (j >= 0 && j < bp.h && bp.L[j] >= 0) { l = Math.min(l, ctx.belly.dx + bp.L[j]); r = Math.max(r, ctx.belly.dx + bp.R[j]); } }
      return { l, r };
    };
    return { old: (yy) => row(yy, false), neu: (yy) => row(yy, true) };
  }
  function mouldCanvas(src, x, y, ctx) {
    const im = mouldImg(src); if (!im) return null;
    const key = src + "|" + Math.round(x) + "," + Math.round(y) + "|" + ctx.sig;
    if (MOULD.out.has(key)) return MOULD.out.get(key);
    const ol = ctx.outline || (ctx.outline = outline(ctx)); if (!ol) return null;   // a body picture is still loading: try again next redraw
    const M = MOULD.M, w = im.naturalWidth, h = im.naturalHeight, c = document.createElement("canvas"); c.width = w + M * 2; c.height = h;
    const g = c.getContext("2d"); let changed = false;
    for (let j = 0; j < h; j++) {
      const yy = Math.round(y) + j, o = ol.old(yy), n = ol.neu(yy);
      if (!o || !n || (n.l >= o.l && n.r <= o.r)) { g.drawImage(im, 0, j, w, 1, M, j, w, 1); continue; }
      changed = true;
      const l0 = Math.max(0, Math.min(w - 1, Math.round(o.l - x))), r0 = Math.max(l0, Math.min(w - 1, Math.round(o.r - x))), l1 = Math.round(n.l - x), r1 = Math.round(n.r - x);
      if (l0 > 0) g.drawImage(im, 0, j, l0, 1, M + (l1 - l0), j, l0, 1);                                   // left of the body: out with the edge
      g.drawImage(im, l0, j, r0 - l0 + 1, 1, M + l1, j, r1 - l1 + 1, 1);                                   // across the body: stretched to fit
      if (r0 + 1 < w) g.drawImage(im, r0 + 1, j, w - r0 - 1, 1, M + r1 + 1, j, w - r0 - 1, 1);             // right of the body
    }
    const res = changed ? c : false;   // false: nothing on this piece overlaps the belly, draw it as the game does
    if (MOULD.out.size > 80) MOULD.out.clear(); MOULD.out.set(key, res);
    return res;
  }

  // step into the game's drawing of our character: lay the belly in (after all the skin, or before the upper body), and
  // redraw any moulded piece to the new outline
  function hookBelly() {
    const game = CommonDrawAppearanceBuild;
    CommonDrawAppearanceBuild = function (C, cb) {
      let finish = null;
      try {
        const fit = C === S.C ? fitNow() : null, real = cb;   // real: the game's own callbacks (the wrapped set below must never call itself)
        if (fit && fit.on && cb && typeof cb.drawImage === "function") {
          let upper = null, lower = false, done = false;
          const ctx = { bodies: [], belly: null, sig: "" };
          const slot = new RegExp("(?:^|/)Assets/[^/]+/([^/]+)/");
          const groupOf = (src) => { const m = slot.exec(src); return m ? m[1] : ""; };
          // (a piece's pictures are in its slot's folder or the folder of the slot it borrows its art from, named for the piece)
          const mouldList = S.C.Appearance.filter((it) => MOULD.items.has(mouldKey(it))).map((it) => ({ folders: [it.Asset.Group.Name, it.Asset.DynamicGroupName], name: it.Asset.Name }));
          const isMoulded = (src) => { if (!mouldList.length) return false; const g = groupOf(src), file = src.slice(src.lastIndexOf("/") + 1); return mouldList.some((q) => q.folders.includes(g) && file.startsWith(q.name)); };
          const gate = FarmBelly.skinGate(C);   // true once a picture comes after all the skin, genitals included
          const prio = (src) => { const g = AssetGroupGet(C.AssetFamily, groupOf(src)); return g && typeof g.DrawingPriority === "number" ? g.DrawingPriority : 99; };
          const paint = () => {
            if (done || !upper) return; done = true;
            const shape = { rx: fit.rx, ry: fit.ry, sag: fit.sag, cut: fit.cut };
            const cv = FarmBelly.bellyCanvas(shape, bellySkin(upper[2], upper[3], FarmBelly.bellyPose(upper[2])), !!fit.flat);
            // hung from just under the ribs, then moved by the sliders; pressed flat, its ground line is what the sliders place
            const dx = upper[0] + 250 - cv.width / 2 + fit.x, dy = upper[1] + 392 + fit.ry * 0.62 - cv.height / 2 + fit.y;
            real.drawImage(cv, dx, dy, {}); if (typeof real.drawImageBlink === "function") real.drawImageBlink(cv, dx, dy, {});
            ctx.belly = { cv, dx, dy };
            ctx.sig = [fit.rx, fit.ry, fit.sag, fit.cut, fit.flat ? 1 : 0, Math.round(dx), Math.round(dy)].join(",") + "|" + ctx.bodies.map((b) => b.src + "@" + Math.round(b.x) + "," + Math.round(b.y)).join(";");
          };
          const before = (src, x, y, o) => { if (done || typeof src !== "string") return; if (src.includes("/BodyUpper/") && fit.behind) { upper = [x, y, src, o && o.HexColor]; paint(); return; } if (gate ? gate(src) : (lower && prio(src) > 12)) paint(); };
          const after = (src, x, y, o) => { if (typeof src !== "string") return; if (src.includes("/BodyUpper/")) { upper = [x, y, src, o && o.HexColor]; ctx.bodies.push({ src, x, y }); } if (src.includes("/BodyLower/")) { lower = true; ctx.bodies.push({ src, x, y }); } };
          const wrap = (name) => (typeof real[name] === "function" ? (src, x, y, o) => {
            const blink = /Blink$/.test(name);
            if (!blink) { try { before(src, x, y, o); } catch (e) { console.warn("[studio] belly:", e); } }
            let drawn = false;
            try { if (ctx.belly && !fit.behind && typeof src === "string" && isMoulded(src)) { const m = mouldCanvas(src, x, y, ctx); if (m) { real[name](m, x - MOULD.M, y, o); drawn = true; } } } catch (e) { console.warn("[studio] mould:", e); }
            if (!drawn) real[name](src, x, y, o);
            if (!blink) { try { after(src, x, y, o); } catch (e) { console.warn("[studio] belly:", e); } }
          } : real[name]);
          cb = Object.assign({}, real, { drawImage: wrap("drawImage"), drawImageColorize: wrap("drawImageColorize"), drawImageBlink: wrap("drawImageBlink"), drawImageColorizeBlink: wrap("drawImageColorizeBlink") });
          finish = paint;
        }
      } catch (e) { console.warn("[studio] belly hook:", e); }
      const out = game(C, cb);
      if (finish) { try { finish(); } catch (e) { console.warn("[studio] belly:", e); } }
      return out;
    };
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
      $("h2", { textContent: "Wearing now" }), $("div", { className: "row", id: "fh-worn" }),
      $("div", { id: "fh-fit" }),
      $("h2", { textContent: "Belly" }), bellyPanel(),
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

  // ── our screen, in place of the game's sign-in screen ──
  function run() {
    DrawRect(0, 0, 2000, 1000, "#2a2e36");
    if (S.C) DrawCharacter(S.C, 290, 0, 1, false);
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
    CharacterAppearanceSetDefault(S.C);
    CharacterRefresh(S.C, false, false);
    panel(); S.ready = true; loadFits(false); loadItemFits();
    window.FarmStudio = { S, wear, decode, encode, setBody, setSkin, setPose, redraw, putOn, tint, slots, BELLY, bellyDraw, saveFits, loadFits, FIT, select, saveFit, fitSet, fitDraw, orderSet, orderNow, colourSet, colourLayers, configure, configureDone, stashFits, MOULD };   // for poking at from the console
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
