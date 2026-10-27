  /* WHAT'S IN THIS FILE (07b-companion-sync.js)
     What the Companion panel is told about you: roles, keys, switches, milk, body, gear, plus the staff
     data (herd, zones, tease lines, voice, shift). Sent only when it changes.
  */
  /* ── Companion sync: the panel's picture of you, kept fresh ──
     Every Companion in the room gets a `state` snapshot: roles, keys, switches and numbers.
     I only send it again when somethin' in it changed. */
  // ledger field → the command that flips it
  const SWITCH_CMDS = { breedable:"breedable", fertile:"fertile", jarok:"jarok", freeuse:"freeuse", futa:"futa",
                        milkable:"milkable", seedMilk:"seedmilk", naturalHeat:"naturalheat", praiseMe:"praise", degradeMe:"degrade",
                        tally:"tally", forced:"forced", hypno:"hypno", potionsOn:"potions", daresOn:"dares", benchOn:"bench", mpreg:"mpreg", watersports:"watersports", parasiteOn:"parasite", symbioteOn:"symbiote", trapEager:"eager", trapsOn:"traps", ownOutfit:"ownoutfit", teaseMe:"teaseme" };
  // staff lookups about somebody else go to the Companion's Office tab
  const DOC_CMDS = ["record","stats","vet","quota","keys","size","measure","pedigree"];

  // amounts as the panel shows them (0.1 L steps from a litre up, 50 mL below): milk fillin' a few mL every
  // tick doesn't send a new panel each time, only when the number they see would change
  function shownMl(n){ n = Number(n) || 0; return n >= 1000 ? Math.round(n/100)*100 : Math.round(n/50)*50; }
  // a part of somebody's panel that broke: in the log once every ten minutes, not every sync
  function stateWarn(mn, name, e){
    state.stateWarned = state.stateWarned || new Map();
    const k = mn+":"+name; if (Date.now() - (state.stateWarned.get(k) || 0) < 600000) return;
    state.stateWarned.set(k, Date.now()); warn("panel state ("+name+") for "+mn+":", e);
  }
  function stateFor(mn){
    // proprietors named in CFG.PROPRIETORS are staff even if their record lists no roles (or they have no record yet)
    const staff = isStaff(mn);
    const r = rec(mn, staff);
    if (r && !r.roles) r.roles = [];
    const base = { name: plainName(mn), onBooks: !!(r && (r.roles.length || staff)) };
    if (!base.onBooks) return base;
    const s = Object.assign(base, {
      roles: r.roles.slice(), tier: tierOf(mn) || "", species: r.species || "", gender: r.gender || "",
      staff: isStaff(mn), herdmaster: isHerdmaster(mn), proprietor: isProprietor(mn), mandated: isMandated(mn),
      onDuty: r.onDuty !== false, onCall: isStaff(mn) && (isMandated(mn) || !!r.forced),
      pastureLock: r.pastureLock ? plainName(r.pastureLock.by) : null,
      keys: keysOf(mn), herdLeader: herdLeaderOf(mn) ? plainName(herdLeaderOf(mn)) : null,
      switches: {}
    });
    for (const k in SWITCH_CMDS) s.switches[SWITCH_CMDS[k]] =
      k === "jarok" ? r.jarok !== false : k === "trapsOn" ? isSubject(mn) : k === "teaseMe" ? !!teaseRate(r) : k === "milkable" ? makesMilk(mn) : k === "seedMilk" ? r.seedMilk !== false : !!r[k];
    try {
      const p = prodOf(mn), now = Date.now();
      // milk rounds to 10 mL so a slowly fillin' udder doesn't resend every minute
      if (makesMilk(mn)) s.milk = { ml: shownMl(p.milk), cap: Math.round(milkCap(mn)), grade: milkGrade(mn), lastAt: p.lastMilkAt || 0 };
      if (p.stall && p.stall.until) s.stallUntil = Math.ceil(p.stall.until / 60000) * 60000;   // milkin' stall timer (to the minute)
      if (makesSemen(mn)) s.semen = { ml: Math.round(p.semen), cap: Math.round(semenCap(mn)) };
      s.holding = { ml: shownMl(heldTotal(p)), cap: Math.round(capacity(mn)) };
      s.body = bodyParts(mn).filter(k => CFG.SIZES[k]).map(k => ({ part: k, label: CFG.SIZES[k].label, size: sizeName(mn, k) }));
      // for the drawn body (extension/src/drawnbody.js): their cup as the farm counts it (1 AA ... 20 R, 0 none) and how
      // big their belly is (0 to 4: pregnant, eggs, a full load). Laynie, Oct 14: "the belly sizes in game need to
      // automatically adjust based on how full or pregnant each player is", "same for tit sizes and growth".
      s.drawn = { cup: bodyParts(mn).includes("udder") ? udderLevel(mn) : 0, belly: bellyStage(mn) };
      if (inHeat(p)) s.heatUntil = p.heat.until;
      if (p.preg) s.preg = { due: p.preg.due, sires: p.preg.sires.map(plainName) };
      if (quotaOf(mn)) s.quota = { ml: Math.round(milkedOn(mn, dayKey())), goal: Math.round(quotaOf(mn)), streak: r.quotaStreak || 0 };
      const g = gearOf(mn);   // the milkin' gear they're in right now
      if (g.milk || g.machine || g.funnel) s.gear = { milk: g.milk || null, machine: g.machine || null, funnel: !!g.funnel };
      s.today = { tally: tallyToday(mn), naughty: r.naughtyMarks || 0, praised: r.praised || 0, degraded: r.degraded || 0 };
      // ribbons, the store, potions, a dare (the 🎀 Store tab)
      s.ribbons = r.ribbons || 0; s.quotaGrace = r.quotaGrace || 0; s.messesOn = !!r.messesOn;
      try { chatlogState(mn, s); } catch(e){ warn("record state:", e); }   // recorded always? reads the record? (10z9-chatlog.js)
      s.ribbonLog = (L.ribbonLog || []).filter(e => e.mn === mn).slice(-6).reverse().map(e => ({ n: e.n, why: e.why }));
      s.store = storeItems().filter(it => !it.off).map(it => ({ id: it.potion || it.id, name: it.name, price: it.price, desc: it.desc, gift: !!it.gift, kind: it.kind || "", shelf: it.shelf || "" }));
      s.fx = activePotions(mn).map(f => ({ id: f.id, name: (potionDef(f.id) || {}).name || f.id, until: Math.ceil(f.until/60000)*60000 }));
      if (r.dare) s.dare = { text: r.dare.text, until: r.dare.until, reckless: !!r.dare.reckless };
      if (r.penned) s.penned = { until: r.penned.until, at: r.penned.name };
      // each of these stands alone: if one breaks for somebody, the rest of their panel still arrives, and the panel says which (Oct 11)
      const part = (name, fn) => { try { fn(); } catch(e){ s.stateErr = (s.stateErr ? s.stateErr+" · " : "")+name+": "+String(e && e.message || e).slice(0, 80); stateWarn(mn, name, e); } };
      part("right now", () => { s.now = rightNow(mn); });                 // the "right now" strip (10p-lookout.js)
      part("slow", () => { const sl = slowOf(mn); if (sl >= 1.2) s.slow = sl; });   // how much slower they walk for what they're carryin' (10u-traps.js)
      if (p.deniedUntil > now) s.deniedUntil = Math.ceil(p.deniedUntil / 60000) * 60000;     // held at the edge, if their Companion's set to
      if (p.eggs) s.eggs = { n: p.eggs.n, layAt: p.eggs.layAt };
      part("parasite", () => { if (parasiteOn(mn)) s.parasite = { until: r.parasite.until, form: r.parasite.form || "lips" }; });
      part("symbiote", () => { if (symOn(mn)){ const g = r.symbiote; s.symbiote = { kind: g.kind, name: SYMBIOTES[g.kind].name, stage: g.stage, of: SYMBIOTES[g.kind].stages, until: g.until, hungry: Date.now() - g.fedAt > CFG.SYM.HUNGRY_MIN*60000 }; } });
      part("trap card", () => { const tc = trapCardFor(mn); if (tc) s.trapCard = tc; });   // the trap card (10x-trap-extras.js)
      part("farm gear", () => { const fg = farmGearFor(mn); if (fg.length) s.farmGear = fg; });   // real gear their Companion keeps on them (10y-farm-gear.js)
      part("trap admin", () => { if (isProprietor(mn)) s.trapAdmin = trapAdminFor(); });
      part("trap ratings", () => rateStateFor(mn, s));   // how was it, the trap of the day (10y9o-trap-ratings.js)
      part("trap kinds", () => trapThemeStateFor(mn, s));   // whole kinds of trap switched off (10y9q-trap-switches.js)
      part("seasons", () => seasonsStateFor(mn, s));        // proprietors: the Seasons card, any season any time (10y9m-seasons.js)
      part("under", () => { const u = underOf(mn); if (u >= 2) s.under = u; if (r.corrWord) s.corrWord = r.corrWord; if (r.corrNoise) s.corrNoise = r.corrNoise; });   // simpler words, and the word that slips out (10y4-corruption.js)
      part("keepsakes", () => keepersStateFor(mn, s));
      part("udders", () => uddersStateFor(mn, s));   // the dial, their words, intensity, kept (10y7-udders.js)   // the album, trained holes, the vat, sittin' the nest (10y6-keepers.js)
      part("roam", () => { const x = roamState(mn); if (x) s.roam = x; });   // roam passes (10uk-roam.js)
      part("wants", () => { const w = wantsFor(mn); if (w.length) s.wants = w; });   // what the farm is waitin' to hear from them: Say it buttons (10ui-say.js)
      part("happening", () => { const hp = happeningFor(mn); if (hp.length) s.happening = hp; if (quietNow(mn)) s.quietUntil = Math.ceil(r.quietUntil / 60000) * 60000; });   // what has them right now (10y2-brood.js)
      const bh = benchHereFor(mn); if (bh.length) s.benchHere = bh;   // tap-to-use bench buttons
      s.at = now;
      if (isStaff(mn)) Object.assign(s, staffStateFor(mn));
      const mods = addonStateFor(mn); if (mods) s.mods = mods;
      const ac = addonCommandGroups(mn); if (ac.length) s.addonCmds = ac;   // the Guides tab lists these too   // add-on cards for the "Farm extras" tab
      if (isProprietor(mn)){   // the Dashboard's outfit slots (no outfit data, just what's there)
        outfitsLedger();
        s.outfits = {}; for (const [k, o] of Object.entries(L.outfits)) s.outfits[k] = { items: o.items, locks: o.locks, at: o.at };
        s.outfitRules = Object.assign({}, L.outfitRules);
        // the suggestion box, newest first (the Dashboard's Suggestions tab; 10q-feedback.js)
        s.feedback = fbLedger().slice(-60).reverse().map(f => ({ id: f.id, t: f.t, name: f.name, mn: f.mn, kind: f.kind, text: f.text, why: f.why || "", status: f.status, note: f.note || "" }));
      }
    } catch(e){ s.stateErr = (s.stateErr ? s.stateErr+" · " : "")+"panel: "+String(e && e.message || e).slice(0, 80); stateWarn(mn, "panel", e); }
    return s;
  }

  // what the Staff panel's Herd, Shift, Zones, Tease lines and Voice tabs show
  function staffStateFor(mn){
    const out = {}, here = (W.ChatRoomCharacter||[]).map(c => c.MemberNumber).filter(m => m !== CFG.BOT_MEMBER && rec(m) && rec(m).roles.length);
    out.herd = here.slice(0, 40).map(m => {
      const r = rec(m), p = prodOf(m);
      return { mn: m, name: plainName(m), role: (r.roles[0]||"").toLowerCase(), where: whereName(m) || "",
               milk: makesMilk(m) ? Math.round(100*p.milk/Math.max(1, milkCap(m))) : null, heat: inHeat(p) && !p.heat.quiet, preg: !!p.preg,
               denied: milkDenied(m), mine: herdLeaderOf(m) === mn, onDuty: r.onDuty !== false };
    });
    const r = rec(mn), wk = weekKey(), week = (r.shift && r.shift.week && r.shift.week.key === wk) ? r.shift.week.ms : 0;
    out.shift = { clocked: clockedIn(mn), weekH: Math.round(10*(week + (clockedIn(mn) ? Date.now() - r.shift.in : 0))/3600000)/10,
                  onDuty: here.filter(m => isStaff(m) && onDuty(m)).map(plainName),
                  onCall: forcedStaff().map(m => ({ name: plainName(m), mandated: isMandated(m), here: !!charFor(m) })) };
    // the farm map: every staff member sees it; only herdmasters and proprietors change it (the bot checks too)
    zonesLedger();
    out.zones = L.zones; out.spots = L.spots || {};   // name → {X,Y}, drawn on the Zones map
    out.mapEdit = isHerdmaster(mn);
    if (isHerdmaster(mn)){
      // (the tease lines: retired Oct 19)
      out.log = (L.log || []).slice(-10).reverse().map(e => ({ t: e.t, a: e.a, by: plainName(e.by), d: String(e.d||"").slice(0, 40) }));
    }
    if (canHoldHerd(mn)){
      voiceLedger();
      const members = Object.keys(L.people).map(Number).filter(m => herdLeaderOf(m) === mn);
      out.voice = { herd: L.voice.herd[mn] || { on:false, lines:[], every:"15" },
                    members: members.slice(0, 40).map(m => Object.assign({ mn: m, name: plainName(m), hypno: !!rec(m).hypno }, L.voice.member[m] || { on:false, lines:[], every:"15" })) };
    }
    // the Queue tab: applications waitin', and how the bot's messages are doin'
    out.apps = (L.applications || []).slice(0, 30).map((a, i) => ({ n: i + 1, mn: a.mn, name: a.name, at: a.at, staffTrack: !!a.staffTrack,
      sum: ["role","species","gender","stay","depth"].map(k => appAnswer(a, k) || "?").join(" · ") }));
    out.mail = { sending: state.queue.length + state.urgent.length, held: Object.keys(L.mailbox || {}).length,
                 beepable: state.mutual ? state.mutual.set.size : null };
    return out;
  }

  // send each connected Companion its state, if it changed since last time (force: send anyway)
  // LAG (Laynie, Oct 26: "Is there more that we can do to improve the companion and the lag situation?"): a "forced" sync
  // used to send EVERY Companion its whole panel again, changed or not, and about 80 things force one (a trap, gear, a
  // potion…): one person's trap meant a full panel to everybody in the room, through the bot's one send queue, so the
  // bot's own replies waited behind them. Now a burst of syncs in the same moment is gathered into one, and a panel goes
  // only to the Companions whose panel actually changed.
  function syncCompanions(){
    if (state.syncPending) return;
    state.syncPending = true;
    later(() => { state.syncPending = false; syncNow(); }, 250);
  }
  // the store's shelf was 11 KB of every 13 KB panel: a Companion 0.45+ gets it on its own, only when it changes
  const storeApart = (c) => { const m = /^(\d+)\.(\d+)\./.exec(String((c && c.ver) || "")); return !!m && (+m[1] > 0 || +m[2] >= 45); };
  // a short fingerprint of the shelf: a Companion 0.46+ keeps the store it was sent (even over a reload) and says which
  // one in its hello, so the 11 KB only goes again when a price or an item really changed
  function shelfHash(text){
    let h = 2166136261;
    for (let i = 0; i < text.length; i++){ h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(36)+"."+text.length.toString(36);
  }
  function syncNow(){
    for (const [mn, c] of state.companions){
      if (!hasCompanion(mn)) continue;
      let s; try { s = stateFor(mn); } catch(e){ warn("state for "+mn+":", e); continue; }   // one bad record never stalls everyone's panel
      if (storeApart(c) && s.store){
        const sk = JSON.stringify(s.store), h = shelfHash(sk); delete s.store;
        if (c.lastStoreH !== h){ c.lastStoreH = h; enqueue(makeMsg("store", { items: JSON.parse(sk), h }, mn)); }
      }
      const key = JSON.stringify(Object.assign({}, s, { at: 0 }));
      if (c.lastState === key) continue;
      // every panel I send gets a number; a patch says which panel it goes on (base), so a Companion that missed one asks
      // for a whole panel instead of patchin' the wrong one
      const seq = ++state.syncSeq;
      // a 0.45+ Companion that has a panel already gets only the parts that changed
      if (storeApart(c) && c.lastParts){
        const set = {}, del = [], parts = {};
        for (const k of Object.keys(s)){ const v = JSON.stringify(s[k]); parts[k] = v; if (k !== "at" && c.lastParts[k] !== v) set[k] = s[k]; }
        for (const k of Object.keys(c.lastParts)) if (!(k in s)) del.push(k);
        c.lastState = key; c.lastParts = parts;
        enqueue(makeMsg("stateDiff", { set, del, base: c.seq || 0, seq }, mn));
        c.seq = seq;
        continue;
      }
      c.lastState = key;
      if (storeApart(c)){ c.lastParts = {}; for (const k of Object.keys(s)) c.lastParts[k] = JSON.stringify(s[k]); }
      enqueue(makeMsg("state", { state: s, seq }, mn));
      c.seq = seq;
    }
  }

  // a yes/no question: buttons in the Companion, a plain message for everybody else
  function askCard(mn, kind, text){
    if (hasCompanion(mn)){
      enqueue(makeMsg("ask", { kind, text, id: ++companionSeq }, mn));
      // a question can't wait for them to open the panel: a short beep points them at it
      if (canBeep(mn)) send("AccountBeep", { MemberNumber:mn, BeepType:"", Message:"❓ A yes/no question is waitin' in your 🌾 panel: "+String(text).slice(0, 160) });
    }
    else tell(mn, text);
  }

