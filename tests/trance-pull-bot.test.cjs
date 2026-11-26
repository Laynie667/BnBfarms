// THE FARM'S TRANCE, PART 2, the bot's side (Nov 25, Conditioning 2.1; Laynie: "build part 2"). The library's new kinds (slip,
// nudge) and the farm's own LSCG instructions (moo, stall, beg, dose); the farm's pull through the day: nudges, what feeds
// it, the top (the farm takes them down), ?hypno off and the safeword lettin' go; "go to a free milkin' stall" (stalls are
// shared, Laynie, Nov 25); staff see it on the map; and no more ECHS offers for anybody with LSCG set up for the farm.
const fs=require('fs'), path=require('path'), { pathToFileURL }=require('url');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,hypno:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"pony",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],hypno:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{milking1:{X:8,Y:8},milking2:{X:6,Y:6}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,20,20),at(500,5,5),at(600,6,6)];
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
const FAST=`=== induction: Quick Down
pace: 1s

Hear my voice, {name}.

=== wake: Quick Up
pace: 1s

Up you come, {name}.

=== session: Quick
induction: any
wake: any

=== slip: Plain
{sound}~

=== slip: Deeper Slips
pull: 60

Good {animal}s give milk.

=== slip: Only Deep
level: deep, nhl
pull: 40

Nothin' up here but straw…

=== nudge: Whispers

Good {animal}s don't need to think, {name}.
`;
(async()=>{
  // ── the library's new kinds, and the farm's own instructions in "does" ──
  const T=await import(pathToFileURL(path.join(__dirname,'../shared/trance-script.js')).href);
  const S=await import(pathToFileURL(path.join(__dirname,'../shared/trance-starter.js')).href);
  const st=(s)=>T.parseStep(s);
  ok(st('moo 2').type==='bnbfarm.sound' && st('moo 2').arguments.options.times===2 && !!st('moo 5').error, 'moo [1-3]: their sound, out loud, as the farm\'s own LSCG instruction');
  ok(st('stall').type==='bnbfarm.stall' && st('go to a free milking stall').type==='bnbfarm.stall', 'stall: walk to a free milkin\' stall');
  ok(st('beg "{sound}… milk me"').type==='bnbfarm.beg' && st('beg "{sound}… milk me"').arguments.options.words==='{sound}… milk me' && !!st('beg "(no)"').error, 'beg ["words"]: beg to be milked (no round brackets)');
  const d=st('dose needy nectar double');
  ok(d.type==='farmhand-dispensary.dose' && d.arguments.options.dose==='needy nectar' && d.arguments.options.strength==='double', 'dose <name> [half|double]: the Dispensary\'s');
  const lb=T.parseLibrary('=== slip: S\npull: 40\n\n{sound}~\n\n=== nudge: N\n\nHi {name}.\n\n=== induction: I\npull: 20\n\nHi.\n\n=== session: X\ninduction: any\nslip: any\n');
  ok(lb.blocks[0].kind==='slip' && lb.blocks[0].labels.pull===40 && lb.blocks[1].kind==='nudge' && !lb.errors.length, 'slip and nudge blocks, with how far the pull has to be (pull: 40)');
  ok(lb.warnings.some(w=>/pull only means/.test(w.msg)) && lb.warnings.some(w=>/a session only lists blocks/.test(w.msg)) && !T.SESSION_KINDS.includes('slip'), '...pull only on those, and a session never lists them');
  ok(/^pull: 40$/m.test(T.formatBlock(lb.blocks[0])), '...and the studio writes it back the same');
  const sl=T.parseLibrary(S.STARTER), stalls=sl.blocks.find(b=>b.name==='To the Stalls');
  ok(!sl.errors.length && sl.blocks.filter(b=>b.kind==='slip').length>=4 && sl.blocks.filter(b=>b.kind==='nudge').length>=3 && stalls && /moo → beg/.test(stalls.labels.does), 'the starter library: slips, nudges, and a trigger made of the farm\'s own (To the Stalls)');
  const sg=T.lscgSuggestion(stalls,{words:{sound:'moo'},low:'kneel',by:260239});
  ok(sg.instructions.map(i=>i.type).join()==='bnbfarm.sound,bnbfarm.beg' && sg.instructions[1].delay===2000, '...planted as an LSCG suggestion with the farm\'s instructions in it');

  await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2;
  chars[1].Name='Laynie'; chars[2].Name='Moo'; chars[3].Name='Hana'; chars[0].Name='Farmhand';
  L().mods=L().mods||{}; L().mods.conditioning={people:{"500":{max:"deep",sessions:{fun:0,deep:0,nhl:0},total:0,tier:0}}, lib:{text:FAST,stamp:'t1',at:Date.now()}};
  eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-conditioning.user.js'),'utf8')); await wait(300);
  const P=W.__condPull, pull=()=>L().mods.conditioning.people['500'].pull;
  ext(500,'hello',{ver:'0.82.0'}); ext(600,'hello',{ver:'0.82.0'}); ext(221397,'hello',{ver:'0.82.0'}); await wait(1500);
  const lscg={lscg:true,ver:'0.9.12',on:true,sugg:true,needHyp:true,mins:5,beats:true,scopes:['hypno','states'],under:false,ours:false,farmBeats:false,planted:[]};

  // ── their Companion is told how far the pull is, their sound, their herd leader, and the slips ──
  let k=sent.length; ext(500,'hypnoState',lscg); await wait(300);
  const p0=hyp(k,500,'pull')[0];
  ok(p0 && p0.species==='cow' && Array.isArray(p0.tone) && !p0.tone.length && p0.body && typeof p0.body.tits==='boolean', '...and their kind, their body and their tones, for a visor\'s lines (Nov 25): '+JSON.stringify(p0&&{species:p0.species,tone:p0.tone,body:p0.body}));
  ok(p0 && p0.n===0 && p0.sound==='moo' && p0.animal==='cow' && p0.herd===221397,'a Companion comes: told the pull (0), their sound, their kind and their herd leader: '+JSON.stringify(p0||{}).slice(0,120));
  const ts=(p0&&p0.slips||[]).map(x=>x.t+'@'+x.p);
  ok(ts.includes('Moo~@0') && ts.includes('Good cows give milk.@60') && ts.includes('Nothin\' up here but straw…@40'), '...and the library\'s slips, filled in for them, each with how far the pull has to be: '+ts.join(' · '));

  // ── nudges: only while they're about, not away from the keys ──
  P.tick(); pull().next=Date.now()-1; k=sent.length; P.tick(); await wait(200);
  ok(!hyp(k,500,'nudge').length, 'away from the keys (they haven\'t said a thing): no nudges');
  const chat=async(mn,t)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Chat',Content:t}); await wait(300); };
  await chat(500,'mm, the barn\'s warm today');
  pull().next=Date.now()-1; k=sent.length; P.tick(); await wait(300);
  const n1=hyp(k,500,'nudge')[0];
  ok(n1 && ['haze','voice'].includes(n1.fx) && n1.n>=2 && n1.n<=4 && pull().n===n1.n, 'about now: a nudge (a breath of haze or a whisper; no blur or spiral this early), and the pull builds: '+JSON.stringify(n1||{}));
  ok(pull().next-Date.now()>=4*60000-2000 && pull().next-Date.now()<=9*60000+2000, '...the next one in 4 to 9 minutes');
  let voiced=null; for (let i=0;i<30&&!voiced;i++){ k=sent.length; P.nudge(500); await wait(30); const n=hyp(k,500,'nudge')[0]; if (n&&n.fx==='voice') voiced=n; }
  ok(voiced && voiced.text==='Good cows don\'t need to think, Moo.', 'a whisper: one of the library\'s nudges, in the farm\'s voice, filled in for them: '+(voiced&&voiced.text));
  // switched off in their Companion
  ext(500,'hypnoState',Object.assign({},lscg,{pullOff:true})); await wait(200);
  pull().next=Date.now()-1; k=sent.length; P.tick(); await wait(200);
  ok(!hyp(k,500,'nudge').length, 'they switched "The farm\'s pull" off: no nudges');
  ext(500,'hypnoState',lscg); await wait(200);

  // ── what feeds it ──
  pull().n=10; ext(500,'hypnoEvent',{ev:'resolved',name:'B&B Milking Time',resisted:false}); await wait(200);
  ok(pull().n===15, 'one of the farm\'s triggers lands: +5 ('+pull().n+')');
  ext(500,'hypnoEvent',{ev:'resolved',name:'B&B Milking Time',resisted:true}); await wait(200);
  ok(pull().n===15, '...fought off: nothin\'');
  W.__addons('milked',500,400); await wait(100);
  ok(pull().n===18, 'a milkin\': +3 ('+pull().n+')');
  k=sent.length; pull().n=19; W.__addons('milked',500,400); await wait(200);
  ok(hyp(k,500,'pull').some(m=>m.n===22) && !hyp(k,500,'pull').some(m=>m.slips), 'past every ten: their Companion\'s told (and the slips aren\'t sent again)');
  k=sent.length; await beep(500,'trance',800);
  ok(/the farm's pull 22%/.test(words(k,500)), '?trance shows it: '+words(k,500).slice(0,140));
  // staff see it over them on the map
  pull().n=65;
  const herd=(W.__stateFor(221397).herd||[]).find(x=>x.mn===500);
  ok(herd && herd.pull===65, 'staff\'s map: Moo\'s pull, for the T over them ('+JSON.stringify(herd||{}).slice(0,90)+')');

  // ── "go to a free milkin' stall" (the farm's own LSCG instruction, carried out by their game) ──
  k=sent.length; ext(500,'hypnoDo',{what:'stall',by:221397}); await wait(400);
  const led=toExt(k,500,'lead')[0], tp=sent.slice(k).find(([e,d])=>d&&d.Content==='ChatRoomMapViewTeleport'&&d.Target===500);
  const to=led?{X:led.X,Y:led.Y}:tp?tp[1].Dictionary[0].Position:null;
  ok(to && to.X===8 && to.Y===8, 'walked to the nearest stall nobody\'s standin\' in (Hana has the closer one): '+JSON.stringify(to));
  k=sent.length; ext(500,'hypnoDo',{what:'stall'}); await wait(300);
  ok(!toExt(k,500,'lead').length, '...not twice in a row');

  // ── the top: they drop under on their own, and the farm takes them down ──
  pull().n=98; k=sent.length; P.add(500,5); await wait(400);
  const u=hyp(k,500,'under')[0];
  ok(u && u.by===260239 && u.level==='deep', 'at 100: the farm takes them down, a session at the deepest they allow: '+JSON.stringify(u||{}).slice(0,100));
  ok(/drop right where you are/.test(words(k,500)) && /dropped under on their own/.test(words(k,221397)), '...they\'re told, and so is their herd leader');
  await wait(4500);
  ok(pull().n===20 && hyp(k,500,'pull').some(m=>m.n===20), 'the session over: the pull starts again from 20 ('+pull().n+')');
  // a session they asked for feeds it, never right to the top
  pull().n=85; k=sent.length; await beep(500,'hyp me deep',300); await wait(4500);
  ok(pull().n===90 && !hyp(k,500,'under').slice(1).length, 'a session they asked for: +8, never past 90 ('+pull().n+')');

  // ── ?hypno off, and the safeword, let go of it ──
  pull().n=50; k=sent.length; await beep(500,'hypno off',800);
  ok(pull().n===0 && hyp(k,500,'pull').some(m=>m.n===0), '?hypno off: the pull lets go of them');
  await beep(500,'hypno on',800);
  pull().n=40; k=sent.length; W.__addons('safe',500); await wait(300);
  ok(pull().n===0 && hyp(k,500,'clear').length && hyp(k,500,'pull').some(m=>m.n===0), 'the safeword: all of it lets go');
  // away from the farm it ebbs (ten an hour)
  pull().n=30; pull().at=Date.now()-3*3600000; const keep=chars.splice(2,1)[0]; P.tick(); chars.splice(2,0,keep);
  ok(pull().n===0, 'three hours away: it\'s ebbed away ('+pull().n+')');

  // ── ECHS: no more reachin' for anybody with LSCG set up for the farm ──
  cfg.ECHS_ON=true; cfg.ECHS_OFFER_EVERY_MIN=1;
  await chat(600,'hi all'); await chat(500,'moo');
  W.__st().echsTickAt=0; k=sent.length; W.__echsTick(); await wait(300);
  if (!sent.slice(k).some(([e,d])=>d&&d.Type==='Hidden'&&d.Target===600)) out('(echs: '+JSON.stringify({hs600:W.__st().hypnoState&&W.__st().hypnoState.get(600)||null, echs600:L().people['600'].echs||null, on:cfg.ECHS_ON, every:cfg.ECHS_OFFER_EVERY_MIN})+')');
  const asked=(mn)=>sent.slice(k).some(([e,d])=>d&&d.Type==='Hidden'&&d.Target===mn&&Array.isArray(d.Dictionary)&&d.Dictionary[0]&&d.Dictionary[0].message&&/session-/.test(d.Dictionary[0].message.type));
  ok(!asked(500) && asked(600), 'the farm girl\'s ECHS offers skip Moo (LSCG set up for the farm) and reach Hana (no LSCG)');
  ok(!warns.some(w=>/conditioning|hypno|pull/i.test(w)), 'no add-on errors: '+warns.filter(w=>/conditioning|hypno|pull/i.test(w)).join(' | ').slice(0,200));
  out(fails ? 'FAIL '+fails : 'ALL OK'); process.exit(fails?1:0);
})();
