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
   THIRD PASS, THE STYLE (Oct 13). Laynie: "better, but not great, or even in the same art style of the body". Set beside the
   game's own cock picture, mine were inked in near-black with a hard gloss and strong colours. The game's are: flat
   pale skin; a THIN outline in a soft rose-brown (about three quarters of the skin's own colour, never dark); almost no
   shading, only a breath of it at the edges; a soft coral head; stubbier and thicker than I had them; and the root
   melts into the body with no line across it. So: the outline colour, the fill, the shading and the proportions are
   all taken from that picture now, and the animal kinds are the same style in softened colours.
   FIFTH PASS, VOLUME (Oct 13). Laynie: "looks better, still very cartoonish", and a third set of references: painted,
   mostly front-on. What makes those read as flesh and mine as stickers is roundness. So: each one is shaded as a round
   thing (dark toward both edges, one bright wet streak down the lit side that tapers at both ends, a shadow under the
   rim of the head and under the cock where it lies on the sack), the sack is two round weights with a deep cleft, a
   hard one leans to one side as it stands, and it stands IN FRONT of the belly (the studio draws it after the belly).
   Seen from the front. Soft, it hangs; hard, it stands. No game code in here: it only draws. window.FarmCock. */
(() => {
  const PX_PER_INCH = 9;   // the game's own soft cock is about 54 pixels long, and the farm calls the starting one 6 inches
  // w: half-width along the length, t from 0 (root) to 1 (tip), in units of the usual half-width. hard: standing.
  const KINDS = {
    human:    { label: "Human", col: null, tipCol: [240, 140, 132], sheath: null, soft: 1,
                w: (t) => { if (t < 0.66) return 1 - 0.04 * t; if (t < 0.71) return 0.97 - (t - 0.66) * 1.4; if (t < 0.735) return 0.9 + (t - 0.71) / 0.025 * 0.28;   // the shaft, the pinch, the rim
                  const h = (t - 0.735) / 0.265; return 1.18 * Math.pow(Math.max(0.0005, 1 - Math.pow(h, 2.2)), 0.5); }, headAt: 0.735, cleft: true },   // (a taller head: about a quarter of the length, as the game's is)
    canine:   { label: "Canine", col: [226, 118, 120], tipCol: [232, 108, 112], sheath: "skin", soft: 0.3, knot: true,
                w: (t) => 0.7 + 0.2 * Math.sin(Math.min(1, t / 0.8) * Math.PI) - (t > 0.8 ? Math.pow((t - 0.8) / 0.2, 1.3) * 0.62 : 0) + (t > 0.93 ? 0.1 * Math.sin((t - 0.93) / 0.07 * Math.PI) : 0) },
    equine:   { label: "Flared equine", col: [150, 116, 112], tipCol: [196, 150, 150], sheath: [118, 92, 90], soft: 0.6, ring: 0.5,
                w: (t, hard) => 1 + 0.07 * Math.exp(-Math.pow((t - 0.5) / 0.03, 2)) - 0.1 * Math.exp(-Math.pow((t - 0.86) / 0.07, 2)) + (t > 0.9 ? (hard ? 0.55 : 0.16) * Math.pow((t - 0.9) / 0.1, 0.7) : 0), flat: true },
    feline:   { label: "Barbed feline", col: [238, 164, 166], tipCol: [240, 150, 154], sheath: "skin", soft: 0.25, barbs: true, slim: 0.78,
                w: (t) => 0.95 - 0.62 * Math.pow(t, 1.25) },
    draconic: { label: "Ridged draconic", col: [176, 140, 196], tipCol: [206, 150, 200], sheath: [150, 120, 170], soft: 0.5, ridges: true,
                w: (t) => (1.08 - 0.72 * Math.pow(t, 1.5)) * (1 + 0.075 * Math.sin(t * Math.PI * 14) * (t < 0.9 ? 1 : 0)) },
    double:   { label: "Double", col: [236, 160, 162], tipCol: [240, 148, 152], sheath: "skin", soft: 0.5, two: true, slim: 0.8,
                w: (t) => 0.92 - 0.5 * Math.pow(t, 2.2) },
  };
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const rgb = (c, k) => "rgb(" + clamp(c[0] * k) + "," + clamp(c[1] * k) + "," + clamp(c[2] * k) + ")";
  const line = (c) => "rgb(" + clamp(c[0] * 0.74) + "," + clamp(c[1] * 0.62) + "," + clamp(c[2] * 0.6) + ")";   // the game's outline: the colour itself, deepened and warmed, never black
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  // how big each ball is across, for a farm level of 1 to 20 (3 is where the farm starts them)
  const ballR = (level) => 5 + 2.1 * Math.max(0, level - 1) + 0.18 * Math.pow(Math.max(0, level - 6), 2);   // (at the farm's starting 3 the sack is about as wide as the game draws it)

  // ── STAMPS (Oct 24) ──
  // After five drawn passes Laynie said these "simply won't do" and brought painted references instead. For each kind she
  // has settled, pictures cut from those take the place of the drawing (they live in studio/web/_stamps/<kind>/, never
  // in the repo). Human, her picks: hard, one of three shafts (18.1, 35.3, 33.2) standing in front of a separate sack,
  // drained (4.3) or pent up (37.16); soft, 24.4, split into its cock and its sack so each can be its own size. All of it
  // tinted to the body's skin. Until they've loaded, or for a kind with none, the drawing further down is used.
  const STAMP_FILES = { human: { hard: ["hard-18-1", "hard-35-3", "hard-33-2"], drained: "balls-4-3", pent: "balls-37-16", softShaft: "soft-24-4-shaft", softSack: "soft-24-4-sack" } };
  const stamps = {};   // kind -> the same names, each a picture { img, w, h, ref (its own lit skin colour), jx, nx }
  let ver = 0;         // goes up as stamps arrive, so a drawing made before them is made again
  const mk = (w, h) => { const c = document.createElement("canvas"); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  // what a picture is: its size, the skin colour its shading sits on (the 60th brightest of its drawn pixels: the lit
  // skin, not the shadow), where a standing shaft's root is across (the middle of its row 85% down) and where a hanging
  // one's top is across (the middle of its first row)
  function picOf(img) {
    const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height, c = mk(w, h), g = c.getContext("2d"); g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, w, h).data, ch = [[], [], []];
    for (let i = 0; i < d.length; i += 16) if (d[i + 3] > 200) for (let k = 0; k < 3; k++) ch[k].push(d[i + k]);
    const ref = ch.map((a) => a.sort((x, y) => x - y)[Math.floor(a.length * 0.6)] || 200);
    const span = (y) => { let l = -1, r = -1; for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 120) { if (l < 0) l = x; r = x; } return l < 0 ? null : [l, r]; };
    const mid = (y) => { const s = span(y); return s ? (s[0] + s[1]) / 2 : -1; }, wide = (y) => { const s = span(y); return s ? s[1] - s[0] : 0; };
    let top = 0; while (top < h - 1 && mid(top) < 0) top++;
    const jx = mid(Math.round(h * 0.85)), nx = mid(top);
    // a hanging sack's neck: from its top down to where it starts to widen out (a quarter wider than at the top)
    const topW = [0, 5, 10, 15, 20].map((k) => wide(Math.min(h - 1, top + k))).sort((a, b) => a - b)[2];
    let neck = top + 20; while (neck < h * 0.6 && wide(neck) < topW * 1.25) neck++;
    return { img: c, w, h, ref, jx: jx < 0 ? w / 2 : jx, nx: nx < 0 ? w / 2 : nx, neck };
  }
  // base: where the folders are ("/__studio/_stamps/"); or pics: { kind: { name: a data: URL } }, as the Companion would
  // carry them. done is called each time a kind is complete.
  function loadStamps(base, done, pics) {
    for (const [kind, files] of Object.entries(STAMP_FILES)) {
      const names = Object.values(files).flat(), got = {};
      for (const n of names) {
        const im = new Image(), src = pics && pics[kind] && pics[kind][n];
        im.onload = () => { got[n] = picOf(im); if (Object.keys(got).length < names.length) return;
          stamps[kind] = { hard: files.hard.map((x) => got[x]), drained: got[files.drained], pent: got[files.pent], softShaft: got[files.softShaft], softSack: got[files.softSack] };
          ver++; if (done) done(kind); };
        im.onerror = () => {};   // not there: that kind stays drawn
        im.src = src || base + kind + "/" + n + ".png";
      }
    }
  }
  const hasStamps = (kind) => !!stamps[kind];
  // a picture at a size, its colours moved from its own skin to hers (each channel by skin / its skin, shading kept).
  // draw(g, w, h), if given, puts the picture on the canvas some other way than stretched to fill it.
  function tinted(pic, w, h, skin, ref, draw) {
    const c = mk(w, h), g = c.getContext("2d"); g.imageSmoothingQuality = "high";
    if (draw) draw(g, c.width, c.height); else g.drawImage(pic.img, 0, 0, c.width, c.height);
    const r = ref || pic.ref, k = [skin[0] / r[0], skin[1] / r[1], skin[2] / r[2]], img = g.getImageData(0, 0, c.width, c.height), d = img.data;
    for (let i = 0; i < d.length; i += 4) { d[i] = Math.min(255, d[i] * k[0]); d[i + 1] = Math.min(255, d[i + 1] * k[1]); d[i + 2] = Math.min(255, d[i + 2] * k[2]); }
    g.putImageData(img, 0, 0); return c;
  }
  // the sack's width across for a farm ball level: about as wide as the drawn one; pent up, swollen a third wider
  const sackW = (level, pent) => 3.6 * ballR(level || 3) * (pent ? 1.3 : 1);
  function stampCanvas(st, o, bellyLit) {
    const inches = o.inches || 6, girth = o.girth || 1;
    // the skin colour handed over is read off the lit belly; between her legs the game's skin is a touch rosier (5% less
    // green and blue, measured on the white and the asian bodies alike), and that's what these have to sit in
    const skin = [bellyLit[0], bellyLit[1] * 0.948, bellyLit[2] * 0.955];
    if (o.hard) {
      // the shaft stands root to tip at inches x 9 x 1.06 pixels (as the drawn one does), its own shape, made thicker or
      // thinner by the girth; the sack hangs behind its root with its top tucked up behind it
      const n = st.hard.length, pic = st.hard[(((o.style | 0) % n) + n) % n], sack = o.pent ? st.pent : st.drained;
      const k = (inches * PX_PER_INCH * 1.06) / pic.h, sw = pic.w * k * girth, sh = pic.h * k;
      const bw = sackW(o.balls, o.pent), bh = (sack.h * bw) / sack.w;
      const cv = mk(Math.max(sw, bw) + 8, sh + bh + 10), g = cv.getContext("2d"), ax = cv.width / 2, ay = sh + 3;
      g.drawImage(tinted(sack, bw, bh, skin), ax - bw / 2, ay - bh * 0.22);
      g.drawImage(tinted(pic, sw, sh, skin), ax - pic.jx * k * girth, ay - sh);
      cv.ax = ax; cv.ay = ay - bh * 0.05; return cv;
    }
    // soft: at 7 inches and the farm's starting balls this is 24.4 as she picked it (two thirds of the whole picture at
    // inches x 9 x 1.15); the cock follows the inches and the sack the ball size, both hung from the top middle, and
    // both moved to her skin by the same amount so the two halves stay one colour
    const sack = st.softSack, cock = st.softShaft, k7 = (7 * PX_PER_INCH * 1.15 * 0.67) / sack.h;
    const kc = (k7 * inches) / 7, ks = (k7 * ballR(o.balls || 3)) / ballR(3) * (o.pent ? 1.15 : 1);
    // a big sack hangs from a short neck: the neck is stretched no longer than the cock's own size (or the picked one),
    // so heavy balls sit up against her instead of dangling off a long tube
    const kn = Math.min(ks, Math.max(kc, k7)), neckH = sack.neck * kn, sw = sack.w * ks, sh = neckH + (sack.h - sack.neck) * ks;
    const cw = cock.w * kc * girth, chh = cock.h * kc, nx = sack.nx;
    const left = Math.max(nx * ks, nx * kc * girth), right = Math.max((sack.w - nx) * ks, (cock.w - nx) * kc * girth);
    const cv = mk(left + right + 8, Math.max(sh, chh) + 8), g = cv.getContext("2d"), ax = left + 4, ay = 2;
    const twoPart = (sg, w, h) => { sg.drawImage(sack.img, 0, 0, sack.w, sack.neck, 0, 0, w, neckH); sg.drawImage(sack.img, 0, sack.neck, sack.w, sack.h - sack.neck, 0, neckH, w, h - neckH); };
    // the sack's top melts into her: a little at the picked size, more as it grows, so a big one has no cap on it
    const sc = tinted(sack, sw, sh, skin, null, twoPart), sg = sc.getContext("2d"), melt = Math.min(0.3, 0.05 * ks / k7);
    sg.globalCompositeOperation = "destination-out"; const mg = sg.createLinearGradient(0, 0, 0, sc.height * melt);
    mg.addColorStop(0, "rgba(0,0,0,1)"); mg.addColorStop(1, "rgba(0,0,0,0)"); sg.fillStyle = mg; sg.fillRect(0, 0, sc.width, sc.height * melt);
    g.drawImage(sc, ax - nx * ks, ay);
    g.drawImage(tinted(cock, cw, chh, skin, sack.ref), ax - nx * kc * girth, ay);
    cv.ax = ax; cv.ay = ay + 2 + chh * 0.1; return cv;   // (hung from a little below its top, as the whole picture was)
  }

  // o: { kind, knot, inches, girth (1 = usual for the length), balls (1..20), hard, skin [r,g,b], and for stamps: style
  // (which of the kind's hard ones), pent (the pent-up sack), stamps (false: the drawing even where there are stamps) }
  // Gives a canvas, with .ax .ay: the point in it where the cock joins her.
  function canvas(o) {
    const st = o.stamps !== false && stamps[o.kind || "human"];
    if (st) return stampCanvas(st, o, o.skin || [236, 204, 196]);
    const K = KINDS[o.kind] || KINDS.human, skin = o.skin || [236, 204, 196], hard = !!o.hard;
    const full = Math.max(16, (o.inches || 6) * PX_PER_INCH), L = full * (hard ? 1.06 : 0.9 * (0.55 + 0.45 * K.soft));   // soft, an animal's is partly drawn back
    const W = Math.max(7, (8 + full * 0.072) * (o.girth || 1) * (K.slim || 1) * (hard ? 1.06 : 1));                  // half-width: thicker as it gets longer, but not in step
    const br = ballR(o.balls || 3), knotted = !!(o.knot || K.knot), gap = K.two ? W * 1.25 : 0;
    const col = K.col || [skin[0], skin[1] * 0.93, skin[2] * 0.92], sh = K.sheath === "skin" || !K.sheath ? [skin[0] * 0.98, skin[1] * 0.93, skin[2] * 0.91] : K.sheath;
    const bend = (hard ? 0.11 : 0.09) * L;   // how far it bows to the side
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
      grad.addColorStop(0, rgb(skin, 1.02)); grad.addColorStop(0.55, rgb(skin, 0.99)); grad.addColorStop(1, rgb([skin[0], skin[1] * 0.86, skin[2] * 0.84], 0.86));
      g.fillStyle = grad; path(); g.fill();
      g.save(); path(); g.clip();
      const cleft = g.createLinearGradient(ox - r * 0.5, 0, ox + r * 0.5, 0); cleft.addColorStop(0, "rgba(120,60,55,0)"); cleft.addColorStop(0.5, "rgba(140,70,66,0.30)"); cleft.addColorStop(1, "rgba(120,60,55,0)");
      g.fillStyle = cleft; g.fillRect(ox - r * 0.5, cy - r * 0.6, r, r * 2.2);
      const und = g.createLinearGradient(0, cy + r * 0.3, 0, cy + r * 1.4); und.addColorStop(0, "rgba(120,60,55,0)"); und.addColorStop(1, "rgba(140,70,66,0.26)");
      g.fillStyle = und; g.fillRect(0, cy, cv.width, r * 2); g.restore();
      g.fillStyle = "rgba(255,255,255,0.6)"; for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(ox + sd * r * 0.95 - r * 0.28, cy + r * 0.05 + (sd < 0 ? r * 0.12 : 0), r * 0.11, r * 0.3, 0.35, 0, Math.PI * 2); g.fill(); }
      g.strokeStyle = line(skin); g.lineWidth = 1.2; path(); g.stroke();
      g.strokeStyle = line(skin); g.globalAlpha = 0.6; g.lineWidth = 1; g.beginPath(); g.moveTo(ox, cy + r * 0.2); g.quadraticCurveTo(ox + r * 0.08, cy + r * 0.3, ox, cy + r * 0.93); g.stroke(); g.globalAlpha = 1;   // the seam
    };

    // ── one cock: a single outline from root to tip ──
    const shaft = (dx, lean) => {
      const dir = hard ? -1 : 1, N = 56, kn = (t) => (knotted && hard ? 0.85 * Math.pow(Math.max(0, 1 - Math.pow((t - 0.2) / 0.105, 2)), 0.5) : 0);
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
      const across = g.createLinearGradient(ox + dx - W * 1.6, 0, ox + dx + W * 1.6, 0); across.addColorStop(0.12, "rgba(110,50,48,0.34)"); across.addColorStop(0.36, "rgba(255,255,255,0.10)"); across.addColorStop(0.6, "rgba(0,0,0,0)"); across.addColorStop(0.9, "rgba(110,50,48,0.42)");
      g.fillStyle = across; g.fillRect(0, 0, cv.width, cv.height);
      if (K.ring) { const c = cen(K.ring); g.strokeStyle = line(col); g.lineWidth = 1.2; g.beginPath(); g.moveTo(c[0] - W * 1.4, c[1]); g.quadraticCurveTo(c[0], c[1] + dir * W * 0.5, c[0] + W * 1.4, c[1]); g.stroke();
        g.fillStyle = "rgba(222,150,152,0.45)"; for (const [a, b2, r] of [[-0.4, 0.7, 0.3], [0.35, 0.78, 0.22], [0.0, 0.9, 0.3], [-0.3, 0.6, 0.16]]) { const c3 = cen(b2); g.beginPath(); g.ellipse(c3[0] + a * W, c3[1], r * W, r * W * 1.5, 0, 0, Math.PI * 2); g.fill(); } }   // the medial ring, and pink mottling toward the end
      if (K.ridges) { g.strokeStyle = line(col); g.lineWidth = 1.1; for (let t = 0.1; t < 0.9; t += 1 / 7) { const c = cen(t), w = wd(t); g.beginPath(); g.moveTo(c[0] - w, c[1] - dir * w * 0.2); g.quadraticCurveTo(c[0], c[1] + dir * w * 0.6, c[0] + w, c[1] - dir * w * 0.2); g.stroke(); } }
      if (K.headAt) { const c = cen(K.headAt), w = wd(K.headAt) * 1.25; g.strokeStyle = line(K.tipCol); g.lineWidth = 1.1; g.beginPath(); g.moveTo(c[0] - w, c[1] - dir * w * 0.1); g.quadraticCurveTo(c[0], c[1] - dir * w * 0.55, c[0] + w, c[1] - dir * w * 0.1); g.stroke();
        const e = cen(0.985); g.beginPath(); g.moveTo(e[0], e[1] - dir * W * 0.25); g.lineTo(e[0], e[1] + dir * W * 0.12); g.stroke();
        if (K.cleft) { const a = cen(K.headAt + 0.02), b2 = cen(0.97); g.globalAlpha = 0.5; g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(a[0] + W * 0.12, (a[1] + b2[1]) / 2, b2[0], b2[1]); g.stroke(); g.globalAlpha = 1; } }   // the rim of the head, the slit, and the line down the middle of it
      if (!K.ridges) { const top = K.headAt ? K.headAt - 0.06 : 0.7, P2 = (t, k) => { const c = cen(t), w = wd(t); return [c[0] + k * w, c[1]]; };
        g.strokeStyle = line(col); g.globalAlpha = hard ? 0.55 : 0.3; g.lineWidth = 1;
        const vein = (pts) => { g.beginPath(); pts.forEach(([t, k], i) => { const p = P2(Math.min(top, t), k); if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.stroke(); };
        vein([[0.16, -0.25], [0.26, -0.5], [0.38, -0.3], [0.5, -0.55], [0.62, -0.25], [0.74, -0.4]]); vein([[0.38, -0.3], [0.46, 0.1], [0.56, 0.3]]); vein([[0.2, 0.45], [0.32, 0.6], [0.44, 0.4]]);
        g.globalAlpha = 1; }
      if (false) { g.beginPath(); const a = cen(0.2), b2 = cen(0.45), c4 = cen(0.68); g.moveTo(a[0] - W * 0.3, a[1]); g.bezierCurveTo(b2[0] - W * 0.8, b2[1], b2[0] + W * 0.4, b2[1], c4[0] - W * 0.1, c4[1]); g.stroke(); }   // a vein
      { g.fillStyle = "rgba(255,255,255,0.72)"; g.beginPath(); const A0 = 0.16, A1 = (K.headAt || 0.8) - 0.08, pts = [];
        for (let t = A0; t <= A1; t += 0.02) { const c = cen(t), w = wd(t), u = (t - A0) / (A1 - A0), th = w * 0.13 * Math.sin(u * Math.PI); pts.push([c[0] - w * 0.5, c[1], th]); }
        pts.forEach((p, i) => (i ? g.lineTo(p[0] - p[2], p[1]) : g.moveTo(p[0] - p[2], p[1]))); for (let i = pts.length - 1; i >= 0; i--) g.lineTo(pts[i][0] + pts[i][2], pts[i][1]); g.closePath(); g.fill();
        if (K.headAt) { const c = cen(K.headAt + (1 - K.headAt) * 0.45), w = wd(K.headAt + 0.05); g.beginPath(); g.ellipse(c[0] - w * 0.42, c[1], w * 0.14, w * 0.3, 0.3, 0, Math.PI * 2); g.fill();          // and a glint on the head
          const r0 = cen(K.headAt - 0.03), sh2 = g.createLinearGradient(0, r0[1], 0, r0[1] - dir * W * 0.9); sh2.addColorStop(0, "rgba(110,50,48,0.30)"); sh2.addColorStop(1, "rgba(110,50,48,0)"); g.fillStyle = sh2; g.fillRect(0, Math.min(r0[1], r0[1] - dir * W * 0.9), cv.width, W * 0.9); } }   // the shadow the rim throws back down the shaft
      g.restore();
      if (K.barbs) { g.fillStyle = line(col); for (let t = 0.45; t < 0.92; t += 0.1) for (const sd of [0, 1]) { const i = Math.round(t * N), p = (sd ? R0 : L0)[i], c = cen(t), ux2 = (p[0] - c[0]) / (wd(t) || 1), uy2 = (p[1] - c[1]) / (wd(t) || 1), s2 = Math.max(1.6, W * 0.22); g.beginPath(); g.moveTo(p[0], p[1] - dir * s2 * 0.6); g.lineTo(p[0] + ux2 * s2 * 1.3, p[1] + uy2 * s2 * 1.3 - dir * s2 * 1.4); g.lineTo(p[0], p[1] + dir * s2 * 0.5); g.closePath(); g.fill(); } }
      g.strokeStyle = line(mix(col, K.tipCol, 0.5)); g.lineWidth = 1.2; outline(); g.stroke();
      // the sheath it comes out of: a soft sleeve round the root, a little wider than the shaft, with a rolled edge
      if (!K.sheath && hard) return;   // (a human one, standing, has no sleeve at the root)
      const sl = hard ? Math.min(0.11, 10 / L + 0.03) : (K.sheath ? 0.62 : 0.14), M = Math.max(2, Math.round(sl * N)), sw = 1.16;
      const sp = () => { g.beginPath(); for (let i = 0; i <= M; i++) { const c = cen(i / N), p = L0[i]; g.lineTo(c[0] + (p[0] - c[0]) * sw, c[1] + (p[1] - c[1]) * sw); } const cE = cen(M / N); g.quadraticCurveTo(cE[0], cE[1] + dir * W * 0.5, cE[0] + (R0[M][0] - cE[0]) * sw, cE[1] + (R0[M][1] - cE[1]) * sw); for (let i = M; i >= 0; i--) { const c = cen(i / N), p = R0[i]; g.lineTo(c[0] + (p[0] - c[0]) * sw, c[1] + (p[1] - c[1]) * sw); } g.closePath(); };
      const sg = g.createLinearGradient(ox + dx - W * 1.6, 0, ox + dx + W * 1.6, 0); sg.addColorStop(0, rgb(sh, 0.97)); sg.addColorStop(0.36, rgb(sh, 1)); sg.addColorStop(1, rgb(sh, 0.96));
      g.fillStyle = sg; sp(); g.fill(); g.strokeStyle = line(sh); g.lineWidth = 1.2; sp(); g.stroke();
    };
    const shafts = () => { if (K.two) { shaft(-gap * 0.5, 0.6); shaft(gap * 0.5, 0.6); } else shaft(0, 0); };
    // standing, the sack is in front of the root; hanging, the cock lies in front of the sack
    if (hard) { shafts(); sack(); } else { sack(); shafts(); }
    // where it joins her there's no line: the top few pixels fade out, as the game's own does
    g.globalCompositeOperation = "destination-out";
    const melt = g.createLinearGradient(0, oy - W * 0.5, 0, oy + W * 0.7); melt.addColorStop(0, "rgba(0,0,0,1)"); melt.addColorStop(1, "rgba(0,0,0,0)");
    if (!hard) { g.fillStyle = melt; g.fillRect(0, oy - W * 1.4, cv.width, W * 2.1); }
    g.globalCompositeOperation = "source-over";
    return cv;
  }
  window.FarmCock = { KINDS, PX_PER_INCH, ballR, canvas, loadStamps, hasStamps, STAMP_FILES, get ver() { return ver; } };
})();
