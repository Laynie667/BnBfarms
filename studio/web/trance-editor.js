/* WHAT'S IN THIS FILE (studio/web/trance-editor.js)
   THE TRANCE EDITOR (Nov 25). Laynie: "a session editor so I can add real hypnotic scripts, set the pacing, and choose a
   range for the binaurals, like theta and delta"; "a format … with labels, so they can be combined in different ways";
   "probably with me, with pushes to the bot". http://localhost:4780/trance on the bot's PC.
   The library is one text file of labelled blocks (shared/trance-script.js says how it reads). The form on the middle
   writes a block's text, the text on the right can be written or pasted straight, and both stay the same thing.
   Save keeps it here (studio/trance/library.txt, the last 30 saves in studio/trance/old/); Push to the bot makes it
   what the bot runs (it looks every minute, or ?trancelib pull). "Try it" plans a session the way the bot would for
   somebody, and plays it with its look and beats, sped up.
*/
import * as T from "/__shared/trance-script.js";
import { STARTER } from "/__shared/trance-starter.js";

const $ = (s, el) => (el || document).querySelector(s);
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "class") el.className = v;
    else if (k === "value") el.value = v;
    else if (k === "checked") el.checked = !!v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const k of kids.flat(9)) if (k != null && k !== false) el.appendChild(typeof k === "string" || typeof k === "number" ? document.createTextNode(String(k)) : k);
  return el;
}
const S = { text: "", lib: { blocks: [], errors: [], warnings: [] }, sel: -1, saveTimer: null, play: null };
const status = (t) => { $("#status").textContent = t; };
const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// ── the text and the blocks ───────────────────────────────────
function reparse() {
  S.lib = T.parseLibrary(S.text);
  if (S.sel >= S.lib.blocks.length) S.sel = S.lib.blocks.length - 1;
}
function setText(text, opts) {
  opts = opts || {};
  S.text = String(text).replace(/\r\n?/g, "\n");
  reparse();
  if (!opts.fromBox) $("#text").value = S.text;
  renderList(); renderProblems(); renderSessions();
  if (!opts.keepForm) renderForm();
  if (!opts.quiet) later();
}
// where a block sits in the text: from its === line to its last line that isn't blank or a note
function range(i) {
  const rows = S.text.split("\n"), b = S.lib.blocks[i];
  const start = b.at - 1, next = i + 1 < S.lib.blocks.length ? S.lib.blocks[i + 1].at - 1 : rows.length;
  let end = next - 1;
  while (end > start && (!rows[end].trim() || /^\s*(#|\/\/)/.test(rows[end]))) end--;
  return { rows, start, end };
}
const cur = () => (S.sel >= 0 ? S.lib.blocks[S.sel] : null);
const clone = (b) => JSON.parse(JSON.stringify(b));
// write one block back into the text (the form's way): only its own lines change
function writeBlock(b, opts) {
  const { rows, start, end } = range(S.sel);
  rows.splice(start, end - start + 1, ...T.formatBlock(b).split("\n"));
  setText(rows.join("\n"), { keepForm: !(opts && opts.form) });
}
function edit(fn, opts) { const b = clone(cur()); fn(b); b.labels = b.labels || {}; writeBlock(b, opts); }
function addBlock(kind) {
  const n = S.lib.blocks.filter((b) => b.kind === kind).length + 1;
  const tpl = {
    induction: "pace: 30s\nbeats: alpha 10 → theta 6 over 3m\nlook: haze 20%, spiral slow\n\nLet your eyes go heavy, {name}…",
    deepener: "level: deep\npace: 35s\nbeats: theta → delta 3 over 4m\nlook: haze 50%, rings on, words drift\ndeeper: +20\n\nDeeper now, {name}. Every breath takes you further down.",
    convincer: "level: deep, nhl\npace: 30s\n\nYour hands are so heavy, {name}. Too heavy to lift.",
    suggestion: "pace: 35s\npick: 2\n\nEvery time you {sound}, you feel a little warm rush.",
    trigger: "level: deep, nhl\ntrigger: good {animal}\ndoes: say \"{sound}~\"\n\nAnd somethin' to keep: whenever anyone calls you a good {animal}…",
    wake: "pace: 15s\nbeats: → alpha 10 over 1m\nlook: clear\n\nCountin' up now. Three, two, one, eyes open, {name}.",
    compulsion: "level: deep, nhl\nwhen: pat\ndoes: pose {low} → moo\nwaits: 2s\nchance: 10%\n\nA pat on your head, and sometimes you just melt, right down {low}.",
    hangon: "level: deep, nhl\neffect: mootalk\nlasts: 30m\n\nFor a while after you come up, your {sound} keeps slippin' out between your words.",
    slip: "pull: 40\n\n{sound}~\nGood {animal}s don't need words.",
    nudge: "pull: 30\n\nSo heavy, {name}. Your eyes want to close.",
    session: "level: deep\ninduction: any\ndeepener: any\nsuggestion: any 2\ntrigger: any\nwake: any",
  }[kind];
  setText(S.text.replace(/\s*$/, "") + "\n\n=== " + kind + ": New " + kind + (n > 1 ? " " + n : "") + "\n" + tpl + "\n", { keepForm: true });
  S.sel = S.lib.blocks.length - 1; renderList(); renderForm();
}
function removeBlock() {
  const b = cur(); if (!b || !confirm("Take out " + b.kind + ": " + b.name + "?")) return;
  const { rows, start, end } = range(S.sel);
  rows.splice(start, end - start + 1);
  S.sel = -1; setText(rows.join("\n").replace(/\n{3,}/g, "\n\n"));
}
function copyBlock() {
  const b = clone(cur()); if (!b) return;
  b.name = b.name + " copy";
  setText(S.text.replace(/\s*$/, "") + "\n\n" + T.formatBlock(b) + "\n", { keepForm: true });
  S.sel = S.lib.blocks.length - 1; renderList(); renderForm();
}

// ── saving and pushing ───────────────────────────────────────
function later() { status("not saved yet…"); clearTimeout(S.saveTimer); S.saveTimer = setTimeout(save, 1500); }
async function save() {
  clearTimeout(S.saveTimer);
  try { const r = await fetch("/__studio/trance/library.txt", { method: "POST", body: S.text }); status(r.ok ? "saved " + time() : "couldn't save (" + r.status + ")"); }
  catch (e) { status("couldn't save: is the studio still running?"); }
}
async function push() {
  const e = S.lib.errors.length;
  if (e && !confirm(e + " block" + (e === 1 ? " has a mistake" : "s have mistakes") + " (see the list under the text). The bot skips those and runs the rest. Push anyway?")) return;
  try {
    const r = await fetch("/__studio/trance/publish", { method: "POST", body: S.text, headers: { "x-trance-info": JSON.stringify({ blocks: S.lib.blocks.length, errors: e }) } });
    if (!r.ok) throw new Error(String(r.status));
    const p = await r.json();
    status("pushed " + time() + ": the bot picks it up within a minute (or say ?trancelib pull)");
    S.pushed = p;
  } catch (er) { status("couldn't push: " + er.message); }
}
async function pubStatus() {
  try { const p = await (await fetch("/__studio/trance/published.json", { cache: "no-store" })).json(); if (p && p.at) status("loaded · last pushed " + new Date(p.at).toLocaleString()); else status("loaded · nothin' pushed to the bot yet"); }
  catch (e) { status("loaded"); }
}

// ── the list ─────────────────────────────────────────────────
const KIND_HINT = { induction: "takes them down", deepener: "further down", convincer: "a little test (too heavy to lift…)", suggestion: "spoken, for while they're under",
  trigger: "spoken, then planted as an LSCG suggestion", wake: "brings them up (or doesn't)",
  compulsion: "spoken, then kept: somethin' happenin' sets it off now and then (their herd leader walks in, a pat, the stall's cups…)",
  hangon: "spoken, then it stays with them a while after they come up",
  slip: "what comes out of their mouth instead, when their speech gets hijacked (said out loud, as them)",
  nudge: "the farm's whispers through the day, as its pull builds up in them (only to them)",
  session: "a recipe: which blocks, in what order" };
function renderList() {
  const box = $("#kinds"); box.textContent = "";
  for (const k of T.KINDS) {
    const list = S.lib.blocks.map((b, i) => [b, i]).filter(([b]) => b.kind === k);
    box.appendChild(h("div", { class: "kind" },
      h("div", { class: "head", title: KIND_HINT[k] }, h("span", null, k + "s ", h("small", { class: "hint" }, "(" + list.length + ")")), h("button", { class: "small", onclick: () => addBlock(k) }, "+ new")),
      list.map(([b, i]) => h("button", { class: "blk" + (i === S.sel ? " sel" : "") + (b.bad ? " bad" : ""), onclick: () => { S.sel = i; renderList(); renderForm(); } },
        b.name, h("small", null, levelText(b) + (b.lines.length ? " · " + b.lines.length + " lines" : ""))))));
  }
  // anything in the text that isn't one of the kinds (a typo in a === line) still shows, so it can be fixed
  const odd = S.lib.blocks.map((b, i) => [b, i]).filter(([b]) => !T.KINDS.includes(b.kind));
  if (odd.length) box.appendChild(h("div", { class: "kind" }, h("div", { class: "head" }, "not a kind"), odd.map(([b, i]) => h("button", { class: "blk bad", onclick: () => { S.sel = i; renderForm(); } }, b.kind + ": " + b.name))));
}
const levelText = (b) => { const l = b.labels && b.labels.level; return !l || !l.length || l.length === 3 ? "all levels" : l.join(", "); };
function renderProblems() {
  const box = $("#problems"); box.textContent = "";
  const all = S.lib.errors.map((e) => ["err", e]).concat(S.lib.warnings.map((w) => ["warn", w]));
  if (!all.length) { box.appendChild(h("p", { class: "hint" }, "✔ No mistakes. " + S.lib.blocks.length + " blocks.")); return; }
  for (const [kind, p] of all) box.appendChild(h("div", { class: "prob " + kind, onclick: () => goLine(p.line) }, (kind === "err" ? "✖ " : "⚠ ") + "line " + p.line + (p.block ? " (" + p.block + ")" : "") + ": " + p.msg));
}
function goLine(n) {
  const ta = $("#text"), rows = S.text.split("\n"); let pos = 0;
  for (let i = 0; i < n - 1 && i < rows.length; i++) pos += rows[i].length + 1;
  ta.focus(); ta.setSelectionRange(pos, pos + (rows[n - 1] || "").length);
  ta.scrollTop = Math.max(0, (n - 5) * 18.75);
}
function renderSessions() {
  const sel = $("#pvSession"), was = sel.value; sel.textContent = "";
  sel.appendChild(h("option", { value: "" }, "any session that suits them"));
  for (const b of S.lib.blocks.filter((x) => x.kind === "session" && !x.bad)) sel.appendChild(h("option", { value: b.name }, b.name + " (" + levelText(b) + ")"));
  sel.value = was;
}

// ── the form ─────────────────────────────────────────────────
const BANDS = ["delta", "theta", "alpha", "beta"];
const VERBS = {
  cum: { hint: "" }, deny: { hint: "" }, needy: { hint: "" },
  strip: { hint: "top, bottoms, underwear, feet, all, random (or the game's slot names)" },
  pose: { hint: "{low} (their pick: kneel or all fours), kneel, kneel spread, all fours, stand, hands behind, hands up" },
  say: { hint: "the words, or leave empty: whatever's said after the trigger" },
  follow: { hint: "" },
  touch: { hint: "Activity zone [self|speaker], like: Caress tits self" },
  forget: { hint: "all, or: deny, needy, follow, say" },
  // the farm's own (part 2): LSCG extension instructions, run by their Companion (the dose by their Dispensary)
  moo: { hint: "how many times: 1, 2 or 3 (their own animal's sound)" },
  stall: { hint: "" },
  beg: { hint: "the words, or leave empty: the farm's own in their sound (then off to a free stall)" },
  dose: { hint: "the Dispensary dose's name, then half or double if you like: moo · needy nectar double" },
};
function renderForm() {
  const box = $("#form"); box.textContent = "";
  const b = cur();
  if (!b) { box.appendChild(h("p", { class: "hint" }, "Pick a block on the left, or add one.")); return; }
  const L = b.labels || {};
  const errs = S.lib.errors.filter((e) => e.block === b.kind + ": " + b.name);
  box.appendChild(h("div", { class: "row" },
    h("select", { onchange: (e) => edit((x) => { x.kind = e.target.value; }, { form: true }) }, T.KINDS.map((k) => h("option", { value: k, selected: k === b.kind || null }, k))),
    h("input", { value: b.name, size: 28, onchange: (e) => edit((x) => { x.name = e.target.value.trim() || x.name; }) }),
    h("button", { class: "small", onclick: copyBlock }, "Copy"), h("button", { class: "small", onclick: removeBlock }, "Take out")));
  box.appendChild(h("p", { class: "hint" }, KIND_HINT[b.kind] || ""));
  if (errs.length) box.appendChild(h("div", null, errs.map((e) => h("div", { class: "prob err" }, "✖ " + e.msg))));

  // who it's for
  const lv = L.level && L.level.length ? L.level : T.LEVELS;
  box.appendChild(h("div", { class: "row" }, h("label", { class: "lab" }, "Levels"),
    T.LEVELS.map((l) => h("label", { class: "chip" }, h("input", { type: "checkbox", checked: lv.includes(l), onchange: (e) => edit((x) => {
      const now = (x.labels.level && x.labels.level.length ? x.labels.level : T.LEVELS.slice()).filter((y) => y !== l);
      if (e.target.checked) now.push(l);
      x.labels.level = T.LEVELS.filter((y) => now.includes(y));
    }) }), { fun: "Fun", deep: "Deep", nhl: "No human left" }[l]))));
  box.appendChild(h("div", { class: "row" }, h("label", { class: "lab" }, "For"),
    h("input", { value: (L.for || []).join(", "), placeholder: "any (or: cow, pony, pup…)", size: 26, onchange: (e) => edit((x) => { const v = e.target.value.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean); x.labels.for = v.length && !v.includes("any") ? v : null; }) }),
    h("label", { class: "lab" }, "Wears"),
    h("input", { value: (L.wears || []).join(", "), placeholder: "collar, bell, gag…", size: 18, title: "Only for somebody wearin' one of these: collar, leash, bell, gag, blind, hood, paws, arms, cage, nipples, latex, harness, ears, tail, hooves, noseRing",
      onchange: (e) => edit((x) => { const v = e.target.value.split(",").map((s) => s.trim()).filter(Boolean); x.labels.wears = v.length ? v : undefined; }) })));

  if (T.ASIDE.includes(b.kind)) {
    // slips and nudges: said outside sessions, once the farm's pull is built up this far
    box.appendChild(h("div", { class: "row" }, h("label", { class: "lab" }, "Pull"),
      h("input", { type: "range", min: 0, max: 100, step: 5, value: L.pull || 0, oninput: (e) => { e.target.nextSibling.textContent = e.target.value + "%"; }, onchange: (e) => edit((x) => { const v = Number(e.target.value); x.labels.pull = v || undefined; }) }),
      h("span", { class: "hint" }, (L.pull || 0) + "%"),
      h("span", { class: "hint" }, b.kind === "slip" ? "how built up the farm's pull (or how fresh out of a session) before these come out of them" : "how built up the farm's pull before the farm whispers these")));
  } else if (b.kind !== "session") {
    // pace and how many lines
    box.appendChild(h("div", { class: "row" }, h("label", { class: "lab" }, "Pace"),
      h("input", { type: "number", min: 1, max: 600, step: 1, value: L.pace ? L.pace.min : "", placeholder: "30", onchange: (e) => edit((x) => { const a = Number(e.target.value); const was = x.labels.pace || { min: 30, max: 30 }; x.labels.pace = a > 0 ? { min: a, max: Math.max(a, was.max) } : undefined; }) }),
      "to", h("input", { type: "number", min: 1, max: 600, step: 1, value: L.pace ? L.pace.max : "", placeholder: "30", onchange: (e) => edit((x) => { const m = Number(e.target.value); const was = x.labels.pace || { min: m, max: m }; x.labels.pace = m > 0 ? { min: Math.min(was.min, m), max: m } : undefined; }) }),
      h("span", { class: "hint" }, "seconds between lines"),
      h("label", { class: "lab" }, "Use"), h("input", { type: "number", min: 1, max: 99, value: L.pick || "", placeholder: "all", onchange: (e) => edit((x) => { const p = Math.floor(Number(e.target.value)); x.labels.pick = p >= 1 ? p : undefined; }) }),
      h("span", { class: "hint" }, "of its lines, fresh each time")));
    box.appendChild(beatsForm(L.beats));
    box.appendChild(lookForm(L.look));
    box.appendChild(h("div", { class: "row" }, h("label", { class: "lab" }, "Deeper"),
      h("input", { type: "number", min: -100, max: 100, value: L.deeper || "", placeholder: "0", onchange: (e) => edit((x) => { const d = Math.round(Number(e.target.value)); x.labels.deeper = d || undefined; }) }),
      h("span", { class: "hint" }, "how much deeper they are once it's done (the look thickens with it)"),
      h("label", { class: "lab" }, "Volume"), h("input", { type: "number", min: 0, max: 100, value: L.volume != null ? L.volume : "", placeholder: "theirs", onchange: (e) => edit((x) => { const v = e.target.value === "" ? undefined : Math.max(0, Math.min(100, Math.round(Number(e.target.value)))); x.labels.volume = v; }) }),
      h("span", { class: "hint" }, "% of their own beats")));
  }
  if (b.kind === "trigger" || b.kind === "compulsion") box.appendChild(triggerForm(L, b.kind));
  if (b.kind === "hangon") box.appendChild(hangonForm(L));
  if (b.kind === "session") box.appendChild(sessionForm(L));
  else box.appendChild(linesForm(b));
}
function bandPick(r, onset, label) {
  const band = r ? r.band || "" : "", hz = r && r.hz != null ? r.hz : "";
  const put = (bd, n) => onset(bd || n !== "" ? Object.assign({}, bd ? { band: bd } : {}, n !== "" && n != null ? { hz: Number(n) } : {}) : null);
  const sel = h("select", { onchange: (e) => put(e.target.value, num.value) }, h("option", { value: "" }, "—"), BANDS.map((x) => h("option", { value: x, selected: x === band || null }, x + " (" + T.BAND_RANGE[x] + ")")));
  const num = h("input", { type: "number", min: 1, max: 30, step: 0.5, value: hz, placeholder: "Hz", title: "an exact rate; leave empty and a band picks a fresh rate inside itself each time", onchange: (e) => put(sel.value, e.target.value) });
  return [h("span", { class: "hint" }, label), sel, num];
}
function beatsForm(v) {
  v = v || null;
  const setB = (fn) => edit((x) => { const nb = Object.assign({ from: null, to: null, over: null }, x.labels.beats && !x.labels.beats.off ? x.labels.beats : {}); fn(nb); x.labels.beats = nb.from || nb.to ? nb : undefined; });
  return h("fieldset", null, h("legend", null, "Beats"),
    h("div", { class: "row" },
      h("label", { class: "chip" }, h("input", { type: "checkbox", checked: !!(v && v.off), onchange: (e) => edit((x) => { x.labels.beats = e.target.checked ? { off: true } : undefined; }, { form: true }) }), "fade them out"),
      v && v.off ? null : [bandPick(v && v.from, (r) => setB((n) => { n.from = r; }), "from"), bandPick(v && v.to, (r) => setB((n) => { n.to = r; }), "slide to"),
        h("span", { class: "hint" }, "over"), h("input", { type: "number", min: 0, max: 3600, value: v && v.over != null ? v.over : "", placeholder: "secs", onchange: (e) => setB((n) => { n.over = e.target.value === "" ? null : Math.max(0, Number(e.target.value)); }) }), h("span", { class: "hint" }, "seconds")]),
    h("p", { class: "hint" }, "Empty: the beat carries on as the last block left it. Only plays for people who turned beats on (LSCG's own, or the farm's in their Companion), never louder than their setting. Delta 1-4 Hz, theta 4-8, alpha 8-12, beta 12-30."));
}
function lookForm(v) {
  v = v || {};
  const setL = (k, val) => edit((x) => { const l = Object.assign({}, x.labels.look || {}); if (val === undefined) delete l[k]; else l[k] = val; x.labels.look = Object.keys(l).length ? l : undefined; });
  const opt = (k, choices, now) => h("select", { onchange: (e) => setL(k, e.target.value === "" ? undefined : choices.find((c) => String(c[0]) === e.target.value)[2]) },
    h("option", { value: "" }, "as it was"), choices.map(([val, label]) => h("option", { value: String(val), selected: now !== undefined && String(now) === String(val) || null }, label)));
  return h("fieldset", null, h("legend", null, "The look on their screen"),
    h("div", { class: "row" }, h("span", { class: "hint" }, "Haze"),
      h("input", { type: "range", min: 0, max: 100, step: 5, value: v.haze != null ? v.haze : 0, oninput: (e) => { e.target.nextSibling.textContent = e.target.value + "%"; }, onchange: (e) => setL("haze", Number(e.target.value)) }),
      h("span", { class: "hint" }, v.haze != null ? v.haze + "%" : "as it was"),
      h("button", { class: "small", onclick: () => setL("haze", undefined) }, "as it was")),
    h("div", { class: "row" },
      h("span", { class: "hint" }, "Spiral"), opt("spiral", [["off", "off", "off"], ["slow", "slow", "slow"], ["on", "turning", "on"]], v.spiral),
      h("span", { class: "hint" }, "Rings"), opt("rings", [["on", "on", true], ["off", "off", false]], v.rings == null ? undefined : v.rings ? "on" : "off"),
      h("span", { class: "hint" }, "Words"), opt("words", [["drift", "drift up", true], ["off", "off", false]], v.words == null ? undefined : v.words ? "drift" : "off"),
      h("span", { class: "hint" }, "Names"), opt("names", [["blur", "blurred", true], ["clear", "clear", false]], v.names == null ? undefined : v.names ? "blur" : "clear")),
    h("p", { class: "hint" }, "Slow and soft, never flashing. People can switch it off, or keep it still, in their Companion."));
}
// part 3: what a hang-on does after they come up, and for how long (the session's level caps it: Fun 20 minutes, Deep an
// hour, No human left 4 hours)
function hangonForm(L) {
  return h("fieldset", null, h("legend", null, "Stays with them after"),
    h("div", { class: "row" }, h("label", { class: "lab" }, "Effect"),
      h("select", { onchange: (e) => edit((x) => { x.labels.effect = e.target.value || undefined; }, { form: true }) }, h("option", { value: "" }, "—"),
        Object.entries(T.EFFECTS).map(([k, t]) => h("option", { value: k, selected: k === L.effect || null }, k + ": " + t)))),
    h("div", { class: "row" }, h("label", { class: "lab" }, "Lasts"),
      h("input", { type: "number", min: 1, max: 240, value: L.lasts ? Math.round(L.lasts / 60) : "", placeholder: "30", onchange: (e) => edit((x) => { const m = Math.round(Number(e.target.value)); x.labels.lasts = m >= 1 && m <= 240 ? m * 60 : undefined; }) }),
      h("span", { class: "hint" }, "minutes (Fun sessions cap it at 20, Deep at 60, No human left at 240). Their safeword ends it.")));
}
function triggerForm(L, kind) {
  const rows = T.splitDoes(L.does || "").map((s) => { const m = /^(\S+)\s*(.*)$/.exec(s); return { verb: m ? m[1].toLowerCase() : "", arg: m ? m[2] : "" }; });
  const waits = String(L.waits || "").split(",").map((s) => s.trim());
  while (rows.length < 3) rows.push({ verb: "", arg: "" });
  const write = (form) => edit((x) => {
    const used = rows.filter((r) => r.verb);
    x.labels.does = used.map((r) => r.verb + (r.arg ? " " + ((r.verb === "say" || r.verb === "beg") && !/^".*"$/.test(r.arg) ? "\"" + r.arg + "\"" : r.arg) : "")).join(" → ");
    const w = used.slice(1).map((r, i) => waits[rows.indexOf(r) - 1] || "");
    x.labels.waits = w.some(Boolean) ? w.map((s) => s || "1s").join(", ") : "";
  }, { form });
  const test = T.parseDoes(L.does || "", L.waits || "", { low: "kneel" });
  const comp = kind === "compulsion";
  return h("fieldset", null, h("legend", null, comp ? "Kept by the farm, set off by somethin' happenin'" : "Planted as an LSCG suggestion"),
    comp ? h("div", { class: "row" }, h("label", { class: "lab" }, "When"),
      h("select", { onchange: (e) => edit((x) => { x.labels.when = e.target.value || undefined; }) }, h("option", { value: "" }, "—"),
        Object.entries(T.WHEN).map(([k, t]) => h("option", { value: k, selected: k === L.when || null }, t))),
      h("label", { class: "lab" }, "Chance"),
      h("input", { type: "number", min: 1, max: 50, value: L.chance || "", placeholder: "10", onchange: (e) => edit((x) => { const c = Number(e.target.value); x.labels.chance = c >= 1 && c <= 50 ? c : undefined; }) }),
      h("span", { class: "hint" }, "% each time (small; never the same one twice in ten minutes)"))
    : h("div", { class: "row" }, h("label", { class: "lab" }, "Trigger"), h("input", { value: L.trigger || "", size: 30, placeholder: "milking time", onchange: (e) => edit((x) => { x.labels.trigger = e.target.value.trim(); }) }),
      h("span", { class: "hint" }, "said by anyone LSCG lets set it off ({animal} and the rest fill in)")),
    rows.map((r, i) => h("div", { class: "row" }, h("label", { class: "lab" }, i === 0 ? "Does" : "then"),
      i > 0 ? [h("input", { type: "number", min: 1, max: 30, value: (waits[i - 1] || "").replace(/s$/, ""), placeholder: "1", title: "seconds before this one", onchange: (e) => { waits[i - 1] = e.target.value ? e.target.value + "s" : ""; write(); } }), h("span", { class: "hint" }, "s later:")] : null,
      h("select", { onchange: (e) => { r.verb = e.target.value; if (!e.target.value) r.arg = ""; write(true); } }, h("option", { value: "" }, "—"), Object.keys(VERBS).map((v) => h("option", { value: v, selected: v === r.verb || null }, v))),
      r.verb && VERBS[r.verb] && VERBS[r.verb].hint ? h("input", { value: r.verb === "say" || r.verb === "beg" ? r.arg.replace(/^"(.*)"$/, "$1") : r.arg, size: 30, placeholder: VERBS[r.verb].hint, title: VERBS[r.verb].hint, onchange: (e) => { r.arg = e.target.value.trim(); write(); } }) : null)),
    h("p", { class: "hint" }, test.error ? "✖ " + test.error : comp
      ? "Does: " + test.instructions.map((x) => T.stepName(x.type)).join(" → ") + ". Their Companion carries it out, give in or fight it. From a Fun session it fires once and fades in a day; Deep, a week (renewed when it lands); No human left, set for good."
      : "As LSCG instructions: " + test.instructions.map((x) => T.stepName(x.type)).join(" → ") + ". They can fight it off like any LSCG suggestion, and block any instruction in their LSCG. The farm's own (moo, stall, beg) run through their Companion; dose needs their Dispensary."));
}
function sessionForm(L) {
  const picks = (L.picks || []).map((p) => ({ kind: p.kind, items: p.items.map((it) => (it.all ? "all" : it.any ? (it.any > 1 ? "any " + it.any : "any") : it.name)).join(", ") }));
  const write = (form) => edit((x) => {
    x.labels.picks = picks.filter((p) => p.kind && p.items.trim()).map((p) => ({ kind: p.kind, items: p.items.split(",").map((s) => s.trim()).filter(Boolean).map((it) => {
      const m = /^any(?:\s+(\d+))?$/i.exec(it); return m ? { any: Number(m[1] || 1) } : /^all$/i.test(it) ? { all: true } : { name: it };
    }) }));
  }, { form });
  const names = (k) => S.lib.blocks.filter((b) => b.kind === k).map((b) => b.name);
  return h("fieldset", null, h("legend", null, "In this order"),
    picks.map((p, i) => h("div", { class: "row" },
      h("select", { onchange: (e) => { p.kind = e.target.value; write(true); } }, T.SESSION_KINDS.map((k) => h("option", { value: k, selected: k === p.kind || null }, k))),
      h("input", { value: p.items, size: 30, list: "dl-" + p.kind, placeholder: "any, any 2, all, or names", onchange: (e) => { p.items = e.target.value; write(); } }),
      h("datalist", { id: "dl-" + p.kind }, ["any", "any 2", "all"].concat(names(p.kind)).map((n) => h("option", { value: n }))),
      h("button", { class: "small", onclick: () => { picks.splice(i, 1); write(true); } }, "✕"),
      i > 0 ? h("button", { class: "small", title: "earlier", onclick: () => { picks.splice(i - 1, 0, picks.splice(i, 1)[0]); write(true); } }, "↑") : null)),
    h("button", { class: "small", onclick: () => { picks.push({ kind: "suggestion", items: "any" }); write(true); } }, "+ add a step"),
    h("p", { class: "hint" }, "\"any\" picks one that suits their level, kind and gear; \"any 2\" two; \"all\" every one that suits; or name them. Blocks for a deeper level than theirs are never picked."));
}
function linesForm(b) {
  const text = b.lines.map((l) => (l.text + " " + l.cues.map(T.formatCue).join(" ")).trim()).join("\n");
  return h("fieldset", null, h("legend", null, "Lines"),
    h("textarea", { rows: Math.min(18, Math.max(5, b.lines.length + 2)), value: text, spellcheck: "true", onchange: (e) => edit((x) => {
      const p = T.parseLibrary("=== induction: x\n\n" + e.target.value);
      x.lines = p.blocks[0] ? p.blocks[0].lines : [];
    }) }),
    h("p", { class: "hint" }, (b.kind === "slip" ? "One line each, said out loud as them, in place of what they meant to say." : b.kind === "nudge" ? "One line each, whispered to them alone in the farm's voice." : "One line each, said in the farm's voice.") + " Fill-ins: {name} {animal} {sound} {body} {pet} {paws} {low} {herd}. Cues: [wait 20s] [deeper +10] [beats theta 5] [look haze 60%]. A line starting {t} is only for tits, {c} a cock, {v} a pussy. Round brackets are taken out."));
}

// ── try it: the session the bot would run, sped up ───────────
const KINDS_OF = {
  cow: { animal: "cow", sound: "moo", body: "heavy udders", act: "give milk", pose: "on all fours, head low", paws: "hooves", pet: "dairy cow" },
  pony: { animal: "pony", sound: "whinny", body: "strong flanks", act: "pull and prance", pose: "head high, knees lifting", paws: "hooves", pet: "farm pony" },
  horse: { animal: "mare", sound: "whinny", body: "strong flanks", act: "carry and obey", pose: "head high, standing square", paws: "hooves", pet: "broodmare" },
  pup: { animal: "pup", sound: "woof", body: "wagging tail", act: "heel and fetch", pose: "kneeling up, paws tucked", paws: "paws", pet: "farm pup" },
  kitty: { animal: "kitty", sound: "mew", body: "twitching tail", act: "purr and present", pose: "curled low, hips up", paws: "paws", pet: "needy kitty" },
  pig: { animal: "piggy", sound: "oink", body: "soft round belly", act: "root and wallow", pose: "nose to the ground", paws: "hooves", pet: "farm pig" },
  bunny: { animal: "bunny", sound: "squeak", body: "twitchy ears", act: "hop and breed", pose: "crouched low, nose twitching", paws: "paws", pet: "farm bunny" },
  goat: { animal: "goat", sound: "bleat", body: "full udder", act: "give milk", pose: "on all fours, head low", paws: "hooves", pet: "milk goat" },
  sheep: { animal: "lamb", sound: "baa", body: "soft fleece", act: "follow the flock", pose: "on all fours, head low", paws: "hooves", pet: "farm lamb" },
  fox: { animal: "fox", sound: "yip", body: "bushy tail", act: "present and please", pose: "low on your elbows, tail high", paws: "paws", pet: "eager vixen" },
  dragon: { animal: "dragon", sound: "growl", body: "folded wings", act: "guard and obey", pose: "crouched low, wings folded", paws: "claws", pet: "tame dragon" },
};
function pvWho() {
  const k = $("#pvSpecies").value, w = Object.assign({}, KINDS_OF[k] || KINDS_OF.cow);
  w.name = $("#pvName").value || "Bessie"; w.low = $("#pvLow").value === "fours" ? "on all fours" : "on your knees"; w.herd = "the farm";
  return { level: $("#pvLevel").value, species: k, words: w, body: $("#pvBody").value };
}
const fitsBody = (t, body) => { const m = /^((?:\{[a-z]{1,2}\})+)/.exec(t); if (!m) return true; const tags = m[1].slice(1, -1).split("}{");
  return tags.every((g) => (g === "t" || g === "v" ? body !== "m" : g === "c" ? body !== "f" : g === "nc" ? body === "f" : g === "nt" || g === "nv" ? body === "m" : true)); };
const untag = (t) => String(t).replace(/\{(?:nv|nc|nt|fu|fb|nb|ok|v|c|t|f|m)\}/g, "");
function plan() {
  const who = pvWho();
  const p = T.planSession(S.lib.blocks, { level: who.level, species: who.species, wears: ["collar", "bell"] }, { name: $("#pvSession").value });
  const steps = T.sessionSteps(p, { keep: (t) => fitsBody(t, who.body) });
  return { who, p, steps };
}
function showPlan() {
  stopPlay();
  const { who, p, steps } = plan(), feed = $("#feed"); feed.textContent = "";
  const mins = Math.round(steps.reduce((n, s) => n + (s.gap || 0), 0) / 60);
  feed.appendChild(h("p", { class: "hint" }, (p.name ? p.name : "no session suits them, so the plain shape") + ": " + p.blocks.map((b) => b.kind + " " + b.name).join(" → ") + " · about " + mins + " minutes · (wearin' a collar and a bell)"));
  steps.forEach((s, i) => feed.appendChild(lineRow(s, who, i)));
  return { who, steps };
}
function lineRow(s, who, i) {
  const cues = [];
  if (s.beats) cues.push(s.beats.off ? "beats fade out" : "beats " + (s.beats.from != null ? s.beats.from + " Hz" : "") + (s.beats.to != null ? " → " + s.beats.to + " Hz" : "") + (s.beats.over ? " over " + T.fmtSecs(s.beats.over) : ""));
  if (s.look) cues.push("look: " + T.formatLook(s.look));
  if (s.deeper) cues.push("deeper " + (s.deeper > 0 ? "+" : "") + s.deeper);
  if (s.plant) { const sg = T.lscgSuggestion(s.plant, { words: who.words, low: $("#pvLow").value }); cues.push(sg.error ? "✖ " + sg.error : "plants \"" + sg.trigger + "\": " + sg.instructions.map((x) => x.type + (x.arguments.config ? " \"" + x.arguments.config + "\"" : "")).join(" → ")); }
  return h("div", { class: "l", "data-i": i }, h("span", { class: "k" }, s.kind), s.text ? T.fillIn(untag(s.text), who.words) : h("i", { class: "hint" }, "(no line)"),
    cues.length ? h("div", { class: "cue" }, "↳ " + cues.join(" · ")) : null, h("span", { class: "cue" }, " · " + Math.round(s.gap || 0) + "s"));
}
// the preview box: the same look the Companion draws (contained here)
const PV = { look: {}, depth: 0 };
function pvLook(l, reset) {
  PV.look = Object.assign(reset ? {} : PV.look, l || {});
  const box = $("#pv"), L = PV.look, haze = Math.max(0, Math.min(100, (Number(L.haze) || 0) + PV.depth / 5));
  $(".haze", box).style.background = "radial-gradient(ellipse at center, transparent " + Math.max(18, 62 - haze * 0.4) + "%, rgba(88,28,118," + (haze / 100 * 0.78).toFixed(3) + ") 100%)";
  const sp = $(".spiral", box); sp.classList.toggle("on", L.spiral === "on"); sp.style.opacity = L.spiral && L.spiral !== "off" ? "0.16" : "0";
  for (const r of box.querySelectorAll(".ring")) r.style.display = L.rings ? "" : "none";
  box.classList.toggle("blur", !!L.names);
}
function pvWord(text) {
  if (!PV.look.words) return;
  const box = $("#pv"); if (box.querySelectorAll(".word").length >= 3) return;
  const w = h("div", { class: "word" }, text.slice(0, 120)); w.style.left = (8 + Math.random() * 40) + "%";
  box.appendChild(w); setTimeout(() => w.remove(), 12500);
}
function spiralSvg() {
  const pts = (k) => { const out = []; for (let t = 0.2; t < 14 * Math.PI; t += 0.12) { const r = 16 * t; out.push((500 + r * Math.cos(t + k)).toFixed(1) + "," + (500 + r * Math.sin(t + k)).toFixed(1)); } return out.join(" "); };
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000'><g fill='none' stroke='rgb(185,120,225)' stroke-width='26' stroke-linecap='round'><polyline points='" + pts(0) + "'/><polyline points='" + pts(Math.PI) + "' stroke='rgb(240,170,215)'/></g></svg>");
}
// beats, sped up like the rest
const AU = { ac: null, l: null, r: null, g: null, carrier: 200 };
function beatsOn(hz) {
  if (!$("#pvBeats").checked) return;
  if (!AU.ac) {
    const ac = new (window.AudioContext || window.webkitAudioContext)(), l = ac.createOscillator(), r = ac.createOscillator(), m = ac.createChannelMerger(2), g = ac.createGain();
    l.connect(m, 0, 0); r.connect(m, 0, 1); m.connect(g); g.connect(ac.destination);
    g.gain.setValueAtTime(0, ac.currentTime); g.gain.linearRampToValueAtTime(0.06, ac.currentTime + 3);
    l.start(); r.start(); Object.assign(AU, { ac, l, r, g });
  }
  beatsSet(hz, 0.3);
}
function beatsSet(hz, secs) {
  if (!AU.ac || hz == null) return;
  const t = AU.ac.currentTime;
  for (const [o, f] of [[AU.l, AU.carrier - hz / 2], [AU.r, AU.carrier + hz / 2]]) { o.frequency.cancelScheduledValues(t); o.frequency.setValueAtTime(o.frequency.value, t); o.frequency.linearRampToValueAtTime(f, t + Math.max(0.1, secs)); }
}
function beatsOff() { if (!AU.ac) return; const a = AU.ac; AU.g.gain.linearRampToValueAtTime(0, a.currentTime + 1); AU.ac = null; setTimeout(() => a.close(), 1300); }
function pvHz(hz) { $("#pvHz").textContent = hz == null ? "no beats" : hz + " Hz (" + (hz < 4 ? "delta" : hz < 8 ? "theta" : hz < 12 ? "alpha" : "beta") + ")"; }
function stopPlay() { if (S.play) { clearTimeout(S.play.timer); clearInterval(S.play.hzTimer); S.play = null; } beatsOff(); pvLook({}, true); PV.depth = 0; pvHz(null); $("#pvPlay").textContent = "▶ Play"; }
function play() {
  if (S.play) { stopPlay(); return; }
  const { who, steps } = showPlan(), speed = Number($("#pvSpeed").value) || 5;
  S.play = { i: 0, timer: null, hz: null };
  $("#pvPlay").textContent = "■ Stop";
  const next = () => {
    const P = S.play; if (!P) return;
    const s = steps[P.i];
    if (!s) { stopPlay(); return; }
    for (const el of document.querySelectorAll("#feed .l.now")) el.classList.remove("now");
    const row = document.querySelector('#feed .l[data-i="' + P.i + '"]'); if (row) { row.classList.add("now"); row.scrollIntoView({ block: "nearest" }); }
    if (s.look) pvLook(s.look);
    if (s.deeper) { PV.depth = Math.max(0, Math.min(100, PV.depth + s.deeper)); pvLook({}); }
    if (s.beats) {
      if (s.beats.off) { beatsOff(); P.hz = null; pvHz(null); }
      else {
        const from = s.beats.from != null ? s.beats.from : P.hz, to = s.beats.to;
        if (from != null) { P.hz = from; beatsOn(from); pvHz(from); }
        if (to != null) {
          const secs = (s.beats.over || 0) / speed, t0 = Date.now(), a = P.hz != null ? P.hz : to;
          beatsOn(a); beatsSet(to, secs);
          clearInterval(P.hzTimer);
          P.hzTimer = setInterval(() => { const k = secs ? Math.min(1, (Date.now() - t0) / (secs * 1000)) : 1; P.hz = Math.round((a + (to - a) * k) * 10) / 10; pvHz(P.hz); if (k >= 1) clearInterval(P.hzTimer); }, 250);
        }
      }
    }
    if (s.text) pvWord(T.fillIn(untag(s.text), who.words));
    P.i++;
    P.timer = setTimeout(next, Math.max(300, (s.gap || 0) * 1000 / speed));
  };
  next();
}

// ── start ────────────────────────────────────────────────────
async function start() {
  $(".spiral", $("#pv")).style.background = "center/contain no-repeat url(\"" + spiralSvg() + "\")";
  for (const k of Object.keys(KINDS_OF)) $("#pvSpecies").appendChild(h("option", { value: k }, k));
  $("#save").onclick = save; $("#push").onclick = push;
  $("#starter").onclick = () => { if (confirm("Replace everything in the editor with the farm's starter library? (Your last saves stay in studio/trance/old/.)")) { S.sel = -1; setText(STARTER); } };
  let typing = null;
  $("#text").addEventListener("input", (e) => { clearTimeout(typing); typing = setTimeout(() => setText(e.target.value, { fromBox: true }), 450); });
  $("#pvPlan").onclick = showPlan; $("#pvPlay").onclick = play;
  window.addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); save(); } });
  let text = null;
  try { const r = await fetch("/__studio/trance/library.txt", { cache: "no-store" }); if (r.ok) text = await r.text(); } catch (e) { /* none yet */ }
  setText(text == null ? STARTER : text, { quiet: true });
  pvLook({}, true);
  pubStatus();
}
start();
