/* WHAT'S IN THIS FILE (shared/potion-voice.js)
   THE FARM GIRL'S VOICE FOR THE POTIONS THE DISPENSARY TAKES OVER (Laynie, Nov 17: "the ones that need her voice,
   couldnt the voice be built into the dispensary too, so it triggers there?"). One copy, read by the farm girl
   (bot/src/parts/ribbons/10m-potions.js, 10m2-potion-lines.js) and by The Farmhand's Dispensary, so her voice is the
   same wherever it's heard. %n = them (their name). seen: the room, as they drink it. now: every few minutes while it
   lasts. off: to them, as it wears off.
*/
export const POTION_VOICE = {
  needy: {
    seen: [
      "%n drinks the Needy Nectar, and within a minute they're rubbing their thighs together and biting their lip.",
      "The Needy Nectar blooms in %n's belly, and they start squirmin' against whatever they're sitting on.",
      "%n finishes the Needy Nectar and goes pink and fidgety. Their hands keep drifting down and getting caught halfway.",
      "One sip of Needy Nectar and %n is leaning on things, pressing on things, aching for things. They might have to ask nicely.",
    ],
    now: [
      "The ache doesn't let up. Every shift of your hips makes it worse, and better, and worse.",
      "You catch yourself rubbin' your thighs together and can't make yourself stop.",
      "Every brush of fabric, every breeze through the barn, goes straight between your legs.",
      "You'd beg. You'd beg anybody. The thought won't leave you alone.",
      "It throbs, slow and patient and merciless, like it's got all day.",
      "%n can't keep their hips still. They're grindin' against nothin', pantin' through their nose.",
      "%n's pussy is soaked and swollen and so needy they'd climb anybody who stood still long enough.",
      "%n keeps lookin' at every hand on the farm like it might be the one that finally helps.",
      "A thin string of wet slides down the inside of %n's thigh. They don't even notice anymore.",
    ],
    off: [
      "The ache finally fades to a dull, sticky throb. You're soaked, and you know it.",
    ],
  },
  hiccup: {
    seen: [
      "%n drinks a Hiccup Fizz. *Hic.* They try to look dignified. *Hic.*",
      "The Hiccup Fizz goes down bubbly, and %n hiccups so hard their whole body jumps.",
      "%n downs a Hiccup Fizz and hiccups through an apology. Then hiccups through the apology for the hiccup.",
      "One Hiccup Fizz later, %n can't get through a sentence. Or a moan. *Hic.*",
    ],
    now: [
      "%n lets out a loud *hic*, right in the middle of everything.",
      "*HIC.* %n claps a hand over their mouth. Too late.",
      "%n tries so hard to hold it in that the *hic* comes out as a squeak.",
      "Three little *hics* in a row out of %n. The whole pen is grinnin'.",
    ],
    off: [
      "One last *hic*, and the Hiccup Fizz is spent.",
    ],
  },
  feather: {
    seen: [
      "%n drinks a Featherlight and shrieks with laughter when their own sleeve brushes their arm.",
      "The Featherlight goes down, and suddenly %n can't stand still: every breeze, every touch, sets them giggling.",
      "%n swallows a Featherlight and dissolves into helpless giggles the second anybody breathes near their neck.",
      "One Featherlight, and %n squirms at the brush of their own hair. Anyone with a feather is very much invited.",
    ],
    now: [
      "A stray bit of straw brushes %n's side and they dissolve into helpless giggles.",
      "%n squeaks and twists away from absolutely nothin'. The air tickled 'em.",
      "Somebody breathes near %n's neck and they nearly fall over laughin'.",
    ],
    off: [
      "Your skin stops tinglin'. The next breeze is just a breeze.",
    ],
  },
  heatmist: {
    seen: [
      "%n breathes in the Heat Mist and goes flushed and slick and squirmy all at once.",
      "One puff of Heat Mist, and %n's scent changes. Every stud in the yard lifts his head.",
      "%n inhales the Heat Mist, shivers, and starts rubbing against the nearest post like a mare in season.",
      "The Heat Mist settles on %n like a warm hand, and they come into heat right there in front of everybody.",
    ],
    now: [
      "%n's skin is pink and hot, and they can't stop squeezin' their thighs together.",
      "The heat's got %n swayin' their hips without meanin' to, presentin' to anyone in reach.",
      "%n smells like heat, sweet and thick, and the studs nearby have noticed.",
    ],
    off: [
      "The heat mist burns off, leavin' you damp and dazed.",
    ],
  },
  moo: {
    seen: [
      "%n drinks the Moo Juice, opens their mouth to say thank you, and lows like a heifer at feeding time.",
      "One bottle of Moo Juice later, %n tries to complain. What comes out is a long, mournful mooooo.",
      "%n swallows the Moo Juice and claps a hand over their mouth. Too late: the moo's out, and everyone heard it.",
      "The Moo Juice goes down, and %n's next three words are all the same word, and that word is moo.",
    ],
    now: [
      "%n opens their mouth to argue and a long, low moo rolls out instead.",
      "Every word %n tries comes out as somethin' a cow would say. They've stopped tryin'.",
    ],
    off: [
      "Your words come back. The first one you say is still a little bit of a moo.",
    ],
  },
  bitterroot: {
    seen: [
      "%n gags on a Bitterroot and glares at the bottle. Everything that was building in 'em just went sour.",
      "A swig of Bitterroot, and %n's face scrunches up. Whatever pleasure's comin' their way for the next half hour, it's comin' ruined.",
      "%n swallows the Bitterroot like medicine. Then their thighs press together, and they whimper, because now it aches and it won't pay out.",
      "The Bitterroot goes down mean. %n squirms, already frustrated, and they haven't even been touched yet.",
    ],
    now: [
      "%n's thighs are slick and tremblin', and the Bitterroot won't let 'em anywhere near the edge.",
      "Every time %n gets close the heat just drains away, mean and sudden. They whine through their teeth.",
      "%n squirms, desperate, achin', and absolutely nothin' they do is gonna be enough.",
      "The Bitterroot's got %n wound tight and leakin', ruined before they even start.",
    ],
    off: [
      "The Bitterroot loosens its grip, slow and grudgin'. You can cum again, if you can still remember how.",
      "That mean, bitter knot finally unties. Go on. Somebody finish what it wouldn't let you.",
    ],
  },
  // ── Nov 18: the four the farm girl says to you herself, moved here so the Dispensary can say them off the farm ──
  honey: {
    seen: [
      "%n tips a spoonful of Honey Tongue onto their tongue and goes dreamy, like somebody's whisperin' sweet nothin's right into their ear. Somebody is.",
      "%n drinks the Honey Tongue and blushes clear down to the collarbone. The praise has already started.",
      "A sticky-sweet Honey Tongue, licked off two fingers. %n squirms like they've just been called a very good pet.",
      "%n swallows the Honey Tongue and leans into nothin', the way you lean into a warm voice."],
    now: [
      "\"Look at you, standin' so pretty for me. Best little animal on the property.\"",
      "\"Every hand on this farm wants a turn with you today, sugar. Can't say I blame 'em.\"",
      "\"You know what you are? You're a good, good thing, and you look so sweet bein' kept.\"",
      "\"I could watch you all day. Them hips, that face, the way you just take it. Perfect.\"",
      "\"Such a soft, obedient creature. The farm's lucky to have you, and so am I.\"",
      "\"Keep bein' this good and I'll make sure everybody hears about it.\""
    ],
    off: ["The farm girl's sweet voice drifts out of your ear. Honey Tongue's done, darlin'."],
  },
  golden: {
    seen: [
      "%n drinks off a Golden Hour and giggles at nothin'. Their cheeks are already pink.",
      "The Golden Hour fizzes on %n's tongue, and they go loose and glowy, like they've just been told they're the best little thing on the farm.",
      "%n sips a Golden Hour slow, eyes half-shut, and you can see them start lookin' forward to the next time they cum.",
      "A bottle of liquid sunshine goes down %n, and they stretch like a cat in a warm window."],
    now: [
      "%n's skin has a glow to it, flushed and loose, like they're waitin' for the next one.",
      "%n keeps smilin' at nothin', hips givin' little rolls, chasin' that warm Golden feelin'.",
      "%n's breath catches every time someone brushes past, golden and eager and easy to set off.",
      "There's a honey-slow heat pooled low in %n, and every touch stirs it.",
    ],
    off: ["The golden glow cools off. The next one's just yours again, not the farm's.", "The Golden Hour's over. That last one was worth every drop, wasn't it?"],
  },
  musk: {
    seen: [
      "%n rubs a drop of Blue Ribbon Musk into their throat, and the nearest farmhand forgets what they were sayin'.",
      "A whiff of hay and heat comes off %n with every step now. Folks keep lookin' up and not knowing why.",
      "%n dabs Blue Ribbon Musk behind each ear, then, after a thought, a little lower. Heads turn.",
      "The cork comes out, the scent rolls across the yard, and suddenly %n is the most interesting animal in the barn."],
    now: [
      "Heads keep turnin' toward %n. Somethin' about the way they smell today has the whole barn restless.",
      "A farmhand walks past %n, stops, and walks past again, slower this time.",
      "%n catches somebody starin'. They don't even pretend they weren't.",
      "The studs in the far pen have gone quiet and still, noses up, every one of 'em pointed at %n.",
      "The farm girl leans close to %n and breathes in. \"Lord, sugar. You're gonna cause a stampede.\""
    ],
    off: ["The Blue Ribbon Musk fades. Heads stop turnin' quite so hard.", "Your skin smells like you again. The barn's a little less restless."],
  },
  echo: {
    seen: [
      "%n drinks an Echo Elixir. Somewhere, the farm girl smiles and starts listening very closely.",
      "The Echo Elixir goes down, and everything %n says for a while might come back around. Sweetly.",
      "%n swallows an Echo Elixir and says somethin' silly. The farm girl tucks it away for later.",
      "One Echo Elixir, and %n's words are on loan to the farm girl for the next twenty minutes."],
    now: [],
    off: ["The Echo Elixir's spent. The farm girl stops listenin' quite so close."],
  },
};
