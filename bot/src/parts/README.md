# The bot, one topic per file

These files are pieces of **one big function**. `build.mjs` joins them back together in file-name order
(00, 01, 02 …) and then bundles the result, so every piece can still use everything defined in the others.

That means:
- Keep the number at the front. It sets the order.
- `00-open.js` opens the function and `18-boot.js` closes it. Don't move those two lines.
- `const` and `let` values must be defined in an earlier (or the same) file before they're used while
  the bot starts up. Functions can live anywhere.

| File | What's in it |
|---|---|
| 00-open.js | imports, start of the bot |
| 01-config.js | `CFG`: every setting |
| 02-core.js | page handle, roles, live `state` |
| 03-ledger.js | the saved ledger (`L`) |
| 04-people.js | roles, keys, tiers, herds |
| 05-map.js | pasture lock, key sync, named spots, summoning |
| 06-login.js | friends, login, finding the room |
| 07-send.js | anti-idle, sending (say, whisper, beep), Companion link, names, greetings |
| 08-production.js | milk, semen, breeding, pregnancy, heat, shots |
| 09-roleplay.js | roleplay triggers and flavour lines |
| 10-farm-life.js | feeding, curfew, stocks, leash, tour, weather |
| 10b–10e | contracts, outfits, zones and voice, milking gear |
| 10f-addons.js | add-on support: window.Farmhand.register for the separate add-on scripts |
| 10g-scenes.js | the beat-by-beat scenes for milkin', collectin', machine and syringe breedin', edgin' |
| 11-work.js | shift clock, chores, wheel, begging, fair |
| 12-guides.js | help texts and guides |
| 13-apply.js | applications |
| 14-parser.js | reading commands from chat, whispers and beeps |
| 15-commands.js | what every `?command` does |
| 16-listeners.js | game event hooks |
| 17-heartbeat.js | the timers that run every few seconds |
| 18-boot.js | start-up |

Later, pieces can be turned into real modules one at a time, starting with the ones other parts use least.
