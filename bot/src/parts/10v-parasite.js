  /* WHAT'S IN THIS FILE (10v-parasite.js)
     THE PARASITE: a pair of livin' lips that comes through a glory hole with the cock, now and then, and seals itself
     over the mouth of whoever just swallowed. Only for people who said ?parasite on (off by default; a hard limit
     that names parasites rules it out).
     • It stays CFG.PARASITE_HOURS (12). Every half hour they're here it feeds them a dose: fertility, a growth dose
       to some part of them, hyper pregnancy, and capacity now and then. The doses stack like any shot.
     • Its tentacle sits down their throat. Any load they swallow while it's on never reaches the belly: it's turned
       into another dose on the spot, and a big load counts double or triple.
     • With the Companion it's a real pair of lips on their character (the game's Lip Gag, crafted "Parasite Lips"),
       put on and taken off by their own Companion.
     • It leaves a CRAVING: while it's on, and for CFG.CRAVE_HOURS after, goin' too long without swallowin' a load
       makes them ache for one (lines only they see, and a nudge to their arousal). A swallowed load settles it.
     • It SPREADS by a kiss on the mouth, either way round, but only to somebody who also said ?parasite on.
     • When the time's up it lets go and drops off, and it can't come back for a day.
     • The SAFEWORD takes it off at once. Staff: ?purge <who>. ?parasite shows how long is left.
  */
  const PARASITE_SERUMS = ["growth", "fertility", "growth", "hyper pregnancy", "growth", "capacity"];
  const PARASITE_GROWS = ["udder", "penis", "testes", "butt"];     // tits, cock, balls, ass, round and round
  // 3% on a swallowed glory-stall load. Every Danger Draught in them adds a quarter: 25%, 50%, 75%, and certain at four
  // Tentacle Musk counts the same as a Danger Draught here, bottle for bottle (it's the same kind of thing that's smellin' them)
  function parasiteChance(mn){ const n = potionX(mn, "danger") + potionX(mn, "tentaclemusk"); return n ? Math.min(1, n * CFG.PARASITE_PER_DANGER) : CFG.PARASITE_CHANCE; }
  function parasiteOn(mn){ const r = rec(mn); return !!(r && r.parasite && r.parasite.until > Date.now()); }
  function parasiteSerum(mn, i){
    const list = strainOf(rec(mn).parasite).serums;   // each strain has its own brew (10v2-parasite-more.js)
    let s = list[i % list.length];
    if (s === "growth"){
      const parts = PARASITE_GROWS.filter(k => bodyParts(mn).includes(k) && CFG.SIZES[k]), g = rec(mn).parasite;
      const part = parts.length ? parts[(g.grew = (g.grew || 0) + 1) % parts.length] : null;
      s = part === "udder" ? "udder growth" : part === "testes" ? "balls growth" : part === "penis" ? "cock growth" : part === "butt" ? "ass growth" : "fertility";
    }
    if (/fertil|hyper/.test(s) && limitBlocks(mn, "breed")) s = "capacity";
    if (/lactation|udder/.test(s) && !makesMilk(mn)) s = "ass growth";
    if (/egg/.test(s) && limitBlocks(mn, "eggs")) s = "capacity";
    if (/heat/.test(s) && limitBlocks(mn, "heat")) s = "capacity";
    return s;
  }
  const paraLine = (key, mn, v) => tFill(pickFresh("para:"+key, PARASITE_LINES[key]), mn, v);
  function parasiteDose(mn, x, open){
    const r = rec(mn), g = r.parasite;
    const serum = parasiteSerum(mn, g.n || 0); g.n = (g.n || 0) + 1;
    applyShot(mn, CFG.BOT_MEMBER, serum+(x > 1 ? " x"+x : ""), { open, from: "the parasite's serum", heatH: 1 });
    saveLedger();
  }
  function parasiteLatch(mn, how){
    const r = rec(mn), now = Date.now();
    r.crave = null;
    r.parasiteN = (r.parasiteN || 0) + 1;
    // after three times on the same host it knows them: it comes back as a belt, and feeds from the other end
    const belt = r.parasiteN > CFG.PARASITE_BELT_AFTER;
    r.parasite = { since: now, until: now + CFG.PARASITE_HOURS*3600000, next: now + CFG.PARASITE_DOSE_MIN*60000, n: 0, fed: 0, form: belt ? "belt" : "lips" };
    parasiteBorn(mn);   // its strain, its first urge (10v2-parasite-more.js)
    if (belt){
      saveLedger(); audit(CFG.BOT_MEMBER, "PARASITE", mn+" latched as a belt"+(how ? " ("+how+")" : ""));
      emote("👄 "+paraLine("latchBelt", mn), mn);
      tell(mn, "👄 It knows you now, sugar. This time it didn't stop at your mouth: it slid down your body and closed round your hips, a livin' belt with a root up inside you. "+CFG.PARASITE_HOURS+" hours. It feeds you the same serum every half hour, and now it's every load you take in your pussy or your ass that it drinks and turns into more. Your safeword takes it off right now.");
      face(mn, "edged", 60); arouse(mn, 25); syncCompanions(true);
      return;
    }
    saveLedger(); audit(CFG.BOT_MEMBER, "PARASITE", mn+" latched"+(how ? " ("+how+")" : ""));
    emote("👄 "+paraLine("latch", mn), mn);
    tell(mn, "👄 Somethin' came through the hole with that last cock, sugar, and it's sealed itself over your mouth: a pair of fat, livin' lips with a tentacle down your throat. It'll feed you serum every half hour for the next "+CFG.PARASITE_HOURS+" hours (it grows your tits, cock, balls and ass, stretches how much you hold, and makes you catch easy and carry big), and every load you swallow, it turns into more. It gets hungry, and so will you. Kiss somebody who said ?parasite on and it'll bud onto them. "+
             "It drops off on its own when it's done. Your safeword takes it off right now.");
    face(mn, "edged", 60); arouse(mn, 20);
    syncCompanions(true);
  }
  function parasiteOff(mn, how){
    const r = rec(mn);
    if (r && how === "safe" && r.parasiteSeed){ r.parasiteSeed = 0; saveLedger(); }   // the safeword clears a seed it left, too
    if (!r || !r.parasite) return false;
    const was = r.parasite.until > Date.now(), fed = r.parasite.fed || 0, n = r.parasite.n || 0, wasBelt = r.parasite.form === "belt", g0 = r.parasite;
    r.parasite = null; parasiteGone(mn, g0, how || "done"); r.parasiteNext = Date.now() + (how === "safe" ? 7 : 1)*86400000;
    r.crave = how === "safe" ? null : { until: Date.now() + CFG.CRAVE_HOURS*3600000, ate: Date.now(), told: Date.now() };   // the cravin' it leaves behind
    saveLedger(); audit(CFG.BOT_MEMBER, "PARASITE", mn+" off ("+(how || "done")+")");
    if (how === "safe" || !was && how !== "done") return true;
    if (charFor(mn)) emote("👄 "+paraLine(wasBelt ? "offBelt" : how === "purge" ? "purge" : "off", mn), mn);
    tell(mn, "👄 The parasite's off you, sugar. It gave you "+n+" dose"+(n === 1 ? "" : "s")+" and drank "+fed+" load"+(fed === 1 ? "" : "s")+" through you while it was on.");
    syncCompanions(true);
    return true;
  }
  // a load went into somebody (every breedin', the bench, the glory stalls): the parasite's business if it was the mouth
  function parasiteLoad(stud, mn, hole, mlIn){
    try {
      if (!(mlIn > 0)) return;
      const r = rec(mn), p = prodOf(mn); if (!r || !p) return;
      // as a belt it drinks from the other end
      if (hole !== "mouth"){
        if (!parasiteOn(mn) || !parasiteParts(r.parasite).root || (hole !== "vulva" && hole !== "butt")) return;   // (once it has a root down there)
        p.held[hole] = Math.max(0, (p.held[hole] || 0) - mlIn);
        r.parasite.fed = (r.parasite.fed || 0) + 1; r.parasite.ate = Date.now();
        const xb = mlIn >= CFG.PARASITE_BIG_ML[1] ? 3 : mlIn >= CFG.PARASITE_BIG_ML[0] ? 2 : 1;
        parasiteDose(mn, xb, paraLine("convertBelt", mn, { ml: ml(mlIn), h: hole === "butt" ? "ass" : "pussy" }));
        return;
      }
      if (parasiteOn(mn) && !parasiteParts(r.parasite).lips) return;   // no lips on it (yet): their mouth is their own
      // a load swallowed settles the cravin' for a while
      if (craving(mn)){
        const c = parasiteOn(mn) ? r.parasite : r.crave;
        if (Date.now() - (c.ate || 0) > CFG.CRAVE_AFTER_MIN*60000) setTimeout(() => privateLine(mn, tFill(pickFresh("para:sated", PARASITE_LINES.sated), mn), "emote"), 4000);
        c.ate = Date.now();
      }
      if (parasiteOn(mn)){
        // the tentacle drinks it before it gets to the belly, and what comes back is serum
        p.held.mouth = Math.max(0, (p.held.mouth || 0) - mlIn);
        r.parasite.fed = (r.parasite.fed || 0) + 1;
        const x = mlIn >= CFG.PARASITE_BIG_ML[1] ? 3 : mlIn >= CFG.PARASITE_BIG_ML[0] ? 2 : 1;
        parasiteUrgeDone(mn, "swallow");
        parasiteDose(mn, x, paraLine("convert", mn, { ml: ml(mlIn) }));
        return;
      }
      if (stud !== ANON_STUD || !r.parasiteOn || (r.parasiteNext || 0) > Date.now()) return;      // only out of the glory holes, only if they asked
      if (/\bparasit/i.test(r.limits || "") || Math.random() >= parasiteChance(mn)) return;
      setTimeout(() => { try { if (charFor(mn) && !parasiteOn(mn)) parasiteLatch(mn, "glory"); } catch(e){ warn("parasite:", e); } }, CFG.PARASITE_LATCH_S*1000);
    } catch(e){ warn("parasite load:", e); }
  }
  // on them now, or left over from one: they need cum, regular
  function craving(mn){ const r = rec(mn); return !!(r && (parasiteOn(mn) || (r.crave && r.crave.until > Date.now()))); }
  function craveTick(mn, r, now){
    const c = parasiteOn(mn) ? r.parasite : r.crave;
    if (!c || !charFor(mn)) return;
    if (!c.ate) c.ate = c.since || now;
    if (now - c.ate < CFG.CRAVE_AFTER_MIN*60000 || now - (c.told || 0) < CFG.CRAVE_LINE_MIN*60000) return;
    c.told = now; saveLedger();
    const hours = (now - c.ate) / 3600000;
    privateLine(mn, tFill(pickFresh("para:crave", hours > 2 ? PARASITE_LINES.craveBad : PARASITE_LINES.crave), mn), "emote");
    arouse(mn, hours > 2 ? 20 : 10, 90);
  }
  // a kiss on the mouth with somebody carryin' it: it buds, and the bud takes to whoever else said ?parasite on
  function parasiteKiss(act, focus, src, tgt){
    try {
      if (!/kiss/i.test(act) || !/^ItemMouth/.test(String(focus || "")) || !src || !tgt || src === tgt) return;
      const from = parasiteOn(src) ? src : parasiteOn(tgt) ? tgt : null, to = from === src ? tgt : src;
      if (from) parasiteUrgeDone(from, "kiss");   // it wanted a kiss
      if (!from || parasiteOn(to)) return;
      const r = rec(to);
      if (!r || !r.parasiteOn || (r.parasiteNext || 0) > Date.now() || /\bparasit/i.test(r.limits || "")) return;
      if (Math.random() >= CFG.PARASITE_KISS_CHANCE*dangerX(to).chance) return;
      emote("👄 "+tFill(pickFresh("para:bud", PARASITE_LINES.bud), from, { c: plainName(to) }), to);
      setTimeout(() => { try { if (charFor(to) && !parasiteOn(to)) parasiteLatch(to, "kissed by "+from); } catch(e){ warn("parasite kiss:", e); } }, 3000);
    } catch(e){ warn("parasite kiss:", e); }
  }
  function parasiteTick(){
    const now = Date.now();
    try { parasiteWorldTick(now); } catch(e){ warn("parasite world:", e); }   // a seed growin' back, a hatchling at the nest
    for (const [k, r] of Object.entries(L.people)){
      if (r.crave && r.crave.until <= now){ r.crave = null; saveLedger(); if (charFor(parseInt(k, 10))) tell(parseInt(k, 10), "👄 The cravin' the parasite left in you has finally let go, sugar."); }
      if (r.parasite || r.crave) craveTick(parseInt(k, 10), r, now);
    }
    for (const [k, r] of Object.entries(L.people)){
      if (!r.parasite) continue;
      const mn = parseInt(k, 10);
      if (r.parasite.until <= now){ parasiteOff(mn, "done"); continue; }
      if (!charFor(mn)) continue;
      try { parasiteMoreTick(mn, r, now); } catch(e){ warn("parasite more:", e); }   // bloomin', layin', wantin' (10v2)
      if (!r.parasite || now < r.parasite.next) continue;
      r.parasite.next = now + strainOf(r.parasite).every*60000/(potionOn(mn, "tentaclemusk") ? 2 : 1);   // Tentacle Musk: it feeds twice as often
      parasiteDose(mn, 1, paraLine(parasiteParts(r.parasite).lips ? "dose" : "doseBelt", mn));
      try { parasiteAfterDose(mn); } catch(e){ warn("parasite drink:", e); }
    }
  }
  function parasiteCommand(cmd, sender, args, R){
    const r = rec(sender), a0 = String(args[0] || "").toLowerCase();
    if (cmd === "purge"){
      if (!isStaff(sender)){ R("Sorry, sugar, purgin' is for staff. Your own safeword takes it off you any time."); return true; }
      const t = resolveTarget(args[0]);
      if (!t || !rec(t)){ R("Purge who, sugar? ?purge <who>."); return true; }
      if (!parasiteOn(t)){ R(plainName(t)+" hasn't got a parasite on them, sugar."); return true; }
      parasiteOff(t, "purge"); R("👄 Purged. "+plainName(t)+"'s mouth is their own again."); return true;
    }
    if (!r || !r.roles || !r.roles.length){ R("That's just for folks on the books, sugar."); return true; }
    if (a0 === "give" && isProprietor(sender)){
      const t = resolveTarget(args[1]);
      if (!t || !rec(t) || !charFor(t)){ R("?parasite give <who>, sugar, and they need to be here."); return true; }
      if (!rec(t).parasiteOn){ R(plainName(t)+" hasn't said ?parasite on, so it won't take to them."); return true; }
      if (parasiteOn(t)){ R(plainName(t)+" already has one on."); return true; }
      parasiteLatch(t, "given"); R("👄 It's on "+plainName(t)+" for "+CFG.PARASITE_HOURS+" hours."); return true;
    }
    if (!a0){
      if (parasiteOn(sender)){ const m = Math.ceil((r.parasite.until - Date.now())/60000); R("👄 It's on you, sugar (a "+strainOf(r.parasite).name+"), for "+(m >= 90 ? Math.round(m/60)+" more hours" : m+" more minutes")+". Doses so far: "+(r.parasite.n || 0)+". Loads it's drunk through you: "+(r.parasite.fed || 0)+". Your safeword takes it off."); }
      else R(switchStatus("parasite", !!r.parasiteOn)+(r.parasiteOn ? " Swallow at the glory stalls and, once in a long while, somethin' comes through with the cock." : ""));
      return true;
    }
    if (!/^(on|off|yes|no)$/.test(a0)){ R("Just say ?parasite on or ?parasite off, sweetie."); return true; }
    const on = a0 === "on" || a0 === "yes";
    if (on && /\bparasit/i.test(r.limits || "")){ R("Your hard limits rule that out, sugar, so I'll keep it off."); return true; }
    r.parasiteOn = on; saveLedger(); audit(sender, "PARASITE", on ? "on" : "off");
    if (!on && parasiteOn(sender)) parasiteOff(sender, "purge");
    R(on ? "👄 Parasite: ON. Swallow a load at the glory stalls and there's a small chance somethin' comes through the hole with it and seals over your mouth for "+CFG.PARASITE_HOURS+" hours. It feeds you fertility, growth, hyper pregnancy and capacity serum the whole time (the growth is for keeps), and turns every load you swallow into more. ?parasite off or your safeword gets rid of it."
         : "👄 Parasite: off. Nothin' comes through the hole but cock.");
    syncCompanions(true); return true;
  }

  const PARASITE_LINES = {
    latchBelt: [
      "It comes through the hole the same as before, but it doesn't stop at %n's lips. It pours down their chin, their chest, their belly, and closes round their hips in a wide glossy band. A thick root pushes up inside them and takes hold.",
      "The parasite knows %n by now. It slides off the stranger's cock, down %n's body like spilled honey, and knits itself into a belt of livin' flesh, snug between their legs, with a tendril seated deep in each hole.",
      "This time it wants more of %n than their mouth. It flows down between their thighs, seals itself front to back, and sinks two slow fat roots up into them. %n's knees buckle as it settles in."],
    doseBelt: [
      "The belt round %n's hips tightens and throbs. Up inside them, its root pulses and pumps somethin' hot straight into their core.",
      "%n stops, legs pressed together. The thing wrapped round their hips is feedin' them again, from the inside, one deep squirt at a time.",
      "A ripple runs round the livin' belt on %n, and the roots it has in them swell and spill. Another dose, where they can't spit it out."],
    convertBelt: [
      "The load never gets to settle in %n's %h. The root seated there drinks all %ml of it, and the belt flushes dark and pays them back with a deep hot spurt of serum.",
      "%ml goes into %n's %h and straight into the parasite. It shivers round their hips, greedy, and pumps its own brew up into them in exchange.",
      "The belt sucks %n's %h dry almost before the cock's out: %ml, gone. What it gives back makes their belly glow."],
    offBelt: [
      "The belt round %n's hips goes soft. Its roots slide out of them, long and slow, and the whole thing slips down their legs to the floor in a wet heap.",
      "%n feels it let go, front and back, and draw itself out. The livin' belt drops off their hips and oozes away under the straw."],
    crave: [
      "Your mouth waters round the thing in it. It's been a while since you swallowed, and your whole throat feels empty.",
      "You catch yourself lookin' at every crotch that walks by. You want a cock in your mouth. You want what comes out of it.",
      "There's a hollow ache at the back of your tongue. One good load would fix it. Just one.",
      "You can almost taste it: thick, warm, salty. Your lips part by themselves. You need to find somebody to suck.",
      "The glory stalls keep comin' to mind. All those cocks through the wall, and nobody would even have to know how bad you want it.",
    ],
    craveBad: [
      "You're shakin'. It's been hours without a drop of cum and you can't think about anything else: who has some, and how fast you can get on your knees.",
      "Your throat clenches on nothin', over and over. You'd beg. You'd crawl. You need a load down your neck right now.",
      "Everything in you has narrowed down to one thought, and it's a cock, any cock, pumpin' on your tongue.",
      "You're droolin' and you can't stop. Your body's decided cum is food and it's starvin'.",
    ],
    sated: [
      "Oh, that's better. The ache at the back of your throat melts away as it goes down, and for a little while you can think again.",
      "The cravin' lets go of you all at once, warm and sweet, like scratchin' an itch you've had for an hour. It'll be back.",
      "You swallow, and your whole body sighs. That's what it wanted. That's what you wanted.",
    ],
    bud: [
      "As %n's mouth meets %c's, the fat lips on %n's face ripple, and a little wet bud of the same pink flesh squeezes out between them and slips onto %c's tongue.",
      "The kiss lasts a beat too long. Somethin' passes from %n's mouth to %c's, soft and quick and alive.",
      "The parasite on %n's lips swells against %c's mouth, splits, and leaves half of itself behind in the kiss.",
    ],
    latch: [
      "The cock pulls back out of the hole, and somethin' comes with it: a wet pink shape that slaps over %n's mouth before they can close it. It moulds itself to their lips, plump and glossy, and a thick warm tongue of it slides down their throat and settles.",
      "%n is still swallowin' when a second thing pushes through the glory hole, soft and slick and quick. It clamps over their lips like a kiss that doesn't end, swells into a fat rubbery pout, and feeds a tentacle past their tongue and down.",
      "Somethin' was ridin' on that cock. It lets go as the stranger pulls out and fastens over %n's open mouth, a pair of livin' lips, hot and tight, with a long slippery root that worms down their gullet and makes itself at home.",
      "A glistenin' bulb squeezes through the hole after the last spurt and kisses %n full on the mouth. By the time they get a hand up it has sealed itself on: big wet lips where theirs used to be, and a tentacle down their throat already pulsin'.",
    ],
    dose: [
      "The lips on %n's mouth pucker and throb. Down their throat the tentacle squeezes, and somethin' thick and sweet pumps straight into their belly.",
      "%n's throat bobs without them tellin' it to: the parasite is feedin' them again, a long warm gush of serum they couldn't spit out if they tried.",
      "The livin' lips sealed over %n's mouth swell fat and shiny for a second. That's another dose goin' down.",
      "A slow pulse runs through the thing on %n's face. They make a muffled little noise as it pours its next helpin' into them.",
    ],
    convert: [
      "The load never reaches %n's belly. The tentacle in their throat drinks all %ml of it, the lips pulse greedy and dark, and a moment later it pumps somethin' back down that isn't cum any more.",
      "The parasite's lips milk the cock in %n's mouth for every drop, %ml, and swallow it themselves. Then the tentacle shudders and squirts %n's share down their throat: changed, thick, fizzin' with serum.",
      "%n doesn't even get to taste it. %ml goes straight into the parasite, and what the parasite gives back makes their whole body flush hot from the inside.",
      "The thing on %n's mouth slurps the load down like a calf at a bucket, %ml, and pays for it right away: a hot heavy dose of its own brew, straight into their gut.",
    ],
    off: [
      "The lips on %n's mouth go slack. The tentacle draws itself up out of their throat, inch by slimy inch, and the whole thing peels away and drops into the straw, fat and done.",
      "With a long wet suckin' sound the parasite lets go of %n's face and slides off. %n works their jaw, licks their own lips for the first time in half a day, and drools.",
      "The thing that's been kissin' %n all day shudders, unseals, and pulls its root out of them. It crawls off under the stall wall lookin' for a hole to wait behind.",
    ],
    purge: [
      "A farmhand gets two fingers under the edge of the lips on %n's mouth, breaks the seal, and draws the whole thing out, tentacle and all. It goes in a jar. %n coughs and gulps air.",
      "The parasite is peeled off %n's face and its long root pulled hand over hand up out of their throat. It squirms. %n gags, spits, and has their own mouth back.",
    ],
  };
