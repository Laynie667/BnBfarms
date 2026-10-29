  /* WHAT'S IN THIS FILE (10y9o-trap-ratings.js)
     RATE A TRAP and THE TRAP OF THE DAY (Laynie, Oct 27: "on rate a trap, picking not for me twice just makes it less
     likely to spring for them, it doesnt stop it completely").
     • When a trap lets go of them, their Companion asks how it was: 💖 Loved it · 👍 Fine · 🙅 Not for me. Without a
       Companion I whisper the question the first time each trap has them: ?rate loved, ?rate fine, ?rate no.
     • What they pick only steers their own odds. Loved it: that trap finds them a bit more often. Not for me: less often,
       and twice in their last few ratings of it, a lot less often. It never stops it: ?traps skip <kind> does that.
     • ?rate: what you've rated · ?rate <trap> loved|fine|no · ?rate ask off: stop askin' after each one.
       ?traps ratings (staff): the farm's favourites and the ones folks pass on.
     • THE TRAP OF THE DAY: each day I pick one of the traps the farm has out (a tile's, a place's, the water's, or one in
       season). All day it's twice as likely to be the one that springs, the water's twice as hungry if it's the water's,
       and the first time it has somebody that day there's a ribbon in it. I tell the room once a day.
  */
  if (CFG.RATE_LOVED_X === undefined) CFG.RATE_LOVED_X = 1.25;   // each "loved it" in their last four ratings of a trap
  if (CFG.RATE_NO_X === undefined) CFG.RATE_NO_X = 0.5;          // each "not for me" (two of them: a quarter as likely)
  if (CFG.RATE_FLOOR === undefined) CFG.RATE_FLOOR = 0.2;        // never rarer than this: "it doesnt stop it completely"
  if (CFG.RATE_ASK_MIN === undefined) CFG.RATE_ASK_MIN = 10;     // how long the Companion's question stays up
  if (CFG.TRAP_DAY_X === undefined) CFG.TRAP_DAY_X = 2;
  const RATE_KEEP = 4;   // the ratings of each trap that count (the last four)
  const RATES = {
    loved: { icon: "💖", label: "Loved it", words: ["loved", "love", "lovedit", "loveit", "fav", "favourite", "favorite", "more", "yes", "best", "amazing"] },
    fine:  { icon: "👍", label: "Fine", words: ["fine", "ok", "okay", "alright", "good", "meh", "sure", "decent"] },
    no:    { icon: "🙅", label: "Not for me", words: ["no", "notforme", "nope", "nah", "not", "less", "dislike", "nothanks", "pass"] },
  };
  function rateWord(text){
    const t = String(text || "");
    if (/💖|❤/.test(t)) return "loved"; if (/👍/.test(t)) return "fine"; if (/🙅|👎/.test(t)) return "no";
    const w = t.toLowerCase().replace(/[^a-z]/g, "");
    if (!w) return null;
    return Object.keys(RATES).find(k => RATES[k].words.includes(w)) || null;
  }
  // how much likelier (or rarer) this trap is for them, from what they said about it
  function trapRateX(mn, kind){
    const r = rec(mn), h = r && r.trapRate && r.trapRate[kind];
    if (!h || !h.length) return 1;
    let x = 1;
    for (const v of h.slice(-RATE_KEEP)) x *= v === "loved" ? CFG.RATE_LOVED_X : v === "no" ? CFG.RATE_NO_X : 1;
    return Math.max(CFG.RATE_FLOOR, Math.min(2, x));
  }
  const rateOdds = (x) => x >= 1.9 ? "about twice as often" : x > 1.05 ? "a bit more often" : x >= 0.95 ? "as often as any other" : x >= 0.45 ? "about half as often" : x >= 0.24 ? "about a quarter as often" : "only now and then";
  const lastRate = (r, kind) => { const h = r && r.trapRate && r.trapRate[kind]; return h && h.length ? h[h.length - 1] : null; };
  function trapRatesLedger(){ L.trapRates = L.trapRates || {}; return L.trapRates; }
  // a fixed trap-<kind> tile they've said isn't for them: now and then it lets them by (quietly: the tiles stay hidden)
  function rateLetsBy(mn, kind){ const x = trapRateX(mn, kind); return x < 1 && Math.random() >= x; }
  // the water: what they said about what lives in it, and twice as hungry on its day
  function waterDayX(mn, wk){ return trapRateX(mn, wk) * (wk === trapOfDay() ? CFG.TRAP_DAY_X : 1); }

  // ── a trap let go of them (trapRun's end, 10u-traps.js; the tickle rack and the mirror box too) ──
  function trapEnded(mn, kind, before){
    const r = rec(mn), K = TRAP_KINDS[kind], now = Date.now();
    if (!r || !K || /^keep-|^custom/.test(kind)) return;
    const last = (r.trapLog || []).slice(-1)[0], byHand = !!(last && last.kind === kind && last.hand);
    // the trap of the day: a ribbon, the first time it has them today
    if (!byHand && kind === trapOfDay() && r.trapDayPaid !== dayKey()){
      r.trapDayPaid = dayKey(); saveLedger();
      later(() => { if (charFor(mn)) earnRibbons(mn, 1, "bein' caught by the trap of the day"); }, 2500);
    }
    // how was it?
    if (!r.rateAskOff){
      if (hasCompanion(mn)){ r.rateAsk = { kind, until: now + CFG.RATE_ASK_MIN*60000 }; saveLedger(); }
      else {
        r.rateTold = r.rateTold || {};
        if (!r.rateTold[kind] && now - (r.rateToldAt || 0) > 30*60000){
          r.rateTold[kind] = 1; r.rateToldAt = now; saveLedger();
          later(() => { if (charFor(mn)) tell(mn, K.icon+" How was the "+kind+", sugar? ?rate loved, ?rate fine or ?rate no. \"No\" only makes it rarer for you, it never stops it (?traps skip "+kind+" does that). ?rate ask off and I stop askin'."); }, 9000);
        }
      }
    }
    try { afterLines(mn, kind, before); } catch(e){ warn("trap after lines:", e); }   // how they're left (10y9p-aftermath.js)
  }

  // ── ?rate ───────────────────────────────────────────────
  function rateCommand(sender, args, R){
    const r = rec(sender);
    if (!r || !r.roles || !r.roles.length){ R("That's just for folks on the books, sugar."); return; }
    const words = args.map(a => String(a || "").toLowerCase());
    if (words[0] === "ask"){
      const v = words[1];
      if (v !== "on" && v !== "off"){ R("💬 I "+(r.rateAskOff ? "don't ask" : "ask")+" how each trap was when it lets you go. ?rate ask on|off"); return; }
      r.rateAskOff = v === "off"; if (r.rateAskOff) r.rateAsk = null; saveLedger(); syncCompanions(true);
      R(r.rateAskOff ? "💬 I'll stop askin', sugar. ?rate <trap> loved|fine|no still works whenever you like." : "💬 I'll ask how each trap was when it lets you go."); return;
    }
    let kind = words.find(w => TRAP_KINDS[w]) || null;
    const rest = words.filter(w => w !== kind), pick = rateWord(rest.join(""));
    if (words.length && !kind && !pick){ R("I don't know that one, sugar. ?rate <trap> loved, fine or no (?traps lists them), or ?rate on its own for what you've rated."); return; }
    if (!words.length){
      // what they've rated, and what that does
      const rt = r.trapRate || {}, by = { loved: [], fine: [], no: [] };
      for (const [k, h] of Object.entries(rt)){
        const v = h && h.length ? h[h.length - 1] : null; if (!v || !by[v] || !TRAP_KINDS[k]) continue;
        by[v].push(k+(v === "no" && h.filter(x => x === "no").length >= 2 ? " (rare now)" : ""));
      }
      const any = by.loved.length || by.fine.length || by.no.length;
      R("🗳️ YOUR TRAP RATINGS\n"+(any ? Object.keys(RATES).filter(k => by[k].length).map(k => RATES[k].icon+" "+RATES[k].label+": "+by[k].join(", ")).join("\n") : "Nothin' rated yet.")+
        "\n\nLoved it: that trap finds you a bit more often. Not for me: less often, and twice, a lot less often. It never stops one: ?traps skip <trap> does that."+
        "\n?rate <trap> loved|fine|no · ?rate loved (the last one that had you) · ?rate ask "+(r.rateAskOff ? "on" : "off")); return;
    }
    if (!kind){
      kind = (r.rateAsk && r.rateAsk.kind) || ((r.trapLog || []).slice(-1)[0] || {}).kind || null;
      if (!kind || !TRAP_KINDS[kind]){ R("Which trap, sugar? ?rate <trap> loved, fine or no."); return; }
    }
    if (!(r.trapKinds || {})[kind]){ R(TRAP_KINDS[kind].icon+" The "+kind+" hasn't had you yet, sugar, so you can't say how it was. ?traps skip "+kind+" rules it out, if you'd rather it never did."); return; }
    if (!pick){
      const x = trapRateX(sender, kind), lr = lastRate(r, kind);
      R(TRAP_KINDS[kind].icon+" The "+kind+(lr ? ": you said "+RATES[lr].label.toLowerCase()+". It finds you "+rateOdds(x)+"." : ": you haven't rated it yet.")+" ?rate "+kind+" loved, fine or no."); return;
    }
    // the farm's tally keeps everybody's latest word on each trap
    const T = trapRatesLedger(), was = lastRate(r, kind), t = T[kind] = T[kind] || { loved: 0, fine: 0, no: 0 };
    if (was && t[was] > 0) t[was]--;
    t[pick]++;
    r.trapRate = r.trapRate || {}; r.trapRate[kind] = (r.trapRate[kind] || []).concat(pick).slice(-RATE_KEEP);
    if (r.rateAsk && r.rateAsk.kind === kind) r.rateAsk = null;
    saveLedger(); syncCompanions(true); audit(sender, "RATE", kind+" "+pick);
    const x = trapRateX(sender, kind), nos = r.trapRate[kind].filter(v => v === "no").length, icon = TRAP_KINDS[kind].icon;
    R(pick === "loved" ? "💖 Noted, sugar: you loved the "+icon+" "+kind+". It'll find you "+rateOdds(x)+" now."
      : pick === "fine" ? "👍 Noted: the "+icon+" "+kind+" was fine. It finds you "+rateOdds(x)+"."
      : nos >= 2 ? "🙅 That's twice you've said the "+icon+" "+kind+"'s not for you, so it'll only find you now and then. It never stops altogether: ?traps skip "+kind+" does that, if you'd rather."
      : "🙅 Noted: the "+icon+" "+kind+"'s not for you. It'll spring for you "+rateOdds(x)+" now (it never stops altogether: ?traps skip "+kind+" does that).");
  }
  // ?traps ratings (staff): the farm's favourites, the ones folks pass on, and what's sprung most
  function trapRatingsText(){
    const T = trapRatesLedger(), rows = Object.entries(T).filter(([k]) => TRAP_KINDS[k]);
    const top = (key, n) => rows.filter(([, t]) => t[key] > 0).sort((a, b) => b[1][key] - a[1][key]).slice(0, n).map(([k, t]) => TRAP_KINDS[k].icon+" "+k+" ("+t[key]+")").join(", ");
    const sprung = {};
    for (const r of Object.values(L.people)) for (const [k, n] of Object.entries(r.trapKinds || {})) if (TRAP_KINDS[k]) sprung[k] = (sprung[k] || 0) + n;
    const most = Object.entries(sprung).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, n]) => TRAP_KINDS[k].icon+" "+k+" ("+n+")").join(", ");
    const never = Object.keys(TRAP_KINDS).filter(k => !sprung[k] && !/^keep-|^custom/.test(k) && seasonOnFor(k)).length;
    return "🗳️ HOW THE HERD RATES THE TRAPS (everybody's latest word on each)\n"+
      "💖 Most loved: "+(top("loved", 8) || "nothin' yet")+
      "\n🙅 Most \"not for me\": "+(top("no", 8) || "nothin' yet")+
      "\n🧪 Sprung most: "+(most || "nothin' yet")+(never ? "\n"+never+" kinds haven't caught anybody yet." : "")+
      "\n\"Not for me\" only makes a trap rarer for the one who said it. Nobody else's odds change.";
  }

  // ── the trap of the day ─────────────────────────────────
  // what the farm has out today: the tiles (their own trap, their place's, or anything), the water, and what's in season
  function trapDayPool(){
    const out = new Set(), any = () => Object.keys(TRAP_KINDS).forEach(k => { if (k !== "tentacle" && !SEASON_OF[k]) out.add(k); });
    let anyDone = false;
    for (const [n] of trapSpots()){
      const k = trapKindOf(n);
      if (k && k !== "random"){ out.add(k); continue; }
      const th = trapTheme(n);
      if (th) TRAP_THEMES[th].kinds.forEach(x => out.add(x));
      else if (!anyDone){ any(); anyDone = true; }
    }
    for (const [n] of waterSpots()) out.add(waterKindOf(n));
    for (const id of seasonsOn()) SEASONS[id].kinds.forEach(x => out.add(x));
    return [...out].filter(k => TRAP_KINDS[k] && !/^keep-|^custom/.test(k) && seasonOnFor(k));
  }
  function trapOfDay(){
    const key = dayKey(), D = L.trapDay;
    if (D && D.key === key) return D.kind && TRAP_KINDS[D.kind] && seasonOnFor(D.kind) ? D.kind : null;
    const pool = trapDayPool(), prev = D && D.kind, can = pool.filter(k => k !== prev);
    const kind = can.length ? can[Math.floor(Math.random()*can.length)] : pool[0] || null;
    L.trapDay = { key, kind, told: false }; saveLedger();
    return kind;
  }
  function trapDayLine(){ const k = trapOfDay(); return k ? "🎯 Trap of the day: "+TRAP_KINDS[k].icon+" "+k+", "+TRAP_KINDS[k].what+". Twice as likely today, and a ribbon the first time it has you." : ""; }
  // once a minute: a new day picks a new one, and the room hears it the first time somebody with traps on is about
  function trapDayTick(){
    const now = Date.now();
    if (now - (state.trapDayAt || 0) < 60000) return;
    state.trapDayAt = now;
    const k = trapOfDay(), D = L.trapDay;
    if (!k || !D || D.told || !inRoom()) return;
    if (!(W.ChatRoomCharacter || []).some(c => c.MemberNumber !== BOTMN() && isSubject(c.MemberNumber))) return;
    D.told = true; saveLedger();
    announce("🎯 Today's trap of the day is the "+TRAP_KINDS[k].icon+" "+k+": "+TRAP_KINDS[k].what+". It's twice as likely to be the one that gets you today, and the first time it does, there's a ribbon in it.");
    syncCompanions(true);
  }

  // ── what their Companion shows ──────────────────────────
  function rateStateFor(mn, s){
    const r = rec(mn); if (!r) return;
    const a = r.rateAsk;
    if (a && a.until > Date.now() && TRAP_KINDS[a.kind] && !r.rateAskOff) s.rateTrap = { kind: a.kind, icon: TRAP_KINDS[a.kind].icon, until: Math.ceil(a.until/60000)*60000, was: lastRate(r, a.kind) || "" };
    if (s.trapCard){
      const k = trapOfDay(); if (k) s.trapCard.today = { kind: k, icon: TRAP_KINDS[k].icon, what: TRAP_KINDS[k].what, paid: r.trapDayPaid === dayKey() };
      const n = { loved: 0, fine: 0, no: 0 };
      for (const h of Object.values(r.trapRate || {})) if (h && h.length) n[h[h.length - 1]]++;
      s.trapCard.rated = n; s.trapCard.rateAsk = !r.rateAskOff;
    }
    if (s.trapAdmin){
      const T = trapRatesLedger(), rows = Object.entries(T).filter(([k]) => TRAP_KINDS[k]);
      const top = (key) => rows.filter(([, t]) => t[key] > 0).sort((a, b) => b[1][key] - a[1][key]).slice(0, 3).map(([k, t]) => ({ kind: k, icon: TRAP_KINDS[k].icon, n: t[key] }));
      s.trapAdmin.ratings = { loved: top("loved"), no: top("no") };
      const k = trapOfDay(); if (k) s.trapAdmin.today = { kind: k, icon: TRAP_KINDS[k].icon };
    }
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __trapRateX: (m, k) => trapRateX(m, k), __trapOfDay: () => trapOfDay(), __trapDayPool: () => trapDayPool(),
    __trapDayTick: () => { state.trapDayAt = 0; trapDayTick(); }, __rateWord: (t) => rateWord(t), __trapEnded: (m, k, b) => trapEnded(m, k, b || {}) });
