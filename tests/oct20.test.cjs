// Oct 20: traps are each player's own switch (?traps on), every trap has its own extra beats, Goblin Musk

const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip",{gender:"femboy",species:"bunny"}), "800":{mn:800,name:"Dot",roles:["LIVESTOCK"],species:"goat",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",ribbons:30}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"maze-start":{X:40,Y:40},"maze-exit":{X:44,Y:40}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,30,30),at(800,50,50)];
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
  ["Laynie","Moo","Rex","Pip","Dot"].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700,800]) await say(mn,'?stats',900);
  const prod=mn=>P(mn).prod;
  for (const mn of [500,221397]) handlers.ChatRoomMessage({Sender:mn,Type:"Hidden",Content:"FarmhandMsg",Dictionary:{v:2,type:"hello",ver:"0.29.0"}});   // (their Companions say hello: marks go to Companions)
  // ── traps: everybody's own switch ──
  let n=sent.length; await say(700,'?traps');
  ok(P(700).trapsOn===true && !P(700).roles.includes('SUBJECT') && /WHAT'S OUT THERE FOR YOU/.test(all(n)), 'an old test subject finds their traps switched on, and the role gone');
  n=sent.length; await say(221397,'?trap spring Dot injector',1500);
  ok(/switched traps on/.test(all(n)), 'traps never spring on somebody who has not switched them on');
  n=sent.length; await say(800,'?traps on');
  ok(P(800).trapsOn===true && /Traps: ON/.test(all(n)), '?traps on: anybody can switch them on');
  n=sent.length; await say(221397,'?trap spring Dot injector',300); await done(800);
  ok(/gauge creeps toward FULL|cotton swab|plunger draw back|taps the barrel twice|spreadin', hot as a swallow|flush in a slow wave|goes heavy and hot|thickens in one slow throb|pools and swells|gauge reads EMPTY/.test(all(n)), 'the injector tells its own new beats');
  n=sent.length; await say(800,'?traps off');
  ok(P(800).trapsOn===false && /Traps: off/.test(all(n)), '?traps off switches them off');
  free(800); n=sent.length; await say(221397,'?trap spring Dot injector',1500);
  ok(/switched traps on/.test(all(n)), '...and then nothin\' springs');
  // ── Goblin Musk ──
  P(500).ribbons=40; n=sent.length; await say(500,'?buy goblinmusk',1500);
  ok(P(500).fx && P(500).fx.goblinmusk && P(500).fx.goblinmusk.until>Date.now(), 'Goblin Musk is on the shelf, and it goes on');
  free(500); cfg.SCENT_WAIT_MIN=0; cfg.SCENT_CHANCE=1; P(500).fx.goblinmusk.at=Date.now()-60000;
  n=sent.length; W.__broodTick(); await wait(6500); await done(500);
  ok(/goblin/i.test(all(n)) && /🪤|Sprung|goblin/.test(all(n)) && P(500).fx.goblinmusk.came===true, 'the goblins smell it and come for them');
  // ── a trap's gas is breathed, not drunk ──
  n=sent.length; W.__givePotion(500,'needy',260239); await wait(800);
  ok(/Needy Nectar/.test(all(n)), 'a bottle given by hand is still seen');
  const errs=warns.filter(w=>!/Worker/.test(w)&&/command failed|TypeError|ReferenceError|brood tick/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,300));
  out(fails ? '\n❌ '+fails+' failed' : '\n✅ all passed'); process.exit(fails?1:0);
})();
