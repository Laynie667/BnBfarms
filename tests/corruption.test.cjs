// Batch C (Oct 11): corruption, egg types, the night raid, going under, the gauntlet, lent for the night,
// the mystery box and the living suit.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[],ribbons:30},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,ribbons:20},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",ribbons:20}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"nest":{X:40,Y:40},"barn":{X:60,Y:60},"gauntlet-start":{X:70,Y:70},"gauntlet-end":{X:80,Y:70},"pasture":{X:20,Y:40}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10)];
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
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.12; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0;
  ['Laynie','Moo','Hana'].forEach((nm,i)=>chars[i+1].Name=nm);
  await say(500,'?stats'); await say(600,'?stats'); await say(221397,'?stats');
  const free=()=>{ const r=P(500); r.trapAt=0; r.penned=null; r.gear=null; r.benched=null; r.trapWait=null; r.dirt=null; };
  let n;
  // ── corruption ──
  n=sent.length; await say(221397,'?trap spring Moo mud'); await wait(1500);
  ok(P(500).corr===2, 'a trap leaves 2 points of corruption');
  W.__corrupt(600,10); ok(!P(600).corr, 'only test subjects are corrupted');
  n=sent.length; W.__corrupt(500,18); await wait(10500);
  ok(P(500).corrMarks.includes(20) && /Corruption 20/.test(to(500,n)), 'at 20 somethin\' changes for good, and they are told what');
  const sz=JSON.stringify(prod(500).size||{}); W.__corrupt(500,20); await wait(10500);
  ok(P(500).corrMarks.includes(40) && JSON.stringify(prod(500).size||{})!==sz, 'at 40 a size goes up, for keeps');
  W.__corrupt(500,45); await wait(11500);
  ok(P(500).crave && P(500).crave.forGood && P(500).corrWord && W.__stateFor(500).corrWord===P(500).corrWord, 'at 60 the cravin\' stays; at 80 a word is put in their mouth, and the Companion knows it');
  ok(W.__stateFor(500).trapCard.corr===85, 'the trap card shows the meter');
  const rb=P(221397).ribbons; n=sent.length; await say(221397,'?cleanse Moo');
  ok(P(500).corr===65 && P(221397).ribbons===rb-5 && P(500).corrMarks.includes(80), '?cleanse takes 20 off for 5 of the staff\'s ribbons; what already changed stays');
  // ── goin' under ──
  W.__goUnder(500,3); ok(W.__under(500)===3 && W.__stateFor(500).under===3, 'the haze, the lantern and the mirror stack into a depth the Companion gets');
  P(500).under.at=Date.now()-65*60000; ok(W.__under(500)===1 && !W.__stateFor(500).under, '...and it wears off a step every half hour');
  // ── what you lay matters ──
  ok(W.__eggsWorth({water:8},8)===2 && W.__eggsWorth({parasite:8},8)===4, 'parasite eggs sell for twice what water eggs do');
  ok(W.__eggsWorth({water:4,drake:4,hive:4},12)===5, 'a clutch of three kinds sells for a quarter more');
  free(); cfg.EGG_COUNT=[4,4]; cfg.TENTACLE_HYPER_CHANCE=0; await say(221397,'?trap spring Moo eggs'); await wait(1500);
  free(); await say(221397,'?trap spring Moo drake'); await wait(1800);
  const ty=prod(500).eggs&&prod(500).eggs.types; ok(ty && ty.post>0 && ty.drake>0, 'a belly keeps track of what laid which ('+JSON.stringify(ty)+')');
  free(); prod(500).eggs.since=Date.now()-2*3600000; moveTo(500,40,40); await say(500,'?lay',3500);
  ok(L().nest.types && L().nest.types[500] && L().nest.types[500].drake>0, 'laid at the nest, the kinds are kept for the sale');
  moveTo(221397,40,41); n=sent.length; await say(221397,'?gather',2600); ok(/post eggs|drake eggs/.test(to(500,n)), 'the layer is paid by kind');
  moveTo(500,15,10); moveTo(221397,10,10);
  // ── the mystery box ──
  const r0=P(600).ribbons; n=sent.length; await say(600,'?mysterybox');
  const c=P(600).curse; ok(c && c.until>Date.now() && P(600).ribbons===r0-4 && (W.__stateFor(600).farmGear||[]).some(g=>g.name===c.name), 'a mystery box costs 4 ribbons and puts somethin\' on them as gear ('+(c&&c.name)+')');
  n=sent.length; await say(600,'?mysterybox'); ok(/still wearin'/.test(to(600,n)) && P(600).ribbons===r0-4, 'one curse at a time');
  await say(600,'?safeword',2500); ok(!P(600).curse && !(W.__stateFor(600).farmGear||[]).length, 'the safeword takes it off');
  // ── the livin' suit ──
  free(); n=sent.length; await say(221397,'?trap spring Moo suit'); await wait(1500);
  ok(P(500).suit && /livin' suit|patch on your thigh/.test(to(500,n)), 'the suit trap leaves a patch that is alive');
  ok(!(W.__stateFor(500).farmGear||[]).some(g=>/Living Suit/.test(g.name)), 'at first it is only a patch: no gear yet');
  P(500).suit.since=Date.now()-2.2*3600000; n=sent.length; W.__trapTick(); await wait(900);
  const sg=(W.__stateFor(500).farmGear||[]).filter(g=>/Living Suit/.test(g.name)).map(g=>g.slot).sort().join();
  ok(sg==='belt,legs' && prod(500).deniedUntil>Date.now(), 'two hours in it has their legs and hips as real gear, and they cannot cum ('+sg+')');
  ok(W.__happening(500).some(t=>/livin' suit/.test(t)), '"what\'s happenin\' to me" says how far it has spread');
  await say(500,'?safeword',2500); ok(!P(500).suit && !(W.__stateFor(500).farmGear||[]).some(g=>/Living Suit/.test(g.name)), 'the safeword peels it off');
  P(500).trapQuiet=0; free();
  // ── the gauntlet ──
  moveTo(500,70,70); n=sent.length; W.__trapTick(); await wait(600);
  ok(P(500).run && /on the gauntlet/.test(to(500,n)), 'steppin\' on the start begins a run');
  P(500).run.at=Date.now()-95000; const rb2=P(500).ribbons||0; moveTo(500,80,70); n=sent.length; W.__trapTick(); await wait(900);
  ok(!P(500).run && L().gauntlet.fast.mn===500 && (P(500).ribbons||0)===rb2+7, 'reachin\' the end pays the pot (5) and 2 more for the fastest run on the board');
  n=sent.length; await say(600,'?gauntlet',3500); ok(/Fastest: Moo, 1m 3\ds/.test(to(600,n)), '?gauntlet shows the board');
  // ── lent for the night ──
  cfg.LEND_BID_S=3; moveTo(500,15,10); free(); n=sent.length; await say(500,'?lend me',900);
  ok(W.__lend() && W.__lend().stage==='bids', '?lend me opens the biddin\'');
  await say(600,'?bid 4',900); const r1=P(600).ribbons, m1=P(500).ribbons||0; await wait(2600); W.__trapTick(); await wait(2800);
  ok(W.__lend() && W.__lend().stage==='pick' && W.__lend().winner===600 && P(600).ribbons===r1-4 && (P(500).ribbons||0)===m1+2, 'the top bid wins, pays, and the one lent keeps half');
  n=sent.length; await say(600,'?route mud paddle',900); W.__trapTick(); await wait(1500);
  ok(/sprung a trap/.test(to(500,n)) && W.__lend() && W.__lend().picks.length===1, 'the winner names the traps, and they are walked through them in order');
  // ── the night raid ──
  free(); P(500).trapQuiet=0; L().life.curfewOn=true; W.__hour=23; cfg.RAID_CHANCE=1; W.__st().raidAt=0; W.__st().lend=null;
  moveTo(500,60,61); n=sent.length; W.__trapTick(); await wait(8000);
  ok(/pack hasn't waited|come lookin'/.test(all(n)) && /wolf/i.test(to(500,n)), 'after curfew the pack comes into the barn for a subject sleepin\' there');
  const errs=warns.filter(w=>/corruption|curse|suit|trap|command failed|panel state/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,300));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
