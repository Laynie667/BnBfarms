// Scenes and spot clearing: milking, collecting, machine breeding and pussy edging play out beat by beat
// (counted at once, told over time, degrade lines for ?degrade on), ?safe stops a scene, edging a pussy makes
// the next breeding likelier to take, and old spots clear by name, by pattern, or all at once.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,degradeMe:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],futa:true},
 "700":{mn:700,name:"Daisy",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],breedable:true,fertile:true,jarok:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{"speaker-a":{X:1,Y:1},"speaker-b":{X:2,Y:2},"old":{X:3,Y:3},"home":{X:4,Y:4}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,20,20),at(500,5,5),at(600,30,30),at(700,21,20)];
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
  chars[1].Name='Laynie'; chars[2].Name='Moo'; chars[3].Name='Hana'; chars[4].Name='Daisy';
  const emotesSince=k=>sent.slice(k).filter(([e,d])=>d&&(d.Type==='Emote'||(d.Type==='Whisper'&&/^\(\*/.test(d.Content)))).map(([e,d])=>d.Content);
  global.setTimeout=(f,ms,...a)=>realTimeout(f, ms>=10000&&ms<=30000?20:ms, ...a);   // scene beats come quick
  // milking by hand
  let k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'stats'}); await drain(1500);
  L().people[500].prod.milk=5000;
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'milk Moo 600'}); await drain(2000);
  const mk=emotesSince(k);
  ok(mk.length>=5 && mk.some(c=>/pail/.test(c)) && mk.some(c=>/600 mL/.test(c)), 'milking plays out as a scene ending with the amount ('+mk.length+' beats)');
  ok(mk.some(c=>/Pathetic|dairy animal|leaky cow/.test(c)), 'Moo has ?degrade on, so the degrading lines are used');
  ok(sent.slice(k).some(([e,d])=>d&&d.Type==='Chat'&&/Let it all down/.test(d.Content)) || sent.slice(k).some(([e,d])=>d&&/Let it all down/.test(String(d.Content))), 'the farm girl says something too');
  // collecting
  L().people[600].prod=L().people[600].prod||{}; 
  k=sent.length; handlers.AccountBeep({MemberNumber:600,Message:'stats'}); await drain(1500);
  L().people[600].prod.semen=80; L().people[600].prod.hasPenis=true;
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'collect Hana'}); await drain(2000);
  const ck=emotesSince(k);
  ok(ck.length>=5 && ck.some(c=>/jar/.test(c)), 'collecting plays out as a scene ('+ck.length+' beats)');
  // machine breeding with a jar
  const jar=L().jars[L().jars.length-1];
  k=sent.length; W.__st(); 
  // load the jar into Daisy's machine straight through the bot's own function
  await wait(5200); handlers.AccountBeep({MemberNumber:221397,Message:'edge Daisy'}); await drain(2000);
  ok(L().people[700].prod.vEdges===1, 'a pussy can be edged ('+L().people[700].prod.vEdges+')');
  ok(emotesSince(k).some(c=>/brink|steps back|Edge number 1/.test(c)), 'with an edging scene');
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'edge Hana pussy'}); await drain(1500);
  ok(L().people[600].prod.vEdges===1, 'a futa can be edged on their pussy by asking');
  // syringe insemination (asks Daisy first; she says yes)
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'inseminate Daisy '+jar.id+' vulva'}); await drain(1500);
  handlers.ChatRoomMessage({Sender:700,Type:'Whisper',Content:'yes',Target:260239}); await drain(2500);
  const sk=emotesSince(k);
  ok(sk.length>=4 && sk.some(c=>/syringe/.test(c)) && sk.some(c=>/Hana's seed/.test(c)), 'syringe breeding plays out as a scene ('+sk.length+' beats)');
  ok(!L().people[700].prod.vEdges, 'the edges are used up by that breeding');
  // ?safe stops a scene part way
  global.setTimeout=(f,ms,...a)=>realTimeout(f, ms>=10000&&ms<=30000?700:ms, ...a);
  L().people[500].prod.milk=5000; await wait(5200);
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'milk Moo 100'}); await wait(400);
  handlers.AccountBeep({MemberNumber:500,Message:'safe'}); await wait(3000); await drain();
  ok(!emotesSince(k).some(c=>/100 mL in the pail/.test(c)), '?safe stops a scene before it finishes');
  global.setTimeout=realTimeout;
  // clearing old spots
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'spot clear speaker-*'}); await drain(1500);
  ok(!L().spots['speaker-a'] && !L().spots['speaker-b'] && L().spots.old, 'a pattern clears all the speakers');
  await wait(5200); handlers.AccountBeep({MemberNumber:221397,Message:'spot clear all'}); await drain(1500);
  ok(L().spots.old, '"clear all" asks first');
  await wait(5200); handlers.AccountBeep({MemberNumber:221397,Message:'spot clear all yes'}); await drain(1500);
  ok(!Object.keys(L().spots).length, '...and clears everything with a yes');
  const errs=warns.filter(w=>/scene|command failed/.test(w)); ok(!errs.length, 'no errors logged '+errs.join(' | '));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
