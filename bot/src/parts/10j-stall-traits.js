  /* WHAT'S IN THIS FILE (10j-stall-traits.js)
     What they've got, for the milkin' stall's story (10i-stall-story.js): lines that only fit some people,
     mixed into the middle of the story (about a third of the lines). Each pool says which part it's about
     (milk, cock, or any) and who it fits. Plus each kind of cock's own big moment at the first climax.
     %size their breast size word · %cup their cup · %balls their ball size word · %len their cock length
  */
  const STALL_TRAITS = {
    udderSmall: { part:"milk", when:(mn) => udderLevel(mn) <= 3, lines:[
      "%n's %size little breasts barely fill the cups, but the stall pulls at them just as greedily.",
      "The cups are almost too big for %n's %cup-cup chest, and the suction draws every bit of them inside.",
      "Small as they are, %n's breasts give and give. The machine doesn't care about size, only about milk.",
      "%n's perky nipples are drawn out long and pink, the whole of their small breasts tugged up into the liners.",
      "There isn't much of %n's chest for the cups to hold, so they hold all of it."] },
    udderMid: { part:"milk", when:(mn) => udderLevel(mn) >= 4 && udderLevel(mn) <= 6, lines:[
      "%n's %size breasts sway heavily with every pull, filling the cups to the rim.",
      "The cups are sized just right for %n's %cup-cup breasts, sealing snug all the way round.",
      "%n's breasts jiggle softly as the pump pulses, full and warm in the cups.",
      "Each pull lifts the soft weight of %n's breasts a little, then lets them settle back down.",
      "%n's %size breasts are flushed and tight with milk, the skin shiny where the cups grip."] },
    udderBig: { part:"milk", when:(mn) => udderLevel(mn) >= 7 && udderLevel(mn) <= 10, lines:[
      "%n's %size breasts hang heavy in the stall's sling, so full the cups look small on them.",
      "It takes the extra-wide cups to fit %n's %cup-cup breasts, and even those strain at the seal.",
      "%n's huge breasts slosh with every pull. There's so much milk in there the stall has to work for it.",
      "The sling under %n's chest creaks as their %size breasts sway with the pump.",
      "Milk runs from %n's enormous breasts in thick, endless streams, the lines barely keeping up.",
      "%n's breasts are so heavy they rest on the padded shelf, and the cups pull at them from below."] },
    udderHyper: { part:"milk", when:(mn) => udderLevel(mn) >= 11, lines:[
      "%n's %size breasts fill half the stall, propped on padded shelves while the oversized cups work them.",
      "The stall had to be fitted with the special cups for %n: wide as dinner plates, and they still struggle to seal.",
      "%n can't see past their own breasts. They can only feel them: vast, aching, and pouring milk.",
      "The bucket under %n's colossal breasts fills like a rain barrel. The stall will be at this a while.",
      "Every pull sends a slow wave through %n's massive breasts, and the milk just keeps coming."] },
    preg: { part:"milk", when:(mn, p) => !!p.preg, lines:[
      "The milk comes rich and creamy, the way it does when there's a litter on the way. %n's round belly presses against the rail.",
      "%n's belly is round and taut beneath the cups, and something in there kicks as the milk lets down.",
      "Carrying makes everything more sensitive, and %n feels every single pull.",
      "%n cradles their swollen belly with one hand while the stall milks them, flushed and glowing.",
      "The pump hums, the milk flows, and %n's belly gives a lazy little roll from within."] },
    fresh: { part:"milk", when:(mn, p) => !p.preg && p.freshUntil > Date.now(), lines:[
      "%n is still in full fresh-mother flow, and the milk pours out like it's meant for a whole litter.",
      "Freshened and overflowing, %n gives milk faster than the stall can pull it.",
      "There's a little one somewhere who'd want this milk. Today the stall gets it instead.",
      "%n's breasts have been making milk for their young, and they don't hold back now."] },
    pierced: { part:"milk", when:(mn) => { const C = charFor(mn); return !!(C && (C.Appearance||[]).some(x => x && x.Asset && x.Asset.Group && x.Asset.Group.Name === "ItemNipplesPiercings")); }, lines:[
      "The rings through %n's nipples tug and clink inside the cups with every pull.",
      "%n's nipple piercings catch the suction just so, and they gasp each time the liners squeeze.",
      "Metal glints inside the clear cups where %n's pierced nipples are drawn long.",
      "Each pull drags at %n's nipple jewelry, a sharp little sweetness on top of the ache."] },
    heat: { part:"any", when:(mn, p) => inHeat(p), lines:[
      "%n is in heat, and the stall's pull goes straight between their legs. They're dripping on the straw.",
      "Heat-dazed and needy, %n rocks against nothing as the machine works them.",
      "%n's heat makes every pull feel like a touch, and they can't keep quiet about it.",
      "Their skin is fever-warm with heat, flushed all over, and the stall just keeps going."] },
    equine: { part:"cock", when:(mn) => penisType(mn) === "equine", lines:[
      "%n's flared %len horse cock fills the long sleeve, the broad head throbbing at the far end.",
      "The sleeve has to stretch around the flare of %n's equine cock on every stroke, and it drags deliciously.",
      "%n's horse cock hangs long and heavy, the sleeve working it from flare to sheath.",
      "The flare swells and spreads inside the sleeve, and %n stamps a foot."] },
    canine: { part:"cock", when:(mn) => penisType(mn) === "canine", lines:[
      "%n's red, tapered canine cock slides in and out of the sleeve, slick and pointed.",
      "The sleeve squeezes around the base of %n's canine cock where the knot is starting to swell.",
      "%n's pointed tip pulses steady little spurts down the line, the way a dog's does.",
      "The sleeve's grip settles behind %n's knot like a tight fist, and they whine."] },
    knot: { part:"cock", when:(mn) => knotted(mn) && penisType(mn) !== "canine", lines:[
      "A ring inside the sleeve clamps around %n's swelling knot and holds it there.",
      "%n's knot swells fat and tight in the sleeve's grip, and they shake with it.",
      "The machine strokes everything above %n's knot and squeezes the knot itself in slow pulses.",
      "Locked in the sleeve by their own knot, %n isn't going anywhere."] },
    feline: { part:"cock", when:(mn) => penisType(mn) === "feline", lines:[
      "The soft barbs along %n's feline cock catch on the ribbed sleeve, and they shiver all the way down.",
      "%n's barbed cock throbs in the sleeve, every stroke dragging those little nubs the wrong way.",
      "%n purrs, then yowls, as the sleeve works their barbed shaft.",
      "The sleeve is lined soft for barbed cocks, and it still makes %n's tail lash."] },
    draconic: { part:"cock", when:(mn) => penisType(mn) === "draconic", lines:[
      "The ridges along %n's draconic cock bump through the sleeve one by one on every stroke.",
      "%n's ridged cock is thick and textured, and the sleeve works every ridge.",
      "Heat rolls off %n's draconic cock inside the sleeve, the liner warming to match.",
      "%n growls low as the sleeve squeezes ridge after ridge."] },
    double: { part:"cock", when:(mn) => penisType(mn) === "double", lines:[
      "Two sleeves for two cocks: the stall works both of %n's shafts in alternating strokes.",
      "%n's twin cocks throb side by side in their sleeves, leaking together.",
      "The left sleeve strokes while the right one sucks, and %n can't keep track of either.",
      "Both of %n's cocks jerk at once, and two lines fill with precum."] },
    bigCock: { part:"cock", when:(mn) => sizeOf(mn, "penis") >= 12, lines:[
      "%n's %len cock is too long for the standard sleeve, so the stall uses the long one, and it swallows every inch.",
      "There's so much of %n's cock that the sleeve strokes it in two long passes.",
      "%n's huge cock throbs against the sleeve's walls, stretching it.",
      "The sleeve's ribs drag down all %len of %n, and it takes a while to get to the end."] },
    smallCock: { part:"cock", when:(mn) => sizeOf(mn, "penis") <= 5, lines:[
      "%n's little cock disappears completely in the sleeve, which sucks at it greedily all the same.",
      "The sleeve is tight enough to grip even %n's small cock, and it milks it like any other.",
      "Small as it is, %n's cock leaks just as much as anyone's in the sleeve."] },
    ballsSmall: { part:"cock", when:(mn) => sizeOf(mn, "testes") <= 2, lines:[
      "%n's small, tight balls are cupped snugly, the vibration humming right through them.",
      "The cup closes around %n's little balls, gentle, and squeezes them in rhythm."] },
    ballsBig: { part:"cock", when:(mn) => sizeOf(mn, "testes") >= 6 && sizeOf(mn, "testes") <= 10, lines:[
      "%n's %balls balls fill the cup to bursting, heavy and sloshing as it squeezes.",
      "The ball cup strains around %n's big sack, vibrating against all that weight.",
      "%n's balls are so full they ache, and every squeeze of the cup makes them gasp.",
      "The cup lifts %n's heavy balls and kneads them in slow, insistent waves."] },
    ballsHyper: { part:"cock", when:(mn) => sizeOf(mn, "testes") >= 11, lines:[
      "%n's %balls balls rest in a padded cradle of their own, far too big for the cup, so the stall massages them instead.",
      "There's a sea of seed sloshing in %n's colossal balls, and the stall means to have its share.",
      "Every pump sends a shiver across the vast curve of %n's balls."] },
    cow: { part:"any", when:(mn) => speciesKey(mn) === "cow", lines:[
      "%n lets out a long, contented moo, tail swishing behind them.",
      "%n's cowbell clinks softly with every pull.",
      "%n chews slowly at nothing, eyes half-closed, the very picture of a happy dairy cow.",
      "%n's ear flicks at a fly, and they shift their hooves in the straw."] },
    bull: { part:"any", when:(mn) => speciesKey(mn) === "bull", lines:[
      "%n snorts and paws the straw, nostrils flaring with every pump.",
      "%n tosses their head and bellows low, nose ring catching the light.",
      "%n's tail lashes, heavy and impatient, then stills as the machine drags at them."] },
    equid: { part:"any", when:(mn) => ["pony","horse"].includes(speciesKey(mn)), lines:[
      "%n stamps a hoof and tosses their mane, breath snorting through their nose.",
      "%n's tail flicks high, and they let out a soft nicker.",
      "%n's ears swivel back toward the pump's hum."] },
    deer: { part:"any", when:(mn) => speciesKey(mn) === "deer", lines:[
      "%n's ears twitch at every sound, and their little tail flicks.",
      "%n stands delicately in the straw, trembling like a fawn."] },
    pig: { part:"any", when:(mn) => speciesKey(mn) === "pig", lines:[
      "%n grunts happily, snout twitching, wriggling deeper into the straw.",
      "%n's curly tail wiggles every time the pump pulls."] },
    canid: { part:"any", when:(mn) => ["pup","dog"].includes(speciesKey(mn)), lines:[
      "%n's tail wags helplessly, thumping against the stall's boards.",
      "%n pants, tongue lolling, and lets out a happy little whine.",
      "%n's ears flatten, then perk, as the machine changes pace."] },
    felid: { part:"any", when:(mn) => ["kitt","cat"].includes(speciesKey(mn)), lines:[
      "%n's tail lashes and curls, and a purr rumbles out of them despite themself.",
      "%n kneads the padded rail, purring.",
      "%n's ears flatten back as the machine pulls, then relax again."] },
    goblin: { part:"any", when:(mn) => speciesKey(mn) === "goblin", lines:[
      "%n cackles breathlessly, then moans, then cackles again.",
      "%n's long ears droop and twitch as the stall works them.",
      "%n mutters a curse at the machine, then begs it not to stop."] }
  };
  // the big moment, the way their cock does it (played right after the first climax line)
  const STALL_PEAK = {
    equine: "%n's flare blooms wide inside the sleeve as they cum, ropes of seed pumping down the line in huge, heavy surges.",
    canine: "%n's knot swells to its fullest and locks in the sleeve's grip, and they pump load after load, the way a dog does.",
    feline: "%n yowls as they cum, barbs flaring, seed spurting in short, hot bursts.",
    draconic: "%n roars as they cum, ridges pulsing in waves, a scalding flood rushing down the line.",
    double: "Both of %n's cocks cum at once, two lines filling side by side.",
    knot: "%n's knot swells and locks in the sleeve, and they cum in long, pulsing throbs.",
    human: "%n cries out as they cum, hips jerking into the sleeve, thick spurts pulsing down the line."
  };
  // a line about what they've got, for this part of them (null if nothing fits)
  function stallTraitLine(mn, st, part){
    const p = prodOf(mn);
    st.used = st.used || {};
    const fits = Object.entries(STALL_TRAITS).filter(([k, t]) => {
      if (t.part !== part && t.part !== "any") return false;
      if ((st.used["trait-"+k] || []).length >= t.lines.length) return false;   // used up: no repeats, the regular lines carry on
      try { return !!t.when(mn, p); } catch(e){ return false; }
    });
    if (!fits.length) return null;
    // the least-used one first, so everything that fits them gets its turn in a session
    st.traitUses = st.traitUses || {};
    const least = Math.min(...fits.map(([k]) => st.traitUses[k] || 0));
    const pool = fits.filter(([k]) => (st.traitUses[k] || 0) === least);
    const [key, t] = pool[Math.floor(Math.random()*pool.length)];
    st.traitUses[key] = (st.traitUses[key] || 0) + 1;
    return stallPick(st, "trait-"+key, t.lines);
  }
  function stallPeakLine(mn){
    const t = penisType(mn);
    if (STALL_PEAK[t] && t !== "human") return STALL_PEAK[t];
    return knotted(mn) ? STALL_PEAK.knot : STALL_PEAK.human;
  }
