  /* WHAT'S IN THIS FILE (10uo-services.js)
     FARM SERVICES (Laynie, Oct 29: "a rp friendly way to get rid of parasites that isnt just safewording. like maybe
     'services' that might be useful on the farm. Also, so livestock and players can be drained without having to rely
     on staff to click the drain button"). ?services lists them.
       ?drain                  drain yourself: squat over the bucket and push it all out (or ?drain butt, ?drain vulva)
       ?drain <who>            anybody on the books, on somebody right beside them who says yes first (like ?milk)
       ?service purge          the farm vet takes a parasite off: four beats, CFG.SERVICES.PURGE_COST ribbons
       ?service soak           a salt soak: stand in the water or at a trough for CFG.SERVICES.SOAK_MIN minutes and the
                               parasite lets go on its own. Free. Step out and it stops.
       ?coax <who>             coax a parasite off somebody next to you (they say yes first). Three beats. It might
                               hop onto you instead if you've said ?parasite on and it likes the look of you.
     The safeword still takes it off at once, as always.
  */
  CFG.SERVICES = CFG.SERVICES || { PURGE_COST: 3, SOAK_MIN: 10, BEAT_S: 30, HOP_CHANCE: 0.25, COAX_RIBBON: 1 };
  const svc = () => (state.services = state.services || new Map());
  const svcName = (mn) => plainName(mn);
  const svcFill = (t, mn, v) => String(t).replace(/%n/g, svcName(mn)).replace(/%by/g, v && v.by ? svcName(v.by) : "the farmhand").replace(/%ml/g, v && v.ml ? v.ml : "");
  const SERVICE_LINES = {
    // ── drainin' yourself ──
    selfDrain: [
      "%n squats over the drain bucket, presses both hands flat on their belly and pushes: %ml of seed splashes out into it, warm and thick.",
      "%n braces on the stall rail, bears down, and empties out over the bucket, %ml of it, gaspin' with every gush.",
      "{v}%n spreads their pussy with two fingers and lets it all run out, %ml of other people's seed patterin' into the bucket.",
      "%n kneels over the drain grate and works their belly with the heel of their hand till %ml has run out of them.",
      "%n squeezes and pushes and squeezes again, and %ml of seed comes out of them in long, sloppy rushes. The bucket's nearly full.",
    ],
    friendDrain: [
      "%by kneads %n's belly with both hands, firm and slow, and %ml of seed gushes out into the bucket between their knees.",
      "%by holds %n bent over the rail and presses down low on their belly till %ml has run out of them, sloppy and warm.",
      "%by pumps %n out like a well, push after push, %ml of seed splashin' into the bucket, and gives their rump a pat when they're empty.",
    ],
    // ── the vet's purge ──
    purgeMouth: [
      "The farm vet sets down her bag beside %n and snaps on a glove. \"Hold still, darlin'. Let's get that thing off your face.\"",
      "She paints a cold, bitter salve round the edge of the livin' lips. They twitch. They don't like it one bit.",
      "Slow and patient, she works a flat little spatula under the seal and teases the tentacle up out of %n's throat, inch by wet inch.",
      "With a wet pop it comes free. The vet drops it in a jar, screws the lid tight and pats %n's cheek. \"There. All yours again.\"",
    ],
    purgeBelt: [
      "The farm vet kneels by %n's hips and snaps on a glove. \"That belt's comin' off, darlin'. Breathe for me.\"",
      "She paints the bitter salve all along the livin' belt's edge, and it tightens, sulky, then starts to loosen.",
      "Slow and careful, she coaxes the root down out of %n and peels the belt away from their skin a little at a time.",
      "It lets go all at once and the vet catches it in a jar, quick as anything. \"Done. You'll feel empty for a bit. That's normal.\"",
    ],
    // ── a salt soak ──
    soakStart: ["%n wades into the water with a handful of rock salt from the barn and settles in. Whatever's latched on them goes very still.",
                "%n tips a scoop of salt into the water at their feet and stands there in it. The parasite on them twitches, unhappy."],
    soakMid: ["The salt stings. The parasite on %n squirms and loosens its grip, just a little.",
              "%n stays put in the salt water. Whatever's on them has started to let go at the edges.",
              "The parasite on %n gives a sullen little shudder. It doesn't like the salt one bit."],
    soakDone: ["The parasite lets go of %n all at once and drops into the water, where it curls up and sinks. %n is their own again.",
               "With one last sulky twitch the parasite peels off %n and slides away into the water. Gone."],
    soakLeft: "🧂 You stepped out of the salt water, sugar, so the parasite's still on. Go stand back in it (?service soak) and it'll start over.",
    // ── coaxed off by a friend ──
    coaxMouth: [
      "%by kneels by %n with a fingerful of honey and holds it right up to the livin' lips. They twitch. They're interested.",
      "%by draws the honey away, slow, an inch at a time, and the parasite stretches after it, loosenin' off %n's mouth.",
      "The tentacle slides up out of %n's throat to follow the sweet, and %by flicks the whole thing off into a bucket. Done.",
    ],
    coaxBelt: [
      "%by kneels by %n's hips with a dish of warm cream and sets it right where the livin' belt can smell it.",
      "%by strokes along the belt's edge, slow and patient, and it loosens, reachin' for the cream.",
      "The root slides out of %n and the belt slips off after the cream, and %by claps a lid on the dish. Done.",
    ],
    coaxHop: ["...and the parasite takes one look at %by, hops right off %n and onto them instead. Well. It liked the look of 'em."],
  };
  const svcLine = (key, mn, v) => svcFill(pickFor(mn, "svc:" + key, SERVICE_LINES[key]), mn, v);
  const svcBelt = (mn) => { const g = (rec(mn) || {}).parasite; return !!(g && g.form === "belt"); };
  // beats, one every BEAT_S seconds; it stops if they leave (or step off, for a soak)
  function svcRun(mn, job){
    const S = svc(); if (S.get(mn)) return false;
    job.i = 0; job.at = Date.now(); S.set(mn, job);
    const step = () => {
      const j = svc().get(mn); if (j !== job) return;
      if (!charFor(mn) || !parasiteOn(mn) || (job.stay && !job.stay())){ svc().delete(mn); if (job.off && parasiteOn(mn) && charFor(mn)) tell(mn, job.off); return; }
      if (job.i >= job.beats.length){ svc().delete(mn); job.done(); return; }
      emote((job.icon || "🩺") + " " + job.beats[job.i++], mn);
      later(step, (job.gap || CFG.SERVICES.BEAT_S) * 1000);
    };
    step();
    return true;
  }
  const inWater = (mn) => Object.keys(L.spots || {}).some(n => /^(water|trough)(-|$)/.test(n) && onSpot(mn, n, 0));
  function servicesText(){
    return "🛎️ Farm services, sugar:\n" +
      "• ?drain · drain yourself into the bucket (?drain butt, ?drain vulva for just one). Free.\n" +
      "• ?drain <who> · drain somebody right beside you. They say yes first.\n" +
      "• ?service purge · the farm vet takes a parasite off you, nice and careful. " + CFG.SERVICES.PURGE_COST + " ribbons.\n" +
      "• ?service soak · stand in the water or at a trough with a scoop of salt, " + CFG.SERVICES.SOAK_MIN + " minutes, and the parasite lets go. Free.\n" +
      "• ?coax <who> · tempt a parasite off somebody next to you. They say yes first. Careful: it might like you better.\n" +
      "Your safeword still takes anything off you at once.";
  }
  function serviceCommand(cmd, sender, args, R){
    const r = rec(sender), a0 = String(args[0] || "").toLowerCase();
    if (cmd === "services" || (cmd === "service" && !a0)){ R(servicesText()); return; }
    if (!r || !(r.roles || []).length){ R("Farm services are for folks on the books, sugar."); return; }
    if (cmd === "coax") return coaxCommand(sender, args, R);
    if (a0 === "drain"){ handleCommand(sender, "?drain " + args.slice(1).join(" "), "beep", true); return; }
    if (a0 !== "purge" && a0 !== "vet" && a0 !== "soak" && a0 !== "salt"){ R("I don't know that service, sugar. " + servicesText()); return; }
    if (!parasiteOn(sender)){ R("You haven't got a parasite on you, sugar. Nothin' to take off."); return; }
    if (!charFor(sender)){ R("Come to the farm first, sugar. The services are done here."); return; }
    if (svc().get(sender)){ R("One thing at a time, sugar. You're already bein' seen to."); return; }
    if (a0 === "purge" || a0 === "vet"){
      const cost = CFG.SERVICES.PURGE_COST;
      if (!spendRibbons(sender, cost, "the vet's purge")){ R("The vet's purge is " + cost + " ribbons, sugar, and you've got " + ribbonsOf(sender) + ". The salt soak's free: ?service soak."); return; }
      audit(sender, "SERVICE", "purge");
      R("🩺 The vet's on her way. " + cost + " ribbons, paid. Stay put, it takes a couple of minutes.");
      const belt = svcBelt(sender);
      svcRun(sender, { beats: (belt ? SERVICE_LINES.purgeBelt : SERVICE_LINES.purgeMouth).map(t => svcFill(t, sender)), icon: "🩺",
        off: "🩺 You wandered off before the vet was done, sugar. The ribbons are spent; say ?service purge again when you're ready.",
        done: () => parasiteOff(sender, "service") });
      return;
    }
    // the salt soak
    if (!inWater(sender)){ R("🧂 Go stand in the water or at a trough first, sugar, then say ?service soak again."); return; }
    const mins = CFG.SERVICES.SOAK_MIN, beats = [svcLine("soakStart", sender)];
    for (let i = 1; i < 4; i++) beats.push(svcLine("soakMid", sender));
    audit(sender, "SERVICE", "soak");
    R("🧂 Salt in the water. Stay right where you are for " + mins + " minutes and it'll let go.");
    svcRun(sender, { beats, icon: "🧂", gap: mins * 60 / 4, stay: () => inWater(sender), off: SERVICE_LINES.soakLeft,
      done: () => { emote("🧂 " + svcLine("soakDone", sender), sender); parasiteOff(sender, "service"); } });
  }
  function coaxCommand(sender, args, R){
    const t = resolveTarget(args[0]);
    if (!t || !rec(t)){ R("Coax it off who, sugar? ?coax <who>, somebody right beside you."); return; }
    if (t === sender){ R("You can't coax it off yourself, sugar. It knows your tricks. Try ?service soak, or ask a friend."); return; }
    if (!parasiteOn(t)){ R(svcName(t) + " hasn't got a parasite on them, sugar."); return; }
    const a = posOf(sender), b = posOf(t);
    if (!a || !b || Math.max(Math.abs(a.X - b.X), Math.abs(a.Y - b.Y)) > 1){ R("Get right up next to " + svcName(t) + " first, sugar."); return; }
    if (svc().get(t)){ R(svcName(t) + "'s already bein' seen to, sugar."); return; }
    addonAsks.set(t, { addon: null, at: Date.now(), cb: (yes) => {
      if (!yes){ tell(sender, svcName(t) + " said no, sugar. They're keepin' it for now."); return; }
      const belt = svcBelt(t), beats = (belt ? SERVICE_LINES.coaxBelt : SERVICE_LINES.coaxMouth).map(x => svcFill(x, t, { by: sender }));
      audit(sender, "SERVICE", "coax " + t);
      svcRun(t, { beats, icon: "🍯", stay: () => { const p = posOf(sender), q = posOf(t); return !!(p && q && Math.max(Math.abs(p.X - q.X), Math.abs(p.Y - q.Y)) <= 2); },
        off: "🍯 " + svcName(sender) + " stepped away before it let go, sugar. It's still on you.",
        done: () => {
          const rs = rec(sender) || {};
          const hop = rs.parasiteOn && !parasiteOn(sender) && !(rs.parasiteNext > Date.now()) && Math.random() < CFG.SERVICES.HOP_CHANCE;
          parasiteOff(t, "service");
          if (hop){ emote("🍯 " + svcFill(SERVICE_LINES.coaxHop[0], t, { by: sender }), t); parasiteLatch(sender, "hop"); return; }
          earnRibbons(sender, CFG.SERVICES.COAX_RIBBON, "coaxin' a parasite off " + svcName(t));
        } });
    } });
    askCard(t, "play", "🍯 " + svcName(sender) + " wants to coax that parasite off you, sugar. Say yes or no (?yes or ?no works too).");
    R("I've asked " + svcName(t) + " first, sugar. Once they say yes, get your honey ready.");
  }
  // ?drain on yourself (15-commands.js sends it here): anybody on the books, no staff needed
  function selfDrain(sender, holeArg, R){
    if (!rec(sender) || !(rec(sender).roles || []).length){ R("That's for folks on the books, sugar."); return; }
    const hs = holeArg ? holesFrom(holeArg) : HOLES;
    if (!hs){ R("Which hole, sugar? ?drain vulva, ?drain butt, ?drain mouth, or just ?drain for all of it."); return; }
    const p = prodOf(sender);
    if (p.tieUntil > Date.now()){ R("Not while you're still knotted, sugar! Wait for " + plainName(p.tiedTo) + "'s knot to go down."); return; }
    prodTick();
    let out = 0; for (const h of hs){ out += p.held[h] || 0; p.held[h] = 0; }
    if (out < 1){ R("You're not holdin' anything to drain, sugar. Empty as a fresh pail."); return; }
    if (p.pin && !sizePinned(sender)) p.pin = null;
    saveLedger(); audit(sender, "DRAIN", "self " + Math.round(out));
    if (charFor(sender)) emote("🪣 " + selfDrainLine(sender, hs, out), sender);
    else R("🪣 You drained " + ml(out) + " out of yourself.");
  }
  // the line for what came out of where: a pussy line only when the pussy was emptied (the tag never shows)
  function selfDrainLine(mn, hs, out){
    const pool = SERVICE_LINES.selfDrain.filter(t => !/^\{v\}/.test(t) || (hs.includes("vulva") && hasVulva(mn)));
    return svcFill(pickFresh("svc:selfDrain", pool).replace(/^\{v\}/, ""), mn, { ml: ml(out) });
  }
  // somebody who isn't staff drainin' somebody who said yes (the ?milk way, 15-commands.js)
  function friendDrainLine(by, t, out){ return "🪣 " + svcFill(pickFor(t, "svc:friendDrain", SERVICE_LINES.friendDrain), t, { by, ml: ml(out) }); }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __latch: (m, h) => parasiteLatch(m, h), __svc: () => svc() });
