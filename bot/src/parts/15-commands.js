  /* WHAT'S IN THIS FILE (15-commands.js)
     What every ?command does. One big switch: find a command with `case "name":`. Also: never goin'
     quiet on a private message, and copyin' emotes to the Companion.
  */
  /* ───────────── COMMAND DISPATCH ───────────── */

  function handleCommand(sender, raw, channel, fromQueue){
    // the same command twice within a second and a half (a double-tapped button, a beep that arrived twice): once is enough
    if (!fromQueue){
      state.lastCmd = state.lastCmd || new Map();
      const prev = state.lastCmd.get(sender), key = channel+"|"+String(raw).trim().toLowerCase();
      if (prev && prev.key === key && Date.now() - prev.at < 1500) return;
      state.lastCmd.set(sender, { key, at: Date.now() });
    }
    state.inReply = true;
    // from the Companion: if the only thing a command does is a room emote, the panel gets a copy too
    const watch = channel === "companion" ? (state.cmdWatch = { mn: sender, replied: false, emotes: [] }) : null;
    try { return handleCommandInner(sender, raw, channel); }
    catch(e){
      // a command that breaks still gets an answer, and the log says which one and why
      warn("command failed: ?"+String(raw).slice(0,60)+" from "+sender+":", e);
      audit(sender, "CMD_ERROR", String(raw).slice(0,60)+" · "+String(e && e.message || e).slice(0,120));
      try { reply(sender, "Oops, sugar, ?"+String(raw).slice(0,40)+" hit a snag on my end. It's written in the farm log for the proprietors. Try again in a bit, or ask staff.", channel); } catch(e2){}
    }
    finally {
      state.inReply = false; state.cmdWatch = null;
      if (watch && !watch.replied && watch.emotes.length) toCompanion(sender, "(in the room) "+watch.emotes.join("\n"), "reply");
    }
  }
  function handleCommandInner(sender, raw, channel){
    const isWhisper = channel === "whisper" || channel === "bot" || channel === "companion" || channel === "local";   // local = /office on the bot's own screen
    const isBeep    = channel === "beep";

    if (state.sessions.has(sender)){
      // mid-interview, plain sentences are answers, never natural-language commands
      // Answers like "staff" (question 2!) or "rules are fine" used to be grabbed as commands.
      // Now only a prefixed command (?rules) or a lone safety word interrupts the interview.
      const p0 = parseCommand(raw, false, false, true);   // prefixed / bot-word forms only
      const lone = String(raw).trim().toLowerCase();
      const pass = (p0 && ["help","rules","species","tour","consent","luxury","doors",
                           "safe","safeword","red","stuck","staff"].includes(p0.cmd))
                || ["safe","safeword","red","stuck"].includes(lone);
      if (!pass && handleApplicationAnswer(sender, raw, channel)) return;
    }

    // Never go quiet on somebody talkin' to me in private: a silent bot is harder to fix than a chatty one.
    // (Room chat is everyone's conversation, so there I only answer real commands.)
    const huh = (msg) => {
      if (channel === "chat") return;
      state.huhAt = state.huhAt || new Map();
      if (Date.now() - (state.huhAt.get(sender)||0) < 60000) return;
      state.huhAt.set(sender, Date.now());
      reply(sender, msg, channel);
    };
    const p = parseCommand(raw, isWhisper, isBeep);
    if (!p){ huh("I didn't catch a command in that, sugar. Try ?help, or just say what you'd like, like stats or keys."); return; }
    const { cmd, args, rest } = p;
    const addonCmd = ADDON_CMDS.get(cmd) || null;   // a command from an add-on script (10f-addons.js)
    if (!PUBLIC_CMDS.includes(cmd) && !STAFF_CMDS.includes(cmd) && !addonCmd){ huh("I don't know ?"+cmd+", hon. ?help lists what I can do."); return; }
    if (STAFF_CMDS.includes(cmd) && !isStaff(sender)){ huh("?"+cmd+" is just for farm staff, sugar."); return; }
    if (onCooldown(sender, cmd, channel)){ waitYourTurn(sender, raw, channel); return; }   // waits its turn (14-parser.js)

    dbg("CMD:", cmd, "from", sender, "via", channel);

    // ?safe / ?stuck cover the farm only: a beep from another room gets told so
    if (CFG.SAFETY_REQUIRE_IN_ROOM && SAFETY_CMDS.includes(cmd) && !charFor(sender)){
      reply(sender, "🔴 I hear you, "+plainName(sender)+". The farm office only covers the farm, and you're not here right now, so I can't stop "+
                    "anything where you are. Please use the club's own safeword and your room's admins.\n\n"+
                    "?staff still reaches our people if you'd like a hand.", channel);
      audit(sender,"SAFETY_OUTSIDE",cmd);
      return;
    }
    // Files, rosters and keys are nobody else's business: never said out loud.
    const replyCh = (channel === "chat" && (PRIVATE_REPLY.includes(cmd) || (addonCmd && addonCmd.def.private)))
      ? (canBeep(sender) ? "beep" : "whisper") : channel;
    // staff lookin' up somebody else from the Companion: the answer goes in their Office, not the feed
    const docAbout = (channel === "companion" && DOC_CMDS.includes(cmd) && args[0] && isStaff(sender)) ? resolveTarget(args[0]) : null;
    const R = (docAbout && docAbout !== sender)
      ? (txt) => toCompanion(sender, txt, "doc", false, { kind: cmd, who: plainName(docAbout), about: docAbout })
      : (txt) => reply(sender, txt, replyCh);

    if (addonCmd){ runAddonCommand(addonCmd, sender, args, rest, channel, R); return; }

    switch (cmd) {

      case "addons": case "addon": {
        // ?addons · ?addons <name> · proprietors: ?addons on|off <name>
        const sub = String(args[0]||"").toLowerCase();
        if ((sub === "on" || sub === "off") && args[1]){
          if (!isProprietor(sender)){ R("Only proprietors switch add-ons on and off, sugar."); break; }
          const a = ADDONS.get(String(args[1]).toLowerCase());
          if (!a){ R("There's no add-on called '"+args[1]+"', hon. ?addons lists 'em."); break; }
          a.enabled = sub === "on"; L.addonsOff = L.addonsOff || {}; if (a.enabled) delete L.addonsOff[a.name]; else L.addonsOff[a.name] = true;
          saveLedger(); audit(sender, "ADDON_"+sub.toUpperCase(), a.name);
          R("🧩 "+a.label+" is "+(a.enabled ? "on" : "off")+"."); syncCompanions(true); break;
        }
        R(addonsText(args[0])); break;
      }

      case "help": case "commands": case "info": case "guide":
        R(helpFor(sender, args[0]));
        if (!args[0] && isStaff(sender)) later(()=>reply(sender,TEXT.staffhelp,replyCh),2200);
        break;
      case "staffhelp": R(TEXT.staffhelp); break;
      case "rules":   R(fill(TEXT.rules,sender)); break;
      case "consent": R(fill(TEXT.consent,sender)); break;
      case "tour":
        if (String(args[0]||"").toLowerCase() === "stop"){ state.tours.delete(sender); R("Tour's over, sweetie! Come back and look around any time."); break; }
        if (charFor(sender) && (L.life.tour||[]).length && runTour(sender)) break;
        R(fill(TEXT.tour,sender)); break;
      case "drain": {
        // staff: ?drain <who> [hole] — pump 'em out on the spot
        const t = resolveTarget(args[0]);
        if (!t || !rec(t)){ R("Here's how, sugar: ?drain <who> empties everything they're holdin', or ?drain <who> butt just that hole. For example: ?drain Bessie"); break; }
        const hs = args[1] ? holesFrom(args[1]) : HOLES;
        if (!hs){ R("Which hole, hon? vulva, butt or mouth, or leave it out for all of 'em."); break; }
        const p = prodOf(t);
        if (p.tieUntil > Date.now()){ R("Not while "+plainName(t)+" is still knotted, sugar! Wait for "+plainName(p.tiedTo)+"'s knot to go down."); break; }
        prodTick();
        let out = 0; for (const h of hs){ out += p.held[h]||0; p.held[h] = 0; }
        if (out < 1){ R(plainName(t)+" isn't holdin' anything to drain, hon."); break; }
        if (p.pin && !sizePinned(t)) p.pin = null;
        saveLedger(); audit(sender, "DRAIN", t+" "+Math.round(out));
        if (charFor(t)) emote("🪣 "+plainName(sender)+" presses down on "+plainName(t)+"'s belly and pumps 'em out: "+ml(out)+" of seed gushes into the bucket, splashin' everywhere. What a beautiful mess.");
        else R("🪣 Drained "+ml(out)+" out of "+plainName(t)+".");
        break;
      }

      case "denial": {
        // staff: ?denial <stud> <hours> · ?denial <stud> off
        const t = resolveTarget(args[0]);
        if (!t || !rec(t)){ R("Here's how, sugar: ?denial <stud> <hours> stops 'em fillin' anybody that long (and they come out of it pent up). ?denial <stud> off lets 'em go early. For example: ?denial Rex 6"); break; }
        const p = prodOf(t);
        if (/^(off|stop|end|no)$/i.test(args[1]||"")){ p.deniedUntil = 0; saveLedger(); R("🔓 "+plainName(t)+" is off denial."); tell(t, "🔓 You're off denial, sugar. Go on."); break; }
        const h = parseFloat(args[1]);
        if (!(h > 0 && h <= 168)){ R("How many hours, hon? 1 to 168. For example: ?denial "+plainName(t)+" 6"); break; }
        p.deniedUntil = Date.now() + h*3600000;
        saveLedger(); audit(sender, "DENIAL", t+" "+h+"h");
        if (charFor(t)) emote("🚫 "+plainName(sender)+" taps "+plainName(t)+" right where it aches: no fillin' anybody for "+h+" hours. Every drop stays in, sugar.");
        R("🚫 "+plainName(t)+" is denied for "+h+" hours. When it's up they'll be pent up for sure.");
        break;
      }

      case "ruin": {
        // staff: ?ruin <stud> — waste a load
        const t = resolveTarget(args[0]);
        if (!t || !rec(t) || !makesSemen(t)){ R("Whose load are we ruinin', sugar? ?ruin <stud>, somebody who makes semen. For example: ?ruin Rex"); break; }
        if (!onMap(t)){ R(plainName(t)+" needs to be here on the map for that, hon."); break; }
        prodTick();
        const p = prodOf(t), lost = p.semen * CFG.PROD.LOAD_SHARE;
        if (lost < 1){ R(plainName(t)+" is already drained dry, sugar."); break; }
        p.semen -= lost; p.pentUp = false; p.semenFullSince = 0;
        saveLedger(); audit(sender, "RUIN", t+" "+Math.round(lost));
        emote("😈 "+plainName(sender)+" takes "+plainName(t)+" right to the edge, then lets go at the last second. "+ml(lost)+" dribbles out, wasted on the hay, and "+plainName(t)+" whimpers for it. Ruined.");
        break;
      }

      case "jars": {
        L.jars = (L.jars||[]).filter(j => Date.now() - j.t < CFG.JAR_DAYS*86400000);
        R(L.jars.length ? "🫙 SEED JARS\n"+L.jars.map(j => "#"+j.id+": "+ml(j.ml)+" of "+plainName(j.stud)+"'s, bottled "+new Date(j.t).toLocaleString()).join("\n")+
                          "\n?inseminate <who> <jar> [hole] asks them, and uses one on their yes." : "🫙 No seed jars on the shelf, hon. ?collect a stud to bottle some.");
        break;
      }

      case "inseminate": {
        // staff: ?inseminate <who> <jar#> [hole]
        const t = resolveTarget(args[0]);
        L.jars = (L.jars||[]).filter(j => Date.now() - j.t < CFG.JAR_DAYS*86400000);
        const jar = L.jars.find(j => String(j.id) === String(args[1]||"").replace(/^#/,""));
        const hole = args[2] ? holeFrom(args[2]) : "vulva";
        if (!t || !jar || !hole){ R("Here's how, sugar: ?inseminate <who> <jar number> [hole]. ?jars shows what's on the shelf. They always get asked first. For example: ?inseminate Bessie 3"); break; }
        if (!jarOk(t)){ R(plainName(t)+" has said never to jar insemination, sugar (?jarok off). That's their call, so I won't even ask."); break; }
        const err = inseminateProblem(t, jar, hole);
        if (err){ R(err); break; }
        if (t === sender){ inseminate(sender, t, jar.id, hole); break; }   // doin' yourself needs no askin'
        askJar(sender, t, jar.id, hole);
        R("💉 I've asked "+plainName(t)+" first, sugar. If they say yes, I'll do it right then. If they say no, please leave it be.");
        break;
      }

      case "contract": case "contracts": {
        // staff look · herdmasters offer and release · proprietors write the templates
        contractsLedger();
        const sub = String(args[0]||"list").toLowerCase(), name = String(args[1]||"").toLowerCase();
        const owner = isProprietor(sender), boss = isHerdmaster(sender);
        const needOwner = () => { R("Writin' farm contracts is for the proprietors, sugar."); return false; };
        const tplFor = (n) => L.contractTemplates[n];
        switch (sub){
          case "list": {
            const saved = Object.keys(L.contractTemplates);
            const live = L.contracts.filter(x => x.status === "signed" || x.status === "offered" || x.status === "releasing");
            R("📜 FARM CONTRACTS\nReady-made: fun · deep · nhl"+(saved.length ? "\nYours: "+saved.join(" · ") : "")+
              "\n\nIN FORCE OR OFFERED\n"+(live.length ? live.map(contractLine).join("\n") : "  none right now")+
              "\n\n?contract show <name> [who] · ?contract offer <name> <who> <1h|12h|1d|1w|2w|1m|perm> · ?contract release <who> · ?contract check <who>"+
              (owner ? "\n?contract new <name> [from fun|deep|nhl] · add · set · remove · title · terms · policy · delete · ?contract rules" : ""));
            break;
          }
          case "show": {
            const tpl = contractTemplate(name);
            if (!tpl){ R("There's no contract called '"+name+"', hon. ?contract list shows them."); break; }
            const who = args[2] ? resolveTarget(args[2]) : sender;
            const c = buildContract(tpl, who || sender, "1w");
            const problems = BCPLUS.checkContract(c);
            R(describeContract(c)+"\n\n"+(problems.length ? "⚠️ BC+ wouldn't take it yet:\n• "+problems.join("\n• ") : "✅ BC+ "+BCPLUS.BCPLUS_VERSION+" will take this one as it is."));
            break;
          }
          case "offer": {
            if (!boss){ R("Offerin' contracts is for herdmasters and proprietors, sugar."); break; }
            const t = resolveTarget(args[2]);
            if (!name || !t || !args[3]){ R("Here's how, sugar: ?contract offer <contract> <who> <how long>. How long is 1h, 12h, 1d, 1w, 2w, 1m or perm. For example: ?contract offer deep Bessie 1w"); break; }
            const err = offerContract(sender, name, t, args.slice(3).join(" "));
            R(err || "📜 Offered to "+plainName(t)+"! It's on their BC+ Contracts page now. I'll tell you when they sign.");
            break;
          }
          case "release": case "cancel": {
            if (!boss){ R("Only herdmasters and proprietors can release a farm contract, sugar. I've told 'em you asked."); notifyStaff("📜 "+plainName(sender)+" asks for a farm contract release: "+rest, true); break; }
            const t = resolveTarget(args[1]);
            if (!t){ R("Release whose, sugar? ?contract release <who> [title]"); break; }
            const err = releaseContract(sender, t, args.slice(2).join(" ") || null);
            R(err || "📜 Released! BC+ is puttin' "+plainName(t)+"'s rules back how they were.");
            break;
          }
          case "check": {
            const t = resolveTarget(args[1]);
            if (!t || !charFor(t)){ R("They need to be here in the room for me to ask their BC+, hon."); break; }
            enqueue(BCPLUS.queryMsg(t));
            R("📜 Askin' "+plainName(t)+"'s BC+ what farm contracts they hold…");
            later(() => { const mine = L.contracts.filter(x => x.mn === t && x.status !== "declined"); reply(sender, mine.length ? "📜 "+mine.map(contractLine).join("\n") : plainName(t)+" holds no farm contracts.", replyCh); }, 4000);
            break;
          }
          case "rules": case "rule": {
            if (sub === "rule" || BCPLUS.RULES.has(name)){
              const def = BCPLUS.RULES.get(name);
              if (!def){ R("BC+ has no rule called '"+name+"', sugar. ?contract rules lists them."); break; }
              R("📘 "+def.name+" ("+def.id+") · "+def.category+"\n"+def.description+
                (def.settings.length ? "\n\nSETTINGS\n"+def.settings.map(s => "  "+s.name+" · "+s.type+(s.options ? ": "+s.options.join(" / ") : "")+" · default "+JSON.stringify(s.default)).join("\n") : "\n\nNo settings.")+
                (BCPLUS.NEVER[def.id] ? "\n\n🚫 The farm never uses this one: it "+BCPLUS.NEVER[def.id]+"." : ""));
              break;
            }
            const cats = {};
            for (const d of BCPLUS.RULES.values()) if (!name || d.category.toLowerCase() === name) (cats[d.category] = cats[d.category] || []).push(d.id+(BCPLUS.NEVER[d.id] ? " 🚫" : ""));
            R("📘 BC+ "+BCPLUS.BCPLUS_VERSION+" RULES"+(name ? " · "+name : "")+"\n"+Object.entries(cats).map(([c, ids]) => c+": "+ids.join(", ")).join("\n")+"\n\n?contract rule <id> shows its settings.");
            break;
          }
          case "new": {
            if (!owner){ needOwner(); break; }
            if (!/^[a-z][a-z0-9_-]{1,19}$/.test(name) || BCPLUS.depthFrom(name) && ["fun","deep","nhl"].includes(name)){ R("Give it a one-word name, sugar (2 to 20 letters or numbers, not fun, deep or nhl). For example: ?contract new prizecow from deep"); break; }
            const base = String(args[2]||"").toLowerCase() === "from" ? (BCPLUS.depthFrom(args[3]||"") || {}).key || null : null;
            L.contractTemplates[name] = { title: "B&B Farm · "+name, terms: base ? DEFAULT_TERMS[base] : "", base, add: {}, remove: [], by: sender, at: Date.now() };
            saveLedger(); audit(sender, "CONTRACT_NEW", name);
            R("📜 Made '"+name+"'"+(base ? " from "+base : " (empty)")+". Now ?contract add "+name+" <rule> key=value…, ?contract title "+name+" <text>, ?contract terms "+name+" <text>, then ?contract show "+name+".");
            break;
          }
          case "add": case "set": {
            if (!owner){ needOwner(); break; }
            const tpl = tplFor(name), id = String(args[2]||"");
            if (!tpl){ R("There's no saved contract called '"+name+"', sugar. ?contract new "+name+" makes one."); break; }
            const def = BCPLUS.RULES.get(id);
            if (!def){ R("BC+ has no rule called '"+id+"', sugar. ?contract rules lists them all."); break; }
            if (BCPLUS.NEVER[id]){ R("🚫 The farm never puts "+def.name+" in a contract, hon: it "+BCPLUS.NEVER[id]+"."); break; }
            const pairs = parsePairs(args.slice(3).join(" ")), set = Object.assign({}, tpl.add[id] || {}), bad = [];
            for (const [k, v] of Object.entries(pairs)){
              const s = def.settings.find(x => x.name.toLowerCase() === k.toLowerCase());
              if (!s){ bad.push(k+": no such setting (it has "+(def.settings.map(x => x.name).join(", ") || "none")+")"); continue; }
              const got = settingValue(s, v);
              if (got.err) bad.push(s.name+": "+got.err); else set[s.name] = got.value;
            }
            if (bad.length){ R("Not saved, sugar:\n• "+bad.join("\n• ")); break; }
            tpl.add[id] = set; tpl.remove = (tpl.remove||[]).filter(x => x !== id);
            saveLedger(); audit(sender, "CONTRACT_EDIT", name+" +"+id);
            R("📜 "+def.name+" is in '"+name+"'"+(Object.keys(set).length ? " ("+Object.entries(set).map(([k,v]) => k+"="+(Array.isArray(v) ? v.join("|") : v)).join(" ")+")" : "")+".");
            break;
          }
          case "remove": {
            if (!owner){ needOwner(); break; }
            const tpl = tplFor(name), id = String(args[2]||"");
            if (!tpl){ R("There's no saved contract called '"+name+"', sugar."); break; }
            delete tpl.add[id]; if (!tpl.remove.includes(id)) tpl.remove.push(id);
            saveLedger(); R("📜 Took "+id+" out of '"+name+"'.");
            break;
          }
          case "title": case "terms": {
            if (!owner){ needOwner(); break; }
            const tpl = tplFor(name), text = args.slice(2).join(" ");
            if (!tpl || !text){ R("Here's how: ?contract "+sub+" <name> <text>. %name% becomes their name in the terms."); break; }
            if (sub === "title" && text.length > BCPLUS.LIMITS.TITLE){ R("Titles can be "+BCPLUS.LIMITS.TITLE+" characters at most in BC+, sugar."); break; }
            if (sub === "terms" && text.length > BCPLUS.LIMITS.TERMS){ R("Terms can be "+BCPLUS.LIMITS.TERMS+" characters at most in BC+, sugar."); break; }
            tpl[sub] = text; saveLedger(); R("📜 Saved the "+sub+" for '"+name+"'.");
            break;
          }
          case "policy": {
            if (!owner){ needOwner(); break; }
            const tpl = tplFor(name), v = String(args[2]||"").toLowerCase();
            if (!tpl || !/^(farm|author|either)$/.test(v)){ R("Here's how: ?contract policy <name> farm (only the farm ends it early) or either (they can end it too)."); break; }
            tpl.policy = v === "either" ? "either" : "author"; saveLedger(); R("📜 '"+name+"' can be ended early by "+(tpl.policy === "either" ? "either side" : "the farm only")+".");
            break;
          }
          case "outfit": {
            if (!owner){ needOwner(); break; }
            const tpl = tplFor(name), how = args.slice(2);
            if (!tpl || !how.length){ R("Here's how: ?contract outfit <name> auto (theirs, by species and gender) · none · or a slot, like cow female, any femboy, stock, luxury."); break; }
            const v = String(how[0]).toLowerCase();
            tpl.outfit = v === "auto" ? "auto" : v === "none" ? "" : outfitSlotFrom(how);
            if (tpl.outfit === null){ R("I don't know that outfit slot, sugar. ?outfit lists them."); break; }
            saveLedger(); R("📜 When somebody signs '"+name+"', they'll be offered "+(tpl.outfit === "auto" ? "their own outfit (by species and gender)" : tpl.outfit ? slotLabel(tpl.outfit) : "no outfit")+".");
            break;
          }
          case "delete": {
            if (!owner){ needOwner(); break; }
            if (!tplFor(name)){ R("There's no saved contract called '"+name+"', sugar."); break; }
            delete L.contractTemplates[name]; saveLedger(); audit(sender, "CONTRACT_DELETE", name); R("📜 Deleted '"+name+"'. Contracts already signed keep goin' till they end.");
            break;
          }
          default: R("?contract list · show · offer · release · check · rules"+(owner ? " · new · add · set · remove · title · terms · policy · delete" : ""));
        }
        break;
      }

      case "outfit": case "outfits": case "uniform": {
        // ?outfit · ?outfit offer <who> [slot] · ?outfit back · proprietors: ?outfit clear <slot> · ?outfit keys … · ?outfit rule …
        outfitsLedger();
        const sub = String(args[0]||"").toLowerCase();
        if (!sub || sub === "list"){
          const ks = Object.keys(L.outfits);
          R("👗 FARM OUTFITS\n"+(ks.length ? ks.map(k => "  "+slotLabel(k)+" · "+L.outfits[k].items+" pieces"+(L.outfits[k].locks ? ", "+L.outfits[k].locks+" locked" : "")).join("\n") : "  none saved yet")+
            "\n\nKeys to farm locks: "+({ staff:"farm staff + their herd leader", leader:"their herd leader", owners:"the proprietors" }[L.outfitRules.keys])+
            "\nOffered on approval: "+(L.outfitRules.onApprove?"yes":"no")+" · uniforms at clock-in: "+(L.outfitRules.onClockIn?"yes":"no")+" · change back at clock-out: "+(L.outfitRules.changeBack?"yes":"no")+
            "\n\nProprietors save outfits from the Companion's Dashboard. ?outfit offer <who> [slot] hands one over.");
          break;
        }
        if (sub === "back"){ if (!hasCompanion(sender)){ R("That needs the Companion, sugar: it's the one keepin' your own clothes."); break; } enqueue(makeMsg("outfitBack", { why: "you asked" }, sender)); break; }
        if (sub === "offer"){
          if (!isStaff(sender)){ R("Handin' out outfits is for staff, sugar."); break; }
          const t = resolveTarget(args[1]);
          if (!t || !rec(t)){ R("Offer to who, sugar? ?outfit offer <who> [slot]. Leave the slot off and I'll pick theirs by species and gender."); break; }
          const slot = args.length > 2 ? outfitSlotFrom(args.slice(2)) : (rec(t).roles.some(x => [ROLE.FARMHAND, ROLE.MANDATED, ROLE.HERDMASTER, ROLE.PROPRIETOR].includes(x)) && clockedIn(t) ? uniformSlotFor(t) : outfitSlotFor(t));
          const err = offerOutfit(t, slot, "From "+plainName(sender));
          R(err || "👗 Offered "+plainName(t)+" "+slotLabel(slot)+". They'll say yes or not now on their own screen.");
          break;
        }
        if (!isProprietor(sender)){ R("That one's for the proprietors, sugar. ?outfit shows what's saved."); break; }
        if (sub === "clear"){
          const slot = outfitSlotFrom(args.slice(1));
          if (!slot || !L.outfits[slot]){ R("There's no outfit saved there, sugar."); break; }
          delete L.outfits[slot]; saveLedger(); audit(sender, "OUTFIT_CLEAR", slot); R("👗 Cleared "+slotLabel(slot)+"."); syncCompanions(true);
          break;
        }
        if (sub === "keys"){
          const v = String(args[1]||"").toLowerCase();
          if (!["staff","leader","owners"].includes(v)){ R("Who holds the keys to farm locks? ?outfit keys staff (farm staff + their herd leader), leader (their herd leader only) or owners (proprietors only)."); break; }
          L.outfitRules.keys = v; saveLedger(); R("🔒 Farm locks open for: "+({ staff:"farm staff + their herd leader", leader:"their herd leader", owners:"the proprietors" }[v])+"."); syncCompanions(true);
          break;
        }
        if (sub === "rule"){
          const k = { onapprove:"onApprove", approve:"onApprove", onclockin:"onClockIn", clockin:"onClockIn", changeback:"changeBack", clockout:"changeBack" }[String(args[1]||"").toLowerCase()];
          const v = String(args[2]||"").toLowerCase();
          if (!k || !["on","off"].includes(v)){ R("?outfit rule approve on|off · clockin on|off · changeback on|off"); break; }
          L.outfitRules[k] = v === "on"; saveLedger(); R("👗 Got it."); syncCompanions(true);
          break;
        }
        R("?outfit · ?outfit offer <who> [slot] · ?outfit back · ?outfit clear <slot> · ?outfit keys staff|leader|owners · ?outfit rule approve|clockin|changeback on|off");
        break;
      }

      case "zone": case "zones": {
        // staff: ?zone (list) · ?zone who · herdmasters: ?zone a|b <name> · ?zone pair <name> <group> · ?zone unpair <name> · ?zone clear <name>
        zonesLedger();
        const sub = String(args[0]||"").toLowerCase(), name = String(args[1]||"").toLowerCase();
        if (!sub || sub === "list"){
          const ks = Object.keys(L.zones);
          R("🗺️ ZONES\n"+(ks.length ? ks.map(n => "  "+zoneText(n, L.zones[n])).join("\n") : "  none yet")+
            "\n\nHerdmasters: stand on a corner and ?zone a <name>, the opposite corner and ?zone b <name>. ?zone pair <name> <group> joins boxes into one place. ?zone who shows who's where.");
          break;
        }
        if (sub === "who"){
          const here = (W.ChatRoomCharacter||[]).filter(c => c.MemberNumber !== CFG.BOT_MEMBER && rec(c.MemberNumber));
          const by = {};
          for (const c of here){ const w = whereName(c.MemberNumber) || "out in the open"; (by[w] = by[w] || []).push(plainName(c.MemberNumber)); }
          R("🗺️ WHO'S WHERE\n"+(Object.keys(by).length ? Object.entries(by).map(([w, ns]) => "  "+w+": "+ns.join(", ")).join("\n") : "  nobody on the books is here"));
          break;
        }
        if (!isHerdmaster(sender)){ R("Settin' zones is for herdmasters and proprietors, sugar. ?zone shows them."); break; }
        if (!/^[a-z][a-z0-9_-]{1,19}$/.test(name)){ R("Give the zone a one-word name, sugar, like ?zone a barn-1."); break; }
        if (sub === "box"){
          // ?zone box <name> <ax> <ay> <bx> <by>: both corners at once (the Companion's map clicks send this)
          const n = args.slice(2, 6).map(v => parseInt(v, 10)), wide = W.ChatRoomMapViewWidth || 40, high = W.ChatRoomMapViewHeight || 40;
          if (n.length < 4 || n.some((v, i) => !(v >= 0 && v < (i % 2 ? high : wide)))){ R("I need two corners on the map, sugar: ?zone box "+name+" <ax> <ay> <bx> <by>."); break; }
          const z = L.zones[name] = L.zones[name] || { group: name };
          z.a = { X: n[0], Y: n[1] }; z.b = { X: n[2], Y: n[3] }; saveLedger(); audit(sender, "ZONE_SET", name+" box");
          R("🗺️ "+zoneText(name, z));
          break;
        }
        if (sub === "a" || sub === "b"){
          const C = charFor(sender), p = C && C.MapData && C.MapData.Pos;
          if (!p){ R("Step onto the map first, hon, so I can see where you're standin'."); break; }
          const z = L.zones[name] = L.zones[name] || { group: name };
          z[sub] = { X: p.X, Y: p.Y }; saveLedger(); audit(sender, "ZONE_SET", name+" "+sub+" "+p.X+","+p.Y);
          R("🗺️ "+zoneText(name, z)+(z.a && z.b ? "" : "\nNow stand on the opposite corner and ?zone "+(sub === "a" ? "b" : "a")+" "+name+"."));
          break;
        }
        const z = L.zones[name];
        if (!z){ R("There's no zone called '"+name+"', sugar."); break; }
        if (sub === "pair"){
          const g = String(args[2]||"").toLowerCase();
          if (!/^[a-z][a-z0-9_-]{1,19}$/.test(g)){ R("Pair it into which place, hon? ?zone pair "+name+" barn"); break; }
          z.group = g; saveLedger(); R("🗺️ "+name+" is part of "+g+" now. Everything in a group counts as one place.");
          break;
        }
        if (sub === "unpair"){ z.group = name; saveLedger(); R("🗺️ "+name+" stands on its own again."); break; }
        if (sub === "clear"){ delete L.zones[name]; saveLedger(); audit(sender, "ZONE_CLEAR", name); R("🗺️ Cleared "+name+"."); break; }
        R("?zone · ?zone who · ?zone a|b <name> · ?zone pair <name> <group> · ?zone unpair <name> · ?zone clear <name>");
        break;
      }

      case "hypno": {
        const r = rec(sender);
        if (!r || !r.roles.length){ R("That's just for folks on the books, sugar."); break; }
        const v = String(args[0]||"").toLowerCase();
        if (v && !["on","off"].includes(v)){ R("?hypno on lets your herd leader's voice lines reach you · ?hypno off stops them."); break; }
        r.hypno = v ? v === "on" : !r.hypno; saveLedger(); audit(sender, "HYPNO", r.hypno ? "on" : "off");
        R(r.hypno ? "🌀 Hypno: ON. If your herd leader sets voice lines for you, they'll drift in now and then, just for you. ?hypno off stops them any time."
                  : "🌀 Hypno: off. No voice lines will reach you.");
        break;
      }

      case "voice": {
        // herd leaders: ?voice · ?voice on|off herd|<who> · ?voice add herd|<who> <line> · ?voice remove herd|<who> <n> · ?voice every herd|<who> 5|15|30|chores
        voiceLedger();
        const sub = String(args[0]||"").toLowerCase(), who = String(args[1]||"").toLowerCase();
        const key = who === "herd" ? "herd" : resolveTarget(args[1]);
        const slotOf = (k) => k === "herd" ? (L.voice.herd[sender] = L.voice.herd[sender] || { on:false, lines:[], every:"15" })
                                           : (L.voice.member[k] = L.voice.member[k] || { on:false, lines:[], every:"15", by: sender });
        if (!sub){
          const h = L.voice.herd[sender], mine = Object.entries(L.voice.member).filter(([m, v]) => v.by === sender || herdLeaderOf(+m) === sender);
          R("🌀 LISTEN TO MY VOICE\nYour herd: "+(h ? (h.on ? "on" : "off")+" · "+h.lines.length+" lines · every "+h.every : "not set")+
            (mine.length ? "\n"+mine.map(([m, v]) => plainName(+m)+": "+(v.on ? "on" : "off")+" · "+v.lines.length+" lines · every "+v.every+(rec(+m) && rec(+m).hypno ? "" : " (they haven't said ?hypno on)")).join("\n") : "")+
            "\n\n?voice add herd|<who> <line> · ?voice on|off herd|<who> · ?voice list herd|<who> · ?voice remove herd|<who> <n> · ?voice every herd|<who> 5|15|30|chores");
          break;
        }
        if (!key){ R("For your herd or who, sugar? ?voice "+sub+" herd … or ?voice "+sub+" <name> …"); break; }
        if (!canVoice(sender, key)){ R(key === "herd" ? "You need a herd of your own for that, hon." : "Only "+plainName(key)+"'s herd leader (or a proprietor) can set their voice, sugar."); break; }
        const v = slotOf(key), label = key === "herd" ? "your herd" : plainName(key);
        if (sub === "on" || sub === "off"){ v.on = sub === "on"; saveLedger(); audit(sender, "VOICE_"+sub.toUpperCase(), String(key)); R("🌀 Voice for "+label+": "+sub+"."+(sub === "on" && key !== "herd" && !(rec(key)||{}).hypno ? " (They still have to say ?hypno on before any reach 'em.)" : "")); break; }
        if (sub === "add"){
          const line = args.slice(2).join(" ").trim();
          if (!line || line.length > 200){ R("Give me a line up to 200 characters, sugar. %name% becomes their name."); break; }
          if (v.lines.length >= 30){ R("That's 30 lines already, hon. Take one out first."); break; }
          v.lines.push(line); saveLedger(); R("🌀 Added for "+label+" ("+v.lines.length+" lines)."+(v.on ? "" : " It's off right now: ?voice on "+(key === "herd" ? "herd" : args[1])));
          break;
        }
        if (sub === "list"){ R("🌀 "+label+" ("+(v.on ? "on" : "off")+", every "+v.every+")\n"+(v.lines.length ? v.lines.map((l, i) => (i+1)+". "+l).join("\n") : "no lines yet")); break; }
        if (sub === "remove"){
          const i = parseInt(args[2], 10) - 1;
          if (!(i >= 0 && i < v.lines.length)){ R("Which number, hon? ?voice list "+(key === "herd" ? "herd" : args[1])+" shows them."); break; }
          v.lines.splice(i, 1); saveLedger(); R("🌀 Took that one out.");
          break;
        }
        if (sub === "every"){
          const e = String(args[2]||"").toLowerCase();
          if (!["5","15","30","chores"].includes(e)){ R("How often, sugar? 5, 15 or 30 (minutes), or chores (only while they're workin' or bein' milked)."); break; }
          v.every = e; saveLedger(); R("🌀 "+label+": "+(e === "chores" ? "only during chores and milkin'" : "about every "+e+" minutes")+".");
          break;
        }
        R("?voice · on|off · add · list · remove · every");
        break;
      }

      case "machine": {
        // staff: ?machine load <who> <jar> [hole] · ?machine unload <who> · ?machine (what's runnin')
        state.machineLoads = state.machineLoads || new Map();
        const sub = String(args[0]||"").toLowerCase();
        if (!sub){
          const on = (W.ChatRoomCharacter||[]).map(c => c.MemberNumber).filter(m => rec(m) && gearOf(m).machine);
          R("⚙️ MACHINES\n"+(on.length ? on.map(m => { const g = gearOf(m).machine, l = state.machineLoads.get(m);
              return "  "+plainName(m)+" · "+g.name+" · "+(g.intensity < 0 ? "off" : "intensity "+g.intensity)+(l ? " · jar #"+l.jar+" loaded" : ""); }).join("\n") : "  nobody's on one")+
            "\n\n?machine load <who> <jar> [hole] asks them first, then the machine empties it into 'em while it runs.");
          break;
        }
        const t = resolveTarget(args[1]);
        if (sub === "unload"){ if (t && state.machineLoads.delete(t)) R("⚙️ Unloaded."); else R("Nothin' loaded for them, hon."); break; }
        if (sub !== "load"){ R("?machine · ?machine load <who> <jar> [hole] · ?machine unload <who>"); break; }
        L.jars = (L.jars||[]).filter(j => Date.now() - j.t < CFG.JAR_DAYS*86400000);
        const jar = L.jars.find(j => String(j.id) === String(args[2]||"").replace(/^#/,""));
        const hole = args[3] ? holeFrom(args[3]) : "vulva";
        if (!t || !jar || !hole){ R("Here's how, sugar: ?machine load <who> <jar number> [hole]. ?jars shows the shelf."); break; }
        if (!gearOf(t).machine){ R(plainName(t)+" isn't on a fuck machine or a Sybian, hon."); break; }
        if (!jarOk(t)){ R(plainName(t)+" has said never to jar insemination (?jarok off), so I won't even ask."); break; }
        const err = inseminateProblem(t, jar, hole);
        if (err){ R(err); break; }
        askJar(sender, t, jar.id, hole, true);
        R("⚙️ I've asked "+plainName(t)+" first. On their yes it's loaded, and the machine does the rest.");
        break;
      }

      case "jarok": {
        const r = rec(sender);
        if (!r || !r.roles.length){ R("That's just for folks on the books, sugar. Say ?apply first!"); break; }
        const v = String(args[0]||"").toLowerCase();
        if (v && !["on","off","yes","no"].includes(v)){ R("Just say ?jarok on or ?jarok off, sweetie. Leave it blank and it flips."); break; }
        const on = v ? (v === "on" || v === "yes") : r.jarok === false;
        if (on && limitBlocks(sender, "breed")){ R("Your hard limits rule that out, sugar, so I'll keep it off. If you want it, change your limits with staff first."); break; }
        r.jarok = on;
        if (!on) state.jarAsks.delete(sender);
        saveLedger(); audit(sender, "JAROK", on ? "on" : "off");
        R(on ? "💉 Jar insemination: ON. Staff still have to ask you every single time, and no is always a fine answer."
             : "💉 Jar insemination: OFF. Nobody puts a jar in you, and staff can't even ask. ?jarok on turns it back on.");
        break;
      }

      case "rights": {
        // ?rights <who> asks for breedin' rights · ?rights off ends yours · ?rights shows them
        const now = Date.now(), r = rec(sender);
        if (!r || !r.roles.length){ R("You need to be on the books first, sugar. Say ?apply!"); break; }
        if (!args.length){
          const mine = r.rights && r.rights.until > now ? "Only "+[r.rights.stud].concat(r.rights.allow||[]).map(plainName).join(" or ")+" can take you till "+new Date(r.rights.until).toLocaleDateString()+"." : "Nobody holds breedin' rights on you.";
          const held = Object.entries(L.people).filter(([,x]) => x.rights && x.rights.stud === sender && x.rights.until > now).map(([m]) => plainName(parseInt(m,10)));
          R("🔏 "+mine+(held.length ? " You hold rights on "+held.join(", ")+"." : "")+" ?rights <who> asks for theirs (they say ?accept), and ?rights off ends rights on you."); break;
        }
        if (/^(off|end|stop|clear)$/i.test(args[0])){
          const who = args[1] ? resolveTarget(args[1]) : sender, rw = who && rec(who);
          if (!rw || !rw.rights){ R("No breedin' rights to end there, hon."); break; }
          if (who !== sender && rw.rights.stud !== sender && !isStaff(sender)){ R("That's not yours to end, sugar."); break; }
          const was = rw.rights.stud; rw.rights = null; saveLedger();
          R("🔓 Breedin' rights ended: "+plainName(who)+" can catch from anybody again."); if (was !== sender) tell(was, "🔓 Your breedin' rights on "+plainName(who)+" have ended, sugar.");
          break;
        }
        const t = resolveTarget(args[0]);
        if (!t || t === sender || !rec(t)){ R("Who're you askin' for, sugar? ?rights <who> [days], like ?rights Bessie 14. They'll need to say ?accept."); break; }
        const rt = rec(t), held = rt.rights && rt.rights.until > now ? rt.rights : null;
        const sub = String(args[1]||"").toLowerCase();
        // the holder (or staff) tweaks the terms: ?rights <who> allow|disallow <stud> · ?rights <who> days <n>
        if (held && ["allow","disallow","unallow","days"].includes(sub)){
          if (held.stud !== sender && !isStaff(sender)){ R("Only "+plainName(held.stud)+" (or staff) can change those rights, sugar."); break; }
          if (sub === "days"){
            const d = parseFloat(args[2]);
            if (!(d > 0 && d <= CFG.RIGHTS_MAX_DAYS)){ R("How many days from now, hon? 1 to "+CFG.RIGHTS_MAX_DAYS+". For example: ?rights "+plainName(t)+" days 14"); break; }
            held.until = now + d*86400000; saveLedger();
            R("🔏 "+plainName(held.stud)+"'s rights on "+plainName(t)+" now run "+d+" more day(s), till "+new Date(held.until).toLocaleDateString()+".");
            tell(t, "🔏 Your breedin' rights to "+plainName(held.stud)+" now run till "+new Date(held.until).toLocaleDateString()+", sugar.");
            break;
          }
          const o = resolveTarget(args[2]);
          if (!o || !rec(o)){ R("Which stud, sugar? ?rights "+plainName(t)+" "+sub+" <stud>, like ?rights "+plainName(t)+" allow Rex."); break; }
          held.allow = (held.allow||[]).filter(x => x !== o);
          if (sub === "allow") held.allow.push(o);
          saveLedger();
          R("🔏 "+(sub === "allow" ? plainName(o)+"'s loads can take "+plainName(t)+" too now." : plainName(o)+" is off "+plainName(t)+"'s list.")+
            " Allowed: "+[held.stud].concat(held.allow).map(plainName).join(", ")+".");
          tell(t, "🔏 "+(sub === "allow" ? plainName(held.stud)+" is lettin' "+plainName(o)+" breed you too, sugar." : plainName(o)+" can't catch you anymore, hon."));
          break;
        }
        if (!makesSemen(sender)){ R("Breedin' rights are for studs, hon. You'd need a penis (or ?futa on)."); break; }
        const days = args[1] ? parseFloat(args[1]) : CFG.RIGHTS_DAYS;
        if (!(days > 0 && days <= CFG.RIGHTS_MAX_DAYS)){ R("How many days, sugar? 1 to "+CFG.RIGHTS_MAX_DAYS+", or leave it out for "+CFG.RIGHTS_DAYS+". For example: ?rights "+plainName(t)+" 14"); break; }
        state.rightsAsk = state.rightsAsk || new Map();
        state.rightsAsk.set(t, { stud:sender, at:now, days });
        tell(t, "🔏 "+plainName(sender)+" is askin' for breedin' rights on you, sugar: for "+days+" day(s) only their loads could take (they can let other studs in too). Say ?accept to say yes, or just ignore it.");
        R("🔏 I asked "+plainName(t)+" for you. If they say ?accept in the next 10 minutes, the rights are yours for "+days+" day(s). "+
          "Then ?rights "+plainName(t)+" allow <stud> lets another stud in, and ?rights "+plainName(t)+" days <n> changes how long.");
        break;
      }

      case "accept": {
        const ask = state.rightsAsk && state.rightsAsk.get(sender);
        if (!ask || Date.now() - ask.at > 600000){ R("There's nothin' waitin' on your yes right now, sugar."); break; }
        state.rightsAsk.delete(sender);
        const r = rec(sender); r.rights = { stud:ask.stud, until:Date.now() + (ask.days||CFG.RIGHTS_DAYS)*86400000, since:Date.now(), allow:[] };
        saveLedger(); audit(sender, "RIGHTS", ask.stud+"");
        if (onMap(sender) && onMap(ask.stud)) emote("🔏 "+plainName(sender)+" gives "+plainName(ask.stud)+" breedin' rights for "+(ask.days||CFG.RIGHTS_DAYS)+" day(s). Only "+plainName(ask.stud)+"'s seed can take 'em now. Everybody else is just for fun.");
        else { tell(ask.stud, "🔏 "+plainName(sender)+" said yes! You hold their breedin' rights for "+(ask.days||CFG.RIGHTS_DAYS)+" day(s)."); }
        R("🔏 Done, sugar. For "+(ask.days||CFG.RIGHTS_DAYS)+" day(s) only "+plainName(ask.stud)+"'s loads can take you. ?rights off ends it any time.");
        break;
      }

      case "penis": case "cock": {
        // ?penis → yours · ?penis types · ?penis <type> · staff: ?penis <who> <type> [knotted|unknotted]
        const types = Object.keys(CFG.PENIS_TYPES);
        const help = "Types: "+types.map(k => CFG.PENIS_TYPES[k].label === k ? k : k+" ("+CFG.PENIS_TYPES[k].label+")").join(", ")+
                     ". Set yours with ?penis <type>, like ?penis equine. Any of 'em can carry a knot: a crafted shot with \"knotting\" gives one (canine comes knotted). "+
                     "Shots with canine, equine, feline (or barbed), draconic, double cock or humanizer change the type.";
        let t = sender, a = args.slice();
        if (a.length > 1 || (a.length === 1 && !types.includes(a[0].toLowerCase()) && !/^(types|list)$/i.test(a[0]))){
          const w = resolveTarget(a[0]);
          if (w && w !== sender){
            if (!isStaff(sender)){ R("Only staff can change somebody else's cock, sugar. ?penis <type> sets yours."); break; }
            t = w; a = a.slice(1);
          }
        }
        if (!rec(t) || !rec(t).roles.length){ R("You'll need to be on the books first, hon. ?apply! "+help); break; }
        if (!makesSemen(t) && !/^(types|list)$/i.test(a[0]||"")){ R("🍆 "+(t === sender ? "You haven't" : plainName(t)+" hasn't")+" got a cock right now, hon. Wear one, or ?futa on, and then ?penis <type> picks the kind. ?penis types shows 'em."); break; }
        if (!a.length){ R("🍆 "+plainName(t)+": "+sizeName(t,"penis")+", "+penisLabel(t)+(knotted(t) ? ", knot "+sizeName(t,"knot") : "")+". "+help); break; }
        if (/^(types|list)$/i.test(a[0])){ R("🍆 "+help); break; }
        const type = a[0].toLowerCase();
        if (!CFG.PENIS_TYPES[type]){ R("I don't know that kind, sugar. "+help); break; }
        setPenisType(t, type);
        if (isStaff(sender) && /^(knotted|knot)$/i.test(a[1]||"")){ prodOf(t).knot = true; prodOf(t).knotShot = true; }
        if (isStaff(sender) && /^(unknotted|noknot|no)$/i.test(a[1]||"")){ prodOf(t).knot = false; prodOf(t).knotShot = false; }
        saveLedger(); audit(sender, "PENIS", t+" "+penisLabel(t));
        R("🍆 Done! "+(t === sender ? "Yours is" : plainName(t)+"'s is")+" a "+penisLabel(t)+" cock now.");
        break;
      }

      case "species": {
        // ?species → what we keep · ?species list → the litter table · ?species <animal> → set yours
        // · ?species <who> <animal> → staff set someone else's
        const kinds = Object.keys(CFG.SPECIES).filter(k => k !== "default");
        const row = k => { const S = CFG.SPECIES[k]; return k+": milk x"+S.milk+", fertility x"+S.fert+", litters of "+(S.litter[0]===S.litter[1] ? S.litter[0] : S.litter[0]+"-"+S.litter[1]); };
        if (!args.length){ R(TEXT.species); break; }
        if (/^(list|all|table)$/i.test(args[0])){ R("🐾 SPECIES & LITTERS\n"+kinds.map(row).join("\n")+"\nAnything else counts as: "+row("default").replace(/^default: /,"")+". Set yours with ?species <animal>, like ?species bunny."); break; }
        let who = sender, animal = args.join(" ");
        if (args.length > 1){
          const t = resolveTarget(args[0]);
          if (t && t !== sender && rec(t)){
            if (!isStaff(sender)){ R("Only staff can set somebody else's species, sugar. ?species <animal> sets your own."); break; }
            who = t; animal = args.slice(1).join(" ");
          }
        }
        if (!rec(who)){ R("You need to be on the books first, sugar. Say ?apply!"); break; }
        rec(who).species = animal.toLowerCase().trim().slice(0, 40);
        saveLedger(); audit(sender, "SPECIES", who+" "+rec(who).species);
        const k = speciesKey(who);
        R("🐾 "+(who === sender ? "You're" : plainName(who)+" is")+" down as "+rec(who).species+" now, hon. "+
          (k === "default" ? "I don't have special numbers for that one, so it's "+row("default").replace(/^default: /,"")+". ?species list shows the rest." : row(k).replace(/^[a-z]+: /,"That means ")+"."));
        break;
      }
      case "luxury":  R(fill(TEXT.luxury,sender)); break;
      case "doors":   R(TEXT.doors); break;
      case "ping":
        if (channel === "chat") say("Right here and mindin' the books, "+plainName(sender)+"! 🌾");
        else R("Right here and mindin' the books, "+plainName(sender)+"! 🌾");
        break;
      case "apply":   startApplication(sender, channel); break;

      case "friend": {
        // beeps need BOTH lists: mine lets your beeps reach me, yours lets mine reach you
        const mine = isFriend(sender) || addFriend(sender, true);
        later(askMutual, 1500);
        if (!mine) R("Shoot, I couldn't manage that just now, sugar. Try ?friend again in a little bit.");
        else if (canBeep(sender)) R("We're friends both ways, sugar! Beep me any time, from anywhere.\n🔴 Beep 'safe' and everything stops.");
        else R("🌾 You're on my list, hon, so your beeps reach me. For mine to reach you, add me ("+CFG.BOT_MEMBER+") to YOUR friend list too. "+
               "Until then I'll whisper while you're here, and keep anything else for when you come back.\n🔴 Beep 'safe' and everything stops.");
        break;
      }

      case "addfriend": {
        const t = resolveTarget(args[0]);
        if (!t){ R("Who should I add, hon? Give me their member number, or their name if they're in the room or on the books. For example: ?addfriend 123456  or  ?addfriend Bessie"); break; }
        const ok = addFriend(t, false);
        let n = "-"; try { n = (W.Player.FriendList||[]).length; } catch(e){}
        R(ok ? "🔔 Added "+plainName(t)+"! Friends: "+n : "They're already on my list, sugar, or it just wouldn't take.");
        break;
      }

      /* ── THE BOOKS ── */
      case "roster": {
        const all = Object.values(L.people);
        if (!all.length){ R("The books are plumb empty, sugar."); break; }
        const groups = {};
        for (const k of ROLE_ORDER) groups[k] = [];
        for (const r of all){
          if (!r.roles || !r.roles.length) continue;
          const top = ROLE_ORDER.find(x => r.roles.includes(x));
          if (top) groups[top].push(r);
        }
        const label = {
          PROPRIETOR:"🥇 PROPRIETORS", HERDMASTER:"🥈 HERDMASTERS",
          MANDATED:"🔗 MANDATED FARMHANDS", FARMHAND:"🥈 FARMHANDS",
          LIVESTOCK:"🐄 LIVESTOCK", LUXURY:"🏡 LUXURY GUESTS",
          GUEST:"👤 GUESTS", GLORYHOLE:"🕳️ INSTALLED"
        };
        const line = (r) => {
          const here = charFor(r.mn) ? " ●" : "";
          const off  = r.onDuty === false ? " 🌾" : "";
          const fc   = (isMandated(r.mn) || r.forced) ? " 🔗" : "";
          const sp   = r.species ? " · "+r.species : "";
          const hm   = (r.herds||[]).length ? " · "+r.herds.map(h=>plainName(h.leader)+"'s").join(", ") : "";
          const ct   = r.contractSigned ? "" : " · ⚠️";
          return "  • "+(r.name||("#"+r.mn))+" ("+r.mn+")"+here+off+fc+sp+hm+ct;
        };
        const alias = { STOCK:"LIVESTOCK", STAFF:"FARMHAND", LUX:"LUXURY", ONCALL:"MANDATED" };
        const filter = (args[0]||"").toUpperCase();
        const key = alias[filter] || filter;
        if (key && groups[key]){
          R("📖 "+label[key]+" ("+groups[key].length+")\n\n"+
            (groups[key].length?groups[key].map(line).join("\n"):"  (nobody)"));
          break;
        }
        let o = "📖 THE BOOKS — "+all.length+" registered\n";
        for (const k of ROLE_ORDER){
          if (!groups[k].length) continue;
          o += "\n"+label[k]+" ("+groups[k].length+")\n"+groups[k].map(line).join("\n")+"\n";
        }
        o += "\n● here · 🌾 pastured · 🔗 on call · ⚠️ no contract";
        R(o);
        break;
      }

      case "stock": {
        const spq = String(rest||"").toLowerCase().trim();
        const herd = Object.values(L.people).filter(r=>r.roles && r.roles.includes(ROLE.LIVESTOCK) &&
                       (!spq || (r.species||"").toLowerCase().includes(spq)));
        if (!herd.length){ R(spq ? "No "+spq+" on the books, sugar. Just ?stock shows every species." : "No stock on the books yet, sugar."); break; }
        const bySpecies = {};
        for (const r of herd){
          const s = (r.species||"unspecified").toLowerCase();
          (bySpecies[s] = bySpecies[s]||[]).push(r);
        }
        let o = "🐄 THE HERD — "+herd.length+" head\n";
        for (const [sp,list] of Object.entries(bySpecies).sort((a,b)=>b[1].length-a[1].length)){
          o += "\n"+sp.toUpperCase()+" ("+list.length+")\n";
          o += list.map(r=>{
            const here = charFor(r.mn)?" ●":"";
            const hm = (r.herds||[]).length ? " · "+herdsLine(r.mn) : " · unclaimed";
            return "  • "+(r.name||("#"+r.mn))+here+hm;
          }).join("\n")+"\n";
        }
        R(o);
        break;
      }

      case "find": {
        const q = String(rest).toLowerCase().trim();
        if (!q){ R("Find who, sugar? Give me part of a name, a member number, a species or a stay type. For example: ?find Bessie  or  ?find cow  or  ?find 1234"); break; }
        const hits = Object.values(L.people).filter(r =>
          (r.name||"").toLowerCase().includes(q) || String(r.mn).includes(q) ||
          (r.species||"").toLowerCase().includes(q) || (r.stayType||"").toLowerCase().includes(q));
        if (!hits.length){
          const arch = Object.values(L.archive||{}).filter(r =>
            (r.name||"").toLowerCase().includes(q) || String(r.mn).includes(q));
          R(arch.length
            ? "Nobody current, hon, but I found "+arch.length+" in the drawer:\n\n"+
              arch.map(r=>"  • "+(r.name||("#"+r.mn))+" ("+r.mn+") — archived").join("\n")
            : "Couldn't find a soul by that, sugar. Try part of a name, a member number or a species.");
          break;
        }
        let o = "🔍 FOUND "+hits.length+"\n";
        for (const r of hits.slice(0,20)){
          o += "\n• "+(r.name||("#"+r.mn))+" ("+r.mn+")"+(charFor(r.mn)?" ●":"")+
               "\n    "+roleString(r.mn)+"\n    "+keyString(r.mn)+
               (r.species?"\n    "+r.species:"")+
               ((r.herds||[]).length?"\n    "+herdsLine(r.mn):"");
        }
        if (hits.length>20) o += "\n\n…and "+(hits.length-20)+" more.";
        R(o);
        break;
      }

      case "signed": {
        const t = resolveTarget(args[0]);
        if (!t){ R("Whose contract, hon? Say ?signed and their name or member number, like ?signed Bessie or ?signed 123456. It flips them between signed and unsigned."); break; }
        const r = rec(t,true);
        r.contractSigned = !r.contractSigned;
        saveLedger(); audit(sender,"CONTRACT",t+" "+(r.contractSigned?"signed":"unsigned"));
        R(plainName(t)+"'s contract is marked "+(r.contractSigned?"SIGNED ✅":"unsigned ⚠️")+" now, sugar.");
        break;
      }

      /* ── HERDS ── */
      case "claim": {
        const t = resolveTarget(args[0]);
        if (!t){ R("Claim who, sugar? Say ?claim, their name or member number, then optionally temp or perm and a number of days. "+
                  "perm (or permanent) lasts till you let 'em go, and it's what you get if you leave it out. "+
                  "temp (or temporary) runs out by itself after 7 days, or after the days you give (a number on its own makes it temp too). "+
                  "For example: ?claim Bessie  or  ?claim 123456 temp 3  or  ?claim Daisy 14"); break; }
        const why = claimBlocker(sender, t);
        if (why){ R(why); break; }
        const pend = state.pendingClaims.get(t);
        if (pend && pend.by !== sender && Date.now()-pend.at < CFG.CLAIM_ASK_TIMEOUT_MIN*60000){
          R(plainName(t)+" already has somebody else's ask in front of 'em, hon. Give it a little bit."); break;
        }

        let type = CFG.DEFAULT_CLAIM_TYPE, days = CFG.DEFAULT_TEMP_DAYS;
        for (const a of args.slice(1)){
          const low = String(a).toLowerCase();
          if (low === "temp" || low === "temporary") type = "temp";
          else if (low === "perm" || low === "permanent") type = "perm";
          else if (/^\d+$/.test(low)) { days = parseInt(low,10); type = "temp"; }
        }

        const word = herdWord(sender);
        state.pendingClaims.set(t,{ by:sender, at:Date.now(), type, days });
        R("I asked 'em for you, sugar — "+type+(type==="temp"?" ("+days+" days)":"")+". They'll need to say yes.");
        beep(t,
          "🌾 Ooh, "+plainName(sender)+" wants you in their "+word+" at B&B Farm, sweetie!\n\n"+
          "Terms: "+(type==="temp"
            ? "TEMPORARY — "+days+" days, then you're unclaimed again."
            : "PERMANENT — till they let you go. Only they can.")+
          "\n\nBeep me 'yes' to accept, or 'no' to decline. No pressure either way, hon.");
        break;
      }

      case "release": {
        const t = resolveTarget(args[0]);
        if (!t || !rec(t)){ R("Release who, sugar? Say ?release and the name or member number of somebody in your own "+herdWord(sender)+", like ?release Bessie or ?release 123456. ?myherd shows who you've got."); break; }
        // only the leader of a herd can take somebody out of it
        if (!membership(t, sender)){ R(plainName(t)+" ain't in your "+herdWord(sender)+", hon. Only their own leader can let 'em go."); break; }
        removeFromHerd(t, sender);
        audit(sender,"RELEASE",String(t));
        R("Done, sugar. They're released from your "+herdWord(sender)+".");
        beep(t,"You're out of "+plainName(sender)+"'s "+herdWord(sender)+" now, sweetie. Still ours, though!");
        break;
      }

      case "myherd": {
        if (!canHoldHerd(sender)){ R("You don't keep a herd, sugar. Only staff and proprietors do."); break; }
        const spq = String(rest||"").toLowerCase().trim();
        const all = herdMembers(sender);
        const mine = all.filter(r => !spq || (r.species||"").toLowerCase().includes(spq));
        const word = herdWord(sender);
        if (!mine.length){ R(spq ? "No "+spq+" in your "+word+", hon. Plain ?myherd shows everybody." : "Your "+word+"'s empty, sugar. ?claim somebody to start one!"); break; }
        const line = r => { const h = membership(r.mn, sender);
          return "  • "+(r.name||("#"+r.mn))+(charFor(r.mn)?" ●":"")+" — "+(r.species||"unspecified")+
                 (h.type==="temp" ? " — "+herdLabel(h) : "")+(r.pastureLock?" 🔒":""); };
        const bySp = {};
        for (const r of mine) (bySp[(r.species||"unspecified").toLowerCase()] = bySp[(r.species||"unspecified").toLowerCase()]||[]).push(r);
        let o = "🌾 YOUR "+word.toUpperCase()+" — "+all.length+"/"+herdCap(sender)+(spq?" · showing "+spq:"")+"\n";
        for (const [sp,list] of Object.entries(bySp).sort((a,b)=>b[1].length-a[1].length))
          o += "\n"+sp.toUpperCase()+" ("+list.length+")\n"+list.map(line).join("\n")+"\n";
        o += "\n?myherd <species> to filter (like ?myherd cow) · ?herdcall <message> · ?herdname <word>";
        R(o);
        break;
      }

      case "herd": {
        // ?herd · ?herd <who> · ?herd <who> <species> · ?herd <species> (your own)
        const named = args[0] ? resolveTarget(args[0]) : null;
        const t = named || sender;
        const spq = (named ? args.slice(1) : args).join(" ").toLowerCase().trim();
        const mine = herdMembers(t).filter(r => !spq || (r.species||"").toLowerCase().includes(spq));
        const word = herdWord(t);
        R(mine.length
          ? "🌾 "+plainName(t).toUpperCase()+"'S "+word.toUpperCase()+" ("+mine.length+")\n\n"+
            mine.map(r=>"• "+(r.name||("#"+r.mn))+" — "+(r.species||"unspecified")+
                        " — "+herdLabel(membership(r.mn,t))).join("\n")
          : plainName(t)+(spq ? " has no "+spq+", hon." : " don't keep a "+word+", hon.")+" Try ?herd <who>, like ?herd Daisy, or add a species: ?herd Daisy cow");
        break;
      }

      case "herdname": {
        if (!canHoldHerd(sender)){ R("You don't keep a herd, sugar. Only staff and proprietors do."); break; }
        const w = String(args[0]||"").toLowerCase();
        if (!/^[a-z][a-z ]{1,15}$/.test(w)){ R("Give me one short word, sugar: 2 to 16 letters, like herd, pack, pride, flock or stable. For example: ?herdname pack"); break; }
        rec(sender,true).herdWord = w; saveLedger();
        R("Aww, your lot's a "+w+" now!");
        break;
      }

      case "herdcall": {
        if (!canHoldHerd(sender)){ R("You don't keep a herd, sugar. Only staff and proprietors do."); break; }
        const members = herdMembers(sender);
        if (!members.length){ R("There's nobody in your herd to call yet, sugar."); break; }
        const key = "herdcall:"+sender;
        const last = state.cooldowns.get(key)||0;
        if (Date.now()-last < CFG.HERDCALL_COOLDOWN_MIN*60000){ R("You just called 'em, hon! Give it a couple minutes before you holler again."); break; }
        state.cooldowns.set(key, Date.now());
        const msg = rest || "Come to "+currentRoomName()+".";
        for (const r of members) beep(r.mn, "📣 "+plainName(sender)+" calls their "+herdWord(sender)+": "+msg);
        R("📣 Called all "+members.length+" of 'em for you!");
        audit(sender,"HERDCALL",msg);
        break;
      }

      case "herdsummon": {
        if (!isHerdmaster(sender)){ R("Sorry, sugar, that one's just for herdmasters and proprietors."); break; }
        const away = herdMembers(sender).filter(r => !charFor(r.mn));
        if (!away.length){ R("Everybody's already here, hon!"); break; }
        let n = 0;
        for (const r of away) if (summon(r.mn, "Summoned by "+plainName(sender)+", their "+herdWord(sender)+" leader.", sender)) n++;
        R("🔗 Sent "+n+" summons, sugar! It only works on folks whose BCX lets the office pull 'em.");
        break;
      }

      /* ── PASTURE LOCK ── */
      case "turnout": {
        const t = resolveTarget(args[0]);
        if (!t){ R("Turn out who, sugar? Say ?turnout, their name or member number, and if you like a note they'll see. For example: ?turnout Laynie  or  ?turnout 232922 Go graze a while, darlin'."); break; }
        if (!canLockOut(sender, t)){ R("Sorry, hon, that one ain't yours to turn out. Only their herd leader (or whoever the farm lists for 'em) can."); break; }
        const r = rec(t,true);
        if (r.onDuty !== false) r.pastureStock = !r.roles.includes(ROLE.LIVESTOCK);
        r.onDuty = false; r.forced = false;
        if (!r.roles.includes(ROLE.LIVESTOCK)) r.roles.push(ROLE.LIVESTOCK);
        r.pastureLock = { by: sender, at: Date.now() };
        r.pastureNote = args.slice(1).join(" ");
        saveLedger(); audit(sender,"TURNOUT",String(t));
        syncKeys(t, true);
        R("🔒 "+plainName(t)+" is out in the pasture now and stays there till they're let up. ?letup "+t+" when you're ready.");
        beep(t, "🔒 "+plainName(sender)+" turned you out to pasture"+(r.pastureNote?": "+r.pastureNote:"")+
                ".\n\nYou can't go back on duty till "+
                (herdLeaderOf(t) ? plainName(herdLeaderOf(t)) : plainName(sender))+" lets you up, sweetie. Bronze key only till then.");
        break;
      }

      case "letup": {
        const t = resolveTarget(args[0]);
        if (!t){ R("Let up who, sugar? Say ?letup and their name or member number, like ?letup Laynie or ?letup 221397."); break; }
        const r = rec(t);
        if (!r || !r.pastureLock){ R("They ain't locked out in the pasture, hon."); break; }
        if (!canLetUp(sender, t)){ R("Sorry, sugar, only "+plainName(herdLeaderOf(t)||r.pastureLock.by)+" can let 'em up."); break; }
        r.pastureLock = null; saveLedger(); audit(sender,"LETUP",String(t));
        R("🔓 "+plainName(t)+" can go back on duty whenever they like.");
        beep(t, "🔓 "+plainName(sender)+" let you up, sweetie! Say ?onduty when you're ready.");
        break;
      }

      /* ── GOLD PROMOTION ── */
      case "goldkey": {
        if (!isProprietor(sender)){ R("Sorry, sugar, that one's just for the proprietors."); break; }
        const t = resolveTarget(args[0]);
        if (!t || !hasRole(t, ROLE.HERDMASTER)){ R("Who gets the gold key, hon? It has to be a herdmaster. Say ?goldkey, their name or member number, then on or off (leave it out and it's on). For example: ?goldkey Mistress on  or  ?goldkey 700 off"); break; }
        const on = String(args[1]||"on").toLowerCase() !== "off";
        rec(t).goldKey = on; saveLedger(); audit(sender,"GOLDKEY",t+" "+(on?"on":"off"));
        syncKeys(t, true);
        R("🥇 "+plainName(t)+(on?" carries gold on duty now!":" is back to silver, hon."));
        beep(t, on ? "🥇 Ooh, "+plainName(sender)+" trusted you with a gold key, sweetie! It's live whenever you're on duty."
                   : "🥇 Your gold key's been taken back, hon.");
        break;
      }

      /* ── ON CALL ── */
      case "forced": {
        const target = args[0] ? resolveTarget(args[0]) : sender;
        if (!target){ R("Who, sugar? Just ?forced flips your own on-call switch. Proprietors can name somebody else by name or member number, like ?forced Hand or ?forced 800."); break; }
        if (target !== sender && !isProprietor(sender)){
          R("Sorry, hon, that's their switch to throw, not yours. Just ?forced flips your own."); break;
        }
        if (!isStaff(target)){ R("On-call's just for staff, sugar."); break; }

        if (isMandated(target)){
          R(plainName(target)+" is a MANDATED farmhand, so they're always on call, hon. "+
            "Only a proprietor can change that, and only by takin' the role off 'em.");
          break;
        }

        const r = rec(target, true);
        r.forced = !r.forced;
        saveLedger(); audit(sender,"FORCED", target+" "+(r.forced?"on":"off"));

        if (target === sender){
          R(r.forced
            ? "🔗 You're on call now, "+plainName(sender)+"!\n\n"+
              "When the office needs hands and nobody's about, I'll summon you — and if your "+
              "BCX rule lets me, you'll come whether you fancied it or not, sugar.\n\n"+
              "Say ?forced again to take it off. Goin' to pasture takes it off too."
            : "🔓 You're off call, sweetie. I'll ask real nice from now on.");
        } else {
          R(plainName(target)+" on call: "+(r.forced?"ON 🔗":"off"));
          beep(target, r.forced
            ? "🔗 "+plainName(sender)+" put you on call at B&B Farm, sweetie! The office can summon you now."
            : "🔓 "+plainName(sender)+" took you off call, hon.");
        }
        break;
      }

      case "summon": {
        if (!isHerdmaster(sender)){ R("Sorry, sugar, that one's just for herdmasters and proprietors."); break; }
        if (!args.length){
          const pool = forcedStaff();
          R(pool.length
            ? "🔗 ON CALL ("+pool.length+")\n\n"+
              pool.map(m => "  • "+plainName(m)+" ("+m+")"+
                            (isMandated(m)?" — mandated":"")+
                            (charFor(m)?" ● here":" — away")).join("\n")+
              "\n\n?summon <who> [spot] (like ?summon Daisy or ?summon Daisy barn) · ?summon all"
            : "Nobody's on call right now, sugar.");
          break;
        }
        if (String(args[0]).toLowerCase() === "all"){
          const n = summonHelp("Summoned by "+plainName(sender)+".", sender, true, "staff");
          R(n ? "🔗 Summoned "+n+", hon! They'll land at the staff spot." : "Nobody's available right now, sugar. They're all on cooldown, or nobody's on call.");
          break;
        }
        const t = resolveTarget(args[0]);
        if (!t){ R("Summon who, sugar? Say ?summon and a name or member number. Folks already here come right to your side; on-call staff in other rooms get pulled to the staff spot. Add a spot name to send 'em there instead. For example: ?summon Daisy  or  ?summon 800 barn"); break; }
        const sp = args[1] ? String(args[1]).toLowerCase() : null;
        if (sp && !spotFor(sp)){ R("There's no spot called '"+sp+"', sugar. Say ?spot for the list, or leave the spot off."); break; }
        const r = rec(t);
        // already in the room: bring 'em right over (or to the spot you named)
        if (charFor(t)){
          const pt = sp ? spotFor(sp) : spotBeside(sender);
          if (!pt){ R("I can't see where you're standin', sugar. Step onto the map and try again."); break; }
          if (!teleport(t, pt, true)){ R("I can't move folks right now, hon. I've lost my room admin rights."); break; }
          tell(t, "🔗 "+plainName(sender)+" called you over, sugar.");
          audit(sender, "SUMMON_HERE", t+(sp ? " "+sp : ""));
          R("🔗 Brought "+plainName(t)+(sp ? " to the "+sp+" spot." : " right over beside you."));
          break;
        }
        // away, and on call: pulled in with their BCX or BC+ summon rule, landin' at the staff spot
        if (r && isStaff(t) && (r.forced || isMandated(t))){
          const to = sp || "staff";
          R(summon(t, "Summoned by "+plainName(sender)+".", sender, to)
            ? "🔗 Summoned "+plainName(t)+"! They'll land at the "+(spotFor(to) ? to : "summon")+" spot."
            : "They were summoned real recent, hon. Give it a few minutes.");
          break;
        }
        if (!r){ R(plainName(t)+" isn't on the books, sugar, so I won't go callin' 'em."); break; }
        // away, and not on call: a friendly invite, nobody gets pulled
        beep(t, "🌾 "+plainName(sender)+" would like you at "+currentRoomName()+" when you can, hon. No rush, and nobody's pullin' you.");
        audit(sender, "SUMMON_INVITE", String(t));
        R("💌 "+plainName(t)+" isn't here and isn't on call, so I sent 'em a friendly invite instead, sugar.");
        break;
      }

      /* ── PERSONAL ── */
      case "where": {
        const C = charFor(sender);
        const pos = C && C.MapData && C.MapData.Pos;
        R(pos ? "📍 You're at X:"+pos.X+"  Y:"+pos.Y+", sugar." : "Hmm, I can't see where you're standin', sugar. You need to be on the farm map.");
        break;
      }

      case "record": {
        const t = args[0] ? resolveTarget(args[0]) : sender;
        if (!t){ R("I don't know that one, sugar. Just ?record shows your own file; staff can add a name or member number, like ?record Bessie or ?record 123456."); break; }
        if (t!==sender && !isStaff(sender)){ R("Sorry, hon, that file's not yours to read. Just ?record shows your own."); break; }
        R(recordText(t, isStaff(sender) || t === sender, isStaff(sender)));
        break;
      }

      case "keys": {
        const t = args[0] ? resolveTarget(args[0]) : sender;
        if (!t){ R("I don't know that one, hon. Just ?keys shows your own; staff can add a name or member number, like ?keys Bessie or ?keys 123456."); break; }
        if (t!==sender && !isStaff(sender)){ R("Sorry, hon, those aren't yours to read. Just ?keys shows your own."); break; }
        R("🔑 "+plainName(t)+"\n"+roleString(t)+"\n"+keyString(t)+"\n\nSay ?doors to see what each one opens, sugar.");
        break;
      }

      case "keysync": {
        const n = syncAllPresent(false);
        R("🔑 Resynced "+n+" folks for you, hon."+(botIsAdmin()?"":"\n⚠️ I'm not room admin right now, so the keys won't stick."));
        break;
      }

      case "keydump": {
        const rows = (W.ChatRoomCharacter||[]).filter(c=>c.MemberNumber!==CFG.BOT_MEMBER).map(C=>{
          const led = keysOf(C.MemberNumber).join("+")||"-";
          const ps = C.MapData && C.MapData.PrivateState;
          const act = ps ? (ALL_TIERS.filter(t=>ps["HasKey"+t[0].toUpperCase()+t.slice(1)]).join("+")||"-") : "?";
          return "• "+plainName(C.MemberNumber)+"\n    ledger: "+led+"\n    theirs: "+act;
        });
        R("🔑 LEDGER vs ACTUAL\n\n"+(rows.join("\n")||"nobody about right now"));
        break;
      }

      case "who": R(whoText()); break;

      case "health": {
        if (!isProprietor(sender)){ R("Sorry, sugar, that one's just for the proprietors."); break; }
        R("🩺 "+statusText());
        break;
      }

      /* ── SAFETY ── */
      case "safe": case "safeword": case "red": {
        say("🔴 PAUSE CALLED. Everything stops, right now, everybody.", true, sender);   // I go stand by them, so everyone near them hears it
        beep(sender, "I've got you, "+plainName(sender)+". Everything's stopped and I'm fetchin' somebody for you right now. You don't owe anybody an explanation. 🔴", true);
        notifyStaff("🔴 SAFEWORD from "+plainName(sender)+" ("+sender+"). Please go to them now.", false);
        audit(sender,"SAFEWORD",channel);
        addonsEmit("safe", sender);
        stopScene(sender);            // a milkin', breedin' or edgin' scene stops mid-beat   // add-ons stop anything they're doin' to this person (scenes, sessions…)
        dropLeashes(sender); state.tours.delete(sender);
        { const r0 = rec(sender); if (r0 && r0.prod){ r0.prod.pin = null; r0.prod.unpinUntil = Date.now() + CFG.PROD.SAFEWORD_UNPIN_MIN*60000; saveLedger(); } }
        if (rec(sender) && rec(sender).stocked){ rec(sender).stocked = null; saveLedger(); }
        if (CFG.SUMMON_ON_SAFEWORD){
          const n = summonHelp("🔴 Safeword called by "+plainName(sender)+".", sender, true, "safe");
          if (n) log("Summoned "+n+" on-call staff to a safeword.");
        }
        break;
      }

      case "stuck": {
        const C = charFor(sender);
        const pos = C && C.MapData && C.MapData.Pos;
        const now = Date.now();
        const last = state.stuckCooldown.get(sender)||0;
        if (now-last < CFG.STUCK_COOLDOWN_MIN*60000){ R("I've already got help comin' for you, hon. Hold on, it'll just be a minute."); break; }
        state.stuckCooldown.set(sender, now);
        const where = pos ? pos.X+","+pos.Y : "unknown";
        L.stuckLog.push({ t:now, mn:sender, name:plainName(sender), pos:where });
        if (L.stuckLog.length>300) L.stuckLog = L.stuckLog.slice(-300);
        saveLedger(); audit(sender,"STUCK",where);
        say("Hold still, "+plainName(sender)+". I'm gettin' you some help.", true);
        const staffHere = [];
        for (const k in L.people){
          const m = parseInt(k,10);
          if (isStaff(m) && onDuty(m) && charFor(m)) staffHere.push(m);
        }
        if (staffHere.length){
          for (const m of staffHere) beep(m,"🪢 "+plainName(sender)+" ("+sender+") is wedged at "+where+".", true);
          beep(sender,"🪢 I've called for a hand and somebody's on their way. Sit tight, you're okay.", true);
        } else {
          beep(sender,"🪢 Nobody's around right now, so I'm pullin' you out myself. Hold on just a moment.", true);
          notifyStaff("🪢 "+plainName(sender)+" was stuck at "+where+". Nobody was about, so I pulled 'em out.", true);
          if (CFG.SUMMON_ON_STUCK) summonHelp("🪢 "+plainName(sender)+" is wedged at "+where+".", sender, false, "staff");
          later(()=>rescueTeleport(sender), 3000);
        }
        break;
      }

      case "report": {
        R("Thank you for tellin' me, "+plainName(sender)+". I've passed it to staff quietly, and somebody will look into it. You can always send more details with ?report and then what happened.");
        notifyStaff("⚠️ REPORT from "+plainName(sender)+" ("+sender+"): "+(rest||"(no detail)"), false);
        audit(sender,"REPORT",rest);
        break;
      }

      case "staff": {
        R("I've sent word, sugar. Somebody'll be right over to help.");
        notifyStaff("🙋 "+plainName(sender)+" ("+sender+") is askin' for a hand.", true, true);
        if (CFG.SUMMON_ON_STAFF_CALL && !forcedStaff().some(m=>charFor(m))){
          summonHelp("🙋 "+plainName(sender)+" asked for a hand.", sender, false, "staff");
        }
        break;
      }

      case "setrescue": {
        if (!isHerdmaster(sender)){ R("Sorry, sugar, that one's just for herdmasters and proprietors."); break; }
        const C = charFor(sender);
        const pos = C && C.MapData && C.MapData.Pos;
        if (!pos){ R("I can't see where you're standin', hon. You need to be on the farm map."); break; }
        L.spots.rescue = { X:pos.X, Y:pos.Y, by:sender, at:Date.now() };
        saveLedger();
        R("📍 Rescue spot set to "+pos.X+","+pos.Y+", sugar. (Same as ?spot set rescue.)");
        break;
      }

      case "stucklog": {
        if (!L.stuckLog.length){ R("Nobody's got wedged yet. Map's behavin' itself!"); break; }
        const byPos = {};
        for (const s of L.stuckLog){
          byPos[s.pos] = byPos[s.pos]||{ n:0, who:new Set() };
          byPos[s.pos].n++; byPos[s.pos].who.add(s.name);
        }
        const rows = Object.entries(byPos).sort((a,b)=>b[1].n-a[1].n);
        let o = "🪢 STUCK SPOTS ("+L.stuckLog.length+" incidents)\n\nSpots that keep showin' up are map bugs, not misbehavin'.\n";
        for (const [pos,v] of rows.slice(0,15)) o += "\n• "+pos+" — "+v.n+"× — "+Array.from(v.who).slice(0,4).join(", ");
        R(o);
        break;
      }

      /* ── PAPERWORK ── */
      case "queue": {
        const mailLine = "📮 Messages: "+(state.queue.length + state.urgent.length)+" waitin' to send · "+Object.keys(L.mailbox||{}).length+
          " people with messages held · "+(state.mutual ? state.mutual.set.size : "?")+" online and beep-able";
        if (!L.applications.length){ R("Queue's empty, hon. Quiet week!\n" + mailLine); break; }
        let o = "📋 PENDING APPLICATIONS ("+L.applications.length+")\n";
        L.applications.forEach((a,i)=>{
          o += "\n"+(i+1)+". "+a.name+" ("+a.mn+")"+(a.staffTrack?" [staff]":"")+
               "\n   "+["role","species","gender","stay","depth"].map(k => appAnswer(a, k) || "?").join(" • ");
        });
        o += "\n\nSay ?app and the number to read one, like ?app 1.\n" + mailLine;
        R(o);
        break;
      }

      case "app": {
        const a = L.applications[parseInt(args[0],10)-1];
        if (!a){ R("There's no application by that number, sugar. Say ?app and a number from the ?queue list, like ?app 1."); break; }
        const list = a.staffTrack ? QUESTIONS.concat(STAFF_QUESTIONS) : QUESTIONS;
        let o = "📋 APPLICATION — "+a.name+" ("+a.mn+")\n"+new Date(a.at).toLocaleString()+"\n";
        if (a.byKey) list.forEach(q => { o += "\n▸ "+q.text.split("\n")[0]+"\n   "+(a.byKey[q.key] || "—")+"\n"; });
        else a.answers.forEach((ans,qi)=>{ o += "\n▸ "+(OLD_ORDER[qi] || "question "+(qi+1))+"\n   "+ans+"\n"; });   // an older application
        o += "\n?approve "+a.mn+" livestock\n?deny "+a.mn;
        R(o);
        break;
      }

      case "approve": case "register": {
        const t = resolveTarget(args[0]);
        if (!t){ R("Approve who, sugar? Say ?approve, their name or member number, then one or more roles separated by spaces: "+
                  "livestock (or stock), guest, luxury (or luxuryguest), gloryhole — and, for proprietors only, farmhand, mandated (or mandatedfarmhand), herdmaster. "+
                  "For example: ?approve 123456 livestock  or  ?approve Bessie livestock luxury"); break; }
        // any staff can approve stock and guests; hiring staff stays with the proprietors
        if (!isStaff(sender)){ R("Sorry, sugar, approvals are just for staff."); break; }
        const roles = parseRoles(args.slice(1));
        if (!roles.length){ R("I need a role too, hon. Pick one or more, separated by spaces: livestock (or stock), guest, luxury (or luxuryguest), gloryhole — "+
                               "and, for proprietors only, farmhand, mandated (or mandatedfarmhand), herdmaster. For example: ?approve "+t+" livestock"); break; }
        if ((roles.includes(ROLE.FARMHAND)||roles.includes(ROLE.MANDATED)||roles.includes(ROLE.HERDMASTER))
            && !isProprietor(sender)){
          R("Sorry, sugar, hirin' staff (farmhand, mandated, herdmaster) is just for the proprietors. You can still approve livestock, guest, luxury or gloryhole."); break;
        }
        const r = rec(t,true);
        r.name = plainName(t); r.registeredAt = Date.now();
        for (const role of roles) if (!r.roles.includes(role)) r.roles.push(role);
        const idx = L.applications.findIndex(a=>a.mn===t);
        let wants = null;
        if (idx>=0){
          wants = applyApplication(t, L.applications[idx]);
          L.applications.splice(idx,1);
        }
        saveLedger(); audit(sender,"APPROVE",t+" "+roles.join("+"));
        syncKeys(t, true);
        if (CFG.FRIEND_ON_REGISTER) addFriend(t, true);
        // the contract they asked for, ready for staff to look over and send
        let ready = "";
        if (wants && wants.depth && wants.stay && roles.includes(ROLE.LIVESTOCK)){
          const d = BCPLUS.durationFrom(wants.stay), dp = BCPLUS.depthFrom(wants.depth);
          contractsLedger();
          L.contracts.push({ key: Date.now().toString(36), mn: t, by: sender, tpl: dp.key, title: "B&B Farm · "+dp.label, depth: dp.key,
                             durationMin: d.min, policy: dp.key === "fun" ? "either" : "author", rules: [], status: "prepared", at: Date.now() });
          saveLedger();
          ready = "\n\n📜 They asked for "+dp.label+", "+d.label+". It's ready when you are: ?contract show "+dp.key+" "+t+" to look it over, then ?contract offer "+dp.key+" "+t+" "+d.key+" to send it.";
        }
        R("✅ "+plainName(t)+" — "+roleString(t)+"\n🔑 "+keyString(t)+(r.species ? "\n🐾 "+r.species : "")+(r.gender ? " · "+r.gender : "")+ready);
        outfitsLedger();
        if (L.outfitRules.onApprove && roles.includes(ROLE.LIVESTOCK) && outfitSlotFor(t)) later(() => offerOutfit(t, outfitSlotFor(t), "Welcome to the farm"), 4000);
        beep(t,
`🌾 You're in, `+plainName(t)+`! Welcome to the family, sweetie. 💕

Standing: `+roleString(t)+`
Keys:     `+keyString(t)+`

Your keys are live right now, so go on and try the doors! ?doors shows what opens what, and ?record shows your file.

🔔 I've put myself on your friend list. Beep me from anywhere on the property, even hogtied in the far corner. Beep 'safe' and everything stops.

Welcome to B&B Farm, hon. 🌾`);
        break;
      }

      case "deny": {
        const t = resolveTarget(args[0]);
        if (!t){ R("Deny who, sugar? Say ?deny and their name or member number, like ?deny Bessie or ?deny 123456. ?queue shows who's waitin'."); break; }
        if (!isStaff(sender)){ R("Sorry, sugar, that's not your call to make."); break; }
        const idx = L.applications.findIndex(a=>a.mn===t);
        if (idx>=0) L.applications.splice(idx,1);
        saveLedger(); audit(sender,"DENY",String(t));
        R("Denied and cleared, hon.");
        beep(t,"I had a look at your paperwork, "+plainName(t)+", and it ain't quite a fit for us right now. No hard feelin's, sweetie. The gate's always open for a visit.");
        break;
      }

      case "unregister": {
        const t = resolveTarget(args[0]);
        if (!t){ R("Unregister who, sugar? Say ?unregister and their name or member number, like ?unregister Bessie or ?unregister 123456. Their paperwork gets archived, never shredded."); break; }
        if (!isHerdmaster(sender)){ R("Sorry, hon, that's for herdmasters and proprietors to decide."); break; }
        if (CFG.PROPRIETORS.includes(t)){ R("I can't unregister a proprietor, sugar!"); break; }
        const r = rec(t);
        if (!r){ R("They're not on the books, hon."); break; }
        // clear anyone they were holding
        for (const k in L.people){
          const p = L.people[k];
          if ((p.herds||[]).some(h=>h.leader===t)) p.herds = p.herds.filter(h=>h.leader!==t);
        }
        L.archive[t] = JSON.parse(JSON.stringify(r));
        delete L.people[t];
        saveLedger(); audit(sender,"UNREGISTER",String(t));
        pushKeys(t, [], true);
        R("All done, sugar. Their keys are pulled and their paperwork's tucked safe in the drawer.");
        beep(t,"Your contract's up, "+plainName(t)+". Your keys are pulled, but the gate swings both ways, sweetie. I'll keep your paperwork safe in the drawer. 🌾");
        break;
      }

      case "grant": {
        const t = resolveTarget(args[0]);
        const tier = String(args[1]||"").toLowerCase();
        const hours = parseFloat(args[2]||"0");
        if (!t || !ALL_TIERS.includes(tier)){ R("Here's how, sugar: ?grant, their name or member number, a key (bronze, silver or gold), then hours if you want it to run out. "+
                                             "Leave the hours out and it lasts till you ?revoke it. Gold is proprietors only. For example: ?grant Bessie silver 2  or  ?grant 123456 bronze"); break; }
        if (!isHerdmaster(sender)){ R("Sorry, hon, grantin' keys is just for herdmasters and proprietors."); break; }
        if (tier==="gold" && !isProprietor(sender)){ R("Gold keys are just for the proprietors to hand out, sugar. Bronze or silver are fine."); break; }
        const r = rec(t,true);
        r.tempKeys = (r.tempKeys||[]).filter(x=>x.tier!==tier);
        r.tempKeys.push({ tier, until: hours>0 ? Date.now()+hours*3600000 : null });
        saveLedger(); audit(sender,"GRANT",t+" "+tier);
        syncKeys(t, true);
        R("🔑 Granted! "+plainName(t)+" holds: "+keyString(t));
        beep(t,"🔑 You've been handed a "+tier+" key"+(hours>0?" for "+hours+" hours":"")+", sweetie! It's live right now.");
        break;
      }

      case "revoke": {
        const t = resolveTarget(args[0]);
        const tier = String(args[1]||"").toLowerCase();
        if (!t || !ALL_TIERS.includes(tier)){ R("Here's how, sugar: ?revoke, their name or member number, then the key (bronze, silver or gold). It takes back a key handed out with ?grant; keys that come with their standing stay put. "+
                                             "For example: ?revoke Bessie silver  or  ?revoke 123456 bronze"); break; }
        if (!isHerdmaster(sender)){ R("Sorry, hon, takin' keys back is just for herdmasters and proprietors."); break; }
        const r = rec(t);
        if (!r){ R("They're not on the books, hon."); break; }
        r.tempKeys = (r.tempKeys||[]).filter(x=>x.tier!==tier);
        saveLedger(); audit(sender,"REVOKE",t+" "+tier);
        syncKeys(t, true);
        R("🔑 Revoked. They now hold: "+keyString(t));
        beep(t,"🔑 Your "+tier+" key's been taken back, hon.");
        break;
      }

      case "pasture": {
        const r = rec(sender,true);
        // remember whether pasture ADDED the livestock role, so ?onduty only takes
        // back what pasture gave (staff who are also real stock keep their collar)
        if (r.onDuty !== false) r.pastureStock = !r.roles.includes(ROLE.LIVESTOCK);
        r.onDuty = false;
        if (!r.roles.includes(ROLE.LIVESTOCK)) r.roles.push(ROLE.LIVESTOCK);
        const wasForced = r.forced;
        r.forced = false;
        r.pastureNote = rest||"";
        saveLedger(); audit(sender,"PASTURE",rest);
        syncKeys(sender, true);
        R("Turned out to pasture, "+plainName(sender)+"! Go on and graze, sweetie.\n\nStanding: "+roleString(sender)+
          "\nKeys:     "+keyString(sender)+
          (wasForced ? "\n\n🔓 You're off call while you're grazin'." : "")+
          (isMandated(sender) ? "\n\n⚠️ You're mandated, sugar, so you're still summonable. That's the deal." : "")+
          "\n\nSilver and gold are put away till you say ?onduty. Enjoy the grass! 🌾");
        break;
      }

      case "onduty": {
        const r = rec(sender,true);
        if (r.pastureLock){
          R("🔒 You're bein' kept out in the pasture, sugar. Only "+plainName(herdLeaderOf(sender)||r.pastureLock.by)+" can let you up.");
          break;
        }
        r.onDuty = true;
        const strip = r.pastureStock === true || (r.pastureStock === undefined && isStaff(sender));
        if (strip) r.roles = r.roles.filter(x=>x!==ROLE.LIVESTOCK);
        r.pastureStock = false;
        r.pastureNote = "";
        saveLedger(); audit(sender,"ONDUTY","");
        syncKeys(sender, true);
        R("Welcome back on duty, hon! Keys: "+keyString(sender)+
          (isMandated(sender)?"\n🔗 You're mandated, so you're on call as always.":"\nSay ?forced if you'd like to go on call."));
        break;
      }

      case "cover": {
        const r = rec(sender,true);
        const sub = String(args[0]||"").toLowerCase();
        if (sub==="add"){
          const line = args.slice(1).join(" ");
          if (!line){ R("Give me a line to say, sugar. It's what ?who shows while you're out in the pasture. For example: ?cover add The proprietors are off at the feed store."); break; }
          r.cover = r.cover||[]; r.cover.push(line); saveLedger();
          R("Added! "+r.cover.length+" excuse"+(r.cover.length===1?"":"s")+" on file.");
        } else if (sub==="clear"){
          r.cover = []; saveLedger(); R("All cleared, hon.");
        } else {
          const c = r.cover||[];
          R(c.length ? "🌾 YOUR COVER STORIES\n\n"+c.map((x,i)=>(i+1)+". "+x).join("\n")
                     : "None on file yet, sugar. Add one with ?cover add and your line, like ?cover add The proprietors are off at the feed store. ?cover clear wipes them all.");
        }
        break;
      }

      case "staffadd": {
        if (!isProprietor(sender)){ R("Sorry, sugar, that one's just for the proprietors."); break; }
        const t = resolveTarget(args[0]);
        if (!t){ R("Who are we hirin', sugar? Say ?staffadd, their name or member number, then the role: farmhand, mandated (or mandatedfarmhand), or herdmaster. Leave the role out and they're a farmhand. "+
                  "For example: ?staffadd Daisy  or  ?staffadd 123456 herdmaster"); break; }
        const which = String(args[1]||"farmhand").toLowerCase();
        if (!["farmhand","mandated","mandatedfarmhand","herdmaster"].includes(which)){ R("I don't know that role, sugar. It's farmhand, mandated (or mandatedfarmhand), or herdmaster. For example: ?staffadd Daisy  or  ?staffadd 123456 herdmaster"); break; }
        const role = which === "herdmaster" ? ROLE.HERDMASTER
                   : (which === "mandated" || which === "mandatedfarmhand") ? ROLE.MANDATED
                   : ROLE.FARMHAND;
        const r = rec(t,true);
        r.name = plainName(t);
        if (!r.roles.includes(role)) r.roles.push(role);
        saveLedger(); audit(sender,"STAFFADD",t+" "+role);
        syncKeys(t, true);
        if (CFG.FRIEND_ON_REGISTER) addFriend(t, true);
        R("✅ "+plainName(t)+" — "+roleString(t)+"\n🔑 "+keyString(t));
        beep(t,"🌾 Welcome aboard, sweetie! You've been taken on at B&B Farm as "+ROLE_PRETTY[role]+
                ".\n🔑 "+keyString(t)+" — live right now."+
                (role===ROLE.MANDATED
                  ? "\n\n🔗 MANDATED means you're on call for good, sugar. The office can summon you and you don't get a say. Set your BCX rule to let me, and mind your boots."
                  : "\n\nSay ?forced if you'd like to go on call.")+
                "\n\nSay ?staffhelp to see everything you can do.");
        break;
      }

      case "staffremove": {
        const t = resolveTarget(args[0]);
        if (!t){ R("Take who off staff, sugar? Say ?staffremove and their name or member number, like ?staffremove Hand or ?staffremove 800."); break; }
        if (CFG.PROPRIETORS.includes(t)){ R("Oh, I can't do that, hon. Proprietors are bedrock."); break; }
        const r = rec(t);
        if (!r){ R("They're not on the books, hon."); break; }
        if ((r.roles.includes(ROLE.HERDMASTER)||r.roles.includes(ROLE.MANDATED)) && !isProprietor(sender)){
          R("Sorry, sugar, only the proprietors can remove herdmasters and mandated farmhands."); break;
        }
        if (!isHerdmaster(sender)){ R("Sorry, hon, that's for herdmasters and proprietors to decide."); break; }
        r.roles = r.roles.filter(x=>x!==ROLE.FARMHAND && x!==ROLE.HERDMASTER && x!==ROLE.MANDATED);
        r.forced = false;
        saveLedger(); audit(sender,"STAFFREMOVE",String(t));
        syncKeys(t, true);
        R("Done, sugar. "+plainName(t)+" is now "+roleString(t)+" — "+keyString(t));
        break;
      }

      case "note": {
        const t = resolveTarget(args[0]);
        if (!t){ R("Whose file, hon? Say ?note, their name or member number, then your note. For example: ?note Bessie Loves praise after milkin'."); break; }
        const r = rec(t,true);
        r.notes = (r.notes?r.notes+"\n":"")+"["+plainName(sender)+"] "+args.slice(1).join(" ");
        saveLedger();
        R("Got it, I've noted that on their file.");
        break;
      }

      /* ── SPOTS ── */
      case "spot": case "spots": {
        const sub = String(args[0]||"").toLowerCase();
        const name = String(args[1]||"").toLowerCase();
        if (!sub || sub === "list"){
          const names = Object.keys(L.spots).sort();
          const age = s => s.at ? Math.floor((Date.now() - s.at)/86400000) : null;
          R(names.length
            ? "📍 SPOTS\n\n"+names.map(n=>"  • "+n+" — "+L.spots[n].X+","+L.spots[n].Y+(age(L.spots[n]) !== null ? " · set "+(age(L.spots[n]) ? age(L.spots[n])+"d ago" : "today") : "")).join("\n")+
              "\n\n?spot set <name> where you stand · ?spot clear <name> [more names] · ?spot clear speaker-* · ?spot clear all · ?spot go <name>"
            : "No spots set yet, hon. Stand somewhere and say ?spot set summon (or safe, staff, rescue, trough, barn, stocks, milking1).");
          break;
        }
        if (!isHerdmaster(sender)){ R("Sorry, sugar, settin' and usin' spots is for herdmasters and proprietors. Plain ?spot shows the list."); break; }
        // clearin' old ones: several names at once, a pattern (speaker-*), or all of them (proprietors, with a yes)
        if (sub === "clear" || sub === "remove" || sub === "delete"){
          const words = args.slice(1).map(w => String(w).toLowerCase()).filter(Boolean);
          if (!words.length){ R("Which spot, sugar? ?spot clear <name> (or several names), ?spot clear speaker-* for all the speakers, or ?spot clear all."); break; }
          let hit;
          if (words[0] === "all"){
            if (!isProprietor(sender)){ R("Clearin' every spot is for proprietors, sugar. You can clear them by name."); break; }
            hit = Object.keys(L.spots);
            if (words[1] !== "yes"){ R("That would clear all "+hit.length+" spots ("+hit.join(", ")+"). Say ?spot clear all yes to be sure."); break; }
          } else hit = Object.keys(L.spots).filter(n => words.some(w => w.endsWith("*") ? n.startsWith(w.slice(0, -1)) : n === w));
          if (!hit.length){ R("No spots match "+words.join(" ")+", hon. Plain ?spot shows the list."); break; }
          for (const n of hit) delete L.spots[n];
          saveLedger(); audit(sender, "SPOT_CLEAR", hit.join(" ").slice(0, 200));
          R("📍 Cleared "+hit.length+" spot"+(hit.length === 1 ? "" : "s")+": "+hit.join(", ")+".");
          break;
        }
        if (!/^[a-z][a-z0-9_-]{1,19}$/.test(name)){ R("Here's how spots work, sugar: ?spot (or ?spot list) shows them all · ?spot set <name> marks where you're standin' · ?spot clear <name> removes one · ?spot go <name> takes you there. A name is one word, 2 to 20 letters, numbers, - or _, startin' with a letter. The ones the farm uses: summon, safe, staff, rescue, trough, barn, stocks, milking1, milking2 and on. For example: ?spot set barn"); break; }
        if (sub === "set"){
          const C = charFor(sender);
          const pos = C && C.MapData && C.MapData.Pos;
          if (!pos){ R("Hmm, I can't see where you're standin', hon. You need to be on the farm map."); break; }
          L.spots[name] = { X:pos.X, Y:pos.Y, by:sender, at:Date.now() };
          saveLedger(); audit(sender,"SPOT",name+" "+pos.X+","+pos.Y);
          R("📍 '"+name+"' is set to "+pos.X+","+pos.Y+", sugar!");
        } else if (sub === "place"){
          // ?spot place <name> <x> <y>: from the Companion's map clicks (or typed), no walkin' needed
          const x = parseInt(args[2], 10), y = parseInt(args[3], 10), wide = W.ChatRoomMapViewWidth || 40, high = W.ChatRoomMapViewHeight || 40;
          if (!(x >= 0 && y >= 0 && x < wide && y < high)){ R("I need a tile on the map, sugar: ?spot place "+name+" <x> <y>, like ?spot place speaker-barn 12 7."); break; }
          L.spots[name] = { X:x, Y:y, by:sender, at:Date.now() };
          saveLedger(); audit(sender,"SPOT",name+" "+x+","+y);
          R("📍 '"+name+"' is set to "+x+","+y+", sugar!");
        } else if (sub === "clear"){
          if (!L.spots[name]){ R("There's no spot called '"+name+"', hon. Plain ?spot shows the list."); break; }
          delete L.spots[name]; saveLedger(); audit(sender,"SPOT_CLEAR",name);
          R("📍 '"+name+"' is cleared, sugar.");
        } else if (sub === "go"){
          const pt = spotFor(name);
          if (!pt){ R("There's no spot called '"+name+"', hon. Plain ?spot shows the list."); break; }
          R(teleport(sender, pt, false) ? "📍 Off you go, sweetie!" : "Shoot, I can't move you. Are you in the farm, and am I still room admin?");
        } else R("Here's how spots work, sugar: ?spot (or ?spot list) shows them all · ?spot set <name> marks where you're standin' · ?spot clear <name> removes one · ?spot go <name> takes you there. A name is one word, 2 to 20 letters, numbers, - or _, startin' with a letter. The ones the farm uses: summon, safe, staff, rescue, trough, barn, stocks, milking1, milking2 and on. For example: ?spot set barn");
        break;
      }

      /* ── TIERS ── */
      case "tier": {
        const t = resolveTarget(args[0]);
        if (!t || !rec(t)){ R("Here's how, sugar: ?tier and their name or member number shows their tier. Add a tier to set it: degraded, naughty, new (or new stock), trained, prize. With naughty or degraded you can add minutes in the stocks too (up to 240). For example: ?tier Bessie  or  ?tier Bessie trained  or  ?tier 123456 naughty 30"); break; }
        if (!args[1]){ R(plainName(t)+": "+(tierOf(t) ? tierName(tierOf(t)) : "no tier yet")); break; }
        const mins = /^\d+$/.test(args[args.length-1]) && args.length > 2 ? parseInt(args[args.length-1],10) : 0;
        const nt = parseTier(args.slice(1, mins ? -1 : undefined).join(""));
        if (!nt){ R("I don't know that tier, hon. Lowest first, they're: degraded · naughty · new (or new stock) · trained · prize. For example: ?tier "+plainName(t)+" trained  or  ?tier "+plainName(t)+" naughty 30"); break; }
        if (t === sender && !isProprietor(sender)){ R("Nice try, sugar, but you can't set your own tier!"); break; }
        const r = rec(t);
        const old = tierOf(t);
        r.tier = nt; saveLedger(); audit(sender,"TIER",t+" "+(old||"-")+"→"+nt);
        const up = CFG.TIERS.indexOf(nt) > CFG.TIERS.indexOf(old);
        if (r.tierUntil){ r.tierUntil = null; r.tierPrev = null; }
        const sm = Math.min(mins, CFG.STOCKS_MAX_MIN);
        R(plainName(t)+" is "+tierName(nt)+" now."+(mins && CFG.PUNISH_TIERS.includes(nt) ? " And into the stocks for "+sm+" minutes." : ""));
        if (mins && CFG.PUNISH_TIERS.includes(nt)) putInStocks(t, sm, sender);
        beep(t, CFG.PUNISH_TIERS.includes(nt)
          ? "🔻 Uh-oh, "+plainName(sender)+" dropped you to "+tierName(nt)+". You'll have to earn your way back up, sugar."
          : (up ? "⬆️ "+plainName(sender)+" moved you up to "+tierName(nt)+"! Such a good animal."
                : "🌾 "+plainName(sender)+" set you to "+tierName(nt)+", hon."));
        break;
      }

      /* ── VET CARD ── */
      case "vet": {
        const t = resolveTarget(args[0]);
        const r = t ? rec(t) : null;
        if (!r){ R("Whose vet card, hon? Say ?vet and the name or member number of somebody on the books, like ?vet Bessie or ?vet 123456."); break; }
        let o = "🩺 VET CARD · "+(r.name||plainName(t))+" ("+t+")"+(charFor(t)?" ● here":"");
        o += "\n\n🐄 WHO\n  "+roleString(t)+(tierOf(t) ? " · "+tierName(tierOf(t)) : "")+(r.species ? " · "+r.species : "");
        o += "\n  Body: "+bodyParts(t).filter(k => k !== "knot").map(k => k === "testes" ? "balls" : k === "penis" ? penisLabel(t)+" cock" : k).join(", ");
        { const pv = r.prod;
          if (pv && pv.preg) o += "\n🍼 Bred by "+pv.preg.sires.map(plainName).join(" & ")+", due "+new Date(pv.preg.due).toLocaleDateString();
          if (r.rights && r.rights.until > Date.now()) o += "\n🔏 Breedin' rights: "+plainName(r.rights.stud); }
        if ((r.herds||[]).length) o += "\nBelongs to: "+herdsLine(t);
        if (r.brand) o += "\nBrand: "+r.brand.mark;
        if (titleNames(t).length) o += "\nTitles: "+titleNames(t).join(", ");
        if (r.naughtyMarks) o += "\nNaughty marks: "+r.naughtyMarks+" (missed milk quota)";
        o += "\nContract: "+(r.contractSigned?"signed ✅":"NOT signed ⚠️");
        o += "\n\n🤍 CARE\n🔴 Hard limits: "+(r.limits||"none on file — ask first");
        o += "\n⚠️ Triggers: "+(r.triggers||"none on file");
        o += "\n🤍 Aftercare: "+(r.aftercare||"none on file");
        if (r.notes) o += "\n📝 Notes:\n"+r.notes;
        R(o);
        break;
      }

      /* ── BRANDS ── */
      case "brand": {
        const t = resolveTarget(args[0]);
        const r = t ? rec(t) : null;
        if (!r){ R("Here's how, sugar: ?brand, their name or member number, then the mark (up to 12 characters: initials, a symbol, a word). "+
              "?brand <who> clear takes it off, and ?brand <who> on its own shows it. For example: ?brand Bessie LA  or  ?brand 123456 clear"); break; }
        const mark = args.slice(1).join(" ").trim();
        const mayBrand = isProprietor(sender) || !!membership(t, sender);
        if (!mark){ R(r.brand ? plainName(t)+" carries "+r.brand.mark+", put there by "+plainName(r.brand.by)+"." : plainName(t)+" is unbranded. Add a mark to brand 'em, like ?brand "+plainName(t)+" LA"); break; }
        if (mark.toLowerCase() === "clear"){
          if (!r.brand){ R("There's no brand on 'em to clear, hon."); break; }
          if (!isProprietor(sender) && r.brand.by !== sender){ R("Sorry, sugar, only "+plainName(r.brand.by)+" or a proprietor can take that off."); break; }
          r.brand = null; saveLedger(); audit(sender,"BRAND_CLEAR",String(t));
          R("Brand's off, hon."); beep(t, "🌾 "+plainName(sender)+" took your brand off, sweetie.");
          break;
        }
        if (!mayBrand){ R("You can only brand stock in your own "+herdWord(sender)+", hon."); break; }
        if (mark.length > 12){ R("Keep it short, sugar: initials, a symbol, or a word, 12 characters at most. For example: ?brand "+plainName(t)+" LA"); break; }
        r.brand = { mark, by:sender, at:Date.now() }; saveLedger(); audit(sender,"BRAND",t+" "+mark);
        R("🔥 "+plainName(t)+" carries "+mark+" now!");
        beep(t, "🔥 "+plainName(sender)+" branded you, sweetie: "+mark+". It shows on ?who and on your record.");
        break;
      }

      /* ── TEASING ── */
      case "tease": {
        const sub = String(args[0]||"list").toLowerCase();
        if (sub === "add"){
          const line = args.slice(1).join(" ").trim();
          if (!line){ R("Give me a line, sugar! "+"?tease add <line> adds one (%name% becomes their name), ?tease list shows them all, ?tease remove <number> takes one off. For example: ?tease add Somebody looks awful cute today, %name%."); break; }
          L.tease.push({ text:line, by:sender, at:Date.now() }); saveLedger(); audit(sender,"TEASE_ADD",line.slice(0,60));
          R("Added! "+L.tease.length+" teasin' line"+(L.tease.length===1?"":"s")+" on file.");
        } else if (sub === "remove" || sub === "del"){
          const i = parseInt(args[1],10)-1;
          if (!(i>=0 && i<L.tease.length)){ R("Which number, hon? Say ?tease remove and a number from ?tease list, like ?tease remove 2."); break; }
          const gone = L.tease.splice(i,1)[0]; saveLedger(); audit(sender,"TEASE_REMOVE",gone.text.slice(0,60));
          R("Took it off: "+gone.text);
        } else {
          const opted = Object.values(L.people).filter(r=>r.teaseOptIn).length;
          R(L.tease.length
            ? "😈 TEASING LINES ("+L.tease.length+") · "+opted+" opted in\n\n"+L.tease.map((x,i)=>(i+1)+". "+x.text).join("\n")+
              "\n\n?tease add <line> · ?tease remove <n>"
            : "No lines yet, sugar. "+"?tease add <line> adds one (%name% becomes their name), ?tease list shows them all, ?tease remove <number> takes one off. For example: ?tease add Somebody looks awful cute today, %name%.");
        }
        break;
      }

      case "teaseme": {
        const r = rec(sender);
        if (!r || !r.roles.length){ R("That's just for folks on the books, sugar. Say ?apply first!"); break; }
        const v = String(args[0]||"").toLowerCase();
        r.teaseOptIn = v ? (v === "on" || v === "yes") : !r.teaseOptIn;
        state.teaseNext.delete(sender);
        saveLedger();
        R(r.teaseOptIn ? "😈 Ooh, you'll hear from me now and then while you're on the farm, sugar. Say ?teaseme off to stop."
                       : "Alright, hon. No more whisperin' in your ear. Say ?teaseme on if you miss me.");
        break;
      }

      /* ── NOTICE BOARD ── */
      case "notice": {
        if (!args.length || !isProprietor(sender)){
          R(L.notice ? "📌 NOTICE BOARD\n\n"+L.notice.text+"\n\n— "+plainName(L.notice.by)+", "+new Date(L.notice.at).toLocaleDateString()
                     : "Notice board's bare right now, hon.");
          break;
        }
        if (String(args[0]).toLowerCase() === "clear"){
          L.notice = null; saveLedger(); R("Notice board's all cleared."); break;
        }
        L.notice = { text:rest, by:sender, at:Date.now() }; saveLedger(); audit(sender,"NOTICE",rest.slice(0,80));
        R("📌 Pinned it up! Everybody who walks in gets it.");
        break;
      }

      case "appclear": {
        const t = resolveTarget(args[0]);
        if (!t){ R("Whose interview, hon? Say ?appclear and their name or member number, like ?appclear Bessie or ?appclear 123456. It clears paperwork they started but never finished."); break; }
        if (!state.sessions.has(t)){ R(plainName(t)+" isn't in the middle of an interview, sugar."); break; }
        const s = state.sessions.get(t);
        state.sessions.delete(t); audit(sender,"APPCLEAR",String(t));
        R("Cleared "+plainName(t)+"'s half-done paperwork, sugar.");
        reply(t, "Your half-done paperwork got cleared, sugar. Say ?apply whenever you're ready to start fresh!", s.ch);
        break;
      }

      /* ── PRODUCTION & BREEDING ── */
      case "shotlog": {
        const rows = (L.shotLog||[]).slice(-10).reverse();
        R(rows.length ? "💉 LAST SHOTS I SAW\n\n"+rows.map(x => new Date(x.t).toLocaleTimeString()+" — "+plainName(x.by)+" → "+plainName(x.to)+
                        "\n    "+x.item+" · tags: "+(x.tags.join(", ")||"none I know")).join("\n")
                      : "I haven't seen a single shot yet, hon. If somebody just used an injector and it's not here, I'm not seein' the Inject at all.");
        break;
      }

      case "milkable": {
        const r = rec(sender);
        if (!r || !r.roles.length){ R("You'll need to be on the books first, hon. ?apply and we'll get you sorted. 🌾"); break; }
        const v = String(args[0]||"").toLowerCase();
        if (v && !["on","off","yes","no"].includes(v)){ R("Just say ?milkable on or ?milkable off, sweetie. Leave it blank and it flips."); break; }
        const now = v ? (v === "on" || v === "yes") : !makesMilk(sender);
        if (now && limitBlocks(sender,"milk")){ R("Your hard limits rule that out, sugar, so I'll keep it off. If you want it, change your limits with staff first."); break; }
        r.milkable = now; prodOf(sender); saveLedger(); audit(sender,"MILKABLE",now?"on":"off");
        R(now ? "🥛 You're milkable now, darlin'! You'll start fillin' up by the hour. ?stats to watch it, and ?help barn for how grades work."
              : "Alrighty, no more milk for you. ?milkable on whenever you change your mind. 💛");
        break;
      }

      case "gender": {
        // ?gender → yours · ?gender <female|male|futa|femboy> · staff: ?gender <who> <gender>
        let t = sender, g = String(args[0]||"").toLowerCase();
        if (args.length > 1){ t = resolveTarget(args[0]); g = String(args[1]||"").toLowerCase(); if (t !== sender && !isStaff(sender)){ R("Only staff can set somebody else's, sugar."); break; } }
        const r = t && rec(t);
        if (!r || !r.roles.length){ R("That's just for folks on the books, sugar. ?apply first!"); break; }
        if (!g){ R((t === sender ? "You're" : plainName(t)+" is")+" down as "+(r.gender || "not set yet")+", hon. Pick one with ?gender female, male, futa or femboy."); break; }
        if (!GENDERS.includes(g)){ R("Just one of these, hon: ?gender female, male, futa or femboy."); break; }
        if (g === "futa" && limitBlocks(t,"futa")){ R("Their hard limits rule out futa, sugar, so I'll leave it."); break; }
        const was = r.gender; r.gender = g;
        if (g === "futa") r.futa = true; else if (was === "futa") r.futa = false;
        prodOf(t); saveLedger(); audit(sender, "GENDER", t+" "+g);
        R("🌸 "+(t === sender ? "You're" : plainName(t)+" is")+" down as "+g+" now, sugar."+(g === "futa" ? " Futa makes milk and semen both." : "")+" It picks your farm outfit, too.");
        break;
      }

      case "futa": {
        const r = rec(sender);
        if (!r || !r.roles.length){ R("You'll need to be on the books first, hon. ?apply and we'll get you sorted. 🌾"); break; }
        const v = String(args[0]||"").toLowerCase();
        if (v && !["on","off","yes","no"].includes(v)){ R("Just say ?futa on or ?futa off, sweetie. Leave it blank and it flips."); break; }
        const on = v ? (v === "on" || v === "yes") : !r.futa;
        if (on && limitBlocks(sender,"futa")){ R("Your hard limits rule that out, sugar, so I'll keep it off. If you want it, change your limits with staff first."); break; }
        r.futa = on; prodOf(sender); saveLedger(); audit(sender,"FUTA",on?"on":"off");
        R(on ? "🌸 Futa it is, darlin'! You'll make milk and semen both, you can breed with ?breed and ?cum, and you can be bred in the vulva too (if you've said ?breedable on). ?futa off whenever you like."
             : "Alrighty, futa's off. I'll go by what you're wearin' again, sugar. 💛");
        break;
      }

      case "size": case "sizes": {
        // ?size · ?size <part> <level> · staff: ?size <who> [<part> <level>]
        let t = sender, a = args.slice();
        if (a.length && !partFrom(a[0])){
          const w = resolveTarget(a[0]);
          if (!w || !rec(w)){ R("I don't know who that is, sugar. Here's how: ?size shows yours, ?size udder 5 sets yours. Staff can add a name first, like ?size Bessie or ?size Bessie butt 4."); break; }
          if (w !== sender && !isStaff(sender)){ R("Sorry, hon, only staff can set somebody else's sizes. Just ?size shows yours."); break; }
          t = w; a = a.slice(1);
        }
        if (!rec(t) || !rec(t).roles.length){ R("You'll need to be on the books first, hon. ?apply and we'll get you sorted. 🌾"); break; }
        if (!a.length){
          prodTick();
          const mine = bodyParts(t);
          const label = k => k === "penis" ? "Cock" : CFG.SIZES[k].label;
          const lines = mine.map(k => "  "+label(k)+": "+sizeName(t,k)+(k === "penis" ? ", "+penisLabel(t) : ""));
          const ex = { udder:"udder DD", penis:"penis 9", testes:"balls 5", vulva:"vulva snug", butt:"butt 3", throat:"throat 2" };
          const eg = mine.filter(k => ex[k]).slice(0,2).map(k => "?size "+ex[k]).join(" or ");
          R("📏 "+plainName(t).toUpperCase()+"'S SIZES\n"+lines.join("\n")+"\n\nSet one with ?size <part> <size>, like "+eg+". "+
            "Your parts: "+mine.filter(k => k !== "knot").map(k => k === "testes" ? "balls" : k).join(", ")+". ✨Hyper sizes only come from shots. ?help body tells what they do.");
          break;
        }
        const part = partFrom(a[0]), S = part && CFG.SIZES[part];
        if (part && !hasPart(t, part)){ const w = noPartWhy(t, part); R(w.charAt(0).toUpperCase()+w.slice(1)+"."); break; }
        let lvl = parseInt(a[1],10);
        if (S && isNaN(lvl) && a[1] && S.names){
          const said = a.slice(1).join(" ").toLowerCase().replace(/\s*cups?$/,"");
          let i = S.names.indexOf(said);
          if (i < 0 && S.cups) i = S.cups.map(c => c.toLowerCase()).indexOf(said);
          if (i >= 0) lvl = i+1;
        }
        const top = S && S.natural;   // hyper only comes from shots
        if (!S || !(lvl >= 1 && lvl <= S.max)){
          R("Here's how, sugar: ?size, the part, then a size. Udder (or breasts, boobs, tits, chest) goes by cup, AA up to "+CFG.SIZES.udder.cups[CFG.SIZES.udder.natural-1]+" (or 1 to "+CFG.SIZES.udder.natural+"). "+
            "Balls (or testes, testicles, nuts), vulva (or pussy, cunt), butt (or ass, anus, anal) and throat (or mouth, oral) go from 1 to "+CFG.SIZES.udder.natural+
            " (or the name, like loose); penis (or cock, dick, shaft) goes by inches, 1 to "+CFG.SIZES.penis.natural+". "+
            "For example: ?size udder DD  or  ?size butt slightly gaped  or  ?size penis 9. Plain ?size shows 'em all."); break;
        }
        if (lvl > top){ R("Whoa, that's ✨hyper, hon! "+S.label+" only goes past "+S.natural+(S.inches?"\"":"")+" with shots. Try an injector with \""+
                           (CFG.SIZE_TAGS[part] ? CFG.SIZE_TAGS[part].up[0] : "growth")+"\" on it."); break; }
        if (t === sender && !isStaff(sender) && !CFG.SIZE_SELF_SET){ R("Sizes are set by staff and shots here, hon. Ask a farmhand!"); break; }
        setSize(t, part, lvl, true); saveLedger(); audit(sender,"SIZE",t+" "+part+" "+lvl);
        R("📏 Got it! "+plainName(t)+"'s "+S.label.toLowerCase()+" is "+sizeName(t,part)+" now.");
        break;
      }

      case "measure": {
        // a public tape-measure emote: yourself, or anybody if you're staff
        const t = args[0] ? resolveTarget(args[0]) : sender;
        if (!t || !rec(t)){ R("Who're we measurin', sugar? ?measure does you, and staff can add a name or member number, like ?measure Bessie."); break; }
        if (t !== sender && !isStaff(sender)){ R("Only staff can measure somebody else, hon. ?measure does you!"); break; }
        if (!charFor(t)){ R(plainName(t)+" has to be here on the farm to get measured, sugar."); break; }
        prodTick();
        const mp = bodyParts(t), nm = plainName(t), say2 = [];
        if (mp.includes("udder")) say2.push("loops the tape round "+nm+"'s chest and gives each breast a heft: "+CFG.SIZES.udder.cups[udderLevel(t)-1]+" cup, "+CFG.SIZES.udder.names[udderLevel(t)-1]);
        if (mp.includes("penis")) say2.push("lays the tape along their "+penisLabel(t)+" cock: "+sizeOf(t,"penis")+" inches, "+sizeWord("penis", sizeOf(t,"penis"))+(mp.includes("knot") ? ", knot "+sizeWord("knot", sizeOf(t,"knot")) : ""));
        if (mp.includes("testes")) say2.push("cups their balls in her palm: "+sizeWord("testes", sizeOf(t,"testes")));
        const holes = ["vulva","butt","throat"].filter(k => mp.includes(k)).map(k => ({ vulva:"pussy", butt:"ass", throat:"throat" })[k]+" "+sizeWord(k, sizeOf(t,k)));
        if (holes.length) say2.push("checks how much they'll take: "+holes.join(", "));
        const belly = bellyWord(t); if (belly) say2.push("pats a belly that's "+belly);
        emote("📏 The farm girl pulls out her tape measure and gets right up close with "+nm+". She "+say2.join("; she ")+". She jots it all down with a wicked little grin.");
        break;
      }

      case "freeuse": case "tally": case "eggs": {
        const r = rec(sender);
        if (!r || !r.roles.length){ R("That's just for folks on the books, sugar. Say ?apply first!"); break; }
        const v = String(args[0]||"").toLowerCase();
        if (v && !["on","off","yes","no"].includes(v)){ R("Just say ?"+cmd+" on or ?"+cmd+" off, sweetie. Leave it blank and it flips."); break; }
        const on = v ? (v === "on" || v === "yes") : !r[cmd];
        if (on && (limitBlocks(sender) || (cmd === "eggs" && limitBlocks(sender, "eggs")))){ R("Your hard limits rule that out, sugar, so I'll keep it off."); break; }
        if (on && cmd === "freeuse" && !r.breedable){ R("You'll need ?breedable on first, sugar. Then ?freeuse on lets any stud have you without askin'."); break; }
        r[cmd] = on; saveLedger(); audit(sender, cmd.toUpperCase(), on ? "on" : "off");
        R({ freeuse: on ? "🔓 Free use: ON. Any stud can breed or paint you without askin' first. ?freeuse off any time and they'll have to ask again."
                        : "🔐 Free use: off. Studs have to ask, and you say yes or no.",
            tally:   on ? "✏️ Tally marks: ON. I'll count every load on your thigh, show it on ?who, and you can make the board as cumdump of the day."
                        : "✏️ Tally marks are off the board. I still count 'em on your ?stats.",
            eggs:    on ? "🥚 Eggs: ON. A draconic stud's load might leave a clutch in you; a tie makes it likelier."
                        : "🥚 Eggs: off. No clutches for you." }[cmd]);
        break;
      }

      case "edge": {
        const t = resolveTarget(args[0]);
        if (!t || !rec(t)){ R("Who're we edgin', sugar? ?edge <who>, like ?edge Rex or ?edge Bessie. A stud's next load gets bigger; a pussy edged gets likelier to take the next breedin'. Futa: ?edge <who> cock or pussy."); break; }
        if (limitBlocks(t)){ R("Their limits rule that out, sugar."); break; }
        const away = missing(sender, t);
        if (away){ R(away === sender ? "You've gotta be here on the map, sugar." : plainName(t)+" has to be here on the map, hon."); break; }
        // which to edge: what they asked for, else a cock if they've got one, else a pussy
        const want = String(args[1]||"").toLowerCase();
        const pussy = /^(pussy|vulva|cunt|clit)$/.test(want) || (!/^(cock|penis|dick)$/.test(want) && !makesSemen(t));
        if (pussy){
          if (!hasVulva(t)){ R(plainName(t)+" hasn't got a pussy to edge, hon."); break; }
          if (holeBlocked(t, "vulva")){ R(plainName(t)+"'s pussy is locked away under "+holeBlocked(t, "vulva")+", sugar."); break; }
          const vp = prodOf(t), now = Date.now();
          if (now - (vp.vEdgeAt||0) < 60000){ R("Let 'em catch their breath a minute, sugar."); break; }
          if (now - (vp.vEdgeAt||0) > CFG.VEDGE_HOURS*3600000) vp.vEdges = 0;   // old edges have worn off
          vp.vEdgeAt = now; vp.vEdges = Math.min(CFG.EDGE_MAX, (vp.vEdges||0) + 1);
          if (!runScene("edgeVulva", t, { n: plainName(t), b: plainName(sender), bMn: sender, k: vp.vEdges, icon: "😈" }))
            emote("😈 "+plainName(sender)+" works "+plainName(t)+"'s pussy right to the brink, then pulls away. Edge number "+vp.vEdges+".", t);
          if (vp.vEdges >= CFG.EDGE_PENT) later(() => emote("😤 "+plainName(t)+" is edged so raw they're drippin' down their thighs, achin' to be bred. The next one's gonna take, sure as anything.", t), 60000);
          saveLedger(); audit(sender, "EDGE", t+" pussy "+vp.vEdges);
          R("😈 Edged "+plainName(t)+"'s pussy ("+vp.vEdges+"). Their next breedin' is "+Math.round(100*CFG.VEDGE_X*vp.vEdges)+"% likelier to take, for the next "+CFG.VEDGE_HOURS+" hours.");
          break;
        }
        if (!makesSemen(t)){ R(plainName(t)+" hasn't got a cock to edge, hon."); break; }
        const sp = prodOf(t), now = Date.now();
        if (now - (sp.edgeAt||0) < 60000){ R("Let 'em catch their breath a minute, sugar."); break; }
        sp.edgeAt = now; sp.edges = (sp.edges||0) + 1;
        const n = plainName(t), by = plainName(sender), k = sp.edges;
        const lines = [by+" strokes "+n+" slow and tight right up to the edge, then lets go. Their cock throbs, leakin', with nothin' to show for it.",
                       by+" works "+n+" until they're beggin' and shakin', then stops cold. A desperate, whiny groan. That's "+k+".",
                       n+" bucks into "+by+"'s hand, so close, so close, and "+by+" pulls away with a grin. Edge number "+k+"."];
        emote("😈 "+lines[Math.floor(Math.random()*lines.length)]);
        if (sp.edges >= CFG.EDGE_PENT && !sp.pentUp){ sp.pentUp = true;
          emote("😤 "+n+" is edged so raw their balls ache. All pent up now, and the next load's gonna be enormous."); }
        saveLedger(); audit(sender, "EDGE", t+" "+sp.edges);
        R("😈 Edged "+n+" ("+sp.edges+"). Next load: +"+Math.round(100*CFG.EDGE_X*Math.min(sp.edges, CFG.EDGE_MAX))+"%.");
        break;
      }

      case "praise": case "degrade": {
        const r = rec(sender);
        if (!r || !r.roles.length){ R("That's just for folks on the books, sugar."); break; }
        const v = String(args[0]||"").toLowerCase();
        if (v && !["on","off","yes","no"].includes(v)){ R("Just say ?"+cmd+" on or ?"+cmd+" off, sweetie."); break; }
        const key = cmd === "praise" ? "praiseMe" : "degradeMe";
        const on = v ? (v === "on" || v === "yes") : !r[key];
        if (on && cmd === "degrade" && /\\b(degrad\\w*|humiliat\\w*|name.?call\\w*|insult\\w*)\\b/i.test(r.limits||"")){ R("Your hard limits rule that out, sugar."); break; }
        r[key] = on; saveLedger();
        R(cmd === "praise"
          ? (on ? "💗 Praise: ON. When staff tell you you're a good girl (good cow, good pup…), I'll count it and show everybody how you glow." : "💗 Praise counting is off.")
          : (on ? "🥀 Degradation: ON. When staff call you a slut, a breeder, a cow and the like, I'll count it and show the blush." : "🥀 Degradation counting is off."));
        break;
      }

      case "yes": case "no": {
        if (!answerPending(sender, cmd === "yes")) R("There's nothin' waitin' on a yes or no from you right now, hon.");
        break;
      }

      case "wash": {
        const t = args[0] && isStaff(sender) ? resolveTarget(args[0]) : sender;
        const p = t && rec(t) ? prodOf(t) : null;
        if (!p || !paintedText(t)){ R((t === sender ? "You're" : plainName(t)+" is")+" clean as a whistle, sugar."); break; }
        const was = paintedText(t); p.painted = null; saveLedger();
        if (onMap(t)) emote("🚿 "+plainName(t)+" gets hosed down at the trough, washin' the "+was+" clean. Shame, it was a good look.");
        else R("All washed up, sugar.");
        break;
      }

      case "quota": {
        // ?quota · staff: ?quota <who> · ?quota <who> <mL|off|default|clear>
        let t = sender;
        if (args[0]){ t = resolveTarget(args[0]); if (!t || !rec(t)){ R("I don't know who that is, sugar."); break; }
                      if (t !== sender && !isStaff(sender)){ R("Only staff can look at somebody else's quota, hon."); break; } }
        const r = rec(t);
        if (!r){ R("You need to be on the books first, sugar."); break; }
        if (args[1]){
          if (!isStaff(sender)){ R("Only staff can set quotas, hon."); break; }
          const v = String(args[1]).toLowerCase();
          if (v === "clear"){ r.naughtyMarks = 0; saveLedger(); R("📋 "+plainName(t)+"'s naughty marks are wiped clean."); break; }
          if (v === "default") delete r.quota;
          else if (v === "off") r.quota = 0;
          else { const n = parseFloat(v); if (!(n > 0)){ R("Give me mL, off, default or clear, sugar. e.g. ?quota "+plainName(t)+" 1500"); break; } r.quota = Math.round(n); }
          saveLedger(); audit(sender, "QUOTA", t+" "+v);
          R("📋 "+plainName(t)+"'s daily quota: "+(quotaOf(t) ? ml(quotaOf(t)) : "none")+".");
          break;
        }
        const q = quotaOf(t);
        if (!q){ R("📋 "+(t === sender ? "You don't" : plainName(t)+" doesn't")+" have a milk quota, sugar."); break; }
        R("📋 "+plainName(t)+"'s quota: "+ml(milkedOn(t, dayKey()))+" of "+ml(q)+" in the pail today. Streak: "+(r.quotaStreak||0)+" (at "+CFG.QUOTA_STREAK_UP+" you move up a tier). "+
          "Naughty marks: "+(r.naughtyMarks||0)+". Stalls and hand milkin' count; nursin' doesn't.");
        break;
      }

      case "nomilk": {
        const t = resolveTarget(args[0]);
        if (!t || !rec(t)){ R("Here's how, sugar: ?nomilk <who> <hours> caps their teats, ?nomilk <who> off lifts it. e.g. ?nomilk Bessie 6"); break; }
        if (limitBlocks(t, "milk")){ R("Their limits rule out milk play, sugar."); break; }
        const p = prodOf(t);
        if (/^(off|stop|lift)$/i.test(args[1]||"")){ p.milkDeniedUntil = 0; saveLedger(); R("🥛 "+plainName(t)+"'s teats are uncapped."); tell(t, "🥛 Your teats are uncapped, sugar. Go get milked!"); break; }
        const hh = parseFloat(args[1]);
        if (!(hh > 0 && hh <= 72)){ R("How many hours, sugar? 1 to 72. e.g. ?nomilk "+plainName(t)+" 6"); break; }
        p.milkDeniedUntil = Date.now() + hh*3600000; saveLedger(); audit(sender, "NOMILK", t+" "+hh+"h");
        R("🚫 Capped "+plainName(t)+" for "+hh+" hours.");
        if (onMap(t)) emote("🚫 "+plainName(sender)+" snaps little caps over "+plainName(t)+"'s nipples. No milkin' for "+hh+" hours, no matter how full and achy those udders get.");
        else tell(t, "🚫 "+plainName(sender)+" capped your teats for "+hh+" hours, sugar. No milkin' till then.");
        break;
      }

      case "inspect": {
        const t = resolveTarget(args[0]);
        if (!t || !rec(t)){ R("Who're we inspectin', sugar? ?inspect <who>, like ?inspect Bessie."); break; }
        const away = missing(sender, t);
        if (away){ R(away === sender ? "You've gotta be here on the map, sugar." : plainName(t)+" has to be here on the map, hon."); break; }
        prodTick();
        const p = prodOf(t), parts = bodyParts(t), n = plainName(t), I0 = plainName(sender), bits = [];
        bits.push(I0+" takes "+n+" by the jaw and checks their teeth"+(tierOf(t) ? ": a "+tierName(tierOf(t))+" specimen" : "")+(rec(t).species ? ", "+rec(t).species+" stock" : "")+".");
        if (parts.includes("udder")) bits.push("Hefts each breast: "+CFG.SIZES.udder.cups[udderLevel(t)-1]+" cup"+(makesMilk(t) ? ", "+Math.round(100*p.milk/Math.max(1,milkCap(t)))+"% full"+(p.milk > milkCap(t)*0.6 ? ", and a bead of milk wells up at the squeeze" : "") : "")+".");
        if (parts.includes("penis")) bits.push("Rolls "+n+"'s "+penisLabel(t)+" cock in a palm, "+sizeOf(t,"penis")+" inches, and squeezes those "+sizeWord("testes", sizeOf(t,"testes"))+" balls"+(p.semen > semenCap(t)*0.7 ? ", heavy and full" : "")+".");
        const holes = [];
        if (parts.includes("vulva")) holes.push("pussy "+sizeWord("vulva", sizeOf(t,"vulva"))+((p.held.vulva||0) >= 5 ? ", still drippin' "+ml(p.held.vulva) : ""));
        holes.push("ass "+sizeWord("butt", sizeOf(t,"butt"))+((p.held.butt||0) >= 5 ? ", still holdin' "+ml(p.held.butt) : ""));
        bits.push("Spreads 'em open for a good look: "+holes.join("; ")+".");
        const belly = bellyWord(t); if (belly) bits.push("Pats a belly that's "+belly+".");
        if (paintedText(t)) bits.push("Notes the dried seed on their "+paintedText(t)+".");
        if (inHeat(p)) bits.push("Sniffs: in heat, and dripping for it.");
        bits.push(I0+" marks the card"+(makesMilk(t) ? ": milk grade "+milkGrade(t) : "")+". Good stock.");
        emote("🔍 "+bits.join(" "));
        break;
      }

      case "breedable": case "fertile": case "naturalheat": {
        const r = rec(sender);
        if (!r || !r.roles.length){ R("That's just for folks on the books, sugar. Say ?apply first!"); break; }
        const field = cmd === "naturalheat" ? "naturalHeat" : cmd;
        const v = String(args[0]||"").toLowerCase();
        if (v && !["on","off","yes","no"].includes(v)){ R("Just say ?"+cmd+" on or ?"+cmd+" off, sweetie. Leave it blank and it flips. For example: ?"+cmd+" on"); break; }
        const on = v ? (v === "on" || v === "yes") : !r[field];
        if (on && limitBlocks(sender, field === "naturalHeat" ? "heat" : "breed")){ R("Your hard limits rule that out, sugar, so I'll keep it off. If you want it, change your limits with staff first."); break; }
        r[field] = on;
        if (field === "naturalHeat" && on) prodOf(sender).nextHeatAt = Date.now() + CFG.PROD.NATURAL_HEAT_EVERY_D*86400000;
        saveLedger(); audit(sender, field.toUpperCase(), on?"on":"off");
        R({ breedable:"Breedable", fertile:"Fertile (can catch)", naturalHeat:"Natural heat every "+CFG.PROD.NATURAL_HEAT_EVERY_D+" days" }[field]+": "+(on?"ON":"off")+". Say ?"+cmd+" on or ?"+cmd+" off any time to set it, hon; plain ?"+cmd+" flips it.");
        break;
      }

      case "breed": {
        // whoever sends it is the stud: ?breed <who…> [hole] · ?breed stop
        const stud = sender;
        if (/^(status|check|scene)$/i.test(args[0]||"")){
          const sc = state.scenes.get(stud);
          if (!sc){ R("You don't have a breedin' scene open, hon. ?breed <who> [hole] opens one."); break; }
          const left = Math.max(0, sceneCooldown(stud) - Math.floor((Date.now()-(sc.lastCum||0))/1000));
          R("🐂 Your scene: "+sc.with.map(plainName).join(" and ")+", in the "+(sc.hole||"vulva")+". "+(left ? "Next load ready in "+left+" seconds." : "Ready for a load right now!")+
            " Say cum (or orgasm, climax, breed, fill them up) in your chat or emotes. ?breed stop ends it.");
          break;
        }
        if (/^(stop|end|done|off)$/i.test(args[0]||"")){
          const had = state.scenes.get(stud);
          state.scenes.delete(stud);
          R(had ? "🐂 All done! I've closed your breedin' scene with "+had.with.map(plainName).join(" and ")+", sugar." : "You don't have a breedin' scene open, hon.");
          break;
        }
        const holeList = args.length > 1 ? holesFrom(args[args.length-1]) : null;
        const holeArg = holeList ? holeList.join("+") : null;
        if (holeList && holeList.length > 1 && !(makesSemen(stud) && typeInfo(stud).double)){ R("Two holes at once takes a double cock, sugar! Pick one, like ?breed Bessie "+holeList[0]+"."); break; }
        const who = holeArg ? args.slice(0,-1) : args;
        const rest2 = who.map(resolveTarget).filter(t => t && t !== stud);
        if (!rest2.length){ R("Who're we breedin', sugar? Say ?breed, a name or member number (more than one is fine, separated by spaces), then the hole if you like. You're the stud. "+
                             "The hole can be vulva (or pussy, cunt), butt (or ass, anus, anal), or mouth (or throat, oral). Leave it out and it's vulva. "+
                             "For example: ?breed Bessie  or  ?breed Bessie butt  or  ?breed Bessie Daisy 123456 mouth. "+
                             "While it's open, just roleplay: say cum (or orgasm, climax, breed, fill them up) in your chat or emotes and I'll fill 'em. ?breed stop ends it."); break; }
        if (!rec(stud)){ R("You need to be on the books to breed the stock, sugar. Say ?apply first!"); break; }
        const bad = rest2.filter(t => !rec(t) || !rec(t).breedable || limitBlocks(t));
        if (bad.length){ R(bad.map(plainName).join(", ")+" ain't breedable, hon. They'd have to say ?breedable on themselves (and their limits have to allow it)."); break; }
        if (!prodOf(stud)){ R(plainName(stud)+" ain't on the books, sugar."); break; }
        const away = missing(stud, ...rest2);
        if (away){ R(away === stud ? "You've gotta be here on the map to breed, sugar." : plainName(away)+" isn't here on the map right now, hon. Everybody in the scene needs to be in the room."); break; }
        seePenis(stud);
        const hole0 = holeArg || "vulva";
        const asked = rest2.filter(t => !breedConsent(stud, t)), ready = rest2.filter(t => breedConsent(stud, t));
        for (const t of asked) askBreed(stud, t, hole0);
        if (!ready.length){ R("I've asked "+asked.map(plainName).join(" and ")+" first, sugar. The scene opens the moment they say yes."); break; }
        if (asked.length) R("I've asked "+asked.map(plainName).join(" and ")+" first; they'll join when they say yes.");
        state.scenes.set(stud, { with: ready, hole: hole0, at: Date.now(), by: sender, lastCum: 0 });
        emote("🐂 The farm girl leads "+plainName(stud)+" over and puts 'em to "+ready.map(plainName).join(" and ")+" ("+holeText(hole0)+").");
        R("Your scene's open, sugar. Just roleplay it: every time you say cum (or orgasm, climax, breed, fill them up) I'll fill "+(ready.length > 1 ? "whoever you name, or the first one," : "'em")+
          " in the "+hole0+". Name a hole in your emote (pussy, ass, mouth) to switch, or say on her face (tits, belly…) to paint 'em. ?breed status shows your scene, ?breed stop ends it.");
        break;
      }

      case "cum": {
        // whoever sends it is the stud: ?cum <who> [vulva|butt|mouth]
        const stud = sender;
        const t = resolveTarget(args[0]);
        if (t && t !== stud && args[1] && PAINT_AREAS[String(args[1]).toLowerCase()] && !holeFrom(args[1])){ paint(stud, t, args[1], R); break; }
        const holes = args[1] ? holesFrom(args.slice(1).join("")) : ["vulva"];
        if (!t || t === stud || !holes){ R("Here's how, sugar: ?cum, then who (a name or member number, not yourself), then the hole. You're the stud. "+
                                                      "The hole can be vulva (or pussy, cunt), butt (or ass, anus, anal), or mouth (or throat, oral). Leave it out and it's vulva. "+
                                                      "For example: ?cum Bessie butt  or  ?cum 123456"); break; }
        cumInto(stud, t, holes, R, false);
        break;
      }

      case "milk": case "collect": {
        const t = resolveTarget(args[0]);
        if (!t || !rec(t)){ R("Here's how, sugar: ?milk (for milk) or ?collect (for semen), their name or member number, then an amount in mL if you like. Leave the amount out to take it all. "+
                           "For example: ?milk Bessie  or  ?milk Bessie 500  or  ?collect 123456 20"); break; }
        const amt = args[1] ? parseFloat(args[1]) : Infinity;
        if (!(amt > 0)){ R("Give me an amount in mL, sugar, or leave it out to take it all. For example: ?milk Bessie 500  or  ?collect 123456 20"); break; }
        const away = missing(sender, t);
        if (away){ R(away === sender ? "You've gotta be here on the map to do the milkin', sugar." : plainName(t)+" isn't here on the map right now, hon. You both need to be in the room."); break; }
        prodTick();
        if (cmd === "milk" && milkDenied(t)){ R("🚫 "+plainName(t)+"'s teats are capped for another "+Math.ceil((prodOf(t).milkDeniedUntil-Date.now())/60000)+" minutes, sugar. Let 'em ache."); break; }
        const got = cmd === "milk" ? drainMilk(t, amt) : drainSemen(t, amt);
        saveLedger(); audit(sender, cmd.toUpperCase(), t+" "+Math.round(got));
        if (got < 1){ R(plainName(t)+" is dry right now, sugar. Give 'em a while to fill back up."); break; }
        if (cmd === "collect"){
          L.jars = (L.jars||[]).filter(j => Date.now() - j.t < CFG.JAR_DAYS*86400000);
          L.nextJar = (L.nextJar||0) + 1;
          L.jars.push({ id:L.nextJar, stud:t, ml:got, t:Date.now(), pent:false });
          saveLedger();
          R("🫙 Bottled as jar #"+L.nextJar+" ("+ml(got)+" of "+plainName(t)+"'s). Staff can ?inseminate <who> "+L.nextJar+" [hole] within "+CFG.JAR_DAYS+" days.");
        }
        // a little scene, beat by beat (10g-scenes.js); if one's already playin' for them, just the one line
        const scene = (cmd === "milk" ? "milk" : "collect") + (t === sender ? "Self" : "");
        if (!runScene(scene, t, { n: plainName(t), b: plainName(sender), bMn: sender, ml: ml(got), icon: cmd === "milk" ? "🥛" : "🧪" }))
          emote(cmd === "milk" ? "🥛 "+(t === sender ? plainName(t)+" milks "+ml(got)+" into the pail" : plainName(sender)+" milks "+plainName(t)+": "+ml(got)+" into the pail")+". Good job, hon!"
                               : "🧪 "+(t === sender ? plainName(t)+" fills the collection jar with "+ml(got) : plainName(sender)+" collects "+ml(got)+" from "+plainName(t))+". Good job, hon!");
        break;
      }

      case "stats": {
        const t = args[0] ? resolveTarget(args[0]) : sender;
        if (!t || !rec(t)){ R("They're not on the books, sugar. Just ?stats shows your own; staff can add a name or member number, like ?stats Bessie."); break; }
        if (t !== sender && !isStaff(sender)){ R("Sorry, hon, those aren't yours to read. Just ?stats shows your own."); break; }
        prodTick();
        R(statsText(t));
        break;
      }

      case "board": {
        rollBoard();
        const top = o => Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,5)
                     .map(([m,v],i)=>"  "+(i+1)+". "+plainName(parseInt(m,10))+" — "+ml(v)+" (grade "+milkGrade(parseInt(m,10))+")").join("\n") || "  (nobody yet)";
        const sires = Object.entries(L.yield.s||{}).sort((a,b)=>b[1]-a[1]).slice(0,5)
                       .map(([m,n],i)=>"  "+(i+1)+". "+plainName(parseInt(m,10))+" — "+n+" caught").join("\n") || "  (nobody yet)";
        const dump = Object.entries(L.yield.u||{}).sort((a,b)=>b[1]-a[1])[0];
        R("🥛 YIELD BOARD\n\nToday\n"+top(L.yield.d)+"\n\nThis week (top goes prize)\n"+top(L.yield.w)+"\n\n🐂 Top sires this week\n"+sires+
          (dump ? "\n\n🪣 Farm cumdump of the day: "+plainName(parseInt(dump[0],10))+" ("+dump[1]+" times)" : ""));
        break;
      }

      case "pedigree": {
        const t = args[0] ? resolveTarget(args[0]) : sender;
        if (!t){ R("I don't know that one, sugar. Just ?pedigree shows your own stud book; add a name or member number for somebody else's, like ?pedigree Bessie or ?pedigree 123456."); break; }
        // kept simple: who they had litters with, and how many, as a dam and as a sire
        const book = L.studbook||[], kidsIn = e => e.eggs ? e.eggs : e.kids.male+e.kids.female+e.kids.futa;
        const withWhom = (rows, who) => { const m = new Map(); for (const e of rows) for (const w of who(e)) m.set(w, (m.get(w)||0) + 1);
          return [...m].sort((a,b) => b[1]-a[1]).map(([w,n]) => plainName(w)+" ×"+n).join(", "); };
        const asDam = book.filter(e => e.dam === t), asSire = book.filter(e => e.sires.includes(t));
        const line = (rows, label, who) => rows.length ? label+": "+rows.length+" litter"+(rows.length===1?"":"s")+", "+rows.reduce((a,e)=>a+kidsIn(e),0)+" young · with "+withWhom(rows, who) : "";
        const out = [line(asDam, "🐄 As dam", e => e.sires), line(asSire, "🐂 As sire", e => [e.dam])].filter(Boolean);
        const last = book.filter(e => e.dam === t || e.sires.includes(t)).slice(-1)[0];
        R(out.length
          ? "📜 PEDIGREE — "+plainName(t)+"\n"+out.join("\n")+(last ? "\nLatest: "+plainName(last.dam)+" × "+last.sires.map(plainName).join(" & ")+", "+new Date(last.t).toLocaleDateString() : "")
          : plainName(t)+" has no litters in the stud book yet, hon.");
        break;
      }

      case "heat": {
        const t = resolveTarget(args[0]);
        if (!t || !rec(t)){ R("Here's how, sugar: ?heat, their name or member number, then how many hours (leave it out for 12), or off to break their heat. "+
                           "For example: ?heat Bessie  or  ?heat Bessie 6  or  ?heat 123456 off"); break; }
        const p = prodOf(t);
        if (String(args[1]||"").toLowerCase() === "off"){ p.heat = null; saveLedger(); R(plainName(t)+"'s heat is broken, hon."); break; }
        if (limitBlocks(t,"heat")){ R("Their limits rule that out, sugar, so no heat for them."); break; }
        const hh = parseFloat(args[1]);
        startHeat(t, sender, hh > 0 ? hh : CFG.PROD.HEAT_H);
        R("🔥 "+plainName(t)+" is in heat now! Ooh-wee.");
        break;
      }

      case "heatline": {
        if (!L.heatLines) L.heatLines = [];
        const sub = String(args[0]||"list").toLowerCase();
        if (sub === "add"){
          const line = args.slice(1).join(" ").trim();
          if (!line){ R("Give me a line, sugar! "+"?heatline add <line> adds one (%name% becomes their name), ?heatline list shows yours, ?heatline remove <number> takes one off. For example: ?heatline add %name% grinds against the rails."); break; }
          L.heatLines.push({ text:line, by:sender, at:Date.now() }); saveLedger();
          R("Added! "+L.heatLines.length+" heat line(s) of your own now.");
        } else if (sub === "remove" || sub === "del"){
          const i = parseInt(args[1],10)-1;
          if (!(i>=0 && i<L.heatLines.length)){ R("Which number, hon? Say ?heatline remove and a number from ?heatline list, like ?heatline remove 2."); break; }
          R("Took it off: "+L.heatLines.splice(i,1)[0].text); saveLedger();
        } else {
          R(L.heatLines.length ? "🔥 HEAT LINES\n\n"+L.heatLines.map((x,i)=>(i+1)+". "+x.text).join("\n")
                               : "I'm usin' the built-in heat lines right now, sugar. "+"?heatline add <line> adds one (%name% becomes their name), ?heatline list shows yours, ?heatline remove <number> takes one off. For example: ?heatline add %name% grinds against the rails.");
        }
        break;
      }

      /* ── FARM LIFE ── */
      case "feeding": case "curfew": {
        if (!isProprietor(sender)){
          R(cmd === "feeding" ? "🔔 Feedin' time's at "+CFG.FEED_HOURS.map(h=>h+":00").join(" and ")+(L.life.feedingOn?"":" (switched off right now)")+", sugar."
                              : "🌙 Curfew runs "+CFG.CURFEW.start+":00 to "+CFG.CURFEW.end+":00"+(L.life.curfewOn?"":" (switched off right now)")+", sugar.");
          break;
        }
        const key = cmd === "feeding" ? "feedingOn" : "curfewOn";
        const v = String(args[0]||"").toLowerCase();
        if (v && !["on","off"].includes(v)){ R("Just say ?"+cmd+" on or ?"+cmd+" off, sugar. Leave it blank and it flips. For example: ?"+cmd+" off"); break; }
        L.life[key] = v ? v === "on" : !L.life[key]; saveLedger(); audit(sender, cmd.toUpperCase(), L.life[key]?"on":"off");
        if (cmd === "curfew") syncAllPresent(true);
        R((cmd === "feeding" ? "🔔 Feedin' times are " : "🌙 Curfew is ")+(L.life[key] ? "ON" : "off")+" now. ?"+cmd+" on or ?"+cmd+" off sets it; plain ?"+cmd+" flips it.");
        break;
      }

      case "weather": { const w = weatherToday(); R("🌤️ "+w.line); break; }

      case "unstock": {
        const t = resolveTarget(args[0]);
        const r = t ? rec(t) : null;
        if (!r || !r.stocked){ R("They ain't in the stocks, hon. To let somebody out, say ?unstock and their name or member number, like ?unstock Bessie or ?unstock 123456."); break; }
        r.stocked = null; saveLedger(); audit(sender,"UNSTOCK",String(t));
        R("🔓 Let "+plainName(t)+" out of the stocks."); whisper(t, "🔓 "+plainName(sender)+" let you out of the stocks, sweetie!");
        break;
      }

      case "stocks": {
        const t = resolveTarget(args[0]);
        if (!t || !rec(t)){ R("Here's how, sugar: ?stocks, their name or member number, then minutes from 1 to 240 (leave it out for 30). ?unstock <who> lets 'em out early. "+
                           "For example: ?stocks Bessie  or  ?stocks 123456 45"); break; }
        const mins = Math.max(1, Math.min(CFG.STOCKS_MAX_MIN, parseInt(args[1],10) || CFG.STOCKS_DEFAULT_MIN));
        putInStocks(t, mins, sender); audit(sender,"STOCKS",t+" "+mins+"m");
        R("⛓️ "+plainName(t)+" is in the stocks for "+mins+" minutes, hon.");
        break;
      }

      case "walk": {
        const t = resolveTarget(args[0]);
        if (!t){ R("Walk who, sugar? Say ?walk and the name or member number of stock in your own herd, like ?walk Bessie or ?walk 123456. Say the same thing again to let go of the lead."); break; }
        if (state.leashes.get(t) === sender){ state.leashes.delete(t); R("You let go of "+plainName(t)+"'s lead."); whisper(t, plainName(sender)+" let go of your lead, sweetie."); break; }
        if (!membership(t, sender) && !isProprietor(sender)){ R("You can only walk stock in your own "+herdWord(sender)+", sugar."); break; }
        if (!charFor(t) || !charFor(sender)){ R("You both need to be here on the farm for that, hon."); break; }
        if (stockedNow(t)){ R("They're in the stocks right now, sugar. ?unstock 'em first."); break; }
        state.leashes.set(t, sender); audit(sender,"WALK",String(t));
        say("🦮 "+plainName(sender)+" clips a lead on "+plainName(t)+". Aww!");
        whisper(t, "You're on "+plainName(sender)+"'s lead now, sweetie. Wherever they go, you go. Safeword ends it.");
        break;
      }

      case "tourstop": {
        if (!isHerdmaster(sender)){ R("Sorry, sugar, that one's just for herdmasters and proprietors."); break; }
        if (!L.life.tour) L.life.tour = [];
        const sub = String(args[0]||"list").toLowerCase();
        if (sub === "add"){
          const C = charFor(sender), pos = C && C.MapData && C.MapData.Pos;
          const text = args.slice(1).join(" ").trim();
          if (!pos || !text){ R("Stand right at the stop, sugar, and say ?tourstop add and what they're lookin' at (%name% becomes the visitor's name). For example: ?tourstop add The pasture. Mind the ruts, %name%."); break; }
          L.life.tour.push({ X:pos.X, Y:pos.Y, text }); saveLedger();
          R("📍 Stop "+L.life.tour.length+" added at "+pos.X+","+pos.Y+"!");
        } else if (sub === "remove"){
          const i = parseInt(args[1],10)-1;
          if (!(i>=0 && i<L.life.tour.length)){ R("Which stop, hon? Say ?tourstop remove and a number from ?tourstop list, like ?tourstop remove 2."); break; }
          L.life.tour.splice(i,1); saveLedger(); R("Took off stop "+(i+1)+", sugar.");
        } else {
          R(L.life.tour.length ? "🗺️ TOUR STOPS\n\n"+L.life.tour.map((s,i)=>(i+1)+". "+s.X+","+s.Y+" — "+s.text).join("\n")
                               : "No stops yet, sugar. Stand somewhere and say ?tourstop add and a line, like ?tourstop add The barn. Smells like home, don't it?");
        }
        break;
      }

      /* ── WORK ── */
      case "clockin": {
        const r = rec(sender,true);
        if (r.pastureLock){ R("🔒 You're bein' kept out in the pasture, sugar, so no clockin' in just yet."); break; }
        if (clockedIn(sender)){ R("You're already on the clock, hon!"); break; }
        r.shift = r.shift || {}; r.shift.in = Date.now();
        if (r.onDuty === false){
          // same clean-up as ?onduty
          r.onDuty = true;
          if (r.pastureStock === true || (r.pastureStock === undefined && isStaff(sender))) r.roles = r.roles.filter(x=>x!==ROLE.LIVESTOCK);
          r.pastureStock = false; r.pastureNote = "";
          syncKeys(sender, true);
        }
        state.lastSpoke.set(sender, Date.now());
        r.nextChore = Date.now() + 2*60000;
        saveLedger(); audit(sender,"CLOCKIN","");
        R("⏱️ You're on the clock, sweetie! Keep chattin', or I'll clock you out after "+CFG.SHIFT_IDLE_MIN+" quiet minutes.");
        outfitsLedger();
        if (L.outfitRules.onClockIn && uniformSlotFor(sender)) later(() => offerOutfit(sender, uniformSlotFor(sender), "Your shift's startin'"), 1500);
        break;
      }
      case "clockout": {
        if (!clockedIn(sender)){ R("You ain't clocked in, hon. Say ?clockin to start a shift."); break; }
        R("⏱️ Clocked out! That shift came to "+hrs(clockOut(sender,"self"))+". Thanks, sugar!");
        break;
      }
      case "hours": {
        const t = args[0] ? resolveTarget(args[0]) : sender;
        const r = t ? rec(t) : null;
        if (!r){ R("I don't know that one, sugar. Just ?hours shows yours; add a name or member number for somebody else's, like ?hours Hand or ?hours 800."); break; }
        const wk = weekKey(), week = (r.shift && r.shift.week && r.shift.week.key === wk) ? r.shift.week.ms : 0;
        const live = clockedIn(t) ? Date.now() - r.shift.in : 0;
        R("⏱️ "+plainName(t)+": "+hrs(week+live)+" this week · "+hrs(((r.shift&&r.shift.total)||0)+live)+" all told"+(live?" · on the clock now":"")+
          " · chores this week: "+((r.choreWeek&&r.choreWeek.key===wk)?r.choreWeek.n:0));
        break;
      }
      case "done": {
        const r = rec(sender);
        if (!r || !r.chore){ R("You don't have a chore right now, hon. They come by beep while you're clocked in."); break; }
        // a chore with a place (?chore add Muck out the pens @pens) only counts done there: a zone or a spot
        const place = r.chore.place || (String(r.chore.text).match(/@([a-z0-9_-]+)\s*$/i)||[])[1];
        if (place && !inZoneNamed(sender, place.toLowerCase()) && !onSpot(sender, place.toLowerCase(), 1)){
          R("🧹 That one gets done at "+place+", sugar. Head over there and say ?done once you're standin' in it."); break;
        }
        const wk = weekKey();
        r.choreWeek = (r.choreWeek && r.choreWeek.key === wk) ? r.choreWeek : { key:wk, n:0 };
        r.choreWeek.n++; r.choreTotal = (r.choreTotal||0) + 1;
        audit(sender,"CHORE",r.chore.text.slice(0,50)); r.chore = null; saveLedger();
        staffPoints(sender, 1, "chore");
        R("✅ Thank you, sweetie! That's "+r.choreWeek.n+" this week.");
        break;
      }
      case "chore": case "chores": {
        const sub = String(args[0]||"").toLowerCase();
        if (sub === "add"){
          const text = args.slice(1).join(" ").trim();
          if (!text){ R("What's the job, sugar? Say ?chore add and the job, like ?chore add Polish the cowbells. Add @place to make it count only there, like ?chore add Muck out the pens @pens."); break; }
          L.chores.push({ text, by:sender }); saveLedger(); R("Added! "+L.chores.length+" chores on the board now.");
        } else if (sub === "remove"){
          const i = parseInt(args[1],10)-1;
          if (!(i>=0 && i<L.chores.length)){ R("Which number, hon? Say ?chore remove and a number from the ?chores list, like ?chore remove 3."); break; }
          R("Took it off: "+L.chores.splice(i,1)[0].text); saveLedger();
        } else {
          const wk = weekKey();
          const board = Object.values(L.people).filter(r => r.choreWeek && r.choreWeek.key === wk)
                        .sort((a,b)=>b.choreWeek.n-a.choreWeek.n).slice(0,5)
                        .map((r,i)=>"  "+(i+1)+". "+(r.name||plainName(r.mn))+" — "+r.choreWeek.n).join("\n");
          const mine = rec(sender) && rec(sender).chore;
          R("🧹 CHORES\n"+(mine ? "\nYours: "+mine.text+" (say ?done when it's finished)\n" : "")+"\nThis week\n"+(board||"  nobody yet")+
            "\n\nOn the board ("+L.chores.length+"):\n"+L.chores.map((c,i)=>(i+1)+". "+c.text).join("\n")+"\n\n?chore add <job> · ?chore remove <number>");
        }
        break;
      }

      /* ── PLAY ── */
      case "wheel": {
        const sub = String(args[0]||"list").toLowerCase();
        if (sub === "add"){
          const kind = String(args[1]||"").toLowerCase();
          const text = args.slice(2).join(" ").trim();
          if (!["reward","punish"].includes(kind) || !text){ R("Say whether it's a reward or a punish slice, sugar, then the words. "+"?wheel add reward <text> or ?wheel add punish <text> adds a slice (%name% becomes their name), ?wheel lists them, ?wheel remove <number> takes one off. For example: ?wheel add reward Extra hay tonight"); break; }
          L.wheel.push({ kind, text, by:sender }); saveLedger(); R("Added to the wheel! "+L.wheel.length+" slices now.");
        } else if (sub === "remove"){
          const i = parseInt(args[1],10)-1;
          if (!(i>=0 && i<L.wheel.length)){ R("Which number, hon? Say ?wheel remove and a number from the ?wheel list, like ?wheel remove 2."); break; }
          R("Took it off: "+L.wheel.splice(i,1)[0].text); saveLedger();
        } else {
          R(L.wheel.length ? "🎡 THE WHEEL\n\n"+L.wheel.map((e,i)=>(i+1)+". "+(e.kind==="reward"?"🍬":"🔻")+" "+e.text).join("\n")
                           : "Wheel's empty, sugar. "+"?wheel add reward <text> or ?wheel add punish <text> adds a slice (%name% becomes their name), ?wheel lists them, ?wheel remove <number> takes one off. For example: ?wheel add reward Extra hay tonight");
        }
        break;
      }
      case "spin": {
        const t = args[0] ? resolveTarget(args[0]) : null;
        if (!t || !rec(t)){ R("Spin for who, sugar? Say ?spin, their name or member number, then reward or punish if you want just that kind (leave it out for any slice). "+
                           "Anything that clashes with their hard limits gets left out. For example: ?spin Bessie  or  ?spin 123456 punish"); break; }
        const kind = String(args[1]||"").toLowerCase();
        const pool = L.wheel.filter(e => (!["reward","punish"].includes(kind) || e.kind === kind) && wheelAllowed(e, t));
        if (!pool.length){ R("Shoot, there's nothin' on the wheel that fits "+plainName(t)+"'s limits, hon. Try leavin' out reward or punish, or add some slices with ?wheel add."); break; }
        const e = pool[Math.floor(Math.random()*pool.length)];
        audit(sender,"SPIN",t+" "+e.text.slice(0,50));
        say("🎡 Round and round she goes! "+plainName(sender)+" spins the wheel for "+plainName(t)+"… "+(e.kind==="reward"?"🍬 ":"🔻 ")+fill(e.text, t));
        break;
      }
      case "beg": case "please": {
        const r = rec(sender);
        if (!r){ R("You ain't stock here, sugar. Say ?apply if you'd like to be!"); break; }
        const text = cmd === "please" ? "please "+rest : rest;
        if (!begPhraseOk(text)){ R("Manners, sugar! Ask properly: ?beg and then \""+(L.life.begPhrase||CFG.BEG_PHRASE)+"\". For example: ?beg "+(L.life.begPhrase||CFG.BEG_PHRASE)); break; }
        const last = state.cooldowns.get("beg:"+sender)||0;
        if (Date.now()-last < CFG.BEG_COOLDOWN_MIN*60000){ R("You just begged, hon! Don't wear it out. Try again in a little while."); break; }
        state.cooldowns.set("beg:"+sender, Date.now());
        audit(sender,"BEG","");
        if (stockedNow(sender)){
          const left = r.stocked.until - Date.now();
          r.stocked.until -= Math.round(left*0.25); saveLedger();
          R("Since you asked so nice, I'll knock a quarter off. "+Math.ceil((r.stocked.until-Date.now())/60000)+" minutes left in the stocks, sweetie.");
        } else if (curfewBound(sender) && CFG.CURFEW_TAKES_BRONZE){
          r.begged = true; saveLedger(); syncKeys(sender, true);
          R("Oh, alright! Bronze key's back for the night. Don't make me regret it, sugar. 😉");
        } else {
          const treat = CFG.TREATS[Math.floor(Math.random()*CFG.TREATS.length)];
          R("🍬 "+fill(treat, sender));
        }
        break;
      }
      case "begphrase": {
        if (!isStaff(sender)){ break; }
        if (!rest){ R("The beggin' phrase is \""+(L.life.begPhrase||CFG.BEG_PHRASE)+"\", hon. Say ?begphrase and new words to change it, like ?begphrase pretty please, Farmhand"); break; }
        L.life.begPhrase = rest; saveLedger(); R("Got it! Stock have to say \""+rest+"\" now.");
        break;
      }

      /* ── COUNTY FAIR ── */
      case "fair": {
        const sub = String(args[0]||"").toLowerCase();
        const F = L.life.fair;
        if (sub === "open"){
          if (!isProprietor(sender)){ R("Only the proprietors can open the fair, sugar."); break; }
          let cls = String(args[1]||"").toLowerCase(), rest = args.slice(2);
          if (!CFG.FAIR_CLASSES.includes(cls)){ cls = "show"; rest = args.slice(1); }
          const CLASS_TITLE = { show:"County Fair", udder:"Biggest Udder", balls:"Biggest Balls", penis:"Biggest Cock",
                                gape:"Best Gape", throat:"Deepest Throat", load:"Biggest Load" };
          L.life.fair = { open:true, at:Date.now(), entrants:{}, cls, loads:{}, title:rest.join(" ")||CLASS_TITLE[cls] }; saveLedger();
          say("🎪 Y'all, the "+L.life.fair.title+" is open! "+(cls === "show"
                ? "Stock: say ?enter to show. Staff: ?score <who> <1-10>, like ?score Bessie 8."
                : cls === "load" ? "Studs: say ?enter, then give it your best ?cum. Biggest single load wins!"
                : "Say ?enter and I'll measure you up when it closes. Biggest wins, and judges' scores break a tie!"));
        } else if (sub === "close"){
          if (!isProprietor(sender)){ R("Only the proprietors can close the fair, sugar."); break; }
          if (!F || !F.open){ R("There's no fair runnin' right now, hon."); break; }
          const avg = s => s.length ? s.reduce((a,b)=>a+b,0)/s.length : 0;
          const cls = F.cls || "show";
          // measured classes: by size (or load), judges' average breaks a tie
          const measure = m => cls === "udder" ? udderLevel(m) : cls === "balls" ? sizeOf(m,"testes") : cls === "penis" ? sizeOf(m,"penis")
                             : cls === "gape" ? Math.max(sizeOf(m,"vulva"), sizeOf(m,"butt")) : cls === "throat" ? sizeOf(m,"throat")
                             : cls === "load" ? ((F.loads||{})[m]||0) : 0;
          const shown = (m, v) => cls === "show" ? v.toFixed(1)+"/10" : cls === "load" ? ml(v) : cls === "penis" ? v+"\""
                                : cls === "gape" ? sizeWord("vulva", v) : sizeWord(cls === "balls" ? "testes" : cls, v);
          const ranked = Object.entries(F.entrants).map(([m,e]) => { m = parseInt(m,10); const j = avg(Object.values(e.scores));
                           return [m, cls === "show" ? j : measure(m), j]; })
                         .filter(x => x[1] > 0 && rec(x[0])).sort((a,b) => (b[1]-a[1]) || (b[2]-a[2]));
          F.open = false; saveLedger();
          if (!ranked.length){ say("🎪 The fair's closed, y'all. Nobody "+(cls === "show" ? "got judged" : "placed")+" this time."); break; }
          const [win, score] = ranked[0], r = rec(win);
          r.ribbons = (r.ribbons||0) + 1;
          if (!CFG.PUNISH_TIERS.includes(r.tier)){
            if (!r.tierUntil) r.tierPrev = r.tier || "";
            r.tier = "prize"; r.tierUntil = Date.now() + CFG.FAIR_PRIZE_DAYS*86400000;
          }
          saveLedger(); audit(sender,"FAIR_WIN",win+" "+cls+" "+score);
          say("🎪🏆 And the "+F.title+" goes to... "+plainName(win)+" ("+shown(win, score)+")! Blue ribbon"+(r.tierUntil?" and prize tier for a week":"")+"."+
              (ranked[1] ? " Runner-up: "+plainName(ranked[1][0])+" ("+shown(ranked[1][0], ranked[1][1])+")." : ""));
        } else {
          if (!F || !F.open){ R("There's no fair runnin' right now, sugar. Proprietors can start one with ?fair open, a class if they like (show, udder, balls, penis, gape, throat or load), and a title, like ?fair open Harvest Show or ?fair open udder Moo Off."); break; }
          R("🎪 "+F.title+" — here's who's entered:\n\n"+Object.keys(F.entrants).map(m=>{
            const e = F.entrants[m], s = Object.values(e.scores);
            return "  • "+plainName(parseInt(m,10))+" — "+s.length+" score(s)";
          }).join("\n"));
        }
        break;
      }
      case "enter": {
        const F = L.life.fair;
        if (!F || !F.open){ R("There's no fair runnin' right now, hon. I'll holler when there is!"); break; }
        const cls = F.cls || "show";
        if (cls === "show" && !hasRole(sender, ROLE.LIVESTOCK)){ R("The show ring's just for stock, sugar."); break; }
        if (!rec(sender) || !rec(sender).roles.length){ R("You'll need to be on the books to enter, sugar. ?apply first!"); break; }
        if ((cls === "load" || cls === "balls" || cls === "penis") && !makesSemen(sender)){ R("This one's for folks with a penis, hon (or futa: ?futa on)."); break; }
        if (cls === "udder" && !makesMilk(sender)){ R("This one's for milkers, hon. Say ?milkable on first!"); break; }
        F.entrants[sender] = F.entrants[sender] || { scores:{} }; saveLedger();
        say("🎪 Lookin' good! "+plainName(sender)+" steps into the show ring.");
        break;
      }
      case "score": {
        const F = L.life.fair;
        const t = resolveTarget(args[0]), n = parseFloat(args[1]);
        if (!F || !F.open){ R("There's no fair runnin' right now, hon."); break; }
        if (!t || !F.entrants[t] || !(n>=1 && n<=10)){ R("Here's how, sugar: ?score, then somebody who's entered (name or member number; ?fair shows who), then a score from 1 to 10 (halves are fine). "+
                                                     "For example: ?score Bessie 8  or  ?score 123456 9.5"); break; }
        if (t === sender){ R("Nice try, sugar, but you can't judge yourself!"); break; }
        F.entrants[t].scores[sender] = n; saveLedger();
        R("Scored "+plainName(t)+" "+n+"/10. Thanks, judge!");
        break;
      }

      case "backup": {
        if (!isProprietor(sender)){ R("Sorry, sugar, that one's just for the proprietors."); break; }
        exportLedger();
        R("All backed up, hon! The ledger's downloaded on the bot's machine. "+Object.keys(L.people).length+" on the books.");
        break;
      }
    }
  }

  function handleYesNo(sender, raw){
    const pc = state.pendingClaims.get(sender);
    if (!pc){
      const low0 = String(raw).trim().toLowerCase().replace(/^[?!.\-\/]/,"").replace(/^bot\s+/,"");
      if ((low0 === "yes" || low0 === "no") && (state.breedAsks.has(sender) || state.jarAsks.has(sender))) return answerPending(sender, low0 === "yes");
      if ((low0 === "yes" || low0 === "no") && addonAsks.has(sender)) return addonYesNo(sender, low0 === "yes");
      return false;
    }
    if (Date.now() - pc.at > CFG.CLAIM_ASK_TIMEOUT_MIN*60000){
      state.pendingClaims.delete(sender);
      return false;
    }
    const low = String(raw).trim().toLowerCase().replace(/^[?!.\-\/]/,"").replace(/^bot\s+/,"");
    if (low!=="yes" && low!=="no") return false;
    state.pendingClaims.delete(sender);

    if (low==="no"){
      beep(sender,"Understood, hon. I told 'em no, and that's the end of it.");
      beep(pc.by, plainName(sender)+" declined, sugar. Please leave it be.");
      return true;
    }

    const why = claimBlocker(pc.by, sender);
    if (why){
      beep(sender,"Sorry, sweetie, I couldn't put you in after all. "+why);
      beep(pc.by, plainName(sender)+" said yes, but there's a snag: "+why);
      return true;
    }
    const r = addToHerd(sender, pc.by, pc.type, pc.days);
    r.name = plainName(sender);
    saveLedger(); audit(pc.by,"CLAIM",sender+" "+pc.type+(pc.type==="temp"?" "+pc.days+"d":""));
    syncKeys(sender, true);
    if (CFG.FRIEND_ON_REGISTER) addFriend(sender, true);

    const h = membership(sender, pc.by);
    beep(sender,"🌾 Aww, you're in "+plainName(pc.by)+"'s "+herdWord(pc.by)+" now, sweetie — "+herdLabel(h)+".\n🔑 "+keyString(sender));
    beep(pc.by,"✅ "+plainName(sender)+" said yes! "+herdLabel(h)+". "+herdMembers(pc.by).length+"/"+herdCap(pc.by)+" in your "+herdWord(pc.by)+".");
    return true;
  }

