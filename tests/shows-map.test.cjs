// Shows and map tools add-ons: placards and display cases, an obedience trial judged from emotes, a cart race
// through checkpoint spots, ribbons; opt-in fenced pens that tug you back, and the heat map.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,degradeMe:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],futa:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{"placard-moo":{X:8,Y:8},"display-moo":{X:8,Y:9},"race-1":{X:15,Y:15},"race-2":{X:20,Y:15}},zones:{pens:{a:{X:0,Y:0},b:{X:6,Y:6},group:"pens"}}});
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
  for (const f of ['shows','map-tools']) eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-'+f+'.user.js'),'utf8'));
  await wait(200);
  ok(W.Farmhand.list().filter(a=>a.name==='shows'||a.name==='map-tools').length===2, 'both registered');
  const S=()=>L().mods['shows'], M=()=>L().mods['map-tools'];
  // placard + display case
  let k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'placard set moo Our prize cow'}); await drain(1500);
  chars[2].MapData.Pos={X:8,Y:9}; chars[3].MapData.Pos={X:9,Y:8};
  k=sent.length; handlers.ChatRoomMessage({Sender:600,Type:'Whisper',Content:'placard',Target:260239}); await drain(1500);
  const pl=toWhom(k,600).join(' '); ok(/Our prize cow/.test(pl) && /On display: Moo/.test(pl), 'the placard names whoever is on display ('+pl.slice(0,90)+')');
  // obedience
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'show open obedience'}); await drain(5500);
  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'show enter'}); await drain(1500);
  ok(S().show && S().show.entrants['500'], 'Moo entered');
  global.setTimeout=(f,ms,...a)=>realTimeout(f, ms>=5000?300:ms, ...a);
  handlers.AccountBeep({MemberNumber:221397,Message:'show cue Moo sit'}); await wait(100);
  handlers.ChatRoomMessage({Sender:500,Type:'Emote',Content:'*Moo sits down obediently'}); await wait(800);
  ok(S().show.entrants['500'].passed===1, 'an emote with the cue word passes');
  global.setTimeout=realTimeout;
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'show close'}); await drain(5500);
  ok(S().ribbons['500'] && S().ribbons['500'][0].place===0 && !S().show, 'closing awards a 1st place ribbon');
  // race through checkpoint spots
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'show open race'}); await drain(5500);
  handlers.AccountBeep({MemberNumber:500,Message:'show enter'}); await drain(5500);
  handlers.AccountBeep({MemberNumber:221397,Message:'show go'}); await drain(1500);
  chars[2].MapData.Pos={X:15,Y:15}; await wait(1600); chars[2].MapData.Pos={X:20,Y:15}; await wait(1600);
  ok(S().ribbons['500'].length===2, 'finishing every checkpoint wins the race (and closes it when everyone is done)');
  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'prizes'}); await drain(5500);
  ok(/Pony Cart Race/.test(beepsTo(k,500).join(' ')), '?prizes lists them (show placings; ?ribbons is the scrip now)');
  // pens
  chars[2].MapData.Pos={X:3,Y:3};
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'pen Moo pens'}); await drain(5500);
  ok(M().pens['500'], 'staff pen Moo');
  chars[2].MapData.Pos={X:20,Y:20}; k=sent.length; W.__addons('tick'); await drain();
  ok(!sent.slice(k).some(([e,x])=>e==='ChatRoomCharacterMapDataUpdate'||(x&&/tugged/.test(String(x.Content)))), 'without ?fence on, nothing happens');
  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'fence on'}); await drain(5500);
  k=sent.length; W.__addons('tick'); await drain();
  ok(sent.slice(k).some(([e,x])=>x&&/tugged right back/.test(String(x.Content))) && L().people[500].naughtyMarks===1, 'with ?fence on, wandering out tugs them back with a naughty mark');
  // heat map
  chars[2].MapData.Pos={X:3,Y:3}; W.__addons('tick');
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'heatmap'}); await drain(5500);
  ok(/pens: \d+ min/.test(beepsTo(k,221397).join(' ')), 'the heat map counts time in zones');
  const errs=warns.filter(w=>/add-on/.test(w)); ok(!errs.length, 'no add-on errors logged '+errs.join(' | '));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
