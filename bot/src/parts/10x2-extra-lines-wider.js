  /* WHAT'S IN THIS FILE (10x2-extra-lines-wider.js)
     More for the bits round the traps (10x-trap-extras.js): breakin' free, gettin' held tighter, bein' rescued or
     goaded, the hunt, the bait, the crates, the nest. Nothin' here changes what any of it does.
     %n name · %c the other one (or the smell, or the place) · %x how many
  */
  (function(){
    const more = (pool, lines) => { if (Array.isArray(pool)) pool.push(...lines); };
    const E = EXTRA_LINES;
    more(E.free, [
      "%n goes limp, the trap relaxes its grip a hair, and they twist out of it like a greased piglet. Gone before it can think.",
      "A buckle pops. Then another. %n wriggles free and scrambles off on all fours, not lookin' back."]);
    more(E.tighten, [
      "Every kick only teaches it where %n's weakest. It cinches there, and holds them stiller than before.",
      "%n strains. The trap creaks, considers, and takes up another notch, like it's enjoyin' the game."]);
    more(E.goad, [
      "%c leans on the trap's lever with a grin, and whatever's workin' on %n speeds up. \"Oops.\"",
      "%c kneels by %n's head, strokes their hair, and tells them exactly what the trap's goin' to do next. It does it."]);
    more(E.rescued, [
      "%c jams a boot in the gears and hauls. Somethin' cracks, everything lets go, and %n tumbles out into %c's arms.",
      "%c finds the hidden release under the boards, presses it, and the whole contraption folds away with a sigh. %n is free."]);
    more(E.rescueFail, [
      "%c heaves on the trap with all they've got. The trap holds %n tighter, like a dog with a bone.",
      "%c gets one strap loose. Two more take its place. The trap seems to find it funny."]);
    more(E.finish, [
      "%n stumbles home flushed and grinnin', number %x in the hunt, with somethin' to tell about every step of the way.",
      "Over the line comes %n, number %x, bow-legged and proud of it."]);
    more(E.packHeard, [
      "The dogs have been restless near the %c all afternoon. They only get like that when the pack's about.",
      "There's a tuft of grey fur on the wire by the %c, sugar, and the musk's still on it."]);
    more(E.bait, [
      "A ribbon flutters in the breeze, tied to a stake in the middle of nowhere in particular. It's very pretty. It's very alone.",
      "There's a full feed bag sittin' open on the path, smellin' sweet. Nobody'd leave that lyin' about. Would they?"]);
    more(E.smell, [
      "Downwind of %n, there's no mistakin' it: %c, warm and heavy on the air.",
      "%n leaves a little cloud of %c behind them wherever they go."]);
    more(E.crateGood, [
      "%n eases the lid up. Ribbons, a whole bundle, and a note that just says FINDERS KEEPERS.",
      "The crate's lined with clean straw, and there in the middle, neat as a gift: ribbons."]);
    more(E.cratePotion, [
      "The crate's empty but for a little stoppered bottle. The stopper pops on its own as %n bends close, and they get a noseful.",
      "%n lifts the lid and a puff of sweet vapour comes out to meet them. There was a bottle in there. It's open now."]);
    more(E.crateBad, [
      "The lid comes up and so does everything inside it, all at once, all hands.",
      "%n opens the crate. The crate opens %n."]);
    more(E.lay, [
      "%n kneels in the nest and bears down, pantin', and the eggs come one after another, slick and warm: %x of them, laid in a neat little heap.",
      "Belly heavy, thighs apart, %n pushes, and pushes, and %x eggs drop into the straw with soft wet thumps."]);
    more(E.layBig, [
      "%n lays for what feels like hours. %x eggs, every one a fresh stretch, until the nest overflows and they're lyin' limp and hollow beside it.",
      "It comes in waves. %n pushes through each one, moanin', and when the last of the %x is out, they curl round the pile and shake."]);
    more(E.gather, [
      "%n gathers the clutch into a basket, %x warm eggs, cradled like they're worth their weight in ribbons. They might be.",
      "%x eggs, collected one by one and counted twice. %n tucks the basket under their arm, a little proud."]);
  })();
