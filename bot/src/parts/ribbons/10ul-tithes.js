  /* WHAT'S IN THIS FILE (10ul-tithes.js)
     THE TITHES: potions that steal size (a player's idea; Laynie, Oct 24: "no sizeplay toggle, or its default on", and
     "maybe one that allows cows to suck a cock, steal its size and grow their own udders").
     • Bull's Tithe (somebody with a cock drinks it): for four hours, every somebody-with-a-cock they breed gives up two
       inches of it, and the drinker grows two. Once per partner a day.
     • Cow's Tithe (somebody with udders drinks it): for four hours, every cock they suck dry shrinks two inches, and
       their own udders swell a cup. Once per cock a day.
     • For good, like a growth shot. Nobody drops below TITHE_FLOOR inches. Anybody with size or shrinkin' in their
       limits is left alone. Everybody else is fair game: there's no switch for it.
     They hang off the farm's "bred" moment (every fill, glory stall and bench load): titheBred() below.
  */
  POTIONS.push(
    { id: "bulltithe", name: "Bull's Tithe", kind: "reward", mins: 240, price: 14,
      desc: "For four hours, every cock you breed gives up some of itself to yours: they shrink two inches, you grow two, for good. Once per partner a day. Only for somebody with a cock.",
      limit: /\b(size|shrink|grow)/i, needs: (mn) => { try { return bodyOf(mn).cock ? "" : "It only works on somebody with a cock to grow."; } catch(e){ return ""; } },
      drink: "It's thick and dark as stout and it burns all the way down, and your cock throbs once, hard, like somethin' hungry just woke up in it.",
      seen: "%n knocks back somethin' dark and thick and grins. Any stud in the room with any sense takes a step back." },
    { id: "cowtithe", name: "Cow's Tithe", kind: "reward", mins: 240, price: 14,
      desc: "For four hours, every cock you suck dry shrinks two inches for good, and your own udders swell a cup for every one. Once per cock a day. Only for somebody with udders.",
      limit: /\b(size|shrink|grow)/i, needs: (mn) => { try { return bodyOf(mn).tits ? "" : "It needs udders to grow into."; } catch(e){ return ""; } },
      drink: "It's warm and creamy and sweet as fresh milk, and your udders tighten and tingle as it goes down, achin' to be filled.",
      seen: "%n drinks a little bottle of somethin' creamy and licks their lips, eyes driftin' to every crotch in the room." });
  const TITHE_LINES = {
    bull: ["%s sinks into %t and somethin' in the dark draught drinks deep. %t feels their cock shrink, inch by inch, while %s swells inside them to match.",
           "As %s fills %t, the Bull's Tithe takes its due: %t's cock draws up smaller, and %s's grows heavier, thicker, longer.",
           "%t gasps as %s breeds them and feels it go: two inches of their cock, pulled away and into %s, who's bigger than ever when they pull out."],
    cow:  ["%t sucks %s dry and keeps suckin', and %s's cock shrinks between their lips while %t's udders swell and tighten another cup.",
           "The Cow's Tithe drinks through %t's mouth: %s's cock gets smaller with every swallow, and %t's udders fill out round and heavy.",
           "%t pulls off with a wet pop, and %s looks down at a cock two inches smaller than it was. %t's udders have grown a cup, and they're smilin'."],
  };
  const titheLine = (k, s, t) => pickFor(t, "tithe:"+k, TITHE_LINES[k]).replace(/%s/g, plainName(s)).replace(/%t/g, plainName(t));
  function titheSafe(mn){ return /\b(size|shrink)/i.test(String((rec(mn) || {}).limits || "")); }
  function titheOnce(by, from){
    const r = rec(by); if (!r) return false;
    const day = dayKey(); r.tithe = r.tithe && r.tithe.day === day ? r.tithe : { day, from: [] };
    if (r.tithe.from.includes(from)) return false;
    r.tithe.from.push(from); return true;
  }
  function titheCock(mn){ try { return !!bodyOf(mn).cock; } catch(e){ return false; } }
  // a cock shrinks by up to a step, never below the floor; how many inches actually came off
  function titheShrink(mn){
    const S = CFG.SIZES.penis, now = sizeOf(mn, "penis"), to = Math.max(CFG.TITHE_FLOOR, now - (S.step || 2));
    if (to >= now) return 0;
    setSize(mn, "penis", to, true); return now - to;
  }
  function titheBred(stud, t, hole){
    if (!stud || !t || stud === t || !rec(stud) || !rec(t)) return;
    try {
      // Bull's Tithe: the stud drank it, and breeds somebody with a cock
      if (potionOn(stud, "bulltithe") && titheCock(stud) && titheCock(t) && !titheSafe(t) && titheOnce(stud, t)){
        const got = titheShrink(t);
        if (got > 0){
          setSize(stud, "penis", Math.min(CFG.SIZES.penis.max, sizeOf(stud, "penis") + got), true);
          later(() => emote("🐂 "+titheLine("bull", stud, t), t), 2500);
          tell(t, "🐂 "+plainName(stud)+"'s Bull's Tithe took "+got+" inches of your cock, sugar. It's "+sizeOf(t, "penis")+" now, and it's stayin' that way.");
          tell(stud, "🐂 You took "+got+" inches off "+plainName(t)+". You're "+sizeOf(stud, "penis")+" now.");
          audit(stud, "TITHE", "bull "+t+" "+got); saveLedger(); syncCompanions(true);
        }
      }
      // Cow's Tithe: the one with the cock in their mouth drank it
      if (hole === "mouth" && potionOn(t, "cowtithe") && titheCock(stud) && !titheSafe(stud) && titheOnce(t, stud)){
        let tits = false; try { tits = bodyOf(t).tits; } catch(e){}
        if (tits){
          const got = titheShrink(stud);
          if (got > 0){
            setSize(t, "udder", Math.min(CFG.SIZES.udder.max, sizeOf(t, "udder") + 1), true);
            later(() => emote("🐄 "+titheLine("cow", stud, t), t), 2500);
            tell(stud, "🐄 "+plainName(t)+"'s Cow's Tithe sucked "+got+" inches out of your cock, sugar. It's "+sizeOf(stud, "penis")+" now, for good.");
            tell(t, "🐄 That's "+got+" inches off "+plainName(stud)+" and a cup on you: "+sizeWord("udder", sizeOf(t, "udder"))+".");
            audit(t, "TITHE", "cow "+stud+" "+got); saveLedger(); syncCompanions(true);
          }
        }
      }
    } catch(e){ warn("tithe:", e); }
  }
