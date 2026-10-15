// Oct 14: the voice sweep. Every trap, sprung on every kind of body, with every line it says read back: nothing about a
// part they haven't got, no clinical words, no tags or placeholders showing, no "undefined", and no line said twice in
// one run. Writes what it heard to tests/out/voice-sweep.json for reading over. Run by hand (it takes a while, so npm test
// skips it): node tests/voice-sweep.cjs    or for a few traps: SWEEP_KINDS=milker,bull node tests/voice-sweep.cjs
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const stock=(mn,name,gender,species,x)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species,gender,onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,ribbons:10,parasiteOn:true,trapsEager:true},x||{});
const BODIES=[[500,"Moo","female","cow"],[600,"Rex","male","cow"],[700,"Fae","femboy","bunny"],[800,"Fu","futa","pony",{futa:true}],[900,"Bea","female","pony"],[910,"Hob","male","goblin"]];
const people={"221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[],ribbons:30}};
for (const [mn,name,g,sp,x] of BODIES) people[mn]=stock(mn,name,g,sp,x);
store.bnb_ledger_v1=JSON.stringify({v:4,people,applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pasture":{X:20,Y:40},"pond":{X:60,Y:60}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10)].concat(BODIES.map(([mn],i)=>at(mn,15+i*10,10)));
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}}, location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]}, ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>{ const t=a.join(' '); if(!/Worker/.test(t)) warns.push(t); }};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
// every line that went out (room, whisper, beep, and what went to a Companion), as text
const textOf=([e,d])=>{ if(!d) return null; if(typeof d.Content==='string'){ let c=d.Content; try{ if(d.Type==='Hidden'||/^\{/.test(c)){ const j=JSON.parse(c); const t=j&&(j.text||(j.d&&j.d.text)||(j.payload&&j.payload.text)); return t?String(t):null; } }catch(e){} return c; } if(e==='AccountBeep') return String(d.Message||''); return null; };
const since=n=>sent.slice(n).map(textOf).filter(Boolean);
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1500); };
const VULVA=/\b(pussy|pussies|cunt|cunts|slit|womb|clit|cervix)\b/i, TITS=/\b(tits?|titties|breasts?|udders?|teats?|cleavage)\b/i, GIRL=/\b(good girl|heifer|broodmare)\b/i;
const CLINICAL=/\b(lactat\w*|mammar\w*|secretion|ejaculat\w*|genital\w*|vagina\w*|penis(es)?|semen|urethra\w*|anus|rectum|uterus|ovar\w*|testicles?|scrotum|areolae?|labia|intercourse|copulat\w*)\b/i;
const LEAK=/\{(nv|nc|nt|fu|fb|v|c|t|f|m)\}|%[a-z]{1,8}\b|\bundefined\b|\bNaN\b|\[object|\bnull\b/;
const report={bodies:{},kinds:[],problems:[]};
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2; cfg.TRAP_BEAT_S=0.05; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; cfg.BODY_TAIL_CHANCE=1;
  chars[1].Name='Laynie'; BODIES.forEach(([mn,name],i)=>chars[i+2].Name=name);
  for (const [mn] of BODIES) await say(mn,'?stats',800);
  let n=sent.length; await say(221397,'?trap spring Moo nosuchkind',900);
  const kinds=((since(n).join(' ').match(/Kinds: ([a-z, ]+)\./)||[])[1]||"").split(/,\s*/).filter(Boolean);
  report.kinds=kinds; ok(kinds.length>=20, 'found the traps: '+kinds.length);
  const only=(process.env.SWEEP_KINDS||'').split(',').filter(Boolean), run=only.length?kinds.filter(k=>only.includes(k)):kinds;   // SWEEP_KINDS=leeches,milker for a quick look
  for (const [mn,name,g,sp] of BODIES){
    const b=W.__body(mn), heard=[], probs=[], perKind={};
    for (const k of run){
      const r=P(mn); r.trapAt=0; r.penned=null; r.gear=null; r.trapQuiet=0; r.trapWait=null; r.parasite=null;
      if (W.__st().trapRuns) W.__st().trapRuns.delete(mn);
      n=sent.length; await say(221397,'?trap spring '+name+' '+k,900);
      for (let i=0;i<40;i++){ await wait(250); if(!(W.__st().trapRuns&&W.__st().trapRuns.has(mn))&&!P(mn).trapWait) break; await say(mn,'?struggle',100); }
      for (let i=0;i<60;i++){ const st=W.__st(); if(!st.queue.length&&!st.urgent.length&&!(st.replies||[]).length) break; await wait(100); } await wait(200);
      const all0=since(n), sprung=(all0.find(t=>/won't spring|Sprung on/.test(t))||'').replace(/^🧪 /,''); const lines=all0.filter(t=>t.includes(name)&&!/^🧪|^\?|won't spring|Sprung on/.test(t));
      perKind[k]={n:lines.length,sprung:/Sprung/.test(sprung)?'yes':sprung.slice(0,120)};
      for (const t of [...new Set(lines)]){   // (a call beeped to everybody comes back once per person: counted once)
        heard.push([k,t]);
        const why=[]; if(!b.vulva&&VULVA.test(t)) why.push('pussy word: '+t.match(VULVA)[0]);
        const u=t.replace(/like (a|any other|strippin' a|milkin' a) teat/gi,''), m=u.match(TITS); if(!b.tits&&m) why.push('tit word: ...'+u.slice(Math.max(0,m.index-60),m.index+30));   // (a cock milked like a teat is fine)
        if(b.g==='male'&&GIRL.test(t)) why.push('girl word: '+t.match(GIRL)[0]); if(CLINICAL.test(t)) why.push('clinical: '+t.match(CLINICAL)[0]); if(LEAK.test(t)) why.push('leak: '+t.match(LEAK)[0]);
        if(why.length) probs.push({kind:k,why,text:t});
      }
      await say(mn,'?safeword',300); P(mn).trapQuiet=0; P(mn).quietUntil=0;
    }
    // milked while they're still full of seed: the leak line (08-production.js) said three times, so the pool gets read
    for (let i=0;i<3;i++){ const p=W.__prodOf(mn); p.milk=400; p.held={vulva:b.vulva?3000:0,butt:3000,mouth:0}; p.leakSaid=0; p.leakAcc=0; p.tieUntil=0;
      n=sent.length; W.__drainMilk(mn,200); await wait(150); for (const t of since(n).filter(t=>/seed/.test(t))){ heard.push(['leak',t]); const u=t.replace(/like (a|any other|strippin' a|milkin' a) teat/gi,''); if((!b.tits&&TITS.test(u))||(!b.vulva&&VULVA.test(t))||LEAK.test(t)) probs.push({kind:'leak',why:['body word or leak'],text:t}); } }
    const counts={}; for (const [,t] of heard) counts[t]=(counts[t]||0)+1;
    const twice=Object.entries(counts).filter(([t,c])=>c>1&&t.length>60).map(([t,c])=>c+'× '+t.slice(0,120));
    report.bodies[name]={g,sp,lines:heard.length,distinct:Object.keys(counts).length,twice,probs,perKind,heard};
    out('\n'+name+' ('+g+', '+sp+'): '+heard.length+' lines, '+Object.keys(counts).length+' different, '+probs.length+' problems, '+twice.length+' said twice');
    for (const p of probs.slice(0,12)) out('  ['+p.kind+'] '+p.why.join('; ')+' :: '+p.text.slice(0,180));
  }
  fs.mkdirSync(path.join(__dirname,'out'),{recursive:true}); fs.writeFileSync(path.join(__dirname,'out/voice-sweep.json'),JSON.stringify(report,null,1));
  const total=Object.values(report.bodies).reduce((a,b)=>a+b.probs.length,0);
  ok(total===0, 'no line about a part they haven\'t got, no clinical words, nothing leaking: '+total+' problems');
  const errs=warns.filter(w=>/command failed|trap|TypeError|ReferenceError/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,300));
  out(fails ? '\n❌ '+fails+' failed' : '\n✅ all good'); process.exit(fails?1:0);
})();
