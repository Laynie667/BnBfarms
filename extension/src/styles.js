// The panel's look. Colours are variables, so a player's own theme can swap them later.
export const THEME = {
  ground: "#21170f", card: "#2f2216", line: "#5a432a", accent: "#c9a35b", text: "#f3e9d8",
  muted: "#bfae95", good: "#8fbf6a", alert: "#b8403a", well: "#140e09",
};

export const CSS = `
#fhc-btn{position:fixed;right:12px;bottom:12px;z-index:9999;width:46px;height:46px;border-radius:50%;
  border:2px solid var(--fh-accent);background:#3b2a1a;color:#fff;font-size:22px;cursor:pointer;box-shadow:0 2px 8px #0008}
#fhc-btn[data-unread]:after{content:attr(data-unread);position:absolute;top:-4px;right:-4px;background:var(--fh-alert);
  color:#fff;border-radius:9px;font-size:11px;padding:1px 5px;font-family:sans-serif}
#fhc-panel{position:fixed;right:12px;bottom:66px;z-index:9999;width:min(440px,calc(100vw - 24px));height:min(640px,78vh);
  display:none;flex-direction:column;background:var(--fh-ground);color:var(--fh-text);border:2px solid var(--fh-accent);border-radius:12px;
  font:14px/1.4 "Source Sans 3","Segoe UI",sans-serif;box-shadow:0 4px 18px #000a;overflow:hidden}
#fhc-panel.open{display:flex}
#fhc-panel.compact{font-size:12.5px}
#fhc-panel button{font:inherit;cursor:pointer}
.fhc-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-bottom:1px solid var(--fh-line);cursor:move}
.fhc-title{font-family:Bitter,Georgia,serif;font-weight:700;font-size:17px;color:var(--fh-accent)}
.fhc-row{display:flex;align-items:center;gap:6px;padding:7px 12px;border-bottom:1px solid var(--fh-line);flex-wrap:wrap}
.fhc-grow{flex:1}
.fhc-safe{flex:1;min-height:38px;border-radius:8px;border:1px solid var(--fh-alert);background:transparent;color:var(--fh-text);font-weight:600}
.fhc-safe.red{background:var(--fh-alert);color:#fff;font-weight:700}
.fhc-pill{min-height:32px;padding:0 11px;border-radius:999px;border:1px solid var(--fh-line);background:transparent;color:var(--fh-text);font-weight:600}
.fhc-pill.on{background:var(--fh-accent);border-color:var(--fh-accent);color:var(--fh-ground)}
.fhc-body{flex:1;min-height:0;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}
.fhc-box{background:var(--fh-card);border:1px solid var(--fh-line);border-radius:10px;padding:11px}
.fhc-box.ask{border-color:var(--fh-accent)}
.fhc-box.alert{border:2px solid var(--fh-alert)}
.fhc-h{font-family:Bitter,Georgia,serif;font-weight:700;color:var(--fh-accent);margin-bottom:6px}
.fhc-muted{color:var(--fh-muted);font-size:12px}
.fhc-chip{display:inline-block;font-size:12px;padding:2px 9px;border-radius:999px;border:1px solid var(--fh-line);margin:0 4px 4px 0}
.fhc-chip-good{border-color:var(--fh-good)} .fhc-chip-alert{border-color:var(--fh-alert)} .fhc-chip-acc{border-color:var(--fh-accent)}
.fhc-b{min-height:36px;padding:0 12px;border-radius:8px;border:1px solid var(--fh-accent);background:var(--fh-line);color:var(--fh-text);font-weight:600;margin:0 6px 6px 0}
.fhc-b-acc{background:var(--fh-accent);color:var(--fh-ground);font-weight:700}
.fhc-cmd{min-height:32px;padding:0 9px;border-radius:6px;border:1px solid var(--fh-line);background:var(--fh-well);color:var(--fh-text);
  font-family:ui-monospace,Consolas,monospace;font-size:12px;margin:0 5px 5px 0}
.fhc-bar{margin:6px 0}
.fhc-bar-row{display:flex;justify-content:space-between}
.fhc-bar-track{height:9px;border-radius:5px;background:var(--fh-line);overflow:hidden;margin-top:3px}
.fhc-bar-fill{height:100%;background:var(--fh-accent)} .fhc-fill-good{background:var(--fh-good)} .fhc-fill-alert{background:var(--fh-alert)}
.fhc-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.fhc-kv{display:flex;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px solid var(--fh-line)}
.fhc-tog{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--fh-line)}
.fhc-tog-l{font-weight:600}
.fhc-sw{flex-shrink:0;position:relative;width:48px;height:28px;border-radius:14px;border:1px solid var(--fh-line);background:var(--fh-well);padding:0}
.fhc-sw span{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:10px;background:var(--fh-muted);transition:left .15s}
.fhc-sw.on{background:var(--fh-good);border-color:var(--fh-good)} .fhc-sw.on span{left:23px;background:var(--fh-ground)}
.fhc-card{background:var(--fh-card);border-left:3px solid var(--fh-accent);border-radius:6px;padding:6px 8px;white-space:pre-wrap;
  font-family:ui-monospace,Consolas,monospace;font-size:12px}
.fhc-card.notice{border-left-color:var(--fh-good)}
.fhc-card.mine{background:transparent;border-left-color:#7a6a55;color:var(--fh-muted);font-family:inherit}
.fhc-time{display:block;font-family:sans-serif;font-size:10px;color:var(--fh-muted);margin-bottom:2px}
.fhc-form{display:flex;gap:6px;padding:8px 12px;border-top:1px solid var(--fh-line)}
.fhc-in,.fhc-sel{flex:1;min-height:36px;box-sizing:border-box;background:var(--fh-well);color:var(--fh-text);border:1px solid var(--fh-line);border-radius:8px;padding:4px 8px;font:inherit}
.fhc-sel{flex:none;width:100%}
.fhc-label{display:flex;flex-direction:column;gap:3px;font-size:12px;color:var(--fh-muted);margin:6px 0}
.fhc-split{display:flex;gap:8px;align-items:flex-start}
.fhc-docs{width:130px;flex-shrink:0;display:flex;flex-direction:column;gap:5px}
.fhc-doc{text-align:left;min-height:40px;padding:5px 8px;border-radius:8px;border:1px solid var(--fh-line);background:transparent;color:var(--fh-text)}
.fhc-doc.on{border-color:var(--fh-accent);background:var(--fh-card)}
.fhc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
`;
