/* WHAT'S IN THIS FILE (livestock.js)
   The Livestock panel (your own), tidied Nov 4 (Laynie: "is there a way we can clean it and the tabs up so it isnt as
   busy looking, but leaves access to all the same information?", then "thats so much cleaner"). Four tabs:
     🐄 Me: one card (purse, what's on you, the meters), then one-line rows that open where they sit, and quick buttons
     🥛 Body: milk, breedin', holdin', seed
     🪤 Play: traps, what's on you, the nest, keepsakes, potions, a dare, the proprietors' traps and seasons
     🎀 Ribbons: the purse, the store's shelves, feats
   The switches went to ⚙ Settings (settingspages.js), the guides too; the inbox is the Me tab's top row; 🆘 is in the
   header like before. Also the "Livestock" view staff and proprietors switch to for their own personal info.
*/
import { h, card, title, muted, btn, chip, bar, toggle, ml, meters, rows, quick, section, pairs } from "../dom.js";
import { safetyTab } from "./common.js";
import { storeParts } from "./store.js";
import { mePieces } from "./extras.js";
import { gearLore } from "../gearlore.js";
import { settingsAvailable, openSettings } from "../settings.js";
import { drawnBodyState, drawnBodySet, drawnBodyCup, drawnBodyPaste, drawnBodyFromStudio, drawnBodySeeOthers, drawnBodyBelly, drawnBodyUseFarm } from "../drawnbody.js";

