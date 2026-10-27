// Oct 27 (Laynie: "They should be immersive, detailed, non-clinical, expansive message pools for all traps, 3-4 seems
// like a paltry amount, and that doesnt sound like it covers all the various factors, like gender, equipment, species,
// fullness, and all those variables."): each trap's own beats grown to eight lines or more, batch by batch
// (10z5-trap-more.js, 10z5a-..., 10z5b-..., ...).
//  • every beat of every trap a batch has reached has eight lines or more, in every version of a stud
//  • every batch line found the beat it was written for (a beat's found by how its first line starts)
//  • the trap's two beats of its own (10ue-trap-scenes.js) eight or more too
//  • every new line fills in for every body, and nobody's told about parts they haven't got
const fs=require('fs'), path=require('path');
const CUR=JSON.parse(fs.readFileSync(path.join(__dirname,'..','package.json'),'utf8')).versions.companion;
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const LEAK=/\{(nv|nc|nt|fu|fb|nb|ok|v|c|t|f|m)\}|%[a-z]{1,8}\b|\bundefined\b|\bNaN\b|\[object/;

(async()=>{
  const store={}; const sent=[]; const handlers={};
  const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,trapsOn:true,parasiteOn:true},extra||{});
  store.bnb_ledger_v1=JSON.stringify({v:4,people:{
   "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
   "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"wolf"}), "700":S(700,"Pip",{gender:"femboy",species:"bunny"}), "800":S(800,"Fu",{gender:"futa",species:"horse"})
  },applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pasture":{X:20,Y:40},"trap":{X:22,Y:40},"pond":{X:60,Y:60}}});
  global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
  const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
  const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
  const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,30,30),at(700,32,30),at(800,34,30)];
  const evts={};
  const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
    CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}}, location:{reload(){}},alert(){},prompt(){},
    ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
    Player:{MemberNumber:260239,FriendList:[]}, ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
    ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
  global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
  const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
  W.__FARMHAND_TEST__=true; W.__date="2026-08-10T12:00:00";
  eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
  const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
  const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1500); };
  const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
  const free=(...mns)=>{ for(const mn of mns){ const r=P(mn); r.trapAt=0; r.penned=null; r.gear=null; r.trapQuiet=0; r.trapWait=null; r.benched=null; r.quietUntil=0; if(W.__st().trapRuns) W.__st().trapRuns.delete(mn); } };
  const done=async(mn,ms)=>{ for(let i=0;i<80;i++){ await wait(250); if(!(W.__st().trapRuns&&W.__st().trapRuns.has(mn))) break; } await wait(ms||600); };
  await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.08; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; cfg.SYM.TRAP_CHANCE=0; cfg.SYM.LATEX_TRAP_CHANCE=0; cfg.SEND_INTERVAL_MS=2; cfg.TRAP_WRITE_CHANCE=0;
  ['Laynie','Moo','Rex','Pip','Fu'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700,800]) await say(mn,'?stats',600);
  for (const mn of [500,600,700,800,221397,260239]) handlers.ChatRoomMessage({Sender:mn,Type:"Hidden",Content:"FarmhandMsg",Dictionary:{v:2,type:"hello",ver:CUR}});

  // ── spring every trap a batch has reached, on every body, in every version, and keep each beat as it'll run ──
  const TM=W.__trapMore, SC=W.__trapScene, SF=W.__studForms(), KINDS=Object.keys(TM);
  const res={}; let cur=null;
  W.__onTrapBeats=(mn,kind,beats)=>{ const R=res[kind]=res[kind]||{}; beats.forEach((b,i)=>{ const p=Array.isArray(b)?b:[b], h=String(p[0]); if(!R[h]) R[h]={i,n:p.length,form:cur}; }); };
  const spring=async(k)=>{ for (const mn of [500,600,700,800]){ free(mn); W.__st().lastCmd&&W.__st().lastCmd.clear(); await say(221397,'?trap spring '+P(mn).name+' '+k,100); free(mn); } };
  const missing=k=>TM[k].filter(([h])=>!Object.keys(res[k]||{}).some(p=>p.startsWith(h))).map(([h])=>h);
  for (const k of KINDS){
    for (const f of (SF[k] ? Object.keys(SF[k]) : [null])){ cur=f; W.__studForce=f?{[k]:f}:null; await spring(k); await spring(k); }
    // a story that branches (trick or treat, win or lose) takes a few more goes to see every branch
    for (let t=0; t<8 && missing(k).length; t++){ for (const f of (SF[k] ? Object.keys(SF[k]) : [null])){ cur=f; W.__studForce=f?{[k]:f}:null; await spring(k); } }
  }
  W.__studForce=null; W.__onTrapBeats=null;
  out('traps with more of their own lines:', KINDS.length);
  ok(KINDS.length>=79, 'at least the first 79 traps have had their beats grown');

  const unmatched=KINDS.flatMap(k=>missing(k).map(h=>k+': '+h));
  ok(!unmatched.length, 'every batch line found the beat it was written for'+(unmatched.length?' ('+unmatched.slice(0,6).join(' | ')+')':''));

  const thin=[]; for (const k of KINDS) for (const [h,p] of Object.entries(res[k]||{})) if (p.n<8) thin.push(k+(p.form?'/'+p.form:'')+' ['+p.i+'] '+p.n+': '+h.slice(0,40));
  ok(!thin.length, 'every beat of those traps has eight lines or more, in every version'+(thin.length?' ('+thin.slice(0,6).join(' | ')+')':''));

  const thinScene=[]; for (const k of KINDS){ (SC[k]||[]).forEach((p,i)=>{ if (p.length<8) thinScene.push(k+' ['+i+'] '+p.length); });
    for (const [f,F] of Object.entries(SF[k]||{})) (F.scene||[]).forEach((p,i)=>{ if (p.length<8) thinScene.push(k+'/'+f+' ['+i+'] '+p.length); }); }
  ok(!thinScene.length, '...and the two beats of their own too, a stud version\'s as well'+(thinScene.length?' ('+thinScene.join(', ')+')':''));

  // ── every new line, on every body ──
  const extra=[...KINDS.flatMap(k=>TM[k].flatMap(([,l])=>l))];
  const sceneLines=KINDS.flatMap(k=>[...(SC[k]||[]), ...Object.values(SF[k]||{}).flatMap(F=>F.scene||[])].flat());
  out('new lines in the batches:', extra.length);
  const bad=[]; for (const l of extra) for (const mn of [500,600,700,800]){ const t=W.__tFill(W.__pickFor(mn,'x',[l]),mn,{ml:'60 mL',c:'thick',h:'ass'}); if (LEAK.test(t)) bad.push(t.slice(0,80)); }
  for (const l of sceneLines) for (const mn of [500,600,700,800]){ const t=W.__tFill(W.__pickFor(mn,'x',[l]),mn,{ml:'60 mL',c:'thick'}); if (LEAK.test(t)) bad.push(t.slice(0,80)); }
  ok(!bad.length, 'every new line fills in for every body, the beats of their own too'+(bad.length?' ('+bad.slice(0,4).join(' | ')+')':''));
  const COCK=/(%n's|\btheir) (own )?(cock|balls|prick|shaft|sheath)\b/i;
  const untagged=extra.filter(l=>COCK.test(l) && !/\{(c|m|fu|fb)\}/.test((l.match(/^(\{[a-z]+\})+/)||[''])[0]));
  ok(!untagged.length, 'a line about their own cock is only ever for somebody with one'+(untagged.length?' ('+untagged.slice(0,3).map(s=>s.slice(0,60)).join(' | ')+')':''));
  const hInScene=KINDS.flatMap(k=>[...(SC[k]||[]), ...Object.values(SF[k]||{}).flatMap(F=>F.scene||[])].flat()).filter(l=>/%h\b/.test(l));
  ok(!hInScene.length, 'the beats of their own never name a hole (they can fall before or after it\'s chosen)'+(hInScene.length?' ('+hInScene.slice(0,2).join(' | ')+')':''));

  // ── the pools grown another way: the gas and spray by kind and strength, the needle, the wheel, the things in the water ──
  const PM=W.__poolMore||[], PK=[...new Set(PM.map(p=>p.kind))];
  out('pools grown another way:', PM.length, 'in', PK.join(', ')+',', PM.reduce((a,p)=>a+p.lines.length,0), 'new lines');
  ok(PM.length>=150 && ['gas','spray','injector','wheel','tentacle'].every(k=>PK.includes(k)), 'the gas, the spray, the needle, the wheel and the things in the water have had theirs grown');
  const thinPool=PM.filter(p=>p.pool.length<8).map(p=>p.kind+' '+p.name+' '+p.pool.length);
  ok(!thinPool.length, '...every one of those pools eight lines or more'+(thinPool.length?' ('+thinPool.slice(0,6).join(' | ')+')':''));
  const asSpun=l=>l.replace(/%i\b/g,'First');   // the wheel writes its spin in before the line's filled
  const badP=[]; for (const p of PM) for (const l of p.lines) for (const mn of [500,600,700,800]){ const t=W.__tFill(W.__pickFor(mn,'x',[asSpun(l)]),mn,{ml:'60 mL',c:'thick',h:'ass',x:'7'}); if (LEAK.test(t)) badP.push(p.name+': '+t.slice(0,70)); }
  ok(!badP.length, '...every new line of them fills in for every body'+(badP.length?' ('+badP.slice(0,4).join(' | ')+')':''));
  const untaggedP=PM.flatMap(p=>p.lines).filter(l=>COCK.test(l) && !/\{(c|m|fu|fb)\}/.test((l.match(/^(\{[a-z]+\})+/)||[''])[0]));
  ok(!untaggedP.length, '...and only somebody with a cock hears about their own'+(untaggedP.length?' ('+untaggedP.slice(0,3).map(s=>s.slice(0,60)).join(' | ')+')':''));
  const thinSceneP=PK.flatMap(k=>(SC[k]||[]).map((p,i)=>p.length<8?k+' ['+i+'] '+p.length:null)).filter(Boolean);
  ok(!thinSceneP.length, '...and their two beats of their own'+(thinSceneP.length?' ('+thinSceneP.join(', ')+')':''));

  // every kind of gas and spray, at every strength, on every body: each beat as it runs
  const GAS=['heat','milk','musk','needy','giggle','haze','rut','ripen','moo'], SPRAY=['seed','piss','milk','slime','oil','ink','hose'];
  const vthin=[]; let vseen=0;
  W.__onTrapBeats=(mn,kind,beats)=>{ if (!['gas','spray','injector','wheel'].includes(kind)) return; vseen++; beats.forEach((b,i)=>{ const n=Array.isArray(b)?b.length:1; if (n<8) vthin.push(kind+' ['+i+'] '+n+': '+String(Array.isArray(b)?b[0]:b).slice(0,40)); }); };
  for (const [kind,list] of [['gas',GAS],['spray',SPRAY],['injector',[null]]]) for (const variant of list) for (const sev of [1,2,3]){ W.__variantForce={[kind]:{variant,sev}}; await spring(kind); }
  W.__variantForce=null; await spring('wheel'); await spring('wheel');
  W.__onTrapBeats=null;
  ok(vseen>=150 && !vthin.length, 'every gas, spray and needle, at every strength, and the wheel, run eight lines or more a beat ('+vseen+' runs)'+(vthin.length?' ('+[...new Set(vthin)].slice(0,6).join(' | ')+')':''));

  // the whole story, for a few of them and for every thing in the water, on three bodies
  const vtold=[]; const tell=async(mn,kind,force)=>{ free(mn); W.__st().lastCmd&&W.__st().lastCmd.clear(); if (kind==='tentacle') W.__waterForce=force; else W.__variantForce=force?{[kind]:force}:null; const n=sent.length; await say(221397,'?trap spring '+P(mn).name+' '+kind,200); await done(mn,300); vtold.push([P(mn).name,kind+(force?' '+(force.variant||force):''),all(n)]); free(mn); };
  const runs=[['gas',{variant:'heat',sev:3}],['gas',{variant:'rut',sev:2}],['gas',{variant:'ripen',sev:3}],['gas',{variant:'milk',sev:3}],['gas',{variant:'haze',sev:2}],['spray',{variant:'seed',sev:3}],['spray',{variant:'oil',sev:2}],['spray',{variant:'hose',sev:3}],['injector',{variant:null,sev:3}],['wheel',null],
    ...Object.keys(W.__waterForms()).map(f=>['tentacle',f])];
  for (const mn of [500,600,700]) for (const [k,f] of runs) await tell(mn,k,f);
  W.__waterForce=null; W.__variantForce=null;
  const vwrong=vtold.filter(([nm,,t])=>nm!=='Moo' && new RegExp(nm+"'s (pussy|cunt|womb|clit|slit)","i").test(t));
  const vshort=vtold.filter(([,,t])=>t.length<200).map(([nm,k])=>nm+' '+k);
  ok(!vshort.length && !vwrong.length, 'those stories run whole, and a male or a femboy is never told about a pussy'+(vshort.length?' (short: '+vshort.slice(0,4).join(', ')+')':'')+(vwrong.length?' ('+vwrong[0][0]+' '+vwrong[0][1]+')':''));
  const vleak=vtold.filter(([,,t])=>LEAK.test(t));
  ok(!vleak.length, '...and every line of them fills in'+(vleak.length?' ('+vleak[0][1]+': '+(vleak[0][2].match(LEAK)||[''])[0]+')':''));

  // ── every stud and every version of him, on three bodies: each beat as it runs, his two beats of his own, the whole story ──
  const STUDS=['wolves','stallion','bull','warren','boar','toms','drake','naga','kennel','hive','goat','sow','minotaur','werewolf','foxden','lionpride','ramstud'];
  const sthin=[], stold=[]; let scur='';
  W.__onTrapBeats=(mn,kind,beats)=>{ if (!STUDS.includes(kind)) return; beats.forEach((b,i)=>{ const n=Array.isArray(b)?b.length:1; if (n<8) sthin.push(scur+' ['+i+'] '+n+': '+String(Array.isArray(b)?b[0]:b).slice(0,40)); }); };
  for (const k of STUDS) for (const f of (SF[k] ? Object.keys(SF[k]) : [null])) for (const mn of [500,600,700]){
    scur=k+'/'+(f||'usual'); W.__studForce=f?{[k]:f}:null; free(mn); W.__st().lastCmd&&W.__st().lastCmd.clear();
    const n=sent.length; await say(221397,'?trap spring '+P(mn).name+' '+k,200); await done(mn,300); stold.push([P(mn).name,scur,all(n)]); free(mn);
  }
  W.__studForce=null; W.__onTrapBeats=null;
  out('stud stories told:', stold.length);
  ok(stold.length>=100 && !sthin.length, 'every stud, in every version, on every body, runs eight lines or more a beat'+(sthin.length?' ('+[...new Set(sthin)].slice(0,4).join(' | ')+')':''));
  const sScene=STUDS.flatMap(k=>[...(SC[k]||[]).map((p,i)=>[k+' ['+i+']',p]), ...Object.entries(SF[k]||{}).flatMap(([f,F])=>(F.scene||[]).map((p,i)=>[k+'/'+f+' ['+i+']',p]))]);
  const sThinScene=sScene.filter(([,p])=>p.length<8).map(([w,p])=>w+' '+p.length);
  const sSceneBad=[]; for (const [w,p] of sScene) for (const l of p){ if (/%h\b/.test(l)) sSceneBad.push(w+' names a hole'); for (const mn of [500,600,700,800]){ const t=W.__tFill(W.__pickFor(mn,'x',[l]),mn,{ml:'60 mL',c:'thick'}); if (LEAK.test(t)) sSceneBad.push(w+': '+t.slice(0,60)); } }
  ok(!sThinScene.length && !sSceneBad.length, '...his two beats of his own eight lines or more, every version\'s too, never namin\' a hole, every line fillin\' in'+(sThinScene.length?' ('+sThinScene.slice(0,4).join(', ')+')':'')+(sSceneBad.length?' ('+sSceneBad.slice(0,3).join(' | ')+')':''));
  const swrong=stold.filter(([nm,,t])=>nm!=='Moo' && new RegExp(nm+"'s (pussy|cunt|womb|clit|slit)","i").test(t)), sshort=stold.filter(([,,t])=>t.length<200).map(([nm,w])=>nm+' '+w), sleak=stold.filter(([,,t])=>LEAK.test(t));
  const AL=W.__lines().ANTHRO_LINES, sEnd=[];
  for (const k of STUDS){ const L=[['usual',AL[k]], ...Object.entries(SF[k]||{}).filter(([f])=>f!=='classic').map(([f,F])=>[f,F.lines||{}])];
    for (const [f,T] of L) for (const part of ['end','endOver']){ const p=(T&&T[part])||(AL[k]&&AL[k][part])||[]; if (p.length<8) sEnd.push(k+'/'+f+' '+part+' '+p.length); if (part==='endOver' && p.some(l=>/%h\b/.test(l))) sEnd.push(k+'/'+f+' endOver names a hole'); } }
  ok(!sEnd.length, '...how every one of them leaves you, eight lines or more, and never a hole named when he made do'+(sEnd.length?' ('+sEnd.slice(0,5).join(', ')+')':''));
  ok(!sshort.length && !swrong.length && !sleak.length, '...and every one of their stories runs whole, fills in, and never tells a male or a femboy about a pussy'+(sshort.length?' (short: '+sshort.slice(0,4).join(', ')+')':'')+(swrong.length?' ('+swrong[0][0]+' '+swrong[0][1]+')':'')+(sleak.length?' ('+sleak[0][1]+': '+(sleak[0][2].match(LEAK)||[''])[0]+')':''));

  // ── the whole story, told to Rex (male) and Pip (femboy): nobody hears about a pussy or a womb they haven't got ──
  const told=[]; const sample=['maze','stag','sowing','nixie','groomstand','vampire','crate','mistletoe','hollyking','bunnysuit','fairyring','cornmaiden'].filter(k=>TM[k]);
  for (const mn of [600,700]) for (const k of sample){ free(mn); W.__st().lastCmd&&W.__st().lastCmd.clear(); const n=sent.length; await say(221397,'?trap spring '+P(mn).name+' '+k,200); await done(mn,300); told.push([P(mn).name,all(n)]); free(mn); }
  const wrong=told.filter(([nm,t])=>new RegExp(nm+"'s (pussy|cunt|womb|clit|slit)","i").test(t));
  ok(told.every(([,t])=>t.length>200) && !wrong.length, 'the whole story runs, and a male or a femboy is never told about a pussy'+(wrong.length?' ('+wrong[0][0]+')':''));
  const leaks=told.filter(([,t])=>LEAK.test(t));
  ok(!leaks.length, '...and every line of it fills in'+(leaks.length?' ('+(leaks[0][1].match(LEAK)||[''])[0]+')':''));

  out(fails?'FAILED '+fails:'ALL PASS'); process.exit(fails?1:0);
})();
