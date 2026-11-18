/* WHAT'S IN THIS FILE (lines-more.js)
   The lines for the doses Laynie picked on Nov 17 ("I love it"): Let-Down, Fill-Out, the Airhead Elixir, Babble Brew,
   Deep Throat Drops, Rut and Tender, and for time-release capsules, tolerance and cravings. %t is the one dosed, %d the
   dose's name, %s Tender's spot. Big pools, in story order: it takes, it holds, now and then, it lets go.
*/
import { LINES } from "./lines.js";

Object.assign(LINES, {
  letdown: {
    take: [
      "%t gasps and cups their chest as it hits. Somethin' warm swells up behind each nipple, achin' to get out.",
      "The tonic goes straight to %t's tits. They go heavy and tight, and the first warm bead slips out before they can stop it.",
      "%t's nipples stiffen and darken as the let-down takes. A slow, sweet ache fills both breasts right up.",
      "It hits %t like the stall's pump just switched on: a warm rush, a tingle, and then the leakin' starts.",
      "%t feels their chest fill, heavy and warm. Two damp spots are already bloomin' through their top.",
      "%t's breath hitches. They can feel it risin' in them, full and warm, with nowhere to go but out.",
    ],
    now: [
      "Two fresh wet spots spread across %t's top. They're leakin' again.",
      "A warm drip runs down %t's belly from one achin' nipple.",
      "%t's chest twinges and lets down all at once. Their top's soaked through at the tips now.",
      "%t crosses their arms over their chest. It doesn't stop the drip.",
      "A milky bead swells on %t's nipple, hangs there a moment, and falls.",
      "%t's tits feel fuller by the minute, and they're leakin' to prove it.",
      "Somebody only has to glance at %t's chest and it lets down again, warm and wet and impossible to hide.",
    ],
    off: [
      "The ache in your chest eases off. The leakin' slows to nothin', and you're left damp and a little tender.",
      "The Let-Down's worn off. Your top's still wet, but nothin' new is comin'.",
      "Your tits settle and stop leakin'. Somebody might want to fetch you a dry top.",
    ],
  },
  // Fill-Out: which part swells is on the bottle ("Fill-Out (belly)"), the cup if it doesn't say
  fillout_cup: {
    take: [
      "%t's top goes tight all at once. Their tits swell up and out, a cup size, then another, and keep on goin'.",
      "%t looks down as their chest fills out, round and heavy, strainin' every seam they've got.",
      "Warmth floods into %t's breasts and they plump up under it, fuller and rounder by the second.",
      "%t's buttons creak. Their tits are swellin', soft and heavy, and there's no stoppin' it.",
      "%t gasps as their chest blooms outward. Their bra gives up first.",
    ],
    now: [
      "%t's chest is still swollen full and heavy. Every step makes it bounce.",
      "%t tugs at their top. It isn't built for what it's holdin' right now.",
      "%t's tits feel tight and warm and far too big. Somebody's starin'.",
      "%t tries to see their own feet. There's too much in the way.",
    ],
    off: [
      "Your chest slowly settles back down to its own size. Your top can breathe again.",
      "The Fill-Out's done. Your tits shrink back to where they were, a little tender for the trip.",
    ],
  },
  fillout_belly: {
    take: [
      "%t's belly rounds out under their hands, swellin' soft and taut like they've been bred full.",
      "A warm pressure blooms low in %t's belly, and it grows: rounder, tighter, heavier.",
      "%t's tummy pushes out against their clothes. They look a few months along and countin'.",
      "%t sways as their belly fills out, heavy and round and impossible to hide.",
      "%t presses a hand to their middle and feels it swell up to meet it.",
    ],
    now: [
      "%t rubs their swollen belly. It's still round and tight and warm.",
      "%t's belly sloshes when they shift. It's still filled right out.",
      "Every time %t moves, that round belly gets in the way.",
      "%t's waistband has given up. The belly's won.",
    ],
    off: [
      "Your belly slowly flattens back down. The tight, full feelin' fades with it.",
      "The Fill-Out's worn off. Your tummy's your own size again.",
    ],
  },
  fillout_ass: {
    take: [
      "%t yelps as their ass plumps up, round and soft and suddenly far too big for what they're wearin'.",
      "Warmth spreads through %t's hips and rear, and it all swells: wider, rounder, heavier.",
      "%t's hips fill out with a jiggle. Their clothes are holdin' on for dear life back there.",
      "%t looks over their shoulder and finds a whole lot more of themselves than there was a moment ago.",
    ],
    now: [
      "%t's swollen rear sways with every step. Nobody's lookin' anywhere else.",
      "%t tries to sit and finds there's a lot more of them to sit on.",
      "%t's hips bump the furniture. They've not got used to the width yet.",
    ],
    off: [
      "Your hips and ass slowly settle back down. Your clothes fit again.",
      "The Fill-Out's done with your rear. It shrinks back, one jiggle at a time.",
    ],
  },
  // the Animal Tongue (%a: the animal it makes them)
  tongue: {
    take: [
      "%t's tongue goes thick and strange as the drops take. When they try to speak, a little %a noise comes out first.",
      "Somethin' shifts in %t's throat. Words feel slippery now, and the noises under them feel easy, like a %a's.",
      "%t licks their lips, and it feels all wrong, all %a. The next thing they say is goin' to come out funny.",
      "The Animal Tongue settles in. %t tries to say \"no\" and it comes out as somethin' a %a would say.",
      "%t's mouth tingles. They can feel the words driftin' further off, and the %a sounds comin' closer.",
    ],
    now: [
      "%t starts to answer and stops, flustered: only a %a noise came out.",
      "%t covers their mouth after that last one. That wasn't a word. That was pure %a.",
      "%t's tryin' so hard to talk properly. Their tongue's havin' none of it.",
      "Every time %t opens their mouth now, there's a little %a in it.",
      "%t gives up on words for a moment and just makes the noise. It's easier.",
      "%t's cheeks go pink. They meant to say somethin' clever, and a %a's noise came out instead.",
    ],
    off: [
      "Your tongue feels like yours again. Words come out the way you mean them, mostly.",
      "The Animal Tongue wears off. You can talk properly again, though the noises still feel awful close.",
    ],
  },
  airhead: {
    take: [
      "%t blinks, slow and sweet, as the elixir takes. Whatever they were thinkin' about just sort of... floats off.",
      "A pink, bubbly fog rolls into %t's head. They giggle, and can't remember why.",
      "%t's eyes go big and soft. Thinkin' feels like a lot of work all of a sudden. Smilin' doesn't.",
      "%t twirls a bit of hair round one finger without meanin' to. The elixir's got them, like, totally.",
      "Every serious thought in %t's head pops like a bubble. What's left is warm and giggly and empty.",
    ],
    now: [
      "%t loses their train of thought halfway through and just... giggles.",
      "%t stares at nothin' for a long, happy moment, then remembers they were doin' somethin'.",
      "%t twirls their hair and hums. Nobody's home, and it's lovely in there.",
      "%t starts to say somethin' clever, frowns, and gives up with a giggle.",
      "%t's head tilts, all soft and empty. What were we talkin' about?",
      "%t counts on their fingers, gets to three, and decides that's plenty.",
    ],
    off: [
      "The pink fog thins out. Your thoughts come back one at a time, a bit embarrassed about where they've been.",
      "The Airhead Elixir's worn off. Big words come back. So does rememberin' what you said.",
      "You blink, and your head's clear. That was, like... no. That was a lot.",
    ],
  },
  babble: {
    take: [
      "%t swallows, and their tongue starts to tingle. Somethin' filthy is waitin' right behind their teeth.",
      "The brew goes down warm and their mouth goes loose. %t has a feelin' they're about to say somethin' they shouldn't.",
      "%t's lips buzz. Every word they reach for, a dirtier one gets there first.",
      "%t clamps their mouth shut as it takes. It won't help for long.",
      "%t licks their lips. They taste of somethin' sweet and rude.",
    ],
    now: [
      "%t opens their mouth to say somethin' polite. It doesn't come out polite.",
      "%t goes red to the ears. They definitely didn't mean to say that out loud.",
      "%t bites their lip hard, tryin' to keep the next one in.",
      "%t covers their mouth with both hands. Somethin' filthy still leaks out between their fingers.",
      "%t starts a sentence, hears where it's headed, and stops dead.",
    ],
    off: [
      "Your tongue stops tinglin'. Words come out the way you meant them again. Mostly.",
      "The Babble Brew's worn off. Your mouth is your own again, for what that's worth after the last while.",
    ],
  },
  deepthroat: {
    take: [
      "%t's throat goes warm and loose as the drops take. Swallowin' feels easy. Everything feels easy.",
      "A tingle slides down the back of %t's throat and everything there just... relaxes. No gag, no fight.",
      "%t opens and closes their mouth, testin'. The back of their throat feels soft and open and wantin'.",
      "The drops numb the fight right out of %t's throat. Whatever goes in there now is goin' all the way.",
      "%t swallows once, twice, and finds nothin' stops it. Their throat's wide open.",
    ],
    now: [
      "%t swallows slow and easy. Their throat's still loose and waitin'.",
      "%t's mouth hangs a little open. It's hard to remember why they'd ever close it.",
      "%t licks their lips. Their throat feels open, soft and ready.",
      "%t keeps swallowin' on nothin'. Their throat wants somethin' in it.",
    ],
    used: [
      "It slides right down. No gag, no fight, just your throat takin' it.",
      "Your throat opens up and lets it in, easy as anything.",
      "Deeper than you'd ever manage on your own, and you don't even choke.",
      "All the way down, and your throat just holds it there, soft and willin'.",
    ],
    off: [
      "The tingle in your throat fades. Your gag reflex comes back, and with it, a little sense.",
      "The Deep Throat Drops wear off. Your throat remembers how to say no.",
    ],
  },
  rut: {
    take: [
      "%t's breath goes ragged as the rut takes. Heat pours straight down between their legs and stays there.",
      "Somethin' wild and hungry wakes up in %t. Their eyes go dark and fix on the nearest warm body.",
      "%t growls before they can stop it. They're hot and achin' and dyin' to breed somethin'.",
      "The rut hits %t like a kick. Every thought they had narrows down to one.",
      "%t's heart pounds. They're ready, and they're goin' to stay ready.",
    ],
    now: [
      "%t paces like a stud in a pen, all heat and want.",
      "%t's eyes follow every hip that sways past.",
      "%t is achin' again already. The rut doesn't let 'em rest long.",
      "%t's breathin' heavy, flushed and restless, sniffin' the air.",
      "A low, needy grunt slips out of %t. The rut's still ridin' them.",
    ],
    again: [
      "Barely done, and the rut's got you achin' for more already.",
      "You've hardly caught your breath, and you're ready again.",
      "Spent, for about a heartbeat. Then the rut hauls you right back up.",
      "It should be over. The rut says otherwise.",
    ],
    off: [
      "The rut burns itself out. The hunger fades, and you're left wrung out and very, very satisfied.",
      "The Rut's worn off. You can think about somethin' besides breedin' again. Mostly.",
    ],
  },
  tender: {
    take: [
      "Warmth gathers in %t's %s and stays there. The lightest touch there is goin' to feel like three.",
      "The drops soak into %t's %s, hot and tingly. They can feel their own pulse there now.",
      "%t shivers as it takes. All the feelin' in them just pooled in their %s.",
      "It sinks into %t's %s, soft and warm. Anybody who touches them there is goin' to find out how much.",
    ],
    now: [
      "The ache in your %s throbs, warm and tender. Even your clothes brushin' there is a lot.",
      "You can't stop thinkin' about your %s. One touch there and you'd melt.",
      "Every move you make, that tingle in your %s answers.",
    ],
    touched: [
      "A touch on your %s, and it hits three times over. Your knees nearly give.",
      "Right there on your tender %s. You can't help the noise you make.",
      "That one touch on your %s goes through you like a bell.",
      "Your %s, of all places. It's too much, and you want more of it.",
    ],
    off: [
      "The tenderness in your %s fades. A touch there is just a touch again.",
      "The Tender drops have worn off, and your %s can take a touch again without you meltin'.",
    ],
  },
  // a time-release capsule: given now, goes off later
  later: {
    set: [
      "%t feels the capsule settle somewhere deep inside. Nothin' yet. They'll have to wait and see.",
      "The needle leaves somethin' small and slow behind in %t. It'll go off when it's good and ready.",
      "%t braces for it to hit. It doesn't. Not yet.",
      "Just a little pinch, and then nothin'. Whatever's in %t is takin' its sweet time.",
    ],
    fire: [
      "Somethin' gives way inside %t without warnin': the capsule's finally cracked open.",
      "%t jolts. The capsule they'd half forgot about just burst, all at once.",
      "Out of nowhere, %t's knees wobble. That slow capsule's gone off.",
      "%t stops mid-step. There it is. It took its time, and now it's all comin' at once.",
    ],
  },
  // cravings (only if you switched them on): now and then, while nothin's in you
  crave: {
    want: [
      "Your arm itches right where the needle usually goes.",
      "You catch yourself thinkin' about %d again. Just a little one wouldn't hurt.",
      "Everything feels a bit flat without somethin' in you.",
      "You find yourself lookin' round for whoever's holdin' the needles.",
      "A little %d would really take the edge off right now.",
      "You can almost taste it. %d. You know exactly who you'd ask.",
    ],
  },
});

