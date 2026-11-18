# Farm ink: tattoos and brands in the wardrobe

Laynie, Nov 17: "if we can add a few branding slots into the wardrobe too, like echoes adds wardrobe slots, that would be
cool too. then players can select tattoos and place them their selves if the wanted too as parts of different outfits."
Then: "keep going, and then after two more sheets, build it all".

## What players get (step 1, built)

- **Five new slots in the game's own wardrobe:** Farm Ink 1, 2, 3 and 4, and Farm Brand. Every design from the seven
  tattoo sheets is an item in them: 81 ink designs in each ink slot, 27 brands in the brand slot. All free to wear.
- **Placing them is the game's own Layering button:** move, scale (crisp up to about twice the design's size), turn,
  and over or under anything else. They start on the skin, under clothes, at the spot each design was drawn for.
- **They save with outfits** like any item, and the colour picker re-inks them.
  - A brand is three layers: the dark edge, the angry core and the shine. Red is fresh, pale is healed.
  - Glow ink is a halo and a core.
  - Stamps are patchy, the way a stamp takes.
  - Full-colour flash is drawn as it is.
- **Stripping leaves ink on.** It isn't clothing.
- **Who sees it:** only people running the Companion or the Dispensary, the same as Echo's clothes only show for
  people with Echo's mod. Everyone else sees plain skin, and nothing breaks.
- **Spots:** the game draws the front only. Designs meant for the back (a tramp stamp, a butt cheek, a shoulder
  blade) start on the front of the hip, and players can move them.

## How it works

- `shared/ink/ink.js` adds the slots. The Companion and the Dispensary both carry it. Whichever loads first adds the
  slots, once, as soon as the game's item list is ready, which is before anyone's outfit is loaded.
- **Pictures:** each design's layers are pictures in `ink/v1/FarmInk/` and `ink/v1/FarmBrand/`, plus a preview each,
  loaded from GitHub. Two of the game's functions are pointed at them for our slots only: `AssetBaseURL` for layers
  and `AssetGetPreviewPath` for previews.
- **Size:** the pictures are stored at twice the size they show. The ink module draws them at half, round their
  centre, which is where the game scales an item, so Layering's 1.0 is the design's own size.
- **Keeping the slots:** if the game rebuilds its item list (`AssetLoadAll`), the slots are added again. If it
  re-reads names (`AssetBuildDescription`), ours are put back.
- **The list:** `shared/ink/ink-designs.json` has each design's name, title, spot, size, layers and default colours.
  Its `live` list holds the designs kept back for step 2.
- **The test:** `tests/ink.test.cjs`.

### Making the pictures

The seven sheets' render pages and the exporter are in `studio/web/_refs/tattoos/`, which is gitignored:
`tattoos.html`, `sheetN.js`, `buildsheet.py`, `export.js` and `buildexport.py`.

To re-export:
1. Build `ink-export.html` with `python buildexport.py`.
2. Open it from the render server (`server.mjs`, port 4791). It writes every layer, preview and the list into
   `ink-out/`.
3. Copy `ink-out/FarmInk` and `ink-out/FarmBrand` into `ink/vN/`.
4. Copy `ink-out/ink-designs.json` to `shared/ink/`.
5. When pictures change, move to a new `vN` folder and update `INK_HOST`, so nobody's browser keeps the old ones.

**Spots**, measured on the live game's body (centre x, y on the 500×1000 body picture, width shown):

| Spot | x | y | Width |
|---|---|---|---|
| neck | 250 | 240 | 70 |
| chest | 250 | 282 | 96 |
| heart | 282 | 292 | 54 |
| belly | 250 | 462 | 92 |
| womb | 250 | 528 | 110 |
| hip | 206 | 548 | 72 |
| thigh | 208 | 662 | 60 |
| inner thigh | 230 | 640 | 48 |
| shoulder | 182 | 300 | 42 |
| cheek | 226 | 180 | 24 |
| ankle | 206 | 878 | 40 |

## Next

2. **The live designs (28):** drawn on the spot with the wearer's own details, everyone's add-on drawing the same
   thing from the details carried on the item.
   - The counts, from the farm's books: bred, litters, litres, eggs, days denied, loads, the cum tank, the heat crest.
   - Names: the owner, the keyholder, the guestbook, the high scores, the review, the kisses.
   - The wearer's number: the stock barcode and the ear tag.
   - Dates.
   - Your own words, in the four fonts, with the fonts shipped in the repo rather than fetched from Google.
3. **Ink on the drawn body:** belly ink riding on, and stretching with, the drawn belly. Today the drawn belly covers it.
   Breast ink on the drawn breasts.
4. **The farm's own ink** (approved Nov 17):
   - trap brands land in the brand slot
   - the species brand
   - the corruption's marks
   - trophies earned as they happen: the punch card, the trap passport, the guestbook
   - ink a contract or hardcore says stays is put back if someone strips it
   - body writing, and a crafted tattoo gun
   - fresh ink and brands healing
   - marker, henna and glow ink fading at their own pace
