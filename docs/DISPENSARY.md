# The Farmhand's Dispensary

A standalone add-on for Bondage Club: doses from crafted items. A crafted needle, drink or worn injector whose name or
description carries the right words gives whoever it's used on that dose. It has its own userscript and its own page
under Preferences → Extensions. It works without the farm and without the Farmhand Companion, and alongside both.

Status: planned with Laynie Nov 16–17, 2026. Step 1 out Nov 17 (`dispensary/`, `dist/farmhand-dispensary.user.js`).
Step 2 (hardcore, keyholders, the Companion and the farm's switches frozen) built Nov 17.

## Decisions (Laynie, Nov 16–17)

| | Decision |
|---|---|
| Name | The Farmhand's Dispensary |
| The farm's shots | Move into the Dispensary over time. On the farm, the farm girl keeps the farm's books (milk, heat, denial, eggs) and **calls on** the player's Dispensary to do what they feel, see and say (Laynie: "anything to make the farmgirls load a little lighter"). |
| Who can dose you | A ladder you pick from: only me → my owner → + lovers → + the farm → + whitelist → + friends → everyone but my blacklist → everyone, blacklist too. The farm sits under lovers and above friends. |
| The clock | A toggle: **while online** (timers only count while you're logged in) or **real time** (they run while you're away, but every timer runs a penalty longer, 50% to start). The hover tip says so plainly. |
| LSCG | Done the way LSCG does it, and LSCG's own drugs (sedative, aphrodisiac, mind control, antidote, and Suggestible since LSCG 0.9.9) stay LSCG's whenever LSCG is loaded. Ours plug into LSCG's extension API so they show up in its own drug list. |
| Drawing | The drawn body ships in the Dispensary too. Off the farm, other people's drawn bodies are off by default; with the Companion running, its setting wins. |
| Hardcore | Only you can switch it on, for yourself, after a plain warning. You can't change your own settings, and your safeword asks to be let out instead of lifting your doses. Your keyholders (your owner; the proprietors too, for anyone on the farm's books) can always open your settings remotely, fix them, let you out or turn hardcore off. It needs a keyholder to switch on. It can have an end date (1 to 30 days) or none; with none, a keyholder's Companion or Dispensary has to check in at least once every 30 days, or it unlocks itself. |

## Lines that never move

- Outside hardcore, the safeword lifts every dose at once: the Dispensary's own, the game's own and LSCG's.
- Inside hardcore (which only you can switch on, for yourself), the safeword asks your keyholders to let you out, and
  the way out is them, your end date, or 30 days without a keyholder checkin' in. The farm's `?safeword` still stops
  scenes and fetches staff and the proprietors, as always.
- Nothin' in the game can stop you closin' it or switchin' the add-on off, and hardcore doesn't pretend otherwise.
- Your limits and switches are respected. An effect you've switched off never lands, whoever doses you.
- Nothing ever blocks the safeword, speaking out of character, or beeping.
- Going offline is never an offence.
- Every change a keyholder makes is shown to you: who, and what.

## LSCG

LSCG's extension API (in LSCG since early October 2026; its docs/api.md) lets an add-on register its own drugs.
With LSCG loaded:

- LSCG's four are LSCG's: its rules, its permissions, its timers. Our triggers, drips and roulette dose them through
  `api.drugs.dose`, the proper way in.
- Our doses are registered with `api.drugs.register`, so players switch them on in LSCG's Drug Enhancements next to
  LSCG's own, and everyone running LSCG sees their level bars.
- One door per dose: when LSCG delivers a dose (its glasses, mugs, respirators and injectors), the Dispensary doesn't
  deliver it again.

Without LSCG, the Dispensary does all of it itself.

Notes for Little Sera, kept as we go: what we used, and what we couldn't do. (So far: extensions can't make their own
lasting states yet, so a dose that lasts keeps its own timer.)

## Where it keeps things

On the player's account (the game's `Player.ExtensionSettings`, saved by the server), not only in one browser. Settings
and running timers follow you between your phone and your PC, and clearing the browser doesn't undo hardcore.

## Build order

1. **The bones** (built Nov 17): the userscript and its Extensions page, settings saved on the account, the dose
   ladder, the clock toggle, needles read from the giver's crafted item, the safeword, the LSCG hookup, the farm girl's
   call, and the first two doses: **Denial Serum** (held at the edge) and the **Sedative** (LSCG's, when it's loaded).
