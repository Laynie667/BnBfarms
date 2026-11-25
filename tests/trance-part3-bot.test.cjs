// THE FARM'S TRANCE, PART 3, the bot's side (Nov 25, Conditioning 2.2). Compulsions (somethin' happenin' sets them off,
// a small chance each time; Laynie: "i prefer it is a small, random chance of them triggering"), hang-ons (they stay a
// while after), and "the deeper, the more permanent": Fun a day (a compulsion fires once), Deep a week, No human left set
// for good, taken out only by their herd leader or a proprietor ("handler or proprieter").
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,hypno:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"pony",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],hypno:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,20,20),at(500,5,5),at(600,30,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,Name:'Farmhand',FriendList:[221397,500,600]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, ChatRoomMapViewIsWall:()=>false, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const ext=(mn,type,data)=>handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'FarmhandMsg',Dictionary:Object.assign({v:2,type},data||{})});
const toExt=(k,mn,type)=>sent.slice(k).filter(([e,d])=>d&&d.Type==='Hidden'&&d.Content==='FarmhandMsg'&&d.Target===mn&&(!type||d.Dictionary.type===type)).map(([e,d])=>d.Dictionary);
const hyp=(k,mn,what)=>toExt(k,mn,'hypno').filter(d=>!what||d.do===what);
const words=(k,mn)=>toExt(k,mn).filter(d=>d.type==='reply'||d.type==='notice').map(d=>d.text).concat(sent.slice(k).filter(([e,d])=>d&&((e==='AccountBeep'&&d.MemberNumber===mn&&typeof d.Message==='string')||(d.Type==='Whisper'&&d.Target===mn))).map(([e,d])=>e==='AccountBeep'?d.Message:d.Content)).join(' | ');
const beep=async(mn,msg,ms)=>{ handlers.AccountBeep({MemberNumber:mn,Message:msg}); await wait(ms||1500); };
const lscgBeeps=(k,mn)=>sent.slice(k).filter(([e,d])=>e==='AccountBeep'&&d.MemberNumber===mn&&d.Message&&d.Message.IsLSCG).map(([e,d])=>d);
const LIB=`=== induction: Quick Down
pace: 1s

Hear my voice, {name}.

=== compulsion: Pat Melt
pace: 1s
when: pat
does: pose {low} → moo
waits: 2s
chance: 30%

A pat on your head, and sometimes you just melt.

=== compulsion: Leader Knees
level: deep, nhl
pace: 1s
when: leader
does: pose {low}

When your herd leader walks in, down you go.

=== hangon: Moo Talk
pace: 1s
effect: mootalk
lasts: 2h

Your {sound} slips out after.

=== wake: Up
pace: 1s

Up you come.

=== session: Quick
induction: any
compulsion: all
hangon: any
wake: any
`;
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2;
  chars[1].Name='Laynie'; chars[2].Name='Moo'; chars[3].Name='Hana'; chars[0].Name='Farmhand';
  L().mods=L().mods||{}; L().mods.conditioning={people:{"500":{max:"nhl",sessions:{fun:0,deep:0,nhl:0},total:0,tier:0}}, lib:{text:LIB,stamp:'p3',at:Date.now()}};
  eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-conditioning.user.js'),'utf8')); await wait(300);
  const P=W.__condPull, pl=()=>P.planted(500);
  ext(500,'hello',{ver:'0.83.0'}); ext(221397,'hello',{ver:'0.83.0'}); await wait(1500);
  const lscg={lscg:true,ver:'0.9.12',on:true,sugg:true,needHyp:true,mins:5,beats:true,scopes:['hypno','states'],under:false,ours:false,farmBeats:false,planted:[]};
  ext(500,'hypnoState',lscg); await wait(300);
  handlers.ChatRoomMessage({Sender:500,Type:'Chat',Content:'moo, hi'}); await wait(200);   // (Moo's about)
  const R=Math.random;

  // ── a Fun session: a compulsion that fires once and fades in a day; a hang-on capped at 20 minutes ──
  let k=sent.length; await beep(221397,'hyp Moo fun session Quick',300); await wait(6000);
  const pm=pl()['bnbfarm-c-pat-melt'];
  ok(pm && pm.kind==='compulsion' && pm.when==='pat' && Math.abs(pm.chance-0.3)<1e-9 && pm.once===true && !pm.perm && pm.until-Date.now()>23*3600000 && pm.until-Date.now()<=24*3600000,
    'Fun: the compulsion is kept (set off by a pat, 30%), fires once, fades in a day: '+JSON.stringify(pm||{}).slice(0,160));
  ok(!pl()['bnbfarm-c-leader-knees'], '...and only the ones meant for a Fun session');
  ok(pm && pm.s.instructions.map(i=>i.type).join()==='Assume Pose,bnbfarm.sound' && pm.s.instructions[0].arguments.selection.lower==='Kneel', '...made of the same instructions a trigger is (down low: kneelin\', their pick)');
  const hg=hyp(k,500,'hangon')[0];
  ok(hg && hg.effect==='mootalk' && hg.until-Date.now()<=20*60000+1000 && hg.until-Date.now()>15*60000 && hg.low==='kneel', 'the hang-on goes to their Companion, capped at 20 minutes for Fun (the block says 2 hours): '+JSON.stringify(hg||{}));

  // ── somethin' happens: a small chance each time ──
  Math.random=()=>0.99; k=sent.length; P.compel(500,'pat',221397); Math.random=R;
  ok(!hyp(k,500,'compel').length, 'a pat, and the dice say no: nothin\'');
  pm.rolled=0; Math.random=()=>0.01; k=sent.length;
  W.__addons('activity',{Type:'Activity',Sender:221397,Content:'ChatOther-ItemHead-Pet',Dictionary:[{SourceCharacter:221397},{TargetCharacter:500},{Tag:'ActivityName',Text:'Pet'},{ActivityName:'Pet'},{FocusGroupName:'ItemHead'}]});
  Math.random=R; await wait(300);
  const c1=hyp(k,500,'compel')[0];
  ok(c1 && c1.id==='bnbfarm-c-pat-melt' && c1.when==='pat' && c1.by===221397 && c1.instructions.length===2, 'Laynie pats Moo\'s head and the dice say yes: their Companion\'s told to reach in (give in or fight it): '+JSON.stringify(c1||{}).slice(0,140));
  Math.random=()=>0.01; k=sent.length; P.compel(500,'pat',221397); Math.random=R;
  ok(!hyp(k,500,'compel').length, '...never the same one twice in ten minutes');
  ext(500,'hypnoEvent',{ev:'fired',id:'bnbfarm-c-pat-melt',name:'B&B Pat Melt',resisted:false}); await wait(200);
  ok(!pl()['bnbfarm-c-pat-melt'], 'given in to, from a Fun session: spent');

  // ── a Deep session: a week, renewed when it lands; a hang-on capped at an hour ──
  L().mods.conditioning.people['500'].max='nhl';
  k=sent.length; await beep(221397,'hyp Moo deep session Quick',300); await wait(7000);
  const pd=pl()['bnbfarm-c-pat-melt'], lk=pl()['bnbfarm-c-leader-knees'];
  ok(pd && !pd.once && pd.until-Date.now()>6.9*86400000 && lk && lk.when==='leader', 'Deep: both kept a week, and they fire every time the dice say so');
  ok(hyp(k,500,'hangon').some(h=>h.until-Date.now()<=3600000+1000 && h.until-Date.now()>50*60000), '...the hang-on capped at an hour');
  // their herd leader walks in
  lk.rolled=0; lk.chance=0.1; Math.random=()=>0.05; k=sent.length; W.__addons('join',221397); Math.random=R; await wait(300);
  ok(hyp(k,500,'compel').some(c=>c.when==='leader' && c.by===221397), 'their herd leader walks in: one of their compulsions answers (a 10% chance, and this time it did)');
  pd.until=Date.now()+86400000; ext(500,'hypnoEvent',{ev:'fired',id:'bnbfarm-c-pat-melt',resisted:false}); await wait(200);
  ok(pl()['bnbfarm-c-pat-melt'] && pl()['bnbfarm-c-pat-melt'].until-Date.now()>6.9*86400000, 'it lands again: renewed for another week');
  ext(500,'hypnoEvent',{ev:'fired',id:'bnbfarm-c-leader-knees',resisted:true}); await wait(200);
  ok(pl()['bnbfarm-c-leader-knees'].fought===1, '...fought off: counted, not renewed');
  // never while somethin' else has them, or they're in a session
  lk.rolled=0; Math.random=()=>0.01; k=sent.length; L().people['500'].quietUntil=Date.now()+60000; W.__addons('join',221397); Math.random=R; await wait(200);
  ok(!hyp(k,500,'compel').length, 'on ?quiet: nothin\' reaches in');
  L().people['500'].quietUntil=0;

  // ── No human left: set for good, and theirs only to ask their herd leader about ──
  k=sent.length; await beep(221397,'hyp Moo nhl session Quick',300); await wait(7000);
  ok(pl()['bnbfarm-c-pat-melt'].perm && pl()['bnbfarm-c-pat-melt'].until===null && pl()['bnbfarm-c-leader-knees'].perm, 'No human left: set for good');
  k=sent.length; await beep(500,'planted',800);
  ok(/Pat Melt: when somebody pats their head, 30% of the time → Assume Pose, Their Sound · a compulsion/.test(words(k,500)) && /set for good/.test(words(k,500)), '?planted shows the compulsions and how long they stay: '+words(k,500).slice(0,200));
  k=sent.length; await beep(500,'planted remove pat melt',800);
  ok(/set for good/.test(words(k,500)) && pl()['bnbfarm-c-pat-melt'], 'they can\'t take one set for good out themselves');
  k=sent.length; await beep(221397,'planted remove pat melt Moo',800);
  ok(/Taken out: 1/.test(words(k,221397)) && !pl()['bnbfarm-c-pat-melt'], 'their herd leader can');
  // a Fun session doesn't make what's set for good fade
  k=sent.length; await beep(221397,'hyp Moo fun session Quick',300); await wait(6000);
  ok(pl()['bnbfarm-c-leader-knees'].perm, 'a lighter session later never makes what\'s set for good fade');

  // ── fadin': gone from the farm, and from their LSCG the next time they're under in the farm's name ──
  const all=pl(); all['bnbfarm-good-cow']={kind:'trigger',s:{id:'bnbfarm-good-cow',name:'B&B Good Cow',trigger:'good cow',instructions:[{type:'Speak Phrase',arguments:{config:'moo'}}]},block:'Good Cow',level:'fun',via:'lscg',ok:true,until:Date.now()-1,perm:false};
  P.fade();
  ok(!pl()['bnbfarm-good-cow'] && (L().mods.conditioning.people['500'].unplant||[]).some(s=>s.id==='bnbfarm-good-cow'), 'a day gone by with nothin\' settin\' it off: faded, and waitin\' to come out of their LSCG');
  k=sent.length; ext(500,'hypnoState',Object.assign({},lscg,{under:true,ours:true})); await wait(500);
  const b=lscgBeeps(k,500)[0], rm=b&&b.Message.command.args.find(a=>a.name==='removed');
  ok(rm && rm.value.some(s=>s.id==='bnbfarm-good-cow') && !(L().mods.conditioning.people['500'].unplant||[]).length, 'under in the farm\'s name: taken out of their LSCG the way it went in');
  ok(!warns.some(w=>/conditioning|hypno|compel/i.test(w)), 'no add-on errors: '+warns.filter(w=>/conditioning|hypno|compel/i.test(w)).join(' | ').slice(0,200));
  out(fails ? 'FAIL '+fails : 'ALL OK'); process.exit(fails?1:0);
})();
