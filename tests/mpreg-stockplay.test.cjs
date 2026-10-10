// Hollow (fuckable) plugs don't close a hole; an mpreg item lets a load in the ass take (hyper and more than one
// sire too); stock can milk, edge and groom other stock once that one's said yes.
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
(async()=>{ await wait(3500); W.__cfg.USER_COOLDOWN_S=0;
  ['Laynie','Moo','Rex'].forEach((nm,i)=>chars[i+1].Name=nm);
  chars.push(at(700,16,10)); chars[4].Name='Bull'; L().people[700]={mn:700,name:'Bull',roles:['LIVESTOCK'],species:'cow',futa:true,onDuty:true,herds:[],tempKeys:[],cover:[],limits:''};
  chars.push(at(888,17,10)); chars[5].Name='Visitor';
  const moo=chars[2], item=(name,craft)=>({Asset:{Name:name,Group:{Name:'ItemButt'}},Craft:craft||undefined});
  P(500).freeuse=true; P(500).benchOn=false;
  const fill=async(who)=>{ const pr=P(who).prod; if(pr){ pr.semen=60; pr.fills=[]; } const n=sent.length; await say(who,'?cum Moo butt',2600); return to(who,n); };
  await say(600,'?stats'); await say(700,'?stats'); await say(500,'?stats');
  // ── plugs ──
  moo.Appearance=[item('ButtPlug')];
  let a=await fill(600);
  ok(/blocked/.test(a) && !(P(500).prod.held.butt>0), 'an ordinary plug closes the ass: '+a.slice(0,70));
  moo.Appearance=[item('ButtPlug',{Name:'Hollow breeding plug',Description:'fuckable'})]; await wait(5200);
  a=await fill(600);
  ok(P(500).prod.held.butt>0, 'a hollow (fuckable) plug lets a cock through: '+a.slice(0,60));
  moo.Appearance=[item('HollowButtPlug')]; await wait(5200); P(500).prod.held.butt=0;
  await fill(600); ok(P(500).prod.held.butt>0, "...so does one that's hollow by its own name");
  // ── mpreg ──
  const rnd=Math.random; Math.random=()=>0.001;
  moo.Appearance=[]; await wait(5200); P(500).prod.preg=null;
  await fill(600);
  ok(!P(500).prod.preg, 'without an mpreg item a load in the ass never takes');
  moo.Appearance=[{Asset:{Name:'Collar',Group:{Name:'ItemNeck'}},Craft:{Name:'Breeder tag',Description:'mpreg, hyper pregnancy'}}]; await wait(5200);
  await fill(600);
  const g=P(500).prod.preg;
  ok(g && g.via==='butt' && g.sires[0]===600, 'with one on, it takes: carried in the ass, sired by Rex');
  ok(g && g.count>=3, 'the same item says hyper: a big litter ('+(g&&g.count)+')');
  await fill(700);
  ok(P(500).prod.preg.sires.length===2 && P(500).prod.preg.sires.includes(700), 'a second stud the same day adds a second sire');
  await fill(700); ok(P(500).prod.preg.sires.length===2, '...the same stud only once');
  // the switch: no item needed
  moo.Appearance=[]; await wait(5200); P(500).prod.preg=null; P(500).prod.held.butt=0;
  await say(500,'?mpreg on'); ok(P(500).mpreg===true && W.__stateFor(500).switches.mpreg===true, '?mpreg on: a switch of their own (in the Companion too)');
  await fill(600); ok(P(500).prod.preg && P(500).prod.preg.via==='butt', '...and a load in the ass takes with no item on');
  await say(500,'?mpreg off'); P(500).prod.preg=null; await fill(600); ok(!P(500).prod.preg, '?mpreg off: it does not');
  Math.random=rnd;
  // ── stock with stock ──
  moo.Appearance=[]; P(500).freeuse=false; P(500).milkable=true; P(500).prod.milk=3000; moveTo(600,16,10);
  function moveTo(mn,X,Y){ chars.find(c=>c.MemberNumber===mn).MapData.Pos={X,Y}; }
  let n=sent.length; await say(888,'?milk Moo');
  ok(/just for farm staff/.test(to(888,n)), 'a visitor not on the books still cannot');
  n=sent.length; await say(600,'?milk Moo');
  ok(/asked Moo first/.test(to(600,n)) && /Rex wants to milk you by hand/.test(to(500,n)) && P(500).prod.milk===3000, 'stock ask first: Moo gets a yes/no');
  n=sent.length; await say(500,'yes',3500);
  ok(P(500).prod.milk<3000, 'Moo said yes: Rex milks her ('+Math.round(P(500).prod.milk)+' mL left)');
  n=sent.length; P(500).prod.milk=3000; await say(600,'?milk Moo',3000);
  ok(P(500).prod.milk<3000 && !/asked/.test(to(600,n)), '...and is not asked again for a while');
  n=sent.length; await say(700,'?edge Moo'); await say(500,'no');
  ok(/said no/.test(to(700,n)), 'a no is a no: Bull is told');
  moveTo(600,40,40); n=sent.length; await say(600,'?milk Moo');
  ok(/right up next to/.test(to(600,n)), 'you have to be right beside them');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
