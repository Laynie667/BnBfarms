  /* WHAT'S IN THIS FILE (10y2-brood.js)
     • LAYING is a scene now, as long as the clutch is big: a handful is two beats, forty is five, a hundred is eight.
       They're held on the nest till the last egg is out (the eggs only count when it's finished; the safeword stops it
       with the rest still in them). ?tend <who>: stand by somebody about to lay and you're written into it, and
       paid a ribbon for helpin'.
     • FARROWING: when a litter comes on the farm, the birth plays out in beats too, longer for a bigger litter.
     • A BELLY THAT SHOWS: eggs, a litter and a pumped gut add up to a stage (showin', heavy, huge, can't see
       their feet). It's a chip on their strip, the room hears when it grows, and folks standin' near get a line.
     • SCENTS (potions): Wolf Scent, Mare's Heat, Sow's Slop. While one's on a test subject, the pack, the stallion
       or the boar comes and finds them wherever they stand. No spot needed.
     • DIFFERENT WATER: a pond, pool, creek… keeps the tentacles. A trough has leeches. A well has somethin' that
       pulls them down and keeps them longer. A bath or shower has slime.
     • ?quiet [minutes|off]: an hour's peace (or as long as they say, up to 8 hours). Nothin' optional starts on them:
       no traps, no urges, no scents, no teasin', no toy lines. Their switches stay as they are; the safeword is
       untouched; whatever already has them carries on (that's what the safeword is for).
     • WHAT'S HAPPENIN' TO ME: a few plain lines for the Companion about whatever has them right now.
  */
  const bLine = (key, mn, v) => tFill(pickFresh("brood:"+key, BROOD_LINES[key]), mn, v);
  function quietNow(mn){ const r = rec(mn); return !!(r && r.quietUntil > Date.now()); }

  // a little story about one person, a beat at a time (the same pace as the traps); the safeword stops it
  function sceneRun(mn, icon, beats, done, v){
    state.sceneRuns = state.sceneRuns || new Map();
    const run = { i: 0, timer: null, n: beats.length };
    state.sceneRuns.set(mn, run);
    const step = () => {
      if (state.sceneRuns.get(mn) !== run) return;
      if (run.i < beats.length && charFor(mn)){
        const b = beats[run.i++];
        emote(icon+" "+tFill(pickFresh("scene:"+icon+":"+run.i, Array.isArray(b) ? b : [b]), mn, v), mn);
        run.timer = setTimeout(step, CFG.TRAP_BEAT_S*1000);
        return;
      }
      state.sceneRuns.delete(mn);
      try { done(!!charFor(mn)); } catch(e){ warn("scene:", e); }
      saveLedger(); syncCompanions(true);
    };
    step();
  }
  function sceneStop(mn){
    const run = state.sceneRuns && state.sceneRuns.get(mn);
    if (!run) return false;
    clearTimeout(run.timer); state.sceneRuns.delete(mn);
    const r = rec(mn); if (r && r.penned && r.penned.brood){ r.penned = null; saveLedger(); }
    return true;
  }

  // ── layin' at the nest ──
  function layScene(mn, nest){
    const r = rec(mn), p = prodOf(mn), e = p.eggs, n = e.n, pos = posOf(mn);
    const helper = r.tender && r.tender.until > Date.now() && charFor(r.tender.by) && (() => { const a = posOf(mn), b = posOf(r.tender.by); return a && b && Math.max(Math.abs(a.X - b.X), Math.abs(a.Y - b.Y)) <= 2; })() ? r.tender.by : 0;
    const v = { x: String(n), c: helper ? plainName(helper) : "" };
    const mids = n < 10 ? 0 : n < 25 ? 1 : n < 50 ? 2 : n < 90 ? 4 : 5;
    const beats = [BROOD_LINES.layStart].concat(helper ? [BROOD_LINES.layHelp] : [], [BROOD_LINES.layFirst]);
    for (let i = 0; i < mids; i++) beats.push(i === mids - 1 && n >= 50 ? BROOD_LINES.layHuge : helper && i === 1 ? BROOD_LINES.layHelpMid : BROOD_LINES.layMid);
    if (pos) r.penned = { until: Date.now() + (beats.length + 2)*CFG.TRAP_BEAT_S*1000, X: pos.X, Y: pos.Y, name: "the nest", by: CFG.BOT_MEMBER, trap: true, brood: true };
    saveLedger();
    sceneRun(mn, "🥚", beats, (here) => {
      if (r.penned && r.penned.brood) r.penned = null;
      if (!p.eggs) return;
      p.eggs = null;
      p.offspring.eggs = (p.offspring.eggs || 0) + n;
      if (!L.studbook) L.studbook = [];
      L.studbook.push({ t: Date.now(), dam: mn, sires: [e.by], kids: { male: 0, female: 0, futa: 0 }, eggs: n });
      eggsLaid(mn, n, true);
      if (e.para) L.nestBrood = (L.nestBrood || 0) + 1;   // one of the parasite's own: it'll hatch here
      audit(mn, "EGGS", mn+" "+n+" at the nest"+(helper ? " tended by "+helper : ""));
      if (here) emote("🥚 "+bLine(n >= 50 ? "layEndHuge" : n >= 12 ? "layEndBig" : "layEnd", mn, v), mn);
      tell(mn, "🥚 "+n+" eggs in the nest, sugar. Staff'll gather them, and there's ribbons in it for you when they do.");
      if (helper){ r.tender = null; later(() => earnRibbons(helper, 1, "tendin' a layin'"), 2500); }
      face(mn, "afterglow", 120); arouse(mn, 30);
    }, v);
  }
  // ── farrowin': the litter comes, in beats ──
  function farrowScene(mn, count, parts, sires){
    const v = { x: String(count), c: sires.map(plainName).join(" & ") };
    const mids = count <= 2 ? 0 : count <= 5 ? 1 : count <= 10 ? 2 : 3;
    const beats = [BROOD_LINES.farrowStart, BROOD_LINES.farrowCrown];
    for (let i = 0; i < mids; i++) beats.push(i === mids - 1 && count > 10 ? BROOD_LINES.farrowHuge : BROOD_LINES.farrowMid);
    sceneRun(mn, "🍼", beats, (here) => {
      if (here) emote("🍼 "+bLine("farrowEnd", mn, Object.assign({ ml: parts }, v)), mn);
      face(mn, "afterglow", 180);
    }, v);
  }

  // ── a belly that shows ──
  const BELLY = ["", "showin'", "heavy", "huge", "so big they can't see their feet"];
  function bellyStage(mn){
    const p = prodOf(mn); if (!p) return 0;
    let w = 0; const now = Date.now();
    if (p.eggs) w += p.eggs.n / 10;
    if (p.preg){ const frac = Math.max(0, Math.min(1, (now - p.preg.since) / Math.max(1, p.preg.due - p.preg.since))); w += frac * (1 + (p.preg.count || 1) * 0.5); }
    const full = heldTotal(p) / capacity(mn); if (full > 0.8) w += (full - 0.8) * 3;
    return w >= 8 ? 4 : w >= 4 ? 3 : w >= 2 ? 2 : w >= 0.8 ? 1 : 0;
  }
  function bellyTick(now){
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C.MemberNumber, r = rec(mn); if (mn === CFG.BOT_MEMBER || !r || !r.roles || !r.roles.length) continue;
      const p = prodOf(mn), st = bellyStage(mn);
      if (st > (p.bellyTold || 0) && !quietNow(mn)){ emote("🤰 "+bLine("belly"+st, mn), mn); }
      if (st !== (p.bellyTold || 0)){ p.bellyTold = st; saveLedger(); state.gearDirty = true; }
      // somebody standin' close notices, now and then
      if (st >= 2 && now - (p.bellySeenAt || 0) > CFG.BELLY_SEEN_MIN*60000){
        p.bellySeenAt = now;
        const near = (W.ChatRoomCharacter || []).map(c => c.MemberNumber).filter(m => m !== mn && m !== CFG.BOT_MEMBER && rec(m) && !quietNow(m) && (() => { const a = posOf(mn), b = posOf(m); return a && b && Math.max(Math.abs(a.X - b.X), Math.abs(a.Y - b.Y)) <= 2; })());
        if (near.length && Math.random() < 0.6) privateLine(near[Math.floor(Math.random()*near.length)], bLine("bellySeen", mn, { c: BELLY[st] }), "emote");
      }
    }
  }

  // ── scents: somebody comes and finds them ──
  const SCENTS = { wolfscent: "wolves", mareheat: "stallion", sowslop: "boar" };
  function scentTick(now){
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C.MemberNumber; if (!isSubject(mn) || quietNow(mn)) continue;
      const r = rec(mn);
      for (const [id, kind] of Object.entries(SCENTS)){
        const f = r.fx && r.fx[id]; if (!f || f.until <= now || f.came) continue;
        if (now - f.at < CFG.SCENT_WAIT_MIN*60000 || heldByTrap(mn) || (state.sceneRuns && state.sceneRuns.has(mn)) || Math.random() >= CFG.SCENT_CHANCE) continue;
        f.came = true; saveLedger();
        emote(TRAP_KINDS[kind].icon+" "+bLine("scent_"+kind, mn), mn);
        later(() => { const why = springTrap(mn, kind, "", true); if (!why){ rec(mn).trapAt = Date.now(); saveLedger(); } else f.came = false; }, 5000);
        break;                                                                   // one at a time: the other one waits its turn
      }
    }
  }

  // ── what lives in which water ──
  const WATER_KINDS = [[/^trough/, "leeches"], [/^well/, "well"], [/^(bath|shower)/, "slime"]];
  function waterKindOf(name){ const hit = WATER_KINDS.find(([re]) => re.test(name)); return hit ? hit[1] : "tentacle"; }
  Object.assign(TRAP_KINDS, {
    leeches: { icon: "🪱", what: "fat leeches out of the trough, latched on your teats and anywhere else that's soft", limit: /\b(leech|blood|bug|insect|worm)/i },
    well:    { icon: "🕳️", what: "the thing in the well. It pulls you down and keeps you a long while, and it always leaves eggs", limit: /\b(tentacle|eggs?|ovipos|clutch|monster)/i },
  });
  MORE_TRAPS.leeches = function(mn){
    const p = prodOf(mn);
    trapHold(mn, 4, "the trough");
    trapRun(mn, "leeches", BROOD_LINES.leeches, () => {
      const got = makesMilk(mn) ? drainMilk(mn, p.milk * 0.6) : 0;
      if (hasPart(mn, "udder") && CFG.SIZES.udder) setSize(mn, "udder", sizeOf(mn, "udder") + 1, false);   // swollen where they fed, till it goes down
      emote("🪱 "+bLine("leechesEnd", mn, { ml: got >= 5 ? ml(got) : "what they wanted" }), mn);
      arouse(mn, 30);
    });
  };
  MORE_TRAPS.well = function(mn, spot){ tentacleScene(mn, spot, true); };
  TRAP_GEAR.leeches = [{ when: "after", slot: "cups", label: "Trough Leeches", mins: 20, color: "#3B2A2A",
    desc: "Two fat black leeches latched on swollen teats, pulsing as they feed. They drop off when they're full, and not a minute sooner." }];

  // ── ?quiet, ?tend ──
  function broodCommand(cmd, sender, args, R){
    const r = rec(sender);
    if (cmd === "quiet"){
      if (!r || !r.roles || !r.roles.length){ R("That's for folks on the books, sugar."); return; }
      const a0 = String(args[0] || "").toLowerCase();
      if (a0 === "off" || a0 === "end" || a0 === "stop"){ r.quietUntil = 0; saveLedger(); syncCompanions(true); R("🤫 Quiet's over, sugar. The farm can find you again."); return; }
      const mins = Math.max(10, Math.min(480, parseInt(a0, 10) || 60));
      r.quietUntil = Date.now() + mins*60000; saveLedger(); audit(sender, "QUIET", mins+"m"); syncCompanions(true);
      R("🤫 "+mins+" minutes of quiet, sugar. Nothin' new will start on you: no traps, no urges, no scents, no teasin'. Your switches stay as they are, and anything that already has you carries on (your safeword stops that). ?quiet off ends it early.");
      return;
    }
    // ?tend <who>
    const t = resolveTarget(args[0]);
    if (!t || t === sender || !rec(t)){ R("Tend who, sugar? Stand by somebody who's about to lay and say ?tend <who>."); return; }
    const a = posOf(sender), b = posOf(t);
    if (!a || !b || Math.max(Math.abs(a.X - b.X), Math.abs(a.Y - b.Y)) > 2){ R("Get right up beside "+plainName(t)+" first, sugar."); return; }
    if (!prodOf(t).eggs){ R(plainName(t)+" isn't carryin' a clutch, sugar."); return; }
    rec(t).tender = { by: sender, until: Date.now() + 15*60000 }; saveLedger();
    R("🧺 You're tendin' "+plainName(t)+". Stay close: when they lay, you'll be the one with your hands on them.");
    tell(t, "🧺 "+plainName(sender)+" is goin' to tend you while you lay, sugar. ?lay when you're on the nest.");
  }

  // ── what's happenin' to me: plain lines for the top of their panel ──
  function happeningFor(mn){
    const r = rec(mn), p = prodOf(mn), now = Date.now(), out = [], mins = t => Math.max(1, Math.ceil((t - now)/60000));
    if (!r || !p) return out;
    const run = state.trapRuns && state.trapRuns.get(mn);
    if (run) out.push(TRAP_KINDS[run.kind].icon+" A trap has you ("+run.kind+"): part "+Math.min(run.i, run.beats.length)+" of "+run.beats.length+". Your safeword stops it.");
    const sc = state.sceneRuns && state.sceneRuns.get(mn);
    if (sc) out.push("🥚 It's comin': part "+Math.min(sc.i, sc.n)+" of "+sc.n+".");
    if (r.trapWait) out.push(TRAP_KINDS[r.trapWait.kind].icon+" "+(r.trapWait.kind === "tickle" ? "The tickle rack has you till you ?beg" : "The mirror box wants its line "+(5 - (r.trapWait.n || 0))+" more times")+", or "+mins(r.trapWait.until)+" min.");
    if (r.benched && r.benched.until > now) out.push("🪵 "+(r.benched.trap ? "Locked in the pillory" : "On the use bench")+": "+mins(r.benched.until)+" min left, used "+r.benched.uses+" time"+(r.benched.uses === 1 ? "" : "s")+".");
    if (r.penned && r.penned.until > now && !run && !sc) out.push("🚧 Held at "+r.penned.name+": "+mins(r.penned.until)+" min left.");
    if (parasiteOn(mn)){
      const g = r.parasite, P = parasiteParts(g);
      out.push("👄 Parasite ("+strainOf(g).name+"): "+[P.lips && "lips", P.suckers && "teats", P.root && "below"].filter(Boolean).join(", ")+". Feeds in "+mins(g.next)+" min. Drops off in "+(g.until - now > 5400000 ? Math.round((g.until - now)/3600000)+" h" : mins(g.until)+" min")+".");
      if (g.urge) out.push("👄 It wants you to "+{ kiss: "kiss somebody on the mouth", swallow: "swallow a load", glory: "get into a glory stall" }[g.urge.kind]+": "+mins(g.urge.until)+" min.");
    }
    if (p.deniedUntil > now) out.push("🚫 No cummin' for "+mins(p.deniedUntil)+" min.");
    if (p.eggs) out.push("🥚 Carryin' "+p.eggs.n+" eggs"+(bellyStage(mn) ? " (belly: "+BELLY[bellyStage(mn)]+")" : "")+". ?lay at the nest"+(now - p.eggs.since < CFG.NEST_MIN_H*3600000 ? " in "+mins(p.eggs.since + CFG.NEST_MIN_H*3600000)+" min" : " any time")+".");
    for (const [slot, g] of Object.entries(r.gear || {})) if (g.until > now) out.push("⛓️ "+g.label+": "+mins(g.until)+" min.");
    if (r.gluedUntil > now) out.push("🍯 Sticky feet: "+mins(r.gluedUntil)+" min.");
    for (const id of Object.keys(SCENTS)) if (r.fx && r.fx[id] && r.fx[id].until > now && !r.fx[id].came && isSubject(mn)) out.push("🌫️ "+potionDef(id).name+" is on you. Somethin's goin' to smell it.");
    if (quietNow(mn)) out.push("🤫 Quiet: nothin' new starts on you for "+mins(r.quietUntil)+" min.");
    return out.slice(0, 8);
  }
  function broodTick(){
    const now = Date.now();
    try { bellyTick(now); scentTick(now); } catch(e){ warn("brood tick:", e); }
  }

  const BROOD_LINES = {
    layStart: [
      "%n lowers themselves into the nest, knees wide, hands braced on the rail. Their belly hangs heavy and tight between their thighs, and somethin' inside it shifts.",
      "%n climbs into the straw and squats, pantin' already. The clutch has dropped. They can feel the first one sittin' low, right at the door.",
      "%n settles on the nest on all fours, back arched, tail end up. A slow hard squeeze rolls down their belly, and they groan with it."],
    layHelp: [
      "%c kneels behind %n and lays a warm hand on the small of their back, the other cupped underneath, ready. \"Breathe. Push when it comes.\"",
      "%c settles in the straw at %n's side, rubbin' slow circles on their swollen belly, feelin' the eggs shift under the skin. \"I've got you. Let them come.\"",
      "%c parts %n's thighs a little wider and holds them there, thumb strokin'. \"Good. Open right up. I want to see every one.\""],
    layFirst: [
      "The first egg crowns: slick, pale, wider than it has any right to be. %n's lips stretch thin round it, they bear down with a long low moan, and it slides free and drops into the straw.",
      "%n strains. Somethin' round and firm presses out from inside, spreadin' them open till it burns, and then the fat middle of it passes and it's out, warm and glistenin', with a rope of slime behind it.",
      "A push, a grunt, a wet stretchin' sound. The first one comes out of %n slow and then all at once, and they shudder from heels to scalp."],
    layMid: [
      "Another. And another behind it. %n has found the rhythm now: squeeze, stretch, drop. Every egg rubs every tender place on its way out, and their thighs are runnin' wet.",
      "They come faster. %n is moanin' on every one, hips rollin', hole gapin' and closin' and gapin' again. The pile in the straw is growin'.",
      "%n's whole belly ripples. Three in a row, pop, pop, pop, each one drawin' a higher sound out of them. Their arms are shakin'.",
      "An egg sticks, right at the widest part, and %n is held open round it, tremblin', whinin'. Then it gives, and the two behind it tumble out after."],
    layHelpMid: [
      "%c catches each one as it comes and sets it in the straw, countin' out loud, and between eggs works two fingers into %n to coax the next one down.",
      "\"That's it. Another.\" %c presses down on %n's belly with the flat of a hand, and an egg squeezes out into their waitin' palm, hot and slick.",
      "%c leans in and licks the slime from %n's stretched hole between pushes. %n wails, clenches, and lays the next one right against their tongue."],
    layHuge: [
      "It doesn't end. %n has lost count and lost words. They're just a body layin', egg after egg after egg, cummin' somewhere in the middle of it without even noticin', drool hangin' from their lip.",
      "%n's belly is goin' down like a slow tide and there's still more in there. They're past moanin': it's a steady animal lowin' now, and the nest is heapin' over.",
      "Dozens. %n's hole can't close between them any more, it just hangs open and gives them up one after another, and every one makes their whole body jerk."],
    layEnd: [
      "The last one slips out of %n with a little wet pop. %x eggs, warm in the straw. They sag against the rail, emptied and glowin'.",
      "%x, all told. %n lies down beside their clutch, pantin', one hand on a belly gone soft and flat again.",
      "Done. %x eggs in the nest, and %n drippin' and shakin' above them, lookin' prouder than they'd admit."],
    layEndBig: [
      "%n pushes out the last of them and collapses in the straw beside the heap: %x eggs, steamin' faintly, and a hole that's goin' to gape for an hour.",
      "%x. It took a long time and a lot of noise. %n curls round the clutch they just laid, wrung out and tremblin', belly loose and empty.",
      "The nest is full: %x eggs. %n can't get up yet. They just lie there with their thighs apart, leakin' slime, feelin' how hollow they are."],
    layEndHuge: [
      "%x eggs. The nest can't hold them; they've spilled over the rail and into the aisle. %n is flat on their back in the middle of it all, legs splayed, hole hangin' open, twitchin' through the last of it with their eyes rolled up.",
      "It's over. %x. A whole barrow-load, laid by one body. %n can't speak and can't stand. They lie in the wreck of the nest, empty for the first time in days, and already missin' the weight.",
      "%n's belly, that was restin' on their thighs this mornin', is flat. %x eggs lie heaped round them. They're cryin' a little, and smilin', and they don't know which one they mean."],
    farrowStart: [
      "%n drops to their knees in the farrowin' straw and bears down with everything they have. Their belly's gone hard as a drum and low as it'll go. It's time.",
      "A long deep push rolls through %n and doesn't stop. They grab the rail, spread their knees, and holler. The litter's comin', and it's comin' now."],
    farrowCrown: [
      "The first one crowns, stretchin' %n wider than any stud ever did. They pant, push, pant, and with a rush of fluid it slides out into the farm girl's waitin' hands.",
      "%n strains till the cords stand out in their neck, and the first of the litter comes, slick and squallin'. The farm girl wipes it down and lays it in the straw by their teats."],
    farrowMid: [
      "No rest. The next one's right behind, and %n is pushin' again before they've caught their breath. Their milk's lettin' down already, runnin' in streams with every heave.",
      "Another, and another. %n is on all fours now, rockin', lowin' like stock, and every push leaves one more squirmin' in the straw.",
      "The farm girl reaches in to help turn one, and %n shrieks, and it comes, and so does the one behind it."],
    farrowHuge: [
      "It's a litter fit for a sow. %n has been at it so long they've gone quiet and glassy, just pushin' when their body says push, while the straw fills up round them.",
      "They keep comin'. %n's belly is shrinkin' by the handful, and there's still a row of little shapes movin' under the skin, waitin' their turn."],
    farrowEnd: [
      "With one last long push, %n delivers the last of %x (%ml), sired by %c. The farm girl tucks them in the straw against %n's swollen teats, and the milk comes in hard.",
      "%x in the straw (%ml), every one of them %c's. %n lies on their side, spent and leakin' milk, while the litter roots and latches on."],
    belly1: ["%n's belly has started to round out. It's showin' now.", "There's a soft new curve low on %n. Somethin' in there is growin'."],
    belly2: ["%n's belly has gone heavy. It hangs, and sways when they walk, and they've started carryin' a hand under it.",
             "%n is properly swollen now: a taut, heavy gut that leads the way into every room."],
    belly3: ["%n is huge. Their belly sits on their thighs when they kneel, skin stretched shiny, navel popped. Whatever's in there, there's a lot of it.",
             "%n's belly has swelled past all decency: a great tight dome they have to lean back to balance. You can see things shift under the skin."],
    belly4: ["%n can't see their own feet. Their belly is enormous, low and draggin', and they waddle with their knees apart and their back bowed, groanin' at every step.",
             "%n is so full they can hardly walk. That belly reaches halfway to their knees, drum-tight and movin', and they need a rail to get up from the straw."],
    bellySeen: ["%n's belly is %c. You can't stop lookin' at it.", "Standin' this close, you can see %n's swollen belly move. Somethin' in there just rolled over.",
                "%n is %c with it. You could set a mug on that belly.", "You catch yourself wantin' to lay a hand on %n's belly, just to feel what's in there."],
    scent_wolves: ["A howl goes up from the far side of the yard. Then another, closer. They've caught %n's scent.",
                   "Somethin' is trottin' this way through the long grass, more than one of them, noses down. %n smells like a bitch in season to anything with a muzzle."],
    scent_stallion: ["A stall door bangs open somewhere. Hoofbeats, heavy and unhurried, comin' straight for %n. The stud's smelled a mare.",
                     "The stallion lifts his head three barns away, curls his lip, and starts walkin'. He knows exactly where %n is."],
    scent_boar: ["There's a squeal and a splinterin' of rails from the sty. The boar's out, and he's followin' his nose to %n.",
                 "The boar comes snufflin' round the corner, bristles up, slobber swingin'. %n smells like slop and sow, and he means to have both."],
    leeches: [
      ["%n leans over the trough for a drink. The water isn't empty. Somethin' black and soft and long as a hand loops up out of it and slaps wetly onto their chest.",
       "The trough water stirs as %n bends to it. A dozen fat dark shapes rise to the surface, and the nearest ones jump."],
      ["Leeches. Big ones. Two find %n's nipples before they can straighten up and latch on with soft round mouths, and start to suck, slow and strong.",
       "They fasten on %n's teats like calves, cool and slick, and begin to feed. Each pull goes right through to the root of them."],
      ["More of them inch up %n's thighs, lookin' for somewhere soft. One settles over their clit and seals on. %n's legs fold.",
       "A third leech works its way between %n's legs and finds what it wants. It doesn't bite. It suckles, and it does not let go."],
      ["%n kneels by the trough with a leech on each tit and one between their legs, all three pulsin' in time, drinkin' them and swellin' fat. They can't pull them off. They've stopped tryin'.",
       "They feed on %n till they're round as plums, and %n is left pantin', rockin' against the one below, milked by somethin' with no eyes."]],
    leechesEnd: ["The one between %n's legs drops off, full. The two on their teats stay. They've had %ml and they want the rest, and %n's tits are swellin' round them.",
                 "%n gets their breath back with two fat leeches still hangin' from their nipples, heavy and warm. %ml gone into them already."],
    wellGrab: [
      "%n leans over the well to look. Far down, the water looks back. A rope of somethin' wet comes up the shaft faster than a bucket ever did and takes them round the chest.",
      "The well cover's off. %n hears somethin' breathe down there, and then they're over the lip and goin' down, wrapped tight, into the dark.",
      "Somethin' cold loops %n's ankle from the well mouth and pulls. The stones go by. The circle of sky gets small."],
    wellDeep: [
      "It's black down here and close, and the thing fills the whole shaft. %n hangs in it, held on every side, turned slowly, with its arms goin' over every inch of them in the dark.",
      "%n can't see it. They can only feel it: coils everywhere, the walls themselves movin', and no way to tell up from down. It has all the time in the world down here."],
  };