2. **Hardcore and keyholders** (built Nov 17; Laynie: "it can be set to have no end date, but a keyholder, owner,
   proprieters companion needs to ping the hardcore users dispensary and companion atleast once every 30 days,
   otherwise, it will unlock after 30 days without the ping"):
   - the lock on your own settings, in the Dispensary and the Companion alike;
   - remote access for your keyholders, in the room or by beep: open your settings, fix them, let you out, end it;
   - the safeword becomes "ask to be let out": it beeps your keyholders and logs it;
   - an end date (1 to 30 days) or none; the check-in: bein' in the same room as a keyholder counts by itself, and a
     keyholder can check in from anywhere with a button. 30 days without one, and hardcore unlocks;
   - a note to you on every change a keyholder makes: who, and what.
   - the Companion holds keys too: it checks in by itself when you share a room with somebody whose key you hold, and
     `/keys`, `/keys check|letout|end <who>` look after them without the Dispensary.
   - keyholders by member number, too (up to ten); in hardcore, who holds your key is locked in with you.
   - your settings freeze as they are when you lock in; only keyholders change them. That covers the Companion's
     game-rule switches (privacy choices stay yours) and the farm's switches, which keyholders set with `?ward`.
   - limits are yours and frozen: nobody changes them while you're locked in, keyholders and staff included.
3. **The shots and potions that work anywhere** (built Nov 17):
   - Needy Nectar (LSCG's aphrodisiac when loaded), Hair Trigger, Bitterroot, Moo Juice, Hiccup Fizz, Featherlight, Heat, the Purge, and Suggestible (LSCG's only).
   - Speech changes, and screen touches with a switch.
   - Every dose of ours goes in LSCG's list with its soak words.
   - The farm girl hands these potions and shots to the Dispensary and stops narrating them. Her lines for them live in `shared/potion-voice.js`.
   LSCG's newer pieces (LSCG 0.9.9, Nov 3) still to build on: soaked and laced gear (our doses already work in it), its
   Suggestible drug (the farm's obedience shot becomes it when LSCG is loaded), farm instructions in its hypnosis
   suggestion editor, and our own screen touches for our doses. The farm's own hypno module targets LSCG's hypnosis first
   (Laynie: "LSCG's hypno might be a better compatiblity focus").
   **More doses** (built Nov 17; Laynie: "I love it", then "the new drug effects go in"). None of these is a farm
   shot: on the farm too, your own Dispensary reads the needle.
   - **Let-Down:** your tits leak; wet moments every few minutes. With the Companion and "Farm can mark my body" on,
     each leak lands as milk on your chest, for everybody with a Companion.
   - **Fill-Out:** a swell that comes and goes. The bottle says which: the cup (two cups a dose, up to six), the belly
     (a stage or two), or the ass (lines only, for now). The Companion's drawn body draws it for everybody with a
     Companion, half as much in its last three minutes.
   - **The Airhead Elixir** (likes, ums, uptalk, big words floatin' off) and **Babble Brew** (filthy words slip in,
     innocent ones come out wrong): speech changes, stronger with the dose.
   - **Deep Throat Drops:** your mouth counts double. On the farm, a dosed throat takes a load without gaggin', and the
     trainin' counts twice.
   - **Rut:** never cools right off, and after you go over you're straight back up. On the farm, a stud in rut loads
     half again as big and doesn't run dry.
   - **Tender:** one spot counts triple: the bottle's (Tender Drops (ears)), or the one you pick on the page.
   - **Time-release capsules:** a needle that also says time-release, slow-release, delayed or capsule goes off 5 to
     40 minutes later, at a moment nobody knows, in a room. Up to five wait at once; the safeword clears them.
   - **Tolerance** (yours to switch on): the same dose again within three hours takes a fifth less for each before it,
     down to two fifths.
   - **Cravings** (yours to switch on): after six doses in three days, while nothin's in you, you want another now and
     then. Your hello tells the farm girl (`crave`); she offers at most every 45 minutes, and `?fix` has her call your
     Dispensary for it.
   - Your hello also tells her what's in you (`on`), and `?myshots` lists it.
4. **Kits, tongues and poses:** saved outfit kits put on for real with timer locks (Jane's set among them), animal
   tongues for every species, kneel / all fours / can't stand.
5. **Senses:** dim and blinder drops, cotton ears, tunnel vision, haze.
6. **The drawn body moves in:** growth shots off the farm.
7. **Every way to dose:** drinks, worn injectors, piercings, drips, triggers, roulette, the dosing collar, lip gloss,
   laced milk and feed.
8. **Punishments by contract** dose through it.

After step 1, a lighter drawing engine (for the Dispensary and the Companion alike): the picture step encoded off the
game's own thread first, then a small pool of web workers for the fitting.

## On the farm: the farm girl's call

With the farm girl in the room, a farm shot is hers to read, and she keeps the books. If the person dosed runs the
Dispensary, she doesn't narrate it: she sends their game one hidden message and their game does the rest.

| | Message | |
|---|---|---|
| player → her | `dispHello { ver, farm, lscg, off, hard, on, crave }` | is the farm on their ladder, is LSCG loaded, which doses they've switched off, hardcore, what's in them now, what they're cravin' |
| her → player | `dispWelcome { farm }` | who the farm is (proprietors and staff), for their ladder |
| her → player | `dose { id, dose, x, mins, by, line, hand, quiet }` | give this; say this line from your own game |
| player → her | `doseDone { id, ok, why }` | it didn't take (LSCG has it switched off): she takes her side back off |
| player → her | `dispSafeword {}` | their safeword: she lifts the farm's side of their doses |
| her → player | `dispClear {}` | her `?safeword`: every dose in them lifted |

If the farm isn't on their ladder, or they've switched a dose off, she treats it like a limit and says so. Without a
Dispensary, she does everything herself, as before. Only messages from the farm girl's own account count (the server
says who sent a message).
