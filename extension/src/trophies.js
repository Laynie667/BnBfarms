/* WHAT'S IN THIS FILE (trophies.js)
   TROPHIES (Nov 18, Laynie: trophies "should be offered, and if its a permanent trophy, have a way to equip or take it
   off at any time"). The farm girl sends what you've earned (panel state: trophies, bot 10uq3-trophies.js). Each new one
   is offered once at the top of your panel's Me tab (Wear it / No thanks, views/livestock.js), with a line in chat, and
   every one is kept in the 🏆 Trophies row to put on or take off whenever you like: they're all yours for good.
   Wearin' one is shared/ink/ink.js trophyWear: a free Farm Ink slot (or one you pick), keepin' the farm's count.
   What's been offered is remembered on this computer. Only ones earned in the last week are offered on a new computer;
   the rest are just there in the row.
*/
const W = window;
const WEEK = 7 * 86400000;
const key = () => "farm-trophies-" + ((W.Player && W.Player.MemberNumber) || 0);
function seen() { try { return JSON.parse(W.localStorage.getItem(key())) || {}; } catch (e) { return {}; } }
function keep(o) { try { W.localStorage.setItem(key(), JSON.stringify(o)); } catch (e) { /* fine */ } }
const clean = (list) => (Array.isArray(list) ? list.filter((t) => t && typeof t.id === "string" && typeof t.design === "string" && typeof t.title === "string") : []);
const offerable = (t, now) => !(Number(t.at) > 0) || now - Number(t.at) < WEEK;
// new ones since last time: the line to say in chat (once each), or null
export function trophyNews(list) {
  const s = seen(), now = Date.now(), fresh = clean(list).filter((t) => !s[t.id] && offerable(t, now));
  for (const t of clean(list)) if (!s[t.id] && !offerable(t, now)) s[t.id] = "done";   // (old ones: in the row, not offered)
  if (!fresh.length) { keep(s); return null; }
  for (const t of fresh) s[t.id] = "told";
  keep(s);
  return fresh.length === 1 ? "🏆 You've earned a trophy: " + fresh[0].title + ", for " + fresh[0].why + ". Wear it or No thanks, in your 🌾 panel."
    : "🏆 You've earned " + fresh.length + " trophies: " + fresh.map((t) => t.title).join(", ") + ". Wear them or No thanks, in your 🌾 panel.";
}
// the next one waitin' for Wear it or No thanks
export function trophyNext(list) { const s = seen(), now = Date.now(); return clean(list).find((t) => s[t.id] !== "done" && offerable(t, now)) || null; }
export function trophyAnswered(id) { const s = seen(); s[String(id)] = "done"; keep(s); }
const ink = () => (W.__farmInk && typeof W.__farmInk.trophyWear === "function" ? W.__farmInk : null);
export function trophyWear(t, slot) {
  const I = ink(); if (!I) return { ok: false, why: "the ink slots haven't loaded yet (reload the page if it stays like this)" };
  try { return I.trophyWear(t, slot); } catch (e) { return { ok: false, why: e.message }; }
}
export function trophyOff(id) {
  const I = ink(); if (!I) return { ok: false, why: "the ink slots haven't loaded yet" };
  try { return I.trophyOff(id); } catch (e) { return { ok: false, why: e.message }; }
}
export function trophyWorn() { const I = ink(); try { return I ? I.trophyWorn() : {}; } catch (e) { return {}; } }
