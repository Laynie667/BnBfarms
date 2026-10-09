  /* WHAT'S IN THIS FILE (10m2-potion-lines.js)
     Every potion, lived in: what it does to you while it lasts (every few minutes, privately or for whoever's near),
     how it wears off, and a word in the farm's other scenes when it matters (a stud drawn by the musk, a stall
     that milks a Clover-swollen udder, a ruined orgasm on Bitterroot). %n = them · %p = the part a size potion changed
     · %a = their new animal on Wrong Barn.
  */
  const FX_MORE = {
    clover: [
      "%n's breasts have gone heavy and tight, warm milk beadin' at both nipples without anybody touchin' 'em.",
      "Every few steps %n has to stop and press a hand to their chest. The Clover Cream's fillin' 'em faster than they can stand.",
      "A dark wet spot blooms on the front of %n where they've leaked straight through.",
      "%n's nipples are swollen and stiff, achin' for a mouth or a cup, drippin' a thin white line down their belly.",
      "%n sways, dreamy and heavy, every let-down a warm little rush that makes their knees soft.",
      "You can hear it: a faint wet patter in the straw under %n where the Clover's makin' 'em overflow.",
    ],
    golden: [
      "%n's skin has a glow to it, flushed and loose, like they're waitin' for the next one.",
      "%n keeps smilin' at nothin', hips givin' little rolls, chasin' that warm Golden feelin'.",
      "%n's breath catches every time someone brushes past, golden and eager and easy to set off.",
      "There's a honey-slow heat pooled low in %n, and every touch stirs it.",
    ],
    heavy: [
      "%n's udder is swollen tight as a drum, shiny and hot, and the stalls just turn 'em away.",
      "%n whimpers and cups their breasts. They're so full it hurts to breathe, and nobody's allowed to empty 'em.",
      "Milk drips steady from both of %n's teats, pattin' into the dirt, and the ache just keeps buildin'.",
      "%n tries to walk and has to stop, bent over, breasts too heavy and too full to carry.",
      "The Heavy Udder Draught has %n leakin' in two thin streams, achin' for hands that won't come.",
      "%n's nipples are cracked-open taps. Every heartbeat pushes out more, and still they swell.",
    ],
    bitterroot: [
      "%n's thighs are slick and tremblin', and the Bitterroot won't let 'em anywhere near the edge.",
      "Every time %n gets close the heat just drains away, mean and sudden. They whine through their teeth.",
      "%n squirms, desperate, achin', and absolutely nothin' they do is gonna be enough.",
      "The Bitterroot's got %n wound tight and leakin', ruined before they even start.",
    ],
    needy: [
      "%n can't keep their hips still. They're grindin' against nothin', pantin' through their nose.",
      "%n's pussy is soaked and swollen and so needy they'd climb anybody who stood still long enough.",
      "%n keeps lookin' at every hand on the farm like it might be the one that finally helps.",
      "A thin string of wet slides down the inside of %n's thigh. They don't even notice anymore.",
    ],
    wrongbarn: [
      "%n lets out a %a's noise mid-sentence and goes red to the ears.",
      "%n paws at the dirt like a %a, catches themselves, and doesn't quite manage to stop.",
      "Somethin' about %n has gone all %a today: the way they stand, the way they sniff the air.",
      "%n tries to say somethin' and a %a's call comes out instead. The pen snickers.",
    ],
    bigbritches: [
      "%n's %p strains, two sizes too big and impossible not to stare at.",
      "%n keeps adjustin', but there's no hidin' a %p that swollen.",
      "Heads turn at %n's %p, heavy and new and very much on show.",
    ],
    shrink: [
      "%n keeps glancin' down at their %p, so much smaller than it ought to be.",
      "%n's %p has gone dainty and tight, and everyone can tell.",
      "A farmhand chuckles at %n's shrunk %p, and %n flushes from the ears down.",
    ],
    brood: [
      "%n's belly feels heavy and hungry, like it's waitin' to be filled with a whole litter. Their hand keeps driftin' to it.",
      "%n's womb aches, a deep, greedy throb. The Broodmare Tonic wants 'em bred, and bred big.",
      "%n keeps eyein' every stud on the farm like they're measurin' how many they could carry.",
      "A slick, swollen heat sits low in %n's belly. Ripe. Ready for a clutch. Ready for a dozen.",
    ],
    heatmist: [
      "%n's skin is pink and hot, and they can't stop squeezin' their thighs together.",
      "The heat's got %n swayin' their hips without meanin' to, presentin' to anyone in reach.",
      "%n smells like heat, sweet and thick, and the studs nearby have noticed.",
    ],
    moo: [
      "%n opens their mouth to argue and a long, low moo rolls out instead.",
      "Every word %n tries comes out as somethin' a cow would say. They've stopped tryin'.",
    ],
  };
  Object.assign(FX_LINES, Object.fromEntries(Object.entries(FX_MORE).map(([k, v]) => [k, (FX_LINES[k] || []).concat(v)])));
  // how each one wears off (to them, privately)
  const FX_OFF = {
    clover: ["The Clover Cream fades. Your breasts are still heavy, but the rush is gone. You'll miss it.", "The sweet clover warmth drains out of your chest. Back to fillin' at the usual pace, sugar."],
    golden: ["The golden glow cools off. The next one's just yours again, not the farm's.", "The Golden Hour's over. That last one was worth every drop, wasn't it?"],
    musk: ["The Blue Ribbon Musk fades. Heads stop turnin' quite so hard.", "Your skin smells like you again. The barn's a little less restless."],
    honey: ["The farm girl's sweet voice drifts out of your ear. Honey Tongue's done, darlin'."],
    bitterroot: ["The Bitterroot loosens its grip, slow and grudgin'. You can cum again, if you can still remember how.", "That mean, bitter knot finally unties. Go on. Somebody finish what it wouldn't let you."],
    heavy: ["The Heavy Udder Draught wears off, but you're still achin' and full. The stalls'll take you now. Run.", "The draught's done. Your udder isn't. Go get milked, cow, before you burst."],
    moo: ["Your words come back. The first one you say is still a little bit of a moo."],
    bell: ["The cowbell clangs one last time and falls quiet. Sneak all you like now."],
    needy: ["The ache finally fades to a dull, sticky throb. You're soaked, and you know it."],
    hiccup: ["One last *hic*, and the Hiccup Fizz is spent."],
    feather: ["Your skin stops tinglin'. The next breeze is just a breeze."],
    wrongbarn: ["You blink, and you're yourself again. Mostly. You still want to %a a little."],
    bigbritches: ["Your %p eases back to its own size. You'll miss the weight."],
    shrink: ["Your %p comes back to its proper size. What a relief."],
    echo: ["The Echo Elixir's spent. The farm girl stops listenin' quite so close."],
    heatmist: ["The heat mist burns off, leavin' you damp and dazed."],
    brood: ["The Broodmare Tonic fades. Whatever got put in you while it lasted, though, stays put."],
  };
  function fxFill(t, mn, f){
    f = f || {};
    return String(t).replace(/%n/g, plainName(mn)).replace(/%p/g, f.part ? String((CFG.SIZES[f.part] || {}).label || f.part).toLowerCase() : "body")
      .replace(/%a/g, f.to ? String(f.to).toLowerCase() : "animal");
  }
  // the wear-off line, private
  function potionOffLine(mn, id, f){
    const pool = FX_OFF[id]; if (!pool) return null;
    return "🧪 " + fxFill(pickFresh("fxoff:" + id, pool), mn, f);
  }
  // a potion's word in somebody else's scene: a stud drawn in by the musk, Clover milk, a heat-slick pussy…
  const FX_BITS = {
    musk: ["The Blue Ribbon Musk on %n's skin has the stud halfway to mindless.", "Whoever's at %n can't stop breathin' in the musk on their neck."],
    clover: ["Milk sprays from %n's Clover-swollen teats with every thrust.", "%n's heavy breasts leak a warm stream down their belly the whole time."],
    heavy: ["%n's overfull udder swings and leaks, achin' with every slam.", "Every thrust squeezes milk out of %n's swollen, untouchable teats."],
    heatmist: ["%n is so wet from the heat mist it's pourin' down their thighs.", "%n's heat-flushed pussy grips like it's been waitin' all day."],
    needy: ["%n is so needy they're pushin' back for more before it's even started.", "%n sobs with relief at bein' filled at last."],
    bitterroot: ["%n gets close, so close, and the Bitterroot snatches it away again. Ruined, and still bein' used.", "%n whines; the Bitterroot won't let 'em cum no matter how good it feels."],
    golden: ["%n goes off like a firework, golden and shakin', the second they're touched.", "%n cums almost at once, glowin' and loose."],
    bell: ["The cowbell on %n clangs with every single thrust. The whole farm can hear the rhythm."],
    brood: ["%n's Broodmare-ripe womb just drinks it down, hungry for a whole litter.", "%n's belly gives a deep, greedy clench around the load. That Tonic wants it to take, and take big."],
  };
  function potionBit(mn){
    const on = activePotions(mn).map(f => f.id).filter(id => FX_BITS[id]);
    if (!on.length) return "";
    const id = on[Math.floor(Math.random() * on.length)];
    return fxFill(pickFresh("fxbit:" + id, FX_BITS[id]), mn, (rec(mn).fx || {})[id]);
  }
