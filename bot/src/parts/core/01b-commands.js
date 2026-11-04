  /* WHAT'S IN THIS FILE (01b-commands.js)
     THE COMMAND BOOK (Nov 4, Phase 1). Every ?command the farm girl answers, written down once: its words,
     who may use it, whether the answer stays private, and where it's handled. The parser, the "did you
     mean" guesses, the cooldown, the room-or-private choice and the bot parts all read it from here, so a
     new command is one line next to the code that runs it, not a word added to five lists.

       addCommand("name alias alias", { topic, ...flags })    the first word is the command's own name

     topic       which part of the farm it belongs to (they become folders in Phase 2)
     staff       farm staff only (the proprietors count)
     private     answered by beep or whisper even when asked out loud in the room (files, keys, rosters)
     safety      ?safe and friends: they only cover the farm room
     now         never waits its turn, however quick it comes
     words       takes free text, so a trailing "nya" or "moo" is part of what they said
     interview   still works in the middle of an application
     doc         staff lookin' somebody else up from the panel get the answer in their Office tab
     stockPlay   stock can use it on other stock who say yes (and staff on anybody)
     run(c)      handled right where it's written; c = { cmd, sender, args, rest, channel, R, huh }.
                 Without run, the big switch in 15-commands.js handles it.
     Commands that live in their own part (the store, traps, feats…) are written down in that part.
  */
  const COMMANDS = new Map();   // word → its entry (an alias shares its command's entry)
  const COMMAND_CLASH = [];     // a word written down twice: the first one stands (tests/command-book.test.cjs looks)
  function addCommand(words, o){
    const list = String(words).trim().split(/\s+/);
    const e = Object.assign({ name: list[0], aka: list, topic: "" }, o || {});   // aka: every word for it
    for (const w of list){ if (COMMANDS.has(w)) COMMAND_CLASH.push(w); else COMMANDS.set(w, e); }
    return e;
  }
  const commandOf = (w) => COMMANDS.get(String(w || "").toLowerCase()) || null;
  // every word, as a list (the "did you mean" pool, ?help's checks)
  const commandWords = (test) => [...COMMANDS.keys()].filter(w => !test || test(COMMANDS.get(w)));

  /* ── guides and joinin' ── */
  addCommand("help",                      { topic: "guides", interview: true });
  addCommand("commands info guide",       { topic: "guides" });
  addCommand("staffhelp",                 { topic: "guides", staff: true });
  addCommand("rules",                     { topic: "guides", interview: true });
  addCommand("consent",                   { topic: "guides", interview: true });
  addCommand("tour",                      { topic: "guides", interview: true });
  addCommand("species",                   { topic: "guides", interview: true });
  addCommand("luxury",                    { topic: "guides", interview: true });
  addCommand("doors",                     { topic: "guides", interview: true });
  addCommand("ping",                      { topic: "guides" });
  addCommand("addons addon",              { topic: "guides" });
  addCommand("apply",                     { topic: "joining" });

  /* ── safety ── */
  addCommand("safe safeword red",         { topic: "safety", safety: true, now: true, interview: true });
  addCommand("stuck",                     { topic: "safety", safety: true, now: true, interview: true });
  addCommand("report",                    { topic: "safety", now: true, words: true });
  addCommand("staff",                     { topic: "safety", now: true, interview: true });
  addCommand("setrescue",                 { topic: "safety", staff: true });
  addCommand("stucklog",                  { topic: "safety", staff: true, private: true });

  /* ── records and people ── */
  addCommand("record",                    { topic: "records", private: true, doc: true });
  addCommand("keys",                      { topic: "records", private: true, doc: true });
  addCommand("who",                       { topic: "records" });
  addCommand("today",                     { topic: "records", private: true });
  addCommand("friend",                    { topic: "records" });
  addCommand("addfriend",                 { topic: "records", staff: true });
  addCommand("roster",                    { topic: "records", staff: true, private: true });
  addCommand("stock",                     { topic: "records", staff: true, private: true });
  addCommand("find",                      { topic: "records", staff: true, private: true });
  addCommand("signed",                    { topic: "records", staff: true });
  addCommand("where",                     { topic: "records", staff: true, private: true });
  addCommand("keysync",                   { topic: "records", staff: true });
  addCommand("keydump",                   { topic: "records", staff: true, private: true });
  addCommand("health",                    { topic: "records", staff: true, private: true });
  addCommand("edit",                      { topic: "records", staff: true, words: true });
  addCommand("note",                      { topic: "records", staff: true, words: true });

  /* ── the office: applications, roles, spots ── */
  addCommand("queue",                     { topic: "office", staff: true, private: true });
  addCommand("app",                       { topic: "office", staff: true, private: true });
  addCommand("approve register",          { topic: "office", staff: true });
  addCommand("deny",                      { topic: "office", staff: true });
  addCommand("away",                      { topic: "office", staff: true });
  addCommand("unregister",                { topic: "office", staff: true });
  addCommand("grant",                     { topic: "office", staff: true });
  addCommand("revoke",                    { topic: "office", staff: true });
  addCommand("pasture",                   { topic: "office", staff: true });
  addCommand("onduty",                    { topic: "office", staff: true });
  addCommand("cover",                     { topic: "office", staff: true, private: true });
  addCommand("staffadd",                  { topic: "office", staff: true });
  addCommand("staffremove",               { topic: "office", staff: true });
  addCommand("spot spots",                { topic: "office", staff: true, private: true });
  addCommand("tier",                      { topic: "office", staff: true });
  addCommand("vet",                       { topic: "office", staff: true, private: true, doc: true });
  addCommand("brand",                     { topic: "office", staff: true });
  addCommand("notice",                    { topic: "office", words: true });
  addCommand("appclear",                  { topic: "office", staff: true });
  addCommand("backup",                    { topic: "office", staff: true });
  addCommand("zone zones",                { topic: "office", staff: true });

  /* ── herds ── */
  addCommand("herd",                      { topic: "herds", private: true });
  addCommand("claim",                     { topic: "herds", staff: true });
  addCommand("release",                   { topic: "herds", staff: true });
  addCommand("myherd",                    { topic: "herds", staff: true, private: true });
  addCommand("herdname",                  { topic: "herds", staff: true });
  addCommand("herdcall",                  { topic: "herds", staff: true });
  addCommand("herdsummon",                { topic: "herds", staff: true });
  addCommand("turnout",                   { topic: "herds", staff: true });
  addCommand("letup",                     { topic: "herds", staff: true });
  addCommand("goldkey",                   { topic: "herds", staff: true });
  addCommand("forced",                    { topic: "herds", staff: true });
  addCommand("summon",                    { topic: "herds", staff: true, private: true });

  /* ── contracts ── */
  addCommand("contract",                  { topic: "contracts", staff: true, private: true, words: true });   // (stock get their own contracts from it: 15-commands.js)
  addCommand("contracts",                 { topic: "contracts", staff: true, private: true });
  addCommand("rights",                    { topic: "contracts" });
  addCommand("accept",                    { topic: "contracts" });

  /* ── milk ── */
  addCommand("milkable",                  { topic: "milk" });
  addCommand("seedmilk",                  { topic: "milk" });
  addCommand("jarok",                     { topic: "milk" });
  addCommand("wash",                      { topic: "milk" });
  addCommand("quota",                     { topic: "milk", private: true, doc: true });
  addCommand("milk",                      { topic: "milk", staff: true, stockPlay: true });
  addCommand("collect",                   { topic: "milk", staff: true });
  addCommand("drain",                     { topic: "milk", staff: true, stockPlay: true });   // (on yourself, nobody needed: 15-commands.js)
  addCommand("edge",                      { topic: "milk", staff: true, stockPlay: true });
  addCommand("denial",                    { topic: "milk", staff: true });
  addCommand("ruin",                      { topic: "milk", staff: true });
  addCommand("jars",                      { topic: "milk", staff: true });
  addCommand("inseminate",                { topic: "milk", staff: true });
  addCommand("machine",                   { topic: "milk", staff: true });
  addCommand("nomilk",                    { topic: "milk", staff: true });
  addCommand("inspect",                   { topic: "milk", staff: true });
  addCommand("shotlog",                   { topic: "milk", staff: true });

  /* ── breedin' ── */
  addCommand("breedable fertile naturalheat mpreg", { topic: "breeding" });
  addCommand("breed",                     { topic: "breeding" });
  addCommand("cum",                       { topic: "breeding" });
  addCommand("yes no",                    { topic: "breeding" });
  addCommand("pedigree",                  { topic: "breeding", private: true, doc: true });
  addCommand("heat",                      { topic: "breeding", staff: true });
  addCommand("heatline",                  { topic: "breeding", staff: true, words: true });

  /* ── bodies and looks ── */
  addCommand("stats",                     { topic: "body", private: true, doc: true });
  addCommand("board",                     { topic: "body" });
  addCommand("size",                      { topic: "body", doc: true });
  addCommand("sizes",                     { topic: "body" });
  addCommand("measure",                   { topic: "body", doc: true });
  addCommand("chest",                     { topic: "body" });
  addCommand("futa",                      { topic: "body" });
  addCommand("penis cock",                { topic: "body" });
  addCommand("gender",                    { topic: "body" });
  addCommand("freeuse tally eggs",        { topic: "body" });
  addCommand("praise degrade",            { topic: "body" });
  addCommand("dressme dress",             { topic: "outfits" });
  addCommand("outfit outfits uniform",    { topic: "outfits" });
  addCommand("outfitwheel dresswheel wheeloutfit", { topic: "outfits" });
  addCommand("grooming",                  { topic: "outfits" });

  /* ── the farm girl's voice, ECHS, hypnosis ── */
  addCommand("tease",                     { topic: "voice", private: true, words: true });
  addCommand("teaseme",                   { topic: "voice", private: true });
  addCommand("hypnotize hypnotise",       { topic: "voice" });
  addCommand("allow letgo",               { topic: "voice" });
  addCommand("echs",                      { topic: "voice" });
  addCommand("hypno",                     { topic: "voice" });
  addCommand("voice",                     { topic: "voice", staff: true, words: true });

  /* ── farm life ── */
  addCommand("roam",                      { topic: "farmlife" });
  addCommand("feeding curfew",            { topic: "farmlife" });
  addCommand("weather",                   { topic: "farmlife" });
  addCommand("stocks",                    { topic: "farmlife", staff: true });
  addCommand("unstock",                   { topic: "farmlife", staff: true });
  addCommand("reins",                     { topic: "farmlife", staff: true });
  addCommand("walk",                      { topic: "farmlife", staff: true });
  addCommand("tourstop",                  { topic: "farmlife", staff: true, private: true });

  /* ── the shift ── */
  addCommand("clockin",                   { topic: "work", staff: true });
  addCommand("clockout",                  { topic: "work", staff: true });
  addCommand("hours",                     { topic: "work", staff: true, private: true });
  addCommand("done",                      { topic: "work", staff: true });
  addCommand("chore",                     { topic: "work", staff: true, words: true });
  addCommand("chores",                    { topic: "work", staff: true, private: true });

  /* ── play: the wheel, beggin', the fair ── */
  addCommand("wheel",                     { topic: "play", staff: true, private: true, words: true });
  addCommand("spin",                      { topic: "play", staff: true });
  addCommand("beg",                       { topic: "play", words: true });
  addCommand("please",                    { topic: "play" });
  addCommand("begphrase",                 { topic: "play", staff: true, words: true });
  addCommand("fair",                      { topic: "play" });
  addCommand("enter",                     { topic: "play" });
  addCommand("score",                     { topic: "play", staff: true });
