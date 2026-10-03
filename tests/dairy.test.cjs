// Dairy add-on: the milking stall uses its warmer lines (and the bot's own come back when it's off), and the
// weekly certificate replaces last week's.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,degradeMe:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],futa:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{"milking1":{X:5,Y:5}}});
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
  eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-dairy.user.js'),'utf8')); await wait(200);
  ok(W.Farmhand.list().some(a=>a.name==='dairy'), 'dairy registered');
  let k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'stats'}); await drain(1500);
  const p=L().people[500].prod; p.milk=50000; p.stallSaid=0;
  k=sent.length; W.__ms(); await drain();
  const em=sent.slice(k).filter(([e,x])=>x&&x.Type==='Emote').map(([e,x])=>x.Content).join(' | ');
  ok(/udder|teats|bucket|moo|rail/.test(em) && /Moo/.test(em), 'the milking stall uses a dairy line ('+em.slice(0,140)+')');
  ok(!/(lactat|mammary|secret)/i.test(em), 'no medical words');
  // certificate: a week passes
  const d=()=>L().mods['dairy'];
  W.__addons('tick'); p.totals.milked+=1500; W.__addons('tick');
  ok(d().week.ml['500']>=1500, 'this week'+"'"+'s milk is counted');
  d().week.key='2000-W01'; d().cert['500']={week:'1999-W52',grade:'D',ml:1,award:'x'};
  k=sent.length; W.__addons('tick'); await drain();
  ok(d().cert['500'].week==='2000-W01' && d().cert['500'].ml>=1500, 'the new certificate replaces the old one');
  ok(beepsTo(k,500).concat(toWhom(k,500)).some(m=>/certificate/.test(m)), 'they are told privately');
  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'certificate'}); await drain(5500);
  ok(/Grade/.test(beepsTo(k,500).join(' ')), '?certificate shows it');
  // switched off: the bot's own lines come back
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'addons off dairy'}); await drain(1500);
  p.milk=50000; p.stallSaid=0; p.stall=null; k=sent.length; W.__ms(); await drain();
  ok(sent.slice(k).some(([e,x])=>x&&x.Type==='Emote'&&/stall's cups pull|streams from/.test(x.Content)), 'with dairy off, the bot'+"'"+'s own line is used');
  const errs=warns.filter(w=>/add-on/.test(w)); ok(!errs.length, 'no add-on errors logged '+errs.join(' | '));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
