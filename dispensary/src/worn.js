/* WHAT'S IN THIS FILE (worn.js)
   EVERY WAY TO DOSE (docs/DISPENSARY.md step 7; Laynie, Nov 18: "keep going with everything for the dispensary").
   Crafted gear that doses whoever wears it, doses that go off when somethin' happens, and the other ways in:
   • WORN GEAR: a crafted item you're wearin' (anywhere: a gag, a collar, a plug, piercings, a harness) whose name or
     description has a dose's words AND says how:
       drip, IV, laced, coated, soaked     keeps that dose in you while it's on (topped up to 10 minutes; it wears off
                                           soon after it comes off)
       injector, auto-inject, dosing       one dose every 30 minutes while it's on ("every 10 minutes" sets its own)
   • TRIGGERS: gear that says "on climax", "when kissed", "when touched" or "when spanked" gives its dose each time that
     happens (at most every two minutes).
   • ROULETTE: "roulette" or "mystery dose" on anything (a needle, a drink, gear) is a different dose each time, picked
     from the ones you allow.
   • DRINKS AND FOOD: somebody makes you sip or eat from a crafted cup, bottle or treat in their hand (the game's Sip and
     Eat): its words are the dose, the same as a needle.
   • LIP GLOSS: somebody wearin' crafted gear that says "lip gloss" or "lipstick" with a dose's words doses whoever they
     kiss.
   Who's dosin' you is whoever crafted it (the game keeps their number on the item): they have to be on your list, the
   same as a needle in their hand. Your own crafts always count. LSCG's own soaked and laced gear stays LSCG's (it
   doses on every breath, and ours already ride on it). On the farm, a farm shot on worn gear is the farm girl's, as ever.
   The safeword, the Purge, or a keyholder lettin' you out clears what's in you and stops your gear for 15 minutes.
*/
import { st, save } from "./store.js";
import { BOOK, doseIds, dosesIn, give, active, leftMs, stackOf, farmHas } from "./doses.js";
import { allowed } from "./ladder.js";
import { lscgPresent } from "./lscg.js";
import { craftText, botHere } from "./needle.js";
import { isLater, queue } from "./later.js";
import { LINES } from "./lines.js";
import { local, action, fill, pick, nameOf, inRoom } from "./say.js";
import { NOTES } from "./lines.js";
import { loosen } from "../../shared/dose-words.js";

const W = window, MIN = 60000;
export const DRIP_MINS = 10, INJECT_EVERY = 30, TRIGGER_GAP = 2 * MIN, PAUSE_MINS = 15;
// (Nov 19) every one of these reads however it's spelled between its words: "auto-injector", "when-kissed",
// "mystery_dose", "LipGloss" (shared/dose-words.js loosen)
export const DRIP_WORDS = loosen(/\b(drip\w*|iv|i\.v\.|laced|coated|soaked|infused|seeping)\b/);
export const INJECT_WORDS = loosen(/\b(injector|auto[- ]?inject\w*|dosing|dispenser|pump)\b/);
const EVERY = loosen(/\bevery\s+(\d{1,3})\s*(?:min|minutes?)\b/);
export const TRIGGERS = { climax: loosen(/\b(on|when|whenever|every)\s+(?:she |he |they |you )?(climax\w*|cum\w*|orgasm\w*)\b/), kissed: loosen(/\bwhen\s+kiss\w*\b/),
  touched: loosen(/\bwhen\s+(touch\w*|groped|caressed|fondled)\b/), spanked: loosen(/\bwhen\s+(spank\w*|slapped|paddled)\b/) };
export const ROULETTE_WORDS = loosen(/\b(roulette|mystery (?:dose|shot|serum|drink)|surprise (?:dose|shot))\b/);
export const GLOSS_WORDS = loosen(/\b(lip ?gloss|lip ?stick|lip balm|lip stain)\b/);
// (Nov 19) on the nipples, these alone are the Nipple Dilator: "Dilator Clamps", "Stretcher Clamps", "dilating rings".
// Laynie: "the nipple clamps for the nipple dilation doesn't seem to work?". The page always said "says dilator or
// stretcher", but the words wanted "nipple dilator" in full.
// (no closing \b, so run-together names count too: "DilatorClamps", "SpreaderRings"; "stretchy" still isn't one)
export const NIP_DILATE = /\b(dilat(?:or|ing|ion|e|es|ed)|stretch(?:er|ing)|spreader|opener|gaper|widener)/;
// LSCG's own soaked and laced gear (LSCG 0.9.9) reads "soaked" or "laced" with its keywords: that's LSCG's to dose
const LSCG_SOAKED = /\b(soaked|laced)\b/;

