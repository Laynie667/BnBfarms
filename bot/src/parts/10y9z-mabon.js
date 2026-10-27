  /* WHAT'S IN THIS FILE (10y9z-mabon.js)
     MABON on the farm (Laynie, Oct 27: "soltice and equinox based packs with pagan/wiccan themes would be cool"): the
     autumn equinox, Sep 19 to 25 by the bot's clock, the harvest home, when the day and the night are even again and the
     fields are cut. The old harvest customs, kept the farm's way: the last sheaf (bound up, and every reaper has their
     turn for luck), the corn maiden woven out of straw, treadin' the grapes, the cider press, the one crowned at the
     harvest home, and the harvest supper with the feast laid out on you. The scarecrow, the bales, the corn maze, the
     plough, the windmill, the butter churn and the pie contest come round more, and the farm girl wears a crown of
     poppies and a harvest apron.
       lastsheaf     bound up in the last sheaf of the harvest with twine, and every reaper takes a turn for luck
       cornmaiden    woven into a corn dolly of straw, hung from the barn rafters, and set at the head of the harvest table
       grapestomp    tipped into the wine vat with the treaders, slippin' in the grapes till you're purple to the eyebrows
       ciderpress    laid in the cider press among the apples, pressed slow, and milked into the cider if you make milk
       harvestcrown  crowned at the harvest home, paraded on the last wagon, and given to the harvesters at the supper
       harvestsupper laid down the middle of the long table as the centrepiece, the feast heaped on you, and everyone eats off you
     New mess for the Companion to draw: grape juice. (Cider's Halloween's, honey and mash are the farm's own.)
     %n name · %c the cock · %h the hole · %ml how much
  */
  Object.assign(MESS, { grape: "#5B2245" });
  season("mabon", {
    label: "Mabon", icon: "🍂",
    alias: ["autumnequinox", "fallequinox", "harvesthome", "harvest", "harvestfestival", "autumn", "fall", "equinoxautumn"],
    on: (dt) => { const d = md(dt); return d >= 919 && d <= 925; },
    dates: () => "Sep 19 – 25, the autumn equinox",
    blurb: "the harvest home, the last sheaf, the grape vat and the long table",
    why: ["It's Mabon, the harvest home, and the farm's bringin' everythin' in. You too.", "The day and the night are even again, sugar, and the harvest wants its due.",
          "The fields are cut and the barns are full, and the farm's celebratin'.", "It's the autumn equinox, and the harvest customs want keepin'."],
    start: ["Mabon's come to the farm: the autumn equinox, the harvest home. The fields are cut, the last sheaf's standin' alone in the top field, the grape vat's full, and the long table's out in the big barn for the supper.",
            "It's the harvest home, sugar. The cider press is creakin', the treaders are rollin' up their skirts for the grapes, and somebody's weavin' the corn maiden out of the last of the straw.",
            "Mabon on the farm! The barns are full to the rafters, there's apples on every windowsill, the harvest wagon's dressed in ribbons, and there'll be a crownin' at the supper."],
    end: ["Mabon's over. The harvest's all in, the long table's cleared, the corn maiden's hangin' in the rafters for luck, and the nights are startin' to win.",
          "The harvest home's done for another year, sugar. The grape vat's scrubbed, the cider's in the barrels, and the farm's got a long winter's worth of food in and a lot of happy reapers."],
    also: ["scarecrow", "bale", "maze", "plow", "windmill", "buttermill", "pieeat"],
    // the farm girl's: a crown of poppies and a harvest apron (only those, never a stand-in)
    costume: [
      { slot: "hat", name: "Harvest Crown", items: ["PoppyCrown", "FlowerCrown"], desc: "A crown of red poppies and wheat ears, for the harvest home." },
      { slot: "cloak", name: "Harvest Apron", items: ["FrillyApron"], color: "#E8D6A0", desc: "A frilly wheat-coloured apron, for servin' at the harvest supper." },
    ],
  });
  for (const [k, places] of Object.entries({ scarecrow: ["pasture", "stockade"], bale: ["pasture"], maze: ["pasture"], plow: ["pasture"], windmill: ["pasture"], buttermill: ["trough", "stalls"], pieeat: ["trough", "pasture"] }))
    if (!SEASON_PLACES[k]) SEASON_PLACES[k] = places;

  // ── the last sheaf ──
  seasonTrap("mabon", "lastsheaf", {
    icon: "🌾", what: "the last sheaf: bound up in the last sheaf of the harvest with twine, and every reaper takes a turn for luck", limit: /\b(gang|bondage|tied|public|outdoor)/i,
    stud: { sire: -85, name: "the reapers", type: "human", loads: 4, ml: 130, hold: 9, hole: "vulva", bonus: 1.5, where: "the last sheaf", person: true },
    lines: {
      beats: [
        ["The whole top field's cut but for one last patch of wheat, standin' tall and gold in the middle of the stubble, and the reapers are sat round it with their sickles across their knees. Nobody cuts the last sheaf alone. They're waitin' for somebody. They're waitin' for %n.",
         "%n comes up to the top field with the reapers' lunch, and the reapers look at each other and grin, and the head reaper stands up. \"Last sheaf's not cut yet,\" he says. \"And it wants somebody in it.\"",
         "There's an old harvest custom on the farm: whoever brings the last of the harvest in gets bound up in it, for luck. %n didn't know that till the reapers told them, holdin' the twine."],
        ["They stand %n in the last patch of wheat and bind them up in it, the stalks gathered round them and tied with harvest twine at the chest and the hips and the knees, a sheaf with a person in it.",
         "The reapers cut the last wheat in one sweep together, as the custom says, and bind it round %n with twine, gold stalks from their shoulders to their knees, and lay them down on the stubble.",
         "Round and round goes the harvest twine, gatherin' the last wheat round %n till they're a sheaf with a face, arms bound in among the stalks, and the reapers step back to admire it."],
        ["\"Luck for the year,\" says the head reaper, \"from every reaper,\" and the reapers sort out the order by who cut the most, and the last sheaf's tipped forward over a bale.",
         "{c}The head reaper parts the stalks at %n's waist and finds %n's cock among the wheat, and strokes it, slow, while the others decide the order.",
         "{v}A reaper parts the wheat between %n's thighs and slides two fingers into their pussy, checks the crop, and calls it ripe.",
         "{t}The reapers part the wheat at %n's chest, and a rough hand squeezes their tits, one and then the other, for luck."],
      ],
      in: [
        ["The first reaper takes %n's %h through the gap in the stalks, slow and deep, and the wheat rustles round them both with every thrust.",
         "One after another the reapers kneel at the last sheaf and take %n's %h, every one of them deep and steady, the way you gather a field in."],
        ["Every reaper has their turn, and some have two, and the head reaper finishes last with a shout that carries all the way down to the farmhouse.",
         "Four reapers, four loads, and the last sheaf's luck is well and truly made, and the reapers lie back in the stubble laughin'."],
      ],
      over: [["They don't take them. They stand round the last sheaf and stroke themselves over it, one after another, and spill across the gold wheat and %n inside it."]],
      end: ["The reapers carry the last sheaf down to the farmhouse on their shoulders with %n still in it, %ml of them in %n's %h, and stand it by the door for luck, and only then cut the twine.",
            "%n's unbound from the last sheaf at sundown, wheat in their hair and %ml in their %h and twine marks round their middle, and the reapers say it's the luckiest harvest they've had.",
            "The reapers lay the last sheaf in the wagon with %n in it, %ml warm in their %h, and drive it down to the harvest home with the whole field singin'."],
      endOver: ["%n's unbound from the last sheaf with %ml of the reapers drippin' off the wheat and off them, and the reapers carry the sheaf down for luck.",
                "The reapers cut %n out of the last sheaf, spattered with %ml of them, and give them the first cup at the supper."],
    },
    scene: [["Chaff floats up gold in the low autumn sun every time the sheaf shifts.",
             "Rooks come down onto the stubble to pick at the fallen grain, and watch with their heads on one side.",
             "The reapers sing the harvest song, one line each, and it gets slower and breathier as it goes round.",
             "The wheat smells of sun and dust and bread, and it scratches, and %n can't do anythin' about it."],
            ["{t}A reaper's rough hand squeezes %n's tits through the wheat, and the stalks scratch their nipples stiff.",
             "{c}Somebody strokes %n's cock through the stalks while they wait their turn, and the wheat rustles in time.",
             "{v}A reaper's thumb finds %n's clit through the wheat and rubs, while the next one gets ready.",
             "A reaper ties a wheat ear in %n's hair and kisses them on the mouth for luck."]],
    tender: ["The reapers bind the wheat loose and soft, and pad the twine with a kerchief.", "Every reaper kisses %n before their turn, the old way, and thanks them after.",
             "The head reaper holds %n's bound hands through the wheat the whole time."],
    filthy: ["%n's bound up in the last sheaf and passed round every reaper in the field, and they're beggin' to be harvested again.", "%n's the farm's last sheaf, tipped over a bale and threshed by every reaper in turn.",
             "The reapers bring the harvest in through %n's holes, one load at a time, and %n's moanin' for the gleanin'."],
    gear: [{ when: "hold", slot: "arms", label: "Sheaf Twine", items: ["HempRope"], color: "#D9B860", desc: "Harvest twine, bindin' the last wheat round them at the chest and hips, arms bound in among the stalks." },
           { when: "hold", slot: "legs", label: "Sheaf Twine (legs)", items: ["HempRope"], color: "#D9B860", desc: "More harvest twine, round the wheat at their knees, so the sheaf holds its shape." }],
    depth: ["breed", "held", "watched"], tw: ["day", "breed", "crowd"], places: ["pasture"], sound: "rope", tags: ["restraint", "public"],
    writes: ["LAST SHEAF", "HARVESTED", "FOR LUCK", "GATHERED IN"],
  });

  // ── the corn maiden ──
  seasonTrap("mabon", "cornmaiden", {
    icon: "🌽", what: "the corn maiden: woven into a corn dolly of straw, hung from the barn rafters for luck, and set at the head of the harvest table", limit: /\b(bondage|suspen|hang|objectif|doll|tease|edg)/i, hold: 7, where: "the barn rafters",
    lines: {
      beats: [
        ["Every harvest the farm weaves a corn maiden out of the last straw and hangs her in the barn for luck, and this year the weaver's had an idea, and the idea's lookin' at %n.",
         "%n wanders into the big barn and finds the weaver sat in a heap of gold straw, plaitin', and she looks up and smiles. \"Oh good. I needed somethin' to weave round.\"",
         "There's a straw corn maiden half-woven on the barn floor, all plaits and twists and ribbons, and she's missin' her middle, and the weaver's holdin' out her hand to %n."],
        ["The weaver plaits the straw round %n, round their wrists and arms, round their waist and hips, round their thighs, tight gold plaits in the old patterns, till they're a corn dolly as tall as a farmhand.",
         "Plait over plait the straw goes on, arms first, woven down tight to %n's sides, then their legs, plaited together at the knees, and a straw bonnet on top with a red ribbon.",
         "The weaver works for an hour, humming, and every plait goes on snug and every twist holds, and at the end %n can't move anythin' but their eyes and their breath."],
        ["Then up into the rafters, hung on a rope from the big beam, turnin' slowly over the barn floor, the corn maiden for the year.",
         "{t}The weaver leaves %n's tits bare between the plaits, a gap in the straw on purpose, and gives each one a tweak before they're hoisted.",
         "{c}The weaver's left a gap in the straw at %n's hips, and %n's cock pokes out of the corn dolly, stiff, and she ties a little red bow on it.",
         "{v}There's a gap woven into the straw right between %n's thighs, on purpose, and the weaver strokes it as she ties off the last plait.",
         "Everybody who comes into the barn looks up at the corn maiden turnin' slowly in the rafters, and touches %n's toes for luck."],
        ["At supper time they lower %n down and set them at the head of the long table, and everybody who sits down gives the corn maiden a stroke for luck, and a pinch, and some of them more.",
         "The corn maiden's set at the head of the harvest table, propped up in her straw, and the farm comes in to eat, and every one of them touches %n for luck on the way past.",
         "All through supper the corn maiden sits at the head of the table, and all through supper hands keep findin' the gaps in the straw."],
      ],
      end: ["After supper the weaver unpicks %n out of the corn dolly a plait at a time, slow, and %n comes out of it straw-printed and achin' and flushed to the ears, and the empty corn maiden goes back up in the rafters for luck.",
            "%n's let out of the straw at the end of the night, pink with plait marks and right on the edge from every lucky touch, and the weaver gives them the red ribbon to keep.",
            "The weaver cuts %n out of the corn maiden at midnight, and they're straw-printed all over and so wound up they can't walk straight, and the whole farm's had its luck."],
    },
    after(mn){ arouse(mn, 50, 97); face(mn, "edged", 120); const p = prodOf(mn); if (p) p.deniedUntil = Math.max(p.deniedUntil || 0, Date.now() + 6*60000); return null; },
    scene: [["The straw creaks every time %n breathes, and smells of summer.",
             "The rope from the rafter turns slowly, and the barn turns slowly round %n, and the swallows fly in and out under them.",
             "Somebody's lit lanterns all along the long table, and the corn maiden's shadow is huge on the barn wall.",
             "The weaver keeps steppin' back to look at her work and sayin' it's her best yet."],
            ["{t}A farmhand tweaks %n's nipples through the gap in the straw for luck, and then once more for extra luck.",
             "{c}Somebody unties the red bow on %n's cock, strokes it, and ties the bow back on.",
             "{v}A finger slips through the gap in the straw between %n's thighs, for luck, and lingers.",
             "Somebody kisses the corn maiden on the lips for luck, and %n kisses back."]],
    tender: ["The weaver plaits the straw snug but never tight, and checks %n's fingers aren't goin' numb.", "Every touch for luck is gentle, and everybody says thank you to the corn maiden.",
             "The weaver sits by %n all through supper and feeds them bits off her plate."],
    filthy: ["%n's woven up in straw with every hole left open on purpose, and the whole harvest supper takes its luck.", "%n's the farm's corn dolly, hung up and played with by everybody who walks under them, and they're drippin' through the straw.",
             "Every lucky touch winds %n tighter, and the corn maiden's moanin' louder than the fiddler by the end of supper."],
    gear: [{ when: "hold", slot: "ropeArms", label: "Corn Dolly Plaits", items: ["HempRope"], color: "#E3C66D", desc: "Gold straw plaited tight round their arms in the old corn dolly patterns, so they hang like a corn maiden." },
           { when: "hold", slot: "legs", label: "Corn Dolly Plaits (legs)", items: ["HempRope"], color: "#E3C66D", desc: "Straw plaits round their legs, plaited together at the knees, a red ribbon at the ankle." }],
    depth: ["held", "tease", "watched"], tw: ["day", "crowd"], places: ["stalls", "stockade", "cabin"], sound: "rope", tags: ["restraint", "public"],
    writes: ["CORN MAIDEN", "FOR LUCK", "WOVEN", "HARVEST DOLL"],
  });

  // ── treadin' the grapes ──
  seasonTrap("mabon", "grapestomp", {
    icon: "🍇", what: "treadin' the grapes: tipped into the wine vat with the treaders, slippin' and slidin' in the grapes till you're purple to the eyebrows", limit: /\b(messy|wet|slip|food|public)/i, hold: 6, where: "the grape vat",
    lines: {
      beats: [
        ["The grapes are in from the old vine on the south wall, a whole vat of them, and the treaders are already in it up to their knees with their skirts tucked up, and they're wavin' %n over.",
         "%n leans over the grape vat to watch the treadin', and a pair of purple hands takes them by the wrists, and in they go, splash, into the grapes.",
         "There's a vat of grapes as big as a pond in the yard and three treaders in it laughin', and one of them climbs out, picks %n up, and climbs back in with them."],
        ["The grapes burst under %n's feet, cool and slippery, and they slip, and go down on their bum, and come up purple, and the treaders cheer.",
         "They tie %n's wrists to the rim of the vat with a purple ribbon so they can't climb out, and tread round them, and the grape juice sloshes up over %n's knees and thighs and higher.",
         "Squelch, squelch, the grapes go, and %n's slippin' about in the middle of the vat with the treaders, and every time they grab somebody to stay up they all go down together."],
        ["The treaders are slick and purple and everywhere, and they hold %n up in the juice and tread round them in a ring, singin', and their hands don't stay where hands should.",
         "{t}A treader slips in the grapes, grabs %n's tits to stay up, and doesn't let go once she's steady.",
         "{c}A treader's purple hand closes round %n's cock in the juice and strokes, slippery and slow, while the others tread round them.",
         "{v}A treader's slippery fingers slide between %n's legs in the juice, and stay, and slide in, and %n slips again, and it's not the grapes this time.",
         "Everybody's purple and slick and laughin', and in the vat there's no tellin' whose hand is whose."],
        ["They tread the grapes all afternoon, and %n with them, and the juice gets deeper, and the treaders get friendlier, and nobody's in any hurry to get out.",
         "Two treaders hold %n up between them and grind against them in the juice, slow and slippery, while the third treads round them singin' the treadin' song.",
         "The treaders rinse %n with buckets of juice, which doesn't rinse anythin', and pour it over their head, and lick it off their neck."],
      ],
      end: ["The grapes are trodden at last and the juice runs off into the barrels, and %n's helped out of the vat purple from head to toe, sticky, laughin', and very well trodden.",
            "%n climbs out of the grape vat at sundown, purple to the eyebrows and slick all over and grinnin', and the treaders give them the first cup of the juice.",
            "The treaders lift %n out of the vat and sit them on the rim to drip, and %n's purple and sticky and flushed under it, and smells like next year's wine."],
    },
    after(mn){ arouse(mn, 40, 92); face(mn, "afterglow", 90); return null; },
    scene: [["The juice smells sweet and sharp and green, and wasps hum round the vat and nobody minds them.",
             "Somebody plays the fiddle on the wall and the treaders tread in time, squelch, squelch.",
             "A grape skin's stuck on %n's nose, and nobody tells them for ages.",
             "The barrels by the vat fill slowly, purple, and the cellarman keeps checkin' them and smilin'."],
            ["{t}A treader cups %n's tits in her purple hands and squeezes the juice off them.",
             "{c}Somebody pours a jug of juice over %n's cock and licks it off, slow, and calls it tastin' the vintage.",
             "{v}A treader slides a slick hand up between %n's thighs and rubs, slow, while the juice sloshes round them.",
             "A treader kisses %n, and her mouth tastes of grapes, and they both slip and go under."]],
    tender: ["The treaders hold %n up so they never slip under, and laugh with them, never at them.", "The juice is cool and the sun's warm, and somebody keeps wipin' %n's eyes.",
             "The treaders give %n the softest corner of the vat and tread round them gently."],
    filthy: ["%n's slippin' and slidin' in a vat of grapes with three treaders' hands all over them, and they're grindin' on every one.", "%n's trodden like the grapes, purple and slick and squeezed, and they're moanin' for another pressin'.",
             "The treaders fuck %n against the side of the vat in the grape juice, and next year's wine's goin' to be very special."],
    mess: ["grape", ["chest", "tummy", "thighs", "face"]],
    gear: [{ when: "hold", slot: "arms", label: "Vintner's Ribbon", items: ["Ribbons"], color: "#5B2245", desc: "A purple ribbon round their wrists, tied to the rim of the grape vat so they can't climb out before the treadin's done." }],
    depth: ["mess", "watched"], tw: ["day", "crowd"], places: ["trough", "pasture", "stalls"], sound: "wet", tags: ["messy", "public"],
    writes: ["TRODDEN", "VINTAGE", "PURPLE", "NEXT YEAR'S WINE"],
  });

  // ── the cider press ──
  seasonTrap("mabon", "ciderpress", {
    icon: "🍎", what: "the cider press: laid in the press among the apples and pressed slow, and if you make milk it's milked into the cider", limit: /\b(milk|lactat|press|squeez|messy|bondage)/i, hold: 6, where: "the cider press",
    before(mn, v){ const p = prodOf(mn); v.milk = !!(makesMilk(mn) && p && p.milk > 40); },
    lines: {
      beats: (mn, v) => { const T = SEASON_LINES.ciderpress; return v.milk ? [T.come, T.lay, T.milk1, T.milk2] : [T.come, T.lay, T.press1, T.press2]; },
      come: ["The cider press is creakin' away in the old barn, a great oak frame with a screw as thick as a tree, and the apple pile's run low, and the cider man's lookin' at %n.",
             "%n follows the smell of crushed apples into the cider barn, and the cider man pats the bed of the press. \"Lie down here, sugar. Old recipe.\"",
             "There's a sign on the cider press: SWEETEST BATCH WINS A RIBBON. The cider man's been tryin' for that ribbon for years, and he's got an idea, and it's %n."],
      lay: ["They lay %n in the bed of the press among the apples, on a bed of straw and sweet crushed fruit, and buckle a strap over their wrists, and the cider man starts windin' the screw.",
            "In the press %n goes, apples all round them, apples under them, the smell so sweet it's dizzyin', and the board comes down slow, and stops just snug.",
            "The cider man lays %n in among the apples with a straw cloth over them, and winds the screw till the board comes down and holds them gentle and firm."],
      milk1: ["The board presses down snug, and the cider man reaches in and starts milkin' %n by hand, slow, into the trough where the apple juice runs, and the cider runs pale and creamy.",
              "{t}The cider man cups %n's tits through the slats and milks them, slow and steady, and the milk runs into the cider trough and swirls in with the apple juice.",
              "Squeeze and pull, the old way, and %n's milk runs down into the trough with the apple juice, and the cider man tastes it off his finger and his eyes go wide."],
      milk2: ["He winds the screw another turn, and milks another pail's worth, and another turn, and %n's pressed and milked and moanin' among the apples.",
              "{t}Both tits at once now, through the slats, and the cider runs creamier and sweeter with every squeeze, and the cider man's hummin'.",
              "Every turn of the screw presses %n a little snugger and every squeeze milks them a little emptier, and the trough's runnin' pale gold."],
      press1: ["The board presses down snug on %n and the apples round them, and the juice runs out of the bottom of the press, sweet and golden, and %n's lyin' in it.",
               "Another turn of the screw, and the apples burst all round %n, and the juice soaks into everythin', and runs over them warm and sticky.",
               "The press squeezes, slow and firm and steady, and the apples pop and the juice floods round %n, and the cider man puts his ear to the press to listen."],
      press2: ["Then the cider man takes the board up and pours the first jug of juice over %n, and licks it off their neck to taste it, and pours another.",
               "{c}The cider man reaches in through the slats and strokes %n's cock in the apple juice, slow, and says the sweetest cider's in the pressin'.",
               "{v}The cider man slides a hand through the slats and between %n's legs, slick with apple juice, and finds them sweeter than the apples.",
               "{t}The cider man licks the apple juice off %n's tits through the slats, slow, one and then the other, tastin'."],
      endMilk: ["The cider man winds the press back and helps %n out, sticky and sweet and milked of %ml into the cider, and that batch wins the ribbon.",
                "%n's let out of the press milked of %ml, apple-sticky from head to toe, and the cider man swears it's the sweetest batch he's ever made.",
                "By the time the press is wound back %n's given %ml to the cider, and they climb out sticky and light and glowin', and the cider man gives them the first cup."],
      endDry: ["Not another drop comes, however the cider man squeezes, and he winds the press back and helps %n out, sore and sticky and smellin' of apples.",
               "%n's milked dry before the trough's full, and the cider man laughs and lets them out with a cup of the ordinary cider."],
      endPress: ["The cider man winds the press back and helps %n out of the apples, sticky with juice from head to toe and very well pressed.",
                 "%n climbs out of the cider press smellin' like an orchard, apple pulp in their hair and juice in every crease, and the cider man says it's a prize batch.",
                 "%n's let out of the press flushed and sticky and grinnin', and the first cup of the cider tastes faintly, somehow, of them."],
    },
    after(mn, v){
      arouse(mn, 35);
      if (v.milk){
        const got = drainMilk(mn, prodOf(mn).milk*0.6);
        trapMess(mn, "ciderpress", "milk", ["milk", ["chest"]]); face(mn, "milked", 90);
        return got > 0 ? { endKey: "endMilk", ml: ml(got) } : { endKey: "endDry" };
      }
      trapMess(mn, "ciderpress", "cider", ["cider", ["chest", "tummy", "face"]]); face(mn, "afterglow", 90);
      return { endKey: "endPress" };
    },
    scene: [["The press creaks with every turn of the screw, a deep old oak creak, and the juice drips steady into the trough.",
             "Wasps drift in through the barn door after the apples, and the cider man waves them off with his cap.",
             "The barn smells of apples so strongly it's like bein' inside one.",
             "Apples roll off the pile and across the floor, and nobody picks them up."],
            ["{t}The cider man's thumbs circle %n's nipples through the slats, slow, between squeezes.",
             "{c}Somebody strokes %n's cock through the slats of the press while the screw turns.",
             "{v}A finger slips through the slats and along %n's pussy, slow, and the apple juice makes it slick.",
             "The cider man kisses %n through the slats of the press, and his beard smells of apples."]],
    tender: ["The cider man winds the screw a quarter turn at a time and asks %n how it feels every time.", "There's a folded blanket under %n in the press, and the board's padded with straw.",
             "The cider man talks to %n the whole time about apple varieties, low and soothin', and keeps a hand on them."],
    filthy: ["%n's laid in the press and squeezed like the apples, and they're drippin' more than the trough.", "The cider man presses and milks %n into his cider, and %n's moanin' for another turn of the screw.",
             "%n's the secret ingredient in this year's cider, and the whole farm's goin' to drink them."],
    gear: [{ when: "hold", slot: "arms", label: "Press Strap", items: ["LeatherCuffs", "HempRope"], color: "#6B4A2B", desc: "The cider press's leather strap, buckled over their wrists so they lie still among the apples while it's wound down." }],
    depth: ["milk", "held", "mess"], tw: ["milk", "day"], places: ["trough", "stalls", "cabin"], sound: "creak", tags: ["milking", "messy", "restraint"],
    writes: ["PRESSED", "SWEETEST BATCH", "APPLE-SWEET", "PRIZE CIDER"],
  });

  // ── the harvest crown ──
  seasonTrap("mabon", "harvestcrown", {
    icon: "👑", what: "crowned at the harvest home: paraded on the last wagon in the harvest crown, and given to the harvesters at the supper", limit: /\b(gang|public|parade|exhibit|double)/i,
    stud: { sire: -86, name: "the harvesters", type: "human", loads: 3, ml: 170, hold: 8, hole: "vulva", bonus: 1.5, where: "the harvest home", person: true, both: true },
    lines: {
      beats: [
        ["Every harvest home the farm crowns somebody for the year's harvest, and this year the harvesters have voted, and they've voted for %n, and they're comin' across the yard with the crown.",
         "%n's sat on the last wagon in the yard before they know what's happenin', a crown of poppies and wheat on their head, and the harvesters are cheerin' and the horses are movin'.",
         "\"Hail the harvest!\" somebody shouts, and the whole yard takes it up, and a crown of poppies and barley lands on %n's head, and they're lifted up onto the last wagon."],
        ["The last wagon goes round the farm piled with sheaves and ribbons, %n sat on top in the harvest crown, and every harvester walkin' alongside reaches up to touch them for luck.",
         "Round the fields the wagon goes, slow, %n on top of the sheaves with their wrists tied to the rail with a red ribbon so they don't fall off, and the harvesters singin' all round.",
         "They parade %n round the whole farm on the last wagon, crowned, garlanded, waved at, and at every gate somebody climbs up and kisses them."],
        ["At the harvest home the wagon stops by the long table, and the harvesters lift %n down and lay them on the sheaves, and the old custom is that the crowned one belongs to the harvesters till the supper's done.",
         "{c}They lay %n on a bed of sheaves at the head of the table, and the head harvester kneels, and takes %n's cock in her hand, and the custom begins.",
         "{v}They lay %n back on the sheaves and the head harvester runs a hand up between their thighs, and finds them ready, and the whole table cheers.",
         "{t}The harvesters crowd round the crowned one on the sheaves, and hands are on %n's tits before the crown's even straight."],
      ],
      in: [
        ["{v}The head harvester takes %n's %h, and the next one takes what's left behind, and the crowned one's shared out like the harvest, both ends at once.",
         "{nv}The head harvester takes %n's %h, and the next one kneels at their head, and the crowned one's shared out like the harvest, both ends at once.",
         "One by one the harvesters take their turn with the crowned one on the sheaves, and the table bangs its cups in time."],
        ["Three harvesters, three loads, and the crowned one's stuffed as full as the barns, and the whole harvest home's on its feet.",
         "They finish one after another and the table roars, and the crown's slipped down over one of %n's eyes and nobody fixes it."],
      ],
      over: [["They don't take them. They kneel round the crowned one on the sheaves and spill across them one after another, and the table cheers every one."]],
      end: ["The harvesters lift %n up off the sheaves, crown crooked, %ml of the harvest in their %h, and sit them at the head of the table for the rest of the supper, and everybody toasts them.",
            "%n's carried to the head of the long table with %ml in their %h and the harvest crown on their head, and fed the first slice of everythin'.",
            "The custom's kept, the harvest's honoured, and %n's left on the sheaves crowned and glowin' with %ml in their %h, and the supper goes on round them."],
      endOver: ["%n sits up on the sheaves crowned and painted with %ml of the harvesters, and the whole table raises its cups.",
                "The harvesters help %n up, crown crooked, %ml of them drippin', and give them the seat of honour."],
    },
    scene: [["The long table's covered in bread and apples and pies, and lanterns, and nobody's eatin' yet.",
             "The last wagon's horses stand by the gate, ribbons in their manes, crunchin' apples and payin' no attention.",
             "Somebody starts the harvest song, and the whole long table joins in, bangin' their cups.",
             "Poppy petals drop off the crown with every thrust and scatter over the sheaves."],
            ["{t}A harvester feeds %n a strawberry and squeezes their tits while they eat it.",
             "{c}The harvesters take turns strokin' %n's cock while they wait, and keep score.",
             "{v}A harvester's thumb circles %n's clit in time with the song, while the next one gets ready.",
             "Somebody straightens %n's crown and kisses them under it."]],
    tender: ["The harvesters are slow and kind and honoured, and every one of them thanks the crowned one.", "The head harvester holds %n's hand the whole time and calls them the best harvest the farm's ever had.",
             "Somebody puts a cushion of sheaves under %n's head, and somebody else keeps their cup full."],
    filthy: ["%n's crowned, paraded and passed round every harvester at the supper, and they're beggin' for the harvest to go on all night.", "The harvesters bring the crowned one in like the last of the crop, two at a time, in front of the whole table.",
             "%n's the farm's harvest crown, and every harvester gets their share of them."],
    gear: [{ when: "hold", slot: "ropeArms", label: "Wagon Ribbon", items: ["Ribbons"], color: "#B3122E", desc: "A red ribbon round their wrists, tied to the rail of the last wagon so the crowned one doesn't fall off the sheaves." },
           { when: "after", slot: "hat", label: "The Harvest Crown", items: ["PoppyCrown", "FlowerCrown"], mins: 30, desc: "A crown of red poppies and wheat ears, for the one the harvesters crowned. Worn the rest of the night." }],
    depth: ["breed", "watched"], tw: ["crowd", "day", "breed"], places: ["pasture", "stalls", "stockade"], sound: "wood", tags: ["public"],
    writes: ["CROWNED", "THE HARVEST'S", "SHARED OUT", "HAIL THE HARVEST"],
  });

  // ── the harvest supper ──
  seasonTrap("mabon", "harvestsupper", {
    icon: "🍽️", what: "the harvest supper: laid down the middle of the long table as the centrepiece, the feast heaped on you, and everyone eats off you", limit: /\b(food|messy|public|objectif|lick|platter)/i, hold: 7, where: "the harvest supper",
    lines: {
      beats: [
        ["The long table's set for the harvest supper, and down the middle of it there's a long empty space where the centrepiece goes, and the cook's lookin' at the space, and then at %n.",
         "%n comes in to help lay the harvest supper and the cook clears a space down the middle of the long table with one sweep of her arm. \"Up you get, sugar. You're the centrepiece.\"",
         "There's an old custom on the farm: the harvest supper's served on whoever's last in from the fields. %n's last in from the fields."],
        ["They lay %n down the middle of the long table on a clean white cloth, wrists tied to the table legs with harvest ribbon, and the cook starts layin' out the feast.",
         "On the table %n goes, flat on their back, ribbons round their wrists, and the cook lays the supper out on them: bread on their belly, apples in their hands, honey drizzled everywhere.",
         "Down the middle of the long table they lay %n like the finest dish of the night, and everythin' the kitchen's made goes on top of them."],
        ["Slices of honey-glazed ham down their chest, grapes in a line down their middle, butter, a whole pie on their tummy, cream on top of that, and the farm sits down to eat.",
         "{t}The cook arranges strawberries round %n's tits and a dollop of cream on each nipple, and steps back to admire it.",
         "{c}The cook lays a garland of grapes round %n's cock and drizzles honey down it, and calls it the gravy boat.",
         "{v}The cook spoons cream between %n's thighs and sets a strawberry on top, and the table oohs."],
        ["Then everybody eats, and nobody uses a plate. Mouths on %n's belly, on their chest, their thighs, their fingers, everythin' eaten off them and the honey licked up after.",
         "The supper goes on for hours, and the whole farm eats off %n, and licks them clean, and the cook keeps bringin' seconds and layin' them on.",
         "{t}Somebody eats the strawberries off %n's tits one by one, and licks off the cream, and goes back for the bits they missed.",
         "{c}Somebody licks the honey off %n's cock in long slow strokes, and the whole table watches, and nobody's eatin' anythin' else.",
         "{v}Somebody eats the cream from between %n's thighs, slow and thorough, and the table bangs its cups."],
      ],
      end: ["The supper's eaten, every crumb off %n, and they're untied and helped down off the table licked clean in some places and sticky in others, and the farm gives them a round of applause.",
            "%n's untied from the long table at midnight, honey in their hair and crumbs in their ears and every inch of them well fed on, and the cook says it's the best harvest supper she's ever served.",
            "The supper's done and %n's let down off the table, sticky and glowin' and so well licked they're shakin', and the farm sits back with full bellies and toasts the centrepiece."],
    },
    after(mn){ arouse(mn, 45, 95); face(mn, "afterglow", 90); return null; },
    scene: [["Candles all down the long table, and the whole farm round it, and %n lit gold in the middle.",
             "Somebody keeps tryin' to put salt on %n and gettin' their hand smacked by the cook.",
             "The harvest song goes round the table between mouthfuls, and the cups bang, and the plates are empty because the food's on %n.",
             "A dog under the table gets a crust somebody dropped, and that's all it gets."],
            ["{t}Somebody licks honey off %n's nipple and says it needs more honey, and adds more, and licks again.",
             "{c}Somebody dips a strawberry in the honey on %n's cock and eats it, and then just eats the honey.",
             "{v}Somebody eats a grape from between %n's thighs without usin' their hands, and takes a long time about it.",
             "Somebody feeds %n a bite of pie and kisses the crumbs off their lips after."]],
    tender: ["The cook puts a pillow under %n's head and checks the honey isn't too warm.", "Everybody eats off %n gently, and thanks them, and feeds them the best bits.",
             "The cook sits at %n's head the whole supper and feeds them by hand."],
    filthy: ["%n's laid out on the table and eaten off by the whole farm, honey and cream licked out of every crease, and they're moanin' for dessert.", "%n's the harvest supper, and every mouth at the table's havin' a helpin'.",
             "The farm eats its fill off %n and then licks the plate clean, and the plate's beggin' for seconds."],
    mess: ["honey", ["chest", "tummy", "thighs"]],
    gear: [{ when: "hold", slot: "arms", label: "Table Ribbons", items: ["Ribbons"], color: "#C9A227", desc: "Gold harvest ribbons round their wrists, tied to the legs of the long table so the centrepiece stays put." }],
    depth: ["mess", "held", "watched"], tw: ["crowd", "night"], places: ["trough", "stalls", "cabin"], sound: "wood", tags: ["messy", "public", "restraint"],
    writes: ["SERVED", "THE CENTREPIECE", "LICKED CLEAN", "HARVEST SUPPER"],
  });
