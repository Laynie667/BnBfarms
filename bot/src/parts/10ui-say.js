  /* WHAT'S IN THIS FILE (10ui-say.js)
     SAY IT (Laynie, Oct 23: "speech impaired pets need a guaranteed way to be able to say what they need to say, in
     the companion or otherwise - because as is, someone with a nhl contract cant effectively answer when a trap needs
     them to say a specific thing"). A gag garbles them, a no-human-left contract turns every word into moos, an ECHS
     trance can silence them, and then the mirror box never hears its line. So:
     • The Companion's Say it box sends their words straight to the farm as a hidden message, which nothin' in the
       game rewrites. The farm hears them exactly as typed: the mirror box, a parasite wantin' begged at, a yes or no,
       a command. "Tell staff" sends them to the staff on duty and their herd leader instead.
     • wantsFor(mn): what the farm is waitin' to hear from them right now. Their Companion shows each as a button
       with the words on it, so they don't even have to type.
     • Without the Companion: a whisper to the farm girl counts too, and when the game sends the ungarbled copy of
       a gagged line along (their "no speech garbling" setting), that's the one the farm listens to.
  */
  // what the farm is waitin' to hear from them: { icon, label, say } (words) or { icon, label, cmd } (a command)
  function wantsFor(mn){
    const r = rec(mn) || {}, out = [], w = r.trapWait, beg = "beg " + ((L.life && L.life.begPhrase) || CFG.BEG_PHRASE);
    if (w && w.kind === "mirror" && w.line) out.push({ icon: "🪞", label: "The mirror box wants it said out loud, " + Math.max(1, 5 - (w.n || 0)) + " more time" + (5 - (w.n || 0) === 1 ? "" : "s"), say: w.line });
    if (w && w.kind === "tickle") out.push({ icon: "🪶", label: "The tickle rack stops if you beg", cmd: beg });
    try { if (potionOn(mn, "needy")) out.push({ icon: "💗", label: "The Needy Nectar lets up if you beg", cmd: beg }); } catch(e){}
    try { const g = r.parasite; if (g && g.urge && g.urge.kind === "beg" && g.urge.until > Date.now()) out.push({ icon: "🫦", label: "Your parasite wants to hear you beg", say: "Please, I need it, please feed me" }); } catch(e){}
    return out;
  }
  // words they said that somethin' on the farm was waitin' for: true when one of them took it
  function heardWords(mn, text){
    let took = false;
    try { if (trapHeard(mn, text)) took = true; } catch(e){ warn("mirror box:", e); }
    try { if (parasiteHeard(mn, text)) took = true; } catch(e){ warn("parasite beg:", e); }
    return took;
  }
  // a gagged line can carry its plain words along (BC: Dictionary [{ Original }], with "no speech garbling" on)
  function plainWordsOf(data){
    const d = Array.isArray(data && data.Dictionary) ? data.Dictionary.find(x => x && typeof x.Original === "string") : null;
    return d ? d.Original : "";
  }
  // the Companion's Say it box: { text, to: "farm" | "staff" }
  function companionSaid(mn, m){
    const text = String(m.text || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
    if (!text) return;
    state.lastSpoke.set(mn, Date.now());
    log("HEARD [say] "+mn+": "+text.slice(0, 70));
    if (m.to === "staff"){
      const who = plainName(mn), line = "🗣️ "+who+" ("+mn+") can't say it out loud, so they typed it: \""+text+"\"";
      notifyStaff(line, true, true);
      for (const h of herdsOf(mn)) if (h.leader && h.leader !== mn && !isStaff(h.leader)) tell(h.leader, line);
      whisper(mn, "🗣️ Sent to the staff on duty"+(herdsOf(mn).length ? " and your herd leader" : "")+", sugar, just as you typed it.");
      return;
    }
    if (/^[?!\/]/.test(text)){ const c = text.replace(/^[?!\/]+/, ""); if (c && !handleYesNo(mn, c)) handleCommand(mn, c, "companion"); later(() => syncCompanions(), 1500); return; }
    if (handleYesNo(mn, text)) return;
    const took = heardWords(mn, text);
    try { potionHeard(mn, text, "Chat"); } catch(e){}
    addonsEmit("roleplay", mn, text, "Chat");
    if (!took) whisper(mn, "🗣️ The farm heard you, sugar: \""+text+"\"");
    later(() => syncCompanions(), 1500);
  }
