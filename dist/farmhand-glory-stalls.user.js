// ==UserScript==
// @name         BnB Farm add-on: Glory stalls
// @namespace    bnbfarm
// @version      1.0.0
// @description  Glory stall spots: simulated ~5 minute scenes every 10-30 minutes, real visitors, shifts, punishment shifts and a board. Runs on the farm bot's computer, next to the Farmhand Bot script.
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

  // addons/glory-stalls/scenes.js
  var SCENES = [
    // ───────────── MOUTH ─────────────
    {
      id: "mouth-greedy",
      hole: "mouth",
      label: "Greedy",
      beats: [
        { t: "Footsteps stop on the other side of the stall. Fabric rustles, a belt buckle clinks, and %name% hears someone breathing hard and close to the boards." },
        {
          t: "A hand slaps the wall twice, impatient. Then a cock pushes through the hole, already hard and flushed dark, bobbing an inch from %name%'s lips and smelling of sweat and musk.",
          d: `A hand slaps the wall twice, the way you'd call a dog to its bowl. A cock pushes through the hole, already hard and flushed dark, bobbing an inch from %name%'s lips. "Come on, hole. Earn your keep."`
        },
        { t: "It nudges at %name%'s mouth, smearing a slick bead across their lips, rubbing back and forth until they open up." },
        { t: "The moment they do, it shoves in over their tongue. The stranger groans through the boards and grinds the base right up against the hole, holding %name% full for a long moment." },
        {
          t: "Then the pace starts: quick and greedy, the wall creaking with every thrust, drool running down %name%'s chin and dripping onto their chest.",
          d: `Then the pace starts, quick and greedy, the wall creaking with every thrust. "That's it. Just a mouth on a wall. Nobody even has to see your face." Drool runs down %name%'s chin and drips onto their chest.`
        },
        { t: "The stranger finds the back of %name%'s throat and likes it there, pushing deeper each time, pulling back only long enough to let them gasp." },
        {
          t: "Fingers curl through the hole and catch in %name%'s hair, dragging them flush against the wood so there's nowhere to go but down.",
          d: `Fingers curl through the hole and catch in %name%'s hair, dragging them flush against the wood. "Stay. Good little cocksleeve. Don't you dare pull off."`
        },
        { t: "Wet sounds fill the stall. %name%'s eyes water, and their throat flutters around every stroke as the stranger's breathing goes ragged." },
        { t: "The thrusts turn short and jerky. A low, desperate groan comes through the boards. Whoever's out there is right on the edge." },
        {
          t: "With one last shove the stranger buries themselves to the hilt and spills, thick and hot, pulse after pulse down %name%'s throat until they have to swallow or choke.",
          f: "With one last shove into the funnel the stranger spills, thick and hot, pulse after pulse pouring down the funnel and straight into %name%'s throat. They don't get a choice about swallowing.",
          finish: true
        },
        {
          t: "It slides out slowly, dragging a last string of cum across %name%'s lips. The belt buckle clinks again and the footsteps fade, without a word.",
          d: `It slides out slowly, wiping itself clean on %name%'s cheek. "Good hole." The belt buckle clinks and the footsteps fade, and %name% is left licking their lips for the next one.`
        }
      ]
    },
    {
      id: "mouth-slow",
      hole: "mouth",
      label: "Taking their time",
      beats: [
        { t: "Someone settles in outside the stall, unhurried. A bench creaks as they sit, as if they mean to stay a while." },
        { t: "A cock slips through the hole, half hard, and simply rests there against %name%'s lips. Warm and heavy, waiting to see what they'll do." },
        {
          t: "When %name% kisses the tip, the stranger sighs, and it twitches and thickens against their mouth.",
          d: `When %name% kisses the tip, the stranger chuckles. "Look at that. Didn't even have to ask. You were made for this wall, weren't you?"`
        },
        { t: "It eases in an inch at a time, letting %name% taste every bit of it, resting on their tongue before sliding a little deeper." },
        { t: "Slowly the stranger works their way down until %name%'s nose is pressed to the boards, and then holds there, patient, until their eyes start to water." },
        {
          t: "They pull out all the way, letting %name% drag in a breath, then slide right back to the root. Over and over, slow and deep, never in a hurry.",
          d: `They pull out all the way, let %name% drag in a breath, then slide back to the root. "Breathe when I let you. That's all you need to think about."`
        },
        { t: "A thumb pokes through beside the cock and strokes %name%'s cheek, feeling the shape of it moving inside their mouth." },
        { t: "The rhythm stays maddeningly slow, but the stranger's breathing doesn't. Every stroke gets a soft, shaky moan through the wood." },
        {
          t: "They hold deep and start to grind in small circles, just rocking against the back of %name%'s throat, savouring it.",
          d: `They hold deep and grind in small circles against the back of %name%'s throat. "Feel that? That's all you are right now. Somewhere warm to put it."`
        },
        {
          t: "With a long, shuddering groan the stranger finishes deep in %name%'s throat, holding them there through every pulse, leaving them nothing to do but swallow.",
          f: "With a long, shuddering groan the stranger finishes into the funnel, holding still while every pulse runs down into %name%'s throat. They swallow because it's the only thing to do.",
          finish: true
        },
        { t: "It softens slowly in %name%'s mouth before slipping out. A gentle pat lands on the wall, the bench creaks, and the stranger strolls away." }
      ]
    },
    // ───────────── PUSSY ─────────────
    {
      id: "pussy-rough",
      hole: "vulva",
      label: "Rough",
      beats: [
        { t: "Heavy boots stop behind the stall. Whoever this is doesn't knock. They just press against the boards, and the whole booth shifts." },
        {
          t: "Rough fingers find %name%'s pussy through the hole and spread them open, checking how wet they are without the slightest bit of care.",
          d: `Rough fingers find %name%'s pussy through the hole and spread them open. "Already dripping. Course you are. Nobody ends up in this stall by accident."`
        },
        { t: "Two fingers shove in and curl, pumping hard, until %name%'s hips buck against the wall and the stall echoes with wet slaps." },
        { t: "The fingers pull out and something much thicker takes their place, the head pressing right against %name%'s entrance, rubbing up and down through the mess." },
        { t: "Then it slams in, all the way in one hard stroke, and %name% is pinned against the boards with the stranger buried inside them." },
        {
          t: "No easing in. The stranger pounds at a rough, steady rut, the booth thumping against its frame with every thrust.",
          d: 'No easing in. The stranger pounds at a rough, steady rut. "Look at you, taking it like a farm animal in a breeding crate. Exactly where you belong."'
        },
        { t: "Hands grip the edges of the hole, using the wall for leverage, driving every stroke deeper than the last." },
        {
          t: "%name% can't help the noises spilling out of them. The stranger only fucks harder at the sound, growling low through the wood.",
          d: `%name% can't help the noises spilling out of them. "Louder. Let the whole barn hear what a needy little breeding hole sounds like."`
        },
        { t: "The rhythm stutters. The stranger is close, grinding in hard and short, the head of their cock battering right up against %name%'s cervix." },
        { t: "A growl rumbles through the stall as they bury themselves as deep as they'll go and unload, flooding %name%'s pussy with thick, hot pulses.", finish: true },
        {
          t: "They stay a moment, panting, then pull out. Warm cum runs down %name%'s thighs as the boots stomp off.",
          d: `They pull out and give the hole a slap for good measure. "Keep that in." Warm cum runs down %name%'s thighs as the boots stomp off, and they're left dripping for the next one.`
        }
      ]
    },
    {
      id: "pussy-breeder",
      hole: "vulva",
      label: "Breeder",
      beats: [
        { t: "Slow, deliberate footsteps. Someone stands outside the stall for a long moment, just looking at what's offered through the hole." },
        {
          t: "A warm palm lays flat over %name%'s pussy, then their lower belly, pressing gently, the way a farmer checks livestock.",
          d: `A warm palm lays flat over %name%'s belly and presses, the way a farmer checks a sow. "Good hips. Good breeding stock. Let's see if you take."`
        },
        { t: "Thumbs spread %name% open and the stranger takes their time looking. Then the thick head of their cock nudges in, just the tip, holding there." },
        { t: "Inch by inch they sink in, slow and heavy, until their hips are pressed flat to the boards and %name% is stretched full around them." },
        { t: "They don't thrust so much as grind, rolling their hips deep and slow, keeping every inch inside." },
        {
          t: 'A voice mutters low through the wood: "Good. Hold still. Take it all."',
          d: `A voice mutters low through the wood: "That's it. You're not here to enjoy it. You're here to get bred. Hold still."`
        },
        { t: "The grind gets heavier. The stranger leans their weight into the wall, the head of their cock nestled right against %name%'s cervix and staying there." },
        {
          t: "Their breathing goes deep and uneven. A hand reaches through and rests on %name%'s belly again, feeling them from the outside.",
          d: `A hand reaches through and rubs %name%'s belly. "Gonna fill this up. Gonna leave you round and stupid with it."`
        },
        { t: "They start to swell and throb inside %name%, pressed so deep and so tight there's nowhere for anything to go but further in." },
        { t: "With a long groan they hold still and pump %name% full, every pulse pushed right up against the entrance to their womb.", finish: true },
        { t: "They stay locked in through every last throb, then wait a long moment more before finally slipping free, as if to make sure it takes." },
        {
          t: 'Before leaving, a finger pushes back what tried to leak out. "Keep it in." Then the footsteps slowly fade.',
          d: `Before leaving, a finger pushes back what tried to leak out. "Keep it in, breeder. That's your whole job." Then the footsteps slowly fade.`
        }
      ]
    },
    // ───────────── ASS ─────────────
    {
      id: "ass-steady",
      hole: "butt",
      label: "Steady",
      beats: [
        { t: "Someone hums to themselves outside the stall, unhurried, and %name% hears the wet click of a bottle cap." },
        { t: "Slick, cold fingers find %name%'s ass through the hole and circle slowly, smearing lube around until they twitch." },
        {
          t: "One finger presses in, patient, working them open, then a second, scissoring gently while %name% squirms against the wood.",
          d: `One finger presses in, then a second, scissoring them open. "Relax. This hole doesn't get to say no. It just has to open."`
        },
        { t: "The fingers slide out and something much thicker presses in its place, blunt and slick and insistent." },
        { t: "It stretches %name% slowly, the head popping past the ring of muscle with a burning ache, then pushing steadily deeper." },
        { t: "The stranger settles in all the way, hips flush to the boards, and lets %name% feel how full they are before starting to move." },
        {
          t: "A firm, steady rhythm starts, long strokes that drag almost all the way out before sinking back in to the root.",
          d: 'A firm, steady rhythm starts. "There it goes. Look how easy you take it now. Practically made for the stall."'
        },
        { t: "The stall creaks in time. Every stroke pushes a small sound out of %name% whether they want it to or not." },
        {
          t: "The pace picks up. Hands brace on either side of the hole and the stranger drives in harder, chasing it now.",
          d: `The pace picks up. "Squeeze. Earn it. You want the next one to have to wait in line, don't you?"`
        },
        { t: "The rhythm stutters, a low moan comes through the wall, and they bury themselves deep, filling %name%'s ass warm and full.", finish: true },
        { t: "They stay inside a moment, softening, before easing out slowly. %name% feels it start to leak as the humming fades away down the aisle." }
      ]
    },
    {
      id: "ass-break",
      hole: "butt",
      label: "On their break",
      beats: [
        { t: "Quick footsteps, a glance up and down the aisle. Someone muttering about only having five minutes." },
        {
          t: "A zipper. A palm spits loudly through the hole and smears it across %name%'s ass. That's all the prep they're getting.",
          d: `A zipper. Someone spits right on %name%'s ass through the hole. "That's plenty for a stall slut."`
        },
        { t: "The stranger lines up and pushes in, hard and impatient, forcing their way past the tight ring with a grunt." },
        { t: "No warm-up and no mercy: they use %name% hard and fast straight away, the booth thumping against its frame." },
        {
          t: "Hands grab the edge of the hole and pull, slamming hips against the boards. Every stroke punches the breath out of %name%.",
          d: `Hands grab the edge of the hole and slam hips against the boards. "Christ, you're tight. Gonna fix that before I go."`
        },
        { t: "Somewhere down the aisle a door bangs. The stranger freezes for a heartbeat, buried to the hilt, then laughs under their breath and goes right back to it." },
        {
          t: "They're rushing now, grunting, rutting into %name% without any rhythm at all.",
          d: `They're rushing now. "Nobody's coming to save you. You're a hole on a wall and I've got a break to finish."`
        },
        { t: "The thrusts go short and frantic. Their fingers dig into the wood around %name%. They're nearly there." },
        { t: "A sharp gasp, a final shove, and they're done, pumping %name% full in hard, hurried spurts.", finish: true },
        {
          t: "They pull out fast, wipe themselves on %name%'s thigh, and zip up. %name% is left dripping as the footsteps hurry off.",
          d: `They pull out fast and wipe themselves on %name%'s thigh. "Thanks, hole." %name% is left dripping as the footsteps hurry back to work.`
        }
      ]
    }
  ];
  var TAUNTS = [
    'Someone passing by raps on the stall and laughs. "Busy little hole today, huh?"',
    `A voice from further down the aisle: "Is that one any good?" Another answers: "It's a hole. It's fine."`,
    "Somebody chalks another tally mark on the outside of %name%'s stall, loud enough to hear every stroke of it.",
    `A visitor reads the sign on the stall out loud and snorts. "Stall number and a count. Doesn't even get a name."`,
    "Two farmhands chat right outside about the weather, as if nobody's in there at all."
  ];

  // addons/glory-stalls/index.js
  var HOLE_WORDS = { mouth: "mouth", vulva: "pussy", butt: "ass" };
  var holeFrom = (w) => {
    w = String(w || "").toLowerCase();
    if (/^(mouth|throat|oral)$/.test(w)) return "mouth";
    if (/^(pussy|vulva|cunt|vagina)$/.test(w)) return "vulva";
    if (/^(ass|butt|anus|anal)$/.test(w)) return "butt";
    return null;
  };
  var api = null;
  var running = /* @__PURE__ */ new Map();
  var prompted = /* @__PURE__ */ new Map();
  function D() {
    const d = api.data();
    d.optIn = d.optIn || {};
    d.people = d.people || {};
    d.stalls = d.stalls || {};
    d.shifts = d.shifts || {};
    return d;
  }
  var today = () => api.dayKey();
  function bump(obj, n) {
    if (obj.day !== today()) {
      obj.day = today();
      obj.today = 0;
    }
    obj.today += n;
    obj.total = (obj.total || 0) + n;
  }
  function stallIds() {
    return Object.keys(api.spots()).map((n) => (/^glory-([a-z0-9]+)$/.exec(n) || [])[1]).filter(Boolean).sort((a, b) => (parseInt(a, 10) || 0) - (parseInt(b, 10) || 0) || a.localeCompare(b));
  }
  var occupantOf = (id) => api.whoOnSpot("glory-" + id, 0)[0] || null;
  var visitorOf = (id) => api.whoOnSpot("glory-" + id + "-visitor", 0)[0] || null;
  var visitorStallOf = (mn) => stallIds().find((id) => api.onSpot(mn, "glory-" + id + "-visitor", 0)) || null;
  function openHoles(mn) {
    return api.HOLES.filter((h) => (h !== "vulva" || api.hasVulva(mn)) && !api.holeBlocked(mn, h));
  }
  function whyNot(mn) {
    const r = api.rec(mn);
    if (!r) return "you're not on the farm's books yet";
    if (!D().optIn[mn]) return "you haven't said ?glory on";
    if (api.limitBlocks(mn, "breed")) return "your limits rule it out";
    if (!openHoles(mn).length) return "everything's covered up (gag, chastity or plug)";
    return null;
  }
  function startScene(id, mn) {
    const holes = openHoles(mn);
    const scenes = SCENES.filter((s) => holes.includes(s.hole));
    if (!scenes.length) return;
    const scene = pick(scenes);
    const deg = !!(api.rec(mn) || {}).degradeMe;
    running.set(id, { mn, scene, i: 0, deg, funnel: scene.hole === "mouth" && api.funnelOn(mn) });
    api.log("stall " + id + ": " + scene.id + " for " + mn);
    step(id);
  }
  function step(id) {
    const run = running.get(id);
    if (!run) return;
    const { mn, scene } = run;
    if (!api.onSpot(mn, "glory-" + id, 0)) {
      running.delete(id);
      api.privateEmote(mn, "Behind you, the stranger at stall " + id + " grumbles at the empty hole and wanders off.");
      return;
    }
    const beat = scene.beats[run.i];
    if (!beat) {
      running.delete(id);
      scheduleNext(id, mn);
      return;
    }
    const line = run.funnel && beat.f || run.deg && beat.d || beat.t;
    api.privateEmote(mn, fill(line, { name: api.name(mn) }));
    if (beat.finish) finish(id, mn, scene.hole, between(18, 45));
    else if (run.deg && Math.random() < 0.3 && run.i > 0) api.later(() => running.get(id) === run && api.privateEmote(mn, fill(pick(TAUNTS), { name: api.name(mn) })), 9e3);
    run.i++;
    api.later(() => step(id), between(22, 32) * 1e3);
  }
  function finish(id, mn, hole, ml) {
    const d = D(), p = api.prod(mn);
    if (p) {
      p.held[hole] = (p.held[hole] || 0) + ml;
      p.totals.received = (p.totals.received || 0) + ml;
      p.last = p.last || Date.now();
    }
    api.tally(mn);
    const me = d.people[mn] = d.people[mn] || { holes: {}, ml: 0 };
    bump(me, 1);
    me.holes[hole] = (me.holes[hole] || 0) + 1;
    me.ml = (me.ml || 0) + ml;
    bump(d.stalls[id] = d.stalls[id] || {}, 1);
    const leader = api.herdLeaderOf(mn);
    if (leader) api.staffPoints(leader, 1, "glory");
    const r = api.rec(mn);
    if (hole === "vulva" && r && r.breedable && r.fertile && !api.limitBlocks(mn, "breed")) {
      const took = api.rollConception(mn, api.ANON_STUD, ml);
      if (took === "new") api.later(() => api.notice(mn, "🍼 A warm, heavy feelin' settles low in your belly… somethin' from the stalls took, sugar. (?stats shows it)"), 2e4);
    }
    api.save();
  }
  function scheduleNext(id, mn) {
    const sh = D().shifts[mn], pun = sh && sh.punish && sh.until > Date.now();
    const s = D().stalls[id] = D().stalls[id] || {};
    s.next = Date.now() + (pun ? between(5, 15) : between(10, 30)) * 6e4;
    api.save();
  }
  function tick() {
    const d = D(), now = Date.now();
    for (const [mn, sh] of Object.entries(d.shifts)) {
      if (sh.until > now) continue;
      delete d.shifts[mn];
      api.notice(Number(mn), "🕳️ Your " + (sh.punish ? "punishment " : "") + "shift in the glory stalls is over, sugar. You can step out.");
      api.save();
    }
    for (const id of stallIds()) {
      if (running.has(id)) continue;
      const mn = occupantOf(id), s = d.stalls[id] = d.stalls[id] || {};
      if (!mn) {
        s.next = 0;
        s.who = 0;
        continue;
      }
      if (s.who !== mn) {
        s.who = mn;
        const why = whyNot(mn);
        if (why) {
          api.notice(mn, "🕳️ This is glory stall " + id + ", but nothin' will happen here: " + why + ".");
          s.next = Infinity;
          continue;
        }
        s.next = now + between(2, 5) * 6e4;
        api.notice(mn, "🕳️ You're in glory stall " + id + ". Somebody will come along soon. Step off the spot whenever you want to stop.");
        continue;
      }
      if (s.next === Infinity) {
        if (!whyNot(mn)) s.next = now + 6e4;
        continue;
      }
      const v = visitorOf(id);
      if (v && v !== mn) {
        if (prompted.get(v) !== id) {
          prompted.set(v, id);
          api.notice(v, "🕳️ Stall " + id + " is occupied. ?stall use mouth, ?stall use pussy or ?stall use ass. Whoever's inside never learns your name.");
        }
        continue;
      }
      if (now >= (s.next || 0) && !whyNot(mn)) startScene(id, mn);
    }
    for (const [v, id] of prompted) if (!api.onSpot(v, "glory-" + id + "-visitor", 0)) prompted.delete(v);
  }
  function cmdGlory(c) {
    const { sender, args, api: A } = c, d = D(), w = String(args[0] || "").toLowerCase();
    if (!A.rec(sender)) return c.reply("You'll need to be on the farm's books first, sugar. ?apply gets you started.");
    if (w === "on" || w === "off") {
      if (w === "on") d.optIn[sender] = true;
      else delete d.optIn[sender];
      A.save();
      return c.reply(w === "on" ? "🕳️ Glory stalls: ON. Stand on a glory stall spot and strangers will use you, and staff can put you on punishment shifts. Your limits and whatever's locked on you still count. ?glory off any time." : "🕳️ Glory stalls: OFF. Nothin' will happen to you in the stalls, and nobody can put you on a punishment shift.");
    }
    const me = d.people[sender];
    c.reply("🕳️ Glory stalls: " + (d.optIn[sender] ? "ON" : "OFF") + " (?glory on / ?glory off)" + (me ? "\nToday: " + (me.day === today() ? me.today : 0) + " · all time: " + (me.total || 0) + " (mouth " + (me.holes.mouth || 0) + ", pussy " + (me.holes.vulva || 0) + ", ass " + (me.holes.butt || 0) + ")" : "") + (d.shifts[sender] ? "\nOn " + (d.shifts[sender].punish ? "a punishment " : "") + "shift for " + Math.ceil((d.shifts[sender].until - Date.now()) / 6e4) + " more minutes." : ""));
  }
  function board(staff) {
    const d = D(), ids = stallIds();
    if (!ids.length) return "🕳️ No glory stalls are set up yet. Herdmasters: ?spot set glory-1 inside the booth and ?spot set glory-1-visitor outside the hole.";
    return "🕳️ GLORY STALLS\n" + ids.map((id) => {
      const s = d.stalls[id] || {}, mn = occupantOf(id), n = s.day === today() ? s.today : 0;
      const sh = mn && d.shifts[mn];
      return "Stall " + id + ": " + (mn ? (staff ? api.name(mn) : "occupied") + (running.has(id) ? " · busy right now" : "") : "empty") + " · " + n + " today" + (staff && sh ? " · " + (sh.punish ? "punishment " : "") + "shift, " + Math.ceil((sh.until - Date.now()) / 6e4) + " min left" : "");
    }).join("\n");
  }
  function cmdStall(c) {
    const { sender, args, api: A } = c, d = D(), sub = String(args[0] || "").toLowerCase(), staff = A.isStaff(sender);
    if (!sub || sub === "board") return c.reply(board(staff));
    if (sub === "use") {
      const id = visitorStallOf(sender);
      if (!id) return c.reply("Stand on a stall's visitor spot first, sugar (glory-1-visitor and so on).");
      const mn = occupantOf(id);
      if (!mn || mn === sender) return c.reply("Stall " + id + " is empty right now, hon.");
      if (whyNot(mn)) return c.reply("Stall " + id + " isn't takin' visitors right now, sugar.");
      if (running.has(id)) return c.reply("Somebody else is busy at stall " + id + ". Give 'em a few minutes.");
      const hole = holeFrom(args[1]) || pick(openHoles(mn));
      if (!openHoles(mn).includes(hole)) return c.reply("That one's blocked off at stall " + id + ". Try " + openHoles(mn).map((h) => HOLE_WORDS[h]).join(" or ") + ".");
      if (A.makesSemen(sender) && A.holeBlocked(sender, "penis")) return c.reply("You're locked up, sugar. Can't use the stall like that.");
      const sp = A.prod(sender);
      const load = A.makesSemen(sender) && sp ? A.drainSemen(sender, Math.max(sp.semen * A.cfg.PROD.LOAD_SHARE, Math.min(sp.semen, A.cfg.PROD.MIN_LOAD))) : 0;
      if (sp && load) sp.totals.given = (sp.totals.given || 0) + load;
      const w = HOLE_WORDS[hole];
      A.privateEmote(sender, "You step up to stall " + id + " and use the " + w + " waiting at the hole until you finish" + (load ? ", leaving " + A.ml(load) + " behind" : "") + ". Nobody inside knows who you are.");
      A.privateEmote(mn, "Someone real steps up to the hole this time. They use your " + w + " without a word, steady and greedy, until they finish" + (load ? " deep inside" : "") + " and walk away. You never see who.");
      finish(id, mn, hole, load);
      scheduleNext(id, mn);
      A.audit(sender, "USE", "stall " + id);
      return;
    }
    if (sub === "shift") {
      let who = sender, minArg = args[1];
      if (args[2] !== void 0 || args[1] && isNaN(parseInt(args[1], 10))) {
        if (!staff) return c.reply("Only staff put somebody else on a shift, sugar. ?stall shift <minutes> puts yourself on one.");
        who = A.find(args[1]);
        minArg = args[2];
      }
      const mins = parseInt(minArg, 10);
      if (!who || !A.rec(who)) return c.reply("Who's that, hon? ?stall shift <who> <minutes>.");
      if (!(mins >= 10 && mins <= 240)) return c.reply("How long, sugar? 10 to 240 minutes, like ?stall shift 60.");
      if (!d.optIn[who]) return c.reply(A.name(who) + " hasn't said ?glory on, so they can't be put on a shift.");
      d.shifts[who] = { until: Date.now() + mins * 6e4, by: sender, punish: false };
      A.save();
      A.audit(sender, "SHIFT", who + " " + mins + "m");
      if (who !== sender) A.notice(who, "🕳️ " + A.name(sender) + " put you on a " + mins + " minute shift in the glory stalls. Find an empty stall, sugar.");
      return c.reply("🕳️ " + (who === sender ? "You're" : A.name(who) + " is") + " on a " + mins + " minute stall shift.");
    }
    if (sub === "punish") {
      if (!staff) return c.reply("Punishment shifts are for staff to hand out, sugar.");
      const who = A.find(args[1]), mins = parseInt(args[2], 10);
      if (!who || !A.rec(who)) return c.reply("Here's how: ?stall punish <who> <minutes>, like ?stall punish Bessie 30.");
      if (!(mins >= 10 && mins <= 240)) return c.reply("How long, sugar? 10 to 240 minutes.");
      if (!d.optIn[who]) return c.reply(A.name(who) + " hasn't said ?glory on, so they can't be sent to the stalls. Pick another punishment.");
      const free = stallIds().find((id) => !occupantOf(id));
      d.shifts[who] = { until: Date.now() + mins * 6e4, by: sender, punish: true };
      A.save();
      A.audit(sender, "PUNISH", who + " " + mins + "m");
      if (free && A.onMap(who)) A.teleport(who, A.spot("glory-" + free), true);
      A.notice(who, "🕳️ " + A.name(sender) + " sentenced you to " + mins + " minutes in the glory stalls" + (free ? ", stall " + free : ". Find a free stall") + ". Strangers come more often on a punishment shift. Your safeword still works.");
      return c.reply("🕳️ " + A.name(who) + " is on a " + mins + " minute punishment shift" + (free ? " in stall " + free : " (no stall's free right now, they'll have to wait for one)") + ".");
    }
    if (sub === "release" || sub === "end") {
      const who = args[1] ? A.find(args[1]) : sender;
      if (who !== sender && !staff) return c.reply("Only staff end somebody else's shift, sugar.");
      if (!who || !d.shifts[who]) return c.reply((who === sender ? "You're" : A.name(who) + " isn't") + (who === sender ? " not on a shift, hon." : " on a shift, hon."));
      if (who === sender && d.shifts[who].punish) return c.reply("You can't let yourself off a punishment shift, sugar. Ask staff, or use your safeword if you need out.");
      delete d.shifts[who];
      A.save();
      if (who !== sender) A.notice(who, "🕳️ " + A.name(sender) + " let you off your stall shift.");
      return c.reply("🕳️ Shift ended.");
    }
    c.reply("?stalls shows the board · ?stall use mouth|pussy|ass (from a visitor spot) · ?stall shift <minutes>" + (staff ? " · ?stall shift <who> <minutes> · ?stall punish <who> <minutes> · ?stall release <who>" : ""));
  }
  function onSafe(mn) {
    const d = D();
    for (const [id, run] of running) if (run.mn === mn) {
      running.delete(id);
      const s = d.stalls[id] = d.stalls[id] || {};
      s.next = Date.now() + 60 * 6e4;
    }
    if (d.shifts[mn]) delete d.shifts[mn];
    api.save();
  }
  function companion(mn) {
    const d = D(), r = api.rec(mn);
    if (!r) return null;
    const me = d.people[mn], sh = d.shifts[mn], cards = [];
    cards.push({
      title: "Glory stalls",
      toggles: [{ label: "Strangers can use me in the stalls", desc: "Also lets staff give you punishment shifts. Your limits and whatever's locked on you still count.", on: !!d.optIn[mn], cmd: "glory " + (d.optIn[mn] ? "off" : "on") }],
      lines: me ? [["Today", me.day === today() ? me.today : 0], ["All time", me.total || 0], ["Mouth · pussy · ass", (me.holes.mouth || 0) + " · " + (me.holes.vulva || 0) + " · " + (me.holes.butt || 0)]] : void 0,
      chips: sh ? [{ text: (sh.punish ? "punishment shift" : "on shift") + " · " + Math.max(0, Math.ceil((sh.until - Date.now()) / 6e4)) + " min", kind: sh.punish ? "alert" : "acc" }] : void 0,
      buttons: [{ label: "The board", cmd: "stalls" }]
    });
    if (api.isStaff(mn) && stallIds().length) {
      cards.push({
        title: "Stall board",
        text: board(true),
        input: { placeholder: "Bessie 30", label: "Punish (who, minutes)", cmd: "stall punish" },
        buttons: [{ label: "Refresh", cmd: "stalls" }]
      });
    }
    return { cards };
  }
  connect({
    name: "glory-stalls",
    label: "Glory stalls",
    version: "1.0.0",
    guide: "Stand on a glory stall spot (glory-1, glory-2…) after ?glory on, and strangers come by every 10–30 minutes. Each visit is about five minutes of private emotes only you see, and it counts on your record. A real visitor on the stall's visitor spot can ?stall use mouth|pussy|ass. ?stalls is the board. Staff: ?stall shift <who> <minutes>, ?stall punish <who> <minutes>, ?stall release <who>. Step off the spot to stop; ?safe always works.",
    setup(a) {
      api = a;
      D();
    },
    commands: {
      glory: { private: true, run: cmdGlory },
      stall: { private: true, run: cmdStall },
      stalls: { private: true, run: (c) => c.reply(board(c.api.isStaff(c.sender))) }
    },
    on: { tick, safe: onSafe },
    companion
  });
})();
