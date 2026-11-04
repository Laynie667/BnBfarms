  /* WHAT'S IN THIS FILE (10s-marks.js)
     Real marks on somebody's character, done by their own Companion (only it can change their look), and only
     if they've switched "Farm can mark my body" (or "Farm can strip me") on in their Toggles:
     • every load leaves the game's own Splatters (forehead, face, chest, tummy), wherever there's room. It needs
       no LSCG; players with LSCG splatters on still get those too
     • words written on their body (the game's BodyWritings: three lines), for add-ons (Laynie's chalk, Dolly)
     • strip / dress, for add-ons
     ?wash takes the splatters and the writing off again.
  */
  const SPLAT_AREAS = { mouth: ["face", "forehead", "face"], vulva: ["tummy", "tummy", "chest"], butt: ["tummy", "chest"],
                        face: ["face", "forehead"], chest: ["chest"], tits: ["chest"], back: ["tummy", "chest"], ass: ["tummy"], body: ["chest", "tummy", "face"] };
  function bodyMark(mn, payload){
    if (mn && mn !== CFG.BOT_MEMBER) messNoted(mn, payload);   // what's on them, for ?wash's lines (10ug-wash.js)
    if (!mn || mn === CFG.BOT_MEMBER || !hasCompanion(mn)) return false;
    enqueue(makeMsg("mark", payload, mn));
    return true;
  }
  // a load landed (in a hole, or over them): a splatter where it'd show
  function splatBody(mn, where, mlx){
    const pool = SPLAT_AREAS[where] || SPLAT_AREAS.body;
    // how much (Companion 0.26.0 draws a bigger mess for a bigger load: a little spurt is a splash, a flood covers them)
    return bodyMark(mn, Object.assign({ splat: [pool[Math.floor(Math.random() * pool.length)]] }, mlx > 0 ? { amount: Math.max(0.6, Math.min(3, mlx / 45)) } : {}));
  }
