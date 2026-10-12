// The parasite's later tricks, Tentacle Musk, stacking eggs and the new store shots (Oct 11).
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,parasiteOn:true,eggs:true,ribbons:60},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",parasiteOn:true},
 "700":{mn:700,name:"Nope",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:""}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pond":{X:30,Y:30},"nest":{X:40,Y:40},"glory-1":{X:50,Y:50}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,14,10),at(700,13,10)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}}, location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]}, ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn], prod=mn=>P(mn).prod;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const to=(mn,n)=>sent.slice(n).filter(([e,d])=>d&&((d.Type==='Whisper'&&d.Target===mn)||(e==='AccountBeep'&&d.MemberNumber===mn))).map(([e,d])=>String(d.Content||d.Message)).join(' | ');
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>String(d.Content||d.Message)).join(' | ');
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2400); };
const moveTo=(mn,X,Y)=>{ chars.find(c=>c.MemberNumber===mn).MapData.Pos={X,Y}; };
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.12; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; cfg.PARASITE_LATCH_S=0.1;
  ['Laynie','Moo','Hana','Nope'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const m of [500,600,700]) await say(m,'?stats');
  let n;
  // ── eggs stack, and fertility makes a clutch bigger ──
  cfg.EGG_COUNT=[4,4]; cfg.TENTACLE_HYPER_CHANCE=0;
  await say(221397,'?trap spring Moo eggs'); await wait(1500); const e1=prod(500).eggs.n;
  P(500).trapAt=0; P(500).penned=null; P(500).gear=null; await say(221397,'?trap spring Moo eggs'); await wait(1500);
  ok(e1>=4 && prod(500).eggs.n>=e1+4, 'a second clutch adds to the first ('+e1+' then '+prod(500).eggs.n+')');
  prod(500).eggs=null; W.__shot(500,221397,'fertility x2'); P(500).trapAt=0; P(500).penned=null; P(500).gear=null;
  await say(221397,'?trap spring Moo eggs'); await wait(1500);
  ok(prod(500).eggs.n===8 || prod(500).eggs.n===24, 'fertility level 2 doubles a clutch (4 becomes '+prod(500).eggs.n+')');
  prod(500).boosts.fert=0; prod(500).eggs=null;
  // ── Tentacle Musk ──
  P(500).potionsOn=true; n=sent.length; await say(221397,'?potion give Moo tentaclemusk',2600);
  ok(P(500).fx && P(500).fx.tentaclemusk, 'Tentacle Musk is a potion ('+to(221397,n).slice(0,60)+')');
  ok(W.__parasiteChance(500)===0.25, 'each dab counts a quarter toward the parasite');
  cfg.TENTACLE_CHANCE=0.05; { const R0=Math.random; Math.random=()=>0.9; P(500).trapAt=0; P(500).penned=null; P(500).gear=null; moveTo(500,30,30); W.__trapTick(); Math.random=R0; }
  await wait(2500);
  ok(prod(500).eggs && prod(500).eggs.by===-2, 'with the musk on, a 5% water is a sure thing (0.05 x 20)');
  ok(prod(500).eggs.n>=18, '...and the clutch comes in three times the size ('+prod(500).eggs.n+')');
  delete P(500).fx.tentaclemusk; prod(500).eggs=null; moveTo(500,15,10); W.__trapTick(); P(500).gear=null; P(500).penned=null;
  // ── the store's new shots ──
  n=sent.length; await say(500,'?buy shot-hyper',2600); ok(prod(500).boosts.hyper>Date.now(), 'a hyper pregnancy shot is on the shelf, and it works');
  n=sent.length; await say(500,'?buy shot-balls',2600); ok(/nothin' to work on/.test(to(500,n)), 'a shot with nothin\' to work on gives the ribbons back');
  // ── the parasite: urges ──
  cfg.PARASITE_CHANCE=1; W.__load(-1,500,'mouth',60); await wait(600);
  const g=()=>P(500).parasite; ok(!!g() && !!g().strain, 'latched, with a strain ('+(g()&&g().strain)+')');
  g().strain='grower'; g().urgeAt=0; n=sent.length; W.__parasiteTick(); await wait(600);
  ok(g().urge && /It wants somethin'/.test(to(500,n)), 'it gets an urge and says what it wants ('+(g().urge&&g().urge.kind)+')');
  g().urge={kind:'kiss',until:Date.now()+600000}; const n0=g().n; W.__kiss('Kiss','ItemMouth',500,700); await wait(5600);
  ok(!g().urge && g().n===n0+1, 'obeyed (a kiss): the urge is gone and it pays a dose');
  ok(!P(700).parasite, '...and the one she kissed, who never said ?parasite on, is left alone');
  g().urge={kind:'glory',until:Date.now()-1}; n=sent.length; W.__parasiteTick(); await wait(500);
  ok(!g().urge && prod(500).deniedUntil>Date.now()+50*60000, 'ignored: an hour held at the edge');
  prod(500).deniedUntil=0;
  // ── it passes in milk ──
  cfg.PARASITE_KISS_CHANCE=1; W.__nurse(500,700); await wait(3500); ok(!P(700).parasite, 'nursin\' can\'t pass it to somebody who never asked');
  W.__nurse(500,600); await wait(3600); ok(!!P(600).parasite, '...and does pass it to somebody who did');
  // ── kin: the thing in the water knows its own ──
  cfg.TENTACLE_CHANCE=0; g().urgeAt=Date.now()+9e9; P(500).trapAt=0; P(500).penned=null; moveTo(500,30,30); n=sent.length; W.__trapTick(); await wait(2600);
  ok(prod(500).eggs && prod(500).eggs.n>=12 && /knows its own|kin|visit|add to the brood/.test(all(n)), 'a host by the water is always taken, and it lays double ('+(prod(500).eggs&&prod(500).eggs.n)+')');
  moveTo(500,15,10); W.__trapTick(); P(500).penned=null; P(500).gear=null;
  // ── it lays its own clutch, and that hatches at the nest ──
  prod(500).eggs=null; g().until=Date.now()+30*60000; W.__parasiteTick(); await wait(500);
  ok(prod(500).eggs && prod(500).eggs.para===true && g().laid, 'in its last hour it lays its own clutch in the host');
  prod(500).eggs.since=Date.now()-2*3600000; moveTo(500,40,40); await say(500,'?lay',2600);
  ok(L().nestBrood===1, 'laid at the nest, one of them is the parasite\'s own');
  moveTo(500,15,10); P(600).parasite=null; P(600).parasiteNext=0; moveTo(700,40,40); W.__parasiteTick(); await wait(3600);
  ok(!P(700).parasite && L().nestBrood===1, 'it won\'t hatch onto somebody who never said ?parasite on');
  moveTo(700,13,10); moveTo(600,40,40); W.__parasiteTick(); await wait(3600);
  ok(!!P(600).parasite && L().nestBrood===0, '...and takes the next one who did');
  // ── the seed ──
  cfg.PARASITE_SEED_CHANCE=1; g().until=Date.now()-1; W.__parasiteTick(); await wait(600);
  ok(!P(500).parasite && P(500).parasiteSeed>Date.now(), 'when it drops off, it can leave a seed');
  P(500).parasiteSeed=Date.now()-1; n=sent.length; W.__parasiteTick(); await wait(800);
  ok(!!P(500).parasite, '...and grow back from inside');
  await say(500,'?safeword',2500); ok(!P(500).parasite && !(P(500).parasiteSeed>Date.now()), 'the safeword takes it off, seed and all');
  const errs=warns.filter(w=>/parasite|trap|command failed|panel state/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,300));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
