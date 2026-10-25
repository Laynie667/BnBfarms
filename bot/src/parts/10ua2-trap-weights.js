  /* WHAT'S IN THIS FILE (10ua2-trap-weights.js)
     Pot luck that notices what's goin' on (Laynie, Oct 25: "more variety based on present factors"). When a tile springs
     pot luck, every trap it could spring still can; these just make the ones that fit the moment likelier:
       · their body: udders achin' full → the milkin' traps · a cock that's pent up → the collection traps ·
         in heat, or rut day → the breedin' traps · carryin' a clutch or a baby → the nestin' traps ·
         corruption at 40 and up → the slimy, livin' things
       · the hour: night (9 in the evenin' to 5 in the mornin', the bot's clock) → the things that come out in the dark ·
         day → the fieldwork and the fair
       · who's about: three or more folks within 8 tiles → the public traps · nobody → the wild ones
       · wearin' livin' latex (the symbiote or the livin' suit) → the latex traps
       · and what they had last: their last three traps are a lot less likely to come round again.
     The trap's own whisper says what drew it, when somethin' did.
  */
  const TW = {
    milk:    { kinds: ["milker", "cups", "carousel", "teatcheck", "milkinghole", "leeches", "yoke"], x: 3, why: "Your udders are so full the farm could smell it on the wind." },
    seed:    { kinds: ["collection", "weights", "teaser"], x: 3, why: "You're so pent up the farm could hear your balls slosh." },
    breed:   { kinds: ["crate", "wheel", "studchair", "breeder", "stallion", "bull", "boar", "sow", "stag", "minotaur", "werewolf", "ramstud", "lionpride", "whelping", "foxden", "warband", "goblinpit", "shrine", "bearskin", "hottub", "scarecrow", "bale"], x: 2,
               why: { heat: "You're in heat, sugar, and every stud on the farm knows it.", rut: "It's rut day, and the farm's breedin' anything that stands still." } },
    nest:    { kinds: ["incubator", "shrine", "clutch", "eggs", "honey", "dip"], x: 2, why: "You're carryin', and the farm wants to fuss over its broodmare." },
    corrupt: { kinds: ["slime", "suit", "vines", "well", "leeches", "clutch", "hive", "naga", "lantern", "mirror"], x: 2, why: "The farm's in you deep now, and the hungry things can tell." },
    night:   { kinds: ["werewolf", "maze", "lantern", "bearskin", "well", "stag", "hottub", "net", "goblinraid", "clutch", "wolves"], x: 2, why: "It's dark out, and the things that come out at night are out." },
    day:     { kinds: ["plow", "washline", "scarecrow", "windmill", "bale", "auction", "stocks", "tomatoes", "pieeat", "mudslide", "scale", "teatcheck"], x: 1, why: "" },
    crowd:   { kinds: ["pillory", "stocks", "auction", "pricetag", "tomatoes", "seedshower", "scale", "kissgate", "paddle", "brand", "inspection", "pieeat", "mirror"], x: 2, why: "There's a crowd about, and the farm loves an audience." },
    alone:   { kinds: ["vines", "slime", "well", "clutch", "stag", "werewolf", "naga", "drake", "hive", "net", "glue", "snare"], x: 2, why: "Nobody's about to see what happens to you out here." },
    latex:   { kinds: ["slime", "suit", "glue"], x: 3, why: "Your second skin hums. It can smell more of itself out here." },   // (the latex traps add themselves: 10y9k-latex-traps.js)
  };
  const TW_CROWD = 3, TW_REACH = 8, TW_RECENT = 3, TW_RECENT_X = 0.2, TW_FULL = 0.8, TW_CORRUPT = 40;
  const twNight = (h) => h >= 21 || h < 5;
  // what's true for them right now, strongest first
  function trapFactors(mn){
    const out = [], p = prodOf(mn) || {};
    try {
      if (makesMilk(mn) && (p.milk || 0) >= milkCap(mn) * TW_FULL) out.push(["milk"]);
      if (makesSemen(mn) && (p.semen || 0) >= semenCap(mn) * TW_FULL) out.push(["seed"]);
      if (inHeat(p)) out.push(["breed", "heat"]); else if (isRut()) out.push(["breed", "rut"]);
      if (p.preg || (p.eggs && p.eggs.n > 0)) out.push(["nest"]);
      if (corruptionOf(mn) >= TW_CORRUPT) out.push(["corrupt"]);
      if (symKind(mn) === "latex" || suitOnNow(mn)) out.push(["latex"]);   // wearin' livin' latex, or the livin' suit
      out.push([twNight(hourNow()) ? "night" : "day"]);
      const at = posOf(mn);
      if (at){
        const near = (W.ChatRoomCharacter || []).filter(c => c.MemberNumber !== mn && c.MemberNumber !== CFG.BOT_MEMBER && c.MapData && c.MapData.Pos &&
          Math.max(Math.abs(c.MapData.Pos.X - at.X), Math.abs(c.MapData.Pos.Y - at.Y)) <= TW_REACH).length;
        out.push([near >= TW_CROWD ? "crowd" : near === 0 ? "alone" : null]);
      }
    } catch(e){ warn("trap factors:", e); }
    return out.filter(f => f[0]);
  }
  // pick one of the kinds they can have, weighted by the moment → { kind, why }
  function trapWeighted(mn, can){
    const facts = trapFactors(mn), recent = ((rec(mn) || {}).trapLog || []).slice(-TW_RECENT).map(x => x.kind);
    const w = can.map(k => {
      let x = 1;
      for (const [f] of facts) if (TW[f].kinds.includes(k)) x += TW[f].x;
      if (recent.includes(k)) x *= TW_RECENT_X;
      return x;
    });
    let r = Math.random() * w.reduce((a, b) => a + b, 0), i = 0;
    for (; i < can.length - 1; i++){ r -= w[i]; if (r < 0) break; }
    const kind = can[i];
    // the strongest reason that fits the trap it picked
    const f = facts.find(([n]) => TW[n].kinds.includes(kind) && TW[n].why);
    const why = !f ? "" : typeof TW[f[0]].why === "string" ? TW[f[0]].why : TW[f[0]].why[f[1]] || "";
    return { kind, why };
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __trapWeighted: (m, c) => trapWeighted(m, c), __trapFactors: (m) => trapFactors(m).map(f => f.join(":")) });
