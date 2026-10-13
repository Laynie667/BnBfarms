/* THE B&B OUTFIT STUDIO (studio/web/studio.js)
   Runs on top of the game's own page, served from your own computer (studio/server.mjs), signed in to nothing.
   The game's code is only used to DRAW: it builds a character exactly the way the game does, so every outfit,
   restraint, pose and colour here looks the way it would in the game.

   Step 1: a character on screen · paste an outfit code and see it worn · body size, skin, pose · copy the code back out.
   Step 2: pick any item from any slot and try it on · colour it · see what's worn and take pieces off.
   The codes are the ones WCE and BCX export: the outfit's list of items as JSON, packed with LZString to base64
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
    return list.filter((b) => b && typeof b.Group === "string" && typeof b.Name === "string");
  }
  const encode = (C) => LZString.compressToBase64(JSON.stringify(ServerAppearanceBundle(C.Appearance)));

  // put a list of items on the character. keepBody: the code only replaces what it names; everything else stays.
  function wear(list) {
    const C = S.C, named = new Set(list.map((b) => b.Group));
    const keep = ServerAppearanceBundle(C.Appearance).filter((b) => !named.has(b.Group));
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
    ServerAppearanceLoadFromBundle(S.C, S.C.AssetFamily, b, undefined); redraw();
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
    redraw();
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
    if (was && was.Asset.Name === name) { InventoryRemove(S.C, group, false); say("Off: " + name + "."); }
    else {
      InventoryWear(S.C, name, group, null, null, null, null, false);
      const now = worn(group);
      say(now && now.Asset.Name === name ? "On: " + itemName(now.Asset) + "  (the game calls it " + group + " / " + name + ")" : "The game wouldn't put that on.", !(now && now.Asset.Name === name));
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
    box.replaceChildren(...list.map((a) => $("button", { type: "button", textContent: slotName(a.Asset.Group) + ": " + itemName(a.Asset) + "  ✕", title: "Take it off", onclick: () => { InventoryRemove(S.C, a.Asset.Group.Name, false); redraw(); } })),
      list.length ? "" : $("p", { className: "note", textContent: "Bare." }));
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
        $("button", { type: "button", className: "go", textContent: "Put it on", onclick: () => { try { const n = wear(decode(box.value)); say(n + " pieces put on. Anything the code didn't name was left as it was."); } catch (e) { say(String(e && e.message || e), true); } } }),
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
    S.C = CharacterLoadSimple("FarmStudio");
    CharacterAppearanceSetDefault(S.C);
    CharacterRefresh(S.C, false, false);
    panel(); S.ready = true;
    window.FarmStudio = { S, wear, decode, encode, setBody, setSkin, setPose, redraw, putOn, tint, slots };   // for poking at from the console
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
