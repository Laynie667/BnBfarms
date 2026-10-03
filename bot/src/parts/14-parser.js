  /* WHAT'S IN THIS FILE (14-parser.js)
     Readin' commands out of chat, whispers, beeps and /bot; which commands are public or staff-only;
     cooldowns (private commands wait their turn instead of bein' dropped).
  */
  /* ───────────── PARSER ───────────── */

  // FIX: safety commands never get throttled
  const NO_COOLDOWN = ["safe","safeword","red","stuck","report","staff"];

  // how long someone waits between commands: panel clicks come quick, so they get a short gap
  const cooldownMs = (channel) => (channel === "companion" ? CFG.COMPANION_COOLDOWN_S : CFG.USER_COOLDOWN_S) * 1000;
  function onCooldown(mn, cmd, channel){
    if (NO_COOLDOWN.includes(cmd)) return false;
    const last = state.cooldowns.get(mn)||0;
    if (Date.now()-last < cooldownMs(channel)) return true;
    state.cooldowns.set(mn, Date.now());
    return false;
  }
  // A private command (panel, whisper, beep, /bot) that came too soon waits its turn instead of
  // vanishin'. Only room-chat spam is dropped. Up to 5 wait per person, run one per gap.
  function waitYourTurn(mn, raw, channel){
    state.cmdWaiting = state.cmdWaiting || new Map();
    const q = state.cmdWaiting.get(mn) || [];
    if (q.length >= 5) return;
    q.push({ raw, channel }); state.cmdWaiting.set(mn, q);
    if (q.length > 1) return;   // a timer's already runnin' for 'em
    const next = () => {
      const left = cooldownMs(channel) - (Date.now() - (state.cooldowns.get(mn)||0));
      later(() => {
        const item = q.shift();
        if (!q.length) state.cmdWaiting.delete(mn); else next();
        if (item) handleCommand(mn, item.raw, item.channel);
      }, Math.max(50, left + 50));
    };
    next();
  }

  // Plain-English questions sent straight to the bot (whisper, beep, /bot).
  // Checked before bare-word commands, so "who are you?" no longer runs ?who.
  const NATURAL = [
    [/^(who|what) are you\b/,                                  "help"],
    [/\b(i'?m|im|i am|got) (stuck|wedged|trapped|caught)\b/,     "stuck"],
    [/\bwho('?s| is) (here|around|about|on duty)\b/,             "who"],
    [/\bwhat (keys|doors)\b|\bmy keys\b/,                       "keys"],
    [/\bwhere am i\b/,                                         "where"],
    [/\bmy (record|file|paperwork)\b/,                          "record"],
    [/\bhow do i (apply|join|sign up|stay)\b/,                  "apply"],
    [/\b(house )?rules\b/,                                      "rules"],
    [/\bwhat opens\b/,                                          "doors"],
    [/\bwhat (animals|species)\b/,                              "species"],
    [/\b(i )?need (a hand|help|staff)\b|\bget (me )?(a )?staff\b/, "staff"],
    [/\bmy (herd|pack|pride|flock|stable|roster)\b/,             "herd"]
  ];
  function naturalCommand(text){
    const low = String(text).toLowerCase().trim();
    if (!low.includes(" ")) return null;            // single words are commands already
    for (const [re, cmd] of NATURAL) if (re.test(low)) return { cmd, args:[], rest:"" };
    return null;
  }

  function parseCommand(raw, isWhisper, isBeep, noNatural){
    let text = String(raw).trim();
    if (!text) return null;
    const lower = text.toLowerCase();

    for (const wp of CFG.BOT_WORDS){
      if (lower === wp) return { cmd:"help", args:[], rest:"" };
      if (lower.startsWith(wp + " ")){
        text = text.slice(wp.length).trim();
        const parts = text.split(/\s+/);
        return { cmd: parts[0].toLowerCase().replace(/[,.!?]+$/,""), args: parts.slice(1), rest: parts.slice(1).join(" ") };
      }
    }

    if (CFG.PREFIXES.includes(text[0])){
      text = text.slice(1).trim();
      if (!text) return null;
      const low2 = text.toLowerCase();
      for (const wp of CFG.BOT_WORDS){
        if (low2.startsWith(wp + " ")) text = text.slice(wp.length).trim();
      }
      const parts = text.split(/\s+/);
      return { cmd: parts[0].toLowerCase().replace(/[,.!?]+$/,""), args: parts.slice(1), rest: parts.slice(1).join(" ") };
    }

    if (isWhisper || isBeep){
      const nat = noNatural ? null : naturalCommand(text);
      if (nat) return nat;
      const parts = text.split(/\s+/);
      return { cmd: parts[0].toLowerCase().replace(/[,.!?]+$/,""), args: parts.slice(1), rest: parts.slice(1).join(" ") };
    }
    return null;
  }

  const PUBLIC_CMDS = ["help","commands","info","guide","rules","consent","tour","species","luxury","doors",
                       "ping","apply","record","keys","who","herd","safe","safeword","red","report",
                       "staff","stuck","friend","notice","teaseme",
                       "stats","board","pedigree","breedable","fertile","naturalheat","breed","cum","milkable","futa","size","sizes","measure","penis","cock","rights","accept",
                       "freeuse","jarok","gender","outfit","outfits","uniform","hypno","tally","eggs","yes","no","wash","quota","praise","degrade",
                       "weather","feeding","curfew","beg","please","fair","enter"];
  const STAFF_CMDS  = ["queue","app","approve","deny","register","unregister","grant","revoke",
                       "claim","release","myherd","herdname","herdcall","herdsummon","turnout","letup","goldkey",
                       "pasture","onduty","cover","staffadd","staffremove",
                       "backup","staffhelp","note","keysync","keydump","where",
                       "roster","stock","find","signed","setrescue","stucklog","addfriend",
                       "forced","summon","health",
                       "tier","vet","brand","tease","spot","spots","appclear",
                       "milk","collect","heat","heatline","shotlog",
                       "stocks","unstock","walk","tourstop","clockin","clockout","hours","done","chore","chores",
                       "wheel","spin","begphrase","score","drain","denial","ruin","jars","inseminate","nomilk","inspect","edge",
                       "contract","contracts","zone","zones","voice","machine"];

  const SAFETY_CMDS = ["safe","safeword","red","stuck"];
  const PRIVATE_REPLY = ["record","keys","find","app","queue","roster","stock","health",
                         "myherd","herd","stucklog","keydump","summon","where","cover",
                         "vet","spot","spots","tease","teaseme","stats","pedigree",
                         "hours","chores","wheel","tourstop","quota","contract","contracts"];

  function parseRoles(args){
    const out=[];
    for (const a of args){
      switch (String(a).toLowerCase()){
        case "livestock": case "stock": out.push(ROLE.LIVESTOCK); break;
        case "guest": out.push(ROLE.GUEST); break;
        case "luxury": case "luxuryguest": out.push(ROLE.LUXURY); break;
        case "farmhand": out.push(ROLE.FARMHAND); break;
        case "mandated": case "mandatedfarmhand": out.push(ROLE.MANDATED); break;
        case "herdmaster": out.push(ROLE.HERDMASTER); break;
        case "gloryhole": out.push(ROLE.GLORYHOLE); break;
      }
    }
    return out;
  }

  // staffView: staff, or the record holder reading their own file
  // (staff notes stay staff-only either way)
  function recordText(mn, staffView, notesView){
    const r = rec(mn);
    if (!r) return plainName(mn)+" ain't on the books yet, sugar. Say ?apply to get started.";
    let o = "🌾 FARM RECORD — "+(r.name||plainName(mn))+" ("+mn+")\n";
    o += "\nStanding:  "+roleString(mn);
    o += "\nKeys:      "+keyString(mn);
    if (tierOf(mn)) o += "\nTier:      "+tierName(tierOf(mn));
    if (r.species)  o += "\nAnimal:    "+r.species;
    if (r.brand)    o += "\nBrand:     "+r.brand.mark+" (put there by "+plainName(r.brand.by)+")";
    if (r.stayType) o += "\nStay:      "+r.stayType;
    if ((r.herds||[]).length) o += "\nBelongs to: "+herdsLine(mn);
    if (canHoldHerd(mn)) o += "\nKeeps:     a "+herdWord(mn)+" of "+herdMembers(mn).length+"/"+herdCap(mn);
    if (r.pastureLock) o += "\nPasture:   🔒 kept out by "+plainName(r.pastureLock.by)+" — can't go on duty";
    if (isMandated(mn)) o += "\nOn call:   🔗 mandated — can't opt out";
    else if (r.forced)  o += "\nOn call:   🔗 yes — office can summon";
    o += "\nContract:  "+(r.contractSigned?"signed ✅":"not yet ⚠️");
    o += "\nOn books:  "+new Date(r.registeredAt).toLocaleDateString();
    if (r.limits) o += "\n\n🔴 Hard limits:\n"+r.limits;
    if (staffView && r.triggers)  o += "\n\n⚠️ Triggers (you and staff only):\n"+r.triggers;
    if (staffView && r.aftercare) o += "\n\n🤍 Aftercare:\n"+r.aftercare;
    if (notesView && r.notes)     o += "\n\n📝 Staff notes:\n"+r.notes;
    return o;
  }

  function whoText(){
    const here = (W.ChatRoomCharacter||[]).map(c=>c.MemberNumber).filter(m=>m!==CFG.BOT_MEMBER);
    const staffHere=[], stockHere=[], guestsHere=[], otherHere=[];
    for (const m of here){
      if (isStaff(m) && onDuty(m)) staffHere.push(m);
      else if (hasRole(m,ROLE.LIVESTOCK) || (rec(m) && !onDuty(m))) stockHere.push(m);
      else if (hasRole(m,ROLE.GUEST)||hasRole(m,ROLE.LUXURY)) guestsHere.push(m);
      else otherHere.push(m);
    }
    let o = "🌾 WHO'S ABOUT\n";
    o += "\n👷 Staff on duty: "+(staffHere.length?staffHere.map(plainName).join(", "):"none");
    const offProps = CFG.PROPRIETORS.filter(p=>rec(p)&&rec(p).onDuty===false);
    if (offProps.length){
      const holder = offProps.map(p=>herdLeaderOf(p)).find(h=>h);
      let line = null;
      if (holder && rec(holder) && (rec(holder).cover||[]).length){
        const pool = rec(holder).cover;
        line = pool[Math.floor(Math.random()*pool.length)];
      }
      o += "\n   "+(line||"The proprietors are out grazin' in the pasture. Might be a while, hon!");
    }
    const extra = m => titleTag(m)+(paintedText(m) ? " 💦" : "")+((rec(m)||{}).tally && tallyToday(m) ? " ✏️"+tallyToday(m) : "");
    o += "\n\n🐄 Stock: "+(stockHere.length?stockHere.map(m=>plainName(m)+brandTag(m)+extra(m)).join(", "):"none about right now");
    if (guestsHere.length) o += "\n🏡 Guests: "+guestsHere.map(plainName).join(", ");
    if (otherHere.length)  o += "\n👤 Visitors: "+otherHere.map(plainName).join(", ");
    const oncall = forcedStaff().filter(m=>!charFor(m));
    if (oncall.length) o += "\n\n🔗 On call, away: "+oncall.length+" — ?summon to fetch 'em, sugar";
    return o;
  }

