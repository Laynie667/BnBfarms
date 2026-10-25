  /* WHAT'S IN THIS FILE (10y9j-mess-trap-gear.js)
     The real equipment for the mess traps (10u8-mess-traps.js): the fountain's cuffs, the bakery bench and its price tag,
     the creamery's funnel, the seed shower's spreader and cuffs. Here, after TRAP_GEAR is made (10y-farm-gear.js).
  */
  Object.assign(TRAP_GEAR, {
    fountain:   [{ when: "hold", slot: "arms", label: "Fountain Cuffs", items: ["LeatherCuffs", "SteelCuffs"],
                   desc: "Brass cuffs on short chains bolted to the fountain's rim, holding them right under the warm, slow curtain of chocolate." }],
    bakery:     [{ when: "hold", slot: "device", label: "Bakery Bench", items: ["BondageBench", "Table"],
                   desc: "A long floured baker's bench with leather straps at wrist, waist and knee, built to hold something still while it's decorated." },
                 { when: "after", slot: "tag", label: "Price Tag", items: ["CollarNameTag", "CollarBell"], mins: 20,
                   desc: "A little card tag on a ribbon at the collar, in the baker's curly hand: FRESH TODAY, ONE SLICE PER CUSTOMER." }],
    creamery:   [{ when: "hold", slot: "funnel", label: "Cream Funnel", items: ["FunnelGag", "RingGag"],
                   desc: "A wide steel funnel buckled between the teeth, so the cream that misses the skin goes somewhere useful." }],
    seedshower: [{ when: "hold", slot: "legs", label: "Kneeling Spreader", items: ["SpreaderMetal", "SpreaderDildoBar"],
                   desc: "A short steel bar between the knees, keeping them knelt wide and low in the middle of the ring." },
                 { when: "hold", slot: "arms", label: "Behind-the-Back Cuffs", items: ["LeatherCuffs", "SteelCuffs"],
                   desc: "Cuffs that keep their hands behind them, so there's nothing to wipe with and nothing to hide behind." }],
  });
  // the themed traps (10ub-themed-traps.js), Oct 19
  Object.assign(TRAP_GEAR, {
    groomer:     [{ when: "hold", slot: "leash", label: "Grooming Noose", items: ["CollarLeash", "ChainLeash"], desc: "The grooming table's steel arm and its loop, clipped to the collar so they stand still and pretty for the brush." },
                  { when: "after", slot: "tag", label: "Best in Kennel Rosette", items: ["CollarNameTagPet", "CollarBell"], mins: 30, desc: "A big satin rosette on the collar, BEST IN KENNEL in gold thread, still smelling of show shampoo." }],
    whelping:    [{ when: "hold", slot: "device", label: "Whelping Box", items: ["Kennel", "LowCage"], desc: "A low padded box in a warm shed, built for one thing, with a sign above it: BREEDING IN PROGRESS." }],
    leashpost:   [{ when: "hold", slot: "leash", label: "Yard Post Lead", items: ["ChainLeash", "CollarLeash"], desc: "A short chain from the collar to the iron post in the dog yard: just long enough to kneel, too short to go anywhere." }],
    teatcheck:   [{ when: "hold", slot: "cups", label: "Check Stall Cups", items: ["LactationPump", "NippleClamp"], desc: "The dairy girl's own stripping cups, cold steel, for gettin' the last drops out after the hand check." }],
    wax:         [{ when: "hold", slot: "device", label: "The Bench", items: ["BondageBench", "Table"], desc: "The farm's punishment bench, buckled at the wrists, waist and knees, with a candle burning on the shelf beside it." }],
    tomatoes:    [{ when: "hold", slot: "device", label: "Square Stocks", items: ["WoodenStocks"], desc: "The old wooden stocks in the middle of the square, stained red from a hundred fruit-throwing Sundays." }],
    trophy:      [{ when: "hold", slot: "device", label: "Trophy Mount", items: ["XFrame", "TheDisplayFrame"], desc: "A plank frame on the cabin's trophy wall, between the elk and the bear, with a brass plate underneath: LOCAL GAME." }],
    hottub:      [{ when: "hold", slot: "arms", label: "Lumberjack's Grip", items: ["HempRope", "LeatherCuffs"], desc: "A length of logging rope round the wrists, so they don't float off while they're passed round the tub." }],
    slop:        [],
    hogtie:      [{ when: "hold", slot: "ropeFeet", label: "Hog Tie", items: ["HempRope"], opt: "Basic", desc: "Rough sty rope, wrists to ankles behind the back, tied with the pig girl's rodeo knot." },
                  { when: "hold", slot: "ropeArms", label: "Hog Tie (arms)", items: ["HempRope"], opt: "Hogtied", desc: "The other half of the hogtie, the wrists, cinched to the ankles." }],
    booth:       [{ when: "hold", slot: "lips", label: "Booth Ring", items: ["RingGag"], desc: "A ring gag the booth hands out at the door, so the customers get their copper's worth." }],
    milkinghole: [{ when: "hold", slot: "cups", label: "Through-the-Wall Cups", items: ["LactationPump"], desc: "Whatever's on the other side of the milking hole has cups, and they are very, very strong." }],
    feedbag:     [{ when: "hold", slot: "funnel", label: "Feedbag", items: ["HarnessPonyBits", "BitGag", "FunnelGag"], desc: "A canvas feedbag strapped over the face, full of warm mash, and it doesn't come off till it's empty." }],
    stag:        [],
    desk:        [{ when: "after", slot: "tag", label: "AUDITED Tag", items: ["CollarNameTag", "CollarNameTagLivestock"], mins: 20, desc: "A brass tag on the collar stamped AUDITED, with the date punched in underneath." }],
    inspection:  [{ when: "after", slot: "tag", label: "Inspection Tag", items: ["CollarNameTagLivestock", "CollarNameTag"], mins: 30, desc: "An inspection tag on the collar: FIT FOR PURPOSE, the clerk's initials, and a number." }],
    stamp:       [],
  });
  // the second batch (10uc-traps-batch2.js), Oct 19
  Object.assign(TRAP_GEAR, {
    goblinraid:   [{ when: "hold", slot: "ropeArms", label: "Goblin Rope", items: ["HempRope"], desc: "Far too much rope, tied with far too many knots, by a dozen goblins who all wanted to help." },
                   { when: "after", slot: "tag", label: "Goblin Trophy Token", items: ["CollarNameTag", "CollarBell"], mins: 30, desc: "A carved bone token on a thong round the neck: the raiding party's mark, meaning CAUGHT." }],
    goblinpit:    [{ when: "hold", slot: "ropeFeet", label: "Pit Stakes", items: ["HempRope"], desc: "Ankles staked wide in the straw of the breeding pit, so the goblins can work in turns." }],
    goblinmarket: [{ when: "hold", slot: "leash", label: "Market Rope", items: ["CollarLeash", "ChainLeash"], desc: "A frayed rope round the neck, held by whichever goblin's bid is highest this minute." }],
    goblincart:   [{ when: "hold", slot: "ropeArms", label: "Cart Lashings", items: ["HempRope"], desc: "Every bit of string the goblins own, lashing wrists and ankles to the cart bed." },
                   { when: "hold", slot: "ropeFeet", label: "Cart Lashings (legs)", items: ["HempRope"], desc: "More string, round the ankles, tied to the cart wheels' axle." }],
    warband:      [{ when: "after", slot: "tag", label: "Tribute Token", items: ["CollarNameTag", "CollarNameTagLivestock"], mins: 30, desc: "A tusk on a leather thong: the warchief's tribute token, meaning his." }],
    werewolf:     [],
    studchair:    [{ when: "hold", slot: "device", label: "Breeding Chair", items: ["BondageBench", "Table"], desc: "A tilted chair in worn red leather with stirrups, straps at the wrists and waist, built to keep hips up." }],
    squeezechute: [{ when: "hold", slot: "device", label: "Squeeze Chute", items: ["WoodenStocks", "LowCage", "Kennel"], desc: "The cattle chute's padded steel sides, closed snug, and a head gate across the neck." }],
    twine:        [{ when: "hold", slot: "ropeArms", label: "Baler Twine", items: ["HempRope"], desc: "Orange baler twine, wrists to elbows to back, tied by somebody who knows exactly what they're doing." },
                   { when: "hold", slot: "torso", label: "Twine Harness", items: ["HempRopeHarness", "Harness"], desc: "A diamond of twine over the chest and down the belly, knotted tight." }],
    yoke:         [{ when: "hold", slot: "arms", label: "Milkmaid's Yoke", items: ["Pillory", "WoodenCuffs"], desc: "A shaped wooden yoke across the shoulders, wrists cuffed at either end, a bucket hook on each side." }],
    ponycart:     [{ when: "hold", slot: "funnel", label: "Cart Bit", items: ["HarnessPonyBits", "BitGag"], desc: "A steel bit and bridle, reins running back to the driver's hands." },
                   { when: "hold", slot: "torso", label: "Cart Harness", items: ["HarnessPonyBits", "Harness", "LeatherHarness"], desc: "A pony's harness: breastcollar, girth, traces to the cart shafts." }],
    buttermill:   [{ when: "hold", slot: "torso", label: "Churn Harness", items: ["LeatherHarness", "Harness"], desc: "A leather harness hooked to the churn's arm, for walking round and round." }],
  });
