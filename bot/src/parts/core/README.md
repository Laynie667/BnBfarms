# Core

The frame the rest hangs on. Start here to find how the bot runs.

| File | What's in it |
|---|---|
| 00-open.js | imports, and the start of the one big function |
| 01-config.js | `CFG`: every setting |
| 01b-commands.js | the command book: every `?command`, who may use it, and which part answers it |
| 02-core.js | page handle, roles, live `state` |
| 03-ledger.js | the saved ledger (`L`) |
| 03b-storage.js | keepin' the books safe past what Tampermonkey holds: the browser's own database, and backups |
| 04-people.js | roles, keys, tiers, herds |
| 05-map.js | pasture lock, key sync, named spots, summoning |
| 06-login.js | friends, login, finding the room; the test hooks |
| 07-send.js | anti-idle, sending (say, whisper, beep), Companion link, names, greetings |
| 07b-companion-sync.js | what the bot tells each Companion (the panel's numbers, the store, the Office) |
| 10f-addons.js | add-on support: `window.Farmhand.register` for the separate bot-part scripts |
| 10q-feedback.js | ?meh and ?more on a farm line, and ?feedback |
| 10um-friend-check.js | taking somebody off the books entirely |
| 10z9-chatlog.js | the diagnostic records a Companion sends (only for those who switched it on) |
| 14-parser.js | reading commands from chat, whispers and beeps; cooldowns; "did you mean" |
| 15-commands.js | the big switch: what the older `?commands` do |
| 16-listeners.js | game event hooks |
| 17-heartbeat.js | the timers that run every few seconds |
| 18-boot.js | start-up, and the end of the one big function |

The build joins every part by file name, not folder: see [the parts README](../README.md).
