  /* WHAT'S IN THIS FILE (10un-outfit-wheel.js)
     OUTFITS FOR A WHILE: the outfit wheel and the Wrong Barn's change of clothes.
     Laynie, Oct 26: "build them into a new wheel command with a randomized timer for each outfit between 5 minutes and
     4 hours", and "id also like if wrong barn potion maybe also temporarily swaps outfits".
       ?outfitwheel           spin it yourself: any of the farm's starter outfits for your body, on at once, for a
                              random 5 minutes to 4 hours. The farm's padlocks hold it on till the time's up.
       ?outfitwheel <who>     staff spin it for somebody: they get the Yes / Not now card first
       ?outfitwheel status    what you're in and how long is left · ?outfitwheel stop <who> (staff)
       Wrong Barn             the new animal's outfit for the hour too (not for anybody on ?ownoutfit)
     The clock starts when their Companion says it's on. At the end the farm opens its own padlocks and puts them back
     in what they wore before. The safeword ends it at once.
  */
  if (CFG.OUTFIT_WHEEL_MIN === undefined) CFG.OUTFIT_WHEEL_MIN = [5, 240];
  const tmpMins = (m) => m >= 60 ? Math.floor(m/60)+" h"+(m % 60 ? " "+(m % 60)+" min" : "") : m+" min";
  function tempOutfitStart(mn, slot, mins, src, auto, why){
    const r = rec(mn); if (!r) return "They're not on the books, sugar.";
    if (r.tempOutfit && (r.tempOutfit.until > Date.now() || Date.now() - (r.tempOutfit.sentAt || 0) < 3*60000)) return plainName(mn)+" is already in a wheel outfit, sugar. ?outfitwheel status";
    if (!hasCompanion(mn)) return plainName(mn)+" isn't runnin' the Companion, so I can't dress 'em.";
    const err = offerOutfit(mn, slot, why, auto);
    if (err) return err;
    r.tempOutfit = { slot, src, mins: Math.max(1, Math.round(mins)), sentAt: Date.now(), until: 0 };
    saveLedger();
    return "";
  }
  // their Companion says it's on (or no): the clock starts now
  function tempOutfitAnswer(mn, m){
    const r = rec(mn), t = r && r.tempOutfit;
    if (!t || t.until || String(m.slot || "") !== t.slot) return;
    if (m.answer === "worn"){
      t.until = Date.now() + t.mins*60000; saveLedger();
      if (t.src === "wheel") tell(mn, "🎡 The "+farmName(t.slot)+" is yours for "+tmpMins(t.mins)+", sugar. The padlocks open themselves when the time's up.");
    } else if (m.answer === "declined" || m.answer === "failed"){ r.tempOutfit = null; saveLedger(); }
  }
  function tempOutfitEnd(mn, why){
    const r = rec(mn), t = r && r.tempOutfit; if (!t) return false;
    if (!hasCompanion(mn)){ if (!t.due){ t.due = why || "time"; saveLedger(); } return false; }   // back the moment their Companion is
    r.tempOutfit = null; saveLedger();
    enqueue(makeMsg("outfitBack", { why: t.src === "wrongbarn" ? "the Wrong Barn wore off" : "the wheel's time is up", farmLocks: true }, mn));
    if (why !== "safe" && t.until){
      if (onMap(mn)) emote("🎡 Click, click: the farm's padlocks open on "+plainName(mn)+", and the "+(farmName(t.slot) || "wheel outfit")+" comes off.", mn);
      else tell(mn, "🎡 Your time in the "+(farmName(t.slot) || "wheel outfit")+" is up, sugar: you're back in your own things.");
    }
    return true;
  }
  function tempOutfitTick(){
    const now = Date.now();
    for (const r of Object.values(L.people)){
      const t = r.tempOutfit; if (!t) continue;
      if (t.due || (t.until && now >= t.until)) tempOutfitEnd(r.mn, t.due || "time");
      else if (!t.until && now - (t.sentAt || 0) > 10*60000){ r.tempOutfit = null; saveLedger(); }   // never answered: let it go
    }
  }
  // a random farm outfit for their body, and a random time
  function wheelPick(mn){
    const g = genderOf(mn), kinds = FARM_OUTFITS.OUTFIT_SPECIES.filter(sp => farmOutfit("farm:"+sp+"|"+g));
    const sp = kinds[Math.floor(Math.random()*kinds.length)];
    const [lo, hi] = CFG.OUTFIT_WHEEL_MIN, mins = lo + Math.floor(Math.random()*(hi - lo + 1));
    return sp ? { slot: "farm:"+sp+"|"+g, mins } : null;
  }
  function outfitWheelCommand(sender, args, R){
    const a0 = String(args[0] || "").toLowerCase();
    if (a0 === "status" || a0 === "left"){
      const t = (rec(sender) || {}).tempOutfit;
      if (!t) { R("🎡 You're not in a wheel outfit right now, sugar. ?outfitwheel spins it."); return; }
      R(t.until ? "🎡 You're in the "+farmName(t.slot)+" for another "+tmpMins(Math.max(1, Math.ceil((t.until - Date.now())/60000)))+"."
                : "🎡 The "+farmName(t.slot)+" is waitin' on your Companion to put it on.");
      return;
    }
    if (a0 === "stop"){
      const t = resolveTarget(args[1] || "");
      if (!isStaff(sender)) { R("Only staff can stop the wheel early, sugar. (Your safeword always does.)"); return; }
      if (!t || !rec(t) || !rec(t).tempOutfit) { R("They're not in a wheel outfit, sugar."); return; }
      tempOutfitEnd(t, "stop"); R("🎡 Done: "+plainName(t)+" is on their way back into their own things."); return;
    }
    const t = a0 ? resolveTarget(args[0]) : sender;
    if (!t || !rec(t)) { R("Spin it for who, sugar? ?outfitwheel for yourself, or staff: ?outfitwheel <who>."); return; }
    if (t !== sender && !isStaff(sender)) { R("Spinnin' the wheel for somebody else is for staff, sugar. ?outfitwheel spins it for you."); return; }
    if (rec(t).ownOutfit && t !== sender) { R(plainName(t)+" brings their own outfit (?ownoutfit on), sugar, so the wheel leaves 'em be."); return; }
    const p = wheelPick(t); if (!p) { R("The wheel's got nothin' that fits, sugar."); return; }
    const err = tempOutfitStart(t, p.slot, p.mins, "wheel", t === sender, t === sender ? "The outfit wheel, for "+tmpMins(p.mins) : "The outfit wheel, from "+plainName(sender)+", for "+tmpMins(p.mins));
    if (err) { R(err); return; }
    const line = "🎡 The outfit wheel clatters round for "+plainName(t)+"… and lands on the "+farmName(p.slot)+", for "+tmpMins(p.mins)+"!";
    if (onMap(t)) emote(line, t); else R(line);
    if (t !== sender) R("🎡 "+plainName(t)+" gets the card to say yes or not now. The clock starts when it's on.");
  }
  // the Wrong Barn's new animal, dressed for the hour (10m-potions.js)
  function wrongBarnOutfit(mn, species, mins){
    const r = rec(mn); if (!r || r.ownOutfit || !hasCompanion(mn)) return;
    const kit = FARM_OUTFITS.outfitSpeciesOf(species), slot = kit && "farm:"+kit+"|"+genderOf(mn);
    if (!slot || !farmOutfit(slot)) return;
    tempOutfitStart(mn, slot, mins, "wrongbarn", true, "Wrong Barn, for "+tmpMins(mins));
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __tempOutfitTick: () => tempOutfitTick() });
