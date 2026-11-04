  /* WHAT'S IN THIS FILE (10uq-brand.js)
     THE FARM'S BRAND (Laynie, Oct 29: "i also want to add our logo as a brand for our livestock, with studio support").
     The B&B logo (the big BB with the paw-print cowbell, shared/brand/), seared on a body and drawn there by every
     Companion in the room, under clothes, with the messes (extension/src/messes.js, shared/brand/brand-paint.js).
       ?brand <who> logo [place]   staff on their herd, proprietors on anybody: the iron goes on
       ?brand <who> clear          takes it off (whoever put it there, or a proprietor), the same as the old letter brands
       ?brand all logo [place]     proprietors: every livestock on the books carries it; ?brand all clear
     The look (size, seared or healed or inked, nudges) is the farm's, set in the studio and baked into the Companion with
     the rest of the farm's look (tools/farm-look-bake.mjs). Each player can hide their own from their Companion's Toggles.
  */
  const BRAND_PLACE_KEYS = ["hipL", "hipR", "thighL", "thighR", "mons", "tummy", "chestL", "chestR", "shoulderL", "shoulderR"];
  const BRAND_PLACE_NAMES = { hipL: "left hip", hipR: "right hip", thighL: "left thigh", thighR: "right thigh", mons: "low on the belly", tummy: "tummy",
    chestL: "left breast", chestR: "right breast", shoulderL: "left shoulder", shoulderR: "right shoulder" };
  const BRAND_PLACE_WORDS = "hip, left hip, thigh, left thigh, belly, tummy, breast, left breast, shoulder, left shoulder";
  const brandPlaceName = (k) => BRAND_PLACE_NAMES[k] || "hip";
  // "left hip", "lhip", "thigh", "breast", "belly"… → a place (the right side unless they say left)
  function brandPlaceFrom(text){
    const t = String(text || "").toLowerCase().replace(/[^a-z]/g, ""); if (!t) return null;
    const exact = BRAND_PLACE_KEYS.find(k => k.toLowerCase() === t); if (exact) return exact;
    const left = /^(l|left)/.test(t), side = left ? "L" : "R", body = t.replace(/^(left|right|l|r)/, "");
    if (/^hip|^flank|^rump|^ass|^butt/.test(body)) return "hip" + side;
    if (/^thigh|^leg/.test(body)) return "thigh" + side;
    if (/^breast|^chest|^tit|^boob|^udder/.test(body)) return "chest" + side;
    if (/^shoulder|^arm/.test(body)) return "shoulder" + side;
    if (/^belly|^mons|^womb|^low/.test(body)) return "mons";
    if (/^tummy|^stomach/.test(body)) return "tummy";
    return null;
  }
  const BRAND_SEAR = [
    "🔥 %b heats the farm's iron till it glows, and presses it to %t's %p. A hiss, a yelp, the smell of it, and the B&B brand is on 'em for good.",
    "🔥 %b holds %t still with one hand and lays the iron to their %p with the other. When it comes away, the big BB and the little bell are burned in clean.",
    "🔥 The iron comes out of the coals and %b doesn't hesitate: %t's %p, three heartbeats, done. B&B stock, and everybody can see it.",
  ];
  function brandLogo(by, t, placeText, R){
    const r = t ? rec(t) : null;
    if (!r){ R("Brand who, sugar? ?brand <who> logo [place]. Places: " + BRAND_PLACE_WORDS + "."); return; }
    if (!isProprietor(by) && !membership(t, by)){ R("You can only brand stock in your own " + herdWord(by) + ", hon."); return; }
    if (/\bbrand/i.test(r.limits || "")){ R(plainName(t) + "'s limits rule out a brand, sugar."); return; }
    const place = brandPlaceFrom(placeText) || (r.brand && r.brand.logo && r.brand.logo.place) || "hipR";
    if (placeText && !brandPlaceFrom(placeText)){ R("I don't know where that is, sugar. Places: " + BRAND_PLACE_WORDS + "."); return; }
    r.brand = { mark: "B&B", logo: { place }, by, at: Date.now() }; saveLedger(); audit(by, "BRAND", t + " logo " + place); syncCompanions(true);
    const line = pickFresh("brand:sear", BRAND_SEAR).replace(/%b/g, plainName(by)).replace(/%t/g, plainName(t)).replace(/%p/g, brandPlaceName(place));
    if (charFor(t)) emote(line, t);
    R("🔥 " + plainName(t) + " carries the B&B brand now, on their " + brandPlaceName(place) + ".");
    tell(t, "🔥 " + plainName(by) + " branded you with the farm's mark, on your " + brandPlaceName(place) + ". It shows on you for everybody with the Companion (your Toggles can hide it on your own screen).");
  }
  // what their Companion draws: their own logo brand, or the herd's; the farm's look from the studio on top
  function brandFor(mn){
    const r = rec(mn); if (!r) return null;
    let place = r.brand && r.brand.logo ? r.brand.logo.place : null;
    if (!place && L.brandAll && hasRole(mn, ROLE.LIVESTOCK) && !(r.brand && r.brand.mark && !r.brand.logo)) place = L.brandAll.place;
    if (!place) return null;
    return { place };   // (the Companion knows the farm's look for it)
  }
