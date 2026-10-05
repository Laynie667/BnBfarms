  /* WHAT'S IN THIS FILE (13-apply.js)
     Applications: the ?apply interview (species, gender, length and depth are checked and re-asked),
     savin' it, and what ?approve sets up from it. Also tellin' staff things.
  */
  /* ───────────── APPLICATION ───────────── */

  // Each question has a key. Some take only certain answers (check), and those offer buttons in the Companion (choices).
  const GENDERS = ["female","male","futa","femboy"];
  // farm words and pet names for each kind (cowgirl, pupgirl and ponyboy work too: the girl/boy ending is dropped)
  const SPECIES_ALIAS = { kitten:"kitt", kitty:"kitt", kittie:"kitt", kit:"kitt", puppy:"pup", pupper:"pup", doggy:"dog", doggie:"dog", hound:"dog",
    cattle:"cow", heifer:"cow", hucow:"cow", bovine:"cow", calf:"cow", dairy:"cow", moo:"cow", ox:"bull", steer:"bull",
    piggy:"pig", piglet:"pig", sow:"pig", hog:"pig", swine:"pig", oink:"pig", lamb:"sheep", ewe:"sheep", doe:"deer", fawn:"deer",
    mare:"horse", stallion:"horse", filly:"pony", foal:"pony", colt:"pony", equine:"horse", vixen:"fox", bunny:"bunny", bun:"bunny",
    feline:"cat", canine:"dog", gob:"goblin", nanny:"goat", billy:"goat", kid:"goat", lupine:"wolf" };
  // words that mean "I'm not stock" (staff, guests, people who don't want to pick)
  const NOT_STOCK = /\b(no|nope|nah|not stock|not livestock|not an animal|not one|human|person|staff|farmhand|guest|luxury|visitor|none|skip|n\/?a)\b/;
  // words that are never an animal on their own ("yes", "ok"...): asked again instead of becomin' their species
  const NOT_ANIMAL = /^(yes|yeah|yep|ok|okay|sure|maybe|what|huh|help|hi|hello|stock|livestock|animal|both|me|it|idk)$/;
  // their animal from what they typed: "Cow.", "a cowgirl!", "I'm a hucow please", "puppy girl", "other dragon"
  function speciesFrom(text){
    const kinds = Object.keys(CFG.SPECIES).filter(k => k !== "default");
    const low = String(text||"").toLowerCase().replace(/[^a-z\s\/-]/g, " ").replace(/\s+/g, " ").trim();
    if (!low) return null;
    const other = low.match(/^other[:\s]+([a-z -]{2,30})$/); if (other) return other[1].trim();
    const known = w => {
      if (kinds.includes(w)) return w;
      if (SPECIES_ALIAS[w]) return SPECIES_ALIAS[w];
      for (const s of [w.replace(/ves$/, "f"), w.replace(/es$/, ""), w.replace(/s$/, "")]){ if (kinds.includes(s)) return s; if (SPECIES_ALIAS[s]) return SPECIES_ALIAS[s]; }
      const g = w.replace(/(girl|boy|gal|guy|kin)$/, ""); if (g !== w && g.length > 1) return known(g);
      return null;
    };
    const words = low.split(/[\s\/-]+/).filter(Boolean);
    for (const w of words){ const k = known(w); if (k) return k; }
    // somethin' we don't have a kind for, said plainly ("dragon", "red panda"): it's theirs
    const filler = new Set(["i","im","am","a","an","the","my","please","pls","just","really","think","maybe","so"]);
    const rest = words.filter(w => !filler.has(w));
    if (rest.length >= 1 && rest.length <= 2 && !NOT_ANIMAL.test(rest.join(" ")) && rest.every(w => w.length >= 2)) return rest.join(" ");
    return null;
  }
  const notSure = t => /\b(not sure|unsure|don'?t know|dont know|dunno|idk|undecided)\b/i.test(String(t||"").trim()) || /^(n\/a|na|none|skip)$/i.test(String(t||"").trim());
  // "I'm not stock": staff, guests, a plain no (but "no" inside "not sure" or an animal answer doesn't count)
  const notStock = t => { const low = String(t||"").toLowerCase().replace(/[^a-z\s\/]/g, " ").replace(/\s+/g, " ").trim(); return NOT_STOCK.test(low); };
  const QUESTIONS = [
    { key:"name",   text:"First things first, sweetie: what do we call you, and how do you like bein' addressed?" },
    { key:"role",   text:"What are you here as?  livestock / staff / guest / luxury guest / not sure yet\n(Both's an option, hon. Plenty here wear two collars!)" },
    { key:"species", text:"If you're stock, what kind of animal are you?", choices: () => Object.keys(CFG.SPECIES).filter(k => k !== "default").concat(["not stock"]),
      // an animal wins over everything else ("no, a cow"); then "not stock" or "not sure"; anything else is asked again
      check: t => { const sp = speciesFrom(t), known = sp && Object.keys(CFG.SPECIES).includes(sp);
                    if (known) return { value: sp };
                    if (notSure(t) || notStock(t)) return { value: "" };
                    if (sp) return { value: sp };
                    return { err:"I didn't catch an animal there, sugar. Just type one, like cow, pony, pup or kitten (or any other animal), or say not stock." }; },
      // stock only: somebody who said they're just staff or a guest isn't asked
      skip: (s) => { const role = String((s.byKey||{}).role||"").toLowerCase(); return !!role && !/stock|cow|animal|both|not sure|unsure|undecided|pet/.test(role) && /staff|farmhand|guest|luxury|visit|hand/.test(role); } },
    { key:"gender", text:"How should the farm see you?  female / male / futa / femboy", choices: () => GENDERS,
      check: t => { const g = String(t).trim().toLowerCase(); return GENDERS.includes(g) ? { value:g } : { err:"Just one of these, hon: female, male, futa or femboy." }; } },
    { key:"stay",   text:"How long you plannin' on stayin' with us?  1 hour / 12 hours / 1 day / 1 week / 2 weeks / 1 month / permanent / not sure",
      choices: () => BCPLUS.DURATIONS.map(d => d.label).concat(["not sure"]),
      check: t => notSure(t) ? { value:"" } : (BCPLUS.durationFrom(t) ? { value: BCPLUS.durationFrom(t).key } : { err:"Pick one, sugar: 1 hour, 12 hours, 1 day, 1 week, 2 weeks, 1 month, permanent, or not sure." }) },
    { key:"depth",  text:"How far under do you wanna go, sugar?  fun / deep / no human left / not sure", choices: () => BCPLUS.DEPTHS.map(d => d.label).concat(["not sure"]),
      check: t => notSure(t) ? { value:"" } : (BCPLUS.depthFrom(t) ? { value: BCPLUS.depthFrom(t).key } : { err:"Pick one, hon: fun, deep, no human left, or not sure." }) },
    { key:"likes",  text:"What sounds good to you here? Milkin', breedin', the pens, trainin', restraint, bein' displayed.\n(This is the one we read closest, sugar, so take your time.)" },
    { key:"curious", text:"Anything here you're curious about but a little nervous over? We'll go nice and slow on it." },
    { key:"limits", text:"🔴 HARD LIMITS. What must never happen? Please be specific. This is binding, and we enforce it." },
    { key:"soft",   text:"Soft limits: anything you'd like us to ask about first?" },
    { key:"triggers", text:"Triggers: anything that upsets you, that staff should steer clear of, in character or out? Only staff see this one." },
    { key:"aftercare", text:"What do you need after a heavy scene, hon? Warmth, quiet, praise, company, or to be left alone?" },
    { key:"else",   text:"Last one! Anything else Laynie and Alexia should know?" }
  ];
  const STAFF_QUESTIONS = [
    { key:"handled", text:"Ooh, a hand! What have you handled before?" },
    { key:"duties",  text:"What would you like to be responsible for here?" },
    { key:"sideways", text:"Are you comfortable steppin' in when somethin' goes sideways?" }
  ];
  // an application's answer by key (older saved applications are a plain list in the old order)
  const OLD_ORDER = ["name","role","species","stay","depth","likes","curious","limits","soft","triggers","aftercare","else"];
  function appAnswer(a, key){
    if (a.byKey) return a.byKey[key] || "";
    const i = OLD_ORDER.indexOf(key); return i >= 0 ? (a.answers[i] || "") : "";
  }

  function startApplication(mn, ch){
    if (state.sessions.has(mn)) {
      // stuck? (a question went to a panel they can't see) ask it again as plain text
      const s0 = state.sessions.get(mn);
      s0.textAsked = s0.step; s0.plainOnly = true;
      appSay(mn, "We're already halfway through your paperwork, sugar! Here's where we were. Just type your answer, or say 'quit' to tear it up and start over later.", s0);
      later(()=>askNext(mn), 1200);
      return;
    }
    // never out loud: these questions are private
    const useCh = (ch === "beep" || ((ch === "chat" || ch === "bot") && canBeep(mn))) ? "beep" : "whisper";
    state.sessions.set(mn, { mn, step:0, answers:[], byKey:{}, staffTrack:false, started:Date.now(), ch:useCh });
    // the bot remembers a Companion for hours; make sure it's really still there before any question is a panel button
    // (it answers a ping with a hello, which marks it fresh; see panelLive)
    probeCompanion(mn);
    // on a map a plain whisper only reaches the bot from the next tile over; /bot reaches it from anywhere in the room
    const how = useCh === "beep" ? "by beep" : (mapRoom() ? "with /bot <your answer> (works from anywhere in the room), or a whisper if you're standin' right by me" : "by whisper");
    appSay(mn,
`🌾 B&B FARM — INTAKE 🌾

`+QUESTIONS.length+` questions, sugar (`+(QUESTIONS.length+STAFF_QUESTIONS.length)+` if you're signin' on as staff)! Short's fine, rambly's fine.
Say 'skip' to pass one. Say 'quit' to stop. Nothin' saves till you're done.

Answer me `+how+` — no ? needed from here on.
Chat in the room all you like; I'll only count what you send me direct.`, state.sessions.get(mn));
    later(()=>askNext(mn), 1800);
  }

  // everything in the interview goes as plain text until their panel has answered (see panelLive)
  function appSay(mn, text, s){
    if (s && panelLive(mn, s)){ toCompanion(mn, text, "reply"); return; }
    if (mn === CFG.BOT_MEMBER){ selfLine(text); return; }
    if (s && s.ch === "beep" && canBeep(mn)){ for (const c of splitMessage(text, 900)) send("AccountBeep", { MemberNumber:mn, BeepType:"", Message:c }); return; }
    whisper(mn, text, false, true);   // not here at all: whisper() keeps it for them
  }

  // a Companion that has spoken up since this application started (a hello answerin' the ping, or a command)
  function panelLive(mn, s){
    const c = state.companions.get(mn);
    return !!(!s.plainOnly && c && hasCompanion(mn) && c.at >= s.started - 1000);
  }

  function askNext(mn){
    const s = state.sessions.get(mn);
    if (!s) return;
    const list = s.staffTrack ? QUESTIONS.concat(STAFF_QUESTIONS) : QUESTIONS;
    if (s.step >= list.length){ finishApplication(mn); return; }
    // a question that doesn't apply to them (the animal one, for staff and guests) is skipped
    if (list[s.step].skip && list[s.step].skip(s)){ s.byKey[list[s.step].key] = ""; s.answers.push(""); s.step++; askNext(mn); return; }
    const q = list[s.step], text = (s.step+1)+"/"+list.length+" — "+q.text;
    const asText = () => {
      // no Companion buttons: spell the choices out, unless the question already does
      const ch = q.choices ? q.choices() : [];
      const listed = ch.length && ch.every(c => text.toLowerCase().includes(String(c).toLowerCase()));
      appSay(mn, text+(ch.length && !listed ? "\nPick one: "+ch.join(" / ")+" (just type it)" : ""), s);
    };
    if (q.choices && panelLive(mn, s)){
      enqueue(makeMsg("choose", { text, choices: q.choices(), id: ++companionSeq }, mn));
      // safety net: buttons nobody presses in 90 seconds (panel closed, script turned off) come again as a plain question
      const step = s.step;
      later(()=>{
        const now = state.sessions.get(mn);
        if (now !== s || now.step !== step || now.textAsked === step) return;
        now.textAsked = step;
        asText();
      }, 90000);
    }
    else asText();
  }

  // FIX: only consume answers from the channel they applied on (the Companion counts as theirs too)
  function handleApplicationAnswer(mn, text, channel){
    const s = state.sessions.get(mn);
    if (!s) return false;
    if (channel === "chat") return false;          // never eat room chat
    if (s.ch === "beep" && channel !== "beep" && channel !== "companion") return false;
    if (s.ch === "whisper" && channel !== "whisper" && channel !== "bot" && channel !== "companion") return false;

    const raw = String(text).trim().replace(/^[?!.\-\/]/,"");
    const low = raw.toLowerCase();
    if (low==="quit"||low==="cancel"){
      state.sessions.delete(mn);
      appSay(mn, "All torn up, "+plainName(mn)+". No hard feelin's! Say ?apply any time you change your mind.", s);
      return true;
    }
    if (low === "apply"){ startApplication(mn, channel); return true; }   // stuck? ?apply again picks up where we were, in plain text
    const list = s.staffTrack ? QUESTIONS.concat(STAFF_QUESTIONS) : QUESTIONS;
    const q = list[s.step];
    let answer = low === "skip" ? "(skipped)" : raw;
    if (q && q.check && low !== "skip"){
      const got = q.check(raw);
      if (got.err){ appSay(mn, "🌾 "+got.err, s); later(()=>askNext(mn), 900); return true; }   // ask the same one again
      answer = got.value;
    }
    s.answers.push(answer);
    if (q) s.byKey[q.key] = answer;
    s.last = Date.now();
    if (q && q.key === "role" && /staff|farmhand|work/i.test(answer)) s.staffTrack = true;
    s.step++;
    later(()=>askNext(mn), 1200);
    return true;
  }

  // the full application, kept on their record when they're approved
  function keepApplication(mn, a){
    const r = rec(mn, true);
    r.application = { at: a.at, staffTrack: !!a.staffTrack, byKey: Object.assign({}, a.byKey || {}),
                      answers: a.byKey ? undefined : (a.answers || []).slice() };
  }
  // an application, question by question. onRecord: leave out what the record already shows (limits, triggers, aftercare)
  function applicationText(a, onRecord){
    const list = a.staffTrack ? QUESTIONS.concat(STAFF_QUESTIONS) : QUESTIONS;
    const skip = onRecord ? ["limits","triggers","aftercare"] : [];
    let o = "📋 Application, "+new Date(a.at).toLocaleDateString()+"\n";
    if (a.byKey) list.filter(q => !skip.includes(q.key)).forEach(q => { o += "\n▸ "+q.text.split("\n")[0].split("  ")[0]+"\n   "+(a.byKey[q.key] || "—")+"\n"; });
    else (a.answers || []).forEach((ans, qi) => { const k = OLD_ORDER[qi]; if (!skip.includes(k)) o += "\n▸ "+(k || "question "+(qi+1))+"\n   "+ans+"\n"; });
    return o.trimEnd();
  }

  function finishApplication(mn){
    const s = state.sessions.get(mn);
    if (!s) return;
    state.sessions.delete(mn);
    L.applications.push({
      id: Date.now().toString(36), mn, name: plainName(mn),
      at: Date.now(), staffTrack: s.staffTrack, answers: s.answers.slice(), byKey: Object.assign({}, s.byKey)
    });
    const r = rec(mn,true); r.name = plainName(mn);
    saveLedger(); audit(mn,"APPLY","");
    appSay(mn,
`That's the lot, `+plainName(mn)+`! Thank you, sweetie.

I'll put it in front of the proprietors and somebody'll come find you. Might be an hour, might be a day — we read every single one proper.

Welcome to B&B Farm. Mind the ruts! 🌾`, s);
    notifyStaff("📋 Ooh, a new application from "+plainName(mn)+" ("+mn+")! Say ?queue to read it.", true, true);
  }

  // what approvin' someone sets up from their answers
  function applyApplication(t, a){
    const r = rec(t, true);
    r.limits = appAnswer(a, "limits"); r.triggers = appAnswer(a, "triggers"); r.aftercare = appAnswer(a, "aftercare");
    const sp = a.byKey ? appAnswer(a, "species") : speciesFrom(appAnswer(a, "species"));
    if (sp) r.species = sp;
    const g = appAnswer(a, "gender");
    if (GENDERS.includes(g)){ r.gender = g; if (g === "futa") r.futa = true; }
    const stay = a.byKey ? appAnswer(a, "stay") : ((BCPLUS.durationFrom(appAnswer(a, "stay")) || {}).key || "");
    const depth = a.byKey ? appAnswer(a, "depth") : ((BCPLUS.depthFrom(appAnswer(a, "depth")) || {}).key || "");
    r.stayType = stay; r.wantDepth = depth;
    return { stay, depth };
  }

  // routine: only staff on duty here (proprietors too if nobody is). ping: also a real beep for Companion users.
  function notifyStaff(msg, routine, ping){
    const present = [];
    for (const k in L.people){
      const m = parseInt(k,10);
      if (m !== CFG.BOT_MEMBER && isStaff(m) && onDuty(m) && charFor(m)) present.push(m);
    }
    for (const m of present) beep(m, "🌾 "+msg, !routine || !!ping);
    if (!routine || present.length===0){
      for (const p of CFG.PROPRIETORS){
        if (present.includes(p)) continue;
        beep(p, "[B&B Farm] "+msg, !routine || !!ping);
      }
    }
  }

