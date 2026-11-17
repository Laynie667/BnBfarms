  /* WHAT'S IN THIS FILE (10ur2-dispensary.js)
     THE FARMHAND'S DISPENSARY, FROM THE FARM GIRL'S SIDE (Laynie, Nov 17: "have the farm girl 'call' on the extension
     to apply shots", "anything to make the farmgirls load a little lighter"). The Dispensary is a player's own add-on
     (dist/farmhand-dispensary.user.js, docs/DISPENSARY.md). When somebody runnin' it takes a farm shot, I still read the
     needle and keep the books (their deniedUntil, their sedate boost), but I don't narrate it: I send their game one
     hidden "dose", and it does what they feel and says the line from their own game. Without one, I do it all, as ever.
       them → me   dispHello { ver, farm, lscg, off }    is the farm on their ladder, is LSCG there, what they've switched off
       me → them   dispWelcome { farm }                  who the farm is (the proprietors and staff), for their ladder
       me → them   dose { id, dose, x, mins, by, line, hand, quiet }
       them → me   doseDone { id, ok, why }              didn't take (LSCG has it switched off): I take my side back off
       them → me   dispSafeword {}                       their safeword: the farm's side of their doses goes too
       me → them   dispClear {}                          my safeword (?safeword): every dose in them lifted
     Step 1 (Nov 17): the Denial Serum and the Sedative (10ur-shots-more.js calls dispCall for them).
  */
  const DISP_TTL_MS = 3 * 3600000, DISP_WAIT_MS = 2 * 60000;
  const dispMap = () => state.disp || (state.disp = new Map());
  // their Dispensary, if it's runnin' and they're here
  function dispFor(mn){ const d = dispMap().get(mn); return d && Date.now() - d.at < DISP_TTL_MS && charFor(mn) ? d : null; }
  function dispFarmList(){
    const out = [CFG.BOT_MEMBER].concat(CFG.PROPRIETORS || []);
    for (const k of Object.keys(L.people || {})){ const mn = Number(k); if (mn && !out.includes(mn) && isStaff(mn)) out.push(mn); }
    return out.slice(0, 300);
  }
  function onDispHello(mn, m){
    const had = dispMap().has(mn);
    dispMap().set(mn, { ver: String(m.ver || "?").slice(0, 20), farm: m.farm !== false, lscg: !!m.lscg,
                        off: Array.isArray(m.off) ? m.off.filter(x => typeof x === "string").slice(0, 40) : [], at: Date.now() });
    if (!had) log("Dispensary hello from "+mn+" (v"+String(m.ver || "?").slice(0, 20)+")");
    enqueue(makeMsg("dispWelcome", { farm: dispFarmList() }, mn));
  }
  const dispWhy = (why) => why === "ladder" ? "their Dispensary doesn't take doses from the farm" : "they've switched it off in their Dispensary";
  // a dose for their Dispensary to give. Returns "sent", null (no Dispensary: do it yourself), or why it can't take
  // ("ladder", "off": count it as a limit). o: { x, mins, by, line, hand (a needle in somebody's hand), quiet, undo }
  function dispCall(mn, dose, o){
    const d = dispFor(mn); if (!d) return null;
    if (!d.farm) return "ladder";
    if (d.off.includes(dose)) return "off";
    const id = state.dispSeq = (state.dispSeq || 0) + 1, P = state.dispPending || (state.dispPending = new Map()), now = Date.now();
    for (const [k, c] of P) if (now - c.at > DISP_WAIT_MS) P.delete(k);   // no answer in time: it stays as I counted it
    P.set(id, { mn, dose, undo: o.undo, at: now });
    enqueue(makeMsg("dose", { id, dose, x: o.x || 1, mins: o.mins, by: o.by, line: o.quiet ? undefined : o.line, hand: !!o.hand, quiet: !!o.quiet }, mn), true);
    return "sent";
  }
  function onDoseDone(mn, m){
    const P = state.dispPending, id = Number(m.id), c = P && P.get(id);
    if (!c || c.mn !== mn) return;
    P.delete(id);
    dbg("DOSE", mn, c.dose, m.ok ? "took" : "didn't take", m.why || "");
    if (m.ok) return;
    try { if (typeof c.undo === "function") c.undo(); } catch(e){ warn("dose undo:", e); }
    saveLedger(); syncCompanions(true);
    if (m.why === "lscg-off") tell(mn, "💉 That "+c.dose+" didn't take, sugar: it's switched off in LSCG's Drug Enhancements.");
  }
  // their safeword, from their Dispensary: the farm's side of its doses goes too
  function dispSafeSide(mn){ const p = prodOf(mn); if (!p) return; p.deniedUntil = 0; if (p.boosts) delete p.boosts.sedate; saveLedger(); syncCompanions(true); }
  function onDispSafeword(mn){ dispSafeSide(mn); audit(mn, "DISPSAFE", ""); }
  // my safeword (?safeword): if they've a Dispensary, every dose in it is lifted, and its farm side with it
  function dispSafe(mn){ if (!dispFor(mn)) return; enqueue(makeMsg("dispClear", {}, mn), true); dispSafeSide(mn); }
  function onDispensaryMsg(mn, m){
    if (m.type === "dispHello"){ onDispHello(mn, m); return true; }
    if (m.type === "doseDone"){ onDoseDone(mn, m); return true; }
    if (m.type === "dispSafeword"){ onDispSafeword(mn); return true; }
    return false;
  }
