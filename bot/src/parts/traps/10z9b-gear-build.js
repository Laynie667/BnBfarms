  /* WHAT'S IN THIS FILE (10z9b-gear-build.js)
     PROGRESSIVE RESTRAINTS (Sera's idea, passed on by Laynie, Nov 26: "traps and wild traps doing 'progressive
     restraints', which is to say the equipment builds a outfit over several traps"; Laynie's answers: "for the species,
     or atleast themed and complimenting their species and gender", and how it comes off: "iii toggleable").
     • ?traps build on|off (the Companion's "Progressive restraints" switch), off till they say so, and like all trap gear
       only with "Farm can put real gear on me" on. While it's on, every trap that lets go of them leaves the next piece of
       an outfit (a wild trap two), and the pieces stay and add up: light to heavy, the collar first, the hood last.
     • The outfit suits their kind and body: DAIRY (cows, bulls, goats, sheep, pigs), PONY (horses, ponies, deer), PUP (dogs,
       wolves, foxes), KITTY (cats, lions, tigers), HUTCH (bunnies, rats, mice), RUBBER for everyone else. Udder cups or bell
       clamps for those with tits, a locked belt for those without, a tail to match their kind (never over a tail of their
       own).
     • How it comes off, their pick (?traps build free | hour | both, the Companion's three buttons):
         free   only when somebody ELSE takes a piece off them, piece by piece (like a wild trap's kit)
         hour   an hour after the last piece, if no trap adds another (nobody can take it off before)
         both   whichever comes first (the default)
       Their safeword, ?traps build off, or ?traps off take it all off at once.
     • Every piece on: a closin' line, and the set holds (no more pieces) till it's come off; then the next trap starts a
       fresh one.
     • Never a piece of a kind on their "Gear the farm leaves off me" list (their Companion's noSlots, and gearOn won't
       either): the set skips to its next piece.
  */
  const BUILD_HOUR_MIN = 60;
  const BUILD_SETS = {
    dairy: { title: "dairy tack", pieces: (b) => [
      { slot: "collar", label: "Dairy Collar", items: ["LeatherCollarBell", "LeatherCollar"], desc: "A wide leather dairy collar with a ring at the front, buckled snug. It says whose stock this is.", say: "A wide leather collar buckles round %n's neck, snug, with a ring at the front. Dairy stock now." },
      { slot: "tag", label: "Cowbell", items: ["CollarCowBell"], desc: "A brass cowbell hung from the collar ring. Every step, every squirm, every buck of the hips, it clanks.", say: "A brass cowbell clips onto %n's collar ring. Every move they make, it clanks." },
      { slot: "nose", label: "Nose Ring", items: ["NoseRing"], desc: "A steel ring through the nose, the way you lead a stubborn heifer. A tug on it and the head follows.", say: "A steel ring snaps through %n's nose, the way you lead a stubborn heifer." },
      { slot: "arms", label: "Dairy Cuffs", items: ["LeatherCuffs"], desc: "Heavy leather wrist cuffs with steel rings, made to clip to a stall rail.", say: "Heavy leather cuffs buckle round %n's wrists, rings ready for a stall rail." },
      { slot: "feet", label: "Hobbles", items: ["LeatherAnkleCuffs"], desc: "Ankle cuffs with a short chain between: room to shuffle to the milker, no room to run.", say: "Hobbles lock round %n's ankles: room to shuffle, no room to run." },
      { slot: "hands", label: "Hoof Mitts", items: ["HoofMittens"], desc: "Hard leather hoof mitts laced over both hands. No fingers, no grip, just hooves.", say: "Hoof mitts lace over %n's hands. No more fingers, just hooves." },
      b.tits ? { slot: "cups", label: "Udder Cups", items: ["LactationPump", "NippleSuctionCups"], desc: "Glass milking cups sucked onto the teats and left there pulling, so this udder never quite gets to rest.", say: "Milking cups latch onto %n's teats with a greedy pull, and they're left there, workin'." }
             : { slot: "belt", label: "Bull Lock", items: ["MetalChastityBelt", "SteelChastityPanties"], desc: "Steel locked over the cock: this bull's for breedin' when the farm says, and not before.", say: "Steel locks over %n's cock. This bull gets used when the farm says, and not before." },
      { slot: "tail", label: "Cow Tail", items: ["CowtailStrap"], own: "TailStraps", desc: "A long tufted cow's tail strapped on, swishing whenever they shift.", say: "A tufted cow's tail is strapped onto %n, and it swishes every time they shift." },
      { slot: "gag", label: "Feed Bit", items: ["BitGag", "HarnessPonyBits"], desc: "A rubber bit strapped between the teeth. Moos get out. Words don't.", say: "A rubber bit is strapped between %n's teeth. Moos get out. Words don't." },
      { slot: "hood", label: "Heifer Hood", items: ["LeatherHoodSealed", "LatexHood"], desc: "A snug leather hood that shuts out the barn, so all that's left is the bell, the cups and the waitin'.", say: "A snug leather hood goes over %n's head and shuts out the barn. All that's left is the bell and the waitin'." },
    ] },
    pony: { title: "pony tack", pieces: (b) => [
      { slot: "collar", label: "Posture Collar", items: ["LeatherCollar"], desc: "A stiff posture collar that keeps the chin up, the way a show pony carries it.", say: "A stiff posture collar buckles round %n's neck and lifts their chin, the way a show pony carries it." },
      { slot: "torso", label: "Pony Harness", items: ["LeatherHarness"], desc: "A strap harness over chest and ribs, rings at every crossing, ready for reins or a cart shaft.", say: "A strap harness goes on over %n's chest and ribs, rings at every crossin', ready for reins." },
      { slot: "boots", label: "Hoof Boots", items: ["PonyBoots", "HoofBoots"], desc: "Tall hoof boots laced to the knee. They prance or they fall over.", say: "Tall hoof boots are laced up %n's legs. Now they prance, or they fall over." },
      { slot: "hands", label: "Hoof Mitts", items: ["HoofMittens"], desc: "Hard leather hoof mitts laced over both hands. Ponies don't need fingers.", say: "Hoof mitts lace over %n's hands. Ponies don't need fingers." },
      { slot: "gag", label: "Bridle Bit", items: ["HarnessPonyBits", "BitGag"], desc: "A steel bit and bridle, the reins hanging loose for whoever wants to steer.", say: "A bit's worked between %n's teeth and the bridle buckled on, reins hangin' loose for whoever wants to steer." },
      b.vulva ? { slot: "plug", label: "Mare's Tail", items: ["HorsetailPlug"], desc: "A long horsehair tail on a plug, seated deep, swishing with every step a mare takes.", say: "A horsehair tail is worked into %n on its plug, and it swishes with every step the mare takes." }
              : { slot: "tail", label: "Stallion's Tail", items: ["HorseTailStrap"], own: "TailStraps", desc: "A long horsehair tail strapped on, swishing behind a stallion as he's led about.", say: "A long horsehair tail is strapped onto %n, swishin' behind them as they're led about." },
      b.tits ? { slot: "cups", label: "Show Bells", items: ["BellClamps"], desc: "A pair of little bells clamped on the nipples, jingling at every trot.", say: "Little show bells are clamped onto %n's nipples, and they jingle at every trot." }
             : { slot: "belt", label: "Stallion Lock", items: ["MetalChastityBelt", "SteelChastityPanties"], desc: "Steel locked over the cock: a stud doesn't cover anything the farm hasn't picked.", say: "Steel locks over %n's cock. A stud doesn't cover anythin' the farm hasn't picked." },
      { slot: "arms", label: "Armbinder", items: ["LeatherArmbinder", "Armbinder"], desc: "A single leather sleeve laced from elbows to wrists behind the back.", say: "A leather sleeve is laced up %n's arms behind their back, elbows to wrists." },
      { slot: "hood", label: "Pony Hood", items: ["PonyHood"], desc: "A leather pony hood with ears and blinkers, so they only see straight ahead, where the reins point.", say: "A leather pony hood with blinkers goes over %n's head. They see straight ahead now, where the reins point." },
    ] },
    pup: { title: "kennel gear", pieces: (b) => [
      { slot: "collar", label: "Pup Collar", items: ["PetCollar", "LeatherCollar"], desc: "A sturdy pet collar with a ring for the lead, buckled one hole too snug.", say: "A sturdy pet collar buckles round %n's neck, one hole too snug." },
      { slot: "tag", label: "Bone Tag", items: ["CollarPupBone"], desc: "A bone-shaped tag on the collar ring, so everybody knows a good pup when they see one.", say: "A bone-shaped tag clinks onto %n's collar. Everybody knows a good pup when they see one." },
      { slot: "leash", label: "Lead", items: ["CollarLeash"], desc: "A leather lead clipped to the collar, ready for whoever wants to walk them.", say: "A lead clips onto %n's collar, ready for whoever wants to walk them." },
      { slot: "hands", label: "Paw Mitts", items: ["PawMittens"], desc: "Padded paw mitts laced over the hands. No fingers, just paws.", say: "Padded paw mitts lace over %n's hands. Just paws now." },
      { slot: "feet", label: "Ankle Cuffs", items: ["LeatherAnkleCuffs"], desc: "Leather ankle cuffs with rings, ready to clip to a kennel post.", say: "Leather cuffs buckle round %n's ankles, rings ready for a kennel post." },
      { slot: "gag", label: "Muzzle", items: ["MuzzleGag", "DogMuzzleExposed"], desc: "A strapped muzzle. Whines and barks get out. Words don't.", say: "A muzzle's strapped over %n's mouth. Whines and barks get out. Words don't." },
      { slot: "plug", label: "Pup Tail", items: ["PuppyTailPlug"], desc: "A curly pup's tail on a plug, seated deep, wagging whenever they wiggle.", say: "A pup's tail is worked into %n on its plug. It wags whenever they wiggle." },
      b.tits ? { slot: "cups", label: "Bitch's Bells", items: ["BellClamps"], desc: "Little bells clamped on the nipples, so everybody hears when the bitch moves.", say: "Little bells are clamped onto %n's nipples, so everybody hears when they move." }
             : { slot: "belt", label: "Kennel Lock", items: ["MetalChastityBelt", "SteelChastityPanties"], desc: "Steel locked over the cock: no humpin' anything the kennel master hasn't picked.", say: "Steel locks over %n's cock. No humpin' anythin' the kennel master hasn't picked." },
      { slot: "legs", label: "Pup Pads", items: ["PawPaddedPetsuitLegs"], desc: "Padded leather sleeves that fold the legs and hold them that way: on all fours, where a pup belongs.", say: "Padded sleeves fold %n's legs and hold them that way: on all fours, where a pup belongs." },
      { slot: "hood", label: "Dog Hood", items: ["DogHood"], desc: "A snug dog hood with ears and a snout. Whatever's under it is just a pup now.", say: "A snug dog hood goes over %n's head, ears and snout and all. Whatever's under it is just a pup now." },
    ] },
    kitty: { title: "kitty kit", pieces: (b) => [
      { slot: "collar", label: "Kitty Collar", items: ["LeatherCollarBell", "PetCollar"], desc: "A soft collar with a bell that tinkles every time they move.", say: "A soft collar with a bell is buckled round %n's neck. It tinkles every time they move." },
      { slot: "cups", label: "Bell Clamps", items: ["BellClamps"], desc: "Little bells clamped on the nipples, tinkling along with the collar.", say: "Little bells are clamped onto %n's nipples, tinklin' along with the collar." },
      { slot: "hands", label: "Paw Mitts", items: ["PawMittens"], desc: "Padded paw mitts laced over the hands. Kitties knead. They don't grab.", say: "Padded paw mitts lace over %n's hands. Kitties knead. They don't grab." },
      { slot: "feet", label: "Ankle Cuffs", items: ["LeatherAnkleCuffs"], desc: "Leather ankle cuffs with rings, for a kitty who won't stay put.", say: "Leather cuffs buckle round %n's ankles, for a kitty who won't stay put." },
      { slot: "plug", label: "Kitten Tail", items: ["KittenTail1"], desc: "A long kitten's tail on a plug, seated deep, twitching at the tip whenever they squirm.", say: "A long kitten's tail is worked into %n on its plug. The tip twitches whenever they squirm." },
      { slot: "gag", label: "Kitty Gag", items: ["KittyGag"], desc: "A kitty-faced gag strapped on. Mews get out. Words don't.", say: "A kitty-faced gag is strapped over %n's mouth. Mews get out. Words don't." },
      b.cock && !b.vulva ? { slot: "belt", label: "Tom's Lock", items: ["MetalChastityBelt", "SteelChastityPanties"], desc: "Steel locked over the cock: no tomcattin' about.", say: "Steel locks over %n's cock. No tomcattin' about." } : null,
      { slot: "blind", label: "Kitty Blindfold", items: ["KittyBlindfold"], desc: "A soft blindfold with cat-eyes drawn on the front. They can't see who's petting.", say: "A soft blindfold with cat eyes drawn on goes over %n's eyes. They can't see who's pettin'." },
      { slot: "arms", label: "Armbinder", items: ["LeatherArmbinder", "Armbinder"], desc: "A single leather sleeve laced from elbows to wrists behind the back.", say: "A leather sleeve is laced up %n's arms behind their back, elbows to wrists." },
      { slot: "hood", label: "Kitty Hood", items: ["KittyHood"], desc: "A snug kitty hood with ears. Whatever's under it just purrs now.", say: "A snug kitty hood with ears goes over %n's head. Whatever's under it just purrs now." },
    ] },
    hutch: { title: "hutch gear", pieces: (b, sp) => [
      { slot: "collar", label: "Hutch Collar", items: ["PetCollar", "LeatherCollar"], desc: "A little pet collar, buckled snug, with a ring for a tag.", say: "A little pet collar buckles snug round %n's neck." },
      { slot: "tag", label: "Hutch Tag", items: ["CollarNameTagPet", "CollarNameTagLivestock"], desc: "A tag on the collar ring with a hutch number stamped on it.", say: "A tag with a hutch number stamped on it clips onto %n's collar." },
      { slot: "hands", label: "Mitts", items: ["PaddedLeatherMittens", "LeatherMittens"], desc: "Padded mitts laced over the hands. Little paws, nothin' more.", say: "Padded mitts lace over %n's hands. Little paws now, nothin' more." },
      { slot: "feet", label: "Ankle Cuffs", items: ["LeatherAnkleCuffs"], desc: "Leather ankle cuffs. No more hoppin' off.", say: "Leather cuffs buckle round %n's ankles. No more hoppin' off." },
      /rat|mouse|mice|hamster/i.test(sp) ? { slot: "plug", label: "Little Tail", items: ["MouseTail1"], desc: "A long thin tail on a plug, seated deep, trailing behind them.", say: "A long thin tail is worked into %n on its plug, trailin' behind them." }
                                         : { slot: "plug", label: "Cottontail", items: ["BunnyTailPlug1"], desc: "A fluffy cottontail on a plug, seated deep, bobbing whenever they hop.", say: "A fluffy cottontail is worked into %n on its plug. It bobs whenever they move." },
      { slot: "gag", label: "Carrot Gag", items: ["HarnessBallGag1", "BallGag"], color: "#E8731A", desc: "An orange ball gag strapped in. Nibbles and squeaks get out. Words don't.", say: "An orange ball gag is strapped into %n's mouth. Squeaks get out. Words don't." },
      b.tits ? { slot: "cups", label: "Bell Clamps", items: ["BellClamps"], desc: "Little bells clamped on the nipples, jingling at every hop.", say: "Little bells are clamped onto %n's nipples, jinglin' at every hop." }
             : { slot: "belt", label: "Hutch Lock", items: ["MetalChastityBelt", "SteelChastityPanties"], desc: "Steel locked over the cock: no breedin' like rabbits unless the farm says.", say: "Steel locks over %n's cock. No breedin' like rabbits unless the farm says." },
      { slot: "blind", label: "Blindfold", items: ["LeatherBlindfold"], desc: "A leather blindfold. They only hear who's coming.", say: "A leather blindfold goes over %n's eyes. They only hear who's comin' now." },
      { slot: "arms", label: "Armbinder", items: ["LeatherArmbinder", "Armbinder"], desc: "A single leather sleeve laced from elbows to wrists behind the back.", say: "A leather sleeve is laced up %n's arms behind their back, elbows to wrists." },
      { slot: "hood", label: "Hutch Hood", items: ["LeatherHoodSealed", "LatexHood"], desc: "A snug leather hood. The hutch is dark and quiet now.", say: "A snug leather hood goes over %n's head. It's dark and quiet in the hutch now." },
    ] },
    rubber: { title: "rubber", pieces: (b) => [
      { slot: "collar", label: "Rubber Collar", items: ["LeatherCollar"], color: "#121214", desc: "A thick black collar, buckled snug, shiny as wet tar.", say: "A thick black collar buckles snug round %n's neck, shiny as wet tar." },
      { slot: "arms", label: "Rubber Cuffs", items: ["LeatherCuffs"], color: "#121214", desc: "Black cuffs with steel rings round both wrists.", say: "Black cuffs with steel rings close round %n's wrists." },
      { slot: "feet", label: "Ankle Cuffs", items: ["LeatherAnkleCuffs"], color: "#121214", desc: "Black ankle cuffs with steel rings.", say: "Black ankle cuffs close round %n's ankles." },
      { slot: "mitts", label: "Rubber Mitts", items: ["LatexBondageMitts"], desc: "Shiny rubber mitts that ball the hands into smooth useless fists.", say: "Shiny rubber mitts are pulled over %n's hands and ball them into smooth, useless fists." },
      { slot: "suit", label: "Catsuit", items: ["LatexCatsuit"], color: "#121214", desc: "A skin-tight black catsuit, neck to toe, squeaking at every move.", say: "A skin-tight black catsuit is wriggled up over %n, neck to toe, squeakin' at every move." },
      b.tits ? { slot: "cups", label: "Suction Cups", items: ["NippleSuctionCups"], desc: "Clear suction cups over the nipples, drawing them long and dark.", say: "Clear suction cups are pressed over %n's nipples and draw them long and dark." }
             : { slot: "belt", label: "Rubber Lock", items: ["MetalChastityBelt", "SteelChastityPanties"], desc: "Steel locked over the cock, under the rubber.", say: "Steel locks over %n's cock, under the rubber." },
      { slot: "gag", label: "Ball Gag", items: ["HarnessBallGag1", "BallGag"], color: "#121214", desc: "A black ball gag strapped in tight.", say: "A black ball gag is strapped in tight behind %n's teeth." },
      { slot: "blind", label: "Blindfold", items: ["LatexBlindfold", "LeatherBlindfold"], desc: "A rubber blindfold, smooth and tight.", say: "A rubber blindfold's pulled smooth and tight over %n's eyes." },
      { slot: "earplugs", label: "Earplugs", items: ["HeavyDutyEarPlugs", "LightDutyEarPlugs"], desc: "Earplugs pushed in deep. The farm goes muffled and far away.", say: "Earplugs are pushed deep into %n's ears. The farm goes muffled and far away." },
      { slot: "hood", label: "Rubber Hood", items: ["LatexHood"], desc: "A tight rubber hood that seals the last of them away.", say: "Last, a tight rubber hood seals the last of %n away." },
    ] },
  };
  const BUILD_KIND = [[/cow|bull|\box\b|oxen|heifer|cattle|goat|sheep|ewe|\bram\b|lamb|pig|sow|boar|hog|swine/i, "dairy"],
    [/horse|pony|mare|stallion|deer|\bdoe\b|stag|zebra|unicorn|donkey/i, "pony"], [/dog|pup|wolf|fox|coyote|hound|jackal|vixen/i, "pup"],
    [/\bcat\b|kitt|lion|tiger|lynx|leopard|panther|cheetah|feline/i, "kitty"], [/bunny|rabbit|hare|\brat\b|mouse|mice|hamster/i, "hutch"]];
  function buildKindOf(mn){ const sp = String((rec(mn) || {}).species || ""); const k = BUILD_KIND.find(([re]) => re.test(sp)); return k ? k[1] : "rubber"; }
  function buildPieces(mn, kind){ const sp = String((rec(mn) || {}).species || ""); return BUILD_SETS[kind].pieces(bodyOf(mn), sp).filter(Boolean); }
  const buildModeOf = (mn) => { const m = (rec(mn) || {}).buildMode; return m === "free" || m === "hour" ? m : "both"; };
  const buildOn = (mn) => { const r = rec(mn); return !!(r && r.buildOn && isSubject(mn)); };
  // their Companion's switch for real gear, and its list of kinds the farm leaves off them
  function gearAllowed(mn){ const c = state.companions && state.companions.get(mn); return !!(hasCompanion(mn) && c && c.off && !c.off.gear); }
  function gearBlocked(mn, slot){ const c = state.companions && state.companions.get(mn); return !!(c && Array.isArray(c.noSlots) && c.noSlots.includes(slot)); }
  // a trap let go of them: the next piece (a wild trap: two)
  function buildAfterTrap(mn, n){
    if (!buildOn(mn) || !gearAllowed(mn) || !charFor(mn)) return;
    const r = rec(mn), now = Date.now(), mode = buildModeOf(mn);
    r.gear = r.gear || {};
    const live = Object.keys(r.gear).filter((s) => r.gear[s].src === "build" && r.gear[s].until > now);
    if (r.build && !live.length) r.build = null;   // (it all came off: the next trap starts a fresh one)
    if (r.build && r.build.done) return;
    const kind = (r.build && BUILD_SETS[r.build.kind]) ? r.build.kind : buildKindOf(mn);
    if (!r.build) r.build = { kind, i: 0, at: now, n: 0 };
    const pieces = buildPieces(mn, kind), C = charFor(mn), worn = new Set(((C && C.Appearance) || []).map((it) => it && it.Asset && it.Asset.Group && it.Asset.Group.Name));
    const mins = mode === "free" ? CFG.WILD.KEEP_DAYS * 1440 : BUILD_HOUR_MIN, said = [];
    for (let k = 0; k < n; k++){
      let p = null;
      while (r.build.i < pieces.length){
        const c = pieces[r.build.i++];
        if (gearBlocked(mn, c.slot)) continue;                                  // (a kind on their leave-off list)
        if (c.own && worn.has(c.own)) continue;                                 // (never over a tail of their own)
        const held = r.gear[c.slot];
        if (held && held.until > now && held.src !== "build" && (held.keep || held.src === "wild")) continue;   // (a wild kit's piece there already)
        p = c; break;
      }
      if (!p) break;
      if (gearOn(mn, p.slot, p.label, p.desc, mins, "build", { items: p.items, color: p.color, keep: mode !== "hour", quiet: true })){ r.build.n++; said.push(tFill(p.say, mn)); }
    }
    // every piece of it holds from the last one on (an hour, or till somebody else frees them, or both)
    r.build.at = now;
    buildRetime(mn);
    const left = pieces.slice(r.build.i).some((c) => !gearBlocked(mn, c.slot) && !(c.own && worn.has(c.own)));
    if (!left && r.build.n){
      r.build.done = true; r.fitted = (r.fitted || 0) + 1;
      said.push(tFill("That's the whole of it: %n's done up head to toe in the farm's " + BUILD_SETS[kind].title + ", every piece of it on. " +
        (mode === "free" ? "It'll take somebody else to undo any of it." : mode === "hour" ? "It holds for the hour, and nobody's takin' it off before." : "It holds an hour, or till somebody else undoes it."), mn));
    }
    saveLedger(); syncCompanions(true);
    if (said.length) emote("🔗 " + said.join(" "), mn);
  }
  // every piece on them, held their way: an hour from the last piece (hour, both), and only somebody else can free them
  // (free, both); a change of their pick takes on the pieces they're already wearin' too
  function buildRetime(mn){
    const r = rec(mn); if (!r || !r.gear || !r.build) return;
    const mode = buildModeOf(mn), until = mode === "free" ? Date.now() + CFG.WILD.KEEP_DAYS * 86400000 : (r.build.at || Date.now()) + BUILD_HOUR_MIN * 60000;
    for (const s of Object.keys(r.gear)) if (r.gear[s].src === "build"){ r.gear[s].until = until; if (mode === "hour") delete r.gear[s].keep; else r.gear[s].keep = true; }
  }
  // it all comes off (the safeword, ?traps build off, ?traps off)
  function buildLetGo(mn){ const r = rec(mn); if (!r) return; r.build = null; gearOff(mn, null, "build"); }
  // ?traps build on|off|free|hour|both
  const BUILD_MODES = { free: "only when somebody else takes it off you, piece by piece", hour: "an hour after the last piece, if no trap adds another (nobody can take it off before)",
    both: "an hour after the last piece, or when somebody else takes it off you, whichever comes first" };
  function buildCommand(sender, args, R){
    const r = rec(sender), v = String(args[1] || "").toLowerCase();
    if (!r){ R("You'll need to be on the farm's books first, sugar."); return; }
    if (v === "on" || v === "off"){
      r.buildOn = v === "on"; if (!r.buildOn) buildLetGo(sender); saveLedger(); syncCompanions(true);
      R(r.buildOn ? "🔗 Progressive restraints: ON for you. Every trap that lets you go leaves the next piece of an outfit that suits your kind (a wild trap two), and they stay and add up, collar first, hood last. They come off " + BUILD_MODES[buildModeOf(sender)] + " (?traps build free|hour|both to change that). Your safeword takes it all off. Needs \"Farm can put real gear on me\" on, and never puts on a kind of gear on your leave-off list."
        : "🔗 Progressive restraints: off for you. Whatever they'd put on you comes off now.");
      return;
    }
    if (BUILD_MODES[v]){ r.buildMode = v; buildRetime(sender); saveLedger(); syncCompanions(true); R("🔗 Progressive restraints come off " + BUILD_MODES[v] + " now" + (r.build ? ", the pieces on you already too." : ".")); return; }
    const b = r.build, kind = (b && b.kind) || buildKindOf(sender);
    R("🔗 Progressive restraints: " + (r.buildOn ? "on" : "off") + " for you. They come off " + BUILD_MODES[buildModeOf(sender)] + ". " +
      (b ? "Your " + BUILD_SETS[kind].title + ": " + b.n + " piece" + (b.n === 1 ? "" : "s") + " on" + (b.done ? ", the whole set." : " so far.") : "Your set would be the farm's " + BUILD_SETS[kind].title + ".") +
      " ?traps build on|off · ?traps build free|hour|both");
  }
  // the panel: what's on, and how it comes off
  function buildStateFor(mn, s){
    const r = rec(mn); if (!r) return;
    s.buildMode = buildModeOf(mn);
    if (r.build && r.buildOn){ const kind = r.build.kind; s.build = { title: BUILD_SETS[kind] ? BUILD_SETS[kind].title : "", n: r.build.n, of: buildPieces(mn, kind).length, done: !!r.build.done }; }
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __buildKind: buildKindOf, __buildPieces: buildPieces, __buildAfterTrap: buildAfterTrap, __gearBlocked: gearBlocked });
