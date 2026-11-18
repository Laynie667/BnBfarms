/* WHAT'S IN THIS FILE (speech.js)
   WHAT A DOSE DOES TO WHAT YOU SAY. Only what you say out loud in the room: commands, whispers, emotes and
   out-of-character lines are never touched (nothing ever takes away speaking out of character).
     Moo Juice      about half the words come out as your animal's noise (more, the stronger the dose)
     Hiccup Fizz    a *hic* or two breaks up what you say
     Featherlight   giggles slip in
     the Airhead Elixir and Babble Brew (Nov 17): speech-more.js
   Your animal is the farm's word for you (it tells your Dispensary when you're there), or the one you pick on its page.
*/
import { mooify } from "../../shared/noises.js";
import { st } from "./store.js";
import { active } from "./doses.js";
import { airhead, babble } from "./speech-more.js";

const xOf = (id) => (st().doses[id] && st().doses[id].x) || 1;
const GIGGLES = ["hehe", "*giggle*", "hee", "*snrk*", "ahaha", "*giggles*"];
const pickOf = (a) => a[Math.floor(Math.random() * a.length)];
// a few words in, at random gaps between words
function sprinkle(text, bits, every) {
  const words = String(text).split(" ");
  if (words.length < 2) return text + " " + pickOf(bits);
  const out = []; let since = 0;
  words.forEach((w, i) => { out.push(w); since++; if (i < words.length - 1 && since >= every && Math.random() < 0.5) { out.push(pickOf(bits)); since = 0; } });
  if (!out.some((w) => bits.includes(w))) out.splice(1 + Math.floor(Math.random() * (out.length - 1)), 0, pickOf(bits));
  return out.join(" ");
}
export function dosedSpeech(text) {
  let t = String(text);
  if (active("moo")) t = mooify(t, st().species || st().speciesFarm || "cow", Math.min(0.9, 0.4 + 0.1 * xOf("moo")));
  if (active("hiccup")) t = sprinkle(t, ["*hic*", "*hic!*", "—hic—"], 4);
  if (active("feather")) t = sprinkle(t, GIGGLES, 5);
  if (active("airhead")) t = airhead(t, xOf("airhead"));
  if (active("babble")) t = babble(t, xOf("babble"));
  return t;
}
const touched = () => ["moo", "hiccup", "feather", "airhead", "babble"].some(active);

export function initSpeech(mod) {
  try {
    mod.hookFunction("ServerSend", 6, (args, next) => {
      try {
        const d = args[1];
        if (args[0] === "ChatRoomChat" && d && d.Type === "Chat" && typeof d.Content === "string" && touched() && !/^\s*[(\[?!./\-*]/.test(d.Content))
          args = [args[0], Object.assign({}, d, { Content: dosedSpeech(d.Content) })];
      } catch (e) { console.warn("[Dispensary] speech:", e); }
      return next(args);
    });
  } catch (e) { console.warn("[Dispensary] what you say can't be dosed:", e); }
}
