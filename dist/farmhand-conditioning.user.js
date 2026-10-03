// ==UserScript==
// @name         BnB Farm add-on: Conditioning
// @namespace    bnbfarm
// @version      1.0.0
// @description  Guided trance sessions per species and level (fun, deep, no human left) for people with ?hypno on, run by their herd leader; tiers and nicknames grow with sessions. Runs on the farm bot's computer, next to the Farmhand Bot script.
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
  var between = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  var fill = (text, vars) => String(text).replace(/%(\w+)%/g, (m, k) => vars[k] !== void 0 ? vars[k] : m);

  // addons/conditioning/index.js
  var SPECIES = {
    cow: { a: "cow", s: "moo", p: "heavy udders", act: "give milk", pose: "on all fours, head low", names: ["sweet cow", "dairy cow", "milk cow", "dumb milk cow"] },
    pony: { a: "pony", s: "whinny", p: "strong flanks", act: "pull and prance", pose: "head high, knees lifting", names: ["good pony", "farm pony", "cart pony", "dumb harness pony"] },
    horse: { a: "mare", s: "whinny", p: "strong flanks", act: "carry and obey", pose: "head high, standing square", names: ["good mare", "farm mare", "broodmare", "dumb broodmare"] },
    pup: { a: "pup", s: "woof", p: "wagging tail", act: "heel and fetch", pose: "kneeling up, paws tucked", names: ["good pup", "farm pup", "obedient bitch", "dumb mutt"] },
    dog: { a: "dog", s: "woof", p: "wagging tail", act: "heel and fetch", pose: "kneeling up, paws tucked", names: ["good dog", "farm dog", "obedient bitch", "dumb mutt"] },
    kitty: { a: "kitty", s: "mew", p: "twitching tail", act: "purr and present", pose: "curled low, hips up", names: ["sweet kitty", "farm cat", "needy kitty", "brainless pet"] },
    cat: { a: "kitty", s: "mew", p: "twitching tail", act: "purr and present", pose: "curled low, hips up", names: ["sweet kitty", "farm cat", "needy kitty", "brainless pet"] },
    pig: { a: "piggy", s: "oink", p: "soft round belly", act: "root and wallow", pose: "nose to the ground", names: ["sweet piggy", "farm pig", "greedy sow", "filthy sow"] },
    bunny: { a: "bunny", s: "squeak", p: "twitchy ears", act: "hop and breed", pose: "crouched low, nose twitching", names: ["sweet bunny", "farm bunny", "breeding doe", "dumb breeding doe"] },
    goat: { a: "goat", s: "bleat", p: "full udder", act: "give milk", pose: "on all fours, head low", names: ["sweet goat", "dairy goat", "milk goat", "dumb nanny"] },
    sheep: { a: "lamb", s: "baa", p: "soft fleece", act: "follow the flock", pose: "on all fours, head low", names: ["sweet lamb", "farm lamb", "flock ewe", "dumb sheep"] },
    default: { a: "animal", s: "low animal sound", p: "body", act: "obey", pose: "kneeling, hands on your thighs", names: ["good animal", "farm animal", "livestock", "dumb livestock"] }
  };
  var LEVELS = ["fun", "deep", "nhl"];
  var LEVEL_NAME = { fun: "Fun", deep: "Deep", nhl: "No human left" };
  var MILESTONES = [3, 7, 15, 30];
  var SCRIPT = {
    settle: [
      "Hear my voice, %name%. Just my voice. Let everything else in the barn go quiet.",
      "Breathe in slow. Breathe out slower. Every breath out lets your shoulders drop a little more.",
      "You don't have to think right now, %name%. Thinking is work, and you're not working. You're listening.",
      "Feel how heavy your eyelids are getting. It's alright to let them close."
    ],
    deeper: {
      fun: [
        "Down a little now. Soft and easy, like sinking into warm straw.",
        "Every word I say makes it easier to drift. Easier to just be my {pet}.",
        "Good. You're drifting, and it feels so nice to let go."
      ],
      deep: [
        "Deeper now. Each time you breathe out, you sink twice as far.",
        "There's nothing above you but my voice, and nothing below you but more quiet. Keep sinking.",
        "Your thoughts are getting slow and simple. Simple is good. Simple is right for a {a}.",
        "So deep now. You don't need words up here. You just need to listen."
      ],
      nhl: [
        "Deeper. Past where the words are. Past where your name lives.",
        "Let the person part of you drift away like a dream you're forgetting. There's only the {a} left.",
        "Nothing up there to hold on to. No worries, no choices, no human things. Just a {a}.",
        "Deeper than you've ever been. And every time we do this, you'll go deeper still."
      ]
    },
    suggest: {
      fun: [
        "When you come up, your body remembers how a good {a} stands: {pose}.",
        "Your hands stay away from yourself. Good {a}s don't touch. They wait to be touched.",
        "Every time someone calls you {pet}, you'll feel a warm little glow of pride.",
        "Being a good {a} is easy. You just {act}, and everything feels right."
      ],
      deep: [
        "Only my voice matters now. Other voices are just noise in the barn.",
        "Feel the heat building low in your belly. Let it build. You don't get to finish. You just ache, and it feels like being good.",
        "When I tell you to, you'll {s}. Not words. Just a {s}. Go on. Let it out.",
        "Your {p} belong to the farm. You feel that every time someone looks at you.",
        "You {act} because it's what you're for. It's not a choice, and that's a relief."
      ],
      nhl: [
        "There's no human left in here. Just a {a}, {pose}, waiting for its handler.",
        "Clothes don't feel like clothes anymore. They feel like a coat, a harness, a hide. You were born in them.",
        'From now on, when anyone says "good {a}", you drop right back here: empty, warm and obedient.',
        "Words are getting hard. That's alright. {a}s don't need words. A {s} says everything.",
        "You {act}. That's all. That's everything. You don't remember wanting anything else."
      ]
    },
    wake: {
      fun: ["Now I'm going to count you up. Three: feeling your body again. Two: lighter. One: eyes open, %name%. Good {a}."],
      deep: ["Counting up slowly. Five, four: the barn coming back. Three, two: your name, your hands. One: awake, %name%. But part of you is still listening."],
      nhl: [
        "I won't count you all the way up, {pet}. You'll open your eyes, but the {a} stays. It's yours now.",
        "Open your eyes. Look around the barn. Nothing in there but a {a}. Good."
      ]
    }
  };
  var api = null;
  var running = /* @__PURE__ */ new Map();
  function D() {
    const d = api.data();
    d.people = d.people || {};
    return d;
  }
  var me = (mn) => D().people[mn] = D().people[mn] || { max: "fun", sessions: { fun: 0, deep: 0, nhl: 0 }, total: 0, tier: 0 };
  var words = (mn) => SPECIES[api.species(mn)] || SPECIES[String((api.rec(mn) || {}).species || "").toLowerCase()] || SPECIES.default;
  function petName(mn) {
    const w = words(mn), r = api.rec(mn) || {}, t = me(mn).tier;
    const i = Math.max(0, Math.min(3, r.degradeMe ? t + 1 : r.praiseMe ? t - 1 : t));
    return w.names[i];
  }
  function say(mn, line) {
    const w = words(mn);
    return fill(line, { name: api.name(mn) }).replace(/\{a\}/g, w.a).replace(/\{s\}/g, w.s).replace(/\{p\}/g, w.p).replace(/\{act\}/g, w.act).replace(/\{pose\}/g, w.pose).replace(/\{pet\}/g, petName(mn));
  }
  function scriptFor(level) {
    return [].concat(SCRIPT.settle, SCRIPT.deeper[level], SCRIPT.suggest[level], SCRIPT.wake[level]);
  }
  function start(by, mn, level) {
    running.set(mn, { by, level, lines: scriptFor(level), i: 0 });
    step(mn);
  }
  function step(mn) {
    const run = running.get(mn);
    if (!run) return;
    if (!api.char(mn)) {
      running.delete(mn);
      return;
    }
    const line = run.lines[run.i];
    if (!line) {
      finish(mn, run);
      return;
    }
    api.voice(mn, say(mn, line));
    run.i++;
    api.later(() => step(mn), between(35, 50) * 1e3);
  }
  function finish(mn, run) {
    running.delete(mn);
    const x = me(mn);
    x.sessions[run.level] = (x.sessions[run.level] || 0) + 1;
    x.total++;
    const tier = MILESTONES.filter((m) => x.total >= m).length;
    if (tier > x.tier) {
      x.tier = tier;
      api.notice(mn, "🌀 Conditioning tier " + tier + ". You're a " + petName(mn) + " now, deeper every time.");
      if (run.by !== mn) api.notice(run.by, "🌀 " + api.name(mn) + " reached conditioning tier " + tier + ".");
    }
    api.save();
  }
  function stop(mn, why) {
    if (!running.has(mn)) return false;
    running.delete(mn);
    if (why) api.voice(mn, why);
    return true;
  }
  function cmdCondition(c) {
    const { sender, args, api: A } = c;
    if (String(args[0] || "").toLowerCase() === "stop") {
      const t2 = A.find(args[1]);
      if (!t2) return c.reply("Whose session, sugar? ?condition stop <who>");
      if (!(A.isProprietor(sender) || A.herdLeaderOf(t2) === sender || running.get(t2)?.by === sender)) return c.reply("That's not your session to stop, hon.");
      return c.reply(stop(t2, "That's all for now. Come up gently, " + A.name(t2) + ".") ? "🌀 Stopped." : A.name(t2) + " isn't in a session.");
    }
    const t = A.find(args[0]);
    if (!t || !A.rec(t)) return c.reply("Here's how: ?condition <who> [fun|deep|nhl]. They need ?hypno on, and it never goes deeper than they allow.");
    if (!(A.isProprietor(sender) || A.herdLeaderOf(t) === sender)) return c.reply("Only " + A.name(t) + "'s herd leader (or a proprietor) runs their sessions, sugar.");
    if (!A.rec(t).hypno) return c.reply(A.name(t) + " hasn't said ?hypno on, so no sessions, hon.");
    if (!A.char(t)) return c.reply(A.name(t) + " needs to be here on the farm for a session.");
    if (running.has(t)) return c.reply(A.name(t) + " is already in a session.");
    const want = LEVELS.includes(String(args[1] || "").toLowerCase()) ? String(args[1]).toLowerCase() : me(t).max;
    if (LEVELS.indexOf(want) > LEVELS.indexOf(me(t).max)) return c.reply(A.name(t) + " only allows " + LEVEL_NAME[me(t).max] + " sessions. That's their call.");
    start(sender, t, want);
    c.reply("🌀 " + LEVEL_NAME[want] + " session started for " + A.name(t) + " (about " + Math.round(scriptFor(want).length * 42 / 60) + " minutes). ?condition stop " + A.name(t) + " ends it.");
  }
  function cmdLevel(c) {
    const { sender, args, api: A } = c, v = String(args[0] || "").toLowerCase();
    if (!A.rec(sender)) return c.reply("That's just for folks on the books, sugar.");
    if (!LEVELS.includes(v)) return c.reply("🌀 You allow " + LEVEL_NAME[me(sender).max] + " sessions. ?hypnolevel fun, deep or nhl (No human left) sets the deepest you'll go.");
    me(sender).max = v;
    A.save();
    c.reply("🌀 The deepest a session can take you is now " + LEVEL_NAME[v] + "." + (A.rec(sender).hypno ? "" : " (Sessions also need ?hypno on.)"));
  }
  var progressText = (mn) => {
    const x = me(mn), next = MILESTONES.find((m) => x.total < m);
    return "🌀 Conditioning: tier " + x.tier + " (" + petName(mn) + ") · " + x.total + " sessions (fun " + x.sessions.fun + ", deep " + x.sessions.deep + ", nhl " + x.sessions.nhl + ")" + (next ? " · next tier at " + next : " · top tier") + " · allows " + LEVEL_NAME[x.max];
  };
  function companion(mn) {
    const r = api.rec(mn);
    if (!r) return null;
    const x = me(mn), next = MILESTONES.find((m) => x.total < m), cards = [];
    cards.push({
      title: "Conditioning",
      text: r.hypno ? void 0 : "Sessions need ?hypno on (in your Toggles).",
      lines: [["Tier", x.tier + " · " + petName(mn)], ["Sessions", x.total], ["Deepest allowed", LEVEL_NAME[x.max]]],
      bars: next ? [{ label: "To the next tier", value: x.total + " / " + next, pct: x.total / next * 100 }] : void 0,
      buttons: LEVELS.map((l) => ({ label: "Allow " + LEVEL_NAME[l], cmd: "hypnolevel " + l, accent: l === x.max })).concat(running.has(mn) ? [{ label: "Wake me up", cmd: "wake", accent: true }] : [])
    });
    if (api.isStaff(mn)) cards.push({
      title: "Run a session",
      input: { placeholder: "Bessie deep", label: "Start (who, level)", cmd: "condition" },
      note: "Only for your own herd (proprietors: anyone). Never deeper than they allow."
    });
    return { cards };
  }
  connect({
    name: "conditioning",
    label: "Conditioning",
    version: "1.0.0",
    guide: "Guided trance sessions written for your species, in the farm's voice. Needs ?hypno on; ?hypnolevel fun|deep|nhl sets the deepest you allow. Your herd leader runs them with ?condition <who> [level]. Sessions count toward conditioning tiers (3, 7, 15, 30). ?wake or ?safe ends one at once. Works alongside ECHS.",
    setup(a) {
      api = a;
      D();
    },
    commands: {
      condition: { rank: "staff", private: true, run: cmdCondition },
      hypnolevel: { private: true, run: cmdLevel },
      wake: { private: true, run: (c) => c.reply(stop(c.sender, "Coming up now. Eyes open, " + c.api.name(c.sender) + ". You're alright.") ? "🌀 Session ended." : "You're not in a session, sugar.") },
      conditioning: { private: true, run: (c) => {
        const t = c.args[0] ? c.api.find(c.args[0]) : c.sender;
        if (t !== c.sender && !c.api.isStaff(c.sender)) return c.reply("Only staff look at somebody else's, sugar.");
        c.reply(t ? progressText(t) : "Who's that, hon?");
      } }
    },
    on: { safe: (mn) => stop(mn, null), leave: (mn) => stop(mn, null) },
    companion
  });
})();
