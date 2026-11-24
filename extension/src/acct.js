/* WHAT'S IN THIS FILE (acct.js)
   EVERY ACCOUNT ITS OWN (Nov 24; Laynie: "per account config, users are reporting their alt characters receiving the
   sizes of their farm character, and marks on other accounts"). What the Companion remembers was kept in the browser
   under one name for everybody who logs in on it, so an alt on the same browser got the main's drawn body and the farm's
   sizes for it, the marks and messes the farm left, the farm's gear, the whistle home, the toggles. And a tab that logged
   out of one account and into another kept the first one's farm in memory.
   • LS: the browser's storage, but each account's under its own name (the key, then "@" and the member number). The few
     things that belong to the computer, not to anybody (the memory log, the chat log, the drops, which panel sections
     are folded, the store's shelf), stay shared: DEVICE.
   • What was saved before this, under the shared name, goes to the first account that reads it after the update (most
     people log into their main first), and is gone from the shared name, so no other account picks it up after.
   • onAccount(f): f runs when a different account logs in on this tab (and once for the first), so a module that keeps
     somethin' in memory loads that account's own.
*/
const W = window;
const DEVICE = new Set(["farmhand-memlog", "farmhand-memfast", "farmhand-chatlog", "fhc-drops", "fhc-folded", "fhc-store", "fhc-gear-names", "farmhand-drawn-body-see"]);
const me = () => (W.Player && typeof W.Player.MemberNumber === "number" && W.Player.MemberNumber > 0 ? W.Player.MemberNumber : 0);
const scoped = (k) => !DEVICE.has(k) && !/@\d+$/.test(k);
// the name a key is kept under for whoever's logged in (nobody yet: the shared name, read-only in effect)
export const acctKey = (k) => (scoped(k) && me() ? k + "@" + me() : k);
function store() { try { return W.localStorage; } catch (e) { return null; } }
export const LS = {
  getItem(k) {
    const s = store(); if (!s) return null;
    if (!scoped(k) || !me()) return scoped(k) ? null : s.getItem(k);   // (nobody logged in: nothin' of anybody's)
    const ak = acctKey(k), v = s.getItem(ak);
    if (v !== null) return v;
    // saved before Nov 24 under the shared name: the first account to read it after the update keeps it
    const old = s.getItem(k);
    if (old !== null) { try { s.setItem(ak, old); s.removeItem(k); } catch (e) { /* full: it stays shared a while */ } return old; }
    return null;
  },
  setItem(k, v) { const s = store(); if (!s) return; if (scoped(k) && !me()) return; s.setItem(acctKey(k), v); },
  removeItem(k) { const s = store(); if (!s) return; if (scoped(k) && !me()) return; s.removeItem(acctKey(k)); },
};
// a different account on this tab: whoever wants to know, loads that account's own
const subs = [];
let was = 0;
export function onAccount(f) { if (typeof f === "function") subs.push(f); }
export function accountCheck() {
  const now = me(); if (!now || now === was) return false;
  const first = !was; was = now;
  for (const f of subs) { try { f(now, first); } catch (e) { console.warn("[Farmhand Companion] account change:", e); } }
  return true;
}
export function initAcct() { accountCheck(); setInterval(accountCheck, 1500); }
export const acctNow = () => was;
