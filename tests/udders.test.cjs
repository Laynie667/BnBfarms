// Batch E (Oct 11): milked till you cum, the stall dial, overdue udders, brought into milk, a second litter,
// bred back, whose they were, too big to walk, your own words, intensity, and bein' kept.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[],ribbons:30},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[{leader:600,type:"perm",since:1,ends:null,warned:false}],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,mpreg:true,ribbons:20},
 "600":{mn:600,name:"Hana",roles:["HERDMASTER"],onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",ribbons:20},
 "800":{mn:800,name:"Pip",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",milkable:false,ribbons:5}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"milking":{X:30,Y:30},"farrowing":{X:50,Y:50},"pasture":{X:20,Y:40}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(800,18,10)];
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
const rnd=Math.random;
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.12; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0;
  ['Laynie','Moo','Hana','Pip'].forEach((nm,i)=>chars[i+1].Name=nm);
  await say(500,'?stats'); await say(600,'?stats'); await say(221397,'?stats'); await say(800,'?stats');
  const now=()=>Date.now(); let n;
  // ── your words ──
  n=sent.length; await say(500,'?callme heifer, good girl'); ok(P(500).callMe.join()==='heifer,good girl' && /calls you: heifer, good girl/.test(to(500,n)), '?callme sets the names they love');
  Math.random=()=>0; ok(W.__wordsFor(500,'Good job, sugar.')==='Good job, heifer.', 'a line to them swaps the farm girl\'s pet name for one of theirs'); Math.random=rnd;
  await say(500,'?nevercall slut, whore');
  ok(!/slut|whore/i.test(W.__wordsFor(500,'What a slut. Two sluts and a whore.')), '?nevercall words never reach them');
  ok(W.__wordsFor(600,'What a slut, sugar.')==='What a slut, sugar.', '...and nobody else\'s lines change');
  n=sent.length; await say(500,'?callme'); ok(/never calls you: slut, whore/.test(to(500,n)), '?callme on its own reads both lists back');
  await say(500,'?callme clear'); await say(500,'?nevercall clear');
  // ── intensity ──
  n=sent.length; await say(500,'?intensity filthy'); ok(P(500).intensity==='filthy' && /FILTHY/.test(to(500,n)), '?intensity sets how the farm talks about them');
  ok(W.__stateFor(500).intensity==='filthy', '...and the Companion knows');
  await say(500,'?intensity tender'); ok(W.__intSev(500,3)===2 && W.__intSev(500,1)===1, 'tender leans the traps a step milder');
  await say(500,'?intensity rough'); ok(W.__intSev(500,3)===3, 'rough leaves them as written');
  // ── the dial, and milked till you cum ──
  n=sent.length; await say(800,'?stalldial Moo hard'); ok(/Only staff/.test(to(800,n)), 'only staff set somebody else\'s dial');
  n=sent.length; await say(600,'?stalldial Moo punishing'); ok(P(500).stallDial==='punishing' && /turned your stall dial to PUNISHING/.test(to(500,n)), 'staff turn the dial, and the animal is told');
  const p=prod(500); moveTo(500,30,30); p.milk=W.__milkCapOf(500); p.stallRest=0; const full=p.milk;
  W.__ms(); W.__ms();
  ok(p.stall && Math.abs(p.stall.total.m-full)<1, 'on punishing the stall means to take every drop');
  n=sent.length; const got0=p.stall.got.m; W.__milkCum(500); await wait(1500);
  ok(P(500).milkCums===1 && p.stall.got.m>got0 && /cum|let down|lettin' down|tips Moo|There it is/.test(all(n)), 'cummin\' in the stall brings a bigger let-down, a line, and a mark on the record');
  ok(W.__album(500).some(e=>/Milked till you came/.test(e.h)), '...and the first time goes in the album');
  const st=p.stall; p.milk=0.5; W.__ms();
  ok(!p.stall && p.sensitiveUntil>now(), 'milked past empty leaves them sensitive for an hour');
  ok(W.__happening(500).some(t=>/Milked past empty/.test(t)), '"what\'s happenin\' to me" says so');
  await say(500,'?stalldial steady'); ok(P(500).stallDial==='steady', 'they can always put their own dial back');
  moveTo(500,15,10); p.sensitiveUntil=0;
  // ── overdue ──
  p.milk=W.__milkCapOf(500); W.__udderTick(); ok(p.fullSince>0 && W.__overdue(500)===1, 'full and unmilked, the clock starts');
  p.fullSince=now()-3.5*3600000; n=sent.length; W.__udderTick(); await wait(1500);
  ok(W.__overdue(500)===3 && p.fullTold===3 && /Moo/.test(all(n)), 'three hours on they are engorged, and the room can see it');
  ok(W.__happening(500).some(t=>/Overdue: your udders are engorged/.test(t)), '...and their panel says so');
  p.milk=0; W.__udderTick(); ok(!p.fullSince, 'gettin\' milked clears it');
  // ── brought into milk ──
  n=sent.length; await say(600,'?bringin Pip'); await say(800,'yes');
  ok(P(800).bringIn && P(800).bringIn.n===0, 'staff ask, and the animal says yes');
  await say(600,'?bringin Pip'); await say(600,'?bringin Pip'); n=sent.length; await say(600,'?bringin Pip');
  ok(P(800).bringIn.n===2 && /tended twice today/.test(to(600,n)), 'twice a day at most');
  for(let i=0;i<4;i++){ P(800).bringIn.d=''; await say(600,'?bringin Pip',1600); }
  ok(!P(800).bringIn && P(800).milkable===true && W.__album(800).some(e=>/Brought into milk/.test(e.h)), 'six tendin\'s and the first drops come: they are a milker');
  // ── a second litter, triple-carried, bred back ──
  p.preg={since:now()-3*86400000,due:now()+5*86400000,sires:[221397],count:2,warned:false};
  Math.random=()=>0; const res=W.__conceive(500,600,300,1,'butt'); Math.random=rnd;
  ok(res===null && p.preg2 && p.preg2.via==='butt' && p.preg.sires.length===1, 'already carryin\', a load in the other hole can start a second litter');
  p.eggs={n:6,by:-2,since:now(),layAt:now()+86400000,types:{water:6}}; W.__udderTick();
  ok(P(500).triple===1 && (P(500).titles||[]).includes('triple'), 'womb, ass and a clutch at once: triple-carried, with the title');
  p.eggs=null; p.preg=null; W.__udderTick(); ok(p.preg && p.preg.via==='butt' && !p.preg2, 'when the first is born the second carries on, on its own clock');
  p.preg=null; p.openUntil=now()+3600000; Math.random=()=>0; const r2=W.__conceive(500,600,300,1,'vulva'); Math.random=rnd;
  ok(r2==='new' && P(500).bredBack===1 && !(p.openUntil>now()), 'caught again inside the hour: bred back');
  // ── whose they were ──
  p.preg={since:now()-9*86400000,due:now()-1000,sires:[221397,600],count:6,warned:true}; n=sent.length; W.__birth(500); await wait(2500);
  const sb=L().studbook[L().studbook.length-1];
  ok(sb.split && sb.split[221397]+sb.split[600]===6 && W.__album(500).some(e=>/Whose they were/.test(e.h)), 'with two sires the split is only counted at the birth');
  ok(p.openUntil>now(), '...and a birth leaves them wide open for an hour');
  await wait(1500);
  // ── too big to walk ──
  p.openUntil=0; p.preg={since:now()-9*86400000,due:now()+3600000,sires:[221397],count:20,warned:true}; P(500).penned=null; moveTo(500,50,50);
  n=sent.length; W.__udderTick(); await wait(1200);
  ok(P(500).bedded && P(500).penned && P(500).penned.bed && /bedded down/.test(to(500,n)), 'at the last belly stage they are bedded down in the farrowin\' stall');
  moveTo(600,51,50); const hr=P(600).ribbons||0; n=sent.length; await say(600,'?tend Moo');
  ok((P(600).ribbons||0)===hr+1 && /Tended/.test(to(600,n)), 'anybody who tends them is paid for it');
  n=sent.length; await say(600,'?tend Moo'); ok(/just been seen to/.test(to(600,n)), '...not twice in ten minutes');
  await say(500,'?bedrest off'); ok(!P(500).bedded && !P(500).penned && P(500).noBed, '?bedrest off gets them up and keeps them up');
  p.preg=null; moveTo(500,15,10); moveTo(600,16,10);
  // ── kept ──
  n=sent.length; await say(800,'?keep Moo'); ok(/isn't in your herd/.test(to(800,n)), 'you can only keep your own herd');
  await say(600,'?keep Moo'); await say(500,'yes');
  ok(P(500).kept && P(500).kept.by===600, 'a herd leader asks, the animal says yes, and they are kept for a week');
  await say(600,'?keep Moo name Buttercup'); Math.random=()=>0;
  ok(W.__wordsFor(500,'Up you get, sugar.')==='Up you get, Buttercup.', 'the name their keeper picked is what the farm calls them'); Math.random=rnd;
  await say(600,'?keep Moo tag Hana\'s cow'); ok(P(500).kept.tag==="HANA'S COW", 'the tag is kept (and written on them, if they let the farm mark them)');
  await say(600,'?keep Moo milk 3'); moveTo(500,30,30); p.milk=W.__milkCapOf(500); p.stall=null; p.stallRest=0; p.stallSeen=0;
  n=sent.length; W.__ms(); W.__ms(); await wait(1200);
  ok(!p.stall && /milked at 3:00/.test(to(500,n)), 'the stall won\'t take them outside their keeper\'s hours');
  await say(600,'?keep Moo breed Laynie'); ok(P(500).rights && P(500).rights.stud===221397 && P(500).rights.kept, 'their keeper says who breeds them');
  n=sent.length; await say(500,'?kept'); ok(/KEPT by Hana/.test(to(500,n)) && W.__stateFor(500).kept.by==='Hana', '?kept shows it, and so does the Companion');
  await say(500,'?kept off'); ok(!P(500).kept && !P(500).rights, '?kept off ends it, the breedin\' say with it');
  const errs=warns.filter(w=>/udder|dial|milk cum|split|bred back|command failed|panel state/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,300));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
