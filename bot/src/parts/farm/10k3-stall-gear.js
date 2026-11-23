  /* WHAT'S IN THIS FILE (10k3-stall-gear.js)
     STRAPPED INTO THE STALL (Nov 23; from the suggestion box, Nikto's #10: "it would be fitting to lock that character in
     place for a given ammount of time; or generally having the option of locking stock in the milking stall for the
     duration of a session"; Laynie: "that should be on a toggle with equipment, like a stand, symbian, and lactation pump.
     so those wanting immersion can toggle it on. removed after").
     ?stallgear on (their own switch, off to start; Toggles → Milk):
       • a milkin' session in the stall puts the stall's own gear on them: the lactation pump on their teats (when it's
         milkin' them), and under them the stall's Sybian (with a pussy to ride it) or the spreadin' stand (without);
       • they stay in the stall: steppin' off puts them straight back on it till the session's done;
       • it all comes off when the session's over, or with their safeword (which also lets them go for half an hour).
     The switch itself is their say-so for the gear, so it doesn't need "Farm can put real gear on me".
  */
  const STALL_SAFE_MIN = 30;
  // what the stall has on them right now (farmGearFor, 10y-farm-gear.js)
  function stallGear(mn){
    const r = rec(mn), p = r && prodOf(mn), now = Date.now();
    if (!r || !r.stallGear || !p || !p.stall || (p.stallFreeUntil || 0) > now) return [];
    const st = p.stall, until = Math.ceil(((st.until || now + 30*60000) + 5*60000) / 60000) * 60000, out = [];
    if (st.kind !== "cock") out.push({ slot: "cups", name: "Stall Milker", items: ["LactationPump"], always: true, until,
      desc: "The milkin' stall's own cups, latched on and pullin' till you're drained to a quarter." });
    out.push(hasVulva(mn)
      ? { slot: "device", name: "Stall Sybian", items: ["Sybian"], always: true, until, desc: "The stall's saddle, hummin' under you the whole time you're milked." }
      : { slot: "device", name: "Stall Stand", items: ["LegSpreadDisplayStand"], always: true, until, desc: "The stall's stand, holdin' you spread and still for the milkin'." });
    return out;
  }
  // stepped off the stall mid-session: straight back on it (milkingStallTick, 08-production.js). true: put back
  function stallHold(mn, p){
    const r = rec(mn), now = Date.now();
    if (!r || !r.stallGear || !p || !p.stall || !p.stall.spot || (p.stallFreeUntil || 0) > now) return false;
    if (now - (p.stall.heldAt || 0) < 4000) return true;   // (just put back: give the move a moment to land)
    p.stall.heldAt = now; p.stall.seenAt = now;
    teleport(mn, p.stall.spot, false, true);
    if (!p.stall.heldTold){ p.stall.heldTold = true; whisper(mn, "🥛 Uh-uh, sugar. You're strapped in till the stall's done with you. Your safeword lets you loose."); }
    return true;
  }
  // their safeword: the stall lets them go, gear and all, for a while
  function stallLet(mn){
    const p = rec(mn) && prodOf(mn); if (!p) return false;
    p.stallFreeUntil = Date.now() + STALL_SAFE_MIN*60000; saveLedger(); syncCompanions(true);
    return true;
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __stallGear: (m) => stallGear(m), __stallHold: (m) => stallHold(m, prodOf(m)) });
