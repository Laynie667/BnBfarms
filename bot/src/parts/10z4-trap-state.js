  /* WHAT'S IN THIS FILE (10z4-trap-state.js)
     EVERY TRAP MEETS THE BODY IT CAUGHT, AS IT IS RIGHT NOW (Laynie, Oct 27: "immersive, detailed, non-clinical,
     expansive message pools for all traps... that covers all the various factors, like gender, equipment, species,
     fullness, and all those variables"). Each trap's own story still runs as written. Woven through every one of them:
     • A BEAT about the state they're in (two on ?intensity filthy): carryin' a litter (just caught, showin', heavy,
       overdue) or a clutch of eggs; a belly sloshin', or stuffed past full; a hole still full from the last one; udders
       fit to burst, or milked flat; balls heavy, or drained; in heat; denied; right on the edge; already a mess; a
       parasite, a symbiote or the livin' suit on them; big tits, huge balls, a big cock; their species; what they wear.
       Where a kind of trap has its own way of meetin' that state (bred, held, milked, made a mess of, teased, watched:
       DEPTH_KIND, 10ud-trap-depth.js), the beat is mostly that kind's.
     • A SENTENCE on about a third of the beats that hadn't one (bodyTail, 10y9d-body-fit.js, goes first): their ears,
       tail, hooves, coat and the noises their kind makes; their gag, bell, collar, leash, plugs, belt or cage, nose
       ring, hooves, heels, latex, harness, or nothin' at all; their size; how full, how pregnant, how milked.
     stateOf(mn) says what's true of them. Every line is picked for the body it's about ({v} {c} {t} and the rest).
     %n name · %w where they're held ("the rubber kennel"; "the trap" if it didn't say)
  */
  if (CFG.STATE_TAIL_CHANCE === undefined) CFG.STATE_TAIL_CHANCE = 0.3;
  if (!CFG.STATE_BEATS) CFG.STATE_BEATS = { tender: 1, rough: 1, filthy: 2 };
  const SP_GROUP = { cow: "cow", bull: "bull", pony: "horse", horse: "horse", deer: "deer", pig: "pig", pup: "dog", dog: "dog", kitt: "cat", cat: "cat",
                     goblin: "goblin", bunny: "bunny", rabbit: "bunny", fox: "fox", wolf: "wolf", goat: "goat", sheep: "sheep", rat: "rat" };
  const STATE_GEAR = ["gag", "ringGag", "blind", "hood", "collar", "leash", "bell", "arms", "paws", "legs", "nipples", "breastGear", "chastity", "cage",
                      "plugFront", "plugBack", "harness", "noseRing", "ears", "tail", "hooves", "heels", "latex", "naked"];
  // what's true of them right now
  function stateOf(mn){
    const s = {}, now = Date.now();
    try {
      const p = prodOf(mn), b = bodyOf(mn);
      if (p){
        const held = p.held ? heldTotal(p) : 0, cap = Math.max(1, capacity(mn));
        if (held > cap) s.over = true; else if (held > cap*0.55) s.slosh = true;
        if (p.held){ if (b.vulva && (p.held.vulva || 0) >= 40) s.heldV = true; if ((p.held.butt || 0) >= 40) s.heldB = true; if ((p.held.mouth || 0) >= 60) s.heldM = true; }
        if (p.preg){ const f = (now - p.preg.since) / Math.max(1, p.preg.due - p.preg.since); s[now >= p.preg.due ? "overdue" : f >= 0.7 ? "pregHeavy" : f >= 0.3 ? "pregShow" : "pregEarly"] = true; }
        if (p.eggs && p.eggs.n > 0) s[p.eggs.n >= 8 ? "eggsMany" : "eggs"] = true;
        if (makesMilk(mn)){ const f = (p.milk || 0) / Math.max(1, milkCap(mn)); if (f >= 0.95) s.milkBurst = true; else if (f >= 0.6) s.milkFull = true; else if (f < 0.12) s.milkDry = true; }
        if (b.cock){ const f = (p.semen || 0) / Math.max(1, CFG.PROD.SEMEN_CAP); if (f >= 0.9) s.ballsHeavy = true; else if (f < 0.2) s.ballsDry = true; }
        if (inHeat(p)) s.heat = true;
        if ((p.deniedUntil || 0) > now) s.denied = true;
        if (p.painted && p.painted.until > now) s.messy = true;
        if (b.tits){ const u = udderLevel(mn); if (u >= 11) s.hugeTits = true; else if (u >= 7) s.bigTits = true; }
        if (b.cock){ if (sizeOf(mn, "testes") >= 8) s.bigBalls = true; if (sizeOf(mn, "penis") >= 12) s.bigCock = true; }
        if (b.vulva && sizeOf(mn, "vulva") >= 5) s.gapedV = true;
        if (sizeOf(mn, "butt") >= 5) s.gapedB = true;
      }
      if (arousalOf(mn) >= 75) s.edge = true;
      if (parasiteOn(mn)) s.parasite = true;
      const sk = symKind(mn); if (sk) s["sym_"+sk] = true;
      if (suitOnNow(mn)) s.suit = true;
      const sp = SP_GROUP[speciesKey(mn)]; if (sp) s["sp_"+sp] = true;
      const g = gearSense(mn);
      for (const k of STATE_GEAR) if (g[k]) s["g_"+k] = true;
      if (s.g_cage) delete s.g_chastity;   // (a cage has its own)
      if (s.g_gag) delete s.g_ringGag;
      if (charFor(mn) && !s.g_naked) s.g_dressed = true;
    } catch(e){}
    return s;
  }
  const whereOf = (mn) => { const r = rec(mn); return r && r.penned && r.penned.trap && r.penned.name ? r.penned.name : "the trap"; };
  function weighOut(keys, w){
    const tot = keys.reduce((a, k) => a + w(k), 0); let x = Math.random()*tot;
    for (const k of keys){ x -= w(k); if (x <= 0) return k; }
    return keys[keys.length - 1];
  }
  const fitFor = (mn, pool) => { const b = bodyOf(mn); return (pool || []).filter(l => tagsFit(l, b) && wordsFit(l, b)); };
  // a beat or two about the state they're in, woven into the back half of the story (trapRun, 10u-traps.js)
  const STATE_BEAT_W = { overdue: 6, pregHeavy: 5, pregShow: 4, pregEarly: 3, eggsMany: 5, eggs: 4, over: 5, slosh: 3, heldV: 2, heldB: 2, heldM: 1,
    milkBurst: 5, milkFull: 2, milkDry: 2, ballsHeavy: 2, ballsDry: 1, heat: 5, denied: 3, edge: 2, messy: 2, parasite: 4, sym_latex: 3, sym_moss: 3,
    sym_nestling: 3, suit: 4, hugeTits: 3, bigTits: 2, bigBalls: 2, bigCock: 1, gapedV: 1, gapedB: 1, g_ringGag: 2, g_bell: 2, g_noseRing: 2, g_cage: 2,
    g_chastity: 2, g_collar: 0.5, g_dressed: 0.5 };
  function stateBeats(mn, kind, beats){
    try {
      if (!Array.isArray(beats) || beats.length < 3) return beats;
      const n = CFG.STATE_BEATS[intensityOf(mn)]; if (!n) return beats;
      const s = stateOf(mn), fams = DEPTH_KIND[kind] || ["tease"], out = beats.slice(), used = new Set(), where = whereOf(mn);
      for (let i = 0; i < n; i++){
        const keys = Object.keys(s).filter(k => STATE_BEAT[k] && !used.has(k) && fitFor(mn, [].concat(...Object.values(STATE_BEAT[k]))).length);
        if (!keys.length) break;
        const k = weighOut(keys, x => STATE_BEAT_W[x] || (/^sp_/.test(x) ? 2 : /^g_/.test(x) ? 1.5 : 1)); used.add(k);
        const P = STATE_BEAT[k], fam = fams.find(f => fitFor(mn, P[f]).length), own = fam ? fitFor(mn, P[fam]) : [], any = fitFor(mn, P.any);
        const pool = own.length && (Math.random() < 0.67 || !any.length) ? own : any.length ? any : own;   // their kind's own, two times in three
        if (!pool.length) continue;
        const line = pickFresh("state:"+k+":"+(pool === own ? fam : "any"), pool).replace(/%w/g, where);
        const lo = Math.max(1, Math.ceil((out.length - 1) / 2)), at = lo + Math.floor(Math.random()*(out.length - lo));
        out.splice(at, 0, [line]);
      }
      return out;
    } catch(e){ return beats; }
  }
  // one more sentence about them, on about a third of the beats that hadn't one
  const STATE_TAIL_W = { overdue: 4, pregHeavy: 4, pregShow: 3, pregEarly: 2, eggsMany: 4, eggs: 3, over: 4, slosh: 3, heldV: 2, heldB: 2, heldM: 1,
    milkBurst: 4, milkFull: 2, milkDry: 2, ballsHeavy: 2, ballsDry: 1, heat: 4, denied: 2, edge: 2, messy: 1.5, parasite: 3, sym_latex: 2, sym_moss: 2,
    sym_nestling: 2, suit: 3, hugeTits: 2, bigTits: 2, bigBalls: 2, bigCock: 1.5, gapedV: 1, gapedB: 1, g_dressed: 1, g_collar: 1, g_ears: 1 };
  function stateTail(mn, kind, i){
    try {
      if (i < 2 || Math.random() >= CFG.STATE_TAIL_CHANCE) return "";
      const s = stateOf(mn), keys = Object.keys(s).filter(k => STATE_TAIL[k] && fitFor(mn, STATE_TAIL[k]).length);
      if (!keys.length) return "";
      const k = weighOut(keys, x => STATE_TAIL_W[x] || (/^sp_/.test(x) ? 3 : /^g_/.test(x) ? 1.5 : 1));
      return " "+tFill(pickFresh("stail:"+k, fitFor(mn, STATE_TAIL[k])), mn);
    } catch(e){ return ""; }
  }

  // ── the beats: any = whatever the trap · breed held mess milk tease watched = that kind of trap's own ──
  const STATE_BEAT = {
    pregEarly: {
      any: ["Somebody's hand finds the soft new curve low on %n's belly and stays there, warm, like they're checkin' on what's growin' in there.",
            "%n's belly has only just started to round, and whoever's handlin' them keeps pattin' it, proud, like it was all their doin'.",
            "\"Took, did it?\" somebody murmurs, runnin' a thumb over the little swell of %n's belly. \"Barely showin', and already so needy.\"",
            "Carryin' early has made %n tender all over. Every touch lands twice as hard as it should, and they gasp at things that wouldn't have moved them last week.",
            "{t}%n's tits have gone full and sore with the litter just startin' in them, and every jolt makes them throb.",
            "There's a warm, sleepy heaviness low in %n that wasn't there before, and it makes them sway into every hand that comes near."],
      breed: ["\"Already bred,\" somebody laughs, \"and still takin' more. Greedy thing.\" And they give %n more anyway, slow and deep, palm spread over the little swell of their belly.",
              "Bein' bred again with a litter just started in them, %n feels every stroke settle low and warm, right where it's already growin'.",
              "It doesn't matter that %n's already caught. Whoever's in them breeds them like it's the first time, both hands on the small new curve of their belly."],
      held: ["Held still, %n can't even curl round the little swell of their belly. It's out there for anybody's hands, and plenty of hands find it."],
      milk: ["{t}The litter just startin' in %n has brought their milk in early, and it comes down thin and sweet and much too quick."],
      tease: ["Somebody draws slow circles on the little curve of %n's belly with one fingertip, round and round, and it does terrible things to them."],
    },
    pregShow: {
      any: ["%n's belly is round and full now, a proper swell under their ribs, and it rocks heavy with every jolt.",
            "The litter in %n shifts and rolls right in the middle of it all, and %n gasps and grabs at nothin'.",
            "Hands keep findin' %n's round belly: rubbin', pattin', feelin' for kicks. Nobody asks first. Nobody ever does with stock that's showin'.",
            "\"Look at the size of you,\" somebody croons, both palms on %n's belly. \"Fillin' out lovely, you are.\"",
            "{t}Carryin' has made %n's tits heavy and dark-nippled, and they swing over the round of their belly with every jolt.",
            "%n's back aches with the weight in front of them, and everything bein' done to them comes up against the round of that belly first.",
            "Somethin' in %n kicks, hard, right at the worst moment, and %n lets out a startled little noise that makes everybody grin."],
      breed: ["Round with one litter, %n's bred for the next anyway: slow, deep strokes that rock their full belly and make it bump soft against whatever's under them.",
              "Whoever's breedin' %n has both hands on their pregnant belly, holdin' it, feelin' it rock with every thrust.",
              "%n's belly is so round now it lifts them up off whatever they're bent over, and every push from behind rocks them on it like a rockin' chair.",
              "\"Already full,\" somebody murmurs, sinkin' in deep, \"and you still want it. You just love bein' bred, don't you.\""],
      held: ["Whatever's holdin' %n was never made for somebody carryin', and the swell of their belly presses tight against it at every point.",
             "%n's held with their pregnant belly hangin' heavy and on show, and every passin' hand gives it a rub."],
      milk: ["{t}Carryin' has %n's milk comin' in rich and heavy, and it lets down in long hot pulls every time the litter shifts."],
      mess: ["Whatever's bein' poured on %n runs down over the round of their belly and drips off the bottom of it in long, slow strings."],
      tease: ["Somebody kneels and kisses %n's round belly, right in the middle, and then lower, and lower, and stops just where %n needs them not to."],
      watched: ["Folk stop to look at %n's belly as much as anythin' else, pointin', guessin' out loud how many are in there."],
    },
    pregHeavy: {
      any: ["%n's so heavy with their litter they can barely shift their own weight, belly huge and tight and low, and everything has to happen round it.",
            "The litter in %n is big now, and busy, rollin' and kickin', and every jolt sets the whole tight round of their belly movin'.",
            "Big as a barrel and due any day, %n pants and sways, and their belly takes up the whole of the world in front of them.",
            "Somebody holds %n's huge belly up from underneath with both hands, takin' the weight, and %n nearly sobs at the relief of it.",
            "{t}%n's tits are swollen fat and leakin' with what their litter's goin' to need, and they drip on the round of their belly with every move.",
            "%n's belly is stretched so full and tight it shines, and the hands on it can feel everything inside.",
            "Everything's harder this heavy, and slower, and %n's whole body is one long ache of bein' full."],
      breed: ["Heavy as they are, due any day, %n's still bred: slow, careful, endless strokes that rock their huge belly and set the litter kickin'.",
              "%n's belly is so big now it rests on the ground under them, and whoever's breedin' them holds their hips up off it to get at them properly.",
              "\"One more for luck,\" somebody says, and breeds %n deep, though there's no room left anywhere in them for luck to go.",
              "Every thrust shoves %n's huge belly forward, and it rolls back heavy, and the litter inside kicks at bein' disturbed."],
      held: ["%n's held fast with their huge belly hangin' low and heavy, and every strap or rope or hand has to go round it, under it, over it.",
             "Restrained this heavy, %n can't shift the weight at all. They just hang there, round and full and puffin', while it all goes on."],
      milk: ["{t}So close to due, %n's milk is pourin' in thick and constant, and it hardly needs drawin' at all: it just runs."],
      tease: ["Somebody runs their fingertips down the tight round of %n's belly, slow, from the top all the way to the bottom, and %n shivers the whole length of it."],
      watched: ["A little crowd gathers to see how big %n's got, and somebody starts a pool on whether they'll drop the litter right here."],
    },
    overdue: {
      any: ["%n's overdue, belly huge and hard and achin', the litter pressin' low, and every jolt feels like it might be the one that starts it.",
            "Past their time and still carryin', %n's whole body feels ready to burst, and it's all they can think about.",
            "A cramp rolls through %n's huge belly, tight and long, and then lets go. Not yet. Nearly.",
            "\"Overdue,\" somebody tuts, both hands on %n's belly. \"We'll have to shake that loose.\" They don't mean anythin' gentle by it.",
            "{t}%n's tits run with milk all the time now, so full and so overdue the drips never stop.",
            "%n's belly sits so low and so heavy they can't do anythin' but sway with it, pantin', waitin' on a body that won't let go."],
      breed: ["They say a good breedin' brings an overdue one on, and the farmhands are bein' very thorough about provin' it on %n."],
      held: ["Held still and overdue, %n can feel every shift and press of the litter, low and heavy, with nowhere at all for it to go."],
    },
    eggs: {
      any: ["The clutch inside %n clicks and shifts with every jolt, warm smooth eggs knockin' together somewhere deep.",
            "%n can feel the eggs in them, every one, round and heavy, pressin' on everything they press on.",
            "Somebody presses a palm low on %n's belly, feels the clutch shift under it, and grins.",
            "Every time %n clenches, the eggs in them roll, and every time they roll, %n clenches.",
            "There's a slow, heavy fullness in %n from the clutch they're carryin', and it makes everythin' else feel tighter."],
      breed: ["Whatever's breedin' %n pushes right up against the clutch already in them, and the eggs shift deeper to make room.",
              "Every thrust knocks against the eggs %n's carryin', and they clack softly, and %n moans at the strange full ache of it."],
      held: ["Held tight, %n can't shift the eggs in them, and they settle heavier and lower the longer they're kept."],
      tease: ["Somebody rolls the clutch inside %n with slow pressure from outside, one egg at a time, and %n's toes curl."],
    },
    eggsMany: {
      any: ["%n's packed so full of eggs their belly's lumpy with them, round shapes pressin' out under the skin, shiftin' with every breath.",
            "So many eggs in %n that every move grinds them together, and the full, stretched ache never lets up.",
            "%n's belly bulges with the clutch, and somebody counts the lumps out loud, and loses count, and starts again.",
            "There's no room in %n that isn't egg, and their body keeps tryin' to push, and keeps not bein' allowed."],
      breed: ["With a clutch that big already in them, every stroke into %n drives the eggs deeper, grindin', and %n wails at how full it makes them."],
      held: ["Held still with a belly full of eggs, %n can feel the clutch slowly settle, heavier and lower, pressin' on everything."],
    },
    slosh: {
      any: ["%n's belly sloshes with everything they've already taken today, and every jolt sets it rollin' warm inside them.",
            "There's so much in %n already their middle has rounded out with it, and it gurgles when they're moved.",
            "Somebody pats %n's full belly, listens to it slosh, and laughs.",
            "%n can feel what they're holdin' shift and settle inside them, heavy and warm, every time they move.",
            "%n's belly is round and tight with it, and nobody's stoppin' to let it settle."],
      breed: ["Already sloshin' full from earlier, %n takes more anyway, and they can feel the new load push the old one deeper.",
              "Every stroke into %n squelches with what's already in there, and some of it gets pushed back out round whatever's fillin' them."],
      mess: ["Full as %n already is inside, they're bein' made a mess of outside too, and they couldn't say where one stops and the other starts."],
      milk: ["Full belly, full udders, and the farm's still drawin' and still givin': %n's never felt so much like somethin' to be filled and emptied."],
      held: ["Held still with a belly that heavy, %n can feel every slow slosh, and can't do a thing to ease it."],
    },
    over: {
      any: ["%n's stuffed past full, belly tight as a drum, and it's leakin' back out of them as fast as anythin' goes in.",
            "There's no room left in %n anywhere, and every new push squeezes some of what's already there back out in a hot spill.",
            "%n's belly is round and hard and gurglin', so full it aches, and nobody seems to think that's a reason to stop.",
            "Overfull and drippin' from every hole they've got, %n can't tell any more what's leakin' out and what's bein' pushed in.",
            "Somebody presses on %n's swollen belly, gentle, just to see, and a warm gush runs out of them, and they both moan."],
      breed: ["There's no room in %n for another load, and they're bein' given one anyway, and it all comes runnin' back out round whatever's in them.",
              "Every thrust into %n's overfull belly squelches loud enough to hear across the barn, and it runs down their thighs in streams."],
      mess: ["Overfull inside and covered outside, %n is drippin' from every part of them at once."],
      held: ["Held fast and stuffed past full, %n can't curl up round the ache. It just sits in them, tight, while everything else goes on."],
    },
    heldV: {
      any: ["{v}%n's pussy is still full from the last one, and every jolt sends a warm trickle of it runnin' out of them.",
            "{v}%n's still drippin' from earlier, pussy sloppy and swollen, and whoever's handlin' them notices right away.",
            "{v}There's a load already sittin' in %n's pussy, and they can feel it every time they clench."],
      breed: ["{v}%n's pussy is still full from the last stud, and the next one slides in through it with a wet, filthy sound, pushin' it deeper.",
              "{v}\"Somebody's been here already,\" says whoever's breedin' %n, feelin' how slick and full they are, and doesn't mind one bit."],
    },
    heldB: {
      any: ["%n's ass is still full from earlier, and it leaks with every jolt, warm and slow down the backs of their thighs.",
            "There's a load sittin' in %n's ass from before, and it shifts warm inside them every time they're moved."],
      breed: ["%n's ass is already sloppy with somebody else's load, and the next one sinks into it with a wet push, and it squelches out round them."],
    },
    heldM: {
      any: ["%n's still got the taste of the last load in their mouth, and their belly's warm with everything they've swallowed today.",
            "%n hiccups, soft and embarrassed, and it tastes of what they've been swallowin' all day."],
    },
    milkBurst: {
      any: ["{t}%n's udders are fit to burst, swollen hard and hot, and every jolt squeezes a hot spray of milk out of them.",
            "{t}%n's tits are so full they ache, tight and shinin', leakin' milk down their belly in white streams.",
            "{t}Somebody brushes one of %n's swollen teats, barely a touch, and it sprays across the floor.",
            "{t}Milk runs off %n's nipples in steady drips, too full to hold it if they tried, and every bounce sends more.",
            "{t}%n's udders are so heavy with milk they pull, and the throb of them is louder in %n's head than anything else.",
            "{nt}%n's chest is tight and swollen, hard with milk, and it beads and runs from both nipples."],
      milk: ["{t}%n's so full the milk comes out in hard hot jets the second anythin' touches their teats, and it rattles the bucket.",
             "{t}It hardly needs to draw on %n at all: their udders are so overfull it pours, and the relief makes them moan out loud."],
      breed: ["{t}Every thrust into %n squeezes their overfull udders against whatever's under them, and milk sprays out in time with it."],
      held: ["{t}Held like that, %n's swollen udders hang heavy and full, drippin' a puddle under them, and nobody's milkin' them."],
      tease: ["{t}Somebody rolls %n's swollen nipple between finger and thumb, slow, just enough to make it drip and never enough to bring it down."],
      mess: ["{t}%n's own milk is part of the mess now, sprayin' from their swollen teats every time they're jostled."],
      watched: ["{t}Folk watchin' can see the milk runnin' off %n's teats, and somebody goes to fetch a cup."],
    },
    milkFull: {
      any: ["{t}%n's tits are full and heavy, warm with milk, and they leak a little with every jolt.",
            "{t}The milk's come in, and %n's tits are tight with it, nipples stiff and beadin' white."],
      milk: ["{t}%n's full udders let down the second they're touched, warm and steady, like they've been waitin' for it all day."],
      tease: ["{t}Somebody squeezes one of %n's full tits, just once, watches the milk bead up, and doesn't do anythin' about it."],
    },
    milkDry: {
      any: ["{t}%n's tits are milked soft and empty, nipples sore and puffy and tender as anything.",
            "{t}Drained flat, %n's teats still twitch and ache, like they're tryin' to give somethin' that isn't there."],
      milk: ["{t}There's nothin' left in %n to give, and it draws on them anyway, long dry pulls on sore nipples that make them whimper.",
             "{t}%n's been milked dry already today, and their empty udders ache at every pull, and still the pulls come."],
    },
    ballsHeavy: {
      any: ["{c}%n's balls are full and heavy and achin', drawn up tight, and every jolt makes them throb.",
            "{c}There's so much built up in %n's balls they feel swollen with it, and their cock leaks a steady thread.",
            "{c}Somebody cups %n's full sack and squeezes, gentle, feelin' the weight of it, and %n's cock jerks.",
            "{c}%n hasn't emptied in far too long, and it shows: balls heavy and tight, cock drippin' at the slightest touch."],
      milk: ["{c}%n's balls are so full they're practically beggin' to be milked, and somebody's finally gettin' round to it."],
      tease: ["{c}A hand rolls %n's full balls slow in its palm, weighin' them, and lets go just as %n's cock starts to jerk."],
      breed: ["{c}%n's own balls are full and swingin', and nobody cares: today it's %n gettin' bred."],
    },
    ballsDry: {
      any: ["{c}%n's been milked dry, balls empty and soft, and their cock still twitches at every touch with nothin' left to give.",
            "{c}Drained as they are, %n's cock still tries, and a thin clear dribble is all it's got."],
    },
    heat: {
      any: ["%n's in heat, flushed and achin' and smellin' of it, and everybody near can tell.",
            "The heat in %n has them pushin' back into every touch, hips rockin' on their own, shameless.",
            "%n's skin is burnin' with heat, and the need in them is so loud they can hardly hear anythin' else.",
            "Heat has %n's whole body ready and wantin', wet and open and achin', and it doesn't care what's doin' the takin'.",
            "%n whines low and long, a heat-sick noise, and presents without bein' asked.",
            "{v}%n's in heat and their pussy's swollen and drippin' with it, slick right down their thighs.",
            "{c}Heat's got %n's cock stiff and leakin' and their hips rollin', desperate for any touch at all."],
      breed: ["In heat as %n is, bein' bred is all their body wants, and they push back onto every thrust, beggin' for it deeper.",
              "Heat makes %n greedy: they clench and squeeze at whatever's in them like they could pull a litter out of it by wantin' hard enough.",
              "%n's heat-swollen and so ready the first push goes all the way in, and they howl with the relief of it."],
      held: ["Held still in heat is a special kind of cruel: %n strains toward every touch and can't reach a single one of them.",
             "%n's in heat and tied fast, and all they can do is rock and whine and drip and wait."],
      tease: ["Teasin' somebody in heat is a farm sport, and %n's makin' it look like a good one: every barely-there touch sets them sobbin'.",
              "Nobody gives %n what their heat is screamin' for. They just touch, and stop, and touch, and watch."],
      milk: ["{t}Heat's got %n's milk runnin' as hot as the rest of them, and it lets down in long, shudderin' pulls."],
      watched: ["Everybody watchin' can smell %n's heat, and more than one of them shifts where they stand."],
    },
    denied: {
      any: ["%n's not allowed to cum, and their body hasn't been told: it climbs and climbs and has nowhere to go.",
            "Denied as they are, every touch only winds %n tighter, and they're startin' to shake with it.",
            "%n begs, out loud and shameless, to be let finish, and the answer is a pat on the head.",
            "Every time %n gets close, it all goes still, as if the whole farm knows they're not allowed."],
      tease: ["Teasin' somebody denied is easy work. %n's already right on the edge, and it takes just one finger to keep them there.",
              "%n's denied, and whoever's teasin' them knows it, and uses it, slow and cruel and smilin'."],
      breed: ["Bred hard and not allowed to cum from it, %n sobs into every stroke, so full and so close and so stopped."],
    },
    edge: {
      any: ["%n's right on the edge now, shakin', breath catchin', one touch from goin' over.",
            "Everything in %n is drawn up tight and tremblin'. They're so close they can taste it.",
            "%n's whole body is beggin' now, close and closer, and everybody can see it.",
            "A long, high noise comes out of %n, the noise of somebody hangin' right on the brink."],
      tease: ["%n's so close, and whoever's handlin' them can tell, and stops dead, and waits, and smiles."],
      breed: ["%n's so close that every thrust nearly tips them over, and they're clenchin' and gaspin' right on the edge of it."],
    },
    messy: {
      any: ["%n was already a mess before any of this, still sticky and streaked from earlier, and it's only gettin' worse.",
            "Whatever was splattered on %n before is smeared fresh now, and new mess goes right on top of the old.",
            "%n's still marked up from the last time, and folk are addin' to it like it's a guestbook.",
            "There's dried mess on %n from earlier, crackin' as they move, and fresh mess runnin' over the top of it."],
      mess: ["Already covered from the last one, %n is just layered over now, sticky on sticky, slick on slick."],
    },
    parasite: {
      any: ["The parasite on %n throbs and squeezes, tastin' everything that's bein' done to its host, and it likes it.",
            "The thing livin' on %n pulses, greedy, and pumps them a little dose of somethin' sweet to make it all feel like more.",
            "%n's parasite shivers and tightens, hungry, and %n can feel it wantin' whatever's comin'.",
            "Somethin' wet and livin' moves on %n: the parasite, stirrin', interested."],
      breed: ["The parasite on %n quivers, eager, and every root of it squeezes, like it's helpin' whatever's breedin' them.",
              "The parasite on %n tightens greedily every time a load goes in, waitin' for its share."],
      milk: ["{t}The parasite's mouths on %n's teats pull along with the milkin', greedy, stealin' a share of their own."],
    },
    sym_latex: {
      any: ["%n's livin' latex ripples over them, warm, drinkin' in every shiver they make.",
            "The latex on %n tightens and squeezes everywhere at once, pleased, like a hug from somethin' hungry.",
            "%n's second skin squeaks and creaks and clings, glossy and warm and alive."],
      breed: ["The livin' latex on %n quivers as the load goes into them, waitin' to drink its share."],
    },
    sym_moss: {
      any: ["{t}The moss on %n's chest dampens and hums, sweet-smellin', and their tits feel full and warm under it.",
            "%n's moss fluffs up, soft and green, interested in what's bein' done to its host."],
      milk: ["{t}The milk moss on %n drinks what drips, soft and greedy, and makes them let down more."],
    },
    sym_nestling: {
      any: ["Low in %n's belly the nestling turns over, slow and warm, and nudges, interested.",
            "The nestling inside %n stirs, curious, and %n can feel it waitin'."],
      breed: ["The nestling deep in %n wriggles, eager, as the load goes in, and drinks the first of it."],
    },
    suit: {
      any: ["The livin' suit on %n tightens, pleased, kneadin' them slow wherever it's spread.",
            "%n's livin' suit ripples and squeezes, and doesn't let them forget for one second that it's there.",
            "The suit on %n hums against their skin, feedin' on how worked up they are."],
    },
    hugeTits: {
      any: ["{t}%n's tits are so big they're in the way of everything: they rest on whatever's in front of them like two sacks of grain, and get handled like it.",
            "{t}It takes both of somebody's arms to lift one of %n's tits out of the way, and they take their time about it.",
            "{t}%n's enormous tits swing and slap and spill everywhere, and half the hands on the farm end up on them."],
      milk: ["{t}Tits that big make a lot of milk, and %n's do: it comes in rivers."],
      held: ["{t}Restraints weren't made for tits like %n's, and they bulge out round every strap and over every edge."],
    },
    bigTits: {
      any: ["{t}%n's big tits sway and bounce with every jolt, heavy and full, and nobody's lookin' anywhere else.",
            "{t}A hand closes round one of %n's big tits, can't hold all of it, and squeezes anyway.",
            "{t}%n's tits press and bulge against whatever they're pushed into, soft and heavy and spillin' out the sides."],
      watched: ["{t}Folk watchin' keep their eyes on %n's big tits, bouncin' with every jolt, and somebody whistles."],
    },
    bigBalls: {
      any: ["{c}%n's swollen balls hang heavy and swing with every jolt, slappin' against their thighs.",
            "{c}Somebody hefts %n's huge balls in one palm, weighin' them like fruit at the market, and whistles.",
            "{c}%n's big balls are tight and full and in the way, and they get squeezed every time somebody reaches past them."],
    },
    bigCock: {
      any: ["{c}%n's big cock sways heavy and thick, drippin' a long string, and slaps their belly with every jolt.",
            "{c}Somebody wraps a fist round %n's huge cock and gives it one long slow pull, just to feel the size of it."],
    },
    gapedV: {
      any: ["{v}%n's pussy is well-used and loose, and it opens easy, slick and hungry, like it knows what's comin'."],
      breed: ["{v}%n's pussy is so used to this by now it opens right up, loose and wet and waitin'."],
    },
    gapedB: { any: ["%n's ass is loose and well-used, and it opens far too easy for anythin' that presses on it."] },
    // their kind
    sp_cow: {
      any: ["%n lows, long and deep and helpless, a cow's noise from the bottom of the belly, and somewhere in the barn another cow answers.",
            "%n's cow ears flick and their tufted tail swishes, and they shift their weight from foot to foot like stock in a crush.",
            "{t}%n's heavy cow tits sway and swing, and somebody reaches for them out of pure farm habit."],
      breed: ["%n moos, long and shaky, as they're bred: a sound every farmhand on the place has heard a hundred times, and still grins at."],
      milk: ["{t}%n moos soft and content as their milk comes down, ears droopin', like a good cow at the end of the day."],
    },
    sp_bull: {
      any: ["%n snorts and stamps, horned head low, all that bull's strength strainin' against bein' handled, and losin'.",
            "A bellow builds in %n's big chest and comes out as a whine, and they go red right up to the horns for it."],
      breed: ["A bull bein' bred is a rare sight on any farm, and the farmhands make sure %n knows what a crowd they've drawn."],
    },
    sp_horse: {
      any: ["%n whinnies, high and ragged, and their hooves dance and their tail flags up high.",
            "%n blows hard through their nose and tosses their mane, wild-eyed, and gets a firm hand on the neck to settle them.",
            "%n's flanks are lathered and shivery and they won't stand still, so they're held still."],
      breed: ["%n's tail flags high and to the side all on its own, and they stand square and still for it, the way they were trained to."],
    },
    sp_deer: {
      any: ["%n freezes the way deer do, every muscle locked and quiverin', big ears turnin' at every sound.",
            "%n's little white tail flicks up, flashin', and their long legs tremble under them."],
    },
    sp_pig: {
      any: ["%n squeals, loud and piggy and unashamed, and their curly tail twitches, and the farmhands laugh.",
            "%n grunts and snuffles with every jolt, soft pink piggy noises, and goes pink all over."],
      breed: ["%n grunts in time with it, piggy little grunts, and their curly tail wiggles every time they're filled."],
    },
    sp_dog: {
      any: ["%n's tail is waggin' so hard it thumps, and they whine and pant and push their face into every hand that comes near.",
            "A high, needy whine squeezes out of %n, then a soft woof, and somebody tells them they're a good pup."],
      breed: ["%n's tail swings aside all on its own and they push back, pantin', tongue out, the way a good pup does when it's their turn.",
              "{c}%n's own knot swells fat at the root of their cock while they're bred, with nothin' at all to tie in."],
    },
    sp_cat: {
      any: ["%n yowls, long and wavering, tail lashin', claws out, and then the purr starts, loud, and won't stop.",
            "%n's back arches high and their tail goes straight up, the way a cat's does when it's scratched just right."],
      breed: ["%n's tail goes up and to the side and they push back with a rumblin' purr, kneadin' at whatever's under their hands."],
    },
    sp_goblin: {
      any: ["%n cackles, breathless and a bit unhinged, long ears floppin', the way goblins do when it's all gone too far to stop.",
            "%n swears in goblin, colourful and constant, and the farmhands make them say every word again, slower."],
    },
    sp_bunny: {
      any: ["%n's long ears flop and then shoot straight up, quiverin', and a hind foot starts thumpin' the boards all by itself.",
            "%n's nose wiggles quick and their fluffy tail twitches, and the farmhands say bunnies were made for this."],
      breed: ["Bunnies are made for breedin', the farm says, and %n's body is doin' its level best to prove it, pushin' back eager and quick."],
    },
    sp_fox: {
      any: ["%n yips and gekkers and pants, their big brush of a tail fluffed out twice its size, sly even now.",
            "%n's tail curls round their leg, tryin' to hide somethin' it can't, and their pointed ears go hot and red."],
    },
    sp_wolf: {
      any: ["%n throws their head back and a howl climbs out of them, half song and half sob, and it carries over the whole farm.",
            "%n growls low, then whines, then bares their throat to whoever's handlin' them, the way wolves do to the one in charge."],
    },
    sp_goat: { any: ["%n bleats, loud and wavering, stamps their little hooves and butts their horns at nothin', ornery as ever."] },
    sp_sheep: { any: ["%n baas, soft and shaky, their fleece damp and curlin' with sweat, huddlin' into it as much as they're let."] },
    sp_rat: {
      any: ["%n squeaks and chitters, whiskers quiverin', long pink tail curlin' round anythin' it can reach.",
            "%n bruxes their little teeth, grindin' them soft, and their round ears go hot and pink."],
    },
    // what they're wearin'
    g_gag: { any: ["%n tries to say somethin', somethin' important by the sound of it, and the gag turns it into a long, soggy, helpless noise. Everybody nods like they understood.",
                   "Drool's run out round %n's gag and down their chin and onto their chest, and somebody wipes it with a thumb, and wipes the thumb on %n."] },
    g_ringGag: { any: ["%n's ring gag holds their mouth wide, and somebody can't resist: two fingers slide in over their tongue and play there while everything else goes on.",
                       "With their mouth held open by the ring, every moan %n makes comes out loud and wet, and there's nothin' they can do about how it sounds."],
                 breed: ["%n's ring-gagged mouth is too invitin' to leave empty, and somebody fills it while somebody else fills the rest of them."] },
    g_blind: { any: ["Blindfolded, %n can't see what's comin' next, only feel it, and every touch lands like a surprise."] },
    g_hood: { any: ["Inside their hood %n can hear only their own hot breath and the muffled world outside, and every touch comes out of nowhere."] },
    g_leash: { any: ["Somebody takes up %n's leash and wraps it round their fist, short, and every tug brings %n's head right where they want it.",
                     "%n's leash is looped over a post and pulled tight, and they're not goin' anywhere till somebody unhooks it."] },
    g_bell: { any: ["%n's bell rings with every jolt, bright and steady, and folk at the far end of the barn turn to look, because they know what that ringin' means.",
                    "Ting, ting, ting: %n tries to hold still to stop their bell, and can't, and everybody can count."] },
    g_noseRing: { any: ["Somebody hooks a finger through %n's nose ring and steers them by it, gentle and firm, and %n's eyes water and they go wherever they're led."] },
    g_latex: { any: ["%n's latex is slick with sweat underneath and shinin' wet on top, and every hand that touches it slides and squeaks."] },
    g_naked: { any: ["Not a stitch on %n, and every inch of them is out for anybody who cares to look, and a lot of folk care to look."] },
    g_dressed: { any: ["%n's clothes are rucked up and pulled aside and hangin' off them, just far enough out of the way, and somehow that's worse than bein' bare."] },
    g_hooves: { any: ["%n's hooves skid and clatter and can't find a grip, and every time they slip, somebody catches them by the hips."] },
    g_harness: { any: ["Somebody takes hold of %n's harness by the back strap like a handle and steers them right where they're wanted."] },
    g_cage: { any: ["{c}%n's cock strains in its cage, swollen tight against the bars, and drips, because drippin' is all it's allowed.",
                    "{c}Somebody taps %n's cage with a fingernail, tink, tink, and %n's whole body jerks."] },
    g_chastity: { any: ["%n grinds against their chastity belt, desperate, and the locked steel doesn't care in the least.",
                        "{v}%n's juices leak out round the edge of their locked belt and run down their thighs, and still they can't touch."] },
    g_plugBack: { any: ["Somebody gives the base of %n's plug a slow twist, just to hear them gasp, and then another."] },
    g_plugFront: { any: ["{v}The toy already in %n's pussy grinds and shifts with every jolt, and they clench round it helplessly."] },
    g_tail: { any: ["Somebody grabs %n's tail near the root and holds on, and %n yelps and pushes back into the grip."] },
    g_collar: { any: ["Somebody hooks two fingers through %n's collar and holds them by it, close, and looks them right in the eye."] },
  };

  // ── the sentences: shorter, on the end of a beat ──
  const STATE_TAIL = {
    pregEarly: ["The little curve low on %n's belly gets another pat.", "%n's belly is only just showin', and every hand that passes finds it.",
                "Carryin' early has %n tender all over, and it shows.", "{t}%n's tits ache, full and sore with the litter startin' in them."],
    pregShow: ["%n's round belly rocks with every jolt.", "Somethin' kicks inside %n, and they gasp.", "%n's pregnant belly sways heavy under them.",
               "Somebody rubs %n's round belly on the way past, like you'd pat a good cow.", "{t}%n's heavy tits swing over the round of their belly.",
               "The litter in %n rolls over, slow, and %n's breath catches."],
    pregHeavy: ["%n's huge belly sways, so heavy they pant with it.", "The litter in %n kicks at bein' jostled.", "%n's belly is stretched so tight and round it shines.",
                "%n puffs and sways, due any day, and nobody's bein' gentle about it.", "{t}%n's tits drip on the round of their belly."],
    overdue: ["A long cramp rolls through %n's overdue belly, and passes.", "%n's overdue and achin', belly low and huge.", "Every jolt might be the one that starts %n's labour, and they know it."],
    eggs: ["The eggs in %n click softly together.", "%n's clutch shifts inside them, round and heavy.", "%n can feel every egg they're carryin' when they clench.",
           "There's a clutch in %n, and it knows when they're bein' jostled."],
    eggsMany: ["%n's lumpy, egg-stuffed belly bulges with every breath.", "So many eggs in %n they grind together with every move.", "%n's clutch is so big it shows through their belly."],
    slosh: ["%n's full belly sloshes.", "Somethin' gurgles inside %n's round belly.", "%n can feel everything they're holdin' roll inside them.",
            "%n's belly is round and tight and warm with what they've taken.", "Somebody pats %n's full belly and listens to it slosh."],
    over: ["It's leakin' out of %n as fast as anythin' goes in.", "%n's belly is tight as a drum, and still it goes on.", "Every move squelches somethin' out of %n.",
           "%n's stuffed past full and drippin' with it.", "There's no room left in %n, and nobody's stoppin'."],
    heldV: ["{v}%n's pussy drips what's already in it with every jolt.", "{v}A warm trickle from earlier runs out of %n's pussy.", "{v}%n's sloppy pussy squelches."],
    heldB: ["What's already in %n's ass leaks out down the backs of their thighs.", "%n's ass is still sloppy from earlier, and it shows."],
    heldM: ["%n can still taste the last load.", "%n's belly is warm with everything they've swallowed today."],
    milkBurst: ["{t}%n's swollen udders spray with every jolt.", "{t}Milk runs off %n's teats in white streams.", "{t}%n's tits are so full they ache, hard and hot.",
                "{t}A drip of milk swings from each of %n's nipples.", "{t}Every bounce squeezes milk out of %n's overfull tits.", "{nt}Milk beads and runs from %n's swollen nipples."],
    milkFull: ["{t}%n's full tits leak a little.", "{t}%n's nipples are stiff and beadin' white.", "{t}%n's tits are warm and heavy with milk."],
    milkDry: ["{t}%n's milked-out nipples are sore and puffy.", "{t}%n's empty udders twitch and ache.", "{t}Drained flat, %n's teats are tender to the air."],
    ballsHeavy: ["{c}%n's full balls throb.", "{c}%n's heavy balls ache with what they're holdin'.", "{c}%n's cock leaks a thread from balls fit to burst.",
                 "{c}%n's balls are drawn up tight and full."],
    ballsDry: ["{c}%n's drained cock twitches with nothin' left to give.", "{c}%n's empty balls ache anyway."],
    heat: ["%n's in heat, and every touch lands like a match on dry straw.", "%n whines, heat-sick and needy.", "%n pushes back into it without meanin' to: heat does that.",
           "The heat on %n is so strong anybody near can smell it.", "{v}%n's heat-swollen pussy drips.", "{c}Heat has %n's cock stiff and leakin'.",
           "%n's skin is flushed hot with heat, all over.", "%n's hips rock on their own, the way heat makes them."],
    denied: ["%n's not allowed to cum, and their body keeps tryin' anyway.", "%n shakes, denied and climbin'.", "%n's so wound up from bein' denied they're tremblin'.",
             "Every bit of it builds in %n, and none of it's allowed to go anywhere."],
    edge: ["%n's right on the edge, shakin'.", "%n's breath catches, close, so close.", "%n is one touch away, and everybody can tell.", "%n's toes curl hard."],
    messy: ["%n's still sticky from earlier.", "Old mess cracks on %n's skin as they move.", "%n's already-mucky skin gets muckier.", "Fresh mess runs over the old on %n."],
    parasite: ["The parasite on %n throbs, tastin' it all.", "%n's parasite squeezes, greedy.", "The thing on %n pulses, and pumps them a little somethin' sweet.",
               "%n's parasite shivers, wantin'."],
    sym_latex: ["%n's livin' latex ripples, drinkin' in every shiver.", "%n's second skin squeezes, pleased.", "The latex on %n creaks and clings."],
    sym_moss: ["{t}The moss on %n's chest dampens and hums.", "%n's moss fluffs up, sweet-smellin'."],
    sym_nestling: ["The nestling in %n's belly stirs, interested.", "Low in %n, the nestling turns over, warm."],
    suit: ["The livin' suit on %n tightens, pleased.", "%n's livin' suit kneads them slow.", "The suit on %n hums, feedin' on it."],
    hugeTits: ["{t}%n's enormous tits slap together.", "{t}%n's tits are so big they're in the way of everything.", "{t}%n's huge tits spill everywhere.",
               "{t}It takes two hands to lift one of %n's tits out of the way."],
    bigTits: ["{t}%n's big tits bounce.", "{t}%n's heavy tits sway and swing.", "{t}A hand squeezes one of %n's big tits on the way past.",
              "{t}%n's tits press and bulge against whatever's under them."],
    bigBalls: ["{c}%n's swollen balls swing heavy.", "{c}%n's big balls slap their thighs.", "{c}Somebody hefts %n's heavy sack, impressed."],
    bigCock: ["{c}%n's big cock slaps their belly.", "{c}%n's huge cock bobs and drips.", "{c}%n's heavy cock sways, leakin' a long string."],
    gapedV: ["{v}%n's loose pussy gapes, slick and hungry.", "{v}%n's well-used pussy opens far too easy."],
    gapedB: ["%n's loose ass doesn't close all the way any more.", "%n's well-used ass gapes, wet."],
    // their kind: ears, tails, hooves, coats and the noises
    sp_cow: ["%n's soft cow ears flick, and a low moo slips out of them before they can swallow it.", "%n's tufted tail swishes, slaps their own thigh, and swishes again.",
             "{t}%n's heavy cow tits sway with it, the way a good milker's should.", "A long, low moo rolls out of %n, and the barn seems to answer it.",
             "%n's ears droop and their big eyes go soft and glassy, the dumb, happy look of a cow at the trough.", "%n's tail lifts and holds, the tuft curled, without them ever decidin' to lift it.",
             "%n lows, long and shaky, a proper cow's noise, and goes pink to the tips of their ears for it.", "%n's little horns knock against whatever's in front of them, and they don't even notice.",
             "{t}A bead of milk swells at one of %n's teats and drops.", "%n stamps a foot like a cow bothered by flies, and their tail lashes."],
    sp_bull: ["%n snorts through their nose like a bull in a chute, hot and loud.", "%n's horns swing low and their thick neck goes taut, all that strength with nowhere to go.",
              "A deep bellow builds in %n's chest and comes out as a whimper, which is worse.", "%n's tufted tail lashes like a bull's tormented by flies.",
              "{c}%n's heavy bull balls swing with it, full and low.", "%n's nostrils flare, breath comin' in hard snorts.", "All that brawn, and %n's still bein' handled like a calf at the sale.",
              "%n tosses their horned head, and it does no good at all."],
    sp_horse: ["%n's ears pin flat and a high, rattlin' whinny carries right across the yard.", "%n's long tail swishes and lifts, flaggin' high the way it does when they're worked up.",
               "%n blows hard through their nose, lips flutterin', a big shaky horse's sigh.", "%n's hooves skitter and stamp, and they can't keep them still.",
               "%n tosses their mane and dances sideways as far as they're let, which isn't far.", "A long, low nicker comes out of %n, needy and embarrassed.",
               "%n's flanks shiver and twitch the way a horse's do under a fly, except it isn't flies.", "%n champs at nothin', jaw workin', like there ought to be a bit there.",
               "{f}A soft, wanton whinny, and %n's tail lifts high and to the side like a mare in season."],
    sp_deer: ["%n's big ears swivel at every sound, wide-eyed, like a deer caught in the lantern light.", "%n's little white tail flicks up, flashin' pale, the way a deer's does when it's spooked.",
              "%n's long legs tremble, all knees, like a deer on ice.", "A thin, breathy bleat escapes %n, the startled little noise deer make.",
              "%n goes stock-still the way deer do, every muscle quiverin'.", "%n's soft dappled hide prickles up in shivers wherever they're touched.",
              "%n's dark eyes go huge and wet, and their nose twitches, testin' the air.", "%n's ears flick flat back against their head, and their nose twitches."],
    sp_pig: ["%n squeals, high and loud, a proper piggy squeal that sets everybody grinnin'.", "%n's little curly tail wiggles, and every time it does somebody laughs.",
             "%n grunts with every jolt, soft piggy grunts they can't hold back.", "%n's pink skin flushes darker from their snout right down to their thighs.",
             "%n snuffles and oinks into the straw, and goes red to the ears for it.", "%n's floppy pink ears flap with every jolt.", "%n's snout wrinkles, wet and pink, snufflin' at everything.",
             "{t}%n's soft round belly and full tits wobble with every jolt."],
    sp_dog: ["%n's tail is waggin', thumpin' against their own legs, and they can't make it stop.", "A high, needy whine squeezes out of %n, and then another.",
             "%n's ears go flat and then pop up again, like they can't decide.", "%n pants with their tongue out, hot and wet, like a dog left out in the sun.",
             "A soft little woof gets out of %n before they can stop it, and somebody says \"good pup.\"", "%n's hips wiggle with their tail, all of it goin' at once.",
             "%n whimpers and nuzzles at whatever's nearest, beggin' with their whole face.", "{c}%n's knot swells at the root of their cock, fat and dark, with nowhere to go.",
             "%n's tail drags itself aside on its own, out of the way."],
    sp_cat: ["%n's tail lashes, fur all fluffed up, and their ears flatten back.", "A loud, rumblin' purr starts up in %n's chest, and they hate how loud it is.",
             "%n yowls, long and wavering, a proper alley-cat yowl that carries across the farm.", "%n's claws come out and dig into whatever's under them.",
             "%n's back arches high, tail straight up.", "%n's whiskers twitch and their pupils have gone huge and black.",
             "%n kneads at nothin' with their fingers, slow, the way a happy cat does.", "A hiss, then a mewl, then a purr, all in a row, and %n doesn't know which they meant."],
    sp_goblin: ["%n's long pointed ears droop right down, then twitch, then droop.", "A sharp goblin cackle gets out of %n in spite of everything, wild and breathless.",
                "%n bares their little fangs and swears in goblin, which the farmhands find very funny.", "%n's skin flushes darker, blotchy and hot.",
                "%n's long ears flap with every jolt.", "%n grins, wide and toothy and a bit unhinged.", "%n's clawed little feet curl and uncurl in the straw.",
                "%n chatters somethin' rude in goblin under their breath."],
    sp_bunny: ["%n's long ears flop down over their face, then shoot up straight, quiverin'.", "%n's fluffy little tail twitches, fast as a heartbeat.",
               "%n's nose wiggles, quick quick quick, and their whole face is pink.", "A hind foot starts thumpin' all by itself, thump thump thump, and %n can't stop it.",
               "%n squeaks, a tiny rabbit's squeak, high and helpless.", "%n's ears lie flat down their back, and they freeze, every bit of them tremblin'.",
               "%n's whiskers twitch and they nibble at their own lip.", "Bunnies are made for this, the farmhands say, and %n's body seems to agree."],
    sp_fox: ["%n's big brush of a tail sweeps from side to side, fluffed out twice its size.", "A sharp little yip escapes %n, then a whine, then a breathless foxy cackle.",
             "%n's pointed ears swivel at every sound, sly even now.", "%n's narrow muzzle drops open and they pant, tongue lollin'.",
             "%n's tail curls round their own leg, tryin' to hide somethin' it can't.", "%n gekkers, that chatterin' fox noise, and goes red under their fur.",
             "%n's fur stands on end in a ripple from nape to tail.", "{c}%n's knot swells at the root of their cock, and there's nothin' for it to catch in."],
    sp_wolf: ["%n throws their head back and a low howl climbs out of them, half song and half sob.", "A deep growl rolls in %n's chest, then breaks into a whine.",
              "%n's thick tail lashes, then tucks, then lashes again.", "%n's ears go flat and their lips peel back from their teeth, and they still don't stop pushin' back.",
              "%n's ruff bristles in a long ridge down their spine.", "%n bares their throat without meanin' to, the way a wolf does to the one in charge.",
              "{c}%n's knot swells thick at the root of their cock, achin' to tie with somethin'.", "A whine, a yip, and then %n's pantin' hard, tongue out, eyes half-shut."],
    sp_goat: ["%n bleats, loud and wavering, a proper goat's noise, and it echoes off the barn.", "%n's little horns knock the boards and they butt at nothin', stubborn even now.",
              "%n's short tail flicks up and down, quick as a whip.", "%n's slotted eyes have gone wide and glassy.", "%n's hooves skitter and click and won't stay put.",
              "%n stamps and bleats, ornery and flustered.", "{t}%n's full goat's udder sways heavy under them, teats stiff.", "A gruff little bleat, then a softer one, and %n's ears droop sideways."],
    sp_sheep: ["%n baas, soft and shaky.", "%n's thick fleece is damp through with sweat and clings in curls.", "%n's fluffy ears flick and droop, and their little tail wags, nervous.",
               "%n's wool's all tangled with straw now, and nobody's goin' to comb it out for them.", "A long, wobbly baa comes out of %n, and they go pink under their fleece.",
               "%n's hooves shuffle close together in the straw, a sheep that wants its flock.", "%n's soft woolly hair is pushed every which way, and it'll never lie flat again."],
    sp_rat: ["%n squeaks, high and breathless, a ratty little squeal.", "%n's long pink tail curls and uncurls and wraps round anythin' it can reach.",
             "%n's whiskers quiver and their round ears go hot and pink.", "%n's buck teeth catch their lip and they chitter, quick and nervous.",
             "A ratslut's what the farm calls %n, and right now they're earnin' it.", "%n's nose twitches nonstop, sniffin' at everything.",
             "%n's little clawed fingers grab and scrabble at whatever's near.", "%n bruxes their teeth, grindin' them soft, the way a happy rat does."],
    // what they're wearin'
    g_gag: ["Whatever %n wants to say comes out round the gag as a soggy, muffled noise.", "Drool runs out round %n's gag and strings down their chin.",
            "%n moans into their gag, and the gag keeps every word of it.", "%n's gag is soaked through, and every breath whistles through their nose.",
            "%n tries to beg, and the gag turns it into a wet, wordless mumble.", "A thread of spit swings from %n's gagged mouth with every jolt.", "%n bites down hard on their gag."],
    g_ringGag: ["%n drools helplessly through their ring gag.", "%n's ring gag holds their mouth open and ready, and everybody walkin' past notices.",
                "Every moan comes out of %n's held-open mouth loud and wet and shameless.", "Somebody pokes two fingers through %n's ring gag just to feel their tongue squirm.",
                "%n's tongue lolls in the ring, and they can't tuck it back in."],
    g_blind: ["Blindfolded, %n flinches at every touch.", "%n turns their head toward every sound, blind, guessin', and guessin' wrong.",
              "Behind the blindfold every touch lands like a surprise.", "%n can't see who's watchin'. They can hear plenty."],
    g_hood: ["Inside the hood, %n's breath is hot and loud.", "The hood hides %n's face, so all anybody sees is the body squirmin' under it.",
             "%n's hooded head turns blindly toward every touch.", "The hood muffles every sound %n makes into a soft whimper.", "Sweat runs inside %n's hood, and there's no wipin' it."],
    g_collar: ["%n's collar gets a tug now and then, just to remind them it's there.", "Somebody hooks a finger through %n's collar ring and holds them by it.",
               "%n swallows, and feels their collar move with it.", "A hand on the back of %n's collar keeps their head right where it's wanted."],
    g_leash: ["Somebody's holdin' %n's leash, short, and every tug brings them closer.", "%n's leash is wrapped twice round a fist and pulled tight.",
              "The leash on %n hangs slack, and then it doesn't.", "%n is led a step this way, a step that way, by their leash, like stock at the fair.",
              "%n's leash is looped over a post, and they're not goin' anywhere."],
    g_bell: ["%n's bell rings with every jolt, and the whole yard can count them.", "Ting, ting, ting: %n's bell gives away every single shove.",
             "%n tries to hold still so the bell will stop, and it never does.", "Folk at the far end of the barn can hear %n's bell, and they know what that ringin' means.",
             "Somebody flicks %n's bell just to make it ring, and laughs."],
    g_arms: ["With their arms bound, %n can't push anythin' away, or cover anythin' up.", "%n's tied arms strain, and the bindings creak, and that's all that happens.",
             "%n's bound wrists flex and clench, useless.", "Arms locked away, %n has to take whatever comes with nothin' but their body.",
             "%n tugs at their arm bindings out of habit, and they hold, as they always do."],
    g_paws: ["%n's mitted paws paddle at nothin', no fingers to grab with.", "Without fingers, %n can only bat at things with their padded paws.",
             "%n's mitts squeak as they clench them.", "%n's paws scrabble uselessly, and everybody watchin' finds it adorable."],
    g_legs: ["%n's bound legs can't kick, can't close, can't do much of anythin'.", "The straps on %n's legs hold them right where they were put.",
             "%n tries to squeeze their thighs together, and their leg bindings say no.", "With their legs tied, %n wobbles and leans on whatever's holdin' them up."],
    g_nipples: ["Whatever's on %n's nipples tugs with every jolt, sweet and sharp.", "Somebody flicks %n's nipple, jewellery and all, and %n jolts like they've been stung.",
                "%n's nipples have gone dark and throbbin' under what's on them.", "The little bits of metal on %n's nipples catch the light and swing."],
    g_breastGear: ["{t}Whatever's locked over %n's tits keeps them squeezed and out of reach, even their own.", "%n's chest is caged, and every jolt presses the metal to their nipples.",
                   "Nobody can get at %n's chest through what's locked on it, which only makes them try."],
    g_chastity: ["{v}%n's chastity belt keeps their pussy locked away, so all that need has nowhere to go.", "%n humps at nothin' against their belt, and the steel doesn't care.",
                 "The belt on %n is locked, and everybody knows who's got the key.", "{v}%n's juices leak out round the edge of their belt and trickle down their thighs.",
                 "Chastity steel and a needy body: %n's hips keep rockin' against it anyway."],
    g_cage: ["{c}%n's cock strains in its cage and gets nowhere, swollen tight against the bars.", "{c}A slow drip falls from the tip of %n's caged cock, all it's allowed to do.",
             "{c}%n's cage is too small for how hard they want to be, and it aches.", "{c}Somebody taps %n's cage with a fingernail, and %n whimpers.",
             "{c}Locked up and leakin': %n's caged cock dribbles every time they're pushed."],
    g_plugFront: ["{v}The plug in %n's pussy shifts with every jolt and presses right where it counts.", "{v}%n's already stuffed in front, and it makes everything else feel tighter.",
                  "{v}Whatever's seated in %n's pussy grinds against them every time they move.", "{v}%n clenches round the toy in their pussy without meanin' to."],
    g_plugBack: ["The plug in %n's ass shifts and nudges with every jolt.", "%n's plug is pushed deeper every time they're bumped from behind.",
                 "%n can feel their plug every time they clench, and they're clenchin' a lot.", "Somebody gives the base of %n's plug a little twist, just to hear them gasp."],
    g_harness: ["%n's harness creaks, and somebody uses the straps like handles.", "A hand closes round the back strap of %n's harness and hauls them into place.",
                "%n's harness pulls tight, the straps bitin' soft lines into their skin.", "The rings on %n's harness clink every time they're moved."],
    g_noseRing: ["Somebody hooks a finger through %n's nose ring and steers them by it, and %n goes where they're steered.", "%n's nose ring catches the light, and a little tug on it makes their eyes water.",
                 "A nose ring's for leadin' stock, and %n's bein' led.", "%n snorts round their nose ring, and it jingles."],
    g_ears: ["%n's ears flatten and perk with every touch, as twitchy as the real thing.", "Somebody scratches %n behind the ears, and their whole body leans into it.",
             "%n's ears droop right down, and everybody can see exactly how they're feelin'."],
    g_tail: ["%n's tail curls and lashes and gives every feelin' away.", "Somebody grabs %n by the tail and holds on.", "%n's tail lifts high, out of the way, all on its own.",
             "A tug on %n's tail, and they yelp and push back into it.", "%n's tail wags, then tucks, then wags again, like it can't make its mind up."],
    g_hooves: ["%n's hooves skid and clatter on the boards.", "Every time %n stamps, their hooves ring out like a pony's in a stall.",
               "%n's hooves can't find any grip, and they slide and splay.", "Stood in hooves, %n can't brace, can't balance, can only take it."],
    g_heels: ["%n wobbles on their heels, ankles shakin', and somebody steadies them by the hips.", "%n's heels click and slip, and every wobble pushes them back onto it.",
              "Up on their toes in those heels, %n's ass is high and on show.", "%n's calves tremble in their heels, and nobody's goin' to let them take them off."],
    g_latex: ["%n's latex squeaks with every move, slick with sweat underneath.", "%n's rubber shines wet, and every hand that touches it slides.",
              "%n's latex creaks and clings and shows off every shiver.", "Sweat pools under %n's latex and squelches when they squirm.",
              "Somebody runs a palm down %n's shiny rubber flank just to hear it squeak."],
    g_naked: ["There's not a stitch on %n, and every inch of them is out for the farm to see.", "Bare as the day they came to the farm, %n's got nothin' to hide behind.",
              "%n's bare skin is goose-pimpled and flushed, and every bit of it's on show.", "Naked as they are, %n can't hide one single twitch.",
              "Without a stitch on, every wet, shamin' detail of %n is there for anybody walkin' by."],
    g_dressed: ["%n's clothes are pushed aside, hiked up and pulled down, just enough.", "Somebody's undone %n's clothes just far enough, and left the rest to rumple.",
                "%n's clothes are twisted and rucked up and damp through.", "Every button on %n that could be undone has been."],
  };
  // ── more of their kind: each kind of stock meets bein' bred, held, milked, made a mess of, teased and watched its own way ──
  const STATE_KINDS = {
    sp_cow: {
      any: ["%n's big soft eyes go glassy and a moo comes out of them so long and low it ends in a shiver, and a farmhand pats their flank the way you'd pat any good cow.",
            "%n shifts their weight and their whole heavy body sways with it, a cow that knows it's in the barn and knows full well what the barn is for."],
      breed: ["%n plants their feet wide like a cow in the breedin' crate and lows through every stroke, ears flat, tail held off to the side for whoever's behind them.",
              "{v}%n's cow tail lifts and stays lifted, tuft curled, and their pussy's left right there on show while they're bred, the way a heifer in season stands for it."],
      held: ["%n tugs once at %w and then gives up and just stands there chewin' at nothin', placid as a cow in the stanchion, which is somehow worse.",
             "Held in %w, %n lows soft and steady, a patient cow's noise, waitin' to be seen to."],
      milk: ["{t}%n's cow udders swing heavy and full, teats long and stiff, and they moo low and grateful every time a hand closes round one."],
      mess: ["%n stands there drippin' and lowin', tail swishin' it all over their own thighs, a messy cow that's made itself a messier one."],
      tease: ["Every brush of a hand along %n's flank gets a low, wantin' moo, and the farmhands start doin' it just to hear it."],
      watched: ["A crowd leans on the rails to look %n over like a cow at the county fair, and somebody says they'd give a blue ribbon for those flanks alone."],
    },
    sp_bull: {
      any: ["%n paws at the ground with one foot, horns low, a big bull workin' itself up with nowhere at all to put it.",
            "%n's thick neck strains till the veins stand out, and for a second it looks like they might break loose. They don't."],
      breed: ["%n bellows as they're bred, deep and ragged, every ounce of all that bull's strength pinned down and spent on takin' it.",
              "{c}%n's heavy bull cock swings and drips while they're bred, a stud used like a heifer, and the crowd loves every second of it."],
      held: ["%n leans their whole weight into %w the way a bull leans on a gate, snortin', and %w doesn't so much as creak.",
             "Held in %w, %n stands with their horned head low and their sides heavin', a bull in the chute waitin' on the vet."],
      milk: ["{c}%n gets milked like a prize bull at the stud barn, steady and practical, and bellows when the first thick rope of it hits the jar."],
      mess: ["%n's thick hide is streaked and drippin' and they snort and shake their head like a bull shakin' off flies, which only spatters it wider."],
      tease: ["A hand slides over %n's big shoulders and they shiver all over like a bull bein' gentled, a snort meltin' into a whine."],
      watched: ["Farmhands stand round %n sizin' them up like a bull at auction, talkin' breadth and weight and what they'd pay, right there in front of them."],
    },
    sp_horse: {
      any: ["%n's nostrils flare wide and red and they snort, a big ragged noise, every long muscle in them standin' out under the sweat.",
            "%n's mane sticks to their sweaty neck, and they toss it, and it sticks again."],
      breed: ["%n's tail lifts high and off to the side, flagged the way horses flag in season, and they plant their hooves and take it with a long, shiverin' whinny.",
              "{c}%n's big horse cock hangs heavy and swings with every stroke while they're bred, flarin' at the tip and drippin' into the straw."],
      held: ["%n dances in %w as far as it lets them, hooves clatterin', and a farmhand holds their halter and says easy, easy, easy.",
             "Held in %w, %n stands hipshot and shiverin', ears swivellin', a horse tied at the rail waitin' its turn."],
      milk: ["{t}%n gets milked like a mare at the dairy, and they stamp and whicker and swish their tail the whole time."],
      mess: ["%n's glossy coat is lathered and streaked, mane in clumps, and they shake their whole body like a wet horse, which spreads it everywhere."],
      tease: ["Someone strokes the long line of %n's neck the way you'd settle a nervous horse, and it settles nothin'. It only makes them nicker."],
      watched: ["The crowd watches %n the way folks watch a show horse, and somebody calls out that they've got good legs on 'em, and everybody laughs."],
    },
    sp_deer: {
      any: ["%n's long throat works and a soft bleat comes out of them, and their ears flick back and forth, back and forth.",
            "%n's dappled sides heave, fast and shallow, the way a deer breathes when it's cornered."],
      breed: ["%n's little tail flicks up and stays up, flashin' white, and they tremble from ears to hooves while they're bred, too startled to do anythin' but take it.",
              "%n's slender legs shake so hard somebody has to hold them steady, and they bleat soft with every stroke."],
      held: ["Held in %w, %n is all wide dark eyes and twitchin' ears, holdin' so still they hardly breathe, like stillness might make them invisible. It doesn't.",
             "%n strains once against %w, light and quick as a deer, and then freezes again, tremblin'."],
      milk: ["{t}%n's milked slow and gentle like a doe, and their big ears droop and their eyes go soft and heavy."],
      mess: ["%n's soft dappled coat is spattered and drippin', and they shake their head, ears flappin', lookin' so surprised about it."],
      tease: ["Every touch on %n makes their skin shiver and twitch in a ripple, the way a deer's flank does under a fly."],
      watched: ["With every eye on them, %n's ears swivel to every voice at once and they look ready to bolt, if only they could."],
    },
    sp_pig: {
      any: ["%n roots their snout into whatever's in front of them and grunts, deep and contented and filthy.",
            "%n's round pink rump wiggles and their little curly tail spins like a corkscrew."],
      breed: ["%n grunts and squeals and shoves back like a sow in season, shameless about it, curly tail twitchin' with every stroke.",
              "{v}%n's pink pussy gets stuffed and they squeal, high and long, a proper piggy squeal, and the farmhands cheer."],
      held: ["%n wriggles in %w and grunts and oinks about it, a pig that won't be quiet, and gets a slap on the rump for it.",
             "Held in %w, %n snuffles at the straw and grunts low and steady, like a pig waitin' at the trough."],
      milk: ["{t}%n's soft pink tits get milked and they grunt with every pull, snout wrinkled, eyes rolled up."],
      mess: ["%n's in their element, honestly: pink and messy and gruntin', rolled in it like a happy pig in mud."],
      tease: ["Someone scratches %n just behind the ears and they go boneless, gruntin', the way a pig does when it's scratched just right."],
      watched: ["Folks gather round to look at %n like the prize sow at the fair, and somebody asks what they weigh."],
    },
    sp_dog: {
      any: ["%n's whole back end wags with their tail, and they whine up at whoever's nearest, eyes huge and beggin'.",
            "%n's ears perk at every voice, hopin' every single one of them is about to say good pup."],
      breed: ["%n drops their chest low and pushes their rump up high like a bitch in heat, tail swung aside, pantin' and whinin' for more.",
              "{c}%n's own knot swells and throbs, untied, at the root of their cock while they're bred, and every stroke makes it twitch and drip."],
      held: ["Held in %w, %n whines and paws at it and then lies down with their chin on their paws, a good pup waitin' to be let out.",
             "%n's tail thumps against %w, slow and hopeful, every time somebody walks past."],
      milk: ["{t}%n's milked on all fours, tongue out, tail thumpin' the boards, and they whimper every time the pull gets strong."],
      mess: ["%n's soaked and drippin', and they shake like a wet dog, ears floppin', and spray it over everybody standin' near."],
      tease: ["Somebody rubs %n's belly and one leg starts kickin' all on its own, and they whine, mortified and delighted."],
      watched: ["%n shows off without meanin' to, ears up, tail high, pantin', the way a dog does when everybody's lookin' at it."],
    },
    sp_cat: {
      any: ["%n's tail twitches at the tip, slow and dangerous, and then their whole body melts into a stretch they never meant to do.",
            "%n's ears swivel flat and they hiss, and then purr, and then hiss again, furious that they're purrin'."],
      breed: ["%n yowls like an alley cat in season, back dipped, tail straight up and off to the side, claws rakin' whatever's under them.",
              "%n's purr gets louder with every stroke, a rumble they can't hide, and their hands knead and knead."],
      held: ["Held in %w, %n sulks with their ears flat and their tail lashin', a cat that's been put in a carrier and will never forgive it.",
             "%n tests every inch of %w with patient claws, like a cat lookin' for the gap in a fence. There isn't one."],
      milk: ["{t}%n gets milked and their purr goes ragged, tail curlin' round the milker's wrist like a cat claimin' them."],
      mess: ["%n's fur is matted and sticky and they start washin' it with their tongue on pure instinct, which helps nobody."],
      tease: ["A hand strokes down %n's spine to the base of their tail and their rump lifts right up into it, the way a cat's does."],
      watched: ["%n pretends not to care that everybody's watchin', the way cats do, tail flickin', and fails completely."],
    },
    sp_goblin: {
      any: ["%n's long ears go bright red at the tips and they cackle, a high wheezy goblin cackle, like all this is a very good joke.",
            "%n bares their little fangs and snarls, and then grins, because no goblin can hold a grudge while they're havin' this much fun."],
      breed: ["%n cackles and swears and pushes back greedy as a goblin at a feast, ears flappin' with every stroke.",
              "Goblins breed like rabbits and brag about it after, and %n's braggin' already, between gasps."],
      held: ["Held in %w, %n picks at it with clever little claws, mutterin' in goblin, sure they'll have it open any minute. They won't.",
             "%n kicks at %w and calls it every rude name goblins have, and goblins have a lot."],
      milk: ["{t}%n gets milked and goes on cacklin' about it, a goblin who's found a new trick and wants the whole farm to see."],
      mess: ["%n's covered and drippin' and they lick their fingers clean like a goblin after a stolen pie, completely unrepentant."],
      tease: ["Somebody tweaks %n's long ear and they shriek and giggle and kick, a goblin that's ticklish all over."],
      watched: ["%n plays to the crowd the way goblins do, cheekin' the farmhands and grinnin' at the onlookers, showin' off the whole time."],
    },
    sp_bunny: {
      any: ["%n's nose goes quick quick quick and their long ears quiver, and their whole body hums like a plucked string.",
            "%n's back foot thumps three times, hard, a bunny's alarm, and nobody pays it the least bit of attention."],
      breed: ["%n's bred quick and eager, the way bunnies are, pushin' back so fast nobody else has to do any of the work.",
              "%n's long ears flop and bounce with every stroke and their tail twitches and twitches, and they squeak, high and helpless."],
      held: ["Held in %w, %n is so still you'd think they were carved out of stone, except for the nose, which never stops.",
             "%n freezes flat in %w, ears pressed down their back, every muscle quiverin', a rabbit hidin' in plain sight."],
      milk: ["{t}%n gets milked and their nose twitches with every pull, and their ears go floppy and soft."],
      mess: ["%n's fluffy tail and their soft fur are all clumped and drippin', and they look absolutely mortified about it, ears flat."],
      tease: ["Somebody strokes %n's long ears from root to tip and they go limp as a rabbit bein' held, breath quick and shallow."],
      watched: ["%n's ears swivel toward every voice in the crowd and their nose twitches like they can smell every eye on them."],
    },
    sp_fox: {
      any: ["%n grins, sharp and sly, even now, like a fox that's let itself be caught just to see what happens.",
            "%n's tail swishes slow and low to the ground, and their amber eyes follow everybody."],
      breed: ["%n yips and gekkers and pushes back like a fox in season, tail swept aside, that sly grin gone soft and stupid.",
              "{c}%n's knot swells fat and red at the root of their cock while they're bred, achin' for somethin' to tie in that isn't there."],
      held: ["Held in %w, %n works at it with clever hands, quiet and patient, a fox at the henhouse latch. It won't open.",
             "%n curls up tight in %w with their tail over their nose, pretendin' this was their idea all along."],
      milk: ["{t}%n's milked and they pant and yip, tail curlin' round their own leg, embarrassed and lovin' it."],
      mess: ["%n's lovely brush of a tail is soaked and drippin', and they look at it like it's betrayed them personally."],
      tease: ["Somebody scratches %n right at the base of the tail and their hips lift and they gekker, helpless."],
      watched: ["%n can't help showin' off when there's a crowd, tail high, ears up, the vain little fox."],
    },
    sp_wolf: {
      any: ["%n's yellow eyes half-close and a low, rumblin' growl turns into a long whine they can't hold back.",
            "%n's ears flatten and their hackles lift, all teeth and fur and fight, and then they go soft anyway."],
      breed: ["%n howls while they're bred, a long, wild, waverin' howl that carries over the whole farm, and somewhere far off in the woods, somethin' howls back.",
              "%n's hackles rise and they growl, then whine, then push back hard, the way a wolf does once it's decided who's in charge."],
      held: ["Held in %w, %n paces the few inches it allows them, back and forth, a wolf in a cage, eyes never leavin' the gate.",
             "%n snaps once at %w, teeth clackin', and then lies down with their head on their arms, watchin'."],
      milk: ["{t}%n gets milked and growls the whole time, low and constant, and never once tells anybody to stop."],
      mess: ["%n's thick fur is matted and drippin' and they shake it out, ruff to tail, a wet wolf sprayin' everybody near."],
      tease: ["Somebody ruffles %n's thick ruff and their growl cracks into a whine and their tail starts, very slightly, to wag."],
      watched: ["With the crowd watchin', %n stares right back, yellow eyes and bared teeth, and then a whine slips out and ruins it."],
    },
    sp_goat: {
      any: ["%n's yellow slotted eyes go wide and unfocused and they bleat, a long ragged complaint.",
            "%n chews at nothin', jaw workin', ornery and stubborn even with all of it bein' done to them.",
            "%n tosses their little horned head and stamps, a goat that's had enough and is gettin' more."],
      breed: ["%n bleats with every stroke, loud and indignant, and pushes back all the same, a goat that'll complain and take it anyway.",
              "{t}%n's full udder swings under them while they're bred, teats leakin' a little with every stroke."],
      held: ["Held in %w, %n butts at it with their horns, again and again, stubborn as any goat at any fence.",
             "%n tries to climb %w, because goats climb everythin', and gets nowhere at all."],
      milk: ["{t}%n's milked like a nanny on the stand, quick and practised, and they bleat and chew and stamp the whole way through."],
      mess: ["%n's shaggy coat is soaked and drippin' and they bleat, outraged, which only makes everybody laugh harder."],
      tease: ["Somebody scratches %n between the horns and they lean right into it, bleatin' soft, all the fight gone out of them."],
      watched: ["%n glares at the crowd with those strange slotted eyes, bleatin' at them, and every bleat gets a cheer."],
    },
    sp_sheep: {
      any: ["%n's woolly ears droop and they let out a long, shaky baa, soft and lost.",
            "%n huddles into their own fleece as much as they can, a sheep that wants its flock.",
            "%n's soft muzzle trembles and their eyes go wide and watery."],
      breed: ["%n baas soft and steady while they're bred, fleece bouncin', a docile little sheep that just lets it happen.",
              "%n's fleece is grabbed in two big handfuls to hold them still, and they bleat, shaky and sweet, every time."],
      held: ["Held in %w, %n stands meek and quiet, a sheep in the pen waitin' to be sheared, and every so often lets out a small baa.",
             "%n shuffles in %w as close to the side as it'll let them, huntin' for somebody to lean on."],
      milk: ["{t}%n's milked like a ewe on the stand, and they baa softly with every pull, too gentle to fuss."],
      mess: ["%n's thick fleece soaks it all up, and now it's clumped and drippin' and heavy, and they'll be wearin' it for hours."],
      tease: ["Fingers sink deep into %n's warm fleece and scratch, and they lean into it with a long, grateful baa."],
      watched: ["%n's looked over like a ewe at market, and somebody says they've a lovely fleece on 'em, and they go pink under the wool."],
    },
    sp_rat: {
      any: ["%n's whiskers twitch and their round ears flush bright pink, and they chitter fast under their breath.",
            "%n's long tail lashes and curls and they squeak, a sharp, startled little noise."],
      breed: ["%n squeaks with every stroke, quick and breathless, long tail wound tight round whoever's holdin' them.",
              "%n's bred and their little clawed hands scrabble at the boards, and they chitter and squeak and push back for more."],
      held: ["Held in %w, %n gnaws at it on pure instinct, teeth grindin' at the wood. It doesn't give.",
             "%n squeezes into the tightest corner %w allows them, whiskers quiverin', like a rat in a wall."],
      milk: ["{t}%n gets milked and squeaks with every pull, tail curlin' and uncurlin' round their ankle."],
      mess: ["%n's fur is sticky and slick and they start cleanin' it with their hands and tongue, quick and fussy, and get nowhere."],
      tease: ["Somebody strokes along %n's long tail from root to tip and they shiver and squeak and their ears go hot."],
      watched: ["%n's beady eyes dart round every face in the crowd, nose twitchin', a rat that knows every one of them is lookin'."],
    },
  };
  const STATE_KIND_TAILS = {
    sp_cow: ["%n chews at nothin', slow and placid, like a cow with its cud.", "%n's big soft eyes blink, slow, and their long lashes are wet."],
    sp_bull: ["%n lowers their horns like they mean to charge, and doesn't.", "{c}%n's bull cock twitches and drips, heavy as the rest of them.", "%n's breath comes in big hot snorts that steam in the barn air."],
    sp_horse: ["%n's lips flutter in a big wet horsey snort.", "%n's mane falls in their eyes and they toss it back, wild."],
    sp_deer: ["%n's little tail flashes white again, up and down, up and down.", "A soft bleat, then another, and %n's dark eyes shine wet."],
    sp_pig: ["%n oinks, honest and loud, and doesn't even try to hide it now.", "%n's snout twitches and snuffles, wet and pink and greedy."],
    sp_dog: ["%n's tongue lolls out the side of their mouth.", "%n's ears perk at their own name, hopeful."],
    sp_cat: ["%n's tail tip twitches, slow, a cat thinkin' about scratchin' somebody.", "A ragged little mrrp escapes %n."],
    sp_goblin: ["%n mutters a goblin curse, then giggles at it.", "%n's big eyes glint, wicked and pleased."],
    sp_bunny: ["%n's whiskers quiver and their ears flick.", "A thump of a hind foot, then another, then another."],
    sp_fox: ["%n's ears flatten and then pop up, sly again.", "%n's tail curls tight round their hips."],
    sp_wolf: ["%n's lip curls and a soft growl rumbles out.", "%n's thick tail sweeps low, then lifts."],
    sp_goat: ["%n's jaw works at nothin', chewin' stubborn.", "A bleat cracks halfway through and ends in a moan."],
    sp_sheep: ["%n bleats, small and shaky, and huddles into their wool.", "%n's woolly tail wags, quick and nervous.", "A long wobbly baa, then a gasp."],
    sp_rat: ["%n chitters fast under their breath.", "%n's pink nose twitches, wet and quick."],
  };
  for (const [k, more] of Object.entries(STATE_KINDS)) for (const [fam, l] of Object.entries(more)) ((STATE_BEAT[k] = STATE_BEAT[k] || {})[fam] = STATE_BEAT[k][fam] || []).push(...l);
  for (const [k, l] of Object.entries(STATE_KIND_TAILS)) (STATE_TAIL[k] = STATE_TAIL[k] || []).push(...l);
  if (W.__FARMHAND_TEST__) Object.assign(W, { __stateOf: stateOf, __stateBeat: STATE_BEAT, __stateTail: STATE_TAIL, __stateBeats: stateBeats, __stateTailFor: stateTail });
