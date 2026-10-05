  /* WHAT'S IN THIS FILE (06-login.js)
     Friends, loggin' the bot in, findin' or rebuildin' the farm room, the on-screen badge, and the hooks
     the tests use.
  */
  /* ═══════════ FRIENDS ═══════════ */

  // on the BOT's friend list (that's what lets their beeps reach the bot)
  function isFriend(mn){
    try { return (W.Player.FriendList||[]).includes(mn); } catch(e){ return false; }
  }
  // Can a beep from the bot actually reach them? The server only delivers a beep if THEY have the bot on
  // THEIR friend list. The server's "OnlineFriends" answer lists exactly the people who are friends both
  // ways and online, so the bot asks for it every minute (askMutual) and trusts that.
  function canBeep(mn){
    const m = state.mutual;
    if (m && Date.now() - m.at < 5*60000) return m.set.has(mn);
    return false;   // not heard from the server yet: don't guess, a lost beep is a silent failure
  }
  function askMutual(){ try { W.ServerSend("AccountQuery", { Query:"OnlineFriends" }); } catch(e){ warn("friends query:", e); } }

  function findCommand(tag){
    try {
      return (W.Commands||[]).find(x =>
        x && x.Tag && x.Tag.toLowerCase().replace(/^\//,"") === tag.toLowerCase());
    } catch(e){ return null; }
  }

  function addFriend(mn, quiet){
    if (!CFG.AUTO_FRIEND || !mn || mn === CFG.BOT_MEMBER) return false;
    try { if (mn === W.Player.MemberNumber) return false; } catch(e){ return false; }
    if (isFriend(mn)) return false;

    let ok = false;
    try {
      const cmd = findCommand("friendlistadd");
      if (cmd && typeof cmd.Action === "function"){
        cmd.Action(String(mn), "/friendlistadd " + mn, [String(mn)]);
        ok = true; log("addFriend via /friendlistadd → " + mn);
      }
    } catch(e){ warn("friend route 1:", e); }

    if (!ok){
      try {
        if (typeof W.ChatRoomListUpdate === "function"){
          W.ChatRoomListUpdate(W.Player.FriendList, true, mn, "FriendRequest", false);
          ok = true; log("addFriend via ChatRoomListUpdate → " + mn);
        }
      } catch(e){ warn("friend route 2:", e); }
    }

    if (!ok){
      try {
        if (!Array.isArray(W.Player.FriendList)) W.Player.FriendList = [];
        W.Player.FriendList.push(mn);
        W.ServerSend("AccountUpdate", { FriendList: W.Player.FriendList });
        ok = true; warn("addFriend via raw AccountUpdate → " + mn);
      } catch(e){ warn("friend route 3:", e); }
    }

    if (ok && !quiet){
      later(()=>beep(mn,
        "🌾 You're on the farm office's friend list now, " + plainName(mn) + "! 💕\n\n" +
        "Beep me any time, from anywhere on the property — wedged in a corner, " +
        "hogtied, muzzled, it don't matter one bit. I read gag-talk just fine, sweetie.\n\n" +
        "🔴 Beep 'safe' and everything stops.\nBeep 'help' for everything else."), 1500);
    }
    return ok;
  }

  /* ───────────── credentials & badge ───────────── */

  function getCreds(){ return { user:GM_getValue("bnb_user",""), pass:GM_getValue("bnb_pass","") }; }
  function promptCreds(){
    const u = W.prompt("Bot account NAME:", GM_getValue("bnb_user",""));
    if (u === null) return;
    const p = W.prompt("Bot account PASSWORD:");
    if (p === null) return;
    GM_setValue("bnb_user", u.trim()); GM_setValue("bnb_pass", p);
    W.alert("Saved. Reload the page.");
  }
  function clearCreds(){ GM_setValue("bnb_user",""); GM_setValue("bnb_pass",""); W.alert("Cleared."); }

  function statusText(){
    const c = getCreds();
    let fl = "-";
    try { fl = (W.Player.FriendList||[]).length; } catch(e){}
    const mins = Math.round((Date.now()-state.lastHealthy)/60000);
    return "Farmhand v"+VERSION+"\n" +
      "\nGame found:   " + (typeof W.ServerSend === "function") +
      "\nLogged in:    " + isLoggedIn() +
      "\nIn room:      " + inRoom() +
      "\nRoom admin:   " + botIsAdmin() +
      "\nTimer:        " + (state.worker ? "worker ✅" : "setInterval ⚠️") +
      "\nLast healthy: " + mins + " min ago" +
      "\nFriends:      " + fl +
      "\nHeard msgs:   " + state.heard +
      "\nCompanions:   " + companionCount() +
      "\nSend queue:   " + state.queue.length + (state.urgent.length ? " (+"+state.urgent.length+" urgent)" : "") +
      "\nMap saved:    " + (L && L.roomSnapshot ? new Date(L.roomSnapshot.at).toLocaleString() : "not yet") +
      "\nRegistered:   " + Object.keys(L?L.people:{}).length +
      "\nOn call:      " + forcedStaff().length +
      "\nPending apps: " + (L?L.applications.length:0) +
      "\nUser saved:   " + (c.user ? "yes ("+c.user+")" : "NO");
  }

  function exportLedger(){
    const txt = JSON.stringify(L,null,2);
    console.log(TAG+" ===== LEDGER BACKUP BEGIN ====="); console.log(txt);
    console.log(TAG+" ===== LEDGER BACKUP END =====");
    try {
      const blob = new Blob([txt],{type:"application/json"});
      const a = W.document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "bnb-ledger-"+new Date().toISOString().slice(0,10)+".json";
      a.click();
    } catch(e){ warn("download:",e); }
    return "Ledger exported.";
  }

  try {
    GM_registerMenuCommand("Farmhand: set bot login", promptCreds);
    GM_registerMenuCommand("Farmhand: clear bot login", clearCreds);
    GM_registerMenuCommand("Farmhand: status", ()=>W.alert(statusText()));
    GM_registerMenuCommand("Farmhand: export ledger", exportLedger);
    GM_registerMenuCommand("Farmhand: resync all keys", ()=>W.alert("Synced "+syncAllPresent(true)+" people."));
    GM_registerMenuCommand("Farmhand: friend everyone registered", ()=>{
      let n = 0;
      for (const mn in L.people) if (addFriend(parseInt(mn,10), true)) n++;
      W.alert("Friended "+n+" new. Total: "+(W.Player.FriendList||[]).length);
    });
    GM_registerMenuCommand("Farmhand: force reload", ()=>W.location.reload());
  } catch(e){ warn("menu:",e); }

  W.FarmhandSetLogin = promptCreds;
  W.FarmhandStatus   = ()=>{ console.log(statusText()); return statusText(); };
  W.FarmhandExport   = exportLedger;
  W.FarmhandLedger   = ()=>L;
  // the tests in tests/ peek inside through these; the live game never sets __FARMHAND_TEST__
  if (W.__FARMHAND_TEST__) Object.assign(W, { __st:()=>state, __cfg:CFG, __pt:prodTick, __qt:quotaTick, __lt:leashTick, __ms:milkingStallTick, __vt:voiceTick, __sync:syncCompanions, __gt:gearTick, __ht:homeTick, __addons:(h, ...a)=>addonsEmit(h, ...a), __stateFor:(mn)=>stateFor(mn), __leadTick:()=>leadTick(), __ambient:()=>ambientTick(), __about:(t)=>aboutWhom(t), __announce:(t)=>announce(t), __reply:(mn,t,ch)=>reply(mn,t,ch), __office:()=>officeCheck(), __namesHere:(t)=>namesHere(t) });
  W.FarmhandSyncKeys = ()=>syncAllPresent(true);
  W.FarmhandFriends  = ()=>W.Player.FriendList;
  W.FarmhandAddFriend= (mn)=>addFriend(mn, false);
  W.FarmhandOnCall   = ()=>forcedStaff();

  function makeBadge(){
    if (!CFG.SHOW_BADGE || state.badge) return;
    const d = W.document.createElement("div");
    d.textContent = "🌾 Farmhand: starting…";
    d.style.cssText = ["position:fixed","top:4px","left:4px","z-index:2147483647",
      "background:rgba(20,15,10,.88)","color:#ffd98a","font:12px/1.4 monospace",
      "padding:5px 9px","border:1px solid #8a6a3a","border-radius:5px",
      "cursor:pointer","user-select:none","max-width:320px"].join(";");
    d.title = "Click: set login • Shift+Click: status";
    d.addEventListener("click", ev => ev.shiftKey ? W.alert(statusText()) : promptCreds());
    W.document.body.appendChild(d);
    state.badge = d;
  }
  function setBadge(t,c){ if(!state.badge) return; state.badge.textContent="🌾 "+t; state.badge.style.color=c||"#ffd98a"; }

  /* ───────────── probes / login / room ───────────── */

  /* ONE FARM OFFICE. The bot only runs as the bot's own account (CFG.BOT_MEMBER), and only one copy at a
     time: copies in other tabs or browsers on this computer check in through a shared lock, and the ones
     that aren't in charge stay quiet (no answers, no saves). Otherwise a second copy, holding an older copy
     of the books, answers commands and saves over the real books: people "vanish" from the ledger. */
  const INSTANCE_ID = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const LOCK_KEY = "bnb_office_lock", LOCK_FRESH_MS = 45000;
  function officeCheck(){
    // wrong account: never run
    let me = 0; try { me = W.Player && W.Player.MemberNumber; } catch(e){}
    if (me && me !== CFG.BOT_MEMBER){
      if (state.dormant !== "account"){ state.dormant = "account"; warn("This is account "+me+", not the farm bot ("+CFG.BOT_MEMBER+"). The Farmhand Bot script stays off here."); }
      return false;
    }
    // another copy is in charge: stay quiet
    let lock = null; try { lock = JSON.parse(GM_getValue(LOCK_KEY, "null")); } catch(e){}
    const now = Date.now();
    if (lock && lock.id !== INSTANCE_ID && now - lock.at < LOCK_FRESH_MS){
      if (state.dormant !== "copy"){ state.dormant = "copy"; warn("Another copy of the Farmhand Bot is already running the farm (another tab or browser). This one stays quiet."); }
      return false;
    }
    // we're in charge (again): if we were quiet, re-read the books first so nothing newer is lost
    if (state.dormant){ const was = state.dormant; state.dormant = null; if (was === "copy"){ loadLedger(); log("Took over the farm office; re-read the books."); } }
    try { GM_setValue(LOCK_KEY, JSON.stringify({ id: INSTANCE_ID, at: now })); } catch(e){}
    return true;
  }

  function isLoggedIn(){ try { return !!(W.Player && W.Player.MemberNumber); } catch(e){ return false; } }
  function currentRoomName(){
    try {
      if (W.ChatRoomData && W.ChatRoomData.Name) return W.ChatRoomData.Name;
      if (W.ChatRoomName) return W.ChatRoomName;
    } catch(e){}
    return "";
  }
  function inRoom(){
    try {
      if (!Array.isArray(W.ChatRoomCharacter) || !W.ChatRoomCharacter.length) return false;
      return currentRoomName().toLowerCase() === CFG.ROOM_NAME.toLowerCase();
    } catch(e){ return false; }
  }
  function socketAlive(){
    try { return !!(W.ServerSocket && W.ServerSocket.connected !== false); } catch(e){ return false; }
  }

  function tryLogin(){
    const { user, pass } = getCreds();
    if (!user || !pass){ setBadge("no login saved — click me","#ff9b9b"); return; }
    const now = Date.now();
    if (now - state.lastLoginAttempt < 15000) return;
    state.lastLoginAttempt = now; state.loginTried++;
    setBadge("logging in… ("+state.loginTried+")");
    try {
      const n = W.document.getElementById("InputName"), p = W.document.getElementById("InputPassword");
      if (n && p && typeof W.LoginDoLogin === "function"){ n.value=user; p.value=pass; W.LoginDoLogin(); return; }
    } catch(e){ warn(e); }
    try { W.ServerSend("AccountLogin",{ AccountName:user, Password:pass }); } catch(e){ warn(e); }
  }

  function tryEnterRoom(){
    const now = Date.now();
    if (now - state.lastRoomAttempt < 12000) return;
    state.lastRoomAttempt = now;
    setBadge("joining room…");
    try { W.ServerSend("ChatRoomJoin",{ Name: CFG.ROOM_NAME }); } catch(e){ warn(e); }
  }

  // Remember the live room (map, bans, settings) so a rebuild brings the farm back whole.
  function snapshotRoom(force){
    if (!inRoom()) return;
    const now = Date.now();
    if (!force && now - state.lastSnapshot < CFG.ROOM_SNAPSHOT_MIN*60000) return;
    state.lastSnapshot = now;
    try {
      const d = W.ChatRoomData;
      if (!d) return;
      const snap = {
        Description:d.Description, Background:d.Background, Limit:d.Limit,
        Language:d.Language, Space:d.Space, BlockCategory:d.BlockCategory,
        Ban:d.Ban, Whitelist:d.Whitelist, Visibility:d.Visibility, Access:d.Access,
        Custom:d.Custom, MapData:d.MapData
      };
      const json = JSON.stringify(snap);
      if (L.roomSnapshot && JSON.stringify(L.roomSnapshot.room) === json) return;
      L.roomSnapshot = { at:now, room:JSON.parse(json) };
      saveLedger();
      dbg("room snapshot saved"+(d.MapData && d.MapData.Type ? " (map: "+d.MapData.Type+")" : ""));
    } catch(e){ warn("snapshotRoom:", e); }
  }

  function tryCreateRoom(){
    setBadge("rebuilding room…");
    const s = (L.roomSnapshot && L.roomSnapshot.room) || {};
    log("Rebuilding room: "+CFG.ROOM_NAME+(s.MapData ? " (with saved map)" : " (NO saved map)"));
    const visibility = s.Visibility || (CFG.ROOM_PRIVATE?["Admin"]:["All"]);
    const access = s.Access || ["All"];
    const data = {
      Name:CFG.ROOM_NAME,
      Description: s.Description || CFG.ROOM_DESC,
      Background: s.Background || CFG.ROOM_BG,
      Limit: s.Limit || CFG.ROOM_LIMIT,
      Language: s.Language || "EN",
      Space: s.Space || "",
      Private: !visibility.includes("All"), Locked: !access.includes("All"),
      Visibility: visibility, Access: access,
      Admin: CFG.ROOM_ADMINS.slice(),
      Ban: Array.isArray(s.Ban) ? s.Ban : [],
      BlockCategory: Array.isArray(s.BlockCategory) ? s.BlockCategory : [],
      Game:""
    };
    if (Array.isArray(s.Whitelist)) data.Whitelist = s.Whitelist;
    if (s.Custom) data.Custom = s.Custom;
    if (s.MapData) data.MapData = s.MapData;
    try { W.ServerSend("ChatRoomCreate", data); } catch(e){ warn(e); }
  }

