  /* WHAT'S IN THIS FILE (10y9d-body-fit.js)
     Lines that fit the body they're about (Laynie, Oct 12: a male sprang a trap and was told about his pussy).
     • bodyOf(mn): what they've got. Their ?gender says first (female, male, futa, femboy); if they never set one,
       what the game shows on them does.
     • pickFor(mn, key, pool): like pickFresh, but it only picks lines that fit. A line can say who it's for with a
       tag on the front, and the tag never shows:
         {v} has a pussy · {nv} hasn't · {c} has a cock · {nc} hasn't · {t} has tits · {nt} flat
         {f} female · {m} male · {fu} futa · {fb} femboy            (several tags: all must fit)
       A line with no tag is checked by its words: one that talks about a pussy, a womb or a clit is left out for
       somebody without one, the same for tits and udders on a flat chest. If nothin' in the pool fits, the words
       are swapped instead (bodyWords), so nobody is ever told about parts they haven't got.
     • bodyTail(mn, kind): now and then a trap beat gets one more sentence about the parts they DO have: cock and
       balls, pussy, both, or a femboy's. Each named trap has its own, and there are shared ones.
  */
  const BODY_TAG = /^(?:\{(?:nv|nc|nt|fu|fb|v|c|t|f|m)\})+/;
  const VULVA_WORDS = /\b(pussy|pussies|cunt|cunts|slit|womb|clit|cervix)\b/i;
  const TITS_WORDS = /\b(tits?|titties|breasts?|udders?|teats?|cleavage)\b/i;
  const GIRL_WORDS = /\b(girl|heifer|mare|broodmare)\b/i;
  function bodyOf(mn){
    const r = rec(mn) || {}, set = r.gender || "", vulva = hasVulva(mn), cock = makesSemen(mn);
    const g = set || (r.futa || (vulva && cock) ? "futa" : vulva ? "female" : "male");
    return { g, vulva, cock, tits: g === "female" || g === "futa" };
  }
  function tagsFit(line, b){
    const m = String(line).match(BODY_TAG); if (!m) return true;
    for (const t of m[0].slice(1, -1).split("}{")){
      if (t === "v" && !b.vulva) return false;   if (t === "nv" && b.vulva) return false;
      if (t === "c" && !b.cock) return false;    if (t === "nc" && b.cock) return false;
      if (t === "t" && !b.tits) return false;    if (t === "nt" && b.tits) return false;
      if (t === "f" && b.g !== "female") return false; if (t === "m" && b.g !== "male") return false;
      if (t === "fu" && b.g !== "futa") return false;  if (t === "fb" && b.g !== "femboy") return false;
    }
    return true;
  }
  function wordsFit(line, b){
    const s = String(line);
    if (BODY_TAG.test(s)) return true;                       // a tagged line was written for this body
    if (!b.vulva && VULVA_WORDS.test(s)) return false;
    if (!b.tits && TITS_WORDS.test(s)) return false;
    if (b.g === "male" && GIRL_WORDS.test(s)) return false;
    return true;
  }
  function pickFor(mn, key, list){
    try {
      if (!Array.isArray(list) || !list.length || !rec(mn)) return pickFresh(key, list);
      const b = bodyOf(mn), tagged = list.filter(l => tagsFit(l, b)), best = tagged.filter(l => wordsFit(l, b));
      return pickFresh(key, best.length ? best : tagged.length ? tagged : list);
    } catch(e){ return pickFresh(key, list); }
  }
  // the last resort: the words themselves, swapped for parts this body has
  const SWAP_NO_VULVA = [[/\bpussies\b/g, "asses"], [/\bpussy\b/g, "ass"], [/\bcunts\b/g, "holes"], [/\bcunt\b/g, "hole"], [/\bslit\b/g, "crack"], [/\bwomb\b/g, "belly"], [/\bcervix\b/g, "guts"], [/\bclit\b/g, "cock"]];
  const SWAP_FLAT = [[/\btits\b/g, "chest"], [/\btit\b/g, "nipple"], [/\btitties\b/g, "chest"], [/\bbreasts\b/g, "chest"], [/\bbreast\b/g, "chest"], [/\budders\b/g, "chest"], [/\budder\b/g, "chest"], [/\bteats\b/g, "nipples"], [/\bteat\b/g, "nipple"], [/\bcleavage\b/g, "chest"]];
  const SWAP_FEMBOY = [[/\btits\b/g, "soft little chest"], [/\btitties\b/g, "soft little chest"], [/\bbreasts\b/g, "soft little chest"], [/\bbreast\b/g, "chest"], [/\budders\b/g, "puffy nipples"], [/\budder\b/g, "chest"], [/\bteats\b/g, "puffy nipples"], [/\bteat\b/g, "nipple"], [/\bcleavage\b/g, "chest"]];
  const SWAP_MALE = [[/\bgood girl\b/g, "good boy"], [/\bgirl\b/g, "boy"], [/\bheifer\b/g, "steer"], [/\bbroodmare\b/g, "stud"], [/\bmare\b/g, "colt"]];
  function bodyWords(mn, text){
    try {
      const written = BODY_TAG.test(String(text));   // a tagged line was written for the body it's shown to: no swappin'
      let t = String(text).replace(BODY_TAG, "");
      if (written || !mn || !L || !L.people || !L.people[mn]) return t;
      if (!VULVA_WORDS.test(t) && !TITS_WORDS.test(t) && !GIRL_WORDS.test(t)) return t;
      const b = bodyOf(mn);
      if (!b.vulva) for (const [re, w] of SWAP_NO_VULVA) t = t.replace(re, w);
      if (!b.tits) for (const [re, w] of (b.g === "femboy" ? SWAP_FEMBOY : SWAP_FLAT)) t = t.replace(re, w);
      if (b.g === "male") for (const [re, w] of SWAP_MALE) t = t.replace(re, w);
      return t;
    } catch(e){ return String(text); }
  }

  // one more sentence about the parts they do have, on about a third of a trap's beats from the second on
  function bodyTail(mn, kind, i){
    if (i < 2 || Math.random() >= CFG.BODY_TAIL_CHANCE) return "";
    const b = bodyOf(mn), own = BODY_TAILS[kind] || {}, pools = [];
    if (b.g === "femboy"){ if (own.fb) pools.push(own.fb); pools.push(BODY_TAILS.any.fb); }
    if (b.g === "futa"){ if (own.fu) pools.push(own.fu); pools.push(BODY_TAILS.any.fu); }
    if (b.cock && b.g !== "futa"){ if (own.c) pools.push(own.c, own.c); pools.push(BODY_TAILS.any.c); }
    if (b.vulva && b.g !== "futa"){ if (own.v) pools.push(own.v, own.v); pools.push(BODY_TAILS.any.v); }
    if (!pools.length) return "";
    const pool = pools[Math.floor(Math.random()*pools.length)];
    return " "+tFill("{c}"+pickFresh("body:"+kind+":"+b.g, pool), mn);   // (tagged so its words are left alone)
  }
  const BODY_TAILS = {
    any: {
      c: ["%n's cock is stood up hard against their belly, leakin', and nothin' on this farm is goin' to touch it.", "Their balls have drawn up tight. They're not allowed to do a thing about it.",
          "A long clear string swings from the tip of %n's cock every time they're jolted.", "%n's cock bobs, untouched, slappin' wet against their own stomach.",
          "Precum's runnin' down %n's shaft and drippin' off their sack into the straw.", "Their cock jerks in the air like it's lookin' for somethin' to be in. It isn't the one doin' the fuckin' today.",
          "%n's balls are heavy and achin', swingin' with every shove.", "Hard as a fence post and ignored: that's what a stud is worth here when it's his turn to be stock.",
          "%n's cock twitches and dribbles, spendin' itself a drop at a time on the floor.", "Every stroke knocks a little more out of %n's cock, wasted in the dirt."],
      v: ["%n's pussy is swollen and shinin', and their thighs are slick to the knee.", "Their clit's stood out hard and throbbin', beggin' for a touch it won't get.", "%n's cunt clenches on nothin', drippin' in long strings.",
          "The lips of %n's pussy are puffed up dark and wet, open like they're askin'.", "%n's slit is runnin' like a tap.", "Their pussy flutters and squeezes, tryin' to pull somethin' in.",
          "You could hear how wet %n is from the gate.", "%n's clit rubs on somethin' with every rock of their hips, and they whine."],
      fu: ["%n's cock is hard and their pussy's drippin' under it, and neither one is gettin' any mercy.", "Their cock slaps their belly while their cunt runs down their thighs: twice the need and no relief for either.",
           "%n leaks from the tip and from the pussy behind their balls, both at once.", "Cock jerkin', pussy clenchin', tits swingin': every part of %n wants somethin' different and gets none of it.",
           "%n's balls are tight up against a pussy that's gapin' for it.", "They could breed or be bred, and right now the farm's decided which."],
      fb: ["%n's pretty little cock is stiff and pink and drippin', and nobody's lookin' at it. They're lookin' at the hole.", "Their soft thighs shake. Their cock dribbles on the floor between them, forgotten.",
           "%n's smooth little sack is drawn up tight under a cock that only ever gets to leak.", "A girlish whimper, a twitch, and %n's cock spits a thin clear thread it never earned.",
           "%n's cock is too small to matter here. It's their ass the farm has a use for.", "Their hips are wider than a boy's ought to be, and they're pushin' them back for more."],
    },
    injector: { c: ["The dose goes straight to %n's balls. They can feel them fill.", "%n's cock thickens while the plunger's still goin' down."], v: ["The warmth pools low and %n's pussy goes slick around nothin'.", "%n's clit swells while the plunger's still goin' down."] },
    milker:   { c: ["The sleeve swallows %n's cock to the root and starts to milk, slow, like strippin' a teat.", "%n's balls are cupped and squeezed in time, and the jar ticks fuller.", "It milks %n's cock like any other teat on the farm, and it doesn't care that they're a stud."],
                v: ["Every pull on %n's teats goes straight to their clit.", "%n's pussy drips in time with the pump."], fb: ["The cup that takes %n's little cock is the smallest one on the rack, and it still gets every drop."] },
    breeder:  { c: ["It's %n's ass it wants. Their own cock just swings under them, droolin', while they're bred like a mare.", "Each shove squeezes a spurt out of %n's cock without a hand on it."],
                v: ["It bottoms out in %n's cunt and grinds there, right against the mouth of their womb.", "%n's pussy is stretched white round the shaft."] },
    gas:      { c: ["%n's cock is hard before they've finished breathin' in.", "Their balls ache with it. It wants out, and it's not gettin' out."], v: ["%n's pussy is soaked through before they've finished breathin' in.", "Their clit's throbbin' like a second heartbeat."] },
    snare:    { c: ["The little machine buzzes up the underside of %n's cock, to the tip, and stops.", "%n's cock strains at the air, jumpin' every time the toy comes near."], v: ["The toy circles %n's clit and never lands on it.", "%n's pussy gapes and drips, strung open."] },
    spray:    { c: ["A rope of it lands across %n's own hard cock and they nearly go off from that alone.", "It's drippin' off %n's balls."], v: ["It runs down between %n's legs, hot, mixin' with their own.", "It's stringin' off %n's pussy lips."] },
    clamp:    { c: ["Inside the steel, %n's cock is caged down small and somethin' licks the one bare inch of it.", "%n's balls hang out under the clamp, swollen and useless."], v: ["Inside the steel, somethin' laps %n's clit and stops.", "%n's pussy is sealed up wet behind it."] },
    pump:     { c: ["The pressure on %n's insides milks their cock from behind, and it oozes steady.", "%n's cock lies on top of a belly that's gettin' rounder under it."], v: ["%n's pussy is squeezed tight by how full their gut is.", "The swell of it presses %n's clit against the rail."] },
    eggs:     { c: ["Each egg rolls over that spot inside %n and their cock spits.", "%n's balls are tight against a hole stuffed with eggs."], v: ["Each egg stretches %n's cunt round and slips up into their womb.", "%n's pussy closes behind every one."] },
    tentacle: { c: ["A thin one winds round %n's cock and balls and squeezes them like fruit.", "It milks %n's cock into the water while it stuffs their ass.", "One slips into the tip of %n's cock, and they wail."],
                v: ["A thin one finds %n's clit and latches on.", "It's in %n's cunt to the womb and still pushin'."], fu: ["One takes %n's cock, one their cunt, one their ass, and it works all three to the same beat."] },
    wolves:   { c: ["The wolf-man reaches under and squeezes %n's balls till they yelp, and laughs.", "%n's cock sprays the straw when the knot goes in."], v: ["The knot pops into %n's cunt and their eyes roll.", "%n's pussy is tied shut round a wolf."] },
    stallion: { c: ["%n's own cock looks like a toy beside what's in them.", "He's so deep it's pushin' the cum out of %n's cock."], v: ["%n's pussy is stretched round a cock as thick as their arm.", "He's against the back of %n's womb and still has length to spare."] },
    bull:     { c: ["The bull-man's fist closes round %n's cock and milks it like a teat while he ruts.", "%n's cum goes in the pail with the rest."], v: ["He bottoms out in %n's cunt on every stroke.", "%n's pussy's frothin' round him."] },
    warren:   { c: ["One of the bucks is rubbin' himself on %n's cock while another's in them.", "%n's cock is smeared with rabbit cum."], v: ["%n's cunt never has a moment empty.", "It's bubblin' out of %n's pussy."] },
    boar:     { c: ["%n's cock is ground into the mud under them.", "The boar-man's weight squeezes %n's cum out into the wallow."], v: ["The boar-man's corkscrew is locked in the mouth of %n's womb.", "%n's cunt is plugged with hog."] },
    toms:     { c: ["A rough tongue drags up %n's balls.", "The barbs make %n's cock jump every time he pulls back."], v: ["The barbs rake %n's cunt comin' out.", "%n's pussy clamps on him and he yowls."] },
    drake:    { c: ["A claw-tip traces %n's cock, careful, curious.", "%n's cock is pinned under a scaled belly."], v: ["Every ridge pops through %n's pussy lips.", "The drake-man's seed is hot enough in %n's womb to feel."] },
    naga:     { c: ["A coil closes round %n's cock and ripples.", "%n's cock is wrung by the coils in time with the thrusts."], v: ["One in %n's cunt, one in their ass, pressed together through the wall.", "%n's pussy is stuffed and squeezed at once."] },
    kennel:   { c: ["%n's caged-down cock drips on the kennel floor like a dog's.", "He knots %n's ass and their cock empties itself in the straw."], v: ["%n's empty pussy drools while he's tied in their ass.", "%n's cunt is left wantin', which is part of the trainin'."] },
    hive:     { c: ["Honey runs down %n's cock and the workers lick it off.", "%n's cock is glazed and twitchin'."], v: ["Honey's runnin' into %n's pussy and they can feel it tingle.", "%n's cunt is sticky-sweet and empty."] },
    goat:     { c: ["%n's cock stands up hard between their knees while they gag.", "%n is rubbin' themself on their own heel."], v: ["%n's pussy drips on the ground between their knees while they gag.", "%n's hand has gone between their legs without askin'."] },
    sow:      { c: ["Her big hand works %n's cock slow while she breeds them, like she's milkin' a runt.", "%n's cock spills in her palm and she wipes it on their belly."], v: ["She's deep in %n's cunt and takin' her time.", "%n's pussy grips her and she chuckles."] },
    suit:     { c: ["The latex has closed over %n's cock in a tight sleeve, and it's squeezin'.", "It strokes %n's cock from inside its own skin."], v: ["The latex has pushed up into %n's pussy and moulded itself there.", "It's suckin' on %n's clit from inside."] },
    slime:    { c: ["Slime oozes down %n's cock and crawls into the tip.", "It's coated %n's balls and it's kneadin' them."], v: ["Slime crawls up into %n's pussy and settles in.", "It's wrapped %n's clit and it's pulsin'."] },
    vines:    { c: ["A tendril coils %n's cock, tip to root, and tightens.", "A thin vine has threaded itself round %n's balls."], v: ["A vine as thick as a wrist is planted in %n's cunt.", "A tendril's teasin' %n's clit while the big one works."] },
    cups:     { c: ["%n's cock twitches every time the cups pull.", "%n's chest is drawn up into the glass, nipples stretchin'."], v: ["Every pull on %n's teats makes their pussy clench.", "%n's tits are swellin' in the glass."] },
    weights:  { c: ["The sleeve drains %n's cock dry and keeps goin'.", "%n's balls ache, empty, and already fillin'."] },
  };
