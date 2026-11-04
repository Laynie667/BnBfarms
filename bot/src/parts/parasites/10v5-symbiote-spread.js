  /* WHAT'S IN THIS FILE (10v5-symbiote-spread.js)
     Symbiotes that spread, and show (Laynie, Oct 15: "id love the symbiotes to actually spread, with real clothes or gear~").
     • SPREADING, only to somebody who also said ?symbiote on and hasn't one already (their limits still rule):
         livin' latex  a touch: a kiss, a hug, a cuddle, a caress, a grope, a lick, once it's grown past its first stage
         milk moss     its spores come with the milk: somebody who nurses from a host (and makes milk themselves)
         the nestling  it buds into whoever the host breeds (a load in their pussy or ass)
       A quarter of the time (CFG.SYM.SPREAD), at most once every ten minutes for each pair. The new one starts small.
     • REAL CLOTHES AND GEAR, put on by their own Companion (0.24.0 on). ?symbiote on is the say-so, the same as ?parasite on:
         livin' latex  gloves (stage 1), latex socks and catsuit legs (2), the catsuit to the neck (3), elbow gloves and
                       thigh-high latex heels (4): glossy black, and it grows with them
         milk moss     a mossy green flower bra (1), thicker (2), a crown of its flowers when it blooms (3)
         the nestling  nothin' to wear: it's inside them (their belly shows it on the drawn body)
       A piece that would go where they're already wearin' somethin' takes that spot for as long as it's on, and what was
       there goes back on after (the Companion keeps it).
  */
  if (CFG.SYM && CFG.SYM.SPREAD === undefined) CFG.SYM.SPREAD = 0.25;
  const LATEX_BLACK = "#121214", MOSS_GREEN = "#5E8F3A";
  const SYM_GEAR = {
    latex: [
      { at: 1, slot: "gloves", name: "Livin' Latex (hands)", items: ["LatexShortGloves"], color: LATEX_BLACK, upTo: 2, desc: "Glossy black livin' latex over both hands, warm as skin and tighter, and it's spreading." },
      { at: 3, slot: "gloves", name: "Livin' Latex (arms)", items: ["LatexElbowGloves"], color: LATEX_BLACK, desc: "The livin' latex has run up both arms to the elbow, shining wet-black." },
      { at: 2, slot: "socks", name: "Livin' Latex (feet)", items: ["LatexSocks1"], color: LATEX_BLACK, desc: "Black latex grown smooth over feet and calves, seamless." },
      { at: 2, slot: "suitLower", name: "Livin' Latex (legs)", items: ["LatexCatsuit"], color: LATEX_BLACK, desc: "The livin' latex has taken both legs and the hips, a glossy second skin that squeezes with every step." },
      { at: 3, slot: "suit", name: "Livin' Latex (body)", items: ["LatexCatsuit"], color: LATEX_BLACK, desc: "Black latex sealed from the neck down, moulded to every curve, warm, alive, and very pleased with itself." },
      { at: 4, slot: "boots", name: "Livin' Latex (heels)", items: ["ThighHighLatexHeels"], color: LATEX_BLACK, desc: "It's grown itself a pair of thigh-high heels. Its idea, not theirs." },
    ],
    moss: [
      { at: 1, slot: "bra", name: "Milk Moss", items: ["FlowerBra"], color: MOSS_GREEN, desc: "Soft green moss grown over the chest, damp and humming, sweet-smelling, and making milk like mad." },
      { at: 3, slot: "hat", name: "Milk Moss (bloom)", items: ["FlowerCrown"], color: "#F4F0E2", desc: "The moss has bloomed: little white flowers, and a crown of them in the hair." },
    ],
    nestling: [],
  };
  // the pieces they should have on now, for the Companion (farmGearFor in 10y-farm-gear.js adds these)
  function symGear(mn){
    if (!symOn(mn)) return [];
    const g = rec(mn).symbiote, out = [];
    for (const P of SYM_GEAR[g.kind] || []) {
      if (g.stage < P.at || (P.upTo && g.stage > P.upTo)) continue;
      out.push({ slot: P.slot, name: P.name, desc: P.desc, items: P.items, color: P.color, always: true, until: g.until });
    }
    return out;
  }
  // a pair passes it once in ten minutes at most
  const spreadSeen = new Map();
  function symSpread(from, to, kind, how){
    try {
      if (!symOn(from) || rec(from).symbiote.kind !== kind || from === to || !charFor(to)) return false;
      if (kind === "latex" && rec(from).symbiote.stage < 2) return false;
      const key = from+">"+to, now = Date.now(); if (now - (spreadSeen.get(key) || 0) < 10*60000) return false;
      spreadSeen.set(key, now);
      if (symWhyNot(to, kind) || Math.random() >= CFG.SYM.SPREAD) return false;
      emote(SYMBIOTES[kind].icon+" "+tFill(pickFor(from, "sym:spread:"+kind, SPREAD_LINES[kind]), from, { c: plainName(to) }), to);
      later(() => { if (charFor(to) && !symOn(to)) symBond(to, kind, how+" from "+plainName(from)); }, 3000);
      return true;
    } catch(e){ warn("symbiote spread:", e); return false; }
  }
  // a touch (09-roleplay.js reads the activity): the latex flows across, either way round
  function symbioteTouch(act, focus, src, tgt){
    if (!src || !tgt || src === tgt || !/^(kiss|gaggedkiss|hug|cuddle|caress|grope|lick|nuzzle|rub|massage|pet|fondle|suck)/i.test(String(act || ""))) return;
    if (!symSpread(src, tgt, "latex", "a touch")) symSpread(tgt, src, "latex", "a touch");
  }
  function symbioteNurse(host, drinker){ if (makesMilk(drinker)) symSpread(host, drinker, "moss", "nursin'"); }
  function symbioteBred(stud, mn, hole){ if ((hole === "vulva" || hole === "butt") && stud > 0) symSpread(stud, mn, "nestling", "a breedin'"); }

  const SPREAD_LINES = {
    latex: [
      "Where %n's skin touches %c's, the livin' latex runs across like spilled ink and keeps goin'. %c has a little of it now.",
      "A glossy black thread slides off %n's fingers onto %c and spreads out, warm and pleased with itself.",
      "%n's latex ripples and reaches. When they part, a patch of it has stayed behind on %c, shinin'.",
    ],
    moss: [
      "Somethin' green and soft comes down with the milk. A little patch of moss takes root on %c's chest.",
      "%c drinks from %n and a few spores come with it. By the time they're done, a soft green fuzz is spreadin' on them.",
    ],
    nestling: [
      "Somethin' small and warm slips from %n into %c with the load and curls up deep. The nestling has budded.",
      "%n's nestling sends a bud along with the breedin', and it settles snug in %c's belly.",
    ],
  };
