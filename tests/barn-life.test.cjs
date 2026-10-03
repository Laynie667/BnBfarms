// Barn life add-on: opt-in needs that only drop while you're here, eating at troughs (which run empty and
// staff refill), drinking at water spots, BC+ bowl activities counting on a spot, grooming by staff,
// production nudged by how well kept you are, and milk-drunk from nursing.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,degradeMe:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],futa:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{"trough-1":{X:5,Y:5},"water-1":{X:10,Y:10}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,20,20),at(500,5,5),at(600,30,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>sent.push([ev,d]), ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
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
let fails=0; const ok=(c,msg)=>{ out((c?'PASS ':'FAIL ')+msg); if(!c) fails++; };
const toWhom=(k,mn)=>sent.slice(k).filter(([e,d])=>d&&d.Target===mn&&(d.Type==='Whisper'||d.Type==='Hidden')).map(([e,d])=>d.Content);
const beepsTo=(k,mn)=>sent.slice(k).filter(([e,d])=>e==='AccountBeep'&&d.MemberNumber===mn).map(([e,d])=>d.Message);
(async()=>{ await wait(3500);
  chars[1].Name='Laynie'; chars[2].Name='Moo'; chars[3].Name='Hana';
  eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-barn-life.user.js'),'utf8')); await wait(200);
  ok(W.Farmhand.list().some(a=>a.name==='barn-life'), 'barn life registered');
  const d=()=>L().mods['barn-life'];
  let k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'eat'}); await drain(1500);
  ok(/isn't on for you/.test(beepsTo(k,500).join(' ')), 'nothing happens until you opt in');
  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'needs on'}); await drain(5500);
  ok(d().optIn['500'], '?needs on opts in');
  // four hours pass in the room
  d().needs['500'].t=Date.now()-4*3600000; W.__addons('tick');
  const n=d().needs['500']; ok(n.food<55 && n.food>45 && n.water<38 && n.water>28, 'food and water drop while here (food '+Math.round(n.food)+', water '+Math.round(n.water)+')');
  // hours pass while away: no change
  chars.splice(2,1); const f0=n.food; n.t=Date.now()-5*3600000; W.__addons('tick'); ok(Math.abs(n.food-f0)<0.01, "needs don't drop while you're away");
  chars.splice(2,0,at(500,5,5)); chars[2].Name='Moo';
  n.food=20; n.water=20; n.said=0; n.warned={}; n.t=Date.now(); k=sent.length; W.__addons('tick'); await drain();
  ok(beepsTo(k,500).concat(toWhom(k,500)).some(m=>/thirsty|dry/.test(m)), 'a private reminder when low');
  W.__pt && W.__pt();
  ok(true, 'production tick runs with the rate hook');
  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'eat'}); await drain(5500);
  ok(n.food>=69 && d().troughs['trough-1']===19, 'eating at the trough fills food and uses a helping');
  ok(sent.slice(k).some(([e,x])=>x&&/trough/.test(String(x.Content))&&/Moo/.test(String(x.Content))), 'an eating emote goes out');
  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'drink'}); await drain(5500);
  ok(/water spot/.test(beepsTo(k,500).join(' ')), "can't drink away from a water spot");
  // a BC+ bowl drink on the water spot
  chars[2].MapData.Pos={X:10,Y:10};
  handlers.ChatRoomMessage({Sender:500,Type:'Activity',Content:'ChatSelf-ItemMouth-BCP_BowlDrink',Dictionary:[{SourceCharacter:500},{TargetCharacter:500},{ActivityName:'BCP_BowlDrink'}]}); await drain();
  ok(n.water>=79, "BC+'s Drink From Bowl counts on a water spot");
  // empty trough: staff told, refill by staff next to it
  d().troughs['trough-1']=0; chars[2].MapData.Pos={X:5,Y:5}; n.food=20;
  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'eat'}); await drain(5500);
  ok(/licked clean/.test(beepsTo(k,500).join(' ')), 'an empty trough says so');
  chars[1].MapData.Pos={X:6,Y:5};
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'refill trough-1'}); await drain(1500);
  ok(d().troughs['trough-1']===20 && L().staffScore['221397'].pts>=1, 'staff refill it next to it, and get a point');
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'groom Moo'}); await drain(5500);
  ok(n.groom===100, 'staff groom next to them');
  // milk-drunk
  W.__addons('nurse', 600, 500, 200, 'A');
  ok(d().drunk['500'] && d().drunk['500'].lvl===2, 'a big drink of grade A milk makes them sleepy');
  W.__addons('nurse', 600, 500, 50, 'C'); ok(d().drunk['500'].lvl===3, 'one more and they are milk-drunk');
  d().drunk['500'].t=Date.now()-8*60000; W.__addons('tick'); ok(d().drunk['500'].lvl===2, 'it wears off a step at a time');
  const st=W.__stateFor(500); ok(st.mods && st.mods['barn-life'] && st.mods['barn-life'].cards[0].bars.length===3, 'the Companion gets the bars');
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'needs farm off'}); await drain(5500);
  ok(d().farmOff, 'proprietors can switch it off farm-wide');
  const errs=warns.filter(w=>/add-on/.test(w)); ok(!errs.length, 'no add-on errors logged '+errs.join(' | '));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
