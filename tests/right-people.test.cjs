// Lines go to the right people: a greeting for someone who just walked in (not yet placed on the map) waits
// for them and goes to them, never to everyone; a scene line about someone reaches them and Companion users
// nearby (drawn as a room line), but never arrives as a whisper to a bystander without the Companion.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,degradeMe:true},
 "600":{mn:600,name:"Mira",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "800":{mn:800,name:"Arya",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],milkable:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{"glory-1":{X:5,Y:5},"glory-1-visitor":{X:5,Y:6}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,9,9),at(500,5,5),at(600,6,6),at(800,10,10)];
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
  chars[1].Name='Laynie'; chars[2].Name='Moo'; chars[3].Name='Mira'; chars[4].Name='Arya';
  const whispersTo=(k,mn)=>sent.slice(k).filter(([e,d])=>d&&d.Type==='Whisper'&&d.Target===mn).map(([e,d])=>d.Content);
  const hiddenTo=(k,mn)=>sent.slice(k).filter(([e,d])=>d&&d.Type==='Hidden'&&d.Target===mn).map(([e,d])=>d.Dictionary);
  // 1. Jackie walks in; the game hasn't placed her on the map yet
  const jackie=at(900,-1,-1); jackie.Name='Jackie'; chars.push(jackie);
  let k=sent.length; handlers.ChatRoomSyncMemberJoin({Character:{MemberNumber:900,Name:'Jackie'}});
  await wait(2500); await drain();
  ok(!whispersTo(k,600).some(c=>/Jackie/.test(c)) && !whispersTo(k,221397).some(c=>/Jackie/.test(c)), 'nobody else gets Jackie\'s greeting while she isn\'t placed yet');
  jackie.MapData.Pos={X:7,Y:7}; await wait(4500); await drain();
  ok(whispersTo(k,900).some(c=>/Jackie/.test(c)), 'once she\'s on the map, Jackie gets her greeting');
  ok(!whispersTo(k,600).some(c=>/Jackie/.test(c)), '...and Mira, standing right next to her without the Companion, does not');
  // 2. Arya is milked; Laynie stands right by her without the Companion, then with it
  k=sent.length; handlers.AccountBeep({MemberNumber:800,Message:'stats'}); await drain(1500);
  L().people[800].prod.milk=5000;
  global.setTimeout=(f,ms,...a)=>realTimeout(f, ms>=10000&&ms<=30000?20:ms, ...a);
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'stats'}); await drain(600);
  L().people[500].roles.push('HERDMASTER');
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'milk Arya 200'}); await drain(2500);
  ok(whispersTo(k,800).some(c=>/Arya/.test(c)), 'Arya gets her own milking scene');
  ok(!whispersTo(k,221397).some(c=>/Arya/.test(c)), 'Laynie, a bystander without the Companion, gets no whispers about Arya');
  // Laynie with the Companion: it's drawn in her chat as a room line instead
  handlers.ChatRoomMessage({Sender:221397,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,type:'hello',ver:'0.10.1'}}); await drain(800);
  L().people[800].prod.milk=5000; W.__st().sceneRun.clear();
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'milk Arya 200'}); await drain(2500);
  ok(hiddenTo(k,221397).some(d=>d.type==='roomline'&&/Arya/.test(d.text)), 'with the Companion, Laynie sees it drawn as a normal room line');
  ok(!whispersTo(k,221397).some(c=>/Arya/.test(c)), '...and still no whispers');
  // 3. who a line is about: exact names, the earliest one, never a common word
  const sugar=at(950,15,15); sugar.Name='Sugar'; chars.push(sugar); L().people[950]={mn:950,name:'Sugar',roles:['LIVESTOCK'],onDuty:true,herds:[],tempKeys:[],cover:[]};
  ok(W.__about("Don't you worry, sugar, Moo is fine.")===500, 'a lowercase "sugar" in the bot\'s talk never means the player called Sugar');
  ok(W.__about("Mira watches as Moo gets milked.")===600, 'the person named first is the one it\'s about');
  ok(W.__about("Nobody in particular.")===null, 'no name, nobody');
  // 4. announcements reach everyone, even when they name somebody
  k=sent.length; W.__announce("Best milk of the week goes to Moo!"); await drain();
  const everyone=[221397,500,600,800,900,950].every(mn=>sent.slice(k).some(([e,d])=>d&&d.Target===mn&&(d.Type==='Whisper'||d.Type==='Hidden')));
  ok(everyone, 'a farm announcement naming Moo reaches everybody on the map');
  // 5. a short reply in room chat goes to whoever asked, not whoever it names
  k=sent.length; W.__reply(600, "Moo is right over by the trough, hon.", "chat"); await drain();
  ok(whispersTo(k,600).some(c=>/trough/.test(c)) || hiddenTo(k,600).length>0, 'Mira, who asked, gets the answer');
  ok(!whispersTo(k,500).some(c=>/trough/.test(c)), '...and Moo, who it mentions, doesn\'t get it whispered');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
