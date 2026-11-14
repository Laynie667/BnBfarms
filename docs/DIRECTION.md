# Where the farm is headed

> **📌 PLANNED DIRECTION, not started.** Agreed with Laynie on 2026-11-14 as the way forward. Nothing in this file
> is built yet. It's the map for when the work begins. Each piece gets talked through again before it's built, and
> the farm keeps running on today's bot and Companion until each new piece is tested and switched over.
>
> **Marks:** ✅ decided · 📌 planned · ❓ still to decide · ⚠️ a limit to keep in mind

---

## Why

The week of Nov 7 showed where the current setup strains:

- **The bot lives in a full game tab** on Laynie's PC, sharing it with a dozen other mods. Every mod update, every
  game update (R133's picture cache) and every picture drawn lands on it. It crashed out of memory again and again,
  and the farm itself was only ever a small part of the load.
- **The ledger is one 2 MB blob,** rewritten through Tampermonkey every few seconds.
- **The farm leans on other people's mods:** BC+ for contracts and summons, ECHS for hypnosis. Not everyone has them,
  and not everyone will add the bot to their BC+ (Laynie: "handling the punishments through bc plus wont work at
  large then, because not everyone will add the bot to their bc plus").
- **The Companion only really works in the farm room,** because it talks to the bot through room chat.
- **The studio's drawn parts are painted on top of the finished character,** so held items, tattoos and brands
  layer wrong.
- **Everything is public on GitHub,** so private files can slip out (the chat records on Nov 7).

Laynie, Nov 14: *"I would like to build everything better, the companion extension, its back end, the studio and how
it ties in. I would like to do conditioning and the hypno in a much better, more manageable way as well."*

---

## The shape of it

### ✅ One language: TypeScript, everywhere
The bot, the Companion, the add-ons and the studio, in one project. The game is JavaScript, so the Companion has to be
too, and TypeScript is JavaScript that checks itself. One language means the farm's lines, species tables, body
engine and the messages between bot and Companion are written once and shared.

### 📌 The bot splits in two: a brain and hands
- **The brain:** a Node program on the farm's own server, running day and night. All the farm's logic, records, lines
  and scenes. It never draws anything, so nothing in it can run out of picture memory.
- **The hands:** a small piece in a game tab that only passes things across: what's said and done in the room goes to
  the brain; the brain's words, moves and gear changes come back. It runs headless on the same server with drawing
  switched off. Later it can be swapped for a direct connection to the game's server without touching the brain.

### 📌 A real database (SQLite)
Each person their own record, only what changes gets saved, with proper backups. Chat records live in their own private
table that clears itself on a schedule, never anywhere near the code.

### ✅ The Companion talks to the farm server directly
Laynie: *"I would be comfortable with the companion talking to the farm server."*
- Proven by a one-time code the bot whispers in-game, so the server knows who's who.
- **It works in any room:** contracts, punishments, trance, the panel and the farm's voice follow stock and staff
  wherever they go, not only where the bot is standing.
- Heavy things (outfits, body art, staff tools) come straight from the server, not squeezed through room chat.

### ✅ Members only
Laynie: *"public fusam listing might come later, but ideally my add-on would remain with our staff and livestock, but
work in a larger range of rooms, more consistently."*
- 📌 The Companion becomes a tiny loader. Once someone proves who they are, the server hands them the real Companion,
  and only people on the farm's books get it. Updates arrive on their own.
- ❓ A public FUSAM listing: maybe later, not now.

### 📌 A private dashboard for the proprietors
A web page on the server for Laynie and Alexia: contracts, punishments, triggers and people. Logs too, which only
221397 sees.

### 📌 Two repositories
- **Public:** only what players must be able to see.
- **Private:** the brain, the lines, the dashboard and every bit of data.
- Every change is checked automatically before it can go out.

### 📌 The tools

| Piece | Tools |
|---|---|
| Brain (server) | Node 24 + TypeScript, SQLite, a WebSocket API for Companions |
| Hands | a headless game tab (Playwright, drawing off), later perhaps a direct connection |
| Companion | TypeScript, Preact for the panel, built with Vite |
| Studio | a Vite web app sharing the Companion's body engine; publishes to the server |
| Scenes and hypno | Ink (inkle's story language), run by the brain |
| Lines | plain text files with tags (body, species, consent), checked automatically |
| Tests | Vitest for the logic (seconds), a few full runs against a pretend game server |
| Delivery | private repo + automatic checks; Companion bundle served by the farm server |

---

## The stretch goals (Laynie, Nov 14)

### 1. 📌 Our own BC+/BCX: farm rules inside the Companion
BCX and BC+ work by running on the player's own game and holding it to rules. The Companion already runs there (the roam
gate is exactly this), so it grows a **farm rules** module with only what the farm needs:

- **The fence:** no leaving, roam passes, summoned home from any room.
- **Speech:** forbidden words, animal noises only, doll-talk, no whispers or emotes.
- **Body:** kneeling or all fours, no undressing, no freeing themselves.
- **Restraints that come back** if struggled out of, on timers.
- **Senses:** blind or deaf, through the game's own effects.
- **A lead, a forced nickname, orgasm control.**

The server keeps who's under which rule, from which contract, until when.

⚠️ **The honest limit** (the same as BCX's): a player can switch the Companion off. The server watches for its
check-ins, and going quiet in the middle of a contract or a sentence counts as an offence.

BC+ stays welcome as a bridge for those who have it; nobody needs it.

### 2. 📌 Our own hypnosis and conditioning
- **Sessions written in Ink:** induction, deepeners, suggestions, triggers, wake. They branch on depth, species,
  the triggers already set, and how the person answers. Easy to read and to add to.
- **The trance shows in the Companion:** the haze, spirals and blur on their screen, dazed speech, the farm's voice in
  purple.
- **Triggers are real records on the server:** they grow stronger with reinforcement and fade without it, each with a
  consent level and a revoke switch that the person and the proprietors can use. The dashboard shows who has what.
- **Waking always works:** the safeword and "wake" end any session at any depth, every time.
- ECHS becomes an optional bridge; nobody needs it.

### 3. 📌 Real assets for the drawn body parts
- Each part (breasts, belly, and so on) becomes **one painted asset per pose, with a warp grid** that bends it
  smoothly to any size (the way Live2D-style art moves). One good painting per pose, not one per size.
- Painted in greyscale and tinted the way the game tints its own items, so they match every skin colour.
- ❓ **Who paints:** Laynie, a commissioned artist, or Claude's clean vector versions first and painted ones later.
  Claude builds the whole pipeline either way; the studio hands an artist ready-made templates for every pose.
- ⚠️ Pictures of characters never go on GitHub. The art lives on the farm server.

### 4. 📌 The studio's layering fixed
- Our parts go in as **real layers in the game's own drawing order**, not painted over the finished character. Hands
  and held items sit over them, clothes over skin.
- **Tattoos and brands become decals** pinned to the part, so they move and stretch with it.
- The studio builds and previews everything on a real character, then publishes straight to the server, and every
  Companion picks it up. That ends the studio → bot's Companion → bot → everyone chain.

### 5. 📌 Better everywhere: immersion, comfort, fun
Once each system sits on the new foundation, it gets its own pass:
- fewer, better-paced bot messages
- scenes written in Ink, so they branch and remember people
- a panel that works well on phones
- faster answers, with nothing going through room chat
- the farm remembering what each person likes

---

## Punishments by contract (talked through Nov 14, waits on goal 1)

What Laynie wants: punishments with real bite (*"restraints, drugs, conditioning, restrictions, being forced, having
privileges stripped"*), sized to what each person signed up for.

✅ **Decided:**
- **The bot hands them out,** by itself, from the offence and the contract they signed.
- **Only a proprietor can end one early,** unless that proprietor is the one being punished; then only the other
  proprietor can (Laynie: *"only the proprieter can end it early unless that proprieter is being punished"*).
- **Tiers are what they signed:** fun, deep, NHL, permanent, plus staff, mandated staff, and proprietors.
- **Permanent contracts:** absolutely no leaving.
- **Not through BC+:** it runs on the farm's own rules (goal 1), so it reaches everybody with the Companion.

📌 **The toolbox:**
- **Restraints:** chastity, armbinder, hood, hobbles, muzzle, posture collar, clamps. They come back if struggled out
  of, on timers.
- **Drugs:** the farm's potions and shots, forced on them: heat that won't break, a lactation surge, a Denial Draught,
  a Dull Draught (stumbling speech), a Docile Draught (opens them to conditioning).
- **Conditioning:** forced farm trance sessions (goal 2), for those who have trance switched on.
- **Restrictions:** kneel or all fours, animal noises only, doll-talk, forbidden words, no emotes or whispers,
  blindfolded, renamed, can't free themselves or change clothes, can't enter other rooms.
- **Forced:** milking stall, breeding stand (if breedable), glory shift and use bench (if their switches allow),
  stocks, pen, a lead.
- **Privileges stripped:** roam passes, the store, luxury hours, earning ribbons, a mate for the day, shows and feats,
  their name (called by number), a bed (nights in the pen).

📌 **A first sketch of the sentences,** for leaving without leave (first time → repeat):

| Signed | First time | Repeat |
|---|---|---|
| Fun | summoned home, 30 min in the stocks, passes cost double for a day, cowbell collar for an hour | 2 h locked muzzle and mittens, no store for a day |
| Deep | chastity and hobbles locked 4 h, kneeling 2 h, no passes for a day, a forced milking | 12 h chastity, Denial Draught, a forced obedience trance, no ribbons for a day |
| NHL | all fours and animal noises 24 h, locked bridle and blinders, stall-bound, heat that won't break | 3 days stall-bound and called by number, milking and breeding schedule, deep conditioning, no privileges |
| Permanent | summoned at once with no grace, can't enter rooms, plus NHL's for 3 days | the same, until a proprietor lifts it, on the board as a runaway |
| Farmhand / herdmaster | staff points docked, a write-up | a shift worked as stock in a locked uniform of shame, keys taken for a day |
| Mandated staff | uniform locked on, clocked in by force | on probation, worked as livestock in between |
| Proprietor | only if they switch it on: the rules they choose, at Deep's level | only the other proprietor can lift it |

📌 **Offences:** leaving without a pass (or at all, on a permanent contract), coming back late, ignoring a summon,
missing milk quota, staff out of uniform, missing a shift or neglecting their herd, refusing a farm order they signed
up for, and switching the Companion off mid-contract.

❓ **Still to decide:** whether fun contracts get real punishments or only privilege losses and cosmetic gear;
whether the proprietors want their opt-in.

---

## The lines that never move
- The safeword lifts everything at once: rules, restraints, trance, punishments.
- Limits and switches are always respected.
- Going offline is never an offence.
- Nothing ever takes away the safeword, beeping the farm, or speaking out of character.
- Private things (logs, ledgers, character pictures, the private add-on) never go public.

---

## The order

Each step goes live on its own and is tested before the old piece is retired.

- [ ] **0. Clear the decks:** finish the GitHub history cleanup (the force push waiting on Laynie); rent the server.
- [ ] **1. Groundwork:** one TypeScript project, automatic checks, the bot and its data moved to a private repository.
      (Doesn't need the server.)
- [ ] **2. The farm server and hands:** the bot moves off Laynie's PC; the database; the secure connection for
      Companions. Run beside today's bot on a test account until trusted, then switched over.
- [ ] **3. The new Companion core:** works in any room, the new panel, members-only delivery.
- [ ] **4. Farm rules** (goal 1), then **punishments by contract** on top of them.
- [ ] **5. Farm hypnosis and conditioning** (goal 2).
- [ ] **6. The new studio and the body art** (goals 3 and 4).
- [ ] **7. Polish,** system by system (goal 5).

Steps 1 and 2 are the foundation everything else stands on.

## ❓ Open questions
1. **The server:** which company, and who signs up. A small Linux server with 4 GB of memory runs roughly $5–25 a
   month; Hetzner is the cheapest good one. Laynie signs up and pays; Claude sets up everything after.
2. **The art:** Laynie, a commissioned artist, or vector first and painted later?
3. **Fun contracts:** real punishments, or privileges and cosmetics only?
4. **Proprietor punishments:** do Laynie and Alexia want the opt-in?
5. **When to start step 1.**
