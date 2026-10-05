  /* WHAT'S IN THIS FILE (10i-stall-story.js)
     The milkin' stall's private story: while somebody's in a stall (milkingStallTick, 08-production.js)
     they're told what the machine is doin' to them, a line about every 25 seconds, only to them (like the
     glory stalls). Any species; breasts, cock, or both for someone who makes both. It plays in order:
       open (latchin' on) → start (first pulls, the let-down) → rhythm → build → heavy (nearly spent) →
       ending (windin' down) → finish (with how much came out)
     and for a cock the climaxes come in order too (climax pool, played front to back). Barn atmosphere is
     sprinkled in, praise or degradation is tacked on for folks who switched those on, and no line comes
     twice in one session.
     %n name · %c their cock (e.g. "thick horse") · %s a sound their species makes · %ml / %ms how much
  */

  const STALL_SOUNDS = {
    cow:["a low, needy moo","a soft moo","a long, shaky moo"], bull:["a deep, rumbling snort","a low bellow","a heavy, shuddering snort"],
    pony:["a breathy whinny","a soft nicker","a shaky little whinny"], horse:["a breathy whinny","a low nicker","a long, trembling whinny"],
    deer:["a thin, wavering bleat","a soft bleat"], pig:["a needy little oink","a soft grunt","a squealing gasp"],
    pup:["a high, needy whine","a soft whimper","a breathless yip"], dog:["a needy whine","a low whimper","a shaky yip"],
    kitt:["a needy mewl","a soft, broken purr","a breathy mew"], cat:["a needy mewl","a rumbling purr","a breathy mew"],
    goblin:["a ragged little cackle that turns into a moan","a breathless giggle"],
    default:["a soft moan","a needy whimper","a shaky gasp"]
  };

  const STALL_STORY = {
    milk: {
      open: [
        "The stall's cups swing down and settle over %n's breasts, cool for a heartbeat before the suction takes hold and pulls their nipples deep.",
        "Soft rubber cups seal over %n's nipples with a wet little kiss, and the pump hums to life somewhere behind the boards.",
        "The machine finds %n's breasts the way it's found a hundred others: a firm seal, a gentle tug, a quiet hiss as the lines open.",
        "A strap cinches gently across %n's back to hold them still, and the cups latch onto both nipples at once.",
        "The stall clicks, the cups lift, and in one smooth motion they're on %n, drawing those nipples down into the warm dark of the liners.",
        "%n's breath catches as the cups latch on. The first pull is gentle, testing, like the machine is getting to know them.",
        "The cups slide into place over %n's breasts and the vacuum takes hold, tugging their nipples long and stiff.",
        "There's a hiss, a click, and then that familiar, insistent pull at %n's nipples. The stall has them now."
      ],
      start: [
        "Nothing at first, just the slow pull and release. Then %n feels it: that deep, tingling ache as the milk starts to let down.",
        "A first thin stream runs down the clear line from %n's left breast, then the right catches up.",
        "%n shivers. The let-down hits all at once, a warm rush that makes their knees go soft.",
        "The rhythm is slow to start, pull and rest, pull and rest, coaxing the milk out of %n instead of taking it.",
        "Their nipples swell inside the cups, dark and tender, and the first milk beads and runs.",
        "%n lets out %s as the pressure in their breasts finally starts to ease.",
        "Little pulses of white chase each other down the tubes. The bucket below gives its first soft patter.",
        "The cups squeeze in time with the pump, a soft rolling pressure that draws a little more out of %n every time.",
        "%n's hands curl around the rail. It always feels a bit too good when the milk starts flowing.",
        "The machine settles into its pace and %n settles with it, breathing in time with the pull.",
        "Warmth spreads through %n's chest as the milk comes, a heavy, liquid relief.",
        "Drip, then trickle, then a steady stream. %n's breasts give it up for the stall."
      ],
      rhythm: [
        "Pull, hold, release. The stall works %n with patient, mechanical devotion.",
        "Milk runs in steady ribbons down the lines, and the bucket fills with a soft, foaming hiss.",
        "%n's nipples are drawn long and stiff inside the cups, every pull sending a little jolt down their spine.",
        "The pump keeps its slow heartbeat, and %n's breasts answer it, stream after stream.",
        "%n sways a little with the rhythm, head bowed, lost in the pull.",
        "A bead of milk escapes the seal and runs down the curve of %n's breast. The cup tugs harder, as if to scold it.",
        "%n lets out %s without meaning to.",
        "Each squeeze of the liners rolls down %n's nipples like a warm mouth, patient and greedy.",
        "The bucket's note gets lower as it fills, a deep, wet drum under %n.",
        "%n's breathing has gone slow and heavy, matched to the machine.",
        "The cups pulse faster for a moment, then ease back, and %n's whole body follows.",
        "Milk foams at the top of the bucket. %n can smell it, sweet and warm, filling the stall.",
        "Something about the steady pull makes %n's thoughts go soft and simple. Stand still. Give milk.",
        "%n shifts their weight, and the cups follow, never losing their grip.",
        "Their breasts feel lighter and heavier at once: emptying, and still so sensitive.",
        "The lines thrum with each pulse, warm against %n's belly where they run.",
        "%n catches themself rocking forward into the cups, chasing the pull.",
        "Pull, release. Pull, release. Time stops meaning much in the stall.",
        "A soft, wet suckling sound comes from the cups every time they ease off.",
        "%n's nipples tingle and ache in the best way, worked and worked and worked.",
        "The pump stutters, catches, and drives on, drawing a fresh rush out of %n.",
        "%n lets their head hang. The milk keeps coming, and so does the pull.",
        "Warm milk sloshes in the bucket as %n shifts, and the sound makes them flush.",
        "The stall has found exactly the pace %n gives most at, and it keeps it.",
        "Every pull is a little deeper now, drawing from somewhere further back in %n's chest.",
        "%n gives %s as the cups tug in perfect unison.",
        "The milk runs thick and steady, and %n can feel every drop leave them.",
        "Their skin is flushed pink around the edges of the cups, warm and damp.",
        "%n's toes curl against the straw. The suction just doesn't let up.",
        "A shiver runs through %n each time the liners squeeze down to the tip."
      ],
      build: [
        "The machine picks up its pace. %n gasps as the cups start to pull in quick, hungry pulses.",
        "Deep in the session now, %n's nipples are swollen and tender, and every pull lands like a spark.",
        "%n's knees tremble. The stall isn't gentle any more. It's thorough.",
        "The suction deepens, drawing %n's nipples further into the cups than they thought they'd go.",
        "%n moans openly now, past caring who might hear.",
        "Their breasts throb in time with the pump, hot and full and aching to give more.",
        "The bucket's well past half. %n can hear how much of themself is in it.",
        "%n's hips start to sway with the rhythm, a slow, helpless roll.",
        "Every pull sends a hot little pulse straight down between %n's thighs.",
        "%n bites their lip as the cups give a long, slow, merciless draw.",
        "The machine finds a second wind and so does %n's milk, streaming hard down both lines.",
        "%n gives %s, long and shaky, and presses into the cups.",
        "Sweat beads at %n's temple. The stall keeps working, steady as the seasons.",
        "%n's nipples are so sensitive now that even the pause between pulls makes them twitch.",
        "The cups tug hard, and %n's breath stutters out of them in little gasps.",
        "%n's grip on the rail goes white-knuckled as the stall drives on."
      ],
      heavy: [
        "The bucket is heavy now, warm milk lapping near the rim.",
        "%n's breasts are softer, emptier, but the cups don't stop pulling.",
        "The streams thin from ribbons to pulses. The stall works harder for every drop.",
        "%n sags against the rail, flushed and dazed, nipples aching from the long pull.",
        "Only short spurts now, each one drawn out by a long, slow squeeze.",
        "%n whimpers as the cups dig for what's left.",
        "The milk is thinner, sweeter. The stall takes it all the same.",
        "%n can feel how much lighter they are. The pull on their nipples feels bigger for it.",
        "The pump's note changes, lower and slower, searching.",
        "%n's breathing evens out into long, tired sighs between pulls.",
        "A last good rush runs down the lines, and %n shudders all the way through it.",
        "Their nipples are deep pink and puffy inside the cups, worked tender and loving it."
      ],
      ending: [
        "The stall slows. Long, deliberate pulls, stripping the last of it out of %n.",
        "One more squeeze, then another, then a pause. The machine is listening for anything left.",
        "%n's nipples twitch in the cups as the suction eases little by little.",
        "The final drops bead and fall. The bucket gives one last soft plink.",
        "The cups give a slow, lingering pull, almost tender, then rest.",
        "%n lets out %s as the pump winds down.",
        "The lines go quiet, a last trickle running into the bucket.",
        "The pressure fades from %n's nipples a breath at a time.",
        "The stall holds %n there a moment longer, as if admiring its work.",
        "A gentle hiss as the seal breaks on one cup, then the other."
      ],
      finish: [
        "The cups let go of %n with a soft, wet pop. %ml in the bucket, and they're down to a quarter. Sore, light, and very well milked.",
        "The stall releases %n and swings its cups away. %ml of warm milk sits foaming in the bucket.",
        "Done. %n's breasts hang soft and tender, nipples still pouting from the cups. The bucket holds %ml.",
        "With a last hiss the stall lets %n go. %ml milked out of them, and a quarter left to start over with.",
        "The pump falls silent. %n blinks slowly at the bucket: %ml, all of it theirs.",
        "The strap loosens and the cups lift away, leaving %n flushed and dripping. %ml in the pail.",
        "The stall's done with %n for now: %ml in the bucket, and two very sore, very satisfied nipples.",
        "Cups off, lines quiet, %ml in the bucket. %n wobbles a little as they straighten up."
      ]
    },
    cock: {
      open: [
        "A warm, wet sleeve slides down over %n's %c cock and seals at the base with a soft, sucking kiss.",
        "The stall's sleeve finds %n's cock and swallows it to the root, snug and slick.",
        "A padded cup settles around %n's balls while the sleeve eases down their %c cock, warm and tight.",
        "%n's breath hitches as the sleeve takes them. The machine is in no hurry, but it doesn't let go.",
        "A strap settles across %n's hips to keep them still, and the sleeve slides home over their %c cock.",
        "The sleeve is warm, wet and ribbed inside, and it closes around %n's cock like it was made for it.",
        "With a hiss the suction takes hold, drawing %n's %c cock deep into the sleeve.",
        "The stall latches on to %n below the belt: a slick sleeve on their cock, a soft cup cradling their balls."
      ],
      start: [
        "The sleeve starts slow, one long stroke from tip to root, then back again.",
        "%n's cock swells hard inside the sleeve, and the machine adjusts its grip to match.",
        "The cup around %n's balls begins to hum, a low, steady vibration that goes straight through them.",
        "Slick and warm, the sleeve works %n's %c cock in long, unhurried pulls.",
        "A bead of precum is drawn out of %n and down the line, the first of many.",
        "%n lets out %s as the sleeve finds its rhythm.",
        "The ribbed inside of the sleeve drags over every inch of %n on each stroke.",
        "Pull, squeeze, release. The machine is learning exactly what %n's cock likes.",
        "%n's hips twitch forward into the sleeve before they can stop them.",
        "The suction pulses softly at the tip, coaxing, patient.",
        "Warmth floods %n's belly. The sleeve isn't rushing them, and that's almost worse.",
        "%n's %c cock throbs in the sleeve, already leaking."
      ],
      rhythm: [
        "The sleeve strokes %n steadily, wet sounds rising from the stall with every pull.",
        "%n's hips roll in time with the machine, helpless to keep still.",
        "Precum strings down the clear line in slow, glossy drips.",
        "The cup around %n's balls squeezes gently, then lets go, then squeezes again.",
        "%n gives %s as the sleeve sucks hard at their tip.",
        "Root to tip, tip to root. The sleeve never tires, never hurries.",
        "%n's cock is flushed and slick, twitching inside the sleeve with every pass.",
        "The vibration in the ball cup shifts up a notch, and %n's thighs shake.",
        "The machine edges %n with lazy, perfect strokes, easing off just when it gets good.",
        "%n's breath comes short and ragged. The sleeve just keeps going.",
        "A warm, wet suckling sound fills the stall, the machine savoring every stroke.",
        "%n grips the rail and pushes back into the sleeve, wanting more of it.",
        "The sleeve tightens around %n's %c cock, then relaxes, then tightens again.",
        "Little spurts of precum pulse down the line. The machine takes every drop.",
        "%n's balls draw up tight in the vibrating cup, aching and full.",
        "The stall's rhythm is slow and deep, and %n's whole body is rocking to it.",
        "%n moans low in their throat as the sleeve sucks them down to the root.",
        "Their cock throbs so hard they can feel their own pulse in the sleeve.",
        "The suction at the tip pulses in a quick little flutter that makes %n gasp.",
        "%n sways in the strap, flushed, mouth open, completely given over to the machine.",
        "The sleeve picks up a little speed, slick and relentless.",
        "%n's toes curl in the straw as the sleeve drags over their most sensitive spot again and again.",
        "The machine milks %n's %c cock the way it milks everything: thoroughly.",
        "%n gives %s and their hips stutter forward.",
        "Wet heat, steady pulls, a gentle squeeze at the base. %n can't think past it.",
        "The ball cup's hum climbs and falls in waves, and %n rides every one.",
        "%n's cock leaks steadily now, and the line carries it all away.",
        "The sleeve slows to a long, torturous stroke, and %n whimpers.",
        "Every pull draws a shiver from the base of %n's spine to the tip of their cock.",
        "%n can hear the slick rhythm of the sleeve over their own heartbeat."
      ],
      build: [
        "The sleeve speeds up, pumping %n in short, hungry strokes.",
        "%n's cock swells even harder. They're close, and the machine knows it.",
        "%n's moans come louder now, raw and needy.",
        "The ball cup squeezes in time with the sleeve, and %n's knees nearly buckle.",
        "%n's hips buck into the sleeve, chasing it.",
        "The suction at the tip turns greedy, pulling hard and fast.",
        "%n gives %s, high and desperate.",
        "%n's legs shake. The sleeve is merciless and slick and perfect."
      ],
      // played in order: the climaxes tell a story
      climax: [
        "%n's %c cock jerks in the sleeve and the first thick pulse shoots down the line.",
        "They cum hard, the sleeve milking every throb out of them. The machine doesn't stop.",
        "Through the aftershocks the sleeve keeps stroking, and %n whines at how sensitive they are.",
        "Cum runs thick down the clear line into the collection jar.",
        "The machine eases off just long enough for %n to breathe, then starts building them up again.",
        "Over-sensitive and twitching, %n can only hang in the strap and take it.",
        "Another wave builds, and the ball cup hums them right up to the edge of it.",
        "%n's second load comes slower and deeper, wrenched out of them by the relentless sleeve.",
        "%n gasps and shakes as the sleeve keeps stroking, wringing out every last pulse.",
        "The sleeve slows to a crawl, and %n sags, panting, cock still throbbing."
      ],
      heavy: [
        "The jar is filling. Thick, pearly seed, all of it %n's.",
        "%n's balls feel lighter, emptier, but the cup keeps humming.",
        "The loads come thinner now, each one drawn out by a long, slow pull.",
        "%n sags against the rail, spent and twitching.",
        "%n whimpers as the sleeve strokes their over-worked cock again.",
        "Another weak spurt, and the machine takes that too.",
        "The sleeve slows, searching for what's left.",
        "%n's cock aches sweetly in the sleeve, wrung out and still hard.",
        "One more shaky climax rolls through %n, thin and long.",
        "The jar's contents glisten, and %n can't believe all that came out of them.",
        "%n's breathing is ragged, their hips barely moving now.",
        "The ball cup's hum turns soft and slow, like a petting hand."
      ],
      ending: [
        "The sleeve gives one last long stroke, root to tip, and holds.",
        "A final drop beads at %n's tip and is drawn away.",
        "The suction eases a breath at a time.",
        "The ball cup's hum fades to nothing.",
        "The machine strokes %n gently, almost kindly, winding down.",
        "%n lets out %s as the stall slows to a stop.",
        "The line goes quiet. The jar is still.",
        "The sleeve loosens its grip, slowly, letting %n's cock soften.",
        "One last little squeeze at the base, and the stall rests.",
        "A soft hiss as the seal at the root lets go."
      ],
      finish: [
        "The sleeve slides off %n's spent cock with a wet pop. %ml in the jar, balls down to a quarter. Good stud.",
        "The stall releases %n: legs wobbly, cock twitching, %ml of seed in the jar.",
        "Done. %n hangs in the strap, drained and glowing, %ml collected.",
        "The ball cup lifts away and the sleeve follows. %ml of %n's seed sits in the jar.",
        "The machine lets %n go. %ml milked from their %c cock, and they're down to a quarter.",
        "The strap loosens. %n staggers, spent: %ml in the jar.",
        "Sleeve off, cup off, jar heavy: %ml. %n won't be walking straight for a while.",
        "The stall's done with %n's cock for now: %ml collected, and one very satisfied stud."
      ]
    },
    // somebody who makes both: lines about both at once, mixed in with the breast and cock lines
    both: [
      "Cups on %n's breasts and a sleeve on their %c cock: the stall works both at once, and %n doesn't know which to moan about first.",
      "Milk runs down one line and precum down the other, and %n is shaking between them.",
      "The breast cups and the cock sleeve pulse together, and %n's whole body follows the rhythm.",
      "%n's nipples are pulled long while their cock is stroked deep, and they give %s.",
      "Both lines are full: white milk, pearly cum. The stall takes everything %n has.",
      "When the sleeve squeezes, %n's breasts let down harder. The machine has noticed.",
      "%n cums, and their milk spurts harder at the same moment, both lines pulsing at once.",
      "Every part of %n that can be milked is being milked, and they're dazed with it.",
      "The cups tug and the sleeve strokes in perfect counterpoint, a slow double rhythm.",
      "%n's legs tremble. Too much, too good, from both ends of the stall's attention.",
      "The bucket and the jar fill side by side, and %n can't stop looking.",
      "The stall drains %n's breasts and balls in lockstep, steady as a heartbeat."
    ],
    bothFinish: [
      "The cups and the sleeve let go together. %ml of milk and %ms of seed: the stall took everything %n had.",
      "Both lines fall quiet. %n is down to a quarter top and bottom: %ml in the bucket, %ms in the jar.",
      "Done with them at last. %n sways in the strap, nipples puffy and cock spent: %ml of milk, %ms of cum.",
      "The stall releases %n from cups and sleeve both. %ml and %ms, and one very dazed, very milked animal."
    ],
    atmos: [
      "Straw rustles somewhere down the row. Another stall hums to life.",
      "Warm barn air hangs heavy around %n's stall, smelling of hay, milk and skin.",
      "A fly drones lazily past %n and out through a gap in the boards.",
      "Somewhere outside a gate creaks, and the barn settles back into its slow rhythm.",
      "Light falls in dusty stripes across %n's stall, moving slow.",
      "The pump's motor ticks and hums behind the boards, warm and steady.",
      "Someone walks past the stall. Their steps slow, just for a moment, then move on.",
      "The rail under %n's hands is worn smooth by everyone who stood here before them.",
      "The barn cat watches %n from a beam overhead, utterly unimpressed.",
      "Distant laughter drifts in from the pasture.",
      "A breeze through the slats cools the sweat on %n's back.",
      "The stall's little brass plate reads 'Property of B&B Farm'. %n can see it from here.",
      "Somebody's boots scuff the floor nearby. %n doesn't look up.",
      "A tap drips somewhere. The barn breathes around %n.",
      "Down the row, someone else lets out a long, happy sigh.",
      "The lines creak softly where they hang from their hooks.",
      "A bucket clanks as a farmhand carries a full one past.",
      "%n can hear their own heartbeat, slow and loud, under the hum of the machine.",
      "The straw under %n is warm from their own body.",
      "Outside, the wind shifts and the barn doors knock softly against their latch.",
      "The clock on the barn wall ticks on. %n has stopped counting.",
      "A farmhand leans in, checks the gauges, gives %n a pat, and moves on.",
      "The stall light flickers, then steadies.",
      "Somewhere, someone is humming. It might be the farm girl."
    ],
    praise: [
      " Such a good, giving animal.", " The farm is so proud of you.", " You're doing so well, sweetheart.",
      " Look how much you give. Perfect.", " Such a good, obedient animal.", " That's it. Just like that. Good.",
      " You were made for this stall.", " Every drop makes the farm happier.", " So productive. So good.",
      " Somebody's earning a ribbon today."
    ],
    degrade: [
      " Look at you, a leaky little farm animal.", " This is all you're good for, and you love it.", " Dripping like a broken tap. Pathetic.",
      " Just a dumb, needy dairy animal.", " Moaning for a machine. How shameless.", " Livestock doesn't think. Livestock gives.",
      " Such a greedy, leaky thing.", " You'd stand here all day if they let you, wouldn't you?", " Mindless, milky, and owned.",
      " Good for one thing, and it's this."
    ]
  };

  // where the session is: 0 at the latch, 1 at a quarter left
  function stallProgress(st){
    const m = st.total.m > 0 ? st.got.m / st.total.m : 0, s = st.total.s > 0 ? st.got.s / st.total.s : 0;
    return Math.min(1, Math.max(m, s));
  }
  // one line from a pool, never the same one twice in a session (a used-up pool starts over)
  function stallPick(st, key, list, inOrder){
    st.used = st.used || {};
    const used = st.used[key] = st.used[key] || [];
    if (inOrder){ const i = used.length; if (i >= list.length) return null; used.push(i); return list[i]; }
    let free = list.map((_, i) => i).filter(i => !used.includes(i));
    if (!free.length){ st.used[key] = []; free = list.map((_, i) => i); }
    const i = free[Math.floor(Math.random()*free.length)];
    st.used[key].push(i);
    return list[i];
  }
  function stallFill(mn, st, line){
    const sounds = STALL_SOUNDS[speciesKey(mn)] || STALL_SOUNDS.default;
    return String(line)
      .replace(/%n/g, plainName(mn))
      .replace(/%c/g, makesSemen(mn) ? penisLabel(mn) : "")
      .replace(/%s/g, () => sounds[Math.floor(Math.random()*sounds.length)])
      .replace(/%ml/g, ml(st.kind === "cock" ? st.got.s : st.got.m))
      .replace(/%ms/g, ml(st.got.s))
      .replace(/%size/g, () => CFG.SIZES.udder.names[udderLevel(mn)-1] || "full")
      .replace(/%cup/g, () => CFG.SIZES.udder.cups[udderLevel(mn)-1] || "D")
      .replace(/%balls/g, () => CFG.SIZES.testes.names[sizeOf(mn, "testes")-1] || "full")
      .replace(/%len/g, () => sizeOf(mn, "penis")+"-inch");
  }
  // the next line of their story (finish: the last one, with how much came out)
  function stallBeat(mn, st, finish){
    const S = STALL_STORY, r = rec(mn) || {};
    st.beats = (st.beats||0) + 1;
    let line;
    if (finish) line = st.kind === "both" ? stallPick(st, "bothFinish", S.bothFinish) : stallPick(st, st.kind+"Finish", S[st.kind].finish);
    else if (st.beats === 1) line = stallPick(st, "open", S[st.kind === "cock" ? "cock" : "milk"].open);
    else {
      const prog = stallProgress(st);
      // which part (breasts or cock) this line is about; somebody who makes both gets both, and lines about both
      let part = st.kind === "both" ? (Math.random() < 0.5 ? "milk" : "cock") : st.kind;
      const phase = prog < 0.08 ? "start" : prog < 0.45 ? "rhythm" : prog < 0.75 ? (part === "cock" && prog >= 0.55 ? "climax" : "build") : prog < 0.92 ? "heavy" : "ending";
      // what they've got (breast size, cock type, knot, balls, pregnancy, heat, piercings, species): about a third of the middle
      const trait = ["rhythm","build","heavy"].includes(phase) && st.lastKind !== "trait" && Math.random() < 0.33 ? stallTraitLine(mn, st, part) : null;
      if (trait){ line = trait; st.lastKind = "trait"; }
      // the first climax, then that kind of cock's own big moment
      else if (phase === "climax" && st.peakNext){ line = stallPeakLine(mn); st.peakNext = false; st.lastKind = "climax"; }
      else if (["rhythm","build","heavy"].includes(phase) && st.lastKind !== "atmos" && Math.random() < 0.15){ line = stallPick(st, "atmos", S.atmos); st.lastKind = "atmos"; }
      else if (st.kind === "both" && ["rhythm","build"].includes(phase) && Math.random() < 0.3){ line = stallPick(st, "both", S.both); st.lastKind = "both"; }
      else {
        line = phase === "climax" ? stallPick(st, "climax", S.cock.climax, true) : null;
        if (phase === "climax" && line && st.used.climax.length === 1) st.peakNext = true;
        if (!line) line = stallPick(st, part+"-"+(phase === "climax" ? "build" : phase), S[part][phase === "climax" ? "build" : phase]);
        st.lastKind = phase;
      }
    }
    let out = stallFill(mn, st, line);
    // a little praise or degradation for folks who asked for it, now and then
    if (!finish && st.beats > 1 && Math.random() < 0.25){
      if (r.degradeMe) out += stallPick(st, "degrade", S.degrade);
      else if (r.praiseMe) out += stallPick(st, "praise", S.praise);
    }
    return out;
  }
