  /* WHAT'S IN THIS FILE (10u7-traps-3.js)
     Ten more traps (Laynie, Oct 15: "i love those traps"), and the messes the farm's equipment leaves (Laynie: "messes for the
     farm equipment anyway, just no feces ones :3 but creampies, slime, syrups and such would be awesome").
       trap-auction    up on the auction block: three minutes of bids, and the winner walks them through three traps (?lend)
       trap-maze       the corn maze: find the way out (a maze-exit spot) before the thing in the corn finds them
       trap-honey      the honey pot: drenched in honey (or maple, chocolate or strawberry syrup) and licked clean
       trap-incubator  the heat lamp: a clutch they carry comes bigger and sooner; carryin' nothin', broody and ripe for it
       trap-collection studs: strapped down on the collection bench and milked into the vat, all of it
       trap-wheel      the breedin' wheel: three spins, and a different stud's cock every time
       trap-stocks     the fair stocks, and the whole fair queuin' up with cream pies
       trap-kissgate   stuck halfway through the kissin' gate, and the toll to pass is them
       trap-windmill   tied to the windmill sails, turnin' slow over the whole farm; dizzy after
       trap-mudpit     the mud pit, for two: it pulls in a second subject nearby to wrestle, and the winner has the loser
     MESSES: a trap's equipment leaves its mark in its own colour (the game's Splatters, through the Companion with
     "Farm can mark my body" on): cream, honey, syrups, slime, milk, mud, mash. ?wash takes it all off.
     %n name · %c the cock, or the other wrestler · %h the hole · %ml how much · %x a word (the syrup, the count)
  */
  const MESS = { cake: "#FFD8E6", cream: "#FFF4DC", honey: "#E0A030", maple: "#8B4A1C", chocolate: "#4A2A18", strawberry: "#E04A6A",
                 milk: "#F7F7F0", slime: "#5FAE3A", mud: "#6B4A2B", mash: "#D8C08A" };
  // which mess each piece of the farm's equipment leaves, and where (old traps and new)
  const MESS_BY_TRAP = {
    milker: ["milk", ["chest"]], cups: ["milk", ["chest"]], carousel: ["milk", ["chest", "tummy"]], chute: ["mash", ["face", "chest"]],
    pump: ["cream", ["tummy"]], plow: ["mud", ["tummy", "face"]], mudpit: ["mud", ["face", "chest", "tummy"]], stocks: ["cream", ["face", "forehead", "chest"]],
    vines: ["slime", ["tummy"]], saddle: ["cream", ["tummy"]], wheel: ["cream", ["tummy", "chest"]], scarecrow: ["cream", ["tummy", "chest"]],
    crate: ["cream", ["tummy"]], kissgate: ["cream", ["face", "tummy"]], collection: ["cream", ["tummy"]],
  };
  function trapMess(mn, kind, what){
    try {
      let m = what ? [what, ["face", "chest", "tummy"]] : MESS_BY_TRAP[kind];
      if (kind === "stocks" && Math.random() < 0.5) m = ["cake", m[1]];   // some of the pies are cake
      if (!m || (!MESS[m[0]] && m[0] !== "cum")) return false;
      return bodyMark(mn, Object.assign({ splat: m[1], mess: m[0] }, MESS[m[0]] ? { color: MESS[m[0]] } : {}));   // (cum keeps the game's own white splatters)
    } catch(e){ return false; }
  }
  Object.assign(TRAP_KINDS, {
    auction:    { icon: "🔨", what: "the auction block: three minutes of bids, and the winner walks you through three traps", limit: /\b(auction|sold|sale|humiliat)/i },
    maze:       { icon: "🌽", what: "the corn maze, and somethin' in the corn huntin' you", limit: /\b(hunt|chase|maze|monster)/i },
    honey:      { icon: "🍯", what: "the honey pot: drenched in honey or syrup and licked clean", limit: /\b(honey|syrup|food|messy|lick)/i },
    incubator:  { icon: "💡", what: "the heat lamp: a bigger clutch, sooner, or broody and ripe for one", limit: /\b(eggs?|ovipos|heat|brood)/i },
    collection: { icon: "🧪", what: "for studs: the collection bench, milked into the vat", limit: /\b(milk|drain|machine)/i },
    wheel:      { icon: "🎡", what: "the breedin' wheel: three spins, a different stud every time", limit: /\b(breed|gang|anthro|beast)/i },
    stocks:     { icon: "🥧", what: "the fair stocks, and a queue of folks with cream pies", limit: /\b(stocks|pillory|messy|food|humiliat)/i },
    kissgate:   { icon: "🚪", what: "stuck in the kissin' gate, and the toll to pass is you", limit: /\b(stuck|public|free ?use|gang)/i },
    windmill:   { icon: "🌬️", what: "tied to the windmill sails, turnin' slow over the farm", limit: /\b(suspen|rope|spin|dizz)/i },
    mudpit:     { icon: "🤼", what: "the mud pit, with another subject: wrestle, and the winner has the loser", limit: /\b(mud|wrestl|filth|fight)/i },
  });
  ANTHRO.maze = { sire: -23, name: "the thing in the corn", type: "canine", loads: 2, ml: 220, hold: 6, hole: "vulva", bonus: 1.5, where: "the middle of the maze" };
  ANTHRO.kissgate = { sire: ANON_STUD, name: "folk passin' through", type: "human", loads: 3, ml: 100, hold: 8, hole: "vulva", bonus: 1.2, where: "the kissin' gate" };
  const WHEEL_SIRE = -24;
  // a wrestlin' partner for the mud pit: another subject close by that a trap could take right now
  function canWrestle(o){
    const r = rec(o), now = Date.now(); if (!r || !isSubject(o) || !charFor(o)) return false;
    if (r.trapsOff || (r.trapSkip || []).includes("mudpit") || (r.trapQuiet || 0) > now || quietNow(o)) return false;
    const lim = String(r.limits || ""); if (/\btraps?\b/i.test(lim) || TRAP_KINDS.mudpit.limit.test(lim)) return false;
    if (r.trapWait || r.penned || benchedNow(o) || stockedNow(o) || (prodOf(o) && prodOf(o).stall) || (state.trapRuns && state.trapRuns.has(o))) return false;
    return true;
  }
  function mudPartner(mn){
    const p = posOf(mn); if (!p) return null;
    const near = o => { const q = posOf(o); return !!q && Math.max(Math.abs(q.X - p.X), Math.abs(q.Y - p.Y)) <= 6; };
    return Object.keys(L.people).map(Number).find(o => o !== mn && canWrestle(o) && near(o)) || null;
  }
  Object.assign(TRAP_NEEDS, {
    collection: mn => !makesSemen(mn) ? "no cock to collect from" : !seedMilkable(mn) ? "they've said ?milkable seed off" : null,
    mudpit: mn => mudPartner(mn) ? null : "nobody close by to wrestle",
    auction: mn => state.lend ? "somebody's already on the block" : null,
  });
  const trap3 = (kind, key, mn, v) => tFill(pickFor(mn, "trap:"+kind+":"+key, TRAPS3_LINES[kind][key]), mn, v);
  Object.assign(MORE_TRAPS, {
    auction(mn){
      trapHold(mn, 3, "the auction block");
      trapRun(mn, "auction", TRAPS3_LINES.auction.beats, () => {
        if (state.lend){ emote("🔨 "+trap3("auction", "busy", mn), mn); return; }
        state.lend = { mn, stage: "bids", until: Date.now() + CFG.LEND_BID_S*1000, bids: [] };
        announce("🔨 "+trap3("auction", "open", mn));
        tell(mn, "🔨 You're on the block, sugar. For "+Math.round(CFG.LEND_BID_S/60)+" minutes folks can ?bid ribbons on you, and whoever bids highest picks three traps to walk you through. You keep half the money. Your safeword gets you down.");
      });
    },
    maze(mn){
      const start = L.spots && L.spots["maze-start"], exit = L.spots && L.spots["maze-exit"];
      if (start && exit){
        trapRun(mn, "maze", TRAPS3_LINES.maze.lost, () => {
          teleport(mn, start, true);
          rec(mn).maze = { until: Date.now() + 5*60000, at: Date.now() };
          tell(mn, "🌽 You're in the corn maze, sugar, and somethin' in here has your scent. Find the way out (the maze-exit spot) inside five minutes, or it finds you.");
        });
      } else anthroScene(mn, "maze");   // no maze laid out: the hunt plays out and it catches them
    },
    honey(mn){
      const kinds = ["honey", "honey", "maple", "chocolate", "strawberry"], k = kinds[Math.floor(Math.random()*kinds.length)];
      const v = { x: { honey: "honey", maple: "maple syrup", chocolate: "chocolate syrup", strawberry: "strawberry syrup" }[k] };
      trapHold(mn, 4, "the honey pot");
      trapRun(mn, "honey", TRAPS3_LINES.honey.beats, () => {
        trapMess(mn, "honey", k);
        const r = rec(mn); r.gluedUntil = Math.max(r.gluedUntil || 0, Date.now() + 5*60000); r.sweet = (r.sweet || 0) + 1;
        emote("🍯 "+trap3("honey", "end", mn, v), mn);
        arouse(mn, 30); face(mn, "edged", 60);
      }, v);
    },
    incubator(mn){
      trapHold(mn, 3, "the incubator lamp");
      const p = prodOf(mn), carrying = !!(p && p.eggs && p.eggs.n);
      trapRun(mn, "incubator", TRAPS3_LINES.incubator.beats.concat([carrying ? TRAPS3_LINES.incubator.eggs : TRAPS3_LINES.incubator.empty]), () => {
        const now = Date.now(), v = {};
        if (p.eggs && p.eggs.n){
          p.eggs.n = Math.min(CFG.EGG_MAX, Math.round(p.eggs.n * 1.5));
          p.eggs.layAt = Math.min(p.eggs.layAt || now, now + 30*60000);
          v.x = String(p.eggs.n);
          emote("💡 "+trap3("incubator", "endEggs", mn, v), mn);
        } else {
          if (!limitBlocks(mn, "breed")) addBoost(p, "fert", 6*3600000, 1);
          if (!limitBlocks(mn, "heat")) startHeat(mn, BOTMN(), 1);
          emote("💡 "+trap3("incubator", "endEmpty", mn), mn);
        }
        arouse(mn, 15); saveLedger();
      });
    },
    collection(mn){
      trapHold(mn, 5, "the collection bench");
      trapRun(mn, "collection", TRAPS3_LINES.collection.beats, () => {
        const p = prodOf(mn), got = drainSemen(mn, p.semen);
        try { vatAdd(mn, got); } catch(e){}
        p.pentUp = false;
        emote("🧪 "+trap3("collection", "end", mn, { ml: ml(got) }), mn);
        face(mn, "milked", 60); arouse(mn, 20);
      });
    },
    wheel(mn){
      const r = rec(mn), hole = r.breedable && !limitBlocks(mn, "breed") ? openHole(mn, "vulva") : null, v = { h: hole && hole !== "mouth" ? TRAP_HOLE[hole] : "" };
      const types = Object.keys(CFG.PENIS_TYPES).filter(t => t !== "double"), spun = [0, 1, 2].map(() => types[Math.floor(Math.random()*types.length)]);
      const L3 = TRAPS3_LINES.wheel, label = t => CFG.PENIS_TYPES[t].label;
      // each spin brings its own cock: the line for that spin is written with it
      const spins = spun.map((t, i) => (v.h ? L3.spinIn : L3.spinOver).map(line => line.replace(/%c/g, label(t)).replace(/%i/g, ["First", "Second", "Third"][i])));
      trapHold(mn, 5, "the breedin' wheel");
      trapRun(mn, "wheel", [L3.strap].concat(spins), () => {
        let total = 0, took = null;
        for (const t of spun){
          const load = (150 + Math.random()*120) * (CFG.PENIS_TYPES[t].loadX || 1);
          if (v.h){ total += trapFill(mn, hole, load, CFG.TRAP_OVERFULL); tally(mn); } else total += load;
        }
        v.ml = ml(total);
        if (v.h && r.fertile && canCatchIn(mn, hole)) took = rollConception(mn, WHEEL_SIRE, total, 1.5, hole);
        emote("🎡 "+trap3("wheel", v.h ? "end" : "endOver", mn, v)+(took === "new" ? " "+tFill(pickFor(mn, "trap:anthro:took", ANTHRO_TOOK), mn, v) : ""), mn);
        if (v.h) splatBody(mn, hole);
        face(mn, v.h ? "bred" : "afterglow", 90); arouse(mn, 40);
      }, v);
    },
    stocks(mn){
      trapHold(mn, 4, "the fair stocks");
      trapRun(mn, "stocks", TRAPS3_LINES.stocks.beats, () => {
        const r = rec(mn), n = 6 + Math.floor(Math.random()*10);
        r.pied = (r.pied || 0) + n;
        emote("🥧 "+trap3("stocks", "end", mn, { x: String(n) }), mn);
        arouse(mn, 10);
      });
    },
    kissgate(mn, spot){ anthroScene(mn, "kissgate", spot); },
    windmill(mn){
      trapHold(mn, 4, "the windmill sails");
      trapRun(mn, "windmill", TRAPS3_LINES.windmill.beats, () => {
        const r = rec(mn); r.gluedUntil = Math.max(r.gluedUntil || 0, Date.now() + 3*60000);
        emote("🌬️ "+trap3("windmill", "end", mn), mn);
        face(mn, "trance", 60); arouse(mn, 10);
      });
    },
    mudpit(mn){
      const o = mudPartner(mn); if (!o) return;
      const win = Math.random() < 0.5 ? mn : o, lose = win === mn ? o : mn, v = { c: plainName(o) };
      const r = rec(lose), hole = r.breedable && !limitBlocks(lose, "breed") ? openHole(lose, "vulva") : null;
      trapHold(mn, 5, "the mud pit"); trapHold(o, 5, "the mud pit");
      tell(o, "🤼 The mud pit's got you too, sugar: "+plainName(mn)+" sprang it and pulled you in. Wrestle! The winner has the loser. Your safeword gets you out.");
      const L3 = TRAPS3_LINES.mudpit, wv = { c: plainName(win === mn ? o : mn) };
      trapRun(mn, "mudpit", L3.beats.concat([L3[win === mn ? "youWin" : "youLose"]]), () => {
        trapMess(o, "mudpit");
        let got = 0;
        if (hole && makesSemen(win)){
          const sp = prodOf(win), load = drainSemen(win, Math.max(sp.semen * CFG.PROD.LOAD_SHARE, Math.min(sp.semen, CFG.PROD.MIN_LOAD)));
          got = trapFill(lose, hole, load, CFG.TRAP_OVERFULL); tally(lose);
          if (got > 0 && rec(lose).fertile && canCatchIn(lose, hole)) rollConception(lose, win, got, 1.2, hole);
          try { parasiteLoad(win, lose, hole, got); addonsEmit("bred", win, lose, hole, got, null); } catch(e){}
        }
        const ev = { c: plainName(win), x: plainName(lose), h: hole ? TRAP_HOLE[hole] : "", ml: ml(got) };
        emote("🤼 "+tFill(pickFor(lose, "trap:mudpit:end", got > 0 ? L3.endBred : L3.endPinned), lose, ev), lose);
        face(win, "afterglow", 60); face(lose, got > 0 ? "bred" : "edged", 90); arouse(mn, 30); arouse(o, 30);
        trapFree(o);
        later(() => earnRibbons(win, 1, "winnin' in the mud pit"), 2000);
      }, v);
    },
  });
  // the corn maze: out the exit in time, or caught
  function mazeTick(){
    const now = Date.now(), exit = L.spots && L.spots["maze-exit"];
    for (const [k, r] of Object.entries(L.people)){
      const z = r.maze; if (!z) continue;
      const mn = parseInt(k, 10);
      if (!charFor(mn) || (r.trapQuiet || 0) > now){ r.maze = null; continue; }
      if (exit && onSpot(mn, "maze-exit", 1)){ r.maze = null; saveLedger(); emote("🌽 "+trap3("maze", "escaped", mn), mn); later(() => earnRibbons(mn, 1, "findin' your way out of the corn maze"), 2000); continue; }
      if (now >= z.until){ r.maze = null; saveLedger(); anthroScene(mn, "maze"); continue; }
      if (now - (z.at || 0) > 75000){ z.at = now; privateLine(mn, trap3("maze", "near", mn), "emote"); }
    }
  }

  const TRAPS3_LINES = {
    auction: {
      beats: [
        ["A chain catches %n round the waist and hauls them up three steps onto a wooden block in the yard. A bell rings. Folks start driftin' over.",
         "%n trips onto a low wooden stage, and a collar on a post snaps shut round their neck. The farm girl climbs up beside them with a gavel.",
         "Cuffs close on %n's wrists and lift them up over their head, and they're turned to face the yard. A sign goes up: LOT 1."],
        ["\"What am I bid for this fine animal?\" the farm girl hollers, and turns %n round slow so everybody can see every bit of them.",
         "The farm girl pats %n's flank and points out their best features to the crowd, one by one, in loud and loving detail.",
         "{t}\"Look at the udder on this one,\" the farm girl calls, and hefts %n's tits for the crowd.",
         "{c}\"And a stud, too,\" the farm girl calls, and lifts %n's cock on the end of her gavel for the crowd to see."],
      ],
      open: ["%n is up on the auction block, y'all! Highest bid takes them through three traps of their choosin'. ?bid your ribbons. Three minutes.",
             "LOT 1 on the block: %n, sound in wind and limb. ?bid now, folks: the winner walks them through three traps.",
             "Gather round! %n is for sale for the evenin'. ?bid your ribbons, and the highest bidder picks three traps for them."],
      busy: ["The farm girl looks at %n, looks at the queue already at the block, and lets them down. \"Next time, sugar.\""],
    },
    maze: {
      lost: [
        ["The tall corn closes behind %n like a door, and the path they came in by isn't there any more.",
         "%n steps between the cornstalks to look, and the maze swallows them. Green walls, every way.",
         "A gate in the corn swings shut behind %n with a clack. The maze has them now."],
        ["Somewhere off in the corn, somethin' big starts to move, rustlin' the stalks, sniffin'.",
         "A low growl rolls through the corn. Then the rustlin' starts, comin' closer, then further, then closer.",
         "The stalks shiver a row over, and %n hears breathin' that isn't theirs."],
      ],
      near: ["The corn rustles right behind you. It's close.", "You hear it sniffin', one row over. Keep movin'.", "Somethin' brushes the stalks beside you. Run, sugar.",
             "A growl, low and close. It knows exactly where you are."],
      escaped: ["%n bursts out of the corn maze at the exit, breathless and laughin', with the growls fadin' behind them.",
                "%n finds the way out of the maze just as the stalks behind them part. Free, by a whisker."],
    },
    honey: {
      beats: [
        ["A bucket tips from a beam over %n's head and they're drenched in %x, thick and warm, from their hair to their toes.",
         "%n steps on a board that tips them face first into a vat of %x. They come up sputterin', coated head to foot.",
         "A spigot opens over %n and a slow golden river of %x pours over them, coatin' every inch."],
        ["Then the farm's critters smell it. The barn cats come first, then the goats, then the farm dogs, all of them lickin'.",
         "Rough little tongues find %n from every side: the cats on their fingers, the goats on their neck, the pups on their belly.",
         "{t}Somethin' with a very warm tongue finds the %x pooled between %n's tits and licks it clean, slow and thorough.",
         "{c}A barn cat licks the %x off %n's cock with great concentration, and %n can't keep still.",
         "{v}A warm, wide tongue licks the %x out from between %n's legs, and comes back for more."],
        ["The lickin' doesn't stop till every drop is gone, and some of the critters keep goin' after.",
         "%n squirms and giggles and moans by turns, held sticky in place while the whole barn cleans them up.",
         "Somebody fetches a spoon. The farm girl tells them off. Then fetches her own."],
      ],
      end: ["%n is let go at last, licked mostly clean, sticky where the critters missed and smellin' of %x.",
            "When the critters wander off, %n is left glazed and tacky with %x, every step a sticky little peel.",
            "%n peels themselves off the boards, still shinin' with %x, and the barn cats follow them home."],
    },
    incubator: {
      beats: [
        ["A glass lid lowers over %n and a red lamp glows to life above them. It's warm in here. Very warm.",
         "%n is coaxed into a straw-lined box under a heat lamp, and the lid comes down with a gentle click.",
         "The incubator hums and the lamp comes on, and %n is bathed in a soft, drowsy red warmth."],
      ],
      eggs: ["The heat soaks into %n's belly and the eggs inside them stir, swell, and multiply, heavy and warm.",
             "%n's belly tightens and rounds under the lamp. The clutch inside is growin', ripenin', gettin' ready.",
             "Every egg in %n warms and swells, and their belly creaks with how full it's gettin'."],
      empty: ["The warmth goes deep into %n's belly and settles there, and they start feelin' broody, empty, achin' to be filled.",
              "%n curls up in the straw under the lamp, nestin' without meanin' to, ripe and wantin'.",
              "Somethin' low in %n ripens in the heat, and they ache to be bred."],
      endEggs: ["The lid lifts. %n climbs out heavy and round, %x eggs on board now and every one of them ready soon.",
                "%n waddles out of the incubator, belly huge with %x warm eggs that won't wait long."],
      endEmpty: ["The lid lifts and %n stumbles out broody, flushed, and very ready for a stud.",
                 "%n comes out of the incubator in heat and achin', ripe as a peach."],
    },
    collection: {
      beats: [
        ["A padded bench folds up under %n and straps cinch them down over it, hips up, legs apart. A sign on the bench reads VAT COLLECTION.",
         "%n is buckled face down onto the collection bench, and a farmhand adjusts the jar underneath with a professional air.",
         "Straps, a bench, a jar: %n has been put on the collection bench, and the farm means to have everything."],
        ["{c}A warm, wet sleeve slides up over %n's cock and starts to milk it, slow and patient, root to tip.",
         "{c}A sleeve swallows %n's cock and a soft cup cradles their balls, and between them they get to work.",
         "{c}The collection sleeve pulls and squeezes %n's cock in long, steady strokes, and the jar waits."],
        ["{c}It milks the first load out of %n quick and keeps goin' without a pause.",
         "{c}A second load, then a third, and the sleeve never slows. The jar's fillin' nicely.",
         "{c}%n's balls are kneaded and the sleeve works on, wringin' them out a spurt at a time."],
        ["{c}By the end %n is dry, achin', and shakin' over the bench, and the sleeve gives one last squeeze for luck.",
         "{c}The sleeve hunts for more and finds nothin'. %n is emptied right out."],
      ],
      end: ["The straps let go. %n slides off the bench, emptied of %ml, all of it in the farm's vat now.",
            "%ml in the jar, labelled and carried off to the vat. %n lies on the bench a while, light-headed."],
    },
    wheel: {
      strap: [
        "A great painted wheel tips down out of the barn wall and %n is strapped to it, spread wide, before they can say no.",
        "Straps at the wrists and ankles: %n is buckled spread-eagle onto the breedin' wheel, and somebody gives it a push.",
        "The breedin' wheel creaks round and stops with %n strapped to it, upside down, then right way up, then sideways.",
      ],
      spinIn: [
        "%i spin: the wheel clicks to a stop and a %c cock steps up and breeds %n's %h, hard and quick, before the wheel turns again.",
        "%i spin, and the arrow lands on a %c stud. He takes %n's %h right there on the wheel and fills them.",
        "Round goes the wheel. %i stop: %c. %n is bred by it, wheel and all, and the crowd cheers.",
      ],
      spinOver: [
        "%i spin: a %c cock steps up, can't get in, and finishes all over %n instead.",
        "%i stop on the wheel: %c. It ruts against %n's thighs and marks them, and the wheel turns again.",
      ],
      end: ["The wheel stops for good. Three spins, three studs, %ml packed into %n's %h, and they're dizzy as a top.",
            "%n is unstrapped from the breedin' wheel, bred three ways with %ml in their %h, still spinnin' a little."],
      endOver: ["Three spins and three studs, and none of them could get in, so %n comes off the wheel painted three times over.",
                "The wheel lets %n go glazed and dizzy, marked by three different studs."],
    },
    stocks: {
      beats: [
        ["The fair stocks slam shut on %n's neck and wrists, and a hand-lettered sign goes up beside them: THREE PIES A PENNY.",
         "%n is locked into the stocks at the fair, head and hands through the boards, and a pie stall opens next to them.",
         "Wooden stocks close round %n with a thunk, and somebody starts handin' out cream pies to the crowd."],
        ["SPLAT. The first pie hits %n square in the face, and the crowd roars.",
         "A pie catches %n on the forehead and slides down, cream in their eyes and their hair.",
         "{t}Somebody aims low and a pie bursts on %n's tits, cream runnin' down to their belly.",
         "Pie after pie, and %n's face is a mask of cream and crust before long."],
        ["The queue for pies runs right round the fairground. %n can't see, can't wipe, can only lick their lips.",
         "Somebody throws a pie, then licks some cream off %n's cheek, then throws another.",
         "A child's sticky little pie bounces off %n's nose, and the crowd applauds the effort."],
      ],
      end: ["The stocks open. %n stands up drippin', %x pies' worth of cream on them, and takes a bow.",
            "%x pies, and every one found its mark. %n is let out of the stocks creamed from the hair to the hips.",
            "%n staggers out of the stocks, %x pies thrown, lickin' cream off their lips and grinnin'."],
    },
    windmill: {
      beats: [
        ["Ropes catch %n and hoist them up onto one of the windmill's sails, spread along the slats.",
         "%n is lashed to the windmill's sail, arms out along the frame, and the brake comes off.",
         "A rope round %n's waist hauls them up and ties them to the windmill sails, high above the yard."],
        ["The sails turn, slow and creakin', and %n goes up and over and round, the whole farm spinnin' below them.",
         "Up into the sky, over the top, and down again. %n can see every field on the farm, then the ground, then the sky.",
         "The wind picks up and the sails turn faster, and %n's world becomes a whirl of blue and green and gold."],
        ["Folks gather below to watch %n go round. Somebody waves every time they pass.",
         "{t}%n's tits sway and bounce with every turn, and the folks below cheer each time they come round.",
         "{c}%n's cock swings with every turn of the sails, and the folks below cheer each time they come round.",
         "%n has stopped knowin' which way is up, and the windmill keeps turnin'."],
      ],
      end: ["The brake goes on and %n is lowered off the sails, so dizzy they sit down in the grass and stay there.",
            "%n is untied from the windmill and wobbles three steps sideways before the ground stops movin'.",
            "Down comes %n, spun silly, and they walk in little circles for a good while after."],
    },
    mudpit: {
      beats: [
        ["The ground drops away under %n and they slide into a pit of warm, slick mud, and %c comes slidin' in right after them.",
         "A chute dumps %n into the mud pit, and %c lands on top of them with a splash. The farm girl rings a bell. WRESTLE."],
        ["The two of them grapple in the mud, slippin', grabbin', neither one able to keep hold of anything.",
         "%n gets %c in a headlock, slips, and ends up underneath. They roll. Mud everywhere.",
         "It's a slippery, filthy, gaspin' scramble, and the crowd at the rail loves every second."],
        ["%n and %c wrestle themselves breathless, slick and brown from head to foot, and the bell rings for the last round.",
         "The rail's lined with folks cheerin' for one or the other. The two of them are too muddy to tell apart."],
      ],
      youWin: ["%n gets on top and stays there, pinnin' %c in the mud. The farm girl counts to three. Winner!",
               "With one last heave %n flips %c onto their back and sits on them. It's over."],
      youLose: ["%c gets %n face down in the mud and pins them there. The farm girl counts to three, and %n has lost.",
                "%n slips one too many times, and %c sits square on their back. Pinned. Lost."],
      endBred: ["And the winner takes the prize: %c has %x right there in the mud, %ml in their %h, while the crowd hollers.",
                "%c mounts %x in the mud like the prize they are, and leaves %ml in their %h before lettin' them up."],
      endPinned: ["%c keeps %x pinned in the mud a good while longer, grindin' on them, just to make the point. The crowd hollers.",
                  "The winner, %c, has %x every way they can in the mud short of breedin' them, and leaves them filthy and gaspin'."],
    },
  };
  // the herd's anthro lines for the maze's hunter and the kissin' gate's toll
  Object.assign(ANTHRO_LINES, {
    maze: {
      beats: [
        ["The corn rustles. The rustlin' stops. Then a shape steps out of the stalks behind %n: a wolf-man as tall as the corn, eyes yellow, grinnin'.",
         "%n turns a corner in the maze and walks right into a broad furry chest. The thing in the corn has found them."],
        ["He has %n down in the dirt between the rows before they can run, pinned on their belly with one big clawed hand.",
         "He catches %n round the waist and drags them down into the corn, sniffin' at their neck, their back, under their tail."],
      ],
      in: [
        ["He mounts %n right there in the maze, his %c cock drivin' into their %h, and ruts them hard into the dirt while the corn sways round them.",
         "The thing in the corn breeds %n's %h like he's been waitin' all season for it, fast and deep, growlin' in their ear."],
        ["He knots %n, ties them there in the corn, and pumps them full while they squirm. Then, when the knot goes down, he does it again.",
         "Twice he takes them, the second time slower, and the corn hides everything but the sound."],
      ],
      over: [["He can't have them inside, so he ruts against %n in the dirt, his %c cock slidin' over them, and marks them for the corn."]],
      end: ["When he lets %n go, he melts back into the corn, and they crawl out of the maze with %ml of him in their %h.",
            "The thing in the corn leaves %n bred in the dirt with %ml in their %h and the stalks rustlin' as he goes."],
      endOver: ["He leaves %n glazed and gaspin' in the corn and slips away between the stalks."],
    },
    kissgate: {
      beats: [
        ["%n steps into the kissin' gate and it swings, and catches them: halfway through, hips one side, head the other, held fast.",
         "The kissin' gate shuts on %n's middle and won't let go. Their front's in one field and their back's in the other."],
        ["A little sign on the post says TOLL. Underneath, somebody's drawn an arrow pointin' at %n.",
         "The first walker comes up the path, reads the sign, looks at %n, and smiles."],
      ],
      in: [
        ["Everybody who wants through the gate pays the toll: a kiss on %n's mouth from one side, or a turn in their %h from the other.",
         "Walkers pay the toll one after another, and every one of them takes it out of %n's %h."],
        ["By evenin' the toll's been paid a good many times, and %n's %h is drippin' with it.",
         "A whole ramblin' club comes through, and every one of them pays."],
      ],
      over: [["Nobody can have %n proper, so the walkers pay the toll by finishin' over them, front and back, and stride on through."]],
      end: ["The gate swings free at sundown and %n stumbles out, toll paid many times over, %ml leakin' from their %h.",
            "The kissin' gate lets %n go at last, kissed raw and bred full, %ml of walkers' tolls in their %h."],
      endOver: ["The gate lets %n go glazed from both ends, and the path's never been so popular."],
    },
  });
