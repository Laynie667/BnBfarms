  /* WHAT'S IN THIS FILE (10y9q-trap-switches.js)
     WHOLE KINDS OF TRAP, ON OR OFF (Laynie, Oct 27, from the ideas doc: trap themes as Companion switches).
     • Ten switches, each player their own: furry folk, monsters, goblins and orcs, pregnancy and eggs, milking, messy,
       restraint, latex, public use and show, and the seasonal packs. All on to start with. Switch one off and no trap of
       that kind springs for you, not even one a proprietor springs by hand (a trap of two kinds is off if either is).
       Your limits and ?traps skip still rule as well.
     • ?traps theme: your switches · ?traps theme <kind> on|off · ?traps theme all on.
       The Companion's Traps and Toggles tabs have them as switches.
  */
  const TRAP_THEME_SW = {
    furry:     { off: "furry traps", icon: "🐺", label: "Furry folk", desc: "Wolf-men, the stallion, the bull, the warren's bucks, the boar, the toms, the kennel's mastiff, the minotaur, the werewolf, the fox-brothers, the lion and the rest of the farm's anthro studs" },
    monsters:  { off: "monster traps", icon: "🐙", label: "Monsters", desc: "The thing in the water and the thing in the well, vines, slime, leeches, the naga, the drake, the hive, the black pool, the livin' suit, goblins and orcs" },
    goblins:   { off: "goblin traps", icon: "👺", label: "Goblins and orcs", desc: "The goblin camp's raids, pit, market and cart, and the orc warchief" },
    pregnancy: { off: "pregnancy and egg traps", icon: "🥚", label: "Pregnancy and eggs", desc: "The traps that are all about a clutch or a litter: egg posts, the water, the hive, the incubator, the shrine, the breedin' wheel and chair, the whelping box. (Fertile off is how you stop catchin' at all)" },
    milking:   { off: "milkin' traps", icon: "🥛", label: "Milking", desc: "The milker, growth cups, the carousel, the teat check, the collection bench, the milkin' hole, the yoke, leeches on your teats" },
    messy:     { off: "messy traps", icon: "💦", label: "Messy", desc: "Mud, slime, syrups, cream pies, frosting, slop, fruit, sprays and showers" },
    restraint: { off: "restraint traps", icon: "🪢", label: "Restraint", desc: "Snares, nets, rope and twine, the pillory and the stocks, the plow, the windmill, the squeeze chute, the yoke, the vacuum bed and the doll press" },
    latex:     { off: "latex traps", icon: "🖤", label: "Latex", desc: "The rubber shed's traps, the black pool and the livin' suit" },
    public:    { off: "public traps", icon: "👀", label: "Public use and show", desc: "Traps that put you on show or up for anybody passin': the pillory, the stocks, the wall, the bale, the auction block, the peep booth, the leash post" },
    seasonal:  { off: "the seasons' traps", icon: "🗓️", label: "Seasonal packs", desc: "Halloween's traps and the other seasons' own, while they're on" },
  };
  // which kinds are which (the seasons' own say so themselves: SEASON_TAGS, 10y9m-seasons.js)
  const TRAP_THEME_KINDS = {
    furry:     "wolves stallion bull warren boar toms drake kennel goat sow crate whelping stag minotaur werewolf foxden lionpride ramstud",
    monsters:  "tentacle vines slime naga drake hive leeches well clutch blackpool suit minotaur werewolf goblinraid goblinpit goblinmarket goblincart warband",
    goblins:   "goblinraid goblinpit goblinmarket goblincart warband",
    pregnancy: "breeder eggs tentacle well clutch hive drake vines crate incubator wheel whelping shrine studchair",
    milking:   "milker cups carousel teatcheck rubberstall milkinghole collection weights yoke bull leeches",
    messy:     "mud spray slime chute honey stocks fountain bakery creamery seedshower slop tomatoes buttermill syruptap pieeat mudslide mudpit trough glue feedbag boar",
    restraint: "snare pillory winch net plow bale scarecrow washline windmill hogtie squeezechute twine yoke ponycart stocks kissgate tickle wall vacbed bodybag dollmaker trophy tomatoes leashpost pieeat",
    latex:     "suit vacbed rubbervat dollmaker rubberstall bodybag rubbermaid blackpool rubberpup",
    public:    "pillory wall bale scarecrow auction stocks kissgate seedshower leashpost booth tomatoes paddle pricetag scale goblinmarket goblincart trophy windmill bell groomer pieeat mudpit",
  };
  const TRAP_TAGS = {};
  for (const [t, ks] of Object.entries(TRAP_THEME_KINDS)) for (const k of ks.split(" ")) if (!(TRAP_TAGS[k] = TRAP_TAGS[k] || []).includes(t)) TRAP_TAGS[k].push(t);
  const THEME_SW_WORDS = { furries: "furry", fur: "furry", anthro: "furry", anthros: "furry", monster: "monsters", tentacles: "monsters", creatures: "monsters",
    goblin: "goblins", orcs: "goblins", orc: "goblins", preg: "pregnancy", pregnant: "pregnancy", eggs: "pregnancy", egg: "pregnancy", breeding: "pregnancy",
    milk: "milking", dairy: "milking", milked: "milking", mess: "messy", messes: "messy", bondage: "restraint", restraints: "restraint", rope: "restraint",
    ropes: "restraint", tied: "restraint", rubber: "latex", show: "public", exhibition: "public", exhib: "public", use: "public", season: "seasonal",
    seasons: "seasonal", holiday: "seasonal", holidays: "seasonal" };
  function trapTagsOf(kind){
    const out = (TRAP_TAGS[kind] || []).concat((SEASON_TAGS[kind] || []).filter(t => TRAP_THEME_SW[t]));
    if (SEASON_OF[kind]) out.push("seasonal");
    return [...new Set(out)];
  }
  // the kind of trap they've switched off that this one is ("furry traps", for trapWhyNot), or null
  function trapThemeOff(mn, kind){
    const off = (rec(mn) || {}).trapThemesOff; if (!off || !off.length) return null;
    const t = trapTagsOf(kind).find(x => off.includes(x));
    return t ? TRAP_THEME_SW[t].off : null;
  }
  const themeSwWord = (w) => { const k = String(w || "").toLowerCase().replace(/[^a-z]/g, ""); return TRAP_THEME_SW[k] ? k : THEME_SW_WORDS[k] || null; };
  const themeKinds = (t) => Object.keys(TRAP_KINDS).filter(k => trapTagsOf(k).includes(t));
  function trapThemeSummary(mn){
    const off = (rec(mn) || {}).trapThemesOff || [];
    return "🎛️ KINDS OF TRAP FOR YOU\n"+Object.entries(TRAP_THEME_SW).map(([id, T]) => T.icon+" "+T.label+" ("+id+"): "+(off.includes(id) ? "OFF" : "on")).join("\n")+
      "\n?traps theme <kind> on|off · ?traps theme <kind> lists what's in it · ?traps theme all on";
  }
  function trapThemeCommand(sender, args, R){
    const r = rec(sender);
    if (!r || !r.roles || !r.roles.length){ R("That's just for folks on the books, sugar."); return; }
    const a0 = String(args[0] || "").toLowerCase(), v = String(args[1] || "").toLowerCase();
    if (!a0){ R(trapThemeSummary(sender)); return; }
    if (a0 === "all" && (v === "on" || v === "off")){
      r.trapThemesOff = v === "on" ? [] : Object.keys(TRAP_THEME_SW); saveLedger(); syncCompanions(true); audit(sender, "TRAPTHEME", "all "+v);
      R(v === "on" ? "🎛️ Every kind of trap is back on for you, sugar. (Your limits and ?traps skip still rule.)" : "🎛️ Every kind with a switch is off for you now. The few traps that aren't any of them can still find you: ?traps off stops the lot."); return;
    }
    const id = themeSwWord(a0);
    if (!id){ R("Which kind, sugar? "+Object.keys(TRAP_THEME_SW).join(", ")+". Like ?traps theme furry off."); return; }
    const T = TRAP_THEME_SW[id];
    if (v !== "on" && v !== "off"){
      const ks = themeKinds(id), off = (r.trapThemesOff || []).includes(id);
      R(T.icon+" "+T.label+" is "+(off ? "OFF" : "on")+" for you. "+T.desc+".\nIn it: "+(ks.length ? ks.join(", ") : "nothin' right now")+"\n?traps theme "+id+" "+(off ? "on" : "off")); return;
    }
    r.trapThemesOff = (r.trapThemesOff || []).filter(x => x !== id); if (v === "off") r.trapThemesOff.push(id);
    saveLedger(); syncCompanions(true); audit(sender, "TRAPTHEME", id+" "+v);
    R(v === "off" ? T.icon+" "+T.label+": off. Not one of those traps springs for you now ("+themeKinds(id).length+" of them), not even one sprung by hand. ?traps theme "+id+" on brings them back."
                  : T.icon+" "+T.label+": on. Those traps can find you again.");
  }
  // the Companion's switches: on the Traps tab and the Toggles tab
  function trapThemeStateFor(mn, s){
    const r = rec(mn); if (!r || !s.onBooks) return;
    const off = r.trapThemesOff || [];
    s.trapThemes = Object.entries(TRAP_THEME_SW).map(([id, T]) => ({ id, icon: T.icon, label: T.label, desc: T.desc, on: !off.includes(id) }));
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __trapTagsOf: (k) => trapTagsOf(k), __trapThemeSw: () => TRAP_THEME_SW, __themeKinds: (t) => themeKinds(t) });
