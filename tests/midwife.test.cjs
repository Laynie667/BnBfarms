// Nov 10, Laynie: "revisit pregnancy and Midwife mechanics. Midwifes need a way to check progress, speed labor along,
// variable messages per species". Every kind births its own way now (10y2b-birthing.js), labour takes as long as the
// litter needs, one sometimes comes stuck, and midwives (staff, and anybody trusted) give checkups, help labour along,
// turn a stuck one, bring labour on (asked first), and tend them after (breeding/midwife.js).
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],breedable:true,fertile:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],futa:true,breedable:true},
 "700":{mn:700,name:"Rex",roles:["LIVESTOCK"],species:"dog",onDuty:true,herds:[],tempKeys:[],cover:[],breedable:true,fertile:true},
 "800":{mn:800,name:"Bun",roles:["LIVESTOCK"],species:"bunny",onDuty:true,herds:[],tempKeys:[],cover:[],breedable:true,fertile:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,6,5),at(500,5,5),at(600,30,30),at(700,12,12),at(800,20,20)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:(W.__mutual||W.Player.FriendList).map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,500,600,700,800]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const realTimeout=setTimeout, wait=ms=>new Promise(r=>realTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
const drain=async(min)=>{ await wait(min||300); for(let i=0;i<400;i++){ const s=W.__st(); if(!s.queue.length&&!s.urgent.length&&!s.sending) break; await wait(100);} await wait(200); };
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const beepsTo=(k,mn)=>sent.slice(k).filter(([e,d])=>e==='AccountBeep'&&d.MemberNumber===mn).map(([e,d])=>String(d.Message));
const said=(k)=>sent.slice(k).map(([e,d])=>d&&(d.Content||d.Message)).filter(Boolean).map(String).join(' || ');
const P=(mn)=>L().people[mn].prod;
const cmd=async(mn,text,ms)=>{ const k=sent.length; handlers.AccountBeep({MemberNumber:mn,Message:text}); await drain(ms||5600); return k; };
(async()=>{ await wait(3500);
  chars[1].Name='Laynie'; chars[2].Name='Moo'; chars[3].Name='Hana'; chars[4].Name='Rex'; chars[5].Name='Bun';
  eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-breeding.user.js'),'utf8')); await wait(200);
  for (const m of [500,600,700,800]) { const k=sent.length; handlers.AccountBeep({MemberNumber:m,Message:'stats'}); }
  await drain(1500);
  const now=Date.now();

  // ── every kind its own way ──
  const K=W.__birthKinds();
  ok(['cow','horse','deer','pig','dog','den','cat','bunny','goat','sheep','rat','goblin','dragon'].every(k=>K[k]&&K[k].water.length&&K[k].labour.length&&K[k].crown.length&&K[k].endMany.length), 'every kind has its own water, labour, crown and birth lines');
  ok(W.__birthWords(500).place==="the calvin' pen" && W.__birthWords(700).place==="the whelpin' box" && W.__birthWords(800).place==="the fur-lined nest", 'a cow calves, a dog whelps, a bunny kindles');
  ok(W.__birthWords(500).one==='calf' && W.__birthWords(700).many==='pups' && W.__birthWords(800).many==='kits', "their own young: calf, pups, kits");
  const all=[].concat(...Object.values(K).map(o=>[].concat(...Object.values(o))), ...['water','early','strong','close','crownOne','endOne','stuck','stuckWait','unstuck','push','crownMany','mid','huge','endMany'].map(k=>W.__birthShared(k)));
  ok(!all.some(l=>/\(|\)/.test(l)), 'no round brackets in any birth line');
  ok(!all.some(l=>/%ml\b/.test(l)), "no old %ml amounts left in birth lines");
  ok(!W.__birthShared('mid').concat(W.__birthShared('push'),W.__birthShared('huge')).some(l=>/lowin'|farrowin'|fit for a sow/.test(l)), "the shared lines don't moo or farrow for everybody");
  // a dog's labour line is a dog's
  P(700).preg={since:now-5*86400000, due:now+600000, sires:[600], count:4, warned:true};
  const dl=[...Array(12)].map(()=>W.__birthLine('strong',700,null,'labour')).join(' ');
  ok(!/\bmoo\b|lowin'/.test(dl) && /Rex/.test(dl), "a dog's labour never moos ("+dl.slice(0,90)+"…)");
  const de=W.__birthLine('endMany',700,{count:4,kids:{male:2,female:2,futa:0},v:{c:'Hana',x:'4'}});
  ok(/4 pups/.test(de) && /2 male and 2 female/.test(de) && /Hana/.test(de), 'a litter reads "4 pups, 2 male and 2 female": '+de.slice(0,120));
  const ce=W.__birthLine('endOne',500,{count:1,kids:{male:0,female:1,futa:0},v:{c:'Hana',x:'1'}});
  ok(/calf/.test(ce) && /a little female/.test(ce) && !/litter/.test(ce), 'a single calf reads like one: '+ce.slice(0,120));

  // ── how long labour takes ──
  P(500).preg={since:now-5*86400000*0.5, due:now+5*86400000*0.5, sires:[600], count:1, warned:false};
  ok(W.__labourMins(500)===60, 'a first single: 45 + 15 = 60 minutes ('+W.__labourMins(500)+')');
  P(700).offspring.litters=2; ok(W.__labourMins(700)===44, 'an old hand with four: 45 + 9 - 10 = 44 minutes ('+W.__labourMins(700)+')');
  P(700).offspring.litters=0; P(700).preg=null;

  // ── checkups ──
  let k=await cmd(600,'checkup Moo');
  ok(beepsTo(k,600).some(t=>/staff and the midwives they trust/.test(t)), 'somebody not trusted can\'t give a checkup');
  k=await cmd(221397,'checkup Moo');
  const ck=beepsTo(k,221397).join(' ');
  ok(/Checkup on Moo: Showin', about \d days? to go\. [A-Z]/.test(ck) && /Bred by Hana\./.test(ck), 'staff beside them get stage, time left and the sire ('+ck.slice(0,160)+')');
  ok(/One calf, by the feel of it|Just the one/.test(ck), "...and a feel for how many");
  ok(beepsTo(k,500).some(t=>/Laynie gave you a checkup/.test(t)), 'the one carryin\' is told what was found');
  ok(/kneels|ear|hands|heft|checks|spreads|lie back/.test(said(k)), 'the room sees hands on the belly');
  const pts=(L().staffScore||{})['221397']; ok(pts && pts.pts>=1 && pts.why.checkup===1, 'a staff point for the checkup');
  k=await cmd(221397,'checkup Moo'); ok(L().staffScore['221397'].why.checkup===1, '...once a day each');
  k=await cmd(500,'checkup off'); ok(L().mods.breeding.mw.noCheck['500']===true, '?checkup off');
  k=await cmd(221397,'checkup Moo'); ok(beepsTo(k,221397).some(t=>/said no checkups/.test(t)), '...and nobody checks them');
  k=await cmd(500,'checkup on');
  k=await cmd(500,'checkup'); ok(beepsTo(k,500).some(t=>/What you can feel: Showin'/.test(t) && /Can't tell how many/.test(t) && !/Bred by/.test(t)), 'their own feel: rougher, no count');

  // ── trusted midwives ──
  k=await cmd(600,'midwives add Rex'); ok(beepsTo(k,600).some(t=>/Only herdmasters and proprietors/.test(t)), 'livestock can\'t trust a midwife');
  k=await cmd(221397,'midwives add Hana');
  ok(L().mods.breeding.mw.trusted['600'] && beepsTo(k,600).some(t=>/trusts you as one of the farm's midwives/.test(t)), 'a proprietor trusts Hana as a midwife, and Hana is told');
  chars[3].MapData.Pos={X:5,Y:6};
  k=await cmd(600,'checkup Moo'); ok(beepsTo(k,600).some(t=>/Checkup on Moo/.test(t)), 'a trusted midwife gives checkups');
  k=await cmd(800,'midwives'); ok(beepsTo(k,800).some(t=>/every member of staff, plus Hana/.test(t)), '?midwives lists them');

  // ── bringin' it on ──
  k=await cmd(221397,'induce Moo'); ok(beepsTo(k,221397).some(t=>/Too soon, sugar/.test(t)), 'not before they\'re nestin\'');
  P(500).preg.since=now-5*86400000*0.95; P(500).preg.due=now+5*86400000*0.05;
  k=await cmd(221397,'induce Moo');
  ok(beepsTo(k,500).some(t=>/wants to bring your labour on/.test(t)), 'nestin\': they\'re asked first');
  ok(!P(500).labour, '...and nothin\' happens till they answer');
  k=await cmd(500,'yes');
  const lb=P(500).labour;
  ok(lb && lb.how==='induced' && lb.midwife===221397, 'a yes brings labour on, with the one who brought it as midwife');
  ok(lb && Math.round((lb.until-lb.start)/60000)===60, '...a first single: 60 minutes');
  ok(/calvin'/.test(said(k)), "the water breaks in the calvin' pen ("+said(k).slice(0,120)+")");
  ok(beepsTo(k,221397).some(t=>/Midwives wanted|midwife's hands/.test(t)), 'staff on duty get called');

  // ── helpin' it along ──
  const u0=P(500).labour.until;
  k=await cmd(221397,'midwife Moo');
  ok(P(500).labour.until<=u0-5*60000+1000 && P(500).labour.helps===1, 'each ?midwife takes 5 minutes off');
  ok(beepsTo(k,221397).some(t=>/That helped\. About \d+ minutes to go/.test(t)), '...and says how long is left');
  k=await cmd(221397,'midwife Moo'); ok(beepsTo(k,221397).some(t=>/catch their breath/.test(t)) && P(500).labour.helps===1, 'not more than once every 3 minutes each');
  k=await cmd(600,'midwife Moo'); ok(P(500).labour.helps===2, 'another midwife can help too');
  // the stuck one
  P(500).labour.next=0; P(500).labour.start=Date.now()-50*60000; P(500).labour.until=Date.now()+20*60000;
  { const r0=Math.random; Math.random=()=>0.01; W.__pt(); Math.random=r0; }
  await drain(1500);
  ok(P(500).labour.stuck, 'past the middle, one can come stuck');
  const held=P(500).labour.until;
  P(500).labour.stuck.at=Date.now()-4*60000;
  W.__pt(); ok(P(500).labour.stuck && P(500).labour.until===held, '...and labour waits while it is');
  L().mods.breeding.mw.helpAt['600:500']=0;
  k=await cmd(600,'midwife Moo');
  ok(!P(500).labour.stuck && P(500).labour.until>=held+4*60000-2000, 'a midwife turns it, and the wait is added back');
  ok(beepsTo(k,600).some(t=>/You turned it/.test(t)), '...and is told');
  // nobody comes: the farm girl turns it herself
  P(500).labour.stuck={at:Date.now()-11*60000}; k=sent.length; W.__pt(); await drain(1500);
  ok(!P(500).labour.stuck && /farm girl/.test(said(k)), 'after 10 minutes the farm girl turns it herself');
  // the birth
  const pts0=L().staffScore['221397'].pts, rib0=(L().people[500].ribbons||0);
  P(500).labour.until=Date.now()-1; k=sent.length; W.__pt(); await drain(3000);
  ok(!P(500).preg && P(500).offspring.litters===1, 'the calf comes');
  ok(L().staffScore['221397'].pts===pts0+2+1, 'the midwife: 2 points, and one for each help ('+(L().staffScore['221397'].pts-pts0)+')');
  ok(beepsTo(k,500).length>=0 && (L().people[500].ribbons||0)>rib0, 'two helps or more: a ribbon for a smooth birthin\'');
  ok(L().mods.breeding.mw.born['500'] && L().mods.breeding.mw.born['500'].midwife===221397, 'the birth remembers its midwife');
  // aftercare
  const fr0=P(500).freshUntil; L().mods.breeding.mw.helpAt={};
  k=await cmd(221397,'midwife Moo');
  ok(P(500).freshUntil>=fr0+86400000-2000 && beepsTo(k,221397).some(t=>/You tended Moo/.test(t)), 'just after: ?midwife tends them, a day more of fresh milk');
  k=await cmd(221397,'midwife Moo'); ok(!beepsTo(k,221397).some(t=>/You tended/.test(t)), '...once');

  // ── the Expectin' card ──
  P(700).preg={since:now-5*86400000*0.7, due:now+5*86400000*0.3, sires:[600], count:3, warned:true};
  const cards=W.__stateFor(221397).mods.breeding.cards, card=cards.find(c=>/Expectin' on the farm/.test(c.title));
  ok(card && card.staff && card.lines.some(l=>l[0]==='Rex' && /heavy with it/.test(l[1])), 'staff see who\'s carryin\' on the farm, and how far');
  const hc=W.__stateFor(600).mods.breeding.cards.find(c=>/Expectin' on the farm/.test(c.title));
  ok(hc && !hc.staff, 'a trusted midwife sees it too, in their own panel');
  ok(!W.__stateFor(800).mods.breeding.cards.some(c=>/Expectin' on the farm/.test(c.title)), 'nobody else does');

  const errs=warns.filter(w=>/add-on|birth|labour/i.test(w)); ok(!errs.length, 'no errors logged '+errs.slice(0,3).join(' | '));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
