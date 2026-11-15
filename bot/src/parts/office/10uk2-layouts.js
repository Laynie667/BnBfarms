  /* WHAT'S IN THIS FILE (10uk2-layouts.js)
     LAYOUTS, from the map studio (Nov 14). Laynie: "maybe event swaps, like races or for trap mazes, etc. being able to
     swap the map as needed would be cool". A layout is a whole farm for one occasion, made in the map studio
     (http://localhost:4780/map on the bot's PC): the room's map, and the farm's spots and zones that go with it.
     Swappin' one in takes two steps: the map goes in with /mappaste (the studio copies it), and the spots and zones with
       ?layout <name>    the farm girl reads that layout from the studio on this computer and takes its spots and zones,
                         keepin' the ones before for ?layout back
       ?layout           which one's in, and the ones the studio has
       ?layout back      the spots and zones from before the last switch, back again
     Proprietors only (it moves every trap, trough and stall on the farm). The studio must be running on this computer.
  */
  const STUDIO_URL = "http://localhost:4780";
  function layoutTake(name, data, sender){
    const farm = (data && data.farm) || {}, now = Date.now();
    const before = { spots: JSON.parse(JSON.stringify(L.spots || {})), zones: JSON.parse(JSON.stringify(L.zones || {})), name: L.layoutActive || "", at: now };
    const spots = {};
    for (const [n, p] of Object.entries(farm.spots || {})){
      if (!p || typeof p.X !== "number" || typeof p.Y !== "number") continue;
      const was = L.spots && L.spots[n];
      spots[n] = was && was.X === p.X && was.Y === p.Y ? was : { X: p.X, Y: p.Y, by: sender, at: now };   // (an unmoved spot keeps who set it and when)
    }
    const zones = {};
    for (const [n, z] of Object.entries(farm.zones || {})){
      if (!z || typeof z !== "object") continue;
      // (every zone carries its group, its own name when it's a place of its own: the ledger throws away zones
      // without one as old-style, all of them at once, on the next load)
      zones[n] = Object.assign({}, (L.zones && L.zones[n]) || {}, { a: z.a ? { X: z.a.X, Y: z.a.Y } : undefined, b: z.b ? { X: z.b.X, Y: z.b.Y } : undefined, group: z.group || n });
    }
    L.layoutBefore = before; L.spots = spots; L.zones = zones; L.layoutActive = name;
    saveLedger(); audit(sender, "LAYOUT", name+" "+Object.keys(spots).length+" spots "+Object.keys(zones).length+" zones");
    try { syncCompanions(true); } catch(e){ /* fine */ }
    return { spots: Object.keys(spots).length, zones: Object.keys(zones).length };
  }
  function layoutCommand(sender, args, R){
    if (!isProprietor(sender)) return R("Swappin' the farm's layout is for the proprietors, sugar.");
    const w = String(args[0] || "").toLowerCase();
    if (w === "back"){
      const b = L.layoutBefore;
      if (!b) return R("There's nothin' to go back to, hon: no layout's been swapped in yet.");
      const was = L.layoutActive || "";
      L.layoutBefore = { spots: L.spots, zones: L.zones, name: was, at: Date.now() };
      L.spots = b.spots; L.zones = b.zones; L.layoutActive = b.name || "";
      saveLedger(); audit(sender, "LAYOUT", "back to "+(b.name || "the one before"));
      try { syncCompanions(true); } catch(e){ /* fine */ }
      return R("🗺️ The spots and zones are back as they were"+(b.name ? " ("+b.name+")" : "")+". If the map changed too, paste the old one back with /mappaste.");
    }
    if (!w){
      W.fetch(STUDIO_URL+"/__studio/maps/", { cache: "no-store" }).then(r => r.json()).then(d => {
        const names = (d.layouts || []).map(x => x.name);
        R("🗺️ In now: "+(L.layoutActive || "the farm's own spots and zones")+".\nThe studio has: "+(names.join(", ") || "none saved yet")+".\n?layout <name> swaps one in (paste its map with /mappaste too) · ?layout back undoes it.");
      }).catch(() => R("🗺️ In now: "+(L.layoutActive || "the farm's own spots and zones")+". I couldn't reach the map studio on this computer to list the others: is it running?"));
      return;
    }
    if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(w)) return R("A layout's name is small letters, numbers and dashes, sugar: ?layout race-day.");
    W.fetch(STUDIO_URL+"/__studio/maps/"+w+".json", { cache: "no-store" }).then(r => {
      if (r.status === 404) throw new Error("the studio has no layout called "+w);
      if (!r.ok) throw new Error("the studio said "+r.status);
      return r.json();
    }).then(d => {
      const n = layoutTake(w, d, sender);
      R("🗺️ Layout "+w+" is in: "+n.spots+" spots and "+n.zones+" zones. If you haven't yet, paste its map in the room with /mappaste (the studio's Copy for /mappaste). ?layout back undoes it.");
    }).catch(e => R("🗺️ I couldn't get that layout: "+(e && e.message || e)+". Is the map studio running on this computer (Start the studio.bat)?"));
  }
  addCommand("layout layouts", { topic: "map", staff: true, private: true, run: (c) => layoutCommand(c.sender, c.args, c.R) });
