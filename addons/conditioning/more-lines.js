/* WHAT'S IN THIS FILE (conditioning/more-lines.js)
   The Oct 15 batch for conditioning: more for every part of a session (a session now takes a fresh handful from each
   part, in order, so no two sessions read the same), species words for every kind on the farm with a male word where
   it differs, lines that fit the body (tags, see _lib/connect.js), and suggestions about what they're wearin'.
   {a} animal · {s} sound · {p} body · {act} · {pose} · {pet} nickname · %name% them
*/
// species missing from the first table, and the words for a male of the kind where they differ
export const SPECIES_MORE = {
  bull:   { a: "bull",   s: "snort",  p: "heavy balls",      act: "breed and obey",      pose: "on all fours, head low",          names: ["good bull", "farm bull", "breeding bull", "dumb stud bull"] },
  kitt:   { a: "kitty",  s: "mew",    p: "twitching tail",   act: "purr and present",    pose: "curled low, hips up",             names: ["sweet kitty", "farm cat", "needy kitty", "brainless pet"] },
  rabbit: { a: "bunny",  s: "squeak", p: "twitchy ears",     act: "hop and breed",       pose: "crouched low, nose twitching",    names: ["sweet bunny", "farm bunny", "breeding doe", "dumb breeding doe"] },
  fox:    { a: "fox",    s: "yip",    p: "bushy tail",       act: "present and please",  pose: "low on your elbows, tail high",   names: ["sweet fox", "farm vixen", "eager vixen", "dumb little vixen"] },
  wolf:   { a: "wolf",   s: "howl",   p: "thick ruff",       act: "heel and obey",       pose: "kneeling up, paws tucked",        names: ["good wolf", "farm wolf", "obedient wolf", "dumb tame wolf"] },
  deer:   { a: "doe",    s: "bleat",  p: "soft flanks",      act: "stand still and wait", pose: "on all fours, head low",         names: ["sweet doe", "farm doe", "tame doe", "dumb little doe"] },
  rat:    { a: "rat",    s: "squeak", p: "twitching whiskers", act: "scurry and serve",  pose: "crouched low, hands tucked under your chin", names: ["sweet ratslut", "farm rat", "greedy little rat", "dumb gutter rat"] },
  dragon: { a: "dragon", s: "growl",  p: "folded wings",     act: "guard and obey",      pose: "crouched low, wings folded, tail curled round you", names: ["good dragon", "farm dragon", "tame dragon", "dumb little dragon"] },
  goblin: { a: "goblin", s: "giggle", p: "greedy hands",     act: "fetch and serve",     pose: "squatting low, hands on the floor", names: ["good goblin", "farm goblin", "useful goblin", "dumb goblin"] },
};
export const MALE = {
  cow:   { a: "bull",     names: ["good bull", "farm bull", "breeding bull", "dumb stud bull"] },
  horse: { a: "stallion", names: ["good stallion", "farm stallion", "stud stallion", "dumb stud"] },
  pig:   { a: "boar",     names: ["sweet piggy", "farm boar", "greedy boar", "filthy boar"] },
  bunny: { a: "bunny",    names: ["sweet bunny", "farm bunny", "breeding buck", "dumb breeding buck"] },
  rabbit:{ a: "bunny",    names: ["sweet bunny", "farm bunny", "breeding buck", "dumb breeding buck"] },
  goat:  { a: "goat",     names: ["sweet goat", "farm goat", "billy goat", "dumb billy"] },
  sheep: { a: "ram",      names: ["sweet lamb", "farm ram", "flock ram", "dumb ram"] },
  fox:   { a: "fox",      names: ["sweet fox", "farm fox", "eager fox", "dumb little fox"] },
  deer:  { a: "buck",     names: ["sweet buck", "farm buck", "tame buck", "dumb little buck"] },
  dog:   { names: ["good dog", "farm dog", "obedient mutt", "dumb mutt"] },
  dragon:{ a: "drake",    names: ["good drake", "farm drake", "tame drake", "dumb little drake"] },
  pup:   { names: ["good pup", "farm pup", "obedient pup", "dumb mutt"] },
};
// a cow's "heavy udders" (and a goat's) only for somebody with tits; a cock gets "heavy balls", anybody else their body
export const UDDER_KINDS = ["cow", "goat"];

