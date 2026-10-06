# What to install (current versions)

Updated 2026-10-05. Every file is in the `dist/` folder (it syncs through OneDrive, so the phone app has it too).
In Tampermonkey's dashboard, compare each script's version with this list. Anything already at these versions is up to date.

| Script | File in `dist/` | Where it runs | Current |
|---|---|---|---|
| Farmhand Bot | `farmhand-bot.user.js` | the bot's PC (account 260239) | **0.15.2** |
| Glory stalls | `farmhand-glory-stalls.user.js` | the bot's PC | **1.4.0** |
| Barn life, Breeding, Conditioning, Dairy, Map tools, Shows, Work | `farmhand-<name>.user.js` | the bot's PC | **1.0.2** |
| Farmhand Companion | `farmhand-companion.user.js` | each player | **0.10.7** |
| Farm Watcher (diagnostics) | `farm-watcher.user.js` | whoever is recording | **1.0.2** |

## Sending a watch report

- Recorded on the bot's PC: it lands in that PC's Downloads folder. Just tell Claude "new report" and it reads the newest one.
- Recorded on a phone or another computer: attach the `.txt` file in the chat.
- Running the watcher on more than one game at once (the bot, yours, a tester's) lets Claude line them up into one timeline.

## Latest changes (newest first)

- **Bot 0.15.2**: hidden mod data some players' beeps carry (`{"messageType":...}`) is taken off before the bot reads them. It had an applicant (Pawz) stuck on the animal question: even "cat" and "not stock" were refused.
- **Bot 0.15.1**: a saved login the game refuses is not tried again (it was retrying a wrong password every 20 seconds, which can lock an account); the login boxes are left alone while someone types; repeated tries slow to one every two minutes. If the bot's badge says "saved login refused", save the right one from the Tampermonkey menu.
- **Bot 0.15.0**: a line about somebody is never said out loud on a map; `/record` works in the Companion box; chat typed into the Companion box is told where chat goes; add-ons found by their shown name; a typo'd command gets a private "did you mean"; a guide's name opens that guide; `[brackets]` in whispers.
- **Bot 0.14.9, Watcher 1.0.2**: the bot (and watcher) follow the game's connection when it's swapped (the cause of the "half loads": an hour deaf to everything while still sending).
- **Glory stalls 1.4.0**: two or three strangers at once through different holes, each with their own cock.
- **Bot 0.14.8**: the application's animal question understands everyday answers.
- **Bot 0.14.7**: approval keeps the full application on the record; `?record` shows it, plus what they're holding.
- **Companion 0.10.7**: resizable, full screen toggle, no forced zoom/keyboard on phones.
- **Companion 0.10.6**: farmhands see the farm map (read-only).
- **Bot 0.14.3–0.14.6**: the milking stall tells a private story (5–30 min, any species, breasts or cock, about 470 lines), says why it won't milk someone, rests 10–20 min after a session.
