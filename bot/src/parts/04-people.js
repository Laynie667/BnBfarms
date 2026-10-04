  /* WHAT'S IN THIS FILE (04-people.js)
     Who's who: roles (proprietor, herdmaster, farmhand, stock…), keys each role gets, tiers, and herds
     (who leads whom).
  */
  /* ───────────── ROLES & KEYS ───────────── */

  function hasRole(mn, role){ const r = rec(mn); return !!r && r.roles.includes(role); }
  // the bot's own account counts as a proprietor, so the farm can be run from the bot's login too
  // (/office <command> in its chat, or the Companion on its account)
  function isProprietor(mn){ return mn === CFG.BOT_MEMBER || CFG.PROPRIETORS.includes(mn) || hasRole(mn, ROLE.PROPRIETOR); }
  function isHerdmaster(mn){ return isProprietor(mn) || hasRole(mn, ROLE.HERDMASTER); }
  function isMandated(mn){ return hasRole(mn, ROLE.MANDATED); }
  function isStaff(mn){ return isHerdmaster(mn) || hasRole(mn, ROLE.FARMHAND) || isMandated(mn); }
  function herdCap(mn){
    if (isProprietor(mn)) return CFG.HERD_CAP.PROPRIETOR;
    if (hasRole(mn, ROLE.HERDMASTER)) return CFG.HERD_CAP.HERDMASTER;
    if (hasRole(mn, ROLE.FARMHAND) || isMandated(mn)) return CFG.HERD_CAP.FARMHAND;
    return 0;
  }
  function canHoldHerd(mn){ return herdCap(mn) > 0; }
  function onDuty(mn){ const r = rec(mn); return r ? r.onDuty !== false : false; }

  function keysOf(mn){
    const r = rec(mn);
    if (!r) return [];
    const k = new Set();
    const duty = r.onDuty !== false;
    for (const role of r.roles) {
      switch (role) {
        case ROLE.PROPRIETOR: k.add("bronze"); if (duty){ k.add("silver"); k.add("gold"); } break;
        case ROLE.HERDMASTER: k.add("bronze"); if (duty){ k.add("silver"); if (r.goldKey) k.add("gold"); } break;
        case ROLE.MANDATED:
        case ROLE.FARMHAND:   k.add("bronze"); if (duty) k.add("silver"); break;
        case ROLE.LIVESTOCK:
        case ROLE.LUXURY:     k.add("bronze"); break;
        case ROLE.GLORYHOLE:  break;
      }
    }
    const now = Date.now();
    if (CFG.CURFEW_TAKES_BRONZE && typeof curfewBound === "function" && L.life && curfewBound(mn)) k.delete("bronze");
    r.tempKeys = (r.tempKeys||[]).filter(t => !t.until || t.until > now);
    for (const t of r.tempKeys) k.add(t.tier);
    return Array.from(k);
  }

  function keyString(mn){
    const k = keysOf(mn);
    if (!k.length) return "no keys";
    const m = { bronze:"🥉 bronze", silver:"🥈 silver", gold:"🥇 gold" };
    return ALL_TIERS.slice().reverse().filter(t=>k.includes(t)).map(t=>m[t]).join("  ");
  }

  const ROLE_PRETTY = {
    PROPRIETOR:"Proprietor", HERDMASTER:"Herdmaster", MANDATED:"Mandated Farmhand",
    FARMHAND:"Farmhand", LIVESTOCK:"Livestock", GUEST:"Guest",
    LUXURY:"Luxury Guest", GLORYHOLE:"Installed"
  };

  function roleString(mn){
    const r = rec(mn);
    if (!r || !r.roles.length) return "visitor";
    let s = r.roles.map(x=>ROLE_PRETTY[x]||x).join(" + ");
    if (r.goldKey && r.roles.includes(ROLE.HERDMASTER)) s += " 🥇";
    if (r.onDuty === false) s += r.pastureLock ? " (kept out in pasture 🔒)" : " (turned out to pasture)";
    if (isMandated(mn)) s += " 🔗mandated";
    else if (r.forced) s += " 🔗on call";
    return s;
  }

  function tierOf(mn){
    const r = rec(mn);
    if (!r) return "";
    if (r.tier) return r.tier;
    return r.roles.includes(ROLE.LIVESTOCK) ? "new" : "";       // stock start as new stock
  }
  function tierName(t){ return CFG.TIER_PRETTY[t] || t; }
  function parseTier(word){
    const w = String(word||"").toLowerCase().replace(/[^a-z]/g,"");
    if (w === "newstock" || w === "new") return "new";
    return CFG.TIERS.find(t => t === w) || null;
  }
  function brandTag(mn){ const r = rec(mn); return (r && r.brand) ? " ["+r.brand.mark+"]" : ""; }

  /* ───────────── HERDS ───────────── */

  // A person can sit in several herds (stock) or one (staff & proprietors).
  // Each membership: { leader, type:"perm"|"temp", since, ends, warned }.
  function herdsOf(mn){ const r = rec(mn); return (r && Array.isArray(r.herds)) ? r.herds : []; }
  function membership(mn, leader){ return herdsOf(mn).find(h => h.leader === leader) || null; }
  function herdMembers(leader){ return Object.values(L.people).filter(r => (r.herds||[]).some(h => h.leader === leader)); }
  function herdWord(leader){ const r = rec(leader); return (r && r.herdWord) || CFG.HERD_WORD_DEFAULT; }
  function herdLeaderOf(mn){ const h = herdsOf(mn)[0]; return h ? h.leader : null; }   // staff only ever have one

  function herdLabel(h){
    if (!h) return "";
    if (h.type === "temp"){
      if (!h.ends) return "temp";
      const left = h.ends - Date.now();
      if (left <= 0) return "temp (expired)";
      const d = Math.floor(left/86400000);
      const hr = Math.floor((left%86400000)/3600000);
      return "temp — " + (d ? d+"d " : "") + hr + "h left";
    }
    return "perm";
  }
  function herdsLine(mn){
    return herdsOf(mn).map(h => plainName(h.leader)+"'s "+herdWord(h.leader)+" ("+herdLabel(h)+")").join(", ");
  }

  function addToHerd(mn, leader, type, days){
    const r = rec(mn, true);
    r.herds = (r.herds||[]).filter(h => h.leader !== leader);
    const temp = type === "temp";
    r.herds.push({ leader, type: temp ? "temp" : "perm", since: Date.now(),
                   ends: temp ? Date.now() + (days || CFG.DEFAULT_TEMP_DAYS) * 86400000 : null,
                   warned:false });
    // claiming stock makes them livestock; claiming staff or a proprietor doesn't change their job
    if (!isStaff(mn) && !r.roles.includes(ROLE.LIVESTOCK)) r.roles.push(ROLE.LIVESTOCK);
    saveLedger();
    return r;
  }
  function removeFromHerd(mn, leader){
    const r = rec(mn);
    if (!r) return false;
    const before = (r.herds||[]).length;
    r.herds = (r.herds||[]).filter(h => h.leader !== leader);
    if (r.herds.length !== before){ saveLedger(); return true; }
    return false;
  }

  // Why a claim can't happen, or null if it can.
  function claimBlocker(leader, t){
    if (!canHoldHerd(leader)) return "Sorry, sweetie, only staff and proprietors get to keep a "+herdWord(leader)+".";
    if (t === leader) return "Aw, you can't claim yourself, sugar!";
    const already = membership(t, leader);
    const size = herdMembers(leader).length;
    if (!already && size >= herdCap(leader))
      return "Your "+herdWord(leader)+" is plumb full, hon — "+size+"/"+herdCap(leader)+". ?release somebody first to make room (like ?release Bessie).";
    if (isStaff(t) || isProprietor(t)){
      if (!isHerdmaster(leader)) return "Staff and proprietors can only go in a herdmaster's or herdmistress's "+herdWord(leader)+", sweetie.";
      const other = herdsOf(t).find(h => h.leader !== leader);
      if (other) return plainName(t)+" already belongs to "+plainName(other.leader)+", hon, and staff only answer to one leader.";
    }
    return null;
  }

  function expireHerdClaims(){
    const now = Date.now();
    for (const k in L.people){
      const r = L.people[k];
      for (const h of (r.herds||[]).slice()){
        if (h.type !== "temp" || !h.ends) continue;
        if (now >= h.ends){
          removeFromHerd(r.mn, h.leader);
          audit(CFG.BOT_MEMBER, "HERD_EXPIRE", r.mn + " was " + h.leader + "'s");
          beep(r.mn, "🌾 Your temporary spell in " + plainName(h.leader) + "'s " + herdWord(h.leader) + " is all done, " +
                     plainName(r.mn) + ". You're still ours, sweetie, just not claimed by them anymore.");
          beep(h.leader, "🌾 " + plainName(r.mn) + "'s temporary claim just ran out, hon. " +
                         "?claim " + r.mn + " again if you want 'em back.");
        }
        else if (!h.warned && (h.ends - now) < CFG.CLAIM_EXPIRY_WARN_H*3600000){
          h.warned = true; saveLedger();
          beep(h.leader, "⏳ Heads up, sugar: " + plainName(r.mn) + "'s temporary claim runs out in less than a day. " +
                         "?claim " + r.mn + " perm to keep 'em for good.");
        }
      }
    }
  }

