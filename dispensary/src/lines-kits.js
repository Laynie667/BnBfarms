/* WHAT'S IN THIS FILE (lines-kits.js)
   The lines for kits (kits.js). %t is the one bein' dressed, %b whoever made the kit, %k the kit's name, %g the piece.
   Each flavour (plain, livin', demonic, brainwashin') in story order: it starts, a piece goes on, a piece comes back,
   it's all on, it lets go.
*/
import { LINES } from "./lines.js";

LINES.kits = {
  start_plain: [
    "%b's %k kit starts puttin' itself on %t, one piece at a time.",
    "%t feels the first tug: %b's %k is on its way onto them, whether they like it or not.",
    "Somethin' clicks into place on %t. %b's %k kit has started dressin' them.",
  ],
  piece_plain: [
    "The %g slides into place on %t, snug and certain.",
    "%t's %g settles on them, neat as if somebody'd put it there by hand.",
    "Another piece: the %g, fittin' itself onto %t.",
    "The %g buckles itself on %t without anybody touchin' it.",
  ],
  back_plain: [
    "The %g's back on %t again, quick as it came off.",
    "%t takes it off, and the %g just puts itself right back.",
    "The %g creeps back onto %t. The kit isn't done with them.",
  ],
  done_plain: [
    "%t's all done up in %k now, every piece in place. It'll stay that way a while.",
    "The last piece settles. %t's wearin' the whole of %k, and it isn't comin' off till it's done.",
  ],
  off_plain: [
    "The %k kit lets go of %t, and their own clothes slip back on where it was.",
    "%k comes away from %t piece by piece, and their old outfit's back on them, as if it never left.",
  ],

  start_living: [
    "Somethin' slick and warm starts to move on %t's skin. %b's %k is alive, and it's crawlin' on.",
    "%t shivers: %b's %k kit wakes up and starts to creep over them, wet and eager.",
    "It's breathin'. %b's %k slithers onto %t one piece at a time, like it's been waitin' for them.",
  ],
  piece_living: [
    "The %g oozes up %t's body and sets, glossy and tight, then gives a little squeeze.",
    "The %g wraps itself round %t, slick and throbbin', and shrinks to fit.",
    "A wet sound, and the %g's on %t: it crawled there by itself, and now it's pulsin' gently.",
    "The %g slides over %t like warm syrup and hardens snug, still twitchin'.",
    "The %g squirms into place on %t and settles with a satisfied little shiver.",
  ],
  back_living: [
    "The %g crawls right back onto %t, slick and stubborn. It likes it there.",
    "%t peels the %g off, and it oozes straight back on, tighter than before.",
    "The %g slithers back up %t's skin. It's not lettin' go of them.",
  ],
  done_living: [
    "%t's covered now: the whole of %k is on them, warm and breathin', squeezin' now and then like it's alive. It is.",
    "The last of %k seals over %t with a wet kiss. All of it's alive, and all of it's holdin' on.",
  ],
  off_living: [
    "%k goes still, then slides off %t in slow, wet sheets, and their own clothes are back on underneath.",
    "The livin' %k lets go of %t with a reluctant shiver and crawls away, leavin' their old outfit on them.",
  ],

  start_demon: [
    "A red glow sparks on %t's skin, and %b's %k answers it: the curse is takin' hold, a piece at a time.",
    "%t hears somethin' laugh, low and cruel. %b's %k has been called, and it's comin' for them.",
    "Sigils flare along %t's arms. %b's cursed %k starts bindin' itself to them.",
  ],
  piece_demon: [
    "The %g burns into place on %t, sigils glowin' along its edges, and somethin' whispers \"mine\".",
    "Red light snaps tight round %t, and when it fades the %g's on them, warm as a brand.",
    "The %g locks onto %t with a hiss of brimstone. A voice in their ear purrs how good it looks on them.",
    "The %g appears on %t in a curl of black smoke, already too tight, already theirs.",
    "A sigil sears onto %t's skin, and the %g settles over it, humming with somethin' that isn't kind.",
  ],
  back_demon: [
    "The %g flares back onto %t in a flash of red. The curse laughs at them for tryin'.",
    "%t takes the %g off, and the sigils pull it straight back, burnin' hotter for the cheek.",
    "The %g reappears on %t with a cruel little chuckle in their ear: \"no.\"",
  ],
  done_demon: [
    "%t's bound in the whole of %k now, every sigil glowin'. The curse settles in to enjoy itself.",
    "The last piece of %k burns into place. Somethin' sighs, pleased, inside %t's head. They're its, for now.",
  ],
  off_demon: [
    "The sigils on %t gutter and go out, and %k crumbles away to ash. Their own clothes are back on, a little scorched round the edges.",
    "The curse lets go of %t with a disappointed hiss, and %k is gone, their old outfit on them again.",
  ],

  start_brain: [
    "A soft hum fills %t's head. %b's %k kit is goin' on them, and part of them is already noddin' along.",
    "%t's thoughts go slow and syrupy. %b's %k is dressin' them, and it feels so right to let it.",
    "\"Good. Hold still,\" whispers somethin' only %t can hear, and %b's %k begins.",
  ],
  piece_brain: [
    "The %g goes on %t, and their eyes go a little glassier with it.",
    "%t helps the %g on without meanin' to. It feels like the right thing to do.",
    "The %g settles on %t, and a soft voice tells them how much better they look already.",
    "The %g clicks into place on %t, and another thought of their own floats away.",
    "%t holds still for the %g. Stillness feels nice. Obedience feels nicer.",
  ],
  back_brain: [
    "%t blinks. The %g's back on them, and they don't remember puttin' it there.",
    "%t takes the %g off, then puts it right back on, smilin' vaguely. That's where it goes.",
    "\"Ah ah,\" murmurs the voice, and %t's own hands put the %g back on.",
  ],
  done_brain: [
    "%t's wearin' the whole of %k now, eyes soft and empty. The hum in their head says they look perfect.",
    "The last piece settles, and so does %t: dressed in %k, calm and blank and very, very obedient.",
  ],
  off_brain: [
    "The hum fades, and %k comes off %t. They blink at their own clothes, back on them, and can't quite remember the last little while.",
    "%t wakes up out of it, dressed as they were before %k. Bits of it are still hummin' at the back of their head.",
  ],

  missing: [
    "The kit called %k can't be found: %b's Dispensary didn't send it (they might be gone, or not have it any more).",
  ],
  missing_own: [
    "You've no kit called %k saved: /dispensary kit save <name> keeps what you're wearin', or save it in LSCG.",
  ],
  nothing: [
    "The %k kit has nothin' in it that's allowed to go on you (your Kits settin' picks clothes, restraints or both).",
  ],
};
