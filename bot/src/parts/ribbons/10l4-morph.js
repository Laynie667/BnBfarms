  /* WHAT'S IN THIS FILE (10l4-morph.js)
     THE MORPHIN' DRAUGHT (Nov 24, the suggestion box's #29 and #67; Nadine: "allow morphing transformations also, turning
     any pet into proper cattle"; Laynie: "allowing livestock to switch races long term and recieve the relevent outfit.
     Maybe as a shop item?", then "until next morph, buy for self", "and 25 ribbons").
     • ?buy morph <animal>: MORPH.PRICE ribbons, for yourself. Over MORPH.MINS minutes it happens in front of everybody:
       ears first, then the tail, then hooves or paws, then the voice, and then they're that kind for good, till the next
       draught: their milk, their litters, their birthin', the words the farm uses for them, all of it.
     • Their farm outfit follows: somebody the farm's dressed for a contract is dressed again in the new kind's outfit (the
       way a new contract dresses them, 10c-outfits.js). Somebody in their own outfit keeps it.
     • ?species changes WHAT you are for free only the first time (or from a kind the farm doesn't know). After that it's a
       draught (15-commands.js asks morphNeeded). Callin' yourself somethin' else of the same kind ("cow" to "hucow") is
       still free, and staff can still set anybody's.
  */
  if (!CFG.MORPH) CFG.MORPH = { PRICE: 25, MINS: 30 };
  // each kind's ears, tail, feet and voice, for the change
  const MORPH_BITS = {
    cow:    { a: "cow",    ears: "soft, floppy cow ears", tail: "a long cow's tail with a tuft on the end", feet: "hooves", sound: "a long, low moo" },
    bull:   { a: "bull",   ears: "short cow ears and a pair of stubby horns", tail: "a tufted bull's tail", feet: "heavy hooves", sound: "a deep snort" },
    pony:   { a: "pony",   ears: "pert pony ears", tail: "a long, swishin' pony tail", feet: "neat little hooves", sound: "a breathy whinny" },
    horse:  { a: "horse",  ears: "tall horse ears", tail: "a long, flowin' horse's tail", feet: "hooves", sound: "a high whinny" },
    deer:   { a: "deer",   ears: "big, soft deer ears", tail: "a little white flag of a tail", feet: "dainty hooves", sound: "a thin bleat" },
    pig:    { a: "pig",    ears: "floppy pig ears", tail: "a curly pink tail", feet: "trotters", sound: "a happy grunt" },
    pup:    { a: "pup",    ears: "floppy puppy ears", tail: "a waggin' puppy tail", feet: "soft paws", sound: "a yip" },
    dog:    { a: "dog",    ears: "pricked dog ears", tail: "a waggin' tail", feet: "paws", sound: "a bark" },
    kitt:   { a: "kitty",  ears: "soft kitten ears", tail: "a long, curious kitty tail", feet: "little paws", sound: "a mew" },
    cat:    { a: "cat",    ears: "pointed cat ears", tail: "a slinkin' cat's tail", feet: "paws", sound: "a purr" },
    goblin: { a: "goblin", ears: "long, pointy goblin ears", tail: "a skinny green tail with a tuft on the end", feet: "clawed green feet", sound: "a filthy little cackle" },
    bunny:  { a: "bunny",  ears: "long, floppy bunny ears", tail: "a fluffy cotton tail", feet: "big, soft bunny feet", sound: "a little squeak" },
    rabbit: { a: "rabbit", ears: "long rabbit ears", tail: "a fluffy white tail", feet: "big rabbit feet", sound: "a thump of one foot" },
    fox:    { a: "fox",    ears: "big, pointed fox ears", tail: "a thick, bushy fox tail", feet: "black paws", sound: "a sharp yip" },
    wolf:   { a: "wolf",   ears: "pointed wolf ears", tail: "a heavy wolf's tail", feet: "big paws", sound: "a low howl" },
    goat:   { a: "goat",   ears: "floppy goat ears and little curled horns", tail: "a short, flickin' goat tail", feet: "cloven hooves", sound: "a loud bleat" },
    sheep:  { a: "sheep",  ears: "soft sheep ears", tail: "a fluffy little lamb's tail", feet: "neat hooves", sound: "a tremblin' baa" },
    rat:    { a: "rat",    ears: "round pink rat ears", tail: "a long, bare rat's tail", feet: "pink little paws", sound: "a squeak" },
    dragon: { a: "dragon", ears: "swept-back horns and finned ears", tail: "a heavy, scaled tail", feet: "clawed feet", sound: "a rumblin' growl" },
  };
  // in story order: the draught, the ears, the tail, the feet, the voice (and then it's done)
  const MORPH_LINES = {
    drink: ["%n tips back the morphin' draught. It goes down warm and thick and tastes of %was, then of %a, then of nothin' they've got a word for.",
            "%n drains the little bottle in one go and shudders. Somethin' in them has started rewritin' itself, and it's in no hurry.",
            "The draught fizzes on %n's tongue and settles low and warm. The farm girl takes the empty bottle and pats their cheek. \"Won't be long now, sugar.\""],
    ears:  ["%n's ears itch, then burn, then stretch, and by the time they get a hand up there they're %ears.",
            "There's a tug at the sides of %n's head, like somebody's pullin' gently, and when it stops they've got %ears.",
            "%n's ears go hot and soft and start movin' on their own, turnin' after every sound: %ears, and they twitch."],
    tail:  ["Somethin' pushes out at the base of %n's spine and keeps on pushin': %tail, and it's already swishin'.",
            "%n squirms and reaches back, and there's %tail there now, warm and theirs and impossible to keep still.",
            "A tickle low on %n's back turns into %tail, unfurlin' slow, and the whole room watches it happen."],
    feet:  ["%n's hands and feet ache and curl, and when they look down they've got %feet.",
            "%n stumbles, and catches themselves on %feet that weren't there a minute ago.",
            "The ache runs down %n's arms and legs and settles at the ends of them, and when it fades they're standin' on %feet."],
    voice: ["%n opens their mouth to say somethin', and what comes out is %sound. That's it, then: they're %a stock now, through and through.",
            "%n tries to laugh and it comes out as %sound, and the farm girl writes the new kind on their card without a word. %A, for good.",
            "The last of it settles with a shiver, and %n lets out %sound before they can stop it. Every bit %a now."],
  };
  const MORPH_STEPS = [["ears", 0.25], ["tail", 0.5], ["feet", 0.75], ["voice", 1]];
  const morphBits = (k) => MORPH_BITS[k] || { a: k || "animal", ears: "ears that aren't the ones they had", tail: "a tail", feet: "feet that aren't feet any more", sound: "a sound no person makes" };
  function morphLine(mn, key, m){
    const to = morphBits(m.kind), was = morphBits(m.fromKind);
    const v = { ears: to.ears, tail: to.tail, feet: to.feet, sound: to.sound, a: to.a, A: to.a.charAt(0).toUpperCase() + to.a.slice(1), was: m.fromKind ? was.a : "whatever they were" };
    let t = pickFor(mn, "morph:" + key, MORPH_LINES[key]);
    for (const [k, val] of Object.entries(v)) t = t.split("%" + k).join(val);
    return tFill(t, mn);
  }
  // ?species: changin' your KIND takes a draught once you've got one. → a reason to say, or "" (go ahead)
  function morphNeeded(mn, animal){
    const r = rec(mn); if (!r || !r.species) return "";
    const k0 = speciesKey(mn), k1 = speciesKeyOf(String(animal || "").toLowerCase()) || "default";
    if (k0 === "default" || k1 === k0) return "";
    return "🧪 You're "+(MORPH_BITS[k0] ? "a "+MORPH_BITS[k0].a : r.species)+" on the farm's books now, sugar, and changin' what you are takes a morphin' draught: ?buy morph "+String(animal || "<animal>").trim()+", "+perkPrice(mn, CFG.MORPH.PRICE)+" ribbons. "+
      (r.morph ? "You've one workin' on you already." : "Callin' yourself somethin' else of the same kind is still free.");
  }
  // ?buy morph <animal>: → true if it handled the purchase (spent and started), with R told either way
  function morphBuy(mn, text, price, R, done){
    const r = rec(mn), word = String(text || "").toLowerCase().replace(/[^a-z' -]/g, " ").replace(/\s+/g, " ").trim().slice(0, 40);
    if (!word){ R("🧪 A morphin' draught turns you into another kind, for good, till the next one: ?buy morph <animal>, like ?buy morph pig. Over half an hour: ears, tail, hooves or paws, then your voice. "+price+" ribbons."); return; }
    const k = speciesKeyOf(word);
    if (!k || !CFG.SPECIES[k] || k === "default"){ R("🧪 I don't brew one for that, sugar. The kinds: "+Object.keys(MORPH_BITS).filter(x => CFG.SPECIES[x]).join(", ")+"."); return; }
    if (r.morph){ R("🧪 You've already got one workin' on you, sugar. Let it finish."); return; }
    if (r.species && speciesKey(mn) === k){ R("🧪 You're already "+(MORPH_BITS[k] ? "a "+MORPH_BITS[k].a : word)+", sugar. Keep your ribbons. (?species "+word+" changes what you're called, free.)"); return; }
    if (!spendRibbons(mn, price, "a morphin' draught")){ R("That's "+price+" ribbons, sugar, and you've only got "+ribbonsOf(mn)+"."); return; }
    const now = Date.now();
    r.morph = { to: word, kind: k, from: r.species || "", fromKind: r.species ? speciesKey(mn) : "", at: now, until: now + CFG.MORPH.MINS*60000, step: 0 };
    saveLedger(); audit(mn, "MORPH", (r.morph.fromKind || "?")+" > "+k);
    if (charFor(mn)) emote("🧪 "+morphLine(mn, "drink", r.morph), mn);
    done("🧪 Down it goes: "+price+" ribbons. Over the next "+CFG.MORPH.MINS+" minutes you turn "+(MORPH_BITS[k] ? "into a "+MORPH_BITS[k].a : "into "+word)+", for good, till your next draught. ("+ribbonsOf(mn)+" ribbons left)");
  }
  // every heartbeat: the change goes on, a step at a time, and finishes
  function morphTick(){
    const now = Date.now();
    for (const k of Object.keys(L.people)){
      const r = L.people[k], m = r && r.morph; if (!m) continue;
      const mn = Number(k), f = Math.min(1, (now - m.at) / Math.max(1, m.until - m.at));
      while (m.step < MORPH_STEPS.length && f >= MORPH_STEPS[m.step][1]){
        const [key] = MORPH_STEPS[m.step]; m.step++;
        if (key === "voice") morphDone(mn, r, m);
        else if (charFor(mn)) emote("🧪 "+morphLine(mn, key, m), mn);
        saveLedger();
      }
    }
  }
  function morphDone(mn, r, m){
    r.species = m.to; r.morph = null;
    if (charFor(mn)) emote("🧪 "+morphLine(mn, "voice", m), mn);
    else tell(mn, "🧪 While you were away, the draught finished its work: you're "+(MORPH_BITS[m.kind] ? "a "+MORPH_BITS[m.kind].a : m.to)+" now, for good, till your next one.");
    audit(mn, "MORPHED", m.kind);
    // dressed by the farm for a contract: the new kind's outfit, the way a new contract dresses them (10c-outfits.js)
    try {
      if (r.contractDressedAt && !r.ownOutfit){ const slot = outfitSlotFor(mn); if (slot){ r.contractDressedAt = 0; r.outfitOwed = { slot, at: Date.now() }; later(() => contractOutfitNow(mn), 2500); } }
    } catch(e){ warn("morph outfit:", e); }
    saveLedger(); syncCompanions(true);
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __morphTick: () => morphTick(), __morphNeeded: (mn, a) => morphNeeded(mn, a), __morphBits: () => MORPH_BITS });
