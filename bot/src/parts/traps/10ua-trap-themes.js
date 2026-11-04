  /* WHAT'S IN THIS FILE (10ua-trap-themes.js)
     Traps that fit where they are (Laynie, Oct 19: "I need a ton of themed traps, that i can use for the kennels, the
     stalls, the bench, the stockades, the cabin, the pigsty, the pasture, the gloryholes, the feed trough, wildlife, the
     office, etc."). Every trap belongs to one or more places. A trap tile picks from its place's traps:
       · trap-theme-<place> (or trap-theme-<place>-2…): that place's traps, wherever the tile is
       · a plain trap tile (trap, trap-1…): the place it's nearest, by the farm's own spots within 10 tiles
         (a spot named kennel…, cabin…, pigsty…, office…, glory-…, trough-…, milking…, stocks, bench, pasture,
         water-… or well…, nest…). Nothin' near: any trap at all, as before.
       · trap-<kind>: that one trap, as before.
     ?traps themes lists the places and their traps.
  */
  const TRAP_THEMES = {
    kennel:   { label: "the kennels",     near: /kennel|dog|pup|hound/,               kinds: ["kennel", "wolves", "teaser", "crate", "bell", "groomer", "whelping", "leashpost"] },
    stalls:   { label: "the stalls",      near: /^milking|stall|barn|dairy|parlou?r/, kinds: ["milker", "cups", "carousel", "pump", "breeder", "stallion", "bull", "saddle", "collection", "injector", "incubator", "crate", "sow", "teatcheck"] },
    bench:    { label: "the bench",       near: /^bench|workbench|table/,             kinds: ["paddle", "brand", "scale", "weights", "clamp", "collection", "injector", "pricetag", "wire", "tickle", "wax"] },
    stockade: { label: "the stockades",   near: /^stocks|pillory|stockade|square/,    kinds: ["pillory", "stocks", "kissgate", "wall", "auction", "mirror", "pricetag", "glue", "tomatoes"] },
    cabin:    { label: "the cabin",       near: /cabin|lodge|hut|hearth/,             kinds: ["bearskin", "trophy", "lantern", "tickle", "net", "mirror", "hottub"] },
    pigsty:   { label: "the pigsty",      near: /pig|sty|wallow|mud/,                 kinds: ["mud", "mudpit", "boar", "sow", "trough", "slop", "hogtie", "plow"] },
    pasture:  { label: "the pasture",     near: /^pasture|field|meadow|paddock|orchard/, kinds: ["snare", "net", "scarecrow", "windmill", "bale", "plow", "maze", "bull", "stallion", "wheel", "washline", "bell", "goat", "gas", "spray", "stag"] },
    glory:    { label: "the glory holes", near: /^glory/,                             kinds: ["wall", "kissgate", "seedshower", "booth", "milkinghole", "bale"] },
    trough:   { label: "the feed trough", near: /^trough|feed|manger/,                kinds: ["trough", "chute", "honey", "creamery", "fountain", "bakery", "dip", "glue", "mister", "feedbag"] },
    wildlife: { label: "the wild places", near: /^water|^well|^nest|pond|stream|wood|forest|wild|river|lake|creek/, kinds: ["naga", "drake", "hive", "warren", "toms", "wolves", "leeches", "vines", "boar", "goat", "slime", "eggs", "stag"] },
    office:   { label: "the office",      near: /office|desk|^staff$|clerk/,          kinds: ["desk", "inspection", "brand", "pricetag", "scale", "injector", "mirror", "auction", "stamp"] },
  };
  const THEME_WORDS = { kennels: "kennel", dogyard: "kennel", stall: "stalls", barn: "stalls", dairy: "stalls", milking: "stalls", benches: "bench",
    stockades: "stockade", square: "stockade", cabins: "cabin", lodge: "cabin", pigsties: "pigsty", sty: "pigsty", pigs: "pigsty", wallow: "pigsty",
    pastures: "pasture", field: "pasture", fields: "pasture", meadow: "pasture", gloryhole: "glory", gloryholes: "glory", glories: "glory",
    troughs: "trough", feed: "trough", wild: "wildlife", woods: "wildlife", forest: "wildlife", pond: "wildlife", offices: "office",
    goblins: "goblin", camp: "goblin", cave: "goblin", orcs: "goblin" };
  // which place a trap tile is in: named for it, or the nearest of the farm's spots that says so
  function trapTheme(spot){
    const name = String(spot || "");
    const m = /^trap-theme-([a-z]+)/.exec(name); if (m && TRAP_THEMES[m[1]]) return m[1];
    // trap-kennels-1, trap-cabin, trap-gloryholes-2 (Laynie, Oct 19: "i tried trap-kennels-1"): a place's name, or its
    // plural, after trap-. A trap's own name still wins (trap-kennel is the kennel trap, trap-kennels any kennel trap).
    const w = (/^trap-([a-z]+)/.exec(name) || [])[1];
    if (w && !TRAP_KINDS[w]){ const th = THEME_WORDS[w] || (TRAP_THEMES[w] ? w : null); if (th) return th; }
    if (!/^trap(?:-\d+)?$/.test(name)) return null;            // a trap-<kind> tile is its own trap
    const at = L.spots && L.spots[name]; if (!at) return null;
    let best = null, bestD = 11;
    for (const [n, p] of Object.entries(L.spots || {})){
      if (/^trap/.test(n) || !p) continue;
      const d = Math.max(Math.abs(p.X - at.X), Math.abs(p.Y - at.Y)); if (d >= bestD) continue;
      const th = Object.keys(TRAP_THEMES).find(k => TRAP_THEMES[k].near.test(n));
      if (th){ best = th; bestD = d; }
    }
    return best;
  }
  // the traps a tile can spring for this subject (springTrap's pot luck, 10u-traps.js): its place's, if it has one
  function themePool(mn, spot){
    const th = trapTheme(spot); if (!th) return [];
    return TRAP_THEMES[th].kinds.filter(k => TRAP_KINDS[k] && !trapWhyNot(mn, k));
  }
  function themesText(){
    return "🗺️ TRAPS BY PLACE · name a tile trap-<place> (trap-kennels-1, trap-cabin-2, trap-gloryholes) for that place's traps; a plain trap tile (trap, trap-3) springs from the place it's nearest\n"+
      Object.entries(TRAP_THEMES).map(([k, T]) => "\n"+k+" ("+T.label+"): "+T.kinds.filter(x => TRAP_KINDS[x]).join(", ")).join("");
  }
