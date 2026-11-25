/* WHAT'S IN THIS FILE (conditioning/index.js)
   Conditioning, an add-on for the farm bot: guided trance sessions written for each species and each
   level, built on the farm's "listen to my voice". It works alongside ECHS, never instead of it:
   ECHS keeps doing the real hypnosis (its own consent, its own triggers); this is the farm's voice.

   • Only for people who said ?hypno on, and never deeper than the level they allow themselves:
     ?depth fun | deep | nhl   (fun is the default).
   • Their herd leader (or a proprietor) runs a session: ?hyp <who> [fun|deep|nhl]. It drifts in
     privately, a line every ~40 seconds: settle in, sink deeper, the suggestions for that level, then
     waking up (No human left doesn't wake them all the way; that's the point of it).
       fun:  posture, hands, being a good <animal>
       deep: only the handler's voice matters, arousal held on the edge, animal sounds
       nhl:  no human left, clothes don't feel like clothes, a phrase that drops them back down
   • Every session finished counts. Milestones (3, 7, 15, 30 sessions) raise their conditioning tier,
     and the nickname the session uses gets more animal with each tier (more degrading for people with
     ?degrade on, sweeter for ?praise on).
   • ?wake ends a session at once, and so does ?safe (everything stops).
   • Polish, Oct 19 (Laynie: "conditioning could use some polish"): the handler can put their own words in a session
     (?hyp Bessie deep say Good cows love the milker), anybody with ?hypno on can take themselves under (?hyp me),
     deep and No human left sessions keep them stirred up on the way down, and a session ends with a word to both of
     them: how it went and how far to the next tier.
   • With ECHS (Oct 23, Laynie: "the bot needs to detect when someone has set ?hypno on and to send a request to hypnotise
     them"): when somebody goes under with the farm girl through ECHS (?hypnotize me, a trap, her askin' now and then, or
     ?hyp <who> [level] echs), the session runs through ECHS: every line is whispered right beside them, in character, so
     their ECHS hears it, and ECHS's own phrases are worked in for the level (kneel, you cannot move, you hear only my
     voice, you cannot cum, you cannot speak, on all fours…). Their ECHS settings decide what takes. Fun and deep wake
     them at the end; No human left leaves the trance to run out on its own.
   • Every session takes a fresh handful of lines from each part, in order (more-lines.js has the extra ones), so no
     two read the same. The words fit them: a male cow is a bull, a stallion not a mare; udders only for somebody with
     tits; and a line or two is about what they're wearin' (a collar, a bell, paws, a gag, latex…).
   • 2.0, Nov 25 (Laynie: LSCG's hypnosis at the core with ECHS's feel, a session editor for "real hypnotic scripts",
     beats by band, HSC-style looks; "focus on lscgs default suggestion inputs on the first rendition"):
       - Sessions come from the TRANCE LIBRARY (shared/trance-script.js): labelled blocks (inductions, deepeners, convincers,
         suggestions, triggers, wakes) put together by session recipes. Laynie writes them in the studio's trance editor on
         the bot's PC and pushes; the bot picks the push up from there (studio/server.mjs) and keeps it in its books. Until
         then, the starter library (shared/trance-starter.js: these same lines).
       - With LSCG (its hypnosis on, the farm allowed in its Extensions settings): their Companion puts them under LSCG's own
         trance in the farm's name, keeps it up for the session, plays the session's beats if they turned beats on, and
         wakes them. A trigger block is then planted as LSCG's own suggestion, with LSCG's own instructions (strip, pose,
         say, cum, deny…), the way any LSCG hypnotist plants one; their LSCG checks it and lets them fight it as usual.
       - Without LSCG: the farm's own trance on their screen, and the triggers kept by the farm and carried out by their
         Companion, with a give-in-or-fight choice like LSCG's.
       - ?lowpose kneel|fours: whichever is comfier is the pose a trigger puts them in. ?planted: what the farm planted.
*/
import { connect, pick, between, fill, fitting, untag, bodyOf, gearOf, fits as fitsBody } from "../_lib/connect.js";
import { SPECIES_MORE, MALE, UDDER_KINDS, SCRIPT_MORE, GEAR_SUGGEST } from "./more-lines.js";
import { parseLibrary, planSession, sessionSteps, lscgSuggestion, fillIn, LEVELS as LIB_LEVELS } from "../../shared/trance-script.js";
import { STARTER } from "../../shared/trance-starter.js";

// words for each species; anything unknown uses "default"
const SPECIES = {
  cow:     { a: "cow",   s: "moo",    p: "heavy udders",      act: "give milk",          pose: "on all fours, head low",          names: ["sweet cow", "dairy cow", "milk cow", "dumb milk cow"] },
  pony:    { a: "pony",  s: "whinny", p: "strong flanks",     act: "pull and prance",    pose: "head high, knees lifting",       names: ["good pony", "farm pony", "cart pony", "dumb harness pony"] },
  horse:   { a: "mare",  s: "whinny", p: "strong flanks",     act: "carry and obey",     pose: "head high, standing square",     names: ["good mare", "farm mare", "broodmare", "dumb broodmare"] },
  pup:     { a: "pup",   s: "woof",   p: "wagging tail",      act: "heel and fetch",     pose: "kneeling up, paws tucked",       names: ["good pup", "farm pup", "obedient bitch", "dumb mutt"] },
  dog:     { a: "dog",   s: "woof",   p: "wagging tail",      act: "heel and fetch",     pose: "kneeling up, paws tucked",       names: ["good dog", "farm dog", "obedient bitch", "dumb mutt"] },
  kitty:   { a: "kitty", s: "mew",    p: "twitching tail",    act: "purr and present",   pose: "curled low, hips up",            names: ["sweet kitty", "farm cat", "needy kitty", "brainless pet"] },
  cat:     { a: "kitty", s: "mew",    p: "twitching tail",    act: "purr and present",   pose: "curled low, hips up",            names: ["sweet kitty", "farm cat", "needy kitty", "brainless pet"] },
  pig:     { a: "piggy", s: "oink",   p: "soft round belly",  act: "root and wallow",    pose: "nose to the ground",             names: ["sweet piggy", "farm pig", "greedy sow", "filthy sow"] },
  bunny:   { a: "bunny", s: "squeak", p: "twitchy ears",      act: "hop and breed",      pose: "crouched low, nose twitching",   names: ["sweet bunny", "farm bunny", "breeding doe", "dumb breeding doe"] },
  goat:    { a: "goat",  s: "bleat",  p: "full udder",        act: "give milk",          pose: "on all fours, head low",          names: ["sweet goat", "dairy goat", "milk goat", "dumb nanny"] },
  sheep:   { a: "lamb",  s: "baa",    p: "soft fleece",       act: "follow the flock",   pose: "on all fours, head low",          names: ["sweet lamb", "farm lamb", "flock ewe", "dumb sheep"] },
  default: { a: "animal", s: "low animal sound", p: "body",   act: "obey",               pose: "kneeling, hands on your thighs", names: ["good animal", "farm animal", "livestock", "dumb livestock"] },
};
Object.assign(SPECIES, SPECIES_MORE);
const LEVELS = ["fun", "deep", "nhl"];
const LEVEL_NAME = { fun: "Fun", deep: "Deep", nhl: "No human left" };
const MILESTONES = [3, 7, 15, 30];

