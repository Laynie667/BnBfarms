// Tails in scenes (a tail on a strap or a tail plug, read off what they wear), and ?meh / ?more on the last farm line.
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
const all=n=>sent.slice(n).filter(([e,d])=>d&&typeof d.Content==="string").map(([e,d])=>d.Content).join(" | ");
(async()=>{ await wait(3500); W.__cfg.USER_COOLDOWN_S=0; W.__cfg.BENCH_REUSE_SEC=0;
  ['Laynie','Moo','Rex'].forEach((nm,i)=>chars[i+1].Name=nm);
  const moo=chars[2];
  // a pony tail on a strap
  moo.Appearance=[{Asset:{Name:'HorseTailStrap1',Group:{Name:'TailStraps'}},Property:{}}];
  await say(221397,'?bench 500 20'); moo.MapData.Pos={X:15,Y:10};
  let saw=false;
  for (let i=0;i<6 && !saw;i++){ const n=sent.length; await say(600,'?use pussy',1500); saw=/pony tail/.test(all(n)); }
  ok(saw, 'a bench use mentions their pony tail');
  // a tail plug closes the ass, and the lines know it's a plug
  moo.Appearance=[{Asset:{Name:'PuppyTailPlug',Group:{Name:'ItemButt'},Effect:[]},Property:{}}];
  let n=sent.length; await say(600,'?use ass',1500);
  ok(/closed off/.test(to(600,n)), 'a tail plug closes the ass');
  saw=false;
  for (let i=0;i<8 && !saw;i++){ n=sent.length; await say(600,'?use pussy',1500); saw=/tail plug|puppy tail/.test(all(n)); }
  ok(saw, 'with a tail plug in, a pussy use mentions the plug or the puppy tail');
  // ?meh and ?more
  n=sent.length; await say(500,'?meh too samey');
  ok(L().feedback && L().feedback.some(f=>f.kind==='meh' && f.why==='too samey' && f.text.length>25) && /word for word/.test(to(500,n)), '?meh sends the last farm line Moo got, word for word, with why');
  await say(500,'?more');
  ok(L().feedback.some(f=>f.kind==='more'), '?more too');
  n=sent.length; await say(221397,'?feedback list lines');
  ok(/open .2./.test(to(221397,n)) && /why: too samey/.test(to(221397,n)), '?feedback list lines shows both, with the why');
  W.__st().lastLines.delete(221397); n=sent.length; await say(221397,'?meh');
  ok(/sent you a farm line lately/.test(to(221397,n)), 'nothin to flag: told so');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
