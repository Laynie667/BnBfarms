  /* WHAT'S IN THIS FILE (10u3-anthro-traps.js)
     More traps for the test subjects (10u-traps.js runs them): the ones with somebody waitin' in them. Every one is
     a two-legged anthro stud or dam (a person: they talk, they have hands, they choose), with a cock off the farm's own list, and goes in the stud book under its own name.
     Spots: ?spot set trap-wolves, trap-stallion, trap-bull, trap-warren, trap-boar, trap-toms, trap-drake, trap-naga,
     trap-kennel, trap-hive, trap-goat, trap-sow.
     Not ?breedable: nothin' goes inside, the loads go over them. Hard limits and the safeword rule, same as every trap.
     In the lines: %n their name · %c the cock · %h the hole · %ml how much · %x how many
  */
  // loads: how many · ml: each · hold: minutes held · hole: where they like it best · bonus: how likely it takes
  const ANTHRO = {
    wolves:   { sire: -10, name: "the wolf pack",        type: "canine",   loads: 5, ml: 140, hold: 9, hole: "vulva", bonus: 1.8, where: "the wolf den" },
    stallion: { sire: -11, name: "the stallion stud",    type: "equine",   loads: 1, ml: 520, hold: 4, hole: "vulva", bonus: 1.3, where: "the stallion's stall" },
    bull:     { sire: -12, name: "the bull",             type: "human",    loads: 1, ml: 380, hold: 5, hole: "vulva", bonus: 1.4, where: "the head gate" },
    warren:   { sire: -13, name: "the buck rabbits",     type: "human",    loads: 10, ml: 55, hold: 8, hole: "vulva", bonus: 2.5, where: "the warren", litter: [4, 8] },
    boar:     { sire: -14, name: "the boar",             type: "canine",   loads: 2, ml: 420, hold: 9, hole: "vulva", bonus: 1.7, where: "the sty" },
    toms:     { sire: -15, name: "the barn toms",        type: "feline",   loads: 2, ml: 90,  hold: 4, hole: "vulva", bonus: 1.3, where: "the hayloft" },
    drake:    { sire: -16, name: "the drake",            type: "draconic", loads: 1, ml: 300, hold: 7, hole: "vulva", bonus: 1.2, where: "the drake's nest", eggs: true },
    naga:     { sire: -17, name: "the naga",             type: "double",   loads: 2, ml: 160, hold: 5, hole: "vulva", bonus: 1.3, where: "the naga's coils", both: true },
    kennel:   { sire: -18, name: "the mastiff",          type: "canine",   loads: 2, ml: 200, hold: 8, hole: "butt",  bonus: 1.4, where: "the kennel" },
    hive:     { sire: -19, name: "the hive queen",       type: "draconic", loads: 1, ml: 120, hold: 5, hole: "butt",  bonus: 0,   where: "the hive", eggs: true },
    goat:     { sire: -20, name: "the billy goat",       type: "human",    loads: 1, ml: 130, hold: 3, hole: "mouth", bonus: 0,   where: "the goat post" },
    sow:      { sire: -21, name: "the old sow",          type: "human",    loads: 1, ml: 260, hold: 6, hole: "vulva", bonus: 1.5, where: "the matron's lap" },
  };
  function anthroSireName(mn){ for (const k in ANTHRO) if (ANTHRO[k].sire === mn) return ANTHRO[k].name; return null; }
  Object.assign(TRAP_KINDS, {
    wolves:   { icon: "🐺", what: "a den of wolf-men who take turns, and every one of them knots", limit: /\b(gang|knot)/i },
    stallion: { icon: "🐴", what: "a stallion stud, far too big, who fills you till you waddle", limit: /\b(size|inflat)/i },
    bull:     { icon: "🐂", what: "a bull-man who locks your neck in the gate and milks you while he ruts you", limit: null },
    warren:   { icon: "🐇", what: "a burrow full of buck rabbits, quick, one after another", limit: /\b(gang)/i },
    boar:     { icon: "🐗", what: "the boar that lives in the wallow, and a long, muddy tie", limit: /\b(mud|filth|humiliat|knot)/i },
    toms:     { icon: "🐈", what: "two barn toms with barbs that leave you in heat", limit: /\b(barb|pain)/i },
    drake:    { icon: "🐉", what: "a dragon-man who breeds you on his nest and leaves a clutch", limit: null },
    naga:     { icon: "🐍", what: "a naga who coils you up and takes two holes at once", limit: /\b(double|coil|snake)/i },
    kennel:   { icon: "🐕", what: "a latched kennel and a mastiff who trains you on his knot", limit: /\b(knot|anal|cage)/i },
    hive:     { icon: "🐝", what: "a hive queen who feeds you honey and lays in you", limit: /\b(insect|bug)/i },
    goat:     { icon: "🐐", what: "a billy goat who puts you on your knees and uses your mouth", limit: /\b(oral|throat)/i },
    sow:      { icon: "🐖", what: "a big matron who nurses you drowsy, then breeds you with what's under her apron", limit: /\b(nurs|futa)/i },
  });

  function anthroScene(mn, kind, spot){
    const A = ANTHRO[kind], T = ANTHRO_LINES[kind], r = rec(mn), p = prodOf(mn), P = CFG.PENIS_TYPES[A.type];
    const hole = r.breedable ? openHole(mn, A.hole) : null, v = { c: P.label, h: hole ? TRAP_HOLE[hole] : "" };
    trapHold(mn, A.hold, A.where);
    trapRun(mn, kind, T.beats.concat(hole ? T.in : T.over), () => {
      const icon = TRAP_KINDS[kind].icon;
      let total = 0, took = null;
      for (let i = 0; i < A.loads; i++){
        const load = A.ml * (0.8 + Math.random()*0.4) * (P.loadX || 1);
        if (hole){ total += trapFill(mn, hole, load, CFG.TRAP_OVERFULL); tally(mn); } else total += load;
      }
      if (hole && A.both && hole !== "butt" && !holeBlocked(mn, "butt")) total += trapFill(mn, "butt", A.ml, CFG.TRAP_OVERFULL);
      v.ml = ml(total);
      if (hole && hole !== "mouth" && A.bonus && r.fertile && canCatchIn(mn, hole)){
        took = rollConception(mn, A.sire, total, A.bonus, hole);
        if (took === "new" && A.litter && !limitBlocks(mn, "breed")) p.preg.count = Math.max(p.preg.count, A.litter[0] + Math.floor(Math.random()*(A.litter[1] - A.litter[0] + 1)));
      }
      // a clutch, from the ones that lay
      if (hole && A.eggs && !limitBlocks(mn, "eggs")){
        const [lo, hi] = CFG.EGG_COUNT, hyper = hyperEggs(mn, 0.1);
        v.x = String(layClutch(mn, (lo + Math.floor(Math.random()*(hi - lo + 1))) * (hyper ? 3 : 1), A.sire));
      }
      emote(icon+" "+tFill(pickFresh("trap:"+kind+":end", hole ? T.end : T.endOver), mn, v)+(took === "new" ? " "+tFill(pickFresh("trap:anthro:took", ANTHRO_TOOK), mn, v) : ""), mn);
      if (hole) splatBody(mn, hole); else { splatBody(mn, "back"); splatBody(mn, "face"); }
      // what each one leaves behind besides
      if (kind === "bull" && makesMilk(mn)) drainMilk(mn, p.milk);
      if (kind === "boar") bodyMark(mn, { splat: ["face", "chest", "tummy"], color: "#6b4a2b" });
      if (kind === "toms" && !limitBlocks(mn, "heat")) startHeat(mn, BOTMN(), 1);
      if (kind === "hive" && makesMilk(mn)) addBoost(p, "milk", 24*3600000, 1);
      if (kind === "kennel" && hole && hole !== "mouth"){
        const part = hole === "butt" ? "butt" : "vulva";
        p.kennelN = (p.kennelN || 0) + 1;
        if (p.kennelN % 3 === 0 && CFG.SIZES[part] && hasPart(mn, part)) setSize(mn, part, sizeOf(mn, part) + 1, true);
      }
      if (kind === "goat" && r.watersports){ bodyMark(mn, { splat: ["face", "chest"], color: CFG.PISS_COLOR }); r.pissed = (r.pissed || 0) + 1; }
      if (kind === "sow"){ const fed = trapFill(mn, "mouth", 200, CFG.TRAP_OVERFULL); if (fed > 0) p.milk = Math.min(milkCap(mn), p.milk + fed * CFG.PROD.SWALLOW_TO_MILK); }
      face(mn, hole ? "bred" : "afterglow", 120); arouse(mn, 40);
      r.anthro = r.anthro || {}; r.anthro[kind] = (r.anthro[kind] || 0) + 1;
    }, v);
  }

  const ANTHRO_TOOK = ["And from the way %n's belly tightens after, that one took.", "Somethin' catches, low in %n's belly. They're carryin' now.", "That'll be a litter. %n just doesn't know it yet."];
  const ANTHRO_LINES = {
    wolves: {
      beats: [
        ["%n ducks under a low beam into the dark, and the dark growls. Yellow eyes open in the straw, and the wolf-men who own them stand up on two long legs, one after another.",
         "The door swings shut behind %n. Somethin' big and shaggy unfolds itself off the hay bales, then two more: wolf-men, tall and lean, noses twitchin'."],
        ["The biggest one has %n by the scruff before they can turn, and pushes them down onto hands and knees. The other two circle, sniffin' at their neck, their belly, under their tail.",
         "A clawed hand closes on the back of %n's neck and bends them over. Rough tongues and cold noses go everywhere at once, and the pack decides they'll do."],
        ["\"Hold still, little thing,\" the big one rumbles, and settles his weight over %n's back. They can feel him against them, hot and slick and already swellin' at the root.",
         "They sort out who goes first with one snarl. The winner drapes himself over %n, teeth restin' on their shoulder, hips already huntin'."],
      ],
      in: [
        ["He finds %n's %h and drives his %c cock in to the root, ruttin' fast and hard, and then the knot swells and pops inside and %n is tied to him, squirmin', while he pumps them full.",
         "He hilts in %n's %h in one shove and ruts hard and fast till his knot locks behind the ring of them. %n yelps. He just growls and floods them."],
        ["The second one doesn't wait for the first knot to go all the way down. He pulls %n off it, wet and gapin', and ties them himself. Then the third takes his turn.",
         "When the first one finally slips out, the next is already mountin'. %n gets knotted again, and again, passed down the pack till every one of them has bred their %h."],
      ],
      over: [["They rut against %n one after the other, between their thighs, along the cleft of their ass, across their back, teeth in their scruff the whole time, markin' what they can't breed."]],
      end: ["Three knots, three loads: %ml of wolf seed packed in %n's %h, and it runs out of them in a slow stream when the pack lets them crawl away.",
            "The pack lies back in the straw, lickin' their chops. %n staggers out bow-legged with %ml in their %h and tooth marks on their neck."],
      endOver: ["The pack leaves %n in the straw, striped with %ml of seed across their back and ass and stinkin' of wolf."],
    },
    stallion: {
      beats: [
        ["%n walks past the end stall and a hand the size of a shovel comes over the half door and takes them by the hip. It belongs to the stallion stud: a horse-headed man, seven feet of black hide and muscle.",
         "The stall door bangs open as %n goes by. The stallion stud who lives in it is seven feet of black hide and muscle, and he's been waitin' on a mare."],
        ["He lifts %n clean off their feet and folds them over the rail like a saddle blanket. \"Stand,\" he says, and nudges their ankles apart with a hoof.",
         "He turns %n round, bends them over the feed bin and holds them there with one hand flat between their shoulders. He isn't rough about it. He doesn't need to be."],
        ["Then somethin' heavy and hot thumps down along %n's back, from tail to shoulder blades: the whole length of him, flared at the tip, slick and still growin'.",
         "%n looks back over their shoulder and wishes they hadn't. His cock hangs past his knees, mottled pink and black, with a head on it like a fist."],
      ],
      in: [
        ["He lines the flare up with %n's %h and leans. It doesn't fit. He leans harder, and it does, and %n's eyes go wide as inch after thick inch follows it in.",
         "The flat head of it presses %n's %h open, slow and merciless, and sinks. Their belly bulges out round the shape of him before he's halfway."],
        ["He ruts %n in long, heavy strokes that lift their feet off the floor, and when he's close the flare swells up inside them like a stopper so not a drop gets out.",
         "He takes his time, hilt to tip, every stroke shovin' the breath out of %n. Then he snorts, slams deep, and the head of him blooms wide inside."],
      ],
      over: [["He lays the whole length of it in the cleft of %n's ass and ruts against them, long slow strokes, pre runnin' down their back like warm oil."]],
      end: ["He cums like a hose: %ml, straight into %n's %h, and their belly swells round and tight with it. When he pulls out it comes back down their legs in a flood, and they can barely walk.",
            "The stallion empties %ml into %n's %h in a dozen thick pulses, pats their rump and steps back. %n slides off the rail, gapin' and sloshin', with a gut like a full feed sack."],
      endOver: ["He snorts and hoses %n down from hair to heels, %ml of it, rope after heavy rope. They're left drippin' in the straw like a bucket was tipped over them."],
    },
    bull: {
      beats: [
        ["%n leans over the stanchion to look at somethin' shiny in the feed trough, and the head gate clanks shut round their neck.",
         "The neck bars swing closed on %n with a clang. Behind them, hooves the size of dinner plates come round the end of the row."],
        ["He's a bull-man, wide as the door, ring in his nose, a milkin' pail in one hand. \"Stand quiet, heifer,\" he says, deep enough to rattle the bars, and hooks a stool over with his hoof.",
         "A huge warm hand runs down %n's flank like he's settlin' a nervous cow. \"Easy. Easy now.\" The pail goes down under their chest."],
        ["He takes hold of %n's teats in his big fingers and starts to strip them, firm and slow, with a milker's patience, and the pail starts to ring.",
         "Thick fingers close on %n's chest and pull, squeeze, pull. Whatever they've got starts comin' out of them in thin hot streams, and he hums while he works."],
      ],
      in: [
        ["Then he stands up behind them, still milkin' with one hand, and pushes his thick %c cock into %n's %h with the other on their hip. \"Lets down better with a bull in you.\"",
         "He doesn't stop milkin' to mount. He just leans over %n's back, fat cock sinkin' into their %h, and goes on strippin' their teats in time with his hips."],
        ["He ruts %n slow and deep and heavy, the stanchion creakin', the pail ringin', and every thrust squeezes another spurt out of them.",
         "%n hangs in the head gate gettin' milked from the front and bred from behind, bawlin' like a heifer, and he works them through it without missin' a pull."],
      ],
      over: [["He milks %n with one hand and strokes himself against their flank with the other, heavy and slow, snortin' steam down the back of their neck."]],
      end: ["He grunts, hilts, and pumps %ml into %n's %h while his hands wring the last drops from their teats. Then he opens the gate, picks up his pail, and leaves them drained at one end and full at the other.",
            "A long low bellow, and %n's %h is flooded with %ml of bull seed. He strips them dry, slaps their rump, and lets the bars swing open. \"Good heifer.\""],
      endOver: ["He finishes across %n's back, %ml in thick hot ropes, wrings their teats dry into the pail and opens the gate. \"Good heifer.\""],
    },
    warren: {
      beats: [
        ["The turf gives way under %n and they slide down a short earth chute into a round, warm burrow full of twitchin' noses.",
         "%n puts a foot in a rabbit hole and the whole bank caves in. They land on their back in a soft dark den, and a dozen long ears swivel toward them."],
        ["Buck rabbits. Lean, quick, bright-eyed, and every one of them already hard. They're on %n before they can sit up, pattin', nuzzlin', tuggin' their legs apart.",
         "The bucks pile onto %n in a warm squirmin' heap, all whiskers and quick hands, turnin' them over, liftin' their hips, chatterin' to each other."],
        ["\"Me first.\" \"No, me.\" It doesn't matter. There's enough of %n to go round, and rabbits don't take long.",
         "They don't argue over %n for more than a second. There's a queue. It moves fast."],
      ],
      in: [
        ["The first one is in %n's %h and hammerin' away before they've caught their breath, hips a blur. He squeaks, shudders, spills, and the next one shoves him off and slides right into his mess.",
         "A buck mounts %n's %h and ruts so fast it buzzes. Ten seconds, a squeak, a spurt, and he's gone and there's another in his place."],
        ["Again. Again. %n loses count somewhere round the fourth, and they're not even halfway down the line. Each one's quicker than the last and leaves a little more behind.",
         "They take %n in turns and then start takin' seconds, load on top of load, till every thrust squelches and it's runnin' out round each new cock goin' in."],
      ],
      over: [["They hump whatever they can reach on %n, thighs, belly, the small of their back, a hand, quick as sewing machines, one after another."]],
      end: ["Six bucks, maybe more, and %ml between them, all of it in %n's %h. They boost %n back up the chute with a pat on the rump, bred so many times over there's no tellin' whose it'd be.",
            "When the warren's finally done with %n there's %ml of rabbit seed churned to froth in their %h. Rabbits breed true. %n climbs out on shakin' legs."],
      endOver: ["By the end %n is spattered from knees to chin, %ml in a dozen little loads, and the bucks boost them back up the chute lookin' real pleased with themselves."],
    },
    boar: {
      beats: [
        ["%n slips on the edge of the wallow and goes in on hands and knees. Somebody enormous heaves himself up out of the mud beside them and stands, on two legs, scratchin' his belly.",
         "The sty rail gives under %n and they land face down in the muck. A chuckle answers, low and close, and the boar-man who was soakin' in it stands up."],
        ["It's the boar: a tusked, bristled brute of a man with a belly like a barrel, mud to the eyes. \"Well now,\" he rumbles. \"Somebody's wandered into my pen.\"",
         "He's a boar-man, big as an outhouse and twice as ripe, and he grunts with slow delight at what's just fallen into his wallow."],
        ["He drops his weight across %n's back and shoves them down chest deep in the mud, snufflin' at the back of their neck, slobber and all.",
         "A trotter-hand plants itself between %n's shoulders and pushes their face into the muck. The rest of him settles over their hips, heavy as a sack of wet feed."],
      ],
      in: [
        ["His cock is long and thin and twisted like a corkscrew, and it screws its way up %n's %h, turnin' as it goes, deeper than seems right, till the tip locks in somewhere and stays.",
         "Somethin' slick and spiralled worms into %n's %h and keeps windin' in, pokin' and feelin' its way, and then it finds what it's lookin' for and catches fast."],
        ["Then he just lies on them and cums. For minutes. %n is pinned in the mud under a quarter ton of hog while he grunts, \"Hold still, sow,\" and pumps and pumps and pumps.",
         "Boars don't thrust. They lock and fill. %n squirms in the muck with their belly swellin' under them and he doesn't move an inch, just grunts every time another gush goes in."],
      ],
      over: [["He ruts against %n's muddy backside in short heavy shoves, pinnin' them flat in the wallow, gruntin' in their ear."]],
      end: ["When he finally rolls off there's %ml of it in %n's %h, sealed in with a thick plug of jelly the way boars do. %n crawls out of the sty caked in mud and bred like a sow.",
            "A last long grunt. %ml, and then somethin' thick that sets like wax to keep it all in %n's %h. He wanders off to the trough. %n lies in the wallow, filthy, plugged and round."],
      endOver: ["He finishes over %n's back and haunches, %ml of it, and it mixes with the mud. %n crawls out of the sty lookin' and smellin' like they belong there."],
    },
    toms: {
      beats: [
        ["Up in the hayloft somebody purrs. %n looks up the ladder, and a tomcat-man looks back down, chin on his folded arms, tail flickin' over the edge.",
         "A bale tips off the loft and lands behind %n, blockin' the door. Two tomcat-men drop down after it and land on their feet without a sound."],
        ["Barn toms: a grey one with a torn ear and a big orange one, lean and scarred, movin' like water. They wind round %n, one each side, rubbin' their cheeks along %n's ribs.",
         "Two tomcat-men circle %n with their tails up, lazy and sure of themselves. The grey one leans in and licks a stripe up %n's neck with a tongue like a wood rasp."],
        ["The orange one gets %n by the scruff in his teeth and they go limp without meanin' to. The grey one laughs, low, and tips their hips up.",
         "Teeth close on the back of %n's neck, not hard, just enough, and their knees fold. That's how you hold a queen still."],
      ],
      in: [
        ["He slides into %n's %h easy enough. It's when he draws back that %n feels the barbs, a hundred little hooks rakin' them on the way out, and they wail like a cat in the night.",
         "The tom mounts %n's %h and ruts quick and shallow, and every backstroke drags his barbs along the inside of them till their toes curl."],
        ["They swap. The second one's barbs are worse. By the time he's done, %n's body has got the message cats' bodies get: it's time, it's now, and it wants more.",
         "One, then the other, holdin' %n by the scruff the whole time. The rakin' sets somethin' off deep in them, a hot crawlin' need that wasn't there before."],
      ],
      over: [["They take turns rubbin' off against %n, teeth in their scruff, rough tongues goin' over every bit of them they like the taste of."]],
      end: ["Two quick loads, %ml in %n's %h, and the toms leap back up into the loft to wash. %n is left on their knees with their ass in the air, raked raw and yowlin' for more.",
            "They leave %ml in %n's %h and a fire in their belly that'll take an hour to burn down. The orange one looks back from the loft and winks."],
      endOver: ["They leave %n spattered with %ml, licked half raw and marked as theirs, and hop back up into the loft to wash."],
    },
    drake: {
      beats: [
        ["The top of the silo is warmer than it ought to be. %n climbs the last rung and finds a nest of straw and stolen blankets, and a pair of slitted gold eyes openin' in it.",
         "%n trips on somethin' that clinks: a pile of harness brasses and belt buckles. A scaled tail slides round their ankle. They've walked into somebody's hoard."],
        ["The drake uncoils. Bronze scales, a crest of horns, a mouth full of needles and a slow hot smile. \"A gift,\" he hisses, \"for my nest.\"",
         "He's a dragon-man, long and bronze and hot as a stove, and he pulls %n into the nest with his tail like he's rakin' in a coin."],
        ["Claws close round %n's wrists, careful as a jeweller. He lays them down in the straw, spreads them, and breathes a long warm breath over their belly that makes everything in them go loose.",
         "He pins %n in the nest under one hand and looks them over with his head tilted, the way he'd look over somethin' he means to keep."],
      ],
      in: [
        ["His cock slides out of its slit already wet, ridged like a washboard from tip to root. He feeds it into %n's %h ridge by ridge, and each one pops in with a jolt.",
         "He pushes his %c cock into %n's %h slow, so they feel every ridge go by, and he's so hot inside them it's like bein' filled with bathwater."],
        ["He breeds %n in long rollin' thrusts, growlin' in a language older than the farm, and then somethin' at the root of him swells: not a knot. An egg.",
         "He takes his time and he goes deep, and when he's as deep as he can get he holds there, shudderin', and %n feels the first hard round shape start up the length of him."],
      ],
      over: [["He ruts along %n's belly with that ridged hot length, growlin', every ridge bumpin' over their skin, and holds them down in the nest with his tail."]],
      end: ["Seed first, %ml of it, scaldin' hot. Then the clutch, pushed into %n's %h one by one: %x eggs. He curls round them in the nest after and won't let them leave till he's sure they've settled.",
            "He floods %n's %h with %ml and then lays in them, %x smooth warm eggs, purrin' like a furnace. \"Mine,\" he says, and tucks his tail over their swollen belly to keep it warm."],
      endOver: ["He paints %n with %ml of scaldin' seed, rubs it into their skin with the flat of his claws so the whole farm will smell whose they are, and keeps them in his nest a while."],
    },
    naga: {
      beats: [
        ["Somethin' in the feed store rafters shifts. A loop of scaled coil, thick as a thigh, drops soft as rope over %n's shoulders.",
         "%n reaches up for a sack on the top shelf and the shelf moves. Green-gold coils pour down round them, cool and dry and very, very strong."],
        ["The naga lowers the rest of herself after: a long handsome torso, a forked tongue, a lazy smile. She wraps %n three times round and lifts them off the floor.",
         "Loop after loop winds round %n's chest and hips and thighs till only their head and their backside stick out. A face comes down level with theirs, tongue flickin'. \"Warm,\" it says, pleased."],
        ["Her coils squeeze and roll, kneadin' %n like dough, turnin' them, spreadin' their legs just by shiftin' her grip. Lower down, a slit in her scales parts, and what slides out of it comes as a pair.",
         "She tastes %n's throat with her tongue, then lower, then lower. Somewhere down in the coils two slick tapered shapes nudge up against them, side by side."],
      ],
      in: [
        ["Two cocks, and she uses both: one slides up %n's %h, and the other noses in right behind it and takes whatever else is open. The coils tighten, and %n is stuffed full and squeezed at the same time.",
         "She threads both her cocks into %n at once, %h and the other besides, slow as honey, and then starts to ripple her whole length so they slide in and out in turn."],
        ["%n can't move, can't even squirm. They just hang there in her coils bein' fucked double, breath squeezed out in little gasps, while she watches their face and smiles.",
         "The coils do all the work, clenchin' and loosenin', pumpin' %n up and down on both of her. She hums to herself and flicks her tongue against their ear."],
      ],
      over: [["She slides both her cocks between %n's squeezed-together thighs and works her coils so the whole of them is stroked along her, slow and tight."]],
      end: ["She cums in both of %n at once, %ml altogether, with a long hiss and a squeeze that makes them see stars. Then the coils let go, one loop at a time, and set them down on the feed sacks leakin' from two holes.",
            "A shiver runs the whole length of her and %n is flooded front and back, %ml of it. She unwinds, pats their cheek with the tip of her tail, and pours herself back up into the rafters."],
      endOver: ["A shiver runs the length of her and %ml spills between %n's thighs and up over their belly. She unwinds and pours herself back into the rafters."],
    },
    kennel: {
      beats: [
        ["%n crawls into the big kennel after a dropped ribbon, and the door swings to behind them. The latch drops. It's on the outside.",
         "The kennel door clicks shut on %n's heels. In the back, on a heap of old blankets, the yard's mastiff-man opens one eye and sits up, scratchin' his chest."],
        ["A mastiff. Brindle, jowly, shoulders like a bull, and when he stands up on two legs his ears brush the roof. He pads over and shoves his nose under %n's tail without so much as a hello.",
         "He's the yard mastiff, and this is his kennel, and anything left in it is his too. He sniffs %n over, slow and thorough, breath hot on the backs of their thighs."],
        ["A paw like a catcher's mitt pushes %n's chest down onto the blankets. \"Down. Stay,\" he says, in a voice like gravel in a bucket. \"You're gonna learn somethin'.\"",
         "He flips %n onto their belly, drags their hips up, and stands over them. There's nowhere to go. The kennel isn't that big and he takes up most of it."],
      ],
      in: [
        ["He mounts %n's %h and gives them the whole red length of his %c cock, and then the knot, fat as a fist, pressin', pressin', till %n's body gives up and lets it in.",
         "He ruts into %n's %h hard enough to rattle the kennel, and at the bottom of every stroke his knot kisses against them, bigger each time, till with a shove and a howl from %n it's inside."],
        ["Tied. He settles his weight on %n's back and just stays there, pantin', pulsin', while the knot holds them stretched wide. When it finally shrinks enough to slip, he licks them clean and does it again.",
         "The knot swells till %n can't tell where they end and he starts. He waits it out, lets it slide free with a wet pop, gives them a minute, and then puts it back in. That's the lesson."],
      ],
      over: [["He ruts between %n's thighs, knot bumpin' against them and never goin' in, pinnin' them to the blankets with his whole weight."]],
      end: ["Two knots, %ml, and a %h that won't close for an hour. The mastiff noses the latch up and lets %n crawl out. \"Better,\" he rumbles. \"Come back. You'll take it easier next time.\"",
            "When the latch finally lifts, %n drags themselves out of the kennel stretched and drippin', %ml of dog seed in their %h, knot-trained a little further than yesterday."],
      endOver: ["He finishes across %n's back and haunches, %ml of it, noses the latch open and lets them crawl out smellin' of kennel."],
    },
    hive: {
      beats: [
        ["Behind the orchard wall the hum gets loud. %n turns the corner and walks face first into a curtain of warm wax and gold light.",
         "%n follows the smell of honey through a gap in the hedge. The gap seals behind them with a soft sticky sound."],
        ["The hive queen sits in the middle of it: tall, striped amber and black, four arms, a waist like a wasp and a great soft swollen tail curled under her. Her drones take %n's elbows, polite as ushers.",
         "She's beautiful, in the way of somethin' that isn't quite a person: big dark eyes, feathery antennae, a heavy striped abdomen that pulses slow. Two of her hands cup %n's face."],
        ["She kisses %n, deep, and her mouth is full of honey. It pours over their tongue, thick and warm and dizzyin', and they swallow because there's nothin' else to do, and their knees go.",
         "She tips %n's chin up and feeds them from her own mouth, royal jelly, sweeter than anything, and with every swallow the world goes softer and slower and more golden."],
      ],
      in: [
        ["Her drones turn %n over a bolster of wax and hold them. The queen's tail uncurls, and from the tip of it slides a long smooth ovipositor, wet with honey, that nuzzles at %n's %h and sinks in.",
         "While %n is still swallowin', the tip of her abdomen curves round and under. Somethin' slim and slippery finds %n's %h and glides up inside, deeper and deeper."],
        ["Her whole tail starts to pulse. %n can feel the eggs comin' down the tube, small and firm and many, each one pushin' past the ring of them and settlin' in.",
         "She hums, and her drones hum with her, and the eggs start to come. %n lies there honey-drunk and loose while she fills their %h like a cell in the comb."],
      ],
      over: [["She kisses %n till they're honey-drunk and boneless, and strokes them all over with four gentle hands while her drones drizzle them with warm honey."]],
      end: ["%x eggs in %n's %h, sealed in with a cap of soft wax. The honey's already at work too: %n's teats are tight and tinglin', and they'll run double for a day. The drones walk them back to the hedge.",
            "She lays %x in %n's %h, caps them with wax, and kisses their forehead. The drones carry %n out and set them down in the clover, full of eggs and royal jelly, chest already startin' to ache."],
      endOver: ["She kisses %n's forehead and has her drones carry them back to the hedge, sticky from hair to heels and too honey-drunk to walk straight."],
    },
    goat: {
      beats: [
        ["%n bends down to tie a bootlace by the goat post. That was the mistake.",
         "Somebody butts %n square in the backside, horns first, and they go down on their knees in the yard."],
        ["The billy goat stands over them: wiry, yellow-eyed, a beard to his chest and horns curlin' back from his brow, and a smell on him you could lean on. He grins with all his teeth.",
         "It's the billy. Rank, cocky, slot-pupilled and proud of every bit of it. He hooks a horn under %n's chin and tips their face up."],
        ["He takes %n by the hair in both hands. \"Open up, kid.\"",
         "He plants a hoof either side of %n's knees and wags what he's got in their face. It's long, thin, pink and already drippin'."],
      ],
      in: [
        ["He feeds his cock past %n's lips and into their %h and starts to hump their face, quick and careless, beard ticklin' their nose, the stink of buck goat fillin' their head.",
         "He fucks %n's %h in short greedy jabs, bleatin' with every one, hangin' onto their ears like handlebars."],
        ["He flaps his tongue and curls his lip and goes harder. %n's eyes are waterin'. He likes that. He says so.",
         "\"That's it. That's a good nanny.\" He doesn't let %n up for air till he's good and ready."],
      ],
      over: [["He ruts against %n's cheek and across their lips without ever pushin' in, holdin' them by the hair, bleatin' with every shove."]],
      end: ["He shoves in to the root and shoots %ml down %n's %h in three quick spurts, then wipes himself off on their cheek and trots away, tail flickin'. %n is gonna smell of goat till somebody hoses them down.",
            "A bleat, a shudder, and %ml of thin hot goat seed goes straight down %n's %h. He pats their head, real patronisin', and struts off."],
      endOver: ["He bleats and spatters %ml across %n's face and hair, wipes himself on their cheek and struts off. They're gonna stink of billy goat till somebody hoses them down."],
    },
    sow: {
      beats: [
        ["\"Oh, look at you. Skin and bone.\" A pair of big soft arms come round %n from behind and lift them clean off the ground.",
         "%n is scooped up like a runt piglet and carried into the farrowin' shed before they can say a word."],
        ["She's the old sow, the matron of the sty: big as a wardrobe, pink and warm, apron straps cuttin' into rolls of soft flesh, and a double row of fat teats down her front. She sits, and %n is in her lap.",
         "The sow-woman settles into her rockin' chair with a sigh and arranges %n across her knees like a lapful of washin'. Everything about her is soft and huge and smells of milk."],
        ["\"Hush now. I've got you.\" She unhooks her apron bib and pushes a teat the size of a thumb between %n's lips. It's already drippin'.",
         "A broad hand cradles the back of %n's head and guides their mouth onto a fat warm nipple. \"Drink up, piglet. All of it.\""],
      ],
      in: [
        ["%n drinks. It's thick and sweet and there's no end to it, and the more they swallow the heavier their eyelids get. They hardly notice her other hand liftin' her apron, or what rises up from under it.",
         "Her milk goes down like warm cream and settles like lead. %n is half asleep on the teat when somethin' thick and blunt nudges up between their legs from under her apron."],
        ["She lowers %n onto it, slow, still nursin' them, rockin' the chair. Her cock is as fat as the rest of her, and it fills %n's %h to the brim while their mouth is still full of teat.",
         "\"There we go. Full at both ends.\" She rocks, and every rock pushes her deeper into %n's %h, and %n just suckles and lets her."],
      ],
      over: [["%n nurses till their belly's tight and their eyes won't stay open, while she rocks and pats their bottom and rubs herself slow against their thigh under her apron."]],
      end: ["She grunts, soft and happy, and pumps %ml into %n's %h without ever takin' the teat out of their mouth. Then she sits them up, wipes their chin with her apron, and sets them down, milk-drunk and bred.",
            "The chair creaks, the sow sighs, and %n's %h fills with %ml of her seed. She lets them nurse a minute more, kisses the top of their head, and sends them off with a pat. \"Come back when you're hungry.\""],
      endOver: ["She finishes into her own apron with a happy little grunt, wipes %n's chin and sets them on their feet, milk-drunk and wobblin'. \"Come back when you're hungry.\""],
    },
  };

  // ── the wolves, the warren and the boar run longer: more of them, and more to each ──
  (function(){
    const W1 = ANTHRO_LINES.wolves, R1 = ANTHRO_LINES.warren, B1 = ANTHRO_LINES.boar;
    W1.beats[0].push("%n smells them before they see them: wet fur and musk. Then the wolf-men come out of the straw all round the den, tall and grinnin'. Not three of them tonight. Five.",
                     "A howl goes up from inside the old feed shed as %n passes, and a laugh answers from behind them. The wolf-men of the pack have been trackin' them since the gate.");
    W1.beats[1].push("They bring %n down easy as a fawn, one on each arm, one at the scruff, and stretch them out belly down across a hay bale with their tail end in the air.",
                     "The alpha's a grey brute with a notched ear. He noses %n's thighs apart, takes one long breath of them, and licks his chops. The rest whine and crowd in.");
    W1.beats[2].push("A wolf at each end. One lifts %n's chin with a claw and holds their eyes while the other mounts up behind.");
    W1.in.splice(1, 0, [
      "While the alpha's tied in %n's %h, a younger one comes round the front, red and drippin', and pushes into their mouth. %n is spitted between the two of them, rocked back and forth, knot at one end and cock at the other.",
      "The one at %n's head doesn't feel like waitin' his turn. He feeds himself between their lips and ruts their throat in time with the alpha, so every shove from behind chokes them further onto him.",
      "They're passed round the circle. Whoever isn't in %n's %h is in their mouth, or rubbin' off in their hand, or lickin' the last one's leavin's off their thighs."]);
    W1.in.push([
      "By the fourth knot %n has stopped tryin' to hold themselves up. They just hang off whichever cock is tied in them, tongue out, belly startin' to round, while the pack takes them again from the top.",
      "The runt of the pack goes last and ties longest, humpin' frantic, and when he finally pops free the alpha shoulders him aside and mounts %n a second time just to leave his scent on top.",
      "They breed %n till the moon's moved. Every time a knot slips out, wet and steamin', there's another cold nose under their tail and another weight across their back."]);
    W1.end.push("Five wolves, and the alpha twice: %ml, knotted into %n's %h one load on top of the last. The pack curls up round them to sleep it off, and %n is kept in the middle of the heap, leakin', till they're allowed to crawl out.",
                "%n is finally nosed out of the den with %ml of pack seed in their %h, bite marks on both shoulders and a walk like they've been ridin' a fence rail. Somewhere behind them, somebody howls, pleased.");
    R1.beats[0].push("There's a neat round hole in the bank with a little sign: KEEP OUT. %n leans over to read the small print and the edge crumbles.",
                     "%n hears gigglin' under the floorboards of the feed room. Then a board lifts, and a dozen paws pull them down through it.");
    R1.beats[1].push("There must be twenty of them down here. Does too, round and heavy with last month's litters, who settle %n's head in a soft lap and stroke their hair and tell the bucks to be quick about it.",
                     "The whole warren's turned out to see. Big bucks, half-grown bucks, a grizzled old one with a torn ear who's sired half of them, all hard as carrots and bouncin' on their toes.");
    R1.in.splice(1, 0, [
      "They don't take turns so much as take over. One in %n's %h, one in their mouth, one in each hand, two more rubbin' off on their feet, and the minute any of them finishes, another hops in.",
      "A doe holds %n's knees back for the bucks and counts out loud. \"Six. Seven. Oh, he was quick. Eight.\" Every number is another hot little squirt up their %h.",
      "The old torn-eared buck goes slow, for a rabbit. That's a whole half minute. He grips %n's hips, thumps one foot, and lets go a load three times the size of the young ones'."]);
    R1.in.push([
      "Somewhere past fifteen %n stops bein' able to tell them apart. It's all just one long quick hot blur of fur and squeakin' and bein' topped up.",
      "They've gone round twice and the first ones are ready again. They always are. %n's %h is frothin' over and they're still linin' up.",
      "The does take pity and feed %n clover and water by hand so they'll last. Then they wave the next row of bucks forward."]);
    R1.end.push("The warren keeps %n the better part of the mornin'. When they're finally boosted back up into the daylight there's %ml sloshin' in their %h, from more bucks than they've got fingers and toes, and the does are already knittin'.",
                "%ml, in more little loads than %n could count, and every one of those bucks breeds true. The does kiss their cheeks and tell them to come back when it's time to nest.");
    B1.beats[0].push("The sign on the sty says BEWARE OF THE BOAR, in his own handwritin'. %n was lookin' at the sign, not at where they were puttin' their feet.",
                     "A squeal of hinges, a shove from behind, and %n is through the sty gate and on their face in the wallow. The gate latches itself. It's a trap built for exactly this.");
    B1.beats[1].push("He's not alone today. A second boar-man, younger, leaner, puts down his mug and comes over to see what the old man's caught. \"Share?\" \"After.\"",
                     "The boar-man turns %n over in the mud with his big hands, noses under their arms and between their legs, and rolls them about like a truffle he's dug up, till they're slathered from end to end.");
    B1.beats[2].push("He hooks a tusk under %n's hips and hoists them up onto their knees, ass high, face in the mud. Hogs don't court.");
    B1.in.splice(1, 0, [
      "The younger one won't wait. He comes round to the front, kneels in the mud at %n's head, takes a fistful of their hair, and feeds his own long twisted cock into their mouth. Mud, musk, and hog at both ends.",
      "It's a slow, deep, grindin' kind of breedin'. He shifts his weight and %n sinks another inch into the wallow, mud oozin' up between their fingers and over their teats, his belly hot and heavy on their back.",
      "%n can feel the tip of him turnin' inside them, screwin' tighter and tighter into place. Every time they squirm he grunts and leans on them harder."]);
    B1.in.push([
      "Ten minutes. Fifteen. He's still cummin'. %n's belly has swelled till it's draggin' in the mud, and he just snorts and goes on pumpin' like he's fillin' a trough.",
      "When the old boar's finally done he doesn't get off. He waits, locked in, till he's sure it's set. Then the young one takes his place and starts the whole thing over.",
      "The sty hands lean on the rail to watch. One of the sow-women wipes the mud off %n's face with her apron, almost kind. \"He takes his time, love. Breathe.\""]);
    B1.end.push("Two boars, the better part of half an hour, and %ml of hog seed corked up in %n's %h behind a plug as thick as candle wax. They have to be helped over the rail. They look like they've been dipped.",
                "By the time the sty gate swings open %n has %ml in their %h, a belly that sways when they crawl, mud in places mud's got no business, and the old boar's stink soaked right into their skin.");
  })();
