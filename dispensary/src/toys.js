/* WHAT'S IN THIS FILE (toys.js)
   THE NIPPLE TOYS IN THE GAME (Nov 18; the list is toys-list.js). Each goes in the game's own nipple slot (ItemNipples),
   so they're in the normal item menu, the drawn breasts carry them like any nipple item, and the game's remotes,
   locks and settings work on them:
   • The beads keep the game's bead count, the pump-ups its inflate and vibrate settings, the vibrators its remote, the
     lock plug takes a lock: each copies its game toy's own settings.
   • Whoever owns the game's toy owns its nipple version.
   • Only into nipples that are open (the Nipple Dilator, the leeches, a trained stretch); once one's in it holds them open.
     (Nov 19 fix, Laynie: "it doesn't recognize my open nipples". The game's item menu doesn't ask about you: it asks
     about a stand-in copy of you with the nipple slot left off (InventoryDisallow), and that copy has no member
     number, so every toy said they were shut. Now we remember who the copy stands for while the game checks.)
   • The pictures are the repo's (toys/v1), drawn by tools/nipple-toys-art.js at each breast size. Only people with the
     Dispensary see them; in chat, everybody reads the toy's name.
*/
import { TOYS, TOY_BY, toyIn } from "./toys-list.js";

const W = window;
export const TOY_HOST = "https://raw.githubusercontent.com/Laynie667/BnBfarms/main/toys/v1/";
const host = () => (typeof W.__farmToyHost === "string" ? W.__farmToyHost : TOY_HOST);   // (a local copy, in a test)
const ours = (group, name) => group === "ItemNipples" && !!TOY_BY[name];
/* global AssetFemale3DCG, AssetFemale3DCGExtended */
const defsAll = () => W.AssetFemale3DCG || (typeof AssetFemale3DCG !== "undefined" ? AssetFemale3DCG : null);
const extAll = () => W.AssetFemale3DCGExtended || (typeof AssetFemale3DCGExtended !== "undefined" ? AssetFemale3DCGExtended : null);

// the game's own settings for each kind: copied off its toy
function extOf(T) {
  if (T.states === "typed") return { Archetype: "typed", CopyConfig: { GroupName: T.from[0], AssetName: T.from[1] },
    DialogPrefix: { Header: T.from[0] + T.from[1] + "Select", Option: T.from[0] + T.from[1], Chat: T.from[0] + T.from[1] + "Set" } };
  if (T.vibe === "modular") return { Archetype: "modular", CopyConfig: { GroupName: "ItemButt", AssetName: "InflVibeButtPlug" } };
  if (T.vibe) return { Archetype: "vibrating" };
  return null;
}
function defOf(T, orig) {
  const o = orig && typeof orig === "object" ? orig : {};
  const d = { Name: T.id, Value: -1, Random: false, Time: o.Time || 10,
    Prerequisite: ["AccessBreast", "FarmNipsOpen"], Hide: ["ItemNipplesPiercings"], Effect: T.vibe ? ["UseRemote", "Wiggling"] : ["Wiggling"],
    PoseMapping: { AllFours: "Hide", Hogtied: "Hide" },   // (the breasts are drawn another way there)
    Extended: !!extOf(T),
    Layer: [Object.assign({ Name: "Toy", AllowColorize: false }, T.states === "pump" ? { CreateLayerTypes: ["f"] } : {})] };
  if (o.Audio) d.Audio = o.Audio;
  if (Array.isArray(o.ExpressionTrigger)) d.ExpressionTrigger = o.ExpressionTrigger;
  if (Array.isArray(o.Fetish)) d.Fetish = o.Fetish;
  if (T.states === "typed") d.CreateLayerTypes = ["typed"];
  if (T.lock) Object.assign(d, { AllowLock: true, IsRestraint: true, Difficulty: o.Difficulty || 50, RemoveTime: o.RemoveTime || 50 });
  return d;
}
function describe() {
  const G = W.AssetGroupMap && W.AssetGroupMap.get("ItemNipples"); if (!G) return;
  for (const A of G.Asset || []) { const T = TOY_BY[A.Name]; if (T) A.Description = T.label; }
}
// into the game's nipple slot (again after the game loads its items over)
export function addToys() {
  const G = W.AssetGroupMap && W.AssetGroupMap.get("ItemNipples"), defs = defsAll();
  if (!G || typeof W.AssetAdd !== "function" || !Array.isArray(defs)) return false;
  const gdef = defs.find((g) => g && g.Group === "ItemNipples"); if (!gdef) return false;
  const EXT = extAll() || {};
  let added = 0;
  for (const T of TOYS) {
    if ((G.Asset || []).some((a) => a && a.Name === T.id)) continue;
    const og = defs.find((g) => g && g.Group === T.from[0]), orig = og && Array.isArray(og.Asset) ? og.Asset.find((a) => a && (a.Name || a) === T.from[1]) : null;
    const x = extOf(T); if (x) { EXT.ItemNipples = EXT.ItemNipples || {}; EXT.ItemNipples[T.id] = x; }
    try { W.AssetAdd(G, defOf(T, orig), EXT, gdef); added++; } catch (e) { console.warn("[Dispensary] couldn't add the " + T.label, e); }
  }
  describe();
  return added > 0 || TOYS.every((T) => (G.Asset || []).some((a) => a && a.Name === T.id));
}

