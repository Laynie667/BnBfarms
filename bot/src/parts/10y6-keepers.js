  /* WHAT'S IN THIS FILE (10y6-keepers.js)
     • TOYS THAT FOLLOW THE SCENE: while a trap has somebody, any buzzin' toy they're really wearin' follows it: low
       while it teases, high when it breeds them, dead still while they're denied. Their Companion turns the dial
       (only with "Farm can stir me up" on), and puts it back how it was after.
     • BUILD YOUR OWN TRAP: ?trap make <name> <dose|hold|fill|breed|strip|write> [mild|strong|brutal] [words] | a line | a line…
       It sits on a spot like any other (?spot set trap-<name>) and turns up in pot luck. ?trap unmake <name> · ?trap made
     • BROODIN': eggs in the nest don't have to be sold. ?sit on the nest (or staff: ?sit <who>) and they're kept
       there, fed by hand, till the clutch hatches. The brood is theirs on the board.
     • THE KEEPER'S WHISTLE: staff call one of the farm's own to a subject wherever they stand: ?whistle <which> <who>.
     • A KEEPSAKE: after a trap, a clutch, a litter, a hatchin', a parasite's twelve hours, a little card of what happened
       goes in an album only they can open (?album, and the Traps tab).
     • TRAINED HOLES: each hole keeps a record of what it has taken. At 10, 25, 50 and 100 loads it's trained a step:
       they hold more for good, and the traps pour more into that hole. ?holes
     • BARN DREAMS: sleep in the barn through curfew and the night whispers what the day did to you. You wake needy,
       sore, or carryin'.
     • HERD LEADERS GET THE REINS: a leader can ?send <who> <trap>, ?dose <who> <shot words> and bait traps for their
       own herd, sees their trap cards (?herdtraps), and takes a quarter of what their animals earn at the nest.
     • FLUIDS AS COIN: everything milked or collected from you goes in your vat (?vat). ?buy <potion or shot> with milk
       pays from it. The week's top producer pays a quarter less.
  */
  const kLine = (key, mn, v) => tFill(pickFresh("keep:"+key, KEEP_LINES[key]), mn, v);

  // ── toys that follow the scene ─────────────────────────────
  // level: -1 still · 0 low · 1 medium · 2 high · 3 flat out · null = put them back how they were
  function toysFollow(mn, level, until){ if (hasCompanion(mn)) enqueue(makeMsg("vibe", { level: level, until: until || 0 }, mn)); }
  function toysBeat(mn, i, n){
    const f = n ? i / n : 1;
    toysFollow(mn, f < 0.35 ? 0 : f < 0.65 ? 1 : f < 0.9 ? 2 : 3);
  }
  function toysAfter(mn){
    const p = prodOf(mn), now = Date.now();
    if (p && p.deniedUntil > now) toysFollow(mn, -1, p.deniedUntil); else toysFollow(mn, null);
  }

  // ── build your own trap ────────────────────────────────────
  const CUSTOM_DOES = {
    dose:  { what: "a dose of somethin'",                  limit: null,                                               hold: [2, 2, 3] },
    hold:  { what: "it catches you and keeps you",         limit: /\b(snare|rope|immobil)/i,                          hold: [3, 6, 10] },
    fill:  { what: "it pumps you full",                    limit: /\b(inflat|enema|pump|belly)/i,                     hold: [3, 4, 5] },
    breed: { what: "it breeds you",                        limit: /\b(breed|pregnan|impregnat|cum|creampie|seed)/i,   hold: [3, 4, 6] },
    strip: { what: "it has every stitch off you",          limit: /\b(strip|nud|naked|expos)/i,                       hold: [1, 1, 2] },
    write: { what: "it writes on you",                     limit: /\b(writ|mark|humiliat)/i,                          hold: [2, 2, 3] },
  };
  const SEV_N = { mild: 1, strong: 2, brutal: 3 };
  function customRegister(k, c){
    const D = CUSTOM_DOES[c.does]; if (!D) return;
    TRAP_KINDS[k] = { icon: "🛠️", what: (c.what || D.what)+" ("+c.sev+", built by "+plainName(c.by)+")", limit: D.limit, custom: true };
    MORE_TRAPS[k] = (mn, spot) => customTrap(mn, k, spot);
    if (c.does === "breed") TRAP_NEEDS[k] = (mn) => limitBlocks(mn, "breed") ? "their limits rule it out" : null;
  }
  function customLoad(){
    if (state.customLoaded) return; state.customLoaded = true;
    for (const [k, c] of Object.entries(L.customTraps || {})){ try { customRegister(k, c); } catch(e){ warn("custom trap "+k+":", e); } }
  }
  function customTrap(mn, k, spot){
    const c = L.customTraps[k], D = CUSTOM_DOES[c.does], r = rec(mn), p = prodOf(mn), sev = SEV_N[c.sev] || 1, v = {};
    const beats = c.lines && c.lines.length ? c.lines.map(x => [x]) : KEEP_LINES["custom_"+c.does];
    trapHold(mn, D.hold[sev - 1], "the "+k+" trap");
    trapRun(mn, k, beats, () => {
      switch (c.does){
        case "dose": {
          const pool = INJECTOR_LOADS.filter(t => (!/lactation|udder/.test(t) || makesMilk(mn)) && (!/virility/.test(t) || makesSemen(mn)) && (!/heat/.test(t) || !limitBlocks(mn, "heat")) &&
                                                  (!/egg/.test(t) || !limitBlocks(mn, "eggs")) && (!/fertil|hyper/.test(t) || !limitBlocks(mn, "breed")) && !/ x\d/.test(t));
          let text = c.words || pool[Math.floor(Math.random()*pool.length)] || "ass growth";
          if (shotTimes(text) <= 1 && sev > 1) text += " x"+sev;
          if (!applyShot(mn, BOTMN(), text, { open: kLine("customDose", mn), from: "the "+k+" trap's dose", heatH: 1 })) emote("🛠️ "+kLine("customDud", mn), mn);
          break;
        }
        case "hold": {
          const mins = [3, 6, 10][sev - 1];
          arouse(mn, 20*sev, 94);
          later(() => { if (charFor(mn) && !rec(mn).penned){ trapHold(mn, mins, "the "+k+" trap"); tell(mn, "🛠️ It's not lettin' go yet, sugar: "+tmin(mn, mins)+" more minutes right where you are. Your safeword opens it."); } }, 300);
          break;
        }
        case "fill": {
          const hole = openHole(mn, "butt");
          if (!hole){ emote("🛠️ "+kLine("customShut", mn), mn); break; }
          v.ml = ml(trapFill(mn, hole, [200, 400, 700][sev - 1], CFG.TRAP_OVERFULL)); v.h = TRAP_HOLE[hole];
          emote("🛠️ "+kLine("customFill", mn, v), mn); splatBody(mn, hole);
          break;
        }
        case "breed": {
          const hole = r.breedable ? openHole(mn, "vulva") : null, load = [150, 300, 500][sev - 1];
          if (!hole){ splatBody(mn, "back"); emote("🛠️ "+kLine("customOver", mn, { ml: ml(load) }), mn); break; }
          v.ml = ml(trapFill(mn, hole, load, CFG.TRAP_OVERFULL)); v.h = TRAP_HOLE[hole]; tally(mn);
          let took = null;
          if (hole !== "mouth" && r.fertile && canCatchIn(mn, hole)) took = rollConception(mn, FRAME_SIRE, load, 1 + 0.3*sev, hole);
          emote("🛠️ "+kLine("customBreed", mn, v)+(took === "new" ? " "+tFill(pickFresh("trap:anthro:took", ANTHRO_TOOK), mn, v) : ""), mn); splatBody(mn, hole);
          break;
        }
        case "strip": if (!bodyMark(mn, { strip: true })) tell(mn, "🛠️ With the Companion and \"Farm can strip me\" on, that would have had every stitch off you, sugar."); break;
        case "write": {
          const words = String(c.words || "FARM PROPERTY").split("/").map(x => x.trim()).filter(Boolean).slice(0, sev);
          let did = false;
          words.forEach((w, i) => { did = bodyMark(mn, { write: { line: w.toUpperCase().slice(0, 20), pos: (Math.floor(Math.random()*3) + i*3) % 9, style: 0 } }) || did; });
          if (!did) tell(mn, "🛠️ With the Companion and \"Farm can mark my body\" on, you'd be wearin' \""+words.join("\" and \"")+"\" right now, sugar.");
          break;
        }
      }
      arouse(mn, 10*sev); face(mn, "edged", 60);
    }, v);
  }
  function customTrapCommand(a0, sender, args, R){
    customLoad();
    if (!isProprietor(sender)){ R("Buildin' traps is just for the proprietors, sugar."); return true; }
    L.customTraps = L.customTraps || {};
    if (a0 === "made"){
      const all = Object.entries(L.customTraps);
      R(all.length ? "🛠️ HOME-BUILT TRAPS\n"+all.map(([k, c]) => "• "+k+": "+c.does+", "+c.sev+(c.words ? " ["+c.words+"]" : "")+" · "+(c.lines.length || "stock")+" line"+(c.lines.length === 1 ? "" : "s")+" · spot name trap-"+k).join("\n")+"\n?trap unmake <name> takes one apart."
                   : "🛠️ Nothin' home-built yet, sugar.\n?trap make <name> <dose|hold|fill|breed|strip|write> [mild|strong|brutal] [words] | first line | second line…\nUse %n for their name. Then stand where you want it and ?spot set trap-<name>.");
      return true;
    }
    const k = String(args[1] || "").toLowerCase();
    if (a0 === "unmake"){
      if (!L.customTraps[k]){ R("There's no home-built trap by that name, sugar. ?trap made lists them."); return true; }
      delete L.customTraps[k]; delete TRAP_KINDS[k]; delete MORE_TRAPS[k]; delete TRAP_NEEDS[k]; saveLedger(); audit(sender, "TRAPMAKE", "unmake "+k);
      R("🛠️ The "+k+" trap is taken apart. Any spot named trap-"+k+" springs pot luck now."); return true;
    }
    const does = String(args[2] || "").toLowerCase();
    if (!/^[a-z]{3,14}$/.test(k) || !CUSTOM_DOES[does]){ R("🛠️ ?trap make <name> <dose|hold|fill|breed|strip|write> [mild|strong|brutal] [words] | first line | second line…\nThe name is one word, letters only. The words are a shot's words for a dose (lactation, heat inducer…) or what to write, with / between lines. Use %n for their name in your lines."); return true; }
    if (TRAP_KINDS[k] && !L.customTraps[k]){ R("There's already a trap called "+k+", sugar. Pick another name."); return true; }
    const parts = args.slice(3).join(" ").split("|").map(x => x.trim());
    let head = parts.shift() || "", sev = "strong";
    const sm = head.match(/^(mild|strong|brutal)\b\s*/i); if (sm){ sev = sm[1].toLowerCase(); head = head.slice(sm[0].length); }
    const words = head.trim().slice(0, 80);
    if (does === "dose" && words && !tagsIn(words).size && !sizeTagsIn(words).length){ R("I can't find a shot word in \""+words+"\", sugar. Try lactation, fertility, heat inducer, egg laying, hyper pregnancy, udder growth…"); return true; }
    const lines = parts.filter(Boolean).slice(0, 8).map(x => x.slice(0, 240));
    const c = L.customTraps[k] = { does, sev, words: does === "write" ? words : words.toLowerCase(), lines, by: sender, t: Date.now() };
    customRegister(k, c); saveLedger(); audit(sender, "TRAPMAKE", k+" "+does+" "+sev);
    R("🛠️ Built: the "+k+" trap. It "+CUSTOM_DOES[does].what.replace(/^it /, "")+", "+sev+(words ? " ["+words+"]" : "")+", with "+(lines.length ? lines.length+" line"+(lines.length === 1 ? "" : "s")+" of your own" : "the stock lines")+".\nStand where you want it and say ?spot set trap-"+k+". ?trap spring <who> "+k+" tries it out.");
    return true;
  }

  // ── broodin' on the nest ───────────────────────────────────
  function sitStart(mn, by, R){
    const r = rec(mn), now = Date.now(), n = (L.nest && L.nest.eggs) || 0, pos = posOf(mn);
    if (!r || !r.roles || !r.roles.length){ R("That's for folks on the books, sugar."); return; }
    if (r.sitting){ R("🪺 "+(by === mn ? "You're" : plainName(mn)+" is")+" already sittin' a clutch."); return; }
    const nest = nestSpots().find(s => onSpot(mn, s, 1));
    if (!nest || !pos){ R(by === mn ? "Climb onto the nest first, sugar." : plainName(mn)+" needs to be on the nest first, sugar."); return; }
    if (!n){ R("The nest's empty, sugar. Nothin' to keep warm."); return; }
    if (limitBlocks(mn, "eggs") || quietNow(mn)){ R(by === mn ? "Not with your limits and your quiet hour as they are, sugar." : "Their limits or their quiet hour rule it out, sugar."); return; }
    if (r.penned || benchedNow(mn) || stockedNow(mn) || (state.trapRuns && state.trapRuns.has(mn)) || (state.sceneRuns && state.sceneRuns.has(mn))){ R("Somethin' else has "+(by === mn ? "you" : "them")+" right now, sugar."); return; }
    r.sitting = { since: now, until: now + CFG.SIT_MIN*60000, n, by: L.nest.by || {}, types: L.nest.types || {}, next: now + CFG.SIT_LINE_MIN*60000, nest, setBy: by };
    L.nest = { eggs: 0, by: {} };
    r.penned = { until: r.sitting.until + 120000, X: pos.X, Y: pos.Y, name: "the nest", by: BOTMN(), sit: true };
    saveLedger(); audit(by, "SIT", mn+" on "+n);
    emote("🪺 "+kLine("sitStart", mn, { x: String(n) }), mn); sound(mn, "straw");
    tell(mn, "🪺 You're sittin' "+n+" eggs, sugar, and you're kept on the nest till they hatch: about "+CFG.SIT_MIN+" minutes. You'll be fed where you sit. Your safeword gets you up, and the eggs go back in the straw.");
    if (by !== mn) R("🪺 "+plainName(mn)+" is set on the nest over "+n+" eggs.");
    syncCompanions(true);
  }
  function sitStop(mn, why){
    const r = rec(mn); if (!r || !r.sitting) return false;
    const s = r.sitting; r.sitting = null;
    if (r.penned && r.penned.sit) r.penned = null;
    // the eggs go back in the straw, still owed to whoever laid them
    L.nest = L.nest || { eggs: 0, by: {} }; L.nest.eggs += s.n; L.nest.types = L.nest.types || {};
    for (const [m, k] of Object.entries(s.by)) L.nest.by[m] = (L.nest.by[m] || 0) + k;
    for (const [m, t] of Object.entries(s.types)){ const mine = L.nest.types[m] = L.nest.types[m] || {}; for (const [kk, q] of Object.entries(t)) mine[kk] = (mine[kk] || 0) + q; }
    saveLedger();
    if (why !== "gone" && charFor(mn)) emote("🪺 "+kLine("sitStop", mn), mn);
    return true;
  }
  function sitHatch(mn){
    const r = rec(mn), s = r.sitting; r.sitting = null;
    if (r.penned && r.penned.sit) r.penned = null;
    r.brooded = (r.brooded || 0) + s.n;
    const w = subjWeek(); w.hatched = w.hatched || {}; bump1(w.hatched, mn, s.n);
    L.hatched = (L.hatched || 0) + s.n;
    // the layers get half what market would have paid; the sitter is paid for her patience
    for (const [m, k] of Object.entries(s.by)){
      const layer = parseInt(m, 10), got = earnRibbons(layer, Math.max(1, Math.round(Math.min(CFG.GATHER_MAX_RIBBONS, eggsWorth(s.types[m], k)) / 2)), "your eggs hatched under "+plainName(mn));
      leaderShare(layer, got);
    }
    leaderShare(mn, earnRibbons(mn, Math.min(CFG.GATHER_MAX_RIBBONS, Math.max(1, Math.ceil(s.n / 4))), "hatchin' a brood of "+s.n));
    saveLedger(); audit(BOTMN(), "HATCH", mn+" "+s.n);
    emote("🐣 "+kLine(s.n >= 12 ? "hatchBig" : "hatch", mn, { x: String(s.n) }), mn);
    tell(mn, "🐣 "+s.n+" hatched under you, sugar. That's "+r.brooded+" you've brooded all told, and the board knows whose they are.");
    albumAdd(mn, "🐣", "A brood hatched", s.n+" hatched under you after "+Math.round((Date.now() - s.since)/60000)+" minutes on the nest."+(eggTypesText(mergeTypes(s.types)) ? " "+eggTypesText(mergeTypes(s.types))+"." : ""));
    face(mn, "afterglow", 120); syncCompanions(true);
  }
  function mergeTypes(byLayer){ const out = {}; for (const t of Object.values(byLayer || {})) for (const [k, q] of Object.entries(t)) out[k] = (out[k] || 0) + q; return out; }
  function sitTick(now){
    for (const [k, r] of Object.entries(L.people)){
      if (!r.sitting) continue;
      const mn = parseInt(k, 10);
      if (!charFor(mn)){ sitStop(mn, "gone"); continue; }
      if (now >= r.sitting.until){ sitHatch(mn); continue; }
      if (now >= r.sitting.next){
        r.sitting.next = now + CFG.SIT_LINE_MIN*60000; r.sitting.fed = (r.sitting.fed || 0) + 1;
        emote("🪺 "+kLine(r.sitting.fed % 2 ? "sitFed" : "sitWarm", mn), mn);
        if (r.sitting.fed % 2){ const p = prodOf(mn); p.boosts = p.boosts || {}; p.boosts.hungry = 0; arouse(mn, 8); }
        saveLedger();
      }
    }
  }
  function sitHappening(mn){ const r = rec(mn); return r && r.sitting ? "🪺 You're sittin' "+r.sitting.n+" eggs: they hatch in about "+Math.max(1, Math.ceil((r.sitting.until - Date.now())/60000))+" min. Your safeword gets you up." : null; }

  // ── the keeper's whistle ───────────────────────────────────
  function leads(leader, mn){ return !!membership(mn, leader); }
  function whistleCommand(sender, args, R){
    const which = String(args[0] || "").toLowerCase(), t = resolveTarget(args[1]), r = rec(sender), now = Date.now();
    if (!isStaff(sender)){ R("The whistle hangs on the staff hook, sugar."); return; }
    if (!ANTHRO[which] || !t){ R("📯 ?whistle <which> <who>. Who comes when called: "+Object.keys(ANTHRO).join(", ")+"."); return; }
    if (!charFor(t)){ R(plainName(t)+" isn't here, sugar."); return; }
    const wait = (r.whistleAt || 0) + CFG.WHISTLE_COOLDOWN_MIN*60000 - now;
    if (wait > 0 && !isProprietor(sender)){ R("📯 They've only just been called out, sugar. Give it "+Math.ceil(wait/60000)+" more minutes."); return; }
    const why = trapWhyNot(t, which);
    if (why){ R("📯 Nobody comes for "+plainName(t)+": "+why+"."); return; }
    r.whistleAt = now; saveLedger(); audit(sender, "WHISTLE", which+" "+t);
    emote("📯 "+kLine("whistle", t, { c: ANTHRO[which].name, x: plainName(sender) }), t);
    later(() => { if (charFor(t) && !springTrap(t, which, "", true)){ rec(t).trapAt = Date.now(); saveLedger(); } }, 5000);
    R("📯 Called. "+ANTHRO[which].name.replace(/^t/, "T")+" will be on "+plainName(t)+" in a moment.");
  }

  // ── a keepsake ─────────────────────────────────────────────
  function albumAdd(mn, icon, title, text){
    const r = rec(mn); if (!r) return;
    r.album = (r.album || []).concat({ t: Date.now(), i: icon, h: String(title).slice(0, 40), x: String(text).slice(0, 220) }).slice(-CFG.ALBUM_MAX);
    saveLedger();
  }
  function albumFor(mn, n){ const r = rec(mn); return ((r && r.album) || []).slice(-(n || 10)).reverse(); }
  const ALBUM_TITLES = { tentacle: "Taken by the water", well: "Taken down the well", eggs: "The egg post", breeder: "The breedin' frame", milker: "Drained by the trap", pump: "Pumped round", clamp: "Clamped and denied", lantern: "The lantern" };
  // after every trap: the card, and what the holes took
  function keepersAfter(mn, kind, before){
    const r = rec(mn), p = prodOf(mn), laid = (p.eggs ? p.eggs.n : 0) - (before.eggs || 0), A = ANTHRO[kind];
    if (A && A.type === "canine" && r.holes){ const hole = r.holes[A.hole] || r.holes.vulva || r.holes.butt; if (hole) hole.knots = (hole.knots || 0) + A.loads; }
    const bits = [];
    if (laid > 0) bits.push(laid+" eggs left in you");
    if (heldTotal(p) > 0) bits.push(ml(heldTotal(p))+" sloshin' in you after");
    if (p.preg && p.preg.since > Date.now() - 60000) bits.push("and it took");
    if (p.deniedUntil > Date.now()) bits.push("left denied");
    albumAdd(mn, TRAP_KINDS[kind] ? TRAP_KINDS[kind].icon : "🧪", A ? A.name.replace(/^the /, "The ") : ALBUM_TITLES[kind] || "The "+kind+" trap",
             "Trap number "+(r.trapN || 0)+" for you."+(bits.length ? " "+bits.join(", ").replace(/^./, c => c.toUpperCase())+"." : ""));
  }

  // ── trained holes ──────────────────────────────────────────
  const HOLE_MARKS = [10, 25, 50, 100], HOLE_RANK = ["green", "broken in", "well trained", "bottomless", "ruined for anything smaller"];
  function holeLevel(mn, hole){ const h = ((rec(mn) || {}).holes || {})[hole]; return h ? HOLE_MARKS.filter(m => h.loads >= m).length : 0; }
  function holeX(mn, hole){ return 1 + CFG.HOLE_MORE_X*holeLevel(mn, hole); }
  function holeTook(mn, hole, amount){
    const r = rec(mn); if (!r || !(amount > 0) || !TRAP_HOLE[hole]) return;
    r.holes = r.holes || {};
    const h = r.holes[hole] = r.holes[hole] || { loads: 0, big: 0, knots: 0, d: "", n: 0, best: 0 }, was = holeLevel(mn, hole), today = dayKey();
    h.loads++; h.big = Math.max(h.big, Math.round(amount));
    if (h.d !== today){ h.d = today; h.n = 0; } h.n++; h.best = Math.max(h.best, h.n);
    const now = holeLevel(mn, hole);
    if (now > was){
      const p = prodOf(mn); p.capBonus = (p.capBonus || 0) + CFG.HOLE_CAP_BONUS;
      later(() => { privateLine(mn, kLine("hole"+Math.min(4, now), mn, { h: TRAP_HOLE[hole] }), "emote"); tell(mn, "🕳️ Your "+TRAP_HOLE[hole]+" has taken "+h.loads+" loads now, sugar: "+HOLE_RANK[now]+". You hold "+CFG.HOLE_CAP_BONUS+" ml more for good, and the traps will pour more into it from here on."); }, 9000);
      albumAdd(mn, "🕳️", "Your "+TRAP_HOLE[hole]+": "+HOLE_RANK[now], h.loads+" loads taken, the biggest "+ml(h.big)+", "+h.best+" in one day at the most.");
    }
  }
  function holesFor(mn){
    const r = rec(mn), out = [];
    for (const hole of ["vulva", "butt", "mouth"]){ const h = ((r && r.holes) || {})[hole]; if (h) out.push({ hole: TRAP_HOLE[hole], loads: h.loads, big: h.big, best: h.best, knots: h.knots || 0, rank: HOLE_RANK[holeLevel(mn, hole)], next: HOLE_MARKS[holeLevel(mn, hole)] || 0 }); }
    return out;
  }

  // ── barn dreams ────────────────────────────────────────────
  function dreamTheme(mn){
    const r = rec(mn), p = prodOf(mn), since = Date.now() - 18*3600000;
    const last = (r.trapLog || []).filter(e => e.t > since).map(e => e.kind).reverse();
    for (const k of last){
      if (k === "tentacle" || k === "well" || k === "eggs" || k === "drake" || k === "hive") return "eggs";
      if (ANTHRO[k] || k === "breeder") return "bred";
      if (k === "milker") return "milk";
      if (k === "clamp") return "denied";
    }
    if (p && p.deniedUntil > Date.now()) return "denied";
    if (p && (p.preg || p.eggs)) return "carry";
    return "plain";
  }
  function dreamTick(now){
    if (!inCurfew()){
      for (const [k, r] of Object.entries(L.people)){
        if (!r.dream || !r.dream.n) { if (r.dream) r.dream = null; continue; }
        const mn = parseInt(k, 10), p = prodOf(mn), theme = r.dream.theme; r.dream = null;
        if (!charFor(mn)) continue;
        const how = p && (p.preg || p.eggs) ? "carry" : (theme === "denied" || theme === "bred" || theme === "eggs") ? "needy" : "sore";
        if (how === "needy"){ arouse(mn, 40, 94); if (!limitBlocks(mn, "heat") && Math.random() < 0.5) startHeat(mn, BOTMN(), 1); }
        tell(mn, "☀️ "+kLine("wake_"+how, mn));
      }
      saveLedger(); return;
    }
    if (now - (state.dreamAt || 0) < 60000) return; state.dreamAt = now;
    const barn = Object.keys(L.spots || {}).filter(n => /^barn/.test(n));
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C.MemberNumber, r = rec(mn);
      if (mn === BOTMN() || !r || !(isSubject(mn) || hasRole(mn, ROLE.LIVESTOCK)) || quietNow(mn) || !barn.some(b => onSpot(mn, b, 4))) continue;
      if ((state.trapRuns && state.trapRuns.has(mn)) || (state.sceneRuns && state.sceneRuns.has(mn))) continue;
      if (!r.dream) r.dream = { n: 0, at: now };
      if (now - r.dream.at < CFG.DREAM_EVERY_MIN*60000) continue;
      r.dream.at = now; r.dream.n++; r.dream.theme = dreamTheme(mn);
      privateLine(mn, "💤 "+kLine("dream_"+r.dream.theme, mn), "emote");
      arouse(mn, 6, 80); saveLedger();
    }
  }

  // ── herd leaders get the reins ─────────────────────────────
  function leaderShare(mn, earned){
    const lead = herdLeaderOf(mn);
    if (!lead || lead === mn || !(earned >= 2)) return 0;
    return earnRibbons(lead, Math.max(1, Math.round(earned * CFG.LEADER_SHARE)), plainName(mn)+"'s eggs (your herd's share)", BOTMN());
  }
  function leaderCommand(cmd, sender, args, R){
    const r = rec(sender), now = Date.now();
    if (cmd === "herdtraps"){
      const mine = herdMembers(sender).filter(x => isSubject(x.mn));
      if (!mine.length){ R("None of your herd are test subjects, sugar."); return; }
      R("🧪 YOUR HERD'S TRAP CARDS\n"+mine.map(x => { const p = prodOf(x.mn); return "• "+plainName(x.mn)+(charFor(x.mn) ? " ●" : "")+": "+SUBJECT_RANKS[rankOfSubject(x.mn)].name+", "+(x.trapN || 0)+" sprung, corruption "+corruptionOf(x.mn)+(p && p.eggs ? ", carryin' "+p.eggs.n+" eggs" : "")+(p && p.preg ? ", bred" : "")+(x.trapsOff ? ", paused" : ""); }).join("\n")+
        "\n?send <who> <trap> · ?dose <who> <shot words> · ?trap bait <spot> <ribbons>");
      return;
    }
    const t = resolveTarget(args[0]);
    if (!t || !rec(t)){ R(cmd === "send" ? "?send <who> <trap>, sugar: one of your own herd, to a trap of your choosin'." : "?dose <who> <shot words>, sugar: one of your own herd, like ?dose Daisy lactation x2."); return; }
    if (!isProprietor(sender) && !leads(sender, t)){ R(plainName(t)+" isn't in your herd, sugar. The reins only reach your own."); return; }
    if (!charFor(t)){ R(plainName(t)+" isn't here, sugar."); return; }
    const wait = (r.reinsAt || 0) + CFG.LEADER_REINS_MIN*60000 - now;
    if (wait > 0 && !isProprietor(sender)){ R("Easy on the reins, sugar. "+Math.ceil(wait/60000)+" more minutes."); return; }
    if (cmd === "send"){
      customLoad();
      const k = String(args[1] || "random").toLowerCase();
      if (k !== "random" && !TRAP_KINDS[k]){ R("Which trap, sugar? "+Object.keys(TRAP_KINDS).join(", ")+"."); return; }
      const why = springTrap(t, k, "", true);
      if (why){ R("🧪 That won't spring on "+plainName(t)+": "+why+"."); return; }
      rec(t).trapAt = now; r.reinsAt = now; saveLedger(); audit(sender, "SEND", t+" "+k);
      tell(t, "🧪 That one was "+plainName(sender)+"'s doin', sugar. Your herd leader sent you.");
      R("🧪 Sent. "+plainName(t)+" is in it now."); return;
    }
    // ?dose
    const words = args.slice(1).join(" ").trim();
    if (!words){ R("?dose <who> <shot words>, sugar, like ?dose Daisy fertility x2."); return; }
    if (quietNow(t)){ R(plainName(t)+" has asked for a quiet hour, sugar."); return; }
    if (!applyShot(t, sender, words, { open: kLine("leaderDose", t, { x: plainName(sender) }), from: plainName(sender)+"'s needle" })){ R("That didn't take, sugar: no shot word I know in it, or their limits rule it out."); return; }
    r.reinsAt = now; saveLedger(); audit(sender, "DOSE", t+" "+words); sound(t, "clip");
    R("💉 Done. "+plainName(t)+" has it in them.");
  }

  // ── fluids as coin ─────────────────────────────────────────
  function vatAdd(mn, amount){ const r = rec(mn); if (r && amount > 0) r.vat = (r.vat || 0) + amount; }
  function vatTop(mn){ const w = (L.yield && L.yield.w) || {}, e = Object.entries(w).sort((a, b) => b[1] - a[1])[0]; return !!e && parseInt(e[0], 10) === mn && e[1] > 0; }
  function vatCost(mn, price){ return Math.round(price * CFG.VAT_ML_PER_RIBBON * (vatTop(mn) ? 0.75 : 1)); }
  function vatBuy(sender, args, R){
    const i = args.findIndex(w => /^with$/i.test(w));
    if (i < 1 || !/^(milk|seed|cum|vat|fluids?|tank)$/i.test(args[i + 1] || "")) return false;
    const r = rec(sender), it = storeItem(args[0]), today = dayKey();
    if (!r || !r.roles || !r.roles.length){ R("The store's for folks on the books, sugar."); return true; }
    if (!it || it.off){ R("We don't stock that, hon. ?store shows the shelf."); return true; }
    if (!it.potion && !/^shot-/.test(it.id)){ R("The vat only buys potions and shots, sugar. Everything else is ribbons."); return true; }
    if (args.slice(1, i).some(w => /^(for|to)$/i.test(w))){ R("What comes out of you only buys for you, sugar. Gifts are ribbons."); return true; }
    const cost = vatCost(sender, it.price);
    if ((r.vat || 0) < cost){ R("🥛 A "+it.name+" is "+ml(cost)+" from your vat, sugar, and you've "+ml(r.vat || 0)+" in it. Get yourself milked."); return true; }
    if (!r.vatDay || r.vatDay.d !== today) r.vatDay = { d: today, n: 0 };
    if (r.vatDay.n >= CFG.VAT_DAY_MAX){ R("🥛 The vat's bought you "+CFG.VAT_DAY_MAX+" today already, sugar. Tomorrow."); return true; }
    const before = r.ribbons || 0, spent0 = ribbonWeek(r).spent, logN = (L.ribbonLog || []).length, said = [];
    r.ribbons = before + it.price;
    try { buy(sender, args.slice(0, i), t => said.push(t)); } catch(e){ warn("vat buy:", e); }
    const went = (r.ribbons || 0) === before;
    r.ribbons = before; ribbonWeek(r).spent = spent0;
    if (!went){ saveLedger(); R(said.join("\n") || "That didn't go through, sugar."); return true; }
    if (L.ribbonLog && L.ribbonLog.length > logN) L.ribbonLog.length = logN;
    r.vat -= cost; r.vatDay.n++; saveLedger(); audit(sender, "VATBUY", it.id+" "+Math.round(cost));
    R("🥛 Paid in what came out of you: "+ml(cost)+" from your vat for a "+it.name+(vatTop(sender) ? " (top producer's price)" : "")+". "+ml(r.vat)+" left in it.");
    return true;
  }

  // ── commands, the tick, the safeword ───────────────────────
  function keepersCommand(cmd, sender, args, R){
    customLoad();
    const r = rec(sender);
    if (cmd === "whistle") return whistleCommand(sender, args, R);
    if (cmd === "send" || cmd === "dose" || cmd === "herdtraps") return leaderCommand(cmd, sender, args, R);
    if (cmd === "sit" || cmd === "broody"){
      const a0 = String(args[0] || "").toLowerCase();
      if (a0 === "up" || a0 === "off" || a0 === "stop"){ R(sitStop(sender, "up") ? "🪺 Up you get, sugar. The eggs are back in the straw." : "You're not sittin' a clutch, sugar."); syncCompanions(true); return; }
      if (a0 && a0 !== "me"){
        if (!isStaff(sender)){ R("Settin' somebody else on the nest is a job for staff, sugar. ?sit on your own puts you there."); return; }
        const t = resolveTarget(args[0]); if (!t || !charFor(t)){ R("Who, sugar? ?sit <who>, and they need to be on the nest."); return; }
        return sitStart(t, sender, R);
      }
      return sitStart(sender, sender, R);
    }
    if (cmd === "album"){
      const a = albumFor(sender, 8);
      R(a.length ? "📔 YOUR KEEPSAKES (newest first)\n"+a.map(e => e.i+" "+e.h+" · "+new Date(e.t).toLocaleDateString()+"\n   "+e.x).join("\n") : "📔 Your album's empty yet, sugar. Give the farm time."); return;
    }
    if (cmd === "holes"){
      const hs = holesFor(sender);
      R(hs.length ? "🕳️ WHAT YOU'VE TAKEN\n"+hs.map(h => "• Your "+h.hole+": "+h.rank+". "+h.loads+" loads, the biggest "+ml(h.big)+", "+h.best+" in one day at the most"+(h.knots ? ", "+h.knots+" knots" : "")+(h.next ? ". Next step at "+h.next : "")+".").join("\n")
                  : "🕳️ Nothin' on the books yet, sugar. The traps keep count of what each hole takes."); return;
    }
    if (cmd === "vat"){
      if (!r || !r.roles || !r.roles.length){ R("That's for folks on the books, sugar."); return; }
      R("🥛 Your vat: "+ml(r.vat || 0)+" of what's been milked and collected from you. It buys potions and shots: ?buy <which> with milk, at "+ml(vatCost(sender, 1))+" a ribbon of the price"+(vatTop(sender) ? " (top producer's price this week)" : "")+", up to "+CFG.VAT_DAY_MAX+" a day."); return;
    }
  }
  function keepersTick(){
    const now = Date.now();
    customLoad();
    try { sitTick(now); dreamTick(now); } catch(e){ warn("keepers tick:", e); }
  }
  function keepersStateFor(mn, s){
    const a = albumFor(mn, 12); if (a.length) s.album = a;
    const hs = holesFor(mn); if (hs.length) s.holes = hs;
    const r = rec(mn); if (r && r.vat >= 1){ s.vat = Math.round(r.vat); s.vatPer = vatCost(mn, 1); }
    if (r && r.sitting) s.sitting = { n: r.sitting.n, until: r.sitting.until };
  }

  const KEEP_LINES = {
    // home-built traps with no lines of their own
    custom_dose: [
      ["Somethin' clicks under %n's foot. A steel arm swings up out of the straw, quick as a snake, with a fat glass syringe on the end of it.",
       "A plate gives under %n. Two padded bars close on their hips and a needle on a long arm comes round to look at them."],
      ["It takes its time choosin' a spot. It settles on the soft of %n's ass, presses, and sinks in slow to the hilt.",
       "The needle noses along %n's thigh, up over a cheek, and slides in deep where the meat is thickest."],
      ["The plunger goes down a finger at a time. %n can feel it spreadin' warm under the skin, and there's nothin' to do but take all of it.",
       "It empties itself into %n steady and unhurried, and whatever was in that glass is in them now, workin'."]],
    custom_hold: [
      ["A loop snaps shut round %n's ankle and another takes a wrist. Before they've drawn breath they're strung out tight between two posts.",
       "Bars come up out of the floor either side of %n and fold shut round wrists and waist. They're held bent, ass out, goin' nowhere."],
      ["It tests them: a pull here, a little more spread there, till %n is open and shakin' and can't close a thing.",
       "Somethin' soft and buzzin' is laid right against %n's sex and left there, not near enough to finish on."],
      ["It keeps them like that. Every time %n's hips start to chase it, it backs off a hair and waits for them to whine.",
       "%n hangs in it, drippin', rockin' on nothin', while the whole yard gets a good long look."]],
    custom_fill: [
      ["The floor drops an inch under %n and a padded yoke closes over the small of their back. Behind them a greased nozzle swings up on a hose.",
       "%n is tipped forward over a rail and strapped there. A thick rubber nozzle noses in between their cheeks, huntin'."],
      ["It finds what it wants and pushes in, swellin' once it's seated so there's no squeezin' it out.",
       "It slides in deep and locks with a fat little bulb. The hose behind it jumps as the pump starts up."],
      ["Warm and heavy, it pours into %n. Their belly rounds, then tightens, then pushes out past their hips while they moan through their teeth.",
       "The pump thuds and %n fills: a slosh, a stretch, a belly goin' round and shiny as a drum."]],
    custom_breed: [
      ["A frame folds up out of the straw and takes %n at the hips and the neck, bendin' them over with their ass in the air.",
       "Steel closes on %n's wrists and knees and spreads them on all fours. Behind them, somethin' long and slick slides out of its housing."],
      ["The machine's cock lines itself up, fat and ridged and drippin' warm, and leans its whole weight on them.",
       "It rubs up and down %n's slit twice, gettin' itself wet on them, then pushes in to the root in one long shove."],
      ["It ruts them hard and steady, no rhythm a body could keep up with, slappin' wet against them while they grunt on every stroke.",
       "It hammers %n like a stud coverin' a mare, deep every time, and it does not tire, and it does not care how loud they get."]],
    custom_strip: [
      ["Hooks on thin wires flick out of the dark and catch in %n's clothes: collar, hem, waistband, all at once.",
       "A dozen little steel fingers come up round %n's feet and take hold of every seam they can reach."],
      ["One hard pull. Cloth goes one way and %n goes the other, bare to the skin and blinkin' in the open.",
       "They tug, and everythin' %n had on is hauled off and away into the rafters, leavin' them naked for the whole farm."]],
    custom_write: [
      ["Padded clamps take %n by the arms and hold them still. A little arm with a fat brush on it unfolds and dips itself in black ink.",
       "%n is caught and turned to the light. Somethin' with a marker for a finger comes down to look them over for a good clean patch of skin."],
      ["It writes slow and neat, the wet tip draggin' over bare skin while %n squirms and tries to read it upside down.",
       "It prints its letters big, pressin' firm, takin' care over every one. It wants folks to be able to read it from the gate."]],
    customDose: ["The trap's needle slides out of %n and the arm folds away, empty."],
    customDud: ["The arm clicks, hisses, and folds away. Whatever it was loaded with, %n's body just shrugged it off."],
    customShut: ["It hunts all over %n for a way in and finds every hole plugged or locked. It sprays its load across their ass and thighs in a sulk and lets go."],
    customFill: ["The pump cuts off with %ml packed in %n's %h. The nozzle pops free and they sag there, belly hangin' round and tight, leakin' down both thighs.",
                 "%ml, and the hose finally lets go of %n's %h. They can feel every drop shift when they breathe."],
    customOver: ["It never gets inside them. It ruts between %n's thighs till it's done and paints their back and ass with %ml of thick warm seed instead."],
    customBreed: ["It buries itself and holds, pumpin' %ml into %n's %h in long hot throbs till it's runnin' back out round the shaft. Then it slides free and leaves them gapin' and bred.",
                  "With a last deep shove it empties in %n's %h: %ml of it, thick as cream. They hang in the frame drippin' while it folds itself away."],
    // broodin'
    sitStart: ["%n is settled down onto the nest, knees wide, bare belly and thighs laid right over %x warm eggs. A soft strap goes across their hips so they'll stay put.",
               "The farm girl walks %n onto the nest and presses them down over the clutch: %x eggs, snug up under their belly and between their legs. \"There. Keep 'em warm for me, broody girl.\"",
               "%n lowers themself onto %x eggs, shiftin' till every one is tucked against bare skin. A rope goes round their waist and off to the rail. They're broody now."],
    sitFed: ["A hand comes round with a bowl of warm mash and feeds %n off two fingers, mouthful by mouthful, since they're not to get up for anything.",
             "Somebody tips a bottle of warm milk to %n's lips and holds it there till it's gone, wipin' their chin with a thumb after. Then a pat on the flank, like you'd give a good hen.",
             "The farm girl feeds %n by hand where they sit, slow, and has a feel underneath while she's at it. \"Still warm. Good. Don't you move.\""],
    sitWarm: ["%n shifts on the nest and the eggs roll against them, warm and smooth, right up in the split of them. They've been rockin' on that a while now, whether they meant to or not.",
              "The eggs under %n have gone hot as fresh bread. Every little squirm rubs one somewhere sweet, and broody stock isn't allowed to do a thing about it.",
              "One of the eggs under %n twitches. They gasp and clamp their thighs round the clutch, flushed to the chest."],
    sitStop: ["%n climbs up off the nest on shaky legs, thighs slick, and the clutch is left in the straw for somebody else to mind."],
    hatch: ["The shells start to tick and split under %n. The strap comes off and they're lifted clear, wobbly and flushed, to watch %x of them hatch and wriggle off into the straw.",
            "%n feels the first shell crack and yelps. The farm girl helps them up off the clutch, and one by one %x eggs open in the warm hollow their body left.",
            "It happens all at once: %x eggs tickin', splittin', openin'. %n is stood up beside the nest on shaky legs, thighs still slick from the sittin', told what a good broody thing they've been."],
    hatchBig: ["The whole nest starts to heave. %n is hauled up off it just in time, and %x eggs hatch in a rush where they were sat, the straw comin' alive.",
               "%x. Every one of them hatches. %n stands there bow-legged and dazed from the long hot sit, lookin' down at a nest that's boilin' over, and it's all theirs on the board."],
    // the whistle
    whistle: ["%x puts two fingers to their lips and whistles, long and low. Somewhere past the barn, %c lifts a head. It knows that call, and it knows it means %n.",
              "A whistle from %x carries clear across the yard. %n has just time to turn round before they hear %c comin' for them.",
              "%x whistles once and points at %n. From out of the dark comes the sound of %c, already on the way."],
    // trained holes
    hole1: ["Your %h doesn't fight it the way it used to. It's learnin' what it's for."],
    hole2: ["Your %h opens for things now before you've decided to let it. It's been trained, and you can feel it."],
    hole3: ["There's a soft, loose, hungry feel to your %h these days. It takes what it's given and wants the next one bigger."],
    hole4: ["Your %h is ruined for anything gentle, and both of you know it. It only feels right packed full."],
    // dreams
    dream_plain: ["You dream of the stall door closin' behind you, and of bein' glad it did.",
                  "In the dream somebody's hands go all over you, checkin' you like stock, and you stand still for it and push into every one.",
                  "You dream you're led across the yard naked on a rope, and everybody you pass tells you what a good animal you are.",
                  "The straw is warm. You dream of bein' kept, fed, used and put away, and you wake half-way to rubbin' yourself on it."],
    dream_bred: ["You dream of weight on your back and breath on your neck, and of bein' held still while you're filled. Your hips are rockin' in your sleep.",
                 "It has you again in the dream, deeper than it did today, and this time it doesn't pull out. You wake with your thighs wet.",
                 "You dream of a knot swellin' in you till you can't get off it, and of not wantin' to. Somethin' aches, low down, where it was.",
                 "In the dream they line up for you. You count them goin' in and lose count, and you're smilin' into the straw."],
    dream_eggs: ["You dream your belly's full of somethin' round and warm that moves when you breathe. Your hand is on it when you wake.",
                 "In the dream it's got you under the water again, feedin' them into you one by one, and you're openin' your legs to help.",
                 "You dream of layin'. Each one stretches you slow and sweet on the way out, and you never want the clutch to end.",
                 "Somethin' slick coils round your thigh in your sleep. When you start awake there's nothin' there. You're a little sorry."],
    dream_milk: ["You dream of the cups on you, pullin' and pullin', and of bein' drained till you're cross-eyed and droolin' on the rail.",
                 "In the dream your tits are so full they hurt, and nobody comes. You wake with your own hands on them.",
                 "You dream you're in the parlour in a long row of stock, all of you moanin' in time with the pump."],
    dream_denied: ["You dream of cummin'. Over and over you're right there, and every time you wake a breath before it, hips in the air.",
                   "In the dream somebody tells you no, very kindly, and keeps touchin' you. You wake with a whine in your throat.",
                   "You dream you're allowed. You're not. Your whole body is hummin' and the straw under you is damp."],
    dream_carry: ["You dream of your own belly, round and tight and heavier every time you look. Somethin' inside turns over, and you spread your knees for it without wakin'.",
                  "In the dream you're too big to walk, and you're kept in deep straw and hand-fed and bred again anyway.",
                  "You dream of what's in you. You dream of it bein' born, and of the farm puttin' the next one in before you've caught your breath."],
    wake_needy: ["Mornin', sugar. You wake up wet, achin' and rubbin' against the straw, with every dream from last night still on your skin. You're goin' to need seein' to today.",
                 "The barn's gettin' light. You come awake with your hand already between your legs and nothin' like enough to finish on."],
    wake_sore: ["Mornin', sugar. You wake stiff and sore in all the places the farm got to yesterday, and the dreams didn't let any of it rest.",
                "First light. Everything that was used on you yesterday is tender this mornin', and you can still feel the shape of it."],
    wake_carry: ["Mornin', sugar. You wake curled round your belly with both hands on it. It's heavier than it was at lights out, and it moved in the night.",
                 "The barn's gettin' light. What you're carryin' kept you dreamin' till dawn, and it's sat low and full in you now."],
    leaderDose: ["%x takes %n by the collar, turns them round and slides a needle into the fat of their ass like they're dosin' their own heifer. Which they are."],
  };
