/* WHAT'S IN THIS FILE (log.js)
   The Log tab, for whoever the farm lets read the record (Laynie: "for my easy of access, 221397, laynie, should have
   a log tab to easily read and filter it"). Pick whose record (or everybody's), how far back, what kinds of lines and
   any words to look for; the farm girl sends back what matches, newest last. "Save as a file" keeps what's shown.
*/
import { h, card, title, muted, btn } from "../dom.js";

const KINDS = [["", "Everything"], ["whisper", "Whispers"], ["beep", "Beeps"], ["cmd", "Commands"], ["farm", "The farm"], ["chat", "Chat"], ["emote", "Emotes"], ["action", "Actions"]];
const two = (n) => String(n).padStart(2, "0");
const when = (t) => { const d = new Date(t); return two(d.getMonth() + 1) + "-" + two(d.getDate()) + " " + two(d.getHours()) + ":" + two(d.getMinutes()) + ":" + two(d.getSeconds()); };
const line = (r) => when(r.t) + " [" + r.k + "] " + (r.n || r.f || "") + (r.w ? " → " + r.w : "") + ": " + r.x;

export function logTab(ctx) {
  const ui = ctx.ui, who = ctx.s.logWho || [], res = ui.logRows;
  const ask = () => ctx.api.logAsk({ who: Number(ui.logWho) || 0, hours: Number(ui.logHours) || 3, kind: ui.logKind || "", q: String(ui.logQ || "").trim().slice(0, 80) });
  const save = () => {
    try {
      const blob = new Blob([(res.rows || []).map(line).join("\n")], { type: "text/plain" }), a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "farm-log-" + (ui.logWho || "all") + "-" + new Date().toISOString().slice(0, 13).replace("T", "-") + ".txt"; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    } catch (e) { ctx.hint("Couldn't save it: " + e.message); }
  };
  return [
    card(title("📜 The record"),
      muted("What players see in their chat, the beeps they get and the commands they send the farm, kept by the hour. Proprietors are always recorded; anybody else only if they switched it on."),
      h("label", { class: "fhc-label" }, "Whose",
        h("select", { class: "fhc-sel", onchange: (e) => ctx.setUi({ logWho: e.target.value }, true) },
          [["", "Everybody"]].concat(who.map((w) => [String(w.mn), w.name + " (" + w.mn + ")"])).map(([v, l]) => h("option", { value: v, selected: String(ui.logWho || "") === v ? "selected" : null }, l)))),
      h("label", { class: "fhc-label" }, "How far back",
        h("select", { class: "fhc-sel", onchange: (e) => ctx.setUi({ logHours: e.target.value }, true) },
          [["1", "The last hour"], ["3", "3 hours"], ["12", "12 hours"], ["24", "A day"], ["72", "3 days"], ["168", "A week"]].map(([v, l]) => h("option", { value: v, selected: String(ui.logHours || "3") === v ? "selected" : null }, l)))),
      h("div", { style: { marginTop: "4px" } }, KINDS.map(([k, l]) => h("button", { type: "button", class: "fhc-pill" + ((ui.logKind || "") === k ? " on" : ""), onclick: () => ctx.setUi({ logKind: k }) }, l))),
      h("label", { class: "fhc-label" }, "Words to look for",
        h("input", { class: "fhc-in", value: ui.logQ || "", placeholder: "a name, a command, anything", oninput: (e) => ctx.setUi({ logQ: e.target.value }, true), onkeydown: (e) => { if (e.key === "Enter") ask(); } })),
      h("div", { style: { marginTop: "6px" } }, btn("Show", ask, true), res && (res.rows || []).length ? btn("Save as a file", save) : null)),
    res ? card(title(res.busy ? "Lookin'…" : (res.total || 0) + " lines" + (res.total > (res.rows || []).length ? ", the newest " + res.rows.length + " shown" : "")),
      (res.rows || []).length
        ? h("div", { style: { fontFamily: "monospace", fontSize: "11px", maxHeight: "420px", overflowY: "auto", whiteSpace: "pre-wrap" } },
            res.rows.map((r) => h("div", { style: { borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "2px 0" } }, line(r))))
        : muted(res.busy ? "" : "Nothing matches.")) : null,
  ];
}
