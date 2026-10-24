  /* WHAT'S IN THIS FILE (10uj-echs.js)
     THE FARM AND ECHS (the Erotic Chat Hypnosis Suite add-on). Laynie, Oct 23: "the bot needs to detect when someone has
     set ?hypno on and to send a request to hypnotise them, or have a button to encourage the bot to send the request.
     it would be fun for some traps to also trigger a session", and "need a way to release commands, and triggers from
     the bots end, like allowing them to cum, touch, etc."
     The farm girl goes through ECHS's front door, exactly like a human hypnotist: she sends ECHS's own request, the
     player's ECHS shows its own box (agree, ignore or fight) and decides everything from the player's own settings,
     and she speaks ordinary suggestions to them. Nothin' here writes ECHS's settings or calls its code, and
     /echs safeword always wins.
     • ?hypno on asks their ECHS straight away, and every ECHS_OFFER_EVERY_MIN after while they're around. ?hypnotize me
       (the Companion's "Ask my ECHS" button) asks now. Their herd leader or a proprietor: ?hypnotize <who>.
     • The lantern and the mirror box ask too, when they let go of somebody with ?hypno on.
     • Under: the Conditioning add-on runs its session through her, with ECHS's own phrases worked in (conditioning).
     • ?allow <who> cum|touch|move|follow|speak|hear|see|clothes|notice|all: she tells their ECHS to let go of what
       she put on them, and the farm lets go of its own denial. Their herd leader, staff and proprietors.
     • ECHS hears nothin' after a "(" (out of character), and on a map a whisper only carries one tile. So when she
       speaks to ECHS she steps right beside them and whispers in character (her map whispers usually start with "(").
     • ?safe ends a session she's running, and so does their own /echs safeword (ECHS tells her).
     Messages (ECHS src/messaging.ts, src/session.ts): ChatRoomChat Hidden, Content "HypnoMsg", Dictionary [{ message }].
     She sends session-attempt / session-continue / session-wake; their ECHS answers session-update { phase, depthBand,
     refusedReason, ended }.
  */
  const ECHS_TAG = "HypnoMsg";
  const ECHS_PATTER = [
    "Shh now. Just listen to the farm, sugar, nothin' else needs you right now.",
    "Breathe in the hay and the warm barn air, and let it out slow, slower than that.",
    "Every breath out, your shoulders drop a little lower, and your thoughts get a little quieter.",
    "The barn's warm and the straw is soft, and you don't have to hold yourself up any more.",
    "Your eyes are gettin' heavy. It's alright to let them close. The farm's watchin' over you.",
    "Sinkin' down now, slow and easy, like settlin' into a deep warm stall.",
    "Good. You're doin' so well. Just let go a little more for me.",
    "There's nothin' to decide and nothin' to do. Only my voice, and the sinkin' feelin'."];
  // ?allow: what she can tell their ECHS to let go of (ECHS's own release wording, src/voice.ts)
  const ECHS_RELEASE = {
    cum: ["You may cum now, sugar. Go on."],
    touch: ["You can touch yourself again.", "You can feel again."],
    move: ["You can move again. Your body is your own."],
    follow: ["You are free to go, sugar."],
    speak: ["You can speak again. Your voice is back."],
    hear: ["You can hear everyone again."],
    see: ["You can see again. Your vision clears."],
    clothes: ["You can change your clothes."],
    notice: ["You notice everything again."],
  };
  const echsOf = (mn) => { state.echs = state.echs || new Map(); return state.echs.get(mn) || null; };
  const echsUnder = (mn) => { const v = echsOf(mn); return !!(v && v.phase === "Hypnotized"); };
  function echsSend(mn, message){ send("ChatRoomChat", { Content: ECHS_TAG, Type: "Hidden", Target: mn, Dictionary: [{ message }] }); }
  // in character, right beside them, so their ECHS hears it. Only while I'm actually talkin' to their ECHS (the
  // induction minute, a session, an ?allow), and back where I was the moment that's over (Laynie, Oct 23: "why is the
  // bot moving from its home spot again?": 0.43.0 stepped over for every request, and with speaker spots set she
  // never walked back)
  // (Oct 24, a watch showed her sittin' beside a pet for a whole half-hour trance: "the bot is still teleporting from its
  // home spot". Now SHE never moves: the one goin' under is brought to her side instead, led on foot by their Companion
  // or teleported, once a session.)
  function echsBeside(mn){
    if (!mapRoom()) return;
    const me = charFor(CFG.BOT_MEMBER), a = me && me.MapData && me.MapData.Pos, b = posOf(mn);
    if (!a || !b || b.X < 0 || Math.max(Math.abs(a.X - b.X), Math.abs(a.Y - b.Y)) <= 1) return;
    const v = echsOf(mn); if (v && v.broughtAt && Date.now() - v.broughtAt < 60000) return;
    if (v) v.broughtAt = Date.now();
    const to = spotBeside(CFG.BOT_MEMBER); if (!to) return;
    try { teleport(mn, to, false); } catch(e){ warn("echs bring:", e); }
  }
  // nothin' left to say to anybody's ECHS: back to where I stood
  function echsHome(){
    if (!state.echsFrom || Date.now() < (state.echsBusyUntil || 0)) return;
    if ([...(state.echs || new Map()).values()].some(v => v.phase === "InductionInProgress" || v.phase === "Hypnotized")) return;
    const me = charFor(CFG.BOT_MEMBER), from = state.echsFrom; state.echsFrom = null;
    if (!me || !me.MapData || !mapRoom()) return;
    me.MapData.Pos = { X: from.X, Y: from.Y };
    send("ChatRoomCharacterMapDataUpdate", me.MapData);
  }
  function echsSay(mn, text){
    if (!charFor(mn)) return false;
    echsBeside(mn);
    const t = String(text).replace(/[()]/g, "").replace(/\s+/g, " ").trim().slice(0, 900);
    if (t) enqueue({ Content: t, Type: "Whisper", Target: mn });
    return true;
  }
  function echsCan(mn){
    const r = rec(mn);
    if (!r || !(r.roles || []).length) return "they're not on the books";
    if (!r.hypno) return "they haven't said ?hypno on";
    if (/\b(hypno|trance|mind)/i.test(r.limits || "")) return "hypnosis is in their limits";
    if (!charFor(mn)) return "they're not here";
    if (quietNow(mn)) return "they're on ?quiet";
    const v = echsOf(mn);
    if (v && v.phase && v.phase !== "Idle" && v.phase !== "AttemptFailed" && Date.now() - (v.at || 0) < 31 * 60000) return v.phase === "Hypnotized" ? "they're already under with me" : "I'm already reachin' for them";
    return "";
  }
  // send ECHS's own request: their ECHS shows them the box, and answers
  function echsAsk(mn, by, why){
    const no = echsCan(mn); if (no) return no;
    state.echs = state.echs || new Map();
    const prev = echsOf(mn), retry = prev && prev.phase === "AttemptFailed" && Date.now() - (prev.at || 0) < 30 * 60000;
    const v = { phase: "Asked", at: Date.now(), by: by || CFG.BOT_MEMBER, why: why || "", band: null, heard: false, patter: 0 };
    state.echs.set(mn, v);
    const r = rec(mn); r.echs = Object.assign(r.echs || {}, { askedAt: v.at }); saveLedger();   // (the request itself reaches them anywhere: no walkin' over for it)
    if (retry) echsSend(mn, { type: "session-continue" });
    else echsSend(mn, { type: "session-attempt", hypnotistName: plainName(CFG.BOT_MEMBER) || "The farm girl", skill: CFG.ECHS_SKILL });
    log("ECHS: asked "+mn+" ("+(why || "?")+")");
    // nothin' back: they haven't got ECHS running (or it's switched off)
    later(() => {
      const v2 = echsOf(mn); if (v2 !== v || v.heard) return;
      state.echs.delete(mn);
      if (v.by && v.by !== CFG.BOT_MEMBER) tell(v.by, "🌀 No ECHS answered from "+plainName(mn)+", sugar. They may not have it, or it's switched off.");
    }, CFG.ECHS_ANSWER_S * 1000);
    return "";
  }
  function echsWake(mn, quiet){
    const v = echsOf(mn); if (!v) return false;
    if (!quiet && v.phase === "Hypnotized") echsSay(mn, "Wake up now, sugar. Come back up, slow and easy. Wake up.");
    v.wakeSent = Date.now();
    echsSend(mn, { type: "session-wake" });
    return true;
  }
  // their ECHS talkin' back (only ever about a session with me)
  function onHypnoMsg(sender, data){
    const m = data && Array.isArray(data.Dictionary) && data.Dictionary[0] && data.Dictionary[0].message;
    if (!m || m.type !== "session-update") return;
    state.echs = state.echs || new Map();
    const v = echsOf(sender) || { at: Date.now(), by: CFG.BOT_MEMBER, why: "" }, was = v.phase;
    v.heard = true; v.at = Date.now(); v.phase = String(m.phase || "Idle"); v.band = m.depthBand || null;
    state.echs.set(sender, v);
    const r = rec(sender); if (r){ r.echs = Object.assign(r.echs || {}, { seen: Date.now() }); }
    const toBy = (t) => { if (v.by && v.by !== CFG.BOT_MEMBER && v.by !== sender) tell(v.by, t); };
    if (m.refusedReason){
      log("ECHS: "+sender+" refused: "+m.refusedReason);
      if (!/Already under/i.test(m.refusedReason)) { state.echs.delete(sender); toBy("🌀 "+plainName(sender)+"'s ECHS said no: "+m.refusedReason); }
      saveLedger(); return;
    }
    if (v.phase === was && v.phase !== "Hypnotized") return;
    if (v.phase === "AttemptMade" && was !== "AttemptMade") echsBeside(sender);   // their box is up: bring them to my side for the induction
    if (v.phase === "InductionInProgress" && was !== "InductionInProgress") echsPatter(sender, v);
    else if (v.phase === "Hypnotized" && was !== "Hypnotized"){
      if (r) r.echs = Object.assign(r.echs || {}, { underAt: Date.now(), n: ((r.echs && r.echs.n) || 0) + 1 });
      toBy("🌀 "+plainName(sender)+" went under for me: "+(v.band || "under")+".");
      addonsEmit("echsUnder", sender, { by: v.by === CFG.BOT_MEMBER ? sender : v.by, why: v.why, band: v.band });
      later(() => { if (echsUnder(sender) && !v.taken) echsSay(sender, "That's it. So deep and so quiet. Stay right here with me a while."); }, 4000);
    }
    else if (v.phase === "AttemptFailed"){ toBy("🌀 "+plainName(sender)+" didn't go under this time."); }
    else if (v.phase === "Idle" && was && was !== "Idle"){
      state.echs.delete(sender);
      // not my wake and not ECHS's half hour: they came up themselves (their /echs safeword, most likely), so the farm stops too
      const self = !v.wakeSent && m.ended !== "timeout";
      addonsEmit("echsWoke", sender, { ended: m.ended || "", self });
      if (was === "Hypnotized") toBy("🌀 "+plainName(sender)+" is awake again"+(m.ended === "timeout" ? " (the trance ran its half hour)" : "")+".");
    }
    saveLedger();
  }
  // the minute ECHS gives an induction: every line from me counts toward their roll
  function echsPatter(mn, v){
    const lines = ECHS_PATTER.slice().sort(() => Math.random() - 0.5).slice(0, 5);
    lines.forEach((l, i) => later(() => { const v2 = echsOf(mn); if (v2 === v && v.phase === "InductionInProgress") { v.patter++; echsSay(mn, l); } }, 2500 + i * 11000));
  }
  // ?hypno on folk who are around and idle get asked now and then
  function echsTick(){
    echsHome();
    if (!CFG.ECHS_ON || !CFG.ECHS_OFFER_EVERY_MIN) return;
    const now = Date.now();
    if (now - (state.echsTickAt || 0) < 60000) return; state.echsTickAt = now;
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C.MemberNumber, r = rec(mn);
      if (!r || !r.hypno || mn === CFG.BOT_MEMBER || echsOf(mn)) continue;
      if (now - Math.max((r.echs && r.echs.askedAt) || 0, (r.echs && r.echs.underAt) || 0) < CFG.ECHS_OFFER_EVERY_MIN * 60000) continue;
      if (now - (state.lastSpoke.get(mn) || 0) > 20 * 60000) continue;   // away from the keyboard
      if (heldByTrap(mn) || (state.sceneRun && state.sceneRun.has(mn))) continue;
      echsAsk(mn, CFG.BOT_MEMBER, "offer");
      return;   // one at a time
    }
  }
  // ?hypnotize [me|who] · ?hypnotize stop <who>
  function hypnotizeCommand(sender, args, R){
    const a0 = String(args[0] || "me").toLowerCase();
    if (a0 === "stop" || a0 === "wake"){
      const t = args[1] ? resolveTarget(args[1]) : sender;
      if (!t) { R("Whose trance, sugar? ?hypnotize stop <who>"); return; }
      if (t !== sender && !isProprietor(sender) && !herdsOf(t).some(h => h.leader === sender) && !isStaff(sender)){ R("That's not yours to end, hon. Their own /echs safeword always works."); return; }
      R(echsWake(t) ? "🌀 Wakin' "+(t === sender ? "you" : plainName(t))+" up." : (t === sender ? "You're not under with me, sugar." : plainName(t)+" isn't under with me."));
      return;
    }
    const t = /^(me|myself|self)$/.test(a0) ? sender : resolveTarget(args[0]);
    if (!t || !rec(t)){ R("?hypnotize me asks your ECHS for a trance with the farm. Herd leaders: ?hypnotize <who>."); return; }
    if (t !== sender && !isProprietor(sender) && !herdsOf(t).some(h => h.leader === sender)){ R("Only "+plainName(t)+"'s herd leader, or a proprietor, can send me to them, sugar."); return; }
    const no = echsAsk(t, sender, t === sender ? "asked" : "herd");
    if (no){ R("🌀 Not right now: "+no+"."); return; }
    R(t === sender ? "🌀 I'm reachin' for you, sugar. Your ECHS will ask you: agree, ignore or fight. Nothin' happens if you haven't got ECHS." : "🌀 I'm reachin' for "+plainName(t)+". Their ECHS asks them, and they decide. I'll tell you how it goes.");
  }
  // ?allow <who> <what…> (?letgo too; ?release is the herd one)
  function releaseCommand(sender, args, R){
    const t = resolveTarget(args[0]);
    const all = Object.keys(ECHS_RELEASE);
    if (!t || !rec(t)){ R("?allow <who> "+all.join("|")+"|all · lets go of what the farm put on them: their denial here, and in their ECHS what I told it."); return; }
    if (t === sender && !isStaff(sender)){ R("Your safe word or /echs safeword lets go of everything, sugar. ?allow is for your herd leader and staff."); return; }
    if (!isStaff(sender) && !herdsOf(t).some(h => h.leader === sender)){ R("Only "+plainName(t)+"'s herd leader or staff can release them, hon."); return; }
    let want = args.slice(1).map(x => String(x).toLowerCase().replace(/[^a-z]/g, "")).map(x => ({ orgasm: "cum", come: "cum", climax: "cum", self: "touch", feel: "touch", walk: "move", leash: "follow", talk: "speak", voice: "speak", hearing: "hear", sight: "see", blind: "see", clothing: "clothes", dress: "clothes", aware: "notice", awareness: "notice", illusion: "notice", everything: "all" })[x] || x).filter(Boolean);
    if (!want.length){ R("Let "+plainName(t)+" do what again? ?allow "+plainName(t)+" "+all.join(" | ")+" | all"); return; }
    if (want.includes("all")) want = all.slice();
    const bad = want.filter(x => !ECHS_RELEASE[x]); if (bad.length){ R("I don't know how to release \""+bad.join(", ")+"\", sugar. "+all.join(", ")+", or all."); return; }
    const did = [], p = prodOf(t);
    // the farm's own
    if (want.includes("cum") && p && p.deniedUntil > Date.now()){ p.deniedUntil = 0; did.push("their denial here"); tell(t, "😮‍💨 "+plainName(sender)+" lifted your denial, sugar. You may."); }
    if (want.includes("notice") || want.length === all.length){ try { trance(t, 0); } catch(e){} }
    // their ECHS: only what I've had a hand in (a trance with me, or one lately)
    const e = (rec(t) || {}).echs || {}, mine = echsOf(t) || (e.underAt && Date.now() - e.underAt < 2 * 86400000);
    if (mine && charFor(t)){
      const lines = [].concat(...want.map(x => ECHS_RELEASE[x]));
      lines.forEach((l, i) => later(() => echsSay(t, l), i * 2500));
      did.push("in their ECHS: "+want.join(", "));
    }
    saveLedger(); audit(sender, "RELEASE", t+" "+want.join(","));
    R(did.length ? "🕊️ Released "+plainName(t)+": "+did.join("; ")+"." : "🕊️ Nothin' of the farm's had hold of "+plainName(t)+" for that"+(charFor(t) ? "" : ", and they're not here for me to tell their ECHS")+". Their own /echs safeword clears everything in ECHS.");
  }
  function echsStatus(sender, args, R){
    const t = args[0] ? resolveTarget(args[0]) : sender;
    if (!t || !rec(t)){ R("Whose, sugar? ?echs <who>"); return; }
    if (t !== sender && !isStaff(sender) && !herdsOf(t).some(h => h.leader === sender)){ R("Only staff or their herd leader look at somebody else's, hon."); return; }
    const v = echsOf(t), e = rec(t).echs || {}, ago = (x) => x ? Math.max(1, Math.round((Date.now() - x) / 60000))+" min ago" : "never";
    R("🌀 ECHS and the farm, "+plainName(t)+": "+(v ? ({ Asked: "I've just reached for them", AttemptMade: "their box is up", InductionInProgress: "goin' under", AttemptFailed: "it didn't take this time", Hypnotized: "under with me, "+(v.band || "under") })[v.phase] || v.phase : "nothin' runnin' with me")+
      " · ?hypno "+(rec(t).hypno ? "on" : "off")+" · ECHS last answered: "+ago(e.seen)+" · last under with me: "+ago(e.underAt)+(e.n ? " ("+e.n+" times)" : "")+".");
  }
