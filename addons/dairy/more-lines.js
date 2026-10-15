/* WHAT'S IN THIS FILE (dairy/more-lines.js)
   More pieces for the dairy's milking lines (index.js pushes them in), and the bits that fit a line to whoever's being
   milked: their body (tagged lines, see _lib/connect.js), what they're wearin', and the noise their kind makes.
   %n% name · %g% the gear · %c% their cock ("thick horse") · %a% what they are (cow, bull, nanny…) · %call% their noise
*/
export const MORE = {
  PUMP: [
    [ // gentle
      "The pump on %n% sighs and lets go, sighs and lets go, and a slow bead of milk gathers at each nipple",
      "%n%'s pump works so softly it's more of a kiss than a pull, and the milk comes in lazy drips",
      "The cups give %n%'s nipples a patient little suckle, and the bottles fill one drop at a time",
      "%n%'s pump coaxes them like a calf that isn't in any hurry, and they let down slow and warm",
      "{t}The cups hug %n%'s teats and draw on them gently, and a thin white thread runs down each line",
      "{nt}The little cups on %n%'s flat chest pull their nipples long and pink, and a few warm drops come",
      "{fb}The pump suckles %n%'s puffy nipples so gently they squirm, and milk beads up shy and slow",
      "%n%'s pump hums low and easy, barely enough to keep the milk coming, plenty to keep them tingling",
    ],
    [ // steady
      "The pump has found %n%'s rhythm, pull and rest, pull and rest, and the milk answers every time",
      "Twin streams run down the lines from %n% as the pump settles in to work",
      "%n%'s nipples are drawn deep into the cups on every pull, and milk spurts into the bottles in time",
      "The pump milks %n% like the good dairy %a% they are, steady and sure, and the bottles creep up",
      "{t}%n%'s teats stretch into the cups and spring back, stretch and spring back, milk running with each pull",
      "{t}The pump pulls long on %n%'s heavy udder, and the milk lets down in a warm rush",
      "{nt}The pump draws on %n%'s nipples firm and steady, and the milk runs thin and warm down the lines",
      "{fb}%n%'s puffy little nipples are pulled into the cups again and again, and milk runs out of them in thin streams",
    ],
    [ // hard
      "The pump yanks at %n% hard and fast, and milk hits the bottles in hot spurts",
      "%n%'s pump is turned up so high it shudders on its hoses, wringing them out with every pull",
      "Each pull of the pump drags %n%'s nipples long and dark, and they gasp as the milk is hauled out",
      "The pump won't let up on %n%, pull, pull, pull, and milk sprays the inside of the cups white",
      "{t}%n%'s udder bounces with every savage pull, and milk gushes down the lines",
      "{t}The pump drags at %n%'s teats like it means to empty them for good, and the milk comes in floods",
      "{nt}The pump hauls on %n%'s nipples till they're stretched and throbbing, and every pull wrings out a hot spurt",
      "{fb}The pump sucks %n%'s puffy nipples so hard they whimper, and milk squirts into the cups",
    ],
  ],
  ECHO: [
    ["%n%'s %g% purrs along, and milk winds slowly up the hose", "The %g% sips at %n% like it's savouring them", "A gentle hum, a gentle pull: the %g% takes its time with %n%",
     "%n% barely feels the %g% working, just a warm, slow tug and a slow drip into the tank", "The %g%'s hose ticks with every little drop it draws out of %n%", "The %g% coaxes %n% along, soft as a hand"],
    ["The %g% has %n% milking freely, a steady white pulse climbing the hose", "%n%'s %g% works in a long, comfortable rhythm, and the tank sloshes", "The %g% draws on %n% firm and even, and they sigh into it",
     "Milk runs up the %g%'s line from %n% like it's been waiting all day to go", "%n% leans back and lets the %g% do its work, and it works well", "The %g% and %n% have found each other's rhythm, and the tank is filling"],
    ["The %g% hauls at %n% so hard its hoses buck, milk rushing into the tank", "%n% is gasping in the %g%, milk pouring out of them as fast as it can drink", "The %g% is roaring now, and %n% is pouring for it",
     "The %g%'s tank fills so fast it gurgles, %n% flushed and shaking above it", "The %g% wrings %n% out, pull after pull, and milk floods the hose", "%n% can't keep still in the %g%, and it can't keep up with them"],
  ],
  FULL: {
    high: [
      "{t}, their udder still swollen and heavy, nowhere near done", "{t}. Their tits are so full they're hard to the touch",
      "{nt}, their chest still tight and aching, plenty left in them", ". They're nowhere near empty, and every pull is pure relief",
      ", leaking from the other side while they wait their turn",
    ],
    mid: [
      "{t}, their udder softening and lighter now", ". Half drained, and the ache is fading", ", the flow easing from a rush to a steady stream",
      "{nt}, the tightness in their chest easing", "",
    ],
    low: [
      "{t}, their udder soft and nearly spent, the pulls coming up thin", ". There's barely anything left, and the pump hunts for every drop",
      "{nt}, their chest soft and empty, nipples sore", ", the last thin drops coming slow", ". They're drained down near to nothing, and tender with it",
    ],
  },
  PRAISE: [
    " Good %a%. Such a good %a%.", " Look at that yield. The farm's lucky to have you.", " That's a proper milker, that is.", " Sweet thing, giving so much.",
    " The dairy's proud of you, sugar.", " What a good, full %a% you are.", " Every bottle a little ribbon, sweetheart.", " You were made for this, darlin'.",
  ],
  DEGRADE: [
    " %Call% for it, %a%.", " Leaky, greedy little milk %a%.", " That's all you're for, and look how you love it.",
    " Just a set of teats with a %a% attached.", " Udders first, brains a long way second.", " Drip, drip, drip. Pathetic.",
    " Milked like the dumb %a% you are.", " The farm owns every drop, and you know it.",
  ],
  STALL_MILK: [
    "The stall's cups pull at %n% in a deep, rolling rhythm, and milk drums into the bucket",
    "%n% rests their forehead on the rail while the stall milks them, slow and steady",
    "The stall's milker hums and pulls, and %n%'s milk runs warm down the lines",
    "The cups draw on %n% like hungry mouths, and %n% sways with every pull",
    "{t}The stall's cups tug %n%'s teats long, and the milk comes in warm, heavy pulses",
    "{t}%n%'s udder sways under the stall's cups as the milk is drawn out of them",
    "{nt}The stall's little cups suck at %n%'s nipples, and thin warm milk runs into the bucket",
    "{fb}The stall milks %n%'s puffy nipples patiently, and they squirm and drip for it",
    "The stall's pump thumps in its housing, and %n%'s milk pulses down the lines in time",
    "%n% stands quiet in the stall, eyes half shut, while the machine takes what it wants",
  ],
  STALL_SEMEN: [
    "The stall's sleeve slides down %n%'s %c% cock and back up, slow and wet, and their hips follow it",
    "A soft warm sleeve milks %n%'s %c% cock from root to tip, and a thick spurt lands in the jar",
    "%n%'s %c% cock is worked by the stall's sleeve like any other teat, and they moan with every pull",
    "The stall squeezes the head of %n%'s %c% cock on every upstroke, and the jar gets another warm pulse",
    "{c}{nv}A cup cradles %n%'s balls and kneads them while the sleeve strokes, and the stall drinks every drop",
    "{fu}The stall works %n%'s %c% cock and their pussy drips onto the boards beneath, both ends of them begging",
    "{fb}%n%'s cock is swallowed by the stall's sleeve, and they whimper and buck as it's milked",
    "The sleeve tightens round %n%'s %c% cock and pulls, and %n%'s knees knock together",
    "The stall's sleeve slurps and squeezes, and %n% spills into the jar in heavy, aching pulses",
    "%n% grips the stall's rail as the sleeve hauls another load out of their %c% cock",
  ],
  DONE: [
    "The stall's cups let go of %n% with a soft pop, one, two. Down to a quarter. Good %a%, off you go.",
    "The stall winds down, and %n% is left soft and light and dripping. Down to a quarter.",
    "The cups ease off %n% and swing up out of the way. A quarter left, sugar. Well milked.",
    "{t}The stall lets %n%'s teats go, pink and tender. Their udder's down to a quarter.",
    "The machine sighs to a stop. %n% wobbles out of the stall, a quarter full and grinnin'.",
  ],
  DONE_SEMEN: [
    "The sleeve lets go of %n%'s spent cock with a wet sigh. Down to a quarter, and their legs are jelly.",
    "The stall's done with %n%: balls light, cock sore, a quarter left. Good stud.",
    "{c}{nv}The cup lets %n%'s balls go, and they're soft and light and aching. A quarter left.",
    "%n% staggers out of the stall milked down to a quarter, flushed to the ears.",
    "The jar's full and %n% is down to a quarter. The sleeve slides off them with a last squeeze.",
  ],
  DRY: [
    "The %g% pulls at %n% and finds nothing left. They're milked dry, every drop in the tank.",
    "The %g% wheezes on empty. %n%'s been drained right down to nothing.",
    "{t}%n%'s udder hangs soft and empty under the %g%. Dry as a bone.",
    "{nt}%n%'s nipples are pink and sore, and the %g% gets nothing more out of them.",
    "Not a drop more. The %g% has had everything %n% had to give.",
  ],
};

// a sentence about what they're wearin', now and then (only gear they've got on)
export const GEAR_TAIL = {
  bell: [" Their bell clanks softly with every pull.", " Their cowbell rings in time with the pump.", " The bell at their throat jingles every time they shiver."],
  gag: [" Their moans come out muffled round the gag.", " Drool runs from round their gag, and they can't do a thing about it."],
  arms: [" With their arms tied, all they can do is sway in it.", " Their bound arms keep them still and offered up."],
  paws: [" Their mittened paws flex helplessly on the rail."],
  leash: [" Their leash is looped short round the rail, keeping them right where the milker wants them."],
  collar: [" A farmhand gives their collar a fond little tug in passing."],
  blind: [" Blindfolded, they can only feel the pull and hear the milk drum into the bottles."],
  hooves: [" Their hooves shift and stamp on the boards."],
  harness: [" Their harness creaks as they lean into the pull."],
  nipples: [],
};
// the noise their kind makes, now and then: %s% "a low moo"
export const SOUND_TAIL = [" %S% slips out of them.", " They let out %s%.", " %S% escapes them with the next pull.", " Every few pulls, %s%."];
