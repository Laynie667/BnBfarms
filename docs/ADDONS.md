# Farm add-ons

Add-ons are separate scripts that run **on the bot's computer**, in Tampermonkey, next to the Farmhand Bot script. They plug into the bot while it runs.

- **Players don't install anything.** Whatever an add-on wants to show appears in the Companion's **Farm extras** tab.
- **Players without the Companion** get the same messages through chat, whispers and beeps.

## Installing

1. Run `npm run build`. Every add-on appears in `dist/` as `farmhand-<name>.user.js`.
2. On the bot's browser, add the ones you want to Tampermonkey: Dashboard → Utilities → Import from file, or drag the file in.
3. Reload the bot's page. The bot's console says `Add-on loaded: …` for each one, and `?addons` lists them in the game.
4. To switch an add-on off without uninstalling it: `?addons off <name>` (proprietors). `?addons on <name>` brings it back.

## What's there

| Add-on | What it does | Main commands |
|---|---|---|
| glory-stalls | Stall spots, about 5-minute scenes every 10–30 minutes, real visitors, shifts, punishment shifts, a board | `?glory on`, `?stalls`, `?stall use/shift/punish/release` |
| barn-life | Opt-in food, water and grooming; troughs and water spots (BC+/MPA bowls count); milk-drunk | `?needs on`, `?eat`, `?drink`, `?groom`, `?refill` |
| breeding | Pregnancy stages, belly size 1–5, cravings, kicks, midwives, stud bookings, breeding week (15th–21st) | `?season on`, `?belly`, `?book`, `?midwife` |
| dairy | Warmer, more varied milking lines; weekly milk certificate | `?cert` |
| work | Staff leaderboard, private write-ups, opt-in inspections | `?top`, `?wu`, `?insp` |
| conditioning | Trance sessions for each species and level, tiers, nicknames | `?depth`, `?hyp`, `?trance`, `?wake` |
| shows | Udder judging, breeding stand, cart race, obedience trial, ribbons, placards | `?show`, `?ribbons`, `?sign` |
| map-tools | Opt-in fenced pens, weekly heat map | `?pen`, `?fence on`, `?busy` |

## Spots and zones the add-ons use

Place these from the Companion's Zones tab by clicking the map, or by standing on the tile and using `?spot set <name>`.

- `glory-1`, `glory-1-visitor` … for the glory stalls
- `trough-…`, `water-…` for barn life
- `race-1`, `race-2` … (spots or zones) for the cart race checkpoints
- `placard-<name>` and `display-<name>` for placards and display cases
- `milking…` for the milking stalls, which drain someone down to a quarter of their capacity and show a timer
- `speaker-…` for speaker spots, which speak for the bot so it never moves
- Zones are used for pens and for chores done at a place: `?chore add Muck out the pens @pens`

## Writing an add-on

Copy a folder in `addons/`, give it a new `addon.json` (`label`, `version`, `description`), and in `index.js`:

```js
import { connect } from "../_lib/connect.js";
let api;
connect({
  name: "my-thing", label: "My thing", version: "1.0.0",
  guide: "What it does, shown by ?addons my-thing.",
  setup(a) { api = a; },                        // api = the farm's helpers (below)
  commands: {                                   // ?hello; rank: anyone | staff | herdmaster | proprietor
    hello: { private: true, run: (c) => c.reply("Hi " + c.api.name(c.sender)) },
  },
  on: {                                         // any of these
    tick() {},                                  // every heartbeat (~20 s)
    activity(data) {},                          // a game action (api.activityInfo(data) reads it)
    roleplay(mn, text, type) {},                // an emote or chat line
    join(mn) {}, leave(mn) {}, safe(mn) {},     // safe = they used their safeword: stop everything for them
    nurse(milker, drinker, ml, grade) {}, birth(mn, kids, sires) {},
  },
  rates: { milk: (mn) => 1, semen: (mn) => 1 }, // nudge production (0.25×–3× overall)
  lines: { pump: (info) => "…" },               // write the farm's milking lines (pump, echo, stallMilk, stallSemen, stallDone, stallDoneSemen, gearDry)
  companion: (mn) => ({ cards: [ /* title, text, lines, bars, chips, toggles, buttons, input, note */ ] }),
});
```

**Helpers** (`api.…`):
- **Talking:** `say`, `emote(text, aboutWho)`, `privateEmote`, `privateSay`, `voice`, `whisper`, `notice`, `tell`, `ask(mn, text, yes => …)`, `notifyStaff`.
- **People:** `name`, `find`, `rec`, `here`, `onMap`, `isStaff`, `isHerdmaster`, `isProprietor`, `hasRole`, `herdLeaderOf`, `species`, `gender`, `limitBlocks`.
- **Bodies:** `prod`, `HOLES`, `holeBlocked`, `hasVulva`, `makesSemen`, `makesMilk`, `capacity`, `milkCap`, `drainMilk`, `drainSemen`, `tally`, `inHeat`, `startHeat`, `rollConception`, `milkGrade`, `funnelOn`, `gearOf`.
- **Map:** `pos`, `spot`, `spots`, `onSpot`, `whoOnSpot`, `zones`, `zonesOf`, `inZone`, `teleport`.
- **Saving and scores:** `data()` (this add-on's saved data), `save`, `audit`, `peek(otherAddon)`, `staffPoints`, `staffScores`, `yieldWeek`, `studbook`, `hoursThisWeek`, `clockedIn`.
- **Time:** `later`, `dayKey`, `weekKey`.

Every call into an add-on is wrapped: if one breaks, the bot logs `add-on <name> (<what>)` and carries on.

## How the bot's messages reach people

These rules are checked against the game's own code (`ChatRoom.js`, `Speech.js`, the server's `app.js`).

