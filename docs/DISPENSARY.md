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
   - **Animal Tongue** (built Nov 18; Laynie, on each animal's noises: "Those suit just fine"): Moo Juice's big sister.
     The bottle names the animal ("Kitty Tongue", "Puppy Tongue", "Pony Tongue", cow, bunny, fox, goat, lamb, piggy,
     wolf, dragon, rat), and "Animal Tongue" is your own. One dose, noises slip in between your words; two, about half
     your words are noises; three, nothin' but. Thirty minutes a dose. Moo Juice stays as it was; the bimbo speak is
     the Airhead Elixir ("Bimbo Serum" works too).
   - **Kits** (built Nov 18, kits.js; Laynie: "lscg imports outfits, so maybe ones saved there, to utilize them similar
     to lscg curses"): a dose that says **"Kit: <name>"** puts its crafter's saved outfit on you. The outfit is one they
     saved in LSCG, or with `/dispensary kit save <name>` (eight at most). Their Dispensary sends it when yours asks
     (`dispKitAsk { key }`, `dispKit { key, code }`), so they need to be in the room; your own kits work anywhere.
     - **"Kits can dress me"** is off to start (`/dispensary kit on|off`, or the page).
     - **How fast** is yours to pick: a piece a minute, every half minute, every ten seconds, or all at once
       (`/dispensary kit speed slow|steady|fast|now`). **What:** clothes, restraints or both (`kit what ...`).
     - It holds on for half an hour a dose, and a piece taken off creeps back on. Its locks don't come with it.
     - Never your body, nothin' you've blocked, nothin' the room blocks, and never over somethin' locked on you.
     - Its pieces keep their crafts, so horny gear in a kit is horny and a dilator drip keeps you open.
     - **When it's over** (its time, the safeword, the Purge) the kit comes off and your old outfit slips back on. In
       hardcore the safeword is your keyholders' as ever.
     - The bottle's words flavour the lines: livin', demonic or brainwashin', or a mix of them.
     - LSCG's outfit list isn't part of its extension API yet (`window.LSCG.Outfits`), so it's read carefully and a kit
       saved on the Dispensary keeps workin' if LSCG moves it.
   - **Horny gear** (built Nov 18, horny.js; Laynie: "the devices being horny"): crafted gear that says **"horny"** or
     **"hungry"** uses you by itself every six to ten minutes (**"insatiable"** or **"ravenous"**: every two to four, and
     rougher). Plugs and dildos thrust, nipple gear suckles (a nipple toy fucks an open nipple, and they train), gags fuck
     your throat, ropes and belts grind.
     - Each go pushes your arousal up. Close enough, and not denied, it makes you cum (the game's own orgasm).
     - **"Breeding"** or **"seeding"** on it as well: when you cum it cums too, and fills you.
     - **A parasite that says horny** feeds twice as often, and squirms and thrusts in between.
     - The crafter has to be on your list. "Horny gear can use me" is on to start (`/dispensary horny on|off`), and the
       safeword rests it with the rest of your gear.
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
   - The cup goes on top of whatever cup the Companion draws, yours or the farm's, and goes round the room with it.
     Cock and Balls Growth go on the Companion's drawn cock the same way (two inches a dose for the cock). The ass is
     counted for now and drawn once the drawn body learns hips.
   **The farm girl's four voice potions** (built Nov 18): Honey Tongue, Golden Hour, Blue Ribbon Musk and Echo Elixir,
   from a crafted bottle, anywhere (on the farm too). Bought at her store, they're still hers.
   - **Honey Tongue:** her praise in your ear every few minutes, for 45 minutes. Only you hear it.
   - **Golden Hour:** an hour of her dotin' on you every time you cum. Only her store's earns ribbons.
   - **Blue Ribbon Musk:** for 45 minutes the room hears about you now and then.
   - **Echo Elixir:** twice in 20 minutes (at least three apart, half the time), somethin' you said is said back to the
     room. Never OOC or commands.
   - Her lines for these four now live in shared/potion-voice.js, so the farm and the Dispensary say the same.
   **The Statue Serum** (built Nov 18; Laynie approved the defaults). Half an hour as a statue, from a crafted bottle.
   - **The material** is what the bottle says: stone (if it doesn't say), porcelain, gold, black latex, marble or bronze.
   - **What turns:** skin and hair (the game's body pictures, Echo's body, the drawn belly, breasts and cock), lips and brows.
     Each picture is shaded from its own light, so it keeps its shape on any skin colour. Gold and bronze catch the
     light like metal; stone has grain; marble has veins.
   - **The eyes** are glass set in the material (Laynie picked it from carved, glint and glass): the whites and lids
     turn, the iris keeps its own colour. The cock and balls turn with the skin, soft or hard.
   - **What doesn't:** blush and tears go. Clothes and everything worn stay as they are.
   - **Ink** is cut into the material, at its own size (ink.js asks the Companion, `W.__farmInkTint`).
   - **Arousal** stops right where it was: nothin' raises it, nothin' lets it fall, no climax, till it wears off.
   - **Everybody sees it:** the Companion draws it (extension/src/statue.js) and tells the room
     (`statue { mat, left }`, and `statueAsk` on comin' into a room). Without the Companion you're only told.
   - The safeword ends it like any dose.
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
   two switches, both on to start: show them, and let others see mine. Nov 18, Laynie: "they are just big": they're
   drawn the size of the game's own icons, in its free spots on that top row (on the map, half size by the name of
   whoever you hover). Three at most, then "+n"; hover them for every dose by name.
   **Every load takes, and nipples that open up** (built Nov 18; Laynie, Nov 17: "a effect that makes every load take ~
   for hyper pregnancy reasons. and maybe a nipple dialator effect and parasite that makes nipples fuckable as a real
   action?"):
   - **Sure-Catch Serum:** every load takes. On the farm any load that can catch does (the Fertile switch, a
     contraceptive, breedin' rights and a sire's claim still count). Already carryin', every load after adds one to the
     litter (two with a hyper item or shot), from any stud, the same one again too, up to the farm's hyper sizes, and
     brings the litter on a little (6% a load, never closer than two hours to due), so the belly swells with each. The
     farm girl reads it off the hello (`on`), like Rut. Off the farm the womb only aches for it.
   - **Nipple Dilator:** the nipples stretch open while it's in you, one to three wide with the dose. Crafted nipple gear
     that says dilator or stretcher keeps it in while it's worn. Touches there count double while they're open.
   - **Nipple leeches** (a crafted parasite, off till you switch it on): they hold the nipples open for a day, wider once
     fed three times. Each time somethin' goes in, they feed (a day more, three at most) and pass their strain; starved
     eight hours, they drop off. Somebody who suckles you can pick them up. An item that says "nipple parasite" is the
     leeches, not the parasite lips.
   - **The real actions** (nipples.js): while the nipples are open, the game's own action menu offers **Fuck nipple**
     (to somebody with a cock) and **Finger nipple** (anybody with free hands, yourself too), on bare, reachable nipples.
     With LSCG they're LSCG extension activities; without it the Dispensary adds them to the game the way LSCG does,
     and the chat line travels with the message, names filled in, so people without either still read it. Each
     Dispensary tells the room whose nipples are open (`dispNips { n }`, and again for `dispIconsAsk`).
   - **Drawn** (Laynie: "looks good on the dialator"): the Companion's drawn breasts draw them open, one to three wide, a
     puffy pink rim round the openin', over her own nipple and under anything worn on it (body-engine.js openNip; the
     engine asks `host.nipOpen`, the Companion's drawn body asks the Dispensary, `FarmhandDispensary.nipples(mn)`).
   - **The stretch stays** (Laynie: "if the stretching persist after the leeches are removed, it would make since to be
     able to use and fuck them, or creampie them too"): held open they train, a tenth of a level every half hour toward
     how wide they're held, and more with every fuckin'. What's trained stays when the dose wears off or the leeches drop,
     and stays usable. **"They close up slowly on their own"** is each player's switch (Laynie: "up to the individual
     player with a toggle"), on to start: half a step a day once they've been left be twelve hours.
   - **Closin' them back up** (Laynie: "need to have a way to reset them"): "Close them up" on the page,
     `/dispensary nips close`, or a **Tightening Balm** anybody on your list doses you with (in hardcore, the balm from a
     keyholder). `/dispensary nips` says how they are; `/dispensary nips heal on|off` is the switch.
   - **Creampies:** whoever cums within a minute and a half of fuckin' your nipple, their Dispensary tells yours
     (`dispCream`). It wells back out (a line for the room, cum on your chest for the Companion) and is counted, its own
     count (Laynie: "its own count"). On the farm the farm girl's told (`dispNipLoad`): her own count on `?stats`, and it
     comes back out creamy with the next milkin'.
   - **Nipple toys** (built Nov 18; Laynie: "maybe make them plug able with certain toys? like beads, dildos,
     vibrators, etc?", "I mean art for existing items", "the dildos could look more like how the plugs do"): fifteen of
     the game's own toys made to fit an open nipple, in the game's own nipple slot (toys-list.js, toys.js): the silver
     and black beads, the black, heart, demon-tail, lock and vibrating plugs, the pump-up plug and dildo, the vibrating and
     wired eggs, the Ben Wa balls, the dildo and the vibrating dildo (both front-on, like the plugs), and the sound.
     - They're in the normal item menu. Whoever owns the game's toy owns its nipple version.
     - They copy their game toy's settings: the beads' count (1 to 5 in), the pump-ups' inflate and vibrate levels,
       the vibrators' remote, the lock plug's lock.
     - Only into open nipples ("Those nipples aren't open" otherwise). Once in, they hold them open (a pump-up wider the
       more it's pumped), so the stretch trains while they're in. Nobody can fuck or finger a plugged nipple.
     - Closin' them up (the page, `/dispensary nips close`, a Tightening Balm) pushes the toy out; a locked one stays,
       holdin' them open, till whoever holds its key takes it out.
     - Pictures: the repo's toys/v1, one per breast size and state, drawn by tools/nipple-toys-art.js. The Companion's
       drawn breasts carry them like any nipple item. Only people with the Dispensary see them; in chat everybody reads
       the toy's name.
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
