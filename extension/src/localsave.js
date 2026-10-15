// YOUR SETTINGS, SAVED AS A FILE (Oct 15). Laynie: "i mean better storage than what tampermonkey has". Everything the
// Companion remembers lives in the browser you're using (your drawn body, the toggles, your messes, the memory log),
// so a new browser starts from nothing and a cleared browser loses it. Now you can pick a folder on this computer once
// (Toggles → This panel), and every minute the Companion keeps a copy of it all there: one file,
// farmhand-companion-<your number>.json. "Load my settings from a file" puts one back, in any browser.
// After a crash the memory log is in that file too, so it can be read without pasting.
// Chrome and Edge can save to a folder; other browsers can still load a file.
const W = window;
const MINE = /^(fhc-|farmhand-)/;
const S = { db: null, dir: null, perm: "none", at: 0, last: "", err: "" };
let onChange = () => {};

function db() {
  if (S.db) return S.db;
  S.db = new Promise((ok, no) => {
    try {
      const rq = W.indexedDB.open("farmhand-companion", 1);
      rq.onupgradeneeded = () => { try { rq.result.createObjectStore("kv"); } catch (e) { /* there */ } };
      rq.onsuccess = () => ok(rq.result); rq.onerror = () => no(rq.error);
    } catch (e) { no(e); }
  });
  S.db.catch(() => { S.db = null; });
  return S.db;
}
async function get(k) { const d = await db(); return new Promise((ok, no) => { const rq = d.transaction("kv").objectStore("kv").get(k); rq.onsuccess = () => ok(rq.result); rq.onerror = () => no(rq.error); }); }
async function put(k, v) { const d = await db(); return new Promise((ok, no) => { const tx = d.transaction("kv", "readwrite"); tx.objectStore("kv").put(v, k); tx.oncomplete = () => ok(true); tx.onerror = () => no(tx.error); }); }

const me = () => (W.Player && W.Player.MemberNumber) || 0;
const fileName = () => "farmhand-companion-" + (me() || "player") + ".json";
function snapshot(version) {
  const data = {};
  try { for (let i = 0; i < W.localStorage.length; i++) { const k = W.localStorage.key(i); if (k && MINE.test(k)) data[k] = W.localStorage.getItem(k); } } catch (e) { /* fine */ }
  return { kind: "farmhand-companion", v: 1, member: me(), version, data };
}
async function writeNow(version, force) {
  if (!S.dir || S.perm !== "granted" || !me()) return;
  const snap = snapshot(version), body = JSON.stringify(snap.data);
  if (!force && body === S.last) return;
  const errWas = S.err;
  try {
    const fh = await S.dir.getFileHandle(fileName(), { create: true }), w = await fh.createWritable();
    await w.write(JSON.stringify(Object.assign(snap, { savedAt: new Date().toISOString() }), null, 1)); await w.close();
    S.last = body; S.at = Date.now(); S.err = "";
  } catch (e) { S.err = String((e && e.message) || e); if (/permission|not allowed/i.test(S.err)) S.perm = "prompt"; }
  if (force || S.err !== errWas) onChange();   // (not every minute: the panel isn't redrawn under your fingers for a routine save)
}

export function localSaveState() {
  return { can: typeof W.showDirectoryPicker === "function", folder: S.dir ? S.dir.name : "", perm: S.perm, at: S.at, err: S.err, file: fileName() };
}
export async function localSavePick(version) {
  try {
    const d = await W.showDirectoryPicker({ id: "bnb-farm", mode: "readwrite" });
    S.dir = d; S.perm = "granted"; await put("dir", d); await writeNow(version, true);
  } catch (e) { if (!/abort/i.test(String(e && e.name))) S.err = String((e && e.message) || e); }
  onChange();
}
export async function localSaveReconnect(version) {
  try { S.perm = await S.dir.requestPermission({ mode: "readwrite" }); if (S.perm === "granted") await writeNow(version, true); } catch (e) { S.err = String((e && e.message) || e); }
  onChange();
}
export function localSaveNow(version) { return writeNow(version, true); }
export function localSaveLoad(say) {
  const inp = W.document.createElement("input"); inp.type = "file"; inp.accept = ".json,application/json";
  inp.onchange = () => {
    const f = inp.files && inp.files[0]; if (!f) return;
    f.text().then((t) => {
      let d = null; try { d = JSON.parse(t); } catch (e) { /* not JSON */ }
      if (!d || d.kind !== "farmhand-companion" || !d.data || typeof d.data !== "object") { say && say("That file isn't a Farmhand Companion save."); return; }
      const keys = Object.keys(d.data).filter((k) => MINE.test(k) && typeof d.data[k] === "string");
      if (!W.confirm("Load these settings?\n\n" + f.name + (d.savedAt ? "\nsaved " + new Date(d.savedAt).toLocaleString() : "") + "\n" + keys.length + " things in it.\n\nWhat this browser has now is replaced, and the page reloads.")) return;
      try {
        for (let i = W.localStorage.length - 1; i >= 0; i--) { const k = W.localStorage.key(i); if (k && MINE.test(k) && !(k in d.data)) W.localStorage.removeItem(k); }
        for (const k of keys) W.localStorage.setItem(k, d.data[k]);
      } catch (e) { say && say("Couldn't load it: " + ((e && e.message) || e)); return; }
      W.location.reload();
    });
  };
  inp.click();
}
export function initLocalSave(version, changed) {
  if (typeof changed === "function") onChange = changed;
  get("dir").then(async (d) => {
    if (!d) return; S.dir = d;
    try { S.perm = await d.queryPermission({ mode: "readwrite" }); } catch (e) { S.perm = "prompt"; }
    onChange(); if (S.perm === "granted") writeNow(version, true);
  }).catch(() => { /* no database: fine */ });
  setInterval(() => { writeNow(version, false); }, 60000);
}
