/* WHAT'S IN THIS FILE (barn-life/more-lines.js)
   The Oct 15 batch for barn life: lines for each kind of animal at the trough and the water, groomin' that suits their
   coat (or their latex), what happens when their hands are tied or pawed, and more for every pool. index.js and
   herd.js push them in. Tags on the front ({t}, {c}, {v}…) say which body a line suits (see _lib/connect.js).
   %name% the animal · %by% the groomer · %a% what they are · %call% the noise their kind makes · %w% %l% winner, loser
*/
export const EAT = [
  "%name% gets their nose right down in the trough and doesn't come up till half of it's gone.",
  "%name% eats noisily, a happy little grunt between mouthfuls.",
  "%name% roots through the feed for the sweet bits, scattering the rest all over the floor.",
  "%name% stands at the trough chewin' slow and steady, like the good farm %a% they are.",
  "%name% eats till their belly's round and tight, then has just one more mouthful.",
];
export const EAT_KIND = {
  cow: ["%name% pulls a big mouthful of hay from the trough and chews it slow, jaw goin' round and round like a proper cow.",
        "%name% grazes at the trough, lowin' softly between mouthfuls, tail flickin'.",
        "%name% chews and chews and chews, dreamy-eyed, then goes back for more."],
  horse: ["%name% lips at the oats in the trough, snufflin' for the sweetest ones, and crunches them up.",
          "%name% buries their nose in the hay net and tugs out a mouthful, chewin' with a contented snort.",
          "%name% stamps once at the trough, impatient, then gets their face in the feed."],
  pig: ["%name% snuffles and snorts through the trough, nose first, slop all up their cheeks.",
        "%name% roots through the feed like there's a truffle at the bottom, gruntin' happily.",
        "%name% eats like a proper pig, loud and messy and delighted about it."],
  dog: ["%name% wolfs the feed down in about four seconds flat, then licks the trough clean.",
        "%name% eats with their whole face, tail goin', and looks up hopeful for seconds.",
        "%name% gulps their food so fast they have to stop for a little cough, then dives back in."],
  cat: ["%name% eats daintily from the very edge of the trough, one fussy mouthful at a time.",
        "%name% sniffs every bit of the feed before decidin' it's acceptable, then eats it all.",
        "%name% picks at the trough, pausin' to lick their lips, unhurried and particular."],
  bunny: ["%name% nibbles at the greens in the trough, nose twitchin', little bites, very fast.",
          "%name% munches a whole leaf from one end to the other without stoppin'."],
  goat: ["%name% eats the feed, a corner of the trough sign and a bit of somebody's sleeve.",
         "%name% headbutts the trough, gets what falls out, and chews it with great satisfaction."],
  deer: ["%name% eats in quick, nervous little bites, lookin' up between every one.",
         "%name% nibbles at the feed delicately, ears flickin' at every sound in the barn."],
  bull: ["%name% shoves their face into the trough and eats like a bull, huge mouthfuls, snortin' between them.",
         "%name% clears half the trough in one go, chewin' slow and heavy, and dares anybody to say a word."],
  sheep: ["%name% crops at the hay in neat little bites, munchin' steady, never lookin' up.",
          "%name% follows the next one over to the trough, because that's where everybody's goin', and eats."],
  fox: ["%name% snatches the best bits from the trough and darts off a step to eat them, eyes bright.",
        "%name% eats with one ear turned back, like somebody might take it off 'em."],
  wolf: ["%name% bolts the feed down, growlin' softly at anybody who comes close to the trough.",
         "%name% tears into the feed like it was hunted, then licks their chops."],
  rat: ["%name% nibbles at everything in the trough, one quick bite of each, whiskers twitchin'.",
        "%name% stuffs their cheeks full and squirrels the rest away in a corner of the stall for later.",
        "%name% picks through the feed with greedy little hands and eats the crumbs nobody else wanted."],
  dragon: ["%name% tears into the feed like it's a kill, tail curled round the trough so nobody else gets near it.",
           "%name% eats in big, careful bites, then breathes a little warm smoke over what's left, like they're keepin' it."],
  goblin: ["%name% eats with both hands and no manners, grinnin' through a mouthful.",
           "%name% stuffs their pockets with feed for later, then eats what's left."],
};
export const EAT_BOUND = [
  "With no hands to help, %name% has to push their whole face into the trough and eat like stock.",
  "%name% kneels and eats straight from the trough, hands useless, feed sticking to their chin and cheeks.",
  "Their hands are no good to them, so %name% noses the feed into a pile and gobbles it face-first.",
];
export const DRINK = [
  "%name% drinks long and greedy, throat bobbin', and comes up gasping and dripping.",
  "%name% laps at the water, quick and noisy, till their chin and chest are soaked.",
  "%name% sucks the water up in long pulls, eyes closed, sighing between gulps.",
  "%name% dunks their whole face in, blows bubbles, and drinks.",
];
export const DRINK_KIND = {
  cow: ["%name% drinks in long, slow pulls, like a cow at the pond, water runnin' off their chin."],
  horse: ["%name% plunges their muzzle in and drinks deep, ears flickin', then blows out a snort that splashes everywhere."],
  pig: ["%name% slurps at the water trough, then flops in it a little to cool off."],
  dog: ["%name% laps at the water so fast and sloppy that most of it ends up on the floor."],
  cat: ["%name% laps delicately at the very edge of the water, then shakes a drop off their nose with disgust."],
  bunny: ["%name% takes quick little sips, nose wigglin', and keeps an eye out the whole time."],
  goat: ["%name% drinks, then tries to climb into the water trough. It's a goat thing."],
  bull: ["%name% drinks in great heavy gulps, then blows hard through their nose and splashes the whole trough."],
  sheep: ["%name% drinks in neat little sips and keeps close to the others at the trough."],
  fox: ["%name% laps quick and quiet, ears turnin' at every sound, ready to dart off."],
  wolf: ["%name% laps the water loud and long, then shakes their head and showers everybody nearby."],
  deer: ["%name% drinks with their head low and their eyes up, startin' at every creak of the barn."],
  rat: ["%name% sips at the very edge of the trough, whiskers wet, then washes their face with their hands."],
  dragon: ["%name% drinks long and deep, and the water steams a little where their breath hits it."],
  goblin: ["%name% drinks straight from the trough with both hands, gulpin' and slurpin', and wipes their mouth on their arm."],
};
export const DRINK_BOUND = [
  "No hands, so %name% gets down and laps from the water trough like any animal would.",
  "%name% kneels at the water and drinks face-first, water drippin' off their nose and chin.",
];
// gagged: they still eat and drink, round whatever's in their mouth, and it's a mess (Oct 19)
export const EAT_GAG = [
  "%name% presses their gagged face into the trough and works the mash in round the edges of the gag, most of it endin' up on their chin.",
  "%name% can't chew past the gag, so they suck the soft feed in a bit at a time, droolin' mash down their front.",
  "%name% mashes their face into the feed and gets what they can past the gag, snortin', smeared to the ears.",
  "Feed squeezes in round the gag a mouthful at a time while %name% gulps and dribbles, determined not to go hungry.",
  "%name% laps the wet mash off the trough's edge round the gag, slow and sloppy, and comes up glazed in it.",
];
export const DRINK_GAG = [
  "%name% dunks their gagged mouth in the water and lets it run in round the gag, gulpin' and splutterin'.",
  "Water dribbles in past the gag a sip at a time while %name% kneels at the trough, half of it runnin' down their chest.",
  "%name% tips their head and lets the water pour in round the gag, swallowin' hard, soaked to the collar.",
  "%name% slurps noisily through the gag, chin drippin', and keeps at it till the thirst lets go.",
];
export const DRINK_FUNNEL = [
  "A farmhand tips a ladle of water into %name%'s funnel, and they swallow it down, eyes watering.",
  "%name% stands by the water while someone pours it down their funnel for them, a gurgle at a time.",
];
export const GROOM = [
  "%by% brushes %name% from neck to tail, slow and thorough, until they're glossy and sighing.",
  "%by% picks the straw out of %name%'s hair, one bit at a time, humming while they work.",
  "%by% works a soft brush in circles down %name%'s back, and %name% leans so hard into it they nearly fall over.",
  "%by% gives %name% a wipe down with a warm damp cloth, then a brush, then a pat. Show ready.",
  "%by% combs %name%'s hair out smooth and checks them over, ears to hooves.",
];
export const GROOM_KIND = {
  cow: ["%by% curries %name%'s flanks in big circles, raisin' the dust, then brushes them down smooth. %name% lows happily.",
        "%by% brushes %name% down like a show cow, then fluffs the tuft of their tail."],
  horse: ["%by% brushes %name%'s mane out and braids it neat, then works through their tail till it shines.",
          "%by% curries %name% down, picks out their hooves and finishes with a soft brush. %name% nickers."],
  dog: ["%by% brushes %name% all over, and %name% rolls onto their back for the belly. They get the belly.",
        "%by% gives %name% a good brushin' and a scratch behind the ears, and %name%'s whole back end wiggles."],
  cat: ["%by% strokes a soft brush down %name%'s back, and %name% purrs and pushes up into every stroke.",
        "%by% brushes %name% just the way they like it, and gets a slow blink for their trouble."],
  pig: ["%by% scrubs %name% down with a stiff brush and a bucket of warm water, and %name% grunts happily.",
        "%by% scratches %name% behind the ears with the brush, and %name% leans in and groans."],
  bunny: ["%by% brushes %name% out till they're fluffy as a dandelion, and their nose twitches in thanks."],
  sheep: ["%by% fluffs up %name%'s wool, picks out the burrs, and gives them a pat on the rump."],
  goat: ["%by% brushes %name% and gets nibbled for their trouble. %name% looks very pleased with themselves."],
  bull: ["%by% curries %name%'s broad back with a stiff brush, and %name% leans their whole weight into it with a low rumble."],
  fox: ["%by% brushes out %name%'s tail till it's bushy and glossy, and %name% can't help showin' it off after."],
  wolf: ["%by% works the brush through %name%'s thick ruff, and %name% goes still and sleepy-eyed under it."],
  deer: ["%by% brushes %name% down slow and gentle, and %name% stops tremblin' halfway through."],
  rat: ["%by% brushes %name%'s fur smooth and cleans behind their round little ears, and %name% chitters the whole time.",
        "%by% gives %name%'s long tail a wipe-down and a brush, and %name% grooms their own whiskers to match."],
  dragon: ["%by% oils %name%'s scales one by one till they shine like the hoard, and %name% rumbles like a purrin' furnace.",
           "%by% brushes out the webbing of %name%'s wings, gentle, and %name% stretches them out wide for more."],
  goblin: ["%by% scrubs the mud off %name% with a stiff brush, and %name% complains about every inch of it, grinnin'."],
};
// what they're wearin' gets seen to as well
export const GROOM_GEAR = {
  latex: ["%by% polishes %name%'s latex with a soft cloth until it shines like a wet apple.", "%by% wipes %name%'s rubber down and buffs it to a gleam, and %name% squeaks."],
  collar: ["%by% unbuckles %name%'s collar, brushes underneath it, and buckles it back, snug."],
  harness: ["%by% checks every strap of %name%'s harness, oils the leather and tightens it a hole."],
  hooves: ["%by% picks out %name%'s hooves one at a time and gives them a polish."],
  bell: ["%by% gives %name%'s bell a polish too, and it rings bright when they're done."],
  tail: ["%by% brushes %name%'s tail out long and smooth."],
};
export const GROOM_STOCK = [
  "%by% grooms %name% the way herd animals do: nose to neck, slow, with little nibbles at the itchy places.",
  "%by% leans into %name% and rubs their cheek along %name%'s shoulder, groomin' and claimin' all at once.",
  "%by% licks a stubborn patch of %name%'s hair flat, then nuzzles it for good measure.",
  "%name% and %by% take turns groomin' each other, and both end up drowsy and leanin' together.",
];
export const REMIND = {
  food: ["Your belly's rumblin', %name%. Find a trough before you start chewin' the fence.", "You're peckish, %name%. The feed won't eat itself.",
         "Somethin' smells good at the trough, %name%, and your belly's noticed."],
  water: ["Your lips are dry, %name%. Get yourself to the water.", "You're parched, %name%. A long drink would fix you right up.",
          "You've been workin' up a thirst, %name%. The water's waitin'."],
  groom: ["You're a tangle of straw and mud, %name%. Ask somebody for a brushin'.", "You're lookin' rumpled, %name%. A groom would perk you right up."],
};
export const DRUNK_LINES = {
  1: ["Warm milk settles in %name%'s belly, and they sigh, soft and pleased.", "%name% licks the last of the milk off their lips, warm all the way through.",
      "%name% goes a little pink and a lot content, a hand on their full belly."],
  2: ["%name% sways where they stand, eyes half shut, belly warm and full of milk.", "%name% yawns a big, jaw-crackin' yawn and leans on the nearest post.",
      "%name% has gone soft and slow and smiley, like a calf after a good feed."],
  3: ["%name% is milk-drunk and proud of it: wobbly, giggly, and lookin' for somebody to lean on.", "%name% hiccups, giggles, and sits down in the straw very suddenly, drunk on milk.",
      "%name% is so full of warm milk they've gone boneless, smilin' at nothin' with a dribble on their chin."],
};
export const ROMP = [
  ["%a% crouches low, eyes bright, and pounces on %b% with a happy noise.",
   "The two of them roll across the straw, kickin' up a cloud of it, laughin' and squirmin'.",
   "%w% comes out on top, straw in their hair, sittin' on %l% like a prize."],
  ["%a% sneaks up on %b% and nips their ear, then bolts.",
   "%b% gives chase round the hay bales, and the pair of them go crashin' through a pile of straw.",
   "%w% catches %l% by the ankle, and %l% goes down in a heap, laughin' too hard to get up."],
  ["%a% and %b% lock shoulders and push, digging in, neither willing to give an inch.",
   "They shove back and forth across the pen, snortin' and grinnin', until somebody's feet slip.",
   "%w% shoves %l% right into the hay pile and stands over them, very pleased."],
  ["%b% flops down in the straw and %a% flops right on top of them.",
   "There's a lot of wigglin' and tickling and squealin', and straw goes everywhere.",
   "%l% ends up pinned and tickled breathless, %w% grinnin' down at them."],
];
export const RPS_FORFEIT = [
  "%l% has to %lcall% for %w%, loud enough for the whole barn to hear.",
  "%l% carries %w%'s feed bucket for the rest of the day. Them's the rules.",
  "%w% gets a piggyback from %l% to the water trough and back.",
  "%l% has to let %w% pick the straw out of their hair, slow, in front of everybody.",
  "%l% gives %w% a nuzzle and a groom, and has to say thank you after.",
  "%w% gets %l%'s spot by the warm wall tonight.",
];
export const TURNOUT_CALL = [
  "🔔 There goes the turn-out bell! Pasture, y'all: ten minutes, and a ribbon for every one of you who comes out.",
  "🔔 Ding-a-ling! Evenin' turn-out. The grass is sweet and the sky's goin' pink. Ten minutes to get out there.",
];
export const TURNOUT_SCENE = [
  "🌾 %names% spill out into the pasture together, kick up their heels in the evenin' air, and settle down to graze side by side.",
  "🌾 The herd's out: %names%, noses in the grass, the last of the sun warm on their backs.",
  "🌾 %names% wander out to the pasture, and somebody starts a game of chase that nobody finishes. Then they all lie down in a heap.",
];
export const TURNOUT_ALONE = [
  "🌾 %names% has the pasture all to themselves tonight: a good roll in the grass, a long look at the sunset, and a ribbon.",
  "🌾 Just %names% out in the evenin' pasture, grazin' quiet under a pink sky. A ribbon for turnin' out.",
];
