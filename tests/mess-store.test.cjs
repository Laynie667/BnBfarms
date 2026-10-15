// Oct 15: messes wired into the traps (the breedin' ones leave cum), four mess traps (fountain, bakery, creamery, seed
// shower), and messes off the shelf to put on other players (asked first unless ?messes on; limits and watersports count).
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip",{gender:"femboy",species:"bunny"})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"maze-start":{X:40,Y:40},"maze-exit":{X:44,Y:40}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,30,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==='ChatRoomCharacterMapDataUpdate'||ev==='ChatRoomCharacterUpdate'){} }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
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
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2200); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
const moveTo=(mn,X,Y)=>{ chars.find(c=>c.MemberNumber===mn).MapData.Pos={X,Y}; };
const free=(...mns)=>{ for(const mn of mns){ const r=P(mn); r.trapAt=0; r.penned=null; r.gear=null; r.trapQuiet=0; r.trapWait=null; r.maze=null; r.benched=null; if(W.__st().trapRuns) W.__st().trapRuns.delete(mn); } };
const done=async(mn,ms)=>{ for(let i=0;i<60;i++){ await wait(250); if(!(W.__st().trapRuns&&W.__st().trapRuns.has(mn))) break; } await wait(ms||600); };
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.12; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; cfg.SYM.TRAP_CHANCE=0; cfg.SEND_INTERVAL_MS=2;
  ['Laynie','Moo','Rex','Pip'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700]) await say(mn,'?stats',900);
  const prod=mn=>P(mn).prod;
  for (const mn of [500,221397]) handlers.ChatRoomMessage({Sender:mn,Type:"Hidden",Content:"FarmhandMsg",Dictionary:{v:2,type:"hello",ver:"0.29.0"}});   // (their Companions say hello: marks go to Companions)
  await wait(800);
  const marks=(n,mn)=>sent.slice(n).filter(([e,d])=>d&&d.Content==='FarmhandMsg'&&d.Dictionary&&d.Dictionary.type==='mark'&&(!mn||d.Target===mn)).map(([e,d])=>d.Dictionary);
  for (const [kind, mess, word] of [["fountain","chocolate",/chocolate/i],["bakery","cake",/frost|sprinkl/i],["creamery","cream",/cream/i],["seedshower","cum",/finish|load/i]]){
    free(500); P(500).limits=""; let n=sent.length; await say(221397,'?trap spring Moo '+kind,300); await done(500,1800);
    ok(word.test(all(n)) && marks(n,500).some(m=>m.mess===mess), 'trap-'+kind+' plays out and leaves '+mess+' ('+marks(n,500).map(m=>m.mess).join(',')+')');
  }
  ok(marks(0,500).some(m=>m.mess==='strawberry'), 'the creamery adds strawberry on top');
  ok(W.__farmSets().TRAP_GEAR.bakery && W.__farmSets().TRAP_GEAR.seedshower, 'the new traps have their own equipment');
  // the breedin' traps leave cum now, not whipped cream
  free(500); let n0=sent.length; await say(221397,'?trap spring Moo wheel',300); await done(500,1500);
  ok(marks(n0,500).some(m=>m.mess==='cum') && !marks(n0,500).some(m=>m.mess==='cream'), 'the breedin\' wheel leaves cum, not cream ('+marks(n0,500).map(m=>m.mess).join(',')+')');
  // the shelf
  P(221397).ribbons=50; P(221397).roles=["PROPRIETOR"];
  let n=sent.length; await say(221397,'?store',900);
  ok(/MESSES/.test(all(n)) && /creampie/.test(all(n)), 'the store has a messes shelf with the creampie on it');
  P(500).messesOn=false; n=sent.length; await say(221397,'?buy creampie for Moo',900);
  ok(/asked Moo/i.test(all(n)) && !marks(n,500).length, 'a mess for somebody else asks them first');
  n=sent.length; await say(500,'yes',1500);
  ok(marks(n,500).some(m=>m.mess==='cum') && /Laynie/.test(all(n)), 'they say yes: creamed, and the room hears it ('+marks(n,500).length+' marks)');
  await say(500,'?messes on',900); ok(P(500).messesOn===true, '?messes on');
  const rb=P(221397).ribbons; n=sent.length; await say(221397,'?buy cake for Moo',1200);
  ok(marks(n,500).some(m=>m.mess==='cake') && P(221397).ribbons<rb, 'with ?messes on: no askin\', the cake goes straight on');
  n=sent.length; await say(221397,'?buy pie for Moo',1200);
  ok(marks(n,500).some(m=>m.mess==='cream'), '?buy pie finds the cream pie');
  P(500).limits="no food messes, nothing messy"; n=sent.length; await say(221397,'?buy honey for Moo',1200);
  ok(!marks(n,500).length && /limit|doesn't want/i.test(all(n)), 'their limits keep it on the shelf');
  P(500).limits=""; n=sent.length; await say(221397,'?buy piss for Moo',1200);
  ok(!marks(n,500).length && /watersports/i.test(all(n)), 'piss needs you both on ?watersports');
  n=sent.length; await say(221397,'?buy facial',1200);
  ok(marks(n,221397).some(m=>m.mess==='cum'), 'a mess for yourself just happens');
  out(fails ? 'FAILED '+fails : 'all passed'); process.exit(fails?1:0);
})();
