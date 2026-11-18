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
   **Poses built Nov 18** (senses.js):
   - **Weak Knees:** down on your knees, and standing needs somebody's help (the game's own "with help").
   - **Down Girl:** on all fours, staying down the same way.
   Kits and tongues are still to come.
5. **Senses** (built Nov 18, senses.js):
   - **Blinder Drops:** the game's own blindness, up to three levels.
   - **Cotton Ears:** the game's own deafness, up to four.
   - **Tunnel Vision:** only a circle in the middle of the screen. It's the dose itself, so it shows even with the
     screen touches switched off.
   - **Haze:** the game's picture blurred, not the chat.
6. **The drawn body moves in:** growth shots off the farm (built Nov 18, doses.js).
   - **Udder Growth, Ass Growth, Cock Growth, Balls Growth:** a size up for every dose, and it stays. The farm's own
     words work too (Breast Enlarger, Ball Enlarger...).
   - **Reducers:** Udder Reducer, Cock Reducer and the like take a size back off what they name. A plain Reducing Serum
     takes it off the tits. "Shrinking" is left to LSCG, whose shrink potion makes all of you smaller.
   - **Limits:** 10 cups up and 6 down; 6 up and 3 down for the rest.
   - On the farm with the farm girl in the room, growth is hers, on her own books. Anywhere else the Dispensary keeps
     it, and the Purge doesn't undo it.
   - The cup goes on top of whatever cup the Companion draws, yours or the farm's, and goes round the room with it. The
     rest is counted for now and drawn once the drawn cock and hips are in.
   **The farm girl's four voice potions** (built Nov 18): Honey Tongue, Golden Hour, Blue Ribbon Musk and Echo Elixir,
   from a crafted bottle, anywhere (on the farm too). Bought at her store, they're still hers.
   - **Honey Tongue:** her praise in your ear every few minutes, for 45 minutes. Only you hear it.
   - **Golden Hour:** an hour of her dotin' on you every time you cum. Only her store's earns ribbons.
   - **Blue Ribbon Musk:** for 45 minutes the room hears about you now and then.
   - **Echo Elixir:** twice in 20 minutes (at least three apart, half the time), somethin' you said is said back to the
     room. Never OOC or commands.
   - Her lines for these four now live in shared/potion-voice.js, so the farm and the Dispensary say the same.
7. **Every way to dose** (built Nov 18, worn.js). Crafted gear you wear doses you when its words name a dose and say
   how. Whoever crafted it (the game keeps their number on the item) has to be on your list. LSCG's own soaked and laced
   gear stays LSCG's.
   - **Drip, IV, laced, coated, soaked:** the dose stays in you while it's on (10 minutes' worth, topped up every couple
     of minutes).
   - **Injector, auto-inject, dosing, pump:** a dose every 30 minutes. "Every 10 minutes" on the item sets its own.
   - **Triggers:** "on climax", "when kissed", "when touched" and "when spanked" each give a dose, at most every two
     minutes.
   - **Roulette or mystery dose:** a different one of the doses you allow, each time. Works on needles too.
   - **Drinks and treats:** fed to you from somebody's hand (the game's Sip and Eat), read like a needle.
   - **Lip gloss or lipstick** with a dose's words: it doses whoever its wearer kisses.
   - **The safeword:** clears what's in you and rests your gear for 15 minutes.
   Still to come: laced milk and feed (on the farm, through the farm girl).
   **Crafted parasites** (built Nov 18, parasites.js). Each kind is off till you switch it on, on the page. One goes on in
   a crafted item that names it, made by somebody on your list. The doses named on the item are its strain (the crafter's
   DNA); with none named, Needy Nectar, Heat and Hair Trigger in turn.
   - **Parasite lips:** 12 hours, even after the gear comes off. It feeds its strain every half hour, leaves you cravin',
     and spreads by a kiss you give.
   - **Livin' latex:** drinks every climax (Hair Trigger while fed). It stays up to three days if fed, and leaves after
     six hours starved.
   - **Milk moss:** keeps you leakin' (Let-Down) and feeds on it.
   - **The nestling:** grows a stage every time you cum, and your belly fills out with it (Fill-Out, belly).
   - **The brood mother:** lays a little one every 45 minutes, which your next kiss passes on.
   - **The leash vine** (only while worn): no step more than three tiles from its crafter, on a map. It never stops you
     leaving a room.
   - **The mouthpiece** (only while worn): its crafter's words (`/dispensary mouth <who> <words>`) are shown to you
     first. Say them with `/dispensary say`, or `nope`. A switch lets them straight through.
   - **The safeword** takes every one off.
   Messages: `dispPara { kind, strain, by, name }` (a kiss carrying one), `dispSay { text }`, `dispSaid { ok }`. Each is
   only acted on if you switched that kind on and the sender's on your list.
   **Dose icons** (built Nov 18, icons.js): a small row of icons by anybody in the room with doses in them, and 🪱 for a
   parasite. Each Dispensary tells the room what's in its wearer (`dispIcons { ids, para }`, `dispIconsAsk`). There are
   two switches, both on to start: show them, and let others see mine.
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
