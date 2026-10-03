  /* WHAT'S IN THIS FILE (18-boot.js)
     Start-up: wait for the game, load the ledger, attach the hooks, start the heartbeat. Closes the big
     function.
  */
  /* ───────────── boot ───────────── */

  function boot(){
    if (state.booted) return;
    state.booted = true;
    loadLedger();
    addonsBoot();       // add-on scripts can plug in from here on (10f-addons.js)
    makeBadge();
    setBadge("waiting for game…");
    attachListeners();

    if (!startWorkerTimer()){
      setInterval(heartbeat, CFG.HEARTBEAT_MS);
      log("Using setInterval — may throttle in background tabs.");
    }
    every(watchdog, 60000);
    every(()=>{ try { if (inRoom()) leashTick(); } catch(e){ warn("leash:",e); } }, CFG.LEASH_TICK_MS);
    later(heartbeat, 3000);

    // keep the page from being considered idle by the browser
    try {
      W.document.addEventListener("visibilitychange", ()=>{
        dbg("visibility:", W.document.visibilityState);
        if (W.document.visibilityState === "visible") heartbeat();
      });
    } catch(e){}

    log("Farmhand v"+VERSION+" online.");
  }

  log("Script loaded (v"+VERSION+"). Bridge: "+(W===window?"direct":"unsafeWindow"));
  if (W.document && W.document.body) boot();
  else W.addEventListener("load", boot);

  const waitGame = setInterval(()=>{
    try { if (typeof W.ServerSend==="function"){ clearInterval(waitGame); heartbeat(); } } catch(e){}
  },1000);
})();