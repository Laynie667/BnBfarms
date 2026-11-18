/* WHAT'S IN THIS FILE (lines-para.js)
   The crafted parasites' lines (parasites.js). %t is the one it's on, %b whoever it came from, %d a dose, %n a count.
   Big pools, in story order: it latches, it feeds, now and then, it lets go.
*/
import { LINES } from "./lines.js";

Object.assign(LINES, {
  para: {
    lips: {
      latch: [
        "Somethin' wet and eager wriggles free of the gear and seals itself over %t's mouth. A pair of livin' lips, %b's strain, and they're not lettin' go.",
        "The parasite finds %t's mouth and latches on with a soft, greedy pop. Its tendril slides down their throat and settles in.",
        "%t gasps, and that's all the parasite needed: it's on their lips now, warm and pulsin', and it's hungry.",
      ],
      feed: [
        "The parasite on %t's mouth shivers and pumps somethin' sweet down their throat: %d.",
        "%t feels the parasite swallow, then give back: a warm mouthful of %d.",
        "A slow pulse runs through the parasite's lips, and %t's throat fills with %d.",
      ],
      crave: [
        "Your mouth aches. The parasite wants a load, and so, now, do you.",
        "You catch yourself starin' at somebody's lap. The parasite's hungry.",
        "Your throat keeps swallowin' on nothin'. Somethin' thick would settle it.",
      ],
      off: [
        "The parasite loosens, slides off your lips with a wet little sound, and goes still. Your mouth tingles for a while after.",
        "It's done with you. The parasite peels away, sated, and leaves you swallowin' on the memory.",
      ],
    },
    latex: {
      latch: [
        "The gear's shine spreads. It crawls off the edges and over %t's skin, glossy and black and alive: livin' latex, %b's.",
        "%t watches the latex creep up their thighs and settle, cool at first, then warm. It's on them now, and it's thirsty.",
      ],
      feed: [
        "The latex drinks %t's climax and tightens, pleased. Everything it covers feels twice as much.",
        "A ripple runs over the latex as %t cums: it's fed, and it's makin' them feel every inch it hugs.",
      ],
      starved: [
        "The latex has gone dull and cold. Nobody's fed it: it peels away to find a better host.",
      ],
      off: [
        "The latex loosens and slides off you in one glossy sheet. Your skin feels very bare.",
        "Its time's up. The latex lets go, and leaves you a little sorry it did.",
      ],
    },
    moss: {
      latch: [
        "Soft green moss spreads over %t's chest from the gear, warm and damp. It nuzzles their nipples. It wants their milk.",
        "The milk moss settles over %t's tits and starts to hum. It's hungry, and it knows where the food is.",
      ],
      feed: [
        "The milk moss squeezes, gentle and insistent, and %t's tits let down for it.",
        "%t's chest prickles under the moss. It's coaxin' the milk out of them again.",
      ],
      starved: ["The moss has dried and gone brittle. Nobody's let down for it: it crumbles away."],
      off: ["The milk moss lets go, a soft green shed, and your chest feels light and tender without it."],
    },
    nestling: {
      latch: [
        "Somethin' small and warm slips from the gear into %t and curls up low in their belly. The nestling's found its nest.",
        "%t feels it settle inside: the nestling, %b's, warm and content and already growin'.",
      ],
      grow: [
        "%t cums, and the nestling drinks it in. It grows: stage %n, and %t's belly rounds out with it.",
        "The nestling stirs and swells as %t comes down. Stage %n. Their belly's fuller for it.",
      ],
      starved: ["The nestling's gone quiet and cold. It slips away in the night, lookin' for a better-fed nest."],
      off: ["The nestling leaves, its time done, and your belly settles back down. You miss the weight of it."],
    },
    brood: {
      latch: [
        "The brood mother takes up residence in %t: big and patient and fertile, %b's. She'll be layin' soon.",
      ],
      lay: [
        "Somethin' shifts inside you. The brood mother's laid a little one (%n now). Kiss somebody who'd take it.",
        "Another tiny parasite, ready to go (%n waitin'). It'll pass on the next kiss.",
      ],
      pass: ["Your kiss carries one of the brood mother's little ones across to %b."],
      off: ["The brood mother's done. She lets go, and any little ones go with her."],
    },
    vine: {
      latch: [
        "The vine in %t's gear uncurls and finds %b. A green tether, and it isn't lettin' %t wander far.",
      ],
      tug: [
        "The leash vine goes taut. You can't go any further from whoever grew it.",
        "A tug at your gear: the vine says that's far enough.",
      ],
      off: ["The leash vine goes slack and withers. You can wander again."],
    },
    mouth: {
      latch: [
        "Somethin' in %t's gear settles against their tongue. The mouthpiece: %b can put words there now.",
      ],
      off: ["The mouthpiece goes quiet. Your words are your own again."],
    },
  },
});
