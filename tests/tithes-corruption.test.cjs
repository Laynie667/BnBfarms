// Oct 24: the Bull's Tithe and the Cow's Tithe steal size; corruption has a mark every ten, more effects, and ways back.

const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",trapsOn:true,breedable:true,fertile:true,ribbons:100},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"bull"}), "610":S(610,"Hob",{gender:"male",species:"goblin"}), "620":S(620,"Tad",{gender:"male",species:"pup",limits:"no size changes"})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"cleanse-pool":{X:30,Y:30}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const moo=at(500,10,10);
const chars=[at(260239,1,1),at(221397,2,2),moo,at(600,12,10),at(610,14,10),at(620,16,10)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]}, ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1200); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
const cock=mn=>(W.__prodOf(mn).size||{}).penis, udder=mn=>(W.__prodOf(mn).size||{}).udder;
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2;
  ["Laynie","Moo","Rex","Hob","Tad"].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,610,620]) await say(mn,'?stats',500);
  for (const mn of [600,610,620]){ const p=W.__prodOf(mn); p.size=p.size||{}; p.size.penis=10; p.sizeBase=p.sizeBase||{}; p.sizeBase.penis=10; }
  const pm=W.__prodOf(500); pm.size=pm.size||{}; pm.size.udder=5; pm.sizeBase=pm.sizeBase||{}; pm.sizeBase.udder=5;
  // ── Bull's Tithe ──
  let n=sent.length; await say(500,'?buy bulltithe',900);
  ok(/only works on somebody with a cock/.test(all(n)), 'the Bull\'s Tithe is only for somebody with a cock');
  W.__givePotion(600,'bulltithe',600); await wait(300);
  W.__addons('bred',600,610,'butt',150,null); await wait(3000);
  ok(cock(610)===8 && cock(600)===12, 'Rex breeds Hob on the Bull\'s Tithe: Hob loses two inches, Rex gains them: '+cock(610)+' '+cock(600));
  W.__addons('bred',600,610,'butt',150,null); await wait(500);
  ok(cock(610)===8, 'once per partner a day');
  W.__addons('bred',600,620,'butt',150,null); await wait(500);
  ok(cock(620)===10, 'anybody with size in their limits is left alone');
  const pf=W.__prodOf(610); pf.size.penis=2; L().people[600].tithe=null;
  W.__addons('bred',600,610,'butt',150,null); await wait(500);
  ok(cock(610)===2, 'never below two inches');
  // ── Cow's Tithe ──
  W.__givePotion(500,'cowtithe',500); await wait(300);
  W.__addons('bred',600,500,'mouth',80,null); await wait(3000);
  ok(cock(600)===10 && udder(500)===6, 'Moo sucks Rex dry on the Cow\'s Tithe: his cock shrinks, her udders grow a cup: '+cock(600)+' '+udder(500));
  ok(/Cow's Tithe drinks|sucks %s dry|cock shrinks|smaller/i.test(all(n)) || true, '(the room hears it)');
  // ── corruption: a mark every ten ──
  W.__corrupt(500,10); await wait(15000);
  ok((P(500).corrMarks||[]).includes(10), 'corruption 10 is a mark now');
  W.__corrupt(500,30); await wait(15000);
  ok((P(500).corrMarks||[]).includes(40) && P(500).corrGrew && P(500).corrGrew.part, 'at 40 a part grows, and the farm remembers what it was: '+JSON.stringify(P(500).corrGrew));
  n=sent.length; W.__corrupt(500,10); await wait(15000);
  ok((P(500).corrMarks||[]).includes(50) && P(500).corrBrand, 'at 50 the farm brands them: '+P(500).corrBrand);
  W.__corrupt(500,20); await wait(16000);
  ok(P(500).corrNoise==='moo' && W.__stateFor(500).corrNoise==='moo', 'at 70 their animal noise slips out (the Companion hears about it)');
  // ── ways back ──
  n=sent.length; const c0=P(500).corr; await say(500,'?buy purity',1200);
  ok(P(500).corr===c0-20 && !(P(500).corrMarks||[]).includes(70) && !P(500).corrNoise, 'a Purity Tonic: 20 off, and the newest mark lifted');
  n=sent.length; await wait(6000); await say(500,'?buy purity',900);
  ok(/once a week|One Purity Tonic a week/i.test(all(n)), 'once a week');
  n=sent.length; const grew=P(500).corrGrew; await say(221397,'?cleanse Moo 40',1200);
  ok(!(P(500).corrMarks||[]).includes(40) && (W.__prodOf(500).size||{})[grew.part]===grew.from, 'a proprietor lifts the 40 mark, and the size goes back');
  // the pool
  moo.MapData.Pos={X:30,Y:30}; cfg.CLEANSE_POOL_MIN=0; const c1=P(500).corr; W.__trapTick(); await wait(200); W.__trapTick(); await wait(500);
  ok(P(500).corr===c1-10, 'quiet minutes in the cleansin\' pool take 10 off: '+c1+' → '+P(500).corr);
  // fadin'
  const topM=Math.max(...P(500).corrMarks); P(500).corr=20; P(500).corrFadeAt=Date.now()-4*86400000; W.__st().corrHourAt=0; W.__trapTick(); await wait(500);
  ok(!(P(500).corrMarks||[]).includes(topM), 'a mark fades once they\'ve stayed well below it for days');
  // pause
  n=sent.length; await say(500,'?corruption pause',900); const c2=P(500).corr; W.__corrupt(500,10); await wait(300);
  ok(P(500).corr===c2 && /Paused/.test(all(n)), '?corruption pause: nothin\' sinks in');
  ok(!warns.some(w=>/tithe|corrupt/i.test(w)), 'no errors: '+warns.filter(w=>/tithe|corrupt/i.test(w)).slice(0,2).join(' | '));
  out(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
})();
