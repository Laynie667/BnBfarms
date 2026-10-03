// Work add-on: chores only count at their place, staff points and the leaderboard, private write-ups
// (writer and recipient only, everybody else a count), opt-in inspections with an automatic checklist.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "700":{mn:700,name:"Jo",roles:["FARMHAND"],species:"",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,degradeMe:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],futa:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{"pens":{X:12,Y:12}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,20,20),at(500,5,5),at(600,30,30),at(700,3,3)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:(W.__mutual||W.Player.FriendList).map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,500,700]},
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
  chars[1].Name='Laynie'; chars[2].Name='Moo'; chars[3].Name='Hana'; chars[4].Name='Jo';
  eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-work.user.js'),'utf8')); await wait(200);
  ok(W.Farmhand.list().some(a=>a.name==='work'), 'work registered');
  const d=()=>L().mods['work'];
  // a chore with a place
  const jo=L().people[700]; jo.chore={text:'Muck out the pens @pens',at:Date.now()};
  let k=sent.length; handlers.AccountBeep({MemberNumber:700,Message:'done'}); await drain(1500);
  ok(/done at pens/.test(beepsTo(k,700).join(' ')) && jo.chore, "a placed chore doesn't count away from its place");
  chars[4].MapData.Pos={X:12,Y:13};
  k=sent.length; handlers.AccountBeep({MemberNumber:700,Message:'done'}); await drain(5500);
  ok(!jo.chore && L().staffScore['700'].pts===1, 'done at the place: counted, and a staff point');
  k=sent.length; handlers.AccountBeep({MemberNumber:700,Message:'leaderboard'}); await drain(5500);
  ok(/Jo: 1 pts/.test(beepsTo(k,700).join(' ')), 'the leaderboard shows it');
  // write-ups
  k=sent.length; handlers.AccountBeep({MemberNumber:700,Message:'writeup Moo late'}); await drain(5500);
  ok(!d().writeups.length, 'farmhands cannot write people up');
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'writeup Moo late for milking again'}); await drain(1500);
  ok(d().writeups.length===1 && beepsTo(k,500).some(m=>/late for milking/.test(m)), 'a proprietor writes Moo up, and Moo is told');
  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'writeups'}); await drain(5500);
  ok(/late for milking/.test(beepsTo(k,500).join(' ')), 'Moo can read it');
  k=sent.length; handlers.AccountBeep({MemberNumber:700,Message:'writeups Moo'}); await drain(5500);
  const jv=beepsTo(k,700).join(' ');
  ok(!/late for milking/.test(jv) && /1 more/.test(jv), 'other staff only see a count ('+jv.replace(/\n/g,' | ')+')');
  // inspections
  k=sent.length; handlers.AccountBeep({MemberNumber:700,Message:'inspections on'}); await drain(5500);
  ok(d().optIn['700'], 'staff opt in to inspections');
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'inspection start 0'}); await drain(5500);
  ok(d().insp && d().insp.items && d().insp.items.length>=3 && d().insp.staff.includes(700), 'an inspection builds its checklist and knows who is in');
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'inspection fail pen 2 gate open'}); await drain(5500);
  ok(d().insp.items.some(i=>/gate open/.test(i.what)&&!i.ok), 'the inspector adds a failed item');
  const p0=L().staffScore['700'].pts;
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'inspection end'}); await drain(5500);
  ok(!d().insp && d().last && /Score: \d+\/10/.test(beepsTo(k,221397).join(' ')), 'it ends with a score');
  ok(L().staffScore['700'].pts>=p0 && beepsTo(k,700).some(m=>/Inspection's done/.test(m)), 'opted-in staff hear the result');
  const errs=warns.filter(w=>/add-on/.test(w)); ok(!errs.length, 'no add-on errors logged '+errs.join(' | '));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
