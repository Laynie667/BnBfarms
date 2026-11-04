/* WHAT'S IN THIS FILE (addons/_template/index.js)
   A STARTER FOR A NEW PART OF THE FARM GIRL (Nov 4, Phase 4 of the plan). Copy this folder to addons/<your-part>
   (lowercase, dashes: "hayrides"), change the name below and the label in addon.json, and `npm run build` makes
   dist/farmhand-<your-part>.user.js. Folders startin' with _ are never built, so this one stays a template.
   It's a whole, workin' part: one command, one game event, a card in everybody's Companion, a line that fits who it's
   about. tests/bot-parts.test.cjs builds it and plugs it into the bot, so it can't quietly go stale.
   Everything a part can hand the bot is in README.md beside this file.
*/
import { connect } from "../_lib/connect.js";   // (pick, between and fill are there too)

let api = null;                                   // the bot's helpers, handed over in setup()
const D = () => api.data();                       // this part's own saved data (it lives in the bot's ledger)

// lines about somebody: a tag on the front says who a line fits ({c} has a cock, {nv} hasn't a pussy …, see README),
// and api.pickFor picks a fresh one that fits them. Big pools, farm words, never clinical, "they" for everybody.
const WAVE = [
  "%n gives the hayloft a wave, and the hayloft, bein' a hayloft, says nothin' back.",
  "%n waves at the barn cats. One of them blinks, which on this farm counts as a hello.",
  "{t}%n waves, and their tits bounce with it. Somebody by the fence waves back a little too eagerly.",
  "{c}%n waves hello, cock swingin' along with it, and doesn't seem to mind who notices.",
];

connect({
  name: "my-part",                                // lowercase letters, numbers and dashes; the folder's name is best
  label: "My part",                               // what people see (keep it the same as addon.json's label)
  version: __ADDON_VERSION__,                     // (its addon.json's, put in by the build: never type a number here)
  guide: "?wave waves hello to the farm. That's all this one does; it's a template.",
  setup(a) { api = a; D().waves = D().waves || 0; },

  // ?commands: a word the bot already uses is skipped (with a warning), and so is one another part took first.
  // rank: anyone (the default), staff, herdmaster or proprietor · private: the answer never goes to the room
  commands: {
    wave: { usage: "wave", aliases: ["hello"], run: (c) => {
      D().waves++; api.save();
      api.emote(api.pickFor(c.sender, "wave", WAVE).replace(/%n/g, api.name(c.sender)), c.sender);
      c.reply("👋 That's " + D().waves + " wave" + (D().waves === 1 ? "" : "s") + " on the farm so far.");
    } },
  },

  // game events (README lists them all): each is wrapped, so one that breaks never stops the bot
  on: {
    join: (mn) => { if (D().greet) api.notice(mn, "👋 Somebody's been wavin' round here. Try ?wave."); },
  },

  // a card in this person's Companion: the Livestock panel's 🧩 Farm extras row (staff: true cards only on Staff)
  companion: (mn) => ({ cards: [{ title: "Waves", text: D().waves + " so far", buttons: [{ label: "Wave", cmd: "wave" }] }] }),
});
