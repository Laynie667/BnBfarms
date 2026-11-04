  /* WHAT'S IN THIS FILE (10um-friend-check.js)
     FRIEND THE BOT (Laynie, Oct 26: "the bot needs to detect when someone is registered, but not a friend of the bot so it
     prompts or reminds them to friend the bot. if they dont friend the bot within 48 hours of recieveing the prompts from
     the bot in the room, it unregisters them").
     The bot friends everybody on the books itself; a beep only reaches somebody who has the bot on THEIR list too. The
     server's online-friends answer (askMutual, 06-login.js) says who has. Somebody on the books, here in the room, who
     isn't on it (seen twice in a row, so a fresh arrival isn't caught before the answer catches up):
       • gets a private reminder with how to do it, then again every CFG.FRIEND_NAG_H hours they're here
       • 48 hours (CFG.FRIEND_GRACE_H) after the first reminder, if they still haven't, they're taken off the books
         (the same as ?unregister: paperwork archived, keys pulled, off the whitelist), and staff are told
     Friendin' the bot any time before then clears it. Proprietors and staff are reminded but never taken off.
  */
  if (CFG.FRIEND_NAG_H === undefined) CFG.FRIEND_NAG_H = 6;
  if (CFG.FRIEND_GRACE_H === undefined) CFG.FRIEND_GRACE_H = 48;
  const FRIEND_HOW = "Click my character, then my profile, and press Add to friends. Or type /friendlistadd "+CFG.BOT_MEMBER+" in chat.";
  // off the books entirely: clear anyone they were holding, archive the paperwork, pull keys, off the whitelist
  function offTheBooks(t, by, why){
    const r = rec(t); if (!r) return false;
    for (const k in L.people){
      const p = L.people[k];
      if ((p.herds||[]).some(h=>h.leader===t)) p.herds = p.herds.filter(h=>h.leader!==t);
    }
    L.archive[t] = JSON.parse(JSON.stringify(r));
    delete L.people[t];
    saveLedger(); audit(by, "UNREGISTER", String(t)+(why ? " ("+why+")" : ""));
    pushKeys(t, [], true);
    whitelistSync(true);
    return true;
  }
  function friendCheckTick(){
    const m = state.mutual, now = Date.now();
    if (!m || !m.set || now - m.at > 3*60000) return;   // no fresh answer from the server: don't guess
    if (now - (state.friendCheckAt || 0) < 60000) return;
    state.friendCheckAt = now;
    state.friendMiss = state.friendMiss || new Map();
    for (const C of (W.ChatRoomCharacter || [])){
      const mn = C && C.MemberNumber, r = rec(mn);
      if (!mn || mn === CFG.BOT_MEMBER || !r || !r.roles || !r.roles.length) continue;
      if (m.set.has(mn)){
        state.friendMiss.delete(mn);
        if (r.friendNag){ const was = r.friendNag; r.friendNag = null; saveLedger(); if (was.n) tell(mn, "💌 Thank you for friendin' me, sugar! My notes reach you now, and you're all set."); }
        continue;
      }
      const miss = (state.friendMiss.get(mn) || 0) + 1; state.friendMiss.set(mn, miss);
      if (miss < 2) continue;
      const g = r.friendNag = r.friendNag || { first: 0, last: 0, n: 0 };
      const keep = isProprietor(mn) || isStaff(mn);
      if (g.first && !keep && now - g.first >= CFG.FRIEND_GRACE_H*3600000){
        whisper(mn, "📋 It's been "+CFG.FRIEND_GRACE_H+" hours and I still can't reach you, sugar, so I've taken you off the farm's books. Your paperwork's kept safe in the drawer: friend me and ?apply again whenever you like. "+FRIEND_HOW);
        notifyStaff("📋 "+plainName(mn)+" ("+mn+") never friended the bot in "+CFG.FRIEND_GRACE_H+" hours after bein' asked, so they're off the books (paperwork archived).", false);
        offTheBooks(mn, CFG.BOT_MEMBER, "never friended the bot");
        state.friendMiss.delete(mn);
        continue;
      }
      if (now - g.last < CFG.FRIEND_NAG_H*3600000) continue;
      if (!g.first) g.first = now;
      g.last = now; g.n++; saveLedger();
      const left = Math.max(1, Math.ceil((g.first + CFG.FRIEND_GRACE_H*3600000 - now)/3600000));
      whisper(mn, "💌 Psst, "+plainName(mn)+": you're on the farm's books, but you haven't friended me yet, so my notes, summons and safeword answers can't reach you. "+FRIEND_HOW+
                  (keep ? "" : " Please do it within "+left+" hours, or I'll have to take you off the books."));
    }
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __friendTick: () => { state.friendCheckAt = 0; friendCheckTick(); } });
