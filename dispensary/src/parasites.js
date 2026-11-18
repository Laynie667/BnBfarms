/* WHAT'S IN THIS FILE (parasites.js)
   CRAFTED PARASITES, ANYWHERE (Laynie, Nov 17-18: crafted parasites with the crafter's DNA, the leash vine, the
   mouthpiece, the brood mother; then "keep going with everything for the dispensary").
   Each kind is yours to switch on, on the Dispensary's page: all are off till you do. A kind you've left off never takes.
   • HOW ONE GETS ON: somebody crafts an item (a gag, a plug, a collar, a harness, anything) that names it, and it's put
     on you. The crafter has to be on your list, like a needle. On the farm the farm's own parasites are the farm girl's
     (its books, its lines), and these work alongside them.
       a parasite / parasite lips   it latches on for 12 hours (the item can come off; it stays), feeds you its
                                    crafter's strain every half hour, leaves you cravin' a load, and spreads by a kiss
       livin' latex                 it drinks every climax and stays as long as it's fed (up to a day). Fed, everything
                                    feels more (Hair Trigger); starved six hours, it leaves
       milk moss                    it wants your milk: it keeps you leakin' (Let-Down) and feeds on every let-down
       the nestling                 curled low in your belly, it grows a stage every time you cum, and your belly fills
                                    out with it (Fill-Out, belly)
       the brood mother             now and then she lays a tiny one; kiss somebody who's switched parasites on and it
                                    goes to them, your strain and all
       the leash vine               while it's worn you can't step more than a few tiles from whoever crafted it (on a
                                    map). It never stops you leavin' a room
       the mouthpiece               while it's worn its crafter can put words in your mouth: you see them first and
                                    choose to say them, or let that crafter's words straight through (your switch)
       nipple leeches (Nov 18)      they hold your nipples open for a day (nipples.js: the real Fuck nipple and Finger
                                    nipple actions), wider once fed three times. Every time somethin' goes in, they
                                    feed and pass you their strain; starved eight hours, they drop off. Somebody who
                                    suckles you can pick them up (Laynie, Nov 17: "parasite that makes nipples fuckable
                                    as a real action")
   • THE STRAIN: the doses named on the item are what a parasite feeds you (its crafter's DNA). None named: the farm's
     own brew, Needy Nectar, Heat and Hair Trigger in turn.
   • The SAFEWORD takes any parasite off at once (in hardcore it's your keyholders who let you out), and the Purge does.
   Messages (shared/protocol.js), only ever acted on if you've switched that kind on and the sender's on your list:
     them → you   dispPara { kind, strain, by, name }    a kiss from somebody carryin' one
     crafter → you   dispSay { text }                     the mouthpiece: say this for me
     you → crafter   dispSaid { ok }                      said, or not
*/
import { makeMsg, readMsg } from "../../shared/protocol.js";
import { st, save } from "./store.js";
import { BOOK, doseIds, dosesIn, give, active } from "./doses.js";
import { allowed } from "./ladder.js";
import { craftText } from "./needle.js";
import { lscgPresent } from "./lscg.js";
import { LINES } from "./lines.js";
import { local, action, fill, pick, nameOf, inRoom, myName } from "./say.js";

