  /* WHAT'S IN THIS FILE (10y9u-hitch.js)
     HITCHING POSTS (BC R134, Nov 18). Laynie: the game's own leash setting decides (no farm switch of its own), "any
     staff or owner" can hitch, and it lasts "until the time's up, or milked according to their settings".
     R134 lets a leash be tied to a post on the map: a pole, a fence, a barrel, a tree, a cross... that a room admin has
     made a tether point. Tied, you can't go more than two squares from it, and it holds while whoever tied it, or a room
     admin, is in the room. I'm both, so mine hold.
     • ?hitch <who> [post] [minutes|milk]   staff, their owner, or their herd's leader. I bring them to the post (their
                                            Companion walks them, or I move them) and tie their leash to it.
         post      a word for where it is: parlour, barn door, stockade, pasture, or the post itself (pole, barrel,
                   cross, rope, post...). Left out: the post nearest them.
         minutes   how long, 5 to 240 (30 if nobody says)
         milk      till they're milked, for anybody who makes milk (their own settings). At a post by the milkin'
                   stalls that's what it means anyway, unless minutes are given. Four hours at most.
     • ?unhitch <who>   whoever could hitch them. ?hitch alone: the farm's posts, and who's tied where.
     • It needs what the game needs: a lead on them (the game's Leash effect: a collar leash or chain), leashing allowed in
       their game's settings, and me allowed to use items on them. No lead, but a collar and "Farm can put real gear on
       me" on in their Companion: I clip one on (farm gear, "leash"), and it comes off with the knot. Their limits can rule
       it out (leash, tether, hitch, tied up).
     • Let go when the time's up, once they're milked (a milk hitch), with their safeword, ?unhitch, or if they leave.
       While they're hitched, the farm's other movin' about (summons, feedin' time, the reins) leaves them be.
  */
  if (CFG.HITCH_MIN === undefined) CFG.HITCH_MIN = 30;
  if (CFG.HITCH_MAX_MIN === undefined) CFG.HITCH_MAX_MIN = 240;
  if (CFG.HITCH_WAIT_S === undefined) CFG.HITCH_WAIT_S = 60;   // how long I wait for them to get to the post
  const HITCH_LIMIT = /\b(leash\w*|tether\w*|hitch\w*|tied up|tying up)\b/i;
  const hitchBook = () => (L.hitch = L.hitch || {});
  // what a post is (the game's object), in farm words
  const POST_WORD = { Pole: "pole", NordicPillar: "post", Pillar: "pillar", Totem: "totem", Barrel: "barrel", "X-Cross": "cross", VelourRopeBarrier: "rope",
    FarmFenceSingle: "rail", HomeFenceSingle: "rail", PicketFence: "fence", BarbFence: "fence", LampPost: "lamp post", OakTree: "tree", OakTree_Fall: "tree",
    PineTree: "pine", Sakura: "tree", LeaflessTree: "tree", PalmTree: "palm", Bush: "bush", Fountain: "fountain", WishingWell: "well", ParkBench: "bench", Chest: "chest", StonePile: "stones", Rocks: "rocks" };
  // a spot's name, as a place (the farm's own spots near a post say where it is)
  const PLACE_OF = (n) => /^milking/.test(n) ? "parlour" : /^(home|rescue)$/.test(n) ? "barn door" : /^(stocks|bench)$/.test(n) ? "stockade" : /^trough/.test(n) ? "trough"
    : /^glory/.test(n) ? "glory stalls" : /^(barn|speaker-barn)$/.test(n) ? "barn" : /^water-/.test(n) ? "pond" : /^(summon)$/.test(n) ? "house" : /^(trap|post-)/.test(n) ? null : n.replace(/[-_]?\d+$/, "");
  const postInZone = (z, X, Y) => z && z.a && z.b && X >= Math.min(z.a.X, z.b.X) && X <= Math.max(z.a.X, z.b.X) && Y >= Math.min(z.a.Y, z.b.Y) && Y <= Math.max(z.a.Y, z.b.Y);
  const postDist = (a, b) => Math.max(Math.abs(a.X - b.X), Math.abs(a.Y - b.Y));
  // the posts on the room's map: tiles whose object a room admin made a tether point
  function hitchPosts(){
    const M = W.ChatRoomData && W.ChatRoomData.MapData, cells = (M && M.CellData) || {}, wide = W.ChatRoomMapViewWidth || 40, out = [];
    for (const [k, c] of Object.entries(cells)){
      if (!c || c.Type !== "Tether") continue;
      const i = Number(k), X = i % wide, Y = Math.floor(i / wide);
      let style = "";
      try { const MM = W.MapManager && W.MapManager.Map; if (MM && typeof MM.isValidObjectConfig === "function" && !MM.isValidObjectConfig(i, "Tether")) continue; const o = MM && MM.getObject && MM.getObject(i); style = (o && o.Style) || ""; } catch(e){ /* as it says */ }
      const at = { X, Y }, words = [];
      // a spot named for it (?spot set post-<name>) wins; then the milkin' spots, the zone it's in, the nearest spot
      const named = Object.entries(L.spots || {}).find(([n, s]) => /^post-/.test(n) && s && postDist(s, at) <= 1);
      let place = named ? named[0].slice(5).replace(/-/g, " ") : null;
      const near = Object.entries(L.spots || {}).filter(([n, s]) => s && postDist(s, at) <= 2).sort((a, b) => postDist(a[1], at) - postDist(b[1], at));
      const parlour = near.some(([n]) => /^milking/.test(n));
      if (!place && parlour) place = "parlour";
      const zones = Object.entries(L.zones || {}).filter(([, z]) => postInZone(z, X, Y)).map(([n, z]) => z.group || n);
      if (!place && zones.length) place = zones[0];
      if (!place){ const s = near.map(([n]) => PLACE_OF(n)).find(Boolean); if (s) place = s; }
      const thing = POST_WORD[style] || "post";
      for (const w of [place, thing, ...zones, ...near.map(([n]) => PLACE_OF(n))]) if (w && !words.includes(w)) words.push(w);
      out.push({ X, Y, i, parlour, words, name: "the " + (place ? place + " " : "") + thing });
    }
    return out;
  }
  // may they hitch this one: staff, their owner (the game's), or their herd's leader
  function mayHitch(by, t){
    if (isStaff(by) || isProprietor(by) || membership(t, by)) return true;
    const C = charFor(t); return !!(C && C.Ownership && C.Ownership.MemberNumber === by);
  }
  // what the game wants before it'll tie them (I check it first, so I can say what's missin'). "lead" means the only
  // thing missin' is a lead on them, which their Companion can clip on (farm gear) when they've let it.
  const hasLead = (C) => (C.Appearance || []).some((it) => { try { return typeof W.InventoryItemHasEffect === "function" ? W.InventoryItemHasEffect(it, "Leash", true) : /Leash|Chain/.test(it.Asset.Name) && it.Asset.Group.Name === "ItemNeckRestraints"; } catch(e){ return false; } });
  const hasCollar = (C) => (C.Appearance || []).some((it) => it && it.Asset && it.Asset.Group && it.Asset.Group.Name === "ItemNeck");
  const gearLets = (t) => { const c = state.companions.get(t); return !!(hasCompanion(t) && c && !(c.off && c.off.gear)); };
  function hitchWhyNot(t){
    const C = charFor(t), n = plainName(t);
    if (!C) return n + " isn't here, sugar.";
    if (C.OnlineSharedSettings && C.OnlineSharedSettings.AllowPlayerLeashing === false) return n + "'s game has leashing switched off, so nobody can tie them to a post.";
    if (W.ChatRoomData && Array.isArray(W.ChatRoomData.BlockCategory) && W.ChatRoomData.BlockCategory.includes("Leashing")) return "This room blocks leashing, so there's no hitchin' in it.";
    try { if (typeof W.ServerChatRoomGetAllowItem === "function" && !W.ServerChatRoomGetAllowItem(W.Player, C)) return n + "'s game won't let me use items on them, so I can't tie them up."; } catch(e){ /* the game decides */ }
    if (!hasLead(C)) return gearLets(t) && hasCollar(C) ? "lead" : n + " needs a lead on their collar first (a collar leash or chain)" + (hasCollar(C) ? "" : ", and a collar to clip it to") + ". With \"Farm can put real gear on me\" on in their Companion I clip one on myself.";
    try { if (typeof W.ChatRoomCanBeLeashedBy === "function" && !W.ChatRoomCanBeLeashedBy(CFG.BOT_MEMBER, C)) return n + "'s lead is locked to somebody else, or somethin' already has hold of them."; } catch(e){ /* the game decides */ }
    return "";
  }
  const hitchedNow = (mn) => !!hitchBook()[mn];
  function besidePost(post, avoid){
    const taken = new Set((W.ChatRoomCharacter || []).filter(c => c.MemberNumber !== avoid && c.MapData && c.MapData.Pos).map(c => c.MapData.Pos.X + "," + c.MapData.Pos.Y));
    const free = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++){
      const X = post.X + dx, Y = post.Y + dy; if ((!dx && !dy) || taken.has(X + "," + Y) || X < 0 || Y < 0) continue;   // (never on the post itself)
      let ok = true; try { const MM = W.MapManager && W.MapManager.Map; if (MM && typeof MM.canEnterTile === "function") ok = MM.canEnterTile(X, Y) !== false; else if (typeof W.MapCanEnterTile === "function") ok = !!W.MapCanEnterTile(X, Y); } catch(e){ ok = true; }
      if (ok) free.push({ X, Y, d: Math.abs(dx) + Math.abs(dy) });
    }
    free.sort((a, b) => a.d - b.d);
    return free.length ? free[0] : { X: post.X, Y: post.Y };
  }
  const HITCH_ON = [
    "🪢 %b clips a lead to %n's collar, walks them over to %p and ties it off with a hard tug. %n's not goin' anywhere.",
    "🪢 %b ties %n to %p, short enough that they can turn round and present, and not much else.",
    "🪢 A lead from %n's collar to %p, a knot %b pulls tight, and that's %n parked like a heifer at the rail.",
    "🪢 %b hitches %n to %p and gives the knot a pat. Stay put, sugar.",
  ];
  const HITCH_MILK = [
    "🪢 %b ties %n to %p by the stalls. Milkin' time: they're stayin' right there till those teats have been emptied.",
    "🪢 %n gets hitched to %p, udder first. %b's not untyin' that knot till somebody's milked 'em dry.",
  ];
  const HITCH_OFF = {
    time: ["🪢 %b unties %n from %p. Time's up, sugar, off you go.", "🪢 The knot comes loose and %n's free of %p again."],
    milked: ["🪢 Milked and done: %b unties %n from %p and sends 'em off with a pat on the rump.", "🪢 Emptied out, %n gets untied from %p. Good girl."],
    off: ["🪢 %b unhitches %n from %p.", "🪢 %n's lead comes off %p, and they can wander again."],
    safe: ["🪢 %n's untied from %p, right away."],
  };
  const hitchFill = (t, mn, by, post) => t.replace(/%n/g, plainName(mn)).replace(/%b/g, by === CFG.BOT_MEMBER ? "The farm girl" : plainName(by)).replace(/%p/g, post || "the post");
  function tieRequest(C, tether){
    if (typeof W.ChatRoomMapViewSendTetherRequest === "function"){ W.ChatRoomMapViewSendTetherRequest(C, tether); return true; }
    send("ChatRoomChat", { Content: "ChatRoomMapViewTether", Type: "Hidden", Dictionary: [{ Tag: "MapViewTether", Tether: tether }], Target: C.MemberNumber }, true);
    return true;
  }
  // ?hitch <who> [post] [minutes|milk]
  function hitchCmd(by, args, R){
    if (!args.length) return R(hitchList());
    const t = resolveTarget(args[0]);
    if (!t || !charFor(t)) return R("Hitch who, sugar? They need to be here on the map: ?hitch <who> [post] [minutes|milk].");
    if (!mayHitch(by, t)) return R("Only staff, " + plainName(t) + "'s owner or their herd's leader can hitch them, hon.");
    if (!mapRoom() || !posOf(t)) return R("The room isn't on its map right now, so there's nothin' to tie to.");
    const r = rec(t) || {};
    if (HITCH_LIMIT.test(r.limits || "")) return R(plainName(t) + "'s limits rule out bein' tied up like that, sugar.");
    if (hitchedNow(t) || (charFor(t).MapData && charFor(t).MapData.Tether)) return R(plainName(t) + "'s already tied to a post, sugar. ?unhitch " + plainName(t) + " first.");
    let mins = null, milk = false, word = "";
    for (const a of args.slice(1)){ if (/^\d{1,3}$/.test(a)) mins = Number(a); else if (/^milk(ed|ing)?$/i.test(a)) milk = true; else word += (word ? " " : "") + String(a).toLowerCase(); }
    const posts = hitchPosts();
    if (!posts.length) return R("There's no hitchin' post on the farm's map yet, hon. A room admin makes one: click a pole, a fence, a barrel or a tree in the map editor and make it a tether point.");
    const cands = word ? posts.filter(p => p.words.some(w => w === word || w.includes(word) || word.includes(w))) : posts;
    if (!cands.length) return R("No post by that name, sugar. The farm's posts: " + posts.map(p => p.name).join(", ") + ".");
    const from = posOf(t), post = cands.slice().sort((a, b) => postDist(a, from) - postDist(b, from))[0];
    if (!mins && !milk && post.parlour && makesMilk(t)) milk = true;   // tied by the stalls: till they're milked
    if (milk && !makesMilk(t)) return R(plainName(t) + " doesn't make milk, hon, so there's nothin' to wait for. Give me minutes instead: ?hitch " + plainName(t) + " " + (word || "") + " 30");
    const why = hitchWhyNot(t); if (why && why !== "lead") return R(why);
    mins = Math.max(5, Math.min(CFG.HITCH_MAX_MIN, mins || CFG.HITCH_MIN));
    // no lead on them, but their Companion lets the farm put gear on: a lead for as long as they're hitched
    if (why === "lead") gearOn(t, "leash", "Hitchin' Lead", "A lead clipped to the collar, the other end knotted round a post.", (milk ? CFG.HITCH_MAX_MIN : mins) + 10, "hitch", { items: ["CollarLeash", "CollarChainLong"] });
    state.hitchWant = state.hitchWant || new Map();
    state.hitchWant.set(t, { by, post: { X: post.X, Y: post.Y }, name: post.name, mins, milk, at: Date.now(), asked: 0 });
    teleport(t, besidePost(post, t), true);   // (their Companion walks them over if they let it)
    R("🪢 Bringin' " + plainName(t) + " to " + post.name + (milk ? ", till they're milked." : ", for " + mins + " minutes."));
  }
  // ?unhitch <who>
  function unhitchCmd(by, args, R){
    const t = args.length ? resolveTarget(args[0]) : by;
    const h = t && hitchBook()[t];
    if (!h) return R((t === by ? "You're" : plainName(t) + " isn't") + (t === by ? " not hitched, sugar." : " hitched, sugar."));
    if (!(mayHitch(by, t) || h.by === by)) return R("Only whoever could hitch " + plainName(t) + " can untie them, hon. Your safeword always does.");
    hitchLet(t, "off", by); R("🪢 " + plainName(t) + "'s untied.");
  }
  function hitchList(){
    const posts = hitchPosts(), book = hitchBook();
    if (!posts.length) return "🪢 No hitchin' posts on the map yet. A room admin makes a pole, a fence, a barrel or a tree a tether point in the map editor.";
    const who = Object.entries(book).map(([mn, h]) => plainName(Number(mn)) + " at " + h.name + (h.milk ? " (till milked)" : " (" + Math.max(1, Math.ceil((h.until - Date.now()) / 60000)) + " min)"));
    return "🪢 The farm's hitchin' posts: " + posts.map(p => p.name).join(", ") + "." + (who.length ? "\nTied up now: " + who.join(", ") + "." : "") +
      "\n?hitch <who> [post] [minutes|milk] · ?unhitch <who> · staff, their owner, or their herd's leader";
  }
  // let go: time, milked, off (?unhitch), safe, gone (they left), slipped (untied some other way)
  function hitchLet(mn, why, by){
    const book = hitchBook(), h = book[mn]; if (!h) return false;
    delete book[mn]; gearOff(mn, "leash", "hitch"); saveLedger(); syncCompanions(true);   // (and the lead I clipped on, if I did)
    const C = charFor(mn);
    if (C && C.MapData && C.MapData.Tether && why !== "slipped") { try { tieRequest(C, null); } catch(e){ warn("unhitch:", e); } }
    const pool = HITCH_OFF[why];
    if (pool && C) emote(hitchFill(pickFresh("hitch:off:" + why, pool), mn, by || CFG.BOT_MEMBER, h.name), mn);
    return true;
  }
  // every few seconds: tie the ones that got there, untie the ones whose time came
  function hitchTick(){
    const now = Date.now();
    const want = state.hitchWant || new Map();
    for (const [t, w] of want){
      const C = charFor(t);
      if (!C || now - w.at > CFG.HITCH_WAIT_S * 1000){ want.delete(t); gearOff(t, "leash", "hitch"); if (C) tell(w.by, "🪢 " + plainName(t) + " never got tied to " + w.name + (hitchWhyNot(t) && hitchWhyNot(t) !== "lead" ? ": " + hitchWhyNot(t) : ": their game didn't take the knot (it decides who can tie them).")); continue; }
      const tied = C.MapData && C.MapData.Tether;
      if (tied && tied.Position && tied.Position.X === w.post.X && tied.Position.Y === w.post.Y){
        want.delete(t);
        const p = prodOf(t) || {};
        hitchBook()[t] = { X: w.post.X, Y: w.post.Y, name: w.name, by: w.by, at: now, milk: w.milk, milkAt: p.lastMilkAt || 0, until: now + (w.milk ? CFG.HITCH_MAX_MIN : w.mins) * 60000 };
        saveLedger(); syncCompanions(true);
        emote(hitchFill(pickFresh(w.milk ? "hitch:milk" : "hitch:on", w.milk ? HITCH_MILK : HITCH_ON), t, w.by, w.name), t);
        tell(t, "🪢 You're hitched to " + w.name + (w.milk ? " till you're milked" : " for " + w.mins + " minutes") + ": two steps from it and no further. Your safeword unties you.");
        continue;
      }
      const at = posOf(t);
      if (!at || postDist(at, w.post) > 1 || now - w.asked < 5000) continue;
      // they're there: me beside the post too (the game wants us both in reach of it), then the knot
      const me = charFor(CFG.BOT_MEMBER);
      if (me && me.MapData && me.MapData.Pos && postDist(me.MapData.Pos, w.post) > 1){
        const spot = besidePost(w.post, CFG.BOT_MEMBER);
        me.MapData.Pos = { X: spot.X, Y: spot.Y }; send("ChatRoomCharacterMapDataUpdate", me.MapData, true); state.walkedAt = now;
        w.asked = now - 3500;   // (a moment for my move to reach their game, then ask)
        continue;
      }
      w.asked = now;
      if (hitchWhyNot(t)) continue;   // (the lead their Companion's clippin' on isn't there yet)
      try { tieRequest(C, { Position: { X: w.post.X, Y: w.post.Y }, MemberNumber: CFG.BOT_MEMBER }); } catch(e){ warn("hitch:", e); }
    }
    for (const [k, h] of Object.entries(hitchBook())){
      const mn = Number(k), C = charFor(mn);
      if (!C){ delete hitchBook()[k]; saveLedger(); continue; }   // (gone: the game lets go of its own)
      if (!(C.MapData && C.MapData.Tether) && now - h.at > 20000){ hitchLet(mn, "slipped"); continue; }
      if (h.milk && ((prodOf(mn) || {}).lastMilkAt || 0) > h.at){ hitchLet(mn, "milked"); continue; }
      if (now >= h.until) hitchLet(mn, "time");
    }
  }
  // for the right-now strip (10p-lookout.js) and the Companion
  function hitchNow(mn){ const h = hitchBook()[mn]; return h ? [{ icon: "🪢", text: "Hitched to " + h.name + (h.milk ? " till you're milked" : ""), until: h.milk ? undefined : h.until }] : []; }
  addCommand("hitch", { topic: "farmlife", run: (c) => hitchCmd(c.sender, c.args, c.R) });
  addCommand("unhitch", { topic: "farmlife", run: (c) => unhitchCmd(c.sender, c.args, c.R) });
  if (W.__FARMHAND_TEST__) Object.assign(W, { __hitchPosts: () => hitchPosts(), __hitchTick: () => hitchTick(), __hitchBook: () => hitchBook(), __hitchWant: () => state.hitchWant });
