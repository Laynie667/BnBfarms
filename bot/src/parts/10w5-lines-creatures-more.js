  /* WHAT'S IN THIS FILE (10w5-lines-creatures-more.js)
     More for the traps with somebody waitin' in them, second half: the drake, the naga, the kennel, the hive, the
     billy goat and the old sow. Same rules as 10w4: any body, or tagged for the one it's about. Nothin' here changes
     what a trap does. %n name · %c cock · %h hole · %ml how much · %x how many
  */
  (function(){
    const more = (pool, lines) => { if (Array.isArray(pool)) pool.push(...lines); };
    const A = ANTHRO_LINES;

    // ── the drake ──
    more(A.drake.beats[0], [
      "%n follows a glint of gold up the haybarn ladder. At the top there's a ring on a nail, and behind the ring, two slitted eyes and a smile.",
      "The air by the old smithy shimmers with heat. %n steps closer to warm their hands, and a long bronze tail curls round their legs from behind."]);
    more(A.drake.beats[1], [
      "He sniffs %n from crown to collarbone, a long curious breath, and his pupils go wide. \"Oh, you'll do nicely in the nest.\"",
      "\"Shiny,\" the drake murmurs, though %n isn't wearin' anything shiny. He means them. He gathers them up in one arm and climbs."]);
    more(A.drake.beats[2], [
      "He spreads %n out on a bed of stolen silk and buckles, and breathes warm on them until every muscle they've got goes soft.",
      "A claw hooks the last of %n's clothes and drops them on the hoard. He tilts his head. \"Better.\""]);
    more(A.drake.in[0], [
      "{v}He slides out of his sheath already slick, ridged root to tip, and works himself into %n's pussy a ridge at a time, each one poppin' through with a jolt.",
      "{nv}He slides out of his sheath already slick, ridged root to tip, and works himself up %n's ass a ridge at a time, slow, each one poppin' through with a jolt.",
      "He's hot as a hearthstone inside them. %n gasps at the first inch and goes on gaspin' all the way down."]);
    more(A.drake.in[1], [
      "{nv}{c}Every ridge on him drags over the spot inside %n's ass that makes their cock jump, and he's noticed, and he keeps doin' it.",
      "{v}%n's pussy clenches on every ridge as it goes by, and the heat of him spreads up through their belly like a sip of brandy.",
      "Little curls of smoke drift from his nostrils as he moves. He's slow, and sure, and he watches %n's face the whole time."]);
    more(A.drake.in[2], [
      "His rhythm changes, deeper, harder, and %n feels somethin' round and smooth start to travel up the length of him from the root.",
      "\"Now hold,\" he says, and holds them, and the first egg pushes against the inside of them, warm as a coal."]);
    more(A.drake.over[0], [
      "He curls round %n in the nest and ruts along their belly, ridged and hot, his tail pinnin' their legs, until he spills across their skin in a scaldin' rush."]);
    more(A.drake.end, [
      "%ml of drake seed, hot as tea, and then %x eggs settled in %n's %h one by one. He curls round them and won't let them leave till they've stopped tremblin'.",
      "He fills %n with %ml and %x eggs and tucks them into the hoard for a while, the most precious thing in it, his tail curled over their swollen belly."]);
    more(A.drake.endOver, [
      "He spends himself across %n in a scaldin' gush, %ml, and rubs it in with his claws so they'll carry his scent for days."]);

    // ── the naga ──
    more(A.naga.beats[0], [
      "%n steps over what they think is a coil of rope on the feed room floor. The rope moves. Then it's round their ankle, and then it's round their knee.",
      "Somethin' cool and smooth slides across the back of %n's neck in the dark of the loft, and a soft voice right by their ear says, \"Hello, warm thing.\""]);
    more(A.naga.beats[1], [
      "She lifts %n off the floor in a lazy spiral of coils, pattern sliding over pattern, until only their face and their rump are free. She kisses the face.",
      "\"Hold still,\" she says, though they couldn't do anything else. Her tongue flickers, tastin' the air round them. \"Mm. You're scared and you're wet. Lovely.\""]);
    more(A.naga.beats[2], [
      "The coils roll, and %n rolls with them, until their legs are parted and held, and two slick tapered heads slide out of a seam low on her belly.",
      "She squeezes once, slow, all over, and %n's breath goes out of them. In the gap before the next breath, she lines herself up."]);
    more(A.naga.in[0], [
      "{v}One of her cocks slides up %n's pussy and the other into their ass, both at once, smooth as river stones, and the coils tighten to hold them on.",
      "{nv}One of her cocks slides up %n's ass and the other noses at their mouth, and she takes both, front and back, and squeezes them into place.",
      "Cool and tapered, both of her go in at once, easy at the tip and thick at the root, and %n is stretched full before they know it."]);
    more(A.naga.in[1], [
      "{v}One in %n's pussy, one in their ass, slidin' in turn so they're never empty. The thin wall between them gets rubbed from both sides.",
      "{nv}One in %n's ass, one in their mouth, slidin' in turn, so every time one pulls back the other pushes deeper.",
      "A coil round %n's belly squeezes, and they can feel the shape of both of her move inside them."]);
    more(A.naga.in[2], [
      "She's in no hurry. She squeezes, lets go, squeezes, and %n is pumped on her like milk from a teat, slow and helpless.",
      "Her tongue flickers along %n's cheek while her coils ripple. \"Good,\" she hums. \"So warm. Keep still.\""]);
    more(A.naga.over[0], [
      "She tucks both of her between %n's squeezed thighs and lets her coils do the work, slow and tight, until she spills hot down their legs."]);
    more(A.naga.end, [
      "She cums with a long, contented hiss, %ml shared between two holes, and unwinds a loop at a time, settin' %n down leakin' on the feed sacks.",
      "%ml, front and back, and a parting squeeze. The naga drapes %n over a sack of oats and pours herself back up into the rafters, hummin'."]);
    more(A.naga.endOver, [
      "A shiver runs her whole length, and %ml spills over %n's thighs and belly. She tastes it off their skin with her tongue, then slides away into the dark."]);

    // ── the kennel ──
    more(A.kennel.beats[0], [
      "A dog whistle sounds from inside the big kennel, and %n's feet carry them in after it before they've thought. The door swings to.",
      "%n reaches into the kennel for a bowl to fill. A hand like a mitten closes round their wrist and draws them gently all the way in."]);
    more(A.kennel.beats[1], [
      "The mastiff-man takes his time sniffin' %n over, from the backs of their ears to the backs of their knees, his tail thumpin' slow against the wall.",
      "He's huge and patient and smells of straw and dog. \"New pup,\" he rumbles, like he's pleased about it, and nudges them down with his nose."]);
    more(A.kennel.beats[2], [
      "He arranges %n the way he likes: chest down on the blankets, hips up, knees apart. When they move, he moves them back. He doesn't get cross. He just waits.",
      "\"Nobody's goin' anywhere,\" he says, and settles behind them like a hill settlin' into a valley."]);
    more(A.kennel.in[0], [
      "{v}He pushes into %n's pussy, red and slick and thick, and grinds the knot against them until their lips spread round it and it pops inside.",
      "{nv}He pushes into %n's ass, red and slick and thick, and grinds the knot against them, patient, until their ring gives and it pops inside.",
      "He ruts slow, then quicker, the knot swellin' against %n with every push, and on the twentieth or so it goes in, and %n is locked to him."]);
    more(A.kennel.in[1], [
      "The knot throbs inside %n, hot and fat, and every throb is another warm spurt. He tests it with a gentle tug. They're not goin' anywhere.",
      "%n tries to pull away, just to see, and the knot pulls back. The mastiff huffs a laugh into their hair. \"Told you. Stuck.\""]);
    more(A.kennel.in[2], [
      "When it finally slips loose he licks them clean, unhurried, and then he's in again, and the knot is pressin' again, and the lesson starts over.",
      "%n is gettin' better at it. The third knot goes in with only a gasp. He rumbles approval and rewards them with a long, thick spurt."]);
    more(A.kennel.over[0], [
      "He ruts between %n's thighs, knot pressin' against them from outside, until he spills on the blankets underneath and licks them clean."]);
    more(A.kennel.end, [
      "%ml of mastiff seed, knotted into %n's %h twice over. He noses them out of the kennel at last, stretched, drippin', and scratched behind the ears.",
      "The latch lifts, and %n crawls out into the yard with %ml in their %h and the shape of his knot still felt in every step."]);
    more(A.kennel.endOver, [
      "He spends himself across %n's back and thighs, %ml, and licks the worst of it off before nosin' the door open. They smell of kennel for the rest of the day."]);

    // ── the hive ──
    more(A.hive.beats[0], [
      "A fat golden drone bumbles round %n's head and settles on their shoulder. Another lands on the other. They're steerin', politely, toward the orchard wall.",
      "There's a warm buzz in the clover and a smell like baked honey. %n follows it round a hedge into a hall of wax."]);
    more(A.hive.beats[1], [
      "The queen leans down from her throne of comb and cups %n's cheek in one of her four hands. Her eyes are dark and enormous and kind. \"Little guest. Come.\"",
      "Her abdomen pulses slow behind her, gold and black and heavy. The drones bow. The queen smiles and opens two of her arms."]);
    more(A.hive.beats[2], [
      "She feeds %n from her mouth, a slow honey kiss, and the sweetness goes straight to their head. Their legs fold. The drones catch them.",
      "One taste of royal jelly and %n is warm and floaty and agreeable to absolutely everything."]);
    more(A.hive.in[0], [
      "{v}The tip of her tail curls under and her long slick ovipositor finds %n's pussy and slides home, deep, deeper, and settles.",
      "{nv}The tip of her tail curls under and her long slick ovipositor finds %n's ass and slides home, deep, deeper, and settles.",
      "Somethin' slender and honey-wet slides up into %n while the queen strokes their hair, and keeps sliding, gentle and certain."]);
    more(A.hive.in[1], [
      "The first egg slips down the length of her and into %n with a soft stretch and a little pop. %n sighs. The queen strokes their belly. \"One.\"",
      "Honey drips from her lips onto %n's tongue while the eggs come, one, two, three, each one a soft round weight settlin' inside."]);
    more(A.hive.in[2], [
      "The drones hum a low chord and the eggs come faster, a steady patient stream, and %n's belly rises under the queen's hands.",
      "%n drifts in a warm gold haze, honey-drunk, while egg after egg is laid in them and the whole hive sings."]);
    more(A.hive.over[0], [
      "The queen kisses %n till they're limp and glowin' and has her drones bathe them in warm honey, four hands strokin' them the whole while."]);
    more(A.hive.end, [
      "{t}%x eggs, capped in with wax. The royal jelly's at work too: %n's tits are full and tingly, and they'll run double tomorrow.",
      "{nt}%x eggs, capped in with wax. The royal jelly's at work too: %n's chest has gone tight and tender, nipples puffed up and dribblin'.",
      "The queen seals %x eggs into %n's %h and kisses their forehead, and the drones fly them home, honey-sticky and drowsy, cradlin' their belly."]);
    more(A.hive.endOver, [
      "The drones carry %n back to the orchard and leave them in the clover, sticky from hair to heels and humming to themselves."]);

    // ── the billy goat ──
    more(A.goat.beats[0], [
      "%n bends to pick an apple out of the grass by the goat pen. The apple was bait. Somethin' rams them in the backside and they sprawl.",
      "There's a bleat behind %n, a snicker, and then a horn hooked through their belt loop pullin' them backwards."]);
    more(A.goat.beats[1], [
      "The billy grins down at %n with his yellow slot eyes and runs his tongue over his teeth. \"Lookit what wandered into my yard.\"",
      "He's rank and wiry and very proud of himself, and he plants his hooves in front of %n's face. \"Well, go on then. Say hello.\""]);
    more(A.goat.beats[2], [
      "He grabs %n's hair in both fists and steers their face where he wants it. It's already drippin' on their chin.",
      "\"Wide,\" he says, and pries their jaw open with a thumb like he's checkin' a horse's teeth."]);
    more(A.goat.in[0], [
      "He's thin and quick and he's in %n's mouth before they can say a word, humpin' their face with little bleats, beard in their eyes.",
      "He fucks %n's mouth like a dog humps a leg, fast and mindless and pleased with himself, rank musk fillin' every breath."]);
    more(A.goat.in[1], [
      "It slides right down %n's throat, thin as it is, and he holds it there till they gag, laughs, and does it again.",
      "Spit runs down %n's chin and onto his hooves. He doesn't care. He bleats louder."]);
    more(A.goat.in[2], [
      "\"Good nanny, good nanny,\" he chants, every jab punctuated, his tail wagging like mad.",
      "He goes faster and faster, bleatin' and wheezin', till %n's lips are numb and their eyes are streamin'."]);
    more(A.goat.over[0], [
      "He rubs off against %n's cheeks and lips without ever lettin' them take him in, bleatin', and paints their face before he struts off."]);
    more(A.goat.end, [
      "He shoves in and empties himself down %n's throat in three quick squirts, %ml, then licks their face and prances off, very pleased.",
      "%ml of hot thin goat seed straight down %n's throat. He pats their head, tells them they did fine, and trots away bleatin' about it."]);
    more(A.goat.endOver, [
      "He spatters %n's face and hair with %ml, laughs, and bounds off over the fence. They'll smell of buck for hours."]);

    // ── the old sow ──
    more(A.sow.beats[0], [
      "%n stops to scratch a piglet behind the ears. A pair of enormous soft arms scoops them up from behind. \"There's my sweet thing.\"",
      "\"Look how thin you are.\" The voice is warm as an oven and the arms round %n are warmer. Their feet leave the ground."]);
    more(A.sow.beats[1], [
      "The old sow settles into her chair with a creak and a sigh and tucks %n into her lap like she's done it a thousand times. She has.",
      "She's vast and pink and soft, smellin' of milk and clean straw, and she rocks %n in her arms and hums."]);
    more(A.sow.beats[2], [
      "\"Here we are.\" She guides %n's mouth to a fat warm teat, and it's drippin' before their lips close round it.",
      "A drop of milk lands on %n's lips. They lick it. That's all the invitation she needs."]);
    more(A.sow.in[0], [
      "Her milk is thick and sweet and it goes straight to %n's knees. While they're nursin', she lifts her apron with her free hand.",
      "%n drinks and drinks, and the warm heaviness in their belly makes them drowsy, and somethin' thick and blunt rises against them from under her apron."]);
    more(A.sow.in[1], [
      "{v}She settles %n down on her cock, slow, and it stretches their pussy round it like a ring on a thick finger. She rocks. Milk and cock, in time.",
      "{nv}She settles %n down on her cock, slow, and it stretches their ass round it like a ring on a thick finger. She rocks. Milk and cock, in time.",
      "She rocks the chair, and every rock pushes her a little deeper into %n, and %n suckles harder without meanin' to."]);
    more(A.sow.in[2], [
      "\"That's it, love.\" She lifts and lowers %n by the hips, patient as a churn, and keeps their mouth full of teat the whole time.",
      "The chair creaks, the milk flows, and %n's whole world is warm softness at both ends."]);
    more(A.sow.over[0], [
      "She lets %n nurse till they're drowsy, rubbin' herself slow against their thigh under her apron, and grunts happily when she spills."]);
    more(A.sow.end, [
      "She cums with a soft happy grunt, %ml deep in %n's %h, and lets them nurse through it. Then she wipes their chin and lays them down in the straw.",
      "%ml of sow seed in %n's %h and a belly full of her milk on top. She pats them, holds them a last minute, and sets them down. \"Come back hungry.\""]);
    more(A.sow.endOver, [
      "She finishes against %n's thigh with a contented grunt, wipes their chin with her apron, and sets them on their feet, milk-drunk and swayin'."]);
  })();
