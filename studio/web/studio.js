/* THE B&B OUTFIT STUDIO (studio/web/studio.js)
   Runs on top of the game's own page, served from your own computer (studio/server.mjs), signed in to nothing.
   The game's code is only used to DRAW: it builds a character exactly the way the game does, so every outfit,
   restraint, pose and colour here looks the way it would in the game.

   Step 1: a character on screen · paste an outfit code and see it worn · body size, skin, pose · copy the code back out.
   Step 2: pick any item from any slot and try it on · colour it · see what's worn and take pieces off.
   Step 4: click a worn piece to fit it: move, stretch, turn (the whole piece or one layer), change its option ·
           a fit is kept per item, body and pose in studio/fits/items.json and put back when that item is worn again.
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
  const FIT = { picked: null, layer: "", saved: {} };
  const FIT_SLIDERS = [["TranslationX", "Left / right", -250, 250, 1, 0], ["TranslationY", "Up / down", -250, 250, 1, 0], ["ScaleX", "Wider / narrower", 0.3, 2.5, 0.01, 1], ["ScaleY", "Taller / shorter", 0.3, 2.5, 0.01, 1], ["Rotation", "Turn", -180, 180, 1, 0]];
  const fitKey = (it) => it.Asset.Group.Name + "/" + it.Asset.Name + "|" + ((bodyItem("BodyUpper") || { Asset: {} }).Asset.Name || "") + "+" + ((bodyItem("BodyLower") || { Asset: {} }).Asset.Name || "") + "|" + poseKey();
  const fitGet = (it, k, def) => { const p = it.Property || {}; if (FIT.layer) { const rec = p["Layer" + k]; return rec && typeof rec[FIT.layer] === "number" ? rec[FIT.layer] : def; } return typeof p[k] === "number" ? p[k] : def; };
  function fitSet(it, k, v, def) {
    const p = it.Property = it.Property || {};
    if (FIT.layer) { const rec = p["Layer" + k] = Object.assign({}, p["Layer" + k]); if (v === def) delete rec[FIT.layer]; else rec[FIT.layer] = v; if (!Object.keys(rec).length) delete p["Layer" + k]; }
    else if (v === def) delete p[k]; else p[k] = v;
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
  function applySaved(it) { const f = FIT.saved[fitKey(it)]; fitClear(it); if (f) Object.assign(it.Property = it.Property || {}, JSON.parse(JSON.stringify(f))); return !!f; }
  function applyAllSaved() { for (const it of S.C.Appearance) if (it.Asset.Group.Category === "Item" || it.Asset.Group.AllowNone) applySaved(it); }
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
    try { const r = await fetch("/__studio/fits/items.json", { method: "POST", body: JSON.stringify({ v: 1, saved: new Date().toISOString(), note: "key: slot/item|chest+hips|pose", fits: FIT.saved }, null, 1) }); if (!r.ok) throw new Error(await r.text());
      say("Saved the fit for " + itemName(it.Asset) + " on this body in this pose. " + Object.keys(FIT.saved).length + " fits kept in studio\\fits\\items.json."); fillFit(); }
    catch (e) { say("It didn't save: " + (e && e.message || e), true); }
  }
  async function loadItemFits() { try { const d = await (await fetch("/__studio/fits/items.json", { cache: "no-store" })).json(); if (d && d.fits) { FIT.saved = d.fits; applyAllSaved(); fitDraw(); fillFit(); } } catch (e) { /* none yet */ } }

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
  function hookBelly() {
    const game = CommonDrawAppearanceBuild;
    CommonDrawAppearanceBuild = function (C, cb) {
      let finish = null;
      try {
        const fit = C === S.C ? fitNow() : null, real = cb;   // real: the game's own callbacks (the wrapped set below must never call itself)
        if (fit && fit.on && cb && typeof cb.drawImage === "function") {
          let upper = null, lower = false, done = false;
          const gate = FarmBelly.skinGate(C);   // true once a picture comes after all the skin, genitals included
          const prio = (src) => { const m = new RegExp("/Assets/[^/]+/([^/]+)/").exec(src); const g = m && AssetGroupGet(C.AssetFamily, m[1]); return g && typeof g.DrawingPriority === "number" ? g.DrawingPriority : 99; };
          const paint = () => {
            if (done || !upper) return; done = true;
            const shape = { rx: fit.rx, ry: fit.ry, sag: fit.sag, cut: fit.cut };
            const cv = FarmBelly.bellyCanvas(shape, bellySkin(upper[2], upper[3], FarmBelly.bellyPose(upper[2])), !!fit.flat);
            // hung from just under the ribs, then moved by the sliders; pressed flat, its ground line is what the sliders place
            const dx = upper[0] + 250 - cv.width / 2 + fit.x, dy = upper[1] + 392 + fit.ry * 0.62 - cv.height / 2 + fit.y;
            real.drawImage(cv, dx, dy, {}); if (typeof real.drawImageBlink === "function") real.drawImageBlink(cv, dx, dy, {});
          };
          const before = (src, x, y, o) => { if (done || typeof src !== "string") return; if (src.includes("/BodyUpper/") && fit.behind) { upper = [x, y, src, o && o.HexColor]; paint(); return; } if (gate ? gate(src) : (lower && prio(src) > 12)) paint(); };
          const after = (src, x, y, o) => { if (typeof src !== "string") return; if (src.includes("/BodyUpper/")) upper = [x, y, src, o && o.HexColor]; if (src.includes("/BodyLower/")) lower = true; };
          const wrap = (name) => (typeof real[name] === "function" ? (src, x, y, o) => { try { before(src, x, y, o); } catch (e) { console.warn("[studio] belly:", e); } real[name](src, x, y, o); try { after(src, x, y, o); } catch (e) { console.warn("[studio] belly:", e); } } : real[name]);
          cb = Object.assign({}, real, { drawImage: wrap("drawImage"), drawImageColorize: wrap("drawImageColorize") });
          finish = paint;
        }
      } catch (e) { console.warn("[studio] belly hook:", e); }
      const out = game(C, cb);
      if (finish) { try { finish(); } catch (e) { console.warn("[studio] belly:", e); } }
      return out;
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
    if (window.FarmBelly) hookBelly(); else console.warn("[studio] the belly drawing didn't load: no belly section");
    S.C = CharacterLoadSimple("FarmStudio");
    CharacterAppearanceSetDefault(S.C);
    CharacterRefresh(S.C, false, false);
    panel(); S.ready = true; loadFits(false); loadItemFits();
    window.FarmStudio = { S, wear, decode, encode, setBody, setSkin, setPose, redraw, putOn, tint, slots, BELLY, bellyDraw, saveFits, loadFits, FIT, select, saveFit, fitSet, fitDraw, orderSet, orderNow, colourSet, colourLayers };   // for poking at from the console
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
