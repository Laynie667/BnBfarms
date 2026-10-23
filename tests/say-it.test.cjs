// Oct 23: Say it. A pet a gag, a moo-only contract or a trance has silenced can still answer the farm: the Companion
// sends their words as a hidden message, a whisper to the farm girl counts, and so does BC's plain copy of a gagged line.

const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,trapsOn:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip",{gender:"femboy",species:"bunny",herds:[{leader:800,at:1}]}),
 "800":S(800,"Dot",{species:"goat"})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,30,30),at(800,50,50)];
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
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1500); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
const fm=(mn,dict)=>handlers.ChatRoomMessage({Sender:mn,Type:"Hidden",Content:"FarmhandMsg",Dictionary:Object.assign({v:2},dict)});
const LINE="I am the farm's good little cow";
const mirror=(mn)=>{ const r=P(mn); r.trapWait={kind:"mirror",until:Date.now()+600000,next:Date.now()+600000,line:LINE,n:0}; };
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2;
  ["Laynie","Moo","Rex","Pip","Dot"].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700,800]) await say(mn,'?stats',700);
  for (const mn of [500,700,221397]) fm(mn,{type:"hello",ver:"0.36.0"});
  await wait(1200);
  // ── what the farm wants to hear shows in their panel ──
  mirror(500);
  const w=(W.__stateFor(500).wants||[])[0];
  ok(w && w.say===LINE && /mirror box/.test(w.label), 'their panel shows the line the mirror box wants, as a button: '+(w&&w.label));
  ok(!(W.__stateFor(600).wants||[]).length, 'and nothin\' for somebody nothin\'s waitin\' on');
  // ── the Say it box: straight past the gag ──
  let n=sent.length; fm(500,{type:"say",text:LINE}); await wait(800);
  ok(P(500).trapWait && P(500).trapWait.n===1, 'a line said through the Say it box counts for the mirror box');
  ok(/5 more|4 more|more time/.test(JSON.stringify(W.__stateFor(500).wants)), 'and the button counts down: '+((W.__stateFor(500).wants||[])[0]||{}).label);
  ok(!/The farm heard you/.test(all(n)), 'no extra "heard you" when the trap took it');
  // ── a gagged line: BC's plain copy ──
  handlers.ChatRoomMessage({Sender:500,Type:'Chat',Content:'Mmph mmh mmph\'m gmmh',Dictionary:[{Effects:["GagNormal"],Original:LINE}]}); await wait(600);
  ok(P(500).trapWait.n===2, 'a gagged line counts by the plain words the game sends along');
  // ── a whisper to the farm girl ──
  n=sent.length; await say(500,LINE,900);
  ok(P(500).trapWait.n===3, 'a line whispered to the farm girl counts');
  ok(!/don't know|didn't catch|\?help/i.test(all(n)), 'and she doesn\'t answer it like a question: '+all(n).slice(0,120));
  // ── a no-human-left moo doesn't count ──
  handlers.ChatRoomMessage({Sender:500,Type:'Chat',Content:'Moo moo moo moo moo moo'}); await wait(500);
  ok(P(500).trapWait.n===3, 'what came out as moos doesn\'t count');
  fm(500,{type:"say",text:LINE}); await wait(400); fm(500,{type:"say",text:LINE}); await wait(1200);
  ok(!P(500).trapWait, 'the fifth one opens the mirror box');
  ok(!(W.__stateFor(500).wants||[]).length, 'and the button goes');
  // ── anything else they say ──
  n=sent.length; fm(500,{type:"say",text:"I really need some water"}); await wait(900);
  ok(/The farm heard you, sugar: .{0,2}I really need some water/.test(all(n)), 'anything else: the farm says it heard them');
  n=sent.length; fm(500,{type:"say",text:"?stats"}); await wait(1200);
  ok(/ml|milk|Milk/.test(all(n)), 'a command typed in the box works like a command: '+all(n).slice(0,160));
  W.__st().farmAsks=W.__st().farmAsks||new Map(); let said=null; W.__st().farmAsks.set(500,{cb:(y)=>said=y,at:Date.now()});
  fm(500,{type:"say",text:"yes"}); await wait(600);
  ok(said===true, 'a yes typed in the box answers the farm\'s question');
  // ── tell staff ──
  n=sent.length; fm(700,{type:"say",text:"my legs have gone numb, can someone let me out",to:"staff"}); await wait(1200);
  const txt=all(n);
  ok(/Pip \(700\) can't say it out loud, so they typed it: .{0,2}my legs have gone numb/.test(txt), 'Tell staff reaches the staff on duty');
  ok(sent.slice(n).some(([e,d])=>d&&d.Target===800&&/can't say it out loud/.test(String(d.Content||JSON.stringify(d.Dictionary||'')))), 'and their herd leader');
  ok(/Sent to the staff on duty and your herd leader/.test(txt), 'and they\'re told it went');
  // ── a parasite wantin' begged at ──
  P(600).parasite={urge:{kind:"beg",until:Date.now()+600000}};
  ok((W.__stateFor(600).wants||[]).some(x=>/beg/.test(x.label) && x.say), 'a parasite that wants beggin\' shows a Say it button too');
  P(600).parasite=null;
  // ── Oct 23: Dress me, the outfit their record calls for ──
  W.LZString={ compressToBase64:(t)=>Buffer.from(t).toString('base64'), decompressFromBase64:(t)=>Buffer.from(t,'base64').toString() };
  n=sent.length; fm(500,{type:"cmd",text:"dressme",btn:true}); await wait(1200);
  const dress=sent.slice(n).map(([e,d])=>d&&d.Dictionary).find(x=>x&&x.type==='outfit');
  ok(dress && dress.slot==='farm:cow|female' && dress.auto===true, 'Dress me puts on the outfit their record calls for, straight on: '+(dress&&dress.slot));
  n=sent.length; await say(600,'?dressme',900);
  ok(/needs the Companion/.test(all(n)), 'without the Companion they\'re told it needs it');
  ok(!warns.some(w=>/say|mirror|parasite/i.test(w)), 'no errors: '+warns.filter(w=>/say|mirror|parasite/i.test(w)).slice(0,2).join(' | '));
  out(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
})();
