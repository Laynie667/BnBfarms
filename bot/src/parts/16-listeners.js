  /* WHAT'S IN THIS FILE (16-listeners.js)
     Hooks into the game: chat, whispers, emotes, actions, hidden messages (Companion and BC+), beeps,
     people joinin', room events.
  */
  /* ───────────── listeners ───────────── */

  function attachListeners(){
    if (attachListeners._done) return true;
    if (!W.ServerSocket || typeof W.ServerSocket.on !== "function") return false;

    W.ServerSocket.on("ChatRoomMessage",(data)=>{
      try {
        if (!data || data.Sender===CFG.BOT_MEMBER) return;

        if (data.Type === "Hidden"){
          const fm = readMsg(data);
          if (fm){ onCompanion(fm); return; }
          const bm = BCPLUS.readBCP(data);
          if (bm){ onBCPMessage(bm); return; }
          if (typeof data.Content === "string" && data.Content.startsWith("ChatRoomBot ")){
            const text = data.Content.slice("ChatRoomBot ".length).trim().replace(/^\(+/,"").replace(/\)+$/,"");
            if (!text) return;
            state.heard++; state.lastHealthy = Date.now();
            log("HEARD [/bot] "+data.Sender+": "+text.slice(0,70));
            if (handleYesNo(data.Sender, text)) return;
            handleCommand(data.Sender, text, "bot");
            return;
          }
          if (data.Content === "ChatRoomFriendRequestAdd"){
            log("Friend request from " + data.Sender);
            addFriend(data.Sender, false);
          }
          return;
        }

        if (data.Sender) state.lastSpoke.set(data.Sender, Date.now());
        if (data.Type === "Activity" && data.Content === "BCPAction"){ try { onBCPAction(data); } catch(e){ warn("bc+:",e); } return; }
        if (data.Type === "Activity"){ try { onActivity(data); } catch(e){ warn("activity:",e); } addonsEmit("activity", data); return; }
        if (data.Type === "Emote" || data.Type === "Chat"){ try { onRoleplay(data.Sender, String(data.Content||""), data.Type); } catch(e){ warn("rp:",e); } addonsEmit("roleplay", data.Sender, String(data.Content||""), data.Type); }
        if (data.Type!=="Chat" && data.Type!=="Whisper") return;
        if (typeof data.Content!=="string") return;

        state.heard++;
        state.lastHealthy = Date.now();
        if (CFG.LOG_HEARD) log("HEARD ["+data.Type+"] "+data.Sender+": "+data.Content.slice(0,70));

        const ch = data.Type==="Whisper" ? "whisper" : "chat";
        if (ch !== "chat" && handleYesNo(data.Sender, data.Content)) return;
        handleCommand(data.Sender, data.Content, ch);
      } catch(e){ warn("msg:",e); }
    });

    W.ServerSocket.on("AccountBeep",(data)=>{
      try {
        if (!data || data.MemberNumber===CFG.BOT_MEMBER) return;
        if (data.BeepType) return;
        if (!data.Message) return;
        state.lastHealthy = Date.now();
        log("BEEP from "+data.MemberNumber+": "+String(data.Message).slice(0,70));
        if (CFG.FRIEND_ON_BEEP) addFriend(data.MemberNumber, true);
        if (handleYesNo(data.MemberNumber, data.Message)) return;
        handleCommand(data.MemberNumber, data.Message, "beep");
      } catch(e){ warn("beep handler:",e); }
    });

    W.ServerSocket.on("ChatRoomSyncMemberJoin",(data)=>{
      try {
        if (!data || !data.Character) return;
        const mn = data.Character.MemberNumber;
        if (mn===CFG.BOT_MEMBER) return;
        state.lastHealthy = Date.now();
        greet(mn);
        onArrive(mn);
        later(()=>deliverMail(mn), 8000);   // anything kept for them while they were away
        addonsEmit("join", mn);
        if (CFG.KEY_SYNC_ON_JOIN) later(()=>syncKeys(mn,true), CFG.KEY_JOIN_DELAY_MS);
        if (CFG.FRIEND_ON_JOIN && rec(mn)) later(()=>addFriend(mn,true), 6000);
      } catch(e){ warn("join:",e); }
    });

    W.ServerSocket.on("ChatRoomSyncMemberLeave",(data)=>{ try { if (data && data.SourceMemberNumber) addonsEmit("leave", data.SourceMemberNumber); } catch(e){ warn("leave:",e); } });
    // who's friends with the bot both ways (and online): the only people a beep can reach
    W.ServerSocket.on("AccountQueryResult",(d)=>{
      try {
        if (!d || d.Query !== "OnlineFriends" || !Array.isArray(d.Result)) return;
        state.mutual = { at: Date.now(), set: new Set(d.Result.map(x => x && x.MemberNumber).filter(Number.isFinite)) };
        for (const mn of state.mutual.set) if (L.mailbox && L.mailbox[mn]) deliverMail(mn);
      } catch(e){ warn("friends result:", e); }
    });
    W.ServerSocket.on("ChatRoomSync", ()=>{ state.lastHealthy = Date.now(); later(()=>pingCompanions(false), 4000); });

    W.ServerSocket.on("ChatRoomSearchResponse",(d)=>{
      log("SearchResponse:",d);
      // the server's word for it is "CannotFindRoom" (v0.9.0 waited for "RoomNotFound",
      // which never comes, so the room was never rebuilt)
      if (d==="CannotFindRoom" || d==="RoomNotFound") later(tryCreateRoom,1500);
      if (d==="JoinedRoom") later(()=>snapshotRoom(true), 5000);
    });
    W.ServerSocket.on("ChatRoomCreateResponse", d=>log("CreateResponse:",d));
    W.ServerSocket.on("disconnect", ()=>{ warn("Socket disconnected."); setBadge("disconnected","#ff9b9b"); });
    W.ServerSocket.on("connect", ()=>{ log("Socket reconnected."); state.lastHealthy = Date.now(); });

    attachListeners._done = true;
    log("Listeners attached (chat + beeps + friends + sync).");
    return true;
  }

