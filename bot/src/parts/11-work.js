  /* ═══════════ WORK & PLAY: shift clock, chores, wheel, begging, fair ═══════════ */

  function clockedIn(mn){ const r = rec(mn); return !!(r && r.shift && r.shift.in); }
  function clockOut(mn, why){
    const r = rec(mn);
    if (!r || !r.shift || !r.shift.in) return 0;
    const ms = Date.now() - r.shift.in;
    const wk = weekKey();
    r.shift.week = r.shift.week && r.shift.week.key === wk ? r.shift.week : { key:wk, ms:0 };
    r.shift.week.ms += ms; r.shift.total = (r.shift.total||0) + ms; r.shift.in = null;
    saveLedger(); audit(mn,"CLOCKOUT",why||"");
    // back into their own clothes, if the farm does that (their Companion kept them)
    outfitsLedger();
    if (L.outfitRules.changeBack && hasCompanion(mn)) enqueue(makeMsg("outfitBack", { why: "shift's over" }, mn));
    return ms;
  }
  const hrs = ms => (ms/3600000).toFixed(1)+"h";

  function workTick(){
    const now = Date.now();
    for (const r of Object.values(L.people)){
      if (!r.shift || !r.shift.in) continue;
      const idle = now - (state.lastSpoke.get(r.mn) || r.shift.in);
      if (!charFor(r.mn) || idle > CFG.SHIFT_IDLE_MIN*60000){
        const ms = clockOut(r.mn, charFor(r.mn) ? "idle" : "left");
        beep(r.mn, "⏱️ I clocked you out, hon — "+(charFor(r.mn) ? "you'd gone quiet for "+CFG.SHIFT_IDLE_MIN+" minutes" : "you left the farm")+". That shift came to "+hrs(ms)+". Thanks for all your hard work!");
        continue;
      }
      // chores for working hands
      if (!r.chore && L.chores.length && (!r.nextChore || now >= r.nextChore)){
        const c = L.chores[Math.floor(Math.random()*L.chores.length)];
        r.chore = { text:c.text, at:now }; r.nextChore = now + CFG.CHORE_EVERY_MIN*60000; saveLedger();
        beep(r.mn, "🧹 Got a chore for ya, sweetie: "+c.text+"\nSay ?done when it's finished.");
      }
    }
    // weekly hours report to proprietors
    const wk = weekKey();
    if (L.life.reportWeek && L.life.reportWeek !== wk){
      const prev = L.life.reportWeek;
      const rows = Object.values(L.people).filter(r => r.shift && r.shift.week && r.shift.week.key === prev)
                   .sort((a,b)=>b.shift.week.ms-a.shift.week.ms)
                   .map(r => "  • "+(r.name||plainName(r.mn))+" — "+hrs(r.shift.week.ms)+" · "+((r.choreWeek&&r.choreWeek.key===prev)?r.choreWeek.n:0)+" chores");
      for (const p of CFG.PROPRIETORS) beep(p, "⏱️ STAFF HOURS, "+prev+"\n\n"+(rows.join("\n")||"  nobody clocked in that week"));
    }
    if (L.life.reportWeek !== wk){ L.life.reportWeek = wk; saveLedger(); }
  }

  // a wheel entry is left out if it shares a meaningful word with their hard limits
  function wheelAllowed(entry, mn){
    const lim = String((rec(mn)||{}).limits||"").toLowerCase();
    if (!lim) return true;
    return !String(entry.text).toLowerCase().split(/[^a-z]+/).some(w => w.length >= 4 && lim.includes(w));
  }

  function begPhraseOk(text){
    const norm = s => String(s).toLowerCase().replace(/[^a-z ]/g,"").replace(/\s+/g," ").trim();
    return norm(text).includes(norm(L.life.begPhrase || CFG.BEG_PHRASE));
  }

