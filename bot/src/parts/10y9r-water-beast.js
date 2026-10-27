  /* WHAT'S IN THIS FILE (10y9r-water-beast.js)
     THE THINGS IN THE WATER (Laynie, Oct 27: "more trap versions, like the water beast could use alot more versions").
     • The water's trap (the tentacle trap) isn't always the same thing now. Most times it's the old one, but the farm's
       water holds nine others too, each with its own way of takin' somebody and its own way of leavin' them:
         the jelly bloom   glowin' and see-through; its stings leave a heat (an hour, if their limits allow it)
         the eel-knot      a tangle of eels that ties itself inside them and keeps them longer, and fuller
         the mother        rare: the pond's old mother, twice the clutch, and MOTHER'S BROOD written on them
         the hungry one    all suckers: drinks their milk (and seed, with Milk my seed on) while it breeds them
         the singin' one   a song that puts them under; likelier after dark
         the reed-thing    thin feelers in the reeds: tickled and edged, and no cummin' for a while after
         the ink-spitter   leaves them black with ink from head to toe (?wash gets it off)
         the warm one      a warm spring's: slow and tender, and its eggs come a day sooner
         the twins         two of them at once
       The whisper after says which it was. ?traps tentacle lists them, and which ones have had you.
     • The old one has more lines in every part of its scene as well.
     The thing in the well (10y2-brood.js) is its own trap and stays as it was.
  */
  Object.assign(MESS, { ink: "#15121C" });
  const WATER_FORMS = {
    classic: { name: "the thing in the water", w: 30 },
    bloom: { name: "the jelly bloom", w: 10, mess: ["ecto", ["tummy", "chest", "thighs"]],
      tell: "Its stings will keep you warm a while yet.",
      after: (mn) => { if (!limitBlocks(mn, "heat")) startHeat(mn, BOTMN(), 1); face(mn, "heat", 120); },
      lines: {
        grab: [
          "The pond lights up. A soft blue glow drifts up out of the deep, a huge pale bell of jelly trailin' a curtain of glowin' threads, and the threads find %n's legs first.",
          "Somethin' clear as glass rises under %n, so clear they don't see it till its glowin' fringe brushes their thighs, and every place it touches starts to tingle.",
          "Pale lights pulse in the water round %n, slow as breathin'. Then the lights close in, and they're fixed to long see-through ribbons of jelly that wrap and cling.",
          "A bloom of jelly the size of a haycart surfaces beside %n, glowin' soft, and trails its threads over their skin. They sting, sweet and warm, and %n's knees go.",
        ],
        take: [
          "A thick, clear tendril of jelly presses into %n's %h, and they can see right through it: see it fill them, see the glow of it inside.",
          "The bloom slides a fat, wobblin' tendril into %n's %h. It's cool goin' in and warm a heartbeat later, and it tingles everywhere it touches inside them.",
          "Somethin' soft and clear and shiverin' pushes into %n's %h and keeps comin', fillin' them like warm jelly poured into a mould.",
        ],
        sig: [
          "Its stingers find %n's nipples, their thighs, the soft skin of their belly. Every sting's a tiny sweet bite, and every bite blooms into heat.",
          "The threads brush over %n again and again, stingin' light, and the tingle spreads till %n's whole body feels like it's blushin' from the inside out.",
          "%n can see the glow movin' inside them through their own skin, pulsin' slow, and every pulse tugs a moan out of them.",
          "The jelly settles over %n like a blanket and hums, and every stinger fires at once, and %n comes so hard the water round them ripples.",
        ],
        swell: [
          "The eggs come down the clear tendril one by one, and %n can see them: round, pale, glowin' faint, slidin' toward them like pearls on a string.",
          "Glowin' eggs drift down through the bloom's body and into the tendril buried in %n, and they watch every one of them go in.",
          "The bloom pulses bright, and a string of soft clear eggs slips up into %n's belly, each one cool a moment and then warm.",
        ],
        end: [
          "The bloom sinks away, dimmin', and leaves %n on the bank with %x soft glowin' eggs in their %h, their belly faintly lit from inside, and stings all over that won't stop tinglin'.",
          "%x jelly eggs in %n's %h, glowin' through their skin like a lantern under a sheet. The bloom drifts back down into the dark. The heat it stung into them stays.",
          "It lets %n go %x eggs heavier, every inch of their skin stung pink and buzzin'. The pond goes dark again. %n's belly doesn't.",
        ],
        endHyper: [
          "It fills %n with %x glowin' eggs, till their belly's round, tight and lit up like a paper lantern, and lowers them to the bank tinglin' head to toe.",
          "%x eggs. %n's belly glows so bright through their skin you could read by it, and the stings have them in heat before they've crawled out of the water.",
        ],
      } },
    eel: { name: "the eel-knot", w: 10, hold: 9, fillX: 1.5,
      tell: "It kept you tied a good while longer than most.",
      lines: {
        grab: [
          "The water by %n's feet starts to boil, and it's not bubbles: it's eels, dozens of long slick black ones, all knotted into one thing, and the thing wants %n.",
          "Somethin' slippery wraps %n's ankle, then another, then a whole writhin' tangle of long eel-like arms comes up out of the mud and drags them into the shallows.",
          "A knot of slick dark shapes unwinds itself from the reeds and swims for %n, and they're wrapped from knee to hip before they can take a step.",
          "%n slips on somethin' that moves. A tangle of eels, all one creature, coils round them where they fall, and holds.",
        ],
        take: [
          "Three of the eel-arms push into %n's %h at once, slippery as soap, and once they're inside they tie themselves together into a knot too big to pull back out.",
          "A long slick eel-arm slides into %n's %h, and another follows it, and they twist round each other inside, braidin' themselves deeper.",
          "The eel-knot feeds itself into %n's %h a coil at a time, slick and squirmin', and every coil knots on the last, swellin' them wider.",
        ],
        sig: [
          "The knot inside %n swells, big as a fist, and tugs. It's not comin' out. It's tied in, and it's goin' to stay tied a good long while.",
          "The eels inside %n writhe against each other, a slippery wrigglin' mass, and %n's belly rolls and bulges with them.",
          "It ties %n to itself, knot after knot, every one tighter, till %n's locked to the thing in the water like a mare to a stud.",
          "The knot pulls, gentle and relentless, and %n's whole body follows it, rockin' on the end of it in the water.",
        ],
        swell: [
          "The knot in %n loosens just enough for the eggs to come through it, one by one, slick and long as river stones.",
          "Eggs come down the braided eel-arms, squeezin' through the knot and droppin' into %n with a twist.",
          "Every egg has to push through the knot to reach them, and every one of them makes %n gasp on the way through.",
        ],
        end: [
          "The knot comes undone inside %n at last, coil by coil, and slithers out, leavin' %x eggs behind in their %h and %n gapin' and shakin' on the bank.",
          "%x eggs, tied in tight. When the eel-knot lets go it takes its time unknottin', and every slippery coil it draws out of %n's %h makes them sob.",
          "It unties itself from %n and slides back into the mud, and %n is left with %x eggs in their %h and a stretch that'll take a good while to forget.",
        ],
        endHyper: [
          "It ties in deep and lays till %n's belly is huge, %x eggs packed in behind the knot. When it finally unties, nothin' comes out but slime. The eggs stay right where they are.",
          "%x eggs, and the knot held every one of them in till the last. %n crawls out of the shallows with their belly draggin' and their %h still twitchin'.",
        ],
      } },
    mother: { name: "the mother of the pond", w: 4, hold: 9, eggsX: 2, hyperX: 2,
      tell: "That was the mother of the pond herself. Folk go years without seein' her.",
      after: (mn) => { later(() => bodyMark(mn, { write: { line: "MOTHER'S BROOD", area: "waist" } }), 3000); face(mn, "afterglow", 300); },
      lines: {
        grab: [
          "The whole pond rises. Somethin' vast and old comes up out of the deep, its arms thick as tree trunks, and it closes round %n the way a hand closes round an egg.",
          "Every other ripple on the water stops. Then the mother of the pond surfaces, a dark heavin' hill of arms, and %n is lifted clean out of the water by one of them.",
          "%n feels it before they see it: a pull in the water, like the whole pond's leanin' toward them. Then the mother comes, and there's no gettin' away from somethin' that big.",
        ],
        take: [
          "An arm thick as %n's thigh presses to their %h, and it doesn't push so much as wait, patient as the tide, till their body gives it room. Then it fills them, completely.",
          "The mother sinks one huge arm into %n's %h, so deep and so thick that %n's belly lifts with the shape of it. %n can't breathe a moment. Then they can, and they moan.",
          "Somethin' enormous and gentle pushes into %n's %h and stretches them wider than anythin' ever has, slow, so slow, till they're full to the brim.",
        ],
        sig: [
          "The mother hums, deep enough to feel in the bones, and every arm round %n squeezes in time, cradlin' them, rockin' them while she fills them.",
          "She's in no hurry. She holds %n in the water, strokin' their belly, their hair, their thighs, the way you'd settle a nervous heifer before a breedin'.",
          "Smaller arms come up off her, dozens of them, and every one finds somewhere on %n to hold or stroke or fill.",
          "%n can feel the mother's heartbeat through the arm inside them, slow and huge, and their own starts to match it.",
        ],
        swell: [
          "The mother starts to lay. Not eggs like the little ones: big, heavy, warm ones, each a slow stretch and a deep thud inside %n.",
          "Egg after egg comes up the mother's arm, every one bigger than the last, and %n's belly grows with each one, round and tight.",
          "She lays and lays. %n stops countin'. The water round them goes warm and cloudy, and still she lays.",
        ],
        end: [
          "The mother of the pond has laid %x eggs in %n's %h by the time she's done. She sets them on the bank so carefully, strokes their swollen belly once, and sinks away into the deep.",
          "%x eggs. The mother lets %n go like somethin' precious and slides back down, and the pond goes still and dark. %n's belly is the biggest it's ever been.",
          "She leaves %x of her eggs in %n's %h and a smear of somethin' like a blessin' across their belly, and the pond swallows her up again. Folk will talk about this one.",
        ],
        endHyper: [
          "The mother fills %n till there's no room left, and then makes room: %x eggs, packed so tight %n's belly's hard as a barrel, and she has to carry them up the bank herself.",
          "%x eggs. %n is so full of the mother's brood they can't stand, can't close their legs, can't do a thing but lie in the shallows holdin' their belly while she sinks away.",
        ],
      } },
    hungry: { name: "the hungry one", w: 8, can: (mn) => makesMilk(mn) || seedMilkable(mn),
      after: (mn, v) => {
        const p = prodOf(mn), m = makesMilk(mn) ? drainMilk(mn, p.milk * 0.7) : 0, s = seedMilkable(mn) ? drainSemen(mn, p.semen * 0.7) : 0;
        face(mn, "milked", 90);
        return m + s >= 1 ? "It drank "+ml(m + s)+" off you first." : "";
      },
      lines: {
        grab: [
          "Somethin' in the water smells %n before it sees them: a dozen thin, sucker-lined arms come snakin' up the bank, sniffin', and they go straight for the full parts.",
          "The thing that comes up at %n is all mouths: every arm ends in a soft pursed sucker, and every sucker's openin' and closin', hungry.",
          "A slick arm finds %n's ankle, and then the rest come all at once, starvin', and the first place they latch is wherever %n's fullest.",
        ],
        sig: [
          "{t}Suckers close over both of %n's teats and start to drink, hard rhythmic pulls that drag the milk out of them in long spurts.",
          "{c}A hollow arm slides down over %n's cock like a sleeve and starts to suck, ripplin' root to tip, milkin' them into itself.",
          "The hungry one drinks from %n everywhere it can, suckers pullin' in time, and every pull makes %n's back arch.",
          "%n can feel themself bein' emptied, pull by pull, and the thing in the water shivers with every swallow.",
        ],
        end: [
          "It drinks %n dry, every drop, then lays %x eggs in their %h as payment and slides back under. %n is left on the bank, emptied out on top and full below.",
          "The hungry one leaves %n drained to the last drop and full of %x of its eggs, which seems a fair trade to it. %n's not sure they agree. Their body does.",
          "It sucks till there's nothin' left, licks the last drops off %n with a dozen little tongues, and leaves %x eggs in their %h before it goes.",
        ],
      } },
    siren: { name: "the singin' one", w: 8, nightX: 3,
      start: (mn) => trance(mn, 2),
      tell: "Its song's still in your head. You'll be hummin' it a while.",
      after: (mn) => { trance(mn, 0); goUnder(mn, 1); face(mn, "trance", 120); },
      lines: {
        grab: [
          "Somethin' out on the water is singin'. No words, just a long low tune that wraps round %n's head like a warm cloth. They wade in to hear it better. Then it has them.",
          "%n hears it hummin' before they see a thing: a sweet low song from under the surface. Their feet carry them in without askin'. Soft arms meet them waist deep.",
          "A song drifts up off the pond, and %n's eyes go soft and far away. By the time the arms close round them, they're already smilin'.",
          "The singin' one hums from somewhere under the reeds, and %n stops, and listens, and forgets what they were doin', and wades in to the hips.",
        ],
        take: [
          "It sings while it slides into %n's %h, soft and low, and %n doesn't fight it. They sigh, and open, and let it in.",
          "The song gets deeper as the arm goes deeper into %n's %h, and %n hums along without knowin' they're doin' it.",
          "%n's floatin' in the song when it fills their %h, so far gone they hardly notice, till the pleasure catches up with them all at once.",
        ],
        sig: [
          "The singin' never stops. It gets inside %n's head and fills it, warm and heavy, till there's nothin' in there but the tune and the slow fuckin'.",
          "%n's eyes are wide open and seein' nothin'. They're smilin', rockin' in the water, hummin' the singin' one's song back to it.",
          "The song tells %n they're good, they're full, they're a nest, they're home, and %n believes every note.",
          "It sings, and every time the tune rises the arm in %n thrusts, and %n learns the song with their body before they learn it with their ears.",
        ],
        swell: [
          "The tune swells and so does the arm in %n, and the eggs come in time with the music, one on every long low note.",
          "It sings %n a lullaby while it lays in them, egg by egg, and %n sways along, eyes heavy, belly fillin'.",
        ],
        end: [
          "The song fades out. When %n comes to, they're sat on the bank with %x eggs in their %h and no idea how long they've been there. The tune's still in their head.",
          "%x eggs, and %n can't remember most of it. Only the song, which they hum all the way back without noticin'.",
          "The singin' one goes quiet and sinks away, and %n blinks awake on the bank %x eggs heavier, hummin' a tune they never learned.",
        ],
        endHyper: [
          "It sings %n full: %x eggs, their belly round and swayin', and %n hummin' along so happy they don't notice they can't stand.",
        ],
      } },
    reeds: { name: "the reed-thing", w: 8,
      after: (mn) => { const p = prodOf(mn); p.deniedUntil = Math.max(p.deniedUntil || 0, Date.now() + tmin(mn, 8)*60000); arouse(mn, 60, 95); face(mn, "edged", 180); return "It left you right on the edge, and you'll stay there: no cummin' for "+tmin(mn, 8)+" minutes."; },
      lines: {
        grab: [
          "The reeds along the bank aren't reeds. Dozens of thin brown-green feelers stand up straight as %n walks by, and then they all bend toward them at once.",
          "Somethin' tickles %n's calf. Then their thigh. Then everywhere, all at once: the reed bed's full of thin, wavin' feelers, and %n just walked into the middle of it.",
          "%n brushes through the reeds and they close up behind them, wrappin', and every reed is a long thin feeler with a soft tip, and every tip is curious.",
        ],
        take: [
          "Thin feelers slip into %n's %h, one, two, five, a dozen, each no thicker than a finger, wrigglin' and explorin' every inch of them.",
          "The reed-thing doesn't push in so much as seep in: a bundle of thin wavin' feelers twinin' into %n's %h and spreadin' out inside.",
          "A whole sheaf of slender feelers slides into %n's %h together and then fans out, ticklin' their insides in a dozen places at once.",
        ],
        sig: [
          "The feelers tickle. Everywhere. Under the arms, behind the knees, the soles of the feet, inside, and %n laughs and moans and can't tell which is which.",
          "They take %n right up to the edge and stop. Wait. Stroke. Up to the edge again. Stop. The reed-thing has all the time in the world.",
          "Every time %n gets close the feelers go still, and every time they calm down the feelers start again. %n's beggin' by the fourth time.",
          "A hundred soft tips flicker over %n at once, lighter than feathers, and not one of them stays long enough to finish them.",
        ],
        swell: [
          "Tiny eggs come down the feelers, small as peas, dozens of them, tricklin' into %n like seed into a furrow.",
          "The reed-thing seeds %n: little round eggs slippin' down every feeler at once, so many %n stops countin' at thirty.",
        ],
        end: [
          "The feelers slip out of %n one at a time and stand back up straight, innocent as reeds. %n's left on the bank with %x tiny eggs in their %h and nowhere near finished.",
          "It leaves %n with %x eggs in their %h and every nerve singin', right on the edge, and it isn't goin' to let them over. The reeds just sway.",
          "%x little eggs, planted deep. The reed-thing draws back and leaves %n right where it kept them the whole time: on the very edge, achin'.",
        ],
        endHyper: [
          "It seeds %n till their belly's round and tight with %x tiny eggs, every one shiftin' when they move, and leaves them edged, beggin' and denied.",
        ],
      } },
    ink: { name: "the ink-spitter", w: 8, mess: ["ink", ["face", "chest", "tummy", "thighs"]], noSplat: true,
      tell: "You're covered in its ink. ?wash gets it off.",
      lines: {
        grab: [
          "A cloud of black blooms in the water by %n's feet, and out of it comes a squirmin' mass of arms, spittin' ink as it comes.",
          "%n sees a dark shape in the water a moment before it hits them: a squirt of black ink right in the face, and while they're blind and sputterin', the arms take them.",
          "Somethin' surfaces with a wet pop and sprays %n with ink, black and warm, and the arms follow it up the bank before they can wipe their eyes.",
        ],
        take: [
          "An inky arm pushes into %n's %h, and it leaves a black streak everywhere it's touched, inside and out.",
          "It slides into %n's %h slick with its own ink, and the black runs down their thighs with every stroke.",
          "The ink-spitter shoves a thick black-smeared arm into %n's %h and squirts as it goes, so they're full of warm ink before they're full of anythin' else.",
        ],
        sig: [
          "Every time it thrusts it spits another jet of ink, and %n is soon black from the chest down, shiny and drippin'.",
          "It marks %n all over: black rings of suckers on their thighs, a stripe of ink across their belly, a smear on their cheek like a kiss.",
          "The water round %n goes black as night. Inside the cloud they can't see a thing. They can only feel, and there's a great deal to feel.",
          "Ink runs down %n's face and chest and drips off their nipples, and the arms smear it round like they're paintin' a picture.",
        ],
        swell: [
          "The eggs come out of the ink cloud dark and glossy as river stones, and up into %n one by one.",
          "Black eggs, slick with ink, squeeze up the arm and into %n with a squelch.",
        ],
        end: [
          "The ink-spitter sinks back into its own black cloud and leaves %n on the bank with %x dark eggs in their %h and ink all over them, head to toe.",
          "%x eggs, and %n's covered in so much ink they look painted. It'll take a good scrub to get it off. The eggs aren't comin' off at all.",
          "It squirts a last jet of ink across %n's chest, like a signature, and goes. %x eggs. Black streaks on everythin'.",
        ],
        endHyper: [
          "It lays %x dark eggs in %n, till their belly's huge and streaked inky black, and leaves them sat in a puddle of its ink, glossy from head to toe.",
        ],
      } },
    warm: { name: "the warm one", w: 8,
      tell: "Warm eggs come sooner: you'll be layin' a day early.",
      after: (mn) => { const p = prodOf(mn); if (p.eggs) p.eggs.layAt = Math.max(Date.now() + 6*3600000, p.eggs.layAt - 86400000); face(mn, "afterglow", 400); arouse(mn, 30); },
      lines: {
        grab: [
          "The water here is warm, warmer than it ought to be, and somethin' in it is warm too: soft arms come up slow and wrap round %n like a bath towel.",
          "Steam drifts off the water. Somethin' moves in it, slow and gentle, and soft warm arms close round %n's legs and draw them in like an embrace.",
          "%n sinks into the warm water without meanin' to, and somethin' sinks with them, wrappin' them up, holdin' them, warm all over.",
        ],
        take: [
          "It's slow. So slow. A warm soft arm presses into %n's %h a little at a time, waitin' for them to ease each time, till it's all the way in.",
          "The warm one slides into %n's %h like sinkin' into a hot bath, and %n's whole body goes loose and easy round it.",
          "It fills %n's %h gentle and warm, and holds still inside them a long moment, like it's lettin' them get used to it.",
        ],
        sig: [
          "It holds %n in the warm water and rocks them, slow, and strokes their hair with a soft tip, and the thrusts are so gentle they're more like breathin'.",
          "The warm one is all care: every arm holdin' %n a little tighter when they shiver, a soft tip wipin' the water out of their eyes.",
          "%n floats in its arms, warm through to the bones, fucked so slow and so sweet they've forgotten there's anythin' else to do.",
          "It hums against %n's skin, warm, and %n melts, and comes slow and long and soft, and it holds them all the way through.",
        ],
        swell: [
          "Warm eggs slide into %n one by one, each as cosy as a stone off the hearth.",
          "The eggs come slow and warm, and every one settles low in %n's belly like it was always meant to be there.",
        ],
        end: [
          "The warm one lays %x eggs in %n's %h, then holds them in the water a long while after, just holdin', before it lets them go. They come up pink and soft and smilin'.",
          "%x warm eggs. It lifts %n out onto the bank like somethin' it loves and slips back under the steam. %n lies there glowin'.",
          "It leaves %x eggs nestled warm in %n's %h and strokes their belly till they doze off on the bank. Warm eggs come sooner, folk say.",
        ],
        endHyper: [
          "It lays %x warm eggs in %n, slow and careful, till they're round as a harvest moon, then cradles them in the water till they stop tremblin'.",
        ],
      } },
    twins: { name: "the twins", w: 6, eggsX: 1.5, fillX: 1.4,
      tell: "There were two of them.",
      lines: {
        grab: [
          "There are two of them. One comes up on %n's left and one on %n's right, and they reach for them at the same moment, like they've done this before.",
          "A tentacle grabs %n's ankle, and while they're kickin' at it another one, off a second thing on the other side, grabs the other. The twins have them.",
          "The pond has two things in it today, and they both want %n. They meet in the middle, with %n between them.",
        ],
        take: [
          "One twin takes %n's %h and the other takes whatever's left, and they push in together, like they've practised.",
          "The twins fill %n from both sides at once, an arm each, and start a rhythm between them: one in while the other's out.",
          "One of the twins slides into %n's %h, and the other waits its turn about two seconds before it finds a way in too.",
        ],
        sig: [
          "The twins pass %n back and forth between them in the water, a turn each, never lettin' them go long without somethin' in them.",
          "Both twins thrust at once, and %n's caught in the middle with nowhere to go but deeper onto one or the other.",
          "The twins tangle round %n and round each other till %n can't tell where one ends and the other starts, only that they're full, everywhere.",
          "They take turns: one lays, one fucks, then they swap. %n is never, ever empty.",
        ],
        swell: [
          "Both twins lay at once, eggs comin' from both sides, and %n's belly swells twice as fast.",
          "The twins race each other to fill %n, egg after egg out of two arms at once.",
        ],
        end: [
          "Between the two of them the twins leave %x eggs in %n's %h, and they let go together, the way they took them. %n is left gapin' and drippin' on the bank.",
          "%x eggs, half from each, and both twins give %n's belly a pat before they sink away side by side.",
          "The twins leave %n with %x eggs and a dazed look, and slide back under together. %n's not sure which of them laid more. It doesn't seem to matter.",
        ],
        endHyper: [
          "With two of them layin', %n doesn't stand a chance: %x eggs, their belly huge and tight, and the twins have to lift them out together.",
        ],
      } },
  };
  // which one it is this time (the old one most often; the singin' one likelier after dark)
  function waterForm(mn){
    if (W.__FARMHAND_TEST__ && W.__waterForce && WATER_FORMS[W.__waterForce]) return Object.assign({ id: W.__waterForce }, WATER_FORMS[W.__waterForce]);
    const night = inCurfew() || hourNow() >= 21 || hourNow() < 5;
    const can = Object.entries(WATER_FORMS).filter(([, F]) => !F.can || F.can(mn));
    const w = can.map(([, F]) => F.w * (night && F.nightX ? F.nightX : 1));
    let x = Math.random() * w.reduce((a, b) => a + b, 0), i = 0;
    for (; i < can.length - 1; i++){ x -= w[i]; if (x < 0) break; }
    return Object.assign({ id: can[i][0] }, can[i][1]);
  }
  function waterFormsText(mn){
    const met = ((rec(mn) || {}).waterForms) || {};
    const list = Object.entries(WATER_FORMS).filter(([k]) => k !== "classic").map(([k, F]) => F.name+(met[k] ? " (had you "+met[k]+"×)" : "")).join(", ");
    return "The water doesn't always hold the same thing: most times it's the old one, but there's also "+list+".";
  }

  // ── more for the old one, in every part of its scene ──
  {
    const T = TRAP_LINES.tentacle;
    T.grab.push(
      "%n wades in to cool their feet. Somethin' under the surface takes that as an invitation: a slick coil closes round one ankle, then the other, and pulls them in to the waist.",
      "The reeds by the bank part on their own. What comes through them isn't a breeze. It's glossy and dark and strong, and it wraps %n's thigh before they've finished turnin' round.",
      "A long lazy loop of tentacle rises out of the water behind %n and hangs there drippin', like it's decidin'. Then it decides, and drops round their waist.",
      "%n's toes touch somethin' warm and rubbery on the bottom. It moves. It's not the bottom. It's the thing that lives here, and it's awake now.");
    T.strip.push(
      "Thin tips slide under every strap and seam on %n and tug, all together, and whatever they were wearin' comes away and floats off on the water.",
      "It turns %n over in the shallows like it's lookin' for somethin', sucker by sucker, over their belly, round their hips, between their legs. It finds it. It lingers there.",
      "Two coils lift %n's arms over their head and hold them, wrists crossed, while a third peels their clothes down to the ankles and casts them up the bank.",
      "%n's held chest-deep in warm water, spread out like a star, and somethin' soft and slick and patient goes over every inch of them, learnin' them.");
    T.take.push(
      "A tapered tip finds %n's %h and rubs slow circles round it, slick with slime, till it opens on its own. Then the thick part follows, and keeps on comin'.",
      "It pushes into %n's %h in one long unhurried slide, and it's ribbed like a washboard. %n feels every single ridge go by.",
      "The tentacle in %n's %h swells once it's inside, and keeps swellin', till they're stretched round it tight as a drum and it starts to pump.",
      "{v}It parts %n's pussy with two little tips, holds them open to the cold water one cruel moment, then fills them with somethin' hot and fat and alive.");
    T.takeShut.push(
      "Every way in is shut, so it gets patient. It strokes and squeezes %n all over and waits, rubbin' slime over the plug like it can wear it away.",
      "It can't get inside %n, so it does everything it can to the outside instead, coils slidin' slow between their thighs, round and round, till they're shakin'.");
    T.second.push(
      "Somethin' slimmer finds %n's ass and corkscrews in, turnin' as it goes, and once it's deep it starts to swell, slow and steady, till they're stuffed tight.",
      "A second tentacle joins the first, one in each hole, and they find a rhythm between them, in and out, so %n's never empty a moment.",
      "It slides a knobbled arm into %n's ass one knob at a time, and every knob makes them jerk. It counts them in. So does everybody watchin'.",
      "It pushes another arm up %n's ass, and the two inside them press together through the wall between, rubbin', so %n can feel them both at once.");
    T.wrap.push(
      "Coils wind round %n's belly and squeeze in time with the thrusts, so every stroke pushes deeper and every squeeze pushes back.",
      "{t}Two cups of suckers close over %n's tits and pull, hard and steady, and the thing drinks whatever comes out.");
    T.mouth.push(
      "A slim tentacle traces %n's lips till they part, then slides in over their tongue, sweet and slick, and down. %n's throat bulges with it.",
      "It feeds a fat arm into %n's mouth slow, lettin' them taste it, and then squirts somethin' thick that tastes of honey and salt and makes their eyes go heavy.",
      "%n tries to shout and gets a mouthful of tentacle for it. It fills their cheeks, presses down their tongue, and starts to pump.",
      "One arm cups %n's chin, almost gentle, and another slides between their lips. It fucks their mouth in time with the rest of it.");
    T.muzzle.push(
      "It finds %n's mouth already stoppered and strokes the gag instead, slow, and winds a coil round their head to keep it tipped back.",
      "With %n's mouth plugged, it settles for holdin' their jaw and pressin' its tip to the gag, like a kiss through a door.");
    T.swell.push(
      "Somethin' round and heavy pushes into the base of the tentacle in %n and starts to move. %n can see it, a bump under the skin of the arm, travellin' toward them.",
      "The whole thing goes still. Then the arm inside %n starts to bulge, one round lump after another, and every lump stretches them and drops into them, warm and heavy.",
      "It holds %n tight, every arm at once, and starts to lay. Egg after egg, squeezed up the tentacle and pushed deep, till %n can feel them shiftin' about inside.",
      "%n feels the first egg reach them: a hard round stretch, a pop, and a warm weight settlin' low in their belly. Then the next. Then the next.");
    T.end.push(
      "%x eggs later, the tentacles slip out of %n one after another and lay them on the bank, belly swollen and lumpy, slime runnin' out of their %h in long strings.",
      "It finishes with %n slow: the last of %x eggs pushed in deep, a gush of warm slime to keep them there, and then it lets go all at once and sinks away.",
      "The water closes over it as gentle as it came. %n is left on the bank with %x eggs in their %h, gapin', blinkin' at the sky.",
      "It strokes %n's swollen belly once with the tip of an arm, almost proud, and slides back into the water. %x eggs. %n can feel every one.");
    T.endHyper.push(
      "It doesn't stop at a clutch. It keeps on layin' till %n's belly is swollen huge and tight, %x eggs crammed up their %h, and has to roll them onto the bank because they can't move.",
      "%x eggs. %n's belly sticks out like they're due tomorrow, hard and round and lumpy with them, and their %h won't close round the last one.");
    if (T.churn) T.churn.push(
      "It stops thrustin' and starts stirrin' instead, every arm inside %n twistin' slow, round and round, till they're moanin' with every turn.",
      "The tentacles inside %n squirm against each other, a writhin' knot of them, and %n's belly ripples with it from the outside.");
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __waterForms: () => WATER_FORMS, __waterForm: (m) => waterForm(m) });
