/* WHAT'S IN THIS FILE (nipple-toys-art.js)
   THE NIPPLE TOYS' PICTURES (Nov 18; Laynie: "maybe make them plug able with certain toys? like beads, dildos,
   vibrators, etc?", "I mean art for existing items", "the dildos could look more like how the plugs do"). The game's own
   toys, drawn in an open nipple, for the game's nipple slot (ItemNipples). Run in a browser (import it, then allFiles())
   to make the pictures the repo hosts (toys/v1/ItemNipples/<Name>_<Size>[_<type>]_Toy.png, 200 by 200 like the game's own nipple items, and
   Preview/<Name>.png). No body in them: the toy and a pink stretched rim; the drawn breasts put the opened nipple under.
   Where each nipple sits, per breast size: the middle of the game's own nipple picture for that size (Nipples1, drawn at
   175,285; the slot's pictures at 150,200).
*/
export const SIZES = ["Small", "Normal", "Large", "XLarge", "FlatSmall", "FlatMedium"];
export const NIPS = {
  Small: [[58.4, 110.7], [140.7, 110.9]], Normal: [[56.4, 111], [142.7, 111]], Large: [[54.9, 111.4], [144.3, 111.5]],
  XLarge: [[53.5, 112], [145.7, 112]], FlatSmall: [[58.3, 107.6], [137.9, 107.8]], FlatMedium: [[58.3, 107.6], [137.9, 107.8]],
};
const SCALE = { Small: 0.46, Normal: 0.5, Large: 0.52, XLarge: 0.55, FlatSmall: 0.46, FlatMedium: 0.46 };
// the toys: our name, the game's toy it's the nipple version of, the wardrobe name, how open it holds them, and its pictures'
// states (typed: the bead count; pump: how pumped up)
export const TOYS = [
  { id: "FarmNipBeadsXL", from: ["ItemButt", "AnalBeads2"], label: "Nipple Beads XL", open: 2, states: "typed" },
  { id: "FarmNipBeads", from: ["ItemButt", "AnalBeads"], label: "Nipple Beads", open: 3 },
  { id: "FarmNipPlug", from: ["ItemButt", "BlackButtPlug"], label: "Black Nipple Plug", open: 3 },
  { id: "FarmNipHeartPlug", from: ["ItemButt", "SuccubusHeartButtPlug"], label: "Succubus Heart Nipple Plug", open: 2 },
  { id: "FarmNipDemonPlug", from: ["ItemButt", "DemonPlug"], label: "Demon Tail Nipple Plug", open: 2 },
  { id: "FarmNipLockPlug", from: ["ItemButt", "ButtPlugLock"], label: "Nipple Plug Lock", open: 3, lock: true },
  { id: "FarmNipPumpPlug", from: ["ItemButt", "InflVibeButtPlug"], label: "Inflatable Vibrating Nipple Plug", open: 2, states: "pump", vibe: "modular" },
  { id: "FarmNipVibePlug", from: ["ItemButt", "VibratingButtplug"], label: "Vibrating Nipple Plug", open: 3, vibe: true },
  { id: "FarmNipEgg", from: ["ItemVulva", "VibratingEgg"], label: "Nipple Vibrating Egg", open: 2, vibe: true },
  { id: "FarmNipWiredEgg", from: ["ItemVulva", "WiredEgg"], label: "Wired Nipple Egg", open: 2, vibe: true },
  { id: "FarmNipBenWa", from: ["ItemVulva", "BenWaBalls"], label: "Nipple Ben Wa Balls", open: 2 },
  { id: "FarmNipDildo", from: ["ItemVulva", "PenisDildo"], label: "Nipple Dildo", open: 3 },
  { id: "FarmNipVibeDildo", from: ["ItemVulva", "VibratingDildo"], label: "Vibrating Nipple Dildo", open: 3, vibe: true },
  { id: "FarmNipPumpDildo", from: ["ItemVulva", "InflatableVibeDildo"], label: "Inflatable Vibrating Nipple Dildo", open: 3, states: "pump", vibe: "modular" },
  { id: "FarmNipSound", from: ["ItemVulvaPiercings", "UrethralSound"], label: "Nipple Sound", open: 1 },
];
export const STATES = { typed: ["typed0", "typed1", "typed2", "typed3", "typed4"], pump: ["f0", "f1", "f2", "f3", "f4"] };

