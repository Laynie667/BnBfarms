  /* WHAT'S IN THIS FILE (10-farm-life.js)
     Farm life: feedin', curfew, the stocks, leashes, the tour, weather.
  */
  /* ═══════════ FARM LIFE: feeding, curfew, stocks, leash, tour, weather ═══════════
     Times are the bot machine's local clock (set the VPS timezone to yours). */

  // tests run on a quiet 2 pm (no curfew, no feedin') unless they set W.__hour, so results never depend on the real clock
  function hourNow(){ if (W.__FARMHAND_TEST__) return W.__hour != null ? W.__hour : 14; return new Date().getHours(); }
  function presentStock(){
    return (W.ChatRoomCharacter||[]).map(c=>c.MemberNumber)
      .filter(m => m !== CFG.BOT_MEMBER && hasRole(m, ROLE.LIVESTOCK) && !(isStaff(m) && onDuty(m)));
  }
  function inCurfew(){
    if (!L.life.curfewOn) return false;
    const h = hourNow(), { start, end } = CFG.CURFEW;
    return start > end ? (h >= start || h < end) : (h >= start && h < end);
  }
  function curfewBound(mn){ return inCurfew() && hasRole(mn, ROLE.LIVESTOCK) && !(isStaff(mn) && onDuty(mn)) && !(rec(mn)||{}).begged; }

  // weather: one roll per day
  function weatherToday(){
    const d = dayKey();
    if (!L.life.weather || L.life.weather.day !== d){
      const w = CFG.WEATHER[Math.floor(Math.random()*CFG.WEATHER.length)];
      L.life.weather = { day:d, key:w.key, line:w.line, indoors:!!w.indoors };
      for (const r of Object.values(L.people)) delete r.begged;   // a new day: begged favours lapse
      saveLedger();
      if (inRoom()) announce("🌤️ "+w.line);
    }
    return L.life.weather;
  }

  function lifeTick(){
    const h = hourNow(), d = dayKey();
    weatherToday();
    // feeding: once per listed hour per day
    if (L.life.feedingOn && CFG.FEED_HOURS.includes(h) && L.life.lastFeed !== d+"@"+h){
      L.life.lastFeed = d+"@"+h; saveLedger();
      const w = weatherToday();
      const pt = w.indoors ? firstSpot("barn","trough") : firstSpot("trough");
      const stock = presentStock().filter(m => !stockedNow(m));
      for (const m of stock) sound(m, "bell");
      announce("🔔 Soo-eee! Feedin' time"+(w.indoors ? ", in the barn on account of the weather" : " at the trough")+". Come and get it, sweeties!");
      if (pt) for (const m of stock) teleport(m, pt, false);
    }
    // curfew starts / ends
    const cur = inCurfew();
    if (cur !== !!L.life.curfewActive){
      L.life.curfewActive = cur; saveLedger();
      if (cur){
        announce("🌙 Curfew, y'all! Stock to the barn and snuggle in"+(CFG.CURFEW_TAKES_BRONZE ? ", and I'll hold onto those bronze keys till mornin'" : "")+". Sweet dreams!");
        const pt = firstSpot("barn");
        for (const m of presentStock()) if (!stockedNow(m)) { if (pt) teleport(m, pt, false); syncKeys(m, true); }
      } else {
        announce("🌅 Rise and shine, sweeties! Curfew's lifted.");
        for (const r of Object.values(L.people)) delete r.begged;
        syncAllPresent(true);
      }
    }
    // punishment stocks: time up, or they wandered off
    for (const r of Object.values(L.people)){
      const s = r.stocked;
      if (!s) continue;
      if (Date.now() >= s.until){ r.stocked = null; saveLedger(); whisper(r.mn, "🔓 Time's up, "+plainName(r.mn)+"! Out of the stocks you come, sugar."); continue; }
      const C = charFor(r.mn), pos = C && C.MapData && C.MapData.Pos, pt = spotFor("stocks");
      if (pt && pos && (Math.abs(pos.X-pt.X) > 1 || Math.abs(pos.Y-pt.Y) > 1)){
        teleport(r.mn, pt, false, true);   // the stocks hold you: straight back
        whisper(r.mn, "Uh-uh, back in the stocks you go, hon! "+Math.ceil((s.until-Date.now())/60000)+" minutes left.");
      }
    }
    // a prize from the fair wears off
    for (const r of Object.values(L.people)){
      if (r.tierUntil && Date.now() >= r.tierUntil){
        r.tier = r.tierPrev || ""; r.tierUntil = null; r.tierPrev = null; saveLedger();
        beep(r.mn, "🎀 Your fair week's all over, sweetie. Back to "+tierName(tierOf(r.mn))+", but you'll always be blue-ribbon in my book!");
      }
    }
  }
  function stockedNow(mn){ const r = rec(mn); return !!(r && r.stocked && r.stocked.until > Date.now()); }
  function putInStocks(mn, minutes, by){
    const r = rec(mn);
    r.stocked = { until: Date.now() + minutes*60000, by };
    saveLedger();
    const pt = spotFor("stocks");
    if (pt) teleport(mn, pt, true);
    whisper(mn, "⛓️ Into the stocks with you for "+minutes+" minutes, sugar."+(pt ? "" : " (Nobody's set a stocks spot yet, so just stay put right where you are.)"));
  }

  // leash walks: checked every few seconds
  function leashTick(){
    for (const [follower, lead] of state.leashes){
      const F = charFor(follower), Lc = charFor(lead);
      if (!F || !Lc){ state.leashes.delete(follower); continue; }
      const fp = F.MapData && F.MapData.Pos, lp = Lc.MapData && Lc.MapData.Pos;
      if (!fp || !lp) continue;
      // the follower walked off while the leader stood still: if it's a knot holdin' 'em, they feel it
      const was = state.leashPos && state.leashPos.get(follower);
      state.leashPos = state.leashPos || new Map();
      state.leashPos.set(follower, { f:{ X:fp.X, Y:fp.Y }, l:{ X:lp.X, Y:lp.Y } });
      if (Math.abs(fp.X-lp.X) <= 1 && Math.abs(fp.Y-lp.Y) <= 1) continue;
      const fpr = prodOf(follower);
      if (was && fpr && fpr.tieUntil > Date.now() && fpr.tiedTo === lead && was.l.X === lp.X && was.l.Y === lp.Y &&
          Date.now() - (fpr.tugAt||0) > 60000){
        fpr.tugAt = Date.now();
        emote("🔒 "+plainName(follower)+" tries to pull away, but "+plainName(lead)+"'s knot holds fast and yanks 'em right back with a wet tug. "+
              plainName(lead)+" gasps at the squeeze. Not goin' anywhere yet, sugar.");
      }
      // put them on a free tile beside the leader
      for (const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){
        const x = lp.X+dx, y = lp.Y+dy;
        try { if (typeof W.ChatRoomMapViewIsWall === "function" && W.ChatRoomMapViewIsWall(x,y)) continue; } catch(e){}
        teleport(follower, { X:x, Y:y }, false);
        break;
      }
    }
  }
  function dropLeashes(mn){
    let n = 0;
    for (const [f,l] of state.leashes) if (f === mn || l === mn){ state.leashes.delete(f); n++; }
    return n;
  }

  // guided tour: stops are { X, Y, text } recorded where staff stand
  function runTour(mn){
    const stops = L.life.tour || [];
    if (!stops.length || !botIsAdmin()) return false;
    state.tours.set(mn, 0);
    const step = () => {
      const i = state.tours.get(mn);
      if (i === undefined || !charFor(mn)) { state.tours.delete(mn); return; }
      if (i >= stops.length){ state.tours.delete(mn); whisper(mn, "And that's the farm, "+plainName(mn)+"! Hope you loved it. Say ?apply if you wanna stay with us, sweetie."); return; }
      teleport(mn, stops[i], false);
      whisper(mn, "📍 "+(i+1)+"/"+stops.length+" — "+fill(stops[i].text, mn));
      state.tours.set(mn, i+1);
      later(step, CFG.TOUR_STOP_S*1000);
    };
    step();
    return true;
  }

