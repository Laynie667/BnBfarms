  /* WHAT'S IN THIS FILE (10uq2-farm-ink.js)
     THE FARM'S OWN INK (approved Nov 17; Nov 18, Laynie: "Farm can ink me" its own switch, for studs "either" brand,
     three days to heal and marker and henna as they are, "seems good to me").
     What the farm says should be inked on somebody goes to their Companion as a list in their panel state (farmInk), and
     their own game puts it in their wardrobe's Farm Brand or Farm Ink slots, on the skin under clothes, if they've
     switched "Farm can ink me" on (shared/ink/ink.js farmInkSync). Never over ink they picked. A brand heals from angry
     red to pale over three days. Taken off by them it stays off, except the corruption's, which is back by mornin'.
       ?brand <who> logo [place]   the farm's BB and bell (10uq-brand.js): in the brand slot too, with the switch on
       ?brand <who> species        their animal's brand: Hucow, Mare, Bitch, Sow, Vixen, Bunny, Kitten, Dragoness...
       ?brand <who> stud           Stud Service
       ?brand all logo             every livestock: the farm's mark
       corruption 50               the corruption's words (10y4-corruption.js), in its own dark ink
     Without the switch the farm's logo is still drawn the old way (messes.js); the species and stud brands wait for it.
  */
  const INK_HEAL_MS = 3 * 86400000;
  const SPECIES_BRAND = { cow: "Hucow", pony: "Mare", deer: "Doe", pup: "Bitch", kitt: "Kitten", goblin: "Goblins", bunny: "Bunny", fox: "Vixen", goat: "Nanny", rat: "Rat", dragon: "Dragoness" };
  // their animal's brand: a wolf's her own, so are sheep and pigs (the farm counts them in with the nearest kind)
  function speciesBrandOf(mn){
    const s = String((rec(mn) || {}).species || "").toLowerCase();
    if (/wolf/.test(s)) return "SheWolf";
    if (/sheep|\bewe|lamb/.test(s)) return "Ewe";
    if (/\bpig|piggy|\bsow\b|swine|\bhog/.test(s)) return "Sow";
    return SPECIES_BRAND[speciesKey(mn)] || "TheFarmsMark";
  }
  const inkName = (d) => d === "TheFarmsMark" ? "the farm's mark" : d === "StudService" ? "STUD SERVICE" : d === "SheWolf" ? "She-Wolf" : d.replace(/([a-z])([A-Z])/g, "$1 $2");
  // the corruption's words: its own design where there is one, the rest written in blackletter, in its dark ink
  const CORR_INK = { "FARM PROPERTY": "FarmPropertyCorrupted", "RUINED STOCK": "RuinedStockCorrupted", "FARM ANIMAL": "FarmAnimalCorrupted", "BRED": "BredCorrupted" };
  // a Companion new enough, with "Farm can ink me" on
  function inkable(mn){
    const c = state.companions.get(mn);
    return !!(hasCompanion(mn) && c && verAtLeast(c.ver, "0.61.0") && !(c.off && c.off.ink));
  }
  // what should be inked on them: [{ id, slot, design, at, heal, keep, color, values }]
  function farmInkFor(mn){
    const r = rec(mn); if (!r) return [];
    const out = [], b = r.brand;
    if (b && b.ink) out.push({ id: "brand:" + b.ink + ":" + (b.at || 0), slot: "brand", design: b.ink, at: b.at || 0, heal: INK_HEAL_MS });
    else if (brandFor(mn)){
      const own = b && b.logo, at = (own ? b.at : L.brandAll && L.brandAll.at) || 0;
      out.push({ id: "brand:logo:" + at, slot: "brand", design: "TheFarmsMark", at, heal: INK_HEAL_MS });
    }
    if (r.corrBrand && (r.corrMarks || []).includes(50)){
      const d = CORR_INK[r.corrBrand], id = "corrupt50:" + r.corrBrand.replace(/[^A-Za-z]/g, "");
      out.push(d ? { id, slot: "ink", design: d, keep: 1 } : { id, slot: "ink", design: "LiveWordsBlackletter", keep: 1, color: ["#3a0d52"], values: { t: r.corrBrand } });
    }
    return out;
  }
  const BRAND_INK_SEAR = [
    "🔥 %b heats the iron till it glows and lays it to %t's flank: %m, burned in clean. Everybody can see what kind of stock they are now.",
    "🔥 %b holds %t still with one hand and presses the iron in with the other. When it comes away, %m is seared into their hide, angry and red.",
    "🔥 Three heartbeats with the iron on %t's skin, and %b steps back. %m, for good.",
  ];
  // ?brand <who> species | stud: into their brand slot
  function brandInk(by, t, kind, R){
    const r = t ? rec(t) : null;
    if (!r){ R("Brand who, sugar? ?brand <who> species sears on their animal's brand, ?brand <who> stud sears on Stud Service."); return; }
    if (!isProprietor(by) && !membership(t, by)){ R("You can only brand stock in your own " + herdWord(by) + ", hon."); return; }
    if (/\bbrand/i.test(r.limits || "")){ R(plainName(t) + "'s limits rule out a brand, sugar."); return; }
    const design = kind === "stud" ? "StudService" : speciesBrandOf(t), name = inkName(design);
    r.brand = { mark: name, ink: design, by, at: Date.now() }; saveLedger(); audit(by, "BRAND", t + " " + design); syncCompanions(true);
    const line = pickFresh("brand:ink", BRAND_INK_SEAR).replace(/%b/g, plainName(by)).replace(/%t/g, plainName(t)).replace(/%m/g, name.toUpperCase() === name ? name : "the " + name + " brand");
    if (charFor(t)) emote(line, t);
    R("🔥 " + plainName(t) + " carries " + name + " now." + (inkable(t) ? "" : " It shows once they switch on \"Farm can ink me\" in their Companion."));
    tell(t, "🔥 " + plainName(by) + " branded you: " + name + ". " + (inkable(t)
      ? "It's in your wardrobe's Farm Brand slot, angry red, and it heals pale over three days."
      : "Switch on \"Farm can ink me\" in your Companion's Toggles (On your character) and it goes on you, in your wardrobe's Farm Brand slot."));
  }
