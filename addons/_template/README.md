# A new part of the farm girl

The farm girl is one big script (the bot) plus **parts**: separate scripts on the bot's computer that plug into it.
Each part is a folder here in `addons/`. This folder is a template: copy it, rename it, and it's a working part.

1. Copy `addons/_template` to `addons/<your-part>` (lowercase and dashes, like `hayrides`).
2. In `addon.json`, set the `label` and the `description`. Leave `version` at `1.0.0`: the release bumps it, and the
   build puts it into the script (`version: __ADDON_VERSION__`), so never type a number in `index.js`.
3. In `index.js`, set `name` (the folder's name) and `label` (the same as `addon.json`'s).
4. `npm run build` makes `dist/farmhand-<your-part>.user.js`. `npm test` checks every part (tests/bot-parts.test.cjs).
5. `npm run release` bumps its version, tests everything and pushes it; the bot's computer picks it up from GitHub.

A part whose folder starts with `private-` never goes to GitHub, and with `"private": true` in its `addon.json` it
never auto-updates. Give it `only: [member numbers]` and nobody else can use it or see it listed.

## addon.json (the manifest)

| Field | What it's for |
|---|---|
| `label` | its name in Tampermonkey and on the Dashboard's 🧩 Bot parts tab |
| `version` | bumped by `npm run release` whenever its built script changes |
| `description` | a sentence in Tampermonkey |
| `private` | `true`: no auto-update link (for a `private-` part that isn't on GitHub) |

## What a part hands the bot (`connect({...})`)

| Field | What it does |
|---|---|
| `name`, `label`, `version` | who it is (`version: __ADDON_VERSION__`) |
| `guide` | what `?addons <name>` says |
| `only` | `[member numbers]`: a private part, invisible to everybody else |
| `setup(api)` | runs once; keep `api`, it's every helper the part gets |
| `commands` | `{ word: { usage, aliases, rank, private, run(c) } }`. `c` has `sender`, `args`, `rest`, `channel`, `api`, `reply(text)`. `rank`: anyone, staff, herdmaster, proprietor. A word the bot already has is skipped. |
| `on` | game events, below |
| `companion(mn)` | `{ cards: [...] }` for that person's Companion, below |
| `rates` | `{ milk(mn), semen(mn) }`: a multiplier (1 is no change; all parts together stay between 0.25 and 3) |
| `lines` | `{ pump(info), echo(info), stallMilk(info), … }`: write one of the farm's own lines, or return nothin' to leave the bot's |
| `vetoes` | `{ wash(mn) }`: return why not, or nothin' to allow it |

### Game events (`on`)

`tick()` every few seconds · `join(mn)` · `leave(mn)` · `bred(stud, mn, hole, ml, caught)` · `birth(mn, kids, sires)` ·
`climax(mn, text)` · `activity(data)` · `roleplay(mn, text, type)` · `fed(mn, kept, kind)` · `groomed(mn, by)` ·
`nurse(milker, drinker, ml, grade)` · `safe(mn)` · `echsUnder(mn, info)` · `echsWoke(mn, info)` · `audit(by, action, detail)`

### Cards (`companion(mn)`)

A card is `{ title, text, lines, bars, chips, toggles, input, buttons, note }`, all optional:
`lines: [[label, value]]` · `bars: [{ label, value, pct, kind }]` · `chips: [{ text, kind }]` ·
`toggles: [{ label, desc, on, cmd }]` (also listed in ⚙ Settings › Farm switches) · `input: { placeholder, label, cmd }` ·
`buttons: [{ label, cmd, accent }]`. Kinds: `good`, `alert`, `acc`.
`me: true` puts its bars and chips in the Livestock panel's Me card. `staff: true` shows it only on the Staff panel.

### Lines

Write them in the farm's voice: no clinical words, "they" for everybody, big pools so nothin' repeats. A tag on the
front says who a line fits, and never shows: `{v}` has a pussy · `{nv}` hasn't · `{c}` has a cock · `{nc}` hasn't ·
`{t}` has tits · `{nt}` flat · `{f}` female · `{m}` male · `{fu}` futa · `{fb}` femboy. `api.pickFor(mn, key, pool)`
picks a fresh one that fits them; `api.emote(text, mn)` and the rest fit any line to who it's about. The line
checker (tests/lines.test.cjs) reads every part's pools too.

### The helpers (`api`)

The full list is `addonApi` in `bot/src/parts/core/10f-addons.js`. The ones most parts use: `data()`, `save()`,
`say`, `emote`, `privateEmote`, `notice`, `reply`, `ask(mn, text, cb)`, `name(mn)`, `pickFor`, `body(mn)`,
`isStaff`, `ribbons(mn, n, why)`, `spot(name)`, `onSpot(mn, name)`, `here()`, `later(fn, ms)`.
