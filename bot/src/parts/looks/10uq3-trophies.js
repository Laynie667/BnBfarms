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
  // (Nov 18, Laynie: "looks good, add the tattoos"): every beast that breeds them sears its own brand on, from the farm's
  // own brands; the big breeders leave a tattoo as well (TRAP_TAT, below)
  const TRAP_MARK = { tentacle: "TentacleRingBrand", wolves: "MoonPawBrand", werewolf: "MoonPawBrand", boar: "SnoutRingBrand", sow: "SnoutRingBrand",
    stallion: "Mare", ponycart: "Mare", bull: "Hucow", minotaur: "Hucow", warren: "Bunny", foxden: "Vixen", ramstud: "Ewe", stag: "Doe", goat: "Nanny",
    drake: "Dragoness", toms: "Kitten", lionpride: "Kitten", kennel: "TheKennelsBrand", whelping: "TheKennelsBrand",
    goblinraid: "Goblins", goblinpit: "Goblins", goblinmarket: "Goblins", goblincart: "Goblins", warband: "Goblins", breeder: "BreedingStock", studchair: "BreedingStock" };
  const MARK_OF = { TentacleRingBrand: { who: "the pond", name: "tentacle ring" }, MoonPawBrand: { who: "the pack", name: "moon paw" }, SnoutRingBrand: { who: "the boar", name: "snout ring" },
    Mare: { who: "the stable", name: "mare brand" }, Hucow: { who: "the bull", name: "hucow brand" }, Bunny: { who: "the warren", name: "bunny brand" }, Vixen: { who: "the fox den", name: "vixen brand" },
    Ewe: { who: "the ram", name: "ewe brand" }, Doe: { who: "the stag", name: "doe brand" }, Nanny: { who: "the billy goat", name: "nanny brand" }, Dragoness: { who: "the drake", name: "dragoness brand" },
    Kitten: { who: "the cats", name: "kitten brand" }, TheKennelsBrand: { who: "the kennels", name: "kennels' brand" }, Goblins: { who: "the goblins", name: "goblin brand" }, BreedingStock: { who: "the breedin' shed", name: "breeding stock brand" } };
  // who left it, where that isn't the brand's usual beast (the first time's line and the note)
  const KIND_WHO = { werewolf: "the werewolf", sow: "the matron", ponycart: "the stable", minotaur: "the minotaur", lionpride: "the pride", whelping: "the kennels", warband: "the warband", studchair: "the breedin' chair" };
  const TRAP_TAT = { tentacle: "TentacleBred", wolves: "WolfBredPackBitch", werewolf: "WolfBredPackBitch", stallion: "BredMare", warren: "BredLikeARabbit",
    goblinraid: "GoblinLoot", goblinpit: "GoblinLoot", goblinmarket: "GoblinLoot", goblincart: "GoblinLoot", warband: "GoblinLoot",
    hive: "EggLayerCrest", eggs: "EggLayerCrest", clutch: "EggLayerCrest", incubator: "EggLayerCrest", drake: "EggLayerCrest" };
  const TAT_NAME = { TentacleBred: "TENTACLE BRED", WolfBredPackBitch: "PACK BITCH", BredMare: "BRED MARE", BredLikeARabbit: "BRED LIKE A RABBIT", GoblinLoot: "GOBLIN LOOT", EggLayerCrest: "the egg-layer's crest" };
  const TAT_FADE = 24 * 3600000;   // (a trap's ink wears off in a day; ?wash takes it sooner)
  const markName = (d) => (MARK_OF[d] ? MARK_OF[d].name : String(d).replace(/Brand$/, "").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase());
  const markWho = (d) => (MARK_OF[d] ? MARK_OF[d].who : "the farm");
  const MARKS_HELD = 3;   // (three hidden slots on their Companion)
  const noMarks = (mn) => /\b(brand|mark)/i.test((rec(mn) || {}).limits || "");
  // a Companion with the farm's mark slots, and "Farm can ink me" on
  function markable(mn){ const c = state.companions.get(mn); return inkable(mn) && !!(c && verAtLeast(c.ver, "0.63.0")); }
  // ...and with the tattoo slots too (Companion 0.66.0), and no limit on ink or writin'
  function tattable(mn){ const c = state.companions.get(mn); return markable(mn) && !!(c && verAtLeast(c.ver, "0.66.0")) && !/\b(tattoo|ink|writ)/i.test((rec(mn) || {}).limits || ""); }
  const tatsNow = (r) => (Array.isArray(r && r.tats) ? r.tats.filter((x) => x && Date.now() - x.at < TAT_FADE) : []);
  // what goes in their hidden slots (farmInkFor, 10uq2-farm-ink.js): newest last
  function marksInk(mn){
    const r = rec(mn); if (!r) return [];
    const out = Array.isArray(r.marks) && !noMarks(mn) ? r.marks.map((m) => ({ id: "mark:" + m.d + ":" + m.at, slot: "mark", design: m.d, at: m.at, heal: INK_HEAL_MS })) : [];
    // a trap's tattoos, till they've worn off: its words across the chest, a picture on the belly
    const tats = tatsNow(r); if (Array.isArray(r.tats) && tats.length !== r.tats.length) r.tats = tats.length ? tats : null;
    if (tats.length && tattable(mn)) for (const x of tats) out.push({ id: "tat:" + x.d + ":" + x.at, slot: "tat", design: x.d, at: x.at, fade: TAT_FADE, values: x.t ? { t: x.t } : null, color: x.c ? [x.c] : null });
    return out;
  }
  // WORDS A TRAP WRITES ON THEM (the brandin' arm, the sale block, the office stamps, the beasts' scrawl, the pond's
  // mother): in the farm's own ink, across the chest, wearin' off in a day; without the Companion's tattoo slots (or
  // with ink in their limits), the old marker writin'. Gives whether it went on.
  // (the typewriter's a label or a stamp; marker's in the blackletter, the one that still reads that small)
  const WORD_HOW = { neat: { d: "LiveWordsTypewriter", c: "#16121c" }, stamp: { d: "LiveWordsTypewriter", c: "#b3161b" }, marker: { d: "LiveWordsBlackletter", c: "#16121c" },
    red: { d: "LiveWordsBlackletter", c: "#b3161b" }, old: { d: "LiveWordsBlackletter", c: "#2a1630" } };
  function trapWords(mn, words, how, area){
    const r = rec(mn); if (!r) return false;
    const w = String(words || "").toUpperCase().replace(/\s+/g, " ").trim().slice(0, 24), h = WORD_HOW[how] || WORD_HOW.marker; if (!w) return false;
    if (tattable(mn)){
      r.tats = tatsNow(r).filter((x) => !/^LiveWords/.test(x.d)).concat({ d: h.d, at: Date.now(), t: w, c: h.c });
      saveLedger(); syncCompanions(true); return true;
    }
    return bodyMark(mn, { write: { line: w, area: area || "hips" } });
  }
  // a trap's picture tattoo (TRAP_TAT): in place of the last one, wearin' off in a day
  function tatPut(mn, d){ const r = rec(mn); if (!r) return; r.tats = tatsNow(r).filter((x) => /^LiveWords/.test(x.d)).concat({ d, at: Date.now() }); }
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
    Mare: [
      "🐴 Before %n's let out, a stable hand brings the iron over from the forge and holds it to their flank: a horseshoe round MARE, hissin' and red. Stable stock.",
      "🐴 The iron's been heatin' the whole time. When it's done with %n it presses in, slow and firm: MARE, in a horseshoe, seared into their hip.",
      "🐴 %n gets walked out with the stable's brand fresh on their hip, a horseshoe and MARE, stingin' with every step. Broke to harness and branded for it.",
    ],
    Hucow: [
      "🐂 The gate stays shut on %n's neck a moment longer while a hot iron comes down on their hip: HUCOW, steamin' and raised. The bull marks his cows.",
      "🐂 A heavy hand holds %n down and somethin' hot as a coal presses into their hip. When it lifts, HUCOW is burned there under a pair of horns.",
      "🐂 %n is let up with a fresh brand smartin' on their hip: HUCOW, red and raised, the herd's own. Bred, milked and branded.",
    ],
    Bunny: [
      "🐇 The bucks thump the burrow floor like a drumroll, and somethin' hot kisses %n's hip on the way out: a little bunny, burned pink into the skin. The warren's mark.",
      "🐇 %n crawls out of the warren with a sting on their hip and finds a bunny brand there, small and neat and red. They counted. They marked.",
      "🐇 The last buck noses %n's hip and it flares up hot: a bunny's mark, seared in. Every hole in the warren knows them now.",
    ],
    Vixen: [
      "🦊 The fox-brothers send %n off with a nip each and a hot brand on the hip: VIXEN, curled round a brush tail. Theirs to share.",
      "🦊 A sly grin, an iron out of the den's fire, and %n's hip says VIXEN now, red and raised under a fox's tail.",
      "🦊 %n stumbles out of the den teased raw and branded: a vixen's mark, seared on their hip. The brothers keep track of their toys.",
    ],
    Ewe: [
      "🐏 Before the paddock gate opens, the ram's keeper takes a hot iron to %n's hip: EWE, raised and red. Tupped and tallied.",
      "🐏 The ram leans his weight on %n one last time while the iron goes on: EWE, burned in under a curl of horn.",
      "🐏 %n leaves the paddock with the season's brand on their hip, EWE, still smokin' a little. The ram's flock gets bigger.",
    ],
    Doe: [
      "🦌 The stag drags his antlers along %n's hip as he goes, and where the velvet scrapes, the skin burns: DOE, under a crown of tines. The woods' mark.",
      "🦌 %n is left in the leaves with a brand on their hip that wasn't there before: a doe's mark, red and raised. His season, his doe.",
      "🦌 Somethin' hot as a coal follows the stag's last thrust into %n's hip: DOE, seared there for the rest of the rut to see.",
    ],
    Nanny: [
      "🐐 The billy butts %n over one last time and somethin' hot presses into their hip: NANNY, under a pair of little horns. The goat pen's mark.",
      "🐐 %n gets up off their knees with a sting on their hip: NANNY, burned in, raised and red. The billy keeps his mouths marked.",
      "🐐 The goat pen's iron hisses on %n's hip: a nanny's mark. Their jaw aches, and now their hip does too.",
    ],
    Dragoness: [
      "🐉 The drake breathes slow and hot across %n's hip, and the skin sears: DRAGONESS, coiled in a dragon's tail, glowin' red as coals. He marks his nest.",
      "🐉 %n wakes on the nest with a brand on their hip, still warm: a dragon wrapped round DRAGONESS. His hoard, his brood mother.",
      "🐉 One claw, heated in his own breath, traces a mark into %n's hip: DRAGONESS. It glows a while before it settles red.",
    ],
    Kitten: [
      "🐈 A rough tongue, a hot paw pressed to the hip, and %n's marked: KITTEN, with a pair of little ears, burned pink.",
      "🐈 %n gets a last swat on the hip on the way out, and it stings far too much for a paw: KITTEN, seared in. The cats keep what they've had.",
      "🐈 There's a brand on %n's hip when they finally get up, small and pink: a kitten's mark. Somebody's purrin' about it.",
    ],
    TheKennelsBrand: [
      "🐕 The kennel master's iron comes down on %n's hip while they're still tied: the kennels' brand, seared in and smokin'. Kennel bitch, on the books.",
      "🐕 %n is unlatched with a fresh brand on their hip, the kennels' own, red and raised. Every dog in there will know whose they are.",
      "🐕 Before the latch lifts, a hot iron from the kennel stove presses into %n's hip: the kennels' mark. Trained, bred and branded.",
    ],
    Goblins: [
      "👺 The goblins hold %n down, cacklin', and one of 'em burns their mark in with a heated spoon: crude, ugly and very much there. Goblin loot.",
      "👺 %n is let go with a goblin brand scorched into their hip, all crooked lines and a grinnin' face. They'll be back for what's theirs.",
      "👺 A red-hot hoop of iron, a lot of shriekin' laughter, and %n's hip carries the goblins' mark now, raised and angry.",
    ],
    BreedingStock: [
      "🔥 Somethin' clicks, a hot plate swings in and presses %n's hip: BREEDING STOCK, stamped in red. Logged and branded.",
      "🔥 Before it lets %n go, it holds them still for one last thing: the farm's iron, BREEDING STOCK, seared on their hip.",
      "🔥 %n is let up with a fresh brand on their hip, BREEDING STOCK in neat letters, stingin'. That's what the farm calls them now.",
    ],
  };
  // the kinds that share a brand but aren't its usual beast
  const KIND_MARK_LINES = {
    werewolf: [
      "🌕 Under the full moon the werewolf pulls free of %n and bites down on their hip, hard. When the sting fades there's a paw under a moon left there, red and raised.",
      "🌕 Before he lopes off into the trees, the werewolf presses a burnin' paw to %n's hip. A print under a crescent moon, seared in. His.",
    ],
    sow: [
      "🐖 The matron hums and pats %n's hip, then presses somethin' hot there from under her apron: a snout and a ring, burned in. The sty's mark.",
      "🐖 %n wakes from the drowsy nursin' with a brand smartin' on their hip: the snout ring, seared in red. The matron keeps her piglets marked.",
    ],
    warband: [
      "🪓 The warchief's own iron goes on %n's hip before he lets them crawl out of the tent: the warband's mark. Tribute, paid in full.",
      "🪓 The orcs roar as the brand goes on: a hot iron to %n's hip, the warband's tally. Spoils of war.",
    ],
  };
  const TAT_LINES = {
    TentacleBred: [
      "🐙 There's ink on %n's belly when they drag themself out of the water: TENTACLE BRED, curlin' letters that weren't there before. It'll wear off in a day. Probably.",
      "🐙 Somethin' in the pond leaves its words on %n as well: TENTACLE BRED, inked dark across their belly, slick and still wet.",
      "🐙 %n finds TENTACLE BRED written on their belly in the pond's own ink, with a little tentacle curled round it.",
    ],
    WolfBredPackBitch: [
      "🐺 Somebody's got a marker: PACK BITCH scrawled on %n's belly, with a wolf's head over it. It'll wash off in a day or so.",
      "🐺 %n is let go with WOLF BRED PACK BITCH inked across their belly, and a howl of laughter behind them.",
      "🐺 The wolves sign their work: PACK BITCH, in black ink across %n's belly.",
    ],
    BredMare: [
      "🐴 BRED MARE, inked on %n's belly in neat stable letterin', with a little horseshoe. It'll wear off in a day.",
      "🐴 Somebody at the stable takes a pen to %n before they're let go: BRED MARE, across their belly. Stud's work, signed for.",
      "🐴 %n finds BRED MARE written on their belly in stable ink. The stud book says the same.",
    ],
    BredLikeARabbit: [
      "🐇 BRED LIKE A RABBIT, in pink, right across %n's belly. The bucks' little joke. Gone in a day.",
      "🐇 The warren signs off on %n in pink ink: BRED LIKE A RABBIT, with a little tally of bucks underneath.",
      "🐇 %n crawls out of the burrow with BRED LIKE A RABBIT written on their belly. Every word of it's true.",
    ],
    GoblinLoot: [
      "👺 The goblins scrawl on %n before they let 'em go: GOBLIN LOOT, with a crude little coin. It'll fade in a day.",
      "👺 GOBLIN LOOT, in smudgy goblin ink, right across %n's belly. Somebody's drawn a lot of little hearts round it.",
      "👺 %n's been labelled like any other haul: GOBLIN LOOT, inked across their belly in a wobbly hand.",
    ],
    EggLayerCrest: [
      "🥚 A crest blooms on %n's belly where the eggs went in, glowin' faint pink: the egg-layer's mark. It fades in a day.",
      "🥚 %n's belly tingles, and a pink crest draws itself across it, curlin' round where the clutch sits. Egg layer.",
      "🥚 Low on %n's belly a glowin' crest rises up out of the skin, pretty and pink and very obvious: there's a clutch in there.",
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
    // the beast's brand (not when they wear that one as their own brand already)
    const d = TRAP_MARK[kind], who = KIND_WHO[kind] || (d ? markWho(d) : "the farm");
    const branded = !!(d && markable(mn) && !noMarks(mn) && !(r.brand && r.brand.ink === d));
    const had = branded && (r.marks || []).find((m) => m.d === d);
    if (branded) r.marks = (r.marks || []).filter((m) => m.d !== d).concat({ d, at: Date.now(), keep: had && had.keep ? 1 : 0 }).slice(-MARKS_HELD);
    // ...and the big breeders' tattoo, on the belly, for a day
    const tat = TRAP_TAT[kind] && tattable(mn) ? TRAP_TAT[kind] : null, tatFirst = !!(tat && !(r.tatSeen && r.tatSeen[tat]));
    if (tat){ tatPut(mn, tat); if (tatFirst) r.tatSeen = Object.assign({}, r.tatSeen, { [tat]: 1 }); }
    saveLedger(); if (branded || tat) syncCompanions(true);
    if (branded) later(() => {
      if (!charFor(mn)) return;
      const pool = had ? MARK_AGAIN : (KIND_MARK_LINES[kind] || MARK_LINES[d]);
      emote(markFill(pickFresh("mark:" + (had ? "again" : KIND_MARK_LINES[kind] ? kind : d), pool), mn, d), mn);
      if (!had) tell(mn, "🔥 " + who.replace(/^./, (x) => x.toUpperCase()) + " left its mark on you: the " + markName(d) + ", on your skin under your clothes, for everybody with the Companion to see. It heals pale over three days. ?wash scrubs it off, unless it's seared on for good (?marks keep does that).");
    }, 6000);
    if (tat) later(() => {
      if (!charFor(mn)) return;
      emote(pickFresh("tat:" + tat, TAT_LINES[tat]).replace(/%n/g, plainName(mn)), mn);
      if (tatFirst) tell(mn, "🖋️ " + who.replace(/^./, (x) => x.toUpperCase()) + " left its ink on you too: " + TAT_NAME[tat] + ", on your belly, for everybody with the Companion to see. It wears off in a day; ?wash scrubs it off sooner.");
    }, branded ? 11000 : 6000);
  }
  // ?wash: the farm's marks scrubbed off, except the ones seared on for good. Gives the ones that came off, and the kept.
  function marksWash(mn){
    const r = rec(mn); if (!r) return { off: [], kept: [], tats: 0 };
    const tats = tatsNow(r).length; r.tats = null;   // (a trap's ink: always scrubs off)
    if (!Array.isArray(r.marks) || !r.marks.length) return { off: [], kept: [], tats };
    const off = r.marks.filter((m) => !m.keep).map((m) => m.d), kept = r.marks.filter((m) => m.keep).map((m) => m.d);
    r.marks = kept.length ? r.marks.filter((m) => m.keep) : null;
    return { off, kept, tats };
  }
  const WASH_TAT_OFF = [
    "🚿 The ink the traps left on %n comes off with the soap, letters and all.",
    "🚿 A good hard scrub, and the traps' ink on %n runs grey and rinses away down the drain.",
  ];
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
    if (w && w.tats) out.push(pickFresh("tat:wash", WASH_TAT_OFF).replace(/%n/g, plainName(mn)));
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
    if (!marks.length){ R((t === by ? "You've" : plainName(t) + " has") + " none of the farm's marks to keep, sugar. The beasts in the traps leave theirs, with \"Farm can ink me\" on."); return; }
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
  function marksClear(mn){ const r = rec(mn); const n = (r && Array.isArray(r.marks) ? r.marks.length : 0) + tatsNow(r).length; if (r){ r.marks = null; r.tats = null; } return n; }
  // a trap's tattoo, by name (its words, or the picture's name)
  const tatLabel = (x) => (x.t ? x.t : TAT_NAME[x.d] || x.d);
  const tatLeft = (x) => { const h = Math.max(1, Math.round((x.at + TAT_FADE - Date.now()) / 3600000)); return h + (h === 1 ? " hour" : " hours"); };
  // the right-now strip (10x-trap-extras.js aftermathOf)
  function marksNow(mn){ const r = rec(mn); return (r && Array.isArray(r.marks) ? r.marks.map((m) => ({ icon: "🔥", text: markWho(m.d).replace(/^./, (x) => x.toUpperCase()) + "'s mark" + (m.keep ? ", for good" : "") })) : [])
    .concat(tatsNow(r).map((x) => ({ icon: "🖋️", text: tatLabel(x) + " (wears off in " + tatLeft(x) + ")" }))); }
  // ?marks: the farm's marks on you · ?marks keep: yours, on for good (?brand is staff's, so this is yours)
  function marksCommand(sender, args, R){
    const r = rec(sender), marks = r && Array.isArray(r.marks) ? r.marks : [], tats = tatsNow(r);
    if (/^keep$/i.test(args[0] || "")){ brandKeep(sender, sender, R); return; }
    const inked = tats.length ? " 🖋️ The traps' ink on you: " + tats.map((x) => tatLabel(x) + " (wears off in " + tatLeft(x) + ")").join(", ") + ". ?wash scrubs it off sooner." : "";
    if (!marks.length){ R((tats.length ? "None of the farm's brands on you, sugar." : "You've none of the farm's marks on you, sugar. The beasts in the traps leave theirs, with \"Farm can ink me\" on in your Companion.") + inked); return; }
    R("🔥 The farm's marks on you: " + marks.map((m) => "the " + markName(m.d) + " (" + markWho(m.d) + "'s" + (m.keep ? ", on for good" : ", ?wash scrubs it off") + ")").join(", ") + "." +
      (marks.some((m) => !m.keep) ? " ?marks keep sears yours on for good." : "") + inked);
  }
  addCommand("marks", { topic: "milk", run: (c) => marksCommand(c.sender, c.args, c.R) });
  if (W.__FARMHAND_TEST__) Object.assign(W, { __trophies: TROPHIES, __stampOf: (s, k) => stampOf(s, k), __trapMarkAfter: (m, k) => trapMarkAfter(m, k), __trapWords: (m, w, h) => trapWords(m, w, h), __marksInk: (m) => marksInk(m), __trapMarkSets: () => ({ TRAP_MARK, TRAP_TAT, MARK_LINES, KIND_MARK_LINES, TAT_LINES }) });
