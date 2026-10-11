  /* WHAT'S IN THIS FILE (10y-farm-gear.js)
     REAL GEAR the farm puts on somebody and takes off again: the plug a trap leaves in, growth cups, the clamp,
     the winch chain, the feed funnel, snare rope, and the parasite's lips or belt.
     The bot only keeps the list (r.gear: slot → { label, desc, until }). Their own Companion does the wearin':
     it makes their character match the list it's sent, so a piece goes on when it's listed and comes off the
     moment it isn't (time up, the trap's done, the safeword), and a piece pulled off early is put back.
     Trap gear only goes on somebody who switched "Farm can put real gear on me" on in their Companion's Toggles.
     The parasite needs no second switch: ?parasite on is the say-so.
     Slots (the Companion picks the game item): plug · dildo · belt · cups · leash · funnel · ropeArms · ropeFeet · lips
  */
  // what each trap puts on. when: "hold" = while the trap has them · "after" = when it's done with them, for mins
  // slot may be a function of the member (which hole it used)
  const stopperFor = (mn, first) => { const h = openHole(mn, first); return h === "vulva" ? "dildo" : h === "butt" ? "plug" : null; };
  const TRAP_GEAR = {
    pump:     [{ when: "after", slot: mn => stopperFor(mn, "butt"), label: "Pump Bung", desc: "A fat rubber bung left in by the pump trap, to keep it all in.", mins: 10 }],
    eggs:     [{ when: "after", slot: mn => stopperFor(mn, "vulva"), label: "Egg Post Plug", desc: "The egg post's parting gift: a plug to hold the clutch in while it settles.", mins: 15 }],
    tentacle: [{ when: "after", slot: mn => stopperFor(mn, "vulva"), label: "Slime Seal", desc: "A thick knot of something from the water, set hard, sealing the eggs inside.", mins: 15 }],
    boar:     [{ when: "after", slot: mn => stopperFor(mn, "vulva"), label: "Boar's Plug", desc: "The waxy plug a boar leaves behind so not a drop gets out.", mins: 20 }],
    vines:    [{ when: "after", slot: mn => stopperFor(mn, "vulva"), label: "Seed Pod Stem", desc: "A cut length of vine, still rooted in them, keeping the pods where it planted them.", mins: 10 }],
    clamp:    [{ when: "after", slot: "belt", label: "Denial Clamp", desc: "The trap's clamp, locked on over everything worth touching. It lets go when the denial's up.", mins: () => CFG.TRAP_DENY_MIN }],
    cups:     [{ when: "after", slot: "cups", label: "Growth Cups", desc: "Two wide glass cups pulling at the teats. They stay on till they've finished the job.", mins: 30 }],
    milker:   [{ when: "hold", slot: "cups", label: "Trap Milker", desc: "The milker trap's cups, latched on and pulling." }],
    winch:    [{ when: "after", slot: "leash", label: "Winch Chain", desc: "The chain that walked them to the pen.", mins: () => CFG.TRAP_WINCH_MIN }],
    chute:    [{ when: "hold", slot: "funnel", label: "Feed Chute", desc: "The feed trap's funnel, strapped in." }],
    snare:    [{ when: "hold", slot: "ropeArms", label: "Snare Rope", desc: "The snare's rope, cinched tight." }, { when: "hold", slot: "ropeFeet", label: "Snare Rope", desc: "The snare's rope, cinched tight." }],
    breeder:  [{ when: "hold", slot: "ropeArms", label: "Breedin' Frame Cuffs", desc: "The breeding frame's cuffs." }],
    kennel:   [{ when: "hold", slot: "leash", label: "Kennel Lead", desc: "Clipped to the ring at the back of the kennel." }],
  };
  function gearOn(mn, slot, label, desc, mins, src){
    const r = rec(mn); if (!r || !slot) return false;
    r.gear = r.gear || {};
    r.gear[slot] = { label: String(label).slice(0, 28), desc: String(desc || "").slice(0, 180), until: Date.now() + Math.max(0.5, mins || 5)*60000, src: src || "trap" };
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
    for (const x of plan) if (x.when === "hold" && x.slot) gearOn(mn, x.slot, x.label, x.desc, holdMin + 0.5, "hold");
    return plan;
  }
  function trapGearDone(mn, plan){
    gearOff(mn, null, "hold");
    for (const x of (plan || [])) if (x.when === "after" && x.slot) gearOn(mn, x.slot, x.label, x.desc, tmin(mn, typeof x.mins === "function" ? x.mins() : x.mins), "trap");
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
    for (const [slot, g] of Object.entries((r && r.gear) || {})) if (g.until > now) out.push({ slot, name: g.label, desc: g.desc, until: Math.ceil(g.until/60000)*60000 });
    if (parasiteOn(mn)){
      const belt = r.parasite.form === "belt";
      out.push({ slot: belt ? "belt" : "lips", name: belt ? "Parasite Belt" : "Parasite Lips", always: true, color: "#E0607F", until: r.parasite.until,
        desc: belt ? "A belt of living flesh closed round the hips, with a root up inside. It feeds its host serum and drinks every load they take."
                   : "A pair of fat, living lips sealed over the mouth, with a tentacle down the throat. It feeds its host serum and drinks every load they swallow." });
    }
    return out;
  }
  // the proprietors' own card: who's signed up, what's set, what's runnin'
  function trapAdminFor(){
    const subs = Object.values(L.people).filter(x => x.roles && x.roles.includes(ROLE.SUBJECT));
    return { subjects: subs.map(x => ({ mn: x.mn, name: plainName(x.mn), here: !!charFor(x.mn), n: x.trapN || 0, paused: !!x.trapsOff })),
             spots: trapSpots().map(([n]) => n), water: waterSpots().map(([n]) => n), nest: (L.nest && L.nest.eggs) || 0,
             hunt: huntOn() ? { until: L.hunt.until, goal: L.hunt.goal, done: L.hunt.done.length } : null, pack: packOn() ? (L.pack ? L.pack.spot : "out") : null };
  }