const pct = (a, b) => (b ? (100 * a) / b : 0);
const hoursLeft = (t) => Math.max(0, Math.ceil((t - Date.now()) / 3600000));
const minsLeft = (t) => Math.max(0, Math.ceil((t - Date.now()) / 60000));
// "2 d 6 h", "5 h", "40 m" till then
const till = (t) => { const m = minsLeft(t); return m >= 1440 ? Math.floor(m / 1440) + " d " + Math.floor((m % 1440) / 60) + " h" : m >= 60 ? Math.floor(m / 60) + " h" : m + " m"; };
const clock = (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// "1.8 / 2.4 L" or "320 / 600 mL"
const of = (a, b) => (b >= 1000 ? (a / 1000).toFixed(1) + " / " + (b / 1000).toFixed(1) + " L" : Math.round(a) + " / " + Math.round(b) + " mL");
const plain = (label) => String(label || "").replace(/^[^\p{L}\p{N}]+/u, "");   // "🌾 Food" → "Food", for the small meters
// to the ⚙ settings, on a page: the game's own settings when it has them, else the panel's ⚙ tab
export function goSettings(ctx, page) {
  if (settingsAvailable() && openSettings(page)) return;
  ctx.setUi({ setPage: page, setFind: "", goTab: "settings" });
}
const errCard = (s) => s.stateErr && card(title("Somethin' broke on the farm girl's end"), muted("Part of your panel didn't arrive. Tell the proprietors this line: " + s.stateErr));

// what has you right now, in plain lines, and the quiet button
export function happeningCard(ctx) {
  const s = ctx.s, hp = s.happening || [], quiet = s.quietUntil && s.quietUntil > Date.now();
  if (!hp.length && !s.onBooks) return null;
  return card(h("div", { class: "fhc-kv" }, title("What's happenin' to you"), quiet ? chip("quiet", "acc") : null), happening(ctx));
}
function happening(ctx) {
  const s = ctx.s, hp = s.happening || [], quiet = s.quietUntil && s.quietUntil > Date.now();
  return [hp.length ? hp.map((t) => h("div", { style: { margin: "3px 0" } }, t)) : muted("Nothin' has hold of you right now."),
    h("div", null, quiet ? btn("End the quiet", () => ctx.send("quiet off")) : btn("An hour's quiet", () => ctx.send("quiet 60")),
      muted(quiet ? "Nothin' new starts on you till it's over." : "Quiet: no new traps, urges, scents or teasin' for an hour. It doesn't stop what already has you; the safe word does."))];
}

/* ── 🐄 Me ── */
function me(ctx) {
  const s = ctx.s, x = mePieces(ctx), now = Date.now();
  const quiet = s.quietUntil && s.quietUntil > now;
  const sub = [[s.tier, s.species].filter(Boolean).join(" "), s.herdLeader && s.herdLeader + "'s herd",
    s.contract && (s.contract.until ? "contract " + till(s.contract.until) : "contract for good")].filter(Boolean).join(" · ");
  const chips = (s.now || []).filter((n) => !n.until || n.until > now).map((n) => chip(n.icon + " " + n.text + (n.until ? " · " + till(n.until) : ""), /🚫|🪵|⛓️|🚧|🔥/.test(n.icon) ? "alert" : ""))
    .concat(x.chips.map((c) => chip(String(c.text ?? c), c.kind === "alert" ? "alert" : "")), quiet ? [chip("🤫 quiet · " + till(s.quietUntil))] : []);
  const sum = h("div", { class: "fhc-sum" },
    h("div", { class: "fhc-sum-top" }, h("span", { class: "fhc-nm" }, s.name), h("span", { class: "fhc-purse", title: "Your ribbons" }, "🎀 " + (s.ribbons || 0))),
    sub ? h("div", { class: "fhc-muted", style: { marginTop: "-6px" } }, sub) : null,
    chips.length ? h("div", { class: "fhc-chips", "aria-label": "Right now" }, chips) : null,
    meters([
      s.milk && { label: "Milk", right: String(s.milk.grade || ""), value: of(s.milk.ml, s.milk.cap), pct: pct(s.milk.ml, s.milk.cap) },
      s.quota && { label: "Quota", right: s.quota.streak ? "×" + s.quota.streak : "", value: of(s.quota.ml, s.quota.goal), pct: pct(s.quota.ml, s.quota.goal), kind: "good" },
      s.semen && { label: "Seed", value: of(s.semen.ml, s.semen.cap), pct: pct(s.semen.ml, s.semen.cap) },
      s.holding && s.holding.ml > 0 && { label: "Holding", value: ml(s.holding.ml), pct: pct(s.holding.ml, s.holding.cap), kind: "alert" },
      ...x.bars.map((b) => ({ label: plain(b.label), value: String(b.value ?? ""), pct: Number(b.pct) || 0, kind: b.kind === "good" || b.kind === "alert" ? b.kind : "" })),
    ]));
  // the inbox: how many arrived since they last opened it
  const fresh = ctx.feed.filter((m) => m.kind !== "mine" && m.at > (ctx.ui.inboxSeen || 0)).length;
  const F = ctx.s.feats, next = F && Array.isArray(F.tracks) ? F.tracks.filter((t) => t.next).map((t) => Object.assign({ p: pct(t.n - (t.prev || 0), t.next - (t.prev || 0)) }, t)).sort((a, b) => b.p - a.p)[0] : null;
  const hp = s.happening || [];
  return [
    errCard(s),
    sum,
    rows(ctx, "me", [
      { id: "inbox", label: "📬 Inbox", dot: fresh > 0, sum: fresh ? fresh + " new" : ctx.feed.length ? "nothin' new" : "empty",
        body: () => { ctx.ui.inboxSeen = Date.now(); return inbox(ctx); } },
      hp.length && { id: "now", label: "🌀 What's got you", sum: hp.length === 1 ? String(hp[0]).slice(0, 40) : hp.length + " things", body: () => happening(ctx) },
      (s.preg || s.eggs) && { id: "carry", label: "🍼 Carryin'",
        sum: [s.preg && s.preg.sires.join(" & ") + "'s, due in " + Math.max(0, Math.ceil((s.preg.due - now) / 86400000)) + " d", s.eggs && s.eggs.n + " eggs"].filter(Boolean).join(" · "),
        body: () => [
          s.preg && h("div", null, "Carryin' for " + s.preg.sires.join(" & ") + " · due in " + Math.max(0, Math.ceil((s.preg.due - now) / 86400000)) + " day(s)"),
          s.eggs && h("div", null, "🥚 " + s.eggs.n + " eggs in you. ", h("span", { class: "fhc-muted" }, "?lay at the nest, or they come when they're due.")),
          h("div", null, btn("Pedigree", () => ctx.send("pedigree")), btn("Eggs", () => ctx.send("eggs")), btn("Body tab ›", () => ctx.setUi({ goTab: "body" })))] },
      (s.body || []).length && { id: "body", label: "📏 Body", sum: s.body.map((b) => b.size).slice(0, 3).join(" · "),
        body: () => [h("div", { class: "fhc-grid" }, s.body.map((b) => h("div", null, muted(b.label), h("div", { style: { fontWeight: 600 } }, b.size)))),
          h("div", null, btn("Measure", () => ctx.send("measure")))] },
      s.today && { id: "marks", label: "✍️ Today's marks", sum: "used " + s.today.tally + " · " + s.today.naughty + " naughty · praised " + s.today.praised,
        body: () => [pairs([["Used today", String(s.today.tally)], ["Naughty marks", String(s.today.naughty)], ["Praised", String(s.today.praised)], ["Degraded", s.today.degraded ? String(s.today.degraded) : null]]),
          h("div", null, btn("My tally", () => ctx.send("tally")))] },
      s.kept && { id: "kept", label: "🏷️ Kept by " + s.kept.by, sum: Math.max(1, Math.ceil((s.kept.until - now) / 86400000)) + " day(s) left",
        body: () => [s.kept.tag ? muted("Your tag: " + s.kept.tag) : null, s.kept.name ? muted("This week you're called: " + s.kept.name) : null,
          (s.kept.milk || []).length ? muted("Milked at " + s.kept.milk.map((x) => x + ":00").join(" and ")) : null,
          h("div", null, btn("What that means", () => ctx.send("kept")), btn("End it", () => ctx.send("kept off")))] },
      s.roam && { id: "roam", label: "🧭 Roam", sum: s.roam.until ? "out till " + clock(s.roam.until) : s.roam.left + " pass" + (s.roam.left === 1 ? "" : "es"), body: () => roamBody(ctx) },
      next && { id: "feat", label: "🏅 Next feat", sum: next.name + " " + TIER[next.tier + 1] + " · " + Math.round(next.p) + "%",
        body: () => [bar(next.icon + " " + next.name + ": tier " + TIER[next.tier + 1], next.n + " of " + next.next + " " + next.unit, next.p, "acc"),
          muted("Perk: " + next.perk + ", " + next.desc), h("div", null, btn("All my feats ›", () => ctx.setUi({ goTab: "ribbons", open_rib: "feats" })))] },
      x.cards.length && { id: "extras", label: "🧩 Farm extras", sum: x.labels.slice(0, 2).join(" · "), body: () => x.cards },
    ]),
    quick(ctx, "me", [
      ["🚿 Wash", () => ctx.send("wash")],
      ["💉 Shots", () => ctx.send("myshots")],
      // ?drain with their own number: them and nobody else, staff or stock (15-commands.js drainSelf)
      ["🪣 Drain", () => ctx.send("drain " + ((window.Player && window.Player.MemberNumber) || "me"))],
    ], [
      ["📊 Stats", () => ctx.send("stats")], ["📐 Measure", () => ctx.send("measure")], ["📋 Record", () => ctx.send("record")],
      ["🌳 Pedigree", () => ctx.send("pedigree")], ["🔑 Keys", () => ctx.send("keys")], ["👗 Dress me", () => ctx.send("dressme")],
      quiet ? ["🤫 End the quiet", () => ctx.send("quiet off")] : ["🤫 Quiet hour", () => ctx.send("quiet 60")],
    ]),
  ];
}
function roamBody(ctx) {
  const r = ctx.s.roam;
  return [r.until ? muted("Roamin' now: back on the farm by " + clock(r.until) + ", or the farm girl fetches you.")
                  : muted(r.left ? "An hour off the farm each; the whole map is yours either way. Walk out the door and a pass starts. Late back costs you." : "The farm gate's shut till you have a pass. The whole map is still yours to wander."),
    h("div", null, r.until ? btn("I'm back", () => ctx.send("roam back")) : r.left ? btn("Roam for an hour", () => ctx.send("roam start"), true) : null,
      r.until ? null : btn("Buy a pass · " + (r.price || 30) + " 🎀", () => ctx.send("buy roampass")))];
}

/* ── 🥛 Body ── */
function body(ctx) {
  const s = ctx.s, sw = s.switches || {}, g = s.gear || {}, onoff = (v) => (v === true ? "on" : v === false ? "off" : v);
  const steps = (lv) => h("div", { class: "fhc-steps" }, [1, 2, 3, 4].map((n) => h("div", { class: n <= lv ? "on" : "" })));
  const milk = s.milk ? section("🥛 Milk", "grade " + s.milk.grade,
    bar("In your udder", ml(s.milk.ml) + " of " + ml(s.milk.cap) + (s.milk.lastAt ? " · milked " + Math.round((Date.now() - s.milk.lastAt) / 60000) + " min ago" : ""), pct(s.milk.ml, s.milk.cap)),
    s.quota && bar("Today's quota", ml(s.quota.ml) + " of " + ml(s.quota.goal) + (s.quota.streak ? " · streak " + s.quota.streak : ""), pct(s.quota.ml, s.quota.goal), "good"),
    // what you're hooked up to right now, read off you by the farm
    g.milk ? [h("div", { class: "fhc-kv", style: { border: "none", padding: "0" } }, h("span", null, g.milk.name), h("span", { class: "fhc-muted" }, ["", "Gentle", "Steady", "Hard", "Max"][g.milk.level] + " · " + g.milk.ml + " mL a minute")), steps(g.milk.level),
      g.milk.kind === "echo" ? muted("The more worked up you are, the faster it draws.") : null]
      : muted("No pump on right now. A milk pump (the game's Lactation Pump), Echo's portable pump, the milk vendor or a milkin' stall all milk you."),
    g.machine && h("div", { class: "fhc-kv" }, h("span", null, "⚙️ " + g.machine.name), h("span", { class: "fhc-muted" }, g.machine.intensity < 0 ? "off" : "intensity " + g.machine.intensity)),
    g.funnel && h("div", { class: "fhc-kv" }, h("span", null, "Funnel gag"), h("span", { class: "fhc-muted" }, "fitted, and it counts as open")),
    s.stallUntil && h("div", { class: "fhc-kv" }, h("span", null, "Milkin' stall"), chip(minsLeft(s.stallUntil) + " min left", "acc")),
    s.dial && h("div", null, muted("The stall dial" + (s.milkCums ? " · milked till you came × " + s.milkCums : "")),
      h("div", null, [["gentle", "Gentle"], ["steady", "Steady"], ["hard", "Hard"], ["punishing", "Punishin'"]].map(([id, label]) =>
        h("button", { type: "button", class: "fhc-pill" + (s.dial === id ? " on" : ""), onclick: () => ctx.send("stalldial " + id) }, label))),
      muted({ gentle: "Slow and sweet. It leaves you a third.", steady: "It drains you to a quarter.", hard: "Fast and deep, down to an eighth, and sore teats after.", punishing: "Past empty. You'll be sensitive for an hour after." }[s.dial] || "")),
    h("div", null, btn("Quota", () => ctx.send("quota")), btn("Milk board", () => ctx.send("board"))))
    : section("🥛 Milk", null, muted("You're not makin' milk right now. Milkable is in ⚙ Settings › Farm switches."), h("div", null, btn("Farm switches", () => goSettings(ctx, "switches"))));
  const breed = section("🐂 Breedin'", [sw.fertile ? "fertile" : null, s.heatUntil ? "in heat " + hoursLeft(s.heatUntil) + " h" : null].filter(Boolean).join(" · "),
    pairs([["Breedable", onoff(sw.breedable)], ["Fertile", onoff(sw.fertile)], ["Jar breedin'", sw.jarok ? "asks first" : "never"], ["Free use", onoff(sw.freeuse)], ["Natural heat", onoff(sw.naturalheat)],
      ["Carryin'", s.preg ? s.preg.sires.join(" & ") + "'s, due in " + Math.max(0, Math.ceil((s.preg.due - Date.now()) / 86400000)) + " d" : null],
      ["Eggs in you", s.eggs ? s.eggs.n + " · lay at the nest" : null]]),
    h("div", null, btn("My tally", () => ctx.send("tally")), btn("Eggs", () => ctx.send("eggs")), btn("Pedigree", () => ctx.send("pedigree"))));
  const hold = s.holding && s.holding.cap ? section("🫙 Holdin'", Math.round(pct(s.holding.ml, s.holding.cap)) + "% full",
    bar("In you", ml(s.holding.ml) + " of " + ml(s.holding.cap), pct(s.holding.ml, s.holding.cap), "alert"),
    h("div", null, btn("🪣 Drain", () => ctx.send("drain " + ((window.Player && window.Player.MemberNumber) || "me"))), btn("🚿 Wash", () => ctx.send("wash")))) : null;
  const seed = s.semen ? section("💦 Seed", null, bar("Stored", ml(s.semen.ml) + " of " + ml(s.semen.cap), pct(s.semen.ml, s.semen.cap)))
    : section("💦 Seed", null, muted("You're not makin' seed. Want a turn as a stud? Futa's in ⚙ Settings › Farm switches."), h("div", null, btn("Farm switches", () => goSettings(ctx, "switches"))));
  return [milk, breed, hold, seed];
}

/* ── 🪤 Play ── */
// whole kinds of trap, each its own switch (the farm's 10y9q-trap-switches.js)
export function trapThemesCard(ctx) {
  const list = ctx.s.trapThemes || [];
  if (!list.length) return null;
  return card(title("Kinds of trap"), trapThemes(ctx));
}
function trapThemes(ctx) {
  const list = ctx.s.trapThemes || [];
  return [muted("Switch a whole kind off and not one of those traps springs for you, not even one a proprietor springs by hand. A trap that's two kinds is off if either is." + (ctx.s.trapCard ? "" : " (They only matter once your traps are on.)")),
    list.map((t) => toggle(t.icon + " " + t.label, t.desc, !!t.on, () => ctx.send("traps theme " + t.id + " " + (t.on ? "off" : "on"))))];
}
// the proprietors' Seasons card (the farm's 10y9m-seasons.js): any season's traps, any time of year
export function seasonsCard(ctx) {
  const b = seasons(ctx);
  return b ? card(title("🗓️ Seasons"), b) : null;
}
function seasons(ctx) {
  const sa = ctx.s.seasonsAdmin;
  if (!sa || !sa.rows || !sa.rows.length) return null;
  const at = (t) => new Date(t).toLocaleString([], t - Date.now() < 20 * 3600000 ? { hour: "2-digit", minute: "2-digit" } : { weekday: "short", hour: "2-digit", minute: "2-digit" });
  return [
    muted("Start any season's traps whenever you like: for a party, a special day, or just because. While one's on, about a third of what the plain trap tiles spring is from its pack, and the farm girl dresses for it. Anybody with their Seasonal packs switch off never gets them."),
    sa.rows.map((x) => h("div", { class: "fhc-kv" },
      h("span", null, x.icon + " " + x.label + " · " + (x.on ? (x.hand ? (x.open ? "on till you stop it" : "on till " + at(x.until)) : "on, its time of year") : x.dates)),
      h("span", null, x.on ? btn("Stop", () => ctx.send("seasons stop " + x.id))
        : [btn("2 hours", () => ctx.send("seasons start " + x.id + " 2h")), btn("Till I stop it", () => ctx.send("seasons start " + x.id + " on"))]))),
    h("div", null, btn("All of them, 2 hours", () => ctx.send("seasons start all 2h")), btn("Stop the ones I started", () => ctx.send("seasons stop")),
      btn(sa.costume ? "Her costume: on" : "Her costume: off", () => ctx.send("seasons costume " + (sa.costume ? "off" : "on"))), btn("The calendar", () => ctx.send("seasons"))),
    muted("Other lengths, or several at once: ?seasons start halloween 3d · ?seasons start halloween winter on")];
}
function play(ctx) {
  const s = ctx.s, tc = s.trapCard, ad = s.trapAdmin, gear = s.farmGear || [], st = storeParts(ctx), themes = s.trapThemes || [];
  const traps = tc ? section("🪤 Traps" + (tc.rank ? " · " + tc.rank : ""), tc.total + " sprung" + (tc.nextRank ? " · next rank at " + tc.nextRank : ""),
      tc.kinds.length ? h("div", { class: "fhc-chips" }, tc.kinds.map((k) => chip(k.kind + " ×" + k.n))) : muted("Nothin's caught you yet. Give it time."),
      muted(tc.left + " kind" + (tc.left === 1 ? "" : "s") + " still to find" + (tc.eggs ? " · " + tc.eggs + " eggs laid" : "") + (tc.paused ? " · traps paused" : "") + (tc.eager ? " · eager (no waits)" : "") + (tc.danger ? " · Danger Draught in you" : "")),
      (tc.corr || tc.under) ? bar("Corruption", tc.corr + " of 100" + (tc.under ? " · gone under, depth " + tc.under : ""), tc.corr, "alert") : null,
      tc.hunt && muted("🔔 The hunt is on: get to " + tc.hunt.goal),
      tc.today && muted("🎯 Trap of the day: " + tc.today.icon + " " + tc.today.kind + ", " + tc.today.what + (tc.today.paid ? ". It's paid you its ribbon today." : ". Twice as likely today, and a ribbon the first time it has you.")),
      tc.rated && muted("Your ratings: 💖 " + tc.rated.loved + " · 👍 " + tc.rated.fine + " · 🙅 " + tc.rated.no + (tc.rateAsk ? "" : " · not askin' after each trap")),
      quick(ctx, "traps", [["Struggle", () => ctx.send("struggle")], ["What's out there", () => ctx.send("traps")]], [
        ["Switch traps off", () => ctx.send("traps off")],
        [tc.eager ? "Eager: on" : "Eager: off", () => ctx.send("traps eager " + (tc.eager ? "off" : "on"))],
        ["Lay (at the nest)", () => ctx.send("lay")], ["My brood book", () => ctx.send("brood")], ["My ratings", () => ctx.send("rate")],
        [tc.rateAsk === false ? "Ask how each was: off" : "Ask how each was: on", () => ctx.send("rate ask " + (tc.rateAsk === false ? "on" : "off"))]]))
    : section("🪤 Traps", "off", muted("The farm's traps are off for you, so you can walk right over them. Switch them on and every trap spot on the farm can spring for you."), h("div", null, btn("Switch traps on", () => ctx.send("traps on"))));
  const offKinds = themes.filter((t) => !t.on).length;
  return [
    errCard(s),
    traps,
    rows(ctx, "play", [
      { id: "gear", label: "⛓ On you right now", sum: gear.length ? gear.length + " piece" + (gear.length === 1 ? "" : "s") : "nothin'",
        body: () => [gear.length ? gear.map((g) => h("div", null, h("div", { class: "fhc-kv" }, h("b", null, g.name), h("span", { class: "fhc-muted" }, minsLeft(g.until) + " min")), muted(gearLore(g.name) || g.desc || "")))
          : muted("No farm gear on you."),
          !ctx.prefs.gear && muted("Trap gear only goes on for real with \"Farm can put real gear on me\" switched on (⚙ Settings › Gear and marks).")] },
      themes.length && tc && { id: "kinds", label: "🧬 Kinds of trap", sum: offKinds ? offKinds + " off" : "all on", body: () => trapThemes(ctx) },
      st.now && { id: "fx", label: "🧪 In you right now", sum: (s.fx || []).length + " potion" + ((s.fx || []).length === 1 ? "" : "s"), body: () => st.now },
      st.dare && { id: "dare", label: s.dare.reckless ? "🎲 A reckless dare" : "🎲 Your dare", sum: minsLeft(s.dare.until) + " min left", body: () => st.dare },
      st.pen && { id: "pen", label: "🚧 Corralled", sum: minsLeft(s.penned.until) + " min", body: () => st.pen },
      s.sitting && { id: "nest", label: "🪺 Sittin' the nest", sum: s.sitting.n + " eggs", body: () => [muted(s.sitting.n + " eggs under you. They hatch in about " + Math.max(1, minsLeft(s.sitting.until)) + " min."), h("div", null, btn("Get up", () => ctx.send("sit up")))] },
      (s.holes && s.holes.length) && { id: "holes", label: "🕳 What you've taken", sum: s.holes.map((x) => x.rank).slice(0, 2).join(" · "),
        body: () => [s.holes.map((x) => h("div", { class: "fhc-kv" }, h("span", null, "Your " + x.hole + " · " + x.rank), h("span", { class: "fhc-muted" }, x.loads + " loads" + (x.knots ? " · " + x.knots + " knots" : "") + (x.next ? " · next at " + x.next : "")))),
          muted("Every step a hole is trained, you hold more for good and the traps pour more into it.")] },
      (s.album && s.album.length) && { id: "album", label: "📔 Keepsakes", sum: s.album.length + "",
        body: () => [s.album.map((e) => h("div", null, h("div", { class: "fhc-kv" }, h("b", null, e.i + " " + e.h), h("span", { class: "fhc-muted" }, new Date(e.t).toLocaleDateString())), muted(e.x))),
          muted("Only you can open this album.")] },
      s.onBooks && { id: "shots", label: "💉 Shots in you", sum: "?myshots", go: () => ctx.send("myshots") },
      ad && { id: "admin", label: "🛠 Proprietor: traps", sum: ad.subjects.length + " with traps on", body: () => trapAdmin(ctx) },
      ctx.s.seasonsAdmin && ctx.s.seasonsAdmin.rows && ctx.s.seasonsAdmin.rows.length && { id: "seasons", label: "🗓️ Seasons", sum: ctx.s.seasonsAdmin.rows.filter((x) => x.on).map((x) => x.icon).join(" ") || "none on", body: () => seasons(ctx) },
    ]),
  ];
}
function trapAdmin(ctx) {
  const ad = ctx.s.trapAdmin;
  return [
    ad.today && muted("🎯 Trap of the day: " + ad.today.icon + " " + ad.today.kind),
    ad.ratings && (ad.ratings.loved.length || ad.ratings.no.length) ? muted("💖 Most loved: " + (ad.ratings.loved.map((x) => x.icon + " " + x.kind + " (" + x.n + ")").join(", ") || "none yet") +
      " · 🙅 Most \"not for me\": " + (ad.ratings.no.map((x) => x.icon + " " + x.kind + " (" + x.n + ")").join(", ") || "none yet")) : null,
    ad.subjects.length ? ad.subjects.map((x) => h("div", { class: "fhc-kv" }, h("span", null, (x.here ? "● " : "") + x.name), h("span", { class: "fhc-muted" }, x.n + " sprung" + (x.paused ? " · paused" : ""))))
      : muted("Nobody's switched their traps on yet."),
    muted("Trap spots: " + (ad.spots.length ? ad.spots.join(", ") : "none yet (?spot set trap-<kind>)")),
    muted("Water: " + (ad.water.length ? ad.water.join(", ") : "none yet (?spot set pond)") + (ad.nest ? " · " + ad.nest + " eggs in the nest" : "") + (ad.pack ? " · pack at " + ad.pack : "")),
    ad.hunt && muted("🔔 Hunt on: finish at " + ad.hunt.goal + ", " + ad.hunt.done + " home"),
    h("div", null, btn("Kinds & spots", () => ctx.send("traps")), btn("Subjects", () => ctx.send("subject")), btn(ad.hunt ? "Stop the hunt" : "Start a hunt", () => ctx.send(ad.hunt ? "hunt stop" : "hunt start")),
      btn("Gather eggs", () => ctx.send("gather")), btn("Ratings", () => ctx.send("traps ratings")))];
}

/* ── 🎀 Ribbons ── */
// 🏅 FEATS (Nov 4): each track, how far along the next tier, and its perk (with a switch, if you'd rather it didn't work)
const TIER = ["–", "I", "II", "III", "IV", "V"];
function feats(ctx) {
  const F = ctx.s.feats;
  if (!F || !Array.isArray(F.tracks)) return [muted("Your feats show here once the farm girl's sent your panel. ?feats works from chat too.")];
  return [
    muted("Every track counts somethin' you do on the farm. Each new tier is a feat and grows that track's perk; perks stack and work on their own."),
    F.tracks.map((t) => h("div", { class: "fhc-box" },
      h("div", { class: "fhc-kv" }, h("b", null, t.icon + " " + t.name + " " + TIER[t.tier]), t.tier ? chip(t.perk + (t.off ? " (off)" : ""), t.off ? "" : "good") : null),
      t.next ? bar("Next: tier " + TIER[t.tier + 1], t.n + " of " + t.next + " " + t.unit, pct(t.n - (t.prev || 0), t.next - (t.prev || 0)), "acc") : muted("Every tier earned. " + t.n + " " + t.unit + "."),
      muted(t.tier ? t.perk + ": " + t.desc : "Perk: " + t.perk + ", " + t.desc),
      t.tier ? toggle("Use " + t.perk, "Switch it off and it stays earned.", !t.off, () => ctx.send("perks " + (t.off ? "on " : "off ") + t.key)) : null)),
  ];
}
function ribbons(ctx) {
  const s = ctx.s, st = storeParts(ctx), F = s.feats, tiers = F && Array.isArray(F.tracks) ? F.tracks.reduce((n, t) => n + (t.tier || 0), 0) : 0;
  const log = s.ribbonLog || [];
  return [
    h("div", { class: "fhc-sum" },
      h("div", { class: "fhc-sum-top" }, h("span", { class: "fhc-nm" }, "🎀 Your ribbons"), h("span", { class: "fhc-purse", style: { fontSize: "22px" } }, String(s.ribbons || 0))),
      s.quotaGrace ? h("div", null, chip("quota grace × " + s.quotaGrace, "good")) : null,
      st.vat,
      muted("Earn 'em: your milk quota, a full stall session, chores, glory shifts, dares, shows, best of the week, and staff who think you've been good.")),
    rows(ctx, "rib", [
      log.length && { id: "log", label: "📒 Where they came from", sum: (log[0].n > 0 ? "+" : "") + log[0].n + " " + log[0].why, body: () => st.logList },
      ...st.shelves.map((sh) => ({ id: sh.id, label: sh.label, sum: sh.n + " on the shelf", body: sh.body })),
      { id: "feats", label: "🏅 Feats", sum: F && Array.isArray(F.tracks) ? tiers + " tier" + (tiers === 1 ? "" : "s") + " earned" : "", body: () => feats(ctx) },
      F && F.titles && F.titles.length && { id: "titles", label: "🎖️ Titles", sum: String(F.titles.length), body: () => [muted(F.titles.join(" · "))] },
    ]),
    h("div", null, btn("This week's board", () => ctx.send("ribbons top"))),
  ];
}

export function inbox(ctx) {
  const f = ctx.ui.filter || "all";
  const items = ctx.feed.filter((x) => f === "all" || x.kind === f);
  return [
    h("div", null, [["all", "All"], ["notice", "From the farm"], ["reply", "Answers"], ["mine", "You asked"]].map(([id, label]) =>
      h("button", { type: "button", class: "fhc-pill" + (f === id ? " on" : ""), onclick: () => ctx.setUi({ filter: id }) }, label))),
    items.length ? items.slice().reverse().map((x) => h("div", { class: "fhc-card " + x.kind },
      h("span", { class: "fhc-time" }, new Date(x.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
        (x.kind === "notice" ? " · from the farm" : x.kind === "mine" ? " · you asked" : "")), x.text)) : muted("Nothin' here yet."),
  ];
}

// the farm switches you hold, flipped with the same commands you'd type (shown in ⚙ Settings: settingspages.js)
export const SWITCH_INFO = [
  ["hypno", "Hypno", "Conditioning's trance sessions can take you, in the farm's voice, never deeper than your ?depth (fun, deep or no human left). ?wake ends one"],
  ["teaseme", "Tease me", "The farm whispers you a tease 3 or 4 times an hour while you're here, about whatever's goin' on with you: full udders, a load still in you, a heat, a mess. ?teaseme steady or needy for more. Your herd leader can switch it for you too"],
  ["breedable", "Breedable", "You can be bred and filled"], ["fertile", "Fertile", "You can catch"],
  ["mpreg", "Mpreg", "A load in your ass can take too, no item needed (with Breedable and Fertile on)"],
  ["jarok", "Jar breedin'", "On: staff still ask every time · Off: never"], ["freeuse", "Free use", "Any stud may have you without askin'"],
  // Laynie, Nov 4: "also need the futa toggle, just in case a female wants to temporaily be a stud"
  ["futa", "Futa", "A cock of your own as well: cock and pussy both, milk and cum both. Be a stud for a while, and flip it back whenever you like"],
  ["milkable", "Milkable", "Make milk"],
  ["seedmilk", "Milk my seed", "The stall, the milkin' traps and ?collect take your seed as well as your milk. Off: they milk you up top and leave your cock and balls be"],
  ["naturalheat", "Natural heat", "Come into heat on your own every 7 days"], ["praise", "Praise", "Let staff's praise count"],
  ["degrade", "Degrade", "Let staff's degradin' count"], ["tally", "Tally marks", "Show your tally on ?who and the board"],
  ["potions", "Potions", "Staff and the wheel can give you potions, and others can gift you one (you're asked first). Your limits still rule some out"],
  ["dares", "Dares", "Staff and the wheel can hand you a dare to do in half an hour"],
  ["watersports", "Watersports", "Piss play can find you: the spray trap, a feeder crafted for it, and the scenes that have it. Off until you say so"],
  ["parasite", "Parasite", "Swallow at the glory stalls and, rarely, a pair of livin' lips seals over your mouth for 12 hours: it feeds you fertility, growth, hyper pregnancy and capacity serum and turns every load you swallow into more"],
  ["symbiote", "Symbiotes", "Livin' latex, milk moss or the nestling can bond to you. Each gives you somethin' for as long as it's fed: room to hold more, more milk, an easier catch. They grow into real clothes on you (latex, moss), and they spread: latex by a touch, moss in the milk, the nestling by a breedin', to others who switched this on. Your safeword sends it away"],
  ["traps", "Traps", "The farm's traps spring for you: step on a trap spot and it might dose, drain, breed, strip, pump or fill you with eggs, and the water's not safe either. Off: you walk right over them. Your limits and your safeword still rule"],
  ["ownoutfit", "Bring my own outfit", "Keep the look you came in when you sign a contract. Off: your first contract dresses you, once, in the farm's outfit for your kind, and nothin' changes it back after"],
  ["eager", "Traps: no cooldown", "With traps on: no breather between traps and no wait for a trap to reset. Step off and back on and it springs again"],
  ["bench", "Use bench", "Staff and the wheel can sentence you to time strapped over the use bench, where anybody can use you. Your safeword ends it at once"],
];
// some switches only work once another is on; say so instead of lettin' a click do nothin'
const NEEDS = { freeuse: ["breedable", "Turn Breedable on first"] };
export function farmSwitches(ctx, list) {
  const sw = ctx.s.switches || {};
  return list.map(([cmd, label, desc]) => {
    const need = NEEDS[cmd];
    if (need && !sw[need[0]] && !sw[cmd]) return toggle(label, need[1] + " · " + desc, false, () => ctx.send(cmd + " on"));
    return toggle(label, desc, !!sw[cmd], () => ctx.send(cmd + " " + (sw[cmd] ? "off" : "on")));
  });
}
// a card that sends them to the ⚙ settings (the Guest and Staff panels' old Settings and Toggles tabs point there)
export function panelPrefsOrLink(ctx) {
  return card(title("Your switches, this panel, your settings file and the full guides"),
    muted(settingsAvailable() ? "They're in the game's own settings: Preferences → Extensions → Farmhand Companion. The ⚙ at the top of this panel opens them." : "They're behind the ⚙ at the top of this panel."),
    btn("Open the settings", () => goSettings(ctx, "switches"), true));
}
// The drawn body, from the outfit studio: breasts past the game's biggest, your belly, and what you wear fitted to them.
// Off until you switch it on. Everyone with the Companion sees it (drawnbody.js shares the settings with the room).
// It's drawn with the farm's look, which the farm girl hands out, plus your own cup and belly; a studio of your own
// can replace the farm's look with yours. (⚙ Settings › Body and look.)
export function drawnBodyCard(ctx) {
  const st = drawnBodyState(), say = (t) => ctx.hint(t);
  const code = h("textarea", { class: "fhc-in", rows: 2, placeholder: "…or paste the code from the studio's Copy for the Companion button" });
  return card(title("Drawn body (outfit studio)"),
    toggle("Show my drawn body", "Breasts from DD to R in your own skin, your belly, and what you wear fitted to them, on your character. Everyone here with the Companion sees it; people without it see the game's own picture of you. Off takes it away.",
      st.on, () => { drawnBodySet(!st.on, say); ctx.setPref("drawnBody", !st.on); }),
    h("div", { class: "fhc-kv", style: { marginTop: "6px" } }, muted("Cup"),
      h("select", { class: "fhc-sel", onchange: (e) => { const v = e.target.value; drawnBodyCup(v === "auto" ? "auto" : Number(v), say); ctx.setPref("drawnBodyCup", v); } },
        [h("option", { value: "auto", selected: !st.cupSet }, "Follow the farm" + (st.farmCup ? " (" + (st.cups[st.farmCup] || "?") + " now)" : ""))].concat(
          st.cups.map((c, i) => (i < 6 ? null : h("option", { value: String(i), selected: st.cupSet && i === st.cup }, c)))))),
    st.on && st.cup >= 6 && st.chest && st.chest !== "XLarge" ? muted("Your chest is set to " + st.chest + " in the wardrobe. Set it to the biggest for the drawn breasts to show.") : null,
    h("div", { class: "fhc-kv", style: { marginTop: "6px" } }, muted("Belly"),
      h("select", { class: "fhc-sel", onchange: (e) => { drawnBodyBelly(e.target.value, say); ctx.setPref("drawnBodyBelly", e.target.value); } },
        [["farm", "Follow the farm" + (st.farmBelly ? " (showing now)" : " (flat now)")], ["on", "Always"], ["off", "Never"]].concat(st.fromStudio ? [["studio", "As my studio has it"]] : [])
          .map(([v, label]) => h("option", { value: v, selected: st.bellyMode === v }, label)))),
    muted("Following the farm, your cup is the size the farm has grown your udder to, and your belly shows and grows as you fill up, carry eggs or get bred."),
    muted(st.fromStudio ? "Using your own studio settings." : st.fromFarm ? "Using the farm's look, with your own cup and belly." : "The farm's look comes from the farm girl once you're in her room; plain settings till then."),
    st.fromStudio ? btn("Use the farm's look instead", () => { drawnBodyUseFarm(say); ctx.setPref("drawnBodyAt", Date.now()); }) : null,
    h("div", { style: { marginTop: "8px" } }, muted("Got an outfit studio of your own? Bring its settings over:")),
    h("div", { style: { marginTop: "4px" } }, btn("Get my studio's settings", () => { drawnBodyFromStudio(say).then((ok) => { if (ok) ctx.setPref("drawnBodyAt", Date.now()); }); }, true)),
    muted("Works while the studio is running on this computer: it takes what you last saved there (Save the breasts, Save all the fits)."),
    h("div", { style: { marginTop: "6px" } }, code),
    btn("Put in the pasted code", () => { if (drawnBodyPaste(code.value, say)) ctx.setPref("drawnBodyAt", Date.now()); }),
    toggle("See other people's drawn bodies", "Draw other Companion users the way their studio settings say" + (st.othersHere ? " (" + st.othersHere + " here now)" : "") + ". Off: everybody else is the game's own picture on your screen.",
      st.seeOthers, () => { drawnBodySeeOthers(!st.seeOthers, say); ctx.setPref("drawnBodySee", !st.seeOthers); }));
}
// every switch the farm's add-ons offer (glory stalls, barn life, breeding week, fences…), in one place
export function extraSwitches(ctx) {
  const list = [];
  for (const m of Object.values(ctx.s.mods || {})) for (const c of (m.cards || []).filter((c) => c && !c.staff)) for (const t of (c.toggles || [])) list.push([m.label, t]);
  if (!list.length) return null;
  return card(title("🧩 Farm extras"), muted("The farm's add-ons. Each one is off until you switch it on."),
    list.map(([label, t]) => toggle(String(t.label), (t.desc ? String(t.desc) + " " : "") + "(" + label + ")", !!t.on, () => ctx.send(String(t.cmd)))));
}

export const LIVESTOCK_TABS = [
  { id: "me", label: "🐄 Me", render: me },
  { id: "body", label: "🥛 Body", render: body },
  { id: "play", label: "🪤 Play", render: play },
  { id: "ribbons", label: "🎀 Ribbons", render: ribbons },
  { id: "safety", label: "🆘 Safety", render: safetyTab, offRow: true },   // (the 🆘 button in the header opens it)
];
