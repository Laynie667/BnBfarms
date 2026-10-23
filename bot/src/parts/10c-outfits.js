  /* WHAT'S IN THIS FILE (10c-outfits.js)
     Outfits and uniforms: slots by species × gender, fallbacks, who holds the keys to farm locks,
     offerin' an outfit to someone's Companion, savin' one a proprietor is wearin'.
  */
  /* ═══════════ OUTFITS & UNIFORMS ═══════════
     A proprietor dresses themselves (clothes, restraints, and locks on whatever should be locked) and
     saves it from their Companion. I keep it in the ledger and offer it to folks' Companions:
     "Put on your farm outfit? Yes / Not now". They put it on themselves, so the game always allows it,
     and every lock that was in the saved outfit becomes a high security padlock keyed to the farm.

     Slots: "cow|female" (species|gender), "cow|*", "*|femboy", "stock" (anybody), "uniform:farmhand",
     "uniform:mandated", "uniform:herdmaster", "uniform:proprietor", "special:<name>". */
  const OUTFIT_MAX_CHARS = 60000;
  function outfitsLedger(){
    L.outfits = L.outfits || {};
    L.outfitRules = Object.assign({ onApprove: true, onClockIn: true, changeBack: true, keys: "staff" }, L.outfitRules || {});
  }
  // the gender an outfit goes by: what they told us, else what their body says
  function genderOf(mn){ const r = rec(mn) || {}; return r.gender || (r.futa ? "futa" : hasVulva(mn) ? "female" : "male"); }
  function outfitSlotFor(mn){
    outfitsLedger();
    const r = rec(mn) || {}, sp = String(r.species || "").toLowerCase(), g = genderOf(mn);
    return [sp+"|"+g, sp+"|*", "*|"+g].find(k => L.outfits[k]) || (farmOutfit("farm:"+sp+"|"+g) ? "farm:"+sp+"|"+g : null) || (L.outfits.stock ? "stock" : null);
  }
  // the farm's own starter outfit for a species and gender (shared/farm-outfits.js, Oct 22): fills every slot no proprietor
  // has dressed yet, and a proprietor's own saved outfit always wins. "farm:cow|female" → { data, items, locks }
  function farmOutfit(slot){
    const m = /^farm:([a-z]+)\|([a-z]+)$/.exec(String(slot || "")); if (!m) return null;
    const pieces = FARM_OUTFITS.outfitPieces(m[1], m[2]); if (!pieces || !W.LZString) return null;
    const items = pieces.map(p => ({ Group: p.Group, Name: p.Name, Color: p.Color, Property: p.Property ? JSON.parse(JSON.stringify(p.Property)) : {}, locked: !!p.locked }));
    return { data: W.LZString.compressToBase64(JSON.stringify({ v: 1, items })), items: items.length, locks: items.filter(i => i.locked).length, farm: true };
  }
  function uniformSlotFor(mn){
    outfitsLedger();
    const order = isProprietor(mn) ? ["proprietor","herdmaster","farmhand"] : hasRole(mn, ROLE.HERDMASTER) ? ["herdmaster","farmhand"]
                : isMandated(mn) ? ["mandated","farmhand"] : ["farmhand"];
    return order.map(x => "uniform:"+x).find(k => L.outfits[k]) || null;
  }
  // who holds the keys to a farm lock on them
  function outfitKeysFor(mn){
    outfitsLedger();
    const leader = herdLeaderOf(mn), owners = CFG.PROPRIETORS.slice();
    const staff = Object.keys(L.people).map(Number).filter(m => isStaff(m));
    const k = L.outfitRules.keys === "owners" ? owners : L.outfitRules.keys === "leader" ? (leader ? [leader] : owners) : staff.concat(leader ? [leader] : []);
    return Array.from(new Set(k.concat([CFG.BOT_MEMBER]))).filter(m => m !== mn).slice(0, 100);
  }
  // "cow female" → cow|female · "cow any" → cow|* · "any femboy" → *|femboy · "stock" · "farmhand" → uniform:farmhand · "luxury" → special:luxury
  function outfitSlotFrom(words){
    const w = words.map(x => String(x).toLowerCase()).filter(Boolean);
    if (!w.length) return null;
    if (w[0] === "stock" || w[0] === "default") return "stock";
    if (["farmhand","mandated","herdmaster","proprietor"].includes(w[0])) return "uniform:"+w[0];
    if (w[0] === "special" && w[1]) return "special:"+w[1].replace(/[^a-z0-9_-]/g,"");
    if (w.length >= 2){
      const sp = w[0] === "any" ? "*" : speciesFrom(w[0]), g = w[1] === "any" ? "*" : w[1];
      if (sp && (g === "*" || GENDERS.includes(g)) && !(sp === "*" && g === "*")) return sp+"|"+g;
    }
    if (/^[a-z][a-z0-9_-]{1,19}$/.test(w[0]) && !speciesFrom(w[0])) return "special:"+w[0];
    return null;
  }
  const slotLabel = (k) => k.startsWith("farm:") ? "farm "+k.slice(5).split("|").map(x => x === "kitt" ? "kitty" : x).join(" · ")+" outfit" : k === "stock" ? "Any new stock" : k.startsWith("uniform:") ? k.slice(8)+" uniform" : k.startsWith("special:") ? k.slice(8)
                         : k.split("|").map(x => x === "*" ? "any" : x).join(" · ");

  function offerOutfit(mn, slot, why, auto){
    outfitsLedger();
    const o = slot && (L.outfits[slot] || farmOutfit(slot));
    if (!o) return "There's no outfit saved for that, sugar. ?outfit shows what's saved.";
    if (!hasCompanion(mn)){
      // they still hear about it, so nothin' happens behind their back
      tell(mn, "👗 The farm has your "+slotLabel(slot)+" ready"+(why ? " ("+why+")" : "")+". The Companion can put it on you in one tap; without it, staff can help you dress by hand.");
      return plainName(mn)+" isn't runnin' the Companion, so I can't hand 'em an outfit. I've told 'em it's ready, and they can dress by hand.";
    }
    enqueue(makeMsg("outfit", { slot, label: slotLabel(slot), data: o.data, keys: outfitKeysFor(mn), why: why || "", auto: !!auto, id: ++companionSeq }, mn));
    audit(CFG.BOT_MEMBER, "OUTFIT_OFFER", mn+" "+slot);
    return "";
  }
  // a proprietor's Companion sent what they're wearin'
  function saveOutfit(mn, m){
    if (!isProprietor(mn)){ toCompanion(mn, "Savin' farm outfits is for the proprietors, sugar.", "reply"); return; }
    const slot = String(m.slot || ""), data = String(m.data || "");
    if (!/^(stock|uniform:[a-z]+|special:[a-z0-9_-]{2,20}|[a-z*][a-z0-9 _*-]{0,30}\|[a-z*]+)$/.test(slot)){ toCompanion(mn, "That's not a slot I know, sugar.", "reply"); return; }
    if (!data || data.length > OUTFIT_MAX_CHARS){ toCompanion(mn, "That outfit came through empty or too big to keep, hon.", "reply"); return; }
    outfitsLedger();
    L.outfits[slot] = { data, items: Math.max(0, m.items|0), locks: Math.max(0, m.locks|0), by: mn, at: Date.now() };
    saveLedger(); audit(mn, "OUTFIT_SAVE", slot);
    toCompanion(mn, "👗 Saved "+slotLabel(slot)+": "+(m.items|0)+" pieces"+((m.locks|0) ? ", "+(m.locks|0)+" locked" : "")+".", "reply");
    later(() => syncCompanions(true), 500);
  }
  // their Companion tells me what happened, so staff and the room know
  function outfitAnswer(mn, m){
    if (m.answer === "worn"){
      audit(mn, "OUTFIT_WORN", String(m.slot||""));
      if (onMap(mn)) emote("👗 "+plainName(mn)+" changes into "+(String(m.slot||"").startsWith("uniform:") ? "their farm uniform" : "their farm outfit")+(m.locks ? ", and the padlocks click shut" : "")+".");
    } else if (m.answer === "declined") audit(mn, "OUTFIT_DECLINED", String(m.slot||""));
    else if (m.answer === "back") audit(mn, "OUTFIT_BACK", "");
  }


  // ?ownoutfit on|off: they bring their own outfit, and keep the look they came in when they sign a contract
  function ownOutfitCommand(sender, args, R){
    const r = rec(sender); if (!r){ R("You need to be on the books first, sugar."); return; }
    const a = String(args[0] || "").toLowerCase();
    if (a !== "on" && a !== "off"){ R("👗 Bring your own outfit is "+(r.ownOutfit ? "ON: the farm won't dress you for a contract, you keep your own look" : "off: your first contract dresses you in the farm's outfit for your kind")+". ?ownoutfit on|off."); return; }
    r.ownOutfit = a === "on"; saveLedger(); syncCompanions(true);
    R(r.ownOutfit ? "👗 Bring your own outfit: ON. Sign a contract and you stay in the look you came in. Staff can still offer you one, and you can say no."
                  : "👗 Bring your own outfit: off. "+(r.contractDressedAt ? "You've had your farm outfit already, so nothin' changes unless staff offer you one." : "Your first contract dresses you in the farm's outfit for your kind."));
  }