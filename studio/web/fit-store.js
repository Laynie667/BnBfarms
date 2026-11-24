/* THE FITS, SAVED (studio/web/fit-store.js, Nov 23; the suggestion box's #44, Laynie: "fitting in background, and keeping
   saved might help alot"). The drawn body fits every worn piece to her breasts and belly once and keeps it, but only for
   as long as the page is open: every reload, every relog, it all had to be fitted again, and that's the freeze. This
   keeps the fitted drawings in the browser's own saved space (IndexedDB, on this computer only, nothin' sent anywhere),
   so the next time the page opens they're ready.

   window.FarmFitStore({ stamp, maxMB, preloadMB, days }) makes one. The body engine (body-engine.js) is handed it as
   host.store and asks it two things: take(name) (a fitted drawing saved under that name, or undefined) and keep(name,
   drawing, where) (save this one). The names are the engine's own, what a drawing is made from.
     stamp      the drawing code's version and the game's (the Companion's: a fingerprint of the drawing files, built in,
                and GameVersion). Anything saved under another stamp is thrown away unread: a change to how pieces are
                fitted, or a game update, starts fresh, so nothing is ever drawn from an old fit.
     maxMB      how much it may keep on disk, all told (the oldest-used go first past it)
     preloadMB  how much of it is opened up when the page starts, most recently used first (the rest waits on disk)
     days       a fit not used in this long is thrown away
   Plus what the engine has learned about the pieces somebody wears, by whose body it is: learnedFor(id), saveLearned(id, o).
   Nothin' here ever stops the drawing: a browser without the space, a full disk, a private window, it just doesn't save.
*/
(() => {
"use strict";
const DB_NAME = "farmhand-fits", DB_VER = 1;
// the same short name the engine makes (hashKey in body-engine.js): the full name is kept with each and checked too
const hashKey = (s) => { let h1 = 0xdeadbeef, h2 = 0x41c6ce57; for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909); h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36); };
const idle = (f) => { try { if (typeof window.requestIdleCallback === "function") { window.requestIdleCallback(f, { timeout: 3000 }); return; } } catch (e) { /* not this browser */ } setTimeout(f, 200); };
const req = (r) => new Promise((ok, no) => { r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
const done = (tx) => new Promise((ok, no) => { tx.oncomplete = () => ok(); tx.onerror = () => no(tx.error); tx.onabort = () => no(tx.error); });

window.FarmFitStore = function (opts) {
  const o = Object.assign({ stamp: "", maxMB: 160, preloadMB: 48, days: 21 }, opts || {});
  const S = { db: null, ready: false, off: false, mem: new Map(), learned: new Map(), queue: [], busy: false, bytes: 0, count: 0,
    taken: 0, kept: 0, waiting: [], touched: new Set(), why: "" };
  const offWith = (why) => { S.off = true; S.why = String(why && (why.name && why.name !== "Error" ? why.name : why.message) || why || "off").slice(0, 80); S.queue.length = 0; };
  const whenReady = (f) => { if (S.ready) { try { f(); } catch (e) { /* theirs */ } } else S.waiting.push(f); };
  const nowReady = () => { S.ready = true; for (const f of S.waiting.splice(0)) { try { f(); } catch (e) { /* theirs */ } } };

  // ── opening it, and bringing the most recent fits in ──
  (async () => {
    try {
      const idb = window.indexedDB; if (!idb) throw new Error("no saved space in this browser");
      const open = idb.open(DB_NAME, DB_VER);
      open.onupgradeneeded = () => { const db = open.result;
        if (!db.objectStoreNames.contains("fits")) db.createObjectStore("fits", { keyPath: "h" }).createIndex("at", "at");
        if (!db.objectStoreNames.contains("learned")) db.createObjectStore("learned", { keyPath: "id" }); };
      S.db = await req(open);
      S.db.onversionchange = () => { try { S.db.close(); } catch (e) { /* fine */ } offWith("closed"); };
      const tx = S.db.transaction(["fits", "learned"], "readonly"), all = await req(tx.objectStore("fits").getAll()), lr = await req(tx.objectStore("learned").getAll());
      const cut = Date.now() - o.days * 86400000, stale = [], fresh = [];
      for (const r of all) (r && r.stamp === o.stamp && r.at > cut ? fresh : stale).push(r);
      for (const r of lr) if (r && r.stamp === o.stamp && r.o) S.learned.set(r.id, r.o);
      fresh.sort((a, b) => b.at - a.at);
      let open2 = 0;
      for (const r of fresh) {
        S.count++; S.bytes += r.bytes || 0;
        if (r.f) { S.mem.set(r.h, { k: r.k, f: true }); continue; }
        if (!r.blob || open2 + (r.w * r.ht * 4) > o.preloadMB * 1e6) continue;
        try { const bmp = await createImageBitmap(r.blob); open2 += bmp.width * bmp.height * 4; S.mem.set(r.h, { k: r.k, bmp, tx: r.tx, ty: r.ty, mx: r.mx, my: r.my, ww: r.ww, wh: r.wh }); }
        catch (e) { stale.push(r); }   // (one that won't open: gone)
      }
      if (stale.length) { const wt = S.db.transaction("fits", "readwrite"), st = wt.objectStore("fits"); for (const r of stale) st.delete(r.h); await done(wt).catch(() => {}); }
      // what wasn't asked for in the first ten minutes goes back to disk only (it's memory)
      setTimeout(() => { for (const [h, e] of S.mem) if (e.bmp) { try { e.bmp.close(); } catch (er) { /* fine */ } S.mem.delete(h); } }, 600000);
      nowReady();
    } catch (e) { offWith(e); nowReady(); }
  })();

  // ── a fit, if it's saved ──
  function take(k) {
    if (!S.ready || typeof k !== "string") return undefined;
    const h = hashKey(k), e = S.mem.get(h); if (!e || e.k !== k) return undefined;
    S.mem.delete(h); S.touched.add(h); S.taken++; touchSoon();
    if (e.f) return false;
    const c = document.createElement("canvas"); c.width = e.bmp.width; c.height = e.bmp.height;
    try { c.getContext("2d").drawImage(e.bmp, 0, 0); } catch (er) { return undefined; } finally { try { e.bmp.close(); } catch (er) { /* fine */ } }
    return { cv: c, tx: e.tx, ty: e.ty, mx: e.mx, my: e.my, ww: e.ww, wh: e.wh };
  }
  // ── a fit, saved (in the page's quiet moments, one at a time) ──
  function keep(k, cv, where) {
    if (S.off || typeof k !== "string") return;
    if (S.queue.length >= 400) return;   // (a flood: the rest are fitted again next time, that's all)
    S.queue.push([k, cv, where || {}]); if (!S.busy) { S.busy = true; idle(next); }
  }
  async function next() {
    try {
      while (S.queue.length && !S.off) {
        if (!S.db) { if (!S.ready) { await new Promise((r) => whenReady(r)); continue; } break; }
        const [k, cv, w] = S.queue.shift(), h = hashKey(k), at = Date.now();
        let rec;
        if (cv === false) rec = { h, k, stamp: o.stamp, at, f: true, bytes: 0 };
        else {
          const blob = await new Promise((ok) => { try { cv.toBlob((b) => ok(b), "image/png"); } catch (e) { ok(null); } });   // (a picture from a site that didn't give leave to read it can't be saved: fine)
          if (!blob) continue;
          rec = { h, k, stamp: o.stamp, at, f: false, tx: w.tx || 0, ty: w.ty || 0, mx: w.mx, my: w.my, ww: w.ww || cv.width, wh: w.wh || cv.height, w: cv.width, ht: cv.height, bytes: blob.size, blob };
        }
        const tx = S.db.transaction("fits", "readwrite"); tx.objectStore("fits").put(rec); await done(tx);
        S.kept++; S.count++; S.bytes += rec.bytes;
        if (S.bytes > o.maxMB * 1e6) await prune();
        await new Promise((r) => idle(r));   // (one a quiet moment)
      }
    } catch (e) { if (e && e.name === "QuotaExceededError") offWith(e); }
    finally { S.busy = false; if (S.queue.length && !S.off) { S.busy = true; idle(next); } }
  }
  // past the room it's allowed: the ones used longest ago go, down to three quarters
  async function prune() {
    const tx = S.db.transaction("fits", "readwrite"), st = tx.objectStore("fits"), cur = st.index("at").openCursor();
    const goal = o.maxMB * 1e6 * 0.75;
    await new Promise((ok) => { cur.onsuccess = () => { const c = cur.result; if (!c || S.bytes <= goal) return ok(); S.bytes -= c.value.bytes || 0; S.count--; c.delete(); c.continue(); }; cur.onerror = () => ok(); });
    await done(tx).catch(() => {});
  }
  // the ones used again: marked used now, so they're the last to go
  let touchT = null;
  function touchSoon() { if (touchT || S.off) return; touchT = setTimeout(async () => { touchT = null; const hs = [...S.touched]; S.touched.clear(); if (!S.db || !hs.length) return;
    try { const tx = S.db.transaction("fits", "readwrite"), st = tx.objectStore("fits"); for (const h of hs) { const g = st.get(h); g.onsuccess = () => { const r = g.result; if (r) { r.at = Date.now(); st.put(r); } }; } await done(tx); } catch (e) { /* fine */ } }, 30000); }

  // ── what's been learned about somebody's pieces ──
  const learnedFor = (id) => S.learned.get(String(id)) || null;
  async function saveLearned(id, obj) {
    if (S.off || !S.db || !obj) return;
    S.learned.set(String(id), obj);
    try { const tx = S.db.transaction("learned", "readwrite"); tx.objectStore("learned").put({ id: String(id), stamp: o.stamp, at: Date.now(), o: obj }); await done(tx); } catch (e) { if (e && e.name === "QuotaExceededError") offWith(e); }
  }
  // ── for /farmmem, and for startin' over ──
  const stats = () => ({ on: !S.off && !!S.db, ready: S.ready, why: S.why, count: S.count, mb: Math.round(S.bytes / 1e5) / 10, open: S.mem.size, taken: S.taken, kept: S.kept, waiting: S.queue.length });
  async function clear() {
    for (const e of S.mem.values()) if (e.bmp) { try { e.bmp.close(); } catch (er) { /* fine */ } }
    S.mem.clear(); S.learned.clear(); S.queue.length = 0; S.bytes = 0; S.count = 0;
    if (!S.db) return;
    try { const tx = S.db.transaction(["fits", "learned"], "readwrite"); tx.objectStore("fits").clear(); tx.objectStore("learned").clear(); await done(tx); } catch (e) { /* fine */ }
  }
  return { take, keep, learnedFor, saveLearned, whenReady, ready: () => S.ready, stats, clear, hashKey };
};
})();
