/* WHAT'S IN THIS FILE (warn.js)
   Warnings, a few at most (Nov 16). A drawing that goes wrong part way goes wrong on every layer of every drawing,
   dozens a second, and a console filling up that fast lags the game by itself (a player saw it pile up and it lagged).
   One of each kind a minute, and the next one says how many were skipped.
*/
const WARNED = new Map();   // what → { at, n }
export function warnSome(what, e) {
  const now = Date.now(), w = WARNED.get(what);
  if (w && now - w.at < 60000) { w.n++; return; }
  WARNED.set(what, { at: now, n: 0 });
  if (WARNED.size > 200) WARNED.clear();
  console.warn(what + (w && w.n ? " (" + w.n + " more like it in the last minute)" : ""), e);
}
