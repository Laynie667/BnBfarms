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
- **Outfit codes.** Paste the code WCE (`/exportlooks`) or BCX gives you and press *Put it on*. Only the slots the
  code names are replaced. *Copy this look as a code* gives one back, to paste into the game.
- **Body.** The six chest sizes, the four hip sizes, the three named skins.
- **Poses.** Arms, legs, all fours and hogtied.
- *Strip to bare* and *Start over*.

## What it is for next

1. Try on any item from any slot, by picking it.
2. The belly, and other drawn body parts, with sliders for size, position, width and hang, in every pose.
3. Saving those fits to a file the body extension reads.

## Good to know

- The game copy in `reference/` is the developers' newest work (R133 at the time of writing). The live game is a
  version behind, so the studio can show an item or a feature that is not live yet.
- The codes are the outfit's list of items as JSON, packed with LZString to base64. A plain JSON list is accepted too.
- `window.FarmStudio` in the browser console has the pieces (`wear`, `decode`, `encode`, `setBody`, `setPose`).
- Nothing here is sent anywhere. The game's code looks for a server on this same computer, finds none, and carries on.