// Golden Hour off the farm: doted on after every climax (the farm girl's own words, as she says them on the farm)
LINES.goldenDote = [
  "✨ The farm girl's voice, warm in your ear while you come down: \"There it is. That's my good thing. Look how pretty you are when you let go.\"",
  "✨ \"Oh, listen to you. Every one of those is golden, sugar. Every last one.\"",
  "✨ \"Good. So good. You've earned every bit of that glow.\"",
];
// the Echo Elixir off the farm: somethin' you said, sweetly back to the room. %t you, %s what you said
LINES.echo = [
  "🗣️ A sweet voice puts a hand to its heart: \"Did y'all hear that? %t just said, and I quote: '%s'. Ain't that just the sweetest thing.\"",
  "🗣️ Somebody sighs, fond as anything: \"'%s'. That's what %t said. Precious.\"",
  "🗣️ The room hears it again, sweeter this time: \"%t said '%s', and I think we should all remember it.\"",
];

// growth off the farm: %t them, %p the part (for a reducing serum)
LINES.grow = {
  cup: [
    "%t gasps as their chest swells. A whole cup bigger, heavy and warm, and it isn't goin' anywhere.",
    "The growth serum floods %t's tits. They round out, fill out, settle heavier, and stay that way.",
    "%t's top goes tight as their breasts grow a size. They'll need new clothes.",
  ],
  ass: [
    "%t's hips widen and their ass plumps up a size, round and soft, for good.",
    "The serum goes straight to %t's rear. It swells, jiggles, and stays bigger.",
  ],
  cock: [
    "%t groans as their cock grows a size, thicker and longer, and stays that way.",
    "Heat pours into %t's cock. It swells a size bigger, and it's keepin' it.",
  ],
  balls: [
    "%t's balls swell a size, heavy and full, and they stay that way.",
    "The serum drops straight into %t's balls. Bigger, heavier, achin' to be emptied.",
  ],
  less: [
    "%t's %p shrinks back a size, a little tender for the trip.",
    "A cool tingle, and %t's %p settles a size smaller.",
  ],
};

// tolerance, a note only you see
export const TOLERANCE_NOTE = "Your body's gettin' used to %d: this one only takes %p% as long.";
