  /* WHAT'S IN THIS FILE (10ur2-dispensary.js)
     THE FARMHAND'S DISPENSARY, FROM THE FARM GIRL'S SIDE (Laynie, Nov 17: "have the farm girl 'call' on the extension
     to apply shots", "anything to make the farmgirls load a little lighter"). The Dispensary is a player's own add-on
     (dist/farmhand-dispensary.user.js, docs/DISPENSARY.md). When somebody runnin' it takes a farm shot, I still read the
     needle and keep the books (their deniedUntil, their sedate boost), but I don't narrate it: I send their game one
     hidden "dose", and it does what they feel and says the line from their own game. Without one, I do it all, as ever.
       them → me   dispHello { ver, farm, lscg, off, hard }   is the farm on their ladder, is LSCG there, what they've
                                                         switched off, are they in hardcore
       me → them   dispWelcome { farm, stock }           who the farm is (the proprietors and staff), for their ladder;
                                                         are they on my books (then the proprietors hold their hardcore key)
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
  /* NOV 17, MORE: the Dispensary's own doses, the ones Laynie picked ("I love it"). Their hello says what's in them now
     (on) and, if they've switched cravings on, what they're cravin' (crave). I read two of them on the farm:
       Deep Throat Drops   a dosed throat takes a load without gaggin', and the trainin' counts twice (08-production.js)
       Rut                 a stud in rut loads half again as big, and doesn't run dry from a busy hour
     Cravings: when somebody's cravin', I notice (at most every 45 minutes) and offer; ?fix and I call their Dispensary
     for it, like any of my calls. Only ever for somebody who switched cravings on, for themselves. */
  const DISP_LABEL = { denial: "Denial Serum", sedative: "Sedative", needy: "Needy Nectar", hairtrigger: "Hair Trigger", bitterroot: "Bitterroot",
    moo: "Moo Juice", hiccup: "Hiccup Fizz", feather: "Featherlight", heat: "Heat", letdown: "Let-Down", fillout: "Fill-Out",
    airhead: "Airhead Elixir", babble: "Babble Brew", deepthroat: "Deep Throat Drops", rut: "Rut", tender: "Tender" };
  // the Dispensary's own needle words (shotUnread stays quiet about them: their Dispensary reads them, not me)
  const DISP_WORDS = /let[- ]?down|fill[- ]?out|swell(?:ing)? (?:serum|shot|tonic|potion|drops?)|airhead|bimbo (?:elixir|potion|serum|tonic|shot|juice|drops?)|babble|potty[- ]?mouth|deep[- ]?throat|throat relax|gag[- ]?reflex|\brut(?:ting)? (?:serum|shot|tonic|potion|musk|drops?)|in[- ]rut|tender (?:drops?|serum|balm|oil|shot|tonic)|tenderi[sz]er/i;
  const CRAVE_OFFER_MS = 45 * 60000;
  const CRAVE_OFFERS = [
    "💉 You've got that look, sugar. Itchin' for another %d? Say ?fix and I'll see to it.",
    "💉 Somebody's fidgety. Want a little %d to take the edge off, hon? ?fix, and it's yours.",
    "💉 I know that face. That's a %d face. Say ?fix and I'll fetch you one.",
    "💉 Lookin' a bit flat there, sugar. I could fix you up with some %d. Just say ?fix.",
  ];
  function dispOn(mn, id){ const d = dispFor(mn); return !!(d && Array.isArray(d.on) && d.on.includes(id)); }
  function craveOffer(mn, d){
    if (!d.crave || !DISP_LABEL[d.crave]) return;
    const seen = state.dispCraveAt || (state.dispCraveAt = new Map()), now = Date.now();
    if (now - (seen.get(mn) || 0) < CRAVE_OFFER_MS) return;
    seen.set(mn, now);
    tell(mn, CRAVE_OFFERS[Math.floor(Math.random() * CRAVE_OFFERS.length)].replace(/%d/g, DISP_LABEL[d.crave]));
  }
  function fixCommand(mn, R){
    const d = dispFor(mn);
    if (!d) return R("That's for folks runnin' The Farmhand's Dispensary, sugar, with cravings switched on.");
    if (!d.crave || !DISP_LABEL[d.crave]) return R("You're not cravin' anything right now, hon. Good for you.");
    const dose = d.crave, dc = dispCall(mn, dose, { x: 1, by: CFG.BOT_MEMBER });
    if (dc === "sent"){ d.crave = ""; audit(mn, "FIX", dose); return R("💉 There you go, sugar: " + DISP_LABEL[dose] + ". That should take the edge off."); }
    return R(dc === "ladder" ? "Your Dispensary doesn't take doses from the farm, hon, so I can't fix you up." : "You've switched " + DISP_LABEL[dose] + " off in your Dispensary, sugar, so I'll leave it be.");
  }
  addCommand("fix", { topic: "play", private: true, run: (c) => fixCommand(c.sender, c.R) });
  function onDispHello(mn, m){
    const had = dispMap().has(mn);
    const ids = (a) => Array.isArray(a) ? a.filter(x => typeof x === "string" && /^[a-z]{2,20}$/.test(x)).slice(0, 40) : [];
    dispMap().set(mn, { ver: String(m.ver || "?").slice(0, 20), farm: m.farm !== false, lscg: !!m.lscg,
                        off: Array.isArray(m.off) ? m.off.filter(x => typeof x === "string").slice(0, 40) : [], hard: m.hard === true, at: Date.now(),
                        on: ids(m.on), crave: typeof m.crave === "string" && DISP_LABEL[m.crave] ? m.crave : "" });
    try { craveOffer(mn, dispMap().get(mn)); } catch(e){ warn("crave:", e); }
    if (!had) log("Dispensary hello from "+mn+" (v"+String(m.ver || "?").slice(0, 20)+")");
    const r = rec(mn);
    // their hardcore, kept on their record: it holds even when their Dispensary isn't here to say so, till it lets go
    if (r){
      const was = JSON.stringify(r.dispHard || null);
      if (m.hard === true) r.dispHard = { on: true, due: Math.min(Number(m.due) || 0, Date.now() + 31 * 86400000),
        keys: Array.isArray(m.keys) ? m.keys.filter(x => Number.isInteger(x) && x > 0).slice(0, 12) : [], at: Date.now() };
      else delete r.dispHard;
      if (JSON.stringify(r.dispHard || null) !== was){ saveLedger(); audit(mn, "DISPHARD", m.hard === true ? "on" : "off"); }
    }
    enqueue(makeMsg("dispWelcome", { farm: dispFarmList(), stock: !!(r && Array.isArray(r.roles) && r.roles.length), species: r ? String(speciesKey(mn) || "").toLowerCase() : "" }, mn));   // (species: their animal, for Moo Juice)
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
  // my safeword (?safeword): if they've a Dispensary, every dose in it is lifted, and its farm side with it. In
  // HARDCORE (they switched it on, for themselves) their doses stay till a keyholder lets them out: the proprietors are
  // fetched like any safeword, and hold the key for farm stock.
  function dispSafe(mn){
    const d = dispFor(mn); if (!d) return;
    enqueue(makeMsg("dispClear", {}, mn), true);
    if (d.hard){ tell(mn, "🔒 Your Dispensary's in hardcore, sugar: your doses stay till a keyholder lets you out. Help's on its way all the same."); return; }
    dispSafeSide(mn);
  }
  /* HARDCORE ON MY SIDE (Laynie, Nov 17: "hardcore would generally lock their settings how they want currently have them,
     or have them set by someone else that is a keyholder. i think limits are theirs period, but hardcore locks them and
     keeps them from being changed"). While somebody's Dispensary is in hardcore (they switched it on, for themselves):
       - their own farm switches stay as they are: any "?<switch> on|off" from them is turned down
       - their keyholders can set them for them: ?ward <who> <switch> on|off (their limits still rule, as ever)
       - their limits are frozen: nobody changes them, staff and keyholders included
     It lets go when their Dispensary says so, or on its own date (an end date, or 30 days without a check-in), so an
     uninstalled Dispensary can't leave anybody frozen. Safety commands never wait on any of this. */
  function hardFor(mn){ const r = rec(mn), h = r && r.dispHard; return !!(h && h.on && h.due > Date.now()); }
  const hardKeys = (mn) => (hardFor(mn) && rec(mn).dispHard.keys) || [];
  const HARD_NOTE = "🔒 You're in hardcore, sugar: your switches stay as they are till it's over. Your keyholders can change them (?ward), or ask to be let out from your Dispensary.";
  // a command they sent about themselves that would flip one of their own switches
  function hardGate(sender, cmd, args, entry, R){
    if (!hardFor(sender) || state.hardBypass === sender) return false;
    if (entry && (entry.safety || entry.now || entry.staff)) return false;
    const v = String(args[0] || "").toLowerCase();
    if (!/^(on|off|yes|no)$/.test(v)) return false;   // askin' what it's set to is fine
    R(HARD_NOTE); audit(sender, "HARDGATE", cmd + " " + v);
    return true;
  }
  function wardCommand(sender, args, R){
    const t = resolveTarget(args[0] || ""), sw = String(args[1] || "").toLowerCase(), v = String(args[2] || "").toLowerCase();
    if (!t || !sw || !/^(on|off)$/.test(v)) return R("?ward <who> <switch> on|off: set a farm switch for somebody whose hardcore key you hold. Their limits still rule.");
    if (!hardFor(t)) return R(plainName(t) + " isn't in hardcore, sugar: their switches are theirs to flip.");
    if (!hardKeys(t).includes(sender)) return R("You don't hold " + plainName(t) + "'s key, hon.");
    const entry = commandOf(sw);
    if (!entry || entry.staff || entry.safety) return R("That isn't one of their switches, sugar. Try one like breedable, traps, potions, dares.");
    state.hardBypass = t; state.cooldowns.delete(t);
    try { handleCommandInner(t, sw + " " + v, "whisper"); } catch(e){ warn("ward:", e); } finally { state.hardBypass = 0; }
    audit(sender, "WARD", t + " " + sw + " " + v);
    tell(t, "🗝️ " + plainName(sender) + " (your keyholder) set your " + sw + " " + v + ".");
    R("🗝️ Done: " + plainName(t) + "'s " + sw + " is " + v + ", if their limits allow it (they've been told what came of it).");
  }
  addCommand("ward", { topic: "play", private: true, run: (c) => wardCommand(c.sender, c.args, c.R) });

  /* STEP 3 (Nov 17): the potions and shots that work anywhere. Their Dispensary does the feelin' and says the farm's
     own lines for them (shared/potion-voice.js), the moment they drink and every few minutes after, so I don't have to.
     A potion is still the farm's (its consent, its clock, its books): if their Dispensary won't take it (the farm off
     their list, that dose switched off), I do it the old way. */
  const DISP_POTIONS = { needy: "needy", hiccup: "hiccup", feather: "feather", heatmist: "heat", moo: "moo", bitterroot: "bitterroot" };
  // a potion just given: true if their Dispensary took it (then don't say its line, or its moments)
  function dispPotion(mn, P, f, by, line, quiet){
    const dose = DISP_POTIONS[P.id]; if (!dose || !dispFor(mn)) return false;
    const dc = dispCall(mn, dose, { mins: P.mins, x: 1, by: by || CFG.BOT_MEMBER, line: line || undefined, quiet: !!quiet, hand: false, undo: () => { f.disp = false; } });
    if (dc === "sent"){ f.disp = true; return true; }
    return false;
  }
  // is their Dispensary sayin' this potion's moments (so I don't)
  function dispTook(mn, id){ const r = rec(mn), f = r && r.fx && r.fx[id]; return !!(f && f.disp && dispFor(mn)); }

  function onDispensaryMsg(mn, m){
    if (m.type === "dispHello"){ onDispHello(mn, m); return true; }
    if (m.type === "doseDone"){ onDoseDone(mn, m); return true; }
    if (m.type === "dispSafeword"){ onDispSafeword(mn); return true; }
    return false;
  }
