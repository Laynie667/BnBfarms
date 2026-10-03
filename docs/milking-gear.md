# Milking gear: design notes (draft)

Ideas from Laynie, 2026-10-02. Nothing here is built yet; this is the plan to come back to.

## Goal

Farmhand already milks people who stand on a stall spot (`milkingStallTick` in `bot/src/farmhand.js`).
Extend that so wearing real milking gear *anywhere on the farm* milks you too, at rates that match
what the gear itself shows, with emotes that change with speed, intensity and what's being milked.
Farmhand does the counting on reliable timers; the gear (BC's or Echo's) just draws the pictures.

## Gear Farmhand should recognise

| Gear | Where it's worn | Asset name | How to tell it's on / how strong |
|---|---|---|---|
| BC Lactation Pump | `ItemNipples` | `LactationPump` | `Property.SuctionLevel`: 0 Off, 1 Low, 2 Medium, 3 High, 4 Maximum |
| Echo's Portable Breast Pump | `ItemTorso` | `便携乳泵` | on when `Property.TypeRecord.s === 0`; tank in `Property.Luzi_MilkTotal` (mL, max 3000) |
| Echo's Milk Vendor | `ItemDevices` | `奶贩` | on when `Property.TypeRecord.m === 1`; tank in `Property.Luzi_MilkTotal` (mL) |
| BC Fuck Machine | `ItemDevices` | `FuckMachine` | vibrating-type item: `Property.Intensity` (-1 off … 3 max) |
| BC Sybian | `ItemDevices` | `Sybian` | vibrating-type item: `Property.Intensity` (-1 off … 3 max) |
| BC Funnel Gag | `ItemMouth` / `ItemMouth2` / `ItemMouth3` | `FunnelGag` | funnel fitted when the "Funnel" option is chosen (not "None") |

Echo's items only exist for people running Echo's Clothing Mod. If it isn't loaded, those names just never show up.

## Matching Echo's rates

Echo's flow (`reference/addons/echocloth/src/components/套装/Yaoki/牛奶贩卖机.js`, `flowAlgorithm`):

- 0 unless arousal is active and the gear is on
- `(breast+nipple zone liking × arousal-above-half + recent-orgasm boost) / 8 × 10`, shown as ×4 mL/min
- so the top speed is about **40 mL/min**, decaying after an orgasm (×0.6 per second)

Farmhand version: keep Farmhand's own milk stores (`milkRate`, `drainMilk`) as the truth, and drain at a
rate scaled to the gear's strength (e.g. Lactation Pump SuctionLevel 1–4 → 25/50/75/100% of the
Echo-matched top speed). Unlike Echo, don't require arousal zone settings. That's the main reason
their milking "doesn't work" for people.

## Emotes

Periodic emotes (like the stud emotes in `milkingStallTick`, every ~5 min with jitter), picked by:
- **what's milked**: milk (breasts) vs semen (cock) vs both
- **speed/intensity**: gentle / steady / hard tiers from SuctionLevel or Intensity
- **which gear**: stall, BC pump, Echo pump, Echo vendor, fuck machine, Sybian

## Pairings (ideas)

- **Fuck machine / Sybian + breeding**: while a breedable person is on one, it can count as
  artificial insemination from a seed jar (reuse `?inseminate` / `doCum` logic and consent checks).
- **Funnel gag as an orgasm target**: when a stud orgasms near someone wearing a fitted funnel gag,
  the funnel is a valid target ("mouth" hole), still behind the usual consent/limits checks.

## Who writes what (important)

- The **bot** can *read* everyone's gear from the room, which is enough for counting and emotes.
- Changing someone's item (e.g. setting Echo's `Luzi_MilkTotal` so the tank picture matches Farmhand)
  must happen on **that person's own client**, so it belongs in the **Farmhand Companion**, not the bot.
- If Echo's script and the Companion both change `Luzi_MilkTotal`, they'll fight. Pick one owner
  (probably: the Companion sets the tank to Farmhand's number each tick).
