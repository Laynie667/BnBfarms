/* WHAT'S IN THIS FILE (glory-stalls/scenes.js)
   The six simulated stall scenes: two each for mouth, pussy and ass. Each is about 5 minutes: a beat
   every 22–32 seconds, slow build-up, a finish, and an afterglow.

   How a beat works:
     t: the line everyone gets
     d: the line used instead when the person in the stall has ?degrade on (leave it out to use t)
     f: mouth scenes only, the line used instead when they're wearing a funnel gag
     finish: true marks the moment the stranger cums (that's when it's counted)
   %name% is the person in the stall. The stranger is never named.

   To add a scene, copy one block, give it a new id, and keep a finish: true beat in it.
*/
export const SCENES = [
  // ───────────── MOUTH ─────────────
  {
    id: "mouth-greedy", hole: "mouth", label: "Greedy",
    beats: [
      { t: "Footsteps stop on the other side of the stall. Fabric rustles, a belt buckle clinks, and %name% hears someone breathing hard and close to the boards." },
      { t: "A hand slaps the wall twice, impatient. Then a cock pushes through the hole, already hard and flushed dark, bobbing an inch from %name%'s lips and smelling of sweat and musk.",
        d: "A hand slaps the wall twice, the way you'd call a dog to its bowl. A cock pushes through the hole, already hard and flushed dark, bobbing an inch from %name%'s lips. \"Come on, hole. Earn your keep.\"" },
      { t: "It nudges at %name%'s mouth, smearing a slick bead across their lips, rubbing back and forth until they open up." },
      { t: "The moment they do, it shoves in over their tongue. The stranger groans through the boards and grinds the base right up against the hole, holding %name% full for a long moment." },
      { t: "Then the pace starts: quick and greedy, the wall creaking with every thrust, drool running down %name%'s chin and dripping onto their chest.",
        d: "Then the pace starts, quick and greedy, the wall creaking with every thrust. \"That's it. Just a mouth on a wall. Nobody even has to see your face.\" Drool runs down %name%'s chin and drips onto their chest." },
      { t: "The stranger finds the back of %name%'s throat and likes it there, pushing deeper each time, pulling back only long enough to let them gasp." },
      { t: "Fingers curl through the hole and catch in %name%'s hair, dragging them flush against the wood so there's nowhere to go but down.",
        d: "Fingers curl through the hole and catch in %name%'s hair, dragging them flush against the wood. \"Stay. Good little cocksleeve. Don't you dare pull off.\"" },
      { t: "Wet sounds fill the stall. %name%'s eyes water, and their throat flutters around every stroke as the stranger's breathing goes ragged." },
      { t: "The thrusts turn short and jerky. A low, desperate groan comes through the boards. Whoever's out there is right on the edge." },
      { t: "With one last shove the stranger buries themselves to the hilt and spills, thick and hot, pulse after pulse down %name%'s throat until they have to swallow or choke.",
        f: "With one last shove into the funnel the stranger spills, thick and hot, pulse after pulse pouring down the funnel and straight into %name%'s throat. They don't get a choice about swallowing.",
        finish: true },
      { t: "It slides out slowly, dragging a last string of cum across %name%'s lips. The belt buckle clinks again and the footsteps fade, without a word.",
        d: "It slides out slowly, wiping itself clean on %name%'s cheek. \"Good hole.\" The belt buckle clinks and the footsteps fade, and %name% is left licking their lips for the next one." },
    ],
  },
  {
    id: "mouth-slow", hole: "mouth", label: "Taking their time",
    beats: [
      { t: "Someone settles in outside the stall, unhurried. A bench creaks as they sit, as if they mean to stay a while." },
      { t: "A cock slips through the hole, half hard, and simply rests there against %name%'s lips. Warm and heavy, waiting to see what they'll do." },
      { t: "When %name% kisses the tip, the stranger sighs, and it twitches and thickens against their mouth.",
        d: "When %name% kisses the tip, the stranger chuckles. \"Look at that. Didn't even have to ask. You were made for this wall, weren't you?\"" },
      { t: "It eases in an inch at a time, letting %name% taste every bit of it, resting on their tongue before sliding a little deeper." },
      { t: "Slowly the stranger works their way down until %name%'s nose is pressed to the boards, and then holds there, patient, until their eyes start to water." },
      { t: "They pull out all the way, letting %name% drag in a breath, then slide right back to the root. Over and over, slow and deep, never in a hurry.",
        d: "They pull out all the way, let %name% drag in a breath, then slide back to the root. \"Breathe when I let you. That's all you need to think about.\"" },
      { t: "A thumb pokes through beside the cock and strokes %name%'s cheek, feeling the shape of it moving inside their mouth." },
      { t: "The rhythm stays maddeningly slow, but the stranger's breathing doesn't. Every stroke gets a soft, shaky moan through the wood." },
      { t: "They hold deep and start to grind in small circles, just rocking against the back of %name%'s throat, savouring it.",
        d: "They hold deep and grind in small circles against the back of %name%'s throat. \"Feel that? That's all you are right now. Somewhere warm to put it.\"" },
      { t: "With a long, shuddering groan the stranger finishes deep in %name%'s throat, holding them there through every pulse, leaving them nothing to do but swallow.",
        f: "With a long, shuddering groan the stranger finishes into the funnel, holding still while every pulse runs down into %name%'s throat. They swallow because it's the only thing to do.",
        finish: true },
      { t: "It softens slowly in %name%'s mouth before slipping out. A gentle pat lands on the wall, the bench creaks, and the stranger strolls away." },
    ],
  },

  // ───────────── PUSSY ─────────────
  {
    id: "pussy-rough", hole: "vulva", label: "Rough",
    beats: [
      { t: "Heavy boots stop behind the stall. Whoever this is doesn't knock. They just press against the boards, and the whole booth shifts." },
      { t: "Rough fingers find %name%'s pussy through the hole and spread them open, checking how wet they are without the slightest bit of care.",
        d: "Rough fingers find %name%'s pussy through the hole and spread them open. \"Already dripping. Course you are. Nobody ends up in this stall by accident.\"" },
      { t: "Two fingers shove in and curl, pumping hard, until %name%'s hips buck against the wall and the stall echoes with wet slaps." },
      { t: "The fingers pull out and something much thicker takes their place, the head pressing right against %name%'s entrance, rubbing up and down through the mess." },
      { t: "Then it slams in, all the way in one hard stroke, and %name% is pinned against the boards with the stranger buried inside them." },
      { t: "No easing in. The stranger pounds at a rough, steady rut, the booth thumping against its frame with every thrust.",
        d: "No easing in. The stranger pounds at a rough, steady rut. \"Look at you, taking it like a farm animal in a breeding crate. Exactly where you belong.\"" },
      { t: "Hands grip the edges of the hole, using the wall for leverage, driving every stroke deeper than the last." },
      { t: "%name% can't help the noises spilling out of them. The stranger only fucks harder at the sound, growling low through the wood.",
        d: "%name% can't help the noises spilling out of them. \"Louder. Let the whole barn hear what a needy little breeding hole sounds like.\"" },
      { t: "The rhythm stutters. The stranger is close, grinding in hard and short, the head of their cock battering right up against %name%'s cervix." },
      { t: "A growl rumbles through the stall as they bury themselves as deep as they'll go and unload, flooding %name%'s pussy with thick, hot pulses.", finish: true },
      { t: "They stay a moment, panting, then pull out. Warm cum runs down %name%'s thighs as the boots stomp off.",
        d: "They pull out and give the hole a slap for good measure. \"Keep that in.\" Warm cum runs down %name%'s thighs as the boots stomp off, and they're left dripping for the next one." },
    ],
  },
  {
    id: "pussy-breeder", hole: "vulva", label: "Breeder",
    beats: [
      { t: "Slow, deliberate footsteps. Someone stands outside the stall for a long moment, just looking at what's offered through the hole." },
      { t: "A warm palm lays flat over %name%'s pussy, then their lower belly, pressing gently, the way a farmer checks livestock.",
        d: "A warm palm lays flat over %name%'s belly and presses, the way a farmer checks a sow. \"Good hips. Good breeding stock. Let's see if you take.\"" },
      { t: "Thumbs spread %name% open and the stranger takes their time looking. Then the thick head of their cock nudges in, just the tip, holding there." },
      { t: "Inch by inch they sink in, slow and heavy, until their hips are pressed flat to the boards and %name% is stretched full around them." },
      { t: "They don't thrust so much as grind, rolling their hips deep and slow, keeping every inch inside." },
      { t: "A voice mutters low through the wood: \"Good. Hold still. Take it all.\"",
        d: "A voice mutters low through the wood: \"That's it. You're not here to enjoy it. You're here to get bred. Hold still.\"" },
      { t: "The grind gets heavier. The stranger leans their weight into the wall, the head of their cock nestled right against %name%'s cervix and staying there." },
      { t: "Their breathing goes deep and uneven. A hand reaches through and rests on %name%'s belly again, feeling them from the outside.",
        d: "A hand reaches through and rubs %name%'s belly. \"Gonna fill this up. Gonna leave you round and stupid with it.\"" },
      { t: "They start to swell and throb inside %name%, pressed so deep and so tight there's nowhere for anything to go but further in." },
      { t: "With a long groan they hold still and pump %name% full, every pulse pushed right up against the entrance to their womb.", finish: true },
      { t: "They stay locked in through every last throb, then wait a long moment more before finally slipping free, as if to make sure it takes." },
      { t: "Before leaving, a finger pushes back what tried to leak out. \"Keep it in.\" Then the footsteps slowly fade.",
        d: "Before leaving, a finger pushes back what tried to leak out. \"Keep it in, breeder. That's your whole job.\" Then the footsteps slowly fade." },
    ],
  },

  // ───────────── ASS ─────────────
  {
    id: "ass-steady", hole: "butt", label: "Steady",
    beats: [
      { t: "Someone hums to themselves outside the stall, unhurried, and %name% hears the wet click of a bottle cap." },
      { t: "Slick, cold fingers find %name%'s ass through the hole and circle slowly, smearing lube around until they twitch." },
      { t: "One finger presses in, patient, working them open, then a second, scissoring gently while %name% squirms against the wood.",
        d: "One finger presses in, then a second, scissoring them open. \"Relax. This hole doesn't get to say no. It just has to open.\"" },
      { t: "The fingers slide out and something much thicker presses in its place, blunt and slick and insistent." },
      { t: "It stretches %name% slowly, the head popping past the ring of muscle with a burning ache, then pushing steadily deeper." },
      { t: "The stranger settles in all the way, hips flush to the boards, and lets %name% feel how full they are before starting to move." },
      { t: "A firm, steady rhythm starts, long strokes that drag almost all the way out before sinking back in to the root.",
        d: "A firm, steady rhythm starts. \"There it goes. Look how easy you take it now. Practically made for the stall.\"" },
      { t: "The stall creaks in time. Every stroke pushes a small sound out of %name% whether they want it to or not." },
      { t: "The pace picks up. Hands brace on either side of the hole and the stranger drives in harder, chasing it now.",
        d: "The pace picks up. \"Squeeze. Earn it. You want the next one to have to wait in line, don't you?\"" },
      { t: "The rhythm stutters, a low moan comes through the wall, and they bury themselves deep, filling %name%'s ass warm and full.", finish: true },
      { t: "They stay inside a moment, softening, before easing out slowly. %name% feels it start to leak as the humming fades away down the aisle." },
    ],
  },
  {
    id: "ass-break", hole: "butt", label: "On their break",
    beats: [
      { t: "Quick footsteps, a glance up and down the aisle. Someone muttering about only having five minutes." },
      { t: "A zipper. A palm spits loudly through the hole and smears it across %name%'s ass. That's all the prep they're getting.",
        d: "A zipper. Someone spits right on %name%'s ass through the hole. \"That's plenty for a stall slut.\"" },
      { t: "The stranger lines up and pushes in, hard and impatient, forcing their way past the tight ring with a grunt." },
      { t: "No warm-up and no mercy: they use %name% hard and fast straight away, the booth thumping against its frame." },
      { t: "Hands grab the edge of the hole and pull, slamming hips against the boards. Every stroke punches the breath out of %name%.",
        d: "Hands grab the edge of the hole and slam hips against the boards. \"Christ, you're tight. Gonna fix that before I go.\"" },
      { t: "Somewhere down the aisle a door bangs. The stranger freezes for a heartbeat, buried to the hilt, then laughs under their breath and goes right back to it." },
      { t: "They're rushing now, grunting, rutting into %name% without any rhythm at all.",
        d: "They're rushing now. \"Nobody's coming to save you. You're a hole on a wall and I've got a break to finish.\"" },
      { t: "The thrusts go short and frantic. Their fingers dig into the wood around %name%. They're nearly there." },
      { t: "A sharp gasp, a final shove, and they're done, pumping %name% full in hard, hurried spurts.", finish: true },
      { t: "They pull out fast, wipe themselves on %name%'s thigh, and zip up. %name% is left dripping as the footsteps hurry off.",
        d: "They pull out fast and wipe themselves on %name%'s thigh. \"Thanks, hole.\" %name% is left dripping as the footsteps hurry back to work." },
    ],
  },
];

// extra lines through the wall, used between beats only for people with ?degrade on (about one in three beats)
export const TAUNTS = [
  "Someone passing by raps on the stall and laughs. \"Busy little hole today, huh?\"",
  "A voice from further down the aisle: \"Is that one any good?\" Another answers: \"It's a hole. It's fine.\"",
  "Somebody chalks another tally mark on the outside of %name%'s stall, loud enough to hear every stroke of it.",
  "A visitor reads the sign on the stall out loud and snorts. \"Stall number and a count. Doesn't even get a name.\"",
  "Two farmhands chat right outside about the weather, as if nobody's in there at all.",
];
