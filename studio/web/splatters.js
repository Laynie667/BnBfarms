/* WHAT'S IN THIS FILE (studio/web/splatters.js)
   The farm's own messes, painted fresh on a canvas every time (Laynie, Oct 15: "we need our own splatters so we can get
   the look and textures of those right... additional cum splatters, and piss splatters so it looks better and can truly
   cover more of the player and layer upon layer"; "add cake mess too").
   Second pass (her notes on the first): "the liquids are very solid looking, like mashed potatoes... a more candle wax
   drips and runs, and pools approach would look better. the cake could use some white along the edges of the texture in
   patches, and look more smeared. slime should be more smeared too."
   So a liquid lands as a thin splash, then RUNS: a ribbon that swells and narrows as it goes down, the way wax runs down
   a candle, and stops in a pool or a hanging bead. Thick things (cream, cake, mash, mud, slime) are SMEARED on in flat
   ragged strokes instead. Each kind has its own colour, see-through-ness and shine, no two are alike, and they stack.
   Shared by the studio (to look at them) and, once Laynie's happy with them, the Companion (to draw them on players).

   FarmMess.paint(ctx, kind, { at: [[x, y, size], ...], seed, amount })   draws one layer of a mess at those spots
   FarmMess.paintOn(ctx, body, kind, opt)                                 the same, kept to where the body is
   Coordinates are the game's character canvas (500 wide, 1000 tall, standing).
*/
(function (root) {
  "use strict";
  function rng(seed) { let a = (seed >>> 0) || 1; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  // style: "run" (liquids: splash, runs, pools) or "smear" (thick: flat ragged strokes)
  // base/edge/gloss colours · alpha: how see-through · run: how far it runs · width: how fat its runs are
  const KINDS = {
    // cum matches the game's own Splatters (Laynie: "match the color and translucency of the games own splatters"): read off its
    // pictures, a cool white, #E3E4E5 in the middle, #C2C3C5 in the shade, #FBFBFB at the shine, solid in the middle, soft at the edges
    cum:        { style: "run", base: "#E6E7E8", edge: "#B4B6B9", gloss: "#FDFDFD", alpha: 0.97, run: 1.0, width: 1.0, ropes: 1, beads: 0.6 },
    cumThick:   { style: "run", base: "#E1E2E3", edge: "#AEB0B3", gloss: "#FDFDFD", alpha: 1, run: 0.7, width: 1.4, ropes: 0.6, beads: 0.8 },
    piss:       { style: "run", tint: "#F6D23A", stampAlpha: 0.55, narrow: [0.45, 0.75], long: 1.35, turn: 0.3, texture: "sheen", base: "#F0D040", edge: "#C9A422", gloss: "#FFF6C0", alpha: 0.34, run: 1.6, width: 0.7, beads: 0.3, droplets: 1.5 },
    milk:       { style: "run", tint: "#FFFFFF", stampAlpha: 0.8, narrow: [0.6, 0.9], long: 1.2, turn: 0.4, texture: "milky", base: "#FBFBF6", edge: "#DADAD0", gloss: "#FFFFFF", alpha: 0.72, run: 1.4, width: 0.8, beads: 0.4, droplets: 0.8 },
    honey:      { style: "run", tint: "#E9A21C", stampAlpha: 0.88, narrow: [1.0, 1.35], long: 1.15, turn: 0.25, texture: "streaks", base: "#E09A18", edge: "#9C6208", gloss: "#FFE7A3", alpha: 0.74, run: 1.1, width: 1.2, beads: 0.9 },
    maple:      { style: "run", tint: "#9A521A", stampAlpha: 0.9, narrow: [0.9, 1.25], long: 1.2, turn: 0.3, texture: "streaks", base: "#94501A", edge: "#56290A", gloss: "#F0B47A", alpha: 0.78, run: 1.3, width: 1.0, beads: 0.7 },
    chocolate:  { style: "run", tint: "#5A3018", narrow: [1.0, 1.3], long: 1.0, turn: 0.4, texture: "shine", base: "#4A2814", edge: "#251208", gloss: "#B98A6A", alpha: 0.95, run: 1.0, width: 1.2, beads: 0.8 },
    strawberry: { style: "run", tint: "#E0304E", stampAlpha: 0.9, narrow: [0.9, 1.2], long: 1.1, turn: 0.35, texture: "seeds", base: "#D52F4C", edge: "#951628", gloss: "#FFB3C0", alpha: 0.8, run: 1.2, width: 1.0, beads: 0.7, seeds: "#F6E27A" },
    slime:      { style: "smear", tint: "#79D04F", stampAlpha: 0.7, narrow: [1.2, 1.6], long: 0.9, turn: 1.2, texture: "bubbles", stampToo: true, base: "#6CC24A", edge: "#3A8226", gloss: "#D9FFC8", alpha: 0.6, run: 1.0, width: 1.1, beads: 0.6, bubbles: true, also: "run" },
    cream:      { style: "smear", base: "#FFF6E4", edge: "#E2D4B4", gloss: "#FFFFFF", alpha: 0.96, run: 0.35, width: 1.2 },
    cake:       { style: "smear", smudge: 0.3, sprinkleN: 30, base: "#FFD8E6", edge: "#E3A9BC", gloss: "#FFFFFF", alpha: 0.97, run: 0.2, width: 1.3, patches: "#FFFFFF", crumbs: ["#E8C27A", "#D9A85B", "#C98F45", "#7A4A2A"], sprinkles: ["#FF5C8A", "#5CC8FF", "#FFE05C", "#7CE07C"] },
    mud:        { style: "smear", base: "#6B4A2B", edge: "#45301A", gloss: "#9C7A55", alpha: 0.9, run: 0.5, width: 1.2, specks: "#3A2614", also: "run" },
    mash:       { style: "smear", base: "#D9C28C", edge: "#B09860", gloss: "#F5E8C2", alpha: 0.95, run: 0.25, width: 1.2, specks: "#A88A4A" },
    // Halloween's (Oct 27): pumpkin guts with pale seeds in, a caramel run with a hard shine, glowin' ghost slime, a thin
    // amber run of cider, the witch's bubblin' purple brew, and the water's black ink
    pumpkin:    { style: "smear", base: "#E07A1F", edge: "#A24E0C", gloss: "#FFC27A", alpha: 0.94, run: 0.3, width: 1.25, seeds: "#F4E6C0", specks: "#B65A12" },
    caramel:    { style: "run", tint: "#C27A30", stampAlpha: 0.92, narrow: [1.0, 1.35], long: 1.05, turn: 0.3, texture: "shine", base: "#B8702A", edge: "#6E3E10", gloss: "#FFD9A0", alpha: 0.9, run: 0.9, width: 1.25, beads: 0.9 },
    ecto:       { style: "smear", tint: "#8FF5DC", stampAlpha: 0.6, narrow: [1.1, 1.5], long: 0.95, turn: 1.1, texture: "bubbles", stampToo: true, base: "#7FEAD0", edge: "#38A88E", gloss: "#E6FFF9", alpha: 0.5, run: 1.0, width: 1.1, beads: 0.6, bubbles: true, also: "run" },
    cider:      { style: "run", tint: "#E3A23E", stampAlpha: 0.55, narrow: [0.5, 0.8], long: 1.3, turn: 0.3, texture: "sheen", base: "#D9902E", edge: "#A8661A", gloss: "#FFE6B0", alpha: 0.38, run: 1.5, width: 0.75, beads: 0.3, droplets: 1.4 },
    brew:       { style: "run", tint: "#8E4FCB", stampAlpha: 0.85, narrow: [0.9, 1.25], long: 1.1, turn: 0.4, texture: "bubbles", base: "#7A3FB0", edge: "#47206E", gloss: "#E6CCFF", alpha: 0.72, run: 1.2, width: 1.0, beads: 0.7, bubbles: true },
    ink:        { style: "run", tint: "#2A2433", stampAlpha: 0.95, narrow: [0.9, 1.25], long: 1.15, turn: 0.4, texture: "sheen", base: "#15121C", edge: "#000000", gloss: "#6E6880", alpha: 0.92, run: 1.2, width: 1.05, beads: 0.7, droplets: 1.2 },
    // winter's and Yule's (Oct 27): royal icin' piped thick and white with red and green sprinkles, a milky cocoa run with
    // little marshmallows in, pale eggnog with nutmeg dust, candy-cane peppermint syrup with white stripes, and red candle
    // wax that runs a little way and sets in beads
    icing:      { style: "smear", smudge: 0.35, sprinkleN: 10, base: "#FFFDF8", edge: "#E4DCCD", gloss: "#FFFFFF", alpha: 0.97, run: 0.15, width: 0.95, patches: "#FFFFFF", sprinkles: ["#D62B3A", "#2E8B47", "#FFFFFF"] },
    cocoa:      { style: "run", tint: "#7A4A2E", stampAlpha: 0.8, narrow: [0.7, 1.0], long: 1.25, turn: 0.35, texture: "sheen", base: "#6E4128", edge: "#3E2414", gloss: "#D8B090", alpha: 0.74, run: 1.4, width: 0.9, beads: 0.5, droplets: 1.0, crumbs: ["#FFFFFF", "#F8F2EA", "#FFF9F2"] },
    eggnog:     { style: "run", tint: "#F5E6B8", stampAlpha: 0.85, narrow: [0.8, 1.1], long: 1.15, turn: 0.35, texture: "milky", base: "#F1E0AA", edge: "#C9B27A", gloss: "#FFF8E0", alpha: 0.78, run: 1.2, width: 0.95, beads: 0.5, specks: "#8A5A2B" },
    peppermint: { style: "run", tint: "#E8435A", stampAlpha: 0.88, narrow: [0.9, 1.2], long: 1.1, turn: 0.3, texture: "candy", base: "#E23A52", edge: "#9E1A2C", gloss: "#FFE0E6", alpha: 0.82, run: 1.1, width: 1.0, beads: 0.7 },
    wax:        { style: "run", tint: "#B01E32", stampAlpha: 0.95, narrow: [0.7, 1.0], long: 0.7, turn: 0.25, texture: "shine", base: "#A3162B", edge: "#5E0A16", gloss: "#FF8A9A", alpha: 0.96, run: 0.5, width: 0.9, beads: 1.2 },
  };

  // a ribbon down a path of points, each with its own width; it ends where the last point is
  function ribbon(ctx, pts) {
    const L = [], R = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)];
      let dx = q[0] - o[0], dy = q[1] - o[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
      L.push([p[0] - dy * p[2] / 2, p[1] + dx * p[2] / 2]); R.push([p[0] + dy * p[2] / 2, p[1] - dx * p[2] / 2]);
    }
    ctx.beginPath(); ctx.moveTo(L[0][0], L[0][1]);
    for (let i = 1; i < L.length; i++) { const m = [(L[i - 1][0] + L[i][0]) / 2, (L[i - 1][1] + L[i][1]) / 2]; ctx.quadraticCurveTo(L[i - 1][0], L[i - 1][1], m[0], m[1]); }
    ctx.lineTo(L[L.length - 1][0], L[L.length - 1][1]); ctx.lineTo(R[R.length - 1][0], R[R.length - 1][1]);
    for (let i = R.length - 2; i >= 0; i--) { const m = [(R[i + 1][0] + R[i][0]) / 2, (R[i + 1][1] + R[i][1]) / 2]; ctx.quadraticCurveTo(R[i + 1][0], R[i + 1][1], m[0], m[1]); }
    ctx.lineTo(R[0][0], R[0][1]); ctx.closePath();
    return { L, R };
  }
  // a soft irregular flat shape (a splash, a pool)
  function puddle(ctx, r, x, y, w, h, rough) {
    const n = 14, pts = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, k = 1 + (r() - 0.5) * rough; pts.push([x + Math.cos(a) * w * k, y + Math.sin(a) * h * k]); }
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const p = pts[i % n], q = pts[(i + 1) % n], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; if (i === 0) ctx.moveTo(m[0], m[1]); else ctx.quadraticCurveTo(p[0], p[1], m[0], m[1]); }
    ctx.closePath();
  }
  // wet fill: see-through colour, a darker thin rim, and the rim darker still on the lower side (it's thicker there)
  function wet(ctx, K, a) {
    ctx.globalAlpha = K.alpha * (a || 1); ctx.fillStyle = K.base; ctx.fill();
    ctx.globalAlpha = Math.min(1, K.alpha * 0.8); ctx.strokeStyle = K.edge; ctx.lineWidth = 0.9; ctx.stroke();
  }
  // the shine on a run: a thin bright line down its left side, like light on a wax drip
  function shine(ctx, K, side, from, to) {
    ctx.globalAlpha = 0.7; ctx.strokeStyle = K.gloss; ctx.lineWidth = 1.1; ctx.lineCap = "round";
    ctx.beginPath(); for (let i = from; i < to; i++) { const p = side[i]; if (i === from) ctx.moveTo(p[0] + 1.2, p[1]); else ctx.lineTo(p[0] + 1.2, p[1]); } ctx.stroke();
  }

  // a strand the way the game draws its splatters (Laynie: "follow the games shapes more closely"): a lumpy line that
  // swells into beads along its length, forks once or twice, sometimes breaks off, and hangs mostly downward. Drawn in
  // three passes like the game's: a grey rim, the body, then a thin bright highlight down one side.
  function strandPts(r, x, y, len, w, ang) {
    const n = 12, pts = [], beads = [r(), r(), r()].map((v) => [v, 0.6 + r() * 0.9]);
    let px = x, py = y, a = ang;
    for (let i = 0; i <= n; i++) {
      const t = i / n; a += (r() - 0.5) * 0.35; px += Math.sin(a) * len / n; py += Math.cos(a) * len / n;
      let ww = w * (0.55 + 0.25 * (1 - t));
      for (const [bt, bs] of beads) ww += w * bs * Math.exp(-Math.pow((t - bt) / 0.07, 2));
      pts.push([px, py, Math.max(1, ww)]);
    }
    return pts;
  }
  function strandDraw(ctx, K, pts) {
    const wide = pts.map((p) => [p[0], p[1], p[2] + 1.8]);
    ribbon(ctx, wide); ctx.globalAlpha = Math.min(1, K.alpha + 0.05); ctx.fillStyle = K.edge; ctx.fill();
    const side = ribbon(ctx, pts); ctx.globalAlpha = K.alpha; ctx.fillStyle = K.base; ctx.fill();
    ctx.globalAlpha = 0.85; ctx.strokeStyle = K.gloss; ctx.lineWidth = 1; ctx.lineCap = "round";
    ctx.beginPath(); side.L.forEach((p, i) => { const q = pts[i]; const x = (p[0] * 0.35 + q[0] * 0.65), y = (p[1] * 0.35 + q[1] * 0.65); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke();
  }
  function strand(ctx, r, K, x, y, size, ang0) {
    const len = size * (0.25 + r() * 0.55) * (0.6 + K.run * 0.4), w = Math.max(1.6, size * 0.032 * K.width * (0.7 + r() * 0.6)), ang = ang0 !== undefined ? ang0 : (r() - 0.5) * 0.9;
    const pts = strandPts(r, x, y, len, w, ang);
    // it can break off in the middle: a gap, and the rest a little lower
    if (r() < 0.3) { const cut = 4 + Math.floor(r() * 4); strandDraw(ctx, K, pts.slice(0, cut)); strandDraw(ctx, K, pts.slice(cut + 2)); }
    else strandDraw(ctx, K, pts);
    { const e = pts[pts.length - 1], d = w * (1.1 + r() * 0.6); strandDraw(ctx, K, [[e[0], e[1] - d * 0.4, d], [e[0], e[1], d * 1.25], [e[0], e[1] + d * 0.4, d]]); }   // the drop at its tip
    // a fork or two off the side
    for (let b = 0, nb = r() < 0.6 ? 1 + (r() < 0.35 ? 1 : 0) : 0; b < nb; b++) {
      const p = pts[2 + Math.floor(r() * 7)], side = r() < 0.5 ? -1 : 1;
      strandDraw(ctx, K, strandPts(r, p[0], p[1], len * (0.3 + r() * 0.35), w * 0.8, ang + side * (0.4 + r() * 0.5)));
    }
    // a bead or two sat on their own nearby
    for (let d = 0, nd = Math.floor(r() * 3); d < nd; d++) { const p = pts[Math.floor(r() * pts.length)], bx = p[0] + (r() - 0.5) * size * 0.5, by = p[1] + (r() - 0.5) * size * 0.3, bw = w * (0.8 + r() * 0.6);
      strandDraw(ctx, K, [[bx, by - bw * 0.5, bw], [bx, by, bw * 1.2], [bx, by + bw * 0.5, bw]]); }
  }

  // one run: from where it landed, down the skin, swelling and narrowing like wax, ending in a pool or a hanging bead
  function run(ctx, r, K, x, y, len, w) {
    const steps = 14, pts = [], wob = (r() - 0.5) * 6, swell = r() * Math.PI * 2;
    let px = x;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps; px += (r() - 0.5) * 1.4 + wob * 0.06;
      const ww = w * (0.55 + 0.35 * Math.sin(t * 6 + swell) * (r() * 0.5 + 0.5)) * (1 - t * 0.25);
      pts.push([px, y + t * len, Math.max(1.2, ww)]);
    }
    const side = ribbon(ctx, pts); wet(ctx, K);
    shine(ctx, K, side.L, 1, Math.floor(steps * 0.7));
    const end = pts[pts.length - 1];
    if (r() < 0.55) { puddle(ctx, r, end[0], end[1] + w * 0.15, w * (0.9 + r() * 0.6), w * (0.45 + r() * 0.25), 0.35); wet(ctx, K); }   // a pool where it stopped
    else { ctx.beginPath(); ctx.ellipse(end[0], end[1] + w * 0.25, w * 0.55, w * 0.75, 0, 0, Math.PI * 2); wet(ctx, K); }               // a bead, hanging
    ctx.globalAlpha = 0.85; ctx.fillStyle = K.gloss; ctx.beginPath(); ctx.arc(end[0] - w * 0.2, end[1], Math.max(0.7, w * 0.12), 0, Math.PI * 2); ctx.fill();
  }
  // where it lands: a thin flat splash with a short tail in the way it flew, and its runs hanging off the bottom
  function splash(ctx, r, K, x, y, size, amount) {
    const w = size * (0.11 + r() * 0.12) * K.width, h = w * (0.35 + r() * 0.2), ang = (r() - 0.5) * 1.2;
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); puddle(ctx, r, 0, 0, w, h, 0.55); ctx.restore(); wet(ctx, K);
    // its runs: thin wax-like streams off the lower edge, longer the runnier it is
    const n = 1 + Math.round(r() * 2.2 * Math.min(1.4, K.run));
    for (let i = 0; i < n; i++) {
      const sx = x + (r() - 0.5) * w * 1.2, len = size * (0.4 + r() * 1.3) * K.run * (0.8 + amount * 0.25), sw = Math.max(2, w * (0.3 + r() * 0.3));
      run(ctx, r, K, sx, y + h * 0.3, len, sw);
    }
  }
  // a rope (cum): a long thin strand laid across, that sags and runs in places
  function rope(ctx, r, K, x, y, size) {
    const a = (r() - 0.5) * 1.4 + (r() < 0.5 ? 0 : Math.PI), l = size * (0.5 + r() * 0.8), pts = [];
    for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([x + Math.cos(a) * l * t, y + Math.sin(a) * l * t * 0.5 + Math.sin(t * Math.PI) * 6, 1.4 + Math.sin(t * Math.PI) * size * 0.05 * K.width]); }
    const side = ribbon(ctx, pts); wet(ctx, K); shine(ctx, K, side.L, 2, 8);
    if (r() < 0.6) { const p = pts[3 + Math.floor(r() * 5)]; run(ctx, r, K, p[0], p[1], size * (0.3 + r() * 0.6) * K.run, Math.max(2, p[2] * 1.3)); }
  }
  // a smear: a flat ragged stroke, as if wiped on with a hand
  function smear(ctx, r, K, x, y, size) {
    const a = (r() - 0.5) * 1.8, l = size * (0.5 + r() * 0.8), w0 = size * (0.18 + r() * 0.14) * K.width, pts = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([x + Math.cos(a) * l * (t - 0.5) + (r() - 0.5) * 2, y + Math.sin(a) * l * (t - 0.5) * 0.6 + (r() - 0.5) * 2, w0 * (0.4 + Math.sin(t * Math.PI) * 0.8) * (0.8 + r() * 0.4)]); }
    const side = ribbon(ctx, pts); wet(ctx, K);
    // dragged-thin streaks along the stroke, lighter where it's spread thin
    ctx.globalAlpha = 0.45; ctx.strokeStyle = K.gloss; ctx.lineWidth = 0.9;
    for (let s = 0; s < 3; s++) { const off = (r() - 0.5) * w0 * 0.6; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] + off) : ctx.moveTo(p[0], p[1] + off))); ctx.stroke(); }
    // cake: white frosting patches along the edges
    if (K.patches) { ctx.fillStyle = K.patches; for (let s = 0; s < 6; s++) { const p = (r() < 0.5 ? side.L : side.R)[Math.floor(r() * side.L.length)]; ctx.globalAlpha = 0.9; puddle(ctx, r, p[0], p[1], 2 + r() * w0 * 0.35, 1.5 + r() * w0 * 0.2, 0.6); ctx.fill(); } }
    // a slow run or two off the bottom of it
    if (r() < K.run) { const p = pts[Math.floor(r() * pts.length)]; run(ctx, r, K, p[0], p[1] + p[2] * 0.3, size * (0.3 + r() * 0.7) * K.run, Math.max(2.5, p[2] * 0.4)); }
  }

  // ── the game's own splatters, as stamps (Laynie, Oct 15: "side by side, they dont really match at all") ──
  // Every player's game has these pictures already (Assets/Female3DCG/BodyMarkings/Splatters_*.png). Each is cut into its
  // separate strands, and a mess is made by stamping those strands where it landed: the game's own art for cum, and the
  // same shapes tinted for honey, piss, the syrups, milk and slime. Turned a little and sized a little, never redrawn.
  const STAMP_FILES = ["Chest1", "Chest2", "Chest3", "Chest4", "Face1", "Face2", "Face3", "Forehead1", "Forehead2", "Forehead3", "Tummy1", "Tummy2", "Tummy3", "Tummy4"];
  const STAMPS = [];
  function cutStamps(img) {
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    const x = c.getContext("2d"); x.drawImage(img, 0, 0);
    const W = c.width, H = c.height, d = x.getImageData(0, 0, W, H).data, seen = new Uint8Array(W * H), out = [];
    for (let i = 0; i < W * H; i++) {
      if (seen[i] || d[i * 4 + 3] < 16) continue;
      // one strand: everything joined to this pixel (with a pixel of slack, so a beaded line stays one piece)
      const q = [i]; seen[i] = 1; let x0 = W, y0 = H, x1 = 0, y1 = 0, n = 0;
      while (q.length) {
        const p = q.pop(), px = p % W, py = (p / W) | 0; n++;
        if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
          const nx = px + dx, ny = py + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          const k = ny * W + nx; if (!seen[k] && d[k * 4 + 3] >= 16) { seen[k] = 1; q.push(k); }
        }
      }
      if (n < 25) continue;   // a speck
      const s2 = document.createElement("canvas"); s2.width = x1 - x0 + 3; s2.height = y1 - y0 + 3;
      s2.getContext("2d").drawImage(c, x0 - 1, y0 - 1, s2.width, s2.height, 0, 0, s2.width, s2.height);
      out.push(s2);
    }
    return out;
  }
  async function loadStamps(base) {
    if (STAMPS.length) return STAMPS.length;
    for (const n of STAMP_FILES) {
      try {
        const img = new Image(); img.crossOrigin = "anonymous";
        await new Promise((ok, no) => { img.onload = ok; img.onerror = no; setTimeout(no, 8000); img.src = (base || "") + "Assets/Female3DCG/BodyMarkings/Splatters_" + n + ".png"; });
        STAMPS.push(...cutStamps(img));
      } catch (e) { /* that one's missing: the others do */ }
    }
    return STAMPS.length;
  }
  // a strand in a mess's colour: the game's own shading kept (multiplied through), its own see-through-ness
  const tintCache = new Map();
  function tinted(st, K) {
    if (!K.tint) return st;
    const key = STAMPS.indexOf(st) + K.tint; if (tintCache.has(key)) return tintCache.get(key);
    const c = document.createElement("canvas"); c.width = st.width; c.height = st.height; const x = c.getContext("2d");
    x.drawImage(st, 0, 0); x.globalCompositeOperation = "multiply"; x.fillStyle = K.tint; x.fillRect(0, 0, c.width, c.height);
    x.globalCompositeOperation = "destination-in"; x.drawImage(st, 0, 0);
    // its own texture on top, kept inside the strand (Laynie: "texture the stamps for the different substances")
    if (K.texture) { x.globalCompositeOperation = "source-atop"; TEXTURES[K.texture](x, c.width, c.height, rng(st.width * 31 + st.height)); }
    tintCache.set(key, c); return c;
  }
  // textures, painted inside a strand: honey's long streaks of light, slime's bubbles, strawberry's seeds, chocolate's
  // hard shine, piss's thin bright wet sheen, milk's soft white middle, peppermint's stripes
  const TEXTURES = {
    streaks: (x, w, h, r) => { x.globalAlpha = 0.55; x.strokeStyle = "#FFF2B8"; x.lineWidth = 1; for (let i = 0; i < 3; i++) { const sx = r() * w; x.beginPath(); x.moveTo(sx, 0); x.lineTo(sx + (r() - 0.5) * 4, h); x.stroke(); } },
    bubbles: (x, w, h, r) => { x.globalAlpha = 0.7; x.strokeStyle = "#E4FFD6"; x.lineWidth = 0.8; for (let i = 0; i < Math.max(2, w * h / 120); i++) { x.beginPath(); x.arc(r() * w, r() * h, 0.8 + r() * 2, 0, Math.PI * 2); x.stroke(); } },
    seeds: (x, w, h, r) => { x.globalAlpha = 0.9; x.fillStyle = "#F7E27A"; for (let i = 0; i < Math.max(1, w * h / 160); i++) { x.beginPath(); x.ellipse(r() * w, r() * h, 0.6, 1, r() * 3, 0, Math.PI * 2); x.fill(); } },
    shine: (x, w, h, r) => { x.globalAlpha = 0.45; x.strokeStyle = "#D8B49A"; x.lineWidth = 1.2; x.beginPath(); x.moveTo(w * 0.3, 0); x.lineTo(w * 0.35, h); x.stroke(); },
    sheen: (x, w, h, r) => { x.globalAlpha = 0.35; x.fillStyle = "#FFFBE0"; x.fillRect(w * 0.25, 0, w * 0.2, h); },
    milky: (x, w, h, r) => { x.globalAlpha = 0.4; x.fillStyle = "#FFFFFF"; x.fillRect(0, 0, w, h); },
    // peppermint's candy-cane stripes, white and slantin'
    candy: (x, w, h, r) => { x.globalAlpha = 0.55; x.strokeStyle = "#FFFFFF"; x.lineWidth = 1.4; for (let i = -h; i < w + h; i += 5) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + h * 0.6, h); x.stroke(); } },
  };
  // a stamp, varied: turned, flipped (mirrored), narrowed or stretched, sized, each substance its own way
  function stamp(ctx, r, K, x, y, size) {
    const st = STAMPS[Math.floor(r() * STAMPS.length)], img = tinted(st, K), sc = (size / 60) * (0.75 + r() * 0.5);
    const flip = r() < 0.5 ? -1 : 1, narrow = K.narrow ? K.narrow[0] + r() * (K.narrow[1] - K.narrow[0]) : 0.85 + r() * 0.3, long = (K.long || 1) * (K.runX || 1);
    ctx.save(); ctx.translate(x, y); ctx.rotate((r() - 0.5) * (K.turn || 0.6)); ctx.scale(sc * flip * narrow, sc * long);
    ctx.globalAlpha = K.stampAlpha || 1; ctx.drawImage(img, -img.width / 2, -img.height * 0.3);
    ctx.restore();
  }

  function paint(ctx, kind, opt) {
    const K0 = KINDS[kind] || KINDS.cum, K = opt && opt.runX ? Object.assign({}, K0, { run: K0.run * opt.runX, runX: 0.85 + 0.15 * opt.runX }) : K0, r = rng((opt && opt.seed) || 1), amount = Math.max(0.3, (opt && opt.amount) || 1), at = (opt && opt.at) || [[250, 330, 40]];
    ctx.save(); ctx.lineJoin = "round";
    for (const [ax, ay, size] of at) {
      const spot = () => [ax + (r() - 0.5) * size * 1.5, ay + (r() - 0.5) * size * 0.9];
      if (K.style === "smear") {
        for (let i = 0, n = Math.round((2 + r() * 2) * amount); i < n; i++) { const [x, y] = spot(); smear(ctx, r, K, x, y, size); }
        if (K.also === "run") for (let i = 0, n = Math.round(r() * 2 * amount); i < n; i++) { const [x, y] = spot(); splash(ctx, r, K, x, y, size * 0.8, amount); }
        if (K.stampToo && STAMPS.length) for (let i = 0, n = Math.round((4 + r() * 4) * amount); i < n; i++) { const [x, y] = spot(); stamp(ctx, r, K, x, y, size); }
      } else if (STAMPS.length && K.stamp !== false) {
        // the game's own strands, stamped across the spot it hit, more of them the more there is
        for (let i = 0, n = Math.round((10 + r() * 8) * amount); i < n; i++) { const a = r() * Math.PI * 2, d = size * Math.sqrt(r()) * 1.5; stamp(ctx, r, K, ax + Math.cos(a) * d, ay + Math.sin(a) * d * 0.7 - size * 0.2, size); }
        for (let i = 0, n = Math.round(r() * 1.2 * amount * Math.min(1, K.run - 0.2)); i < n; i++) { const [x, y] = spot(); const p = [x, y]; run(ctx, r, K, p[0], p[1], size * (0.4 + r() * 0.9) * K.run, Math.max(2, size * 0.05)); }
      } else if (K.strands !== false) {
        for (let i = 0, n = Math.round((7 + r() * 6) * amount); i < n; i++) {
          // flung outward from where it hit, and pulled down a little by the weight of it
          const a = r() * Math.PI * 2, d = size * (0.1 + r() * 0.75), x = ax + Math.cos(a) * d, y = ay + Math.sin(a) * d * 0.7;
          const out = Math.atan2(Math.cos(a), Math.sin(a) * 0.7) * 0.6;   // (0 = straight down)
          strand(ctx, r, K, x, y, size, out + (r() - 0.5) * 0.4);
        }
        for (let i = 0, n = Math.round(r() * 1.6 * amount * Math.min(1, K.run)); i < n; i++) { const [x, y] = spot(); splash(ctx, r, K, x, y, size * 0.8, amount); }
      } else {
        for (let i = 0, n = Math.round((1.5 + r() * 2) * amount); i < n; i++) { const [x, y] = spot(); splash(ctx, r, K, x, y, size, amount); }
        for (let i = 0, n = K.ropes ? Math.round(r() * 2 * K.ropes * amount) : 0; i < n; i++) { const [x, y] = spot(); rope(ctx, r, K, x, y, size); }
      }
      // little flecks round about
      for (let i = 0, n = Math.round((4 + r() * 6) * amount * (K.droplets || 0.5)); i < n; i++) {
        const a = r() * Math.PI * 2, d = size * (0.5 + r() * 0.8); ctx.beginPath(); ctx.ellipse(ax + Math.cos(a) * d, ay + Math.sin(a) * d * 0.7, 0.8 + r() * 1.6, 0.8 + r() * 2.2, 0, 0, Math.PI * 2); wet(ctx, K, 0.9);
      }
      if (K.bubbles) for (let i = 0; i < 6 * amount; i++) { const [x, y] = spot(); ctx.globalAlpha = 0.55; ctx.strokeStyle = K.gloss; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.arc(x, y, 1.2 + r() * 3, 0, Math.PI * 2); ctx.stroke(); }
      if (K.seeds) for (let i = 0; i < 8 * amount; i++) { const [x, y] = spot(); ctx.globalAlpha = 0.9; ctx.fillStyle = K.seeds; ctx.beginPath(); ctx.ellipse(x, y, 0.8, 1.3, r() * 3, 0, Math.PI * 2); ctx.fill(); }
      if (K.specks) for (let i = 0; i < 16 * amount; i++) { const [x, y] = spot(); ctx.globalAlpha = 0.75; ctx.fillStyle = K.specks; ctx.beginPath(); ctx.arc(x, y, 0.5 + r() * 1.3, 0, Math.PI * 2); ctx.fill(); }
      if (K.crumbs) for (let i = 0; i < 14 * amount; i++) { const [x, y] = spot(); ctx.globalAlpha = 1; puddle(ctx, r, x, y, 1.2 + r() * (r() < 0.15 ? 5 : 2.2), 1 + r() * 2, 0.7); ctx.fillStyle = K.crumbs[Math.floor(r() * K.crumbs.length)]; ctx.fill(); }
      if (K.sprinkles) for (let i = 0; i < (K.sprinkleN || 12) * amount; i++) { const [x, y] = spot(), a = r() * Math.PI; ctx.globalAlpha = 1; ctx.strokeStyle = K.sprinkles[Math.floor(r() * K.sprinkles.length)]; ctx.lineWidth = 1.6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * 2.2, y - Math.sin(a) * 2.2); ctx.lineTo(x + Math.cos(a) * 2.2, y + Math.sin(a) * 2.2); ctx.stroke(); }
    }
    ctx.restore();
  }
  // a mess only lands on the body: painted on its own layer and kept where their own picture is
  function paintOn(ctx, body, kind, opt) {
    const c = document.createElement("canvas"); c.width = ctx.canvas.width; c.height = ctx.canvas.height;
    const x = c.getContext("2d"); paint(x, kind, opt);
    // blended in (Laynie: "some blending would help, some smoothing and smudging around the edges of the stamps"): a soft
    // smudge of itself spread round the edges and pulled a little downward, the way a wet mess smears on skin, then the
    // mess itself, softened a touch. Anything under it shows through the smudge, so layers run into each other.
    const m = document.createElement("canvas"); m.width = c.width; m.height = c.height; const mx = m.getContext("2d");
    const sm = (KINDS[kind] && KINDS[kind].smudge !== undefined) ? KINDS[kind].smudge : 1;   // (cake keeps its edges: it's meant to look like cake)
    mx.filter = "blur(" + (5 * sm) + "px)"; mx.globalAlpha = 0.5 * sm; mx.drawImage(c, 0, 4);
    mx.filter = "blur(" + (3 * sm) + "px)"; mx.globalAlpha = 0.45 * sm; mx.drawImage(c, 1, 2);
    mx.filter = "blur(" + Math.max(0.3, 1.2 * sm) + "px)"; mx.globalAlpha = 0.5; mx.drawImage(c, 0, 1);
    mx.filter = "blur(" + Math.max(0.2, 0.9 * sm) + "px)"; mx.globalAlpha = 0.95; mx.drawImage(c, 0, 0);
    if (body) { mx.filter = "none"; mx.globalCompositeOperation = "destination-in"; mx.drawImage(body, 0, 0); }
    ctx.drawImage(m, 0, 0);
  }
  // where things land on a standing character (500 × 1000): anywhere on the body; these are the usual spots
  const AREAS = { face: [250, 185, 34], forehead: [250, 150, 26], hair: [250, 120, 40], chest: [250, 330, 60], tummy: [250, 450, 50], crotch: [250, 560, 30],
                  thighL: [215, 650, 30], thighR: [285, 650, 30], armL: [150, 380, 22], armR: [350, 380, 22], back: [250, 380, 60] };
  root.FarmMess = { KINDS, AREAS, paint, paintOn, rng, loadStamps, STAMPS };
})(typeof window !== "undefined" ? window : globalThis);
