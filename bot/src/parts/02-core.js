  /* ═══════════════════════════════════════════════════════════ */

  const W = (typeof unsafeWindow !== "undefined" && unsafeWindow) ? unsafeWindow : window;
  const TAG = "[Farmhand]";
  const log  = (...a) => console.log(TAG, ...a);
  const dbg  = (...a) => { if (CFG.DEBUG) console.log(TAG, ...a); };
  const warn = (...a) => console.warn(TAG, ...a);

  const ROLE = {
    PROPRIETOR:"PROPRIETOR", HERDMASTER:"HERDMASTER",
    MANDATED:"MANDATED", FARMHAND:"FARMHAND",
    LIVESTOCK:"LIVESTOCK", GUEST:"GUEST", LUXURY:"LUXURY", GLORYHOLE:"GLORYHOLE"
  };
  const ROLE_ORDER = ["PROPRIETOR","HERDMASTER","MANDATED","FARMHAND",
                      "LIVESTOCK","LUXURY","GUEST","GLORYHOLE"];
  const ALL_TIERS = ["bronze","silver","gold"];

  const state = {
    companions:new Map(), lastPing:0,
    booted:false, loginTried:0, lastLoginAttempt:0, lastRoomAttempt:0,
    greeted:new Map(), cooldowns:new Map(), queue:[], urgent:[], sending:false, badge:null,
    lastSnapshot:0,
    sessions:new Map(), pendingClaims:new Map(), breedAsks:new Map(), breedOk:new Map(), jarAsks:new Map(),
    lastSynced:new Map(), lastFullSync:0,
    stuckCooldown:new Map(), summonCooldown:new Map(),
    heard:0, lastKeepalive:0, lastNudge:0, lastHealthy:Date.now(),
    worker:null, reloading:false,
    arrivals:new Map(), teaseNext:new Map(), scenes:new Map(),
    leashes:new Map(), tours:new Map(), lastSpoke:new Map()
  };

