// The command queue: a burst of commands is answered in order (none lost), too many get a slow-down answer,
// a double tap runs once, a command that breaks still answers, and messages wait out a disconnect.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,degradeMe:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],futa:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{"glory-1":{X:5,Y:5},"glory-1-visitor":{X:5,Y:6}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,20,20),at(500,5,5),at(600,30,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:(W.__mutual||W.Player.FriendList).map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,500]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const realTimeout=setTimeout, wait=ms=>new Promise(r=>realTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
// wait till the bot's send queue is empty (it paces messages), plus the 5 s per-person command gap
const drain=async(min)=>{ await wait(min||300); for(let i=0;i<400;i++){ const s=W.__st(); if(!s.queue.length&&!s.urgent.length&&!s.sending) break; await wait(100);} await wait(200); };
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const toWhom=(k,mn)=>sent.slice(k).filter(([e,d])=>d&&d.Target===mn&&(d.Type==='Whisper'||d.Type==='Hidden')).map(([e,d])=>d.Content);
const beepsTo=(k,mn)=>sent.slice(k).filter(([e,d])=>e==='AccountBeep'&&d.MemberNumber===mn).map(([e,d])=>d.Message);
(async()=>{ await wait(3500);
  chars[1].Name='Laynie'; chars[2].Name='Moo'; chars[3].Name='Hana';
  const st=W.__st();
  // 1. six quick commands from someone without the Companion: all answered, in order (5 s apart each)
  W.__cfg.USER_COOLDOWN_S=0.3;
  let k=sent.length;
  for (const c of ['weather','keys','who','rules','species','doors']) handlers.AccountBeep({MemberNumber:500,Message:c});
  await wait(4000); await drain();
  const got=beepsTo(k,500);
  ok(got.length>=6, 'six quick commands all answered ('+got.length+' beeps)');
  const firstKeys=got.findIndex(m=>/^🔑 Moo/.test(m)), firstRules=got.findIndex(m=>/HOUSE RULES/.test(m));
  ok(firstKeys>=0 && firstRules>firstKeys, 'in the order they were sent');
  // 2. a flood: past ten waiting, they are told to slow down
  W.__cfg.USER_COOLDOWN_S=30;
  k=sent.length;
  for (let i=0;i<13;i++) handlers.AccountBeep({MemberNumber:500,Message:'weather '+i});
  await drain();
  ok(beepsTo(k,500).some(m=>/lot at once/.test(m)), 'too many at once gets a slow-down answer, not silence');
  st.cmdWaiting.delete(500); W.__cfg.USER_COOLDOWN_S=0.3;
  // 3. a double tap runs once
  await wait(500); k=sent.length;
  handlers.AccountBeep({MemberNumber:221397,Message:'weather'}); handlers.AccountBeep({MemberNumber:221397,Message:'weather'});
  await wait(1500); await drain();
  ok(beepsTo(k,221397).length===1, 'the same command twice in a row runs once');
  // 4. a command that breaks still answers
  W.Farmhand.register({ name:'broken', commands:{ boom:{ run(){ throw new Error('kaboom'); } } } });
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'boom'}); await drain(600);
  ok(beepsTo(k,221397).some(m=>/hit a snag/.test(m)) && !beepsTo(k,221397).some(m=>/Done/.test(m)), 'a command that throws says it hit a snag (never Done)');
  // 5. messages wait out a disconnect
  W.ServerSocket.connected=false; k=sent.length;
  handlers.AccountBeep({MemberNumber:221397,Message:'rules'}); await wait(2500);
  ok(beepsTo(k,221397).length===0, 'nothing is sent while the connection is down');
  W.ServerSocket.connected=true; await wait(2600); await drain();
  ok(beepsTo(k,221397).some(m=>/RULES/.test(m)), '...and it goes out once it is back');
  // 6. a stuck pacing timer can't freeze sending
  st.sending=true; st.sentAt=Date.now()-60000; k=sent.length;
  handlers.AccountBeep({MemberNumber:500,Message:'doors'}); await wait(1500); await drain();
  ok(beepsTo(k,500).length>=1, 'a stuck send timer unsticks itself');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
