  /* WHAT'S IN THIS FILE (10z6c-trap-ends-3.js)
     How each trap lets you go, batch 3 (10z6a-trap-ends.js): the farm's first machines (the milker through the egg
     post), the barn and yard ones (the brandin' arm through the price tag, the glory fence, the tickle rack and the
     mirror box), the saddle, the net, the cowbell, the weigh-in, the teasin' stall, the sheep dip, the carousel, the
     plow and the washin' line, and the auction block's call and the corn maze's. Each only uses what the trap's own
     lines use: %ml the load, %h the hole, %x the clutch, the word, the size, the price or the phrase. %n their name
  */
  {
    const end = (tab, kind, key, lines) => poolMore(kind, key, tab[kind] && tab[kind][key], lines);

    // ── the first machines ──
    end(TRAP_LINES, "milker", "end", [
      "The pump sighs down to nothin', the cups and sleeve let go one after the other, and %n's left slumped over the bar with %ml in the farm's can and nothin' left in them.",
      "{t}The cups pop off and %n's tits swing free, soft and emptied and pink at the tips, %ml lighter and still achin' for the pull.",
      "{c}The sleeve slides off %n's cock with a wet sound, %ml collected, and it twitches a few more times at nothin' before it gives up."]);
    end(TRAP_LINES, "breeder", "end", [
      "The machine grinds deep, shudders, and empties itself into %n's %h, %ml of it, hot and heavy, and holds there till the frame clicks open and lets them slide off.",
      "One last long stroke and a gush: %ml packed into %n's %h. The rail retracts, the hobbles drop, and %n crawls off the frame on shakin' knees, leakin' with every move.",
      "%ml, pumped into %n's %h in slow thick pulses, and a plug pops out of the frame and seals it in. The cuffs let go. %n's left full, corked and dazed in the straw."]);
    end(TRAP_LINES, "breeder", "endOver", [
      "The machine pulls back at the last second and paints %n from the small of their back to the backs of their knees, %ml of it, hot and thick, and the frame lets go.",
      "It shudders and sprays %ml across %n's ass in heavy ropes, then rubs the tip slow through the mess like it's signin' its name, and retracts.",
      "%ml, all over %n's back and rump, warm and drippin'. The cuffs open and %n's left kneelin' in the straw, glazed and achin' and empty.",
      "{v}It ruts the last few strokes along %n's slit and lets go, %ml splashed up their belly and thighs, and the frame opens with a sigh.",
      "The arm jerks and empties itself between %n's cheeks and down their thighs, %ml in thick warm stripes, and the hobbles click open."]);
    end(TRAP_LINES, "snare", "end", [
      "The ropes give all at once and drop %n in a heap, achin' and unfinished and so wound up that the straw against their skin makes them gasp.",
      "{v}The snare lets %n down slick and swollen and unfinished, and they lie there squirmin' in the straw, hips rockin' at nothin'.",
      "{c}The loops slip free and %n's set down hard and achin', their cock still standin' and leakin' with nothin' to show for it."]);
    end(TRAP_LINES, "pump", "end", [
      "The nozzle pulls free with a slurp and a plug's pushed in after it, and %n's let go with %ml sloshin' inside them and a belly round as a pumpkin.",
      "%ml, pumped in till %n's belly's tight as a drum. The straps let go and they stand with both hands on it, feelin' it slosh and settle.",
      "The pump coughs, the gauge reads %ml, and %n eases off the hose a careful inch at a time, belly swayin' heavy in front of them."]);
    end(TRAP_LINES, "eggs", "end", [
      "%x eggs bedded deep in %n's %h, and the post seals them in with a warm gob of jelly and sinks back into the floor with a contented hum.",
      "The dingin' stops at %x. %n's let go with their belly lumpy and heavy, and every step makes the clutch shift and click inside them.",
      "%x of them, laid neat and snug. %n stands up careful, one hand under their belly, and walks off very slowly so nothin' moves."]);
    end(TRAP_LINES, "eggs", "endHyper", [
      "%x eggs, and the post only stops because there's not a single gap left in %n's %h. They're let go round and tight and knobbly, too heavy to walk straight.",
      "The post lays and lays till %n's belly's pushed out huge and knobbled, %x eggs, and they have to be helped off it by two farmhands.",
      "%x eggs crammed into %n, and the post pats their swollen belly with its little brass arm before it sinks away. %n can't see their own feet."]);
    end(TRAP_LINES, "injector", "open", [
      "A cold swab, a quick pinch, and the needle slides into %n's thigh, and they watch the plunger sink all the way down before the arm lets go.",
      "The trap's arm holds %n still with a padded cuff while the needle does its work, slow and steady, till the barrel's empty and the cuff clicks open.",
      "The needle's in and out before %n can flinch, and the warmth spreads out from the spot like honey through their blood."]);
    end(TRAP_LINES, "lantern", "thought", [
      "You come back to yourself in the straw with a soft hum in your head, and the hum has words in it: you're here to be milked and bred, and you love it.",
      "Somethin' the lantern said is still glowin' behind your eyes: good stock doesn't say no, good stock says more. You feel like very good stock today."]);

    // ── the barn and the yard ──
    end(MORE_LINES, "brand", "end", [
      "The arm retracts with a whirr, and %n's let go with %x written on them in neat black capitals, still tacky, and every farmhand they pass reads it out loud.",
      "The straps fall away and %n twists round to read it: %x. The machine's underlined it twice, for emphasis.",
      "It stamps the farm's seal under the word for good measure and lets %n go, and %x's there for everybody to read, plain as a sign on a gate."]);
    end(MORE_LINES, "winch", "end", [
      "The chain lowers %n over the corral fence and lets go, and they land in the straw, and the gate's already bolted from the outside.",
      "The winch parks %n in the pen with a little jingle, like a shop bell, and trundles off to fetch the next one.",
      "%n's dropped in the pen with the collar still warm round their neck and the chain rattlin' away overhead, and the latch is well out of reach."]);
    end(MORE_LINES, "winch", "endNone", [
      "The rail runs out by the duck pond and the collar pops open, and %n's left standin' there rubbin' their neck, a long walk from anywhere.",
      "The chain hauls %n right round the farm and back to where it started, and lets them go exactly where it found them, which somehow feels worse.",
      "The winch gets halfway across the yard, jams, and unclips %n with a sulky clank, and they walk the rest of the way on their own.",
      "The collar lets go at the far end of the rail, and %n's left by the back fence, pink round the throat, with no idea which way the barn is."]);
    end(MORE_LINES, "cups", "end", [
      "The cups let go with a long suckin' sigh, and %n's left holdin' %x, swollen and hot and shiny, with milk beadin' at the tips.",
      "The harness unbuckles and %n's chest drops heavy into their hands, %x now, achin' and full and drippin' down their belly.",
      "{t}The cups pop off and %n's tits bounce free, %x and so heavy they sway with every breath, nipples dark and puffy and leakin'."]);
    end(MORE_LINES, "chute", "end", [
      "The funnel slides out, the strap comes off, and %n sits back with %ml of warm mash in them and a belly round and drum-tight under their hands.",
      "%ml of feed, and the chute finally lets %n go. They burp, blush, and waddle off with one hand under their swollen belly.",
      "The chute clanks shut and %n's let up, stuffed with %ml, so full and drowsy they curl up in the straw right there and doze off."]);
    end(MORE_LINES, "vines", "end", [
      "The vines lay %n down in the soft grass with %x pods tucked warm in their %h, and the last flower brushes their cheek and closes.",
      "%x pods planted deep in %n's %h, and the patch lets them go with a shiver of leaves. %n walks off flushed and full and achin' for more.",
      "The green slides out of %n slow and leaves %x pods behind in their %h, and the pollen's still hummin' in them, sweet and hot."]);
    end(MORE_LINES, "weights", "end", [
      "{c}The sleeve lets go with a pop, %ml drained into the tank, and the weights stay clipped on another minute, just to stretch them a little more.",
      "{c}%n's unclipped %ml lighter, with a pair that hangs heavier than ever and swings with every step, already fillin' back up.",
      "{c}The tank reads %ml, the sleeve slides off, and %n walks away bow-legged with their balls swollen and tender and achin' for the next milkin'."]);
    end(MORE_LINES, "pricetag", "call", [
      "Roll up, roll up! On the block: %n, freshly scrubbed and very obligin'. %x ribbons for the day. Who'll start me off?",
      "Bargain of the week at the sale block: %n, %x ribbons, comes with a bow on. Step right up and have a squeeze!",
      "Now here's a fine lot: %n, quiet to handle and easy to lead. %x ribbons, folks, and you'd be a fool to pass it up!"]);
    end(MORE_LINES, "pricetag", "end", [
      "The block lets %n down with %x RIBBONS still on their rump and a little queue of farmhands already countin' their coins.",
      "%n's let off the block, and somebody's added OR NEAR OFFER under the %x RIBBONS on their backside in a different pen.",
      "The farm girl hollers %x RIBBONS one last time and lets %n down, and they walk off with the price swingin' along behind them for everyone to read."]);
    end(MORE_LINES, "tickle", "gave", [
      "%n begs so hard the words come out in hiccups, and the rack winds down with a satisfied little purr and lets them slide off in a heap.",
      "\"Please, please, please,\" and the feathers stop mid-stroke. The cuffs open. %n lies there gaspin' and gigglin' at the rafters.",
      "The moment the beg's out of %n's mouth the brushes fold away like they were never there, and %n's left pink and wet-eyed and twitchin' all over.",
      "%n begs, and the rack gives one last little flick under their arm, just because, and lets them go."]);
    end(MORE_LINES, "tickle", "held", [
      "%n bites their lip through the whole thing and never says it once, and when the cuffs finally open they roll off the rack wheezin' and triumphant.",
      "The rack runs out of time before %n runs out of stubborn. The feathers fold away, and %n lies there laughin' at nothin', ribs achin', unbeaten.",
      "Not a single please. The straps let go and %n slides off the bench limp and red-faced, and the rack makes a small disappointed noise.",
      "%n outlasts the rack, just. They're let go hoarse and teary and gigglin', and they swagger out of the barn as best they can on shaky legs."]);
    end(MORE_LINES, "mirror", "loop", [
      "The glass shows %n a hundred times over, every one of them sayin' it. \"Your turn, pet. %x.\"",
      "\"Nobody's listenin' but me,\" the voice says, warm as a bath. \"Say it. %x.\""]);
    end(MORE_LINES, "mirror", "count", [
      "\"Mm. Good.\" The mirrors shimmer. %x more.",
      "\"Lovely. That one went right through you, didn't it?\" %x to go.",
      "The voice hums, pleased. \"Keep goin'.\" %x left."]);
    end(MORE_LINES, "mirror", "gave", [
      "On the fifth time the mirrors go soft and gold, the door swings open, and %n steps out with the words still warm in their mouth, and smiles.",
      "\"That's my good one,\" the voice purrs on the last time, and the box lets %n go, flushed and floaty and sayin' it once more under their breath.",
      "The fifth time %n says it they mean it, and the box can tell, and the door opens with a little chime like a bell.",
      "The mirrors dim, satisfied. %n walks out of the box dazed and pink, catches their own eye in a puddle on the way home, and says it again."]);
    end(MORE_LINES, "mirror", "held", [
      "%n's jaw aches from clenchin' it, but they never say it, and the mirrors go dark and sulky and the door creaks open.",
      "Time's up. \"Another day,\" says the voice, soft, very sure of itself, and %n steps out with the words circlin' just behind their lips.",
      "%n stares down every one of their reflections and keeps quiet, and the box gives up with a sigh and lets them out.",
      "The door opens and %n walks out with their mouth still shut tight and their cheeks hot, and the voice calls after them, \"I'll be here.\""]);
    end(MORE_LINES, "wall", "end", [
      "The board lifts at last and %n slides out of the fence on wobbly knees, %ml of strangers in their %h, and not one face to put to any of it.",
      "%n's let out of the glory fence sticky and gapin', %ml in their %h, and a little pile of ribbons in the gravel on the far side.",
      "The fence lets go and %n sits back in the grass, %ml in their %h and more drippin' off their chin, and listens to the boots walkin' away."]);
    end(MORE_LINES, "wall", "endOver", [
      "The board lifts and %n backs out of the fence glazed from chin to thighs, %ml of strangers dryin' on their skin.",
      "%ml, painted all over %n through a hole in a fence, and they never saw a single face. The board lifts and they sit in the dust, drippin'.",
      "The fence lets %n go sticky front and back, %ml of it, and they find a ribbon stuck to their thigh along with the rest.",
      "{t}%n slides out of the fence with %ml of strangers' seed stripin' their tits and belly, and they don't wipe it off on the way home.",
      "{c}%n's let out of the fence with their cock still hard and %ml of strangers splashed across their belly, and none of it went inside.",
      "The board lifts on %n kneelin' in the gravel, glazed with %ml from a whole lane of strangers, and the lane's already movin' on."]);
    end(MORE_LINES, "mister", "dud", [
      "The mister hisses, coughs, and spits out a puff of plain water. %n stands there damp and waitin' for somethin' to happen. Nothin' does.",
      "The bulb squeezes, and there's nothin' in it but air. %n's let go with a damp nose and a very suspicious look.",
      "The mister sprays %n with somethin' that smells of roses and does absolutely nothin' else. Somebody's idea of a joke.",
      "The nozzle sputters dry. %n waits, and waits, and checks themselves all over, and it really was empty.",
      "A puff of mist, a tickle in the nose, a sneeze. That's all. %n walks off still not quite trustin' it.",
      "The mister wheezes and gives up halfway. %n's left with one damp cheek and a racin' heart, and nothin' to show for it."]);

    // ── the saddle, the net, the cowbell, the weigh-in, the teasin' stall and the dip ──
    end(NEW_TRAP_LINES, "saddle", "end", [
      "The steel horse rocks to a stop and %n's unbuckled, and they slide off into the hay and lie there with their thighs still twitchin' and a grin a mile wide.",
      "The fence rail cheers as the straps let go, and %n's helped off the saddle by two farmhands, legs like jelly, ridden raw.",
      "{v}%n's unstrapped from the saddle slick and swollen between the thighs from all that grindin', and they walk off very, very carefully.",
      "{c}%n slides off the saddle with their cock still hard and achin' from bein' bounced against the leather all that time, and the rail whistles."]);
    end(NEW_TRAP_LINES, "net", "end", [
      "The net's let down slow onto the hay, and %n crawls out of the tangle with mesh lines pressed all over them like a waffle.",
      "The farm girl lowers %n into the straw, untangles them one limb at a time, and leaves the net in a heap with a bow on top.",
      "{t}%n's let out of the net with diamond marks pressed into their tits from hangin' in it, and the farm girl traces one with a fingertip, laughin'.",
      "The rope runs out and %n drops the last foot into the hay with a soft whump, net and all, and lies there spinnin' gently."]);
    end(NEW_TRAP_LINES, "bell", "end", [
      "The bell's padlocked on for half an hour. Every step %n takes is goin' to ring across the whole farm till then.",
      "Half an hour of clangin' ahead: the bell collar's locked on %n tight, and the key's gone back in the farm girl's apron.",
      "%n tries one careful step. CLANK. That's how the next half hour's goin' to go.",
      "The little padlock clicks shut on %n's bell collar. Thirty minutes of everybody knowin' exactly where they are.",
      "%n's belled for the next half hour, and the barn cats have already started followin' the noise."]);
    end(NEW_TRAP_LINES, "bell", "off", [
      "Half an hour on the dot, and the bell collar unlocks itself and drops off %n into the straw with one last mournful clonk.",
      "The padlock pops, the bell falls, and %n tiptoes away in sudden silence, which feels very strange.",
      "Click. The bell's off. %n walks three steps and keeps hearin' it anyway.",
      "The bell's half hour is up. It drops off %n's neck and rolls away under a hay bale, still dingin' faintly.",
      "%n's bell collar lets go at last, and somewhere across the yard somebody says \"aw\" like they'll miss it."]);
    end(NEW_TRAP_LINES, "scale", "call", [
      "Weigh-in results, folks! %n: %x. Somebody's been eatin' well.",
      "Fresh off the scale and read out loud for everyone: %n, %x. Make a note of it.",
      "The scale's needle settles and the farm girl hollers it to the whole yard: %n, %x!",
      "Today's weigh-in, for the record: %n comes in at %x. Fine figure of stock."]);
    end(NEW_TRAP_LINES, "scale", "end", [
      "The bars lift and %n steps off the scale with their figures chalked on their rump and every ear on the farm full of them.",
      "%n's let off the scale and given a ticket with their numbers on it, which the farm girl also pins to the barn board.",
      "{t}%n's let go with their cup size chalked across their chest where the farm girl wrote it, for anybody who missed the announcement.",
      "The scale sinks back into the floor and %n slinks away, measured, weighed, read out and very pink.",
      "The farm girl rubs out yesterday's numbers on the board and chalks up %n's, and lets them go with a pat on their newly weighed rump."]);
    end(NEW_TRAP_LINES, "teaser", "end", [
      "{c}The stall door swings open and %n stumbles out achin' and swollen and full fit to burst, and every step makes their balls throb.",
      "{c}%n's let out of the teasin' stall so pent up their cock's drippin' with every heartbeat, and the next stud's job is goin' to be very easy.",
      "{c}The teasers back off and the gate opens, and %n leans on the post with their balls drawn up tight and heavy and nowhere to put it all.",
      "{v}%n's let out of the teasin' stall swollen and drippin' and achin' to be filled, and every stud in the barn turns his head as they pass.",
      "The gate opens and %n staggers out flushed and shakin', wound so tight that the brush of their own thighs makes them gasp."]);
    end(NEW_TRAP_LINES, "dip", "end", [
      "The dip lets %n go pink and scrubbed and smellin' of lavender soap, and the farm girl fluffs them dry with a big towel.",
      "%n climbs out of the sheep dip squeaky clean, every mark and drip on them gone, and their skin tinglin' from the brushes.",
      "The brushes fold away and %n's tipped out onto clean straw, glowin' and damp and so clean they feel brand new.",
      "%n's let out of the dip with their hair in soapy spikes and not a single mark left on them anywhere, and the farm girl calls it a fresh start.",
      "Out of the trough comes %n, rinsed and scrubbed and fluffed, smellin' of lavender, ready to be got filthy all over again."]);

    // ── the carousel, the plow and the washin' line ──
    end(TRAPS2_LINES, "carousel", "end", [
      "The carousel creaks to a halt and the straps let go, and %n wobbles off the platform with %ml milked out of them and their belly sloshin' warm.",
      "Last lap. The wheel stops, %ml sloshes in the jars, and %n's tipped off at the gate still spinnin' in their head.",
      "%n's unbuckled at the gate after the last lap, %ml lighter and somethin' heavier, and has to hold the fence to stay upright.",
      "The farm girl waves %n off the carousel with the jars full, %ml of them, and %n staggers away in a long dizzy curve.",
      "{t}%n's let off the carousel with their tits milked soft and swingin', %ml in the jars, and the world still goin' round."]);
    end(TRAPS2_LINES, "plow", "end", [
      "The farmhand unhitches %n at the end of the last row, rubs their shoulders, and gives them a long drink from the water bucket.",
      "%n's let out of the harness at the headland, filthy and sweat-slick and blowin', and the field behind them's turned as neat as a quilt.",
      "{t}%n's unbuckled with the harness straps' red marks crossed over their tits, and the farmhand rubs liniment into them, slow.",
      "The traces drop and %n sinks to their knees in the warm turned earth, done in, while the farmhands lean on the gate and clap.",
      "%n's walked back to the barn by the halter, muddy to the knees and achin' all over, and given a rubdown and a bucket of oats."]);
    end(TRAPS2_LINES, "washline", "end", [
      "The pegs come off one by one, every one a little sting, and %n's let down onto the grass pink-dotted and smellin' of sun-dried linen.",
      "%n's unpegged and folded over the farm girl's arm like a sheet, carried in, and set down by the fire.",
      "{t}The last two pegs come off %n's nipples with a sharp sting each, and they're let down off the line gaspin' and rubbin' them.",
      "The line's lowered and %n flops onto the grass, every pinched spot throbbin', and lies there in the sun to recover.",
      "{v}The farm girl takes the last peg off from between %n's legs, slow, and %n yelps, and is let down off the line shakin'."]);

    // ── the auction block's call and the corn maze ──
    end(TRAPS3_LINES, "auction", "open", [
      "Roll up! %n's on the auction block, y'all! ?bid your ribbons, and the highest bidder walks them through three traps of their pickin'. Three minutes on the clock!",
      "LOT ON THE BLOCK: %n, fine stock, easy to handle. ?bid now: the winner picks three traps for them. Three minutes, folks!",
      "Bids open on %n! Three minutes, and the top bid chooses three traps to walk them through. ?bid your ribbons!",
      "The auction bell's ringin' for %n! ?bid your ribbons in the next three minutes, and the winner sends them through three traps of their choosin'.",
      "Who'll start me off? %n's up on the block for the evenin'. ?bid, folks: highest bid picks three traps for them, three minutes to go!"]);
    end(TRAPS3_LINES, "maze", "near", [
      "Heavy breathin', just the other side of the stalks. Don't stop.",
      "A stalk snaps behind you, then another, closer.",
      "You catch a glimpse of somethin' big between the rows, and then it's gone. It's circlin'.",
      "Somethin' laughs, low and pleased, somewhere in the corn. It's enjoyin' this."]);
    end(TRAPS3_LINES, "maze", "escaped", [
      "%n tumbles out of the corn at the exit with leaves in their hair and their heart poundin', and the growl behind them stops dead at the edge of the field.",
      "%n bursts through the last row into the open, gaspin', and turns round just in time to see a big shape melt back into the corn.",
      "Out! %n stumbles out of the maze and collapses on the grass at the exit, laughin', and somethin' in the corn huffs, disappointed.",
      "%n finds the way out with seconds to spare and leans on the exit post gaspin', and the farm girl ties a ribbon on them for makin' it.",
      "%n runs the last stretch flat out and bursts out of the maze, and the stalks behind them rustle and go still.",
      "%n slips out of the maze exit just ahead of whatever's in there, and doesn't look back till they're well past the gate."]);
  }
