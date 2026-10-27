  /* WHAT'S IN THIS FILE (10z5-trap-more.js)
     MORE OF EACH TRAP'S OWN LINES (Laynie, Oct 27: "They should be immersive, detailed, non-clinical, expansive
     message pools for all traps, 3-4 seems like a paltry amount"). Every beat of a trap's own story is a pool the
     farm picks one line from; most had two to four. The files after this one (10z5a-..., 10z5b-..., a batch each)
     grow them, trap by trap, beat by beat, every line picked for the body it's about ({v} {c} {t} and the rest).
       trapMore(kind, "how the beat's first line starts", [more lines], "the next beat's...", [more], ...)
     A beat is found by how its first line starts, so a trap whose story branches (milk or seed, in or over) gets the
     right lines on the right branch. trapSceneMore(kind, [more for its first extra beat], [more for its second])
     grows the two beats of its own in 10ue-trap-scenes.js (or the season's file), and studSceneMore(kind, version, ...)
     a stud version's own two.
     %n who's in it · %h the hole it's in · %c how big the cock is · and the rest as the trap's own lines have them.
  */
  const TRAP_MORE = {};
  function trapMore(kind, ...pairs){
    const L = TRAP_MORE[kind] = TRAP_MORE[kind] || [];
    for (let i = 0; i + 1 < pairs.length; i += 2) L.push([pairs[i], pairs[i + 1]]);
  }
  function trapSceneMore(kind, ...pools){
    const S = TRAP_SCENE[kind]; if (!S) return;
    pools.forEach((p, i) => { if (S[i] && p && p.length) S[i] = S[i].concat(p); });
  }
  // a stud's version keeps two beats of its own too (10y9r2-stud-forms.js): those grow the same way
  function studSceneMore(kind, form, ...pools){
    const F = STUD_FORMS[kind] && STUD_FORMS[kind][form]; if (!F || !F.scene) return;
    pools.forEach((p, i) => { if (F.scene[i] && p && p.length) F.scene[i] = F.scene[i].concat(p); });
  }
  // a trap's own beats, each with its more lines added (trapRun, 10u-traps.js)
  function moreBeats(kind, beats){
    const L = TRAP_MORE[kind];
    if (!L || !Array.isArray(beats)) return beats;
    return beats.map(b => {
      const pool = Array.isArray(b) ? b : [b], head = String(pool[0] || "");
      const more = L.filter(([h]) => head.startsWith(h)).flatMap(([, l]) => l);
      return more.length ? pool.concat(more) : b;
    });
  }
  if (W.__FARMHAND_TEST__) Object.assign(W, { __trapMore: TRAP_MORE, __moreBeats: moreBeats, __trapScene: TRAP_SCENE });
