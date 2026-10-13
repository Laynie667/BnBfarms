/* B&B outfit studio: drawn cocks and balls.
   The game has one cock picture, soft and hard, and it can't be grown past three times. The farm keeps a length in inches
   (3 to 30 and past), a size for the balls (1 to 20), a kind (human, canine, flared equine, barbed feline, ridged draconic,
   double) and whether it's knotted. So these are drawn, the way the belly and the breasts are.
   SECOND DRAWING (Oct 13). The first was a straight bar with a cap on the end and two loose ovals under it. Laynie: "the
   cocks are really rough looking, and kind of disjointed", and she put species charts in the reference folder. What
   those show, and what this now does:
     · ONE SHAPE. Each cock is a single outline from root to tip, its width changing smoothly along its length: the
       swell of a knot, the pinch behind a head, the taper of a point, the spread of a flare are all one line.
     · IT CURVES. Nothing hangs or stands dead straight.
     · IT COMES OUT OF SOMETHING. A sheath at the root: skin on a human one, dark on an equine one. Soft, an animal's is
       mostly drawn back into its sheath with the end showing.
     · THE BALLS ARE ONE SACK, two lobes joined, hung from the root, not two separate eggs.
     · Each kind has its own colour and its own way of ending.
   Seen from the front. Soft, it hangs; hard, it stands. No game code in here: it only draws. window.FarmCock. */
