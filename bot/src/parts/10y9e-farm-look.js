  /* WHAT'S IN THIS FILE (10y9e-farm-look.js)
     THE FARM'S LOOK for the drawn body (Laynie, Oct 14: "the outfit studio settings should route through the bot
     anyway", "the outfit studio's default settings is whatever the bots settings are... My main is running on my
     phone"). The Companion on the bot's own account holds what Laynie set in her outfit studio (it sits beside the
     studio, on the bot's PC). The bot reads that from its own page, keeps a copy in the ledger, and hands it to every
     Companion, so a phone with no studio gets the same breasts, belly and fitting choices. A player's own choices sit on
     top in their Companion: their cup and belly, or a whole set of their own from a studio of their own.
     Nothing is switched on for anybody by this: it's only what the drawn body looks like when they turn it on.
       bot -> ext  bodyFarm    { at, body }   the farm's look (when it changes, and to whoever asks)
       ext -> bot  bodyFarmAsk { at }         "mine is from <at>; send me yours if it's newer"
       (the bot's welcome carries look: <at>, so a Companion knows whether to ask)
  */
  const FARM_LOOK_KEY = "farmhand-drawn-body";   // the bot page's own Companion keeps its settings here (extension/src/drawnbody.js)
  // the look the bot's own Companion has: everything but whether it's switched on there
  function farmLookRead(){
    try {
      const raw = W.localStorage && W.localStorage.getItem(FARM_LOOK_KEY);
      if (!raw || raw.length > 60000) return null;
      const d = JSON.parse(raw); if (!d || typeof d !== "object" || Array.isArray(d)) return null;
      const body = {}; for (const k of ["cup", "breast", "wear", "belly", "auto", "tuck", "dress", "mould"]) if (d[k] !== undefined) body[k] = d[k];
      return typeof body.cup === "number" ? body : null;
    } catch(e){ return null; }
  }
  const farmLookAt = () => (L.drawnFarm && L.drawnFarm.at) || 0;
  // once a heartbeat: did the bot's Companion get new settings? then the farm's look changes, and the room is told
  function farmLookTick(){
    try {
      const b = farmLookRead(); if (!b) return;
      if (L.drawnFarm && JSON.stringify(L.drawnFarm.body) === JSON.stringify(b)) return;
      L.drawnFarm = { at: Date.now(), body: b }; saveLedger();
      log("The farm's look for the drawn body changed (cup "+b.cup+"); tellin' the Companions.");
      if (state.companions && state.companions.size) enqueue(makeMsg("bodyFarm", { at: L.drawnFarm.at, body: b }));
    } catch(e){ warn("farm look:", e); }
  }
  // a Companion asking for it (it says which one it has)
  function farmLookAsk(mn, m){
    if (!L.drawnFarm || !L.drawnFarm.body) return;
    if (Number(m && m.at) === L.drawnFarm.at) return;   // it already has this one
    enqueue(makeMsg("bodyFarm", { at: L.drawnFarm.at, body: L.drawnFarm.body }, mn));
  }
