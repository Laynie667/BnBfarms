# Farm ink: tattoos and brands in the wardrobe

Laynie, Nov 17: "if we can add a few branding slots into the wardrobe too, like echoes adds wardrobe slots, that would be
cool too. then players can select tattoos and place them their selves if the wanted too as parts of different outfits."
Then: "keep going, and then after two more sheets, build it all". Nov 18: "the tattoos need to be recolorable and have
better sizing options", and "as long as it layers properly".

## What players get

- **Five new slots in the game's own wardrobe:** Farm Ink 1, 2, 3 and 4, and Farm Brand. Every design from the seven
  tattoo sheets is an item in them: 109 ink designs in each ink slot, 27 brands in the brand slot. All free to wear.
- **Every design is recolourable** (Nov 18). A design in several colours has a layer per colour (the flash's gold, red,
  blue and outline; the ear tag's yellow and ink), each taking the wardrobe's colour picker on its own. The colour you
  pick is the colour you get, with the drawing's shading kept inside it.
  - A brand is three layers: the dark edge, the angry core and the shine. Red is fresh, pale is healed.
  - Glow ink is a halo and a core.
  - Stamps are patchy, the way a stamp takes.
- **Size** (Nov 18): `/ink` opens the ink panel. For each slot:
  - Size: a quarter to four times.
  - Width and height on their own: half to twice.
  - Normal size: back to how it was drawn.
  The pictures are made at three times their size, so up to three times stays crisp.
  - The game's Layering button still moves, turns and layers each one, and its own scale works on top.
  - In chat: `/ink 2 size 150`, `/ink 2 wide 120`, `/ink 2 tall 80`.
- **The live ones** (step 2, Nov 18): 28 designs that print the wearer's own:
  - The farm's counts: times bred, litters, litres milked, eggs laid, the cum tank, breeding facts, loading..., the
    breeding card, the guestbook, high scores, tied ×, the heat crest, bred on (and due).
  - Days without cummin', counted by the wearer's own game (a ruined one doesn't reset it).
  - Their number: farm property, stock number, the ear tag.
  - A name: owned by, the keyholder, lipstick kisses, the five-star review. Their owner's name until something else is
    written.
  - Their own words, in four styles.
  The farm's counts are written on by the Companion as they change, at most once a minute a slot. Words and names go on
  from the panel, or `/ink 1 Good Girl`. `/ink 2 99` sets a count of your own (the farm stops writin' over it), and
  `/ink 2 auto` hands it back to the farm.
- **They sit on the skin, under clothes.** With the Companion's drawn body on, ink goes on top of the drawn belly and
  breasts and under anything worn (Nov 18: before that the drawn belly covered it).
- **A tattoo stays on.** Stripping, the game's "naked" and "strip a layer" leave farm ink where it is. It comes off one
  slot at a time in the wardrobe.
- **They save with outfits** like any item.
- **The farm's own ink** (Nov 18): with **"Farm can ink me"** on (the Companion's Toggles, On your character; its own
  switch, apart from "Farm can mark my body"), the farm puts its ink on you itself, in your Farm Brand and Farm Ink slots:
  - `?brand <who> logo`: the farm's BB and bell. Without the switch it's still drawn the old way.
  - `?brand <who> species`: your animal's brand (Hucow, Mare, Doe, Bitch, She-Wolf, Kitten, Bunny, Vixen, Nanny, Ewe, Sow,
    Rat, Goblins, Dragoness). `?brand <who> stud`: Stud Service. Studs can carry either (Laynie: "either").
  - `?brand all logo`: the farm's mark on every livestock without a brand of their own.
  - Corruption 50: the corruption's words in its own dark ink, back by mornin' if you wash or take them off.
  - It never goes over ink you picked: your own brand keeps the brand slot, and with all four ink slots full nothin' goes
    on (you're told).
  - **A fresh brand heals** from angry red to pale and raised over three days. **Marker** wears off in a few hours and
    **henna** in a week, then they come off by themselves.
  - Take one off yourself and it stays off (except the corruption's). Switch "Farm can ink me" off and the farm's ink comes
    off; yours stays.
  - **In hardcore** (The Farmhand's Dispensary), the farm's ink pulled off goes straight back on, within the minute.
- **Glow ink that only shows while you're dosed** (Nov 18): Glow Slut's UV ink is there all the time and lights up only
  while somethin' from The Farmhand's Dispensary is in you. Your own Dispensary knows what's in you, and everybody else's
  reads it off your dose icons, so it shows for people with the Dispensary, and stays dark if you've switched off lettin'
  others see your icons. It lights up and goes dark as the dose goes in and wears off.
- **Who sees it:** only people running the Companion or the Dispensary, the same as Echo's clothes only show for
  people with Echo's mod. Everyone else sees plain skin, and nothing breaks.
- **Spots:** the game draws the front only. Designs meant for the back (a tramp stamp, a butt cheek, a shoulder
  blade) start on the front of the hip, and players can move them.

## How it works

- `shared/ink/ink.js` adds the slots. The Companion and the Dispensary both carry it. Whichever loads first adds the
  slots, once, as soon as the game's item list is ready, which is before anyone's outfit is loaded.
- **Pictures:** each still design's layers are pictures in `ink/v2/FarmInk/` and `ink/v2/FarmBrand/`, plus a preview
  each, loaded from GitHub. Two of the game's functions are pointed at them for our slots only: `AssetBaseURL` for
  layers and `AssetGetPreviewPath` for previews. (`ink/v1/` is the first set, for add-ons not yet updated: it can go once
  everybody's on Companion 0.57 or later.)
- **The game's tint:** the game colours a layer by its brightness, mid-grey being the colour exactly and white twice as
  bright. So every layer is mid-grey where its ink is, lighter or darker for shading.
- **Size:** the pictures are stored at three times the size they show. The ink module draws them at a third, round
  their centre, which is where the game scales an item, so Layering's 1.0 is the design's own size. The panel's size
  goes on the item (`Property.FarmInk`: `sz`, `sw`, `sh`) and is multiplied in at the same step.
- **The live ones** (`shared/ink/live.js`, with the sheets' own drawing in `live-art.js`): an item whose design is live
  has an address of our own (`ink/v2/live/<slot>/...`). The ink module draws it there and then, from what's written on
  the item (`Property.FarmInk`: `n`, `t`, `num`, `list`, `rows`, `d`, `due`). It splits it into the same colour layers,
  and hands the game the picture. Everyone with an add-on draws the same thing. The pictures are kept (80 sets at most)
  and let go of the game's caches when dropped.
  - Fonts: the sheets' fonts where they're loaded, otherwise the nearest the game ships (`GAME_FONT` in live.js). The
    sheets' own fonts could be carried in the repo later.
- **Over the drawn belly:** the drawn body (`studio/web/body-engine.js`) and the belly trial (`extension/src/belly.js`)
  hold farm ink back till the belly and breasts are on, then draw it, before anything worn. The ink module's own draw
  hook runs at priority 5, before theirs, so they see the ink's addresses as they are.
- **Keeping the slots:** if the game rebuilds its item list (`AssetLoadAll`), the slots are added again. If it re-reads
  names (`AssetBuildDescription`), ours are put back.
- **Ink that didn't show:** each time somebody's drawn, any ink they wear that wasn't asked for, or whose picture wasn't
  loaded yet, is noted. `/ink why` shows the last ten. (Laynie, Nov 18, saw other people's ink blink out for a split
  second as their faces animated, with the drawn body, WCE, LSCG and Echo running; it couldn't be made to happen in the
  studio.)
- **The farm's own ink:** the bot puts `farmInk` in each Companion's panel state (`10uq2-farm-ink.js`): a list of
  `{ id, slot, design, at, heal, fade, keep, color, values }`. `farmInkSync` in ink.js makes what's worn match it, marking
  each piece the farm's (`Property.FarmInk.farm` = its id, with `at`, `heal`, `fade`, `keep`). What it put on before is
  remembered on the wearer's own computer, so a piece they took off isn't put back (a `keep` one is, after 20 hours). The
  healing (the brand's three layers, BrandEdge, Brand and BrandShine, eased toward pale) and the fading (opacity, held
  for three fifths of the time) are worked out in the draw hook from `at`, so nothin' goes round the room for them; anybody
  whose is still on its way is drawn again every half hour. The Companion's hello says `off.ink` when the switch is off.
- **The farm's counts:** the bot puts `ink` in each Companion's panel state (`07b-companion-sync.js`, `inkCounts`): loads
  taken, who gave them (`totals.by`, the 40 most recent studs, kept in `08-production.js`), knots, litters, eggs,
  litres, how full, how far along, heat left. The Companion hands them to the ink module (`__farmInk.counts`).
- **The list:** `shared/ink/ink-designs.json` has each design's name, title, spot, size, layers and starting colours,
  and for the live ones their measured box, scale and colour palette.
- **The tests:** `tests/ink.test.cjs` (the slots, the pictures), `tests/ink-live.test.cjs` (the live designs, /ink,
  the counts, recolouring, sizes, stripping) and `tests/farm-ink.test.cjs` (the farm's own ink).

### Making the pictures

The seven sheets' render pages and the exporters are in `studio/web/_refs/tattoos/`, which is gitignored:
`tattoos.html`, `sheetN.js`, `buildsheet.py`, `export.js`, `buildexport.py`, `live-export.html` and `gen_live_art.py`.

To re-export:
1. Make `shared/ink/live-art.js` again if the sheets' drawing changed: `python gen_live_art.py shared/ink/live-art.js`.
2. Bundle `shared/ink/live.js` as `live-bundle.js` (esbuild, IIFE, global `FarmLive`) next to the pages. Both exporters
   use its colour split, so the still and live designs split the same way.
3. Build `ink-export.html` with `python buildexport.py`, and open it from the render server (`server.mjs`, port 4791).
   It writes every still design's layers, previews and list into `ink-out/`.
4. Open `live-export.html` the same way: it measures the live designs, writes their previews and
   `ink-out/live-designs.json`.
5. Copy `ink-out/FarmInk` and `ink-out/FarmBrand` into `ink/vN/`. Put the live list into the still list's `FarmInk`
   group, and save that as `shared/ink/ink-designs.json`.
6. When pictures change, move to a new `vN` folder and update `INK_HOST`, so nobody's browser keeps the old ones.

**Starting sizes** (Nov 18, Laynie: "the default starting size is too big on most of them in relation to the body"): each
design starts fitted to a box for its spot, in proportion to the body (the waist is about 170 across). The box is
width × height on the 500-wide body: neck 46×30, chest 80×50, heart 40×38, belly 70×58, womb 86×56, hip 54×48,
thigh 50×64, inner thigh 42×56, shoulder 36×38, forearm 30×42, wrist 40×20, cheek 24×16, ankle 36×26. Each design's `k`
in the list is that starting scale, multiplied in when it's drawn. The pictures don't change.
`resize_defaults.cjs` (in `_refs/tattoos`) works them out. The four "your words" designs start on the lower belly.

**Spots**, measured on the live game's body (centre x, y on the 500×1000 body picture, the width the pictures were made
for; the hip and cheek moved on Nov 18):

| Spot | x | y | Width |
|---|---|---|---|
| neck | 250 | 240 | 70 |
| chest | 250 | 282 | 96 |
| heart | 282 | 292 | 54 |
| belly | 250 | 462 | 92 |
| womb | 250 | 528 | 110 |
| hip | 204 | 580 | 72 |
| thigh | 208 | 662 | 60 |
| inner thigh | 230 | 640 | 48 |
| shoulder | 182 | 300 | 42 |
| cheek | 231 | 183 | 24 |
| ankle | 206 | 878 | 40 |

## Next

- **Ink that bends with the body:** riding the curve of the drawn belly and breasts rather than sitting flat on them.
- **More of the farm's own ink** (approved Nov 17; the brands, the species brand and corruption 50 went in Nov 18):
  - trap brands land in the brand slot
  - trophies earned as they happen
  - ink a contract says stays, put back if someone takes it off (hardcore's went in Nov 18)
  - body writing, and a crafted tattoo gun
- **The sheets' own fonts** for the live designs, carried in the repo.