// ── drawing (in the sheet's units: a nipple's 20 across, drawn at half or so) ──
const RAD = 20;
const SILVER = ["#ffffff", "#6d7280"], BLACK = ["#6a6a70", "#0c0c0e"], PINK = ["#ffd6e6", "#e889b0"], RED = ["#ff8080", "#b00018"];
// the stretched rim round the toy: pink, soft at the edge (on the plain body it says "stretched"; the drawn one has the
// opened nipple under it too)
function rim(g, x, y, level) {
  const hole = RAD * (0.2 + 0.16 * level), r = hole * 1.9;
  const gr = g.createRadialGradient(x, y - hole * 0.1, hole * 0.7, x, y, r);
  gr.addColorStop(0, "rgba(214,98,122,0.95)"); gr.addColorStop(0.55, "rgba(226,128,146,0.6)"); gr.addColorStop(1, "rgba(232,150,160,0)");
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  return hole;
}
const glint = (g, x, y, r, a) => { g.fillStyle = "rgba(255,255,255," + (a || 0.8) + ")"; g.beginPath(); g.ellipse(x - r * 0.35, y - r * 0.42, r * 0.3, r * 0.16, -0.6, 0, Math.PI * 2); g.fill(); };
const sphere = (g, x, y, r, c1, c2) => { const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.08, x, y, r); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 1; g.stroke(); glint(g, x, y, r); };
const cord = (g, pts, col, wd) => { g.strokeStyle = col; g.lineWidth = wd || 2; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.stroke(); };
const curve = (g, a, b, c, d, col, wd) => { g.strokeStyle = col; g.lineWidth = wd || 2; g.lineCap = "round"; g.beginPath(); g.moveTo(a[0], a[1]); g.bezierCurveTo(b[0], b[1], c[0], c[1], d[0], d[1]); g.stroke(); };
const flare = (g, x, y, rx, ry, cols) => { const gr = g.createRadialGradient(x - rx * 0.3, y - ry * 0.4, 1, x, y, Math.max(rx, ry)); gr.addColorStop(0, cols[0]); gr.addColorStop(1, cols[1]); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = "rgba(0,0,0,0.4)"; g.lineWidth = 1; g.stroke(); glint(g, x, y, Math.min(rx, ry)); };
const disc = (g, x, y, r, cols) => { const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.4, 1, x, y, r); gr.addColorStop(0, cols[0]); gr.addColorStop(1, cols[1]); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.strokeStyle = "rgba(0,0,0,0.4)"; g.lineWidth = 1; g.stroke(); };
const ring = (g, x, y, rx, ry, col, wd) => { g.strokeStyle = col; g.lineWidth = wd || 2; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.stroke(); };
const bulb = (g, x, y, r) => { sphere(g, x, y, r, ...BLACK); g.fillStyle = "#2a2a2e"; g.fillRect(x - 3, y - r - 4, 6, 5); };

