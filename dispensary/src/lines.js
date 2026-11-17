/* WHAT'S IN THIS FILE (lines.js)
   What the Dispensary says, in the farm's voice. %t is the one dosed, %d the dose's name. Big pools, in story order:
   it takes, it holds, now and then, it lets go.
*/
export const LINES = {
  denial: {
    take: [
      "Somethin' cold settles low in %t's belly and locks there. They can feel the edge, and they can feel it isn't goin' to let them past.",
      "%t's breath catches as the serum spreads. Everything down there goes tight and achin', and stays right there, one step short.",
      "The serum takes %t like a hand closin' round them, low and firm. They can climb all they like. They won't be goin' over.",
      "A slow, sweet ache blooms in %t and sits. Wantin' more is easy now. Gettin' there isn't on the menu.",
      "%t shivers as it takes. Whatever they had buildin' is caught and held, right at the lip, and that's where it'll stay.",
      "It goes in warm and settles heavy. %t can feel the edge come up to meet them, and stop.",
    ],
    held: [
      "Right at the edge, and it won't let you over. Not yet, sugar.",
      "You climb, and climb, and the serum holds you right there at the top. No further.",
      "So close it hurts, and the serum just keeps you there.",
      "Your body tries. The serum says no. You're left shakin' at the edge.",
      "Almost... and then nothin'. The serum's still got its hand on you.",
      "There it is, right there, and you can't reach it. The serum won't have it.",
    ],
    off: [
      "The Denial Serum's run its course. The lock low in your belly lets go, and you can go over whenever somebody lets you.",
      "That cold hold down low finally melts away. The edge is just an edge again.",
      "The serum's worn off. Nothin' holdin' you back now but whoever's got their hands on you.",
    ],
  },
  sedative: {
    take: [
      "%t's eyelids droop as the sedative takes them. Their knees go loose and their head goes soft and quiet.",
      "The sedative rolls through %t slow and warm. Their shoulders drop, their eyes go heavy, and every thought takes the long way round.",
      "%t sways where they stand as it hits, blinkin' slow, like the whole room just got a blanket thrown over it.",
      "A thick, sleepy calm pours into %t. Their hands go heavy. Their feet forget how to hurry.",
      "%t yawns before they can stop it. The sedative's got them now, soft and slow and dozy.",
      "It goes in and the world goes soft at the edges. %t's eyes half close and don't quite open again.",
    ],
    drift: [
      "Your eyes slide shut on their own. You drag them open again. Slowly.",
      "Everything feels far away and warm. Movin' seems like an awful lot of work.",
      "Your head nods. You catch it. It nods again.",
      "A yawn takes you whole. Your arms and legs feel full of warm sand.",
      "Your thoughts drift off somewhere soft and come back late.",
      "Standin' up straight is gettin' harder. Lyin' down sounds wonderful.",
    ],
    off: [
      "The sedative's lettin' go. The fog lifts and your legs remember they're yours.",
      "You blink, and this time your eyes stay open. The sleepy weight's slid off you.",
      "The last of the sedative fades. You're awake again, if a little slow about it.",
    ],
  },
};

Object.assign(LINES, {
  hairtrigger: {
    take: [
      "%t jumps as the sensitizer goes in. Even the air feels like a touch now.",
      "Every nerve in %t lights up at once. A brush of fabric makes them gasp.",
      "%t shivers all over. Whatever comes next is goin' to hit twice as hard, and they know it.",
      "The serum spreads warm under %t's skin, and suddenly every inch of it is listenin'.",
    ],
    now: [
      "Your clothes shift and you nearly whimper. Everything's too much, and you can't stop wantin' more of it.",
      "A breath of air across your skin and your knees go weak. The serum's still got every nerve wide awake.",
      "You hold very, very still. Moving at all feels like being touched.",
      "Somebody brushes past and your whole body answers. You bite your lip to keep quiet.",
    ],
    off: [
      "The Hair Trigger fades. Your skin is just skin again, and a touch is just a touch.",
      "The buzzing under your skin quiets down. You can breathe without it feelin' like a caress.",
    ],
  },
});

export const NOTES = {
  notListed: "%b tried to give you %d, but they're not on your list, so nothin' happened.",
  switchedOff: "%d came your way, but you've switched it off, so nothin' happened.",
  safeword: "Safeword: every dose in you is lifted. You're clear.",
  lscgOff: "%d came your way, but it's switched off in LSCG's Drug Enhancements, so LSCG let it pass. Switch it on there if you want it.",
};
