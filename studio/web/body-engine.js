/* THE DRAWN BODY (studio/web/body-engine.js)
   The outfit studio's drawing, in one piece, so the studio and the Farmhand Companion draw a body with the very same code.
   It steps into the game's drawing of one character (CommonDrawAppearanceBuild) and lays in: the belly, the breasts from
   DD to R, the nipples and what's worn on them, every worn piece fitted to the breasts and the belly, and the hands.
   Nothing in here talks to anybody or changes the character: it only draws.

   window.FarmBodyEngine(host) makes one. host:
     S        { C }: whose body this is (the studio's own character; the Companion's: you)
     bodyItem (group) → the item worn in that body slot
     setBody  (group, name) → put on that body item (the studio's cup buttons; the Companion never calls it)
     redraw   () → draw the character again (once a picture has loaded, or once what's worn on the chest is known)
     picture  (canvas) → { src, dx, dy }, optional: how a drawing of ours is handed to the game. Without it the drawing
              itself is handed over (the game's newest code takes that; the live game wants a picture's name).
   It needs window.FarmBelly (the belly drawing) and window.FarmBreasts (breasts-drawing.js) loaded first.
   draw(C, cb, game) is the step itself: game(cb) is the game's own drawing, with whatever brushes it's handed.
*/
(() => {
window.FarmBodyEngine = function (host) {
  "use strict";
  const S = host.S;
  const bodyItem = (g) => host.bodyItem(g);
  const setBody = (g, n) => host.setBody(g, n);
  const bellyDraw = () => { try { host.redraw(); } catch (e) { console.warn("[body] redraw:", e); } };

  // ── the belly ──
  // A fit for each pose: where it sits and what shape it is. "std" is standing, kneeling and every arms pose (the torso
  // is in the same place in all of them). Saved to studio/fits/belly.json by the Save button.
  const FIT0 = () => ({ on: false, rx: 70, ry: 80, sag: 0.22, x: 0, y: 0, behind: false, flat: false, cut: 0.74 });
  const BELLY = { fits: { std: FIT0(), AllFours: Object.assign(FIT0(), { behind: true, y: -60 }), Hogtied: Object.assign(FIT0(), { behind: true, y: -75 }) }, skin: new Map() };
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
        BELLY.skin.set(key, c); bellyDraw();
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
    const m0 = new RegExp("(?:^|/)Assets/[^/]+/(?:Override/[^/]+/)?([^/]+)/").exec(src); if (!m0) return false; if (m0[1] !== "Panties" && !chestSlot(m0[1])) return false;
    // Panties go UNDER: her belly hangs in front of them and hides them, only their sides at her hips showing (Laynie, Oct 14:
    // "panties can be hidden by the large belly").
    if (m0[1] === "Panties") return mouldCanvas(src, x, y, ctx, "under|" + (pieceKey || src), "under");
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
  // THE BUMP UNDER CLOTHES. A piece that covers the belly and is as wide as it already (a long dress, a catsuit's legs,
  // jeans) isn't grown, and lay over her flat, as if there were no belly under it (catalogue with the belly, Oct 14). Two
  // tries at shading it on were taken back: her belly's own light laid on cloth made a pale window, and shading only the
  // piece that covered the belly left a seam where it met the next layer. So: the belly's light and shade, as a FACTOR
  // (darker toward its sides and underneath, a touch lighter where it's lit, never lighter than a tenth), multiplies every
  // layer of everything worn over it, in the cloth's own colour. Every layer the same, so no seam.
  function bellyForm(cv) {
    if (cv.formF !== undefined) return cv.formF;
    const w = cv.width, h = cv.height; let d;
    try { d = cv.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h).data; } catch (e) { return (cv.formF = null); }
    const lum = (i) => d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11, ls = [];
    for (let i = 0; i < d.length; i += 4 * 5) if (d[i + 3] > 250) ls.push(lum(i));
    if (ls.length < 50) return (cv.formF = null);
    ls.sort((p, q) => p - q); const med = ls[Math.floor(ls.length * 0.6)] || 1;
    // the factor as a picture, softened a little (the ink and the navel come through as a soft line, not a hard one)
    const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d", { willReadFrequently: true }), im = g.createImageData(w, h);
    for (let i = 0; i < d.length; i += 4) { const a = d[i + 3] / 255, fr = Math.max(0.62, Math.min(1.1, lum(i) / med)), v = 1 + (fr - 1) * a; im.data[i] = im.data[i + 1] = im.data[i + 2] = Math.round(v * 200); im.data[i + 3] = 255; }
    g.putImageData(im, 0, 0);
    const c2 = document.createElement("canvas"); c2.width = w; c2.height = h; const g2 = c2.getContext("2d", { willReadFrequently: true });
    g2.fillStyle = "rgb(200,200,200)"; g2.fillRect(0, 0, w, h); g2.filter = "blur(1.2px)"; g2.drawImage(c, 0, 0); g2.filter = "none";
    const dd = g2.getImageData(0, 0, w, h).data, F = new Float32Array(w * h);
    for (let i = 0, j = 0; j < F.length; i += 4, j++) F[j] = dd[i] / 200;
    return (cv.formF = { F, w, h });
  }
  // img (a picture or a canvas) drawn with its corner at (sx, sy): a copy with the belly's form on it, or null if it
  // doesn't lie over the belly
  const shadeSeen = new WeakMap();
  function bellyShade(img, sx, sy, ctx) {
    const b = ctx.belly; if (!b || !img) return null;
    const fm = bellyForm(b.cv); if (!fm) return null;
    const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height; if (!w || !h) return null;
    const key = Math.round(sx) + "," + Math.round(sy) + "|" + ctx.sig; let e = shadeSeen.get(img); if (e && e.key === key) return e.out;
    const ox = Math.round(b.dx - sx), oy = Math.round(b.dy - sy), x0 = Math.max(0, ox), y0 = Math.max(0, oy), x1 = Math.min(w, ox + fm.w), y1 = Math.min(h, oy + fm.h);
    let out = null;
    if (x1 > x0 && y1 > y0) {
      const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(img, 0, 0);
      const part = g.getImageData(x0, y0, x1 - x0, y1 - y0), d = part.data; let any = false;
      for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) { const i = ((yy - y0) * (x1 - x0) + (xx - x0)) * 4; if (d[i + 3] < 8) continue; const k = fm.F[(yy - oy) * fm.w + (xx - ox)]; if (Math.abs(k - 1) < 0.01) continue; any = true; d[i] = Math.min(255, d[i] * k); d[i + 1] = Math.min(255, d[i + 1] * k); d[i + 2] = Math.min(255, d[i + 2] * k); }
      if (any) { g.putImageData(part, x0, y0); out = c; }
    }
    shadeSeen.set(img, { key, out }); return out;
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
    // In the usual (auto) way too, a piece that comes down past the middle of the belly to her crotch (a crotch strap, a chain,
    // a swimsuit) is lengthened down the belly so it ends at its underside and tucks under. Her belly hangs lower than her
    // crotch, and a strap that stopped where the game stops it ended in mid-air on the front of the belly (Laynie's marks,
    // Oct 14). Every layer of the piece by the same amount, as "over" does.
    let longSrc = false;
    if (mode === "auto" && ext) {
      const br = bellyRows(ctx), mid = br ? (br.top + br.bottom) / 2 : 0, to = br ? br.bottom - 2 : 0, from = br ? Math.max(ext.top, br.top) : 0;
      /* (only a piece that narrows to her crotch at its end: a catsuit's top ends wide, at her hips, and lengthened it was drawn flat over the whole belly. Found checking the suits, Oct 14.) */
      const ps = pieceSpan(piece, src, x, y), bp0 = ctx.belly.prof || (ctx.belly.prof = edges(ctx.belly.cv, ctx.belly.cv.width, ctx.belly.cv.height)); let endW = 1e9, bW = 0;
      for (let k = 3; k <= 8; k++) { const yy = ext.bottom - k; if (yy >= 0 && yy < 2600 && ps.L[yy] < 1e8) endW = Math.min(endW, ps.R[yy] - ps.L[yy]); }
      for (let j = 0; j < bp0.h; j++) if (bp0.L[j] >= 0) bW = Math.max(bW, bp0.R[j] - bp0.L[j]);
      if (br && endW < bW * 0.45 && ext.bottom > mid && ext.bottom < to - 2 && ext.bottom > from + 4) {
        const a = from - Math.round(y), b = ext.bottom - Math.round(y), b2 = to - Math.round(y);
        if (b > a) { const tall = document.createElement("canvas"); tall.width = w; tall.height = Math.max(h, b2 + 1 + Math.max(0, h - 1 - b)); const tg = tall.getContext("2d");
          if (a > 0) tg.drawImage(im, 0, 0, w, Math.min(a, h), 0, 0, w, Math.min(a, h));
          if (b >= a && a < h) tg.drawImage(im, 0, Math.max(0, a), w, Math.min(h, b + 1) - Math.max(0, a), 0, Math.max(0, a), w, b2 - Math.max(0, a) + 1);
          if (b + 1 < h) tg.drawImage(im, 0, b + 1, w, h - b - 1, 0, b2 + 1, w, h - b - 1);
          im = tall; h = tall.height; longSrc = true; }
      }
    }
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
      if (longSrc) { c.height = h; }
      const spanKey = piece + (longSrc ? "|long" + (ext ? ext.top + "-" + ext.bottom : "") : ""), span = MOULD.span.get(spanKey) || { L: new Float32Array(2600).fill(1e9), R: new Float32Array(2600).fill(-1e9), v: 0 };
      MOULD.span.set(spanKey, span);
      const p0 = longSrc ? edges(im, w, h) : edgesOf(src); let grew = false;
      if (p0) for (let j = 0; j < p0.h; j++) { const yy = Math.round(y) + j; if (p0.L[j] < 0 || yy < 0 || yy >= 2600) continue; if (x + p0.L[j] < span.L[yy]) { span.L[yy] = x + p0.L[j]; grew = true; } if (x + p0.R[j] > span.R[yy]) { span.R[yy] = x + p0.R[j]; grew = true; } }
      if (grew) { span.v++; MOULD.ver++; clearTimeout(MOULD.t); MOULD.t = setTimeout(bellyDraw, 60); }
      const key2 = key + "|span" + span.v; if (MOULD.out.has(key2)) return MOULD.out.get(key2);
      const rowOf = (yy) => { if (yy < 0 || yy >= 2600 || span.L[yy] > 1e8) return null; const j = yy - Math.round(b.dy); if (j < 0 || j >= bp.h || bp.L[j] < 0) return null; const gl = span.L[yy], gr = span.R[yy], bl = b.dx + bp.L[j], br2 = b.dx + bp.R[j]; if (gl > cxs || gr < cxs) return null; return { gl, gr, nl: Math.min(gl, bl), nr: Math.max(gr, br2), bw: br2 - bl }; };
      const strappy = bellyCover(src, x, y, ctx) < 0.35;   /* cloth (a swimsuit) is grown over the belly row by row as before, its narrow crotch too */
      for (let j = 0; j < h; j++) {
        const yy = Math.round(y) + j;
        g.drawImage(im, 0, j, w, 1, M, j, w, 1);
        let gl = 0, gr = 0, nl2 = 0, nr = 0, bw = 0, n2 = 0; for (let d = -4; d <= 4; d++) { const e = rowOf(yy + d); if (e) { gl += e.gl; gr += e.gr; nl2 += e.nl; nr += e.nr; bw += e.bw; n2++; } }
        if (n2 < 5 || !rowOf(yy)) continue; gl /= n2; gr /= n2; nl2 /= n2; nr /= n2;
        if (gr - gl < (strappy ? Math.max(6, bw / n2 * 0.45) : 6) || (nl2 >= gl - 0.5 && nr <= gr + 0.5)) continue;   /* (on a piece that is straps over the belly, not cloth, a strap down the middle narrower than about half the belly lies over it as it is: grown to the belly's width, the Studded Harness's crotch strap became a black blob. Catalogue with the belly, Oct 14.) */
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
  // ── between the legs ── (the studio's drawn cock; drawn: false leaves the game's own)
  const GEN = { inches: 6, box: {}, drawn: true, kind: "human", knot: false, girth: 1, balls: 3, cv: null, cvKey: "" };   // drawn: ours (cock-drawing.js) in place of the game's picture

  // step into the game's drawing of our character: lay the belly in (after all the skin, or before the upper body), and
  // redraw any moulded piece to the new outline
  // game(cb): the game's own drawing, with whatever set of brushes it's handed
  function draw(C, cb, game) {
    {
      let finish = null, seenNow = null, handFNow = null;
      try {
        const fit = C === S.C ? fitNow() : null, br = C === S.C ? breastNow() : null, real = cb;   // real: the game's own callbacks (the wrapped set below must never call itself)
        // put: hand the game something to draw. A drawing of ours goes through host.picture when there is one (the live game
        // only takes pictures by name: see the Companion's body.js); in the studio the drawing itself is handed over.
        const put = (name, img, x, y, o) => { if (typeof img === "string" || !host.picture) return real[name](img, x, y, o); const p = host.picture(img); if (p) return real[name](p.src, x + p.dx, y + p.dy, o); };
        if (fit && cb && typeof cb.drawImage === "function") {
          let upper = null, lower = false, done = false;
          const ctx = { bodies: [], belly: null, sig: "", seen: {} }; if (br) { seenNow = ctx.seen; handFNow = { get v() { return ctx.handF; } }; }
          const slot = new RegExp("(?:^|/)Assets/[^/]+/(?:Override/[^/]+/)?([^/]+)/");
          const groupOf = (src) => { const m = slot.exec(src); return m ? m[1] : ""; };
          // (a piece's pictures are in its slot's folder or the folder of the slot it borrows its art from, named for the piece)
          const mouldList = S.C.Appearance.filter((it) => MOULD.items.has(mouldKey(it))).map((it) => ({ folders: [it.Asset.Group.Name, it.Asset.DynamicGroupName], name: it.Asset.Name, key: mouldKey(it), mode: MOULD.mode.get(mouldKey(it)) || "wide" }));
          const wornList = S.C.Appearance.map((it) => ({ folders: [it.Asset.Group.Name, it.Asset.DynamicGroupName], name: it.Asset.Name, key: mouldKey(it), flat: !!(it.Asset.Prerequisite || []).includes("HasFlatChest") && !InventoryIsItemInList(S.C, "BodyUpper", ["FlatSmall", "FlatMedium"]) })).sort((a, b) => b.name.length - a.name.length);
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
            put("drawImage", cv, dx, dy, {}); if (typeof real.drawImageBlink === "function") put("drawImageBlink", cv, dx, dy, {});
            ctx.belly = { cv, dx, dy };
            ctx.sig = [fit.rx, fit.ry, fit.sag, fit.cut, fit.flat ? 1 : 0, Math.round(dx), Math.round(dy)].join(",") + "|" + ctx.bodies.map((b) => b.src + "@" + Math.round(b.x) + "," + Math.round(b.y)).join(";");
            }
            if (ctx.cock) { const k = ctx.cock; ctx.cock = null; put("drawImage", k[0], k[1], k[2], {}); if (typeof real.drawImageBlink === "function") put("drawImageBlink", k[0], k[1], k[2], {}); }
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
              put("drawImage", bc, rx - bc.ax, ry - bc.ay, {}); if (typeof real.drawImageBlink === "function") put("drawImageBlink", bc, rx - bc.ax, ry - bc.ay, {});
              ctx.breast = { fit: FarmBreasts.fitOf(S3, FarmBelly.bellyPose(upper[2]), [bc.nips[1][0] + br.nipX, bc.nips[1][1] + br.nipY]), held: isHeld, upperSrc: upper[2], ux: upper[0], pose: bpose, ground: bpose === "AllFours" ? ground : Infinity, S: S3, rx, ry, uy: upper[1], mask: bc.mask, mx: rx - bc.ax, my: ry - bc.ay, nips: bc.nips.map((p, i) => [rx + p[0] + (i ? 1 : -1) * br.nipX, ry + p[1] + br.nipY]), k: FarmBreasts.shape(br.cup, br).k, kN: (1 + 0.45 * FarmBreasts.shape(br.cup, br).k) * br.nip, sig: key + "|" + Math.round(rx) + "," + Math.round(ry) + "|" + [br.nip, br.nipX, br.nipY].join(","), mid: upper[0] + 250 };
              // (a pose where the game paints the nipples into the body itself, all fours, gives us none to move: ours then)
              if (!held.length) {
                const B = ctx.breast, sk = bellySkin(upper[2], upper[3], bpose), rad = 7 * B.kN, nc = document.createElement("canvas"); nc.width = nc.height = Math.ceil(rad * 2 + 4);
                const ng = nc.getContext("2d"), gr = ng.createRadialGradient(nc.width / 2, nc.height / 2, 0, nc.width / 2, nc.height / 2, rad), tone = (m, a) => "rgba(" + Math.round(Math.min(255, sk[0] * m)) + "," + Math.round(sk[1] * 0.62 * m) + "," + Math.round(sk[2] * 0.62 * m) + "," + a + ")";
                gr.addColorStop(0, tone(0.92, 1)); gr.addColorStop(0.3, tone(1, 0.95)); gr.addColorStop(0.75, tone(1.02, 0.8)); gr.addColorStop(1, tone(1.02, 0));
                ng.fillStyle = gr; ng.beginPath(); ng.arc(nc.width / 2, nc.height / 2, rad, 0, Math.PI * 2); ng.fill();
                for (const p of B.nips) if (p[1] + rad < B.ground) { put("drawImage", nc, p[0] - nc.width / 2, p[1] - nc.height / 2, {}); if (typeof real.drawImageBlink === "function") put("drawImageBlink", nc, p[0] - nc.width / 2, p[1] - nc.height / 2, {}); }
              }
              for (const h of held.splice(0)) { try { if (!nipDraw(...h)) put(h[0], h[1], h[2], h[3], h[4]); } catch (e) { console.warn("[studio] nipples:", e); } }
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
          /* (what's worn below the waist and reaches up behind her big breasts, a skirt, jeans, a catsuit's legs, is drawn here, and was drawn without her belly: flat over it, the belly hidden. Checking the suits, Oct 14.) */
          const LOWER_GROUPS = /^(Panties|ClothLower|SuitLower|ItemPelvis|ItemVulva|ItemButt|ItemLegs|Garters|Socks)$/;
          const handDraw = (name, src, x, y, o) => {
            const B = ctx.breast, im = B && mouldImg(src); if (!im) return false;
            // (panties, with a belly, are under it: drawn here behind the breasts as the game has them, they were right over the belly.
            // Laynie's marks, Oct 14. Only panties: given the belly's version here, bands under the breasts were stretched out sideways.)
            let bv = null; try { bv = ctx.belly && !fit.behind && LOWER_GROUPS.test(groupOf(src)) ? bellyAuto(src, x, y, ctx, fit.behind, (pieceOf(src) || {}).key) : null; } catch (e) { bv = null; }
            const base = bv || im, ox = bv ? MOULD.M : 0;
            const key = "hand|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig + (bv ? "|b" + ctx.sig + "|" + MOULD.ver + "|" + base.width + "x" + base.height : "") + (ctx.belly ? "|s" + ctx.sig : "");
            let c = BREAST.out.get(key);
            if (!c) { c = document.createElement("canvas"); c.width = base.naturalWidth || base.width; c.height = base.naturalHeight || base.height; const g = c.getContext("2d"); g.drawImage(base, 0, 0); g.globalCompositeOperation = "destination-out"; g.drawImage(B.mask, B.mx - (x - ox), B.my - y);
              /* (and the belly's form on it, if it's worn over the belly: a skirt, jeans, a catsuit's legs, a belt) */
              if (ctx.belly && !fit.behind && chestSlot(groupOf(src)) && groupOf(src) !== "Panties") { try { const sh = bellyShade(c, x - ox, y, ctx); if (sh) c = sh; } catch (e) { console.warn("[body] belly form:", e); } }
              if (BREAST.out.size > 60) BREAST.out.clear(); BREAST.out.set(key, c); }
            put(name, c, x - ox, y, o); return true;
          };
          // ── straps round each breast ──
          // A piece that frames each breast with a strap (over the top, down the sides, under it: the Leather Harness) has
          // nothing ON the breast, so it was drawn behind hers, and the frame was lost, its ends poking out above her breasts
          // as flaps (Laynie's marks, Oct 14). Growing the game's picture made the strap ragged. So the frame is DRAWN: wherever
          // the game's strap runs round its breast, at that same angle a strap of the same width and colour runs round hers,
          // along her outline. The game's own frame is taken out; the rest of the piece (shoulder straps, the crotch) is the
          // game's picture, behind her breasts.
          const frameCover = (src, im, x, y, B) => {
            const key = "fr|" + src + "|" + Math.round(x) + "," + Math.round(y); let v = BREAST.cover.get(key); if (v != null) return v;
            const fm = frameMeasure(src, im, x, y, B); v = fm ? fm.share : 0; BREAST.cover.set(key, v); return v;
          };
          const FRAME_N = 96;
          const frameMeasure = (src, im, x, y, B) => {
            const key = "fm|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.pose; let v = BREAST.out.get(key); if (v !== undefined) return v;
            const w = im.naturalWidth, h = im.naturalHeight, c = document.createElement("canvas"); c.width = w; c.height = h;
            const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, w, h).data;
            const GB = gameBreast(B), R = GB.r, sides = []; let hits = 0, all = 0, top = 0, tAll = 0; const runs = [], cols = [];
            for (const sd of [-1, 1]) { const cx = B.mid + sd * GB.dx - x, cy = B.uy + GB.y - y, hit = [];
              for (let a = 0; a < FRAME_N; a++) { const t = (a / FRAME_N) * Math.PI * 2, ux = Math.cos(t) * sd, uy = Math.sin(t); let r0 = -1, r1 = -1;
                for (let rr = R * 0.8; rr <= R * 1.32; rr += 0.5) { const px = Math.round(cx + ux * rr), py = Math.round(cy + uy * rr); const on = px >= 0 && py >= 0 && px < w && py < h && d[(py * w + px) * 4 + 3] > 60;
                  if (on) { if (r0 < 0) r0 = rr; r1 = rr; const o = (py * w + px) * 4; cols.push(d[o], d[o + 1], d[o + 2]); } else if (r0 >= 0) break; }
                const ok = r0 >= 0 && r1 - r0 >= 1.5 && r1 - r0 <= R * 0.35; hit.push(ok ? [r0, r1] : null); all++; if (ok) { hits++; runs.push(r1 - r0); }
                if (uy < -0.3) { tAll++; if (ok) top++; } }
              /* (small gaps in the game's strap, where a buckle or a stud broke the run, are filled) */
              for (let a = 0; a < FRAME_N; a++) if (!hit[a]) { let p = -1, q = -1; for (let k = 1; k <= 6; k++) { if (p < 0 && hit[(a - k + FRAME_N) % FRAME_N]) p = (a - k + FRAME_N) % FRAME_N; if (q < 0 && hit[(a + k) % FRAME_N]) q = (a + k) % FRAME_N; } if (p >= 0 && q >= 0) hit[a] = [(hit[p][0] + hit[q][0]) / 2, (hit[p][1] + hit[q][1]) / 2, true]; }
              /* (where a strap carries on outward from the top of the frame, a shoulder strap meets it there) */
              const att = []; let grp = [];
              for (let a = 0; a <= FRAME_N; a++) { const k = a % FRAME_N, hr = hit[k], t = (k / FRAME_N) * Math.PI * 2, ux = Math.cos(t) * sd, uy = Math.sin(t); let on = false;
                if (hr && uy < -0.3 && Math.cos(t) > -0.6 && a < FRAME_N) { on = true; for (let q = 2; q <= 7; q++) { const px = Math.round(cx + ux * (hr[1] + q)), py = Math.round(cy + uy * (hr[1] + q)); if (!(px >= 0 && py >= 0 && px < w && py < h && d[(py * w + px) * 4 + 3] > 60)) { on = false; break; } } }
                if (on) grp.push(k); else if (grp.length) { const m = grp[grp.length >> 1], hm = hit[m], tm = (m / FRAME_N) * Math.PI * 2; att.push({ a: m, x: cx + Math.cos(tm) * sd * (hm[1] + 1), y: cy + Math.sin(tm) * (hm[1] + 1) }); grp = []; } }
              sides.push({ sd, cx, cy, hit, att }); }
            /* (the game's harnesses are the same on both sides: a shoulder strap found on one side and not the other is mirrored) */
            if (sides.length === 2) for (const [p, q] of [[0, 1], [1, 0]]) if (!sides[p].att.length && sides[q].att.length) sides[p].att = sides[q].att.map((at) => ({ a: at.a, x: 2 * (B.mid - x) - at.x, y: at.y }));
            if (!runs.length) { BREAST.out.set(key, null); return null; }
            runs.sort((p, q) => p - q); let rr = 0, gg = 0, bb = 0; const n = cols.length / 3; for (let i = 0; i < cols.length; i += 3) { rr += cols[i]; gg += cols[i + 1]; bb += cols[i + 2]; }
            let hiL = 0, hiC = [rr / n, gg / n, bb / n]; for (let i = 0; i < cols.length; i += 3) { const L = cols[i] + cols[i + 1] + cols[i + 2]; if (L > hiL) { hiL = L; hiC = [cols[i], cols[i + 1], cols[i + 2]]; } }
            v = { sides, width: runs[runs.length >> 1] + 1, col: [rr / n, gg / n, bb / n], hi: hiC, share: tAll ? top / tAll : 0, all: hits / all };
            BREAST.out.set(key, v); return v;
          };
          // her outline, seen from the middle of each of her breasts: the edge of the drawn breasts' mask along a ray
          const herOutline = (B) => {
            const key = "ho|" + B.sig; let v = BREAST.out.get(key); if (v) return v;
            const m = B.mask, w = m.width, h = m.height, d = m.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h).data, mid = B.mid - B.mx, cs = [];
            for (const sd of [-1, 1]) { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
              for (let yy = 0; yy < h; yy += 2) for (let xx = 0; xx < w; xx += 2) { if ((xx - mid) * sd < 0 || d[(yy * w + xx) * 4 + 3] <= 60) continue; x0 = Math.min(x0, xx); x1 = Math.max(x1, xx); y0 = Math.min(y0, yy); y1 = Math.max(y1, yy); }
              /* (her breasts' tops slope into her chest, so the mask's own top is a peak: the strap follows the ROUND of the breast,
                 a circle as wide as it, sitting in its bottom, and the mask's edge only where that is nearer. Blown up, a strap on the
                 mask's edge came out as a pointed tent high on her chest.) */
              const rx = (x1 - x0) / 2, cx = (x0 + x1) / 2, cy = y1 - rx, edge = [];
              for (let a = 0; a < FRAME_N; a++) { const t = (a / FRAME_N) * Math.PI * 2, ux = Math.cos(t) * sd, uy = Math.sin(t); let re = 0;
                for (let rr = 2; rr < 400; rr += 1) { const px = Math.round(cx + ux * rr), py = Math.round(cy + uy * rr); if (px < 0 || py < 0 || px >= w || py >= h || d[(py * w + px) * 4 + 3] <= 60) { re = rr; break; } }
                edge.push(Math.min(re, rx)); }
              /* (smoothed, so the strap runs clean) */
              const sm = edge.map((_, a) => { let t = 0; for (let k = -3; k <= 3; k++) t += edge[(a + k + FRAME_N) % FRAME_N]; return t / 7; }); edge.splice(0, FRAME_N, ...sm);
              cs.push({ sd, cx: cx + B.mx, cy: cy + B.my, edge }); }
            v = cs; if (BREAST.out.size > 60) BREAST.out.clear(); BREAST.out.set(key, v); return v;
          };
          const frameDraw = (name, src, x, y, o) => {
            const B = ctx.breast, im = B && mouldImg(src); if (!im || B.pose === "AllFours" || cupNow() <= 5) return false;   /* (Flat to D is the game's own chest: its own picture) */
            const fm = frameMeasure(src, im, x, y, B); if (!fm) return false;
            const key = "frame|" + src + "|" + Math.round(x) + "," + Math.round(y) + "|" + B.sig; let c = BREAST.out.get(key);
            if (!c) {
              const MX = 260, MY = 480, w = im.naturalWidth, h = im.naturalHeight; c = document.createElement("canvas"); c.width = w + MX * 2; c.height = h + MY * 2; c.MX = MX; c.MY = MY;
              const g = c.getContext("2d"); g.drawImage(im, MX, MY);
              // the game's own frame, out
              g.globalCompositeOperation = "destination-out"; g.lineCap = "round";
              for (const sv of fm.sides) for (let a = 0; a < FRAME_N; a++) { const hr = sv.hit[a], t = (a / FRAME_N) * Math.PI * 2; if (!hr || Math.sin(t) >= 0.3) continue;   /* (the inside of it too, though hers isn't drawn there: left in, it hung in her cleavage as a stray V) */ const ux = Math.cos(t) * sv.sd, uy = Math.sin(t);
                g.lineWidth = Math.max(3, (hr[0] + hr[1]) / 2 * Math.PI * 2 / FRAME_N * 1.6); g.beginPath(); g.moveTo(MX + sv.cx + ux * (hr[0] - 1.5), MY + sv.cy + uy * (hr[0] - 1.5)); g.lineTo(MX + sv.cx + ux * (hr[1] + 1.5), MY + sv.cy + uy * (hr[1] + 1.5)); g.stroke(); }
              // and the rest behind her breasts
              g.drawImage(B.mask, MX + B.mx - x, MY + B.my - y);
              g.globalCompositeOperation = "source-over";
              // hers, along her outline, at the same angles
              const ho = herOutline(B), W = fm.width, rgb = (q, k) => "rgb(" + q.map((u) => Math.max(0, Math.min(255, Math.round(u * k)))).join(",") + ")";
              for (const hv of ho) { const sv = fm.sides.find((q) => q.sd === hv.sd); if (!sv) continue;
                const segs = []; let cur = null;
                for (let k = 0; k <= FRAME_N; k++) { const a = k % FRAME_N, ta = (a / FRAME_N) * Math.PI * 2, on = !!sv.hit[a] && hv.edge[a] > 0 && Math.sin(ta) < 0.3 && Math.cos(ta) > -0.6;   /* (over the top and down the outer side only: under her breasts, and down the inside into the cleavage, it stays behind them where the game has it) */
                  if (on) { const t = (a / FRAME_N) * Math.PI * 2, ux = Math.cos(t) * hv.sd, uy = Math.sin(t), rr = hv.edge[a] - W * 0.45; (cur || (cur = [])).push([MX + hv.cx - x + ux * rr, MY + hv.cy - y + uy * rr]); }
                  else if (cur) { segs.push(cur); cur = null; } }
                if (cur) segs.push(cur);
                // (a ring that runs right round: its first and last pieces are one)
                if (segs.length > 1 && sv.hit[0] && sv.hit[FRAME_N - 1]) { const last = segs.pop(); segs[0] = last.concat(segs[0]); }
                const path = (pts) => { g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); };
                g.lineCap = "round"; g.lineJoin = "round";
                /* the shoulder straps, carried on down to where her frame now is */
                for (const at of sv.att || []) { const t = (at.a / FRAME_N) * Math.PI * 2, ux = Math.cos(t) * hv.sd, uy = Math.sin(t), rr = hv.edge[at.a] - W * 0.45;
                  segs.push([[MX + at.x, MY + at.y], [MX + hv.cx - x + ux * rr, MY + hv.cy - y + uy * rr]]); }
                for (const pts of segs) { if (pts.length < 2) continue;
                  path(pts); g.strokeStyle = rgb(fm.col, 0.55); g.lineWidth = W + 1.5; g.stroke();          /* its dark edge */
                  path(pts); g.strokeStyle = rgb(fm.col, 1); g.lineWidth = W; g.stroke();                   /* the strap */
                  path(pts.map((p, i) => { const q = pts[Math.min(pts.length - 1, i + 1)], pp = pts[Math.max(0, i - 1)], dx = q[0] - pp[0], dy = q[1] - pp[1], L = Math.hypot(dx, dy) || 1; return [p[0] - dy / L * W * 0.18, p[1] + dx / L * W * 0.18]; }));
                  g.globalAlpha = 0.55; g.strokeStyle = rgb(fm.hi, 1); g.lineWidth = Math.max(1, W * 0.22); g.stroke(); g.globalAlpha = 1; }   /* a shine along it */
              }
              if (BREAST.out.size > 60) BREAST.out.clear(); BREAST.out.set(key, c);
            }
            put(name, c, x - c.MX, y - c.MY, o); return true;
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
            put(name, c, x - c.MX, y - c.MY, o); return true;
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
          // Pieces whose cloth has a pattern or a grain all over it (flowers, fur, lace, knit, a print): these are laid on her
          // with the pattern repeated at its own size instead of blown up with the breast (see PRINTS AND GRAIN, below). Only
          // these: on a piece whose detail is its make (seams, boning, piping, stitching), repeating it scattered bits of seam
          // about (the leather jacket, the steampunk corset). bl: how soft the copy is that the light and shade are read from
          // (bigger for a bigger pattern); cell: how big each repeated patch is.
          const TEX = { FuzzyDress: {}, FurCoat: {}, FurBolero: {}, DressFur: {}, FlowerDress: { bl: 9, cell: 34 } };   /* (tried and left as they were: the wool coat and sweater (their folds and ribbing scattered), the leather jacket and steampunk corset (seams), the fishnet bikini (bits of strap). Big motifs, cow spots and the flowers on a Chinese dress, can't be repeated from a piece that only has a few of them.) */
          const dressDraw = (name, src, x, y, o) => {
            const B = ctx.breast, im = B && mouldImg(src); if (!im) return false;   // (every pose, all fours too: nothing is drawn below the ground there)
            // A piece that lies ON the breasts is grown with them (and every layer of it: a buckle or a bow goes along). A
            // piece that only props them from under (an underbust corset) holds them but has nothing ON them, so nothing of
            // it is grown: grown, its top trim was landing on the breast (Laynie, Oct 13: "the latex corset shows stuff on
            // the breast"). It's drawn as the game draws it, and the breasts sit in front of its top edge.
            const pk0 = (pieceOf(src) || {}).key;
            if (!BREAST.on[pk0] && chestCover(src, im, x, y, B, false) < 0.012 && frameCover(src, im, x, y, B) >= 0.55) { if (frameDraw(name, src, x, y, o)) return true; }
            if (chestCover(src, im, x, y, B, false) < 0.012 && !BREAST.on[pk0] && underBand(src, im, x, y, B) >= 0.35) BREAST.band[pk0] = true;
            if (BREAST.band[pk0] && !BREAST.on[pk0]) return handDraw(name, src, x, y, o);   /* (a band on her body stays exactly where the game puts it, at any size; her breasts simply hang in front of it. Laynie, Oct 14: "that part shouldn't have moved between sizes". bandDraw, which lowered it, is no longer used.) */
            // a piece that starts below the game's breasts (a waist strap, a belt) is under her bigger ones: they hang in front of it
            if (chestCover(src, im, x, y, B, false) < 0.012 && !BREAST.on[pk0]) { const e0 = edgesOf(src); if (e0) { let t0 = -1; for (let j = 0; j < e0.h; j++) if (e0.L[j] >= 0) { t0 = j; break; } if (t0 >= 0 && y + t0 > B.uy + gameBreast(B).y) return handDraw(name, src, x, y, o); } }   /* (every layer of a banded piece goes the same way: its clasp in the middle too) */
            if (chestCover(src, im, x, y, B, false) < 0.012 && !BREAST.on[pk0])   /* (a rope or a thin strap across the breast covers very little of it, and is still ON it: the box-tie ropes were being taken for an underbust piece and hidden behind her breasts. Found in the catalogue, Oct 14.) */ return BREAST.holds[pk0] ? handDraw(name, src, x, y, o) : false;
            const pc0 = pieceOf(src), flatK = pc0 && pc0.flat ? 0.87 : 1, wm = (pc0 && BREAST.wear[pc0.key]) || "", pin = wm === "nipple" || (wm === "" && !!pc0 && NIP_PIECES.test(pc0.name)), mapYp = pin && B.fit.mapYN ? B.fit.mapYN : B.fit.mapY;
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
              // ENLARGED CLEAN. The game's cloth is drawn in flat shapes with hard edges (its light, its shade, a white
              // front, a trim). Grown two or three times over by plain blending, every hard edge came out as a blurry
              // staircase and the light on a shirt became a blocky white patch (Laynie, Oct 14: "the textures are ugly too,
              // from how they are stretched"). So where a pixel of the grown piece sits on an edge between two flat
              // colours, the edge is found from a slightly softened copy of the picture (which runs smooth between the
              // pixel steps) and drawn crisp along it: a clean curve, one pixel soft, the two colours on either side
              // exactly the game's. Where there is no clean edge (three colours meeting, fine print) it blends as before.
              const spb = (() => { const cb = document.createElement("canvas"); cb.width = CW; cb.height = CH; const gb = cb.getContext("2d", { willReadFrequently: true });
                gb.filter = "blur(1.5px)"; gb.drawImage(c, 0, 0); gb.filter = "none"; return gb.getImageData(0, 0, CW, CH).data; })();
              const sharp = (t, w) => { const u = Math.max(0, Math.min(1, (t - 0.5 + w) / (2 * w))); return u * u * (3 - 2 * u); };
              // one pixel of the grown piece, read from the game's picture at (fx, fy), enlarged `mag` times there
              const sample = (fx, fy, mag, od, o4) => {
                const ix = Math.floor(fx), iy = Math.floor(fy), ax = fx - ix, ay = fy - iy, p00 = (iy * CW + ix) * 4, p10 = p00 + 4, p01 = p00 + CW * 4, p11 = p01 + 4;
                const a00 = sp[p00 + 3] * (1 - ax) * (1 - ay), a10 = sp[p10 + 3] * ax * (1 - ay), a01 = sp[p01 + 3] * (1 - ax) * ay, a11 = sp[p11 + 3] * ax * ay, at = a00 + a10 + a01 + a11;
                let r = 0, gg = 0, bl = 0; if (at >= 1) { r = (sp[p00] * a00 + sp[p10] * a10 + sp[p01] * a01 + sp[p11] * a11) / at; gg = (sp[p00 + 1] * a00 + sp[p10 + 1] * a10 + sp[p01 + 1] * a01 + sp[p11 + 1] * a11) / at; bl = (sp[p00 + 2] * a00 + sp[p10 + 2] * a10 + sp[p01 + 2] * a01 + sp[p11 + 2] * a11) / at; }
                let alpha = at;
                if (mag > 1.15) {
                  const w = Math.max(0.06, Math.min(0.5, 0.3 / mag)), P = [p00, p10, p01, p11];
                  // the softened picture here
                  const b00 = spb[p00 + 3] * (1 - ax) * (1 - ay), b10 = spb[p10 + 3] * ax * (1 - ay), b01 = spb[p01 + 3] * (1 - ax) * ay, b11 = spb[p11 + 3] * ax * ay, bt = b00 + b10 + b01 + b11;
                  // the outline of the piece itself (where it meets nothing)
                  /* (only a hard edge: a soft, feathered one, a leather strap's, came out with a hairy fringe) */
                  let amin = 255, amax = 0, aEnds = 0, aN = 0; for (let yy = iy - 1; yy <= iy + 2; yy++) for (let xx = ix - 1; xx <= ix + 2; xx++) { if (xx < 0 || yy < 0 || xx >= CW || yy >= CH) continue; const a = sp[(yy * CW + xx) * 4 + 3]; aN++; if (a < 20 || a > 235) aEnds++; if (a < amin) amin = a; if (a > amax) amax = a; }
                  if (amax - amin > 140 && aEnds >= aN * 0.75) alpha = amin + (amax - amin) * sharp((bt - amin) / (amax - amin), w);
                  // a colour edge: the opaque pixels round here (four by four) are two flat colours and the game's own blends
                  // of the two along the edge between them. Not a third colour: where three meet it's left as it was.
                  let lo = -1, hi = -1, lmin = 1e9, lmax = -1, n = 0; const Q = [];
                  for (let yy = iy - 1; yy <= iy + 2; yy++) for (let xx = ix - 1; xx <= ix + 2; xx++) { if (xx < 0 || yy < 0 || xx >= CW || yy >= CH) continue; const p = (yy * CW + xx) * 4; if (sp[p + 3] < 200) continue; Q.push(p); n++; const L = sp[p] * 0.3 + sp[p + 1] * 0.59 + sp[p + 2] * 0.11; if (L < lmin) { lmin = L; lo = p; } if (L > lmax) { lmax = L; hi = p; } }
                  if (n >= 2 && bt >= 1) {
                    const dr = sp[hi] - sp[lo], dg = sp[hi + 1] - sp[lo + 1], db = sp[hi + 2] - sp[lo + 2], dd = dr * dr + dg * dg + db * db;
                    if (dd > 900) {
                      /* (and FLAT: most of them right at one colour or the other. Leather, satin, anything shaded smooth or grainy is
                         all in-betweens, and read as an edge it came out ragged: the studded harness. It's left as it was.) */
                      let two = true, ends = 0; for (const p of Q) { const er = sp[p] - sp[lo], eg = sp[p + 1] - sp[lo + 1], eb = sp[p + 2] - sp[lo + 2], u = Math.max(0, Math.min(1, (er * dr + eg * dg + eb * db) / dd)), qr = er - u * dr, qg = eg - u * dg, qb = eb - u * db; if (qr * qr + qg * qg + qb * qb > dd * 0.03 + 60) { two = false; break; } if (u < 0.12 || u > 0.88) ends++; }
                      if (ends < Q.length * 0.5) two = false;
                      if (two) {
                        const br = (spb[p00] * b00 + spb[p10] * b10 + spb[p01] * b01 + spb[p11] * b11) / bt, bg = (spb[p00 + 1] * b00 + spb[p10 + 1] * b10 + spb[p01 + 1] * b01 + spb[p11 + 1] * b11) / bt, bb = (spb[p00 + 2] * b00 + spb[p10 + 2] * b10 + spb[p01 + 2] * b01 + spb[p11 + 2] * b11) / bt;
                        const ts = sharp(((br - sp[lo]) * dr + (bg - sp[lo + 1]) * dg + (bb - sp[lo + 2]) * db) / dd, w), tr = ((r - sp[lo]) * dr + (gg - sp[lo + 1]) * dg + (bl - sp[lo + 2]) * db) / dd;
                        /* (a speck or a hairline the softening would wash away, a button, a stitch, is kept as the game has it) */
                        const t = Math.abs(tr - ts) > 0.65 ? Math.max(0, Math.min(1, tr)) : ts;
                        r = sp[lo] + dr * t; gg = sp[lo + 1] + dg * t; bl = sp[lo + 2] + db * t;
                      }
                    }
                  }
                }
                od[o4] = r; od[o4 + 1] = gg; od[o4 + 2] = bl; od[o4 + 3] = alpha; return alpha;
              };
              // (only down to the underside of the game's breast: below that the piece is on her body, and stays exactly where the game drew it. Review, Oct 14: the studded harness's waist panels were being grown out past her sides.)
              const gUnderY = (G.cy || 330) + (G.rv || 42) + 4, y1 = uyc + G.y1, y2 = uyc + G.y2, y3 = uyc + Math.min(G.y3, gUnderY), flapEnd = uyc + mapYp(Math.min(G.y3, gUnderY));
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
                const fxA = new Float32Array(bw * bh).fill(-1), fyA = new Float32Array(bw * bh), magA = new Float32Array(bw * bh);   /* where each grown pixel was read from, and how much it was enlarged there (for the print, below) */
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
                /* (the drape is off. Hanging from her breasts it widened the dress below them, and at the bigger sizes the skirt flared out in a box: Laynie, Oct 14, "the bottom of dresses flare out when i increase the breast size". Below her breasts a dress is the game's own picture, the same width at every size.) */
                const tentOn = false && !!BREAST.solid[pk] && B.pose !== "AllFours" && chestCover(src, im, x, y, B, false) >= 0.5, tEnd = tentOn ? Math.min(pb > 0 ? pb : flapEnd, bcy + S2.rv * 2.4) : 0;
                const bodyHalfAt = (qy) => { const pj = Math.round(qy - uyc); return prof && pj >= 0 && pj < prof.h && prof.L[pj] >= 0 ? Math.max(midX - (ux + prof.L[pj]), ux + prof.R[pj] - midX) : 80; };
                const tentTop = S2.bx + S2.ro * 0.96, tentBot = tentOn ? bodyHalfAt(tEnd) + 1 : 0;
                const tentHalf = (qy) => { const t = Math.max(0, Math.min(1, (qy - bcy) / Math.max(1, tEnd - bcy))); return tentTop + (tentBot - tentTop) * Math.pow(t, 1.25); };
                // (only where the piece is cloth right across her body on that row: a piece open at the sides under the bust, the
                // Leather Vest Suit, had its side panels pulled out into wings by the drape. Laynie's marks, Oct 14.)
                const solidRows = new Map(), rowSolid = (qy) => { let v = solidRows.get(qy); if (v != null) return v; const hb = bodyHalfAt(qy), yy = Math.round(qy); let n = 0, k = 0; for (let xx = Math.round(midX - hb * 0.9); xx <= Math.round(midX + hb * 0.9); xx += 2) { k++; if (xx >= 0 && xx < CW && yy >= 0 && yy < CH && sp[(yy * CW + xx) * 4 + 3] > 60) n++; } v = k > 0 && n / k >= 0.85; solidRows.set(qy, v); return v; };
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
                    const th = under && qy <= tEnd && rowSolid(qy) ? tentHalf(qy) : 0, bh2 = th ? bodyHalfAt(qy) : 0, onTent = th > bh2 + 1 && !onB && !bridge && Math.abs(qx - midX) <= th;
                    if (!(onB || onBody || bridge || onSlope || onTent)) continue;
                    const o4 = (j * bw + i) * 4; if (!onSlope) hi.data[o4 + 3] = 255;
                    let px2 = qx, pyS = 0; if (nipPull && !onTent) { const np = nipPull[qx < midX ? 0 : 1], dd = Math.hypot(qx - np.tx, qy - np.ty); if (dd < np.R) { const wv = Math.pow(1 - dd / np.R, 2) * (3 - 2 * (1 - dd / np.R)) ; px2 = qx + np.dx * wv; pyS = np.dy * wv; } }
                    const asIs = !onB && !onTent && !bridge && qy > bcy;   /* (below her breasts and off them, the piece is exactly the game's picture: same place, same width. Review, Oct 14.) */
                    const fx = asIs ? qx : onTent ? midX + (qx - midX) * bh2 / th : midX + srcOff(px2 - midX, sg) * flatK, fy = asIs ? qy : onTent ? qy : yn + pyS / kyAt(yn), ix = Math.floor(fx), iy = Math.floor(fy); if (ix < 0 || iy < 0 || ix >= CW - 1 || iy >= CH - 1) continue;
                    const mg = asIs ? 1 : Math.max(sg, kyAt(yn)), at = sample(fx, fy, mg, od, o4); if (at < 1) { od[o4 + 3] = 0; continue; }
                    if (!asIs && !onSlope) { fxA[j * bw + i] = fx; fyA[j * bw + i] = fy; magA[j * bw + i] = mg; }
                    if (groundRow < 1e8 && groundRow - qy < 16) od[o4 + 3] = at * Math.max(0.1, (groundRow - qy) / 16);
                  }
                }
                // PRINTS AND GRAIN AT THEIR OWN SIZE. Grown with the breast, a print or the grain of a cloth grows too: flowers
                // two and a half times their size, fur and knit and leather grain gone coarse (Laynie, Oct 14: "the textures
                // are ugly too, from how they are stretched"). Her pick: copy the pattern to fill in, rather than stretch it.
                // So a clean patch of the piece is found, on the game's breast where the light is even (no trim, no fold,
                // no shine), and its fine pattern is lifted off it. The grown piece keeps its broad colour and its light and
                // shade (read from a softened copy, so its blown-up pattern isn't in it), and the patch's pattern is laid
                // back over it, one pixel for one pixel, repeated (mirrored, so no seam shows), darker where the cloth is
                // in shadow. Only where the cloth is the patch's own colour: a trim, a bow, a white front keep the piece's
                // own picture. A piece with no pattern to speak of (most are flat colour) is left exactly as it was.
                const texOf = (() => {
                  const tx = TEX[(pieceOf(src) || {}).name]; if (!tx) return null;
                  const BL = tx.bl || 7, S = tx.cell || 30;
                  const spL = (() => { const cb = document.createElement("canvas"); cb.width = CW; cb.height = CH; const gb = cb.getContext("2d", { willReadFrequently: true }); gb.filter = "blur(" + BL + "px)"; gb.drawImage(c, 0, 0); gb.filter = "none"; return gb.getImageData(0, 0, CW, CH).data; })();
                  const lum = (A, p) => A[p] * 0.3 + A[p + 1] * 0.59 + A[p + 2] * 0.11;
                  // the cloth's own colour: the middle of what's on the game's breasts
                  const ch = [[], [], []];
                  for (const sd of [-1, 1]) for (let yy = Math.round(uyc + G.cy - G.rv * 0.6); yy < Math.round(uyc + G.cy + G.rv * 0.6); yy += 2) for (let xx = Math.round(midX + sd * G.dx - G.ro * 0.6); xx < Math.round(midX + sd * G.dx + G.ro * 0.6); xx += 2) {
                    if (xx < 0 || yy < 0 || xx >= CW || yy >= CH) continue; const p = (yy * CW + xx) * 4; if (sp[p + 3] < 250) continue; const t = spL[p] + spL[p + 1] + spL[p + 2] || 1; ch[0].push(spL[p] / t); ch[1].push(spL[p + 1] / t); ch[2].push(spL[p + 2] / t); }
                  if (ch[0].length < 300) return null;
                  const bn = ch.map((a) => { a.sort((p, q) => p - q); return a[a.length >> 1]; });
                  // the clean cloth: that colour, the light even, the piece solid there (from above the breasts to well below them)
                  const rx0 = Math.max(1, Math.round(midX - G.dx - G.ro - 30)), rx1 = Math.min(CW - 2, Math.round(midX + G.dx + G.ro + 30)), ry0 = Math.max(1, Math.round(uyc + G.y1)), ry1 = Math.min(CH - 2, Math.round(uyc + G.y3 + 90));
                  const RW = rx1 - rx0 + 1, RH = ry1 - ry0 + 1, clean = new Uint8Array(RW * RH); let nC = 0, sD = 0, bl = 0;
                  for (let yy = ry0; yy <= ry1; yy++) for (let xx = rx0; xx <= rx1; xx++) {
                    const p = (yy * CW + xx) * 4; if (sp[p + 3] < 250) continue; const t = spL[p] + spL[p + 1] + spL[p + 2] || 1;
                    if (Math.abs(spL[p] / t - bn[0]) + Math.abs(spL[p + 1] / t - bn[1]) + Math.abs(spL[p + 2] / t - bn[2]) > 0.05) continue;
                    const gr = Math.abs(lum(spL, p + 4) - lum(spL, p - 4)) + Math.abs(lum(spL, p + CW * 4) - lum(spL, p - CW * 4)); if (gr > 9) continue;
                    clean[(yy - ry0) * RW + (xx - rx0)] = 1; nC++; sD += Math.abs(lum(sp, p) - lum(spL, p)); bl += lum(spL, p);
                  }
                  if (nC < 800) return null;
                  const det = sD / nC;
                  if (det < 2.5) return null;
                  // where a patch can come from: a clean spot with mostly clean cloth round it
                  const I = new Float32Array((RW + 1) * (RH + 1)); for (let yy = 0; yy < RH; yy++) { let row = 0; for (let xx = 0; xx < RW; xx++) { row += clean[yy * RW + xx]; I[(yy + 1) * (RW + 1) + xx + 1] = I[yy * (RW + 1) + xx + 1] + row; } }
                  const box = (x, y, r) => { const a = Math.max(0, x - r), b = Math.max(0, y - r), c2 = Math.min(RW, x + r + 1), d2 = Math.min(RH, y + r + 1); return (I[d2 * (RW + 1) + c2] - I[b * (RW + 1) + c2] - I[d2 * (RW + 1) + a] + I[b * (RW + 1) + a]) / ((2 * r + 1) * (2 * r + 1)); };
                  const srcs = []; for (let yy = S; yy < RH - S; yy += 3) for (let xx = S; xx < RW - S; xx += 3) if (clean[yy * RW + xx] && box(xx, yy, S) > 0.8) srcs.push([xx + rx0, yy + ry0]);
                  if (srcs.length < 4) return null;
                  return { S, spL, srcs, bn, base: bl / nC, det, cleanAt: (x, y) => { const xx = Math.round(x) - rx0, yy = Math.round(y) - ry0; return xx >= 0 && yy >= 0 && xx < RW && yy < RH && clean[yy * RW + xx] === 1; } };
                })();
                if (texOf) {
                  const { S, spL, srcs, bn, base, cleanAt } = texOf, lum = (A, p) => A[p] * 0.3 + A[p + 1] * 0.59 + A[p + 2] * 0.11;
                  const bil = (A, fx, fy, k) => { const ix = Math.floor(fx), iy = Math.floor(fy); if (ix < 0 || iy < 0 || ix >= CW - 1 || iy >= CH - 1) return -1; const ax = fx - ix, ay = fy - iy, p = (iy * CW + ix) * 4 + k;
                    return A[p] * (1 - ax) * (1 - ay) + A[p + 4] * ax * (1 - ay) + A[p + CW * 4] * (1 - ax) * ay + A[p + CW * 4 + 4] * ax * ay; };
                  // each cell of the grid on her takes its pattern from its own patch (chosen the same way every time it's drawn)
                  const pick = (ci, cj) => { let hsh = (ci * 73856093) ^ (cj * 19349663) ^ srcs.length; hsh = Math.imul(hsh ^ (hsh >>> 13), 0x5bd1e995); hsh ^= hsh >>> 15; return srcs[Math.abs(hsh) % srcs.length]; };
                  const sm = (t) => t * t * (3 - 2 * t);
                  for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) {
                    const pi = j * bw + i; if (fxA[pi] < 0) continue; const o4 = pi * 4; if (od[o4 + 3] < 200) continue;
                    const mg = magA[pi], wm = Math.max(0, Math.min(1, (mg - 1.2) / 0.5)); if (wm <= 0) continue;
                    const fx = fxA[pi], fy = fyA[pi], Lr = bil(spL, fx, fy, 0), Lg = bil(spL, fx, fy, 1), Lb = bil(spL, fx, fy, 2); if (Lr < 0) continue;
                    const ls = Lr + Lg + Lb || 1, dc = Math.abs(Lr / ls - bn[0]) + Math.abs(Lg / ls - bn[1]) + Math.abs(Lb / ls - bn[2]), lk = (Lr * 0.3 + Lg * 0.59 + Lb * 0.11) / (base || 1);
                    const wc = Math.max(0, Math.min(1, (0.075 - dc) / 0.03)) * (lk > 0.35 && lk < 1.8 ? 1 : 0); if (wc <= 0) continue;
                    const pg = Math.abs(bil(spL, fx + 1.5, fy, 0) - bil(spL, fx - 1.5, fy, 0)) + Math.abs(bil(spL, fx, fy + 1.5, 0) - bil(spL, fx, fy - 1.5, 0)) + Math.abs(bil(spL, fx + 1.5, fy, 1) - bil(spL, fx - 1.5, fy, 1)) + Math.abs(bil(spL, fx, fy + 1.5, 1) - bil(spL, fx, fy - 1.5, 1));
                    const we = Math.max(0, Math.min(1, 1 - (pg - 14) / 24)); const w = wm * wc * we; if (w <= 0.01) continue;
                    // the pattern here: from the four nearest cells' patches, blended
                    const qx = i + x0, qy = j + y0, u = qx / S - 0.5, v = qy / S - 0.5, ci = Math.floor(u), cj = Math.floor(v), du = sm(u - ci), dv = sm(v - cj);
                    let sr = 0, sg2 = 0, sb = 0, sw = 0, sw2 = 0;
                    for (const [di, dj, bwt] of [[0, 0, (1 - du) * (1 - dv)], [1, 0, du * (1 - dv)], [0, 1, (1 - du) * dv], [1, 1, du * dv]]) {
                      if (bwt <= 1e-3) continue; const P = pick(ci + di, cj + dj), cx = (ci + di + 0.5) * S, cy = (cj + dj + 0.5) * S, sx = P[0] + (qx - cx), sy = P[1] + (qy - cy);
                      if (!cleanAt(sx, sy)) continue; const p = (Math.round(sy) * CW + Math.round(sx)) * 4;
                      sr += bwt * (sp[p] - spL[p]); sg2 += bwt * (sp[p + 1] - spL[p + 1]); sb += bwt * (sp[p + 2] - spL[p + 2]); sw += bwt; sw2 += bwt * bwt; }
                    if (sw < 0.2) continue; const nrm = 1 / Math.sqrt(sw2), ww = w * Math.min(1, (sw - 0.2) / 0.3), k = Math.min(1.6, lk);
                    od[o4] = od[o4] * (1 - ww) + Math.max(0, Math.min(255, Lr + sr * nrm * k)) * ww; od[o4 + 1] = od[o4 + 1] * (1 - ww) + Math.max(0, Math.min(255, Lg + sg2 * nrm * k)) * ww; od[o4 + 2] = od[o4 + 2] * (1 - ww) + Math.max(0, Math.min(255, Lb + sb * nrm * k)) * ww;
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
              if (ctx.belly && !fit.behind) { try { const sh = bellyShade(c, x - c.MX, y - c.MY, ctx); if (sh) { sh.MX = c.MX; sh.MY = c.MY; c = sh; } } catch (e) { console.warn("[body] belly form:", e); } }
              if (BREAST.out.size > 60) BREAST.out.clear(); BREAST.out.set(key, c);
            }
            put(name, c, x - c.MX, y - c.MY, o); return true;
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
            put(name, c, x - c.MX, y - c.MY, o); return true;
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
            put(name, c, x - c.MX, y - c.MY, o); return true;
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
            put(name, c, x - c.MX, y - c.MY, o); return true;
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
                    if (t0 >= 0) { const cyL = y + (t0 + t1) / 2 - ctx.breast.uy; put(name, src, x, y + (ctx.breast.fit.mapY(cyL) - cyL), o); return; } } } catch (e) { console.warn("[studio] decal:", e); }
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
                put(blink ? "drawImageBlink" : "drawImage", GEN.cv, x + 49.5 - GEN.cv.ax, y + 110 - GEN.cv.ay, {}); return; } catch (e) { console.warn("[studio] cock:", e); }
            }
            let drawn = false;
            try { if (ctx.belly && !fit.behind && typeof src === "string") { const q = isMoulded(src), m = q ? mouldCanvas(src, x, y, ctx, q.key, q.mode) : bellyAuto(src, x, y, ctx, fit.behind, (pieceOf(src) || {}).key);
                const gname2 = groupOf(src), formed = done && chestSlot(gname2) && gname2 !== "Panties" && (!q || q.mode !== "under") ? (m ? bellyShade(m, x - MOULD.M, y, ctx) : bellyShade(mouldImg(src), x, y, ctx)) : null;
                if (formed) { put(name, formed, m ? x - MOULD.M : x, y, o); drawn = true; }
                else if (m) { put(name, m, x - MOULD.M, y, o); drawn = true; } } } catch (e) { console.warn("[studio] mould:", e); }
            if (!drawn) put(name, src, x, y, o);
            if (!blink) { try { after(src, x, y, o); } catch (e) { console.warn("[studio] belly:", e); } }
          } : real[name]);
          cb = Object.assign({}, real, { drawImage: wrap("drawImage"), drawImageColorize: wrap("drawImageColorize"), drawImageBlink: wrap("drawImageBlink"), drawImageColorizeBlink: wrap("drawImageColorizeBlink") });
          finish = paint;
        }
      } catch (e) { console.warn("[studio] belly hook:", e); }
      const out = game(cb);
      if (finish) { try { finish(); } catch (e) { console.warn("[studio] belly:", e); } }
      if (finish && seenNow && handFNow && handFNow.v != null) { const behind = handFNow.v >= 0.45;   /* (Laynie, Oct 13: "hands should be hidden once breasts exceed a certain size". Hidden means all of them, with what's on them: never part.) */ if (behind !== !!BREAST.handsBehind) { BREAST.handsBehind = behind; clearTimeout(BREAST.holdT); BREAST.holdT = setTimeout(bellyDraw, 40); } }
      if (finish && seenNow) { const sig = Object.keys(seenNow).sort().join("|"); if (sig !== BREAST.holdSig) { BREAST.holds = seenNow; BREAST.on = {}; for (const k of Object.keys(seenNow)) if (k.startsWith("on:")) BREAST.on[k.slice(3)] = true; BREAST.solid = {}; for (const k of Object.keys(seenNow)) if (k.startsWith("solid:")) BREAST.solid[k.slice(6)] = true; BREAST.holdSig = sig; clearTimeout(BREAST.holdT); BREAST.holdT = setTimeout(bellyDraw, 40); } }
      return out;
    }
  }

  return { BELLY, FIT0, poseKey, fitNow, bellySkin, MOULD, mouldKey, mouldImg, edges, edgesOf, outline, bellyCover, bellyAuto, pieceSpan, bellyRows, mouldCanvas,
    BREAST, BREAST_SLIDERS, NIP_GROUPS, HAND_GROUPS, NIP_PIECES, ARM_GROUPS, heldNow, chestSlot, STRAPS, gameBreast, upperName, breastNow, setCup, cupNow, nipHalves, GEN, draw };
};
})();
