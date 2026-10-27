  /* WHAT'S IN THIS FILE (10ug-wash.js)
     ?WASH, a proper scrub (Laynie, Oct 22: "?wash needs more beats, and to reliably wash all messes off"). Five beats at
     the trough: the water, the scrub twice, the rinse, the towel. When it's done, everything the farm put on them comes off:
     their Companion's messes and splatters and writing (10s-marks.js, the Companion's messes.js), what a trap left
     (mud, slime, glue, the reek), and what was painted on. Washin' somebody else (staff: ?wash <who>) tells it about them.
     Only one wash at a time each; a second ?wash while one's goin' just says so.
     FITTED TO THEM (Laynie, Oct 26: "?wash seems like it needs to be fine tuned for species, gender, and all the other
     variables, like equipment for its message pools so someone doesnt get messages that doesnt match what they have or are").
     Lines carry tags on the front, and a line is only used when every tag fits:
       their body, the usual way (10y9d-body-fit.js): {v} {nv} {c} {nc} {t} {nt} {f} {m} {fu} {fb} {nb}
       their kind: [cow] [pony] [pup] [kitt] [bunny] [goat] [deer] [pig] [fox] [goblin] [rat] · [tail] any kind with a tail
       what they've got on: [fours] on all fours (a petsuit, frog-tied) · [walk] on their own two feet · [bound] arms or
                            hands tied · [gag] somethin' in the mouth · [cage] a cock cage · [belt] a chastity belt ·
                            [latex] livin' latex or the livin' suit
       what's on them: [cum] seed on or in them · [mud] · [slime] · [sweet] syrup, honey, cake or cream · [milk] · [piss]
       and [preg] a belly with somethin' in it.
     A line with none of those fits anybody. When a fitted line is there, it's used most of the time.
  */
  const WASH_LINES = {
    start: [
      "[walk]%n steps up to the wash trough and somebody hands them a bucket, a brush and a cake of yellow soap. \"Go on, then.\"",
      "A farmhand drags the hose over to %n, thumbs the nozzle and grins. \"Hold still, you mucky thing.\"",
      "[walk]%n climbs into the big tin wash tub by the pump while a farmhand works the handle, and the first cold gush makes them yelp.",
      "[walk]The wash-down stall's free. %n steps in, the gate swings shut, and the water comes on warm from the tank on the roof.",
      "[fours]%n crawls up to the wash trough on all fours, and a farmhand pats the slab beside it. \"Up here. Stay.\"",
      "[fours]A farmhand clips a lead to %n's collar and walks them on all fours into the wash-down stall, then shuts the gate behind them.",
      "[bound]With their arms tied up the way they are, %n's not washin' anything themself. A farmhand rolls up their sleeves.",
      "[bound]A farmhand takes one look at %n's bound arms, sighs, and fetches the long-handled brush. \"Right. I'll do it, then.\"",
      "[cow]%n is led into the cow wash like any other heifer comin' in from the field, and the hose is already runnin'.",
      "[pony]%n is walked into the wash bay like a pony after a long ride, cross-tied, and the farmhand checks the water's warm.",
      "[pup]\"Bath time,\" says the farmhand, and %n's ears go back. They get scooped into the tub anyway.",
      "[kitt]%n takes one look at the tub and tries to bolt, the way every kitty does, and gets caught by the scruff.",
      "[bunny]%n is lifted into the wash tub like a rabbit, careful under the middle, and set down in the warm water.",
      "[pig]%n is hosed off in the pen first, because no pig gets into the clean tub straight out of the wallow.",
      "[goat]%n is tied up by the trough like any other goat at bath time, already tryin' to chew the soap.",
      "[deer]%n edges up to the wash trough like a skittish doe, and the farmhand keeps their voice low and their hands slow.",
      "[fox]%n gets the fox treatment: a farmhand on each side and the gate shut, because a fox will try to slip off wet.",
      "[goblin]A goblin at the wash trough is a rare sight, and two farmhands hold %n there while a third fills the bucket.",
      "[rat]%n gets fished out of the hayloft by the tail and dunked in the wash tub, squeakin' all the way down.",
      "[gag]%n can't say much round what's in their mouth, so the farmhand does the talkin': \"In you get. This won't take long.\"",
      "[mud]%n's so caked in mud that the farmhand hoses them off at the gate before they're allowed anywhere near the clean water.",
      "[cum]%n comes up to the trough drippin' and sticky, and the farmhand just shakes their head and reaches for the big bar of soap.",
      "[sweet]%n is so sticky with the farm's sweet things that they squeak on the slab, and the bees have already found them.",
      "[slime]%n is still green and slick in places, and the farmhand pulls on rubber gloves before they start.",
      "[latex]The livin' latex on %n shines under the pump. The farmhand eyes it, decides to wash round it, and gets on with it.",
      "[preg]A farmhand helps %n settle onto the low wash stool, careful of that heavy belly, and brings the water to them.",
    ],
    scrub: [
      "The brush goes round in hard soapy circles, shoulders first, then down the back, and the water underneath runs every colour of the farm.",
      "Soap suds pile up on %n like a snowdrift, and a farmhand scrubs behind their ears and under their chin.",
      "Every crease gets the brush: elbows, knees, the backs of the thighs, the soft places between. %n squirms and the farmhand just scrubs harder.",
      "{t}The suds go on thick over %n's tits and the brush works round and round them, slow, till every sticky streak is gone.",
      "{t}A soapy hand lifts each of %n's tits in turn and washes underneath, thorough, where the mess always hides.",
      "{nt}The farmhand scrubs %n's chest flat-handed, quick and brisk, down over the ribs and back up.",
      "{c}A soapy hand works down %n's cock and balls, thorough as a groom with a show bull, and doesn't hurry.",
      "{c}{nv}The farmhand soaps %n's balls in one hand and rinses the other, and %n's cock has opinions about it.",
      "{v}The farmhand soaps between %n's legs with a flat warm hand, front to back and again, till the last of the mess slides off.",
      "{v}{nc}Warm water goes between %n's legs from a jug, and a soapy hand follows it, slow, every fold.",
      "{fu}A soapy hand gets %n's cock and the pussy under it both, one after the other, and nothin' gets missed.",
      "{fb}The farmhand scrubs down %n's soft thighs and their pretty little cock, and %n goes pink to the ears.",
      "{nb}The farmhand works over %n from collar to knees with a soft cloth, thorough and matter-of-fact.",
      "[cow]The farmhand scrubs %n like a show heifer the night before the fair: curry comb, then the soft brush, then the soap.",
      "[cow]{t}The farmhand washes %n's udders like a dairy hand would, warm cloth and gentle, and checks each teat as they go.",
      "[pony]%n is groomed as much as washed: soap on a sponge, then the curry comb in circles, then the body brush with the grain.",
      "[pony][tail]The farmhand works soap through %n's tail and combs it out strand by strand, like a show pony's.",
      "[pup]%n gets lathered up like a muddy dog, suds to the ears, and can't stop wigglin' while the farmhand scrubs.",
      "[pup][tail]%n's tail won't stop waggin', and it flicks suds all over the farmhand, who just scrubs faster.",
      "[kitt]%n hisses and squirms through the whole scrub like any wet kitty, and the farmhand just keeps a firm hold and gets it done.",
      "[kitt][tail]The farmhand runs soap down %n's tail and %n yowls like it's the worst thing that's ever happened to them.",
      "[bunny]%n gets washed soft and slow, ears last, the way you'd wash a nervous rabbit, and their nose never stops twitchin'.",
      "[pig]%n gets a stiff brush and a lot of elbow grease, the way you'd scrub down a show pig, and still looks pleased about the mud.",
      "[goat]%n keeps tryin' to eat the soap while they're scrubbed, and the farmhand keeps takin' it back.",
      "[deer]The farmhand washes %n slow and quiet, a hand on their flank the whole time, the way you'd gentle a doe.",
      "[fox]%n's scrubbed head to tail, and the farmhand fluffs their tail up in the suds just to watch it get huge.",
      "[goblin]It takes two goes with the brush to find out what colour %n actually is under all that, and the farmhand's surprised.",
      "[rat]%n gets scrubbed behind the ears and down the tail with a little bristle brush, squeakin' indignant the whole time.",
      "[fours]%n stays on all fours on the slab while the farmhand scrubs them from neck to rump, like washin' down any other farm animal.",
      "[bound]The farmhand washes round every strap and rope on %n, liftin' each one, scrubbin' under it, and settlin' it back.",
      "[gag]Suds run down round the gag in %n's mouth, and the farmhand wipes their chin with the cloth, quick and kind.",
      "[cage]The farmhand rinses round the cage on %n with a jug of warm water, carefully, and taps it once with a finger. Still locked.",
      "[belt]The chastity belt gets a scrub of its own, all round the edges, and the farmhand doesn't so much as look for the key.",
      "[latex]The soap slides right off the livin' latex. It ripples, clean on its own, and the farmhand only has to wash the skin it's left bare.",
      "[cum]The cum comes off in sticky strings, and the farmhand has to go over %n twice before the soap even lathers.",
      "[cum]{v}The farmhand rinses %n out from between the legs with a warm jug, and what comes out goes down the drain in long white ropes.",
      "[cum]{nv}A warm jug and a patient hand, and the farm's seed comes out of %n's ass and goes swirlin' off down the gutter.",
      "[mud]The mud comes off in brown sheets, and then in clumps, and then it's the bits that dried in, and those take a nail brush.",
      "[slime]The slime peels off %n in cold green strips, and the last of it has to be picked out of their hair.",
      "[sweet]The syrup won't shift with plain water, so the farmhand works warm soap into it till it lets go, sweet-smellin' suds everywhere.",
      "[milk]The milk's dried tacky on %n's skin, and it comes up white in the suds and smells like the dairy.",
      "[piss]The farmhand scrubs extra hard where %n was used as a toilet, and adds a second cake of soap for good measure.",
      "[preg]The farmhand washes %n's big round belly slow and careful, in long strokes, and gets a kick for their trouble.",
    ],
    rinse: [
      "Then the rinse: a whole bucket over the head, cold, and the suds run off %n in a white sheet and gurgle away down the drain.",
      "The hose sweeps over %n from crown to heels, slow, chasing the last of the soap, and the water at their feet runs clear at last.",
      "Somebody tips a bucket of warm water over %n's head, then another, then a cold one for luck, and the farm's mess goes swirlin' off down the gutter.",
      "%n shuts their eyes while the water pours, and every last drip of it washes off clean.",
      "[walk]%n stands under the pump with their face tipped up while the farmhand works the handle, and it all runs off.",
      "[fours]%n stays on all fours while the hose goes over them, nose down, and the water drips off their chin and belly.",
      "[bound]The farmhand turns %n round by the arm, rinses the back, turns them again, rinses the front. %n doesn't get a say.",
      "[pony]The farmhand sponges %n off and then scrapes the water off them with a sweat scraper, the way you'd do a pony.",
      "[pup]%n shakes halfway through the rinse and soaks the farmhand, who swears and keeps the hose on them.",
      "[kitt]%n puts up with the rinse with the face of a kitty who'll be holdin' this against everybody for days.",
      "[cow]The farmhand hoses %n down the way you'd hose off a heifer before milkin', and runs a hand down each leg after.",
      "[pig]%n gets the rinse and immediately looks round for somethin' to roll in. The farmhand holds the gate shut.",
      "[latex]The water beads and runs off the livin' latex, and it gleams under it like a fresh-polished boot.",
      "[cum]The last of the cum slides off %n and down the drain, and the farmhand sluices the slab after it.",
      "[preg]The farmhand pours warm water down over %n's belly, slow, and lets it run off the curve.",
    ],
    dry: [
      "A rough towel, a brisk rub all over, and %n steps out pink and squeaky and smellin' of nothin' but soap. Clean, for now.",
      "The farmhand wraps %n in a sun-warm towel and rubs them dry. Not a speck left on them. It won't last.",
      "%n is towelled off, fluffed up and sent on their way scrubbed raw and clean as a new pail. The farm will fix that soon enough.",
      "Wrung out, rubbed down and squeaky clean from scalp to toes, %n is turned loose smellin' of yellow soap.",
      "[pup]Wrung out and rubbed down, %n shakes off the last drops like a dog, all over the farmhand's boots.",
      "[pony]The farmhand rubs %n dry like a foal, a cooler blanket over their back after, and walks them out clean.",
      "[kitt]%n is rubbed dry in a towel and sulks in it for a long minute, the cleanest and crossest kitty on the farm.",
      "[cow]%n gets rubbed dry and a bit of shine combed into them, ready for the milkin' line or the show ring.",
      "[bunny]%n is bundled in a towel and patted dry, ears and all, and set down blinkin' and fluffy.",
      "[pig]%n gets dried off and lasts about a minute before they're lookin' for the wallow again.",
      "[goat]%n is towelled off and immediately starts eatin' the towel.",
      "[deer]%n is rubbed down soft and let go, and they bound off clean and shy into the yard.",
      "[fox]%n's tail is towelled into a huge orange puff, and they strut off like it was their idea.",
      "[goblin]%n is dried off and looks almost respectable, which won't last the hour.",
      "[rat]%n is rubbed dry in a scrap of towel, whiskers and all, and scampers off clean for once.",
      "[fours]%n is towelled off where they stand, on all fours, and sent trottin' out of the stall with a pat on the rump.",
      "[bound]The farmhand dries %n off, straps and ropes and all, and leads them out by the arm, because %n's not wavin' anyone goodbye.",
      "[latex]The farmhand towels the bare skin round the livin' latex and leaves the latex to dry itself, which it does, smug.",
      "[preg]%n is helped up off the stool, dried, and wrapped in a warm blanket round that belly.",
    ],
  };
  // what's true about them right now, for the [tags]
  const WASH_KIND = { cow: "cow", bull: "cow", pony: "pony", horse: "pony", pup: "pup", dog: "pup", wolf: "pup", kitt: "kitt", cat: "kitt",
                      bunny: "bunny", rabbit: "bunny", goat: "goat", sheep: "goat", deer: "deer", pig: "pig", fox: "fox", goblin: "goblin", rat: "rat" };
  const SWEET = /^(honey|maple|chocolate|strawberry|cake|cream|mash|caramel|icing|cocoa|eggnog|peppermint)$/;   // (the seasons' sweet ones too)
  function washFacts(mn){
    const f = new Set(), r = rec(mn) || {}, now = Date.now();
    try {
      const k = WASH_KIND[speciesKey(mn)]; if (k){ f.add(k); if (k !== "goblin") f.add("tail"); }
      const C = charFor(mn), worn = new Map(((C && C.Appearance) || []).map(a => [a.Asset && a.Asset.Group && a.Asset.Group.Name, a.Asset && a.Asset.Name]));
      const has = (g, re) => worn.has(g) && (!re || re.test(String(worn.get(g))));
      const fours = has("ItemLegs", /Petsuit|Frogtie/) || has("ItemArms", /Petsuit/) || /AllFours|Hogtied/.test(String((C && C.ActivePose) || ""));
      f.add(fours ? "fours" : "walk");
      if (has("ItemArms") || has("ItemHands")) f.add("bound");
      if (has("ItemMouth") || has("ItemMouth2") || has("ItemMouth3")) f.add("gag");
      if (has("ItemVulva", /Chastity|Cage/)) f.add("cage");
      if (has("ItemPelvis", /Chastity/)) f.add("belt");
      if ((typeof symKind === "function" && symKind(mn) === "latex") || (typeof suitOnNow === "function" && suitOnNow(mn))) f.add("latex");
      const p = prodOf(mn) || {}, d = r.dirt || {}, m = r.messKinds || {};
      if (p.preg || (p.eggs && p.eggs.n > 0)) f.add("preg");
      if ((p.held && heldTotal(p) > 20) || (p.painted && p.painted.until > now) || m.cum > now - 3*3600000) f.add("cum");
      if (d.mud || r.muddy > now - 3*3600000 || m.mud > now - 3*3600000) f.add("mud");
      if (d.slime || m.slime > now - 3*3600000) f.add("slime");
      if (d.piss || m.piss > now - 3*3600000) f.add("piss");
      if (m.milk > now - 3*3600000) f.add("milk");
      if (Object.keys(m).some(x => SWEET.test(x) && m[x] > now - 3*3600000)) f.add("sweet");
    } catch(e){ warn("wash facts:", e); }
    return f;
  }
  // what mess the farm last put on them (bodyMark tells it: 10s-marks.js), so the wash knows what it's scrubbin'
  function messNoted(mn, payload){
    try {
      const r = rec(mn); if (!r || !payload) return;
      if (payload.wash){ r.messKinds = null; return; }
      if (!payload.splat && !payload.mess) return;
      r.messKinds = r.messKinds || {}; r.messKinds[payload.mess || (payload.color ? "other" : "cum")] = Date.now();
    } catch(e){}
  }
  const WASH_TAGS = /^(\[[a-z]+\])+/;
  function washPick(t, key, pool, facts){
    const b = bodyOf(t), fits = pool.filter(l => { const m = l.match(WASH_TAGS); return (!m || m[0].slice(1, -1).split("][").every(x => facts.has(x))) && tagsFit(l.replace(WASH_TAGS, ""), b); });
    const own = fits.filter(l => WASH_TAGS.test(l)), plain = fits.filter(l => !WASH_TAGS.test(l));
    const use = own.length && (Math.random() < 0.7 || !plain.length) ? own : plain.length ? plain : pool.filter(l => !WASH_TAGS.test(l));
    return pickFor(t, key, use.map(l => l.replace(WASH_TAGS, "")));
  }
  function washNow(t){
    bodyMark(t, { wash: true });   // their Companion: the messes, the splatters, the writing (10s-marks.js)
    const r = rec(t); if (r){ r.messKinds = null; r.rinse = null; }
    const p = prodOf(t); if (p) p.painted = null;
    aftermathWash(t);              // mud, slime, glue, the reek a trap left (10x-trap-extras.js)
    saveLedger(); syncCompanions(true);
  }
  function washScene(t, by){
    state.washing = state.washing || new Map();
    if (state.washing.get(t) > Date.now()){ tell(by, "🚿 "+(t === by ? "You're" : plainName(t)+" is")+" already at the wash trough, sugar."); return; }
    if (!onMap(t)){ washNow(t); tell(by, "🚿 All washed up, sugar: everything the farm put on "+(t === by ? "you" : plainName(t))+" is off."); return; }
    const beats = ["start", "scrub", "scrub", "rinse", "dry"], gap = CFG.WASH_BEAT_S*1000, facts = washFacts(t);
    state.washing.set(t, Date.now() + beats.length*gap + 5000);
    const beat = (k, i) => {
      try {
        emote("🚿 "+tFill(washPick(t, "wash:"+k+":"+i, WASH_LINES[k], facts), t), t);
        if (i === beats.length - 1){ washNow(t); state.washing.delete(t); }
      } catch(e){ warn("wash:", e); washNow(t); state.washing.delete(t); }
    };
    beats.forEach((k, i) => i === 0 ? beat(k, i) : later(() => beat(k, i), i*gap));   // (the first one at once, so they know it's started)
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __washFacts: (m) => [...washFacts(m)], __washPick: (m, k) => washPick(m, "t:"+k+":"+Math.random(), WASH_LINES[k], washFacts(m)), __washLines: () => WASH_LINES });
