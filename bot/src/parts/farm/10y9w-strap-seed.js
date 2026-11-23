  /* WHAT'S IN THIS FILE (10y9w-strap-seed.js)
     A STRAP-ON LOADED WITH SOMEBODY'S SEED (Nov 23; Alexia's ask, through Laynie: "making the strapons capable of using
     the crafters cum when arousal is high enough for climax"; Laynie: "Imagine Alexia and a denied sub both using me, but
     only Alexia's seed is going in me, thats kind of the idea").
     • A strap-on crafted with the breeding gear's words in its name or description ("breeding", "seeding", "breeder", or
       "full of Alexia's seed" and the like: the same words the Dispensary's breeding gear takes) carries its CRAFTER's
       seed, whoever wears it, and whether the crafter's here or not.
     • Its wearer fucks somebody with it (the game's own Penetrate, in a pussy, ass or mouth): the farm girl marks it, the
       same as a stud's scene.
     • When the wearer gets to the edge (their arousal at CFG.STRAP_EDGE, the game's meter), it pumps: the crafter's seed,
       a real load with the crafter's real potency, in the hole it's in. Their species, their sire's line, a catch on the
       crafter's books, the scent, the tally, eggs from a draconic crafter: everything a load from the crafter would do.
       A denied wearer held at the edge keeps it pumpin', once every CFG.STRAP_AGAIN_S; one who drops back down and climbs
       again sets it off again.
     • The one bein' filled: their own breedin' switches, the same as for any stud (?breedable, their limits, free use or
       a yes to the crafter's seed). Asked if they haven't said yes, with the crafter's name and the wearer's.
     • An amount in the craft ("breeding strap-on, 300 ml") is what it gives; otherwise the crafter's own good load.
       It doesn't drain the crafter: the toy carries its own.
  */
  if (CFG.STRAP_EDGE === undefined) CFG.STRAP_EDGE = 90;        // the wearer's arousal (0-100) that sets it off
  if (CFG.STRAP_REARM === undefined) CFG.STRAP_REARM = 70;      // drop under this and climb again: it goes again
  if (CFG.STRAP_AGAIN_S === undefined) CFG.STRAP_AGAIN_S = 120; // held at the edge (denied): again every this many seconds
  if (CFG.STRAP_IN_MIN === undefined) CFG.STRAP_IN_MIN = 4;     // it's still "in" this long after the last thrust
  const STRAP_ASSET = /strap-?on/i;
  const STRAP_WORDS = /\b(breeding|seeding|breeder)\b/i;
  const strapText = (it) => { const c = it && it.Craft; return c ? (String(c.Name || "") + " " + String(c.Description || "")).replace(/_+/g, " ") : ""; };
  // the seeded strap-on this wearer has on, if it's the one they used: { crafter, name, text, size } or null
  function seededStrap(wearer, assetName, groupName){
    if (!assetName || !STRAP_ASSET.test(assetName)) return null;
    const C = charFor(wearer); if (!C || !Array.isArray(C.Appearance)) return null;
    const it = C.Appearance.find(a => a && a.Asset && a.Asset.Name === assetName && (!groupName || (a.Asset.Group && a.Asset.Group.Name === groupName)));
    if (!it || !it.Craft) return null;
    const text = strapText(it);
    if (!STRAP_WORDS.test(text) && !DOSE_WORDS.seed.test(text.toLowerCase())) return null;
    const crafter = Number(it.Craft.MemberNumber) || 0;
    if (!crafter) return null;
    return { crafter, cname: String(it.Craft.MemberName || "") || ("#" + crafter), name: String(it.Craft.Name || assetName).slice(0, 40), text };
  }
  // how much it gives: what the craft says, or the crafter's own good load (their cock's kind pumps more or less)
  function strapLoad(crafter, text){
    let ml = 0;
    try { const a = seedAmounts(text); ml = a.any || a.vulva || a.butt || a.mouth || 0; } catch(e){}
    if (!ml){
      const sp = prodOf(crafter), T = makesSemen(crafter) ? typeInfo(crafter) : CFG.PENIS_TYPES.human;
      ml = Math.max(SEED_DEFAULT_ML, (sp && sp.semen || 0) * CFG.PROD.LOAD_SHARE) * ((T && T.loadX) || 1);
    }
    return Math.max(5, Math.min(ml, 1000));
  }
  // from onBodyActivity (09-roleplay.js): the wearer's strap-on went into somebody. true: it's a seeded one (handled)
  function strapSeen(wearer, t, hole, assetName, groupName){
    const S = seededStrap(wearer, assetName, groupName); if (!S) return false;
    if (S.crafter === t) return true;   // their own seed straight back into them: nothin' to breed
    state.straps = state.straps || new Map();
    const now = Date.now(), was = state.straps.get(wearer);
    const fresh = !was || was.t !== t || was.hole !== hole || now - was.lastSeen > CFG.STRAP_IN_MIN*60000;
    state.straps.set(wearer, Object.assign(was && !fresh ? was : { at: now, lastFire: 0, armed: true }, { crafter: S.crafter, cname: S.cname, name: S.name, text: S.text, t, hole, lastSeen: now }));
    if (fresh){
      const known = rec(S.crafter) && makesSemen(S.crafter);
      emote("🐂 "+plainName(wearer)+" is in "+plainName(t)+"'s "+(hole === "mouth" ? "throat" : holeText(hole))+" with "+S.name+", and it's loaded with "+
        (known ? plainName(S.crafter) : S.cname)+"'s seed. The farm girl marks it in the stud book.");
      if (!known) whisper(wearer, "🐂 That one says it's loaded, sugar, but "+S.cname+" isn't a stud on the farm's books, so it's got nothin' real to give. Once they are, it will.");
    }
    strapCheck(wearer);   // (already at the edge when they slid it in)
    return true;
  }
  // the wearer's arousal moved (the room's ChatRoomSyncArousal, a thrust, or the heartbeat): at the edge, it pumps
  function strapCheck(wearer, progress){
    const sc = state.straps && state.straps.get(wearer); if (!sc) return false;
    const now = Date.now();
    if (now - sc.lastSeen > CFG.STRAP_IN_MIN*60000 || !onMap(wearer) || !onMap(sc.t)){ state.straps.delete(wearer); return false; }
    const a = typeof progress === "number" ? progress : arousalOf(wearer);
    if (a < CFG.STRAP_REARM) sc.armed = true;
    if (a < CFG.STRAP_EDGE) return false;
    if (!sc.armed && now - sc.lastFire < CFG.STRAP_AGAIN_S*1000) return false;
    if (!rec(sc.crafter) || !makesSemen(sc.crafter)) return false;
    const r = strapPump(wearer, sc);
    if (r === "asked") return false;   // (askin' doesn't use the edge up: a yes, and it goes at once)
    sc.armed = false; sc.lastFire = now;
    return r;
  }
  function strapPump(wearer, sc){
    const t = sc.t, crafter = sc.crafter, rt = rec(t);
    if (!rt || !rt.breedable || limitBlocks(t)) return false;   // their switches: not breedable, nothin' goes in
    if (!breedConsent(crafter, t)){ askBreed(crafter, t, sc.hole, wearer); return "asked"; }
    const r = doCum(crafter, t, sc.hole, () => {}, true, { load: strapLoad(crafter, sc.text), strap: { wearer, name: sc.name } });
    return !!r;
  }
  function strapTick(){
    if (!state.straps) return;
    for (const w of [...state.straps.keys()]) { try { strapCheck(w); } catch(e){ warn("strap-on:", e); } }
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __strapSeen: strapSeen, __strapCheck: strapCheck, __straps: () => state.straps, __strapLoad: strapLoad });
