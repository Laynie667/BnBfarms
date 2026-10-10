// Breeding add-on: pregnancy stages with belly size, kicks nearby people see, cravings, staff-only stud
// bookings that tell both when they're on the farm, breeding week opt-in, midwives, simple pedigree.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,degradeMe:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],futa:true,breedable:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{"trough-1":{X:5,Y:5},"water-1":{X:10,Y:10}}});
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
  chars[1].Name='Laynie'; chars[2].Name='Moo'; chars[3].Name='Hana'; chars[3].MapData.Pos={X:7,Y:5};
  eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-breeding.user.js'),'utf8')); await wait(200);
  ok(W.Farmhand.list().some(a=>a.name==='breeding'), 'breeding registered');
  const d=()=>L().mods['breeding'];
  // make Moo pregnant, half way along
  let k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'stats'}); await drain(1500);
  const p=L().people[500].prod; const now=Date.now();
  p.preg={since:now-5*86400000*0.5, due:now+5*86400000*0.5, sires:[600], count:2, warned:false};
  k=sent.length; W.__addons('tick'); await drain();
  ok(d().preg['500'].stage==='showing', "half way along is the showin' stage");
  ok(sent.slice(k).some(([e,x])=>x&&/round out|showin|curve|belly/.test(String(x.Content))), 'a stage line goes out');
  const st=W.__stateFor(500).mods.breeding.cards[0];
  ok(st.title==="Expectin'" && st.lines.some(l=>l[0]==='Belly size' && l[1]==='3 of 5'), 'the Companion shows belly size 3 of 5');
  // heavy: kicks for people nearby
  p.preg.since=now-5*86400000*0.8; p.preg.due=now+5*86400000*0.2; d().preg['500'].kickAt=1;
  k=sent.length; W.__addons('tick'); await drain();
  ok(d().preg['500'].stage==='heavy', 'later on is heavy');
  ok(sent.slice(k).some(([e,x])=>x&&/kick|foot|rolls|ribs|belly|litter|landed/.test(String(x.Content))&&/Moo/.test(String(x.Content))), 'a kick emote goes out');
  // bookings: staff only
  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'book Hana Moo'}); await drain(1500);
  ok(!d().bookings.length, 'stock cannot add bookings');
  // (Hana and Moo here, both on the map) ...but Moo isn't breedable
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'book Moo Hana'}); await drain(1500);
  ok(d().bookings.length===1, 'staff add a booking ('+beepsTo(k,221397).join(' ')+')');
  k=sent.length; W.__addons('tick'); await drain();
  ok(d().bookings[0].told>0, 'both are told when both are here');
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'book done 1'}); await drain(5500);
  ok(!d().bookings.length, 'a booking is marked done');
  // breeding week opt-in
  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'breedweek on'}); await drain(5500);
  ok(d().optIn['500'], '?breedweek on');
  // midwife
  p.labour={until:Date.now()+600000,next:Date.now()+600000}; chars[1].MapData.Pos={X:6,Y:5};
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'midwife Moo'}); await drain(5500);
  ok(p.labour.midwife===221397, 'staff next to them can midwife');
  W.__addons('tick'); const pts0=(L().staffScore||{})['221397']?L().staffScore['221397'].pts:0;
  W.__addons('birth', 500, {male:1,female:1,futa:0}, [600]); await drain();
  ok(L().staffScore['221397'].pts===pts0+2, 'the midwife gets two staff points at the birth');
  // simple pedigree
  L().studbook=[{t:Date.now(),dam:500,sires:[600],kids:{male:1,female:1,futa:0}},{t:Date.now(),dam:500,sires:[600],kids:{male:0,female:2,futa:0}}];
  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'pedigree'}); await drain(5500);
  const ped=beepsTo(k,500).join(' ');
  ok(/As dam: 2 litters, 4 young · with Hana ×2/.test(ped), 'pedigree: dam totals ('+ped.replace(/\n/g,' | ')+')');
  const errs=warns.filter(w=>/add-on/.test(w)); ok(!errs.length, 'no add-on errors logged '+errs.join(' | '));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
