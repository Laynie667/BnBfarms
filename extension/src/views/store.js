/* WHAT'S IN THIS FILE (store.js)
   The 🎀 Store tab: your ribbons and where they came from, potions in you right now, a dare if you've got
   one, the corral, and the farm store (buy for yourself, or gift a potion to somebody: they're asked first).
*/
import { h, card, title, muted, btn, chip } from "../dom.js";

const minsLeft = (t) => Math.max(0, Math.ceil((t - Date.now()) / 60000));
const KIND = { reward: "🍬", punish: "🔻", silly: "🎭" };

export function storeTab(ctx) {
  const s = ctx.s, items = s.store || [], fx = s.fx || [], log = s.ribbonLog || [];
  const purse = card(title("🎀 Your ribbons"),
    h("div", { style: { fontSize: "28px", fontWeight: "700", margin: "4px 0" } }, String(s.ribbons || 0)),
    s.quotaGrace ? chip("quota grace × " + s.quotaGrace, "good") : null,
    log.length ? h("div", { style: { marginTop: "6px" } }, log.map((e) => h("div", { class: "fhc-kv" }, h("span", null, e.why), h("b", null, (e.n > 0 ? "+" : "") + e.n)))) : null,
    muted("Earn 'em: your milk quota, a full stall session, chores, glory shifts, dares, shows, best of the week, and staff who think you've been good."),
    h("div", { style: { marginTop: "6px" } }, btn("This week's board", () => ctx.send("ribbons top"))));
  const vat = s.vat ? card(title("🥛 Your vat"), h("div", { style: { fontSize: "20px", fontWeight: "700", margin: "4px 0" } }, (s.vat >= 1000 ? (s.vat / 1000).toFixed(1) + " L" : s.vat + " ml")),
    muted("Everything milked and collected from you. It buys potions and shots at " + (s.vatPer || 500) + " ml for each ribbon of the price: \"Pay with milk\" on the shelf.")) : null;
  const now = fx.length ? card(title("🧪 In you right now"),
    fx.map((f) => h("div", { class: "fhc-kv" }, h("span", null, f.name), h("b", null, minsLeft(f.until) + " min"))),
    muted("Your safeword pours every one of them out.")) : null;
  const dare = s.dare ? card(title(s.dare.reckless ? "🎲 A reckless dare" : "🎲 Your dare"), h("p", null, s.dare.text),
    muted(minsLeft(s.dare.until) + " minutes left."),
    h("div", null, btn("I did it", () => ctx.send("dared"), true), btn("Chicken out (1 ribbon)", () => ctx.send("dare skip")))) : null;
  const pen = s.penned ? card(title("🚧 Corralled"), muted("At " + s.penned.at + " for " + minsLeft(s.penned.until) + " more minutes. Wander off and you'll be walked back.")) : null;

  const who = () => String(ctx.ui.giftWho || "").trim();
  const row = (it) => h("div", { class: "fhc-box", style: { padding: "8px", marginTop: "6px" } },
    h("div", { class: "fhc-kv", style: { borderBottom: "none", padding: "0" } },
      h("b", null, (KIND[it.kind] ? KIND[it.kind] + " " : "") + it.name), chip(it.price + " 🎀", (s.ribbons || 0) >= it.price ? "good" : "")),
    muted(it.desc),
    it.id === "bounty" || it.id === "greeting" || it.id === "tag" || it.id === "dedicate"
      ? btn("Write it…", () => ctx.fillBox("buy " + it.id + " "))
      : h("div", null,
          btn("Buy", () => ctx.send("buy " + it.id), true),
          s.vat && (it.kind || /^shot-/.test(it.id)) ? btn("Pay with milk", () => ctx.send("buy " + it.id + " with milk")) : null,
          it.gift ? btn("Gift it", () => (who() ? ctx.send("buy " + it.id + " for " + who()) : ctx.hint("Type who it's for in the box above the potions first."))) : null));
  const shelf = (label, list) => list.length ? card(title(label), list.map(row)) : null;
  const potions = items.filter((it) => it.kind), shots = items.filter((it) => /^shot-/.test(it.id)), messes = items.filter((it) => it.shelf === "mess"), treats = items.filter((it) => !it.kind && !/^shot-/.test(it.id) && it.shelf !== "mess");
  // the mess shelf (Laynie, Oct 19: "I didnt see the options to buy... to gift messes to people"): on you, or on somebody
  const messWho = () => String(ctx.ui.messWho || "").trim();
  const messRow = (it) => h("div", { class: "fhc-box", style: { padding: "8px", marginTop: "6px" } },
    h("div", { class: "fhc-kv", style: { borderBottom: "none", padding: "0" } }, h("b", null, it.name), chip(it.price + " 🎀", (s.ribbons || 0) >= it.price ? "good" : "")),
    muted(it.desc),
    h("div", null,
      btn("On them", () => (messWho() ? ctx.send("buy " + it.id + " for " + messWho()) : ctx.hint("Type who it's for in the box above the messes first.")), true),
      btn("On me", () => ctx.send("buy " + it.id))));
  const messCard = messes.length ? card(title("💦 Messes"),
    muted("Put a mess on somebody: they're asked first, unless they've said ?messes on. Their limits count. It shows on them with \"Farm can mark my body\" switched on, and ?wash cleans it off."),
    h("label", { class: "fhc-label" }, "For (name or member number)",
      h("input", { class: "fhc-in", value: ctx.ui.messWho || "", oninput: (e) => ctx.setUi({ messWho: e.target.value }, true) })),
    h("div", { style: { marginTop: "4px" } }, btn(s.messesOn ? "Messes on me: no askin' (switch off)" : "Let anybody mess me up without askin'", () => ctx.send("messes " + (s.messesOn ? "off" : "on")))),
    messes.map(messRow)) : null;
  return [purse, vat, now, dare, pen,
    messCard,
    shelf("🛍️ Treats and favors", treats),
    shelf("💉 Shots", shots),
    potions.length ? card(title("🧪 Potions"),
      muted("Gifts always ask them first, and you only pay if they say yes. They need Potions switched on in their Toggles."),
      h("label", { class: "fhc-label" }, "Gift to (name or member number)",
        h("input", { class: "fhc-in", value: ctx.ui.giftWho || "", oninput: (e) => ctx.setUi({ giftWho: e.target.value }, true) })),
      potions.map(row)) : null];
}
