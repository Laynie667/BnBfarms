  /* WHAT'S IN THIS FILE (09-roleplay.js)
     Readin' the room: roleplay words in chat and emotes (cum words, belly touches), the game's own
     actions (penetrate, suckle, rub, inject), shots and what they do, stats text.
  */
  /* ── ROLEPLAY TRIGGERS ──
     Breedin': while a stud has a ?breed scene open, sayin' cum in their own chat or
     emotes fills the scene's hole (whoever they name, or the first partner).
     Nursin': an emote about suckin', drinkin' or nursin' from nipples, breasts or
     milk drains the milker a little at a time. Both only touch folks who opted in. */
  // who from the list is mentioned: full name, nickname, or just their first name
  function namedIn(text, list){
    const low = " "+text.toLowerCase().replace(/[^a-z0-9'\s]/g," ")+" ";
    const has = w => w.length > 1 && (low.includes(" "+w+" ") || low.includes(" "+w+"'s "));
    return list.find(mn => low.includes(" "+mn+" ") ||
      namesOf(mn).some(n => has(n) || n.split(/\s+/).some(w => w.length > 2 && has(w))));
  }
  // the hole the stud's own words name ("cums deep in her ass"); both, for a double cock
  function holeFromRP(text, stud, t){
    const low = String(text).toLowerCase(), found = [];
    if (/\b(pussy|cunt|vulva|womb|vagina|slit|cervix)\b/.test(low) && hasVulva(t)) found.push("vulva");
    if (/\b(ass|asshole|butthole|butt|anus|rear|backdoor|bowels|rump)\b/.test(low)) found.push("butt");
    if (/\b(mouth|throat|tongue|gullet|lips)\b/.test(low)) found.push("mouth");
    if (!found.length) return null;
    if (found.length >= 2 && found.includes("vulva") && found.includes("butt") && makesSemen(stud) && typeInfo(stud).double) return ["vulva","butt"];
    return [found[0]];
  }
  // "*rubs against Laynie's belly", "*presses close to Moo and feels her tummy": a belly touch in words
  const BELLY_WORDS = /\b(belly|bellies|tummy|tum|stomach|womb|bump|baby bump)\b/i;
  const TOUCH_WORDS = /\b(rub\w*|stroke\w*|strok\w*|touch\w*|press\w*|pat\w*|pet\w*|caress\w*|feel\w*|felt|kiss\w*|nuzzl\w*|cuddl\w*|hug\w*|rest\w*|lay\w*|lean\w*|grind\w*|cradl\w*|hold\w*|massag\w*)\b/i;
  function bellyTouchFromRP(sender, text){
    if (!BELLY_WORDS.test(text) || !TOUCH_WORDS.test(text)) return;
    const others = (W.ChatRoomCharacter||[]).map(c => c.MemberNumber).filter(m => m !== sender && m !== CFG.BOT_MEMBER);
    const t = namedIn(text, others);
    if (t) bellyRub(sender, t);
  }
  function onRoleplay(sender, text, type){
    if (!text || /^[?!.\-\/]/.test(text.trim())) return;          // commands aren't roleplay
    const now = Date.now();
    if (type === "Emote") { try { bellyTouchFromRP(sender, text); } catch(e){ warn("belly rp:", e); } }
    // breedin'
    const sc = state.scenes.get(sender);
    if (sc && now - (sc.lastSeen||sc.at) > CFG.SCENE_IDLE_MIN*60000){ state.scenes.delete(sender); }
    else if (sc){
      sc.lastSeen = now;
      const hit = CFG.RP_CUM_WORDS.test(text);
      log("RP scene", sender, type, hit ? "cum word ✓" : "no cum word", JSON.stringify(text.slice(0,60)));
      if (hit){
        const wait = sceneCooldown(sender) - Math.floor((now - (sc.lastCum||0))/1000);
        const t = namedIn(text, sc.with) || sc.with[0];
        if (wait > 0){
          if (!sc.toldWait || now - sc.toldWait > 20000){ sc.toldWait = now; whisper(sender, "⏳ Easy, sugar! You just filled 'em. Give it "+wait+" more seconds before the next load."); }
        } else if (t){
          sc.lastCum = now;
          // "deep in her ass" fills; "all over her face" paints; "on her back" with a hole named still fills
          const inside = /\b(in|inside|into|deep|up)\s+(?:(?:her|his|their|its|[a-z]+'s)\s+)?(?:\w+\s+)?(pussy|cunt|vulva|womb|vagina|slit|ass|asshole|butthole|butt|anus|mouth|throat|gullet)\b/i.test(text);
          const pm = !inside && text.match(PAINT_RX);
          if (pm) paint(sender, t, pm[1], msg => whisper(sender, msg));
          else cumInto(sender, t, holeFromRP(text, sender, t) || holesFrom(sc.hole) || ["vulva"], msg => whisper(sender, msg), true,
                       { rough: CFG.RP_ROUGH.test(text), gentle: !CFG.RP_ROUGH.test(text) && CFG.RP_GENTLE.test(text) });
        }
      }
    }
    // praise and degradation: staff talkin' to stock that opted in
    if (isStaff(sender)){
      const isPraise = CFG.RP_PRAISE.test(text), isDeg = !isPraise && CFG.RP_DEGRADE.test(text);
      if (isPraise || isDeg){
        const key = isPraise ? "praiseMe" : "degradeMe";
        const here = (W.ChatRoomCharacter||[]).map(c => c.MemberNumber).filter(m => m !== sender && m !== CFG.BOT_MEMBER && rec(m) && rec(m)[key]);
        const t = namedIn(text, here);
        if (t) praiseOrDegrade(sender, t, isPraise, text);
      }
    }
    // nursin'
    if (type === "Emote" && CFG.RP_NURSE_WORDS.test(text) && CFG.RP_NURSE_PARTS.test(text)){
      const here = (W.ChatRoomCharacter||[]).map(c => c.MemberNumber).filter(m => m !== sender && m !== CFG.BOT_MEMBER);
      const other = namedIn(text, here);
      const low = text.toLowerCase(), on = n => n && namesOf(n).some(x => low.includes(x+"'s") || low.includes(x.split(/\s+/)[0]+"'s"));
      // "drinks from Bessie's teat" → Bessie; "lets Daisy suckle" → the sender
      let milker = on(other) ? other : (rec(sender) && makesMilk(sender)) ? sender : other;
      if (!milker || !rec(milker) || !makesMilk(milker)) return;
      nurse(milker, milker === sender ? other : sender);
    }
  }
  // someone drinks from the milker: a little at a time over a few seconds
  function nurse(milker, drinker){
    if (missing(milker, drinker)) return false;
    const p = prodOf(milker), now = Date.now();
    if (now - (p.lastNursed||0) < CFG.NURSE_COOLDOWN_S*1000 || p.milk < 1) return false;
    if (milkDenied(milker)){
      if (now - (p.capSaid||0) > 120000){ p.capSaid = now; emote("🚫 "+(drinker ? plainName(drinker)+" suckles and suckles, but" : "")+" not a drop comes out of "+plainName(milker)+". Those teats are capped, and full to achin'."); }
      return false;
    }
    p.lastNursed = now;
    const steps = 5, each = CFG.NURSE_ML/steps;
    let got = 0, n = 0;
    const tick = () => {
      got += drainMilk(milker, each, true);
      if (++n < steps && prodOf(milker).milk >= 1) return later(tick, CFG.NURSE_SECONDS*1000/steps);
      saveLedger(); audit(drinker||milker, "NURSE", milker+" "+Math.round(got));
      const taste = { "A+":"thick, sweet cream that coats the tongue", "A":"rich, sweet and creamy", "B":"warm and creamy", "C":"a little thin, but sweet enough", "D":"thin and watery, poor thing" }[milkGrade(milker)] || "warm and sweet";
      if (got >= 1) emote("🍼 "+(drinker ? plainName(drinker)+" drinks "+ml(got)+" warm milk right from "+plainName(milker)+". It's "+taste+"." : plainName(milker)+" lets down "+ml(got)+" of warm milk, "+taste+"."));
      if (got >= 1){
        const pm = prodOf(milker), wk = weekKey();
        if (!pm.nursed || pm.nursed.week !== wk) pm.nursed = { week:wk, n:0 };
        pm.nursed.n++;
      }
      if (got >= 1 && drinker) addonsEmit("nurse", milker, drinker, got, milkGrade(milker));   // milk-drunk etc. (add-ons)
      if (got >= 1 && drinker && rec(drinker)){
        const pd = prodOf(drinker), dk = dayKey();
        if (!pd.drank || pd.drank.day !== dk) pd.drank = { day:dk, ml:0, said:false };
        pd.drank.ml += got;
        if (pd.drank.ml >= CFG.MILK_DRUNK_ML && !pd.drank.said){
          pd.drank.said = true;
          emote("😴 "+plainName(drinker)+" is plumb milk-drunk, belly full of warm cream, eyes gone heavy and soft. They'd let anybody lead 'em anywhere right now.");
        }
      }
    };
    tick();
    return true;
  }

  /* BC ACTIVITY TRIGGERS (the right-click actions)
     When a stud uses Penetrate (slow or fast) on someone's vulva, butt or mouth, I open
     (or switch) their breedin' scene to that hole, same as ?breed. Then cum words fill it.
     When someone rides a stud's penis with their pussy or ass (LSCG), same thing the other way.
     When someone sucks or nibbles a milker's nipples, I drain a little milk, like a nursing emote. */
  function onBodyActivity(act, focus, src, tgt){
    if (!src || !tgt || src === tgt) return;
    let stud = null, bred = null, hole = null;
    if (/^penetrate(slow|fast)$/i.test(act) && ["ItemVulva","ItemButt","ItemMouth"].includes(focus)){
      stud = src; bred = tgt; hole = { ItemVulva:"vulva", ItemButt:"butt", ItemMouth:"mouth" }[focus];
    } else if (/^fuckwith(pussy|ass)$/i.test(act) && focus === "ItemPenis"){
      stud = tgt; bred = src; hole = /pussy/i.test(act) ? "vulva" : "butt";
    } else if (/^(caress|rub|massage|kiss|gaggedkiss|lick|pet|pat|nuzzle|cuddle|grope|tickle|scratch|hug|press|rest)/i.test(act) && ["ItemTorso","ItemTorso2","ItemPelvis"].includes(focus)){
      bellyRub(src, tgt); return;
    } else if (/^(suck|suckle|nibble|nurse|drink)/i.test(act) && (focus === "ItemNipples" || focus === "ItemBreast")){
      if (rec(tgt) && makesMilk(tgt)) nurse(tgt, src);
      return;
    } else return;
    if (!rec(stud) || !makesSemen(stud)) return;
    const rb = rec(bred);
    if (!rb || !rb.breedable || limitBlocks(bred)) return;
    if (hole === "vulva" && !hasVulva(bred)) return;
    if (bred === src) okBreed(stud, bred);                     // they climbed on: that's a yes
    else if (!breedConsent(stud, bred)){ askBreed(stud, bred, hole); return; }
    seePenis(stud);
    const sc = state.scenes.get(stud), now = Date.now();
    if (sc && sc.hole === hole && sc.with.includes(bred)){ sc.lastSeen = now; return; }   // already set up: stay quiet
    if (sc){
      sc.with = [bred].concat(sc.with.filter(x => x !== bred)); sc.hole = hole; sc.lastSeen = now;
    } else {
      state.scenes.set(stud, { with: [bred], hole, at: now, by: stud, lastCum: 0, lastSeen: now, fromActivity: true });
    }
    const where = hole === "mouth" ? "throat" : hole;
    emote("🐂 "+plainName(stud)+" is in "+plainName(bred)+"'s "+where+" now. The farm girl marks it in the stud book.");
    state.tipped = state.tipped || new Set();
    if (!state.tipped.has(stud)){ state.tipped.add(stud); whisper(stud, "🐂 Tip, sugar: when you cum in there, for real or in your chat or emotes (say cum), I'll fill them up. ?breed stop ends the scene."); }
  }


  // what everybody sees when a shot kicks in (%t = them, %s = the new size)
  const SHOT_LINES = {
    "udder+":  ["%t's breasts swell and strain, heavier with every heartbeat, till they settle at %s.",
                "%t gasps as their chest fills out, nipples stiffening while those tits plump up to %s."],
    "udder-":  ["%t's breasts tingle and draw in, perkier and lighter, down to %s.",
                "A cool ache, and %t's chest shrinks back to %s."],
    "testes+": ["%t's balls throb and drop heavier, fat and churnin' (%s now). Somebody's gonna make bigger loads.",
                "%t groans as their sack tightens, then swells, heavy and churnin': %s."],
    "testes-": ["%t's balls draw up tight and shrink down to %s.",
                "A cold tingle, and %t's sack shrinks down to %s."],
    "penis+":  ["%t's cock thickens and lengthens, throbbin' with every pulse, till it hangs at %s.",
                "%t whimpers as their shaft swells, vein by vein, out to %s."],
    "penis-":  ["%t's cock tingles and shrinks, smaller and softer, down to %s.",
                "With a little shiver %t's shaft draws in to %s."],
    "knot+":   ["%t's knot swells fatter at the base, heavy and aching to lock into somebody: %s now."],
    "knot-":   ["%t's knot goes soft and shrinks down to %s."],
    "vulva+":  ["%t's pussy goes hot and slick as it loosens and opens up: %s now.",
                "%t squirms as their pussy relaxes and spreads, wetter and %s."],
    "vulva-":  ["%t's pussy clenches and tightens right up: %s again."],
    "butt+":   ["%t's ass loosens and opens, achin' to be filled: %s now.",
                "%t's hole relaxes and gapes a little wider, %s and ready."],
    "butt-":   ["%t's ass clenches up nice and tight: %s again."],
    "throat+": ["%t's throat relaxes and the gag reflex just melts away: %s now. Open wide, sugar."],
    "throat-": ["%t's throat tightens back up, gaggy as ever: %s."],
    lactation: ["%t's nipples tingle and bead with milk, breasts goin' heavy and achy to be milked."],
    virility:  ["%t's balls churn and swell with fresh seed. Somebody's gonna be a fountain for a day."],
    fertility: ["A warm, needy flush spreads through %t's belly. That womb is ripe and waitin'."],
    contraceptive: ["%t gets a cool little shiver. Nothin's takin' root in there for a couple of days."],
    capacity:  ["%t's belly goes warm and stretchy, ready to hold even more."],
    reducing:  ["%t's belly draws in tight, and anything extra comes spillin' out."],
    suppressant: ["%t's heat breaks like a fever. They sag, flushed and finally calm."],
    "knot+new":["A fat knot swells up at the base of %t's cock, throbbin' and ready to tie somebody down."],
    "knot-new":["%t's knot shrinks away to nothin'. No more tyin' anybody down."],
    "type:canine":  ["%t's cock reshapes, tapered and red with a thick canine knot at the base."],
    "type:equine":  ["%t's cock swells long and heavy, the head flaring wide like a stallion's."],
    "type:feline":  ["Little barbs prickle up along %t's cock. That's gonna be felt on the way out."],
    "type:draconic":["Thick ridges rise along %t's cock, hard and scaled and wicked."],
    "type:double":  ["%t's cock splits into two, both throbbin' and ready to fill two holes at once."],
    "type:human":   ["%t's cock settles back into a plain human shape."]
  };
  function shotLine(key, t, part){
    const k = key === "knot+" ? "knot+new" : key === "knot-" ? "knot-new" : key;
    const L0 = SHOT_LINES[k]; if (!L0) return "";
    const sz = part ? (part === "udder" ? CFG.SIZES.udder.cups[udderLevel(t)-1]+" cup, "+CFG.SIZES.udder.names[udderLevel(t)-1]
                      : CFG.SIZES[part].inches ? sizeOf(t,part)+" inches" : sizeWord(part, sizeOf(t,part))+" "+sizeOf(t,part)+"/"+CFG.SIZES[part].max) : "";
    return L0[Math.floor(Math.random()*L0.length)].replace(/%t/g, plainName(t)).replace(/%s/g, sz);
  }

  // An "Inject" activity on someone: read the injector's crafted keywords.
  function onActivity(data){
    let meta = null;
    try {
      if (typeof W.ChatRoomMessageRunExtractors === "function")
        meta = W.ChatRoomMessageRunExtractors(data, charFor(data.Sender) || W.Player).metadata;
    } catch(e){}
    const dict = Array.isArray(data.Dictionary) ? data.Dictionary : [];
    const pick = k => { const e = dict.find(d => d && d[k] !== undefined); return e ? e[k] : undefined; };
    const act = pick("ActivityName") || (meta && meta.ActivityName) ||
                (String(data.Content||"").match(/-([A-Za-z]+)$/)||[])[1];
    if (act !== "Inject"){
      let src = pick("SourceCharacter"), tgt = pick("TargetCharacter");
      if (typeof src !== "number") src = data.Sender;
      if (typeof tgt !== "number"){ const old = dict.find(d => d && d.Tag === "TargetCharacter"); tgt = old && old.MemberNumber; }
      const focus = pick("FocusGroupName") || (String(data.Content||"").split("-")[1]);
      try { onBodyActivity(String(act||""), focus, src, tgt); } catch(e){ warn("body activity:", e); }
      return;
    }
    // BC puts the target in the dictionary as { TargetCharacter: <member number> }
    // (older style: { Tag:"TargetCharacter", MemberNumber })
    let target = pick("TargetCharacter");
    if (typeof target !== "number"){
      const old = dict.find(d => d && d.Tag === "TargetCharacter");
      target = (old && old.MemberNumber) || (meta && meta.TargetMemberNumber) || data.Sender;
    }
    const giver = charFor(data.Sender);
    const tool = giver && (giver.Appearance||[]).find(it => it && it.Asset && it.Asset.Group && it.Asset.Group.Name === "ItemHandheld");
    const text = craftText(tool);
    const tags = tagsIn(text), sizeTags = sizeTagsIn(text), ptags = penisTagsIn(text);
    L.shotLog = (L.shotLog||[]).concat({ t:Date.now(), by:data.Sender, to:target,
                  item: tool ? ((tool.Craft && tool.Craft.Name) || tool.Asset.Name) : "(nothing in hand)",
                  tags: Array.from(tags).concat(sizeTags.map(([k,d]) => k+(d>0?" up":" down"))) }).slice(-15);
    dbg("INJECT", data.Sender, "→", target, "item:", text || "(no crafted item)", "tags:", Array.from(tags).join(",") || "none");
    if (!tags.size && !sizeTags.length && !ptags.type && !ptags.knot){ saveLedger(); return; }   // a plain injector: LSCG's business, not ours
    const r = rec(target);
    if (!r){ saveLedger(); tell(data.Sender, "💉 That shot didn't take with me, hon: "+plainName(target)+" isn't on the farm books yet."); return; }
    const p = prodOf(target), now = Date.now(), H = 3600000, done = [];
    const fx0 = [];
    if (tags.has("lactation"))   { p.boosts.milk  = now + 24*H; done.push("milk doubled for a day"); fx0.push("lactation"); }
    if (tags.has("virility"))    { p.boosts.semen = now + 24*H; done.push("semen doubled for a day"); fx0.push("virility"); }
    if (tags.has("fertility"))   { p.boosts.fert  = now + 24*H; done.push("fertility doubled for a day"); fx0.push("fertility"); }
    if (tags.has("contraceptive")){ p.boosts.contra = now + 48*H; done.push("no catching for two days"); fx0.push("contraceptive"); }
    if (tags.has("capacity")) fx0.push("capacity");
    if (tags.has("reducing")) fx0.push("reducing");
    if (tags.has("capacity"))    { const b = p.capBonus; p.capBonus = Math.min(CFG.PROD.MAX_CAPACITY - CFG.PROD.BASE_CAPACITY, b + CFG.PROD.INJECT_CAPACITY);
                                   done.push("capacity now "+ml(capacity(target))); }
    if (tags.has("reducing")){
      p.capBonus = Math.max(0, p.capBonus - CFG.PROD.REDUCE_CAPACITY);
      const over = heldTotal(p) - capacity(target);
      if (over > 0) for (const h of HOLES){ const cut = Math.min(p.held[h], over * p.held[h]/heldTotal(p)); p.held[h] -= cut; }
      done.push("capacity down to "+ml(capacity(target)));
    }
    if ((ptags.type || ptags.knot) && !makesSemen(target)){ done.push("no cock for that shot to change"); ptags.type = null; ptags.knot = 0; }
    if (ptags.type){ setPenisType(target, ptags.type); done.push("cock's turnin' "+CFG.PENIS_TYPES[ptags.type].label); fx0.push("type:"+ptags.type); }
    if (ptags.knot > 0){ p.knot = true; p.knotShot = true; done.push("a fat knot's swellin' in at the base"); fx0.push("knot+"); }
    if (ptags.knot < 0){ p.knot = false; p.knotShot = false; untie(target, true); done.push("knot's gone down for good"); fx0.push("knot-"); }
    const fx = [];
    for (const [part, d] of sizeTags){
      if (part === "knot" && !knotted(target)){ done.push("no knot to grow yet (that takes a knotting shot first)"); continue; }
      if (!hasPart(target, part)){ done.push("no "+(part === "testes" ? "balls" : part)+" for the "+(d>0?"growth":"shrinkin'")+" to work on"); continue; }
      const S = CFG.SIZES[part], before = sizeOf(target, part);
      setSize(target, part, before + d*(S.step||1), true);
      const word = S.label.toLowerCase();
      done.push(sizeOf(target, part) === before ? word+" can't go any "+(d>0?"bigger":"smaller")
                                                : word+" "+(d>0?"up":"down")+" to "+sizeName(target, part));
      if (sizeOf(target, part) !== before) fx.push(shotLine(part+(d>0?"+":"-"), target, part));
    }
    if (tags.has("suppressant") && inHeat(p)){ p.heat = null; done.push("heat broken"); fx0.push("suppressant"); }
    if (tags.has("heat")){
      if (limitBlocks(target,"heat")) done.push("no heat, though, 'cause their limits rule it out");
      else { startHeat(target, data.Sender); done.push("heat"); }
    }
    saveLedger(); audit(data.Sender,"INJECT",target+" "+Array.from(tags).concat(sizeTags.map(([k,d]) => k+(d>0?"+":"-"))).join(" "));
    const lines = fx0.map(k => shotLine(k, target)).concat(fx).filter(Boolean);
    if (lines.length && onMap(target)){
      emote("💉 "+(target === data.Sender ? plainName(target)+" sinks the needle into their own skin and pushes the plunger home."
                                         : plainName(data.Sender)+" slides the needle into "+plainName(target)+" and pushes the plunger home.")+" "+lines.join(" "));
      if (done.length > lines.length) tell(target, "💉 Your shot: "+done.join(", ")+".");
    } else {
      tell(target, "💉 "+plainName(data.Sender)+"'s shot is kickin' in, hon: "+done.join(", ")+".");
      if (target !== data.Sender) tell(data.Sender, "💉 Your shot took on "+plainName(target)+": "+done.join(", ")+".");
    }
  }

  // the parts that apply to this person
  function isStretcher(it){
    const flat = squash((it && it.Craft) ? craftText(it) : "");
    return !!flat && CFG.STRETCHER_WORDS.some(w => flat.includes(squash(w)));
  }
  function bodyParts(mn){
    const out = [];
    if (makesMilk(mn) || hasVulva(mn)) out.push("udder");
    if (makesSemen(mn)) out.push("penis","testes");
    if (makesSemen(mn) && knotted(mn)) out.push("knot");
    if (hasVulva(mn))   out.push("vulva");
    out.push("butt","throat");
    return out;
  }
  function hasPart(mn, part){ return bodyParts(mn).includes(part); }
  function noPartWhy(mn, part){
    if (part === "penis" || part === "testes") return "there's no cock on that one to measure, hon. Wear one, or ?futa on";
    if (part === "knot") return "no knot on that cock yet, hon! A \"knotting\" shot gives one, or ?penis canine comes knotted";
    if (part === "vulva") return "that one hasn't got a vulva, hon (futa: ?futa on)";
    if (part === "udder") return "that one hasn't got an udder, hon. ?milkable on gives one";
    return "that part's not there, hon";
  }
  function statsText(mn){
    const r = rec(mn), p = prodOf(mn), now = Date.now();
    if (!r) return "That one's not on the books yet, sugar.";
    const cap = capacity(mn), held = heldTotal(p), parts = bodyParts(mn);
    const ago = t => { if (!t) return "never"; const m = Math.round((now-t)/60000);
                       return m < 60 ? m+"m ago" : Math.floor(m/60)+"h "+(m%60)+"m ago"; };
    const hrsLeft = t => Math.ceil((t-now)/3600000)+"h";
    const out = ["🥛 "+(r.name||plainName(mn)).toUpperCase()+"'S STATS 🥛"];
    const sec = (title, lines) => { lines = lines.filter(Boolean); if (lines.length) out.push("", title, ...lines.map(l => "  "+l)); };

    // body: only what they've got
    const sz = k => CFG.SIZES[k].label+": "+sizeName(mn,k);
    sec("📏 BODY", [
      parts.includes("udder") && sz("udder"),
      parts.includes("penis") && "Cock: "+sizeName(mn,"penis")+", "+penisLabel(mn)+(parts.includes("knot") ? " · Knot: "+sizeWord("knot", sizeOf(mn,"knot")) : ""),
      parts.includes("testes") && sz("testes"),
      ["vulva","butt","throat"].filter(k => parts.includes(k)).map(k => CFG.SIZES[k].label+": "+sizeWord(k, sizeOf(mn,k))).join(" · "),
      bellyWord(mn) && "🤰 Belly: "+bellyWord(mn)
    ]);
    if (makesMilk(mn)) sec("🍼 MILK", [
      (p.milk < 1 ? "Dry · " : "")+ml(p.milk)+" of "+ml(milkCap(mn))+" · grade "+milkGrade(mn)+(p.milk >= milkCap(mn)-1 ? " · full and achin'" : ""),
      "Last milked "+ago(p.lastMilkAt),
      p.stall && p.stall.until && "In the milkin' stall: "+Math.max(0, Math.ceil((p.stall.until - Date.now())/60000))+" min till you're down to a quarter"
    ]);
    if (makesSemen(mn)) sec("💦 SEMEN", [
      ml(p.semen)+" of "+ml(semenCap(mn))+" · last collected "+ago(p.lastCollectAt),
      p.pentUp && "😤 Pent up: next load's a big one",
      p.deniedUntil > now && "🚫 Denied: no fillin' anybody for "+hrsLeft(p.deniedUntil),
      p.tieUntil > now && "🔒 Tied to "+plainName(p.tiedTo)+" for "+Math.ceil((p.tieUntil-now)/60000)+" more minutes"
    ]);
    // what they're holding, per hole they've got (a mouthful ends up in the stomach)
    const holeName = { vulva:"Vulva", butt:"Butt", mouth:"Stomach" };
    const holding = HOLES.filter(h => h !== "vulva" || hasVulva(mn) || p.held.vulva > 0)
                         .map(h => holeName[h]+" "+ml(p.held[h]||0)).join(" · ");
    sec("🫙 HOLDING · "+Math.round(100*held/cap)+"% full", [
      holding,
      "Total "+ml(held)+" of "+ml(cap),
      p.pin && "🎈 "+(sizePinned(mn) ? "Too big to move" : "Too full to move")
    ]);
    sec("🐂 BREEDING", [
      "Breedable "+(r.breedable?"yes":"no")+" · Fertile "+(r.fertile?"yes":"no")+(r.futa ? " · Futa" : "")+(r.species ? " · "+r.species : ""),
      inHeat(p) && "🔥 In heat · "+hrsLeft(p.heat.until)+" left",
      p.preg && "🍼 Bred by "+p.preg.sires.map(plainName).join(" & ")+" · due "+new Date(p.preg.due).toLocaleDateString()+" ("+Math.ceil((p.preg.due-now)/86400000)+" day(s))",
      r.rights && r.rights.until > now && "🔏 Breedin' rights: "+plainName(r.rights.stud)+((r.rights.allow||[]).length ? " (also "+r.rights.allow.map(plainName).join(", ")+")" : "")+" till "+new Date(r.rights.until).toLocaleDateString(),
      p.offspring.litters && "👶 Litters: "+p.offspring.litters+" · "+p.offspring.male+" male, "+p.offspring.female+" female, "+p.offspring.futa+" futa",
      p.labour && "🍼 In labour right now!",
      p.eggs && "🥚 Carryin' a clutch of "+p.eggs.n+" from "+plainName(p.eggs.by)+" · lays in "+Math.max(0, Math.ceil((p.eggs.layAt-now)/3600000))+"h",
      p.offspring.eggs && "🥚 Eggs laid: "+p.offspring.eggs,
      r.freeuse ? "🔓 Free use: anybody may breed you" : "🔐 Studs ask first (?freeuse on to skip that)"
    ]);
    sec("🍑 TODAY", [
      tallyToday(mn) && "✏️ Used "+tallyToday(mn)+" time"+(tallyToday(mn)===1?"":"s")+" today"+(r.tally ? " (on the board)" : ""),
      paintedText(mn) && "💦 Cum-covered: "+paintedText(mn)+" (?wash cleans up)",
      scentOf(mn) && "👃 Smellin' of "+plainName(scentOf(mn))+"'s seed",
      quotaOf(mn) && "🥛 Quota: "+ml(milkedOn(mn, dayKey()))+" of "+ml(quotaOf(mn))+" · streak "+(r.quotaStreak||0)+(r.naughtyMarks ? " · naughty marks "+r.naughtyMarks : ""),
      (r.praised || r.degraded) && "💗 Praised "+(r.praised||0)+" · 🥀 Degraded "+(r.degraded||0),
      p.edges && "😈 Edged "+p.edges+" time"+(p.edges===1?"":"s")+" · next load +"+Math.round(100*CFG.EDGE_X*Math.min(p.edges, CFG.EDGE_MAX))+"%",
      milkDenied(mn) && "🚫 Teats capped: no milkin' for "+Math.ceil((p.milkDeniedUntil-now)/3600000)+"h"
    ]);
    if (titleNames(mn).length) sec("🎖️ TITLES", [titleNames(mn).join(" · ")]);
    const b = [];
    for (const [k,label] of [["milk","milk"],["semen","semen"],["fert","fertility"],["contra","contraceptive"]])
      if (boosted(p,k)) b.push(label);
    const wt = Array.from(wornTags(mn));
    sec("✨ RIGHT NOW", [ b.length && "💉 Boosted: "+b.join(", "), wt.length && "🏷️ Wearing: "+wt.join(", ") ]);
    const t = p.totals;
    sec("📊 LIFETIME", [
      [makesMilk(mn) || t.milked ? "Milked "+ml(t.milked) : "", makesSemen(mn) || t.collected ? "Collected "+ml(t.collected) : "",
       "Took "+ml(t.received), (makesSemen(mn) || t.given) ? "Gave "+ml(t.given) : ""].filter(Boolean).join(" · "),
      t.sired && "Sired "+t.sired+" litter"+(t.sired===1?"":"s"),
      t.covers && "🐂 Stud record: "+(t.conceived||0)+" took from "+t.covers+" covers ("+Math.round(100*(t.conceived||0)/t.covers)+"%)"
    ]);
    return out.join("\n");
  }

