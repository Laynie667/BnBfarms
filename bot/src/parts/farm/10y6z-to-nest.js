  /* WHAT'S IN THIS FILE (10y6z-to-nest.js)
     TO THE NEST (Nov 23; from the suggestion box, Crystal's #30: "There is mention of a "nest" for laying eggs in a few
     places, but it's kind of hard to figure out where that actually is"; Laynie: "We can possibly stick a chicken there,
     or add a "Move to nest" command or button").
     ?nest walks them to the farm's nest (the spot staff set with ?spot set nest; the nearest, if there's more than one),
     where ?lay and ?gather work. Their Companion shows a "🥚 To the nest" button while they're carryin' eggs.
  */
  function toNest(mn, R){
    const names = nestSpots(); if (!names.length){ R("🥚 The farm hasn't got a nest set up yet, sugar. Staff make one with ?spot set nest."); return false; }
    const C = charFor(mn), pos = C && C.MapData && C.MapData.Pos;
    const pts = names.map(n => spotFor(n)).filter(Boolean);
    const d = (p) => pos ? Math.abs(p.X - pos.X) + Math.abs(p.Y - pos.Y) : 0;
    const pt = pts.sort((a, b) => d(a) - d(b))[0];
    if (!pt){ R("🥚 I can't find the nest on the map right now, sugar."); return false; }
    if (!C){ R("🥚 You've got to be here on the farm for that, sugar."); return false; }
    if (pos && d(pt) === 0){ R("🥚 You're sittin' right on the nest, sugar. ?lay when you're ready."); return true; }
    if (!teleport(mn, pt, true)){ R("🥚 You're tied to somethin' and can't go just now, sugar."); return false; }
    const p = prodOf(mn);
    R("🥚 Off to the nest with you, sugar."+(p && p.eggs ? " Settle in, and ?lay when they're ready to come." : " ?gather collects what's in it."));
    return true;
  }
  addCommand("nest tonest", { topic: "breeding", run: (c) => toNest(c.sender, c.R) });
