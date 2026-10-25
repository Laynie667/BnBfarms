  /* WHAT'S IN THIS FILE (10y-farm-gear.js)
     REAL GEAR the farm puts on somebody and takes off again: the plug a trap leaves in, growth cups, the clamp,
     the winch chain, the feed funnel, snare rope, and the parasite's lips or belt.
     The bot only keeps the list (r.gear: slot → { label, desc, until }). Their own Companion does the wearin':
     it makes their character match the list it's sent, so a piece goes on when it's listed and comes off the
     moment it isn't (time up, the trap's done, the safeword), and a piece pulled off early is put back.
     Trap gear only goes on somebody who switched "Farm can put real gear on me" on in their Companion's Toggles.
     The parasite needs no second switch: ?parasite on is the say-so.
     Slots (the Companion picks the game item): plug · dildo · belt · cups · leash · funnel · arms · legs · ropeFeet · lips · torso · tag · device (Companion 0.23.0+) · hood · mitts (Companion 0.42.0+)
     The items named on each piece are real game item names, read from the game's own list (Oct 12).
     A piece can name the game items it would rather be ("Tentacles", "Slime") and a colour.
  */
  // what each trap puts on. when: "hold" = while the trap has them · "after" = when it's done with them, for mins
  // slot may be a function of the member (which hole it used)
  const stopperFor = (mn, first) => { const h = openHole(mn, first); return h === "vulva" ? "dildo" : h === "butt" ? "plug" : null; };
  // items: game items to try first for this piece (the Companion falls back to the slot's usual one) · color: its colour
  const SLIME = "#5FAE3A", FLESH = "#C9577A";
  const TRAP_GEAR = {
    pump:     [{ when: "after", slot: mn => stopperFor(mn, "butt"), label: "Pump Bung", items: ["ButtPump", "HollowButtPlug", "InflatableVibeDildo"], mins: 10,
                 desc: "A fat black rubber bung, swollen tight inside, corking a belly pumped round and sloshing. It doesn't come out until every drop has soaked in." }],
    eggs:     [{ when: "after", slot: mn => stopperFor(mn, "vulva"), label: "Egg Post Plug", items: ["EggVibePlugXXL", "PenisDildo"], mins: 15,
                 desc: "The egg post's parting gift: a thick ridged plug seated deep behind a fresh clutch, holding every egg in a stretched, slick hole while they settle." }],
    tentacle: [{ when: "hold", slot: "arms", label: "The Water's Grip", items: ["Tentacles"], color: FLESH,
                 desc: "Thick, wet, suckered arms wound tight round wrists and elbows, holding them spread while the rest of it breeds them. They squeeze in time." },
               { when: "hold", slot: "torso", label: "The Water's Embrace", items: ["TentacleSuit"], color: FLESH,
                 desc: "It has them round the middle too: thick wet arms wound over belly and ribs and between the breasts, squeezing slow, holding them up out of the water like a catch." },
               { when: "hold", slot: "legs", label: "The Water's Coils", items: ["Tentacles"], color: FLESH,
                 desc: "Slick coils round both thighs, hauling them wide and keeping them there. There is no closing these legs until it has finished laying." },
               { when: "after", slot: mn => stopperFor(mn, "vulva"), label: "Slime Seal", mins: 15, items: ["Tentacles", "DoubleEndDildo", "PenisDildo"], color: FLESH,
                 desc: "The thing left the tip of itself behind: a fat knot of living flesh buried to the root, pulsing, sealing a womb packed full of its eggs." }],
    boar:     [{ when: "after", slot: mn => stopperFor(mn, "vulva"), label: "Boar's Plug", items: ["FuckPlug", "PenisPlug", "PenisDildo"], mins: 20,
                 desc: "What a boar leaves so nothing leaks: a hard waxy plug as thick as a wrist, set deep, with a bellyful of hog seed sloshing behind it." }],
    vines:    [{ when: "after", slot: mn => stopperFor(mn, "vulva"), label: "Seed Pod Stem", mins: 10, items: ["Tentacles", "PenisDildo"], color: "#3E8A3A",
                 desc: "A cut length of thick green vine, still rooted inside and dripping sap, holding its seed pods where it planted them." }],
    slime:    [{ when: "after", slot: "arms", label: "Slime Sleeves", mins: () => CFG.TRAP_STICKY_MIN, items: ["Slime"], color: SLIME,
                 desc: "Thick green slime still clinging from fingers to shoulders, warm and tacky, stringing between arm and ribs with every move." },
               { when: "after", slot: "legs", label: "Slime Stockings", mins: () => CFG.TRAP_STICKY_MIN, items: ["Slime"], color: SLIME,
                 desc: "Slime coating both legs to the hip, oozing down the thighs and sucking at the floor. Whatever it crawled into is still in there too." }],
    clamp:    [{ when: "after", slot: "belt", label: "Denial Clamp", items: ["SteelChastityPanties", "HeavyDutyBelt", "MetalChastityBelt"], mins: () => CFG.TRAP_DENY_MIN,
                 desc: "Cold steel locked over everything worth touching. Inside, something soft licks and hums and stops, over and over. No cumming until it lets go." }],
    cups:     [{ when: "after", slot: "cups", label: "Growth Cups", items: ["NippleSuctionCups"], mins: 30,
                 desc: "Two wide glass bells sucking hard at swollen teats, drawing them long and dark and fat. They stay on until these tits are a size bigger." }],
    milker:   [{ when: "hold", slot: "cups", label: "Trap Milker", items: ["LactationPump"], desc: "Steel milking cups latched on with a greedy pull, nipples stretched down the glass, pumping this animal dry whether there's anything left or not." }],
    winch:    [{ when: "after", slot: "leash", label: "Winch Chain", items: ["CollarChainShort", "CollarChainMedium"], mins: () => CFG.TRAP_WINCH_MIN,
                 desc: "The chain that walked them across the yard on their toes, in front of everybody, like a heifer going to market. It's still clipped on." }],
    chute:    [{ when: "hold", slot: "funnel", label: "Feed Chute", items: ["FunnelGag"], desc: "A wide rubber funnel strapped between the teeth, throat held open, with a hopper of warm sweet mash pouring down until this belly is tight as a drum." }],
    snare:    [{ when: "hold", slot: "arms", label: "Snare Rope", desc: "Rough rope cinched round both wrists and hauled up overhead, stringing them out helpless while the little machine teases." },
               { when: "hold", slot: "ropeFeet", label: "Snare Hobble", desc: "Rope round both ankles, pulling them wide apart. Everything between them is on show and out of their own reach." }],
    breeder:  [{ when: "hold", slot: "arms", label: "Breedin' Frame Cuffs", items: ["SteelCuffs", "WristShackles", "LeatherCuffs"], desc: "Padded steel cuffs locking both wrists to the breeding frame: bent over, hips up, held still for the machine like a mare for the stud." }],
    kennel:   [{ when: "hold", slot: "leash", label: "Kennel Lead", items: ["CollarLeash", "ChainLeash"], desc: "A short lead clipped to the ring at the back of the kennel. Long enough to get on all fours. Not long enough to reach the door." }],
    wolves:   [{ when: "after", slot: mn => stopperFor(mn, "vulva"), label: "Pack's Knot", items: ["PenisDildo", "PenisPlug"], mins: 10, color: "#B3323A",
                 desc: "The last wolf's knot, still swollen fat inside and throbbing, tying them to a bellyful of the whole pack's seed until it finally goes down." }],
    stallion: [{ when: "after", slot: mn => stopperFor(mn, "vulva"), label: "Stud's Stopper", items: ["HollowButtPlug", "PenisDildo"], mins: 10,
                 desc: "A stable hand's rubber stopper, shoved in after the stallion pulled out, to keep a mare's worth of horse cum from pouring down their legs." }],
    pillory:  [{ when: "after", slot: "ropeFeet", label: "Pillory Spreader", items: ["SpreaderMetal", "HeavySpreaderMetal"], mins: () => CFG.TRAP_PILLORY_MIN,
                 desc: "A bar ratcheted between the ankles so the legs can't close while they're bent in the pillory. Whoever walks up gets whichever hole they like." }],
  };
  function gearOn(mn, slot, label, desc, mins, src, x){
    const r = rec(mn); if (!r || !slot) return false;
    r.gear = r.gear || {};
    r.gear[slot] = { label: String(label).slice(0, 28), desc: String(desc || "").slice(0, 180), until: Date.now() + Math.max(0.5, mins || 5)*60000, src: src || "trap" };
    if (x && x.items) r.gear[slot].items = x.items.slice(0, 4); if (x && x.color) r.gear[slot].color = x.color;
    if (x && x.opt) r.gear[slot].opt = String(x.opt).slice(0, 30);   // how it's set: "Hogtied", "Wide"… (the Companion's GEAR_OPT has the usual)
    saveLedger(); syncCompanions(true);
    return true;
  }
  function gearOff(mn, slot, src){
    const r = rec(mn); if (!r || !r.gear) return false;
    let did = false;
    for (const k of Object.keys(r.gear)) if ((!slot || k === slot) && (!src || r.gear[k].src === src)){ delete r.gear[k]; did = true; }
    if (did){ saveLedger(); syncCompanions(true); }
    return did;
  }
  // a trap starts on them / is done with them / is stopped short
  function trapGearStart(mn, kind){
    const g = TRAP_GEAR[kind]; if (!g) return null;
    const r = rec(mn), holdMin = r.penned && r.penned.trap ? Math.max(1, (r.penned.until - Date.now())/60000) : 3;
    // which slot each piece uses is settled now, before anything's on them
    const plan = g.map(x => Object.assign({}, x, { slot: typeof x.slot === "function" ? x.slot(mn) : x.slot }));
    for (const x of plan) if (x.when === "hold" && x.slot) gearOn(mn, x.slot, x.label, x.desc, holdMin + 0.5, "hold", x);
    return plan;
  }
  function trapGearDone(mn, plan){
    gearOff(mn, null, "hold");
    for (const x of (plan || [])) if (x.when === "after" && x.slot) gearOn(mn, x.slot, x.label, x.desc, tmin(mn, typeof x.mins === "function" ? x.mins() : x.mins), "trap", x);
  }
  function farmGearTick(now){
    for (const [k, r] of Object.entries(L.people)){
      if (!r.gear) continue;
      let did = false;
      for (const s of Object.keys(r.gear)) if (r.gear[s].until <= now){ delete r.gear[s]; did = true; }
      if (did){ saveLedger(); state.gearDirty = true; }
    }
    if (state.gearDirty){ state.gearDirty = false; syncCompanions(true); }
  }
  // what their Companion should have on them right now
  function farmGearFor(mn){
    const r = rec(mn), now = Date.now(), out = [];
    for (const [slot, g] of Object.entries((r && r.gear) || {})) if (g.until > now) out.push(Object.assign({ slot, name: g.label, desc: g.desc, until: Math.ceil(g.until/60000)*60000 }, g.items ? { items: g.items } : {}, g.color ? { color: g.color } : {}, g.opt ? { opt: g.opt } : {}));
    if (parasiteOn(mn)) for (const g of parasiteGear(mn)) out.push(g);
    if (suitOnNow(mn)) for (const g of suitGear(mn)) out.push(g);
    for (const g of symGear(mn)) out.push(g);   // a symbiote, as far as it's grown (10v5-symbiote-spread.js)   // the livin' suit, as far as it has spread (10y5-cursed.js)   // lips, suckers, root: whatever has bloomed (10v2-parasite-more.js)
    return out;
  }
  // the proprietors' own card: who's signed up, what's set, what's runnin'
  function trapAdminFor(){
    const subs = Object.values(L.people).filter(x => isSubject(x.mn));
    return { subjects: subs.map(x => ({ mn: x.mn, name: plainName(x.mn), here: !!charFor(x.mn), n: x.trapN || 0, paused: !!x.trapsOff })),
             spots: trapSpots().map(([n]) => n), water: waterSpots().map(([n]) => n), nest: (L.nest && L.nest.eggs) || 0,
             hunt: huntOn() ? { until: L.hunt.until, goal: L.hunt.goal, done: L.hunt.done.length } : null, pack: packOn() ? (L.pack ? L.pack.spot : "out") : null };
  }
