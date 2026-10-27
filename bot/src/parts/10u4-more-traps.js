  /* WHAT'S IN THIS FILE (10u4-more-traps.js)
     Sixteen more traps for the test subjects (10u-traps.js runs them):
       trap-pillory   locked neck and wrists for ten minutes; anybody standin' by can ?use them, same as the bench
       trap-brand     an arm that writes a word on them (needs the Companion and "Farm can mark my body")
       trap-winch     a collar and chain that walks them to the pen and leaves them there
       trap-glue      stuck to the knees, and slow on their feet for a while after
       trap-cups      growth cups on the teats: a size bigger, and runnin' double
       trap-chute     a feed funnel and a bellyful of mash
       trap-vines     pollen that puts them in heat, and seed pods planted in them
       trap-slime     it eats their clothes, gets in everywhere, and leaves them slow and green
       trap-tickle    it only lets go when they ?beg (or after six minutes)
       trap-mirror    a line to say out loud five times before the door opens (or after six minutes)
       trap-paddle    twenty strokes, counted for the whole yard
       trap-wall      stuck halfway through a fence while strangers use both ends
       trap-mister    a faceful of whatever potion's in it
       trap-weights   studs: drained dry, and balls a size heavier
       trap-trough    ?watersports on only
       trap-pricetag  a price written on their ass, and the farm girl callin' the sale
  */
  Object.assign(TRAP_KINDS, {
    pillory:  { icon: "🪵", what: "a pillory that locks your neck and wrists for ten minutes, and anybody passin' can use you", limit: /\b(stocks|pillory|public|free ?use)/i },
    brand:    { icon: "🖋️", what: "an arm that pins you and writes what you are across your skin", limit: /\b(writ|brand|mark|humiliat)/i },
    winch:    { icon: "⛓️", what: "a collar on a chain that drags you off to the pen and leaves you there", limit: /\b(collar|leash|cage)/i },
    glue:     { icon: "🍯", what: "a sticky floor that holds you to the knees, and slow feet after", limit: /\b(glue|stuck|immobil)/i },
    cups:     { icon: "🍼", what: "growth cups that latch on your teats and leave them bigger and runnin' double", limit: /\b(growth|size|milk|lactat)/i },
    chute:    { icon: "🌽", what: "a feed funnel in your mouth and mash till your belly's tight", limit: /\b(feed|stuff|force|belly)/i },
    vines:    { icon: "🌿", what: "vines, pollen that puts you in heat, and seed pods planted deep", limit: /\b(vine|plant|eggs?|ovipos|tentacle)/i },
    slime:    { icon: "🟢", what: "slime that eats your clothes, gets in everywhere and leaves you slow and green", limit: /\b(slime|goo|strip)/i },
    tickle:   { icon: "🪶", what: "a tickle rack that only lets go when you ?beg", limit: /\btickl/i },
    mirror:   { icon: "🪞", what: "a mirror box, and a line you have to say out loud five times to get out", limit: /\b(hypno|mantra|mind|humiliat)/i },
    paddle:   { icon: "🏓", what: "a paddle wheel: twenty strokes, counted for the whole yard", limit: /\b(spank|paddl|pain|impact)/i },
    wall:     { icon: "🧱", what: "stuck halfway through a fence, with strangers at both ends", limit: /\b(stuck|public|free ?use|gang)/i },
    mister:   { icon: "🧪", what: "a puff of whatever potion's loaded in it", limit: /\bpotion/i },
    weights:  { icon: "⚖️", what: "for studs: a sleeve that drains you dry, and balls a size heavier after", limit: /\b(growth|size|ball)/i },
    trough:   { icon: "💛", what: "the golden trough, only if you said ?watersports on", limit: /\b(piss|watersport|urin|golden)/i },
    pricetag: { icon: "🏷️", what: "a price written on your ass, and the farm girl callin' the sale", limit: /\b(sale|sold|auction|humiliat|writ)/i },
  });
  ANTHRO.wall = { sire: ANON_STUD, name: "strangers at the fence", type: "human", loads: 3, ml: 110, hold: 10, hole: "vulva", bonus: 1.2, where: "the hole in the fence" };
  // why one of these can't spring on somebody (null = it can)
  const TRAP_NEEDS = {
    pillory:  mn => limitBlocks(mn, "breed") ? "their limits rule it out" : null,
    cups:     mn => (makesMilk(mn) || hasPart(mn, "udder")) && !limitBlocks(mn, "milk") ? null : "nothin' for the cups to work on",
    vines:    mn => limitBlocks(mn, "eggs") || limitBlocks(mn, "heat") ? "their limits rule it out" : null,
    weights:  mn => !makesSemen(mn) ? "no balls to weigh down" : !seedMilkable(mn) ? "they've said ?milkable seed off" : null,
    trough:   mn => rec(mn).watersports ? null : "they haven't said ?watersports on",
    wall:     mn => limitBlocks(mn, "breed") ? "their limits rule it out" : null,
  };
  const BRAND_WORDS = ["CUMDUMP", "BREEDING STOCK", "THREE HOLES", "FUCK ME", "KNOT SLUT", "FARM WHORE", "FILL ME UP", "EGG SACK", "COCK SLEEVE", "FREE CUNT", "USE ALL HOLES", "BRED DAILY", "MILK AND BREED",
    "ANYBODY'S", "WET AND READY", "PUBLIC USE", "STUD'S TOY", "BREED THIS ASS", "SWALLOWS", "RUT ME",
    "TRAPPED", "FREE USE", "BREED ME", "FARM PROPERTY", "TEST SUBJECT", "USE ME", "CUM HERE", "GOOD ANIMAL", "MILK ME", "KNOT ME", "SOW", "BROODMARE", "HOLES FOR HIRE", "CAUGHT AGAIN"];
  const MIRROR_LINES = ["i am stock and stock gets used", "my holes belong to the farm", "good animals do not think", "i was made to be bred", "i walked into it because i wanted it", "i am a test subject and i love my traps"];
  const moreLine = (kind, key, mn, v) => tFill(pickFor(mn, "trap:"+kind+":"+key, MORE_LINES[kind][key]), mn, v);

  const MORE_TRAPS = {
    pillory(mn){
      const pos = posOf(mn), r = rec(mn);
      trapRun(mn, "pillory", MORE_LINES.pillory.beats, () => {
        if (!pos) return;
        r.benched = { until: Date.now() + tmin(mn, CFG.TRAP_PILLORY_MIN)*60000, X: pos.X, Y: pos.Y, name: "the pillory", by: BOTMN(), uses: 0, since: Date.now(), ambAt: Date.now() + 3*60000, trap: true };
        tell(mn, "🪵 Locked in the pillory for "+CFG.TRAP_PILLORY_MIN+" minutes, sugar. Anybody who walks up can ?use you, mouth, pussy or ass. Your safeword opens it.");
      });
    },
    brand(mn){
      const word = BRAND_WORDS[Math.floor(Math.random()*BRAND_WORDS.length)], v = { x: word };
      trapHold(mn, 2, "the brandin' arm");
      trapRun(mn, "brand", MORE_LINES.brand.beats, () => {
        const ok = bodyMark(mn, { write: { line: word, area: ["hips", "chest", "waist", "ribs"][Math.floor(Math.random()*4)] } });
        rec(mn).branded = word;
        emote("🖋️ "+moreLine("brand", "end", mn, v), mn);
        if (!ok) tell(mn, "🖋️ It wrote "+word+" on you, sugar. With the Companion and \"Farm can mark my body\" on, it'd be there for everybody to read.");
      }, v);
    },
    winch(mn){
      trapRun(mn, "winch", MORE_LINES.winch.beats, () => {
        trapFree(mn);
        const where = penIn(mn, tmin(mn, CFG.TRAP_WINCH_MIN), BOTMN());
        emote("⛓️ "+moreLine("winch", where ? "end" : "endNone", mn), mn);
      });
    },
    glue(mn){
      trapHold(mn, 5, "the glue");
      trapRun(mn, "glue", MORE_LINES.glue.beats, () => { rec(mn).gluedUntil = Date.now() + tmin(mn, CFG.TRAP_STICKY_MIN)*60000; arouse(mn, 10); });
    },
    cups(mn){
      trapHold(mn, 3, "the growth cups");
      trapRun(mn, "cups", MORE_LINES.cups.beats, () => {
        const p = prodOf(mn);
        if (hasPart(mn, "udder") && CFG.SIZES.udder) setSize(mn, "udder", sizeOf(mn, "udder") + (CFG.SIZES.udder.step || 1), true);
        if (makesMilk(mn)) addBoost(p, "milk", 24*3600000, 1);
        emote("🍼 "+moreLine("cups", "end", mn, { x: typeof sizeName === "function" && hasPart(mn, "udder") ? sizeName(mn, "udder") : "bigger" }), mn);
        arouse(mn, 20);
      });
    },
    chute(mn){
      trapHold(mn, 3, "the feed chute");
      const blocked = holeBlocked(mn, "mouth");
      trapRun(mn, "chute", blocked ? MORE_LINES.chute.none : MORE_LINES.chute.beats, () => {
        if (blocked) return;
        const p = prodOf(mn), kept = trapFill(mn, "mouth", capacity(mn)*0.9, CFG.TRAP_OVERFULL);
        p.milk = Math.min(milkCap(mn), p.milk + kept * CFG.PROD.SWALLOW_TO_MILK);
        emote("🌽 "+moreLine("chute", "end", mn, { ml: ml(kept) }), mn);
      });
    },
    vines(mn){
      const hole = openHole(mn, "vulva"), v = { h: hole && hole !== "mouth" ? TRAP_HOLE[hole] : "" };
      trapHold(mn, 5, "the vine patch");
      trapRun(mn, "vines", MORE_LINES.vines.beats.concat(v.h ? MORE_LINES.vines.in : MORE_LINES.vines.over), () => {
        startHeat(mn, BOTMN(), 1);
        if (v.h){
          const [lo, hi] = CFG.EGG_COUNT;
          v.x = String(layClutch(mn, (lo + Math.floor(Math.random()*(hi - lo + 1))) * (hyperEggs(mn, 0.1) ? 3 : 1), -6));
          emote("🌿 "+moreLine("vines", "end", mn, v), mn);
        }
        arouse(mn, 35);
      }, v);
    },
    slime(mn){
      trapHold(mn, 4, "the slime pit");
      trapRun(mn, "slime", MORE_LINES.slime.beats, () => {
        const r = rec(mn);
        bodyMark(mn, { strip: true });
        setTimeout(() => bodyMark(mn, { splat: ["face", "chest", "tummy", "forehead"], color: "#5FAE3A" }), 1500);
        for (const h of ["vulva", "butt"]) if ((h !== "vulva" || hasVulva(mn)) && !holeBlocked(mn, h) && !limitBlocks(mn, "breed")) trapFill(mn, h, 150 + Math.random()*150, CFG.TRAP_OVERFULL);
        r.gluedUntil = Date.now() + CFG.TRAP_STICKY_MIN*60000; r.slimed = Date.now();
        arouse(mn, 30);
      });
    },
    tickle(mn){
      trapHold(mn, CFG.TRAP_WAIT_MIN + 1, "the tickle rack");
      trapRun(mn, "tickle", MORE_LINES.tickle.beats, () => {
        const r = rec(mn), pos = posOf(mn);
        r.trapWait = { kind: "tickle", until: Date.now() + CFG.TRAP_WAIT_MIN*60000, next: Date.now() + 25000 };
        if (pos) r.penned = { until: r.trapWait.until + 30000, X: pos.X, Y: pos.Y, name: "the tickle rack", by: BOTMN(), trap: true, wait: true };
        tell(mn, "🪶 It won't stop till you beg, sugar: ?beg and the words. Or hold out the whole "+CFG.TRAP_WAIT_MIN+" minutes, if you can.");
      });
    },
    mirror(mn){
      const line = MIRROR_LINES[Math.floor(Math.random()*MIRROR_LINES.length)];
      trapHold(mn, CFG.TRAP_WAIT_MIN + 1, "the mirror box");
      trapRun(mn, "mirror", MORE_LINES.mirror.beats, () => {
        const r = rec(mn), pos = posOf(mn);
        r.trapWait = { kind: "mirror", until: Date.now() + CFG.TRAP_WAIT_MIN*60000, next: Date.now() + 40000, line, n: 0 };
        if (pos) r.penned = { until: r.trapWait.until + 30000, X: pos.X, Y: pos.Y, name: "the mirror box", by: BOTMN(), trap: true, wait: true };
        trance(mn, 1);
        tell(mn, "🪞 The voice in the box wants to hear you say it, out loud, five times:\n\""+line+"\"\nSay it in chat"+(hasCompanion(mn) ? ", or tap Say it in your panel if a gag or a rule has your tongue" : ", or whisper it to me")+". The door opens on the fifth, or in "+CFG.TRAP_WAIT_MIN+" minutes if you won't.");
        try { syncCompanions(); } catch(e){}   // its Say it button (10ui-say.js)
      });
    },
    paddle(mn){
      trapHold(mn, 3, "the paddle wheel");
      trapRun(mn, "paddle", MORE_LINES.paddle.beats, () => { const r = rec(mn); r.paddled = (r.paddled || 0) + 20; arouse(mn, 25); face(mn, "edged", 90); });
    },
    wall(mn, spot){ anthroScene(mn, "wall", spot); },
    mister(mn){
      const can = POTIONS.filter(P => !potionRefusal(mn, P.id, mn)), P = can[Math.floor(Math.random()*can.length)];
      trapRun(mn, "mister", MORE_LINES.mister.beats, () => { if (P) givePotion(mn, P.id, BOTMN(), "from a trap"); else emote("🧪 "+moreLine("mister", "dud", mn), mn); });
    },
    weights(mn){
      trapHold(mn, 4, "the drainin' sleeve");
      trapRun(mn, "weights", MORE_LINES.weights.beats, () => {
        const p = prodOf(mn), got = drainSemen(mn, p.semen);
        if (hasPart(mn, "testes") && CFG.SIZES.testes) setSize(mn, "testes", sizeOf(mn, "testes") + (CFG.SIZES.testes.step || 1), true);
        emote("⚖️ "+moreLine("weights", "end", mn, { ml: ml(got) }), mn);
        face(mn, "milked", 60); arouse(mn, 20);
      });
    },
    trough(mn){
      trapHold(mn, 3, "the golden trough");
      trapRun(mn, "trough", MORE_LINES.trough.beats, () => {
        const r = rec(mn);
        bodyMark(mn, { splat: ["face", "chest", "tummy", "forehead"], color: CFG.PISS_COLOR });
        if (!holeBlocked(mn, "mouth")) trapFill(mn, "mouth", 150, CFG.TRAP_OVERFULL);
        r.pissed = (r.pissed || 0) + 1; arouse(mn, 15);
      });
    },
    pricetag(mn){
      const price = 1 + Math.floor(Math.random()*9), v = { x: String(price) };
      trapHold(mn, 3, "the sale block");
      trapRun(mn, "pricetag", MORE_LINES.pricetag.beats, () => {
        bodyMark(mn, { write: { line: "FOR SALE "+price+" RIBBONS", area: "hips" } });
        rec(mn).priced = { at: Date.now(), price };
        announce("🏷️ "+moreLine("pricetag", "call", mn, v));
        emote("🏷️ "+moreLine("pricetag", "end", mn, v), mn);
      }, v);
    },
  };

  // the rack and the box hold them till they give it what it wants (or the time's up)
  function trapWaitEnd(mn, how){
    const r = rec(mn), w = r && r.trapWait; if (!w) return false;
    r.trapWait = null; if (r.penned && r.penned.trap) r.penned = null;
    saveLedger();
    try { betsWaitEnd(mn, how); } catch(e){ warn("bets:", e); }
    if (how === "quiet") return true;
    if (w.kind === "mirror"){ trance(mn, 0); if (how === "gave"){ goUnder(mn, 2); if (r.hypno) later(() => { try { echsAsk(mn, CFG.BOT_MEMBER, "mirror"); } catch(e){} }, 8000); } }   // (ECHS: 10uj-echs.js)
    if (charFor(mn)) emote(TRAP_KINDS[w.kind].icon+" "+moreLine(w.kind, how === "gave" ? "gave" : "held", mn), mn);
    if (how === "held") later(() => earnRibbons(mn, 1, "holdin' out against the "+(w.kind === "tickle" ? "tickle rack" : "mirror box")), 2000);
    try { if (charFor(mn)) trapEnded(mn, w.kind, null); } catch(e){ warn("trap ended:", e); }   // how was it (10y9o-trap-ratings.js)
    syncCompanions(true);
    return true;
  }
  function moreTrapTick(){
    const now = Date.now();
    for (const [k, r] of Object.entries(L.people)){
      const w = r.trapWait; if (!w) continue;
      const mn = parseInt(k, 10);
      if (w.until <= now){ trapWaitEnd(mn, "held"); continue; }
      if (!charFor(mn) || now < w.next) continue;
      w.next = now + (w.kind === "tickle" ? 30000 : 50000);
      emote(TRAP_KINDS[w.kind].icon+" "+moreLine(w.kind, "loop", mn, { x: w.line ? "\""+w.line+"\"" : "" }), mn);
      if (w.kind === "tickle") arouse(mn, 8, 85);
    }
  }
  // ?beg on the tickle rack
  function trapBegged(mn){ const r = rec(mn); return !!(r && r.trapWait && r.trapWait.kind === "tickle") && trapWaitEnd(mn, "gave"); }
  // the mirror box listens for its line
  function trapHeard(mn, text){
    const r = rec(mn), w = r && r.trapWait;
    if (!w || w.kind !== "mirror" || squash(text).indexOf(squash(w.line)) < 0) return;
    w.n = (w.n || 0) + 1; saveLedger();
    if (w.n >= 5){ trapWaitEnd(mn, "gave"); return true; }
    privateLine(mn, tFill(pickFor(mn, "trap:mirror:count", MORE_LINES.mirror.count), mn, { x: String(5 - w.n) }), "emote");
    arouse(mn, 8);
    try { syncCompanions(); } catch(e){}   // the Say it button counts down too (10ui-say.js)
    return true;
  }

  const MORE_LINES = {
    pillory: {
      beats: [
        ["A beam drops out of the rafters as %n walks under it and catches them neat across the back of the neck. A second half swings up from below and the two halves clap shut.",
         "%n ducks through a low gap in the fence and the top rail comes down behind their head. Three holes: one for the neck, two for the wrists. They fit perfectly.",
         "There's a pillory standin' in the yard that wasn't there yesterday. %n finds out what it's for when the hinge snaps over on a spring."],
        ["A pin drops through the hasp. %n is bent at the waist, head and hands out one side, everything else out the other, and the frame's just the right height for anybody who cares to step up.",
         "A bar ratchets up between %n's ankles and spreads their feet. A little flag pops up on top of the post, bright red, where the whole yard can see it.",
         "%n tugs. The pillory doesn't so much as creak. A painted sign swings down off the crossbeam on two chains and hangs in front of their face, the wrong way round for them to read."],
        ["The sign says HELP YOURSELF.",
         "The flag means the trap's full. Round here, everybody knows what you do with a full trap.",
         "Somewhere a bell dings twice, the way it does when there's somethin' free at the gate."],
      ],
    },
    brand: {
      beats: [
        ["A padded clamp closes on %n's waist from behind and lifts them an inch off their heels. A thin jointed arm unfolds from the wall with a fat black pen in its fingers.",
         "Straps whip round %n's wrists and pull them up over their head. Somethin' whirs, and a little brass arm tipped with an inkin' needle swings round to look them over.",
         "%n is tipped back onto a slanted board and buckled down. A lamp clicks on. Above them an arm like a seamstress's machine starts to hum."],
        ["It takes its time choosin' where. The nib trails cold across %n's belly, their hip, the top of their thigh, and stops.",
         "It wipes a patch of %n's skin clean with a little pad, real businesslike, the way you'd prep a calf for the iron.",
         "The pen hovers. %n holds their breath. Then it touches down and starts to write, slow, in big neat capitals."],
      ],
      end: ["The arm folds itself away and the clamp lets go. Written across %n's skin, where it'll take a good scrub to shift: %x.",
            "It caps its pen, admires the job, and lets %n go. They look down. %x, in black letters a hand high.",
            "The straps drop. %n has been labelled, same as every other piece of stock on the place: %x."],
    },
    winch: {
      beats: [
        ["Somethin' cold snaps shut round %n's throat from above: a steel collar on a chain, and the chain runs up to a pulley on a rail.",
         "A loop of chain drops over %n's head like a lasso and cinches into a collar. Overhead, a winch starts to tick.",
         "%n hears a rattle in the rafters, looks up, and gets a collar round the neck for their trouble. It locks itself."],
        ["The chain goes taut and starts to move. %n can walk with it or be dragged; it doesn't mind which.",
         "Tick, tick, tick. The rail pulls %n along at a steady stroll, up on their toes, both hands on the collar, past everybody.",
         "It leads %n across the yard like a heifer to market, and no amount of diggin' their heels in slows it one bit."],
      ],
      end: ["The rail ends at the pen. The collar pops open, the gate swings shut, and %n is left inside with the latch on the far side.",
            "It walks %n right into the pen, drops them there and reels itself back up into the roof. The gate clicks.",
            "End of the line: the corral. The chain lets %n go and the gate does not."],
      endNone: ["The chain runs out of rail, gives %n one last yank for luck, and pops open. They're a long way from where they started.",
                "The winch walks %n round the whole yard twice and then lets them go, dizzy and collared pink."],
    },
    glue: {
      beats: [
        ["The floor here looks wet. It isn't wet. %n's first foot goes in to the ankle and stays there.",
         "%n steps onto a patch of somethin' gold and shiny, and it holds on. The other foot goes down to pull the first one out. That was a mistake.",
         "There's a sweet smell, like warm honey, and then %n's boots won't lift."],
        ["They pull. It stretches, slow and stringy, and draws them back down. They lose their balance and put a hand out. Now that's stuck too.",
         "Every tug sinks %n a little deeper. Knees. Then hands. They end up on all fours in the stuff with their ass in the air, glued in place like a fly on a strip.",
         "%n wobbles, sits down hard, and that's that: stuck from the seat down, legs apart, with everybody walkin' by gettin' a good look."],
        ["It takes a good long while to soften. When it finally lets go, it comes away in long gummy ropes that cling to %n's legs and tug at every step.",
         "The glue gives %n up an inch at a time. They wade out trailin' sticky strings, and their feet don't want to leave the ground for a good while after.",
         "At last it loosens. %n peels themselves free, tacky to the thighs, and every step sounds like pullin' a boot out of mud."],
      ],
    },
    cups: {
      beats: [
        ["Two clear cups on rubber hoses snap up out of a box and seal onto %n's teats with a kiss of suction. They're bigger than milkin' cups. A lot bigger.",
         "%n brushes past a rack of glassware and a pair of bell jars leap off it and latch onto their chest. Room to grow, the label says.",
         "A harness drops over %n's shoulders and buckles itself, and the two wide glass domes on the front of it clamp on tight."],
        ["A pump starts up, slow and deep. The cups pull. %n's chest draws up into the glass, pink and tight, a little further with every throb.",
         "Somethin' warm and tingly mists into the cups, and where it touches, %n's skin goes hot and full. The suction comes in long, patient waves.",
         "It isn't milkin' them. It's stretchin' them, fillin' them, coaxin' more of %n into those domes than was there a minute ago."],
        ["%n can watch it happen. The glass was half empty. Now it's nearly full, and the ache has turned into a heavy, swollen throb.",
         "The gauge on the harness creeps up. %n whimpers and cups the glass in both hands, and can feel the weight comin' on.",
         "The pump doesn't hurry. It just keeps askin' for a little more of %n, and gettin' it."],
      ],
      end: ["The cups come off with a wet pop and %n's teats spill out heavier than they went in: %x now, flushed and tender, with a bead of milk already swellin' at each tip.",
            "The harness unbuckles. %n looks down at a chest that's a full size up, %x, tight as drums and startin' to drip.",
            "It lets go at last. %n has to hold them up in both arms: %x, and by the feel of it they'll be runnin' double all day."],
    },
    chute: {
      none: [["A funnel swings down in front of %n's face, bumps against what's already in their mouth, and swings back up again, defeated."]],
      beats: [
        ["A yoke closes on %n's neck and tips their head back. Above them a hatch opens, and a wide rubber funnel on a pipe comes down and fits itself between their teeth.",
         "%n looks up at a rattle in the loft and gets a feed funnel pushed into their open mouth. A strap whips round the back of their head to hold it there.",
         "The trap sits %n down on a stool, cuffs their hands behind it, and lowers a goose funnel past their lips, neat as you please."],
        ["Somebody upstairs pulls a lever. Warm sweet mash comes down the pipe, thick as porridge, and %n has to swallow or drown in it.",
         "The first gush fills %n's mouth, cheeks bulgin'. They gulp. The second's already on its way.",
         "It pours. Oats and cream and honey and somethin' that sits heavy, and it does not wait for %n to be ready for the next mouthful."],
        ["%n's belly starts to push out over their lap. The mash keeps comin'. Swallow, breathe through the nose, swallow.",
         "Their middle swells round and firm, then tight. %n groans round the funnel and it just gurgles and gives them more.",
         "By the time the hopper's empty %n is packed like a prize goose, belly shiny and hard, hiccuppin' round the spout."],
      ],
      end: ["The funnel pulls out with a slurp. %ml of feed, all of it in %n, who can do nothin' now but sit there holdin' their gut and breathin' shallow.",
            "The yoke lifts. %n has been fattened on %ml of mash and they look it: round, stuffed, sleepy-eyed, with a smear of cream on their chin.",
            "It lets %n up. They'll waddle. %ml sits in them like a sack of wet grain, and it's already turnin' to milk."],
    },
    vines: {
      beats: [
        ["The creeper on the old wall isn't creeper. A green tendril loops round %n's ankle, and another round their wrist, gentle as a handshake.",
         "%n stops to smell the big pale flowers by the path. A vine slips round their waist while they're at it.",
         "The patch rustles with no wind. By the time %n looks down, there's green wound up both their legs to the knee."],
        ["The flowers turn to face them, all at once, and puff. Gold pollen hangs in the air, sweet and thick, and %n breathes it right in.",
         "A bloom the size of a dinner plate opens in front of %n's face and sneezes yellow dust over them. Their head swims. Their skin lights up.",
         "Pollen drifts down on %n like warm snow. Everywhere it lands, they tingle. Down low, they're already gettin' wet."],
        ["The vines lift %n off the path and spread them out among the leaves, careful, unhurried, the way a gardener ties up a bean.",
         "More green coils wind in, round thighs and chest, squeezin' soft, and a thick smooth stem with a swollen tip rises up out of the middle of the patch.",
         "Thin tendrils curl round %n's nipples and tug. A fat one, slick with sap, slides up the inside of their thigh."],
      ],
      in: [
        ["The stem pushes into %n's %h, cool and slippery, and grows as it goes, fillin' them out. Lumps start to travel up it from the root.",
         "It roots itself in %n's %h with a slow, deep twist. Then the pods come, firm and round, one behind another, pressed up inside them like seeds into soil.",
         "The plant sinks its stem up %n's %h to the hilt and pulses. %n feels the first pod pass the ring of them and settle. Then the next."],
      ],
      over: [["Finding nowhere to plant, the stem rubs itself against %n instead, drippin' sap, while the tendrils squeeze and stroke until they're shakin' in the leaves."]],
      end: ["When the vines set %n back on the path there are %x seed pods bedded down in their %h, and the pollen's still burnin' in their blood. They're in heat, and planted.",
            "The patch lets %n go: flushed, drippin' sap, with %x pods sittin' heavy inside them. Somethin' to sprout later.",
            "%x pods, tucked up warm in %n's %h. The flowers close, satisfied. %n staggers off in full heat with a belly full of somebody's garden."],
    },
    slime: {
      beats: [
        ["The puddle %n steps in is green, and it's warm, and it climbs.",
         "A glossy green blob drops off the rafters onto %n's shoulder with a plop. Then another. Then the rest of it.",
         "The drain grate lifts and a thick emerald ooze wells up round %n's feet. It's up their shins before they can jump."],
        ["Where it touches cloth, the cloth just melts away, threads driftin' in the goo. Where it touches skin, it tingles and clings.",
         "It flows up %n's legs like a stockin' pullin' itself on, dissolvin' everything they're wearin' as it goes, and it's in no hurry about the tender parts.",
         "%n tries to wipe it off and gets their hands coated for the trouble. It's eatin' their clothes right off them and leavin' them shiny, slick and bare."],
        ["Then it goes lookin' for ways in. Cool at first, then warm, pushin' and fillin', every hole it finds, till %n is stuffed with slime and wearin' the rest.",
         "The slime finds %n's openin's and pours itself inside, slow and thick, swellin' them from within while more of it kneads at their chest and thighs.",
         "It seeps into %n everywhere at once and starts to pulse. They sink to their knees in it, moanin', a green shine up to the neck."],
        ["When it's had its fill it slides off and back down the drain, most of it. What's left on %n drips off them in long ropes, and what's in them stays.",
         "It drains away at last and leaves %n naked, glazed green from hair to heels, sloshin' when they move and stuck to the floor at every step.",
         "The ooze lets go and seeps off between the boards. %n gets up, wobblin', coated, with slime runnin' out of them and their feet stickin' to the ground."],
      ],
    },
    tickle: {
      beats: [
        ["Cuffs pop up out of a bench and take %n by the wrists and ankles, and the bench tips back and stretches them out long.",
         "%n sits down for one second on a likely-lookin' stool. Straps cross their lap and chest, their arms are hauled up over their head, and their boots come off.",
         "A frame unfolds round %n like a deck chair with a grudge and pins them, spread and arched, with their ribs and the soles of their feet on show."],
        ["Little wheels start to turn. Every one of them is covered in feathers.",
         "Up come the arms: a feather duster, a soft brush on a spinnin' spindle, and a pair of thin wooden fingers that wiggle.",
         "Somethin' ever so light strokes up the arch of %n's foot. They jerk. It does it again, and brings friends."],
      ],
      loop: ["The feathers find %n's ribs and they shriek with laughin', thrashin' in the cuffs, tears runnin'. It doesn't stop. It wants to hear them beg.",
             "Soles of the feet now. %n howls, toes curlin', gaspin' for air between giggles. The little wheels just spin faster.",
             "It's worked out where %n is worst: under the arms, the inside of the thighs, the back of the knees. It goes round all three and starts again.",
             "%n is laughin' so hard nothin's comin' out. A brush whirrs along their belly, lower, lower, and stops just short, and goes back to their ribs.",
             "Feathers between the toes. Feathers in the crease of the hip. %n is red, wet-eyed and wheezin', and the rack hums along, tireless."],
      gave: ["The second %n begs, the wheels stop dead. The cuffs open. They slide off the rack in a damp, gigglin', boneless heap.",
             "\"Please\" does it. The feathers fold away, the straps let go, and %n lies there twitchin' and hiccuppin' till they can stand."],
      held: ["The rack winds down at last, beaten. %n held out the whole time and never begged once. They can barely breathe, but they did it.",
             "Time's up. The feathers droop, the cuffs pop, and %n rolls off the bench sore-ribbed and wrung out, and proud."],
    },
    mirror: {
      beats: [
        ["The tall box by the tack room has a mirror for a door. %n stops to look, and the mirror swings in, and they're inside, and it's shut.",
         "%n steps into what looks like a wardrobe. It's glass on every side, and all of it shows them, and the door's gone.",
         "A panel slides shut behind %n. Mirrors: front, back, both sides, overhead. A hundred of them, starin' back, lit soft and gold."],
        ["A voice comes on, low and warm and right behind their ear, though there's nobody there. \"Look at you,\" it says. \"Look at what you are.\"",
         "\"There you are,\" somebody murmurs out of the walls. \"Stand up straight. Let me see. Oh, yes. That's stock if I ever saw it.\"",
         "The light pulses, slow as breathin', and a voice like honey says: \"I'm goin' to tell you somethin' true. And you're goin' to say it back.\""],
      ],
      loop: ["\"Say it, sweet thing.\" The mirrors glow. \"Out loud: %x.\"",
             "The voice is patient. \"Look yourself in the eye and say it. %x.\"",
             "Every %n in the glass mouths the words along with the voice: %x. Only the real one hasn't said it yet.",
             "\"You'll feel so much better once you've said it. %x. Go on.\""],
      count: ["\"Good. Again.\" %x more.",
              "The mirrors brighten, pleased. \"That's it. Mean it this time.\" %x to go.",
              "\"There. Didn't that feel nice? Again.\" %x left."],
      gave: ["Five times. On the fifth, the voice sighs \"good animal,\" the lights go soft, and the door clicks open. %n walks out still mouthin' it.",
             "The mirror swings wide. %n steps out flushed and dreamy with the words goin' round and round their head, and no wish at all to stop them."],
      held: ["The lights come up plain and the door opens by itself. %n kept their mouth shut the whole time. The voice says, a little put out, \"Next time, then.\"",
             "Time's up, and %n never said it. The box lets them out. Their own face looks at them from the door a second longer than it should."],
    },
    paddle: {
      beats: [
        ["A padded rail swings up, catches %n across the hips and folds them over it. Behind them, somethin' with a lot of leather on it starts to turn.",
         "%n is bent over a sawhorse by two quick straps. They look back between their own knees at a wheel fitted with six broad paddles, spinnin' up.",
         "The trap takes %n by the wrists, hauls them forward over a barrel and hikes their tail up. A bell rings so the yard knows to listen."],
        ["CRACK. \"One,\" says a tinny voice out of a horn on the post, loud enough for the far paddock. CRACK. \"Two.\"",
         "The first one lands flat and loud, and the horn on the post sings out \"ONE!\" for everybody to hear. Then two. Then three.",
         "It starts in. Not cruel, but not shy either: a good, flat, ringin' smack on each cheek in turn, and every one counted out loud."],
        ["\"Nine. Ten.\" %n is up on their toes, squirmin', and their backside's gone a fine hot pink. \"Eleven.\"",
         "Halfway. %n yelps on every stroke now, and the horn doesn't miss a number. Folks have stopped to watch.",
         "By fifteen %n has quit holdin' still and quit holdin' quiet. The wheel keeps perfect time."],
        ["\"Twenty!\" The wheel coasts down. The straps let go. %n stands up real careful, both hands behind them, glowin' like a stove lid.",
         "Twenty, all told. The rail drops and %n is free to go, cherry-red and sniffin', and in no hurry to sit down this week.",
         "\"Twenty. Thank you for your custom.\" %n peels themselves off the barrel, rubbin' two hot handfuls, with the whole yard grinnin' at them."],
      ],
    },
    wall: {
      beats: [
        ["There's a gap in the plank fence, just big enough. %n gets their head and shoulders through, and then their hips, and then nothin' goes either way.",
         "%n tries to squeeze through the hole in the fence instead of walkin' round. A board drops behind their ribs with a clunk. Stuck, front half one side, back half the other.",
         "The fence closes on %n's waist like a hand. They push. They pull. Their ass is in the lane and their face is in the yard, and that's how it's goin' to be."],
        ["Boots on gravel, on the side %n can't see. They stop. Somebody whistles, low. A hand settles on %n's rump like it's testin' a melon.",
         "\"Well, look what the fence caught.\" %n can't turn round. There's more than one voice back there. Somebody's already tuggin' at whatever they've got on.",
         "On the front side a stranger strolls up, takes in the situation, and starts undoin' his belt, grinnin'. On the back side, somebody else has had the same idea."],
      ],
      in: [
        ["The one behind sinks into %n's %h without a word and sets to it, rockin' them against the planks. The one in front tips their chin up and waits for them to open.",
         "A cock pushes into %n's %h from the lane side. They gasp, and the stranger in the yard takes the chance to fill their mouth. The fence creaks between the two of them.",
         "%n is taken from behind by somebody they'll never see, hard and steady, while a second stranger holds their hair and uses their face."],
        ["The first one finishes and walks off whistlin'. There's somebody else in his place before %n has stopped drippin'.",
         "They take their turns. %n loses track of how many hands, how many cocks. Nobody back there ever says a name.",
         "Word gets round. For a good ten minutes %n is just a hole in a fence, at both ends, for whoever's passin'."],
      ],
      over: [["They rut against what's stickin' out of the fence, between %n's cheeks and thighs, and on the yard side somebody rubs off against their cheek, laughin'."]],
      end: ["When the board finally lifts, %n slides out backwards onto their knees with %ml in their %h, more on their face, and no idea who any of it belongs to.",
            "The fence lets go. %n has been used by half the lane: %ml in their %h, a jaw that aches, and boot prints in the gravel walkin' away.",
            "%ml, from strangers, through a fence. %n pulls free at last and has to sit down in the grass a while."],
      endOver: ["The board lifts and %n crawls out striped front and back with %ml of strangers' seed, never havin' seen one face."],
    },
    mister: {
      beats: [
        ["A little brass rose on a stalk pops up in front of %n's nose.",
         "%n leans in to read the label on a pretty glass bottle sittin' on a post. The bottle has a bulb. The bulb squeezes itself.",
         "Somethin' goes pfft right by %n's ear."],
        ["It puffs a fine sweet mist straight in their face. They've breathed it in before they think to hold their breath.",
         "A cool cloud settles over %n's nose and lips, tastin' of somethin' they can't place. Too late to spit.",
         "%n sneezes, blinks, licks their lips. Whatever it was, it's in them now."],
      ],
      dud: ["Nothin' happens. The mister was empty. %n waits a long worried minute to be sure."],
    },
    weights: {
      beats: [
        ["A soft leather cuff snaps shut round the root of %n's balls and a brass weight drops onto the end of it, tuggin' them low. Then a clear sleeve swallows their cock.",
         "The floor plate sinks, and a sleeve on a hose comes up between %n's legs and gulps their cock to the hilt, while a strap cinches snug round their sack.",
         "Clamps take %n by the thighs and spread them. Somethin' warm and ribbed slides down over their cock, and a little collar with a weight on it buckles round their balls."],
        ["The sleeve starts to milk, long greedy pulls, and the weight swings with every one. %n's knees go.",
         "It strokes, it squeezes, it sucks, and it won't let %n pull out. They're goin' to cum whether they like it or not, and then they're goin' to do it again.",
         "The machine works %n's cock like it's got a quota. The first load's out of them inside a minute. It doesn't even slow down."],
        ["Again. And again, thinner each time, till %n is shootin' nothin' but a twitch and a whimper. Then a needle the size of a whisker pricks the root of their sack.",
         "It wrings %n out to the last drop and a little past it. Then somethin' cold is injected into their balls, and they start to ache, and swell.",
         "Dry. %n hangs in the clamps, shakin'. The collar tightens a notch and pumps a warm dose into what it's holdin', to make sure there'll be more next time."],
      ],
      end: ["The sleeve slides off. %ml gone into the tank, and %n's balls hang a size heavier than before, hot and full and already makin' more.",
            "%ml, every drop they had. The trap lets %n go with a sack that's swollen up fat and tender. It'll want emptyin' again soon.",
            "It releases %n drained of %ml and carryin' a bigger pair than they walked in with. They swing when %n walks."],
    },
    trough: {
      beats: [
        ["The boards tip, and %n slides down on their knees into a long tin trough with a drain at one end. Bars swing over to keep them kneelin'.",
         "%n trips the catch and lands kneelin' in the old wash trough behind the stalls. A row of pipes hangs over it. A cuff closes on each wrist.",
         "A gate drops behind %n. They're in the gutter that runs under the stalls, on their knees, and the sluice above them is creakin' open."],
        ["It starts as a trickle on their shoulder, warm. Then the pipes let go, one after another, hot and yellow and loud on the tin.",
         "Every stall on the row drains down here. It comes out of the pipes steamin', splashin' off %n's chest and face and hair, runnin' down between their legs.",
         "The first stream hits %n right across the lips. The second gets their eyes shut for them. After that it's just a hot gold flood from six spouts at once."],
        ["It pools round %n's knees and climbs. They're soaked, they're steamin', it's in their mouth, and it's still comin'.",
         "%n gasps and gets a mouthful. Swallows before they think. The trough's fillin' up round their thighs.",
         "They kneel there and take it, piss sheetin' off their tits, hair plastered down, a puddle risin' to their lap."],
        ["The pipes dribble out. The bars lift. %n climbs out of the trough drenched, stinkin', drippin' yellow, marked by every animal on the row.",
         "Done. %n is let up, wet to the skin and reekin', with gold runnin' off their chin. Everybody they pass is goin' to know.",
         "The last spout sputters over %n's face and stops. They step out of the trough soaked and steamin', and leave wet footprints all the way down the lane."],
      ],
    },
    pricetag: {
      beats: [
        ["A turntable under the straw catches %n's feet and spins them up onto a low wooden block. Cuffs take their wrists up to a hook.",
         "%n steps up on a crate to see over the fence. It was the sale block. A post rises behind them and a strap takes them round the middle.",
         "A bell clangs. %n finds themselves hoisted up on the auction block, hands hooked overhead, turnin' slow so the whole yard gets a look."],
        ["A little arm with a chalk pencil whirrs out and writes somethin' across their backside in big round numbers.",
         "Somethin' cold and wet strokes over %n's rump: a paint brush, markin' them up the way you'd mark a hog for market.",
         "A tag on a string is looped round %n's neck. On it, and across their ass in grease pencil, is a number."],
      ],
      call: ["SALE at the block, y'all! %n, sound in wind and limb, every hole in workin' order. %x ribbons takes them. Step up and have a look!",
             "Goin' cheap today: one %n, lightly used, %x ribbons. Come see what you'd be gettin'!",
             "On the block right now: %n. %x ribbons, and I'll throw in the rope. Any takers?"],
      end: ["It says FOR SALE, %x RIBBONS, right across %n's ass, and the farm girl's just hollered it to the whole farm. The block lets them down. The writin' stays.",
            "The cuffs let %n go, priced at %x ribbons where anybody walkin' behind them can read it.",
            "%n climbs down off the block with %x RIBBONS wrote across their backside and every head in the yard turned their way."],
    },
  };
  ANTHRO_LINES.wall = MORE_LINES.wall;
