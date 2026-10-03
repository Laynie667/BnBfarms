# Ideas: bigger, more immersive farm systems

Written 2026-10-03. Nothing here is built yet. Everything stays opt-in, behind people's limits, with `?safe` always reaching staff.

---

## 1. How bigger systems should plug in: farm "modules"

Instead of growing the bot forever, big features become **separate scripts that plug into the running bot and Companion**.

- **Bot side:** the bot publishes a small API on its page, `window.Farmhand`:
  - `register({ name, commands, onTick, onActivity, onRoleplay, onJoin, state })`
  - helpers: `emote`, `tell`, `ask` (yes/no with consent), `rec`, `prodOf`, `L` (ledger slice for that module), `spot`, `zoneOf`, `walkTo`, `offerContract`, `offerOutfit`
  - Each module is its own userscript (`farmhand-auction.user.js`, `farmhand-dairy.user.js`…) that waits for `window.Farmhand` and registers. It gets its own saved data (`L.mods.<name>`) and its own commands, and inherits the bot's safety rules: limits, cooldowns, never silent, `?safe`.
- **Companion side:** the same idea. `window.FarmhandCompanion.registerTab({ view, id, label, render })` lets a module add a tab, and its data rides along in the `state` message under `mods.<name>`.
- **Why it's nicer:** you can switch a module on or off without touching the core, test it alone, and share it with other farm owners.

## 2. Map tools

- **Click-to-build zones in the Companion:** read the game's own map on your screen, click two tiles for a zone's corners, drag to resize, and pick a colour. No more walking to corners.
- **Fences:** a zone can be a pen. Stock assigned to it who wander out get a tug back (teleport) and a "naughty" mark, with an opt-in per person.
- **Speaker zones:** each speaker spot covers an area. Emotes about someone go only to the people in that area (see the speaker answer).
- **Heat map:** where people spend time and where scenes happen, so you can see which parts of the farm get used.
- **Paths and tours:** a guided tour walks the guest (via teleports or leash) through tour stops, with a line at each one.
- **Door overlay:** which doors open for which key tier, drawn on the map for staff.
- **Trough, milking and breeding stand timers** drawn on the map ("stall 2: 4 min left").
- **Sight-lines helper:** shows which tiles can see a spot, to place speaker spots well.

## 3. Bigger farm systems (the "immersive" ones)

- **Livestock auctions:** staff put an animal on the block, with their consent and their limits shown. Bidders bid farm bucks for a time-limited ownership: herd claim, breeding rights, a contract. Includes a countdown, bid emotes and a gavel.
- **Farm bucks economy:** earned from milk quota, chores, shows and stud fees; spent on stud service, luxury stays, shots, outfits, auction bids and freedom from the stocks.
- **Stud service bookings:** stock (or their herd leader) book a stud. The stud gets paid, and pregnancies get logged in the stud book with lineage.
- **Dairy grading and certificates:** weekly tasting panels and grade badges, plus a "Grade A Holstein" title on the board.
- **Shows and fairs:** udder judging, breeding stand trials, pony carting races, obedience trials for pets, with ribbons that stick on records.
- **Heat cycles and estrus sync:** a farm-wide "breeding week" where everyone opted in comes into heat together. It brings scent drift (studs nearby get rutty emotes) and calendar notices.
- **Pregnancy stages:** trimester messages, a growing belly size (ties into your custom belly art), cravings, a nesting phase, birthing events with a midwife role, and litters recorded in the herd book.
- **Lactation induction programs:** a multi-day staff-run plan with shots, pumping schedules and progress bars, until "fully in milk".
- **Inspection days:** vet rounds with a checklist for each animal (teeth, udders, holes, heat), all saved to the record.
- **Ear tags and brands:** tag numbers shown on records, with a branding ceremony emote. The tag goes on the outfit (crafted item name) automatically.
- **Herd book and pedigree charts:** family trees across generations in the Companion.

## 4. Kinkier, more taboo, still feasible (all opt-in, limits enforced)

