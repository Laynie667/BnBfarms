/* WHAT'S IN THIS FILE (shared/ink/live.js)
   THE LIVE INK (Laynie, Nov 17: "build it all"): the 28 designs from the tattoo sheets that print somethin' of the
   wearer's own. A count from the farm's books, a name, their number, a date, or their own words.
   • Each is an item in the ink slots like any other. Instead of a picture from the repo, every add-on that sees it draws
     it on the spot, from what's written on the item itself (its Property.FarmInk), so everybody sees the same numbers.
   • The drawing is the sheets' own (live-art.js), in the sheets' fonts where they're loaded, otherwise the nearest the
     game ships (GAME_FONT). Pictures are made at twice the size they show, like the rest of the ink.
   • What's written on an item: n (a count), t (a name or your words), num (a number), d and due (dates), list (names),
     rows ([name, count] pairs). Checked and trimmed before it's drawn: anything odd is just left out.
   • Nothing written yet: the wearer's own number for a number, their owner for a name, otherwise the sample.
   • The farm's counts are written on by the Companion as they change (ink.js, liveFill); a name or your words with /ink.
*/
import * as A from "./live-art.js";
const { INK, YEL, YEL2, GRN, PINKGLOW, CW, CH } = A;

// ── fonts: the sheets' own once loaded (loadSheetFonts), otherwise the nearest the game ships ──
export const GAME_FONT = {
  "Black Ops One": "'Saira Stencil One', 'Archivo Black', sans-serif",
  "Stardos Stencil": "'Saira Stencil One', sans-serif",
  "Rye": "'Archivo Black', serif",
  "Bungee": "'Archivo Black', sans-serif",
  "Shrikhand": "'Pacifico', cursive",
  "Pinyon Script": "'Satisfy', cursive",
  "Great Vibes": "'Satisfy', cursive",
  "Permanent Marker": "'Caveat-Bold', 'Caveat', cursive",
  "Press Start 2P": "'Courier New', monospace",
  "Special Elite": "'Courier New', monospace",
  "Sedgwick Ave Display": "'Calligraffitti', cursive",
  "UnifrakturMaguntia": "'Old English Text MT', serif",
};
const loadedFonts = new Set();
A.setFontOf((f) => (loadedFonts.has(f) ? "'" + f + "', " : "") + (GAME_FONT[f] || "'" + f + "', sans-serif"));
const fontCss = (size, f) => size + "px " + ((loadedFonts.has(f) ? "'" + f + "', " : "") + (GAME_FONT[f] || "sans-serif"));
// the sheets' own fonts, from a folder of them (when the repo carries them): { "Black Ops One": "BlackOpsOne.woff2", ... }
export async function loadSheetFonts(W, host, files) {
  if (!W.FontFace || !W.document || !W.document.fonts) return 0;
  let n = 0;
  for (const [fam, file] of Object.entries(files || {})) {
    try { const ff = new W.FontFace(fam, "url(" + host + file + ")"); await ff.load(); W.document.fonts.add(ff); loadedFonts.add(fam); n++; } catch (e) { /* the game's font, then */ }
  }
  if (n) cache.clear();
  return n;
}

// (the exporter's page has the sheets' fonts from its own stylesheet: it says so here)
export function fontsReady(list) { for (const f of list) loadedFonts.add(f); cache.clear(); }

// ── what's written on an item, checked ──
const num0 = (v, d, max) => { const x = Number(v); return v === "" || v == null || !Number.isFinite(x) ? d : Math.max(0, Math.min(max || 999999999, Math.round(x))); };
const txt0 = (v, d, max) => (typeof v === "string" && v.trim() ? v.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, max || 24) : d);
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const dateWord = (ms) => { const d = new Date(Number(ms)); return isNaN(d) ? "" : MONTHS[d.getMonth()] + " " + String(d.getDate()).padStart(2, "0"); };
export function cleanValues(v) {
  const o = {};
  if (!v || typeof v !== "object") return o;
  if (v.n != null) { const n = num0(v.n, null, 99999); if (n != null) o.n = n; }
  if (v.num != null) { const n = num0(v.num, null); if (n != null) o.num = n; }
  if (typeof v.t === "string") { const t = txt0(v.t, null, 28); if (t) o.t = t; }
  for (const k of ["d", "due"]) if (v[k] != null) { const n = num0(v[k], null, 4e12); if (n) o[k] = n; }
  if (Array.isArray(v.list)) { const l = v.list.map((x) => txt0(x, null, 16)).filter(Boolean).slice(0, 6); if (l.length) o.list = l; }
  if (v.more != null) { const n = num0(v.more, null, 9999); if (n) o.more = n; }
  if (Array.isArray(v.rows)) { const r = v.rows.filter((x) => Array.isArray(x)).map((x) => [txt0(x[0], null, 10), num0(x[1], 0, 999)]).filter((x) => x[0]).slice(0, 4); if (r.length) o.rows = r; }
  // how big (the ink panel): size a quarter to four times, width and height a half to twice, on any design
  const k = (x, lo, hi) => { const n = Number(x); return Number.isFinite(n) && n > 0 ? Math.round(Math.max(lo, Math.min(hi, n)) * 100) / 100 : null; };
  if (v.sz != null) { const n = k(v.sz, 0.25, 4); if (n && n !== 1) o.sz = n; }
  if (v.sw != null) { const n = k(v.sw, 0.5, 2); if (n && n !== 1) o.sw = n; }
  if (v.sh != null) { const n = k(v.sh, 0.5, 2); if (n && n !== 1) o.sh = n; }
  // the farm's own ink (Nov 18, ink.js farmInkSync): which of the farm's it is, when it went on, how long it heals and fades
  if (typeof v.farm === "string" && /^[\w:.-]{1,48}$/.test(v.farm)) o.farm = v.farm;
  for (const f of ["at", "heal", "fade"]) if (v[f] != null) { const n = num0(v[f], null, 4e12); if (n) o[f] = n; }
  if (v.keep) o.keep = 1;
  // a trophy (Nov 18): which one, so the Companion's Trophies row knows it's on
  if (typeof v.trophy === "string" && /^[a-z0-9-]{1,24}$/.test(v.trophy)) o.trophy = v.trophy;
  return o;
}

