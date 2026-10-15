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

