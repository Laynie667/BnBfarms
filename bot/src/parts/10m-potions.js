  /* WHAT'S IN THIS FILE (10m-potions.js)
     POTIONS: little bottles that wear off. Rewards, punishments, and some just because it's funny. They come
     from the store (?buy), as gifts (always a yes/no first), from staff (?potion give), or off the wheel.
     Anybody else's potion needs ?potions on; their limits still rule one out; the safeword pours every one
     of them out at once. Effects live on the record (r.fx) so they survive the bot reloadin'.
     DARES (?dares on): a dare to do in the next half hour. ?dared when it's done (ribbons), ?dare skip to chicken out.
     THE PEN: staff (or the wheel) pen somebody at a pen spot (?spot set pen, pen-2…) or a milkin' stall for a
     while. Wander off and the farm girl walks you right back.
  */

  // ── the bottles ───────────────────────────────────────────
  // kind: reward | punish | silly · mins: how long · price: in the store · limit: words in their hard limits that rule it out
  const POTIONS = [
    { id: "clover", name: "Clover Cream", kind: "reward", mins: 60, price: 6, desc: "Milk (or seed) comes in twice as fast for an hour, and every let-down feels like a gift.",
      limit: /\bmilk|lactat/i, drink: "It tastes like sweet clover and warm cream, and a slow heat spreads through your chest.",
      seen: "%n drinks a little bottle of Clover Cream and sighs, already lookin' heavier and softer." },
    { id: "golden", name: "Golden Hour", kind: "reward", mins: 60, price: 7, desc: "For an hour, every time you cum the farm girl dotes on you, and it earns a ribbon (up to 3).",
      limit: /\borgasm/i, drink: "Honey-gold and fizzy. Everything goes warm and loose and glowy.",
      seen: "%n tips back a bottle of Golden Hour, and a dreamy little smile spreads across their face." },
    { id: "musk", name: "Blue Ribbon Musk", kind: "reward", mins: 45, price: 5, desc: "For 45 minutes everybody nearby keeps noticin' you, and the farm girl makes sure you know it.",
      limit: null, drink: "You dab it on your neck and wrists. It smells like hay and heat and somethin' that makes heads turn.",
      seen: "%n dabs on a little Blue Ribbon Musk. A couple of heads turn before the cork's even back in." },
    { id: "honey", name: "Honey Tongue", kind: "reward", mins: 45, price: 5, desc: "For 45 minutes the farm girl whispers sweet, filthy praise in your ear.",
      limit: /\bpraise/i, drink: "Thick as honey and twice as sweet. Your ears go pink before it's even down.",
      seen: "%n licks a drop of Honey Tongue off their lips, and starts glowin' like they've been told somethin' nice." },
    { id: "brood", name: "Broodmare Tonic", kind: "reward", mins: 180, price: 9, desc: "For three hours any stud's load can leave a clutch of eggs (three times as likely), and anything that takes comes in as a huge litter.",
      limit: /\b(preg|breed|egg|litter)/i, drink: "Thick and sweet as molasses. It settles low in your belly, and your womb goes hot and greedy.",
      seen: "%n drinks a Broodmare Tonic and presses a hand low on their belly, already lookin' ripe." },
    { id: "bitterroot", name: "Bitterroot", kind: "punish", mins: 30, price: 5, desc: "For 30 minutes, every orgasm slips away ruined, and nobody gets filled by you.",
      limit: /\b(denial|ruin|orgasm)/i, drink: "Bitter as a scolding. It settles low and tight and mean, right where you ache.",
      seen: "%n chokes down a bottle of Bitterroot and makes a face. Somebody's in for a frustratin' half hour." },
    { id: "heavy", name: "Heavy Udder Draught", kind: "punish", mins: 20, price: 5, desc: "For 20 minutes you fill three times as fast, and the stalls won't take you. Ache for it.",
      limit: /\bmilk|lactat/i, drink: "Thick and creamy and it goes straight to your chest. You can feel it fillin' already.",
      seen: "%n gulps down a Heavy Udder Draught. You can practically watch 'em swell." },
    { id: "moo", name: "Moo Juice", kind: "punish", mins: 20, price: 4, needsPanel: true, desc: "For 20 minutes your words keep comin' out as animal noises (needs the Companion).",
      limit: /\b(speech|humiliat)/i, drink: "It tastes like grass. You open your mouth to complain and a moo falls out.",
      seen: "%n drinks a bottle of Moo Juice. They start to say somethin' and it comes out a very confused moo." },
    { id: "bell", name: "Bell Tonic", kind: "punish", mins: 30, price: 4, desc: "For 30 minutes a cowbell clangs every time you move. Everybody knows where you are.",
      limit: /\bhumiliat/i, drink: "Tastes like brass and bad decisions. Somewhere, a bell starts ringin'.",
      seen: "%n drinks a Bell Tonic, and a loud brassy CLANG follows the very first step they take." },
    { id: "needy", name: "Needy Nectar", kind: "punish", mins: 30, price: 4, desc: "For 30 minutes you ache and squirm and can't stop thinkin' about it. ?beg nicely and it might let up early.",
      limit: /\b(arous|denial)/i, drink: "Sweet at first, then it blooms into a slow, maddenin' throb that won't settle.",
      seen: "%n drinks a Needy Nectar and starts squirmin' within the minute, thighs pressed tight." },
    { id: "danger", name: "Danger Draught", kind: "punish", mins: 120, price: 8, stack: 4, desc: "For two hours your luck runs bad: you catch half again as easy, the water and every chancy thing on the farm are half again as likely to get you, and whatever a trap does to you lasts twice as long (three times with a second bottle). Every bottle adds a quarter to the parasite's chance at the glory stalls: four bottles deep, it is certain.",
      limit: /\b(danger|risk)/i, drink: "It's black, it smokes a little, and it tastes like a dare. Somethin' in your belly goes cold and reckless.",
      seen: "%n knocks back a Danger Draught and shivers. They've just made themselves the unluckiest animal on the farm." },
    { id: "tentaclemusk", name: "Tentacle Musk", kind: "punish", mins: 120, price: 10, stack: 3, desc: "A perfume. For two hours the thing in the water can smell you from the bottom of the pond: it's twenty times as likely to come for you, it looks for you every minute you stand near water, and every clutch anything lays in you comes in three times the size (five with a second dab, seven with a third). The parasite likes it too. Only with your traps on, for the water.",
      limit: /\b(tentacle|eggs?|ovipos|clutch|monster)/i, drink: "You dab it on your throat, your wrists, the insides of your thighs. It smells of salt and deep water and somethin' sweet rottin'. Somewhere, somethin' wakes up.",
      seen: "%n dabs on a perfume that smells like low tide and sex. The surface of every trough and puddle nearby shivers, just once." },
    { id: "wolfscent", name: "Wolf Scent", kind: "punish", mins: 60, price: 6, desc: "A scent. For an hour you smell like a bitch in season to anything with a muzzle, and the pack will come and find you wherever you're standin'. Only with your traps on.",
      limit: /\b(gang|knot|anthro|furr)/i, drink: "You dab it behind your ears and between your legs. Musky, sharp, a little like wet fur. Somewhere far off, somethin' lifts its nose.",
      seen: "%n dabs on somethin' sharp and musky. Out past the fence, a howl goes up." },
    { id: "goblinmusk", name: "Goblin Musk", kind: "punish", mins: 90, price: 7, desc: "A musk. For an hour and a half you smell like the best thing a goblin ever stole: the raiding party, the pit, the market and the cart come lookin' for you wherever you're standin', and at the glory stalls more of the visitors are goblins, all balls and no manners. Only with your traps on, for the traps.",
      limit: /\b(goblin|gang|anthro|monster)/i, drink: "You dab it on your neck and wrists and the backs of your knees. It smells of woodsmoke, wet moss and somethin' green and rank and sweet. Somewhere in the hedges, little ears prick up.",
      seen: "%n dabs on a little bottle of somethin' green and pungent. From the hedge at the edge of the yard comes a high, delighted giggle." },
    { id: "mareheat", name: "Mare's Heat", kind: "punish", mins: 60, price: 6, desc: "A scent. For an hour you smell like a mare ready for the stud, and the stallion will leave his stall and come for you. Only with your traps on.",
      limit: /\b(size|inflat|anthro|furr)/i, drink: "It's thick and sweet and a little rank, and you stroke it up the insides of your thighs. In the stud barn, a hoof strikes a door.",
      seen: "%n smears on a scent that makes every stallion on the place stamp and snort." },
    { id: "sowslop", name: "Sow's Slop", kind: "punish", mins: 60, price: 6, desc: "A scent. For an hour you smell like slop and sow, and the boar will break out of the sty to get at you. Only with your traps on.",
      limit: /\b(mud|filth|humiliat|knot|anthro|furr)/i, drink: "It stinks. You rub it on anyway, belly and backside, and from the sty comes a long, hungry grunt.",
      seen: "%n rubs on somethin' that reeks of the sty. The boar's rails creak." },
    { id: "hiccup", name: "Hiccup Fizz", kind: "silly", mins: 15, price: 3, desc: "Fifteen minutes of hiccups. At the worst possible moments.",
      limit: null, drink: "Fizzy and bright and *hic*. Oh no.",
      seen: "%n drinks a Hiccup Fizz and immediately lets out a very loud *hic*." },
    { id: "feather", name: "Featherlight", kind: "silly", mins: 15, price: 3, desc: "Fifteen minutes of bein' unbearably ticklish. Everything makes you giggle.",
      limit: /\btickl/i, drink: "Light as a feather, and suddenly your whole skin feels like one.",
      seen: "%n drinks a Featherlight and giggles when the breeze touches 'em." },
    { id: "wrongbarn", name: "Wrong Barn", kind: "silly", mins: 60, price: 5, desc: "For an hour you're a different animal. Noises, stall story and all.",
      limit: /\bspecies/i, drink: "It tastes like somebody else's feed. Your whole body goes a bit… different.",
      seen: "%n drinks a Wrong Barn and blinks. They don't seem quite like themselves." },
    { id: "bigbritches", name: "Big Britches", kind: "silly", mins: 60, price: 4, desc: "Somethin' of yours grows two sizes for an hour, then snaps back.",
      limit: /\b(size|growth|grow)/i, drink: "It goes down warm and then a whole lot of you gets… more.",
      seen: "%n drinks a Big Britches, and somethin' on 'em swells right out of its britches." },
    { id: "shrink", name: "Shrinking Violet", kind: "silly", mins: 60, price: 4, desc: "Somethin' of yours shrinks two sizes for an hour, then comes back.",
      limit: /\b(size|shrink)/i, drink: "Cool and minty, and a whole lot of you suddenly feels very small.",
      seen: "%n drinks a Shrinking Violet and goes a little smaller somewhere important." },
    { id: "echo", name: "Echo Elixir", kind: "silly", mins: 20, price: 3, desc: "Twice in 20 minutes, the farm girl repeats somethin' you said back to the room. Sweetly.",
      limit: /\bhumiliat/i, drink: "It tastes like it's been said before. Twice.",
      seen: "%n drinks an Echo Elixir. The farm girl's ears perk up." },
    { id: "heatmist", name: "Heat Mist", kind: "silly", mins: 15, price: 4, desc: "Fifteen minutes in heat, right now, wherever you're standin'.",
      limit: /\bheat/i, drink: "A sweet mist, one breath of it, and you go hot and flushed all over.",
      seen: "%n breathes in a puff of Heat Mist and flushes pink from the ears down." },
  ];
  // ── seen drinkin' it: more ways the room sees each bottle go down (Laynie, Oct 14: the same line every time). Picked
  // fresh, for the body that drank it ({t} tits, {nt} flat, {v} pussy, {c} cock, as everywhere). The bottle's own
  // first line (seen, above) is in the pool too.
  const POTION_SEEN = {
    clover: [
      "{t}%n downs a little bottle of Clover Cream and their tits give a slow, heavy throb they can't help but cup.",
      "%n sips a Clover Cream like it's dessert, licks the rim, and goes soft-eyed and warm all over.",
      "A bottle of Clover Cream goes down %n's throat, and they settle back like a cow in good grass, sleepy and full and leakin' a little already.",
      "%n tips up the Clover Cream, and the smell of sweet hay and cream drifts off 'em for a good minute after."],
    golden: [
      "%n drinks off a Golden Hour and giggles at nothin'. Their cheeks are already pink.",
      "The Golden Hour fizzes on %n's tongue, and they go loose and glowy, like they've just been told they're the best little thing on the farm.",
      "%n sips a Golden Hour slow, eyes half-shut, and you can see them start lookin' forward to the next time they cum.",
      "A bottle of liquid sunshine goes down %n, and they stretch like a cat in a warm window."],
    musk: [
      "%n rubs a drop of Blue Ribbon Musk into their throat, and the nearest farmhand forgets what they were sayin'.",
      "A whiff of hay and heat comes off %n with every step now. Folks keep lookin' up and not knowing why.",
      "%n dabs Blue Ribbon Musk behind each ear, then, after a thought, a little lower. Heads turn.",
      "The cork comes out, the scent rolls across the yard, and suddenly %n is the most interesting animal in the barn."],
    honey: [
      "%n tips a spoonful of Honey Tongue onto their tongue and goes dreamy, like somebody's whisperin' sweet nothin's right into their ear. Somebody is.",
      "%n drinks the Honey Tongue and blushes clear down to the collarbone. The praise has already started.",
      "A sticky-sweet Honey Tongue, licked off two fingers. %n squirms like they've just been called a very good pet.",
      "%n swallows the Honey Tongue and leans into nothin', the way you lean into a warm voice."],
    brood: [
      "{v}%n drinks a Broodmare Tonic, and their pussy clenches on nothin' as it hits. They look ready for anybody.",
      "%n knocks back a Broodmare Tonic. Their belly gives a low, warm flutter, and their hips start rollin' all on their own.",
      "The Broodmare Tonic goes down thick as molasses, and %n spreads their stance without thinkin', like a mare waitin' at the fence.",
      "%n finishes the Broodmare Tonic and rubs slow circles low on their belly. Any stud worth his salt can smell it from here."],
    bitterroot: [
      "%n gags on a Bitterroot and glares at the bottle. Everything that was building in 'em just went sour.",
      "A swig of Bitterroot, and %n's face scrunches up. Whatever pleasure's comin' their way for the next half hour, it's comin' ruined.",
      "%n swallows the Bitterroot like medicine. Then their thighs press together, and they whimper, because now it aches and it won't pay out.",
      "The Bitterroot goes down mean. %n squirms, already frustrated, and they haven't even been touched yet."],
    heavy: [
      "{t}%n gulps the Heavy Udder Draught and their tits fill visibly, tight and hot, straining against whatever's holdin' them.",
      "{t}The Heavy Udder Draught hits %n's chest like a wave. They're full to aching inside a minute, and the stalls won't have 'em.",
      "{nt}%n drinks the Heavy Udder Draught, and their chest goes hot and puffy, nipples swelling, a bead of milk welling up on each.",
      "%n downs the Heavy Udder Draught and grabs the nearest rail. Something in 'em is fillin' fast and it isn't going to stop."],
    moo: [
      "%n drinks the Moo Juice, opens their mouth to say thank you, and lows like a heifer at feeding time.",
      "One bottle of Moo Juice later, %n tries to complain. What comes out is a long, mournful mooooo.",
      "%n swallows the Moo Juice and claps a hand over their mouth. Too late: the moo's out, and everyone heard it.",
      "The Moo Juice goes down, and %n's next three words are all the same word, and that word is moo."],
    bell: [
      "%n drinks the Bell Tonic. They shift their weight, and CLANG. They freeze. CLANG.",
      "A Bell Tonic later, %n tries to sneak off. The cowbell that isn't there rings the whole way out of the yard.",
      "%n downs the Bell Tonic and takes one careful step. The bell goes off like the dinner gong.",
      "Every wiggle %n makes after that Bell Tonic rings out across the farm. Nobody's losin' track of 'em now."],
    needy: [
      "%n drinks the Needy Nectar, and within a minute they're rubbing their thighs together and biting their lip.",
      "The Needy Nectar blooms in %n's belly, and they start squirmin' against whatever they're sitting on.",
      "%n finishes the Needy Nectar and goes pink and fidgety. Their hands keep drifting down and getting caught halfway.",
      "One sip of Needy Nectar and %n is leaning on things, pressing on things, aching for things. They might have to ask nicely."],
    danger: [
      "%n knocks back a Danger Draught and laughs, a little too loud. Somewhere out in the fields, something notices.",
      "The Danger Draught smokes on the way down. %n shivers, and every trap on the farm gets a little hungrier.",
      "%n drinks the Danger Draught like a dare. Their luck just went belly-up, and they look thrilled about it.",
      "A black bottle, a cold shiver, and %n is the most catchable thing on the farm for the next two hours."],
    tentaclemusk: [
      "%n dabs Tentacle Musk on their wrists and the insides of their thighs. The pond goes very, very still.",
      "%n uncorks the Tentacle Musk. It smells like the sea at night, and something in the deep water turns toward 'em.",
      "A drop of Tentacle Musk behind each ear, and every trough on the farm ripples once, all at the same time.",
      "%n smooths the Tentacle Musk down over their belly. The water's going to come lookin' for 'em now."],
    goblinmusk: [
      "%n dabs Goblin Musk behind their ears. Every hedge on the farm starts giggling.",
      "%n uncorks the Goblin Musk and the whole yard wrinkles its nose. Somewhere, a goblin drops what it's stealin' and turns round.",
      "A dab of Goblin Musk on each wrist and one between the legs, and %n is the shiniest thing a goblin's ever smelled.",
      "%n rubs Goblin Musk into their thighs. Little feet start pattering in the long grass."],
    wolfscent: [
      "%n rubs Wolf Scent into the hollow of their throat. From the treeline, something answers with a low, interested growl.",
      "%n dabs Wolf Scent between their legs, and the dogs in the yard all lift their heads at once.",
      "One whiff of Wolf Scent on %n and the whole pack knows exactly where to find 'em, and what they're for.",
      "%n smells like a bitch in season now. Somewhere past the fence, paws start moving."],
    mareheat: [
      "%n smears Mare's Heat up the insides of their thighs. In the stud barn, a stallion screams and kicks his door.",
      "The Mare's Heat goes on thick and sweet. %n shifts their weight like a mare in the paddock, and the big horse starts pacin'.",
      "%n strokes on the Mare's Heat and every stallion on the place suddenly has one thing on his mind.",
      "A dab of Mare's Heat on %n's rump, and the stud barn sounds like it's about to come apart."],
    sowslop: [
      "%n slathers on Sow's Slop and wrinkles their nose. From the sty comes a squeal and the crash of a gate post.",
      "%n rubs Sow's Slop into their belly and backside. The boar's already grunting their name, more or less.",
      "Sow's Slop, smeared on thick. %n smells like a sow in season and the whole sty knows it.",
      "%n reeks of the sty now. The boar's rails creak, then groan, then give a little."],
    hiccup: [
      "%n drinks a Hiccup Fizz. *Hic.* They try to look dignified. *Hic.*",
      "The Hiccup Fizz goes down bubbly, and %n hiccups so hard their whole body jumps.",
      "%n downs a Hiccup Fizz and hiccups through an apology. Then hiccups through the apology for the hiccup.",
      "One Hiccup Fizz later, %n can't get through a sentence. Or a moan. *Hic.*"],
    feather: [
      "%n drinks a Featherlight and shrieks with laughter when their own sleeve brushes their arm.",
      "The Featherlight goes down, and suddenly %n can't stand still: every breeze, every touch, sets them giggling.",
      "%n swallows a Featherlight and dissolves into helpless giggles the second anybody breathes near their neck.",
      "One Featherlight, and %n squirms at the brush of their own hair. Anyone with a feather is very much invited."],
    wrongbarn: [
      "%n drinks the Wrong Barn and sniffs the air like a different animal entirely. They look baffled.",
      "One sip of Wrong Barn and %n's noises change. Their stance changes. Even the way they flick their ears.",
      "%n swallows the Wrong Barn and wanders toward the wrong pen without thinking. Old habits, new animal.",
      "The Wrong Barn takes hold, and %n is suddenly very confused about what they're meant to be eating."],
    bigbritches: [
      "%n drinks a Big Britches and something on 'em swells two sizes on the spot. They look down, wide-eyed.",
      "The Big Britches hits, and %n has to adjust everything they're wearing. Quickly.",
      "%n finishes a Big Britches and gasps as a whole lot more of 'em suddenly needs room.",
      "One Big Britches later, %n is very much bigger somewhere, and very aware of it."],
    shrink: [
      "%n drinks a Shrinking Violet and a part of 'em goes small and shy and sensitive.",
      "The Shrinking Violet takes hold, and %n looks down at somethin' that's suddenly a good deal smaller.",
      "%n swallows a Shrinking Violet and blushes. Smaller, tighter, and somehow more sensitive than ever.",
      "One cool sip of Shrinking Violet, and %n is a size or two less of somethin' important for an hour."],
    echo: [
      "%n drinks an Echo Elixir. Somewhere, the farm girl smiles and starts listening very closely.",
      "The Echo Elixir goes down, and everything %n says for a while might come back around. Sweetly.",
      "%n swallows an Echo Elixir and says somethin' silly. The farm girl tucks it away for later.",
      "One Echo Elixir, and %n's words are on loan to the farm girl for the next twenty minutes."],
    heatmist: [
      "%n breathes in the Heat Mist and goes flushed and slick and squirmy all at once.",
      "One puff of Heat Mist, and %n's scent changes. Every stud in the yard lifts his head.",
      "%n inhales the Heat Mist, shivers, and starts rubbing against the nearest post like a mare in season.",
      "The Heat Mist settles on %n like a warm hand, and they come into heat right there in front of everybody."],
  };
  const potionDef = (id) => POTIONS.find(p => p.id === String(id || "").toLowerCase()) || null;
  function potionOn(mn, id){ const r = rec(mn), f = r && r.fx && r.fx[id]; return !!(f && f.until > Date.now()); }
  // how many bottles deep they are (0 = none): another bottle while one's workin' stacks, up to CFG.POTION_STACK_MAX
  function potionX(mn, id){ const r = rec(mn), f = r && r.fx && r.fx[id]; return f && f.until > Date.now() ? Math.max(1, f.x || 1) : 0; }
  function activePotions(mn){ const r = rec(mn), now = Date.now(); return r && r.fx ? Object.entries(r.fx).filter(([, f]) => f.until > now).map(([id, f]) => Object.assign({ id }, f)) : []; }

  // why this person can't have this potion right now (null = they can)
  function potionRefusal(mn, id, by){
    const P = potionDef(id), r = rec(mn);
    if (!P) return "There's no potion called that, sugar. ?potions lists 'em.";
    if (!r || !r.roles || !r.roles.length) return plainName(mn)+" isn't on the books, sugar.";
    if (by !== mn && !r.potionsOn) return plainName(mn)+" hasn't said ?potions on, so nobody else can give 'em one.";
    const lim = String(r.limits || "");
    if (/\bpotion/i.test(lim) || (P.limit && P.limit.test(lim))) return plainName(mn)+"'s limits rule out a "+P.name+", sugar.";
    if (P.needs){ const w = P.needs(mn); if (w) return plainName(mn)+": "+w; }   // (the tithes: 10ul-tithes.js)
    if (P.needsPanel && !hasCompanion(mn)) return "A "+P.name+" only works with the Companion, and "+(by === mn ? "you don't" : plainName(mn)+" doesn't")+" have it runnin'.";
    if ((P.id === "clover" || P.id === "heavy") && !makesMilk(mn) && !makesSemen(mn)) return plainName(mn)+" isn't makin' milk or seed, so it'd do nothin'.";
    if ((P.id === "bigbritches" || P.id === "shrink") && !potionPart(mn)) return plainName(mn)+" hasn't got anything that size changes on, sugar.";
    if (P.id === "wrongbarn" && !r.species) return plainName(mn)+" isn't an animal yet, so there's no barn to get wrong.";
    return null;
  }
  function potionPart(mn){
    const have = (typeof bodyParts === "function" ? bodyParts(mn) : []).filter(k => ["udder","penis","testes","butt"].includes(k) && CFG.SIZES[k]);
    return have.length ? have[Math.floor(Math.random()*have.length)] : null;
  }

  function givePotion(mn, id, by, how){
    const P = potionDef(id), r = rec(mn);
    if (!P || !r) return false;
    r.fx = r.fx || {};
    const now = Date.now(), was = r.fx[id] && r.fx[id].until > now;
    const f = was ? r.fx[id] : { at: now, by: by || 0, n: 0 };
    // a second bottle on top of the first: stronger (where it can be) and longer, not just topped up
    const maxX = P.stack || CFG.POTION_STACK_MAX;   // (the Danger Draught goes four deep)
    const stacked = was && (f.x || 1) < maxX;
    if (was){ f.x = Math.min(maxX, (f.x || 1) + 1); f.until = Math.min(now + P.mins*60000*maxX, f.until + P.mins*60000); }
    else f.until = now + P.mins*60000;
    r.fx[id] = f;
    if (!was) potionStart(mn, P, f); else potionStack(mn, P, f);
    if (P.kind === "punish") try { corrupt(mn, 1, "potion"); } catch(e){}   // a nasty bottle leaves a little of the farm in them (10y4)
    saveLedger(); audit(by || CFG.BOT_MEMBER, "POTION", mn+" "+id+(how ? " ("+how+")" : ""));
    tell(mn, "🧪 "+P.name+(how ? " ("+how+")" : "")+": "+bodyWords(mn, P.drink)+" "+P.desc+(was ? (stacked ? " That's bottle number "+f.x+" on top of the last: it hits harder and runs longer." : " You're as deep in that one as it goes, so it just runs longer.") : "")+" Your safeword pours it out.");
    // (breathed in off a trap's gas or spray, it wasn't drunk: the trap already told the room, and "drinks the Needy
    // Nectar" after a cloud of pink gas made no sense. Laynie, Oct 20)
    if (onMap(mn) && !/^(gas|spray|from a trap)$/.test(how || "")) emote("🧪 "+tFill(pickFor(mn, "potion-seen:"+P.id, [P.seen].concat(POTION_SEEN[P.id] || [])), mn), mn);
    syncCompanions(true);
    return true;
  }
  // another bottle of the same while it's still workin'
  function potionStack(mn, P, f){
    const p = prodOf(mn), left = f.until - Date.now();
    if (P.id === "clover"){ if (makesMilk(mn)) addBoost(p, "milk", left, 1); if (makesSemen(mn)) addBoost(p, "semen", left, 1); }
    if (P.id === "bitterroot") p.deniedUntil = Math.max(p.deniedUntil || 0, f.until);
    if (P.id === "brood"){ addBoost(p, "eggs", left, 1); addBoost(p, "hyper", left, 1); }
    if (P.id === "heatmist" && p.heat) p.heat.until = Math.max(p.heat.until, f.until);
    if ((P.id === "bigbritches" || P.id === "shrink") && f.part) setSize(mn, f.part, sizeOf(mn, f.part) + (P.id === "shrink" ? -2 : 2), false);
  }
  function potionStart(mn, P, f){
    const p = prodOf(mn), r = rec(mn), now = Date.now();
    if (P.id === "clover"){ if (makesMilk(mn)) addBoost(p, "milk", P.mins*60000, 1); if (makesSemen(mn)) addBoost(p, "semen", P.mins*60000, 1); }
    if (P.id === "bitterroot") p.deniedUntil = Math.max(p.deniedUntil || 0, now + P.mins*60000);
    if (P.id === "brood"){ addBoost(p, "eggs", P.mins*60000, 1); addBoost(p, "hyper", P.mins*60000, 1); }
    if (P.id === "heatmist") startHeat(mn, f.by || CFG.BOT_MEMBER, P.mins/60);
    if (P.id === "wrongbarn"){
      const kinds = Object.keys(CFG.SPECIES).filter(k => k !== "default" && k !== speciesKey(mn));
      const to = kinds[Math.floor(Math.random()*kinds.length)];
      f.was = r.species; f.to = (SHOWN_SPECIES[to] || to); r.species = f.to;
    }
    if (P.id === "bigbritches" || P.id === "shrink"){
      const part = potionPart(mn);
      if (part){ f.part = part; f.was = sizeOf(mn, part); setSize(mn, part, f.was + (P.id === "shrink" ? -2 : 2), false); }
    }
  }
  function endPotion(mn, id, quiet){
    const r = rec(mn), f = r && r.fx && r.fx[id], P = potionDef(id);
    if (!f) return;
    delete r.fx[id];
    const p = prodOf(mn);
    if (id === "bitterroot" && p) p.deniedUntil = Math.min(p.deniedUntil || 0, Date.now());
    if (id === "wrongbarn" && r.species === f.to) r.species = f.was || r.species;
    if ((id === "bigbritches" || id === "shrink") && f.part && f.was) setSize(mn, f.part, f.was, false);
    if (id === "heatmist" && p && p.heat && p.heat.by === f.by) p.heat.until = Math.min(p.heat.until, Date.now());
    if (id === "brood" && p && p.boosts){ p.boosts.eggs = Math.min(p.boosts.eggs || 0, Date.now()); p.boosts.hyper = Math.min(p.boosts.hyper || 0, Date.now()); }
    saveLedger(); syncCompanions(true);
    if (!quiet && P) tell(mn, potionOffLine(mn, id, f) || "🧪 Your "+P.name+" has worn off, sugar.");
  }
  // the safeword: every bottle poured out at once
  function clearPotions(mn){ const r = rec(mn); if (!r || !r.fx) return; for (const id of Object.keys(r.fx)) endPotion(mn, id, true); }

  // ── what the bottles do while they last (every heartbeat) ──
  const FX_LINES = {
    musk: [
      "Heads keep turnin' toward %n. Somethin' about the way they smell today has the whole barn restless.",
      "A farmhand walks past %n, stops, and walks past again, slower this time.",
      "%n catches somebody starin'. They don't even pretend they weren't.",
      "The studs in the far pen have gone quiet and still, noses up, every one of 'em pointed at %n.",
      "The farm girl leans close to %n and breathes in. \"Lord, sugar. You're gonna cause a stampede.\""
    ],
    honey: [
      "\"Look at you, standin' so pretty for me. Best little animal on the property.\"",
      "\"Every hand on this farm wants a turn with you today, sugar. Can't say I blame 'em.\"",
      "\"You know what you are? You're a good, good thing, and you look so sweet bein' kept.\"",
      "\"I could watch you all day. Them hips, that face, the way you just take it. Perfect.\"",
      "\"Such a soft, obedient creature. The farm's lucky to have you, and so am I.\"",
      "\"Keep bein' this good and I'll make sure everybody hears about it.\""
    ],
    needy: [
      "The ache doesn't let up. Every shift of your hips makes it worse, and better, and worse.",
      "You catch yourself rubbin' your thighs together and can't make yourself stop.",
      "Every brush of fabric, every breeze through the barn, goes straight between your legs.",
      "You'd beg. You'd beg anybody. The thought won't leave you alone.",
      "It throbs, slow and patient and merciless, like it's got all day."
    ],
    hiccup: [
      "%n lets out a loud *hic*, right in the middle of everything.",
      "*HIC.* %n claps a hand over their mouth. Too late.",
      "%n tries so hard to hold it in that the *hic* comes out as a squeak.",
      "Three little *hics* in a row out of %n. The whole pen is grinnin'."
    ],
    feather: [
      "A stray bit of straw brushes %n's side and they dissolve into helpless giggles.",
      "%n squeaks and twists away from absolutely nothin'. The air tickled 'em.",
      "Somebody breathes near %n's neck and they nearly fall over laughin'."
    ],
    bell: [
      "CLANG. CLANG. Everybody knows exactly where %n is goin'.",
      "%n tries to sneak, and the bell says CLANG anyway.",
      "A brassy CLANG rings out across the yard as %n moves. Subtle as a dinner bell."
    ]
  };
  function fxLine(id, mn){ const a = FX_LINES[id]; const r = rec(mn); return fxFill(pickFresh("fx:"+id+":"+mn, a), mn, r && r.fx && r.fx[id]); }
  function potionTick(){
    const now = Date.now();
    for (const [k, r] of Object.entries(L.people)){
      if (!r.fx) continue;
      const mn = parseInt(k, 10);
      for (const [id, f] of Object.entries(r.fx)){
        if (f.until <= now){ endPotion(mn, id, !charFor(mn)); continue; }
        if (!onMap(mn)) continue;
        const every = (a, b) => { if (!f.next) f.next = now + (a + Math.random()*(b-a))*60000; if (now < f.next) return false; f.next = now + (a + Math.random()*(b-a))*60000; return true; };
        if (id === "musk" && every(5, 9)) emote("💐 "+fxLine("musk", mn), mn);
        if (id === "honey" && every(5, 9)) privateTo(mn, "🍯 The farm girl leans in close to "+plainName(mn)+"'s ear: "+fxLine("honey", mn), "emote");
        if (id === "needy" && every(4, 7)) privateTo(mn, "💗 "+fxLine("needy", mn), "emote");
        if (id === "hiccup" && every(1, 3)) emote(fxLine("hiccup", mn), mn);
        if (id === "feather" && every(2, 4)) emote(fxLine("feather", mn), mn);
        if (id === "clover" && every(4, 7)) emote("🥛 "+fxLine("clover", mn), mn);
        if (id === "golden" && every(5, 8)) privateTo(mn, "✨ "+fxLine("golden", mn), "emote");
        if (id === "heavy" && every(3, 6)) emote("🥛 "+fxLine("heavy", mn), mn);
        if (id === "bitterroot" && every(5, 8)) privateTo(mn, "🌿 "+fxLine("bitterroot", mn), "emote");
        if (id === "wrongbarn" && every(6, 10)) emote(fxLine("wrongbarn", mn), mn);
        if ((id === "bigbritches" || id === "shrink") && every(8, 14)) emote(fxLine(id, mn), mn);
        if (id === "heatmist" && every(4, 6)) emote("🔥 "+fxLine("heatmist", mn), mn);
        if (id === "moo" && every(6, 10)) emote(fxLine("moo", mn), mn);
        if (id === "brood" && every(8, 14)) privateTo(mn, "🥚 "+fxLine("brood", mn), "emote");
        if (id === "bell"){
          const C = charFor(mn), pos = C && C.MapData && C.MapData.Pos;
          if (pos){
            const moved = f.pos && (f.pos.X !== pos.X || f.pos.Y !== pos.Y);
            f.pos = { X: pos.X, Y: pos.Y };
            if (moved && now - (f.rang || 0) > 45000){ f.rang = now; emote("🔔 "+fxLine("bell", mn), mn); }
          }
        }
      }
    }
  }
  // the game said they came: Bitterroot ruins it, Golden Hour makes it glow. "ruined" = don't count it as a real one
  function potionClimax(mn){
    if (potionOn(mn, "bitterroot")){
      const r = rec(mn), p = prodOf(mn);
      if (makesSemen(mn) && p.semen >= 2) p.semen -= Math.min(p.semen, p.semen * 0.2);
      face(mn, "edged", 25);
      emote(pickFresh("bitter", [plainName(mn)+" gets right to the edge and the Bitterroot yanks it away. Ruined, leakin', and not one bit satisfied.",
                                 plainName(mn)+" shudders and it just… fizzles. Bitterroot. They whine like it's the meanest thing that ever happened to 'em.",
                                 "It slips right through "+plainName(mn)+"'s fingers, ruined. The Bitterroot ain't done with 'em yet."]), mn);
      return "ruined";
    }
    if (potionOn(mn, "golden")){
      const f = rec(mn).fx.golden;
      if ((f.n || 0) < 3){ f.n = (f.n || 0) + 1; later(() => earnRibbons(mn, 1, "a Golden Hour orgasm", CFG.BOT_MEMBER), 1500); }
      later(() => privateTo(mn, "✨ The farm girl strokes "+plainName(mn)+"'s hair while they come down. \"There it is. That's my good thing. Look how pretty you are when you let go.\"", "emote"), 2500);
    }
    return null;
  }
  // somethin' they said out loud: Echo Elixir might repeat it, sweetly
  function potionHeard(mn, text, type){
    if (type !== "Chat" || !potionOn(mn, "echo")) return;
    const f = rec(mn).fx.echo, t = String(text).trim(), now = Date.now();
    if ((f.n || 0) >= 2 || now - (f.echoAt || 0) < 180000 || t.length < 4 || t.length > 140 || /^[?!.\-\/(]/.test(t)) return;
    if (Math.random() < 0.5) return;
    f.n = (f.n || 0) + 1; f.echoAt = now; saveLedger();
    later(() => emote("🗣️ The farm girl puts a hand to her heart. \"Did y'all hear that? "+plainName(mn)+" just said, and I quote: '"+t.replace(/[()]/g, "")+"'. Ain't that just the sweetest thing.\"", mn), 2500);
  }
  // Needy Nectar lets up early for somebody who begs nicely
  function potionBegged(mn){
    if (!potionOn(mn, "needy")) return false;
    endPotion(mn, "needy", true);
    privateTo(mn, "💗 The farm girl strokes your cheek. \"Since you asked so sweet.\" The ache finally, finally starts to ease.", "emote");
    return true;
  }
  function potionsText(mn){
    const r = rec(mn), act = activePotions(mn);
    const row = P => "  "+P.id+" · "+P.name+" ("+P.mins+" min) · "+P.desc;
    return "🧪 POTIONS\n"+(act.length ? "\nIN YOU RIGHT NOW\n"+act.map(a => "  "+potionDef(a.id).name+" · "+Math.ceil((a.until - Date.now())/60000)+" min left").join("\n")+"\n" : "")+
      "\nREWARDS\n"+POTIONS.filter(p => p.kind === "reward").map(row).join("\n")+
      "\n\nPUNISHMENTS\n"+POTIONS.filter(p => p.kind === "punish").map(row).join("\n")+
      "\n\nJUST BECAUSE\n"+POTIONS.filter(p => p.kind === "silly").map(row).join("\n")+
      "\n\nGifts from others: "+(r && r.potionsOn ? "ON" : "off")+" (?potions on|off). Buy one: ?buy <potion>. Your safeword pours every one out.";
  }

  // ── DARES ─────────────────────────────────────────────────
  const DARES = [
    { t: "Moo out loud every time somebody says your name, for the next ten minutes." },
    { t: "Crawl to the feed trough on all fours and eat a mouthful like a good animal." },
    { t: "Find a farmhand and ask them, politely, to check how full you are. With their hands." },
    { t: "Kneel by the gate and greet the next person who walks in with your best animal noise." },
    { t: "Tell the room, out loud, what you'd let the farm do to you if nobody was watchin'." },
    { t: "Present yourself at the milkin' stall and stay there till you've given somethin'." },
    { t: "Ask somebody to clip a lead on you and walk you one full lap of the yard." },
    { t: "Describe, in an emote, exactly how you'd look locked in the stocks right now." },
    { t: "Thank a member of staff for keepin' you, sincerely, in front of everyone." },
    { t: "Let the next person who asks give you one swat. Say thank you after." },
    { t: "Strike your prettiest pose by the barn door and hold it for two whole minutes." },
    { t: "Beg the farm girl for a treat, and mean it. (?beg, with the proper words)" },
    { t: "Go tell somebody you've never talked to that they smell nice. Sniff first.", reckless: true },
    { t: "Ask a stud, out loud, if they'd like to breed you today. (Takin' no for an answer is part of the dare.)", reckless: true },
    { t: "Walk into the middle of the yard, stretch real slow, and let everybody look.", reckless: true },
    { t: "Ask a hand to milk you by hand, right where you're standin'.", reckless: true },
    { t: "Climb into the stocks yourself and ask somebody to latch you in.", reckless: true },
    { t: "Pick somebody and tell 'em one dirty thing you've thought about 'em today.", reckless: true },
    { t: "Go stand in a glory stall for five minutes. See what happens.", reckless: true },
    { t: "Announce to the whole room that you're a needy little thing and could use some attention.", reckless: true },
  ];
  function giveDare(mn, by, reckless, text){
    const r = rec(mn);
    if (!r) return false;
    const pool = DARES.filter(d => !!d.reckless === !!reckless);
    const lim = String(r.limits || "").toLowerCase();
    const ok = pool.filter(d => !d.t.toLowerCase().split(/[^a-z]+/).some(w => w.length >= 5 && lim.includes(w)));
    const d = text ? { t: text, reckless: !!reckless } : ok[Math.floor(Math.random()*ok.length)];
    if (!d) return false;
    r.dare = { text: d.t, reckless: !!d.reckless, until: Date.now() + CFG.DARE_MIN*60000, by: by || CFG.BOT_MEMBER };
    saveLedger(); audit(by || CFG.BOT_MEMBER, "DARE", mn+" "+d.t.slice(0, 50)); syncCompanions(true);
    tell(mn, "🎲 "+(d.reckless ? "A RECKLESS DARE" : "A DARE")+", sugar: "+d.t+"\nYou've got "+CFG.DARE_MIN+" minutes. ?dared when it's done (on your honor), ?dare skip if you chicken out.");
    if (onMap(mn)) emote("🎲 The farm girl slips "+plainName(mn)+" a folded card with a wicked little grin. "+(d.reckless ? "That one's a reckless dare. Y'all might want to watch." : "A dare."), mn);
    return true;
  }
  function dareTick(){
    const now = Date.now();
    for (const [k, r] of Object.entries(L.people)){
      if (!r.dare || r.dare.until > now) continue;
      const mn = parseInt(k, 10);
      r.dare = null; saveLedger();
      const took = fineRibbons(mn, 1, "a dare left undone", CFG.BOT_MEMBER);
      tell(mn, "🎲 Time's up on your dare, sugar, and you didn't say ?dared."+(took ? " That's a ribbon off you." : "")+" Chicken. 🐔");
    }
  }
  function dareCommand(cmd, sender, args, R){
    const r = rec(sender), sub = String(args[0] || "").toLowerCase();
    if (cmd === "dares"){
      if (!r || !r.roles || !r.roles.length){ R("Dares are for folks on the books, sugar."); return; }
      if (/^(on|off)$/.test(sub)){ r.daresOn = sub === "on"; saveLedger(); syncCompanions(true); R(r.daresOn ? "🎲 Dares ON. Staff and the wheel can hand you one now. ?dares off any time." : "🎲 Dares off. Nobody can hand you one."); return; }
      R("🎲 Dares are "+(r.daresOn ? "ON" : "off")+" for you, sugar. ?dares on|off."+(r.dare ? "\nYour dare: "+r.dare.text : "")); return;
    }
    if (cmd === "dared"){
      if (!r || !r.dare){ R("You haven't got a dare right now, sugar."); return; }
      const d = r.dare; r.dare = null; saveLedger(); syncCompanions(true);
      earnRibbons(sender, d.reckless ? CFG.DARE_RIBBONS_RECKLESS : CFG.DARE_RIBBONS, d.reckless ? "doin' a reckless dare" : "doin' your dare", CFG.BOT_MEMBER);
      if (onMap(sender)) emote("🎲 "+plainName(sender)+" did their dare"+(d.reckless ? ", the reckless one, too" : "")+". The farm girl ties a ribbon on 'em. \"Brave little thing.\"", sender);
      R("🎲 Done and dusted. Good animal.");
      return;
    }
    // ?dare · ?dare skip · staff: ?dare <who> [reckless] [text]
    if (sub === "skip" || sub === "chicken"){
      if (!r || !r.dare){ R("No dare to skip, sugar."); return; }
      r.dare = null; saveLedger(); syncCompanions(true);
      const took = fineRibbons(sender, 1, "chickenin' out of a dare", CFG.BOT_MEMBER);
      R("🐔 Bawk bawk. Dare's gone"+(took ? ", and so's a ribbon" : "")+".");
      return;
    }
    if (!sub){ R(r && r.dare ? "🎲 Your dare: "+r.dare.text+"\n"+Math.max(0, Math.ceil((r.dare.until - Date.now())/60000))+" minutes left. ?dared when it's done · ?dare skip" : "🎲 No dare right now, sugar. ?dares on lets staff and the wheel give you one."); return; }
    if (!isStaff(sender)){ R("Only staff hand out dares, sugar. The wheel does too."); return; }
    const t = resolveTarget(args[0]), tr = t && rec(t);
    if (!tr){ R("Dare who, sugar? ?dare <who> [reckless] [your own dare]"); return; }
    if (!tr.daresOn){ R(plainName(t)+" hasn't said ?dares on, sugar."); return; }
    const reckless = /^reckless$/i.test(args[1] || "");
    const own = args.slice(reckless ? 2 : 1).join(" ").trim();
    giveDare(t, sender, reckless, own || null);
    R("🎲 Dared "+plainName(t)+".");
  }

  // ── THE PEN ───────────────────────────────────────────────
  function penSpots(){ return Object.entries(L.spots || {}).filter(([n]) => n === "pen" || /^pens?-/.test(n) || n === "pens"); }
  function milkSpots(){ return Object.entries(L.spots || {}).filter(([n]) => n.startsWith("milking")); }
  function penIn(mn, mins, by, where){
    const r = rec(mn); if (!r) return null;
    let spots = where === "milking" ? milkSpots() : penSpots();
    if (where && where !== "milking") spots = Object.entries(L.spots || {}).filter(([n]) => n === where);
    if (!spots.length) return null;
    const taken = (s) => (W.ChatRoomCharacter || []).some(c => c.MemberNumber !== mn && c.MapData && c.MapData.Pos && c.MapData.Pos.X === s.X && c.MapData.Pos.Y === s.Y);
    const pick = spots.find(([, s]) => !taken(s)) || spots[0];
    const [name, s] = pick;
    r.penned = { until: Date.now() + mins*60000, X: s.X, Y: s.Y, name, by: by || CFG.BOT_MEMBER };
    saveLedger(); audit(by || CFG.BOT_MEMBER, "PEN", mn+" "+name+" "+mins+"m");
    if (onMap(mn)) teleport(mn, { X: s.X, Y: s.Y }, true);
    tell(mn, (where === "milking" ? "🥛 Strapped into the milkin' stall" : "🚧 Penned up at "+name)+" for "+mins+" minutes, sugar. Wander off and I'll fetch you right back. Your safeword opens the gate.");
    return name;
  }
  function unpen(mn, quiet){
    const r = rec(mn); if (!r || !r.penned) return false;
    r.penned = null; saveLedger();
    if (!quiet) tell(mn, "🚧 The gate swings open, sugar. You're free to go.");
    return true;
  }
  function penTick(){
    const now = Date.now();
    for (const [k, r] of Object.entries(L.people)){
      if (!r.penned) continue;
      const mn = parseInt(k, 10);
      if (r.penned.until <= now){ unpen(mn, !charFor(mn)); continue; }
      const C = charFor(mn), pos = C && C.MapData && C.MapData.Pos;
      if (!pos || pos.X < 0) continue;
      if (Math.max(Math.abs(pos.X - r.penned.X), Math.abs(pos.Y - r.penned.Y)) <= 2) continue;
      if (now - (r.penned.pullAt || 0) < 30000) continue;
      r.penned.pullAt = now; saveLedger();
      teleport(mn, { X: r.penned.X, Y: r.penned.Y }, true);
      emote("🚧 "+pickFresh("penback", ["The farm girl catches "+plainName(mn)+" by the collar and walks 'em right back to the pen. \"Nice try, sugar.\"",
        plainName(mn)+" makes it three steps before a farmhand steers 'em back through the gate.",
        "\"And where do you think you're goin'?\" The farm girl tuts and herds "+plainName(mn)+" back where they belong."]), mn);
    }
  }
  function penCommand(cmd, sender, args, R){
    if (cmd === "unpen"){
      const t = resolveTarget(args[0]);
      if (!t || !unpen(t)){ R("They ain't penned, hon. ?unpen <who>"); return; }
      audit(sender, "UNPEN", String(t)); R("🚧 Let "+plainName(t)+" out of the pen."); return;
    }
    const t = resolveTarget(args[0]);
    if (!t || !rec(t)){ R("Here's how, sugar: ?pen <who> [minutes, 5-240] [milking or a spot name]. Pen spots: ?spot set pen (and pen-2, pen-3…). For example: ?pen Bessie 30 · ?pen Bessie 20 milking"); return; }
    const mins = Math.max(5, Math.min(240, parseInt(args[1], 10) || 30));
    const where = args[2] ? String(args[2]).toLowerCase() : null;
    const name = penIn(t, mins, sender, where);
    if (!name){ R(where === "milking" ? "No milkin' stalls are set up, sugar (?spot set milking1)." : "There's no pen spot yet, sugar. Stand in the pen and say ?spot set pen."); return; }
    R("🚧 "+plainName(t)+" is penned at "+name+" for "+mins+" minutes.");
  }

  // ── ?potions, ?potion give|end ────────────────────────────
  function potionCommand(cmd, sender, args, R){
    const r = rec(sender), sub = String(args[0] || "").toLowerCase();
    if (/^(on|off)$/.test(sub)){
      if (!r || !r.roles || !r.roles.length){ R("Potions are for folks on the books, sugar."); return; }
      r.potionsOn = sub === "on"; saveLedger(); syncCompanions(true);
      R(r.potionsOn ? "🧪 Potions ON: staff, the wheel, and gifts (you'll be asked) can give you one now. Your limits still rule some out. ?potions off any time." : "🧪 Potions off. Only ones you buy yourself.");
      return;
    }
    if (sub === "give"){
      if (!isStaff(sender)){ R("Only staff hand out potions, sugar. Gift one with ?buy <potion> for <who>."); return; }
      const t = resolveTarget(args[1]), P = potionDef(args[2]);
      if (!t || !P){ R("?potion give <who> <potion>, like ?potion give Bessie hiccup. ?potions lists 'em."); return; }
      const why = potionRefusal(t, P.id, sender);
      if (why){ R(why); return; }
      givePotion(t, P.id, sender, "from "+plainName(sender));
      R("🧪 "+plainName(t)+" drank a "+P.name+".");
      return;
    }
    if (sub === "end" || sub === "clear"){
      const t = args[1] ? resolveTarget(args[1]) : sender;
      if (t !== sender && !isStaff(sender)){ R("Only staff pour out somebody else's, sugar."); return; }
      if (!t || !activePotions(t).length){ R("Nothin' to pour out, sugar."); return; }
      if (t === sender && !isStaff(sender)){ R("No backin' out of a potion, sugar. It wears off when it wears off (your safeword pours 'em out if you need it)."); return; }
      clearPotions(t); R("🧪 Poured out "+plainName(t)+"'s potions."); tell(t, "🧪 Staff poured out your potions, sugar.");
      return;
    }
    R(potionsText(sender));
  }
