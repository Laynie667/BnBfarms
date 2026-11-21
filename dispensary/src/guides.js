/* WHAT'S IN THIS FILE (guides.js)
   THE GUIDES (Laynie, Nov 19: "need to make guides in the dispensary for everything"). One guide for every part of the
   Dispensary, on its own page: what it is, how to do it step by step, crafts to try word for word, and the things worth
   knowin'. Each section on its pages has a 📖 button that opens its guide; /dispensary guide <topic> does too.
   Every "Try it" craft is checked by a test (dispensary-guides.test.cjs): the words on it really are the doses it says.
*/
export const GUIDES = [
  {
    id: "start", icon: "📖", title: "Getting started",
    intro: "The Dispensary doses you from crafted items, anywhere in the club: a needle, a drink, a treat, somethin' you wear. Nothin' takes that you haven't let in, and the way out is always one button.",
    steps: [
      "Pick who can dose you under Who can dose you. It starts at your owner, your lovers and the farm. You can always dose yourself.",
      "Look down the Doses page and switch off anythin' you don't want. Off is a hard no, from anybody.",
      "Pick your clock: While online only counts down while you're logged in. Real time keeps goin' while you're away, and every dose runs longer to make up for it.",
      "Somebody on your list uses a crafted needle, drink or treat on you. The words on it are the dose: the room sees it go in, and it shows under In you now with the time left.",
      "Had enough? The red Safeword button, the game's own safeword, or /dispensary safeword lifts every dose at once.",
    ],
    tips: [
      "Only you need the Dispensary for it to work on you. Whoever holds the needle doesn't.",
      "/dispensary on its own tells you what's in you and who can dose you. /dispensary page opens this page.",
      "Screen touches and dose icons are only seen by people with the Dispensary, and you can switch both off under Touches, on the On your screen page.",
    ],
    see: ["craft", "give", "safety"],
  },
  {
    id: "craft", icon: "🧪", title: "Crafting a dose",
    intro: "A dose is just words on a crafted item. The game's crafting lets you name an item and write it a description, and the Dispensary reads both.",
    steps: [
      "Open the game's Crafting: the Crafting button in the Main Hall, or the crafting button in an item's own menu.",
      "Pick the item. A needle is the Medical Injector. A drink is the Filled Glass or the Mug. A treat is the Chocolate Bar, the Grilled Sausage or the Popcorn. For gear, anythin' you can wear.",
      "Put the dose's words in the name or the description: Statue Serum, Denial Serum, Needy Nectar. Each dose's words are listed with it under Doses. A name only holds 30 letters, so a long recipe goes in the description.",
      "Want it stronger? Add x2 to x5, or double or triple. Denial Serum x3 is three doses' worth of time in one go.",
      "Put more than one dose on it if you like: every dose it names goes in.",
      "Some doses take one more word, for where or what: see Doses that pick.",
      "Save it. It's in your crafted items for good, to use as often as you like.",
    ],
    craft: [
      { name: "Denial Serum x2", note: "four hours with no cummin'", expect: ["denial"] },
      { name: "Marble Statue Serum", note: "half an hour as a marble statue", expect: ["statue:marble"] },
      { name: "Sweet Little Drink", desc: "laced with needy nectar and heat mist", note: "a drink with two doses in it, for a Filled Glass or a Mug", expect: ["needy", "heat"] },
    ],
    tips: [
      "Write it however you like round the words: \"a big fat shot of Denial Serum, x2\" works the same.",
      "The words have to be the dose's own. Heat on its own isn't Heat: heat mist or heat inducer is.",
    ],
    see: ["give", "pick", "gear"],
  },
  {
    id: "give", icon: "💉", title: "Dosing somebody",
    intro: "Hold your crafted item and use it on them, the game's own way. Their Dispensary does the rest.",
    steps: [
      "Put your crafted Medical Injector, glass, mug or treat in your hand. It goes in the hand slot like anythin' you hold.",
      "Click them, pick the spot, and use the game's action: Inject on the neck, arms, breasts, butt, thighs, feet or clit; Sip on the mouth for a glass or mug; Eat on the mouth for a treat.",
      "Their Dispensary reads the words on what's in your hand. If you're on their list and that dose is switched on for them, it takes, and the room sees it.",
      "If it didn't take, they're told why: you're not on their list, or they've switched that dose off. That's their limit, so leave it be.",
    ],
    tips: [
      "They need the Dispensary for it to take. You don't.",
      "You can dose yourself the same way, on your own body.",
      "A needle that also says time-release goes off later instead: see Time-release, tolerance and cravings.",
      "On the farm, with the farm girl in the room, a farm shot is hers to read and book. Their Dispensary still does the feelin'.",
    ],
    see: ["craft", "gear", "timing"],
  },
  {
    id: "gear", icon: "⛓️", title: "Gear that doses",
    intro: "Crafted gear doses whoever wears it, when its words name a dose and say how. A gag, a collar, a plug, piercings, a harness: anythin' worn.",
    steps: [
      "Drip: drip, IV, laced, coated, soaked, infused or seeping. It keeps the dose in them the whole time it's on, and it wears off soon after it comes off.",
      "Injector: injector, auto-inject, dosing, dispenser or pump. A fresh dose every 30 minutes while it's on. Write every 10 minutes, or any number, to set your own.",
      "Triggers: on climax, when kissed, when touched or when spanked. A dose each time it happens, at most every two minutes.",
      "Roulette: roulette or mystery dose. A different dose every time, picked from the ones they allow. It works on needles and drinks too.",
      "Lip gloss: lip gloss, lipstick, lip balm or lip stain with a dose on it, worn by you. Whoever you kiss gets the dose.",
    ],
    craft: [
      { name: "Drip Gag", desc: "an IV drip of denial serum", note: "kept denied as long as it's buckled in", expect: ["denial"] },
      { name: "Kiss Me Collar", desc: "sedative when kissed", note: "every kiss makes them drowsier", expect: ["sedative"] },
      { name: "Cherry Lip Gloss", desc: "needy nectar lip gloss", note: "wear it, and whoever you kiss gets needy", expect: ["needy"] },
      { name: "Roulette Plug", desc: "auto-injector, mystery dose every 20 minutes", note: "a surprise every twenty minutes", expect: [] },
    ],
    tips: [
      "For gear it's whoever crafted it that has to be on the wearer's list. The game keeps the crafter's number on the item. Your own crafts always count.",
      "The safeword clears what's in you and rests all your gear for 15 minutes.",
      "LSCG's own soaked and laced gear stays LSCG's.",
    ],
    see: ["craft", "horny", "kits"],
  },
  {
    id: "timing", icon: "⏳", title: "Time-release, tolerance and cravings",
    intro: "Doses that wait, doses that take less the more you have, and doses you start wantin'.",
    steps: [
      "Time-release: a needle or drink that also says time-release, slow-release, delayed or capsule doesn't hit at once. It goes off 5 to 40 minutes later, at a moment nobody knows, and waits for them to be in a room so it's seen. Up to five can wait in somebody.",
      "Tolerance, your switch under How doses take you, on the Doses page: the same dose again within 3 hours takes a fifth less for each one before it, down to two fifths. You're told when it does.",
      "Cravings, your switch too: once you've had six doses in three days, now and then, with nothin' in you, you want another. A note only you see. On the farm the farm girl notices and offers: say ?fix and she sees to it.",
    ],
    craft: [
      { name: "Sedative Capsule", desc: "time-release", note: "goes off somewhere in the next forty minutes", expect: ["sedative"] },
    ],
    tips: [
      "Your safeword, the Purge, and a keyholder lettin' you out all clear the capsules still waitin'.",
      "Only doses from when you switch cravings on count toward them.",
    ],
    see: ["give", "safety"],
  },
  {
    id: "pick", icon: "🎛️", title: "Doses that pick",
    intro: "A few doses take one more word on the bottle, for where they go or what they make you.",
    steps: [
      "Fill-Out: swells your tits, unless it says belly or ass.",
      "Tender: names its spot: nipples, tits, clit, pussy, ass, neck, ears, lips, belly, thighs or feet. With no spot named it goes where you picked under How doses take you.",
      "Statue Serum: stone, unless it says porcelain, gold, latex, marble or bronze. Everybody with the Companion sees you turned.",
      "Animal Tongue: a puppy, kitty, pony, cow, bunny, fox, goat, lamb, piggy, wolf, dragon or rat tongue. Animal tongue on its own makes you your own animal, picked under Touches.",
      "Growth: Udder, Booty, Cock and Balls Growth grow you a size, and it stays (Hip or Rear Growth is the booty too). A Reducing Serum takes a size back off: cock, balls or booty if it says so, tits otherwise.",
      "Ass Growth is the farm's own shot: it opens your ass a size for good, Pussy Gape or Pussy Growth your pussy. A Tightening Balm closes it back up.",
      "Tightening Balm: closes up what it names: nipples, pussy, ass or throat. Virgin balm, or a balm for every hole, does them all.",
      "Purge: lifts every dose in you, there and then.",
      "Kit: puts an outfit on them. See Kits.",
    ],
    craft: [
      { name: "Fill-Out, belly x2", note: "a full round belly for an hour", expect: ["fillout:belly"] },
      { name: "Gilding Serum", note: "half an hour as a gold statue", expect: ["statue:gold"] },
      { name: "Kitty Tongue Tonic", note: "talkin' like a kitty for half an hour", expect: ["tongue:kitty"] },
      { name: "Tender Drops", desc: "for the clit", note: "every touch there counts three times over", expect: ["tender:clit"] },
      { name: "Pussy Tightener", note: "snug again, right away", expect: ["balm"] },
    ],
    see: ["craft", "holes", "nipples"],
  },
  {
    id: "kits", icon: "👗", title: "Kits",
    intro: "A kit is a saved outfit a dose puts on somebody, a piece at a time, held on while the dose lasts.",
    steps: [
      "To be dressed by kits, switch on Kits can dress me under Kits, on the Gear and kits page. It's off to start. Pick clothes, restraints or both, and how fast it goes on.",
      "To make a kit, put the outfit on yourself and type /dispensary kit save <name>. You can keep eight. An outfit you've saved in LSCG works too, by its name.",
      "Craft a dose that says Kit: <name> on a needle, a drink or gear.",
      "Dose somebody with it while you're in the room. Their Dispensary asks yours for the outfit, and it creeps onto them, held on for half an hour a dose. Anythin' they take off creeps back on.",
      "When it's over, by its time, a safeword or a Purge, the kit comes off and their own outfit slips back on.",
    ],
    craft: [
      { name: "Kit: maid", desc: "a needle full of frills", note: "your saved maid outfit goes on them", expect: ["kit"] },
      { name: "Kit: latex pet", desc: "it creeps on, shiny and tight", note: "the latex in its name gives it the livin' gear lines as it goes on", expect: ["kit"] },
    ],
    tips: [
      "It never touches their body, nothin' they've blocked, nothin' the room won't allow, and never goes over somethin' locked on them.",
      "The pieces keep their crafts: a horny plug in a kit is horny, a dilator drip in one keeps them open.",
      "Words on the bottle flavour the lines: livin', latex, tentacle or slime; demonic, cursed or sigils; hypno, trance or conditioning.",
      "/dispensary kit stop takes a kit off you early, unless you're locked in hardcore. /dispensary kit shows yours and all the settings.",
    ],
    see: ["give", "gear", "horny"],
  },
  {
    id: "horny", icon: "🔥", title: "Horny gear",
    intro: "Gear with a mind of its own. It uses whoever wears it, all by itself.",
    steps: [
      "Craft gear that says horny or hungry in its name or description: a plug, a dildo, a gag, nipple gear, a crotch rope or belt. Insatiable or ravenous makes it busier and rougher.",
      "Put it on somebody, or wear it yourself. Every six to ten minutes it has its way with them. Insatiable gear goes every two to four.",
      "Where it's worn says what it does: in a pussy or ass it thrusts, on nipples it suckles and tugs, in a mouth it fucks their throat, at the crotch or waist it grinds.",
      "Each time, their arousal goes up a step. Close enough, with nothin' denyin' them, it makes them cum.",
      "Add breeding or seeding to it: when they cum, it cums too, and fills them with your seed. Write how much on it, like 300 ml, or it leaves a thick load in whatever hole it's in.",
    ],
    craft: [
      { name: "Hungry Tentacle Plug", note: "thrusts every few minutes", expect: [] },
      { name: "Insatiable Breeding Gag", note: "fucks their throat every couple of minutes, and fills it when they cum", expect: [] },
    ],
    tips: [
      "The wearer's switch: Horny gear can use me, on to start. /dispensary horny on or off.",
      "The crafter has to be on the wearer's list.",
      "A parasite crafted horny is twice as busy, and squirms between feeds.",
      "It rests while they're out of a room, and after a safeword.",
    ],
    see: ["holes", "nipples", "breeding"],
  },
  {
    id: "breeding", icon: "💦", title: "Seed, breedin' and carryin'",
    intro: "Your own seed, in whoever you dose, as much as you like and wherever you say. Theirs to hold, drip, and on the farm, to catch.",
    steps: [
      "Craft a syringe, a baster, a drink or a bit of gear that says it carries seed: Insemination, Seed Syringe, Cum Shot, Breeding Baster, Cum Cocktail, or just filled with my seed. It's always the crafter's own seed, whoever's holdin' it.",
      "Say how much and where, in mL, litres or gallons: 500 ml pussy, 1 L ass, 2 gallons mouth, 50 ml nipples. Every hole fills them all, nipples too while they're open; both holes means pussy and ass.",
      "No hole written, and a needle puts it in their pussy, or their ass if they've no pussy. A drink or a kiss sends all of it down their throat. A hole with no amount gets a thick load.",
      "A belly only holds so much: 200 mL to start, more with a capacity shot on the farm. The rest spills back out, down their thighs. Their tits hold a litre.",
      "A Breeder's Seal is gear that says so: Breeder's Seal, Breeding Seal, Sire's Seal, Seed Lock or Cum Stopper. Worn in their pussy or ass, or as a belt over both, it keeps every drop in, however much, opens only for its maker's seed, and while it's in, only its maker's loads can catch.",
      "Take the seal out and most of what it held gushes out with it.",
      "Off the farm, what's in them drains slowly, faster from a looser hole, and drips down their thighs where the room can see. A plug or a seal holds it in.",
      "Every load goes to the farm girl's books, straight away if she's in the room, or the next time they're in hers. There it can catch, with the crafter as sire: they need ?breedable on, and Fertile. A Sure-Catch Serum makes it take.",
      "Breed me anywhere, your switch under Seed on the Breedin' page, off to start: off the farm, a real cock that cums in you, through the game's own actions, leaves a real load of theirs on your books, and on the farm's, where it can catch. Only from somebody on your list.",
      "A knotted cock ties you: for its minutes you can't step away from them on a map, and the room sees it swell and lock. It never stops you leavin' a room. Theirs knows it's knotted when they run the Dispensary too and the farm's measured their cock.",
      "Keep it in: on all fours, knees spread, or hogtied within five minutes of a load in your pussy or ass, and it gets another chance to take, half again as likely.",
      "Ripe days: Fertile on the farm, two days in every seven you're ripe, achin' for it, and every load takes twice as easy. You feel them anywhere, and now and then the room can tell.",
      "Brood Womb, a farm switch, ?broodwomb on: once you're carryin', every load that lands in you takes too, and makes your litter bigger, up to the farm's hyper sizes.",
      "Carryin' goes with you: the farm tells your Dispensary, and wherever you are you feel it take hold, show and grow heavy, your tits leak, you crave seed, and your drawn belly grows with it.",
      "Your natural heat comes on wherever you are, and studs runnin' the Dispensary catch the scent.",
      "Due away from the farm? Your labour happens right where you are, and anybody who touches your belly is your midwife. A clutch of eggs comes out the same way. The farm girl books them next time you're in her room, and for the hour after a birth you're wide open.",
      "A Quickening Draught takes a day off. A Breeder's Scan, by needle or held while they touch your belly, tells the room what's in you. Twenty litters makes you a Baby Factory.",
    ],
    craft: [
      { name: "Seed Syringe", desc: "500 ml pussy, 1 L ass", note: "a needle: half a litre in their pussy and a litre in their ass, most of it spillin' back out", expect: ["seed"] },
      { name: "Breeding Baster", desc: "2 gallons in every hole", note: "two gallons in every hole they've got", expect: ["seed"] },
      { name: "Cum Cocktail", desc: "my seed, 300 ml", note: "a glass to Sip to them: 300 mL down their throat", expect: ["seed"] },
      { name: "Breeder's Seal", note: "a plug: worn in their pussy or ass, it keeps your seed in and everybody else's out", expect: [] },
      { name: "Hungry Breeding Plug", desc: "150 ml", note: "horny gear that cums with them and leaves 150 mL of yours in them", expect: [] },
      { name: "Quickening Draught x2", note: "two days closer to due, and their belly swells with it", expect: ["quicken"] },
      { name: "Breeder's Scan", note: "a needle, or hold it and touch their belly: the room hears what's in there", expect: ["scan"] },
    ],
    tips: [
      "Add x2 to x5 for that many times as much.",
      "Seed is a dose like any other: whoever holds it and whoever crafted it both have to be on their list, and it has its own switch under Doses.",
      "The farm counts one load from the same crafter every ten minutes. More still fills them, it just isn't another load on the books.",
      "Under Seed on the Breedin' page, and with /dispensary seed: what's in them now, whose it is, and every load they've taken. Let it all out empties what isn't sealed in.",
      "The Womb Mark, in any Farm Ink slot in the wardrobe: a little heart inked in for every litter, it glows hot pink while you're carryin' with a dot for each one in there, and at twenty litters it reads BABY FACTORY.",
    ],
    see: ["horny", "holes", "farm"],
  },
  {
    id: "nipples", icon: "⭕", title: "Nipples",
    intro: "Nipples that open up, take toys and cocks, and learn to stay open.",
    steps: [
      "Open them: a Nipple Dilator dose, wider the stronger it is; anythin' worn on the nipples crafted to say dilator or stretcher, like Dilator Clamps, which hold them open as long as they're on; or nipple leeches.",
      "While they're open, two new actions show on the nipples in the game's action menu: Fuck nipple, for somebody with a cock, and Finger nipple, for anybody, you too.",
      "Toys fit too. The nipple slot has nipple plugs, beads, eggs, dildos, a sound and pump-ups: the game's own toys made for an open nipple. Whoever owns the toy owns its nipple version. A toy in them holds them open.",
      "Or force them: /dispensary nips open leaves yours gapin' right now (1, 2 or 3 after it for how wide), and the Open them up button under Nipples opens them a step wider. /dispensary nips open <who> does it to somebody who lets you dose them.",
      "Held open and used, they train, a step an hour: three hours held wide and they're gapin'. The stretch stays after the dose wears off or the leeches drop.",
      "A load in them wells back out, and it's counted.",
      "On the farm, the traps use them too: a knot tied in a nipple, eggs laid in your tits, tendrils, goblins, the pump, the milkers, the kraken. The milkers open shut ones if the farm's on your list. Put nipples in your farm limits to keep the traps off them.",
      "Close them up with the button under Nipples, /dispensary nips close, or a Tightening Balm.",
    ],
    craft: [
      { name: "Nipple Dilator x2", note: "held open wider, for two hours", expect: ["dilator"] },
      { name: "Dilator Clamps", note: "worn on the nipples: keeps them open the whole time they're clamped on", expect: [] },
    ],
    tips: [
      "Your switch, on the Nipples and holes page: They close up slowly on their own, half a step a day once they've been left be twelve hours. Off, they stay as they're trained.",
      "A locked nipple plug holds them open till whoever holds its key takes it out.",
    ],
    see: ["holes", "parasites", "pick"],
  },
  {
    id: "holes", icon: "🎯", title: "Hole training",
    intro: "Your pussy, ass and throat stretch to what's put in them, and with the right toys they learn to stay that way.",
    steps: [
      "A toy in you stretches you to its size: plugs, dildos, eggs, beads, and gags that go in. Bigger names go bigger: big, thick, huge, XL, monster, horse, colossal.",
      "One size past what you're trained is a good stretch, two aches, three or more hurts. Cruel or sadist on it means it every time.",
      "To train you, a toy has to say so: stretcher, trainer, gaper, dilator or widener, or cruel, or a goal. While it's in, it works you open, faster the bigger it is: a size every 12 hours at one size past you, every 6 at three.",
      "A goal goes on the toy, like goal: gaping in 2 days. Anybody who can dose you can also set one by command: /dispensary train <who> <ass|pussy|throat> <size> in 3 days.",
      "A pump or beads crafted as a trainer grows with you, a little at a time.",
      "Fingers, fists, cocks and toys used on you count too, and a load in a loose hole drips back out.",
      "Ass Growth, Anal Gape or Pussy Gape on a needle opens a hole a size for good, the farm's own shot, up to natural off the farm.",
      "Tighten up with a Tightening Balm that names the hole, or pick your own size under Holes.",
    ],
    craft: [
      { name: "Cruel Training Plug", desc: "goal: gaping in 2 days", note: "a black butt plug that aches and works you to gaping by the day after tomorrow", expect: [] },
      { name: "Throat Trainer Gag", desc: "goal: deep", note: "a dildo gag that teaches a throat to take it deep", expect: [] },
    ],
    tips: [
      "Pussy and ass sizes: tight, snug, slightly gaped, gaped, loose, well-used, gaping, wide open, cavernous, ruined. A throat: gaggy, tight, learnin', eager, practiced, trained, deep, greedy, past gaggin', bottomless.",
      "Your switches, on the Nipples and holes page: They close up slowly on their own, off to start, and Too-big toys can hurt, on to start. Off, a too-big toy only aches.",
      "On the farm's books, the farm girl keeps your numbers, and your Dispensary hands her what happened off the farm next time you're in her room.",
      "/dispensary holes shows all three, and /dispensary train <who> clear lifts a goal.",
    ],
    see: ["nipples", "horny", "pick"],
  },
  {
    id: "parasites", icon: "🐛", title: "Parasites",
    intro: "Crafted critters that latch on and do their own thing. Every kind is yours to switch on, and all are off to start.",
    steps: [
      "Switch on each kind you'll take, under Parasites on the Gear and kits page.",
      "Somebody crafts an item that names one, a gag, a plug, a collar, a harness, anythin', and puts it on you. The crafter has to be on your list.",
      "Most latch on and stay even once the item comes off. The leash vine and the mouthpiece only work while worn.",
      "Name doses on the item too, and that's its strain: what it feeds you. None named, it feeds you the farm's own brew.",
      "Parasite lips: feed you every half hour for 12 hours, leave you cravin' a load, and spread by a kiss.",
      "Livin' latex: drinks every climax and stays as long as it's fed; fed, everythin' feels more.",
      "Milk moss: keeps you leakin', and feeds on every let-down.",
      "The nestling: grows a stage every time you cum, and your belly fills out with it.",
      "The brood mother: lays a tiny one now and then, that goes to whoever you kiss next, if they take parasites.",
      "The leash vine: you can't stray more than a few tiles from whoever crafted it, on a map. It never stops you leavin' a room.",
      "The mouthpiece: its crafter can put words in your mouth.",
      "Nipple leeches: hold your nipples open for a day, wider once they've fed three times.",
    ],
    craft: [
      { name: "Parasite Lips Gag", desc: "needy nectar and heat mist", note: "lips that latch on and feed both", expect: ["needy", "heat"] },
      { name: "Leash Vine Collar", note: "keeps them close to you on a map", expect: [] },
    ],
    tips: [
      "The mouthpiece's crafter types /dispensary mouth <name> <words>. You see the words first: /dispensary say says them, /dispensary nope lets them pass. Or switch them straight out under Parasites.",
      "The safeword and the Purge take every parasite off.",
    ],
    see: ["nipples", "horny", "gear"],
  },
  {
    id: "safety", icon: "🛡️", title: "Your list, your clock, your safeword",
    intro: "The parts that keep it yours.",
    steps: [
      "Who can dose you is a ladder: only me, my owner, then lovers, the farm, your whitelist, your friends, everyone but your blacklist, and everyone. Each step lets in everybody above it.",
      "The farm means the farm girl, the proprietors and the farm's staff.",
      "Each dose has its own switch under Doses. Off is a hard no, from anybody on your list.",
      "While online counts down only while you're here. Real time keeps counting while you're away, and every dose runs longer to make up for it. Hover the clock for how much.",
      "Your safeword lifts every dose, clears the capsules waitin' in you, takes off parasites and kits, and rests your gear for 15 minutes. The game's own safeword and LSCG's do it too.",
    ],
    tips: [
      "Goin' offline is never held against you.",
      "OOC and beepin' the farm are never blocked by anythin' in here.",
      "Outside hardcore, your settings are yours alone. Nobody else changes them.",
    ],
    see: ["start", "hardcore"],
  },
  {
    id: "hardcore", icon: "🔒", title: "Hardcore and keyholders",
    intro: "Lock yourself in. Your keyholders hold your settings and your way out.",
    steps: [
      "Get a keyholder. Your owner always is one; if you're on the farm's books, the proprietors are; and you can add anybody by member number under Keyholders, up to ten.",
      "Under Hardcore, pick how long: 1 to 30 days, or no end date.",
      "Lock me in. Only you can do this, for yourself, after a plain warnin'.",
      "From then you can look at your settings but not change them, and your safeword asks your keyholders to let you out instead of liftin' your doses.",
      "It ends on its date. With no date, it lets go after 30 days without a keyholder checkin' in. Bein' in a room with one counts by itself.",
    ],
    tips: [
      "Your keyholders can check in, let you out with every dose lifted, change who can dose you, your clock and which doses are on, or end it. Every change shows to you, and the last few are listed under Hardcore.",
      "Holdin' somebody's key? Keys you hold shows up on the Hardcore and keys page: Check in, Let out, End hardcore, and Their settings when you're in a room together. Out of the room it goes by beep, which needs you to be friends.",
      "The farm's own ?safeword always works, hardcore or not.",
    ],
    see: ["safety", "start"],
  },
  {
    id: "farm", icon: "🐄", title: "The farm and LSCG",
    intro: "How the Dispensary works alongside B&B Farm and LSCG.",
    steps: [
      "On B&B Farm the farm girl reads farm shots and keeps the books: milk, heat, denial, sentences. Your Dispensary does the feelin', the seein' and the sayin'. Leave the farm on your ladder for her shots to take.",
      "On the farm's books, she keeps your holes too, and gets what happened off the farm next time you're in her room.",
      "Seed is hers to book too: every load, whose it was, and whether it catches.",
      "With LSCG loaded, its sedative, aphrodisiac, mind control, suggestible and antidote are LSCG's own, and LSCG's settings decide those.",
      "Our doses are in LSCG's Drug Enhancements list too: switch them on there as well, and LSCG shows a bar with the time left.",
    ],
    tips: [
      "Suggestible needs LSCG.",
      "Cravin'? With the farm girl in the room, say ?fix.",
    ],
    see: ["start", "holes"],
  },
  {
    id: "commands", icon: "⌨️", title: "Every command",
    intro: "Everythin' you can type, in chat. Most of it's on this page too.",
    steps: [
      "/dispensary: what's in you, and who can dose you.",
      "/dispensary page: opens this page. /dispensary page <which> opens straight on one: doses, gear, holes, seed, hardcore, and the rest. /dispensary guide <topic> opens a guide.",
      "/dispensary safeword: lifts every dose. In hardcore, asks your keyholders to let you out.",
      "/dispensary nips, then close, or heal on or off.",
      "/dispensary holes, then heal on or off, or pain on or off.",
      "/dispensary train <who> <ass|pussy|throat> <size> in 3 days, or by friday. /dispensary train <who> clear lifts a goal. Use me for yourself.",
      "/dispensary kit, then on or off, speed slow, steady, fast or now, what clothes, binds or both, save <name>, del <name>, or stop.",
      "/dispensary horny on or off.",
      "/dispensary seed: what's in you, whose it is, and every load you've taken.",
      "/dispensary mouth <who> <words>: words for your mouthpiece's wearer. /dispensary say or /dispensary nope answers one.",
    ],
    see: ["start"],
  },
];
export const GUIDE_BY = Object.fromEntries(GUIDES.map((g) => [g.id, g]));
// "/dispensary guide holes", "guide hardcore": a topic by its id or a word from its title
export function guideFor(word) {
  const w = String(word || "").toLowerCase().trim();
  if (!w) return null;
  if (GUIDE_BY[w]) return GUIDE_BY[w];
  const ALIAS = { needle: "give", inject: "give", dose: "give", dosing: "give", recipe: "craft", crafting: "craft", drip: "gear", injector: "gear", lipgloss: "gear", gloss: "gear",
    capsule: "timing", tolerance: "timing", cravings: "timing", craving: "timing", statue: "pick", tongue: "pick", fillout: "pick", tender: "pick", balm: "pick", growth: "pick",
    kit: "kits", outfit: "kits", hungry: "horny", seed: "breeding", cum: "breeding", labour: "breeding", labor: "breeding", birth: "breeding", heat: "breeding", ripe: "breeding", knot: "breeding", scan: "breeding", quicken: "breeding", pregnant: "breeding", eggs: "breeding", insemination: "breeding", inseminate: "breeding", seal: "breeding", breed: "breeding", breeder: "breeding", load: "breeding", loads: "breeding", nips: "nipples", nipple: "nipples", hole: "holes", train: "holes", training: "holes", ass: "holes", pussy: "holes", throat: "holes",
    parasite: "parasites", leeches: "parasites", mouthpiece: "parasites", vine: "parasites", safeword: "safety", ladder: "safety", clock: "safety", list: "safety",
    keyholder: "hardcore", keyholders: "hardcore", lscg: "farm", help: "start", command: "commands" };
  if (ALIAS[w]) return GUIDE_BY[ALIAS[w]];
  return GUIDES.find((g) => g.title.toLowerCase().includes(w)) || null;
}
