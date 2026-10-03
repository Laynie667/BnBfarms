  /* ───────────── LEDGER ───────────── */

  const LEDGER_KEY = "bnb_ledger_v1";
  let L = null;

  function blankLedger(){
    return { v:4, people:{}, applications:[], archive:{}, log:[],
             stuckLog:[], rescuePoint:null, createdAt:Date.now() };
  }

  function loadLedger(){
    try {
      const raw = GM_getValue(LEDGER_KEY,"");
      L = raw ? JSON.parse(raw) : blankLedger();
      if (!L || typeof L !== "object") L = blankLedger();
    } catch(e){ warn("Ledger load failed:",e); L = blankLedger(); }

    if (!L.people) L.people = {};
    if (!L.applications) L.applications = [];
    if (!L.archive) L.archive = {};
    if (!L.log) L.log = [];
    if (!L.stuckLog) L.stuckLog = [];
    if (!L.spots || typeof L.spots !== "object") L.spots = {};
    if (L.rescuePoint && !L.spots.rescue) L.spots.rescue = { X:L.rescuePoint.X, Y:L.rescuePoint.Y, by:0, at:Date.now() };
    if (!Array.isArray(L.tease)) L.tease = [];
    if (L.notice === undefined) L.notice = null;
    if (!L.life) L.life = { feedingOn:true, curfewOn:true };
    if (!Array.isArray(L.chores)) L.chores = CFG.CHORES.map(text => ({ text, by:0 }));
    if (!Array.isArray(L.wheel)) L.wheel = [];
    // old-style zones (before the A/B corner zones) are cleared; the new ones are kept
    if (L.zones && (typeof L.zones !== "object" || Object.values(L.zones).some(z => !z || typeof z !== "object" || !("group" in z)))) delete L.zones;

    // migrate records to v5: one herd → a list of herd memberships
    for (const k in L.people){
      const r = L.people[k];
      if (r.forced === undefined)    r.forced = false;
      if (!Array.isArray(r.tempKeys)) r.tempKeys = [];
      if (!Array.isArray(r.cover))    r.cover = [];
      if (!Array.isArray(r.herds)){
        r.herds = r.herd ? [{ leader:r.herd, type:r.herdType||"perm",
                              since:r.herdSince||Date.now(), ends:r.herdEnds||null,
                              warned:!!r.herdWarned }] : [];
      }
      delete r.herd; delete r.herdType; delete r.herdSince; delete r.herdEnds; delete r.herdWarned;
    }
    L.v = 5;

    for (const mn of CFG.PROPRIETORS) {
      if (!L.people[mn]) L.people[mn] = newRecord(mn);
      if (!L.people[mn].roles.includes(ROLE.PROPRIETOR)) L.people[mn].roles.push(ROLE.PROPRIETOR);
    }
    saveLedger();
    log("Ledger v5 loaded. Registered: " + Object.keys(L.people).length);
  }

  let saveTimer = null;
  function saveLedger(){
    if (saveTimer) return;
    saveTimer = later(()=>{
      saveTimer = null;
      try { GM_setValue(LEDGER_KEY, JSON.stringify(L)); } catch(e){ warn("save:",e); }
    }, 1500);   // a burst of changes saves once (the ledger gets big)
  }

  function newRecord(mn){
    return { mn, name:"", roles:[], onDuty:true, forced:false,
             species:"", herds:[], herdWord:"", goldKey:false, pastureLock:null,
             stayType:"", stayEnds:null, contractSigned:false,
             registeredAt:Date.now(), notes:"", limits:"", triggers:"", aftercare:"",
             cover:[], pastureNote:"", tempKeys:[],
             tier:"", brand:null, teaseOptIn:false, annivYear:0 };
  }
  function rec(mn, create){
    if (!L.people[mn] && create) L.people[mn] = newRecord(mn);
    return L.people[mn] || null;
  }
  function audit(actor, action, detail){
    L.log.push({ t:Date.now(), by:actor, a:action, d:detail||"" });
    if (L.log.length > 500) L.log = L.log.slice(-500);
    saveLedger();
  }

