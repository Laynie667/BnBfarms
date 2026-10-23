  /* WHAT'S IN THIS FILE (10uh-teaseme.js)
     TEASE ME, rebuilt (Laynie, Oct 23: "some of my users want the teaseme function back"; light is "3-4 a hour to set
     a base line"; "switching it on should be by pet or herd leader"). The old one whispered the same staff lines to
     everybody at random. This one notices them: a line about what's goin' on with THEM right now (full udders, a load
     still in them, a heat, a cage, a mess, the trap they just crawled out of, their tally), fitted to their body and
     their kind, now and then one of the staff's own lines, or one their herd leader wrote just for them.
     • ?teaseme on|off · ?teaseme light|steady|needy (light 3-4 an hour, steady about 6, needy about 10)
       ?teaseme <who> on|off|light|steady|needy: their herd leader can do it for them. Nobody else can.
     • Whispered, so it's private (and in their Companion's panel). Never while they're on ?quiet, in a trap or a
       scene, or gone quiet for half an hour; nothin' they've heard lately; at most TEASE_DAY_MAX a day.
     • ?tease add <line> · ?tease list · ?tease remove <n> (staff, lines for everybody: %name% is their name)
       ?tease for <who> <line> (their herd leader: a line only that pet ever gets)
     The Toggles switch is "Tease me".
  */
  const TEASE_RATE = { light: [15, 20], steady: [8, 12], needy: [5, 7] };   // minutes between teases
  const TEASE_SAY = { light: "3 or 4 times an hour", steady: "about 6 times an hour", needy: "about 10 times an hour" };
  const TEASE_LINES = {
    udders: [
      "{t}Those udders are gettin' heavy, sugar. I can see them sway from here. Somebody ought to strip you out before you start drippin' on the floor.",
      "{t}You're full, aren't you? Tight and achin' and beadin' at the tips. Ask a farmhand real sweet and maybe they'll milk you by hand.",
      "{t}Every step you take, those swollen tits bounce and ache. The pump's waitin' in the parlour, sugar. It misses you.",
      "{t}I bet if somebody so much as brushed your nipples right now, you'd squirt all down your front. Want to find out?",
      "{t}The parlour's quiet and your udders are not. Go get yourself hooked up before they start to throb.",
      "{t}There's a wet spot spreadin' on your front, hon. Everybody you walk past can see you're leakin'.",
      "{t}Cup those heavy tits in your hands and feel how full they are. Now think about the cups pullin' on them, slow and steady.",
      "{nt}Your chest is achin' full, sugar, and those puffy little nipples are about ready to drip. The pump would love to have you."],
    balls: [
      "{c}Those balls are swollen tight, sugar. Full to the brim and nobody's milked you. Doesn't that ache?",
      "{c}You're carryin' a heavy load down there. The collection bench could take care of that for you, nice and slow.",
      "{c}All that seed, backed up and achin', and nobody's done a thing about it. Poor thing.",
      "{c}Your cock twitches every time somebody bends over. The farm notices, sugar. The farm always notices.",
      "{c}Heavy and full and throbbin'. Somebody should strap a sleeve on you and drain you dry.",
      "{c}You're leakin' a little already, aren't you? That's how full you are. Go find a stall that needs a stud."],
    seeded: [
      "Still full from earlier, aren't you? I can tell by the way you're walkin'. Careful, it'll start to run.",
      "{v}You've still got somebody's seed sloshin' in you, sugar. Every time you sit down you can feel it shift.",
      "Somebody left a load in you and you're still carryin' it around like a good little breeder. Don't you dare wash.",
      "{v}Squeeze those thighs together, hon, or it's goin' to drip right down to your knees in front of everybody.",
      "{nv}Your ass is still full and warm from the last one. You're leakin' a little, did you know?",
      "Every breath, you can feel it in you, warm and heavy. That's what a well-used animal feels like.",
      "Keep that load in you. Clench. The farm wants it to take.",
      "{v}Every step pushes a little more of it out of you and down your thigh. Leave it. It suits you."],
    heat: [
      "You're in heat and the whole barn can smell it, sugar. Every stud you walk past turns to look.",
      "{v}You're drippin'. Nobody's even touched you and you're drippin'. That's the heat talkin'.",
      "That itch won't go away on its own, sugar. You need a stud in you, and you know it.",
      "Rub your thighs together all you like, hon. It won't help. Only one thing helps a heat.",
      "You keep lookin' at the stud stalls. I see you. Go on and present for somebody.",
      "You keep liftin' your hips when you think nobody's lookin'. Every stud on the farm knows what that means.",
      "{v}You're so hot and swollen down there you can barely think. Good. Thinkin' is overrated in a heat.",
      "Bend over anywhere, sugar. Somebody'll take the hint. Somebody always does."],
    denied: [
      "Still achin', still throbbin', still not allowed. Isn't that the sweetest kind of torture?",
      "Right to the edge, and no further. Not today, sugar. Maybe not tomorrow either.",
      "{c}Bet that cock's throbbin' right now, beggin' for it. Good. It's meant to.",
      "You could beg, you know. It prob'ly won't work. But it'd be fun to hear.",
      "Every time you get close, remember: you don't get to. The farm decides when.",
      "{v}Your pussy's so swollen and needy, and it's goin' to stay that way. Don't touch.",
      "Hands off, sugar. You finish when the farm says, and the farm hasn't said.",
      "Think about the last time somebody had you right at the edge and stopped. Now think about how long it'll be till they let you finish."],
    caged: [
      "{c}That cage must feel awful tight right now. Good. It's meant to.",
      "{c}Strainin' against that little cage again? You'll get used to it. Or you won't. Either way, it stays on.",
      "{c}Locked up nice and tight. Nobody's touchin' that cock till the farm says so, not even you.",
      "{c}Every time you get hard, the cage reminds you who it belongs to. And it isn't you.",
      "{c}The key's hangin' up in the office, sugar. You'll be walkin' past it all day."],
    belly: [
      "Look at that belly, so round and full. You're carryin' for the farm now, sugar, and everybody can see it.",
      "Your belly's gettin' heavy. Every time you shift, you remember whose breeder you are.",
      "So swollen and tight. Somebody should rub that belly for you while they breed you again.",
      "You waddle now, did you know? It's adorable. The studs think so too.",
      "Hands on your belly, sugar. Feel how full you are. Feel how much the farm put in you.",
      "Big and round and stuffed full. A belly like that is a good animal's belly."],
    messy: [
      "You've still got it all over you, sugar. Sticky and filthy and you haven't even tried to wash. Good animal.",
      "You smell like the farm, hon. Like the trough and the stalls and everybody that's had you. Don't you dare wash it off.",
      "There's still a mess dryin' on you. Everybody you walk past can see what you've been up to.",
      "Leave it on. You look better filthy.",
      "Somebody's goin' to want to add to that mess. Stand still and let them.",
      "You're a sight, sugar. Sticky in places you can't even reach. You could wash, but I'd rather you didn't."],
    trap: [
      "Back on your feet already? That trap sure made a mess of you. There's more out there, you know.",
      "You're still shakin' from that trap. Mind your step, sugar, the next one's closer than you think.",
      "The traps have had a taste of you now. They'll want more.",
      "You walked right into that one, didn't you? Almost like you wanted to.",
      "Your legs are still wobbly. Whatever got you, it got you good.",
      "I heard you out there. The whole farm heard you."],
    tally: [
      "That's quite a tally on your thigh today, sugar. Somebody's been popular.",
      "How many is it now? You've lost count, haven't you? The farm hasn't.",
      "Used and used and used again today, and you're still lookin' for more. Greedy thing.",
      "Every mark on that tally is somebody who had you today. Want to make it one more?",
      "%tally today, and the day isn't done. Let's see how high it goes."],
    contract: [
      "You signed today, sugar. Every word of it. You belong to the farm now, and the farm intends to enjoy it.",
      "Remember what you agreed to this mornin'? The farm does.",
      "Fresh contract, fresh animal. Let's see how long before you forget you were ever anything else."],
    general: [
      "Somebody's thinkin' about you, sugar. Somebody with very rough hands.",
      "You look like you could use a good, hard milkin'. Or a breedin'. Or both.",
      "Bet you can't go five minutes without thinkin' about the stud barn now.",
      "Don't fidget, hon. Everybody notices when you fidget.",
      "Wouldn't it be nice to just kneel, right where you are, and wait to be used?",
      "There's a hay bale in the back barn with your shape pressed into it. Go lie in it and think about why.",
      "One of the farmhands asked about you today. Asked what you sound like when you're bred.",
      "Some animals on this farm earn their keep. Some just get used. Which one are you?",
      "The farm's been very patient with you today. It won't last.",
      "Spread your knees a little when you sit, sugar. Let the farm see what it owns."],
    species: [
      "Such a good %sp. You know what you're for, don't you?",
      "Every %sp on this farm has a purpose, sugar. Yours is to be used.",
      "Go on, make that noise for me, little %sp. Nobody's listenin'. Prob'ly.",
      "A good %sp stays close to the barn and does what it's told. Are you bein' a good %sp?"],
  };
  // a few for each kind of animal, mixed in with the ones above
  const TEASE_KIND = {
    cow: ["Moo for me, sugar. Nice and low, like a good cow at milkin' time.", "A good cow stands still for the cups and doesn't fuss. Are you a good cow?",
          "There's a stall in the dairy barn with your name on it. Go stand in it and wait."],
    pony: ["Pick those feet up high, pony. Prance for me.", "A pony's mouth is made for a bit, sugar. Open wide.",
           "Somebody's fixin' to hitch you to the cart. Stand still and let them buckle you in."],
    pup: ["Sit. Stay. Good pup. Now roll over and show your belly.", "Whose good pup are you? Wag for me.",
          "Fetch, sugar. On all fours, mouth only."],
    kitty: ["Purr for me, kitty. Louder.", "Stretch out in the sun, kitty, and stick that rump up high.",
            "Somebody's got a saucer of cream with your name on it. Crawl over and lap it up."],
    bunny: ["Twitch that little nose for me, bunny. You know what bunnies are famous for.", "Bunnies breed like nothin' else on the farm, sugar. Hop to it.",
            "Ears up, bunny. Somebody's comin'."],
    goat: ["Stubborn little goat. The farm knows how to break stubborn.", "Bleat for me, sugar. Nice and loud.",
           "Goats'll put anything in their mouths, they say. Open up and let's find out."],
    pig: ["Oink for me, piggy. Louder. Let the whole sty hear.", "Such a greedy little piggy. Always hungry, always wantin' more.",
          "Roll around in the mud for me, piggy. Get nice and filthy."],
    deer: ["Easy, little deer. Skittish thing. Nobody's goin' to hurt you. Much.", "Those big eyes won't save you, sugar. Kneel.",
           "Standin' in the meadow waitin' for a stag to find you, little deer?"],
    fox: ["Sly little fox. You think you'll slip away. You won't.", "Every fox gets caught sooner or later, sugar. Then it gets bred.",
          "Swish that big tail for me, fox."],
    goblin: ["Filthy little goblin. Rags and mud and that grin. Come here.", "Goblins are made for the dirty jobs, sugar. Guess what job needs doin'.",
             "Back in your rags, goblin, and down on your knees where you belong."],
  };
  const TEASE_KIN = { bull: "cow", horse: "pony", dog: "pup", wolf: "pup", kitt: "kitty", cat: "kitty", rabbit: "bunny", sheep: "goat" };
  const teaseKind = (mn) => { const s = String((rec(mn) || {}).species || "").toLowerCase(); return TEASE_KIN[s] || s; };
  const teaseSp = (mn) => { const s = String((rec(mn) || {}).species || "").toLowerCase(); return s === "kitt" ? "kitty" : s || "pet"; };
  // their switch (the old ?teaseme on carries over as light)
  function teaseRate(r){
    if (!r) return null;
    if (r.teaseOptIn && r.teaseMe === undefined){ r.teaseMe = "light"; delete r.teaseOptIn; }
    return TEASE_RATE[r.teaseMe] ? r.teaseMe : null;
  }
  const caged = (mn) => { try { return ((charFor(mn) || {}).Appearance || []).some(a => /Chastity/i.test((a.Asset && a.Asset.Name) || "")); } catch(e){ return false; } };
  // what's goin' on with them right now: [pool, weight]
  function teaseContexts(mn){
    const p = prodOf(mn), r = rec(mn) || {}, now = Date.now(), out = [["general", 2], ["species", 2]];
    const add = (k, w, f) => { try { if (f()) out.push([k, w]); } catch(e){} };
    add("udders", 4, () => p && makesMilk(mn) && p.milk > 0.7 * milkCap(mn));
    add("balls", 3, () => p && makesSemen(mn) && p.semen > 0.7 * semenCap(mn));
    add("seeded", 4, () => p && p.held && heldTotal(p) > 0.25 * capacity(mn));
    add("heat", 5, () => inHeat(p));
    add("denied", 4, () => p && p.deniedUntil > now);
    add("caged", 3, () => caged(mn));
    add("belly", 3, () => bellyStage(mn) >= 2);
    add("messy", 3, () => paintedText(mn) || aftermathOf(mn).length);
    add("trap", 3, () => r.trapAt && now - r.trapAt < 40 * 60000);
    add("tally", 3, () => tallyToday(mn) >= 3);
    add("contract", 2, () => (L.contracts || []).some(x => x.mn === mn && x.status === "signed" && x.signedAt && now - x.signedAt < 86400000));
    return out;
  }
  function teaseLine(mn){
    state.teaseHeard = state.teaseHeard || new Map();
    const heard = state.teaseHeard.get(mn) || [];
    // a line their herd leader wrote for them now and then, a staff line for everybody now and then
    const mine = (L.tease || []).filter(x => x.for === mn), all = (L.tease || []).filter(x => !x.for);
    const fresh = (list) => { const f = list.filter(l => !heard.includes(l)); return f.length ? f : list; };
    const any = (list) => list[Math.floor(Math.random() * list.length)];
    let line;
    if (mine.length && Math.random() < 0.3) line = any(fresh(mine.map(x => x.text)));
    else if (all.length && Math.random() < 0.15) line = any(fresh(all.map(x => x.text)));
    else {
      const ctx = teaseContexts(mn), total = ctx.reduce((a, c) => a + c[1], 0);
      let roll = Math.random() * total, pick = "general";
      for (const [k, w] of ctx){ roll -= w; if (roll <= 0){ pick = k; break; } }
      let b = null; try { b = bodyOf(mn); } catch(e){}
      const poolFor = (k) => {
        let pool = TEASE_LINES[k];
        if (k === "species" && TEASE_KIND[teaseKind(mn)]) pool = pool.concat(TEASE_KIND[teaseKind(mn)], TEASE_KIND[teaseKind(mn)]);
        return b ? pool.filter(l => tagsFit(l, b) && wordsFit(l, b)) : pool;
      };
      const unheard = (list) => list.filter(l => !heard.includes(l));
      // heard all of that one lately: somethin' else that's goin' on with them, then anything not just said
      let cands = unheard(poolFor(pick));
      if (!cands.length) cands = unheard([].concat(...ctx.map(([k]) => poolFor(k))));
      if (!cands.length){ const p0 = poolFor(pick).length ? poolFor(pick) : TEASE_LINES.general; cands = p0.filter(l => !heard.slice(-5).includes(l)); if (!cands.length) cands = p0; }
      line = any(cands);
    }
    heard.push(line); if (heard.length > 15) heard.shift(); state.teaseHeard.set(mn, heard);
    return fill(bodyWords(mn, line), mn).replace(/%sp/g, teaseSp(mn)).replace(/%tally/g, () => { const n = tallyToday(mn); return n + (n === 1 ? " mark" : " marks"); });
  }
  // who's due one
  function teaseMeTick(){
    if (!CFG.TEASE_ENABLED) return;
    state.teaseNext = state.teaseNext || new Map();
    const now = Date.now(), day = dayKey();
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C.MemberNumber, r = rec(mn);
      if (!r || mn === CFG.BOT_MEMBER) continue;
      const rate = teaseRate(r);
      if (!rate || quietNow(mn)){ state.teaseNext.delete(mn); continue; }
      const [lo, hi] = TEASE_RATE[rate], gap = (lo + Math.random() * (hi - lo)) * 60000;
      const next = state.teaseNext.get(mn);
      if (!next){ state.teaseNext.set(mn, now + gap); continue; }   // the first one a while after they arrive (or switch it on)
      if (now < next) continue;
      // in a trap or a scene: it waits till they're done. Gone quiet for half an hour: they're away, so skip this one
      const busy = heldByTrap(mn) || (state.sceneRun && state.sceneRun.has(mn)) || [...(state.scenes || new Map())].some(([s, sc]) => s === mn || ((sc && sc.with) || []).includes(mn));
      if (busy) continue;
      state.teaseNext.set(mn, now + gap);
      if (now - (state.lastSpoke.get(mn) || 0) > 30 * 60000) continue;
      r.teaseDay = r.teaseDay && r.teaseDay.d === day ? r.teaseDay : { d: day, n: 0 };
      if (r.teaseDay.n >= CFG.TEASE_DAY_MAX) continue;
      r.teaseDay.n++;
      try { whisper(mn, "😈 " + teaseLine(mn)); } catch(e){ warn("tease:", e); }
    }
  }
  // ?teaseme [on|off|light|steady|needy] · ?teaseme <who> <that>
  function teaseMeCommand(sender, args, R){
    const SET = ["on", "off", "light", "steady", "needy"], a0 = String(args[0] || "").toLowerCase();
    let t = sender, v = a0;
    if (a0 && !SET.includes(a0)){
      t = resolveTarget(args[0]); v = String(args[1] || "").toLowerCase();
      if (!t || !rec(t)){ R("Who, sugar? ?teaseme <who> on|off|light|steady|needy, for somebody in your herd."); return; }
      if (t !== sender && !herdsOf(t).some(h => h.leader === sender)){ R("Only "+plainName(t)+" or their herd leader can switch their teasin', sugar."); return; }
    }
    const r = rec(t);
    if (!r || !(r.roles || []).length){ R(t === sender ? "That's just for folks on the books, sugar. Say ?apply first!" : plainName(t)+" isn't on the books yet, sugar."); return; }
    const who = t === sender ? "you" : plainName(t), now0 = teaseRate(r);
    if (!SET.includes(v)){
      R("😈 Tease me is "+(now0 ? now0+" for "+who+", "+TEASE_SAY[now0] : "off for "+who)+". ?teaseme "+(t === sender ? "" : plainName(t)+" ")+"on, off, light, steady or needy.");
      return;
    }
    r.teaseMe = v === "off" ? null : v === "on" ? (now0 || "light") : v;
    state.teaseNext && state.teaseNext.delete(t); saveLedger(); syncCompanions(true); audit(sender, "TEASEME", t+" "+(r.teaseMe || "off"));
    if (!r.teaseMe){
      R(t === sender ? "Alright, hon. No more whisperin' in your ear. ?teaseme on if you miss me." : "😈 Teasin's off for "+plainName(t)+".");
      if (t !== sender) tell(t, "😈 "+plainName(sender)+" switched your teasin' off, sugar.");
      return;
    }
    if (t === sender) R("😈 Ooh. You'll hear from me "+TEASE_SAY[r.teaseMe]+" while you're on the farm, sugar, and I'll be payin' attention. ?teaseme off to stop.");
    else { R("😈 "+plainName(t)+" will be teased "+TEASE_SAY[r.teaseMe]+"."); tell(t, "😈 "+plainName(sender)+" asked me to keep you company, sugar. You'll hear from me "+TEASE_SAY[r.teaseMe]+". ?teaseme off and I'll stop."); }
  }
  // ?tease: staff lines for everybody; a herd leader's lines for one of theirs
  function teaseLinesCommand(sender, args, R){
    L.tease = L.tease || [];
    const sub = String(args[0] || "list").toLowerCase(), staff = isStaff(sender);
    if (sub === "for"){
      const t = resolveTarget(args[1]), line = args.slice(2).join(" ").trim();
      if (!t || !rec(t) || !line){ R("?tease for <who> <line>: a tease only they ever get, and %name% is their name. For example: ?tease for Bessie Your herd leader is thinkin' about you, %name%."); return; }
      if (!herdsOf(t).some(h => h.leader === sender) && !isProprietor(sender)){ R("Only "+plainName(t)+"'s herd leader can write them a tease of their own, sugar."); return; }
      L.tease.push({ text: line, by: sender, at: Date.now(), for: t }); saveLedger(); audit(sender, "TEASE_FOR", t+" "+line.slice(0, 60));
      R("😈 Saved. Only "+plainName(t)+" will ever hear that one."+(teaseRate(rec(t)) ? "" : " Their teasin's off right now: ?teaseme "+plainName(t)+" on."));
      return;
    }
    if (sub === "add"){
      if (!staff){ R("Writin' teases for everybody is for staff, sugar. Herd leaders: ?tease for <who> <line> writes one for somebody in your herd."); return; }
      const line = args.slice(1).join(" ").trim();
      if (!line){ R("?tease add <line>, and %name% becomes their name. For example: ?tease add Somebody looks awful cute today, %name%."); return; }
      L.tease.push({ text: line, by: sender, at: Date.now() }); saveLedger(); audit(sender, "TEASE_ADD", line.slice(0, 60));
      R("😈 Added. "+L.tease.filter(x => !x.for).length+" of the staff's teases on file, mixed in with the farm's own.");
      return;
    }
    // what they may see: staff see everything, a herd leader the ones they wrote
    const shown = L.tease.map((x, i) => [x, i]).filter(([x]) => staff || x.by === sender);
    if (sub === "remove" || sub === "del"){
      const i = parseInt(args[1], 10) - 1, hit = L.tease[i];
      if (!hit || !(staff || hit.by === sender)){ R("Which number, hon? ?tease list, then ?tease remove <n>."); return; }
      L.tease.splice(i, 1); saveLedger(); audit(sender, "TEASE_REMOVE", hit.text.slice(0, 60)); R("Took it off: "+hit.text);
      return;
    }
    const on = Object.values(L.people).filter(r => teaseRate(r)).length;
    R("😈 TEASES · "+on+" switched on\n"+(shown.length ? shown.map(([x, i]) => (i + 1)+". "+(x.for ? "for "+plainName(x.for)+": " : "")+x.text).join("\n") : "None written yet: the farm writes its own, fitted to each of them.")+
      "\n"+(staff ? "?tease add <line> · " : "")+"?tease for <who> <line> · ?tease remove <n>");
  }
