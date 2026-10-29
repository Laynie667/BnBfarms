/* WHAT'S IN THIS FILE (bcr.js)
   BCR ("Bondage Club Ring", gitlab.com/mrhappy-bcr/bcr: welts, bruises and scars that stay) on the drawn breasts
   (Laynie, Oct 29: "support for this one... so the marks from it show up on our titties IF it is possible").
   BCR paints its marks as a coat over the skin and cuts it to the game's own chest picture. Our drawn breasts go on
   after the skin, over the game's chest, so its breast marks ended up underneath them. Here, when the drawn body lays
   the breasts down, BCR is asked to paint just its Breasts zone onto a spare canvas (its own functions, the way its own
   painter does), and that's stretched from where the game's chest is to where ours are and kept to our breasts' shape.
   Only when BCR is there and has marks on that chest; anything missin' or changed in BCR and it quietly does nothin'.
*/
const W = window;
let warned = false;
const kept = new Map();   // member → { key, res }: the same marks on the same breasts give back the very same canvas (no new picture, no redraw loop)
// a canvas to lay over the drawn breasts (bc at bx, by), or null
export function bcrOverBreast(C, bc, bx, by) {
  try {
    if (typeof W.BodyMarksZonesOf !== "function" || typeof W.BodyMarksDrawZone !== "function" || typeof W.BodyMarksZoneBox !== "function") return null;
    // eslint-disable-next-line no-undef
    const ZONES = typeof BodyMarksZones !== "undefined" ? BodyMarksZones : null;   // (a const of BCR's: reachable by name, not on window)
    if (!ZONES || !ZONES.Breasts || !C || C.MemberNumber == null) return null;
    const zones = W.BodyMarksZonesOf(C), state = zones && zones.Breasts;
    if (!state) return null;
    // eslint-disable-next-line no-undef
    const measured = typeof BodyMarksMeasured !== "undefined" && BodyMarksMeasured.get ? BodyMarksMeasured.get(C.MemberNumber) : undefined;
    const def = ZONES.Breasts, box = W.BodyMarksZoneBox(C, def, measured);
    if (!box || box.Hidden) return null;
    const size = typeof W.BodyMarksSizeOf === "function" ? W.BodyMarksSizeOf(C, def) || 1 : 1;
    const key = JSON.stringify(state) + "|" + bc.width + "x" + bc.height + "|" + Math.round(bx) + "," + Math.round(by) + "|" + Math.round(box.Top) + "|" + size;
    const was = kept.get(C.MemberNumber); if (was && was.key === key) return was.res;
    const H = (typeof CanvasDrawHeight !== "undefined" ? CanvasDrawHeight : 0) || (C.Canvas && C.Canvas.height) || 1700;   // eslint-disable-line no-undef
    // BCR paints into whatever MainCanvas is, the way its own painter does
    const raw = W.document.createElement("canvas"); raw.width = 500; raw.height = H;
    // eslint-disable-next-line no-undef
    const prev = MainCanvas; MainCanvas = raw.getContext("2d");   // eslint-disable-line no-global-assign
    try { W.BodyMarksDrawZone(C, "Breasts", state); } finally { MainCanvas = prev; }   // eslint-disable-line no-global-assign
    // where the game's chest is (BCR's own box for it) → where our breasts are
    const sx = 250 + (box.X || 0) - 130 * size, sw = 260 * size, sy = box.Top - box.Height * 0.35, sh = box.Height * 1.9;
    const out = W.document.createElement("canvas"); out.width = bc.width; out.height = bc.height;
    const g = out.getContext("2d");
    g.drawImage(raw, sx, sy, sw, sh, 0, bc.height * 0.08, bc.width, bc.height * 0.84);
    g.globalCompositeOperation = "destination-in"; g.drawImage(bc, 0, 0);   // only on the breasts
    g.globalCompositeOperation = "source-over";
    // anything there at all?
    const d = g.getImageData(0, 0, out.width, out.height).data; let any = false;
    for (let i = 3; i < d.length; i += 16) if (d[i]) { any = true; break; }
    const res = any ? { cv: out, x: bx, y: by } : null;
    kept.set(C.MemberNumber, { key, res }); if (kept.size > 40) kept.delete(kept.keys().next().value);
    return res;
  } catch (e) {
    if (!warned) { warned = true; console.warn("[Farmhand Companion] BCR marks on the drawn breasts:", e); }
    return null;
  }
}
