# What to install (current versions)

Updated 2026-10-07. Every file is in the `dist/` folder (it syncs through OneDrive, so the phone app has it too).
In Tampermonkey's dashboard, compare each script's version with this list. Anything already at these versions is up to date.

| Script | File in `dist/` | Where it runs | Current |
|---|---|---|---|
| Farmhand Bot | `farmhand-bot.user.js` | the bot's PC (account 260239) | **0.16.0** |
| Glory stalls | `farmhand-glory-stalls.user.js` | the bot's PC | **1.5.2** |
| Conditioning | `farmhand-conditioning.user.js` | the bot's PC | **1.0.3** |
| Barn life, Breeding, Dairy, Map tools, Work | `farmhand-<name>.user.js` | the bot's PC | **1.0.2** |
| Shows | `farmhand-shows.user.js` | the bot's PC | **1.0.3** |
| Farmhand Companion | `farmhand-companion.user.js` | each player | **0.11.0** |
| Farm Watcher (diagnostics) | `farm-watcher.user.js` | whoever is recording | **1.0.3** |

## Sending a watch report

- Recorded on the bot's PC: it lands in that PC's Downloads folder. Just tell Claude "new report" and it reads the newest one.
- Recorded on a phone or another computer: attach the `.txt` file in the chat.
- Running the watcher on more than one game at once (the bot, yours, a tester's) lets Claude line them up into one timeline.

## Latest changes (newest first)

- **Bot 0.16.0, Companion 0.11.0, Glory stalls 1.5.2, Shows 1.0.3: ribbons, the store, potions, dares, the corral, and a wheel that does things.**
  - **Ribbons** are the farm's scrip and keep day to day. Earned for the milk quota (3), a full stall session (1), a chore (2), a glory shift (3, punishment 1), a dare (2, reckless 4), placin' in a show (5/3/2), best milk or top sire of the week (10), and from staff (`?ribbon give|fine <who> <n> [why]`: farmhands up to 5, herdmasters 15). A missed quota costs 2. Up to 40 a day from farm things. The **Sunday till** names the week's top earner (+5) and biggest spender. `?ribbons`, `?ribbons top`.
  - **The store** (`?store`, `?buy`, and the Companion's new 🎀 Store tab): wheel spins, lucky spins, a luxury day, skip a chore, quota grace, a greetin' of your own (staff approve it: `?store approve|reject <who>`), a ribbon tag on ?who, a dedication (praise, or a tease for those who like it), a bounty on a chore, shots, and every potion. Potions and dedications can be gifts; a gift asks them first and is only paid for on a yes. Proprietors: `?store price|off|on <item>`.
  - **16 potions** that wear off. Rewards: Clover Cream, Golden Hour, Blue Ribbon Musk, Honey Tongue. Punishments: Bitterroot (ruined orgasms), Heavy Udder Draught (fill 3x, stalls refuse), Moo Juice (the Companion turns some of your words into your animal's noise), Bell Tonic, Needy Nectar (beg to end it). Just because: Hiccup Fizz, Featherlight, Wrong Barn (another species for an hour), Big Britches, Shrinking Violet, Echo Elixir, Heat Mist. Anyone else's potion needs `?potions on` (a Toggles switch); hard limits rule some out; the safeword pours them all out.
  - **Dares** (`?dares on`): 20 dares, 8 of them reckless. `?dared` when done, `?dare skip` to chicken out. Staff: `?dare <who> [reckless] [your own]`.
  - **The corral**: `?corral <who> [minutes] [milking|spot]`, at pen spots (`?spot set pen`, pen-2…) or a milkin' stall. Wander off and the farm girl walks you back. (`?pen` stays the map-tools zone pen.)
  - **The wheel does things now.** 33 farm slices (`?wheel farm on|off`): the stocks, the corral, strapped in the milkin' stall, glory stall punishment shifts, the spinner's lead, denial, potions, dares, ribbons and fines, a luxury hour, quota grace, early release. Staff action slices: `?wheel add punish Off to the pen, %name% => pen 30`. A slice that can't happen to them (limits, switches, missing spots) is skipped.
  - From the Oct 7 watch: somebody whose application is waitin' is told so, not "Say ?apply first!"; a one-letter typo in `?help` (glorty, bodyu) opens the right guide.
  - The Shows add-on's placings list is now `?prizes` (`?ribbons` is the scrip).
- **Bot 0.15.9**: livestock were getting whispers meant for someone else. A single word of a name counted as naming that person, so "BnB Cow Mira comes apart..." also went to BnB CuntBitch and BnB Dog Nikto (the shared "BnB"), and any line with "the" in it went to Eve the Kitt. Shared farm words (BnB, the, cow, dog, pony, kitty, miss, pet...) no longer count as a name on their own; "Mira", "Nikto" and "Eve" still do.
- **Bot 0.15.8, Companion 0.10.11, Glory stalls 1.5.1** (Laynie and Sally, Oct 6): **LSCG splatters actually land now.** The bot doesn't run LSCG, so it never knew who had splatters on and never sent one; it now reads LSCG's own room messages (sent when someone joins or changes a setting) and the Companion reports its player's switch. Loads that go **inside** leave a splatter where they went in (pussy, ass, mouth), from breeding and from the glory stalls, as well as pull-outs. A stud who really cums (the game's orgasm) while inside somebody fills them; before, only typing a cum word did, and a real orgasm was "wasted". New studs start with full balls instead of empty (Sally's first load was "a little dribble, 2 mL"). LSCG still has the last word: with "lovers only" on, add the bot (260239) to your LSCG splatter whitelist.
- **Bot 0.15.7** (from the Oct 6 watch reports): livestock and guests who say ?contract now see their own farm contracts (offered, signed) and how to get one; they were being told it's staff-only, and a second try got no answer at all. "/bot cert" typed into a beep works like "bot cert". The "I whispered that one to you, add me as a friend" tip is no longer said out loud after every command a newcomer types: it's added to their whisper, once every 30 minutes. The command list now says that `safe` stops everything and fetches staff (someone said it just to find out what it does).
- **Bot 0.15.6, Companion 0.10.10**: proprietors can fix anybody's record. `?edit <who>` shows what's on file; `?edit <who> <field> <new value>` changes it: name, species, gender, stay, depth, limits, triggers, aftercare, notes, or any application answer as `app.<question>` (likes, curious, soft, else...). `clear` as the value empties one. A name set this way is what the farm calls them from then on (greetings no longer overwrite it); `?edit <who> name clear` goes back to their game nickname. Every edit goes in the audit log. In the Companion: Dashboard → **Records**.
- **Bot 0.15.5**: contracts are made for whoever they're offered to. The farm's fun/deep/nhl contracts give the nickname "BnB {Species} {name}" (BnB Cow Vicky; BnB Pet Rya for someone with no animal), and any saved contract can use {name} {Species} {species} {pet} in any text setting, the title or the terms.
- **Glory stalls 1.5.0**: scenes are about what's done to the person in the stall, not what they do (the reaction lines are rewritten); every scene opens with how they're arranged and follows from it: **punished** on a punishment shift (locked in the frame or stocks, rougher strangers, longer scenes, "the shift isn't over"), **bound** if they came in tied, or **by choice** (kneeling at the hatch, over the bench, on all fours or against the wall).
- **Companion 0.10.9**: Safe word, I'm stuck and Call staff live in their own 🆘 Safety tab (second tab on the Guest and Livestock panels; staff and proprietors reach it from their Livestock panel). If two copies of the Companion are installed, the second says so in chat, naming both versions, and steps aside instead of failing.
- **Bot 0.15.4, Glory stalls 1.4.2** (from the marks in the watch reports): the roster counts only people with a role ("78 registered" was counting old files); "kitty" instead of "kitt"; a stranger who pulls out (face, back) counts as a splatter, not a load inside, and leaves them cum-covered till ?wash; and players whose **LSCG** has splatters on get LSCG's real splatters drawn on them from glory stall pull-outs and ?cum on them (with "lovers only" on in LSCG, add the bot, 260239, to the LSCG splatter whitelist).
- **Conditioning 1.0.3**: a word dropped in at the start of a sentence gets its capital ("Cows don't need words"). **Watcher 1.0.3**: panel updates show which parts changed, to track down why some players get two or three a minute.
- **Bot 0.15.3, Glory stalls 1.4.1, Companion 0.10.8**: story lines say a long name in full once, then the short part ("Alexia's Laynie's lips ... Laynie's mouth"); the Companion's private feelings (pregnancy, full udders, plugs, heat...) have several lines each instead of one, and don't repeat the recent ones.
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
