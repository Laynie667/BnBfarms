// Names that fit more than one person: Auri (180836) is on the books; a different, unregistered "Auri" is in
// the room. Commands by name reach the registered Auri, not the stranger. A real tie (two unregistered Auris)
// isn't guessed: the bot lists them with member numbers.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,degradeMe:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],futa:true},
 "180836":{mn:180836,name:"Auri",roles:["FARMHAND","LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]}
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
  // a different "Auri" is in the room; the real Auri (180836) is away
  const other=at(444,15,15); other.Name='Auri'; chars.push(other);
  let k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'record Auri'}); await drain(2500);
  ok(beepsTo(k,221397).some(m=>/FARM RECORD/.test(m)&&/180836/.test(m)), 'by name, the bot finds the Auri on the books, not the stranger');
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'unregister Auri livestock'}); await drain(2500);
  ok(L().people[180836] && L().people[180836].roles.join()==='FARMHAND', '...and role changes reach her too');
  // now the real Auri is here as well: still her (she's the one on the books)
  const real=at(180836,16,16); real.Name='Auri'; real.Nickname='Auri'; chars.push(real);
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'record Auri'}); await drain(2500);
  ok(beepsTo(k,221397).some(m=>/180836/.test(m)), 'with both in the room, still the one on the books');
  // a real tie: two Auris, neither on the books
  delete L().people[180836];
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'record Auri'}); await drain(2500);
  const said=beepsTo(k,221397).join(' ');
  ok(/More than one person goes by "Auri"/.test(said) && /444/.test(said) && /180836/.test(said), 'a real tie lists them with member numbers ('+said.slice(0,120)+')');
  // from the live recording: Laynie's nickname is "Alexia's Laynie" and Alexia is in the room too.
  // A line about Laynie names Laynie, not Alexia (Alexia's Companion was posting Laynie's scene lines)
  const lay=chars.find(c=>c.MemberNumber===221397); lay.Name='Laynie'; lay.Nickname="Alexia's Laynie";
  const alx=at(232922,21,20); alx.Name='Alexia'; chars.push(alx);
  const line="rory is right there, trembling, and Alexia's Laynie pulls their hand away.";
  ok(!W.__namesHere(line).includes(232922) && W.__namesHere(line).includes(221397), "\"Alexia's Laynie\" names Laynie, not Alexia");
  ok(W.__namesHere("Alexia rubs Alexia's Laynie's belly.").includes(232922), '...but Alexia on her own still counts');
  ok(W.__about("Alexia's Laynie kneels beside the pail.")===221397, 'and a line starting with her nickname is about Laynie');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
