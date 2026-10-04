  /* WHAT'S IN THIS FILE (10e-gear.js)
     Milkin' gear read off people: BC Lactation Pump, Echo's pump and milk vendor (only when switched
     on), fuck machine / Sybian (and a jar loaded into them), funnel gags. Milks at matchin' rates with
     emotes.
  */
  /* ═══════════ MILKING GEAR ═══════════
     What people are wearin' anywhere on the farm, read straight off them:
       BC Lactation Pump (ItemNipples) · Echo's portable breast pump (ItemTorso "便携乳泵") ·
       Echo's milk vendor (ItemDevices "奶贩") · BC Fuck Machine and Sybian (ItemDevices) · BC Funnel Gag
     Pumps and the vendor milk 'em at CFG.GEAR rates, with emotes now and then. Machines can carry a
     loaded seed jar (?machine load), and a fitted funnel gag is a fine place to finish. */
  const typeRec = it => (it && it.Property && it.Property.TypeRecord) || {};
  function wornItem(mn, group, name){
    const C = charFor(mn);
    return C && Array.isArray(C.Appearance) ? C.Appearance.find(x => x && x.Asset && x.Asset.Group && x.Asset.Group.Name === group && x.Asset.Name === name) || null : null;
  }
  function funnelOn(mn){
    const C = charFor(mn);
    return !!(C && Array.isArray(C.Appearance) && C.Appearance.find(x => x && x.Asset && x.Asset.Name === "FunnelGag" &&
      x.Property && (x.Property.Type === "Funnel" || typeRec(x).typed === 1)));
  }
  // { milk: { kind, name, level 1-4, ml a minute }, machine: { name, intensity 0-3 }, funnel }
  function gearOf(mn){
    const C = charFor(mn), g = {};
    if (!C) return g;
    const pump = wornItem(mn, "ItemNipples", "LactationPump");
    if (pump){
      const lv = Math.min(4, Number(pump.Property && pump.Property.SuctionLevel) || Number(typeRec(pump).typed) || 0);
      if (lv > 0) g.milk = { kind: "pump", name: "lactation pump", level: lv, ml: CFG.GEAR.PUMP_ML[lv] };
    }
    // Echo's pump and vendor: the cup bein' attached ("s"/"m" module) isn't the same as runnin'.
    // They're vibratin'-type items, so the strength they're set to (Intensity, -1 = off) is what counts.
    const arousal = Math.max(0, Math.min(100, (C.ArousalSettings && C.ArousalSettings.Progress) || 0));
    const intensityOf = it => (it && it.Property && typeof it.Property.Intensity === "number") ? it.Property.Intensity : -1;
    const echo = (name, it) => {
      const i = intensityOf(it);   // 0-3 once it's switched on
      const mix = Math.min(1, 0.6*i/3 + 0.4*arousal/100);   // mostly the setting, a bit how worked up they are
      return { kind: "echo", name, level: i + 1, ml: Math.round(CFG.GEAR.ECHO_ML_MIN + (CFG.GEAR.ECHO_ML_MAX - CFG.GEAR.ECHO_ML_MIN)*mix) };
    };
    const ep = wornItem(mn, "ItemTorso", "便携乳泵");
    if (!g.milk && ep && typeRec(ep).s === 0 && intensityOf(ep) >= 0) g.milk = echo("portable breast pump", ep);
    const ev = wornItem(mn, "ItemDevices", "奶贩");
    if (!g.milk && ev && typeRec(ev).m === 1 && intensityOf(ev) >= 0) g.milk = echo("milk vendor", ev);
    for (const [n, label] of [["FuckMachine", "fuck machine"], ["Sybian", "Sybian"]]){
      const m = wornItem(mn, "ItemDevices", n), i = m && m.Property && typeof m.Property.Intensity === "number" ? m.Property.Intensity : -1;
      if (m) g.machine = { name: label, intensity: i };
    }
    g.funnel = funnelOn(mn);
    return g;
  }

  const GEAR_LINES = {
    pump: [
      ["The lactation pump on %n%'s nipples gives a soft, steady little tug. Milk beads and drips into the bottles, +%ml%.",
       "%n%'s pump hums along nice and gentle, coaxin' out warm milk a drop at a time, +%ml%."],
      ["The lactation pump pulls in a slow, firm rhythm, and %n%'s teats stretch into the cups with every draw, +%ml%.",
       "Milk runs in steady streams down the pump's tubes from %n%'s swollen nipples, +%ml%."],
      ["The pump on %n% sucks hard, stretchin' those nipples long, and the bottles fill fast. %n% squirms in it, +%ml%.",
       "%n%'s lactation pump is cranked up high. Every pull wrings a hot spurt of milk out of 'em, +%ml%."],
    ],
    echo: [
      ["The %g% on %n% sighs along, and a thin line of milk creeps up the hose, +%ml%.",
       "%n%'s %g% works slow and patient. Drip, drip, into the tank, +%ml%."],
      ["Milk flows steady up the %g%'s hose from %n%'s teats, and the tank's fillin' nicely, +%ml%.",
       "The %g% has %n% let down good now: warm milk pulses up the line with every pull, +%ml%."],
      ["%n% is so worked up the %g% can barely keep up. Milk gushes up the hoses into the tank, +%ml%.",
       "The %g%'s tank sloshes as %n%, flushed and needy, pours milk into it, +%ml%."],
    ],
    machine: [
      "The %g% under %n% ticks over slow, just enough to keep 'em squirmin'.",
      "The %g% works %n% in a steady rhythm. They can't sit still.",
      "The %g% pounds away at %n%. They're a moanin', shakin' mess on it.",
      "The %g% is flat out, and %n% is wailin'. Somebody's gonna have to peel 'em off it.",
    ],
  };
  function gearLine(mn, kind, level, name, mlGot){
    const alt = addonLine(kind, lineInfo(mn, { level, gear: name, ml: ml(mlGot || 0) }));   // the dairy add-on's lines, if it's in
    if (alt) return alt;
    const set = kind === "machine" ? GEAR_LINES.machine : GEAR_LINES[kind][level <= 1 ? 0 : level <= 2 ? 1 : 2];
    const raw = kind === "machine" ? set[Math.max(0, Math.min(3, level))] : set[Math.floor(Math.random()*set.length)];
    return raw.replace(/%n%/g, plainName(mn)).replace(/%g%/g, name).replace(/%ml%/g, ml(mlGot || 0));
  }

  // every heartbeat: pumps and the vendor milk, machines run (and may carry a loaded jar), with emotes now and then
  function gearTick(){
    const dtMin = CFG.HEARTBEAT_MS/60000, now = Date.now();
    state.machineLoads = state.machineLoads || new Map();
    for (const C of (W.ChatRoomCharacter||[])){
      const mn = C.MemberNumber;
      if (mn === CFG.BOT_MEMBER || !rec(mn)) continue;
      const g = gearOf(mn), p = prodOf(mn), jitter = () => CFG.GEAR.EMOTE_MIN*60000*(0.75 + Math.random()*0.5);
      if (g.milk && makesMilk(mn) && !milkDenied(mn)){
        const got = drainMilk(mn, g.milk.ml * dtMin);
        p.gearMl = (p.gearMl || 0) + got;
        if (got > 0 && now >= (p.gearNext || 0)){ p.gearNext = now + jitter(); emote("🥛 "+gearLine(mn, g.milk.kind, g.milk.level, g.milk.name, p.gearMl), mn); sound(mn, "pump"); p.gearMl = 0; }
        if (got > 0 && p.milk < 1 && !p.gearDry){ p.gearDry = true; emote("🥛 "+(addonLine("gearDry", lineInfo(mn, { gear: g.milk.name })) || "The "+g.milk.name+" pulls "+plainName(mn)+" plumb dry. Every last drop's in the tank, sugar.")); }
        if (p.milk >= 1) p.gearDry = false;
      }
      if (g.machine && g.machine.intensity >= 0){
        const load = state.machineLoads.get(mn);
        if (load && now - load.at > CFG.GEAR.MACHINE_LOAD_MIN*60000) state.machineLoads.delete(mn);
        else if (load){
          state.machineLoads.delete(mn);
          const err = inseminate(load.staff, mn, load.jar, load.hole, g.machine.name);
          if (err) tell(load.staff, "⚙️ The "+g.machine.name+" couldn't do it: "+err);
        }
        if (now >= (p.machineNext || 0)){ p.machineNext = now + jitter(); emote("⚙️ "+gearLine(mn, "machine", g.machine.intensity, g.machine.name), mn); sound(mn, "machine"); }
      }
    }
  }