- **Map rooms:**
  - A room **emote** is only seen by people who can see the sender, and **chat** only by people who can hear them.
  - A **whisper** only arrives within 1 tile.
  - Anything inside **( )** is out-of-character, and the map lets it through to **everyone on the map**.
- **So:**
  - The bot never puts round brackets in a room emote or chat line. The send queue turns them into [ ], so "+75 mL" no longer leaks map-wide.
  - Private whispers start with "(" on purpose, so they reach the person anywhere on the map.
- **Speaker spots:** these send the line privately to the people near the speaker or the person it's about. Companion users see a normal emote line; everyone else gets the out-of-character whisper.
- **Whispers and Companion messages** only reach people in the same room.
  - If someone has left, the message goes as a beep instead.
  - If a beep can't reach them, it's kept for later (see below).
- **Beeps** only arrive if the person has **the bot on THEIR friend list**. The bot having them on its own list isn't enough.
  - The bot asks the server every minute who is friends both ways and online, and only beeps those people.
  - `?friend` says which half is missing.
- **Messages it can't deliver** (offline, or not reachable) aren't replayed one by one.
  - The last 10 are kept.
  - When the person is back, they get one short summary: how many messages, and the gist of the latest three.
- **Companion users also get a real beep** for urgent things, because a beep sounds and pops up even with the panel closed:
  - safewords, reports and "stuck" calls to staff
  - summons
  - `?staff` calls
  - new applications
  - a short pointer whenever a yes/no question is waiting

  Routine lines (tease, heat, milking, voice) stay in the panel, and in the chat log if "Farm messages in chat too" is on.
- **Staff Queue tab:**
  - Applications waiting, with Read / Approve as… / Deny.
  - How many messages the bot has waiting to send, how many people have messages held, and how many people are beep-able right now.

## What lives in the bot, and what could move out

**Keep in the bot:** these are everything else's foundation, and they touch safety.
- Records, roles, keys and doors
- Applications and `?safe`
- Summoning, contracts (BC+) and outfits
- Milk and semen numbers, breeding consent, pregnancy and birth
- Speaker spots and sending

**Good candidates to move into add-ons next:** they're self-contained and easy to switch off or change.

| Now in the bot | Why it would be nicer as an add-on |
|---|---|
| The fair (`?fair`, `?score`, `?enter`) | It overlaps with the shows add-on, so one place for all events |
| The wheel, begging, curfew, weather | Flavour that each farm may want to tune or switch off |
| Tease lines, heat lines, roleplay flavour lines | Pure writing: easy to swap for a different voice or language |
| Stocks, leash, tour | Self-contained scenes |
| Rut day | A calendar event like breeding week |

## More ideas for calculations and mechanics (as add-ons)

- **Body condition:**
  - Weight and fitness that drift with feeding (barn life) and exercise (time in pasture zones, races).
  - Shown on the record, and nudges milk yield and stamina.
- **Lactation curve:** milk yield rises for about two weeks after a birth or induction, peaks, then slowly tapers unless milked often. Uses the `rates.milk` hook.
- **Seed quality:**
  - Grade semen like milk: rest, denial and feeding raise it, overuse lowers it.
  - It feeds into `rollConception` as a bonus, and into breeding show scores.
- **Genetics in the stud book:**
  - Litters inherit traits (udder size, fertility, litter size) from sire and dam with a bit of chance.
  - Shows on the pedigree, and makes stud bookings matter.
- **Stamina and exhaustion:** every scene, milking and race costs stamina; rest in the barn restores it. Exhausted stock get lower show scores and slower yields.
- **Arousal meter:** builds from touches, machines and denial, drops with orgasms. High arousal raises milk let-down and conception odds. Ties into ECHS depth via the Companion.
- **Reputation:**
  - Per-person reputation from ribbons, certificates, staff points and write-ups.
  - Shown as a title, and unlocks tiers or private pens.
- **Seasons:** a farm calendar where spring raises fertility, summer raises milk, winter keeps everyone in the barn. Ties into weather and breeding week.
- **Pasture rotation:** pens get "grazed out" if overused, and staff move herds between them as a shift task.
- **Daily report card:**
  - One morning beep per person summarising yesterday: milk, loads taken, chores, ribbons, needs.
  - This reuses the summary-beep idea, so nobody gets spammed.

## The command queue

Every command goes through one queue, so none get lost:
- **Commands sent too quickly** wait their turn, in order: up to 10 per person, or 2 for room chat so nobody floods the room. Past that, the person is told to slow down instead of being ignored.
- **A double tap** of the same command within a second and a half runs once.
- **Stale commands:** anything that has waited over 5 minutes is dropped, and the person is told so.
- **Errors:** a command that breaks, in the bot or an add-on, still answers ("hit a snag"), and the farm log records which command it was and why.
- **Disconnects:** messages wait out a dropped connection and go out once it's back. A message that fails to send is retried twice.
- **Stuck timers:** a pacing timer that never fires can't freeze sending. Each heartbeat also moves anything waiting.
