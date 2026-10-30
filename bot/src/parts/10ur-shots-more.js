  /* WHAT'S IN THIS FILE (10ur-shots-more.js)
     MORE IN THE NEEDLE (Laynie, Oct 30: "love the new injector ideas. plus the new effects. the kryptonite effect should
     be usable with a auto-injector. I think if a piercing is made with auto-injector, it should be able to use all shot
     effects"). Every one of these works from a needle in the hand, an auto-injector, or a piercing crafted as one
     (any worn Item… slot, nipple and clit piercings included), and stacks like the old ones (x2 to x5).
       NEW EFFECTS (words on the crafted item)
         aphrodisiac · horny · lust serum       Needy Nectar from the needle: achin', squirmin', stirred right up
         hair trigger · sensitizer              an hour where every touch nearly sets them off
         denial serum · orgasm block            held at the edge, no cummin', two hours a dose
         flood · cum flood · gusher             their next loads come out enormous, half a day
         sedative · tranquilizer · drowsy       heavy, drowsy and slow for an hour
         obedience · mind control · docile      a step deeper under, simpler words (their hypno limits rule)
         moo serum                              Moo Juice from the needle
         futa serum                             a cock (and everything with it) for a day
         temporary · fleeting (with a size)     the growth or shrinkin' snaps back in an hour
         twins · triplets                       the next litter that takes comes double (triple at x2)
         ripening · ovulation · sure catch      heat now, and the very next load that can take, takes
         strawberry/chocolate/honey/vanilla/banana/caramel milk   their milk comes in flavoured for a day
         purge serum · antidote · detox         every shot in them flushed out (and a proprietor's kryptonite)
       (LSCG reads sedative, aphrodisiac, antidote and mind control too: one needle, both mods.)
       NEW INJECTORS (on anything worn)
         triggered: "when bred", "on climax", "when milked", "when denied", "on trap" (or "when trapped"): it doses
                    when that happens to them instead of on a clock
         roulette · mystery dose · lucky dip: each dose is somethin' random off the farm's list (their limits rule)
         iv drip · drip line · intravenous: keeps every timed effect on it topped up, quietly, instead of half-hourly jolts
       KRYPTONITE: a proprietor whispers ?kryptonite set <word>; a needle, injector or piercing that carries that word,
         on them, drops them to livestock for half an hour a dose (traps catch them, shots hit double, the farm talks to
         them like stock). ?kryptonite shows the barn's rumours; the farm gossips hints now and then; the first to land it
         gets ribbons. Their safeword ends it; a purge serum does too. They keep every command they have.
       ?myshots · everything a shot or a potion is doin' to you right now, and for how long.
  */
  CFG.SHOTS2 = CFG.SHOTS2 || { TRIGGER_MIN: 5, DRIP_MIN: 5, KRYPTO_MIN: 30, KRYPTO_RIBBONS: 3, RUMOR_H: [2, 4], TEMP_H: 1 };
  Object.assign(CFG.TAG_WORDS, {
    aphro: ["aphrodisiac", "horny", "lust serum", "libido"],
    trigger: ["hair trigger", "hair-trigger", "hairtrigger", "sensitizer", "sensitiser", "oversensitiv"],
    denial: ["denial serum", "denial shot", "orgasm block", "orgasm denial", "edge serum"],
    flood: ["cum flood", "flood serum", "flood shot", "gusher", "overflow serum"],
    sedative: ["sedative", "tranquiliz", "tranquilis", "drowsy"],
    obey: ["obedience", "obedient", "mind control", "trance serum", "docile"],
    mooserum: ["moo serum", "moo shot", "moo juice"],
    futashot: ["futa serum", "futa shot", "futanari serum", "grow a cock"],
    temp: ["temporary", "fleeting", "temp growth"],
    twins: ["twins", "twin serum", "triplets", "multiples"],
    ripe: ["ripening", "ovulation", "ovulat", "sure catch", "instant ripe"],
    flavor: ["strawberry milk", "chocolate milk", "honey milk", "vanilla milk", "banana milk", "caramel milk", "flavoured milk", "flavored milk"],
    purge: ["purge serum", "purge shot", "antidote", "detox", "cleanser"],
  });
  const FLAVORS = ["strawberry", "chocolate", "honey", "vanilla", "banana", "caramel"];
  const LSCG_WORDS = /sedative|horny|aphrodisiac|antidote|mind ?control|enlarg|shrink|sleep/i;
  const SHOT_WORDS = /\b(shot|serum|dose|vial|booster|tonic|inject|syringe|needle|elixir|draught)/i;
  Object.assign(SHOT_LINES, {
    aphro: ["A warm, syrupy heat spreads out from the needle and %t starts to squirm. Everything itches. Everything wants.",
            "{v}%t's thighs press together as the aphrodisiac hits, and they're wet before the needle's even out.",
            "{c}%t's cock jumps and fills as the aphrodisiac floods through them, achin' for anything at all.",
            "%t's breath goes shallow and their skin goes pink all over. They can't stop movin'."],
    trigger: ["%t shivers as the sensitizer spreads. The next hand on them is goin' to be a problem.",
              "Every nerve on %t lights up at once. They flinch from their own clothes brushin' against them.",
              "%t gasps at nothin' at all. Hair trigger. One good touch and they'll go."],
    denial: ["Somethin' cold settles low in %t's belly and locks there. They can feel the edge, and they can feel it's not goin' to let them past.",
             "%t moans as the denial serum takes hold: all the want in the world, and nowhere for it to go.",
             "The needle comes out and %t's whole body tightens around a climax it won't be allowed to have."],
    flood: ["{c}%t's balls tighten and swell, heavy and achin', fillin' up for somethin' enormous.",
            "{c}%t groans as the flood serum gets to work. The next load out of them is goin' to make a mess of somebody.",
            "{nc}A heavy, full feelin' settles in %t. Whatever they let go of next, there'll be a lot of it."],
    sedative: ["%t's eyelids droop as the sedative takes them. Their knees go loose and their head goes soft and quiet.",
               "%t sways on their feet, smilin' at nothin', every movement slow and syrupy.",
               "Heavy, warm and drowsy, %t leans on whatever's closest. They'll go wherever they're led right now."],
    obey: ["%t's eyes go glassy as the serum spreads. Thinkin' gets harder. Doin' as they're told gets easier.",
           "A soft fog rolls through %t's head. Words get small and simple. Yes gets easy.",
           "%t blinks slow and docile, waitin' to be told what's next."],
    mooserum: ["%t opens their mouth to complain and a long, low moo comes out instead.",
               "%t's tongue goes thick and stupid. Every word they reach for turns into an animal noise."],
    futashot: ["{nc}%t cries out as somethin' new swells into bein' between their legs: a cock, hard and heavy and brand new, and balls full already.",
               "{nc}The futa serum works fast. %t looks down at the fat new cock jutting out of them, throbbing in time with their heart."],
    temp: ["(It won't last. An hour, and it'll snap back.)"],
    twins: ["{v}%t's belly gives a strange, greedy flutter. Whatever takes in there next is takin' double.",
            "%t's womb goes warm and heavy. The next litter's goin' to be a crowded one."],
    ripe: ["{v}%t's belly cramps sweet and deep, and they can feel it: ripe, open, ready. The very next load is goin' to take.",
           "%t flushes hot from head to toe. Ripe as fruit on the vine, and every stud in the barn can smell it.",
           "{nv}%t's belly goes tight and hungry. The very next load that can take in 'em, will."],
    flavor: ["%t's chest tingles and goes sweet. Their milk's comin' in %f now.",
             "A sugary warmth settles in %t's udders. Whatever comes out of 'em next tastes of %f."],
    purge: ["The purge burns cold through %t and out again, takin' every serum in 'em with it. Clean as the day they came.",
            "%t shudders as the antidote washes through, and everything the needles put in 'em drains away."],
  });
  const KRYPTO_LINES = {
    start: ["💥 The needle goes in and %t's knees give out. Every bit of the proprietor drains out of their face, and what's left is just stock. Somebody found %t's kryptonite.",
            "💥 %t goes white, then pink, then sinks to the boards. Their kryptonite's in their blood, and for a while they're nothin' but livestock on their own farm.",
            "💥 %t staggers as it hits. The room watches the proprietor fold up into somethin' soft and needy and owned. Oh, somebody's goin' to enjoy this."],
    auto: ["💥 Somethin' %t's wearin' clicks, and a needle carryin' their kryptonite slides in. %t sags. For a while, they're just stock."],
    stock: ["Down here with the rest of the stock, %t. Feels right, doesn't it?",
            "The traps can smell it on you, %t. You're livestock till this wears off.",
            "%t, the boss. Look at you now. Just another animal on the farm.",
            "Every shot hits you double while you're like this, %t. Somebody ought to take advantage.",
            "Kneel, %t. Livestock kneel.",
            "Your own farm, %t, and you're the one in the straw."],
    end: ["The weakness drains out of %t, and the proprietor stands back up where the stock was kneelin'. Everybody saw, though.",
          "%t shakes it off. Proprietor again. But the barn's goin' to be talkin' about this for a while."],
    rumor: ["🗝️ Barn gossip: they say %t goes weak at the knees for %h.",
            "🗝️ Overheard by the troughs: one shot with %h in it and %t's nothin' but stock.",
            "🗝️ The farmhands are whisperin' that %t's got a weakness: %h. Somebody ought to test that.",
            "🗝️ Word is, if you crafted a needle with %h on it, %t would fold right up."],
  };
  const TRIGGERS = {
    climax: ["on climax", "when i cum", "when they cum", "on orgasm", "orgasm trigger", "when cummin"],
    bred: ["when bred", "on breeding", "breed trigger", "when filled", "on fill"],
    milked: ["when milked", "on milking", "milk trigger"],
    denied: ["when denied", "on denial", "when ruined", "when edged", "on edge"],
    trap: ["on trap", "trap trigger", "when trapped"],
  };
  const TRIGGER_OPEN = {
    climax: "The moment %n peaks, the %c answers with a click: a needle, timed to the clench.",
    bred: "The load's barely in %n before the %c jabs: a dose, chasin' the seed.",
    milked: "Somethin' in the %c on %n feels the let-down and doses 'em, right as the milk starts to flow.",
    denied: "The %c on %n catches the edge they didn't get to go over and stabs 'em with somethin' for their trouble.",
    trap: "The trap springs and the %c on %n springs with it: a needle, right on cue.",
  };
  const ROULETTE = ["roulette", "mystery dose", "lucky dip", "random dose"];
  const ROULETTE_POOL = [["lactation", "milk"], ["virility", null], ["fertility", "breed"], ["heat inducer", "heat"], ["udder growth", "size"], ["cock growth", "size"],
    ["ass growth", "size"], ["aphrodisiac", null], ["hair trigger", null], ["denial serum", "denial"], ["cum flood", null], ["sedative", "sedat"], ["obedience", "hypno"],
    ["moo serum", null], ["twins", "breed"], ["ripening", "breed"], ["capacity", null], ["egg laying", "eggs"], ["hyper pregnancy", "breed"], ["strawberry milk", "milk"],
    ["temporary udder growth", "size"], ["temporary ass growth", "size"]];
  const DRIP = ["iv drip", "drip line", "drip feed", "intravenous", "iv line"];
  // canonical words for the timed effects a drip keeps topped up: [tag, word, is it on now?]
  const DRIP_KEEP = [["lactation", "lactation", (p) => boosted(p, "milk")], ["virility", "virility", (p) => boosted(p, "semen")], ["fertility", "fertility", (p) => boosted(p, "fert")],
    ["eggs", "egg laying", (p) => boosted(p, "eggs")], ["hyper", "hyper pregnancy", (p) => boosted(p, "hyper")], ["contraceptive", "contraceptive", (p) => boosted(p, "contra")],
    ["trigger", "hair trigger", (p) => boosted(p, "trigger")], ["sedative", "sedative", (p) => boosted(p, "sedate")], ["flood", "cum flood", (p) => boosted(p, "flood")],
    ["denial", "denial serum", (p) => p.deniedUntil > Date.now()], ["aphro", "aphrodisiac", (p, mn) => potionOn(mn, "needy")]];
  const kFill = (t, mn, v) => String(t).replace(/%t/g, plainName(mn)).replace(/%h/g, (v && v.h) || "").replace(/%f/g, (v && v.f) || "");
  const injWord = (text) => { const f = squash(text); return AUTO_INJECT.some(w => f.includes(squash(w))) || f.includes("injector"); };
  const triggerOf = (text) => { const f = squash(text); return Object.keys(TRIGGERS).filter(k => TRIGGERS[k].some(w => f.includes(squash(w)))); };
  const isDrip = (text) => { const f = squash(text); return DRIP.some(w => f.includes(squash(w))); };
  const isRoulette = (text) => { const f = squash(text); return ROULETTE.some(w => f.includes(squash(w))); };
  const isPiercing = (g) => /Piercings$/.test(String(g || ""));

  // ── KRYPTONITE ──
  function kryptoNow(mn){ const r = rec(mn); return !!(r && r.krypto && r.krypto.until > Date.now()); }
  function kryptoHit(mn, text){
    const r = rec(mn), k = r && r.kryptonite;
    if (!k || !k.word || !isProprietor(mn)) return false;
    const w = squash(k.word); return w.length >= 3 && squash(text).includes(w);
  }
  function kryptoStart(mn, by, x, auto){
    const r = rec(mn), now = Date.now(), was = kryptoNow(mn);
    r.krypto = { until: Math.max(now, (r.krypto && r.krypto.until) || 0) + CFG.SHOTS2.KRYPTO_MIN * 60000 * Math.max(1, x || 1), by, at: (was && r.krypto.at) || now, told: now };
    if (!was && charFor(mn)) emote(kFill(pickFresh("krypto:" + (auto ? "auto" : "start"), auto ? KRYPTO_LINES.auto : KRYPTO_LINES.start), mn), mn);
    tell(mn, "💥 Your kryptonite, sugar. For " + Math.ceil((r.krypto.until - now) / 60000) + " minutes you're livestock on your own farm: the traps can catch you and every shot hits you double. Your commands still work, and your safeword (or a purge serum) ends it.");
    // the first to land it gets a reward (a hand on the needle, not a toy)
    if (by && by !== mn && by !== CFG.BOT_MEMBER){
      r.kryptonite.found = r.kryptonite.found || [];
      if (!r.kryptonite.found.includes(by)){ r.kryptonite.found.push(by); later(() => earnRibbons(by, CFG.SHOTS2.KRYPTO_RIBBONS, "findin' " + plainName(mn) + "'s kryptonite", CFG.BOT_MEMBER), 2000); }
    }
    saveLedger(); audit(by || CFG.BOT_MEMBER, "KRYPTONITE", mn + " " + Math.round((r.krypto.until - now) / 60000) + "m"); syncCompanions(true);
  }
  function kryptoEnd(mn, why){
    const r = rec(mn); if (!r || !r.krypto) return;
    const was = r.krypto.until > Date.now(); r.krypto = null; saveLedger();
    if (was && why !== "safe" && charFor(mn)) emote(kFill(pickFresh("krypto:end", KRYPTO_LINES.end), mn), mn);
  }
  function kryptoHint(mn){
    const k = (rec(mn) || {}).kryptonite; if (!k || !k.word) return null;
    return k.hint || ("somethin' that starts with “" + k.word.trim()[0].toUpperCase() + "”, " + k.word.trim().length + " letters long");
  }
  function kryptoCommand(sender, args, R, channel){
    const a0 = String(args[0] || "").toLowerCase(), r = rec(sender);
    const rumors = () => Object.values(L.people || {}).filter(p => p && p.kryptonite && p.kryptonite.word && (p.roles || []).includes(ROLE.PROPRIETOR))
      .map(p => "• " + (p.name || p.mn) + ": " + kryptoHint(p.mn) + ((p.kryptonite.found || []).length ? " (found " + p.kryptonite.found.length + " time" + (p.kryptonite.found.length === 1 ? "" : "s") + ")" : ""));
    if (!isProprietor(sender) || !a0){
      const list = rumors();
      R("🗝️ THE BARN'S RUMOURS\n" + (list.length ? list.join("\n") + "\n\nCraft a needle (or an auto-injector, or a piercing) with the right word on it and see what happens." : "No proprietor's admitted to a weakness. Yet.") +
        (isProprietor(sender) ? "\n\nYours: " + (r.kryptonite && r.kryptonite.word ? "set (?kryptonite word shows it, privately)" : "none. Whisper me ?kryptonite set <word>") + ". ?kryptonite hint <text> · ?kryptonite off" : ""));
      return;
    }
    if (a0 === "set"){
      const word = args.slice(1).join(" ").trim();
      if (channel === "chat"){ R("Not out loud, sugar! The whole room just heard you. Whisper or beep me ?kryptonite set <word>, or use the Companion, and pick a word nobody heard."); return; }
      if (squash(word).length < 3 || word.length > 30){ R("Pick a word or two, 3 to 30 letters: somethin' a crafter would have to think of. ?kryptonite set <word>"); return; }
      r.kryptonite = { word, hint: (r.kryptonite && r.kryptonite.hint) || "", at: Date.now(), found: [] }; saveLedger(); audit(sender, "KRYPTONITE_SET", "(secret)");
      R("🗝️ Your kryptonite is set. Nobody hears the word from me. A needle, an auto-injector or a piercing with it on, used on you, and you're livestock for half an hour a dose. ?kryptonite hint <text> to write your own rumour (otherwise the barn guesses at the first letter and the length)."); return;
    }
    if (a0 === "hint"){ if (!r.kryptonite){ R("Set a word first, sugar."); return; } r.kryptonite.hint = args.slice(1).join(" ").trim().slice(0, 120); saveLedger(); R("🗝️ The barn's rumour about you: " + kryptoHint(sender)); return; }
    if (a0 === "word"){ if (channel === "chat"){ R("Not out loud, sugar. Whisper or beep me."); return; } R(r.kryptonite ? "🗝️ Your word: " + r.kryptonite.word : "You haven't set one."); return; }
    if (a0 === "off"){ r.kryptonite = null; kryptoEnd(sender, "off"); saveLedger(); R("🗝️ No more kryptonite. You're bulletproof again."); return; }
    R("?kryptonite · ?kryptonite set <word> (whisper it) · hint <text> · word · off");
  }

  // ── what a shot's new words do (applyShot calls this) ──
  function shotsMore(target, by, text, tags, x, done, fx0){
    const r = rec(target), p = prodOf(target), now = Date.now(), H = 3600000, lim = String(r.limits || "");
    const potion = (id, why) => { const P = potionDef(id); if (P && P.limit && P.limit.test(lim)){ done.push("no " + why + ", their limits rule it out"); return false; } givePotion(target, id, by, "from a shot"); return true; };
    if (tags.has("aphro") && potion("needy", "aphrodisiac")){ arouse(target, 30 * x); done.push("achin' and needy"); fx0.push("aphro"); }
    if (tags.has("trigger")){ p.boosts.trigger = Math.max(p.boosts.trigger || 0, now) + H * x; done.push("hair trigger for " + (x > 1 ? x + " hours" : "an hour")); fx0.push("trigger"); }
    if (tags.has("denial")){
      if (/\b(denial|chast|orgasm|edg)/i.test(lim)) done.push("no denial, their limits rule it out");
      else { p.deniedUntil = Math.max(p.deniedUntil || 0, now) + 2 * H * x; done.push("held at the edge for " + Math.ceil((p.deniedUntil - now) / H) + " hours"); fx0.push("denial"); }
    }
    if (tags.has("flood")){ const lv = addBoost(p, "flood", 12 * H, x); done.push("loads " + (1 + 1.5 * lv) + " times as big for half a day"); fx0.push("flood"); }
    if (tags.has("sedative")){
      if (/\b(sedat|drug|sleep)/i.test(lim)) done.push("no sedative, their limits rule it out");
      else { p.boosts.sedate = Math.max(p.boosts.sedate || 0, now) + H * x; done.push("drowsy and slow for " + (x > 1 ? x + " hours" : "an hour")); fx0.push("sedative"); }
    }
    if (tags.has("obey")){ if (/\b(hypno|trance|mind)/i.test(lim)) done.push("no trance, their limits rule it out"); else { goUnder(target, 1 + x); done.push("a step deeper under"); fx0.push("obey"); } }
    if (tags.has("mooserum") && potion("moo", "moo serum")){ done.push("moo, moo"); fx0.push("mooserum"); }
    if (tags.has("futashot")){
      if (r.futa && !r.futaShot) done.push("already futa");
      else if (limitBlocks(target, "futa")) done.push("no futa, their limits rule it out");
      else { r.futa = true; prodOf(target); r.futaShot = { until: Math.max(now, (r.futaShot && r.futaShot.until) || 0) + 24 * H * x }; done.push("futa for " + (x > 1 ? x + " days" : "a day")); fx0.push("futashot"); }
    }
    if (tags.has("twins")){ if (limitBlocks(target, "breed")) done.push("no twins, their limits rule it out"); else { p.boosts.twins = Math.max(p.boosts.twins || 0, now) + 72 * H; p.boostX = p.boostX || {}; p.boostX.twins = Math.min(2, Math.max(p.boostX.twins || 0, x)); done.push("the next litter that takes comes " + (x > 1 ? "triple" : "double")); fx0.push("twins"); } }
    if (tags.has("ripe")){
      if (limitBlocks(target, "breed")) done.push("not ripe, their limits rule it out");
      else { p.boosts.ripe = Math.max(p.boosts.ripe || 0, now) + 6 * H * x; if (!limitBlocks(target, "heat")) startHeat(target, by); done.push("ripe: the next load that can take, takes"); fx0.push("ripe"); }
    }
    if (tags.has("flavor") && makesMilk(target)){
      const f = squash(text), k = FLAVORS.find(w => f.includes(w + "milk")) || FLAVORS[Math.floor(Math.random() * FLAVORS.length)];
      p.milkFlavor = { k, until: Math.max(now, (p.milkFlavor && p.milkFlavor.until) || 0) + 24 * H * x }; done.push("milk comes in " + k + " for a day"); fx0.push("flavor:" + k);
    }
    if (tags.has("purge")){
      p.boosts = {}; p.boostX = {}; p.deniedUntil = 0; p.milkFlavor = null;
      if (r.futaShot){ r.futaShot = null; r.futa = false; }
      tempSizeAll(target); kryptoEnd(target, "purge");
      done.push("every shot in 'em flushed out"); fx0.push("purge");
    }
  }
  // the room line for a new effect (shotLine's own table, with the flavour put in)
  function shotsMoreLine(k, t){ if (/^flavor:/.test(k)) return shotLine("flavor", t).replace(/%f/g, k.slice(7)); return shotLine(k, t); }

  // ── temporary sizes: an hour, then they snap back ──
  function tempSizeAdd(mn, part, d, x){
    const p = prodOf(mn); p.tempSize = (p.tempSize || []).concat({ part, d, until: Date.now() + CFG.SHOTS2.TEMP_H * 3600000 * Math.max(1, x || 1) });
  }
  function tempSizeAll(mn){ const p = prodOf(mn); for (const t of p.tempSize || []) setSize(mn, t.part, sizeOf(mn, t.part) - t.d, true); p.tempSize = []; }
  // ── a shot effect worth a line on its own, now and then, and the ones that wear off ──
  function shotsMoreTick(){
    const now = Date.now();
    if (now - (state.shots2At || 0) < 20000) return; state.shots2At = now;
    for (const [k, r] of Object.entries(L.people || {})){
      const mn = Number(k); if (!r || !r.prod) continue;
      const p = r.prod;
      // temporary sizes back
      if (p.tempSize && p.tempSize.length){
        const due = p.tempSize.filter(t => t.until <= now); if (due.length){
          for (const t of due){ setSize(mn, t.part, sizeOf(mn, t.part) - t.d, true); if (charFor(mn)) tell(mn, "💉 Your " + ((CFG.SIZES[t.part] || {}).label || t.part).toLowerCase() + " snaps back to " + sizeName(mn, t.part) + ". It was only ever temporary, sugar."); }
          p.tempSize = p.tempSize.filter(t => t.until > now); saveLedger(); syncCompanions(true);
        }
      }
      // a futa shot wears off
      if (r.futaShot && r.futaShot.until <= now){ r.futaShot = null; r.futa = false; saveLedger(); syncCompanions(true); if (charFor(mn)) tell(mn, "💉 The futa serum's run its course, sugar. That cock's gone the way it came."); }
      if (p.milkFlavor && p.milkFlavor.until <= now) p.milkFlavor = null;
      // kryptonite: the farm talks to 'em like stock, and it wears off
      if (r.krypto){
        if (r.krypto.until <= now) kryptoEnd(mn, "done");
        else if (charFor(mn) && now - (r.krypto.told || 0) > (6 + Math.random() * 4) * 60000){ r.krypto.told = now; privateLine(mn, kFill(pickFresh("krypto:stock", KRYPTO_LINES.stock), mn), "chat"); }
      }
      // drowsy, now and then
      if (boosted(p, "sedate") && charFor(mn) && now - (p.sedTold || 0) > 9 * 60000 && Math.random() < 0.3){ p.sedTold = now; privateLine(mn, kFill(pickFresh("sed", SHOT_LINES.sedative), mn), "emote"); }
    }
    // the barn's gossip about a proprietor's weakness, every few hours, when they're here and there's an audience
    if (now >= (state.kryptoRumorAt || 0)){
      state.kryptoRumorAt = now + (CFG.SHOTS2.RUMOR_H[0] + Math.random() * (CFG.SHOTS2.RUMOR_H[1] - CFG.SHOTS2.RUMOR_H[0])) * 3600000;
      const here = (W.ChatRoomCharacter || []).map(c => c.MemberNumber).filter(m => m !== CFG.BOT_MEMBER);
      const props = here.filter(m => isProprietor(m) && kryptoHint(m) && !kryptoNow(m));
      if (props.length && here.length >= 3){ const t = props[Math.floor(Math.random() * props.length)]; emote(kFill(pickFresh("krypto:rumor", KRYPTO_LINES.rumor), t, { h: kryptoHint(t) })); }
    }
  }
  // ── a touch on somebody with a hair trigger (09-roleplay.js onBodyActivity) ──
  function shotTouch(tgt, src){
    const p = prodOf(tgt); if (!p || !boosted(p, "trigger") || tgt === src) return;
    arouse(tgt, 45);
    if (Math.random() < 0.3 && Date.now() - (p.trigTold || 0) > 60000){ p.trigTold = Date.now(); privateLine(tgt, "⚡ That touch nearly sets you off, " + plainName(tgt) + ". Hair trigger. Another one like that and you're gone.", "chat"); }
  }
  // flood: how much bigger a stud's load comes out
  const floodX = (sp) => (boosted(sp, "flood") ? 1 + 1.5 * boostLevel(sp, "flood") : 1);
  // a milk-flavour word for a milkin' line ("" when there isn't one)
  const FLAVOR_BIT = { strawberry: "It comes out pink and strawberry-sweet, like a milkshake.", chocolate: "It comes out pale brown and tastes like chocolate milk.",
    honey: "It comes out golden-tinged and honey-sweet.", vanilla: "It smells of vanilla and tastes like melted ice cream.",
    banana: "It comes out banana-sweet, thick as a smoothie.", caramel: "It tastes of caramel, rich and buttery." };
  function milkFlavorBit(mn){ const f = (prodOf(mn) || {}).milkFlavor; return f && f.until > Date.now() && FLAVOR_BIT[f.k] ? " " + FLAVOR_BIT[f.k] : ""; }

  // ── triggered injectors: somethin' happened to them, and somethin' they wear answers ──
  function shotTrigger(mn, kind){
    const C = charFor(mn), r = rec(mn); if (!C || !r || !(r.roles || []).length || !Array.isArray(C.Appearance) || quietNow(mn)) return;
    const p = prodOf(mn), now = Date.now(); p.toyAt = p.toyAt || {};
    for (const it of C.Appearance){
      if (!it || !it.Craft || !it.Asset || !it.Asset.Group || !/^Item/.test(it.Asset.Group.Name)) continue;
      const text = craftText(it); if (!text || !triggerOf(text).includes(kind)) continue;
      const key = "trig:" + kind + ":" + it.Asset.Group.Name; if (now < (p.toyAt[key] || 0)) continue;
      p.toyAt[key] = now + CFG.SHOTS2.TRIGGER_MIN * 60000;
      const dose = isRoulette(text) ? rouletteText(mn, text) : text;
      const ok = applyShot(mn, CFG.BOT_MEMBER, dose, { open: TRIGGER_OPEN[kind].replace(/%n/g, plainName(mn)).replace(/%c/g, itemName(it)), from: "your " + itemName(it) + "'s dose", heatH: 1, auto: true });
      if (ok) audit(CFG.BOT_MEMBER, "TRIGGERINJECT", mn + " " + kind + " " + itemName(it));
    }
  }
  // a roulette dose: somethin' random off the list their limits allow (the kryptonite word stays on, if it was there)
  function rouletteText(mn, text){
    const lim = String((rec(mn) || {}).limits || "");
    const ok = ROULETTE_POOL.filter(([w, k]) => !k || (k === "size" ? !/\b(size|growth|grow)/i.test(lim) : k === "sedat" ? !/\b(sedat|drug|sleep)/i.test(lim) : k === "hypno" ? !/\b(hypno|trance|mind)/i.test(lim) : k === "denial" ? !/\b(denial|chast|orgasm|edg)/i.test(lim) : !limitBlocks(mn, k)));
    const pick = ok.length ? ok[Math.floor(Math.random() * ok.length)][0] : "capacity";
    return pick + (kryptoHit(mn, text) ? " " + rec(mn).kryptonite.word : "");
  }
  // a drip: every few minutes, whatever timed effect it carries that's run out goes back in, quietly
  function shotDrip(mn, it, text){
    const p = prodOf(mn), tags = tagsIn(text), need = DRIP_KEEP.filter(([t, , on]) => tags.has(t) && !on(p, mn)).map(([, w]) => w);
    if (kryptoHit(mn, text) && !kryptoNow(mn)) need.push(rec(mn).kryptonite.word);
    if (!need.length) return;
    applyShot(mn, CFG.BOT_MEMBER, need.join(" "), { open: "The drip in the " + itemName(it) + " on " + plainName(mn) + " ticks over and keeps 'em topped up.", from: "your " + itemName(it) + "'s drip", heatH: 1, auto: true, quiet: true });
  }

  // ── ?myshots: what's workin' in you right now ──
  function myShotsText(mn){
    const r = rec(mn), p = prodOf(mn), now = Date.now(); if (!r || !p) return "That's for folks on the books, sugar.";
    const left = (t) => { const m = Math.ceil((t - now) / 60000); return m >= 90 ? Math.round(m / 60) + "h" : m + " min"; };
    const lv = (k) => (boostLevel(p, k) > 1 ? " (" + stackWord(boostLevel(p, k) - 1) + ")" : "");
    const B = [["milk", "🍼 Milk boosted"], ["semen", "💦 Cum boosted"], ["fert", "🥚 Fertility boosted"], ["eggs", "🥚 Any stud can leave a clutch"], ["hyper", "🤰 Hyper pregnancy"],
      ["contra", "🚫 No catchin'"], ["mpreg", "🍑 Mpreg"], ["flood", "🌊 Flood loads"], ["trigger", "⚡ Hair trigger"], ["sedate", "😴 Sedated"], ["twins", "👯 Twins next"], ["ripe", "🍑 Ripe: the next load takes"]];
    const out = B.filter(([k]) => boosted(p, k)).map(([k, l]) => l + lv(k) + " · " + left(p.boosts[k]));
    if (p.deniedUntil > now) out.push("🚫 Held at the edge · " + left(p.deniedUntil));
    if (r.futaShot && r.futaShot.until > now) out.push("🍆 Futa serum · " + left(r.futaShot.until));
    for (const t of p.tempSize || []) out.push("📏 " + ((CFG.SIZES[t.part] || {}).label || t.part) + " " + (t.d > 0 ? "grown" : "shrunk") + " for now · " + left(t.until));
    if (p.milkFlavor && p.milkFlavor.until > now) out.push("🍓 " + p.milkFlavor.k + " milk · " + left(p.milkFlavor.until));
    if (kryptoNow(mn)) out.push("💥 Your kryptonite · " + left(r.krypto.until));
    for (const f of activePotions(mn)) out.push("🧪 " + ((potionDef(f.id) || {}).name || f.id) + " · " + left(f.until));
    return "💉 WHAT'S IN YOU RIGHT NOW\n" + (out.length ? out.join("\n") : "Nothin'. Clean as a whistle, sugar.") + "\n\n?help shots lists every word a needle can carry.";
  }
  // a needle with nothin' the farm can read on it: say so (unless it's one of LSCG's)
  function shotUnread(by, tool, text){
    if (!tool || !tool.Craft || by === CFG.BOT_MEMBER || !SHOT_WORDS.test(text) || LSCG_WORDS.test(text)) return;
    tell(by, "💉 I couldn't read a farm word on " + itemName(tool) + ", sugar, so it did nothin' on the farm's side. ?help shots lists the words: lactation, fertility, udder growth, aphrodisiac, cum flood and the rest.");
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __shotsTick: () => { state.shots2At = 0; shotsMoreTick(); }, __shotTrigger: (m, k) => shotTrigger(m, k), __kryptoNow: (m) => kryptoNow(m), __applyShot: (t, b, x, h) => applyShot(t, b, x, h), __myShots: (m) => myShotsText(m) });
