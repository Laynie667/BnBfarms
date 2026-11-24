  /* WHAT'S IN THIS FILE (10z8-wild-traps.js)
     WILD TRAPS (Laynie, Nov 20: "What if trap spots place and move themselves at random? more when a hunt is active?",
     then "id like for the spots I have set to stay as is, but 3-8 roaming spots would be great. the barn and pasture
     mostly, and receiving." No warning: "they hit harder, more ruthlessly, and by suprise with much much heavier
     consequences. Id even let the gear remain til removed by someone else.")
     • The farm girl keeps hidden traps of her own on top of the tiles that are set (those stay as they are): 3, one more
       for every two people in the room with their traps on, 8 at most, and 8 in a hunt. Each sits on an open tile in the
       barn, the pasture or receiving (the zones in those groups: barn and pasture most, receiving less), never a wall, a
       spot or the tile beside one, a safe zone, or where somebody's stood, and creeps to another every 10 to 15 minutes
       (2 to 3 in a hunt). One that's had somebody moves on at once.
     • No warning. Step onto one and it has you then and there: it doesn't wait out the breather (a minute after the last
       trap let go is all it gives), and it springs the place's traps: the barn the stalls', the pasture the pasture's,
       receiving the office's.
     • It hits harder (wildOn, asked by the rest of the farm while it has them): the brutal strength, held twice as long,
       filled half again as full, the filthiest tellin' (not for somebody on ?intensity tender: theirs stays gentle, and
       strong, not brutal), always written on (for those the farm can mark), and half the time handed straight on to
       another trap.
     • What it leaves on them stays till somebody ELSE takes it off; if it would have left nothin', it leaves cuffs locked
       behind their back. Their Companion puts a piece back if they pull it off themselves, and tells me when somebody
       else takes it off (gearFreed). Only on those who've switched "Farm can put real gear on me" on, as all trap gear;
       their SAFEWORD takes every bit of it off, as ever.
     • ?trap where (staff): where the wild ones are right now. Nobody else is ever told: like every trap tile, they're hidden.
     OPT IN (Nov 20, Laynie: "add the toggles for it with a clear warning that the wild traps are more brutal, and not the
     kind for the faint of heart, off by default for the hard ones, the normal farm traps could still trigger on the wild
     spots"). Three switches, each off till they say so, each with its warning (wildCommand, and the Companion's Toggles):
       ?traps wild on|off        (wildIn)     the wild traps themselves. Off: a wild tile is an ordinary farm trap for
                                              them, the place's traps, breather, reset and all, and nothin' kept on them
       ?traps wild limbs on|off  (wildLimbs)  a kit can take their arms and legs (Echo's Limb Teleportation Device,
                                              10z8b-wild-kits.js): it's only seen by those with Echo's clothing mod
       ?traps wild laced on|off  (wildLaced)  the kits come laced: doses in the gear's own words, dripped in for as long as
                                              it's on, by their Dispensary (or the farm girl, on the farm)
  */
  if (!CFG.WILD) CFG.WILD = { BASE: 3, MAX: 8, PER: 2, MOVE_MIN: [10, 15], HUNT_MOVE_MIN: [2, 3], GRACE_S: 60, HOLD_X: 2, FILL_X: 1.5, CHAIN: 0.5, KEEP_DAYS: 30,
    ZONES: { barn: { w: 4, theme: "stalls", label: "the barn" }, pasture: { w: 4, theme: "pasture", label: "the pasture" }, receiving: { w: 2, theme: "office", label: "receiving" } } };
  // is a wild trap havin' them right now? (the rest of the farm asks, to hit harder)
  function wildOn(mn){ return !!(state.wildRun && (state.wildRun.get(mn) || 0) > Date.now()); }
  // a gentle tellin' stays gentle: ?intensity tender is theirs
  function wildFilthy(mn){ return wildOn(mn) && intensityOf(mn) !== "tender"; }
  function wildZones(){ zonesLedger(); return Object.entries(L.zones || {}).filter(([, z]) => z && z.a && z.b && CFG.WILD.ZONES[z.group]).map(([n, z]) => ({ n, z, g: z.group })); }
  // they've said yes to the wild traps (off till they do: the ordinary farm traps still spring on the wild tiles for them)
  function wildFor(mn){ const r = rec(mn); return !!(r && r.wildIn); }
  function wildCount(){
    if (huntOn()) return CFG.WILD.MAX;
    // (everybody with traps on counts: a wild tile's an ordinary trap for those who haven't said yes)
    const on = (W.ChatRoomCharacter || []).filter(c => c && c.MemberNumber !== BOTMN() && isSubject(c.MemberNumber)).length;
    return Math.max(CFG.WILD.BASE, Math.min(CFG.WILD.MAX, CFG.WILD.BASE + Math.floor(on / CFG.WILD.PER)));
  }
  // an open tile: not a wall, not a spot or beside one, not a safe zone, nobody on it, not beside another wild one
  function wildTileOk(X, Y, self){
    try { if (typeof W.ChatRoomMapViewPositionIsBlocked === "function" && W.ChatRoomMapViewPositionIsBlocked(X, Y)) return false; } catch(e){}
    for (const s of Object.values(L.spots || {})) if (s && Math.max(Math.abs(s.X - X), Math.abs(s.Y - Y)) <= 1) return false;
    for (const z of Object.values(L.zones || {})) if (z && z.a && z.b && /safe/i.test(String(z.group || "")) && inZone(z, { X, Y })) return false;
    for (const C of (W.ChatRoomCharacter || [])){ const p = C && C.MapData && C.MapData.Pos; if (p && p.X === X && p.Y === Y) return false; }
    for (const w of (L.wild || [])) if (w !== self && w.X != null && Math.max(Math.abs(w.X - X), Math.abs(w.Y - Y)) <= 1) return false;
    return true;
  }
  const wildMoveMs = () => { const [a, b] = huntOn() ? CFG.WILD.HUNT_MOVE_MIN : CFG.WILD.MOVE_MIN; return (a + Math.random()*(b - a))*60000; };
  // put one somewhere new: a group by its weight, a zone in it by its size, a tile in that
  function wildPlace(w, now){
    const zs = wildZones(); if (!zs.length) return false;
    const groups = Array.from(new Set(zs.map(z => z.g)));
    const area = (z) => (Math.abs(z.a.X - z.b.X) + 1) * (Math.abs(z.a.Y - z.b.Y) + 1);
    for (let t = 0; t < 6; t++){
      let x = Math.random()*groups.reduce((s, g) => s + CFG.WILD.ZONES[g].w, 0), g = groups[0];
      for (const gg of groups){ x -= CFG.WILD.ZONES[gg].w; if (x <= 0){ g = gg; break; } }
      const inG = zs.filter(z => z.g === g);
      for (let u = 0; u < 25; u++){   // (keeps lookin' in the place it picked, so a crowded barn still gets its share)
        let y = Math.random()*inG.reduce((s, z) => s + area(z.z), 0), z = inG[0];
        for (const zz of inG){ y -= area(zz.z); if (y <= 0){ z = zz; break; } }
        const x0 = Math.min(z.z.a.X, z.z.b.X), x1 = Math.max(z.z.a.X, z.z.b.X), y0 = Math.min(z.z.a.Y, z.z.b.Y), y1 = Math.max(z.z.a.Y, z.z.b.Y);
        const X = x0 + Math.floor(Math.random()*(x1 - x0 + 1)), Y = y0 + Math.floor(Math.random()*(y1 - y0 + 1));
        if (wildTileOk(X, Y, w)){ w.X = X; w.Y = Y; w.g = g; w.zone = z.n; w.at = now; w.moveAt = now + wildMoveMs(); return true; }
      }
    }
    return false;
  }
  // KEPT GEAR ONLY WHILE THEY'VE SAID YES (Nov 21). The night wild traps were on for everybody (Bot 0.90.0 and 0.91.0),
  // kits went on people who never switched them on, and stayed. So: what a wild trap left stays only while their wild
  // traps are on. Switched off (or never on), it comes off, the same as their safeword would do it.
  function wildLetGo(mn, quiet){
    const r = rec(mn); if (!r || !r.gear) return 0;
    let n = 0; for (const s of Object.keys(r.gear)) if (r.gear[s] && r.gear[s].keep && r.gear[s].src === "wild"){ delete r.gear[s]; n++; }
    if (n && !quiet){ saveLedger(); syncCompanions(true); }
    return n;
  }
  function wildCleanOnce(){
    if (L.wildClean >= 1) return;
    L.wildClean = 1; let n = 0;
    for (const k of Object.keys(L.people)){ const r = L.people[k]; if (r && !r.wildIn) n += wildLetGo(Number(k), true); }
    if (n) audit(BOTMN(), "WILDCLEAN", n+" kept wild-trap pieces off people who haven't switched wild traps on");
    saveLedger(); if (n) syncCompanions(true);
  }
  // every heartbeat (trapTick): as many as there should be, each movin' on when it's due
  function wildTick(now){
    try { wildCleanOnce(); } catch(e){ warn("wild clean:", e); }
    L.wild = Array.isArray(L.wild) ? L.wild : [];
    if (!wildZones().length){ if (L.wild.length){ L.wild = []; saveLedger(); } return; }
    let changed = false;
    const want = wildCount();
    while (L.wild.length > want){ L.wild.pop(); changed = true; }
    while (L.wild.length < want){ const w = { id: Math.random().toString(36).slice(2, 7) }; if (!wildPlace(w, now)) break; L.wild.push(w); changed = true; }
    const huntMax = CFG.WILD.HUNT_MOVE_MIN[1]*60000;
    for (const w of L.wild) if (now >= (w.moveAt || 0) || (huntOn() && (w.moveAt || 0) - now > huntMax)){ if (wildPlace(w, now)) changed = true; }
    if (changed) saveLedger();
  }
  // the wild one they're stood on, if any
  function wildHere(mn){
    const p = posOf(mn); if (!p || !Array.isArray(L.wild)) return null;
    return L.wild.find(w => w.X === p.X && w.Y === p.Y) || null;
  }
  // stepped onto one (trapCheck, 10u-traps.js, on a fresh step): no warnin', no breather
  const WILD_OPEN = [
    "The ground that was solid a minute ago isn't. %n goes down into it before they can so much as yelp.",
    "Somethin' that wasn't there when %n walked this way this mornin' snaps shut round their ankle, and pulls.",
    "%n never sees it. One step they're walkin', the next they're caught, and there's nobody near to say sorry.",
    "A board that was only a board gives under %n like a trapdoor, and somethin' underneath has been waitin' all day.",
    "The straw shifts under %n's feet like it's breathin', and then it isn't straw, and it has them.",
    "There was nothin' on that tile. There's somethin' on it now, and it's got %n by the ankles before they've finished the step.",
    "%n puts their foot down, and the farm takes it, and the rest of them with it. Nobody set this one. It set itself."];
  function wildSpring(mn, w, now){
    const r = rec(mn); if (!r || !wildFor(mn)) return false;
    if (now - (r.trapAt || 0) < CFG.WILD.GRACE_S*1000 || heldByTrap(mn) || (state.trapRuns && state.trapRuns.has(mn))) return false;
    const Z = CFG.WILD.ZONES[w.g], spot = Z ? "trap-theme-"+Z.theme : "";
    // what springs: the season's pack now and then, else the place's, else any trap, only ever one that can have them (a
    // blind pick from the season's pack could miss, and a wild trap never misses). Nothin' at all: it lies quiet where it is
    // (Nov 24) now and then it's somethin' else hidin' there: a spider, or behind receivin', the lab (10z8c-spiders.js)
    let odd = null; try { if (!huntOn()) odd = wildOdd(mn, w); } catch(e){ warn("wild trap odd:", e); }
    let pool = [];
    if (!odd){
      try { const sp = spot ? seasonPick(mn, spot) : null; if (sp && Array.isArray(sp.kinds)) pool = sp.kinds.filter(k => TRAP_KINDS[k] && !trapWhyNot(mn, k)); } catch(e){ warn("wild trap season:", e); }
      if (!pool.length && spot) pool = themePool(mn, spot);
      if (!pool.length) pool = Object.keys(TRAP_KINDS).filter(k => k !== "tentacle" && !SEASON_OF[k] && !trapWhyNot(mn, k));
      if (!pool.length) return false;
    }
    const kind = odd ? odd.kind : trapWeighted(mn, pool).kind;
    state.wildRun = state.wildRun || new Map(); state.wildRun.set(mn, now + 30*60000);
    state.wildArea = state.wildArea || new Map(); state.wildArea.set(mn, odd ? odd.area : huntOn() ? "hunt" : (w.g || "barn"));   // (whose kit it leaves: 10z8b-wild-kits.js; a spider's cocoon, the lab's prototype)
    emote("🕳️ "+tFill(pickFor(mn, "wild:open", WILD_OPEN), mn), mn);
    const why = springTrap(mn, kind, spot);
    if (why){ state.wildRun.delete(mn); return false; }
    r.trapAt = now; r.wildN = (r.wildN || 0) + 1;
    audit(BOTMN(), "WILDTRAP", mn+" in "+(w.zone || w.g || "?"));
    wildPlace(w, now); saveLedger();   // (found: it's somewhere else now)
    return true;
  }
  // it's done with them (trapRun's end, 10u-traps.js): the farm stops hittin' harder
  function wildDone(mn){ if (state.wildRun) state.wildRun.delete(mn); if (state.wildArea) state.wildArea.delete(mn); }
  // WHAT IT LEAVES ON THEM (trapGearDone, 10y-farm-gear.js): a whole kit from the place it hid (10z8b-wild-kits.js: blind,
  // deaf, gagged, bound, plugged, belled, chained; a hunt prize in a hunt), and whatever the trap itself leaves where the
  // kit's left room. Every piece stays till somebody else takes it off. Never the same kit twice runnin' for one of them.
  const WILD_CUFFS = { when: "after", slot: "arms", label: "Wild Trap Cuffs", items: ["LeatherCuffs", "SteelCuffs"], opt: "Wrist",
    desc: "Cuffs a wild trap snapped on and locked behind their back. They don't come off for the one wearin' them: somebody else has to." };
  // a limb kit only for those who said yes to it AND whose game has Echo's teleporter (their Companion says so: limbs)
  function wildLimbsFor(mn){ const r = rec(mn), c = state.companions && state.companions.get(mn); return !!(r && r.wildLimbs && c && c.limbs); }
  function wildKitFor(mn){
    const area = (state.wildArea && state.wildArea.get(mn)) || "barn", r = rec(mn), limbs = wildLimbsFor(mn);
    const kits = ((typeof WILD_KITS !== "undefined" && (WILD_KITS[area] || WILD_KITS.barn)) || []).filter(k => !k.limbs || limbs);
    if (!kits.length) return null;
    const fresh = kits.filter(k => !r || k.name !== r.wildKit);
    return (fresh.length ? fresh : kits)[Math.floor(Math.random()*(fresh.length || kits.length))];
  }
  // laced (?traps wild laced on): a piece's dose words go on the end of its description, where their Dispensary (or the
  // farm girl, on the farm) reads them; every line of it fits inside what the game keeps
  const WILD_STAYS = " It stays till somebody else takes it off.";
  function wildDesc(x, laced){ return (x.desc || "")+(laced && x.laced ? " "+x.laced : "")+WILD_STAYS; }
  function wildGear(mn, plan){
    const keep = CFG.WILD.KEEP_DAYS*1440, kit = wildKitFor(mn), used = new Set(), r = rec(mn), laced = !!(r && r.wildLaced);
    const put = (x) => { gearOn(mn, x.slot, x.label, wildDesc(x, laced), keep, "wild", Object.assign({}, x, { keep: true, quiet: true })); used.add(x.slot); };
    for (const x of (kit ? kit.pieces : [])) put(x);
    for (const x of (plan || []).filter(x => x.when === "after" && x.slot && !used.has(x.slot))) put(x);
    if (!used.size) put(WILD_CUFFS);
    if (r && kit){ r.wildKit = kit.name; }
    saveLedger(); syncCompanions(true);
    if (kit && kit.tell) emote("🕳️ "+tFill(kit.tell, mn)+" It'll take somebody else to undo any of it.", mn);
  }
  // their Companion: somebody else took a kept piece off them (the wearer themselves can't: it's put back)
  function wildGearFreed(mn, m){
    const r = rec(mn); if (!r || !r.gear) return;
    const by = Number(m.by), name = String(m.name || "").slice(0, 30);   // (the game keeps 30 letters of a piece's name)
    if (!Number.isFinite(by) || by === mn || !name) return;
    const slot = Object.keys(r.gear).find(s => r.gear[s].keep && String(r.gear[s].label).slice(0, 30) === name); if (!slot) return;
    const label = r.gear[slot].label;
    delete r.gear[slot]; saveLedger(); syncCompanions(true);
    audit(by, "WILDGEAR", mn+" "+label);
    emote("🔓 "+plainName(by)+" takes the "+String(label).toLowerCase()+" off "+plainName(mn)+". It took somebody else to do it.", mn);
  }
  // ?traps wild on|off · ?traps wild limbs on|off · ?traps wild laced on|off · ?trap where (staff). Every one off till they
  // say yes, and every yes says plainly what it means first
  const WILD_WARN = {
    wild: "⚠️ NOT FOR THE FAINT OF HEART. The farm hides traps of its own in the barn, the pasture and receivin', and moves them. Step on one and it has you: no warnin', no breather, the brutal strength, held twice as long, filled half again as full, the filthiest tellin', and half the time it hands you straight on to another. When it lets go it locks a whole kit on you, ten to fifteen pieces: blind, deaf, gagged, bound, plugged, chained. It stays on, in every room, till somebody ELSE takes it off, piece by piece. Your safeword still takes every bit of it off.",
    limbs: "⚠️ NOT FOR THE FAINT OF HEART. A wild trap's kit can take your arms and legs: Echo's Limb Teleportation Device sends them off somewhere on the farm and leaves the rest of you chained up as a torso, milked and used, till somebody else takes it off. Only for a game with Echo's clothing mod in it, and only people with it can see it. Your safeword still brings them back.",
    laced: "⚠️ NOT FOR THE FAINT OF HEART. A wild trap's kit comes laced: heat, let-down, moo, sure-catch, haze, deep throat, denial, sedatives and more, dripped into you from the gear itself for as long as it's on you. Your Dispensary gives them, or the farm girl does on the farm, and its own switches and limits still say which doses take. Your safeword clears them." };
  function wildCommand(sender, args, R){
    const r = rec(sender), a1 = String(args[1] || "").toLowerCase();
    const which = a1 === "limbs" || a1 === "laced" ? a1 : "wild", v = String(which === "wild" ? a1 : (args[2] || "")).toLowerCase();
    const field = { wild: "wildIn", limbs: "wildLimbs", laced: "wildLaced" }[which];
    if (v === "on" || v === "off"){
      if (!r){ R("You'll need to be on the farm's books first, sugar."); return; }
      r[field] = v === "on"; if (which === "wild") delete r.wildOff; saveLedger(); syncCompanions(true);
      if (which === "wild" && !r.wildIn) wildLetGo(sender);   // (off: what a wild trap left comes off too)
      if (which === "wild") R(r.wildIn ? "🕳️ Wild traps: ON for you.\n"+WILD_WARN.wild+"\n?traps wild off takes you back to the ordinary traps." :
        "🕳️ Wild traps: off for you. A wild tile's an ordinary farm trap for you now: that place's traps, with the breather and the reset, and nothin' kept on you after. Anything a wild trap left on you comes off now.");
      else if (which === "limbs") R(r.wildLimbs ? "🦾 Wild traps can take your limbs: ON.\n"+WILD_WARN.limbs+(r.wildIn ? "" : "\nIt only counts with ?traps wild on.")+((state.companions && state.companions.get(sender) || {}).limbs ? "" : "\nYour game hasn't got Echo's clothing mod in it right now, so it'll wait till it has.") :
        "🦾 Wild traps can take your limbs: off. Your arms and legs stay yours.");
      else R(r.wildLaced ? "💉 Laced wild kits: ON.\n"+WILD_WARN.laced+(r.wildIn ? "" : "\nIt only counts with ?traps wild on.") : "💉 Laced wild kits: off. The gear's just gear.");
      return;
    }
    const st = (x) => (x ? "ON" : "off");
    R("🕳️ Wild traps: "+st(r && r.wildIn)+" · they can take your limbs: "+st(r && r.wildLimbs)+" · laced: "+st(r && r.wildLaced)+". All off till you say so.\n"+WILD_WARN.wild+
      "\nOff, a wild tile's an ordinary farm trap for you. ?traps wild on|off · ?traps wild limbs on|off · ?traps wild laced on|off");
  }
  function wildWhereText(){
    const ws = Array.isArray(L.wild) ? L.wild : [], now = Date.now();
    if (!ws.length) return "🕳️ No wild traps out: "+(wildZones().length ? "they'll be out at the next heartbeat." : "there are no barn, pasture or receiving zones on the map for them.");
    return "🕳️ WILD TRAPS (staff only: nobody else is told)\n"+ws.map(w => "• "+(w.zone || w.g)+" at "+w.X+","+w.Y+", movin' in "+Math.max(0, Math.round(((w.moveAt || now) - now)/60000))+" min").join("\n");
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __wildTick: (t) => wildTick(t || Date.now()), __wild: () => L.wild, __wildOn: (m) => wildOn(m),
    __wildKitFor: (m, area) => { state.wildArea = state.wildArea || new Map(); state.wildArea.set(m, area); const k = wildKitFor(m); state.wildArea.delete(m); return k; },
    __wildDesc: (x, laced) => wildDesc(x, laced), __companionSet: (m, c) => { state.companions.set(m, Object.assign(state.companions.get(m) || { ver: "test" }, c)); } });
