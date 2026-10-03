// How the bot and the Farmhand Companion extension talk to each other.
//
// Every message is a BC "Hidden" chat message: players never see it, only
// code does. Content is always FARM_MSG so we can tell ours apart from
// BCX ("BCXMsg"), BC+ ("BCP"), LSCG ("LSCGMsg") and friends.
//
//   bot  -> everyone   ping     { ver }                 "anyone runnin' the companion?"
//   ext  -> bot        hello    { ver }                 "I am!"
//   bot  -> ext        welcome  { ver, name, staff }    "howdy, here's who you are to me"
//   ext  -> bot        cmd      { text }                a command, same as typin' ?stats
//   bot  -> ext        reply    { text, id, part, of }  an answer to a command
//   bot  -> ext        notice   { text, id, part, of }  anything I'd normally beep or whisper
//   ext  -> bot        bye      {}                      extension turned off

export const FARM_MSG = "FarmhandMsg";
export const PROTOCOL = 1;

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
