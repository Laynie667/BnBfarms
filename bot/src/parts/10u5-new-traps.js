  /* WHAT'S IN THIS FILE (10u5-new-traps.js)
     Six more traps for the test subjects (Laynie, Oct 14: "more trap scenes and traps"). 10u-traps.js runs them like
     the rest: a spot called trap-<kind>, or a plain "trap" spot that picks one.
       trap-saddle   a buckin' saddle with a post in the seat (or a ridged hump, if every hole's taken): ridden till it stops
       trap-net      a net out of the hayloft, and a long dangle in the rafters with the whole barn lookin' up
       trap-bell     a cowbell collar locked on for half an hour: every step they take, the farm hears it
       trap-scale    the weigh-in: penned on the cattle scale, measured all over, and the numbers read out to the farm
       trap-teaser   for studs: a teasin' stall that smells of heat, and they come out pent up (their next load's a big one)
       trap-dip      the sheep dip: dunked, scrubbed and rinsed, every splatter and scribble washed off
     Lines fit the body (tags, 10y9d-body-fit.js). Hard limits and the safeword work the same as every trap.
     %n name · %h the hole in use · %x the weigh-in's numbers
  */
  Object.assign(TRAP_KINDS, {
    saddle: { icon: "🏇", what: "a buckin' saddle with somethin' in the seat, and a long hard ride", limit: /\b(ride|riding|saddle|machine|dildo)/i },
    net:    { icon: "🕸️", what: "a net out of the hayloft and a long dangle in the rafters", limit: /\b(net|suspen|hoist|hang)/i },
    bell:   { icon: "🔔", what: "a cowbell collar locked on for half an hour, so the whole farm hears you comin'", limit: /\b(bell|collar|humiliat)/i },
    scale:  { icon: "📏", what: "the weigh-in: measured all over and the numbers read out to the farm", limit: /\b(measur|weigh|humiliat|exhibit)/i },
    teaser: { icon: "💢", what: "for studs: a teasin' stall that smells of heat, and no way to reach it", limit: /\b(denial|teas|edg|orgasm)/i },
    dip:    { icon: "🛁", what: "the sheep dip: dunked, scrubbed and rinsed clean", limit: /\b(wash|bath|dunk|water)/i },
  });
  Object.assign(TRAP_NEEDS, {
    teaser: mn => makesSemen(mn) ? null : "no cock to tease",
  });
  const BELL_MIN = 30;
  const newLine = (kind, key, mn, v) => tFill(pickFor(mn, "trap:"+kind+":"+key, NEW_TRAP_LINES[kind][key]), mn, v);
  // the weigh-in's numbers, in plain words (no brackets: it's read out to the room)
  function weighIn(mn){
    const p = prodOf(mn) || {}, out = [];
    const word = (part, l) => String(sizeWord(part, l)).split(",")[0].trim();   // "B cup", not "B cup, handful"
    try { if (bodyOf(mn).tits && hasPart(mn, "udder") && CFG.SIZES.udder) out.push("a "+word("udder", udderLevel(mn))+" udder"); } catch(e){}   // (an udder only on somebody with tits)
    if (makesMilk(mn) && p.milk >= 1) out.push(ml(p.milk)+" of milk in them");
    if (makesSemen(mn)){ try { out.push("a "+sizeOf(mn, "penis")+" inch cock"); out.push(word("testes", sizeOf(mn, "testes"))+" balls"); } catch(e){} }
    const held = p.held ? heldTotal(p) : 0; if (held >= 1) out.push("holdin' "+ml(held));
    if (p.eggs && p.eggs.n) out.push(p.eggs.n+" eggs on board");
    if (p.preg) out.push("bred, due in "+Math.max(1, Math.ceil((p.preg.due - Date.now())/86400000))+" days");
    return out.length ? out.join(", ") : "nothin' much to report, but measured all the same";
  }
  Object.assign(MORE_TRAPS, {
    saddle(mn){
      const hole = ["vulva", "butt"].find(h => (h !== "vulva" || hasVulva(mn)) && !holeBlocked(mn, h)) || null, v = { h: hole ? TRAP_HOLE[hole] : "" };
      const T = NEW_TRAP_LINES.saddle;
      trapHold(mn, 4, "the buckin' saddle");
      trapRun(mn, "saddle", [T.mount].concat(hole ? T.in : T.over, [T.ride]), () => {
        const r = rec(mn); r.ridden = (r.ridden || 0) + 1;
        emote("🏇 "+newLine("saddle", "end", mn, v), mn);
        arouse(mn, 40); face(mn, "edged", 60);
        later(() => earnRibbons(mn, 1, "stayin' on the buckin' saddle"), 2000);
      }, v);
    },
    net(mn){
      trapHold(mn, 5, "the hayloft net");
      trapRun(mn, "net", NEW_TRAP_LINES.net.beats, () => { emote("🕸️ "+newLine("net", "end", mn), mn); arouse(mn, 10); });
    },
    bell(mn){
      trapRun(mn, "bell", NEW_TRAP_LINES.bell.beats, () => {
        const r = rec(mn), pos = posOf(mn);
        r.belled = { until: Date.now() + BELL_MIN*60000, X: pos ? pos.X : null, Y: pos ? pos.Y : null, at: Date.now() };
        emote("🔔 "+newLine("bell", "end", mn), mn);
        tell(mn, "🔔 That bell's locked on for "+BELL_MIN+" minutes, sugar. Every step you take, the farm hears it. Your safeword takes it off.");
      });
    },
    scale(mn){
      trapHold(mn, 3, "the weigh-in pen");
      trapRun(mn, "scale", NEW_TRAP_LINES.scale.beats, () => {
        announce("📏 "+newLine("scale", "call", mn, { x: weighIn(mn) }));
        emote("📏 "+newLine("scale", "end", mn), mn);
        arouse(mn, 10); face(mn, "edged", 30);
      });
    },
    teaser(mn){
      trapHold(mn, 5, "the teasin' stall");
      trapRun(mn, "teaser", NEW_TRAP_LINES.teaser.beats, () => {
        const p = prodOf(mn);
        if (p){ p.pentUp = true; p.semenFullSince = p.semenFullSince || Date.now(); }
        emote("💢 "+newLine("teaser", "end", mn), mn);
        arouse(mn, 60, 95); face(mn, "edged", 120);
      });
    },
    dip(mn){
      trapHold(mn, 3, "the sheep dip");
      trapRun(mn, "dip", NEW_TRAP_LINES.dip.beats, () => {
        const p = prodOf(mn);
        bodyMark(mn, { wash: true }); if (p) p.painted = null;
        try { aftermathWash(mn); } catch(e){}
        emote("🛁 "+newLine("dip", "end", mn), mn);
        arouse(mn, 10);
      });
    },
  });
  // the bell: it clanks when they move (not every step: once a minute and a half at most), and drops off when its time's up
  function newTrapTick(){
    const now = Date.now();
    for (const [k, r] of Object.entries(L.people)){
      const b = r.belled; if (!b) continue;
      const mn = parseInt(k, 10);
      if (b.until <= now || (r.trapQuiet || 0) > now){ r.belled = null; saveLedger(); if (charFor(mn) && b.until <= now) emote("🔔 "+newLine("bell", "off", mn), mn); continue; }
      const pos = charFor(mn) && posOf(mn); if (!pos) continue;
      if (pos.X === b.X && pos.Y === b.Y) continue;
      b.X = pos.X; b.Y = pos.Y;
      if (now - b.at < 90000) continue;
      b.at = now;
      emote("🔔 "+newLine("bell", "clank", mn), mn);
    }
  }

  const NEW_TRAP_LINES = {
    saddle: {
      mount: [
        "The ground tilts, and %n tumbles straight into a saddle bolted to a sprung steel horse. Straps snap round their thighs before they can climb off.",
        "A padded saddle rises out of the floor under %n and lifts them clean off their feet, and buckles cinch their ankles into the stirrups.",
        "%n trips on a rope, lands astride somethin' leather and warm, and the trap belts them down to it at the waist.",
        "Two arms swing %n up and drop them into a saddle on a rockin' frame. Cuffs close on their ankles. They're not gettin' off this one.",
      ],
      in: [
        ["Somethin' thick and greased rises out of the saddle's seat and pushes up into %n's %h, inch by slow inch, till they're sat right down on it.",
         "The saddle's horn isn't at the front. It comes up through the seat, slick, and %n sinks onto it with a gasp as it fills their %h.",
         "A knobbed post slides up out of the leather and finds %n's %h. The saddle settles them onto it, all the way down.",
         "%n feels it before they see it: a fat, warm post easin' up into their %h as the saddle draws them down onto it."],
        ["Then it bucks. Up, forward, down, and %n bounces on the post with every lurch, filled deep on every landin'.",
         "The horse starts to rock, slow, then faster, and every rock works the post in and out of %n's %h.",
         "It bucks like an unbroke colt, and %n clings to the saddle horn while the post pounds up into them.",
         "Every buck lifts %n half off the post and drops them back down on it, and they cry out on every landin'."],
      ],
      over: [
        ["Every hole on %n is spoken for, so the saddle just grinds: a ridged hump in the seat, pressin' right where it counts.",
         "{c}A ridged hump in the seat sits right under %n's cock and balls, warm and firm.",
         "{v}The seat's ridged and warm, and it presses up into %n's pussy through whatever's in the way.",
         "The seat swells up between %n's legs into a firm, ridged saddle-hump, and the straps hold them right down on it."],
        ["Then it bucks, and every buck grinds %n down onto that ridged hump, hard.",
         "The horse rocks faster and faster, and %n's hips are dragged over the ridges again and again.",
         "{c}%n's cock is bounced and rubbed on every buck, leakin' all over the leather.",
         "{v}Every buck rubs %n's pussy over the ridges, and they're soakin' the saddle."],
      ],
      ride: [
        "A crowd's gathered on the fence rail. Somebody's timin' it. Somebody else is cheerin'.",
        "%n has given up holdin' on with their hands and is just ridin' it out, moanin' with every buck.",
        "The buckin' gets wilder. %n's whole body jolts, hair flyin', and the saddle shows no sign of tirin'.",
        "{t}%n's tits bounce so hard on every buck they have to cross their arms over them.",
        "{nt}%n's chest is slick with sweat and heavin', and the saddle keeps on buckin'.",
        "Somebody on the rail shouts \"Hold on, cowpoke!\" and the whole fence laughs.",
      ],
      end: [
        "At last the horse coasts to a stop and the straps let go. %n slides off sideways, legs like jelly, and lies in the straw grinnin'.",
        "The saddle bucks one last time and sighs still. %n has to be helped down, wobbly and ridden raw, to a round of applause from the fence.",
        "Eight seconds is good. %n managed a good deal longer. The straps fall open and they topple off into the hay, spent.",
        "The buckles pop and %n crawls off the saddle on hands and knees, still twitchin', to whoops from the rail.",
      ],
    },
    net: {
      beats: [
        ["A net drops out of the hayloft and scoops %n up off their feet in one swoop.",
         "%n steps on a loose board, and the floor drops away into a net that snaps shut round them.",
         "Rope hisses through a pulley and a net wraps %n up like a sack of turnips.",
         "Somethin' rustles overhead. Then the net comes down, and %n is bundled in it before they can duck."],
        ["Up they go, net and all, into the rafters, spinnin' slow, legs pokin' out through the mesh.",
         "The net hauls %n up to the loft beams and leaves them danglin' ten feet over the barn floor.",
         "%n is winched up into the rafters, swingin', with every bit of them pressed through the mesh for everybody below to see.",
         "The rope creaks, the net lifts, and %n rises into the dusty gold light under the roof, turnin' gently."],
        ["Folks below stop and look up. Somebody points. Somebody fetches a broom handle and pokes.",
         "%n turns slowly in the net. Every way they twist, somethin' of theirs pushes out through the squares.",
         "{t}%n's tits push out through the mesh in plump squares, and somebody below whistles.",
         "{c}%n's cock hangs through one of the mesh holes, and there's nothin' they can do to tuck it back.",
         "{v}The mesh cuts right across %n's pussy, and every swing rubs it.",
         "A barn cat sits below, watchin' %n spin, tail twitchin'."],
        ["The farm girl wanders in, looks up, and laughs till she has to sit down.",
         "Somebody tickles the soles of %n's feet through the mesh with a long straw.",
         "The rope creaks. %n swings. The whole barn watches and makes no move to help.",
         "Somebody below takes bets on how long they'll be up there."],
      ],
      end: [
        "The rope pays out and %n is lowered, net and all, into a big soft heap of hay.",
        "The net's knot gives way and %n tumbles down into the straw, mesh marks all over them.",
        "The farm girl finally takes pity and lets the rope down, and %n flops out of the net into the hay, criss-crossed red.",
        "Down comes %n at last, spun dizzy, and they lie in the straw a while lookin' at the rafters.",
      ],
    },
    bell: {
      beats: [
        ["Somethin' cold snaps round %n's neck: a broad leather collar with a big iron cowbell hangin' off the front.",
         "A spring arm swings out of the post and buckles a bell collar round %n's throat, and a little padlock clicks shut on it.",
         "Clank. %n looks down at the cowbell now locked under their chin, and it clanks again.",
         "A loop drops over %n's head and pulls snug: a collar, a padlock, and the biggest cowbell on the farm."],
        ["%n tries the lock. Clank. Tries to tuck the bell into their top. Clank. Tries to stand very, very still. Clank.",
         "The bell is heavy and loud and the farm girl's grinnin' already. \"Now we'll always know where you are, sugar.\"",
         "Every breath %n takes, the bell shivers and tinkles. Every step, it bongs.",
         "There's a little tag on the bell. It reads LOST COW, RETURN TO THE BARN."],
      ],
      end: [
        "The lock's set for half an hour. Until then, everybody will hear %n comin'.",
        "%n's belled for the next half hour. There's no sneakin' anywhere now.",
        "%n is stuck with the bell for half an hour, and it's already announcin' every move they make.",
      ],
      clank: [
        "Clank, clank, clank: there goes %n across the yard.",
        "Somewhere behind the barn: CLANK. Everybody knows exactly who that is.",
        "%n tries to tiptoe. The bell does not tiptoe.",
        "Bong. Bong. Bong. %n's on the move again.",
        "The bell gives %n away again, clangin' with every step.",
        "A couple of the cows moo back at %n's bell.",
        "%n's bell clanks into the barn a full second before they do.",
        "Clonk, clonk. Heads turn. It's %n, belled like a lost heifer.",
      ],
      off: [
        "The little padlock on %n's bell collar clicks open, and the bell drops into the straw with one last clank.",
        "Half an hour's up. %n's bell collar falls open, and the quiet's almost strange.",
        "Click. The bell comes off %n at last. Somebody in the yard actually sounds disappointed.",
      ],
    },
    scale: {
      beats: [
        ["%n steps on a square of boards that sinks an inch, and iron bars swing up round them: a weighin' pen.",
         "The floor under %n turns out to be a cattle scale, and its gate slams shut behind them.",
         "A bell dings, the boards shudder, and %n is penned on the big farm scale with a needle swingin' on the dial."],
        ["Calipers and tape measures on jointed arms come out of the frame and start measurin' everything.",
         "A cold tape wraps round %n's chest, then their belly, then their hips. A pencil scratches on a card somewhere.",
         "{t}The tape loops under %n's tits and pulls snug, and somethin' clicks and writes it down.",
         "{c}A little brass caliper takes the measure of %n's cock, then their balls, and %n goes red to the ears.",
         "{v}A cold, slick gauge is pressed into %n's pussy, opened a notch, and read.",
         "A gloved hand pinches %n here and there, the way you'd check a heifer for condition."],
        ["A horn on the post crackles. The whole yard's about to hear the numbers.",
         "The needle settles. Somewhere out of sight, the farm girl licks her pencil.",
         "%n's whole body is chalk-marked with little numbers before the arms fold away."],
      ],
      call: [
        "WEIGH-IN at the trap: %n. %x. Fine stock.",
        "Read out for the whole farm: %n, %x. Write it down, y'all.",
        "The scale's verdict on %n: %x.",
        "Hear ye, hear ye, the weigh-in: %n, %x.",
      ],
      end: [
        "The gate swings open and %n steps off the scale, everybody now knowin' everything.",
        "The bars drop. %n slinks off the scale, measured from every angle, while folks still discuss the numbers.",
        "Done and weighed. %n gets a chalk mark on their rump with today's figures.",
      ],
    },
    teaser: {
      beats: [
        ["A gate swings round and pens %n in a narrow stall, and the air inside is thick with the smell of heat.",
         "The trap shoves %n into a teasin' stall, and somethin' on the other side of the bars smells ripe enough to make their knees go.",
         "%n's walked into the teasin' pen. The gate locks. The smell hits a heartbeat later."],
        ["Through the bars, a padded dummy in a mare's blanket rocks and presents, and every breath %n takes is pure heat-scent.",
         "A hose puffs heat-musk right in %n's face. Their cock is hard before they've finished coughin'.",
         "{c}%n's cock throbs against the bars, inches from what it wants, and the bars don't give.",
         "The dummy on the other side is slick and warm and swayin', and %n can't get a single inch closer."],
        ["They can't reach. They can smell it, see it, almost touch it, and can't reach.",
         "%n humps the air helplessly, achin', while the dummy rocks just out of reach.",
         "{c}%n's balls draw up tight and full, and there's nowhere to put it.",
         "A soft brush on a crank strokes %n's cock exactly twice and stops."],
      ],
      end: [
        "The gate opens at last, and %n staggers out with balls full fit to burst. Their next load's goin' to be a big one.",
        "%n is let out of the teasin' stall pent up to the eyeballs, and every stud in the barn can smell it on them.",
        "Released, %n leans on the fence breathin' hard. They're backed up good now, and their next load will show it.",
      ],
    },
    dip: {
      beats: [
        ["The path tips, and %n slides down a wet chute into a long trough of warm, soapy water: the sheep dip.",
         "Two padded arms grab %n and lower them, kickin', into a steamin' trough that smells of lavender and soap.",
         "Splash. %n goes in over their head and comes up sputterin' in the farm's sheep dip, bubbles up to the chin."],
        ["Big round brushes on spinnin' arms come down and start scrubbin' %n from ears to toes.",
         "A brush works between %n's shoulders, another down their legs, another somewhere they'd rather it didn't, very thorough.",
         "{t}Soft-bristled brushes circle %n's tits, round and round, till they're pink and squeaky clean.",
         "{c}A brush scrubs %n's cock and balls with no ceremony at all, and they yelp.",
         "{v}A soft brush works between %n's legs, slow and soapy and very, very thorough.",
         "%n gets dunked, scrubbed and dunked again, like a fleece on wash day."],
        ["A wooden paddle pushes %n's head under for a quick second rinse. They come up blowin' bubbles.",
         "Warm water sluices down over %n from a bucket on a swing arm, rinse after rinse.",
         "A fluffy towel on a pole rubs %n down, none too gently, from head to tail."],
      ],
      end: [
        "The trough tips %n out onto clean straw, scrubbed pink and smellin' of lavender. Every mark on them is gone.",
        "Rinsed, fluffed and squeaky, %n crawls out of the dip cleaner than they've been in weeks.",
        "The brushes retreat and %n climbs out drippin', every splatter and scribble washed clean off.",
      ],
    },
  };
