// Conditioning add-on: only with ?hypno on, never deeper than they allow, only their herd leader (or a
// proprietor) runs it, species words fill the script, sessions count toward tiers, ?wake and ?safe stop it.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,degradeMe:true,hypno:true},
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
  eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-conditioning.user.js'),'utf8')); await wait(200);
  ok(W.Farmhand.list().some(a=>a.name==='conditioning'), 'conditioning registered');
  const d=()=>L().mods['conditioning'];
  let k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'condition Hana'}); await drain(1500);
  ok(/herd leader|hypno on/.test(beepsTo(k,221397).join(' ')), 'no session without ?hypno on');
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'condition Moo deep'}); await drain(5500);
  ok(/only allows Fun/.test(beepsTo(k,221397).join(' ')), 'never deeper than they allow');
  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'hypnolevel deep'}); await drain(1500);
  ok(d().people['500'].max==='deep', '?hypnolevel deep');
  global.setTimeout=(f,ms,...a)=>realTimeout(f, ms>=5000?15:ms, ...a);
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'condition Moo deep'}); await drain(5500);
  const lines=toWhom(k,500).filter(c=>/\[Voice\]/.test(c));
  ok(lines.length>=12, 'a whole deep session reached Moo as voice lines ('+lines.length+')');
  ok(lines.some(c=>/cow|moo/i.test(c)), 'cow words fill the script');
  ok(!sent.slice(k).some(([e,x])=>x&&x.Type==='Emote'), 'nothing in the public room');
  ok(d().people['500'].total===1 && d().people['500'].sessions.deep===1, 'the session counted');
  // ?wake stops one part way
  global.setTimeout=(f,ms,...a)=>realTimeout(f, ms>=5000?400:ms, ...a);
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'condition Moo fun'}); await wait(300);
  handlers.ChatRoomMessage({Sender:500,Type:'Whisper',Content:'wake',Target:260239}); await drain(1500);
  await wait(2000); ok(d().people['500'].total===1, '?wake ends it without counting');
  // safeword stops it too
  d().people['500'].total=2;
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'condition Moo fun'}); await wait(300);
  handlers.AccountBeep({MemberNumber:500,Message:'safe'}); await drain(1500); await wait(2000);
  ok(d().people['500'].total===2, '?safe stops it');
  // tiers
  global.setTimeout=(f,ms,...a)=>realTimeout(f, ms>=5000?15:ms, ...a);
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'condition Moo fun'}); await drain(5500);
  ok(d().people['500'].tier===1, 'three sessions: tier 1');
  const st=W.__stateFor(500); ok(st.mods && st.mods.conditioning, 'the Companion gets a conditioning card');
  const errs=warns.filter(w=>/add-on/.test(w)); ok(!errs.length, 'no add-on errors logged '+errs.join(' | '));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
