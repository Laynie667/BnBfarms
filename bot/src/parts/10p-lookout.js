  /* WHAT'S IN THIS FILE (10p-lookout.js)
     Things Laynie picked on Oct 7 (her private ones, the action log and ?jot, live in her own add-on, which
     stays off GitHub):
     • WHILE YOU WERE GONE: back after 3+ hours, I hand you what you missed: litters dropped, ribbons won and
       lost, your breedin' season count, your bench count.
     • A NUDGE FOR LINGERERS: somebody not on the books who's been standin' around five minutes without
       sayin' a word to me gets one whisper offerin' the tour. Once a week at most.
     • The Companion's "right now" strip and the bench buttons are fed from rightNow() and benchHereFor().
  */
  // ── while you were gone ─────────────────────────────────
  function awayText(mn, since){
    const r = rec(mn), out = [];
    const book = (L.studbook || []).filter(e => e.t >= since);
    for (const e of book.slice(-5)){
      const n = e.eggs || (e.kids.male + e.kids.female + e.kids.futa);
      out.push("🍼 "+plainName(e.dam)+" dropped "+n+(e.eggs ? " eggs" : "")+", bred by "+e.sires.map(s => s > 0 ? plainName(s) : "a stranger").join(" & ")+(e.dam === mn ? ". That's you, sugar!" : "."));
    }
    if (book.length > 5) out.push("🍼 …and "+(book.length - 5)+" more litters.");
    const rl = (L.ribbonLog || []).filter(e => e.mn === mn && e.at >= since);
    const won = rl.filter(e => e.n > 0).reduce((a, e) => a + e.n, 0), lost = -rl.filter(e => e.n < 0).reduce((a, e) => a + e.n, 0);
    if (won || lost) out.push("🎀 "+(won ? "+"+won+" ribbons" : "")+(won && lost ? ", " : "")+(lost ? lost+" spent or fined" : "")+". You've got "+(r.ribbons || 0)+".");
    const season = L.mods && L.mods.breeding && L.mods.breeding.week;
    if (season && season.bred && season.bred[mn]) out.push("🔥 You've been bred "+season.bred[mn]+" time"+(season.bred[mn] === 1 ? "" : "s")+" this breedin' season.");
    const B = L.benchBoard; if (B && B.n && B.n[mn]) out.push("🪵 Used "+B.n[mn]+" time"+(B.n[mn] === 1 ? "" : "s")+" on the bench this week.");
    if (!out.length) return null;
    const h = Math.round((Date.now() - since) / 3600000);
    return "🌙 WHILE YOU WERE GONE ("+(h >= 48 ? Math.round(h/24)+" days" : h+" hours")+")\n"+out.join("\n");
  }
  function welcomeBack(mn){
    const r = rec(mn); if (!r || !r.roles || !r.roles.length) return;
    const since = r.leftAt; r.leftAt = 0;
    if (!since || Date.now() - since < CFG.AWAY_H*3600000) return;
    later(() => {
      if (!onMap(mn) && !charFor(mn)) return;
      const t = awayText(mn, since); if (!t) return;
      if (hasCompanion(mn)) toCompanion(mn, t, "notice"); else tell(mn, t);
    }, 12000);
  }
  function markLeft(mn){ const r = rec(mn); if (r && r.roles && r.roles.length){ r.leftAt = Date.now(); saveLedger(); } }

  // ── a nudge for lingerers ───────────────────────────────
  function lingerTick(){
    const now = Date.now();
    state.arrivedAt = state.arrivedAt || new Map();
    for (const c of (W.ChatRoomCharacter || [])){
      const mn = c.MemberNumber; if (mn === CFG.BOT_MEMBER) continue;
      if (!state.arrivedAt.has(mn)) state.arrivedAt.set(mn, now);
      const at = state.arrivedAt.get(mn), r = rec(mn);
      if (now - at < CFG.LINGER_MIN*60000 || (r && r.roles && r.roles.length)) continue;
      L.nudged = L.nudged || {};
      if (now - (L.nudged[mn] || 0) < 7*86400000) continue;
      const said = state.lastCmd && state.lastCmd.get(mn);
      if ((said && said.at >= at) || state.sessions.has(mn) || (L.applications || []).some(a => a.mn === mn)) { L.nudged[mn] = now; continue; }
      L.nudged[mn] = now; saveLedger();
      whisper(mn, pickFresh("linger", [
        "Still just lookin', "+plainName(mn)+"? Say ?tour and I'll walk you round: the milkin' stalls, the breedin' pens, the bench. Or ?apply when you want a collar of your own.",
        "You've been eyein' the stock a while, sugar. ?tour shows you everything we do to 'em, and ?apply puts you on the books.",
        "Like what you see, "+plainName(mn)+"? ?tour for the whole farm, udders and all. ?apply when you're ready to be one of ours."]));
    }
    for (const mn of [...state.arrivedAt.keys()]) if (!charFor(mn)) state.arrivedAt.delete(mn);
  }

  // ── fed to the Companion ────────────────────────────────
  // the "right now" strip: everything with a clock on it
  function rightNow(mn){
    const r = rec(mn), p = prodOf(mn), now = Date.now(), out = [];
    if (!r || !p) return out;
    if (r.benched && r.benched.until > now) out.push({ icon: "🪵", text: "On the bench · "+r.benched.uses+" used you", until: r.benched.until });
    if (r.penned && r.penned.until > now) out.push({ icon: "🚧", text: "Penned", until: r.penned.until });
    if (r.stocked && r.stocked.until > now) out.push({ icon: "⛓️", text: "In the stocks", until: r.stocked.until });
    if (p.stall && p.stall.until) out.push({ icon: "🥛", text: "In the milkin' stall", until: p.stall.until });
    if (inHeat(p)) out.push({ icon: "🔥", text: "In heat", until: p.heat.until });
    if (p.deniedUntil > now) out.push({ icon: "🚫", text: "Denied", until: p.deniedUntil });
    if (p.milkDeniedUntil > now) out.push({ icon: "🚫", text: "Teats capped", until: p.milkDeniedUntil });
    if (p.pentUp) out.push({ icon: "😤", text: "Pent up" });
    if (r.dare && r.dare.until > now) out.push({ icon: "🎲", text: "Dare", until: r.dare.until });
    for (const f of activePotions(mn)) out.push({ icon: "🧪", text: (potionDef(f.id) || {}).name || f.id, until: f.until });
    if (p.tieUntil > now) out.push({ icon: "🔒", text: "Knotted", until: p.tieUntil });
    return out.map(x => Object.assign(x, x.until ? { until: Math.ceil(x.until / 60000) * 60000 } : {}));
  }
  // who's on the use bench (not you), with the holes that are open, for the tap-to-use card
  function benchHereFor(mn){
    if (!rec(mn) || !(rec(mn).roles || []).length) return [];
    return benchedHere().filter(m => m !== mn).map(m => ({ mn: m, name: plainName(m), uses: rec(m).benched.uses, holes: benchOpenHoles(m) }));
  }
