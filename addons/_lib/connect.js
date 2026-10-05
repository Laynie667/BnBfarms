/* WHAT'S IN THIS FILE (addons/_lib/connect.js)
   How an add-on script finds the farm bot on the page. The bot opens window.Farmhand once it has
   started; an add-on that loads first waits for the "farmhand:ready" signal.
*/
const W = (typeof unsafeWindow !== "undefined" && unsafeWindow) ? unsafeWindow : window;

export function connect(def) {
  let done = false;
  const go = () => {
    if (done || !W.Farmhand || !W.Farmhand.register) return;
    done = true;
    try { W.Farmhand.register(def); }
    catch (e) { console.warn("[Farmhand add-on " + def.name + "] couldn't plug in:", e); }
  };
  if (W.Farmhand && W.Farmhand.register) go();
  else {
    W.addEventListener("farmhand:ready", go);
    // belt and braces: check every second for a minute in case the signal was missed, then every 10 seconds
    // for as long as it takes (a bot that starts late, after a slow page load, still gets every add-on)
    let n = 0; const t = setInterval(() => { go(); if (done || ++n > 60) clearInterval(t); }, 1000);
    const slow = setInterval(() => { go(); if (done) clearInterval(slow); }, 10000);
  }
}

// pick one at random
export const pick = (list) => list[Math.floor(Math.random() * list.length)];
// a whole number between lo and hi
export const between = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
// %name% → their name
export const fill = (text, vars) => String(text).replace(/%(\w+)%/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
