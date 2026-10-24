// Test subjects and the traps only they spring (Oct 10): the role, trap spots, the thing in the water, shots and
// potions that stack, toys that dose / lay / feed on their own, ?watersports, and the walkin' penalty.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "400":{mn:400,name:"Hand",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,potionsOn:true},
 "600":{mn:600,name:"Rex",roles:["LIVESTOCK"],species:"dog",gender:"male",futa:true,onDuty:true,herds:[],tempKeys:[],cover:[],limits:"eggs"}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"trap-injector":{X:20,Y:20},"trap-gas":{X:22,Y:20},"trap-eggs":{X:24,Y:20},"pond":{X:30,Y:30}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(400,11,10),at(500,15,10),at(600,14,10)];
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
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>String(d.Content||d.Message)).join(' | ');
const moveTo=(mn,X,Y)=>{ chars.find(c=>c.MemberNumber===mn).MapData.Pos={X,Y}; };
const C=mn=>chars.find(c=>c.MemberNumber===mn);
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.15; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0;
  ['Laynie','Hand','Moo','Rex'].forEach((nm,i)=>chars[i+1].Name=nm);
  const roles=mn=>P(mn).roles, prod=mn=>P(mn).prod;
  await say(500,'?stats'); await say(600,'?stats');
  // ── the role ──
  // (Oct 20: no more subject role: traps are each player's own switch)
  let n=sent.length; await say(221397,'?subject add Moo'); ok(/no test subject list/.test(to(221397,n)) && !P(500).trapsOn, 'nobody can switch somebody else\'s traps on');
  n=sent.length; await say(500,'?traps on');
  ok(P(500).trapsOn===true && roles(500).includes('LIVESTOCK') && !roles(500).includes('SUBJECT'), '?traps on switches them on, alongside their roles');
  ok(/Traps: ON/.test(to(500,n)) && /traps off/.test(to(500,n)) && /SAFEWORD/i.test(to(500,n)), 'they are told what it means and how to switch it off');
  n=sent.length; await say(221397,'?subject',4000); ok(/Moo .500. /.test(to(221397,n)), '?subject lists them for a proprietor');
  n=sent.length; await say(221397,'?traps'); ok(/trap-injector/.test(to(221397,n)) && /pond/.test(to(221397,n)) && /tentacle/.test(to(221397,n)), '?traps shows staff the kinds, the spots and the water');
  n=sent.length; await say(500,'?traps'); ok(!/trap-injector/.test(to(500,n)) && /not tellin' you where/.test(to(500,n)), '...a subject hears what is out there, not where');
  // ── a trap spot: nobody but a subject ──
  moveTo(600,20,20); n=sent.length; W.__trapTick(); await wait(1200);
  ok(!/sprung a trap/.test(all(n)), 'a trap does nothin\' for stock who are not subjects');
  moveTo(600,14,10);
  await say(221397,'?trap load trap-injector lactation x3');
  moveTo(500,20,20); n=sent.length; W.__trapTick(); await wait(3500);
  ok(/sprung a trap/.test(to(500,n)), 'a subject steppin\' on it springs it');
  ok(prod(500).boosts.milk > Date.now() && prod(500).boostX.milk === 3, 'the loaded injector lands its dose: lactation x3 is level 3');
  ok(/triple dose/.test(all(n)), '...and the room sees the story and the dose');
  ok(!P(500).penned, 'the trap lets go when it is done');
  const r1=W.__milkRate(500); W.__shot(500,221397,'lactation'); ok(prod(500).boostX.milk === 4 && W.__milkRate(500) > r1, 'another shot on top stacks (level 4, milk comes faster)');
  W.__shot(500,221397,'lactation x5'); ok(prod(500).boostX.milk === 5, '...up to five and no further');
  n=sent.length; W.__trapTick(); await wait(600); ok(!/sprung a trap/.test(to(500,n)), 'standin\' on it does not spring it twice');
  moveTo(500,15,10); W.__trapTick(); moveTo(500,20,20); n=sent.length; W.__trapTick(); await wait(600);
  ok(!/sprung a trap/.test(to(500,n)), '...and it takes a while to reset');
  // ── skip, pause, limits ──
  await say(500,'?traps skip gas'); moveTo(500,22,20); n=sent.length; W.__trapTick(); await wait(800);
  ok(!/sprung a trap/.test(to(500,n)) && !(prod(500).heat && prod(500).heat.until > Date.now()), 'a kind they ruled out never springs');
  await say(500,'?traps allow gas'); await say(221397,'?trap load trap-gas heat strong'); moveTo(500,15,10); W.__trapTick(); moveTo(500,22,20); n=sent.length; W.__trapTick(); await wait(1500);
  ok(prod(500).heat && prod(500).heat.until > Date.now(), 'the gas trap leaves them in heat');
  await say(600,'?traps on'); moveTo(600,24,20); n=sent.length; W.__trapTick(); await wait(1000);
  ok(!prod(600).eggs, 'hard limits rule a trap out (eggs)');
  moveTo(600,14,10);
  // ── the thing in the water ──
  cfg.TENTACLE_CHANCE=0; moveTo(500,30,30); n=sent.length; W.__trapTick(); await wait(500); ok(!prod(500).eggs, 'most times the water is just water');
  cfg.TENTACLE_CHANCE=1; moveTo(500,15,10); W.__trapTick(); moveTo(500,30,30); n=sent.length; W.__trapTick(); await wait(600);   // (in the water itself, Oct 24: not beside it)
  ok(P(500).penned && P(500).penned.trap, 'when it comes, it holds them there');
  await wait(3500);
  const e=prod(500).eggs; ok(e && e.n >= 4 && e.by === -2, 'it always leaves eggs ('+(e&&e.n)+')');
  ok(/thing in the water|tentacle|eggs/.test(all(n)) && /eggs in your/.test(to(500,n)), 'the scenes play out and they are told the count');
  ok(W.__slow(500) > 1 && W.__stateFor(500).slow > 1, 'carryin\' a clutch slows them down ('+W.__slow(500)+'x)');
  ok(W.__slow(221397) === 1, '...nobody else');
  // ── the safeword ──
  await say(221397,'?traps on'); cfg.TRAP_BEAT_S=5;
  n=sent.length; await say(221397,'?trap spring Laynie clamp'); ok(/Sprung on Laynie/.test(to(221397,n)), 'a proprietor can spring one by hand');
  await say(221397,'?safeword',2500); cfg.TRAP_BEAT_S=0.15; await wait(600);
  ok(!(P(221397).prod && P(221397).prod.deniedUntil > Date.now()), 'the safeword stops a trap before it lands');
  n=sent.length; await say(221397,'?trap spring Laynie mud'); ok(/safeword not long ago/.test(to(221397,n)), '...and every trap stays quiet for an hour after');
  // ── the ones with somebody waitin' in them ──
  await say(400,'?traps on'); P(400).breedable=true; P(400).fertile=true; await say(400,'?stats');
  n=sent.length; await say(221397,'?trap spring Hand wolves'); await wait(1800);
  ok(/wolf/i.test(all(n)) && P(400).prod.held.vulva > 100 && W.__stateFor(400).today.tally >= 3, 'the wolf den: three loads, three on the tally');
  cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; P(400).prod.held={vulva:0,butt:0,mouth:0}; P(400).prod.preg=null;
  n=sent.length; await say(221397,'?trap spring Hand drake'); await wait(1800);
  ok(P(400).prod.eggs && P(400).prod.eggs.by === -16 && /drake|dragon|nest/.test(all(n)), 'the drake leaves a clutch, in the book under his name');
  P(400).breedable=false; P(400).prod.held={vulva:0,butt:0,mouth:0};
  n=sent.length; await say(221397,'?trap spring Hand stallion'); await wait(1800);
  ok(/stallion|rope after heavy rope|hoses/.test(all(n)) && !P(400).prod.held.vulva, 'not ?breedable: the load goes over them, never inside');
  // ── sixteen more ──
  const spring=async(k,ms)=>{ P(400).trapAt=0; P(400).penned=null; n=sent.length; await say(221397,'?trap spring Hand '+k); await wait(ms||1500); return to(221397,n); };
  P(400).breedable=true; L().spots.pen={X:40,Y:40};
  await spring('pillory'); ok(P(400).benched && P(400).benched.trap, 'the pillory locks them in where they stand');
  P(400).benchOn=false; W.__benchTick(); ok(!!P(400).benched, '...and holds a subject who never said ?bench on');
  await say(600,'?stats'); moveTo(600,C(400).MapData.Pos.X+1,C(400).MapData.Pos.Y); n=sent.length; await say(600,'?use Hand',3000);
  ok(P(400).benched && P(400).benched.uses === 1, '...where anybody standin\' by can ?use them');
  P(400).benched=null; moveTo(600,14,10);
  await spring('winch'); ok(P(400).penned && P(400).penned.name === 'pen', 'the winch walks them to the pen and leaves them there');
  await spring('glue'); ok(P(400).gluedUntil > Date.now() && W.__slow(400) >= 1.6, 'glue: slow on their feet after');
  P(400).gluedUntil=0;
  await spring('tickle'); ok(P(400).trapWait && P(400).trapWait.kind === 'tickle' && P(400).penned, 'the tickle rack holds on');
  n=sent.length; await say(400,'?beg '+((L().life&&L().life.begPhrase)||cfg.BEG_PHRASE),2500); ok(!P(400).trapWait && !P(400).penned, '...till they beg');
  await spring('mirror'); const ln=P(400).trapWait && P(400).trapWait.line; ok(!!ln, 'the mirror box gives them a line');
  for (let i=0;i<4;i++) W.__heard(400, ln.toUpperCase()+'!'); ok(P(400).trapWait && P(400).trapWait.n === 4, '...and counts each time they say it');
  W.__heard(400, ln); await wait(300); ok(!P(400).trapWait, '...and opens on the fifth');
  let why=await spring('trough'); ok(/watersports/.test(why), 'the golden trough only for ?watersports on');
  why=await spring('weights'); ok(/no balls/.test(why), 'the ball weights only for studs');
  P(400).prod.held={vulva:0,butt:0,mouth:0}; await spring('chute'); ok(P(400).prod.held.mouth > 150, 'the feed chute ('+Math.round(P(400).prod.held.mouth)+') fills their belly');
  P(400).prod.held={vulva:0,butt:0,mouth:0}; await spring('wall', 2200); ok(P(400).prod.held.vulva > 100, 'the hole in the wall: strangers at the fence');
  n=sent.length; await spring('pricetag'); ok(/RIBBONS|ribbons/.test(all(n)) && P(400).priced, 'the price tag: priced, and the sale is called');
  await spring('paddle'); ok(P(400).paddled === 20, 'the paddle wheel counts twenty');
  P(400).breedable=false;
  // ── what grew up round the traps ──
  P(400).trapAt=0; P(400).penned=null; P(400).benched=null; cfg.STRUGGLE_CHANCE=1; cfg.TRAP_BEAT_S=5; W.__prodOf(400).held={}; W.__prodOf(400).eggs=null;   // (Oct 24: a full, heavy pet struggles worse)
  await say(221397,'?trap spring Hand glue'); n=sent.length; await say(400,'?struggle',2500);
  ok(/You're out/.test(to(400,n)) && !P(400).penned, '?struggle: one try, and a win gets them out');
  cfg.STRUGGLE_CHANCE=0; P(400).trapAt=0; P(400).trapQuiet=0;
  await say(221397,'?trap spring Hand snare'); n=sent.length; await say(400,'?struggle',2500); await say(400,'?struggle please',2500);
  ok(/tighter/.test(to(400,n)) && /one try/.test(to(400,n)), '...a loss tightens it, and there is no second try');
  cfg.FREE_CHANCE=1; moveTo(600,C(400).MapData.Pos.X+1,C(400).MapData.Pos.Y); n=sent.length; await say(600,'?free Hand',2500);
  ok(/Got 'em out/.test(to(600,n)) && !P(400).penned, '?free: somebody standin\' by can get them out');
  cfg.TRAP_BEAT_S=0.15; moveTo(600,14,10); P(400).trapAt=0; P(400).trapQuiet=0;
  await spring('mud'); ok(P(400).dirt && P(400).dirt.mud && W.__stateFor(400).now.some(x=>/mud/i.test(x.text)), 'aftermath: muddy shows on their right-now strip');
  W.__cfg.WASH_BEAT_S=0.1; n=sent.length; await say(400,'?wash',2600); ok(!P(400).dirt || !P(400).dirt.mud, '...till they wash');
  const tc=W.__stateFor(400).trapCard; ok(tc && tc.total >= 5 && tc.kinds.some(k=>k.kind==='glue') && tc.left > 0, 'the trap card counts every kind that has had them');
  await say(221397,'?trap bait trap-gas 3'); const rb0=P(400).ribbons||0; P(400).trapAt=0; P(400).spotTrapAt={}; moveTo(400,15,10); W.__trapTick(); moveTo(400,22,20); W.__trapTick(); await wait(4500);
  ok((P(400).ribbons||0) === rb0+3, 'bait: the next subject that trap catches is paid');
  L().spots.pasture={X:35,Y:35}; n=sent.length; await say(221397,'?hunt start 10',3000);
  ok(L().hunt && /HUNT IS ON/.test(all(n)), '?hunt start rings the bell');
  const rb1=P(400).ribbons||0; P(400).penned=null; moveTo(400, L().spots[L().hunt.goal].X, L().spots[L().hunt.goal].Y); W.__trapTick(); await wait(600);
  ok(L().hunt.done.includes(400) && (P(400).ribbons||0) > rb1, '...and a subject who reaches the finish is paid');
  await say(221397,'?hunt stop'); ok(!L().hunt, '?hunt stop ends it');
  L().spots.nest={X:45,Y:45}; P(400).prod.eggs={n:6,by:-2,since:Date.now()-2*3600000,layAt:Date.now()+86400000}; moveTo(400,45,45);
  n=sent.length; await say(400,'?lay',2600); ok(!P(400).prod.eggs && L().nest && L().nest.eggs === 6, '?lay at the nest');
  const rb2=P(400).ribbons||0; moveTo(221397,45,46); n=sent.length; await say(221397,'?gather',2600);
  ok(L().nest.eggs === 0 && (P(400).ribbons||0) > rb2, '?gather: staff collect, the layer is paid');
  n=sent.length; await say(221397,'?board',4000); ok(/Test subject of the week/.test(to(221397,n)) && /Best layer/.test(to(221397,n)), 'the board names the subject of the week and the best layer');
  // the parasite comes back as a belt
  cfg.PARASITE_LATCH_S=0.1; cfg.PARASITE_CHANCE=1; P(500).parasiteOn=true; P(500).parasiteNext=0; P(500).parasite=null; P(500).parasiteN=3; W.__load(-1,500,'mouth',60); await wait(900);
  ok(P(500).parasite && P(500).parasite.form === 'belt' && W.__stateFor(500).parasite.form === 'belt', 'fourth time on the same host, the parasite comes back as a belt');
  prod(500).held.vulva=100; const pf=P(500).parasite.n; W.__load(600,500,'vulva',100); await wait(600);
  ok(prod(500).held.vulva === 0 && P(500).parasite.n === pf+1, '...and drinks from the other end');
  P(500).parasite=null; P(500).parasiteOn=false; P(500).parasiteN=0; P(500).parasiteNext=0; P(500).crave=null; P(400).breedable=false;
  // ── kinds and strengths, the Danger Draught, eager ──
  n=sent.length; await say(221397,'?trap load trap-gas nonsense'); ok(/takes a kind and a strength/.test(to(221397,n)), 'a gas trap is loaded with a kind and a strength');
  P(400).trapAt=0; P(400).penned=null; L().trapLoads['trap-x']='musk brutal';
  await spring('gas'); ok(P(400).trapSev && ['mild','strong','brutal'].includes(P(400).trapSev), 'a gas trap picks a kind and a strength ('+P(400).trapSev+')');
  P(400).dirt=null; await spring('spray'); ok(!!P(400).trapSev, 'so does a spray trap');
  await say(400,'?traps eager on'); ok(P(400).trapEager === true && W.__stateFor(400).trapCard.eager, '?traps eager on: their own switch to skip the waits');
  P(400).trapAt=Date.now(); P(400).spotTrapAt={'trap-gas':Date.now()}; P(400).penned=null; cfg.TRAP_COOLDOWN_MIN=3; moveTo(400,15,10); W.__trapTick(); moveTo(400,22,20); n=sent.length; W.__trapTick(); await wait(1500);
  ok(/sprung a trap/.test(to(400,n)), '...eager: the same trap springs again with no breather and no reset');
  cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; await say(400,'?traps eager off'); P(400).penned=null; P(400).potionsOn=true;
  await say(221397,'?potion give Hand danger',2600); P(400).trapAt=0; P(400).penned=null; await say(221397,'?trap spring Hand glue',1500);
  ok(P(400).fx && P(400).fx.danger && P(400).gluedUntil > Date.now()+38*60000, 'a Danger Draught doubles a trap timer (sticky feet for 40 minutes, not 20)');
  await wait(1200); await say(221397,'?potion give Hand danger',2600); P(400).trapAt=0; P(400).penned=null; await say(221397,'?trap spring Hand glue',1500);
  ok(P(400).fx.danger.x === 2 && P(400).gluedUntil > Date.now()+58*60000, '...a second bottle triples it');
  await wait(1200); delete P(400).fx.danger; P(400).gluedUntil=0; P(400).penned=null;
  // ── quit ──
  await say(500,'?traps off'); ok(!P(500).trapsOn && roles(500).includes('LIVESTOCK'), '?traps off switches them off, nothin\' else');
  // ── potions stack ──
  await say(221397,'?potion give Moo clover'); await say(221397,'?potion give Moo clover',2600);
  ok(P(500).fx.clover && P(500).fx.clover.x === 2 && P(500).fx.clover.until > Date.now()+100*60000, 'a second bottle stacks: stronger and longer');
  // ── toys that act on their own ──
  cfg.AUTOINJECT_MIN=0; cfg.OVI_MIN=0; cfg.AUTOFEED_MIN=0; cfg.TOYCOCK_MIN=0;
  const item=(g,name,craft,d)=>({Asset:{Name:name,Group:{Name:g}},Craft:{Name:craft,Description:d||''}});
  C(600).Appearance=[item('ItemPelvis','Belt','Doser Belt','auto-injector virility x2')];
  W.__trapTick(); await wait(50); n=sent.length; W.__trapTick(); await wait(900);
  ok(P(600).prod.boostX && P(600).prod.boostX.semen === 2, 'an auto-injector belt doses its wearer with what it says');
  P(500).eggs=true; prod(500).held={vulva:0,butt:0,mouth:0}; const e0=(prod(500).eggs||{n:0}).n;
  C(500).Appearance=[item('ItemButt','Plug','Layer Plug','ovipositor'), item('ItemMouth','FunnelGag','Feeder','auto-feed')];
  W.__trapTick(); await wait(50); n=sent.length; W.__trapTick(); await wait(900);
  ok(prod(500).eggs && prod(500).eggs.n > e0, 'an ovipositor plug lays in them (with ?eggs on)');
  ok(prod(500).held.mouth >= 100, 'an auto-feed gag pours a bellyful down them');
  C(600).Appearance=[item('ItemMouth','Gag','Layer Gag','ovipositor')]; W.__trapTick(); await wait(50); W.__trapTick(); await wait(300);
  ok(!prod(600).eggs, '...never past a hard limit');
  // ── the parasite lips ──
  cfg.PARASITE_LATCH_S=0.1; cfg.PARASITE_CHANCE=1;
  W.__load(-1,500,'mouth',60); await wait(500); ok(!P(500).parasite, 'no parasite for anybody who has not said ?parasite on');
  await say(500,'?parasite on'); n=sent.length; W.__load(600,500,'mouth',60); await wait(500); ok(!P(500).parasite, '...and only out of the glory holes');
  W.__load(-1,500,'vulva',60); await wait(500); ok(!P(500).parasite, '...and only from a load swallowed');
  n=sent.length; W.__load(-1,500,'mouth',60); await wait(900);
  ok(P(500).parasite && P(500).parasite.until > Date.now()+11*3600000 && /livin' lips/.test(to(500,n)), 'it latches for 12 hours and they are told what it is');
  P(500).parasite.strain='grower'; P(500).parasite.urgeAt=Date.now()+9e9;
  const f0=prod(500).boostX.fert||0, sz=()=>JSON.stringify(prod(500).size||{}), s0=sz(); P(500).parasite.next=0; n=sent.length; W.__parasiteTick(); await wait(700);
  ok(P(500).parasite.n === 1 && sz() !== s0, 'every half hour it feeds them a dose (growth first: '+sz()+')');
  prod(500).held.mouth=250; const u0=P(500).prod.size && P(500).prod.size.udder; n=sent.length; W.__load(600,500,'mouth',250); await wait(700);
  ok(prod(500).held.mouth === 0 && P(500).parasite.fed === 1 && P(500).parasite.n === 2, 'a swallowed load never reaches the belly: it is turned into a dose');
  ok(W.__stateFor(500).parasite && W.__stateFor(500).parasite.until > Date.now(), 'the Companion is told, so it can put the real lips on');
  // it spreads by a kiss, but only to somebody who asked
  W.__cfg.PARASITE_KISS_CHANCE=1; W.__kiss('Kiss','ItemMouth',500,600); await wait(3600); ok(!P(600).parasite, 'a kiss cannot give it to somebody who never said ?parasite on');
  await say(600,'?parasite on'); W.__kiss('Kiss','ItemMouth',600,500); await wait(3600); ok(!!P(600).parasite, '...and does to somebody who did, whichever of them leaned in');
  // strains, bloomin', kin, the Tyrant, milk
  ok(['breeder','grower','glutton','tyrant'].includes(P(600).parasite.strain), 'it latches as one of four strains ('+P(600).parasite.strain+')');
  { const g=P(500).parasite, since=g.since; ok(W.__parts(500).lips && !W.__parts(500).suckers && !W.__parts(500).root, 'at first it is only lips');
    g.since=Date.now()-5*3600000; W.__parasiteTick(); await wait(400); ok(W.__parts(500).suckers && (W.__stateFor(500).farmGear||[]).some(x=>x.slot==='cups' && /Suckers/.test(x.name)), 'from hour four: suckers on the teats, as real gear');
    g.since=Date.now()-9*3600000; W.__parasiteTick(); await wait(400); ok(W.__parts(500).root && (W.__stateFor(500).farmGear||[]).some(x=>x.slot==='belt'), 'from hour eight: a root below');
    prod(500).held.vulva=90; const n0=g.n; W.__load(600,500,'vulva',90); await wait(500); ok(prod(500).held.vulva===0 && g.n===n0+1, '...and with the root in, it drinks loads taken below too');
    g.strain='tyrant'; const n1=g.n; W.__climax(500); await wait(500); ok(g.n===n1+1 && g.eaten===1, 'a Tyrant eats an orgasm and pays in serum');
    g.strain='grower'; g.since=since; }
  // the cravin'
  P(500).parasite.ate=Date.now()-3*3600000; P(500).parasite.told=0; n=sent.length; W.__parasiteTick(); await wait(700);
  ok(/shakin'|clenches|narrowed|droolin'|floor|jaw/.test(all(n)), 'too long without a load and the cravin\' bites (only they see it)');
  n=sent.length; await say(500,'?parasite'); ok(/more hours/.test(to(500,n)), '?parasite says how long is left');
  n=sent.length; await say(400,'?purge Moo'); ok(!P(500).parasite && /Purged/.test(to(400,n)), 'staff can ?purge it');
  W.__load(-1,500,'mouth',60); await wait(500); ok(!P(500).parasite, 'it cannot come back the same day');
  ok(P(500).crave && P(500).crave.until > Date.now(), '...and it leaves the cravin\' behind for a while');
  // a Danger Draught and the parasite: 3%, then one in four, then a coin toss
  { const rolls=(k)=>{ let hit=0; const R0=Math.random; let i=0; Math.random=()=>((i++)%100)/100; for(let j=0;j<100;j++){ P(500).parasite=null; P(500).parasiteNext=0; P(500).crave=null; const before=sent.length; } Math.random=R0; return 0; };
    P(500).parasiteOn=true; cfg.PARASITE_CHANCE=0.03; P(500).fx=P(500).fx||{}; delete P(500).fx.danger; const ch=()=>W.__parasiteChance(500);
    const c0=ch(); P(500).fx.danger={at:Date.now(),until:Date.now()+3600000,n:0,x:1}; const c1=ch(); P(500).fx.danger.x=2; const c2=ch(); P(500).fx.danger.x=4; const c4=ch(); delete P(500).fx.danger; P(500).parasiteOn=false;
    ok(c0===0.03 && c1===0.25 && c2===0.5 && c4===1, 'the parasite: 3%, then a quarter more for every Danger Draught, certain at four ('+[c0,c1,c2,c4].join(', ')+')'); }
  // ── watersports ──
  n=sent.length; await say(500,'?watersports'); ok(/is off for you/.test(to(500,n)), 'watersports is off till they say so');
  await say(500,'?watersports on'); ok(P(500).watersports === true && W.__stateFor(500).switches.watersports === true, '?watersports on, and the Companion knows');
  const errs=warns.filter(w=>/trap|toy|command failed/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | '));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
