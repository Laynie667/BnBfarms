/* WHAT'S IN THIS FILE (later.js)
   DOSES THAT WAIT, AND DOSES YOU WANT MORE OF (Laynie, Nov 17: "I love it").
   • Time-release capsules: a needle whose words also say time-release (slow-release, delayed, a capsule) doesn't hit
     now. It goes off later, 5 to 40 minutes on, at a moment nobody knows, on your clock (online time, or real time
     with the penalty). It waits for you to be in a room, so the room sees it go off. Up to five can be waitin' at once.
     The safeword, the Purge and a keyholder lettin' you out clear what's waitin' too.
   • Tolerance (yours to switch on, doses.js): the same dose again within three hours takes less.
   • Cravings (yours to switch on): once you've had six doses in three days, now and then, while nothin's in you, you
     want another (a note only you see). With the farm girl in the room she notices, and offers: ?fix, and she sees to
     it with the dose you've had most of.
*/
import { st, save } from "./store.js";
import { LINES } from "./lines.js";
import { BOOK, give, doseIds, active } from "./doses.js";
import { lscgPresent } from "./lscg.js";
import { local, action, fill, pick, inRoom } from "./say.js";

const MIN = 60000, DAY = 86400000;
export const LATER_WORDS = /\b(time[- ]?release\w*|slow[- ]?release\w*|delayed|capsules?)\b/;
export const isLater = (text) => LATER_WORDS.test(String(text || "").toLowerCase());
export const LATER_MAX = 5;
export const FUSE_MINS = [5, 40];
export const CRAVE_AFTER = 6;            // doses in...
export const CRAVE_DAYS = 3;             // ...this many days
export const CRAVE_EVERY = [20, 40];     // minutes between the wantin'

// a capsule: give it later. o: { by, x, p }
export function queue(id, o) {
  o = o || {};
  const S = st();
  if (!BOOK[id] || BOOK[id].instant || S.off[id]) return false;
  if (S.later.length >= LATER_MAX) return false;
  const fuse = (FUSE_MINS[0] + Math.random() * (FUSE_MINS[1] - FUSE_MINS[0])) * MIN;
  const c = { id, x: Math.max(1, Math.min(5, Math.round(Number(o.x) || 1))), by: Number(o.by) || 0 };
  if (o.p) c.p = String(o.p);
  if (S.clock === "real") c.fire = Date.now() + fuse * (1 + S.penalty / 100); else c.in = fuse;
  S.later.push(c);
  save();
  if (!o.quiet) action(fill(pick(LINES.later.set)));
  return true;
}
export const waiting = () => st().later.length;

// every few seconds: count the capsules down (online: only time you're here), and set off any that are due
let lastAt = 0, craveNext = 0;
export function laterTick() {
  const S = st(), now = Date.now(), gap = lastAt ? Math.max(0, Math.min(now - lastAt, 15000)) : 0;
  lastAt = now;
  let changed = false;
  for (const c of S.later) if (typeof c.fire !== "number") { c.in = Math.max(0, (c.in || 0) - gap); }
  if (inRoom()) {
    const due = S.later.filter((c) => (typeof c.fire === "number" ? c.fire <= now : c.in <= 0));
    for (const c of due) {
      S.later.splice(S.later.indexOf(c), 1); changed = true;
      action(fill(pick(LINES.later.fire)));
      give(c.id, { by: c.by, x: c.x, p: c.p, later: true });
    }
  }
  if (changed) save();
  craveTick(now);
}

// ── cravings ──
// the doses you've had since you switched cravings on, in the last few days
function since() {
  const S = st(), from = Math.max(S.cravings || 0, Date.now() - CRAVE_DAYS * DAY), out = {};
  for (const [id, list] of Object.entries(S.taken || {})) { const n = list.filter((t) => t >= from).length; if (n) out[id] = n; }
  return out;
}
// can this dose be given again by us (not LSCG's own while LSCG's here, not switched off, not the Purge)
const ours = (id) => { const B = BOOK[id]; return !!B && !B.instant && !st().off[id] && !(B.lscg && lscgPresent()) && !B.lscgOnly; };
// the dose you want most, or "" (cravings off, not enough doses yet, or somethin's in you already)
export function craving() {
  const S = st();
  if (!S.cravings) return "";
  const n = since(), total = Object.values(n).reduce((a, b) => a + b, 0);
  if (total < CRAVE_AFTER || doseIds().some(active)) return "";
  const fav = Object.keys(n).filter(ours).sort((a, b) => n[b] - n[a])[0];
  return fav || "";
}
function craveTick(now) {
  const want = craving();
  if (!want) { craveNext = 0; return; }
  if (!craveNext) { craveNext = now + (CRAVE_EVERY[0] / 2) * MIN; return; }
  if (now < craveNext || !inRoom()) return;
  craveNext = now + (CRAVE_EVERY[0] + Math.random() * (CRAVE_EVERY[1] - CRAVE_EVERY[0])) * MIN;
  local(fill(pick(LINES.crave.want), { dose: BOOK[want].label }));
}
// for the tests: the next wantin' now
export function craveSoon() { craveNext = 1; }
