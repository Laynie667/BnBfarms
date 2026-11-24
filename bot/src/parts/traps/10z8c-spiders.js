  /* WHAT'S IN THIS FILE (10z8c-spiders.js)
     SPIDERS, AND THE LAB (Nov 24, the suggestion box's #65; May: "special spider cave… a special cock for spiders
     'ovipositor' so they like a dragons will be laying eggs"; Laynie: "only cave but ovipositer as cock type. silk as
     product", then "Maybe as a wild trap, like a trap door spider, or a sneak attack from the trees. could be a few
     varients. and maybe a few mad science test events with gear with unique tag combos. Silk should pay out ribbons,
     just slightly more than eggs").
     • SPIDERS hide in the wild traps (10z8-wild-traps.js asks wildOdd): now and then the wild tile somebody steps on isn't
       the place's trap at all. Three of them, each where it fits:
         the trapdoor spider   a silk-hinged lid in the floor, anywhere the wild traps hide
         the drider            drops out of the trees over the pasture
         the weaver            webs strung through the barn rafters
       They wrap you in silk, and if you can be bred they lay in you with an ovipositor (the farm's egg layin': a clutch you
       lay at the nest). No seed that catches. What they leave on you is a cocoon of the game's own web (WILD_KITS.spider),
       and it stays till somebody else cuts you out, like every wild trap's kit.
     • SILK: whoever comes out of a spider's web comes out wrapped in it, and the farm girl buys it off them on the spot:
       SILK.YARDS yards, a ribbon for every SILK.PER_RIBBON, a little better than a clutch of eggs pays at the market.
     • THE LAB, behind receivin': a mad scientist who straps a prototype on you and sends you out to field-test it. Each
       prototype (WILD_KITS.lab) is real gear with real words on it, the farm's tags (lactation, fertility, egg layin',
       stretchin', obedience) that the farm girl reads while it's worn, and, for those with wild traps laced, doses their
       Dispensary reads (an injector, a drip, a trigger). Combos nothin' else on the farm hands out.
     • Only for those who've said yes to the wild traps (?traps wild on). The spiders have their own switch for the
       arachnophobic: ?traps theme spiders off (the Companion's Traps tab too), and the Halloween spider queen goes with it.
  */
  if (!CFG.SPIDERS) CFG.SPIDERS = { CHANCE: { barn: 0.2, pasture: 0.3, receiving: 0.1 }, LAB_CHANCE: 0.35 };
  if (!CFG.SILK) CFG.SILK = { YARDS: [6, 14], PER_RIBBON: 3 };
  const SPIDER_LIMIT = /\b(spiders?|insects?|bugs?|eggs?|ovipos\w*|webs?|clutch\w*|arachn\w*)\b/i;
  // where each one hides
  const SPIDER_AT = { barn: ["weaver", "trapdoor"], pasture: ["drider", "trapdoor"], receiving: ["trapdoor"] };
  // (only from a wild tile: wildOdd picks them, with state.wildPick set while it asks)
  const wildOnly = (mn) => (wildOn(mn) || state.wildPick === mn) ? null : "only the wild ones hide it";
  const spiderNeeds = (mn) => wildOnly(mn) || (limitBlocks(mn, "eggs") ? "their limits rule it out" : null);

  Object.assign(TRAP_KINDS, {
    trapdoor: { icon: "🕷️", what: "a trapdoor spider's burrow: down through the floor, wrapped in silk, and laid in", limit: SPIDER_LIMIT },
    drider:   { icon: "🕷️", what: "the drider in the trees: snatched up into the branches, cocooned and laid in", limit: SPIDER_LIMIT },
    weaver:   { icon: "🕸️", what: "the weaver in the barn rafters: woven into her web like lace, and laid in", limit: SPIDER_LIMIT },
    labtest:  { icon: "🧪", what: "the lab behind receivin': a mad scientist, a prototype, and you're the field trial", limit: /\b(experiment\w*|science|lab|medical|clinic\w*|doctor)\b/i },
  });
  for (const k of ["trapdoor", "drider", "weaver"]) TRAP_NEEDS[k] = spiderNeeds;
  TRAP_NEEDS.labtest = wildOnly;
  // the spiders' studs: an ovipositor, eggs and no seed that catches (bonus 0), and the silk after
  const SPIDER_STUD = (sire, name, where) => ({ sire, name, type: "ovipositor", loads: 1, ml: 120, hold: 8, hole: "vulva", bonus: 0, where, eggs: true, after: (mn) => silkPay(mn, name) });
  ANTHRO.trapdoor = SPIDER_STUD(-90, "the trapdoor spider", "the trapdoor spider's burrow");
  ANTHRO.drider = SPIDER_STUD(-91, "the drider in the trees", "the drider's branch");
  ANTHRO.weaver = SPIDER_STUD(-92, "the weaver in the rafters", "the weaver's web");
  for (const k of ["trapdoor", "drider", "weaver"]){
    TRAP_SOUND[k] = "ropelong"; TRAP_SOUND_END[k] = "rope";
    TRAP_GEAR[k] = [{ when: "hold", slot: "arms", label: "Spider Silk", items: ["Web"], opt: "Wrapped", color: "#F4F4F4", desc: "Fine white silk wound round and round, soft as cotton and impossible to pull apart." }];
  }
  // ARACHNOPHOBIA: a switch of their own (10y9q-trap-switches.js), with the Halloween spider queen in it too
  TRAP_THEME_SW.spiders = { off: "spider traps", icon: "🕷️", label: "Spiders", desc: "The trapdoor spider, the drider in the trees, the weaver in the rafters and the Halloween spider queen: webs, cocoons and eggs laid in you. Off for the arachnophobic." };
  for (const k of ["trapdoor", "drider", "weaver", "spider"]) for (const t of ["spiders", "monsters", "pregnancy"]) if (!(TRAP_TAGS[k] = TRAP_TAGS[k] || []).includes(t)) TRAP_TAGS[k].push(t);
  THEME_SW_WORDS.spider = "spiders"; THEME_SW_WORDS.arachnids = "spiders"; THEME_SW_WORDS.arachnophobia = "spiders"; THEME_SW_WORDS.webs = "spiders";

  Object.assign(ANTHRO_LINES, {
    trapdoor: {
      beats: [
        ["The ground under %n gives like a lid, because it IS a lid: a round trapdoor of silk and dirt, and it swings open under them.",
         "%n steps on a patch of straw that's a little too smooth, and it tips: a silk-hinged trapdoor, and the dark under it.",
         "There's a click under %n's foot, soft as a latch, and the floor opens like a mouth."],
        ["Long legs come up out of the burrow faster than anythin' that big should move, wrap round %n's waist, and pull them down into the dark.",
         "Somethin' takes %n by the ankles from below, eight hooked legs and a hungry little chitter, and down they go.",
         "%n drops into a burrow lined with silk, soft as a feather bed, and she's waitin' at the bottom: half a woman, half a big glossy spider, and all of her smilin'."],
        ["She spins while she holds them, round and round, silk over their arms and down their legs, till %n's bundled tight and only the parts she wants are bare.",
         "Her spinnerets work at %n like a loom, and in a minute they're wrapped snug from the shoulders to the knees, hung in the dark of her burrow.",
         "She turns %n over and over in her legs, wrappin' as she goes, till they're a neat silk parcel she can do as she likes with."],
      ],
      in: [
        ["Her ovipositor slides out of her, slick and ridged and long, and she feeds it into %n's %h an inch at a time, down there in the dark where nobody can hear.",
         "She settles her weight over the bundle that's %n, and her ovipositor finds their %h, pushes in, and keeps goin', deeper than anythin' has a right to."],
        ["Then the eggs: a swell at the root, a slow push, a pop, and one's in. Then another. %n's belly rounds out in the silk with every one she lays.",
         "She lays slow and careful, an egg at a time, each one a fat round pressure squeezin' into %n's %h and settlin' deep, and she hums to them while she does it."],
      ],
      over: [["She doesn't lay. She keeps %n wrapped in her burrow and strokes them with soft, feathery legs, teasin' every bare inch till they're squirmin' in the silk.",
              "She hangs %n in the dark of her burrow and leaves them there a while, wrapped and helpless, checkin' on them now and then with one long leg."]],
      end: ["The trapdoor swings open again and she pushes %n up into the light, cocooned and dazed, belly round with %x of her eggs and slick drippin' from their %h.",
            "%n's left on the floor beside the trapdoor, wrapped in silk, %x eggs heavy in their belly. The lid settles shut. You'd never know it was there."],
      endOver: ["She pushes %n back up through the trapdoor, wrapped in silk and tinglin' all over, and the lid closes like it was never there."],
    },
    drider: {
      beats: [
        ["The branches over the pasture path rustle, and %n looks up a second too late.",
         "%n walks under the big oak, and somethin' up in the leaves goes very still.",
         "A line of silk drifts down in front of %n's face, glitterin', and somethin' comes down after it."],
        ["She drops out of the canopy on a single thread, upside down: a woman to the hips, pale and pretty, and below that a spider's body as big as a pony.",
         "Eight legs land round %n like the bars of a cage, and the drider they belong to smiles down, hair hangin', every one of her eyes on them.",
         "She takes %n from above, legs closin' round them, and the ground falls away as she climbs back up into the leaves."],
        ["Up in the branches she spins %n into a hammock of silk, wrists to the bough, legs spread and tied, swayin' in the breeze.",
         "She wraps %n tight and hangs them from a high branch like a lantern, slowly spinnin', bare where she wants them bare.",
         "The silk goes round and round, and when she's done %n's a cocoon hung in the oak, with a gap just where she means to use them."],
      ],
      in: [
        ["She hangs upside down in front of %n, and her ovipositor curls up and finds their %h, slick and ridged, and slides in while the whole tree sways.",
         "She braces on the branch, belly to %n's, and her ovipositor pushes into their %h, long and slow, while the leaves rustle all round."],
        ["She lays in time with the wind in the branches: swell, push, pop, and another egg settles in %n, then another, till they've stopped countin'.",
         "One by one the eggs go in, each a round, warm weight passin' into %n's %h, and the cocoon creaks with how full they're gettin'."],
      ],
      over: [["She doesn't lay. She leaves %n hangin' in the oak, cocooned, and strokes them with the soft tips of her legs every time the wind swings them close.",
              "She keeps %n up in the branches a while, swingin' gently in her silk, and tickles them every time she passes."]],
      end: ["She lets %n down on a long thread, cocoon and all, into the grass at the foot of the oak: %x eggs heavy in their belly, slick runnin' from their %h.",
            "%n is lowered into the pasture grass, wrapped like a parcel and full of %x eggs, and the drider goes back up into the leaves."],
      endOver: ["She lowers %n into the grass, still wrapped, still tinglin', and climbs back up the oak without a sound."],
    },
    weaver: {
      beats: [
        ["%n walks into a strand of silk across the barn aisle. Then another. Then they can't walk any more, because the whole aisle is web.",
         "There's a web strung between the barn beams that wasn't there this mornin', and %n's in it before they see it.",
         "The lantern light catches silk all through the rafters, and %n hears somethin' big shift on the beam above."],
        ["The weaver comes down the web hand over hand, leg over leg: a spider woman, long and black and glossy, with a seamstress's careful smile.",
         "Eight legs pick their way down the strands, and the woman on top of them tuts at %n like they're a dropped stitch.",
         "She lowers herself from the beam right in front of %n's face, upside down, and says, \"Hold still, dear. I'm makin' you somethin'.\""],
        ["She weaves %n into the web itself, arms up and spread, legs apart, silk crisscrossed over them so neat it looks like lace.",
         "Her legs fly, and the web closes round %n in a pattern, tight and pretty, until they're part of it, hung at the height she likes.",
         "She ties %n into the web strand by strand, like she's mendin' a sail, and leaves every bit of them she wants to use bare."],
      ],
      in: [
        ["She climbs over %n in the web, and her ovipositor finds their %h, slick and ridged, and pushes in, and the whole web shivers with it.",
         "She settles onto %n where they hang, and her ovipositor slides into their %h, long and slow, while she hums a little sewin' song."],
        ["She lays like she sews: neat and even, one egg, then the next, each one pressed into %n's %h and patted into place on their swellin' belly.",
         "The eggs come in a steady rhythm, each one a fat, round push into %n's %h, and the web creaks with the weight of them."],
      ],
      over: [["She doesn't lay. She embroiders %n instead, silk stitched in pretty loops over every bare inch, until they're shakin' and beggin' in the web.",
              "She leaves %n hung in the web like a sampler on the wall, and comes back to admire her work every few minutes."]],
      end: ["She cuts %n out of the web and sets them down in the straw, still wrapped in her lace, belly round with %x eggs and slick drippin' from their %h.",
            "%n is lowered from the rafters on a thread, a lace-wrapped parcel with %x eggs inside, and the weaver goes back to her mendin'."],
      endOver: ["She snips %n loose and lowers them into the straw, still trimmed in her silk lace and tinglin' all over."],
    },
  });
  // a couple of beats more while she has them (10ue-trap-scenes.js)
  const SPIDER_SCENE = [
    ["Somethin' small and many-legged runs along the silk to see what's happenin', and runs away again.",
     "The silk hums when %n moves, and every hum tells her exactly where they are.",
     "Her eyes, all eight of them, follow every twitch %n makes.",
     "She tests the silk round %n with one leg, plucks it like a harp string, and smiles at the sound."],
    ["{t}Two soft legs stroke %n's tits through the silk, round and round, slow and tickly.",
     "{c}She leaves a gap in the silk for %n's cock and teases it with the tip of one leg, just the tip, over and over.",
     "{v}She strokes between %n's legs with a leg as soft as a feather duster, and it's maddenin'.",
     "She kisses %n, upside down, from the strand above, and her lips taste of honey."]];
  for (const k of ["trapdoor", "drider", "weaver"]) trapScene(k, ...SPIDER_SCENE);
  // how ?intensity tender and filthy hear it (10y9b-intensity-lines.js)
  INTENSITY_BY_TRAP.trapdoor = {
    tender: ["She tucks the silk soft round %n's shoulders, like a blanket, and strokes their hair down there in the dark.", "She hums to %n the whole time, low and kind, and never pulls a strand too tight.", "She lets %n rest against her belly after, warm and wrapped, till they've stopped shakin'."],
    filthy: ["Down in her burrow %n's nothin' but a warm, wrapped hole for her to fill, and she fills it.", "She stuffs %n with eggs till their belly bulges against the silk, and chitters at every noise they make.", "%n's drippin' slick and silk in the dark and beggin' for more eggs, and she gives them more."] };
  INTENSITY_BY_TRAP.drider = {
    tender: ["She cradles %n against her as the branch sways, careful as anythin', and croons to them.", "She brushes the hair off %n's face with one soft leg and tells them they're doin' so well.", "She lowers them so slow, after, that they barely feel the grass."],
    filthy: ["Hung up in the oak like a fly, %n's just a swingin' hole for her ovipositor, and the whole pasture can see.", "She packs %n full and lets the wind swing them, belly bulgin', slick runnin' down the cocoon.", "%n's moanin' for her eggs up in the branches, loud enough for the cows to hear, and she laughs and lays more."] };
  INTENSITY_BY_TRAP.weaver = {
    tender: ["She smooths every strand round %n flat and neat, and checks they can breathe easy.", "She tells %n how pretty they look in her lace, and means it.", "She takes her time, and every stitch is gentle."],
    filthy: ["She weaves %n spread wide in the web like a display, every hole on show, and fills the one she likes.", "She lays in %n neat as embroidery, egg after egg, till they're a stuffed, drippin' sampler on the barn wall.", "%n hangs in her lace beggin' to be laid in again, and she obliges, humming."] };
  INTENSITY_BY_TRAP.labtest = {
    tender: ["The doc warms every instrument in their hands first, and apologises for the cold ones.", "\"You're doin' marvellously,\" the doc says, and pats %n's hand between readings.", "The doc checks the straps twice, so nothin' pinches."],
    filthy: ["The doc measures how wet %n gets on a little brass gauge, and writes the number down with obvious delight.", "\"Squirm all you like, it improves the data,\" the doc says, and turns the dial up.", "To the doc, %n's just a needy specimen on a table, and they take very thorough notes."] };

  // SILK: bought off them on the spot (a little better than a clutch of eggs at the market)
  function silkPay(mn, by){
    const r = rec(mn); if (!r) return 0;
    const [a, b] = CFG.SILK.YARDS, yards = a + Math.floor(Math.random()*(b - a + 1)), n = Math.max(1, Math.ceil(yards / CFG.SILK.PER_RIBBON));
    r.silk = (r.silk || 0) + yards; saveLedger();
    later(() => {
      const got = earnRibbons(mn, n, yards+" yards of spider silk, sold at market");
      try { leaderShare(mn, got); } catch(e){ /* no herd */ }
      emote("🕸️ The farm girl unwinds "+yards+" yards of good white silk off "+plainName(mn)+" and pays them for it on the spot: "+n+" ribbon"+(n === 1 ? "" : "s")+". \"Spider silk fetches a fine price, sugar.\"", mn);
    }, 3000);
    return yards;
  }

  // WHAT THE SPIDERS LEAVE: a cocoon, stayin' till somebody else cuts them out (10z8-wild-traps.js, wildGear)
  const SILK_PIECE = {
    gag:    { slot: "gag", label: "Silk Gag", items: ["WebGag"], color: "#F4F4F4", desc: "A wad of sticky silk stuffed in their mouth and wound round their head." },
    blind:  { slot: "blind", label: "Silk Blindfold", items: ["WebBlindfold"], color: "#F4F4F4", desc: "Silk spun over their eyes, thick as gauze." },
    ears:   { slot: "earplugs", label: "Silk Plugs", items: ["HeavyDutyEarPlugs"], color: "#F4F4F4", desc: "Silk packed in both ears. All they hear is their own heart, and the web creakin'." },
    hobble: { slot: "feet", label: "Silk Hobble", items: ["HempRope"], color: "#F4F4F4", desc: "Their ankles wound together in silk. Small steps, or none." },
  };
  const LAB_PIECE = {
    cuffs: { slot: "arms", label: "Lab Restraints", items: ["LeatherCuffs"], opt: "Wrist", desc: "Padded cuffs locked behind them, so nobody fiddles with the settings." },
    blind: { slot: "blind", label: "Lab Blinders", items: ["LeatherBlindfold"], desc: "Blinders, so the results aren't swayed by what the subject sees." },
    ears:  { slot: "earplugs", label: "Lab Earmuffs", items: ["HeavyDutyEarPlugs"], desc: "Plugs in both ears, so the subject isn't swayed by what they hear either." },
  };
  WILD_KITS.spider = [
    { name: "Cocooned", tell: "%n is left cocooned: wrapped in silk from the shoulders down, a wad of it in their mouth, more over their eyes and in their ears, ankles wound together, a parcel waitin' to be found.",
      pieces: [
        { slot: "arms", label: "Spider's Cocoon", items: ["Web"], opt: "Cocooned", color: "#F4F4F4", laced: "Venom in the silk, a drip of sedative.", desc: "Silk wound round and round from the shoulders to the knees, tight as a chrysalis." },
        SILK_PIECE.gag, SILK_PIECE.blind, SILK_PIECE.ears, SILK_PIECE.hobble ] },
    { name: "Hung Up for Later", tell: "%n is left hogtied in silk, wrists to ankles, gagged and blinded with it, one of her eggs plugged in to keep warm, a spider's supper set aside for later.",
      pieces: [
        { slot: "arms", label: "Spider's Hogtie", items: ["Web"], opt: "Hogtied", color: "#F4F4F4", laced: "Venom in the silk, a drip of needy nectar.", desc: "Wrists and ankles wound together behind them in silk, tight and sticky." },
        SILK_PIECE.gag, SILK_PIECE.blind, SILK_PIECE.ears,
        { slot: "plug", label: "Spider's Egg Plug", items: ["EggVibePlugXXL", "TailButtPlug"], color: "#F4F4F4", desc: "A smooth silk-wrapped egg pushed in deep behind, to keep her clutch company." } ] },
    { name: "Wrapped Like Lace", tell: "%n is left wrapped in a spider's lace: arms bound in silk, eyes and ears covered, ankles hobbled, a silk gag tied neat, a pretty parcel nobody's opened yet.",
      pieces: [
        { slot: "arms", label: "Spider's Lace", items: ["Web"], opt: "Wrapped", color: "#F4F4F4", laced: "Venom in the silk, a drip of haze drops.", desc: "Silk lace wound neat and tight round their arms and body." },
        SILK_PIECE.gag, SILK_PIECE.blind, SILK_PIECE.ears, SILK_PIECE.hobble ] },
  ];

  // ── THE LAB ──
  const LAB_LINES = {
    beats: [
      ["The door at the back of receivin' that's always locked isn't, and %n's through it before they think better of it: a lab, all glass and copper and bubblin' flasks.",
       "A hand in a rubber glove closes on %n's wrist from a doorway they never noticed. \"Ah. A volunteer,\" says a voice, delighted.",
       "%n trips over a cable, and the cable runs back to a door marked TESTING, and the door opens."],
      ["The doc is tall and thin in a stained white coat, goggles pushed up in wild hair, and they look %n over like a page of notes. \"Perfect. Exactly the build I needed.\"",
       "\"Don't mind the straps,\" the doc says, buckling %n down to a padded table. \"They're for the equipment's safety, not yours.\"",
       "The doc circles %n with a clipboard, measurin' with their eyes and tappin' a pencil on their teeth. \"Yes. You'll do nicely for trial eleven.\""],
      ["Out of a crate full of straw comes the prototype, all brass fittings and rubber and a little blinkin' light, and the doc fits it to %n with tender, careful hands.",
       "\"Hold still, this is the delicate part,\" the doc murmurs, and the prototype goes on with a hiss and a click, and starts to hum.",
       "The doc reads the settings off a card, adjusts three dials, and fits the thing to %n. \"Let's see what it does,\" they say, and flips the switch."],
    ],
    end: ["The doc makes a last note, unstraps %n from the table and shoos them out. \"Field trial! Keep it on. Somebody'll be along to take readings.\"",
          "\"Fascinatin',\" the doc says, scribblin'. \"Let's see how it does out in the barn.\" And %n's out the door, prototype and all.",
          "\"Trial eleven: promisin',\" the doc mutters, and pushes %n out through the door. \"Don't take it off. Don't let anybody take it off. Notes, I need notes.\""],
  };
  trapScene("labtest",
    ["A centrifuge whines up to speed somewhere behind %n, and the doc hums along with it.",
     "The doc presses a cold stethoscope to %n's belly and listens, nodding, and writes somethin' down.",
     "Somethin' in a jar on the shelf opens its eyes and watches."],
    ["{t}The doc squeezes each of %n's tits in turn, like testin' fruit, and makes a note: \"Responsive.\"",
     "The doc takes a reading between %n's legs with a little brass instrument, and it beeps, and the doc looks very pleased.",
     "\"Climbin' nicely,\" the doc murmurs, watchin' a needle swing higher on a dial wired between %n's thighs."]);
  TRAP_SOUND.labtest = "machine";
  MORE_TRAPS.labtest = (mn, spot) => {
    trapHold(mn, 6, "the lab");
    trapRun(mn, "labtest", LAB_LINES.beats, () => {
      emote("🧪 "+tFill(pickFor(mn, "trap:labtest:end", LAB_LINES.end), mn), mn);
      face(mn, "edged", 90); arouse(mn, 30);
    }, {});
  };
  // THE PROTOTYPES: each one real gear with real words on it. In the description, the farm's own tags (the farm girl reads
  // them while it's worn); in laced, the Dispensary's (only for those with ?traps wild laced on). Combos nothin' else hands out.
  // (Laynie, Nov 24: "lab kits can sport multiple doses and effects, truely mad science". A piece can drip, inject and
  // trigger all at once, and every dose it names goes in each way: the Dispensary reads it all, worn.js.)
  WILD_KITS.lab = [
    { name: "Trial Eleven: the Milker Mk II", tell: "%n is sent off with trial eleven still latched on: a brass milker that won't switch off, a harness of sensors that zaps them every time they're touched, blinders, earmuffs, and cuffs so they can't fiddle with the settings.",
      pieces: [
        { slot: "cups", label: "Milker Mk II", items: ["LactationPump"], laced: "Auto-injector: let-down tonic, needy nectar, hair trigger, every 15 minutes.", desc: "Brass milker: lactation drive, no off switch." },
        { slot: "torso", label: "Test Harness", items: ["LeatherHarness"], laced: "Moo juice and hair trigger when touched; heat mist on climax.", desc: "Sensor straps and copper leads, takin' readings." },
        LAB_PIECE.cuffs, LAB_PIECE.blind, LAB_PIECE.ears ] },
    { name: "Trial Twelve: the Breedin' Stimulator", tell: "%n is sent off with trial twelve buzzin' inside them, a numbered collar drippin' rut and need into them, blinders, earmuffs and the lab's cuffs.",
      pieces: [
        { slot: "dildo", label: "Stimulator Plug", items: ["InflatableVibeDildo", "VibratingDildo"], laced: "Hungry. Heat mist and sure-catch serum on climax.", desc: "Copper-coil plug: fertility, virility and capacity stretching." },
        { slot: "collar", label: "Trial Twelve Collar", items: ["LeatherCollar"], laced: "A drip of rut serum and needy nectar.", desc: "A collar with a brass tag stamped TRIAL 12." },
        LAB_PIECE.cuffs, LAB_PIECE.blind, LAB_PIECE.ears ] },
    { name: "Trial Thirteen: the Silk Gland Graft", tell: "%n is sent off with trial thirteen strapped low on their belly: a pulsin' silk gland for egg layin' that swells their belly, a ridged trainer plug to get them used to bein' laid in, blinders, earmuffs and the lab's cuffs.",
      pieces: [
        { slot: "torso", label: "Silk Gland Graft", items: ["LeatherHarness"], laced: "A drip of needy nectar and fill-out, belly.", desc: "A pulsin' gland strapped low: egg laying, a clutch from any stud." },
        { slot: "plug", label: "Ovipositor Trainer", items: ["TailButtPlug", "InflVibeButtPlug"], laced: "Auto-injector of tender drops, ass, and hair trigger.", desc: "A ridged plug for gettin' used to bein' laid in." },
        LAB_PIECE.cuffs, LAB_PIECE.blind, LAB_PIECE.ears ] },
    { name: "Trial Fourteen: the Obedience Collar", tell: "%n is sent off in trial fourteen: a steel collar with a blinkin' light that makes them docile and dim and moo when they're spanked, the lab's mitts and cuffs, blinders and earmuffs.",
      pieces: [
        { slot: "collar", label: "Obedience Collar v0.3", items: ["SlaveCollar", "LeatherCollar"], laced: "Moo serum when spanked; a drip of airhead elixir and sedative.", desc: "Steel collar, blinkin' light: obedience conditioning." },
        { slot: "hands", label: "Lab Mitts", items: ["PaddedLeatherMittens"], desc: "Padded mitts, so the subject can't reach the collar's dials." },
        LAB_PIECE.cuffs, LAB_PIECE.blind, LAB_PIECE.ears ] },
  ];

  // wildSpring asks (10z8-wild-traps.js): is it somethin' else hidin' in this wild tile? → { kind, area } or null
  function wildOdd(mn, w){
    const g = (w && w.g) || "barn", r = rec(mn); if (!r) return null;
    state.wildPick = mn;
    try {
      const odd = [];
      if (g === "receiving" && Math.random() < CFG.SPIDERS.LAB_CHANCE && !trapWhyNot(mn, "labtest")) odd.push({ kind: "labtest", area: "lab" });
      if (!odd.length && Math.random() < (CFG.SPIDERS.CHANCE[g] || 0)){
        const ks = (SPIDER_AT[g] || ["trapdoor"]).filter(k => !trapWhyNot(mn, k));
        if (ks.length) odd.push({ kind: ks[Math.floor(Math.random()*ks.length)], area: "spider" });
      }
      return odd[0] || null;
    } finally { state.wildPick = 0; }
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __wildOdd: (mn, w) => wildOdd(mn, w), __silkPay: (mn) => silkPay(mn, "test") });
