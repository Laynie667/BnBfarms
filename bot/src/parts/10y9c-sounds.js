  /* WHAT'S IN THIS FILE (10y9c-sounds.js)
     What each trap sounds like. The names are the Companion's (extension/src/cues.js), and each of those is one of
     the game's own sound files. Heard by the one it caught and anybody near enough, if they have farm sounds on.
     TRAP_SOUND: when it springs · TRAP_SOUND_END: when it's done with them · CUSTOM_SOUND: home-built traps, by what they do.
  */
  const TRAP_SOUND = {
    injector: "clip", milker: "latch", breeder: "machine", gas: "hiss", snare: "rope", mud: "wet", spray: "wet", wire: "rip",
    clamp: "clamp", pump: "inflate", eggs: "wet", lantern: "cowbell", tentacle: "wet", well: "wet", leeches: "wet",
    wolves: "chain", stallion: "softgate", bull: "softgate", warren: "straw", boar: "wet", toms: "straw", drake: "straw", naga: "ropelong",
    kennel: "softgate", hive: "wet", goat: "rope", sow: "straw",
    pillory: "wood", brand: "clip", winch: "chainlong", glue: "wet", cups: "latch", chute: "bowl", vines: "ropelong", slime: "wet",
    tickle: "cuffs", mirror: "softgate", paddle: "paddle", wall: "wood", mister: "hiss", weights: "latch", trough: "wet", pricetag: "bell",
    suit: "latex",
  };
  const TRAP_SOUND_END = { milker: "unlatch", clamp: "lock", pump: "hiss", winch: "chain", kennel: "gate", cups: "unlatch", weights: "unlatch", breeder: "unlatch", paddle: "paddle", wolves: "chain" };
  const CUSTOM_SOUND = { dose: "clip", hold: "cuffs", fill: "inflate", breed: "machine", strip: "rip", write: "clip" };
