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

  // ── ?today: what's on, in one look ───────────────────────
  function todayText(mn){
    const now = Date.now(), here = (W.ChatRoomCharacter || []).map(c => c.MemberNumber).filter(m => m !== CFG.BOT_MEMBER && rec(m) && (rec(m).roles || []).length);
    const names = (list) => list.slice(0, 8).map(plainName).join(", ")+(list.length > 8 ? " and "+(list.length - 8)+" more" : "");
    const out = ["📅 TODAY ON THE FARM · "+here.length+" on the books here right now"];
    if (isRut()) out.push("🔥 It's rut day: every fill is twice as likely to take.");
    const d = new Date(), day = d.getDate();
    const season = L.mods && L.mods.breeding && L.mods.breeding.week;
    if (ADDONS.has("breeding")){
      if (day >= 15 && day <= 21){
        const top = season && season.bred ? Object.entries(season.bred).filter(([m]) => Number(m) > 0).sort((a, b) => b[1] - a[1])[0] : null;
        out.push("📖 Breedin' season, night "+(day - 14)+" of 7"+(top ? ": "+plainName(Number(top[0]))+" leads the stud book, bred "+top[1]+" time"+(top[1] === 1 ? "" : "s") : ": the stud book's still empty")+". ?season book");
      } else if (day < 15) out.push("📖 Breedin' season starts in "+(15 - day)+" day"+(15 - day === 1 ? "" : "s")+" (?season on to be in it).");
    }
    const bell = L.mods && L.mods["barn-life"] && L.mods["barn-life"].herd && L.mods["barn-life"].herd.bell;
    if (ADDONS.has("barn-life") && !(bell && bell.off)) out.push("🔔 Evenin' turn-out at "+((bell && bell.hour !== undefined) ? bell.hour : 19)+":00, out in the pasture. A ribbon for comin'.");
    if (L.life && L.life.feedingOn) out.push("🌾 Feedin' time at "+CFG.FEED_HOURS.map(h => h+":00").join(" and ")+".");
    const heat = here.filter(m => { const p = prodOf(m); return inHeat(p) && !p.heat.quiet; });
    if (heat.length) out.push("🔥 In heat: "+names(heat)+".");
    const bench = here.filter(benchedNow);
    if (bench.length) out.push("🪵 On the use bench: "+bench.map(m => plainName(m)+" ("+rec(m).benched.uses+")").join(", ")+". Stand by and ?use.");
    const full = here.filter(m => { const p = prodOf(m); return makesMilk(m) && p.milk >= milkCap(m) * 0.9 && !milkDenied(m); });
    if (full.length) out.push("🥛 Full and achin' to be milked: "+names(full)+".");
    const due = here.filter(m => { const p = prodOf(m); return p.preg && p.preg.due - now < 86400000; });
    if (due.length) out.push("🍼 Due any time: "+names(due)+".");
    rollBoard();
    const top = Object.entries((L.yield && L.yield.d) || {}).sort((a, b) => b[1] - a[1])[0];
    if (top) out.push("🏆 Top of today's milk board: "+plainName(parseInt(top[0], 10))+", "+ml(top[1])+". ?board");
    const F = L.life && L.life.fair; if (F && F.open) out.push("🎪 The fair's open. ?fair");
    const r = rec(mn);
    if (r && r.dare) out.push("🎲 You've got a dare waitin': ?dare");
    if (L.notice && L.notice.text) out.push("📌 "+L.notice.text);
    if (out.length === 1) out.push("A quiet one so far, sugar. ?help me shows everything there is to do.");
    return out.join("\n");
  }

  // ── the tour shows what happens at a place, not just where it is ──
  const TOUR_SHOW = [
    [/^milking/, ["🥛 What happens here: the cups latch on, the strap cinches across a cow's back, and she sways there moanin' while the stall drains her down to a quarter.",
                  "🥛 What happens here: stock stand in the stall and get milked dry by the machine, a private story playin' out for them beat by beat."]],
    [/^bench/, ["🪵 What happens here: somebody who said ?bench on gets strapped over it, bottom up, and anybody walkin' by can ?use them. Every use is chalked on the board.",
                "🪵 What happens here: the use bench. Time on it is a sentence from staff or the wheel, and it's exactly what it sounds like."]],
    [/^glory-\d+$/,["🕳️ What happens here: the glory stalls. Stand inside and strangers come to the hole, every 10 to 30 minutes, in whatever hole's open. Nobody ever learns who."]],
    [/^breedingstand$/, ["🐂 What happens here: the breedin' stand. Anybody bred on it is half again likelier to catch. Studs know the way."]],
    [/^trough/, ["🌾 What happens here: the trough. Stock eat on their knees, no hands, and the feedin' bell rings twice a day."]],
    [/^(pen|pens)(-|$)/, ["🚧 What happens here: the corral. Naughty stock get penned for a while, and walked right back if they wander."]],
    [/^stocks?$/, ["⛓️ What happens here: the stocks. Head and hands locked, everything else on show, for as long as staff say."]],
    [/^(pasture|turnout)/, ["🔔 What happens here: evenin' turn-out. The bell rings, the herd comes out together, and everybody who shows gets a ribbon."]],
  ];
  function tourShow(stop){
    for (const [name, s] of Object.entries(L.spots || {})){
      if (Math.max(Math.abs(s.X - stop.X), Math.abs(s.Y - stop.Y)) > 2) continue;
      const hit = TOUR_SHOW.find(([re]) => re.test(name));
      if (hit) return hit[1][Math.floor(Math.random()*hit[1].length)];
    }
    return null;
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
