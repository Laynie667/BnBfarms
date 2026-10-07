  /* WHAT'S IN THIS FILE (10l-ribbons.js)
     RIBBONS: the farm's scrip. Stock earn them for bein' good (quota met, a full stall session, chores, a
     glory shift worked, the week's best milk or top sire), staff hand them out or take them away, and they
     carry over day to day. Earnin' is capped a day (CFG.RIBBON_DAY_CAP); staff grants aren't.
     THE FARM STORE: ribbons buy potions, shots, wheel spins, a luxury day, a skipped chore, quota grace, a
     greetin' of your own, a ribbon tag on ?who, a dedication, or a bounty on a chore. Some can be gifted, and
     the one gettin' it always gets a yes/no card first. The proprietors set prices and what's on the shelf.
     THE SUNDAY TILL: each new week the farm girl names the top earner (who gets a bonus) and the big spender.
     Commands: ?ribbons [who|top] · ?ribbon give|fine <who> <n> [why] (staff) · ?store · ?buy <item> [for <who>]
     · ?store price|off|on <item> (proprietors) · ?store approve|reject <who> (staff: custom greetin's)
  */

  // ── the purse ────────────────────────────────────────────
  function ribbonsOf(mn){ const r = rec(mn); return r ? (r.ribbons || 0) : 0; }
  function ribbonWeek(r){ const k = weekKey(); if (!r.rw || r.rw.key !== k) r.rw = { key: k, earned: 0, spent: 0 }; return r.rw; }
  function ribbonLog(mn, n, why, by){
    L.ribbonLog = L.ribbonLog || [];
    L.ribbonLog.push({ at: Date.now(), mn, n, why: String(why || "").slice(0, 80), by: by || 0 });
    if (L.ribbonLog.length > 600) L.ribbonLog = L.ribbonLog.slice(-600);
  }
  // earned for farm things (capped a day); `by` set (staff, the till) skips the cap
  function earnRibbons(mn, n, why, by, quiet){
    const r = rec(mn);
    if (!CFG.RIBBONS_ON || !r || !r.roles || !r.roles.length || !(n > 0)) return 0;
    n = Math.round(n);
    if (!by){
      const d = dayKey(); if (!r.rday || r.rday.d !== d) r.rday = { d, n: 0 };
      n = Math.min(n, Math.max(0, CFG.RIBBON_DAY_CAP - r.rday.n));
      if (!n) return 0;
      r.rday.n += n;
    }
    r.ribbons = (r.ribbons || 0) + n; ribbonWeek(r).earned += n; ribbonLog(mn, n, why, by); saveLedger();
    if (!quiet) tell(mn, "🎀 +"+n+" ribbon"+(n === 1 ? "" : "s")+" for "+why+". That's "+r.ribbons+" in your purse, sugar.");
    return n;
  }
  function spendRibbons(mn, n, why){
    const r = rec(mn);
    if (!r || (r.ribbons || 0) < n) return false;
    r.ribbons -= n; ribbonWeek(r).spent += n; ribbonLog(mn, -n, why); saveLedger();
    return true;
  }
  function fineRibbons(mn, n, why, by){
    const r = rec(mn); if (!r) return 0;
    const take = Math.min(r.ribbons || 0, Math.round(n));
    r.ribbons = (r.ribbons || 0) - take; ribbonLog(mn, -take, "fine: "+why, by); saveLedger();
    return take;
  }

  // ── the Sunday till, and timed store things runnin' out ───
  function ribbonTick(){
    const now = Date.now();
    for (const [k, r] of Object.entries(L.people)){
      const mn = parseInt(k, 10);
      if (r.luxuryTemp && r.luxuryUntil < now){
        r.roles = (r.roles || []).filter(x => x !== ROLE.LUXURY); r.luxuryTemp = false; r.luxuryUntil = 0; saveLedger();
        try { syncKeys(mn, true); } catch(e){}
        tell(mn, "🛁 Your luxury day's over, sugar. Back to the straw with the rest of 'em. It was nice while it lasted, wasn't it?");
      }
      if (r.tag && r.tag.until < now){ r.tag = null; saveLedger(); }
      if (r.greet && r.greet.until < now){ r.greet = null; saveLedger(); }
    }
    const wk = weekKey();
    if (!L.ribbonWeekKey){ L.ribbonWeekKey = wk; saveLedger(); return; }
    if (L.ribbonWeekKey === wk) return;
    const prev = L.ribbonWeekKey; L.ribbonWeekKey = wk; saveLedger();
    const rows = Object.entries(L.people).filter(([, r]) => r.rw && r.rw.key === prev).map(([k, r]) => [parseInt(k, 10), r.rw]);
    const top = rows.filter(([, w]) => w.earned > 0).sort((a, b) => b[1].earned - a[1].earned)[0];
    const big = rows.filter(([, w]) => w.spent > 0).sort((a, b) => b[1].spent - a[1].spent)[0];
    if (top) earnRibbons(top[0], CFG.RIBBON_TOP_BONUS, "bein' the top earner of the week", CFG.BOT_MEMBER);
    if ((top || big) && inRoom())
      announce("🎀 THE SUNDAY TILL! "+(top ? "Top earner this week: "+plainName(top[0])+" with "+top[1].earned+" ribbons, and a bonus on top. Good animal." : "")+
               (big ? " Biggest spender: "+plainName(big[0])+", "+big[1].spent+" ribbons gone. Somebody's been treatin' themselves." : ""));
  }

  // ── yes/no cards the farm itself asks (gifts) ────────────
  function farmAsk(mn, text, cb){
    state.farmAsks = state.farmAsks || new Map();
    state.farmAsks.set(mn, { cb, at: Date.now() });
    askCard(mn, "farm", text);
  }
  function farmYesNo(mn, yes){
    const a = state.farmAsks && state.farmAsks.get(mn);
    if (!a) return false;
    state.farmAsks.delete(mn);
    if (Date.now() - a.at > 15*60000){ tell(mn, "That question timed out, sugar, so nothin' happened."); return true; }
    try { a.cb(!!yes); } catch(e){ warn("farm ask:", e); }
    return true;
  }

  // ── vanity: a greetin' of your own, a ribbon tag on ?who ──
  function customGreeting(mn){
    const r = rec(mn), g = r && r.greet;
    return g && g.ok && g.until > Date.now() ? fill(g.text, mn) : null;
  }
  function vanityTag(mn){
    const r = rec(mn), t = r && r.tag;
    return t && t.until > Date.now() ? " 🎀"+t.text : "";
  }

  // ── the shelf ─────────────────────────────────────────────
  const STORE_BASE = [
    { id: "spin",      name: "A spin of the wheel",   price: 3,  desc: "Spin the farm wheel for yourself. Sweet or rotten, you take what it lands on." },
    { id: "lucky",     name: "A lucky spin",          price: 8,  desc: "Mostly sweet slices. Mostly." },
    { id: "luxury",    name: "A luxury day",          price: 25, desc: "24 hours as a luxury guest: the soft straw, the good feed, and everybody calls you darlin'." },
    { id: "skipchore", name: "Skip a chore",          price: 4,  desc: "Your chore comes off the board. Nobody needs to know." },
    { id: "grace",     name: "Quota grace",           price: 10, desc: "Forgives one missed milk quota day before it becomes a naughty mark (hold up to 2)." },
    { id: "greeting",  name: "A greetin' of your own", price: 8, desc: "For a week, the farm girl greets you with a line you write (staff read it first). ?buy greeting <your line>" },
    { id: "tag",       name: "A ribbon tag",          price: 5,  desc: "A little tag by your name on ?who for a week. ?buy tag <up to 24 letters>, like ?buy tag Good Girl" },
    { id: "dedicate",  name: "A dedication",          price: 2,  desc: "The farm girl sings somebody's praises (or teases 'em, if they like that) from you. ?buy dedicate <who> praise|tease" },
    { id: "bounty",    name: "A bounty",              price: 0,  desc: "Pin ribbons to a job; the hand who does it collects. ?buy bounty <ribbons> <the job>" },
    { id: "shot-milk",  name: "A lactation shot",     price: 6,  desc: "Milk doubles for a day." },
    { id: "shot-semen", name: "A virility shot",      price: 6,  desc: "Semen doubles for a day." },
    { id: "shot-fert",  name: "A fertility shot",     price: 6,  desc: "Catchin' doubles for a day." },
    { id: "shot-contra",name: "A contraceptive shot", price: 4,  desc: "No catchin' for two days." },
  ];
  function storeItems(){
    const S = L.store || {}, price = S.price || {}, off = S.off || {};
    const potions = POTIONS.map(p => ({ id: "potion-"+p.id, name: p.name, price: p.price, desc: p.desc, potion: p.id, gift: true, kind: p.kind }));
    return STORE_BASE.concat(potions).map(it => Object.assign({}, it, { price: price[it.id] !== undefined ? price[it.id] : it.price, off: !!off[it.id] }));
  }
  function storeItem(word){
    const w = String(word || "").toLowerCase().replace(/^potion[-:\s]?/, "potion-").replace(/[^a-z0-9-]/g, "");
    const items = storeItems();
    return items.find(it => it.id === w) || items.find(it => it.potion && ("potion-"+it.potion === w || it.potion === w.replace(/^potion-/, ""))) ||
           items.find(it => it.name.toLowerCase().replace(/[^a-z0-9]/g, "").includes(w.replace(/-/g, "")) && w.length >= 4) || null;
  }
  function storeText(mn){
    const items = storeItems().filter(it => !it.off);
    const row = it => "  "+it.price+"🎀 · "+(it.potion ? it.potion : it.id)+" · "+it.name;
    return "🛍️ THE FARM STORE · you've got "+ribbonsOf(mn)+" ribbons\n"+
      "\nTREATS & FAVORS\n"+items.filter(it => !it.potion && !it.id.startsWith("shot")).map(row).join("\n")+
      "\n\nSHOTS\n"+items.filter(it => it.id.startsWith("shot")).map(row).join("\n")+
      "\n\nPOTIONS (they wear off · ?potions on to let others gift you one)\n"+items.filter(it => it.potion).map(row).join("\n")+
      "\n\n?buy <item> · ?buy <potion> for <who> (they say yes first) · ?potions shows what each one does";
  }

  // ── buyin' ────────────────────────────────────────────────
  function buy(sender, args, R){
    const r = rec(sender);
    if (!r || !r.roles || !r.roles.length){ R("The store's for folks on the books, sugar. ?apply first!"); return; }
    if (!args.length){ R(storeText(sender)); return; }
    const it = storeItem(args[0]);
    if (!it || it.off){ R("We don't stock that, hon. ?store shows the shelf."); return; }
    let rest = args.slice(1);
    // "for <who>": a gift
    let forWho = null;
    const fi = rest.findIndex(w => /^(for|to)$/i.test(w));
    if (fi >= 0 && rest[fi+1]){ forWho = resolveTarget(rest[fi+1]); rest = rest.slice(0, fi).concat(rest.slice(fi+2)); }
    if (forWho === sender) forWho = null;
    const text = rest.join(" ").trim();
    const price = it.price;
    const short = () => R("That's "+price+" ribbons, sugar, and you've only got "+ribbonsOf(sender)+". Earn a few more: make your quota, finish a stall session, be good.");
    if (it.id !== "bounty" && ribbonsOf(sender) < price){ short(); return; }
    const today = dayKey(); r.buys = r.buys && r.buys.d === today ? r.buys : { d: today, n: {} };
    const limit = (CFG.STORE_DAY_LIMIT || {})[it.id];
    if (limit && (r.buys.n[it.id] || 0) >= limit){ R("Just "+limit+" of those a day, sugar. Come back tomorrow."); return; }
    const done = (what) => { r.buys.n[it.id] = (r.buys.n[it.id] || 0) + 1; audit(sender, "BUY", it.id+(forWho ? " for "+forWho : "")+" "+price); saveLedger(); if (what) R(what); };

    if (it.potion){
      if (forWho){
        if (!rec(forWho)){ R("I don't know who that is, sugar."); return; }
        const why = potionRefusal(forWho, it.potion, sender);
        if (why){ R(why); return; }
        R("🎁 I've asked "+plainName(forWho)+" if they'll take your "+it.name+". You only pay if they say yes.");
        farmAsk(forWho, "🎁 "+plainName(sender)+" wants to give you a "+it.name+" ("+potionDef(it.potion).desc+"). Drink it? Say yes or no.", (yes) => {
          if (!yes){ tell(sender, "🎁 "+plainName(forWho)+" turned down your "+it.name+", sugar. Your ribbons are still yours."); return; }
          if (!spendRibbons(sender, price, it.name+" for "+plainName(forWho))){ tell(forWho, "Aw, they couldn't pay for it after all, sugar."); tell(sender, "You didn't have the ribbons anymore, hon."); return; }
          givePotion(forWho, it.potion, sender, "a gift from "+plainName(sender));
          tell(sender, "🎁 "+plainName(forWho)+" drank your "+it.name+". Enjoy the show.");
          r.buys.n[it.id] = (r.buys.n[it.id] || 0) + 1; saveLedger();
        });
        return;
      }
      const why = potionRefusal(sender, it.potion, sender);
      if (why){ R(why); return; }
      spendRibbons(sender, price, it.name);
      givePotion(sender, it.potion, sender, "bought it yourself");
      done("🧪 Down the hatch! "+price+" ribbons for a "+it.name+". ("+ribbonsOf(sender)+" left)");
      return;
    }
    if (forWho && it.id !== "dedicate"){ R("That one's just for you, sugar. Potions and dedications can be gifts."); return; }

    switch (it.id){
      case "spin": case "lucky": {
        const res = spinWheel(sender, sender, it.id === "lucky" ? "lucky" : "", CFG.BOT_MEMBER);
        if (!res){ R("Nothin' on the wheel fits you right now, sugar, so I won't charge you."); return; }
        spendRibbons(sender, price, it.name); done("🎡 "+price+" ribbons in the slot. ("+ribbonsOf(sender)+" left)");
        return;
      }
      case "luxury": {
        if (hasRole(sender, ROLE.LUXURY)){ R("You're already livin' the luxury life, sugar."); return; }
        spendRibbons(sender, price, it.name);
        r.roles.push(ROLE.LUXURY); r.luxuryTemp = true; r.luxuryUntil = Date.now() + 24*3600000;
        try { syncKeys(sender, true); } catch(e){}
        if (onMap(sender)) emote("🛁 The farm girl fluffs a pillow of clean straw and sets a little bell by "+plainName(sender)+". A whole day of luxury, paid in ribbons. Ring if you need anything, darlin'.", sender);
        done("🛁 Your luxury day starts now, sugar: 24 hours. ("+ribbonsOf(sender)+" ribbons left)");
        return;
      }
      case "skipchore": {
        if (!r.chore){ R("You haven't got a chore right now, sugar, so keep your ribbons."); return; }
        spendRibbons(sender, price, it.name); const was = r.chore.text; r.chore = null;
        done("🧹 \""+String(was).replace(/\s*@[a-z0-9_-]+\s*$/i, "")+"\" is off your list. Our little secret.");
        return;
      }
      case "grace": {
        if ((r.quotaGrace || 0) >= 2){ R("You're already holdin' two, sugar. That's plenty of forgiveness."); return; }
        spendRibbons(sender, price, it.name); r.quotaGrace = (r.quotaGrace || 0) + 1;
        done("📋 Quota grace in your pocket ("+r.quotaGrace+" now). The next day you come up short, it's forgiven.");
        return;
      }
      case "greeting": {
        if (text.length < 6 || text.length > 160){ R("Write the line too, sugar (6 to 160 letters). %name% becomes your name. For example: ?buy greeting Look who's back, it's %name%, the prettiest cow in the county!"); return; }
        spendRibbons(sender, price, it.name);
        r.greet = { text: text.replace(/[()]/g, ""), until: Date.now() + 7*86400000, ok: false };
        notifyStaff("🎀 "+plainName(sender)+" bought a greetin' of their own: \""+r.greet.text+"\". ?store approve "+sender+" or ?store reject "+sender+" (refunds it).", true);
        done("🎀 Bought! Staff give it a read, then for a week I'll greet you with it.");
        return;
      }
      case "tag": {
        const t = text.replace(/[()\[\]<>]/g, "").trim();
        if (t.length < 2 || t.length > 24){ R("What should it say, sugar? 2 to 24 letters, like ?buy tag Good Girl"); return; }
        spendRibbons(sender, price, it.name);
        r.tag = { text: t, until: Date.now() + 7*86400000 };
        done("🎀 Your tag reads \""+t+"\" for a week. Look for it on ?who.");
        return;
      }
      case "dedicate": {
        const t = forWho || resolveTarget(rest[0]);
        const how = /tease|degrade|mean/i.test(text) ? "tease" : "praise";
        if (!t || !rec(t) || t === sender){ R("Who's it for, sugar? ?buy dedicate <who> praise or ?buy dedicate <who> tease"); return; }
        if (!onMap(t)){ R(plainName(t)+" isn't here to hear it, hon."); return; }
        if (how === "tease" && !(rec(t).degradeMe || rec(t).teaseOptIn)){ R(plainName(t)+" hasn't said they like bein' teased, sugar. Try praise."); return; }
        spendRibbons(sender, price, it.name+" for "+plainName(t));
        const pool = how === "tease" ? DEDICATE_TEASE : DEDICATE_PRAISE;
        emote("🎀 "+pool[Math.floor(Math.random()*pool.length)].replace(/%t/g, plainName(t)).replace(/%b/g, plainName(sender)), t);
        done("🎀 Dedicated. ("+ribbonsOf(sender)+" ribbons left)");
        return;
      }
      case "bounty": {
        const n = parseInt(rest[0], 10), job = rest.slice(1).join(" ").trim();
        if (!(n >= 1 && n <= 50) || job.length < 4){ R("How many ribbons, and what's the job? ?buy bounty <1-50> <the job>, like ?buy bounty 5 Brush down the ponies @stable"); return; }
        if (ribbonsOf(sender) < n){ R("You've only got "+ribbonsOf(sender)+" ribbons, sugar."); return; }
        spendRibbons(sender, n, "bounty: "+job);
        L.chores.push({ text: job, by: sender, bounty: n, key: Date.now().toString(36) }); saveLedger();
        done("📌 Bounty posted: "+n+" ribbons to whoever does \""+job.replace(/\s*@[a-z0-9_-]+\s*$/i, "")+"\".");
        return;
      }
      default: {
        if (it.id.startsWith("shot-")){
          const p = prodOf(sender), now = Date.now(), H = 3600000;
          spendRibbons(sender, price, it.name);
          if (it.id === "shot-milk") p.boosts.milk = now + 24*H;
          if (it.id === "shot-semen") p.boosts.semen = now + 24*H;
          if (it.id === "shot-fert") p.boosts.fert = now + 24*H;
          if (it.id === "shot-contra") p.boosts.contra = now + 48*H;
          if (onMap(sender)) emote("💉 The farm girl pinches up a bit of "+plainName(sender)+"'s flank and slides the needle in, quick and practiced. \"There. You'll feel that by supper.\"", sender);
          done("💉 "+it.name+" in. "+it.desc+" ("+ribbonsOf(sender)+" ribbons left)");
          return;
        }
        R("We don't stock that, hon. ?store shows the shelf.");
      }
    }
  }
  const DEDICATE_PRAISE = [
    "The farm girl clears her throat for the whole barn: \"This one's from %b, for %t. Prettiest thing in the straw, and the best behaved. Y'all take notice.\"",
    "\"Special delivery from %b!\" The farm girl tucks a ribbon behind %t's ear. \"Says you're the sweetest animal on the property. I don't disagree.\"",
    "The farm girl leans on the rail by %t and reads off a little card: \"From %b: you're doin' so good, and everybody can see it.\" She pats %t's cheek. \"Ain't that nice.\"",
    "\"Listen up! %b paid good ribbons to say %t is a credit to this farm.\" A few whistles go up from the hands. %t is blushin' to the ears."
  ];
  const DEDICATE_TEASE = [
    "The farm girl reads a little card out loud, grinnin': \"From %b, for %t: 'You look so good drippin' in the straw, try not to moo too loud tonight.'\" Somebody snickers.",
    "\"Dedication for %t, courtesy of %b!\" The farm girl tips %t's chin up. \"Says you're the neediest thing in the barn. Look at that face. They ain't wrong.\"",
    "The farm girl taps %t's nose. \"%b wanted everybody to know you've been eyein' the breedin' pen all day. Go on, deny it. Nobody believes you.\"",
    "\"From %b, with love:\" the farm girl reads, \"'%t is all udder and no brains.'\" She gives %t a fond squeeze. \"Harsh. Accurate, but harsh.\""
  ];

  // ── ?ribbons, ?ribbon give|fine, ?store, ?buy ─────────────
  function ribbonCommand(cmd, sender, args, R){
    const sub = String(args[0] || "").toLowerCase();
    if (cmd === "buy"){ buy(sender, args, R); return; }
    if (cmd === "gift"){
      // ?gift <who> <item> → ?buy <item> for <who>
      const t = args[0], item = args[1];
      if (!t || !item){ R("Gift what to who, sugar? ?gift <who> <potion>, like ?gift Bessie hiccup"); return; }
      buy(sender, [item, "for", t].concat(args.slice(2)), R); return;
    }
    if (cmd === "store"){
      if (["price","off","on"].includes(sub)){
        if (!isProprietor(sender)){ R("The proprietors stock the shelf, sugar."); return; }
        const it = storeItem(args[1]);
        if (!it){ R("Which item, sugar? The words from ?store, like ?store price luxury 30"); return; }
        L.store = L.store || {}; L.store.price = L.store.price || {}; L.store.off = L.store.off || {};
        if (sub === "price"){ const n = parseInt(args[2], 10); if (!(n >= 0 && n <= 999)){ R("A price from 0 to 999, sugar."); return; } L.store.price[it.id] = n; }
        else L.store.off[it.id] = sub === "off";
        saveLedger(); audit(sender, "STORE", sub+" "+it.id+" "+(args[2]||""));
        R("🛍️ "+it.name+": "+(sub === "price" ? args[2]+" ribbons now." : sub === "off" ? "off the shelf." : "back on the shelf."));
        return;
      }
      if (sub === "approve" || sub === "reject"){
        if (!isStaff(sender)){ R("Staff read those, sugar."); return; }
        const t = resolveTarget(args[1]), r = t && rec(t);
        if (!r || !r.greet){ R("Nobody by that name has a greetin' waitin', hon."); return; }
        if (sub === "approve"){ r.greet.ok = true; saveLedger(); tell(t, "🎀 Your greetin' was approved, sugar! Next time you walk in, you'll hear it."); R("🎀 Approved."); }
        else { r.greet = null; earnRibbons(t, (storeItem("greeting") || {}).price || 8, "a refund on your greetin'", sender, true); saveLedger(); tell(t, "🎀 Staff passed on your greetin', sugar, so your ribbons are back. Try another line?"); R("🎀 Rejected and refunded."); }
        return;
      }
      R(storeText(sender)); return;
    }
    // ribbons
    if (cmd === "ribbon" && (sub === "give" || sub === "fine") || cmd === "ribbons" && (sub === "give" || sub === "fine")){
      if (!isStaff(sender)){ R("Only staff hand out ribbons or take 'em, sugar."); return; }
      const t = resolveTarget(args[1]), n = parseInt(args[2], 10), why = args.slice(3).join(" ").trim() || (sub === "give" ? "bein' good" : "misbehavin'");
      if (!t || !rec(t) || !(n >= 1)){ R("Here's how, sugar: ?ribbon give <who> <n> [why] or ?ribbon fine <who> <n> [why]. For example: ?ribbon give Bessie 3 stood so nice for the milkin'"); return; }
      const cap = isProprietor(sender) ? 999 : isHerdmaster(sender) ? CFG.RIBBON_GRANT_MAX.herdmaster : CFG.RIBBON_GRANT_MAX.farmhand;
      if (n > cap){ R("You can "+sub+" up to "+cap+" at a time, sugar."); return; }
      if (sub === "give"){
        earnRibbons(t, n, why+" (from "+plainName(sender)+")", sender);
        audit(sender, "RIBBON_GIVE", t+" "+n+" "+why); R("🎀 "+plainName(t)+" gets "+n+". They've got "+ribbonsOf(t)+" now.");
      } else {
        const took = fineRibbons(t, n, why, sender);
        audit(sender, "RIBBON_FINE", t+" "+took+" "+why);
        tell(t, "🎀 "+plainName(sender)+" took "+took+" ribbon"+(took === 1 ? "" : "s")+" off you for "+why+", sugar. "+ribbonsOf(t)+" left.");
        R("🎀 Took "+took+" from "+plainName(t)+". "+ribbonsOf(t)+" left.");
      }
      return;
    }
    if (sub === "top" || sub === "board"){
      const wk = weekKey();
      const rows = Object.entries(L.people).filter(([, r]) => r.rw && r.rw.key === wk && r.rw.earned > 0)
        .sort((a, b) => b[1].rw.earned - a[1].rw.earned).slice(0, 8);
      R("🎀 RIBBONS THIS WEEK\n"+(rows.length ? rows.map(([k, r], i) => "  "+(i+1)+". "+plainName(parseInt(k, 10))+" · "+r.rw.earned+" earned").join("\n") : "  nobody's earned any yet")+
        "\nThe Sunday till pays the top earner a bonus.");
      return;
    }
    const t = sub && sub !== "me" ? resolveTarget(args[0]) : sender;
    if (t !== sender && !isStaff(sender)){ R("Just your own purse, sugar. ?ribbons"); return; }
    const r = t && rec(t);
    if (!r){ R("I don't know who that is, sugar."); return; }
    const mine = (L.ribbonLog || []).filter(e => e.mn === t).slice(-6).reverse();
    const d = dayKey(), today = r.rday && r.rday.d === d ? r.rday.n : 0;
    R("🎀 "+(t === sender ? "YOUR RIBBONS" : plainName(t).toUpperCase()+"'S RIBBONS")+": "+(r.ribbons || 0)+
      "\nEarned today: "+today+" of "+CFG.RIBBON_DAY_CAP+(r.quotaGrace ? " · quota grace held: "+r.quotaGrace : "")+
      (mine.length ? "\n\nLately\n"+mine.map(e => "  "+(e.n > 0 ? "+" : "")+e.n+" · "+e.why).join("\n") : "")+
      "\n\nEARN 'EM: make your milk quota · finish a stall session · do a chore · work a glory shift · best milk or top sire of the week · staff hand 'em out for good behavior"+
      "\nSPEND 'EM: ?store");
  }
