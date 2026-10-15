  /* WHAT'S IN THIS FILE (10y3-trap-ranks.js)
     • TRAPS THAT HAND YOU ON: when one trap is done with a subject, there's a chance it passes them straight to
       another (the winch walks them into the breedin' frame, the frame tips them into the wallow…), up to three
       in a row. A higher rank and a Danger Draught make it likelier. Never durin' ?quiet or after a safeword.
     • SUBJECT SUBJECT_RANKS, by traps sprung: Bait → Trap Fodder (10) → Brood Sow (25) → Broodmother (60). Each rank makes
       things a little worse for them: hungrier water, faster resets, bigger clutches, likelier to be handed on.
     • THE BROOD BOOK: ?brood (their own) or ?brood <who> (proprietors): everything that's bred them, how often,
       eggs laid and litters carried, the biggest clutch.
     • WATCHERS: when a trap that lays (or the tickle rack, or the mirror box) takes somebody, folks standin' within
       four steps are offered a bet: ?bet <ribbons> high|low on the eggs, or breaks|holds on the rack and the box.
       Up to 5 ribbons; a winner gets double back. The one in the trap can't bet on themselves.
  */
  const SUBJECT_RANKS = [{ at: 0, name: "Bait" }, { at: 10, name: "Trap Fodder" }, { at: 25, name: "Brood Sow" }, { at: 60, name: "Broodmother" }];
  function rankOfSubject(mn){ const n = (rec(mn) || {}).trapN || 0; let i = 0; for (let k = 0; k < SUBJECT_RANKS.length; k++) if (n >= SUBJECT_RANKS[k].at) i = k; return i; }
  // how much worse it is for them, by what
  function rankX(mn){ const k = isSubject(mn) ? rankOfSubject(mn) : 0; return { water: 1 + 0.25*k, reset: 1 + 0.2*k, eggs: 1 + 0.1*k, chain: 1 + 0.3*k, rank: k }; }
  const rkLine = (key, mn, v) => tFill(pickFor(mn, "rank:"+key, RANK_LINES[key]), mn, v);

  // which trap likes to pass them to which (a kind, or one of a few); anything else is pot luck
  const CHAIN_NEXT = { winch: ["breeder", "pillory", "milker"], breeder: ["mud", "eggs", "pump"], snare: ["tickle", "paddle", "wolves"], gas: ["wolves", "stallion", "toms"], wire: ["pillory", "wall", "pricetag"],
                       mud: ["boar", "spray", "dip"], glue: ["paddle", "tickle", "brand"], pump: ["eggs", "mud"], lantern: ["mirror", "kennel"], spray: ["mud", "brand"], milker: ["cups", "bull"], injector: ["breeder", "milker", "gas"],
                       pillory: ["brand", "pricetag"], paddle: ["pillory"], cups: ["milker", "bull"], chute: ["pump", "sow"], slime: ["vines", "eggs"], weights: ["breeder"],
                       saddle: ["paddle", "milker", "dip"], net: ["pillory", "tickle", "bell"], bell: ["winch", "scale"], scale: ["pricetag", "cups", "brand"], teaser: ["weights", "milker", "crate"], dip: ["mud", "spray", "net"],
                       crate: ["milker", "carousel", "bale"], carousel: ["cups", "crate", "dip"], plow: ["paddle", "dip", "scarecrow"], bale: ["scarecrow", "pillory", "kissgate"], scarecrow: ["plow", "net", "washline", "maze"], washline: ["paddle", "dip", "stocks"],
                       auction: ["pillory", "wheel"], maze: ["wolves", "scarecrow"], honey: ["dip", "stocks"], incubator: ["eggs", "vines"], collection: ["weights", "teaser"], wheel: ["crate", "incubator"], stocks: ["honey", "dip"], kissgate: ["wall", "pillory"], windmill: ["net", "bell"], mudpit: ["dip", "mud"] };
  // called when a trap has finished with them (10u-traps.js trapRun)
  function trapAfter(mn, kind, before){
    const r = rec(mn), p = prodOf(mn), now = Date.now();
    corrupt(mn, 2 + (((p.eggs ? p.eggs.n : 0) > (before.eggs || 0)) ? 3 : 0) + (r.chainN ? 1 : 0), kind);   // every trap leaves a little more of the farm in them (10y4-corruption.js)
    // rank up?
    const k = rankOfSubject(mn);
    if (k > (r.trapRank || 0)){
      r.trapRank = k; saveLedger();
      later(() => { if (charFor(mn)) emote("🧪 "+rkLine("rank"+k, mn), mn); tell(mn, "🧪 "+(r.trapN || 0)+" traps, sugar. You're a "+SUBJECT_RANKS[k].name.toUpperCase()+" now. The farm treats that rank a little rougher: hungrier water, traps that reset sooner, bigger clutches, and more chance of bein' handed from one trap to the next."); }, 7000);
    }
    // settle the bets
    const bet = state.bets && state.bets.get(mn);
    if (bet){
      state.bets.delete(mn);
      const laid = (p.eggs ? p.eggs.n : 0) - (before.eggs || 0);
      const result = bet.what === "eggs" ? (laid > bet.line ? "high" : "low") : null;
      if (result) settleBets(mn, bet, result, laid+" eggs");
      else if (bet.what === "wait") state.betsWait = (state.betsWait || new Map()).set(mn, bet);   // the rack and the box settle when they let go
    }
    // handed on to the next one
    r.chainN = (now - (r.chainAt || 0) < 10*60000) ? (r.chainN || 0) : 0;
    if (r.chainN >= CFG.CHAIN_MAX - 1 || kind === "tentacle" || kind === "well" || r.trapWait || (r.benched && r.benched.trap) || quietNow(mn)) return;
    if (Math.random() >= Math.min(0.9, CFG.CHAIN_CHANCE * rankX(mn).chain * dangerX(mn).chance)) return;
    const want = (CHAIN_NEXT[kind] || []).filter(x => !trapWhyNotFree(mn, x));
    const any = Object.keys(TRAP_KINDS).filter(x => x !== kind && x !== "tentacle" && x !== "well" && !trapWhyNotFree(mn, x));
    const next = want.length ? want[Math.floor(Math.random()*want.length)] : any[Math.floor(Math.random()*any.length)];
    if (!next) return;
    r.chainN++; r.chainAt = now; saveLedger();
    later(() => {
      if (!charFor(mn) || quietNow(mn) || (r.trapQuiet || 0) > Date.now() || heldByTrap(mn)) return;
      const rr = rec(mn); if (rr.penned && !rr.penned.trap) return;                     // the winch left them in the pen: that's its own ending
      emote("⛓️ "+rkLine("handOn", mn, { c: TRAP_KINDS[next].what.split(/[,:.]/)[0] }), mn);
      later(() => { const why = springTrap(mn, next, "", true); if (!why){ rec(mn).trapAt = Date.now(); saveLedger(); } }, 3500);
    }, 8000);
  }
  // could this trap spring if nothin' were holdin' them? (trapWhyNot, lookin' past the hold the last trap is about to drop)
  function trapWhyNotFree(mn, kind){
    const r = rec(mn), pen = r.penned; if (pen && pen.trap) r.penned = null;
    const why = trapWhyNot(mn, kind);
    if (pen && pen.trap) r.penned = pen;
    return why;
  }

  // ── watchers and their bets ──
  const EGG_TRAPS = { tentacle: 9, well: 12, eggs: 5, drake: 5, hive: 5, vines: 5 };      // the line to beat
  function offerBets(mn, kind){
    const what = EGG_TRAPS[kind] ? "eggs" : (kind === "tickle" || kind === "mirror") ? "wait" : null;
    if (!what) return;
    const near = (W.ChatRoomCharacter || []).map(c => c.MemberNumber).filter(m => m !== mn && m !== CFG.BOT_MEMBER && rec(m) && (rec(m).roles || []).length && !quietNow(m) &&
      (() => { const a = posOf(mn), b = posOf(m); return a && b && Math.max(Math.abs(a.X - b.X), Math.abs(a.Y - b.Y)) <= 4; })());
    if (!near.length) return;
    state.bets = state.bets || new Map();
    const line = what === "eggs" ? Math.round(EGG_TRAPS[kind] * eggX(mn) * rankX(mn).eggs) : 0;
    state.bets.set(mn, { what, line, kind, at: Date.now(), stakes: [] });
    for (const m of near) tell(m, what === "eggs"
      ? "🎲 "+plainName(mn)+"'s been caught, and it's goin' to lay in them. Fancy a flutter? ?bet <ribbons> high if you think it leaves more than "+line+" eggs, ?bet <ribbons> low if not. Up to "+CFG.BET_MAX+" ribbons, double back if you're right."
      : "🎲 "+plainName(mn)+"'s been caught. Will they give it what it wants? ?bet <ribbons> breaks or ?bet <ribbons> holds. Up to "+CFG.BET_MAX+" ribbons, double back if you're right.");
  }
  function settleBets(mn, bet, result, how){
    if (!bet.stakes.length) return;
    const won = bet.stakes.filter(s => s.side === result), lost = bet.stakes.filter(s => s.side !== result);
    for (const s of won) earnRibbons(s.by, s.n*2, "callin' it right on "+plainName(mn));
    for (const s of lost) tell(s.by, "🎲 "+how+". You called it wrong on "+plainName(mn)+", sugar. That's "+s.n+" ribbon"+(s.n === 1 ? "" : "s")+" gone.");
    if (charFor(mn)) emote("🎲 "+rkLine("betDone", mn, { x: how, c: won.length ? won.map(s => plainName(s.by)).join(" and ") : "nobody" }), mn);
  }
  // the tickle rack and the mirror box: called when they let go (10u4-more-traps.js trapWaitEnd)
  function betsWaitEnd(mn, how){
    const bet = (state.betsWait && state.betsWait.get(mn)) || (state.bets && state.bets.get(mn));
    if (!bet || bet.what !== "wait") return;
    if (state.betsWait) state.betsWait.delete(mn); if (state.bets) state.bets.delete(mn);
    if (how === "quiet") { for (const s of bet.stakes) earnRibbons(s.by, s.n, "a bet called off", 0, true); return; }
    settleBets(mn, bet, how === "gave" ? "breaks" : "holds", how === "gave" ? "They broke" : "They held out");
  }
  function betCommand(sender, args, R){
    const n = parseInt(args[0], 10), side = String(args[1] || "").toLowerCase();
    const open = Array.from((state.bets || new Map()).entries()).concat(Array.from((state.betsWait || new Map()).entries())).filter(([mn, b]) => mn !== sender && Date.now() - b.at < CFG.BET_OPEN_S*1000 &&
      (() => { const a = posOf(sender), c = posOf(mn); return a && c && Math.max(Math.abs(a.X - c.X), Math.abs(a.Y - c.Y)) <= 6; })());
    if (!open.length){ R("There's nothin' to bet on right now, sugar. When a trap takes somebody near you, I'll tell you."); return; }
    const [mn, bet] = open[open.length - 1], sides = bet.what === "eggs" ? ["high", "low"] : ["breaks", "holds"];
    if (!(n >= 1) || !sides.includes(side)){ R("?bet <ribbons> "+sides.join("|")+", sugar. Up to "+CFG.BET_MAX+" ribbons on "+plainName(mn)+(bet.what === "eggs" ? " (the line is "+bet.line+" eggs)" : "")+"."); return; }
    if (bet.stakes.some(s => s.by === sender)){ R("You've a bet down on that one already, sugar."); return; }
    const stake = Math.min(CFG.BET_MAX, n);
    if (ribbonsOf(sender) < stake){ R("You've not got "+stake+" ribbons to put down, sugar."); return; }
    spendRibbons(sender, stake, "a bet on "+plainName(mn));
    bet.stakes.push({ by: sender, n: stake, side });
    R("🎲 "+stake+" ribbon"+(stake === 1 ? "" : "s")+" on "+side+". Let's see what "+plainName(mn)+" does.");
  }

  // ── the brood book ──
  function broodBook(mn){
    const r = rec(mn), p = prodOf(mn); if (!r || !p) return "They're not on the books, sugar.";
    const book = (L.studbook || []).filter(e => e.dam === mn), by = {};
    let eggs = 0, kids = 0, litters = 0, biggest = 0;
    for (const e of book){
      const who = (e.sires || []).map(plainName).join(" & ") || "somebody";
      const b = by[who] = by[who] || { clutches: 0, eggs: 0, litters: 0, kids: 0 };
      if (e.eggs){ b.clutches++; b.eggs += e.eggs; eggs += e.eggs; biggest = Math.max(biggest, e.eggs); }
      else { const k = e.kids ? e.kids.male + e.kids.female + e.kids.futa : 0; b.litters++; b.kids += k; kids += k; litters++; }
    }
    const had = Object.entries(r.trapKinds || {}).filter(([k]) => ANTHRO[k] || k === "tentacle" || k === "well" || k === "breeder" || k === "eggs" || k === "vines" || k === "leeches").sort((a, b) => b[1] - a[1]);
    const lines = ["📖 "+plainName(mn).toUpperCase()+"'S BROOD BOOK"+(isSubject(mn) ? " · "+SUBJECT_RANKS[rankOfSubject(mn)].name+" ("+(r.trapN || 0)+" traps)" : "")];
    lines.push("Eggs laid: "+eggs+(biggest ? " (biggest clutch "+biggest+")" : "")+" · Litters: "+litters+" ("+kids+" young)"+(p.eggs ? " · carryin' "+p.eggs.n+" eggs now" : "")+(p.preg ? " · carryin' a litter of "+p.preg.count+" now" : ""));
    if (had.length) lines.push("What's had them: "+had.map(([k, n]) => (ANTHRO[k] ? ANTHRO[k].name : k === "tentacle" ? "the thing in the water" : k === "well" ? "the thing in the well" : k === "breeder" ? "the breedin' frame" : k === "eggs" ? "the egg post" : k === "vines" ? "the vine patch" : "the trough leeches")+" ×"+n).join(" · "));
    if (r.parasiteN) lines.push("The parasite: "+r.parasiteN+" time"+(r.parasiteN === 1 ? "" : "s")+(parasiteOn(mn) ? " (on them now)" : ""));
    const rows = Object.entries(by).sort((a, b) => (b[1].eggs + b[1].kids) - (a[1].eggs + a[1].kids)).slice(0, 12);
    if (rows.length) lines.push("Whose they carried:\n"+rows.map(([who, b]) => "• "+who+": "+[b.clutches && b.clutches+" clutch"+(b.clutches === 1 ? "" : "es")+" ("+b.eggs+" eggs)", b.litters && b.litters+" litter"+(b.litters === 1 ? "" : "s")+" ("+b.kids+" young)"].filter(Boolean).join(", ")).join("\n"));
    if (lines.length === 2 && !eggs && !litters) lines.push("Nothin' written in it yet. Give it time.");
    return lines.join("\n");
  }
  function ranksCommand(cmd, sender, args, R){
    if (cmd === "bet") return betCommand(sender, args, R);
    // ?brood [who]
    const t = args[0] ? resolveTarget(args[0]) : sender;
    if (!t || !rec(t)){ R("Whose brood book, sugar? ?brood, or ?brood <who> for the proprietors."); return; }
    if (t !== sender && !isProprietor(sender)){ R("A brood book is between an animal and the proprietors, sugar. ?brood shows your own."); return; }
    R(broodBook(t));
  }

  const RANK_LINES = {
    rank1: ["%n has sprung enough of the farm's traps to earn a name for it: TRAP FODDER. The farm girl chalks it by their stall.", "Ten traps. %n isn't bait any more. They're TRAP FODDER, and the traps seem to know it."],
    rank2: ["Twenty-five traps, and most of them left somethin' behind. %n is a BROOD SOW now, and the water's started to take an interest.", "%n has been caught, filled and laid in often enough to be wrote down as a BROOD SOW. Everything on this farm that breeds can smell it on them."],
    rank3: ["Sixty. %n is a BROODMOTHER: the thing every trap on this farm was built to make. They'll never again cross the yard without somethin' reachin' for them.", "%n has earned the last name the farm gives its subjects: BROODMOTHER. The traps reset faster for them, the water rises to meet them, and their belly is never goin' to be empty for long."],
    handOn: ["It isn't finished with %n. The floor tilts, somethin' catches them as they stumble, and they're passed along: %c.",
             "%n gets two steps before the next one has them. One trap hands them straight to another: %c.",
             "No rest. As the last one lets go, a second one's already closin': %c.",
             "The traps on this farm talk to each other. %n is tipped, slid and delivered: %c."],
    betDone: ["%x. The ones who called it right about %n: %c.", "It's settled: %x. Winnin's to %c.", "%x, for all the yard to see. %c had the right of it."],
  };
