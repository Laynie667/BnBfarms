/* WHAT'S IN THIS FILE (map-tools/index.js)
   Map tools, an add-on for the farm bot: fenced pens and the heat map.
   (Click-to-build zones and spots, speaker spots, and the milking stall timer are in the bot and the
   Companion's Zones tab already.)

   • Pens: staff put somebody in a pen with ?pen <who> <zone>. If they've said ?fence on (it's opt-in),
     wandering out of that zone gets them tugged back to it (the bot needs room admin) and a naughty mark.
     ?pen <who> off lets them out. Without ?fence on, a pen is just where they belong; nothing is enforced.
   • Heat map: where people spend their time and where the action happens, by zone, this week.
     ?busy shows it (staff). It counts minutes in each zone, and activities and emotes made there.
*/
import { connect } from "../_lib/connect.js";

let api = null;
function D() {
  const d = api.data();
  d.pens = d.pens || {};      // member → { zone, by, at }
  d.fence = d.fence || {};    // member → true (opted in to being tugged back)
  d.heat = d.heat || { week: "", time: {}, action: {} };   // zone → minutes / count
  d.tugged = d.tugged || {};
  return d;
}

// the middle of a zone (a tile inside it to send people back to)
function middle(zone) {
  const z = api.zones()[zone];
  if (!z || !z.a || !z.b) return null;
  return { X: Math.round((z.a.X + z.b.X) / 2), Y: Math.round((z.a.Y + z.b.Y) / 2) };
}

function tick() {
  const d = D(), now = Date.now(), wk = api.weekKey();
  if (d.heat.week !== wk) d.heat = { week: wk, time: {}, action: {} };
  const minutes = api.cfg.HEARTBEAT_MS / 60000;
  for (const mn of api.here()) {
    // heat map: time spent in each zone
    for (const z of api.zonesOf(mn)) d.heat.time[z.group] = (d.heat.time[z.group] || 0) + minutes;
    // pens
    const pen = d.pens[mn];
    if (!pen || !d.fence[mn] || !api.onMap(mn) || api.inZone(mn, pen.zone)) continue;
    if (now - (d.tugged[mn] || 0) < 60000) continue;   // once a minute at most
    d.tugged[mn] = now;
    const to = middle(pen.zone);
    if (to) api.teleport(mn, to, false);
    const r = api.rec(mn); if (r) r.naughtyMarks = (r.naughtyMarks || 0) + 1;
    api.emote("🐄 " + api.name(mn) + " wandered out of the " + pen.zone + " pen and gets tugged right back in by the collar. Naughty!", mn);
  }
  api.save();
}
function onAction(mn) {
  const d = D();
  for (const z of api.zonesOf(mn)) d.heat.action[z.group] = (d.heat.action[z.group] || 0) + 1;
}

function heatText() {
  const h = D().heat;
  const zones = [...new Set(Object.keys(h.time).concat(Object.keys(h.action)))];
  if (!zones.length) return "🗺️ No heat map yet this week. It fills in as people spend time in zones.";
  const rows = zones.map((z) => [z, Math.round(h.time[z] || 0), h.action[z] || 0]).sort((a, b) => b[1] - a[1]);
  const top = Math.max(1, ...rows.map((r) => r[1]));
  return "🗺️ HEAT MAP (this week)\n" + rows.map(([z, t, a]) => "█".repeat(Math.max(1, Math.round((t / top) * 10))) + " " + z + ": " + t + " min · " + a + " actions").join("\n");
}

function cmdPen(c) {
  const { sender, args, api: A } = c, d = D();
  const t = A.find(args[0]), z = String(args[1] || "").toLowerCase();
  if (!t || !A.rec(t)) return c.reply("Here's how: ?pen <who> <zone> puts them in a pen · ?pen <who> off lets them out.");
  if (z === "off" || z === "out") { delete d.pens[t]; A.save(); A.notice(t, "🐄 You're let out of your pen."); return c.reply("🐄 " + A.name(t) + " is out of their pen."); }
  if (!A.zones()[z]) return c.reply("There's no zone called '" + z + "', sugar. ?zones lists them.");
  d.pens[t] = { zone: z, by: sender, at: Date.now() }; A.save();
  A.notice(t, "🐄 " + A.name(sender) + " put you in the " + z + " pen." + (d.fence[t] ? " Wander out and you'll be tugged back." : " (You haven't said ?fence on, so nothin' stops you leavin'.)"));
  c.reply("🐄 " + A.name(t) + " is penned in " + z + (d.fence[t] ? ", fenced." : ". They haven't said ?fence on, so it isn't enforced."));
}

function companion(mn) {
  if (!api.rec(mn)) return null;
  const d = D(), cards = [], pen = d.pens[mn];
  cards.push({ title: "Pens", text: pen ? "You're penned in " + pen.zone + "." : undefined,
    toggles: [{ label: "Fence me in", desc: "If staff pen you, wandering out tugs you back (and earns a naughty mark).", on: !!d.fence[mn], cmd: "fence " + (d.fence[mn] ? "off" : "on") }] });
  if (api.isStaff(mn)) cards.push({ staff: true, title: "Heat map", text: heatText(), input: { placeholder: "Bessie barn", label: "Pen (who, zone)", cmd: "pen" } });
  return { cards };
}

connect({
  name: "map-tools",
  label: "Map tools",
  version: "1.0.0",
  guide: "Pens: staff ?pen <who> <zone> (or off). With ?fence on, wandering out tugs you back with a naughty mark. Staff: ?busy shows where people spend time and where things happen this week.",
  setup(a) { api = a; D(); },
  commands: {
    pen: { usage: "pen <who> <zone>", rank: "staff", private: true, run: cmdPen },
    fence: { usage: "fence on|off", private: true, run: (c) => {
      const d = D(), w = String(c.args[0] || "").toLowerCase();
      if (w !== "on" && w !== "off") return c.reply("🐄 Fence: " + (d.fence[c.sender] ? "ON" : "off") + ". ?fence on lets a pen hold you; ?fence off and pens are just a suggestion.");
      if (w === "on") d.fence[c.sender] = true; else delete d.fence[c.sender];
      c.api.save(); c.reply(w === "on" ? "🐄 Fence ON. If staff pen you, you'll be tugged back when you wander." : "🐄 Fence off. Pens won't hold you.");
    } },
    busy: { usage: "busy", aliases: ["heatmap"], rank: "staff", private: true, run: (c) => c.reply(heatText()) },
  },
  on: { tick, activity: (data) => { const a = api.activityInfo(data); if (a.src) onAction(a.src); }, roleplay: (mn, text, type) => { if (type === "Emote") onAction(mn); } },
  companion,
});
