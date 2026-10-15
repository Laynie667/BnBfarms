  /* WHAT'S IN THIS FILE (10v4-symbiotes.js)
     SYMBIOTES (Laynie, Oct 14: "maybe some symbiote versions of parasites, like living latex and such"). Like the parasite,
     a livin' thing that bonds to somebody; unlike it, a symbiote gives somethin' back for as long as it's fed. Only for
     people who said ?symbiote on (off by default; a hard limit that names symbiotes rules them out). One at a time.
       livin' latex  a glossy black second skin that spreads over a few hours. It drinks every load and every climax,
                     and gives them room to hold more and keeps them clean (it eats the mess off their skin).
       milk moss     a soft green moss over the chest, for somebody who makes milk. It feeds on bein' milked, and their
                     milk comes in up to three quarters again.
       the nestling  a warm little thing curled low in their belly. It feeds on loads in the pussy or the ass, and makes
                     them likelier to catch and roomier inside.
     • It grows a stage at a time (every CFG.SYM.STAGE_MIN minutes it's been fed), and each stage gives more.
     • Fed, it stays: every feedin' adds CFG.SYM.FEED_ADD_H hours (up to CFG.SYM.MAX_H from when it bonded). Hungry, it
       says so, privately. Starved for CFG.SYM.STARVE_H hours, it leaves to find a better-fed host.
     • When its time is up it lets go on its own, with a thank-you: a couple of ribbons.
     • Where it comes from: a spot called symbiote-latex, symbiote-moss or symbiote-nestling (stand there and say
       ?symbiote take), now and then after a trap, or a proprietor's ?symbiote give <who> <kind>.
     • The SAFEWORD takes it off at once. ?symbiote shows how it's doin'; ?symbiote off sends it on its way.
  */
  if (!CFG.SYM) CFG.SYM = { HOURS: 24, MAX_H: 72, FEED_ADD_H: 2, STAGE_MIN: 90, HUNGRY_MIN: 60, STARVE_H: 6, LINE_MIN: 25, FED_LINE_MIN: 5, CLEAN_MIN: 60, TRAP_CHANCE: 0.04 };
  const SYMBIOTES = {
    latex:    { name: "livin' latex", icon: "🖤", stages: 4, feeds: ["load", "climax"], gift: "room to hold more, and it keeps you clean",
                can: mn => /\b(latex|rubber)/i.test((rec(mn) || {}).limits || "") ? "their limits rule out latex" : null },
    moss:     { name: "milk moss", icon: "🌱", stages: 3, feeds: ["milked"], gift: "your milk comes in up to three quarters again",
                can: mn => makesMilk(mn) ? (limitBlocks(mn, "milk") ? "their limits rule it out" : null) : "it only takes to somebody who makes milk" },
    nestling: { name: "the nestling", icon: "🐛", stages: 3, feeds: ["bred"], gift: "you catch easier, and there's more room in you",
                can: mn => limitBlocks(mn, "breed") ? "their limits rule it out" : null },
  };
  // which kind a trap tends to leave behind (anything else: whichever will take)
  const SYM_TRAP = { slime: "latex", glue: "latex", suit: "latex", dip: "latex", milker: "moss", cups: "moss", breeder: "nestling", eggs: "nestling", vines: "nestling", warren: "nestling", pump: "nestling" };
  const symLine = (key, mn, v) => tFill(pickFor(mn, "sym:"+key, SYM_LINES[key]), mn, v);
  function symOn(mn){ const r = rec(mn); return !!(r && r.symbiote && r.symbiote.until > Date.now()); }
  function symKind(mn){ return symOn(mn) ? rec(mn).symbiote.kind : null; }
  // can this kind bond to them right now? null = yes
  function symWhyNot(mn, kind){
    const r = rec(mn), S = SYMBIOTES[kind];
    if (!r || !S) return "no such symbiote";
    if (!r.symbioteOn) return "they haven't said ?symbiote on";
    if (/\bsymbio/i.test(r.limits || "")) return "their limits rule it out";
    if (symOn(mn)) return "they've already got one";
    if ((r.symbioteNext || 0) > Date.now()) return "the last one only just left";
    return S.can(mn);
  }
  function symBond(mn, kind, how){
    const why = symWhyNot(mn, kind); if (why) return why;
    const r = rec(mn), S = SYMBIOTES[kind], now = Date.now();
    r.symbiote = { kind, since: now, until: now + CFG.SYM.HOURS*3600000, fedAt: now, stage: 1, stageAt: now, fed: 0, told: 0, cleanAt: now + CFG.SYM.CLEAN_MIN*60000, how: how || "" };
    r.symbioteN = (r.symbioteN || 0) + 1;
    saveLedger(); audit(CFG.BOT_MEMBER, "SYMBIOTE", mn+" "+kind+(how ? " ("+how+")" : ""));
    emote(S.icon+" "+symLine("bond_"+kind, mn), mn);
    tell(mn, S.icon+" It's "+S.name+", sugar, and it's taken to you. It gives you somethin' for as long as it's fed: "+S.gift+". It eats "+symFeedWords(kind)+
             ", and when it's hungry it'll let you know. Fed, it stays a day or more; starved, it leaves. ?symbiote shows how it's doin'. Your safeword takes it off right now.");
    face(mn, "afterglow", 30); arouse(mn, 10);
    syncCompanions(true);
    return null;
  }
  const symFeedWords = (kind) => kind === "latex" ? "every load you take, anywhere, and every time you cum" : kind === "moss" ? "bein' milked" : "loads in your pussy or your ass";
  function symOff(mn, how){
    const r = rec(mn); if (!r || !r.symbiote) return false;
    const g = r.symbiote, S = SYMBIOTES[g.kind] || SYMBIOTES.latex, was = g.until > Date.now() || how === "done";
    r.symbiote = null;
    r.symbioteNext = Date.now() + (how === "safe" ? 24 : how === "starved" ? 12 : 1)*3600000;
    saveLedger(); audit(CFG.BOT_MEMBER, "SYMBIOTE", mn+" off ("+(how || "done")+")");
    syncCompanions(true);
    if (how === "safe" || !charFor(mn) || !was) return true;
    emote(S.icon+" "+symLine((how === "starved" ? "starved_" : how === "sent" ? "sent_" : "done_")+g.kind, mn), mn);
    if (how === "done"){
      albumAdd(mn, S.icon, "A day with "+S.name, "It was fed "+(g.fed || 0)+" times, grew to stage "+g.stage+" of "+S.stages+", and left on its own, grateful.");
      later(() => earnRibbons(mn, 2, "keepin' "+S.name+" well fed"), 2000);
    }
    return true;
  }
  // what it's worth to them, by how far it's grown
  function symStage(mn, kind){ const r = rec(mn); return symOn(mn) && r.symbiote.kind === kind ? r.symbiote.stage : 0; }
  function symbioteCap(mn){ try { return 100*symStage(mn, "latex") + 75*symStage(mn, "nestling"); } catch(e){ return 0; } }
  function symbioteX(mn, what){
    try {
      if (what === "milk") return 1 + 0.25*symStage(mn, "moss");
      if (what === "fert") return 1 + 0.25*symStage(mn, "nestling");
    } catch(e){}
    return 1;
  }
  // fed: a load (where), a climax, or a milkin'
  function symbioteFed(mn, how, hole){
    try {
      if (!symOn(mn)) return;
      const r = rec(mn), g = r.symbiote, S = SYMBIOTES[g.kind];
      const eats = how === "load" ? (g.kind === "latex" || (g.kind === "nestling" && (hole === "vulva" || hole === "butt"))) : S.feeds.includes(how);
      if (!eats) return;
      const now = Date.now(), wasHungry = now - g.fedAt > CFG.SYM.HUNGRY_MIN*60000;
      g.fedAt = now; g.fed = (g.fed || 0) + 1;
      g.until = Math.min(g.since + CFG.SYM.MAX_H*3600000, Math.max(g.until, now) + CFG.SYM.FEED_ADD_H*3600000);
      saveLedger();
      if (wasHungry || now - (g.fedSaid || 0) > CFG.SYM.FED_LINE_MIN*60000){ g.fedSaid = now; setTimeout(() => { if (charFor(mn)) privateLine(mn, symLine("fed_"+g.kind, mn), "emote"); }, 3000); }
    } catch(e){ warn("symbiote fed:", e); }
  }
  // after a trap: now and then, somethin' was waitin' in it
  function symbioteAfterTrap(mn, kind){
    const r = rec(mn); if (!r || !r.symbioteOn || symOn(mn) || Math.random() >= CFG.SYM.TRAP_CHANCE) return;
    const want = SYM_TRAP[kind], order = (want ? [want] : []).concat(Object.keys(SYMBIOTES).sort(() => Math.random() - 0.5));
    const k = order.find(x => !symWhyNot(mn, x)); if (!k) return;
    later(() => { if (charFor(mn) && !symOn(mn)) symBond(mn, k, "after the "+kind+" trap"); }, 6000);
  }
  function symbioteTick(){
    const now = Date.now();
    for (const [key, r] of Object.entries(L.people)){
      const g = r.symbiote; if (!g) continue;
      const mn = parseInt(key, 10), S = SYMBIOTES[g.kind];
      if (!S){ r.symbiote = null; continue; }
      if (g.until <= now){ symOff(mn, "done"); continue; }
      if (now - g.fedAt > CFG.SYM.STARVE_H*3600000){ symOff(mn, "starved"); continue; }
      if (!charFor(mn)) continue;
      const hungry = now - g.fedAt > CFG.SYM.HUNGRY_MIN*60000;
      // it grows while it's fed
      if (!hungry && g.stage < S.stages && now - g.stageAt >= CFG.SYM.STAGE_MIN*60000){
        g.stage++; g.stageAt = now; saveLedger(); state.gearDirty = true;
        emote(S.icon+" "+symLine("grow_"+g.kind+"_"+g.stage, mn), mn);
        syncCompanions(true);
        continue;
      }
      // the latex eats the mess off their skin
      if (g.kind === "latex" && g.stage >= 2 && now >= (g.cleanAt || 0)){
        g.cleanAt = now + CFG.SYM.CLEAN_MIN*60000;
        const p = prodOf(mn);
        if (p && p.painted){ p.painted = null; bodyMark(mn, { wash: true }); try { aftermathWash(mn); } catch(e){} emote("🖤 "+symLine("clean", mn), mn); saveLedger(); }
      }
      // hungry: it says so, privately, now and then
      if (hungry && !quietNow(mn) && now - (g.told || 0) >= CFG.SYM.LINE_MIN*60000){
        g.told = now; saveLedger();
        privateLine(mn, symLine((now - g.fedAt > CFG.SYM.STARVE_H*1800000 ? "starving_" : "hungry_")+g.kind, mn), "emote");
        arouse(mn, g.kind === "moss" ? 5 : 15, 85);
      }
    }
  }
  function symStatus(mn){
    const r = rec(mn), g = r.symbiote, S = SYMBIOTES[g.kind], h = Math.max(0, (g.until - Date.now())/3600000), fedM = Math.round((Date.now() - g.fedAt)/60000);
    return S.icon+" "+S.name+": stage "+g.stage+" of "+S.stages+", fed "+(g.fed || 0)+" times, last "+(fedM < 2 ? "just now" : fedM+" minutes ago")+
           (fedM >= CFG.SYM.HUNGRY_MIN ? " and it's hungry" : "")+". It stays about "+(h >= 2 ? Math.round(h)+" more hours" : Math.round(h*60)+" more minutes")+" if it's fed. It gives you "+S.gift+".";
  }
  function symbioteCommand(sender, args, R){
    const r = rec(sender), a0 = String(args[0] || "").toLowerCase();
    if (!r || !r.roles || !r.roles.length){ R("That's just for folks on the books, sugar."); return true; }
    const kindOf = (w) => { w = String(w || "").toLowerCase(); return /^(latex|rubber|suit|skin)/.test(w) ? "latex" : /^(moss|milk)/.test(w) ? "moss" : /^(nest|worm|belly)/.test(w) ? "nestling" : null; };
    if (a0 === "give"){
      if (!isProprietor(sender)){ R("Givin' symbiotes is for proprietors, sugar."); return true; }
      const t = resolveTarget(args[1]), k = kindOf(args[2]) || "latex";
      if (!t || !rec(t) || !charFor(t)){ R("?symbiote give <who> latex|moss|nestling, and they need to be here, sugar."); return true; }
      const why = symBond(t, k, "given");
      R(why ? "It won't take to "+plainName(t)+": "+why+"." : SYMBIOTES[k].icon+" "+SYMBIOTES[k].name+" is on "+plainName(t)+" now.");
      return true;
    }
    if (a0 === "take"){
      const spot = Object.keys(L.spots || {}).find(n => /^symbiote-/.test(n) && onSpot(sender, n, 1));
      if (!spot){ R("You'd need to be standin' at one of the farm's symbiote spots, sugar (symbiote-latex, symbiote-moss, symbiote-nestling)."); return true; }
      const k = kindOf(spot.replace(/^symbiote-/, "")) || "latex", why = symBond(sender, k, "taken at "+spot);
      if (why) R("It won't take to you right now, sugar: "+why+".");
      return true;
    }
    if (a0 === "off" && symOn(sender)){ symOff(sender, "sent"); r.symbioteOn = false; saveLedger(); R("Symbiotes: off. It's gone, and no more will find you."); syncCompanions(true); return true; }
    if (!a0){
      if (symOn(sender)) R(symStatus(sender)+" Your safeword or ?symbiote off sends it away.");
      else R(switchStatus("symbiote", !!r.symbioteOn)+(r.symbioteOn ? " Stand at a symbiote spot and say ?symbiote take, or one may find you after a trap." : ""));
      return true;
    }
    if (!/^(on|off|yes|no)$/.test(a0)){ R("?symbiote on, ?symbiote off, or ?symbiote take at a symbiote spot, sweetie."); return true; }
    const on = a0 === "on" || a0 === "yes";
    if (on && /\bsymbio/i.test(r.limits || "")){ R("Your hard limits rule that out, sugar, so I'll keep it off."); return true; }
    r.symbioteOn = on; saveLedger(); audit(sender, "SYMBIOTE", on ? "on" : "off");
    R(on ? "🖤 Symbiotes: ON. Livin' latex, milk moss or the nestling can bond to you: stand at a symbiote spot and say ?symbiote take, or one may be waitin' after a trap. Each gives you somethin' for as long as it's fed. ?symbiote off or your safeword sends it away."
         : "Symbiotes: off. Nothin' will bond to you.");
    syncCompanions(true); return true;
  }

  const SYM_LINES = {
    bond_latex: [
      "A drop of glossy black wells up on %n's skin, then another, and they run together and spread: livin' latex, warm as a hand, findin' its new home.",
      "Somethin' black and shining slides up %n's ankle like spilled ink goin' the wrong way, and settles in, snug and warm. Livin' latex.",
      "A slick black film creeps over %n's fingers and up their wrist, tighter than a glove and warmer. It's chosen them.",
    ],
    bond_moss: [
      "A soft green fuzz blooms across %n's chest like moss on a warm stone, and it hums, very faintly, under their skin.",
      "{t}Velvet-green moss spreads over the curve of %n's tits, cool and soft, and settles round their nipples like it's been waitin' for them.",
      "{nt}Soft green moss spreads across %n's chest, cool and velvety, and nestles round each nipple.",
      "Somethin' mossy and sweet-smellin' takes to %n's chest, and they feel a warm, heavy tingle start up underneath.",
    ],
    bond_nestling: [
      "Somethin' small and warm wriggles its way into %n and curls up low in their belly, content, and goes still.",
      "%n gasps and presses a hand low on their belly. Somethin' warm has moved in down there and made itself at home.",
      "A little warm thing finds its way inside %n and settles deep, and their whole belly goes soft and warm round it.",
    ],
    fed_latex: [
      "The latex drinks it in, every drop, and ripples over %n in a slow, satisfied wave.",
      "%n's second skin tightens and warms, pleased, and purrs against them.",
      "The latex sighs over %n, fed, and squeezes them all over like a hug.",
      "A glossy shiver runs through the latex from %n's toes to their throat. It liked that.",
    ],
    fed_moss: [
      "The moss on %n's chest fluffs up, damp and pleased, and the tingle underneath turns warm and heavy.",
      "%n's moss drinks what's left at their nipples and hums, soft and happy.",
      "The moss settles, content, and %n can feel their milk startin' to come in again behind it.",
      "A sweet green smell rises off %n's chest. The moss is happy.",
    ],
    fed_nestling: [
      "Low in %n's belly, the nestling turns over, slow and content, and goes still again, warm.",
      "The nestling drinks it in and curls tighter, purrin' somewhere deep inside %n.",
      "%n's belly warms right through as the nestling feeds, and it gives a happy little wriggle.",
      "The nestling settles, fed and drowsy, and %n's belly goes soft and heavy round it.",
    ],
    hungry_latex: [
      "The latex squeezes %n, insistent, at the hips and the chest and between the legs. It's hungry.",
      "%n's second skin has gone tight and restless. It wants feedin': a load, or a climax, anything.",
      "The latex rubs and pulses against everything it covers, coaxin', remindin' %n it hasn't eaten.",
    ],
    hungry_moss: [
      "%n's chest aches and the moss itches. It wants them milked.",
      "{t}The moss tugs gently at %n's nipples, again and again, the way a calf does. It's time for milkin'.",
      "The moss on %n's chest has gone dry and prickly. It needs the milk let down.",
    ],
    hungry_nestling: [
      "The nestling stirs low in %n's belly and nudges, nudges, nudges. It wants them full.",
      "A hungry little ache sits deep in %n where the nestling curls. It wants a load.",
      "%n's belly flutters and twists: the nestling's hungry, and it makes sure they know it.",
    ],
    starving_latex: [
      "The latex has gone thin and cold on %n, peelin' at the edges. If it isn't fed soon, it'll go.",
      "%n's second skin squeezes hard, almost pleadin'. It's starvin'.",
    ],
    starving_moss: [
      "The moss on %n's chest has gone pale and patchy. It'll leave soon if nobody milks them.",
      "%n's moss is wiltin'. It needs the milk, and it needs it now.",
    ],
    starving_nestling: [
      "The nestling's gone restless and fretful inside %n. Starved much longer, it'll go lookin' for another belly.",
      "%n can feel the nestling pacin' in there, hungry and fretful.",
    ],
    grow_latex_2: [
      "The latex has spread up %n's legs and over their hips now, shinin' like wet paint and every bit as tight.",
      "%n's second skin has grown: legs and hips, glossy black, and it squeezes softly with every step.",
    ],
    grow_latex_3: [
      "The latex has closed over %n's belly and chest now, smooth and gleamin', holdin' them in like a hug they can't get out of.",
      "{t}%n's tits are sealed in shining black now, the latex moulded to every curve of them.",
      "{nt}%n's chest is sealed in shining black now, the latex moulded close as skin.",
    ],
    grow_latex_4: [
      "The latex covers all of %n now but their face and hands, a perfect black shine from neck to toes.",
      "%n is all glossy black from the chin down, and the latex hums, proud of itself.",
    ],
    grow_moss_2: [
      "The moss on %n's chest has grown thick and soft and deep green, and the tingle underneath is a steady, heavy ache now.",
      "{t}%n's tits have gone fuller under the moss, heavier, and they leak a little when they move.",
      "%n's moss has thickened and spread, and their chest feels full and warm under it.",
    ],
    grow_moss_3: [
      "The moss has bloomed: tiny white flowers dot %n's chest, and they're makin' milk like never before.",
      "{t}%n's tits are heavy and tight under a blanket of flowerin' moss, drippin' at the tips.",
      "{nt}%n's chest is flowered and full, and milk beads at their nipples under the moss.",
    ],
    grow_nestling_2: [
      "The nestling has grown. %n's belly has a soft little curve to it now, and it's warm to the touch.",
      "%n's belly rounds out a little round the nestling, and they can feel it turn over now and then.",
    ],
    grow_nestling_3: [
      "%n's belly is rounded and warm now, the nestling grown fat and happy inside, and everything down there feels ripe.",
      "The nestling's full-grown, curled heavy and warm low in %n, and their belly hums with it.",
    ],
    clean: [
      "The latex ripples over %n and every splash and smear on it simply sinks in and vanishes. Spotless.",
      "%n's second skin drinks the mess right off itself, gleamin' clean in a heartbeat.",
      "Whatever was splattered on %n's latex is gone, soaked up, and it shines all the brighter.",
    ],
    done_latex: [
      "The latex peels away from %n at last, slow and almost tender, and slides off into the straw. It leaves their skin soft and glowin'.",
      "%n's second skin lets go, a long glossy sigh from head to toe, and pools at their feet before crawlin' off, fed and grateful.",
    ],
    done_moss: [
      "The moss on %n's chest dries to a soft golden fuzz and brushes away, leavin' their skin soft and their nipples tender.",
      "%n's moss lets go, flowerin' one last time, and falls away in a sweet-smellin' shower.",
    ],
    done_nestling: [
      "The nestling wriggles its way out of %n, fat and happy, and trundles off into the straw. Their belly feels empty and warm.",
      "%n feels the nestling stir, and turn, and leave, a warm little goodbye on its way out.",
    ],
    starved_latex: [
      "The latex goes dull and cold and slides off %n in sheets, lookin' for somebody who'll feed it.",
    ],
    starved_moss: [
      "%n's moss withers to brown and crumbles away. Nobody milked them in time.",
    ],
    starved_nestling: [
      "The nestling slips out of %n in the night, hungry, gone to find a fuller belly.",
    ],
    sent_latex: ["%n peels the latex off with a word, and it slithers away into the straw without a fuss."],
    sent_moss: ["%n brushes the moss away, and it lets go easily, leavin' their chest soft and bare."],
    sent_nestling: ["%n asks the nestling to go, and it wriggles out obligingly and trundles off."],
  };
