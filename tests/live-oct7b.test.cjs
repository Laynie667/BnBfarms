// From the Oct 7 (5:38 am) watch: guide headings said as written open their guide, dropped g's too, and a second
// different "I don't know" isn't swallowed. Also: bare switch words don't flip them; ?me shows your record.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,benchOn:true},
 "600":{mn:600,name:"Rex",roles:["LIVESTOCK"],species:"dog",gender:"male",futa:true,onDuty:true,herds:[],tempKeys:[],cover:[],limits:""}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"bench":{X:15,Y:10}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,14,10)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const to=(mn,n)=>sent.slice(n).filter(([e,d])=>d&&((d.Type==='Whisper'&&d.Target===mn)||(e==='AccountBeep'&&d.MemberNumber===mn))).map(([e,d])=>String(d.Content||d.Message)).join(' | ');
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2200); };
(async()=>{ await wait(3500); W.__cfg.USER_COOLDOWN_S=0; chars.push(at(260653,20,20)); chars[chars.length-1].Name='Raine';
  const ask=async(m)=>{ const n=sent.length; await say(260653,m,2500); return to(260653,n); };
  ok(/THE BARN/.test(await ask("?Milk & breedin'")), "?Milk & breedin' opens the barn guide (not ?milk)");
  ok(/BREEDING/.test(await ask("?breedin'")), "?breedin' opens the breeding guide");
  ok(/NEW HERE/.test(await ask("?gettin' started")), "?gettin' started opens the start guide");
  ok(/don't know \?zzzz/.test(await ask('?zzzz')) && /don't know \?qqqq/.test(await ask('?qqqq')), 'two different misses in a row both get an answer');
  const a=await ask('?qqqq'); ok(!a, '...the same miss twice in a minute is answered once');
  ok(/EVERYTHING YOU CAN ASK/.test(await ask('?everything')), '?everything lists every command');
  const k=P(500).eggs; let n=sent.length; await say(500,'?eggs'); ok(P(500).eggs===k && /is (ON|off) for you/.test(to(500,n)), 'a bare ?eggs just says how it is set');
  await say(500,'?eggs on'); ok(P(500).eggs===true, '?eggs on still turns it on');
  n=sent.length; await say(500,'?me'); ok(/Moo/.test(to(500,n)) && !/don't know/.test(to(500,n)), '?me shows your record');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
