# The B&B Farm map

Read from `farm-map.json` (Oct 7, 2026), the room's own map data plus the bot's spots and zones, and decoded
against the game's tile and object list. The full tile-by-tile picture, every object and what's under every
spot is in `farm-map-decoded.txt` next to this file. The map is 40 × 40; X runs left to right, Y top to bottom.

To refresh it: on the bot's PC, in the farm room, F12 → Console, paste the one-liner below, Enter. It saves
`farm-map.json` to Downloads.

```js
(()=>{const L=FarmhandLedger(),d=JSON.stringify({room:ChatRoomData.Name,at:new Date().toISOString(),map:ChatRoomData.MapData,spots:L.spots,zones:L.zones});const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([d],{type:'application/json'}));a.download='farm-map.json';a.click();})()
```

## The lay of the land (zones)

| Area | Where | What's there |
|---|---|---|
| Office | 32–39, 0–6 | lockers, a display frame, an X-cross, a red throne on pink pillows, low tables |
| Stockade | 29–31, 0–4 | two bondage benches (29,3 and 31,3), an X-cross (30,0), crates; the `stocks` spot is 30,2 |
| Security | 24–28, 3–7 | desk, bookshelves, a monitor, a wanted poster |
| Doll rooms | 7–28, 0–3 | a row of gold-locked cells (16–22,1) |
| Facility (medical, kennels) | 0–15, 0–19 | medical bed and desk, eye chart, three kennels (10,2 · 12,2 · 14,2), showers, lockers |
| Track | 4–14, 7–19 | hurdles, chairs, a beach umbrella |
| Pasture | 24–39, 5–20 | long grass, oak and sakura trees, barbed-wire fence, a pond down the east edge (`water-1`…`water-19`) |
| Feeding | 37–39, 22 | `trough-1`…`trough-3` |
| Barn, glory row | 28–32, 22 | `glory-1`…`glory-5`, the holes in the steel wall at 28–32,23 (`glory-N-visitor`) |
| Barn | 26–39, 21–31 | pine floor; stalls split by cedar walls; `milking1` 35,28 (latex floor), `milking2` 38,28, `milking3` 37,26 |
| Barn safe room | 27–30, 26–30 | a kennel, an X-cross, sleeping bags, a throne |
| Cabin | 3–20, 26–37 | fireplace, bookshelves, a wedding arch and cake, laundry, showers |
| Receiving | 28–37, 34–39 | the entry and exit flags at 32,39 and 33,39; `home` 34,33, `safe` 33,37, `staff` 36,37, `rescue` 29,33 |

## Spots not set yet (features that need them)

- **`bench`** (the use bench; also Laynie's strangers and orders): the stockade's bondage benches at **29,3** and
  **31,3** (and 39,2 in the office) fit. Stand on one and `?spot set bench`, then `?spot set bench-2` on the next.
- **`breedingstand`** (fills there catch half again more; loaned out; orders): nothing's set, so the bonus never applies.
- **`pen`** (the corral, wheel pen slices; Laynie's alone-in-the-pen): the barn's stalls or the barn safe room's kennel corner.
- **`pigsty`**: a muddy corner. The pasture's dirt patches by the barbed fence (around 24–27, 21–30) look the part.
- **Kennels** at 10,2 · 12,2 · 14,2 · 28,26 have no spots; they'd make good `pen-2`, `pen-3`… for pups.
