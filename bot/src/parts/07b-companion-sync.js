  /* WHAT'S IN THIS FILE (07b-companion-sync.js)
     What the Companion panel is told about you: roles, keys, switches, milk, body, gear, plus the staff
     data (herd, zones, tease lines, voice, shift). Sent only when it changes.
  */
  /* ── Companion sync: the panel's picture of you, kept fresh ──
     Every Companion in the room gets a `state` snapshot: roles, keys, switches and numbers.
     I only send it again when somethin' in it changed. */
  // ledger field → the command that flips it
  const SWITCH_CMDS = { breedable:"breedable", fertile:"fertile", jarok:"jarok", freeuse:"freeuse", futa:"futa",
                        milkable:"milkable", naturalHeat:"naturalheat", praiseMe:"praise", degradeMe:"degrade",
                        tally:"tally", teaseOptIn:"teaseme", forced:"forced", hypno:"hypno" };
  // staff lookups about somebody else go to the Companion's Office tab
  const DOC_CMDS = ["record","stats","vet","quota","keys","size","measure","pedigree"];

  function stateFor(mn){
    // proprietors named in CFG.PROPRIETORS are staff even if their record lists no roles (or they have no record yet)
    const staff = isStaff(mn);
    const r = rec(mn, staff);
    if (r && !r.roles) r.roles = [];
    const base = { name: plainName(mn), onBooks: !!(r && (r.roles.length || staff)) };
    if (!base.onBooks) return base;
    const s = Object.assign(base, {
      roles: r.roles.slice(), tier: tierOf(mn) || "", species: r.species || "", gender: r.gender || "",
      staff: isStaff(mn), herdmaster: isHerdmaster(mn), proprietor: isProprietor(mn), mandated: isMandated(mn),
      onDuty: r.onDuty !== false, onCall: isStaff(mn) && (isMandated(mn) || !!r.forced),
      pastureLock: r.pastureLock ? plainName(r.pastureLock.by) : null,
      keys: keysOf(mn), herdLeader: herdLeaderOf(mn) ? plainName(herdLeaderOf(mn)) : null,
      switches: {}
    });
    for (const k in SWITCH_CMDS) s.switches[SWITCH_CMDS[k]] =
      k === "jarok" ? r.jarok !== false : k === "milkable" ? makesMilk(mn) : !!r[k];
    try {
      const p = prodOf(mn), now = Date.now();
      // milk rounds to 10 mL so a slowly fillin' udder doesn't resend every minute
      if (makesMilk(mn)) s.milk = { ml: Math.round(p.milk/10)*10, cap: Math.round(milkCap(mn)), grade: milkGrade(mn), lastAt: p.lastMilkAt || 0 };
      if (p.stall && p.stall.until) s.stallUntil = Math.ceil(p.stall.until / 60000) * 60000;   // milkin' stall timer (to the minute)
      if (makesSemen(mn)) s.semen = { ml: Math.round(p.semen), cap: Math.round(semenCap(mn)) };
      s.holding = { ml: Math.round(heldTotal(p)), cap: Math.round(capacity(mn)) };
      s.body = bodyParts(mn).filter(k => CFG.SIZES[k]).map(k => ({ part: k, label: CFG.SIZES[k].label, size: sizeName(mn, k) }));
      if (inHeat(p)) s.heatUntil = p.heat.until;
      if (p.preg) s.preg = { due: p.preg.due, sires: p.preg.sires.map(plainName) };
      if (quotaOf(mn)) s.quota = { ml: Math.round(milkedOn(mn, dayKey())), goal: Math.round(quotaOf(mn)), streak: r.quotaStreak || 0 };
      const g = gearOf(mn);   // the milkin' gear they're in right now
      if (g.milk || g.machine || g.funnel) s.gear = { milk: g.milk || null, machine: g.machine || null, funnel: !!g.funnel };
      s.today = { tally: tallyToday(mn), naughty: r.naughtyMarks || 0, praised: r.praised || 0, degraded: r.degraded || 0 };
      s.at = now;
      if (isStaff(mn)) Object.assign(s, staffStateFor(mn));
      const mods = addonStateFor(mn); if (mods) s.mods = mods;
      const ac = addonCommandGroups(mn); if (ac.length) s.addonCmds = ac;   // the Guides tab lists these too   // add-on cards for the "Farm extras" tab
      if (isProprietor(mn)){   // the Dashboard's outfit slots (no outfit data, just what's there)
        outfitsLedger();
        s.outfits = {}; for (const [k, o] of Object.entries(L.outfits)) s.outfits[k] = { items: o.items, locks: o.locks, at: o.at };
        s.outfitRules = Object.assign({}, L.outfitRules);
      }
    } catch(e){ dbg("stateFor:", e); }
    return s;
  }

  // what the Staff panel's Herd, Shift, Zones, Tease lines and Voice tabs show
  function staffStateFor(mn){
    const out = {}, here = (W.ChatRoomCharacter||[]).map(c => c.MemberNumber).filter(m => m !== CFG.BOT_MEMBER && rec(m) && rec(m).roles.length);
    out.herd = here.slice(0, 40).map(m => {
      const r = rec(m), p = prodOf(m);
      return { mn: m, name: plainName(m), role: (r.roles[0]||"").toLowerCase(), where: whereName(m) || "",
               milk: makesMilk(m) ? Math.round(100*p.milk/Math.max(1, milkCap(m))) : null, heat: inHeat(p), preg: !!p.preg,
               denied: milkDenied(m), mine: herdLeaderOf(m) === mn, onDuty: r.onDuty !== false };
    });
    const r = rec(mn), wk = weekKey(), week = (r.shift && r.shift.week && r.shift.week.key === wk) ? r.shift.week.ms : 0;
    out.shift = { clocked: clockedIn(mn), weekH: Math.round(10*(week + (clockedIn(mn) ? Date.now() - r.shift.in : 0))/3600000)/10,
                  onDuty: here.filter(m => isStaff(m) && onDuty(m)).map(plainName),
                  onCall: forcedStaff().map(m => ({ name: plainName(m), mandated: isMandated(m), here: !!charFor(m) })) };
    if (isHerdmaster(mn)){
      zonesLedger();
      out.zones = L.zones; out.spots = L.spots || {};   // name → {X,Y}, drawn on the Zones map
      out.tease = (L.tease || []).slice(0, 60).map(x => x.text);
      out.teaseOpted = Object.values(L.people).filter(x => x.teaseOptIn).length;
      out.log = (L.log || []).slice(-10).reverse().map(e => ({ t: e.t, a: e.a, by: plainName(e.by), d: String(e.d||"").slice(0, 40) }));
    }
    if (canHoldHerd(mn)){
      voiceLedger();
      const members = Object.keys(L.people).map(Number).filter(m => herdLeaderOf(m) === mn);
      out.voice = { herd: L.voice.herd[mn] || { on:false, lines:[], every:"15" },
                    members: members.slice(0, 40).map(m => Object.assign({ mn: m, name: plainName(m), hypno: !!rec(m).hypno }, L.voice.member[m] || { on:false, lines:[], every:"15" })) };
    }
    // the Queue tab: applications waitin', and how the bot's messages are doin'
    out.apps = (L.applications || []).slice(0, 30).map((a, i) => ({ n: i + 1, mn: a.mn, name: a.name, at: a.at, staffTrack: !!a.staffTrack,
      sum: ["role","species","gender","stay","depth"].map(k => appAnswer(a, k) || "?").join(" · ") }));
    out.mail = { sending: state.queue.length + state.urgent.length, held: Object.keys(L.mailbox || {}).length,
                 beepable: state.mutual ? state.mutual.set.size : null };
    return out;
  }

  // send each connected Companion its state, if it changed since last time (force: send anyway)
  function syncCompanions(force){
    for (const [mn, c] of state.companions){
      if (!hasCompanion(mn)) continue;
      let s; try { s = stateFor(mn); } catch(e){ warn("state for "+mn+":", e); continue; }   // one bad record never stalls everyone's panel
      const key = JSON.stringify(Object.assign({}, s, { at: 0 }));
      if (!force && c.lastState === key) continue;
      c.lastState = key;
      enqueue(makeMsg("state", { state: s }, mn));
    }
  }

  // a yes/no question: buttons in the Companion, a plain message for everybody else
  function askCard(mn, kind, text){
    if (hasCompanion(mn)){
      enqueue(makeMsg("ask", { kind, text, id: ++companionSeq }, mn));
      // a question can't wait for them to open the panel: a short beep points them at it
      if (canBeep(mn)) send("AccountBeep", { MemberNumber:mn, BeepType:"", Message:"❓ A yes/no question is waitin' in your 🌾 panel: "+String(text).slice(0, 160) });
    }
    else tell(mn, text);
  }

