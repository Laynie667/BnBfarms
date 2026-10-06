/* WHAT'S IN THIS FILE (common.js)
   Pieces several panels share: the Guides tab and the farm's areas.
*/
// Pieces more than one view uses: the guides tab, and the guest panel.
import { h, card, title, muted, btn } from "../dom.js";
import { BOOKS, PUBLIC_GROUPS, STAFF_GROUPS, OWNER_GROUPS, needsInput, cmdStem } from "../../../shared/guides.js";

// the safety buttons, in their own tab on the Guest and Livestock panels (asked for: out of the way of
// everyday use, but one tap from the tab row). ?safe, ?stuck and ?staff work from chat too.
export function safetyTab(ctx) {
  const big = (label, cmd, red, note) => h("div", { style: { marginBottom: "10px" } },
    h("button", { type: "button", class: "fhc-safe" + (red ? " red" : ""), style: { width: "100%", minHeight: "48px", fontSize: "16px" }, onclick: () => ctx.send(cmd) }, label),
    muted(note));
  return [
    card(title("Safety"),
      big("Safe word", "safe", true, "Stops everything at once, from anybody, anywhere on the farm. No contract overrides it. On-call staff are called to you."),
      big("I'm stuck", "stuck", false, "Can't move, can't reach a door, stuck in somethin'? Staff are told where you are, and you're brought somewhere safe."),
      big("Call staff", "staff", false, "Just want a hand, or somebody to talk to? This calls whoever's on duty.")),
    muted("From chat, without the panel: ?safe · ?stuck · ?staff"),
  ];
}

export function guidesTab(ctx, staff) {
  const q = (ctx.ui.search || "").toLowerCase();
  // the same groups the bot's "?help me" lists, plus the running add-ons' commands for this person's rank
  const groups = PUBLIC_GROUPS.concat(staff ? STAFF_GROUPS : [], staff && ctx.s.proprietor ? OWNER_GROUPS : [],
    (ctx.s.addonCmds || []).map((g) => ({ name: "🧩 " + g.name, cmds: (g.cmds || []).map(String) })));
  const shown = groups.map((g) => ({ name: g.name, cmds: g.cmds.filter((c) => !q || c.includes(q) || g.name.toLowerCase().includes(q)) }))
    .filter((g) => g.cmds.length);
  const input = h("input", { class: "fhc-in", placeholder: "milk, breed, keys…", value: ctx.ui.search || "",
    oninput: (e) => ctx.setUi({ search: e.target.value }, true) });
  return [
    h("label", { class: "fhc-label" }, "Search guides and commands", input),
    h("div", null, BOOKS.map(([label, cmd]) => btn(label, () => ctx.send(cmd), true))),
    shown.map((g) => card(title(g.name), h("div", null, g.cmds.map((c) =>
      h("button", { type: "button", class: "fhc-cmd", title: needsInput(c) ? "Fill in the rest, then send" : "Send it",
        onclick: () => (needsInput(c) ? ctx.fillBox(cmdStem(c) + " ") : ctx.send(c)) }, "?" + c))))),
    staff ? null : muted("Staff see their own commands on the Staff panel."),
  ];
}

export const AREAS = [
  ["The pasture", "Open", "Open ground, good grass, the heart of the place. Four milkin' stalls along the side."],
  ["The barn", "Open", "Warm and dim. Where the stock sleeps and the machines live."],
  ["Barn safe room", "Bronze", "Quiet and soft, off the back of the barn. Nobody follows you through it."],
  ["The pens", "Open", "Gloryhole stalls, for punishment, breedin', or leavin' somethin' out for guests."],
  ["Kennel and ring", "Open", "Pets, trainin' and the show ring, with a locker room attached."],
  ["Medical", "Silver", "Checkups, injections, and watchin' what develops."],
  ["Staff room", "Silver", "Interviews and staff business, back of the pasture."],
  ["Security wing", "Gold", "Permanent displays down the back hall."],
  ["The cabin", "Booking", "Laynie and Alexia's home, unless somebody books it."],
];
