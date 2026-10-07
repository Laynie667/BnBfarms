  /* WHAT'S IN THIS FILE (10n-wheel.js)
     THE WHEEL, with slices that DO things. Besides the slices staff write (?wheel add), the farm's own slices
     (?wheel farm on|off) put them in the stocks, the pen, the milkin' stall, a glory stall shift, on a lead,
     on denial, hand them a potion or a dare, pay or fine ribbons, give a luxury hour… A slice only lands if it
     can happen to them: their limits, ?potions on, ?dares on, ?glory on, the spots bein' set, all count, and
     a slice that can't happen is skipped for another one.
     Staff can write action slices too: ?wheel add punish Off to the pen with you, %name% => pen 30
     Actions: stocks <min> · pen <min> · milkstall <min> · glory <min> · leash <min> · denial <hours>
              potion <name> · dare [reckless] · ribbons <n> · fine <n> · luxury <hours> · grace · heat
  */
  const FARM_SLICES = [
    // rewards
    { kind: "reward", text: "🎀 Three ribbons for %name%. Spend 'em wisely, sugar.", act: "ribbons 3" },
    { kind: "reward", text: "🎀 Five whole ribbons! Somebody's the farm's favorite today.", act: "ribbons 5" },
    { kind: "reward", text: "🧪 A bottle of Clover Cream for %name%. Let it all down, sugar.", act: "potion clover" },
    { kind: "reward", text: "🧪 Golden Hour for %name%. Go on and enjoy yourself.", act: "potion golden" },
    { kind: "reward", text: "🧪 A dab of Blue Ribbon Musk. Every head on the farm's gonna turn.", act: "potion musk" },
    { kind: "reward", text: "🧪 Honey Tongue! The farm girl's gonna sweet-talk %name% for a while.", act: "potion honey" },
    { kind: "reward", text: "🛁 A luxury hour for %name%: soft straw and the good feed.", act: "luxury 1" },
    { kind: "reward", text: "📋 Quota grace! One bad milk day forgiven, in advance.", act: "grace" },
    { kind: "reward", text: "🔓 Time off for good behavior: out of the stocks and the pen early.", act: "release" },
    // punishments
    { kind: "punish", text: "⛓️ Into the stocks with %name% for 20 minutes. Bottom up, sugar.", act: "stocks 20" },
    { kind: "punish", text: "⛓️ The stocks, 45 minutes. Somebody's gonna be sore and on display.", act: "stocks 45" },
    { kind: "punish", text: "🚧 Penned up for half an hour. Think about what you did.", act: "pen 30" },
    { kind: "punish", text: "🚧 An hour in the pen, %name%. The gate's latched.", act: "pen 60" },
    { kind: "punish", text: "🥛 Strapped into the milkin' stall for 30 minutes. Every last drop.", act: "milkstall 30" },
    { kind: "punish", text: "🕳️ A 30 minute punishment shift in the glory stalls. Strangers only.", act: "glory 30" },
    { kind: "punish", text: "🕳️ A full hour on punishment shift in the glory stalls. Good luck, sugar.", act: "glory 60" },
    { kind: "punish", text: "🦮 On the spinner's lead for 20 minutes. Heel.", act: "leash 20" },
    { kind: "punish", text: "🚫 Two hours of denial. Every drop stays in.", act: "denial 2" },
    { kind: "punish", text: "🧪 Bitterroot! Thirty minutes of ruined, leakin' frustration.", act: "potion bitterroot" },
    { kind: "punish", text: "🧪 A Heavy Udder Draught, and the stalls are closed to you. Ache.", act: "potion heavy" },
    { kind: "punish", text: "🧪 Moo Juice. Say somethin' clever, %name%. Go on.", act: "potion moo" },
    { kind: "punish", text: "🧪 Bell Tonic: CLANG CLANG, everybody knows where you are.", act: "potion bell" },
    { kind: "punish", text: "🧪 Needy Nectar. Squirm for us, sugar.", act: "potion needy" },
    { kind: "punish", text: "🎲 A reckless dare. Everybody watch.", act: "dare reckless" },
    { kind: "punish", text: "🎀 Two ribbons fined. Naughty.", act: "fine 2" },
    // just because
    { kind: "silly", text: "🧪 Hiccup Fizz! *hic*", act: "potion hiccup" },
    { kind: "silly", text: "🧪 Featherlight. Everything tickles now.", act: "potion feather" },
    { kind: "silly", text: "🧪 Wrong Barn! %name% is a whole different animal for an hour.", act: "potion wrongbarn" },
    { kind: "silly", text: "🧪 Big Britches! Somethin's about to get a whole lot bigger.", act: "potion bigbritches" },
    { kind: "silly", text: "🧪 Shrinking Violet. Somethin's about to get real small.", act: "potion shrink" },
    { kind: "silly", text: "🧪 Echo Elixir. Careful what you say, sugar.", act: "potion echo" },
    { kind: "silly", text: "🧪 Heat Mist! Fifteen minutes of flushed and bothered.", act: "potion heatmist" },
    { kind: "silly", text: "🎲 A dare for %name%. Nothin' too wild. Probably.", act: "dare" },
  ];
  const parseAct = (a) => { const w = String(a || "").trim().toLowerCase().split(/\s+/); return { name: w[0] || "", arg: w[1] || "", arg2: w[2] || "" }; };
  // can this slice actually happen to them right now?
  function actPossible(act, t, by){
    const { name, arg } = parseAct(act), r = rec(t);
    if (!name) return true;
    if (!r) return false;
    switch (name){
      case "potion": return !potionRefusal(t, arg, CFG.BOT_MEMBER);   // off the wheel, even a self-spin: only with ?potions on
      case "dare": return !!r.daresOn && !r.dare;
      case "stocks": return onMap(t) && !stockedNow(t);
      case "pen": return onMap(t) && penSpots().length > 0 && !r.penned;
      case "milkstall": return onMap(t) && milkSpots().length > 0 && !r.penned && (makesMilk(t) || makesSemen(t));
      case "glory": { const d = addonData("glory-stalls"); return ADDONS.has("glory-stalls") && onMap(t) && !!(d.optIn && d.optIn[t]) && !(d.shifts && d.shifts[t]); }
      case "leash": return !!by && by !== t && by !== CFG.BOT_MEMBER && onMap(t) && onMap(by) && !stockedNow(t);
      case "denial": return makesSemen(t) && !limitBlocks(t, "breed");
      case "luxury": return !hasRole(t, ROLE.LUXURY);
      case "grace": return makesMilk(t) && (r.quotaGrace || 0) < 2;
      case "release": return stockedNow(t) || !!r.penned;
      case "heat": return !/\bheat/i.test(String(r.limits || ""));
      default: return true;
    }
  }
  // make it happen; returns a short line about what happened (or null if it couldn't)
  function runAct(act, t, by){
    const { name, arg, arg2 } = parseAct(act), n = parseFloat(arg);
    const spinner = by && by !== CFG.BOT_MEMBER ? by : CFG.BOT_MEMBER;
    switch (name){
      case "": return "";
      case "potion": return givePotion(t, arg, spinner, "off the wheel") ? "" : null;
      case "dare": return giveDare(t, spinner, arg === "reckless") ? "" : null;
      case "stocks": putInStocks(t, Math.max(5, Math.min(CFG.STOCKS_MAX_MIN, n || 20)), spinner); return "";
      case "pen": return penIn(t, Math.max(5, Math.min(240, n || 30)), spinner, arg2 || null) ? "" : null;
      case "milkstall": return penIn(t, Math.max(5, Math.min(120, n || 30)), spinner, "milking") ? "" : null;
      case "glory": {
        const d = addonData("glory-stalls"), mins = Math.max(10, Math.min(240, n || 30));
        d.shifts = d.shifts || {};
        d.shifts[t] = { until: Date.now() + mins*60000, by: spinner, punish: true };
        const free = Object.entries(L.spots || {}).filter(([k]) => /^glory-\d+$/.test(k))
          .find(([, s]) => !(W.ChatRoomCharacter || []).some(c => c.MemberNumber !== t && c.MapData && c.MapData.Pos && c.MapData.Pos.X === s.X && c.MapData.Pos.Y === s.Y));
        if (free) teleport(t, { X: free[1].X, Y: free[1].Y }, true);
        saveLedger();
        tell(t, "🕳️ The wheel sentenced you to "+mins+" minutes in the glory stalls"+(free ? ", "+free[0].replace("glory-", "stall ") : ". Find a free stall")+". Strangers come more often on a punishment shift. Your safeword still works.");
        return "";
      }
      case "leash": {
        state.leashes.set(t, by);
        const mins = Math.max(5, Math.min(120, n || 20));
        whisper(t, "🦮 You're on "+plainName(by)+"'s lead for "+mins+" minutes, sweetie. Wherever they go, you go. Safeword ends it.");
        later(() => { if (state.leashes.get(t) === by){ state.leashes.delete(t); whisper(t, "🦮 Your time on the lead is up, sugar."); } }, mins*60000);
        return "";
      }
      case "denial": { const p = prodOf(t); p.deniedUntil = Math.max(p.deniedUntil || 0, Date.now() + Math.max(0.25, Math.min(24, n || 2))*3600000); saveLedger(); return ""; }
      case "ribbons": return earnRibbons(t, Math.max(1, Math.min(50, n || 3)), "a lucky spin", CFG.BOT_MEMBER, true) ? "" : null;
      case "fine": { fineRibbons(t, Math.max(1, Math.min(50, n || 2)), "the wheel", spinner); return ""; }
      case "luxury": {
        const r = rec(t); if (hasRole(t, ROLE.LUXURY)) return null;
        r.roles.push(ROLE.LUXURY); r.luxuryTemp = true; r.luxuryUntil = Date.now() + Math.max(0.5, Math.min(24, n || 1))*3600000; saveLedger();
        try { syncKeys(t, true); } catch(e){}
        return "";
      }
      case "grace": { const r = rec(t); r.quotaGrace = Math.min(2, (r.quotaGrace || 0) + 1); saveLedger(); return ""; }
      case "release": { const r = rec(t); if (r.stocked) r.stocked = null; unpen(t, true); saveLedger(); return ""; }
      case "heat": startHeat(t, spinner, Math.max(0.25, Math.min(24, n || 1))); return "";
      default: return null;
    }
  }
  // spin for t. kind: reward | punish | silly | lucky (mostly rewards) | "" (anything). by: who's spinnin'
  function spinWheel(by, t, kind, actingAs){
    const custom = (L.wheel || []).map(e => Object.assign({ custom: true }, e));
    const farm = L.wheelFarm === false ? [] : FARM_SLICES;
    let all = custom.concat(farm).filter(e => wheelAllowed(e, t) && actPossible(e.act, t, by));
    if (kind === "lucky") all = Math.random() < 0.8 ? all.filter(e => e.kind === "reward") : all;
    else if (["reward","punish","silly"].includes(kind)) all = all.filter(e => e.kind === kind);
    for (let tries = 0; tries < 5 && all.length; tries++){
      const e = all[Math.floor(Math.random()*all.length)];
      const res = runAct(e.act, t, by);
      if (res === null){ all = all.filter(x => x !== e); continue; }
      const icon = e.kind === "reward" ? "🍬 " : e.kind === "silly" ? "🎭 " : "🔻 ";
      audit(by, "SPIN", t+" "+String(e.text).slice(0, 50)+(e.act ? " => "+e.act : ""));
      say("🎡 Round and round she goes! "+(by === t ? plainName(t)+" spins the wheel" : plainName(by === CFG.BOT_MEMBER ? t : by)+" spins the wheel for "+plainName(t))+"… "+icon+fill(e.text, t), false, t);
      syncCompanions(true);
      return e;
    }
    return null;
  }
  // ?wheel add <kind> <text> [=> action] · ?wheel farm on|off · (?wheel, ?wheel remove as before)
  function wheelAddAct(text){
    const m = String(text).split(/\s*=>\s*/);
    return { text: m[0].trim(), act: m[1] ? m[1].trim().toLowerCase() : "" };
  }