(() => {
  const PX_PER_INCH = 9;   // the game's own soft cock is about 54 pixels long, and the farm calls the starting one 6 inches
  // w: half-width along the length, t from 0 (root) to 1 (tip), in units of the usual half-width. hard: standing.
  const KINDS = {
    human:    { label: "Human", col: null, tipCol: [224, 126, 134], sheath: null, soft: 1,
                w: (t) => { if (t < 0.78) return 1 - 0.05 * t; if (t < 0.83) return 0.96 - (t - 0.78) * 1.6;            // the shaft, then the pinch behind the head
                  if (t < 0.86) return 0.88 + (t - 0.83) / 0.03 * 0.3; const h = (t - 0.86) / 0.14; return 1.18 * Math.sqrt(Math.max(0.0004, 1 - h * h * 0.96)); }, headAt: 0.86 },
    canine:   { label: "Canine", col: [200, 56, 66], tipCol: [214, 74, 82], sheath: "skin", soft: 0.3, knot: true,
                w: (t) => 0.72 + 0.26 * Math.sin(Math.min(1, t / 0.75) * Math.PI) * 0.9 - (t > 0.72 ? Math.pow((t - 0.72) / 0.28, 1.6) * 0.78 : 0) },
    equine:   { label: "Flared equine", col: [104, 74, 72], tipCol: [150, 104, 108], sheath: [58, 44, 44], soft: 0.6, ring: 0.5,
                w: (t, hard) => 1 + 0.07 * Math.exp(-Math.pow((t - 0.5) / 0.03, 2)) - 0.1 * Math.exp(-Math.pow((t - 0.86) / 0.07, 2)) + (t > 0.9 ? (hard ? 0.55 : 0.16) * Math.pow((t - 0.9) / 0.1, 0.7) : 0), flat: true },
    feline:   { label: "Barbed feline", col: [228, 132, 142], tipCol: [232, 120, 132], sheath: "skin", soft: 0.25, barbs: true, slim: 0.78,
                w: (t) => 0.95 - 0.62 * Math.pow(t, 1.25) },
    draconic: { label: "Ridged draconic", col: [128, 70, 150], tipCol: [170, 90, 170], sheath: [78, 50, 96], soft: 0.5, ridges: true,
                w: (t) => (1.08 - 0.72 * Math.pow(t, 1.5)) * (1 + 0.075 * Math.sin(t * Math.PI * 14) * (t < 0.9 ? 1 : 0)) },
    double:   { label: "Double", col: [214, 110, 122], tipCol: [224, 120, 132], sheath: "skin", soft: 0.5, two: true, slim: 0.8,
                w: (t) => 0.92 - 0.5 * Math.pow(t, 2.2) },
  };
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const rgb = (c, k) => "rgb(" + clamp(c[0] * k) + "," + clamp(c[1] * k) + "," + clamp(c[2] * k) + ")";
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  // how big each ball is across, for a farm level of 1 to 20 (3 is where the farm starts them)
  const ballR = (level) => 7 + 2.6 * Math.max(0, level - 1) + 0.16 * Math.pow(Math.max(0, level - 6), 2);

  // o: { kind, knot, inches, girth (1 = usual for the length), balls (1..20), hard, skin [r,g,b] }
  // Gives a canvas, with .ax .ay: the point in it where the cock joins her.
  function canvas(o) {
    const K = KINDS[o.kind] || KINDS.human, skin = o.skin || [236, 204, 196], hard = !!o.hard;
    const full = Math.max(16, (o.inches || 6) * PX_PER_INCH), L = full * (hard ? 1.06 : 0.9 * (0.55 + 0.45 * K.soft));   // soft, an animal's is partly drawn back
    const W = Math.max(5, (5.5 + full * 0.044) * (o.girth || 1) * (K.slim || 1) * (hard ? 1.1 : 0.98));                  // half-width: thicker as it gets longer, but not in step
    const br = ballR(o.balls || 3), knotted = !!(o.knot || K.knot), gap = K.two ? W * 1.25 : 0;
    const col = K.col || [skin[0], skin[1] * 0.93, skin[2] * 0.92], sh = K.sheath === "skin" || !K.sheath ? [skin[0] * 0.98, skin[1] * 0.93, skin[2] * 0.91] : K.sheath;
    const bend = (hard ? 0.05 : 0.09) * L;   // how far it bows to the side
    const widest = W * (1.7 + (knotted ? 0.9 : 0)) + gap + bend, drop = br * (1.15 + Math.min(0.6, br / 90));
    const half = Math.max(widest, br * 2.1) + 10, up = (hard ? L + W : W * 1.2) + 10, down = Math.max(hard ? W * 1.5 : L + W, drop + br * 1.5) + 12;
    const cv = document.createElement("canvas"); cv.width = Math.ceil(half * 2); cv.height = Math.ceil(up + down);
    const g = cv.getContext("2d"), ox = cv.width / 2, oy = up; cv.ax = ox; cv.ay = oy;
    g.lineJoin = "round"; g.lineCap = "round";

    // ── the sack: one shape, two lobes, hung from the root ──
    const sack = () => {
      const top = oy + W * 0.2, cy = top + drop, r = br;
      const path = () => { g.beginPath(); g.moveTo(ox - W * 0.9, top);
        g.bezierCurveTo(ox - r * 1.1, top + drop * 0.35, ox - r * 2.05, cy - r * 0.5, ox - r * 1.75, cy + r * 0.45);    // down the left side
        g.bezierCurveTo(ox - r * 1.5, cy + r * 1.3, ox - r * 0.35, cy + r * 1.4, ox, cy + r * 0.95);                   // under the left lobe, up into the cleft
        g.bezierCurveTo(ox + r * 0.35, cy + r * 1.28, ox + r * 1.5, cy + r * 1.18, ox + r * 1.72, cy + r * 0.35);      // under the right lobe (it rides a little higher)
        g.bezierCurveTo(ox + r * 2.0, cy - r * 0.55, ox + r * 1.1, top + drop * 0.35, ox + W * 0.9, top); g.closePath(); };
      const grad = g.createRadialGradient(ox - r * 0.5, cy - r * 0.2, r * 0.2, ox, cy + r * 0.1, r * 2.3);
      grad.addColorStop(0, rgb(skin, 1.01)); grad.addColorStop(0.6, rgb([skin[0], skin[1] * 0.94, skin[2] * 0.93], 0.97)); grad.addColorStop(1, rgb([skin[0], skin[1] * 0.86, skin[2] * 0.85], 0.84));
      g.fillStyle = grad; path(); g.fill();
      g.save(); path(); g.clip();
      const cleft = g.createLinearGradient(ox - r * 0.5, 0, ox + r * 0.5, 0); cleft.addColorStop(0, "rgba(120,60,55,0)"); cleft.addColorStop(0.5, "rgba(120,60,55,0.22)"); cleft.addColorStop(1, "rgba(120,60,55,0)");
      g.fillStyle = cleft; g.fillRect(ox - r * 0.5, cy - r * 0.6, r, r * 2.2);
      const und = g.createLinearGradient(0, cy + r * 0.3, 0, cy + r * 1.4); und.addColorStop(0, "rgba(120,60,55,0)"); und.addColorStop(1, "rgba(120,60,55,0.2)");
      g.fillStyle = und; g.fillRect(0, cy, cv.width, r * 2); g.restore();
      g.strokeStyle = rgb(skin, 0.3); g.lineWidth = 1.6; path(); g.stroke();
      g.strokeStyle = rgb(skin, 0.5); g.lineWidth = 1; g.beginPath(); g.moveTo(ox, cy - r * 0.35); g.quadraticCurveTo(ox + r * 0.08, cy + r * 0.3, ox, cy + r * 0.93); g.stroke();   // the seam
    };

    // ── one cock: a single outline from root to tip ──
    const shaft = (dx, lean) => {
      const dir = hard ? -1 : 1, N = 56, kn = (t) => (knotted && hard ? 0.95 * Math.exp(-Math.pow((t - 0.22) / 0.07, 2)) : 0);
      const cen = (t) => [ox + dx + (lean + Math.sin(t * Math.PI * 0.85) * bend) * (dx < 0 ? -1 : 1) * (K.two ? 1 : 1) + lean * t * 6, oy + dir * (t * L) + (hard ? 0 : W * 0.15)];
      const wd = (t) => Math.max(0.02, K.w(t, hard) + kn(t)) * W;
      const L0 = [], R0 = [];
      for (let i = 0; i <= N; i++) { const t = i / N, c = cen(t), c2 = cen(Math.min(1, t + 0.01)), c1 = cen(Math.max(0, t - 0.01)); let nx = -(c2[1] - c1[1]), ny = c2[0] - c1[0]; const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl; const w = wd(t); L0.push([c[0] + nx * w, c[1] + ny * w]); R0.push([c[0] - nx * w, c[1] - ny * w]); }
      const tipC = cen(1), outline = () => { g.beginPath(); g.moveTo(L0[0][0], L0[0][1]); for (let i = 1; i <= N; i++) g.lineTo(L0[i][0], L0[i][1]);
        if (K.flat) g.lineTo(R0[N][0], R0[N][1]); else g.quadraticCurveTo(tipC[0], tipC[1] + dir * wd(1) * 1.3, R0[N][0], R0[N][1]);
        for (let i = N - 1; i >= 0; i--) g.lineTo(R0[i][0], R0[i][1]); g.closePath(); };
      // the flesh: the kind's colour, turning to the tip's colour toward the end, lit from the left
      g.save(); outline(); g.clip();
      const along = g.createLinearGradient(0, oy, 0, oy + dir * L); const hA = K.headAt || 0.7;
      along.addColorStop(0, rgb(col, 1)); along.addColorStop(Math.max(0.05, hA - 0.04), rgb(mix(col, K.tipCol, 0.15), 1)); along.addColorStop(Math.min(0.99, hA + 0.03), rgb(K.tipCol, 1)); along.addColorStop(1, rgb(K.tipCol, 1.04));
      g.fillStyle = along; g.fillRect(0, 0, cv.width, cv.height);
      const across = g.createLinearGradient(ox + dx - W * 1.6, 0, ox + dx + W * 1.6, 0); across.addColorStop(0, "rgba(0,0,0,0.16)"); across.addColorStop(0.36, "rgba(255,255,255,0.20)"); across.addColorStop(0.62, "rgba(0,0,0,0)"); across.addColorStop(1, "rgba(0,0,0,0.26)");
      g.fillStyle = across; g.fillRect(0, 0, cv.width, cv.height);
      if (K.ring) { const c = cen(K.ring); g.strokeStyle = rgb(col, 0.6); g.lineWidth = Math.max(1.6, W * 0.2); g.beginPath(); g.moveTo(c[0] - W * 1.4, c[1]); g.quadraticCurveTo(c[0], c[1] + dir * W * 0.5, c[0] + W * 1.4, c[1]); g.stroke();
        g.fillStyle = "rgba(222,150,152,0.45)"; for (const [a, b2, r] of [[-0.4, 0.7, 0.3], [0.35, 0.78, 0.22], [0.0, 0.9, 0.3], [-0.3, 0.6, 0.16]]) { const c3 = cen(b2); g.beginPath(); g.ellipse(c3[0] + a * W, c3[1], r * W, r * W * 1.5, 0, 0, Math.PI * 2); g.fill(); } }   // the medial ring, and pink mottling toward the end
      if (K.ridges) { g.strokeStyle = rgb(col, 0.6); g.lineWidth = Math.max(1.2, W * 0.14); for (let t = 0.1; t < 0.9; t += 1 / 7) { const c = cen(t), w = wd(t); g.beginPath(); g.moveTo(c[0] - w, c[1] - dir * w * 0.2); g.quadraticCurveTo(c[0], c[1] + dir * w * 0.6, c[0] + w, c[1] - dir * w * 0.2); g.stroke(); } }
      if (K.headAt) { const c = cen(K.headAt), w = wd(K.headAt) * 1.25; g.strokeStyle = rgb(K.tipCol, 0.62); g.lineWidth = 1.3; g.beginPath(); g.moveTo(c[0] - w, c[1] - dir * w * 0.1); g.quadraticCurveTo(c[0], c[1] - dir * w * 0.55, c[0] + w, c[1] - dir * w * 0.1); g.stroke();
        const e = cen(0.985); g.beginPath(); g.moveTo(e[0], e[1] - dir * W * 0.25); g.lineTo(e[0], e[1] + dir * W * 0.12); g.stroke(); }   // the rim of the head, and the slit
      if (hard && !K.ridges) { g.strokeStyle = rgb(col, 0.78); g.lineWidth = 1; g.beginPath(); const a = cen(0.2), b2 = cen(0.45), c4 = cen(0.68); g.moveTo(a[0] - W * 0.3, a[1]); g.bezierCurveTo(b2[0] - W * 0.8, b2[1], b2[0] + W * 0.4, b2[1], c4[0] - W * 0.1, c4[1]); g.stroke(); }   // a vein
      g.restore();
      if (K.barbs) { g.fillStyle = rgb(col, 0.72); for (let t = 0.45; t < 0.92; t += 0.1) for (const sd of [0, 1]) { const i = Math.round(t * N), p = (sd ? R0 : L0)[i], c = cen(t), ux2 = (p[0] - c[0]) / (wd(t) || 1), uy2 = (p[1] - c[1]) / (wd(t) || 1), s2 = Math.max(1.6, W * 0.22); g.beginPath(); g.moveTo(p[0], p[1] - dir * s2 * 0.6); g.lineTo(p[0] + ux2 * s2 * 1.3, p[1] + uy2 * s2 * 1.3 - dir * s2 * 1.4); g.lineTo(p[0], p[1] + dir * s2 * 0.5); g.closePath(); g.fill(); } }
      g.strokeStyle = rgb(mix(col, K.tipCol, 0.5), 0.34); g.lineWidth = 1.6; outline(); g.stroke();
      // the sheath it comes out of: a soft sleeve round the root, a little wider than the shaft, with a rolled edge
      const sl = hard ? Math.min(0.11, 10 / L + 0.03) : (K.sheath ? 0.62 : 0.14), M = Math.max(2, Math.round(sl * N)), sw = 1.16;
      const sp = () => { g.beginPath(); for (let i = 0; i <= M; i++) { const c = cen(i / N), p = L0[i]; g.lineTo(c[0] + (p[0] - c[0]) * sw, c[1] + (p[1] - c[1]) * sw); } const cE = cen(M / N); g.quadraticCurveTo(cE[0], cE[1] + dir * W * 0.5, cE[0] + (R0[M][0] - cE[0]) * sw, cE[1] + (R0[M][1] - cE[1]) * sw); for (let i = M; i >= 0; i--) { const c = cen(i / N), p = R0[i]; g.lineTo(c[0] + (p[0] - c[0]) * sw, c[1] + (p[1] - c[1]) * sw); } g.closePath(); };
      const sg = g.createLinearGradient(ox + dx - W * 1.6, 0, ox + dx + W * 1.6, 0); sg.addColorStop(0, rgb(sh, 0.88)); sg.addColorStop(0.36, rgb(sh, 1.05)); sg.addColorStop(1, rgb(sh, 0.8));
      g.fillStyle = sg; sp(); g.fill(); g.strokeStyle = rgb(sh, 0.38); g.lineWidth = 1.5; sp(); g.stroke();
    };
    const shafts = () => { if (K.two) { shaft(-gap * 0.5, 0.6); shaft(gap * 0.5, 0.6); } else shaft(0, 0); };
    // standing, the sack is in front of the root; hanging, the cock lies in front of the sack
    if (hard) { shafts(); sack(); } else { sack(); shafts(); }
    return cv;
  }
  window.FarmCock = { KINDS, PX_PER_INCH, ballR, canvas };
})();
