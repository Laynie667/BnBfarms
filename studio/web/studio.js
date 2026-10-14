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
  // Three ways (Laynie, Oct 13: "over, but I am sure some things might look better under"):
  //   wide:  as above, sideways only.
  //   over:  wide, and LONGER. What a belly does to a crotch chain is hang past the end of it. The part of the piece
  //          from where the belly starts down to the piece's own end is stretched so it ends at the belly's underside.
  //          Every layer of a piece is stretched by the same amount (ext: the piece's top and bottom, over all its layers).
  //   under: the piece stays on the body where it was and the belly hangs in front: the belly's shape is cut out of it.
  const MOULD = { ver: 0, lies: new Set(), span: new Map(), cover: new Map(), items: new Set(), mode: new Map(), ext: new Map(), img: new Map(), prof: new Map(), out: new Map(), M: 150 };
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
  // how much of the middle of the belly a picture covers (0 to 1): a collar or a shoe doesn't, a dress does
  function bellyCover(src, x, y, ctx) {
    const im = mouldImg(src); if (!im) return 0;
    const b = ctx.belly, key = "bc|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + Math.round(b.dx) + "," + Math.round(b.dy) + "," + b.cv.width + "," + b.cv.height; let v = MOULD.cover.get(key); if (v != null) return v;
    const w = im.naturalWidth, h = im.naturalHeight, c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(im, 0, 0);
    const d = g.getImageData(0, 0, w, h).data, cx = b.dx + b.cv.width / 2 - x, cy = b.dy + b.cv.height / 2 - y, rx = b.cv.width * 0.3, ry = b.cv.height * 0.3; let hit = 0, all = 0;
    for (let j = -ry; j <= ry; j += 3) for (let i = -rx; i <= rx; i += 3) { if ((i / rx) * (i / rx) + (j / ry) * (j / ry) > 1) continue; all++; const px = Math.round(cx + i), py = Math.round(cy + j); if (px >= 0 && py >= 0 && px < w && py < h && d[(py * w + px) * 4 + 3] > 60) hit++; }
    v = all ? hit / all : 0; if (MOULD.cover.size > 400) MOULD.cover.clear(); MOULD.cover.set(key, v); return v;
  }
  // the piece grown to the belly, if it covers it and nothing else has been chosen for it: the canvas, false (nothing to grow) or null (not ready)
  function bellyAuto(src, x, y, ctx, behind, pieceKey) { if (!ctx.belly || behind || BELLY.auto === false || typeof src !== "string") return null;
    // worn things only: not her hands, her skin or her hair
    { const m = new RegExp("(?:^|/)Assets/[^/]+/(?:Override/[^/]+/)?([^/]+)/").exec(src); if (!m || !chestSlot(m[1])) return false; }
    const pk = pieceKey || src; if (bellyCover(src, x, y, ctx) >= 0.15) MOULD.lies.add(pk); if (!MOULD.lies.has(pk)) return false;   // (if any layer of a piece lies on the belly, all of its layers grow together)
    return mouldCanvas(src, x, y, ctx, "auto|" + (pieceKey || src), "auto"); }
  // How far a whole piece reaches, over all its layers: its left and right edge on every row of the screen, and its last
  // row. Each layer's picture adds to it as it's drawn; when it grows, the picture is drawn again.
  function pieceSpan(pk, src, x, y) {
    const span = MOULD.span.get("p|" + pk) || { L: new Float32Array(2600).fill(1e9), R: new Float32Array(2600).fill(-1e9), v: 0, bottom: -1 };
    MOULD.span.set("p|" + pk, span);
    const p0 = edgesOf(src); let grew = false;
    if (p0) for (let j = 0; j < p0.h; j++) { const yy = Math.round(y) + j; if (p0.L[j] < 0 || yy < 0 || yy >= 2600) continue; if (x + p0.L[j] < span.L[yy]) { span.L[yy] = x + p0.L[j]; grew = true; } if (x + p0.R[j] > span.R[yy]) { span.R[yy] = x + p0.R[j]; grew = true; } if (yy > span.bottom) { span.bottom = yy; grew = true; } }
    if (grew) { span.v++; MOULD.ver++; clearTimeout(MOULD.t); MOULD.t = setTimeout(bellyDraw, 60); }
    return span;
  }
  // the belly's first and last row on the screen
  function bellyRows(ctx) { const b = ctx.belly, bp = b.prof || (b.prof = edges(b.cv, b.cv.width, b.cv.height)); let t = -1, e = -1; for (let j = 0; j < bp.h; j++) if (bp.L[j] >= 0) { if (t < 0) t = j; e = j; } return t < 0 ? null : { top: Math.round(b.dy) + t, bottom: Math.round(b.dy) + e }; }
  function mouldCanvas(src, x, y, ctx, piece, mode) {
    let im = mouldImg(src); if (!im) return null;
    const M = MOULD.M, w = im.naturalWidth; let h = im.naturalHeight;
    // the piece's own top and bottom on the screen, over every layer of it seen so far
    const p = edgesOf(src); let ext = MOULD.ext.get(piece);
    if (p) { let t = -1, e = -1; for (let j = 0; j < p.h; j++) if (p.L[j] >= 0) { if (t < 0) t = j; e = j; }
      if (t >= 0) { const T = Math.round(y) + t, B = Math.round(y) + e; if (!ext || T < ext.top || B > ext.bottom) { ext = { top: ext ? Math.min(ext.top, T) : T, bottom: ext ? Math.max(ext.bottom, B) : B }; MOULD.ext.set(piece, ext); clearTimeout(MOULD.t); MOULD.t = setTimeout(bellyDraw, 60); } } }
    const key = src + "|" + Math.round(x) + "," + Math.round(y) + "|" + mode + "|" + (ext ? ext.top + "-" + ext.bottom : "") + "|" + ctx.sig;
    if (MOULD.out.has(key)) return MOULD.out.get(key);
    const keep = (res) => { if (MOULD.out.size > 80) MOULD.out.clear(); MOULD.out.set(key, res); return res; };
    if (mode === "under") {
      const c = document.createElement("canvas"); c.width = w + M * 2; c.height = h; const g = c.getContext("2d");
      g.drawImage(im, M, 0); g.globalCompositeOperation = "destination-out"; g.drawImage(ctx.belly.cv, ctx.belly.dx - x + M, ctx.belly.dy - y);
      return keep(c);
    }
    const ol = ctx.outline || (ctx.outline = outline(ctx)); if (!ol) return null;   // a body picture is still loading: try again next redraw
    let changed = false;
    if (mode === "over" && ext) {
      const br = bellyRows(ctx), from = br ? Math.max(ext.top, br.top) : 0, to = br ? br.bottom - 2 : 0;   // (a little short of the very bottom: it goes under there)
      if (br && ext.bottom > from + 4 && ext.bottom < to) {
        const a = from - Math.round(y), b = ext.bottom - Math.round(y), b2 = to - Math.round(y), tall = document.createElement("canvas"); tall.width = w; tall.height = Math.max(h, b2 + 1 + (h - 1 - b));
        const tg = tall.getContext("2d");
        if (a > 0) tg.drawImage(im, 0, 0, w, a, 0, 0, w, a);                                     // above the belly: as it is
        tg.drawImage(im, 0, a, w, b - a + 1, 0, a, w, b2 - a + 1);                               // down the belly: lengthened
        if (b + 1 < h) tg.drawImage(im, 0, b + 1, w, h - b - 1, 0, b2 + 1, w, h - b - 1);        // (anything below: moved down)
        im = tall; h = tall.height; changed = true;
      }
    }
    const c = document.createElement("canvas"); c.width = w + M * 2; c.height = h;
    const g = c.getContext("2d");
    if (mode === "auto") {
      // The same lesson as the breasts (Laynie, Oct 13: "take what you learned and apply it across the board for all
      // wearable items"): the piece stays the game's own picture, and it's made to fit by growing it evenly, not by
      // cutting it about. Row by row: if the piece lies across the middle of the belly on that row, the whole width of
      // the piece there is grown, about its own two edges, until it reaches the belly's two edges. A corset that was
      // as wide as her waist is as wide as her belly. A skirt already wider than the belly isn't touched. The piece's
      // width on a row is taken over ALL its layers (span), so a buckle in the middle grows with the strap it's on
      // and isn't pulled out to the full width by itself; and edges are averaged over a few rows, so the grown part
      // has a smooth side and not a stepped one.
      const b = ctx.belly, bp = b.prof || (b.prof = edges(b.cv, b.cv.width, b.cv.height)), cxs = b.dx + b.cv.width / 2;
      const span = MOULD.span.get(piece) || { L: new Float32Array(2600).fill(1e9), R: new Float32Array(2600).fill(-1e9), v: 0 };
      MOULD.span.set(piece, span);
      const p0 = edgesOf(src); let grew = false;
      if (p0) for (let j = 0; j < p0.h; j++) { const yy = Math.round(y) + j; if (p0.L[j] < 0 || yy < 0 || yy >= 2600) continue; if (x + p0.L[j] < span.L[yy]) { span.L[yy] = x + p0.L[j]; grew = true; } if (x + p0.R[j] > span.R[yy]) { span.R[yy] = x + p0.R[j]; grew = true; } }
      if (grew) { span.v++; MOULD.ver++; clearTimeout(MOULD.t); MOULD.t = setTimeout(bellyDraw, 60); }
      const key2 = key + "|span" + span.v; if (MOULD.out.has(key2)) return MOULD.out.get(key2);
      const rowOf = (yy) => { if (yy < 0 || yy >= 2600 || span.L[yy] > 1e8) return null; const j = yy - Math.round(b.dy); if (j < 0 || j >= bp.h || bp.L[j] < 0) return null; const gl = span.L[yy], gr = span.R[yy], bl = b.dx + bp.L[j], br2 = b.dx + bp.R[j]; if (gl > cxs || gr < cxs) return null; return { gl, gr, nl: Math.min(gl, bl), nr: Math.max(gr, br2) }; };
      for (let j = 0; j < h; j++) {
        const yy = Math.round(y) + j;
        g.drawImage(im, 0, j, w, 1, M, j, w, 1);
        let gl = 0, gr = 0, nl2 = 0, nr = 0, n2 = 0; for (let d = -4; d <= 4; d++) { const e = rowOf(yy + d); if (e) { gl += e.gl; gr += e.gr; nl2 += e.nl; nr += e.nr; n2++; } }
        if (n2 < 5 || !rowOf(yy)) continue; gl /= n2; gr /= n2; nl2 /= n2; nr /= n2;
        if (gr - gl < 6 || (nl2 >= gl - 0.5 && nr <= gr + 0.5)) continue;
        const k = (nr - nl2) / (gr - gl), sa = Math.max(0, gl - x), sb = Math.min(w, gr - x + 1); if (sb - sa < 1) continue;
        changed = true;
        g.clearRect(M + nl2 - x - 1, j, nr - nl2 + 2, 1);
        g.drawImage(im, sa, j, sb - sa, 1, M + (nl2 - x) + (sa - (gl - x)) * k, j, (sb - sa) * k, 1);
      }
      const res2 = changed ? c : false; if (MOULD.out.size > 80) MOULD.out.clear(); MOULD.out.set(key2, res2); return res2;
    }
    for (let j = 0; j < h; j++) {
      const yy = Math.round(y) + j, o = ol.old(yy), n = ol.neu(yy);
      if (!o || !n || (n.l >= o.l && n.r <= o.r)) { g.drawImage(im, 0, j, w, 1, M, j, w, 1); continue; }
      changed = true;
      const l0 = Math.max(0, Math.min(w - 1, Math.round(o.l - x))), r0 = Math.max(l0, Math.min(w - 1, Math.round(o.r - x))), l1 = Math.round(n.l - x), r1 = Math.round(n.r - x);
      if (l0 > 0) g.drawImage(im, 0, j, l0, 1, M + (l1 - l0), j, l0, 1);                                   // left of the body: out with the edge
      g.drawImage(im, l0, j, r0 - l0 + 1, 1, M + l1, j, r1 - l1 + 1, 1);                                   // across the body: stretched to fit
      if (r0 + 1 < w) g.drawImage(im, r0 + 1, j, w - r0 - 1, 1, M + r1 + 1, j, w - r0 - 1, 1);             // right of the body
    }
    return keep(changed ? c : false);   // false: nothing on this piece overlaps the belly, draw it as the game does
  }

  // ── the breasts ──
  // Flat to R. The first six cups are the game's own chest sizes: picking one just changes the body. From DD up they're
  // drawn (breasts-drawing.js), over the game's biggest chest, standing and kneeling only for now. The game's nipples,
  // and whatever is worn on them, are lifted off where the game puts them and set down on the drawn ones.
  const BREAST = { band: {}, solid: {}, tuck: true, on: {}, free: true, holds: {}, holdSig: "", wear: {}, dress: true, cover: new Map(), cup: null, full: 1, hang: 1, apart: 1, x: 0, y: 0, nip: 1, nipY: 0, nipX: 0, cv: null, cvKey: "", halves: new Map(), out: new Map() };
  const BREAST_SLIDERS = [["full", "Fullness", 0.7, 1.4, 0.01], ["hang", "Weight (how low and heavy they hang)", 0, 2, 0.01], ["apart", "Apart / together", 0.6, 1.5, 0.01], ["x", "Left / right", -60, 60, 1], ["y", "Up / down", -80, 80, 1],
    ["nip", "Nipple size (and what's worn on them)", 0.4, 4, 0.05], ["nipY", "Nipples up / down", -80, 80, 1], ["nipX", "Nipples in / out", -60, 60, 1]];
  const NIP_GROUPS = new Set(["Nipples", "ItemNipples", "ItemNipplesPiercings"]);
  // what the breasts hang in front of once they reach it (Laynie, Oct 13: "at larger sizes should probably cover the
  // hands"): the hands and what's worn on them. Their pictures are drawn with the breasts' outline cut out.
  const HAND_GROUPS = new Set(["HandsLeft", "HandsRight", "ItemHands", "Gloves"]);
  // pieces with something made for the nipple itself (a shield, a pastie, a hole, a ring): those are fitted with the game's nipple pinned to hers
  const NIP_PIECES = new RegExp("Forbidden|Pastie|Nipple|Shield|Tape|Heart|Tassel|Piercing", "i");
  const ARM_GROUPS = new Set(["ItemArms", "Bracelet"]);
  // What holds a breast: anything worn round or over the chest. With one of these on, the drawn breasts take the game's
  // own shape a size up (see HELD in breasts-drawing.js) and the piece is drawn a size up to match.
  // Not by slot (a pair of wrist cuffs is in the arms slot and holds nothing; a straitjacket is in it too and does): by
  // whether the piece actually lies over the breasts. That's seen as it's drawn, so it's known from the drawing before:
  // BREAST.holds is the pieces that covered the breasts last time, and when that changes the picture is drawn again.
  // And bare? Laynie crossed both bare pictures on the Oct 13 sheet, the only ones where they hung in the other shape. So
  // by default it's one shape always: the game's own breast a size up, dressed or not. BREAST.free brings the hanging
  // teardrop back for when nothing over the chest is holding them.
  // (Withdrawn, Oct 13. Both of those swapped Laynie's approved shape for another without her asking: "you altered the
  // tits from the way we agreed on?… my approved shape always." There is one shape, hers, dressed or bare, and nothing
  // here may change it. Clothes are grown to fit it: see fitOf in breasts-drawing.js.)
  const heldNow = () => false;
  // What's worn over the chest. Every one of these is cut for the game's biggest chest, so on drawn breasts it would
  // sit in the middle like a patch. Instead the part of the piece that covered each of the game's breasts is taken and
  // GROWN onto the drawn one: same piece, same colours and shading, stretched from the game's breast to ours and kept
  // inside our outline. A bra cup stays a cup, a top stays a top. What's off the breasts isn't touched.
  // Which slots: all of them. Anything drawn after the breasts that covers enough of where the game's breasts were is
  // chest wear, whatever slot it's in (a straitjacket is in the arms slot, a cape in the neck's). Hair is left alone:
  // it falls over them, it isn't worn on them.
  const chestSlot = (g) => !!g && !/^Hair/.test(g) && !NIP_GROUPS.has(g) && !HAND_GROUPS.has(g) && !/^(Body|Arms|Head|Eyes|Eyebrows|Mouth|Blush|Fluids|Pussy|Emoticon|Height)/.test(g);
  // Straps don't stretch: a thin strap blown up to the size of the breast stops being a strap (the open harnesses and
  // frame bras came out as blobs). So those pieces are REDRAWN on drawn breasts, out of a few kinds of strap laid on
  // the breast's own outline, at a strap's width whatever the size:
  //   ring: round the base of each breast · under: along the underside · over: across the top of them
  //   across: a band over the nipples · centre: down between them · cross: an X between them
  // The number is the strap's width. The piece's own colour is used (or the tint you gave it). What's off the breasts
  // (shoulder straps, the back, the waist) is still the game's picture; the ring meets it at the breast's edge.
  const STRAPS = {
    FrameBra1: { ring: 6, centre: 4 }, FrameBra2: { ring: 3.5, cross: 2.5 }, BondageBra1: { across: 0.42, under: 6 }, HarnessBra2: { ring: 6, under: 8 },
    StarHarnessBra: { ring: 4, cross: 3.5, over: 3.5 }, StuddedHarness: { ring: 8, under: 8 }, LeatherBreastBinder: { over: 10, under: 10, centre: 6 },
    LeatherHarness: { ring: 6, centre: 5, under: 6 }, LeatherStrapHarness: { ring: 6, centre: 5, under: 6 }, HarnessBra1: { ring: 5, under: 6 },
  };
  const GAME_BREAST_ALLFOURS = { dx: 33, y: 288, r: 24 };
  const gameBreast = (B) => (B.pose === "AllFours" ? GAME_BREAST_ALLFOURS : GAME_BREAST);
  const GAME_BREAST = { dx: 42, y: 330, r: 41 };   // the game's biggest chest, in its upper-body picture: each breast's middle is this far out from the centre line, this far down, and about this big
  const upperName = () => { const it = bodyItem("BodyUpper"); return it && it.Asset ? it.Asset.Name : ""; };
  // the drawn breasts to show right now, or null (a cup the game draws itself, another chest picked since, or a pose they aren't drawn in)
  function breastNow() { if (!window.FarmBreasts || BREAST.cup == null || BREAST.cup < FarmBreasts.DRAWN_FROM) return null; if (upperName() !== "XLarge") return null; return BREAST; }   // every pose (Laynie, Oct 13: "need to make sure it also works for all positions too")
  function setCup(i) {
    BREAST.cup = i;
    setBody("BodyUpper", i < FarmBreasts.DRAWN_FROM ? FarmBreasts.NATIVE[i] : "XLarge");
    bellyDraw();
  }
  // which cup is showing: the one picked, or whichever of the game's six the body is
  function cupNow() { if (breastNow()) return BREAST.cup; const n = FarmBreasts.NATIVE.indexOf(upperName()); return n < 0 ? 3 : n; }
  // where the two nipples are in a picture: the middle of what's drawn on each side of the breastbone
  function nipHalves(src, split) {
    const key = src + "|" + split; let v = BREAST.halves.get(key); if (v) return v;
    const im = mouldImg(src); if (!im) return null;
    const w = im.naturalWidth, h = im.naturalHeight, c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(im, 0, 0);
    const d = g.getImageData(0, 0, w, h).data, acc = [[0, 0, 0], [0, 0, 0]];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 60) { const a = acc[x < split ? 0 : 1]; a[0] += x; a[1] += y; a[2]++; }
    v = acc.map((a) => (a[2] ? [a[0] / a[2], a[1] / a[2]] : null)); BREAST.halves.set(key, v); return v;
  }
  async function saveBreasts() {
    try { const r = await fetch("/__studio/fits/breasts.json", { method: "POST", body: JSON.stringify({ v: 1, saved: new Date().toISOString(), cup: BREAST.cup, full: BREAST.full, hang: BREAST.hang, apart: BREAST.apart, x: BREAST.x, y: BREAST.y, nip: BREAST.nip, nipY: BREAST.nipY, nipX: BREAST.nipX, wear: BREAST.wear }, null, 1) }); if (!r.ok) throw new Error(await r.text()); say("Saved to studio\\fits\\breasts.json."); }
    catch (e) { say("It didn't save: " + (e && e.message || e), true); }
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
  const GEN = { inches: 6, box: {}, drawn: true, kind: "human", knot: false, girth: 1, balls: 3, cv: null, cvKey: "" };   // drawn: ours (cock-drawing.js) in place of the game's picture
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
    const all = Asset.filter((a) => a.Group.Name === group && a.Visible !== false), pages = Math.ceil(all.length / per), saved = [];
    const tag = FarmBreasts.CUPS[cupNow()] + (fitNow().on ? "-belly" : "") + (poseKey() !== "std" ? "-" + poseKey().toLowerCase() : "");
    for (let p = (opt.from || 0); p < Math.min(pages, opt.to == null ? pages : opt.to); p++) {
      const cv = document.createElement("canvas"); cv.width = cols * TW; cv.height = Math.ceil(per / cols) * TH + 30; const g = cv.getContext("2d");
      g.fillStyle = "#565a66"; g.fillRect(0, 0, cv.width, cv.height); g.fillStyle = "#fff"; g.font = "bold 18px system-ui, sans-serif";
      g.fillText(group + "  ·  " + tag + "  ·  page " + (p + 1) + " of " + pages + "  ·  " + all.length + " pieces", 10, 21);
      const part = all.slice(p * per, p * per + per);
      for (let n = 0; n < part.length; n++) {
        const a = part[n], X = (n % cols) * TW, Y = 30 + Math.floor(n / cols) * TH;
        try { wear(before); if (!had) { try { InventoryRemove(S.C, group); } catch (e) { /* nothing on */ } } putOn(group, a.Name);
          for (let k = 0; k < 4; k++) { await waitMs(k ? 220 : 520); bellyDraw(); } await waitMs(60);
          g.drawImage(S.C.Canvas, crop[0], crop[1], crop[2], crop[3], X, Y, TW, TH); } catch (e) { console.warn("[studio] catalogue:", a.Name, e); g.fillStyle = "#a33"; g.fillRect(X, Y, TW, TH); }
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
            return [sel, $("button", { type: "button", textContent: "Make the catalogue", title: "Every piece in the slot, on her as she is now, twelve to a page, saved in studio\\catalogue", onclick: () => catalogue(sel.value) })]; })()),
        $("div", { className: "row" }, $("label", { textContent: "See a whole slot at this size:" }),
          (() => { const sel = $("select", {}, ["Cloth", "ClothOuter", "ClothAccessory", "Bra", "Suit", "Corset", "Necklace", "ItemBreast", "ItemTorso", "ItemTorso2", "ItemArms", "ItemNipples", "ItemNipplesPiercings", "ItemNeckAccessories", "ItemNeckRestraints"].filter((gn) => Asset.some((a) => a.Group.Name === gn)).map((gn) => $("option", { value: gn, textContent: gn.replace(/([a-z])([A-Z0-9])/g, "$1 $2") })));
            return [sel, $("button", { type: "button", textContent: "Show the sheet", title: "Tries on every piece in the slot and shows them side by side", onclick: () => chestAudit(sel.value) })]; })()),
        $("div", { className: "row" },
          $("button", { type: "button", className: "go", textContent: "Save the breasts", onclick: saveBreasts }),
          $("button", { type: "button", textContent: "Put the saved ones back", onclick: () => loadBreasts(true) }),
          $("button", { type: "button", className: BREAST.tuck ? "on" : "", textContent: BREAST.tuck ? "Hands: tucked behind when they're big" : "Hands: in front, as the game draws them", title: "Tucking hides her hands, and what's on her hands and wrists, once the breasts would cover most of them", onclick: () => { BREAST.tuck = !BREAST.tuck; fill(); bellyDraw(); } }),
          $("button", { type: "button", className: BREAST.dress ? "on" : "", textContent: BREAST.dress ? "Clothes a size up: on" : "Clothes a size up: off", title: "What's worn over the chest is drawn a size up, and the breasts take its shape", onclick: () => { BREAST.dress = !BREAST.dress; fill(); bellyDraw(); } }),
          $("button", { type: "button", textContent: "Sliders back to plain", onclick: () => { Object.assign(BREAST, { full: 1, hang: 1, apart: 1, x: 0, y: 0, nip: 1, nipY: 0, nipX: 0 }); fill(); bellyDraw(); } }))].flat(Infinity));
    };
    BREAST.fill = fill; fill();
    return box;
  }

  // step into the game's drawing of our character: lay the belly in (after all the skin, or before the upper body), and
  // redraw any moulded piece to the new outline
  function hookBelly() {
    const game = CommonDrawAppearanceBuild;
    CommonDrawAppearanceBuild = function (C, cb) {
      let finish = null, seenNow = null, handFNow = null;
      try {
        const fit = C === S.C ? fitNow() : null, br = C === S.C ? breastNow() : null, real = cb;   // real: the game's own callbacks (the wrapped set below must never call itself)
        if (fit && cb && typeof cb.drawImage === "function") {
          let upper = null, lower = false, done = false;
          const ctx = { bodies: [], belly: null, sig: "", seen: {} }; if (br) { seenNow = ctx.seen; handFNow = { get v() { return ctx.handF; } }; }
          const slot = new RegExp("(?:^|/)Assets/[^/]+/(?:Override/[^/]+/)?([^/]+)/");
          const groupOf = (src) => { const m = slot.exec(src); return m ? m[1] : ""; };
          // (a piece's pictures are in its slot's folder or the folder of the slot it borrows its art from, named for the piece)
          const mouldList = S.C.Appearance.filter((it) => MOULD.items.has(mouldKey(it))).map((it) => ({ folders: [it.Asset.Group.Name, it.Asset.DynamicGroupName], name: it.Asset.Name, key: mouldKey(it), mode: MOULD.mode.get(mouldKey(it)) || "wide" }));
          const wornList = S.C.Appearance.map((it) => ({ folders: [it.Asset.Group.Name, it.Asset.DynamicGroupName], name: it.Asset.Name, key: mouldKey(it) })).sort((a, b) => b.name.length - a.name.length);
          const pieceOf = (src) => { const g = groupOf(src), file = src.slice(src.lastIndexOf("/") + 1); return wornList.find((w) => w.folders.includes(g) && file.startsWith(w.name)) || null; };
          const isMoulded = (src) => { if (!mouldList.length) return null; const g = groupOf(src), file = src.slice(src.lastIndexOf("/") + 1); return mouldList.find((q) => q.folders.includes(g) && file.startsWith(q.name)) || null; };
          const gate = FarmBelly.skinGate(C);   // true once a picture comes after all the skin, genitals included
          const prio = (src) => { const g = AssetGroupGet(C.AssetFamily, groupOf(src)); return g && typeof g.DrawingPriority === "number" ? g.DrawingPriority : 99; };
          const paint = () => {
            if (done || !upper) return; done = true;   /* (runs once, after the last of the skin: belly, then a standing cock, then breasts) */
            if (fit.on) {
            const shape = { rx: fit.rx, ry: fit.ry, sag: fit.sag, cut: fit.cut };
            const cv = FarmBelly.bellyCanvas(shape, bellySkin(upper[2], upper[3], FarmBelly.bellyPose(upper[2])), !!fit.flat);
            // hung from just under the ribs, then moved by the sliders; pressed flat, its ground line is what the sliders place
            const dx = upper[0] + 250 - cv.width / 2 + fit.x, dy = upper[1] + 392 + fit.ry * 0.62 - cv.height / 2 + fit.y;
            real.drawImage(cv, dx, dy, {}); if (typeof real.drawImageBlink === "function") real.drawImageBlink(cv, dx, dy, {});
            ctx.belly = { cv, dx, dy };
            ctx.sig = [fit.rx, fit.ry, fit.sag, fit.cut, fit.flat ? 1 : 0, Math.round(dx), Math.round(dy)].join(",") + "|" + ctx.bodies.map((b) => b.src + "@" + Math.round(b.x) + "," + Math.round(b.y)).join(";");
            }
            if (ctx.cock) { const k = ctx.cock; ctx.cock = null; real.drawImage(k[0], k[1], k[2], {}); if (typeof real.drawImageBlink === "function") real.drawImageBlink(k[0], k[1], k[2], {}); }
            if (br) {
              // over the belly: they hang in front of it
              const isHeld = FarmBelly.bellyPose(upper[2]) !== "AllFours" && heldNow(), freeS = FarmBreasts.shape(br.cup, br), S3 = isHeld ? FarmBreasts.held(freeS) : freeS;
              const key = [br.cup, br.full, br.hang, br.apart, isHeld ? "held" : "free"].join(",") + "|" + bellySkin(upper[2], upper[3], FarmBelly.bellyPose(upper[2])).join(",");
              if (BREAST.cvKey !== key) { BREAST.cv = FarmBreasts.canvas(S3, bellySkin(upper[2], upper[3], FarmBelly.bellyPose(upper[2]))); BREAST.cvKey = key; }
              // Hogtied, the chest is where it is standing. On all fours the game shows her from the front, chest under the
              // head and between the arms: they hang straight down from it, and whatever reaches the ground rests on it,
              // flat underneath. The hands are in front of them there, not behind.
              const bpose = FarmBelly.bellyPose(upper[2]), rx = upper[0] + 250 + br.x, ry = upper[1] + FarmBreasts.ROOT_Y + br.y, ground = upper[1] + 398;
              let bc = BREAST.cv;
              if (bpose === "AllFours" && ry - bc.ay + bc.height > ground) {
                if (BREAST.flatKey !== key + "|" + Math.round(ry)) {
                  const fc = document.createElement("canvas"); fc.width = bc.width; fc.height = bc.height; const fg = fc.getContext("2d"), cut = Math.round(ground - (ry - bc.ay));
                  // Where they meet the ground. It was a dead level cut with a hard line under it (Laynie, Oct 14: "the all fours
                  // 'cut off' is a little harsh… a bit softer a transition at the edge of the breast"). Now the last of
                  // each breast curves in to the ground instead of being sliced: the corners are rounded off, the bottom
                  // few rows fade, and what marks the ground is a soft shadow, not a line.
                  fg.drawImage(bc, 0, 0); fg.clearRect(0, cut, fc.width, fc.height - cut);
                  const row = fg.getImageData(0, Math.max(0, cut - 3), fc.width, 1).data; let x0 = -1, x1 = -1; for (let i = 0; i < fc.width; i++) if (row[i * 4 + 3] > 120) { if (x0 < 0) x0 = i; x1 = i; }
                  if (x0 >= 0) { const soft = 16, mid = (x0 + x1) / 2, half = (x1 - x0) / 2;
                    fg.globalCompositeOperation = "destination-out";
                    const fade = fg.createLinearGradient(0, cut - soft, 0, cut); fade.addColorStop(0, "rgba(0,0,0,0)"); fade.addColorStop(1, "rgba(0,0,0,0.9)");
                    fg.fillStyle = fade; fg.fillRect(0, cut - soft, fc.width, soft);
                    for (const sd of [-1, 1]) { const cx = mid + sd * half, rg = fg.createRadialGradient(cx, cut, 0, cx, cut, soft * 1.8); rg.addColorStop(0, "rgba(0,0,0,1)"); rg.addColorStop(1, "rgba(0,0,0,0)"); fg.fillStyle = rg; fg.fillRect(cx - soft * 2, cut - soft * 2, soft * 4, soft * 2); }   // the outer corners, rounded off
                    fg.globalCompositeOperation = "destination-over";
                    const sh = fg.createRadialGradient(mid, cut - 3, 0, mid, cut - 3, half * 1.05); sh.addColorStop(0, "rgba(70,40,36,0.34)"); sh.addColorStop(0.75, "rgba(70,40,36,0.2)"); sh.addColorStop(1, "rgba(70,40,36,0)");
                    fg.save(); fg.translate(0, cut - 3); fg.scale(1, 0.09); fg.translate(0, -(cut - 3)); fg.fillStyle = sh; fg.beginPath(); fg.arc(mid, cut - 3, half * 1.05, 0, Math.PI * 2); fg.fill(); fg.restore();
                    fg.globalCompositeOperation = "source-over"; }
                  fc.ax = bc.ax; fc.ay = bc.ay; fc.nips = bc.nips; fc.mask = bc.mask; BREAST.flat = fc; BREAST.flatKey = key + "|" + Math.round(ry);
                }
                bc = BREAST.flat;
              }
              real.drawImage(bc, rx - bc.ax, ry - bc.ay, {}); if (typeof real.drawImageBlink === "function") real.drawImageBlink(bc, rx - bc.ax, ry - bc.ay, {});
              ctx.breast = { fit: FarmBreasts.fitOf(S3, FarmBelly.bellyPose(upper[2]), [bc.nips[1][0] + br.nipX, bc.nips[1][1] + br.nipY]), held: isHeld, upperSrc: upper[2], ux: upper[0], pose: bpose, ground: bpose === "AllFours" ? ground : Infinity, S: S3, rx, ry, uy: upper[1], mask: bc.mask, mx: rx - bc.ax, my: ry - bc.ay, nips: bc.nips.map((p, i) => [rx + p[0] + (i ? 1 : -1) * br.nipX, ry + p[1] + br.nipY]), k: FarmBreasts.shape(br.cup, br).k, kN: (1 + 0.45 * FarmBreasts.shape(br.cup, br).k) * br.nip, sig: key + "|" + Math.round(rx) + "," + Math.round(ry) + "|" + [br.nip, br.nipX, br.nipY].join(","), mid: upper[0] + 250 };
              // (a pose where the game paints the nipples into the body itself, all fours, gives us none to move: ours then)
              if (!held.length) {
                const B = ctx.breast, sk = bellySkin(upper[2], upper[3], bpose), rad = 7 * B.kN, nc = document.createElement("canvas"); nc.width = nc.height = Math.ceil(rad * 2 + 4);
                const ng = nc.getContext("2d"), gr = ng.createRadialGradient(nc.width / 2, nc.height / 2, 0, nc.width / 2, nc.height / 2, rad), tone = (m, a) => "rgba(" + Math.round(Math.min(255, sk[0] * m)) + "," + Math.round(sk[1] * 0.62 * m) + "," + Math.round(sk[2] * 0.62 * m) + "," + a + ")";
                gr.addColorStop(0, tone(0.92, 1)); gr.addColorStop(0.3, tone(1, 0.95)); gr.addColorStop(0.75, tone(1.02, 0.8)); gr.addColorStop(1, tone(1.02, 0));
                ng.fillStyle = gr; ng.beginPath(); ng.arc(nc.width / 2, nc.height / 2, rad, 0, Math.PI * 2); ng.fill();
                for (const p of B.nips) if (p[1] + rad < B.ground) { real.drawImage(nc, p[0] - nc.width / 2, p[1] - nc.height / 2, {}); if (typeof real.drawImageBlink === "function") real.drawImageBlink(nc, p[0] - nc.width / 2, p[1] - nc.height / 2, {}); }
              }
              for (const h of held.splice(0)) { try { if (!nipDraw(...h)) real[h[0]](h[1], h[2], h[3], h[4]); } catch (e) { console.warn("[studio] nipples:", e); } }
            }
          };
          // the game's nipples, and what's worn on them, set down on the drawn breasts: each side of the picture is
          // moved to its own nipple, and grown a little with the size. false: not ready, draw it as the game does.
          // how much of a hand picture the breasts would cover (0 to 1); null while it's loading
          const handHidden = (src, x, y) => {
            const B = ctx.breast, im = B && mouldImg(src); if (!im) return null;
            const key = "hh|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig; let v = BREAST.cover.get(key); if (v != null) return v;
            const w = im.naturalWidth, h = im.naturalHeight, c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d", { willReadFrequently: true });
            const count = () => { const d = g.getImageData(0, 0, w, h).data; let n = 0; for (let i = 3; i < d.length; i += 16) if (d[i] > 100) n++; return n; };
            g.drawImage(im, 0, 0); const all = count(); g.globalCompositeOperation = "destination-in"; g.drawImage(B.mask, B.mx - x, B.my - y); const under = count();
            v = all ? under / all : 0; BREAST.cover.set(key, v); return v;
          };
          const handDraw = (name, src, x, y, o) => {
            const B = ctx.breast, im = B && mouldImg(src); if (!im) return false;
            const key = "hand|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig;
            let c = BREAST.out.get(key);
            if (!c) { c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight; const g = c.getContext("2d"); g.drawImage(im, 0, 0); g.globalCompositeOperation = "destination-out"; g.drawImage(B.mask, B.mx - x, B.my - y); if (BREAST.out.size > 60) BREAST.out.clear(); BREAST.out.set(key, c); }
            real[name](c, x, y, o); return true;
          };
          // how much of the game's two breasts this picture covers (0 to 1): a belt or a collar isn't chest wear
          // wide: measured a third wider than the breast (is it round or under them: does it hold them?). Not wide: measured
          // just inside the breast (is it ON them: is there anything of it to grow?).
          // Is there a band running along the underside of the game's breasts? (an underbust strap, the lower edge of a harness.)
          // Such a piece has little ON the breast, but its band has to follow the breast down to HER underside, or it ends up
          // across the middle of her breasts (Laynie's marks on the Futuristic and High Security harnesses, Oct 14).
          const underBand = (src, im, x, y, B) => {
            const key = "ub|" + src + "|" + Math.round(x) + "," + Math.round(y); let v = BREAST.cover.get(key); if (v != null) return v;
            const w = im.naturalWidth, h = im.naturalHeight, c = document.createElement("canvas"); c.width = w; c.height = h;
            const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(im, 0, 0);
            const GB = gameBreast(B), d = g.getImageData(0, 0, w, h).data; let hit = 0, all = 0;
            for (const sd of [-1, 1]) for (let i = -Math.round(GB.r * 0.8); i <= Math.round(GB.r * 0.8); i += 2) { all++; const px = Math.round(B.mid + sd * GB.dx - x) + i; let any = false;
              for (let j = Math.round(GB.r * 0.7); j <= Math.round(GB.r * 1.6); j++) { const py = Math.round(B.uy + GB.y - y) + j; if (px >= 0 && py >= 0 && px < w && py < h && d[(py * w + px) * 4 + 3] > 60) { any = true; break; } } if (any) hit++; }
            v = all ? hit / all : 0; BREAST.cover.set(key, v); return v;
          };
          // The piece as the game draws it, with her breasts in front of it; and its under-band, the strip along the underside
          // of the game's breasts, lifted out and set along HER underside, widened to her.
          const bandDraw = (name, src, x, y, o) => {
            const B = ctx.breast, im = mouldImg(src); if (!B || !im) return false;
            const key = "band|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig; let c = BREAST.out.get(key);
            if (!c) {
              const GB = gameBreast(B), MX = 260, MY = 480, w = im.naturalWidth, h = im.naturalHeight, S2 = B.S;
              c = document.createElement("canvas"); c.width = w + MX * 2; c.height = h + MY * 2; c.MX = MX; c.MY = MY; const g = c.getContext("2d");
              g.drawImage(im, MX, MY); g.globalCompositeOperation = "destination-out"; g.drawImage(B.mask, MX + B.mx - x, MY + B.my - y); g.globalCompositeOperation = "source-over";   // behind her breasts
              const b0 = Math.round(B.uy + GB.y + GB.r * 0.62 - y), b1 = Math.round(B.uy + GB.y + GB.r * 1.65 - y), gUnder = B.uy + GB.y + GB.r, herUnder = B.ry + S2.by + (B.fit.rv || S2.r), dy = herUnder - gUnder, kx = 1, mid = B.mid - x;   /* not widened: her ribs under her breasts are as wide at any cup size (Laynie, Oct 14: "the width of the character without the breast would be the same width no matter the tit size") */
              if (b1 > b0) { const strip = document.createElement("canvas"); strip.width = w; strip.height = b1 - b0; strip.getContext("2d").drawImage(im, 0, b0, w, b1 - b0, 0, 0, w, b1 - b0);
                g.drawImage(strip, MX + mid - mid * kx, MY + b0 + dy, w * kx, b1 - b0); }
              if (BREAST.out.size > 60) BREAST.out.clear(); BREAST.out.set(key, c);
            }
            real[name](c, x - c.MX, y - c.MY, o); return true;
          };
          const chestCover = (src, im, x, y, B, wide) => {
            const key = (wide ? "w|" : "n|") + src + "|" + Math.round(x) + "," + Math.round(y); let v = BREAST.cover.get(key); if (v != null) return v;
            const w = im.naturalWidth, h = im.naturalHeight, c = document.createElement("canvas"); c.width = w; c.height = h;
            const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(im, 0, 0);
            const GB = gameBreast(B), d = g.getImageData(0, 0, w, h).data, R = Math.round(GB.r * (wide ? 1.3 : 0.82)); let hit = 0, all = 0;
            for (const sd of [-1, 1]) { const cx = Math.round(B.mid + sd * GB.dx - x), cy = Math.round(B.uy + GB.y - y);
              for (let j = -R; j <= R; j += 2) for (let i = -R; i <= R; i += 2) { if (i * i + j * j > R * R) continue; all++; const px = cx + i, py = cy + j; if (px >= 0 && py >= 0 && px < w && py < h && d[(py * w + px) * 4 + 3] > 60) hit++; } }
            v = all ? hit / all : 0; BREAST.cover.set(key, v); return v;
          };
          // How far each drawn pixel is from the nearest empty one (0 where it's empty). alpha: one value a pixel.
          const distMap = (alpha, w, h) => {
            const d = new Float32Array(w * h), BIG = 1e6, D = 1.4142;
            for (let i = 0; i < d.length; i++) d[i] = alpha[i] > 60 ? BIG : 0;
            for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) { const i = yy * w + xx; if (!d[i]) continue; let v = d[i];
              if (xx > 0) v = Math.min(v, d[i - 1] + 1); if (yy > 0) { v = Math.min(v, d[i - w] + 1); if (xx > 0) v = Math.min(v, d[i - w - 1] + D); if (xx < w - 1) v = Math.min(v, d[i - w + 1] + D); } d[i] = v; }
            for (let yy = h - 1; yy >= 0; yy--) for (let xx = w - 1; xx >= 0; xx--) { const i = yy * w + xx; if (!d[i]) continue; let v = d[i];
              if (xx < w - 1) v = Math.min(v, d[i + 1] + 1); if (yy < h - 1) { v = Math.min(v, d[i + w] + 1); if (xx < w - 1) v = Math.min(v, d[i + w + 1] + D); if (xx > 0) v = Math.min(v, d[i + w - 1] + D); } d[i] = v; }
            return d;
          };
          // Is this piece made of straps, and how thick are they? Half the width of its thinner straps where they cross
          // the game's breasts (0: nothing strap-like there). A solid cup gives a big number, a harness a small one.
          const strapHalf = (src, im, x, y, B) => {
            const key = "thin|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.pose; let v = BREAST.cover.get(key); if (v != null) return v;
            const w = im.naturalWidth, h = im.naturalHeight, c = document.createElement("canvas"); c.width = w; c.height = h;
            const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(im, 0, 0);
            const px = g.getImageData(0, 0, w, h).data, a = new Uint8Array(w * h); for (let i = 0; i < a.length; i++) a[i] = px[i * 4 + 3];
            const d = distMap(a, w, h), GB = gameBreast(B), R = GB.r + 4, ridge = [];
            for (const sd of [-1, 1]) { const cx = Math.round(B.mid + sd * GB.dx - x), cy = Math.round(B.uy + GB.y - y);
              for (let j = -R; j <= R; j++) for (let i = -R; i <= R; i++) { if (i * i + j * j > R * R) continue; const xx = cx + i, yy = cy + j; if (xx < 1 || yy < 1 || xx >= w - 1 || yy >= h - 1) continue; const k = yy * w + xx, v0 = d[k]; if (v0 < 1) continue;
                if (v0 >= d[k - 1] && v0 >= d[k + 1] && v0 >= d[k - w] && v0 >= d[k + w] && v0 >= d[k - w - 1] && v0 >= d[k - w + 1] && v0 >= d[k + w - 1] && v0 >= d[k + w + 1]) ridge.push(v0); } }
            ridge.sort((m, n) => m - n); v = ridge.length >= 24 ? ridge[Math.floor(ridge.length * 0.2)] : 0; BREAST.cover.set(key, v); return v;
          };
          // ── Chest wear on drawn breasts ──
          // The piece isn't bent to the breast. The breast fits the piece (see HELD in breasts-drawing.js): with something
          // worn over the chest, ours is the game's own breast a size up. So the piece is the game's own picture the same
          // size up, and that's all: nothing is cut out, traced, pared or laid on in strips. Every strap, stud, seam and
          // cup is where the game put it and looks the way the game drew it, only bigger, the way the next size of the
          // same bra would be.
          //   · Above the breasts the piece is untouched. Over a short stretch of chest the growing comes on, so a strap
          //     coming down from the shoulder flares out to meet the bigger breast instead of jumping to it.
          //   · From the top of the breasts down to just under them it's the game's picture, grown evenly about the
          //     breastbone. That block lies over whatever of the piece is on the body behind it (the body of a corset),
          //     the way the breasts themselves do.
          //   · It's only shown where there's something for it to lie on: the breasts, or the body. Nothing hangs in the air.
          const dressDraw = (name, src, x, y, o) => {
            const B = ctx.breast, im = B && mouldImg(src); if (!im) return false;   // (every pose, all fours too: nothing is drawn below the ground there)
            // A piece that lies ON the breasts is grown with them (and every layer of it: a buckle or a bow goes along). A
            // piece that only props them from under (an underbust corset) holds them but has nothing ON them, so nothing of
            // it is grown: grown, its top trim was landing on the breast (Laynie, Oct 13: "the latex corset shows stuff on
            // the breast"). It's drawn as the game draws it, and the breasts sit in front of its top edge.
            const pk0 = (pieceOf(src) || {}).key;
            if (chestCover(src, im, x, y, B, false) < 0.012 && !BREAST.on[pk0] && underBand(src, im, x, y, B) >= 0.35) BREAST.band[pk0] = true;
            if (BREAST.band[pk0] && !BREAST.on[pk0]) return handDraw(name, src, x, y, o);   /* (a band on her body stays exactly where the game puts it, at any size; her breasts simply hang in front of it. Laynie, Oct 14: "that part shouldn't have moved between sizes". bandDraw, which lowered it, is no longer used.) */
            // a piece that starts below the game's breasts (a waist strap, a belt) is under her bigger ones: they hang in front of it
            if (chestCover(src, im, x, y, B, false) < 0.012 && !BREAST.on[pk0]) { const e0 = edgesOf(src); if (e0) { let t0 = -1; for (let j = 0; j < e0.h; j++) if (e0.L[j] >= 0) { t0 = j; break; } if (t0 >= 0 && y + t0 > B.uy + gameBreast(B).y) return handDraw(name, src, x, y, o); } }   /* (every layer of a banded piece goes the same way: its clasp in the middle too) */
            if (chestCover(src, im, x, y, B, false) < 0.012 && !BREAST.on[pk0])   /* (a rope or a thin strap across the breast covers very little of it, and is still ON it: the box-tie ropes were being taken for an underbust piece and hidden behind her breasts. Found in the catalogue, Oct 14.) */ return BREAST.holds[pk0] ? handDraw(name, src, x, y, o) : false;
            const pc0 = pieceOf(src), wm = (pc0 && BREAST.wear[pc0.key]) || "", pin = wm === "nipple" || (wm === "" && !!pc0 && NIP_PIECES.test(pc0.name)), mapYp = pin && B.fit.mapYN ? B.fit.mapYN : B.fit.mapY;
            const key = "dress|" + (pin ? "pin|" : "") + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig + "|" + (ctx.belly && !fit.behind && BELLY.auto !== false ? ctx.sig : "") + "|" + MOULD.ver;
            let c = BREAST.out.get(key);
            if (!c) {
              const MX = 260, MY = 480, w = im.naturalWidth, h = im.naturalHeight, S2 = Object.assign({}, B.S, { sc: B.fit.kx, ro: B.fit.ro, ri: B.fit.ri, rv: B.fit.rv }), G = B.fit.G || FarmBreasts.GAME, sc = S2.sc;
              c = document.createElement("canvas"); c.width = w + MX * 2; c.height = h + MY * 2; c.MX = MX; c.MY = MY;
              const g = c.getContext("2d", { willReadFrequently: true }), midX = MX + B.mid - x, uyc = MY + B.uy - y;
              const pk = (pieceOf(src) || {}).key || src, CW = c.width, CH = c.height;
              const overBelly = bellyAuto(src, x, y, ctx, fit.behind, pk);   // (the piece as it is once it's been grown to the belly, if she has one: the chest is laid on that)
              if (overBelly) g.drawImage(overBelly, MX - MOULD.M, MY); else g.drawImage(im, MX, MY);
              const sp = g.getImageData(0, 0, CW, CH).data;
              const y1 = uyc + G.y1, y2 = uyc + G.y2, y3 = uyc + G.y3, flapEnd = uyc + mapYp(G.y3);
              // FILLED, not laid on top (Laynie, Oct 13, of a school uniform whose top had come out as a wide block ending in
              // a straight line across her middle: "think about how the tits and/or belly fill the clothing, instead of how
              // the clothing sits on top"). A bra ends under the breasts and that's that. But a top, a dress, a jacket goes
              // on down, and the grown part mustn't end in a shelf. So for a long piece the grown part is shown ONLY ON THE
              // BREASTS below their middle: its lower edge is the round underside of each breast, the cloth pulled full
              // over them, and under that the rest of the piece is just as the game drew it, on the body where it
              // always was. (I tried re-laying the rest of the piece too, letting the width out down to the hem. It
              // dragged sleeves and cuffs about with it, because a sleeve crossing the body can't be told from the body
              // of the dress. The rest of the piece is right as it is.) Whether a piece is long is seen from where it
              // ends, over all its layers: a short one, a bra, keeps its band under the breasts.
              const span = pieceSpan(pk, src, x, y), pb = span.bottom > 0 ? MY + span.bottom - y : 0;
              const drape = pb > flapEnd + 24;   // a long piece: it goes on well below the breasts
              const sm = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
              // how much things have grown on a row of the game's picture: nothing above y1, fully by y2, and (draping) easing off again below y3
              const grown = (yn) => 1 + (sc - 1) * sm((yn - y1) / (y2 - y1));
              // where a row of the game's picture lands
              const lands = (yn) => uyc + mapYp(yn - uyc);
              const ynMax = y3, yEnd = Math.min(CH - 2, Math.floor(flapEnd));
              // the body's own outline, row by row, and where our two breasts are
              const prof = edgesOf(B.upperSrc), ux = MX + B.ux - x, bcy = MY + B.ry - y + S2.by, bcx = [midX + (B.rx - B.mid) - S2.bx, midX + (B.rx - B.mid) + S2.bx];
              const onBreast = (qx, qy) => { for (let k = 0; k < 2; k++) { const dx = qx - bcx[k], rxk = (k ? dx > 0 : dx < 0) ? S2.ro : S2.ri, dy = (qy - bcy) / (S2.rv + 2); if ((dx / (rxk + 2)) * (dx / (rxk + 2)) + dy * dy <= 1) return true; } return false; };
              const x0 = Math.max(0, Math.floor(midX - 110 * sc)), bw = Math.min(CW - x0, Math.ceil(220 * sc)), y0 = Math.max(0, Math.floor(y1)), bh = Math.min(CH - 2, Math.max(yEnd, Math.floor(BREAST.solid[pk] ? Math.min(pb > 0 ? pb : flapEnd, MY + B.ry - y + S2.by + S2.rv * 2.4) : 0))) - y0 + 1;
              if (bw > 0 && bh > 0) {
                const out = g.createImageData(bw, bh), od = out.data, hi = g.createImageData(bw, bh);
                // Above the breasts the grown piece may run out past the side of the chest, to reach the top of a breast that's
                // wider than she is. How far out is a SLOPE, from the edge of the body at the top of the grown part down to
                // the breast's own side: not the full width all the way up, which gave every top a pair of square corners
                // standing off her shoulders (Laynie, Oct 13: "why the sharp angles on the shoulders?").
                const pj1 = Math.round(y1 - uyc), bodyHalf = prof && pj1 >= 0 && pj1 < prof.h && prof.L[pj1] >= 0 ? Math.max(midX - (ux + prof.L[pj1]), ux + prof.R[pj1] - midX) : 80;
                const slopeEnd = bcy - S2.rv * 0.65, sideHalf = S2.bx + S2.ro * 0.76;   // (where the breast's own outline has come out to nearly its full width)
                const slopeHalf = (qy) => { const t = Math.max(0, Math.min(1, (qy - y1) / Math.max(1, slopeEnd - y1))); return bodyHalf + (sideHalf - bodyHalf) * t * t * (3 - 2 * t); };
                // THE MOULD, WITH THE SIZE-UP (Laynie, Oct 13: "why doesn't it use our 'mould to shape' fix in combination
                // with the original conscious redraw?"). They'd been two separate things: the size-up for the chest, the
                // mould for the belly. So a top was grown over the bust and then stopped, and under the bust the same top
                // went straight back to the width of her ribs: a big bust on a narrow tube. Cloth doesn't do that. It
                // hangs from the widest point of the bust and comes in gradually. So for a piece that's cloth right over
                // the breasts (a top, a dress: not straps, not a bra), the rows from the middle of the bust down are
                // MOULDED: the stretch of the piece across her body on each row is grown out to a line that runs from
                // the side of the breast down to the body again, by the piece's hem or a little below the bust,
                // whichever comes first. Same rows, same cloth, same print: only wider, the way the mould always did it.
                // across: the gap between her breasts is filled from the game's gap, each breast from the game's breast
                // THE NIPPLES LINE UP. Whatever the game puts over its nipple (a shield, a cup's peak, a ring, a hole) has to
                // land on HER nipple, which on her shape sits lower and further out (Laynie's mark on the Forbidden
                // Chastity Bra, Oct 14: "they need to sit on the nipples"). So round each nipple the picture is slid
                // over, most at the nipple itself and fading to nothing a breast's radius away.
                const nipPull = (() => { if (true) return null;   /* (withdrawn: it bent the straps round it. The nipple is a fixed point of the fit itself now: see fitOf.) */ const G0 = FarmBreasts.GAME, gx = G0.dx + 4, gy = G0.cy - 0.43 * G0.rv;
                  const land = (B.fit.ti + (gx - B.fit.gi) * (B.fit.to - B.fit.ti) / Math.max(1, B.fit.go - B.fit.gi)), landY = uyc + B.fit.mapY(gy), R = S2.r * 0.95;
                  return B.nips.map((p, i) => { const tx = MX + p[0] - x, ty = MY + p[1] - y; return { tx, ty, dx: (midX + (i ? 1 : -1) * land) - tx, dy: landY - ty, R }; }); })();
                const kyAt = (yn) => Math.max(0.2, B.fit.mapY(yn - uyc + 1) - B.fit.mapY(yn - uyc));
                const FT = B.fit, srcOff = (off, sg) => { if (FT.to == null || sc <= 1.001) return off / sg; const e = Math.max(0, Math.min(1, (sg - 1) / (sc - 1))), a = Math.abs(off);
                  const m = a <= FT.ti ? (FT.ti > 0.5 ? a * FT.gi / FT.ti : FT.gi) : FT.tn == null || !pin ? FT.gi + (a - FT.ti) * (FT.go - FT.gi) / Math.max(1, FT.to - FT.ti)
                    : a <= FT.tn ? FT.gi + (a - FT.ti) * (FT.gn - FT.gi) / Math.max(1, FT.tn - FT.ti) : FT.gn + (a - FT.tn) * (FT.go - FT.gn) / Math.max(1, FT.to - FT.tn); return (off < 0 ? -1 : 1) * ((1 - e) * a + e * m); };
                const groundRow = B.ground < 1e8 ? MY + B.ground - y - 1 : 1e9;
                // (only a layer that is itself cloth over the breasts is let out below them. A suit's sleeves are a layer of their own with nothing on the chest, and letting THAT out wiped the arms it was on: every catsuit lost its sleeves. Found in the catalogue, Oct 14.)
                const tentOn = !!BREAST.solid[pk] && B.pose !== "AllFours" && chestCover(src, im, x, y, B, false) >= 0.5, tEnd = tentOn ? Math.min(pb > 0 ? pb : flapEnd, bcy + S2.rv * 2.4) : 0;
                const bodyHalfAt = (qy) => { const pj = Math.round(qy - uyc); return prof && pj >= 0 && pj < prof.h && prof.L[pj] >= 0 ? Math.max(midX - (ux + prof.L[pj]), ux + prof.R[pj] - midX) : 80; };
                const tentTop = S2.bx + S2.ro * 0.96, tentBot = tentOn ? bodyHalfAt(tEnd) + 1 : 0;
                const tentHalf = (qy) => { const t = Math.max(0, Math.min(1, (qy - bcy) / Math.max(1, tEnd - bcy))); return tentTop + (tentBot - tentTop) * Math.pow(t, 1.25); };
                let yn = y1;
                for (let j = 0; j < bh; j++) {
                  const qy = y0 + j;
                  // which row of the game's picture this is: step down it until its grown position reaches us
                  while (yn < ynMax && lands(yn + 0.25) < qy) yn += 0.25;
                  const sg = grown(yn), pj = Math.round(qy - uyc), tl = prof && pj >= 0 && pj < prof.h ? prof.L[pj] : -1, tr = tl >= 0 ? prof.R[pj] : -1;
                  for (let i = 0; i < bw; i++) {
                    const qx = x0 + i;
                    // (and above the middle of the breasts, anywhere between their outer edges: a strap from the shoulder to the top of a
                    // big breast runs out past the side of the chest on its way. Cut off at the body's edge it was left in
                    // pieces: Laynie's marks on the R-cups, Oct 13.)
                    // Where the grown piece shows, and where it REPLACES the game's. On the breasts and on the body it replaces
                    // it. On the slope out past the shoulder it's only laid OVER it: there the game's picture is her sleeve,
                    // and wiping it took the sleeves off every top (set beside the game's own, the student outfit had lost
                    // both white sleeves: Laynie, Oct 13, "those outfits look broken again"). And under the breasts it spans
                    // from one to the other: cloth pulled over two breasts is taut across the gap, it doesn't follow each
                    // one in underneath like paint on two balloons.
                    if (qy > groundRow) continue;
                    const inRows = qy <= yEnd, under = tentOn && qy > bcy;
                    const onB = inRows && onBreast(qx, qy), onBody = inRows && !under && (!drape || qy <= bcy) && (prof ? (tl >= 0 && qx >= ux + tl && qx <= ux + tr) : Math.abs(qx - midX) <= 80);
                    const bridge = inRows && !onB && qy > bcy && Math.abs(qx - midX) < S2.bx && qy <= bcy + S2.rv * (0.94 + 0.06 * Math.pow(Math.abs(qx - midX) / S2.bx, 2));   /* nearly straight across between their two lowest points: her shape hangs lower in the middle than the round one did, and skin was showing in the gap */
                    const onSlope = inRows && !onB && !onBody && qy <= slopeEnd && Math.abs(qx - midX) <= slopeHalf(qy);
                    const th = under && qy <= tEnd ? tentHalf(qy) : 0, bh2 = th ? bodyHalfAt(qy) : 0, onTent = th > bh2 + 1 && !onB && !bridge && Math.abs(qx - midX) <= th;
                    if (!(onB || onBody || bridge || onSlope || onTent)) continue;
                    const o4 = (j * bw + i) * 4; if (!onSlope) hi.data[o4 + 3] = 255;
                    let px2 = qx, pyS = 0; if (nipPull && !onTent) { const np = nipPull[qx < midX ? 0 : 1], dd = Math.hypot(qx - np.tx, qy - np.ty); if (dd < np.R) { const wv = Math.pow(1 - dd / np.R, 2) * (3 - 2 * (1 - dd / np.R)) ; px2 = qx + np.dx * wv; pyS = np.dy * wv; } }
                    const fx = onTent ? midX + (qx - midX) * bh2 / th : midX + srcOff(px2 - midX, sg), fy = onTent ? qy : yn + pyS / kyAt(yn), ix = Math.floor(fx), iy = Math.floor(fy); if (ix < 0 || iy < 0 || ix >= CW - 1 || iy >= CH - 1) continue;
                    const ax = fx - ix, ay = fy - iy, p00 = (iy * CW + ix) * 4, p10 = p00 + 4, p01 = p00 + CW * 4, p11 = p01 + 4;
                    const a00 = sp[p00 + 3] * (1 - ax) * (1 - ay), a10 = sp[p10 + 3] * ax * (1 - ay), a01 = sp[p01 + 3] * (1 - ax) * ay, a11 = sp[p11 + 3] * ax * ay, at = a00 + a10 + a01 + a11;
                    if (at < 1) continue;
                    od[o4] = (sp[p00] * a00 + sp[p10] * a10 + sp[p01] * a01 + sp[p11] * a11) / at; od[o4 + 1] = (sp[p00 + 1] * a00 + sp[p10 + 1] * a10 + sp[p01 + 1] * a01 + sp[p11 + 1] * a11) / at; od[o4 + 2] = (sp[p00 + 2] * a00 + sp[p10 + 2] * a10 + sp[p01 + 2] * a01 + sp[p11 + 2] * a11) / at; od[o4 + 3] = groundRow < 1e8 && groundRow - qy < 16 ? at * Math.max(0.1, (groundRow - qy) / 16) : at;
                  }
                }
                // FROM THE SHOULDER TO THE BUST. Laynie's marks on the student outfit (Oct 13): a green line each side, straight
                // from the shoulder strap down to the widest point of the breast. The cloth had been following the round
                // top of each breast in, leaving a notch between the strap and the bust. Cloth held at the shoulder and
                // pushed out by the breast is taut between the two: a straight line. So on a piece that's cloth over the
                // breasts, each row from the shoulder down to the middle of the bust is let out, at its outer part only, until
                // its edge is on that line. (The middle of the row, the front of the bust, isn't touched.)
                // (Each side is worked on its own. An off-the-shoulder top has cloth to the shoulder on one side and a bare
                // shoulder on the other, and taking one width for both pulled cloth up over the bare one.)
                if (tentOn) {
                  const midR = midX - x0, jEnd = Math.min(bh - 1, Math.round(bcy - y0)), side = S2.bx + S2.ro, row = new Uint8ClampedArray(bw * 4);
                  for (const sg2 of [-1, 1]) {
                    const halfOf = (j) => { const o = j * bw * 4; let far = 0; for (let d = 1; d < bw; d++) { const i = Math.round(midR + sg2 * d); if (i < 0 || i >= bw) break; if (od[o + i * 4 + 3] > 40) far = d; } return far; };
                    let j0 = -1, top = 0; for (let j = 0; j < jEnd; j++) { const hf = halfOf(j); if (hf > 12) { j0 = j; top = hf; break; } }
                    if (j0 < 0 || jEnd - j0 <= 8) continue;
                    for (let j = j0 + 1; j <= jEnd; j++) {
                      const hf = halfOf(j), want = top + (side - top) * (j - j0) / (jEnd - j0); if (hf < 8 || want <= hf + 1) continue;
                      const o = j * bw * 4, inner = 0; row.set(od.subarray(o, o + bw * 4));   /* the whole half-row is let out evenly: letting out only its outer part smeared the dark shading at a top's edge into a wide dark wing */
                      for (let d = 1; d <= want; d++) { const i = Math.round(midR + sg2 * d); if (i < 0 || i >= bw) break;
                        const si = Math.round(midR + sg2 * (inner + (d - inner) * (hf - inner) / (want - inner))); if (si < 0 || si >= bw) continue;
                        od[o + i * 4] = row[si * 4]; od[o + i * 4 + 1] = row[si * 4 + 1]; od[o + i * 4 + 2] = row[si * 4 + 2]; od[o + i * 4 + 3] = row[si * 4 + 3]; }
                    }
                  }
                }
                const T = document.createElement("canvas"); T.width = bw; T.height = bh; T.getContext("2d").putImageData(out, 0, 0);
                const hole = document.createElement("canvas"); hole.width = bw; hole.height = bh; hole.getContext("2d").putImageData(hi, 0, 0);
                g.globalCompositeOperation = "destination-out"; g.drawImage(hole, x0, y0); g.globalCompositeOperation = "source-over";
                // FORM. Cloth laid over them flat reads as a slab: a black top came out as one black block (Laynie, Oct 13:
                // "completely unflattering"). What makes a clothed breast read as a breast is light: the shadow it throws on
                // the cloth under it, the darkness underneath where it turns away, the shadow down between the two, a
                // little light on top, and the line of its underside. All of that is put on the cloth here, and only on
                // the cloth (never on bare skin): each of these is laid over what's already drawn and nowhere else.
                const atop = (draw) => { g.save(); g.globalCompositeOperation = "source-atop"; draw(); g.restore(); };
                const ell = (k, grow, dy) => { g.beginPath(); g.ellipse(bcx[k] + (k ? 1 : -1) * (S2.ro - S2.ri) / 2, bcy + (dy || 0), (S2.ro + S2.ri) / 2 + grow, S2.rv + grow, 0, 0, Math.PI * 2); };
                // the shadow they throw on the piece below them
                g.drawImage(T, x0, y0);
                // (This shadow was landing on the breasts themselves as well as under them, darkening the whole front of every top by a
                // quarter: discs of a different colour on the pink T-shirt, the maid's white, the bra. Laynie, Oct 13: "weird
                // coloring issues". It's kept off them now: it falls only below their undersides. And the darkening
                // underneath each one is half what it was, and starts lower.)
                atop(() => { g.beginPath(); g.rect(0, 0, CW, CH); for (let k = 0; k < 2; k++) g.ellipse(bcx[k] + (k ? 1 : -1) * (S2.ro - S2.ri) / 2, bcy, (S2.ro + S2.ri) / 2 + 1, S2.rv + 1, 0, 0, Math.PI * 2); g.clip("evenodd");
                  g.beginPath(); g.rect(0, bcy + S2.rv * 0.55, CW, CH); g.clip();
                  g.filter = "blur(4px)"; g.fillStyle = "rgba(0,0,0,0.20)"; for (let k = 0; k < 2; k++) { ell(k, -6, 6 + S2.rv * 0.05); g.fill(); } });
                atop(() => { for (let k = 0; k < 2; k++) { g.save(); ell(k, 1, 0); g.clip();
                    const under = g.createLinearGradient(0, bcy + S2.rv * 0.5, 0, bcy + S2.rv); under.addColorStop(0, "rgba(0,0,0,0)"); under.addColorStop(1, "rgba(0,0,0,0.16)");
                    g.fillStyle = under; g.fillRect(0, bcy, CW, S2.rv + 4);
                    const hx = bcx[k] - S2.ro * 0.18, hy = bcy - S2.rv * 0.38, light = g.createRadialGradient(hx, hy, 0, hx, hy, S2.rv * 0.6); light.addColorStop(0, "rgba(255,255,255,0.04)"); light.addColorStop(1, "rgba(255,255,255,0)");
                    g.fillStyle = light; g.fillRect(0, 0, CW, CH); g.restore(); }
                  // down between them
                  const cl = g.createLinearGradient(midX - S2.ri * 0.3, 0, midX + S2.ri * 0.3, 0); cl.addColorStop(0, "rgba(0,0,0,0)"); cl.addColorStop(0.5, "rgba(0,0,0,0.14)"); cl.addColorStop(1, "rgba(0,0,0,0)");
                  g.save(); g.beginPath(); for (let k = 0; k < 2; k++) g.ellipse(bcx[k] + (k ? 1 : -1) * (S2.ro - S2.ri) / 2, bcy, (S2.ro + S2.ri) / 2, S2.rv, 0, 0, Math.PI * 2); g.clip(); g.fillStyle = cl; g.fillRect(midX - S2.ri * 0.3, bcy - S2.rv * 0.35, S2.ri * 0.6, S2.rv * 1.3); g.restore();
                  // the line of the underside
                  g.strokeStyle = "rgba(0,0,0,0.42)"; g.lineWidth = 1.5; g.lineCap = "round";
                  for (let k = 0; k < 2; k++) { g.beginPath(); g.ellipse(bcx[k] + (k ? 1 : -1) * (S2.ro - S2.ri) / 2, bcy, (S2.ro + S2.ri) / 2, S2.rv, 0, Math.PI * 0.08, Math.PI * 0.92); g.stroke(); } });
              }
              if (BREAST.out.size > 60) BREAST.out.clear(); BREAST.out.set(key, c);
            }
            real[name](c, x - c.MX, y - c.MY, o); return true;
          };
          // the piece's own colour, out of its picture (for one worn in the game's own colours, with no tint to go by)
          const ownColour = (src, im) => {
            const key = "col|" + src; let v = BREAST.cover.get(key); if (v) return v;
            const c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight; const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(im, 0, 0);
            const d = g.getImageData(0, 0, c.width, c.height).data, px = [];
            for (let i = 0; i < d.length; i += 16) if (d[i + 3] > 200) px.push([d[i], d[i + 1], d[i + 2]]);
            px.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
            v = px.length ? px[Math.floor(px.length * 0.6)] : [40, 40, 44]; BREAST.cover.set(key, v); return v;
          };
          const strapBase = {};   // the first picture of each piece carries the straps; its other layers just step out of the way
          const strapDraw = (name, src, x, y, o, piece) => {
            const B = ctx.breast, im = B && mouldImg(src); if (!im) return false;
            if (!strapBase[piece.key]) strapBase[piece.key] = src;
            const base = strapBase[piece.key] === src, R = STRAPS[piece.name], tinted = !!(o && o.HexColor);
            const key = "strap|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig + "|" + (tinted ? 1 : 0);
            let c = BREAST.out.get(key);
            if (!c) {
              const MX = 220, MY = 420, w = im.naturalWidth, h = im.naturalHeight, S2 = B.S;
              c = document.createElement("canvas"); c.width = w + MX * 2; c.height = h + MY * 2; c.MX = MX; c.MY = MY;
              const g = c.getContext("2d"), ox = MX + B.rx - x, oy = MY + B.ry - y;
              const P = (sd, t) => { const p = FarmBreasts.point(S2, sd, t); return [ox + p[0], oy + p[1]]; };
              const arc = (sd, from, to) => { g.beginPath(); for (let j = 0; j <= 60; j++) { const p = P(sd, from + (to - from) * j / 60); if (j) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); } };
              g.drawImage(im, MX, MY);
              g.globalCompositeOperation = "destination-out"; for (const sd of [-1, 1]) { arc(sd, 0, Math.PI * 2); g.closePath(); g.fill(); } g.globalCompositeOperation = "source-over";
              if (base) {
                const col = tinted ? [205, 205, 205] : ownColour(src, im), k = (m) => "rgb(" + col.map((v) => Math.max(0, Math.min(255, Math.round(v * m)))).join(",") + ")";
                const grow = 1 + 0.5 * S2.k;
                // a strap: a dark edge, the leather, and a thin shine along it
                const strap = (wd, path) => { g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = k(0.35); g.lineWidth = wd + 2.2; path(); g.stroke(); g.strokeStyle = k(1); g.lineWidth = wd; path(); g.stroke(); g.strokeStyle = tinted ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)"; g.lineWidth = Math.max(1, wd * 0.22); g.save(); g.translate(-wd * 0.18, -wd * 0.18); path(); g.stroke(); g.restore(); };
                const side = (sd, draw) => { g.save(); g.beginPath(); if (sd < 0) g.rect(0, 0, ox, c.height); else g.rect(ox, 0, c.width - ox, c.height); g.clip(); draw(); g.restore(); };
                const nipY = oy + S2.by + S2.r * (-0.15 + 0.42 * S2.k), topY = oy + S2.by - S2.r * S2.top, botY = oy + S2.by + S2.r * (1 + S2.sag);
                if (R.across) { const wd = S2.r * R.across; for (const sd of [-1, 1]) side(sd, () => strap(wd, () => { g.beginPath(); g.moveTo(ox + sd * (S2.bx + S2.r * 1.02), nipY - S2.r * 0.1); g.quadraticCurveTo(ox + sd * S2.bx, nipY + S2.r * 0.22, ox, nipY - S2.r * 0.05); })); }
                if (R.over) { const wd = R.over * grow, yy = oy + S2.by - S2.r * 0.62; for (const sd of [-1, 1]) side(sd, () => strap(wd, () => { g.beginPath(); g.moveTo(ox + sd * (S2.bx + S2.r * 0.86), yy); g.quadraticCurveTo(ox + sd * S2.bx, yy + S2.r * 0.16, ox, yy - S2.r * 0.02); })); }
                if (R.under) { const wd = R.under * grow; for (const sd of [-1, 1]) side(sd, () => strap(wd, () => (sd > 0 ? arc(sd, -0.02 * Math.PI, Math.PI * 1.04) : arc(sd, Math.PI * 1.02, -0.04 * Math.PI)))); }
                if (R.ring) { const wd = R.ring * grow; for (const sd of [-1, 1]) side(sd, () => strap(wd, () => { arc(sd, 0, Math.PI * 2); g.closePath(); })); }
                if (R.cross) { const wd = R.cross * grow; for (const sd of [-1, 1]) strap(wd, () => { const a = P(sd, -Math.PI / 2), b = P(-sd, Math.PI * (sd > 0 ? 0.72 : 0.28)); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }); }
                if (R.centre) { const wd = R.centre * grow; strap(wd, () => { g.beginPath(); g.moveTo(ox, topY + S2.r * 0.25); g.lineTo(ox, botY - S2.r * 0.1); }); }
              }
              if (BREAST.out.size > 60) BREAST.out.clear(); BREAST.out.set(key, c);
            }
            real[name](c, x - c.MX, y - c.MY, o); return true;
          };
          const held = [];
          // The lactation pump is one picture: two cups, a Y of tube, a long hose, and the pump with its bottle down by her
          // leg. Moved and grown as a whole, like other nipple gear, the bottle went with one breast and grew, and the
          // hoses crossed (Laynie, Oct 14: "the milker attachment looks odd too. I don't mind if we can make the hose
          // stretch, if we can do it without affecting the lactation pump part"). So it's taken apart: the PUMP stays
          // exactly where and what it is; each CUP goes on her nipple; the Y is drawn from each cup to where they meet,
          // under and between her breasts; and the HOSE is the game's own hose, stretched to run from there to the pump.
          const PUMP = { cups: [[188, 296, 40, 42], [272, 296, 40, 42]], cupMid: [[207, 316], [293, 316]], join: [250, 376], pumpTop: 700 };
          const pumpDraw = (name, src, x, y, o) => {
            const B = ctx.breast, im = B && mouldImg(src); if (!im || im.naturalHeight < 900) return false;
            const key = "pump|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig;
            let c = BREAST.out.get(key);
            if (!c) {
              const MX = 320, MY = 200, w = im.naturalWidth, h = im.naturalHeight;
              c = document.createElement("canvas"); c.width = w + MX * 2; c.height = h + MY * 2; c.MX = MX; c.MY = MY;
              const g = c.getContext("2d"), N = B.nips.map((p) => [p[0] - x, p[1] - y]);   // her nipples, in the picture's own coordinates
              const jx = (N[0][0] + N[1][0]) / 2, jy = Math.min(PUMP.pumpTop - 90, Math.max(N[0][1], N[1][1]) + 40 + 30 * B.k);
              g.drawImage(im, 0, PUMP.pumpTop, w, h - PUMP.pumpTop, MX, MY + PUMP.pumpTop, w, h - PUMP.pumpTop);                       // the pump and bottle: untouched
              for (let yy = Math.round(jy); yy < PUMP.pumpTop; yy++) { const t = (yy - jy) / (PUMP.pumpTop - jy), sy = PUMP.join[1] + t * (PUMP.pumpTop - PUMP.join[1]); g.drawImage(im, 0, sy, w, 1, MX + (jx - PUMP.join[0]) * (1 - t), MY + yy, w, 1); }   // the hose: stretched, its top end brought to the join
              g.lineCap = "round"; g.lineJoin = "round";
              for (const [col, wd] of [["rgba(120,126,134,0.9)", 6.5], ["rgba(232,236,240,0.95)", 4.2]]) { g.strokeStyle = col; g.lineWidth = wd; for (let i = 0; i < 2; i++) { g.beginPath(); g.moveTo(MX + N[i][0], MY + N[i][1] + 10); g.quadraticCurveTo(MX + N[i][0] + (jx - N[i][0]) * 0.25, MY + jy - 6, MX + jx, MY + jy + 4); g.stroke(); } }   // the Y: a tube from each cup down to the join
              PUMP.cups.forEach(([sx, sy, sw, sh], i) => g.drawImage(im, sx, sy, sw, sh, MX + N[i][0] - (PUMP.cupMid[i][0] - sx), MY + N[i][1] - (PUMP.cupMid[i][1] - sy), sw, sh));   // the cups: on her nipples, their own size
              if (BREAST.out.size > 60) BREAST.out.clear(); BREAST.out.set(key, c);
            }
            real[name](c, x - c.MX, y - c.MY, o); return true;
          };
          const nipDraw = (name, src, x, y, o) => {
            if (/LactationPump/.test(src)) { try { if (pumpDraw(name, src, x, y, o)) return true; } catch (e) { console.warn("[studio] pump:", e); } }
            const B = ctx.breast, im = B && mouldImg(src); if (!im) return false;
            const split = Math.max(0, Math.min(im.naturalWidth, Math.round(B.mid - x))), own = nipHalves(src, split); if (!own) return false;
            if (!ctx.native && groupOf(src) === "Nipples") ctx.native = own.map((p) => p && [x + p[0], y + p[1]]);   // where the game has the nipples
            const key = src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig + "|" + (ctx.native ? "n" : "o");
            let c = BREAST.out.get(key);
            if (!c) {
              const MX = 320, MY = 460, w = im.naturalWidth, h = im.naturalHeight, kN = B.kN;
              c = document.createElement("canvas"); c.width = w + MX * 2; c.height = h + MY * 2; c.MX = MX; c.MY = MY;
              const g = c.getContext("2d");
              [[0, split], [split, w - split]].forEach(([sx, sw], i) => {
                if (sw <= 0) return;
                const N = (ctx.native && ctx.native[i]) || (own[i] && [x + own[i][0], y + own[i][1]]); if (!N) return;
                const T = B.nips[i];
                g.drawImage(im, sx, 0, sw, h, MX + (T[0] - x) + (sx + x - N[0]) * kN, MY + (T[1] - y) + (y - N[1]) * kN, sw * kN, h * kN);
              });
              if (BREAST.out.size > 60) BREAST.out.clear(); BREAST.out.set(key, c);
            }
            real[name](c, x - c.MX, y - c.MY, o); return true;
          };
          const before = (src, x, y, o) => { if (done || typeof src !== "string") return; if (src.includes("/BodyUpper/") && fit.on && fit.behind) { upper = [x, y, src, o && o.HexColor]; paint(); return; } if (gate ? gate(src) : (lower && prio(src) > 12)) paint(); };
          let upperSkin = null;
          const after = (src, x, y, o) => { if (typeof src !== "string") return; if (src.includes("/BodyUpper/")) { try { upperSkin = bellySkin(src, o && o.HexColor, FarmBelly.bellyPose(src)); } catch (e) { /* the usual colour */ } upper = [x, y, src, o && o.HexColor]; ctx.bodies.push({ src, x, y }); } if (src.includes("/BodyLower/")) { lower = true; ctx.bodies.push({ src, x, y }); } };
          const wrap = (name) => (typeof real[name] === "function" ? (src, x, y, o) => {
            const blink = /Blink$/.test(name);
            if (!blink) { try { before(src, x, y, o); } catch (e) { console.warn("[studio] belly:", e); } }
            if (br && typeof src === "string") { const gname = groupOf(src);
              if (!done && gname === "Nipples") { held.push([name, src, x, y, o]); return; }
              if (done && NIP_GROUPS.has(gname)) { try { if (nipDraw(name, src, x, y, o)) return; } catch (e) { console.warn("[studio] nipples:", e); } }
              // A decal (lettering, a logo, a mark) is its own piece, sitting on the chest. Grown with the chest it's the game's
              // picture blown up, and lettering goes soft and fat (Laynie, Oct 13: "the hornywood decal isn't part of the
              // shirt"). So a decal is never grown: it's the game's own picture at its own size, moved down to where that
              // part of her chest now is.
              if (done && /Decal/i.test(gname) && ctx.breast && ctx.breast.pose !== "AllFours") {
                try { const p0 = edgesOf(src); if (p0) { let t0 = -1, t1 = -1; for (let j = 0; j < p0.h; j++) if (p0.L[j] >= 0) { if (t0 < 0) t0 = j; t1 = j; }
                    if (t0 >= 0) { const cyL = y + (t0 + t1) / 2 - ctx.breast.uy; real[name](src, x, y + (ctx.breast.fit.mapY(cyL) - cyL), o); return; } } } catch (e) { console.warn("[studio] decal:", e); }
              }
              if (done && chestSlot(gname) && !/Decal/i.test(gname) && !isMoulded(src)) { const piece = pieceOf(src), how = (piece && BREAST.wear[piece.key]) || "";
                try { const im0 = piece && ctx.breast && mouldImg(src); if (im0 && chestCover(src, im0, x, y, ctx.breast, true) >= 0.05) ctx.seen[piece.key] = true; if (im0 && chestCover(src, im0, x, y, ctx.breast, false) >= 0.012) ctx.seen["on:" + piece.key] = true; if (im0 && chestCover(src, im0, x, y, ctx.breast, false) >= 0.6) ctx.seen["solid:" + piece.key] = true; } catch (e) { /* only a measurement */ }
                try { if (how === "behind") { if (handDraw(name, src, x, y, o)) return; }
                  else if (how !== "plain" && BREAST.dress) { if (dressDraw(name, src, x, y, o)) return; } }   /* ("nipple" goes through dressDraw too: it reads the choice itself) */ catch (e) { console.warn("[studio] chest wear:", e); } }
              // Hands, and what's worn on the wrists and arms. They're the game's own pictures and they stay WHOLE: either in
              // front of the breasts, as the game has them, or hidden behind them. Never cut through. (I had the breasts'
              // outline cut out of them, and at the sizes where it crossed the knuckles it left torn hands with the
              // wrists and shirt cuffs gone. Laynie, Oct 13: "the hands also look scuffed and messy… they shouldn't, if
              // they are the default hands".) Which it is goes by how much of the hands the breasts would cover: under
              // most of them, the hands are in front, resting under the breasts; over most of them, they're behind.
              // Cuffs and arm gear go with the hands, whichever way that is.
              // (And only if asked. A hand in the game is more than the two hand pictures: nails, rings, gloves, the cuffs of a
              // sleeve, a fishnet arm are each their own piece in their own slot, and hiding "the hands" left all of those
              // hanging there without them: Laynie's own outfit, Oct 13, "what is up with the hands?". Left alone, the game
              // draws them all together, in front, and that is always right. So that's the default.)
              /* (only what is worn ON the hands and wrists: ropes, harnesses, binders and jackets in the arms slot are bondage on the body, and treated as hands they vanished. Found in the catalogue, Oct 14.) */
              if (done && BREAST.tuck && (HAND_GROUPS.has(gname) || (ARM_GROUPS.has(gname) && !/Rope|Harness|Binder|Jacket|Strait|Dress|Suit|Belt|Yoke|Pillory|Chain|Web|Tape|Bondage/i.test(src.slice(src.lastIndexOf("/") + 1))) || /Hand|Glove|Nail|Ring|Bracelet|Sleeve/i.test(gname)) && ctx.breast && ctx.breast.pose !== "AllFours") {
                try { if (/^Hands/.test(gname)) { const fr = handHidden(src, x, y); if (fr != null) ctx.handF = Math.max(ctx.handF || 0, fr); } } catch (e) { console.warn("[studio] hands:", e); }
                // Her breasts hang IN FRONT of her hands (Laynie, Oct 13: "the hands don't layer properly with the breast"): the
                // hands were being drawn over the underside of them, or else vanishing whole. So each hand picture, and
                // what's worn on it, is drawn with exactly the breasts' outline taken out of it: what the breast hangs in
                // front of is hidden, the rest shows, and the edge between is the breast's own drawn edge.
                try { if (handDraw(name, src, x, y, o)) return; } catch (e) { console.warn("[studio] hands:", e); }
              } }
            // a drawn cock, in place of the game's picture of one (soft or hard, whichever the game was about to draw)
            if (GEN.drawn && window.FarmCock && typeof src === "string" && groupOf(src) === "Pussy" && /Penis/.test(src)) {
              try { const hard = /\/Hard\//.test(src), skin = upperSkin || FarmBelly.FALLBACK.White;
                const key = [GEN.kind, GEN.knot, GEN.inches, GEN.girth, GEN.balls, hard, skin.join(",")].join("|");
                if (GEN.cvKey !== key) { GEN.cv = FarmCock.canvas({ kind: GEN.kind, knot: GEN.knot, inches: GEN.inches, girth: GEN.girth, balls: GEN.balls, hard, skin }); GEN.cvKey = key; }
                if (hard) { if (!blink) ctx.cock = [GEN.cv, x + 49.5 - GEN.cv.ax, y + 110 - GEN.cv.ay]; return; }   // standing: held back, and drawn once the belly is on, in front of it
                real[blink ? "drawImageBlink" : "drawImage"](GEN.cv, x + 49.5 - GEN.cv.ax, y + 110 - GEN.cv.ay, {}); return; } catch (e) { console.warn("[studio] cock:", e); }
            }
            let drawn = false;
            try { if (ctx.belly && !fit.behind && typeof src === "string") { const q = isMoulded(src), m = q ? mouldCanvas(src, x, y, ctx, q.key, q.mode) : bellyAuto(src, x, y, ctx, fit.behind, (pieceOf(src) || {}).key); if (m) { real[name](m, x - MOULD.M, y, o); drawn = true; } } } catch (e) { console.warn("[studio] mould:", e); }
            if (!drawn) real[name](src, x, y, o);
            if (!blink) { try { after(src, x, y, o); } catch (e) { console.warn("[studio] belly:", e); } }
          } : real[name]);
          cb = Object.assign({}, real, { drawImage: wrap("drawImage"), drawImageColorize: wrap("drawImageColorize"), drawImageBlink: wrap("drawImageBlink"), drawImageColorizeBlink: wrap("drawImageColorizeBlink") });
          finish = paint;
        }
      } catch (e) { console.warn("[studio] belly hook:", e); }
      const out = game(C, cb);
      if (finish) { try { finish(); } catch (e) { console.warn("[studio] belly:", e); } }
      if (finish && seenNow && handFNow && handFNow.v != null) { const behind = handFNow.v >= 0.45;   /* (Laynie, Oct 13: "hands should be hidden once breasts exceed a certain size". Hidden means all of them, with what's on them: never part.) */ if (behind !== !!BREAST.handsBehind) { BREAST.handsBehind = behind; clearTimeout(BREAST.holdT); BREAST.holdT = setTimeout(bellyDraw, 40); } }
      if (finish && seenNow) { const sig = Object.keys(seenNow).sort().join("|"); if (sig !== BREAST.holdSig) { BREAST.holds = seenNow; BREAST.on = {}; for (const k of Object.keys(seenNow)) if (k.startsWith("on:")) BREAST.on[k.slice(3)] = true; BREAST.solid = {}; for (const k of Object.keys(seenNow)) if (k.startsWith("solid:")) BREAST.solid[k.slice(6)] = true; BREAST.holdSig = sig; clearTimeout(BREAST.holdT); BREAST.holdT = setTimeout(bellyDraw, 40); } }
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
    panel(); S.ready = true; loadFits(false); loadItemFits(); loadBreasts(false);
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
