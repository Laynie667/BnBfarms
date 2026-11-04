  /* WHAT'S IN THIS FILE (10y9r2-stud-forms.js)
     THE FURRY STUDS, IN MORE THAN ONE VERSION (Laynie, Oct 27: "more trap versions"). Like the water beast, the farm's
     furry studs aren't always the same one now. Most times it's the usual, but sometimes it's:
       the werewolf       the grizzled alpha (ties them longer and fills them more), the new-turned one (six quick knots,
                          very sorry about every one), the blood moon wolf (likelier after dark; his bite leaves a heat,
                          unless heat's in their limits), the moon brothers (two werewolves who share)
       the minotaur       the bull of the maze (chases them to the middle of the hedge maze, and keeps them longer), the
                          old herd bull (one load, but what a load), the hothead (four quick ones), the show bull
                          (BEST IN SHOW written on them after)
       the stag           the white hart (rare, and likelier to take), the twelve-pointer (more of him), the shy stag
       the fox brothers   the silver fox (one old charmer, two big knots), the hen-house raid (carried off in a sack),
                          the guessin' game (blindfolded: six knots and six wrong guesses)
       the pride's lion   the challenger (two lions, four loads), the lazy king (they do the work: five times), the
                          black-maned king (more of him, likelier to take)
       the ram            the tup in his raddle (TUPPED written on them after), the black ram of the hills (three
                          times, wild), the two tups (four loads between them)
       the wolf den       the lone wolf (two huge knots: he doesn't share), the hunt (chased down first, and kept
                          longer), the snow pack (slow and warm)
     The whisper after says which it was. ?traps werewolf (or any of them) lists them, and which ones have had you.
     Every one's an anthro stud or a monster, like the usual ones.
  */
  const STUD_FORMS = {
    // ── the werewolf ──
    werewolf: {
      classic: { name: "the werewolf", w: 24 },
      alpha: { name: "the grizzled alpha", w: 9, hold: 11, mlX: 1.5,
        tell: "He kept you tied till the moon set. Your legs'll remember it a while.",
        lines: {
          beats: [
            ["There's an old grey werewolf sat on a stump at the edge of the clearin', like he's been waitin' there since moonrise. He has. He watches %n come up the path and doesn't move till they're close enough to touch.",
             "There's no howl tonight, which is worse. Just a deep, patient voice from the dark under the oaks: \"Took your time.\" Then the oldest werewolf in the woods steps out into the moonlight in front of %n."],
            ["He's silver from muzzle to tail, scarred across one eye, one ear torn ragged from some fight a long time ago, and he's bigger than any wolf %n's ever seen. He circles them once, slow, and breathes them in.",
             "He doesn't knock %n down. He doesn't have to. He puts one heavy grey hand on the back of their neck and they go down on their own, onto the moss, and he hums like that was the right answer."],
            ["\"Easy,\" he rumbles, settlin' over %n's back, heavy as a fallen tree. \"I've done this every full moon for a hundred years. I know how it goes.\"",
             "He noses the hair off %n's neck, finds the spot he wants, and closes his old teeth on it, not hard. Just enough so they know who's in charge for the rest of the night."],
          ],
          in: [
            ["He takes %n's %h slow, an inch at a time, the way a thing does when it's never once been in a hurry, and he doesn't stop till he's in to the root and his knot's pressin' at them like a fist.",
             "There's no ruttin' about it. He sinks into %n's %h deep and steady, and rocks, and rocks, and when the knot goes in it's so big %n sobs, and he licks their ear and tells them they took it well."],
            ["Then he's tied in %n for what feels like the rest of the night, pumpin' slow, his old heart beatin' against their back, talkin' low about the moons he's seen, and every so often he rolls his hips and floods them again.",
             "He keeps %n knotted under the moon till their legs shake, fillin' them in long, heavy pulses, and when it finally slips free he has them again, unhurried as the tide."],
          ],
          over: [["He ruts slow and heavy between %n's thighs, his knot swellin' against them, and paints their back and the moss silver, and holds them through every bit of it."]],
          end: ["The old alpha lets %n go when the moon's down behind the trees, %ml of him packed deep in their %h and his tooth marks on their neck, and walks off into the dark without lookin' back.",
                "%n wakes at dawn under the oaks, wrapped in a grey cloak that wasn't there before, with %ml of the old wolf still warm in their %h and their whole body achin' sweet.",
                "He licks the bite on %n's neck clean, very gentle for a thing that size, and leaves them on the moss %ml heavier. \"Next full moon,\" he says. It isn't a question."],
          endOver: ["The alpha leaves %n on the moss with %ml of him silver across their back and a bite on their neck that'll take a week to fade."],
        } },
      newturned: { name: "the new-turned one", w: 9, loads: 6, mlX: 0.55,
        tell: "He'll be mortified at breakfast. He'll be back next full moon all the same.",
        lines: {
          beats: [
            ["There's crashin' in the woods, and swearin', and a howl that cracks in the middle like a voice breakin'. Then a big gangly werewolf trips out of the bracken right in front of %n, and stares at them, and goes very still.",
             "%n's walkin' under the full moon when somethin' tall and shaggy and very new at bein' a wolf comes skiddin' down the bank, tail everywhere, and nearly knocks them flat."],
            ["It's one of the farmhands, or it was this mornin': bitten last month, turned for the first time tonight, all long legs and big paws he hasn't got the hang of, and he can smell %n, and it's clearly the best thing he's ever smelled.",
             "\"Sorry,\" he says to %n, in a voice that's half a growl. \"Sorry, I don't, I can't, you smell so-\" And then the wolf in him wins, and he's got them by the hips."],
            ["He bowls %n over in the leaves, tail waggin' so hard it thumps, and humps at them before he's even lined up, missin' twice and whinin' about it.",
             "He gets %n down on their hands and knees, all clumsy eager paws, and noses them everywhere at once, pantin' \"sorry, sorry\" into their neck."],
          ],
          in: [
            ["When he finally finds %n's %h he slams in all at once and yelps like he's the one gettin' fucked, and ruts like a mad thing, and his knot's in before either of them knows it.",
             "He finds %n's %h by luck more than anythin' and drives in hard and fast, all frantic hips and no rhythm, and he's knottin' them inside a minute, whimperin' \"sorry\" between every pump."],
            ["Then the knot slips and he's hard again straight away, and he's on %n again, and again, and again, a fresh knot every time, because it turns out new wolves don't need much rest.",
             "He cums fast and he cums a lot of times. Six, %n thinks, maybe seven. Every one of them a knot, every one of them a little \"sorry\" and a lick, and then he's goin' again."],
          ],
          over: [["He can't find the way in no matter how he tries, so he humps between %n's thighs, desperate and whinin', and cums all over their back again and again, apologisin' every time."]],
          end: ["By moonset he's curled round %n in the leaves, asleep, %ml of very enthusiastic werewolf in their %h, and his tail over them like a blanket.",
                "%n leaves the woods at dawn with %ml of new wolf in their %h and a farmhand-shaped wolf snorin' in the bracken behind them. He's goin' to be so embarrassed at breakfast.",
                "Six knots in, the new wolf falls asleep mid-hump with his head on %n's back. %n crawls out from under him %ml fuller and walks home grinnin'."],
          endOver: ["%n gets home at dawn striped with %ml of apologetic werewolf, and later there's a note pinned to the barn door that just says SORRY."],
        } },
      bloodmoon: { name: "the blood moon wolf", w: 6, nightX: 2, mlX: 1.2,
        after: (mn) => {
          face(mn, "heat", 120);
          if (limitBlocks(mn, "heat")) return "He bit you. It'll fade by mornin'.";
          startHeat(mn, BOTMN(), 1); return "He bit you, and the bite's put you in heat.";
        },
        lines: {
          beats: [
            ["The moon comes up red tonight, red as a coal, and everythin' in the woods goes quiet. %n's halfway home when the howl starts, and it doesn't sound like any wolf they've ever heard.",
             "A blood moon hangs over the farm, low and huge and the colour of rust, and somethin' in the woods has been howlin' at it since dusk. It stops as %n walks under the trees."],
            ["He's bigger than the werewolf, black as soot, eyes glowin' the same red as the moon, and he comes out of the dark on all fours and stands up on two, already hard, already lookin' at %n.",
             "The thing that steps out of the trees in front of %n is a werewolf the way a wildfire's a candle: black-furred, red-eyed, steamin' in the cold air, and every breath he takes is a growl."],
            ["He doesn't circle. He takes %n by the throat, gentle as anythin' and twice as certain, and lays them down in the leaves on their belly.",
             "He presses %n into the leaves with one huge black hand and sniffs down their spine, slow, and when he gets to the bottom he growls so deep the ground shakes."],
          ],
          in: [
            ["He buries his %c cock in %n's %h to the hilt in one long shove and ruts like the moon's goin' to set any second, wild and deep, and his knot's hot as a coal when it goes in.",
             "He breeds %n's %h like it's the last night of the world, hard and fast and growlin', and the knot locks in so tight %n can feel his heartbeat through it."],
            ["Then he sinks his teeth into %n's shoulder, just through the skin, and pumps them full while the red moon watches, and somethin' hot and strange goes runnin' through their blood from the bite.",
             "He bites %n's shoulder as he cums, a proper bite, and floods them, and the bite burns, and the burn goes all the way down through them and settles somewhere very low and very hungry."],
          ],
          over: [["He ruts between %n's thighs under the red moon and marks their back with a hot flood, and bites their shoulder, and the bite burns sweet."]],
          end: ["The blood moon sets, and the black wolf with it, and %n's left in the leaves with %ml of him in their %h and a bite on their shoulder that's still warm. It'll stay warm a while.",
                "%n staggers home under a sky goin' grey, %ml of the blood moon wolf in their %h, a fresh bite on their shoulder, and somethin' burnin' in them that wasn't there at dusk."],
          endOver: ["%n gets home with %ml of the blood moon wolf across their back and a bite on their shoulder that won't stop burnin'."],
        } },
      brothers: { name: "the moon brothers", w: 7, loads: 4,
        tell: "There were two of them, and they shared you very fairly.",
        lines: {
          beats: [
            ["Two howls tonight, from two sides of the wood, answerin' each other, gettin' closer. %n turns round on the path and there's a werewolf in front of them, and when they turn back there's one behind.",
             "%n's barely past the first trees when two werewolves drop out of the oaks either side of the path, one grey and one brown, grinnin' at each other over %n's head."],
            ["They're brothers, by the look of them, and they've clearly done this before: one takes %n's arms and the other their legs, and they carry them off the path between them like a prize.",
             "They sniff %n over from both sides at once, noses everywhere, and argue in growls about who found them first, and settle it the way brothers do: they'll share."],
            ["They lay %n down on a bank of moss between them, one at each end, and the moonlight shows %n exactly what they're both bringin'.",
             "The grey one holds %n down by the shoulders, and the brown one kneels behind them and lifts their hips, and they grin at each other again."],
          ],
          in: [
            ["The brown one takes %n's %h first, quick and deep, and knots them, and the grey one holds %n's face in his big hands and kisses them, all tongue, the whole time his brother's tied in them.",
             "One brother ties %n's %h while the other holds them still and licks the tears off their cheeks, and then they swap, and the second knot's bigger than the first."],
            ["They swap and swap till the moon goes down, one knot after another, one brother breedin' %n and the other holdin' and kissin' and waitin', and %n loses track of whose turn it is.",
             "Four knots in %n by moonset, two each, and the brothers howl together at the end like they've won somethin'."],
          ],
          over: [["The brothers take turns ruttin' between %n's thighs and across their back, one holdin' while the other finishes, till %n's soaked silver in the moonlight."]],
          end: ["The brothers leave %n sleepin' between them in the moss, %ml of two werewolves knotted into their %h, a warm furry wall on either side.",
                "At dawn there's two farmhands snorin' either side of %n in the moss, and %ml of werewolf in %n's %h, and nobody says a word about it at breakfast."],
          endOver: ["%n gets home at dawn with %ml of two werewolves across their back, and a grey hair and a brown hair stuck in every inch of it."],
        } },
    },

    // ── the minotaur ──
    minotaur: {
      classic: { name: "the minotaur", w: 24 },
      maze: { name: "the bull of the maze", w: 8, hold: 10, where: "the middle of the hedge maze",
        tell: "He herded you all the way to the middle of the maze. That's where he keeps what he catches.",
        scene: [["The hedges round the middle of the maze are taller than the barn, and the sky's a little square of blue above %n.",
                 "He snorts, and it rattles the hedges, and somewhere out in the maze somebody who was followin' %n gives up and goes home.",
                 "{t}His great hand covers both of %n's tits at once on the stone bench, and squeezes, slow.",
                 "There are scratches on the stone bench, tally marks, a lot of them, and he adds one with his horn while %n watches."],
                ["Every thrust shoves %n along the smooth stone bench, and he pulls them back down it by the hips.",
                 "His bellow goes out over the hedges, and the whole maze goes quiet, and %n's moan is the only sound left.",
                 "He holds %n up off the bench on him like they weigh nothin', and keeps goin'.",
                 "%n's lost all sense of which way's out, and he's not goin' to tell them."]],
        lines: {
          beats: [
            ["The farm's hedge maze is open, and there's a sign on the gate in the farmhands' writin': DON'T GO TO THE MIDDLE. %n gets lost anyway, and somewhere in the hedges somethin' big starts to snort.",
             "%n takes a wrong turn in the hedge maze, and then another, and hears hooves on the gravel somewhere behind them, heavy and patient, followin'."],
            ["Every turn %n takes, the hoofbeats are a little closer. They run. He doesn't need to. He knows every path, and he's herdin' them, and they come out into the middle of the maze right where he wants them.",
             "%n catches glimpses of him through the hedges: a horn, a shoulder, a ring glintin' in a nose. Every way they run he's already there, till there's nowhere left to go but the middle."],
            ["In the middle there's a stone bench worn smooth and a bull-man sat on it, nine feet of him, breathin' slow. \"You took the long way,\" he says to %n. \"They all do.\" And he stands up.",
             "The minotaur of the maze steps out of the last hedge, blockin' the only way back, and %n's got their back to the stone bench in the middle with nowhere to go but onto it."],
          ],
          in: [
            ["He bends %n over the stone bench and works his %c cock into their %h slow, so slow, till they're stretched round it and gaspin', and the hedges are so high nobody'll ever hear them.",
             "He lays %n back across the bench and takes their %h with long patient strokes, the flare of him pullin' at them every time, and he hums somethin' old and low while he does it."],
            ["He fills %n till their belly's round as a melon, and keeps them there in the middle of the maze, and fills them again when the sun's moved, because nobody ever finds their way in to stop him.",
             "Two loads, deep as wells, an hour apart, and between them he holds %n in his lap on the bench and strokes their swollen belly and tells them about the others who found the middle."],
          ],
          over: [["He ruts the length of himself between %n's thighs on the stone bench and floods the bench and their back, and nobody comes, because nobody can find the middle."]],
          end: ["He walks %n back out of the maze at sundown, every turn right first time, with %ml of minotaur sloshin' in their %h, and leaves them at the gate under the sign.",
                "%n finds their own way out at last, followin' the trail of the %ml of minotaur drippin' out of their %h onto the gravel, and the hoofbeats don't follow. Not this time."],
          endOver: ["%n stumbles out of the maze at sundown with %ml of minotaur down their back, and the sign on the gate still says DON'T GO TO THE MIDDLE."],
        } },
      oldbull: { name: "the old herd bull", w: 7, loads: 1, mlX: 2.4,
        tell: "One load from the old bull's worth three from anybody else.",
        scene: [["The oak's shade is cool and the grass is long, and the old bull's breath is slow and warm on %n's neck.",
                 "He rumbles somethin' to %n that might be words, in a language nobody's spoken for a hundred years.",
                 "{t}His great old hand cups both of %n's tits at once, gentle, and his thumb strokes slow.",
                 "The breeze moves the long grass round them in waves, and the old bull settles over %n like weather settlin' over a valley."],
                ["He moves like a tide, slow and enormous, and every stroke pushes the breath out of %n.",
                 "%n can feel his heartbeat through the whole length of him, slow as a grandfather clock.",
                 "Acorns drop from the oak onto the old bull's back, and he doesn't notice, and %n can't think about anythin' at all.",
                 "Somewhere in the middle of it %n realises they're holdin' his horn like a handle, and he rumbles his approval."]],
        lines: {
          beats: [
            ["Out in the far meadow, under the big oak, there's a minotaur so old his horns have gone grey at the tips, lyin' in the shade like a hill. He opens one eye as %n goes past. Then the other.",
             "The farmhands say there's a minotaur out in the far meadow older than the farm itself. %n doesn't believe them. Then he stands up under the oak, and keeps on standin' up."],
            ["He's slow gettin' to his feet and slower comin' over, and none of it matters, because he's the biggest thing %n's ever seen walk on two legs, and there's no hurry in the world that'd get them away from him.",
             "He looks %n over with old brown eyes, takes their chin in a hand like a saddle, turns their face this way and that, and grunts like he's pleased with the herd."],
            ["He lays %n down in the long grass under the oak, careful about it, and then he kneels over them, and the shadow of him blots out the sun.",
             "He settles %n over a fallen bough and pats their flank twice, and the grass round them shakes as he moves up behind."],
          ],
          in: [
            ["He's slow, and he's enormous, and his %c cock goes into %n's %h a little at a time, every inch a stretch they feel to their teeth, until he's seated and they can't breathe for the fullness of him.",
             "He opens %n's %h on the head of himself and leans, and leans, a patient weight that doesn't stop, till he's buried in them and their belly's pushed out with the shape of him."],
            ["He only cums the once. He doesn't need to do it twice. It goes on and on, a flood that swells %n's belly round and tight as a drum, and then rounder, and he holds them still through every pulse of it.",
             "When he cums it's like a dam goin': one long endless pour, and %n watches their own belly rise with it, and rise, and he strokes it while it does, rumblin' like distant thunder."],
          ],
          over: [["He lays the great length of himself along %n's back and ruts slow, and when he cums it soaks them from the neck down, one endless flood."]],
          end: ["One load from the old bull, but what a load: %ml of him swellin' %n's belly like they're due, and he lies back down under the oak and goes to sleep with his hand on it.",
                "%n waddles home from the far meadow with %ml of the old herd bull in their %h and a belly so round the farmhands stop and stare, and then start clappin'."],
          endOver: ["The old bull leaves %n soaked from neck to knees in %ml of him, and goes back to sleep under the oak like nothin' happened."],
        } },
      hothead: { name: "the hothead", w: 9, loads: 4, mlX: 0.6,
        tell: "He's a hothead, that one. Four times and he still wasn't finished.",
        lines: {
          beats: [
            ["There's a minotaur in the paddock %n's never seen before, a hothead with stubby horns and a shiny new ring in his nose, pacin' the fence like he's been told to wait and hates it.",
             "Somebody's put a new minotaur in the paddock, all stubby horns and too much energy, and he's already broken one gate this mornin'. He's eyein' the next one. Then he's eyein' %n."],
            ["He goes over the fence like it isn't there and charges, and stops so close %n can feel the wind of it, snortin', and then he grins and grabs them.",
             "He circles %n at a trot, snortin', stampin', tossin' his head and showin' off, and then loses patience completely and scoops them up over his shoulder."],
            ["He dumps %n on a bale of hay and he's on them before the hay's settled, all heavy muscle and hot breath and no plan at all.",
             "He pins %n over the water trough with one big hand and stamps his feet like he can't stand still. He can't."],
          ],
          in: [
            ["He shoves into %n's %h far too fast and far too eager, and bellows about it, and ruts like the hay's on fire, and cums before he's even found his rhythm.",
             "He fucks %n's %h like he's chargin' a gate, all strength and no sense, and the hay bale skids a foot across the floor with every thrust."],
            ["And then he's straight back at %n, hard again before he's pulled out, and goes again, and again, and again, a hothead to the very end.",
             "He has %n four times before the farmhands come with a bucket of cold water for him, and he's sulky as anythin' about bein' stopped."],
          ],
          over: [["He ruts against %n's thighs like a bull at a gate, four times in a row, and splashes everythin' in the paddock, the farmhands included."]],
          end: ["The farmhands drag the hothead off %n with a rope round his horns, still snortin', and %n slides off the bale with %ml of minotaur in their %h and hay in every crease.",
                "%n's left in the paddock with %ml of over-eager minotaur in their %h, and he's leanin' on the fence watchin' them limp off, grinnin' like he's done somethin' clever."],
          endOver: ["%n escapes the paddock drippin' with %ml of hothead minotaur, and he's already lookin' round for somebody else."],
        } },
      show: { name: "the show bull", w: 7, where: "the show ring",
        tell: "The judges gave him a rosette. They wrote one on you too.",
        after: (mn) => { later(() => bodyMark(mn, { write: { line: "BEST IN SHOW", area: "waist" } }), 3000); face(mn, "afterglow", 200); },
        scene: [["The judges walk slowly all the way round %n and the show bull, makin' notes, and one of them asks the handler about his lines.",
                 "The handler gives the show bull's coat one last brush while he's already mounted on %n, for the judges.",
                 "{t}A judge leans in to inspect %n's tits, very professional, and writes somethin' down.",
                 "The show bull snorts at the crowd and tosses his polished horns, and the crowd oohs, and %n moans."],
                ["The judges ask the handler to turn them a quarter so the stands can see, and the show bull obliges without slowin' down, and %n gasps.",
                 "Every stroke into %n gets a murmur from the crowd, and one of the judges says, \"Lovely depth.\"",
                 "The handler mutters encouragement to the show bull, and to %n, and both of them seem to be listenin'.",
                 "Rosettes flutter on the fence posts, and somebody in the stands is takin' bets on the class, and on %n."]],
        lines: {
          beats: [
            ["It's show day, the show ring's lined with folk, and the judges are callin' for the minotaur class. The farm's entry is a prize bull-man with polished horns and a rosette on his harness, and his handler's lookin' round for somethin' to show him off on. They find %n.",
             "%n's watchin' the show ring from the rail when the handler of the farm's prize minotaur points at them, and two farmhands lift them over the rail into the sawdust."],
            ["The show bull's groomed till he shines, every hair brushed, his horns oiled, a brass ring in his nose with a lead rope on it, and he paces round %n while the crowd oohs, showin' himself off from every side.",
             "The handler walks the minotaur round %n on his lead, once, twice, so the judges can see his lines, and the bull-man snorts and preens and never once takes his eyes off %n."],
            ["They bend %n over the judges' bench in the middle of the ring, and the judges take their seats, and pick up their pencils.",
             "The handler bends %n over the show rail at the front, where the judges'll get the best view, and unclips the lead."],
          ],
          in: [
            ["The show bull mounts %n in front of the whole ring and takes their %h with long, showy, perfect strokes, every one of them on display, and the judges lean in and write things down.",
             "He works his %c cock into %n's %h nice and slow so the judges can see every inch go in, and the crowd groans along with %n, and the handler beams."],
            ["He breeds %n twice for the judges, as the class requires, and holds them still after the second so the judges can see the swell of their belly, and the crowd applauds.",
             "The judges ask for a second showin', and get one, and the show bull floods %n so full they can see it from the back row, and somebody rings a bell."],
          ],
          over: [["The show bull ruts along %n's back in front of the judges and finishes with a flourish that reaches the front row."]],
          end: ["The show bull wins his class, and the handler pins a red rosette on his harness and a matchin' one on %n, who's sat in the sawdust with %ml of prize minotaur in their %h and can't stand.",
                "BEST IN SHOW, say the judges, and the crowd cheers, and %n's helped out of the ring with %ml of champion in their %h and the judges' notes about them pinned to the board by the gate."],
          endOver: ["The show bull takes second, which his handler blames on the judges, and %n's helped out of the ring with %ml of him across their back."],
        } },
    },

    // ── the stag ──
    stag: {
      classic: { name: "the rutting stag", w: 24 },
      whitehart: { name: "the white hart", w: 4, bonusX: 1.5,
        tell: "Folk say the white hart only ever comes to anybody once. Lucky you.",
        scene: [["The mist glows faintly round them, and somewhere in it there's music, very far off, that %n can't quite hear.",
                 "Every place the white hart touches %n, their skin tingles cool, like snow meltin' in the sun.",
                 "{t}He cups %n's tits in cool white hands, and they ache, sweet and slow, at the touch.",
                 "White petals drift down out of nowhere and settle on %n's back, and don't melt."],
                ["Time goes strange in the mist: %n can't tell if it's been minutes or hours, and doesn't care.",
                 "He's silent the whole time, but %n can feel what he means in every slow stroke.",
                 "The white flowers round them turn their faces to %n, and open wider.",
                 "His silver eyes never leave %n's, and the mist glows brighter every time they gasp."]],
        lines: {
          beats: [
            ["Out where the trees are oldest, a mist comes down in the middle of the afternoon, and out of the mist, white as frost, steps the white hart. Folk on the farm say you only ever see him once. %n's seein' him now.",
             "There's a hush in the wood, and every bird stops at once, and somethin' pale moves between the trees: a stag-man white from his hooves to the tips of his antlers, lookin' straight at %n."],
            ["He's tall and slender and moves without a sound, and his eyes are silver, and when he comes close he smells of snow and moss and somethin' sweet, and %n forgets which way the farm is.",
             "He walks round %n once, silent, and the moss under his hooves comes up in white flowers, and when he reaches out and touches their face, his hand's cool and very gentle."],
            ["He lays %n down on a bed of white flowers that weren't there a minute ago, and kneels over them, and the mist closes round them both like a curtain.",
             "He leads %n by the hand to an old fallen oak covered in pale moss, and bends them over it, slow, like he's settin' down somethin' precious."],
          ],
          in: [
            ["He takes %n's %h slow and deep and silent, long tapered strokes, and every one of them feels like a wish bein' made, and the mist glows round them.",
             "He moves in %n's %h so gently they hardly notice the size of him till he's all the way in, and then there's nothin' else in the world but the slow, steady push of him."],
            ["When he cums it's warm as summer and goes on a long time, and he holds %n through it, forehead to their neck, and the white flowers round them all open at once.",
             "Twice, under the old trees, both times so slow and so deep that %n's cryin' with it, and both times he kisses the tears away without a word."],
          ],
          over: [["He moves against %n's thighs slow and silent, and when he finishes the white flowers round them bloom, and he holds them close till the mist lifts."]],
          end: ["The mist lifts, and the white hart's gone, and %n's lyin' in a ring of white flowers with %ml of him warm in their %h and a feelin' like somethin's been decided.",
                "%n comes out of the wood with white petals in their hair and %ml of the white hart in their %h, and the farmhands who see them go very quiet and touch their caps."],
          endOver: ["The white hart leaves %n in a ring of white flowers with %ml of him on their skin, and when the mist lifts there isn't a single hoofprint."],
        } },
      royal: { name: "the twelve-pointer", w: 8, mlX: 1.4,
        tell: "The lord of the deer run had you. Every stag in the wood will smell it on you.",
        lines: {
          beats: [
            ["There's a roar in the wood like a tree comin' down, and then another, and then the biggest stag-man %n's ever seen comes through the bracken with twelve points on his antlers and the season blazin' in his eyes.",
             "The farmhands have been talkin' about him all week: a twelve-pointer, a royal, the lord of the deer run, roarin' the wood awake every night. %n goes to look. He finds them first."],
            ["His rack's wider than %n can reach, his neck's thick with the rut, and he's fought every stag in the wood for a fortnight and won every time. He roars at %n so close they feel it in their chest.",
             "He paws the ground in front of %n and tosses his great antlers, and the bracken all round them shakes, and the message is very plain: mine."],
            ["He herds %n into his scrape at the foot of a great oak, a patch of churned earth, musky and marked, and puts them down in the middle of it.",
             "He lowers his head and the twelve points of his antlers close round %n like the bars of a gate, and he walks them backwards till they're up against the oak."],
          ],
          in: [
            ["He covers %n like the season ends tomorrow, drivin' his %c cock into their %h in deep heavin' thrusts that shake the leaves down off the oak.",
             "He takes %n's %h with a roar that echoes through the whole wood, and every stag in it hears and knows he's won again."],
            ["He finishes deep in %n, roarin', and stands over them blowin' like a bellows, and then he does it again, because a royal doesn't stop at one.",
             "Twice, and the second time he roars so long the farmhands down at the barn stop work to listen, and %n's belly's warm and heavy with him."],
          ],
          over: [["He ruts against %n's thighs in his scrape and roars as he finishes across their back, markin' them as his."]],
          end: ["The twelve-pointer leaves %n in his scrape with %ml of him in their %h, smellin' so strongly of rut that every stag in the wood'll know whose they are for a week.",
                "%n crawls out of the royal's scrape at dusk with %ml of the lord of the deer run in their %h and moss and earth in their hair, and he roars after them once, just so they know."],
          endOver: ["%n leaves the royal's scrape with %ml of him across their back and his musk on them so thick the farm dogs won't come near."],
        } },
      shy: { name: "the shy stag", w: 8, mlX: 0.8,
        tell: "He'll be watchin' for you at the edge of the wood. He's too shy to wave.",
        after: (mn) => { face(mn, "afterglow", 240); },
        scene: [["His velvet antlers brush %n's cheek, soft as moss, and he apologises for it, and does it again.",
                 "He keeps askin' %n if they're comfy, and fetchin' handfuls of moss to put under their knees.",
                 "{t}He touches %n's tits like they might break, one fingertip at a time, his ears pink to the tips.",
                 "Birdsong goes on all round them, ordinary as anythin', and the shy stag's breath shakes against %n's neck."],
                ["Every time %n moans his ears go flat with surprise, and then he does it again, to hear it again.",
                 "He's slow, and careful, and gettin' braver, and %n can feel the moment he stops bein' shy.",
                 "He whispers %n's name like he's been practisin' it.",
                 "His long legs tremble, and he presses his forehead to %n's shoulder, and doesn't stop."]],
        lines: {
          beats: [
            ["There's a stag-man at the edge of the trees, antlers still in velvet, watchin' %n from behind a birch that doesn't hide him at all. When %n looks right at him he looks away, and then back.",
             "%n's sat on the stile at the edge of the wood when they notice the stag-man: soft brown, velvet still on his antlers, ears twitchin', standin' very still and very obviously hopin' not to be seen."],
            ["He comes closer a step at a time, stoppin' every time %n moves, until he's close enough to touch, and then he does, very carefully, one finger down their arm, and his ears go pink.",
             "It takes him a long time to get close to %n, and longer to say anythin', and when he does it's just \"Could I?\" in a voice so soft they have to lean in to hear it."],
            ["He lays %n down in the bracken like they're made of glass, and asks again, and when %n doesn't say no he lets out a long shaky breath.",
             "He kneels behind %n on the moss and rests his forehead on their back for a long moment, velvet antlers brushin' their shoulders, workin' up the nerve."],
          ],
          in: [
            ["He pushes into %n's %h so slow and careful, askin' if it's all right every inch of the way, and when he's in he just holds there, shakin', like he can't believe it.",
             "He takes %n's %h gentle and unsure, his long %c cock slidin' in a little at a time, and every time %n moans his ears flick back and he goes slower."],
            ["He gets braver as he goes, and when he finishes in %n it's with a soft surprised cry, and he holds them tight after like he's afraid they'll vanish.",
             "Twice, the second time a bit braver than the first, and when he's done he nuzzles %n's neck, and his velvet antlers are soft as anythin' against their cheek."],
          ],
          over: [["He moves between %n's thighs, shy and careful, and finishes with a soft little gasp across the backs of their legs, and says sorry, and means it."]],
          end: ["The shy stag walks %n back to the stile with %ml of him warm in their %h, and kisses their hand, and bolts back into the trees before they can say anythin'.",
                "%n leaves the wood with %ml of the shy stag in their %h and a flower he picked for them tucked behind their ear. He watches them all the way to the gate."],
          endOver: ["The shy stag leaves %n with %ml of him on their thighs and a flower behind their ear, and he's gone into the trees before they can thank him."],
        } },
    },

    // ── the fox brothers ──
    foxden: {
      classic: { name: "the fox brothers", w: 24 },
      silver: { name: "the silver fox", w: 8, loads: 2, mlX: 1.6, where: "the silver fox's den",
        tell: "He left a callin' card on your pillow. Of course he did.",
        scene: [["The fire crackles, and the silver fox refills %n's glass without lookin', and goes on talkin' about a book he's sure they'd love.",
                 "He kisses %n's neck between sentences, unhurried, like the kisses are punctuation.",
                 "{t}His clever paws find %n's tits under their shirt and stroke, slow, like he's turnin' pages.",
                 "The clock on his mantel ticks, and with every tick he undoes another button on %n, and admires what he finds."],
                ["\"Marvellous,\" he murmurs in %n's ear, and means every syllable.",
                 "His tail curls round %n's thigh and holds them open for him, very polite about it.",
                 "The firelight turns his fur to gold and %n's skin to amber, and he says so, at length.",
                 "%n's wine glass tips over on the rug, and neither of them notices for a long time."]],
        lines: {
          beats: [
            ["There's a letter pinned to %n's stall door in very neat handwritin', invitin' them to supper at the old fox's den at the edge of the wood. It's signed with a little drawin' of a fox. It's very hard to say no to.",
             "%n's walkin' past the edge of the wood when a door opens in a hillside they'd have sworn was just a hillside, and a fox-man with silver fur and a glass of wine in his paw says, \"Ah. There you are. Do come in.\""],
            ["He's older than the fox brothers, silver all over, with half-moon spectacles and a velvet smokin' jacket, and he's charmin' the way only a fox can be: he pours %n a glass, and asks about their day, and listens.",
             "His den's all books and firelight and good wine, and he talks to %n like they're the most interestin' thing he's heard in years, and somewhere in the second glass his tail's wrapped round their ankle."],
            ["\"I do hope you don't mind,\" he says, unbuttonin' %n with very clever fingers, \"but I've been thinkin' about this since I wrote the letter.\"",
             "He takes %n's glass out of their hand, sets it down very carefully, lays them back on the rug by the fire, and smiles with a lot of teeth."],
          ],
          in: [
            ["He takes his time with %n's %h, slow and practised and very, very good at it, murmurin' compliments in their ear in a voice like warm honey, till %n's beggin' for the knot.",
             "He slides into %n's %h by the fire with a contented sigh, and fucks them like a gentleman, which is to say slow and thorough and makin' absolutely sure they cum first."],
            ["Then his knot swells and ties them together on the rug, and he keeps %n there a long while, strokin' their hair, and pours them another glass with his free paw.",
             "He knots %n twice before the fire burns down, and between the two he reads to them, and the second knot's even bigger than the first."],
          ],
          over: [["He ruts between %n's thighs on the rug by the fire, ever so polite about it, and finishes all over their back with a very satisfied sigh."]],
          end: ["%n wakes on the rug by a dyin' fire with %ml of the silver fox in their %h, a blanket over them, and a callin' card on the pillow beside them. Of course there's a callin' card.",
                "The silver fox walks %n to the door at midnight with %ml of him tied warm in their %h, kisses their hand, and says he'll write. He does. The very next mornin'."],
          endOver: ["%n leaves the old fox's den with %ml of him across their back and a bottle of wine he insisted they take."],
        } },
      raid: { name: "the hen-house raid", w: 9, hold: 9, where: "the fox den, by way of the hen house",
        tell: "They stole you right out of the hen house. The farmer's still countin' the hens.",
        lines: {
          beats: [
            ["There's a commotion in the hen house in the middle of the night: hens squawkin', feathers everywhere, and gigglin'. %n goes to look, and a sack comes down over their head.",
             "%n's collectin' eggs in the hen house when the door bangs shut behind them, four red tails swish in the dark, and somebody whispers, \"That's a big one.\""],
            ["It's the fox brothers, on a raid, and they've decided %n's the best thing in the hen house. They tie the sack shut round %n's waist and carry them off across the fields, laughin' all the way.",
             "The fox-men bundle %n up in a feed sack, gigglin' and shushin' each other, and run off over the fields with them like they've stolen the prize hen."],
            ["They tip %n out of the sack on the floor of their den, and stand round admirin' their loot, and argue about how to share it.",
             "Back in the den they untie the sack and all four brothers crowd in to look at %n, and their grins get very wide."],
          ],
          in: [
            ["They share %n brother by brother: each one mounts them quick and greedy, knots their %h, and the others keep watch at the den door in case the farmer comes.",
             "One after another the brothers take %n's %h, quick and thievin' and pleased with themselves, each knot tyin' them a little longer than the last."],
            ["By the last brother there's feathers stuck all over %n and they're stuffed so full of fox they can feel it slosh, and the brothers are rollin' on the floor laughin' about the farmer's face.",
             "Four knots, and between them the brothers feed %n stolen eggs and tell them they're the best haul they've ever had."],
          ],
          over: [["They take turns ruttin' over %n in the den, gigglin', and leave them feathered and sticky and very thoroughly stolen."]],
          end: ["The brothers leave %n on the hen-house step at dawn, still in the sack up to the waist, %ml of fox in their %h and a note pinned to the sack: RETURNED WITH THANKS.",
                "%n's found in the mornin' in the hen house, nestled in the straw with the hens, %ml of fox brothers in their %h and feathers in their hair, and the farmer's still countin' the hens."],
          endOver: ["The fox brothers return %n at dawn, feathered and glazed with %ml of fox, with a stolen egg in each hand."],
        } },
      guess: { name: "the guessin' game", w: 9, loads: 6, mlX: 0.8,
        tell: "You lost the guessin' game every round. They think that's the best game ever.",
        lines: {
          beats: [
            ["The fox brothers have a new game, they say, and %n's goin' to love it, and before %n can say anythin' there's a silk scarf over their eyes and four sets of paws turnin' them round and round.",
             "\"Guessin' game,\" says one of the fox brothers, tyin' a blindfold over %n's eyes. \"You guess which of us it is. Get it right, you go home. Get it wrong...\" Gigglin' all round."],
            ["They spin %n till they're dizzy, then lay them down in the soft den beddin', and four voices giggle from four directions, and then go very quiet.",
             "They lead %n by the hands into the den and lay them down blind in the beddin', and %n can hear them sortin' out an order in whispers."],
            ["\"Ready?\" says somebody. \"Guess carefully,\" says somebody else. \"We'll know if you peek,\" says a third, and a paw strokes down %n's side.",
             "A paw strokes down %n's side, and another one tickles the soles of their feet, and nobody's sayin' which is which."],
          ],
          in: [
            ["Somebody mounts %n and knots their %h, and they're supposed to guess who, and they guess wrong, and the brothers cheer, and somebody else takes a turn.",
             "One of the brothers takes %n's %h and ties them, and asks very sweetly who it is, and %n guesses, and they're wrong, of course they're wrong, they all smell the same."],
            ["They play for hours. Every wrong guess is another round. %n gets one right, once, and they say it doesn't count because %n giggled, and start again.",
             "Six rounds, six knots in %n, six wrong guesses, and the brothers think it's the funniest thing in the whole world."],
          ],
          over: [["Every wrong guess, a brother finishes over %n's back, and by the end %n's guessin' wrong on purpose."]],
          end: ["They take the blindfold off at last and %n's lyin' in the den with %ml of fox in their %h and four identical grins round them. Nobody ever tells them who was who.",
                "%n never does win the guessin' game. They go home with %ml of fox brothers in their %h and a silk scarf for a consolation prize."],
          endOver: ["%n loses the guessin' game six times over and goes home with %ml of fox on them and the blindfold still round their neck."],
        } },
    },

    // ── the pride's lion ──
    lionpride: {
      classic: { name: "the pride's lion", w: 24 },
      rival: { name: "the challenger", w: 8, loads: 4, mlX: 0.9,
        tell: "Two lions fought over you. They both won, in the end.",
        lines: {
          beats: [
            ["There's a strange lion-man on the rocks today, lean and scarred, his mane all ragged, a nomad come to challenge the pride's lion, and the lionesses are watchin' to see who wins. So is %n, till the nomad sees them.",
             "%n's on the rocks when the roarin' starts: a nomad lion-man come to take the pride, and the pride's lion come down to stop him, and %n's right in between."],
            ["They fight for the rock, mane against scars, roarin' and rollin', and the lionesses hold %n and watch, because %n's the prize, it turns out. Nobody asked %n.",
             "The fight's short and loud and neither of them really wins, and they stand there scratched and pantin' and glarin', and then they both look at %n at the same time."],
            ["\"Share,\" growls the pride's lion at last, like it costs him, and the nomad grins with a lot of teeth, and the lionesses lay %n out on the warm rock between them.",
             "The lionesses settle it, the way lionesses do: they put %n down on the warm stone and step back, and let the two of them take turns."],
          ],
          in: [
            ["The pride's lion takes %n's %h first, barbed and fierce, makin' a point of it, and the nomad watches and paces, and then it's his turn, and he's got a point to make too.",
             "They take turns at %n's %h, one and then the other and then the first again, each tryin' to outdo the last, each one roarin' louder when he finishes."],
            ["By the end of it they've forgotten they were fightin'. They're both lyin' in the sun with %n between them, purrin', and the lionesses are groomin' all three.",
             "Four times between them, every time a little less about winnin' and a little more about %n, and by sundown the nomad's been let into the pride."],
          ],
          over: [["The two lions take turns ruttin' over %n's back on the warm rock, roarin' at each other across them, and both finish all over them."]],
          end: ["%n climbs down off the rocks at sunset with %ml of two lions in their %h, their back scratched, and a new lion in the pride who keeps lookin' at them very fondly.",
                "The two lions fall asleep with their manes in %n's lap. %n slips out from between them with %ml of lion in their %h, and the lionesses wink at them."],
          endOver: ["%n climbs down off the rocks with %ml of two rival lions across their back, and the lions still arguin' about who did better."],
        } },
      lazy: { name: "the lazy king", w: 9, loads: 5, mlX: 0.6, hold: 9,
        tell: "He made you do all the work. Five times. Lions.",
        scene: [["The rock's warm as an oven and the lazy king's belly is warmer, and %n's sat right on it.",
                 "A lioness fans the lazy king with a big leaf, and fans %n too, as an afterthought.",
                 "{t}He reaches up without openin' his eyes, gives %n's tits a lazy squeeze, and lets his paw flop back down.",
                 "He yawns so wide %n can see every one of his teeth, and then he grins at them."],
                ["%n's thighs are burnin' from the ridin', and he purrs \"don't stop\" and goes back to sleep.",
                 "Every so often his hips roll up into %n all on their own, and he looks surprised about it.",
                 "The lionesses keep score on the rock with a bit of chalk, and laugh every time he dozes off under %n.",
                 "His tail flicks lazy in the dust, and that's the most he moves all afternoon, except once, when %n slows down."]],
        lines: {
          beats: [
            ["It's hot on the rocks and the pride's lion is flat on his back in the sun, belly up, paws in the air, snorin'. The lionesses look at %n. Then at him. Then back at %n.",
             "%n finds the pride's lion-man asleep in the sun, sprawled across the warmest rock like a golden rug, and one of the lionesses says, \"He'll want you when he wakes. Might as well get comfy.\""],
            ["The lionesses help %n up onto him, very gently, so as not to wake him, and he wakes anyway, opens one golden eye, sees who's sat on him, and purrs like a cart rollin' over cobbles.",
             "He doesn't get up. He doesn't need to. He reaches up one heavy lazy paw and pulls %n down onto his belly, and yawns, and grins, and gets comfy."],
            ["\"You do it,\" he rumbles at %n, half asleep. \"I'm restin'.\" And he lies back with his paws behind his head, and the lionesses laugh.",
             "He's not movin' off that rock for anythin'. %n's goin' to have to do all the work, and the lionesses have sat down round them to watch."],
          ],
          in: [
            ["%n rides him in the sun, slow, his barbed %c cock catchin' in their %h every time they lift, and he purrs and dozes and now and then helps with one lazy roll of his hips.",
             "The lazy king lets %n do all the work, sinkin' their %h down on him and rockin', and every so often he wakes enough to grab their hips and pull them down hard, and then dozes off again."],
            ["He cums every so often all afternoon, little lazy floods, and every time he does he says \"good\" and falls asleep again, and %n's still on him at sunset.",
             "Five times, all afternoon, and he never once gets up. The lionesses bring %n water and fan them with big leaves, and laugh."],
          ],
          over: [["%n grinds on the lazy king's belly all afternoon, and he cums up their front every so often and falls back asleep."]],
          end: ["At sunset the lazy king finally sits up, stretches, licks %n's face once, and wanders off for his supper. %n's left on the warm rock with %ml of him in their %h and very tired thighs.",
                "%n climbs down off the lazy lion with %ml of him in their %h, legs like jelly after an afternoon's work, and he hasn't moved an inch."],
          endOver: ["%n gets off the lazy king at sunset glazed with %ml of him from belly to chin, and he's still asleep."],
        } },
      blackmane: { name: "the black-maned king", w: 7, mlX: 1.5, bonusX: 1.2,
        tell: "The black-maned king only comes every few years. The pride'll treat you like royalty for a week.",
        lines: {
          beats: [
            ["The pride's lion is away today, and in his place on the rock there's a lion-man %n's never seen: twice the size, with a mane as black as a burnt field, and the lionesses all flat on their bellies round him.",
             "A shadow falls over %n on the rocks, and they look up into the face of the biggest lion-man they've ever seen, his mane black as night and his eyes gold as coins, and he roars so loud the rocks ring."],
            ["He's the black-maned king, the lionesses whisper, the one who comes over the hills every few years and takes whatever he wants, and right now he wants %n.",
             "He walks round %n slow, the black mane brushin' their face, and breathes in their scent, and makes a sound so deep they feel it in their belly."],
            ["He takes %n by the scruff and carries them to the top of the rock, where the whole valley can see, and puts them down on their hands and knees.",
             "He presses %n down onto the warm rock with one huge paw between their shoulders, and the lionesses close round to watch, purrin' low."],
          ],
          in: [
            ["He mounts %n with a roar the whole valley hears, his barbed %c cock drivin' into their %h hard and deep, every pull back rakin' them till they scream.",
             "He takes %n's %h in deep fierce strokes, the barbs catchin' every time, and his teeth close on the back of their neck and hold them still."],
            ["Three times, each one a roar, each one a flood, and between them he lies over %n like a black blanket and won't let them move.",
             "When he cums in %n it's hot and heavy and a lot, and he stays buried in them roarin' at the sky, and then he does it again."],
          ],
          over: [["The black-maned king ruts against %n's back on top of the rock and roars as he soaks them, so the whole valley knows."]],
          end: ["The black-maned king leaves at sundown, back over the hills, and %n's left on top of the rock with %ml of him in their %h and the whole pride lookin' at them like they're somethin' special now.",
                "%n climbs down off the rock with %ml of the black-maned king in their %h and his roar still ringin' in their ears, and the lionesses groom them all the way down."],
          endOver: ["%n's left on top of the rock with %ml of the black-maned king across their back, and the whole valley heard him."],
        } },
    },

    // ── the ram ──
    ramstud: {
      classic: { name: "the ram", w: 24 },
      raddle: { name: "the tup in his raddle", w: 9,
        tell: "He's left his raddle mark on you, so the shepherd knows you've been tupped.",
        after: (mn) => { later(() => bodyMark(mn, { write: { line: "TUPPED", area: "hips" } }), 3000); },
        lines: {
          beats: [
            ["It's tuppin' time, and the shepherd's strapped the ram-man into his raddle: a leather harness across his chest with a fat block of blue crayon on the front. He's lookin' for ewes. He finds %n.",
             "%n leans on the gate of the tup paddock, and the ram-man inside lifts his head, and the block of blue raddle on his chest harness catches the light, and he trots over."],
            ["The shepherd explains, very matter-of-fact, that the raddle marks every ewe the tup's covered, so he knows who's been done. The ram-man's already got %n by the hips.",
             "He's thick and woolly and curly-horned and very single-minded, and he walks %n back to the rail with his chest, and the raddle leaves a blue streak across their front."],
            ["He bends %n over the rail of the paddock, and the shepherd leans on the gate to watch, and to count.",
             "He nudges %n down onto the straw with his horns and stands over them, and the shepherd says, \"Go on then, mark 'em.\""],
          ],
          in: [
            ["He tups %n hard and steady from behind, deep in their %h, and with every thrust the raddle on his chest rubs blue across their back, thicker and thicker.",
             "He covers %n like a tup covers a ewe, quick and heavy and certain, and the blue crayon on his harness smears all over their back with every shove into their %h."],
            ["He finishes deep in %n and stays there a moment, and then steps back so the shepherd can see the mark, and then, because it's the season, he tups them again.",
             "Twice, and by the second %n's back is solid blue, and the shepherd writes their name in his tuppin' book."],
          ],
          over: [["He ruts against %n's thighs and back, and the raddle marks them blue from hip to shoulder, which the shepherd says still counts."]],
          end: ["%n climbs out of the tup paddock with %ml of ram in their %h and a big blue raddle mark across their back, so everybody on the farm can see they've been tupped.",
                "The shepherd ticks %n off in his book, \"Covered,\" and %n waddles off with %ml of ram in their %h and their back blue as a summer sky."],
          endOver: ["%n leaves the tup paddock with %ml of ram on their back and the raddle mark blue across them all the same."],
        } },
      blackram: { name: "the black ram of the hills", w: 8, loads: 3, mlX: 1.2,
        tell: "The black ram's gone back up the hill. The shepherd says he never comes down twice for the same one. The shepherd's wrong.",
        lines: {
          beats: [
            ["There's a black ram-man come down off the hills in the night, wild as weather, and he's jumped the wall into the paddock, and the shepherd's out lookin' for him with a crook. %n finds him first.",
             "%n hears a wall go down somewhere out in the fields, stone by stone, and then a black shape comes over the rubble: a ram-man from the high hills, black-fleeced, eyes like a goat's, horns curled twice round."],
            ["He's nothin' like the farm's ram. He's rangy and wild and smells of heather and rain, his horns are chipped from a hundred fights, and he looks at %n like a storm looks at a haystack.",
             "He circles %n on the wet grass, stampin', and lowers his great curled horns, and %n backs up, and up, till the stone wall's at their back."],
            ["He pins %n to the wall with his horns either side of their head and his black fleece against their chest, and breathes on them, hot and wild.",
             "One butt from those horns and %n's over the broken wall, face down in the heather, and he's over them before they can get up."],
          ],
          in: [
            ["He takes %n's %h wild and rough, like the weather up on the tops, short hard thrusts that drive them into the heather, and he bleats like thunder when he finishes.",
             "He tups %n like a storm comin' over the hills, hammerin' into their %h, and the stones of the broken wall rattle with every thrust."],
            ["Then again, and then a third time, and the shepherd's crook never does find him, and by the end %n's not sure they want it to.",
             "Three times, rough and wild, and when he's done he nips %n's ear and leaps the wall and he's gone up the hill before they can turn round."],
          ],
          over: [["The black ram ruts against %n's thighs in the heather, wild and rough, and finishes across their back like a squall."]],
          end: ["The shepherd finds %n at dawn in the heather by the broken wall, %ml of wild black ram in their %h and black wool stuck to them everywhere, and just shakes his head.",
                "%n limps home from the high field with %ml of the black ram in their %h, smellin' of heather and rain, and the black ram watchin' them from the top of the hill."],
          endOver: ["%n gets home with %ml of the black ram across their back and black wool in their hair, and the wall's still down."],
        } },
      tups: { name: "the two tups", w: 8, loads: 4, mlX: 0.8,
        tell: "They called it a draw. They'll want a rematch.",
        lines: {
          beats: [
            ["There's two ram-men in the paddock this mornin', where there should only be one, and they've been buttin' heads since sunrise over who's in charge. Then %n climbs the gate, and they stop, and look.",
             "%n climbs into the paddock and walks right into the middle of a fight: two ram-men, horns locked, shovin' each other round in the mud. They unlock. They both turn round."],
            ["They decide to settle it with %n: whoever tups them best is in charge of the paddock. They shake on it. They butt heads on it. %n isn't consulted.",
             "They circle %n from either side, stampin', snortin' at each other across them, and then, by some ram agreement nobody else understands, they take turns."],
            ["One of them herds %n over the feed trough while the other one paws the ground and waits his go.",
             "They push %n against the fence, a ram either side, horns clackin' over their head as they argue whose turn it is."],
          ],
          in: [
            ["The first ram tups %n's %h hard and fast and proud, and steps back for the other, who goes harder and faster, just to make the point.",
             "They take turns at %n's %h, each one tuppin' a bit harder than the last to show off, and buttin' each other aside to get their next go."],
            ["Four times between them, and when they're done they've forgotten the fight entirely, and they're stood either side of %n, very pleased with the both of themselves.",
             "Neither wins. They call it a draw, and do it all again to make sure, and then call it a draw again, and %n's the one who can't walk."],
          ],
          over: [["The two tups take turns ruttin' against %n's thighs and splashin' them, buttin' each other out of the way between goes."]],
          end: ["%n climbs out of the paddock with %ml of two rams in their %h, and behind them the two tups are stood side by side at the gate, best of friends now, watchin' them go.",
                "The two rams call it a draw, and %n calls it a day, and limps off with %ml of the pair of them in their %h and mud up to their knees."],
          endOver: ["%n escapes the paddock with %ml of two rams across their back and the pair of them still arguin' over who won."],
        } },
    },

    // ── the wolf den ──
    wolves: {
      classic: { name: "the wolf pack", w: 24 },
      lone: { name: "the lone wolf", w: 8, loads: 2, mlX: 2.6,
        tell: "The lone wolf doesn't share. The pack can smell him on you.",
        scene: [["He breathes %n in at the throat, long and slow, like he's learnin' them by heart.",
                 "Somewhere outside the pack howls, and he growls back at the doorway without lookin' up from %n.",
                 "{t}His big clawed hands close round %n's tits, careful of the claws, and hold on.",
                 "The straw at the back of the den smells of him and nothin' else, and soon %n does too."],
                ["He never takes his eyes off %n's face, not once, not even at the end.",
                 "When %n moans he growls with them, low, so they can feel it in his chest.",
                 "A shadow crosses the doorway, and stops, and thinks better of it, and the lone wolf doesn't even look up from %n.",
                 "He licks %n's jaw, their neck, the corner of their mouth, slow and possessive, between every stroke."]],
        lines: {
          beats: [
            ["The den's empty today, all but one: a scarred black wolf-man sat at the back of it with his arms crossed, who the pack won't come near. He looks up when %n ducks in, and the look says the pack isn't comin' back till he's done.",
             "%n ducks into the wolf den and finds just the one wolf, the lone one the others give a wide berth, and he stands up slow and fills the whole back of the den."],
            ["He doesn't share, this one. He circles %n once and growls at the doorway, in case anybody's thinkin' of joinin' in, and nobody does.",
             "He takes %n by the jaw and turns their face up to his, studyin' them, and then he growls, low, like he's decided somethin' and it's not up for discussion."],
            ["He pins %n down on their back in the straw, one big clawed hand flat on their chest, and settles between their knees, lookin' them right in the eye.",
             "He drags %n into the back of the den where it's darkest and warmest, puts them down on the old straw where he sleeps, and covers them."],
          ],
          in: [
            ["He takes %n's %h face to face, slow and heavy, lookin' them in the eye the whole time, and when the knot goes in it's the biggest %n's ever taken, and he growls \"mine\" against their mouth.",
             "He sinks his %c cock into %n's %h like he's stakin' a claim, and ruts deep and steady and possessive till his huge knot locks them together."],
            ["Two knots, an hour each, and he doesn't let go of %n once in all that time, just holds them, and pumps, and growls at the door whenever a shadow crosses it.",
             "He ties %n twice and fills them so full their belly swells, and both times he holds them tight against his chest till the knot goes down."],
          ],
          over: [["He ruts against %n slow and possessive, face to face, and covers them in his scent and his seed, and growls at the door the whole time."]],
          end: ["The lone wolf lets %n go at last with %ml of him packed into their %h and his scent on them so strong the rest of the pack won't touch them for a week.",
                "%n crawls out of the den with %ml of the lone wolf in their %h and their belly round with it, and he watches them from the dark at the back, and growls, softly."],
          endOver: ["%n leaves the den with %ml of the lone wolf across them and his scent so thick the pack steps aside."],
        } },
      hunt: { name: "the hunt", w: 9, hold: 11, where: "the woods",
        tell: "They hunted you down fair and square. They'll want to do it again.",
        lines: {
          beats: [
            ["There's a howl, and then another, and the pack's outside the den before %n's even reached it, grinnin'. \"Run,\" says the biggest one. \"We'll count to a hundred.\"",
             "The wolf pack's restless today. They want a hunt. They look at %n. %n looks at them. One of them starts countin'."],
            ["%n runs, through the bracken, over the brook, under the brambles, and behind them the pack howls the count out loud, and stops at a hundred, and comes.",
             "They let %n get a long way, and then the howls start behind them, spreadin' out, comin' round both sides, and %n realises they're bein' herded."],
            ["They catch %n in a hollow full of leaves, the whole pack, crowdin' in, pantin', tongues out, and the biggest one takes them by the scruff.",
             "%n trips on a root, and the first wolf's on them before they've stopped rollin', and then the rest, pantin' and grinnin', and the chase is over."],
          ],
          in: [
            ["The one who caught %n gets first go, by pack law, and he takes their %h right there in the leaves, wild from the run, and knots them before he's got his breath back.",
             "They breed %n in the hollow one after another, still wild from the chase, every one of them knottin' their %h like he's earned it, because he has."],
            ["Then they carry %n home to the den between them and take turns all over again where it's warm, till every one of them's had them.",
             "Five wolves, five knots, and every one of them tells %n they ran a good chase while he's tied in them."],
          ],
          over: [["The pack takes turns ruttin' over %n in the leaves, pantin' from the chase, and marks them all over as caught."]],
          end: ["%n's carried back to the den slung over the biggest wolf's shoulder, %ml of the pack in their %h, leaves in their hair, and the pack's already talkin' about next time.",
                "The pack lets %n go at dusk with %ml of wolf in their %h and a promise of a head start next time. \"Count of fifty,\" says the biggest one. \"You're gettin' slow.\""],
          endOver: ["%n's let go at the edge of the woods with %ml of wolf across them and twigs in their hair, and the pack howlin' behind them."],
        } },
      snow: { name: "the snow pack", w: 7,
        tell: "The snow pack kept you warm all night. They'll be back next time it snows.",
        after: (mn) => { face(mn, "afterglow", 300); },
        scene: [["The wind screams over the drift outside, and in the heap it's so warm %n stops shiverin' at last.",
                 "Somebody's big white tail is curled over %n's feet, and somebody else's arm is under their head for a pillow.",
                 "{t}A white wolf cups %n's tits in his warm hands, like warmin' them is all he's doin'. It isn't.",
                 "The wolves breathe slow and deep all round %n, in time, like the whole heap's one big sleepin' thing."],
                ["Snow hisses against the door, and the white wolves hum, and %n can't tell where they end and the heap begins.",
                 "One of them noses the hair off %n's neck and licks it, slow, and dozes off right there.",
                 "Between knots somebody passes %n a mug of somethin' hot, and holds it to their lips.",
                 "The heap shifts and sighs, and a different white wolf is curled round %n now, and nobody hurried that either."]],
        lines: {
          beats: [
            ["It's bitter cold out and the wolf den's half buried in drift, and the wolf-men inside are white this time: a snow pack down from the high fells, curled up in a heap. One of them lifts the edge of the heap. \"In,\" he says to %n. \"You'll freeze.\"",
             "%n's shiverin' by the time they find the den, and it's full of white wolf-men all piled up together for warmth, and every head in the heap turns, and the heap opens up to make room."],
            ["They pull %n into the middle of the pile, and it's warm, thick white fur on every side, big hands rubbin' the feelin' back into their arms and legs, and somebody's tail over their feet.",
             "In the middle of the heap it's warm as a hearth, and the wolves press in close round %n from every side, all fur and slow breath, and somebody licks the snow out of their hair."],
            ["Then one of them presses close behind %n, and he's warm in a different way, and the rest of the heap hums and shuffles to give him room.",
             "Nobody hurries. The snow pack does everythin' slow. A white wolf curls round %n's back and noses at their neck, and asks with a soft low growl."],
          ],
          in: [
            ["He slides into %n's %h slow and warm and knots them, and they lie there tied in the middle of the heap while the wind howls outside, and nobody moves for a long time.",
             "They take turns with %n's %h through the long cold afternoon, slow and warm, one white wolf knottin' them while the others keep them warm."],
            ["When one knot slips another wolf curls round %n and ties them again, and in between they all doze, and the snow piles up against the door.",
             "Five white wolves by nightfall, five slow knots, and %n's never been so warm in their life."],
          ],
          over: [["The snow pack keeps %n warm between them, and they take turns ruttin' slow against them in the heap, and leave them sticky and drowsy."]],
          end: ["%n wakes in the middle of the white heap the next mornin' with %ml of the snow pack in their %h, warm right through, and the drift's been dug away from the door for them.",
                "When the snow stops the white wolves let %n go, %ml of them warm in their %h, wrapped in a fur one of them insists they keep."],
          endOver: ["%n leaves the snow pack's den warm right through, with %ml of them across their back and a white fur round their shoulders."],
        } },
    },
  };

  // which one it is this time (the usual one most often; the blood moon likelier after dark)
  function studForm(mn, kind){
    const all = STUD_FORMS[kind];
    if (!all) return { id: "classic" };
    const force = W.__FARMHAND_TEST__ && W.__studForce && W.__studForce[kind];
    if (force && all[force]) return Object.assign({ id: force }, all[force]);
    const night = inCurfew() || hourNow() >= 21 || hourNow() < 5;
    const can = Object.entries(all).filter(([, F]) => !F.can || F.can(mn));
    const w = can.map(([, F]) => F.w * (night && F.nightX ? F.nightX : 1));
    let x = Math.random() * w.reduce((a, b) => a + b, 0), i = 0;
    for (; i < can.length - 1; i++){ x -= w[i]; if (x < 0) break; }
    return Object.assign({ id: can[i][0] }, can[i][1]);
  }
  // the stud as this one has him: how many loads, how much, how long he keeps them, where, how likely to take
  function studDef(kind, F){
    const A = ANTHRO[kind];
    if (!F || F.id === "classic") return A;
    return Object.assign({}, A, { loads: F.loads || A.loads, ml: Math.round(A.ml * (F.mlX || 1)), hold: F.hold || A.hold, where: F.where || A.where, bonus: A.bonus * (F.bonusX || 1) });
  }
  function studLines(kind, F){
    const T = ANTHRO_LINES[kind], FL = (F && F.lines) || {};
    return { beats: FL.beats || T.beats, in: FL.in || T.in, over: FL.over || T.over, end: FL.end || T.end, endOver: FL.endOver || T.endOver };
  }
  // after: what this one leaves besides, a tally, and the whisper sayin' who it was
  function studFormAfter(mn, kind, F, v, hole){
    if (!F || F.id === "classic") return;
    let more = "";
    try { more = (F.after && F.after(mn, v, hole)) || ""; } catch(e){ warn("stud form:", e); }
    const r = rec(mn);
    r.studForms = r.studForms || {};
    const met = r.studForms[kind] = r.studForms[kind] || {};
    met[F.id] = (met[F.id] || 0) + 1;
    tell(mn, TRAP_KINDS[kind].icon+" That was "+F.name+", sugar."+[more, F.tell].filter(Boolean).map(x => " "+x).join(""));
  }
  // ?traps werewolf: who else it might be
  function studFormsText(mn, kind){
    const all = STUD_FORMS[kind];
    if (!all) return "";
    const met = (((rec(mn) || {}).studForms) || {})[kind] || {};
    const list = Object.entries(all).filter(([k]) => k !== "classic").map(([k, F]) => F.name+(met[k] ? " (had you "+met[k]+"×)" : ""));
    return "It isn't always the same one: most times it's the usual, but sometimes it's "+list.slice(0, -1).join(", ")+" or "+list[list.length - 1]+".";
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __studForms: () => STUD_FORMS, __studForm: (m, k) => studForm(m, k), __studDef: (k, id) => studDef(k, Object.assign({ id }, STUD_FORMS[k][id])) });
