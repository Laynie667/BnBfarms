// Glory stalls add-on: it plugs into the bot, runs a full simulated scene in private lines to the person
// in the stall, counts it, pauses for a real visitor, keeps names off the public board, and staff can
// hand out punishment shifts. Timers are squeezed so the ~5 minute scene runs in a second.
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
  ok(W.Farmhand && typeof W.Farmhand.register==='function', 'the bot opens window.Farmhand for add-ons');
  eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-glory-stalls.user.js'),'utf8'));
  await wait(200);
  ok(W.Farmhand.list().some(a=>a.name==='glory-stalls'), 'the glory stalls add-on registered');
  let k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'addons'}); await wait(1500);
  ok(beepsTo(k,221397).join(' ').includes('Glory stalls'), '?addons lists it');

  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'glory on'}); await wait(1500);
  ok(/ON/.test(beepsTo(k,500).join(' ')), '?glory on opts in');

  // squeeze every add-on timer (beats are 22-32 s apart) so the whole scene runs fast
  global.setTimeout=(f,ms,...a)=>realTimeout(f, ms>=5000?15:ms, ...a);
  W.__addons('tick');                                   // sees Moo step in
  const d=()=>L().mods['glory-stalls'];
  ok(d().stalls['1'] && d().stalls['1'].who===500, 'Moo is seen in stall 1');
  d().stalls['1'].next=0;
  k=sent.length;
  W.__addons('tick'); await wait(1500); await drain();
  const lines=toWhom(k,500).filter(c=>/^\(\*/.test(c));
  ok(lines.length>=9, 'a whole scene played to Moo in private out-of-character emotes ('+lines.length+' lines)');
  ok(lines.some(c=>/\d+ mL/.test(c)), 'the finish says where and how much');
  ok(!sent.slice(k).some(([e,d])=>d&&d.Type==='Emote'), 'nothing went to the public room');
  ok(d().people['500'] && d().people['500'].total===1, 'the finish counted on Moo');
  const p=L().people[500].prod; ok(p && ((p.held.mouth+p.held.vulva+p.held.butt)>0 || lines.some(c=>/pulls out and paints/.test(c))), 'the cum is tracked in what Moo is holding (unless it was pulled out over her)');
  ok(L().staffScore && L().staffScore['221397'] && L().staffScore['221397'].pts===1, "Moo's herd leader got a staff point");
  ok(lines.some(c=>/Moo/.test(c)) && !lines.some(c=>/Hana|Laynie/.test(c)), 'the scene names Moo and never the stranger');

  // a real visitor pauses scenes and can use the stall
  chars[3].MapData.Pos={X:5,Y:6}; d().stalls['1'].next=0;
  await drain(); k=sent.length; W.__addons('tick'); await drain();
  ok(toWhom(k,500).filter(c=>/^\(\*/.test(c)).length===0, 'no simulated scene while a real visitor is at the hole');
  ok(toWhom(k,600).join(' ').includes('Stall 1 is occupied'), 'the visitor is told how to use it');
  k=sent.length; handlers.ChatRoomMessage({Sender:600,Type:'Whisper',Content:'stall use mouth',Target:260239}); await drain(1500);
  ok(toWhom(k,500).filter(c=>/^\(\*/.test(c)).length>=4, "the occupant gets the real visitor's scene, told with their own cock");
  ok(!toWhom(k,500).some(c=>/Hana/.test(c)), "...without the visitor's name");
  ok(d().people['500'].total===2, 'the real use counted too');

  // the board: names only for staff
  k=sent.length; handlers.ChatRoomMessage({Sender:600,Type:'Whisper',Content:'stalls',Target:260239}); await drain(5500);
  const pub=toWhom(k,600).join(' '); ok(/occupied/.test(pub) && !/Moo/.test(pub), 'the public board says occupied, no name');
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'stalls'}); await drain(5500);
  ok(/Moo/.test(beepsTo(k,221397).join(' ')), "staff see who's in the stall");

  // punishment shift
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'stall punish Moo 30'}); await drain(5500);
  ok(d().shifts['500'] && d().shifts['500'].punish, 'staff can put an opted-in person on a punishment shift');
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'stall punish Hana 30'}); await drain(5500);
  ok(/hasn't said \?glory on/.test(beepsTo(k,221397).join(' ')), '...but not someone who never opted in');

  // the Companion gets the add-on's cards
  const st=W.__stateFor(500); ok(st.mods && st.mods['glory-stalls'] && st.mods['glory-stalls'].cards.length>=1, 'the Companion state carries the add-on cards');
  const errs=warns.filter(w=>/add-on/.test(w)); ok(!errs.length, 'no add-on errors logged '+errs.join(' | '));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