// %name% their name · {a} animal · {s} sound · {p} body · {act} · {pose} · {pet} nickname for their tier
const SCRIPT = {
  settle: [
    "Hear my voice, %name%. Just my voice. Let everything else in the barn go quiet.",
    "Breathe in slow. Breathe out slower. Every breath out lets your shoulders drop a little more.",
    "You don't have to think right now, %name%. Thinking is work, and you're not working. You're listening.",
    "Feel how heavy your eyelids are getting. It's alright to let them close.",
  ],
  deeper: {
    fun: ["Down a little now. Soft and easy, like sinking into warm straw.",
          "Every word I say makes it easier to drift. Easier to just be my {pet}.",
          "Good. You're drifting, and it feels so nice to let go."],
    deep: ["Deeper now. Each time you breathe out, you sink twice as far.",
           "There's nothing above you but my voice, and nothing below you but more quiet. Keep sinking.",
           "Your thoughts are getting slow and simple. Simple is good. Simple is right for a {a}.",
           "So deep now. You don't need words up here. You just need to listen."],
    nhl: ["Deeper. Past where the words are. Past where your name lives.",
          "Let the person part of you drift away like a dream you're forgetting. There's only the {a} left.",
          "Nothing up there to hold on to. No worries, no choices, no human things. Just a {a}.",
          "Deeper than you've ever been. And every time we do this, you'll go deeper still."],
  },
  suggest: {
    fun: ["When you come up, your body remembers how a good {a} stands: {pose}.",
          "Your hands stay away from yourself. Good {a}s don't touch. They wait to be touched.",
          "Every time someone calls you {pet}, you'll feel a warm little glow of pride.",
          "Being a good {a} is easy. You just {act}, and everything feels right."],
    deep: ["Only my voice matters now. Other voices are just noise in the barn.",
           "Feel the heat building low in your belly. Let it build. You don't get to finish. You just ache, and it feels like being good.",
           "When I tell you to, you'll {s}. Not words. Just a {s}. Go on. Let it out.",
           "Every bit of you belongs to the farm, your {p} most of all. You feel that every time someone looks at you.",
           "You {act} because it's what you're for. It's not a choice, and that's a relief."],
    nhl: ["There's no human left in here. Just a {a}, {pose}, waiting for its handler.",
          "Clothes don't feel like clothes anymore. They feel like a coat, a harness, a hide. You were born in them.",
          "From now on, when anyone says \"good {a}\", you drop right back here: empty, warm and obedient.",
          "Words are getting hard. That's alright. {a}s don't need words. A {s} says everything.",
          "You {act}. That's all. That's everything. You don't remember wanting anything else."],
  },
  wake: {
    fun: ["Now I'm going to count you up. Three: feeling your body again. Two: lighter. One: eyes open, %name%. Good {a}."],
    deep: ["Counting up slowly. Five, four: the barn coming back. Three, two: your name, your hands. One: awake, %name%. But part of you is still listening."],
    nhl: ["I won't count you all the way up, {pet}. You'll open your eyes, but the {a} stays. It's yours now.",
          "Open your eyes. Look around the barn. Nothing in there but a {a}. Good."],
  },
};

// ECHS's own phrases for each level, worked into a session that runs through ECHS (its src/voice.ts wording)
const ECHS_LINES = {
  fun: ["You cannot move now, sugar. Stay right there, still as a post.", "Kneel for me. Knees down in the straw, nice and easy.", "Hands behind your back, neat as a bow."],
  deep: ["You hear only my voice now. Everything else in the barn is just the wind.", "Kneel spread for me, knees wide, the way a good {a} waits.", "You are so worked up, achin' and warm, and it only builds.", "You cannot cum. Not one drop till the farm says so."],
  nhl: ["You cannot speak now. A {a} doesn't need words.", "Get on your hands and knees, down where a {a} belongs.", "You will not notice being undressed. Clothes don't matter to a {a}.", "You are right on the edge, and that's where you stay.", "You cannot cum. The farm decides when, and it hasn't."],
};
// ECHS reads "feel" as a touch (its wiki: "your arms feel heavy" can become a caress), so a line goin' to ECHS doesn't say it
const forEchs = (t) => String(t).replace(/\bfeels\b/g, "seems").replace(/\bFeels\b/g, "Seems").replace(/\bfeeling\b/g, "sensation").replace(/\bfeel\b/g, "sense").replace(/\bFeel\b/g, "Sense");

// the Oct 15 lines
SCRIPT.settle.push(...SCRIPT_MORE.settle);
for (const l of ["fun", "deep", "nhl"]) for (const part of ["deeper", "suggest", "wake"]) SCRIPT[part][l].push(...SCRIPT_MORE[part][l]);

