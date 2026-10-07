  /* WHAT'S IN THIS FILE (01-config.js)
     CFG: every setting you can change without touchin' code. Room name, admins, proprietors, cooldowns,
     summoning, herds, tiers, teasing, milking gear rates, production and breedin' numbers, sizes,
     species, texts.
  */
  /* ═══════════════════════════════════════════════════════════
     CONFIGURATION
     ═══════════════════════════════════════════════════════════ */

  const CFG = {
    ROOM_NAME: "B&B Farm",
    ROOM_DESC: "Bred & Bound. Bed & Breakfast. Say ?help out loud — or beep the farm office from anywhere.",
    ROOM_BG: "IndoorsBarn",
    ROOM_LIMIT: 20,
    ROOM_PRIVATE: false,

    ROOM_ADMINS: [221397, 232922, 260239],
    PROPRIETORS: [221397, 232922],
    BOT_MEMBER: 260239,

    PREFIXES: ["?", "-", "!", "."],
    BOT_WORDS: ["bot", "farm", "office"],
    BARE_WHISPER_COMMANDS: true,

    CHAT_REPLY_BEEP: true,
    WHISPER_FIRST: false,        // true = whisper folks standin' on the map instead of beepin' 'em (some clients/mods hide bot whispers)
    CHAT_REPLY_SAY_MAX: 280,

    GREET_COOLDOWN_MIN: 90,
    SEND_INTERVAL_MS: 250,       // ONE queue for chat, beeps & hidden msgs (server kicks at 20/sec; 4/sec is plenty safe)
    QUEUE_MAX: 300,              // drop oldest routine messages past this
    BEEP_MAX_CHUNKS: 8,
    USER_COOLDOWN_S: 5,
    COMPANION_COOLDOWN_S: 1,
    HOME_AFTER_S: 90,
    SPEAKER_MODE: "voice",         // with speaker-* spots set: "voice" = the spot speaks for me and I never move · "walk" = I go stand on the nearest one
    SPEAKER_RANGE: 8,              // how far (tiles) from the speaker spot, or from whoever it's about, folks get the line              // after walkin' over to somethin', I head back to my home tile (?spot set home) this long after       // panel buttons: a short gap, and a click that comes too quick waits its turn
    APPLY_TIMEOUT_MIN: 0,        // 0 = interviews never time out (staff can ?appclear a stale one)
    CLAIM_ASK_TIMEOUT_MIN: 60,   // unanswered ?claim requests lapse after this
    ROOM_SNAPSHOT_MIN: 10,       // remember the map so a rebuilt room keeps it

    /* ── ANTI-IDLE ── */
    USE_WORKER_TIMER: true,      // browsers throttle setInterval in background tabs
    HEARTBEAT_MS: 20000,
    KEEPALIVE_MIN: 4,            // invisible server traffic every N minutes
    KEEPALIVE_NUDGE: true,       // also shuffle position occasionally
    NUDGE_MIN: 11,
    WATCHDOG_MIN: 5,             // reload the page if broken this long
    WATCHDOG_ENABLED: true,

    KEY_SYNC_ENABLED: true,
    KEY_SYNC_ON_JOIN: true,
    KEY_RESYNC_MIN: 10,
    KEY_JOIN_DELAY_MS: 4000,
    TELL_ON_KEY_CHANGE: true,

    AUTO_FRIEND: true,
    FRIEND_ON_REGISTER: true,
    FRIEND_ON_BEEP: true,
    FRIEND_ON_JOIN: true,

    /* ── FORCED SUMMONING ── */
    SUMMON_ENABLED: true,
    // BCX "Ready to be summoned" only fires if the beep STARTS WITH the person's own
    // summon text, or is exactly "summon". Plain "summon" works for everyone.
    // They must also list the bot's member number in that rule's allowed members.
    SUMMON_MESSAGE: "summon",
    SUMMON_BEEPTYPE: "",
    SUMMON_COOLDOWN_MIN: 5,
    SUMMON_MAX_PER_CALL: 3,
    SUMMON_ON_SAFEWORD: true,
    SUMMON_ON_STUCK: false,
    SUMMON_ON_STAFF_CALL: false,

    /* ── HERDS ── */
    HERD_CAP: { PROPRIETOR:20, HERDMASTER:15, FARMHAND:10 },   // farmhand cap covers mandated too
    HERD_WORD_DEFAULT: "herd",
    HERDCALL_COOLDOWN_MIN: 2,

    /* ── PASTURE LOCK ── who can be turned out and kept off duty, and who
       (besides whoever has them in their herd) may lock them. Only their herd
       leader can let them back up; if nobody holds them, whoever locked them can. */
    PASTURE_LOCKABLE: { 221397: [232922] },    // Laynie: Alexia may lock too
    PASTURE_LOCK_CLAIMED_STAFF: true,          // any staff or proprietor in a herd can be turned out by their leader
    // People listed in PASTURE_LOCKABLE can always let that person up too,
    // even while a herd leader holds them (Alexia can always let Laynie up).

    /* ── TIERS ── lowest first. The bottom two are punishment tiers. Staff set them all. */
    TIERS: ["degraded","naughty","new","trained","prize"],
    TIER_PRETTY: { degraded:"⛓️ Degraded", naughty:"🔻 Naughty", new:"🌱 New stock", trained:"🎀 Trained", prize:"🏆 Prize" },
    PUNISH_TIERS: ["degraded","naughty"],

    /* ── TEASING ── opted-in stock get a random line now and then while they're here */
    TEASE_ENABLED: true,
    TEASE_MIN_GAP_MIN: 25,     // never closer together than this, per person
    TEASE_MAX_GAP_MIN: 70,     // ...and usually by this

    /* ── PRODUCTION & BREEDING ── amounts in mL, rates per hour. See doc section 16. */
    /* ── MILKING GEAR ── worn anywhere on the farm, it milks at a rate to match the gear.
       Echo's pumps top out near 40 mL a minute, so the farm does too. */
    GEAR: {
      PUMP_ML: [0, 10, 20, 30, 40],          // BC Lactation Pump: Off, Low, Medium, High, Maximum (mL a minute)
      ECHO_ML_MIN: 15, ECHO_ML_MAX: 40,      // Echo's portable pump and milk vendor: calm → fully aroused
      EMOTE_MIN: 5,                          // a gear emote about this often per person (with some wobble)
      MACHINE_LOAD_MIN: 30,                  // a jar loaded into a machine waits this long for it to run
    },
    PROD: {
      MILK_PER_H: 500, MILK_CAP: 8000,            // per species "milk" multiplier below
      SEMEN_PER_H: 5,  SEMEN_CAP: 60,
      BASE_CAPACITY: 200, WORN_CAPACITY: 100,
      INJECT_CAPACITY: 250, REDUCE_CAPACITY: 500, MAX_CAPACITY: 50000,   // shots stretch (or shrink) capacity for good
      IMMOBILE_ML: 5000,                           // this much swelling pins you where you are
      PIN_FROM_MILK: true,                         // milk past its normal cap counts toward it
      PIN_FROM_INFLATION: true,                    // held semen counts too: a stud can cumflate you till you can't move
                                                   // (a stud's own semen never pins)
      SAFEWORD_UNPIN_MIN: 30,                      // a safeword frees them for this long
      HALF_LIFE_H: { vulva:12, butt:6, mouth:1 },  // stored semen halves this often
      LOAD_SHARE: 0.6, MIN_LOAD: 5,                // ?cum moves 60% of the stud's semen
      SWALLOW_TO_MILK: 0.5,                        // swallowed loads feed the milk a little
      PREG_MILK_X: 1.5, FRESH_MILK_X: 2, FRESH_DAYS: 3,
      CONCEIVE_BASE: 0.15, EXTRA_SIRE_WINDOW_H: 24, EXTRA_SIRE_X: 0.5, TWIN_CHANCE: 0.10,
      PREG_DAYS: 5, SEX_SPLIT: [45, 45],           // male %, female %, the rest futa
      OVERFULL_H: 24, LEAK_EMOTE_MIN: 30,
      HEAT_H: 12, NATURAL_HEAT_EVERY_D: 7, HEAT_EMOTE_MIN: 20,
      STALL_MILK_PER_MIN: 250, STALL_SEMEN_PER_MIN: 5,   // only for a session started before an update; new ones pace themselves (STALL_SESSION_RANGE)
      STALL_SESSION_RANGE: [5, 30], // a stall session takes 5 minutes (just over a quarter full) up to 30 (full)
      STALL_LINE_MIN: 5,           // an open line in the room at most this often while they're in the stall (their own story is private)
      STALL_OPEN_MAX: 20,          // ...and at most this many in one session
      STALL_AWAY_GRACE_S: 60,
      STALL_REST_MIN: [10, 20],    // after a session, the stall rests this many minutes (random in between) before it takes them again      // steppin' off for less than this pauses the session instead of endin' it
      STALL_LEAVE_SHARE: 0.25,     // milkin' stalls drain you down to this much of your capacity, then stop
      WEEKLY_PRIZE: true                           // top producer each week goes prize tier
    },
    /* ── MILK GRADE ── each milking session is scored 0-100; the grade is the
       average of the last few sessions, so anybody can work their way up. */
    GRADE: {
      BASE: 55,
      TIER: { prize:15, trained:8, new:0, naughty:-12, degraded:-20 },
      REGULAR_MIN_H: 6, REGULAR_MAX_H: 16, REGULAR: 15,   // milked on a good rhythm
      TOO_SOON_H: 2, TOO_SOON: -10,                       // milked again too soon
      TOO_LONG_H: 36, TOO_LONG: -10,                      // left too long
      FRESH: 10, HEAT: 5, LACT_SHOT: 10, LACT_WORN: 5,
      LEAKING: -15,                                       // overfull and leaking for a day
      SESSION_GAP_MIN: 30,                                // drains closer than this are one session
      AVERAGE_OF: 5,
      LETTERS: [[85,"A+"],[70,"A"],[55,"B"],[40,"C"],[0,"D"]],
      WEEKLY_PRIZE: true, MIN_SESSIONS: 3                 // best average grade of the week goes prize too
    },
    /* ── BODY SIZES ── Udder, balls, gape and throat go by level; penis goes by inches.
       Anybody can set their own up to "natural". Past that is hyper, and only shots get you there. */
    SIZES: {
      udder:  { label:"Udder",  start:3, natural:10, max:20,   // udder = breasts; measured in bra cups
                cups:["AA","A","B","C","D","DD","E","F","G","H", "I","J","K","L","M","N","O","P","Q","R"],
                names:["flat","perky","handful","full","heavy","big","huge","massive","enormous","gigantic",
                       "hyper","beachball","bursting","colossal","barrel-sized","titanic","immobilizing","mountainous","room-filling","impossibly huge"] },
      testes: { label:"Balls",  start:3, natural:10, max:20,
                names:["tiny","small","average","full","heavy","big","huge","swollen","massive","enormous",
                       "hyper","melon-sized","sloshing","colossal","basketball-sized","titanic","immobilizing","mountainous","room-filling","impossibly huge"] },
      penis:  { label:"Penis",  start:6, natural:14, max:30, step:2, inches:true,   // inches; a shot adds or takes 2"
                words:[[3,"tiny"],[5,"small"],[7,"average"],[9,"big"],[12,"huge"],[16,"massive"],[20,"enormous"],[25,"monstrous"],[31,"hyper"]] },
      vulva:  { label:"Vulva",  start:1, natural:10, max:20, gape:true,
                names:["tight","snug","slightly gaped","gaped","loose","well-used","gaping","wide open","cavernous","ruined",
                       "hyper-gaped","fist-wide","yawning","arm-deep","sloppy and slack","bottomless","hollowed out","endless","abyssal","impossibly gaped"] },
      butt:   { label:"Butt",   start:1, natural:10, max:20, gape:true,
                names:["tight","snug","slightly gaped","gaped","loose","well-used","gaping","wide open","cavernous","ruined",
                       "hyper-gaped","fist-wide","yawning","arm-deep","sloppy and slack","bottomless","hollowed out","endless","abyssal","impossibly gaped"] },
      knot:   { label:"Knot",   start:3, natural:10, max:20,    // only for knotted cocks
                names:["little","modest","thick","fat","swollen","fist-sized","bulging","massive","huge","enormous",
                       "hyper","grapefruit-sized","lockin'","colossal","melon-sized","titanic","inescapable","mountainous","room-fillin'","impossibly huge"] },
      throat: { label:"Throat", start:2, natural:10, max:20,
                names:["gaggy","tight","learnin'","eager","practiced","trained","deep","greedy","no gag reflex","bottomless",
                       "hyper-trained","stretchy","endless","swallow-anything","cock sleeve","limitless","living funnel","insatiable","abyssal","impossibly deep"] }
    },
    SIZE_SELF_SET: true,          // folks can set their own sizes with ?size, up to "natural" (it's their character)
    UDDER_X_PER_LEVEL: 0.15,      // each udder level above/below 3: ±15% milk made and held, up to "natural"...
    TESTES_X_PER_LEVEL: 0.25,     // each ball level above/below 3: ±25% semen made and held, up to "natural"...
    HYPER_X: { udder:1.3, testes:1.5 },   // ...then each hyper level multiplies it again (hyper loads!)
    PIN_FROM_SIZE: { udder:17, testes:17 },   // this big and you can't move till it's reduced (0 = never)
    PREG_UDDER_UP: 1,             // udder swells this many sizes while expecting and fresh
    INCHES_PER_GAPE: 3,           // a penis needs one gape (or throat) level per 3"
    STRETCH_PER_BREED: 1,         // a penis bigger than the hole stretches it this many levels
    GAPE_TIGHTEN_H: 24,           // stretched holes tighten one level this often, back to their usual
    GAPE_LEAK_X: 0.15,            // each level looser than tight drains a held load 15% faster
    // worn in the vulva or butt slot (or a mouth slot for the throat), trains only that hole
    STRETCHER_WORDS: ["stretcher","stretching","stretch","gaper","gape","dilator","expander","spreader","trainer","widener","loosener"],
    STRETCH_TRAIN_H: 12,          // every 12 hours a stretcher's worn (on the farm), that hole's usual goes up one
    THROAT_TRAIN_EVERY: 3,        // this many throat loads from a too-big penis trains the throat up one
    PENTUP_H: 24, PENTUP_CAGED_H: 12,  // full this long (or this long while caged) = pent up
    PENTUP_LOAD_X: 1.5, PENTUP_FERT_X: 1.5,   // a pent-up stud empties everything, half again more, and more fertile
    LOAD_WORDS: [[5,"a little dribble"],[15,"a load"],[40,"a thick load"],[100,"a huge load"],[300,"a gushin' flood"],
                 [1000,"a belly-swellin' torrent"],[5000,"a hyper flood"],[Infinity,"an impossible, never-endin' flood"]],
    // shots that change sizes for good (one step per shot, and the only way into hyper).
    // Spaces, hyphens and capitals don't matter.
    SIZE_TAGS: {
      udder:  { up:["udder growth","udder boost","udder enlarger","breast growth","breast enlarger","boob growth"],
                down:["udder reducer","udder reducing","udder shrink","breast reducer","breast reducing","boob reducer"] },
      testes: { up:["ball growth","balls growth","testicle growth","testes growth","ball enlarger"],
                down:["ball reducer","ball reducing","ball shrink","testicle reducer","testes reducer"] },
      penis:  { up:["penis growth","penis enlarger","cock growth","dick growth"],
                down:["penis reducer","penis reducing","penis shrink","cock reducer"] },
      vulva:  { up:["vulva gape","pussy gape","vaginal gape"],
                down:["vulva tightener","pussy tightener","vaginal tightener"] },
      butt:   { up:["anal gape","butt gape","ass gape"],
                down:["anal tightener","butt tightener","ass tightener"] },
      knot:   { up:["knot growth","knot enlarger","knot swell"],
                down:["knot reducer","knot shrink"] },
      throat: { up:["throat trainer","throat relaxer","deep throat"],
                down:["throat tightener","gag reflex restorer"] }
    },
    FAIR_CLASSES: ["show","udder","balls","penis","gape","throat","load"],
    /* ── PENIS TYPES & KNOTS ── any type can also carry a knot (a shot gives one) */
    PENIS_TYPES: {
      human:   { label:"human",           loadX:1,   stretchX:1, throatX:1 },
      canine:  { label:"canine",          loadX:1.2, stretchX:1, throatX:1, knot:true },
      equine:  { label:"flared equine",   loadX:1.5, stretchX:2, throatX:1 },
      feline:  { label:"barbed feline",   loadX:1,   stretchX:1, throatX:1, heat:true },   // every vulva fill rolls like they're in heat
      draconic:{ label:"ridged draconic", loadX:1.2, stretchX:2, throatX:2 },
      double:  { label:"double",          loadX:1,   stretchX:1, throatX:1, double:true }  // ?cum <who> vulva+butt
    },
    SPECIES_PENIS: { dog:"canine", pup:"canine", wolf:"canine", fox:"canine", horse:"equine", pony:"equine", cat:"feline", kitt:"feline" },
    // crafted shot words that change the type for good (spaces, hyphens and capitals don't matter)
    PENIS_TYPE_TAGS: { canine:["canine"], equine:["equine"], feline:["feline","barbed"], draconic:["draconic"],
                       double:["double cock","double penis","hemipenes","twin cock"], human:["humanizer","human cock"] },
    KNOT_ADD_TAGS: ["knotting","add knot","knot shot"],
    KNOT_REMOVE_TAGS: ["knot remover","unknotting"],
    TIE_MIN_M: 5, TIE_MAX_M: 30,  // a knot ties the pair this long (random), and leashes them together
    KNOT_FERT_X: 1.5,             // a tied load is more likely to take
    CUMFLATE_PIN_X: 1.5,          // held semen past 1.5x your capacity pins you (only a knot gets you past full)
    BREEDING_STAND: "breedingstand", BREEDING_STAND_X: 1.5,   // fills on (or next to) that spot catch more
    HEAT_SCENT_TILES: 2,          // a stud this close to stock in heat gets pent up twice as fast
    MILK_LEAK_SHARE: 0.5,         // milkin' someone who's cumflated squeezes out this much semen per mL of milk
    TOP_SIRES: 3,                 // how many sires the weekly post names
    /* ── v0.9.23 ── */
    BREED_OK_H: 3,                // a yes to a stud lasts this long (each fill keeps it fresh)
    BREED_ASK_MIN: 10,            // a breedin' ask waits this long for a yes or no
    PAINT_H: 6,                   // cum-covered this long unless they ?wash
    SCENT_H: 1,                   // a stud's seed scent lasts this long
    MILK_QUOTA_ML: 1000,          // stock that makes milk should give this much a day (staff: ?quota)
    QUOTA_MIN_PRESENT: 60,        // the milk quota only counts a day they spent at least this many minutes on the farm
    QUOTA_STREAK_UP: 5,           // this many days in a row on quota moves 'em up a tier (new → trained → prize)
    LABOUR_MIN: 45,               // labour lasts this long before the litter comes
    LABOUR_WAIT_H: 12,            // due but away from the farm this long: the litter comes without the show
    EGG_CHANCE: 0.2, EGG_TIED_CHANCE: 0.4, EGG_COUNT: [2,6], EGG_DAYS: [2,3],
    MILK_ACHE_MIN: 20,            // milk-denied and full: an achin' emote about this often
    /* ── v0.9.23 ── */
    RP_ROUGH: /\b(pound\w*|rail\w*|rough\w*|slam\w*|hammer\w*|brutal\w*|ravag\w*|wreck\w*|savage\w*|plow\w*|plough\w*|ruin\w*|hard)\b/i,
    RP_GENTLE: /\b(slow\w*|gentl\w*|tender\w*|soft\w*|loving\w*|careful\w*|sweet\w*)\b/i,
    SLOSH_MIN: 8,                 // a full, sloshin' body gets a waddle emote about this often when it moves
    EDGE_X: 0.25, EDGE_MAX: 4, EDGE_PENT: 3,   // each edge adds 25% to the next load (up to 4); 3 edges = pent up
    VEDGE_X: 0.2, VEDGE_HOURS: 3,
    AMBIENT_ON: true,                          // two animals standin' close share a small moment every 15–25 minutes              // a pussy edged: each edge makes the next breedin' 20% likelier to take, for 3 hours
    RP_PRAISE: /\bgood (girl|boy|cow|pet|pup|puppy|kitty|kitten|heifer|breeder|stud|pony|piggy|toy|slut|bitch|bull|mare|doll|thing|little \w+)\b/i,
    RP_DEGRADE: /\b(slut|whore|cumdump|cum dump|breeder|cow|heifer|bitch|cocksleeve|cock sleeve|fucktoy|fuck toy|sow|pig|breeding stock|brood ?mare|milk ?bag|onahole|cumrag|cum rag)\b/i,
    TITLES: [
      { key:"cream",  name:"Cream Queen",      why:"100 L milked" },
      { key:"dump",   name:"Farm Cumdump",     why:"50 L of seed taken" },
      { key:"brood",  name:"Brood Mother",     why:"5 litters" },
      { key:"breeder",name:"Prize Breeder",    why:"10 litters" },
      { key:"bottom", name:"Bottomless",       why:"a hole gaped to ruined for good" },
      { key:"throat", name:"Throat Goat",      why:"a bottomless throat" },
      { key:"stud",   name:"Stud of the Farm", why:"50 covers" },
      { key:"sire",   name:"Prolific Sire",    why:"sired 10 litters" },
      { key:"eggs",   name:"Egg Layer",        why:"10 eggs laid" }
    ],
    FAST_SCENE_TYPES: ["canine","draconic"], FAST_SCENE_S: 30,   // these can fill every 30 seconds in a scene
    STAMINA_FILLS: 3, STAMINA_X: 0.6,   // past 3 fills in an hour, each load is 60% of the one before (pent up / virility skip it)
    HUNGRY_ML: 50, HUNGRY_X: 1.25,      // swallow this much and your own milk and semen fill 25% faster for an hour
    NURSE_SUPPLY_STEP: 0.05, NURSE_SUPPLY_MAX: 0.5,   // each nursin' this week adds 5% to milk made, up to +50%
    JAR_DAYS: 3,                  // bottled seed keeps this long
    RUT_DAY: 6,                   // 0 Sunday … 6 Saturday: fertility doubles, studs pent up twice as fast
    RUT_EMOTE_MIN: 90,
    LEAKY_GAPE: 8,                // a hole this loose drips its load now and then
    LEAKY_EMOTE_MIN: 30,
    RIGHTS_DAYS: 7, RIGHTS_MAX_DAYS: 60,   // breedin' rights last this long unless the stud asks for other
    MILK_DRUNK_ML: 1000,          // drink this much milk in a day and you get sleepy and docile
    /* ── ROLEPLAY TRIGGERS ── what folks say in chat or emotes moves the numbers */
    RP_CUM_WORDS: /\b(cum|cums|cumming|cummin'?|cummed|creampies?|creampied|orgasms?|orgasming|orgasmed|climax(es|ed|ing)?|ejaculat(es?|ed|ing)|spurts?|spurting|unloads?|unloading|breeds?|seeds?|seeding|fills? (her|him|them|it) up|shoots? (her|his|their|a)? ?loads?)\b/i,
    RP_CUM_COOLDOWN_S: 60,        // one fill per minute per scene, however much they say it
    SCENE_IDLE_MIN: 120,          // an open breedin' scene closes itself after this long quiet
    RP_NURSE_WORDS: /\b(suck\w*|suckl\w*|nurs\w*|drink\w*|drank|feed\w*|fed|latch\w*)\b/i,
    RP_NURSE_PARTS: /\b(nipples?|teats?|breasts?|boobs?|tits?|udders?|milk|chest)\b/i,
    NURSE_ML: 300,                // one nursin' drains this much...
    NURSE_SECONDS: 15,            // ...a little at a time over this many seconds
    NURSE_COOLDOWN_S: 90,
    BLOCK_CHECK: true,            // ?cum checks the hole (and the stud's penis) isn't locked, plugged or gagged
    // matched against the species on file; litter = [fewest, most]
    SPECIES: {
      cow:{milk:2, fert:1.0, litter:[1,1]},  bull:{milk:1, fert:1.0, litter:[1,1]},
      pony:{milk:1, fert:0.8, litter:[1,1]}, horse:{milk:1, fert:0.8, litter:[1,1]},
      deer:{milk:1, fert:0.9, litter:[1,1]}, pig:{milk:1, fert:1.3, litter:[4,10]},
      pup:{milk:1, fert:1.2, litter:[3,8]},  dog:{milk:1, fert:1.2, litter:[3,8]},
      kitt:{milk:1, fert:1.2, litter:[2,6]}, cat:{milk:1, fert:1.2, litter:[2,6]},
      goblin:{milk:1, fert:1.6, litter:[2,5]},
      bunny:{milk:1, fert:1.5, litter:[4,8]}, rabbit:{milk:1, fert:1.5, litter:[4,8]},
      fox:{milk:1, fert:1.1, litter:[2,5]},   wolf:{milk:1, fert:1.1, litter:[3,6]},
      goat:{milk:1.5, fert:1.1, litter:[1,3]}, sheep:{milk:1, fert:1.0, litter:[1,2]},
      default:{milk:1, fert:1.0, litter:[1,2]}
    },
    // keywords in a crafted item's name or description (worn, or on an injector)
    TAG_WORDS: {
      lactation:["lactation","lactating"], virility:["virility"], fertility:["fertility"],
      heat:["heat inducer","heat-inducer"], suppressant:["suppressant"],
      contraceptive:["contraceptive"], capacity:["capacity","stretching"], reducing:["reducing","shrinking"]
    },
    LEAK_LINES: [
      "Oh my — milk's just drippin' from %name%, too full to hold another drop.",
      "%name% is leakin' again, bless their heart. Somebody be a sweetie and get 'em milked.",
      "A little wet patch is spreadin' under %name%. Somebody's way overdue for the milkin' stall!"
    ],
    HEAT_LINES: [
      "%name% squirms against the rails, all flushed and fidgety. Somebody's feelin' warm today!",
      "%name% just can't keep still, rubbin' up on anything that comes close. Shameless, sugar!",
      "A low, needy little sound slips out of %name%. Oh, honey.",
      "%name% presents without even bein' asked, tail up and not one bit shy about it.",
      "The air 'round %name% smells like heat, and y'all, everybody's noticin'."
    ],

    /* ── FARM LIFE ── hours are the bot machine's local clock */
    FEED_HOURS: [8, 18],                 // trough spot ("barn" spot on indoor-weather days)
    CURFEW: { start: 23, end: 7 },       // stock to the barn spot overnight
    CURFEW_TAKES_BRONZE: false,          // bronze is never taken at curfew (house rule); true would hold it overnight
    STOCKS_DEFAULT_MIN: 30, STOCKS_MAX_MIN: 240,
    TOUR_STOP_S: 25,
    LEASH_TICK_MS: 3000,
    WEATHER: [
      { key:"sunny",  line:"Sun's out over the pasture, y'all! Perfect grazin' weather." },
      { key:"hot",    line:"Whew, hot as blazes today! Stock'll be huntin' for shade and water, so keep that trough full, sweeties." },
      { key:"breezy", line:"Nice little breeze today. Keeps the flies off and the hair a-flyin'." },
      { key:"rainy",  line:"Rain's comin' down, sugar. Stock eats in the barn today, nice and dry.", indoors:true },
      { key:"storm",  line:"Storm's rollin' in! Everybody into the barn and stay put till it passes, hear?", indoors:true },
      { key:"foggy",  line:"Fog's thick as gravy today. Can't see the far fence, so stay close to me, darlin's." }
    ],

    /* ── WORK & PLAY ── */
    SHIFT_IDLE_MIN: 30,                  // quiet this long on the clock = clocked out
    CHORE_EVERY_MIN: 45,
    CHORES: ["Refill the trough for me, hon.","Muck out the stalls. I know, I know, but somebody's gotta!",
             "Go check on the new stock and make 'em feel welcome.","Walk the fence line and make sure nobody's wandered off.",
             "Brush down whoever's in the barn. Gently, now!","Restock the milkin' room, sweetie.","Do a quick headcount out in the pasture."],
    BEG_PHRASE: "please, Farmhand",
    BEG_COOLDOWN_MIN: 10,
    TREATS: ["Here ya go, %name%, a sugar cube just for you. Don't say I never spoil ya!",
             "C'mere, %name%. A good long scratch behind the ears for my sweet animal.",
             "An apple slice for you, %name%. Chew it slow and savor it, hon.",
             "A pat on the flank, %name%. You asked so nice!"],
    FAIR_PRIZE_DAYS: 7,

    ANNIVERSARY_ENABLED: true,
    NOTICE_ON_JOIN: true,      // whisper the notice board to people as they walk in

    /* ── SAFETY ── */
    SAFETY_REQUIRE_IN_ROOM: true,    // ?safe / ?stuck only work for people inside the farm

    DEFAULT_CLAIM_TYPE: "perm",
    DEFAULT_TEMP_DAYS: 7,
    CLAIM_EXPIRY_WARN_H: 24,

    STUCK_COOLDOWN_MIN: 3,
    RESCUE_POINT: { X: 20, Y: 30 },

    GREET_ENABLED: true,
    LSCG_SPLATTERS: true,
    ORGASM_FILL_MIN: 3,
    // ribbons, the farm's scrip (10l-ribbons.js), potions and dares (10m-potions.js), the wheel's action slices (10n-wheel.js)
    RIBBONS_ON: true,
    RIBBON_DAY_CAP: 40,          // ribbons a day from farm things (staff grants don't count)
    RIBBON_TOP_BONUS: 5,         // the Sunday till: the week's top earner gets this many more
    RIBBON_GRANT_MAX: { farmhand: 5, herdmaster: 15 },   // per ?ribbon give or fine (proprietors: any)
    RIBBONS_FOR: { quota: 3, stall: 1, chore: 2, gloryShift: 3, gloryPunish: 1, weekBest: 10, showWin: [5, 3, 2] },
    STORE_DAY_LIMIT: { luxury: 1, spin: 5, lucky: 3, grace: 1, greeting: 1, tag: 2 },
    FEEDBACK_PER_DAY: 10, FEEDBACK_MAX: 800,   // the suggestion box: how many a person can send a day, and how long each can be
    AWAY_H: 3, LINGER_MIN: 5,        // "while you were gone" after 3 hours away · nudge lingerers after 5 minutes
    BENCH_MAX_MIN: 120, BENCH_REUSE_SEC: 60,   // the use bench: longest sentence; one person's turns at least a minute apart
    DARE_MIN: 30, DARE_RIBBONS: 2, DARE_RIBBONS_RECKLESS: 4,       // a stud who cums within 3 minutes of their last thrust in somebody fills them
    CONTRACT_NICKNAME: "BnB {Species} {name}",   // the nickname the farm's contracts give: {name} {Species} {species} {pet}          // finishes over somebody draw LSCG's splatters on them (if their LSCG has splatters on)
    SHOW_BADGE: true,
    DEBUG: true,
    LOG_HEARD: true
  };

