  /* WHAT'S IN THIS FILE (10q-feedback.js)
     THE SUGGESTION BOX: anybody on the farm (guests too) can send the proprietors feedback, a bug, or an idea.
       ?feedback <what you think> · ?suggest <an idea> (or ?idea) · ?bug <what went wrong>
       ?feedback mine · what you've sent and what's become of it
     Each one is kept in the ledger with a number, and the proprietors get a quiet note.
     Proprietors: ?feedback list [open|all|ideas|bugs|feedback] · ?feedback <n> · ?feedback done <n> [a note back]
       ?feedback later <n> · ?feedback no <n> [why] · ?feedback del <n> · ?feedback export (everything, for Claude)
     When one's marked done (or no), whoever sent it is told, with the note.
  */
  const FB_KINDS = { feedback: "💬", idea: "💡", bug: "🐛" };
  const FB_STATUS = { open: "open", done: "done ✅", later: "later ⏳", no: "not this time" };
  function fbLedger(){ L.feedback = L.feedback || []; L.fbSeq = L.fbSeq || 0; return L.feedback; }
  function fbLine(f, full){
    const d = new Date(f.t), when = (d.getMonth()+1)+"/"+d.getDate();
    const text = full ? f.text : (f.text.length > 90 ? f.text.slice(0, 88)+"…" : f.text);
    return "#"+f.id+" "+FB_KINDS[f.kind]+" "+when+" "+f.name+(f.status !== "open" ? " · "+FB_STATUS[f.status] : "")+": "+text+(full && f.note ? "\n   ↳ "+f.note : "");
  }
  // the person sendin' it: ?feedback, ?suggest, ?idea, ?bug
  function fbSubmit(cmd, sender, rest, R){
    const list = fbLedger(), kind = cmd === "bug" ? "bug" : (cmd === "suggest" || cmd === "idea") ? "idea" : "feedback";
    const text = String(rest || "").trim();
    if (!text){
      R(kind === "bug" ? "🐛 What went wrong, sugar? Say ?bug and then what happened, like ?bug the stall never let me go."
        : kind === "idea" ? "💡 What's your idea, sugar? Say ?suggest and then the idea, like ?suggest a hayride on Sundays."
        : "💬 What would you like to tell the proprietors? Say ?feedback and then your thoughts. (?suggest for an idea, ?bug for somethin' broken, ?feedback mine for what you've sent.)");
      return;
    }
    if (text.length < 4){ R("That's a little short to go on, sugar. Tell me a bit more."); return; }
    const today = list.filter(f => f.mn === sender && Date.now() - f.t < 86400000).length;
    if (today >= CFG.FEEDBACK_PER_DAY && !isStaff(sender)){ R("You've sent "+today+" today already, sugar. Thank you! The proprietors will get to 'em. Try again tomorrow."); return; }
    const f = { id: ++L.fbSeq, t: Date.now(), mn: sender, name: plainName(sender), kind, text: text.slice(0, CFG.FEEDBACK_MAX), status: "open", where: channelNote(sender) };
    list.push(f);
    if (list.length > 1000) L.feedback = list.slice(-1000);
    saveLedger(); audit(sender, "FEEDBACK", "#"+f.id+" "+kind);
    R(FB_KINDS[kind]+" Thank you, "+plainName(sender)+"! That's #"+f.id+" in the suggestion box. The proprietors read every one, and I'll tell you when somethin' comes of it. (?feedback mine to see yours)");
    for (const p of CFG.PROPRIETORS) tell(p, FB_KINDS[kind]+" New in the suggestion box, #"+f.id+" from "+f.name+": "+f.text.slice(0, 300)+(f.text.length > 300 ? "…" : "")+" (?feedback list)");
  }
  function channelNote(mn){ const w = (typeof whereName === "function" && onMap(mn)) ? whereName(mn) : ""; return w || (onMap(mn) ? "on the farm" : "away"); }
  // ?feedback … (the submitter's own, or the proprietors' tools)
  function feedbackCommand(cmd, sender, args, rest, R){
    if (cmd !== "feedback") return fbSubmit(cmd, sender, rest, R);
    const sub = String(args[0] || "").toLowerCase(), list = fbLedger();
    if (sub === "mine"){
      const mine = list.filter(f => f.mn === sender).slice(-15);
      R(mine.length ? "📬 WHAT YOU'VE SENT\n"+mine.map(f => fbLine(f, true)).join("\n") : "📬 You haven't sent anything yet, sugar. ?feedback, ?suggest or ?bug and then what you've got to say.");
      return;
    }
    const tools = ["list","done","later","no","del","delete","export","open"].includes(sub) || /^#?\d+$/.test(sub);
    if (!tools || !isProprietor(sender)) return fbSubmit(cmd, sender, rest, R);   // anything else is feedback itself
    if (sub === "list"){
      const which = String(args[1] || "open").toLowerCase();
      const kind = { ideas: "idea", idea: "idea", bugs: "bug", bug: "bug", feedback: "feedback" }[which];
      const rows = list.filter(f => (kind ? f.kind === kind && f.status === "open" : which === "all" ? true : f.status === "open"));
      R(rows.length ? "📬 SUGGESTION BOX · "+(which === "all" ? "everything" : kind ? which+", open" : "open")+" ("+rows.length+")\n"+rows.slice(-30).map(f => fbLine(f)).join("\n")+
                      "\n?feedback <n> reads one · ?feedback done|later|no <n> [note] · ?feedback del <n>"
                    : "📬 Nothin' "+(which === "all" ? "" : "open ")+"in the suggestion box, sugar.");
      return;
    }
    if (sub === "export"){
      R(list.length ? "📬 EVERYTHING IN THE SUGGESTION BOX ("+list.length+")\n"+list.map(f => fbLine(f, true)+" ["+f.mn+(f.where ? ", "+f.where : "")+"]").join("\n") : "📬 The suggestion box is empty.");
      return;
    }
    const idArg = /^#?\d+$/.test(sub) ? sub : args[1];
    const id = parseInt(String(idArg || "").replace("#", ""), 10), f = list.find(x => x.id === id);
    if (!f){ R("There's no #"+(idArg || "?")+" in the suggestion box, sugar. ?feedback list shows the numbers."); return; }
    if (/^#?\d+$/.test(sub)){ R("📬 "+fbLine(f, true)+"\nFrom "+f.name+" ("+f.mn+"), "+new Date(f.t).toLocaleString()+(f.where ? ", "+f.where : "")); return; }
    if (sub === "del" || sub === "delete"){ L.feedback = list.filter(x => x !== f); saveLedger(); audit(sender, "FEEDBACK_DEL", "#"+id); R("🗑️ #"+id+" is out of the box."); return; }
    const note = args.slice(2).join(" ").trim().slice(0, 300);
    f.status = sub === "open" ? "open" : sub; f.note = note || f.note || ""; f.by = sender; f.at = Date.now();
    saveLedger(); audit(sender, "FEEDBACK_"+sub.toUpperCase(), "#"+id);
    if (sub === "done" || sub === "no" || sub === "later"){
      const msg = sub === "done" ? "✅ Your "+(f.kind === "bug" ? "bug report" : f.kind === "idea" ? "idea" : "feedback")+" #"+id+" has been taken care of, "+f.name+". Thank you for sendin' it!"
                : sub === "later" ? "⏳ Your "+(f.kind === "idea" ? "idea" : "note")+" #"+id+" is on the list for later, "+f.name+". The proprietors liked it."
                : "📬 About your #"+id+", "+f.name+": the proprietors read it, and it's not somethin' they'll do right now.";
      tell(f.mn, msg+(note ? " They said: "+note : ""));
    }
    R("📬 #"+id+" is "+FB_STATUS[f.status]+(f.status !== "open" ? ", and "+f.name+" has been told" : "")+".");
  }