// ── the designs (the sheets' own drawing, with the wearer's details in) ──
const text = A.text;
const pct = (n) => Math.max(0, Math.min(100, n)) / 100;
// a count that keeps on: the first 25 as tally marks, and the number beside them past that
function tallyCount(g, x, y, n, h, w, font) { A.tally(g, x, y, Math.min(n, 25), h); }
// what each needs (fields), where it comes from on its own (auto: the farm's count it follows), the sample, and the drawing
export const LIVE = [
  { name: "LiveFarmProperty", title: "Farm Property (your number)", sheet: 1, where: "neck or hip", fields: ["num"], sample: { num: 123456 },
    draw: (g, w, h, V) => { g.lineWidth = 4; g.strokeRect(36, 46, w - 72, h - 92); text(g, "PROPERTY OF B&B FARM", w / 2, 84, "Stardos Stencil", 30, { max: w - 100 }); A.barcode(g, 70, 108, w - 140, 58, V.num || 7); text(g, "Nº " + V.num, w / 2, 186, "Black Ops One", 24); } },
  { name: "LiveUsedByStrangers", title: "Used By Strangers (keeps count)", sheet: 1, where: "inner thigh", fields: ["n"], auto: "used", sample: { n: 17 },
    draw: (g, w, h, V) => { text(g, "USED BY STRANGERS", w / 2, 62, "Permanent Marker", 32, { max: w - 30 }); tallyCount(g, 60, 108, V.n, 64); if (V.n > 25) text(g, String(V.n), w - 40, 212, "Permanent Marker", 30); } },
  { name: "LiveTimesBred", title: "Times Bred (keeps count)", sheet: 2, where: "inner thigh", fields: ["n"], auto: "loads", sample: { n: 23 },
    draw: (g, w, h, V) => { text(g, "BRED", w / 2, 56, "Black Ops One", 40); tallyCount(g, 54, 96, V.n, 62); text(g, String(V.n), w - 50, 200, "Black Ops One", 26); } },
  { name: "LiveLitters", title: "Litters (keeps count)", sheet: 2, where: "lower belly", fields: ["n"], auto: "litters", sample: { n: 7 },
    draw: (g, w, h, V) => { g.lineWidth = 4; g.beginPath(); g.roundRect(70, 50, w - 140, h - 100, 24); g.stroke(); text(g, "LITTERS", w / 2, 92, "Rye", 34); text(g, String(V.n), w / 2, 140, "Rye", 58, { max: w - 170 }); const k = Math.min(7, V.n); for (let i = 0; i < k; i++) { A.heart(g, w / 2 - (k - 1) * 15 + i * 30, 188, 7); g.fill(); } } },
  { name: "LiveLitresMilked", title: "Litres Milked (keeps count)", sheet: 2, where: "above a breast", fields: ["n"], auto: "milked", sample: { n: 412 },
    draw: (g, w, h, V) => { A.jug(g, 92, h / 2, 74); text(g, V.n + " L", 236, 112, "Bungee", 50, { max: 200 }); text(g, "MILKED", 236, 162, "Bungee", 26); } },
  { name: "LiveEggsLaid", title: "Eggs Laid (keeps count)", sheet: 2, where: "a hip", fields: ["n"], auto: "eggs", sample: { n: 96 },
    draw: (g, w, h, V) => { for (const [x, y] of [[70, 120], [100, 104], [96, 146], [128, 128], [66, 158]]) A.egg(g, x, y, 40); text(g, String(V.n), 250, 108, "Bungee", 62, { max: 190 }); text(g, "EGGS LAID", 250, 166, "Bungee", 24); } },
  { name: "LiveDaysDenied", title: "Days Since Last Orgasm (keeps count)", sheet: 2, where: "low belly", fields: ["n"], auto: "denied", sample: { n: 12 },
    draw: (g, w, h, V) => { g.fillStyle = "#1f6b3a"; g.fillRect(34, 40, w - 68, h - 80); g.fillStyle = "#fff"; text(g, "THIS SLUT HAS GONE", w / 2, 72, "Black Ops One", 18); g.fillRect(w / 2 - 44, 92, 88, 64); g.fillStyle = "#1f6b3a"; text(g, String(V.n), w / 2, 125, "Black Ops One", 48, { max: 80 }); g.fillStyle = "#fff"; text(g, V.n === 1 ? "DAY WITHOUT CUMMING" : "DAYS WITHOUT CUMMING", w / 2, 180, "Black Ops One", 18); } },
  { name: "LiveOwnedBy", title: "Owned By (a name)", sheet: 2, where: "a hip or above the heart", fields: ["t"], dflt: "owner", sample: { t: "Mistress" },
    draw: (g, w, h, V) => { text(g, "owned by", w / 2, 64, "Pinyon Script", 30); text(g, V.t, w / 2, 126, "Great Vibes", 72, { max: 300 }); g.lineWidth = 2.5; g.beginPath(); g.moveTo(80, 172); g.quadraticCurveTo(w / 2, 150, w - 80, 172); g.stroke(); A.padlock(g, w / 2, 200, 22); } },
  { name: "LiveStockNumber", title: "Stock Number (your number)", sheet: 2, where: "back of the neck", fields: ["num"], sample: { num: 123456 },
    draw: (g, w, h, V) => { g.save(); g.translate(w * 0.72, h / 2); g.rotate(-Math.PI / 2); A.barcode(g, -90, -45, 180, 90, V.num || 11); g.restore(); text(g, "STOCK", 112, 105, "Stardos Stencil", 30); text(g, "Nº " + V.num, 112, 145, "Stardos Stencil", 22, { max: 170 }); } },
  { name: "LiveLocked", title: "Locked (keyholder's name)", sheet: 2, where: "above the heart", fields: ["t"], dflt: "owner", sample: { t: "Mistress" },
    draw: (g, w, h, V) => { A.padlock(g, w / 2 - 50, h / 2, 70); A.key(g, w / 2 + 30, h / 2 + 10, 90); text(g, "keyholder: " + V.t, w / 2, h - 30, "Pinyon Script", 30, { max: w - 20 }); } },
  { name: "LiveBredByBB", title: "Bred By B&B", sheet: 3, where: "lower belly", fields: [], sample: {}, logo: true,
    draw: (g, w, h) => { A.arcText(g, "BRED BY", w / 2, 50, 200, "Shrikhand", 40); A.logo(g, "letters", w / 2, 138, 96); text(g, "★ PREMIUM STOCK ★", w / 2, 216, "Rye", 20); } },
  { name: "LiveEarTag", title: "B&B Ear Tag (your number)", sheet: 3, where: "a hip", fields: ["num"], sample: { num: 123456 }, logo: true,
    draw: (g, w, h, V) => { g.fillStyle = "#e3b021"; A.earTag(g, w / 2, 22, 210, 206); g.fill("nonzero"); g.strokeStyle = INK; g.lineWidth = 4; A.earTag(g, w / 2, 22, 210, 206); g.stroke(); A.cut(g, () => { g.beginPath(); g.arc(w / 2, 46, 11, 0, Math.PI * 2); g.fill(); }); g.fillStyle = INK; A.logo(g, "letters", w / 2, 128, 64); text(g, String(V.num), w / 2, 192, "Black Ops One", 34, { max: 180 }); } },
  { name: "LiveCumTank", title: "Cum Tank (how full you are)", sheet: 4, where: "the belly", fields: ["n"], auto: "tank", sample: { n: 90 },
    draw: (g, w, h, V) => { const cx = w / 2, cy = 152, R = 104; g.lineCap = "butt"; g.lineWidth = 7; g.beginPath(); g.arc(cx, cy, R, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
      for (let i = 0; i <= 8; i++) { const a = Math.PI * (1.1 + 0.8 * i / 8), big = i % 4 === 0, r0 = big ? R - 26 : R - 15; g.lineWidth = big ? 6 : 3.5; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * (R - 3), cy + Math.sin(a) * (R - 3)); g.stroke(); }
      for (const [t, f] of [["E", 1.1], ["½", 1.5], ["F", 1.9]]) { const a = Math.PI * f; text(g, t, cx + Math.cos(a) * (R - 46), cy + Math.sin(a) * (R - 46), "Black Ops One", 24); }
      const a = Math.PI * (1.1 + 0.8 * pct(V.n)); g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * (R - 24), cy + Math.sin(a) * (R - 24)); g.stroke(); g.beginPath(); g.arc(cx, cy, 11, 0, Math.PI * 2); g.fill();
      text(g, "CUM TANK", cx, cy + 46, "Black Ops One", 30); A.drop(g, cx - 106, cy + 44, 12); A.drop(g, cx + 106, cy + 44, 12); } },
  { name: "LiveBreedingFacts", title: "Breeding Facts (keeps count)", sheet: 4, where: "the small of the back", fields: ["n"], auto: "loads", sample: { n: 23 },
    draw: (g, w, h, V) => { const x0 = 94, y0 = 12, W = 192, H = 226; g.lineWidth = 3; g.strokeRect(x0, y0, W, H);
      const L = (t, size, bold, yy, right) => { g.font = (bold ? "900 " : "") + size + "px Arial"; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText(t, x0 + 8, yy); if (right != null) { g.textAlign = "right"; g.fillText(right, x0 + W - 8, yy); } };
      L("Breeding Facts", 21, true, y0 + 21); g.fillRect(x0 + 6, y0 + 37, W - 12, 1.5);
      L("Serving size", 12, false, y0 + 49, "1 load"); L("Servings per day", 12, false, y0 + 64, "as many as fit");
      g.fillRect(x0 + 6, y0 + 75, W - 12, 8); L("Amount per serving", 11, true, y0 + 93); L("Loads taken", 21, true, y0 + 113, String(V.n)); g.fillRect(x0 + 6, y0 + 126, W - 12, 4);
      [["Cum", "100%"], ["Seed that took", "100%"], ["Holes open", "3"], ["Dignity", "0%"]].forEach(([a, b], i) => { L(a, 12, i < 2, y0 + 142 + i * 17, b); g.fillRect(x0 + 6, y0 + 151 + i * 17, W - 12, 1); });
      L("* bred fresh at B&B Farm", 10, false, y0 + 214); } },
  { name: "LiveLoading", title: "Loading (how far along you are)", sheet: 4, where: "the belly", fields: ["n"], auto: "loading", sample: { n: 80 },
    draw: (g, w, h, V) => { text(g, "LOADING...", w / 2, 62, "Press Start 2P", 22); g.lineWidth = 5; g.strokeRect(46, 96, 288, 50); const k = Math.round(8 * pct(V.n)); for (let i = 0; i < k; i++) g.fillRect(56 + i * 34.5, 106, 28, 30); text(g, "BREEDING " + Math.min(100, V.n) + "%", w / 2, 178, "Press Start 2P", 15); text(g, "please do not unplug", w / 2, 210, "Press Start 2P", 9); } },
  { name: "LiveLipstickKisses", title: "Lipstick Kisses (signed)", sheet: 4, where: "a butt cheek", fields: ["t"], sample: { t: "Mistress" },
    draw: (g, w, h, V) => { g.fillStyle = "#c41e3a"; A.lips(g, 108, 84, 46, -0.32); A.lips(g, 268, 74, 40, 0.28); A.lips(g, 196, 150, 44, 0.06); text(g, "kissed by " + V.t, w / 2, 218, "Great Vibes", 36, { max: w - 20 }); } },
  { name: "LiveWouldBreedAgain", title: "★★★★★ Would Breed Again (signed)", sheet: 4, where: "a thigh", fields: ["t"], sample: { t: "Big Red" },
    draw: (g, w, h, V) => { g.lineWidth = 3; g.beginPath(); g.roundRect(34, 32, 312, 182, 16); g.stroke(); g.fillStyle = "#d9a400"; for (let i = 0; i < 5; i++) { A.star(g, w / 2 - 96 + i * 48, 80, 20); g.fill(); } g.lineWidth = 2; g.strokeStyle = INK; for (let i = 0; i < 5; i++) { A.star(g, w / 2 - 96 + i * 48, 80, 20); g.stroke(); }
      g.fillStyle = INK; text(g, "“would breed again”", w / 2, 138, "Great Vibes", 40); g.font = "13px Arial"; g.textAlign = "center"; g.fillText(V.t + ", verified owner ✓", w / 2, 186); } },
  { name: "LiveGuestbook", title: "Bred By (a guestbook)", sheet: 5, where: "an inner thigh", fields: ["list", "more"], auto: "studs", sample: { list: ["Big Red", "the Bull", "Goblin #3", "Stud 7"], more: 19 },
    draw: (g, w, h, V) => { text(g, "Bred by:", 72, 30, "Pinyon Script", 32, { align: "left" });
      const F = [["Great Vibes", 36], ["Permanent Marker", 24], ["Rye", 24], ["Special Elite", 22]];
      (V.list || []).slice(0, 4).forEach((n, i) => { const y = 72 + i * 38; text(g, n, 90, y, F[i][0], F[i][1], { align: "left", max: 220 }); g.fillRect(70, y + 15, 240, 1.4); });
      if (V.more) text(g, "+ " + V.more + " more", 310, 232, "Pinyon Script", 22, { align: "right" }); } },
  { name: "LiveBreedingCard", title: "Breeding Card (a punch a load)", sheet: 5, where: "a butt cheek", fields: ["n"], auto: "punches", sample: { n: 7 },
    draw: (g, w, h, V) => { const cx = w / 2; g.lineWidth = 3; g.beginPath(); g.roundRect(36, 26, 308, 198, 14); g.stroke();
      text(g, "B&B BREEDING CARD", cx, 54, "Black Ops One", 22); text(g, "every tenth load's on the house", cx, 80, "Special Elite", 15);
      const k = Math.min(10, V.n);
      for (let i = 0; i < 10; i++) { const x = 96 + (i % 5) * 47, y = 126 + Math.floor(i / 5) * 54; g.lineWidth = 2.5; g.beginPath(); g.arc(x, y, 18, 0, Math.PI * 2); g.stroke(); if (i < k) { A.heart(g, x, y + 4, 12); g.fill(); } else if (i === 9) text(g, "FREE", x, y, "Black Ops One", 12); } } },
  { name: "LiveTrapPassport", title: "Trap Passport (a stamp a trap)", sheet: 5, where: "a shoulder blade", fields: ["list"], auto: "passport", sample: { list: ["B&B FARM", "THE BARN", "B&B FARM", "THE FIELD"] },
    draw: (g, w, h, V) => { const L = (V.list || []).map((x) => String(x).toUpperCase());
      if (L[0]) { g.fillStyle = "#5b2a86"; g.strokeStyle = "#5b2a86"; g.lineWidth = 4; g.beginPath(); g.arc(104, 92, 62, 0, Math.PI * 2); g.stroke(); g.lineWidth = 2; g.beginPath(); g.arc(104, 92, 40, 0, Math.PI * 2); g.stroke(); A.arcText(g, L[0], 104, 41, 51, "Black Ops One", 15); A.arcTextLow(g, "SURVIVED", 104, 143, 51, "Black Ops One", 14); text(g, "B&B", 104, 92, "Black Ops One", 15); }
      if (L[1]) { g.fillStyle = "#b3122e"; g.strokeStyle = "#b3122e"; g.save(); g.translate(276, 74); g.rotate(0.14); g.lineWidth = 4; g.strokeRect(-82, -40, 164, 80); text(g, L[1], 0, -12, "Black Ops One", 24, { max: 150 }); text(g, "ENTERED · TAKEN", 0, 18, "Black Ops One", 13); g.restore(); }
      if (L[2]) { g.fillStyle = "#1d3f8f"; g.strokeStyle = "#1d3f8f"; g.save(); g.translate(176, 196); g.rotate(-0.08); g.lineWidth = 4; g.beginPath(); g.ellipse(0, 0, 84, 40, 0, 0, Math.PI * 2); g.stroke(); text(g, L[2], 0, -10, "Black Ops One", 22, { max: 140 }); text(g, "WENT IN, CAME OUT", 0, 16, "Black Ops One", 13); g.restore(); }
      if (L[3]) { g.fillStyle = GRN; g.strokeStyle = GRN; g.save(); g.translate(318, 182); g.rotate(-0.2); g.lineWidth = 3.5; g.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; g.lineTo(Math.cos(a) * 46, Math.sin(a) * 46); } g.closePath(); g.stroke(); text(g, L[3], 0, -8, "Black Ops One", 15, { max: 76 }); text(g, "USED", 0, 12, "Black Ops One", 14); g.restore(); }
      A.speckle(g, 17, 1600, w, h); } },
  { name: "LiveHighScores", title: "High Scores (who's bred you most)", sheet: 5, where: "a thigh", fields: ["rows"], auto: "scores", sample: { rows: [["BIG RED", 23], ["THE BULL", 17], ["GOBLIN", 12], ["STUD 7", 9]] },
    draw: (g, w, h, V) => { text(g, "HIGH SCORES", w / 2, 36, "Press Start 2P", 19);
      g.font = fontCss(9, "Press Start 2P"); g.textBaseline = "middle"; g.textAlign = "left"; g.fillText("RANK", 44, 70); g.fillText("NAME", 112, 70); g.textAlign = "right"; g.fillText("LOADS", 336, 70);
      (V.rows || []).slice(0, 4).forEach(([b, c], i) => { const y = 100 + i * 28; g.font = fontCss(13, "Press Start 2P"); g.textAlign = "left"; g.fillText(["1ST", "2ND", "3RD", "4TH"][i], 44, y); g.fillText(String(b).toUpperCase().slice(0, 10), 112, y); g.textAlign = "right"; g.fillText(String(c).padStart(2, "0"), 336, y); });
      text(g, "PRESS START TO BREED", w / 2, 226, "Press Start 2P", 10); } },
  { name: "LiveTied", title: "Tied × (keeps count)", sheet: 5, where: "a hip", fields: ["n"], auto: "tied", sample: { n: 7 },
    draw: (g, w, h, V) => { A.flash(g, () => A.canine(g, 70, 150, 190, -0.42), "#d9577a", 4); g.fillStyle = INK; text(g, "×" + V.n, 296, 92, "Black Ops One", 64, { max: 150 }); A.banner(g, w / 2, 196, 180, 44, YEL, YEL2, "TIED", "Rye", 30); } },
  { name: "LiveBredOn", title: "Bred On (a date stamp)", sheet: 6, where: "a hip", fields: ["d", "due"], auto: "bredOn", sample: { d: Date.UTC(2026, 10, 17, 12), due: Date.UTC(2027, 7, 9, 12) }, style: "stamp", color: "#1d3f8f",
    draw: (g, w, h, V) => { const cx = w / 2; g.lineWidth = 5; g.strokeRect(70, 46, 240, 160); g.lineWidth = 2; g.beginPath(); g.moveTo(80, 124); g.lineTo(300, 124); g.stroke();
      text(g, "BRED ON", cx, 74, "Black Ops One", 26); text(g, dateWord(V.d), cx, 104, "Black Ops One", 30); text(g, "DUE", cx, 146, "Black Ops One", 20); text(g, V.due ? dateWord(V.due) : "SOON", cx, 178, "Black Ops One", 30); } },
  { name: "LiveHeatCrest", title: "Heat Crest (fills as your heat rises)", sheet: 7, where: "over the womb", fields: ["n"], auto: "heat", sample: { n: 66 }, style: "glow", color: PINKGLOW,
    draw: (g, w, h, V) => { const cx = w / 2, cy = 116, k = Math.round(12 * pct(V.n)); g.lineCap = "butt";
      for (let i = 0; i < 12; i++) { const a0 = -Math.PI / 2 + i / 12 * Math.PI * 2 + 0.04, a1 = a0 + Math.PI * 2 / 12 - 0.08; g.lineWidth = 14; g.beginPath(); g.arc(cx, cy, 84, a0, a1); if (i < k) g.stroke(); else { g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, 91, a0, a1); g.arc(cx, cy, 77, a1, a0, true); g.closePath(); g.stroke(); } }
      g.lineWidth = 5; A.heart(g, cx, cy + 22, 44); g.stroke(); g.lineWidth = 3; A.arrowDown(g, cx, cy + 34, 20, 3); } },
  { name: "LiveWordsBlackletter", title: "Your Words: Blackletter", sheet: 7, where: "anywhere", fields: ["t"], sample: { t: "Breeding Stock" },
    draw: (g, w, h, V) => text(g, V.t, w / 2, h / 2, "UnifrakturMaguntia", 58, { max: 330 }) },
  { name: "LiveWordsScript", title: "Your Words: Script", sheet: 7, where: "anywhere", fields: ["t"], sample: { t: "Good Girl" },
    draw: (g, w, h, V) => text(g, V.t, w / 2, h / 2, "Great Vibes", 92, { max: 330 }) },
  { name: "LiveWordsTypewriter", title: "Your Words: Typewriter", sheet: 7, where: "anywhere", fields: ["t"], sample: { t: "used goods" },
    draw: (g, w, h, V) => { text(g, V.t, w / 2, h / 2, "Special Elite", 48, { max: 300 }); g.lineWidth = 2; g.strokeRect(34, h / 2 - 36, w - 68, 72); } },
  { name: "LiveWordsGraffiti", title: "Your Words: Graffiti", sheet: 7, where: "anywhere", fields: ["t"], sample: { t: "cum dump" }, color: "#1d3f8f",
    draw: (g, w, h, V) => { g.fillStyle = "#1d3f8f"; g.strokeStyle = "#1d3f8f"; text(g, V.t, w / 2, h / 2, "Sedgwick Ave Display", 84, { max: 330 }); A.dripFrom(g, w, h, 40, 340, 5, 6); } },
];
export const LIVE_BY = Object.fromEntries(LIVE.map((d) => [d.name, d]));
export const isLive = (name) => !!LIVE_BY[name];

