  /* WHAT'S IN THIS FILE (10u9-mess-store.js)
     Messes off the shelf (Laynie, Oct 15: "store messes so i can creampie other players and such"). ?buy one for
     yourself, or ?buy <mess> for <who> to put it on somebody else. They're asked first, unless they've said
     ?messes on (anybody may mess me up, no askin'). Their Companion draws it on them ("Farm can mark my body" on),
     and the room hears how it happened. It's only the look: a creampie from the shelf is no breedin'.
       creampie · facial · cream pie · cake smash · honey · maple · chocolate · strawberry · slime · mud · milk · piss
     Piss needs both of you on ?watersports. A mess they've ruled out in their limits stays on the shelf.
  */
  const MESS_SHELF = [
    { id: "creampie",    mess: "cum",        where: ["tummy", "tummy"], name: "A creampie",            price: 2, limit: /\b(creampie|cum|seed|breed)/i, desc: "Filled up and left drippin' down the thighs." },
    { id: "facial",      mess: "cum",        where: ["face", "forehead"], name: "A facial",           price: 2, limit: /\b(facial|cum|bukkake)/i, desc: "A hot load right across the face." },
    { id: "mess-pie",    mess: "cream",      where: ["face", "forehead"], name: "A cream pie in the face", price: 1, limit: /\b(food|messy|splosh|pie)/i, desc: "Splat. Whipped cream and pie crust, right in the kisser." },
    { id: "mess-cake",   mess: "cake",       where: ["face", "chest"], name: "A cake smash",          price: 2, limit: /\b(food|messy|splosh|cake)/i, desc: "A whole frosted cake, sprinkles and all, smushed on." },
    { id: "mess-honey",  mess: "honey",      where: ["chest", "tummy"], name: "A honey drizzle",       price: 1, limit: /\b(food|messy|honey)/i, desc: "Slow and golden and very sticky." },
    { id: "mess-maple",  mess: "maple",      where: ["chest", "tummy"], name: "A maple syrup pour",    price: 1, limit: /\b(food|messy|syrup)/i, desc: "Dark sweet syrup, runnin' everywhere." },
    { id: "mess-choc",   mess: "chocolate",  where: ["chest", "tummy"], name: "A chocolate sauce pour", price: 1, limit: /\b(food|messy|chocolate)/i, desc: "Warm chocolate, poured slow." },
    { id: "mess-berry",  mess: "strawberry", where: ["chest", "tummy"], name: "A strawberry syrup pour", price: 1, limit: /\b(food|messy|syrup)/i, desc: "Bright red and sweet, drippin' down." },
    { id: "mess-slime",  mess: "slime",      where: ["face", "chest", "tummy"], name: "A bucket of slime", price: 2, limit: /\b(slime|goo|messy)/i, desc: "Green, cold, wobbly, everywhere." },
    { id: "mess-mud",    mess: "mud",        where: ["face", "chest", "tummy"], name: "A mud bath",      price: 1, limit: /\b(mud|filth|messy)/i, desc: "A bucket from the wallow, straight over the head." },
    { id: "mess-milk",   mess: "milk",       where: ["chest", "face"], name: "A pail of milk",         price: 1, limit: /\b(milk|messy)/i, desc: "Fresh from the parlour, over their head." },
    { id: "mess-piss",   mess: "piss",       where: ["face", "chest", "tummy"], name: "A golden shower", price: 2, limit: /\b(piss|pee|water ?sports|urin)/i, ws: true, desc: "Both of you need ?watersports on." },
  ];
  for (const it of MESS_SHELF) STORE_BASE.push(Object.assign({ shelf: "mess" }, it));
  const MESS_DO = {
    creampie: {
      self: ["%b squats over a bucket of the farm's best, and when they stand up, it's runnin' down the insides of their thighs.",
             "%b gets themselves good and filled at the stud stall, and walks out drippin' with every step."],
      other: ["%b pins %t down in the straw, buries deep, and fills them till it spills, then pulls out slow to watch it run down %t's thighs.",
              "%b takes %t from behind against the rail and empties into them, deep and hot, and holds there while %t squirms. When %b pulls out it comes with them.",
              "%b bends %t over a hay bale and breeds them hard and messy, and leaves them creamed and drippin' onto the straw.",
              "%b fills %t up, slow and thorough, and then spreads them open with two fingers just to watch it leak out."],
    },
    facial: {
      self: ["%b kneels at the stud stall with their mouth open and comes away with a face full, drippin' off the chin."],
      other: ["%b strokes themselves over %t's upturned face and finishes across it, cheek to brow, thick and hot.",
              "%b grabs %t by the hair, holds them still and paints their face, every pulse landin' on the last.",
              "%b makes %t kneel and keep their eyes open, and gives them a facial they'll be wipin' off for an hour."],
    },
    "mess-pie": { self: ["%b shoves a cream pie in their own face and comes up laughin', cream to the ears."],
                  other: ["SPLAT. %b plants a cream pie square in %t's face and gives it a good twist for luck.", "%b sneaks up on %t with a cream pie and the whole barn hears the splat.", "%b holds %t's chin and smushes a cream pie into their face, slow, makin' sure every bit lands."] },
    "mess-cake": { self: ["%b faceplants into a whole frosted cake, on purpose, and comes up covered in frostin' and sprinkles."],
                   other: ["%b smashes a whole birthday cake into %t's face and down their front, sprinkles everywhere.", "%b gives %t a cake smash they'll never forget, frostin' in the hair and down the cleavage.", "%b shoves %t face first into a cake on the table, then smears what's left down their chest."] },
    "mess-honey": { self: ["%b drizzles a pot of honey over themselves, slow and golden, and licks their fingers."],
                    other: ["%b tips a pot of honey over %t, slow, and watches it creep down every curve.", "%b drizzles honey over %t's chest and belly, and has a taste."] },
    "mess-maple": { self: ["%b pours maple syrup over their own chest and lets it run."], other: ["%b upends a jug of maple syrup over %t's shoulders and lets it run.", "%b glazes %t in maple syrup like a stack of pancakes."] },
    "mess-choc": { self: ["%b pours warm chocolate down their own front, slow and glossy."], other: ["%b pours warm chocolate sauce down %t's front, slow and glossy.", "%b paints %t with chocolate sauce, then licks a long stripe of it off."] },
    "mess-berry": { self: ["%b squeezes strawberry syrup over themselves, bright red and sticky."], other: ["%b squeezes a bottle of strawberry syrup over %t, red drippin' everywhere.", "%b drizzles strawberry syrup over %t and adds a cherry on top."] },
    "mess-slime": { self: ["%b tips a bucket of slime over their own head and shivers as it oozes down."], other: ["%b dumps a whole bucket of green slime over %t's head. It goes everywhere.", "%b creeps up behind %t with a bucket of slime, and %t's shriek fills the barn."] },
    "mess-mud": { self: ["%b flops into the wallow and comes up brown from head to toe."], other: ["%b upends a bucket of wallow mud over %t, head to toe.", "%b tackles %t into the mud and rolls them in it good."] },
    "mess-milk": { self: ["%b pours a pail of fresh milk over their own head."], other: ["%b tips a pail of fresh milk over %t's head, and it runs white down everything.", "%b soaks %t with a whole pail of milk from the parlour."] },
    "mess-piss": { self: ["%b stands in the trough and gets themselves good and soaked."], other: ["%b stands over %t and lets go, hot and golden, soakin' them through.", "%b marks %t properly, a long hot stream from the face down.", "%b has %t kneel and hosts them a golden shower, and doesn't miss a spot."] },
  };
  const messFill = (t, by, to) => t.replace(/%b/g, plainName(by)).replace(/%t/g, plainName(to));
  function messWhyNot(it, sender, to){
    const r = rec(to); if (!r) return plainName(to)+" isn't on the books, sugar.";
    if (it.limit && it.limit.test(String(r.limits || ""))) return plainName(to)+"'s limits rule that one out.";
    if (/\bmess(y|es)?\b/i.test(String(r.limits || "")) && to !== sender) return plainName(to)+" doesn't want messes, sugar.";
    if (it.ws && !(rec(sender).watersports && r.watersports)) return "That one needs you both on ?watersports, sugar.";
    if (!onMap(to)) return plainName(to)+" isn't here, hon.";
    return null;
  }
  function messApply(it, sender, to){
    const pool = MESS_DO[it.id] || {}, lines = to === sender ? pool.self : pool.other;
    if (lines && lines.length) emote("🛍️ "+messFill(lines[Math.floor(Math.random()*lines.length)], sender, to), to);
    try { bodyMark(to, Object.assign({ splat: it.where.slice(), mess: it.mess, amount: it.mess === "cum" ? 1.6 : 1.4 }, MESS[it.mess] ? { color: MESS[it.mess] } : it.mess === "piss" ? { color: CFG.PISS_COLOR } : {})); } catch(e){ warn("mess store:", e); }
    if (it.id === "creampie") later(() => { try { bodyMark(to, { splat: ["tummy"], mess: "cum", amount: 1.2 }); } catch(e){} }, 1200);   // and it runs
    try { const tp = prodOf(to); if (tp){ tp.painted = { areas: Array.from(new Set(((tp.painted && tp.painted.until > Date.now()) ? tp.painted.areas : []).concat(it.where))), until: Date.now() + CFG.PAINT_H*3600000, by: sender }; } } catch(e){}
    arouse(to, it.mess === "cum" ? 25 : 10);
  }
  // ?buy <mess> [for <who>]
  function messBuy(it, sender, forWho, price, R, done){
    const to = forWho || sender, why = messWhyNot(it, sender, to);
    if (why){ R(why); return; }
    if (to === sender || rec(to).messesOn){
      spendRibbons(sender, price, it.name+(to === sender ? "" : " for "+plainName(to)));
      messApply(it, sender, to);
      done("🛍️ "+it.name+(to === sender ? "" : " for "+plainName(to))+". ("+ribbonsOf(sender)+" ribbons left)");
      return;
    }
    R("🛍️ I've asked "+plainName(to)+" if they'll take your "+it.name.replace(/^an? /i, "")+". You only pay if they say yes.");
    farmAsk(to, "🛍️ "+plainName(sender)+" wants to give you "+it.name.toLowerCase()+" ("+it.desc+") Say yes or no. (?messes on and nobody needs to ask.)", (yes) => {
      if (!yes){ tell(sender, "🛍️ "+plainName(to)+" said no to your "+it.name.replace(/^an? /i, "")+", sugar. Your ribbons are still yours."); return; }
      if (messWhyNot(it, sender, to)){ tell(sender, "🛍️ "+plainName(to)+" isn't here for it anymore, hon."); return; }
      if (!spendRibbons(sender, price, it.name+" for "+plainName(to))){ tell(sender, "You didn't have the ribbons anymore, hon."); return; }
      messApply(it, sender, to); done();
    });
  }
  // ?messes on|off: anybody may mess me up without askin'
  function messesCommand(sender, args, R){
    const r = rec(sender); if (!r){ R("You're not on the books yet, sugar."); return; }
    const a = String(args[0] || "").toLowerCase();
    if (a === "on" || a === "off"){ r.messesOn = a === "on"; saveLedger(); R(a === "on" ? "🛍️ Messes on: anybody can buy a mess off the shelf and put it on you, no askin'. Your limits still count, and ?wash cleans you up." : "🛍️ Messes off: you'll be asked first, every time."); return; }
    R("🛍️ Messes off the shelf ("+(r.messesOn ? "ON: no askin'" : "off: you're asked first")+"). "+MESS_SHELF.map(it => it.id.replace(/^mess-/, "")+" "+it.price+"🎀").join(", ")+". ?buy <one> for <who>. ?messes on|off.");
  }
