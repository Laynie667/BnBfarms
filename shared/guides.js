// The command groups, shared by the bot's "?help me" and the Companion's Guides tab, so both always list
// exactly the same commands. (Add-on commands are added on top by each, from whatever add-ons are running.)
// In the Companion each command is a tap-to-send button; ones that need a name or number open in the box.
export const BOOKS = [["Rules", "rules"], ["Consent", "consent"], ["Tour", "tour"], ["Doors", "doors"], ["Species", "species"], ["Help", "help"]];

export const PUBLIC_GROUPS = [
  { name: "Safety", cmds: ["safe", "stuck", "staff", "report"] },
  { name: "Gettin' started", cmds: ["help", "help me", "rules", "consent", "tour", "apply", "friend", "species", "luxury", "doors", "addons"] },
  { name: "You and the farm", cmds: ["record", "keys", "who", "herd", "notice", "weather", "feeding", "curfew", "beg"] },
  { name: "Milk", cmds: ["stats", "board", "milkable", "quota"] },
  { name: "Breedin'", cmds: ["breedable", "fertile", "freeuse", "jarok", "yes", "no", "naturalheat", "breed <who>", "cum <who>", "wash", "tally", "eggs", "praise", "degrade", "rights", "accept", "pedigree"] },
  { name: "Body", cmds: ["size", "measure", "penis", "futa", "gender <word>"] },
  { name: "Clothes", cmds: ["outfit", "outfits", "uniform", "outfit back"] },
  { name: "Mind", cmds: ["hypno", "teaseme"] },
  { name: "Fun", cmds: ["fair", "enter"] },
];

export const STAFF_GROUPS = [
  { name: "Books", cmds: ["queue", "app <n>", "approve <who> livestock", "deny <who>", "appclear", "roster", "stock", "find <who>", "record <who>", "note <who>", "signed", "addfriend <who>", "unregister <who>"] },
  { name: "Herd", cmds: ["claim <who>", "release <who>", "myherd", "herdname <name>", "herdcall", "herdsummon", "turnout <who>", "letup <who>", "brand <who>", "walk <who>"] },
  { name: "Stock", cmds: ["tier <who> <tier>", "stocks <who>", "unstock <who>", "vet <who>", "inspect <who>", "tease list"] },
  { name: "Contracts", cmds: ["contract list", "contract show deep <who>", "contract offer deep <who> 1w", "contract check <who>", "contract release <who>", "contract rules", "contracts"] },
  { name: "Outfits", cmds: ["outfit", "outfit offer <who>", "outfit offer <who> <species> <gender>"] },
  { name: "Barn", cmds: ["milk <who>", "collect <who>", "jars", "inseminate <who> <jar>", "machine <who> <jar>", "drain <who>", "edge <who>", "denial <who>", "ruin <who>", "nomilk <who> <hours>", "quota <who>", "heat <who>", "heatline", "shotlog"] },
  { name: "Map", cmds: ["spot", "spot set <name>", "spot place <name> <x> <y>", "zone", "zone who", "zone a <name>", "zone b <name>", "zone box <name> <ax> <ay> <bx> <by>", "zone pair <name> <group>", "tourstop", "setrescue", "where", "stucklog"] },
  { name: "Voice", cmds: ["voice", "voice on herd", "voice add herd <line>", "voice every herd 15"] },
  { name: "Work and play", cmds: ["clockin", "clockout", "hours", "done", "chores", "chore add <job> @<place>", "wheel", "spin", "begphrase", "score"] },
  { name: "Keys and calls", cmds: ["keys <who>", "keysync", "keydump", "grant <who> <tier>", "revoke <who>", "forced", "summon <who>", "summon all", "pasture", "onduty", "cover"] },
];

export const OWNER_GROUPS = [
  { name: "Proprietors", cmds: ["staffadd <who> <role>", "staffremove <who>", "goldkey <who>", "notice <text>", "feeding on", "curfew on", "fair open", "addons off <name>", "addons on <name>", "backup", "health"] },
];

// "breed <who>" needs filling in; "stats" can be sent as it is
export const needsInput = (cmd) => /</.test(cmd);
export const cmdStem = (cmd) => cmd.replace(/\s*<.*$/, "").trim();
