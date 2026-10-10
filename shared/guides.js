// The command groups, shared by the bot's "?help me" and the Companion's Guides tab, so both always list
// exactly the same commands. (Add-on commands are added on top by each, from whatever add-ons are running.)
// In the Companion each command is a tap-to-send button; ones that need a name or number open in the box.
export const BOOKS = [["Rules", "rules"], ["Consent", "consent"], ["Tour", "tour"], ["Doors", "doors"], ["Species", "species"], ["Help", "help"]];

export const PUBLIC_GROUPS = [
  { name: "Safety", cmds: ["safe", "stuck", "staff", "report"] },
  { name: "Suggestion box", cmds: ["feedback <what you think>", "suggest <an idea>", "bug <what went wrong>", "feedback mine", "meh", "more"] },
  { name: "Gettin' started", cmds: ["help", "help me", "rules", "consent", "tour", "apply", "friend", "species", "luxury", "doors", "addons"] },
  { name: "You and the farm", cmds: ["today", "record", "keys", "who", "herd", "notice", "weather", "feeding", "curfew", "beg"] },
  { name: "Milk", cmds: ["stats", "board", "milkable", "quota"] },
  { name: "Stock with stock", cmds: ["milk <who>", "edge <who>", "groom <who>"] },
  { name: "Breedin'", cmds: ["breedable", "fertile", "mpreg", "freeuse", "jarok", "yes", "no", "naturalheat", "breed <who>", "cum <who>", "wash", "tally", "eggs", "praise", "degrade", "rights", "accept", "pedigree"] },
  { name: "Body", cmds: ["size", "measure", "penis", "futa", "gender <word>"] },
  { name: "Clothes", cmds: ["outfit", "outfits", "uniform", "outfit back"] },
  { name: "Mind", cmds: ["hypno", "teaseme"] },
  { name: "Fun", cmds: ["fair", "enter"] },
  { name: "Ribbons and the store", cmds: ["ribbons", "ribbons top", "store", "buy <item>", "gift <who> <potion>", "potions", "potions on", "dares on", "dare", "dared", "dare skip", "bench", "bench on", "bench me <minutes>", "use <mouth|pussy|ass>", "bench top"] },
];

export const STAFF_GROUPS = [
  { name: "Books", cmds: ["queue", "app <n>", "approve <who> livestock", "deny <who>", "appclear", "roster", "stock", "find <who>", "record <who>", "note <who>", "signed", "addfriend <who>", "unregister <who>", "unregister <who> <role>"] },
  { name: "Herd", cmds: ["claim <who>", "release <who>", "myherd", "herdname <name>", "herdcall", "herdsummon", "turnout <who>", "letup <who>", "brand <who>", "walk <who>"] },
  { name: "Stock", cmds: ["tier <who> <tier>", "stocks <who>", "unstock <who>", "vet <who>", "inspect <who>", "tease list"] },
  { name: "Contracts", cmds: ["contract list", "contract show deep <who>", "contract offer deep <who> 1w", "contract check <who>", "contract release <who>", "contract rules", "contracts"] },
  { name: "Outfits", cmds: ["outfit", "outfit offer <who>", "outfit offer <who> <species> <gender>"] },
  { name: "Barn", cmds: ["milk <who>", "collect <who>", "jars", "inseminate <who> <jar>", "machine <who> <jar>", "drain <who>", "edge <who>", "denial <who>", "ruin <who>", "nomilk <who> <hours>", "quota <who>", "heat <who>", "heatline", "shotlog"] },
  { name: "Map", cmds: ["spot", "spot set <name>", "spot place <name> <x> <y>", "zone", "zone who", "zone a <name>", "zone b <name>", "zone box <name> <ax> <ay> <bx> <by>", "zone pair <name> <group>", "tourstop", "setrescue", "where", "stucklog"] },
  { name: "Voice", cmds: ["voice", "voice on herd", "voice add herd <line>", "voice every herd 15"] },
  { name: "Work and play", cmds: ["clockin", "clockout", "hours", "done", "chores", "chore add <job> @<place>", "wheel", "spin", "begphrase", "score"] },
  { name: "Ribbons, potions, dares", cmds: ["ribbon give <who> <n>", "ribbon fine <who> <n>", "ribbons <who>", "potion give <who> <potion>", "potion end <who>", "dare <who>", "dare <who> reckless", "corral <who> <minutes>", "uncorral <who>", "bench <who> <minutes>", "unbench <who>", "wheel farm", "store approve <who>"] },
  { name: "Keys and calls", cmds: ["keys <who>", "keysync", "keydump", "grant <who> <tier>", "revoke <who>", "forced", "summon <who>", "summon all", "pasture", "onduty", "cover"] },
];

export const OWNER_GROUPS = [
  { name: "Proprietors", cmds: ["staffadd <who> <role>", "staffremove <who>", "goldkey <who>", "notice <text>", "feeding on", "curfew on", "fair open", "addons off <name>", "addons on <name>", "backup", "health", "edit <who>", "feedback list", "feedback list ideas", "feedback list lines", "feedback done <n>", "feedback export", "store price <item> <n>", "store off <item>", "store on <item>"] },
];

// "breed <who>" needs filling in; "stats" can be sent as it is
export const needsInput = (cmd) => /</.test(cmd);
export const cmdStem = (cmd) => cmd.replace(/\s*<.*$/, "").trim();
