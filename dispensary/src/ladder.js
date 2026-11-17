/* WHAT'S IN THIS FILE (ladder.js)
   Who may dose you. Your rung lets in everybody above it on the ladder (config.js): only me, my owner, lovers, the farm,
   whitelist, friends, everyone but my blacklist, everyone. The farm is the farm girl, the proprietors, and whoever she
   says is staff.
*/
import { BOT, PROPRIETORS, LADDER } from "./config.js";
import { st } from "./store.js";

const W = window;
const has = (list, mn) => Array.isArray(list) && list.some((x) => (typeof x === "object" && x ? x.MemberNumber : x) === mn);

export const isFarm = (mn) => mn === BOT || PROPRIETORS.includes(mn) || st().farm.includes(mn);
function isOwner(mn) {
  const P = W.Player;
  try { if (P && typeof P.IsOwnedByMemberNumber === "function" && P.IsOwnedByMemberNumber(mn)) return true; } catch (e) { /* below */ }
  return !!(P && P.Ownership && P.Ownership.MemberNumber === mn);
}
function isLover(mn) {
  const P = W.Player;
  try { if (P && typeof P.IsLoverOfMemberNumber === "function" && P.IsLoverOfMemberNumber(mn)) return true; } catch (e) { /* below */ }
  return has(P && P.Lovership, mn);
}

// the closest rung somebody stands on (0 = you), or 7 for somebody on your blacklist
export function rungOf(mn) {
  const P = W.Player;
  if (!P || mn === P.MemberNumber) return 0;
  if (has(P.BlackList, mn)) return 7;
  if (isOwner(mn)) return 1;
  if (isLover(mn)) return 2;
  if (isFarm(mn)) return 3;
  if (has(P.WhiteList, mn)) return 4;
  if (has(P.FriendList, mn)) return 5;
  return 6;
}
export const rungIndex = (id) => Math.max(0, LADDER.findIndex((r) => r.id === id));
export function allowed(mn, rung) { return typeof mn === "number" && rungOf(mn) <= rungIndex(rung || st().who); }
export const ladderWho = () => (LADDER[rungIndex(st().who)] || LADDER[0]).who;
