// Nov 20 (Laynie: "I noticed that traps are not triggering like they should, and danger drought doesn't seem to work on
// the trigger chances the way it should"): the heartbeat only looked every 20 seconds, so a trap only had you if you were
// stood on it that moment. Now it looks the moment the game says you moved. The Danger Draught reaches every chancy trap,
// shortens the breather and the reset. And ?trap why says what's holdin' them back (the tiles stay hidden).
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",trapsOn:true,breedable:true,fertile:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"),
 "600":S(600,"Bea",{trapsOn:false})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"trap-snare":{X:20,Y:10},"trap-gas":{X:24,Y:10},"pond":{X:30,Y:10},"pasture":{X:40,Y:40}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const moo=at(500,10,10), bea=at(600,12,12);
const chars=[at(260239,1,1),at(221397,2,2),moo,bea];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]}, ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1200); };
// the game sayin' somebody moved (it has already put them there)
const move=(c,X,Y)=>{ c.MapData.Pos={X,Y}; handlers.ChatRoomSyncMapData({MemberNumber:c.MemberNumber,MapData:{Pos:{X,Y}}}); };
const sprung=()=>(P(500).trapLog||[]).length;
const done=async()=>{ for(let i=0;i<80;i++){ await wait(100); if(!(W.__st().trapRuns&&W.__st().trapRuns.has(500))) break; } await wait(300); };
const fresh=()=>{ const r=P(500); r.trapAt=0; r.spotTrapAt={}; r.penned=null; r.gear=null; r.trapWait=null; r.packAt=0; r.fx={}; W.__st().trapAt=new Map(); };
const whispers=(n)=>sent.slice(n).filter(([e,d])=>e==='ChatRoomChat'&&d&&d.Type==='Whisper'&&d.Target===500).map(([,d])=>String(d.Content));
const reply=(n,mn)=>sent.slice(n).filter(([e,d])=>e==='ChatRoomChat'&&d&&d.Type==='Whisper'&&d.Target===mn).map(([,d])=>String(d.Content)).join('\n');
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2; cfg.TRAP_BEAT_S=0.05; cfg.CHAIN_CHANCE=0; cfg.TENTACLE_CHANCE=1;
  chars[1].Name='Laynie'; moo.Name='Moo'; bea.Name='Bea'; await say(500,'?stats',600);
  ok(typeof handlers.ChatRoomSyncMapData==='function', 'the farm girl listens for people movin\' on the map');

  // ── the moment they step on it: no heartbeat needed ──
  fresh(); let n0=sprung();
  move(moo,19,10); move(moo,20,10); await done();
  ok(sprung()===n0+1, 'steppin\' onto a trap springs it right then, without waitin\' for the 20-second look');
  // crossin' it on a walk: seen on the tile as they pass, it has them
  fresh(); n0=sprung(); move(moo,23,10); move(moo,24,10); move(moo,25,10); await done();
  ok(sprung()===n0+1, 'seen crossin\' a trap on a walk: it has them');
  // beside it, or somebody with their traps off, on it: nothin'
  fresh(); n0=sprung(); move(moo,21,11); move(moo,19,9); await wait(300);
  ok(sprung()===n0, 'walkin\' beside a trap tile: nothin\'');
  const b0=(P(600).trapLog||[]).length; move(bea,20,10); await wait(400);
  ok((P(600).trapLog||[]).length===b0, 'somebody with traps off walks right over it');
  // one visit, one go: standin' there, more moves on the same tile don't spring it twice
  fresh(); n0=sprung(); move(moo,20,10); await done(); P(500).trapAt=0; move(moo,20,10); move(moo,20,10); await wait(300);
  ok(sprung()===n0+1, 'still stood on it: it waits for them to step off and back on');

  // ── the Danger Draught ──
  fresh(); n0=sprung(); move(moo,20,10); await done();
  let n=sent.length; await say(500,'?trap why',900);
  let t=reply(n,500);
  ok(/Breather: [23]:\d\d left/.test(t), 'no Danger Draught: the breather is three minutes ('+(t.match(/Breather[^\n]*/)||[''])[0]+')');
  fresh(); P(500).fx={danger:{until:Date.now()+3600000,x:1}}; move(moo,19,10); move(moo,20,10); await done();
  n=sent.length; await say(500,'?trap why',900); t=reply(n,500);
  ok(/Breather: [12]:\d\d left/.test(t) && !/Breather: 2:[1-5]\d/.test(t), 'a Danger Draught: two minutes ('+(t.match(/Breather[^\n]*/)||[''])[0]+')');
  if (process.env.SHOW) out('=== DANGER WHY ===\n'+t);
  ok(/Danger Draught/.test(t), '...and ?trap why says it\'s in them');
  ok(/1 trap that had you lately won't take you again yet: it's ready in (9|10):\d\d\./.test(t) && !/[()\[\]]/.test((t.match(/1 trap[^\n]*/)||['('])[0]),'...a tile resets in ten minutes, not fifteen, and no brackets in it ('+(t.match(/1 trap[^\n]*/)||[''])[0]+')');
  // "not for me": lets them by less
  const r=P(500); r.trapRate={snare:['no','no']};
  let by=0, byD=0; const RUNS=400;
  r.fx={}; for(let i=0;i<RUNS;i++) if(W.__rateLetsBy(500,'snare')) by++;
  r.fx={danger:{until:Date.now()+3600000,x:1}}; for(let i=0;i<RUNS;i++) if(W.__rateLetsBy(500,'snare')) byD++;
  ok(by>RUNS*0.65 && byD<RUNS*0.72 && byD<by, 'a trap they said no to twice lets them by about 3 in 4, and less with a Danger Draught ('+by+' vs '+byD+' of '+RUNS+')');
  r.trapRate={}; r.fx={};

  // ── ?trap why: the tiles stay hidden ──
  await done(); await wait(1500);
  fresh(); P(500).trapAt=Date.now(); move(moo,24,10); await wait(300); n=sent.length; await say(500,'?trap why',2500); t=reply(n,500);   // (in the breather: stood on the gas trap, it doesn't spring)
  if (process.env.SHOW) out('=== OWN WHY ===\n'+t);
  ok(/What's holdin' the traps back for you/.test(t) && !/trap-gas|trap-snare|Stood on/.test(t), 'a player\'s own ?trap why never names a tile, or says they\'re on one');
  P(500).limits='gas, mud'; n=sent.length; await say(500,'?trap why',900); t=reply(n,500);
  ok(/Ruled out for you: .*your limits: [^·]*gas/.test(t) && /mud/.test(t), '...it says which kinds their limits rule out ('+(t.match(/🙅[^\n]*/)||[''])[0].slice(0,120)+')');
  P(500).limits='';
  ok(/The water: (\d+%|certain) each time you wade in/.test(t), '...and the water\'s odds');
  n=sent.length; await say(600,'?trap why',900);
  ok(/Traps are off: \?traps on/.test(reply(n,600)), 'with traps off: says so, and how to switch them on');
  n=sent.length; await say(600,'?trap why Moo',900);
  ok(/your own traps/.test(reply(n,600)), 'a player can\'t ask about somebody else');
  n=sent.length; await say(221397,'?trap why Moo',900); t=reply(n,221397);
  ok(/What's holdin' the traps back for Moo/.test(t) && /Stood on trap-gas now/.test(t), 'staff askin\' about somebody: the tile they\'re stood on too ('+(t.match(/📍[^\n]*/)||[''])[0]+')');

  ok(!warns.some(w=>/trap|move/i.test(w)), 'no errors: '+warns.filter(w=>/trap|move/i.test(w)).slice(0,2).join(' | '));
  out(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
})();
