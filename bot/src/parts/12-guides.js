  /* ───────────── text ───────────── */

  const TEXT = {};

  TEXT.help = `🌾 THE FARM OFFICE · B&B FARM 🌾
Well hey there, %name%! I'm the gal behind the desk. 💕

📮 HOW TO REACH ME
  🗣️ Say ?command out loud on the farm (- ! and . work too)
  💬 Whisper me, if you're close by
  🔔 Beep me from anywhere, gagged or not
  🤖 /bot <command>, like /bot rules
  If you're here on the map I whisper back; if you're away I beep.

🔴 IF YOU NEED HELP
  ?safe stops everything · ?stuck if you're wedged
  ?staff asks for a hand · ?report <what> tells staff quietly

📚 GUIDES · say ?help and a topic, like ?help breeding
  Gettin' started
    start · safety · keys · herds · tiers
  Milk & breedin'
    barn · breeding · pregnancy · heat
  Bodies
    body · cocks · shots
  Farm life
    life · fair
  Everything
    me (every command you can use)`;

  TEXT.staffhelp = `🌾 STAFF GUIDES · say ?help and a topic, like ?help herd 🌾

📖 People
  books      applications, the roster, records
  herd       claimin', releasin', callin' your herd
  stock      tiers, stocks, vet cards, brands, tease lines
🥛 The barn
  barnstaff  milkin', collectin', jars, denial, heat
🗺️ The farm
  lifestaff  spots, leash walks, the tour
  work       clockin' in, chores, hours
  play       the prize wheel, beggin', judgin' the fair
🔑 Access
  keysstaff  grantin' and checkin' keys
  oncall     summons and bein' on call
👑 Proprietors
  setup      first-time farm setup
  owner      proprietor-only commands

Everything works out loud with ?, by whisper, by beep or with /bot.
Wherever a guide says <who>, a name or a member number both work.`;

  // ?help <topic>. Same layout everywhere: COMMANDS first, then GOOD TO KNOW.
  // Keep each under ~1,700 characters so it fits in two messages.
  const GUIDES = {
    start: `🌾 NEW HERE? WELCOME, SUGAR! 🌾

STEP BY STEP
  1. ?tour · I walk you round the farm, stop by stop (?tour stop ends it)
  2. ?rules and ?consent · short, and they really matter
  3. ?friend · puts me on your friend list so you can beep me from anywhere
  4. ?apply · twelve questions (fifteen for staff). Say skip to pass one,
     or quit to stop. Take all the time you need.
  5. Staff read every application. Once you're approved your keys go live.

HANDY RIGHT AWAY
  ?record · your file      ?keys · what you can open
  ?who · who's on the farm  ?species · what we keep
  ?help me · every command you can use

Stuck on anything? ?help safety`,

    safety: `🔴 SAFETY 🔴

COMMANDS
  ?safe (or ?red, ?safeword) · everything stops, right now
  ?stuck · wedged in a wall or behind a door
  ?staff · asks for a hand, no fuss
  ?report <what happened> · tells staff quietly
     e.g. ?report someone ignored my limits in the barn

GOOD TO KNOW
  • ?safe calls it out loud, fetches staff and on-call hands, drops any
    leash, ends a tour, lets you out of the stocks, and frees you for
    half an hour if you're too full to move. You never owe a reason.
  • ?stuck calls staff, or pulls you out myself if nobody's around.
  • All of these work by beep too, gagged or bound, with no cooldown.
  • They only cover the farm. In another room, use the club's own
    safeword and that room's admins.`,

    keys: `🔑 KEYS & STANDING 🔑

COMMANDS
  ?keys · what you're holdin'
  ?doors · what opens what
  ?record · your file

THE KEYS
  🥉 Bronze · the safe room in the back of the barn. Stock, guests, staff.
  🥈 Silver · staff rooms and medical. Staff while they're on duty.
  🥇 Gold · the security wing. Proprietors, and herdmasters they trust.

GOOD TO KNOW
  • Your keys follow your standing and update all by themselves.
  • Bronze is yours to keep, day or night. Curfew never takes it.
  • Staff: ?pasture turns you out to graze (bronze only) till ?onduty.`,

    herds: `🐄 HERDS 🐄

COMMANDS
  ?herd · your own herd, if you keep one
  ?herd <who> · somebody else's, like ?herd Daisy
  ?herd <who> <species> · just one kind, like ?herd Daisy cow
  ?record · who you belong to

GETTIN' CLAIMED
  • A staffer asks with ?claim and I check with you. Say yes or no.
    Nobody goes in a herd without sayin' yes, sweetie.
  • Temporary claims run out on their own. Permanent ones last till
    your leader lets you go, and only your leader can release you.

GOOD TO KNOW
  • Staff keep herds and pick their own word: herd, pack, pride, flock…
    Proprietors hold 20, herdmasters 15, farmhands 10.
  • Stock can belong to several herds; staff answer to one leader.
  • Your leader can call you, walk you on a lead, and brand you.`,

    tiers: `🎀 TIERS & THE STOCKS 🎀

THE TIERS, lowest to highest
  ⛓️ Degraded · 🔻 Naughty · punishment, set and lifted by staff
  🌱 New stock · where everybody starts
  🎀 Trained · 🏆 Prize · staff move you up

COMMANDS
  ?record · your tier      ?board · this week's top producers
  ?beg <the words> · knocks a quarter off your stocks time
  ?teaseme on|off · let staff tease lines name you

MAKIN' PRIZE
  • Staff say so, top producer or best milk of the week, best in show
    at a fair, or 5 days in a row on your milk quota.

TITLES
  • Earned for milestones (Cream Queen, Brood Mother, Bottomless,
    Stud of the Farm…). Shown on ?who and ?stats.

THE STOCKS
  • A drop to naughty or degraded can come with time in the stocks.
  • Wander off and I'll scoot you right back, sugar.
  • Your safeword always lets you out.`,

    barn: `🥛 THE BARN 🥛

COMMANDS
  ?stats · your milk, semen, sizes, how full you are
  ?board · today's and this week's yield, and top sires
  ?milkable on|off · make milk (stock does by default)
  ?futa on|off · make milk and semen both
  ?quota · your daily milk quota and streak

GETTIN' MILKED
  • Stand in a milkin' stall and it drains you a little at a time,
    or a staffer milks you by hand.
  • Nursin': emote somebody suckin' or drinkin' from your nipples or
    breasts (or the game's Suck or Nibble). About 300 mL, no grade hit,
    and it builds your supply. Too much leaves the drinker milk-drunk.
  • Everybody sees milkin' and nursin' as a room emote.

FILLIN' UP
  • Milk and semen fill by the hour, even while you're away. Cows fill
    twice as fast; pregnancy and a fresh birth faster still.
  • Full for a whole day and you start leakin', and everybody sees it.

QUOTA · stock owes the pail 1 L a day (staff can change yours)
  • 5 days in a row on quota moves you up a tier; a miss is a
    naughty mark. Only days you're on the farm count.
  • Capped teats (staff ?nomilk) mean no milkin' at all till it's up.

MILK GRADE (A+ to D) · the average of your last 5 milkin's
  Helps: milked every 6–16 hours, higher tier, fresh birth, heat,
         a lactation shot or item
  Hurts: milked again inside 2 hours, left over 36 hours, leakin'
         for a day, a punishment tier`,

    breeding: `🐂 BREEDING 🐂

OPT IN FIRST · nobody gets bred who hasn't, sweetie
  ?breedable on|off · you can be bred and filled
  ?fertile on|off · you can catch (separate on purpose)
  ?freeuse on|off · any stud may have you without askin'
  ?yes / ?no · answer a stud who asked (whisper or beep works too)
  ?tally on|off · your tally marks on ?who and the board
  ?wash · clean off a paintin'
  ?praise on|off · ?degrade on|off · let staff's words count
  Hard limits always win.

COMMANDS · whoever sends it is the stud
  ?breed <who> [hole] · opens a scene (name one or more)
  ?breed status · your scene, and when your next load's ready
  ?breed stop · closes it (it closes itself after 2 quiet hours)
  ?cum <who> [hole] · finish by hand, e.g. ?cum Bessie butt
  ?rights · breedin' rights, see ?help pregnancy

HOLES
  vulva (pussy) · butt (ass, anal) · mouth (throat, oral)
  Leave it out and it's vulva. A double cock can say vulva+butt.
  ?cum <who> face (tits, belly, back, ass, hair…) paints 'em.

ROLEPLAY IT
  • Not free use? I ask them first, and the scene opens on their yes.
  • With a scene open, say cum, orgasm, breed, fill them up… in your
    own chat or emotes and I fill 'em, once a minute (30s for canine
    and draconic). Name the hole (deep in her ass) to pick it, or say
    all over her face, tits, belly… to paint 'em instead. Pounds or
    rough stretches 'em extra; slow or gentle doesn't stretch at all.
  • The game's Penetrate, or someone ridin' your cock, opens the scene.
  • Fills, breedin' and conception show as room emotes, and everyone
    involved has to be here on the map.

BLOCKED?
  • A cage on the cock, or a belt, plug or gag on the hole (ring gags
    and piercings are fine). I tease you both about it, too.

THE LOAD
  • Past capacity it spills. It drains on its own: vulva halves every
    12h, butt 6h, mouth 1h. ?help cocks for knots and cumflation.`,

    pregnancy: `🍼 PREGNANCY & BREEDIN' RIGHTS 🍼

COMMANDS
  ?fertile on|off · whether you can catch
  ?species <animal> · sets your litter size and fertility
  ?species list · every animal and its numbers
  ?pedigree [who] · the stud book
  ?rights <who> [days] · ask for breedin' rights (a week by default)
  ?accept · say yes when somebody asks you
  ?rights · yours · ?rights off · ends it
  ?rights <who> allow <stud> · let another stud in (or disallow)
  ?rights <who> days <n> · change how long it lasts

HOW YOU CATCH
  • Every vulva load rolls the dice. Heat triples the odds, a knot tie
    or the breedin' stand helps, and Saturday is rut day: fills are
    twice as likely to take and studs get pent up twice as fast.
  • A second stud in the first day can add a second sire.
  • Under breedin' rights, only the holder's loads (and studs they
    allow) can take you.

WHILE YOU'RE EXPECTIN'
  • Due in 5 days. Your belly shows on ?stats and ?measure, and your
    udder swells a cup.
  • Here on the farm when you're due? Your water breaks and you're in
    labour for 45 minutes, with the herd invited, then the litter
    comes (male, female or futa) and your milk comes in strong.
  • Not milkable? I'll ask if you want your milk to come in.

EGGS · ?eggs on|off
  • A draconic stud's load can leave a clutch of 2 to 6 eggs (likelier
    when tied). You lay 'em 2 to 3 days later, right on the farm.`,

    heat: `🔥 HEAT 🔥

COMMANDS
  ?naturalheat on|off · come into heat on your own every 7 days
  ?stats · shows how long your heat has left

HOW IT STARTS
  • Staff call it, a heat shot, or naturally if you've turned that on.

WHILE YOU'RE IN HEAT · 12 hours
  • I whisper you when it starts and your leader hears about it.
  • Everybody sees heat emotes now and then.
  • You're three times as likely to catch.
  • Studs within 2 tiles of you get pent up twice as fast. Ooh-wee!

HOW IT ENDS
  • On its own, a suppressant shot, or staff break it.
  • Hard limits that rule it out stop it cold.`,

    shots: `💉 SHOTS & TAGGED ITEMS 💉

I read words in a crafted item's name or description, like LSCG does.

INJECTORS · use Inject on someone
  Production
    lactation · milk doubles for a day
    virility · semen doubles for a day
    fertility · catchin' doubles for a day
    contraceptive · no catchin' for two days
    heat inducer · heat now  ·  suppressant · heat ends
  Capacity
    stretching / capacity · +250 mL for good (up to 50 L)
    reducing / shrinking · −500 mL, spills the extra
  Sizes · a part plus a grow or shrink word, either order
    parts: breasts (tits, udder) · balls · cock (penis) · knot ·
      pussy · ass (anal) · throat
    grow: grow, growth, enlarger, swell, gape, stretch, trainer…
    shrink: shrink, reducer, tightener, restorer…
    e.g. "Shrink Penis", "Grow Balls", "Big Tit Growth Serum",
    "Pussy Stretching Shot". Each one is a step, with a room emote.
  Cocks · canine, equine, feline (barbed), draconic, double cock,
    humanizer, knotting, knot remover · see ?help cocks

WORN ITEMS
  • lactation, virility, fertility · smaller boosts while worn
  • capacity or stretching · +100 mL while worn
  • stretcher, stretching, gaper, dilator or trainer in the vulva,
    butt or mouth slot · opens that hole a level right away, and
    trains it looser for good every 12 hours worn

GOOD TO KNOW
  • Shots are the only way into ✨hyper sizes.
  • ?shotlog (staff) shows what I read off recent shots.`,

    body: `📏 BODY SIZES 📏

COMMANDS
  ?size · your sizes (only the parts you've got)
  ?size <part> <size> · set one, e.g. ?size udder DD · ?size penis 9
  ?measure · I measure you out loud for the room
  ?futa on|off · cock and vulva both, milk and semen both

THE PARTS
  Udder · bra cup, AA to H. Bigger makes and holds more milk.
  Balls · 1 to 10. Bigger makes bigger loads.
  Penis · inches, up to 14". Too big for a hole stretches it.
  Vulva / Butt · tight, snug, slightly gaped, gaped, loose… ruined.
    Stretched holes tighten a level a day; looser drains faster.
  Throat · gaggy to bottomless. Too big gags some back up, and every
    3 of those trains it a level.
  Cock and balls only show if you've got 'em; udder if you're milkable
  or have a vulva. ?help cocks for types and knots.

✨ HYPER (shots only)
  • Udder to an R cup, balls, gape and throat to 20, penis to 30".
  • A P cup or size-17 balls pins you where you stand till a reducer.

GOOD TO KNOW
  • Pent up: semen full for a day (12h caged) and your next load
    empties everything, half again more, and extra fertile.
  • Stamina: past 3 loads in an hour each one's smaller.
  • Swallow a big load and you fill faster for an hour.`,

    cocks: `🍆 COCKS, KNOTS & CUMFLATION 🍆

COMMANDS
  ?penis · your cock (?cock works too)
  ?penis types · the list
  ?penis <type> · set yours, e.g. ?penis equine

THE TYPES
  human · the usual
  canine · comes knotted
  equine · flared, bigger loads, stretches faster
  feline · barbed, every vulva fill rolls like heat
  draconic · ridged, stretches and trains throats faster
  double · ?cum <who> vulva+butt fills two at once
  Dogs, wolves and foxes start canine, horses equine, cats feline.

KNOTS · any type can carry one
  • A "knotting" shot gives it; knot growth, knot reducer and knot
    remover shots change it.
  • A knotted fill ties you: leashed to the stud 5 to 30 minutes
    (bigger knot, longer tie). Nothin' spills or drains, and it's
    likelier to take.

CUMFLATION
  • A knot keeps fillin' you past full. At 1.5x your capacity you're
    too swollen to move till it drains.
  • A plug left in seals a load in. Milkin' a cumflated girl squeezes
    some of the seed back out.

BREEDIN' STAND
  • Fills on the stand catch more, and a tie there draws an audience.`,

    life: `🌾 FARM LIFE 🌾

COMMANDS
  ?feeding · feedin' times      ?curfew · curfew hours
  ?weather · today's weather    ?tour · a walk round the farm
  ?beg <the words> · ask nicely for a treat
  ?notice · the farm's notice board

THE DAY
  🔔 Feedin' at 8:00 and 18:00 · stock heads to the trough
     (the barn on rainy days)
  🌙 Curfew 23:00–7:00 · stock sleeps in the barn
  🌤️ Rain and storms keep everyone inside
  🦮 Your herd leader can put you on a lead (you follow them)

BEGGIN'
  • Say ?beg and the magic words, like ?beg please, Farmhand.
    Get 'em wrong and I'll tell you what they are.
  • Ask properly for a quarter off your stocks time.
  • Once every 10 minutes, sugar.`,

    fair: `🎪 THE COUNTY FAIR 🎪

COMMANDS
  ?fair · what's on and who's entered
  ?enter · step into the ring

THE CLASSES
  show · stock only, staff judge 1 to 10, best average wins
  udder, balls, penis, gape, throat · I measure everyone at the
    close; biggest wins, judges' scores break a tie
  load · studs ?enter, then ?cum; biggest single load wins

THE PRIZE
  • A blue ribbon and a week at prize tier. 🏆`,

    books: `📖 THE BOOKS (staff)

APPLICATIONS
  ?queue · who's waitin'
  ?app <n> · read one, e.g. ?app 1
  ?approve <who> <role…> · livestock, guest, luxury, gloryhole
     e.g. ?approve Bessie livestock luxury
     (hirin' staff is proprietors only)
  ?deny <who> · turn one down
  ?appclear <who> · clear a half-finished interview

THE ROSTER
  ?roster [group] · everybody, or one group: proprietor, herdmaster,
     mandated, farmhand, livestock, luxury, guest, gloryhole
  ?stock [species] · all the stock, or one kind
  ?find <name, number or species>

RECORDS
  ?record <who> · full file
  ?note <who> <text> · add a staff note
  ?signed <who> · flip their contract signed or not
  ?addfriend <who> · friend 'em so my beeps reach 'em
  ?unregister <who> · archive (herdmasters and up)`,

    herd: `🐄 YOUR HERD (staff)

CLAIMIN'
  ?claim <who> [temp|perm] [days] · they have to say yes
     perm lasts till you let go (the default); temp runs out after
     7 days, or the days you give.
     e.g. ?claim Bessie · ?claim 123456 temp 3
  ?release <who> · only from your own herd

YOUR HERD
  ?myherd [species] · who's in it
  ?herdname <word> · herd, pack, pride, flock, stable…
  ?herdcall [message] · call them all
  ?herdsummon · pull in the away ones (herdmasters and up)

HANDLIN' 'EM
  ?walk <who> · leash them to you; say it again to let go
  ?brand <who> <mark> · up to 12 characters, shows on ?who
     ?brand <who> clear takes it off
  ?turnout <who> [note] · keep claimed staff out in pasture
  ?letup <who> · let 'em back`,

    stock: `🎀 MANAGING STOCK (staff)

TIERS
  ?tier <who> · shows it
  ?tier <who> <tier> · degraded, naughty, new, trained, prize
  ?tier <who> naughty 30 · drop 'em and 30 minutes in the stocks

THE STOCKS
  ?stocks <who> [minutes] · 1 to 240, 30 if left out
  ?unstock <who> · let 'em out

CARDS
  ?vet <who> · limits, triggers, aftercare, tier, who bred 'em
  ?inspect <who> · a hands-on inspection, out loud for the room

TEASE LINES · %name% becomes their name
  ?tease add <line> · ?tease list · ?tease remove <n>
  Stock opt in with ?teaseme on.`,

    barnstaff: `🥛 THE BARN (staff)

MILKIN' & COLLECTIN'
  ?milk <who> [mL] · milk 'em by hand (all of it if left out)
  ?collect <who> [mL] · collect semen, bottled as a seed jar
  ?stats <who> · anybody's numbers

SEED JARS
  ?jars · what's on the shelf
  ?inseminate <who> <jar> [hole] · put a jar in 'em

CONTROL
  ?edge <stud> · to the brink and stop; +25% next load, 3 = pent up
  ?drain <who> [hole] · pump out what they're holdin' (not while tied)
  ?denial <stud> <hours> · no fillin' anybody till it's up
  ?denial <stud> off · lift it
  ?ruin <stud> · waste a load, with a teasin' emote

MILK PLAY
  ?nomilk <who> <hours> · cap their teats (1 to 72) · ?nomilk <who> off
  ?quota <who> [mL|off|default|clear] · set a quota, or clear marks

HEAT
  ?heat <who> [hours] · start it (12 if left out)
  ?heat <who> off · break it
  ?heatline add <line> · ?heatline list · ?heatline remove <n>

GOOD TO KNOW
  • Milkin' stalls: stand on one and ?spot set milking1 (milking2…)
  • ?shotlog shows the last shots and the tags I read.`,

    lifestaff: `🗺️ FARM LIFE (staff)

SPOTS · stand on it, then ?spot set <name>
  summon · where summoned folks land
  safe · where safeword help lands
  staff · where staff-call help lands
  rescue · where ?stuck drops people
  trough · barn · stocks · breedingstand
  milking1, milking2… · milkin' stalls
  ?spot · the list · ?spot clear <name> · ?spot go <name>
  (herdmasters and up)

THE TOUR (herdmasters and up)
  ?tourstop add <line> · say it at each stop as you walk the route
  ?tourstop list · ?tourstop remove <n>

FINDIN' YOUR WAY
  ?where · your X,Y on the map
  ?setrescue · same as ?spot set rescue
  ?stucklog · where folks keep gettin' wedged`,

    work: `⏱️ WORK (staff)

SHIFTS
  ?clockin · start a shift (puts you on duty)
  ?clockout · end it
  Go quiet for 30 minutes or leave and I'll clock you out myself.

CHORES
  ?chores · your chore, the week's board, the list
  ?chore add <job> · e.g. ?chore add Polish the cowbells
  ?chore remove <n>
  ?done · when your chore's finished

HOURS
  ?hours · yours · ?hours <who> · somebody else's
  Proprietors get everybody's hours every week.`,

    play: `🎡 PLAY (staff)

THE PRIZE WHEEL
  ?wheel · list the slices
  ?wheel add reward <text> · ?wheel add punish <text>
  ?wheel remove <n>
  ?spin <who> [reward|punish] · skips anything against their limits

BEGGIN'
  ?begphrase · shows the words · ?begphrase <words> · sets them

THE FAIR
  ?score <who> <1-10> · e.g. ?score Bessie 8.5`,

    keysstaff: `🔑 KEYS (staff)

CHECKIN'
  ?keys <who> · what they hold
  ?keydump · the books against what everybody holds
  ?keysync · resend everybody's keys

HANDIN' OUT (herdmasters and up)
  ?grant <who> <bronze|silver|gold> [hours] · an extra key
     e.g. ?grant Bessie silver 2 (gold is proprietors only)
  ?revoke <who> <bronze|silver|gold> · take a granted key back
  Keys that come with their standing stay put.`,

    oncall: `🔗 ON CALL (staff)

COMMANDS
  ?forced · put yourself on call, or take yourself off
     (proprietors: ?forced <who>; mandated hands always are)
  ?summon · who's on call
  ?summon <who> [spot] · pull 'em in (herdmasters and up)
  ?summon all · everybody on call

GOOD TO KNOW
  • Summons use BCX: add the bot's number to your
    "Ready to be summoned" rule.
  • Safewords pull on-call hands in automatically.`,

    setup: `🛠️ FIRST-TIME SETUP (proprietors)

  1. Make the bot a room admin.
  2. Stand on each place and ?spot set it: summon, safe, staff,
     rescue, trough, barn, stocks, breedingstand, milking1, milking2…
  3. Walk the tour route and ?tourstop add <line> at each stop.
  4. ?notice <text> · what everybody sees walkin' in.
  5. ?feeding on|off · ?curfew on|off
  6. Staff add chores, wheel slices, tease and heat lines.

Times follow the bot computer's clock, sugar.`,

    owner: `👑 PROPRIETORS

STAFF
  ?staffadd <who> [farmhand|mandated|herdmaster] · farmhand if left out
  ?staffremove <who>
  ?goldkey <herdmaster> [on|off]

THE FARM
  ?notice <text> · ?notice clear
  ?feeding on|off · ?curfew on|off (leave it out to flip)
  ?fair open [class] [title] · ?fair close
     classes: show, udder, balls, penis, gape, throat, load
     e.g. ?fair open udder Moo Off

YOU
  ?pasture · step back (bronze only) till ?onduty

UPKEEP
  ?backup · ?health`
  };
  const GUIDE_ALIAS = { new:"start", rules:"start", key:"keys", doors:"keys", herd2:"herds", tier:"tiers", stocks:"tiers",
                        milk:"barn", milking:"barn", stats:"barn", nursing:"barn", breed:"breeding", scene:"breeding",
                        pregnant:"pregnancy", preg:"pregnancy", rights:"pregnancy", species:"pregnancy", litters:"pregnancy",
                        inflation:"cocks", cumflation:"cocks", knot:"cocks", knots:"cocks", penis:"cocks", cock:"cocks",
                        injector:"shots", injectors:"shots", tags:"shots", size:"body", sizes:"body", futa:"body", gape:"body", udder:"body",
                        feeding:"life", curfew:"life", beg:"life", tour:"life", staff:"staffmenu" };
  const STAFF_GUIDES = ["books","herd","stock","barnstaff","lifestaff","work","play","keysstaff","oncall","setup","owner"];

  function helpFor(sender, topic){
    const t0 = String(topic||"").toLowerCase();
    const t = GUIDE_ALIAS[t0] || t0;
    if (!t) return fill(TEXT.help, sender);
    if (t === "staffmenu") return isStaff(sender) ? TEXT.staffhelp : fill(TEXT.help, sender);
    if (t === "me") return myCommands(sender);
    if (STAFF_GUIDES.includes(t) && !isStaff(sender)) return GUIDES[t+"s"] || "Aw, that guide's just for staff, sugar. Say ?help to see the ones for you.";
    return GUIDES[t] ? GUIDES[t] : "Hmm, I don't have a guide called '"+t0+"', hon. Try one of these: start, safety, keys, herds, tiers, barn, breeding, pregnancy, heat, body, cocks, shots, life, fair or me. For example: ?help breeding";
  }
  function myCommands(mn){
    const group = (title, list) => "\n"+title+"\n  "+list;
    let o = "📋 EVERYTHING YOU CAN ASK ME, SUGAR\n";
    o += group("🔴 Safety",      "safe · stuck · staff · report");
    o += group("🌾 Gettin' started", "help · rules · consent · tour · apply · friend · species · luxury · doors");
    o += group("📖 You & the farm", "record · keys · who · herd · notice · weather · feeding · curfew · beg");
    o += group("🥛 Milk",        "stats · board · milkable · quota");
    o += group("🐂 Breedin'",    "breedable · fertile · freeuse · yes · no · naturalheat · breed · cum · wash · tally · eggs · praise · degrade · rights · accept · pedigree");
    o += group("📏 Body",        "size · measure · penis · futa");
    o += group("🎪 Fun",         "fair · enter · teaseme");
    if (isStaff(mn)){
      o += "\n\n🧑‍🌾 STAFF";
      o += group("📖 Books",     "queue · app · approve · deny · appclear · roster · stock · find · record <who> · note · signed · addfriend · unregister");
      o += group("🐄 Herd",      "claim · release · myherd · herdname · herdcall · herdsummon · turnout · letup · brand · walk");
      o += group("🎀 Stock",     "tier · stocks · unstock · vet · inspect · tease");
      o += group("🥛 Barn",      "milk · collect · jars · inseminate · drain · edge · denial · ruin · nomilk · quota <who> · heat · heatline · shotlog");
      o += group("🗺️ Farm",      "spot · tourstop · setrescue · where · stucklog");
      o += group("⏱️ Work & play", "clockin · clockout · hours · done · chores · chore · wheel · spin · begphrase · score");
      o += group("🔑 Keys & calls", "keys <who> · keysync · keydump · grant · revoke · forced · summon · pasture · onduty · cover");
    }
    if (isProprietor(mn)) o += "\n\n👑 PROPRIETOR"+group("", "staffadd · staffremove · goldkey · notice <text> · feeding on|off · curfew on|off · fair open|close · backup · health").replace(/^\n\n/,"\n");
    return o+"\n\nSay ?help and a topic (like ?help breeding) and I'll explain any of it, hon.";
  }

  TEXT.rules = `🌾 B&B FARM — HOUSE RULES 🌾 (v1.0)

1. MIND YOUR MANNERS. With folks and stock both, sugar. Rough is fine. Cruel is fine when it's wanted. Bein' an ass behind the curtain ain't, ever.

2. THE CONTRACT IS THE CONSENT. Every animal here signed one, and it says what can be done to 'em and what can't.

3. STOCK IS STOCK. Any handler may work any animal in the pasture, pens or barn — lead 'em, tie 'em, milk 'em, breed 'em, use 'em. Their contract is the only fence, and it holds. Medical, security, or under a handler's active care — ask first.

4. NOTHIN' WALKS OFF THIS FARM. You can't steal stock, and please don't play at it either.

5. NO SWINGIN' JUST FOR THE SAKE OF IT. Kickin', slappin', strikin' — negotiated scenes only. "I was just jokin'" ain't a defense.

6. 🔴 RED STOPS THE WORLD. Anybody can call it. Beep me 'safe' or say ?safe and I'll call it for you.

7. THE PROPRIETORS' WORD GOES. Laynie and Alexia own this land, and staff speak with their voice.

8. TAKE THE HAT OFF OUTSIDE. Squabbles and personal business go elsewhere, hon.

🥉 THE BRONZE DOOR. There's a room in the back of the barn only registered stock can open. Nobody follows 'em through it. Ever. Punishment takes privileges — it don't take that.

🔔 THE OFFICE IS ALWAYS ON YOUR LIST. Every animal registered here gets me added automatically. However bound, however far off, however thoroughly muzzled — beep me and I'll hear you.

⚠️ We remove first and talk after. If it was genuinely murky, you'll get a fair hearin'.

Say ?consent for how the paperwork works, %name%.`;

  TEXT.consent = `🌾 ON CONSENT AT B&B FARM 🌾

Every animal and every hand on this property is here because they CHOSE to be, and signed to say so.

That contract ain't decoration, hon. It says what may be done to 'em and what may not, agreed to freely, with a clear head, by somebody who wanted it.

So when you see stock in the pens, in the stalls, or strung up in the barn — know they ASKED for that. Respect it. Don't second-guess it, don't check in out of character to make sure they're "really okay," and don't treat a collar like somethin' that happened TO somebody.

Respect works both directions. The contract's a fence and it holds both ways. What ain't in it, don't happen.

🔴 ?safe stops everything, anywhere, from anybody. No contract overrides that.
🔔 And beepin' me works from anywhere on the property — gagged, wedged, it don't matter.`;

  TEXT.tour = `🌾 THE GROUNDS 🌾
C'mon then, %name%, I'll show you 'round! Mind the ruts, sweetie.

🌾 THE PASTURE — Open ground, good grass, heart of the place. Four stalls along the side.

🏚️ THE BARN — Warm, dim, and smells just like it ought to. Where the stock sleeps and the machines live. There's a safe room off the back behind a bronze door — quiet, soft, and nobody follows you through it.

🕳️ THE PENS — Gloryhole stalls. Punishment, breedin', or just leavin' somethin' out for the guests to find.

🐕 THE KENNEL & RING — Pets, trainin', and the show ring. Locker room attached.

🏥 MEDICAL — Small office, one observation room. Checkups, injections, watchin' what develops. Silver key.

🚪 STAFF ROOM — Back of the pasture. Interviews and staff business. Silver key.

🔒 SECURITY WING — Down the back hall. Permanent displays. Gold doors, and no, sugar, you don't have one. 😉

🏡 THE CABIN — Laynie and Alexia's home, unless somebody books it. Then it's all yours, and the two of 'em go sleep in the barn with the rest of the stock.`;

  TEXT.doors = `🔑 WHAT OPENS WHAT

🥉 BRONZE — the safe room in the back of the barn.
   Registered stock, luxury guests, and everybody on staff.
   That door's protection, sugar. Nobody follows you through it —
   not guests, not handlers, not even when you're bein' punished.

🥈 SILVER — staff room, back hallway, medical, observation.
   Farmhands, mandated farmhands, herdmasters, proprietors.

🥇 GOLD — the security wing and the permanent displays.
   Laynie and Alexia, plus any herdmaster they trust with one.

Keys come with your standing and go when it changes. Anybody
turned out to pasture keeps bronze and nothin' else — even the
owners, when they're down in the herd with y'all.

Say ?keys to see what you're holdin', hon.`;

  TEXT.species = `🌾 WHAT WE KEEP 🌾

🐄 COWS — milked on one schedule, bred on another
🐂 BULLS — kept for service, collected regular
🐎 PONIES — tack, carts, gait work, the show ring
🐖 PIGS — mud, trough, and no dignity to speak of, bless 'em
🐕 PUPPIES — kennel, leash, and a whole lot of trainin'
🐈 KITTENS — less obedient, more trouble, still ours
🦌 DEER — skittish, and we like 'em that way
👺 GOBLINS — got in some years back, never left, breed like it's a sport
🎎 DOLLS — posed, displayed, kept behind gold
🕳️ GLORYHOLES — installed in the pens, left for whoever wanders past

And if you're somethin' we ain't listed, say so anyhow, sugar. We've taken in stranger!`;

  TEXT.luxury = `🏡 THE CABIN — LUXURY STAY 🏡
Real bed. Real door. Real quiet. Ooh, it's lovely, %name%.

The cabin's Laynie and Alexia's home — right up until somebody books it. Then it's yours, and the two of 'em go sleep out in the barn with the rest of the stock.

WHAT YOU GET
🥉 A bronze key for the length of your stay
📜 A proper contract, signed and filed
🐄 The herd to look over and enjoy, within their paperwork
🏡 The cabin, and nobody knockin'

WHAT'S ASKED Next to nothin'. A rule or two, mostly for the look of the thing.

HOW LONG A night, a week, a season. Your call, hon.

Say ?apply and pick 'luxury guest'.

⚠️ Fair warnin', sugar — folks book the cabin meanin' to watch, and end up in the barn by Thursday. Happens more than you'd think! 😉`;

