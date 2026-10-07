  /* WHAT'S IN THIS FILE (10b-contracts.js)
     BC+ contracts: templates, buildin' a contract for one person, offerin' it the way BC+ expects,
     noticin' when they sign or decline, askin' their BC+ what they hold, releasin' it.
  */
  /* ═══════════ BC+ CONTRACTS ═══════════
     The farm writes BC+ contracts and I offer them, so BC+ records the farm as the author and only
     the farm can release 'em early. Nobody's bound till they read it in their own BC+ and countersign.
     Everything's checked against BC+'s own rule list first (shared/bcplus.js), because BC+ quietly
     drops any setting it doesn't like. */
  const DEFAULT_TERMS = {
    fun:  "A light little contract with B&B Farm, %name%. You'll moo and wave, and you can end it whenever you like.",
    deep: "You're properly kept by B&B Farm for the length of this contract, %name%. Only the farm can end it early, and a safeword always reaches staff.",
    nhl:  "No human left, %name%. You belong to B&B Farm as an animal for the length of this contract, and only the farm can end it early. A safeword always reaches staff, and they'll come check on you."
  };
  function contractsLedger(){ L.contractTemplates = L.contractTemplates || {}; L.contracts = L.contracts || []; }
  function farmInfo(){
    const staff = Object.keys(L.people).map(Number).filter(m => isStaff(m));
    return { bot: CFG.BOT_MEMBER, staff, rooms: (CFG.CONTRACT_ROOMS && CFG.CONTRACT_ROOMS.length) ? CFG.CONTRACT_ROOMS : [CFG.ROOM_NAME] };
  }
  // the three ready-made ones always exist; saved ones live in the ledger
  function contractTemplate(name){
    contractsLedger();
    const n = String(name||"").toLowerCase();
    if (L.contractTemplates[n]) return L.contractTemplates[n];
    const d = BCPLUS.depthFrom(n);
    if (d && d.key === n) return { title: "B&B Farm · "+d.label, terms: DEFAULT_TERMS[d.key], base: d.key, add: {}, remove: [] };
    return null;
  }
  // a template, made real for one person
  function buildContract(tpl, mn, durKey){
    const r = rec(mn) || {};
    // asked for: one contract, a nickname per person ("BnB Cow Vicky", "BnB Pet Rya"): {name}, {Species}… are
    // filled in when it's offered (see fillWho in shared/bcplus.js)
    const who = { name: shortName(mn), species: r.species || "" };
    const rules = tpl.base ? BCPLUS.templateRules(tpl.base, who, Object.assign(farmInfo(), { nickname: CFG.CONTRACT_NICKNAME })) : {};
    for (const id of tpl.remove || []) delete rules[id];
    for (const [id, set] of Object.entries(tpl.add || {}))
      rules[id] = BCPLUS.makeSpec(id, Object.assign({}, rules[id] ? rules[id].settings : {}, JSON.parse(JSON.stringify(set))));
    BCPLUS.fillRules(rules, who);
    return BCPLUS.makeContract({ title: BCPLUS.fillWho(tpl.title, who), terms: BCPLUS.fillWho(fill(tpl.terms || "", mn), who), duration: BCPLUS.durationFrom(durKey),
                                 depth: tpl.base, policy: tpl.policy, rules });
  }
  // "value as typed" → what BC+ wants for that setting
  function settingValue(setting, raw){
    const t = String(raw == null ? "" : raw).trim();
    switch (setting.type){
      case "checkbox": if (/^(on|yes|true|1)$/i.test(t)) return { value:true }; if (/^(off|no|false|0)$/i.test(t)) return { value:false }; return { err:"say on or off" };
      case "option": { const o = setting.options.find(x => x.toLowerCase() === t.toLowerCase()); return o ? { value:o } : { err:"pick one of: "+setting.options.join(", ") }; }
      case "text": return { value:t };
      case "stringList": return { value: t ? t.split("|").map(s => s.trim()).filter(Boolean) : [] };
      case "members": {
        if (/^farm$/i.test(t)) { const f = farmInfo(); return { value: [f.bot].concat(f.staff) }; }
        if (/^staff$/i.test(t)) return { value: farmInfo().staff };
        const v = t.split(/[,\s]+/).filter(Boolean).map(x => resolveTarget(x));
        return v.every(Number.isInteger) ? { value:v } : { err:"member numbers or names, separated by commas (or farm, or staff)" };
      }
    }
    return { err:"I don't know that kind of setting" };
  }
  // key=value pairs, with "quotes" for spaces: animal=Cow sentences="Good cow.|Moo for me."
  function parsePairs(text){
    const out = {}; const rx = /(\w+)=(?:"([^"]*)"|(\S+))/g; let m;
    while ((m = rx.exec(text))) out[m[1]] = m[2] !== undefined ? m[2] : m[3];
    return out;
  }
  function describeContract(c){
    const d = BCPLUS.DURATIONS.find(x => x.min === c.durationMin);
    const lines = ["📜 "+c.title+" · "+(d ? d.label : Math.round(c.durationMin/60)+" h")+" · ends early: "+(c.policy === "either" ? "either side" : "only the farm")];
    if (c.terms) lines.push("“"+c.terms+"”");
    for (const [id, spec] of Object.entries(c.rules)){
      const def = BCPLUS.RULES.get(id);
      const set = Object.entries(spec.settings || {}).filter(([,v]) => !(Array.isArray(v) && !v.length) && v !== "")
        .map(([k,v]) => k+"="+(Array.isArray(v) ? v.join("|") : v)).join(" ");
      lines.push("  • "+(def ? def.name : id)+(set ? " · "+set : ""));
    }
    return lines.join("\n");
  }
  function offerContract(sender, tplName, t, durText){
    contractsLedger();
    const tpl = contractTemplate(tplName);
    if (!tpl) return "There's no contract called '"+tplName+"', sugar. ?contract list shows them (fun, deep and nhl are always there).";
    const d = BCPLUS.durationFrom(durText);
    if (!d) return "How long, hon? Say 1h, 12h, 1d, 1w, 2w, 1m or perm.";
    if (!charFor(t)) return plainName(t)+" has to be here in the room for a contract offer, sugar. BC+ only takes 'em in person.";
    const c = buildContract(tpl, t, d.key);
    const problems = BCPLUS.checkContract(c);
    if (problems.length) return "That one wouldn't work in BC+, sugar, so I didn't send it:\n• "+problems.join("\n• ");
    const mine = L.contracts.filter(x => x.mn === t && (x.status === "signed" || x.status === "offered"));
    if (mine.filter(x => x.status === "signed").length >= BCPLUS.LIMITS.MAX_ACTIVE) return plainName(t)+" already holds "+BCPLUS.LIMITS.MAX_ACTIVE+" farm contracts, and BC+ won't take more.";
    enqueue(BCPLUS.offerMsg(c, t, CFG.ROOM_NAME));
    const entry = { mn: t, by: sender, tpl: String(tplName).toLowerCase(), title: c.title, depth: tpl.base || "custom",
                    durationMin: c.durationMin, policy: c.policy, rules: Object.keys(c.rules), status: "offered", at: Date.now() };
    const prepared = trackedContract(t, null, ["prepared"]);   // the one their application asked for
    if (prepared) Object.assign(prepared, entry); else L.contracts.push(Object.assign({ key: Date.now().toString(36) }, entry));
    if (L.contracts.length > 300) L.contracts = L.contracts.slice(-300);
    saveLedger(); audit(sender, "CONTRACT_OFFER", t+" "+c.title+" "+d.key);
    tell(t, "📜 "+plainName(sender)+" offers you the farm contract \""+c.title+"\" ("+d.label+"). Read it on your BC+ Contracts page, and only sign if you want it. Nothin' applies till you do.");
    return "";
  }
  // a contract entry we're tracking for someone, by title (newest first)
  function trackedContract(mn, title, statuses){
    contractsLedger();
    for (let i = L.contracts.length - 1; i >= 0; i--){
      const x = L.contracts[i];
      if (x.mn === mn && (!title || x.title === title) && (!statuses || statuses.includes(x.status))) return x;
    }
    return null;
  }
  // BC+ tells the author in plain words when somebody signs, declines, or is let go
  function onBCPAction(data){
    const d = Array.isArray(data.Dictionary) ? data.Dictionary.find(e => e && typeof e.Text === "string") : null;
    if (!d) return false;
    const text = d.Text, mn = data.Sender;
    let m;
    if ((m = text.match(/has signed your contract "(.+)"\./))){
      const x = trackedContract(mn, m[1], ["offered"]);
      if (x){ x.status = "signed"; x.signedAt = Date.now(); x.until = x.durationMin ? Date.now() + x.durationMin*60000 : null; saveLedger(); audit(mn, "CONTRACT_SIGNED", x.title); }
      notifyStaff("📜 "+plainName(mn)+" signed the farm contract \""+m[1]+"\".", true);
      // the outfit that goes with it: "auto" picks theirs by species and gender
      const tpl = x && contractTemplate(x.tpl), dress = tpl ? (tpl.outfit === undefined ? "auto" : tpl.outfit) : "";
      const slot = dress === "auto" ? outfitSlotFor(mn) : dress;
      if (slot) later(() => offerOutfit(mn, slot, "It goes with your new contract"), 3000);
      later(() => enqueue(BCPLUS.queryMsg(mn)), 2000);   // fetch BC+'s id for it, so we can release it later
      return true;
    }
    if ((m = text.match(/declined the contract "(.+)"\./))){
      const x = trackedContract(mn, m[1], ["offered"]);
      if (x){ x.status = "declined"; saveLedger(); }
      return true;
    }
    if ((m = text.match(/is no longer bound by the contract "(.+)"\./))){
      const x = trackedContract(mn, m[1], ["signed", "releasing"]);
      if (x){ x.status = "ended"; x.endedAt = Date.now(); saveLedger(); }
      return true;
    }
    return false;
  }
  // BC+'s own list of the farm's contracts on somebody
  function onBCPMessage(m){
    if (m.message !== "ContractList" || !Array.isArray(m.contracts)) return;
    const mn = m.from, held = m.contracts;
    contractsLedger();
    for (const bc of held){
      const x = trackedContract(mn, bc.title, ["offered", "signed", "releasing"]) ||
                (L.contracts.push({ key: Date.now().toString(36), mn, title: bc.title, depth: "unknown", durationMin: bc.durationMin, policy: bc.policy,
                                    rules: Object.keys(bc.rules || {}), status: "signed", at: bc.signedAt }), L.contracts[L.contracts.length-1]);
      if (x.status === "offered") x.status = "signed";
      x.bcpId = bc.id; x.signedAt = bc.signedAt; x.until = bc.until;
    }
    for (const x of L.contracts) if (x.mn === mn && (x.status === "signed" || x.status === "releasing") && x.bcpId && !held.some(bc => bc.id === x.bcpId)){ x.status = "ended"; x.endedAt = Date.now(); }
    saveLedger();
  }
  function releaseContract(sender, t, title){
    const x = trackedContract(t, title || null, ["signed", "releasing"]);
    if (!x) return plainName(t)+" doesn't hold "+(title ? "a farm contract called \""+title+"\"" : "any farm contract")+" that I know of, hon. ?contract check "+plainName(t)+" asks their BC+.";
    if (!charFor(t)) return plainName(t)+" has to be here in the room, sugar. BC+ only listens in person.";
    if (!x.bcpId){ enqueue(BCPLUS.queryMsg(t)); return "I'm askin' their BC+ for that contract's number first. Try again in a few seconds, sugar."; }
    enqueue(BCPLUS.releaseMsg(t, x.bcpId));
    x.status = "releasing"; saveLedger(); audit(sender, "CONTRACT_RELEASE", t+" "+x.title);
    return "";
  }
  // ?contract from stock or a guest: their own farm contracts (seen live: livestock asked and were told it's staff-only)
  function myContractsText(mn){
    contractsLedger();
    const mine = L.contracts.filter(x => x.mn === mn && ["prepared","offered","signed","releasing"].includes(x.status));
    const how = { prepared: "ready for staff to offer you", offered: "waitin' on you: read it on your BC+ Contracts page, and sign only if you want it",
                  signed: "signed", releasing: "bein' released" };
    if (!mine.length) return "📜 You haven't got a farm contract yet, sugar. A herdmaster or the proprietors offer one in person, and it turns up on your BC+ Contracts page "+
      "for you to read and sign. Nothin' in it applies till you do. Just ask one of 'em if you'd like one.";
    return "📜 YOUR FARM CONTRACTS\n"+mine.map(x => "  • \""+x.title+"\" · "+how[x.status]+
      (x.status === "signed" && x.until ? " · "+Math.max(0, Math.round((x.until - Date.now())/3600000))+" h left" : "")).join("\n")+
      "\n\nStaff can let you out of one any time; just ask.";
  }
  function contractLine(x){
    const left = x.until ? Math.max(0, Math.round((x.until - Date.now())/3600000))+" h left" : (x.status === "signed" ? "permanent" : "");
    return plainName(x.mn)+" · \""+x.title+"\" · "+x.status+(left ? " · "+left : "");
  }

