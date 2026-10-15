// Oct 14: the parasite sweep. Every strain, on every kind of body, lived through its whole twelve hours (the clock is
// wound forward a half hour at a time): it blooms, feeds, drinks, lays, wants, edges and lets go, and every line it says
// is read back for a part they haven't got, clinical words, or a tag showing. Each strain's own trick is checked on each
// body, and so is each way it can get on somebody (glory hole, kiss, milk, the nest, a seed, the farm girl's hand).
// Run by hand (npm test skips it):  node tests/parasite-sweep.cjs    Writes tests/out/parasite-sweep.json.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const stock=(mn,name,gender,species,x)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species,gender,onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,ribbons:10,parasiteOn:true,trapsEager:true},x||{});
const BODIES=[[500,"Moo","female","cow"],[600,"Rex","male","cow"],[700,"Fae","femboy","bunny"],[800,"Fu","futa","pony",{futa:true}],[900,"Bea","female","pony"],[910,"Hob","male","goblin"]];
const people={"221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[],ribbons:30}};
for (const [mn,name,g,sp,x] of BODIES) people[mn]=stock(mn,name,g,sp,x);
store.bnb_ledger_v1=JSON.stringify({v:4,people,applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pasture":{X:20,Y:40},"nest":{X:60,Y:60},"glory-1":{X:80,Y:10}}});
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
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn], prod=mn=>W.__prodOf(mn);
const st0=global.setTimeout, wait=ms=>new Promise(r=>st0(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const textOf=([e,d])=>{ if(!d) return null; if(typeof d.Content==='string'){ let c=d.Content; try{ if(d.Type==='Hidden'||/^\{/.test(c)){ const j=JSON.parse(c); const t=j&&(j.text||(j.d&&j.d.text)||(j.payload&&j.payload.text)); return t?String(t):null; } }catch(e){} return c; } if(e==='AccountBeep') return String(d.Message||''); return null; };
const since=n=>[...new Set(sent.slice(n).map(textOf).filter(Boolean))];
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||600); };
const drain=async()=>{ for (let i=0;i<80;i++){ const s=W.__st(); if(!s.queue.length&&!s.urgent.length&&!(s.replies||[]).length) break; await wait(25); } };
const VULVA=/\b(pussy|pussies|cunt|cunts|slit|womb|clit|cervix)\b/i, TITS=/\b(tits?|titties|breasts?|udders?|teats?|cleavage)\b/i, GIRL=/\b(good girl|heifer|broodmare)\b/i;
const CLINICAL=/\b(lactat\w*|mammar\w*|secretion|ejaculat\w*|genital\w*|vagina\w*|penis(es)?|semen|urethra\w*|anus|rectum|uterus|ovar\w*|testicles?|scrotum|areolae?|labia|intercourse|copulat\w*)\b/i;
const LEAK=/\{(nv|nc|nt|fu|fb|v|c|t|f|m)\}|%[a-z]{1,8}\b|\bundefined\b|\bNaN\b|\[object|\bnull\b/;
const report={runs:{},ways:{},problems:[]};
const check=(b,who,label,t0)=>{ const why=[], t=t0.replace(/you've no womb/g,'').replace(/a pair of tits you didn't walk in with/g,''); if(!b.vulva&&VULVA.test(t)) why.push('pussy word: '+t.match(VULVA)[0]);
  const u=t.replace(/like (a|any other|strippin' a|milkin' a) teat/gi,''), m=u.match(TITS); if(!b.tits&&m) why.push('tit word: ...'+u.slice(Math.max(0,m.index-50),m.index+25));
  if(b.g==='male'&&GIRL.test(t)) why.push('girl word: '+t.match(GIRL)[0]); if(CLINICAL.test(t)) why.push('clinical: '+t.match(CLINICAL)[0]); if(LEAK.test(t)) why.push('leak: '+t.match(LEAK)[0]);
  if(why.length) report.problems.push({who,label,why,text:t}); return why.length; };
const STRAINS=['breeder','grower','glutton','tyrant'];

(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2; cfg.PARASITE_KISS_CHANCE=1; cfg.PARASITE_SEED_CHANCE=0;
  chars[1].Name='Laynie'; BODIES.forEach(([mn,name],i)=>chars[i+2].Name=name);
  for (const [mn] of BODIES) await say(mn,'?stats',300);
  global.setTimeout=(f,ms,...a)=>st0(f,Math.min(ms||0,30),...a);   // the parasite's little waits (a tell after nine seconds) come at once

  // ── every strain, every body, the whole twelve hours ──
  for (const strain of STRAINS){
    W.__forceStrain=strain;
    for (const [mn,name] of BODIES){
      const r=P(mn), b=W.__body(mn); r.parasite=null; r.parasiteNext=0; r.parasiteN=0; r.crave=null; r.parasiteSeed=0; r.trapQuiet=0; r.quietUntil=0;
      const p=prod(mn), size0=JSON.stringify(p.size||{}); p.eggs=null; p.deniedUntil=0;
      let n=sent.length; await say(221397,'?parasite give '+name,400); await drain();
      const g=()=>P(mn).parasite, lines=since(n), stages={};
      if(!g()){ ok(false, strain+' on '+name+': it latched'); continue; }
      const got=g().strain; let last=g();
      for (let h=0.5;h<=12.01;h+=0.5){
        const now=Date.now(), G=g(); if(!G) break; last=G;
        G.since=now-h*3600000; G.until=G.since+12*3600000; G.next=0;
        p.milk=Math.max(p.milk||0,200); p.semen=Math.max(p.semen||0,120); P(mn).trapQuiet=0; P(mn).quietUntil=0;
        if (h===2) G.urgeAt=0;                                       // it wants somethin'...
        if (h===2.5 && G.urge){ if (G.urge.kind==='kiss') W.__kiss('kiss','ItemMouth',mn,221397); else if (G.urge.kind==='swallow') W.__load(910===mn?500:910,mn,'mouth',120); else G.urge.until=0; }   // ...and gets it, or doesn't
        if (h===5) { G.urgeAt=0; } if (h===5.5 && G.urge) G.urge.until=0;   // ...and once it's let down
        if (h===3) { G.ate=now-50*60000; G.told=0; }                 // the cravin'
        if (h===7) W.__load(500===mn?600:500,mn,'mouth',150);        // a swallowed load turned to serum
        if (h===9 && strain==='tyrant') W.__climax(mn);               // a Tyrant eats what they reach for
        if (h>=8) G.edgeAt=0;
        n=sent.length; W.__parasiteTick(); await wait(40); await drain();
        if (g()) stages[W.__parts(mn).stage]=W.__strainGear(mn).map(x=>x.name).join(', ');
        lines.push(...since(n));
      }
      n=sent.length; if (g()){ g().until=Date.now()-1; W.__parasiteTick(); await wait(60); await drain(); } lines.push(...since(n)); const G=last;   // (it may have dropped off by itself at hour twelve)
      const mine=[...new Set(lines)].filter(t=>!/^\?|^🧪/.test(t)), size1=prod(mn).size||{};
      let probs=0; for (const t of mine) probs+=check(b,name,strain,t);
      const grew=Object.keys(size1).filter(k=>JSON.parse(size0)[k]!==size1[k]);
      report.runs[strain+':'+name]={got,lines:mine.length,stages,grew,eggs:(prod(mn).eggs||{}).n||0,drunk:G&&G.drunk||0,eaten:G&&G.eaten||0,denied:!!(prod(mn).deniedUntil),probs,heard:mine};
      out(strain.padEnd(8)+name.padEnd(5)+' ('+b.g+'): '+mine.length+' lines, '+probs+' problems, grew '+(grew.join('/')||'-')+', eggs '+(report.runs[strain+':'+name].eggs)+(G&&G.drunk?', drank '+Math.round(G.drunk):'')+(G&&G.eaten?', ate '+G.eaten:''));
      for (const s of Object.keys(stages)) out('     stage '+s+': '+stages[s]);
      // each strain's own trick
      const R=report.runs[strain+':'+name], all=mine.join('\n');
      if (strain==='breeder') ok(G&&G.laidMid&&G.laid, '  breeder on '+name+' lays twice (half-way and at the end)');
      if (strain==='breeder'&&!b.vulva) ok(/ass/.test(all)&&!/(?<!no )womb/.test(all.replace(/you've no womb: it's makin' you one/g,'')), '  ...and without a womb it fills their ass, and says so');
      if (strain==='grower'){ const want=b.g==='male'?['penis','testes']:b.g==='female'?['udder','butt']:b.g==='femboy'?['butt','udder']:['penis','udder']; ok(want.every(k=>R.grew.includes(k)), '  grower on '+name+' grows '+want.join(' and ')+' ('+R.grew.join('/')+')'); if (b.g==='male') ok(!R.grew.includes('udder'), '  ...and leaves a male\'s chest alone'); }
      if (strain==='glutton') { ok(G&&G.drunk>0, '  glutton on '+name+' drinks what they make'); if (b.cock) ok(/sleeve/i.test(all), '  ...and milks the cock with its sleeve'); }
      if (strain==='tyrant'){ ok(G&&G.eaten>=1, '  tyrant on '+name+' eats an orgasm'); ok(/edge|stops dead|lets go of everything|nothin'\. It's waitin'/i.test(all), '  ...and walks them to the edge late on'); }
    }
  }

  // ── the ways it gets on somebody, and the belt it comes back as ──
  W.__forceStrain=null;
  const fresh=mn=>{ const r=P(mn); r.parasite=null; r.parasiteNext=0; r.parasiteN=0; r.parasiteSeed=0; };
  const way=async(label,mn,act)=>{ fresh(mn); const n=sent.length; await act(); await wait(200); await drain(); const ls=since(n).filter(t=>!/^\?|^🧪/.test(t)); const b=W.__body(mn);
    let pr=0; for (const t of ls) pr+=check(b,P(mn).name,label,t); report.ways[label]=ls;
    ok(!!P(mn).parasite, label+': it took'); ok(!(label!=='glory'&&label!=='given'&&ls.some(t=>/through the hole|glory hole|that last cock|cock pulls back out/i.test(t))), label+': nothing about a glory hole'); out('     '+ls.filter(t=>/👄|🥚/.test(t)).map(t=>t.slice(0,150)).join('\n     ')); };
  fresh(500); await say(221397,'?parasite give Moo',400); await drain();
  await way('kiss',600,()=>W.__kiss('kiss','ItemMouth',500,600));
  await way('nurse',700,()=>W.__nurse(500,700));
  await way('regrow',800,async()=>{ P(800).parasiteSeed=Date.now()-1; W.__parasiteTick(); });
  await way('hatch',900,async()=>{ L().nestBrood=1; chars[6].MapData.Pos={X:60,Y:60}; W.__parasiteTick(); });
  await way('given',910,()=>say(221397,'?parasite give Hob',400));
  await way('glory',600,async()=>{ P(600).parasite=null; cfg.PARASITE_CHANCE=1; W.__load(-1,600,'mouth',50); await wait(400); });
  await way('belt',700,async()=>{ P(700).parasiteN=3; await say(221397,'?parasite give Fae',400); });
  ok(P(700).parasite&&P(700).parasite.form==='belt', 'the fourth time it comes back as a belt');

  fs.mkdirSync(path.join(__dirname,'out'),{recursive:true}); fs.writeFileSync(path.join(__dirname,'out/parasite-sweep.json'),JSON.stringify(report,null,1));
  for (const p of report.problems.slice(0,30)) out('  ['+p.label+' '+p.who+'] '+p.why.join('; ')+' :: '+p.text.slice(0,200));
  ok(report.problems.length===0, 'no line about a part they haven\'t got, no clinical words, nothing leaking: '+report.problems.length+' problems');
  const errs=warns.filter(w=>/parasite|strain|command failed|TypeError|ReferenceError/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,400));
  out(fails ? '\n❌ '+fails+' failed' : '\n✅ all good'); process.exit(fails?1:0);
})();
