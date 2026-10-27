// Oct 27 (Laynie: "more trap versions"): the furry studs come in more than one version now, like the water beast.
// The werewolf, the minotaur, the stag, the fox brothers, the pride's lion, the ram and the wolf den each have 3 or 4
// besides the usual one: every one runs start to finish (bred, and over them), says who it was, does its own thing,
// and ?traps <kind> lists them.
const fs=require('fs'), path=require('path');
const CUR=JSON.parse(fs.readFileSync(path.join(__dirname,'..','package.json'),'utf8')).versions.companion;   // (the current Companion: no update notice mid-test)
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,trapsOn:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "700":S(700,"Pip",{gender:"femboy",species:"bunny",breedable:false})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pasture":{X:20,Y:40},"trap":{X:22,Y:40}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(700,30,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; W.__date="2026-08-10T12:00:00";
eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1500); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
const marks=(n,mn)=>sent.slice(n).filter(([e,d])=>d&&d.Content==='FarmhandMsg'&&d.Dictionary&&d.Dictionary.type==='mark'&&(!mn||d.Target===mn)).map(([e,d])=>d.Dictionary);
const free=(...mns)=>{ for(const mn of mns){ const r=P(mn); r.trapAt=0; r.penned=null; r.gear=null; r.trapQuiet=0; r.trapWait=null; r.benched=null; r.quietUntil=0; if(W.__st().trapRuns) W.__st().trapRuns.delete(mn); } };
const done=async(mn,ms)=>{ for(let i=0;i<80;i++){ await wait(250); if(!(W.__st().trapRuns&&W.__st().trapRuns.has(mn))) break; } await wait(ms||600); };
const LEAK=/\{(nv|nc|nt|fu|fb|nb|v|c|t|f|m)\}|%[a-z]{1,8}\b|\bundefined\b|\bNaN\b|\[object/;
const tallyOf=mn=>{ const t=(P(mn).prod||{}).tally; return t?t.n:0; };
// spring one version of a stud on somebody, and see it through
async function run(kind, id, mn, name, pre){
  W.__studForce={[kind]:id}; free(mn); P(mn).prod.milk=400; if (pre) pre();
  const n=sent.length, t0=tallyOf(mn);
  await say(221397,'?trap spring '+name+' '+kind,400);
  const pen=P(mn).penned?JSON.parse(JSON.stringify(P(mn).penned)):null;
  await done(mn,700);
  W.__studForce=null;
  const said=all(n);
  return { said, named:said.split(" | ").filter(t=>t.includes(name)&&!/Sprung on|stateDiff/.test(t)).length, loads:tallyOf(mn)-t0, pen, n };
}
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.08; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; cfg.SYM.TRAP_CHANCE=0; cfg.SYM.LATEX_TRAP_CHANCE=0; cfg.SEND_INTERVAL_MS=2; cfg.TRAP_WRITE_CHANCE=0;
  ['Laynie','Moo','Pip'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,700]) await say(mn,'?stats',700);
  for (const mn of [500,700,221397,260239]) handlers.ChatRoomMessage({Sender:mn,Type:"Hidden",Content:"FarmhandMsg",Dictionary:{v:2,type:"hello",ver:CUR}});
  await wait(600);
  const F=W.__studForms(), KINDS=["werewolf","minotaur","stag","foxden","lionpride","ramstud","wolves"];

  // ── what there is ──
  const extra=k=>Object.keys(F[k]||{}).filter(id=>id!=="classic");
  ok(KINDS.every(k=>F[k] && F[k].classic && extra(k).length>=3), 'the 7 furry studs each have the usual one and 3 or 4 more ('+KINDS.map(k=>k+": "+extra(k).join("/")).join(", ")+')');
  ok(KINDS.reduce((a,k)=>a+extra(k).length,0)===23, '23 new versions in all');
  ok(KINDS.every(k=>extra(k).every(id=>{ const f=F[k][id], l=f.lines||{}; return f.name && f.w>0 && l.beats && l.beats.length===3 && l.in && l.in.length===2 && l.over && l.end && l.end.length>=2 && l.endOver && l.endOver.length>=1; })), 'every version has a name, a weight, and its own beginnin\', middle and endin\' (bred, and over them)');
  ok(/lion-man/.test(W.__farmSets().TRAP_KINDS.lionpride.what), 'the pride\'s lion reads as the lion-man he is');

  // ── every one, start to finish, bred (Moo) and over them (Pip isn't breedable) ──
  const silent=[], broke=[], told=[], counted=[];
  for (const k of KINDS) for (const id of extra(k)){
    for (const [mn,name] of [[500,'Moo'],[700,'Pip']]){
      const R=await run(k, id, mn, name);
      if (/won't spring/.test(R.said)) silent.push(k+"/"+id+"/"+name+" refused: "+(R.said.match(/won't spring[^|]*/)||[""])[0]);
      else if (R.named<6) silent.push(k+"/"+id+"/"+name+" ("+R.named+")");
      if (LEAK.test(R.said)) broke.push(k+"/"+id+"/"+name+": "+(R.said.match(/.{0,50}(\{(nv|nc|nt|fu|fb|nb|v|c|t|f|m)\}|%[a-z]{1,8}\b|undefined|NaN|\[object).{0,50}/)||[""])[0]);
      if (!R.said.includes("That was "+F[k][id].name)) told.push(k+"/"+id+"/"+name);
      if (mn===500 && !(((P(500).studForms||{})[k]||{})[id]>=1)) counted.push(k+"/"+id);
    }
  }
  ok(!silent.length, 'every version runs its whole story on both ('+(silent.join(", ")||"all 23")+')');
  ok(!broke.length, '...and every line fills in ('+broke.join(" ; ")+')');
  ok(!told.length, 'the whisper after says which one it was ('+(told.join(", ")||"all")+')');
  ok(!counted.length, 'and it\'s remembered who\'s had who ('+(counted.join(", ")||"all")+')');

  // ── what each one does ──
  { const A=await run("werewolf","alpha",500,"Moo"), C=await run("werewolf","classic",500,"Moo");
    ok(A.pen && C.pen && A.pen.until-Date.now() > C.pen.until-Date.now() + 60000, 'the grizzled alpha keeps them tied longer than the usual werewolf');
    ok(A.loads===3 && C.loads===3, 'both breed them three times ('+A.loads+', '+C.loads+')');
    ok(W.__studDef("werewolf","alpha").ml > W.__studDef("werewolf","classic").ml, '...but the alpha gives more each time'); }
  { const R=await run("werewolf","newturned",500,"Moo"); ok(R.loads===6, 'the new-turned one knots them six times ('+R.loads+')'); }
  { const R=await run("minotaur","oldbull",500,"Moo"); ok(R.loads===1 && W.__studDef("minotaur","oldbull").ml > 2*W.__studDef("minotaur","classic").ml, 'the old herd bull: one load, more than twice the size ('+R.loads+')'); }
  { const R=await run("minotaur","hothead",500,"Moo"); ok(R.loads===4, 'the hothead goes four times ('+R.loads+')'); }
  { const R=await run("foxden","guess",500,"Moo"); ok(R.loads===6, 'the guessin\' game is six rounds ('+R.loads+')'); }
  { const R=await run("lionpride","lazy",500,"Moo"); ok(R.loads===5, 'the lazy king: five times, all afternoon ('+R.loads+')'); }
  { const R=await run("wolves","lone",500,"Moo"); ok(R.loads===2 && W.__studDef("wolves","lone").ml > 2*W.__studDef("wolves","classic").ml, 'the lone wolf: two huge knots ('+R.loads+')');
    ok(!/The pack circles|passed round the pack|Every wolf that's had a turn|alpha takes %n by the scruff/.test(R.said), '...and he doesn\'t borrow the pack\'s middle'); }
  // the ones with a middle of their own don't borrow the usual one's
  { const R=await run("foxden","silver",500,"Moo");
    ok(!/fox brothers tie|swap places so fast|Every fox that finishes|tied with ribbons/.test(R.said) && /mantel|firelight|Marvellous|wine glass|punctuation|turnin' pages|tail curls/.test(R.said), 'the silver fox has his own middle, not the brothers\''); }
  ok(["silver","lazy","lone","snow","maze","oldbull","show","shy","whitehart"].every(id=>KINDS.some(k=>F[k][id] && F[k][id].scene && F[k][id].scene.length===2 && F[k][id].scene.every(p=>p.length>=4))), 'nine versions bring their own two middle beats');
  ok(W.__studDef("stag","whitehart").bonus > W.__studDef("stag","classic").bonus && W.__studDef("lionpride","blackmane").bonus > W.__studDef("lionpride","classic").bonus, 'the white hart and the black-maned king are likelier to take');
  // the blood moon wolf's bite: a heat, unless heat's in their limits
  { P(500).prod.heat=null; const R=await run("werewolf","bloodmoon",500,"Moo");
    ok(P(500).prod.heat && P(500).prod.heat.until>Date.now() && /bite's put you in heat/.test(R.said), 'the blood moon wolf\'s bite puts Moo in heat');
    P(500).prod.heat=null; P(500).limits="no heat"; const R2=await run("werewolf","bloodmoon",500,"Moo");
    ok(!(P(500).prod.heat && P(500).prod.heat.until>Date.now()) && /It'll fade/.test(R2.said), '...but not with heat in their limits'); P(500).limits=""; }
  // what's written on them after
  { const R=await run("minotaur","show",500,"Moo"); await wait(3300);
    ok(marks(R.n,500).some(m=>m.write&&m.write.line==="BEST IN SHOW"), 'the show bull leaves BEST IN SHOW written on them'); }
  { const R=await run("ramstud","raddle",500,"Moo"); await wait(3300);
    ok(marks(R.n,500).some(m=>m.write&&m.write.line==="TUPPED"), 'the tup in his raddle marks them TUPPED'); }

  // ── which one it is, left to chance ──
  { const seen={}; for (let i=0;i<600;i++){ const f=W.__studForm(500,"werewolf"); seen[f.id]=(seen[f.id]||0)+1; }
    ok(Object.keys(F.werewolf).every(id=>seen[id]>0) && seen.classic===Math.max(...Object.values(seen)), 'left to chance, the usual one comes most and every other one turns up ('+JSON.stringify(seen)+')'); }
  ok(W.__studForm(500,"bull").id==="classic", 'studs without versions are just themselves');

  // ── ?traps werewolf ──
  { let n=sent.length; await say(500,'?traps werewolf',700);
    ok(/grizzled alpha \(had you \d+×\)/.test(all(n)) && /moon brothers/.test(all(n)), '?traps werewolf lists the versions, and which have had you'); }

  ok(!warns.some(w=>/stud form|trap /.test(w)), 'no errors '+warns.filter(w=>/stud form|trap /.test(w)).slice(0,2).join(' | '));
  out(fails ? '\n❌ '+fails+' failed' : '\n✅ all good'); process.exit(fails?1:0);
})();
