// ==UserScript==
// @name         BnB Farm add-on: Breeding
// @namespace    bnbfarm
// @version      1.0.0
// @description  Pregnancy stages with belly size 1-5, cravings, kicks, midwives, staff-only stud bookings and breeding week (15th-21st). Runs on the farm bot's computer, next to the Farmhand Bot script.
// @author       Laynie & Alexia
// @match        *://*.bondageprojects.elementfx.com/*
// @match        *://bondageprojects.elementfx.com/*
// @match        *://*.bondage-europe.com/*
// @match        *://bondage-europe.com/*
// @match        *://*.bondageprojects.com/*
// @match        *://bondageprojects.com/*
// @match        *://*.bondage-asia.com/*
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

(() => {
  // addons/_lib/connect.js
  var W = typeof unsafeWindow !== "undefined" && unsafeWindow ? unsafeWindow : window;
  function connect(def) {
    let done = false;
    const go = () => {
      if (done || !W.Farmhand || !W.Farmhand.register) return;
      done = true;
      try {
        W.Farmhand.register(def);
      } catch (e) {
        console.warn("[Farmhand add-on " + def.name + "] couldn't plug in:", e);
      }
    };
    if (W.Farmhand && W.Farmhand.register) go();
    else {
      W.addEventListener("farmhand:ready", go);
      let n = 0;
      const t = setInterval(() => {
        go();
        if (done || ++n > 60) clearInterval(t);
      }, 1e3);
    }
  }
  var pick = (list) => list[Math.floor(Math.random() * list.length)];
  var between = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  var fill = (text, vars) => String(text).replace(/%(\w+)%/g, (m, k) => vars[k] !== void 0 ? vars[k] : m);

  // addons/breeding/index.js
  var api = null;
  function D() {
    const d = api.data();
    d.preg = d.preg || {};
    d.bookings = d.bookings || [];
    d.week = d.week || {};
    d.optIn = d.optIn || {};
    d.scent = d.scent || {};
    return d;
  }
  function along(p) {
    return p && p.preg ? Math.min(1, Math.max(0, (Date.now() - p.preg.since) / Math.max(1, p.preg.due - p.preg.since))) : null;
  }
  var STAGES = [
    { at: 0, key: "early", label: "early days" },
    { at: 0.33, key: "showing", label: "showin'" },
    { at: 0.66, key: "heavy", label: "heavy with the litter" },
    { at: 0.9, key: "nesting", label: "nestin'" }
  ];
  var stageOf = (f) => STAGES.filter((s) => f >= s.at).slice(-1)[0];
  var bellySize = (f) => Math.min(5, 1 + Math.floor(f * 5));
  var STAGE_LINES = {
    showing: {
      you: "🤰 Your belly's started to round out, %name%. Anybody lookin' can tell now.",
      room: "%name%'s belly has started to round out, soft and unmistakable. The litter's showin'."
    },
    heavy: {
      you: "🤰 You're heavy with it now, %name%: belly full and tight, the litter movin' inside you.",
      room: "%name% is heavy with the litter now, belly big and tight, and they move a little slower for it."
    },
    nesting: {
      you: "🤰 You're nestin', %name%. Restless, achy, and wantin' a soft corner of straw. It won't be long.",
      room: "%name% is restless and nestin', pawing straw into a pile and lowering themselves into it with a groan. It won't be long now."
    }
  };
  var CRAVINGS = [
    "You're cravin' somethin' salty somethin' fierce, %name%.",
    "All you can think about is a big bowl of warm milk, %name%.",
    "You'd do just about anything for somethin' sweet right now, %name%.",
    "You're achin' for a big, thick load, %name%. Funny what a litter does to you.",
    "You want to be held and rubbed, %name%. Your belly especially.",
    "You're starvin', %name%. Eatin' for a whole litter now."
  ];
  var KICKS = [
    "%name%'s belly jumps as the litter kicks hard enough to see from across the pen.",
    "A little foot pushes out against %name%'s tight belly, then rolls away. They gasp and rub the spot.",
    "%name%'s whole belly shifts and rolls as the litter turns over. They stop and breathe through it.",
    "Something kicks %name% right in the ribs. They wince and laugh and press a hand to it."
  ];
  var MIDWIFE = [
    "%by% kneels beside %name% in the straw, one hand on their belly and the other on their back, talking them through every push.",
    "%by% settles in as midwife, wiping %name%'s brow and guiding them through the next contraction."
  ];
  var RUTTY = [
    "The scent of somebody in heat drifts over, and %name%'s cock twitches. They breathe it in deep.",
    "%name% catches the smell of heat on the air and goes stiff and restless, nostrils flaring.",
    "%name% can't stop lookin' toward the scent of heat nearby. Their breathing's gone heavy."
  ];
  var isBreedWeek = (d = /* @__PURE__ */ new Date()) => d.getDate() >= 15 && d.getDate() <= 21;
  var monthKey = (d = /* @__PURE__ */ new Date()) => d.toISOString().slice(0, 7);
  function weekEnd() {
    const d = /* @__PURE__ */ new Date();
    return new Date(d.getFullYear(), d.getMonth(), 22, 0, 0, 0).getTime();
  }
  function tick() {
    const d = D(), now = Date.now(), here = api.here();
    for (const mn of here) {
      const p = api.prod(mn);
      if (!p) continue;
      const f = along(p);
      if (f === null) {
        delete d.preg[mn];
        continue;
      }
      const x = d.preg[mn] = d.preg[mn] || { stage: "early" };
      const st = stageOf(f);
      if (st.key !== x.stage && STAGE_LINES[st.key]) {
        x.stage = st.key;
        api.notice(mn, fill(STAGE_LINES[st.key].you, { name: api.name(mn) }));
        if (api.onMap(mn)) api.emote("🤰 " + fill(STAGE_LINES[st.key].room, { name: api.name(mn) }), mn);
        api.save();
      }
      if ((st.key === "showing" || st.key === "heavy") && now >= (x.craveAt || 0)) {
        if (x.craveAt) api.notice(mn, "🤰 " + fill(pick(CRAVINGS), { name: api.name(mn) }));
        x.craveAt = now + between(120, 240) * 6e4;
      }
      if ((st.key === "heavy" || st.key === "nesting") && api.onMap(mn) && now >= (x.kickAt || 0)) {
        if (x.kickAt) api.emote("🤰 " + fill(pick(KICKS), { name: api.name(mn) }), mn);
        x.kickAt = now + between(20, 40) * 6e4;
      }
    }
    bookingsTick(here);
    breedWeekTick(here);
  }
  function bookingsTick(here) {
    const d = D(), set = new Set(here);
    for (const b of d.bookings) {
      if (b.told || !set.has(b.stud) || !set.has(b.dam) || !api.onMap(b.stud) || !api.onMap(b.dam)) continue;
      b.told = Date.now();
      api.notice(b.stud, "🐂 Your booking with " + api.name(b.dam) + " is up, sugar. They're here. Head for the breeding stand.");
      api.notice(b.dam, "🐄 " + api.name(b.stud) + " is here for your booking, sugar. Head for the breeding stand.");
      api.save();
    }
  }
  function cmdBook(c) {
    const { sender, args, api: A } = c, d = D(), w = String(args[0] || "").toLowerCase();
    if (w === "done" || w === "remove" || w === "cancel") {
      const i = d.bookings.findIndex((b2) => String(b2.id) === String(args[1] || "").replace(/^#/, ""));
      if (i < 0) return c.reply("Which booking, sugar? ?bookings shows the numbers.");
      const b = d.bookings.splice(i, 1)[0];
      A.save();
      if (w === "done") A.staffPoints(sender, 1, "booking");
      return c.reply("🐂 Booking #" + b.id + " (" + A.name(b.stud) + " × " + A.name(b.dam) + ") " + (w === "done" ? "done. Good work!" : "taken off the list."));
    }
    const stud = A.find(args[0]), dam = A.find(args[1]);
    if (!stud || !dam || !A.rec(stud) || !A.rec(dam)) return c.reply("Here's how, sugar: ?book <stud> <who>, like ?book Rex Bessie. ?bookings shows the list.");
    const rd = A.rec(dam);
    if (!rd.breedable || A.limitBlocks(dam, "breed")) return c.reply(A.name(dam) + " isn't breedable, hon, so they can't be booked.");
    if (d.bookings.some((b) => b.stud === stud && b.dam === dam)) return c.reply("That pair's already booked, sugar.");
    d.seq = (d.seq || 0) + 1;
    d.bookings.push({ id: d.seq, stud, dam, by: sender, at: Date.now(), told: 0 });
    A.save();
    A.audit(sender, "BOOK", stud + "x" + dam);
    A.notice(stud, "🐂 You've been booked to breed " + A.name(dam) + ". I'll tell you when you're both on the farm.");
    A.notice(dam, "🐄 You've been booked with " + A.name(stud) + ". I'll tell you when you're both on the farm.");
    c.reply("🐂 Booked: #" + d.seq + " " + A.name(stud) + " × " + A.name(dam) + ".");
  }
  var bookingsText = () => {
    const b = D().bookings;
    return b.length ? "🐂 STUD BOOKINGS\n" + b.map((x) => "#" + x.id + " " + api.name(x.stud) + " × " + api.name(x.dam) + (x.told ? " · told, waitin' on 'em" : "")).join("\n") : "🐂 No stud bookings right now. Staff add them with ?book <stud> <who>.";
  };
  function breedWeekTick(here) {
    const d = D(), now = /* @__PURE__ */ new Date(), mk = monthKey(now);
    if (d.week.month !== mk) d.week = { month: mk };
    if (now.getDate() === 14 && !d.week.warned && here.length) {
      d.week.warned = true;
      api.say("📅 Breeding week starts tomorrow, y'all! Anybody who said ?breedweek on will come into heat for it.");
      api.save();
    }
    if (!isBreedWeek(now)) return;
    if (!d.week.said && here.length) {
      d.week.said = true;
      api.say("🔥 It's breeding week on the farm! Everybody signed up is comin' into heat. Studs, behave. Or don't. 🐂");
      api.save();
    }
    d.week.heated = d.week.heated || {};
    for (const mn of here) {
      const r = api.rec(mn), p = api.prod(mn);
      if (!r || !p || !d.optIn[mn] || d.week.heated[mn] || !r.breedable || !r.fertile || api.limitBlocks(mn, "heat") || p.preg) continue;
      d.week.heated[mn] = true;
      api.startHeat(mn, api.ANON_STUD, Math.max(1, (weekEnd() - Date.now()) / 36e5));
      api.save();
    }
    const inHeat = here.filter((mn) => api.prod(mn) && api.inHeat(api.prod(mn)));
    if (!inHeat.length) return;
    for (const stud of here) {
      if (!api.makesSemen(stud) || inHeat.includes(stud) || Date.now() - (d.scent[stud] || 0) < 15 * 6e4) continue;
      const sp = api.pos(stud);
      if (!sp || !inHeat.some((m) => {
        const q = api.pos(m);
        return q && Math.max(Math.abs(q.X - sp.X), Math.abs(q.Y - sp.Y)) <= 3;
      })) continue;
      d.scent[stud] = Date.now();
      api.privateEmote(stud, fill(pick(RUTTY), { name: api.name(stud) }));
    }
  }
  function cmdMidwife(c) {
    const { sender, args, api: A } = c;
    const t = A.find(args[0]), p = t && A.prod(t);
    if (!t || !p) return c.reply("Who's birthin', sugar? ?midwife <who>, standin' next to them.");
    if (!p.labour) return c.reply(A.name(t) + " isn't in labour, hon. I'll let staff know when they are.");
    const me = A.pos(sender), them = A.pos(t);
    if (!me || !them || Math.max(Math.abs(me.X - them.X), Math.abs(me.Y - them.Y)) > 1) return c.reply("Get right down next to " + A.name(t) + " to help, sugar.");
    p.labour.midwife = sender;
    A.save();
    A.emote("🍼 " + fill(pick(MIDWIFE), { name: A.name(t), by: A.name(sender) }), t);
  }
  function onBirth(mn) {
    const d = D();
    delete d.preg[mn];
    const m = d.lastMidwife && d.lastMidwife[mn];
    if (m) {
      api.staffPoints(m, 2, "midwife");
      if (api.onMap(mn)) api.emote("🍼 " + api.name(m) + " cleans the newborns and tucks them against " + api.name(mn) + ", every one of them healthy. Good work, midwife.", mn);
      delete d.lastMidwife[mn];
    }
    api.save();
  }
  function watchLabour() {
    const d = D();
    d.lastMidwife = d.lastMidwife || {};
    for (const mn of api.here()) {
      const p = api.prod(mn);
      if (p && p.labour && p.labour.midwife) d.lastMidwife[mn] = p.labour.midwife;
    }
  }
  function cmdBreedweek(c) {
    const { sender, args, api: A } = c, d = D(), w = String(args[0] || "").toLowerCase();
    if (!A.rec(sender)) return c.reply("You'll need to be on the farm's books first, sugar.");
    if (w === "on" || w === "off") {
      if (w === "on") d.optIn[sender] = true;
      else delete d.optIn[sender];
      A.save();
      return c.reply(w === "on" ? "🔥 You're in for breeding week (the 15th to the 21st each month). You'll come into heat for it" + (A.rec(sender).breedable && A.rec(sender).fertile ? "." : ", once you're ?breedable on and ?fertile on.") : "Breeding week: you're out. No heat from it.");
    }
    c.reply("🔥 Breeding week is the 15th to the 21st each month" + (isBreedWeek() ? ", and it's on right now!" : ".") + " You're " + (d.optIn[sender] ? "in" : "out") + " (?breedweek on / off).");
  }
  function companion(mn) {
    const r = api.rec(mn);
    if (!r) return null;
    const d = D(), p = api.prod(mn), f = along(p), cards = [];
    if (f !== null) {
      const st = stageOf(f), days = Math.max(0, Math.ceil((p.preg.due - Date.now()) / 864e5));
      cards.push({
        title: "Expectin'",
        bars: [{ label: "Along", value: Math.round(f * 100) + "%", pct: f * 100, kind: "good" }],
        lines: [["Stage", st.label], ["Belly size", bellySize(f) + " of 5"], ["Due", days ? "in " + days + " day" + (days === 1 ? "" : "s") : "any time now"], ["Sired by", p.preg.sires.map(api.name).join(" & ")]]
      });
    }
    cards.push({
      title: "Breeding week",
      note: "The 15th to the 21st each month. You come into heat for it if you're breedable and fertile.",
      toggles: [{ label: "Join breeding week", on: !!d.optIn[mn], cmd: "breedweek " + (d.optIn[mn] ? "off" : "on") }],
      chips: isBreedWeek() ? [{ text: "on now", kind: "alert" }] : void 0,
      buttons: [{ label: "My pedigree", cmd: "pedigree" }]
    });
    const mine = d.bookings.filter((b) => b.stud === mn || b.dam === mn);
    if (mine.length) cards.push({ title: "My bookings", lines: mine.map((b) => ["#" + b.id, api.name(b.stud) + " × " + api.name(b.dam)]) });
    if (api.isStaff(mn)) cards.push({ title: "Stud bookings", text: bookingsText(), input: { placeholder: "Rex Bessie", label: "Book (stud, who)", cmd: "book" } });
    return { cards };
  }
  connect({
    name: "breeding",
    label: "Breeding",
    version: "1.0.0",
    guide: "Pregnancy now has stages (early, showin', heavy, nestin') with a belly size 1–5, cravings, and kicks nearby people can see. Breeding week is the 15th–21st of each month: ?breedweek on to come into heat for it. Staff: ?book <stud> <who>, ?bookings, ?book done <#>, and ?midwife <who> during labour.",
    setup(a) {
      api = a;
      D();
    },
    commands: {
      book: { rank: "staff", private: true, run: (c) => c.args.length ? cmdBook(c) : c.reply(bookingsText()) },
      bookings: { private: true, run: (c) => c.reply(bookingsText()) },
      breedweek: { private: true, run: cmdBreedweek },
      midwife: { rank: "staff", run: cmdMidwife }
    },
    on: { tick: () => {
      watchLabour();
      tick();
    }, birth: onBirth },
    companion
  });
})();
