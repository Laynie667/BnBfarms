  /* WHAT'S IN THIS FILE (10z7-nipple-traps.js)
     TITS THAT CAN BE FUCKED, AND THE TRAPS KNOW IT (Laynie, Nov 19: "since tits are fuckable via nipple, some traps
     should use it. like knotting in them, eggs in them, etc."; then, to the list: "all of them, and more, like the kraken").
     • Whose are open: their Dispensary says so to the room (dispNips { n }) and in its hello (nips). Open, traps on, and
       nothin' about nipples in their ?limits ("nipples", "nips", "tit fuck"): the traps use them. A line tagged {np} is
       only for somebody whose are open, {nn} only for somebody whose aren't (10y9d-body-fit.js).
     • What a trap does with them, by its kind:
         knotted   a canine stud (the wolves, the werewolf, the fox den, the kennel, the whelpin' box…): the knot goes in
                   a nipple, they're tied by the tit a few minutes past the end, and the load's in their breast
         eggs      the egg post, the clutch, the hive, the drake, the naga: part of the clutch goes in the tits. They sit a
                   cup or two bigger till the eggs come out, pushed out the nipples when they're milked, or on their own
                   in a day or so. (The thing in the water does it half the time.)
         tendrils  the thing in the water, the vines, the slime: a tendril in each nipple, pumpin' them full
         goblins   the raid, the pit, the cart, the market: they fight over who gets a tit
         held      the stocks, the pillory, the wall, the kiss gate, the booth, the leash post: passers-by use them too
         the pump  pumps the tits full through the nipples: a cup or two bigger for a couple of hours
         milkers   the milker, the cups, the teat check, the milkin' hole: shut nipples come out open (through their
                   Dispensary's Nipple Dilator: its switch and their list decide), open ones get fucked by the cups, and
                   now and then there are leeches in the cups (their Dispensary's parasite switch decides)
         any other breedin' trap: a load in a tit now and then (NIP_TRAP_CHANCE)
       Every load in a tit is on my books (loads in the tits) and comes back out creamy with the milk. Every fuckin'
       trains them wider: their Dispensary's told (dispNipsUsed).
     • THE KRAKEN: a new thing in the water, rare. Every hole at once and both nipples, opened for it if they're shut,
       eggs in the belly and the tits, and KRAKEN BAIT written on them after.
     • Anything that only happens with open nipples needs them open at the end too: if their Dispensary wouldn't open
       them, nothin' is booked.
  */
  if (CFG.NIP_TRAP_CHANCE === undefined) CFG.NIP_TRAP_CHANCE = 0.35;   // an ordinary breedin' trap: a load in a tit this often
  if (CFG.NIP_LEECH_CHANCE === undefined) CFG.NIP_LEECH_CHANCE = 0.25; // leeches waitin' in the milkin' cups
  if (!CFG.TIT_EGGS) CFG.TIT_EGGS = { MIN: 2, MAX: 6, MOST: 16, LAY_H: [18, 36] };
  if (!CFG.TIT_PUMP) CFG.TIT_PUMP = { H: 2, CUPS: 2 };
  if (CFG.TIT_KNOT_MIN === undefined) CFG.TIT_KNOT_MIN = 3;            // tied by the tit this much past the end
  LIMIT_WORDS.nips = /\b(nipples?|nips?|tit ?fuck\w*|titty ?fuck\w*)\b/i;

  // ── whose are open ──
  const nipsSeen = () => state.nipsSeen || (state.nipsSeen = new Map());
  function nipsHeard(mn, n){
    n = Math.max(0, Math.min(3, Math.round(Number(n) || 0)));
    if (n) nipsSeen().set(mn, { n, at: Date.now() }); else nipsSeen().delete(mn);
  }
  function nipsOpenOf(mn){ const e = nipsSeen().get(mn); return e && Date.now() - e.at < 6*3600000 && charFor(mn) ? e.n : 0; }
  function nipsUsable(mn){ try { return nipsOpenOf(mn) > 0 && !limitBlocks(mn, "nips"); } catch(e){ return false; } }
  // can the farm open them? (verAtLeast: 07-send.js) Their Dispensary (new enough to open them quietly), the farm on their list, the Dilator on
  function nipsCanOpen(mn){ const d = dispFor(mn); return !!(d && d.farm && !d.off.includes("dilator") && verAtLeast(d.ver, "0.24.0") && !limitBlocks(mn, "nips")); }
  function nipsFarmOpen(mn, n){ enqueue(makeMsg("dispNipsOpen", { n: Math.max(1, Math.min(3, n || 2)), quiet: true }, mn), true); }
  function nipsFarmUsed(mn, n){ if (dispFor(mn)) enqueue(makeMsg("dispNipsUsed", { n: Math.max(1, Math.min(8, Math.round(n))) }, mn)); }
  function nipLoad(mn, by, n){ for (let i = 0; i < (n || 1); i++) onNipLoad(mn, { by }); }

  // ── what kind of nipple play a trap has ──
  const NIP_KIND = { eggs: "eggs", clutch: "eggs", hive: "eggs", drake: "eggs", naga: "eggs", tentacle: "tendril", vines: "tendril", slime: "tendril",
    goblinraid: "goblin", goblinpit: "goblin", goblincart: "goblin", goblinmarket: "goblin",
    stocks: "held", pillory: "held", wall: "held", kissgate: "held", booth: "held", leashpost: "held",
    pump: "pump", milker: "milk", cups: "milk", teatcheck: "milk", milkinghole: "milk" };
  function nipKindOf(kind){
    if (NIP_KIND[kind]) return NIP_KIND[kind];
    const A = ANTHRO[kind], T = A && CFG.PENIS_TYPES[A.type];
    if (A && A.eggs) return "eggs";
    if (T && T.knot) return "knot";
    if ((DEPTH_KIND[kind] || []).includes("breed")) return "breed";
    return null;
  }
  const NIP_USES = { knot: 2, eggs: 2, tendril: 3, goblin: 4, held: 3, pump: 1, milk: 2, breed: 1, kraken: 5 };

  // ── the lines (hot, the farm's voice; %n their name, %x how many) ──
  const NIP_LINES = {
    knotIn: [
      "He drags out of %n and noses at their chest instead, and then he's pushin' into one of their open nipples, slow and thick, stretchin' it round him till %n's sobbin' with it.",
      "A canine cock nudges one of %n's open nipples, slick and pointed, and slides right in, and the whole breast swells round it as he starts to rut.",
      "{t}%n's tit is hauled up and held, and he fucks the nipple like it was made for him, short hard thrusts, his knot slappin' against the soft swell of it.",
      "He mounts %n's chest the way he'd mount anythin' else, and their nipple opens for him, wet and hungry, every inch of him sinkin' into their breast.",
      "%n gasps as he works his cock into their gapin' nipple, and keeps on workin' it, deeper than a nipple ought to go, till his knot's pressin' at the rim.",
    ],
    knotTie: [
      "The knot swells and shoves, and %n's nipple gives round it with a wet pop. He's locked in their tit now, and he's not goin' anywhere. Neither are they.",
      "He ties in %n's nipple. The knot balloons inside their breast, and then he's pumpin', and %n can feel their tit fill up, hot and heavy and tight.",
      "{t}Tied by the tit. %n's breast is stretched round the knot, swellin' with every pulse of him, and every little tug pulls a whimper out of them.",
      "The knot pops in and locks, and %n's nipple is sealed round it. He grinds, and fills them, and fills them, and the breast goes round and taut with his load.",
      "%n's caught by the nipple, his knot fat inside them, his seed floodin' in with nowhere to go. They'll be stuck like this a while.",
    ],
    eggs: [
      "Somethin' slick and ridged finds %n's open nipples, one each, and pushes in, and then %n feels the first egg comin', a round hard bulge squeezin' up into their breast.",
      "{t}The ovipositor slides into %n's nipple and swells, and an egg pops through the stretched rim and settles deep in their tit. Then another. Their breast rounds out round them.",
      "%n's nipples are stuffed one after the other, eggs pushed up into their chest till both breasts are heavy and lumpy and achin' full.",
      "Egg after egg goes into %n's nipples, each one a hard stretch and a pop and a warm round weight settlin' inside. %n can feel them clickin' together in there.",
      "It doesn't only lay low. It finds %n's gapin' nipples too, and fills them, a clutch in each breast, till their chest sits high and swollen and tight as a drum.",
    ],
    tendril: [
      "A thin tendril finds each of %n's open nipples and slips inside, and then both of them swell at once, and start to pump.",
      "Slick tips curl into %n's nipples and wriggle deep, and %n can feel them movin' inside their breasts, stirrin', stretchin', fillin'.",
      "{t}Two tendrils fuck %n's tits from the inside, in and out of the nipples in turn, and warm slick runs down the curve of each breast.",
      "Somethin' fat pushes into %n's nipple and pumps, and their chest swells with it, warm and slick, till it's leakin' back out round the tendril.",
      "Every open hole gets filled, and %n's nipples count. A tendril in each, pulsin', pumpin' them full.",
    ],
    goblin: [
      "There's more goblins than holes, so they make do: two of them find %n's open nipples and squabble over who's first, then don't bother waitin'.",
      "{t}A goblin climbs right up onto %n's chest, grabs a tit in each greedy hand, and fucks the nipple, cacklin', while the rest take the other holes.",
      "The little ones have found %n's nipples. They take turns, one in each, quick and greedy, and every one of them cums in there before he's shoved aside.",
      "%n's nipples are passed round the goblins like a prize. Every one's got a goblin in it, and a queue behind him.",
      "Somebody shouts about the open nipples and the whole pack piles on. %n's chest is fucked raw and stuffed full, and nobody bothers to wipe it.",
    ],
    held: [
      "Stuck where they are, %n can't do a thing when a passer-by stops, looks at their open nipples, and decides to use one.",
      "{t}Somebody walkin' past cups one of %n's tits, thumbs the gapin' nipple, and slides right in. %n can't even see who it is.",
      "%n's held still, chest out, nipples open, and the farm treats that like an invitation. One after another, they're used.",
      "A stranger fucks %n's nipple while they're stuck, slow and leisurely, like they've got all day, and leaves it drippin' when they go.",
      "Word gets round that %n's nipples are open for business. A little line forms. Every one of them takes a turn.",
    ],
    pump: [
      "The pump's nozzle finds a nipple instead, slides in snug, and starts to push. %n's breast swells, and swells, round and heavy and tight.",
      "{t}It pumps %n's tits full through their open nipples, one then the other, till they're sittin' high and taut and shiny, a cup bigger, then two.",
      "%n watches their own chest grow, the pump hissin' away in their nipple, fillin' them till the skin's stretched glossy.",
      "Warm and thick, it floods into %n's chest through the gapin' nipples, and they go heavy as a full udder.",
      "The pump doesn't care which hole. %n's nipples take it as well as anywhere, and their chest balloons with every stroke.",
    ],
    milk: [
      "The cups close over %n's nipples, and somethin' inside them pushes in, slim and slick, and starts to milk them from the inside.",
      "{t}A little probe in each cup slides deep into %n's open nipples and pulses, and the milk comes in long helpless gushes.",
      "The milker knows an open nipple when it finds one. It sucks, then thrusts, then sucks, and %n's tits are fucked and milked at once.",
      "%n's nipples are so open the cups pull them right inside, and somethin' in there fucks them in time with the pump.",
      "Every pull of the cups drags %n's nipples open wider, and every push fills them, and %n can't tell bein' milked from bein' fucked any more.",
    ],
    milkOpen: [
      "The cups fit tight over %n's nipples and start to stretch. Not to suck: to stretch, slow and steady, till the nipples part and keep on partin'.",
      "{t}Somethin' in the cups works into %n's nipples, spreadin' them, wider and wider, and when the cups let go %n's nipples stay open, wet and gapin'.",
      "The milker gives %n's nipples a long, hard, patient pull, and somethin' inside them gives. They're open now, and they're goin' to stay that way.",
      "%n squirms as the cups open their nipples up, a warm achin' stretch, and then drink from the new holes like they've always been there.",
      "The machine decides %n's nipples are too tight to be any use, and fixes that. They come out of the cups gapin', puffy, and ready to be fucked.",
    ],
    breed: [
      "Halfway through, the stud pulls out of %n and finds one of their open nipples instead, and empties right into their breast.",
      "{t}One load goes somewhere else: straight into %n's gapin' nipple, till the tit swells and the cum wells back out.",
      "%n's nipple gets fucked too, just once, quick and greedy, and left full and drippin'.",
      "Somebody notices %n's open nipples and can't resist. A thick load goes into their chest, and it'll come back out with the milk.",
      "Their nipple's open, so it gets used. A few hard thrusts, a groan, and %n's breast is full of cum.",
    ],
    krakenIn: [
      "The kraken finds %n's nipples with two of its smallest arms, and pushes in, and keeps pushin', till %n can feel it curlin' round inside their breasts.",
      "{t}Two suckered arms fasten over %n's tits, and from the middle of each a slim tip worms into the nipple, deep, and then it starts to swell.",
      "No hole on %n is left empty, not even their nipples. The kraken threads an arm into each one, slow and thorough, like it's fillin' the last gaps in a puzzle.",
      "%n's nipples are spread wide round two writhin' arms, and the kraken fucks them in time with everythin' else it's got in them.",
    ],
    krakenOpen: [
      "%n's nipples are shut. The kraken doesn't care. A tip presses to each one and squeezes, and squeezes, till they part round it, wide and gapin', and then it slides in.",
      "{t}Suckers close over %n's tits and pull, and pull, till the nipples give and open for it, and two slim arms push straight into the new holes.",
      "It finds every way into %n, and makes two more: their nipples stretched open round its arms, wider than they've ever been.",
    ],
    krakenEggs: [
      "The arms in %n's nipples bulge, and eggs come up them, one by one, poppin' into %n's breasts till they're heavy and lumpy and tight.",
      "{t}The kraken lays in %n's tits as well as their belly, egg after egg squeezed through the nipple, till their breasts are swollen huge and leakin'.",
      "%n is full everywhere: belly, holes, mouth, and now both breasts, the kraken's eggs packed into every space it could find.",
      "It pumps %n's chest full of thick warm slick first, then eggs into it, and %n's breasts sit swollen and sloshin' when it's done.",
    ],
    krakenFill: [
      "The arms in %n's nipples pump, thick and warm, till their breasts are swollen and sloshin' and leakin' round every sucker.",
      "{t}The kraken fills %n's tits right up through the nipples, the way it fills everythin' else, till they're tight and heavy and drippin'.",
    ],
    // after, to the room
    knotFree: [
      "🐾 The knot in %n's nipple finally goes down, and it slides out with a wet pop and a gush of cum down the curve of their chest.",
      "🐾 %n's nipple lets go of the knot at last. It comes free, and a long thick string of seed runs out after it.",
      "🐾 Untied at last. %n's nipple gapes where the knot was, and the load it held in comes runnin' out.",
    ],
    milked: [
      "🥚 The first squeeze brings somethin' other than milk: an egg, slick and round, pushes out of %n's nipple and drops into the pail. Then another. %x in all.",
      "🥚 %n's milkin' turns into a layin'. Every pull drags an egg out of their stretched nipples, %x of them, each one with a gasp.",
      "🥚 Eggs come out of %n's tits with the milk, pop after wet pop, %x of them rollin' in the pail, and %n's chest sags soft and empty after.",
    ],
    self: [
      "🥚 %n's breasts have been heavy and lumpy for a day, and now they're done: an egg crowns at each nipple and slides out, then more, %x in all.",
      "🥚 %n clutches their chest as their tits start to lay. Egg after egg pushes out through their stretched nipples, %x of them, and they can't stop it.",
      "🥚 Somethin' gives in %n's breasts, and the eggs come, out of both nipples, slick and warm, %x of them in a little pile in %n's lap.",
    ],
  };
  // how long and whose, for the tells
  const NIP_TELL = {
    knot: "🐾 Tied by the tit, sugar. You're stuck till that knot goes down, and his load's in your breast now: it'll come out with your milk.",
    eggs: "🥚 Part of that clutch went in your tits: %x eggs. They'll sit heavy a day or so, and they'll come out your nipples when you're milked, or on their own.",
    tendril: "Both your nipples got filled, sugar. It'll come back out with your milk.",
    goblin: "🧌 The goblins left %x loads in your nipples. They'll come out with your milk.",
    held: "While you were stuck, anybody passin' could use your nipples, and they did. Folks in the room can use Fuck nipple on you any time you're held like that.",
    pump: "🎈 Your tits are pumped full, a couple of cups bigger, for a couple of hours.",
    milkOpen: "Those cups opened your nipples, sugar, and they'll stay open a while.",
    kraken: "🐙 The kraken had your nipples too: %x eggs in your tits, and they'll come out your nipples when you're milked, or on their own.",
  };

  // ── the beats: added to a trap's story before its last (trapRun, 10u-traps.js) ──
  function nipBeats(mn, kind, beats, v){
    const plans = state.nipPlan || (state.nipPlan = new Map()); plans.delete(mn);
    try {
      if (!Array.isArray(beats) || beats.length < 2 || !isSubject(mn) || limitBlocks(mn, "nips")) return beats;
      const k = v && v.kraken ? "kraken" : nipKindOf(kind); if (!k) return beats;
      const open = nipsOpenOf(mn) > 0, plan = { k, kind, open, n: NIP_USES[k] || 1 };
      if (!open){
        if ((k !== "milk" && k !== "kraken") || !nipsCanOpen(mn)) return beats;   // shut: only the milkers and the kraken open them
        plan.opening = true;
      } else if (k === "breed" && Math.random() >= CFG.NIP_TRAP_CHANCE) return beats;
      plan.eggs = (k === "eggs" || k === "kraken" || (kind === "tentacle" && Math.random() < 0.5)) && !limitBlocks(mn, "eggs");
      const add = k === "knot" ? [NIP_LINES.knotIn, NIP_LINES.knotTie]
        : k === "kraken" ? [plan.opening ? NIP_LINES.krakenOpen : NIP_LINES.krakenIn, plan.eggs ? NIP_LINES.krakenEggs : NIP_LINES.krakenFill]
        : k === "milk" ? [plan.opening ? NIP_LINES.milkOpen : NIP_LINES.milk]
        : k === "tendril" && plan.eggs ? [NIP_LINES.tendril, NIP_LINES.eggs]
        : [NIP_LINES[k]];
      if (plan.opening){ plan.n = 1; nipsFarmOpen(mn, k === "kraken" ? 3 : 2); }   // (opened now, so it's open by the next beat)
      plans.set(mn, plan);
      const out = beats.slice(); out.splice(out.length - 1, 0, ...add);
      return out;
    } catch(e){ warn("nipple beats:", e); return beats; }
  }
  // ── what it leaves: after the trap's let go (trapRun, after it frees them) ──
  function nipTrapAfter(mn, kind){
    const plans = state.nipPlan, plan = plans && plans.get(mn); if (!plan) return;
    plans.delete(mn);
    const r = rec(mn), p = prodOf(mn); if (!r || !p || !charFor(mn)) return;
    if (!nipsOpenOf(mn)) return;   // (their Dispensary wouldn't open them after all: nothin' happened to them)
    const A = ANTHRO[kind], by = (A && A.sire) || (kind === "tentacle" ? TENTACLE_SIRE : kind === "eggs" ? POST_SIRE : 0), x = {};
    switch (plan.k){
      case "knot": {
        nipLoad(mn, by, 1); p.totals.tied = (p.totals.tied || 0) + 1;
        trapHold(mn, CFG.TIT_KNOT_MIN, "tied by the tit");
        const hold = tmin(mn, CFG.TIT_KNOT_MIN) * 60000;
        later(() => { try { if (charFor(mn)) emote(tFill(pickFor(mn, "nip:knotfree", NIP_LINES.knotFree), mn), mn); } catch(e){} }, hold);
        tell(mn, NIP_TELL.knot);
        break;
      }
      case "goblin": { const n = 2 + Math.floor(Math.random()*3); nipLoad(mn, by, n); x.x = String(n); tell(mn, tFill(NIP_TELL.goblin, mn, x)); break; }
      case "tendril": nipLoad(mn, by, 1); if (!plan.eggs) tell(mn, NIP_TELL.tendril); bodyMark(mn, { splat: ["chest"] }); break;
      case "held": nipLoad(mn, 0, 1 + Math.floor(Math.random()*2)); tell(mn, NIP_TELL.held); break;
      case "pump": titPump(mn); tell(mn, NIP_TELL.pump); break;
      case "milk": if (plan.opening) tell(mn, NIP_TELL.milkOpen); if (dispFor(mn) && Math.random() < CFG.NIP_LEECH_CHANCE) enqueue(makeMsg("dispLatch", { kind: "nips", name: "The barn" }, mn)); break;
      case "breed": nipLoad(mn, by, 1); break;
      case "kraken": nipLoad(mn, TENTACLE_SIRE, 2); break;
    }
    if (plan.eggs){
      const [lo, hi] = [CFG.TIT_EGGS.MIN, CFG.TIT_EGGS.MAX], n = titEggs(mn, (lo + Math.floor(Math.random()*(hi - lo + 1))) * (plan.k === "kraken" ? 2 : 1), plan.k === "kraken" ? TENTACLE_SIRE : by);
      x.x = String(n);
      tell(mn, tFill(plan.k === "kraken" ? NIP_TELL.kraken : NIP_TELL.eggs, mn, x));
    }
    nipsFarmUsed(mn, plan.n);
    audit(BOTMN(), "NIPTRAP", mn+" "+kind+" "+plan.k);
    saveLedger(); syncCompanions(true);
  }

  // ── eggs in the tits, and tits pumped full ──
  function titEggs(mn, n, by){
    const p = prodOf(mn), [a, b] = CFG.TIT_EGGS.LAY_H;
    n = Math.max(1, Math.round(n));
    if (p.titEggs) p.titEggs.n = Math.min(CFG.TIT_EGGS.MOST, p.titEggs.n + n);
    else p.titEggs = { n: Math.min(CFG.TIT_EGGS.MOST, n), by, since: Date.now(), layAt: Date.now() + (a + Math.random()*(b - a))*3600000 };
    return p.titEggs.n;
  }
  function titPump(mn){ const p = prodOf(mn); p.titPump = { until: Date.now() + CFG.TIT_PUMP.H*3600000 }; }
  // how many cups bigger they're drawn (the Companion's drawn body: 07b-companion-sync.js)
  function titCups(mn){
    const p = prodOf(mn); if (!p) return 0;
    return (p.titEggs ? (p.titEggs.n >= 8 ? 2 : 1) : 0) + (p.titPump && p.titPump.until > Date.now() ? CFG.TIT_PUMP.CUPS : 0);
  }
  // out they come: when they're milked (08-production.js drainMilk), on their own when they're ready, or quietly if they're
  // long overdue and away
  function titEggsOut(mn, how){
    const p = prodOf(mn), e = p && p.titEggs; if (!e) return 0;
    p.titEggs = null;
    p.offspring = p.offspring || {}; p.offspring.eggs = (p.offspring.eggs || 0) + e.n;
    p.totals.titEggs = (p.totals.titEggs || 0) + e.n;
    if (how !== "away" && charFor(mn)) emote(tFill(pickFor(mn, "nip:eggs:"+how, NIP_LINES[how] || NIP_LINES.self), mn, { x: String(e.n) }), mn);
    saveLedger(); syncCompanions(true);
    return e.n;
  }
  // every few seconds, from prodTick (08-production.js)
  function titTick(mn, p, now){
    if (p.titPump && p.titPump.until <= now){ p.titPump = null; if (charFor(mn)) tell(mn, "🎈 Your tits ease back down, sugar. Whatever was pumped into them has worked its way out."); saveLedger(); syncCompanions(true); }
    const e = p.titEggs; if (!e || now < e.layAt) return;
    if (charFor(mn) && !(state.trapRuns && state.trapRuns.get(mn))) titEggsOut(mn, "self");
    else if (!charFor(mn) && now - e.layAt > 24*3600000) titEggsOut(mn, "away");
  }

  // ── a trap's state beat (10z4-trap-state.js): open nipples, eggs in them, pumped full ──
  Object.assign(STATE_BEAT_W, { nipsOpen: 4, titEggs: 5, titPump: 3 });
  Object.assign(STATE_BEAT, {
    nipsOpen: {
      any: [
        "%n's nipples are standin' open, puffy and wet, and every time %w jolts them they twitch like they're askin' for somethin'.",
        "Cool air on %n's open nipples has them achin'. Nothin's in them yet. Everythin' here can see that they could be.",
        "{t}%n's tits sway with every shove, nipples gapin', little dark holes that won't close, and everyone watchin' knows what they're for.",
      ],
      breed: [
        "Every thrust rocks %n forward and their open nipples drag and catch, and %n moans at how empty they feel.",
        "{t}%n's tits bounce with it, and their stretched nipples drip, still slick from the last time somebody used them.",
      ],
      milk: [
        "The cups seal over %n's open nipples and pull them wide, and %n can feel the suck all the way inside their breasts.",
        "Milk doesn't so much come out of %n's open nipples as pour, nothin' holdin' it back any more.",
      ],
      held: [
        "Held like this, chest out, %n's open nipples are right there for anybody, and anybody could.",
        "{t}%n can't cover their tits, can't close their nipples, can't do a thing about the folks stoppin' to look.",
      ],
      watched: [
        "Somebody in the crowd points at %n's open nipples, and a murmur goes round. %n goes pink to their ears.",
      ],
    },
    titEggs: {
      any: [
        "{t}%n's tits are heavy and lumpy with the eggs in them, and every jolt makes them click and shift inside.",
        "The eggs in %n's breasts press against their nipples with every movement, like they're waitin' to be let out.",
        "%n's chest aches, full and tight, the clutch in their breasts sittin' heavy and warm.",
      ],
      milk: [
        "Every pull on %n's nipples drags an egg a little nearer the rim. %n can feel it, round and hard, right at the edge.",
      ],
    },
    titPump: {
      any: [
        "{t}%n's pumped-up tits sit high and tight and shiny, and every bounce sloshes.",
        "%n's chest is still swollen from the pump, heavy and taut, and it aches sweet every time it's touched.",
      ],
    },
  });

  // ── the kraken: a new thing in the water (10y9r-water-beast.js) ──
  WATER_FORMS.kraken = { name: "the kraken", w: 6, hold: 12, eggsX: 2, fillX: 2, hyperX: 2,
    tell: "You're kraken bait now, sugar, and you'll be slow for days.",
    start: (mn, v) => { v.kraken = 1; },
    after: (mn) => { later(() => { try { trapWords(mn, "KRAKEN BAIT", "old", ["waist", "hips", "chest"][Math.floor(Math.random()*3)]); } catch(e){} }, 3000); face(mn, "afterglow", 300); },
    lines: {
      grab: [
        "The whole pond heaves. Somethin' vast rises under %n, and arms as thick as their waist come up out of the water on every side, and close.",
        "%n's ankles are taken first, then their thighs, their waist, their wrists, by arms that just keep comin' out of the deep, more of them than anythin' should have.",
        "The water goes dark and still. Then a single huge eye opens under the surface, lookin' right at %n, and the arms come for them.",
        "%n's dragged off their feet and lifted clean out of the pond, held up in the air by the kraken, dozens of suckered arms wrapped round every part of them.",
      ],
      take: [
        "It takes %n's %h with an arm as thick as a forearm and twice as long, and doesn't stop till %n's belly bulges round it.",
        "Everythin' at once: an arm in %n's %h, one in their ass, one in their mouth, all of them pushin' deeper together like they've done this a thousand times.",
        "The kraken spreads %n open in the air and fills their %h slow, thick, relentless, and the suckers along it kiss every inch inside them.",
      ],
      sig: [
        "It squeezes. Every arm round %n tightens at once and every arm inside them swells, and %n can't breathe, can't think, can't do anythin' but be full.",
        "The kraken rocks %n in the air, gentle as a cradle, fuckin' every hole in time, and the whole pond sloshes with it.",
        "Smaller arms come up off the big ones, dozens of them, and every one finds somewhere on %n to suck or stroke or fill.",
      ],
      swell: [
        "Eggs the size of fists start up the arm in %n's %h, one bulge after another, and every one of them goes in.",
        "The kraken lays, every arm inside %n pumpin' eggs at once, and %n's belly swells so fast they can watch it.",
        "%n feels the first of the kraken's eggs: huge and round and heavy, stretchin' them wide as it drops in. Then a dozen more.",
      ],
      end: [
        "The kraken lowers %n to the bank like somethin' it's proud of, %x eggs in their %h, every hole gapin' and leakin', and slides back down into the dark.",
        "%x eggs. %n lies in the shallows where it dropped them, belly huge, holes ruined, and the pond goes still again like nothin' was ever there.",
        "It lets go of %n one arm at a time, slow, till they slump on the bank with %x of its eggs inside them. They're kraken bait now, and they'll know it for days.",
      ],
      endHyper: [
        "%x eggs. The kraken packs %n till they can't move, their belly round and hard as a barrel, and has to carry them up the bank itself.",
        "It doesn't stop. %x eggs, every hole stuffed and plugged with slick, and %n is left on the bank bloated, ruined, and shakin'.",
      ],
    } };

  if (W.__FARMHAND_TEST__) Object.assign(W, { __nipsHeard: (mn, n) => nipsHeard(mn, n), __nipsOpenOf: (mn) => nipsOpenOf(mn), __nipKindOf: (k) => nipKindOf(k),
    __titEggsOut: (mn, how) => titEggsOut(mn, how), __titCups: (mn) => titCups(mn), __titTick: (mn) => titTick(mn, prodOf(mn), Date.now()) });
