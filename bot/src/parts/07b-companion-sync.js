  /* ── Companion sync: the panel's picture of you, kept fresh ──
     Every Companion in the room gets a `state` snapshot: roles, keys, switches and numbers.
     I only send it again when somethin' in it changed. */
  // ledger field → the command that flips it
  const SWITCH_CMDS = { breedable:"breedable", fertile:"fertile", jarok:"jarok", freeuse:"freeuse", futa:"futa",
                        milkable:"milkable", naturalHeat:"naturalheat", praise:"praise", degrade:"degrade",
                        tally:"tally", teaseOptIn:"teaseme", forced:"forced" };
  // staff lookups about somebody else go to the Companion's Office tab
  const DOC_CMDS = ["record","stats","vet","quota","keys","size","measure","pedigree"];

  function stateFor(mn){
    const r = rec(mn);
    const base = { name: plainName(mn), onBooks: !!(r && r.roles && r.roles.length) };
    if (!base.onBooks) return base;
    const s = Object.assign(base, {
      roles: r.roles.slice(), tier: tierOf(mn) || "", species: r.species || "",
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
      if (makesSemen(mn)) s.semen = { ml: Math.round(p.semen), cap: Math.round(semenCap(mn)) };
      s.holding = { ml: Math.round(heldTotal(p)), cap: Math.round(capacity(mn)) };
      s.body = bodyParts(mn).filter(k => CFG.SIZES[k]).map(k => ({ part: k, label: CFG.SIZES[k].label, size: sizeName(mn, k) }));
      if (inHeat(p)) s.heatUntil = p.heat.until;
      if (p.preg) s.preg = { due: p.preg.due, sires: p.preg.sires.map(plainName) };
      if (quotaOf(mn)) s.quota = { ml: Math.round(milkedOn(mn, dayKey())), goal: Math.round(quotaOf(mn)), streak: r.quotaStreak || 0 };
      s.today = { tally: tallyToday(mn), naughty: r.naughtyMarks || 0, praised: r.praised || 0, degraded: r.degraded || 0 };
      s.at = now;
    } catch(e){ dbg("stateFor:", e); }
    return s;
  }

  // send each connected Companion its state, if it changed since last time (force: send anyway)
  function syncCompanions(force){
    for (const [mn, c] of state.companions){
      if (!hasCompanion(mn)) continue;
      const s = stateFor(mn), key = JSON.stringify(Object.assign({}, s, { at: 0 }));
      if (!force && c.lastState === key) continue;
      c.lastState = key;
      enqueue(makeMsg("state", { state: s }, mn));
    }
  }

  // a yes/no question: buttons in the Companion, a plain message for everybody else
  function askCard(mn, kind, text){
    if (hasCompanion(mn)) enqueue(makeMsg("ask", { kind, text, id: ++companionSeq }, mn));
    else tell(mn, text);
  }

