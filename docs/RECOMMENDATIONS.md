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

## 3. Bot dashboard: offer codes

A proprietor-only Dashboard tab in the Companion. The bot runs in Tampermonkey (or a VPS later), so a separate
website would need hosting. A Companion tab needs none.

- **Make an offer**: kind + uses + expiry, and the bot makes a short code like `FARM-7K2Q` (no look-alike letters).
  Kinds: staff job (Farmhand, Mandated, Herdmaster), livestock contract, luxury stay, cabin booking, shot or boost voucher.
- **Send it**: beep it to a member, or hand it out in the room.
- **Redeem**: the player types `?redeem FARM-7K2Q`, reads the terms for that kind, and says yes. Then the role and perks
  apply. Mandated offers check the BCX summon rule first.
- **Track it**: live offers with uses left, who redeemed, and expiry. Everything goes in the audit log.
- Stored in the ledger as `L.offers`, the same way jars and tease lines are stored.

> Laynie, check this matches what you meant by "offer codes". If you meant outfit codes, see section 4.

---

## 4. Outfits and uniforms

**Slots:** new stock (female, male, futa), staff uniforms (Farmhand, Herdmaster, Proprietor), and specials
(luxury guest, prize cow, fair day).

**Saving one:** the proprietor dresses themselves, then presses "Save what I'm wearing". The Companion takes the
game's own outfit bundle (`ServerAppearanceBundle(Player.Appearance)`), keeps only clothing groups, compresses it
(`LZString`, which BC already loads) and sends it to the bot for the ledger.

**Putting it on:** the bot sends an `outfit` offer to that player's Companion: "Put on your Farmhand uniform? Yes / Not now".
On yes, the Companion:

1. saves what they're wearing now, so "Change back" works
2. applies only clothing groups, and never touches bodies, hair, or anything locked
3. updates the room (`ChatRoomCharacterUpdate(Player)`)

**When:** on approval (new stock), at clock-in (staff), "change back" at clock-out. Each of these can be switched on or off in the Dashboard.

**Who's who:** futa from the existing `r.futa`. Male and female from the body the bot already reads (`hasVulva`, penis checks).

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
| **BCX** | Reliable forced summons, and a health check for each on-call staff member | `bcx.getModApi(...)`: `getRuleState("alt_forced_summoning")`; later maybe opt-in curses for shift uniforms (`sendQuery`) |
| **Echo's Clothing Mod** | Portable pump and milk vendor as milking gear | See `milking-gear.md`. Farmhand counts; the Companion keeps their tank picture in step. |
| **BC built-ins** | Lactation Pump, Fuck Machine, Sybian, Funnel Gag | Read from what people wear (group + asset name + `Property`) |
| **Hypnosis addons (ECHS, HSC, SkyzHypno)** | Opt-in farm trigger words | Phase 3. Only for players who already run one and turn it on. |
| **WCE / BC+ / LSCG** | Compatibility | Check that their chat changes don't hide farm notices for players without the Companion |
| **FUSAM** | One-click install for players | After the Companion has a public home (PLAN.md stage 5) |

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
5. Dashboard: offer codes
6. Dashboard: outfits and uniforms
7. Milking gear integration (`milking-gear.md`)
8. Split the bot into files (can also go first if the features start to get tangled)
9. Public home + FUSAM listing
