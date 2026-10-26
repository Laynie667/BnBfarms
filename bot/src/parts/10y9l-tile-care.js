  /* WHAT'S IN THIS FILE (10y9l-tile-care.js)
     THE WATER AND THE FARM GIRL'S BRUSH (Laynie, Oct 26, a player's idea: "if registered pets wander on a water spot, it
     washes a fraction of the messes off of them, and if they wander into a tile adjacent to the bot, it grooms them"),
     and Laynie's own: "a rare grooming trap the bot can do, as a futa, or several variants where they get used".
       • Stand on a water spot or a trough with a mess on you: every few minutes about a third of it rinses off (the
         oldest first, and one patch of the game's splatters). The third rinse takes the last of it, like ?wash.
       • Stand next to the farm girl: she brushes you down (once every half hour, fitted to your kind), and Barn life
         counts it as a grooming. ?grooming off and she leaves you be.
       • Now and then, for somebody with ?traps on, the brushin' turns into somethin' else: the farm girl is a futa, and
         she uses them on the grooming stand, over the tail brush or at the wash bucket (groomstand, groomtail,
         groombucket). Rare, only from her brush (or a proprietor's ?trap spring), hard limits and the safeword as always.
     And two bottles about who fathered what (Laynie: "if it gets drank by a person with a penis and they breed someone
     who is bred, they become the sire of that person's entire brood… or if it is drank by the bred person, the next
     sire becomes the singular sire of the entire brood"):
       Sire's Claim    drunk by somebody with a cock: the next one they breed who's already carryin', every litter and
                       clutch in them is theirs now, whoever put it there
       One Sire        drunk by the one who's carryin' (or hopes to be): the next load that lands in them, from anybody
                       or anything, is the only sire of all of it, and no other can join
  */
  if (CFG.RINSE_EVERY_MIN === undefined) CFG.RINSE_EVERY_MIN = 3;
  if (CFG.RINSE_TO_CLEAN === undefined) CFG.RINSE_TO_CLEAN = 3;
  if (CFG.GROOM_EVERY_MIN === undefined) CFG.GROOM_EVERY_MIN = 30;
  if (CFG.GROOM_TRAP_CHANCE === undefined) CFG.GROOM_TRAP_CHANCE = 0.08;
  const FARM_GIRL_SIRE = -49;
  const GROOM_TRAPS = ["groomstand", "groomtail", "groombucket"];

  // ── the water rinses a little off ──
  const RINSE_LINES = [
    "%n wades into the water and the worst of the mess starts to lift off them, driftin' away in slow cloudy swirls.",
    "The water's cool round %n's legs, and they splash a few handfuls up over themselves. Some of it comes off. Not all of it.",
    "%n stands in the water a while and lets it work. A good bit of what the farm put on them floats off downstream.",
    "%n scoops up water and scrubs at their thighs and belly, and a little more of the farm's mess comes away in their hands.",
    "{t}%n splashes water over their tits and rubs, and the stickiest of it finally lets go.",
    "{v}%n squats in the water and rinses between their legs, slow, and what's been drippin' out of them clouds the water.",
  ];
  const RINSE_CLEAN = [
    "One last splash and %n comes up clean, dripping and pink and smellin' of fresh water instead of the farm.",
    "%n rinses off the last of it and wades out shiny clean, like nothin' ever happened to them. For now.",
    "The water takes the last of the mess, and %n climbs out clean as the day they came to the farm.",
  ];
  function messyNow(mn){
    const r = rec(mn), p = prodOf(mn);
    if (r && r.messKinds && Object.keys(r.messKinds).length) return true;
    if (p && p.painted && p.painted.until > Date.now()) return true;
    try { return washFacts(mn).size > 0; } catch(e){ return false; }
  }
  function rinseTick(now){
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C.MemberNumber, r = rec(mn);
      if (mn === BOTMN() || !r || !hasRole(mn, ROLE.LIVESTOCK) || heldByTrap(mn) || (state.washing && state.washing.get(mn) > now)) continue;
      const wet = waterSpots().find(([n]) => onSpot(mn, n, 0));
      if (!wet){ if (r.rinse && r.rinse.at && now - r.rinse.at > 60*60000) r.rinse = null; continue; }
      if (!messyNow(mn)){ r.rinse = null; continue; }
      if (!r.rinse) r.rinse = { n: 0, at: 0, in: now };
      // the first rinse comes once they've stood there a minute; after that, every few
      if (!r.rinse.at && now - (r.rinse.in || now) < 60000) continue;
      if (r.rinse.at && now - r.rinse.at < CFG.RINSE_EVERY_MIN*60000) continue;
      r.rinse.n++; r.rinse.at = now;
      if (r.rinse.n >= CFG.RINSE_TO_CLEAN){
        privateLine(mn, "💧 "+tFill(pickFor(mn, "rinse:clean", RINSE_CLEAN), mn), "emote");
        washNow(mn);   // (and that clears r.rinse)
      } else {
        privateLine(mn, "💧 "+tFill(pickFor(mn, "rinse", RINSE_LINES), mn), "emote");
        bodyMark(mn, { rinse: true });   // their Companion takes off the oldest third of the messes, and a patch of splatters
        saveLedger();
      }
    }
  }

  // ── the farm girl's brush ──
  const GROOM_FAMILY = { cow: "hoof", bull: "hoof", pony: "hoof", horse: "hoof", deer: "hoof", goat: "hoof", sheep: "wool", pig: "hoof",
                         pup: "dog", dog: "dog", wolf: "dog", fox: "dog", kitt: "cat", cat: "cat", bunny: "bunny", rabbit: "bunny", rat: "bunny" };
  const GROOM_LINES = {
    hoof: [
      "The farm girl takes up a curry comb and works it over %n in firm little circles, neck to rump, till the dust lifts off them and they lean into it.",
      "The farm girl runs a stiff brush down %n's back and flanks in long strokes, the way you'd groom a show cow, and pats their rump when she's done.",
      "The farm girl picks %n's hooves, one, two, three, four, wipes them over with a rag, and brushes their tail out till it swings.",
      "The farm girl combs out %n's forelock, checks their ears, and gives their neck a good rough scratch that has them leanin' half their weight on her.",
    ],
    wool: [
      "The farm girl sinks her fingers into %n's fleece and fluffs it, pickin' out burrs and straw, till they look like a cloud on legs.",
      "The farm girl cards the tangles out of %n's wool with a wide comb, workin' slow so it doesn't pull, and puffs it all back up.",
      "The farm girl brushes %n down from ears to tail, pats the fluff into shape, and ties a little ribbon round a curl.",
    ],
    dog: [
      "The farm girl calls %n over with a whistle and brushes them out, ears and ruff and tail, till they're glossy and their leg's goin'.",
      "The farm girl gets the slicker brush on %n's coat and the undercoat comes out in fluffy clumps. \"Good pup. Look at you shine.\"",
      "The farm girl scratches right behind %n's ears, then down their back to the base of their tail, and laughs when their hips wiggle.",
      "The farm girl checks %n's paws, wipes their muzzle, and brushes their tail out long and fluffy. \"There's my good dog.\"",
    ],
    cat: [
      "The farm girl strokes %n from head to tail with a soft brush, again and again, till they're purrin' and arched up into it.",
      "The farm girl combs the knots out of %n's fur behind the ears and under the chin, slow and careful, and %n's eyes go to slits.",
      "The farm girl brushes %n's tail out long and fluffy and scratches the base of it, and %n's hips lift right up into her hand.",
    ],
    bunny: [
      "The farm girl holds %n in her lap and brushes them out with a tiny soft brush, ears last, while their nose wiggles.",
      "The farm girl strokes %n's ears flat, smooths their fur down, and fluffs up their tail with two fingers.",
      "The farm girl combs %n over gently, chin to tail, and gives their little nose a tap when she's done. \"All neat.\"",
    ],
    any: [
      "The farm girl catches %n by the collar, sits them down on a hay bale and brushes them out from head to toe, hummin' while she works.",
      "The farm girl takes a brush to %n's hair and a damp rag to their face and hands, and straightens their collar for 'em. \"There. Presentable.\"",
      "The farm girl gives %n a proper once-over with the brush, picks the straw out of their hair, and pats their behind. \"Good as new, sugar.\"",
      "{t}The farm girl brushes %n down, shoulders, back, belly, and gives their tits a check and a squeeze like she's lookin' over stock.",
    ],
  };
  function groomLine(mn){
    const fam = GROOM_FAMILY[speciesKey(mn)], pool = (fam ? GROOM_LINES[fam] : []).concat(GROOM_LINES.any);
    return tFill(pickFor(mn, "groom:farm:"+(fam || "any"), fam && Math.random() < 0.75 ? GROOM_LINES[fam] : pool), mn);
  }
  function nextToBot(mn){
    const a = posOf(mn), b = posOf(BOTMN());
    if (!a || !b || (a.X === b.X && a.Y === b.Y)) return false;
    return Math.max(Math.abs(a.X - b.X), Math.abs(a.Y - b.Y)) <= 1;
  }
  function groomTick(now){
    if (now - (state.groomAt || 0) < 60000) return;   // one at a time
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C.MemberNumber, r = rec(mn);
      if (mn === BOTMN() || !r || !hasRole(mn, ROLE.LIVESTOCK) || r.noGroom || quietNow(mn) || heldByTrap(mn)) continue;
      if ((state.sceneRuns && state.sceneRuns.has(mn)) || benchedNow(mn) || stockedNow(mn) || r.penned) continue;
      if (!nextToBot(mn)) { if (r.groomNear) r.groomNear = 0; continue; }
      if (!r.groomNear){ r.groomNear = now; continue; }                    // they have to stop there a moment, not walk past
      if (now - r.groomNear < 30000) continue;
      if (now - (r.groomedAt || 0) < CFG.GROOM_EVERY_MIN*60000) continue;
      r.groomedAt = now; state.groomAt = now; saveLedger();
      // now and then, for somebody with their traps on, it turns into somethin' else
      if (isSubject(mn) && !r.trapsOff && !trapBreathing(mn) && Math.random() < CFG.GROOM_TRAP_CHANCE){
        const can = GROOM_TRAPS.filter(k => { state.groomSpring = mn; try { return !trapWhyNot(mn, k); } finally { state.groomSpring = 0; } });
        if (can.length){
          const k = can[Math.floor(Math.random()*can.length)];
          state.groomSpring = mn; let why;
          try { why = springTrap(mn, k, "", true); } finally { state.groomSpring = 0; }
          if (!why){ r.trapAt = now; saveLedger(); addonsEmit("groomed", mn, BOTMN()); return; }
        }
      }
      emote("🪮 "+groomLine(mn), mn);
      face(mn, "afterglow", 30);
      addonsEmit("groomed", mn, BOTMN());   // Barn life counts it (addons/barn-life)
      return;
    }
  }
  function tileCareTick(){
    const now = Date.now();
    try { rinseTick(now); } catch(e){ warn("rinse:", e); }
    try { groomTick(now); } catch(e){ warn("groom:", e); }
  }
  function groomingCommand(sender, args, R){
    const r = rec(sender); if (!r) { R("You'll need to be on the farm's books first, sugar."); return; }
    const a0 = String(args[0] || "").toLowerCase();
    if (a0 === "on" || a0 === "off"){ r.noGroom = a0 === "off"; saveLedger();
      R(a0 === "off" ? "🪮 Alright, sugar: I'll leave you be when you stand next to me. ?grooming on and I'll brush you again." :
                       "🪮 Stand next to me a moment and I'll brush you down, sugar (every half hour or so)."+(isSubject(sender) ? " And with your traps on… sometimes I get carried away." : ""));
      return; }
    R("🪮 Grooming is "+(r.noGroom ? "OFF" : "ON")+" for you, sugar: stand on a tile right next to me for a moment and I brush you down (every "+CFG.GROOM_EVERY_MIN+" min). Stand in the water or a trough and it rinses some of the mess off you. ?grooming on|off");
  }

  // ── the futa farm girl's grooming traps ──
  Object.assign(TRAP_KINDS, {
    groomstand:  { icon: "🪮", what: "the farm girl's grooming stand: cross-tied, brushed down, and then she lifts her skirt", limit: /\b(futa|groom|breed|cross.?ti)/i },
    groomtail:   { icon: "🧹", what: "the farm girl's tail brush: she brushes you down to the rump, then takes your ass over the rail", limit: /\b(futa|groom|anal|breed)/i },
    groombucket: { icon: "🪣", what: "the farm girl's wash bucket: knelt down and scrubbed clean, and then she uses your mouth", limit: /\b(futa|groom|oral|throat|facial)/i },
  });
  Object.assign(ANTHRO, {
    groomstand:  { sire: FARM_GIRL_SIRE, name: "the farm girl", type: "human", loads: 2, ml: 220, hold: 5, hole: "vulva", bonus: 1.5, where: "the grooming stand", person: true },
    groomtail:   { sire: FARM_GIRL_SIRE, name: "the farm girl", type: "human", loads: 2, ml: 200, hold: 5, hole: "butt",  bonus: 1.2, where: "the tail rail", person: true },
    groombucket: { sire: FARM_GIRL_SIRE, name: "the farm girl", type: "human", loads: 1, ml: 240, hold: 4, hole: "mouth", bonus: 0,   where: "the wash bucket", person: true },
  });
  Object.assign(TRAP_NEEDS, Object.fromEntries(GROOM_TRAPS.map(k => [k, mn => state.groomSpring === mn || state.trapByHand ? null : "only the farm girl's own brush springs that one"])));
  // they start with a real grooming: clean first, then she makes a new mess of them
  for (const k of GROOM_TRAPS) MORE_TRAPS[k] = (mn, spot) => { try { washNow(mn); } catch(e){ warn("groom wash:", e); } anthroScene(mn, k, spot); };
  Object.assign(ANTHRO_LINES, {
    groomstand: {
      beats: [
        ["The farm girl clips a lead on %n's collar, walks them into the grooming stand and cross-ties them, one rope each side, snug. \"Hold still for me, sugar.\"",
         "\"C'mere, you scruffy thing.\" The farm girl leads %n into the grooming stand by the collar and ties them off short on both sides, so they can't turn their head."],
        ["She brushes them down, neck to rump, long firm strokes, and every stroke ends a little lower and a little slower than the last.",
         "Curry comb, then the soft brush, then her bare hands smoothin' everything down, and %n can feel her breathin' harder behind them."],
        ["Then her skirt brushes the backs of %n's thighs, and somethin' heavy and hot comes with it, lyin' right along their crack. \"Didn't know I had one o' these, did you, sugar?\"",
         "She steps in close behind them, and %n feels it before they understand it: a thick, hard cock under her apron, pressin' up against them. \"Grooming's done. This is the other part.\""],
      ],
      in: [
        ["She hitches her skirt up, lines her %c cock up with %n's %h and pushes in slow, both hands on their hips, the cross-ties creakin' as %n pulls against them.",
         "The farm girl takes %n's %h in one long push, right to the hilt, and starts ruttin' them in the stand like she's been savin' it up all week."],
        ["She fucks them hard and steady, apron flappin', hummin' that same tune she brushed them to, and when she cums she holds them tight and doesn't pull out till it's all in.",
         "She cums deep and keeps goin', and cums again, and only then does she lean on %n's back and catch her breath. \"Lord. You groom up pretty.\""],
      ],
      over: [["She ruts between %n's thighs and up the crack of their ass, skirt hitched to her waist, and cums all over their freshly brushed back. \"Well. Guess you'll need another brushin'.\""]],
      end: ["The farm girl unclips the cross-ties, gives %n's rump a pat, and leaves them standin' bow-legged with %ml of her runnin' out of their %h. \"Same time tomorrow, sugar.\"",
            "She smooths her apron down, ties %n's ribbon back in, and sends them off clean as a whistle everywhere but where it counts: %ml of farm girl packed in their %h."],
      endOver: ["She unties %n and looks over the mess she's made of all that brushin': %ml of her, drippin' off their back. \"Well, shoot. Back in the stand tomorrow.\""],
    },
    groomtail: {
      beats: [
        ["\"Let's get that tail done, sugar.\" The farm girl bends %n over the rail by the barn door and starts brushin', slow, from the small of their back right down over their rump.",
         "The farm girl pats the top rail. \"Over you go.\" %n goes over, rump up, and she starts on their tail with a soft brush and a lot of patience."],
        ["She brushes and brushes, and the strokes get shorter, and her free hand starts spreadin' them so she can do the job proper.",
         "Every pass of the brush ends right between %n's cheeks, and her thumb follows it, and stays."],
        ["Then the brush goes on the rail, and her skirt comes up, and %n feels the hot blunt head of her cock pressin' where the brush just was.",
         "\"Hold the rail.\" She spits in her palm, and %n hears her apron rustle, and then her thick cock is pushin' at their ass."],
      ],
      in: [
        ["She works her %c cock into %n's %h a little at a time, rockin', till her hips are flush against their rump, and then she takes hold of their tail like a handle.",
         "The farm girl sinks into %n's %h slow and greedy and fucks them over the rail, one hand fisted in their hair or their tail, whichever's handier."],
        ["She rides them hard, the rail knockin' against the barn wall, and when she cums she shoves deep and fills %n's ass with it, moanin' into their shoulder.",
         "She fucks %n's ass till their legs go, holds them up by the hips, and empties herself into them with a long, shaky groan."],
      ],
      over: [["She ruts her cock up and down %n's crack, tail held out of the way, and cums all over their rump and their nicely brushed tail."]],
      end: ["She pulls out slow, brushes %n's tail back down over the mess like she's tidyin' up, and leaves them hangin' on the rail with %ml of her in their %h.",
            "The farm girl wipes off on %n's thigh, kisses the back of their neck and goes back to her chores. %n stays over the rail, %ml of her leakin' out of their %h."],
      endOver: ["She gives the brush one more pass through the mess she left, %ml of it, and laughs. \"Shoot. Now it's all stuck together.\""],
    },
    groombucket: {
      beats: [
        ["The farm girl sits %n down on their knees by the wash bucket, wrings out a sponge and starts scrubbin' their face, neck and shoulders. \"Hold still, you're filthy.\"",
         "\"On your knees, sugar, bucket's here.\" The farm girl kneels %n by the wash bucket and goes at them with a sponge and a bar of soap till they're pink."],
        ["She washes their face last, slow, thumb along their lips, and leaves it there, pushin' %n's mouth open a little.",
         "She tips their chin up with two wet fingers and looks at their clean face for a long moment. \"Shame to waste it.\""],
        ["Then she lifts her skirt right in front of them, and her cock's already hard and right at their mouth.",
         "She steps up close, and her apron comes up, and %n is suddenly face to face with a thick, hard cock that smells of soap and her."],
      ],
      in: [
        ["She takes hold of %n's hair and slides her %c cock in over their tongue, slow, then deeper, till their nose is in her skirts.",
         "The farm girl fucks %n's %h with both hands on their head, steady and deep, the wash bucket sloshin' every time she pulls them in."],
        ["She cums down their throat with a long groan, holds them there to swallow every drop, then pulls back and paints the rest across their freshly washed face.",
         "She pumps it down %n's throat, then pulls out and finishes over their lips and cheeks. \"There. Now you can have your bath again.\""],
      ],
      over: [["She strokes herself over %n's upturned face and cums all over it, thick and warm, right where she'd just scrubbed it clean."]],
      end: ["The farm girl drops the sponge back in the bucket, pats %n's sticky cheek, and leaves them on their knees with %ml of her in their %h and on their chin.",
            "She tucks herself back under her apron and hands %n the sponge. \"You can do the rest yourself, sugar.\" %ml of her, swallowed, and plenty more on their face."],
      endOver: ["The farm girl looks down at %n's face, glazed with %ml of her, and laughs. \"So much for washin' you.\""],
    },
  });
  trapScene("groomstand",
    ["She brushes %n's hair out of their face with her fingers, gentle, and ties it back with her own ribbon so it's out of her way.",
     "She runs her hands down %n's sides like she's checkin' a mare for the show ring, and says \"good\" under her breath.",
     "She tugs one of the cross-ties a hole shorter, and %n's head is held up pretty and still."],
    ["{t}She reaches round and gives %n's tits a slow, heavy squeeze, like she's weighin' 'em, without missin' a stroke.",
     "{c}She reaches round and wraps her fist round %n's cock, pumpin' it in time with her hips, and laughs when they buck.",
     "{v}She slows down, grinds deep, and rubs %n's clit with two fingers till they're shakin' in the ties.",
     "She smacks %n's rump hard enough to leave a handprint and tells them to stand still like a good animal."]);
  trapScene("groomtail",
    ["She brushes %n's tail out over her own wrist, like a horse's, and then wraps it round her fist and tugs.",
     "\"Arch for me.\" She presses down on the small of %n's back till their rump is high and their back's a curve.",
     "She drips somethin' slick down %n's crack from a bottle she keeps in her apron for the hooves. It isn't for the hooves."],
    ["{c}She reaches under and milks %n's cock while she fucks them, slow, stoppin' every time they're close.",
     "{v}Her fingers find %n's pussy from underneath, two inside, and she fucks both holes at once.",
     "{t}She leans over %n's back and gets both hands on their tits, pullin' 'em while she grinds deep.",
     "She stops, buried, and makes %n push back on her to get it goin' again. They do. Of course they do."]);
  trapScene("groombucket",
    ["She tips a dipper of warm water over %n's head and laughs while they sputter and blink.",
     "\"Open,\" she says, and taps %n's lips with two fingers, and they open.",
     "She dips her fingers in the soap water and runs them over %n's lips, then into their mouth, feelin' how deep it goes."],
    ["She holds %n's nose and keeps her cock buried till they're squirmin', then lets them gasp, then does it again.",
     "{t}She drags %n up by the hair and fucks the cleavage of their soapy tits, then pushes it back in their mouth.",
     "She pulls out to slap her cock on %n's wet tongue, once, twice, and pushes back in.",
     "She keeps one hand in the bucket the whole time and flicks warm water on %n's face whenever they look up at her."]);
  Object.assign(INTENSITY_BY_TRAP, {
    groomstand:  { tender: ["She talks to %n the whole time, low and sweet, the way she settles the skittish ones.", "She checks the cross-ties aren't pinchin' before she starts, and kisses %n's shoulder.", "She goes slow, and keeps one hand on %n's flank, steady as a gentle hand on a nervous mare."],
                   filthy: ["\"Prettiest brood stock I ever brushed,\" she grunts, ruttin' %n like a broodmare at the stud barn.", "Cross-tied and dripping, %n is just a hole the farm girl brushes up before she uses it.", "She calls %n her little cum bucket and slaps their rump with every thrust."] },
    groomtail:   { tender: ["She's slow and slick and patient, and she waits every time %n tenses up.", "She keeps brushin' %n's tail gently the whole time, like she's soothin' them.", "She murmurs \"good, good\" in %n's ear and lets them set the pace for a while."],
                   filthy: ["She uses %n's tail as a handle and fucks their ass like a barn whore over the rail.", "\"Tails up is how I like my stock,\" she pants, and ruts deeper, gapin' them.", "She leaves %n's ass gapin' and drippin' and brushes the tail right back over it."] },
    groombucket: { tender: ["She cradles %n's head in both hands and never takes more than they can give.", "She strokes %n's hair the whole time and wipes their eyes with the warm sponge.", "Between strokes she lets %n breathe, and tells them how good they're doin'."],
                   filthy: ["She fucks %n's face like the wash bucket's just there to rinse her cock off after.", "Drool and soap and cum all down %n's chin, and she calls them her favourite sponge.", "\"Clean mouth, dirty mouth,\" she laughs, and stuffs it full again."] },
  });
  depthOf(["held"], ["groomstand", "groomtail"]);
  depthOf(["tease"], ["groomstand", "groomtail", "groombucket"]);
  depthOf(["breed"], ["groomstand"]);

  // ── the sire bottles ──
  POTIONS.push(
    { id: "siresclaim", name: "Sire's Claim", kind: "reward", mins: 120, price: 9, desc: "For two hours: the next one you breed who's already carryin', every litter and clutch in them becomes yours, whoever put it there. Needs a cock.",
      limit: /\b(preg|breed|litter|sire)/i, needs: (mn) => hasPart(mn, "penis") ? null : "a Sire's Claim needs a cock to do its work.",
      drink: "It's dark and heavy and it tastes like iron and musk. Your balls draw up tight and hot, and somethin' in you wants to take what's somebody else's.",
      seen: "%n knocks back a Sire's Claim and their nostrils flare. Every bred belly in the barn suddenly looks like it belongs to them." },
    { id: "onesire", name: "One Sire", kind: "reward", mins: 180, price: 9, desc: "For three hours: the next load that lands in you, from anybody or anything, becomes the only sire of everything you're carryin' (and if it takes, nobody else can join).",
      limit: /\b(preg|breed|litter|sire)/i, needs: (mn) => rec(mn) && rec(mn).breedable ? null : "One Sire only works for somebody who's ?breedable on.",
      drink: "It's sweet and thick and settles low in your belly, warm as a hand, and your womb goes quiet and waitin', like it's choosin'.",
      seen: "%n sips a One Sire and rests a hand on their belly. Whoever fills them next gets the lot." },
  );
  Object.assign(POTION_SEEN, {
    siresclaim: [
      "{c}%n drinks a Sire's Claim and their cock jumps, heavy and achin', like it's already lookin' for somebody else's breeder.",
      "%n finishes a Sire's Claim and looks round the barn at every round belly in it like they're countin' what's theirs.",
      "A Sire's Claim goes down %n's throat, dark as molasses, and they lick their lips and stare at the nearest bred thing on the farm.",
      "%n swallows a Sire's Claim and growls, low. Whoever's litter that is over there, it won't be theirs much longer."],
    onesire: [
      "%n drinks a One Sire, slow, and their belly gives a single warm flutter. It's waitin' to see who's next.",
      "{v}%n sips the One Sire and their pussy clenches round nothin'. The next one in there gets everything.",
      "A One Sire goes down %n easy, and they spread their stance a little. Whoever gets there first wins the lot.",
      "%n finishes a One Sire and rubs a slow circle low on their belly. One sire. Just one. Whoever's next."],
  });
  Object.assign(FX_OFF, {
    siresclaim: ["The Sire's Claim fades out of you. Whatever's carryin' your name already stays that way."],
    onesire: ["The One Sire settles and fades. Whatever it chose, it chose."],
  });
  const sireLabel = (s) => thingName(s) || (s === ANON_STUD ? "a stranger" : plainName(s));
  // everything they're carryin', from now on, from this sire
  function claimBrood(mother, stud){
    const p = prodOf(mother); if (!p) return false;
    const was = new Set();
    for (const g of [p.preg, p.preg2]) if (g){ for (const s of g.sires || []) was.add(s); g.sires = [stud]; g.claimed = stud; }
    if (p.eggs && p.eggs.n > 0){ was.add(p.eggs.by); p.eggs.by = stud; }
    was.delete(stud);
    audit(stud > 0 ? stud : BOTMN(), "SIRECLAIM", mother+" by "+stud+(was.size ? " (was "+[...was].join(",")+")" : ""));
    saveLedger();
    return [...was];
  }
  const CLAIM_LINES = [
    "Somethin' shifts low in %n's belly as that load hits, and every little life in there turns toward it. They all belong to %s now.",
    "%n's belly gives one deep, heavy clench, and that's that: whatever was in there, whoever put it there, it's %s's brood now.",
    "%n gasps and grabs their belly. The whole brood in them just changed its mind about who its daddy is: %s.",
  ];
  // a load landed in somebody (08-production.js rollConception calls this first)
  function sireBottles(mother, stud){
    state.oneSireNext = null;
    const p = prodOf(mother); if (!p || !stud || stud === mother) return;
    const carrying = !!(p.preg || p.preg2 || (p.eggs && p.eggs.n > 0));
    const r = rec(mother);
    if (r && r.rights && r.rights.until > Date.now() && r.rights.stud !== stud && !(r.rights.allow || []).includes(stud)) return;   // breedin' rights still rule
    let by = null;
    if (carrying && stud > 0 && potionOn(stud, "siresclaim")) by = "siresclaim";
    else if (potionOn(mother, "onesire")) by = carrying ? "onesire" : "onesire-new";
    if (!by) return;
    if (by === "onesire-new"){ state.oneSireNext = { mother, stud }; return; }   // nothin' in them yet: if this one takes, it takes alone
    const was = claimBrood(mother, stud);
    endPotion(by === "siresclaim" ? stud : mother, by, true);
    const line = "🧬 "+tFill(pickFor(mother, "sireclaim", CLAIM_LINES), mother).replace(/%s/g, sireLabel(stud));
    if (onMap(mother)) emote(line, mother); else tell(mother, line);
    tell(mother, "🧬 "+(by === "siresclaim" ? plainName(stud)+"'s Sire's Claim" : "Your One Sire")+": everything you're carryin' is "+sireLabel(stud)+"'s now"+(was.length ? " (it was "+was.map(sireLabel).join(", ")+")" : "")+".");
    if (stud > 0 && stud !== mother) tell(stud, "🧬 "+(by === "siresclaim" ? "Your Sire's Claim took" : plainName(mother)+"'s One Sire chose you")+": every litter and clutch in "+plainName(mother)+" is yours now.");
  }
  // after the roll: a One Sire that found an empty belly locks the new litter to its one sire
  function oneSireAfter(mother, stud, res){
    const n = state.oneSireNext; state.oneSireNext = null;
    if (!n || n.mother !== mother || n.stud !== stud) return;
    const p = prodOf(mother);
    if (res === "new" && p && p.preg){
      const g = p.preg.sires && p.preg.sires.includes(stud) ? p.preg : p.preg2;
      if (g){ g.sires = [stud]; g.claimed = stud; }
      endPotion(mother, "onesire", true); saveLedger();
      tell(mother, "🧬 Your One Sire chose "+sireLabel(stud)+": that took, and no other sire can join this litter.");
    }
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __tileCareTick: () => tileCareTick(), __claimBrood: claimBrood, __trapWhyNot: (m, k) => trapWhyNot(m, k),
                                              __roll: (m, s, ml, hole) => rollConception(m, s, ml || 200, 1, hole || "vulva") });
