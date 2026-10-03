// How the bot and the Farmhand Companion extension talk to each other.
//
// Every message is a BC "Hidden" chat message: players never see it, only
// code does. Content is always FARM_MSG so we can tell ours apart from
// BCX ("BCXMsg"), BC+ ("BCP"), LSCG ("LSCGMsg"), ECHS ("HypnoMsg") and friends.
//
//   bot  -> everyone   ping     { ver }                       "anyone runnin' the companion?"
//   ext  -> bot        hello    { ver }                       "I am!"
//   bot  -> ext        welcome  { ver, proto, name, staff }   "howdy, here's who you are to me"
//   bot  -> ext        state    { state }                     your roles, keys, switches and numbers (v2)
//   ext  -> bot        cmd      { text }                      a command, same as typin' ?stats
//   bot  -> ext        reply    { text, id, part, of }        an answer to a command
//   bot  -> ext        notice   { text, id, part, of }        anything I'd normally beep or whisper
//   bot  -> ext        ask      { kind, text, id }            a yes/no question; the answer is a plain "yes"/"no" cmd (v2)
//   bot  -> ext        doc      { text, id, part, of, kind, who, about }
//                                                             a staff lookup about somebody else, for the Office (v2)
//   bot  -> ext        choose   { text, choices, id }         an application question with buttons; the answer is a plain cmd (v2)
//   bot  -> ext        outfit   { slot, label, data, keys, why, id }
//                                                             "put on your farm outfit?" (data = the saved outfit) (v2)
//   bot  -> ext        outfitBack { why }                     change back into your own clothes (v2)
//   ext  -> bot        outfitSave { slot, data, items, locks } a proprietor saves what they're wearin' (v2)
//   ext  -> bot        outfitAnswer { answer, slot, locks }   worn / declined / back (v2)
//   ext  -> bot        bye      {}                            extension turned off
//
// Older Companions ignore the v2 types, and older bots never send them, so either side can update first.

export const FARM_MSG = "FarmhandMsg";
export const PROTOCOL = 2;

export function makeMsg(type, data = {}, target) {
  const m = { Content: FARM_MSG, Type: "Hidden", Dictionary: { v: PROTOCOL, type, ...data } };
  if (target) m.Target = target;
  return m;
}

// returns { from, type, ...data } for one of ours, or null for anything else
export function readMsg(data) {
  if (!data || data.Type !== "Hidden" || data.Content !== FARM_MSG) return null;
  const d = data.Dictionary;
  if (!d || typeof d !== "object" || Array.isArray(d) || typeof d.type !== "string") return null;
  return { ...d, from: data.Sender };
}
