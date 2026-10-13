/* B&B outfit studio: drawn breasts, flat to R.
   The game has six chest sizes of its own (two flat ones, small, normal, large, extra large). Those are the first six
   cups here, drawn by the game, so everything made for them still fits. Past the game's biggest, the breasts are DRAWN,
   over the extra large body, the same way the belly is: a shape worked out from a size, shaded to the body's own skin.
   Weight is the point (Laynie, Oct 13: "natural shape and weight will play a big role as the sizes increase"): as they
   grow they don't just get rounder, they hang. The fullness drops below the middle, the top slope gets long and
   shallow, they swing out from the breastbone, and the nipples ride lower and point out and down.
   No game code in here: it only draws. window.FarmBreasts. */
(() => {
  // cup by cup. The first six are the game's own chest sizes.
  const NATIVE = ["FlatSmall", "FlatMedium", "Small", "Normal", "Large", "XLarge"];
  const CUPS = ["Flat", "AA", "A", "B", "C", "D", "DD", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"];
  const DRAWN_FROM = NATIVE.length;   // CUPS[6] (DD) is the first drawn one
  const ROOT_Y = 284;                 // in the upper-body picture: the height the breasts leave the chest at
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const rgb = (c, k) => "rgb(" + clamp(c[0] * k) + "," + clamp(c[1] * k) + "," + clamp(c[2] * k) + ")";

  // the shape for a cup. adj (all optional): full (size, 1 = as is), hang (weight, 1 = as is), apart (1 = as is)
  function shape(cup, adj) {
    const a = adj || {}, i = Math.max(0, cup - DRAWN_FROM), n = CUPS.length - 1 - DRAWN_FROM;   // i: 0 (DD) .. n (R)
    const k = i / n, hang = a.hang == null ? 1 : a.hang, full = a.full == null ? 1 : a.full, apart = a.apart == null ? 1 : a.apart;
    const r = (44 + 2.6 * i) * full;                    // DD is a little more than the game's biggest; R is past the size of her head
    const sag = (0.08 + 0.18 * k) * hang;            // how much lower than a ball the underside goes, and how far the fullness drops
    const top = 1.1 + 0.3 * k * hang;               // how long the upper slope is, in radii
    const bx = (r * (0.90 + 0.06 * k) + 3) * apart;  // each one's middle, out from the breastbone: heavier ones swing wider
    const by = r * top;                              // the slope starts at the chest, so the longer it is the lower they hang
    return { cup, i, k, r, sag, top, bx, by };
  }
  // a point on one breast's outline. s: -1 the one on the left of the picture, 1 the right. t runs round, 0 at its outer
  // side for the right one, a quarter turn at the bottom.
  function point(S, s, t) {
    const sn = Math.sin(t), cs = Math.cos(t);
    if (sn >= 0) return [s * S.bx + S.r * cs * (1 + S.sag * 0.12 * sn) + s * S.r * 0.10 * S.k * sn, S.by + S.r * sn * (1 + S.sag)];     // the full, hanging half: round, its lowest point a little to the outside
    const up = -sn;
    const u = Math.pow(up, 1.5), tx = s * Math.min(S.bx, 46);   // tx: where it's hung from, up on the chest
    return [(s * S.bx + S.r * cs) * (1 - u) + tx * u, S.by - S.r * S.top * up];   // the long slope up to there: it's a teardrop, not a ball
  }
  function path(g, S, s, from, to, ox, oy) {
    const steps = 80;
    for (let j = 0; j <= steps; j++) { const p = point(S, s, from + (to - from) * j / steps); if (j) g.lineTo(ox + p[0], oy + p[1]); else g.moveTo(ox + p[0], oy + p[1]); }
  }
  // where the nipple sits on each: below the middle, out to the side, more so the heavier they are
  function nipples(S) { const x = S.bx + S.r * (0.02 + 0.2 * S.k), y = S.by + S.r * (-0.15 + 0.6 * S.k); return [[-x, y], [x, y]]; }

  // the picture. cv.ax, cv.ay: where the chest's root point (the middle of the chest, ROOT_Y down the upper-body picture) is in it.
  function canvas(S, skin) {
    const pad = 8, half = S.bx + S.r * (1 + S.sag * 0.35) + pad, up = Math.max(0, S.r * S.top - S.by) + pad, down = S.by + S.r * (1 + S.sag) + pad + 10;
    const out = document.createElement("canvas"); out.width = Math.ceil(Math.max(half, 110) * 2); out.height = Math.ceil(up + Math.max(down, 110));
    const cv = document.createElement("canvas"); cv.width = out.width; cv.height = out.height;
    const g = cv.getContext("2d"), ox = out.width / 2, oy = up;
    cv.ax = ox; cv.ay = oy; cv.nips = nipples(S);
    const side = (s, draw) => { g.save(); g.beginPath(); if (s < 0) g.rect(0, 0, ox, cv.height); else g.rect(ox, 0, cv.width - ox, cv.height); g.clip(); draw(); g.restore(); };   // each keeps to its own side of the breastbone: where they meet is the cleavage
    const whole = (s) => { g.beginPath(); path(g, S, s, 0, Math.PI * 2, ox, oy); g.closePath(); };
    // the shadow they throw on what's under them
    for (const s of [-1, 1]) side(s, () => { g.save(); g.translate(0, 5 + S.r * 0.04); g.filter = "blur(4px)"; g.fillStyle = "rgba(120,60,50,0.22)"; whole(s); g.fill(); g.restore(); });
    for (const s of [-1, 1]) side(s, () => {
      const cx = ox + s * S.bx, low = oy + S.by + S.r * 0.25;
      // skin: lightest high on the curve, deepening toward the underside where the weight is
      const grad = g.createRadialGradient(cx - S.r * 0.25, low - S.r * 0.5, S.r * 0.1, cx, low, S.r * 1.25);
      grad.addColorStop(0, rgb(skin, 1.03)); grad.addColorStop(0.55, rgb(skin, 1)); grad.addColorStop(1, rgb([skin[0], skin[1] * 0.93, skin[2] * 0.92], 0.94));
      g.fillStyle = grad; whole(s); g.fill();
      g.save(); whole(s); g.clip();
      const under = g.createLinearGradient(0, low + S.r * 0.2, 0, oy + S.by + S.r * (1 + S.sag));
      under.addColorStop(0, "rgba(150,70,60,0)"); under.addColorStop(1, "rgba(150,70,60,0.24)");
      g.fillStyle = under; g.fillRect(0, 0, cv.width, cv.height);
      // the shadow down in the cleavage
      const cl = g.createLinearGradient(ox, 0, ox + s * S.r * 0.3, 0);
      cl.addColorStop(0, "rgba(150,70,60,0.20)"); cl.addColorStop(1, "rgba(150,70,60,0)");
      g.fillStyle = cl; g.fillRect(0, oy + S.by - S.r * 0.6, cv.width, cv.height);
      // the shine the game paints on skin, down the upper left of each
      g.translate(cx - S.r * 0.38, low - S.r * 0.42); g.rotate(-0.25);
      const sh = g.createRadialGradient(0, 0, 0, 0, 0, S.r * 0.34);
      sh.addColorStop(0, "rgba(255,255,255,0.8)"); sh.addColorStop(0.5, "rgba(255,255,255,0.3)"); sh.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = sh; g.scale(0.36, 1); g.beginPath(); g.arc(0, 0, S.r * 0.34, 0, Math.PI * 2); g.fill();
      g.restore();
    });
    // melt the tops into the chest: nothing shows where they leave it, and they firm up on the way down
    g.globalCompositeOperation = "destination-out";
    // (only over the chest itself: out past the ribs the upper slope is solid, in front of the arm)
    { const topY = oy + S.by - S.r * S.top, fx = Math.min(S.bx + S.r * 0.35, 100), fy = S.r * S.top * 0.8;
      g.save(); g.translate(ox, topY); g.scale(1, fy / fx);
      const fade = g.createRadialGradient(0, 0, fx * 0.35, 0, 0, fx);
      fade.addColorStop(0, "rgba(0,0,0,1)"); fade.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = fade; g.beginPath(); g.arc(0, 0, fx, 0, Math.PI * 2); g.fill(); g.restore(); }
    g.globalCompositeOperation = "source-over";
    // the ink: down the outer side, heavy round the underside, up into the cleavage
    g.strokeStyle = rgb(skin, 0.28); g.lineCap = "round"; g.lineJoin = "round";
    for (const s of [-1, 1]) side(s, () => {
      const hi = (0.08 + 0.14 * S.k) * Math.PI, outer = s > 0 ? [-hi, Math.PI * 1.02] : [Math.PI + hi, -0.02 * Math.PI];   // the heavier, the further up the outer side the line runs
      g.lineWidth = 1.5; g.beginPath(); path(g, S, s, outer[0], outer[1], ox, oy); g.stroke();
      g.lineWidth = 2.2; g.beginPath(); path(g, S, s, Math.PI * 0.15, Math.PI * 0.85, ox, oy); g.stroke();
    });
    // the line where they press together
    let y0 = Infinity, y1 = -Infinity;
    for (let t = 0; t < Math.PI * 2; t += 0.02) { const p = point(S, 1, t); if (p[0] <= 0) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); } }
    if (y1 > y0) { const a = Math.max(y0, S.by - S.r * 0.45), lg = g.createLinearGradient(0, oy + a, 0, oy + y1);
      lg.addColorStop(0, "rgba(0,0,0,0)"); lg.addColorStop(0.35, rgb(skin, 0.28)); lg.addColorStop(1, rgb(skin, 0.28));
      g.strokeStyle = lg; g.lineWidth = 1.6; g.beginPath(); g.moveTo(ox, oy + a); g.lineTo(ox, oy + y1); g.stroke(); }
    // underneath: plain skin over the chest the game drew, so its own breasts don't show through where ours melt in
    const og = out.getContext("2d");
    og.save(); og.translate(ox, oy + 46); og.scale(1, 0.66);
    const patch = og.createRadialGradient(0, 0, 62, 0, 0, 80);
    patch.addColorStop(0, rgb(skin, 1)); patch.addColorStop(1, "rgba(" + clamp(skin[0]) + "," + clamp(skin[1]) + "," + clamp(skin[2]) + ",0)");
    og.fillStyle = patch; og.beginPath(); og.arc(0, 0, 80, 0, Math.PI * 2); og.fill(); og.restore();
    og.drawImage(cv, 0, 0);
    out.ax = cv.ax; out.ay = cv.ay; out.nips = cv.nips;
    // their plain outline, filled: for cutting away what they hang in front of (the hands)
    const mask = document.createElement("canvas"); mask.width = out.width; mask.height = out.height;
    const mg = mask.getContext("2d"); mg.fillStyle = "#000";
    for (const s of [-1, 1]) { mg.beginPath(); path(mg, S, s, 0, Math.PI * 2, ox, oy); mg.closePath(); mg.fill(); }
    mg.clearRect(0, 0, mask.width, oy + S.by - S.r * 0.3);   // (only the hanging part: up on the chest they cover nothing)
    out.mask = mask;
    return out;
  }
  window.FarmBreasts = { NATIVE, CUPS, DRAWN_FROM, ROOT_Y, shape, point, nipples, canvas };
})();
