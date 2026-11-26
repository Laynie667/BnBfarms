  /* WHAT'S IN THIS FILE (10z9-trap-strip.js)
     TRAPS TAKE CLOTHES (Laynie, Nov 26: "traps should be more liberal with stripping clothing, like for penetrative events
     or ones that mention stripping"; then "yes" to: everything for a line that says clothes come off, whatever's in the
     way for somethin' goin' into them, the top for udders and nipples, bare till they dress themselves, and a line when
     it happens).
     • Every trap line is looked at as it's told (trapRun, 10u-traps.js), the wild traps' too:
         a line that says clothes come off (stripped, peeled off, torn away, left naked or bare)  → everything comes off
         somethin' goin' into them from below                                                     → their bottoms,
             underwear and whatever covers them (skirts, trousers, panties, dresses, outfits, suits, coats)
         their udders, teats or nipples bein' used (milked, suckled, clamped…)                     → their top, bra and
             whatever covers them
       Once each per trap. A line about their mouth alone takes nothin'.
     • Only for those whose Companion has "Farm can strip me" on (0.90.0 and on: older ones only know "everything"), never
       for anybody with strippin' or nudity in their trap limits. Locked pieces stay on, and so do ears, tails, wings and
       the farm's marks (the Companion's stripMe).
     • A short line goes on the end of the trap's own when it happens, namin' what went ("%n's jeans and panties? Yanked
       off and flung into the straw."), only when somethin' really came off.
     • Their clothes are kept on their own computer; nothin' puts them back for them. Their Companion's "My clothes back
       on" (Settings, by "Farm can strip me") does, or the game's wardrobe.
  */
  const STRIP_PARTS = { lower: ["ClothLower", "Panties", "SuitLower", "Suit", "Cloth", "ClothOuter"], top: ["Cloth", "Bra", "Suit", "ClothOuter"] };
  const STRIP_KEEP = /^(HairAccessory\d|TailStraps|Wings)$/;   // (part of who somebody is: never stripped)
  // (it's the line as written, before names go in: %n is the one in the trap, %h the hole it's usin')
  const CLOTH_WORD = "clothes|clothing|outfit|dress|skirt|shirt|blouse|trousers|pants|jeans|shorts|panties|knickers|underwear|bra|uniform|overalls|apron|gown";
  const WHOSE = "(?:their|her|his|%n's|the)";
  const STRIP_ALL_RE = new RegExp("\\b(naked|every stitch|stark bare|bare as the day|left (?:\\w+ )?bare|strip(?:s|ped)? (?:\\w+ )?(?:bare|naked))\\b" +
    "|(?<!\\w)" + WHOSE + "\\s+(?:\\w+\\s+)?(?:" + CLOTH_WORD + ")\\b[^.!?]{0,40}\\b(?:off|away|to shreds|in tatters|torn|ripped|don't last|leave in)\\b" +
    "|\\b(?:strips?|stripped|strippin'|peels?|peeled|peelin'|tears?|tore|tearin'|rips?|ripped|rippin'|cuts?|eats?|ate|eatin'|yanks?|yanked|hauls?|tugs?)(?=\\W|$)[^.!?]{0,25}(?<!\\w)" + WHOSE + "\\s+(?:\\w+\\s+)?(?:" + CLOTH_WORD + ")\\b", "i");
  // (no \b in front of "%n's": "%" isn't a letter, so there's no word edge there to find; "nothin' word-like just before it" instead)
  const HOLE = "(?:cunt|pussy|ass|arse|hole|holes|slit|rump|womb|backside|bum|behind|sex)";
  const ONE = "(?:them|her|him|%n(?!'s)|%h|(?:%n's|their) (?:\\w+ )?(?:%h|" + HOLE + "))";
  const STRIP_PEN_RE = new RegExp("%h|\\b(?:fucks?|fuckin'|fucked|fucking|thrusts? into|penetrat\\w*|ruts? into|bred|breed(?:s|in'|ing)? " + ONE + "|mounts? " + ONE + "|knot(?:s|ted|tin'|ting)? (?:inside|in|into) " + ONE + ")(?=\\W|$)" +
    "|\\b(?:slides?|slid|pushes?|pushed|sinks?|sank|forces?|forced|drives?|drove|works?|worked|rams?|rammed|shoves?|shoved|stuffs?|stuffed|plugs?|plugged|eases?|eased|buries|buried|thrusts?)\\b[^.!?]{0,30}\\b(?:into|inside|up into|up inside) " + ONE + "(?=\\W|$)" +
    "|\\b(?:inside|into) (?:them|%n(?!'s))\\b", "i");
  const STRIP_MOUTH_RE = /\b(mouth|throat|lips|jaw|tongue)\b/i, STRIP_LOWER_RE = /%h|\b(cunt|pussy|ass|arse|hole|holes|slit|rump|womb|backside|bum|behind|between (?:their|her|his) legs|hips|cock|clit|thighs|belly)\b/i;
  const TOP_BODY = "(?:%n's|their)\\s+(?:\\w+\\s+)?(?:udders?|teats?|nipples?|breasts?|tits|boobs|chest)";
  const TOP_ACT = "(?:milk\\w*|suck\\w*|suckl\\w*|pump\\w*|clamp\\w*|squeez\\w*|cups?|cupped|latch\\w*|pinch\\w*|tug\\w*|knead\\w*|grop\\w*|fondl\\w*|lick\\w*|strok\\w*|nurs\\w*|drain\\w*|stripp\\w*|bites?|bitten|twist\\w*)";
  const STRIP_TOP_RE = new RegExp("(?<!\\w)" + TOP_BODY + "\\b[^.!?]{0,30}\\b" + TOP_ACT + "|\\b" + TOP_ACT + "\\b[^.!?]{0,30}(?<!\\w)" + TOP_BODY + "\\b", "i");
  const STRIP_SAY = {
    lower: ["%n's %w? Yanked off and flung into the straw.", "%n's %w? Gone, kicked off somewhere in the straw.", "%n's %w? Torn off and tossed over the rail.", "%n's %w? Dragged down and away, well out of reach."],
    top: ["%n's %w? Pulled off over their head and dropped in the straw.", "%n's %w? Torn open and peeled away, leavin' them bare to the waist.", "%n's %w? Gone, tossed aside so nothin' covers them."],
    all: ["Every stitch %n had on ends up scattered in the straw.", "%n's clothes are gone, every piece, strewn across the floor.", "Nothin' of %n's clothes is left on them: all of it's flung about the place."],
  };
  // what they've got on that the part would take: unlocked clothes, in its slots (everything for "all")
  function stripWorn(C, part){
    const groups = part === "all" ? null : STRIP_PARTS[part];
    return ((C && C.Appearance) || []).filter((it) => {
      const g = it && it.Asset && it.Asset.Group; if (!g) return false;
      if (part === "all" ? !(g.Clothing && !STRIP_KEEP.test(g.Name)) : !groups.includes(g.Name)) return false;
      if (it.Property && it.Property.LockedBy) return false;
      if (it.Asset.Name === "BodyWritings" || it.Asset.Name === "Splatters") return false;
      return true;
    });
  }
  const stripOn = (mn) => { const c = state.companions && state.companions.get(mn); return !!(hasCompanion(mn) && c && c.off && !c.off.strip && verAtLeast(c.ver, "0.90.0")); };
  function stripPart(text, done){
    const t = String(text || "");
    // (not "stripping cups" or "a strip of", and not the lines about clothes left on and just pushed out of the way)
    if (!done.all && STRIP_ALL_RE.test(t) && !/stripping cups|strips? of\b|rucked|pushed aside|pulled aside|hiked up|just enough|just far enough|\bset\w*'? (?:them|%n) off/i.test(t)) return "all";
    if (!done.all && !done.lower && STRIP_PEN_RE.test(t) && !(STRIP_MOUTH_RE.test(t) && !STRIP_LOWER_RE.test(t)) && !/needle|syringe|plunger/i.test(t)) return "lower";
    if (!done.all && !done.top && STRIP_TOP_RE.test(t)) return "top";
    return "";
  }
  // a trap line, as it's told: what it takes off them, and the line about it (already filled in), or ""
  function trapStripLine(mn, kind, text, run){
    try {
      if (!mn || mn === CFG.BOT_MEMBER || !run || !stripOn(mn)) return "";
      const r = rec(mn); if (r && /\b(strip|nud|naked|expos)/i.test(r.limits || "")) return "";
      const done = run.stripped || (run.stripped = {});
      const part = stripPart(text, done); if (!part) return "";
      done[part] = true; if (part === "all"){ done.lower = true; done.top = true; }
      const worn = stripWorn(charFor(mn), part); if (!worn.length) return "";
      if (!bodyMark(mn, { strip: part === "all" ? true : part })) return "";
      const names = Array.from(new Set(worn.map((it) => String(it.Asset.Description || it.Asset.Name || "").toLowerCase().replace(/[()]/g, "").trim()).filter(Boolean))).slice(0, 2);
      const pool = STRIP_SAY[part], line = pool[Math.floor(Math.random() * pool.length)].replace(/%w/g, names.join(" and ") || "clothes");
      return " " + tFill(line, mn);
    } catch(e){ warn("trap strip:", e); return ""; }
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __trapStripPart: (t) => stripPart(t, {}), __trapStripLine: trapStripLine, __stripWorn: stripWorn });