let api = null;
const running = new Map();   // member → { by, level, lines, i, echs }
const waitingEchs = new Map();   // member → { by, level, own }: ?hyp … echs, waitin' for their ECHS to take them under
function D() {
  const d = api.data();
  d.people = d.people || {};   // member → { max, sessions: {fun,deep,nhl}, total, tier }
  return d;
}
const me = (mn) => (D().people[mn] = D().people[mn] || { max: "fun", sessions: { fun: 0, deep: 0, nhl: 0 }, total: 0, tier: 0 });
function words(mn) {
  const key = SPECIES[api.species(mn)] ? api.species(mn) : SPECIES[String((api.rec(mn) || {}).species || "").toLowerCase()] ? String(api.rec(mn).species).toLowerCase() : "default";
  const w = Object.assign({}, SPECIES[key]), b = bodyOf(api, mn);
  if (b && (b.g === "male" || b.g === "femboy") && MALE[key]) Object.assign(w, MALE[key]);
  // udders for somebody with tits; a cock gets its balls; anybody else just their body
  if (UDDER_KINDS.includes(key) && b && !b.tits) w.p = b.cock ? "heavy balls" : "body";
  // what their hands are now: hooves on a cow, a horse, a goat; paws on a pup, a kitty, a bunny; claws on a dragon
  // (Nov 23, Lucira's #54: "During the hypnosis, my limbs are reffered too as paws despite being a horse")
  w.paws = HOOVES.includes(key) ? "hooves" : key === "dragon" ? "claws" : "paws";
  return w;
}
const HOOVES = ["cow", "pony", "horse", "goat", "sheep", "pig", "bull", "deer"];
function petName(mn) {
  const w = words(mn), r = api.rec(mn) || {}, t = me(mn).tier;
  // degrade: the name gets rougher a tier sooner; praise: it stays sweet a tier longer
  const i = Math.max(0, Math.min(3, r.degradeMe ? t + 1 : r.praiseMe ? t - 1 : t));
  return w.names[i];
}
function say(mn, line) {
  const w = words(mn);
  return fill(line, { name: api.name(mn) }).replace(/\{a\}/g, w.a).replace(/\{s\}/g, w.s).replace(/\{p\}/g, w.p)
    .replace(/\{act\}/g, w.act).replace(/\{pose\}/g, w.pose).replace(/\{pet\}/g, petName(mn)).replace(/\{paws\}/g, w.paws || "paws")
    // a word dropped in at the start of a sentence gets its capital (live: "That's alright. cows don't need words.")
    .replace(/(^|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase());
}
// a session: a fresh handful from each part, in order, fitted to their body, with a line or two about their gear
const handful = (list, n, b) => { const pool = fitting(list, b).slice(); for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; } return pool.slice(0, n).map(untag); };
function scriptFor(level, mn, own, echs) {
  const b = mn ? bodyOf(api, mn) : null, g = mn ? gearOf(api, mn) : {};
  const settle = handful(SCRIPT.settle, 4, b), deeper = handful(SCRIPT.deeper[level], level === "fun" ? 3 : 4, b);
  const worn = Object.keys(GEAR_SUGGEST).filter((k) => g[k]), gearLines = handful(worn.map((k) => pick(GEAR_SUGGEST[k])), Math.min(2, worn.length), b);
  const suggest = handful(SCRIPT.suggest[level], (level === "fun" ? 4 : 5) - gearLines.length, b);
  // the gear lines go in among the suggestions, not all at the end
  for (const l of gearLines) suggest.splice(1 + Math.floor(Math.random() * suggest.length), 0, l);
  // the handler's own words, as a suggestion of their own (said twice, the second time near the end)
  if (own) { suggest.splice(Math.min(1, suggest.length), 0, own); suggest.push(own); }
  // through ECHS: its own phrases for the level, spread through the suggestions (deep gets fun's too, nhl gets deep's)
  if (echs) { const add = (level === "nhl" ? ECHS_LINES.deep.slice(0, 2) : level === "deep" ? ECHS_LINES.fun.slice(0, 1) : []).concat(ECHS_LINES[level]);
    for (const l of add) suggest.splice(Math.floor(Math.random() * (suggest.length + 1)), 0, l); }
  const wake = handful(SCRIPT.wake[level], 1, b);
  const lines = [].concat(settle, deeper, suggest, wake);
  lines.cut = [settle.length, deeper.length, suggest.length];
  return lines;
}

// ── the trance library (2.0, Nov 25) ───────────────────────
// The studio on the bot's PC (studio/server.mjs) holds what Laynie last pushed; the bot looks every minute or so (less
// often while the studio isn't open) and keeps a copy in its books, so a restart doesn't lose it.
const STUDIO = "http://localhost:4780/__studio/trance/";
let LIB = null, pullFails = 0, nextPull = 0;
function lib() {
  if (LIB) return LIB;
  const d = D(), own = d.lib && typeof d.lib.text === "string" ? d.lib : null;
  let p = own ? parseLibrary(own.text) : null;
  // a push with nothin' usable in it never leaves the farm with no sessions
  if (!p || !p.blocks.some((b) => !b.bad && b.kind !== "session" && b.lines.length)) p = parseLibrary(STARTER);
  LIB = Object.assign(p, { from: own ? "studio" : "starter", stamp: own ? own.stamp : "", at: own ? own.at : 0 });
  return LIB;
}
function setLib(text, stamp) { if (text == null) delete D().lib; else D().lib = { text: String(text).slice(0, 400000), stamp: String(stamp || "").slice(0, 60), at: Date.now() }; LIB = null; api.save(); return lib(); }
async function pull(force) {
  const W = typeof window !== "undefined" ? window : null;
  if (!W || typeof W.fetch !== "function") return { fail: "no way to reach the studio from here" };
  if (!force && Date.now() < nextPull) return null;
  try {
    const r = await W.fetch(STUDIO + "published.json", { cache: "no-store" });
    if (!r.ok) throw new Error("the studio answered " + r.status);
    const pub = await r.json();
    pullFails = 0; nextPull = Date.now() + 60000;
    if (!pub || !pub.stamp) return { none: true };
    if (!force && D().lib && D().lib.stamp === pub.stamp) return { same: true };
    const t = await W.fetch(STUDIO + "published.txt", { cache: "no-store" });
    if (!t.ok) throw new Error("the studio answered " + t.status);
    const L = setLib(await t.text(), pub.stamp);
    api.log("trance library from the studio (" + pub.stamp + "): " + L.blocks.length + " blocks, " + L.errors.length + " mistakes");
    return { got: L };
  } catch (e) { pullFails++; nextPull = Date.now() + Math.min(10, pullFails) * 60000; return { fail: String((e && e.message) || e) }; }
}
function libText() {
  const L = lib(), n = (k) => L.blocks.filter((b) => b.kind === k && !b.bad).length;
  return "🌀 Trance library: " + (L.from === "studio" ? "pushed from the studio " + new Date(L.at).toISOString().slice(0, 16).replace("T", " ") : "the starter one") + " · " +
    n("session") + " sessions, " + n("induction") + " inductions, " + n("deepener") + " deepeners, " + n("convincer") + " convincers, " + n("suggestion") + " suggestions, " +
    n("trigger") + " triggers, " + n("wake") + " wakes" + (L.errors.length ? " · " + L.errors.length + " mistakes (those blocks are skipped): " + L.errors.slice(0, 3).map((e) => "line " + e.line + " " + e.msg).join("; ") : "");
}