export const SCRIPT_MORE = {
  settle: [
    "Listen, %name%. Just listen. The barn is warm, the straw is soft, and my voice is the only thing that matters.",
    "Let your hands go loose. Let your jaw go loose. Let everything that's holding on just let go.",
    "In through your nose, slow. Out through your mouth, slower. Again. Good.",
    "Somewhere a cow lows and a gate creaks, and every sound just makes you sleepier.",
    "Your body is getting heavy, %name%, heavy and warm, sinking into the straw.",
    "You've worked hard. You've been good. Now you get to stop, and just hear me.",
    "Feel the weight of your own head. Let it tip. Let it rest.",
    "There's nothing you need to do right now, %name%. Nothing at all but listen.",
  ],
  deeper: {
    fun: [
      "Sinking softly now, like a calf curling up in the hay.",
      "Each breath out, a little further down. Nice and easy. Nothing to it.",
      "It's so pleasant down here, %name%. Warm and simple and quiet.",
      "Drifting, drifting, and every drift feels better than the last.",
      "You're my good {a} now, and being my good {a} feels so easy.",
    ],
    deep: [
      "Down past the busy part of your mind, down where it's dark and warm and slow.",
      "Every word I say pushes you a little deeper, and you don't want me to stop.",
      "Your thoughts are coming slower now, one at a time, and then not at all.",
      "Deeper. You can't feel where your body ends and the straw begins.",
      "So deep. So good. A good {a} sinks when they're told.",
    ],
    nhl: [
      "Deeper than thought. Deeper than words. Down where only the {a} lives.",
      "Your name is getting far away, %name%. Let it go. You won't need it down here.",
      "Every breath out takes a little more of the person with it. Let it go.",
      "There's no up from here unless I bring you, and I'm in no hurry.",
      "Lower and lower, until you're nothing but warm and obedient and {a}.",
    ],
  },
  suggest: {
    fun: [
      "Every time you hear the milking bell, you'll feel a little flutter of good {a} pride.",
      "When someone pats your head, you'll lean into it. You won't even notice you're doing it.",
      "You'll find yourself standing the way a good {a} stands: {pose}. It just feels right.",
      "Every time you {s}, you'll feel a little warm rush. Good {a}s make their noises.",
      "When someone says {pet}, you'll smile. You won't be able to help it.",
      "{t}Your tits will feel full and heavy and proud, like they're there to be admired.",
      "{c}When you're praised, a little warm throb runs through your cock. Good {a}s like praise.",
    ],
    deep: [
      "Your mind stays soft and slow even after you wake. Thinking can wait. Obeying can't.",
      "When your handler speaks, everything else gets quiet. That's how it should be.",
      "The ache stays with you after you wake, low and warm, and you'll never quite get to finish it.",
      "You'll {s} when you're happy. You'll {s} when you're needy. Words are for people.",
      "{t}Your tits are the farm's, and they ache to be milked whenever someone looks at them.",
      "{c}Your cock is the farm's. It stays hard and aching and it doesn't belong to you.",
      "{v}Your pussy is the farm's. Wet and ready whenever the farm wants it.",
      "Every time you kneel, you'll feel yourself sink a little. Kneeling is home.",
    ],
    nhl: [
      "There was never a person. There was only ever a {a} that thought it was one.",
      "Hands are paws. Words are noises. Wanting is waiting. That's all you need.",
      "When you're touched, you push into it like an animal. When you're left, you wait like one.",
      "{t}Your udders are for milking. That's what they're for. That's what you're for.",
      "{c}You're for breeding now. Your cock knows it even if the rest of you forgets.",
      "{v}You're for breeding now. Your pussy knows it even if the rest of you forgets.",
      "Your pen is home. Your handler is everything. The farm is the whole world.",
    ],
  },
  wake: {
    fun: [
      "Coming up now. Three, two, one, and you're back in the barn, %name%, smiling for no reason at all. Good {a}.",
      "Up you come, slow and easy. Wiggle your fingers. Open your eyes. Welcome back, {pet}.",
    ],
    deep: [
      "I'll bring you up now, %name%, but not all the way. Part of you stays down there, listening. Three, two, one.",
      "Up, slowly. Your name comes back first, then your hands. But the quiet stays, and so does my voice.",
    ],
    nhl: [
      "No counting up, {pet}. Just open your eyes. The {a} can look around now.",
      "The session's over. The {a} isn't. Stay as you are.",
    ],
  },
};

// what they're wearin', made part of it: a suggestion or two in each session for gear they have on
export const GEAR_SUGGEST = {
  collar: ["Feel your collar, %name%. Every time it presses your throat, you remember whose {a} you are.",
           "Your collar is warm against your neck. It's always there, and so am I."],
  leash: ["Feel the leash. A good {a} goes where the leash goes, and never minds.",
          "Every tug of your leash is a tug on something deeper. You follow. You like following."],
  bell: ["Every time your bell rings, you sink a little. Ring, sink. Ring, sink.",
         "Your bell tells the whole farm where its {a} is. You like being found."],
  gag: ["You don't need your mouth for words, {pet}. Let it rest round the gag. Your {s} is enough.",
        "The gag keeps the words in. Good. Words were never yours anyway."],
  blind: ["You can't see, and you don't need to. My voice is the only thing to follow.",
          "In the dark behind the blindfold, there's only my voice and the warm straw."],
  hood: ["Inside the hood, there's no face to be. There's only the {a}.",
         "The hood holds you close and quiet. Nothing in here but my voice."],
  paws: ["Your hands are paws now. Paws don't grab. Paws don't hold. Paws wait.",
         "Feel how useless your paws are. Isn't it a relief, not having to do anything with them?"],
  arms: ["Your arms are tied, so you don't have to decide anything with them. Let them rest.",
         "Bound, you're free of choices. Just a {a}, held still, listening."],
  cage: ["{c}Your cage keeps you good. You don't need to touch. You don't even want to.",
         "{c}Every throb against your cage is the farm reminding you who it belongs to."],
  nipples: ["That little bite at your nipples is the farm's hand on you. Feel it, and sink.",
            "Your clamped nipples throb in time with my voice. Every throb, a little deeper."],
  latex: ["Your latex is your hide now. Smooth, shining, nothing human under it.",
          "Feel how the rubber holds you. Tight. Close. Like it's keeping the {a} in."],
  harness: ["Your harness holds you like a farm holds its stock. Snug, and safe, and owned.",
            "Feel every strap of your harness. Each one says: tack, not clothes."],
  ears: ["Feel your ears. They twitch at my voice, don't they. {a}s' ears always do.",
         "Your ears are listening harder than you are. Let them."],
  tail: ["Feel your tail. It moves when you're happy, and you're happy now.",
         "Your tail is part of you. It always was."],
  hooves: ["Your hooves keep you up on your toes, the way a good {a} should stand.",
           "Feel the weight of your hooves. You weren't made for walking like a person."],
  noseRing: ["Your nose ring is where a handler leads a good {a}. You'll follow it anywhere.",
             "Feel the ring in your nose. One tug, and you'll come."],
};
