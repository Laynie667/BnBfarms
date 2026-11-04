  /* WHAT'S IN THIS FILE (10z3-variant-lines-wider.js)
     More for the gas, spray and needle traps in all their kinds and strengths (10z2-trap-variant-lines.js): every
     pool a line or two fuller, and the ones that were about one kind of body get lines for the others ({v} pussy,
     {nv} none, {c} cock, {t} tits, {nt} flat). Nothin' here changes what a trap does. %n name · %ml · %x
  */
  (function(){
    const more = (pool, lines) => { if (Array.isArray(pool)) pool.push(...lines); };
    const G = VARIANT_LINES.gas, S = VARIANT_LINES.spray, I = VARIANT_LINES.injector;

    more(G.open, [
      "%n sits on an upturned bucket for a breather. The bucket sighs under them, and somethin' sweet comes up through the holes in it.",
      "A little brass bird on a weathervane by the door turns to look at %n, opens its beak, and breathes out colour."]);

    // heat
    more(G.heat.cloud, ["The pink rolls over %n like warm bathwater, smellin' of honeysuckle and somebody's sweaty sheets."]);
    more(G.heat.hit[0], [
      "Warmth floods %n from the belly down. They shift their weight, and shift it again, and can't find a way to stand that doesn't ache.",
      "%n's cheeks go hot and their breath goes short. Somethin' low in them has started to pulse like a second heartbeat."]);
    more(G.heat.hit[1], [
      "{nv}It hits %n hard and low. Their ass clenches on nothin', their cock jerks and starts to leak, and their hips start to roll on their own.",
      "{v}%n's pussy clenches and floods all at once. They press their thighs together and it only makes it worse.",
      "%n's whole body tips into heat in one breath. They're pantin', flushed to the collarbones, lookin' round for anybody at all."]);
    more(G.heat.hit[2], [
      "%n's on their knees, then on their elbows, ass high and swayin', makin' needy little noises at nobody. The heat's got all of them now.",
      "Three breaths and %n is rubbin' against the stall door like an animal in season, eyes glazed, beggin' the barn to breed them."]);
    more(G.heat.after, ["The pink thins away. %n's still pantin', and the nearest stud's ears have gone up."]);

    // milk
    more(G.milk.cloud, ["Warm white vapour pours over %n and clings, smellin' of the parlour at dawn."]);
    more(G.milk.hit[0], [
      "{nt}%n's nipples tingle and stiffen, and a pale bead swells at each one and rolls down their chest.",
      "%n's chest goes warm and heavy. They look down, and there's a damp spot spreadin'."]);
    more(G.milk.hit[1], [
      "{nt}%n's chest puffs up tight and tender, nipples stood out thick, and milk starts to dribble from both in steady little streams.",
      "Their let-down comes all at once. %n gasps and presses a hand to their chest, and it just runs between their fingers."]);
    more(G.milk.hit[2], [
      "{nt}%n's chest swells up hot and aching and starts to spray from both nipples in thin hissin' jets. They can't stop it. They can only moan.",
      "%n's leakin' so hard they're standin' in it, chest heavin', milk runnin' down their belly in sheets, and the gas keeps makin' more."]);
    more(G.milk.after, ["The white thins. %n's still drippin', and they're goin' to keep drippin' till somebody milks them out."]);

    // musk
    more(G.musk.cloud, ["The haze is the brown-gold of a hayloft at harvest, and it smells like the inside of a stud's stall."]);
    more(G.musk.hit[0], [
      "%n smells like the breedin' shed now. It's in their hair, their skin, the backs of their knees.",
      "A farmhand passin' %n stops, sniffs, and keeps lookin' back over his shoulder."]);
    more(G.musk.hit[1], [
      "{nv}%n reeks of rut and ready ass, and every animal on the row has lifted its head to look.",
      "The musk sinks into %n's skin and stays. Stall doors creak open one by one down the row."]);
    more(G.musk.hit[2], [
      "%n smells so ready the whole farm's turned toward them. Somethin' big is pacin' a fence line, and it's lookin' this way.",
      "It's comin' off %n thick as smoke. Every stud in the barn is pressed up against his gate, snortin'."]);
    more(G.musk.after, ["The gold settles. %n is goin' to be followed round all afternoon, and they know it."]);

    // needy
    more(G.needy.cloud, ["Lilac mist creeps up %n's legs like a slow caress and slips inside with their next breath."]);
    more(G.needy.hit[0], [
      "%n's skin starts to hum. Everything touches them a little too much and not nearly enough.",
      "There's an itch now, deep and low, and %n catches themselves pressin' a hand to it."]);
    more(G.needy.hit[1], [
      "{c}%n's cock goes stiff and achin' and they grind the heel of their hand against it, and it doesn't help one bit.",
      "{v}%n's clit throbs, swollen and hungry, and their fingers find it before their head has a say, and it isn't enough.",
      "%n rocks on their heels, whimperin', hands everywhere, and the ache just climbs."]);
    more(G.needy.hit[2], [
      "%n's down in the straw humpin' their own hand, frantic, sobbin', right at the edge and stuck there.",
      "There's nothin' left in %n but want. They'd beg a fence post if it'd help. It wouldn't."]);
    more(G.needy.after, ["The violet fades. %n's still squirmin', and every touch of cloth makes them gasp."]);

    // giggle
    more(G.giggle.cloud, ["Sunny yellow fizz bubbles up round %n and pops against their nose like lemonade."]);
    more(G.giggle.hit[0], [
      "A giggle slips out of %n, then another. Their skin's gone ticklish everywhere.",
      "%n snorts at nothin' and then can't stop."]);
    more(G.giggle.hit[1], [
      "%n's laughin' so hard they've got hiccups, clutchin' their sides, jumpin' at every brush of air.",
      "They're helpless with it, wheezin', tears on their cheeks, and a stray straw on their neck sets them off again."]);
    more(G.giggle.hit[2], [
      "%n's flat on the floor howlin', kickin' at the air, too ticklish to stand, too breathless to beg.",
      "They've laughed themselves limp. Every breath is a giggle and every giggle's a squeak."]);
    more(G.giggle.after, ["The fizz clears. %n hiccups, giggles at the hiccup, and has to sit down again."]);

    // haze
    more(G.haze.cloud, ["A blue hush settles over %n, soft as a blanket over a birdcage."]);
    more(G.haze.hit[0], [
      "%n stops mid-step and forgets where they were goin'. It doesn't seem important.",
      "The world goes soft round the edges, and %n smiles at it, slow."]);
    more(G.haze.hit[1], [
      "%n sways, loose and warm and empty, thoughts driftin' off like dandelion fluff. What's left wants to be touched.",
      "Their eyes go wide and blank and agreeable. %n would do just about anything if somebody asked nicely right now."]);
    more(G.haze.hit[2], [
      "%n kneels where they stand, mouth open, eyes glassy, waitin' for whoever comes along to tell them what they're for.",
      "Nothin' left in there but a warm, wet, willin' animal. %n smiles up at the rafters and spreads their knees."]);
    more(G.haze.after, ["The blue lifts. %n blinks, still soft-eyed, and doesn't quite remember why they ever said no to anything."]);

    // rut (cocks only)
    more(G.rut.cloud, ["Hot red smoke curls up between %n's thighs like it's lookin' for their balls."]);
    more(G.rut.hit[0], [
      "{c}%n's cock stirs, thickens, and stands, and their balls draw up heavy and full.",
      "{c}A deep hot ache settles in %n's sack. Their cock twitches and starts to rise."]);
    more(G.rut.hit[1], [
      "{c}%n's cock is rigid and drippin', and they're pawin' at the floor like a bull at a gate.",
      "{c}Their balls swell tight and heavy as they watch, and pre strings off the tip of their cock in a long shinin' thread."]);
    more(G.rut.hit[2], [
      "{c}%n's ruttin' at the air, cock slappin' their belly, balls swollen fit to burst, bellowin' for somethin' to mount.",
      "{c}Full rut: %n has a hay bale pinned and is humpin' it like it owes them, cock leakin', eyes wild."]);
    more(G.rut.after, ["{c}The red clears. %n's cock doesn't go down, and their balls are achin' full. Somebody ought to help with that."]);

    // ripen (pussies only)
    more(G.ripen.cloud, ["Green mist like spring rain settles low on %n's belly and soaks in."]);
    more(G.ripen.hit[0], [
      "{v}A slow warmth pools deep in %n's belly, and their pussy goes soft and slick without being asked.",
      "{v}%n's hand drifts low on their belly. It feels warm in there. Open. Ready."]);
    more(G.ripen.hit[1], [
      "{v}Somethin' deep in %n clenches and lets go, clenches and lets go. Their body's made up its mind: today it takes.",
      "{v}%n's pussy swells and weeps, and they ache in a way that only one thing will fix."]);
    more(G.ripen.hit[2], [
      "{v}%n is so ripe it hurts, pussy puffy and drippin', belly hot, and they'd take any stud on the farm right now without askin' his name.",
      "{v}%n doubles over, hands on their belly, feelin' every fertile pulse. They're goin' to catch from the next load whether they mean to or not."]);
    more(G.ripen.after, ["{v}The green fades. %n is ripe as summer fruit, and every stud downwind can tell."]);

    // moo
    more(G.moo.cloud, ["The fog smells like a field after rain and tastes of clover."]);
    more(G.moo.hit[0], [
      "%n says \"Wait,\" and it comes out \"Mmmoo.\" They stare.",
      "A small, hopeful moo escapes %n. They didn't mean that."]);
    more(G.moo.hit[1], [
      "%n tries three times to say somethin' clever and moos three times instead, each one louder.",
      "Every word that leaves %n has gone barnyard. They moo, flushed scarlet, at everybody."]);
    more(G.moo.hit[2], [
      "%n has given up on words. They low at the gate like the rest of the herd, and honestly it suits them.",
      "Long, mournful moos pour out of %n. Somebody pats their flank and tells them good cow."]);
    more(G.moo.after, ["The fog lifts. %n opens their mouth, thinks better of it, and just nods."]);

    // ── the sprays ──
    more(S.open, [
      "A frame like a wash rack swings round on a hinge and catches %n against it, arms out, and a showerhead the size of a dinner plate lowers itself.",
      "%n leans on a post to tie a lace. The post grows two cuffs and a nozzle."]);
    more(S.seed.cloud, ["The pipes gurgle. Whatever's coming is warm, thick, and smells like the stud barn on a hot day."]);
    more(S.seed.hit[0], [
      "{nt}A thick warm rope lands across %n's chest and slides down their belly in a lazy stripe.",
      "Two quick warm splashes: one across %n's mouth, one in their hair."]);
    more(S.seed.hit[1], [
      "{nt}Load after load lands on %n's face and chest, hot and ropy, drippin' off their chin and nipples.",
      "The spouts take turns on %n, steady as a milking line, till they're strung with it from forehead to belly."]);
    more(S.seed.hit[2], [
      "It comes down on %n like a summer storm made of stud. They're glazed, blinded, swallowin' when they have to, drippin' everywhere.",
      "%n gets every drop of the tank, and it's a big tank. They're dripping white from every inch."]);
    more(S.seed.after, ["The rack opens. %n stands in a white puddle, painted head to toe and smellin' of every stud on the farm."]);
    more(S.piss.cloud, ["The pipe overhead groans and steams. It's the drain from the stall row, and it's comin' this way."]);
    more(S.piss.hit[0], [
      "A warm yellow stream splashes across %n's belly and runs down their legs.",
      "One spout opens on %n's chest, hot and steady, and keeps goin'."]);
    more(S.piss.hit[1], [
      "Three spouts at once, hot and rank, on %n's face and chest and between their legs. They splutter and get a mouthful.",
      "It drums on %n's head and pours off them, steamin', and they've given up turnin' away."]);
    more(S.piss.hit[2], [
      "%n's drowned in it, hot gold from every side, and a spout parked on their open mouth till they swallow.",
      "Every pipe empties on %n at once. They kneel in a steamin' flood, soaked and marked through."]);
    more(S.piss.after, ["The pipes go dry. %n is drippin' and reekin', and they'll be smelt comin' a mile off."]);
    more(S.milk.cloud, ["The tank's warm and sweet-smellin'. It's the mornin's milk off the whole herd."]);
    more(S.milk.hit[0], [
      "{nt}A soft warm spray splashes across %n's chest and runs down in creamy rivers.",
      "Warm milk sprinkles over %n like rain, and they lick their lips without thinkin'."]);
    more(S.milk.hit[1], [
      "A spout finds %n's mouth and keeps fillin' it, warm and sweet, while the rest of them wash %n down in white.",
      "%n's soaked in milk to the skin, and a nozzle at their lips makes sure they drink their share."]);
    more(S.milk.hit[2], [
      "A hose fills %n's mouth and doesn't stop, and their belly swells round and sloshin' with the herd's milk while the rest pours over them.",
      "They're drowned in it and force-fed it, gallons of warm milk, till %n's belly's tight and they're coughin' white."]);
    more(S.milk.after, ["The rack lets %n go sticky and sweet and sloshin', smellin' like the dairy."]);
    more(S.slime.cloud, ["The nozzles fill with somethin' green that doesn't so much pour as decide to come out."]);
    more(S.slime.hit[0], [
      "{nt}A cold glob lands on %n's chest and slithers slowly south.",
      "Green ropes slap across %n's shoulders and start, very slowly, to spread."]);
    more(S.slime.hit[1], [
      "The slime coats %n like a glove, cool and clingin', creepin' into every fold and crease they've got.",
      "%n's covered from neck to knees in it, and it's sticky enough that their arms stick to their sides."]);
    more(S.slime.hit[2], [
      "It dissolves %n's clothes and keeps comin', pushin' cool fingers inside them wherever it can find a way.",
      "%n's buried in green, glued to the frame, and the slime is busy findin' every way in."]);
    more(S.slime.after, ["%n peels away from the rack in long green strings and squelches off, stickin' to the floor at every step."]);
    more(S.oil.cloud, ["The spouts mist out somethin' warm and gold that smells of cloves and saddle soap."]);
    more(S.oil.hit[0], [
      "{nt}A fine warm mist settles on %n and their nipples pebble up hard under it.",
      "Warm oil beads on %n's skin and sinks in, and everywhere it touches tingles awake."]);
    more(S.oil.hit[1], [
      "{c}The oil runs down %n's belly and over their cock, and it stands up glistenin' and achin' for a hand.",
      "{v}The oil runs between %n's legs and finds their clit, and it throbs, slick and swollen.",
      "%n glistens head to toe, flushed and pantin', every nerve lit, thighs pressin' together for relief they won't get."]);
    more(S.oil.hit[2], [
      "{c}%n's oiled from scalp to soles, cock slick and leakin' and twitchin' at the breeze. One stroke would finish them.",
      "They baste %n inside and out, and a breath on their skin makes them buck in the cuffs."]);
    more(S.oil.after, ["%n's let go gleamin' like a prize show animal and so sensitive their own hair is too much."]);
    more(S.ink.cloud, ["The tank's full of sheep marker, bright blue and stubborn."]);
    more(S.ink.hit[0], [
      "{nt}A blue splat lands square on %n's chest. On a ewe, that means the ram's been.",
      "A blue blot catches %n across the belly and soaks right in."]);
    more(S.ink.hit[1], [
      "Blue across their chest and down their thighs, and then the stencil thumps a word on them, big and neat.",
      "%n is sprayed and stamped like stock at the sale, front and back, for the whole farm to read."]);
    more(S.ink.hit[2], [
      "%n is dyed blue from collarbone to knees and labelled three times over. Nobody's goin' to mistake what they are.",
      "Blue handprints on their ass, blue stripes down their belly, and the stencil front and centre. %n's been well and truly marked."]);
    more(S.ink.after, ["%n walks off blue as a tupped ewe, and the stencil's goin' to take a week of scrubbin'."]);
    more(S.hose.cloud, ["The big hose stiffens and kicks. It's the well water, and it's cold."]);
    more(S.hose.hit[0], ["The jet hits %n like a slap of ice and they yelp, scrubbed clean of everything in one blast."]);
    more(S.hose.hit[1], ["%n gets hosed down like a muddy pony, every inch of them, till they're shiverin' and squeaky clean."]);
    more(S.hose.hit[2], ["The hose goes over %n inch by inch, front, back and in between, till they're scrubbed raw-pink and spotless."]);
    more(S.hose.after, ["%n's let go clean and chatterin', and somebody kind tosses them a horse blanket."]);

    // ── the needles ──
    more(I.styles.arm[0], ["A padded arm hooks %n round the waist from behind, gentle as a dance partner, and a second arm with a needle unfolds beside them."]);
    more(I.styles.arm[1], ["It finds a vein %n didn't know they had, taps it twice, and settles in to wait for them to stop wrigglin'."]);
    more(I.styles.chair[0], ["A dentist's chair swivels out of a stall as %n passes and scoops them up, buckles flyin'."]);
    more(I.styles.chair[1], ["A rubber thumb presses the soft inside of %n's elbow, and a needle comes down to meet it, slow and sure."]);
    more(I.styles.dart[0], ["A dart whistles out of the hay and takes %n in the hip. They stare at it, then at the hay, betrayed."]);
    more(I.styles.dart[1], ["%n tugs at the dart. Its little barbs say no, and the barrel keeps emptyin'."]);
    more(I.styles.collar[0], ["A collar drops from the rafters on a chain and snaps round %n's throat, warm and humming, little glass vials ringed round it."]);
    more(I.styles.collar[1], ["The collar clicks, considers, and turns a vial to sit right over %n's pulse. Click."]);
    more(I.fill[0], ["A dainty little dose, barely enough to wet the glass."]);
    more(I.fill[1], ["A proper dose, full to the line and a bit over for luck."]);
    more(I.fill[2], ["The barrel's so big it needs a stand to hold it up. It's full."]);
    more(I.open[0], ["A quick sting and a cool bloom, and the little dose is in."]);
    more(I.open[1], ["The plunger goes down smooth and steady, and %n feels it spread warm through them as it goes."]);
    more(I.open[2], ["It empties the whole huge barrel into %n in long heavy strokes, and they slump in its grip, flushed and dizzy, as it hits."]);
    more(I.second, ["A second barrel clicks into place. Different colour. Same enthusiasm."]);
  })();
