  /* WHAT'S IN THIS FILE (10y7-udders.js)
     Milkin'
     • MILKED TILL YOU CUM: in the stall, the hotter you run the likelier the cups tip you over: a scene line, a bigger
       let-down, and a count on your record. Cummin' for real in the stall does the same.
     • THE DIAL: ?stalldial [who] gentle|steady|hard|punishing. Gentle leaves more in you; hard takes you lower, faster,
       and leaves you sore; punishin' milks past empty and leaves you sensitive for an hour.
     • OVERDUE: full and unmilked, it shows in stages: tight, leakin', engorged, burstin'.
     • BROUGHT INTO MILK: ?bringin <who>. Staff tend somebody who isn't a milker, twice a day at most, and after six
       tendin's the first drops come and they're a milker.
     Pregnancy
     • CARRYIN' MORE THAN ONE WAY: a litter in the womb and a second in the ass, each on its own clock, and a clutch on
       top makes it "triple-carried".
     • BRED BACK: for an hour after a birth or a layin' you catch at almost anything. Caught again inside the hour:
       a title and a mark in the album.
     • WHOSE IS IT: with more than one sire, nobody's told the split till the birth.
     • TOO BIG TO WALK: once the map has a farrowin' stall (?spot set farrowing), anybody at the last belly stage is
       bedded down in it till it's over. ?tend <who> feeds and milks them, and pays. ?bedrest off opts out.
     The kink of the whole place
     • YOUR WORDS: ?callme <names> and ?nevercall <names>. Lines about you use the first and never the second.
     • INTENSITY: ?intensity tender|rough|filthy. Tender softens what the traps add and leans them mild; filthy does
       the opposite. Each trap has its own tender and filthy lines (10y9b-intensity-lines.js).
     • KEPT: a herd leader can ?keep <who> for a week (they're asked): a tag written on them, a name for the week,
       milkin' hours, and who may breed them. ?kept shows it; ?kept off ends it.
  */
  const uLine = (key, mn, v) => tFill(pickFresh("udd:"+key, UDDER_LINES[key]), mn, v);
  const onBooks = mn => { const r = rec(mn); return !!(r && r.roles && r.roles.length); };
  const near = (a, b, d) => { const A = posOf(a), B = posOf(b); return !!(A && B && Math.max(Math.abs(A.X - B.X), Math.abs(A.Y - B.Y)) <= (d || 2)); };

  // ── milked till you cum ────────────────────────────────────
  function arousalOf(mn){ const C = charFor(mn); return Math.max(0, Math.min(100, (C && C.ArousalSettings && C.ArousalSettings.Progress) || 0)); }
  function stallCumTick(mn, st, now){
    const p = prodOf(mn);
    if (now - (st.cumAt || 0) < CFG.MILKCUM_GAP_S*1000 || quietNow(mn) || p.deniedUntil > now) return;
    const a = arousalOf(mn);
    if (a < CFG.MILKCUM_AROUSAL) return;
    if (Math.random() < CFG.MILKCUM_CHANCE * (1 + (a - CFG.MILKCUM_AROUSAL)/30)) milkCum(mn, st, false);
  }
  function milkCum(mn, st, real){
    const p = prodOf(mn), r = rec(mn), cock = st.kind === "cock";
    st.cumAt = Date.now(); st.cums = (st.cums || 0) + 1; st.got = st.got || { m: 0, s: 0 };
    r.milkCums = (r.milkCums || 0) + 1;
    let extra = 0;
    if (!cock && makesMilk(mn)){ extra = drainMilk(mn, Math.min(p.milk, milkCap(mn)*CFG.MILKCUM_LETDOWN)); st.got.m += extra; }
    else if (makesSemen(mn)){ extra = drainSemen(mn, Math.min(p.semen, semenCap(mn)*CFG.MILKCUM_LETDOWN)); st.got.s += extra; }
    emote((cock ? "🐂 " : "🥛 ")+uLine(cock ? "cumCock" : "cumMilk", mn, { ml: ml(extra) }), mn);
    if (!real) arouse(mn, 100, 100);
    face(mn, "afterglow", 60);
    if (r.milkCums === 1 || r.milkCums % 10 === 0) albumAdd(mn, "🥛", "Milked till you came", "Time number "+r.milkCums+". The cups got "+ml(extra)+" more out of you for it.");
    saveLedger();
  }
  function stallClimax(mn){ const p = prodOf(mn); if (p && p.stall && Date.now() - (p.stall.cumAt || 0) > 20000) milkCum(mn, p.stall, true); }

  // ── the dial ───────────────────────────────────────────────
  const DIALS = { gentle: { share: 0.35, rate: 0.7 }, steady: { share: null, rate: 1 }, hard: { share: 0.12, rate: 1.4 }, punishing: { share: 0, rate: 1.8 } };
  function dialOf(mn){ const r = rec(mn); return r && DIALS[r.stallDial] ? r.stallDial : "steady"; }
  function stallShare(mn){ const d = DIALS[dialOf(mn)]; return d.share == null ? CFG.PROD.STALL_LEAVE_SHARE : d.share; }
  function dialRate(mn){ return DIALS[dialOf(mn)].rate; }
  function dialBeat(mn, st){
    const d = dialOf(mn); if (d === "steady") return "";
    st.dialN = (st.dialN || 0) + 1;
    return st.dialN % 3 === 2 ? uLine("dial_"+d, mn) : "";
  }
  function stallDialDone(mn, st){
    const d = dialOf(mn), p = prodOf(mn), now = Date.now();
    if (d === "hard"){ p.soreUntil = now + CFG.DIAL_SORE_MIN*60000; later(() => tell(mn, "🥛 Milked hard, sugar: your teats are stretched long and sore, and they'll stay tender for "+CFG.DIAL_SORE_MIN+" minutes."), 5000); }
    if (d === "punishing"){
      p.soreUntil = now + CFG.DIAL_SENSITIVE_MIN*60000; p.sensitiveUntil = now + CFG.DIAL_SENSITIVE_MIN*60000; p.sensNag = now;
      later(() => { if (charFor(mn)) emote("🥛 "+uLine("punished", mn), mn); tell(mn, "🥛 Milked past empty, sugar. For the next hour every brush of air on you is goin' to feel like a tongue."); }, 5000);
    }
  }
  function dialCommand(sender, args, R){
    let t = sender, word = String(args[0] || "").toLowerCase();
    if (args.length >= 2){ t = resolveTarget(args[0]); word = String(args[1] || "").toLowerCase(); }
    if (!t || !rec(t)){ R("?stalldial <gentle|steady|hard|punishing> for yourself, sugar, or ?stalldial <who> <settin'> if you're staff."); return; }
    if (!DIALS[word]){ R("🥛 "+(t === sender ? "Your" : plainName(t)+"'s")+" stall dial is on "+dialOf(t).toUpperCase()+". Settin's: gentle (leaves you a third), steady (a quarter), hard (drains you low and fast, and sore after), punishing (past empty, and sensitive for an hour)."); return; }
    if (t !== sender && !isStaff(sender)){ R("Only staff set somebody else's dial, sugar."); return; }
    if (t !== sender && (word === "hard" || word === "punishing") && /\b(pain|overmilk|punish)/i.test(rec(t).limits || "")){ R("Their limits rule that settin' out, sugar."); return; }
    rec(t).stallDial = word; saveLedger(); audit(sender, "STALLDIAL", t+" "+word); syncCompanions(true);
    R("🥛 "+(t === sender ? "Your" : plainName(t)+"'s")+" stall dial: "+word.toUpperCase()+".");
    if (t !== sender) tell(t, "🥛 "+plainName(sender)+" has turned your stall dial to "+word.toUpperCase()+", sugar. ?stalldial steady puts it back whenever you like.");
  }

  // ── overdue ────────────────────────────────────────────────
  function overdueStage(mn){
    const p = prodOf(mn); if (!p || !p.fullSince) return 0;
    const h = (Date.now() - p.fullSince)/3600000, H = CFG.OVERDUE_H;
    return h >= H[2] ? 4 : h >= H[1] ? 3 : h >= H[0] ? 2 : 1;
  }
  function overdueTick(mn, now){
    const p = prodOf(mn);
    if (!makesMilk(mn)){ if (p.fullSince){ p.fullSince = 0; p.fullTold = 0; } return; }
    const cap = milkCap(mn);
    if (p.milk >= cap*0.95){ if (!p.fullSince){ p.fullSince = now; p.fullTold = 0; } }
    else if (p.milk < cap*0.8){ if (p.fullSince){ p.fullSince = 0; p.fullTold = 0; saveLedger(); } return; }
    const st = overdueStage(mn); if (!st) return;
    if (st > (p.fullTold || 0)){
      p.fullTold = st; saveLedger();
      if (st < 2 || quietNow(mn) || !charFor(mn)) return;   // (tight is only the clock startin')
      privateLine(mn, uLine("over"+st, mn), "emote");
      if (st >= 2){ emote("🥛 "+uLine("overRoom"+st, mn), mn); bodyMark(mn, { splat: ["chest"], color: "#FFFFFF" }); }
    }
    if (st >= 4 && now - (p.fullNag || 0) > 10*60000 && !quietNow(mn) && charFor(mn)){ p.fullNag = now; privateLine(mn, uLine("over4nag", mn), "emote"); arouse(mn, 8, 90); }
  }
  const OVERDUE_WORD = ["", "tight", "leakin'", "engorged", "burstin'"];

  // ── brought into milk ──────────────────────────────────────
  function bringInCommand(sender, args, R){
    const a0 = String(args[0] || "").toLowerCase(), me = rec(sender);
    if (a0 === "stop" || a0 === "off"){
      if (!me || !me.bringIn){ R("Nobody's bringin' you into milk, sugar."); return; }
      me.bringIn = null; saveLedger(); R("🥛 That's stopped, sugar. Your tits are your own again."); return;
    }
    if (!isStaff(sender)){ R(me && me.bringIn ? "🥛 You're bein' brought into milk: "+me.bringIn.n+" of "+CFG.BRINGIN_TENDS+" tendin's done. ?bringin stop ends it." : "Bringin' somebody into milk is a job for staff, sugar."); return; }
    const t = resolveTarget(args[0]), r = t && rec(t);
    if (!r || t === sender || !onBooks(t)){ R("?bringin <who>, sugar: somebody on the books who isn't a milker yet."); return; }
    if (!r.bringIn){
      if (makesMilk(t)){ R(plainName(t)+" is in milk already, sugar."); return; }
      if (limitBlocks(t, "milk")){ R("Their limits rule milkin' out, sugar."); return; }
      if (!charFor(t)){ R(plainName(t)+" isn't here, sugar."); return; }
      R("🥛 I've asked "+plainName(t)+" if they'll be brought into milk.");
      farmAsk(t, "🥛 "+plainName(sender)+" wants to bring you into milk, sugar: cups and hands on your tits mornin' and night for a few days, till they start to drip, and then you're a milker like the rest of the stock. Say yes or no. (?bringin stop ends it any time.)", (yes) => {
        if (!yes){ tell(sender, "🥛 "+plainName(t)+" said no to bein' brought into milk, sugar."); return; }
        r.bringIn = { by: sender, since: Date.now(), n: 0, d: "", dn: 0 }; saveLedger(); audit(sender, "BRINGIN", String(t));
        tell(sender, "🥛 "+plainName(t)+" said yes. Get beside them and ?bringin "+plainName(t)+" to tend them: twice a day at most, "+CFG.BRINGIN_TENDS+" tendin's to bring the milk.");
        if (charFor(t)) emote("🥛 "+uLine("bringStart", t, { x: plainName(sender) }), t);
      });
      return;
    }
    if (!near(sender, t)){ R("Get right up beside "+plainName(t)+" first, sugar."); return; }
    const b = r.bringIn, today = dayKey();
    if (b.d !== today){ b.d = today; b.dn = 0; }
    if (b.dn >= 2){ R("🥛 "+plainName(t)+" has been tended twice today, sugar. Let it work overnight."); return; }
    b.dn++; b.n++; saveLedger();
    if (b.n < CFG.BRINGIN_TENDS){
      emote("🥛 "+uLine(b.n >= CFG.BRINGIN_TENDS - 2 ? "bringLate" : "bringTend", t, { x: plainName(sender) }), t);
      arouse(t, 12);
      R("🥛 Tended: "+b.n+" of "+CFG.BRINGIN_TENDS+"."); return;
    }
    r.bringIn = null; r.milkable = true; const p = prodOf(t); p.milk = Math.max(p.milk || 0, 30); r.broughtIn = Date.now(); saveLedger(); audit(sender, "BRINGIN", t+" in milk");
    emote("🥛 "+uLine("bringDone", t, { x: plainName(sender) }), t);
    tell(t, "🥛 You're in milk, sugar. It'll build from here, and the stall will take you like any other milker.");
    albumAdd(t, "🥛", "Brought into milk", plainName(sender)+" worked your tits for "+Math.max(1, Math.round((Date.now() - b.since)/86400000))+" days till the first drops came.");
    earnRibbons(t, 3, "comin' into milk"); earnRibbons(sender, 2, "bringin' "+plainName(t)+" into milk");
    R("🥛 There it is. "+plainName(t)+" is a milker now."); syncCompanions(true);
  }

  // ── carryin' more than one way, bred back, whose is it ─────
  // a second litter in the other hole, once the first is past takin' another sire. undefined = not this time, carry on as usual
  function secondCarry(mother, stud, amount, bonus, hole){
    const p = prodOf(mother);
    if (!CFG.DOUBLE_CARRY || !p || !p.preg || p.preg2 || state.secondRoll) return undefined;
    if (hole === (p.preg.via === "butt" ? "butt" : "vulva")) return undefined;
    if (Date.now() - p.preg.since <= CFG.PROD.EXTRA_SIRE_WINDOW_H*3600000) return undefined;
    const first = p.preg; p.preg = null; state.secondRoll = true;
    let res = null;
    try { res = rollConception(mother, stud, amount, bonus, hole); } finally { state.secondRoll = false; }
    if (res === "new"){
      p.preg2 = p.preg; p.preg = first;
      later(() => { if (charFor(mother)) emote("🤰 "+uLine("second", mother, { h: hole === "butt" ? "ass" : "womb" }), mother); tell(mother, "🤰 That took, sugar, and you were already carryin'. There's a second litter in your "+(hole === "butt" ? "ass" : "womb")+" now, on its own clock."); }, 6000);
      return null;
    }
    p.preg = first; return null;
  }
  function openX(mn){ const p = prodOf(mn); return p && p.openUntil > Date.now() ? CFG.BREDBACK_X : 1; }
  function openedUp(mn){ const p = prodOf(mn); if (p){ p.openUntil = Date.now() + CFG.BREDBACK_MIN*60000; } }
  function bredBack(mn){
    const p = prodOf(mn), r = rec(mn);
    if (!p || !r || !(p.openUntil > Date.now())) return;
    p.openUntil = 0; r.bredBack = (r.bredBack || 0) + 1; saveLedger();
    later(() => { if (charFor(mn)) emote("🤰 "+uLine("bredBack", mn), mn); tell(mn, "🤰 BRED BACK, sugar: emptied and filled again inside the hour. That's "+r.bredBack+" time"+(r.bredBack === 1 ? "" : "s")+" on your record."); checkTitles(mn); }, 8000);
    albumAdd(mn, "🤰", "Bred back", "Caught again within the hour of bein' emptied. Time number "+r.bredBack+".");
  }
  // (who the sires are is no secret; how the litter splits between them is, till the birth)
  function sireSplit(sires, count){
    const out = {}; for (const s of sires) out[s] = 0;
    for (let i = 0; i < count; i++) out[sires[Math.floor(Math.random()*sires.length)]]++;
    return out;
  }
  function splitText(split){ return Object.entries(split).sort((a, b) => b[1] - a[1]).map(([s, n]) => n ? n+" "+plainName(parseInt(s, 10))+"'s" : "none of them "+plainName(parseInt(s, 10))+"'s").join(", "); }
  function revealSplit(mn, sires, count){
    if (sires.length < 2) return null;
    const split = sireSplit(sires, count), text = splitText(split);
    later(() => { if (onMap(mn)) emote("🍼 "+uLine("split", mn, { c: text }), mn); else tell(mn, "🍼 The count, sugar: "+text+"."); for (const s of sires) if (s > 0) tell(s, "🍼 "+plainName(mn)+"'s litter is counted: "+text+"."); },
          onMap(mn) && CFG.LAY_SCENE ? (6*CFG.TRAP_BEAT_S + 4)*1000 : 5000);
    albumAdd(mn, "🍼", "Whose they were", text+".");
    return split;
  }
  function carryTick(mn, now){
    const p = prodOf(mn), r = rec(mn);
    if (p.preg2 && !p.preg){ p.preg = p.preg2; p.preg2 = null; saveLedger(); }
    const all3 = !!(p.preg && p.preg2 && p.eggs);
    if (all3 && !r.tripleNow){
      r.tripleNow = true; r.triple = (r.triple || 0) + 1; saveLedger();
      if (charFor(mn)) emote("🤰 "+uLine("triple", mn), mn);
      tell(mn, "🤰 TRIPLE-CARRIED, sugar: a litter in your womb, another in your ass and a clutch of eggs on top. The board says so.");
      albumAdd(mn, "🤰", "Triple-carried", "A litter in the womb, a second in the ass, and "+p.eggs.n+" eggs besides, all at once.");
      checkTitles(mn);
    } else if (!all3 && r.tripleNow){ r.tripleNow = false; saveLedger(); }
  }

  // ── too big to walk ────────────────────────────────────────
  function bedTick(mn, now){
    const r = rec(mn), p = prodOf(mn);
    const big = !!(p.preg || p.preg2 || p.eggs) && bellyStage(mn) >= 4;
    if (r.bedded){
      if (!big || r.noBed){ bedStop(mn); if (charFor(mn)) emote("🛏️ "+uLine("bedUp", mn), mn); }
      return;
    }
    if (!big || r.noBed || !charFor(mn) || quietNow(mn) || (r.bedQuiet || 0) > now || r.penned || benchedNow(mn) || stockedNow(mn) || p.stall || r.sitting || p.labour ||
        (state.trapRuns && state.trapRuns.has(mn)) || (state.sceneRuns && state.sceneRuns.has(mn)) || /\b(immobil|bed ?rest)/i.test(r.limits || "")) return;
    const spot = Object.keys(L.spots || {}).find(n => /^farrow/.test(n)), pos = spot && L.spots[spot];
    if (!pos) return;   // no farrowin' stall on the map: nobody's bedded down
    r.bedded = { since: now, spot: spot || "" };
    r.penned = { until: now + 12*3600000, X: pos.X, Y: pos.Y, name: "the farrowin' stall", by: BOTMN(), bed: true };
    saveLedger();
    if (spot && !onSpot(mn, spot, 2)) teleport(mn, { X: pos.X, Y: pos.Y }, true);
    emote("🛏️ "+uLine("bedDown", mn), mn); sound(mn, "straw");
    tell(mn, "🛏️ You're too big to walk, sugar, so you're bedded down till it's over. Anybody can come ?tend you: you'll be fed and milked where you lie. ?bedrest off gets you up and keeps you up; your safeword does too.");
  }
  function bedStop(mn){
    const r = rec(mn); if (!r || !r.bedded) return false;
    r.bedded = null; if (r.penned && r.penned.bed) r.penned = null; saveLedger(); return true;
  }
  function bedTend(sender, args, R){
    const t = resolveTarget(args[0]), r = t && rec(t);
    if (!r || !r.bedded || t === sender) return false;
    if (!near(sender, t)){ R("Get right up beside "+plainName(t)+" first, sugar."); return true; }
    state.bedTends = state.bedTends || new Map();
    const key = sender+":"+t, now = Date.now();
    if (now - (state.bedTends.get(key) || 0) < CFG.BED_TEND_MIN*60000){ R(plainName(t)+" has just been seen to, sugar. Give it a few minutes."); return true; }
    state.bedTends.set(key, now);
    const p = prodOf(t);
    if (makesMilk(t) && !milkDenied(t) && p.milk > milkCap(t)*0.3){
      const got = drainMilk(t, p.milk*0.4);
      emote("🛏️ "+uLine("bedMilk", t, { x: plainName(sender), ml: ml(got) }), t);
    } else {
      p.boosts = p.boosts || {}; p.boosts.hungry = now + 3600000;
      emote("🛏️ "+uLine("bedFeed", t, { x: plainName(sender) }), t);
    }
    arouse(t, 10);
    earnRibbons(sender, 1, "tendin' "+plainName(t)+" in the farrowin' stall");
    R("🛏️ Tended."); return true;
  }

  // ── your words ─────────────────────────────────────────────
  const ADDRESS = ["sugar", "hon", "sweetie", "darlin'", "sweetheart"];
  const cleanWords = text => String(text || "").split(/[,/]+/).map(w => w.replace(/[^A-Za-z' -]/g, "").trim().slice(0, 20)).filter(w => w.length >= 2).slice(0, 8);
  const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  function likedWords(mn){ const r = rec(mn) || {}; return (r.kept && r.kept.name ? [r.kept.name] : []).concat(r.callMe || []); }
  function wordsFor(mn, text){
    try {
      const r = L && L.people && L.people[mn];
      if (!r || (!r.callMe && !r.neverCall && !(r.kept && r.kept.name))) return text;
      const liked = likedWords(mn), never = (r.neverCall || []).map(w => w.toLowerCase());
      const pick = () => liked[Math.floor(Math.random()*liked.length)];
      const safe = ADDRESS.find(w => !never.includes(w)) || "you";
      let t = String(text);
      for (const w of never) t = t.replace(new RegExp("\\b"+reEsc(w)+"(?:s|es)?(?![A-Za-z])", "gi"), () => liked.length ? pick() : safe);
      if (liked.length) t = t.replace(/\b(sugar|sweetie|hon|darlin'|sweetheart)(?![A-Za-z])/g, m => Math.random() < 0.5 ? pick() : m);
      return t;
    } catch(e){ return text; }
  }
  function wordsCommand(cmd, sender, args, R){
    const r = rec(sender); if (!onBooks(sender)){ R("That's for folks on the books, sugar."); return; }
    const key = cmd === "callme" ? "callMe" : "neverCall", text = args.join(" ").trim();
    if (!text){ R("💬 The farm calls you: "+((r.callMe || []).join(", ") || "whatever comes to mind")+".\nIt never calls you: "+((r.neverCall || []).join(", ") || "nothin' ruled out")+".\n?callme <names, with commas> · ?nevercall <names> · ?callme clear · ?nevercall clear"); return; }
    if (/^(clear|none|off)$/i.test(text)){ r[key] = null; saveLedger(); R(cmd === "callme" ? "💬 Cleared. I'll call you whatever comes to mind, sugar." : "💬 Cleared. Nothin's ruled out."); return; }
    const words = cleanWords(text);
    if (!words.length){ R("Give me names with commas between them, sugar, like ?"+cmd+" good girl, heifer, pet."); return; }
    r[key] = words; saveLedger(); audit(sender, cmd.toUpperCase(), words.join(","));
    R(cmd === "callme" ? "💬 Got it. From here on the farm calls you: "+words.join(", ")+"." : "💬 Got it. You'll never be called: "+words.join(", ")+". Any line about you that had one of those gets another word put in.");
  }

  // ── intensity ──────────────────────────────────────────────
  function intensityOf(mn){ const r = rec(mn); return r && (r.intensity === "tender" || r.intensity === "filthy") ? r.intensity : "rough"; }
  function intensityTail(mn, i, n, kind){
    const k = intensityOf(mn);
    if (k === "rough" || i < 2 || Math.random() >= 0.5) return "";
    return " "+(intensityTrapLine(mn, kind) || tFill(pickFresh("udd:int:"+k, UDDER_LINES["int_"+k]), mn));   // the trap's own, two times in three (10y9b-intensity-lines.js)
  }
  // tender leans the traps mild, filthy leans them brutal (10z-trap-variants.js asks)
  function intensitySev(mn, sev){ const k = intensityOf(mn); return k === "tender" ? Math.max(1, sev - 1) : k === "filthy" ? Math.min(3, sev + (Math.random() < 0.5 ? 1 : 0)) : sev; }
  function intensityCommand(sender, args, R){
    const r = rec(sender), w = String(args[0] || "").toLowerCase();
    if (!onBooks(sender)){ R("That's for folks on the books, sugar."); return; }
    if (!/^(tender|rough|filthy)$/.test(w)){ R("🔥 Your intensity is "+intensityOf(sender).toUpperCase()+". ?intensity tender (softer words, traps lean mild) · rough (as written) · filthy (dirtier words, traps lean brutal)."); return; }
    r.intensity = w; saveLedger(); syncCompanions(true);
    R("🔥 Intensity: "+w.toUpperCase()+". "+(w === "tender" ? "The farm will be sweet about ruinin' you." : w === "filthy" ? "No more manners, then." : "As written."));
  }

  // ── kept ───────────────────────────────────────────────────
  function keptOf(mn){ const r = rec(mn); return r && r.kept && r.kept.until > Date.now() ? r.kept : null; }
  function keptEnd(mn, why){
    const r = rec(mn); if (!r || !r.kept) return false;
    const k = r.kept; r.kept = null; if (r.rights && r.rights.kept) r.rights = null; saveLedger(); syncCompanions(true);
    if (why !== "quiet") tell(k.by, "🏷️ "+plainName(mn)+" isn't kept by you any more, sugar"+(why === "time" ? ": the week's up." : "."));
    return true;
  }
  function keptMilkBlock(mn){
    const k = keptOf(mn); if (!k || !k.milk || !k.milk.length) return null;
    const h = hourNow();
    return k.milk.some(x => h === x || h === (x + 1) % 24) ? null : k;
  }
  function keptCommand(cmd, sender, args, R){
    if (cmd === "kept"){
      const k = keptOf(sender), a0 = String(args[0] || "").toLowerCase();
      if (a0 === "off" || a0 === "end"){ R(keptEnd(sender, "off") ? "🏷️ You're nobody's kept thing now, sugar." : "Nobody's keepin' you, sugar."); return; }
      R(k ? "🏷️ You're KEPT by "+plainName(k.by)+" for "+Math.max(1, Math.ceil((k.until - Date.now())/86400000))+" more day(s)."+(k.tag ? "\nYour tag: "+k.tag : "")+(k.name ? "\nThis week you're called: "+k.name : "")+(k.milk && k.milk.length ? "\nMilked at: "+k.milk.map(h => h+":00").join(" and ") : "")+(rec(sender).rights && rec(sender).rights.kept ? "\nBred by: "+plainName(rec(sender).rights.stud)+" only" : "")+"\n?kept off ends it."
           : "Nobody's keepin' you, sugar."); return;
    }
    const t = resolveTarget(args[0]), r = t && rec(t), sub = String(args[1] || "").toLowerCase(), rest = args.slice(2).join(" ").trim();
    if (!r || t === sender){ R("🏷️ ?keep <who> asks one of your herd to be kept for a week. Then: ?keep <who> tag <words> · name <a name> · milk <hour> <hour> (or any) · breed <who> (or anyone) · off"); return; }
    if (!isProprietor(sender) && !membership(t, sender)){ R(plainName(t)+" isn't in your herd, sugar. You can only keep your own."); return; }
    const k = keptOf(t);
    if (!k){
      if (sub){ R(plainName(t)+" isn't kept yet, sugar. ?keep "+plainName(t)+" asks them."); return; }
      if (!charFor(t)){ R(plainName(t)+" isn't here to ask, sugar."); return; }
      R("🏷️ I've asked "+plainName(t)+".");
      farmAsk(t, "🏷️ "+plainName(sender)+" wants to KEEP you for a week, sugar: a tag written on you, a name of their choosin', and their say over when you're milked and who breeds you. Say yes or no. (?kept off ends it any time, and your limits still rule.)", (yes) => {
        if (!yes){ tell(sender, "🏷️ "+plainName(t)+" said no to bein' kept, sugar."); return; }
        r.kept = { by: sender, since: Date.now(), until: Date.now() + CFG.KEPT_DAYS*86400000, tag: "", name: "", milk: [] }; saveLedger(); audit(sender, "KEEP", String(t)); syncCompanions(true);
        tell(sender, "🏷️ "+plainName(t)+" is yours to keep for "+CFG.KEPT_DAYS+" days. ?keep "+plainName(t)+" tag <words> · name <a name> · milk <hour> <hour> · breed <who>");
        if (charFor(t)){ emote("🏷️ "+uLine("kept", t, { x: plainName(sender) }), t); sound(t, "clip"); }
      });
      return;
    }
    if (k.by !== sender && !isProprietor(sender)){ R(plainName(t)+" is kept by "+plainName(k.by)+", sugar."); return; }
    if (sub === "off" || sub === "release"){ keptEnd(t, "quiet"); tell(t, "🏷️ "+plainName(sender)+" has let you go, sugar. You're not kept any more."); R("🏷️ Let go."); return; }
    if (sub === "tag"){
      k.tag = rest.replace(/[^A-Za-z0-9 !?.,'&#*+-]/g, "").slice(0, 20).toUpperCase(); saveLedger(); syncCompanions(true);
      if (k.tag && !bodyMark(t, { write: { line: k.tag, pos: 4, style: 0 } })) tell(t, "🏷️ With the Companion and \"Farm can mark my body\" on, you'd be wearin' \""+k.tag+"\" on your skin right now, sugar.");
      tell(t, "🏷️ "+plainName(sender)+" has tagged you: "+(k.tag || "nothin'")+"."); R("🏷️ Tagged: "+(k.tag || "cleared")+"."); return;
    }
    if (sub === "name"){
      k.name = cleanWords(rest)[0] || ""; saveLedger(); syncCompanions(true);
      tell(t, k.name ? "🏷️ This week "+plainName(sender)+" has you called \""+k.name+"\", and the farm will use it." : "🏷️ "+plainName(sender)+" took your week's name back."); R("🏷️ Called: "+(k.name || "cleared")+"."); return;
    }
    if (sub === "milk"){
      const hours = args.slice(2).map(x => parseInt(x, 10)).filter(x => x >= 0 && x <= 23).slice(0, 3);
      k.milk = hours; saveLedger();
      tell(t, hours.length ? "🏷️ "+plainName(sender)+" will have you milked at "+hours.map(h => h+":00").join(" and ")+", sugar, and the stall won't take you outside those hours." : "🏷️ "+plainName(sender)+" has taken your milkin' hours off. The stall takes you any time.");
      R("🏷️ Milkin' hours: "+(hours.length ? hours.map(h => h+":00").join(", ")+" (an hour's grace after each)" : "any time")+"."); return;
    }
    if (sub === "breed"){
      if (/^(anyone|any|all|off)$/i.test(rest)){ if (r.rights && r.rights.kept) r.rights = null; saveLedger(); tell(t, "🏷️ "+plainName(sender)+" says anybody may breed you, sugar."); R("🏷️ Open to anyone."); return; }
      const s = resolveTarget(args[2]); if (!s || !rec(s)){ R("Who, sugar? ?keep "+plainName(t)+" breed <who>, or anyone."); return; }
      if (r.rights && r.rights.until > Date.now() && !r.rights.kept){ R(plainName(t)+" has breedin' rights of their own choosin' out already, sugar. Those stand."); return; }
      r.rights = { stud: s, until: k.until, since: Date.now(), allow: [], kept: true }; saveLedger();
      tell(t, "🏷️ "+plainName(sender)+" says only "+plainName(s)+"'s loads take in you this week, sugar."); R("🏷️ Only "+plainName(s)+" breeds "+plainName(t)+" this week."); return;
    }
    R("🏷️ "+plainName(t)+" is kept by you for "+Math.max(1, Math.ceil((k.until - Date.now())/86400000))+" more day(s). Tag: "+(k.tag || "none")+" · name: "+(k.name || "none")+" · milked: "+(k.milk.length ? k.milk.map(h => h+":00").join(", ") : "any time")+"\n?keep <who> tag|name|milk|breed|off");
  }

  // ── commands, the tick, the safeword, the panel ────────────
  function uddersCommand(cmd, sender, args, R){
    if (cmd === "stalldial") return dialCommand(sender, args, R);
    if (cmd === "bringin") return bringInCommand(sender, args, R);
    if (cmd === "callme" || cmd === "nevercall") return wordsCommand(cmd, sender, args, R);
    if (cmd === "intensity") return intensityCommand(sender, args, R);
    if (cmd === "keep" || cmd === "kept") return keptCommand(cmd, sender, args, R);
    if (cmd === "bedrest"){
      const r = rec(sender), a0 = String(args[0] || "").toLowerCase();
      if (!onBooks(sender)){ R("That's for folks on the books, sugar."); return; }
      if (a0 !== "on" && a0 !== "off"){ R("🛏️ Bed rest is "+(r.noBed ? "OFF" : "on")+" for you: when you're too big to walk, the farm beds you down till it's over. ?bedrest off keeps you on your feet."); return; }
      r.noBed = a0 === "off"; if (r.noBed) bedStop(sender); saveLedger(); syncCompanions(true);
      R(r.noBed ? "🛏️ Bed rest: off. However big you get, you'll waddle." : "🛏️ Bed rest: on. Get big enough and you'll be bedded down."); return;
    }
  }
  function uddersSafe(mn){ const r = rec(mn); if (r && r.bedded){ bedStop(mn); r.bedQuiet = Date.now() + 3600000; saveLedger(); } }
  function uddersTick(){
    const now = Date.now();
    if (now - (state.udderAt || 0) < 30000) return; state.udderAt = now;
    for (const [k, r] of Object.entries(L.people)){
      const mn = parseInt(k, 10), p = r.prod; if (!p) continue;
      try {
        if (p.preg || p.preg2 || r.tripleNow) carryTick(mn, now);
        if (r.kept && r.kept.until <= now) keptEnd(mn, "time");
        if (!charFor(mn)) continue;
        overdueTick(mn, now); bedTick(mn, now);
        if (p.sensitiveUntil > now && now - (p.sensNag || 0) > 10*60000 && !quietNow(mn)){ p.sensNag = now; privateLine(mn, uLine("sensitive", mn), "emote"); arouse(mn, 10, 95); }
      } catch(e){ warn("udders tick "+mn+":", e); }
    }
  }
  function uddersHappening(mn, out){
    const r = rec(mn), p = prodOf(mn), now = Date.now(), st = overdueStage(mn);
    if (st >= 2) out.push("🥛 Overdue: your udders are "+OVERDUE_WORD[st]+". Get to a stall.");
    if (r.bedded) out.push("🛏️ Too big to walk: bedded down till it's over. ?bedrest off gets you up.");
    if (p.preg && p.preg2) out.push("🤰 Carryin' two litters"+(p.eggs ? " and a clutch: triple-carried." : ": one in the womb, one in the ass."));
    if (p.openUntil > now) out.push("🤰 Wide open: for "+Math.max(1, Math.ceil((p.openUntil - now)/60000))+" more min you'll catch at almost anything.");
    if (p.sensitiveUntil > now) out.push("🥛 Milked past empty: sensitive for "+Math.max(1, Math.ceil((p.sensitiveUntil - now)/60000))+" more min.");
    if (r.bringIn) out.push("🥛 Bein' brought into milk: "+r.bringIn.n+" of "+CFG.BRINGIN_TENDS+" tendin's.");
  }
  function uddersStateFor(mn, s){
    const r = rec(mn), k = keptOf(mn);
    s.dial = dialOf(mn); s.intensity = intensityOf(mn);
    if (r.callMe || r.neverCall) s.words = { call: r.callMe || [], never: r.neverCall || [] };
    if (k) s.kept = { by: plainName(k.by), until: k.until, tag: k.tag, name: k.name, milk: k.milk };
    if (r.milkCums) s.milkCums = r.milkCums;
    if (r.noBed) s.noBed = true;
  }

  const UDDER_LINES = {
    cumMilk: ["The cups drag one long pull too many out of %n and they go rigid in the stall, cummin' on nothin' but bein' milked. Their tits let down in a rush: %ml more, hissin' into the lines.",
              "%n's knees buckle. They cum hard in the straps with both teats stretched down the glass, and the milk comes with it, %ml in great hot spurts.",
              "It tips %n over. A wail, hips jerkin' at the air, and every squeeze of their cunt sends another jet down the hoses: %ml the stall hadn't counted on.",
              "%n cums like stock: loud, helpless, and still bein' milked through it. The pump doesn't miss a beat. It just takes the extra %ml and keeps goin'.",
              "There it is. %n shudders from the teats down, eyes rolled back, lettin' down %ml all at once while their thighs run wet. The cups only suck harder."],
    cumCock: ["The sleeve wrings %n past bearin' and they cum in it, buckin' against the rail, pumpin' %ml into the jar in thick ropes while it keeps strokin'.",
              "%n's balls draw up tight in the cup and they unload with a groan: %ml, milked out of them pulse by pulse, and the machine doesn't let up after.",
              "It gets %n there and holds them there, cock jumpin' in the sleeve, emptyin' %ml down the line while their legs shake."],
    dial_gentle: ["The cups are bein' sweet with you. Slow, shallow pulls, like a warm mouth takin' its time.",
                  "It milks you soft, a lazy tug and a long rest, and you find yourself leanin' into it for more.",
                  "Gentle as hands. Every pull ends in a little squeeze that makes your eyes close."],
    dial_hard: ["The pump's turned up. Each pull drags your teats a full inch down the glass and lets them snap back, over and over.",
                "It's not askin'. Hard, fast, deep pulls that make you grunt, and the bucket's fillin' twice as quick.",
                "Your teats are stretched long and dark in the cups and the pump only wants them longer."],
    dial_punishing: ["There's hardly anything left and it doesn't care. The cups haul on you dry and raw, and you can feel it right down between your legs.",
                     "It's milkin' you past empty. Every pull finds one more drop somewhere deep and tears it out of you.",
                     "You're wrung out, shakin', beggin' the rail, and the dial's still all the way over."],
    punished: ["%n is let out of the stall on legs that won't hold, teats swollen dark and twice their length, flinchin' when the air so much as moves over them."],
    sensitive: ["Your wrung-out teats catch on nothin' at all and a jolt goes straight to your sex.",
                "Every step sways them, and every sway is almost too much. You're wet from walkin'.",
                "A draught from the barn door finds your nipples and you have to stop and hold on to somethin'."],
    over1: ["Your udders have gone tight and warm. Full to the skin, and nobody's milked you."],
    over2: ["A bead of milk wells at each teat and runs. You're leakin', and you can't stop it."],
    over3: ["They're hard as melons now and hot to the touch, the skin shiny with it. Every heartbeat throbs in them."],
    over4: ["You can't think. There's only how full you are, the ache, the drip, and the need to have somethin' latch on and take it."],
    over4nag: ["Milk is runnin' down your belly in two steady lines. You'd let anybody milk you right now. Anybody.",
               "Your udders are so tight they shake when you breathe. You catch yourself squeezin' them and it only makes it worse.",
               "You're dribblin' with every step and lowin' under your breath. Get to a stall."],
    overRoom2: ["Two wet patches are spreadin' down %n's front. Somebody's overdue for milkin' and startin' to leak.",
                "%n's teats are drippin' steady, a bead at a time, and they keep pressin' an arm across to hide it."],
    overRoom3: ["%n's udders have swollen up round and hard, veins standin' out, milk runnin' in threads. They wince when anything touches them.",
                "Anybody can see %n hasn't been milked: tits engorged and shinin', nipples stood out thick and weepin'."],
    overRoom4: ["%n is burstin'. Milk's sprayin' in thin jets every time they move, soakin' them to the knees, and they're moanin' like an animal left too long in the field.",
                "%n can barely stand for how full they are, cradlin' two huge, hot, streamin' udders and beggin' anybody who looks their way."],
    bringStart: ["%x cups %n's dry tits in both hands, weighs them, and rolls the nipples slow between finger and thumb. \"We'll have these runnin' inside the week.\""],
    bringTend: ["%x sits %n down and works their tits by hand: warm oil, long firm strokes from the ribs to the nipple, then the little hand pump, suckin' at nothin' till %n is squirmin'.",
                "%x fits two small cups to %n's nipples and lets the pump tug at them dry for a good while, thumbs rubbin' circles underneath. Nothin' comes. Not yet.",
                "\"Hold still.\" %x milks at %n's empty teats like they're already a cow, pinchin' and drawin' down, over and over, till they're puffy and red and %n is breathin' hard."],
    bringLate: ["%n's tits have filled out under %x's hands, heavier than last week, the nipples fat and dark from all the pullin'. Somethin' is close.",
                "%x squeezes and a single clear bead stands on %n's nipple. \"There you are. Nearly.\" The cups go back on."],
    bringDone: ["%x strips %n's teat between two fingers and a thin white jet hits the straw. Then the other side. %n stares down at their own drippin' tits while the barn whoops: first milk, and plenty more behind it."],
    second: ["Somethin' catches in %n's %h, low and certain, never mind the litter they're already carryin'. That's two bellies' worth in one animal now.",
             "%n was bred already. It didn't matter. Their %h has taken too, and they'll be carryin' front and back."],
    triple: ["%n is carryin' three ways at once: a litter in the womb, another up the ass, and a clutch of eggs packed in besides. Their belly's a great tight drum and it's only goin' to get worse.",
             "Womb full, ass full, and eggs on top. %n has been bred in every way this farm knows, all at the same time, and can hardly get their arms round the result."],
    bredBack: ["%n isn't an hour emptied and somethin' has already taken in them again. Bred back, still slack and drippin' from the last lot.",
               "Not even time to close up. %n is caught again inside the hour, and the farm girl chalks BRED BACK on their flank."],
    split: ["The farm girl counts the litter off against the book. \"Well now. %c.\" She grins up at %n. \"Busy thing, weren't you.\"",
            "Nobody knew whose they'd be till now. The count for %n's litter: %c."],
    bedDown: ["%n gets three steps and can't manage a fourth, belly near on the ground. Two hands walk them to deep straw and ease them down on their side. They're not gettin' up again till it's over.",
              "That belly has finally got too big for %n's legs. They're bedded down in the farrowin' stall, propped on bolsters, huge and helpless, for anybody to come and tend."],
    bedUp: ["%n is helped up out of the straw, lighter and unsteady, and set back on their own feet."],
    bedMilk: ["%x kneels in the straw by %n and milks them where they lie, one heavy teat and then the other, %ml into a pail, while %n can only pant and let it happen.",
              "%x props %n's top leg, settles in against that enormous belly and strips their udders by hand: %ml, warm in the bucket."],
    bedFeed: ["%x sits by %n's head and feeds them warm mash off their fingers, then rubs slow circles over the great tight belly till it settles.",
              "%x tips a bottle to %n's lips, holds it till it's drained, and has a good long feel of that belly while they're there."],
    kept: ["%x clips a tag to %n's collar and turns their face up by the chin. \"Mine, for the week.\" %n is kept."],
    int_tender: ["It's almost kind about it.", "Somethin' strokes %n's hair while it happens.", "It goes slow enough for them to feel every inch.", "\"Good. That's it. Good,\" somebody murmurs.",
                 "It waits for %n to catch a breath before it goes on.", "%n is held close the whole time.", "It's careful with them, the way you are with stock you mean to keep.",
                 "A thumb wipes %n's cheek dry.", "It lets them rock back against it at their own pace.", "Nothin' about it hurts. That's the worst part: how easy it is to give in."],
    int_filthy: ["%n is droolin', leakin' and stinkin' of it, and nobody's goin' to clean them up.", "It uses them like a hole in a wall.", "\"Look at the state of that cunt,\" somebody says, not unkindly.",
                 "%n's own slick is runnin' down to their knees.", "It slaps wet with every stroke and the sound carries clear across the yard.", "They're a mess of spit and cum and they're pushin' back for more.",
                 "Nothin' on this farm is too dirty to do to %n, and they've just proved it again.", "It grunts, and %n grunts with it, just another animal gettin' rutted in the muck.",
                 "%n's holes are left gapin' and foamin', and they're still humpin' the air.", "It wipes itself off on %n's face when it's done with that end."],
  };
