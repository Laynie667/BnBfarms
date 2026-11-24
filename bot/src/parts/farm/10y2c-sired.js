  /* WHAT'S IN THIS FILE (10y2c-sired.js)
     BRED TO HIS KIND (Nov 23, the suggestion box's #60; Laynie: "the pregnancy by species impregnated by, and pregnancy
     lines"). A pregnancy used to be the mother's own kind all through: a cow bred by a dog carried a calf, five days like
     everybody. Now the SIRE's kind decides what's in there:
     • HOW MANY: his kind's litter (CFG.SPECIES[kind].litter). A rat leaves six to twelve; a stallion, one.
     • HOW LONG: his kind's days (CFG.SPECIES[kind].days). Bunnies, rats and goblins two days; pups, kittens, kits three;
       piglets four; lambs and kids five; fawns and hatchlings six; calves seven; foals eight. Her Mother's Hips perk still
       takes its bit off.
     • WHAT'S BORN: his kind's young. The labour stays hers (her place, her sounds, her own way of goin' about it), but
       what slides out is his: a cow strains in the calvin' pen and pushes out pups. When the young aren't her kind the
       crownin' and the after are lines of their own (BIRTH_CROSS), so nobody's licking "wobbly legs" on a pup.
     • A sire with no kind on file (a human, a stranger at the glory stalls) leaves it all to the mother's kind, as before.
       The farm's own studs in the traps are their kinds (TRAP_SIRE_KIND): the wolf pack's wolves, the stallion stud's a
       horse, the buck rabbits rabbits. Somethin' with no farm kind at all (the yeti, the naga, the thing in the corn)
       carries as the mother's kind.
     • A pregnancy from before this has no kind written on it: it goes on as the mother's.
     The lines along the way (cravings, kicks, nestin', by what they're carryin') are the breeding add-on's
     (addons/breeding/carrying.js): it asks api.labour.kind for what's in there.
  */
  const TRAP_SIRE_KIND = { [-10]: "wolf", [-11]: "horse", [-12]: "bull", [-13]: "rabbit", [-14]: "pig", [-15]: "cat", [-16]: "dragon",
    [-18]: "dog", [-20]: "goat", [-21]: "pig", [-22]: "horse", [-30]: "dog", [-33]: "deer", [-40]: "goblin", [-41]: "goblin", [-43]: "bull",
    [-44]: "wolf", [-45]: "fox", [-46]: "cat", [-47]: "sheep", [-62]: "dog", [-74]: "rabbit" };
  // the sire's kind, or null for none on file
  function sireKind(stud){
    const n = Number(stud); if (!isFinite(n) || !n) return null;
    if (n < 0){ const k = TRAP_SIRE_KIND[n]; return k && CFG.SPECIES[k] ? k : null; }
    if (!rec(n)) return null;
    const k = speciesKey(n); return k && k !== "default" ? k : null;
  }
  const pregKindFor = (mother, stud) => sireKind(stud) || speciesKey(mother);
  const pregDays = (kind) => { const S = CFG.SPECIES[kind]; return S && S.days > 0 ? S.days : CFG.PROD.PREG_DAYS; };
  // what somebody's carryin' (their own kind for a pregnancy from before Nov 23, or when they aren't)
  function youngKindOf(mn){ const p = prodOf(mn); return (p && p.preg && p.preg.kind) || speciesKey(mn); }
  // "pups" · "foal" (a kind that has one at a time says it as one)
  function carryWord(mn){ const k = youngKindOf(mn), S = CFG.SPECIES[k] || CFG.SPECIES.default, w = birthWords(mn); return S.litter[1] > 1 ? w.many : w.one; }
  // "Due in 3 days." · "Due tomorrow."
  function dueWords(mn){
    const p = prodOf(mn), g = p && p.preg; if (!g) return "";
    const d = Math.max(1, Math.round((g.due - Date.now()) / 86400000));
    return d === 1 ? "Due tomorrow." : "Due in " + d + " days.";
  }

  // when the young aren't the mother's kind: the crownin' and the after. %mine: the young of her own kind ("calf"),
  // and lines with it are only for a mother who has a kind of her own. The rest as in BIRTH_KIND_LINES.
  const BIRTH_CROSS = {
    crown: [
      "%n bears down with %sound, and what slides out into %place is no %mine: it's a slick, squirmin' %one, %c's through and through.",
      "One long push and a wet %one comes squallin' into the straw. There's not a bit of %n's kind in its looks. It's all %c's.",
      "The farm girl catches it as it comes: a damp little %one, its sire's kind, out of a body that was made for a %mine. She grins and lays it by %n.",
      "%n pants and pushes, and opens round a %one that was never meant for their kind. It comes slick and quick, %c's breed stamped all over it.",
      "%n lets out %sound, and out comes a %one, wet and blinkin'. %n stares at it, dazed: bred to another kind, and here's the proof.",
      "A last hard push and a %one slips free, %c's kind from its nose to its tail, and %n sags in %place with a shaky laugh.",
    ],
    endOne: [
      "%n curls round their one %one, %sexone, and it's %c's kind, not theirs. It roots for a teat all the same, and their milk comes in for it.",
      "It's done. One %one, %sexone, sired by %c, with nothin' of %n's kind in it. They nurse it anyway, dazed and drippin'.",
      "%n stares down at the %one on their chest, %sexone and %c's spittin' image, latched on and suckin' hard.",
      "%n lies back in %place with a %one tucked against them, %sexone, every inch its sire's breed. No %mine for this one. They were bred to %c's kind, and they've birthed it.",
    ],
    endMany: [
      "When it's over, %n lies in %place with %kids squirmin' at their teats, %sexes, every one of them %c's kind and not a %mine among them.",
      "%kids, %sexes, all %c's, and %n's body made every one. They lie in a heap against their mama nursin', and %n's milk lets down hard.",
      "The farm girl counts them off: %kids, %sexes, %c's breed through and through. %n just lies there, emptied out and leakin', bred proper to another kind.",
      "%n's belly's soft and empty and %kids are piled against them, %sexes, all %c's kind. %n strokes the nearest one and can't stop shakin'.",
      "It's done: %kids, %sexes, sired by %c and lookin' like it. %n gathers them in, a mama to a breed that isn't theirs.",
    ],
  };
  const CROSS_KEYS = new Set(Object.keys(BIRTH_CROSS));

  if (W.__FARMHAND_TEST__) Object.assign(W, { __sireKind: (s) => sireKind(s), __pregKindFor: (m, s) => pregKindFor(m, s), __pregDays: (k) => pregDays(k),
    __youngKindOf: (mn) => youngKindOf(mn), __birthCross: () => BIRTH_CROSS });
