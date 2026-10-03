# Recommendations: making Farmhand a serious part of the farm

Written 2026-10-02 after reading the bot, the Companion, the game's code, and about 40 other addons
(in `../reference`). Mockups of the panels: https://claude.ai/artifact/EvthVzWtzTgw5eVvsn6LA9

Nothing here is built yet. The order at the bottom is the suggested build order.

---

## 1. Fix first: consent and summoning

### Jar insemination must ask
`?inseminate` (bot `farmhand.js`, `case "inseminate"`) only checks that the target is breedable and on
the map. It never asks them. That doesn't match how `?cum` works (it asks through `breedConsent`).

- Every `?inseminate` asks the target first: Yes / No buttons in the Companion, `?yes` / `?no` otherwise.
  The ask lapses after a few minutes.
- New per-person switch: **Jar insemination** on/off (`?jarok on|off`). Off means never, full stop:
  staff can't even ask, and the Barn tab greys them out.
- Free use doesn't cover jars unless they say so. Keep it a separate switch.

### Summon brings people to you
Today `?summon` only works on on-call staff, and lands everyone on the `summon` spot.

| Who | Where they are | What happens |
|---|---|---|
| Anyone (stock or staff) | Already in the farm room | Teleported to a free tile next to the staff member who summoned them (the bot is room admin, so it can use the same `ChatRoomMapViewTeleport` it already uses for rescues). |
| On-call or mandated staff | Another room | BCX "Ready to be summoned" beep (rule id `alt_forced_summoning`), and on arrival they land on the **staff** spot. |
| Stock | Another room | A normal beep invite ("you're wanted at the barn"). No forced pull unless they opt in with the same BCX rule. |

- The Companion can read BCX's rule state locally (`bcx.getModApi("FarmhandCompanion").getRuleState("alt_forced_summoning")`)
  and tell on-call staff if it's off, or if the bot's member number isn't in its allowed list. That's the #1 reason
  forced summons fail.

---

## 2. The Companion interface

Matches the mockup. The big changes underneath:

- **Protocol v2** (`shared/protocol.js`). New hidden message types, all optional, so old Companions keep working:
  - `welcome` adds `roles`, `tier` and `keys`, so the panel knows which tabs to show
  - `state`: a snapshot of the player's switches, so the Toggles tab shows the truth
  - `card`: numbers, not just text (stats, size, vet, quota), so the panel draws bars
  - `ask`: a yes/no question with an id (breed asks, jar asks, outfit offers); the answer goes back as `answer`
  - `doc`: a staff lookup about someone else, which goes to the Office tab instead of chat
  - `outfit`: an outfit offer (section 4)
