// The use bench (opt-in, ?use, the tally, the wheel, the safeword ends it at once) and breedin' season
// (heat, pent-up studs, the stud book read out at night, the crown for the most-bred).
const fs=require('fs'), path=require('path');
// the farm's clock: the 16th of the month, 8 pm (breedin' season), moved on later in the test
const RealDate=Date; let OFF=new RealDate(2026,9,16,20,0,0).getTime()-RealDate.now();
global.Date=class extends RealDate{ constructor(...a){ if(!a.length) super(RealDate.now()+OFF); else super(...a); } static now(){ return RealDate.now()+OFF; } };
const setClock=(d,h,m)=>{ OFF=new RealDate(2026,9,d,h,m||0,0).getTime()-RealDate.now(); };
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "700":{mn:700,name:"Hand",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true},
 "600":{mn:600,name:"Rex",roles:["LIVESTOCK"],species:"dog",gender:"male",futa:true,onDuty:true,herds:[],tempKeys:[],cover:[],limits:""}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"bench":{X:15,Y:10},"pen":{X:20,Y:20}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(700,16,10),at(500,12,10),at(600,14,10)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); },
  ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
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
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||(d.Dictionary&&d.Dictionary.length))).map(([e,d])=>String(d.Content)+' '+JSON.stringify(d.Dictionary||'')).join(' | ');
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2200); };
const moveTo=(mn,X,Y)=>{ chars.find(c=>c.MemberNumber===mn).MapData.Pos={X,Y}; };
(async()=>{ await wait(3500); W.__cfg.USER_COOLDOWN_S=0;
  ['Laynie','Hand','Moo','Rex'].forEach((nm,i)=>chars[i+1].Name=nm);
  // ── the use bench ──
  let n=sent.length; await say(221397,'?bench 500 20');
  ok(!P(500).benched && /hasn't said \?bench on/.test(to(221397,n)), "nobody goes on the bench without ?bench on");
  await say(500,'?bench on');
  ok(P(500).benchOn, '?bench on');
  ok(W.__stateFor(500).switches.bench===true, 'the Companion shows the bench switch on');
  n=sent.length; await say(700,'?bench 500 20');
  ok(P(500).benched && P(500).benched.name==='bench', 'staff put Moo on the bench');
  ok(/use bench for 20 minutes/.test(to(500,n)) && /safeword/.test(to(500,n)), 'Moo is told how long, and that the safeword ends it');
  moveTo(500,15,10);
  n=sent.length; await say(600,'?use pussy');
  ok(P(500).benched.uses===1 && P(500).prod.held.vulva>0, 'Rex uses Moo\'s pussy: counted, and the load is inside');
  ok(/Rex/.test(all(n)) && /Moo/.test(all(n)), 'the room sees it');
  n=sent.length; await say(600,'?use');
  ok(P(500).benched.uses===1 && /Give it a minute/.test(to(600,n)), 'not twice in a row by the same one');
  n=sent.length; await say(700,'?use mouth');
  ok(P(500).benched.uses===2, 'somebody without a cock still gets a turn');
  moveTo(221397,40,40);
  n=sent.length; await say(221397,'?use');
  ok(P(500).benched.uses===2 && /Get right up/.test(to(221397,n)), 'you have to be standin\' by the bench');
  n=sent.length; await say(500,'?use');
  ok(/can't use yourself/.test(to(500,n)), 'the one on the bench can\'t use themselves');
  n=sent.length; await say(221397,'?board',3000);
  ok(/Use bench: most used this week, Moo [([]2/.test(to(221397,n)), 'the tally is on the board');
  n=sent.length; await say(700,'?bench top');
  ok(/Most used[\s\S]*Moo: 2/.test(to(700,n)), '?bench top');
  // wander off: strapped back down
  moveTo(500,30,30); n=sent.length; W.__benchTick(); await wait(1500);
  ok(/bench/i.test(all(n)) && P(500).benched, 'wanderin\' off the bench brings them back');
  moveTo(500,15,10);
  // the safeword ends it at once
  handlers.ChatRoomMessage({Sender:500,Type:'Whisper',Content:'?safe',Target:260239}); await wait(50);
  ok(!P(500).benched, 'the safeword takes them off the bench straight away');
  await wait(2500);
  // the wheel
  await say(221397,'?wheel farm off');
  await say(221397,'?wheel add punish Bench time for %name% => bench 15');
  ok(L().wheel.some(e=>e.act==='bench 15'), 'a bench slice');
  moveTo(221397,10,10);
  n=sent.length; await say(221397,'?spin 600 punish',3000);
  ok(!P(600).benched, 'the wheel skips the bench for somebody who never said ?bench on');
  n=sent.length; await say(221397,'?spin 500 punish',3000);
  ok(P(500).benched && /Bench time/.test(all(n)), 'the wheel sentences Moo to the bench');
  await say(500,'?bench off');
  ok(!P(500).benched && !P(500).benchOn, '?bench off lets them up and keeps them off');
  // time served earns a ribbon
  await say(500,'?bench on'); await say(500,'?bench me 10');
  ok(P(500).benched, 'volunteerin\' for the bench');
  const rb=P(500).ribbons||0; P(500).benched.until=Date.now()-1; n=sent.length; W.__benchTick(); await wait(3500);
  ok(!P(500).benched && (P(500).ribbons||0)===rb+1 && /Time served/.test(to(500,n)), 'time served: let up, with a ribbon');
  // limits rule it out
  P(600).benchOn=true; P(600).limits='no breeding';
  n=sent.length; await say(221397,'?bench 600 10');
  ok(!P(600).benched && /limits/.test(to(221397,n)), 'their limits rule the bench out');
  P(600).limits=''; P(600).benchOn=false;
  await say(221397,'?wheel farm on');

  // ── breedin' season (the breeding add-on) ──
  eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-breeding.user.js'),'utf8')); await wait(300);
  const d=()=>L().mods['breeding'];
  await say(500,'?season on'); await say(600,'?season on');
  ok(d().optIn['500'] && d().optIn['600'], 'both sign up for breedin\' season');
  P(500).prod.preg=null; P(500).prod.heat=null; if (d().week.heated) delete d().week.heated['500'];   // the bench breedin' above may have taken (heat skips somebody already expectin'), and the bot's own heartbeat may have ticked
  n=sent.length; W.__addons('tick'); await wait(2500);
  ok(/breedin' season/.test(all(n)), 'the season is announced');
  ok(P(500).prod.heat && P(500).prod.heat.until>Date.now(), 'Moo comes into heat for it');
  // pent up after four hours full
  const rp=P(600).prod; rp.pentUp=false; rp.semen=999; rp.semenFullSince=Date.now()-5*3600000;
  W.__addons('tick'); await wait(300);
  ok(rp.pentUp, 'a signed-up stud full for 4+ hours is pent up');
  // the stud book: the bench, a glory stall stranger, the bot's own fills
  W.__cfg.BENCH_REUSE_SEC=0; await say(500,'?bench me 30'); moveTo(500,15,10); moveTo(600,14,10);
  P(500).prod.held={vulva:0,butt:0,mouth:0};
  n=sent.length; await say(600,'?use pussy');
  ok(d().week.bred['500']===1 && d().week.covers['600']===1, 'a bench breedin\' goes in the stud book (dam and stud)');
  W.__addons('bred', -1, 500, 'vulva', 40, null);
  W.__addons('bred', 600, 500, 'butt', 40, null);
  ok(d().week.bred['500']===2 && d().week.covers['600']===1, 'a stranger\'s counts for the dam only; an ass load doesn\'t count');
  n=sent.length; await say(500,'?season book');
  ok(/STUD BOOK/.test(to(500,n)) && /Moo, 2 times/.test(to(500,n)) && /Rex, 1 cover/.test(to(500,n)), '?season book');
  // nightly readin'
  setClock(16,21,30); n=sent.length; W.__addons('tick'); await wait(2500);
  ok(/STUD BOOK, night 2/.test(all(n)) && /Moo/.test(all(n)), 'the stud book is read out at night');
  n=sent.length; W.__addons('tick'); await wait(1500);
  ok(!/STUD BOOK/.test(all(n)), '...once a night');
  // the last night: the crown
  const r5=P(500).ribbons||0, r6=P(600).ribbons||0;
  setClock(21,21,30); n=sent.length; W.__addons('tick'); await wait(3500);
  ok(d().champions && d().champions[0].dam===500 && d().champions[0].stud===600, 'Moo is crowned most-bred, Rex the busiest stud');
  ok((P(500).ribbons||0)>=r5+10 && (P(600).ribbons||0)>=r6+5, 'prize ribbons, past the daily cap');
  ok(/That's the season/.test(all(n)), 'the crown is announced');
  n=sent.length; setClock(22,10,0); W.__addons('tick'); await wait(1000);
  ok(!/That's the season/.test(all(n)), 'crowned once');
  const errs=warns.filter(w=>/add-on|bench/.test(w)); ok(!errs.length, 'no errors logged '+errs.join(' | '));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