// the doses a piece of gear (or a drink) carries, roulette made real: [{ id, x, p }]
export function dosesOf(text) {
  const t = String(text || "").toLowerCase();
  const list = dosesIn(t);
  if (ROULETTE_WORDS.test(t)) {
    const S = st(), ok = doseIds().filter((id) => { const B = BOOK[id]; return !B.instant && !S.off[id] && !B.lscgOnly && !(B.lscg && lscgPresent()); });
    if (ok.length) return [{ id: ok[Math.floor(Math.random() * ok.length)], x: list[0] ? list[0].x : 1, roulette: true }];
  }
  return list;
}
// the hole a piece of gear sits in (where its seed goes, when it doesn't say)
const holeOfGear = (item) => { const g = String((item && item.Asset && item.Asset.Group && item.Asset.Group.Name) || ""); return g === "ItemVulva" ? "vulva" : g === "ItemButt" ? "butt" : /^ItemMouth/.test(g) ? "mouth" : /^ItemNipples/.test(g) || g === "ItemBreast" ? "nips" : ""; };
const crafterOf = (item) => { const n = item && item.Craft && Number(item.Craft.MemberNumber); return Number.isInteger(n) && n > 0 ? n : 0; };
const me = () => (W.Player && W.Player.MemberNumber) || 0;
const okFrom = (by) => !by || by === me() || allowed(by);   // (no maker on it: it's yours)
const keyOf = (item) => (item.Asset && item.Asset.Group ? item.Asset.Group.Name : "?") + ":" + ((item.Craft && item.Craft.Name) || "");
// a dose this gear may give here: not the farm girl's, not LSCG's own, not switched off
function ours(id, p) { const B = BOOK[id]; return !!B && !(farmHas(id, p) && botHere()) && !(B.lscg && lscgPresent()) && !B.lscgOnly && !st().off[id]; }

// the gear you're wearin' that doses, read fresh each time
export function wornGear() {
  const P = W.Player, out = [];
  if (!P || !Array.isArray(P.Appearance)) return out;
  for (const item of P.Appearance) {
    if (!item || !item.Craft) continue;
    const text = craftText(item); if (!text) continue;
    const list = dosesOf(text).filter((d) => ours(d.id, d.p));
    // (Nov 18) crafted nipple gear that says dilator or stretcher: the Nipple Dilator stays in you while it's worn
    const onNips = /^ItemNipples/.test(String(item.Asset && item.Asset.Group && item.Asset.Group.Name));
    if (onNips && NIP_DILATE.test(text) && !list.some((d) => d.id === "dilator") && ours("dilator")) list.push({ id: "dilator", x: stackOf(text) });
    const roulette = ROULETTE_WORDS.test(text);
    if (!list.length && !roulette) continue;
    const trig = Object.keys(TRIGGERS).filter((k) => TRIGGERS[k].test(text));
    const nipGear = onNips && list.some((d) => d.id === "dilator");
    const drip0 = nipGear || (DRIP_WORDS.test(text) && !(lscgPresent() && LSCG_SOAKED.test(text) && !/\bdrip|\biv\b/.test(text)));
    // (Nov 19) a dose that's done at once (seed, growth, a balm) can't be kept topped up: on drip gear it's given like an
    // injector's, every half hour, not every few seconds
    const once = list.length > 0 && list.every((d) => BOOK[d.id] && BOOK[d.id].instant);
    const drip = drip0 && !once, inject = INJECT_WORDS.test(text) || (drip0 && once);
    if (!drip && !inject && !trig.length) continue;   // (a dose's words on a worn thing that doesn't say how: nothin')
    const every = EVERY.exec(text);
    out.push({ item, key: keyOf(item), text, list, by: crafterOf(item), nm: item.Craft && item.Craft.MemberName ? String(item.Craft.MemberName) : "", hole: holeOfGear(item), drip, inject, trig, roulette,
      every: Math.max(5, Math.min(240, every ? Number(every[1]) : INJECT_EVERY)), gloss: GLOSS_WORDS.test(text) });
  }
  return out;
}

const told = {};   // gear key → when you were told it's from somebody not on your list (once an hour)
function notAllowed(g) { if (Date.now() - (told[g.key] || 0) < 3600000) return; told[g.key] = Date.now(); local(fill(NOTES.notListed, { by: nameOf(g.by) || "#" + g.by, dose: itemName(g.item) })); }
const itemName = (it) => (it && it.Craft && it.Craft.Name) || (it && it.Asset && (it.Asset.Description || it.Asset.Name)) || "gear";
const paused = () => (st().wornPause || 0) > Date.now();

