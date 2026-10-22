  /* WHAT'S IN THIS FILE (10ug-wash.js)
     ?WASH, a proper scrub (Laynie, Oct 22: "?wash needs more beats, and to reliably wash all messes off"). Four beats at
     the trough: the water, the scrub, the rinse, the towel. When it's done, everything the farm put on them comes off:
     their Companion's messes and splatters and writing (10s-marks.js, the Companion's messes.js), what a trap left
     (mud, slime, glue, the reek), and what was painted on. Washin' somebody else (staff: ?wash <who>) tells it about them.
     Only one wash at a time each; a second ?wash while one's goin' just says so.
  */
  const WASH_LINES = {
    start: [
      "%n steps up to the wash trough and somebody hands them a bucket, a brush and a cake of yellow soap. \"Go on, then.\"",
      "A farmhand drags the hose over to %n, thumbs the nozzle and grins. \"Hold still, you mucky thing.\"",
      "%n climbs into the big tin wash tub by the pump while a farmhand works the handle, and the first cold gush makes them yelp.",
      "The wash-down stall's free. %n steps in, the gate swings shut, and the water comes on warm from the tank on the roof."],
    scrub: [
      "The brush goes round in hard soapy circles, shoulders first, then down the back, and the water underneath runs every colour of the farm.",
      "Soap suds pile up on %n like a snowdrift, and a farmhand scrubs behind their ears and under their chin like they're a muddy calf.",
      "{t}The suds go on thick over %n's tits and the brush works round and round them, slow, till every sticky streak is gone.",
      "{c}A soapy hand works down %n's cock and balls, thorough as a groom with a show bull, and doesn't hurry.",
      "{v}The farmhand soaps between %n's legs with a flat warm hand, front to back and again, till the last of the mess slides off.",
      "Every crease gets the brush: elbows, knees, the backs of the thighs, the soft places between. %n squirms and the farmhand just scrubs harder."],
    rinse: [
      "Then the rinse: a whole bucket over the head, cold, and the suds run off %n in a white sheet and gurgle away down the drain.",
      "The hose sweeps over %n from crown to heels, slow, chasing the last of the soap, and the water at their feet runs clear at last.",
      "Somebody tips a bucket of warm water over %n's head, then another, then a cold one for luck, and the farm's mess goes swirlin' off down the gutter.",
      "%n stands under the pump with their eyes shut while the water pours, and every last drip of it washes off clean."],
    dry: [
      "A rough towel, a brisk rub all over, and %n steps out pink and squeaky and smellin' of nothin' but soap. Clean, for now.",
      "The farmhand wraps %n in a sun-warm towel and rubs them dry like a foal. Not a speck left on them. It won't last.",
      "%n is towelled off, fluffed up and sent on their way scrubbed raw and clean as a new pail. The farm will fix that soon enough.",
      "Wrung out, rubbed down and squeaky clean from scalp to toes, %n shakes off the last drops like a dog."],
  };
  function washNow(t){
    bodyMark(t, { wash: true });   // their Companion: the messes, the splatters, the writing (10s-marks.js)
    const p = prodOf(t); if (p) p.painted = null;
    aftermathWash(t);              // mud, slime, glue, the reek a trap left (10x-trap-extras.js)
    saveLedger(); syncCompanions(true);
  }
  function washScene(t, by){
    state.washing = state.washing || new Map();
    if (state.washing.get(t) > Date.now()){ tell(by, "🚿 "+(t === by ? "You're" : plainName(t)+" is")+" already at the wash trough, sugar."); return; }
    if (!onMap(t)){ washNow(t); tell(by, "🚿 All washed up, sugar: everything the farm put on "+(t === by ? "you" : plainName(t))+" is off."); return; }
    const beats = ["start", "scrub", "scrub", "rinse", "dry"], gap = CFG.WASH_BEAT_S*1000;
    state.washing.set(t, Date.now() + beats.length*gap + 5000);
    const beat = (k, i) => {
      try {
        emote("🚿 "+tFill(pickFor(t, "wash:"+k+":"+i, WASH_LINES[k]), t), t);
        if (i === beats.length - 1){ washNow(t); state.washing.delete(t); }
      } catch(e){ warn("wash:", e); washNow(t); state.washing.delete(t); }
    };
    beats.forEach((k, i) => i === 0 ? beat(k, i) : later(() => beat(k, i), i*gap));   // (the first one at once, so they know it's started)
  }
