  /* WHAT'S IN THIS FILE (10h-body.js)
     The farm usin' each player's own Companion, plus things the game tells everyone anyway:
     • Who can see whom: each Companion reports who its player can see and hear, so private lines reach
       exactly those people (not just "everyone within 8 tiles").
     • Walkin', not teleportin': people with the Companion are led there, step by step at their own pace
       (slower when bound), instead of jumped. Stuck rescues and restraints still teleport.
     • Faces, sounds and the trance haze: small cues their Companion plays on their own screen only.
     • Orgasms and edges: the game already announces every orgasm, resisted orgasm and ruined one to the
       room. The farm counts them for everybody: a resisted one is an edge, a ruined one too, milk lets
       down when they cum, and cummin' soon after bein' bred gives it one more chance to take.
     • Consent you can see: sayin' yes to a breedin' shows as a little emote from them.
     • Ambient moments: two animals near each other now and then nuzzle, jostle, groom.
  */
  /* ───────────── COMPANION CUES, SIGHT, LEADIN', BODY EVENTS ───────────── */

  // a Companion new enough for the v0.10 cues (lead, face, sound, trance, sight)
  function cueable(mn, pref){
    const c = state.companions.get(mn);
    return !!(hasCompanion(mn) && c && verAtLeast(c.ver, "0.10.0") && !(c.off && c.off[pref]));
  }
  function face(mn, mood, secs){ if (cueable(mn, "face")) enqueue(makeMsg("face", { mood, secs: secs || 30 }, mn)); }
  function trance(mn, level){ if (cueable(mn, "trance")) enqueue(makeMsg("trance", { level: level || 0 }, mn)); }
  // a sound for whoever's around somebody (their own Companion plays it, only they hear it)
  function sound(anchor, name){
    const who = new Set([anchor].concat(audience(anchor, "hear")));
    for (const mn of who) if (cueable(mn, "sound")) enqueue(makeMsg("sound", { name }, mn));
  }

  // who can see / hear somebody, as their Companion last reported it (fresh for 30 s); null if unknown
  function sightOf(mn){
    const s = state.sight && state.sight.get(mn);
    return s && Date.now() - s.at < 30000 ? s : null;
  }
  function audience(mn, kind){
    const s = sightOf(mn);
    if (!s) return [];
    return (kind === "hear" ? s.hear : s.see).filter(m => m !== CFG.BOT_MEMBER && charFor(m));
  }
  function onSight(mn, m){
    state.sight = state.sight || new Map();
    const ok = a => Array.isArray(a) ? a.map(Number).filter(Number.isFinite).slice(0, 60) : [];
    state.sight.set(mn, { see: ok(m.see), hear: ok(m.hear), at: Date.now() });
  }

  /* LEADIN' INSTEAD OF TELEPORTIN'. Their Companion walks them there (pathfindin', at their own speed).
     If it can't (no path, they're enclosed or suspended, they switched it off) or they haven't arrived in
     90 seconds, the bot teleports them after all. */
  function canLead(mn){ return cueable(mn, "lead") && onMap(mn); }
  function lead(mn, pt, urgent, why){
    state.leads = state.leads || new Map();
    for (const [id, l] of state.leads) if (l.mn === mn) state.leads.delete(id);   // a newer one replaces it
    const id = ++companionSeq;
    state.leads.set(id, { mn, pt: { X: pt.X, Y: pt.Y }, at: Date.now(), urgent });
    enqueue(makeMsg("lead", { X: pt.X, Y: pt.Y, id, why: why || "" }, mn), urgent);
    return true;
  }
  function leadAnswer(mn, m){
    const l = state.leads && state.leads.get(m.id);
    if (!l || l.mn !== mn) return;
    state.leads.delete(m.id);
    if (m.type === "leadNo") teleportNow(mn, l.pt, l.urgent);
  }
  function leadTick(){
    if (!state.leads) return;
    for (const [id, l] of state.leads){
      const p = posOf(l.mn);
      if (p && Math.max(Math.abs(p.X - l.pt.X), Math.abs(p.Y - l.pt.Y)) <= 1){ state.leads.delete(id); continue; }
      if (Date.now() - l.at > 90000){ state.leads.delete(id); teleportNow(l.mn, l.pt, l.urgent); }
    }
  }

  /* ORGASMS AND EDGES, from the game's own room messages (everybody sends these; no Companion needed):
       Orgasm0-9                    they came
       OrgasmResist0-9              they held it back: an edge
       OrgasmFailTimeout/Surrender  ruined: counts as an edge too, with a sad dribble  */
  function onClimax(mn, content){
    const r = rec(mn), p = r && prodOf(mn);
    if (!p || limitBlocks(mn)) return;
    const now = Date.now(), d = dayKey(), n = plainName(mn);
    if (!p.climax || p.climax.day !== d) p.climax = { day: d, came: 0, edged: 0, ruined: 0 };
    if (/^OrgasmResist/.test(content)){
      p.climax.edged++;
      if (makesSemen(mn)){ p.edges = Math.min(CFG.EDGE_MAX, (p.edges||0) + 1); if (p.edges >= CFG.EDGE_PENT) p.pentUp = true; }
      if (hasVulva(mn)){ if (now - (p.vEdgeAt||0) > CFG.VEDGE_HOURS*3600000) p.vEdges = 0; p.vEdges = Math.min(CFG.EDGE_MAX, (p.vEdges||0) + 1); p.vEdgeAt = now; }
      face(mn, "edged", 25);
      if (now - (p.edgeSaid||0) > 120000){ p.edgeSaid = now;
        emote(pickFresh("edge", [n+" holds it back, trembling right on the edge. The farm counts that one.",
                                 n+" fights it off with a shaky groan and stays right on the brink. Another edge on the tally.",
                                 n+" clenches up and refuses to tip over. Good. That's "+p.climax.edged+" today."]), mn); }
    } else if (/^OrgasmFail/.test(content)){
      p.climax.ruined++;
      if (hasVulva(mn)){ if (now - (p.vEdgeAt||0) > CFG.VEDGE_HOURS*3600000) p.vEdges = 0; p.vEdges = Math.min(CFG.EDGE_MAX, (p.vEdges||0) + 1); p.vEdgeAt = now; }
      if (makesSemen(mn) && p.semen >= 2){ const lost = Math.min(p.semen, p.semen * 0.2); p.semen -= lost; }
      face(mn, "edged", 25);
      emote(pickFresh("ruin", [n+" whimpers as it slips away, ruined and leaking, nowhere near enough.",
                               n+"'s release fizzles out into a sad, twitching dribble. Ruined.",
                               n+" sags with a frustrated whine. So close, and nothin' to show for it."]), mn);
    } else if (/^Orgasm\d/.test(content)){
      p.climax.came++;
      face(mn, "afterglow", 40);
      const bits = [];
      // milk lets down when they cum
      if (makesMilk(mn) && !milkDenied(mn) && p.milk > 1){
        const g = gearOf(mn);
        const out = g.milk ? drainMilk(mn, Math.min(p.milk, milkRate(mn) * 0.25)) : Math.min(p.milk, milkRate(mn) * 0.1);
        if (!g.milk) p.milk -= out;
        if (out >= 1) bits.push(g.milk ? "milk gushes down the pump's lines with every spasm (+"+ml(out)+" in the tank)" : "milk spurts from both teats as they shake");
      }
      // a stud spends some of what they're carryin' (edges make it more)
      if (makesSemen(mn) && !holeBlocked(mn, "penis") && p.semen >= 2){
        const spent = Math.min(p.semen, p.semen * CFG.PROD.LOAD_SHARE * 0.5 * (1 + CFG.EDGE_X * Math.min(p.edges||0, CFG.EDGE_MAX)));
        p.semen -= spent; p.edges = 0; p.pentUp = false;
        bits.push("their cock pulses out "+ml(spent)+" of wasted seed");
      }
      emote(n+" comes apart, gasping and shaking"+(bits.length ? ": "+bits.join(", and ") : "")+".", mn);
      // bred in the last 15 minutes and it didn't take yet? cummin' gives it one more chance
      const f = p.lastFill;
      if (f && now - f.at < 15*60000 && !f.rerolled && !p.preg && hasVulva(mn)){
        f.rerolled = true;
        if (rollConception(mn, f.stud, f.ml, 0.5)) later(() => emote("🍼 Right as "+n+" peaks, somethin' deep inside catches. "+plainName(f.stud)+"'s seed took after all.", mn), 4000);
      }
    }
    saveLedger();
  }

  // consent you can see: a little emote from them when they say yes
  function showConsent(t, to, what){
    emote(pickFresh("yes", [plainName(t)+" nods eagerly at "+plainName(to)+". Yes. Please.",
                            plainName(t)+" flushes and gives "+plainName(to)+" a shy little nod: yes to "+what+".",
                            plainName(t)+" presents for "+plainName(to)+" without a word. That's a yes."]), t);
  }

  // never the same line twice in a row from a pool
  function pickFresh(key, list){
    state.lastPick = state.lastPick || new Map();
    const last = state.lastPick.get(key);
    const pool = list.length > 1 ? list.filter(x => x !== last) : list;
    const v = pool[Math.floor(Math.random()*pool.length)];
    state.lastPick.set(key, v);
    return v;
  }

  /* AMBIENT MOMENTS: every 15–25 minutes, two animals standin' close (within 2 tiles) share a small,
     harmless moment, seen by whoever can see them. Posted by one of them (their Companion) or privately
     to the people near. CFG.AMBIENT_ON switches it. */
  const AMBIENT = [
    "%a and %b jostle shoulder to shoulder at the rail, neither willing to give up their spot.",
    "%a nuzzles into %b's neck and gets a sleepy nuzzle back.",
    "%a rests their head on %b's back and lets out a long, contented sigh.",
    "%a licks a stray drip of milk off %b's chin, and %b pretends not to like it.",
    "%a and %b doze off leaning against each other in the straw.",
    "%a bumps %b with their hip, and the two of them tussle in the hay for a moment.",
    "%a grooms %b's hair with careful fingers while %b stays perfectly still.",
    "%a and %b trade soft little animal noises, a whole conversation without a single word.",
  ];
  function ambientTick(){
    if (!CFG.AMBIENT_ON || !mapRoom()) return;
    const now = Date.now();
    if (now < (state.ambientAt || 0)) return;
    state.ambientAt = now + (15 + Math.random()*10)*60000;
    const stock = presentStock().filter(m => onMap(m) && !stockedNow(m) && !(state.sceneRun && state.sceneRun.has(m)));
    const pairs = [];
    for (let i = 0; i < stock.length; i++) for (let j = i+1; j < stock.length; j++){
      const a = posOf(stock[i]), b = posOf(stock[j]);
      if (a && b && Math.max(Math.abs(a.X-b.X), Math.abs(a.Y-b.Y)) <= 2) pairs.push([stock[i], stock[j]]);
    }
    if (!pairs.length) return;
    const [a, b] = pairs[Math.floor(Math.random()*pairs.length)];
    emote(pickFresh("ambient", AMBIENT).replace(/%a/g, plainName(a)).replace(/%b/g, plainName(b)), Math.random() < 0.5 ? a : b);
  }