// one toy in one nipple. side: -1 the left one (hangs out to the left), 1 the right. st: its state's number (beads in,
// how pumped up), or 0.
const DRAW = {
  FarmNipBeadsXL(g, x, y, s, st) {
    const h = rim(g, x, y, 2), inn = st + 1, out = 5 - inn;   // (1 to 5 in: the rest hang on the cord)
    const pts = [[x, y + h]]; for (let i = 1; i <= out; i++) pts.push([x + s * (2 + i * 1.2), y + 4 + i * 16]);
    const end = [x + s * (3 + out * 1.4), y + 16 + out * 16];
    cord(g, pts.concat([end]), "#2a2a2e", 2);
    sphere(g, x, y, h * 1.15, ...SILVER);
    for (let i = 1; i <= out; i++) sphere(g, pts[i][0], pts[i][1], 7, ...SILVER);
    ring(g, end[0], end[1] + 8, 6, 9, "#2a2a2e", 2.2);
  },
  FarmNipBeads(g, x, y) { const h = rim(g, x, y, 3); flare(g, x, y + 2, h * 1.55, h * 1.15, BLACK); ring(g, x, y + 2, h * 0.9, h * 0.6, "rgba(255,255,255,0.2)", 1.5); },
  FarmNipPlug(g, x, y) { const h = rim(g, x, y, 3); flare(g, x, y, h * 1.5, h * 1.3, BLACK); },
  FarmNipHeartPlug(g, x, y, s) {
    const h = rim(g, x, y, 2);
    g.lineWidth = 3; for (let k = 0; k < 9; k++) { g.strokeStyle = k % 2 ? "#111" : "#f4f4f4"; const P = (t) => [x + s * (10 + 40 * t), y + 6 + 60 * t * t - 20 * t]; const a = P(k / 9), b = P((k + 1) / 9); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    g.save(); g.translate(x, y); const r = h * 1.25; const gr = g.createRadialGradient(-r * 0.3, -r * 0.3, 1, 0, 0, r * 1.3); gr.addColorStop(0, "#ff7a7a"); gr.addColorStop(1, "#a8001a"); g.fillStyle = gr;
    g.beginPath(); g.moveTo(0, r * 1.1); g.bezierCurveTo(-r * 1.6, 0, -r * 0.8, -r * 1.2, 0, -r * 0.35); g.bezierCurveTo(r * 0.8, -r * 1.2, r * 1.6, 0, 0, r * 1.1); g.fill(); g.restore(); glint(g, x - 2, y, h);
  },
  FarmNipDemonPlug(g, x, y, s) {
    const h = rim(g, x, y, 2); curve(g, [x, y], [x + s * 26, y + 10], [x + s * 10, y + 50], [x + s * 34, y + 62], "#b0001c", 3);
    const tx = x + s * 34, ty = y + 62; g.fillStyle = "#d0102c"; g.beginPath(); g.moveTo(tx, ty - 9); g.quadraticCurveTo(tx + s * 12, ty, tx, ty + 10); g.quadraticCurveTo(tx - s * 4, ty, tx, ty - 9); g.fill();
    sphere(g, x, y, h * 1.1, ...RED);
  },
  FarmNipLockPlug(g, x, y) {
    const h = rim(g, x, y, 3);
    for (let k = 0; k < 4; k++) { g.save(); g.translate(x, y); g.rotate(k / 4 * Math.PI * 2 + 0.78); const gr = g.createLinearGradient(0, -3, 0, 3); gr.addColorStop(0, "#fff"); gr.addColorStop(1, "#8a909a"); g.fillStyle = gr; g.beginPath(); g.ellipse(h * 0.75, 0, h * 0.75, h * 0.38, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
    sphere(g, x, y, h * 0.55, ...SILVER); cord(g, [[x, y + h * 0.6], [x, y + 22]], "#9aa0aa", 2.5);
    g.fillStyle = "#d4a017"; g.fillRect(x - 6, y + 22, 12, 11); g.strokeStyle = "#d4a017"; g.lineWidth = 2.5; g.beginPath(); g.arc(x, y + 22, 4.5, Math.PI, 0); g.stroke();
  },
  FarmNipPumpPlug(g, x, y, s, st) {
    const k = 1 + 0.13 * st, h = rim(g, x, y, Math.min(3, 2 + st * 0.35));
    curve(g, [x, y + h], [x + s * 4, y + 30], [x + s * 18, y + 40], [x + s * 20, y + 62], "#111", 3); bulb(g, x + s * 20, y + 74, 12);
    flare(g, x, y, h * 1.45 * k, h * 1.25 * k, BLACK);
  },
  FarmNipVibePlug(g, x, y) { const h = rim(g, x, y, 3); flare(g, x, y, h * 1.5, h * 1.25, BLACK); disc(g, x, y, h * 0.42, ["#ff9fd0", "#d0186e"]); },
  FarmNipEgg(g, x, y) { const h = rim(g, x, y, 2); sphere(g, x, y, h * 1.15, ...PINK); },
  FarmNipWiredEgg(g, x, y, s) {
    const h = rim(g, x, y, 2); curve(g, [x, y + h], [x + s * 2, y + 28], [x + s * 16, y + 40], [x + s * 18, y + 58], "#f07ab8", 2);
    g.fillStyle = "#f29ac4"; g.fillRect(x + s * 18 - 6, y + 58, 12, 24); g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 1; g.strokeRect(x + s * 18 - 6, y + 58, 12, 24);
    g.fillStyle = "#ffd6e6"; g.beginPath(); g.arc(x + s * 18, y + 66, 3.5, 0, Math.PI * 2); g.fill(); sphere(g, x, y, h * 1.15, ...PINK);
  },
  FarmNipBenWa(g, x, y, s) {
    const h = rim(g, x, y, 2); g.strokeStyle = "#2a2a2e"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y + h); g.quadraticCurveTo(x - s * 14, y + 34, x + s * 2, y + 46); g.stroke();
    ring(g, x + s * 8, y + 56, 6, 10, "#2a2a2e", 2); sphere(g, x, y, h * 1.2, ...SILVER);
  },
  // the dildos front-on, like the plugs (Laynie: "the dildos could look more like how the plugs do"): their base
  FarmNipDildo(g, x, y) { const h = rim(g, x, y, 3); disc(g, x, y, h * 1.75, BLACK); ring(g, x, y, h * 1.3, h * 1.3, "rgba(255,255,255,0.22)", 1.5); g.fillStyle = "rgba(0,0,0,0.55)"; g.beginPath(); g.arc(x, y, h * 0.55, 0, Math.PI * 2); g.fill(); glint(g, x, y, h * 1.75); },
  FarmNipVibeDildo(g, x, y) {
    const h = rim(g, x, y, 3); disc(g, x, y, h * 1.6, ["#ff9fd0", "#d0186e"]); ring(g, x, y, h * 1.15, h * 1.15, "#d6dbe2", 3);
    g.fillStyle = "#e9edf2"; g.beginPath(); g.arc(x, y, h * 0.45, 0, Math.PI * 2); g.fill(); glint(g, x, y, h * 1.6);
  },
  FarmNipPumpDildo(g, x, y, s, st) {
    const k = 1 + 0.12 * st, h = rim(g, x, y, 3);
    g.strokeStyle = "#111"; g.lineWidth = 3; g.lineCap = "round"; g.beginPath(); g.moveTo(x, y + h); g.bezierCurveTo(x + s * 4, y + 30, x + s * 18, y + 40, x + s * 20, y + 62); g.stroke(); bulb(g, x + s * 20, y + 74, 12);
    disc(g, x, y, h * 1.7 * k, BLACK); ring(g, x, y, h * 1.25 * k, h * 1.25 * k, "rgba(255,255,255,0.2)", 1.5); glint(g, x, y, h * 1.7 * k);
  },
  FarmNipSound(g, x, y) {
    rim(g, x, y, 1); for (let k = 0; k < 4; k++) sphere(g, x, y - 3 - k * 6, 3.2, ...SILVER);
    ring(g, x, y - 34, 8, 8, "#9aa0aa", 2.5); g.strokeStyle = "#fff"; g.lineWidth = 1; g.beginPath(); g.arc(x, y - 34, 8, 3.6, 4.6); g.stroke();
  },
};
const doc = () => (typeof document !== "undefined" ? document : null);
const cnv = (w, h) => { const c = doc().createElement("canvas"); c.width = w; c.height = h; return c; };
// the picture the game asks for: both nipples, at this breast size, in this state
export function picture(id, size, st) {
  const c = cnv(200, 200), g = c.getContext("2d"), k = SCALE[size] || 0.5;
  NIPS[size].forEach(([x, y], i) => { g.save(); g.translate(x, y); g.scale(k, k); DRAW[id](g, 0, 0, i ? 1 : -1, st || 0); g.restore(); });
  return c;
}
// the wardrobe's preview: one, big
export function preview(id) {
  const c = cnv(250, 250), g = c.getContext("2d");
  g.save(); g.translate(115, 95); g.scale(2.6, 2.6); DRAW[id](g, 0, 0, 1, id === "FarmNipBeadsXL" ? 1 : id.includes("Pump") ? 2 : 0); g.restore();
  return c;
}
// every file: [path, canvas]
export function allFiles() {
  const out = [];
  for (const T of TOYS) {
    const sts = T.states ? STATES[T.states] : [null];
    for (const size of SIZES) sts.forEach((st, i) => out.push(["ItemNipples/" + T.id + "_" + size + (st ? "_" + st : "") + "_Toy.png", picture(T.id, size, st ? i : 0)]));
    out.push(["ItemNipples/Preview/" + T.id + ".png", preview(T.id)]);
  }
  return out;
}
