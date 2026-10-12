// Batch B (Oct 11): subject ranks, traps that hand you on, the brood book, watchers' bets, a glory stall of your own.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",ribbons:20}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pond":{X:30,Y:30},"glory-1":{X:50,Y:50},"glory-2":{X:52,Y:50}}});
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
const ADDON=(name)=>path.join(__dirname,'../dist/farmhand-'+name+'.user.js');
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.12; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0;
  ['Laynie','Moo','Hana'].forEach((nm,i)=>chars[i+1].Name=nm);
  await say(500,'?stats'); await say(600,'?stats');
  const free=()=>{ P(500).trapAt=0; P(500).penned=null; P(500).gear=null; P(500).benched=null; P(500).trapWait=null; };
  let n;
  // ── ranks ──
  ok(W.__rank(500).rank===0 && W.__rank(500).water===1, 'a new subject is Bait: nothin\' is worse for them yet');
  P(500).trapN=9; n=sent.length; await say(221397,'?trap spring Moo mud'); await wait(8500);
  ok(P(500).trapRank===1 && /TRAP FODDER/.test(all(n)), 'the tenth trap makes them Trap Fodder, and the room hears');
  ok(W.__rank(500).water===1.25 && W.__rank(500).eggs===1.1 && W.__stateFor(500).trapCard.rank==='Trap Fodder' && W.__stateFor(500).trapCard.nextRank===25, 'the rank makes the water hungrier and clutches bigger, and shows on the trap card');
  ok(W.__rank(600).rank===0 && W.__rank(600).water===1, '...only for subjects');
  // ── handed on ──
  free(); cfg.CHAIN_CHANCE=1; n=sent.length; const R0=Math.random; Math.random=()=>0.01;   // (the chance is capped at 90%: make the roll sure)
  await say(221397,'?trap spring Moo wire'); await wait(16000); Math.random=R0;
  const sprung=(to(500,n).match(/sprung a trap/g)||[]).length;
  ok(sprung>=2 && /hands them straight|passed along|second one's already|tipped, slid/.test(all(n)), 'one trap hands them on to the next ('+sprung+' sprung)');
  cfg.CHAIN_CHANCE=0; await wait(9000); free(); P(500).chainN=0; P(500).dirt=null;
  await say(500,'?quiet'); cfg.CHAIN_CHANCE=1; await say(500,'?quiet off');
  cfg.CHAIN_CHANCE=0;
  // ── watchers and their bets ──
  cfg.EGG_COUNT=[4,4]; cfg.TENTACLE_HYPER_CHANCE=0; cfg.TRAP_BEAT_S=0.5; prod(500).eggs=null;
  moveTo(500,30,30); moveTo(600,32,30); free(); n=sent.length; await say(221397,'?trap spring Moo tentacle',900);
  ok(/Fancy a flutter/.test(to(600,n)) && !/Fancy a flutter/.test(to(500,n)), 'somebody standin\' near is offered a bet; the one in the trap is not');
  const line=parseInt((to(600,n).match(/more than (\d+) eggs/)||[])[1],10);
  const r0=P(600).ribbons; n=sent.length; await say(600,'?bet 9 low',900);
  ok(P(600).ribbons===r0-5 && /5 ribbons on low/.test(to(600,n)), 'a stake is capped at 5 and taken up front');
  n=sent.length; await say(500,'?bet 2 high',900); ok(/nothin' to bet on/.test(to(500,n)), 'nobody bets on themselves');
  await wait(6500);
  const laid=prod(500).eggs?prod(500).eggs.n:0;
  ok(laid>0 && (laid>line ? P(600).ribbons===r0-5 : P(600).ribbons===r0+5), 'it laid '+laid+' against a line of '+line+': '+(laid>line?'the low bet is lost':'the low bet pays double'));
  cfg.TRAP_BEAT_S=0.12; free(); prod(500).eggs=null; moveTo(500,15,10); moveTo(600,16,10); W.__trapTick();
  // the rack: breaks or holds
  n=sent.length; await say(221397,'?trap spring Moo tickle',1500); const r1=P(600).ribbons;
  await say(600,'?bet 3 breaks',900); await say(500,'?beg '+((L().life&&L().life.begPhrase)||cfg.BEG_PHRASE),2600);
  ok(P(600).ribbons===r1+3, 'a bet on the tickle rack settles when they beg (3 down, 6 back)');
  free();
  // ── the brood book ──
  L().studbook=(L().studbook||[]).concat([{t:Date.now(),dam:500,sires:[-2],kids:{male:0,female:0,futa:0},eggs:22},{t:Date.now(),dam:500,sires:[-10],kids:{male:2,female:3,futa:0}}]);
  const book=W.__broodBook(500);
  ok(/BROOD BOOK/.test(book) && /Trap Fodder/.test(book) && /biggest clutch 22/.test(book) && /the thing in the water/.test(book) && /the wolf pack: 1 litter \(5 young\)/.test(book), 'the brood book lists what has had them and what they carried');
  n=sent.length; await say(600,'?brood Moo'); ok(/between an animal and the proprietors/.test(to(600,n)), 'nobody else reads another animal\'s brood book');
  n=sent.length; await say(221397,'?brood Moo',4000); ok(/BROOD BOOK/.test(to(221397,n)), '...a proprietor can');
  // ── a glory stall of your own ──
  eval(fs.readFileSync(ADDON('glory-stalls'),'utf8')); await wait(500);
  await say(600,'?glory on'); moveTo(600,50,50);
  n=sent.length; await say(600,'?stall claim'); ok(/is yours for today/.test(to(600,n)), '?stall claim puts their name on the door');
  n=sent.length; await say(500,'?stalls',3500); ok(/Hana's stall, 0 today/.test(to(500,n)), '...where everybody can read it, with the tally');
  moveTo(600,52,50); n=sent.length; await say(600,'?stall claim'); ok(/You've got stall 1 today/.test(to(600,n)), 'one stall each');
  const gd=L().mods['glory-stalls']; W.__gloryFinish('1',600,'vulva',40,true,{type:'human',size:'big'}); ok(gd.claims['1'].n===1, 'every finish is chalked on their door');
  gd.claims['1'].day='yesterday'; const rb=P(600).ribbons||0; W.__addons('tick'); await wait(2500);
  ok(!gd.claims['1'] && (P(600).ribbons||0)===rb+1, 'next day the fullest door earns a ribbon, and the names come down');
  const errs=warns.filter(w=>/rank|bets|trap after|command failed|panel state|add-on/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,300));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