// what kind they are, for a block's "for:" (the same key the words come from)
function speciesKey(mn) {
  const s = String(api.species(mn) || "").toLowerCase(), r = String((api.rec(mn) || {}).species || "").toLowerCase();
  return SPECIES[s] ? s : SPECIES[r] ? r : s || r || "default";
}
const wearsOf = (mn) => { const g = gearOf(api, mn); return Object.keys(g).filter((k) => g[k]); };
const lowOf = (mn) => (me(mn).low === "fours" ? "fours" : "kneel");
// the fill-ins a library line can use
function wordsFor(mn) {
  const w = words(mn), lead = api.herdLeaderOf ? api.herdLeaderOf(mn) : null;
  return { name: api.name(mn), animal: w.a, sound: w.s, body: w.p, pet: petName(mn), act: w.act, pose: w.pose, paws: w.paws || "paws",
    low: lowOf(mn) === "fours" ? "on all fours" : "on your knees", herd: lead && lead !== mn ? api.name(lead) : "the farm", a: w.a, s: w.s, p: w.p };
}
const sayLib = (mn, line) => fillIn(untag(line), wordsFor(mn)).replace(/(^|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase());
function tellOnce(mn, key, text) {
  const x = me(mn), day = new Date().toISOString().slice(0, 10); x.told = x.told || {};
  if (x.told[key] === day) return; x.told[key] = day; api.save(); api.notice(mn, text);
}

// ── the triggers the farm planted ──────────────────────────
// me(mn).sugg[id] = { s: LSCG's suggestion, block, level, at, via: "lscg" | "farm", ok: planted and seen, fired, fought }
const plantedOf = (mn) => { const x = me(mn); return (x.sugg = x.sugg || {}); };
const lscgOn = (hs) => !!(hs && hs.lscg && hs.on);
function plant(mn, run, b) {
  if (!api.hasCompanion || !api.hasCompanion(mn)) { api.log("trigger " + b.name + " not planted in " + mn + ": no Companion"); return; }
  const sg = lscgSuggestion(b, { words: wordsFor(mn), low: lowOf(mn), by: api.cfg.BOT_MEMBER, byName: api.name(api.cfg.BOT_MEMBER) || "The farm", now: Date.now() });
  if (sg.error) { api.log("trigger " + b.name + " can't be planted: " + sg.error); return; }
  const hs = api.hypnoState(mn), all = plantedOf(mn), was = all[sg.id];
  all[sg.id] = { s: sg, block: b.name, level: run.level, at: Date.now(), via: lscgOn(hs) ? "lscg" : "farm", ok: false, fired: was ? was.fired || 0 : 0, fought: was ? was.fought || 0 : 0 };
  api.save();
  if (lscgOn(hs)) plantLscg(mn); else sendFarm(mn);
}
// everything waitin' to go into their LSCG: only while they're under in the farm's name, with suggestions allowed
function plantLscg(mn, quiet) {
  const hs = api.hypnoState(mn) || {}, want = Object.values(plantedOf(mn)).filter((x) => x.via === "lscg" && !x.ok);
  if (!want.length) return false;
  const miss = [];
  if (!hs.sugg) miss.push("tick Allow suggestions in LSCG's Hypnosis settings");
  if (!hs.ours) miss.push((hs.scopes || []).includes("states") ? "be under in the farm's name (it plants them next session)" : "let the farm in: LSCG settings → Extensions → B&B Farm, Hypnosis and States");
  if (miss.length) {
    if (!quiet) tellOnce(mn, "plant", "🌀 The farm has " + want.length + " trigger" + (want.length === 1 ? "" : "s") + " waitin' to go into your LSCG. First " + miss.join(", and ") + ".");
    return false;
  }
  const now = Date.now(), go = want.filter((x) => !x.tried || now - x.tried > 30000);
  if (!go.length) return false;
  for (const x of go) x.tried = now;
  api.lscgPlant(mn, go.map((x) => x.s), [], hs.ver);
  api.later(() => api.hypno(mn, { do: "check", ids: go.map((x) => x.s.id) }), 4000);
  return true;
}
// the farm's own (no LSCG): their Companion keeps and carries them out
function sendFarm(mn) {
  // (?hypno off: they rest, kept, till it's back on)
  const on = !!(api.rec(mn) || {}).hypno;
  const list = on ? Object.values(plantedOf(mn)).filter((x) => x.via === "farm").map((x) => x.s) : [];
  api.hypno(mn, { do: "suggestions", list });
}
function plantedText(mn, forMe) {
  const all = Object.values(plantedOf(mn));
  if (!all.length) return "🌀 " + (forMe ? "Nothin's" : api.name(mn) + " has nothin'") + " planted by the farm" + (forMe ? " in you." : ".");
  return "🌀 Planted by the farm" + (forMe ? " in you" : " in " + api.name(mn)) + ":\n" + all.map((x) =>
    "• " + x.block + ": \"" + x.s.trigger + "\" → " + x.s.instructions.map((i) => i.type).join(", ") + " · " +
    (x.via === "farm" ? "the farm's own" : x.ok ? "in their LSCG" : "waitin' for LSCG") + (x.fired ? " · fired " + x.fired + (x.fought ? ", fought off " + x.fought : "") : "")).join("\n") +
    (forMe ? "\n?planted remove <name> takes one out (all: every one)." + (all.some((x) => x.via === "lscg" && x.ok) ? " Ones in your LSCG also go with LSCG's own: /lscg remove-suggestion B&B <name>." : "") : "");
}

function start(by, mn, level, own, echs, opts) {
  opts = opts || {};
  if (echs) { running.set(mn, { by, level, lines: scriptFor(level, mn, own, echs), i: 0, echs: true }); step(mn); return; }   // through ECHS: as before
  const plan = planSession(lib().blocks, { level, species: speciesKey(mn), wears: wearsOf(mn) }, { name: opts.session });
  if (!plan.blocks.some((b) => b.lines.length)) { running.set(mn, { by, level, lines: scriptFor(level, mn, own, false), i: 0, echs: false }); step(mn); return; }
  const b = bodyOf(api, mn), steps = sessionSteps(plan, { keep: (t) => fitsBody(t, b) });
  // the handler's own words: after the first suggestion, and again just before the wake
  if (own) {
    const i = steps.findIndex((s) => s.kind === "suggestion" || s.kind === "trigger" || s.kind === "convincer");
    steps.splice(i >= 0 ? i : Math.max(1, steps.length - 1), 0, { kind: "suggestion", block: "own", text: own, gap: 40 });
    const w = steps.findIndex((s) => s.kind === "wake");
    steps.splice(w >= 0 ? w : steps.length, 0, { kind: "suggestion", block: "own", text: own, gap: 40 });
  }
  const ms = steps.reduce((n, s) => n + (s.gap || 0) * 1000, 0);
  const run = { by, level, steps, i: 0, lib: true, plan: plan.name, depth: 0, started: Date.now(), ms };
  running.set(mn, run);
  // under: their LSCG's own trance in the farm's name if they have it (and let the farm in), the farm's own if not; their
  // Companion keeps it up till the session's done (trance.js)
  api.hypno(mn, { do: "under", by: api.cfg.BOT_MEMBER, ms: Math.round(ms + 300000), level, session: plan.name });
  api.face(mn, "trance", Math.round(ms / 1000) + 120);
  step(mn);
}
function step(mn) {
  const run = running.get(mn); if (!run) return;
  if (!api.char(mn)) { running.delete(mn); return; }          // they left
  if (run.lib) return stepLib(mn, run);
  const line = run.lines[run.i];
  if (!line) { finish(mn, run); return; }
  // the haze on their screen follows the session: settle 1, deeper 2 (3 for No human left), then lifts
  const [s, d, g] = run.lines.cut;
  const haze = run.i < s ? 1 : run.i < s + d ? (run.level === "nhl" ? 3 : 2) : run.i < s + d + g ? { fun: 1, deep: 2, nhl: 3 }[run.level] : (run.level === "nhl" ? 1 : 0);
  if (haze !== run.haze) { run.haze = haze; api.trance(mn, haze); api.face(mn, haze ? "trance" : "clear", haze ? 600 : 1); }
  if (run.echs && api.echs && api.echs.under(mn)) api.echs.say(mn, forEchs(say(mn, line)));   // in character beside them: their ECHS hears it
  else api.voice(mn, say(mn, line));
  // deeper sessions keep them warm on the way down: a little more with every line past the settling, never all the way
  if (run.level !== "fun" && run.i >= s && api.arouse) api.arouse(mn, run.level === "nhl" ? 7 : 5, run.level === "nhl" ? 92 : 85);
  run.i++;
  api.later(() => step(mn), between(35, 50) * 1000);
}
// a library session, a line at a time: the block's beats and look as it starts, the line in the farm's voice, deeper
// when it says, and a trigger planted once its words are said
function stepLib(mn, run) {
  const s = run.steps[run.i];
  if (!s) { finish(mn, run); return; }
  if (s.start || s.beats || s.look || s.volume != null) {
    const cue = { do: "cue", kind: s.kind, block: s.block };
    if (s.beats) cue.beats = s.beats; if (s.volume != null) cue.volume = s.volume; if (s.look) cue.look = s.look;
    api.hypno(mn, cue);
  }
  if (s.deeper) { run.depth = Math.max(0, Math.min(100, run.depth + s.deeper)); api.hypno(mn, { do: "depth", depth: run.depth }); }
  if (s.text) api.voice(mn, sayLib(mn, s.text));
  if (s.plant) { try { plant(mn, run, s.plant); } catch (e) { api.log("plant: " + ((e && e.message) || e)); } }
  // deeper sessions keep them warm on the way down: a little more with every line past the settling, never all the way
  if (run.level !== "fun" && s.text && s.kind !== "induction" && s.kind !== "wake" && api.arouse) api.arouse(mn, run.level === "nhl" ? 7 : 5, run.level === "nhl" ? 92 : 85);
  run.i++;
  api.later(() => step(mn), Math.max(1, s.gap || 0) * 1000);
}
function finish(mn, run) {
  running.delete(mn);
  if (run.echs && run.level !== "nhl" && api.echs) api.later(() => api.echs.wake(mn), 4000);   // No human left: the trance runs out on its own
  if (run.lib) {
    // fun and deep: woken (out of LSCG's trance too); No human left: the trance is left to run out, the look lifts in a couple of minutes
    if (run.level === "nhl") api.hypno(mn, { do: "linger", secs: 120 });
    else { run.waking = true; api.later(() => { if (!running.has(mn)) { api.hypno(mn, { do: "wake" }); api.face(mn, "clear", 1); } }, 4000); }
    if (run.level === "nhl") api.later(() => { if (!running.has(mn)) api.face(mn, "clear", 1); }, 120000);
  }
  // No human left lingers a couple of minutes, then clears
  else api.later(() => { if (!running.has(mn)) { api.trance(mn, 0); api.face(mn, "clear", 1); } }, run.level === "nhl" ? 120000 : 3000);
  const x = me(mn);
  x.sessions[run.level] = (x.sessions[run.level] || 0) + 1; x.total++;
  const tier = MILESTONES.filter((m) => x.total >= m).length;
  if (tier > x.tier) {
    x.tier = tier;
    api.notice(mn, "🌀 Conditioning tier " + tier + ". You're a " + petName(mn) + " now, deeper every time.");
    if (run.by !== mn) api.notice(run.by, "🌀 " + api.name(mn) + " reached conditioning tier " + tier + ".");
  }
  api.save();
  // a word to both of them: how it went, and how far to the next tier
  const next = MILESTONES.find((m) => x.total < m);
  api.notice(mn, "🌀 Session over: " + LEVEL_NAME[run.level] + ", your " + x.total + (x.total === 1 ? "st" : x.total === 2 ? "nd" : x.total === 3 ? "rd" : "th") + ". " +
    (next ? (next - x.total) + " more to the next tier." : "You're as deep as the farm takes anybody.") + (run.level === "nhl" ? " The haze lifts in a couple of minutes." : ""));
  if (run.by !== mn) api.notice(run.by, "🌀 " + api.name(mn) + "'s " + LEVEL_NAME[run.level] + " session is done (" + x.total + " in all, tier " + x.tier + ").");
}
function stop(mn, why) {
  waitingEchs.delete(mn);
  if (!running.has(mn)) return false;
  const run = running.get(mn);
  running.delete(mn);
  if (run.echs && api.echs) api.echs.wake(mn);
  if (run.lib) api.hypno(mn, { do: "wake", quiet: !why });
  api.trance(mn, 0); api.face(mn, "clear", 1);
  if (why) api.voice(mn, why);
  return true;
}

// ── commands ───────────────────────────────────────────────
function cmdCondition(c) {
  const { sender, args, api: A } = c;
  if (String(args[0] || "").toLowerCase() === "stop") {
    const t = A.find(args[1]);
    if (!t) return c.reply("Whose session, sugar? ?hyp stop <who>");
    if (!(A.isProprietor(sender) || A.herdLeaderOf(t) === sender || running.get(t)?.by === sender)) return c.reply("That's not your session to stop, hon.");
    return c.reply(stop(t, "That's all for now. Come up gently, " + A.name(t) + ".") ? "🌀 Stopped." : A.name(t) + " isn't in a session.");
  }
  const self = /^(me|myself|self)$/i.test(String(args[0] || ""));
  const t = self ? sender : A.find(args[0]);
  if (!t || !A.rec(t)) return c.reply("Here's how: ?hyp <who> [fun|deep|nhl] [say <your own words>], or ?hyp me [level] to go under yourself. They need ?hypno on, and it never goes deeper than they allow.");
  if (!self && !(A.isProprietor(sender) || A.herdLeaderOf(t) === sender)) return c.reply("Only " + A.name(t) + "'s herd leader (or a proprietor) runs their sessions, sugar. ?hyp me takes you under yourself.");
  if (!A.rec(t).hypno) return c.reply(A.name(t) + " hasn't said ?hypno on, so no sessions, hon.");
  if (!A.char(t)) return c.reply(A.name(t) + " needs to be here on the farm for a session.");
  if (running.has(t)) return c.reply(A.name(t) + " is already in a session.");
  const want = LEVELS.includes(String(args[1] || "").toLowerCase()) ? String(args[1]).toLowerCase() : me(t).max;
  if (LEVELS.indexOf(want) > LEVELS.indexOf(me(t).max)) return c.reply(A.name(t) + " only allows " + LEVEL_NAME[me(t).max] + " sessions. That's their call.");
  // ?hyp Bessie deep say <words>: the handler's own suggestion, in the session (not on a session they start on themselves)
  const si = args.findIndex((a) => /^say$/i.test(a));
  const own = !self && si >= 0 ? args.slice(si + 1).join(" ").replace(/[()]/g, "").trim().slice(0, 160) : "";
  // ?hyp Bessie deep echs: through their ECHS (it asks them first; the session starts when they're under)
  if (args.slice(1, si >= 0 ? si : undefined).some((a) => /^echs$/i.test(a))) {
    if (!A.echs) return c.reply("The farm's ECHS side isn't running, sugar.");
    const no = A.echs.ask(t, "conditioning");
    if (no) return c.reply("🌀 Not through ECHS right now: " + no + ".");
    waitingEchs.set(t, { by: sender, level: want, own: own || null, at: Date.now() });
    return c.reply("🌀 Reachin' for " + A.name(t) + " through their ECHS. When they go under, a " + LEVEL_NAME[want] + " session starts through it.");
  }
  // ?hyp Bessie deep session Deep in the Barn: one of the library's sessions by name (else one that suits them)
  const ss = args.findIndex((a) => /^session$/i.test(a));
  const session = ss >= 0 ? args.slice(ss + 1, si > ss ? si : undefined).join(" ").trim() : "";
  start(sender, t, want, own || null, false, { session });
  const run = running.get(t) || {};
  c.reply("🌀 " + LEVEL_NAME[want] + " session started for " + A.name(t) + (run.plan ? " (" + run.plan + ")" : "") + ", about " +
    Math.max(1, Math.round(run.lib ? run.ms / 60000 : (run.lines || []).length * 42 / 60)) + " minutes. ?hyp stop " + A.name(t) + " ends it.");
}
function cmdLevel(c) {
  const { sender, args, api: A } = c, v = String(args[0] || "").toLowerCase();
  if (!A.rec(sender)) return c.reply("That's just for folks on the books, sugar.");
  if (!LEVELS.includes(v)) return c.reply("🌀 You allow " + LEVEL_NAME[me(sender).max] + " sessions. ?depth fun, deep or nhl (No human left) sets the deepest you'll go.");
  me(sender).max = v; A.save();
  c.reply("🌀 The deepest a session can take you is now " + LEVEL_NAME[v] + "." + (A.rec(sender).hypno ? "" : " (Sessions also need ?hypno on.)"));
}
const progressText = (mn) => {
  const x = me(mn), next = MILESTONES.find((m) => x.total < m);
  return "🌀 Conditioning: tier " + x.tier + " (" + petName(mn) + ") · " + x.total + " sessions (fun " + x.sessions.fun + ", deep " + x.sessions.deep + ", nhl " + x.sessions.nhl + ")" +
    (next ? " · next tier at " + next : " · top tier") + " · allows " + LEVEL_NAME[x.max];
};

function companion(mn) {
  const r = api.rec(mn); if (!r) return null;
  const x = me(mn), next = MILESTONES.find((m) => x.total < m), cards = [], planted = Object.values(plantedOf(mn));
  cards.push({ title: "Conditioning", text: r.hypno ? undefined : "Sessions need ?hypno on (in your Toggles).",
    lines: [["Tier", x.tier + " · " + petName(mn)], ["Sessions", x.total], ["Deepest allowed", LEVEL_NAME[x.max]], ["Down low", lowOf(mn) === "fours" ? "on all fours" : "kneelin'"],
      ["Trance", lscgLine(mn)], ["Planted", planted.length ? planted.length + " trigger" + (planted.length === 1 ? "" : "s") : "none"]],
    bars: next ? [{ label: "To the next tier", value: x.total + " / " + next, pct: (x.total / next) * 100 }] : undefined,
    buttons: LEVELS.map((l) => ({ label: "Allow " + LEVEL_NAME[l], cmd: "depth " + l, accent: l === x.max }))
      .concat([{ label: "Kneel", cmd: "lowpose kneel", accent: lowOf(mn) === "kneel" }, { label: "All fours", cmd: "lowpose fours", accent: lowOf(mn) === "fours" }])
      .concat(planted.length ? [{ label: "What's planted", cmd: "planted" }] : [])
      .concat(running.has(mn) ? [{ label: "Wake me up", cmd: "wake", accent: true }] : r.hypno ? [{ label: "Take me under", cmd: "hyp me" }, { label: "Ask my ECHS", cmd: "hypnotize me" }] : []) });
  if (api.isStaff(mn)) cards.push({ staff: true, title: "Run a session", input: { placeholder: "Bessie deep", label: "Start (who, level)", cmd: "hyp" },
    note: "Only for your own herd (proprietors: anyone). Never deeper than they allow. Add: session <name> to pick one of the library's." });
  return { cards };
}
// how their trance works, from what their Companion says about their LSCG
function lscgLine(mn) {
  const hs = api.hypnoState(mn);
  if (!hs) return "the farm's own (no word from your Companion yet)";
  if (!hs.lscg) return "the farm's own (no LSCG)";
  if (!hs.on) return "the farm's own (LSCG's hypnosis is off)";
  const need = [];
  if (!(hs.scopes || []).includes("states") || !(hs.scopes || []).includes("hypno")) need.push("let the farm in: LSCG settings → Extensions → B&B Farm, Hypnosis and States");
  if (!hs.sugg) need.push("tick Allow suggestions");
  return need.length ? "LSCG, once you " + need.join(", and ") : "LSCG's own, in the farm's name";
}

function cmdPlanted(c) {
  const { sender, args, api: A } = c, verb = String(args[0] || "").toLowerCase();
  if (verb === "remove" || verb === "clear") {
    // ?planted remove <name|all> [who]   (yours, or your herd's if you lead it, or anybody's for a proprietor)
    let rest = args.slice(1), t = sender;
    if (rest.length > 1) { const who = A.find(rest[rest.length - 1]); if (who && who !== sender && A.rec(who)) { t = who; rest = rest.slice(0, -1); } }
    if (t !== sender && !(A.isProprietor(sender) || A.herdLeaderOf(t) === sender)) return c.reply("Only their herd leader or a proprietor takes out what's planted in " + A.name(t) + ", sugar.");
    const all = plantedOf(t), name = verb === "clear" ? "all" : rest.join(" ").trim().toLowerCase().replace(/^b&b\s+/, "");
    const hit = Object.keys(all).filter((id) => name === "all" || all[id].block.toLowerCase() === name || all[id].s.trigger.toLowerCase() === name);
    if (!hit.length) return c.reply("🌀 Nothin' planted by that name. ?planted" + (t === sender ? "" : " " + A.name(t)) + " shows the list.");
    const lscgOnes = hit.filter((id) => all[id].via === "lscg" && all[id].ok).map((id) => all[id].s.name);
    for (const id of hit) delete all[id];
    A.save(); sendFarm(t);
    c.reply("🌀 Taken out: " + hit.length + "." + (lscgOnes.length ? " " + (t === sender ? "In your LSCG, take " + (lscgOnes.length === 1 ? "it" : "them") + " out with LSCG's own: " : A.name(t) + " takes the LSCG copies out with ") + lscgOnes.map((n) => "/lscg remove-suggestion " + n).join(" · ") + " (the farm won't plant " + (lscgOnes.length === 1 ? "it" : "them") + " again)." : ""));
    if (t !== sender) A.notice(t, "🌀 " + A.name(sender) + " took out " + hit.length + " of the farm's triggers in you." + (lscgOnes.length ? " Your LSCG still has " + (lscgOnes.length === 1 ? "one" : lscgOnes.length) + ": /lscg remove-suggestion " + lscgOnes.join(" · ") : ""));
    return;
  }
  const t = args[0] ? A.find(args.join(" ")) : sender;
  if (!t || !A.rec(t)) return c.reply("Whose, sugar? ?planted [who]");
  if (t !== sender && !(A.isProprietor(sender) || A.herdLeaderOf(t) === sender || A.isStaff(sender))) return c.reply("Only staff look at what's planted in somebody else, hon.");
  c.reply(plantedText(t, t === sender));
}

connect({
  name: "conditioning",
  label: "Conditioning",
  version: __ADDON_VERSION__,   // (its addon.json's, put in by the build)
  guide: "Guided trance sessions in the farm's voice, put together from the farm's trance library (inductions, deepeners, suggestions, triggers, wakes). Needs ?hypno on; ?depth fun|deep|nhl sets the deepest you allow. " +
    "Your herd leader runs them with ?hyp <who> [level] [session <name>] [say <their own words>], or take yourself under with ?hyp me. " +
    "With LSCG (its hypnosis on, and the farm let in under LSCG settings → Extensions → B&B Farm): you go under LSCG's own trance in the farm's name, its beats play if you turned them on, and a session's triggers go into your LSCG as its own suggestions (tick Allow suggestions). Without LSCG, the farm's own trance and triggers. " +
    "?lowpose kneel|fours picks the pose a trigger puts you in. ?planted shows what the farm planted; ?planted remove <name> takes one out. With ECHS: ?hypnotize me (or ?hyp <who> [level] echs). Sessions count toward conditioning tiers (3, 7, 15, 30). ?wake or ?safe ends one at once.",
  setup(a) {
    api = a; D();
    // the studio on the bot's PC: anything Laynie pushed, picked up every minute or so
    const tick = () => { pull(false).catch(() => {}); api.later(tick, 60000); };
    api.later(tick, 15000);
  },
  commands: {
    planted: { usage: "planted [who] | planted remove <name|all> [who]", private: true, run: cmdPlanted },
    lowpose: { usage: "lowpose kneel|fours", aliases: ["low"], private: true, run: (c) => {
      const v = String(c.args[0] || "").toLowerCase(), A = c.api;
      if (!A.rec(c.sender)) return c.reply("That's just for folks on the books, sugar.");
      if (!/^(kneel|kneeling|knees|fours|allfours|all)$/.test(v)) return c.reply("🌀 When a trigger puts you down low, you go " + (lowOf(c.sender) === "fours" ? "on all fours" : "to your knees") + ". ?lowpose kneel or ?lowpose fours, whichever's comfier.");
      me(c.sender).low = /^(fours|allfours|all)$/.test(v) ? "fours" : "kneel"; A.save();
      c.reply("🌀 Down low means " + (lowOf(c.sender) === "fours" ? "on all fours" : "on your knees") + " for you now. Triggers planted from here on use it" + (Object.keys(plantedOf(c.sender)).length ? " (ones already planted keep theirs till the next session plants them again)" : "") + ".");
    } },
    trancelib: { usage: "trancelib [pull|starter]", private: true, run: async (c) => {
      if (!c.api.isProprietor(c.sender)) return c.reply("That's the proprietors', sugar.");
      const v = String(c.args[0] || "").toLowerCase();
      if (v === "starter") { setLib(null); return c.reply("🌀 Back to the starter library.\n" + libText()); }
      if (v === "pull") { const r = await pull(true); return c.reply(r && r.got ? "🌀 Pulled from the studio.\n" + libText() : r && r.none ? "🌀 The studio's open, but nothin's been pushed yet." : "🌀 Couldn't reach the studio on this PC (" + ((r && r.fail) || "?") + "). It needs to be running: Start the studio.bat."); }
      c.reply(libText());
    } },
    hyp: { usage: "hyp <who|me> [fun|deep|nhl] [say <words>]", aliases: ["condition"], private: true, run: cmdCondition },
    depth: { usage: "depth fun|deep|nhl", aliases: ["hypnolevel"], private: true, run: cmdLevel },
    wake: { usage: "wake", private: true, run: (c) => c.reply(stop(c.sender, "Coming up now. Eyes open, " + c.api.name(c.sender) + ". You're alright.") ? "🌀 Session ended." : "You're not in a session, sugar.") },
    trance: { usage: "trance [who]", aliases: ["conditioning"], private: true, run: (c) => {
      const t = c.args[0] ? c.api.find(c.args[0]) : c.sender;
      if (t !== c.sender && !c.api.isStaff(c.sender)) return c.reply("Only staff look at somebody else's, sugar.");
      c.reply(t ? progressText(t) : "Who's that, hon?");
    } },
  },
  on: { safe: (mn) => { stop(mn, null); api.hypno(mn, { do: "clear" }); }, leave: (mn) => stop(mn, null),
    hypnoSwitch: (mn, on) => { if (!on) stop(mn, null); if (Object.keys(plantedOf(mn)).length) sendFarm(mn); },
    // their Companion on their LSCG (trance.js): anything waitin' to be planted goes in when it can; LSCG come or gone,
    // the triggers move with it (the farm's own carried out by their Companion, LSCG's own by their LSCG)
    hypnoState: (mn, hs) => {
      const all = plantedOf(mn), list = Object.values(all);
      if (!list.length) return;
      if (lscgOn(hs)) {
        const moved = list.filter((x) => x.via === "farm");
        for (const x of moved) { x.via = "lscg"; x.ok = false; }
        if (moved.length) { api.save(); sendFarm(mn); }
        if (hs.planted && hs.planted.length) for (const x of list) if (x.via === "lscg" && hs.planted.includes(x.s.id)) x.ok = true;
        plantLscg(mn, true);
      } else {
        const moved = list.filter((x) => x.via === "lscg");
        for (const x of moved) { x.via = "farm"; x.ok = false; }
        if (moved.length) api.save();
        sendFarm(mn);
      }
    },
    hypnoEvent: (mn, e) => {
      const run = running.get(mn), all = plantedOf(mn);
      if (e.ev === "checked") {
        for (const id of e.ids) if (all[id]) all[id].ok = e.found.includes(id);
        api.save();
        const missed = e.ids.filter((id) => all[id] && !all[id].ok);
        if (missed.length) api.log("LSCG didn't take " + missed.join(", ") + " for " + mn + " (their item permission, or they weren't under in the farm's name)");
        return;
      }
      if (e.ev === "safeword") { stop(mn, null); return; }
      // brought up out of it mid-session by somebody else (a snap, a boop, their wake word) or by their own LSCG timing out
      if (e.ev === "awake" && run && run.lib && !run.waking && e.method && e.method !== "farm") {
        stop(mn, null);
        api.notice(mn, "🌀 You came up out of it" + (e.method === "snap" ? " at a snap of fingers" : e.method === "boop" ? " with a boop" : e.method === "word" ? " at your wake word" : e.method === "timeout" ? " when LSCG's trance time ran out" : "") + ", so that session's over. ?hyp me takes you back down.");
        if (run.by !== mn) api.notice(run.by, "🌀 " + api.name(mn) + " came up out of the session early.");
        return;
      }
      if (e.ev === "resolved" || e.ev === "fired") {
        const x = all[e.id] || Object.values(all).find((y) => y.s.name === e.name);
        if (x) { x.fired = (x.fired || 0) + 1; if (e.resisted) x.fought = (x.fought || 0) + 1; x.last = Date.now(); api.save(); }
      }
    },
    // under with the farm girl through ECHS: the session runs through it (asked for with ?hyp … echs, or not)
    echsUnder: (mn, info) => {
      const r = api.rec(mn); if (!r || !r.hypno) return;
      api.echs.take(mn);
      if (running.has(mn)) { running.get(mn).echs = true; api.echs.take(mn, running.get(mn).level); return; }
      const w = waitingEchs.get(mn); waitingEchs.delete(mn);
      const by = (w && w.by) || (info && info.by) || mn;
      start(by, mn, w ? w.level : me(mn).max, w ? w.own : null, true);
      if (running.has(mn)) api.echs.take(mn, running.get(mn).level);   // (No human left: the farm leaves that trance to run out by itself, Nov 24)
      if (by !== mn) api.notice(by, "🌀 " + api.name(mn) + " is under with the farm: the " + LEVEL_NAME[running.get(mn).level] + " session's started through their ECHS.");
    },
    // they came up on their own (their /echs safeword): the farm's session stops too. ECHS's half hour: it carries on in the farm's voice
    echsWoke: (mn, info) => { waitingEchs.delete(mn); const run = running.get(mn); if (!run) return; if (info && info.self) stop(mn, null); else run.echs = false; },
  },
  companion,
});