const SHUT = "PrerequisiteFarmNipsShut";
const SHUT_TEXT = "Those nipples aren't open. A Nipple Dilator, the nipple leeches or /dispensary nips open opens them up first.";
// who the game's really askin' about: it checks prerequisites on a stand-in copy of them (InventoryDisallow)
let asking = null;
// deps: { nipsOpen, openOf } (nipples.js)
export function initToys(mod, deps) {
  const hook = (fn, pri, f) => { try { if (typeof W[fn] === "function") mod.hookFunction(fn, pri, f); } catch (e) { console.warn("[Dispensary] nipple toys can't hook " + fn + ":", e); } };
  // where their pictures are: the repo's
  hook("AssetBaseURL", 0, (args, next) => { const A = args[6]; return A && ours(args[2], A.Name) ? host() + "ItemNipples/" + (args[3] ? args[3] + "/" : "") : next(args); });
  hook("AssetGetPreviewPath", 0, (args, next) => { const A = args[0]; return A && A.Group && ours(A.Group.Name, A.Name) ? host() + "ItemNipples/Preview" : next(args); });
  hook("AssetBuildDescription", 0, (args, next) => { const r = next(args); try { describe(); } catch (e) { /* next time */ } return r; });
  hook("AssetLoadAll", 0, (args, next) => { const r = next(args); try { addToys(); } catch (e) { /* fine */ } return r; });
  // whoever owns the game's toy owns its nipple version
  hook("InventoryAvailable", 0, (args, next) => { const T = args[2] === "ItemNipples" && TOY_BY[args[1]]; return T ? next([args[0], T.from[1], T.from[0], ...args.slice(3)]) : next(args); });
  // only into open nipples (or in place of one that's in already)
  hook("InventoryDisallow", 0, (args, next) => { const was = asking; asking = args[0] || null; try { return next(args); } finally { asking = was; } });
  hook("InventoryPrerequisiteMessage", 0, (args, next) => {
    if (args[1] !== "FarmNipsOpen") return next(args);
    try {
      const C = asking || args[0];   // (the real one, not the game's stand-in copy)
      if (!C) return "FarmNipsShut";
      if (toyIn(C)) return "";
      const n = typeof C.IsPlayer === "function" && C.IsPlayer() ? deps.nipsOpen() : C.MemberNumber ? deps.openOf(C.MemberNumber) : 0;
      return n > 0 ? "" : "FarmNipsShut";
    } catch (e) { return "FarmNipsShut"; }
  });
  hook("InterfaceTextGet", 0, (args, next) => (args[0] === SHUT ? SHUT_TEXT : next(args)));
  // in chat, the toy's name for everybody (without the Dispensary, the game can't name it)
  hook("ServerSend", 0, (args, next) => {
    try {
      const d = args[1];
      if (args[0] === "ChatRoomChat" && d && Array.isArray(d.Dictionary) && d.Dictionary.some((e) => e && e.Tag && ours(e.GroupName, e.AssetName))) {
        const D = d.Dictionary.map((e) => (e && e.Tag && ours(e.GroupName, e.AssetName) ? { Tag: e.Tag, Text: TOY_BY[e.AssetName].label.toLowerCase() } : e));
        args = [args[0], Object.assign({}, d, { Dictionary: D }), ...args.slice(2)];
      }
    } catch (e) { /* fine */ }
    return next(args);
  });
  // in now if the game's ready, else as soon as it is
  if (!addToys()) { let n = 0; const t = setInterval(() => { if (addToys() || ++n > 120) clearInterval(t); }, 500); }
}
