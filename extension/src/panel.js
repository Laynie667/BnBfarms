// The farm panel: a little 🌾 button that opens a card feed with buttons and a command box.
import { HISTORY_MAX, QUICK } from "./config.js";

const CSS = `
#fhc-btn{position:fixed;right:12px;bottom:12px;z-index:9999;width:44px;height:44px;border-radius:50%;
  border:2px solid #c9a35b;background:#3b2a1a;color:#fff;font-size:22px;cursor:pointer;box-shadow:0 2px 8px #0008}
#fhc-btn[data-unread]:after{content:attr(data-unread);position:absolute;top:-4px;right:-4px;background:#d9534f;
  color:#fff;border-radius:9px;font-size:11px;padding:1px 5px;font-family:sans-serif}
#fhc-panel{position:fixed;right:12px;bottom:64px;z-index:9999;width:min(420px,calc(100vw - 24px));height:min(560px,70vh);
  display:none;flex-direction:column;background:#21170f;color:#f3e9d8;border:2px solid #c9a35b;border-radius:10px;
  font:13px/1.35 sans-serif;box-shadow:0 4px 18px #000a}
#fhc-panel.open{display:flex}
#fhc-head{padding:8px 10px;font-weight:bold;border-bottom:1px solid #5a432a;display:flex;justify-content:space-between}
#fhc-quick{display:flex;flex-wrap:wrap;gap:4px;padding:6px 8px;border-bottom:1px solid #5a432a}
#fhc-quick button,#fhc-form button{background:#5a432a;color:#f3e9d8;border:1px solid #c9a35b;border-radius:6px;padding:3px 7px;cursor:pointer}
#fhc-feed{flex:1;overflow-y:auto;padding:8px;display:flex;flex-direction:column;gap:8px}
.fhc-card{background:#2f2216;border-left:3px solid #c9a35b;border-radius:6px;padding:6px 8px;white-space:pre-wrap;
  font-family:ui-monospace,Consolas,monospace;font-size:12px}
.fhc-card.notice{border-left-color:#8fbf6a}
.fhc-card.mine{background:transparent;border-left-color:#7a6a55;color:#bfae95;font-family:sans-serif}
.fhc-time{display:block;font-family:sans-serif;font-size:10px;color:#9c8a70;margin-bottom:2px}
#fhc-form{display:flex;gap:4px;padding:6px 8px;border-top:1px solid #5a432a}
#fhc-input{flex:1;background:#140e09;color:#f3e9d8;border:1px solid #5a432a;border-radius:6px;padding:4px 6px}
`;

export class Panel {
  constructor(onCommand) {
    this.onCommand = onCommand;
    this.unread = 0;
    const doc = window.document;
    const style = doc.createElement("style");
    style.textContent = CSS;
    doc.head.appendChild(style);

    this.btn = doc.createElement("button");
    this.btn.id = "fhc-btn";
    this.btn.title = "B&B Farm";
    this.btn.textContent = "🌾";
    this.btn.addEventListener("click", () => this.toggle());

    this.el = doc.createElement("div");
    this.el.id = "fhc-panel";
    this.el.innerHTML =
      '<div id="fhc-head"><span>🌾 B&amp;B Farm</span><span id="fhc-status">…</span></div>' +
      '<div id="fhc-quick"></div><div id="fhc-feed"></div>' +
      '<form id="fhc-form"><input id="fhc-input" placeholder="Ask the farm girl… (stats, size, help me)" autocomplete="off">' +
      "<button>Send</button></form>";
    const quick = this.el.querySelector("#fhc-quick");
    for (const [label, cmd] of QUICK) {
      const b = doc.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", () => this.ask(cmd));
      quick.appendChild(b);
    }
    this.feed = this.el.querySelector("#fhc-feed");
    this.status = this.el.querySelector("#fhc-status");
    const input = this.el.querySelector("#fhc-input");
    this.el.querySelector("#fhc-form").addEventListener("submit", (e) => {
      e.preventDefault();
      if (input.value.trim()) this.ask(input.value.trim());
      input.value = "";
    });
    // keep BC from treatin' panel typin' as game keys
    this.el.addEventListener("keydown", (e) => e.stopPropagation());

    doc.body.appendChild(this.btn);
    doc.body.appendChild(this.el);
  }

  ask(cmd) {
    this.add(cmd, "mine");
    this.onCommand(cmd);
  }

  toggle(open = !this.el.classList.contains("open")) {
    this.el.classList.toggle("open", open);
    if (open) { this.unread = 0; this.btn.removeAttribute("data-unread"); }
  }

  show(visible) {
    this.btn.style.display = visible ? "" : "none";
    if (!visible) this.toggle(false);
  }

  setStatus(text) { this.status.textContent = text; }

  add(text, kind = "reply") {
    const card = window.document.createElement("div");
    card.className = "fhc-card " + kind;
    const time = window.document.createElement("span");
    time.className = "fhc-time";
    time.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      (kind === "notice" ? " · from the farm" : kind === "mine" ? " · you asked" : "");
    card.appendChild(time);
    card.appendChild(window.document.createTextNode(text));
    this.feed.appendChild(card);
    while (this.feed.children.length > HISTORY_MAX) this.feed.firstChild.remove();
    this.feed.scrollTop = this.feed.scrollHeight;
    if (kind !== "mine" && !this.el.classList.contains("open")) {
      this.unread++;
      this.btn.setAttribute("data-unread", String(this.unread));
    }
  }
}
