  /* WHAT'S IN THIS FILE (10y9h-gear-sense.js)
     What somebody's got on, in plain yes-or-no, so a line can fit what they're wearin' as well as their body
     (Laynie, Oct 14: "checking that they make sense via gender, equipped anatomy, equipped items, species").
     gearSense(mn) → { gag, ringGag, blind, deaf, hood, collar, leash, bell, arms, hands, paws, legs, nipples, breastGear,
                       chastity, cage, plugFront, plugBack, harness, noseRing, ears, tail, hooves, heels, latex, device,
                       naked }
     Add-ons get it as api.gear(mn). Nothin' here changes what any item does.
  */
  function gearSense(mn){
    const g = { gag:false, ringGag:false, blind:false, deaf:false, hood:false, collar:false, leash:false, bell:false,
                arms:false, hands:false, paws:false, legs:false, nipples:false, breastGear:false, chastity:false, cage:false,
                plugFront:false, plugBack:false, harness:false, noseRing:false, ears:false, tail:false, hooves:false,
                heels:false, latex:false, device:false, naked:false };
    try {
      const C = charFor(mn);
      if (!C || !Array.isArray(C.Appearance)) return g;
      const CLOTHES = ["Cloth","ClothLower","Suit","SuitLower","Bra","Panties","Corset","ClothOuter"];
      let dressed = false, mouthItem = false, gagEff = false;
      for (const it of C.Appearance){
        if (!it || !it.Asset || !it.Asset.Group) continue;
        const grp = it.Asset.Group.Name, nm = ((it.Asset.Name||"")+" "+(it.Asset.Description||"")+" "+((it.Craft && it.Craft.Name)||"")).toLowerCase();
        const eff = [].concat((it.Property && it.Property.Effect) || [], it.Asset.Effect || []);
        if (CLOTHES.includes(grp)) dressed = true;
        if (/^ItemMouth/.test(grp)){ mouthItem = true; if (eff.some(e => /^Gag(Normal|Medium|Heavy|VeryHeavy|Total)/.test(e))) gagEff = true; }
        if (eff.some(e => /^Blind/.test(e))) g.blind = true;
        if (eff.some(e => /^Deaf/.test(e))) g.deaf = true;
        if (grp === "ItemHood") g.hood = true;
        if (grp === "ItemNeck") g.collar = true;
        if (grp === "ItemNeckRestraints" || eff.includes("Leash") || eff.includes("IsLeashed") || /leash/.test(nm)) g.leash = true;
        if (/\bbell\b/.test(nm) && /^(ItemNeck|ItemNeckAccessories|ItemNipples|ItemNipplesPiercings)$/.test(grp)) g.bell = true;
        if (grp === "ItemArms") g.arms = true;
        if (grp === "ItemHands"){ g.hands = true; if (/paw|hoof|mitt/.test(nm)) g.paws = true; }
        if (grp === "ItemLegs" || grp === "ItemFeet") g.legs = true;
        if (grp === "ItemNipples" || grp === "ItemNipplesPiercings") g.nipples = true;
        if (grp === "ItemBreast") g.breastGear = true;
        if (eff.includes("Chaste") || eff.includes("ButtChaste")){ g.chastity = true; if (/cage|tube|lock/.test(nm) && makesSemen(mn)) g.cage = true; }
        if (grp === "ItemPenis" || (/\bcage\b/.test(nm) && /^(ItemVulva|ItemPelvis|ItemPenis)$/.test(grp))){ if (makesSemen(mn)) g.cage = true; g.chastity = true; }
        if (grp === "ItemVulva" && (eff.includes("FillVulva") || /dildo|plug|vibrat|egg/.test(nm))) g.plugFront = true;
        if (grp === "ItemButt") g.plugBack = true;
        if ((grp === "ItemTorso" || grp === "ItemTorso2") && /harness|strap|tack/.test(nm)) g.harness = true;
        if (grp === "ItemNose") g.noseRing = true;
        if (/^HairAccessory/.test(grp) && /ear/.test(nm)) g.ears = true;
        if (/^(Shoes|ItemBoots)$/.test(grp)){ if (/hoof|pony/.test(nm)) g.hooves = true; else if (/heel|stiletto|ballet/.test(nm)) g.heels = true; }
        if (/latex|rubber|catsuit|living suit/.test(nm) && /^(Suit|SuitLower|Cloth|ClothLower|ItemTorso|ItemHood|Gloves|Socks)$/.test(grp)) g.latex = true;
        if (grp === "ItemDevices") g.device = true;
      }
      if (mouthItem){ const b = holeBlocked(mn, "mouth"); if (b || (b === null && gagEff)) g.gag = true; else g.ringGag = true; }   // (null: the block check is off, so the gag says)
      try { g.tail = !!tailOf(mn); } catch(e){}
      g.naked = !dressed;
    } catch(e){}
    return g;
  }