const W = window, MIN = 60000, HOUR = 3600000;
export const KINDS = {
  lips: { label: "Parasite lips", icon: "👄", words: /\bparasit\w*|\bparasite lips\b/, hours: 12, every: 30 },
  latex: { label: "Livin' latex", icon: "🖤", words: /\bliv(?:ing|in'?) latex\b|\bliving rubber\b|\blatex symbiote\b/, hours: 24, starve: 6 },
  moss: { label: "Milk moss", icon: "🌱", words: /\bmilk moss\b/, hours: 24, every: 40 },
  nestling: { label: "The nestling", icon: "🐛", words: /\bnestling\b/, hours: 24, stages: 3 },
  brood: { label: "The brood mother", icon: "🥚", words: /\bbrood ?mother\b|\bbrood queen\b/, hours: 24, every: 45 },
  vine: { label: "The leash vine", icon: "🌿", words: /\bleash vine\b|\bvine leash\b/, worn: true, tiles: 3 },
  mouth: { label: "The mouthpiece", icon: "🗣️", words: /\bmouthpiece\b/, worn: true },
  nips: { label: "Nipple leeches", icon: "🍒", words: /\b(?:nipple|teat)[- ]?(?:leech|parasit|worm|tick)\w*|\bleech\w* (?:on|for) (?:the |your |her |his |their )?(?:nipples?|teats?)\b/, hours: 24, starve: 8 },
};
export const kindIds = () => Object.keys(KINDS);
const DEFAULT_STRAIN = ["needy", "heat", "hairtrigger"];
const me = () => (W.Player && W.Player.MemberNumber) || 0;
const charOf = (mn) => (W.ChatRoomCharacter || []).find((c) => c && c.MemberNumber === mn);
const send = (type, data, to) => { try { if (typeof W.ServerSend === "function") W.ServerSend("ChatRoomChat", makeMsg(type, data, to)); return true; } catch (e) { return false; } };
const on = (kind) => !!(st().parasites && st().parasites[kind]);
const usable = (id) => { const B = BOOK[id]; return !!B && !B.instant && !B.lscgOnly && !(B.lscg && lscgPresent()) && !st().off[id]; };
function strainOf(text) {
  const ids = dosesIn(text).map((d) => d.id).filter((id) => usable(id));
  return ids.length ? ids.slice(0, 4) : DEFAULT_STRAIN.filter(usable);
}
// what's in you: { kind: { by, name, since, until, strain, fed, stage, n, eggs } }
export const mine = () => st().para || (st().para = {});
const line = (kind, which, v) => { const L = LINES.para && LINES.para[kind] && LINES.para[kind][which]; return L && L.length ? fill(pick(L), v).replace(/%k/g, KINDS[kind].label.toLowerCase()) : ""; };

// one gets on you (from worn gear, or a kiss)
export function latch(kind, o) {
  const K = KINDS[kind]; if (!K || !on(kind)) return false;
  if (o.by && o.by !== me() && !allowed(o.by)) return false;
  const P = mine(); if (P[kind]) return false;
  const now = Date.now();
  P[kind] = { by: o.by || 0, name: String(o.name || "").slice(0, 30), since: now, until: K.worn ? 0 : now + K.hours * HOUR, strain: (o.strain || DEFAULT_STRAIN).filter((id) => BOOK[id]).slice(0, 4), fed: now, stage: 0, n: 0, eggs: 0, next: now + (K.every || 30) * MIN };
  save();
  action(line(kind, "latch", { by: P[kind].name || "somebody" }));
  return true;
}
export function letGo(kind, why) {
  const P = mine(); if (!P[kind]) return false;
  delete P[kind]; save();
  if (why !== "quiet") { const l = line(kind, why === "starved" ? "starved" : "off"); if (l) local(l); }
  return true;
}
export function clearParasites(why) { let n = 0; for (const k of Object.keys(mine())) if (letGo(k, why)) n++; return n; }

// the parasites in what you're wearin' (the vine and the mouthpiece live only while they're worn)
export function wornParasites() {
  const P = W.Player, out = [];
  if (!P || !Array.isArray(P.Appearance)) return out;
  for (const item of P.Appearance) {
    if (!item || !item.Craft) continue;
    const text = craftText(item);
    // (the lips answer to any "parasite": not when the item names a kind of its own, like nipple leeches)
    const kinds = kindIds().filter((kind) => KINDS[kind].words.test(text)), own = kinds.filter((k) => k !== "lips");
    for (const kind of own.length ? own : kinds) out.push({ kind, item, text, by: Number(item.Craft.MemberNumber) || 0, name: String(item.Craft.MemberName || "") });
  }
  return out;
}

// every few seconds
export function paraTick() {
  const now = Date.now(), P = mine(), worn = wornParasites();
  // gear with a parasite in it: it latches (if that kind's on and the crafter's on your list)
  if ((st().wornPause || 0) <= now) for (const w of worn) if (!P[w.kind] && on(w.kind)) latch(w.kind, { by: w.by, name: w.name, strain: strainOf(w.text) });
  if (P.moss && active("letdown")) P.moss.fed = now;   // (the moss feeds on your let-down)
  // the worn-only ones go when their gear does
  for (const kind of ["vine", "mouth"]) if (P[kind] && !worn.some((w) => w.kind === kind)) letGo(kind, "off");
  for (const [kind, p] of Object.entries(P)) {
    const K = KINDS[kind]; if (!K) { delete P[kind]; continue; }
    if (p.until && now > p.until) { letGo(kind, "done"); continue; }
    if (K.starve && now - p.fed > K.starve * HOUR) { letGo(kind, "starved"); continue; }
    if (!K.every || now < p.next) continue;
    p.next = now + K.every * MIN;
    if (!inRoom()) continue;
    if (kind === "lips") { const id = p.strain[p.n++ % Math.max(1, p.strain.length)] || "needy"; give(id, { by: p.by, line: fill(line("lips", "feed"), { dose: (BOOK[id] || {}).label || id }) }); local(line("lips", "crave")); }
    if (kind === "moss") give("letdown", { by: p.by, line: line("moss", "feed") });
    if (kind === "brood") { p.eggs = Math.min(5, (p.eggs || 0) + 1); local(fill(line("brood", "lay"), {}).replace(/%n/g, String(p.eggs))); }
    save();
  }
}

// a climax: the latex drinks, the nestling grows
export function paraClimax() {
  const P = mine(), now = Date.now();
  if (P.latex) { P.latex.fed = now; P.latex.until = Math.min(P.latex.since + 72 * HOUR, Math.max(P.latex.until, now + KINDS.latex.hours * HOUR)); give("hairtrigger", { by: P.latex.by, mins: 30, upto: true, quiet: active("hairtrigger"), line: line("latex", "feed") }); }
  if (P.nestling) { const n = P.nestling; n.fed = now; if (n.stage < KINDS.nestling.stages) { n.stage++; give("fillout", { by: n.by, p: "belly", x: n.stage, mins: 60, line: line("nestling", "grow").replace(/%n/g, String(n.stage)) }); } else give("fillout", { by: n.by, p: "belly", x: n.stage, mins: 60, upto: true, quiet: true }); }
  save();
}
// let-down (the moss feeds on it)
export function paraLetDown() { const P = mine(); if (P.moss) { P.moss.fed = Date.now(); save(); } }

// NIPPLE LEECHES: somethin' went in your nipple (nipples.js). They feed: a day more (three at most), wider after three,
// and their strain at most every ten minutes
export function nipsFed(from, kind) {
  const p = mine().nips; if (!p) return false;
  const now = Date.now();
  p.fed = now; p.n = (p.n || 0) + 1;
  p.until = Math.min(p.since + 72 * HOUR, Math.max(p.until || 0, now + KINDS.nips.hours * HOUR));
  if (now - (p.gave || 0) > 10 * MIN && inRoom()) {
    p.gave = now;
    const id = p.strain[(p.n - 1) % Math.max(1, p.strain.length)] || "needy";
    give(id, { by: p.by, line: fill(line("nips", "feed"), { dose: (BOOK[id] || {}).label || id }) });
  }
  if (p.n === 3) local(line("nips", "wider"));
  save();
  return true;
}
// somebody suckled you while they're on: the leeches can go across to them (once in ten minutes each)
const suckledAt = {};
export function paraSuckled(from) {
  const p = mine().nips; if (!p || !from || from === me() || Date.now() - (suckledAt[from] || 0) < 10 * MIN) return false;
  suckledAt[from] = Date.now();
  send("dispPara", { kind: "nips", strain: p.strain, by: p.by || me(), name: myName() }, from);
  return true;
}

// a kiss YOU gave: the parasite lips spread, and the brood mother's little ones go across
export function paraKissGiven(to) {
  const P = mine(); if (!to || to === me()) return;
  if (P.lips) send("dispPara", { kind: "lips", strain: P.lips.strain, by: P.lips.by || me(), name: myName() }, to);
  if (P.brood && P.brood.eggs > 0) { P.brood.eggs--; save(); send("dispPara", { kind: "lips", strain: P.brood.strain, by: me(), name: myName(), brood: true }, to); local(line("brood", "pass").replace(/%b/g, nameOf(to))); }
}
// a kiss somebody gave you, carryin' one (their Dispensary says so)
function onPara(from, m) {
  const kind = String(m.kind || ""); if (!KINDS[kind] || KINDS[kind].worn) return;
  if (!on(kind) || !allowed(from)) return;
  const strain = Array.isArray(m.strain) ? m.strain.filter((id) => typeof id === "string" && BOOK[id]) : DEFAULT_STRAIN;
  latch(kind, { by: from, name: nameOf(from), strain });
}

// THE LEASH VINE: no step more than a few tiles from whoever crafted it (only on a map, only while they're on it)
function vineOk(X, Y) {
  const p = mine().vine; if (!p) return true;
  const C = charOf(p.by), pos = C && C.MapData && C.MapData.Pos; if (!pos || typeof pos.X !== "number") return true;
  return Math.max(Math.abs(X - pos.X), Math.abs(Y - pos.Y)) <= KINDS.vine.tiles;
}
let vineTold = 0;

// THE MOUTHPIECE: its crafter's words, for you to say (or straight through, if you let them)
let asked = null;   // { from, text }
function onSay(from, m) {
  const p = mine().mouth; if (!p || p.by !== from) return;
  const text = String(m.text || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 300); if (!text || /^[\/(\[]/.test(text)) return;
  if (st().mouthAuto === true) { say(text); send("dispSaid", { ok: true }, from); return; }
  asked = { from, text };
  local("🗣️ " + nameOf(from) + "'s mouthpiece wants you to say: \"" + text + "\"\nSay it: /dispensary say · let it pass: /dispensary nope");
}
function say(text) { try { W.ServerSend("ChatRoomChat", { Content: text, Type: "Chat" }); } catch (e) { /* fine */ } }
export function sayAsked(yes) {
  if (!asked) return false;
  const a = asked; asked = null;
  if (yes) say(a.text);
  send("dispSaid", { ok: !!yes }, a.from);
  return true;
}
// for the crafter: /dispensary mouth <who> <words>
export function mouthSend(to, text) { return send("dispSay", { text: String(text).slice(0, 300) }, to); }

export function initParasites(mod) {
  // a climax: the latex drinks it, the nestling grows on it
  try { mod.hookFunction("ActivityOrgasmStart", 3, (args, next) => { try { const C = args[0]; if (C && typeof C.IsPlayer === "function" && C.IsPlayer()) setTimeout(() => paraClimax(), 600); } catch (e) { /* fine */ } return next(args); }); } catch (e) { /* fine */ }
  try {
    mod.hookFunction("ChatRoomMapViewCanEnterTile", 2, (args, next) => {
      const t = next(args);
      try { if (t > 0 && !vineOk(args[0], args[1])) { if (Date.now() - vineTold > 20000) { vineTold = Date.now(); local(line("vine", "tug")); } return 0; } } catch (e) { /* fine */ }
      return t;
    });
  } catch (e) { console.warn("[Dispensary] the leash vine can't hold you:", e); }
  try {
    mod.hookFunction("ChatRoomMessage", 11, (args, next) => {   // (ahead of the Companion's, like farm.js)
      try {
        const data = args[0];
        if (data && data.Type === "Hidden" && typeof data.Sender === "number" && data.Sender !== me()) {
          const m = readMsg(data);
          if (m && m.type === "dispPara") onPara(data.Sender, m);
          else if (m && m.type === "dispSay") onSay(data.Sender, m);
          else if (m && m.type === "dispSaid") local(nameOf(data.Sender) + (m.ok ? " said it." : " let it pass."));
        }
      } catch (e) { console.warn("[Dispensary] parasites:", e); }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] parasites can't hear:", e); }
}