- **Role-based tabs**: livestock, guest and staff versions, and proprietors get the Dashboard.
  Staff can switch between the **Staff panel** and **their own livestock panel** with one click (header switch).
  Staff get everything a player has too: **Me** (their own record, keys, hours, herd size, and their own
  milk or seed if they're also on the books as stock), **Guides** (the public commands, then the staff ones),
  and **Toggles** (on call, plus the same personal switches stock have).
- **The safety bar is always visible**: Safe word / I'm stuck / Call staff on every tab.
- **The Office**: when a staff member with the Companion runs `?record`, `?vet`, `?quota` or `?inspect` on someone else,
  the answer is sent as a `doc`. It stays until closed, with Pin and Add note.
- **Panel comfort**: draggable, resizable, remembers if it was open, compact mode, optional chime, and a colour theme
  saved per player (`localStorage`, only on their computer).
- **Every button is a normal command.** The bot still checks permissions. The panel only hides and shows things.

---

## 3. Bot dashboard: BC+ contracts

A proprietor-only Dashboard tab in the Companion, where the farm writes BC+ contracts and the **bot** offers them.
(Laynie confirmed "offer codes" means BC+ contract offers.)

### How BC+ contracts work (from `reference/bc-plus/src/modules/Contracts.ts`)
- A contract is a bundle of BC+ rules with settings, a title, free-text terms, a duration and an end policy.
- It only takes effect when the target reviews it in **their own** BC+ and countersigns. Their client checks everything.
- Two ways to deliver one:
  - **In-room offer:** a hidden chat message `{ Content: "BCP", Type: "Hidden", Dictionary: { message: "ContractOffer", payload } }`
    sent to them. BC+ replaces the claimed author with the **real sender**, so if the bot sends it, the farm is the verified author.
  - **Code:** `BCP1:contract:<LZString base64 of the payload>`, pasted on their BC+ Contracts page. Authorship is only claimed.
    Prefer in-room offers.
- The author can later ask which of its contracts someone holds (`ContractQuery` → `ContractList`) and release one
  (`ContractCommand` with `action: "release"`). Only the recorded author can release remotely, so **the bot must be the sender.**
- BC+ does **not** need to be installed on the bot. It only has to send and read `"BCP"` hidden messages.
- Limits: 30 rules per contract, 3 contracts per person at once, longest timed contract 30 days.
  `durationMin: 0` means open-ended, "until released".

### Durations
| Button | `durationMin` |
|---|---|
| 1 hour | 60 |
| 12 hours | 720 |
| 1 day | 1,440 |
| 1 week | 10,080 |
| 2 weeks | 20,160 |
| 1 month | 43,200 (BC+'s cap: 30 days) |
| Permanent | 0 (until the farm releases it) |

### Depth levels (real BC+ rule ids, tailored by species)
| Level | Ends early | Rules |
|---|---|---|
| **Fun** | Either side | `pet.speech` (low, sprinkled), `social.greetRoom`, `social.farewell`, `control.nickname` |
| **Deep** | Farm only | `pet.speech` (medium), `pet.hearing`, `body.controlOrgasms`, `control.leash` (staff only), `other.summon` (farm + staff), `control.nickname`, `social.greetRoom` |
| **No human left** | Farm only | `pet.speech` (max, moos only), `pet.hearing` (strong), `body.forcedPosition` (all fours), `body.secretOrgasms`, `body.controlOrgasms`, `chat.forbidLeaving`, `rooms.entry` (farm rooms), `other.summon`, `control.profile`, `protect.hardcore` |

- **Species:** BC+ pet speech knows Bunny, Cat, Cow, Dog, Fox, Mouse, Pony, Wolf and Custom. Map the farm's species onto
  those: cow/bull → Cow, pony/horse → Pony, pup/dog → Dog, kitt/cat → Cat, bunny/rabbit → Bunny, fox → Fox, wolf → Wolf.
  Pig, goat, sheep, deer and goblin use Custom with their own sounds (oink, maa, baa…).
- **Never in a farm contract:** `settings.safeword` (turning off their safeword), `social.forbidBeeps` and
  `social.forbidBeepMessages` (they must always be able to reach the farm), `speech.forbidOOC` and `speech.gaggedOOC`.
- **?safe releases every farm contract on them** (the bot sends `ContractCommand` release). That matters most for
  Permanent and No human left.

### The dashboard
- Pick a depth, a duration, who it's for, and who may end it. Then **Offer in the room** (best) or **Make a code**.
  Save favourites as templates (in the ledger, `L.contractTemplates`).
- **Farm contracts in force:** the bot keeps its own list and checks it with `ContractQuery`. Release buttons, plus the time left on each.
- Everything goes in the audit log.

---

## 4. Outfits and uniforms

**Slots:** new stock outfits by **species × gender** (genders: female, male, futa, **femboy**), staff uniforms
(Farmhand, Mandated, Herdmaster, Proprietor), and specials (luxury guest, prize cow, fair day).
With 15 species and 4 genders, nobody should have to fill 60 slots, so the farm falls back:
this species + this gender → this species, any gender → this gender, any species → the plain farm outfit.

**Femboy** is a new gender option the farm doesn't have yet. Add it to the record (`r.gender`: female / male / futa / femboy),
set with `?gender`. Production goes by body (a femboy with a penis makes semen, like the bot already works out),
and gender picks the outfit and flavour text.

**What's saved:** clothes, **restraints and locks**. Restraints keep their settings and colours. Bodies and hair are never saved.

**Saving one:** the proprietor dresses themselves (or a willing helper), then presses "Save what I'm wearing". The Companion takes the
game's own outfit bundle (`ServerAppearanceBundle(Player.Appearance)`), keeps clothing and item (restraint) groups,
compresses it (`LZString`, which BC already loads) and sends it to the bot for the ledger.

**Putting it on:** the bot sends an `outfit` offer to that player's Companion: "Put on your new-stock outfit? Yes / Not now".
On yes, the Companion:

1. saves what they're wearing now, so "Change back" works
2. applies the clothes and restraints, and never touches bodies or hair. Anything already locked on them stays put.
3. locks it the way the Dashboard says:
   - a **High Security Padlock** whose key list is the farm's staff (any farmhand can let them out)
   - a **timer padlock** that matches their contract
   - the locks exactly as saved
   - no locks
4. updates the room (`ChatRoomCharacterUpdate(Player)`)

They put it on themselves after saying yes, so the game allows it.

**When:** on approval (new stock), at clock-in (staff), "change back" at clock-out. Each of these can be switched on or off in the Dashboard.
**?safe takes it all off:** it unlocks and removes farm outfits, and releases farm contracts.

**Who's who:** species from `r.species`, gender from the new `r.gender`. If that isn't set, use futa from `r.futa`,
and male or female from the body the bot already reads (`hasVulva`, penis checks).

**Why the Companion and not the bot:** the game checks every change against the wearer's permissions
(`ServerAppearanceLoadFromBundle` → `ValidationCreateDiffParams`). A player changing their own clothes always passes.
The bot changing someone else's often won't. Body parts are blocked entirely unless they allow full wardrobe access.
Doing it on their own client, after they say yes, is both reliable and consensual.

**Addon clothes:** an outfit can include Echo's clothing for people who run Echo's mod. Anyone without it gets the
rest of the outfit. Don't copy Echo's art. Their cow outfit is one of the items that need the creators' permission.

---

## 5. Integration points

| Addon | What it adds to the farm | How |
|---|---|---|
| **BC+** | Farm contracts | Section 3. BC+ also has its own "Ready to be summoned" rule (`other.summon`), which counts the same as BCX's. |
| **BCX** | Reliable forced summons, and a health check for each **on-call** staff member | `bcx.getModApi(...)`: `getRuleState("alt_forced_summoning")`; later maybe opt-in curses for shift uniforms (`sendQuery`) |
| **Echo's Clothing Mod** | Portable pump and milk vendor as milking gear; Echo clothes in outfits | See `milking-gear.md`. Farmhand counts; the Companion keeps their tank picture in step. |
| **BC built-ins** | Lactation Pump, Fuck Machine, Sybian, Funnel Gag | Read from what people wear (group + asset name + `Property`) |
| **Hypnosis addons** | Opt-in farm hypnosis | See below |
| **WCE / LSCG** | Compatibility | Check that their chat changes don't hide farm notices for players without the Companion |
| **FUSAM** | One-click install for players | After the Companion has a public home (PLAN.md stage 5) |

**On call means mandated staff, plus staff who turned it on with `?forced`.** It doesn't mean all staff. Only those
people can be pulled in from other rooms, and only they get the summon-rule health check.

### Hypnosis: worth exploring (all opt-in, and ?safe always wakes them)
The bot already has a `triggers` field on each record, which is a good place to start.

| Addon | What it offers | Farm idea |
|---|---|---|
| **SkyzHypno** | A public API on the page: `window.SkyzHypno` has `addDepth`, `trance`, `wake`, `emergencyStop`, `installSuggestion`, `runSuggestion` and `startSession`. It also listens to BCX messages. | With the player's OK, the Companion deepens trance at farm moments (stall milking, clock-in, praise) and installs a small "farm" suggestion pack. `?safe` calls `emergencyStop`. |
| **ECHS** | Its own hidden channel `HypnoMsg` with sessions the subject agrees to (`session-query`, `remote-request`, `trigger-status`…). It checks consent on the subject's own client. | Never pushes anything. The farm only joins a session the player starts with the farm. |
| **HSC** | Trigger words from speakers the player allows (`window.Liko`). Docs are in Chinese. | Players add the farm bot as an allowed speaker, and the bot says farm triggers at the right moments. Works with any addon that reacts to chat. |

The simplest first step needs no code in their addons: `?hypno on`, plus a list of trigger phrases on the player's record.
The bot says them at farm moments, only to people who opted in, with the same quiet hours and gaps as tease lines.

---

## 6. Making it feel like a serious part of the farm

- **One clear path for newcomers:** guest → tour → `?apply` → offer code or approval → limits form → outfit offer → first chore.
  Every step shows up in the panel.
- **Split the bot first** (PLAN.md stage 2). It's about 6,000 lines in one file, and every feature above touches it. Keep `npm test` green after each move.
- **Tests for every new feature,** like the ones in `tests/`. Insemination asks, summon placement, offer redeeming and outfit offers each get one.
- **A version check:** the bot tells the Companion its protocol version, and the panel says "update available" if it's behind.
- **Reliability:** run the bot headless on a VPS for uptime, keep ledger backups (already `?backup`), and add a `?health` card in the Dashboard.
- **Privacy:** the ledger holds member numbers and play data. Keep it out of Git (`.gitignore` already does), and never put it in the Companion.
- **Keep the handbook in sync:** the guides tab and `Farmhand-Handbook.pdf` should say the same things.

---

## Suggested build order

1. Jar insemination asks, plus the `?jarok` switch (small, and it's consent)
2. Summon to the staff member's side, and the staff spot for forced staff from other rooms
3. Protocol v2 + role-based tabs (livestock first)
4. Staff tabs + the Office
5. Dashboard: BC+ contracts
6. Dashboard: outfits and uniforms (species × gender, restraints and locks) + ?gender with femboy
7. Milking gear integration (`milking-gear.md`)
8. Split the bot into files (can also go first if the features start to get tangled)
9. Public home + FUSAM listing
