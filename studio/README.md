# B&B outfit studio

An offline dressing room for Bondage Club, for our own use. It runs on this computer only and signs in to nothing.

It does not imitate the game. It loads the game's own item list and drawing code from the copy of the game in
`reference/`, and has that draw a character. So an outfit, a restraint, a pose or a colour looks here the way it
looks in the game.

## Start it

Double-click **`Start the studio.bat`**. A small window opens (that is the studio running) and your browser opens
`http://localhost:4780/`. Close the small window to stop it.

Or, from the `farmhand` folder:

```bash
node studio/server.mjs
```

It needs Node (already installed for the farm) and the game copy at
`reference/Bondage-College-new/Bondage-College-master/BondageClub`. To use a different copy:

```bash
node studio/server.mjs "C:\path\to\BondageClub" 4780
```

It has to be opened through that address, not by double-clicking a file: a browser will not let a plain file load
the game's pictures into the drawing.

## What it does so far (step 1)

- Shows a character, drawn by the game's own code.
- **Outfit codes.** Paste the code WCE (`/exportlooks`) or BCX gives you, or the one the game's own wardrobe copies, and press *Put it on*. Only the slots the
  code names are replaced. *Copy this look as a code* gives one back, to paste into the game.
- **Body.** The six chest sizes, the four hip sizes, the three named skins.
- **Poses.** Arms, legs, all fours and hogtied.
- *Strip to bare* and *Start over*.

## Step 2: try anything on

- **Pick a slot, pick an item.** Every slot the game has (28 for restraints and toys, 48 for clothes and looks), with a
  box to narrow the list. Click an item to put it on, click it again to take it off. Hover for the game's own name
  for it, which is what the farm's gear lists use.
- **Colour it.** A colour picker tints every colour layer of what is on in that slot; one button puts the game's own
  colours back.
- **Wearing now** lists what is on, each with a ✕ to take it off.

## Step 3: the belly, with sliders

- **Belly** section: show or hide it, start from the small, medium or large shape, then drag: width, height, hang,
  left and right, up and down.
- **In front or behind.** Over the skin (standing), or behind the chest (all fours, hogtied).
- **Hanging or pressed flat**, with a slider for where the ground line cuts it.
- **A fit for each pose.** Standing, kneeling and the arms poses share one; all fours has its own; hogtied has its own.
  Change the pose and the sliders switch to that pose's fit.
- **Save all the fits** writes `studio/fits/belly.json`. They load again next time.
- It is drawn by the Companion's own belly code (`extension/src/belly.js`), so what you see is what the game will show.

## Step 4: fit what is worn

- Click a piece under **Wearing now** to pick it (the ✕ beside it takes it off). Clicking an item that is already on in
  the item list picks it too.
- **Sliders:** left and right, up and down, wider, taller, turn. They set the game's own item properties
  (`TranslationX/Y`, `ScaleX/Y`, `Rotation`), so the piece's art, colours and options are untouched.
- **The whole piece or one layer.** A belt's keyhole or lock can be moved separately from the belt.
- **Options.** For items that have variants (open back, closed back), buttons to switch.
- **Save this fit** keeps it for that piece, on that body (chest and hip size), in that pose, in
  `studio/fits/items.json`. It is put back whenever that piece is worn on that body in that pose again.
- The belly now goes on above all the skin, genitals included.

## Step 5: forward and back, and colours

- **In front of / behind other things.** *Back* and *Forward* move the picked piece, or the one layer you picked, a
  step earlier or later in the drawing order. The number is its place (bigger is in front); one button puts the
  game's own back. This sets the game's `OverridePriority`, and it is kept as part of a saved fit.
- **Colours.** Each colour layer of the picked piece has its own swatch, and a button to go back to the game's
  colour for that layer. Colours belong to the look, so they travel in the outfit code, not in the fit.

## Step 6: the game's own settings, and fits that stay

