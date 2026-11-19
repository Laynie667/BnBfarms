/* WHAT'S IN THIS FILE (needle.js)
   A NEEDLE IN SOMEBODY'S HAND. When somebody uses the Inject activity on you, your Dispensary reads the crafted item in
   their hand, the same way the farm girl does: its name and description. The words on it are the dose.
   Who gets to stand down:
   - On the farm, with the farm girl in the room, a farm shot is hers: she reads it, keeps the books, and calls on your
     Dispensary to do the rest (farm.js). We don't give it twice.
   - LSCG's own drugs are LSCG's (lscg.js).
   - A dose we've put in LSCG's list: LSCG catches it if you've switched it on there. If it hasn't come through LSCG
     a moment later, we give it ourselves.
   - A needle that also says time-release (slow-release, delayed, a capsule) doesn't hit now: it goes off later
     (later.js), whichever of us caught it.
*/
import { BOT } from "./config.js";
import { BOOK, dosesIn, give, farmHas } from "./doses.js";
import { allowed } from "./ladder.js";
import { lscgPresent, lscgHas, lastLscgDose } from "./lscg.js";
import { local, fill, nameOf } from "./say.js";
import { NOTES } from "./lines.js";
import { isLater, queue } from "./later.js";
import { dosesOf, onActivity } from "./worn.js";
import { paraKissGiven } from "./parasites.js";
import { st as st0 } from "./store.js";

const W = window;
export const botHere = () => (W.ChatRoomCharacter || []).some((c) => c && c.MemberNumber === BOT);
const charOf = (mn) => (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn) || (W.Player && W.Player.MemberNumber === mn ? W.Player : null);

export function craftText(item) {
  if (!item || !item.Craft) return "";
  let d = item.Craft.Description || "";
  try { if (W.CraftingDescription && typeof W.CraftingDescription.Decode === "function") d = W.CraftingDescription.Decode(d); } catch (e) { /* as it is */ }
  return ((item.Craft.Name || "") + " | " + d).toLowerCase().replace(/_+/g, " ");   // (Nov 19: "iv_drip" reads as "iv drip")
}
const handOf = (C) => (C && Array.isArray(C.Appearance) ? C.Appearance.find((it) => it && it.Asset && it.Asset.Group && it.Asset.Group.Name === "ItemHandheld") : null);
// the words on whatever somebody in the room has in their hand ("" if nothin' crafted)
export const handTextOf = (mn) => craftText(handOf(charOf(mn)));

// the activity's own facts, the game's way (falls back to the dictionary for an older game)
function factsOf(data, sender) {
  try { if (typeof W.ChatRoomMessageRunExtractors === "function") { const m = W.ChatRoomMessageRunExtractors(data, sender).metadata; if (m) return { name: m.ActivityName, target: m.TargetMemberNumber }; } } catch (e) { /* below */ }
  const dict = Array.isArray(data.Dictionary) ? data.Dictionary : [];
  const name = (dict.find((d) => d && d.ActivityName) || {}).ActivityName;
  const t = dict.find((d) => d && (typeof d.TargetCharacter === "number" || d.Tag === "TargetCharacter"));
  return { name, target: t ? (typeof t.TargetCharacter === "number" ? t.TargetCharacter : t.MemberNumber) : undefined };
}

export const LSCG_WAIT_MS = 1500;
// a needle went into you: what's on it, and what you let through
export function onNeedle(by, item) {
  const text = craftText(item), list = dosesOf(text), at = Date.now(), done = [], later = isLater(text);   // (dosesOf: a roulette is a dose of its own)
  for (const { id, x, p } of list) {
    const B = BOOK[id];
    if (farmHas(id, p) && botHere()) continue;     // the farm girl's (farm.js)
    if (B.lscg && lscgPresent()) continue;          // LSCG's own
    if (!allowed(by)) { local(fill(NOTES.notListed, { by: nameOf(by), dose: B.label })); continue; }
    const go = () => {
      if (later && !B.instant) { if (st0().off[id]) { local(fill(NOTES.switchedOff, { dose: B.label })); return { ok: false, why: "off" }; } return { ok: queue(id, { by, x, p }), later: true }; }
      const r = give(id, { by, x, p });
      if (!r.ok && r.why === "off") local(fill(NOTES.switchedOff, { dose: B.label }));
      return r;
    };
    if (lscgHas(id)) setTimeout(() => { if (lastLscgDose(id) < at) go(); }, LSCG_WAIT_MS);   // LSCG first, then us
    else { go(); done.push(id); }
  }
  return done;
}

export function initNeedle(mod) {
  try {
    mod.hookFunction("ChatRoomMessage", 1, (args, next) => {
      try {
        const data = args[0], P = W.Player;
        if (data && data.Type === "Activity" && P && typeof data.Sender === "number") {
          const sender = charOf(data.Sender) || (data.Sender === P.MemberNumber ? P : null), f = factsOf(data, sender);
          // a needle, or a drink or a treat fed to you from somebody's hand (Nov 18): the words on it are the dose
          if (/^(Inject|SipItem|EatItem)$/.test(f.name || "") && f.target === P.MemberNumber && sender) onNeedle(data.Sender, handOf(sender));
          // anything done to you: gear that answers to a kiss, a touch or a spank, and lip gloss (worn.js)
          if (f.target === P.MemberNumber && data.Sender !== P.MemberNumber) onActivity(f.name, data.Sender);
          // a kiss YOU gave: parasites spread (parasites.js)
          if (data.Sender === P.MemberNumber && typeof f.target === "number" && f.target !== P.MemberNumber && /^(Kiss|FrenchKiss|PoliteKiss|GaggedKiss|SiblingsCheekKiss)$/.test(f.name || "")) paraKissGiven(f.target);
        }
      } catch (e) { console.warn("[Dispensary] needle:", e); }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] can't feel needles:", e); }
}
