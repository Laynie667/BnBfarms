  /* ───────────── heartbeat ───────────── */

  function heartbeat(){
    try {
      if (typeof W.ServerSend!=="function"){ setBadge("game not found","#ff9b9b"); watchdog(); return; }
      attachListeners();

      if (!isLoggedIn()){ setBadge("logging in…","#ffc49b"); tryLogin(); watchdog(); return; }
      if (!inRoom()){ setBadge("joining room…","#ffc49b"); tryEnterRoom(); watchdog(); return; }

      // healthy
      state.lastHealthy = Date.now();
      state.reloading = false;

      const admin = botIsAdmin();
      let fl = 0; try { fl = (W.Player.FriendList||[]).length; } catch(e){}
      const oc = forcedStaff().length;
      setBadge("on duty — "+Object.keys(L.people).length+" reg · "+fl+" friends · "+oc+" on call"+
               (admin?"":" ⚠️NOT ADMIN"), admin ? "#b8ff9b" : "#ffc49b");

      keepalive();
      nudge();
      expireHerdClaims();
      snapshotRoom(false);

      for (const [mn,pc] of state.pendingClaims)
        if (Date.now() - pc.at > CFG.CLAIM_ASK_TIMEOUT_MIN*60000) state.pendingClaims.delete(mn);

      if (CFG.KEY_SYNC_ENABLED && admin && Date.now()-state.lastFullSync > CFG.KEY_RESYNC_MIN*60000){
        syncAllPresent(true);
      }

      teaseTick();
      rutTick();
      quotaTick();
      prodTick();
      milkingStallTick();
      lifeTick();
      workTick();
      for (const [mn,a] of state.arrivals) if (Date.now() > a.until) state.arrivals.delete(mn);
      if (Date.now() - (state.lastSync||0) > 60000){ state.lastSync = Date.now(); syncCompanions(); }

      const cutoff = Date.now()-CFG.APPLY_TIMEOUT_MIN*60000;
      for (const [mn,s] of state.sessions){
        if (CFG.APPLY_TIMEOUT_MIN > 0 && (s.last || s.started) < cutoff){
          state.sessions.delete(mn);
          reply(mn,"Your paperwork timed out, sugar. Say ?apply whenever you'd like to start fresh!", s.ch);
        }
      }
      const gcut = Date.now()-CFG.GREET_COOLDOWN_MIN*120000;
      for (const [k,v] of state.greeted) if (v<gcut) state.greeted.delete(k);

    } catch(e){ warn("heartbeat:",e); watchdog(); }
  }