- **Configure it (the game's own menu).** For any item that has settings in the game (a pump's speed, a gag's type,
  a belt's shields, an item built from parts), this opens the real menu, drawn by the game, on the studio's character.
  The studio's panel steps aside while it is open. *Done: back to the studio*, bottom left, or the game's own exit,
  brings it back. What you set travels in the outfit code. The game's own Layering button is in that menu too.
- **Fits stay through a change of pose or body.** What you set is remembered for the pose and body you set it in,
  and carried over to the new one unless that one already has a fit of its own. *Save this fit* still writes the
  file; unsaved work lasts until the page is closed.

## Step 7: mould to the body

- **Mould to the body.** A button on the picked piece. Sliders move or stretch a whole piece evenly, and a belly is
  not even. A moulded piece is redrawn one row at a time: the part across the body is widened to the body's outline
  on that row (belly included), and what hangs outside the body on either side moves out with the edge. Rows the
  belly does not reach are left alone. The sliders still work on top of it.
- It widens sideways only. A short corset stays short, and no bulge is painted on. Needs the belly switched on and
  not set to "behind".
- The list of moulded pieces is saved in `fits/items.json` when you press *Save this fit*.

## Step 19: every slot, a choice, and the sheet

- Every slot follows the drawn breasts now, not a fixed list. Hair is left alone.
- Picked piece, *On drawn breasts*: stretch over them, leave it as the game draws it, or tuck it behind them.
- Breasts section, *See a whole slot at this size*: every piece in the slot as a sheet of small pictures, to find the
  ones that need a redraw. A big slot takes a minute or two. Click a picture to put the piece on.

## Step 18: clothes on the drawn breasts

- Tops, bras, suits, corsets, breast gear and torso harnesses are stretched from the game's breast onto the drawn one,
  inside its outline. *Clothes follow them* in the Breasts section switches it off.
- It is a stretch of the piece's own picture: patterns and straps grow with the breast.
- Nipple size and position have sliders of their own (step 17).

## Step 10: breasts, flat to R

- **Cup.** Flat, AA, A, B, C and D are the game's own six chest sizes: picking one changes the body, nothing more.
  From DD to R they are drawn over the game's biggest chest (`web/breasts-drawing.js`).
- **Weight.** The bigger, the longer the slope down from the chest, the lower the fullness sits, the wider they
  swing and the lower and further out the nipples ride. The *Weight* slider turns that up or down for any size.
- **Nipples and nipple gear** are moved from where the game draws them onto the drawn breasts, and grow a little.
- Standing and kneeling only for now. Bras and chest gear are not fitted to them yet.
- *Save the breasts* writes `fits/breasts.json`.

## Step 9: over or under

- *Mould to the body* is a choice of three. **Wide**: sideways only, as before. **Over**: wide, and lengthened so
  the piece runs down to the underside of the belly (for a crotch chain the belly would otherwise hang past).
  **Under**: the piece stays on the body and the belly hangs in front of it, hiding what it covers.
- Over stretches what is there, so chain links get a little longer. If a piece already reaches the bottom of the
  belly, over leaves its length alone.

## Step 8: words and signs

- The words on a sign, body writing, face writing and tags now move, stretch and turn with the piece's sliders.
  The game itself only does that for pictures, so this is the studio's own doing: in the live game the words would
  still sit where the game puts them.
- Body writing only shows once it is switched to show text in *Configure it*, and it is drawn under the hands.

## What it is for next

1. The Companion's belly reading the saved fits, so a shape tuned here is the shape worn in the game.
2. Other drawn body parts, and fits for worn items on them.

## Good to know

- The game copy in `reference/` is the developers' newest work (R133 at the time of writing). The live game is a
  version behind, so the studio can show an item or a feature that is not live yet.
- The codes are the outfit's list of items as JSON, packed with LZString to base64. A plain JSON list is accepted too.
- `window.FarmStudio` in the browser console has the pieces (`wear`, `decode`, `encode`, `setBody`, `setPose`).
- Nothing here is sent anywhere. The game's code looks for a server on this same computer, finds none, and carries on.
