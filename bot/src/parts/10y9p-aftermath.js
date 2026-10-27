  /* WHAT'S IN THIS FILE (10y9p-aftermath.js)
     HOW THEY'RE LEFT (Laynie, Oct 27: "aftermath lines, yes").
     • A little while after a trap lets go (7 to 12 seconds), now and then (about two times in five) the room sees one
       more line: how they're left. It goes by what actually happened to them in it: still full and drippin', a clutch
       in them, milked out, a mess on them, gear it left on them, rope marks, a big stud's walk, a heat it started, a
       head still foggy, a crowd that watched. Nothin' in particular: a plain one.
     • Not if another trap's already got them, or they've gone.
  */
  if (CFG.AFTER_CHANCE === undefined) CFG.AFTER_CHANCE = 0.4;
  if (CFG.AFTER_DELAY === undefined) CFG.AFTER_DELAY = [7000, 12000];   // how long after it lets go
  function heldNow(mn){ try { return heldTotal(prodOf(mn)); } catch(e){ return 0; } }
  const AFTER_LINES = {
    filled: [
      "%n doesn't get up right away once it lets go. They lie there a while with one hand on a belly that's rounder than it was, feelin' it slosh when they breathe.",
      "Every step %n takes away from it leaves a little drip behind them. They give up tryin' to clench and just waddle.",
      "%n sits back on their heels, and somethin' warm runs out of them onto the ground. They watch it go with a dazed little smile.",
      "When %n finally stands, it all shifts inside them at once, and they have to grab the nearest post and wait for their knees to remember how.",
      "%n's belly sticks out round and tight, and they keep pressin' on it to see if it's real. It is. Somethin' squelches.",
      "Folk passin' can tell exactly what just happened to %n: the walk gives it away, and so does the shine runnin' down the backs of their thighs.",
      "{v}%n's pussy is still twitchin', puffy and well used, and every twitch squeezes out a little more of what it left in them.",
      "{nv}%n's ass is still gapin' a little, slick and sore, and they keep reachin' back to check it's closed. It isn't, quite.",
      "%n tries to stand up straight and gives up halfway, one arm round their full belly, the other on the small of their back like somebody twice their age.",
      "Ten steps on, %n is still leakin'. They stop, look down at the trail they've left, and decide not to think about it.",
      "%n's belly gurgles, loud, and three people turn round. %n pretends it was somebody else.",
      "{v}%n presses their thighs together as hard as they can and still feels it seep out of them, warm and slow, all the way across the yard.",
    ],
    hole: [
      "%n's %h won't quite close after that. They can feel the cool air on it, and what's left inside slidin' out a little at a time.",
      "Somethin' thick runs out of %n's %h when they finally stand, and keeps runnin', down one leg to the ankle.",
      "%n clenches their %h as hard as they can and still drips. They waddle off with their thighs pressed together, leavin' a trail.",
      "Every time %n laughs, coughs or bends over for the next few minutes, their %h lets go of another warm spurt.",
      "%n reaches back, touches their %h, and their fingers come away soaked. They wipe them on their thigh, which doesn't help either of them.",
    ],
    eggs: [
      "%n stands up slow and careful, carryin' the clutch like a full bucket. They can feel every one of the %x eggs shift when they move.",
      "%n's belly is heavy and lumpy with eggs, and they walk like it, wide and slow, one hand underneath to hold the weight.",
      "Somethin' inside %n turns over, one egg nudgin' another, and they stop dead with a soft little moan till it settles.",
      "%n pats the hard round swell of their belly, counts in their head, loses count, and gives up. A lot. It's a lot of eggs.",
      "Every step makes the eggs in %n click softly together, and they blush every time somebody hears it.",
      "%n keeps one hand on their belly all the way across the yard, broody already, coverin' the clutch from anybody lookin'.",
      "%n has to sit down on the first bale they find. %x eggs is a lot to carry on legs that wobbly.",
    ],
    milked: [
      "{t}%n's tits ache, empty and tender, nipples still stretched long and red from the suction. They cup them gingerly and wince.",
      "{t}%n tugs their top back over teats so sore even the cloth makes them gasp. Not a drop left in them, and already they can feel them startin' to fill again.",
      "%n's legs are wobbly from bein' milked that hard, and they lean on the fence a minute, catchin' their breath, every pull still echoin' through them.",
      "{c}%n's balls feel light and hollow, drained to the last drop, and their cock still twitches now and then like it hasn't heard it's over.",
      "{t}A last bead of milk wells up on %n's nipple and runs down. They're too tired to wipe it.",
      "%n walks off loose-limbed and dopey, milked out and floatin' on it, like a cow headed back to pasture.",
    ],
    messy: [
      "%n stands there drippin' and tries to wipe their face with a hand that's just as sticky. It doesn't help. It doesn't help at all.",
      "Whatever's on %n is startin' to dry, tight and tacky on their skin, and they peel a strip of it off their arm with a grimace.",
      "%n leaves sticky footprints all the way across the yard. The barn cats follow them with great interest.",
      "%n licks a bit off their own lip, considers it, and licks again.",
      "The mess on %n is everywhere: in their hair, between their fingers, in places they won't find till bedtime.",
      "Somebody tosses %n a towel. It's not nearly enough towel.",
      "%n tries to shake it off like a wet dog. It mostly goes on the people standin' nearest.",
    ],
    gear: [
      "%n's still wearin' the %c when it lets go of them, and it doesn't look like it's comin' off any time soon.",
      "%n gives the %c a tug. It stays exactly where the trap put it.",
      "The %c stays on %n as they walk off, a little reminder for everybody who sees them of where they've been.",
      "%n catches sight of themself in the water trough: still in the %c, and lookin' thoroughly had.",
    ],
    tied: [
      "%n rubs at the red lines the ropes left round their wrists. They'll wear them a while, plain for anybody to see.",
      "%n's arms are pins and needles from bein' held so long. They shake them out, wincin' as the feelin' comes back.",
      "Rope marks crisscross %n's skin where it held them, pretty as lace. They trace one with a fingertip.",
      "%n stretches, slow and stiff, every joint creakin' after bein' held in one spot that long.",
      "%n stumbles a step when they're let loose, legs gone wobbly from standin' trussed so long.",
    ],
    stud: [
      "%n walks off bow-legged, and anybody watchin' knows exactly how big whatever had them was.",
      "%n's hips ache in that deep, well-used way, and their legs won't quite close. They stop worryin' about lookin' dignified.",
      "%n's still feelin' the stretch of it, the shape it left behind inside them, and they shiver every few steps.",
      "There's a bruise comin' up on each of %n's hips, the exact size and shape of a big pair of hands.",
      "%n smells of whatever had them: musk and sweat and somethin' wild. It'll be on them all day.",
      "%n gets about three steps before they have to stop, lean on the fence and wait for their legs to stop shakin'.",
    ],
    heat: [
      "%n's still flushed and squirmin' when it lets go, and the heat it left in them isn't goin' anywhere. Every breeze feels like a hand.",
      "%n rubs their thighs together walkin' away, already lookin' round for whoever might help with the itch it left them.",
      "The heat hits %n properly about a minute after, a slow pulse low down that has them bitin' their lip.",
      "%n fans themself with one hand, cheeks pink, and it does nothin' at all for the fire it lit in them.",
    ],
    fog: [
      "%n blinks, and blinks again, and comes back to themself slowly, the last of the fog driftin' out of their head.",
      "%n stands very still for a while after, smilin' at nothin', till somebody says their name and they jump.",
      "%n can't quite remember the last few minutes. They remember how good it felt, though. That part stays.",
    ],
    watched: [
      "Somebody in the crowd claps as %n is let go. Somebody else whistles. %n goes red to the ears.",
      "%n can feel eyes on them all the way across the yard. Everybody saw. Everybody's goin' to talk about it.",
      "A farmhand chalks a mark on the board by the gate as %n passes. Another one for the tally.",
      "\"Good show,\" somebody calls after %n. They don't turn round. Their ears are burnin'.",
    ],
    plain: [
      "%n sits in the dirt a minute after it lets go, blinkin', tryin' to remember what they were walkin' over here for.",
      "%n gets up slow, dusts themself off, and looks round to see who saw. Everybody saw.",
      "Free, %n takes a long, shaky breath, then another, and walks off a good deal more carefully than they walked in.",
      "%n's heart's still poundin'. They press a hand to their chest and laugh, breathless, at nothin' in particular.",
      "%n stands there a moment, glowin', thoroughly undone, and then goes lookin' for somethin' to drink.",
      "%n checks themself over: everything's still where it should be, and there's a dopey grin on their face they can't get rid of.",
      "%n's knees give out and they sit down hard in the straw. They stay there. It's comfy.",
      "%n wanders off in a daze, hair every which way, and walks right into a fence post.",
    ],
  };
  const AFTER_FOG = ["lantern", "mirror", "vampire"];
  // what the room sees a little after a trap's done with them
  function afterLines(mn, kind, before){
    if (Math.random() >= CFG.AFTER_CHANCE || !TRAP_KINDS[kind]) return;
    const r = rec(mn), p = prodOf(mn), b = before || {}, v = {}, pools = [];
    const got = heldNow(mn) - (b.held || 0);
    if (b.held != null && got >= 80){
      pools.push("filled");
      const hd = p.held || {}, hole = ["vulva", "butt"].filter(h => (hd[h] || 0) > 30).sort((x, y) => (hd[y] || 0) - (hd[x] || 0))[0];
      if (hole){ v.h = TRAP_HOLE[hole]; pools.push("hole"); }
    }
    if (p.eggs && p.eggs.n > (b.eggs || 0) && b.eggs != null){ v.x = String(p.eggs.n); pools.push("eggs"); }
    if (b.milk != null && (b.milk - (p.milk || 0)) >= 150) pools.push("milked");
    const tags = trapTagsOf(kind);
    if (MESS_BY_TRAP[kind] || tags.includes("messy")) pools.push("messy");
    const worn = Object.values(r.gear || {}).filter(g => g.src === "trap" && g.until > Date.now() + 60000).pop();
    if (worn && (TRAP_GEAR[kind] || []).some(g => g.when === "after")){ v.c = worn.label; pools.push("gear"); }
    if (tags.includes("restraint")) pools.push("tied");
    if (ANTHRO[kind]) pools.push("stud");
    if (b.heat === false && inHeat(p)) pools.push("heat");
    if (AFTER_FOG.includes(kind)) pools.push("fog");
    if (tags.includes("public") && (W.ChatRoomCharacter || []).length > 3) pools.push("watched");
    const key = pools.length ? pools[Math.floor(Math.random()*pools.length)] : "plain";
    later(() => {
      if (!charFor(mn) || (state.trapRuns && state.trapRuns.has(mn)) || (rec(mn) || {}).trapWait) return;
      emote("👣 "+tFill(pickFor(mn, "after:"+key, AFTER_LINES[key]), mn, v), mn);
    }, CFG.AFTER_DELAY[0] + Math.random()*(CFG.AFTER_DELAY[1] - CFG.AFTER_DELAY[0]));
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __afterLines: () => AFTER_LINES });
