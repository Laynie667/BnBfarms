  /* WHAT'S IN THIS FILE (10y9m-seasons.js)
     THE FARM'S SEASONS (Laynie, Oct 27: "halloween pack, but alot more, full of tricks and treats. winter pack yes,
     easter, yes, soltice and equinox based packs with pagan/wiccan themes would be cool").
     • Each season has its own pack of traps. They only spring while it's on (a proprietor's ?trap spring still works).
     • While one's on, about a third of what a plain trap tile springs comes from its pack (the ones that fit the place
       it's in, when some do), and a tile named after it (trap-halloween, trap-halloween-2…) springs nothin' else.
     • The farm girl dresses for it (her own Companion puts the pieces on, where the game has them) and takes it off after.
     • I tell the room when one starts and when it's over.
     • ?seasons (or ?calendar): the calendar and what's on. (?season is the Breedin' add-on's breedin' week, not this.)
       Proprietors: ?seasons start <name> [how long] runs one now, any time of year (to try it out, for a party, a
       special day, or just because; Laynie, Oct 27: "i would like to have commands to turn on the holiday traps any time,
       like for special occasions, just because"). Several at once (?seasons start halloween winter), or all of them
       (?seasons start all). How long: 2h (the default), 90m, 3d, 2w, or on (till you stop it). ?seasons stop ends the
       ones started by hand (?seasons stop <name> or all: the calendar's own too, till it's over), ?seasons costume on|off.
       The Companion has the same as buttons: the Seasons card (Traps tab, and the Staff view's Barn tab).
     The dates go by the bot's own clock. The packs themselves are in the files after this one (10y9n-halloween.js…).
  */
  const SEASONS = {};          // id → { label, icon, dates, on(date), kinds, also, costume, start, end, why, hint (a line for ?seasons while it's on) }
  const SEASON_OF = {};        // trap kind → the season it belongs to (only those spring in season)
  const SEASON_PLACES = {};    // trap kind → the places it fits, for the plain tiles (10ua-trap-themes.js)
  const SEASON_LINES = {};     // the lines for a season's traps that nobody's waitin' in
  const SEASON_TAGS = {};      // trap kind → what sort of trap it is, for the switches (10y9q-trap-switches.js)
  if (CFG.SEASON_SHARE === undefined) CFG.SEASON_SHARE = 1/3;   // how much of what a plain tile springs comes from the pack
  // (the tests never go by the real calendar: an August day, unless a test sets W.__date, so a run in Halloween week or in
  // December springs the same traps as one in August)
  const seasonDate = () => W.__FARMHAND_TEST__ ? new Date(W.__date || "2026-08-10T12:00:00") : new Date();
  // Easter Sunday (the Gregorian reckonin')
  function easterOf(y){
    const a = y % 19, b = Math.floor(y/100), c = y % 100, d = Math.floor(b/4), e = b % 4, f = Math.floor((b + 8)/25), g = Math.floor((b - f + 1)/3);
    const h = (19*a + b - d - g + 15) % 30, i = Math.floor(c/4), k = c % 4, l = (32 + 2*e + 2*i - h - k) % 7, m = Math.floor((a + 11*h + 22*l)/451);
    const month = Math.floor((h + l - 7*m + 114)/31), day = ((h + l - 7*m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }
  const md = (dt) => (dt.getMonth() + 1)*100 + dt.getDate();   // 1031 = Oct 31
  // a season, and its own little bit of the farm
  function season(id, def){ SEASONS[id] = Object.assign({ id, kinds: [], also: [], costume: [] }, def); return SEASONS[id]; }
  // one of a season's traps, and everything it needs, in one place
  function seasonTrap(sid, kind, d){
    TRAP_KINDS[kind] = { icon: d.icon, what: d.what, limit: d.limit || null };
    SEASON_OF[kind] = sid; if (!SEASONS[sid].kinds.includes(kind)) SEASONS[sid].kinds.push(kind);
    if (d.places) SEASON_PLACES[kind] = d.places;
    if (d.tags) SEASON_TAGS[kind] = d.tags;
    if (d.stud){ ANTHRO[kind] = d.stud; ANTHRO_LINES[kind] = d.lines; }   // somebody's waitin' in it (10u3-anthro-traps.js runs it)
    else { SEASON_LINES[kind] = d.lines; MORE_TRAPS[kind] = (mn, spot) => seasonRun(mn, kind, d, spot); }
    if (d.scene) trapScene(kind, ...d.scene);                               // its own two extra beats (10ue-trap-scenes.js)
    if (d.tender || d.filthy) INTENSITY_BY_TRAP[kind] = { tender: d.tender || [], filthy: d.filthy || [] };   // (10y9b-intensity-lines.js)
    if (d.depth) depthOf(d.depth, [kind]);                                  // the general beats it borrows (10ud-trap-depth.js)
    if (d.mess) MESS_BY_TRAP[kind] = d.mess;                                // (10u7-traps-3.js)
    if (d.gear) TRAP_GEAR[kind] = d.gear;                                   // real gear (10y-farm-gear.js)
    if (d.sound) TRAP_SOUND[kind] = d.sound; if (d.soundEnd) TRAP_SOUND_END[kind] = d.soundEnd;   // (10y9c-sounds.js)
    if (d.needs) TRAP_NEEDS[kind] = d.needs;
    if (d.writes) TRAP_WRITES[kind] = d.writes;                             // what it might write on them after (10x-trap-extras.js)
    for (const f of d.tw || []) if (TW[f] && !TW[f].kinds.includes(kind)) TW[f].kinds.push(kind);   // likelier at night, in a crowd… (10ua2)
  }
  const seasonLine = (kind, key, mn, v) => tFill(pickFor(mn, "trap:"+kind+":"+key, SEASON_LINES[kind][key]), mn, v);
  // a season's trap that nobody's waitin' in: its beats, then what it does, then its last line
  function seasonRun(mn, kind, d, spot){
    const v = {};
    if (d.before){ try { const got = d.before(mn, v); if (got === false) return; } catch(e){ warn("season trap "+kind+":", e); } }
    trapHold(mn, d.hold || 5, d.where || "the farm");
    const T = SEASON_LINES[kind];
    trapRun(mn, kind, typeof T.beats === "function" ? T.beats(mn, v) : T.beats, () => {
      let vv = v;
      try { const got = d.after ? d.after(mn, v) : null; if (got) vv = Object.assign({}, v, got); } catch(e){ warn("season trap "+kind+":", e); }
      emote(TRAP_KINDS[kind].icon+" "+seasonLine(kind, vv.endKey || "end", mn, vv), mn);
    }, v);
  }

  // ── which seasons are on ─────────────────────────────────
  function seasonsLedger(){
    const S0 = L.seasons = L.seasons || { forced: {}, off: {}, seen: {}, costumeOff: false };
    if (!S0.forced) S0.forced = {};
    if (S0.force !== undefined){ const f = S0.force; if (f && f.id && f.until > Date.now()) S0.forced[f.id] = { until: f.until, by: f.by }; delete S0.force; }   // (one at a time, before)
    return S0;
  }
  // started by hand: on till its time's up, or till somebody stops it (open)
  const forcedLive = (f, now) => !!f && (f.open || f.until > (now || Date.now()));
  // the seasons the calendar says, today (date: for the calendar list)
  function seasonsByDate(dt){ dt = dt || seasonDate(); return Object.values(SEASONS).filter(S => S.kinds.length && S.on(dt)).map(S => S.id); }
  function seasonsOn(){
    const S0 = seasonsLedger(), now = Date.now(), out = [];
    for (const id of seasonsByDate()) if (!(S0.off[id] > now)) out.push(id);
    for (const [id, f] of Object.entries(S0.forced)) if (forcedLive(f, now) && SEASONS[id] && SEASONS[id].kinds.length && !out.includes(id)) out.push(id);   // (after the calendar's: its costume wins)
    return out;
  }
  function seasonOnFor(kind){ const s = SEASON_OF[kind]; return !s || seasonsOn().includes(s); }
  const seasonName = (id) => SEASONS[id] ? SEASONS[id].icon+" "+SEASONS[id].label : id;
  const seasonWord = (w) => { const k = String(w || "").toLowerCase().replace(/[^a-z]/g, ""); return SEASONS[k] ? k : Object.keys(SEASONS).find(id => SEASONS[id].alias && SEASONS[id].alias.includes(k)) || null; };

  // what a plain trap tile springs this time: a season's pack (a third of the time, or always on its own tile), or null
  function seasonPick(mn, spot){
    const on = seasonsOn(); if (!on.length || !spot) return null;
    const name = String(spot), own = (/^trap-(?:theme-)?([a-z]+)/.exec(name) || [])[1], ownS = seasonWord(own);
    if (ownS && !on.includes(ownS)) return null;   // (its season isn't on: it's a plain tile till it is)
    if (!ownS && (!/^trap(?:-\d+)?$/.test(name) && !trapTheme(spot))) return null;   // a trap-<kind> tile is its own trap
    if (!ownS && Math.random() >= CFG.SEASON_SHARE) return null;
    const ids = ownS ? [ownS] : on;
    let all = [];
    for (const id of ids){ const S = SEASONS[id]; all = all.concat(S.kinds, S.also || []); }
    all = [...new Set(all)].filter(k => TRAP_KINDS[k] && !trapWhyNot(mn, k));
    if (!all.length) return null;
    const th = trapTheme(spot), fit = th ? all.filter(k => (SEASON_PLACES[k] || []).includes(th)) : [];
    if (th && !ownS && !fit.length) return null;   // a place's tile keeps to its place when nothin' in season fits there
    const S = SEASONS[ids[Math.floor(Math.random()*ids.length)]], why = Array.isArray(S.why) ? S.why[Math.floor(Math.random()*S.why.length)] : (S.why || "");
    return { kinds: fit.length ? fit : all, why };
  }

  // ── the farm girl's costume ───────────────────────────────
  // her own Companion puts it on (it's farm gear with "always": no switch needed on her own account), where the game has it
  function seasonCostume(){
    const S0 = seasonsLedger(); if (S0.costumeOff) return [];
    const on = seasonsOn().map(id => SEASONS[id]).filter(S => S.costume && S.costume.length);
    if (!on.length) return [];
    const S = on[on.length - 1], until = (Math.floor(Date.now()/3600000) + 2)*3600000;   // (changes once an hour, not every sync)
    return S.costume.map(c => Object.assign({ always: true, only: true, until }, c));
  }

  // ── once a minute: a season starts, or ends ──────────────
  function seasonTick(){
    const now = Date.now();
    if (now - (state.seasonAt || 0) < 60000) return;
    state.seasonAt = now;
    const S0 = seasonsLedger(), on = seasonsOn();
    for (const [id, f] of Object.entries(S0.forced)) if (!forcedLive(f, now)){ delete S0.forced[id]; saveLedger(); }
    for (const [id, t] of Object.entries(S0.off)) if (t <= now){ delete S0.off[id]; saveLedger(); }
    let told = false;
    for (const id of on){
      if (S0.seen[id]) continue;
      S0.seen[id] = now; saveLedger(); told = true;
      if (inRoom()) announce(SEASONS[id].icon+" "+tFill(pickFresh("season:start:"+id, SEASONS[id].start || [SEASONS[id].label+" has come to the farm."]), 0)+
        " (?seasons says what's on.)");
    }
    for (const id of Object.keys(S0.seen)){
      if (on.includes(id)) continue;
      delete S0.seen[id]; saveLedger(); told = true;
      if (inRoom() && SEASONS[id]) announce(SEASONS[id].icon+" "+pickFresh("season:end:"+id, SEASONS[id].end || [SEASONS[id].label+" is over on the farm for another year."]));
    }
    if (told) syncCompanions(true);   // (the farm girl's costume on or off)
  }

  // ── ?seasons ──────────────────────────────────────────────
  function seasonDates(id, dt){ const S = SEASONS[id]; return S.dates ? S.dates(dt || seasonDate()) : ""; }
  const seasonPacks = () => Object.keys(SEASONS).filter(k => SEASONS[k].kinds.length);
  // how long a season's started for: "3" or "3h" (hours), "90m", "2d", "1w", "1mo", or "on" / "till stopped" (till it's
  // stopped) → { ms } or { open: true }, or null
  function seasonLength(words){
    const w = String(words || "").toLowerCase().replace(/^for\s+/, "").trim();
    if (!w) return { ms: 2*3600000 };
    if (/^(on|open|always|forever|nonstop|indefinitely|till|until|no ?end|keep)\b/.test(w)) return { open: true };
    const m = /^(\d+(?:\.\d+)?)(mo|mon|months?|m|mins?|minutes?|h|hrs?|hours?|d|days?|w|wks?|weeks?)?$/.exec(w.replace(/\s+/g, ""));
    if (!m) return null;
    const n = parseFloat(m[1]), u = m[2] || "h";
    return { ms: n*(/^mo/.test(u) ? 30*86400000 : u[0] === "m" ? 60000 : u[0] === "d" ? 86400000 : u[0] === "w" ? 7*86400000 : 3600000) };
  }
  const howLong = (ms) => { const m = Math.round(ms/60000); return m < 60 ? m+" minutes" : m < 2880 ? Math.round(m/6)/10+" hour"+(m === 60 ? "" : "s") : Math.round(m/144)/10+" days"; };
  const tillWhen = (t) => new Date(t).toLocaleString([], t - Date.now() < 20*3600000 ? { hour: "2-digit", minute: "2-digit" } : { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  function seasonCommand(sender, args, R){
    const a0 = String(args[0] || "").toLowerCase(), S0 = seasonsLedger(), owner = isProprietor(sender), now = Date.now();
    if (a0 === "start" || a0 === "begin" || a0 === "run"){
      if (!owner){ R("Startin' a season out of its time is for the proprietors, sugar."); return; }
      // the seasons named (or all of them), then how long
      const packs = seasonPacks(), ids = []; let i = 1, every = false;
      for (; i < args.length; i++){
        const w = String(args[i]).toLowerCase().replace(/[,&+]+$/, "");
        if (!w || w === "and" || w === "&" || w === "+") continue;
        if (/^(all|every|everything|them)$/.test(w)){ every = true; for (const k of packs) if (!ids.includes(k)) ids.push(k); continue; }
        const id = seasonWord(w);
        if (!id || !SEASONS[id].kinds.length) break;
        if (!ids.includes(id)) ids.push(id);
      }
      if (!ids.length){ R("Which one, sugar? ?seasons start <name> [how long]: "+packs.join(", ")+", or all of them. How long: 2h (the default), 90m, 3d, 2w, or on (till you stop it)."); return; }
      const len = seasonLength(args.slice(i).join(" "));
      if (!len){ R("How long, sugar? Like ?seasons start "+ids[0]+" 4h (or 90m, 3d, 2w), or ?seasons start "+ids[0]+" on to keep it goin' till you stop it."); return; }
      const ms = len.open ? 0 : Math.max(15*60000, Math.min(90*86400000, len.ms));
      for (const id of ids){ S0.forced[id] = len.open ? { open: true, until: 0, by: sender, at: now } : { until: now + ms, by: sender, at: now }; delete S0.off[id]; }
      saveLedger(); audit(sender, "SEASON", "start "+ids.join(",")+" "+(len.open ? "till stopped" : Math.round(ms/60000)+" min"));
      state.seasonAt = 0; seasonTick(); syncCompanions(true);
      const one = ids.length === 1 && !every;
      if (every) R("Every season's on now: "+ids.map(seasonName).join(", ")+", "+(len.open ? "till you stop them" : "for "+howLong(ms))+". ?seasons stop ends them early.");
      else R(ids.map(seasonName).join(", ")+(one ? " is" : " are")+" on now, "+(len.open ? "till you stop "+(one ? "it" : "them") : "for "+howLong(ms))+". ?seasons stop"+(one ? " "+ids[0] : "")+" ends "+(one ? "it" : "them")+" early.");
      return;
    }
    if (a0 === "stop" || a0 === "off" || a0 === "end"){
      if (!owner){ R("Endin' a season is for the proprietors, sugar."); return; }
      // nothin' named: the ones started by hand (or, with none, whatever's on) · a name, or all: the calendar's own too
      const on = seasonsOn(), hand = on.filter(id => forcedLive(S0.forced[id], now) && !seasonsByDate().includes(id));
      const rest = args.slice(1).map(w => String(w).toLowerCase().replace(/[,&+]+$/, "")).filter(w => w && !/^(and|&|\+)$/.test(w));
      let ids = !rest.length ? (hand.length ? hand : on) : rest.some(w => /^(all|every|everything|them)$/.test(w)) ? on : rest.map(seasonWord).filter(Boolean);
      ids = [...new Set(ids)].filter(id => on.includes(id));
      if (!ids.length){ R(rest.length && on.length ? "That one's not on, sugar. On now: "+on.map(seasonName).join(", ")+"." : "There's no season on to stop, sugar."); return; }
      for (const id of ids){
        delete S0.forced[id];
        if (seasonsByDate().includes(id)){
          // the calendar's own: off till the day after it ends
          let t = now; for (let k = 0; k < 70 && SEASONS[id].on(new Date(t)); k++) t += 86400000;
          S0.off[id] = t;
        }
      }
      saveLedger(); audit(sender, "SEASON", "stop "+ids.join(",")); state.seasonAt = 0; seasonTick(); syncCompanions(true);
      const one = ids.length === 1, left = seasonsOn();
      R(ids.map(seasonName).join(", ")+(one ? " is" : " are")+" off now. ?seasons start "+(one ? ids[0] : "<name>")+" brings "+(one ? "it" : "one")+" back."+
        (left.length ? " Still on: "+left.map(seasonName).join(", ")+"." : ""));
      return;
    }
    if (a0 === "costume"){
      if (!owner){ R("What the farm girl wears is up to the proprietors, sugar."); return; }
      const v = String(args[1] || "").toLowerCase();
      if (v !== "on" && v !== "off"){ R("👗 The farm girl's season costume is "+(S0.costumeOff ? "off" : "on")+". ?seasons costume on|off"); return; }
      S0.costumeOff = v === "off"; saveLedger(); syncCompanions(true);
      R(S0.costumeOff ? "👗 The farm girl stays in her own clothes through the seasons now." : "👗 The farm girl dresses up for the seasons again (her own Companion puts it on, where the game has the pieces)."); return;
    }
    const on = seasonsOn(), cal = seasonsByDate();
    const byHand = (id) => { const f = S0.forced[id]; return forcedLive(f, now) && !cal.includes(id) ? " (started by hand, "+(f.open ? "till it's stopped" : "till "+tillWhen(f.until))+")" : ""; };
    const rows = Object.values(SEASONS).filter(S => S.kinds.length).map(S => "• "+S.icon+" "+S.label+" · "+seasonDates(S.id)+(on.includes(S.id) ? " · ON NOW" : "")+
      " · "+S.kinds.length+" traps"+(S.tot ? " and trick-or-treatin'" : "")+(S.blurb ? " · "+S.blurb : ""));
    R("🗓️ THE FARM'S SEASONS\n"+(rows.length ? rows.join("\n") : "  None yet.")+
      "\n\nWhile one's on, about a third of what the plain trap tiles spring is from its pack, a tile named trap-<season> (trap-halloween) springs nothin' else, and the farm girl dresses for it. "+
      "Its traps don't spring the rest of the year, unless a proprietor starts it."+(on.length ? "\nOn now: "+on.map(id => seasonName(id)+byHand(id)).join(", ")+"." : "")+
      (on.some(id => SEASONS[id].tot) ? "\n?trickortreat to knock on the farm girl's door." : "")+on.map(id => SEASONS[id].hint).filter(Boolean).map(h => "\n"+h).join("")+
      (owner ? "\n?seasons start <name|all> [2h, 90m, 3d, 2w, or on: till you stop it] · ?seasons stop [name|all] · ?seasons costume on|off" : ""));
  }
  // the proprietors' Seasons card in the Companion (the Traps tab, and the Staff view's Barn tab)
  function seasonsStateFor(mn, s){
    if (!isProprietor(mn)) return;
    const S0 = seasonsLedger(), now = Date.now(), on = seasonsOn(), cal = seasonsByDate();
    const rows = seasonPacks().map(id => {
      const S = SEASONS[id], f = S0.forced[id], hand = forcedLive(f, now) && !cal.includes(id);
      return Object.assign({ id, icon: S.icon, label: S.label, dates: seasonDates(id), n: S.kinds.length, on: on.includes(id) },
        hand ? (f.open ? { hand: true, open: true } : { hand: true, until: Math.ceil(f.until/60000)*60000 }) : {});
    });
    if (rows.length) s.seasonsAdmin = { rows, costume: !S0.costumeOff };
  }
  // ?traps: the seasons' own traps, apart from the rest
  function seasonsTrapList(){
    const on = seasonsOn();
    return Object.values(SEASONS).filter(S => S.kinds.length).map(S => S.icon+" "+S.label+" ("+seasonDates(S.id)+(on.includes(S.id) ? ", on now" : "")+"): "+S.kinds.join(", ")).join("\n");
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __seasonTick: () => { state.seasonAt = 0; seasonTick(); }, __seasonsOn: () => seasonsOn(), __seasonPick: (m, s) => seasonPick(m, s),
    __seasons: () => SEASONS, __seasonOf: () => SEASON_OF, __seasonPlaces: () => SEASON_PLACES, __easterOf: (y) => easterOf(y), __seasonCostume: () => seasonCostume(), __seasonsByDate: (d) => seasonsByDate(new Date(d)) });
