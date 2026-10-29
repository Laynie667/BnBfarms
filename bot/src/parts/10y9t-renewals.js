  /* WHAT'S IN THIS FILE (10y9t-renewals.js)
     ANOTHER CONTRACT? (Laynie, Oct 27, from the ideas doc: "When a timed contract has a day left, I ask the pet if they'd
     like another and tell their herd leader. When they say yes, staff get a one-click Offer button.")
     • A signed farm contract with an end date: a day before it ends (three hours before, for one that's only a day or
       half a day long) I ask them, and beep their herd leader. Here in the room: a yes/no card in their Companion (?yes
       and ?no work too). Away: a beep, and I ask again the first time they come by.
     • ?renew yes · ?renew no: them, any time before it ends. Changin' their mind is fine.
     • A yes: staff hear, and the Staff panel's Contracts tab puts it at the top with an "Offer it" button (the same
       contract, the same length; BC+ only takes an offer in person, so they need to be in the room). It stays there for a
       week after the old one ends. Their herd leader hears too.
     • ?renew (staff): who's said what · ?renew offer <who> (herdmasters and the proprietors).
  */
  if (CFG.RENEW_ASK_H === undefined) CFG.RENEW_ASK_H = 24;            // ask this long before a contract ends
  if (CFG.RENEW_ASK_SHORT_H === undefined) CFG.RENEW_ASK_SHORT_H = 3;  // …or this long, for one that's a day long or less
  const RENEW_KEEP = 7*86400000;   // a yes still waits for staff this long after the old contract ended
  const durOfMin = (min) => BCPLUS.DURATIONS.find(d => d.min === min && d.min > 0) || null;
  const renewAskAt = (x) => (x.durationMin && x.durationMin <= 1440 ? CFG.RENEW_ASK_SHORT_H : CFG.RENEW_ASK_H)*3600000;
  const renewHours = (x) => Math.max(1, Math.round((x.until - Date.now())/3600000));
  const renewWhat = (x) => { const d = durOfMin(x.durationMin); return "\""+x.title+"\""+(d ? " ("+d.label+")" : ""); };
  // the contract of theirs this is about: the timed one endin' soonest, or one that ended in the last week that they said yes to
  function renewable(mn){
    contractsLedger();
    const now = Date.now();
    const live = L.contracts.filter(x => x.mn === mn && x.status === "signed" && x.until && x.until > now).sort((a, b) => a.until - b.until);
    if (live.length) return live[0];
    for (let i = L.contracts.length - 1; i >= 0; i--){
      const x = L.contracts[i];
      if (x.mn === mn && x.status === "ended" && x.until && x.renewSaid === "yes" && !x.renewOffered && now - (x.endedAt || x.until) < RENEW_KEEP) return x;
    }
    return null;
  }
  // once a minute (with the contract watch, 10t-contract-watch.js)
  function renewTick(){
    const now = Date.now();
    for (const x of L.contracts){
      if (x.status !== "signed" || !x.until || x.until <= now || x.renewSaid) continue;
      if (x.until - now > renewAskAt(x)) continue;
      if (!x.renewAt){ x.renewAt = now; saveLedger(); renewAsk(x, true); continue; }
      if (!x.renewAskedHere && charFor(x.mn)) renewAsk(x, false);   // asked while they were away: ask in person now
    }
  }
  function renewAsk(x, first){
    const mn = x.mn, what = renewWhat(x);
    const text = "📜 Your farm contract "+what+" ends in about "+renewHours(x)+" hour"+(renewHours(x) === 1 ? "" : "s")+", "+plainName(mn)+". Would you like another one, the same again?";
    if (charFor(mn)){
      x.renewAskedHere = Date.now(); saveLedger();
      farmAsk(mn, text+" (?renew yes or ?renew no works any time before it ends, too.)", (yes) => renewAnswer(mn, yes, x));
    } else beep(mn, text+" Say ?renew yes or ?renew no, sugar: here, or next time you're on the farm.");
    if (!first) return;
    const lead = herdLeaderOf(mn);
    if (lead && lead !== mn) beep(lead, "📜 "+plainName(mn)+"'s farm contract "+what+" ends in about "+renewHours(x)+" hours. I've asked them if they'd like another.");
  }
  function renewAnswer(mn, yes, x){
    x = x || renewable(mn);
    if (!x){ tell(mn, "📜 You haven't a farm contract with an end date for me to ask about, sugar."); return; }
    const said = yes ? "yes" : "no", what = renewWhat(x), lead = herdLeaderOf(mn), running = x.until > Date.now();
    if (x.renewSaid === said){ tell(mn, "📜 Already got it, sugar: "+(yes ? "you'd like another." : "no more after this one.")); return; }
    x.renewSaid = said; x.renewSaidAt = Date.now(); saveLedger(); audit(mn, "RENEW", x.title+" "+said); syncCompanions();
    if (yes){
      tell(mn, "📜 Lovely. I've told staff and your herd leader you'd like "+what+" again, sugar. Somebody'll offer it to you in person, and it turns up on your BC+ Contracts page to read and sign, same as before.");
      notifyStaff("📜 "+plainName(mn)+" would like their farm contract again: "+what+(running ? ", endin' in about "+renewHours(x)+" hours" : "")+
        ". One click: Staff panel → Contracts → Offer it, or ?renew offer "+plainName(mn)+" (they need to be in the room).", true);
      if (lead && lead !== mn) beep(lead, "📜 "+plainName(mn)+" said yes to another "+what+". Staff can offer it with ?renew offer "+plainName(mn)+".");
    } else {
      tell(mn, "📜 No more after this one, then."+(running ? " It ends in about "+renewHours(x)+" hours, and that's that." : "")+" (Change your mind before then? ?renew yes.)");
      if (lead && lead !== mn) beep(lead, "📜 "+plainName(mn)+" said no to another "+what+".");
    }
  }
  // who's been asked, who's said what (staff)
  function renewalsList(){
    contractsLedger();
    const now = Date.now(), seen = new Set(), out = [];
    for (let i = L.contracts.length - 1; i >= 0; i--){
      const x = L.contracts[i];
      if (!x.until || seen.has(x.mn) || !(x.renewAt || x.renewSaid)) continue;
      const live = x.status === "signed" && x.until > now, waiting = x.status === "ended" && x.renewSaid === "yes" && !x.renewOffered && now - (x.endedAt || x.until) < RENEW_KEEP;
      if (!live && !waiting) continue;
      seen.add(x.mn);
      out.push({ mn: x.mn, name: plainName(x.mn), title: x.title, dur: (durOfMin(x.durationMin) || {}).label || "", said: x.renewSaid || "", offered: !!x.renewOffered,
                 until: x.until, ended: !live, here: !!charFor(x.mn) });
    }
    const rank = (r) => r.said === "yes" && !r.offered ? 0 : !r.said ? 1 : 2;
    return out.sort((a, b) => rank(a) - rank(b) || a.until - b.until).slice(0, 20);
  }
  function renewCommand(sender, args, R){
    const a0 = String(args[0] || "").toLowerCase();
    if (["yes", "y", "no", "n"].includes(a0)){
      const x = renewable(sender);
      if (!x){ R("📜 You haven't a farm contract with an end date right now, sugar. (?contract shows yours.)"); return; }
      renewAnswer(sender, a0[0] === "y", x); return;
    }
    if (a0 === "offer"){
      if (!isHerdmaster(sender)){ R("Offerin' contracts is for herdmasters and the proprietors, sugar."); return; }
      const t = resolveTarget(args[1]);
      if (!t || !rec(t)){ R("?renew offer <who>: offers them the same farm contract again, the same length."); return; }
      const x = renewable(t);
      if (!x){ R(plainName(t)+" hasn't a timed farm contract to renew, sugar. ?contract offer is the way for a new one."); return; }
      const d = durOfMin(x.durationMin), tpl = contractTemplate(x.tpl) ? x.tpl : (contractTemplate(x.depth) ? x.depth : null);
      if (!tpl || !d){ R("I can't tell which contract that one was, sugar ("+x.title+"). Offer it by hand: ?contract offer <name> "+plainName(t)+" <length>."); return; }
      const err = offerContract(sender, tpl, t, d.key);
      if (err){ R(err); return; }
      x.renewOffered = Date.now(); saveLedger(); syncCompanions(); audit(sender, "RENEW_OFFER", t+" "+x.title);
      R("📜 Offered "+plainName(t)+" "+renewWhat(x)+" again. It starts when they sign it.");
      return;
    }
    if (!isStaff(sender)){
      const x = renewable(sender);
      if (!x){ R("📜 You haven't a farm contract with an end date right now, sugar."); return; }
      R("📜 Your farm contract "+renewWhat(x)+(x.until > Date.now() ? " ends in about "+renewHours(x)+" hours." : " has ended.")+
        (x.renewSaid === "yes" ? " You've said you'd like another: staff will offer it in person." : x.renewSaid === "no" ? " You've said no more after it." : "")+
        " ?renew yes or ?renew no.");
      return;
    }
    const rows = renewalsList();
    const line = (r) => "  • "+r.name+" · "+"\""+r.title+"\""+(r.dur ? " ("+r.dur+")" : "")+" · "+(r.ended ? "ended" : "ends in "+Math.max(1, Math.round((r.until - Date.now())/3600000))+" h")+
      " · "+(r.said === "yes" ? (r.offered ? "offered again" : "SAID YES"+(r.here ? ", here now" : ", not here")) : r.said === "no" ? "said no" : "asked, no answer yet");
    R("📜 CONTRACT RENEWALS\n"+(rows.length ? rows.map(line).join("\n") : "  Nobody's been asked yet. I ask a day before a timed contract ends.")+
      "\n\n?renew offer <who> offers the same contract again (herdmasters and up, with them here in the room).");
  }
  function renewStateFor(mn, s){
    if (!isStaff(mn)) return;
    const rows = renewalsList(); if (rows.length) s.renewals = rows.map(r => Object.assign({}, r, { until: Math.ceil(r.until/60000)*60000 }));
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __renewTick: () => renewTick(), __renewable: (m) => renewable(m), __renewals: () => renewalsList() });
