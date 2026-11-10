  /* WHAT'S IN THIS FILE (10y2b-birthing.js)
     BIRTHIN', EVERY KIND ITS OWN WAY (Nov 10). Laynie: "revisit pregnancy and Midwife mechanics. Midwifes need a way to
     check progress, speed labor along, variable messages per species". Every kind moo'd through labour and farrowed
     like a sow. Now:
     • EACH KIND ITS OWN PLACE AND WAYS: a cow calves in the calvin' pen and licks her calf clean, a mare foals front hooves
       first, a bitch whelps and tears each sac open, a bunny pulls her own fur to line a kindlin' nest, a cat queens in
       a quiet corner purrin', wolves and foxes den, goats kid, ewes lamb, rats shred straw, goblins steal blankets, and a
       dragon scorches a hollow. Their own young (calf, foal, kits…), their own sounds. The farm's shared lines fill in
       the same words, so every line fits whoever's birthin'.
     • LABOUR TAKES AS LONG AS IT TAKES: LABOUR_MIN, longer for a first litter and for a big one, shorter for an old hand.
       It moves on in story order: early squeezes, harder ones, then pushin'.
     • A STUCK ONE, sometimes, past the middle of labour: one comes turned crossways and everything waits. A midwife can
       turn it (the breeding add-on); otherwise the farm girl does it herself after STUCK_WAIT_MIN. Never anything worse
       than a wait: the time stuck is added back, so the labour isn't cut short by it either.
     • A ONE AND A LITTER read differently: "a calf, a little female", "three pups, two male and one female".
     • Add-ons get api.labour (10f-addons.js): start (bring it on), help (minutes off), unstick (turn the stuck one),
       place (where their kind births), and a "labour" event when it starts.
  */
  const BIRTH_KIND_OF = { cow:"cow", bull:"cow", pony:"horse", horse:"horse", deer:"deer", pig:"pig", pup:"dog", dog:"dog",
    wolf:"den", fox:"den", kitt:"cat", cat:"cat", bunny:"bunny", rabbit:"bunny", goat:"goat", sheep:"sheep", rat:"rat",
    goblin:"goblin", dragon:"dragon" };
  const BIRTH_YOUNG = { cow:["calf","calves"], bull:["calf","calves"], pony:["foal","foals"], horse:["foal","foals"], deer:["fawn","fawns"],
    pig:["piglet","piglets"], pup:["pup","pups"], dog:["pup","pups"], wolf:["pup","pups"], fox:["kit","kits"], kitt:["kitten","kittens"],
    cat:["kitten","kittens"], bunny:["kit","kits"], rabbit:["kit","kits"], goat:["kid","kids"], sheep:["lamb","lambs"], rat:["pinkie","pinkies"],
    goblin:["goblin brat","goblin brats"], dragon:["hatchling","hatchlings"], default:["little one","little ones"] };
  const BIRTH_SOUNDS = {
    cow:["a long, low moo","a deep, shaky low","a moan that turns into a moo"], bull:["a deep, rumblin' bellow","a long, low groan","a shaky snort"],
    pony:["a breathy whinny","a shudderin' little nicker","a high, wavering whinny"], horse:["a high, breathy whinny","a low, shudderin' nicker","a groan through flared nostrils"],
    deer:["a thin, wavering bleat","a soft, broken bleat"], pig:["a deep grunt","a long, shakin' squeal","a low, rhythmic grunt"],
    pup:["a high, needy whine","a long whimper","a pant that breaks into a whine"], dog:["a needy whine","a low, long whimper","a pant that breaks into a whine"],
    wolf:["a low, wavering howl","a needy whine","a rumblin' growl"], fox:["a high, thin yip","a breathy little whine","a sharp, shaky yip"],
    kitt:["a broken, rumblin' purr","a needy mewl","a high, sharp little cry"], cat:["a broken, rumblin' purr","a long, low yowl","a needy mewl"],
    bunny:["a breathy squeak","a soft little squeak","a hard thump of one foot"], rabbit:["a breathy squeak","a soft little squeak","a hard thump of one foot"],
    goat:["a loud, complainin' bleat","a shaky bleat","a long, indignant bleat"], sheep:["a trembling baa","a low, soft baa"],
    rat:["a shaky chitter","a high, needy squeak","a breathless little squeak"], goblin:["a ragged cackle that turns into a moan","a filthy little curse","a breathless giggle"],
    dragon:["a low, rumblin' growl","a hot, hissin' breath","a roar that rattles the rafters"], default:["a long, low moan","a needy whimper","a shaky gasp"] };
  const BIRTH_PLACE = { cow:"the calvin' pen", horse:"the foalin' stall", deer:"a hollow in the long grass", pig:"the farrowin' straw",
    dog:"the whelpin' box", den:"the den", cat:"a quiet corner of the loft", bunny:"the fur-lined nest", goat:"the kiddin' pen",
    sheep:"the lambin' pen", rat:"a nest of shredded straw", goblin:"a heap of stolen blankets", dragon:"a scorched hollow in the straw",
    default:"the birthin' straw" };

  // each kind's own lines. %n them · %c the sire(s) · %x how many · %place · %one / %many their young · %brood the one or
  // the many, whichever they're carryin' · %kids "a calf" / "3 pups" · %sexone "a little female" · %sexes "2 male and 1 female"
  // · %sound a noise their kind makes. water: it starts · labour: any squeeze · crown: one comes (a one or the first of
  // many, so never "the first") · endOne / endMany: after · huge: a big litter goin' on and on
  const BIRTH_KIND_LINES = {
    cow: {
      water:["%n lets out a long, low moo and their water breaks in a hot rush, soakin' the straw. The calvin' pen is ready, and so is %c's %brood.",
             "%n's tail end goes tight and their water lets go, splashin' down their legs. They turn a slow circle in the calvin' pen, lowin', lookin' for the right spot to lie."],
      labour:["%n lies down, gets up, lies down again, tail held out stiff, lowin' through every squeeze.",
              "%n strains with their head low and their back humped, a long moo rumblin' out of them as their belly goes hard.",
              "%n's udder is tight and drippin' already, and every squeeze pushes a few more drops out of their teats."],
      crown:["Two little hooves show first, then a wet nose restin' on them, and with one long bawlin' push the %one slides out into the straw.",
             "%n bears down with a deep, shudderin' moo, and the %one comes in a slick rush, all legs, landin' soft in the calvin' straw."],
      endOne:["%n swings round and licks their %one clean with long, rough strokes till it's tryin' to stand on wobbly legs. It's %sexone, %c's, already nosin' for a teat.",
              "%n sinks down in the calvin' pen with their %one tucked against their side, lowin' soft. It's %sexone, sired by %c, and their milk comes in heavy."],
      endMany:["When it's done there are %kids in the calvin' straw, %sexes, all %c's. %n licks each one clean in turn, lowin' soft, udder swellin' with milk.",
               "%n lies in the calvin' pen with %kids nosin' at their teats, %sexes, every one %c's. Their milk lets down hard."] },
    horse: {
      water:["%n paws at the straw, sweatin' down their flanks, and their water breaks with a splash. They're in labour in the foalin' stall with %c's %brood.",
             "A breathy whinny and a rush down %n's legs: their water's gone. They circle the foalin' stall, ears back, tail switchin'."],
      labour:["%n goes down on their side in the foalin' stall, legs stretched out stiff, groanin' as their belly rolls hard.",
              "%n is up again, pacin', pawin', lookin' back at their own flank with a high, worried whinny.",
              "Sweat darkens %n's neck and flanks. They lie flat and push with their whole body, nostrils flared."],
      crown:["A pale sac shows, then two little front hooves inside it, one a touch ahead of the other, then a nose. %n heaves, and heaves again, and the %one slides free in a long, wet rush.",
             "%n strains flat out in the straw, and the %one comes front feet first, then its head, then all of it at once, slick and steamin'."],
      endOne:["%n lifts their head and nickers low at the %one in the straw, nuzzlin' it till it gets its long legs under it and wobbles up. It's %sexone, %c's.",
              "Within the hour the %one is up on four shaky legs, findin' %n's teat. It's %sexone, sired by %c, and %n's milk comes in strong."],
      endMany:["%kids in the foalin' straw, %sexes, every one of them %c's, all legs and wet manes. %n nickers to each in turn.",
               "%n lies spent in the foalin' stall while %kids, %sexes, struggle up on spindly legs and nose for their teats."] },
    deer: {
      water:["%n slips off to a hollow in the long grass, flanks heavin', and their water breaks in a quiet gush. %c's %brood, comin' soon.",
             "%n's ears flick back and their water lets go, runnin' down their slim legs. They lie down low in the grass and go very still."],
      labour:["%n lies curled in the hollow, belly tight, lettin' out a thin, wavering bleat with each push.",
              "%n stands, lies down, stands again, restless and quiet, their tail flickin' with every squeeze."],
      crown:["Tiny pointed hooves show first, then a narrow wet head, and the %one slips out into the grass, spotted and blinkin'.",
             "%n gives a soft, broken bleat and pushes, and the %one comes all at once, small and slick, folded up like a fern."],
      endOne:["%n licks their spotted %one dry in the long grass till it tucks itself down, still as a stone. It's %sexone, %c's.",
              "The %one lies hidden in the grass beside %n, all spots and huge dark eyes. It's %sexone, sired by %c, and %n's milk is comin' in."],
      endMany:["%kids lie folded in the grass beside %n, %sexes, every one %c's, spotted and still, while %n licks them dry.",
               "%n noses their %kids, %sexes, into the deep grass to hide, then lies down beside them to let them nurse."] },
    pig: {
      water:["%n starts tearin' up the straw with their snout and hands, buildin' a nest in a frenzy, and then their water breaks. Farrowin' time, and %c's %brood with it.",
             "%n gives a long, shakin' squeal and their water gushes out. They flop down on their side in the farrowin' straw, gruntin' hard."],
      labour:["%n lies on their side, gruntin' low and steady, their belly goin' tight with every push.",
              "%n's teats are drippin' already, two neat rows of them, beaded with milk as the next squeeze rolls through.",
              "%n kicks at the straw and squeals, rolls, and settles again, their whole belly heavin'."],
      crown:["A slick little %one shoots out on a long squeal, landin' in the straw already wrigglin', and %n doesn't even stop pushin'.",
             "%n grunts once, deep, and a %one slides out wet and squeakin' into the farrowin' straw."],
      huge:["It's a litter fit for a sow and then some. %n has gone quiet and glassy, just pushin' when their body says push, while the farrowin' straw fills up round them."],
      endOne:["Just the one %one, %sexone, %c's, and %n noses it up to the front teats and grunts, pleased with themselves.",
              "%n lies in the farrowin' straw with their single %one latched on, gruntin' soft. It's %sexone, sired by %c."],
      endMany:["%kids in the farrowin' straw, %sexes, every one of them %c's, squealin' and shovin' for a teat. %n lies on their side and lets them all latch on, milk flowin'.",
               "When it's over, %n is ringed by %kids, %sexes, all %c's, a row of pink little bodies sucklin' down both lines of teats."] },
    dog: {
      water:["%n has been diggin' at the blankets in the whelpin' box all afternoon, and now their water breaks. They pant and whine, turnin' circles. %c's %brood, comin' soon.",
             "%n's water goes with a soft gush and they lie down hard in the whelpin' box, pantin' with their tongue out."],
      labour:["%n pants hard, flanks shiverin', then goes still and strains with %sound.",
              "%n licks at themselves between pushes, whinin', tail thumpin' weakly against the side of the whelpin' box.",
              "%n digs at the bedding again, turns, lies down with a groan, and pushes."],
      crown:["%n gives a low whine and a long push, and a %one slides out in its sac. %n turns and tears it open with their teeth and licks the %one till it squeaks.",
             "With a grunt and a shiver, %n delivers a %one into the whelpin' box, and they're lickin' it clean before it's even stopped movin'."],
      endOne:["Just the one %one, %sexone, %c's. %n curls round it in the whelpin' box, lickin' and lickin', and lets it nurse.",
              "%n lies in the whelpin' box with a single fat %one tucked against their belly. It's %sexone, sired by %c."],
      endMany:["%kids in the whelpin' box, %sexes, every one %c's, a squirmin' pile at %n's belly. %n licks each one in turn and lets them nurse.",
               "%n curls round %kids, %sexes, all %c's, in the whelpin' box, tail over their nose, milk lettin' down."] },
    den: {
      water:["%n slinks off into the den, low to the ground, and their water breaks in the dark. %c's %brood, on the way.",
             "%n's water goes and they dig into the back of the den, pawin' out a hollow, pantin'."],
      labour:["From the back of the den comes %sound, then quiet, then the scrape of claws as %n strains.",
              "%n lies curled in the dark of the den, flanks heavin', ears flat, pushin' with every wave."],
      crown:["There's a wet little squeak from the den: %n has delivered a %one, and you can hear them lickin' it clean.",
             "%n strains, growls low, and a %one slides out into the den, blind and squirmin'."],
      endOne:["In the den, %n is curled round a single %one, %sexone, %c's, lickin' it and growlin' soft at anybody who looks too close.",
              "%n lies in the dark of the den with one %one tucked under their chin. It's %sexone, sired by %c."],
      endMany:["%kids in the den, %sexes, all %c's, a blind, squeakin' heap at %n's belly. %n's eyes glint in the dark, darin' anybody to come closer.",
               "%n lies curled round %kids in the den, %sexes, every one %c's, and they're all nursin' already."] },
    cat: {
      water:["%n has been kneadin' a nest in a quiet corner of the loft all mornin', and now their water breaks. They purr through it, low and shaky. %c's %brood, comin'.",
             "%n's water lets go with a soft splash and they hunker down in the loft corner, tail lashin', purrin' and pantin' at once."],
      labour:["%n purrs, loud and broken, and strains, then purrs again, kneadin' at the straw with their hands.",
              "%n crouches in their nest with their eyes half closed, lettin' out %sound with each push.",
              "%n licks at themselves, restless, then lies back and bears down, belly goin' tight."],
      crown:["%n gives a sharp little cry and a %one slides out in its sac. They lick it open at once, rough tongue workin', till it mews.",
             "With a long, shakin' purr, %n delivers a damp little %one, and they're washin' it before it's even squeaked."],
      endOne:["%n curls round one tiny %one in the loft, %sexone, %c's, purrin' so loud the boards hum.",
              "A single %one, %sexone, sired by %c, kneadin' at %n's belly and nursin', while %n purrs and purrs."],
      endMany:["%kids in a tumble at %n's belly, %sexes, every one %c's, kneadin' and nursin' while %n purrs, eyes shut, utterly content.",
               "%n lies curled in the loft corner round %kids, %sexes, all %c's, washin' them one after another."] },
    bunny: {
      water:["%n has been pullin' fur from their own chest and belly all day to line a nest, and now their water breaks. Kindlin' time. %c's %brood, comin' soon.",
             "%n's water goes, and they dive into the nest they've built, thumpin' a foot, nose twitchin' hard."],
      labour:["%n hunches in the fur-lined nest, quiet, eyes wide, belly clenchin' with each push.",
              "%n gives %sound and tugs another tuft of fur loose to tuck in the nest, then bears down again.",
              "%n's sides heave fast and shallow. Bunnies birth quick, and this one's nearly there."],
      crown:["In a few quick pushes, a pink little %one is out and tucked into the fur. %n hardly makes a sound.",
             "%n strains once, hard, and a tiny, hairless %one slips out into the soft nest of fur."],
      endOne:["One little %one, %sexone, %c's, tucked deep in the fur nest. %n covers it over with fur and sits by, nose twitchin', guardin' it.",
              "%n has kindled a single %one, %sexone, sired by %c, and it's buried snug in the fur they pulled for it."],
      endMany:["%kids buried in the fur nest, %sexes, every one %c's, a warm wrigglin' heap. %n covers them over and stands guard, nose goin'.",
               "Kindlin's done: %kids in the nest, %sexes, all %c's. %n lets them nurse in a quick, twitchy hurry, the way bunnies do."] },
    goat: {
      water:["%n paws at the straw in the kiddin' pen and lets out a loud bleat as their water breaks. %c's %brood, on the way.",
             "%n's water goes with a splash and they lie down, get up, lie down again in the kiddin' pen, bleatin' at everybody."],
      labour:["%n stretches their neck out and bleats, loud and complainin', every time their belly goes hard.",
              "%n lies in the kiddin' pen, pushin', then scrambles up to look at their own back end, bleatin'.",
              "%n grinds their teeth and strains, tail up, belly rollin'."],
      crown:["Two little hooves and a nose, and with a yell %n pushes out a %one in a slick rush into the kiddin' straw.",
             "%n gives one more indignant bleat and the %one drops out into the straw, wet and kickin'."],
      endOne:["%n licks their %one clean, chucklin' low in their throat, till it's up and buttin' at their udder. It's %sexone, %c's.",
              "One %one, %sexone, sired by %c, up on its feet in minutes and already bouncin' round the kiddin' pen."],
      endMany:["%kids in the kiddin' pen, %sexes, every one %c's, bleatin' and buttin' at %n's udder. %n licks them in turn, chucklin'.",
               "%n stands in the kiddin' pen with %kids, %sexes, all %c's, shovin' at their teats, milk runnin'."] },
    sheep: {
      water:["%n has gone off by themselves to the lambin' pen, quiet and restless, and their water breaks there in the straw. %c's %brood, comin' soon.",
             "A trembling baa and a gush: %n's water has gone. They paw at the lambin' straw and lie down heavy."],
      labour:["%n lies with their head stretched out, lip curled, strainin' with each wave.",
              "%n gets up, turns, lies back down in the lambin' pen, lettin' out %sound."],
      crown:["Two little hooves and a nose on top of them, and with a long push %n delivers a %one, all wet wool and long legs.",
             "%n heaves, and the %one slides out into the lambin' straw, and %n is up and lickin' it at once, mutterin' low."],
      endOne:["%n licks their %one dry, makin' soft, deep little sounds at it, till it bleats back. It's %sexone, %c's.",
              "One %one in the lambin' pen, %sexone, sired by %c, already up and tuggin' at %n's teat, tail waggin'."],
      endMany:["%kids in the lambin' pen, %sexes, every one %c's, wobblin' up on knobbly legs. %n licks each one and lets them nurse, tails waggin'.",
               "%n stands patient in the lambin' straw while %kids, %sexes, all %c's, butt and suckle at their teats."] },
    rat: {
      water:["%n has been shreddin' straw into a nest in a corner, frantic, and now their water breaks. %c's %brood, comin' fast.",
             "%n's water goes and they curl tight in their shredded-straw nest, whiskers twitchin', breathin' fast."],
      labour:["%n stretches long, belly flat to the straw, then curls up tight and pushes with %sound.",
              "%n's tail lashes and their whiskers quiver as another squeeze rolls through."],
      crown:["%n stretches, strains, and a tiny pink %one slips out, and %n curls round and cleans it in a blink.",
             "A pink, squirmin' %one, no bigger than a thumb, slides out into the nest of shredded straw."],
      endOne:["Just one %one, %sexone, %c's, pink and squeakin' in the shredded straw. %n tucks it under their chin."],
      endMany:["%kids in the shredded-straw nest, %sexes, every one %c's, a pink, squeakin' pile. %n curls over them all and lets them nurse.",
               "%n lies stretched in the nest with %kids, %sexes, all %c's, latched in a row along their belly, squeakin'."] },
    goblin: {
      water:["%n has been draggin' stolen blankets into a heap all day, cacklin', and now their water breaks all over it. %c's %brood, comin' noisy.",
             "%n's water goes with a splash and a filthy curse, and they squat in their heap of stolen blankets, gigglin' and gaspin'."],
      labour:["%n squats and pushes and swears, cacklin' between squeezes like it's the best joke they ever heard.",
              "%n grips the blankets and bears down, lettin' out %sound."],
      crown:["With a squawk and a shove, a wrinkled little %one pops out into the blankets, already yellin'.",
             "%n cackles, pushes, and a green and squallin' %one slides out, grabbin' at the blankets with tiny claws."],
      endOne:["One %one, %sexone, %c's, loud as anything, latched on to %n and bitin'. %n just cackles and lets it.",
              "%n sprawls in the stolen blankets with one squallin' %one at their chest, %sexone, sired by %c, both of them grinnin'."],
      endMany:["%kids in the stolen blankets, %sexes, every one %c's, yellin', bitin' and fightin' over %n's teats. %n laughs till they cry.",
               "When it's over, %n is buried in %kids, %sexes, all %c's, a squirmin', squawkin' heap of trouble."] },
    dragon: {
      water:["%n scrapes a hollow in the straw and breathes on it till it smokes, and then their water breaks with a hiss of steam. %c's %brood, comin'.",
             "%n's water goes, and they curl in their scorched hollow, scales ripplin', smoke curlin' from their nostrils."],
      labour:["%n strains with a low, rumblin' growl, heat pourin' off them, scales shiftin' as their belly clenches.",
              "%n's tail lashes and a hot, hissin' breath scorches the straw as another squeeze takes them."],
      crown:["With a roar that shakes the rafters, %n pushes out a %one in a soft, leathery shell that splits at once, and a damp, wing-folded little thing crawls free.",
             "%n bears down, smoke pourin' from their jaws, and a %one slides out slick and hot, wings plastered to its back, already hissin'."],
      endOne:["One %one, %sexone, %c's, curled in the scorched straw against %n's belly, little wings twitchin' as it nurses. %n rumbles, deep and proud.",
              "%n curls round a single %one, %sexone, sired by %c, and breathes warm smoke over it."],
      endMany:["%kids in the scorched hollow, %sexes, every one %c's, hissin' and squabblin', wings flappin' damp. %n curls round them all, rumblin'.",
               "When it's over, %n lies coiled round %kids, %sexes, all %c's, guardin' them with one slitted eye open."] },
  };

  // lines for every kind, in story order. push, crownMany, mid, huge and endMany are the farm's older birth lines
  // (BROOD_LINES, 10y2-brood.js and 10y9f), looked up when they're used so the later batches count too
  const BIRTH_SHARED = {
    water:["Y'all, %n's water just broke! They're in labour with %c's %brood. Come gather round %place.",
           "A warm gush down %n's thighs and a gasp: their water's gone. It's time, so somebody fetch a midwife to %place.",
           "%n stops dead, knees pressed together, as their water breaks and runs into the straw. It's time. Get 'em to %place, and somebody find a midwife."],
    early:["%n paces the straw, one hand under their belly, breathin' slow through every squeeze. It's early yet.",
           "%n leans on the rail and sways, belly goin' tight, then soft, then tight again.",
           "%n's belly hardens under their hands and they hold their breath till it passes, then laugh, shaky.",
           "%n kneels in %place, rockin', lettin' out %sound when the next one comes."],
    strong:["The squeezes are comin' harder now. %n is on all fours in %place, groanin', head hangin' low.",
            "%n grips the rail with white knuckles and rides out another long one, sweat runnin' down their back.",
            "%n's belly heaves, drum-tight, and they let out %sound that carries across the whole farm.",
            "%n can't talk through them anymore. They just breathe, and hold on, and push when their body tells them to."],
    close:["%n's belly has dropped low and heavy, and they're bearin' down now with every wave. Any minute.",
           "%n is pushin' in earnest, chin to chest, a long low groan pourin' out of them.",
           "%n plants their knees wide in %place and pushes, and pushes, red-faced, and you can feel how close it is."],
    crownOne:["%n strains till the cords stand out in their neck, and a slick %one slides out into the farm girl's waitin' hands.",
              "%n gives one long, ragged push and a wet %one comes, squallin', and the farm girl wipes its face and lays it in %place."],
    endOne:["%n sinks back in %place with their %one on their chest, %sexone, %c's. Their milk comes in heavy and warm.",
            "It's over. One %one, %sexone, sired by %c, nursin' already, and %n can't stop smilin'."],
    stuck:["%n pushes and pushes and nothin' comes. One's turned crossways and isn't budgin'. %n groans, and a midwife's hands would help right now.",
           "%n's pushes stop gettin' anywhere: a %one is lyin' sideways, stuck, and %n pants and whimpers through it, waitin' for help to turn it.",
           "Everything stalls. %n strains, red-faced, and gets nowhere. Somethin' in there needs turnin', gentle, by somebody who knows how."],
    stuckWait:["Still stuck. %n rocks on all fours, pantin', and the %one won't come round on its own.",
               "%n whimpers and shifts, tryin' to move the stuck %one with their own body, and can't."],
    unstuck:["The farm girl kneels behind %n, slicks her hand, and reaches in slow and careful. A gentle turn, a long groan from %n, and it's come round right. Push now, sugar.",
             "With nobody else comin', the farm girl rolls up her sleeves, presses on %n's belly with one hand and turns the %one with the other. There. It's lined up. Push."],
  };
  const BIRTH_FROM_BROOD = { push:"farrowStart", crownMany:"farrowCrown", mid:"farrowMid", huge:"farrowHuge", endMany:"farrowEnd" };
  const sharedBirth = (key) => BIRTH_SHARED[key] || (BIRTH_FROM_BROOD[key] && BROOD_LINES[BIRTH_FROM_BROOD[key]]) || [];

  function birthKind(mn){ return BIRTH_KIND_OF[speciesKey(mn)] || "default"; }
  function birthWords(mn){
    const k = speciesKey(mn), kind = birthKind(mn), y = BIRTH_YOUNG[k] || BIRTH_YOUNG.default;
    return { kind, one: y[0], many: y[1], place: BIRTH_PLACE[kind] || BIRTH_PLACE.default, sounds: BIRTH_SOUNDS[k] || BIRTH_SOUNDS.default };
  }
  // "2 male and 1 female" · "a little female"
  function birthSexes(kids){
    const parts = []; if (kids.male) parts.push(kids.male+" male"); if (kids.female) parts.push(kids.female+" female"); if (kids.futa) parts.push(kids.futa+" futa");
    return parts.length > 1 ? parts.slice(0, -1).join(", ")+" and "+parts[parts.length - 1] : (parts[0] || "");
  }
  const birthSexOne = (kids) => kids.male ? "a little male" : kids.futa ? "a little futa" : "a little female";
  function birthKids(mn, n){ const w = birthWords(mn); return n === 1 ? "a "+w.one : n+" "+w.many; }
  // their kind's words into a line (before the names: %c and %n are filled after, by tFill)
  function birthFill(t, mn, x){
    const w = birthWords(mn), p = prodOf(mn), n = (x && x.count) || (p && p.preg && p.preg.count) || 1, kids = (x && x.kids) || null;
    return String(t).replace(/%place/g, w.place).replace(/%brood/g, n === 1 ? w.one : w.many)
      .replace(/%sexone/g, kids ? birthSexOne(kids) : "a little one").replace(/%sexes/g, kids ? birthSexes(kids) : "")
      .replace(/%kids/g, birthKids(mn, n)).replace(/%many/g, w.many).replace(/%one/g, w.one)
      .replace(/%sound/g, () => w.sounds[Math.floor(Math.random()*w.sounds.length)]);
  }
  // their kind's own lines first, mostly; the farm's shared ones mixed in for variety
  function birthPool(mn, key, ownKey){
    const own = (BIRTH_KIND_LINES[birthKind(mn)] || {})[ownKey || key] || [], shared = sharedBirth(key);
    return own.length && (!shared.length || Math.random() < 0.6) ? own : own.concat(shared);
  }
  function birthVars(mn, x){
    const p = prodOf(mn), g = (p && p.preg) || {};
    return Object.assign({ count: (x && x.count) || g.count || 1 }, x || {}, { v: Object.assign({ c: (g.sires || []).map(plainName).join(" & "), x: String((x && x.count) || g.count || 1) }, (x && x.v) || {}) });
  }
  function birthLine(key, mn, x, ownKey){
    const pool = birthPool(mn, key, ownKey); if (!pool.length) return "";
    const vx = birthVars(mn, x);
    return tFill(birthFill(pickFor(mn, "birth:"+key, pool), mn, vx), mn, vx.v);
  }
  // a pool with their kind's words already in, for a scene (sceneRun fills the names)
  function birthBeat(mn, key, x, ownKey){ return birthPool(mn, key, ownKey).map(l => birthFill(l, mn, x)); }

  if (W.__FARMHAND_TEST__) Object.assign(W, { __birthLine: (k, mn, x, own) => birthLine(k, mn, x, own), __birthWords: (mn) => birthWords(mn),
    __labourMins: (mn) => labourMinutes(mn), __birthKinds: () => BIRTH_KIND_LINES, __birthShared: (k) => sharedBirth(k) });

  // ── labour ──
  function labourMinutes(mn){
    const p = prodOf(mn), n = (p && p.preg && p.preg.count) || 1, done = (p && p.offspring && p.offspring.litters) || 0;
    let m = CFG.LABOUR_MIN + Math.min(CFG.LABOUR_BIG_MAX, Math.max(0, n - 1) * CFG.LABOUR_PER_YOUNG);
    if (!done) m += CFG.LABOUR_FIRST_MIN; else if (done >= 2) m -= CFG.LABOUR_OLD_HAND_MIN;
    return Math.max(15, m);
  }
  const labourGap = () => (CFG.LABOUR_BEAT_MIN[0] + Math.random()*(CFG.LABOUR_BEAT_MIN[1] - CFG.LABOUR_BEAT_MIN[0]))*60000;
  // their water breaks. how: "induced" when a midwife brought it on (the due day moves up to now)
  function startLabour(mn, how){
    const p = prodOf(mn); if (!p || !p.preg || p.labour) return false;
    const now = Date.now(), mins = labourMinutes(mn);
    if (how === "induced") p.preg.due = Math.min(p.preg.due, now);
    p.labour = { start: now, until: now + mins*60000, next: now + labourGap(), total: mins, helps: 0, how: how || "" };
    emote("🍼 "+birthLine("water", mn), mn);
    for (const h of herdsOf(mn)) tell(h.leader, "🍼 "+plainName(mn)+" just went into labour, hon. Come watch!");
    later(() => addonsEmit("labour", mn, { place: birthWords(mn).place, minutes: mins, induced: how === "induced" }), 1500);   // midwives get the call (breeding add-on)
    saveLedger();
    return true;
  }
  // the production tick, for somebody in labour
  function labourTick(mn, p, now){
    const lb = p.labour;
    if (!lb.start) lb.start = lb.until - CFG.LABOUR_MIN*60000;   // (one that started before Nov 10)
    if (lb.stuck){
      if (now - lb.stuck.at >= CFG.STUCK_WAIT_MIN*60000) unstickLabour(mn, 0);   // nobody came: the farm girl turns it herself
      else if (onMap(mn) && now >= lb.next){ lb.next = now + labourGap(); emote("🍼 "+birthLine("stuckWait", mn), mn); }
      return;
    }
    if (now >= lb.until){
      const info = { midwife: lb.midwife || 0, helps: lb.helps || 0, turnedBy: lb.turnedBy || 0, induced: lb.how === "induced" };
      p.labour = null; giveBirth(mn, info); return;
    }
    if (!onMap(mn) || now < lb.next) return;
    lb.next = now + labourGap();
    const f = (now - lb.start) / Math.max(1, lb.until - lb.start);
    // now and then one comes turned crossways, past the middle (once a labour)
    if (!lb.stuckDone && f >= CFG.STUCK_AT && Math.random() < CFG.STUCK_CHANCE[(p.preg && p.preg.count > 1) ? 1 : 0]){
      lb.stuckDone = true; lb.stuck = { at: now };
      emote("🍼 "+birthLine("stuck", mn), mn);
      later(() => addonsEmit("labourStuck", mn), 1000);
      saveLedger(); return;
    }
    emote("🍼 "+birthLine(f < 0.4 ? "early" : f < 0.8 ? "strong" : "close", mn, null, "labour"), mn);
  }
  // the stuck one turned (by: who did it; 0: the farm girl, with her own line). The time it was stuck is added back.
  function unstickLabour(mn, by){
    const p = prodOf(mn), lb = p && p.labour; if (!lb || !lb.stuck) return false;
    const now = Date.now();
    lb.until += now - lb.stuck.at; lb.stuck = null; lb.turnedBy = by || CFG.BOT_MEMBER; lb.next = now + labourGap();
    if (!by) emote("🍼 "+birthLine("unstuck", mn), mn);
    saveLedger();
    return true;
  }
  // a midwife's hands: minutes off the labour, never closer than LABOUR_FLOOR_MIN to the end. → minutes left, or null
  function helpLabour(mn, mins){
    const p = prodOf(mn), lb = p && p.labour; if (!lb || lb.stuck) return null;
    const now = Date.now();
    lb.until = Math.max(now + CFG.LABOUR_FLOOR_MIN*60000, lb.until - Math.max(0, Number(mins) || 0)*60000);
    lb.helps = (lb.helps || 0) + 1;
    saveLedger();
    return Math.max(1, Math.ceil((lb.until - now) / 60000));
  }
