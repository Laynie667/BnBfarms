  /* WHAT'S IN THIS FILE (10g-scenes.js)
     Little scenes for hands-on farm work: milkin' by hand, collectin' a stud, breedin' by machine or by
     syringe, and edgin' (a cock or a pussy). Instead of one line, each plays out in beats, 15–25 seconds
     apart, seen by whoever's nearby (speaker spots work as usual), with the farm girl chimin' in now and
     then. The numbers (mL, the jar, a pregnancy) are counted the moment the command runs, so the command
     always answers; the scene tells the story around it, and stops quietly if they leave the map.

     A beat: t = the line · d = instead, for people with ?degrade on · p = instead, for ?praise on ·
     say: true = the farm girl says it out loud instead of an emote.
     Every emote line must say %n: it's posted by that person's own Companion, which only posts lines naming them.
     %n = them · %b = whoever's doin' it · %m = the machine · %h = the hole · %ml = how much · %stud = the jar's stud
  */
  /* ───────────── SCENES ───────────── */

  const HOLE_WORD = { vulva:"pussy", butt:"ass", mouth:"throat" };
  const SCENES = {
    milk: [
      { t:"%b kneels beside %n with the pail and warms their hands, then cups a heavy breast and gives it a slow, testing squeeze." },
      { t:"A first thin stream rings against the bottom of the pail. %n lets out a shaky breath as the milk starts to let down.",
        d:"A first thin stream rings against the pail. \"Listen to that, %n,\" %b says. \"Good little dairy animal, leaking for me already.\"" },
      { t:"%b finds the rhythm on %n: squeeze, pull, release. Warm milk spurts into the pail in steady, foaming streams.",
        p:"%b finds the rhythm, murmuring praise with every pull. \"There you go, %n, sweet thing. So much. So good.\"" },
      { say:true, t:"That's it, %n. Let it all down for the farm, hon." },
      { t:"%b switches sides. The second breast is so full it sprays the moment it's touched, and %n moans and arches into the hands.",
        d:"%b switches sides, and %n sprays the moment they're touched. \"Can't even hold it in. Pathetic, leaky cow.\"" },
      { t:"The pail's warm and heavy now. %b strips the last drops out with long, firm pulls until %n's teats are soft and tender: %ml in the pail." },
    ],
    milkSelf: [
      { t:"%n settles over the pail and cups their own breast, squeezing slow and steady." },
      { t:"Milk starts to spurt into the pail, and %n sighs at the relief of it." },
      { t:"%n works one side, then the other, rocking a little with the rhythm, warm milk foaming in the pail." },
      { t:"%n squeezes out the last drops and sits back, flushed and lighter: %ml in the pail." },
    ],
    collect: [
      { t:"%b sets the collection jar in place and wraps a slick, gloved hand around %n's cock, stroking slow from root to tip." },
      { t:"%n's hips start to twitch. %b keeps the pace steady and patient, thumb rubbing under the head each time.",
        d:"%n's hips start to twitch. \"Look at you, humping air for it,\" %b says. \"Breeding stock with no one to breed.\"" },
      { say:true, t:"Easy, %n. Every drop goes in the jar, hon." },
      { t:"%b squeezes tighter and speeds up, other hand cupping and rolling %n's balls. %n is panting and leaking." },
      { t:"%n groans and bucks as they spill, thick ropes pumping into the jar while %b milks every pulse out of them.",
        p:"%n groans and bucks as they spill, and %b murmurs \"good stud, good stud\" while milking out every pulse." },
      { t:"%b caps the jar and holds it up to the light: %ml of %n's seed, labelled and on the shelf." },
    ],
    collectSelf: [
      { t:"%n sets the collection jar in place and takes themselves in hand." },
      { t:"%n strokes faster, breath hitching, aiming carefully at the jar." },
      { t:"%n spills into the jar with a groan, every pulse caught: %ml bottled for the farm." },
    ],
    machine: [
      { t:"%b loads the jar of %stud's seed into the %m's reservoir and checks the fit. The machine hums and the attachment slides into %n's %h." },
      { t:"The %m starts slow, deep strokes, letting %n get used to it. Every push nudges the seed reservoir with a soft, wet click.",
        d:"The %m starts slow and deep in %n. \"Don't look so surprised,\" %b says. \"This is how we breed the ones nobody wants to touch.\"" },
      { say:true, t:"Breedin' machine's runnin', y'all. %n's gettin' %stud's seed whether %stud's here or not." },
      { t:"The pace picks up. %n rocks with the %m, breath coming in gasps, the whole frame creaking." },
      { t:"%b turns the dial up. The %m pounds into %n's %h, hard and relentless, and %n can't stay quiet.",
        p:"%b turns the dial up and strokes %n's hair. \"You're doing so well. Take it all. Good breeder.\"" },
      { t:"The reservoir gurgles. The %m holds deep and pumps, flooding %n's %h with %stud's seed in long, warm surges." },
      { t:"The %m keeps going in %n a while longer, slow and deep, working every drop as far in as it'll go." },
      { t:"The %m eases off and slides out. %n is left shaking and full: %ml of %stud's seed, all of it inside." },
    ],
    syringe: [
      { t:"%b fills the long syringe from jar #%jar and lays a firm hand on %n's hip to hold them still." },
      { t:"The tip slides into %n's %h, slow and deep, and %b takes a moment to settle it just right.",
        d:"The tip slides into %n's %h. \"Hold still, breeder. You don't get a stud, you get a syringe.\"" },
      { t:"%b pushes the plunger down slowly. %n gasps at the warm, heavy fill." },
      { t:"%b slides it out and keeps a hand pressed over %n's %h a moment so nothing leaks: %ml of %stud's seed, all the way in." },
    ],
    edgeVulva: [
      { t:"%b slips a hand between %n's thighs and starts slow circles, teasing, until %n's hips start to follow." },
      { t:"%b works two fingers into %n's pussy and curls them, thumb rubbing faster. %n's breath goes ragged and high.",
        d:"%b works two fingers into %n's dripping pussy. \"Listen to how wet you are. Desperate little breeding hole.\"" },
      { t:"%n is right there, trembling, about to tip over, and %b pulls their hand away and steps back. Edge number %k.",
        p:"%n is right there, and %b pulls away gently. \"Not yet, sweet thing. You're being so good for me. Edge number %k.\"" },
    ],
  };

  // one scene per person at a time; a second one while it runs just gets a single line
  function runScene(key, t, vars, onEnd){
    state.sceneRun = state.sceneRun || new Map();
    const beats = SCENES[key], r = rec(t) || {};
    if (!beats || state.sceneRun.has(t)) return false;
    const id = Symbol(key);
    state.sceneRun.set(t, id);
    const cue = { milk:["milked","pail"], milkSelf:["milked","pail"], collect:["milked","wet"], collectSelf:["milked","wet"],
                  machine:["bred","machine"], syringe:["bred","wet"], edgeVulva:["edged",null] }[key];
    if (cue){ face(t, cue[0], 120); if (cue[1]) sound(t, cue[1]); }
    const fillV = s => String(s).replace(/%(\w+)/g, (m, k) => vars[k] !== undefined ? vars[k] : m);
    let i = 0;
    const step = () => {
      if (state.sceneRun.get(t) !== id) return;                       // replaced or stopped
      if (!onMap(t)){ state.sceneRun.delete(t); return; }             // they left: stop quietly
      const b = beats[i++];
      if (!b){ state.sceneRun.delete(t); if (onEnd) try { onEnd(); } catch(e){ warn("scene end:", e); } return; }
      const line = fillV((r.degradeMe && b.d) || (r.praiseMe && b.p) || b.t);
      // a line that starts with whoever's doin' it comes from them (their Companion posts it); the rest from the one it's done to
      const from = vars.bMn && vars.b && line.startsWith(vars.b) ? vars.bMn : t;
      if (b.say) say(line, false, t); else emote(vars.icon+" "+line, from);
      later(step, (15 + Math.random()*10)*1000);
    };
    step();
    return true;
  }
  // ?safe stops a scene at once
  function stopScene(t){ if (state.sceneRun) state.sceneRun.delete(t); }
