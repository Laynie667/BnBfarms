/* B&B outfit studio: drawn cocks and balls.
   The game has one cock picture, soft and hard, and it can't be grown past three times. The farm keeps a length in inches
   (3 to 30 and past), a size for the balls (1 to 20), a kind (human, canine, flared equine, barbed feline, ridged draconic,
   double) and whether it's knotted. So these are drawn, the way the belly and the breasts are (Laynie, Oct 13: "drawing
   our own on the male parts would be fine. a lot more granular control, and we could include the other species ones…
   various testes sizes would be nice, and penis size and varieties").
   Seen from the front. Soft, it hangs; hard, it stands. No game code in here: it only draws. window.FarmCock. */
(() => {
  const PX_PER_INCH = 9;   // the game's own soft cock is about 54 pixels long, and the farm calls the starting one 6 inches
  const KINDS = {
    human:    { label: "Human",           tip: "head",  shaft: "skin" },
    canine:   { label: "Canine",          tip: "point", shaft: [205, 70, 78],  knot: true },
    equine:   { label: "Flared equine",   tip: "flare", shaft: [92, 66, 62],  ring: true },
    feline:   { label: "Barbed feline",   tip: "point", shaft: [224, 128, 136], barbs: true, slim: 0.8 },
    draconic: { label: "Ridged draconic", tip: "taper", shaft: [120, 78, 150], ridges: true },
    double:   { label: "Double",          tip: "head",  shaft: "skin", two: true },
  };
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const rgb = (c, k) => "rgb(" + clamp(c[0] * k) + "," + clamp(c[1] * k) + "," + clamp(c[2] * k) + ")";
  // how big the balls are across, each, for a farm level of 1 to 20 (3 is where the farm starts them)
  const ballR = (level) => 7 + 2.6 * Math.max(0, level - 1) + 0.16 * Math.pow(Math.max(0, level - 6), 2);

  // o: { kind, knot, inches, girth (1 = usual for the length), balls (1..20), hard, skin [r,g,b] }
  // Gives a canvas, with .ax .ay: the point in it where the cock joins her.
  function canvas(o) {
    const K = KINDS[o.kind] || KINDS.human, skin = o.skin || [236, 204, 196];
    const L = Math.max(14, (o.inches || 6) * PX_PER_INCH * (o.hard ? 1.08 : 0.92));
    const W = Math.max(9, (10 + L * 0.085) * (o.girth || 1) * (K.slim || 1) * (o.hard ? 1.08 : 1));   // thicker as it gets longer, but not in step
    const br = ballR(o.balls || 3), knot = (o.knot || K.knot) ? W * 0.95 : 0;
    const gap = K.two ? W * 0.62 : 0;                       // a double: two, side by side
    const half = Math.max(W / 2 + gap + (knot ? knot * 0.5 : 0) + (K.tip === "flare" ? W * 0.45 : 0), br * 2.05) + 8;
    const up = (o.hard ? L + W * 0.9 : W * 0.4) + 8, down = Math.max(o.hard ? 0 : L + W * 0.9, br * 2.7 + W * 0.3) + 10;
    const cv = document.createElement("canvas"); cv.width = Math.ceil(half * 2); cv.height = Math.ceil(up + down);
    const g = cv.getContext("2d"), ox = cv.width / 2, oy = up; cv.ax = ox; cv.ay = oy;
    const sc = K.shaft === "skin" ? [skin[0], skin[1] * 0.94, skin[2] * 0.93] : K.shaft, ink = rgb(K.shaft === "skin" ? skin : sc, 0.3);
    g.lineJoin = "round"; g.lineCap = "round";

    // the balls: two, hung under the root, the left a little lower, heavier and lower the bigger they are
    const sack = () => {
      const drop = W * 0.25 + br * (0.9 + Math.min(0.5, br / 120)), by = oy + drop;
      for (const s of [1, -1]) {
        const cx = ox + s * br * 0.82, cy = by + (s < 0 ? br * 0.1 : 0);
        const grad = g.createRadialGradient(cx - br * 0.3, cy - br * 0.35, br * 0.1, cx, cy, br * 1.25);
        grad.addColorStop(0, rgb(skin, 1.02)); grad.addColorStop(0.6, rgb([skin[0], skin[1] * 0.95, skin[2] * 0.94], 0.98)); grad.addColorStop(1, rgb([skin[0], skin[1] * 0.88, skin[2] * 0.87], 0.86));
        g.fillStyle = grad; g.beginPath(); g.ellipse(cx, cy, br, br * 1.18, 0, 0, Math.PI * 2); g.fill();
        g.strokeStyle = rgb(skin, 0.3); g.lineWidth = 1.6; g.beginPath(); g.ellipse(cx, cy, br, br * 1.18, 0, Math.PI * (s > 0 ? -0.15 : 0.35), Math.PI * (s > 0 ? 0.65 : 1.15)); g.stroke();
      }
      g.strokeStyle = rgb(skin, 0.42); g.lineWidth = 1.2; g.beginPath(); g.moveTo(ox, by - br * 0.7); g.lineTo(ox, by + br * 1.05); g.stroke();   // the seam between them
    };

    // one shaft, from the root (0,0) away along +y; turned afterwards to hang or to stand
    const shaft = (dx) => {
      g.save(); g.translate(ox + dx, oy); if (o.hard) g.rotate(Math.PI); else g.translate(0, W * 0.1);
      const w0 = W / 2, tipL = K.tip === "flare" ? W * 0.55 : K.tip === "head" ? W * 0.95 : W * 1.5, bodyL = Math.max(6, L - tipL);
      const wAt = (t) => w0 * (K.tip === "point" || K.tip === "taper" ? 1 - 0.22 * t : 1 - 0.06 * t);   // along the body, 0 at the root
      const body = () => { g.beginPath(); g.moveTo(-w0, 0); for (let i = 0; i <= 20; i++) { const t = i / 20; let w = wAt(t); if (knot && o.hard) w += knot * 0.55 * Math.exp(-Math.pow((t - 0.14) / 0.09, 2)); g.lineTo(-w, bodyL * t); }
        for (let i = 20; i >= 0; i--) { const t = i / 20; let w = wAt(t); if (knot && o.hard) w += knot * 0.55 * Math.exp(-Math.pow((t - 0.14) / 0.09, 2)); g.lineTo(w, bodyL * t); } g.closePath(); };
      const grad = g.createLinearGradient(-w0, 0, w0, 0);
      grad.addColorStop(0, rgb(sc, 0.9)); grad.addColorStop(0.35, rgb(sc, 1.06)); grad.addColorStop(1, rgb(sc, 0.84));
      g.fillStyle = grad; body(); g.fill();
      if (K.ridges) { g.strokeStyle = rgb(sc, 0.62); g.lineWidth = Math.max(1.5, W * 0.12); for (let y = bodyL * 0.14; y < bodyL; y += Math.max(7, W * 0.5)) { const w = wAt(y / bodyL); g.beginPath(); g.moveTo(-w, y); g.quadraticCurveTo(0, y + W * 0.22, w, y); g.stroke(); } }
      if (K.ring) { const y = bodyL * 0.52, w = wAt(0.52); g.strokeStyle = rgb(sc, 0.62); g.lineWidth = Math.max(2, W * 0.16); g.beginPath(); g.moveTo(-w, y); g.quadraticCurveTo(0, y + W * 0.2, w, y); g.stroke();
        g.fillStyle = "rgba(226,150,150,0.5)"; for (const [fx, fy, r] of [[-0.3, 0.72, 0.22], [0.28, 0.8, 0.16], [0.05, 0.9, 0.2]]) { g.beginPath(); g.ellipse(fx * W, bodyL * fy, r * W, r * W * 1.3, 0, 0, Math.PI * 2); g.fill(); } }   // the pink mottling toward the end
      if (o.hard && !K.ridges) { g.strokeStyle = rgb(sc, 0.74); g.lineWidth = 1.1; g.beginPath(); g.moveTo(-w0 * 0.35, bodyL * 0.12); g.bezierCurveTo(-w0 * 0.75, bodyL * 0.4, w0 * 0.2, bodyL * 0.55, -w0 * 0.2, bodyL * 0.9); g.stroke(); }   // a vein
      g.strokeStyle = ink; g.lineWidth = 1.6; body(); g.stroke();
      // the end of it
      const wE = wAt(1), y0 = bodyL, tc = K.tip === "head" ? [226, 132, 138] : K.tip === "flare" ? [150, 100, 100] : sc;
      const tip = () => { g.beginPath();
        if (K.tip === "head") { g.moveTo(-wE * 1.12, y0); g.bezierCurveTo(-wE * 1.25, y0 + tipL * 0.75, -wE * 0.5, y0 + tipL, 0, y0 + tipL); g.bezierCurveTo(wE * 0.5, y0 + tipL, wE * 1.25, y0 + tipL * 0.75, wE * 1.12, y0); }
        else if (K.tip === "flare") { g.moveTo(-wE, y0); g.bezierCurveTo(-wE * 1.1, y0 + tipL * 0.5, -wE * 1.75, y0 + tipL * 0.6, -wE * 1.7, y0 + tipL); g.lineTo(wE * 1.7, y0 + tipL); g.bezierCurveTo(wE * 1.75, y0 + tipL * 0.6, wE * 1.1, y0 + tipL * 0.5, wE, y0); }
        else { g.moveTo(-wE, y0); g.bezierCurveTo(-wE * 0.95, y0 + tipL * 0.6, -wE * 0.3, y0 + tipL * 0.95, 0, y0 + tipL); g.bezierCurveTo(wE * 0.3, y0 + tipL * 0.95, wE * 0.95, y0 + tipL * 0.6, wE, y0); }
        g.closePath(); };
      const tg = g.createLinearGradient(-w0, 0, w0, 0); tg.addColorStop(0, rgb(tc, 0.92)); tg.addColorStop(0.35, rgb(tc, 1.08)); tg.addColorStop(1, rgb(tc, 0.84));
      g.fillStyle = tg; tip(); g.fill(); g.strokeStyle = rgb(tc, 0.34); g.lineWidth = 1.6; tip(); g.stroke();
      if (K.tip === "head") { g.strokeStyle = rgb(tc, 0.5); g.lineWidth = 1.1; g.beginPath(); g.moveTo(0, y0 + tipL * 0.72); g.lineTo(0, y0 + tipL * 0.97); g.stroke(); }
      if (K.tip === "flare") { g.fillStyle = rgb(tc, 0.5); g.beginPath(); g.ellipse(0, y0 + tipL * 0.98, wE * 0.3, tipL * 0.14, 0, 0, Math.PI * 2); g.fill(); }
      if (K.barbs) { g.fillStyle = rgb(sc, 0.72); for (let r = 0; r < 3; r++) for (const s of [-1, 1]) { const y = y0 - bodyL * 0.05 + tipL * (0.12 + r * 0.2), w = wE * (1 - r * 0.24); g.beginPath(); g.moveTo(s * w, y); g.lineTo(s * (w + W * 0.2), y - W * 0.16); g.lineTo(s * w, y - W * 0.2); g.closePath(); g.fill(); } }
      g.restore();
    };
    // order: standing, the balls are in front of its root; hanging, it lies in front of them
    const shafts = () => { if (K.two) { shaft(-gap); shaft(gap); } else shaft(0); };
    if (o.hard) { shafts(); sack(); } else { sack(); shafts(); }
    return cv;
  }
  window.FarmCock = { KINDS, PX_PER_INCH, ballR, canvas };
})();
