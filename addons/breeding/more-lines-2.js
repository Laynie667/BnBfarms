/* WHAT'S IN THIS FILE (breeding/more-lines-2.js)
   The Oct 15 batch for the breeding add-on: more lines for every pool, written to fit the body (tags, see
   _lib/connect.js) and the species. index.js pushes them in.
   %name% them · %by% the midwife or the other one · %litter% "the calf", "the pups", "the little ones" (their kind, and
   how many) · %Litter% the same with a capital · %eatin% "two" or "a whole litter" · %a% what they are (cow, mare, sow…)
   · %young% one of their young (calf, foal, pup…)
*/
export const MORE2 = {
  STAGE_YOU: {
    showing: [
      "🤰 Your belly's rounder this mornin', %name%, and your clothes know it before you do.",
      "🤰 There's a little swell under your hand when you rub your belly now, %name%. Somethin' took.",
      "🤰 You're showin', %name%. Folks are goin' to start pattin' your belly without askin'.",
      "🤰 Your belly's gone soft and round and proud, %name%. Everybody can see what got put in you.",
    ],
    heavy: [
      "🤰 You're heavy now, %name%. Gettin' up takes two tries, and your belly gets there first.",
      "🤰 You feel %litter% kick when you lie down and kick again when you stand up, %name%. You're big as a barrel.",
      "🤰 Your belly's tight as a drum, %name%, and you walk with your hands on your back to hold it up.",
      "🤰 You're carryin' heavy, %name%. Every step you feel %litter% shift and settle.",
    ],
    nesting: [
      "🤰 You can't sit still, %name%. You want straw, and a corner, and somebody to stroke your back.",
      "🤰 Your belly's dropped low, %name%. It won't be long now, and every bit of you knows it.",
      "🤰 You keep fussin' with the straw, %name%, pushin' it into a nest without meanin' to.",
      "🤰 Everything aches and everything's ready, %name%. Find your nest, sugar.",
    ],
  },
  STAGE_ROOM: {
    showing: [
      "%name% has a round little belly now, and keeps restin' a hand on it when they think nobody's lookin'.",
      "The curve of %name%'s belly has gone from maybe to certainly. They're carryin'.",
      "{t}%name%'s belly has started to swell, and their tits have gone fuller with it.",
      "%name% turns sideways in the light, and there it is: bred and showin'.",
    ],
    heavy: [
      "%name% lowers themselves onto a hay bale with a grunt, belly first, heavy as a harvest.",
      "%name%'s belly is huge and high, and it rolls now and then as somethin' inside shifts.",
      "{t}%name%'s tits are heavy and full to match their belly, and they leak a little when they stretch.",
      "%name% waddles across the barn, one hand on their back and their belly leadin' the way.",
    ],
    nesting: [
      "%name% has made a nest of straw in the corner and keeps fluffin' it, pantin' between goes.",
      "%name% circles and circles before lyin' down, belly low and tight, makin' little grunts.",
      "%name% is restless as any %a% about to drop, pacin' and nestin' and pacin' again.",
      "%name% can't settle. They lie down, get up, scratch at the straw, lie down. It's nearly time.",
    ],
  },
  CRAVINGS: [
    "You want somethin' cold and somethin' sweet, %name%, and you want it right now.",
    "You keep thinkin' about warm milk, a whole pail of it, %name%.",
    "You'd let anybody rub your belly right now, %name%, and you'd purr for it.",
    "{v}Your pussy's swollen and achin' and wantin' attention, %name%. Bein' bred does that.",
    "{c}You're hard more often than not, %name%, and it isn't helpin' your temper.",
    "{t}Your tits ache, %name%. You want somebody's mouth on them, drinkin' the ache away.",
    "{t}Your nipples are so sore your top hurts, %name%. You'd rather go without.",
    "You're hungry, %name%. Not peckish: hungry, like you could eat a whole trough.",
    "Salt. You want salt, %name%. Lick it off somebody if you have to.",
    "You want to be filled again, %name%, even though you're already full of %litter%. Greedy %a%.",
    "You'd give a ribbon for a nap in warm straw with somebody's arms round you, %name%.",
    "You're eatin' for %eatin%, %name%, and your belly won't let you forget it.",
  ],
  KICKS: [
    "Somethin' inside %name% kicks hard enough to make the hand on their belly jump.",
    "%name% stops mid-step, both hands on their belly, while whatever's in there has a good long wriggle.",
    "A little bump pushes out of %name%'s belly, round as a knee, and slides away again.",
    "%name% laughs and winces at once. That one got them right under the ribs.",
    "%name%'s belly rolls like a sack of kittens, and they sit down quick.",
    "Anybody watchin' %name% sees their belly twitch and bulge, and %name% sighs and rubs it.",
    "%name% gasps. That kick landed low, and their knees go a bit weak.",
    "{t}A hard kick, and %name% leaks a little from both nipples. They flush and pretend nobody saw.",
  ],
  MIDWIFE: [
    "%by% kneels in the straw with %name%, a hand low on their belly, breathin' with them through the next wave.",
    "%by% rubs slow circles into the small of %name%'s back and murmurs, \"That's it. Nearly. Nearly.\"",
    "%by% wipes %name%'s face with a cool cloth and holds their hand through it.",
    "{v}%by% checks between %name%'s thighs and grins. \"Not long now, sweet thing. I can see the way it's goin'.\"",
    "{nv}%by% presses on %name%'s belly with both palms, gentle and firm, and talks them through it.",
    "%by% props %name% up on a hay bale and stays right beside them, steady as a fence post.",
  ],
  RUTTY: [
    "%name%'s head comes up and their nostrils flare. Somebody near here is in heat, and %name% knows it in their balls.",
    "%name% shifts on their feet, cock thickenin', breathin' in that heavy, sweet smell.",
    "The heat-smell hits %name% and their whole body goes tight and restless.",
    "%name% swallows hard. Somebody close by is ripe, and every bit of them wants to mount.",
    "%name%'s cock throbs and leaks. They'd follow that smell anywhere.",
    "%name% paces, snortin', unable to settle with that smell on the air.",
  ],
  BRED_MARKS: {
    3: ["%name%'s third breedin' this season goes on the board in red chalk. The farm girl underlines it.",
        "Three. %name% gets a ribbon on their gate and a wink from the farm girl."],
    5: ["Five times bred. %name%'s gate is lookin' festive, all ribbons.",
        "The farm girl rings the barn bell once for %name%'s fifth breedin'. It's tradition now."],
    10: ["Ten breedin's this season. The farm girl climbs a ladder to add %name%'s chalk mark, there's no room left lower down.",
         "Ten. Folks stop by %name%'s gate just to count the ribbons."],
  },
  CALL_STUD: [
    "🔥 %name% is in heat %where% and can't keep still. They're askin' for a stud, sugar, and you're on the list.",
    "🔥 A heat call: %name%, %where%, rump up and achin' with it. You signed up for this.",
    "🔥 %name% is ripe and in heat %where%. Go see to them before somebody else does.",
    "🔥 %name%'s in season %where%, and their call's gone out to every stud on the farm. Including you.",
  ],
  CALLED: [
    "🔥 The call's out to %n% stud%s% on the farm. Find somewhere soft and wait, sugar.",
    "🔥 %n% stud%s% will be catchin' your scent about now. Stay where you are.",
    "🔥 %n% stud%s% heard that. Get comfortable, sugar, and get presentin'.",
  ],
  MATED: [
    "💞 %a% and %b% bump foreheads and that's that: mates for the day. The farm girl chalks a heart on the barn door.",
    "💞 %b% leans into %a%'s side and stays there. Mates till midnight.",
    "💞 %a% and %b% are a pair today. Anybody tryin' to cut in gets a look.",
    "💞 %a% nuzzles %b%'s neck, %b% nuzzles right back, and the whole barn knows they're mates today.",
  ],
  CROWN: [
    "👑 The farm girl pins a big blue rosette on %name%: most bred of the season. Their belly's earned it.",
    "👑 %name% is crowned most bred of the season, and the farm girl hangs the blue rosette right where everybody can see it.",
    "👑 A blue rosette for %name%, most bred of the season, and a round of applause from the barn.",
  ],
  CROWN_COLLAR: [
    "👑 The farm girl pins a big blue rosette on %name%'s collar: most bred of the season. Their belly's earned it.",
    "👑 A blue rosette goes on %name%'s collar, most bred of the season, and the farm girl gives it a proud little tug.",
  ],
  BIRTH_MIDWIFE: [
    "🍼 %by% cleans the newborns and tucks them against %name%, every one of them healthy. Good work, midwife.",
    "🍼 %by% wraps the little ones in clean straw and settles them with %name%. Every one's breathin' fine.",
    "🍼 %by% sits back on their heels, grinnin', as %name% curls round the newborns. A good birth, and a good midwife.",
    "🍼 %by% counts them twice, smiles, and helps %name% get comfortable with them. All healthy.",
  ],
  BOOKED_STUD: [
    "🐂 You've been booked to breed %dam%, sugar. I'll tell you when you're both on the farm.",
    "🐂 There's a bookin' with your name on it: %dam%. I'll let you know when they're here.",
    "🐂 Staff booked you for %dam%. Save some for 'em, sugar. I'll tell you when it's time.",
  ],
  BOOKED_DAM: [
    "🐄 You've been booked with %stud%, sugar. I'll tell you when you're both on the farm.",
    "🐄 %stud% is booked to breed you. I'll let you know when they're here, sugar.",
    "🐄 Staff have booked you with %stud%. I'll come find you when it's time.",
  ],
  TIME_STUD: [
    "🐂 Your bookin' with %dam% is up, sugar. They're here. Head for the breedin' stand.",
    "🐂 %dam% is on the farm, and so are you. That bookin' won't keep itself, sugar.",
    "🐂 It's time: %dam% is here for your bookin'. The stand's waitin'.",
  ],
  TIME_DAM: [
    "🐄 %stud% is here for your bookin', sugar. Head for the breedin' stand.",
    "🐄 %stud%'s on the farm. Time to go get bred, sugar.",
    "🐄 Your stud's arrived: %stud%. The stand's waitin' for you both.",
  ],
};
