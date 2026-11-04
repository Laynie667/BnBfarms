  /* WHAT'S IN THIS FILE (10u8-mess-traps.js)
     Traps that are all about the mess (Laynie, Oct 15: "need to wire the new messes into traps. new traps for messes").
     Each leaves the farm's own drawn mess on them through their Companion ("Farm can mark my body" on), on top of the
     game's splatters:
       trap-fountain   the chocolate fountain: tipped in, held under the flow, and licked off by the farm hands
       trap-bakery     the bakery bench: piped with frosting from collar to knees, sprinkled, and served up
       trap-creamery   the creamery: the whippin' cannon, then strawberries, then somebody hungry
       trap-seedshower the seed shower: a ring of strangers round them in the back of the barn, and every one finishes on them
     Also here: the breedin' traps that fill somebody up leave cum, not whipped cream (they were drawn as cream
     before), and the older traps that splash milk, mud, piss or slime say which.
     %n name · %x what it is (the syrup, the frosting) · %ml how much
  */
  Object.assign(TRAP_KINDS, {
    fountain:   { icon: "🍫", what: "the chocolate fountain: tipped in, held under the flow, licked clean", limit: /\b(chocolate|food|messy|splosh|lick)/i },
    bakery:     { icon: "🎂", what: "the bakery bench: piped with frosting, sprinkled, and served", limit: /\b(cake|frosting|food|messy|splosh|humiliat)/i },
    creamery:   { icon: "🍓", what: "the creamery: whipped cream from the cannon, strawberries, and someone hungry", limit: /\b(cream|food|messy|splosh|lick)/i },
    seedshower: { icon: "💦", what: "the seed shower: a ring of strangers, and every one of them finishes on you", limit: /\b(bukkake|facial|cum|gang|public)/i },
  });
  // the breedin' traps leave what a breedin' leaves
  Object.assign(MESS_BY_TRAP, {
    pump: ["cum", ["tummy"]], saddle: ["cum", ["tummy"]], wheel: ["cum", ["tummy", "chest"]], scarecrow: ["cum", ["tummy", "chest"]],
    crate: ["cum", ["tummy"]], kissgate: ["cum", ["face", "tummy"]], collection: ["cum", ["tummy"]],
  });
  const MESS_LINES = {
    fountain: {
      beats: [
        ["The path tips %n forward into the base of the great chocolate fountain, and the warm brown curtain pours over their head.",
         "%n stumbles against the fountain's rim and two brass cuffs click shut, holding them right under the slow, warm flow.",
         "A hand on %n's back, a nudge, and they're kneeling in the fountain's bowl with chocolate sheeting down their hair and shoulders."],
        ["It runs everywhere: down the back of the neck, over the collarbones, in rivers between every curve and fold.",
         "{t}The chocolate pools between %n's tits and spills over, thick and glossy, sliding down to their belly.",
         "{c}It coats %n's cock in a slow brown sheath, drips off the tip and pools between their knees.",
         "{v}It finds its way between %n's legs, warm and slick, and keeps on finding it.",
         "The fountain keeps pourin'. %n can taste it on their lips, feel it settle into the small of their back."],
        ["Then the farm hands come with their spoons, and when the spoons are too slow, their tongues.",
         "Three of the hands take turns, lickin' it off %n's neck, their fingers, the backs of their knees, slow and greedy.",
         "{t}Somebody sucks the chocolate off %n's nipples one at a time, takin' their time about it.",
         "{c}Somebody kneels and licks the chocolate off %n's cock, root to tip, till they're shakin'.",
         "{v}A warm mouth works the chocolate out from between %n's legs, thorough and unhurried, and doesn't stop when it's gone."],
      ],
      end: ["The cuffs open and %n crawls out of the bowl, half licked clean and half still glazed, smellin' like a sweet shop.",
            "%n is let go glossy and brown in all the places nobody got to, sticky and flushed and very well tasted.",
            "When the hands are full, %n is left kneeling in the bowl, chocolate dryin' tacky in their hair."],
    },
    bakery: {
      beats: [
        ["A floury pair of hands steers %n onto the long bakery bench and the straps go over wrists, waist and knees.",
         "%n wanders past the bakery door and the baker hauls them in by the collar, laughin': just what the window needed.",
         "The bench is warm from the ovens. %n is laid on it and strapped down before they've worked out why it's so long."],
        ["The baker fills a piping bag and starts at the collarbones, rosettes in neat pink rows.",
         "Frosting goes on cool and sweet, swirled down %n's belly in long ribbons, the baker humming as they work.",
         "{t}Each of %n's tits gets a ring of rosettes and a cherry on top, very carefully placed.",
         "{c}The baker pipes a tidy spiral up %n's cock and steps back to admire it, then adds a few more.",
         "{v}A line of little frosting stars goes down, down, and right between %n's legs, the baker very pleased with themselves."],
        ["Sprinkles come next, a whole jar of them, shaken over everything and pressed in with a palm.",
         "The baker stands back, tuts, and adds another layer of frosting over the top, smoothed with a knife.",
         "A little card goes on %n's collar, and the bakery door is propped open so passers-by can see the window."],
        ["Customers come in. Some take a finger of frosting. Some take a lot more than that.",
         "A farm hand buys the first slice and eats it straight off %n's belly, licking the plate clean.",
         "Folk queue at the counter for a taste, and the baker rings every one of them up."],
      ],
      end: ["The straps come off and %n sits up, frosted and sprinkled and licked in patches, sugar crunchin' at every move.",
            "%n is let off the bench a walking cake, pink and sticky, with sprinkles in places they'll be findin' all week.",
            "The baker dusts %n with sugar for luck and sends them on their way, still wearin' half the window display."],
    },
    creamery: {
      beats: [
        ["The creamery door swings shut behind %n and a big brass nozzle on a hose swivels round to point at them.",
         "%n is caught by the creamery girls, who think they look like they need topping, and stood against the cold tiles.",
         "A funnel gets buckled between %n's teeth before they can ask, and somebody cranks the handle on the whippin' cannon."],
        ["Whipped cream comes out in great cool billows, over their face, their chest, their belly, piled thick and soft.",
         "The cannon sweeps up and down %n, and in a minute they're a snowdrift of cream with just their eyes peeking out.",
         "{t}The creamery girls pile it highest on %n's tits, two great soft mounds, and giggle while they do.",
         "{c}%n's cock disappears under a heap of cream, and somebody pokes it to see if it's still in there.",
         "Some of it goes down the funnel. %n swallows sweet cream till they can't."],
        ["Then the strawberries: a bowl of them, pressed into the cream one by one and crushed so the red runs through the white.",
         "Somebody pours strawberry syrup over the top, and it bleeds pink through the cream and down their thighs.",
         "{t}A strawberry on each nipple, pressed in firm, and the syrup trickled over after."],
        ["Somebody hungry comes in from the fields, and doesn't use a spoon.",
         "The creamery girls take turns eatin' strawberries and cream off %n, and they're very, very slow about it.",
         "{v}A tongue follows the syrup all the way down, and right between %n's legs, and stays there.",
         "{c}A mouth finds %n's cock under the cream and cleans it with long, greedy licks."],
      ],
      end: ["%n is let out of the creamery pink and white and sticky everywhere, smellin' of strawberries.",
            "The funnel comes out and %n is sent on their way creamed and syruped, a trail of drips behind them.",
            "%n leaves the creamery licked clean in the middle and dripping everywhere else."],
    },
    seedshower: {
      beats: [
        ["Round the back of the barn there's a ring of straw, and %n is knelt in the middle of it with a bar between their knees.",
         "A hand on each shoulder and %n is on their knees in the straw, wrists cuffed behind them, and the strangers start filin' in.",
         "The back barn door rolls shut, and %n finds themselves kneelin' in the middle of a ring of strangers with their belts already open."],
        ["Every one of them is stroking, slow, eyes on %n, waitin' their turn.",
         "The ring tightens. There's nowhere to look that isn't another cock, hard and close and ready.",
         "Somebody tips %n's chin up so they can't look away, and tells them to keep their mouth open."],
        ["The first one finishes across %n's face with a grunt, hot and thick, and steps back for the next.",
         "One after another they finish on %n: cheeks, lips, hair, tongue, every load landin' on the last.",
         "{t}Two of them aim lower and paint %n's tits in long white ropes.",
         "A big one empties on %n's forehead and it runs down into their eyes, and they're told not to blink.",
         "Somebody finishes in %n's open mouth and tells them to show it, then to swallow."],
        ["More come in from the yard. The ring never seems to get smaller.",
         "%n stops countin' after a dozen. It drips off their chin in strings and pools on their thighs.",
         "{c}One of them reaches down and strokes %n till they add their own to the mess.",
         "The last few take their time, rubbin' it in, spreadin' it with the head, makin' sure nothin' is missed."],
      ],
      end: ["The cuffs come off and %n kneels there dripping, glazed from hair to belly, %ml of it at least.",
            "When the last of them buckles up, %n is left in the straw coated and sticky, %ml of strangers drying on their skin.",
            "%n is let up at last, painted white from head to waist, every step dripping, smellin' of a dozen strangers."],
    },
  };
  const messLine = (kind, key, mn, v) => tFill(pickFor(mn, "trap:"+kind+":"+key, MESS_LINES[kind][key]), mn, v);
  Object.assign(MORE_TRAPS, {
    fountain(mn){
      trapHold(mn, 4, "the chocolate fountain");
      trapRun(mn, "fountain", MESS_LINES.fountain.beats, () => {
        trapMess(mn, "fountain", "chocolate");
        emote("🍫 "+messLine("fountain", "end", mn), mn);
        arouse(mn, 30); face(mn, "edged", 60);
      });
    },
    bakery(mn){
      trapHold(mn, 5, "the bakery bench");
      trapRun(mn, "bakery", MESS_LINES.bakery.beats, () => {
        try { bodyMark(mn, { splat: ["chest", "tummy", "face"], color: MESS.cake, mess: "cake", amount: 2 }); } catch(e){}
        emote("🎂 "+messLine("bakery", "end", mn), mn);
        arouse(mn, 25); face(mn, "afterglow", 60);
      });
    },
    creamery(mn){
      trapHold(mn, 4, "the creamery");
      trapRun(mn, "creamery", MESS_LINES.creamery.beats, () => {
        try { bodyMark(mn, { splat: ["face", "chest", "tummy"], color: MESS.cream, mess: "cream", amount: 2.2 }); } catch(e){}
        later(() => { try { bodyMark(mn, { splat: ["chest", "tummy"], color: MESS.strawberry, mess: "strawberry" }); } catch(e){} }, 1500);
        emote("🍓 "+messLine("creamery", "end", mn), mn);
        arouse(mn, 35); face(mn, "edged", 60);
      });
    },
    seedshower(mn){
      const n = 8 + Math.floor(Math.random()*8), ml = n*(15 + Math.floor(Math.random()*15)), v = { ml: ml + " mL" };
      trapHold(mn, 6, "the seed shower");
      trapRun(mn, "seedshower", MESS_LINES.seedshower.beats, () => {
        const amt = Math.max(1.5, Math.min(3, ml/120));
        try { bodyMark(mn, { splat: ["face", "forehead", "chest"], mess: "cum", amount: amt }); } catch(e){}
        later(() => { try { bodyMark(mn, { splat: ["hair", "tummy"], mess: "cum", amount: amt*0.7 }); } catch(e){} }, 1500);
        emote("💦 "+messLine("seedshower", "end", mn, v), mn);
        arouse(mn, 50); face(mn, "afterglow", 120);
      }, v);
    },
  });
