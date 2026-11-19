/* WHAT'S IN THIS FILE (lines-holes.js)
   The lines for hole training (holes.js). %t is the one bein' trained, %g the toy, %h the hole (pussy, ass), %s how
   open it is, %u what went in (fingers, a fist, a cock, a toy), %b who. The throat has its own (the _t pools).
   By how it feels: 0 it fits, 1 a good stretch, 2 it aches, 3 it hurts, cruel (it means to). In story order: it goes
   in, it sits in you, it trains you, it grows, the goal's met, it's used, it's noticed, it heals, the balm.
*/
import { LINES } from "./lines.js";

LINES.holes = {
  // ── a toy goes in (the room sees it) ──
  in_0: [
    "The %g slides into %t's %h without a fuss. They're well past needin' to be stretched for that one.",
    "%t takes the %g easy, and their %h settles round it like it was made to fit.",
    "In goes the %g, smooth as anythin'. %t's %h hardly notices it.",
    "%t's %h swallows the %g up and closes snug behind it.",
  ],
  in_1: [
    "The %g presses into %t's %h, and there's that good, full stretch as it opens them up and settles.",
    "%t's breath hitches as the %g works in. It's a stretch, a nice one, and their %h gives way round it.",
    "%t feels every inch as the %g pushes home, opening their %h just that little bit wider than it's used to.",
    "The %g takes a moment, a slow push, and then %t's %h opens round it with a soft, full ache.",
  ],
  in_2: [
    "The %g's too big for %t, and it goes in anyway, inch by achin' inch, until their %h is stretched tight round it.",
    "%t whimpers as the %g forces their %h open wider than it's ready for. It aches, and it's stayin'.",
    "It takes work to get the %g into %t. Their %h fights it, then gives, stretched achin' and full.",
    "%t clenches, and it doesn't help: the %g spreads their %h open round it, deep and achin'.",
  ],
  in_3: [
    "The %g is far too big for %t, and it goes in all the same. Their %h burns as it's forced open, and %t cries out.",
    "%t's whole body goes tight as the %g splits their %h open. It hurts, and it's not comin' out.",
    "It's cruel how big the %g is next to %t's %h. It's pushed in anyway, slow, and %t sobs as they're stretched round it.",
    "%t gasps and shakes as the %g wrenches their %h open. They weren't ready, and it doesn't care.",
  ],
  in_cruel: [
    "The %g goes into %t's %h slow, and it seems to enjoy every flinch. It's cruel, and it wants them to know it.",
    "Somethin' about the %g is mean. It forces %t's %h open a little too far, holds it there, and only then settles in.",
    "%t yelps as the %g pushes in. It twists as it goes, opens them wider than it needs to, and stays that way, achin'.",
    "The %g takes its time with %t's %h, stretchin' and stoppin' and stretchin' again, like it's savourin' the noises.",
  ],
  in_0_t: [
    "The %g slides down %t's throat without a single gag. They take it like it's nothin'.",
    "%t's throat opens for the %g and takes it easy, all the way down.",
    "Down goes the %g, smooth, and %t doesn't even blink.",
  ],
  in_1_t: [
    "The %g pushes into %t's throat. They gag once, swallow round it, and it settles deep.",
    "%t's eyes water as the %g works its way down. It's a stretch, but their throat takes it.",
    "The %g fills %t's mouth and nudges into their throat, and they have to breathe slow round it.",
  ],
  in_2_t: [
    "The %g's too much for %t's throat, and it goes down anyway. They gag and drool round it, eyes streamin'.",
    "%t chokes as the %g pushes past where they're used to. Their throat aches round it.",
    "It takes a few tries to get the %g down %t's throat, and every one of them makes %t gag and splutter.",
  ],
  in_3_t: [
    "The %g is far too big for %t's throat. It's forced down regardless, and %t heaves and chokes and can't get away from it.",
    "%t's throat seizes round the %g as it's pushed deeper than they can take. Tears and drool run down their chin.",
    "It hurts goin' down. %t gags so hard they shake, and the %g just keeps goin'.",
  ],
  in_cruel_t: [
    "The %g fills %t's throat and then, cruelly, a little more. It holds right where they gag hardest.",
    "%t chokes as the %g pushes in. It seems to wait for them to settle before it nudges deeper, just to hear it.",
    "The %g goes down %t's throat mean and slow, and pauses every time they start to cope.",
  ],

  // ── while it's in (only they see these) ──
  mine_1: [
    "Your %h is stretched round the %g, full and warm. It's a nice ache, the kind you get used to.",
    "Every time you shift, you feel the %g. Your %h is learnin' to hold it.",
    "The %g sits snug and deep. Your %h is a little more used to it every minute.",
    "That full, stretched feelin' never quite goes away with the %g in you. You don't mind it.",
    "You clench round the %g without meanin' to, and it reminds you just how full you are.",
  ],
  mine_2: [
    "Your %h aches round the %g. It's too big, and it's stayin', and slowly, it's teachin' you.",
    "The %g keeps your %h stretched sore and open. Sittin' still doesn't help.",
    "A dull, deep ache from the %g. Your %h is workin' so hard to take it.",
    "You squirm, and the %g doesn't budge. Your %h throbs round it.",
    "It's too much, the %g, and you're takin' it anyway. Your %h aches with it.",
  ],
  mine_3: [
    "It hurts. The %g's stretchin' your %h far past what it's ready for, and it doesn't let up.",
    "A hot, sharp ache from the %g every time you breathe. Your %h is bein' forced to learn.",
    "You can't get comfortable. The %g's too big, and your %h burns round it.",
    "Every little movement makes the %g hurt. You're stretched raw round it.",
    "Your %h is on fire round the %g, and the only way out is to train till it fits.",
  ],
  mine_cruel: [
    "The %g swells a little, just to hear you whimper, and then eases off. It'll do it again.",
    "It shifts inside you, the cruel thing, right when you'd started to cope. Your %h clenches round it, achin'.",
    "The %g gives a slow twist, and your %h burns. You'd swear it's laughin' at you.",
    "Just when the ache settles, the %g pushes a little deeper. It doesn't want you comfortable.",
    "The %g throbs, wider for a moment, then narrower, then wider again. It's playin' with you.",
  ],
  mine_1_t: [
    "The %g fills your throat. You're breathin' slow round it, and it's gettin' easier.",
    "You swallow round the %g, again and again, and your throat learns its shape.",
    "Drool runs down your chin. Your throat's gettin' used to the %g.",
  ],
  mine_2_t: [
    "Your throat aches round the %g. Every swallow's work.",
    "The %g's too deep, and you gag on it every few breaths. Your throat's learnin' the hard way.",
    "Your jaw aches, your throat aches, and the %g stays right where it is.",
  ],
  mine_3_t: [
    "You gag and gag on the %g, and it hurts. It's far too big for your throat.",
    "Tears run down your face. The %g's forcin' your throat open, and it doesn't stop.",
    "Every breath round the %g burns. Your throat's raw.",
  ],
  mine_cruel_t: [
    "The %g nudges deeper, right when you'd stopped gaggin'. It wants you to keep gaggin'.",
    "It swells in your throat, just a little, just long enough to make you panic, then eases off.",
    "The %g holds right where you gag hardest, patient and cruel.",
  ],
  // ── while it's in (the room sees it) ──
  room_2: [
    "%t shifts and winces. Whatever's in their %h is too big, and they're still takin' it.",
    "%t squirms in place, clenchin', achin' round the %g.",
    "There's a sore little whimper from %t every time they move. The %g's still stretchin' them.",
  ],
  room_3: [
    "%t whimpers, and it isn't a happy noise. The %g's hurtin' their %h, and it isn't comin' out.",
    "%t trembles and grits their teeth. They're stretched far too wide round that %g.",
    "%t can't hold still for the ache. That %g's too big for their %h, and everybody can see it.",
  ],
  room_cruel: [
    "%t yelps out of nowhere. Somethin' in their %h just did somethin' cruel.",
    "%t jolts and whimpers. Whatever that %g is doin' to them, it's enjoyin' it more than they are.",
    "%t squeals and clenches, eyes wide. The %g in their %h must have twisted again.",
  ],
  room_2_t: [
    "%t gags quietly round the %g, eyes wet.",
    "%t drools round the %g. It's deep, and it aches.",
    "%t's throat works hard round the %g. Every swallow's a struggle.",
  ],
  room_3_t: [
    "%t chokes on the %g, and tears run down their cheeks.",
    "%t heaves round the %g, far too deep for them.",
    "%t gags and gags. The %g's too big for that throat, and it's stayin'.",
  ],
  room_cruel_t: [
    "%t chokes suddenly. The %g just pushed deeper, all by itself.",
    "%t gags hard, out of nowhere. That %g's bein' cruel to their throat again.",
    "%t splutters and drools. The %g's toyin' with them.",
  ],

  // ── it trains them (the room sees it) ──
  trained: [
    "The %g's done its work: %t's %h stays %s now, even when it's empty.",
    "%t's %h has given in to the %g. It's %s for good now.",
    "Hours round the %g have taught %t's %h a new shape. It's %s now, and it'll stay that way.",
    "%t's %h doesn't close up as far as it used to. That %g's trained it %s.",
  ],
  trained_t: [
    "%t's throat has learned the %g. It's %s now.",
    "All that time round the %g has paid off: %t's throat is %s now.",
    "%t swallows round the %g, and doesn't gag. Their throat's %s now.",
  ],
  // ── a trainer that grows with them ──
  pump: [
    "There's a soft hiss, and the %g swells bigger inside %t. Their %h has caught up with it, so it's not done yet.",
    "The %g pumps itself up a size inside %t, and their %h is stretched fresh and achin' all over again.",
    "%t's %h finally got used to the %g, so it grows: a hiss, a swell, and they're full and achin' again.",
    "A slow pump, then another. The %g fills %t's %h a size bigger, ready to train them further.",
  ],
  pump_beads: [
    "Another bead slides into %t's %h. They'd got used to the last ones, so the %g gives them one more.",
    "The %g pushes one more bead into %t, and their %h stretches round it.",
    "%t gasps as the next bead pops in. The %g's trainin' them a bead at a time.",
  ],
  pump_cruel: [
    "The %g swells inside %t without waitin' for them to be ready. Their %h burns round it, and it sounds pleased about it.",
    "%t had only just started copin'. The %g pumps up anyway, a size too big, and leaves them achin' raw.",
    "A hiss, a swell, a whimper. The cruel %g doesn't wait for %t's %h to catch up. It never does.",
  ],
  pump_t: [
    "The %g swells in %t's mouth, pushin' deeper, fillin' them up a little more.",
    "There's a hiss, and the %g grows. %t's throat works to take it.",
    "%t's throat had got used to it, so the %g pumps up again.",
  ],
  // ── goals ──
  goal_done: [
    "%t's %h is %s at last, and the %g eases, done with them. It got what it wanted.",
    "The %g goes still. %t's %h is %s now, just like it was meant to be.",
    "It's done: %t's %h has been trained %s, and the %g finally lets them rest.",
  ],
  goal_done_t: [
    "%t's throat is %s at last, and the %g eases off. Its trainin's done.",
    "The %g goes quiet in %t's mouth. Their throat's %s now, just like it was meant to be.",
    "%t's throat has been trained %s, and the %g finally lets them breathe easy.",
  ],

  // ── used (only they see these) ──
  use_1: [
    "Your %h stretches round %u, just a little wider than you're used to. It feels good.",
    "That's a nice stretch. Your %h opens round %u, and it's learnin'.",
    "Your %h gives round %u, a little wider than it's used to.",
  ],
  use_2: [
    "You're too tight for %u, and you take it anyway. Your %h aches.",
    "Your %h aches, stretched round %u. Every bit of it's teachin' you.",
    "Your %h is openin' up round %u whether it's ready or not. It aches.",
  ],
  use_3: [
    "It hurts. Your %h is forced open round %u, far wider than it's ready for.",
    "Your %h burns, stretched round %u. It's too much, much too much.",
    "You cry out as your %h is split wide round %u. You're nowhere near trained for that.",
  ],
  use_1_t: [
    "Your throat opens round %u, a little deeper than you're used to. You swallow round it.",
    "Your throat stretches round %u. It's a good stretch.",
    "You gag a little round %u, then settle. Your throat's learnin'.",
  ],
  use_2_t: [
    "You gag round %u, eyes waterin'. It's too much for your throat.",
    "Your throat aches round %u. You're not trained for that yet.",
    "You splutter and drool round %u, and take it anyway.",
  ],
  use_3_t: [
    "You choke on %u. Your throat isn't ready for that, and it hurts.",
    "Tears stream down your face as your throat's forced open round %u.",
    "Your throat burns round %u. It's far too much.",
  ],
  // ── a load left in them ──
  drip: [
    "%t's %h is too loose to hold it: %b's load runs back out of them and down their thighs.",
    "%b's cum doesn't stay in %t long. Their %h is too well used, and it dribbles out, warm and slow.",
    "A wet trickle runs from %t's %h. They're too open to keep %b's load in.",
    "%t can't clench tight enough any more. %b's cum leaks out of their %h and down their legs.",
  ],
  kept: [
    "Your %h is still tight enough to hold every drop of %b's load. It's warm in there.",
    "You clench, and keep it: %b's cum stays right where they left it.",
    "Not a drop of %b's load escapes your %h. You're still that tight.",
  ],
  swallow: [
    "%b's load goes straight down your throat. You hardly had to swallow.",
    "Your throat takes every drop of %b's cum.",
    "You swallow %b's load down without a thought.",
  ],
  // ── noticed ──
  notice_5: [
    "%t's %h is loose and soft. It doesn't quite close all the way any more.",
    "Anybody lookin' can see %t's %h: well used, and a little open.",
    "%t's %h sits a little open, soft and used.",
  ],
  notice_7: [
    "%t's %h gapes, open and empty. You could see right into them.",
    "%t's %h doesn't close at all any more. It just sits there, open, waitin' to be filled.",
    "There's no hidin' it: %t's %h gapes wide, wet and empty.",
  ],
  notice_10: [
    "%t's %h is ruined, wide open and slack. It couldn't close if it tried.",
    "You could fit a fist in %t's %h without touchin' the sides. It just gapes.",
    "%t's %h is a wide, empty hollow now, open for anythin' at all.",
  ],
  notice_plug: [
    "Your %h is so loose you can feel it hangin' on round the plug, clenchin' to keep it in.",
    "Without the plug in, your %h would just gape. You can feel it.",
    "Your %h clings to the plug. It's the only thing keepin' you from gapin'.",
  ],
  notice_cover: [
    "Your %h is loose under your clothes. Every step reminds you.",
    "You can feel your %h sittin' open under there. Nobody can see it. You know.",
    "Your clothes rub against your %h, soft and open, every time you move.",
  ],
  notice_t: [
    "Your throat feels open, ready. You haven't gagged on anythin' in a while.",
    "You swallow, and it's easy. Your throat's well trained now.",
    "Your throat aches a little, the good kind. It's ready for the next one.",
  ],
  // ── healin' (their switch) ──
  heal: [
    "Your %h has tightened up a little since it was last trained. It's %s now.",
    "Left alone a while, your %h has closed up some. It's %s now.",
    "Your %h is a little tighter than it was. It's %s now.",
  ],
  heal_t: [
    "Your throat's tightened up a little without trainin'. It's %s now.",
    "Left be a while, your throat's lost some of its trainin'. It's %s now.",
    "You'd gag a little easier now. Your throat's %s.",
  ],
  // ── the Tightening Balm on a hole ──
  balm: [
    "The tightenin' balm goes on cool, and %t's %h draws closed, snug and tight again, %s.",
    "%t squirms as the balm tingles in. Their %h tightens up, slow and sure, till it's %s.",
    "A dab of tightenin' balm, a cool tingle, and %t's %h closes up %s again.",
  ],
  balm_t: [
    "%t swallows the tightenin' balm, and their throat closes up %s again.",
    "The balm tingles all the way down. %t's throat tightens up %s.",
    "%t gulps the tightenin' balm, and their throat's %s again.",
  ],
  balm_plug: [
    "The tightenin' balm goes on cool, and %t's %h clenches down hard round the %g in it. It'll be tight once that's out.",
    "%t's %h tightens round the %g in it. The balm's done its work, but the %g's holdin' it open for now.",
    "The balm tingles, and %t's %h squeezes the %g in it. Once it's out, they'll be %s.",
  ],
  // (Nov 19) Ass Growth, Anal Gape, Pussy Gape, off the farm
  gape: [
    "The shot burns warm and low, and %t's %h loosens and opens, achin' to be filled: %s now, and it stays.",
    "%t gasps as it takes. Their %h eases open, wider than it was, and it isn't goin' back: %s.",
    "Somethin' warm spreads deep, and %t's %h relaxes open round nothin' at all. %s now, for good.",
    "%t clenches, and finds there's more room than there was. Their %h is %s now, and trained to stay that way.",
  ],
  gape_max: [
    "The shot burns warm, but %t's %h is as open as a shot off the farm can make it. Only the farm girl's own needles go further.",
    "%t's %h aches for more, but this one won't open it any wider. Past here, it's the farm's shots or nothin'.",
  ],
  balm_none: [
    "%t gets a dab of tightenin' balm. They're as tight as they come already, but it tingles nicely.",
    "The tightenin' balm goes on, and finds nothin' to tighten. %t just squirms at the tingle.",
    "%t's already snug, so the balm only tingles.",
  ],
};
