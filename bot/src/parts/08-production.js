  /* ═══════════ PRODUCTION, BREEDING, HEAT ═══════════
     Per person, in r.prod. Everything is opt-in and limit-checked.
     Rates are per hour; amounts are mL. */

  // hard-limit words, by topic. Breeding words also rule out heat.
  const LIMIT_WORDS = {
    breed: /\b(breed\w*|pregnan\w*|impregnat\w*|inflat\w*|cum\w*|creampie\w*|seed\w*)\b/i,
    heat:  /\b(heat|breed\w*|pregnan\w*|impregnat\w*)\b/i,
    milk:  /\b(milk\w*|lactat\w*|udders?)\b/i,
    futa:  /\b(futa\w*|penis|cock)\b/i,
    eggs:  /\b(eggs?|ovipos\w*|clutch)\b/i
  };
  const HOLES = ["vulva","butt","mouth"];
  function holeFrom(w){
    w = String(w||"").toLowerCase();
    if (/^(vulva|pussy|cunt|vagina|vaginal)$/.test(w)) return "vulva";
    if (/^(butt|ass|anus|anal)$/.test(w)) return "butt";
    if (/^(mouth|throat|oral)$/.test(w)) return "mouth";
    return null;
  }

  function prodOf(mn){
    const r = rec(mn);
    if (!r) return null;
    if (!r.prod) r.prod = { milk:0, semen:0, held:{vulva:0,butt:0,mouth:0}, capBonus:0,
                            heat:null, boosts:{}, preg:null, freshUntil:0,
                            offspring:{male:0,female:0,futa:0,litters:0},
                            totals:{milked:0,collected:0,received:0,given:0,sired:0},
                            hasPenis:false, last:Date.now(), lastHeatEmote:0, nextHeatAt:0 };
    return r.prod;
  }
  function limitBlocks(mn, kind){ const r = rec(mn); return !!(r && LIMIT_WORDS[kind||"breed"].test(r.limits||"")); }
  function speciesKey(mn){
    const s = String((rec(mn)||{}).species||"").toLowerCase();
    for (const k of Object.keys(CFG.SPECIES)) if (k !== "default" && s.includes(k)) return k;
    return "default";
  }
  function speciesInfo(mn){ return CFG.SPECIES[speciesKey(mn)]; }
  const ml = n => n >= 1000 ? (n/1000).toFixed(1)+" L" : Math.round(n)+" mL";

  // crafted item text, decoded the same way LSCG does it
  function craftText(item){
    if (!item || !item.Craft) return "";
    let d = item.Craft.Description || "";
    try { if (W.CraftingDescription && typeof W.CraftingDescription.Decode === "function") d = W.CraftingDescription.Decode(d); } catch(e){}
    return ((item.Craft.Name||"")+" | "+d).toLowerCase();
  }
  // "heat inducer", "Heat-Inducer", "heat_inducer" and "heatinducer" all match
  function squash(t){ return String(t||"").toLowerCase().replace(/[^a-z0-9]/g,""); }
  // a body word and a grow/shrink word, in either order, up to 3 words apart:
  // "shrink penis", "penis shrinker", "grow balls", "Big Tit Growth Serum", "pussy stretching" all work
  const SHOT_PARTS = {
    udder:/^(udders?|breasts?|boobs?|tits?|titty|titties|chest|bust|jugs|melons)$/,
    testes:/^(balls?|testicles?|testes|nuts|sack|scrotum)$/,
    penis:/^(penis|penises|cocks?|dicks?|shaft|member)$/,
    knot:/^knots?$/,
    vulva:/^(pussy|pussies|vulva|vagina|vaginal|cunt|twat)$/,
    butt:/^(anal|anus|ass|asshole|butt|butthole|backdoor)$/,
    throat:/^(throat|gag)$/
  };
  const SHOT_UP = /^(grow|grows|growth|growing|enlarg\w*|enhanc\w*|bigger|boost\w*|swell\w*|expand\w*|expansion|inflat\w*|plump\w*|gape|gaper|gaping|stretch\w*|loosen\w*|widen\w*|trainer|training|relax\w*|increas\w*|hyper|engorg\w*|amplif\w*)$/;
  const SHOT_DOWN = /^(shrink\w*|reduc\w*|smaller|tighten\w*|restor\w*|decreas\w*|minimi\w*|slim\w*)$/;
  function partShots(text){
    const w = String(text||"").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean), out = [], used = new Set();
    for (let i = 0; i < w.length; i++){
      const part = Object.keys(SHOT_PARTS).find(k => SHOT_PARTS[k].test(w[i]));
      if (!part || out.some(o => o[0] === part)) continue;
      let best = null;
      for (let d = 1; d <= 3 && !best; d++) for (const j of [i+d, i-d]){
        if (j < 0 || j >= w.length || used.has(j)) continue;
        if (SHOT_UP.test(w[j]))   { best = [j, +1]; break; }
        if (SHOT_DOWN.test(w[j])) { best = [j, -1]; break; }
      }
      if (best){ out.push([part, best[1]]); used.add(i); used.add(best[0]); }
    }
    return { pairs: out, rest: w.filter((x,k) => !used.has(k)).join(" ") };
  }
  function sizeTagsIn(text){
    const out = [], flat = squash(text);
    for (const [part, d] of Object.entries(CFG.SIZE_TAGS)){
      if (d.up.some(w => flat.includes(squash(w))))   out.push([part, +1]);
      else if (d.down.some(w => flat.includes(squash(w)))) out.push([part, -1]);
    }
    for (const pr of partShots(text).pairs) if (!out.some(o => o[0] === pr[0])) out.push(pr);
    return out;
  }
  function tagsIn(text){
    // size phrases ("udder reducing", "pussy stretching") come out first so they don't also count as plain "reducing"
    let flat = squash(partShots(text).rest);
    for (const d of Object.values(CFG.SIZE_TAGS)) for (const w of d.up.concat(d.down)) flat = flat.split(squash(w)).join(" ");
    const out = new Set();
    for (const [tag, words] of Object.entries(CFG.TAG_WORDS))
      if (words.some(w => flat.includes(squash(w)))) out.add(tag);
    return out;
  }
  // a message that reaches them anywhere on the map: beep if we're friends, whisper otherwise
  function tell(mn, text){ if (isFriend(mn)) beep(mn, text); else whisper(mn, text); }
  const wornCache = new Map();
  function wornTags(mn){
    const hit = wornCache.get(mn), now = Date.now();
    if (hit && now - hit.t < 5000) return hit.v;
    const v = wornTagsNow(mn); wornCache.set(mn, { t:now, v }); return v;
  }
  function wornTagsNow(mn){
    const C = charFor(mn), out = new Set();
    for (const it of ((C && C.Appearance) || [])) for (const t of tagsIn(craftText(it))) out.add(t);
    return out;
  }
  function seePenis(mn){
    const C = charFor(mn); const p = prodOf(mn);
    if (!C || !p || !Array.isArray(C.Appearance)) return;
    p.hasPenis = C.Appearance.some(it => it && it.Asset && it.Asset.Group &&
                 it.Asset.Group.Name === "Pussy" && /penis/i.test(it.Asset.Name||""));
  }
  function capacity(mn){
    const p = prodOf(mn);
    return CFG.PROD.BASE_CAPACITY + (p ? p.capBonus : 0) + (wornTags(mn).has("capacity") ? CFG.PROD.WORN_CAPACITY : 0);
  }
  // futa make milk and semen, and can breed and be bred
  function makesSemen(mn){ const r = rec(mn), p = prodOf(mn); return !!(r && (r.futa || (p && p.hasPenis))); }
  function hasVulva(mn){ const r = rec(mn), p = prodOf(mn); return !!(r && (r.futa || !(p && p.hasPenis))); }

  // body sizes
  function sizeOf(mn, part){
    const p = prodOf(mn), S = CFG.SIZES[part]; if (!p) return S.start;
    if (!p.size) p.size = {};
    if (!p.size[part]) p.size[part] = S.start;
    return p.size[part];
  }
  // the udder swells while expecting and fresh
  function udderLevel(mn){
    const p = prodOf(mn), up = p && (p.preg || p.freshUntil > Date.now()) ? CFG.PREG_UDDER_UP : 0;
    return Math.min(CFG.SIZES.udder.max, sizeOf(mn,"udder") + up);
  }
  function sizeBase(mn, part){ const p = prodOf(mn); return (p.sizeBase && p.sizeBase[part]) || sizeOf(mn, part); }
  // permanent: their usual changes too (shots, ?size, training). Otherwise it's a stretch that tightens back.
  function setSize(mn, part, lvl, permanent){
    const p = prodOf(mn), S = CFG.SIZES[part];
    lvl = Math.max(1, Math.min(S.max, Math.round(lvl)));
    if (!p.size) p.size = {}; if (!p.sizeBase) p.sizeBase = {}; if (!p.gapeAt) p.gapeAt = {};
    if (permanent || !p.sizeBase[part]) p.sizeBase[part] = permanent ? lvl : sizeOf(mn, part);
    p.size[part] = lvl;
    p.gapeAt[part] = Date.now();
    return lvl;
  }
  function sizeWord(part, lvl){
    const S = CFG.SIZES[part];
    if (S.inches) return (S.words.find(w => lvl < w[0]) || S.words[S.words.length-1])[1];
    if (S.cups) return S.cups[lvl-1]+" cup, "+S.names[lvl-1];
    return S.names[lvl-1];
  }
  function isHyper(part, lvl){ return lvl > CFG.SIZES[part].natural; }
  function sizeName(mn, part){
    const S = CFG.SIZES[part], l = part === "udder" ? udderLevel(mn) : sizeOf(mn, part);
    const extra = part === "udder" && l > sizeOf(mn,"udder") ? ", swollen from carryin'" : "";
    if (S.inches) return l+"\" "+sizeWord(part,l)+(isHyper(part,l) ? " ✨" : "");
    return sizeWord(part,l)+" ("+l+"/"+S.max+(isHyper(part,l) ? " ✨hyper" : "")+extra+")";
  }
  // how much a size multiplies production: gentle up to natural, then hyper multiplies again
  function sizeX(part, lvl, perLevel){
    const nat = CFG.SIZES[part].natural;
    const x = Math.max(0.4, 1 + perLevel*(Math.min(lvl, nat)-3));
    return lvl > nat ? x * Math.pow(CFG.HYPER_X[part], lvl - nat) : x;
  }
  function udderX(mn){ return sizeX("udder", udderLevel(mn), CFG.UDDER_X_PER_LEVEL); }
  function testesX(mn){ return sizeX("testes", sizeOf(mn,"testes"), CFG.TESTES_X_PER_LEVEL); }
  function semenCap(mn){ return CFG.PROD.SEMEN_CAP * testesX(mn); }
  function halfLife(mn, h){
    if (h === "mouth") return CFG.PROD.HALF_LIFE_H[h];
    return CFG.PROD.HALF_LIFE_H[h] / (1 + CFG.GAPE_LEAK_X*(sizeOf(mn,h)-1));
  }
  // the gape (or throat) level a penis this long needs to fit comfortably
  function penisNeeds(inches){ return Math.max(1, Math.ceil(inches / CFG.INCHES_PER_GAPE)); }
  function loadWord(mlAmt){ return CFG.LOAD_WORDS.find(w => mlAmt < w[0])[1]; }
  // too big to move?
  function sizePinned(mn){
    for (const [part, at] of Object.entries(CFG.PIN_FROM_SIZE)){
      if (!at) continue;
      if (part === "udder" && makesMilk(mn) && udderLevel(mn) >= at) return "udder";
      if (part === "testes" && makesSemen(mn) && sizeOf(mn,"testes") >= at) return "balls";
    }
    return null;
  }
  // ── penis types and knots ──
  function penisType(mn){
    const p = prodOf(mn);
    if (p && p.ptype && CFG.PENIS_TYPES[p.ptype]) return p.ptype;
    return CFG.SPECIES_PENIS[speciesKey(mn)] || "human";
  }
  function typeInfo(mn){ return CFG.PENIS_TYPES[penisType(mn)]; }
  function knotted(mn){
    const p = prodOf(mn);
    if (p && typeof p.knot === "boolean") return p.knot;
    return !!typeInfo(mn).knot;
  }
  function penisLabel(mn){ return (knotted(mn) && penisType(mn) !== "canine" ? "knotted " : "")+typeInfo(mn).label; }
  function setPenisType(mn, type){
    const p = prodOf(mn);
    p.ptype = type;
    p.knot = !!CFG.PENIS_TYPES[type].knot || !!p.knotShot;
  }
  function penisTagsIn(text){
    let flat = squash(text);
    for (const d of Object.values(CFG.SIZE_TAGS)) for (const w of d.up.concat(d.down)) flat = flat.split(squash(w)).join(" ");
    const out = { type:null, knot:0 };
    if (CFG.KNOT_REMOVE_TAGS.some(w => flat.includes(squash(w)))){ out.knot = -1; for (const w of CFG.KNOT_REMOVE_TAGS) flat = flat.split(squash(w)).join(" "); }
    if (CFG.KNOT_ADD_TAGS.some(w => flat.includes(squash(w)))) out.knot = 1;
    for (const [type, words] of Object.entries(CFG.PENIS_TYPE_TAGS))
      if (words.some(w => flat.includes(squash(w)))){ out.type = type; break; }
    return out;
  }
  // "vulva+butt" (or vulva&butt, vulva,butt) → both; a single hole → [hole]
  function holesFrom(w){
    const hs = String(w||"").toLowerCase().split(/[+&,]/).map(x => holeFrom(x.trim()));
    return hs.length && hs.every(Boolean) ? Array.from(new Set(hs)) : null;
  }
  function holeText(hole){ return String(hole).split("+").map(h => h === "mouth" ? "throat" : h).join(" and "); }
  function onBreedingStand(mn){
    const C = charFor(mn), pos = C && C.MapData && C.MapData.Pos, s = (L.spots||{})[CFG.BREEDING_STAND];
    return !!(pos && s && Math.abs(s.X-pos.X) <= 1 && Math.abs(s.Y-pos.Y) <= 1);
  }
  function isRut(){ return new Date().getDay() === CFG.RUT_DAY; }
  function sceneCooldown(stud){ return CFG.FAST_SCENE_TYPES.includes(penisType(stud)) ? CFG.FAST_SCENE_S : CFG.RP_CUM_COOLDOWN_S; }
  function bellyWord(mn){
    const p = prodOf(mn), f = heldTotal(p) / capacity(mn), now = Date.now();
    let w = f < 0.25 ? "" : f < 0.6 ? "a little soft" : f < 1 ? "round and full" : f < CFG.CUMFLATE_PIN_X ? "swollen and sloshin'" : "drum-tight";
    if (p.preg){
      const d = (now - p.preg.since) / 86400000;
      const pw = d < 1 ? "" : d < 3 ? "just startin' to show" : d < 4 ? "showin'" : "heavy and round with the litter";
      if (pw) w = w ? w+", "+pw : pw;
    }
    return w;
  }
  const RUT_LINES = [
    "🔥 It's rut day on the farm, and the air's thick with it. Every stud's achin' and every belly's hungry.",
    "🔥 Somewhere in the barn a stud groans and a pen gate rattles. Rut day's got everybody worked up.",
    "🔥 The whole farm smells like heat and hay today. Rut day, y'all. Fertile as all get out."];
  function rutTick(){
    if (!isRut() || !inRoom()) return;
    const now = Date.now();
    if (L.rutDay !== dayKey()){ L.rutDay = dayKey(); L.rutSaid = now; saveLedger();
      say("🔥 RUT DAY, y'all! All day today every fill is twice as likely to take, and studs get pent up twice as fast. Get breedin'! 🐂"); return; }
    if (now - (L.rutSaid||0) > CFG.RUT_EMOTE_MIN*60000*(0.75+Math.random()*0.5)){
      L.rutSaid = now; emote(RUT_LINES[Math.floor(Math.random()*RUT_LINES.length)].replace(/^🔥 /,"🔥 "));
    }
  }
  // stock in heat within a couple of tiles?
  function nearHeat(mn){
    const C = charFor(mn), pos = C && C.MapData && C.MapData.Pos;
    if (!pos) return null;
    for (const O of (W.ChatRoomCharacter||[])){
      const om = O.MemberNumber, op = O.MapData && O.MapData.Pos;
      if (om === mn || !op || !rec(om) || !inHeat(prodOf(om))) continue;
      if (Math.abs(op.X-pos.X) <= CFG.HEAT_SCENT_TILES && Math.abs(op.Y-pos.Y) <= CFG.HEAT_SCENT_TILES) return om;
    }
    return null;
  }
  // a knot lets go
  function untie(mn, force){
    const p = prodOf(mn);
    if (!p || !p.tieUntil) return;
    if (!force && Date.now() < p.tieUntil - 1000) return;
    const stud = p.tiedTo;
    p.tieUntil = 0; p.tiedTo = 0;
    if (state.leashes.get(mn) === stud) state.leashes.delete(mn);
    saveLedger();
    if (charFor(mn)) emote("💧 With a slow, wet pop, "+plainName(stud)+"'s knot finally slips free of "+plainName(mn)+", and a warm trickle follows it out. They're untied.");
  }

  const PART_WORDS = { udder:/^(udders?|breasts?|boobs?|tits?|chest)$/, testes:/^(balls?|testes|testicles?|nuts)$/,
                       penis:/^(penis|cock|dick|shaft)$/, vulva:/^(vulva|pussy|cunt)$/, butt:/^(butt|ass|anus|anal)$/,
                       throat:/^(throat|mouth|oral)$/, knot:/^(knot)$/ };
  function partFrom(w){ w = String(w||"").toLowerCase(); for (const [k,re] of Object.entries(PART_WORDS)) if (re.test(w)) return k; return null; }

  // can the hole (or the stud's penis) actually be reached? Uses BC's own checks.
  function itemLabel(it){ return (it.Craft && it.Craft.Name) || it.Asset.Description || it.Asset.Name; }
  function findItem(C, groups, effects){
    return (C.Appearance||[]).find(it => {
      if (!it || !it.Asset || !it.Asset.Group) return false;
      const eff = [].concat((it.Property && it.Property.Effect) || [], it.Asset.Effect || []);
      const blk = [].concat((it.Property && it.Property.Block) || [], it.Asset.Block || []);
      return groups.includes(it.Asset.Group.Name) || effects.some(e => eff.includes(e)) || groups.some(g => blk.includes(g));
    });
  }
  // Is that hole (or the stud's penis) blocked? I look at what each item actually does
  // (its effects and the slots it covers). BC's own InventoryGroupIsBlocked() says
  // "blocked" for everybody in this room, so I don't trust it.
  //  vulva: a chastity belt or shield, anything coverin' the vulva slot, or a dildo/plug in it
  //  butt:  butt chastity, anything coverin' the butt slot, or anything in the butt slot (plugs, tail plugs)
  //  mouth: a gag that blocks the mouth (a ring or open gag is fine), or a hood coverin' it
  //  penis: a cage or belt over the front (that's the stud's check, kept separate)
  // Piercings, clamps and eggs don't block anything unless they're chastity pieces.
  function holeBlocked(mn, hole){
    if (!CFG.BLOCK_CHECK) return null;
    const C = charFor(mn);
    if (!C || !Array.isArray(C.Appearance)) return null;     // can't see 'em: trust the scene
    const items = C.Appearance.filter(x => x && x.Asset && x.Asset.Group);
    const grp = x => x.Asset.Group.Name;
    const eff = x => [].concat((x.Property && x.Property.Effect) || [], x.Asset.Effect || []);
    const blk = x => [].concat((x.Property && x.Property.Block) || [], x.Asset.Block || []);
    const FRONT = ["ItemVulva","ItemPelvis","ItemVulvaPiercings","ItemPenis"];
    let it = null;
    if (hole === "vulva"){
      it = items.find(x => FRONT.includes(grp(x)) && eff(x).includes("Chaste")) ||
           items.find(x => grp(x) !== "ItemVulva" && blk(x).includes("ItemVulva")) ||
           items.find(x => grp(x) === "ItemVulva" && (eff(x).includes("FillVulva") || /dildo|plug/i.test(x.Asset.Name)));
    } else if (hole === "butt"){
      it = items.find(x => eff(x).includes("ButtChaste")) ||
           items.find(x => grp(x) !== "ItemButt" && blk(x).includes("ItemButt")) ||
           items.find(x => grp(x) === "ItemButt");
    } else if (hole === "mouth"){
      const MOUTH = ["ItemMouth","ItemMouth2","ItemMouth3"];
      it = items.find(x => MOUTH.includes(grp(x)) && eff(x).includes("BlockMouth") && !eff(x).includes("OpenMouth")) ||
           items.find(x => !MOUTH.includes(grp(x)) && blk(x).includes("ItemMouth"));
    } else if (hole === "penis"){
      it = items.find(x => FRONT.includes(grp(x)) && (eff(x).includes("Chaste") || /chastity|cage/i.test(x.Asset.Name||"")));
    }
    return it ? itemLabel(it) : null;
  }

  function heldTotal(p){ return HOLES.reduce((a,h)=>a+(p.held[h]||0),0); }
  function inHeat(p){ return !!(p && p.heat && p.heat.until > Date.now()); }
  function boosted(p, k){ return !!(p && p.boosts && p.boosts[k] > Date.now()); }
  function milkCapNatural(mn){ return CFG.PROD.MILK_CAP * speciesInfo(mn).milk * udderX(mn); }
  function milkCap(mn){ const p = prodOf(mn); return milkCapNatural(mn) + (p ? p.capBonus : 0); }
  // stock make milk unless they switch it off; anyone else can switch it on
  function makesMilk(mn){
    const r = rec(mn);
    if (!r) return false;
    if (r.milkable === true || r.milkable === false) return r.milkable;
    return (hasRole(mn, ROLE.LIVESTOCK) || !!r.futa) && !limitBlocks(mn,"milk");
  }

  function milkRate(mn){
    const p = prodOf(mn), now = Date.now();
    let r = CFG.PROD.MILK_PER_H * speciesInfo(mn).milk * udderX(mn);
    if (p.preg) r *= CFG.PROD.PREG_MILK_X;
    if (p.freshUntil > now) r *= CFG.PROD.FRESH_MILK_X;
    if (boosted(p,"milk")) r *= 2;
    if (wornTags(mn).has("lactation")) r *= 1.5;
    if (tierOf(mn) === "prize") r *= 1.25;
    if (boosted(p,"hungry")) r *= CFG.HUNGRY_X;
    if (p.nursed && p.nursed.week === weekKey()) r *= 1 + Math.min(CFG.NURSE_SUPPLY_MAX, CFG.NURSE_SUPPLY_STEP * p.nursed.n);
    return r;
  }
  function semenRate(mn){
    const p = prodOf(mn);
    let r = CFG.PROD.SEMEN_PER_H * testesX(mn);
    if (boosted(p,"semen")) r *= 2;
    if (wornTags(mn).has("virility")) r *= 1.5;
    if (boosted(p,"hungry")) r *= CFG.HUNGRY_X;
    return r;
  }

  // yield board: today and this week
  function dayKey(d){ d = d||new Date(); return d.toISOString().slice(0,10); }
  function weekKey(d){
    d = new Date(d||Date.now()); d.setUTCHours(0,0,0,0);
    d.setUTCDate(d.getUTCDate() + 3 - ((d.getUTCDay()+6)%7));
    const w1 = new Date(Date.UTC(d.getUTCFullYear(),0,4));
    return d.getUTCFullYear()+"-W"+(1+Math.round(((d-w1)/86400000 - 3 + ((w1.getUTCDay()+6)%7))/7));
  }
  function rollBoard(){
    if (!L.yield) L.yield = { day:dayKey(), week:weekKey(), d:{}, w:{} };
    const Y = L.yield;
    if (Y.day !== dayKey()){ Y.d = {}; Y.u = {}; Y.day = dayKey(); }
    if (Y.week !== weekKey()){
      const top = Object.entries(Y.w).sort((a,b)=>b[1]-a[1])[0];
      if (top && CFG.PROD.WEEKLY_PRIZE){
        const mn = parseInt(top[0],10), r = rec(mn);
        if (r && !CFG.PUNISH_TIERS.includes(r.tier)){
          r.tier = "prize";
          audit(CFG.BOT_MEMBER,"TIER",mn+" → prize (top producer "+Y.week+")");
          beep(mn, "🏆 Top producer of the week, with "+ml(top[1])+"! You're prize stock now, sugar. So proud of you!");
          if (inRoom()) say("🏆 Y'all give it up for this week's top producer: "+plainName(mn)+", with "+ml(top[1])+"! Prize stock now.");
        }
      }
      if (CFG.GRADE.WEEKLY_PRIZE && Y.g){
        const best = Object.entries(Y.g).filter(([,v]) => v.n >= CFG.GRADE.MIN_SESSIONS)
                     .map(([m,v]) => [parseInt(m,10), v.sum/v.n]).sort((a,b)=>b[1]-a[1])[0];
        if (best){
          const r = rec(best[0]);
          if (r && !CFG.PUNISH_TIERS.includes(r.tier)){
            r.tier = "prize";
            audit(CFG.BOT_MEMBER,"TIER",best[0]+" → prize (best milk "+Y.week+")");
            beep(best[0], "🏆 Best milk on the farm this week, grade "+gradeLetter(best[1])+"! You're prize stock now, sweetie. 🥛");
            if (inRoom()) say("🏆 Best milk of the week goes to "+plainName(best[0])+", grade "+gradeLetter(best[1])+"! Prize stock, y'all. 🥛");
          }
        }
      }
      const sires = Object.entries(Y.s||{}).sort((a,b)=>b[1]-a[1]).slice(0, CFG.TOP_SIRES);
      if (sires.length && inRoom())
        say("🐂 This week's top sires, y'all: "+sires.map(([m,n],i)=>(i+1)+". "+plainName(parseInt(m,10))+" ("+n+" caught)").join(", ")+". Somebody's been busy! 🍼");
      for (const [m] of sires.slice(0,1)) beep(parseInt(m,10), "🐂 You're the top sire on the farm this week, sugar! Proud of you.");
      Y.w = {}; Y.g = {}; Y.s = {}; Y.week = weekKey();
    }
    saveLedger();
  }
  function credit(mn, amount){
    rollBoard();
    L.yield.d[mn] = (L.yield.d[mn]||0) + amount;
    L.yield.w[mn] = (L.yield.w[mn]||0) + amount;
  }

  function drainMilk(mn, amount, nursing){
    const p = prodOf(mn);
    if (milkDenied(mn)) return 0;
    const take = Math.min(p.milk, amount);
    if (!(take >= 1)) return 0;
    const now = Date.now();
    if (!nursing){ const d = dayKey(); if (!p.mday || p.mday.day !== d) p.mday = { day:d, ml:0 }; p.mday.ml += take; }
    if (!nursing && (!p.lastMilkAt || now - p.lastMilkAt > CFG.GRADE.SESSION_GAP_MIN*60000)){
      const gapH = p.lastMilkAt ? (now - p.lastMilkAt)/3600000 : null;
      const sc = sessionScore(mn, gapH);
      p.grades = (p.grades||[]).concat(sc).slice(-20);
      rollBoard();
      const g = L.yield.g || (L.yield.g = {});
      g[mn] = g[mn] || { sum:0, n:0 }; g[mn].sum += sc; g[mn].n++;
    }
    if (!nursing) p.lastMilkAt = now;
    p.milk -= take; p.totals.milked += take; credit(mn, take);
    // squeezin' someone who's cumflated pushes some of that load back out too
    const over = heldTotal(p) - capacity(mn);
    if (over > 0 && !(p.tieUntil > now)){
      const out = Math.min(over, take * CFG.MILK_LEAK_SHARE), tot = heldTotal(p);
      for (const h of HOLES) p.held[h] = Math.max(0, (p.held[h]||0) - out * (p.held[h]||0) / tot);
      p.leakAcc = (p.leakAcc||0) + out;
      if (charFor(mn) && now - (p.leakSaid||0) > 60000 && p.leakAcc >= 5){
        p.leakSaid = now;
        emote("💦 Every squeeze of "+plainName(mn)+"'s udder pushes a warm gush of "+(p.lastStud ? plainName(p.lastStud)+"'s" : "somebody's")+" seed back out of 'em ("+ml(p.leakAcc)+"). What a mess, sugar.");
        p.leakAcc = 0;
      }
    }
    return take;
  }
  function drainSemen(mn, amount){
    const p = prodOf(mn);
    const take = Math.min(p.semen, amount);
    if (!(take >= 1)) return 0;
    p.lastCollectAt = Date.now();
    p.semen -= take; p.totals.collected += take; credit(mn, take);
    return take;
  }

  // heat
  function startHeat(mn, by, hours){
    const p = prodOf(mn);
    const already = inHeat(p);
    p.heat = { until: Date.now() + (hours||CFG.PROD.HEAT_H)*3600000, by };
    p.nextHeatAt = Date.now() + CFG.PROD.NATURAL_HEAT_EVERY_D*86400000;
    if (!already){
      if (charFor(mn)) enqueue({ Content:"*"+plainName(mn)+" flushes hot all over, comin' into heat. 🔥", Type:"Emote" });
      tell(mn, "🔥 Ooh, you've come into heat, "+plainName(mn)+"! Gonna be mighty hard to miss for the next "+(hours||CFG.PROD.HEAT_H)+" hours, sweetie.");
      for (const h of herdsOf(mn)) beep(h.leader, "🔥 Heads up, hon: "+plainName(mn)+" just came into heat.");
    }
    saveLedger();
  }
  function heatLines(){ return (L.heatLines && L.heatLines.length) ? L.heatLines.map(x=>x.text) : CFG.HEAT_LINES; }

  // pregnancy
  function rollConception(mother, stud, amount, bonus){
    const p = prodOf(mother), r = rec(mother);
    if (!r.fertile || boosted(p,"contra")) return null;
    const now = Date.now();
    if (p.preg){
      // a second father can join only in the first day, and never the same stud twice
      if (now - p.preg.since > CFG.PROD.EXTRA_SIRE_WINDOW_H*3600000) return null;
      if (p.preg.sires.includes(stud)) return null;
    }
    let chance = CFG.PROD.CONCEIVE_BASE * speciesInfo(mother).fert *
                 (0.5 + Math.min(1, (p.held.vulva||0) / capacity(mother)));
    if (inHeat(p)) chance *= 3;
    if (boosted(p,"fert")) chance *= 2;
    if (wornTags(mother).has("fertility")) chance *= 1.5;
    if (bonus) chance *= bonus;
    if (isRut()) chance *= 2;
    // breedin' rights: only the rights-holder's loads can take
    if (r.rights && r.rights.until > now && r.rights.stud !== stud && !(r.rights.allow||[]).includes(stud)) return null;
    if (p.preg) chance *= CFG.PROD.EXTRA_SIRE_X;
    chance = Math.min(0.95, chance);
    if (Math.random() >= chance) return null;
    if (p.preg){ p.preg.sires.push(stud); return "extra"; }
    const [lo,hi] = speciesInfo(mother).litter;
    let count = lo + Math.floor(Math.random()*(hi-lo+1));
    if (lo === 1 && hi === 1 && Math.random() < CFG.PROD.TWIN_CHANCE) count = 2;
    p.preg = { since:now, due: now + CFG.PROD.PREG_DAYS*86400000, sires:[stud], count, warned:false };
    return "new";
  }
  function giveBirth(mn){
    const p = prodOf(mn), g = p.preg;
    const kids = { male:0, female:0, futa:0 };
    const [m,f] = CFG.PROD.SEX_SPLIT;
    for (let i=0;i<g.count;i++){
      const x = Math.random()*100;
      if (x < m) kids.male++; else if (x < m+f) kids.female++; else kids.futa++;
    }
    p.offspring.male += kids.male; p.offspring.female += kids.female; p.offspring.futa += kids.futa;
    p.offspring.litters++;
    for (const s of g.sires){ const sp = prodOf(s); if (sp) sp.totals.sired += 1; }
    if (!L.studbook) L.studbook = [];
    L.studbook.push({ t:Date.now(), dam:mn, sires:g.sires.slice(), kids });
    if (L.studbook.length > 1000) L.studbook = L.studbook.slice(-1000);
    p.preg = null; p.freshUntil = Date.now() + CFG.PROD.FRESH_DAYS*86400000;
    saveLedger(); audit(CFG.BOT_MEMBER,"BIRTH",mn+" "+JSON.stringify(kids));
    const parts = [];
    if (kids.male)   parts.push(kids.male+" male");
    if (kids.female) parts.push(kids.female+" female");
    if (kids.futa)   parts.push(kids.futa+" futa");
    const msg = "🍼 Oh, y'all! "+plainName(mn)+" just delivered "+g.count+" ("+parts.join(", ")+"), sired by "+
                g.sires.map(plainName).join(" & ")+". Milk's comin' in strong now!";
    if (onMap(mn)) emote("🍼 With one last long push, "+plainName(mn)+" delivers "+g.count+" ("+parts.join(", ")+"), sired by "+g.sires.map(plainName).join(" & ")+
                         ". The farm girl tucks 'em in the straw, and "+plainName(mn)+"'s milk comes in strong, breasts swellin' heavy.");
    else beep(mn, msg);
    for (const h of herdsOf(mn)) beep(h.leader, msg);
  }

  // Each milking session gets a score; the grade is the average of the last few.
  function sessionScore(mn, gapH){
    const p = prodOf(mn), now = Date.now(), G = CFG.GRADE;
    let sc = G.BASE + (G.TIER[tierOf(mn)||"new"] || 0);
    if (gapH === null) sc += 0;
    else if (gapH < G.TOO_SOON_H) sc += G.TOO_SOON;
    else if (gapH > G.TOO_LONG_H) sc += G.TOO_LONG;
    else if (gapH >= G.REGULAR_MIN_H && gapH <= G.REGULAR_MAX_H) sc += G.REGULAR;
    if (p.freshUntil > now) sc += G.FRESH;
    if (inHeat(p)) sc += G.HEAT;
    if (boosted(p,"milk")) sc += G.LACT_SHOT;
    if (wornTags(mn).has("lactation")) sc += G.LACT_WORN;
    if (p.fullSince && now - p.fullSince > CFG.PROD.OVERFULL_H*3600000) sc += G.LEAKING;
    return Math.max(0, Math.min(100, sc));
  }
  function gradeLetter(sc){ for (const [min,l] of CFG.GRADE.LETTERS) if (sc >= min) return l; return "D"; }
  function milkGrade(mn){
    const p = prodOf(mn);
    const h = (p && p.grades) || [];
    if (!h.length) return gradeLetter(CFG.GRADE.BASE + (CFG.GRADE.TIER[tierOf(mn)||"new"]||0));
    const last = h.slice(-CFG.GRADE.AVERAGE_OF);
    return gradeLetter(last.reduce((a,b)=>a+b,0)/last.length);
  }

  function prodTick(){
    const now = Date.now();
    for (const k in L.people){
      const mn = parseInt(k,10), r = L.people[k];
      if (!r.prod && !makesMilk(mn) && r.milkable !== true && !r.futa) continue;
      const p = prodOf(mn);
      if (charFor(mn)) seePenis(mn);
      const dtH = Math.max(0, (now - (p.last||now)) / 3600000);
      p.last = now;
      if (dtH > 0){
        const capM = milkCap(mn);
        if (makesMilk(mn)) p.milk = Math.min(capM, p.milk + milkRate(mn)*dtH);
        if (makesSemen(mn)) p.semen = Math.min(semenCap(mn), p.semen + semenRate(mn)*dtH);
        const tied = p.tieUntil > now;
        for (const h of HOLES){
          // a knot keeps every drop in; a plug seals that hole (only while they're here, wearin' it)
          if (tied) continue;
          if (h !== "mouth" && charFor(mn) && holeBlocked(mn, h)) continue;
          p.held[h] = (p.held[h]||0) * Math.pow(0.5, dtH / halfLife(mn, h));
        }
      }
      // stretched holes slowly tighten back to their usual
      for (const h of ["vulva","butt"]){
        const cur = sizeOf(mn, h), base = sizeBase(mn, h), at = (p.gapeAt && p.gapeAt[h]) || 0;
        if (cur > base && now - at > CFG.GAPE_TIGHTEN_H*3600000) setSize(mn, h, cur-1, false);
      }
      // a stretcher worn in the vulva or butt slot (or a mouth slot, for the throat) opens that hole
      // up a level the moment it goes in, and trains its usual a level every 12 hours worn, up to natural
      const Cs = charFor(mn);
      if (Cs){
        if (!p.stretchMs) p.stretchMs = {};
        if (!p.stretchOn) p.stretchOn = {};
        for (const [h, groups] of [["vulva",["ItemVulva"]],["butt",["ItemButt"]],["throat",["ItemMouth","ItemMouth2","ItemMouth3"]]]){
          const it = (Cs.Appearance||[]).find(x => x && x.Asset && x.Asset.Group && groups.includes(x.Asset.Group.Name) && isStretcher(x));
          if (!it){ if (p.stretchOn[h]) p.stretchOn[h] = false; continue; }
          if (!p.stretchOn[h]){
            p.stretchOn[h] = true;
            const base = sizeBase(mn, h);
            if (sizeOf(mn, h) < base + 1 && base + 1 <= CFG.SIZES[h].max) setSize(mn, h, base + 1, false);
            if (onMap(mn)) emote(h === "throat"
              ? "😮 "+plainName(mn)+"'s "+itemLabel(it)+" works its way deep, holdin' that throat open: "+sizeWord(h, sizeOf(mn,h))+" for now."
              : "🍑 "+plainName(mn)+"'s "+itemLabel(it)+" spreads that "+(h === "vulva" ? "pussy" : "ass")+" wide and stays put, stretchin' it "+sizeWord(h, sizeOf(mn,h))+".");
          }
          if (!(dtH > 0)) continue;
          p.stretchMs[h] = (p.stretchMs[h]||0) + dtH*3600000;
          if (p.stretchMs[h] >= CFG.STRETCH_TRAIN_H*3600000){
            p.stretchMs[h] = 0;
            const base = sizeBase(mn, h);
            if (base < CFG.SIZES[h].natural){
              if (!p.sizeBase) p.sizeBase = {};
              p.sizeBase[h] = base + 1;
              if (sizeOf(mn,h) < base + 1) p.size[h] = base + 1;
              const where = h === "vulva" ? "pussy" : h === "butt" ? "ass" : "throat";
              if (onMap(mn)) emote("🍑 That "+itemLabel(it)+" has done its work: "+plainName(mn)+"'s "+where+" stays "+sizeWord(h, sizeOf(mn,h))+" for good now.");
              else tell(mn, "🍑 That stretcher's doin' its job, "+plainName(mn)+"! Your "+where+" stays "+sizeWord(h, sizeOf(mn,h))+" now.");
            }
          }
        }
      }
      // pent up: semen full for a day (half that while caged)
      if (makesSemen(mn) && p.semen >= semenCap(mn) - 0.5){
        if (!p.semenFullSince) p.semenFullSince = now;
        const caged = !!holeBlocked(mn, "penis");
        if (isRut() && !p.pentUp) p.semenFullSince -= Math.min(now - (p.last2||now), CFG.HEARTBEAT_MS*2);
        const scent = nearHeat(mn);
        if (scent && !p.pentUp){
          // the time spent near heat counts double
          p.semenFullSince -= Math.min(now - (p.last2||now), CFG.HEARTBEAT_MS*2);
          if (!p.scentTold || now - p.scentTold > 3600000){ p.scentTold = now;
            emote("👃 "+plainName(mn)+" catches the scent of "+plainName(scent)+"'s heat, and those balls start achin' to empty.");
          }
        }
        const need = (caged ? CFG.PENTUP_CAGED_H : CFG.PENTUP_H) * 3600000;
        if (!p.pentUp && now - p.semenFullSince >= need){
          p.pentUp = true;
          tell(mn, "😤 You're all pent up, "+plainName(mn)+"! Next load's gonna be a big one, and extra potent too.");
        }
      } else if (p.semen < semenCap(mn) - 0.5) p.semenFullSince = 0;
      p.last2 = now;
      if (p.heat && p.heat.until <= now){ p.heat = null; whisper(mn, "Your heat's passed, "+plainName(mn)+". Bet you're feelin' a little calmer now, hon."); }
      if (r.naturalHeat && !limitBlocks(mn,"heat") && !inHeat(p) && p.nextHeatAt && now >= p.nextHeatAt) startHeat(mn, 0);
      if (r.naturalHeat && !p.nextHeatAt) p.nextHeatAt = now + CFG.PROD.NATURAL_HEAT_EVERY_D*86400000;
      if (charFor(mn)){ p.seenDay = dayKey(); scentTick(mn); sloshTick(mn); }
      if (p.painted && p.painted.until <= now) p.painted = null;
      checkTitles(mn);
      // milk denied: full and achin', and everybody can tell
      if (p.milkDeniedUntil){
        if (now >= p.milkDeniedUntil){ p.milkDeniedUntil = 0; tell(mn, "🥛 Your teats are uncapped, "+plainName(mn)+". Go get yourself milked, sugar!");
          if (onMap(mn)) emote("🥛 The caps come off "+plainName(mn)+"'s swollen teats, and milk starts beadin' right away. Somebody fetch a pail!"); }
        else if (makesMilk(mn) && p.milk >= milkCap(mn) - 1 && onMap(mn) && now - (p.achedAt||0) > CFG.MILK_ACHE_MIN*60000*(0.75+Math.random()*0.5)){
          p.achedAt = now;
          const ache = ["%n's udder is swollen tight and shiny, leakin' around the caps. They can't stop squirmin'.",
                        "%n whimpers and cups their achin' breasts, so full it hurts. Nobody's allowed to milk 'em.",
                        "A slow drip of milk runs down %n's belly from those capped, overfull teats."];
          emote("🚫 "+ache[Math.floor(Math.random()*ache.length)].replace(/%n/g, plainName(mn)));
        }
      }
      // eggs: laid when they're due (they wait for you to come to the farm, up to half a day)
      if (p.eggs && now >= p.eggs.layAt){
        const here = onMap(mn);
        if (here || now - p.eggs.layAt > CFG.LABOUR_WAIT_H*3600000){
          const e = p.eggs; p.eggs = null;
          p.offspring.eggs = (p.offspring.eggs||0) + e.n;
          if (!L.studbook) L.studbook = [];
          L.studbook.push({ t:now, dam:mn, sires:[e.by], kids:{ male:0, female:0, futa:0 }, eggs:e.n });
          saveLedger(); audit(CFG.BOT_MEMBER, "EGGS", mn+" "+e.n);
          if (here) emote("🥚 "+plainName(mn)+" squats and strains, belly rollin', and one by one pushes out "+e.n+" slick, warm eggs from "+plainName(e.by)+"'s clutch. The farm girl gathers 'em into a nest of straw.");
          else tell(mn, "🥚 You laid "+e.n+" eggs from "+plainName(e.by)+"'s clutch, sugar.");
        }
      }
      if (p.preg){
        if (!p.preg.warned && p.preg.due - now < 86400000){
          p.preg.warned = true;
          beep(mn, "🍼 You're due in less than a day, "+plainName(mn)+"! Almost there, sweetie.");
          for (const h of herdsOf(mn)) beep(h.leader, "🍼 "+plainName(mn)+" is due in less than a day, hon.");
        }
        // labour: on the farm when it's time, there's a show first
        if (now >= p.preg.due){
          if (p.labour){
            if (now >= p.labour.until){ p.labour = null; giveBirth(mn); }
            else if (onMap(mn) && now >= p.labour.next){
              p.labour.next = now + (8 + Math.random()*6)*60000;
              const c = ["%n grips the rail and moans through another contraction, belly tight and heavin'.",
                         "%n pants and rocks on all fours. The litter's movin' lower, any time now.",
                         "Another wave rolls through %n, and they let out a long, low moo. Not long now, sugar."];
              emote("🍼 "+c[Math.floor(Math.random()*c.length)].replace(/%n/g, plainName(mn)));
            }
          } else if (onMap(mn)){
            p.labour = { until: now + CFG.LABOUR_MIN*60000, next: now + 10*60000 };
            emote("🍼 Y'all, "+plainName(mn)+"'s water just broke! They're in labour with "+p.preg.sires.map(plainName).join(" & ")+"'s litter. Come gather round the stall.");
            for (const h of herdsOf(mn)) tell(h.leader, "🍼 "+plainName(mn)+" just went into labour, hon. Come watch!");
          } else if (now - p.preg.due > CFG.LABOUR_WAIT_H*3600000) giveBirth(mn);
        }
      }
      if (p.tieUntil && now >= p.tieUntil) untie(mn, true);
      if (p.deniedUntil && now >= p.deniedUntil){ p.deniedUntil = 0; p.pentUp = true; tell(mn, "😤 Your denial's up, "+plainName(mn)+", and you're achin' with it. Next load's a big, pent-up one."); }
      // expectin' and showin': a little emote once a day from day 3
      if (p.preg && now - p.preg.since > 3*86400000 && charFor(mn) && now - (p.showSaid||0) > 86400000){
        p.showSaid = now;
        emote("🤰 "+plainName(mn)+" rests a hand on that swellin' belly. "+plainName(p.preg.sires[0])+"'s litter is really showin' now.");
      }
      // a loose hole drips its load now and then (not while plugged or tied)
      for (const h of ["vulva","butt"]){
        if (!charFor(mn) || sizeOf(mn,h) < CFG.LEAKY_GAPE || (p.held[h]||0) < 30 || p.tieUntil > now || holeBlocked(mn,h)) continue;
        p.lastDrip = p.lastDrip || {};
        if (now - (p.lastDrip[h]||0) < CFG.LEAKY_EMOTE_MIN*60000*(0.75+Math.random()*0.5)) continue;
        p.lastDrip[h] = now;
        const out = p.held[h] * 0.1; p.held[h] -= out;
        emote("💧 "+plainName(mn)+"'s "+sizeWord(h, sizeOf(mn,h))+" "+h+" just can't hold it: "+ml(out)+" of "+(p.lastStud ? plainName(p.lastStud)+"'s" : "somebody's")+" seed dribbles down their thighs.");
      }
      // too full to move: pinned where they stand
      // what pins them: milk past its normal cap (held semen only if PIN_FROM_INFLATION), or a hyper udder or balls
      const swell = (CFG.PROD.PIN_FROM_INFLATION ? heldTotal(p) : 0) +
                    (CFG.PROD.PIN_FROM_MILK ? Math.max(0, p.milk - milkCapNatural(mn)) : 0);
      const bySize = sizePinned(mn);
      const cumflated = CFG.PROD.PIN_FROM_INFLATION && heldTotal(p) >= CFG.CUMFLATE_PIN_X * capacity(mn);
      const pinned = (swell >= CFG.PROD.IMMOBILE_ML || !!bySize || cumflated) && !(p.unpinUntil > now);
      const Cp = charFor(mn), pos = Cp && Cp.MapData && Cp.MapData.Pos;
      if (pinned && pos){
        if (!p.pin){ p.pin = { X:pos.X, Y:pos.Y };
          if (cumflated && !bySize){ /* doCum already announced it */ }
          else whisper(mn, bySize
            ? "🎈 Oh my, your "+(bySize === "udder" ? "udder is" : "balls are")+" just too big to move with, "+plainName(mn)+"! You'll stay put right here till somebody gives you "+(bySize === "udder" ? "an udder" : "a ball")+" reducer shot."
            : "🎈 Oh my, you're too full to move, "+plainName(mn)+"! You'll stay put right here till you're milked down or somebody gives you a reducin' shot."); }
        else if (pos.X !== p.pin.X || pos.Y !== p.pin.Y){
          if (p.tieUntil > now) p.pin = { X:pos.X, Y:pos.Y };   // tied: the knot drags 'em along, the pin moves with 'em
          else teleport(mn, p.pin, false);
        }
      } else if (p.pin && !pinned){
        p.pin = null; if (Cp) whisper(mn, "You can move again, "+plainName(mn)+"! Go on and stretch those legs.");
        if (Cp && heldTotal(p) > capacity(mn) * 0.5 && !bySize) emote("🎈 Enough has finally drained out of "+plainName(mn)+" that they can waddle again, belly still soft and sloshin'.");
      }
      // full past a day: leaking
      const capNow = milkCap(mn);
      if (makesMilk(mn) && p.milk >= capNow - 1){ if (!p.fullSince) p.fullSince = now; }
      else p.fullSince = 0;
      if (p.fullSince && now - p.fullSince > CFG.PROD.OVERFULL_H*3600000 && charFor(mn) &&
          now - (p.lastLeak||0) > CFG.PROD.LEAK_EMOTE_MIN*60000*(0.75+Math.random()*0.5)){
        p.lastLeak = now;
        enqueue({ Content:"*"+fill(CFG.LEAK_LINES[Math.floor(Math.random()*CFG.LEAK_LINES.length)], mn), Type:"Emote" });
      }
      // heat emotes for folks in heat on the farm
      if (inHeat(p) && charFor(mn) && now - p.lastHeatEmote > CFG.PROD.HEAT_EMOTE_MIN*60000*(0.75+Math.random()*0.5)){
        p.lastHeatEmote = now;
        const lines = heatLines();
        const line = lines[Math.floor(Math.random()*lines.length)];
        enqueue({ Content:"*"+fill(line, mn), Type:"Emote" });
      }
    }
    saveLedger();
  }

  // anyone standing on (or next to) a spot whose name starts with "milking" gets milked
  function milkingStallTick(){
    const stalls = Object.entries(L.spots||{}).filter(([n]) => n.startsWith("milking"));
    if (!stalls.length) return;
    const dtMin = CFG.HEARTBEAT_MS/60000;
    for (const C of (W.ChatRoomCharacter||[])){
      const pos = C.MapData && C.MapData.Pos;
      if (!pos || C.MemberNumber === CFG.BOT_MEMBER) continue;
      const on = stalls.some(([,s]) => Math.abs(s.X-pos.X) <= 1 && Math.abs(s.Y-pos.Y) <= 1);
      if (!on || !rec(C.MemberNumber)) continue;
      const mn = C.MemberNumber, p = prodOf(mn);
      const gotM = makesMilk(mn) && !milkDenied(mn) ? drainMilk(mn, CFG.PROD.STALL_MILK_PER_MIN*dtMin) : 0;
      const gotS = makesSemen(mn) ? drainSemen(mn, CFG.PROD.STALL_SEMEN_PER_MIN*dtMin) : 0;
      const got = gotM + gotS;
      // a stud in the stall gets their own show
      if (gotS > 0 && Date.now() - (p.stallSaid||0) > 5*60000*(0.75+Math.random()*0.5)){
        p.stallSaid = Date.now();
        const n = plainName(mn), c = penisLabel(mn);
        const L1 = [n+"'s "+c+" cock is sealed in the stall's wet suction sleeve, and it pumps and pulls in a slow, steady rhythm. Their hips twitch every time it squeezes.",
                    "The machine strokes "+n+" from root to tip, milkin' that "+c+" cock for every drop. Seed spurts into the collection jar in thick pulses.",
                    "A warm vibrating cup hugs "+n+"'s balls while the sleeve sucks their cock. "+n+" is a moanin', drippin' mess in the stall."];
        emote("🐂 "+L1[Math.floor(Math.random()*L1.length)]);
      }
      if (got > 0 && p.milk < 1 && p.semen < 1) emote(makesSemen(mn) && !makesMilk(mn)
        ? "🐂 The stall wrings one last shaky spurt out of "+plainName(mn)+" and lets go. Balls emptied, legs wobbly. Good stud!"
        : "🥛 The milkin' stall drains "+plainName(mn)+" plumb dry. Good job, sweetie! Off you go.");
    }
  }

  // the stud fills a hole: used by ?cum and by the breeding scene's auto-fill
  function doCum(stud, t, hole, R, auto, opt){
    opt = opt || {};
    if (!rec(stud)){ R("You need to be on the books for that, sugar. Say ?apply first!"); return false; }
    const rt = rec(t);
    if (!rt || !rt.breedable || limitBlocks(t)){ R(plainName(t)+" ain't breedable, hon. They'd have to say ?breedable on themselves (and their limits have to allow it)."); return false; }
    const gone = missing(stud, t);
    if (gone){ R(gone === stud ? "You've gotta be here on the map for that, sugar." : plainName(t)+" isn't here on the map right now, hon. You both need to be in the room."); return false; }
    if (!opt.second && !breedConsent(stud, t)){ askBreed(stud, t, hole); R("I've asked "+plainName(t)+" first, sugar. Once they say yes, go right ahead."); return false; }
    const sp = prodOf(stud), tp = prodOf(t);
    seePenis(stud); seePenis(t);
    if (hole === "vulva" && !hasVulva(t)){ R(plainName(t)+" doesn't have a vulva to fill, hon. Try butt or mouth, like ?cum "+plainName(t)+" butt. (If they're futa, they can say ?futa on.)"); return false; }
    const penBlock = makesSemen(stud) && holeBlocked(stud, "penis");
    if (penBlock){ R("Can't do it, sugar: your penis is locked up in "+penBlock+". Get it off first!"); blockedTease(stud, t, hole, penBlock, true); return false; }
    const holeBlock = holeBlocked(t, hole);
    if (holeBlock){ R("Whoa there, hon! "+plainName(t)+"'s "+(hole === "mouth" ? "mouth" : hole)+" is blocked by "+holeBlock+". That'll have to come off before you can fill it."); blockedTease(stud, t, hole, holeBlock, false); return false; }
    // a pent-up stud empties everything, and then some
    if (sp.deniedUntil > Date.now()){ R("🚫 Not yet, sugar. You're denied for "+Math.ceil((sp.deniedUntil-Date.now())/60000)+" more minutes. Ache for it."); return false; }
    const T = makesSemen(stud) ? typeInfo(stud) : CFG.PENIS_TYPES.human;
    const knot = makesSemen(stud) && knotted(stud);
    const pent = opt.load ? !!opt.pent : !!sp.pentUp;
    let load = opt.load || 0, rest = 0;
    if (!opt.load){
      const base = pent ? sp.semen * CFG.PENTUP_LOAD_X
                        : Math.max(sp.semen * CFG.PROD.LOAD_SHARE, Math.min(sp.semen, CFG.PROD.MIN_LOAD));
      if (base < 1){ R(makesSemen(stud) ? "Aw, you're drained plumb dry, sugar. Nothin' left to give till you build back up." : "You've got no semen to give, sugar. Wear a penis (or say ?futa on) and it'll build up by the hour."); return false; }
      sp.semen = pent ? 0 : sp.semen - Math.min(sp.semen, base);
      if (pent){ sp.pentUp = false; sp.semenFullSince = 0; }
      load = base * (T.loadX || 1);            // a flared or ridged cock pumps more than it drains
      if (sp.edges){ load *= 1 + CFG.EDGE_X * Math.min(sp.edges, CFG.EDGE_MAX); opt.edged = sp.edges; sp.edges = 0; }
      // stamina: a stud who's been busy this hour runs drier (pent up or a virility shot skips it)
      sp.fills = (sp.fills||[]).filter(x => Date.now() - x < 3600000);
      if (!pent && !boosted(sp,"semen") && sp.fills.length >= CFG.STAMINA_FILLS)
        load *= Math.pow(CFG.STAMINA_X, sp.fills.length - CFG.STAMINA_FILLS + 1);
      sp.fills.push(Date.now());
      if (opt.half){ rest = load/2; load = load/2; }
    }
    sp.totals.given += load;
    const pen = sizeOf(stud, "penis"), need = penisNeeds(pen);
    // a throat that's not ready for it gags and drools some back out, but it learns
    let gagged = 0, trained = false;
    if (hole === "mouth" && makesSemen(stud) && need > sizeOf(t,"throat")){
      gagged = load * (1 - sizeOf(t,"throat") / need);
      tp.throatTrain = (tp.throatTrain||0) + (T.throatX || 1);
      if (tp.throatTrain >= CFG.THROAT_TRAIN_EVERY && sizeBase(t,"throat") < CFG.SIZES.throat.natural){
        tp.throatTrain = 0; setSize(t, "throat", sizeOf(t,"throat")+1, true); trained = true;
      }
    }
    const room = Math.max(0, capacity(t) - heldTotal(tp));
    const fullBefore = heldTotal(tp) / capacity(t);
    // a knot plugs 'em up tight: not a drop spills, however full they get
    const kept = knot ? load - gagged : Math.min(load - gagged, room), spilt = load - gagged - kept;
    tp.held[hole] = (tp.held[hole]||0) + kept; tp.totals.received += kept;
    if (hole === "mouth") tp.milk = Math.min(milkCap(t), tp.milk + kept * CFG.PROD.SWALLOW_TO_MILK);
    if (hole === "mouth" && kept >= CFG.HUNGRY_ML){ tp.boosts = tp.boosts || {}; tp.boosts.hungry = Date.now() + 3600000; }
    const sc0 = state.scenes.get(stud);
    // the scene stays open till ?breed stop (or 2 quiet hours), even after a hand ?cum
    const F = L.life && L.life.fair;
    if (F && F.open && F.cls === "load" && F.entrants[stud]){ F.loads = F.loads || {}; F.loads[stud] = Math.max(F.loads[stud]||0, load); }
    tp.lastStud = stud;
    const flavor = { equine:" That flared head swells wide with every pulse.", feline:" Those barbs make sure every last drop counts.",
                     draconic:" Every ridge drags deliciously on the way.", double:opt.load || opt.half ? " Both cocks throb and unload at once." : "" }[penisType(stud)] || "";
    let o = "💦 "+(pent ? "All pent up, " : "")+plainName(stud)+" empties "+loadWord(load)+" ("+ml(load)+") into "+plainName(t)+"'s "+(hole === "mouth" ? "throat" : hole)+"."+(makesSemen(stud) ? flavor : "")+" "+
            plainName(t)+" is "+Math.round(100*heldTotal(tp)/capacity(t))+"% full"+(spilt>0 ? ", and "+ml(spilt)+" spills out" : "")+".";
    if (opt.edged) o += " Edged "+opt.edged+" time"+(opt.edged === 1 ? "" : "s")+" first, it just keeps on comin'.";
    if (hole === "mouth" && makesSemen(stud)) o += " "+seedTaste(stud, pent);
    if (gagged >= 1) o += " "+plainName(t)+" gags on that "+pen+"\" cock and drools "+ml(gagged)+" back up"+(trained ? ", but that throat's learnin': it's "+sizeWord("throat", sizeOf(t,"throat"))+" now" : "")+".";
    if (hole !== "mouth" && makesSemen(stud)){
      const gape = sizeOf(t, hole);
      const needK = need + (knot ? 1 : 0);    // a knot stretches 'em one more
      // gentle: no stretchin' at all · rough: an extra level on top
      let to = opt.gentle ? gape : needK > gape ? Math.min(needK, gape + CFG.STRETCH_PER_BREED * (T.stretchX || 1)) : gape;
      if (opt.rough) to = Math.min(CFG.SIZES[hole].max, to + 1);
      if (to > gape){
        setSize(t, hole, to, false);
        o += opt.rough ? " Pounded that hard, "+plainName(t)+"'s "+(hole === "vulva" ? "pussy" : "ass")+" is left "+sizeWord(hole, sizeOf(t,hole))+" and twitchin'!"
                       : " That "+pen+"\" "+sizeWord("penis", pen)+" cock leaves 'em "+sizeWord(hole, sizeOf(t,hole))+"!";
      } else if (opt.gentle && needK > gape) o += " Taken slow and sweet, so not one bit of stretchin'.";
    }
    let caught = null;
    if (hole === "vulva"){
      const bonus = (pent ? CFG.PENTUP_FERT_X : 1) * (knot ? CFG.KNOT_FERT_X : 1) *
                    (T.heat && !inHeat(tp) ? 3 : 1) * (onBreedingStand(t) ? CFG.BREEDING_STAND_X : 1);
      caught = rollConception(t, stud, kept, bonus);
      sp.totals.covers = (sp.totals.covers||0) + 1;
      if (caught){ sp.totals.conceived = (sp.totals.conceived||0) + 1;
                   rollBoard(); const Y = L.yield; Y.s = Y.s || {}; Y.s[stud] = (Y.s[stud]||0) + 1; }
    }
    okBreed(stud, t);
    if (!opt.second){
      tally(t);
      tp.scent = { stud, until: Date.now() + CFG.SCENT_H*3600000 };
      for (const h of herdsOf(t)){
        if (h.leader === stud) continue;
        tp.toldLeader = tp.toldLeader || {};
        const key = h.leader+":"+stud;
        if (Date.now() - (tp.toldLeader[key]||0) < 3600000) continue;
        tp.toldLeader[key] = Date.now();
        tell(h.leader, "👃 Heads up, hon: "+plainName(stud)+" just filled your "+plainName(t)+" ("+holeText(hole)+"). They smell of "+plainName(stud)+" now.");
      }
    }
    // a draconic stud can leave a clutch of eggs in somebody who said ?eggs on
    let clutch = 0;
    if (!opt.second && hole !== "mouth" && makesSemen(stud) && penisType(stud) === "draconic" && rt.eggs && !tp.eggs && !limitBlocks(t, "eggs") &&
        Math.random() < (knot ? CFG.EGG_TIED_CHANCE : CFG.EGG_CHANCE)){
      const [lo,hi] = CFG.EGG_COUNT, [dl,dh] = CFG.EGG_DAYS;
      clutch = lo + Math.floor(Math.random()*(hi-lo+1));
      tp.eggs = { n:clutch, by:stud, since:Date.now(), layAt: Date.now() + (dl + Math.random()*(dh-dl))*86400000 };
    }
    saveLedger(); audit(stud,"CUM",stud+"→"+t+" "+hole+" "+Math.round(load));
    emote(o);
    if (clutch) emote("🥚 Deep inside "+plainName(t)+", something takes hold: "+plainName(stud)+"'s draconic seed has left a clutch of "+clutch+" eggs growin' in there. They'll be layin' in a few days.");
    if (sc0) sc0.lastCum = Date.now();
    // the knot ties 'em: leashed together till it goes down
    if (knot && !opt.second){
      // a bigger knot ties longer: a little one 5-15 minutes, an inescapable one 20-30
      const frac = (sizeOf(stud,"knot") - 1) / (CFG.SIZES.knot.max - 1), span = CFG.TIE_MAX_M - CFG.TIE_MIN_M;
      const lo = CFG.TIE_MIN_M + span*frac*0.6, hi = CFG.TIE_MIN_M + span*(0.4 + 0.6*frac);
      const mins = Math.round(lo + Math.random()*(hi - lo));
      const until = Date.now() + mins*60000, again = tp.tieUntil > Date.now() && tp.tiedTo === stud;
      tp.tieUntil = Math.max(tp.tieUntil||0, until); tp.tiedTo = stud;
      state.leashes.set(t, stud);
      emote(again
        ? "🔒 "+plainName(stud)+"'s knot swells even fatter, lockin' "+plainName(t)+" down tighter. Their tie runs another "+Math.round((tp.tieUntil-Date.now())/60000)+" minutes."
        : "🔒 "+plainName(stud)+"'s "+sizeWord("knot", sizeOf(stud,"knot"))+" knot swells and locks deep in "+plainName(t)+"'s "+(hole === "mouth" ? "throat" : hole)+
          ". They're tied together now, and "+plainName(t)+" is goin' wherever "+plainName(stud)+" goes for the next "+mins+" minutes.");
      later(() => untie(t, false), tp.tieUntil - Date.now() + 500);
      if (!again && onBreedingStand(t))
        emote("👀 Right up on the breedin' stand for the whole farm to see: "+plainName(t)+", knotted fast to "+plainName(stud)+" and squirmin' on it. Pull up a hay bale, y'all.");
    }
    // cumflation
    const fullNow = heldTotal(tp) / capacity(t);
    if (fullNow >= CFG.CUMFLATE_PIN_X && fullBefore < CFG.CUMFLATE_PIN_X)
      emote("🎈 "+plainName(t)+"'s belly is stretched round, tight and sloshin' with "+plainName(stud)+"'s seed, way too swollen to waddle off. They're stuck right where they are till it drains.");
    else if (fullNow > 1 && fullBefore <= 1)
      emote("🎈 "+plainName(t)+"'s belly starts to round out, warm and heavy with "+plainName(stud)+"'s load.");
    if (caught === "new") emote("🍼 It took! A soft, warm glow settles over "+plainName(t)+": they're carryin' "+plainName(stud)+"'s young now. Due in "+CFG.PROD.PREG_DAYS+" days.");
    if (caught === "new" && !makesMilk(t) && !limitBlocks(t,"milk"))
      tell(t, "🍼 You're carryin' now, sugar. Want your milk to come in with the litter? Say ?milkable on and you'll start fillin' up. Leave it, and you'll stay dry.");
    if (caught === "extra") emote("🍼 "+plainName(stud)+" got one in too! "+plainName(t)+" is carryin' for two sires now.");
    if (caught){ for (const h of herdsOf(t)) beep(h.leader, "🍼 Guess what, sugar: "+plainName(t)+" caught from "+plainName(stud)+"!"); }
    return { load, rest, pent };
  }
  /* FREE USE: a stud only gets to fill somebody who said ?freeuse on, or who said yes to them */
  function breedConsent(stud, t){
    const r = rec(t); if (r && r.freeuse) return true;
    const u = state.breedOk.get(t+":"+stud); return !!(u && u > Date.now());
  }
  function okBreed(stud, t){ state.breedOk.set(t+":"+stud, Date.now() + CFG.BREED_OK_H*3600000); }
  function askBreed(stud, t, hole){
    const a = state.breedAsks.get(t), now = Date.now();
    if (a && a.stud === stud && now - a.at < 60000) return;
    state.breedAsks.set(t, { stud, hole: hole || null, at: now });
    tell(t, "🐂 "+plainName(stud)+" wants to breed you"+(hole ? " ("+holeText(hole)+")" : "")+", sugar. Say yes or no (?yes or ?no works too). "+
            "Say ?freeuse on if you'd rather never be asked.");
  }
  function answerBreed(t, yes){
    const a = state.breedAsks.get(t);
    if (!a || Date.now() - a.at > CFG.BREED_ASK_MIN*60000){ state.breedAsks.delete(t); return false; }
    state.breedAsks.delete(t);
    const stud = a.stud;
    if (!yes){
      tell(t, "Understood, hon. I told "+plainName(stud)+" no.");
      tell(stud, "🐂 "+plainName(t)+" said no, sugar. Please leave it be.");
      return true;
    }
    okBreed(stud, t);
    const hole = a.hole || "vulva";
    const sc = state.scenes.get(stud), now = Date.now();
    if (sc){ if (!sc.with.includes(t)) sc.with.push(t); if (a.hole) sc.hole = a.hole; sc.lastSeen = now; }
    else state.scenes.set(stud, { with:[t], hole, at:now, by:stud, lastCum:0, lastSeen:now });
    if (onMap(t) && onMap(stud)) emote("🐂 "+plainName(t)+" nods and presents for "+plainName(stud)+". The farm girl opens the gate and marks it in the stud book ("+holeText(hole)+").");
    tell(stud, "🐂 "+plainName(t)+" said yes! Your scene's open ("+holeText(hole)+"). Say cum (or orgasm, breed, fill them up) in your chat or emotes.");
    return true;
  }

  /* CUM ON: paint 'em instead of fillin' 'em */
  const PAINT_AREAS = { face:"face", tits:"tits", titties:"tits", breasts:"tits", boobs:"tits", chest:"chest", belly:"belly", stomach:"belly",
                        tummy:"belly", back:"back", ass:"ass", butt:"ass", cheeks:"ass", hair:"hair", thighs:"thighs", feet:"feet", body:"body" };
  const PAINT_RX = /\b(?:on|over|across|onto|all over)\s+(?:(?:her|his|their|its|[a-z]+'s)\s+)?(?:\w+\s+)?(face|tits|titties|breasts|boobs|chest|belly|stomach|tummy|back|ass|butt|cheeks|hair|thighs|feet|body)\b/i;
  function paint(stud, t, area, R){
    if (!rec(stud)){ R("You need to be on the books for that, sugar. Say ?apply first!"); return false; }
    const rt = rec(t);
    if (!rt || !rt.breedable || limitBlocks(t)){ R(plainName(t)+" ain't breedable, hon. They'd have to say ?breedable on themselves (and their limits have to allow it)."); return false; }
    const gone = missing(stud, t);
    if (gone){ R(gone === stud ? "You've gotta be here on the map for that, sugar." : plainName(t)+" isn't here on the map right now, hon."); return false; }
    if (!breedConsent(stud, t)){ askBreed(stud, t); R("I've asked "+plainName(t)+" first, sugar. Once they say yes, go right ahead."); return false; }
    const sp = prodOf(stud), tp = prodOf(t), now = Date.now();
    seePenis(stud);
    const penBlock = makesSemen(stud) && holeBlocked(stud, "penis");
    if (penBlock){ R("Can't do it, sugar: your cock's locked up in "+penBlock+"."); return false; }
    if (sp.deniedUntil > now){ R("🚫 Not yet, sugar. You're denied for "+Math.ceil((sp.deniedUntil-now)/60000)+" more minutes."); return false; }
    const pent = !!sp.pentUp;
    const base = pent ? sp.semen * CFG.PENTUP_LOAD_X : Math.max(sp.semen * CFG.PROD.LOAD_SHARE, Math.min(sp.semen, CFG.PROD.MIN_LOAD));
    if (base < 1){ R("Aw, you're drained plumb dry, sugar."); return false; }
    sp.semen = pent ? 0 : sp.semen - Math.min(sp.semen, base);
    if (pent){ sp.pentUp = false; sp.semenFullSince = 0; }
    let load = base * ((makesSemen(stud) ? typeInfo(stud) : CFG.PENIS_TYPES.human).loadX || 1);
    if (sp.edges){ load *= 1 + CFG.EDGE_X * Math.min(sp.edges, CFG.EDGE_MAX); sp.edges = 0; }
    sp.totals.given += load; okBreed(stud, t);
    const a = PAINT_AREAS[String(area).toLowerCase()] || "body";
    const was = tp.painted && tp.painted.until > now ? tp.painted.areas : [];
    tp.painted = { areas: Array.from(new Set(was.concat(a))), until: now + CFG.PAINT_H*3600000, by: stud };
    tally(t); saveLedger(); audit(stud, "PAINT", stud+"→"+t+" "+a+" "+Math.round(load));
    const lines = {
      face:  "pulls out at the last second and paints %t's face: "+loadWord(load)+" ("+ml(load)+") in thick ropes across their cheeks, lips and lashes.",
      tits:  "pulls out and unloads all over %t's tits: "+loadWord(load)+" ("+ml(load)+") drippin' down the curves and off those nipples.",
      chest: "pulls out and splashes "+loadWord(load)+" ("+ml(load)+") across %t's chest.",
      belly: "pulls out and paints %t's belly with "+loadWord(load)+" ("+ml(load)+"), pooling warm in their navel.",
      back:  "pulls out and streaks "+loadWord(load)+" ("+ml(load)+") all up %t's back.",
      ass:   "pulls out and glazes %t's ass with "+loadWord(load)+" ("+ml(load)+"), drippin' down between their cheeks.",
      hair:  "pulls out and leaves "+loadWord(load)+" ("+ml(load)+") tangled in %t's hair.",
      thighs:"pulls out and spills "+loadWord(load)+" ("+ml(load)+") over %t's thighs.",
      feet:  "pulls out and coats %t's feet with "+loadWord(load)+" ("+ml(load)+").",
      body:  "pulls out and hoses %t down with "+loadWord(load)+" ("+ml(load)+")."
    };
    emote("💦 "+(pent ? "All pent up, " : "")+plainName(stud)+" "+lines[a].replace(/%t/g, plainName(t))+" "+plainName(t)+" is marked as "+plainName(stud)+"'s now, for everybody to see.");
    return { load, pent };
  }
  function paintedText(mn){
    const p = prodOf(mn); return p && p.painted && p.painted.until > Date.now() ? p.painted.areas.join(", ") : "";
  }

  /* TALLY MARKS: how many times somebody's been used today */
  function tally(t){
    const p = prodOf(t), r = rec(t), d = dayKey();
    if (!p.tally || p.tally.day !== d) p.tally = { day:d, n:0 };
    p.tally.n++;
    rollBoard(); const Y = L.yield; Y.u = Y.u || {};
    if (r && r.tally) Y.u[t] = p.tally.n;
    if (r && r.tally && [5,10,20,30,50,100].includes(p.tally.n) && onMap(t))
      emote("✏️ The farm girl adds another tally mark on "+plainName(t)+"'s thigh: "+p.tally.n+" today, and the day ain't over. Somebody's a popular little cumdump.");
  }
  function tallyToday(mn){ const p = prodOf(mn); return p && p.tally && p.tally.day === dayKey() ? p.tally.n : 0; }

  /* STUD SCENT: a fresh load leaves 'em smellin' of that stud for an hour */
  function scentOf(t){ const p = prodOf(t); return p && p.scent && p.scent.until > Date.now() ? p.scent.stud : 0; }
  function scentTick(mn){
    // a stud gets close to somebody who smells of another stud
    const C = charFor(mn), pos = C && C.MapData && C.MapData.Pos, p = prodOf(mn), now = Date.now();
    if (!pos || !makesSemen(mn)) return;
    p.smelled = p.smelled || {};
    for (const O of (W.ChatRoomCharacter||[])){
      const om = O.MemberNumber, op = O.MapData && O.MapData.Pos;
      if (om === mn || !op || !rec(om)) continue;
      const other = scentOf(om);
      if (!other || other === mn) continue;
      if (Math.abs(op.X-pos.X) > CFG.HEAT_SCENT_TILES || Math.abs(op.Y-pos.Y) > CFG.HEAT_SCENT_TILES) continue;
      if (now - (p.smelled[om]||0) < 3600000) continue;
      p.smelled[om] = now;
      emote("👃 "+plainName(mn)+" leans in close to "+plainName(om)+" and catches it: they reek of "+plainName(other)+"'s seed. Somebody's already been in there today.");
    }
  }

  /* SLOSHIN': a body full to burstin' wobbles when it walks */
  function sloshTick(mn){
    const C = charFor(mn), pos = C && C.MapData && C.MapData.Pos, p = prodOf(mn), now = Date.now();
    if (!pos) return;
    const moved = p.lastPos && (p.lastPos.X !== pos.X || p.lastPos.Y !== pos.Y);
    p.lastPos = { X:pos.X, Y:pos.Y };
    if (!moved || p.pin || now - (p.sloshAt||0) < CFG.SLOSH_MIN*60000*(0.75+Math.random()*0.5)) return;
    const full = heldTotal(p) / capacity(mn), milky = makesMilk(mn) && p.milk >= milkCap(mn)*0.9 && udderLevel(mn) >= 6;
    const n = plainName(mn);
    let line = null;
    if (full > 1) line = [n+" waddles along, belly round and tight, and you can hear every step slosh with "+(p.lastStud ? plainName(p.lastStud)+"'s" : "somebody's")+" seed.",
                          "Every step makes "+n+"'s swollen belly wobble and gurgle. A little dribble escapes down their thighs.",
                          n+" moves real careful, one hand on that sloshin' belly, cheeks pink."][Math.floor(Math.random()*3)];
    else if (milky) line = [n+"'s heavy, milk-swollen udder bounces and sways with every step. A drop beads at each nipple.",
                            n+" tries to walk without jigglin' those full, achin' breasts, and fails completely."][Math.floor(Math.random()*2)];
    if (!line) return;
    p.sloshAt = now;
    emote("💦 "+line);
  }

  /* BELLY RUBS: a full or expectin' belly answers back */
  function bellyRub(src, t){
    if (!rec(t) || !onMap(t)) return;
    const p = prodOf(t), now = Date.now();
    if (now - (p.rubAt||0) < 120000) return;
    const a = plainName(src), n = plainName(t);
    let line = null;
    if (p.preg) line = [a+" rubs "+n+"'s round belly, and the litter kicks right back. "+n+" giggles and leans into the touch.",
                        "Under "+a+"'s palm, "+n+"'s belly shifts and flutters. "+p.preg.sires.map(plainName).join(" & ")+"'s young are wide awake in there."][Math.floor(Math.random()*2)];
    else if (p.eggs) line = a+" strokes "+n+"'s swollen belly and feels the eggs shift and clack together inside. "+n+" lets out a needy little whimper.";
    else if (heldTotal(p) > capacity(t)) line = a+" presses on "+n+"'s cum-swollen belly, and it gurgles. A warm trickle squeezes out of 'em. Messy!";
    if (!line) return;
    p.rubAt = now;
    emote("🤰 "+line);
  }

  /* PRAISE & DEGRADATION */
  function praiseOrDegrade(by, t, praise, text){
    const r = rec(t), p = prodOf(t), now = Date.now();
    const k = praise ? "praised" : "degraded";
    r[k] = (r[k]||0) + 1;
    saveLedger();
    if (now - ((p.pdAt||{})[k]||0) < 120000) return;
    p.pdAt = p.pdAt || {}; p.pdAt[k] = now;
    const n = plainName(t), a = plainName(by);
    const word = ((praise ? text.match(CFG.RP_PRAISE) : text.match(CFG.RP_DEGRADE))||[""])[0].toLowerCase();
    const lines = praise
      ? [n+" just glows at bein' called a "+word.replace(/^good /,"good ")+", squirmin' happy and pink all over.",
         "\""+word.charAt(0).toUpperCase()+word.slice(1)+"\" goes straight to "+n+"'s head. They melt, tail waggin' if they've got one.",
         n+" beams up at "+a+", practically purrin' from the praise."]
      : [n+" flushes red to the ears at bein' called a "+word+", and can't quite look "+a+" in the eye. They don't argue, either.",
         "The word \""+word+"\" lands, and "+n+" squirms, cheeks burnin' and thighs pressed together.",
         n+" bites their lip and nods. A "+word+". Yes. That's exactly what they are."];
    emote((praise ? "💗 " : "🥀 ")+lines[Math.floor(Math.random()*lines.length)]);
  }

  /* TITLES */
  function earnedTitle(mn, key){
    const r = rec(mn), p = prodOf(mn); if (!r || !p) return false;
    const t = p.totals || {}, o = p.offspring || {};
    switch (key){
      case "cream":   return (t.milked||0) >= 100000;
      case "dump":    return (t.received||0) >= 50000;
      case "brood":   return (o.litters||0) >= 5;
      case "breeder": return (o.litters||0) >= 10;
      case "bottom":  return ["vulva","butt"].some(h => sizeBase(mn,h) >= CFG.SIZES[h].natural);
      case "throat":  return sizeBase(mn,"throat") >= CFG.SIZES.throat.natural;
      case "stud":    return (t.covers||0) >= 50;
      case "sire":    return (t.sired||0) >= 10;
      case "eggs":    return (o.eggs||0) >= 10;
    }
    return false;
  }
  function checkTitles(mn){
    const r = rec(mn); if (!r) return;
    r.titles = r.titles || [];
    for (const T of CFG.TITLES){
      if (r.titles.includes(T.key) || !earnedTitle(mn, T.key)) continue;
      r.titles.push(T.key); saveLedger(); audit(CFG.BOT_MEMBER, "TITLE", mn+" "+T.key);
      if (onMap(mn)) emote("🎖️ Y'all hear that? "+plainName(mn)+" just earned the title "+T.name+" ("+T.why+"). The farm girl pins a ribbon right on 'em.");
      else tell(mn, "🎖️ You just earned the title "+T.name+" ("+T.why+"), sugar!");
    }
  }
  function titleNames(mn){ const r = rec(mn); return ((r && r.titles) || []).map(k => (CFG.TITLES.find(T => T.key === k)||{}).name).filter(Boolean); }
  function titleTag(mn){ const n = titleNames(mn); return n.length ? " «"+n[n.length-1]+"»" : ""; }

  /* MILK QUOTA: stock that makes milk owes the pail so much a day */
  function quotaOf(mn){
    const r = rec(mn); if (!r || !makesMilk(mn)) return 0;
    if (typeof r.quota === "number") return r.quota;
    return hasRole(mn, ROLE.LIVESTOCK) ? CFG.MILK_QUOTA_ML : 0;
  }
  function milkedOn(mn, d){ const p = prodOf(mn); return p && p.mday && p.mday.day === d ? p.mday.ml : 0; }
  function quotaTick(){
    const today = dayKey();
    if (L.quotaDay === today) return;
    const prev = L.quotaDay; L.quotaDay = today; saveLedger();
    if (!prev) return;
    for (const k in L.people){
      const mn = parseInt(k,10), r = L.people[k], q = quotaOf(mn), p = r.prod;
      if (!q || !p || p.seenDay !== prev) continue;     // only judged on days they were on the farm
      const got = milkedOn(mn, prev);
      if (got >= q){
        r.quotaStreak = (r.quotaStreak||0) + 1;
        const tier = tierOf(mn), up = { new:"trained", trained:"prize" }[tier];
        if (r.quotaStreak >= CFG.QUOTA_STREAK_UP && up){
          r.quotaStreak = 0; r.tier = up; audit(CFG.BOT_MEMBER, "TIER", mn+" → "+up+" (milk quota)");
          tell(mn, "🥛 "+CFG.QUOTA_STREAK_UP+" days in a row on quota! You're "+tierName(up)+" now, sweetie. Good cow.");
          if (onMap(mn)) emote("🎀 "+plainName(mn)+" has filled the pail every day for "+CFG.QUOTA_STREAK_UP+" days, so the farm girl ties a "+tierName(up)+" ribbon on their collar. Such a good, productive cow.");
        } else tell(mn, "🥛 Quota met yesterday ("+ml(got)+" of "+ml(q)+"). That's "+r.quotaStreak+" day"+(r.quotaStreak===1?"":"s")+" in a row, sugar!");
      } else {
        r.quotaStreak = 0; r.naughtyMarks = (r.naughtyMarks||0) + 1;
        tell(mn, "🥛 You only gave "+ml(got)+" of your "+ml(q)+" quota yesterday, sugar. That's a naughty mark ("+r.naughtyMarks+" now). Get yourself milked!");
        if (onMap(mn)) emote("📋 The farm girl taps her clipboard at "+plainName(mn)+": only "+ml(got)+" in the pail yesterday. A naughty mark goes on the board, and those udders get a disappointed little squeeze.");
      }
    }
    saveLedger();
  }

  /* MILK DENIAL: capped teats, nothin' comes out till staff say so */
  function milkDenied(mn){ const p = prodOf(mn); return !!(p && p.milkDeniedUntil > Date.now()); }

  // what a mouthful tastes like: the stud's animal, and how long they've been savin' it
  function seedTaste(stud, pent){
    const k = speciesKey(stud);
    const by = { cow:"rich and creamy", bull:"thick, salty and heavy", horse:"musky and endless", pony:"musky and sweet",
                 dog:"hot, thin and salty", pup:"hot and salty", wolf:"wild and gamey", fox:"sharp and musky",
                 cat:"tangy and sharp", kitt:"tangy", pig:"thick and earthy", goat:"strong and musky", sheep:"mild and creamy",
                 bunny:"sweet and light", rabbit:"sweet and light", deer:"clean and grassy", goblin:"funky and bitter", dragon:"smoky and hot" }[k];
    return "It tastes "+(by || "salty and warm")+(pent ? ", and so thick from bein' pent up it clings to the throat" : "")+".";
  }

  // somebody tried, and the gear said no: tease 'em both (once every couple of minutes per pair)
  function blockedTease(stud, t, hole, item, studSide){
    state.teased = state.teased || new Map();
    const key = stud+":"+t, now = Date.now();
    if (now - (state.teased.get(key)||0) < 120000) return;
    state.teased.set(key, now);
    const where = hole === "mouth" ? "mouth" : hole === "vulva" ? "pussy" : "ass";
    if (studSide){
      if (onMap(stud)) emote("🔒 "+plainName(stud)+"'s cock strains and throbs against "+item+", achin' for "+plainName(t)+"'s "+where+", and can't do a thing about it. Poor thing.");
      return;
    }
    tell(t, "🔒 "+plainName(stud)+" wanted in, sugar, but your "+item+" said no.");
    if (onMap(t)) emote("🔒 "+plainName(stud)+" presses right up against "+plainName(t)+"'s "+where+", only to find "+item+" in the way. So close, and so locked up.");
  }

  // one hole, or two at once for a double cock
  function cumInto(stud, t, holes, R, auto, o2){
    o2 = o2 || {};
    if (holes.length > 1){
      if (!(makesSemen(stud) && typeInfo(stud).double)){ R("Two holes at once takes a double cock, sugar! Pick one, like ?cum "+plainName(t)+" "+holes[0]+". (?penis double, or a double cock shot.)"); return false; }
      for (const h of holes){ const b = holeBlocked(t, h); if (b){ R("Whoa there, hon! "+plainName(t)+"'s "+h+" is blocked by "+b+". That'll have to come off first."); return false; } }
      const first = doCum(stud, t, holes[0], R, auto, Object.assign({ half:true }, o2));
      if (!first) return false;
      doCum(stud, t, holes[1], R, auto, Object.assign({ load:first.rest, pent:first.pent, second:true }, o2));
      return first;
    }
    return doCum(stud, t, holes[0], R, auto, o2);
  }

