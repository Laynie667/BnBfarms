/* WHAT'S IN THIS FILE (guest.js)
   The Guest panel for folks not on the books yet: Welcome, The farm, Rules, Inbox, Guides, Settings.
*/
// The guest panel: for anybody not on the books yet.
import { h, card, title, muted, btn } from "../dom.js";
import { guidesTab, AREAS } from "./common.js";
import { inbox, panelPrefs } from "./livestock.js";

export const GUEST_TABS = [
  { id: "welcome", label: "Welcome", render: (ctx) => [
    card(h("div", { class: "fhc-title" }, "Howdy, " + (ctx.welcome.name || "sugar") + "!"),
      h("p", null, "Welcome to B&B Farm. Everybody here chose to be here and signed to say so. Have a look around, mind the ruts, and holler if you need a hand."),
      btn("Take the tour", () => ctx.send("tour"), true), btn("Apply to join", () => ctx.send("apply")), btn("Luxury stay", () => ctx.send("luxury"))),
    card(title("Your keys"), muted("Guests don't carry keys. Staff can let you through any door.")) ] },
  { id: "farm", label: "The farm", render: () => AREAS.map(([n, key, d]) =>
    card(h("div", { class: "fhc-kv" }, h("b", null, n), h("span", { class: "fhc-muted" }, key)), muted(d))) },
  { id: "rules", label: "Rules", render: (ctx) => [
    h("div", { class: "fhc-box alert" }, h("b", null, "Safe word stops everything"),
      muted("Anywhere, from anybody. No contract overrides it. Beepin' the farm girl works from anywhere on the property, too.")),
    card(title("On consent"), h("p", null, "Every animal and every hand here chose to be here, and signed for it. What you see in the pens, stalls and barn was asked for. The contract's a fence that holds both ways: what ain't in it, don't happen.")),
    h("div", null, btn("Full rules", () => ctx.send("rules")), btn("Consent", () => ctx.send("consent")), btn("What opens what", () => ctx.send("doors"))) ] },
  { id: "inbox", label: "Inbox", render: inbox },
  { id: "guides", label: "Guides", render: (ctx) => guidesTab(ctx, false) },
  { id: "settings", label: "Settings", render: (ctx) => [card(title("Farm settings"), muted("Once you're on the books, your milkin', breedin' and teasin' switches show up here."), btn("Apply to join", () => ctx.send("apply"), true)), panelPrefs(ctx)] },
];
