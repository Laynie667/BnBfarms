  /* WHAT'S IN THIS FILE (10t-contract-watch.js)
     Contracts keep ?signed honest, and new approvals have 48 hours to sign one.
     • When somebody signs a farm contract the bot offered (BC+ tells us), their record is marked signed. When
       their last farm contract ends (runs out, is released, or BC+ no longer lists it), it's marked unsigned.
       ?signed still works by hand for anything else.
     • Everybody approved from now on (stock and guests, not staff) has CFG.CONTRACT_GRACE_H (48) hours to sign a
       farm contract. Reminders at 24 and 4 hours left, to them and to staff. If none is signed in time they're
       taken off the books and off the room whitelist, like ?unregister. People approved before this aren't touched.
  */
  function hasSignedContract(mn){ contractsLedger(); return L.contracts.some(x => x.mn === mn && x.status === "signed" && (!x.until || x.until > Date.now())); }
  // a farm contract was signed: the record says so, and the clock stops
  function contractSignedNow(mn){
    const r = rec(mn); if (!r) return;
    r.contractSigned = true; r.contractAuto = true;
    if (r.contractBy){ delete r.contractBy; delete r.contractWarned; }
    saveLedger(); audit(CFG.BOT_MEMBER, "CONTRACT", mn+" signed (auto)");
  }
  // a farm contract ended: unsigned, if it was their last
  function contractEndedNow(mn){
    const r = rec(mn); if (!r || hasSignedContract(mn)) return;
    if (r.contractSigned){ r.contractSigned = false; saveLedger(); audit(CFG.BOT_MEMBER, "CONTRACT", mn+" unsigned (contract ended)"); }
  }
  function contractWatchTick(){
    const now = Date.now();
    if (now - (state.cwAt || 0) < 60000) return;
    state.cwAt = now;
    contractsLedger();
    // signed contracts that ran out
    for (const x of L.contracts){
      if (x.status === "signed" && x.until && x.until <= now){ x.status = "ended"; x.endedAt = now; saveLedger(); contractEndedNow(x.mn); }
    }
    // new approvals that haven't signed
    for (const [k, r] of Object.entries(L.people)){
      if (!r.contractBy) continue;
      const mn = parseInt(k, 10);
      if (hasSignedContract(mn) || r.contractSigned){ delete r.contractBy; delete r.contractWarned; saveLedger(); continue; }
      const left = r.contractBy - now;
      r.contractWarned = r.contractWarned || {};
      for (const h of [24, 4]){
        if (left <= h*3600000 && left > 0 && !r.contractWarned[h]){
          r.contractWarned[h] = now; saveLedger();
          tell(mn, "📜 "+plainName(mn)+", you've got about "+h+" hours left to sign a farm contract. Without one, I'll have to take you off the books. Ask staff, or ?contract to see what's waitin' for you.");
          notifyStaff("📜 "+plainName(mn)+" ("+mn+") has about "+h+" hours left to sign a farm contract, or they come off the books.", true);
        }
      }
      if (left <= 0) unbookUnsigned(mn);
    }
  }
  // off the books for never signing (same as ?unregister, by the bot)
  function unbookUnsigned(mn){
    const r = rec(mn); if (!r) return;
    if (CFG.PROPRIETORS.includes(mn) || isStaff(mn)) { delete r.contractBy; saveLedger(); return; }
    for (const k in L.people){ const p = L.people[k]; if ((p.herds||[]).some(h => h.leader === mn)) p.herds = p.herds.filter(h => h.leader !== mn); }
    L.archive[mn] = JSON.parse(JSON.stringify(r));
    delete L.people[mn];
    saveLedger(); audit(CFG.BOT_MEMBER, "UNREGISTER", mn+" (no contract within "+CFG.CONTRACT_GRACE_H+"h)");
    try { pushKeys(mn, [], true); } catch(e){}
    whitelistSync(true);
    beep(mn, "📜 No farm contract was signed in your first "+CFG.CONTRACT_GRACE_H+" hours, "+plainName(mn)+", so I've taken you off the books and the room's whitelist. Your paperwork's kept safe in the drawer. Apply again any time you're ready to sign, sweetie.");
    notifyStaff("📜 "+plainName(mn)+" ("+mn+") never signed a contract, so they're off the books and the whitelist now. Their paperwork's archived.", true);
  }