// what a design draws with: what's written on the item, else the wearer's own (number, owner), else the sample
export function valuesFor(d, written, who) {
  const V = Object.assign({}, d.sample, cleanValues(written));
  if (d.fields.includes("num") && !(written && written.num != null) && who && who.num) V.num = who.num;
  if (d.dflt === "owner" && !(written && written.t) && who && who.owner) V.t = who.owner;
  if (V.n == null) V.n = 0;
  delete V.sz; delete V.sw; delete V.sh;   // (how big is the drawing's business, not the picture's)
  return V;
}

// ── turning a drawing into the game's layered pictures (the exporter does the same: export.js on the sheets) ──
// THE GAME'S TINT (GLDraw, "full alpha"): a layer's colour times its brightness, where mid-grey is the colour exactly and
// white is twice as bright. So every layer is mid-grey where its ink is (the picked colour comes out as picked), lighter or
// darker where the drawing was, so shading stays (Nov 18: the white ones made every colour come out too pale).
export const MID = "#808080";
let doc = null;
const mk = (w, h) => { const c = doc.createElement("canvas"); c.width = w || CW; c.height = h || CH; return c; };
export const useDoc = (W) => { doc = W.document; };
export function tinted(src, col, blur, dx, dy, alpha) {
  const c = mk(src.width, src.height), g = c.getContext("2d"); try { g.filter = blur ? "blur(" + blur + "px)" : "none"; } catch (e) { /* (no blur on this browser) */ }
  g.globalAlpha = alpha == null ? 1 : alpha; g.drawImage(src, dx || 0, dy || 0);
  try { g.filter = "none"; } catch (e) { /* fine */ } g.globalAlpha = 1; g.globalCompositeOperation = "source-in"; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height); return c;
}
export function speckled(src, seed) {
  const c = tinted(src, MID), g = c.getContext("2d"), r = A.rng(seed), w = c.width, h = c.height; g.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 1400; i++) { g.globalAlpha = 0.3 + r() * 0.7; g.beginPath(); g.arc(r() * w, r() * h, 0.5 + r() * 1.8, 0, Math.PI * 2); g.fill(); }
  for (let i = 0; i < 5; i++) { g.globalAlpha = 0.18 + r() * 0.2; g.fillRect(0, r() * h, w, 6 + r() * 16); } return c;
}
// RECOLOURABLE (Laynie, Nov 18: "the tattoos need to be recolorable"): a design in several colours is split into one layer
// per colour, each tinted by the game's colour picker on its own. paletteOf finds the colours (light first, dark last, so
// outlines go on top); splitColours makes a layer for each, mid-grey with the drawing's own shading.
const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
export function paletteOf(c, faint) {
  const w = c.width, h = c.height, d = c.getContext("2d").getImageData(0, 0, w, h).data, P = [];
  let solid = 0;
  for (let i = 0; i < d.length; i += 8) {
    if (d[i + 3] < (faint ? 30 : 220)) continue;
    solid++; const r = d[i], g = d[i + 1], b = d[i + 2];
    let best = null, bd = 1e12;
    for (const p of P) { const e = (p.r - r) ** 2 + (p.g - g) ** 2 + (p.b - b) ** 2; if (e < bd) { bd = e; best = p; } }
    if (best && bd < 3600) { best.n++; best.sr += r; best.sg += g; best.sb += b; best.r = best.sr / best.n; best.g = best.sg / best.n; best.b = best.sb / best.n; }
    else P.push({ r, g, b, n: 1, sr: r, sg: g, sb: b });
  }
  P.sort((a, b) => b.n - a.n);
  const keep = P.filter((p) => p.n >= Math.max(1, solid * 0.025)).slice(0, 5);
  if (!keep.length && P.length) keep.push(P[0]);
  if (!keep.length) return faint ? [[22, 18, 28]] : paletteOf(c, true);   // (nothin' solid: a faint design, all soft edges)
  // one layer per colour family: two golds, two inks, a white and its shadow are one colour each, the difference kept as
  // shading (splitColours), so the colour picker shows a handful of real choices, not near-twins
  const fam = [];
  for (const p of keep) {
    const n = colourName([p.r, p.g, p.b]), f = fam.find((x) => x.name === n);
    if (f) { const t = f.n + p.n; f.r = (f.r * f.n + p.r * p.n) / t; f.g = (f.g * f.n + p.g * p.n) / t; f.b = (f.b * f.n + p.b * p.n) / t; f.n = t; }
    else fam.push({ name: n, r: p.r, g: p.g, b: p.b, n: p.n });
  }
  return fam.map((p) => [Math.round(p.r), Math.round(p.g), Math.round(p.b)]).sort((a, b) => lum(...b) - lum(...a));
}
export function splitColours(c, pal) {
  if (!pal || !pal.length) pal = [[22, 18, 28]];
  const w = c.width, h = c.height, src = c.getContext("2d").getImageData(0, 0, w, h).data;
  const outs = pal.map(() => { const o = mk(w, h), g = o.getContext("2d"); return { o, g, img: g.createImageData(w, h) }; });
  const L = pal.map((p) => lum(...p));
  for (let i = 0; i < src.length; i += 4) {
    const a = src[i + 3]; if (!a) continue;
    const r = src[i], g = src[i + 1], b = src[i + 2];
    let k = 0, bd = 1e12;
    for (let j = 0; j < pal.length; j++) { const p = pal[j], e = (p[0] - r) ** 2 + (p[1] - g) ** 2 + (p[2] - b) ** 2; if (e < bd) { bd = e; k = j; } }
    // the shading inside a colour: as bright, relative to its colour, as it was drawn (flat for near-black ink)
    const v = L[k] < 40 ? 128 : Math.max(0, Math.min(255, Math.round(128 * lum(r, g, b) / L[k])));
    const D = outs[k].img.data; D[i] = D[i + 1] = D[i + 2] = v; D[i + 3] = a;
  }
  return outs.map((x) => { x.g.putImageData(x.img, 0, 0); return x.o; });
}
// what to call a colour's layer in the colour picker
export function colourName(rgb) {
  const [r, g, b] = rgb, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = lum(r, g, b), s = mx ? (mx - mn) / mx : 0;
  if (s < 0.18) return l < 70 ? "Ink" : l > 200 ? "White" : "Grey";
  let hue = 0; const dd = mx - mn;
  if (mx === r) hue = ((g - b) / dd) % 6; else if (mx === g) hue = (b - r) / dd + 2; else hue = (r - g) / dd + 4;
  hue = (hue * 60 + 360) % 360;
  if (l < 60) return "Ink";
  if (hue >= 15 && hue < 50 && l < 120) return "Brown";
  if (hue < 15 || hue >= 345) return "Red";
  if (hue < 40) return "Orange";
  if (hue < 52) return "Gold";
  if (hue < 70) return "Yellow";
  if (hue < 165) return "Green";
  if (hue < 200) return "Teal";
  if (hue < 255) return "Blue";
  if (hue < 290) return "Purple";
  return "Pink";
}
// the layers for a palette: their names (unique) and colours, light first
export function layersFor(pal, pre) {
  const used = {};
  return pal.map((p) => {
    let n = pal.length === 1 ? "Ink" : colourName(p);
    used[n] = (used[n] || 0) + 1; if (used[n] > 1) n += used[n];
    return { name: (pre || "") + n, color: "#" + p.map((v) => v.toString(16).padStart(2, "0")).join(""), colorize: true };
  });
}
// a design's layers, made from its drawing, by the names the exporter gave them (ink-designs.json: m.layers, m.pal)
export function layersOf(base, m) {
  const out = {}, L = m.layers || [];
  if (L.some((l) => l.name === "Stamp")) { out.Stamp = speckled(base, 3); return out; }
  if (L.some((l) => l.name === "Glow")) { out.Glow = tinted(base, MID, 9, 0, 0, 0.95); out.GlowInk = tinted(base, MID, 0.4); return out; }
  const pal = m.pal && m.pal.length ? m.pal : [[22, 18, 28]];
  const parts = splitColours(base, pal), names = layersFor(pal).map((l) => l.name);
  names.forEach((n, i) => { out[n] = parts[i]; });
  return out;
}
export function drawCard(W, d, V) {
  doc = W.document;
  const c = mk(), g = c.getContext("2d"); g.fillStyle = INK; g.strokeStyle = INK;
  d.draw(g, CW, CH, V);
  return c;
}
// crop to the box the exporter measured (with room for longer names), and come down to size in halves
function shrink(c, box, s) {
  const [x0, y0, x1, y1] = box; let src = mk(x1 - x0, y1 - y0); src.getContext("2d").drawImage(c, -x0, -y0);
  let w = src.width, h = src.height; const tw = Math.max(1, Math.round(w * s)), th = Math.max(1, Math.round(h * s));
  while (w / 2 > tw) { const n = mk(Math.round(w / 2), Math.round(h / 2)), g = n.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(src, 0, 0, n.width, n.height); src = n; w = n.width; h = n.height; }
  const out = mk(tw, th), g = out.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(src, 0, 0, tw, th); return out;
}

