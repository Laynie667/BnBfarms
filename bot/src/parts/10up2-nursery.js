  /* WHAT'S IN THIS FILE (10up2-nursery.js)
     THE NURSERY (Laynie, Oct 29: "I have several users that are into abdl - i would like to have a 'safe list' I can add
     them to, and once added, they would get a new panel with abdl geared activities, traps, games, and cuddling or cute
     little space oriented lines, clean up, encouragement, praise... none of the messages should display in normal chat,
     only for those on the list as caregivers or littles").
     • THE LIST. Proprietors add caregivers and littles (?nursery add <who> little|caregiver); caregivers can invite
       littles. Whoever's invited gets a Yes / Not now card first. ?nursery leave takes yourself off; proprietors can
       ?nursery remove anybody. A caregiver who invites a little is paired with them; ?nursery pair <little> asks to pair
       later. Littlish Club's own mommy and caregivers count as a hint: if both are on the list, they're paired.
     • PRIVATE. Every nursery line goes only to people on the list who are in the room, as a line in their own chat.
       Nobody else ever sees it, and to everybody else the commands don't exist.
     • LITTLE SPACE (?little on|off). While a little's in it, the farm's grown-up machinery leaves them be: quietNow()
       is true for them (traps, urges, teasin', scents…) and limitBlocks() is true for everything (breedin', milkin',
       eggs, the glory stalls, add-ons that ask). Grown-up commands aimed at them are turned away (10up2: nurseryGate),
       and their own grown-up commands too, till they switch it off. It can't start while somethin' grown-up holds them.
     • PLAY. ?little <activity>, ?little game <name> [pick], ?little ask <cuddle|change|story…>, and caregivers'
       ?care <action> <little>. Gentle traps spring on spots named nursery-<kind> (?spot set nursery-ballpit).
     • STARS. Small: a gold star is a ribbon, CFG.NURSERY.STARS_DAY a day for a little, CARE_DAY for a caregiver.
     • WET (the ABCL mod, from the little's own Companion): soggy padding gets teased, kindly, at three levels; a
       caregiver's ?care change resets it on their own screen. Never the messy kind. The farm's sweet, muddy and slimy
       messes get noticed too; the grown-up ones are never named, and bath time washes everything off.
  */
  CFG.NURSERY = CFG.NURSERY || { STARS_DAY: 3, CARE_DAY: 2, STAR_CHANCE: 0.35, BEAT_S: 12, TRAP_MIN: 10, MESS_MIN: 20, OK_H: 2 };
  const NURSERY_CMDS = ["nursery", "little", "care"];
  const nrec = (mn) => { const r = rec(mn); return r && r.nursery && r.nursery.role ? r.nursery : null; };
  const nurseryOn = (mn) => !!nrec(mn);
  const isLittle = (mn) => (nrec(mn) || {}).role === "little";
  const isCarer = (mn) => (nrec(mn) || {}).role === "caregiver";
  function littleNow(mn){ const n = nrec(mn); return !!(n && n.role === "little" && n.space); }
  const nName = (mn) => plainName(mn);
  const nFill = (t, v) => String(t).replace(/%n/g, v.n ? nName(v.n) : "").replace(/%c/g, v.c ? nName(v.c) : "a grown-up").replace(/%s/g, v.s || "stuffie").replace(/%m/g, v.m || "").replace(/%x/g, v.x || "").replace(/%y/g, v.y || "");
  const nPick = (key, pool) => pickFresh("nursery:" + key, pool);
  // everybody on the list who's in the room: the only people who ever see a nursery line
  function nurseryHere(){ return (W.ChatRoomCharacter || []).map(c => c.MemberNumber).filter(m => m !== CFG.BOT_MEMBER && nurseryOn(m)); }
  function nurserySay(about, text){
    const to = new Set(nurseryHere()); if (about) to.add(about);
    for (const m of to) if (charFor(m) || m === about) privateLine(m, text, "emote");
  }
  function nurseryTell(mn, text){ privateLine(mn, text, "chat"); }
  // a little's grown-ups who are here (their paired ones first, then any caregiver)
  function carersHere(little){ const n = nrec(little) || {}, here = nurseryHere().filter(isCarer); const mine = here.filter(m => (n.carers || []).includes(m)); return mine.length ? mine : here; }
  // stars: a ribbon each, a few a day
  function nurseryStar(mn, why){
    const n = nrec(mn); if (!n) return;
    const d = dayKey(); if (!n.stars || n.stars.d !== d) n.stars = { d, n: 0 };
    const cap = n.role === "caregiver" ? CFG.NURSERY.CARE_DAY : CFG.NURSERY.STARS_DAY;
    if (n.stars.n >= cap) return;
    const got = earnRibbons(mn, 1, why, 0, true); if (!got) return;
    n.stars.n += got; saveLedger();
    if (n.role === "little") nurserySay(mn, nFill(nPick("star", NURSERY_LINES.star), { n: mn }));
    nurseryTell(mn, "🎀 +1 ribbon for " + why + " (" + n.stars.n + " of " + cap + " today).");
  }
  // a little scene, a beat at a time, to the nursery only
  function nurseryScene(mn, beats, icon, done){
    state.nurseryRuns = state.nurseryRuns || new Map();
    if (state.nurseryRuns.get(mn) > Date.now()) return false;
    state.nurseryRuns.set(mn, Date.now() + beats.length * CFG.NURSERY.BEAT_S * 1000 + 3000);
    beats.forEach((b, i) => later(() => {
      if (!charFor(mn)) return;
      nurserySay(mn, icon + " " + b);
      if (i === beats.length - 1){ state.nurseryRuns.delete(mn); if (done) try { done(); } catch(e){ warn("nursery:", e); } }
    }, i * CFG.NURSERY.BEAT_S * 1000));
    return true;
  }
  // what grown-up thing still has them (little space waits for it)
  function grownUpHold(mn){
    const r = rec(mn) || {}, p = prodOf(mn) || {};
    if (heldByTrap(mn)) return "a trap"; if (benchedNow(mn)) return "the bench"; if (stockedNow(mn)) return "the stocks";
    if (r.penned) return "the pen"; if (parasiteOn(mn)) return "a parasite"; if (symOn(mn)) return "a symbiote";
    if (p.stall) return "a milkin' stall"; if (p.tieUntil > Date.now()) return "a knot";
    return null;
  }
  // the farm's messes a little's wearin', in the nursery's words (only the sweet, muddy and slimy ones)
  const NURSERY_MESS = ["cake", "cream", "honey", "maple", "chocolate", "strawberry", "mud", "slime"];
  function nurseryMesses(mn){
    const m = (rec(mn) || {}).messKinds || {}, now = Date.now();
    return NURSERY_MESS.filter(k => m[k] > now - 3*3600000);
  }
  // the wet level from their ABCL stats: 0 dry · 1 damp · 2 soggy · 3 leaking
  function wetLevel(n){ const w = n && n.wet; if (!w || !w.diaper) return 0; return w.leak || w.pct >= 1 ? 3 : w.pct >= 0.6 ? 2 : w.pct >= 0.25 ? 1 : 0; }

  // ── the Companion tells us about a little's padding (ABCL) and their Littlish Club grown-ups ──
  function nurseryStats(mn, m){
    const n = nrec(mn); if (!n || n.role !== "little") return;
    if (m.abcl){
      const pct = Math.max(0, Math.min(2, Number(m.wet) || 0)), was = wetLevel(n);
      n.wet = { pct, diaper: !!m.diaper, leak: !!m.leak, at: Date.now(), told: (n.wet || {}).told || 0 };
      const lvl = wetLevel(n);
      if (lvl < 1) n.wet.told = 0;
      else if (lvl > (n.wet.told || 0) && lvl > was && n.space && charFor(mn)){ n.wet.told = lvl; nurserySay(mn, "🧷 " + nFill(nPick("wet" + lvl, NURSERY_LINES["wet" + lvl]), { n: mn })); }
    }
    // Littlish Club: their mommy and caregivers, if they're on our list as caregivers, are paired with them
    const lc = [].concat(m.mommy ? [Number(m.mommy)] : [], Array.isArray(m.carers) ? m.carers.map(Number) : []).filter(x => Number.isInteger(x) && x > 0);
    n.lc = lc.slice(0, 12);
    for (const c of n.lc) if (isCarer(c) && !(n.carers || []).includes(c)){
      n.carers = (n.carers || []).concat(c); audit(mn, "NURSERY", "paired with " + c + " (Littlish Club)");
      nurseryTell(mn, "🧸 " + nName(c) + " is one of your Littlish Club grown-ups, so they're your nursery grown-up here too.");
      if (charFor(c)) nurseryTell(c, "🧸 You're " + nName(mn) + "'s grown-up in Littlish Club, so you're paired in the farm's nursery too.");
    }
    saveLedger(); syncCompanions();
  }

  // ── the tick: nursery spots, and messes worth a word ──
  function nurseryTick(){
    const now = Date.now();
    if (now - (state.nurseryAt || 0) < 4000) return; state.nurseryAt = now;
    for (const mn of nurseryHere()){
      if (!littleNow(mn)) continue;
      const n = nrec(mn);
      // a nursery spot underfoot
      if (n.traps !== false && !(state.nurseryRuns && state.nurseryRuns.get(mn) > now)){
        const spot = Object.keys(L.spots || {}).find(s => /^nursery-/.test(s) && onSpot(mn, s, 0));
        if (spot){
          const kind = spot.replace(/^nursery-/, "").replace(/-\d+$/, ""), pool = NURSERY_LINES.trap[kind] || NURSERY_LINES.trap.generic;
          n.trapAt = n.trapAt || {};
          if (now - (n.trapAt[kind] || 0) > CFG.NURSERY.TRAP_MIN*60000){
            n.trapAt[kind] = now; saveLedger();
            const beats = pool[Math.floor(Math.random() * pool.length)].map(t => nFill(t, { n: mn }));
            nurseryScene(mn, beats, "🧸", () => { if (Math.random() < CFG.NURSERY.STAR_CHANCE) nurseryStar(mn, "playin' in the nursery"); });
            continue;
          }
        }
      }
      // messes: a word now and then
      const ms = nurseryMesses(mn).filter(k => now - ((n.messTold || {})[k] || 0) > CFG.NURSERY.MESS_MIN*60000);
      if (ms.length && Math.random() < 0.08){
        const k = ms[Math.floor(Math.random() * ms.length)];
        n.messTold = n.messTold || {}; n.messTold[k] = now; saveLedger();
        nurserySay(mn, "🧁 " + nFill(nPick("mess:" + k, NURSERY_LINES.mess[k]), { n: mn }));
      }
    }
  }

  // ── grown-up commands and littles (15-commands.js asks before runnin' anything) ──
  const GROWN_UP_CMDS = ["milk","collect","drain","edge","denial","ruin","inseminate","breed","cum","use","bench","inspect","dose","send","whistle","brand","heat",
    "stocks","walk","freeuse","breedable","fertile","milkable","seedmilk","parasite","symbiote","traps","trap","eager","potion","potions","dare","dares","outfitwheel",
    "wheel","spin","purge","coax","lend","bid","gauntlet","mysterybox","suit","keep","vat","sit","herdtraps","goad","hunt","lay","gather","pack","cleanse","corruption"];
  const SAFE_BUYS = /\b(cake|honey|maple|choc\w*|strawberr\w*|berry|slime|mud)\b/i;
  function nurseryGate(sender, cmd, args){
    try {
      if (!GROWN_UP_CMDS.includes(cmd) && cmd !== "buy" && cmd !== "gift") return null;
      // their own grown-up commands wait till they're out of little space (switches can still go OFF)
      if (littleNow(sender) && GROWN_UP_CMDS.includes(cmd) && !/^(off|no|stop)$/i.test(String(args[0] || ""))) return NURSERY_LINES.blockedSelf;
      // aimed at somebody who's little right now
      for (const a of args){
        let t = null; try { t = resolveTarget(String(a)); state.ambiguous = null; } catch(e){ t = null; }
        if (!t || t === sender || !littleNow(t)) continue;
        if ((cmd === "buy" || cmd === "gift") && SAFE_BUYS.test(args.join(" "))) return null;   // a cake smash is fine
        return nFill(NURSERY_LINES.blockedOther, { n: t });
      }
    } catch(e){ warn("nursery gate:", e); }
    return null;
  }

  // ── the commands ──
  function nurseryHidden(sender){ return !nurseryOn(sender) && !isProprietor(sender); }
  function nurseryCommand(cmd, sender, args, R, huh){
    if (nurseryHidden(sender)){ huh("I don't know ?" + cmd + ", hon. ?help lists what I can do."); return; }
    if (cmd === "nursery") return nurseryAdmin(sender, args, R);
    if (cmd === "little") return littleCommand(sender, args, R);
    if (cmd === "care") return careCommand(sender, args, R);
  }
  function nurseryHelp(sender){
    const n = nrec(sender) || {};
    const lines = ["🧸 THE NURSERY" + (n.role ? " · you're a " + n.role : "") + "\nOnly nursery folk ever see what happens here."];
    if (n.role === "little") lines.push("?little on / ?little off · your little space (the farm's grown-up things leave you be while it's on)\n?little <activity> · " + Object.keys(NURSERY_LINES.play).join(", ") + "\n?little game rps|guess|dice|crayon|peekaboo|catch [pick]\n?little ask cuddle|change|story|snack|play|nap|bath|bottle|help\n?nursery traps on|off · the nursery's gentle traps");
    if (n.role === "caregiver") lines.push("?care <action> <little> · " + Object.keys(NURSERY_LINES.care).join(", ") + "\n?nursery add <who> little · invite a little (they say yes first)\n?nursery pair <little> · ask to be their grown-up · ?nursery unpair <who>");
    if (isProprietor(sender)) lines.push("Proprietors: ?nursery add <who> little|caregiver · ?nursery remove <who> · ?nursery list");
    lines.push("?nursery leave · take yourself off the list. Your safeword works here like everywhere.");
    return lines.join("\n\n");
  }
  function nurseryInvite(by, t, role, R){
    if (!t || !rec(t) || !(rec(t).roles || []).length){ R("Who, sweetpea? They need to be on the farm's books."); return; }
    if (nurseryOn(t) && nrec(t).role === role){ R(nName(t) + " is already in the nursery as a " + role + "."); return; }
    addonAsks.set(t, { addon: null, at: Date.now(), cb: (yes) => {
      if (!yes){ tell(by, "🧸 " + nName(t) + " said not now. That's okay."); return; }
      const r = rec(t); r.nursery = { role, by, at: Date.now(), space: false, traps: true, carers: role === "little" && isCarer(by) ? [by] : [] };
      saveLedger(); audit(by, "NURSERY", "add " + t + " " + role); syncCompanions(true);
      tell(by, "🧸 " + nName(t) + " is in the nursery now, as a " + role + ".");
      tell(t, "🧸 Welcome to the nursery, " + nName(t) + "! There's a 🧸 Nursery panel in your 🌾 Companion now. " + (role === "little" ? "Say ?little on whenever you want your little space." : "?nursery shows what you can do."));
    } });
    askCard(t, "nursery", "🧸 " + nName(by) + " would like to add you to the farm's nursery as a " + role + ". It's a soft, private space: only nursery folk see what happens there" +
      (role === "little" ? ", and while you're in your little space the farm's grown-up things leave you be" : "") + ". Yes or no? (?yes or ?no works too)");
    R("🧸 I've asked " + nName(t) + ". Once they say yes, they're in.");
  }
  function nurseryAdmin(sender, args, R){
    const a0 = String(args[0] || "").toLowerCase(), n = nrec(sender);
    if (!a0 || a0 === "help"){ R(nurseryHelp(sender)); return; }
    if (a0 === "add" || a0 === "invite"){
      const t = resolveTarget(args[1]), role = /^care/i.test(args[2] || "") ? "caregiver" : "little";
      if (!isProprietor(sender) && !(isCarer(sender) && role === "little")){ R("Only proprietors add caregivers, sweetpea. Caregivers can invite littles: ?nursery add <who> little."); return; }
      nurseryInvite(sender, t, role, R); return;
    }
    if (a0 === "remove"){
      if (!isProprietor(sender)){ R("Proprietors take folks off the list. You can take yourself off with ?nursery leave."); return; }
      const t = resolveTarget(args[1]); if (!t || !nurseryOn(t)){ R("They're not in the nursery."); return; }
      rec(t).nursery = null; for (const p of Object.values(L.people || {})) if (p && p.nursery && Array.isArray(p.nursery.carers)) p.nursery.carers = p.nursery.carers.filter(x => x !== t);
      saveLedger(); audit(sender, "NURSERY", "remove " + t); syncCompanions(true); R("🧸 " + nName(t) + " is off the nursery list."); return;
    }
    if (a0 === "leave"){
      if (!n){ R("You're not on the nursery list."); return; }
      rec(sender).nursery = null; for (const p of Object.values(L.people || {})) if (p && p.nursery && Array.isArray(p.nursery.carers)) p.nursery.carers = p.nursery.carers.filter(x => x !== sender);
      saveLedger(); audit(sender, "NURSERY", "left"); syncCompanions(true); R("🧸 You're off the nursery list. Come back any time."); return;
    }
    if (a0 === "list"){
      if (!isProprietor(sender) && !isCarer(sender)){ R(nurseryHelp(sender)); return; }
      const ppl = Object.values(L.people || {}).filter(p => p && p.nursery && p.nursery.role);
      if (!ppl.length){ R("🧸 Nobody's in the nursery yet."); return; }
      R("🧸 THE NURSERY\n" + ppl.map(p => "• " + (p.name || p.mn) + " · " + p.nursery.role + (p.nursery.role === "little" ? (p.nursery.space ? " · little now" : "") + ((p.nursery.carers || []).length ? " · grown-ups: " + p.nursery.carers.map(nName).join(", ") : "") : "")).join("\n")); return;
    }
    if (a0 === "pair"){
      if (!isCarer(sender)){ R("Only caregivers pair up with littles."); return; }
      const t = resolveTarget(args[1]); if (!t || !isLittle(t)){ R("Pair with which little, sweetpea?"); return; }
      if ((nrec(t).carers || []).includes(sender)){ R("You're already one of " + nName(t) + "'s grown-ups."); return; }
      addonAsks.set(t, { addon: null, at: Date.now(), cb: (yes) => {
        if (!yes){ tell(sender, "🧸 " + nName(t) + " said not now."); return; }
        const nt = nrec(t); if (!nt) return; nt.carers = (nt.carers || []).concat(sender); saveLedger(); syncCompanions(true);
        tell(sender, "🧸 You're one of " + nName(t) + "'s grown-ups now."); tell(t, "🧸 " + nName(sender) + " is one of your grown-ups now.");
      } });
      askCard(t, "nursery", "🧸 " + nName(sender) + " would like to be one of your nursery grown-ups. Yes or no?");
      R("🧸 I've asked " + nName(t) + "."); return;
    }
    if (a0 === "unpair"){
      const t = resolveTarget(args[1]); if (!t || !nurseryOn(t)){ R("Unpair from who?"); return; }
      const lit = isLittle(sender) ? sender : t, car = isLittle(sender) ? t : sender, nl = nrec(lit);
      if (!nl || !(nl.carers || []).includes(car)){ R("You two aren't paired."); return; }
      nl.carers = nl.carers.filter(x => x !== car); saveLedger(); syncCompanions(true); R("🧸 Unpaired."); return;
    }
    if (a0 === "traps"){
      if (!isLittle(sender)){ R("The nursery's traps are for littles."); return; }
      const on = !/^(off|no)$/i.test(args[1] || ""); n.traps = on; saveLedger(); syncCompanions(true);
      R("🧸 Nursery traps: " + (on ? "ON. Ball pits, bubbles and playpens might find you on the nursery's spots." : "off.")); return;
    }
    R(nurseryHelp(sender));
  }
  function littleCommand(sender, args, R){
    const n = nrec(sender), a0 = String(args[0] || "").toLowerCase();
    if (!n || n.role !== "little"){ R(nurseryHelp(sender)); return; }
    if (!a0){ R(nurseryHelp(sender)); return; }
    if (a0 === "on" || a0 === "off"){
      if (a0 === "on"){
        if (n.space){ R("🧸 You're already little, sweetpea."); return; }
        const hold = grownUpHold(sender); if (hold){ R(nFill(NURSERY_LINES.notYet, { x: hold })); return; }
        n.space = true; n.spaceAt = Date.now(); saveLedger(); audit(sender, "NURSERY", "little space on"); syncCompanions(true);
        if (charFor(sender)) nurserySay(sender, "🧸 " + nFill(nPick("spaceOn", NURSERY_LINES.spaceOn), { n: sender }));
        for (const c of carersHere(sender)) if (c !== sender) nurseryTell(c, "🧸 " + nName(sender) + " is in their little space now.");
        R("🧸 Little space: ON. The farm's grown-up things leave you be. ?little off when you're ready to grow back up.");
      } else {
        if (!n.space){ R("🧸 You're not in your little space right now."); return; }
        n.space = false; saveLedger(); audit(sender, "NURSERY", "little space off"); syncCompanions(true);
        if (charFor(sender)) nurserySay(sender, "🧸 " + nFill(nPick("spaceOff", NURSERY_LINES.spaceOff), { n: sender }));
        R("🧸 Little space: off. Back to farm business.");
      }
      return;
    }
    if (!n.space){ R("🧸 Go little first, sweetpea: ?little on."); return; }
    if (!charFor(sender)){ R("🧸 Come to the farm first, sweetpea."); return; }
    if (a0 === "game") return littleGame(sender, String(args[1] || "").toLowerCase(), String(args[2] || "").toLowerCase(), R);
    if (a0 === "ask"){
      const what = String(args[1] || "").toLowerCase(), line = NURSERY_LINES.ask[what];
      if (!line){ R("Ask for what, sweetpea? " + Object.keys(NURSERY_LINES.ask).join(", ") + "."); return; }
      const cs = carersHere(sender).filter(c => c !== sender);
      if (!cs.length){ R("🧸 There's no grown-up here right now, sweetpea. Ask again when one comes by."); return; }
      for (const c of cs) nurseryTell(c, nFill(line, { n: sender }) + "  (?care " + (what === "help" ? "cuddle" : what === "nap" ? "tuck" : what) + " " + nName(sender) + ")");
      R("🧸 You asked. " + cs.map(nName).join(" and ") + (cs.length > 1 ? " know" : " knows") + "."); return;
    }
    if (a0 === "bath"){ return bathTime(sender, null, R); }
    const beatsList = NURSERY_LINES.play[a0];
    if (!beatsList){ R("🧸 I don't know that one, sweetpea. Try: " + Object.keys(NURSERY_LINES.play).join(", ") + ", or bath."); return; }
    const beats = beatsList[Math.floor(Math.random() * beatsList.length)].map(t => nFill(t, { n: sender }));
    if (!nurseryScene(sender, beats, "🧸", () => { if (Math.random() < CFG.NURSERY.STAR_CHANCE) nurseryStar(sender, NURSERY_LINES.activityName[a0] || "playin'"); })){ R("🧸 One thing at a time, sweetpea."); return; }
    R("🧸 " + (NURSERY_LINES.activityName[a0] || a0).replace(/^./, c => c.toUpperCase()) + "!");
  }
  function littleGame(mn, game, pick, R){
    const G = NURSERY_LINES.game, rnd = (a) => a[Math.floor(Math.random() * a.length)];
    let line = null, won = false;
    if (game === "rps"){
      const opts = ["rock", "paper", "scissors"], x = opts.includes(pick) ? pick : rnd(opts), y = rnd(opts);
      const beats = { rock: "scissors", paper: "rock", scissors: "paper" };
      won = beats[x] === y; line = nFill(rnd(x === y ? G.rpsDraw : won ? G.rpsWin : G.rpsLose), { n: mn, x, y });
    } else if (game === "guess"){
      const x = pick === "left" || pick === "right" ? pick : rnd(["left", "right"]); won = Math.random() < 0.5;
      line = nFill(rnd(won ? G.guessWin : G.guessLose), { n: mn, x });
    } else if (game === "dice"){
      const x = 1 + Math.floor(Math.random() * 6), y = 1 + Math.floor(Math.random() * 6); won = x > y;
      line = nFill(rnd(x === y ? G.diceDraw : won ? G.diceWin : G.diceLose), { n: mn, x: String(x), y: String(y) });
    } else if (game === "crayon"){
      const cols = ["red", "blue", "green", "yellow"], x = cols.includes(pick) ? pick : rnd(cols), y = rnd(cols); won = x === y;
      line = nFill(rnd(won ? G.crayonWin : G.crayonLose), { n: mn, x, y });
    } else if (game === "peekaboo"){ won = true; line = nFill(rnd(G.peekaboo), { n: mn }); }
    else if (game === "catch"){ won = Math.random() < 0.6; line = nFill(rnd(won ? G.catchWin : G.catchLose), { n: mn }); }
    else { R("🎲 Which game, sweetpea? rps (rock, paper or scissors), guess (left or right), dice, crayon (red, blue, green or yellow), peekaboo, catch."); return; }
    state.nurseryGameAt = state.nurseryGameAt || new Map();
    if (Date.now() - (state.nurseryGameAt.get(mn) || 0) < 8000){ R("🎲 Slow down, sweetpea! One game at a time."); return; }
    state.nurseryGameAt.set(mn, Date.now());
    nurserySay(mn, "🎲 " + line);
    if (won && Math.random() < CFG.NURSERY.STAR_CHANCE) later(() => nurseryStar(mn, "winnin' a game"), 1500);
  }
  // bath time: everything comes off (the nursery never says what)
  function bathTime(little, carer, R){
    const C = NURSERY_LINES.care, v = { n: little, c: carer };
    const beats = [nFill(nPick("bath", C.bath), v), nFill(nPick("bathMid", C.bathMid), v), nFill(nPick("bathEnd", C.bathEnd), v)];
    if (!carer) [0, 1, 2].forEach(i => { beats[i] = nFill(nPick("selfBath" + i, NURSERY_LINES.selfBath[i]), v); });
    if (!nurseryScene(little, beats, "🛁", () => { washNow(little); if (carer) nurseryStar(carer, "lookin' after a little"); })){ R("🛁 One thing at a time, sweetpea."); return; }
    R("🛁 Bath time!");
  }
  function careCommand(sender, args, R){
    if (!isCarer(sender)){ R(nurseryHelp(sender)); return; }
    const what = String(args[0] || "").toLowerCase(), t = resolveTarget(args[1]);
    if (!NURSERY_LINES.care[what] || ["bathMid", "bathEnd"].includes(what)){ R("🧸 ?care <action> <little>. Actions: " + Object.keys(NURSERY_LINES.care).filter(k => !/^bath(Mid|End)$/.test(k)).join(", ") + "."); return; }
    if (!t || !isLittle(t)){ R("🧸 Which little, sweetpea? ?care " + what + " <little>."); return; }
    if (!charFor(t) || !charFor(sender)){ R("🧸 You both need to be at the farm."); return; }
    if (!littleNow(t)){ R("🧸 " + nName(t) + " isn't in their little space right now."); return; }
    const n = nrec(t), paired = (n.carers || []).includes(sender);
    state.nurseOk = state.nurseOk || new Map();
    const okUntil = state.nurseOk.get(t + ":" + sender) || 0;
    if (!paired && okUntil < Date.now()){
      addonAsks.set(t, { addon: null, at: Date.now(), cb: (yes) => {
        if (!yes){ tell(sender, "🧸 " + nName(t) + " said not now."); return; }
        state.nurseOk.set(t + ":" + sender, Date.now() + CFG.NURSERY.OK_H*3600000); careDo(sender, t, what, R);
      } });
      askCard(t, "nursery", "🧸 " + nName(sender) + " would like to look after you (" + what + "). Yes or no?");
      R("🧸 You're not " + nName(t) + "'s grown-up yet, so I've asked them first."); return;
    }
    careDo(sender, t, what, R);
  }
  function careDo(c, t, what, R){
    const C = NURSERY_LINES.care, n = nrec(t), v = { n: t, c };
    if (what === "bath") return bathTime(t, c, R);
    if (what === "stuffie"){
      const kinds = Object.entries(NURSERY_GEAR).filter(([, g]) => g.kind === "stuffie"), [id, g] = kinds[Math.floor(Math.random() * kinds.length)];
      v.s = g.label;
      nurserySay(t, "🧸 " + nFill(nPick("care:stuffie", C.stuffie), v));
      if (hasCompanion(t)) enqueue(makeMsg("nursery", { do: "offer", gear: id, label: g.label, from: nName(c) }, t));
      R("🧸 You gave " + nName(t) + " a " + g.label + "."); return;
    }
    if (what === "check"){
      const lvl = wetLevel(n), word = !(n.wet && n.wet.diaper) ? nPick("checkNone", NURSERY_LINES.checkNone) : lvl === 0 ? nPick("checkDry", NURSERY_LINES.checkDry) : lvl === 1 ? nPick("checkDamp", NURSERY_LINES.checkDamp) : nPick("checkSoggy", NURSERY_LINES.checkSoggy);
      v.m = word;
    }
    if (what === "change"){
      if (hasCompanion(t)) enqueue(makeMsg("nursery", { do: "change" }, t));
      if (n.wet){ n.wet.pct = 0; n.wet.leak = false; n.wet.told = 0; }
      saveLedger();
    }
    v.s = "stuffie";
    if (what === "wipe"){ const ms = nurseryMesses(t); if (ms.length){ const r = rec(t); for (const k of ms) if (r.messKinds) delete r.messKinds[k]; } }
    nurserySay(t, "🧸 " + nFill(nPick("care:" + what, C[what]), v));
    if (what === "praise" && Math.random() < 0.5) later(() => nurseryStar(t, "bein' so good"), 1500);
    if (Math.random() < 0.3) later(() => nurseryStar(c, "lookin' after a little"), 2000);
    state.nurseryCareAt = state.nurseryCareAt || new Map(); state.nurseryCareAt.set(t, Date.now());
    R("🧸 Done.");
  }
  // the Companion's panel: what the nursery shows them
  function nurseryStateFor(mn, s){
    const n = nrec(mn); if (!n) return;
    const here = new Set(nurseryHere());
    const o = { role: n.role, space: !!n.space, traps: n.traps !== false, stars: (n.stars && n.stars.d === dayKey()) ? n.stars.n : 0,
      cap: n.role === "caregiver" ? CFG.NURSERY.CARE_DAY : CFG.NURSERY.STARS_DAY,
      acts: Object.keys(NURSERY_LINES.play), cares: Object.keys(NURSERY_LINES.care).filter(k => !/^bath(Mid|End)$/.test(k)), asks: Object.keys(NURSERY_LINES.ask),
      gear: Object.entries(NURSERY_GEAR).map(([id, g]) => ({ id, label: g.label, kind: g.kind, group: g.group, name: g.name })) };
    if (n.role === "little"){
      o.carers = (n.carers || []).map(c => ({ mn: c, name: nName(c), here: here.has(c) }));
      o.wet = wetLevel(n); o.abcl = !!(n.wet && n.wet.at);
      o.messes = nurseryMesses(mn);
    } else {
      const mine = Object.values(L.people || {}).filter(p => p && p.nursery && p.nursery.role === "little" && ((p.nursery.carers || []).includes(mn) || here.has(p.mn)));
      o.littles = mine.map(p => ({ mn: p.mn, name: nName(p.mn), here: here.has(p.mn), space: !!p.nursery.space, mine: (p.nursery.carers || []).includes(mn), wet: wetLevel(p.nursery), messes: nurseryMesses(p.mn) }));
    }
    s.nursery = o;
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __nurseryTick: () => { state.nurseryAt = 0; nurseryTick(); }, __littleNow: (m) => littleNow(m), __nurseryStats: (m, x) => nurseryStats(m, x) });
