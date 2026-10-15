// The third batch of traps (Oct 15) and the farm's equipment and messes: the stocks put real gear on and leave cream,
// the breedin' wheel fills them three times, the mud pit pulls in a second subject and the winner has the loser,
// the corn maze can be escaped (or it catches them), the incubator grows a clutch, the collection bench fills the vat,
// and the auction trap puts them on the block.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip",{gender:"femboy",species:"bunny"})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"maze-start":{X:40,Y:40},"maze-exit":{X:44,Y:40}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,30,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==='ChatRoomCharacterMapDataUpdate'||ev==='ChatRoomCharacterUpdate'){} }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2200); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>String(d.Content||d.Message)).join(' | ');
const moveTo=(mn,X,Y)=>{ chars.find(c=>c.MemberNumber===mn).MapData.Pos={X,Y}; };
const free=(...mns)=>{ for(const mn of mns){ const r=P(mn); r.trapAt=0; r.penned=null; r.gear=null; r.trapQuiet=0; r.trapWait=null; r.maze=null; r.benched=null; if(W.__st().trapRuns) W.__st().trapRuns.delete(mn); } };
const done=async(mn,ms)=>{ for(let i=0;i<60;i++){ await wait(250); if(!(W.__st().trapRuns&&W.__st().trapRuns.has(mn))) break; } await wait(ms||600); };
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.12; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; cfg.SYM.TRAP_CHANCE=0;
  ['Laynie','Moo','Rex','Pip'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700]) await say(mn,'?stats',900);
  const prod=mn=>P(mn).prod;
  // the stocks: real gear while it has them, and cream after
  let n=sent.length; await say(221397,'?trap spring Moo stocks',300); for(let i=0;i<20&&!(W.__st().trapRuns&&W.__st().trapRuns.has(500));i++) await wait(150);
  ok(W.__farmGear(500).some(g=>g.name==='Fair Stocks'&&g.slot==='device'), 'the stocks put the Fair Stocks on them (a device piece)');
  await done(500);
  ok(/pie/i.test(all(n)) && P(500).pied>0, 'cream pies, counted ('+P(500).pied+')');
  ok(!W.__farmGear(500).some(g=>g.name==='Fair Stocks'), 'and the stocks come off when it lets go');
  // the breedin' wheel: three loads in them
  free(500); const held0=Object.values(prod(500).held).reduce((a,b)=>a+b,0);
  n=sent.length; await say(221397,'?trap spring Moo wheel',300); await done(500);
  ok(/spin|wheel/i.test(all(n)) && Object.values(prod(500).held).reduce((a,b)=>a+b,0)>held0+200, 'the breedin\' wheel: three spins, and they\'re filled');
  // the incubator: a clutch they carry gets bigger
  free(500); prod(500).eggs={n:10,by:-2,since:Date.now()-7200000,layAt:Date.now()+86400000};
  await say(221397,'?trap spring Moo incubator',300); await done(500);
  ok(prod(500).eggs.n===15 && prod(500).eggs.layAt<Date.now()+31*60000, 'the incubator: half again as many eggs, and soon ('+prod(500).eggs.n+')');
  // the collection bench: studs only, into the vat
  free(500,600); n=sent.length; await say(221397,'?trap spring Moo collection',1500);
  ok(/no cock/.test(all(n)), 'the collection bench is for studs');
  prod(600).semen=40; const vat0=P(600).vat||0; await say(221397,'?trap spring Rex collection',300); await done(600);
  ok((P(600).vat||0)>vat0 && prod(600).semen<1, 'the collection bench drains a stud into the vat');
  // the mud pit: a second subject close by is pulled in; the winner has the loser
  free(500,600); moveTo(600,16,10); n=sent.length; await say(221397,'?trap spring Moo mudpit',300);
  await done(500,2600);
  ok(/mud pit's got you too/.test(all(n)), 'the mud pit pulls in the subject next to them');
  ok(/Winner|pinned|Pinned|lost/i.test(all(n)) && /mud/i.test(all(n)), 'they wrestle, and somebody wins');
  free(500,600); moveTo(600,60,60); n=sent.length; await say(221397,'?trap spring Moo mudpit',1500);
  ok(/nobody close by/.test(all(n)), 'no partner close by, no mud pit');
  // the corn maze: in, and out the exit in time
  free(500); moveTo(500,15,10); n=sent.length; await say(221397,'?trap spring Moo maze',300); await done(500);
  ok(P(500).maze && P(500).maze.until>Date.now(), 'the corn maze has them, and the clock is running');
  moveTo(500,44,40); W.__mazeTick(); await wait(2600);
  ok(!P(500).maze && /out of the corn maze|way out of the maze|bursts out/i.test(all(n)), 'out the maze-exit in time: free');
  // time runs out: it catches them
  free(500); moveTo(500,15,10); await say(221397,'?trap spring Moo maze',300); await done(500);
  P(500).maze.until=Date.now()-1; n=sent.length; W.__mazeTick(); await done(500,800);
  ok(/corn/i.test(all(n)) && !P(500).maze, 'out of time: the thing in the corn finds them');
  // the auction trap puts them on the block
  free(500); n=sent.length; await say(221397,'?trap spring Moo auction',300); await done(500,900);
  ok(W.__lend() && W.__lend().mn===500 && /bid/i.test(all(n)), 'the auction trap puts them on the block, and the yard can bid');
  ok(warns.filter(w=>/trap|mess|maze/i.test(w)).length===0, 'no errors '+warns.filter(w=>/trap|mess|maze/i.test(w)).join(' | ').slice(0,200));
  out(fails?'FAIL':'ALL PASSED'); process.exit(fails?1:0);
})();
