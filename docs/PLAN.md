# Splitting Farmhand into a bot and a Companion extension

Why: one script that whispers and beeps everything is hard for players to read (some clients and mods hide bot whispers), and one 6,000-line file is hard to work on.

## The big rule

**The bot keeps anything that changes the farm's records or that more than one person sees.** Milk, semen, sizes, breeding, pregnancy, shots, tiers, keys, herds, summons, the ledger and every room emote stay in the bot. An extension only sees its own player's screen, so it can't be the one who decides how full someone is.

**The Companion takes anything that's just for showing one player something.** Cards, guides, buttons, menus, reminders.

## Stage 1: the Companion panel (done, bot v0.9.25 + Companion v0.1.0)

- When a player with the Companion walks into the farm, it says hello to me with a hidden message. I remember them while they're in the room.
- When that player asks me anything (panel, `/farm stats`, `?stats` in a whisper, a beep), I send the answer to their panel as a hidden message instead of a whisper or beep.
- When I'd normally beep or whisper them a notice (shot kicked in, quota, breed ask), it lands in their panel too, with a 🌾 unread count.
- When they leave the room, or turn the Companion off, I go back to beeps and whispers.
- When someone without the Companion asks me something, nothin' changes for them.
- When the bot isn't in their room, the Companion beeps the bot instead, and the answer comes back as a beep.
- ?health shows how many Companions are connected.

## Stage 2: split the bot into topic files (no new features)

**Step 1 done (2026-10-03):** the bot now lives in `bot/src/parts/` (19 files, see the README there). The build joins
them back into one function, the built bot is the same, and all tests pass. Next step: turn the parts into
real modules one at a time.

Move pieces of `bot/src/farmhand.js` into their own files, one topic at a time, and run `npm test` after each move so nothing breaks:

`config.js` · `send.js` (queue, beep, whisper, emote) · `ledger.js` · `people.js` (roles, tiers, herds) · `map.js` (keys, spots, leashes) · `production.js` (milk, semen, quota) · `breeding.js` (scenes, knots, pregnancy, eggs) · `shots.js` · `guides.js` · `commands.js` · `listeners.js`

## Stage 3: prettier cards in the Companion

- When I answer ?stats, ?size, ?measure, ?vet or ?quota, I also send the numbers (not just text). The Companion draws them as a proper card with bars and icons.
- When I ask "do you want X to breed you?", the Companion shows **Yes** and **No** buttons.
- Guides live inside the Companion, so ?help opens instantly without me sendin' anything.
- The panel can be dragged, resized, and remembers if it was open.

## Stage 4: a panel for each role (Laynie's pick, 2026-10-02: separate versions for staff, livestock and guests)

- The bot's `welcome` sends the player's roles (not just `staff: true/false`), and sends an update when a role changes. The Companion builds its tabs from that. Someone with several roles gets every tab they qualify for.
- **Livestock** (and Luxury): My Body card (fullness bars, sizes), Milking (gear I'm in, rate, tank, quota), Breeding (heat, pregnancy, Yes/No on breed asks), Chores/Tally, Help.
- **Staff** (Farmhand, Mandated, Herdmaster, Proprietor): Herd tab (who's on the map, how full, which gear they're in), quick actions (milk, drain, edge, tier, brand, summon), jar shelf with an inseminate picker, applications waitin', on-call staff. Proprietor gets settings on top.
- **Guests**: welcome and tour, map guide, house rules and consent, an Apply button.
- The tabs only hide and show things. Every button still sends a normal command, and the bot still checks who's allowed.

## Stage 5: easy install for players

- Host the Companion's `dist` file at a public link (GitHub Pages, or a small public repo just for the Companion).
- Add `@downloadURL`/`@updateURL` to its header, so players click once to install and Tampermonkey keeps it updated.
- Later: ask to be listed in FUSAM (the addon manager most players already use). That needs a public repo.

## Things to know

- Hidden messages use `Content: "FarmhandMsg"`; the full list is in `shared/protocol.js`.
- The Companion only trusts hidden messages from the bot's member number, so nobody can fake one.
- The bot still runs the same way in Tampermonkey. The VPS move (headless browser) works with this layout too: it just loads `dist/farmhand-bot.user.js`.