// every few seconds: drips keep their dose in you, injectors give theirs on time
const lastShot = {};   // gear key → when its injector last gave a dose
export function wornTick() {
  if (paused()) return;
  const now = Date.now();
  for (const g of wornGear()) {
    if (!okFrom(g.by)) { notAllowed(g); continue; }
    if (g.drip) for (const d of g.list) {
      if (BOOK[d.id] && BOOK[d.id].instant) continue;
      const was = active(d.id);
      if (was && leftMs(d.id) > (DRIP_MINS - 2) * MIN) continue;   // (topped up every couple of minutes, not every tick)
      const r = give(d.id, { by: g.by, x: d.x, p: d.p, mins: DRIP_MINS, upto: true, quiet: was, line: was ? undefined : fill(pick(LINES.worn.drip), { dose: BOOK[d.id].label }).replace(/%g/g, itemName(g.item)) });
      if (!r.ok && r.why === "off") continue;
    }
    if (g.inject) {
      const last = lastShot[g.key] || 0;
      if (!last) { lastShot[g.key] = now; continue; }   // (put on just now: its first dose comes after the wait)
      if (now - last < g.every * MIN) continue;
      lastShot[g.key] = now;
      const list = g.roulette ? dosesOf(g.text).filter((d) => ours(d.id)) : g.list;
      for (const d of list) {
        if (isLater(g.text)) queue(d.id, { by: g.by, x: d.x, p: d.p });
        else give(d.id, { by: g.by, x: d.x, p: d.p, line: fill(pick(LINES.worn.inject), { dose: BOOK[d.id].label }).replace(/%g/g, itemName(g.item)), via: "gear", g: itemName(g.item), nm: g.nm, hole: g.hole });
      }
    }
  }
  // gear that came off: its injector clock goes with it
  const on = new Set(wornGear().map((g) => g.key));
  for (const k of Object.keys(lastShot)) if (!on.has(k)) delete lastShot[k];
}

// somethin' happened to you: every piece of gear that answers to it gives its dose
const lastTrig = {};
export function trigger(kind, from) {
  if (paused()) return 0;
  let n = 0;
  for (const g of wornGear()) {
    if (!g.trig.includes(kind)) continue;
    if (!okFrom(g.by)) { notAllowed(g); continue; }
    const k = g.key + "|" + kind;
    if (Date.now() - (lastTrig[k] || 0) < TRIGGER_GAP) continue;
    lastTrig[k] = Date.now();
    const list = g.roulette ? dosesOf(g.text).filter((d) => ours(d.id)) : g.list;
    for (const d of list) { const r = give(d.id, { by: g.by, x: d.x, p: d.p, line: fill(pick(LINES.worn[kind] || LINES.worn.inject), { dose: BOOK[d.id].label, by: from ? nameOf(from) : "somebody" }).replace(/%g/g, itemName(g.item)), via: "gear", g: itemName(g.item), nm: g.nm, hole: g.hole }); if (r.ok) n++; }
  }
  return n;
}

// LIP GLOSS: whoever kissed you is wearin' some, crafted with a dose in it
const glossAt = {};
export function kissedBy(mn) {
  const C = (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn);
  if (!C || !Array.isArray(C.Appearance) || paused()) return 0;
  let n = 0;
  for (const item of C.Appearance) {
    if (!item || !item.Craft) continue;
    const text = craftText(item); if (!GLOSS_WORDS.test(text)) continue;
    const by = crafterOf(item) || mn;
    if (!allowed(by) && !allowed(mn)) { local(fill(NOTES.notListed, { by: nameOf(mn), dose: itemName(item) })); continue; }
    const k = mn + ":" + keyOf(item); if (Date.now() - (glossAt[k] || 0) < TRIGGER_GAP) continue; glossAt[k] = Date.now();
    for (const d of dosesOf(text).filter((x) => ours(x.id))) { const r = give(d.id, { by: mn, x: d.x, p: d.p, line: fill(pick(LINES.worn.gloss), { dose: BOOK[d.id].label, by: nameOf(mn) }), sire: by, nm: item.Craft.MemberName ? String(item.Craft.MemberName) : "", via: "kiss" }); if (r.ok) n++; }
  }
  return n;
}

const KISS = /^(Kiss|FrenchKiss|PoliteKiss|GaggedKiss|SiblingsCheekKiss|GagKiss)$/;
const TOUCH = /^(Caress|Grope|Pinch|Tickle|Rub|MassageHands|Pet|Cuddle|RubItem|TickleItem|SqueezeItem|RollItem|BrushItem|Lick|Nibble|Suck)$/;
const SPANK = /^(Spank|Slap|SpankItem)$/;
// an activity done to you (needle.js reads them all and hands each one here)
export function onActivity(name, from) {
  if (!name || from === me()) return;
  if (KISS.test(name)) { trigger("kissed", from); kissedBy(from); }
  else if (SPANK.test(name)) { trigger("spanked", from); trigger("touched", from); }
  else if (TOUCH.test(name)) trigger("touched", from);
}

export function initWorn(mod) {
  // on climax: the game's own orgasm (a ruined one counts: it still happened)
  try {
    mod.hookFunction("ActivityOrgasmStart", 4, (args, next) => {
      try { const C = args[0]; if (C && typeof C.IsPlayer === "function" && C.IsPlayer()) setTimeout(() => trigger("climax"), 500); } catch (e) { /* fine */ }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] gear can't feel you cum:", e); }
}
// for the tests
export function wornReset() { for (const o of [lastShot, lastTrig, glossAt, told]) for (const k of Object.keys(o)) delete o[k]; }
