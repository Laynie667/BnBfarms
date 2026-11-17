/* WHAT'S IN THIS FILE (config.js)
   The Dispensary's fixed numbers: who the farm is, where your settings live, and the ladder of who may dose you.
*/
export const BOT = 260239;                    // the farm girl
export const PROPRIETORS = [221397, 232922];  // Laynie and Alexia
export const KEY = "FarmhandDispensary";      // Player.ExtensionSettings key: saved on your account, not one browser
export const LSCG_ID = "farmhand-dispensary"; // our name in LSCG's extension list

// WHO CAN DOSE YOU (Laynie, Nov 16: "the tier list as a drop down, all the way to 'allow everyone' and allow everyone
// including blacklist. The farm should sit under lover, but above friend."). Each rung lets in everybody above it.
export const LADDER = [
  { id: "me", label: "Only me", who: "only you" },
  { id: "owner", label: "My owner", who: "you and your owner" },
  { id: "lovers", label: "+ my lovers", who: "your owner and your lovers" },
  { id: "farm", label: "+ the farm", who: "your owner, your lovers and the farm" },
  { id: "white", label: "+ my whitelist", who: "your owner, lovers, the farm and your whitelist" },
  { id: "friends", label: "+ my friends", who: "your owner, lovers, the farm, your whitelist and your friends" },
  { id: "all", label: "Everyone but my blacklist", who: "anybody who isn't on your blacklist" },
  { id: "any", label: "Everyone, blacklist too", who: "anybody at all, your blacklist too" },
];
export const DEFAULT_RUNG = "farm";

// REAL TIME costs more (Laynie, Nov 16: "a real time penalty percentage added on top for real time usage, and that can
// be made transparent in the tip on hover")
export const PENALTY = 50;
