// The command groups the Companion's Guides tab shows (the same groups as the bot's ?help).
// Each command is a tap-to-send button; ones that need a name or number open in the command box instead.
export const BOOKS = [["Rules", "rules"], ["Consent", "consent"], ["Tour", "tour"], ["Doors", "doors"], ["Species", "species"], ["Help", "help"]];

export const PUBLIC_GROUPS = [
  { name: "Safety", cmds: ["safe", "stuck", "staff", "report"] },
  { name: "Gettin' started", cmds: ["help", "rules", "consent", "tour", "apply", "friend", "species", "luxury", "doors"] },
  { name: "You and the farm", cmds: ["record", "keys", "who", "herd", "notice", "weather", "feeding", "curfew", "beg"] },
  { name: "Milk", cmds: ["stats", "board", "milkable", "quota"] },
  { name: "Breedin'", cmds: ["breedable", "fertile", "freeuse", "jarok", "yes", "no", "naturalheat", "breed <who>", "cum <who>", "wash", "tally", "eggs", "praise", "degrade", "rights", "accept", "pedigree"] },
  { name: "Body", cmds: ["size", "measure", "penis", "futa", "gender"] },
  { name: "Fun", cmds: ["fair", "enter", "teaseme"] },
];

export const STAFF_GROUPS = [
  { name: "Books", cmds: ["queue", "app <n>", "approve <who> livestock", "deny <who>", "appclear", "roster", "stock", "find <who>", "record <who>", "note <who>", "signed", "addfriend <who>", "unregister <who>"] },
  { name: "Herd", cmds: ["claim <who>", "release <who>", "myherd", "herdname <name>", "herdcall", "herdsummon", "turnout <who>", "letup <who>", "brand <who>", "walk <who>"] },
  { name: "Stock", cmds: ["tier <who> <tier>", "stocks <who>", "unstock <who>", "vet <who>", "inspect <who>", "tease list"] },
  { name: "Contracts", cmds: ["contract list", "contract show deep <who>", "contract offer deep <who> 1w", "contract check <who>", "contract release <who>", "contract rules"] },
  { name: "Barn", cmds: ["milk <who>", "collect <who>", "jars", "inseminate <who> <jar>", "drain <who>", "edge <who>", "denial <who>", "ruin <who>", "nomilk <who> <hours>", "quota <who>", "heat <who>", "heatline", "shotlog"] },
  { name: "Farm", cmds: ["spot", "tourstop", "setrescue", "where", "stucklog"] },
  { name: "Work and play", cmds: ["clockin", "clockout", "hours", "done", "chores", "chore", "wheel", "spin", "begphrase", "score"] },
  { name: "Keys and calls", cmds: ["keys <who>", "keysync", "keydump", "grant <who> <tier>", "revoke <who>", "forced", "summon <who>", "summon all", "pasture", "onduty", "cover"] },
];

export const OWNER_GROUPS = [
  { name: "Proprietors", cmds: ["staffadd <who> <role>", "staffremove <who>", "goldkey <who>", "notice <text>", "feeding on", "curfew on", "fair open", "backup", "health"] },
];

// "breed <who>" needs filling in; "stats" can be sent as it is
export const needsInput = (cmd) => /</.test(cmd);
export const cmdStem = (cmd) => cmd.replace(/\s*<.*$/, "").trim();
