// The room whitelist follows the books: registering puts someone on it, ?unregister <who> takes them off
// the books and off it, ?unregister <who> <role> only takes that role (the last one = off the books),
// proprietors can't be unregistered or lose that role, and people whitelisted by hand are never touched.
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
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],Whitelist:[777],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
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
  // the fake server keeps the room's whitelist like the real one does
  const realSend=W.ServerSend; W.ServerSend=(ev,d)=>{ realSend(ev,d); if(ev==='ChatRoomAdmin'){ const wl=W.ChatRoomData.Whitelist; if(d.Action==='Whitelist'&&!wl.includes(d.MemberNumber)) wl.push(d.MemberNumber); if(d.Action==='Unwhitelist'&&wl.includes(d.MemberNumber)) wl.splice(wl.indexOf(d.MemberNumber),1);} };
  const WL=()=>W.ChatRoomData.Whitelist;
  let k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'record'}); await drain(2500);
  ok(WL().includes(500) && WL().includes(221397), 'everyone already on the books goes on the whitelist');
  ok(WL().includes(777), 'someone whitelisted by hand stays on it');
  // register someone new
  await wait(5200); handlers.AccountBeep({MemberNumber:221397,Message:'register 600 livestock guest'}); await drain(2500);
  ok(WL().includes(600), 'registering puts them on the whitelist');
  // take away one role: still registered, still whitelisted
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'unregister Hana guest'}); await drain(2500);
  ok(L().people[600] && L().people[600].roles.join()==='LIVESTOCK' && WL().includes(600), '?unregister Hana guest only takes that role');
  // the last role: off the books and off the whitelist
  await wait(5200); handlers.AccountBeep({MemberNumber:221397,Message:'unregister Hana livestock'}); await drain(2500);
  ok(!L().people[600] && !WL().includes(600) && L().archive[600], 'taking the last role takes them off the books and the whitelist (paperwork archived)');
  // full unregister
  await wait(5200); handlers.AccountBeep({MemberNumber:221397,Message:'unregister Moo'}); await drain(2500);
  ok(!L().people[500] && !WL().includes(500), '?unregister Moo: off the books and off the whitelist');
  // proprietors: never
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'unregister Laynie'}); await drain(1500);
  ok(L().people[221397] && WL().includes(221397) && beepsTo(k,221397).some(m=>/can't unregister a proprietor/.test(m)), 'a proprietor can\'t be unregistered');
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'unregister Laynie proprietor'}); await drain(1500);
  ok(L().people[221397].roles.includes('PROPRIETOR'), '...or lose the proprietor role');
  // staff who are also livestock keep both through pasture and back on duty; staff-only lose the borrowed livestock
  L().people[700]={mn:700,name:'Jo',roles:['FARMHAND','LIVESTOCK'],onDuty:true,herds:[],tempKeys:[],cover:[]};
  L().people[701]={mn:701,name:'Kit',roles:['FARMHAND'],onDuty:true,herds:[],tempKeys:[],cover:[]};
  chars.push(at(700,12,12),at(701,13,13)); chars[chars.length-2].Name='Jo'; chars[chars.length-1].Name='Kit';
  for (const mn of [700,701]){ handlers.AccountBeep({MemberNumber:mn,Message:'pasture'}); await drain(1500); }
  await wait(5200); for (const mn of [700,701]){ handlers.AccountBeep({MemberNumber:mn,Message:'onduty'}); await drain(1500); }
  ok(L().people[700].roles.includes('LIVESTOCK') && L().people[700].roles.includes('FARMHAND'), 'staff who are really livestock stay livestock after pasture and back on duty');
  ok(!L().people[701].roles.includes('LIVESTOCK'), 'staff who only borrowed livestock for pasture lose it again');
  // removing staff from someone who's also livestock leaves them livestock (and whitelisted)
  await wait(5200); handlers.AccountBeep({MemberNumber:221397,Message:'unregister Jo farmhand'}); await drain(2500);
  ok(L().people[700].roles.join()==='LIVESTOCK' && WL().includes(700), 'taking staff from Jo leaves her livestock, still whitelisted');
  // the hand-whitelisted one is still there after all that
  ok(WL().includes(777), 'the hand-whitelisted person was never touched');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
