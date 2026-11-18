/* WHAT'S IN THIS FILE (lines-senses.js)
   The lines for the poses and senses (senses.js): Weak Knees, Down Girl, Blinder Drops, Cotton Ears, Tunnel Vision, Haze.
   %t is the one dosed. In story order: it takes, now and then, it lets go.
*/
import { LINES } from "./lines.js";

Object.assign(LINES, {
  weakknees: {
    take: [
      "%t's knees give out all at once. Down they go, and their legs won't take their weight again.",
      "The draught turns %t's legs to jelly. They fold onto their knees with a soft little gasp, and stay there.",
      "%t sways, wobbles, and sinks to their knees. Standin' up is somebody else's job now.",
    ],
    now: [
      "Your legs still won't hold you. You'll need a hand to get up.",
      "You try to stand and your knees just laugh at you.",
    ],
    off: ["Strength creeps back into your legs. You could stand up now, if you wanted to."],
  },
  allfours: {
    take: [
      "%t drops onto their hands and knees like it's the most natural thing in the world, and finds they can't get up again.",
      "Down, girl: %t goes down on all fours, and that's where their body wants to stay.",
      "%t's arms and legs decide for them. All fours. Good pet.",
    ],
    now: [
      "Your body likes it down here. Gettin' up needs a hand.",
      "You shift on your hands and knees. Down's where you belong right now.",
    ],
    off: ["The pull to stay down fades. You can stand on your own again."],
  },
  blinder: {
    take: [
      "%t blinks as the drops take. The room goes dim at the edges, then dimmer.",
      "The drops sting, then everything blurs into shadow. %t's eyes are open, and it doesn't help much.",
      "%t's sight fades like somebody's turnin' down the lights.",
    ],
    now: ["You squint into the gloom. Shapes, and not much else."],
    off: ["The dark lifts. You blink, and the room comes back."],
  },
  cotton: {
    take: [
      "%t's ears go full and muffled, like they've been stuffed with cotton.",
      "Sound goes far away for %t. Voices turn to murmurs.",
    ],
    now: ["Everyone sounds a long way off, and very soft."],
    off: ["Your ears pop, and the room's loud again."],
  },
  tunnel: {
    take: [
      "%t's sight narrows down to a small bright circle. Everything else just isn't there.",
      "The edges of the world fold in on %t till only what's straight ahead is left.",
    ],
    now: ["Only what's right in front of you. Turnin' your head is the only way to see anything else."],
    off: ["The world opens back out. You can see the edges again."],
  },
  haze: {
    take: [
      "A warm haze rolls over %t's eyes. Everything goes soft and blurry and dreamy.",
      "%t's sight swims. The room's all soft edges now.",
    ],
    now: ["Everything's soft and smudged. It's hard to tell who's who."],
    off: ["The haze clears. Everything's sharp again."],
  },
});
