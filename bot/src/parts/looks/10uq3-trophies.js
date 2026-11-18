  /* WHAT'S IN THIS FILE (10uq3-trophies.js)
     TROPHIES, THE FARM'S MARKS AND THE TRAP PASSPORT (approved Nov 17 from the tattoo sheets). Laynie, Nov 18: trophies
     "should be offered, and if its a permanent trophy, have a way to equip or take it off at any time"; trap brands
     "newest wins, or we can include hidden slots the farm uses, that can be removed with ?wash unless permanently branded".
     • TROPHIES: live ink the farm hands out the first time somethin' happens to them (their first load, their first knot,
       three studs, a trap that let them go...). They go in the panel state (trophies); their Companion offers each one
       once, Wear it or No thanks, and keeps them all in the 🏆 Trophies row on the Me tab, to put on or take off any time.
       Every one is theirs for good, and keeps the farm's count. (shared/ink/ink.js trophyWear)
     • THE FARM'S MARKS: a trap that marks its own (the pond's tentacles, the wolf pack, the boar) sears its brand into
       one of three hidden Farm Mark slots, not the wardrobe's, so it never pushes out ink they picked and never goes over
       their own brand. Newest wins: the same trap again sears it fresh. Healin' pale over three days, like any brand.
         ?wash                 scrubs the farm's marks off, unless they've been seared on for good
         ?brand <who> keep     proprietors, the herd's owner: seared on for good (?marks keep, their own)
         ?marks                what the farm's marked on you, and ?marks keep
         ?brand <who> clear    (proprietors, the herd's owner) takes the brand and every mark off, kept ones too
       Only with "Farm can ink me" on and a Companion new enough (0.63.0), and never if their limits rule out a brand
       or marks (written in later, and the marks come off).
     • THE TRAP PASSPORT: a stamp for where each trap that let them go had them (the place, or the beast's own lair),
       the last four, for the Trap Passport live design (the ink counts: passport).
  */
  const TROPHIES = [
    { id: "card",      design: "LiveBreedingCard",  title: "Breeding Card",       why: "your first load at the farm",       got: (c) => c.loads >= 1 },
    { id: "tied",      design: "LiveTied",          title: "Tied ×",              why: "your first knot",                   got: (c) => c.tied >= 1 },
    { id: "passport",  design: "LiveTrapPassport",  title: "Trap Passport",       why: "the first trap that let you go",    got: (c) => Array.isArray(c.passport) && c.passport.length >= 1 },
    { id: "guestbook", design: "LiveGuestbook",     title: "Bred By (guestbook)", why: "three different studs",             got: (c) => !!c.studs && c.studs.list.length + (c.studs.more || 0) >= 3 },
    { id: "scores",    design: "LiveHighScores",    title: "High Scores",         why: "a stud who's bred you five times",  got: (c) => (c.scores || []).some((x) => x[1] >= 5) },
    { id: "bred",      design: "LiveTimesBred",     title: "Times Bred",          why: "twenty-five loads",                 got: (c) => c.loads >= 25 },
    { id: "litters",   design: "LiveLitters",       title: "Litters",             why: "your first litter",                 got: (c) => c.litters >= 1 },
    { id: "eggs",      design: "LiveEggsLaid",      title: "Eggs Laid",           why: "your first eggs",                   got: (c) => c.eggs >= 1 },
    { id: "milked",    design: "LiveLitresMilked",  title: "Litres Milked",       why: "ten litres milked",                 got: (c) => c.milked >= 10 },
  ];
  // what they've earned (the first time each was true, kept on their record), for the panel: [{ id, design, title, why, at }]
  function trophiesFor(mn, s){
    const r = rec(mn), c = s && s.ink; if (!r || !c) return;
    r.trophies = r.trophies || {};
    let fresh = false;
    for (const T of TROPHIES) if (!r.trophies[T.id]){ let got = false; try { got = !!T.got(c); } catch(e){ got = false; } if (got){ r.trophies[T.id] = Date.now(); fresh = true; } }
    if (fresh) saveLedger();
    const list = TROPHIES.filter((T) => r.trophies[T.id]).map((T) => ({ id: T.id, design: T.design, title: T.title, why: T.why, at: r.trophies[T.id] }));
    if (list.length) s.trophies = list;
  }

  // ── the trap passport: a stamp for where it had them ──
  const STAMP = { kennel: "THE KENNELS", stalls: "THE BARN", bench: "THE BENCH", stockade: "THE STOCKS", cabin: "THE CABIN", pigsty: "THE PIGSTY",
    pasture: "THE PASTURE", glory: "GLORY HOLES", trough: "THE TROUGH", wildlife: "THE WILDS", office: "THE OFFICE" };
  function stampOf(spot, kind){
    if (kind === "tentacle") return "THE POND";
    let th = null; try { th = spot ? trapTheme(spot) : null; } catch(e){ th = null; }
    if (!th && ANTHRO[kind] && ANTHRO[kind].where) return String(ANTHRO[kind].where).toUpperCase().slice(0, 16);
    if (!th) th = Object.keys(TRAP_THEMES).find((k) => (TRAP_THEMES[k].kinds || []).includes(kind)) || null;
    return STAMP[th] || (th && TRAP_THEMES[th] ? String(TRAP_THEMES[th].label).toUpperCase().slice(0, 16) : "B&B FARM");
  }

  // ── the farm's marks ──
  const TRAP_MARK = { tentacle: "TentacleRingBrand", wolves: "MoonPawBrand", boar: "SnoutRingBrand" };
  const MARK_OF = { TentacleRingBrand: { who: "the pond", name: "tentacle ring" }, MoonPawBrand: { who: "the pack", name: "moon paw" }, SnoutRingBrand: { who: "the boar", name: "snout ring" } };
  const markName = (d) => (MARK_OF[d] ? MARK_OF[d].name : String(d).replace(/Brand$/, "").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase());
  const markWho = (d) => (MARK_OF[d] ? MARK_OF[d].who : "the farm");
  const MARKS_HELD = 3;   // (three hidden slots on their Companion)
  const noMarks = (mn) => /\b(brand|mark)/i.test((rec(mn) || {}).limits || "");
  // a Companion with the farm's mark slots, and "Farm can ink me" on
  function markable(mn){ const c = state.companions.get(mn); return inkable(mn) && !!(c && verAtLeast(c.ver, "0.63.0")); }
  // what goes in their hidden slots (farmInkFor, 10uq2-farm-ink.js): newest last
  function marksInk(mn){
    const r = rec(mn); if (!r || !Array.isArray(r.marks) || !r.marks.length || noMarks(mn)) return [];
    return r.marks.map((m) => ({ id: "mark:" + m.d + ":" + m.at, slot: "mark", design: m.d, at: m.at, heal: INK_HEAL_MS }));
  }
  const MARK_LINES = {
    TentacleRingBrand: [
      "🐙 As the last of it slides out of %n, a tentacle tip curls tight against their skin and squeezes, hot as a coal. When it lets go there's a ring left behind, raised and red: the pond's mark.",
      "🐙 Somethin' in the water kisses %n on its way back down, and the spot burns. There's a tentacle coiled in a ring there now, seared pink into the skin. The pond knows its own.",
      "🐙 The pond leaves %n a keepsake: a ring of suckers pressed in so hard it's branded there, angry and red.",
    ],
    MoonPawBrand: [
      "🐺 The last wolf to tie %n bites down as he pulls free, and when the sting fades there's a paw under a moon left in their skin, red and raised: the pack's mark.",
      "🐺 Before the pack lopes off, the big one presses a hot paw to %n and holds it there. It comes away and leaves a print under a crescent moon, seared in. Pack property.",
      "🐺 %n crawls out of the den with a fresh brand: a paw and a moon, still stingin'. The pack marks what it's bred.",
    ],
    SnoutRingBrand: [
      "🐗 The boar grunts and shoves his ringed snout hard against %n, and it comes away hot: a snout and a ring burned into their hide. The sty's mark.",
      "🐗 When the boar's done he roots at %n one last time, and his snout ring burns like a brandin' iron. They carry the boar's mark now, raised and red under the mud.",
      "🐗 %n climbs out of the wallow with the boar's ring seared into their hide, angry red under the muck. He marks what he's bred.",
    ],
  };
  const MARK_AGAIN = [
    "🔥 The %m on %n flares up hot and red again, fresh as the day it went on. %w knows its own.",
    "🔥 %W finds the mark it left on %n last time and sears it in again, deeper.",
    "🔥 The old %m on %n burns fresh again: %w's been back for more.",
  ];
  const markFill = (t, mn, d) => t.replace(/%n/g, plainName(mn)).replace(/%m/g, markName(d)).replace(/%W/g, markWho(d).replace(/^./, (x) => x.toUpperCase())).replace(/%w/g, markWho(d));
  // a trap let go of them (trapEnded, 10y9o-trap-ratings.js): a stamp in their passport, and the beast's mark if it leaves one
  function trapMarkAfter(mn, kind){
    const r = rec(mn); if (!r) return;
    const last = (r.trapLog || []).slice(-1)[0];
    r.passport = (r.passport || []).concat(stampOf(last && last.kind === kind ? last.spot : "", kind)).slice(-4);
    const d = TRAP_MARK[kind];
    if (!d || !markable(mn) || noMarks(mn)){ saveLedger(); return; }
    const had = (r.marks || []).find((m) => m.d === d);
    r.marks = (r.marks || []).filter((m) => m.d !== d).concat({ d, at: Date.now(), keep: had && had.keep ? 1 : 0 }).slice(-MARKS_HELD);
    saveLedger(); syncCompanions(true);
    later(() => {
      if (!charFor(mn)) return;
      emote(markFill(pickFresh("mark:" + (had ? "again" : d), had ? MARK_AGAIN : MARK_LINES[d]), mn, d), mn);
      if (!had) tell(mn, "🔥 " + markWho(d).replace(/^./, (x) => x.toUpperCase()) + " left its mark on you: the " + markName(d) + ", on your skin under your clothes, for everybody with the Companion to see. It heals pale over three days. ?wash scrubs it off, unless it's seared on for good (?marks keep does that).");
    }, 6000);
  }
  // ?wash: the farm's marks scrubbed off, except the ones seared on for good. Gives the ones that came off, and the kept.
  function marksWash(mn){
    const r = rec(mn); if (!r || !Array.isArray(r.marks) || !r.marks.length) return { off: [], kept: [] };
    const off = r.marks.filter((m) => !m.keep).map((m) => m.d), kept = r.marks.filter((m) => m.keep).map((m) => m.d);
    r.marks = kept.length ? r.marks.filter((m) => m.keep) : null;
    return { off, kept };
  }
  const WASH_MARK_OFF = [
    "🚿 The scrubbin' takes the %m off %n too. Never burned in for good, so off it comes.",
    "🚿 A hard scrub with the brush, and the last of %w's markin' on %n comes away with the muck: the %m, gone.",
  ];
  const WASH_MARK_KEPT = [
    "🚿 The brush goes over the %m on %n and nothin' budges. That's in for good.",
    "🚿 Scrub as hard as they like, the %m on %n won't shift: seared in for good.",
  ];
  // the lines for what a wash did to their marks (10ug-wash.js): two or three at once read as one ("the tentacle ring
  // and moon paw"), and come from the farm rather than one beast
  function marksWashLines(mn, w){
    const fill = (key, pool, list) => { let t = pickFresh(key, pool); if (list.length > 1) t = t.replace(/%w/g, "the farm"); return markFill(t, mn, list[0]).replace(markName(list[0]), list.map(markName).join(" and ")); };
    const out = [];
    if (w && w.off.length) out.push(fill("mark:wash", WASH_MARK_OFF, w.off));
    if (w && w.kept.length) out.push(fill("mark:kept", WASH_MARK_KEPT, w.kept));
    return out;
  }
  const KEEP_SEAR = [
    "🔥 %b heats the iron and goes over %m on %t again, slow, till it's burned in for good. No scrubbin' takes it off now.",
    "🔥 %b holds %t still and sears %m in a second time, deeper. That one's stayin'.",
  ];
  const KEEP_SELF = [
    "🔥 %t holds still at the brandin' post and lets the iron go over %m again, slow, till it's in for good. Their own choice, and it's stayin'.",
    "🔥 %t bites down and keeps still while the iron goes over %m a second time. They wanted it kept, and now it is.",
  ];
  // ?brand <who> keep: the farm's marks on them, seared on for good (proprietors, the herd's owner, or themselves)
  function brandKeep(by, t, R){
    const r = t ? rec(t) : null;
    if (!r){ R("Keep whose marks, sugar? ?brand <who> keep sears the farm's marks on for good, so ?wash leaves 'em. ?marks keep for your own."); return; }
    if (!(t === by || isProprietor(by) || membership(t, by))){ R("Only a proprietor, the herd's owner or " + plainName(t) + " themselves can sear the farm's marks on for good, hon."); return; }
    const marks = Array.isArray(r.marks) ? r.marks : [];
    if (!marks.length){ R((t === by ? "You've" : plainName(t) + " has") + " none of the farm's marks to keep, sugar. The pond, the wolf pack and the boar leave theirs, with \"Farm can ink me\" on."); return; }
    const fresh = marks.filter((m) => !m.keep);
    if (!fresh.length){ R("Everything the farm's marked on " + (t === by ? "you" : plainName(t)) + " is on for good already."); return; }
    const now = Date.now();
    for (const m of fresh){ m.keep = 1; m.at = now; }   // (seared again: fresh and red, healin' over three days)
    saveLedger(); audit(by, "MARK_KEEP", t + " " + fresh.map((m) => m.d).join(",")); syncCompanions(true);
    const names = fresh.map((m) => "the " + markName(m.d)).join(" and ");
    const line = pickFresh(t === by ? "mark:keepself" : "mark:keep", t === by ? KEEP_SELF : KEEP_SEAR).replace(/%b/g, plainName(by)).replace(/%t/g, plainName(t)).replace(/%m/g, names);
    if (charFor(t)) emote(line, t);
    R("🔥 " + (t === by ? "Yours are" : plainName(t) + "'s are") + " on for good now: " + names + ". ?wash won't touch " + (fresh.length > 1 ? "them" : "it") + "; only ?brand " + (t === by ? "<you>" : plainName(t)) + " clear, from a proprietor or the herd's owner.");
    if (t !== by) tell(t, "🔥 " + plainName(by) + " seared the farm's marks on you for good: " + names + ". ?wash won't take " + (fresh.length > 1 ? "them" : "it") + " off now.");
  }
  // ?brand <who> clear takes these too (15-commands.js): gives how many came off
  function marksClear(mn){ const r = rec(mn); const n = r && Array.isArray(r.marks) ? r.marks.length : 0; if (r) r.marks = null; return n; }
  // the right-now strip (10x-trap-extras.js aftermathOf)
  function marksNow(mn){ const r = rec(mn); return r && Array.isArray(r.marks) ? r.marks.map((m) => ({ icon: "🔥", text: markWho(m.d).replace(/^./, (x) => x.toUpperCase()) + "'s mark" + (m.keep ? ", for good" : "") })) : []; }
  // ?marks: the farm's marks on you · ?marks keep: yours, on for good (?brand is staff's, so this is yours)
  function marksCommand(sender, args, R){
    const r = rec(sender), marks = r && Array.isArray(r.marks) ? r.marks : [];
    if (/^keep$/i.test(args[0] || "")){ brandKeep(sender, sender, R); return; }
    if (!marks.length){ R("You've none of the farm's marks on you, sugar. The pond, the wolf pack and the boar leave theirs, with \"Farm can ink me\" on in your Companion."); return; }
    R("🔥 The farm's marks on you: " + marks.map((m) => "the " + markName(m.d) + " (" + markWho(m.d) + "'s" + (m.keep ? ", on for good" : ", ?wash scrubs it off") + ")").join(", ") + "." +
      (marks.some((m) => !m.keep) ? " ?marks keep sears yours on for good." : ""));
  }
  addCommand("marks", { topic: "milk", run: (c) => marksCommand(c.sender, c.args, c.R) });
  if (W.__FARMHAND_TEST__) Object.assign(W, { __trophies: TROPHIES, __stampOf: (s, k) => stampOf(s, k), __trapMarkAfter: (m, k) => trapMarkAfter(m, k) });