- **Breeding stand queue:** a stand spot with a public queue. Studs take turns, the tally shows on the board, and there's a "bred count" per day.
- **Gloryhole shifts:** pen stock "on shift" anonymously. Users only see "stall 3", and the farm keeps the count. Use is logged, and it pays farm bucks to the stall's herd leader.
- **Cum inflation contests:** who can take the most before the bot pins them (it already tracks capacity and pinning). There's a leaderboard, and the winner gets a title.
- **Milk-drunk feeding chains:** stock nursing stock, with the bot tracking "drunk" states and stacked effects.
- **Forced lactation debt:** missing quota builds debt. It's paid off by pumping sessions or service, and too much debt drops you to a punishment tier.
- **Public use timers:** a stock member is put on "public use" for N minutes. Anyone may use them without asking (only if they said `?freeuse on`), with a timer on the board.
- **Mind-break tiers (with ECHS):** deeper contracts plus the Voice and trance depth together. Stock get "conditioning" milestones, speech gets more animal over time (BC+ pet speech intensity rising with tier), and nicknames get more degrading by tier.
- **Display cases:** the security wing shows stock on permanent display, with timed placard text that visitors can read with `?placard`.
- **Pony carting and plowing:** ponies harnessed to carts give timed "work" emotes and race times.
- **Rut events:** studs in rut get pent-up loads, louder emotes and a "must breed" timer, and the farm finds them a willing receiver from opted-in stock.
- **Chastity key auctions and keyholding:** staff hold keys (high security padlocks already exist), with key auctions and timed releases.
- **Humiliation board:** degradation counts, the "messiest stock" of the day, and photos of the fair (as text cards).

## 5. Easy wins next

1. Click-to-build zones in the Companion (map tool).
2. The module API (`window.Farmhand.register`), then move one feature (the fair) into a module to prove it works.
3. Farm bucks, since auctions, stud fees and debt all need it.
4. Pregnancy stages, which pairs with your belly art.

---

## 6. Approved add-on plan (Laynie, 2026-10-03)

Each add-on is its own userscript on the bot's PC. Players only need the Companion, which gets one "Farm extras" tab that draws whatever each add-on describes. No farm bucks anywhere.

- **0. Add-on support:** `window.Farmhand.register` in the bot, plus the general "Farm extras" Companion tab. Needed by everything below.
- **Map tools:**
  - **Approved:** click-to-build zones and spots, with walking kept as the backup. Pens with fences, stall timers, heat map, guided tours, door overlay.
  - **Placard spots:** visitors stand at one and read its text with `?placard`. Replaces display cases.
- **Barn life:**
  - **On or off:** the whole feed system has a switch, so it isn't whispering at people who don't use the Companion.
  - **Trough and water:** food at a trough spot and water at a water spot. Ties into BC+'s Pet module and MPA's virtual pet: their bowl activities (`BCP_BowlEat`, `BCP_BowlDrink`, `MPA_BowlEat`, `MPA_BowlDrink`) count when done on the spot. Water spots never run empty.
  - **Grooming:** only counts next to a staff member.
  - **No:** vet rounds, animal speech.
- **Stud book and pregnancy:**
  - **Pregnancy stages:** stages with belly sizes, plus belly emotes.
  - **Pedigree:** kept simple: sire, dam, and a total count for each sire and dam.
  - **Stud bookings:** no fee. Only staff add someone to the queue.
  - **Breeding week:** once a month.
- **Dairy:**
  - **Approved:** richer, more varied milking emotes in less clinical language, and milk-drunk effects.
  - **Certificate:** each week's certificate replaces the one before.
  - **No:** the induction plan (too complicated).
- **Work:**
  - **Shift tasks:** a task only completes when you're standing in its zone or spot.
  - **Staff leaderboard:** ranks staff by performance.
  - **Write-ups:** made by proprietors and herdmasters. The full text is seen only by the writer and the person written up; everyone else sees a count.
  - **Inspections:** approved, but optional. Only staff who switch inspections on get the warnings and share the score.
- **Gloryhole stalls:**
  - **Approved:** shifts, records, the board, opt-in, and punishment shifts.
  - **Herd leaders:** each use adds to the herd leader's staff score.
  - **Glory stall spots** (`glory-1`, `glory-2`…): build the booths with walls in the map editor, since walls block sight. BC has no special "hole" tile.
  - **No visitor needed:** if nobody is on that stall's visitor spot (`glory-1-visitor`), the stall runs a random scene every 10–30 minutes. It's delivered as whispers and whisper emotes to the person on the stall spot, and it adds to their numbers.
  - **Six scenes:** two each for mouth, pussy and ass, in plain, non-clinical language. Each one ends with the stranger finishing.
  - **The scenes respect the person:** blocked holes are skipped, and a funnel gag counts as the mouth. Limits are followed. A pussy finish counts toward breeding only if they're breedable.
- **Conditioning (hypno):** session sets for each species and each level.
- **Shows and fairs:**
  - **Events:** udder judging, breeding stand, pony cart race and obedience trial.
  - **Ribbons:** every ribbon stays on the record, but only the most recent one gets the ribbon emote.
- **Breeding week:** the third week of each month.
- **Stall timers:** the goal is to drain the occupant to 75% of their total capacity over time.
- **No:** farm bucks, auctions.
