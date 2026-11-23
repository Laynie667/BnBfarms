  /* WHAT'S IN THIS FILE (10uo2-books-back.js)
     YOUR BOOKS COME BACK (Nov 23; from the suggestion box, Nikto's #8 and #22: "i accidentally got wiped earlier and it
     reset all the toggles in "farm settings", also of course lost all my ribbons, had to redo the application and lost
     all the stats, achievements and so on"; Laynie: "yes, that seems fair").
     Somebody taken off the books (?unregister, a contract never signed, the farm girl never friended back) keeps their
     paperwork in the archive, but nothin' ever put it back: approved again, they started from nothin'. Now, when staff
     ?approve somebody the archive knows, what was THEIRS comes back before the new application goes on:
       • their ribbons, titles, feats, trophies, album, ink and brands, trained holes, their farm numbers (milk, loads,
         litters…), trap ranks, the marks against them, the passes they'd bought;
       • every switch they'd set (traps, breedin', hypno, potions, teasin', wild traps and the rest), their kinks, their
         words for themselves (species, gender, chest, the name they go by), their kryptonite;
       • their old application, so staff and the farm can see it again.
     Never: roles (staff give those), contracts, herds, keys, or anything that was happenin' to them right then (a trap,
     gear, a parasite, the bench, a roam pass in use). The new application's answers win over the old ones.
  */
  const BOOKS_BACK = ["species", "gender", "chest", "futa", "anthro", "callMe", "nameSet", "herdWord",
    "ribbons", "ribbonsEver", "buys", "roamPasses", "titles", "tier", "feats", "trophies", "album", "tats", "tatSeen", "brand", "branded",
    "holes", "prod", "studForms", "waterForms", "milkCums", "trapRank", "trapN", "trapLog", "wildN", "chainN", "quotaBest",
    "naughtyMarks", "praised", "degraded", "corr", "corrMarks", "corrBy", "corrGrew", "corrBrand", "corrWord", "corrNoise",
    "symbioteN", "parasiteN", "tentacled", "broodWomb", "bredBack",
    "teaseOptIn", "teaseMe", "trapsOn", "trapsOff", "trapKinds", "trapThemesOff", "trapEager", "trapRate", "trapSev", "trapQuiet", "intensity",
    "breedable", "freeuse", "fertile", "naturalHeat", "hypno", "echs", "potionsOn", "daresOn", "benchOn", "parasiteOn", "symbioteOn",
    "praiseMe", "degradeMe", "watersports", "mpreg", "messesOn", "chatlogOn", "jarok", "milkable", "seedMilk", "pinMe",
    "wildIn", "wildLimbs", "wildLaced", "lscgSplat", "stallDial", "ownOutfit", "rateAskOff", "neverCall", "noGroom", "noBed",
    "kryptonite", "kryptoSafe", "limits", "triggers", "aftercare"];
  // what was happenin' to them right then, inside their farm numbers: not brought back
  const PROD_NOW = ["eggs", "preg", "heat", "tieUntil", "tiedTo", "pin", "stall", "lastFill", "scent", "deniedUntil", "milkDeniedUntil", "pentUp", "toyAt"];
  // t: just made a fresh record for them. Returns what came back ({ n, ribbons, feats }) or null
  function booksBack(t){
    const r = rec(t), old = L.archive && L.archive[t];
    if (!r || !old || old === r) return null;
    let n = 0;
    for (const k of BOOKS_BACK){
      if (old[k] === undefined || old[k] === null || old[k] === "") continue;
      r[k] = JSON.parse(JSON.stringify(old[k])); n++;
    }
    if (r.prod){ for (const k of PROD_NOW) delete r.prod[k]; r.prod.held = { vulva: 0, butt: 0, mouth: 0 }; r.prod.boosts = {}; r.prod.last = Date.now(); }   // (empty, not gone: the farm counts on them)
    if (old.application) r.oldApplication = JSON.parse(JSON.stringify(old.application));
    r.booksBackAt = Date.now();
    saveLedger(); audit(CFG.BOT_MEMBER, "BOOKS_BACK", t+" "+n+" kept");
    return { n, ribbons: r.ribbons || 0, feats: r.feats ? Object.keys(r.feats).length : 0 };
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __booksBack: (t) => booksBack(t) });
