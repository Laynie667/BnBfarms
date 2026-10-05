  /* WHAT'S IN THIS FILE (10f-addons.js)
     Add-on support. Separate userscripts on the bot's PC (glory stalls, barn life, pregnancy…) plug in
     here with window.Farmhand.register({...}). They get their own ?commands, their own saved data, the
     heartbeat, game events, yes/no asks, and a "Farm extras" tab in everyone's Companion. The farm's own
     rules (limits, cooldowns, never silent, ?safe) still apply to them. One add-on breakin' never stops
     the bot: every call into an add-on is wrapped, and its errors are logged with its name.
  */
  /* ───────────── ADD-ONS ───────────── */

  const ADDONS = new Map();       // name → the add-on's definition
  const ADDON_CMDS = new Map();   // command word → { addon, def }
  const addonAsks = new Map();    // member → { addon, cb, at }  (yes/no questions an add-on asked)
  const ADDON_NAME = /^[a-z][a-z0-9-]{1,23}$/;
  const RANKS = { anyone:0, staff:1, herdmaster:2, proprietor:3 };
  const ANON_STUD = -1;           // "somebody" for add-on scenes with no real stud (shows as a stranger)

  // staff performance points, shared by add-ons (glory stalls boost herd leaders, shift tasks, inspections…)
  // kept per week and in total; the leaderboard add-on shows them
  function staffPoints(mn, n, why){
    if (!mn || mn < 0) return;
    const S = L.staffScore = L.staffScore || {}, wk = weekKey();
    const x = S[mn] = S[mn] || { week: wk, pts: 0, total: 0, why: {} };
    if (x.week !== wk){ x.week = wk; x.pts = 0; x.why = {}; }
    x.pts += n; x.total += n; if (why) x.why[why] = (x.why[why]||0) + n;
    saveLedger();
  }

  function rankOf(mn){ return isProprietor(mn) ? 3 : isHerdmaster(mn) ? 2 : isStaff(mn) ? 1 : 0; }
  // each add-on keeps its saved data in L.mods.<name>; it lives in the bot's ledger and survives restarts
  function addonData(name){ L.mods = L.mods || {}; return (L.mods[name] = L.mods[name] || {}); }
  function addonCall(a, what, fn, ...args){
    try { return fn(...args); }
    catch(e){ warn("add-on "+a.name+" ("+what+"):", e); a.errors = (a.errors||0) + 1; a.lastError = String(e && e.message || e).slice(0,200); return undefined; }
  }
  // tell every add-on about a game event
  function addonsEmit(hook, ...args){
    for (const a of ADDONS.values()) if (a.on && typeof a.on[hook] === "function" && a.enabled !== false) addonCall(a, hook, a.on[hook], ...args);
  }

  // where somebody's standin', and what's there
  function posOf(mn){ const C = charFor(mn); return C && C.MapData && C.MapData.Pos ? { X:C.MapData.Pos.X, Y:C.MapData.Pos.Y } : null; }
  function onSpot(mn, name, reach){
    const p = posOf(mn), s = L.spots && L.spots[name];
    if (!p || !s) return false;
    return Math.max(Math.abs(p.X - s.X), Math.abs(p.Y - s.Y)) <= (reach || 0);
  }
  function whoOnSpot(name, reach){ return (W.ChatRoomCharacter||[]).map(c => c.MemberNumber).filter(m => m !== CFG.BOT_MEMBER && onSpot(m, name, reach)); }
  function zonesOf(mn){
    zonesLedger(); const p = posOf(mn);
    return p ? Object.entries(L.zones).filter(([, z]) => z.a && z.b && inZone(z, p)).map(([n, z]) => ({ name:n, group:z.group })) : [];
  }
  function inZoneNamed(mn, name){ return zonesOf(mn).some(z => z.name === name || z.group === name); }

  // a line only this person sees, shown like a room emote or chat line wherever they are on the map:
  // the Companion puts it in their chat; without it, it's an out-of-character whisper (the map lets those through)
  function privateLine(mn, text, kind, urgent){
    const line = (kind === "emote" ? "*" : "") + String(text);
    if (hasCompanion(mn)) { enqueue(makeMsg("roomline", { text: line, kind: kind === "emote" ? "emote" : "chat" }, mn), urgent); return; }
    const ooc = mapRoom();
    for (const c of splitMessage(line, 900)) enqueue({ Content: ooc ? "("+c.replace(/\(/g, "[").replace(/\)/g, "]") : c, Type:"Whisper", Target: mn }, urgent);
  }

  // add-ons can nudge production: rates: { milk(mn), semen(mn) } return a multiplier (1 = no change).
  // All of them multiply together, kept between 0.25× and 3× so one add-on can't break the farm's numbers.
  function addonRateX(mn, kind){
    let x = 1;
    for (const a of ADDONS.values()){
      if (a.enabled === false || !a.rates || typeof a.rates[kind] !== "function") continue;
      const v = Number(addonCall(a, "rates."+kind, a.rates[kind], mn));
      if (v > 0 && isFinite(v)) x *= v;
    }
    return Math.max(0.25, Math.min(3, x));
  }

  // add-ons can write the farm's lines: lines: { pump(info), echo(info), stallMilk(info), … } return a line
  // (or nothin' to keep the bot's own). info: { mn, name, level, gear, ml, full (0–1), degrade, praise }
  function addonLine(kind, info){
    for (const a of ADDONS.values()){
      if (a.enabled === false || !a.lines || typeof a.lines[kind] !== "function") continue;
      const v = addonCall(a, "lines."+kind, a.lines[kind], info);
      if (typeof v === "string" && v.trim()) return v.slice(0, 900);
    }
    return null;
  }
  function lineInfo(mn, extra){
    const r = rec(mn) || {}, p = prodOf(mn);
    return Object.assign({ mn, name: plainName(mn), full: p && makesMilk(mn) ? Math.min(1, p.milk / Math.max(1, milkCap(mn))) : 0,
                           degrade: !!r.degradeMe, praise: !!r.praiseMe, species: speciesKey(mn) }, extra || {});
  }

  // a game activity, read the same way onActivity reads it: { act, src, tgt, focus }
  function activityInfo(data){
    const dict = Array.isArray(data && data.Dictionary) ? data.Dictionary : [];
    const pk = k => { const e = dict.find(d => d && d[k] !== undefined); return e ? e[k] : undefined; };
    let src = pk("SourceCharacter"), tgt = pk("TargetCharacter");
    if (typeof src !== "number") src = data.Sender;
    if (typeof tgt !== "number"){ const old = dict.find(d => d && d.Tag === "TargetCharacter"); tgt = old ? old.MemberNumber : src; }
    return { act: String(pk("ActivityName") || (String(data.Content||"").match(/-([A-Za-z_]+)$/)||[])[1] || ""),
             src, tgt, focus: String(pk("FocusGroupName") || String(data.Content||"").split("-")[1] || "") };
  }

  // what add-ons get to use. Kept small on purpose: anything risky (keys, roles, the ledger as a whole)
  // stays in the bot.
  function addonApi(a){
    return Object.freeze({
      name: a.name, version: VERSION, cfg: CFG,
      data: () => addonData(a.name), save: () => saveLedger(),
      log: (...x) => log("["+a.name+"]", ...x),
      audit: (by, action, detail) => audit(by, a.name.toUpperCase()+"_"+action, detail),
      // talkin'
      say: (t, urgent, who) => say(t, urgent, who),
      announce: (t, urgent) => announce(t, urgent),   // for the whole farm, even when it names somebody
      emote: (t, who) => emote(t, who),
      whisper: (mn, t) => whisper(mn, t),
      privateEmote: (mn, t) => privateLine(mn, t, "emote"),
      privateSay: (mn, t) => privateLine(mn, t, "chat"),
      // a "listen to my voice" line: purple and private in the Companion, an out-of-character whisper otherwise
      voice: (mn, t) => hasCompanion(mn) ? enqueue(makeMsg("voice", { text: String(t) }, mn)) : whisper(mn, "[Voice] "+t),
      tell: (mn, t) => tell(mn, t),
      // a private note: the Companion if they have it, otherwise a beep (friends) or a whisper
      notice: (mn, t) => hasCompanion(mn) ? toCompanion(mn, t, "notice") : tell(mn, t),
      reply: (mn, t, ch) => reply(mn, t, ch),
      notifyStaff: (t, routine) => notifyStaff(t, routine),
      ask: (mn, text, cb) => { addonAsks.set(mn, { addon:a.name, cb, at:Date.now() }); askCard(mn, a.name, text); },
      // people
      name: plainName, char: charFor, find: resolveTarget, here: () => (W.ChatRoomCharacter||[]).map(c => c.MemberNumber).filter(m => m !== CFG.BOT_MEMBER),
      onMap, rec: (mn) => rec(mn), isStaff, isHerdmaster, isProprietor, hasRole, ROLE, onDuty, herdLeaderOf, herdMembers,
      species: speciesKey, gender: genderOf, hasCompanion, limitBlocks, rank: rankOf,
      // bodies
      prod: prodOf, HOLES, holeBlocked, hasVulva, makesSemen, makesMilk, capacity, milkCap, heldTotal,
      drainMilk, drainSemen, tally, ml, ANON_STUD, milkGrade, gradeLetter,
      staffPoints, staffScores: () => JSON.parse(JSON.stringify(L.staffScore || {})),
      // another add-on's saved data, read-only (a copy), so add-ons can work together
      peek: (other) => JSON.parse(JSON.stringify((L.mods && L.mods[other]) || {})),
      yieldWeek: (mn) => { rollBoard(); return (L.yield && L.yield.w && L.yield.w[mn]) || 0; },   // milk (and seed) given this week
      studbook: () => JSON.parse(JSON.stringify(L.studbook || [])),
      clockedIn, isMandated, hoursThisWeek: (mn) => { const r = rec(mn); return r && r.shift && r.shift.week && r.shift.week.key === weekKey() ? r.shift.week.ms / 3600000 : 0; }, inHeat, startHeat, rollConception, gearOf, funnelOn,
      // the map
      pos: posOf, spot: (n) => (L.spots && L.spots[n]) || null, spots: () => Object.assign({}, L.spots||{}),
      onSpot, whoOnSpot, zonesOf, inZone: inZoneNamed, zones: () => { zonesLedger(); return L.zones; }, teleport, spotBeside,
      activityInfo,
      penisType: (mn) => { try { return penisType(mn); } catch(e){ return "human"; } },
      cockInches: (mn) => { try { return sizeOf(mn, "penis"); } catch(e){ return 7; } },
      // little cues their own Companion plays (v0.10+): a face, a sound for whoever's around, the trance haze
      face: (mn, mood, secs) => face(mn, mood, secs), sound: (mn, name) => sound(mn, name), trance: (mn, level) => trance(mn, level),
      // time
      later, dayKey, weekKey,
    });
  }

  function registerAddon(def){
    if (!def || typeof def !== "object") throw new Error("register() needs { name, ... }");
    const name = String(def.name||"").toLowerCase();
    if (!ADDON_NAME.test(name)) throw new Error("add-on name must be lowercase letters, numbers or dashes, like 'glory-stalls'");
    if (ADDONS.has(name)) { warn("add-on "+name+" registered twice; the newer one replaces it"); unregisterAddon(name); }
    const a = { name, label: String(def.label || name), version: String(def.version || "0"), on: def.on || {}, companion: def.companion, rates: def.rates || null, lines: def.lines || null,
                guide: def.guide || "", commands: {}, enabled: !(L.addonsOff && L.addonsOff[name]), errors: 0 };
    a.api = addonApi(a);
    for (const [word0, c] of Object.entries(def.commands || {})){
      const word = String(word0).toLowerCase();
      if (PUBLIC_CMDS.includes(word) || STAFF_CMDS.includes(word) || ["addons","addon"].includes(word)) { warn("add-on "+name+": ?"+word+" belongs to the bot, skipped"); continue; }
      if (ADDON_CMDS.has(word)) { warn("add-on "+name+": ?"+word+" is already taken by "+ADDON_CMDS.get(word).addon.name+", skipped"); continue; }
      if (!c || typeof c.run !== "function") continue;
      a.commands[word] = c;
      ADDON_CMDS.set(word, { addon:a, def:c });
      // longer spellings that also work (?leaderboard for ?top); lists only show the short one
      for (const al0 of (c.aliases || [])){
        const al = String(al0).toLowerCase();
        if (PUBLIC_CMDS.includes(al) || STAFF_CMDS.includes(al) || ADDON_CMDS.has(al)) continue;
        ADDON_CMDS.set(al, { addon:a, def:c });
      }
    }
    ADDONS.set(name, a);
    if (typeof def.setup === "function") addonCall(a, "setup", def.setup, a.api);
    log("Add-on loaded: "+a.label+" v"+a.version+" ("+Object.keys(a.commands).map(c => "?"+c).join(" ")+")");
    return a.api;
  }
  function unregisterAddon(name){
    const a = ADDONS.get(name); if (!a) return false;
    for (const [w, hit] of [...ADDON_CMDS]) if (hit.addon === a) ADDON_CMDS.delete(w);   // its commands and their aliases
    ADDONS.delete(name); return true;
  }

  // ?<add-on command>: same rules as the bot's own (rank checks, never silent, private answers stay private)
  function runAddonCommand(hit, sender, args, rest, channel, R){
    const { addon:a, def } = hit;
    if (a.enabled === false){ R(a.label+" is switched off right now, sugar."); return; }
    const need = RANKS[def.rank || "anyone"] || 0;
    if (rankOf(sender) < need){ R("Sorry, sugar, that one's for "+(def.rank === "proprietor" ? "proprietors" : def.rank === "herdmaster" ? "herdmasters and proprietors" : "farm staff")+"."); return; }
    let answered = false;
    const ctx = { sender, args, rest, channel, api: a.api, reply: (t) => { answered = true; R(t); } };
    const errs = a.errors || 0;
    addonCall(a, "?"+Object.keys(a.commands).find(w => a.commands[w] === def), def.run, ctx);
    if ((a.errors || 0) > errs){   // it broke: say so, never "Done"
      audit(sender, "ADDON_ERROR", a.name+" · "+(a.lastError||""));
      R("Oops, sugar, that one hit a snag in the "+a.label+" add-on. It's in the farm log for the proprietors. Try again in a bit, or ask staff.");
      return;
    }
    if (!answered && channel !== "chat" && !(state.cmdWatch && state.cmdWatch.emotes.length))
      R("👍 Done.");   // an add-on that forgot to answer still gets a word back
  }

  // a yes/no somebody owes an add-on
  function addonYesNo(sender, yes){
    const ask = addonAsks.get(sender);
    if (!ask) return false;
    addonAsks.delete(sender);
    if (Date.now() - ask.at > 15*60000){ tell(sender, "That question timed out, sugar, so nothin' happened."); return true; }
    const a = ADDONS.get(ask.addon);
    if (a) addonCall(a, "ask", ask.cb, yes);
    return true;
  }

  // what each add-on wants shown in this person's Companion ("Farm extras" tab)
  function addonStateFor(mn){
    const out = {};
    for (const a of ADDONS.values()){
      if (a.enabled === false || typeof a.companion !== "function") continue;
      const v = addonCall(a, "companion", a.companion, mn);
      if (v && typeof v === "object") out[a.name] = Object.assign({ label: a.label }, v);
    }
    return Object.keys(out).length ? out : undefined;
  }

  // the add-on commands this person may use, as groups like the shared ones ({ name, cmds })
  function addonCommandGroups(mn){
    const rank = rankOf(mn), out = [];
    for (const a of ADDONS.values()){
      if (a.enabled === false) continue;
      const cmds = Object.entries(a.commands).filter(([, c]) => rank >= (RANKS[c.rank || "anyone"] || 0)).map(([w, c]) => c.usage || w);
      if (cmds.length) out.push({ name: a.label, cmds });
    }
    return out;
  }

  // "barn-life", "Barn life", "barnlife" or just "barn" (if only one starts that way)
  function findAddon(text){
    const q = String(text||"").toLowerCase().trim(); if (!q) return null;
    const norm = s => String(s||"").toLowerCase().replace(/[\s_-]+/g, "");
    const all = [...ADDONS.values()];
    const exact = ADDONS.get(q) || all.find(a => norm(a.name) === norm(q) || norm(a.label) === norm(q));
    if (exact) return exact;
    const hits = all.filter(a => norm(a.name).startsWith(norm(q)) || norm(a.label).startsWith(norm(q)));
    return hits.length === 1 ? hits[0] : null;
  }
  function addonsText(topic){
    if (topic){
      const a = findAddon(topic);
      if (!a) return "There's no add-on called '"+topic+"', hon. ?addons lists 'em.";
      return "🧩 "+a.label+" v"+a.version+(a.enabled === false ? " (switched off)" : "")+"\n"+(a.guide || "No guide written yet.")+
             "\n\nCommands: "+(Object.entries(a.commands).map(([w, c]) => "?"+(c.usage || w)+(c.rank && c.rank !== "anyone" ? " ("+c.rank+")" : "")).join(" · ") || "none");
    }
    if (!ADDONS.size) return "🧩 No add-ons are runnin' on the farm right now.";
    return "🧩 FARM ADD-ONS\n"+[...ADDONS.values()].map(a => "• "+a.label+" ("+a.name+")"+(a.enabled === false ? " · off" : "")+
           (a.errors ? " · "+a.errors+" errors" : "")+": "+(Object.keys(a.commands).map(c => "?"+c).join(" ") || "no commands")).join("\n")+
           "\n?addons <name> shows one add-on's guide.";
  }

  // the door add-on scripts knock on. They're separate Tampermonkey scripts, so they find it on the page.
  // It opens once the bot has started (ledger loaded); an add-on that's early waits for "farmhand:ready".
  function addonsBoot(){
    if (W.Farmhand && W.Farmhand.__bot === true) return;
    W.Farmhand = Object.freeze({
      api: 1, version: VERSION, __bot: true,
      // returns the add-on's helpers; the same helpers are also handed to setup(api)
      register: (def) => registerAddon(def),
      list: () => [...ADDONS.values()].map(a => ({ name:a.name, label:a.label, version:a.version, enabled:a.enabled !== false, errors:a.errors })),
      // the Companion on the bot's own account talks to the bot here, on the page
      own: (dict) => {
        try {
          if (!dict || typeof dict !== "object" || !["hello","bye","cmd","outfitSave","outfitAnswer","relayNo","sight","leadOk","leadNo"].includes(dict.type)) return false;
          onCompanion(Object.assign({}, JSON.parse(JSON.stringify(dict)), { from: CFG.BOT_MEMBER }));
          return true;
        } catch(e){ warn("own panel:", e); return false; }
      },
    });
    try { W.dispatchEvent(new W.CustomEvent("farmhand:ready", { detail: { api: 1, version: VERSION } })); } catch(e){ warn("farmhand:ready:", e); }
    log("Add-on door open (window.Farmhand).");
  }
