  /* WHAT'S IN THIS FILE (10y5-cursed.js)
     • THE MYSTERY BOX (?mysterybox, or ?buy mysterybox: CFG.CURSE_BOX_PRICE ribbons). Anybody on the books can buy
       one for themselves. Inside is somethin' lovely that puts itself on (real gear, through their Companion) and
       does somethin' to them for as long as it stays:
         the Growin' Plug   a plug that swells a size every ten minutes till it's done
         the Hungry Belt    no cummin' while it's on, and it keeps them stirred up
         the Milkmaid's Cups  their milk comes in double and the cups drink it
         the Glutton's Funnel a bellyful down the throat every ten minutes
         the Hobble         a short chain at the ankles: slow steps
       One curse at a time. It comes off when its time's up; the safeword takes it off at once; staff: ?mysterybox lift <who>.
     • THE LIVIN' SUIT (a trap: ?spot set trap-suit). It lands on a subject as a patch and spreads, a stage an hour:
       thighs, hips, chest, arms, and at the last their mouth. Each stage is real gear. It feeds on their arousal,
       keeps them from cummin' once it has their hips, and every so often walks them somewhere of its own choosin'.
       It lets go after CFG.SUIT_HOURS. The safeword peels it off at once; staff: ?suit off <who>.
  */
  const zLine = (key, mn, v) => tFill(pickFresh("curse:"+key, CURSE_LINES[key]), mn, v);
  const CURSES = {
    plug:   { slot: mn => stopperFor(mn, "butt"), name: "Growin' Plug", mins: 60, what: "It swells a size every ten minutes.", limit: /\b(size|stretch|plug|anal)/i,
              desc: "A sleek black plug that seemed a sensible size going in. It isn't any more. Every ten minutes it swells a little fatter, and it will not come out until it's done." },
    belt:   { slot: () => "belt", name: "Hungry Belt", mins: 45, what: "No cummin', and it keeps you stirred.", limit: /\b(denial|chast|orgasm|edg)/i,
              desc: "A pretty filigree belt that locked itself the moment it touched skin. It hums against everything it covers, never quite enough, and it eats every orgasm before it starts." },
    cups:   { slot: () => "cups", name: "Milkmaid's Cups", mins: 60, what: "Your milk comes in double, and the cups drink it.", limit: /\b(milk|lactat)/i, can: mn => makesMilk(mn),
              desc: "Two silver cups that latched on by themselves and began to pull. Whatever they're doing in there, the udders behind them are filling twice as fast to keep up." },
    funnel: { slot: () => "funnel", name: "Glutton's Funnel", mins: 40, what: "A bellyful every ten minutes.", limit: /\b(feed|stuff|force|gag)/i, can: mn => !holeBlocked(mn, "mouth"),
              desc: "A gilded funnel that strapped itself between the teeth. Every ten minutes it pours another helping down, warm and thick, whether there's room or not." },
    hobble: { slot: () => "ropeFeet", name: "The Hobble", mins: 45, what: "Short steps.", limit: /\b(hobbl|immobil|chain)/i,
              desc: "Two dainty cuffs joined by a hand's length of chain. They looked like anklets in the box. Every step now is a tiny, swaying shuffle." },
  };
  function cursedOn(mn){ const r = rec(mn); return !!(r && r.curse && r.curse.until > Date.now()); }
  function openBox(mn){
    const r = rec(mn), lim = String(r.limits || "");
    const can = Object.keys(CURSES).filter(k => !CURSES[k].limit.test(lim) && (!CURSES[k].can || CURSES[k].can(mn)) && CURSES[k].slot(mn) && !(r.gear && r.gear[CURSES[k].slot(mn)]));
    if (!can.length) return null;
    const kind = can[Math.floor(Math.random()*can.length)], C = CURSES[kind], slot = C.slot(mn), p = prodOf(mn), mins = tmin(mn, C.mins);
    r.curse = { kind, slot, name: C.name, what: C.what, until: Date.now() + mins*60000, next: Date.now() + 10*60000 };
    gearOn(mn, slot, C.name, C.desc, mins, "curse");
    if (kind === "belt") p.deniedUntil = Math.max(p.deniedUntil || 0, r.curse.until);
    if (kind === "cups") addBoost(p, "milk", mins*60000, 1);
    if (kind === "hobble") r.gluedUntil = Math.max(r.gluedUntil || 0, r.curse.until);
    saveLedger(); audit(mn, "CURSE", kind); syncCompanions(true);
    emote("🎁 "+zLine("open_"+kind, mn), mn);
    tell(mn, "🎁 It's the "+C.name+", sugar. "+C.what+" It stays "+mins+" minutes."+(hasCompanion(mn) ? " With \"Farm can put real gear on me\" on, you're wearin' it for real." : "")+" Your safeword takes it off.");
    return kind;
  }
  function cursedOff(mn, how){
    const r = rec(mn); if (!r) return false;
    let did = false;
    if (r.curse){
      const c = r.curse, p = prodOf(mn); r.curse = null; did = true;
      gearOff(mn, null, "curse");
      if (c.kind === "belt" && p) p.deniedUntil = Math.min(p.deniedUntil || 0, Date.now());
      if (c.kind === "hobble") r.gluedUntil = 0;
      if (c.kind === "plug" && c.grew && c.was){ const part = c.slot === "plug" ? "butt" : "vulva"; if (CFG.SIZES[part]) setSize(mn, part, c.was + 1, false); }   // it leaves them a size looser than it found them, for a while
      if (how !== "safe" && charFor(mn)) emote("🎁 "+zLine("off", mn, { c: c.name }), mn);
    }
    if (r.suit){ suitOff(mn, how); did = true; }
    if (did){ saveLedger(); syncCompanions(true); }
    return did;
  }

  // ── the livin' suit ──
  const SUIT_STAGES = [
    { where: "a patch on your thigh" },
    { where: "both thighs, to the hip", slot: "legs", name: "Living Suit (legs)", items: ["Slime"], desc: "Glossy black living latex, grown up both legs to the hip, warm as skin and tighter. It ripples when they walk, and it is still spreading." },
    { where: "your hips and everything between", slot: "belt", name: "Living Suit (hips)", desc: "The suit has closed over hips and groin in a seamless black skin, with a soft thick root of itself pushed up inside. It squeezes when they get close, and holds them there." },
    { where: "your chest", slot: "cups", name: "Living Suit (chest)", desc: "Living latex moulded over both breasts, kneading in slow waves, with a wet little mouth of itself sealed over each nipple." },
    { where: "your arms, to the fingertips", slot: "arms", name: "Living Suit (arms)", items: ["Slime"], desc: "The suit has run down both arms and webbed the fingers together. Their hands are its hands now, and it does not let them touch themselves." },
    { where: "all of you, mouth and all", slot: "lips", name: "Living Suit (mouth)", desc: "The last of it: a smooth black sheath over the face from the nose down, and a tongue of itself in the mouth. Every inch of them is inside it now." },
  ];
  const SUIT_COLOR = "#1A1A1F";
  function suitStage(s){ return Math.max(0, Math.min(SUIT_STAGES.length - 1, Math.floor((Date.now() - s.since) / (CFG.SUIT_HOURS*3600000 / SUIT_STAGES.length)))); }
  function suitOnNow(mn){ const r = rec(mn); return !!(r && r.suit && r.suit.until > Date.now()); }
  function suitGear(mn){
    const r = rec(mn), st = suitStage(r.suit), out = [];
    for (let i = 1; i <= st; i++){ const G = SUIT_STAGES[i]; out.push(Object.assign({ slot: G.slot, name: G.name, desc: G.desc, always: false, color: SUIT_COLOR, until: r.suit.until }, G.items ? { items: G.items } : {})); }
    return out;
  }
  function suitOff(mn, how){
    const r = rec(mn), p = prodOf(mn); if (!r || !r.suit) return;
    const had = suitStage(r.suit); r.suit = null;
    if (p) p.deniedUntil = Math.min(p.deniedUntil || 0, Date.now());
    saveLedger(); audit(CFG.BOT_MEMBER, "SUIT", mn+" off ("+(how || "done")+")"); syncCompanions(true);
    if (how !== "safe" && charFor(mn)) emote("🖤 "+zLine(how === "staff" ? "suitPeeled" : "suitOff", mn), mn);
  }
  MORE_TRAPS.suit = function(mn){
    trapRun(mn, "suit", CURSE_LINES.suitTrap, () => {
      const r = rec(mn), now = Date.now();
      r.suit = { since: now, until: now + tmin(mn, CFG.SUIT_HOURS)*3600000, told: 0, walkAt: now + CFG.SUIT_WALK_MIN*60000 };
      corrupt(mn, 3, "suit");
      tell(mn, "🖤 That patch on your thigh is alive, sugar, and it's growin'. Over the next "+tmin(mn, CFG.SUIT_HOURS)+" hours it'll take your legs, your hips, your chest, your arms, and last your mouth. It feeds on how worked up you are, it won't let you cum once it has your hips, and it has its own ideas about where you walk. Your safeword peels it off.");
    });
  };
  Object.assign(TRAP_KINDS, {
    suit: { icon: "🖤", what: "a patch of livin' latex that spreads over you for hours, stage by stage, and takes you where it likes", limit: /\b(latex|suit|encas|parasit)/i },
  });
  TRAP_NEEDS.suit = mn => suitOnNow(mn) ? "it already has them" : null;

  function cursedTick(){
    const now = Date.now();
    for (const [k, r] of Object.entries(L.people)){
      const mn = parseInt(k, 10);
      // a curse runnin' out, or doin' what it does
      if (r.curse){
        const c = r.curse, p = prodOf(mn);
        if (c.until <= now){ cursedOff(mn, "time"); }
        else if (charFor(mn) && now >= c.next && !quietNow(mn)){
          c.next = now + 10*60000;
          if (c.kind === "plug"){
            const part = c.slot === "plug" ? "butt" : "vulva";
            if (CFG.SIZES[part] && hasPart(mn, part)){ if (!c.was) c.was = sizeOf(mn, part); setSize(mn, part, sizeOf(mn, part) + 1, false); c.grew = (c.grew || 0) + 1; }
            emote("🎁 "+zLine("tick_plug", mn, { h: part === "butt" ? "ass" : "pussy" }), mn); arouse(mn, 15);
          }
          if (c.kind === "belt"){ privateLine(mn, zLine("tick_belt", mn), "emote"); arouse(mn, 30, 94); }
          if (c.kind === "cups" && p && makesMilk(mn)){ const got = drainMilk(mn, p.milk * 0.7); if (got >= 5) emote("🎁 "+zLine("tick_cups", mn, { ml: ml(got) }), mn); }
          if (c.kind === "funnel" && p){ const kept = trapFill(mn, "mouth", CFG.AUTOFEED_ML, CFG.TRAP_OVERFULL); if (kept >= 1){ p.milk = Math.min(milkCap(mn), p.milk + kept * CFG.PROD.SWALLOW_TO_MILK); emote("🎁 "+zLine("tick_funnel", mn, { ml: ml(kept) }), mn); } }
          saveLedger();
        }
      }
      // the suit: growin', feedin', walkin'
      if (r.suit){
        const s = r.suit, p = prodOf(mn);
        if (s.until <= now){ suitOff(mn, "done"); continue; }
        if (!charFor(mn)) continue;
        const st = suitStage(s);
        if (st > (s.told || 0)){
          s.told = st; saveLedger();
          emote("🖤 "+zLine("suit"+st, mn), mn); arouse(mn, 20, st >= 2 ? 94 : 100);
          if (st >= 2 && p) p.deniedUntil = Math.max(p.deniedUntil || 0, s.until);
          corrupt(mn, 1, "suit"); syncCompanions(true);
        }
        if (quietNow(mn) || heldByTrap(mn)) continue;
        if (now >= (s.feedAt || 0)){ s.feedAt = now + 6*60000; arouse(mn, 12 + 4*st, st >= 2 ? 94 : 100); if (Math.random() < 0.5) privateLine(mn, zLine("suitFeed", mn), "emote"); }
        if (st >= 2 && now >= (s.walkAt || 0) && !r.penned && !r.benched && !(p && p.stall)){
          s.walkAt = now + CFG.SUIT_WALK_MIN*60000*(0.7 + Math.random()*0.6);
          const spots = Object.keys(L.spots || {}).filter(n => !/^(safe|rescue|staff|summon|speaker|hunt|gauntlet)/.test(n));
          const to = spots[Math.floor(Math.random()*spots.length)];
          if (to){ saveLedger(); emote("🖤 "+zLine("suitWalk", mn), mn); later(() => { if (suitOnNow(mn) && charFor(mn)) lead(mn, L.spots[to], false, "by the suit"); }, 3000); }
        }
      }
    }
  }
  function cursedCommand(cmd, sender, args, R){
    const r = rec(sender), a0 = String(args[0] || "").toLowerCase();
    if (cmd === "suit"){
      if (a0 === "off" && isStaff(sender)){
        const t = resolveTarget(args[1]);
        if (!t || !suitOnNow(t)){ R("Peel it off who, sugar? ?suit off <who>."); return; }
        suitOff(t, "staff"); R("🖤 Peeled. "+plainName(t)+" is back in their own skin."); return;
      }
      R(suitOnNow(sender) ? "🖤 It has "+SUIT_STAGES[suitStage(r.suit)].where+", sugar. It lets go in about "+Math.max(1, Math.round((r.suit.until - Date.now())/3600000))+" hours. Your safeword peels it off."
                          : "🖤 The livin' suit is a trap (trap-suit), sugar. You'd know if it had you."); return;
    }
    // ?mysterybox
    if (a0 === "lift"){
      if (!isStaff(sender)){ R("Liftin' a curse is staff work, sugar. Your own safeword does it for you."); return; }
      const t = resolveTarget(args[1]);
      if (!t || !cursedOn(t)){ R("Lift it off who, sugar? ?mysterybox lift <who>."); return; }
      const c = rec(t).curse; rec(t).curse = Object.assign(c, { until: Date.now() }); cursedTick(); R("🎁 Lifted off "+plainName(t)+"."); return;
    }
    if (!r || !r.roles || !r.roles.length){ R("That's for folks on the books, sugar."); return; }
    if (cursedOn(sender)){ R("🎁 You're still wearin' the last one, sugar: the "+r.curse.name+", "+Math.ceil((r.curse.until - Date.now())/60000)+" more minutes."); return; }
    if (/\b(curse|mystery)/i.test(r.limits || "")){ R("Your limits rule that out, sugar."); return; }
    if (ribbonsOf(sender) < CFG.CURSE_BOX_PRICE){ R("A mystery box is "+CFG.CURSE_BOX_PRICE+" ribbons, sugar, and you haven't got them."); return; }
    spendRibbons(sender, CFG.CURSE_BOX_PRICE, "a mystery box");
    if (!openBox(sender)){ earnRibbons(sender, CFG.CURSE_BOX_PRICE, "an empty box", 0, true); R("🎁 You open it and it's empty, sugar. Nothin' in there that'd fit on you just now. Ribbons back."); }
  }

  const CURSE_LINES = {
    open_plug: ["%n lifts the lid. Inside, on velvet, is a sleek black plug. It's warm. It's in their hand, and then somehow it isn't in their hand any more, and their eyes go wide.",
                "The box holds one neat little plug. %n barely has time to think that doesn't look so bad before it's seated itself to the hilt and given a first, slow swell."],
    open_belt: ["A belt of silver filigree, fine as lace. %n holds it up to their hips to see, and it closes with a click that has no keyhole to go with it.",
                "%n opens the box on a pretty jewelled belt. It jumps like a snake, wraps their hips, and locks. Somethin' inside it starts to hum."],
    open_cups: ["Two little silver cups on a chain. %n turns one over to look, and both of them leap for their chest and latch on with a wet kiss of suction.",
                "The box has a pair of milkmaid's cups in it, cold and bright. They're on %n's teats before the lid's stopped swingin'."],
    open_funnel: ["A gilded funnel on a strap. %n says \"what's this f\" and gets no further: it's between their teeth and buckled behind their head.",
                  "%n opens their mouth to laugh at what's in the box. That was all it wanted."],
    open_hobble: ["Two delicate anklets on a short chain. %n tries one on. The other one closes by itself.",
                  "%n lifts a pair of dainty cuffs out of the box. They slip from their fingers, and snap round both ankles on the way down."],
    tick_plug: ["%n stops dead, mouth open. The plug in their %h has just grown again, a slow fat swell that pushes them wider round it.",
                "A soft click, and %n's knees dip: the thing in their %h is a size bigger than it was a minute ago, and it isn't finished.",
                "%n whimpers and shifts their feet apart. It's swellin' again. Their %h is stretched tight round it and it just keeps comin'."],
    tick_belt: ["The belt wakes up. A slow buzz, right where you need it, climbin', climbin', and then nothin'. It's done this six times.",
                "It hums you right to the edge and stops with a little click. You'd swear it was laughin'."],
    tick_cups: ["The silver cups on %n pull long and deep, and %ml disappears up into them. Their udders are already tight again behind it.",
                "%n moans as the cups drink them down: %ml, gone, and more wellin' up to replace it."],
    tick_funnel: ["The funnel in %n's mouth gurgles and tips another %ml down their throat. They swallow, and swallow, eyes waterin'.",
                  "Feedin' time again. %ml of somethin' warm and heavy pours into %n, and their belly rounds out a little more."],
    off: ["The %c loosens, slides free of %n, and is just a pretty trinket again. They breathe out for the first time in an hour.",
          "With a soft click the %c lets go of %n and drops into the straw, harmless-lookin' as ever."],
    suitTrap: [
      ["Somethin' drips from the rafters onto %n's thigh: a spot of black, glossy as oil, the size of a coin.", "%n brushes against a post, and a smear of somethin' black and shinin' comes away on their thigh."],
      ["They try to wipe it off. It doesn't smear. It's warm, and it moves under their thumb, and it's a little bigger than it was.", "It isn't wet. It's skin-warm and smooth, and it has edges that are creepin' outward as %n watches."],
      ["%n scrubs at it with a handful of straw. The patch ripples, pleased, and spreads another inch up their leg. It's alive, and it likes them.",
       "Rubbin' only seems to feed it. The black is the size of a hand now, hugged to %n's thigh like it grew there, and where it covers them the skin tingles."]],
    suit1: ["The black has both of %n's legs. It ran down to the toes and up to the hips in a smooth, seamless skin of livin' latex, tight as a held breath, and it squeezes them when they move.",
            "%n's legs are gone to it: glossy black from hip to heel, warm, clingin', flexin' on its own. They can feel it tastin' their skin."],
    suit2: ["It closes between %n's legs. A slick seam seals over everything they've got there, and somethin' thick and soft pushes up inside and settles. They couldn't get a finger under it if they tried, and they have tried.",
            "The suit takes %n's hips. It flows into every fold, plugs them front and back with a gentle fat root of itself, and begins, very slowly, to stroke."],
    suit3: ["It climbs %n's belly and swallows their chest. Each breast is cupped, lifted and kneaded in slow circles, and a small wet mouth forms over each nipple and starts to suckle.",
            "Black latex wells up over %n's ribs and closes over their tits. It moulds to them, squeezes, and somethin' inside it latches on to both teats at once."],
    suit4: ["Down %n's arms to the fingertips, weldin' the fingers together into smooth black mitts. They can't undo a buckle now. They can't touch themselves. Only it can.",
            "The suit sleeves %n's arms and seals their hands. Then it folds their wrists behind their back, to show them it can."],
    suit5: ["The last of it rises up %n's throat, over their chin, and seals across their mouth. A soft tongue of it slides between their lips. Everything below the eyes is suit now, shinin' and movin', and somewhere inside it %n is moanin'.",
            "It finishes. A glossy black skin covers %n from the bridge of the nose to the soles of their feet, breathin' with them, squeezin' them, feedin' on every shiver. There's no edge left to peel."],
    suitFeed: ["The suit tightens all over, a long slow squeeze, and drinks the shiver that goes through you.", "It's strokin' you again, everywhere it covers, just enough to keep you wet and never enough to finish.",
               "You're so worked up you can hardly think. That's how it likes you. That's what it eats.", "The root inside you flexes, lazy. You clench on it before you can stop yourself, and it purrs."],
    suitWalk: ["%n's legs start walkin'. %n didn't tell them to. The suit has somewhere it wants to be.", "The livin' suit flexes, and %n is turned round and marched off across the yard, arms held neat at their sides, protestin' the whole way.",
               "%n takes a step they didn't mean to take, and then another. It's steerin' them."],
    suitOff: ["The suit has had its fill. It goes slack on %n, splits down the back like a seedpod, and slides off them in one glossy piece, leavin' them pink, slick and tremblin' in the air.",
              "It lets go of %n all at once: mouth, hands, the roots inside, and pools at their feet. Their own skin feels strange and far too loose."],
    suitPeeled: ["It takes two farmhands and a bucket of somethin' cold to get the suit to let go of %n. It comes away a strip at a time, clingin', and the roots inside come out last and slowest."],
  };