// ── the pictures, made once for each design, layer and set of details, and kept a while ──
const cache = new Map();   // key → data URL
const CACHE_MAX = 80;
export const cacheSize = () => cache.size;
// m: this design's line in ink-designs.json (box, s, layers, pal) · V: valuesFor(...). Every layer of it is made at once
// and kept together: { layerName: data URL }.
export function picture(W, d, m, layer, V) {
  const key = d.name + "|" + JSON.stringify(V);
  let set = cache.get(key);
  if (set) { cache.delete(key); cache.set(key, set); return set[layer] || null; }   // (most recently used last)
  if (d.logo && !(A.IMG.letters)) return null;                // the logo's still on its way: next time
  const base = drawCard(W, d, V), parts = layersOf(base, m);
  set = {};
  for (const [n, c] of Object.entries(parts)) set[n] = shrink(c, m.box, m.s).toDataURL("image/png");
  cache.set(key, set);
  while (cache.size > CACHE_MAX) { const old = cache.keys().next().value, os = cache.get(old); cache.delete(old); for (const u of Object.values(os)) forget(W, u); }
  return set[layer] || null;
}
// a picture we no longer use, out of the game's own lists (and the drawing card's memory), like the drawn body's
function forget(W, url) {
  try { const m = W.GLDrawImageCache; if (m && typeof m.delete === "function") m.delete(url); } catch (e) { /* fine */ }
  try { const m = W.DrawImageCache; if (m && typeof m.delete === "function") m.delete(url); } catch (e) { /* fine */ }
  try { const gl = W.GLDrawCanvas && W.GLDrawCanvas.GL, tc = gl && gl.textureCache, t = tc && tc.get(url); if (t) { if (t.texture) gl.deleteTexture(t.texture); tc.delete(url); } } catch (e) { /* fine */ }
}
let logoAsked = null;
export function loadLiveArt() { if (!logoAsked) logoAsked = A.loadLogo().catch(() => null); return logoAsked; }
