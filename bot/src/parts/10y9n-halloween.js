  /* WHAT'S IN THIS FILE (10y9n-halloween.js)
     HALLOWEEN WEEK on the farm (Laynie, Oct 27: "halloween pack, but alot more, full of tricks and treats"). Oct 24 to
     Nov 1 by the bot's clock; ?seasons start halloween runs it any other time. While it's on (10y9m-seasons.js) a third of
     what the plain trap tiles spring is from this pack, a tile named trap-halloween springs nothin' else, the werewolf,
     the corn maze, the scarecrow and the lantern come round more, and the farm girl dresses up.
     This file: the season, and the ten traps with somebody waitin' in them (10u3-anthro-traps.js runs those):
       headless     the headless horseman at the covered bridge (his horse stays out of it: it's only how he gets about)
       vampire      the vampire countess in the cellar, who drinks your milk if you've got it, and what's under her gown
       hellhounds   a pack of hellhounds by the burnt mill: two-legged, ember-eyed, and their knots run hot
       demon        the demon in the root cellar: a bargain, a ridged cock, and little horns for half an hour after
       spider       the spider queen in the hayloft: webbed up, silk-tied, and a clutch of eggs
       ghost        the ghost in the old milkin' parlour: cold hands, and a glowin' mess where it passed through
       revel        the Samhain fire: masked revellers, the dance round the bonfire, antlers to wear after
       hayride      the haunted hayride: masked ghouls jump the wagon in the dark woods
       pumpkinpatch stuck in the giant pumpkin to the waist, and the patch's pickers help themselves
       bobbing      apple bobbin', hands tied behind, and somebody behind them takes their chance
     The ones with nobody waitin' in them, and trick-or-treatin', are in 10y9n2-halloween-2.js.
     New messes for the Companion to draw: pumpkin guts, caramel, ghostly ecto, cider, the witch's purple brew.
     In the lines: %n their name · %c the cock · %h the hole · %ml how much · %x how many eggs
  */
  Object.assign(MESS, { pumpkin: "#E07A1F", caramel: "#B8702A", ecto: "#7FEAD0", cider: "#D9902E", brew: "#7A3FB0" });
  season("halloween", {
    label: "Halloween week", icon: "🎃", tot: true,
    alias: ["hallowe", "hallows", "allhallows", "samhain", "spooky", "halloweek", "hallowseve", "trickortreat"],
    on: (dt) => { const d = md(dt); return d >= 1024 && d <= 1101; },
    dates: () => "Oct 24 – Nov 1",
    blurb: "tricks, treats, and things that only come out this one week",
    why: ["It's Halloween on the farm, and somethin' was waitin' for you.", "Trick or treat, sugar. This one's a trick.",
          "The veil's thin this week, and somethin' came through it.", "Somethin' that only comes out at Halloween found you."],
    start: ["Halloween week's come to the farm. The pumpkins are lit, the corn's whisperin', and there are things in the barns that weren't there yesterday. Watch your step, sugar, and knock on my door for a treat.",
            "The veil's thin this week, sugar. Somethin's come up out of the root cellar, somethin's ridin' the road at midnight, and I've got a bowl of candy by my door. Trick or treat.",
            "It's Halloween on the farm! Jack-o'-lanterns on every post, cobwebs in the hayloft, and a whole crop of traps that only come out this one week."],
    end: ["Halloween's over on the farm for another year. The pumpkins go to the pigs, the ghosts go back to sleep, and I eat the last of the candy myself.",
          "The last jack-o'-lantern gutters out. Whatever came up for Halloween has gone back down, sugar. Till next year."],
    also: ["werewolf", "maze", "scarecrow", "lantern"],
    // the farm girl's costume: a witch's hat if the game has one (only that, never a stand-in), and black cat ears and a tail
    costume: [
      { slot: "hat", name: "Witch's Hat", items: ["WitchHat1", "WitchHat2", "WitchHat"], color: "#1C1424", desc: "A tall black witch's hat with a crooked tip and an orange ribbon round the brim." },
      { slot: "ears", name: "Black Cat Ears", items: ["KittenEars2"], color: "#1A1A1A", desc: "Little black cat ears, for the witch's familiar she's pretendin' to be whenever she isn't pretendin' to be the witch." },
      { slot: "tail", name: "Black Cat Tail", items: ["KittenTailStrap1"], color: "#1A1A1A", desc: "A long black cat's tail that swishes when she walks." },
    ],
  });
  for (const [k, places] of Object.entries({ werewolf: ["wildlife", "pasture"], maze: ["pasture"], scarecrow: ["pasture", "stockade"], lantern: ["wildlife", "cabin"] }))
    if (!SEASON_PLACES[k]) SEASON_PLACES[k] = places;

  // ── the horseman ──
  seasonTrap("halloween", "headless", {
    icon: "🎃", what: "the headless horseman at the covered bridge, and his pumpkin grinnin' while he has you", limit: /\b(horror|fear|scare|monster|headless)/i,
    stud: { sire: -60, name: "the headless horseman", type: "human", loads: 2, ml: 260, hold: 7, hole: "vulva", bonus: 1.5, where: "the covered bridge", person: true },
    lines: {
      beats: [
        ["Hoofbeats on the road at midnight, gettin' louder, and %n turns to see a rider with no head comin' out of the fog, a jack-o'-lantern blazin' in his fist.",
         "%n takes the road past the covered bridge after dark, and the boards start to drum: hooves, fast, and a laugh that comes from nowhere at all, because the rider hasn't got a mouth.",
         "The fog's thick by the old bridge, and out of it comes the Headless Horseman, cloak flappin', a carved pumpkin under one arm and a grin of fire in it."],
        ["He reins in beside %n, swings down from the saddle and leaves his horse croppin' the verge. Then he scoops %n up with one arm like a sack of meal and carries them into the bridge.",
         "%n runs. He's down off his horse and on them in three long strides, and he tucks them under his arm and carries them into the dark of the covered bridge, kickin'.",
         "He sets the pumpkin on the bridge rail, where its flame can watch, and takes %n by the waist. There's no face to read. His hands say plenty."],
        ["He bends %n over the bridge rail and strips them by feel, slow, buttons and laces, his gloves learnin' every inch the way a blind man reads a face.",
         "{c}He can't see %n's cock, so he finds it with his hand, and holds it, and the pumpkin on the rail seems to grin wider.",
         "{v}He can't kiss %n, so he uses his fingers instead, two of them, curlin' slow inside %n's pussy till they're shakin' against the rail.",
         "{t}His gloves close on %n's tits and squeeze, like he's weighin' a pair of fine pumpkins at the market, and he seems to like what he finds."],
      ],
      in: [
        ["He takes %n's %h from behind, one long push, and the boards of the bridge creak with every stroke while his lantern-head flickers on the rail.",
         "He lines himself up and sinks into %n's %h to the hilt. No face, no breath, no words: just a big cold body and a cock that knows exactly what it's for."],
        ["He rides %n the way he rides the road at midnight, hard and fast and slowin' down for nothin', and the pumpkin on the rail roars with flame when he finishes.",
         "Twice he fills %n, the second time with his glove over their mouth so the whole valley doesn't hear, and the jack-o'-lantern burns white-hot."],
      ],
      over: [["He doesn't take them. He ruts along the cleft of %n's ass and between their thighs, his cloak round the both of them, till he spills hot down the backs of their legs.",
              "He pins %n against the bridge's planks and grinds against them till he spills across their back, and the pumpkin laughs for him."]],
      end: ["The horseman sets %n down on the bridge, full of %ml of him, picks up his head, tips it like a hat, and rides off into the fog.",
            "%n's left sprawled on the bridge boards with %ml drippin' out of their %h, and the hoofbeats fade off toward the graveyard.",
            "He leaves %n his pumpkin, still burnin', and %ml of himself in their %h. The pumpkin bursts all over them when they try to lift it."],
      endOver: ["The horseman leaves %n on the bridge painted with %ml, and the last they see of him is the flame of his head goin' off down the road.",
                "%n wipes %ml of the horseman off their thighs as the hoofbeats fade. The pumpkin on the rail winks out."],
    },
    scene: [["The pumpkin on the rail laughs, a hollow, wooden laugh, every time %n gasps.",
             "His horse whickers outside the bridge, bored, and goes back to the grass. Nobody's watchin' but the pumpkin.",
             "Fog rolls in through the gaps in the bridge boards and curls cold round %n's ankles while he works.",
             "A gust blows his cloak over them both, and for a moment it's all dark and warm and him."],
            ["{c}His glove wraps round %n's cock and strokes in time, slow and certain, and he won't let go till he's done.",
             "{v}His thumb finds %n's clit and circles it, round and round, while the rest of him keeps the pace.",
             "{t}He holds one of %n's tits in each glove and uses them for handles.",
             "He holds %n by the back of the neck, gentle, and the whole bridge shakes with how hard he's goin'."]],
    tender: ["He's gentler than a man with no head has any right to be, and he lays his cloak down on the boards first.", "He keeps one arm round %n's middle the whole time, so the rail never bites.",
             "When it's done he tucks %n's hair behind their ear, the way you would if you could see it."],
    filthy: ["He uses %n like a sack he stole off a cart: bent over the rail, legs kicked wide, the pumpkin grinnin' at every slap.", "%n's moanin' so loud the whole valley can hear the horseman breakin' in his new ride.",
             "%n's stuffed and drippin' on the bridge boards, and he's not slowin' down for any of it."],
    mess: ["pumpkin", ["chest", "tummy"]],
    gear: [{ when: "hold", slot: "ropeArms", label: "Horseman's Rope", items: ["HempRope"], color: "#1C1C1C", desc: "A loop of the horseman's black rope round their wrists, tied off to the bridge rail." }],
    depth: ["held", "breed"], tw: ["night", "alone", "breed"], places: ["pasture", "wildlife"], sound: "wood", tags: ["monsters"],
  });

  // ── the countess ──
  seasonTrap("halloween", "vampire", {
    icon: "🧛", what: "the vampire countess in the cellar, who'd rather drink your milk than your blood, and what's under her gown", limit: /\b(blood|bit(e|ing)|vampir|fang|futa)/i,
    stud: { sire: -61, name: "the vampire countess", type: "human", loads: 2, ml: 220, hold: 7, hole: "vulva", bonus: 1.3, where: "the countess's cellar", person: true,
            after(mn){
              // she drinks what they've got (milk, if they make it), and leaves her mark
              const p = prodOf(mn), got = makesMilk(mn) && p.milk > 20 ? drainMilk(mn, p.milk*0.5) : 0;
              if (got > 0) later(() => emote("🧛 "+tFill(pickFor(mn, "trap:vampire:drank", VAMPIRE_DRANK), mn, { ml: ml(got) }), mn), 2500);
              later(() => bodyMark(mn, { write: { line: "BITTEN", area: "collar" } }), 4000);
              face(mn, "trance", 90);
            } },
    lines: {
      beats: [
        ["%n goes down the cellar steps for a jar of preserves, and the candles light themselves one by one, all the way down to a long black coffin with its lid already open.",
         "There's a lady in the cellar who wasn't there yesterday: tall, pale as cream, in a red gown that pools on the flagstones, and she smiles at %n with a little too much tooth.",
         "A bat flutters in through the barn door, round %n's head twice, and when %n turns round it's a woman in a high-collared gown, and she's already holdin' their wrist."],
        ["\"What a warm, sweet little thing you are,\" the countess purrs, and her eyes go red, and %n can't look anywhere else. Then her fangs slide into the side of their neck, two cold stings and then warmth, and she drinks.",
         "She tips %n's chin up with one cold finger, and the cellar goes soft at the edges, and %n's knees stop workin'. She bites. It doesn't hurt. It's the best thing that's happened to them all week.",
         "{t}She opens %n's top and noses at their tits like a cat, and her fangs prick, just barely, either side of a nipple, and she drinks there instead, slow and greedy."],
        ["Then she lifts her skirts. What's under the countess's gown is pale and thick and already hard, and she smiles like she's showin' off a family heirloom.",
         "She lays %n back across the lid of her coffin and gathers up her red gown, and there's a cock under it as pale as the rest of her and nowhere near as cold.",
         "\"You'll stay for supper,\" she says, and lets her gown fall open at the front, and %n sees exactly what's for supper."],
      ],
      in: [
        ["She takes %n's %h slow, an inch at a time, with her mouth back on their neck, drinkin' and fuckin' to the same long rhythm.",
         "She sinks into %n's %h on the coffin lid, her cold hands on their hips, and every stroke she takes a sip, and every sip they cum a little harder."],
        ["She fills %n twice, with a few hundred years of practice in how she does it, and the second time she bites their wrist so they feel it all the way up their arm.",
         "When she cums her eyes flare red as coals, and she holds %n down and pumps them full of a load that's warm, at least, even if she isn't."],
      ],
      over: [["She doesn't take them. She ruts between %n's thighs, slow and elegant, and paints their belly when she's done, and licks a little of it off with a satisfied hum.",
              "She sits %n in her lap and strokes herself against them till she spills across their thighs, and then licks her fingers clean, one by one."]],
      end: ["The countess dabs her lips with a lace handkerchief and tucks %n into the straw outside, %ml of her in their %h and two little marks on their neck.",
            "The candles go out one by one. %n wakes at the top of the cellar steps, dizzy, with %ml drippin' from their %h and a taste of iron and roses in their mouth.",
            "\"Come back tomorrow night,\" she whispers, and %n stumbles out of the cellar with %ml in their %h and their knees not quite workin'."],
      endOver: ["%n wakes at the top of the cellar steps with %ml of the countess on their thighs and two little marks on their neck.",
                "The countess sends %n off with a kiss on the forehead, %ml of her painted across their belly, and a bite that tingles for an hour."],
    },
    scene: [["She talks the whole time, low, about the farm a hundred years ago and who she used to drink from, and her voice is like warm honey.",
             "A bat hangs from the cellar beam and watches. The countess tells it to look away. It doesn't.",
             "The coffin lid creaks under them. Up above, the farm goes on with its evenin', and nobody hears a thing.",
             "Every time her fangs leave %n's skin, they ache to have them back."],
            ["{t}She drinks from one of %n's tits and squeezes the other, and the sound of her swallowin' fills the cellar.",
             "{c}Her cold fingers wrap round %n's cock and stroke, and the cold makes it feel twice as hot.",
             "{v}She slides two chilly fingers into %n's pussy and curls them, and smiles with her fangs out when they clench.",
             "She licks the two little marks on %n's neck clean, slow, and it sends a shiver all the way to their toes."]],
    tender: ["Her bite never hurts. She makes sure of that, and asks before every one.", "She cradles %n's head in her hand the whole time, like somethin' precious.", "She hums an old slow tune against their neck while she drinks."],
    filthy: ["She drinks from %n like a juice box and fucks them like she's makin' up for two hundred years.", "%n's the countess's snack and her cocksleeve, and she tells them so, sweetly, in three languages.",
             "She leaves bite marks in places nobody but her will ever see, and %n begs for more of them."],
    depth: ["held", "breed", "tease"], tw: ["night", "alone", "milk"], places: ["cabin", "office", "stalls"], sound: "creak", tags: ["monsters"],
  });
  const VAMPIRE_DRANK = ["And she's not done: the countess drinks %ml of %n's milk on the way out, straight from the source, and licks her lips.",
                         "{t}Before she lets them go the countess has one more drink: %ml of %n's milk, sucked from each tit in turn, and she sighs like it's fine wine.",
                         "The countess takes her nightcap from %n's chest, %ml of warm milk, and dabs her mouth with lace after."];

  // ── the pack from the burnt mill ──
  seasonTrap("halloween", "hellhounds", {
    icon: "🔥", what: "a pack of hellhounds behind the burnt mill: two-legged, ember-eyed, and their knots run hot", limit: /\b(knot|gang|demon|monster|hellhound)/i,
    stud: { sire: -62, name: "the hellhounds", type: "canine", loads: 3, ml: 170, hold: 9, hole: "vulva", bonus: 1.7, where: "the burnt mill", litter: [3, 6],
            after(mn, v, hole){
              // one knot stays: a stopper the heat of it, for twenty minutes (real gear, for those who let the farm put it on them)
              if (hole === "vulva" || hole === "butt")
                gearOn(mn, hole === "butt" ? "plug" : "dildo", "Hellhound's Knot", "A fat, warm, knotted stopper the colour of a cooling coal, left in where the last hound tied them, to keep the heat in.", 20, "trap", { color: "#3A0A06" });
            } },
    lines: {
      beats: [
        ["Behind the burnt-out mill there's a glow in the ruins, like coals, and the coals are eyes, and the eyes stand up.",
         "%n smells smoke where there's no fire, and then the hellhounds come over the mill wall: three of them, black-furred, walkin' on two legs, sparks drippin' off their jaws.",
         "Somethin' howls in the millyard, and the howl has an echo of flame in it. By the time %n turns round, the pack's all around them."],
        ["The biggest one takes %n by the scruff and shoves them down on all fours in the cinders. The others sniff them over, and the air round them is hot as a forge.",
         "They circle %n, tails lashin', black fur smokin' at the tips, and one of them licks a long hot stripe up the back of %n's neck.",
         "A paw like a blacksmith's glove pins %n to the warm ash, and the pack argues in growls about who goes first."],
        ["The winner mounts %n, and he's hot all over, hot as a hearthstone, and his cock is hotter, glowin' faint red under the skin.",
         "%n can feel the heat of him before he touches them: a %c cock like a poker left in the fire, swellin' at the root.",
         "The first hound drapes his smokin' weight over %n's back, teeth restin' on their shoulder, and his knot's already swellin'."],
      ],
      in: [
        ["He drives into %n's %h and ruts like a forge bellows, and when the knot pops in it's like swallowin' a coal, and %n howls louder than any of them.",
         "He hilts in %n's %h and the heat floods in with him. The knot locks behind them, burnin'-hot and fat, and he pumps them full of somethin' that steams."],
        ["One by one each hound ties %n and fills them, and each knot's hotter than the last, till %n's belly is warm as a bread oven.",
         "When the first knot slips the second hound's already mountin', then the third, and %n stops countin' and just takes the heat."],
      ],
      over: [["They rut against %n one after another, over their back and between their thighs, and their seed steams where it lands on %n's skin.",
              "The pack marks %n all over, hot and sticky, and the cinders hiss under them."]],
      end: ["The hellhounds slink back into the ruins one by one, and %n crawls out of the millyard with %ml of hot hound seed knotted into their %h, belly glowin' like a coal.",
            "When the last knot slips, %n's left in the warm ash, stuffed with %ml, steam curlin' off the mess between their legs.",
            "The pack licks %n's face, all three of them, rough and hot, and leaves them by the mill wall with %ml churnin' warm in their %h."],
      endOver: ["The pack leaves %n by the mill wall, painted with %ml of steamin' hound seed and smellin' of brimstone.",
                "%n stumbles home with %ml of the hellhounds dryin' on their back and cinders in their hair."],
    },
    scene: [["The ash under %n is warm as a hearth, and every time they're shoved forward a little puff of sparks goes up.",
             "One of the waitin' hounds lies down by %n's head and pants, and its breath smells like a struck match.",
             "The mill's cracked bell sways in the wind and clanks, slow, like it's countin' the strokes.",
             "Their fur smokes where %n grabs it, but it doesn't burn. It's just hot, everywhere, all the time."],
            ["{c}One of the hounds noses under %n and licks their cock, one long hot drag of a tongue, and %n nearly cums on the spot.",
             "{v}A hot tongue finds %n's clit while they're bein' ridden, and the two heats together are almost too much.",
             "{t}A hound mouths at %n's swingin' tits, hot breath and careful teeth, and growls happily.",
             "The hound on top bites %n's scruff and holds it, and they go limp like a pup carried by its mother."]],
    tender: ["The hounds are warm, not burnin', and they lick %n's face between turns like they're checkin' on them.", "The biggest hound curls round %n after, and it's like bein' wrapped in a hot blanket.",
             "They take their turns gentle, and wait whenever %n needs a breath."],
    filthy: ["Three hellhounds use %n like a bitch in the ash, knot after knot, and %n's beggin' for the next one before the last slips out.", "%n's stuffed so full of steamin' hound cum it hisses when it drips on the cinders.",
             "They pass %n round the pack like a chew toy, and %n wags for it."],
    depth: ["held", "breed"], tw: ["night", "breed"], places: ["kennel", "wildlife"], sound: "chain", soundEnd: "chain", tags: ["monsters", "furry"],
  });

  // ── the root cellar ──
  seasonTrap("halloween", "demon", {
    icon: "😈", what: "the demon in the root cellar: a bargain you didn't mean to make, a ridged cock, and little horns for half an hour after", limit: /\b(demon|corrupt|monster|religio|horns?)\b/i,
    stud: { sire: -63, name: "the demon", type: "draconic", loads: 2, ml: 280, hold: 7, hole: "vulva", bonus: 1.6, where: "the root cellar",
            after(mn){
              if (!limitBlocks(mn, "heat")) startHeat(mn, BOTMN(), 1);
              try { corrupt(mn, 5, "the demon"); } catch(e){}
              gearOn(mn, "horns", "Demon's Horns", "Two little red horns, curlin' up through their hair where the demon kissed them. They'll go back where they came from in half an hour.", 30, "trap", { items: ["Horns2"], color: "#8A1020", only: true });
            } },
    lines: {
      beats: [
        ["There's a circle chalked on the root cellar floor that wasn't there this mornin', and %n steps right into the middle of it. Every candle in the cellar lights at once.",
         "%n finds an old book in the root cellar and reads a line out loud, just to see. The floor cracks, red light spills up, and a voice says, \"Well, hello.\"",
         "The smell of brimstone and cinnamon fills the cellar, and the demon steps out of the shadows like he's been waitin' all week: red-skinned, horned, tail swishin', grinnin'."],
        ["\"You called,\" the demon says, \"so you owe me.\" %n opens their mouth to argue, and he lays one long clawed finger on their lips, and they forget what they were goin' to say.",
         "\"A deal,\" he purrs, circlin' %n, his tail curlin' round their ankle. \"You stay in the circle, and I make you feel things you haven't got words for.\" %n's already in the circle.",
         "He reads out the terms, very fast, in a language with too many consonants, and then takes %n's hand and presses it to the parchment. It's signed."],
        ["His tail wraps round %n's thigh and pulls their legs apart, and what he's got is long and ridged and dark red, and it's hot enough to feel from a foot away.",
         "{c}His clawed hand closes round %n's cock and squeezes once, and it's hard so fast it aches. \"Part of the deal,\" he says.",
         "{v}His tail slips between %n's legs and rubs, slow, the spade tip findin' their clit, while he gets himself ready.",
         "He lays %n back in the chalk circle, and the lines glow under them, warm, like the floor's lickin' them."],
      ],
      in: [
        ["He takes %n's %h like it's his by contract, which it is: every ridge of that %c cock poppin' in one after another, and the circle flares red.",
         "He sinks into %n's %h a ridge at a time, slow, makin' sure they feel every single one, and the candles roar."],
        ["He fucks %n through every clause of the bargain, twice, and the second load comes hot enough to steam, and somethin' low in %n's belly glows.",
         "When he cums he laughs, deep and delighted, and holds %n's hips down on him till every drop of brimstone seed is where he wants it."],
      ],
      over: [["He ruts against %n inside the circle, his ridges draggin' over their skin, and spills across their belly in a hot, smokin' rope.",
              "He makes %n hold him between their thighs, and he fucks there till he spills, and the chalk drinks up what misses."]],
      end: ["The demon signs his name across %n's belly with a claw tip, light as a feather, and sinks back into the floor, leavin' %ml of himself in their %h. Two little horns are pushin' up through their hair.",
            "The circle goes dark. %n's alone in the cellar with %ml of demon in their %h, a taste of cinnamon in their mouth, and a pair of little horns that weren't there before.",
            "\"Pleasure doin' business,\" says the demon, and he's gone in a puff of red smoke, and %n's left sittin' in the circle with %ml churnin' hot in their %h."],
      endOver: ["The demon kisses %n on the forehead, leaves %ml of himself across their belly, and goes back where he came from. Two little horns are sproutin' where he kissed.",
                "%n crawls out of the circle sticky with %ml of demon and smellin' of brimstone, and the cellar door slams itself behind them."],
    },
    scene: [["The demon's tail never stops movin': round %n's ankle, up their thigh, round their wrist, like it's got its own ideas.",
             "He whispers the small print in %n's ear, and every clause is filthier than the last.",
             "The candles burn down to stubs in minutes, and new ones light themselves, and the cellar gets hotter.",
             "%n's skin tingles everywhere the chalk lines touch, like the circle's feelin' them up too."],
            ["{c}His tail coils round %n's cock and squeezes in time with his thrusts, and it doesn't let go.",
             "{v}The spade of his tail flicks at %n's clit, quick little licks, while the rest of him works them open.",
             "{t}His claws trace slow circles round %n's nipples, never quite touchin' the tips, till they're beggin' for it.",
             "He licks a long, hot stripe up %n's throat with a forked tongue, and they feel it in their knees."]],
    tender: ["The demon's a gentleman about it, in his way, and the bargain's got a clause for aftercare.", "He holds %n against his hot chest after and lets them listen to his heart, which beats backwards.",
             "He keeps askin', \"More?\" and waits for the nod every time."],
    filthy: ["%n sold their holes to a demon for a good fuck, and he collects on every one of them.", "He fucks %n on the chalk like a cheap whore he won at a crossroads, and %n thanks him for it.",
             "The ridges drag %n's insides till they're droolin', and the demon tells them they're the best soul he's bought all century."],
    depth: ["held", "breed", "tease"], tw: ["night", "corrupt", "breed"], places: ["cabin", "office", "goblin"], sound: "hiss", soundEnd: "hiss", tags: ["monsters"],
  });

  // ── the hayloft ──
  seasonTrap("halloween", "spider", {
    icon: "🕷️", what: "the spider queen in the hayloft: webbed up, silk-tied, and a clutch of her eggs", limit: /\b(spiders?|insects?|bugs?|eggs?|ovipos|webs?|clutch)\b/i,
    stud: { sire: -64, name: "the spider queen", type: "draconic", loads: 1, ml: 140, hold: 8, hole: "vulva", bonus: 0, where: "the spider queen's web", eggs: true },
    needs: mn => limitBlocks(mn, "eggs") ? "their limits rule it out" : null,
    lines: {
      beats: [
        ["There's a web across the hayloft ladder, big as a barn door and glitterin' with dew, and %n walks right into it before they see it.",
         "%n climbs into the hayloft and somethin' soft and sticky closes over their face: silk, strands of it, everywhere, and somethin' heavy moves up in the rafters.",
         "The hayloft's strung with webs this week, glitterin' in the lantern light, and the one in the corner twitches when %n comes up the ladder."],
        ["The spider queen comes down on a thread: a woman to the waist, pale and black-eyed and smilin', and below that, eight long glossy legs.",
         "Eight legs pick their way down the web, and above them is a woman, beautiful in a way that's all wrong, with a crown of little black eyes.",
         "She drops from the rafters and lands soft as a cat, eight legs and a lady's smile, and she looks %n over like supper."],
        ["She spins %n round and round in silk, quick as thought, till their arms are bound and their legs are spread and they're hung in her web like a fly.",
         "Her legs work fast, wrappin' %n in silk from the shoulders to the knees, leavin' bare the parts she's interested in.",
         "She hangs %n up in the middle of the web, spread wide, and every strand they tug on sends a shiver up to where she's sittin'."],
      ],
      in: [
        ["Her ovipositor slides out from under her, long and slick and ridged, and she guides it into %n's %h with a dainty little sigh.",
         "She settles over %n in the web, legs braced either side, and the thick ridged length of her ovipositor pushes into %n's %h, deeper and deeper."],
        ["Then the eggs come: one, a swell and a pop, then another, then too many to count, each one pressed deep into %n's %h, and she strokes their swellin' belly while she lays.",
         "She lays slow, an egg at a time, each one a fat round pressure passin' into %n's %h, and she hums to them, and %n's belly grows round and heavy in the silk."],
      ],
      over: [["She doesn't lay. She wraps %n tighter and strokes them all over with her soft front legs, slow and tickly, till they're shakin' in the web.",
              "She keeps %n hangin' in the web and teases them with silk-soft legs till they're beggin', then leaves them there a while to think about it."]],
      end: ["The spider queen bites the silk loose and lowers %n to the hayloft floor, belly round with %x eggs and %ml of slick drippin' from their %h.",
            "%n's cut down from the web at last, heavy with a clutch of %x, and the queen pats their belly with one long leg like she's proud of it.",
            "When she's done, %n's let down on a single thread, swingin', full of %x of her eggs, and she goes back up into the dark."],
      endOver: ["She cuts %n out of the web at last, silk stuck in their hair and every inch of them tinglin'.",
                "%n crawls out of the hayloft with silk all over them and a shiver they can't shake for an hour."],
    },
    scene: [["The web sways every time %n moves, and somethin' small and many-legged runs along the strands to see what's happenin'.",
             "She sings while she works, a thin high song with no words, and the silk hums with it.",
             "The lantern light catches every strand round %n, and they look like they're hung in a chandelier.",
             "Her black eyes, all eight of them, watch every twitch %n makes."],
            ["{t}Two of her soft front legs stroke %n's tits through the silk, round and round, tickly and slow.",
             "{c}She leaves a gap in the silk for %n's cock and teases it with the tip of one leg, just the tip, over and over.",
             "{v}She strokes between %n's legs with a leg as soft as a feather duster, and it's maddenin'.",
             "She kisses %n, upside down, from the strand above, and her lips taste of honey."]],
    tender: ["She's careful with every strand, and none of them pull too tight.", "She strokes %n's hair while she lays, and hums.", "She tucks them in silk after, like a blanket, and stays till they stop shakin'."],
    filthy: ["Hung up in her web like a fly, %n's just a warm hole for the queen to fill with eggs.", "She packs %n so full of eggs they bulge, and laughs at the noises they make.",
             "%n's drippin' slick and silk and moanin' for her to lay more, and she does."],
    gear: [{ when: "hold", slot: "device", label: "Spider's Web", items: ["Net"], color: "#E8E8E8", desc: "A web as big as a barn door, every strand sticky and strong as rope, and they're hung in the middle of it." },
           { when: "hold", slot: "ropeArms", label: "Spider Silk", items: ["HempRope"], color: "#F4F4F4", desc: "Wrists wound together in fine white silk, round and round, soft as cotton and impossible to pull apart." }],
    depth: ["held", "breed"], tw: ["night", "alone", "nest"], places: ["stalls", "cabin", "wildlife"], sound: "ropelong", soundEnd: "rope", tags: ["monsters", "pregnancy"],
  });

  // ── the old milkin' parlour ──
  seasonTrap("halloween", "ghost", {
    icon: "👻", what: "the ghost in the old milkin' parlour: cold hands, warm hands, and a glowin' mess where it passed through you", limit: /\b(ghosts?|cold|temperature|spirits?|haunt)/i,
    stud: { sire: -65, name: "the ghost of the old milkin' parlour", type: "human", loads: 2, ml: 160, hold: 7, hole: "vulva", bonus: 0.9, where: "the old milkin' parlour", person: true,
            after(mn){
              const p = prodOf(mn), got = makesMilk(mn) && p.milk > 20 ? drainMilk(mn, p.milk*0.5) : 0;
              if (got > 0) later(() => emote("👻 "+tFill(pickFor(mn, "trap:ghost:pail", GHOST_PAIL), mn, { ml: ml(got) }), mn), 2500);
            } },
    lines: {
      beats: [
        ["The old milkin' parlour hasn't been used in fifty years, but tonight the lamps are lit, and a stool scrapes back on its own as %n walks in.",
         "Somebody's whistlin' in the old milkin' parlour, an old tune, and when %n looks in, the farmhand doin' it is see-through and glowin' faint green.",
         "%n hears a pail clank in the empty parlour, and then a cold hand settles on the back of their neck, gentle, like it's been waitin' for them."],
        ["\"Late for milkin',\" says the ghost, a farmhand in old-fashioned overalls, and he steers %n into a stall with hands as cold as well water.",
         "The ghost walks right through the stall gate without openin' it, and takes %n by the hips, and his touch goes through their clothes like they aren't there.",
         "\"Been a long time since anybody came in here,\" the ghost sighs, and runs a cold finger down %n's spine, and their clothes slide off like he's shooed them."],
        ["His hands go right through %n's skin, a cold rush, and then they're solid again, cupped round all the warm parts.",
         "{t}He milks %n first, old-fashioned, by hand, with cold strippin' fingers, hummin' to them like he used to hum to the cows.",
         "{c}He milks %n's cock like a teat, slow pulls with a cold fist, and hums the old tune while he does it.",
         "He bends %n over the old stall rail, and he's cold everywhere he touches except the part that matters, which is warm and solid and very much there."],
      ],
      in: [
        ["He slides into %n's %h, cold as a creek at first and then warmer and warmer, like he's borrowin' the heat right out of them.",
         "He takes %n's %h with one long slow push, and every time he draws back a little of him passes right through them, a cold shiver from the inside."],
        ["He fills %n twice, and each load glows faint green inside them, so they can see it through their own skin.",
         "When he cums the lamps all flare, and %n feels it, cold and then hot, fillin' them, and the ghost sighs like he's waited fifty years for that."],
      ],
      over: [["He ruts between %n's thighs and passes through them on every stroke, cold and warm at once, till he spills glowin' across their belly.",
              "He presses against %n from behind and grinds, half solid and half not, and spills over their back in a glowin' rope."]],
      end: ["The lamps go out. %n's alone in the cold parlour with %ml of glowin' ghost seed in their %h, and the stool is back in its place.",
            "The ghost tips an old cap, says \"same time next year,\" and fades into the wall, leavin' %n full of %ml and shiverin'.",
            "%n's left in the straw with %ml of ghost in their %h, glowin' faint green whenever they move, and the whistlin' fadin' away."],
      endOver: ["The ghost fades, and %n's left in the dark parlour with %ml of glowin' ghostly mess all over them.",
                "%n stumbles out of the parlour shiverin' and glowin' wherever the ghost spilled %ml on them."],
    },
    scene: [["The old milk cans rattle on their shelf all on their own, keepin' time.",
             "Every time he passes through %n they feel it in their bones, cold and tickly, like a breath on the inside.",
             "The ghost hums the same old tune over and over, and %n's goin' to hear it in their dreams.",
             "An old calendar on the wall flips its pages by itself, back fifty years, and stays there."],
            ["{t}His cold thumbs stroke %n's nipples till they're hard as acorns.",
             "{c}A cold hand closes round %n's cock and strokes, and %n's breath fogs in the air.",
             "{v}A cold finger slides into %n's pussy, and then his whole hand's half inside them, a ghostly chill that makes them clench.",
             "He kisses the back of %n's neck, cold and soft, and their whole body breaks out in goosebumps."]],
    tender: ["He's a gentle old farmhand, and he talks %n through it the way he used to talk to the cows.", "His cold hands warm up the longer he holds %n, and he holds them a long time.",
             "He tells them they're the prettiest thing he's seen in fifty years, and he sounds like he means it."],
    filthy: ["The ghost uses %n like he's makin' up for every night he spent dead and hard in that parlour.", "%n's glowin' green from the inside out and moanin' like a haunted house.",
             "He fucks %n through the stall rail, half through it, and they cum so hard the lamps blow out."],
    mess: ["ecto", ["chest", "tummy", "face"]],
    depth: ["held", "tease", "breed"], tw: ["night", "alone"], places: ["stalls", "bench"], sound: "creak", tags: ["monsters"],
  });
  const GHOST_PAIL = ["Somewhere in the dark a pail rings: the ghost took %ml of %n's milk with him, and fades away with it sloshin'.",
                      "{t}When %n looks down, their tits are lighter by %ml and there's a glowin' pail by the door that wasn't there before.",
                      "The old parlour's pail fills itself with %ml of %n's milk, and the ghost carries it off through the wall."];

  // ── the Samhain fire ──
  seasonTrap("halloween", "revel", {
    icon: "🔥", what: "the Samhain fire: masked revellers, the dance round the bonfire, and antlers to wear after", limit: /\b(gang|public|crowd|fire|group)/i,
    stud: { sire: -66, name: "the masked revellers", type: "human", loads: 4, ml: 110, hold: 8, hole: "vulva", bonus: 1.4, where: "the Samhain fire", person: true },
    lines: {
      beats: [
        ["There's a bonfire in the far field, big as a barn, and folk in masks dancin' round it: stag masks, fox masks, faces painted like skulls. One of them takes %n's hand and pulls them into the ring.",
         "Drums in the dark and a fire on the hill, and %n follows the sound till they're in the ring of masked dancers and can't remember how they got there.",
         "It's Samhain, the old way, with the veil worn thin: a bonfire, a ring of masked revellers, cider passed hand to hand, and they make room for %n in the dance."],
        ["The dance goes round and round, faster and faster, and %n's passed from hand to hand and hip to hip, a kiss here and a squeeze there, till they're dizzy and laughin' and half undressed.",
         "Somebody in a stag mask pours cider over %n's head, and the whole ring cheers, and then the hands come from everywhere at once.",
         "They crown %n with antlers and dance them round the fire, and every time the drum booms somebody new gets a kiss."],
        ["When the drums slow, they lay %n down on a cloak by the fire, and the revellers take off their masks one at a time, and every one of them's grinnin'.",
         "The fire roars up and the ring closes in. A fox mask kneels between %n's legs, and the stag holds their hands above their head.",
         "Somebody calls out an old word for the turnin' of the year, and the whole ring answers it, and they lay %n down in the warm grass by the fire."],
      ],
      in: [
        ["They take turns with %n's %h in the firelight, one masked reveller after another, slow to the drum, and the ring cheers each one on.",
         "The stag goes first, sinkin' into %n's %h by the fire, and the fox is next, and the drums never stop."],
        ["By the time the fire burns low every reveller's had a turn, some of them twice, and %n's %h is warm and full and runnin' over.",
         "They fill %n one after another till the fire's down to embers, and then they cheer, and pour more cider."],
      ],
      over: [["The revellers don't take them. They dance round %n by the fire, strokin' themselves, and one by one they spill over %n's belly and chest while the drums boom.",
              "They hold %n in the middle of the ring and take turns grindin' on them, and paint them by firelight."]],
      end: ["The fire burns down to coals and the revellers drift off into the dark, and %n's left by the embers with antlers on their head and %ml of the Samhain dance in their %h.",
            "Dawn comes grey over the field. %n wakes by the cold fire, crowned with antlers, sticky with cider and %ml of the revellers, and the masks are gone.",
            "\"Good Samhain,\" somebody whispers, and kisses %n's forehead, and leaves them by the fire with %ml in their %h and the antlers still on."],
      endOver: ["The revellers go home in their masks, and %n's left by the embers wearin' antlers and %ml of the dance.",
                "%n wakes by the cold fire, antlers on their head, painted with %ml and smellin' of woodsmoke and cider."],
    },
    scene: [["Cider goes round in a horn cup, and every time it comes to %n somebody tips it for them, and most of it runs down their chin.",
             "The drummers drum faster, and the dancers whoop, and sparks fly up into the black sky.",
             "Somebody throws apples into the fire for the dead, and the sweet smell of them fills the whole field.",
             "A reveller in a crow mask leans close and tells %n their fortune, and every word of it is filthy."],
            ["{t}Two dancers kiss %n's tits at once, one each, laughin' into them.",
             "{c}A hand wraps round %n's cock in the dance and doesn't let go for three whole rounds.",
             "{v}A reveller's fingers slip into %n's pussy in the crush of the dance and stay there, keepin' time with the drum.",
             "Somebody in a hare mask kisses %n deep and slow, and passes them on to somebody else."]],
    tender: ["Every reveller kisses %n's hand before their turn, like it's a dance.", "They make sure %n's warm by the fire, and somebody wraps a shawl round their shoulders.",
             "Between turns somebody feeds %n roast apple and honey off their fingers."],
    filthy: ["%n's the Samhain offering, passed round the fire and bred by every mask in the ring.", "They fuck %n in the firelight like an offering, and %n's moanin' louder than the drums.",
             "By the end %n's drippin' cider and cum and grinnin' like a fool, and the ring wants another go."],
    mess: ["cider", ["face", "chest"]],
    gear: [{ when: "after", slot: "hat", label: "Samhain Antlers", items: ["ReindeerBand"], color: "#4A3424", mins: 30, desc: "A crown of antlers the revellers put on them by the fire, dark and polished and tied with red thread." }],
    depth: ["held", "watched", "breed"], tw: ["night", "crowd", "breed"], places: ["pasture", "stockade", "goblin"], sound: "wood", tags: ["public"],
  });

  // ── the hayride ──
  seasonTrap("halloween", "hayride", {
    icon: "🚜", what: "the haunted hayride: a wagon through the dark woods, and masked ghouls jump aboard", limit: /\b(gang|public|chase|scare|fear)/i,
    stud: { sire: -67, name: "the hayride ghouls", type: "human", loads: 3, ml: 130, hold: 7, hole: "vulva", bonus: 1.2, where: "the haunted hayride", person: true },
    lines: {
      beats: [
        ["The hayride's leavin' from the barn, a tractor pullin' a wagon piled high with straw, and %n climbs on just as it lurches off into the dark woods.",
         "%n hops on the haunted hayride for a laugh. The tractor chugs, the lanterns swing, and the wagon rolls into the trees, where it's very, very dark.",
         "The sign on the hayride says SCARY, and the farmhand drivin' the tractor winks at %n as they climb up into the straw."],
        ["Halfway through the woods, somethin' leaps out of the bushes and onto the wagon: a ghoul, grey-faced and grinnin', then another, then two more.",
         "The tractor stops dead. The lanterns go out. And then there are hands, a lot of hands, haulin' %n out of the straw.",
         "A scream from the trees, and the ghouls swarm the wagon, masks with hollow eyes and long rubber fingers, and every one of them is after %n."],
        ["They pin %n down in the straw and tear their clothes off, laughin' in their masks, and the wagon starts rollin' again, bumpin' over every root.",
         "Two ghouls hold %n's arms and two hold their legs, spread out on the hay, while the wagon bounces on through the dark.",
         "The ghouls pass %n round in the straw like a prize they've won, and every bump of the wagon throws them into somebody's lap."],
      ],
      in: [
        ["The first ghoul takes %n's %h right there in the straw, and the bumpin' wagon does half the work.",
         "One by one the ghouls take their turns in %n's %h, while the tractor chugs on through the woods like nothin's happenin'."],
        ["Every bump in the road drives them deeper, and by the end of the trail every ghoul's had his turn and %n's %h is full and leakin' into the hay.",
         "The ghouls finish in %n one after another, cheerin', and the last one does it just as the wagon rolls back into the lit barnyard."],
      ],
      over: [["The ghouls rut against %n in the straw, between their thighs and over their back, and every bump of the wagon helps.",
              "They hold %n down and take turns grindin' on them, and spill over them one by one as the wagon bounces home."]],
      end: ["The wagon rolls back into the barnyard. The ghouls are gone, back into the woods, and %n's sprawled in the straw with %ml of them in their %h. The driver says, \"Scary enough?\"",
            "The lanterns come back on as the wagon pulls in. %n climbs down shakin', hay in their hair and %ml drippin' from their %h, and the next riders stare.",
            "\"Same time tomorrow?\" says the driver, as %n tumbles off the wagon with %ml of ghoul runnin' down their thighs."],
      endOver: ["The wagon rolls back into the yard and %n climbs out, hay everywhere, painted with %ml of ghoul.",
                "The ghouls vanish into the trees, and %n rides the last stretch home on their own, sticky with %ml and laughin' shakily."],
    },
    scene: [["Somethin' howls out in the woods, and every ghoul on the wagon howls back.",
             "A scarecrow on a post waves as the wagon goes by. Probably the wind.",
             "The wagon hits a pothole and the whole pile of them bounces, and %n lands right where somebody wanted them.",
             "The driver turns the tractor's radio up, a crackly old song, and pretends not to hear a thing."],
            ["{t}A ghoul's rubber fingers squeeze %n's bouncin' tits, and he cackles in his mask.",
             "{c}A ghoul grabs %n's cock and won't let go, and every bump in the road strokes it for him.",
             "{v}Long rubber fingers slide into %n's pussy, and the next bump in the road does the rest.",
             "One of the ghouls takes his mask off to kiss %n, and he's just a farmhand underneath, grinnin'."]],
    tender: ["The ghouls are fussy about keepin' %n on the wagon, and somebody's always holdin' on to them.", "One of them balls up his jacket under %n's head so the straw doesn't scratch.",
             "They check %n's all right between jump scares, get a thumbs up, and carry on."],
    filthy: ["%n's the hayride's main attraction: a straw-covered fucktoy bouncin' through the woods.", "The ghouls use every hole %n's got, and the next wagon hears %n screamin' from the road.",
             "By the end %n's so full of ghoul cum it's soakin' through the hay."],
    depth: ["held", "watched", "breed"], tw: ["night", "crowd"], places: ["pasture", "stockade", "wildlife"], sound: "straw", tags: ["public"],
  });

  // ── the great pumpkin ──
  seasonTrap("halloween", "pumpkinpatch", {
    icon: "🎃", what: "stuck in the giant pumpkin to the waist, and the patch's pickers help themselves", limit: /\b(stuck|public|free ?use|gang|food|messy)/i,
    stud: { sire: ANON_STUD, name: "the pumpkin pickers", type: "human", loads: 3, ml: 110, hold: 8, hole: "vulva", bonus: 1.2, where: "the pumpkin patch", person: true },
    lines: {
      beats: [
        ["In the middle of the pumpkin patch there's a pumpkin as big as a hay wagon, hollowed out, with a hole in its side. %n leans in to look, and their foot slips on the vine.",
         "%n crawls into the giant pumpkin in the patch to see the carvin' inside, and the hole they crawled through shrinks round their waist like it's hungry.",
         "There's a sign on the great pumpkin that says WORLD'S BIGGEST, and a hole in its side, and %n can't resist stickin' their head in. That's as far as they get."],
        ["Head, arms and shoulders inside the pumpkin, hips and legs out in the patch, and stuck tight. It smells like pumpkin pie in here, and it's dark, and %n can hear people comin' down the rows.",
         "%n wriggles, and the pumpkin holds them like a fist. Inside it's all orange dark and sweet stringy guts, and outside, in the patch, somebody laughs.",
         "The rind's closed round %n's waist. They kick. Outside, a voice says, \"Well, look what grew in the patch this year.\""],
        ["Pickers wander up the rows with their wheelbarrows, and every one of them stops at the great pumpkin to have a look at what's growin' out of it.",
         "Somebody pats %n's ass like they're checkin' a pumpkin for ripeness, then somebody else does, and then somebody pulls their bottoms down.",
         "{c}A picker reaches between %n's kickin' legs and finds their cock, and gives it a squeeze like a gourd, and calls their friends over."],
      ],
      in: [
        ["The first picker takes %n's %h right there in the patch, and %n can't see a thing, just pumpkin and dark and the thump of hips against them.",
         "One after another, folk out in the patch take a turn in %n's %h, and inside the pumpkin %n moans into the sweet orange dark."],
        ["By the time the sun's low half the farm's picked the patch, and every one of them stopped at the great pumpkin to fill %n's %h.",
         "They fill %n one picker after another, and somebody keeps count on the rind with a carvin' knife, little tally marks in a row."],
      ],
      over: [["The pickers don't take them. They rub against %n's stuck-out ass and thighs and spill over them, one after another, while %n kicks in the pumpkin.",
              "They line up to use %n's thighs, and paint the backs of them, and somebody carves a smiley face in the rind for every one."]],
      end: ["Somebody finally cuts %n out with a carvin' knife, and they come out of the great pumpkin covered in guts and seeds, with %ml of the pickers in their %h.",
            "The pumpkin splits at last and %n tumbles out into the patch, orange and sticky to the shoulders, %ml runnin' out of their %h.",
            "The farmhands carve %n free at sunset, pumpkin guts in their hair and %ml of the patch's pickers drippin' down their legs."],
      endOver: ["They carve %n free at last, pumpkin to the shoulders and %ml of the pickers painted down their legs.",
                "%n bursts out of the great pumpkin covered in guts and seeds and %ml of the pickers."],
    },
    scene: [["Inside the pumpkin it's warm and sweet and dark, and the stringy guts tickle %n's face every time they're shoved forward.",
             "Somebody knocks on the rind like it's a door. \"Anybody home?\" Everybody outside laughs.",
             "A crow lands on top of the great pumpkin and caws, and a picker shoos it off so it won't peck the crop.",
             "Somebody takes a photo for the harvest board."],
            ["{c}Hands squeeze %n's cock through the patch, testin' it like a marrow.",
             "{v}Fingers slide into %n's pussy between pickers, checkin' if it's ripe. It is.",
             "Somebody spanks %n's ass, hard, and the whole pumpkin booms like a drum.",
             "A picker sits up on the rind, swingin' their legs and chattin', while their friend has a go."]],
    tender: ["The pickers are polite, and every one of them pats %n's hip to say thank you.", "Somebody pokes a hole in the rind so %n gets fresh air and a sip of cider.",
             "A farmhand keeps an eye on the queue and makes everyone wait their turn nicely."],
    filthy: ["%n's just a hole growin' out of a pumpkin, and the whole farm comes to pick it.", "They breed %n like the patch's prize crop, and tally every load on the rind.",
             "{v}%n's cunt is the most popular thing in the pumpkin patch, and there's a queue.", "%n's ass is the most popular thing in the pumpkin patch, and there's a queue."],
    mess: ["pumpkin", ["face", "chest", "tummy"]],
    gear: [{ when: "hold", slot: "device", label: "The Great Pumpkin", items: ["KabeshiriWall"], color: "#E07A1F", desc: "A pumpkin as big as a hay wagon, hollowed out, with a hole in the side they're stuck halfway through: head and arms in the pumpkin, the rest out in the patch." }],
    depth: ["held", "watched", "breed"], tw: ["crowd", "day"], places: ["pasture", "glory", "stockade", "pigsty"], sound: "wet", tags: ["public"],
  });

  // ── the apple barrel ──
  seasonTrap("halloween", "bobbing", {
    icon: "🍏", what: "apple bobbin': hands tied behind you, face in the barrel, and somebody behind you takes their chance", limit: /\b(breath|drown|water|wet|food|messy|public)/i,
    stud: { sire: ANON_STUD, name: "folk at the apple barrel", type: "human", loads: 2, ml: 130, hold: 6, hole: "vulva", bonus: 1.3, where: "the apple barrel", person: true },
    lines: {
      beats: [
        ["There's a barrel of cider and floatin' apples by the barn door, and a sign: BOB FOR A PRIZE. %n kneels down to try, and somebody kindly ties their hands behind them. House rules.",
         "%n's dared to the apple barrel and takes the dare, and the farmhands tie their hands behind their back with twine before they can change their mind.",
         "\"No hands,\" says the farmhand at the barrel, tyin' %n's wrists behind them, \"and no comin' up till you've got one.\""],
        ["Face first into the cold cider, chasin' an apple that won't hold still, ass up in the air for the whole yard to see.",
         "%n dunks, and the apples bob away from their teeth, and their rump's wigglin' in the air behind them, and folk are startin' to gather.",
         "Every time %n comes up gaspin' the crowd cheers and pushes them back down, and their hips stay stuck up high behind them."],
        ["Somebody behind %n tugs their bottoms down for a better view, and the crowd likes that even better.",
         "Hands settle on %n's hips while their face is in the barrel, and somebody says, \"Keep bobbin', sugar, I'll keep you steady.\"",
         "{c}Somebody behind reaches round and gives %n's cock a squeeze while they're under, and they come up sputterin'."],
      ],
      in: [
        ["While %n's face is in the cider, somebody slides into their %h from behind, and every dunk drives them deeper.",
         "%n goes under after an apple and comes up with somebody's cock buried in their %h, and the crowd roars."],
        ["They take turns, two of them, every time %n dunks, and fill their %h, and %n still hasn't got an apple.",
         "Somebody fills %n's %h just as they finally catch an apple in their teeth, and the whole yard cheers for both."],
      ],
      over: [["Folk take turns grindin' on %n's raised ass while they bob, and paint their back, and the crowd counts down every dunk.",
              "Somebody ruts between %n's thighs every time they go under, and spills over them just as they come up with an apple."]],
      end: ["%n finally comes up with an apple in their teeth, cider runnin' down their face and %ml runnin' out of their %h, and wins a ribbon on a string.",
            "They untie %n at last, soaked to the shoulders in cider, an apple in their mouth and %ml of the yard in their %h.",
            "%n staggers up from the barrel with no apple, a lot of cider, and %ml of the folks behind them drippin' down their legs."],
      endOver: ["%n comes up from the barrel with an apple, a face full of cider and %ml of the crowd across their back.",
                "They untie %n, drippin' cider, with %ml painted across their ass and a bitten apple in their teeth."],
    },
    scene: [["The cider's cold and sweet and fizzes up %n's nose, and the apples keep spinnin' away from their teeth.",
             "The crowd chants \"bob! bob! bob!\" and somebody keeps time slappin' %n's ass.",
             "An apple bumps %n's nose and spins off. So close.",
             "The barrel slops over with every dunk, and cider runs down %n's chest and drips off their chin."],
            ["{t}Cider drips off %n's swingin' tits, and somebody licks it off them between dunks.",
             "{c}Somebody keeps a hand round %n's cock the whole time, and squeezes every time they go under.",
             "{v}Fingers play with %n's pussy while they're under, and they come up gaspin' for more than air.",
             "Somebody holds %n's hair out of the cider for them, which is kind, and pushes their head back down, which isn't."]],
    tender: ["Somebody always lifts %n up for air the second they need it.", "The apples are small and soft, and the cider's not too cold.", "A farmhand keeps a towel ready and pats %n's face dry every time they come up."],
    filthy: ["%n's ass up and face in the cider, gettin' fucked like a fairground prize.", "The crowd cheers every load like it's a point scored, and %n's lost count.",
             "%n's drippin' cider from one end and cum from the other, and still hasn't got an apple."],
    mess: ["cider", ["face", "chest", "forehead"]],
    gear: [{ when: "hold", slot: "ropeArms", label: "Bobbin' Ties", items: ["HempRope"], color: "#8B5A2B", desc: "Their hands tied behind their back with a bit of twine, the way you bob for apples properly." }],
    depth: ["held", "watched", "breed"], tw: ["crowd", "day"], places: ["trough", "stockade", "pigsty"], sound: "wet", tags: ["public", "messy"],
  });
