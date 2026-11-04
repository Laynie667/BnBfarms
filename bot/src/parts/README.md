# The bot, in folders by topic

These files are pieces of **one big function**. `build.mjs` joins them back together in **file-name order**
(00, 01, 02 … 10a, 10b … 18), *whatever folder each one is in*, and then bundles the result. So every piece can
still use everything defined in the others, and the folders are only there to find things by.

That means:
- Keep the number at the front of the name. It sets the order, not the folder.
- Two files can't have the same name, even in different folders (the build stops and says which).
- Moving a file to another folder changes nothing in the built bot. Renaming it can.
- `core/00-open.js` opens the function and `core/18-boot.js` closes it. Don't move those two lines.
- `const` and `let` values must be defined in an earlier (or the same) file, by name order, before they're used
  while the bot starts up. Functions can live anywhere.
- A `?command` is written in the command book (`core/01b-commands.js`), or at the bottom of the part that answers it.

| Folder | What's in it |
|---|---|
| [core](core/) | the frame: settings, the ledger, people and roles, the map, login, sending, the command book, reading chat, the big command switch, listeners, the heartbeat, start-up, add-on support |
| [office](office/) | paperwork: contracts and their watch, applications, guides, roam passes, the away books, renewals |
| [farm](farm/) | the daily farm: milk, semen and breeding, roleplay lines, feeding and chores, milking gear and scenes, the stall stories, the bench, the wheel, keepers and udders, the brood, the wash, reins, services, shots |
| [looks](looks/) | what somebody looks like: outfits, looks, marks, the brand, the farm's drawn-body look, lines that fit the body and gear |
| [voice](voice/) | talking: zones and voice, ?say, tease lines, ECHS |
| [ribbons](ribbons/) | the money side: ribbons and the store, potions and dares, the tithes, feats and perks, the mess store |
| [parasites](parasites/) | parasites and their strains, symbiotes, corruption and curses |
| [nursery](nursery/) | the nursery and its lines |
| [seasons](seasons/) | the farm's seasons and holidays: Halloween, winter and Yule, Ostara and Easter, Litha, Mabon |
| [traps](traps/) | the traps: how they work, every trap, their gear, sounds, ratings, ranks, switches and state. [traps/lines](traps/lines/) holds their bigger line pools, [traps/more](traps/more/) each trap's own lines grown (48 files), [traps/ends](traps/ends/) how the scenes end |

Every folder has its own README listing what's where. Later, pieces can be turned into real modules one at a
time, starting with the ones other parts use least.
