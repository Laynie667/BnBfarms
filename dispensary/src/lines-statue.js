/* WHAT'S IN THIS FILE (lines-statue.js)
   The Statue Serum's lines (doses.js; drawn by the Companion's statue.js). %t is the one dosed, %m what they're made of
   now (stone, porcelain, gold, black latex, marble, bronze). In story order: it takes, now and then, it lets go.
*/
import { LINES } from "./lines.js";

LINES.statue = {
  take: [
    "%t goes still as the serum takes. Cold creeps over their skin, and in a few heartbeats they're %m from head to toe, hair and all. Only their eyes still move.",
    "A chill runs up %t's legs and keeps on goin'. Skin, hair, every curve sets into smooth %m. They're a statue now, and a pretty one.",
    "%t stiffens mid-breath. Their skin hardens into %m, their hair right along with it, till there's nothin' left but a lovely statue with very much alive eyes.",
    "The serum sets fast. %t turns to %m right where they stand, froze in place for anybody who cares to admire 'em.",
  ],
  now: [
    "You're %m all over. You can feel every touch, but you can't so much as twitch.",
    "Whatever you were feelin' when it took, you're stuck right there. No higher, no lower. Just hangin'.",
    "Cold, hard and gorgeous. Folks keep lookin' at you like you're on display, 'cause you are.",
    "Somebody could dust you off and you couldn't do a thing about it.",
    "Your eyes are the only part of you still yours. Everything else is %m.",
    "You'd squirm if you could. You can't. You're just a pretty %m thing to look at.",
  ],
  off: [
    "Warmth seeps back in. The %m softens to skin, your hair falls loose, and you can breathe all the way down again.",
    "The serum lets go. You're flesh again, and every bit of what you were feelin' comes rushin' right back.",
    "Little by little the %m gives way to skin. You're you again: a bit stiff, and a whole lot worked up.",
  ],
};
