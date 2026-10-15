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
    cum:        { style: "run", base: "#F3F0E4", edge: "#CFC8B0", gloss: "#FFFFFF", alpha: 0.82, run: 1.0, width: 1.0, ropes: 1, beads: 0.6 },
    cumThick:   { style: "run", base: "#EEE8D6", edge: "#C9BFA2", gloss: "#FFFFFF", alpha: 0.92, run: 0.7, width: 1.4, ropes: 0.6, beads: 0.8 },
    piss:       { style: "run", base: "#F0D040", edge: "#C9A422", gloss: "#FFF6C0", alpha: 0.34, run: 1.6, width: 0.7, beads: 0.3, droplets: 1.5 },
    milk:       { style: "run", base: "#FBFBF6", edge: "#DADAD0", gloss: "#FFFFFF", alpha: 0.72, run: 1.4, width: 0.8, beads: 0.4, droplets: 0.8 },
    honey:      { style: "run", base: "#E09A18", edge: "#9C6208", gloss: "#FFE7A3", alpha: 0.74, run: 1.1, width: 1.2, beads: 0.9 },
    maple:      { style: "run", base: "#94501A", edge: "#56290A", gloss: "#F0B47A", alpha: 0.78, run: 1.3, width: 1.0, beads: 0.7 },
    chocolate:  { style: "run", base: "#4A2814", edge: "#251208", gloss: "#B98A6A", alpha: 0.95, run: 1.0, width: 1.2, beads: 0.8 },
    strawberry: { style: "run", base: "#D52F4C", edge: "#951628", gloss: "#FFB3C0", alpha: 0.8, run: 1.2, width: 1.0, beads: 0.7, seeds: "#F6E27A" },
    slime:      { style: "smear", base: "#6CC24A", edge: "#3A8226", gloss: "#D9FFC8", alpha: 0.6, run: 1.0, width: 1.1, beads: 0.6, bubbles: true, also: "run" },
    cream:      { style: "smear", base: "#FFF6E4", edge: "#E2D4B4", gloss: "#FFFFFF", alpha: 0.96, run: 0.35, width: 1.2 },
    cake:       { style: "smear", base: "#FFD8E6", edge: "#E3A9BC", gloss: "#FFFFFF", alpha: 0.97, run: 0.2, width: 1.3, patches: "#FFFFFF", crumbs: ["#E8C27A", "#D9A85B", "#C98F45", "#7A4A2A"], sprinkles: ["#FF5C8A", "#5CC8FF", "#FFE05C", "#7CE07C"] },
    mud:        { style: "smear", base: "#6B4A2B", edge: "#45301A", gloss: "#9C7A55", alpha: 0.9, run: 0.5, width: 1.2, specks: "#3A2614", also: "run" },
    mash:       { style: "smear", base: "#D9C28C", edge: "#B09860", gloss: "#F5E8C2", alpha: 0.95, run: 0.25, width: 1.2, specks: "#A88A4A" },
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
    const w = size * (0.22 + r() * 0.2) * K.width, h = w * (0.3 + r() * 0.2), ang = (r() - 0.5) * 1.2;
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); puddle(ctx, r, 0, 0, w, h, 0.55); ctx.restore(); wet(ctx, K);
    // its runs: thin wax-like streams off the lower edge, longer the runnier it is
    const n = 1 + Math.round(r() * 2.2 * Math.min(1.4, K.run));
    for (let i = 0; i < n; i++) {
      const sx = x + (r() - 0.5) * w * 1.4, len = size * (0.4 + r() * 1.3) * K.run * (0.8 + amount * 0.25), sw = Math.max(2, w * (0.18 + r() * 0.22));
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

  function paint(ctx, kind, opt) {
    const K = KINDS[kind] || KINDS.cum, r = rng((opt && opt.seed) || 1), amount = Math.max(0.3, (opt && opt.amount) || 1), at = (opt && opt.at) || [[250, 330, 40]];
    ctx.save(); ctx.lineJoin = "round";
    for (const [ax, ay, size] of at) {
      const spot = () => [ax + (r() - 0.5) * size * 1.5, ay + (r() - 0.5) * size * 0.9];
      if (K.style === "smear") {
        for (let i = 0, n = Math.round((2 + r() * 2) * amount); i < n; i++) { const [x, y] = spot(); smear(ctx, r, K, x, y, size); }
        if (K.also === "run") for (let i = 0, n = Math.round(r() * 2 * amount); i < n; i++) { const [x, y] = spot(); splash(ctx, r, K, x, y, size * 0.8, amount); }
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
      if (K.sprinkles) for (let i = 0; i < 12 * amount; i++) { const [x, y] = spot(), a = r() * Math.PI; ctx.globalAlpha = 1; ctx.strokeStyle = K.sprinkles[Math.floor(r() * K.sprinkles.length)]; ctx.lineWidth = 1.6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * 2.2, y - Math.sin(a) * 2.2); ctx.lineTo(x + Math.cos(a) * 2.2, y + Math.sin(a) * 2.2); ctx.stroke(); }
    }
    ctx.restore();
  }
  // a mess only lands on the body: painted on its own layer and kept where their own picture is
  function paintOn(ctx, body, kind, opt) {
    const c = document.createElement("canvas"); c.width = ctx.canvas.width; c.height = ctx.canvas.height;
    const x = c.getContext("2d"); paint(x, kind, opt);
    if (body) { x.globalCompositeOperation = "destination-in"; x.drawImage(body, 0, 0); }
    ctx.drawImage(c, 0, 0);
  }
  // where things land on a standing character (500 × 1000): anywhere on the body; these are the usual spots
  const AREAS = { face: [250, 185, 34], forehead: [250, 150, 26], hair: [250, 120, 40], chest: [250, 330, 60], tummy: [250, 450, 50], crotch: [250, 560, 30],
                  thighL: [215, 650, 30], thighR: [285, 650, 30], armL: [150, 380, 22], armR: [350, 380, 22], back: [250, 380, 60] };
  root.FarmMess = { KINDS, AREAS, paint, paintOn, rng };
})(typeof window !== "undefined" ? window : globalThis);
