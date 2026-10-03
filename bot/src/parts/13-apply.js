  /* ───────────── APPLICATION ───────────── */

  const QUESTIONS = [
    "1/12 — First things first, sweetie: what do we call you, and how do you like bein' addressed?",
    "2/12 — What are you here as?  livestock / staff / guest / luxury guest / not sure yet\n(Both's an option, hon. Plenty here wear two collars!)",
    "3/12 — If you're stock, what kind of animal are you? ?species shows the list. 'Other' is welcome too!",
    "4/12 — How long you plannin' on stayin' with us?  a night / a week / a season / permanent / don't know",
    "5/12 — How far under do you wanna go, sugar?  playful / deep / no human left",
    "6/12 — What sounds good to you here? Milkin', breedin', the pens, trainin', restraint, bein' displayed.\n(This is the one we read closest, sugar, so take your time.)",
    "7/12 — Anything here you're curious about but a little nervous over? We'll go nice and slow on it.",
    "8/12 — 🔴 HARD LIMITS. What must never happen? Please be specific. This is binding, and we enforce it.",
    "9/12 — Soft limits: anything you'd like us to ask about first?",
    "10/12 — Triggers, or anything staff should steer clear of, in character or out? Only staff see this one.",
    "11/12 — What do you need after a heavy scene, hon? Warmth, quiet, praise, company, or to be left alone?",
    "12/12 — Last one! Anything else Laynie and Alexia should know?"
  ];
  const STAFF_QUESTIONS = [
    "13/15 — Ooh, a hand! What have you handled before?",
    "14/15 — What would you like to be responsible for here?",
    "15/15 — Are you comfortable steppin' in when somethin' goes sideways?"
  ];

  function startApplication(mn, ch){
    if (state.sessions.has(mn)) {
      reply(mn, "We're already halfway through your paperwork, sugar! Just answer the last question I asked, or say 'quit' to tear it up and start over later.", ch);
      return;
    }
    // never out loud: these questions are private
    const useCh = (ch === "beep" || ((ch === "chat" || ch === "bot") && isFriend(mn))) ? "beep" : "whisper";
    state.sessions.set(mn, { mn, step:0, answers:[], staffTrack:false, started:Date.now(), ch:useCh });
    reply(mn,
`🌾 B&B FARM — INTAKE 🌾

Twelve questions, sugar (fifteen if you're signin' on as staff)! Short's fine, rambly's fine.
Say 'skip' to pass one. Say 'quit' to stop. Nothin' saves till you're done.

Answer me ` + (useCh === "beep" ? "by beep" : "by whisper") + ` — no ? needed from here on.
Chat in the room all you like; I'll only count what you send me direct.`, useCh);
    later(()=>askNext(mn), 1800);
  }

  function askNext(mn){
    const s = state.sessions.get(mn);
    if (!s) return;
    const list = s.staffTrack ? QUESTIONS.concat(STAFF_QUESTIONS) : QUESTIONS;
    if (s.step >= list.length){ finishApplication(mn); return; }
    reply(mn, list[s.step], s.ch);
  }

  // FIX: only consume answers from the channel they applied on
  function handleApplicationAnswer(mn, text, channel){
    const s = state.sessions.get(mn);
    if (!s) return false;
    if (channel === "chat") return false;          // never eat room chat
    if (s.ch === "beep" && channel !== "beep") return false;
    if (s.ch === "whisper" && channel !== "whisper" && channel !== "bot" && channel !== "companion") return false;

    const low = String(text).trim().toLowerCase();
    if (low==="quit"||low==="cancel"){
      state.sessions.delete(mn);
      reply(mn, "All torn up, "+plainName(mn)+". No hard feelin's! Say ?apply any time you change your mind.", s.ch);
      return true;
    }
    s.answers.push(low==="skip" ? "(skipped)" : String(text).trim());
    s.last = Date.now();
    if (s.step===1 && /staff|farmhand|work/i.test(s.answers[1]||"")) s.staffTrack = true;
    s.step++;
    later(()=>askNext(mn), 1200);
    return true;
  }

  function finishApplication(mn){
    const s = state.sessions.get(mn);
    if (!s) return;
    state.sessions.delete(mn);
    L.applications.push({
      id: Date.now().toString(36), mn, name: plainName(mn),
      at: Date.now(), staffTrack: s.staffTrack, answers: s.answers.slice()
    });
    const r = rec(mn,true); r.name = plainName(mn);
    saveLedger(); audit(mn,"APPLY","");
    reply(mn,
`That's the lot, `+plainName(mn)+`! Thank you, sweetie.

I'll put it in front of the proprietors and somebody'll come find you. Might be an hour, might be a day — we read every single one proper.

Welcome to B&B Farm. Mind the ruts! 🌾`, s.ch);
    notifyStaff("📋 Ooh, a new application from "+plainName(mn)+" ("+mn+")! Say ?queue to read it.", true);
  }

  function notifyStaff(msg, routine){
    const present = [];
    for (const k in L.people){
      const m = parseInt(k,10);
      if (isStaff(m) && onDuty(m) && charFor(m)) present.push(m);
    }
    for (const m of present) beep(m, "🌾 "+msg, !routine);
    if (!routine || present.length===0){
      for (const p of CFG.PROPRIETORS){
        if (present.includes(p)) continue;
        beep(p, "[B&B Farm] "+msg, !routine);
      }
    }
  }

