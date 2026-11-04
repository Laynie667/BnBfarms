  /* WHAT'S IN THIS FILE (10r-looks.js)
     What somebody's wearin' that the farm's lines should notice. For now: TAILS. A tail on a strap (the game's
     TailStraps) or a tail plug (a tail item in ItemButt: the plug fills the ass, so it's closed to cocks).
     tailOf(mn) → { kind: "horse"|"cow"|…|"", plug: true|false, name } or null
     tailBit(mn, hole, by) → one sentence about the tail for a scene line (or "" if they've got none)
     Add-ons get the same through api.tailOf / api.tailBit (glory stalls, Laynie's own).
  */
  const TAIL_KINDS = [[/pony|horse|mare|stallion|equine/i, "pony"], [/cow|bull|calf|heifer/i, "cow"], [/pig|piggy|sow|boar/i, "curly pig"],
    [/fox|vulpine/i, "fox"], [/wolf/i, "wolf"], [/puppy|dog|pup|canine/i, "puppy"], [/kitten|kitty|cat|feline|neko/i, "kitty"],
    [/bunny|rabbit|bun/i, "bunny"], [/mouse|rat\b/i, "mouse"], [/raccoon/i, "raccoon"], [/dragon|lizard|draconic/i, "dragon"], [/demon|devil|succubus/i, "devil"]];
  function tailOf(mn){
    const C = charFor(mn);
    if (!C || !Array.isArray(C.Appearance)) return null;
    const items = C.Appearance.filter(x => x && x.Asset && x.Asset.Group);
    const plug = items.find(x => x.Asset.Group.Name === "ItemButt" && /tail/i.test(x.Asset.Name));
    const strap = items.find(x => x.Asset.Group.Name === "TailStraps");
    const it = plug || strap;
    if (!it) return null;
    const text = [it.Asset.Name, it.Craft && it.Craft.Name, it.Craft && it.Craft.Description].filter(Boolean).join(" ");
    const kind = (TAIL_KINDS.find(([re]) => re.test(text)) || [])[1] || "";
    return { kind, plug: !!plug, name: (it.Craft && it.Craft.Name) || it.Asset.Name };
  }
  const TAIL_BITS = {
    // %n = them, %u = whoever's at them, %t = "pony tail", "cow tail"…
    lift: ["%u lifts %n's %t out of the way and holds it up like a handle.", "%u wraps %n's %t around one fist and pulls it tight.",
           "%n's %t gets shoved aside, then grabbed and yanked to arch their back.", "%u pins %n's %t flat against their spine to keep them still."],
    swish: ["%n's %t swishes hard with every thrust.", "%n's %t lashes back and forth, givin' away exactly how much they like it.",
            "%n's %t curls up tight and quivers.", "%n's %t flicks wildly as they're taken."],
    plug: ["The tail plug in %n's ass shifts with every thrust, the %t bobbin' along behind.", "%u gives %n's %t a tug, and the plug pulls at their ass till they whimper.",
           "%n's ass clenches around the tail plug, the %t twitchin' with it.", "%u twists %n's %t, workin' the plug inside them while they're used."],
    milk: ["%n's %t swishes lazily while the cups pull.", "Every long draw makes %n's %t twitch.", "%n's %t flicks at nothin', the way a contented dairy animal's does."],
  };
  function tailBit(mn, hole, by, mood){
    const t = tailOf(mn);
    if (!t) return "";
    const pool = mood === "milk" ? TAIL_BITS.milk : t.plug ? TAIL_BITS.plug.concat(TAIL_BITS.swish) : hole === "mouth" ? TAIL_BITS.swish : TAIL_BITS.lift.concat(TAIL_BITS.swish);
    const line = pickFresh("tail:"+mn, pool);
    return line.replace(/%n/g, plainName(mn)).replace(/%u/g, by ? (typeof by === "string" ? by : plainName(by)) : "somebody").replace(/%t/g, (t.kind ? t.kind+" " : "")+"tail");
  }
