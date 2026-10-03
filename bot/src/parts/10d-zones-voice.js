  /* WHAT'S IN THIS FILE (10d-zones-voice.js)
     Zones (boxes from two corners, paired into one place) and "who's where"; the farm's own Listen to my
     voice (herd leaders' lines, only for folks who said ?hypno on).
  */
  /* ═══════════ ZONES ═══════════
     Spots are single tiles. Zones are boxes: stand on one corner and ?zone a <name>, the opposite
     corner and ?zone b <name>. Boxes paired into one group count as one place, for odd shapes
     (barn-1 and barn-2 make the barn's L). Used for "where is everybody". */
  function zonesLedger(){ L.zones = L.zones || {}; }
  function inZone(z, p){
    if (!z || !z.a || !z.b || !p) return false;
    return p.X >= Math.min(z.a.X, z.b.X) && p.X <= Math.max(z.a.X, z.b.X) && p.Y >= Math.min(z.a.Y, z.b.Y) && p.Y <= Math.max(z.a.Y, z.b.Y);
  }
  // the named place someone's standin' in: a zone (its group's name), else a spot within a step, else null
  function whereName(mn){
    const C = charFor(mn), p = C && C.MapData && C.MapData.Pos;
    if (!p) return null;
    zonesLedger();
    for (const [n, z] of Object.entries(L.zones)) if (inZone(z, p)) return z.group || n;
    for (const [n, s] of Object.entries(L.spots || {})) if (Math.abs(s.X - p.X) <= 1 && Math.abs(s.Y - p.Y) <= 1) return n;
    return null;
  }
  const zoneText = (n, z) => n+(z.group && z.group !== n ? " (part of "+z.group+")" : "")+" · A "+(z.a ? z.a.X+","+z.a.Y : "not set")+" → B "+(z.b ? z.b.X+","+z.b.Y : "not set");

  /* ═══════════ LISTEN TO MY VOICE ═══════════
     The farm's own: herd leaders (and proprietors) write lines for their whole herd or one member,
     and every so often one shows privately on that person's screen, like a voice in their head.
     Only for stock who said ?hypno on. Nobody else ever sees it. */
  function voiceLedger(){ L.voice = L.voice || {}; L.voice.herd = L.voice.herd || {}; L.voice.member = L.voice.member || {}; }
  // their own lines win over their herd's
  function voiceFor(mn){
    voiceLedger();
    const r = rec(mn);
    if (!r || !r.hypno) return null;
    const m = L.voice.member[mn];
    if (m && m.on && m.lines.length) return m;
    const lead = herdLeaderOf(mn), h = lead && L.voice.herd[lead];
    return h && h.on && h.lines.length ? h : null;
  }
  function voiceTick(){
    voiceLedger();
    state.voiceNext = state.voiceNext || new Map();
    const now = Date.now();
    for (const C of (W.ChatRoomCharacter||[])){
      const mn = C.MemberNumber, v = mn !== CFG.BOT_MEMBER && voiceFor(mn);
      if (!v){ state.voiceNext.delete(mn); continue; }
      if (v.every === "chores" && !clockedIn(mn) && !whereName(mn)?.startsWith("milking")) continue;
      const mins = v.every === "chores" ? 10 : (parseInt(v.every, 10) || 15);
      const next = state.voiceNext.get(mn);
      if (!next){ state.voiceNext.set(mn, now + mins*60000*(0.5 + Math.random()*0.5)); continue; }
      if (now < next) continue;
      state.voiceNext.set(mn, now + mins*60000*(0.8 + Math.random()*0.4));
      const line = fill(v.lines[Math.floor(Math.random()*v.lines.length)], mn);
      if (hasCompanion(mn)) enqueue(makeMsg("voice", { text: line }, mn));
      else whisper(mn, "[Voice] "+line);   // out-of-character in map rooms, so it reaches them anywhere on the map
    }
  }
  // may this person set the voice for that target ("herd" = their own herd)?
  function canVoice(sender, t){
    if (t === "herd") return canHoldHerd(sender);
    return isProprietor(sender) || herdLeaderOf(t) === sender;
  }

