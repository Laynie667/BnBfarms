  /* WHAT'S IN THIS FILE (17-heartbeat.js)
     The heartbeat: every 20 seconds, everything that runs on its own (milk fillin', gear, heat, teasin',
     voice, goin' home, keepin' the Companions in sync).
  */
  /* ───────────── heartbeat ───────────── */

  function heartbeat(){
    try {
      if (typeof W.ServerSend!=="function"){ setBadge("game not found","#ff9b9b"); watchdog(); return; }
      attachListeners();

      if (!isLoggedIn()){ setBadge("logging in…","#ffc49b"); tryLogin(); watchdog(); return; }
      // one farm office: the wrong account, or a second copy, stays quiet (and never walks into the room)
      if (!officeCheck()){
        setBadge(state.dormant === "account" ? "off: not the bot's account" : "standing by: another copy is running the farm", "#ffc49b");
        return;
      }
      if (!inRoom()){ setBadge("joining room…","#ffc49b"); tryEnterRoom(); watchdog(); return; }
      // healthy
      state.lastHealthy = Date.now();
      if (!state.onDutyOnce){
        // the first time everything's up: what loaded (a "half-loaded" start shows here, or doesn't get here)
        state.onDutyOnce = Date.now();
        let addons = []; try { addons = W.Farmhand.list().map(a => a.name); } catch(e){}
        recStep("on duty", { listeners: !!attachListeners._done, admin: botIsAdmin(), addons, people: (W.ChatRoomCharacter||[]).length, registered: Object.keys(L.people).length });
      }
      state.reloading = false;

      const admin = botIsAdmin();
      let fl = 0; try { fl = (W.Player.FriendList||[]).length; } catch(e){}
      const oc = forcedStaff().length;
      setBadge("on duty — "+Object.keys(L.people).length+" reg · "+fl+" friends · "+oc+" on call"+
               (admin?"":" ⚠️NOT ADMIN"), admin ? "#b8ff9b" : "#ffc49b");

      keepalive();
      runWaiting(); pump();        // safety net: waitin' commands and messages move even if a timer was lost
      if (Date.now() - (state.lastMutualAsk||0) > 60000){ state.lastMutualAsk = Date.now(); askMutual(); }
      nudge();
      expireHerdClaims();
      snapshotRoom(false);

      for (const [mn,pc] of state.pendingClaims)
        if (Date.now() - pc.at > CFG.CLAIM_ASK_TIMEOUT_MIN*60000) state.pendingClaims.delete(mn);

      if (CFG.KEY_SYNC_ENABLED && admin && Date.now()-state.lastFullSync > CFG.KEY_RESYNC_MIN*60000){
        syncAllPresent(true);
      }

      teaseTick();
      voiceTick();
      rutTick();
      quotaTick();
      prodTick();
      milkingStallTick();
      gearTick();
      homeTick();
      lifeTick();
      workTick();
      if (Date.now() - (state.wlTick||0) > 5*60000){ state.wlTick = Date.now(); whitelistSync(true); }   // the room whitelist follows the books
      leadTick();                  // people being led who never arrived get teleported after all
      ambientTick();               // two animals near each other share a moment now and then
      addonsEmit("tick");          // add-on scripts (10f-addons.js)
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

