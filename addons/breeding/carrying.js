/* WHAT'S IN THIS FILE (breeding/carrying.js)
   CARRYIN' HIS KIND (Nov 23, the suggestion box's #60; Laynie: "the pregnancy by species impregnated by, and pregnancy
   lines"). The bot now makes a pregnancy the SIRE's kind (bot 10y2c-sired.js): a cow bred by a dog carries pups. These
   are the lines along the way for what's in there: cravings (private), kicks and the stages (the room sees them), by
   the kind they're carryin', not the kind they are. index.js mixes them in with the farm's own pools, so a pup-heavy
   cow gets her pups' lines more often than not and the shared ones for the rest.
   The kinds are the bot's birthin' kinds: cow (calves), horse (foals), deer, pig, dog, den (wolf pups, fox kits), cat,
   bunny, goat, sheep, rat, goblin, dragon. A kind with nothing here (the little ones) gets the shared lines alone.
   %name% them · %litter% "the pups" / "the foal" · %young% one of them (pup, foal…) · %sire% whoever bred them
   (tags {v} {t} … as in _lib/connect.js: a line about a part they haven't got never reaches them)
*/
export const BY_KIND = {
  cow: {
    crave: ["You want a salt lick, %name%. A big one. You'd stand there and lick it till your tongue's raw.",
      "Sweet clover, %name%, a whole armful of it. %Litter% in you wants grazin'.",
      "You keep wanderin' to the feed trough without meanin' to, %name%. Eatin' for a calf takes a lot.",
      "{t}Your udder aches, %name%, heavy and hot. You want the milkin' stall, and you want it now."],
    kick: ["%name%'s belly bumps out low and hard: a calf's kick, all knees and hoof, and they let out a soft moo.",
      "Somethin' big shifts in %name%'s belly and they stop, breathin' slow, till %litter% settles.",
      "%name%'s belly jumps with a kick strong enough to rock them on their feet."],
    showing: ["%name%'s belly's hangin' low and wide, the way a cow carries. %sire%'s calf, comin' along.",
      "%name% has that slow, swayin' walk now, belly first. There's a calf in there and it shows."],
    heavy: ["%name%'s belly's broad as a barrel and hangs low enough to brush the hay. A big, healthy calf in there.",
      "{t}%name%'s udder has filled out to match their belly, tight and drippin', ready for the calf."],
    nesting: ["%name% paws at the straw in the calvin' pen and lies down, gets up, lies down, lowin' soft.",
      "%name%'s tail end's gone loose and soft and they keep lookin' back at their own flank. It's close."] },
  horse: {
    crave: ["Oats, %name%. Warm, sweet oats with molasses on them. You'd do tricks for a bucket.",
      "You want apples, %name%, crisp ones, and a sugar cube for after. Your foal's got a sweet tooth.",
      "You're restless, %name%. You want to run the pasture fence and you can't, not with %litter% this big."],
    kick: ["A long leg pushes out against %name%'s belly, all the way across, before it folds back in.",
      "%name% flinches as %litter% kicks up under their ribs, a sharp little hoof, and they blow out through their nose.",
      "%name%'s whole belly rolls as the foal turns, and they plant their feet and wait it out."],
    showing: ["%name%'s belly's high and deep, a mare's carry. %sire%'s foal's takin' up room.",
      "%name% has gone careful on their feet, belly out proud. The foal in there's a long one."],
    heavy: ["%name%'s belly's enormous, high and round. A foal takes its time, and it's takin' all of %name%.",
      "%name% shifts their weight hoof to hoof, belly heavy, flanks gone soft and hollow at the top."],
    nesting: ["%name% paces the foalin' stall, sweat darkenin' their flanks, lookin' back at their belly.",
      "%name% won't eat and won't settle. They walk, and stop, and walk. The foal's comin'."] },
  deer: {
    crave: ["You want tender leaves, %name%, the new ones off the top of the hedge.",
      "Acorns. Clover. Anything green and soft, %name%, and quiet to eat it in."],
    kick: ["A quick flutter of little hooves rolls across %name%'s belly and they hold very still.",
      "%name% startles at a kick inside them, wide-eyed, then lets out a shaky breath."],
    showing: ["%name%'s belly's rounded out neat and high, and they've gone skittish with it, ears to every sound.",
      "%name% keeps to the edges now, one hand on the small round of their belly. A fawn in there."],
    heavy: ["%name% moves slow and careful, belly full, and bolts at nothin' at all.",
      "%name%'s belly is round and tight and they keep lookin' to the long grass."],
    nesting: ["%name% has slipped off to the long grass and pressed out a hollow there, lyin' low in it.",
      "%name% keeps tryin' to hide, belly first, lookin' for somewhere soft and out of sight."] },
  pig: {
    crave: ["You could eat the whole slop trough, %name%. You might.",
      "Mud, %name%. You want to wallow in it, belly and all, cool and thick.",
      "Everything. You want to eat everything, %name%. A litter of piglets is hungry work.",
      "Apples, scraps, the bread the farm girl's eatin'. %Litter% wants it all, %name%."],
    kick: ["%name%'s belly squirms all over at once, a whole litter wrigglin', and they grunt and rub it.",
      "Lumps push out here, there, everywhere across %name%'s belly. Piglets, piled in and fightin' for room.",
      "%name% lets out a grunt as a half-dozen little bodies shift inside them all together."],
    showing: ["%name%'s belly's gone round and wide fast. %sire% filled them with a whole litter, and it shows.",
      "%name% is thickenin' out all over, belly first. A sow's carry."],
    heavy: ["%name%'s belly is huge and lumpy with piglets, and they waddle like it.",
      "{t}%name%'s teats have come in full down their front, ready for a whole row of mouths."],
    nesting: ["%name% drags straw into a great heap with their hands and burrows into it, gruntin'.",
      "%name% builds a nest and knocks it down and builds it again, grumblin'. The farrowin's close."] },
  dog: {
    crave: ["Meat, %name%. Red and rare. The pups in you want feedin' proper.",
      "You want a bone to gnaw, %name%. Somethin' to set your teeth in.",
      "You'd growl at anybody who came near your bowl right now, %name%, and you'd mean it.",
      "You want to be scratched behind the ears and told you're a good mama, %name%."],
    kick: ["%name%'s belly squirms with a whole litter of pups, wrigglin' over each other.",
      "Little lumps roll and push under %name%'s skin, pups tumblin', and %name% pants and rubs at them.",
      "%name% whines soft as the pups shove about inside, a dozen little paws at once."],
    showing: ["%name%'s belly's rounded and dropped already. Pups come quick, and %sire%'s are comin'.",
      "%name% has gone protective, belly out front, a low growl for anybody who crowds them."],
    heavy: ["%name%'s belly's full of pups and hangin' low, and they lie on their side to take the weight.",
      "{t}%name%'s teats have swollen pink down their front, a row of them, ready for the litter."],
    nesting: ["%name% digs at the straw in the whelpin' box, round and round, pantin' hard.",
      "%name% won't let anyone near their nest. A growl, a whine, and back to diggin'."] },
  den: {
    crave: ["Raw meat, %name%, warm off the bone. Somethin' in you wants to hunt.",
      "You want to howl at the moon, %name%, and you don't know why.",
      "Fresh game, %name%. Rabbit, maybe. Your litter's wild and it's hungry."],
    kick: ["%name%'s belly writhes with wild little bodies, pups that won't keep still.",
      "%name% growls low as the litter in them shoves and tumbles about."],
    showing: ["%name%'s belly's round and tight, and they've gone watchful and sharp-eyed with it.",
      "%name% keeps to the shadows now, belly first, wary of everybody."],
    heavy: ["%name%'s belly's heavy with a wild litter and they move like somethin' hunted, low and careful.",
      "%name% snaps at anybody who comes too close to that big belly."],
    nesting: ["%name% has dug a hollow under the barn floor and curled into it, pantin', and won't come out.",
      "%name% drags straw into a dark corner to make a den, and growls at the light."] },
  cat: {
    crave: ["Cream, %name%. A saucer of it. A bowl. The whole jug.",
      "Fish, %name%. You can smell it from across the farm and you want it.",
      "You want a sunbeam and a nap and somebody to stroke your belly, %name%, in that order."],
    kick: ["%name%'s belly ripples with kittens kneadin' and turnin' inside, and %name% purrs through it.",
      "Little feet push and knead against %name%'s belly from the inside, and they hum and stretch."],
    showing: ["%name%'s belly's gone round and soft, and they've taken to sleepin' in every warm spot on the farm.",
      "%name% grooms and preens and purrs, belly round with kittens."],
    heavy: ["%name% sprawls in a sunbeam with their big belly up, purrin' like an engine.",
      "{t}%name%'s nipples have gone pink and swollen down their front, ready for kittens."],
    nesting: ["%name% has vanished up into a quiet corner of the loft and won't come down. Kittens soon.",
      "%name% kneads a blanket into a nest, round and round, purrin' and pantin' together."] },
  bunny: {
    crave: ["Carrots, %name%. Greens. You can't stop nibblin', and you don't want to.",
      "You want clover and you want it in a pile you can lie in, %name%.",
      "You're nibblin' at everything, %name%: hay, your own fingers, somebody's sleeve."],
    kick: ["%name%'s belly twitches and jumps all over with a litter of kits, all at once.",
      "%name%'s belly flutters with quick little thumps and they squeak and hold it."],
    showing: ["%name%'s belly went from flat to round practically overnight. Bunnies don't waste time, and neither did %sire%.",
      "%name%'s belly's swellin' quick, round and soft, kits growin' fast."],
    heavy: ["%name% is round as a ball already, and it's barely been a day.",
      "%name%'s belly's full of kits and they flop over on their side with it, thumpin' a foot."],
    nesting: ["%name% is tuggin' tufts out of a fur blanket to line a nest, frantic about it.",
      "%name% digs and lines and fluffs their nest, nose twitchin'. The kits are comin'."] },
  goat: {
    crave: ["You'd chew on anything, %name%. Rope. A hem. The fence.",
      "You want somethin' bitter and green, %name%, weeds off the bank."],
    kick: ["%name%'s belly bumps with a sharp little kick, then another, a kid buttin' about.",
      "Somethin' in %name%'s belly headbutts them right under the ribs and they bleat."],
    showing: ["%name%'s belly's round and stubborn and out front, and so's %name%.",
      "%name% has gone contrary with it, belly round, bleatin' at anybody who tells them to rest."],
    heavy: ["%name%'s belly's wide with kids, and they climb on things anyway, bleatin' at being stopped.",
      "%name% is heavy and complainin' about it, loudly, to everybody."],
    nesting: ["%name% paws at the kiddin' pen straw and bleats, long and indignant.",
      "%name% lies down, gets up, lies down, and complains about all of it."] },
  sheep: {
    crave: ["Grass, %name%. Fresh, short, sweet grass. You'd graze all day.",
      "You want to be in the middle of the flock, %name%, warm and close."],
    kick: ["A soft little kick nudges out against %name%'s belly and they baa, startled.",
      "%name%'s belly shifts as a lamb turns, and they stand very still for it."],
    showing: ["%name%'s belly's round under all that softness, and they've gone even gentler.",
      "%name% keeps close to whoever's nearest, belly round with a lamb."],
    heavy: ["%name%'s belly's heavy and they lie down often, legs tucked, chewin' slow.",
      "%name% is round and placid and heavy with it, a lamb ridin' low."],
    nesting: ["%name% has gone off by themselves in the lambin' pen, pawin', a soft baa now and then.",
      "%name% stands with their head low and their belly lower. The lamb's comin'."] },
  rat: {
    crave: ["Cheese, %name%. Scraps. Whatever's in the bin. Your litter's starvin'.",
      "You want to shred somethin', %name%. Paper, straw, a sack. Tear it all up.",
      "You're hoardin' crumbs in your pockets, %name%, and you can't stop."],
    kick: ["%name%'s belly squirms all over with a dozen tiny bodies, never still.",
      "%name%'s belly twitches and rolls, crammed full of pinkies wrigglin' over each other."],
    showing: ["%name%'s belly's ballooned already, round and tight. A rat leaves a lot behind.",
      "%name% is swellin' fast, belly round and crammed full."],
    heavy: ["%name%'s belly's huge and lumpy, packed with pinkies, and they scurry anyway.",
      "{t}%name%'s nipples have come up in a long row down their belly, ready for a crowd."],
    nesting: ["%name% has shredded every scrap of paper and straw in reach into a nest and burrowed in.",
      "%name% is tearin' up a feed sack to line their nest, chitterin' to themselves."] },
  goblin: {
    crave: ["You want somethin' sour, %name%. Pickles. Green apples. A lemon, peel and all.",
      "Shiny things, %name%. You want to steal somethin' shiny and hide it in your nest.",
      "You want to bite somebody, %name%. Just a little. Your goblin brats are mean already."],
    kick: ["%name%'s belly lurches with mean little kicks, goblin brats fightin' in there.",
      "Somethin' pinches %name% from the inside, sharp, and they swear and slap their belly."],
    showing: ["%name%'s belly's round and lumpy and it bumps about on its own. Goblin brats.",
      "%name% has gone sly and snappish, belly out, cacklin' at nothin'."],
    heavy: ["%name%'s belly is huge and squirmin', full of brats that kick back when you poke it.",
      "%name% waddles about cussin', belly heavy, a goblin litter makin' trouble inside."],
    nesting: ["%name% is stealin' every blanket on the farm and heapin' them up in a corner to nest in.",
      "%name% has a hoard of stolen blankets and shiny junk, and they're buryin' themselves in it."] },
  dragon: {
    crave: ["Coal, %name%. Charcoal. You want to crunch it. The heat in your belly wants feedin'.",
      "Hot peppers, %name%, the hottest the farm's got. You eat them like sweets.",
      "Raw meat, and lots of it, %name%. A dragon's hatchlings eat."],
    kick: ["%name%'s belly glows warm as somethin' inside stretches, and a scrape of little claws runs across it.",
      "%name%'s belly is hot to the touch, and somethin' in there scratches and turns.",
      "A little puff of warmth rises off %name%'s belly as the hatchlings shift."],
    showing: ["%name%'s belly's round and warm as a hearthstone, and they've started hoardin' shiny things.",
      "%name% runs hot now, belly round, breath smokin' a little on the cold air."],
    heavy: ["%name%'s belly's heavy and hot and hard, and they guard it with a low, rumblin' growl.",
      "%name% curls round their big hot belly on a pile of shiny scraps and won't share any."],
    nesting: ["%name% scorches a hollow in the straw and curls into it, belly glowin'.",
      "%name% has heaped every shiny thing they own into a nest and lies coiled on it, rumblin'."] },
};
// the lines for what they're carryin': which "crave" | "kick" | "showing" | "heavy" | "nesting"; [] for none
export function kindLines(api, mn, which) {
  let k = null;
  try { const w = api && api.labour && typeof api.labour.kind === "function" ? api.labour.kind(mn) : null; k = w && w.kind; } catch (e) { k = null; }
  const set = k && BY_KIND[k];
  return (set && set[which]) || [];
}
// their kind's lines more often than not, the shared ones for the rest
export function mixKind(api, mn, which, shared) {
  const own = kindLines(api, mn, which);
  return own.length && Math.random() < 0.6 ? own : own.concat(shared || []);
}
