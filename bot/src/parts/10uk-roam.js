  /* WHAT'S IN THIS FILE (10uk-roam.js)
     ROAM PASSES, and the summon with some bite (Laynie, Oct 24: "I need to give the contracts with a ready to be summoned
     rule some bite. I think the bot needs to detect when pets are online, and where they are, then if I let them roam and
     have maybe 4-6 periods a day where they are allowed to roam for a hour, the bot summons them back"; and "pick when
     they roam, which will need to figure out how to enforce the prevent leaving rules in a different way").
     • Who: anybody holdin' a farm contract with BC+'s Ready to be summoned rule. Every new contract carries it (with the
       farm girl and staff as summoners) in place of Forbid leaving the room: the farm girl is the fence now.
     • Where they are: the server's online friends list (they must be friends with her both ways) names each one's room.
     • Passes are earned: ?buy roampass, ROAM_PASS_PRICE ribbons for an hour (Laynie: "instead of a daily allotment, could have
       them earn to buy a hour roaming pass"), up to ROAM_PASS_HOLD at a time; a herd leader can give one. ROAM_PASSES can
       still hand out free ones a day by level (none by default). ?roam starts one (or the Companion's Roam button);
       walkin' off the farm without one starts one by itself while they hold any.
     • The fence is the farm room: the whole map is theirs to wander, zones and all. Leavin' the room is what needs a pass.
     • The bite: a whisper at 10 minutes left and at 2, then she summons them home. Off the farm with no pass left: a
       minute's grace, then summoned. Late, or slippin' off, costs a naughty mark and ROAM_FINE ribbons, and their herd
       leader hears. Still out after a summon: she tries again every ROAM_RESUMMON_MIN.
     • Never: right after a safeword (ROAM_SAFE_MIN), once their contract's over, or while they're offline.
     • ?roam · ?roam start · ?roam back · ?roam give <who> [n] (herd leader or staff: extra passes today) · ?roam <who>
  */
  function roamContract(mn){
    contractsLedger();
    const now = Date.now();
    return L.contracts.filter(x => x.mn === mn && x.status === "signed" && (!x.until || x.until > now) && (x.rules || []).includes("other.summon"))
      .sort((a, b) => (CFG.ROAM_PASSES[b.depth] || 0) - (CFG.ROAM_PASSES[a.depth] || 0))[0] || null;
  }
  function roamOf(mn){
    const r = rec(mn); if (!r) return null;
    const day = dayKey();
    if (!r.roam || r.roam.day !== day) r.roam = { day, used: 0, give: 0, until: (r.roam && r.roam.until > Date.now()) ? r.roam.until : 0 };
    return r.roam;
  }
  // today's free ones (by level, none by default) plus the ones they hold (bought, or given)
  const roamFree = (mn, x) => (CFG.ROAM_PASSES[(x || roamContract(mn) || {}).depth] || CFG.ROAM_PASSES.custom || 0);
  const roamHeld = (mn) => (rec(mn) || {}).roamPasses || 0;
  const roamPasses = (mn, x) => roamFree(mn, x) + roamHeld(mn);
  const roamLeft = (mn) => Math.max(0, roamFree(mn) - ((roamOf(mn) || {}).used || 0)) + roamHeld(mn);
  const clockOf = (t) => { const d = new Date(t); return String(d.getHours()).padStart(2, "0")+":"+String(d.getMinutes()).padStart(2, "0"); };
  // where they are right now: "here", "away" (online in another room, or in no room), or "" (offline / can't tell)
  function roamWhere(mn){
    if (charFor(mn)) return "here";
    const m = state.mutual; if (!m || !m.set || !m.set.has(mn) || Date.now() - m.at > 5 * 60000) return "";
    const w = state.where && state.where.get(mn);
    return w && w.room === CFG.ROOM_NAME ? "here" : "away";
  }
  function roamStart(mn, auto){
    const g = roamOf(mn); if (!g) return false;
    if (g.until > Date.now()) return true;
    if (roamLeft(mn) <= 0) return false;
    if (g.used < roamFree(mn)) g.used++; else { const r = rec(mn); r.roamPasses = Math.max(0, (r.roamPasses || 0) - 1); }
    g.wentAt = auto ? Date.now() : 0;
    g.until = Date.now() + CFG.ROAM_PASS_MIN * 60000; g.warned = []; g.strayAt = 0; saveLedger(); syncCompanions(true);
    const back = clockOf(g.until), left = roamLeft(mn);
    beep(mn, auto ? "🧭 You wandered off the farm, sugar, so that's a roam pass spent. Back by "+back+". "+left+" left."
                  : "🧭 Off you go, sugar. You've got an hour: back by "+back+", or I'll fetch you. "+left+" left.");
    audit(mn, "ROAM_START", auto ? "auto" : "asked");
    return true;
  }
  // BC+'s Ready to be summoned: a beep that starts with the summon text, with my room attached
  function roamSummon(mn, why){
    const g = roamOf(mn); if (!g) return;
    g.summonedAt = Date.now(); saveLedger();
    send("AccountBeep", { MemberNumber: mn, BeepType: "", IsSecret: false, Message: "summon · "+why });
    log("ROAM: summoned "+mn+" ("+why+")");
  }
  function roamPenalty(mn, what){
    const r = rec(mn); if (!r) return;
    r.naughtyMarks = (r.naughtyMarks || 0) + 1;
    try { fineRibbons(mn, CFG.ROAM_FINE, what, CFG.BOT_MEMBER); } catch(e){}
    saveLedger(); audit(mn, "ROAM_LATE", what);
    for (const h of herdsOf(mn)) if (h.leader && h.leader !== mn) tell(h.leader, "🧭 "+plainName(mn)+" "+what+". I've fetched 'em home: a naughty mark and "+CFG.ROAM_FINE+" ribbon"+(CFG.ROAM_FINE === 1 ? "" : "s")+".");
  }
  function roamTick(){
    if (!CFG.ROAM_ON || !inRoom()) return;
    const now = Date.now();
    if (now - (state.roamTickAt || 0) < 15000) return; state.roamTickAt = now;
    contractsLedger();
    const pets = [...new Set(L.contracts.filter(x => x.status === "signed" && (!x.until || x.until > now) && (x.rules || []).includes("other.summon")).map(x => x.mn))];
    for (const mn of pets){
      const r = rec(mn), g = roamOf(mn); if (!r || !g) continue;
      if (r.roamSafeUntil > now) continue;   // just safeworded: nobody's fetchin' them
      const where = roamWhere(mn);
      if (where === "here"){
        if (g.until > now && g.wentAt){ g.until = 0; g.wentAt = 0; saveLedger(); syncCompanions(true); tell(mn, "🧭 Welcome home, sugar. That pass is spent; "+roamLeft(mn)+" left."); }
        g.strayAt = 0; g.summonedAt = 0;
        continue;
      }
      if (where !== "away") continue;   // offline, or I can't tell: nothin' to do
      if (g.until > now){
        if (!g.wentAt){ g.wentAt = now; saveLedger(); }   // they've actually gone (a pass started on the farm keeps till they're back from it)
        const mins = Math.ceil((g.until - now) / 60000);
        for (const w of CFG.ROAM_WARN_MIN) if (mins <= w && !(g.warned || []).includes(w)){
          g.warned = (g.warned || []).concat(w); saveLedger();
          beep(mn, w > 2 ? "🧭 "+mins+" minutes left on your pass, sugar. Start headin' home." : "🧭 "+mins+" minutes, sugar. Be back on the farm or I'm comin' to get you.");
          break;
        }
        continue;
      }
      if (g.summonedAt){ if (now - g.summonedAt > CFG.ROAM_RESUMMON_MIN * 60000) roamSummon(mn, "Still not home, sugar. Back to the farm."); continue; }
      if (g.until && g.until <= now){
        g.until = 0;
        beep(mn, "🧭 Time's up, sugar. Home you come.");
        roamSummon(mn, "Your roam's over. Home to the farm.");
        roamPenalty(mn, "was late back from their roam");
        continue;
      }
      if (roamStart(mn, true)) continue;
      // no passes left: a minute's grace, then fetched
      if (!g.strayAt){ g.strayAt = now; saveLedger(); beep(mn, "🧭 You haven't got a roam pass, sugar. Get yourself back to the farm in the next minute, or I'll fetch you."); continue; }
      if (now - g.strayAt >= CFG.ROAM_GRACE_S * 1000){
        roamSummon(mn, "No passes left today. Home to the farm.");
        roamPenalty(mn, "slipped off the farm with no roam passes left");
      }
    }
  }
  function roamCommand(sender, args, R){
    const a0 = String(args[0] || "").toLowerCase();
    if (a0 === "give"){
      const t = resolveTarget(args[1]), n = Math.max(1, Math.min(6, parseInt(args[2], 10) || 1));
      if (!t || !rec(t)){ R("?roam give <who> [n]: extra roam passes for today."); return; }
      if (!isStaff(sender) && !herdsOf(t).some(h => h.leader === sender)){ R("Only "+plainName(t)+"'s herd leader or staff hand out passes, sugar."); return; }
      const g = roamOf(t), rt = rec(t); rt.roamPasses = (rt.roamPasses || 0) + n; g.strayAt = 0; saveLedger(); syncCompanions(true); audit(sender, "ROAM_GIVE", t+" "+n);
      R("🧭 "+plainName(t)+" has "+n+" more roam pass"+(n === 1 ? "" : "es")+" ("+roamLeft(t)+" now).");
      tell(t, "🧭 "+plainName(sender)+" gave you "+n+" roam pass"+(n === 1 ? "" : "es")+", sugar. An hour off the farm each: ?roam start.");
      return;
    }
    const other = a0 && !["start", "go", "now", "on", "back", "home", "end", "off"].includes(a0) ? resolveTarget(args[0]) : null;
    const t = other || sender;
    if (other && other !== sender && !isStaff(sender) && !herdsOf(other).some(h => h.leader === sender)){ R("Only staff or their herd leader look at somebody else's passes, hon."); return; }
    const x = roamContract(t);
    if (!x){ R(t === sender ? "🧭 You're not under a contract that has you ready to be summoned, sugar, so you come and go as you please." : "🧭 "+plainName(t)+" isn't under a summonable contract."); return; }
    const g = roamOf(t), now = Date.now();
    if (!other && ["start", "go", "now", "on"].includes(a0)){
      if (g.until > now){ R("🧭 You're already roamin', sugar: back by "+clockOf(g.until)+"."); return; }
      if (!roamStart(sender, false)) R("🧭 You haven't got a roam pass, sugar. ?buy roampass, "+CFG.ROAM_PASS_PRICE+" ribbons for an hour, or your herd leader can give you one.");
      return;
    }
    if (!other && ["back", "home", "end", "off"].includes(a0)){
      if (g.until > now){ g.until = 0; saveLedger(); syncCompanions(true); R("🧭 Pass ended, sugar. "+roamLeft(sender)+" left."); }
      else R("🧭 You're not roamin' right now.");
      return;
    }
    R("🧭 "+(t === sender ? "Your" : plainName(t)+"'s")+" roam passes: "+roamLeft(t)+", an hour off the farm each (?buy roampass, "+CFG.ROAM_PASS_PRICE+" ribbons)"+(g.until > now ? " · roamin' now, back by "+clockOf(g.until) : "")+
      ". "+(t === sender ? "?roam start, then go where you like; walk off the farm and one starts by itself. Late back, or out with none left, and I fetch you." : ""));
  }
  function roamState(mn){
    const x = roamContract(mn); if (!x) return null;
    const g = roamOf(mn);
    return { left: roamLeft(mn), of: roamPasses(mn, x), until: g.until > Date.now() ? g.until : 0, price: CFG.ROAM_PASS_PRICE };
  }
