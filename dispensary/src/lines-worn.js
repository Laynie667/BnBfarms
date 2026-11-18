/* WHAT'S IN THIS FILE (lines-worn.js)
   The lines for gear that doses (worn.js): a drip startin', an injector goin' off, a trigger, a kiss with somethin' on
   the lips. %t is the one dosed, %d the dose, %g the gear, %b whoever set it off.
*/
import { LINES } from "./lines.js";

Object.assign(LINES, {
  worn: {
    drip: [
      "The %g starts to seep. %t can feel %d creepin' into them, slow and steady, and it isn't goin' to stop while it's on.",
      "Somethin' in the %g warms against %t's skin and starts to leak %d into them, a little at a time.",
      "%t shivers as the %g settles. It's drippin' %d into them now, patient as anything.",
      "The %g has been soaked in %d, and it gives it up to %t's skin bit by bit.",
    ],
    inject: [
      "The %g clicks. A little sting, and %t gets another dose of %d.",
      "Right on time, the %g gives %t a sharp little pinch: %d, straight in.",
      "%t jumps as the %g goes off. More %d, whether they were ready or not.",
      "There's a soft hiss from the %g, and %d floods into %t all over again.",
    ],
    climax: [
      "%t's %g goes off right as they cum: %d, pumped in while they're still shakin'.",
      "The moment %t goes over, the %g answers with a dose of %d.",
      "%t cums, and the %g rewards them for it: %d, straight in.",
    ],
    kissed: [
      "%b kisses %t, and the %g notices: a dose of %d slides in.",
      "The %g on %t answers %b's kiss with a pinch of %d.",
    ],
    touched: [
      "%b's touch sets the %g off: %t gets a dose of %d.",
      "The %g on %t wakes up under %b's hands and gives them %d.",
    ],
    spanked: [
      "The smack sets the %g off: %t yelps, and a dose of %d goes in with it.",
      "%b's hand lands, and the %g on %t answers with %d.",
    ],
    gloss: [
      "%b's lips are slick with somethin' sweet. %t tastes it a moment too late: %d.",
      "%b kisses %t and leaves a sticky shine behind. It tingles. It's %d.",
      "There's %d in %b's lip gloss, and now there's some in %t too.",
      "%t licks their lips after %b's kiss and finds them sweet and tinglin'. %d.",
    ],
  },
});
